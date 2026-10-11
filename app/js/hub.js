// Hub de misiones: la única fuente de verdad de «qué te toca, qué espera y qué es nuevo».
// Lógica pura (sin DOM), importable desde Node como negocios.js o movimientos.js.
//
// Antes, cada pantalla (mapa, Novedades, Diario, recuadro 📌, marcas «!»/«?» y ficha de misión) decidía por su cuenta
// con expresiones regulares sobre el contenido, y se contradecían: Novedades anunciaba sitios de escenas ya pasadas,
// «Ir» llevaba a sitios cuya puerta la historia no había abierto y «Lo que necesitas» pedía objetos ya entregados.
// Ahora todas leen de aquí, y herramientas/hub.mjs comprueba estas respuestas contra partidas reales.
//
// Ideas clave:
//  - Un «sitio» es algo que el jugador puede tocar o que pasará solo al llegar: un spot, un elemento de tramo,
//    una escena al entrar en un lugar o un premio de instructor. Solo cuentan los de lugares alcanzables hoy.
//  - Sonda (`probe`): recorre en seco el guion que correría ese sitio AHORA (con las condiciones de ahora) y dice si
//    cambiaría algo (flags, misiones, objetos, dinero, Pokémon, lugar, diario…), qué misiones movería y qué
//    condiciones le impiden avanzar una misión (de ahí sale «Lo que necesitas»). Un guion que solo habla o que
//    termina en `{ end: true }` no es novedad ni hace avanzar nada.
//  - Todo se calcula una vez por «versión de estado» (`stamp()`): si no cambian flags, misiones, objetos, lugar…,
//    se reutiliza lo calculado (antes Novedades recorría todo el contenido en cada render).
import { C, topLoc } from './content.js';
import { D, toID } from './data.js';
import { G, evalCond, count } from './state.js';
import { L, activeEvents, isRoute } from './world.js';
import { uniqueSpotsAt } from './unicos.js';
import { ventureList, pending as venturePending } from './negocios.js';
import { phase } from './time.js';

/**
 * Solo para pruebas de regresión (herramientas/test/hub-test.mjs y herramientas/hub.mjs --antiguo):
 * reproduce los criterios de antes para comprobar que la auditoría caza los fallos que vio Mario.
 *   reach: 'visited'      → «alcanzable» = visitado (fallos 1 y 2: Novedades y «Ir» a sitios sin entrada)
 *   needsHidden: true     → «Lo que necesitas» también lee diálogos que ya no se ven (fallo 3)
 *   markers: 'static'     → marcas «!»/«?»/• aunque el guion de ahora no haga nada
 */
export const HUB_OPTS = { reach: 'entrances', needsHidden: false, markers: 'probe' };

const okRaw = c => { try { return c === undefined || c === null || c === '' || evalCond(c); } catch (e) { return false; } };
// Condiciones memorizadas por versión de estado (salvo durante una sonda, que cambia la partida a ratos)
let PROBING = 0;
const ok = c => {
	if (c === undefined || c === null || c === '') return true;
	if (PROBING || !CUR || typeof c !== 'string') return okRaw(c);
	let v = CUR.conds.get(c);
	if (v === undefined) { v = okRaw(c); CUR.conds.set(c, v); }
	return v;
};
const BRANCH_KEYS = ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit'];
const ACTIVE_TYPES = { main: '⭐', thread: '🧵', side: '📜', event: '🎉' };

// =================== Versión de estado y caché ===================
const dayKey = () => { const d = new Date(); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); };
/** Huella barata del estado que afecta al hub. Si no cambia, todo lo calculado sigue valiendo. */
export function stamp() {
	if (!G) return '';
	const p = G.player || {};
	const neg = G.neg ? Object.keys(G.neg).map(k => [k, !!G.neg[k].owned, G.neg[k].pending || 0, (G.neg[k].workers || []).map(w => w.sp).join()]) : 0;
	let qs = '';
	for (const k in G.quests) { const q = G.quests[k]; qs += k + ':' + q.stage + (q.done ? '✔' : '') + ','; }
	return JSON.stringify([G.loc, G.route, G.flags, G.vars, qs, G.bag, G.visited, G.cleared, G.beaten, p.badges, p.money, G.routeProg, G.uniq?.missed, neg,
		(G.party || []).map(m => m.sp).join(), (G.boxes || []).map(b => b.map(m => m.sp).join()).join('|'), phase(), dayKey(), HUB_OPTS.reach, HUB_OPTS.needsHidden, HUB_OPTS.markers]);
}
// Una caché por partida (objeto G) y versión de estado. Cada función pública calcula la huella una sola vez por
// llamada (las llamadas internas reutilizan la de fuera: ver `api`), así una pantalla entera cuesta una huella.
let CACHES = new WeakMap();
let CUR = null, DEPTH = 0;
function cache() {
	if (!G) return { k: '', conds: new Map(), probes: new Map(), needs: new Map(), status: new Map(), marks: new Map(), spots: new Map(), tramos: new Map() };
	const k = stamp();
	let c = CACHES.get(G);
	if (!c || c.k !== k) { c = { k, conds: new Map(), probes: new Map(), needs: new Map(), status: new Map(), marks: new Map(), spots: new Map(), tramos: new Map() }; CACHES.set(G, c); }
	return c;
}
/** Envuelve una función pública: la primera llamada (desde fuera) fija la caché de la versión de estado actual. */
const api = f => function (...a) {
	if (DEPTH === 0) CUR = cache();
	DEPTH++;
	try { return f.apply(this, a); } finally { if (--DEPTH === 0) CUR = null; }
};
/** Fuerza a recalcular todo en la próxima consulta (p. ej. tras cambiar la partida a mano en el mismo instante). */
export function invalidate() { CACHES = new WeakMap(); }
/** Vuelve a indexar el contenido (solo si se registran bloques después de la primera consulta, p. ej. en pruebas). */
export function reindex() { STATIC = null; invalidate(); }

// =================== Lo visible ahora (como world.js, pero con las condiciones memorizadas) ===================
// Mismo criterio que spotsOf / tramoItems / canEnter / activeEvents de world.js; si cambian allí, cambia aquí.
function events() { return (CUR.events ||= activeEvents()); }
/** Spots visibles de un lugar (incluye eventos activos y Pokémon únicos que han vuelto). */
function spotsAt(loc) {
	let v = CUR.spots.get(loc.id);
	if (v) return v;
	let spots = (loc.spots || []).slice();
	for (const e of events()) if (e.spots?.[loc.id]) spots = spots.concat(e.spots[loc.id].map(s => ({ ...s, event: e.id })));
	try { spots = spots.concat(uniqueSpotsAt(loc.id)); } catch (e) { /* */ }
	v = spots.filter(s => ok(s.cond));
	CUR.spots.set(loc.id, v);
	return v;
}
/** Elementos visibles de un tramo (incluye eventos activos). */
function tramoAt(loc, n) {
	const k = loc.id + ':' + n;
	let v = CUR.tramos.get(k);
	if (v) return v;
	let items = [].concat(loc.route.tramos?.[n] || []);
	for (const e of events()) if (e.tramos?.[loc.id]?.[n]) items = items.concat(e.tramos[loc.id][n]);
	v = items.filter(x => ok(x.cond));
	CUR.tramos.set(k, v);
	return v;
}
function enterOk(id) {
	const l = L(id);
	if (!l) return { ok: false, msg: '???' };
	if (l.enterCond !== undefined && !ok(l.enterCond)) return { ok: false, msg: l.blockedMsg || 'Todavía no puedes ir allí.' };
	return { ok: true };
}

// =================== Índice estático del contenido ===================
let STATIC = null;
function staticIndex() {
	// el contenido se registra al cargar; si se registra más después (pruebas), llama a reindex()
	if (STATIC && STATIC.c === C.scripts) return STATIC;
	const nScripts = Object.keys(C.scripts).length;
	const touch = {}, effects = {};
	const scan = (list, set, eff, depth) => {
		for (const c of list || []) {
			if (!c || typeof c !== 'object') continue;
			if (c.quest) { set.add(c.quest); eff.push({ q: c.quest, stage: c.stage || null, done: !!c.done }); }
			if (c.call && depth < 5) scan(C.scripts[c.call], set, eff, depth + 1);
			for (const k of BRANCH_KEYS) if (Array.isArray(c[k])) scan(c[k], set, eff, depth);
			if (Array.isArray(c.choice)) for (const o of c.choice) scan(o?.then, set, eff, depth);
		}
	};
	for (const id in C.scripts) { const set = new Set(), eff = []; scan(C.scripts[id], set, eff, 0); touch[id] = set; effects[id] = eff; }
	// contadores de una sola escena (el guion los pone a 0 antes de usarlos): no son algo que reunir
	const scratch = new Set([...JSON.stringify(C.scripts).matchAll(/"vars\.(\w+)":0[,}]/g)].map(m => m[1]));
	STATIC = { n: nScripts, c: C.scripts, touch, effects, scratch };
	return STATIC;
}
/** Para cada guion, qué misiones toca (directamente o por `call`). Compatible con el índice de antes. */
export function questTouches() { return staticIndex().touch; }
/** Qué cambios de misión puede hacer un guion: [{ q, stage, done }]. */
export function questEffects(script) { return typeof script === 'string' ? staticIndex().effects[script] || [] : []; }
const touchOf = script => typeof script === 'string' ? (staticIndex().touch[script] || new Set()) : touchList(script);
function touchList(list) { const set = new Set(); const s = staticIndex(); (function scan(l, d) { for (const c of l || []) { if (!c || typeof c !== 'object') continue; if (c.quest) set.add(c.quest); if (c.call && d < 5) for (const q of s.touch[c.call] || []) set.add(q); for (const k of BRANCH_KEYS) if (Array.isArray(c[k])) scan(c[k], d); if (Array.isArray(c.choice)) for (const o of c.choice) scan(o?.then, d); } })(list, 0); return set; }

// =================== Qué guion corre un sitio ===================
/** Normaliza un elemento de tramo (`{ talk }` o `{ spot }`) o un spot a { label, new, talk, script, action, cond, icon, sub }. */
export function asSpot(it) {
	if (!it) return it;
	if (it.spot) return { ...it.spot, label: it.label || it.spot.label, new: it.new !== undefined ? it.new : it.spot.new, icon: it.icon || it.spot.icon, sub: it.sub || it.spot.sub };
	return it;
}
/** El guion que correría tocar este sitio ahora mismo (mismo orden que la pantalla): id de guion, lista en línea o null. */
function activeScript_(s) {
	s = asSpot(s);
	if (!s) return null;
	const a = s.action || {};
	const first = list => { const v = (list || []).find(e => ok(e.cond)); return v ? (v.script || v.do || null) : null; };
	if (s.script) return s.script;
	if (Array.isArray(s.talk)) return first(s.talk);
	if (a.script) return a.script;
	if (Array.isArray(a.talk)) return first(a.talk);
	return null;
}

// =================== Sonda: ¿qué haría este guion ahora? ===================
const tblOf = ns => ({ flag: G.flags, flags: G.flags, vars: G.vars, var: G.vars, rep: G.rep, af: G.af }[ns]);
const emptyish = v => v === undefined || v === false || v === 0 || v === null || v === '';
/**
 * Recorre en seco un guion con el estado de ahora, como lo haría guion.js pero sin interfaz.
 * Los cambios sencillos (`set`, `quest`, `give`, `take`, `money`…) se aplican de verdad a la partida mientras dura la
 * sonda y se deshacen al final, así las condiciones que vienen después se evalúan exactas (un `if` que comprueba lo
 * que el propio guion acaba de poner). Tras lo que no se puede saber sin jugarlo (combates, decisiones que cambian
 * cosas, minijuegos), se exploran todas las ramas (aproximación por exceso).
 * Devuelve { acts, kinds, quests, gives, blockers, firstEnd, text }:
 *   acts: cambiaría algo · quests: misiones que empezaría, movería de etapa o terminaría · gives: objetos que daría
 *   blockers: condiciones que ahora impiden una rama que mueve misiones [{ cond, quests }] (de ahí, «Lo que necesitas»)
 *   firstEnd: termina (`{ end: true }`) antes de decir o hacer nada
 */
function probe_(script) {
	if (!script) return EMPTY_PROBE;
	const C1 = CUR;
	const key = typeof script === 'string' ? script : JSON.stringify(script);
	if (C1.probes.has(key)) return C1.probes.get(key);
	const R = { acts: false, kinds: new Set(), quests: new Set(), gives: new Set(), blockers: [], firstEnd: false, text: false };
	const list = typeof script === 'string' ? C.scripts[script] : script;
	// cambios aplicados durante la sonda, para deshacerlos
	const undo = [];
	const put = (obj, k, v) => { undo.push([obj, k, Object.prototype.hasOwnProperty.call(obj, k), obj[k]]); if (v === undefined) delete obj[k]; else obj[k] = v; };
	const rollback = n => { while (undo.length > n) { const [o, k, had, v] = undo.pop(); if (had) o[k] = v; else delete o[k]; } };
	const eff = (st, kind, dirty = false) => { R.acts = true; R.kinds.add(kind); if (dirty) st.dirty = true; };
	const applySet = (path, value) => {
		const [ns, ...rest] = path.split('.');
		const k = rest.join('.'), tbl = tblOf(ns);
		if (!tbl) return { changed: true, exact: false };
		let v = value;
		if (typeof v === 'string' && v.startsWith('=')) return { changed: true, exact: false };
		if (typeof v === 'string' && /^[+-]\d+$/.test(v)) { const d = parseInt(v, 10); if (!d) return { changed: false, exact: true }; v = (tbl[k] || 0) + d; }
		if (ns === 'rep') v = Math.max(-100, Math.min(100, v));
		if (ns === 'af') v = Math.max(0, Math.min(100, v));
		const changed = tbl[k] === undefined ? !emptyish(v) : tbl[k] !== v;
		if (changed) put(tbl, k, v);
		return { changed, exact: true };
	};
	/** Ramas alternativas (decisiones, resultados de combate o de puzle): cada una se recorre aparte y se deshace. */
	const branches = (st, depth, list) => {
		const mark = undo.length;
		let any = false;
		for (const [cmds, pre] of list) {
			const s2 = { dirty: st.dirty }, before = R.acts;
			R.acts = false;
			pre?.();
			walk(cmds, s2, depth);
			any ||= R.acts || s2.dirty;
			R.acts ||= before;
			rollback(mark);
		}
		if (any) st.dirty = true;
	};
	const walk = (list, st, depth) => {
		for (const c of list || []) {
			if (st.stop) return;
			if (typeof c === 'string') { R.text = true; continue; }
			if (!c || typeof c !== 'object') continue;
			if (c.cond !== undefined && !st.dirty && !ok(c.cond)) {
				const t = cmdTouches(c);
				if (t.size) R.blockers.push({ cond: c.cond, quests: t });
				continue;
			}
			if (c.say !== undefined || c.text !== undefined) { R.text = true; continue; }
			if (c.choice) {
				// cada opción se explora por separado; si alguna cambia algo, lo que sigue ya no es exacto
				branches(st, depth, c.choice.filter(o => o && (st.dirty || o.cond === undefined || ok(o.cond))).map(o => [o.then, null]));
				continue;
			}
			if (c.if !== undefined) {
				if (!st.dirty) {
					const v = ok(c.if);
					if (!v && c.then) { const t = touchList(c.then); if (t.size) R.blockers.push({ cond: c.if, quests: t }); }
					const br = v ? c.then : c.else;
					if (br) walk(br, st, depth);
				} else {
					const mark = undo.length;
					for (const br of [c.then, c.else]) if (br) { walk(br, { dirty: true }, depth); rollback(mark); }
				}
				continue;
			}
			// mismo orden que runCmd en guion.js (un comando con dos claves solo hace la primera)
			if (c.set) {
				let changed = false, exact = true;
				for (const k in c.set) { const r = applySet(k, c.set[k]); changed ||= r.changed; exact &&= r.exact; }
				if (changed) eff(st, 'estado', !exact);
				continue;
			}
			if (c.rep || c.af) {
				const ns = c.rep ? 'rep' : 'af', obj = c.rep || c.af;
				let changed = false;
				for (const k in obj) changed ||= applySet(ns + '.' + k, (obj[k] >= 0 ? '+' : '') + obj[k]).changed;
				if (changed) eff(st, 'afinidad');
				continue;
			}
			if (c.give) { const id = toID(c.give); R.gives.add(id); put(G.bag, id, (G.bag[id] || 0) + (c.n || 1)); eff(st, 'objeto'); continue; }
			if (c.take) { const id = toID(c.take), n = c.n || 1; if ((G.bag[id] || 0) >= n) { put(G.bag, id, G.bag[id] - n); eff(st, 'objeto'); } continue; } // (a 0, sin borrar la clave: así no cambia el orden ni la huella)
			if (c.money !== undefined) { if (c.money) { put(G.player, 'money', Math.max(0, G.player.money + c.money)); eff(st, 'dinero'); } continue; }
			if (c.pokemon) { eff(st, 'pokemon', true); continue; }
			if (c.battle || c.wild) {
				eff(st, 'combate');
				// cada resultado es una rama (como una decisión); al ganar a un entrenador, cuenta como vencido
				const win = () => { if (c.battle) put(G.beaten, c.battle, (G.beaten[c.battle] || 0) + 1); };
				branches(st, depth, ['onWin', 'onCatch', 'onRun', 'onLose'].filter(k => c[k]).map(k => [c[k], k === 'onWin' ? win : null]));
				win(); // lo que sigue al combate se ve tras ganarlo (o con lose: 'continue')
				continue;
			}
			if (c.heal) continue;
			if (c.go) { if (c.go !== G.loc) { put(G, 'loc', c.go); eff(st, 'lugar'); } continue; }
			if (c.quest) {
				const q = G.quests[c.quest];
				if (q?.done) continue; // una misión terminada no se reabre (guion.js)
				const isNew = !q;
				const stage = c.done ? (c.stage || q?.stage || 'hecha') : (c.stage || q?.stage || '');
				const changed = isNew || !!c.done || stage !== (q?.stage || '');
				if (!changed) continue;
				R.quests.add(c.quest);
				put(G.quests, c.quest, { ...(q || { started: 0 }), stage, ...(c.done ? { done: true } : {}) });
				eff(st, 'misión');
				continue;
			}
			if (c.diary || c.intel) { eff(st, 'diario'); continue; }
			if (c.badge) { if (!G.player.badges.includes(c.badge)) { put(G.player, 'badges', G.player.badges.concat(c.badge)); eff(st, 'medalla'); } continue; }
			if (c.cap !== undefined) { if (c.cap !== G.vars.cap) { put(G.vars, 'cap', c.cap); eff(st, 'tope'); } continue; }
			if (c.call) { if (depth < 6) walk(C.scripts[c.call], st, depth + 1); if (st.stop) return; continue; }
			if (c.end) { if (!R.acts && !R.text) R.firstEnd = true; st.stop = true; return; }
			if (c.notice || c.toast || c.scene !== undefined || c.wait) continue;
			if (c.happy) continue;
			if (c.learn || c.forceEvolve) { eff(st, 'pokemon', true); continue; }
			if (c.unlock) { if (!G.flags['mec_' + c.unlock]) { put(G.flags, 'mec_' + c.unlock, true); eff(st, 'estado'); } continue; }
			if (c.mapUnlock) { if (!G.flags['map_' + c.mapUnlock]) { put(G.flags, 'map_' + c.mapUnlock, true); eff(st, 'estado'); } continue; }
			if (c.clearRoute) { if (!G.cleared[c.clearRoute]) { put(G.cleared, c.clearRoute, true); eff(st, 'estado'); } continue; }
			if (c.venture) { if (c.join && !G.neg?.[c.venture]?.owned) eff(st, 'negocio', true); continue; }
			if (c.puzzle || c.minigame) {
				// el botín de un minijuego es al azar: lo que venga después ya no es exacto
				eff(st, c.puzzle ? 'puzle' : 'minijuego', !!c.minigame);
				if (c.minigame) for (const x of [...(c.minigame.guaranteed || []), ...(c.minigame.loot || []).map(e => e.id)]) R.gives.add(toID(x));
				branches(st, depth, ['onSolve', 'onQuit', 'onWin', 'onLose'].filter(k => c[k]).map(k => [c[k], null]));
				continue;
			}
			if (c.input) { eff(st, 'estado', true); continue; }
			// tiendas, curas, guardado, cinemáticas, lecturas…: no cambian nada que el hub tenga que anunciar
		}
	};
	PROBING++;
	try { walk(list, { dirty: false }, 0); } finally { rollback(0); PROBING--; }
	C1.probes.set(key, R);
	return R;
}
const EMPTY_PROBE = Object.freeze({ acts: false, kinds: new Set(), quests: new Set(), gives: new Set(), blockers: [], firstEnd: false, text: false });
function cmdTouches(c) {
	const set = new Set();
	if (c.quest) set.add(c.quest);
	if (c.call) for (const q of staticIndex().touch[c.call] || []) set.add(q);
	for (const k of BRANCH_KEYS) if (Array.isArray(c[k])) for (const q of touchList(c[k])) set.add(q);
	if (Array.isArray(c.choice)) for (const o of c.choice) for (const q of touchList(o?.then)) set.add(q);
	return set;
}

/** Sonda de un sitio entero: el guion activo y, en los diálogos, las variantes anteriores que su condición bloquea. */
function probeSite_(s) {
	s = asSpot(s);
	const sc = activeScript(s);
	const P = probe(sc);
	const talk = Array.isArray(s?.talk) ? s.talk : Array.isArray(s?.action?.talk) ? s.action.talk : null;
	if (!talk || s.script) return P;
	const extra = [];
	for (const v of talk) {
		if (ok(v.cond)) break;
		const t = touchOf(v.script || v.do);
		if (t.size) extra.push({ cond: v.cond, quests: t });
	}
	return extra.length ? { ...P, blockers: extra.concat(P.blockers) } : P;
}

// =================== Marcas de los sitios ===================
/**
 * Qué señal lleva un sitio: { kind: 'new', q } misión que empezaría, { kind: 'active', q } misión en curso que aquí
 * avanza, { kind: 'hint' } novedad sin misión (`new` del contenido y el guion de ahora cambia algo), o null.
 */
function spotMarker_(s) {
	s = asSpot(s);
	if (!s) return null;
	const C1 = CUR;
	if (C1.marks.has(s)) return C1.marks.get(s);
	const m = computeMarker(s, 0);
	C1.marks.set(s, m);
	return m;
}
function computeMarker(s, depth) {
	const a = s.action || {};
	const sc = activeScript(s);
	const touch = touchOf(sc);
	if (HUB_OPTS.markers === 'static') return staticMarker(s, sc, touch);
	if (sc) {
		const P = probe(sc);
		if (!P.acts) return null; // solo habla o termina en la primera línea: nada que anunciar
		let active = null;
		for (const q of P.quests) {
			if (!C.quests[q]) continue;
			const st = G.quests[q];
			if (!st) return { kind: 'new', q };
			if (!st.done && !active) active = { kind: 'active', q };
		}
		if (active) return active;
		// cambia algo de una misión en curso sin moverla de etapa (p. ej., te da lo que pide)
		for (const q of touch) if (C.quests[q] && G.quests[q] && !G.quests[q].done) return { kind: 'active', q };
		if (s.new !== undefined && ok(s.new)) return { kind: 'hint' };
		return null;
	}
	if (s.new === undefined || !ok(s.new)) return null;
	// servicios (tienda, Centro, PC): la pantalla los pone en píldoras sin señal; abrirlos no cambia nada
	if (a.shop || a.center || a.pc) return null;
	// sin guion: puertas, combates, premios… solo si de verdad hay algo
	if (a.go) {
		if (!enterOk(a.go).ok) return null;
		if (!G.visited[a.go]) return { kind: 'hint' };
		return depth < 2 && locHasMarks(a.go, depth + 1) ? { kind: 'hint' } : null;
	}
	if (a.trainer) return G.beaten[a.trainer] && !a.repeat ? null : { kind: 'hint' };
	if (a.training) { const pz = prizeState(a.training); return pz && !pz.claimed && pz.ready ? { kind: 'hint' } : null; }
	return { kind: 'hint' };
}
function staticMarker(s, sc, touch) {
	let active = null, touchedAny = false;
	for (const q of touch) {
		if (!C.quests[q]) continue;
		touchedAny = true;
		const st = G.quests[q];
		if (!st) return { kind: 'new', q };
		if (!st.done && !active) active = { kind: 'active', q };
	}
	if (active) return active;
	if (s.new !== undefined && ok(s.new) && !touchedAny) return { kind: 'hint' };
	return null;
}
/** ¿Hay dentro de este lugar algún sitio con señal? (para las puertas con `new`). */
function locHasMarks(id, depth = 0) {
	const loc = L(id);
	if (!loc) return false;
	let spots = [];
	try { spots = spotsAt(loc); } catch (e) { return false; }
	return spots.some(s => computeMarker(asSpot(s), depth));
}

// =================== Premios de instructor ===================
/** Estado del premio de una zona de entrenamiento: { claimed, wins, need, ready } o null si no tiene. */
function prizeState_(t) {
	const pz = t?.prize;
	if (!pz?.script || !C.scripts[pz.script]) return null;
	const need = pz.wins || 3, wins = (t.trainers || []).reduce((a, id) => a + (G.beaten[id] || 0), 0);
	return { claimed: !!G.flags['premio:' + pz.script], wins: Math.min(wins, need), need, ready: wins >= need };
}

// =================== Lugares a los que de verdad puedes ir ahora ===================
/**
 * Un edificio o zona interior solo cuenta si hoy existe una entrada visible hasta él (un sitio «ir a…» o un desvío
 * de ruta) desde un lugar que ya conoces. Así ni las Novedades ni el Diario enseñan (ni dejan viajar a) sitios cuya
 * puerta la historia aún no ha abierto, o trenes que ya se fueron. Los lugares de primer nivel cuentan si los visitaste.
 */
function reachable_() {
	const C1 = CUR;
	if (C1.reach) return C1.reach;
	const R = new Set(), queue = [];
	if (HUB_OPTS.reach === 'visited') {
		for (const loc of Object.values(C.locations)) { const top = topLoc(loc.id); if (G.visited[loc.id] || G.visited[top?.id]) R.add(loc.id); }
		R.add(G.loc);
		C1.reach = R;
		return R;
	}
	const add = id => { if (id && L(id) && !R.has(id)) { R.add(id); queue.push(id); } };
	// una puerta cerrada (enterCond) no es una entrada: lo de dentro no se anuncia ni se puede viajar allí
	const door = id => id && L(id)?.parent && enterOk(id).ok;
	for (const loc of Object.values(C.locations)) if (!loc.parent && G.visited[loc.id]) add(loc.id);
	add(G.loc);
	while (queue.length) {
		const loc = L(queue.pop());
		if (!enterOk(loc.id).ok && loc.id !== G.loc) continue;
		let spots = [];
		try { spots = spotsAt(loc); } catch (e) { spots = []; }
		for (const s of spots) { const go = s.action?.go; if (door(go)) add(go); }
		if (loc.route) for (let n = 0; n <= (loc.route.length || 0); n++) for (const it of tramoAt(loc, n)) {
			if (door(it.branch?.go) && ok(it.branch.cond)) add(it.branch.go);
			const go = it.spot?.action?.go; if (door(go)) add(go);
		}
	}
	C1.reach = R;
	return R;
}

// =================== Sitios de ahora ===================
/** «Ciudad › Edificio · tramo n» */
export function placeOf(loc, n = null) {
	const top = topLoc(loc.id);
	return (top && top.id !== loc.id ? `${top.name} › ${loc.name}` : loc.name) + (n !== undefined && n !== null ? ` · tramo ${n}` : '');
}
const enterKey = (locId, e, i) => 'enter:' + locId + ':' + (e.script || i);
/** Escenas «al entrar» de un lugar que todavía saltarían (una vez, con su condición cumplida). */
function pendingEnters_(loc) {
	const list = (loc.onEnter || []).concat(...events().map(e => e.onEnter?.[loc.id] || []));
	return list.map((e, i) => ({ e, i })).filter(({ e, i }) => e.script && e.once !== false && !G.flags[enterKey(loc.id, e, i)] && ok(e.cond));
}
/**
 * Todo lo que hoy se puede tocar o que pasará solo, en lugares alcanzables:
 *   { kind: 'spot'|'tramo'|'enter'|'arrive'|'prize', loc, tramo, s, script, label, where, here }
 *   spot: un sitio que se toca · tramo: escena que salta al pisar ese tramo · enter: escena al entrar en un lugar
 *   conocido (here = estás dentro: salta al volver a entrar) · arrive: al llegar por primera vez a un lugar vecino
 *   prize: premio de instructor listo.
 */
function sites_() {
	const C1 = CUR;
	if (C1.sites) return C1.sites;
	const out = [];
	const R = reachable();
	for (const loc of Object.values(C.locations)) {
		if (!R.has(loc.id)) continue;
		if (loc.hidden !== undefined && ok(loc.hidden) && loc.id !== G.loc) continue;
		let spots = [];
		try { spots = spotsAt(loc); } catch (e) { spots = []; }
		for (const s of spots) {
			const a = s.action || {};
			if (a.training) { const pz = prizeState(a.training); if (pz && !pz.claimed && pz.ready) out.push({ kind: 'prize', loc, tramo: null, s, script: a.training.prize.script, label: s.label, where: placeOf(loc) }); }
			out.push({ kind: 'spot', loc, tramo: null, s, script: activeScript(s), label: s.label, where: placeOf(loc) });
		}
		if (loc.route && G.visited[loc.id]) {
			const pr = G.routeProg?.[loc.id] || { done: {} };
			for (let n = 0; n <= (loc.route.length || 0); n++) for (const it of tramoAt(loc, n)) {
				if (it.talk || it.spot) { const s = asSpot(it); out.push({ kind: 'spot', loc, tramo: n, s, raw: it, script: activeScript(s), label: s.label || 'Alguien quiere hablar contigo', where: placeOf(loc, n) }); }
				if (it.script && it.once !== false && !pr.done?.[n + ':' + it.script]) out.push({ kind: 'tramo', loc, tramo: n, s: it, script: it.script, label: `Tramo ${n}`, where: placeOf(loc, n) });
			}
		}
		if (G.visited[loc.id] && enterOk(loc.id).ok) for (const { e } of pendingEnters(loc)) out.push({ kind: 'enter', loc, tramo: null, s: e, script: e.script, label: loc.name, where: placeOf(loc), here: loc.id === G.loc });
		// edificios con la puerta ya a la vista donde aún no has entrado: lo que pasa al entrar
		else if (!G.visited[loc.id] && loc.parent && enterOk(loc.id).ok) for (const { e } of pendingEnters(loc)) out.push({ kind: 'arrive', inside: true, loc, tramo: null, s: e, script: e.script, label: loc.name, where: `Al entrar en ${placeOf(loc)}` });
	}
	// Lugares que conoces pero no has pisado: lo que pasa al llegar (así se ve hacia dónde sigue la historia)
	const known = new Set();
	for (const id in G.visited) for (const n of L(id)?.links || []) if (!G.visited[n]) known.add(n);
	for (const id of known) {
		const loc = L(id);
		if (!loc || (loc.hidden !== undefined && ok(loc.hidden))) continue;
		for (const { e } of pendingEnters(loc)) out.push({ kind: 'arrive', loc, tramo: null, s: e, script: e.script, label: loc.name, where: `Al llegar a ${loc.name}` });
	}
	for (const x of out) x.probe = x.kind === 'spot' ? probeSite(x.s) : probe(x.script);
	C1.sites = out;
	return out;
}
/** Misiones que un sitio hace avanzar (o en las que cambia algo) ahora mismo. */
function siteQuests_(x) {
	const P = x.probe || probe(x.script);
	const qs = new Set([...P.quests].filter(q => C.quests[q]));
	if (P.acts) for (const q of touchOf(x.script)) if (C.quests[q] && G.quests[q] && !G.quests[q].done) qs.add(q);
	return qs;
}

// =================== Misiones: dónde, qué necesitas y en qué estado están ===================
/** Texto de un sitio para la ficha: «Ciudad · Edificio · Etiqueta» o «Al llegar a X». */
function siteText(x) {
	if (x.kind === 'arrive') return x.where;
	if (x.kind === 'enter') return x.here ? `Al volver a entrar en ${x.loc.name}` : `Al llegar a ${x.loc.name}`;
	const top = topLoc(x.loc.id);
	const where = (top && top.id !== x.loc.id ? `${top.name} · ${x.loc.name}` : x.loc.name) + (x.tramo !== null && x.kind !== 'spot' ? ` · tramo ${x.tramo}` : '');
	if (x.kind === 'tramo') return `${where} · al pasar por el tramo ${x.tramo}`;
	if (x.kind === 'prize') return `${where} · ${x.label} (premio listo)`;
	return x.label ? `${where} · ${x.label}` : where;
}
/** Para cada misión, los sitios de ahora donde se empieza o avanza: { [q]: [texto] } (mismo formato que antes). */
function questPlaces_() {
	const C1 = CUR;
	if (C1.places) return C1.places;
	const out = {}, full = {};
	for (const x of sites()) for (const q of siteQuests(x)) {
		const t = siteText(x);
		const arr = (out[q] ||= []);
		if (!arr.includes(t)) { arr.push(t); (full[q] ||= []).push({ ...x, text: t }); }
	}
	C1.places = out; C1.placesFull = full;
	return out;
}
/** Igual que questPlaces, pero con el sitio entero (lugar, tramo, tipo…), para viajar o auditar. */
function questSites_(id) { questPlaces(); return (CUR.placesFull || {})[id] || []; }
export const questSites = api(questSites_);

const NEED_RX = [
	[/(^|[^!\w.])has\("(\w+)"\)/g, (m) => ({ kind: 'item', id: m[2], n: 1 })],
	[/(^|[^!\w.])count\("(\w+)"\)\s*>=\s*(\d+)/g, (m) => ({ kind: 'item', id: m[2], n: +m[3] })],
	[/(^|[^!\w.])inParty\("(\w+)"\)/g, (m) => ({ kind: 'party', id: m[2] })],
	[/(^|[^!\w.])(seen|caught|owns)\("(\w+)"\)/g, (m) => ({ kind: m[2], id: m[3] })],
	[/(^|[^!\w.])vars\.(\w+)\s*>=\s*(\d+)/g, (m) => ({ kind: 'var', id: m[2], n: +m[3] })],
	[/(^|[^!\w.])beat\("(\w+)"\)/g, (m) => ({ kind: 'beat', id: m[2] })],
];
/** Una condición vale para la misión si no habla de otra etapa suya (si menciona una, debe ser la actual). */
function stageOk(cond, id, stage) {
	const m = [...String(cond).matchAll(new RegExp(`quest\\.${id}\\s*==\\s*["'](\\w+)["']`, 'g'))];
	return !m.length || m.some(x => x[1] === stage);
}
/**
 * Lo que pide la etapa actual de una misión: las condiciones que hoy bloquean una rama que la haría avanzar en un
 * sitio que se ve (diálogos con variantes, `if` de su guion, escenas de tramo que esperan algo).
 * Cada necesidad: { kind: 'item'|'var'|'party'|'seen'|'caught'|'owns'|'beat', id, n?, alt, ok, where: [texto] }.
 */
function questNeeds_(id) {
	const q = G.quests[id];
	if (!q || q.done) return [];
	const C1 = CUR;
	if (C1.needs.has(id)) return C1.needs.get(id);
	const conds = []; // [{ cond, where }]
	for (const x of sites()) for (const b of x.probe.blockers) if (b.quests.has(id) && stageOk(b.cond, id, q.stage)) conds.push({ cond: b.cond, where: siteText(x) });
	// escenas de tramo que se disparan solas cuando cumples algo (p. ej., al encontrar un objeto)
	const R = reachable();
	for (const loc of Object.values(C.locations)) {
		if (!loc.route || !R.has(loc.id) || !G.visited[loc.id]) continue;
		const pr = G.routeProg?.[loc.id] || { done: {} };
		for (let n = 0; n <= (loc.route.length || 0); n++) {
			const raw = [].concat(loc.route.tramos?.[n] || []);
			for (const e of events()) if (e.tramos?.[loc.id]?.[n]) raw.push(...e.tramos[loc.id][n]);
			for (const it of raw) if (it.script && it.cond !== undefined && !ok(it.cond) && !pr.done?.[n + ':' + it.script] && touchOf(it.script).has(id) && stageOk(it.cond, id, q.stage)) conds.push({ cond: it.cond, where: placeOf(loc, n) });
		}
	}
	// Modo antiguo (solo pruebas): también los diálogos que ya no se ven
	if (HUB_OPTS.needsHidden) for (const loc of Object.values(C.locations)) for (const sp of loc.spots || []) {
		if (ok(sp.cond)) continue;
		for (const t of [].concat(sp.talk || [])) if (t.cond && touchOf(t.script).has(id) && stageOk(t.cond, id, q.stage)) conds.push({ cond: t.cond, where: placeOf(loc) });
	}
	const scratch = staticIndex().scratch;
	const out = [], byKey = new Map();
	for (const { cond, where } of conds) for (const [rx, mk] of NEED_RX) for (const m of String(cond).matchAll(rx)) {
		const n = mk(m);
		if (n.kind === 'var' && scratch.has(n.id)) continue;
		const k = n.kind + ':' + n.id;
		let cur = byKey.get(k);
		if (!cur) { cur = { ...n, alt: /\|\|/.test(cond), where: [] }; byKey.set(k, cur); out.push(cur); }
		if (n.n > (cur.n || 0)) cur.n = n.n;
		if (!cur.where.includes(where)) cur.where.push(where);
	}
	for (const n of out) n.ok = needMet(n);
	C1.needs.set(id, out);
	return out;
}
/** ¿Ya cumples esta necesidad? */
function needMet_(n) {
	const num = D.species?.[n.id]?.num;
	switch (n.kind) {
		case 'item': return count(n.id) >= (n.n || 1);
		case 'var': return (G.vars[n.id] || 0) >= n.n;
		case 'beat': return !!G.beaten[n.id];
		case 'party': return G.party.some(p => p.sp === n.id || D.species[p.sp]?.base === n.id);
		case 'seen': return !!G.dex.seen[num];
		case 'caught': return !!G.dex.caught[num];
		case 'owns': return G.party.some(p => p.sp === n.id) || G.boxes.some(b => b.some(p => p.sp === n.id));
		default: return false;
	}
}
/** ¿Se puede conseguir hoy este objeto? Tiendas, recolección, objetos del suelo o un sitio de ahora que lo da. */
function itemObtainable_(itemId) {
	itemId = toID(itemId);
	if (sites().some(x => x.probe.gives.has(itemId))) return 'sitio';
	const R = reachable();
	for (const loc of Object.values(C.locations)) {
		if (!R.has(loc.id)) continue;
		let spots = [];
		try { spots = spotsAt(loc); } catch (e) { spots = []; }
		if (loc.route) for (let n = 0; n <= (loc.route.length || 0); n++) for (const it of tramoAt(loc, n)) {
			if (it.item && toID(it.item) === itemId && !G.routeProg?.[loc.id]?.items?.[n + ':' + it.item]) return 'suelo';
			if (it.spot) spots.push(it.spot);
		}
		for (const s of spots) {
			const a = s.action || {};
			if (a.shop && C.shops[a.shop]) for (const e of C.shops[a.shop].items || []) { const o = typeof e === 'string' ? { id: e } : e; if (toID(o.id) === itemId && ok(o.cond)) return 'tienda'; }
			const g = a.gather && C.gather[a.gather];
			if (g) for (const e of g.table || []) if (toID(e.id) === itemId && ok(e.cond)) return 'recolección';
		}
	}
	return null;
}

/**
 * Estado de una misión para el Diario, el recuadro 📌 y el mapa:
 *   { status: 'todo'|'waiting'|'available'|'done', reason, places, needs }
 *   reason: 'sitio' (hay dónde avanzarla), 'necesita' (te falta algo que se consigue), 'explorar' (historia
 *   principal: sigue en un lugar que aún no pisas), 'nada' (espera a que pase algo más adelante).
 */
function questStatus_(id) {
	const def = C.quests[id];
	if (!def) return { status: 'none', reason: 'sin definición', places: [], needs: [] };
	const C1 = CUR;
	if (C1.status.has(id)) return C1.status.get(id);
	const q = G.quests[id];
	const places = questPlaces()[id] || [];
	let r;
	if (q?.done) r = { status: 'done', reason: 'hecha', places: [], needs: [] };
	else if (!q) r = { status: places.length ? 'available' : 'none', reason: places.length ? 'sitio' : 'nada', places, needs: [] };
	else {
		const needs = questNeeds(id);
		const missing = needs.filter(n => !n.ok);
		const gettable = missing.filter(n => n.kind !== 'item' || itemObtainable(n.id));
		if (places.length) r = { status: 'todo', reason: 'sitio', places, needs };
		else if (gettable.length) r = { status: 'todo', reason: 'necesita', places, needs };
		else if ((def.type || 'side') === 'main' && exploreSites(id).length) r = { status: 'todo', reason: 'explorar', places, needs };
		else r = { status: 'waiting', reason: 'nada', places, needs };
	}
	C1.status.set(id, r);
	return r;
}
/** ¿«Por hacer»? (lo que antes era isTodo en el Diario) */
export const isTodo = id => questStatus(id).status === 'todo';

/**
 * Sitios del contenido publicado que harían avanzar la etapa actual de una misión pero están en lugares que aún no
 * pisas (la historia sigue más allá): spots, escenas de tramo y escenas al entrar, cuya condición ya se cumple.
 */
function exploreSites_(id) {
	const q = G.quests[id];
	if (!q || q.done) return [];
	const C1 = CUR;
	const key = 'x:' + id;
	if (C1.status.has(key)) return C1.status.get(key);
	const R = reachable();
	const out = [];
	const advances = sc => questEffects(sc).some(e => e.q === id && (e.done || (e.stage && e.stage !== q.stage)));
	for (const loc of Object.values(C.locations)) {
		if (R.has(loc.id) || !enterOk(loc.id).ok) continue;
		if (loc.parent && !G.visited[topLoc(loc.id)?.id]) { /* sub-lugar de un sitio por descubrir: cuenta */ } else if (loc.parent) continue;
		for (const s of loc.spots || []) if (ok(s.cond) && [].concat(s.talk || []).concat(s.action?.talk || []).map(t => t.script).concat(s.script, s.action?.script).filter(Boolean).some(advances)) out.push({ loc: loc.id });
		for (const e of loc.onEnter || []) if (e.script && ok(e.cond) && advances(e.script)) out.push({ loc: loc.id });
		if (loc.route) for (const n in loc.route.tramos || {}) for (const it of [].concat(loc.route.tramos[n] || [])) if (it.script && ok(it.cond) && advances(it.script)) out.push({ loc: loc.id, tramo: +n });
	}
	C1.status.set(key, out);
	return out;
}

/** Misión colgada: ningún guion publicado pone una etapa posterior ni la termina. */
function questHangs_(id) {
	const q = G.quests[id], def = C.quests[id];
	if (!q || q.done || !def) return false;
	const keys = Object.keys(def.stages || {});
	const at = keys.indexOf(q.stage);
	const idx = st => keys.indexOf(st);
	for (const sc in C.scripts) for (const e of questEffects(sc)) if (e.q === id && (e.done || (e.stage && e.stage !== q.stage && (at < 0 || idx(e.stage) < 0 || idx(e.stage) > at)))) return false;
	return true;
}

// =================== Novedades ===================
// Pedido de Mario (2026-10-10): «notificaciones o alguna mecánica para saber de misiones nuevas o recién aparecidas».
// Rotom revisa todos los lugares alcanzables y lista lo que hay nuevo: misiones que alguien ofrece, misiones tuyas
// que aquí avanzan, gente con algo nuevo («•»), escenas que pasarán al llegar a un sitio, premios listos y negocios.
// Solo entra lo que de verdad haría algo hoy (ver `probe`).
function newsScan_() {
	const C1 = CUR;
	if (!C1.news) C1.news = scanSites();
	return C1.news.concat(scanVentures());
}
function scanSites() {
	const out = [], seen = new Set();
	const put = it => { if (seen.has(it.key)) return; seen.add(it.key); out.push(it); };
	const touch = staticIndex().touch;
	for (const x of sites()) {
		const { loc, tramo: n } = x;
		const place = x.kind === 'tramo' || x.kind === 'spot' ? placeOf(loc, n) : placeOf(loc);
		if (x.kind === 'prize') { put({ key: 'pz:' + x.script, kind: 'prize', icon: '🎁', title: `Premio listo: ${x.label}`, sub: 'Ya ganaste los combates. Pasa a recogerlo.', loc: loc.id, tramo: n, place }); continue; }
		if (x.kind === 'enter' || (x.kind === 'arrive' && x.inside)) {
			if (x.here || !x.probe.acts) continue;
			const qs = [...(touch[x.script] || [])].filter(q => C.quests[q]);
			const q = qs.find(y => G.quests[y] && !G.quests[y].done) || qs.find(y => !G.quests[y]);
			put({ key: 'e:' + loc.id + ':' + x.script, kind: 'enter', icon: '📍', title: q ? C.quests[q].name : `Algo te espera en ${loc.name}`, sub: x.kind === 'arrive' ? 'Pasará algo cuando entres' : 'Pasará algo cuando llegues', loc: loc.id, tramo: null, place, q });
			continue;
		}
		if (x.kind !== 'spot' || !x.script) continue;
		const s = x.s, label = x.label || 'Alguien quiere hablar contigo';
		const m = spotMarker(s);
		if (!m) continue;
		if (m.kind === 'active') {
			const def = C.quests[m.q], st = G.quests[m.q];
			if (def && st) put({ key: 'a:' + m.q + ':' + (st.stage || ''), kind: 'active', icon: def.type === 'main' ? '⭐' : def.type === 'thread' ? '🧵' : '📜', title: def.name, sub: `Te toca · ${label}`, loc: loc.id, tramo: n, place, q: m.q, label: x.label });
		} else if (m.kind === 'new') {
			const def = C.quests[m.q];
			put({ key: 'q:' + m.q, kind: 'quest', icon: ACTIVE_TYPES[def.type] || '📜', title: def.name, sub: `Misión nueva · ${label}`, loc: loc.id, tramo: n, place, q: m.q, label: x.label });
		} else {
			// El mismo aviso puede estar en varias ciudades (un mensaje que te alcanza donde estés): sale una vez, en el sitio más a mano
			const sc = typeof x.script === 'string' ? x.script : null;
			const key = sc ? 's:' + sc : 's:' + loc.id + ':' + (s.label || '');
			const dup = out.find(o => o.key === key);
			if (dup) { if (loc.id === G.loc || (topLoc(loc.id)?.id === topLoc(G.loc)?.id && topLoc(dup.loc)?.id !== topLoc(G.loc)?.id)) Object.assign(dup, { loc: loc.id, tramo: n, place, label: x.label }); continue; }
			put({ key, kind: 'talk', icon: s.icon || '💬', title: label, sub: s.sub || 'Tiene algo nuevo que decirte', loc: loc.id, tramo: n, place, label: x.label });
		}
	}
	return out;
}
function scanVentures() {
	const out = [];
	for (const v of ventureList()) {
		const place = v.def.loc && L(v.def.loc) ? placeOf(L(v.def.loc)) : '';
		if (v.status === 'offer') out.push({ key: 'v:' + v.id, kind: 'venture', icon: v.def.icon || '🤝', title: v.def.name, sub: 'Buscan socio: puedes invertir', venture: v.id, loc: v.def.loc, place });
		else {
			const p = venturePending(v.id);
			if (v.st.pending) out.push({ key: 'vi:' + v.id + ':' + v.st.pending + ':' + (v.st.lastEvent || 0), kind: 'venture', icon: v.def.icon || '🤝', title: v.def.name, sub: '❗ Hay un imprevisto que decidir', venture: v.id, loc: v.def.loc, place: '' });
			else if (p.full) out.push({ key: 'vf:' + v.id + ':' + Math.floor((v.st.last || 0) / 864e5), kind: 'venture', icon: v.def.icon || '🤝', title: v.def.name, sub: '📦 Almacén lleno: pasa a recoger', venture: v.id, loc: v.def.loc, place: '' });
		}
	}
	return out;
}
/**
 * Novedades con la cuenta de no vistas (en G.news: { known, unread, init }). Devuelve { items, unread, fresh, first }:
 * `fresh` son las que acaban de aparecer (para avisar una vez) y `first` dice si es la primera revisión de la partida.
 */
function newsUpdate_() {
	const N = (G.news ||= { known: {}, unread: {} });
	N.known ||= {}; N.unread ||= {};
	const first = !N.init;
	const items = newsScan();
	const keys = new Set(items.map(i => i.key));
	const fresh = items.filter(i => !N.known[i.key]);
	const t = Date.now();
	for (const i of fresh) { N.known[i.key] = t; N.unread[i.key] = t; }
	for (const k in N.unread) if (!keys.has(k)) delete N.unread[k];
	// lo que desapareció hace mucho se olvida, para que la lista de conocidas no crezca sin fin
	const ks = Object.keys(N.known);
	if (ks.length > 600) for (const k of ks) if (!keys.has(k) && t - N.known[k] > 30 * 864e5) delete N.known[k];
	N.init = true;
	for (const i of items) i.unread = !!N.unread[i.key];
	return { items, unread: items.filter(i => i.unread).length, fresh, first };
}
/** Señales por lugar de primer nivel para el mapa: { [topId]: { news, unread } } */
export function newsByPlace(items) {
	const out = {};
	for (const it of items) {
		if (!it.loc) continue;
		const top = (topLoc(it.loc) || L(it.loc))?.id;
		if (!top) continue;
		const o = (out[top] ||= { news: 0, unread: 0 });
		o.news++; if (it.unread) o.unread++;
	}
	return out;
}

// =================== Viajes ===================
const passable = id => { const l = L(id); return !!l && (isRoute(l) ? !!G.cleared[id] : !!G.visited[id]); };
/**
 * Camino conocido de `start` a `goal` por el mundo: caminos del mapa (rutas despejadas y lugares visitados, como
 * findPath), puertas visibles («ir a…», incluidas las Puertas Lemnis entre regiones) y salidas de los sub-lugares.
 * Devuelve [{ id, via: 'link'|'go'|'exit' }] (sin el inicio) o null.
 */
function routeTo_(start, goal) {
	if (start === goal) return [];
	const prev = { [start]: null };
	const q = [start];
	const R = reachable();
	const edges = id => {
		const l = L(id); if (!l) return [];
		const out = [];
		if (l.parent) out.push({ id: l.parent, via: 'exit' });
		for (const n of l.links || []) if (L(n) && enterOk(n).ok && (passable(n) || n === goal)) out.push({ id: n, via: 'link' });
		if (!isRoute(l)) { let spots = []; try { spots = spotsAt(l); } catch (e) { spots = []; } for (const s of spots) { const go = s.action?.go; if (go && L(go) && enterOk(go).ok && (G.visited[go] || go === goal) && (!L(go).parent || R.has(go))) out.push({ id: go, via: 'go' }); } }
		return out;
	};
	while (q.length) {
		const cur = q.shift();
		for (const e of edges(cur)) {
			if (e.id in prev) continue;
			prev[e.id] = { from: cur, via: e.via };
			if (e.id === goal) {
				const path = [];
				for (let x = goal; prev[x]; x = prev[x].from) path.unshift({ id: x, via: prev[x].via });
				return path;
			}
			q.push(e.id);
		}
	}
	return null;
}
/**
 * Plan para ir a un lugar (o sub-lugar) por caminos conocidos. No mueve nada: la pantalla lo ejecuta entrando en
 * cada paso con enterLocation(id, { from }). Los tramos seguidos por el mapa se recorren de un salto (viaje rápido).
 * { ok, msg, here, reenter, id, steps: [{ id, from }], hops, tramo, fallbackMsg }
 *   here: ya estás · reenter: estás, pero hay una escena que salta al volver a entrar · fallbackMsg: el sub-lugar no
 *   tiene entrada hoy y se va al lugar de fuera.
 */
function travelPlan_(id, tramo = null) {
	let target = L(id);
	if (!target) return { ok: false, msg: 'Lugar desconocido.' };
	if (G.loc === id && (tramo === null || tramo === undefined || G.route?.pos === tramo)) {
		const reenter = !isRoute(target) && pendingEnters(target).length > 0;
		return { ok: true, here: true, reenter, id, steps: reenter ? [{ id, from: id }] : [], hops: 0, tramos: 0, tramo: null };
	}
	let fallbackMsg = null;
	if (target.parent && !reachable().has(id)) { const top = topLoc(id) || target; fallbackMsg = `Ahora mismo no hay forma de entrar en ${target.name}.`; id = top.id; target = top; tramo = null; }
	if (G.loc === id) return { ok: true, here: true, id, steps: [], hops: 0, tramos: 0, tramo: tramo ?? null, fallbackMsg };
	const ce = enterOk(id);
	if (!ce.ok) return { ok: false, fallbackMsg, msg: ce.msg };
	const path = routeTo(G.loc, id);
	if (!path) return { ok: false, fallbackMsg, msg: `Aún no conoces un camino seguro hasta ${(topLoc(id) || target).name}. Ve a pie desde el mapa.` };
	// pasos: las salidas seguidas de un camino del mapa se saltan (como antes, el viaje rápido sale solo) y los
	// caminos del mapa seguidos se recorren de un salto
	const steps = [];
	let from = G.loc;
	for (let i = 0; i < path.length; i++) {
		const h = path[i], nx = path[i + 1];
		if (h.via === 'exit' && nx && nx.via === 'link') { from = h.id; continue; }
		if (h.via === 'link' && nx && nx.via === 'link') { from = h.id; continue; }
		steps.push({ id: h.id, from });
		from = h.id;
	}
	return { ok: true, id, steps, hops: path.length, tramos: path.filter(h => h.via !== 'exit').length, tramo: tramo ?? null, fallbackMsg };
}
/** ¿Se puede salir de aquí? (un sub-lugar siempre tiene «Salir»; un lugar de primer nivel necesita algún camino). */
function canLeave_(id = G.loc) {
	const loc = L(id);
	if (!loc) return false;
	if (loc.parent || loc.route) return true;
	if ((loc.links || []).some(n => L(n) && enterOk(n).ok)) return true;
	try { return spotsAt(loc).some(s => s.action?.go && enterOk(s.action.go).ok); } catch (e) { return false; }
}

// =================== Ficha de misión: datos sin interfaz ===================
/** Nombre de un punto de ruta: «Ruta 5 · tramo 4 de 9 (desde Ciudad Luminalia)». */
export function tramoName(locId, n) {
	const loc = L(locId);
	if (!loc) return locId;
	if (!loc.route || !n) return loc.name;
	const from = L(loc.route.from);
	return `${loc.name} · tramo ${n} de ${loc.route.length}` + (from ? ` (desde ${from.name})` : '');
}
/** Dónde hay un objeto tirado o escondido en las rutas (incluye eventos activos), con tramo y si ya lo recogiste. */
function itemSpots_(itemId) {
	const out = [];
	for (const loc of Object.values(C.locations)) {
		if (!loc.route) continue;
		const pr = G.routeProg?.[loc.id] || { items: {} };
		for (let n = 0; n <= (loc.route.length || 0); n++) {
			const list = [].concat(loc.route.tramos?.[n] || []);
			for (const e of events()) if (e.tramos?.[loc.id]?.[n]) list.push(...e.tramos[loc.id][n]);
			for (const it of list) if (it.item === itemId) {
				const top = topLoc(loc.id);
				out.push({ loc: loc.id, n, hidden: !!it.hidden, got: !!pr.items?.[n + ':' + itemId], known: !!G.visited[loc.id] || !!G.visited[top?.id] || (loc.links || []).some(x => G.visited[x]) });
			}
		}
	}
	return out;
}
/** Partes de una misión (`parts`): [{ label, ok, half, info: [texto] }] y cuántas llevas. */
function questParts_(def) {
	const P = def?.parts;
	if (!P) return null;
	const safe = c => !!c && ok(c);
	const items = (P.items || []).map(it => {
		const isOk = safe(it.done), half = !isOk && safe(it.got);
		const hint = Array.isArray(it.hint) ? (it.hint.find(x => x.cond === undefined || safe(x.cond)) || {}).text : it.hint;
		const info = [];
		if (!isOk) {
			if (it.where) info.push('📍 ' + tramoName(it.where, it.tramo));
			const txt = half ? (it.gotHint || hint) : hint;
			if (txt) info.push(txt);
		}
		return { label: isOk ? (it.doneLabel || it.label) : it.label, ok: isOk, half, info };
	});
	return { title: P.title || 'Lista', var: P.var, items, done: items.filter(i => i.ok).length };
}

// =================== API pública (cada llamada desde fuera fija la caché de su versión de estado) ===================
export const activeScript = activeScript_; // barata: no necesita caché
export const probe = api(probe_);
export const probeSite = api(probeSite_);
export const spotMarker = api(spotMarker_);
export const reachable = api(reachable_);
export const pendingEnters = api(pendingEnters_);
export const sites = api(sites_);
export const siteQuests = api(siteQuests_);
export const questPlaces = api(questPlaces_);
export const questNeeds = api(questNeeds_);
export const needMet = api(needMet_);
export const itemObtainable = api(itemObtainable_);
export const questStatus = api(questStatus_);
export const exploreSites = api(exploreSites_);
export const questHangs = api(questHangs_);
export const newsScan = api(newsScan_);
export const newsUpdate = api(newsUpdate_);
export const routeTo = api(routeTo_);
export const travelPlan = api(travelPlan_);
export const canLeave = api(canLeave_);
export const itemSpots = api(itemSpots_);
export const questParts = api(questParts_);
export const prizeState = prizeState_;
