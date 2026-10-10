// Comprueba que todas las cinemáticas publicadas (y las de bloques en preparación que se pasen por argumento)
// cumplen el vocabulario de app/js/cine-spec.js. Uso: node herramientas/test/cine-test.mjs [--lista]
import { loadDataNode } from './node-env.mjs';
import { D, toID } from '../../app/js/data.js';
import { C, registerBlock } from '../../app/js/content.js';
import { checkCutscene, CINE_FX, asList } from '../../app/js/cine-spec.js';

loadDataNode();
const mod = await import('../../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);

const has = { npc: id => !!C.npcs[id], species: id => !!D.species[toID(id)], item: id => !!D.items[toID(id)] };
const found = [], seen = new Set();
const walk = (o, where) => {
	if (!o || typeof o !== 'object' || seen.has(o)) return; seen.add(o);
	if (o.cutscene && typeof o.cutscene === 'object') found.push({ where, spec: o.cutscene });
	if (Array.isArray(o)) o.forEach((x, i) => walk(x, `${where}[${i}]`)); else for (const k in o) walk(o[k], `${where}.${k}`);
};
for (const id in C.scripts) walk(C.scripts[id], id);

let fails = 0, frames = 0, rich = 0;
const ok = (cond, msg) => { if (!cond) { fails++; console.log('✖ ' + msg); } };
for (const { where, spec } of found) {
	for (const m of checkCutscene(spec, has)) ok(false, `${where}: ${m}`);
	frames += spec.frames?.length || 0;
	if ((spec.frames || []).some(f => f.actors || f.cam || f.say) || spec.weather || spec.time) rich++;
	if (process.argv.includes('--lista')) console.log(`${where.split('[')[0].split('.')[0]} · ${spec.bg?.type || 'route'} · ${spec.frames?.length} frames`);
}
ok(found.length > 0, 'no se encontró ninguna cinemática');

// El comprobador tiene que cazar lo que está mal
const bad = (spec, re, what) => ok(checkCutscene(spec, has).some(m => re.test(m)), 'el comprobador no detecta: ' + what);
bad({ frames: [{ text: 'a', fx: 'explota' }] }, /fx desconocido/, 'efecto inventado');
bad({ frames: [{ text: 'a', cam: 'arriba' }] }, /cam desconocido/, 'cámara inventada');
bad({ weather: 'granizo', frames: [{ text: 'a' }] }, /weather desconocido/, 'clima inventado');
bad({ frames: [{ text: 'a', actors: [{ id: 'npc_que_no_existe_zz' }] }] }, /npc inexistente/, 'npc inexistente');
bad({ frames: [{ text: 'a', actors: [{ mon: 'Pikablu' }] }] }, /especie inexistente/, 'especie inexistente');
bad({ frames: [{ text: 'a', actors: [{ item: 'objeto_que_no_existe_zz' }] }] }, /objeto inexistente/, 'objeto inexistente');
bad({ frames: [{ text: 'a', actors: [{ mon: 'Pikachu', do: 'bailar' }] }] }, /do desconocido/, 'acción inventada');
bad({ frames: [{ text: 'a', actors: [{ mon: 'Pikachu', emote: 'jaja' }] }] }, /emote desconocido/, 'emote inventado');
bad({ frames: [{ text: 'a', actors: [{ key: 'x', do: 'hop' }] }] }, /aún no está en escena/, 'actor sin presentar');
bad({ frames: [{ text: 'a', txt: 'b' }] }, /clave desconocida/, 'clave inventada');
bad({ frames: [{ text: 'a' }, {}] }, /vacío/, 'frame vacío');
bad({ frames: [] }, /sin frames/, 'escena sin frames');
ok(checkCutscene({ bg: { type: 'cave' }, start: 'dark', frames: [{ text: 'a', item: 'pokeball', fx: 'glow' }, { text: 'b', clear: true, fx: 'light' }] }, has).length === 0, 'el formato de siempre debe pasar limpio');
ok(new Set(CINE_FX).size === CINE_FX.length && asList('x').length === 1, 'vocabulario con repetidos');

console.log(`cinemáticas: ${found.length} (${frames} frames; ${rich} usan el vocabulario nuevo)`);
if (fails) { console.log(`✖ ${fails} fallos`); process.exit(1); }
console.log('✔ todas las cinemáticas cumplen el vocabulario');
