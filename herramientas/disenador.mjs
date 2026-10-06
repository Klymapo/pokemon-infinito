// Bot «Game Designer»: revisa el diseño del juego con ojos de diseñador.
// Uso: node herramientas/disenador.mjs [--informe ruta.md] [--estricto]
//
// Tres partes:
//   1. Hub de misiones: que cada ficha te diga qué hacer y dónde, sin muros de texto en el móvil,
//      con partes en las misiones de reunir cosas, con final y con recompensa.
//   2. Reglas de diseño de CLAUDE.md por bloque: aviso de ritmo, colección (recolección, lecturas,
//      recuerdos), fichas de reto, notas de mapa, zonas de entrenamiento y duración (~12 h).
//   3. Colección soñada de Mario: qué iniciales, pseudolegendarios, legendarios, singulares, ultraentes,
//      paradojas, fósiles y especiales se pueden conseguir ya, y cuáles faltan.
//
//   ✖ grave · ⚠ detalle · · curiosidad. Por defecto no bloquea; con --estricto sale con 1 si hay graves.
// El informe nombra misiones y lugares: va a secreto/.
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
	hub: 'Hub de misiones: fichas que no te guían',
	textos: 'Hub de misiones: textos para pantalla de móvil',
	cierre: 'Misiones sin final o sin premio',
	bloques: 'Reglas de diseño por bloque',
	mundo: 'Lugares',
};
const KIDS = ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun'];
function eachCmd(list, fn, depth = 0) {
	if (!Array.isArray(list) || depth > 12) return;
	for (const c of list) { if (!c || typeof c !== 'object') continue; fn(c); for (const k of KIDS) eachCmd(c[k], fn, depth + 1); if (c.choice) for (const o of c.choice) eachCmd(o.then, fn, depth + 1); }
}

// ---------------- ¿Dónde se dispara cada guion? ----------------
// Un guion está «situado» si cuelga de un botón, de la entrada a un lugar, de un tramo o de un evento (o lo llama uno situado).
const placeOf = {}; // script -> Set(lugares)
const addPlace = (s, loc) => { if (s) (placeOf[s] ||= new Set()).add(loc); };
for (const [id, L] of Object.entries(C.locations)) {
	const top = L.parent || id;
	for (const e of L.onEnter || []) addPlace(e.script, top);
	for (const s of L.spots || []) { addPlace(s.script, top); for (const t of s.talk || []) addPlace(t.script, top); }
	for (const items of Object.values(L.route?.tramos || {})) for (const it of items) { addPlace(it.script, top); for (const t of it.talk || []) addPlace(t.script, top); if (it.trainer) for (const k of ['onWin']) {} }
}
for (const ev of C.events) { for (const [loc, l] of Object.entries(ev.onEnter || {})) for (const e of l) addPlace(e.script, loc); for (const [loc, l] of Object.entries(ev.spots || {})) for (const s of l) for (const t of s.talk || []) addPlace(t.script, loc); }
for (const b of mod.BLOCKS) if (b.start) addPlace(b.start, '(inicio de bloque)');
// Propagar por llamadas
for (let pass = 0; pass < 6; pass++) for (const [sid, list] of Object.entries(C.scripts)) {
	const here = placeOf[sid]; if (!here) continue;
	eachCmd(list, c => { if (c.call) for (const p of here) addPlace(c.call, p); });
}

// ---------------- 1. Hub de misiones ----------------
const stageSetBy = {}; // quest -> stage -> [scripts]
const doneBy = {}; // quest -> [scripts]
const condUse = {}; // quest -> count
for (const [sid, list] of Object.entries(C.scripts)) eachCmd(list, c => {
	if (!c.quest) return;
	if (c.done) (doneBy[c.quest] ||= []).push(sid);
	if (c.stage) ((stageSetBy[c.quest] ||= {})[c.stage] ||= []).push(sid);
});
const questBlock = {};
for (const b of mod.BLOCKS) for (const q of Object.keys(b.quests || {})) questBlock[q] = b.id;

for (const [qid, q] of Object.entries(C.quests)) {
	const where = `${q.name || qid} [${qid}]`;
	const stages = q.stages || {};
	const sk = Object.keys(stages);
	if (!q.type) note('hub', '⚠', where, 'Sin `type`: el hub no sabe si ponerla con las principales ⭐, los hilos 🧵, las secundarias 📜 o los eventos 🎉.');
	if (!q.est && q.type !== 'thread') note('hub', '·', where, 'Sin `est` (minutos estimados): el hub no puede decir cuánto te va a llevar.');
	// Etapas que nadie activa (salvo la última, que puede ser solo descriptiva al cerrarse)
	const used = stageSetBy[qid] || {};
	for (const [i, s] of sk.entries()) if (!used[s] && i < sk.length - 1 && i > 0) note('hub', '⚠', where, `La etapa «${s}» está escrita pero ningún guion la activa: el texto nunca se ve.`);
	// Etapas sin sitio donde avanzar: el texto dice qué hacer, pero ningún guion situado la activa
	const starters = Object.values(used).flat();
	if (starters.length && !starters.some(s => placeOf[s]?.size)) note('hub', '✖', where, 'Ningún guion que la mueve cuelga de un lugar, tramo o botón: la ficha no puede decirte a dónde ir (y quizá no se puede empezar).');
	// Misiones de reunir cosas sin `parts`
	const allText = Object.values(stages).join(' ');
	if (!q.parts && /\b(los|las)\s+(\d+|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b|\b(reúne|reunir|encuentra|rescata|recoge|consigue)\s+(\d+|dos|tres|cuatro|cinco|seis|siete|ocho)\b|\d+\s*\/\s*\d+/i.test(allText))
		note('hub', '⚠', where, 'Parece una misión de reunir varias cosas y no tiene `parts`: la ficha no puede decirte cuáles te faltan ni en qué tramo están.');
	if (q.parts) for (const it of q.parts.items || []) {
		if (!it.where) note('hub', '⚠', where, `La parte «${it.label}» no dice dónde está (\`where\`).`);
		else if (!C.locations[it.where]) note('hub', '✖', where, `La parte «${it.label}» apunta a un lugar que no existe: ${it.where}.`);
		if (!it.hint) note('hub', '·', where, `La parte «${it.label}» no tiene pista.`);
	}
	// Textos para móvil
	for (const [s, t] of Object.entries(stages)) {
		const txt = typeof t === 'string' ? t : (t?.text || '');
		if (txt.length > 240) note('textos', '⚠', where, `La etapa «${s}» tiene ${txt.length} caracteres: en el móvil es un muro. Que diga qué hacer en 1–2 frases (≤ 240) y el resto que lo cuente la historia.`);
		else if (txt && txt.length < 18 && s !== sk[sk.length - 1]) note('textos', '·', where, `La etapa «${s}» es muy escueta («${txt}»): ¿se entiende qué hacer y dónde?`);
		if (txt && s !== sk[sk.length - 1] && !/[A-ZÁÉÍÓÚ][a-záéíóúñ]+/.test(txt.replace(/^[^ ]+ /, ''))) note('textos', '·', where, `La etapa «${s}» no nombra ningún lugar ni personaje: dale al jugador un ancla.`);
	}
	// Cierre
	if (!doneBy[qid]) note('cierre', q.type === 'thread' || q.type === 'event' ? '·' : '✖', where, q.type === 'thread' ? 'Hilo sin final todavía (normal si sigue en bloques futuros; que no se olvide).' : 'Ningún guion la termina (`done: true`): se quedará abierta para siempre en el hub.');
	else {
		let reward = false;
		for (const sid of doneBy[qid]) eachCmd(C.scripts[sid], c => { if (c.give || c.money || c.pokemon || c.af || c.rep || c.badge || c.unlock || c.learn || c.happy) reward = true; });
		if (!reward && q.type === 'side') note('cierre', '·', where, 'Secundaria que termina sin ningún premio visible (objeto, dinero, afinidad, reputación…). Un detalle pequeño ya cuenta.');
	}
}

// ---------------- 2. Reglas de diseño por bloque ----------------
const RULE_HOURS = 12;
for (const b of mod.BLOCKS) {
	const w = `Bloque ${b.id.replace('b', '')}`;
	const blocksAfter = mod.BLOCKS.indexOf(b) < mod.BLOCKS.length - 1;
	if (!(b.milestones || []).some(m => m.hoursLeft <= 3)) note('bloques', '⚠', w, 'Sin aviso de ritmo (`milestone` con `hoursLeft: 3`): Mario no sabrá cuándo pedir el siguiente bloque.');
	const items = Object.values(b.items || {});
	const reads = items.filter(i => i.read).length, arts = items.filter(i => i.art).length;
	if (reads < 2) note('bloques', '⚠', w, `Solo ${reads} objeto(s) para leer (cartas, notas, diarios). La regla son 2 o 3 por bloque.`);
	if (arts < 1) note('bloques', '⚠', w, 'Ningún recuerdo para mirar (`art`). Mario pidió poder ver y coleccionar cosas.');
	let gathers = 0; const scanG = o => { if (Array.isArray(o)) return o.forEach(scanG); if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (k === 'gather') gathers++; else scanG(v); } };
	scanG(b.locations); scanG(b.patches);
	if (gathers < 2) note('bloques', '⚠', w, `Solo ${gathers} punto(s) de recolección en sus rutas y cuevas.`);
	// Duración: suma de minutos estimados de sus misiones
	const est = Object.values(b.quests || {}).reduce((a, q) => a + (q.est || 0), 0);
	if (est && (est < RULE_HOURS * 60 * 0.6 || est > RULE_HOURS * 60 * 1.5)) note('bloques', '·', w, `Sus misiones suman ~${(est / 60).toFixed(1)} h estimadas; la meta son unas ${RULE_HOURS} h (o falta poner \`est\`).`);
	// Gimnasios: ficha de reto y zona de entrenamiento en el mismo lugar o su ciudad
	for (const [cid, ch] of Object.entries(b.challenges || {})) {
		if (!/gym|gimnasio/i.test(cid + (ch.name || ''))) continue;
		if (!ch.info?.length) note('bloques', '⚠', `${w} · ${ch.name}`, 'La ficha de reto no tiene información: el jugador no puede prepararse.');
		if (!ch.rec) note('bloques', '·', `${w} · ${ch.name}`, 'La ficha de reto no dice el nivel recomendado (`rec`).');
	}
	const hasTraining = JSON.stringify(b.locations || {}).includes('"training"') || JSON.stringify(b.patches || {}).includes('"training"');
	if (Object.keys(b.badges || {}).length && !hasTraining) note('bloques', '⚠', w, 'Hay medallas pero ninguna zona de entrenamiento con tope antes del líder.');
	// Lugares nuevos
	for (const [id, L] of Object.entries(b.locations || {})) {
		if (L.parent) continue;
		const ww = `${w} · ${L.name || id}`;
		if (!L.mapNote && ['city', 'town', 'cave', 'forest'].includes(L.kind)) note('mundo', '·', ww, 'Sin `mapNote`: en el mapa no se sabe qué hay aquí.');
		if (!L.desc) note('mundo', '⚠', ww, 'Sin descripción.');
		if (!L.descNight && ['city', 'town'].includes(L.kind)) note('mundo', '·', ww, 'Sin descripción de noche: la ciudad se ve igual a las 3 a. m. que a mediodía.');
		if (L.route && !Object.keys(L.route.encounters || {}).length && !L.encounters) note('mundo', '·', ww, 'Ruta sin Pokémon salvajes.');
		const things = (L.spots || []).length + Object.values(L.route?.tramos || {}).flat().length + (L.onEnter || []).length;
		if (things === 0) note('mundo', '⚠', ww, 'Lugar vacío: ni botones, ni tramos con cosas, ni escenas.');
		if (!(L.rumors || []).length && ['city', 'town'].includes(L.kind)) note('mundo', '·', ww, 'Sin rumores para la Guía de zona.');
	}
	void blocksAfter;
}

// ---------------- 3. La colección soñada ----------------
// Especies conseguibles: salvajes, salvajes fijos, regalos, eventos y sus líneas evolutivas.
const got = new Set();
const scanSp = (o, depth = 0) => { if (depth > 14 || !o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(x => scanSp(x, depth + 1)); for (const [k, v] of Object.entries(o)) { if (k === 'sp' && typeof v === 'string') got.add(toID(v)); else scanSp(v, depth + 1); } };
scanSp(C.locations); scanSp(C.events); scanSp(C.scripts);
const q = [...got];
while (q.length) { const s = D.species[q.pop()]; for (const e of s?.evos || []) if (!got.has(e)) { got.add(e); q.push(e); } }
// Una especie base por número de Pokédex
const base = {};
for (const [id, s] of Object.entries(D.species)) { if (!s.num || s.num < 1 || s.num > 1025) continue; if (!base[s.num] || id.length < base[s.num].length) base[s.num] = id; }
const lineGot = id => { // ¿se consigue esta especie o alguna de su línea (preevolución)?
	if (got.has(id)) return true;
	for (const [fid, s] of Object.entries(D.species)) if (s.num === D.species[id]?.num && got.has(fid)) return true;
	return false;
};
const byTag = tag => Object.values(base).filter(id => (D.species[id].tags || []).includes(tag));
const GROUPS = [
	['Iniciales', ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'treecko', 'torchic', 'mudkip', 'turtwig', 'chimchar', 'piplup', 'snivy', 'tepig', 'oshawott', 'chespin', 'fennekin', 'froakie', 'rowlet', 'litten', 'popplio', 'grookey', 'scorbunny', 'sobble', 'sprigatito', 'fuecoco', 'quaxly', 'pikachu', 'eevee']],
	['Pseudolegendarios', ['dratini', 'larvitar', 'bagon', 'beldum', 'gible', 'deino', 'goomy', 'jangmoo', 'dreepy', 'frigibax']],
	['Fósiles', ['omanyte', 'kabuto', 'aerodactyl', 'lileep', 'anorith', 'cranidos', 'shieldon', 'tirtouga', 'archen', 'tyrunt', 'amaura', 'dracozolt', 'arctozolt', 'dracovish', 'arctovish']],
	['Evoluciones de Eevee', ['vaporeon', 'jolteon', 'flareon', 'espeon', 'umbreon', 'leafeon', 'glaceon', 'sylveon']],
	['Especiales', ['ditto', 'porygon', 'rotom', 'spiritomb', 'castform', 'kecleon', 'smeargle', 'unown', 'chansey', 'lapras', 'snorlax', 'riolu', 'zorua', 'mimikyu', 'larvesta', 'type null']].map((g, i) => i === 1 ? g.map(toID) : g),
	['Legendarios menores', byTag('Sub-Legendary')],
	['Legendarios', byTag('Restricted Legendary')],
	['Singulares', byTag('Mythical')],
	['Ultraentes', byTag('Ultra Beast')],
	['Paradoja', byTag('Paradox')],
];
const coll = [];
for (const [name, ids] of GROUPS) {
	const list = ids.map(toID).filter(id => D.species[id]);
	const have = list.filter(lineGot), miss = list.filter(id => !lineGot(id));
	coll.push({ name, have, miss, total: list.length });
}

// ---------------- Informe ----------------
const order = { '✖': 0, '⚠': 1, '·': 2 };
const tot = { '✖': 0, '⚠': 0, '·': 0 }; for (const f of found) tot[f.sev]++;
const by = {}; for (const f of found) (by[f.cat] ||= []).push(f);
const fecha = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
const nm = id => D.species[id]?.name || id;
const out = [`# Game Designer · ${fecha}`, '', '> Diseño del juego con ojos de diseñador. **✖ grave** · **⚠ detalle** · **· curiosidad** (opinable).', '',
	`**Total:** ${tot['✖']} graves · ${tot['⚠']} detalles · ${tot['·']} curiosidades. ${Object.keys(C.quests).length} misiones, ${mod.BLOCKS.length} bloques y ${Object.keys(C.locations).length} lugares revisados.`, ''];
for (const [cat, title] of Object.entries(CATS)) {
	const l = (by[cat] || []).sort((a, b) => order[a.sev] - order[b.sev] || a.where.localeCompare(b.where));
	out.push(`## ${title} (${l.length})`, '');
	if (!l.length) { out.push('Bien resuelto. ✅', ''); continue; }
	for (const f of l.slice(0, 100)) out.push(`- ${f.sev} **${f.where}** — ${f.msg}`);
	if (l.length > 100) out.push(`- … y ${l.length - 100} más.`);
	out.push('');
}
out.push('## La colección soñada (pedido de Mario: todos los iniciales, pseudolegendarios, legendarios y especiales)', '',
	'Cuenta como conseguible si se captura, se regala o sale en un evento la especie o alguien de su línea evolutiva. **No es un error**: es el mapa para repartirlos en los bloques futuros (cada legendario con su historia, no tirado en la hierba).', '',
	'| Grupo | Conseguibles | Faltan |', '|---|---|---|');
for (const g of coll) out.push(`| ${g.name} | ${g.have.length}/${g.total} | ${g.miss.length ? g.miss.map(nm).join(', ') : '—'} |`);
out.push('');
const dest = arg('--informe', path.join(ROOT, 'secreto', 'auditorias', `disenador-${fecha}.md`));
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out.join('\n'));
console.log(`Game Designer: ${tot['✖']} graves · ${tot['⚠']} detalles · ${tot['·']} curiosidades`);
for (const [cat, title] of Object.entries(CATS)) if (by[cat]?.length) console.log(`  ${title}: ${by[cat].length}`);
console.log('Colección: ' + coll.map(g => `${g.name} ${g.have.length}/${g.total}`).join(' · '));
console.log(`Informe: ${path.relative(ROOT, dest)}`);
process.exit(strict && tot['✖'] ? 1 : 0);
