// Negocios: administración de recursos (pedido de Mario, 2026-10-10).
// Lógica pura, sin interfaz, para poder probarla en Node. La pantalla está en ui/negocios-ui.js.
//
// Un negocio (rancho, taller, puesto…) lo define el contenido en `ventures` (docs/CONTENIDO.md §13).
// El jugador entra como socio, reparte el esfuerzo entre sus líneas de producción, compra mejoras,
// pone a trabajar a Pokémon del PC, elige encargado y pasa a recoger lo que se acumula en tiempo real.
// Lo que no se recoge se pierde cuando el almacén se llena: hay que pasar a verlo.
import { G, evalCond, addItem, setPath, boxInsert } from './state.js';
import { C } from './content.js';
import { D, toID } from './data.js';
import { addHappy } from './pokemon.js';

export const DAY = 86400e3;
const ok = c => { try { return c === undefined || evalCond(c); } catch (e) { return false; } };
const first = (list, fallback = null) => (list || []).find(x => ok(x.cond)) || fallback;

export const ventureDef = id => C.ventures?.[id];
export function ventureState(id) { return (G.neg ||= {})[id] || null; }
export const owned = id => !!ventureState(id)?.owned;

/** Negocios visibles: los tuyos y las oportunidades cuya condición ya se cumple. */
export function ventureList() {
	const out = [];
	for (const id in C.ventures || {}) {
		const def = C.ventures[id];
		if (owned(id)) out.push({ id, def, st: ventureState(id), status: 'owned' });
		else if (ok(def.cond)) out.push({ id, def, st: null, status: 'offer' });
	}
	return out;
}

/** Líneas de producción disponibles ahora (las que no están bloqueadas por condición o por una mejora). */
export function linesOf(id) {
	const def = ventureDef(id), st = ventureState(id) || {};
	const out = {};
	for (const k in def.lines || {}) {
		const ln = def.lines[k];
		if (!ok(ln.cond)) continue;
		if (ln.locked && !(def.upgrades || []).some(u => u.unlock === k && st.ups?.[u.id])) continue;
		out[k] = ln;
	}
	return out;
}

function normEffort(id) {
	const st = ventureState(id), keys = Object.keys(linesOf(id));
	st.effort ||= {};
	for (const k in st.effort) if (!keys.includes(k)) delete st.effort[k];
	let sum = keys.reduce((a, k) => a + (st.effort[k] || 0), 0);
	if (!keys.length) return;
	if (sum <= 0) { const each = Math.floor(10 / keys.length) * 10; keys.forEach(k => { st.effort[k] = each; }); sum = each * keys.length; }
	// lo que falte o sobre hasta 100 va a la primera línea
	if (sum !== 100) st.effort[keys[0]] = Math.max(0, (st.effort[keys[0]] || 0) + 100 - sum);
}

/** Entra en el negocio (paga la entrada). Devuelve { ok, msg }. */
export function joinVenture(id) {
	const def = ventureDef(id);
	if (!def || owned(id)) return { ok: false, msg: 'No disponible.' };
	const cost = def.buy?.cost || 0;
	if (G.player.money < cost) return { ok: false, msg: 'No te alcanza.' };
	G.player.money -= cost;
	(G.neg ||= {})[id] = { owned: true, since: Date.now(), last: Date.now(), fill: 0, bank: { money: 0, items: {} }, frac: {}, effort: {}, ups: {}, workers: [], manager: null, boosts: [], lastEvent: Date.now(), pending: null, earned: 0, spent: cost, log: [] };
	normEffort(id);
	const m = managersOf(id)[0];
	if (m) G.neg[id].manager = m.id;
	for (const k in def.buy?.set || {}) setPath(k, def.buy.set[k]);
	return { ok: true };
}

export function upgradesOf(id) {
	const def = ventureDef(id), st = ventureState(id) || { ups: {} };
	return (def.upgrades || []).map(u => ({
		...u, bought: !!st.ups?.[u.id],
		available: ok(u.cond) && (u.need || []).every(n => st.ups?.[n]),
		hidden: u.hidden !== undefined && ok(u.hidden),
	})).filter(u => !u.hidden);
}
export function managersOf(id) {
	const def = ventureDef(id);
	return (def.managers || []).filter(m => ok(m.cond)).map(m => ({ ...m, id: m.id || m.npc, name: m.name || C.npcs[m.npc]?.name || m.npc }));
}
export function slotsOf(id) {
	const def = ventureDef(id), st = ventureState(id) || { ups: {} };
	return (def.jobs?.slots || 0) + (def.upgrades || []).reduce((a, u) => a + (st.ups?.[u.id] ? (u.slots || 0) : 0), 0);
}
export function storeDays(id) {
	const def = ventureDef(id), st = ventureState(id) || { ups: {} };
	return (def.store || 3) + (def.upgrades || []).reduce((a, u) => a + (st.ups?.[u.id] ? (u.store || 0) : 0), 0);
}
export function sharePct(id) {
	const def = ventureDef(id), st = ventureState(id) || { ups: {} };
	const base = first(def.share, { pct: 100 }).pct;
	return Math.min(100, base + (def.upgrades || []).reduce((a, u) => a + (st.ups?.[u.id] ? (u.share || 0) : 0), 0));
}

/** Cuánto aporta un Pokémon que trabaja aquí (0.06–0.30) y por qué. */
export function workerBonus(id, p) {
	const def = ventureDef(id), jobs = def.jobs || {};
	const types = D.species[p.sp]?.types || [];
	const typed = (jobs.types || []).some(t => types.includes(t));
	// favs vale para toda la línea: { mareep: 0.1 } también cuenta para Flaaffy y Ampharos (gana la entrada más cercana)
	let fav = 0;
	for (let i = 0, id = p.sp; i < 4 && id; i++, id = D.species[id]?.prevo) if (jobs.favs?.[id] !== undefined) { fav = jobs.favs[id]; break; }
	const v = 0.06 + 0.06 * Math.min(100, p.lv) / 100 + (typed ? 0.08 : 0) + fav;
	return { v, typed, fav: fav > 0 };
}

/** Producción por día con la configuración actual, con el desglose para enseñarlo. */
export function rates(id) {
	const def = ventureDef(id), st = ventureState(id);
	const lines = linesOf(id);
	const mult = { all: 1 }, why = [];
	const addMult = (m, label) => { if (!m) return; for (const k in m) mult[k] = (mult[k] || 1) * m[k]; why.push({ label, m }); };
	for (const u of def.upgrades || []) if (st.ups?.[u.id]) addMult(u.mult, u.name);
	const mgr = managersOf(id).find(m => m.id === st.manager);
	if (mgr) addMult(mgr.mult, 'Encargad@: ' + mgr.name);
	let wb = 0;
	for (const p of st.workers || []) wb += workerBonus(id, p).v;
	if (wb) addMult({ all: 1 + wb }, `Pokémon trabajando (+${Math.round(wb * 100)} %)`);
	const t = Date.now();
	for (const b of st.boosts || []) if (b.until > t) addMult(b.mult, b.label || 'Racha');
	let gross = 0;
	const items = {}, perLine = {};
	for (const k in lines) {
		const ln = lines[k], eff = (st.effort?.[k] || 0) / 100, m = mult.all * (mult[k] || 1);
		const money = (ln.money || 0) * eff * m;
		gross += money;
		const its = (ln.items || []).filter(i => ok(i.cond)).map(i => ({ id: toID(i.id), perDay: i.perDay * eff * m }));
		for (const i of its) items[i.id] = (items[i.id] || 0) + i.perDay;
		perLine[k] = { money, items: its, pct: st.effort?.[k] || 0 };
	}
	const upkeep = Math.max(0, (def.upkeep || 0) + (def.upgrades || []).reduce((a, u) => a + (st.ups?.[u.id] ? (u.upkeep || 0) : 0), 0) + (mgr?.wage || 0));
	const pct = sharePct(id);
	const profit = Math.max(0, gross - upkeep);
	return { perLine, gross, upkeep, profit, pct, money: profit * pct / 100, items, why, red: gross < upkeep };
}

/** Acumula lo producido desde la última vez (hasta llenar el almacén). */
export function tick(id, t = Date.now()) {
	const st = ventureState(id);
	if (!st?.owned) return;
	const cap = storeDays(id);
	const dt = Math.max(0, (t - (st.last || t)) / DAY);
	const use = Math.max(0, Math.min(dt, cap - (st.fill || 0)));
	st.last = t;
	if (use <= 0) return;
	const r = rates(id);
	st.fill = (st.fill || 0) + use;
	st.bank.money += r.money * use;
	for (const k in r.items) {
		const v = (st.frac[k] || 0) + r.items[k] * use;
		const whole = Math.floor(v + 1e-9);
		st.frac[k] = v - whole;
		if (whole > 0) st.bank.items[k] = (st.bank.items[k] || 0) + whole;
	}
	// Los Pokémon que trabajan aquí se encariñan con el sitio (y contigo): hasta 20 puntos de amistad por día
	st.hfrac = (st.hfrac || 0) + use * 20;
	const hearts = Math.floor(st.hfrac);
	if (hearts > 0) { st.hfrac -= hearts; for (const p of st.workers || []) addHappy(p, Math.min(60, hearts)); }
	st.boosts = (st.boosts || []).filter(b => b.until > t);
}

/** Lo que hay para recoger ahora mismo. */
export function pending(id) {
	tick(id);
	const st = ventureState(id);
	return { money: Math.floor(st.bank.money), items: { ...st.bank.items }, full: (st.fill || 0) >= storeDays(id) - 1e-6, fill: st.fill || 0, cap: storeDays(id) };
}
export function collect(id) {
	const p = pending(id), st = ventureState(id);
	if (!p.money && !Object.keys(p.items).length) return null;
	G.player.money += p.money;
	st.earned = (st.earned || 0) + p.money;
	for (const k in p.items) addItem(k, p.items[k]);
	st.bank = { money: st.bank.money - p.money, items: {} };
	st.fill = 0;
	logVenture(id, `Recogiste ₽${p.money.toLocaleString('es-MX')}` + (Object.keys(p.items).length ? ' y ' + Object.entries(p.items).map(([k, n]) => `${D.items[k]?.name || k} ×${n}`).join(', ') : ''));
	return p;
}
export function logVenture(id, text) {
	const st = ventureState(id);
	(st.log ||= []).unshift({ t: Date.now(), text });
	st.log.length = Math.min(st.log.length, 12);
}

/** Cambia el esfuerzo de una línea en pasos de 10 quitándoselo a (o dándoselo a) las demás. */
export function shiftEffort(id, line, delta) {
	tick(id);
	const st = ventureState(id), keys = Object.keys(linesOf(id));
	if (keys.length < 2 || !keys.includes(line)) return false;
	normEffort(id);
	let d = Math.max(-st.effort[line], Math.min(100 - st.effort[line], delta));
	if (!d) return false;
	st.effort[line] += d;
	// reparte la diferencia entre las otras, empezando por la que más (o menos) tiene
	const others = keys.filter(k => k !== line).sort((a, b) => d > 0 ? st.effort[b] - st.effort[a] : st.effort[a] - st.effort[b]);
	let left = -d, guard = 0;
	while (left !== 0 && guard++ < 100) {
		for (const k of others) {
			if (left === 0) break;
			const step = left > 0 ? 10 : -10;
			if (st.effort[k] + step < 0 || st.effort[k] + step > 100) continue;
			st.effort[k] += step; left -= step;
		}
	}
	normEffort(id);
	return true;
}

export function buyUpgrade(id, upId) {
	tick(id);
	const st = ventureState(id), u = upgradesOf(id).find(x => x.id === upId);
	if (!u || u.bought || !u.available) return { ok: false, msg: 'No disponible todavía.' };
	if (G.player.money < u.cost) return { ok: false, msg: 'No te alcanza.' };
	G.player.money -= u.cost;
	st.spent = (st.spent || 0) + u.cost;
	st.ups[u.id] = Date.now();
	for (const k in u.set || {}) setPath(k, u.set[k]);
	normEffort(id);
	logVenture(id, `Mejora: ${u.name}`);
	return { ok: true, upgrade: u };
}

export function setManager(id, mid) {
	tick(id);
	const st = ventureState(id);
	if (!managersOf(id).some(m => m.id === mid)) return false;
	st.manager = mid;
	logVenture(id, `Encargad@: ${managersOf(id).find(m => m.id === mid).name}`);
	return true;
}

/** Manda a trabajar a un Pokémon del equipo o de una caja. src: { where: 'party'|'box', box, idx } */
export function assignWorker(id, src) {
	tick(id);
	const st = ventureState(id);
	if ((st.workers || []).length >= slotsOf(id)) return { ok: false, msg: 'No hay más puestos.' };
	const list = src.where === 'party' ? G.party : G.boxes[src.box];
	const p = list?.[src.idx];
	if (!p) return { ok: false, msg: 'No encontrado.' };
	if (src.where === 'party' && G.party.length <= 1) return { ok: false, msg: 'Necesitas al menos un Pokémon en el equipo.' };
	if (p.uid === G.vars.riolu_uid) return { ok: false, msg: 'Tu compañero no se separa de ti.' };
	list.splice(src.idx, 1);
	p.hp = Math.max(p.hp, 1);
	(st.workers ||= []).push(p);
	return { ok: true, mon: p };
}
/** Trae de vuelta a un Pokémon: al equipo si hay sitio, o al PC. Devuelve dónde quedó. */
export function recallWorker(id, idx) {
	tick(id);
	const st = ventureState(id);
	const [p] = (st.workers || []).splice(idx, 1);
	if (!p) return null;
	if (G.party.length < 6) { G.party.push(p); return { mon: p, where: 'party' }; }
	return { mon: p, where: 'box', box: boxInsert(G, p) };
}
/** Todos los Pokémon que están trabajando (para que «owns» y la Pokédex los cuenten). */
export function allWorkers(g = G) {
	const out = [];
	for (const id in g?.neg || {}) for (const p of g.neg[id].workers || []) out.push({ p, venture: id });
	return out;
}

// ---------- Imprevistos ----------
/** Un imprevisto como mucho por día real y por negocio; se queda pendiente hasta que decidas. */
export function rollEvent(id, rnd = Math.random) {
	const def = ventureDef(id), st = ventureState(id);
	if (!st?.owned) return null;
	if (st.pending) return (def.events || []).find(e => e.id === st.pending) || (st.pending = null);
	const t = Date.now();
	if (t - (st.lastEvent || st.since) < 20 * 3600e3) return null;
	const pool = (def.events || []).filter(e => ok(e.cond) && !(e.once && st.seen?.[e.id]));
	if (!pool.length) return null;
	st.lastEvent = t;
	if (rnd() > (def.eventRate ?? 0.7)) return null;
	const tot = pool.reduce((a, e) => a + (e.w || 1), 0);
	let r = rnd() * tot;
	const ev = pool.find(e => (r -= (e.w || 1)) < 0) || pool[0];
	st.pending = ev.id;
	(st.seen ||= {})[ev.id] = (st.seen[ev.id] || 0) + 1;
	return ev;
}
export function eventOptions(ev) { return (ev.options || []).filter(o => ok(o.cond)); }
/** Aplica la opción elegida. Devuelve { ok, msg } (msg = no te alcanza). */
export function resolveEvent(id, ev, opt) {
	const st = ventureState(id);
	const cost = opt.cost || 0;
	if (G.player.money < cost) return { ok: false, msg: 'No te alcanza.' };
	G.player.money -= cost;
	st.spent = (st.spent || 0) + cost;
	const e = opt.effect || {};
	if (e.money) st.bank.money = Math.max(0, st.bank.money + e.money);
	for (const it of e.items || []) st.bank.items[toID(it.id)] = (st.bank.items[toID(it.id)] || 0) + (it.n || 1);
	if (e.boost) (st.boosts ||= []).push({ mult: e.boost.mult, until: Date.now() + (e.boost.days || 1) * DAY, label: e.boost.label || ev.name || 'Racha' });
	for (const k in e.set || {}) setPath(k, e.set[k]);
	if (e.happy) for (const p of st.workers || []) addHappy(p, e.happy);
	st.pending = null;
	logVenture(id, (ev.name ? ev.name + ': ' : '') + (opt.log || opt.text));
	return { ok: true };
}

/** Resumen para el menú: cuántos negocios tienes y si alguno tiene algo que recoger o decidir. */
export function venturesSummary() {
	const list = ventureList();
	const mine = list.filter(v => v.status === 'owned');
	let ready = 0, money = 0;
	for (const v of mine) { const p = pending(v.id); money += p.money; if (p.full || v.st.pending) ready++; }
	return { mine: mine.length, offers: list.length - mine.length, ready, money };
}
