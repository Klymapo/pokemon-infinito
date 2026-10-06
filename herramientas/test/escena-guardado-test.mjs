// Prueba: si la app se cierra a mitad de una escena, se guarda la partida de antes de la escena.
// Uso: node herramientas/test/escena-guardado-test.mjs
import { loadDataNode } from './node-env.mjs';
import { registerBlock } from '../../app/js/content.js';
import { newGame, setG, G, saveGame, beginScene, endScene, commitScene } from '../../app/js/state.js';
import { runScript, UI } from '../../app/js/guion.js';
loadDataNode();
const mod = await import('../../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);

const store = {};
globalThis.localStorage = { setItem: (k, v) => { store[k] = v; }, getItem: k => store[k] ?? null, removeItem: k => { delete store[k]; } };
const saved = () => JSON.parse(store['pinf-slot1']);

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('✖', m); } else console.log('✔', m); };

setG(newGame({ name: 'Prueba' }));
G.loc = 'gym_trigal';

// Escena cortada: la app se cierra (visibilitychange → saveGame) mientras se lee un diálogo.
let closeNow = true;
UI.say = async () => { if (closeNow) { closeNow = false; await saveGame(); } };
UI.choose = async () => 0;
UI.refresh = () => {};
beginScene(); G.flags['enter:gym_trigal:x'] = true;
await runScript([{ set: { 'flag.prueba_ini': true } }, { text: 'hola' }, { set: { 'flag.prueba_fin': true } }]);
endScene();
ok(!saved().flags.prueba_ini && !saved().flags['enter:gym_trigal:x'], 'cerrar a mitad guarda el estado de antes de la escena');
await saveGame();
ok(saved().flags.prueba_ini && saved().flags.prueba_fin, 'al terminar la escena se guarda todo');

// { save: true } confirma lo hecho dentro de la escena
closeNow = false;
UI.say = async () => { await saveGame(); };
await runScript([{ set: { 'flag.prueba_b': true } }, { save: true }, { text: 'sigue' }]);
ok(saved().flags.prueba_b, '{ save: true } confirma la escena');

// La intro de una partida nueva (sin lugar) se guarda como antes
setG(newGame({ name: 'Nuevo' }));
G.loc = null;
UI.say = async () => { await saveGame(); };
await runScript([{ set: { 'flag.intro': true } }, { text: 'intro' }]);
ok(saved().flags.intro, 'la intro sin lugar no se congela');

console.log(fails ? `\n${fails} fallos` : '\nTodo bien');
process.exit(fails ? 1 : 0);
