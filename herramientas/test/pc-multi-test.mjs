// Pruebas: PC con selección múltiple, mover cajas de lugar y nombres de caja (lógica pura de app/js/pc.js).
// Uso: node herramientas/test/pc-multi-test.mjs
import { loadDataNode } from './node-env.mjs';
import { newGame, setG, G, BOX_MAX } from '../../app/js/state.js';
import { createPokemon, maxHp } from '../../app/js/pokemon.js';
loadDataNode();
const PC = await import('../../app/js/pc.js');

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('✖', m); } else console.log('✔', m); };
const mon = (sp = 'rattata', lv = 5) => createPokemon(sp, lv);
const fresh = (party = 3) => { setG(newGame({ name: 'Prueba' })); G.party = Array.from({ length: party }, () => mon('pidgey', 8)); G.boxes = Array.from({ length: 8 }, () => []); delete G.boxNames; };
const total = () => G.party.length + G.boxes.reduce((a, b) => a + b.length, 0);

// ---------- Caja destino casi llena ----------
fresh();
G.boxes[0] = Array.from({ length: 5 }, () => mon());
G.boxes[1] = Array.from({ length: BOX_MAX - 2 }, () => mon('zubat'));
let sel = G.boxes[0].slice();
let before = total();
let r = PC.moveMany(G, sel, { where: 'box', box: 1 });
ok(r.moved.length === 2 && r.noRoom.length === 3, `caja casi llena: entran 2 y 3 no caben (${r.moved.length}/${r.noRoom.length})`);
ok(G.boxes[1].length === BOX_MAX && G.boxes[0].length === 3, 'la caja destino queda llena y los demás siguen en la suya');
ok(G.boxes[1][BOX_MAX - 2] === sel[0] && G.boxes[1][BOX_MAX - 1] === sel[1], 'entran en el orden de la selección');
ok(G.boxes[0][0] === sel[2], 'los que no caben conservan su orden');
ok(total() === before, 'no se pierde ni se duplica nadie');
r = PC.moveMany(G, G.boxes[1].slice(0, 2), { where: 'box', box: 1 });
ok(r.already.length === 2 && !r.moved.length, 'mover a la caja donde ya están no hace nada');

// Con desborde: lo que no cabe va a la siguiente caja con hueco
fresh();
G.boxes[1] = Array.from({ length: BOX_MAX - 1 }, () => mon('zubat'));
r = PC.moveMany(G, G.party.slice(0, 2), { where: 'box', box: 1, overflow: true });
ok(r.moved.length === 2 && G.boxes[1].length === BOX_MAX && G.boxes[2].length === 1, 'con desborde, el que no cabe pasa a la caja siguiente');

// ---------- El equipo no puede quedar vacío ----------
fresh(3);
sel = G.party.slice();
r = PC.moveMany(G, sel, { where: 'box', box: 0 });
ok(r.moved.length === 2 && r.kept.length === 1 && G.party.length === 1, 'al dejar todo el equipo, uno se queda');
ok(G.party[0] === sel[2] && r.kept[0] === sel[2], 'se queda el último de la selección');
r = PC.moveMany(G, G.party.slice(), { where: 'box', box: 0 });
ok(!r.moved.length && G.party.length === 1, 'con uno solo en el equipo no se mueve');

// ---------- Curación al dejar en el PC ----------
fresh(3);
const herido = G.party[0];
herido.hp = 1; herido.status = 'psn'; herido.moves[0].pp = 0;
const enCaja = mon(); enCaja.hp = 1; G.boxes[2].push(enCaja);
PC.moveMany(G, [herido, enCaja], { where: 'box', box: 0 });
ok(herido.hp === maxHp(herido) && !herido.status && herido.moves[0].pp > 0, 'del equipo a una caja: se cura del todo');
ok(enCaja.hp === 1 && G.boxes[0].includes(enCaja), 'de caja a caja no se cura (ya estaba en el PC)');

// ---------- Selección mezclada equipo + cajas ----------
fresh(4);
G.boxes[0] = [mon(), mon()]; G.boxes[3] = [mon('zubat'), mon('zubat'), mon('zubat')];
sel = [G.boxes[3][1], G.party[1], G.boxes[0][0], G.party[3]];
before = total();
r = PC.moveMany(G, sel, { where: 'box', box: 5 });
ok(r.moved.length === 4 && G.boxes[5].length === 4 && G.boxes[5].every((p, i) => p === sel[i]), 'mezcla de equipo y dos cajas: llegan los 4 en orden');
ok(G.party.length === 2 && G.boxes[0].length === 1 && G.boxes[3].length === 2 && total() === before, 'cada origen pierde solo los suyos');
// Por uid también vale
r = PC.moveMany(G, [sel[0].uid, sel[1].uid, 'no-existe'], { where: 'box', box: 6 });
ok(r.moved.length === 2 && G.boxes[6].length === 2, 'también acepta uids (y se salta los que no existen)');
// Repetidos en la selección
r = PC.moveMany(G, [sel[2], sel[2]], { where: 'box', box: 7 });
ok(r.moved.length === 1 && G.boxes[7].length === 1, 'un Pokémon repetido en la selección solo se mueve una vez');

// ---------- Llevar al equipo ----------
fresh(4);
G.boxes[0] = [mon(), mon(), mon()];
sel = [G.party[0], ...G.boxes[0]];
r = PC.moveMany(G, sel, { where: 'party' });
ok(r.moved.length === 2 && r.noRoom.length === 1 && r.already.length === 1 && G.party.length === 6, 'al equipo: entran hasta 6, avisa del que no cabe y no cuenta al que ya estaba');
ok(G.boxes[0].length === 1 && G.boxes[0][0] === sel[3], 'el que no cabe sigue en su caja');
// El compañero se mueve como cualquiera
fresh(2);
G.vars.riolu_uid = G.party[0].uid;
r = PC.moveMany(G, [G.party[0]], { where: 'box', box: 0 });
ok(r.moved.length === 1 && G.boxes[0][0].uid === G.vars.riolu_uid, 'el compañero se puede dejar en el PC igual que ahora');

// ---------- Nombres y mover cajas ----------
fresh();
ok(PC.boxName(G, 0) === 'Caja 1' && PC.boxName(G, 7) === 'Caja 8', 'sin nombre: «Caja N»');
PC.setBoxName(G, 2, '  Favoritos del mundo entero  ');
ok(PC.boxName(G, 2) === 'Favoritos de' && PC.boxName(G, 2).length <= 12, 'el nombre se recorta a 12 caracteres');
PC.setBoxName(G, 2, 'Voladores');
const a = mon(), b = mon('zubat');
G.boxes[2].push(a); G.boxes[5].push(b);
PC.setBoxName(G, 5, 'Cueva');
let pos = PC.moveBox(G, 2, 0);
ok(pos === 0 && G.boxes[0][0] === a && PC.boxName(G, 0) === 'Voladores', 'mover caja al principio: el contenido y el nombre viajan juntos');
ok(PC.boxName(G, 1) === 'Caja 2' && PC.boxName(G, 2) === 'Caja 3' && PC.boxName(G, 5) === 'Cueva', 'las cajas sin nombre toman el número de su nueva posición');
pos = PC.moveBox(G, 0, 1);
ok(pos === 1 && G.boxes[1][0] === a && PC.boxName(G, 1) === 'Voladores', 'mover una posición después');
pos = PC.moveBox(G, 1, 99);
ok(pos === 7 && G.boxes[7][0] === a && PC.boxName(G, 7) === 'Voladores' && G.boxes[4][0] === b && PC.boxName(G, 4) === 'Cueva', 'mover al final recorre las demás (con sus nombres)');
ok(PC.moveBox(G, 3, 3) === 3 && PC.moveBox(G, -1, 2) === -1, 'movimientos nulos o inválidos no cambian nada');
ok(PC.swapBoxes(G, 7, 4) && G.boxes[4][0] === a && PC.boxName(G, 4) === 'Voladores' && G.boxes[7][0] === b && PC.boxName(G, 7) === 'Cueva', 'intercambiar dos cajas intercambia también los nombres');
ok(G.boxes.length === 8 && G.boxNames.length === 8 && G.boxes.reduce((n, x) => n + x.length, 0) === 2, 'siguen siendo 8 cajas y no se pierde nadie');
PC.setBoxName(G, 4, '');
ok(PC.boxName(G, 4) === 'Caja 5' && !PC.hasBoxName(G, 4), 'nombre vacío: vuelve a «Caja N»');
// Los nombres sobreviven a guardar y cargar (JSON)
const copia = JSON.parse(JSON.stringify({ boxes: G.boxes, boxNames: G.boxNames, party: G.party }));
ok(PC.boxName(copia, 7) === 'Cueva' && PC.locate(copia, b.uid)?.box === 7, 'los nombres se guardan con la partida');

console.log(fails ? `\n${fails} fallos` : '\nTodo bien');
process.exit(fails ? 1 : 0);
