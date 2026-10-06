// Pokémon únicos que se escapan (pedido de Mario, 2026-10-06).
// Un encuentro único es cualquier `wild` de un guion que se pueda capturar (sin `noCatch`).
// Si no lo capturas (lo debilitas, huyes o pierdes), se esconde y vuelve más tarde en la historia:
// al conseguir la siguiente medalla, Rotom avisa de dónde está y aparece en ese pueblo o ciudad
// como un sitio más ("🐾 Snorlax ha vuelto"). Antes del combate se avisa de nuevo para preparar
// Poké Balls y Falso Tortazo. Si vuelve a escaparse, regresa tras la medalla siguiente.
//
// Para que un `wild` capturable NO cuente como único (p. ej. un concurso), ponle `unique: false`.
import { D, toID } from './data.js';
import { C, topLoc } from './content.js';
import { G, evalCond } from './state.js';

// Guiones cuyos combates no son de Pokémon únicos.
const EXCLUDE = new Set(['b02_concurso']);

// Encuentros publicados antes de que existiera este sistema: cómo saber si ya pasaron
// y si se capturó, para las partidas en curso (efecto retroactivo).
const RETRO = {
	'b01_r4_despertar:lechonk': { happened: 'flag.b01_palmeo && !flag.b01_lechonk_lemnis && seen("lechonk")', caught: 'flag.b01_lechonk_atrapado || caught("lechonk")' },
	'b01_r4_panal:combee': { happened: 'flag.b01_panal_miel && seen("combee")', caught: 'caught("combee")' },
	'b01_r7_snorlax_flauta:snorlax': { happened: 'flag.b01_snorlax', caught: 'flag.b01_snorlax_atrapado' },
	'b01_gruta_honda:axew': { happened: 'flag.b01_gruta_honda', caught: 'caught("axew")' },
	'b01_r10_tera:hawlucha': { happened: 'flag.b01_r10_tera', caught: 'caught("hawlucha")' },
	'b02_encinar_tera:toedscool': { happened: 'flag.b02_encinar_tera', caught: 'caught("toedscool")' },
	'b02_sudowoodo:sudowoodo': { happened: 'flag.b02_sudowoodo', caught: 'flag.b02_sudowoodo_atrapado' },
	'b03_lago_llegada:gyarados': { happened: 'flag.b03_gyarados_rojo', caught: 'flag.b03_gyarados_atrapado' },
};
const RETRO_VERSION = 1;

let REG = null; // key -> { key, sid, wild, catchSets }
const BY_OBJ = new WeakMap();

function build() {
	REG = {};
	const walk = (list, sid) => {
		if (!Array.isArray(list)) return;
		for (const c of list) {
			if (!c || typeof c !== 'object') continue;
			if (c.wild && !c.wild.noCatch && c.wild.unique !== false && !EXCLUDE.has(sid) && D.species[toID(c.wild.sp)]) {
				const key = sid + ':' + toID(c.wild.sp);
				const catchSets = {};
				for (const x of c.onCatch || []) if (x?.set) for (const k in x.set) if (x.set[k] === true) catchSets[k] = true;
				REG[key] = { key, sid, wild: c.wild, catchSets };
				BY_OBJ.set(c.wild, key);
			}
			for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun']) walk(c[k], sid);
			if (Array.isArray(c.choice)) for (const o of c.choice) walk(o?.then, sid);
		}
	};
	for (const [sid, list] of Object.entries(C.scripts)) walk(list, sid);
}
const reg = () => { if (!REG) build(); return REG; };
/** Para pruebas: vuelve a leer el contenido. */
export function rebuildUniques() { REG = null; return reg(); }
export function allUniques() { return Object.values(reg()); }
export function uniqueKeyOf(wildObj) { reg(); return (wildObj && BY_OBJ.get(wildObj)) || null; }

function U() { return (G.uniq ||= { missed: {}, done: {} }); }

/** Lugar (de primer nivel) donde se lanza un guion, buscando en sitios, rutas y guiones que lo llaman. */
function originOf(sid, depth = 0) {
	const needle = '"' + sid + '"';
	for (const l of Object.values(C.locations)) {
		if (JSON.stringify(l).includes(needle)) return topLoc(l.id)?.id || l.id;
	}
	if (depth < 2) for (const [other, list] of Object.entries(C.scripts)) {
		if (other !== sid && JSON.stringify(list).includes('"call":' + needle)) { const o = originOf(other, depth + 1); if (o) return o; }
	}
	return null;
}

export function placeName(id) {
	const l = C.locations[id];
	if (!l) return 'algún lugar';
	const t = topLoc(id);
	return t && t.id !== id ? `${t.name}` : l.name;
}

/** Se llama después de un combate único: lo marca como capturado o lo programa para volver. */
export function uniqueResult(key, result) {
	const R = reg()[key];
	if (!R || !G) return;
	const u = U();
	if (result === 'caught') {
		u.done[key] = Date.now();
		delete u.missed[key];
		for (const k in R.catchSets) { const [ns, ...rest] = k.split('.'); if (ns === 'flag' || ns === 'flags') G.flags[rest.join('.')] = true; }
		return;
	}
	if (u.done[key]) return;
	const prev = u.missed[key];
	u.missed[key] = {
		sp: toID(R.wild.sp), lv: R.wild.lv,
		badges: G.player.badges.length,
		origin: prev?.origin || topLoc(G.loc)?.id || G.loc || originOf(R.sid),
		where: null, announced: false,
		tries: (prev?.tries || 0) + 1,
		t: Date.now(),
	};
}

/** Efecto retroactivo: registra los únicos que se escaparon antes de que existiera el sistema. Devuelve los nuevos. */
export function retroUniques() {
	const u = U();
	if ((u.retro || 0) >= RETRO_VERSION) return [];
	u.retro = RETRO_VERSION;
	const added = [];
	for (const [key, r] of Object.entries(RETRO)) {
		const R = reg()[key];
		if (!R || u.done[key] || u.missed[key]) continue;
		if (!evalCond(r.happened)) continue;
		if (evalCond(r.caught)) { u.done[key] = Date.now(); continue; }
		u.missed[key] = { sp: toID(R.wild.sp), lv: R.wild.lv, badges: G.player.badges.length, origin: originOf(R.sid), where: null, announced: false, tries: 1, t: Date.now(), retro: true };
		added.push(key);
	}
	return added;
}

/** Dónde aparece un único que vuelve: el pueblo o ciudad donde estás, o el del último Centro Pokémon. */
function returnPlace() {
	const top = topLoc(G.loc);
	if (top && !top.route && ['city', 'town'].includes(top.kind)) return top.id;
	const c = G.lastCenter && C.locations[G.lastCenter] ? topLoc(G.lastCenter)?.id || G.lastCenter : null;
	return c || top?.id || G.loc;
}

/** Los que ya tocan volver (una medalla más que cuando se escaparon). Les asigna lugar y los devuelve sin anunciar. */
export function uniquesDue() {
	if (!G) return [];
	const u = U();
	const out = [];
	for (const [key, e] of Object.entries(u.missed)) {
		if (!reg()[key]) continue;
		if (G.player.badges.length <= e.badges) continue;
		if (!e.where || !C.locations[e.where]) e.where = returnPlace();
		if (!e.announced) out.push({ key, ...e });
	}
	return out;
}
export function markAnnounced(keys) { const u = U(); for (const k of keys) if (u.missed[k]) u.missed[k].announced = true; }

/** Sitios de "ha vuelto" para un lugar. */
export function uniqueSpotsAt(locId) {
	if (!G?.uniq) return [];
	const out = [];
	for (const [key, e] of Object.entries(G.uniq.missed)) {
		if (e.where !== locId || G.player.badges.length <= e.badges || !reg()[key]) continue;
		out.push({ label: `${D.species[e.sp]?.name || e.sp} ha vuelto`, sub: `Segunda oportunidad · Nv. ${e.lv}`, icon: '🐾', action: { unique: key } });
	}
	return out;
}

/** Lista para el menú: pendientes y dónde están. */
export function uniquesList() {
	if (!G?.uniq) return [];
	return Object.entries(G.uniq.missed).filter(([k]) => reg()[k]).map(([key, e]) => ({
		key, ...e, name: D.species[e.sp]?.name || e.sp,
		ready: G.player.badges.length > e.badges && !!e.where,
	}));
}

export function uniqueWild(key) { const R = reg()[key]; return R ? { ...R.wild } : null; }
