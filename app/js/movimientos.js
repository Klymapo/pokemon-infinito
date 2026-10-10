// Lógica del Tutor de movimientos (sin interfaz, para poder probarla en Node).
import { D, toID } from './data.js';
import { G, evalCond } from './state.js';
import { C, topLoc } from './content.js';
import { learnsetOf, canLearn } from './pokemon.js';

const mvName = id => D.moves[id]?.name || id;

/** Especie y sus preevoluciones, de la actual hacia atrás. */
export function speciesChain(sp) {
	const out = [];
	let id = toID(sp);
	for (let i = 0; i < 4 && id && D.species[id]; i++) { out.push(id); id = D.species[id].prevo; }
	return out;
}

/** Movimientos que puede recordar: por nivel hasta su nivel actual (y los de evolución), de su especie y sus preevoluciones. */
export function recallable(p) {
	const known = new Set(p.moves.map(m => m.id));
	const res = new Map();
	for (const sp of speciesChain(p.sp)) {
		const ls = learnsetOf(sp);
		if (!ls) continue;
		for (const [lv, m] of ls.lv) {
			if (lv > p.lv || known.has(m) || res.has(m) || !D.moves[m]) continue;
			res.set(m, { id: m, lv, from: sp === p.sp ? null : sp });
		}
	}
	// Primero los de evolución y los de nivel más alto (los más recientes suelen ser los mejores)
	return [...res.values()].sort((a, b) => (a.lv === 0 ? -1 : b.lv === 0 ? 1 : b.lv - a.lv) || mvName(a.id).localeCompare(mvName(b.id)));
}

/** Movimientos que aprenderá por nivel más adelante (su especie actual). */
export function upcoming(p) {
	const known = new Set(p.moves.map(m => m.id));
	const ls = learnsetOf(p.sp);
	if (!ls) return [];
	const seen = new Set();
	return ls.lv.filter(([lv, m]) => lv > p.lv && !known.has(m) && D.moves[m] && !seen.has(m) && seen.add(m)).map(([lv, m]) => ({ id: m, lv }));
}

/** MT que tienes en la mochila: moveId -> itemId */
export function ownedTMs() {
	const out = {};
	for (const id of Object.keys(G.bag)) { const tm = D.items[id]?.tm; if (tm && G.bag[id] > 0) out[toID(tm)] = id; }
	return out;
}
/** Todas las MT que existen en el juego: moveId -> itemId */
export function allTMs() {
	const out = {};
	for (const [id, it] of Object.entries(D.items)) if (it?.tm) out[toID(it.tm)] = id;
	return out;
}

export function owned() {
	const xs = G.party.map((p, i) => ({ p, where: 'Equipo' }));
	G.boxes.forEach((b, bi) => b.forEach(p => xs.push({ p, where: `Caja ${bi + 1}` })));
	return xs;
}

export function moveReport(moveId) {
	moveId = toID(moveId);
	const tms = ownedTMs(), all = allTMs();
	const has = [], recall = [], later = [], viaTM = [];
	for (const o of owned()) {
		const { p } = o;
		if (p.moves.some(m => m.id === moveId)) { has.push(o); continue; }
		const r = recallable(p).find(x => x.id === moveId);
		if (r) { recall.push({ ...o, r }); continue; }
		const u = upcoming(p).find(x => x.id === moveId);
		if (u) { later.push({ ...o, lv: u.lv }); continue; }
		if (all[moveId] && canLearn(p.sp, moveId)) viaTM.push({ ...o, haveTM: !!tms[moveId] });
	}
	// Otros de tu Pokédex que lo aprenden por nivel
	const mine = new Set(owned().map(o => o.p.sp));
	const dex = [];
	for (const num of Object.keys(G.dex.caught)) {
		const sp = D.byNum?.[num];
		if (!sp || mine.has(sp)) continue;
		const lv = learnsetOf(sp)?.lv.find(([, m]) => m === moveId);
		if (lv) dex.push({ sp, lv: lv[0] });
	}
	return { has, recall, later, viaTM, dex, tmItem: all[moveId] || null, haveTM: !!tms[moveId] };
}


// =================== Dónde se consigue un objeto (sin spoilers) ===================
// Solo nombra lugares que ya conoces; del resto dice cuántos hay. Las tiendas con condición
// (p. ej. «badges >= 5») salen como «más adelante» hasta que se cumple.
const knownLoc = id => { const t = topLoc(id); return !!(G.visited[id] || (t && G.visited[t.id])); };
const placeOf = id => { const t = topLoc(id); return t && t.id !== id ? t.name : C.locations[id]?.name || id; };

export function itemSources(itemId) {
	itemId = toID(itemId);
	const shops = [], gather = [], ground = [];
	let unknown = 0, story = false;
	const seen = new Set();
	const push = (arr, key, v) => { if (seen.has(key)) return; seen.add(key); arr.push(v); };
	for (const loc of Object.values(C.locations)) {
		const spots = [...(loc.spots || [])];
		if (loc.route) for (const n in loc.route.tramos || {}) for (const it of [].concat(loc.route.tramos[n] || [])) {
			if (it?.spot) spots.push(it.spot);
			if (it?.item === itemId) {
				if (!knownLoc(loc.id)) { unknown++; continue; }
				if (G.routeProg?.[loc.id]?.items?.[n + ':' + itemId]) continue; // ya lo recogiste
				push(ground, 'g' + loc.id + n, { place: loc.name, hidden: !!it.hidden });
			}
		}
		for (const sp of spots) {
			const a = sp?.action || {};
			if (a.shop && C.shops[a.shop]) {
				const e = (C.shops[a.shop].items || []).find(x => toID(typeof x === 'string' ? x : x.id) === itemId);
				if (e) {
					if (!knownLoc(loc.id)) { unknown++; continue; }
					const cond = typeof e === 'object' ? e.cond : undefined;
					push(shops, 's' + a.shop, { name: C.shops[a.shop].name, place: placeOf(loc.id), ok: cond === undefined || evalCond(cond), price: typeof e === 'object' ? e.price : undefined });
				}
			}
			const g = a.gather && C.gather[a.gather];
			if (g) {
				const e = (g.table || []).find(x => x.id === itemId);
				if (e) {
					if (!knownLoc(loc.id)) { unknown++; continue; }
					if (e.cond !== undefined && !evalCond(e.cond)) continue;
					push(gather, 'r' + a.gather + loc.id, { name: g.name, place: placeOf(loc.id), rare: (e.w || 0) <= 4 });
				}
			}
		}
	}
	const scan = list => { for (const c of list || []) { if (!c || typeof c !== 'object') continue; if (c.give && toID(c.give) === itemId) story = true; if (c.minigame && [...(c.minigame.guaranteed || []), ...(c.minigame.loot || []).map(e => e.id)].some(x => toID(x) === itemId)) story = true; for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit']) if (Array.isArray(c[k])) scan(c[k]); if (Array.isArray(c.choice)) for (const o of c.choice) scan(o?.then); } };
	for (const id in C.scripts) { scan(C.scripts[id]); if (story) break; }
	return { shops, gather, ground, unknown, story };
}

/** Texto corto de dónde se consigue. */
export function sourcesText(itemId) {
	const S = itemSources(itemId);
	const parts = [];
	const cap = (xs, f, more) => { const out = xs.slice(0, 3).map(f); if (xs.length > 3) out.push(more(xs.length - 3)); return out; };
	const ok = S.shops.filter(s => s.ok), later = S.shops.filter(s => !s.ok);
	parts.push(...cap(ok, s => `🛒 ${s.name} (${s.place})`, n => `🛒 y ${n} ${n === 1 ? 'tienda' : 'tiendas'} más`));
	if (later.length) parts.push(`🛒 Más adelante en ${later.length === 1 ? later[0].name + ' (' + later[0].place + ')' : later.length + ' tiendas que ya conoces'}`);
	parts.push(...cap(S.gather, g => `🍒 ${g.name}, ${g.place}${g.rare ? ' (rara)' : ''}`, n => `🍒 y ${n} ${n === 1 ? 'punto' : 'puntos'} de recolección más`));
	parts.push(...cap(S.ground, g => `📍 ${g.place}${g.hidden ? ' (escondida)' : ''}`, n => `📍 y ${n} más por el camino`));
	if (S.story) parts.push('🎁 Como premio o regalo en la historia');
	if (S.unknown) parts.push(`❔ ${S.unknown === 1 ? 'Un sitio' : S.unknown + ' sitios'} que aún no conoces`);
	return parts.length ? parts.join(' · ') : 'Aún no se puede conseguir en el juego.';
}

// =================== Cómo evoluciona ===================
const TIME_ES = c => /night/i.test(c || '') ? ' de noche' : /day/i.test(c || '') ? ' de día' : '';
export function evolutionInfo(sp) {
	const s = D.species[toID(sp)];
	if (!s?.evos) return [];
	return s.evos.map(id => ({ id, e: D.species[id] })).filter(x => x.e).map(({ id, e }) => {
		const cond = e.evoCondition || '';
		let how = '', item = null;
		switch (e.evoType) {
		case undefined: case null:
			how = e.evoLevel ? `Al nivel ${e.evoLevel}${TIME_ES(cond)}` : 'Subiendo de nivel';
			if (/female/i.test(cond)) how += ' (solo hembras)'; else if (/male/i.test(cond)) how += ' (solo machos)';
			if (/atk > def/i.test(cond)) how += ' si su Ataque es mayor que su Defensa';
			if (/atk < def/i.test(cond)) how += ' si su Defensa es mayor que su Ataque';
			if (/atk = def/i.test(cond)) how += ' si Ataque y Defensa son iguales';
			break;
		case 'levelFriendship': how = `Subir de nivel con amistad alta${TIME_ES(cond)}`; break;
		case 'levelHold': item = toID(e.evoItem); how = `Subir de nivel${TIME_ES(cond)} con ${D.items[item]?.name || e.evoItem} equipado`; break;
		case 'levelMove': how = `Subir de nivel sabiendo ${D.moves[toID(e.evoMove)]?.name || e.evoMove}`; break;
		case 'useItem': item = toID(e.evoItem); how = `Usar ${D.items[item]?.name || e.evoItem}`; break;
		case 'trade': item = 'linkingcord'; how = 'Usar el Cordón Unión (no hay intercambios)'; break;
		default: item = 'linkingcord'; how = 'Condición especial: el Cordón Unión también sirve'; break;
		}
		if (e.evoRegion) how += ` (forma de ${e.evoRegion})`;
		return { to: id, name: e.name, how, item, where: item ? sourcesText(item) : null };
	});
}

/** Objetos de evolución y MT que ya se pueden conseguir en sitios que conoces (para la pestaña «Dónde conseguir»). */
export function shopGuide() {
	const ids = Object.keys(D.items).filter(id => D.items[id]?.cat === 'evolution' || D.items[id]?.tm);
	const out = { stones: [], tms: [] };
	for (const id of ids) {
		const S = itemSources(id);
		const known = S.shops.length + S.gather.length + S.ground.length;
		if (!known && !(G.bag[id] > 0)) continue;
		(D.items[id].tm ? out.tms : out.stones).push({ id, name: D.items[id].name, have: G.bag[id] || 0, text: sourcesText(id), tm: D.items[id].tm ? toID(D.items[id].tm) : null });
	}
	out.stones.sort((a, b) => a.name.localeCompare(b.name));
	out.tms.sort((a, b) => a.name.localeCompare(b.name));
	return out;
}
