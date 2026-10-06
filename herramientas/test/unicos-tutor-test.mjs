// Pruebas: Pokémon únicos que vuelven y Tutor de movimientos.
// Uso: node herramientas/test/unicos-tutor-test.mjs
import { loadDataNode } from './node-env.mjs';
import { C, registerBlock } from '../../app/js/content.js';
import { newGame, setG, G } from '../../app/js/state.js';
import { createPokemon } from '../../app/js/pokemon.js';
loadDataNode();
const mod = await import('../../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);
const U = await import('../../app/js/unicos.js');
const M = await import('../../app/js/movimientos.js');

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('✖', m); } else console.log('✔', m); };

// ---------- Únicos ----------
const all = U.allUniques();
ok(all.length >= 7, `registro de únicos: ${all.length} (${all.map(u => u.key).join(', ')})`);
ok(!all.some(u => u.sid === 'b02_concurso'), 'el concurso de bichos no cuenta como único');
ok(!all.some(u => u.wild.noCatch), 'los noCatch no cuentan');
const snor = all.find(u => u.wild.sp === 'snorlax');
ok(snor && U.uniqueKeyOf(snor.wild) === snor.key, 'se reconoce el wild del Snorlax por identidad');

setG(newGame({ name: 'Prueba' }));
G.loc = Object.keys(C.locations).find(id => C.locations[id].kind === 'city');
G.player.badges = ['a', 'b'];
U.uniqueResult(snor.key, 'win');
ok(G.uniq.missed[snor.key]?.badges === 2, 'al debilitarlo queda pendiente');
ok(U.uniquesDue().length === 0, 'no vuelve antes de la siguiente medalla');
G.player.badges.push('c');
const due = U.uniquesDue();
ok(due.length === 1 && C.locations[due[0].where], `vuelve tras la medalla, en ${due[0]?.where}`);
ok(U.uniqueSpotsAt(due[0].where).some(s => s.action.unique === snor.key), 'aparece el sitio "ha vuelto"');
U.markAnnounced([snor.key]);
ok(U.uniquesDue().length === 0, 'solo se anuncia una vez');
U.uniqueResult(snor.key, 'run');
ok(G.uniq.missed[snor.key].badges === 3 && U.uniqueSpotsAt(due[0].where).length === 0, 'si huye otra vez, espera a la medalla siguiente');
U.uniqueResult(snor.key, 'caught');
ok(!G.uniq.missed[snor.key] && G.uniq.done[snor.key] && G.flags.b01_snorlax_atrapado, 'al capturarlo se cierra y activa su flag de captura');
U.uniqueResult(snor.key, 'win');
ok(!G.uniq.missed[snor.key], 'uno ya capturado no vuelve a quedar pendiente');

// Retroactivo
setG(newGame({ name: 'Retro' }));
G.player.badges = ['a', 'b'];
G.flags.b01_snorlax = true;
G.flags.b02_sudowoodo = true; G.flags.b02_sudowoodo_atrapado = true;
G.flags.b01_r10_tera = true;
const added = U.retroUniques();
ok(added.includes('b01_r7_snorlax_flauta:snorlax'), 'retro: Snorlax escapado queda pendiente');
ok(!added.includes('b02_sudowoodo:sudowoodo') && G.uniq.done['b02_sudowoodo:sudowoodo'], 'retro: Sudowoodo capturado no vuelve');
ok(added.includes('b01_r10_tera:hawlucha'), 'retro: Hawlucha sin capturar queda pendiente');
ok(U.retroUniques().length === 0, 'retro solo corre una vez');
ok(G.uniq.missed['b01_r7_snorlax_flauta:snorlax'].origin, `retro: sabe dónde se escapó (${G.uniq.missed['b01_r7_snorlax_flauta:snorlax'].origin})`);

// ---------- Tutor ----------
setG(newGame({ name: 'Tutor' }));
const rose = createPokemon('roserade', { level: 32 });
rose.moves = [{ id: 'absorb', pp: 25, ppUps: 0 }];
G.party.push(rose);
const rec = M.recallable(rose).map(r => r.id);
ok(rec.includes('gigadrain') && rec.includes('magicalleaf'), 'Roserade puede recordar lo de Roselia (Gigadrenado, Hoja Mágica)');
ok(!rec.includes('absorb'), 'no ofrece lo que ya sabe');
const gal = createPokemon('gallade', { level: 30 });
gal.moves = [{ id: 'confusion', pp: 25, ppUps: 0 }];
G.boxes[0].push(gal);
ok(M.recallable(gal).some(r => r.id === 'falseswipe'), 'Gallade puede recordar Falso Tortazo');
const R = M.moveReport('falseswipe');
ok(R.recall.some(o => o.p === gal && o.where === 'Caja 1'), 'el buscador encuentra a Gallade en la caja');
const R2 = M.moveReport('absorb');
ok(R2.has.some(o => o.p === rose), 'el buscador dice quién lo tiene');
const gas = createPokemon('gastly', { level: 30 });
G.party.push(gas);
ok(M.upcoming(gas).some(u => u.id === 'shadowball' && u.lv === 40), 'muestra lo que aprenderá más adelante');
G.bag.mt_bola_sombra = 1;
const R3 = M.moveReport('shadowball');
ok(R3.later.some(o => o.p === gas), 'Gastly aprenderá Bola Sombra por nivel');

console.log(fails ? `\n${fails} fallos` : '\nTodo bien');
process.exit(fails ? 1 : 0);
