// Bot «Superfan»: revisa los pequeños detalles que notaría un fan de Pokémon de toda la vida.
// Uso: node herramientas/superfan.mjs [--informe ruta.md] [--estricto]
//
// No juega la partida (eso es recorrido.mjs) ni valida referencias (eso es validar.mjs):
// lee el contenido como lo leería alguien que se sabe la Pokédex de memoria y apunta lo que «chirría».
// Escribe sus comentarios con voz de fan. Por defecto NO bloquea la publicación; con --estricto
// sale con código 1 si hay detalles graves (los marcados como ✖).
//
// El informe puede tener spoilers (nombres de lugares, entrenadores y equipos): va a secreto/.
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

const S = id => D.species[toID(id)];
const spName = id => S(id)?.name || id;
const mvName = id => D.moves[toID(id)]?.name || id;
const itName = id => D.items[toID(id)]?.name || id;

// ---------------- Hallazgos ----------------
// grave (✖): un fan lo vería como error de canon. detalle (⚠): chirría. curiosidad (·): opinable.
const found = [];
const seenKey = new Set();
function note(cat, sev, where, msg) {
	const k = cat + '|' + where + '|' + msg;
	if (seenKey.has(k)) return; seenKey.add(k);
	found.push({ cat, sev, where, msg });
}
const CATS = {
	niveles: 'Niveles imposibles para su evolución',
	sinEvolucionar: 'Debería haber evolucionado hace rato',
	movimientos: 'Movimientos que aún no podría saber',
	habilidad: 'Habilidades que esa especie no tiene',
	genero: 'Géneros imposibles',
	objetos: 'Objetos de combate que no le sirven',
	gimnasios: 'Líderes que se salen de su tipo',
	regionales: 'Formas regionales fuera de su región',
	habitat: 'Pokémon fuera de su hábitat',
	horario: 'Pokémon a deshoras',
	ingles: 'Nombres en inglés en los textos',
	espanol: 'Español de España que chirría en CDMX',
	precios: 'Precios que no cuadran con los juegos',
};

// ---------------- Datos de evolución ----------------
/** Nivel mínimo al que puede existir una especie si su línea evoluciona por nivel. */
const minLvCache = {};
function minLevel(id) {
	id = toID(id);
	if (id in minLvCache) return minLvCache[id];
	const s = S(id); if (!s) return (minLvCache[id] = 1);
	let m = s.evoLevel || 1;
	if (s.prevo) m = Math.max(m, minLevel(s.prevo));
	return (minLvCache[id] = m);
}
/** Nivel al que evoluciona por nivel (sin condiciones raras) a su siguiente fase, o null. */
function nextEvoLevel(id) {
	const s = S(id); if (!s?.evos?.length) return null;
	const lv = s.evos.map(e => S(e)).filter(e => e && !e.evoType && e.evoLevel && !e.evoCondition && !e.evoRegion).map(e => e.evoLevel);
	return lv.length ? Math.min(...lv) : null;
}
const lvOf = lv => Array.isArray(lv) ? lv : [lv, lv];

// ---------------- Recolectar Pokémon del contenido ----------------
// Cada aparición: { sp, lv:[min,max], where, kind: 'salvaje'|'entrenador'|'regalo', ...extras }
const mons = [];

for (const [id, L] of Object.entries(C.locations)) {
	const region = (L.region || C.locations[L.parent]?.region || '').toLowerCase();
	const tables = { ...(L.encounters || {}), ...(L.route?.encounters || {}) };
	for (const [terrain, list] of Object.entries(tables)) for (const e of list || []) mons.push({ sp: toID(e.sp), lv: lvOf(e.lv), where: `${L.name || id} (${terrain})`, kind: 'salvaje', terrain, time: e.time, region, loc: L, displaced: !!e.displaced });
	for (const [n, list] of Object.entries(L.route?.tramos || {})) for (const t of list) if (t.wildFixed) mons.push({ sp: toID(t.wildFixed.sp), lv: lvOf(t.wildFixed.lv), where: `${L.name || id} · tramo ${n}`, kind: 'salvaje', fixed: true, region, loc: L });
	for (const s of L.spots || []) for (const w of s.action?.training?.wild || []) mons.push({ sp: toID(w.sp), lv: lvOf(w.lv), where: `${L.name || id} · ${s.label}`, kind: 'salvaje', fixed: true, region, loc: L });
}
for (const ev of C.events) for (const [loc, tbl] of Object.entries(ev.encounters || {})) for (const [terrain, list] of Object.entries(tbl)) for (const e of list) {
	const L = C.locations[loc] || {};
	mons.push({ sp: toID(e.sp), lv: lvOf(e.lv), where: `evento ${ev.id} · ${L.name || loc} (${terrain})`, kind: 'salvaje', terrain, time: e.time, region: (L.region || '').toLowerCase(), loc: L, event: true });
}
// Guiones: regalos (pokemon) y salvajes fijos (wild)
const walkScript = (sid, list) => {
	if (!Array.isArray(list)) return;
	for (const c of list) {
		if (!c || typeof c !== 'object') continue;
		if (c.pokemon?.sp) mons.push({ sp: toID(c.pokemon.sp), lv: lvOf(c.pokemon.lv || 5), where: `guion ${sid}`, kind: 'regalo', set: c.pokemon });
		if (c.wild?.sp) mons.push({ sp: toID(c.wild.sp), lv: lvOf(c.wild.lv || 5), where: `guion ${sid}`, kind: 'salvaje', fixed: true, set: c.wild });
		for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit']) walkScript(sid, c[k]);
		if (c.choice) for (const o of c.choice) walkScript(sid, o.then);
	}
};
for (const [sid, list] of Object.entries(C.scripts)) walkScript(sid, list);
// Entrenadores
for (const [tid, t] of Object.entries(C.trainers)) for (const m of t.team || []) mons.push({ sp: toID(m.sp), lv: lvOf(m.lv), where: `${t.cls ? t.cls + ' ' : ''}${t.name || tid} [${tid}]`, kind: 'entrenador', set: m, trainer: t, tid });

// ---------------- Comprobaciones por Pokémon ----------------
const NIGHT_ONLY = new Set(['hoothoot', 'noctowl', 'murkrow', 'misdreavus', 'spinarak', 'ariados', 'sableye', 'duskull', 'zubat', 'golbat', 'gastly', 'haunter', 'kricketot', 'shuppet', 'litwick', 'purrloin', 'drifloon']);
const DAY_ONLY = new Set(['ledyba', 'ledian', 'sunkern', 'sunflora', 'cherubi', 'combee', 'pidgey', 'caterpie', 'weedle', 'butterfree', 'beedrill', 'hoppip', 'yanma']);
const REGIONAL = { alola: 'alola', galar: 'galar', hisui: 'hisui', paldea: 'paldea' };

for (const m of mons) {
	const s = S(m.sp); if (!s) continue;
	const [lo, hi] = m.lv;
	const who = `${spName(m.sp)} nv. ${lo === hi ? lo : lo + '–' + hi}`;
	// Niveles: forma evolucionada por debajo del nivel de evolución de su línea
	const ml = minLevel(m.sp);
	if (ml > 1 && lo < ml && !m.event) {
		const gap = ml - lo;
		const sev = m.kind === 'regalo' ? '·' : gap >= 5 ? '✖' : '⚠';
		note('niveles', sev, m.where, `¿${who}? Su línea no llega a ${spName(m.sp)} hasta el nivel ${ml}. ${m.kind === 'salvaje' ? 'En estado salvaje no debería salir tan bajo' : 'Un entrenador no lo tendría tan pronto'}.`);
	}
	// Sin evolucionar: entrenadores con básicos muy pasados de nivel
	const ne = nextEvoLevel(m.sp);
	if (m.kind === 'entrenador' && ne && lo >= ne + 8 && !m.set?.item?.includes?.('everstone') && m.set?.item !== 'eviolite') {
		note('sinEvolucionar', '⚠', m.where, `${who} y sin evolucionar, cuando evoluciona al ${ne}. Si es a propósito, ¿una Piedra Eterna o un Mineral Evolutivo?`);
	}
	// Formas regionales fuera de su región (solo salvajes)
	if (m.kind === 'salvaje' && m.region && !m.displaced) { // los Pokémon de Fisura vienen de fuera a propósito
		for (const [suf, reg] of Object.entries(REGIONAL)) if (m.sp.endsWith(suf) && m.region !== reg && !m.fixed) note('regionales', '⚠', m.where, `Un ${spName(m.sp)} salvaje en ${m.region}… esa forma es de ${reg}. Fuera de allí sale la forma normal (salvo que haya una explicación en la historia).`);
	}
	// Hábitat: Pokémon de mar en hierba, arena o cueva sin agua
	if (m.kind === 'salvaje' && m.terrain && !m.displaced && s.habitat === 'sea' && !s.types.includes('Flying') && !['water', 'fish', 'surf', 'sea', 'rod', 'dive'].some(t => m.terrain.includes(t))) {
		note('habitat', '⚠', m.where, `${spName(m.sp)} es de mar abierto y aquí aparece en «${m.terrain}». Un fan esperaría verlo surfeando o pescando.`);
	}
	if (m.kind === 'salvaje' && m.terrain === 'grass' && !m.displaced && (s.types.length === 1 && s.types[0] === 'Water') && s.habitat !== 'waters-edge' && s.habitat !== 'grassland' && s.habitat !== 'urban') {
		note('habitat', '·', m.where, `${spName(m.sp)} (tipo Agua puro) entre la hierba. No es imposible, pero chirría si no hay agua cerca.`);
	}
	// Horario
	if (m.kind === 'salvaje' && !m.fixed && !m.displaced && m.terrain && !['cave'].includes(m.terrain) && m.loc?.kind !== 'cave') {
		if (NIGHT_ONLY.has(m.sp) && m.time !== 'night') note('horario', '·', m.where, `${spName(m.sp)} a plena luz del día. En los juegos suele salir solo de noche.`);
		if (DAY_ONLY.has(m.sp) && m.time === 'night') note('horario', '·', m.where, `${spName(m.sp)} de noche. En los juegos suele salir solo de día.`);
	}
	// Equipo concreto (entrenadores y regalos con datos)
	const set = m.set;
	if (!set || m.kind === 'salvaje') continue;
	// Movimientos aún no aprendidos
	const ls = D.learnsets?.[m.sp] || D.learnsets?.[toID(s.baseSpecies || '')];
	const lsPre = []; for (let p = s.prevo; p; p = S(p)?.prevo) if (D.learnsets?.[p]) lsPre.push(D.learnsets[p]);
	const moves = (set.moves || []).map(toID);
	if (moves.length > 4) note('movimientos', '✖', m.where, `${who} con ${moves.length} movimientos. Cuatro, ni uno más.`);
	if (new Set(moves).size !== moves.length) note('movimientos', '✖', m.where, `${who} tiene un movimiento repetido.`);
	if (ls && moves.length) for (const mv of moves) {
		const all = [ls, ...lsPre];
		const other = all.some(l => (l.tm || []).includes(mv) || (l.tutor || []).includes(mv) || (l.egg || []).includes(mv) || (l.event || []).includes?.(mv));
		const lvls = all.flatMap(l => (l.lv || []).filter(([, x]) => x === mv).map(([lv]) => lv));
		if (other || !lvls.length) continue;
		const need = Math.min(...lvls);
		if (need > hi) note('movimientos', need - hi >= 10 ? '⚠' : '·', m.where, `${who} ya sabe ${mvName(mv)}, que no aprende hasta el nivel ${need} (y no es MT, tutor ni huevo).`);
	}
	// Habilidad
	if (set.ability) {
		const ab = Object.values(s.abil || {}).map(toID);
		if (!ab.includes(toID(set.ability))) note('habilidad', '✖', m.where, `${who} con ${set.ability}… esa habilidad no la tiene ${spName(m.sp)} (puede tener ${Object.values(s.abil).join(', ')}).`);
	}
	// Género
	if (set.gender) {
		const g = set.gender;
		if (s.gender && s.gender !== g) note('genero', '✖', m.where, `${who} de género «${g}», pero ${spName(m.sp)} siempre es ${s.gender === 'N' ? 'sin género' : s.gender === 'M' ? 'macho' : 'hembra'}.`);
		else if (!s.gender && ((s.gr === 0 && g === 'M') || (s.gr === 1 && g === 'F'))) note('genero', '✖', m.where, `${who} de género «${g}»: esa especie no puede serlo.`);
	}
	// Objetos de combate: Megapiedras y cristales Z
	if (set.item) {
		const it = D.items[toID(set.item)];
		if (it?.mega && !it.mega.some(f => f.startsWith(m.sp))) note('objetos', '✖', m.where, `${who} lleva ${itName(set.item)}, que es la Megapiedra de otra especie. No le hace nada.`);
		if (it?.z && typeof it.z === 'string' && moves.length && !moves.some(mv => D.moves[mv]?.type === it.z)) note('objetos', '⚠', m.where, `${who} lleva ${itName(set.item)} pero no tiene ningún movimiento de tipo ${it.z}.`);
	}
}

// ---------------- Gimnasios ----------------
// Antes de la 6.ª generación estos eran de tipo Normal: un fan reconoce el guiño (el Clefairy de Blanca).
const OLD_NORMAL = new Set(['clefairy', 'clefable', 'cleffa', 'togepi', 'togetic', 'snubbull', 'granbull', 'azurill', 'marill', 'azumarill']);
for (const [cid, ch] of Object.entries(C.challenges)) {
	if (!ch.type || !ch.trainer || !/gym|gimnasio/i.test(cid + ' ' + (ch.name || ''))) continue;
	const t = C.trainers[ch.trainer]; if (!t) continue;
	for (const m of t.team || []) {
		const s = S(m.sp); if (!s) continue;
		const tera = (m.tera && toID(m.tera) === toID(ch.type)) || (ch.type === 'Normal' && OLD_NORMAL.has(toID(m.sp)));
		if (!s.types.includes(ch.type) && !tera) note('gimnasios', '⚠', `${ch.name}`, `¿${spName(m.sp)} en un gimnasio de tipo ${ch.type}? No es de ese tipo${m.tera ? ' ni se teracristaliza a él' : ''}.`);
	}
}

// ---------------- Textos en inglés ----------------
const EN = new Map();
const addEn = (o, kind) => { for (const v of Object.values(o)) if (v?.nameEn && v.name && v.nameEn !== v.name && v.nameEn.length >= 6 && !v.nonstd) EN.set(v.nameEn, `${kind} «${v.name}»`); };
addEn(D.moves, 'el movimiento'); addEn(D.items, 'el objeto');
const enRe = new RegExp('(?<![\\wÁÉÍÓÚáéíóúñÑ])(' + [...EN.keys()].sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\wÁÉÍÓÚáéíóúñÑ])', 'g');
const texts = [];
const collect = (where, o, depth = 0) => {
	if (depth > 12 || o == null) return;
	if (typeof o === 'string') { if (o.length > 3 && /\s/.test(o)) texts.push([where, o]); return; }
	if (Array.isArray(o)) return o.forEach(x => collect(where, x, depth + 1));
	if (typeof o === 'object') for (const [k, v] of Object.entries(o)) if (!['sp', 'id', 'moves', 'item', 'ability', 'script', 'cond', 'flag', 'go', 'give', 'take', 'nature', 'sprite', 'bg', 'look', 'trainer', 'shop'].includes(k)) collect(where, v, depth + 1);
};
for (const [id, s] of Object.entries(C.scripts)) collect('guion ' + id, s);
for (const [id, l] of Object.entries(C.locations)) collect('lugar ' + id, l);
for (const [id, q] of Object.entries(C.quests)) collect('misión ' + id, q);
for (const [id, t] of Object.entries(C.trainers)) collect('entrenador ' + id, { intro: t.intro, win: t.win, lose: t.lose });
for (const [id, c] of Object.entries(C.challenges)) collect('reto ' + id, c);
for (const ev of C.events) collect('evento ' + ev.id, ev);
for (const [id, it] of Object.entries(D.items)) if (it.custom) collect('objeto ' + id, { desc: it.desc, read: it.read });
for (const [where, t] of texts) for (const mt of t.matchAll(enRe)) note('ingles', '⚠', where, `Dice «${mt[1]}» en inglés; en los juegos en español es ${EN.get(mt[1])}.`);

// ---------------- Español para CDMX ----------------
// Mario es de Ciudad de México: «coger» es vulgar allí, y el «vosotros» y el «vale» de muletilla suenan a España.
// No toca «recoger», «escoger», «acoger», «cojín», «cojo» (adjetivo), «vale la pena», «no vale nada», «un vale».
const W = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';
const ES_RULES = [
	[new RegExp(`(?<![${W}])[Cc](?:og(?:er|e|es|en|í|ió|ido|ida|idos|idas|iste|isteis|ieron|emos|éis|ía|ías|ían|íamos|imos|iendo)(?:l[oae]s?|me|te|nos|se)?|óge(?:l[oae]s?|me|nos)|ógel[oa]s?)(?![${W}])`, 'g'), m => `«${m}»: en México es vulgar; mejor tomar, agarrar, subir (a un tren) o llevarse.`],
	[new RegExp(`(?<![${W}])(?:[Vv]osotr[oa]s|[Vv]uestr[oa]s?|[Oo]s)(?![${W}])`, 'g'), m => `«${m}»: vosotros; en CDMX se dice ustedes / les / su.`],
	[new RegExp(`(?<![${W}])(?!(?:[Vv]einti|[Dd]ieci)?séis)[${W}]+(?:áis|éis)(?![${W}])`, 'g'), m => `«${m}»: conjugación de vosotros; mejor la de ustedes.`],
	[new RegExp(`(?<![${W}])(?:${'dejad coged mirad venid bajad subid callad tomad escuchad esperad corred sentaos pasad decid traed haced andad apuntad'.split(' ').map(v => `[${v[0]}${v[0].toUpperCase()}]${v.slice(1)}`).join('|')})(?:l[oa]s?|me|nos)?(?![${W}])`, 'g'), m => `«${m}»: imperativo de vosotros; mejor el de ustedes.`],
	[new RegExp(`(?<![${W}])(?:Vale(?=[.,!…])|¿[Vv]ale\\?|(?<=, )vale(?=[.!…]))`, 'g'), m => `«${m}» como muletilla: en CDMX suena mejor «va», «sale», «bueno», «ok» o «de acuerdo».`],
	[new RegExp(`(?<![${W}])(?:chaval(?:es|a|as)?|mola(?:n|s)?|guay|gilipollas|hostias?|ordenador(?:es)?|zumos?|patatas?|flip(?:ar|a|as|an|ante|é|ó|ando)|curr(?:ar|o|as|a|an|ando|é|ó))(?![${W}])`, 'gi'), m => `«${m}»: palabra muy de España; busca la de México (computadora, jugo, papa, chamba…) o una neutra.`],
];
for (const [where, t] of texts) for (const [re, msg] of ES_RULES) for (const mt of t.matchAll(re)) note('espanol', '·', where, msg(mt[0]));

// ---------------- Precios ----------------
for (const [sid, sh] of Object.entries(C.shops)) for (const e of sh.items) {
	if (typeof e !== 'object' || !e.price) continue;
	const it = D.items[toID(e.id)]; if (!it || it.custom || !it.cost) continue;
	const r = e.price / it.cost;
	if (r > 2 || r < 0.5) note('precios', '·', sh.name || sid, `${it.name} a ₽${e.price}; en los juegos cuesta ₽${it.cost}.`);
}

// ---------------- Informe ----------------
const order = { '✖': 0, '⚠': 1, '·': 2 };
const byCat = {};
for (const f of found) (byCat[f.cat] ||= []).push(f);
const tot = { '✖': 0, '⚠': 0, '·': 0 };
for (const f of found) tot[f.sev]++;
const fecha = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
const out = [];
out.push(`# Superfan · ${fecha}`, '');
out.push('> Revisión de detalles de canon con ojos de fan de toda la vida. **✖ grave** (un fan lo vería como error), **⚠ detalle** (chirría), **· curiosidad** (opinable, puede ser a propósito).', '');
out.push(`**Total:** ${tot['✖']} graves · ${tot['⚠']} detalles · ${tot['·']} curiosidades. Revisados ${mons.length} Pokémon (salvajes, regalos y entrenadores), ${Object.keys(C.challenges).length} retos y ${texts.length} textos.`, '');
for (const [cat, title] of Object.entries(CATS)) {
	const list = (byCat[cat] || []).sort((a, b) => order[a.sev] - order[b.sev] || a.where.localeCompare(b.where));
	out.push(`## ${title} (${list.length})`, '');
	if (!list.length) { out.push('Nada que reprochar. 👌', ''); continue; }
	for (const f of list.slice(0, 80)) out.push(`- ${f.sev} **${f.where}** — ${f.msg}`);
	if (list.length > 80) out.push(`- … y ${list.length - 80} más.`);
	out.push('');
}
const md = out.join('\n');
const dest = arg('--informe', path.join(ROOT, 'secreto', 'auditorias', `superfan-${fecha}.md`));
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, md);
// Resumen en consola, sin spoilers (solo conteos por categoría)
console.log(`Superfan: ${tot['✖']} graves · ${tot['⚠']} detalles · ${tot['·']} curiosidades`);
for (const [cat, title] of Object.entries(CATS)) { const n = byCat[cat]?.length || 0; if (n) console.log(`  ${title}: ${n}`); }
console.log(`Informe: ${path.relative(ROOT, dest)}`);
process.exit(strict && tot['✖'] ? 1 : 0);
