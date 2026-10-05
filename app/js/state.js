// Estado del juego, guardado y evaluación de condiciones.
import { D, toID } from './data.js';
import { C } from './content.js';
import { clone } from './util.js';

export const SAVE_VERSION = 1;
export let G = null;

export function newGame(player) {
	G = {
		v: SAVE_VERSION,
		created: Date.now(),
		playMs: 0,
		lastSave: 0,
		player: { name: 'Ash', pron: 'el', look: {}, money: 3000, badges: [], id: Math.floor(Math.random() * 65535), ...player },
		loc: null,
		route: null,
		lastCenter: null,
		party: [],
		boxes: Array.from({ length: 8 }, () => []),
		bag: {},
		flags: {}, vars: { cap: 15 }, rep: {}, af: {},
		quests: {},
		dex: { seen: {}, caught: {} },
		diary: [],
		intel: {},
		visited: {}, cleared: {}, routeProg: {},
		beaten: {},
		settings: { expShare: true, textSpeed: 2, anim: true, battleStyle: 'shift' },
		notices: {},
		eventsDone: {},
		stats: { battles: 0, caught: 0, steps: 0 },
		found: {}, gather: {}, album: {},
	};
	return G;
}
export function setG(g) { G = g; }

// ---------------- Guardado ----------------
const DB_NAME = 'pokemon-infinite';
function idb() {
	return new Promise((res, rej) => {
		if (!('indexedDB' in self)) return rej(new Error('no idb'));
		const r = indexedDB.open(DB_NAME, 1);
		r.onupgradeneeded = () => r.result.createObjectStore('saves');
		r.onsuccess = () => res(r.result);
		r.onerror = () => rej(r.error);
	});
}
async function idbSet(key, val) {
	const db = await idb();
	return new Promise((res, rej) => {
		const tx = db.transaction('saves', 'readwrite');
		tx.objectStore('saves').put(val, key);
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}
async function idbGet(key) {
	const db = await idb();
	return new Promise((res, rej) => {
		const tx = db.transaction('saves', 'readonly');
		const rq = tx.objectStore('saves').get(key);
		rq.onsuccess = () => res(rq.result);
		rq.onerror = () => rej(rq.error);
	});
}

export async function saveGame() {
	if (!G) return;
	G.lastSave = Date.now();
	const data = JSON.stringify(G);
	try { await idbSet('slot1', data); } catch (e) { /* ignore */ }
	try { localStorage.setItem('pinf-slot1', data); } catch (e) { /* lleno o bloqueado */ }
	try { navigator.storage?.persist?.(); } catch (e) { /* */ }
}

export async function loadSaved() {
	let data = null;
	try { data = await idbGet('slot1'); } catch (e) { /* */ }
	if (!data) { try { data = localStorage.getItem('pinf-slot1'); } catch (e) { /* */ } }
	if (!data) return null;
	try { return migrate(JSON.parse(data)); } catch (e) { return null; }
}

export async function deleteSave() {
	try { await idbSet('slot1', null); } catch (e) { /* */ }
	try { localStorage.removeItem('pinf-slot1'); } catch (e) { /* */ }
}

export function migrate(g) {
	if (!g || typeof g !== 'object') return null;
	g.settings ||= { expShare: true, textSpeed: 2, anim: true };
	g.eventsDone ||= {};
	g.notices ||= {};
	g.stats ||= { battles: 0, caught: 0, steps: 0 };
	g.vars ||= {};
	g.vars.cap ??= 15;
	if (!g.found) { g.found = {}; for (const k in g.bag || {}) g.found[k] = Date.now(); }
	g.gather ||= {};
	g.album ||= {};
	// postales de los pueblos y ciudades que ya visitaste antes de que existiera el álbum
	for (const id in g.visited || {}) { const l = C.locations[id]; if (l && !l.parent && ['city', 'town'].includes(l.kind) && !g.album[id]) g.album[id] = g.created || Date.now(); }
	return g;
}

export function exportSave() {
	return JSON.stringify({ app: 'pokemon-infinite', v: SAVE_VERSION, at: new Date().toISOString(), save: G });
}
export function importSave(text) {
	const o = JSON.parse(text);
	const g = migrate(o.save || o);
	if (!g || !g.player) throw new Error('Archivo de respaldo no válido');
	G = g;
	return g;
}

// ---------------- Flags y variables ----------------
export function setPath(path, value) {
	const [ns, ...rest] = path.split('.');
	const key = rest.join('.');
	const tbl = { flag: G.flags, flags: G.flags, vars: G.vars, var: G.vars, rep: G.rep, af: G.af }[ns];
	if (!tbl) throw new Error('Ruta de estado desconocida: ' + path);
	if (typeof value === 'string' && value.startsWith('=')) value = evalExpr(value.slice(1));
	if (typeof value === 'string' && /^[+-]\d+$/.test(value)) {
		tbl[key] = (tbl[key] || 0) + parseInt(value, 10);
	} else {
		tbl[key] = value;
	}
	if (ns === 'rep') tbl[key] = Math.max(-100, Math.min(100, tbl[key]));
	if (ns === 'af') tbl[key] = Math.max(0, Math.min(100, tbl[key]));
}

// ---------------- Inventario ----------------
export const count = id => G.bag[toID(id)] || 0;
export function addItem(id, n = 1) {
	id = toID(id);
	G.bag[id] = (G.bag[id] || 0) + n;
	if (n > 0 && G.found && !G.found[id]) G.found[id] = Date.now();
	if (G.bag[id] <= 0) delete G.bag[id];
}
export function removeItem(id, n = 1) {
	id = toID(id);
	if ((G.bag[id] || 0) < n) return false;
	G.bag[id] -= n;
	if (G.bag[id] <= 0) delete G.bag[id];
	return true;
}

// ---------------- Pokédex ----------------
export function markSeen(spId) {
	const s = D.species[toID(spId)];
	if (s) G.dex.seen[s.num] = 1;
}
export function markCaught(spId) {
	const s = D.species[toID(spId)];
	if (s) { G.dex.seen[s.num] = 1; G.dex.caught[s.num] = 1; }
}

// ---------------- Condiciones ----------------
// Las condiciones son expresiones JS sobre un ámbito controlado, p. ej.:
//   "flag.vio_puerta && !flag.x"   "vars.medallas >= 2"   "af.lila >= 20"   "rep.lemnis < 0"
//   "quest.mareep == 'hecha'"      "has('pokeflute')"     "night"   "badges >= 1"   "inParty('riolu')"
const cache = new Map();
let extraScope = () => ({});
/** fn: () => objeto con valores extra (hora, fecha, etc.) evaluados en cada condición */
export function setExtraScope(fn) { extraScope = fn; }

function scope() {
	const zero = () => new Proxy({}, { get: (t, k) => typeof k === 'string' ? 0 : undefined });
	const wrap = (obj, def) => new Proxy(obj, { get: (t, k) => (k in t ? t[k] : def), has: () => true });
	return {
		flag: wrap(G.flags, false), flags: wrap(G.flags, false),
		vars: wrap(G.vars, 0), rep: wrap(G.rep, 0), af: wrap(G.af, 0),
		// Una misión terminada siempre se lee como 'hecha' (así ningún diálogo de una etapa vieja se repite)
		quest: new Proxy({}, { get: (t, k) => G.quests[k] ? (G.quests[k].done ? 'hecha' : G.quests[k].stage || '') : '' }),
		done: new Proxy({}, { get: (t, k) => !!G.quests[k]?.done }),
		has: id => (G.bag[toID(id)] || 0) > 0,
		count: id => G.bag[toID(id)] || 0,
		badges: G.player.badges.length,
		badge: id => G.player.badges.includes(id),
		money: G.player.money,
		inParty: spId => G.party.some(p => p.sp === toID(spId) || D.species[p.sp]?.base === toID(spId)),
		owns: spId => G.party.some(p => p.sp === toID(spId)) || G.boxes.some(b => b.some(p => p.sp === toID(spId))),
		seen: spId => !!G.dex.seen[D.species[toID(spId)]?.num],
		caught: spId => !!G.dex.caught[D.species[toID(spId)]?.num],
		visited: id => !!G.visited[id],
		cleared: id => !!G.cleared[id],
		beat: id => !!G.beaten[id],
		maxLv: Math.max(0, ...G.party.map(p => p.lv)),
		partySize: G.party.length,
		pron: G.player.pron,
		zero,
		...extraScope(),
	};
}

export function evalCond(expr) {
	if (expr === undefined || expr === null || expr === '') return true;
	if (typeof expr === 'boolean') return expr;
	let fn = cache.get(expr);
	if (!fn) {
		try {
			// eslint-disable-next-line no-new-func
			fn = new Function('s', 'with (s) { return (' + expr + '); }');
		} catch (e) {
			console.error('Condición inválida:', expr, e);
			fn = () => false;
		}
		cache.set(expr, fn);
	}
	try { return !!fn(scope()); } catch (e) { console.error('Error en condición:', expr, e); return false; }
}

/** Evalúa una expresión y devuelve su valor (no booleano). */
export function evalExpr(expr) {
	try { return new Function('s', 'with (s) { return (' + expr + '); }')(scope()); } catch (e) { console.error('Expresión inválida:', expr, e); return null; }
}

export function snapshot() { return clone(G); }
