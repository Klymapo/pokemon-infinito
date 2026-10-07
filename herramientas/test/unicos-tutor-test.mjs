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
G.player.badges = ['a', 'b']; G.vars.hitos = 2;
U.uniqueResult(snor.key, 'win');
ok(G.uniq.missed[snor.key]?.badges === 2, 'al debilitarlo queda pendiente');
ok(U.uniquesDue().length === 0, 'no vuelve antes de la siguiente medalla');
G.player.badges.push('c'); G.vars.hitos++;
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
G.vars.hitos = 2;
const added = U.retroUniques();
ok(added.includes('b01_r7_snorlax_flauta:snorlax'), 'retro: Snorlax escapado queda pendiente');
ok(!added.includes('b02_sudowoodo:sudowoodo') && G.uniq.done['b02_sudowoodo:sudowoodo'], 'retro: Sudowoodo capturado no vuelve');
ok(added.includes('b01_r10_tera:hawlucha'), 'retro: Hawlucha sin capturar queda pendiente');
ok(U.retroUniques().length === 0, 'retro solo corre una vez');
ok(G.uniq.missed['b01_r7_snorlax_flauta:snorlax'].origin, `retro: sabe dónde se escapó (${G.uniq.missed['b01_r7_snorlax_flauta:snorlax'].origin})`);

// Hitos sin medallas (regiones con pruebas o jefes que suben el tope)
{
	const S = await import('../../app/js/state.js');
	const { runScript } = await import('../../app/js/guion.js');
	setG(newGame({ name: 'Hitos' }));
	G.loc = Object.keys(C.locations).find(id => C.locations[id].kind === 'city');
	G.vars.cap = 50;
	U.uniqueResult(snor.key, 'win');
	ok(G.uniq.missed[snor.key].h === 0 && U.uniquesDue().length === 0, 'hitos: pendiente sin hito nuevo');
	C.scripts.__t_cap = [{ cap: 55 }]; C.scripts.__t_cap2 = [{ cap: 40 }];
	await runScript('__t_cap2');
	ok(S.hitos() === 0, 'hitos: bajar el tope no cuenta');
	await runScript('__t_cap');
	ok(S.hitos() === 1 && U.uniquesDue().length === 1, 'hitos: un jefe que sube el tope cuenta como hito y el único vuelve');
	ok(U.uniqueWild(snor.key).lv === 47 && U.uniquesList()[0].lv === 47, `segunda oportunidad escalada al tope − 8 (Nv. ${U.uniqueWild(snor.key).lv})`);
	ok(U.returnLevel({ sp: 'bagon', lv: 20 }) === 29 && U.returnLevel({ sp: 'bagon', lv: 32 }) === 32, 'segunda oportunidad: no pasa del nivel de evolución (Bagon ≤ 29)');
	delete C.scripts.__t_cap; delete C.scripts.__t_cap2;
	// Guardado viejo: el contador arranca en las medallas que ya tenía y las entradas viejas se leen por medallas
	const old = JSON.parse(JSON.stringify(G)); delete old.vars.hitos; old.player.badges = ['a', 'b', 'c'];
	old.uniq = { missed: { [snor.key]: { sp: 'snorlax', lv: 30, badges: 3, where: null } }, done: {} };
	const g2 = S.migrate(old); setG(g2);
	ok(S.hitos() === 3 && U.uniquesDue().length === 0, 'migración: hitos = medallas y la entrada vieja espera');
	S.addHito();
	ok(U.uniquesDue().length === 1, 'migración: tras el siguiente hito vuelve');
	// Cajas: «80/30»
	const g3 = JSON.parse(JSON.stringify(G));
	g3.boxes = [Array.from({ length: 80 }, (_, i) => ({ uid: 'm' + i, sp: 'pidgey' })), [], []];
	S.migrate(g3);
	ok(g3.boxes.every(b => b.length <= S.BOX_MAX) && g3.boxes.flat().length === 80 && g3.boxes.length >= 8, `cajas: 80 en la Caja 1 se reparten (${g3.boxes.map(b => b.length).join('/')})`);
	ok(g3.boxes[0][0].uid === 'm0' && g3.boxes[2][19].uid === 'm79', 'cajas: se conserva el orden');
	const g4 = { boxes: Array.from({ length: 8 }, () => Array.from({ length: 30 }, () => ({}))) };
	ok(S.boxInsert(g4, { uid: 'x' }) === 8 && g4.boxes.length === 9, 'cajas: con todo lleno se abre una caja nueva');
}

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

// ---------- Cómo evoluciona y dónde se consigue ----------
const ev = M.evolutionInfo('haunter');
ok(ev[0]?.to === 'gengar' && ev[0].item === 'linkingcord', 'Haunter → Gengar con Cordón Unión');
ok(M.evolutionInfo('roselia')[0]?.how.includes('Piedra Día'), 'Roselia → Roserade con Piedra Día');
ok(/39 de día/.test(M.evolutionInfo('tyrunt')[0]?.how), 'Tyrunt: nivel 39 de día');
const sinVisitar = M.itemSources('firestone');
ok(!sinVisitar.shops.length && sinVisitar.unknown > 0, 'sin visitar no se nombran tiendas (sin spoilers)');
const relieve = Object.values(C.locations).find(l => (l.spots || []).some(sp => sp.action?.shop === 'tienda_piedras'));
G.visited[relieve.id] = true;
const conVisita = M.itemSources('firestone');
ok(conVisita.shops.some(x => x.name.includes('Piedras')), `al visitarla sale la tienda de piedras: ${M.sourcesText('firestone')}`);
const guia = M.shopGuide();
ok(guia.stones.some(x => x.id === 'firestone'), 'la guía de tiendas lista la Piedra Fuego');

console.log(fails ? `\n${fails} fallos` : '\nTodo bien');
process.exit(fails ? 1 : 0);
