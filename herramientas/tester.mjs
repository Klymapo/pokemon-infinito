// Bot «Game Tester»: busca fallos de LÓGICA de juego que un probador humano reportaría.
// Uso: node herramientas/tester.mjs [--informe ruta.md] [--estricto]
//
// No juega (eso es recorrido.mjs): recorre todos los caminos de cada guion como lo haría alguien
// que intenta romper el juego, y apunta situaciones injustas o que pueden dejar la partida atascada.
// Nació de un reporte de Mario: «Rhi me reta sin dejarme curar».
//
//   ✖ grave: puede atascar la partida o es claramente injusto.  ⚠ detalle: molesto.  · curiosidad.
// Por defecto no bloquea; con --estricto sale con código 1 si hay graves.
// El informe nombra guiones y entrenadores: va a secreto/.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDataNode } from './test/node-env.mjs';
import { D, toID } from '../app/js/data.js';
import { C, registerBlock } from '../app/js/content.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const strict = process.argv.includes('--estricto');
loadDataNode();
const mod = await import('../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);

const found = []; const seen = new Set();
const note = (cat, sev, where, msg) => { const k = cat + where + msg; if (!seen.has(k)) { seen.add(k); found.push({ cat, sev, where, msg }); } };
const CATS = {
	sinCurar: 'Te obligan a pelear sin dejarte curar',
	encadenados: 'Combates encadenados sin respiro',
	atasco: 'Perder puede atascar la escena',
	vacios: 'Decisiones o botones que pueden quedar vacíos',
	objetos: 'Objetos que se quitan sin comprobar que los tienes',
};
const tName = id => { const t = C.trainers[id]; return t ? `${t.cls ? t.cls + ' ' : ''}${t.name || id}` : id; };
const isBig = id => { const t = C.trainers[id]; return !!t && ((t.ai || 0) >= 4 || /rival|líder|jefe|admin|campe/i.test(t.cls || '') || !!(t.npc && C.npcs[t.npc] && !C.npcs[t.npc].generic)); }; // jefes y personajes con nombre

// ---------------- Utilidades de recorrido ----------------
const KIDS = ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun'];
/** ¿Algún comando de esta lista (o de sus ramas y llamadas) cumple pred? */
function contains(list, pred, depth = 0, stack = new Set()) {
	if (!Array.isArray(list) || depth > 8) return false;
	for (const c of list) {
		if (!c || typeof c !== 'object') continue;
		if (pred(c)) return true;
		for (const k of KIDS) if (contains(c[k], pred, depth + 1, stack)) return true;
		if (c.choice) for (const o of c.choice) if (contains(o.then, pred, depth + 1, stack)) return true;
		if (c.call && !stack.has(c.call)) { stack.add(c.call); if (contains(C.scripts[c.call], pred, depth + 1, stack)) return true; stack.delete(c.call); }
	}
	return false;
}
const isHeal = c => !!c.heal || !!c.center;
/** Qué pasa primero en esta lista: 'heal' (se cura antes de pelear), 'battle' o null. Las curas de después del combate no cuentan. */
function firstEvent(list, depth = 0, stack = []) {
	if (!Array.isArray(list) || depth > 8) return null;
	for (const c of list) {
		if (!c || typeof c !== 'object') continue;
		if (isHeal(c)) return 'heal';
		if (c.battle) return 'battle';
		if (c.call && !stack.includes(c.call)) { const r = firstEvent(C.scripts[c.call], depth + 1, [...stack, c.call]); if (r) return r; }
		const branches = c.choice ? c.choice.map(o => o.then) : c.if ? [c.then, c.else] : null;
		if (branches) { const rs = branches.map(b => firstEvent(b, depth + 1, stack)); if (rs.includes('heal')) return 'heal'; if (rs.every(r => r === 'battle')) return 'battle'; }
	}
	return null;
}
const isBattle = c => !!c.battle;
const setsState = c => !!(c.set || c.quest || c.give || c.badge || c.pokemon || c.unlock || c.go);

/**
 * Recorre todos los caminos de un guion. st: { fresh, offered, escape, lastBattle, healedSince, entry, path }
 * - fresh: el equipo pudo prepararse antes (el jugador eligió empezar la escena).
 * - offered: en este camino se ofreció curar (aunque el jugador lo rechazara).
 * - escape: en este camino hubo una opción para no pelear.
 */
const MAX_PATHS = 4000;
function walk(list, st, onBattle, budget, stack) {
	if (!Array.isArray(list) || budget.n <= 0) return st;
	for (let i = 0; i < list.length; i++) {
		const c = list[i];
		if (!c || typeof c !== 'object') continue;
		if (isHeal(c)) { st = { ...st, healed: true, lastBattle: null }; continue; }
		if (c.battle) {
			onBattle(c, st, list.slice(i + 1));
			st = { ...st, lastBattle: c.battle, healed: false, fresh: false, offered: false, escape: false };
			// El resultado: gana o pierde (si puede perder)
			if (c.onWin) walk(c.onWin, st, onBattle, budget, stack);
			if (c.onLose) walk(c.onLose, st, onBattle, budget, stack);
			continue;
		}
		if (c.call && !stack.includes(c.call)) { st = walk(C.scripts[c.call], st, onBattle, budget, [...stack, c.call]); continue; }
		if (c.choice) {
			const opts = c.choice;
			const offer = opts.some(o => firstEvent(o.then) === 'heal');
			const out = opts.some(o => !contains(o.then, isBattle));
			const rest = list.slice(i + 1);
			for (const o of opts) {
				if (--budget.n <= 0) return st;
				const s2 = walk(o.then, { ...st, offered: st.offered || offer, escape: st.escape || out }, onBattle, budget, stack);
				walk(rest, s2, onBattle, budget, stack);
			}
			return st;
		}
		if (c.if) {
			const rest = list.slice(i + 1);
			const a = walk(c.then, st, onBattle, budget, stack); walk(rest, a, onBattle, budget, stack);
			const b = walk(c.else, st, onBattle, budget, stack); walk(rest, b, onBattle, budget, stack);
			return st;
		}
	}
	return st;
}

// ---------------- Puntos de entrada ----------------
// auto: se dispara solo (al entrar a un lugar o pisar un tramo). talk: lo elige el jugador.
const entries = [];
for (const [id, L] of Object.entries(C.locations)) {
	for (const e of L.onEnter || []) if (e.script) entries.push({ script: e.script, auto: true, once: e.once !== false, where: `al entrar a ${L.name || id}` });
	for (const [n, items] of Object.entries(L.route?.tramos || {})) {
		let prevTrainer = false;
		for (const it of items) {
			if (it.script) entries.push({ script: it.script, auto: true, once: it.once !== false, where: `${L.name || id} · tramo ${n}`, afterTrainer: prevTrainer });
			if (it.trainer && !it.optional) prevTrainer = it.trainer;
		}
	}
	// Tramos con entrenadores obligatorios seguidos
	const tr = L.route?.tramos || {};
	const mand = Object.keys(tr).map(Number).sort((a, b) => a - b).filter(n => tr[n].some(it => it.trainer && !it.optional));
	let run = 1;
	for (let k = 1; k < mand.length; k++) {
		run = mand[k] === mand[k - 1] + 1 ? run + 1 : 1;
		if (run === 3) note('encadenados', '·', `${L.name || id} · tramos ${mand[k] - 2}–${mand[k]}`, 'Tres entrenadores obligatorios en tramos seguidos. Se puede usar la mochila entre medias, pero se siente como una emboscada.');
	}
	for (const [n, items] of Object.entries(tr)) {
		const ts = items.filter(it => it.trainer && !it.optional);
		if (ts.length >= 2) note('encadenados', '⚠', `${L.name || id} · tramo ${n}`, `${ts.length} entrenadores obligatorios en el mismo tramo (${ts.map(t => tName(t.trainer)).join(', ')}): pelean uno detrás de otro sin que puedas abrir la mochila.`);
	}
	for (const s of L.spots || []) for (const t of s.talk || []) if (t.script) entries.push({ script: t.script, auto: false, where: `${L.name || id} · «${s.label}»` });
	for (const s of L.spots || []) if (s.script) entries.push({ script: s.script, auto: false, where: `${L.name || id} · «${s.label}»` });
}
for (const ev of C.events) {
	for (const [loc, list] of Object.entries(ev.onEnter || {})) for (const e of list) entries.push({ script: e.script, auto: true, once: e.once !== false, where: `evento ${ev.id} · al entrar a ${C.locations[loc]?.name || loc}` });
	for (const [loc, list] of Object.entries(ev.spots || {})) for (const s of list) for (const t of s.talk || []) entries.push({ script: t.script, auto: false, where: `evento ${ev.id} · «${s.label}»` });
}

// ---------------- Comprobaciones de combate ----------------
for (const en of entries) {
	const list = C.scripts[en.script];
	if (!list) continue;
	const where = `${en.where} → guion ${en.script}`;
	const budget = { n: MAX_PATHS };
	walk(list, { fresh: !en.auto, offered: false, escape: false, healed: false, lastBattle: en.afterTrainer || null }, (c, st, rest) => {
		const big = isBig(c.battle);
		// 1. Sin curar: escena automática que acaba en combate sin ofrecer curar
		if (!st.fresh && !st.healed && !st.offered && !st.lastBattle) {
			const sev = big ? (st.escape ? '⚠' : '✖') : '·';
			note('sinCurar', sev, where, `Llegas y ${tName(c.battle)} te reta sin ofrecerte curar${st.escape ? ' (puedes rechazar, pero si aceptas vas con el equipo como venga)' : ' y sin poder decir que no'}. Ofrece pasar por el Centro o un puñado de pociones antes, como en los otros combates de rival.`);
		}
		// 2. Encadenados: combate justo después de otro sin curar entre medias
		if (st.lastBattle && !st.healed && !st.offered) {
			const sev = big ? '✖' : '⚠';
			note('encadenados', sev, where, `${tName(c.battle)} pelea justo después de ${tName(st.lastBattle)}, sin curar entre medias.`);
		}
		// 3. Atasco: escena de una sola vez + derrota que corta el guion + cosas importantes después
		if (en.auto && en.once && c.lose !== 'continue' && !c.onLose && rest.some(setsState)) {
			note('atasco', '✖', where, `Si pierdes contra ${tName(c.battle)}, el juego te manda al Centro y corta la escena, pero la escena ya se marcó como vista y no se repite: lo que pasa después del combate (flags, misión, objetos) nunca ocurre. Pon \`lose: 'continue'\` u \`onLose\`, o haz la escena repetible.`);
		}
	}, budget, [en.script]);
}
// Combates encadenados también dentro de guiones sueltos (llamados desde donde sea)
const entryScripts = new Set(entries.map(e => e.script));
for (const [sid, list] of Object.entries(C.scripts)) {
	if (entryScripts.has(sid)) continue; // ya revisado desde su punto de entrada
	walk(list, { fresh: true, offered: false, escape: false, healed: false, lastBattle: null }, (c, st) => {
		if (st.lastBattle && !st.healed && !st.offered) note('encadenados', isBig(c.battle) ? '✖' : '⚠', `guion ${sid}`, `${tName(c.battle)} pelea justo después de ${tName(st.lastBattle)}, sin curar entre medias.`);
	}, { n: MAX_PATHS }, [sid]);
}

// ---------------- Decisiones y botones vacíos ----------------
const walkAll = (sid, list, fn) => { if (!Array.isArray(list)) return; for (const c of list) { if (!c || typeof c !== 'object') continue; fn(c); for (const k of KIDS) walkAll(sid, c[k], fn); if (c.choice) for (const o of c.choice) walkAll(sid, o.then, fn); } };
for (const [sid, list] of Object.entries(C.scripts)) walkAll(sid, list, c => {
	if (c.choice && c.choice.length && c.choice.every(o => o.cond)) note('vacios', '⚠', `guion ${sid}`, `Todas las opciones de una decisión${c.prompt ? ` («${c.prompt.slice(0, 50)}»)` : ''} tienen condición: si no se cumple ninguna, la decisión sale vacía. Deja una opción siempre disponible.`);
});
for (const [id, L] of Object.entries(C.locations)) for (const s of L.spots || []) {
	if (s.talk && s.talk.length && s.talk.every(t => t.cond) && !s.cond) note('vacios', '·', `${L.name || id} · «${s.label}»`, 'El botón siempre se ve, pero todas sus variantes tienen condición: a veces tocarlo no hará nada. Añade una variante final sin condición o un `cond` al botón.');
}

// ---------------- Quitar objetos sin comprobar ----------------
for (const [sid, list] of Object.entries(C.scripts)) {
	const check = (l, guarded) => { if (!Array.isArray(l)) return; for (const c of l) { if (!c || typeof c !== 'object') continue; const g = guarded || (c.cond && /has\(|count\(/.test(c.cond)) || (c.if && /has\(|count\(/.test(c.if)); if (c.take && !g && !(D.items[toID(c.take)]?.pocket === 'key')) note('objetos', '·', `guion ${sid}`, `Quita «${D.items[toID(c.take)]?.name || c.take}» sin comprobar antes que lo tengas (\`has()\`). Si ya lo gastaste, la escena sigue como si nada.`); for (const k of KIDS) check(c[k], g || (k === 'then' && c.if && /has\(|count\(/.test(c.if))); if (c.choice) for (const o of c.choice) check(o.then, g || (o.cond && /has\(|count\(/.test(o.cond))); } };
	check(list, false);
}

// ---------------- Informe ----------------
const order = { '✖': 0, '⚠': 1, '·': 2 };
const tot = { '✖': 0, '⚠': 0, '·': 0 }; for (const f of found) tot[f.sev]++;
const by = {}; for (const f of found) (by[f.cat] ||= []).push(f);
const fecha = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
const out = [`# Game Tester · ${fecha}`, '', '> Fallos de lógica que reportaría un probador. **✖ grave** (atasca o es injusto), **⚠ detalle** (molesta), **· curiosidad**.', '',
	`**Total:** ${tot['✖']} graves · ${tot['⚠']} detalles · ${tot['·']} curiosidades. Revisados ${entries.length} puntos de entrada y ${Object.keys(C.scripts).length} guiones.`, ''];
for (const [cat, title] of Object.entries(CATS)) {
	const l = (by[cat] || []).sort((a, b) => order[a.sev] - order[b.sev] || a.where.localeCompare(b.where));
	out.push(`## ${title} (${l.length})`, '');
	if (!l.length) { out.push('Nada que reportar. ✅', ''); continue; }
	for (const f of l.slice(0, 80)) out.push(`- ${f.sev} **${f.where}** — ${f.msg}`);
	if (l.length > 80) out.push(`- … y ${l.length - 80} más.`);
	out.push('');
}
const dest = arg('--informe', path.join(ROOT, 'secreto', 'auditorias', `tester-${fecha}.md`));
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out.join('\n'));
console.log(`Game Tester: ${tot['✖']} graves · ${tot['⚠']} detalles · ${tot['·']} curiosidades`);
for (const [cat, title] of Object.entries(CATS)) if (by[cat]?.length) console.log(`  ${title}: ${by[cat].length}`);
console.log(`Informe: ${path.relative(ROOT, dest)}`);
process.exit(strict && tot['✖'] ? 1 : 0);
