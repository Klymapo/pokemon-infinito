// Lógica del Tutor de movimientos (sin interfaz, para poder probarla en Node).
import { D, toID } from './data.js';
import { G } from './state.js';
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

