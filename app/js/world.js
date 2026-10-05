// Mundo: ubicaciones, rutas por tramos, encuentros, viajes, eventos por fecha.
import { D, toID } from './data.js';
import { C, topLoc } from './content.js';
import { G, evalCond, count, removeItem, addItem } from './state.js';
import { createPokemon, addHappy, healFull } from './pokemon.js';
import { weightedPick, rint, rng } from './util.js';
import { inDateRange, phase } from './time.js';

export const L = id => C.locations[id];
export const isRoute = loc => !!loc?.route;

// ---------- Eventos por fecha ----------
export function activeEvents() {
	return C.events.filter(e => inDateRange(e.from, e.to) && (e.cond === undefined || evalCond(e.cond)));
}

/** Spots visibles de una ubicación (incluye eventos activos). */
export function spotsOf(loc) {
	let spots = (loc.spots || []).slice();
	for (const e of activeEvents()) if (e.spots?.[loc.id]) spots = spots.concat(e.spots[loc.id].map(s => ({ ...s, event: e.id })));
	return spots.filter(s => s.cond === undefined || evalCond(s.cond));
}

export function descOf(loc) {
	for (const d of loc.descs || []) if (evalCond(d.cond)) return d.text;
	if (phase() === 'noche' && loc.descNight) return loc.descNight;
	return loc.desc || '';
}

// ---------- Rutas ----------
export function routeProg(id) {
	return (G.routeProg[id] ||= { seen: {}, done: {}, items: {} });
}

/** Lista de elementos de un tramo (incluye eventos activos y filtra condiciones). */
export function tramoItems(loc, n) {
	let items = [].concat(loc.route.tramos?.[n] || []);
	for (const e of activeEvents()) if (e.tramos?.[loc.id]?.[n]) items = items.concat(e.tramos[loc.id][n]);
	return items.filter(x => x.cond === undefined || evalCond(x.cond));
}

export function tramoTerrain(loc, n) {
	const t = tramoItems(loc, n).find(x => x.terrain);
	return t?.terrain || loc.route.terrain || 'grass';
}

/** Tabla de encuentros para un terreno, filtrada por hora, condición y eventos. */
export function encounterTable(loc, terrain) {
	const base = loc.route?.encounters?.[terrain] || loc.encounters?.[terrain] || [];
	let list = base.slice();
	for (const e of activeEvents()) if (e.encounters?.[loc.id]?.[terrain]) list = list.concat(e.encounters[loc.id][terrain]);
	const ph = phase();
	return list.filter(x => {
		if (x.time === 'night' && ph !== 'noche') return false;
		if (x.time === 'day' && ph === 'noche') return false;
		if (x.time === 'morning' && ph !== 'manana') return false;
		if (x.cond !== undefined && !evalCond(x.cond)) return false;
		return true;
	});
}

export function rollWild(loc, terrain) {
	const tbl = encounterTable(loc, terrain);
	if (!tbl.length) return null;
	const e = weightedPick(tbl);
	const lv = Array.isArray(e.lv) ? rint(e.lv[0], e.lv[1]) : e.lv;
	const shinyRate = count('shinycharm') ? 1365 : 4096;
	const p = createPokemon(e.sp, { level: lv, shinyRate, hidden: rng() < (e.hiddenChance || 0.02), tera: e.tera, form: e.form });
	return { mon: p, entry: e };
}

export function mounted() {
	return !!G.vars.mount && !!G.flags['mount_' + G.vars.mount] && G.settings.useMount !== false;
}

export function encounterRate(loc) {
	let r = loc.route?.rate ?? 0.2;
	if (mounted()) r *= 0.6;
	return r;
}

/** Siguiente posición al avanzar. Devuelve info del paso. */
export function canMove(loc, from, dir) {
	// bloqueos: un tramo con {block:{cond,msg}} no deja pasar hacia adelante (dir>0) o atrás (dir<0) hasta cumplir cond
	const items = tramoItems(loc, from);
	const blk = items.find(x => x.block && (x.block.dir === undefined || x.block.dir === dir) && !evalCond(x.block.cond));
	if (blk) return { ok: false, msg: blk.block.msg || 'No puedes pasar por aquí.' , script: blk.block.script };
	return { ok: true };
}

export function markTramo(locId, n) {
	const pr = routeProg(locId);
	pr.seen[n] = true;
	const loc = L(locId);
	const len = loc.route.length;
	let all = true;
	for (let i = 0; i <= len; i++) if (!pr.seen[i]) { all = false; break; }
	if (all) G.cleared[locId] = true;
}

/** Amistad por caminar */
export function walkFriendship() {
	G.stats.steps = (G.stats.steps || 0) + 1;
	if (G.stats.steps % 3 === 0) for (const p of G.party) if (p.hp > 0) addHappy(p, 1);
	if ((G.vars.repel || 0) > 0) {
		G.vars.repel--;
		return G.vars.repel === 0 ? 'repel_end' : null;
	}
	return null;
}

// ---------- Viaje por el mapa ----------
/** ¿Se puede atravesar libremente esta ubicación en un viaje rápido? */
function passable(id) {
	const l = L(id);
	if (!l) return false;
	if (isRoute(l)) return !!G.cleared[id];
	return !!G.visited[id];
}

/** Camino de `from` a `to` usando solo rutas despejadas y lugares visitados. */
export function findPath(from, to) {
	if (from === to) return [from];
	const prev = { [from]: null };
	const q = [from];
	while (q.length) {
		const cur = q.shift();
		for (const n of L(cur)?.links || []) {
			if (n in prev) continue;
			if (n !== to && !passable(n)) continue;
			if (n === to && !passable(n) && !(L(cur) && (L(cur).links || []).includes(n))) continue;
			prev[n] = cur;
			if (n === to) {
				const path = [to];
				let p = cur;
				while (p) { path.unshift(p); p = prev[p]; }
				return path;
			}
			q.push(n);
		}
	}
	return null;
}

export function canEnter(id) {
	const l = L(id);
	if (!l) return { ok: false, msg: '???' };
	if (l.enterCond !== undefined && !evalCond(l.enterCond)) return { ok: false, msg: l.blockedMsg || 'Todavía no puedes ir allí.' };
	return { ok: true };
}

// ---------- Centro Pokémon y derrota ----------
export function healParty() { for (const p of G.party) healFull(p); }

export function whiteout() {
	healParty();
	const dest = G.lastCenter || G.home || G.loc;
	G.loc = dest;
	G.route = null;
	return dest;
}

// ---------- Zona de entrenamiento con tope ----------
export function avgLevel() {
	const ps = G.party.filter(p => p);
	if (!ps.length) return 0;
	return ps.reduce((s, p) => s + p.lv, 0) / ps.length;
}
export function trainingOpen(cap) { return avgLevel() < cap; }

// ---------- Hitos y aviso de ritmo ----------
export function pendingNotices() {
	const out = [];
	for (const m of C.milestones) {
		if (G.notices[m.flag]) continue;
		if (!G.flags[m.flag]) continue;
		const idx = C.blocks.findIndex(b => b.id === m.block);
		const hasNext = idx >= 0 && idx < C.blocks.length - 1;
		if (m.hoursLeft <= 3 && !hasNext) out.push(m);
		else if (m.always) out.push(m);
		else G.notices[m.flag] = 'skip';
	}
	return out;
}
