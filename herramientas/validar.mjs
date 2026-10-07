// Validador de contenido de Pokémon Infinite.
// Uso: node herramientas/validar.mjs [--estricto]
// Sale con código 1 si hay ERRORES. Las ADVERTENCIAS no bloquean (salvo --estricto).
import { loadDataNode } from './test/node-env.mjs';
import { D, toID } from '../app/js/data.js';
import { C, registerBlock } from '../app/js/content.js';
import { canLearn, learnsetOf } from '../app/js/pokemon.js';
import { parsePuzzle, solve } from '../app/js/puzle.js';

const strict = process.argv.includes('--estricto');
loadDataNode();
const mod = await import('../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);

const errors = [], warns = [];
const E = (w, m) => errors.push(`${w}: ${m}`);
const checkGather = () => { for (const [gid, g] of Object.entries(C.gather || {})) { if (!Array.isArray(g.table) || !g.table.length) E('recolección ' + gid, 'tabla vacía'); for (const e of g.table || []) { if (!D.items[e.id]) E('recolección ' + gid, 'objeto inexistente: ' + e.id); if (e.cond) { try { new Function('s', 'with(s){return (' + e.cond + ')}'); } catch (x) { E('recolección ' + gid, 'condición inválida: ' + e.cond); } } } } };
const W = (w, m) => warns.push(`${w}: ${m}`);

const KNOWN_CMDS = new Set(['say', 'text', 'choice', 'if', 'set', 'rep', 'af', 'give', 'take', 'money', 'pokemon', 'battle', 'wild', 'heal', 'go', 'quest', 'diary', 'intel', 'badge', 'cap', 'call', 'end', 'notice', 'toast', 'scene', 'wait', 'happy', 'learn', 'unlock', 'shop', 'save', 'evolveCheck', 'nickname', 'center', 'pc', 'mapUnlock', 'clearRoute', 'cutscene', 'input', 'forceEvolve', 'puzzle']);
const AUX_KEYS = new Set(['cond', 'as', 'n', 'silent', 'stage', 'done', 'then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'lose', 'canRun', 'prompt', 'nickname', 'who', 'jingle', 'dim', 'mood', 'onSolve', 'onQuit']);
const COND_NS = /\b(flag|flags|vars|rep|af|quest|done)\.([A-Za-z0-9_]+)/g;
const COND_FUNCS = ['has', 'count', 'badge', 'inParty', 'owns', 'seen', 'caught', 'visited', 'cleared', 'beat', 'date', 'zero'];
const COND_VARS = ['badges', 'money', 'maxLv', 'partySize', 'pron', 'time', 'night', 'day', 'morning', 'evening', 'season', 'year', 'weekday', 'true', 'false', 'null', 'undefined'];

const flagsSet = new Set(), flagsRead = new Map(), varsSet = new Set();
const npcUse = {}; // npc -> Set de contextos
const useNpc = (id, ctx) => { (npcUse[id] ||= new Set()).add(ctx); };
const questStagesUsed = [];
const puzzles = [], puzzleIds = new Map();

function checkCond(where, expr) {
	if (expr === undefined || expr === null || typeof expr === 'boolean') return;
	if (typeof expr !== 'string') { E(where, 'condición no es cadena: ' + JSON.stringify(expr)); return; }
	try { new Function('s', 'with (s) { return (' + expr + '); }'); } catch (e) { E(where, `condición inválida "${expr}": ${e.message}`); return; }
	let m;
	COND_NS.lastIndex = 0;
	while ((m = COND_NS.exec(expr))) {
		if (m[1] === 'flag' || m[1] === 'flags') { if (!flagsRead.has(m[2])) flagsRead.set(m[2], where); }
		if (m[1] === 'quest' || m[1] === 'done') { if (!C.quests[m[2]]) E(where, `condición usa misión inexistente "${m[2]}"`); }
	}
	// identificadores sueltos desconocidos
	const stripped = expr.replace(/'[^']*'|"[^"]*"/g, '').replace(COND_NS, '');
	for (const id of stripped.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) || []) {
		if (COND_FUNCS.includes(id) || COND_VARS.includes(id)) continue;
		if (['flag', 'flags', 'vars', 'rep', 'af', 'quest', 'done'].includes(id)) continue;
		E(where, `condición "${expr}" usa identificador desconocido "${id}"`);
	}
	for (const m2 of expr.matchAll(/\b(has|count)\(['"]([^'"]+)['"]\)/g)) if (!D.items[toID(m2[2])]) E(where, `objeto inexistente en condición: ${m2[2]}`);
	for (const m2 of expr.matchAll(/\b(inParty|owns|seen|caught)\(['"]([^'"]+)['"]\)/g)) if (!D.species[toID(m2[2])]) E(where, `especie inexistente en condición: ${m2[2]}`);
	for (const m2 of expr.matchAll(/\b(visited|cleared)\(['"]([^'"]+)['"]\)/g)) if (!C.locations[m2[2]]) E(where, `lugar inexistente en condición: ${m2[2]}`);
	for (const m2 of expr.matchAll(/\bbeat\(['"]([^'"]+)['"]\)/g)) if (!C.trainers[m2[1]]) E(where, `entrenador inexistente en condición: ${m2[1]}`);
}

function checkSpecies(where, sp) { if (!D.species[toID(sp)]) E(where, `especie inexistente: ${sp}`); }
function checkItem(where, it) { if (!D.items[toID(it)]) E(where, `objeto inexistente: ${it}`); }
function checkMove(where, mv) { if (!D.moves[toID(mv)]) E(where, `movimiento inexistente: ${mv}`); }

function walk(where, list, depth = 0) {
	if (!Array.isArray(list)) { E(where, 'el guion no es una lista'); return; }
	list.forEach((c, i) => {
		const w = `${where}[${i}]`;
		if (typeof c === 'string') return;
		if (!c || typeof c !== 'object') { E(w, 'comando inválido'); return; }
		const keys = Object.keys(c);
		const cmd = keys.find(k => KNOWN_CMDS.has(k));
		if (!cmd) { E(w, 'comando desconocido: ' + JSON.stringify(c).slice(0, 80)); return; }
		for (const k of keys) if (!KNOWN_CMDS.has(k) && !AUX_KEYS.has(k)) W(w, `clave desconocida "${k}" en comando ${cmd}`);
		if (c.cond !== undefined) checkCond(w, c.cond);
		switch (cmd) {
		case 'say': if (c.say && c.say !== 'jugador') { if (!C.npcs[c.say]) E(w, `npc inexistente: ${c.say}`); else useNpc(c.say, where); } if (typeof c.text !== 'string') E(w, 'say sin text'); break;
		case 'choice': c.choice.forEach((o, j) => { if (o.cond !== undefined) checkCond(w + `.choice[${j}]`, o.cond); if (o.then) walk(w + `.choice[${j}]`, o.then, depth + 1); }); break;
		case 'if': checkCond(w, c.if); if (c.then) walk(w + '.then', c.then, depth + 1); if (c.else) walk(w + '.else', c.else, depth + 1); break;
		case 'set': for (const k in c.set) { const [ns, name] = k.split('.'); if (!['flag', 'flags', 'vars', 'var', 'rep', 'af'].includes(ns) || !name) E(w, 'set con ruta inválida: ' + k); if (ns.startsWith('flag')) flagsSet.add(name); if (ns.startsWith('var')) varsSet.add(name); } break;
		case 'give': case 'take': checkItem(w, c[cmd]); break;
		case 'pokemon': checkSpecies(w, c.pokemon.sp); for (const m of c.pokemon.moves || []) checkMove(w, m); if (c.pokemon.item) checkItem(w, c.pokemon.item); break;
		case 'battle': if (!C.trainers[c.battle]) E(w, `entrenador inexistente: ${c.battle}`); else if (C.trainers[c.battle].npc) useNpc(C.trainers[c.battle].npc, where); break;
		case 'wild': checkSpecies(w, c.wild.sp); break;
		case 'go': if (!C.locations[c.go]) E(w, `lugar inexistente: ${c.go}`); break;
		case 'quest': if (!C.quests[c.quest]) E(w, `misión inexistente: ${c.quest}`); else if (c.stage && !C.quests[c.quest].stages?.[c.stage] && c.stage !== 'hecha') E(w, `etapa inexistente ${c.quest}.${c.stage}`); questStagesUsed.push(c.quest + '.' + (c.stage || '')); break;
		case 'intel': if (!C.npcs[c.intel.npc]) E(w, `intel de npc inexistente: ${c.intel.npc}`); break;
		case 'badge': if (!C.badges[c.badge]) E(w, `medalla inexistente: ${c.badge}`); break;
		case 'call': if (!C.scripts[c.call]) E(w, `guion inexistente: ${c.call}`); break;
		case 'learn': checkMove(w, c.learn.move); break;
		case 'shop': if (!C.shops[c.shop]) E(w, `tienda inexistente: ${c.shop}`); break;
		case 'forceEvolve': checkSpecies(w, c.forceEvolve.to); break;
		case 'puzzle': {
			const pz = c.puzzle || {};
			const P = parsePuzzle(pz);
			for (const e of P.errors) E(w, 'puzle: ' + e);
			if (!P.errors.length) { const sol = solve(P); if (!sol) E(w, 'puzle sin solución'); else puzzles.push({ w, id: pz.id, steps: sol.length }); }
			if (pz.theme && !['cueva', 'ruina', 'hielo', 'lab'].includes(pz.theme)) E(w, 'puzle: tema desconocido ' + pz.theme);
			if (pz.id && puzzleIds.has(pz.id) && puzzleIds.get(pz.id) !== w) W(w, 'puzle: id repetido ' + pz.id); else if (pz.id) puzzleIds.set(pz.id, w);
			if (!c.onSolve) W(w, 'puzle sin onSolve: resolverlo no cambia nada');
			if (pz.hint && pz.hint.length > 140) W(w, 'puzle: pista de más de 140 caracteres');
			break;
		}
		case 'unlock': if (!['mega', 'z', 'dynamax', 'tera'].includes(c.unlock)) E(w, 'unlock inválido'); break;
		}
		for (const k of ['onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit']) if (c[k]) walk(w + '.' + k, c[k], depth + 1);
	});
}

// ---------- Lugares ----------
for (const [id, L] of Object.entries(C.locations)) {
	const w = 'lugar ' + id;
	if (!L.name) E(w, 'sin nombre');
	if (!L.parent && !L.map) W(w, 'lugar de primer nivel sin coordenadas de mapa');
	if (L.parent && !C.locations[L.parent]) E(w, 'parent inexistente: ' + L.parent);
	if (!L.region && !L.parent) E(w, 'sin región');
	for (const n of L.links || []) if (!C.locations[n]) E(w, 'link inexistente: ' + n);
	if (L.enterCond) checkCond(w + '.enterCond', L.enterCond);
	if (L.hidden) checkCond(w + '.hidden', L.hidden);
	for (const d of L.descs || []) checkCond(w + '.descs', d.cond);
	for (const r of L.rumors || []) checkCond(w + '.rumors', r.cond);
	(L.onEnter || []).forEach((e, i) => { if (!C.scripts[e.script]) E(w, 'onEnter guion inexistente: ' + e.script); checkCond(w + '.onEnter', e.cond); });
	const checkSpots = (spots, ww) => (spots || []).forEach((s, i) => {
		const sw = `${ww}.spots[${i}] "${s.label}"`;
		if (!s.label) E(sw, 'spot sin label');
		checkCond(sw, s.cond); checkCond(sw, s.new); checkCond(sw, s.doneIf);
		if (s.script && !C.scripts[s.script]) E(sw, 'guion inexistente: ' + s.script);
		for (const t of s.talk || []) { checkCond(sw, t.cond); if (!C.scripts[t.script]) E(sw, 'guion inexistente: ' + t.script); }
		const a = s.action || {};
		if (a.script && !C.scripts[a.script]) E(sw, 'guion inexistente: ' + a.script);
		if (a.shop && !C.shops[a.shop]) E(sw, 'tienda inexistente: ' + a.shop);
		if (a.gather && !C.gather[a.gather]) E(sw, 'punto de recolección inexistente: ' + a.gather);
		if (a.go && !C.locations[a.go]) E(sw, 'lugar inexistente: ' + a.go);
		if (a.trainer && !C.trainers[a.trainer]) E(sw, 'entrenador inexistente: ' + a.trainer);
		if (a.training) { for (const t of a.training.trainers || []) if (!C.trainers[t]) E(sw, 'entrenador de entrenamiento inexistente: ' + t); for (const x of a.training.wild || []) checkSpecies(sw, x.sp); if (!a.training.cap) W(sw, 'entrenamiento sin cap'); }
		if (!s.script && !s.talk && !Object.keys(a).length) E(sw, 'spot sin acción');
	});
	checkSpots(L.spots, w);
	const encs = L.route?.encounters || L.encounters || {};
	for (const t in encs) for (const e of encs[t]) { checkSpecies(w + ' encuentro', e.sp); if (e.cond) checkCond(w + ' encuentro', e.cond); if (!e.lv) E(w, 'encuentro sin nivel: ' + e.sp); }
	if (L.route) {
		const r = L.route;
		if (!C.locations[r.from] || !C.locations[r.to]) E(w, 'ruta con extremos inexistentes');
		if (!(L.links || []).includes(r.from) || !(L.links || []).includes(r.to)) E(w, 'los extremos de la ruta deben estar en links');
		if (!(r.length >= 1)) E(w, 'ruta sin length');
		for (const n in r.tramos || {}) {
			if (+n > r.length || +n < 0) E(w, `tramo ${n} fuera de rango (0..${r.length})`);
			for (const it of [].concat(r.tramos[n])) {
				const tw = `${w} tramo ${n}`;
				checkCond(tw, it.cond);
				if (it.trainer && !C.trainers[it.trainer]) E(tw, 'entrenador inexistente: ' + it.trainer);
				if (it.script && !C.scripts[it.script]) E(tw, 'guion inexistente: ' + it.script);
				if (it.item) checkItem(tw, it.item);
				if (it.block) checkCond(tw + ' block', it.block.cond);
				if (it.block?.script && !C.scripts[it.block.script]) E(tw, 'guion de bloqueo inexistente');
				if (it.branch && !C.locations[it.branch.go]) E(tw, 'desvío inexistente: ' + it.branch.go);
				if (it.branch?.cond) checkCond(tw, it.branch.cond);
				for (const t of it.talk || []) { checkCond(tw, t.cond); if (!C.scripts[t.script]) E(tw, 'guion inexistente: ' + t.script); }
				if (it.wildFixed) checkSpecies(tw, it.wildFixed.sp);
				if (it.new) checkCond(tw, it.new);
			}
		}
	}
}
// ---------- Entrenadores ----------
for (const [id, t] of Object.entries(C.trainers)) {
	const w = 'entrenador ' + id;
	if (t.npc && !C.npcs[t.npc]) E(w, 'npc inexistente: ' + t.npc);
	if (t.npc) useNpc(t.npc, 'trainer:' + id);
	if (!t.team?.length) E(w, 'sin equipo');
	for (const m of t.team || []) {
		if (!D.species[toID(m.sp)]) { E(w, 'especie inexistente: ' + m.sp); continue; }
		if (!m.lv) E(w, 'sin nivel: ' + m.sp);
		for (const mv of m.moves || []) { checkMove(w, mv); if (D.moves[toID(mv)] && !canLearn(m.sp, mv)) W(w, `${m.sp} normalmente no aprende ${mv}`); }
		if (m.ability) { const ab = Object.values(D.species[toID(m.sp)].abil).map(toID); if (!ab.includes(toID(m.ability))) E(w, `${m.sp} no puede tener la habilidad ${m.ability}`); }
		if (m.item) checkItem(w, m.item);
		if (m.moves && m.moves.length > 4) E(w, `${m.sp} con más de 4 movimientos`);
	}
	for (const it of t.items || []) checkItem(w, it.id);
	if (['brock', 'blanca', 'corelia'].includes(t.npc) || t.cls === 'Líder') for (const m of t.team || []) if (!m.moves) W(w, `líder sin movimientos elegidos para ${m.sp}`);
}
// ---------- Guiones ----------
for (const [id, s] of Object.entries(C.scripts)) walk('guion ' + id, s);
// ---------- Misiones, retos, tiendas ----------
for (const [id, q] of Object.entries(C.quests)) { if (!q.name) E('misión ' + id, 'sin nombre'); if (!q.stages || !Object.keys(q.stages).length) E('misión ' + id, 'sin etapas'); if (!['main', 'thread', 'side', 'event'].includes(q.type)) E('misión ' + id, 'tipo inválido'); if (!questStagesUsed.some(x => x.startsWith(id + '.'))) W('misión ' + id, 'ningún guion la inicia'); }
for (const [id, q] of Object.entries(C.quests)) if (q.parts) {
	const w = 'misión ' + id + ' (parts)';
	if (!Array.isArray(q.parts.items) || !q.parts.items.length) E(w, 'sin items');
	for (const it of q.parts.items || []) {
		if (!it.label) E(w, 'parte sin label');
		if (!it.done) E(w, `parte ${it.label} sin done`);
		checkCond(w, it.done); checkCond(w, it.got);
		if (it.where && !C.locations[it.where]) E(w, `lugar inexistente ${it.where}`);
		if (it.tramo && C.locations[it.where]?.route && it.tramo > C.locations[it.where].route.length) E(w, `tramo ${it.tramo} fuera de ${it.where}`);
		for (const x of [].concat(it.hint || [])) if (typeof x === 'object') checkCond(w, x.cond);
	}
}
for (const [id, c] of Object.entries(C.challenges)) { if (c.trainer && !C.trainers[c.trainer]) E('reto ' + id, 'entrenador inexistente'); if (c.npc && !C.npcs[c.npc]) E('reto ' + id, 'npc inexistente'); checkCond('reto ' + id, c.cond); for (const i of c.info || []) checkCond('reto ' + id, i.cond); }
for (const [id, s] of Object.entries(C.shops)) for (const e of s.items) checkItem('tienda ' + id, typeof e === 'string' ? e : e.id);
for (const ev of C.events) {
	const w = 'evento ' + ev.id;
	if (!/^\d\d-\d\d$/.test(ev.from) || !/^\d\d-\d\d$/.test(ev.to)) E(w, 'fechas inválidas');
	checkCond(w, ev.cond);
	checkCond(w, ev.doneCond);
	if (!ev.icon || !ev.blurb) W(w, 'sin `icon` o `blurb` (los usa el aviso de eventos; el blurb no debe tener spoilers)');
	if (!ev.doneCond) W(w, 'sin `doneCond`: el aviso no sabrá cuándo lo completaste');
	for (const loc in ev.spots || {}) { if (!C.locations[loc]) E(w, 'lugar inexistente ' + loc); for (const s of ev.spots[loc]) for (const t of s.talk || []) if (!C.scripts[t.script]) E(w, 'guion inexistente ' + t.script); }
	for (const loc in ev.encounters || {}) { if (!C.locations[loc]) E(w, 'lugar inexistente ' + loc); for (const t in ev.encounters[loc]) for (const e of ev.encounters[loc][t]) checkSpecies(w, e.sp); }
	for (const loc in ev.tramos || {}) { if (!C.locations[loc]) E(w, 'lugar inexistente ' + loc); for (const n in ev.tramos[loc]) for (const it of ev.tramos[loc][n]) if (it.item) checkItem(w, it.item); }
	for (const loc in ev.onEnter || {}) for (const e of ev.onEnter[loc]) if (!C.scripts[e.script]) E(w, 'guion inexistente ' + e.script);
}
for (const m of C.milestones) if (!flagsSet.has(m.flag)) W('hito', `el flag ${m.flag} nunca se activa`);
// flags leídos que nunca se activan
for (const [f, where] of flagsRead) {
	if (f.startsWith('mec_') || f.startsWith('mount_') || f.startsWith('map_')) continue;
	if (!flagsSet.has(f)) W(where, `el flag "${f}" se consulta pero ningún guion lo activa`);
}
// Apariciones de NPCs con nombre
const lowNpc = [];
for (const id of Object.keys(C.npcs)) {
	const n = npcUse[id]?.size || 0;
	if (C.npcs[id].generic) continue;
	if (n === 0) W('npc ' + id, 'definido pero nunca aparece');
	else if (n < 3) lowNpc.push(`${id} (${n})`);
}

// Evoluciones imposibles: cada Pokémon que se puede conseguir (salvajes, regalos, guiones y sus
// líneas evolutivas) debe poder evolucionar con lo que hay en el juego. Las evoluciones por
// intercambio o por condiciones raras usan el Cordón Unión (ver checkEvolution en app/js/pokemon.js).
// Nació del bug del Boldore de Mario (2026-10-06): el Cordón existía pero no se podía conseguir.
function checkEvolutions() {
	const items = new Set(), sps = new Set();
	const scan = o => {
		if (Array.isArray(o)) return o.forEach(scan);
		if (!o || typeof o !== 'object') return;
		for (const [k, v] of Object.entries(o)) {
			if ((k === 'give' || k === 'item' || k === 'id') && typeof v === 'string') items.add(toID(v));
			if (k === 'sp' && typeof v === 'string') sps.add(toID(v));
			scan(v);
		}
	};
	for (const k of ['scripts', 'locations', 'events', 'quests', 'shops', 'gather']) scan(C[k]); // sin entrenadores: sus equipos no se pueden conseguir
	for (const [id, s] of Object.entries(C.shops)) for (const e of s.items) items.add(toID(typeof e === 'string' ? e : e.id));
	const need = e => ['useItem', 'levelHold'].includes(e.evoType) ? toID(e.evoItem) : ['trade', 'levelExtra', 'other'].includes(e.evoType) ? 'linkingcord' : null;
	const seen = new Set([...sps].filter(s => D.species[s])), q = [...seen];
	while (q.length) for (const e of D.species[q.pop()].evos || []) if (D.species[e] && !seen.has(e)) { seen.add(e); q.push(e); }
	for (const s of seen) {
		const e = D.species[s];
		if (!e.prevo || !seen.has(e.prevo)) continue;
		const it = need(e);
		if (it && !items.has(it)) E('evolución ' + e.prevo + ' → ' + s, `necesita «${D.items[it]?.name || it}» y no se consigue en ninguna tienda, recolección ni guion`);
	}
}
checkEvolutions();

checkGather();
console.log(`Bloques: ${C.blocks.map(b => b.id).join(', ')} · Lugares: ${Object.keys(C.locations).length} · Entrenadores: ${Object.keys(C.trainers).length} · Guiones: ${Object.keys(C.scripts).length} · Misiones: ${Object.keys(C.quests).length} · NPCs: ${Object.keys(C.npcs).length}`);
if (puzzles.length) console.log(`Puzles: ${puzzles.length} (${puzzles.map(p => (p.id || p.w) + ' ' + p.steps + ' pasos').join(', ')})`);
if (lowNpc.length) console.log('NPCs con menos de 3 escenas (deben reaparecer en bloques futuros): ' + lowNpc.join(', '));
if (warns.length) { console.log(`\n${warns.length} ADVERTENCIAS:`); for (const x of warns) console.log('  ⚠ ' + x); }
if (errors.length) { console.log(`\n${errors.length} ERRORES:`); for (const x of errors) console.log('  ✖ ' + x); }
else console.log('\n✔ Sin errores.');
process.exit(errors.length || (strict && warns.length) ? 1 : 0);
