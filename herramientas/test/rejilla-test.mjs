// Pruebas: puzles de rejilla (app/js/puzle.js) y su paso de guion `puzzle`.
// Uso: node herramientas/test/rejilla-test.mjs
import { loadDataNode } from './node-env.mjs';
import { parsePuzzle, initState, step, solve, doorsOpen, tileAt, canSoftlock } from '../../app/js/puzle.js';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('✖', m); } else console.log('✔', m); };
const run = (P, dirs) => { let S = initState(P); const evs = []; for (const d of dirs) { const r = step(P, S, d); evs.push(r); S = r.state; } return { S, evs }; };

// ---------- Lectura ----------
{
	const P = parsePuzzle({ grid: ['#####', '#P.G#', '#####'] });
	ok(!P.errors.length && P.w === 5 && P.h === 3 && P.start[0] === 1, 'lee una rejilla sencilla');
	ok(parsePuzzle({ grid: ['#P#'] }).errors.some(e => e.includes('meta')), 'avisa si falta la meta');
	ok(parsePuzzle({ grid: ['#.G#'] }).errors.some(e => e.includes('inicio')), 'avisa si falta el inicio');
	ok(parsePuzzle({ grid: ['PXG'] }).errors.some(e => e.includes('desconocido')), 'avisa de caracteres desconocidos');
	ok(parsePuzzle({ grid: ['P' + '.'.repeat(9) + 'G'] }).errors.some(e => e.includes('máximo')), 'avisa si pasa de 9×9');
	ok(parsePuzzle({ grid: ['P.G'], rocks: [[5, 5]] }).errors.length === 1, 'avisa de rocas extra fuera de la rejilla');
	ok(parsePuzzle({ grid: [] }).errors.length > 0 && solve(parsePuzzle({ grid: [] })) === null, 'una rejilla vacía no se resuelve');
}

// ---------- Movimiento y paredes ----------
{
	const P = parsePuzzle({ grid: ['#####', '#P..#', '#.#G#', '#####'] });
	let r = step(P, initState(P), 'up');
	ok(!r.moved && r.state.moves === 0, 'no atraviesa paredes ni cuenta el paso');
	const { S } = run(P, ['right', 'right', 'down']);
	ok(S.solved && S.moves === 3, 'llega a la meta en 3 pasos');
	ok(step(P, S, 'up').moved === false, 'resuelto, ya no se mueve');
	ok(solve(P)?.length === 3, 'el BFS encuentra la ruta más corta');
}

// ---------- Rocas ----------
{
	const P = parsePuzzle({ grid: ['######', '#PR..#', '#####G'.replace('G', '#'), '######'] });
	const r = step(P, initState(P), 'right');
	ok(r.moved && r.events.includes('push') && r.state.rocks.has('3,1') && r.state.x === 2, 'empuja una roca una casilla');
	const r2 = step(P, step(P, r.state, 'right').state, 'right');
	ok(!r2.moved, 'no empuja una roca contra la pared');
	const P2 = parsePuzzle({ grid: ['######', '#PRR.#', '#...G#', '######'] });
	ok(!step(P2, initState(P2), 'right').moved, 'no empuja dos rocas a la vez');
}

// ---------- Hoyos ----------
{
	const P = parsePuzzle({ grid: ['#######', '#PRH.G#', '#######'] });
	const { S, evs } = run(P, ['right']);
	ok(evs[0].events.includes('fill') && !S.rocks.size && tileAt(P, S, 3, 1) === 'floor', 'una roca tapa el hoyo y desaparece');
	const { S: S2 } = run(P, ['right', 'right', 'right', 'right']);
	ok(S2.solved, 'después se puede pasar por encima del hoyo tapado');
	const P2 = parsePuzzle({ grid: ['#####', '#PHG#', '#####'] });
	ok(!step(P2, initState(P2), 'right').moved && solve(P2) === null, 'un hoyo sin roca no se pisa (sin solución)');
}

// ---------- Hielo ----------
{
	const P = parsePuzzle({ grid: ['#######', '#PIII.#', '#####G#', '#######'] });
	const r = step(P, initState(P), 'right');
	ok(r.moved && r.state.x === 5 && r.events.includes('slide') && r.state.moves === 1, 'resbala por el hielo hasta salir (un solo paso)');
	const P2 = parsePuzzle({ grid: ['#######', '#PIII##', '#.....#', '#####G#', '#######'] });
	ok(step(P2, initState(P2), 'right').state.x === 4, 'en el hielo se para al chocar');
	ok(!parsePuzzle({ grid: ['P.G'], rocks: [[1, 0]] }).errors.length, 'rocas extra sobre suelo, válidas');
	const P4 = parsePuzzle({ grid: ['########', '#PRIII.#', '#.....G#', '########'] });
	const r4 = step(P4, initState(P4), 'right');
	ok(r4.state.rocks.has('6,1') && r4.state.x === 2, 'una roca empujada al hielo resbala; el jugador avanza una casilla');
}

// ---------- Interruptores y puertas ----------
{
	const P = parsePuzzle({ grid: ['########', '#PRS.DG#', '#......#', '########'] });
	let S = initState(P);
	ok(!doorsOpen(P, S), 'la puerta empieza cerrada');
	const { S: S1, evs } = run(P, ['right']);
	ok(doorsOpen(P, S1) && evs[0].events.includes('door'), 'roca sobre el interruptor: la puerta se abre');
	ok(solve(P)?.length === 7, `se resuelve rodeando la roca (${solve(P)?.length} pasos)`);
	ok(solve(parsePuzzle({ grid: ['########', '#P.S.DG#', '#....###', '########'] })) === null, 'sin roca para el interruptor, la puerta no se abre');
	const P2 = parsePuzzle({ grid: ['#######', '#PS.R.#', '#####D#', '#####G#', '#######'] });
	ok(solve(P2) === null, 'sin forma de pulsar el interruptor, sin solución');
	const P3 = parsePuzzle({ grid: ['#####', '#P.D#', '#..G#', '#####'] });
	ok(doorsOpen(P3, initState(P3)), 'sin interruptores, las puertas están abiertas');
}

// ---------- Puzle de ejemplo de la documentación ----------
const EJEMPLO = {
	id: 'ejemplo', title: 'Sala de las rocas', theme: 'ruina',
	grid: [
		'########',
		'#P.....#',
		'#.R.RH.#',
		'#.##...#',
		'#S#IIII#',
		'#..I##D#',
		'#....#G#',
		'########',
	],
};
{
	const P = parsePuzzle(EJEMPLO);
	const sol = solve(P);
	ok(!P.errors.length && sol, `el ejemplo de la documentación tiene solución (${sol?.length} pasos)`);
	ok(typeof canSoftlock(P) === 'boolean', 'canSoftlock responde');
	const { S } = run(P, sol);
	ok(S.solved, 'la solución del BFS resuelve de verdad el ejemplo');
	ok(solve(parsePuzzle({ grid: EJEMPLO.grid.map(r => r.replace('D', '#')) })) === null, 'en el ejemplo, la puerta es imprescindible');
}

// ---------- Guion ----------
loadDataNode();
{
	const { C, registerBlock } = await import('../../app/js/content.js');
	const ST = await import('../../app/js/state.js');
	const { newGame, setG } = ST;
	const { runScript, UI } = await import('../../app/js/guion.js');
	const mod = await import('../../app/content/index.js');
	for (const b of mod.BLOCKS) registerBlock(b);
	setG(newGame({ name: 'Puzle' }));
	UI.say = async () => {}; UI.toast = () => {}; UI.refresh = () => {};
	let next = { result: 'quit', moves: 4 };
	UI.puzzle = async def => { ok(def.grid === EJEMPLO.grid, 'el guion pasa la definición a la interfaz'); return next; };
	C.scripts.__pz = [{ puzzle: EJEMPLO, onSolve: [{ set: { 'flag.pz_ok': true } }], onQuit: [{ set: { 'flag.pz_salio': true } }] }];
	await runScript('__pz');
	ok(ST.G.flags.pz_salio && !ST.G.flags.pz_ok && !ST.G.puzzles?.ejemplo, 'salir: corre onQuit y no guarda el récord');
	next = { result: 'solved', moves: 30 };
	await runScript('__pz');
	next = { result: 'solved', moves: 24 };
	await runScript('__pz');
	ok(ST.G.flags.pz_ok && ST.G.puzzles.ejemplo.n === 2 && ST.G.puzzles.ejemplo.best === 24, 'resolver: corre onSolve y guarda veces y mejor marca');
	delete UI.puzzle;
	ST.G.flags.pz_ok = false;
	await runScript('__pz');
	ok(ST.G.flags.pz_ok, 'sin interfaz de puzles (herramientas), cuenta como resuelto');
	delete C.scripts.__pz;
}

console.log(fails ? `\n${fails} fallos` : '\nTodo bien');
process.exit(fails ? 1 : 0);
