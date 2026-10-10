// Minijuegos para conseguir objetos (lógica pura, sin DOM): la usan la interfaz (ui/minijuegos.js y ui/mj-*.js),
// el intérprete de guiones, la recolección, el bot, el validador y las pruebas. Formato y reglas: docs/MINIJUEGOS.md.
//
// Cinco juegos, cinco destrezas:
//   dig    Excavación   lógica y planificación: pico y martillo sobre una pared con capas antes de que se venga abajo
//   fish   Pesca        pulso y tiempo: picada y barra de tensión
//   catch  Cosecha      puntería: sacudir el árbol y atrapar con la cesta lo que cae
//   aura   Rastreo      deducción: pulsos limitados que dicen frío, tibio o caliente
//   lock   Cerradura    memoria: repetir una secuencia de runas que crece
//
// Todos comparten el mismo ciclo:
//   const P = prepare({ def, mode, G })   → partida preparada (nivel, ayuda adaptativa, semilla y «carga» de premios)
//   const S = create(P)                   → estado del tablero (mutable; cada juego tiene sus funciones de jugada)
//   const res = finish(P, S)              → { result: 'win'|'lose'|'quit', score: 0..1, won: [índices de la carga], wild? }
//   const items = award(P, res)           → { idObjeto: cantidad } que se entrega
//   record(G, P, res)                     → récords y racha en G.minis[clave]
// y autoPlay(P) juega solo (bot, validador y partidas sin interfaz).

export const MINI_TYPES = ['dig', 'fish', 'catch', 'aura', 'lock'];
export const MINI_INFO = {
	dig: {
		name: 'Excavación', verb: 'Excavar', themes: ['cueva', 'cantera', 'hielo', 'ruina'],
		help: ['Toca la pared para picar: hay objetos enterrados y tienes que destaparlos **enteros**.', 'El **pico** es fino y gasta poco; el **martillo** abre más y gasta más. Si la pared se queda sin aguante, se viene abajo.', 'Los destellos del principio marcan dónde hay algo, y cuando queda una sola capa encima, brilla.'],
	},
	fish: {
		name: 'Pesca', verb: 'Pescar', themes: ['lago', 'mar', 'rio', 'cueva'],
		help: ['Lanza y espera. Cuando el corcho se hunda y salga **«!»**, toca enseguida. Si tocas antes de tiempo, lo espantas.', 'Después, **mantén pulsado para recoger** y suelta para aflojar: la aguja tiene que quedarse en la zona verde.', 'Si la tensión se queda en rojo, el sedal se parte. Si se queda floja, se escapa.'],
	},
	catch: {
		name: 'Cosecha', verb: 'Cosechar', themes: ['bosque', 'huerto', 'otono', 'nieve'],
		help: ['**Desliza de lado sobre la copa** para sacudir el árbol.', '**Arrastra la cesta** para atrapar lo que cae. Las doradas valen por tres.', 'Las piñas y las bayas pochas te tiran bayas de la cesta: esquívalas.'],
	},
	aura: {
		name: 'Rastreo', verb: 'Rastrear', themes: ['ruina', 'playa', 'campo', 'cueva', 'buscaobjetos'],
		help: ['Toca el terreno para lanzar un pulso. La marca dice lo cerca que está el objeto más próximo: **frío, tibio, caliente** o **«¡aquí al lado!»**.', 'Si está justo al lado, su silueta brilla un instante. Toca su casilla para sacarlo.', 'Los pulsos son limitados: piensa dónde lanzar el siguiente.'],
	},
	lock: {
		name: 'Cerradura', verb: 'Abrir', themes: ['cofre', 'ruina', 'caja'],
		help: ['Las runas se encienden en orden. **Repite la secuencia** tocándolas.', 'Cada ronda añade una runa más y abre un cerrojo.', 'Puedes fallar un par de veces: la secuencia se repite. **Ver otra vez** la enseña de nuevo.'],
	},
};

export const NORMAL_SKILL = 0.65; // lo fino que juega «una persona normal» para el jugador automático (0,95: alguien que ya se lo sabe)
export const RARE_SCORE = 0.7; // puntuación mínima para llevarte las entradas `rare` en los juegos que premian por puntuación
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerpD = (d, a, b) => a + (b - a) * (clamp(d, 0.5, 5) - 1) / 4; // de nivel 1 (a) a nivel 5 (b)
const toID = s => ('' + (s ?? '')).toLowerCase().replace(/[^a-z0-9]+/g, '');

// ---------- Azar con semilla ----------
export function rngFrom(seed) {
	let a = seed >>> 0;
	return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function hashSeed(s) {
	if (typeof s === 'number' && Number.isFinite(s)) return s >>> 0;
	let hh = 2166136261;
	for (const ch of String(s)) { hh ^= ch.codePointAt(0); hh = Math.imul(hh, 16777619); }
	return hh >>> 0;
}
const rint = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
function wpick(rnd, list) {
	const tot = list.reduce((s, e) => s + (e.w ?? 1), 0);
	let r = rnd() * tot;
	for (const e of list) { r -= (e.w ?? 1); if (r < 0) return e; }
	return list[list.length - 1];
}

// ---------- Récords y dificultad adaptativa ----------
export const miniKey = def => String(def.id || def.key || def.type);
/** Ayuda adaptativa: tras dos derrotas seguidas en el mismo minijuego, la siguiente es un poco más fácil (y tras cuatro, algo más). */
export function easeFor(G, key) {
	const ls = G?.minis?.[key]?.ls || 0;
	return ls >= 4 ? 2 : ls >= 2 ? 1 : 0;
}
/** Apunta el resultado en G.minis[clave]: n (veces jugadas), w (victorias), best (mejor puntuación), ls (derrotas seguidas), t. */
export function record(G, P, res) {
	if (!G || res.result === 'quit') return null;
	const m = ((G.minis ||= {})[P.key] ||= { n: 0, w: 0, best: 0, ls: 0 });
	m.n++; m.t = Date.now();
	if (res.result === 'win') { m.w++; m.ls = 0; if (res.score > m.best) m.best = Math.round(res.score * 100) / 100; } else m.ls = (m.ls || 0) + 1;
	const byType = (G.minis['#' + P.type] ||= { n: 0, w: 0 });
	byType.n++; if (res.result === 'win') byType.w++;
	return m;
}

// ---------- Carga de premios ----------
const DEFAULT_PICKS = { dig: 3, fish: 1, catch: 3, aura: 3, lock: 2 };
const MAX_OBJECTS = { dig: 5, aura: 4 };
const rollN = (rnd, n) => Array.isArray(n) ? rint(rnd, n[0], n[1]) : (n || 1);

/** Carga de un minijuego de guion: los `guaranteed` (must) y unas tiradas de `loot`. */
export function scriptCargo(def, rnd, cond = null) {
	const cargo = [];
	for (const id of def.guaranteed || []) cargo.push({ id: toID(id), n: 1, must: true });
	const loot = (def.loot || []).filter(e => e.cond === undefined || !cond || cond(e.cond));
	const picks = def.picks ?? DEFAULT_PICKS[def.type] ?? 2;
	if (loot.length) for (let i = 0; i < picks; i++) { const e = wpick(rnd, loot); cargo.push({ id: toID(e.id), n: rollN(rnd, e.n), rare: !!e.rare }); }
	return cargo;
}

/**
 * Carga de un punto de recolección: `base` es lo que da «Recoger rápido» (lo de siempre, sin entradas `rare`)
 * y `extra` son otras tantas tandas (con acceso a las `rare`) que solo se ganan jugando.
 * `extraPicks` añade tandas a la base (la montura que rompe roca).
 */
export function gatherCargo(gdef, { rnd = Math.random, cond = null, extraPicks = 0, withExtra = true } = {}) {
	const ok = e => e.cond === undefined || !cond || cond(e.cond);
	const all = (gdef.table || []).filter(ok);
	const common = all.filter(e => !e.rare);
	const pool = common.length ? common : all;
	const [p0, p1] = gdef.picks || [1, 2];
	const picks = rint(rnd, p0, p1) + extraPicks;
	const cargo = [];
	if (!pool.length) return cargo;
	for (let i = 0; i < picks; i++) { const e = wpick(rnd, pool); cargo.push({ id: toID(e.id), n: rollN(rnd, e.n), base: true }); }
	if (withExtra) for (let i = 0; i < picks; i++) { const e = wpick(rnd, all); cargo.push({ id: toID(e.id), n: rollN(rnd, e.n), rare: !!e.rare }); }
	return cargo;
}

/** Suma una lista de entradas de carga en { id: cantidad }. */
export function sumCargo(cargo, idxs = null) {
	const got = {};
	(idxs ? idxs.map(i => cargo[i]) : cargo).forEach(c => { if (c) got[c.id] = (got[c.id] || 0) + c.n; });
	return got;
}

/** Índices que se ganan por puntuación (pesca, cosecha y cerradura): primero las normales y, con buena nota, las raras. */
export function wonByScore(cargo, score, { min = 0 } = {}) {
	const pool = cargo.map((c, i) => i).filter(i => !cargo[i].must && !cargo[i].base);
	const commons = pool.filter(i => !cargo[i].rare), rares = pool.filter(i => cargo[i].rare);
	const k = Math.min(pool.length, Math.max(min, Math.round(score * pool.length)));
	const order = score >= RARE_SCORE ? [...commons, ...rares] : commons;
	const out = order.slice(0, k);
	if (out.length < min && rares.length && !commons.length) out.push(...rares.slice(0, min - out.length)); // si solo hay raras, la mínima no se queda vacía
	return out;
}

/**
 * Lo que se entrega. Guion: si ganas, lo conseguido más los `guaranteed`; si pierdes o sales, nada.
 * Recolección: siempre la base (lo de «Recoger rápido») y, salvo que salgas a medias, lo extra que hayas conseguido.
 */
export function award(P, res) {
	const cargo = P.cargo, idx = new Set();
	if (P.mode === 'gather') {
		cargo.forEach((c, i) => { if (c.base) idx.add(i); });
		if (res.result !== 'quit') for (const i of res.won || []) idx.add(i);
	} else if (res.result === 'win') {
		cargo.forEach((c, i) => { if (c.must) idx.add(i); });
		for (const i of res.won || []) idx.add(i);
	}
	return sumCargo(cargo, [...idx].sort((a, b) => a - b));
}

/**
 * Premio de consolación de un minijuego de guion: lo que te llevas si pierdes (nunca al salir).
 * `consolation: 'id'` o `{ id, n }` lo fija; `false` lo quita; si no se dice nada, es una unidad de la primera entrada normal de la carga.
 */
function consolOf(def, mode, cargo) {
	if (mode === 'gather' || def.consolation === false) return null;
	if (def.consolation) return typeof def.consolation === 'string' ? { id: toID(def.consolation), n: 1 } : { id: toID(def.consolation.id), n: def.consolation.n || 1 };
	const c = cargo.find(e => !e.must && !e.rare);
	return c ? { id: c.id, n: 1 } : null;
}
export const CONSOL_HOURS = 20; // la consolación de un mismo minijuego se da como mucho una vez cada tantas horas (para que perder aposta no sea un negocio)

/**
 * Cierra las cuentas de una partida: apunta el récord y devuelve { items: { id: n }, consol } con lo que hay que entregar.
 * Guion: ganar da el botín; perder, la consolación (si toca); salir, nada. Recolección: ver `award`.
 */
export function settle(G, P, res, now = Date.now()) {
	const m = record(G, P, res);
	const items = award(P, res);
	let consol = false;
	if (P.mode !== 'gather' && res.result === 'lose' && P.consol && (!m || !m.ct || now - m.ct >= CONSOL_HOURS * 3600e3)) {
		items[P.consol.id] = (items[P.consol.id] || 0) + P.consol.n; consol = true;
		if (m) m.ct = now;
	}
	return { items, consol };
}

/** Definición sintética del minijuego de un punto de recolección (`game: 'dig'` o `game: { type, level, theme, title, hint, wild, wildChance }`). */
export function gatherGame(gid, g) {
	if (!g?.game) return null;
	const o = typeof g.game === 'string' ? { type: g.game } : g.game;
	return { level: 2, ...o, id: 'g:' + gid, title: o.title || g.name || undefined };
}

// ---------- Preparar ----------
/**
 * Prepara una partida. `def` es la definición del guion (`{ type, id, title, hint, level, theme, loot, guaranteed, wild, seed }`)
 * o una sintética para un punto de recolección (con `cargo` ya tirada). No toca G.
 */
export function prepare({ def, mode = 'script', G = null, cargo = null, cond = null, random = Math.random }) {
	const type = def.type, info = MINI_INFO[type];
	if (!info) throw new Error('minijuego de tipo desconocido: ' + type);
	const key = miniKey(def);
	const ease = easeFor(G, key);
	const level = clamp(Math.round(def.level || 2), 1, 5);
	const seed = def.seed !== undefined && def.seed !== null ? hashSeed(def.seed) : Math.floor(random() * 0x7fffffff);
	const rnd = rngFrom(seed ^ 0x51ed);
	cargo = cargo || scriptCargo(def, rnd, cond);
	const wild = (def.wild || []).filter(e => e.cond === undefined || !cond || cond(e.cond));
	const lootW = (def.loot || []).reduce((s, e) => s + (e.w ?? 1), 0), wildW = wild.reduce((s, e) => s + (e.w ?? 1), 0);
	return {
		type, key, mode, id: def.id || null, title: def.title || info.name, hint: def.hint || '', theme: def.theme || info.themes[0],
		level, ease, d: clamp(level - 0.75 * ease, 0.5, 5), seed,
		cargo,
		consol: consolOf(def, mode, cargo),
		wild, wildChance: !wild.length ? 0 : def.wildChance ?? (mode === 'gather' ? 0.35 : (lootW + wildW ? wildW / (lootW + wildW) : 1)),
	};
}

// =====================================================================================================
// 1. EXCAVACIÓN
// =====================================================================================================
export const DIG_W = 8, DIG_H = 8;
const DIG_SLACK = [2.2, 1.15]; // holgura del aguante (nivel 1 → nivel 5) sobre lo que gastaría un picador perfecto
/** Forma (en casillas) y dibujo de un objeto enterrado según su id. */
export function digKind(id) {
	id = toID(id);
	if (/fossil|fossilized|oldamber/.test(id)) return 'fossil';
	if (/terashard|shard$/.test(id) && id !== 'cometshard' && id !== 'meteoriteshard') return 'shard';
	if (id === 'bignugget') return 'gold';
	if (/nugget/.test(id)) return 'nugget';
	if (/pearl|orb$/.test(id)) return 'orb';
	if (/stardust|starpiece|cometshard|meteorite|wishingstar/.test(id)) return 'star';
	if (/scale$|scales$/.test(id)) return 'scale';
	if (/(stone|ite|gem|rock|crystal)$/.test(id) || /ite[xy]$/.test(id)) return 'gem';
	return 'ball';
}
export const DIG_SHAPES = { gem: [2, 2], fossil: [2, 2], gold: [2, 2], ball: [2, 2], shard: [1, 2], nugget: [2, 1], orb: [1, 1], star: [1, 1], scale: [1, 1] };
const DIG_DMG = {
	pick: [[0, 0, 2], [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1]],
	hammer: [[0, 0, 2], [1, 0, 2], [-1, 0, 2], [0, 1, 2], [0, -1, 2], [1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1]],
};

/** Orden en que la carga ocupa los huecos del tablero: primero lo que solo se gana jugando, luego la base. */
function boardOrder(cargo, max) {
	const idx = cargo.map((c, i) => i);
	const pri = i => cargo[i].must ? 0 : cargo[i].base ? 2 : 1;
	return idx.sort((a, b) => pri(a) - pri(b) || a - b).slice(0, max);
}

export function digCreate(P) {
	const rnd = rngFrom(P.seed), d = P.d, W = DIG_W, H = DIG_H;
	const p2 = lerpD(d, 0.55, 0.9), p3 = lerpD(d, 0.12, 0.55);
	const depth = new Array(W * H);
	for (let i = 0; i < W * H; i++) depth[i] = 1 + (rnd() < p2 ? 1 : 0) + (rnd() < p3 ? 1 : 0);
	const taken = new Set(), objs = [];
	for (const ci of boardOrder(P.cargo, MAX_OBJECTS.dig)) {
		const kind = digKind(P.cargo[ci].id);
		let [w, hh] = DIG_SHAPES[kind];
		for (let tries = 0; tries < 80; tries++) {
			if (tries === 60) { w = 1; hh = 1; } // tablero muy lleno: ocupa una sola casilla antes que quedarse fuera
			const x = rint(rnd, 0, W - w), y = rint(rnd, 0, H - hh);
			const cells = [];
			for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) cells.push([x + i, y + j]);
			// deja una casilla de aire entre objetos, para que se lean separados
			let free = true;
			for (const [cx, cy] of cells) for (let dy = -1; dy <= 1 && free; dy++) for (let dx = -1; dx <= 1; dx++) if (taken.has((cx + dx) + ',' + (cy + dy))) { free = false; break; }
			if (!free && tries < 40) continue;
			if (cells.some(([cx, cy]) => taken.has(cx + ',' + cy))) continue;
			for (const [cx, cy] of cells) { taken.add(cx + ',' + cy); if ((P.cargo[ci].rare || P.cargo[ci].must) && depth[cy * W + cx] < 2) depth[cy * W + cx] = 2; }
			objs.push({ ci, kind, x, y, w, h: hh, cells, found: false, small: w * hh === 1 && DIG_SHAPES[kind][0] * DIG_SHAPES[kind][1] > 1 });
			break;
		}
	}
	// El aguante se mide contra lo que hay que picar: un pico bien dado quita unas 3 capas útiles.
	const maxStab = 100;
	let need = 0;
	for (const o of objs) for (const [cx, cy] of o.cells) need += depth[cy * W + cx];
	const picks = Math.max(6, need / 3.2 * lerpD(d, DIG_SLACK[0], DIG_SLACK[1]) + 3);
	const pick = Math.round(maxStab / picks * 10) / 10;
	return {
		type: 'dig', W, H, depth, objs, stab: maxStab, maxStab, hits: 0, over: null,
		cost: { pick, hammer: Math.round(pick * 2.3 * 10) / 10 },
		radar: objs.map(o => o.cells[rint(rnd, 0, o.cells.length - 1)]),
	};
}
export const digObjAt = (S, x, y) => S.objs.find(o => x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h) || null;
export const digDepth = (S, x, y) => (x < 0 || y < 0 || x >= S.W || y >= S.H) ? -1 : S.depth[y * S.W + x];
/** Un golpe. Devuelve null si no vale, o { cells: [[x, y, capa]], found: [objetos], over }. */
export function digHit(S, x, y, tool = 'pick') {
	if (S.over || digDepth(S, x, y) < 0 || !DIG_DMG[tool]) return null;
	const cells = [];
	for (const [dx, dy, dmg] of DIG_DMG[tool]) {
		const cx = x + dx, cy = y + dy, cur = digDepth(S, cx, cy);
		if (cur <= 0) continue;
		S.depth[cy * S.W + cx] = Math.max(0, cur - dmg);
		cells.push([cx, cy, S.depth[cy * S.W + cx]]);
	}
	S.hits++;
	S.stab = Math.max(0, S.stab - S.cost[tool]);
	const found = [];
	for (const o of S.objs) if (!o.found && o.cells.every(([cx, cy]) => S.depth[cy * S.W + cx] === 0)) { o.found = true; found.push(o); }
	if (S.objs.every(o => o.found)) S.over = 'clear';
	else if (S.stab <= 0) S.over = 'collapse';
	return { cells, found, over: S.over };
}
function digAuto(S, rnd, skill) {
	const known = new Set(S.radar.map(([x, y]) => x + ',' + y));
	let guard = 400;
	while (!S.over && guard-- > 0) {
		// quien ve asomar un trozo de un objeto adivina su forma
		for (const o of S.objs) if (!o.found && o.cells.some(([x, y]) => digDepth(S, x, y) === 0)) for (const [x, y] of o.cells) known.add(x + ',' + y);
		const targets = [...known].map(k => k.split(',').map(Number)).filter(([x, y]) => digDepth(S, x, y) > 0);
		let best = null;
		const consider = (tool, x, y) => {
			let gain = 0;
			for (const [dx, dy, dmg] of DIG_DMG[tool]) { const cx = x + dx, cy = y + dy; if (known.has(cx + ',' + cy)) gain += Math.min(dmg, Math.max(0, digDepth(S, cx, cy))); }
			const v = gain / S.cost[tool];
			if (gain > 0 && (!best || v > best.v + 1e-9)) best = { v, tool, x, y };
		};
		for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++) { consider('pick', x, y); consider('hammer', x, y); }
		if (!best) { // sin pistas (no debería pasar): pica donde quede más roca
			const [x, y] = targets[0] || [rint(rnd, 0, S.W - 1), rint(rnd, 0, S.H - 1)];
			best = { tool: 'pick', x, y };
		}
		if (rnd() > skill) { best.x = clamp(best.x + rint(rnd, -1, 1), 0, S.W - 1); best.y = clamp(best.y + rint(rnd, -1, 1), 0, S.H - 1); if (rnd() < 0.3) best.tool = best.tool === 'pick' ? 'hammer' : 'pick'; }
		// y de vez en cuando pica donde no había nada (nadie es un picador perfecto)
		if (rnd() < (1 - skill) * 0.6) digHit(S, clamp(best.x + rint(rnd, -2, 2), 0, S.W - 1), clamp(best.y + rint(rnd, -2, 2), 0, S.H - 1), 'pick');
		if (S.over) break;
		digHit(S, best.x, best.y, best.tool);
	}
}
function digFinish(P, S) {
	const won = S.objs.filter(o => o.found).map(o => o.ci);
	const total = S.objs.length || 1;
	return { won, score: clamp(won.length / total, 0, 1), left: S.stab / S.maxStab };
}

// =====================================================================================================
// 2. PESCA
// =====================================================================================================
export function fishCreate(P) {
	const rnd = rngFrom(P.seed), d = P.d;
	let hook;
	if (P.wild.length && rnd() < P.wildChance) { const e = wpick(rnd, P.wild); hook = { type: 'wild', sp: toID(e.sp), lv: Array.isArray(e.lv) ? rint(rnd, e.lv[0], e.lv[1]) : (e.lv || 5) }; } else hook = { type: 'item' };
	const big = hook.type === 'wild' ? 1.15 : 1;
	const zw = lerpD(d, 0.42, 0.26) / big;
	const S = {
		type: 'fish', phase: 'ready', t: 0, rnd, hook, strikes: 0, maxStrikes: 3,
		fakesMax: Math.round(lerpD(d, 0, 2)), biteWindow: lerpD(d, 1.6, 0.9),
		wait: null, biteT: 0,
		// recogida
		tension: 0.5, zone: [0.56 - zw / 2, 0.56 + zw / 2], prog: 0.25, stress: 0, inZone: 0, reelT: 0,
		up: 0.85, down: 0.75, amp: lerpD(d, 0.22, 0.62) * big, need: lerpD(d, 7, 11), slack: 0.05 * (1 + d / 5), snapT: lerpD(d, 2.4, 1.5),
		w1: 1.3 + rnd() * 0.8, w2: 2.9 + rnd() * 1.2, f1: rnd() * 6.28, f2: rnd() * 6.28,
		burstAmp: d >= 1.5 ? lerpD(d, 0.45, 1.0) : 0, burstAt: 2.5 + rnd() * 2, burst: 0, warned: false,
		over: null,
	};
	return S;
}
function fishPlanWait(S) {
	const rnd = S.rnd;
	const fakes = [];
	let t = 1.2 + rnd() * 1.4;
	const nf = S.fakesMax ? rint(rnd, 0, S.fakesMax) : 0;
	for (let i = 0; i < nf; i++) { fakes.push(t); t += 1.0 + rnd() * 1.2; }
	S.wait = { t: 0, fakes, bite: t + rnd() * 0.8, fakeOn: 0 };
}
/** Lanza la caña (fase ready → wait). */
export function fishCast(S) { if (S.phase !== 'ready' || S.over) return false; S.phase = 'wait'; fishPlanWait(S); return true; }
/** ¿Hay un amago ahora mismo? (para dibujarlo) */
export const fishFaking = S => S.phase === 'wait' && S.wait.fakeOn > 0;
/**
 * Avanza `dt` segundos. `input.tap` es un toque (en este paso) y `input.hold`, el dedo apoyado.
 * Devuelve eventos: 'fake', 'bite', 'scared', 'missed', 'hooked', 'warn', 'burst', 'caught', 'snap', 'escaped'.
 */
export function fishStep(S, dt, input = {}) {
	const ev = [];
	if (S.over || S.phase === 'ready') return ev;
	S.t += dt;
	const strike = why => { S.strikes++; ev.push(why); if (S.strikes >= S.maxStrikes) { S.over = 'escaped'; ev.push('escaped'); } else { S.phase = 'wait'; fishPlanWait(S); S.wait.t = -0.6; } };
	if (S.phase === 'wait') {
		const w = S.wait;
		if (input.tap && w.t > 0) { strike('scared'); return ev; }
		w.t += dt;
		if (w.fakeOn > 0) w.fakeOn -= dt;
		while (w.fakes.length && w.t >= w.fakes[0]) { w.fakes.shift(); w.fakeOn = 0.4; ev.push('fake'); }
		if (w.t >= w.bite) { S.phase = 'bite'; S.biteT = 0; ev.push('bite'); }
		return ev;
	}
	if (S.phase === 'bite') {
		if (input.tap) { S.phase = 'reel'; S.reelT = 0; ev.push('hooked'); return ev; }
		S.biteT += dt;
		if (S.biteT > S.biteWindow) strike('missed');
		return ev;
	}
	// recogida
	S.reelT += dt;
	const grace = S.reelT < 1.2 ? S.reelT / 1.2 : 1; // el pez tarda un segundo en tirar de verdad
	let pull = S.amp * (0.6 * Math.sin(S.w1 * S.reelT + S.f1) + 0.4 * Math.sin(S.w2 * S.reelT + S.f2));
	if (S.burstAmp) {
		if (!S.warned && S.reelT >= S.burstAt - 0.5) { S.warned = true; ev.push('warn'); }
		if (S.reelT >= S.burstAt && S.burst <= 0 && S.warned) { S.burst = 0.7; ev.push('burst'); S.burstAt = S.reelT + 3 + S.rnd() * 2.5; S.warned = false; }
		if (S.burst > 0) { S.burst -= dt; pull += S.burstAmp; }
	}
	S.tension = clamp(S.tension + ((input.hold ? S.up : -S.down) + pull * grace) * dt, 0, 1);
	const [lo, hi] = S.zone;
	if (S.tension > hi) { S.stress += dt / S.snapT; if (S.stress >= 1) { S.over = 'snap'; ev.push('snap'); } }
	else {
		S.stress = Math.max(0, S.stress - dt * 0.6);
		if (S.tension >= lo) { S.inZone += dt; S.prog += dt / S.need; if (S.prog >= 1) { S.prog = 1; S.over = 'caught'; ev.push('caught'); } }
		else { S.prog -= dt * S.slack * grace; if (S.prog <= 0) { S.prog = 0; S.over = 'escaped'; ev.push('escaped'); } }
	}
	if (!S.over && S.reelT > 60) { S.over = 'escaped'; ev.push('escaped'); }
	return ev;
}
export const fishWarning = S => S.phase === 'reel' && S.warned && S.burst <= 0;
function fishAuto(S, rnd, skill) {
	const dt = 0.05;
	fishCast(S);
	let react = 0, hold = false, think = 0, guard = 4000;
	while (!S.over && guard-- > 0) {
		const input = { hold, tap: false };
		if (S.phase === 'wait') { if (fishFaking(S) && rnd() > 0.85 + 0.15 * skill && S.wait.t > 0) input.tap = true; react = 0.25 + (1 - skill) * rnd() * 1.6; }
		else if (S.phase === 'bite') { react -= dt; if (react <= 0) input.tap = true; }
		else {
			think -= dt;
			if (think <= 0) { // decide cada cierto tiempo, como un pulgar de verdad
				const mid = (S.zone[0] + S.zone[1]) / 2 - (S.burst > 0 || fishWarning(S) ? 0.1 : 0);
				hold = S.tension < mid + (rnd() - 0.5) * (1 - skill) * 0.5;
				think = 0.1 + (1 - skill) * 0.55 * rnd();
			}
			input.hold = hold;
		}
		fishStep(S, dt, input);
	}
}
function fishFinish(P, S) {
	if (S.over !== 'caught') return { won: [], score: clamp(S.prog * 0.3, 0, 0.3), lost: true };
	const score = clamp(S.inZone / Math.max(1, S.reelT) * 1.15 - 0.1 * S.strikes, 0.1, 1);
	const isWild = S.hook.type === 'wild';
	return { won: isWild && P.mode !== 'gather' ? [] : wonByScore(P.cargo, score, { min: 1 }), score, wild: isWild ? { sp: S.hook.sp, lv: S.hook.lv } : undefined };
}

// =====================================================================================================
// 3. COSECHA
// =====================================================================================================
/** Nota mínima para que la cosecha cuente como buena (sube con el nivel). */
export const catchNeed = d => lerpD(d, 0.4, 0.72);
export const CATCH_TOP = 0.3, CATCH_LINE = 0.86; // de dónde caen y dónde está la boca de la cesta (0..1 del alto)
export function catchCreate(P) {
	const rnd = rngFrom(P.seed), d = P.d;
	const nWaves = 3, per = Math.round(lerpD(d, 5, 8)), fall = lerpD(d, 2.5, 1.45), badP = lerpD(d, 0.16, 0.38);
	const hw = 0.145, gap = lerpD(d, 0.5, 0.22);
	// las bayas que caen llevan el dibujo de lo que hay en la carga (para que se vea qué se está cosechando)
	const looks = [...new Set(P.cargo.filter(c => !c.rare).map(c => c.id))];
	if (!looks.length) looks.push(...new Set(P.cargo.map(c => c.id)));
	const waves = [];
	let goldLeft = d >= 3.5 ? 2 : 1;
	for (let w = 0; w < nWaves; w++) {
		const items = [];
		for (let i = 0; i < per; i++) {
			let kind = rnd() < badP ? 'bad' : 'good';
			if (kind === 'good' && goldLeft && ((w === nWaves - 1 && i === per - 2) || (goldLeft === 2 && w === 0 && i === per - 1))) { kind = 'gold'; goldLeft--; }
			const it = { kind, delay: i * (gap + rnd() * 0.2) + rnd() * 0.15, dur: fall * (0.9 + rnd() * 0.25), x: 0.5, look: kind === 'bad' ? (rnd() < 0.5 ? 'cone' : 'rot') : looks[rint(rnd, 0, Math.max(0, looks.length - 1))] || 'berry' };
			// que una cosa mala no aterrice a la vez y en el mismo sitio que una buena
			for (let tries = 0; tries < 14; tries++) {
				it.x = 0.1 + rnd() * 0.8;
				const land = it.delay + it.dur;
				if (!items.some(o => (o.kind === 'bad') !== (it.kind === 'bad') && Math.abs(o.delay + o.dur - land) < 0.45 && Math.abs(o.x - it.x) < hw * 2.3)) break;
			}
			items.push(it);
		}
		if (!items.some(o => o.kind !== 'bad')) items[0].kind = 'good', items[0].look = looks[0] || 'berry';
		waves.push(items);
	}
	const max = waves.flat().reduce((s, o) => s + (o.kind === 'good' ? 1 : o.kind === 'gold' ? 3 : 0), 0);
	return { type: 'catch', t: 0, waves, wave: 0, air: [], hw, bx: 0.5, pts: 0, max, caught: { good: 0, gold: 0, bad: 0 }, missed: 0, cool: 0, over: null };
}
export const catchCanShake = S => !S.over && S.wave < S.waves.length && S.cool <= 0;
/** Sacude el árbol: suelta la siguiente tanda. */
export function catchShake(S) {
	if (!catchCanShake(S)) return false;
	for (const it of S.waves[S.wave]) S.air.push({ ...it, t0: S.t + it.delay, y: CATCH_TOP, done: false });
	S.wave++; S.cool = 0.7;
	return true;
}
export const catchY = (it, t) => { const k = clamp((t - it.t0) / it.dur, 0, 1.3); return CATCH_TOP + (CATCH_LINE - CATCH_TOP) * Math.pow(k, 1.7); };
/** Avanza `dt` con la cesta en `bx` (0..1). Devuelve eventos { e: 'catch'|'ground', kind, x, look }. */
export function catchStep(S, dt, bx) {
	const ev = [];
	if (S.over) return ev;
	S.t += dt; S.cool = Math.max(0, S.cool - dt);
	if (bx !== undefined && bx !== null) S.bx = clamp(bx, S.hw * 0.6, 1 - S.hw * 0.6);
	for (const it of S.air) {
		if (it.done || S.t < it.t0) continue;
		if (S.t - it.t0 >= it.dur) {
			it.done = true;
			if (Math.abs(it.x - S.bx) <= S.hw) {
				S.caught[it.kind]++;
				S.pts = Math.max(0, S.pts + (it.kind === 'good' ? 1 : it.kind === 'gold' ? 3 : -2));
				ev.push({ e: 'catch', kind: it.kind, x: it.x, look: it.look });
			} else { if (it.kind !== 'bad') S.missed++; ev.push({ e: 'ground', kind: it.kind, x: it.x, look: it.look }); }
		}
	}
	S.air = S.air.filter(it => !it.done);
	if (S.wave >= S.waves.length && !S.air.length) S.over = 'done';
	return ev;
}
export const catchScore = S => clamp(S.pts / Math.max(1, 0.85 * S.max), 0, 1);
function catchAuto(S, rnd, skill) {
	const dt = 0.05, vmax = 0.45 + 1.0 * skill;
	let bx = 0.5, guard = 6000;
	while (!S.over && guard-- > 0) {
		if (!S.air.length && catchCanShake(S)) catchShake(S);
		const flying = S.air.filter(it => S.t >= it.t0 - 0.3).sort((a, b) => (a.t0 + a.dur) - (b.t0 + b.dur));
		const goods = flying.filter(it => it.kind !== 'bad'), bads = flying.filter(it => it.kind === 'bad');
		let target = bx;
		const g = goods[0];
		if (g) target = g.x + (g._j ??= (rnd() - 0.5) * (1 - skill) * 0.9); // cada cual calcula a ojo dónde va a caer
		const danger = bads.find(b => b.t0 + b.dur - S.t < 0.5 && Math.abs(b.x - target) < S.hw * 1.15);
		if (danger && (!g || (g.t0 + g.dur) - (danger.t0 + danger.dur) > 0.25 || rnd() < skill)) target = danger.x + (target >= danger.x ? 1 : -1) * S.hw * 1.5;
		bx += clamp(target - bx, -vmax * dt, vmax * dt);
		catchStep(S, dt, bx);
	}
}
function catchFinish(P, S) {
	const score = catchScore(S);
	const win = score >= catchNeed(P.d);
	return { won: win || P.mode === 'gather' ? wonByScore(P.cargo, score, { min: win ? 1 : 0 }) : [], score, lost: !win };
}

// =====================================================================================================
// 4. RASTREO CON EL AURA
// =====================================================================================================
export const AURA_W = 7, AURA_H = 8;
const AURA_PER = [3.2, 1.9]; // pulsos por objeto (nivel 1 → nivel 5), más 3 → 1 de margen
export const AURA_BANDS = ['here', 'near', 'hot', 'warm', 'cold'];
export const AURA_TEXT = { here: '¡Aquí está!', near: '¡Aquí al lado!', hot: 'Caliente', warm: 'Tibio', cold: 'Frío', none: 'Ya no queda nada' };
const AURA_MIN = { near: 1, hot: 2, warm: 3, cold: 5 }, AURA_MAX = { near: 1, hot: 2, warm: 4, cold: 99 };
const cheb = (ax, ay, bx, by) => Math.max(Math.abs(ax - bx), Math.abs(ay - by));
export const auraBand = dist => dist === 0 ? 'here' : dist === 1 ? 'near' : dist === 2 ? 'hot' : dist <= 4 ? 'warm' : 'cold';
export function auraCreate(P) {
	const rnd = rngFrom(P.seed), d = P.d, W = AURA_W, H = AURA_H;
	const objs = [];
	for (const ci of boardOrder(P.cargo, MAX_OBJECTS.aura)) {
		for (let tries = 0; tries < 60; tries++) {
			const x = rint(rnd, 0, W - 1), y = rint(rnd, 0, H - 1);
			if (objs.some(o => cheb(o.x, o.y, x, y) < (tries < 40 ? 2 : 1))) continue;
			objs.push({ ci, x, y, kind: digKind(P.cargo[ci].id), found: false });
			break;
		}
	}
	const pulses = Math.round(lerpD(d, AURA_PER[0], AURA_PER[1]) * objs.length + lerpD(d, 3, 0.5));
	return { type: 'aura', W, H, objs, pulses, maxPulses: pulses, probes: {}, over: null };
}
function auraNearest(S, x, y) {
	let best = null;
	for (const o of S.objs) if (!o.found) { const dd = cheb(o.x, o.y, x, y); if (!best || dd < best.d) best = { d: dd, o }; }
	return best;
}
/** Lanza un pulso. Devuelve null si no vale, o { band, found, reveal: [objetos a una casilla], over }. */
export function auraProbe(S, x, y) {
	if (S.over || x < 0 || y < 0 || x >= S.W || y >= S.H) return null;
	const k = x + ',' + y;
	const n = auraNearest(S, x, y);
	if (!n) return null;
	if (S.probes[k] !== undefined && n.d !== 0) return null; // ya sondeada y aquí no hay nada: no gasta
	S.pulses--;
	let found = null;
	if (n.d === 0) { n.o.found = true; found = n.o; }
	S.probes[k] = found ? 'here' : auraBand(n.d);
	// las marcas siempre hablan del objeto más cercano que QUEDA: al sacar uno, se recalculan
	if (found) for (const pk in S.probes) { if (S.probes[pk] === 'here') continue; const [px, py] = pk.split(',').map(Number); const m = auraNearest(S, px, py); S.probes[pk] = m ? auraBand(m.d) : 'none'; }
	const reveal = S.objs.filter(o => !o.found && cheb(o.x, o.y, x, y) === 1);
	if (S.objs.every(o => o.found)) S.over = 'clear';
	else if (S.pulses <= 0) S.over = 'spent';
	return { band: S.probes[k], found, reveal, over: S.over };
}
/** Casillas donde aún puede haber algo según las marcas (lo usa el jugador automático y la ayuda visual opcional). */
export function auraPossible(S) {
	const out = [];
	for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++) {
		const k = x + ',' + y;
		if (S.probes[k] !== undefined) continue;
		let ok = true, sc = 0;
		for (const pk in S.probes) {
			const b = S.probes[pk];
			if (b === 'here') continue;
			const [px, py] = pk.split(',').map(Number), dd = cheb(px, py, x, y);
			if (b === 'none') continue;
			if (dd < AURA_MIN[b]) { ok = false; break; }
			if (b !== 'cold' && dd <= AURA_MAX[b]) sc += b === 'near' ? 6 : b === 'hot' ? 3 : 1;
		}
		if (ok) out.push({ x, y, sc });
	}
	return out;
}
function auraAuto(S, rnd, skill) {
	const seen = new Map();
	let guard = 200;
	while (!S.over && guard-- > 0) {
		let cell = null;
		for (const [k, o] of seen) if (!o.found) { cell = k.split(',').map(Number); break; }
		if (cell && rnd() > 0.6 + 0.4 * skill) cell = null; // a veces se le olvida dónde brilló
		if (!cell) {
			const pos = auraPossible(S);
			if (!pos.length) break;
			const top = Math.max(...pos.map(p => p.sc));
			let cands = pos.filter(p => p.sc === top);
			if (top === 0) { // sin pistas: sondea donde un pulso descarta más (lejos de los bordes y de lo ya sondeado)
				const edge = p => Math.min(p.x, S.W - 1 - p.x, 2) + Math.min(p.y, S.H - 1 - p.y, 2);
				const m = Math.max(...cands.map(edge));
				cands = cands.filter(p => edge(p) === m);
			}
			const c = rnd() < skill * skill ? cands[rint(rnd, 0, cands.length - 1)] : pos[rint(rnd, 0, pos.length - 1)];
			cell = [c.x, c.y];
		}
		const r = auraProbe(S, cell[0], cell[1]);
		if (!r) { S.probes[cell[0] + ',' + cell[1]] ??= 'none'; continue; }
		for (const o of r.reveal) seen.set(o.x + ',' + o.y, o);
	}
}
function auraFinish(P, S) {
	const won = S.objs.filter(o => o.found).map(o => o.ci);
	return { won, score: clamp(won.length / (S.objs.length || 1), 0, 1), left: S.pulses / S.maxPulses };
}

// =====================================================================================================
// 5. CERRADURA DE RUNAS
// =====================================================================================================
export function lockCreate(P) {
	const rnd = rngFrom(P.seed), d = P.d;
	const lv = clamp(Math.round(d), 1, 5);
	const pads = lv >= 3 ? 6 : 4;
	const rounds = [[3, 4], [3, 4, 5], [3, 4, 5], [4, 5, 6], [4, 5, 6, 7]][lv - 1];
	const seq = [];
	for (let i = 0; i < rounds[rounds.length - 1]; i++) { let p; do p = rint(rnd, 0, pads - 1); while (seq.length >= 2 && seq[seq.length - 1] === p && seq[seq.length - 2] === p); seq.push(p); }
	return { type: 'lock', pads, seq, rounds, round: 0, pos: 0, mistakes: 0, maxMistakes: d <= 1 ? 3 : 2, showMs: Math.round(lerpD(d, 680, 440)), replays: 0, over: null };
}
/** Las runas que hay que repetir en esta ronda. */
export const lockTarget = S => S.seq.slice(0, S.rounds[Math.min(S.round, S.rounds.length - 1)]);
/** Toca una runa. Devuelve 'ok', 'round' (ronda completa), 'open' (abierta), 'wrong' (fallo: la ronda vuelve a empezar) o 'fail'. */
export function lockPress(S, pad) {
	if (S.over) return null;
	const target = lockTarget(S);
	if (pad !== target[S.pos]) {
		S.mistakes++; S.pos = 0;
		if (S.mistakes > S.maxMistakes) { S.over = 'fail'; return 'fail'; }
		return 'wrong';
	}
	S.pos++;
	if (S.pos < target.length) return 'ok';
	S.pos = 0; S.round++;
	if (S.round >= S.rounds.length) { S.over = 'open'; return 'open'; }
	return 'round';
}
export const lockScore = S => S.over === 'open' ? clamp(1 - 0.28 * S.mistakes, 0.2, 1) : clamp(0.25 * S.round / S.rounds.length, 0, 0.25);
function lockAuto(S, rnd, skill) {
	let guard = 500;
	while (!S.over && guard-- > 0) {
		const target = lockTarget(S);
		let pad = target[S.pos];
		// se le olvida más cuanto más larga es la secuencia y más runas hay
		if (rnd() < (1 - skill) * 0.024 * target.length * (S.pads / 4)) pad = (pad + 1 + rint(rnd, 0, S.pads - 2)) % S.pads;
		lockPress(S, pad);
	}
}
function lockFinish(P, S) {
	const score = lockScore(S), open = S.over === 'open';
	return { won: open ? wonByScore(P.cargo, score, { min: 1 }) : [], score, lost: !open };
}

// =====================================================================================================
// Ciclo común
// =====================================================================================================
const GAMES = {
	dig: { create: digCreate, auto: digAuto, finish: digFinish },
	fish: { create: fishCreate, auto: fishAuto, finish: fishFinish },
	catch: { create: catchCreate, auto: catchAuto, finish: catchFinish },
	aura: { create: auraCreate, auto: auraAuto, finish: auraFinish },
	lock: { create: lockCreate, auto: lockAuto, finish: lockFinish },
};
export const create = P => GAMES[P.type].create(P);

/**
 * Cierra la partida: { result, score, won, wild }. Gana quien consigue todos los `guaranteed` (si los hay en el tablero)
 * y al menos una cosa; la pesca, la cosecha y la cerradura deciden además por sus propias reglas (`lost`).
 */
export function finish(P, S, { quit = false } = {}) {
	const r = GAMES[P.type].finish(P, S);
	const score = clamp(Number.isFinite(r.score) ? r.score : 0, 0, 1);
	if (quit) return { result: 'quit', score, won: [] };
	let win;
	if (P.type === 'dig' || P.type === 'aura') {
		const onBoard = new Set(S.objs.map(o => o.ci));
		const musts = P.cargo.map((c, i) => i).filter(i => P.cargo[i].must && onBoard.has(i));
		win = r.won.length > 0 && musts.every(i => r.won.includes(i));
	} else win = !r.lost;
	const res = { result: win ? 'win' : 'lose', score, won: r.won };
	if (r.left !== undefined) res.left = r.left; // aguante o pulsos que sobraron (0..1)
	if (r.wild && win) res.wild = r.wild;
	return res;
}

/** Juega solo. `skill` 0..1 es lo fino que juega (0,8: una persona atenta). Devuelve lo mismo que `finish`. */
export function autoPlay(P, { skill = 0.8, seed = null } = {}) {
	const S = create(P);
	GAMES[P.type].auto(S, rngFrom((seed ?? P.seed) ^ 0xa07a), clamp(skill, 0, 1));
	return finish(P, S);
}

/** Resultado «medio» sin jugar (ajuste de minijuegos desactivado en un paso de guion): gana con nota justa. */
export function skipResult(P) {
	const S = create(P);
	const score = 0.6;
	const won = P.type === 'dig' || P.type === 'aura' ? S.objs.filter(o => P.cargo[o.ci].must || !P.cargo[o.ci].rare).map(o => o.ci).slice(0, Math.max(1, Math.ceil(S.objs.length * score))) : wonByScore(P.cargo, score, { min: 1 });
	const res = { result: 'win', score, won, skipped: true };
	if (P.type === 'fish' && S.hook.type === 'wild') { res.wild = { sp: S.hook.sp, lv: S.hook.lv }; if (P.mode !== 'gather') res.won = []; }
	return res;
}

/** % de victorias del jugador automático con varias semillas (validador y pruebas). */
export function winRate(def, { n = 40, skill = NORMAL_SKILL, level = null } = {}) {
	let w = 0, sc = 0;
	for (let i = 0; i < n; i++) {
		const P = prepare({ def: { ...def, level: level ?? def.level, seed: hashSeed((def.id || def.type) + ':' + i) }, random: rngFrom(i + 1) });
		const r = autoPlay(P, { skill });
		if (r.result === 'win') w++;
		sc += r.score;
	}
	return { win: w / n, score: sc / n };
}

/**
 * ¿Se pueden ganar de verdad las entradas `rare`? Juega `n` partidas con el jugador automático normal y cuenta
 * en cuántas había algo raro en juego (`had`) y en cuántas se consiguió (`got`). Vale para guiones y recolección.
 */
export function rareRate(def, { n = 40, skill = NORMAL_SKILL, table = null, picks = null } = {}) {
	let had = 0, got = 0;
	for (let i = 0; i < n; i++) {
		const seed = hashSeed((def.id || def.type) + ':r' + i), rnd = rngFrom(seed);
		const cargo = table ? gatherCargo({ table, picks: picks || [1, 2] }, { rnd }) : null;
		const P = prepare({ def: { ...def, seed }, mode: table ? 'gather' : 'script', cargo, random: rnd });
		const rares = P.cargo.map((c, j) => j).filter(j => P.cargo[j].rare);
		if (!rares.length) continue;
		had++;
		const r = autoPlay(P, { skill });
		if (r.result !== 'quit' && (r.won || []).some(j => P.cargo[j].rare)) got++;
	}
	return { had, got };
}

/** Errores del `game` de un punto de recolección. */
export function checkGatherGame(gid, g, ctx = {}) {
	const def = gatherGame(gid, g);
	if (!def) return [];
	const known = ['type', 'level', 'theme', 'title', 'hint', 'wild', 'wildChance'];
	const errs = typeof g.game === 'object' ? Object.keys(g.game).filter(k => !known.includes(k)).map(k => 'clave desconocida en game: ' + k) : [];
	if (def.wildChance !== undefined && !(def.wildChance >= 0 && def.wildChance <= 1)) errs.push('wildChance debe ir de 0 a 1');
	return errs.concat(checkDef({ ...def, loot: g.table || [] }, ctx));
}

/** Errores de una definición de guion (lo usa el validador; `has` comprueba objetos y `hasSp`, especies). */
export function checkDef(def, { has = () => true, hasSp = () => true } = {}) {
	const errs = [];
	if (!def || typeof def !== 'object') return ['definición vacía'];
	if (!MINI_TYPES.includes(def.type)) return ['tipo desconocido: ' + def.type + ' (vale: ' + MINI_TYPES.join(', ') + ')'];
	if (def.level !== undefined && !(Number.isInteger(def.level) && def.level >= 1 && def.level <= 5)) errs.push('level debe ser un entero de 1 a 5');
	if (def.theme && !MINI_INFO[def.type].themes.includes(def.theme)) errs.push(`tema desconocido «${def.theme}» (vale: ${MINI_INFO[def.type].themes.join(', ')})`);
	for (const e of def.loot || []) { if (!e || !e.id) errs.push('entrada de loot sin id'); else if (!has(toID(e.id))) errs.push('objeto inexistente: ' + e.id); }
	for (const id of def.guaranteed || []) if (!has(toID(id))) errs.push('objeto inexistente: ' + id);
	for (const e of def.wild || []) { if (!e || !hasSp(toID(e.sp))) errs.push('especie inexistente: ' + e?.sp); if (!e?.lv) errs.push('wild sin nivel: ' + e?.sp); }
	if (def.wild?.length && def.type !== 'fish') errs.push('wild solo vale en la pesca (type: fish)');
	if (!(def.loot || []).length && !(def.guaranteed || []).length && !(def.wild || []).length) errs.push('sin premios: pon loot, guaranteed o wild');
	if (def.type !== 'fish' && !(def.loot || []).length && !(def.guaranteed || []).length) errs.push('sin objetos que conseguir');
	if ((def.guaranteed || []).length > (MAX_OBJECTS[def.type] || 9)) errs.push('demasiados guaranteed para este tablero');
	if (def.consolation) { const cid = toID(typeof def.consolation === 'string' ? def.consolation : def.consolation.id); if (!has(cid)) errs.push('consolation: objeto inexistente: ' + cid); }
	if (def.picks !== undefined && !(Number.isInteger(def.picks) && def.picks >= 0 && def.picks <= 6)) errs.push('picks debe ser un entero de 0 a 6');
	if (def.hint && def.hint.length > 140) errs.push('hint de más de 140 caracteres');
	return errs;
}
