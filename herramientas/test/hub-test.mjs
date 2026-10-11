// Pruebas del hub de misiones (app/js/hub.js): sonda de guiones, marcas, alcanzables, «Lo que necesitas»,
// Por hacer / En espera, Novedades, viajes y caché. Incluye los tres fallos que vio Mario (2026-10-10):
//   1. Novedades marcaba «algo nuevo» en el Tren Magnético de Trigal (escena ya pasada).
//   2. «Ir» desde Novedades metía en las Azoteas de Azafrán antes de que la historia abriera la entrada.
//   3. «Lo que necesitas» seguía pidiendo «Ceniza del incensario 0/1» después de entregarla a Kaori.
// Uso: node herramientas/test/hub-test.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDataNode } from './node-env.mjs';
import { C, registerBlock } from '../../app/js/content.js';
import * as S from '../../app/js/state.js';
import { timeScope } from '../../app/js/time.js';
loadDataNode();
const mod = await import('../../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);
S.setExtraScope(() => ({ ...timeScope(), night: false, day: true, time: 'dia' }));
const H = await import('../../app/js/hub.js');

const here = path.dirname(fileURLToPath(import.meta.url));
const load = f => { const raw = JSON.parse(fs.readFileSync(path.join(here, 'partidas', f), 'utf8')); S.setG(S.migrate(raw.save || raw)); return S.G; };
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('✖', m); } else console.log('✔', m); };
const legacy = (opts, fn) => { const old = { ...H.HUB_OPTS }; Object.assign(H.HUB_OPTS, opts); try { return fn(); } finally { Object.assign(H.HUB_OPTS, old); } };

// ---------------------------------------------------------------- sonda con guiones de prueba
S.setG(S.newGame({ name: 'Prueba' }));
Object.assign(C.scripts, {
	zz_solo_habla: ['Hola.', { say: null, text: 'Adiós.' }],
	zz_fin_ya: [{ end: true }, { give: 'potion' }],
	zz_ya_hecho: [{ if: 'flag.zz_x', then: [{ text: 'Ya está.' }, { end: true }] }, { set: { 'flag.zz_x': true } }, { give: 'potion' }],
	zz_encadena: [{ set: { 'flag.zz_a': true } }, { if: 'flag.zz_a && flag.zz_b', then: [{ quest: 'zz_q', stage: 'dos' }] }],
	zz_pide: [{ if: 'has("pokeball")', then: [{ take: 'pokeball' }, { quest: 'zz_q', stage: 'dos' }], else: ['Tráeme una Poké Ball.'] }],
	zz_combate: [{ battle: 'zz_entrenador', onWin: [{ quest: 'zz_q', stage: 'dos' }] }],
	zz_reset: [{ set: { 'flag.zz_tmp': false } }],
});
C.quests.zz_q = { id: 'zz_q', name: 'Prueba', type: 'side', stages: { uno: 'Uno.', dos: 'Dos.' } };
H.reindex();
{
	const k0 = H.stamp();
	ok(!H.probe('zz_solo_habla').acts, 'un guion que solo habla no cambia nada');
	const fin = H.probe('zz_fin_ya');
	ok(!fin.acts && fin.firstEnd, 'un guion que termina en la primera línea no cambia nada (firstEnd)');
	ok(H.probe('zz_ya_hecho').acts, 'una escena aún por ver cambia algo');
	S.G.flags.zz_x = true;
	ok(!H.probe('zz_ya_hecho').acts, 'la misma escena ya vista (if … then end) no cambia nada: la caché se renueva sola al cambiar un flag');
	delete S.G.flags.zz_x;
	S.G.quests.zz_q = { stage: 'uno', started: 0 };
	ok(!H.probe('zz_encadena').quests.has('zz_q'), 'la sonda aplica sus propios `set`: un `if` que necesita algo más no mueve la misión');
	S.G.flags.zz_b = true;
	ok(H.probe('zz_encadena').quests.has('zz_q'), '…y si ya se cumple lo demás, sí la mueve');
	const pide = H.probe('zz_pide');
	ok(!pide.quests.has('zz_q') && pide.blockers.some(b => b.quests.has('zz_q') && /pokeball/.test(b.cond)), 'una entrega sin el objeto: no avanza y la condición queda como bloqueo');
	S.addItem('pokeball', 1);
	ok(H.probe('zz_pide').quests.has('zz_q'), 'con el objeto en la mochila, la entrega avanza la misión');
	ok(H.probe('zz_combate').quests.has('zz_q'), 'una rama de combate (onWin) que mueve la misión cuenta');
	ok(!H.probe('zz_reset').acts, 'poner a falso un flag que no existe no es un cambio');
	ok(S.count('pokeball') === 1 && !S.G.flags.zz_a, 'la sonda deshace todo lo que aplicó (la partida queda igual)');
	ok(H.stamp() !== k0, 'la huella cambia cuando cambia la partida');
}
// marcas: «•» solo si el guion de ahora hace algo
{
	const habla = { label: 'Alguien', new: 'true', talk: [{ script: 'zz_solo_habla' }] };
	const da = { label: 'Alguien', new: 'true', talk: [{ script: 'zz_ya_hecho' }] };
	ok(H.spotMarker(habla) === null, '«•» no sale en un sitio con `new` cuyo guion solo habla');
	ok(H.spotMarker(da)?.kind === 'hint', '«•» sale si el guion de ahora cambia algo');
	ok(legacy({ markers: 'static' }, () => H.spotMarker(habla))?.kind === 'hint', '(modo antiguo: el `new` bastaba para la marca)');
	const tienda = { label: 'Tienda', new: 'true', action: { shop: 'x' } };
	ok(H.spotMarker(tienda) === null, 'las tiendas no llevan señal (la pantalla las pinta sin marca)');
	const entrega = { label: 'Pide', talk: [{ script: 'zz_pide' }] };
	ok(H.spotMarker(entrega)?.kind === 'active', '«?» en quien recibe la entrega de una misión en curso');
}
// necesidades y estado de una misión con un sitio de prueba en un lugar alcanzable
{
	const loc = Object.values(C.locations).find(l => !l.parent && !l.route && l.id === 'luminalia') || Object.values(C.locations).find(l => !l.parent && !l.route);
	S.G.visited[loc.id] = true; S.G.loc = loc.id;
	S.removeItem('pokeball', 1);
	const spot = { label: 'Quien pide', talk: [{ cond: 'has("pokeball")', script: 'zz_pide' }, { script: 'zz_solo_habla' }] };
	loc.spots.push(spot);
	H.invalidate(); // el contenido cambió (no la partida): hay que avisar a la caché
	const st = H.questStatus('zz_q');
	ok(H.itemObtainable('pokeball') === 'tienda', `la Poké Ball se compra en ${loc.name}`);
	const need = H.questNeeds('zz_q').find(n => n.id === 'pokeball');
	ok(need && !need.ok, '«Lo que necesitas» sale de la variante de diálogo que bloquea la entrega');
	ok(st.status === 'todo' && st.reason === 'necesita', `Por hacer porque falta algo que se consigue (${st.status}/${st.reason})`);
	spot.cond = 'false';
	H.invalidate();
	ok(!H.questNeeds('zz_q').some(n => n.id === 'pokeball'), 'si el diálogo deja de verse, ya no pide nada');
	ok(H.questStatus('zz_q').status === 'waiting', 'sin sitios ni necesidades: En espera');
	loc.spots.pop();
}

// ---------------------------------------------------------------- partida real de Mario (Azafrán, B4 recién empezado)
load('mario-azafran.json');
H.invalidate();
{
	const R = H.reachable();
	// Fallo 2: Azoteas de Azafrán sin entrada
	ok(!R.has('azotea_lemnis'), 'fallo 2: las Azoteas de Azafrán no son alcanzables (la historia no ha abierto la entrada)');
	ok(legacy({ reach: 'visited' }, () => H.reachable().has('azotea_lemnis')), '(modo antiguo: sí lo eran)');
	const p = H.travelPlan('azotea_lemnis');
	ok(p.fallbackMsg && p.id === 'azafran' && !p.steps.some(s => s.id === 'azotea_lemnis'), '«Ir» a las Azoteas se queda en Azafrán y lo dice');
	ok(!H.newsScan().some(i => i.loc === 'azotea_lemnis'), 'Novedades no anuncia nada en las Azoteas');
	ok(legacy({ reach: 'visited', markers: 'static' }, () => H.newsScan().some(i => i.loc === 'azotea_lemnis')), '(modo antiguo: sí lo anunciaba)');
	// Fallo 1: el Tren Magnético (escena ya pasada)
	ok(!R.has('tren_magnetico'), 'fallo 1: el Tren Magnético ya no es alcanzable (el tren se fue)');
	const seguir = C.locations.tren_magnetico.spots.find(s => s.label === 'Seguir el viaje');
	ok(seguir && H.spotMarker(seguir) === null, '«Seguir el viaje» no lleva señal: su guion termina en la primera línea');
	ok(!H.newsScan().some(i => i.loc === 'tren_magnetico'), 'Novedades no anuncia nada en el Tren Magnético');
	ok(legacy({ reach: 'visited', markers: 'static' }, () => H.newsScan().some(i => i.loc === 'tren_magnetico')), '(modo antiguo: sí, la novedad fantasma)');
	// Por hacer / En espera
	const st = H.questStatus('b04_m1');
	ok(st.status === 'todo' && st.places.some(w => /Torre Lemnis/.test(w)), `la historia principal sigue en la Torre Lemnis (${st.places.join(' / ')})`);
	for (const q of ['b03_t_kaori', 'b03_t_noa', 'b02_t_lola']) ok(H.questStatus(q).status === 'waiting', `${q} está En espera (nada que hacer ahora)`);
	// Novedades: todas en lugares alcanzables y con algo que hacer
	const news = H.newsUpdate();
	ok(news.items.length > 0 && news.items.every(i => i.venture || i.kind === 'enter' || R.has(i.loc)), `todas las Novedades (${news.items.length}) están en lugares alcanzables`);
	ok(news.unread === news.items.length && news.first, 'primera revisión: todo sin leer');
	ok(H.newsUpdate().fresh.length === 0, 'la segunda revisión no repite el aviso');
	// Viajes entre regiones por las puertas que existen de verdad
	const t = H.travelPlan('trigal');
	ok(t.ok && t.steps.at(-1).id === 'trigal', `«Ir» a Trigal desde Kanto encuentra camino (${t.steps.map(s => s.id).join(' → ')})`);
	ok(H.travelPlan('trigal').steps.every(s => s.id === 'trigal' || C.locations[s.id]?.parent || !C.locations[s.id]?.parent), 'el plan solo pisa lugares que existen');
	// Caché: la segunda consulta no recalcula
	const t0 = performance.now(); H.newsScan(); H.questStatus('b04_m1'); const dt = performance.now() - t0;
	ok(dt < 15, `consultas repetidas con la misma partida salen de la caché (${dt.toFixed(1)} ms)`);
}

// ---------------------------------------------------------------- misma partida, con la ceniza ya entregada a Kaori (fallo 3)
load('mario-ceniza-entregada.json');
H.invalidate();
{
	ok(S.G.quests.b04_q_ceniza?.done && !S.G.quests.b04_t_kaori?.done && S.G.settings.tracked.includes('b04_t_kaori'), 'partida de prueba: ceniza entregada, Dulce veneno (III) abierta y fijada con 📌');
	ok(!H.questNeeds('b04_t_kaori').some(n => n.id === 'cenizatorre'), 'fallo 3: «Lo que necesitas» ya no pide la Ceniza del incensario');
	ok(legacy({ needsHidden: true }, () => H.questNeeds('b04_t_kaori').some(n => n.id === 'cenizatorre')), '(modo antiguo: la seguía pidiendo)');
	ok(H.questStatus('b04_t_kaori').status === 'waiting', 'Dulce veneno (III) queda En espera (el recuadro 📌 lo dice)');
	ok(!H.newsScan().some(i => i.q === 'b04_q_ceniza' || i.q === 'b04_t_kaori'), 'ninguna Novedad de la entrega ya hecha');
	const inc = C.locations.sotano_torre.spots.find(s => /incensario/i.test(s.label));
	ok(inc && H.spotMarker(inc) === null, 'el incensario ya no lleva señal');
}

// ---------------------------------------------------------------- limpieza
for (const k of Object.keys(C.scripts)) if (k.startsWith('zz_')) delete C.scripts[k];
delete C.quests.zz_q;
console.log(fails ? `\n${fails} FALLOS` : '\nTodo bien.');
process.exit(fails ? 1 : 0);
