// Pruebas: minijuegos para conseguir objetos (app/js/minijuegos.js), su paso de guion `minigame` y la recolección con `game`.
// Uso: node herramientas/test/minijuegos-test.mjs
import { loadDataNode } from './node-env.mjs';
import * as M from '../../app/js/minijuegos.js';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('✖', m); } else console.log('✔', m); };
const LOOT = [{ id: 'stardust', w: 10, n: [1, 2] }, { id: 'firestone', w: 4 }, { id: 'nugget', w: 5 }, { id: 'redshard', w: 5 }, { id: 'heartscale', w: 4 }, { id: 'helixfossil', w: 2, rare: true }];
const WILD = [{ sp: 'magikarp', lv: [10, 12], w: 3 }];
const defOf = (type, level, extra = {}) => ({ type, level, id: 't_' + type + level, loot: LOOT, ...extra });
const within = (items, cargo) => { const all = M.sumCargo(cargo); return Object.keys(items).every(id => items[id] <= (all[id] || 0)); };

// ---------- Cada tipo y nivel: termina, es determinista y el botín sale de la carga ----------
for (const type of M.MINI_TYPES) {
	let ended = true, inCargo = true, same = true, quitOk = true, loseOk = true, scoreOk = true, mustOk = true;
	for (let level = 1; level <= 5; level++) for (let seed = 1; seed <= 25; seed++) {
		const def = defOf(type, level, { seed, guaranteed: ['waterstone'] });
		const P = M.prepare({ def });
		const r = M.autoPlay(P, { skill: 0.65 });
		if (!['win', 'lose'].includes(r.result)) ended = false;
		if (!(r.score >= 0 && r.score <= 1)) scoreOk = false;
		const items = M.award(P, r);
		if (!within(items, P.cargo) || (r.won || []).some(i => !P.cargo[i])) inCargo = false;
		if (r.result === 'win' && !items.waterstone) mustOk = false;
		if (r.result === 'lose' && Object.keys(items).length) loseOk = false;
		// misma semilla, misma partida
		const P2 = M.prepare({ def }), r2 = M.autoPlay(P2, { skill: 0.65 });
		if (JSON.stringify(P.cargo) !== JSON.stringify(P2.cargo) || JSON.stringify(r) !== JSON.stringify(r2)) same = false;
		// salir a medias: no se entrega nada ni rompe
		const S = M.create(P), q = M.finish(P, S, { quit: true });
		if (q.result !== 'quit' || Object.keys(M.award(P, q)).length) quitOk = false;
	}
	ok(ended, `${type}: el jugador automático siempre termina (niveles 1–5)`);
	ok(scoreOk, `${type}: la puntuación va de 0 a 1`);
	ok(inCargo, `${type}: lo entregado sale siempre de la carga`);
	ok(mustOk, `${type}: ganar entrega siempre el guaranteed`);
	ok(loseOk, `${type}: perder no entrega botín (la consolación va aparte)`);
	ok(quitOk, `${type}: salir no entrega nada y no rompe`);
	ok(same, `${type}: con la misma semilla sale la misma partida`);
}

// ---------- Dificultad: justa en todos los niveles ----------
{
	const rows = [];
	for (const type of M.MINI_TYPES) {
		const wr = [1, 2, 3, 4, 5].map(level => M.winRate(defOf(type, level, { guaranteed: ['waterstone'] }), { n: 200 }).win);
		const pro = [1, 2, 3, 4, 5].map(level => M.winRate(defOf(type, level, { guaranteed: ['waterstone'] }), { n: 200, skill: 0.95 }).win);
		rows.push(`${type} ${wr.map(v => Math.round(v * 100)).join('/')}`);
		ok(wr[0] >= 0.9 && wr[1] >= 0.85, `${type}: los niveles 1 y 2 los gana casi siempre un jugador normal (${Math.round(wr[0] * 100)} % y ${Math.round(wr[1] * 100)} %)`);
		ok(wr[2] >= 0.7, `${type}: el nivel 3 se gana al menos 7 de cada 10 veces (${Math.round(wr[2] * 100)} %)`);
		ok(wr[4] >= 0.55 && wr[4] <= 0.93, `${type}: el nivel 5 aprieta pero no es imposible (${Math.round(wr[4] * 100)} %)`);
		ok(wr[4] <= wr[0] + 0.001, `${type}: el nivel 5 no es más fácil que el 1`);
		ok(pro.every(v => v >= 0.8), `${type}: quien juega bien gana casi siempre en cualquier nivel (mín. ${Math.round(Math.min(...pro) * 100)} %)`);
		const torpe = M.winRate(defOf(type, 1), { n: 100, skill: 0.3 }).win;
		ok(torpe >= 0.6, `${type}: el nivel 1 perdona a quien juega mal (${Math.round(torpe * 100)} %)`);
	}
	console.log('  % de victorias del jugador normal, niveles 1–5 (con un guaranteed): ' + rows.join(' · '));
	// ayuda adaptativa: tras dos derrotas seguidas, la misma partida es más fácil
	const G = { minis: { duro: { n: 2, w: 0, best: 0, ls: 2 } } };
	const P0 = M.prepare({ def: { type: 'lock', level: 5, id: 'duro', loot: LOOT, seed: 3 } }), P1 = M.prepare({ def: { type: 'lock', level: 5, id: 'duro', loot: LOOT, seed: 3 }, G });
	ok(P0.ease === 0 && P1.ease === 1 && P1.d < P0.d, 'tras dos derrotas seguidas la siguiente partida baja la dificultad');
	ok(M.lockCreate(P1).seq.length <= M.lockCreate(P0).seq.length, 'la cerradura con ayuda no pide una secuencia más larga');
}

// ---------- Premios raros ----------
{
	for (const type of M.MINI_TYPES) {
		const rr = M.rareRate(defOf(type, 3), { n: 150 });
		ok(rr.had > 0 && rr.got / rr.had >= 0.25, `${type}: lo rare se consigue jugando con normalidad (${rr.got}/${rr.had})`);
	}
	const cargo = [{ id: 'a', n: 1 }, { id: 'b', n: 1 }, { id: 'r', n: 1, rare: true }];
	ok(!M.wonByScore(cargo, 0.5).includes(2) && M.wonByScore(cargo, 1).includes(2), 'por puntuación: lo rare solo con buena nota');
	ok(M.wonByScore(cargo, 0, { min: 1 }).length === 1, 'por puntuación: ganar nunca deja las manos vacías');
}

// ---------- Récords, consolación y cuentas ----------
{
	const G = {};
	const def = { type: 'lock', level: 1, id: 'cofre', loot: LOOT, guaranteed: ['waterstone'], seed: 5 };
	const P = M.prepare({ def, G });
	const win = { result: 'win', score: 0.8, won: [1] }, lose = { result: 'lose', score: 0.1, won: [] }, quit = { result: 'quit', score: 0, won: [] };
	ok(M.settle(G, P, quit).items && !G.minis, 'salir no deja rastro en los récords');
	const a = M.settle(G, P, lose, 1000);
	ok(a.consol && Object.keys(a.items).length === 1 && Object.values(a.items)[0] === 1 && !a.items.waterstone, 'perder da una consolación pequeña (una unidad, nunca el premio)');
	ok(G.minis.cofre.n === 1 && G.minis.cofre.w === 0 && G.minis.cofre.ls === 1, 'record: apunta la derrota y la racha');
	const b = M.settle(G, P, lose, 2000);
	ok(!b.consol && !Object.keys(b.items).length, 'la consolación no se repite el mismo día (perder aposta no es negocio)');
	ok(M.settle(G, P, lose, 2000 + M.CONSOL_HOURS * 3600e3).consol, 'pasadas las horas, la consolación vuelve');
	const c = M.settle(G, P, win);
	ok(c.items.waterstone === 1 && !c.consol && G.minis.cofre.w === 1 && G.minis.cofre.ls === 0 && G.minis.cofre.best === 0.8, 'record: victoria, racha a cero y mejor puntuación');
	M.settle(G, P, { ...win, score: 0.5 });
	ok(G.minis.cofre.best === 0.8 && G.minis.cofre.n === 5 && G.minis['#lock'].n === 5 && G.minis['#lock'].w === 2, 'record: el récord no baja y hay cuenta por tipo');
	ok(M.prepare({ def: { ...def, consolation: 'pearl' } }).consol.id === 'pearl' && M.prepare({ def: { ...def, consolation: false } }).consol === null, 'consolation: se puede fijar o quitar');
}

// ---------- Recolección: jugar frente a recoger rápido ----------
{
	const g = { name: 'Veta', picks: [1, 2], table: LOOT, game: { type: 'dig', level: 2 } };
	const gd = M.gatherGame('veta', g);
	ok(gd.type === 'dig' && gd.id === 'g:veta' && gd.title === 'Veta' && M.gatherGame('x', { table: LOOT }) === null && M.gatherGame('y', { game: 'fish' }).level === 2, 'gatherGame: admite cadena u objeto, y nada si no hay game');
	let baseOk = true, rareQuick = false, extraSeen = 0, rareSeen = 0, quitOk = true, never = true;
	for (let i = 0; i < 200; i++) {
		const rnd = M.rngFrom(i + 7);
		const quick = M.gatherCargo(g, { rnd, withExtra: false });
		if (quick.some(c => c.rare) || !quick.length) rareQuick = true;
		const cargo = M.gatherCargo(g, { rnd: M.rngFrom(i + 7), extraPicks: i % 2 });
		const base = M.sumCargo(cargo.filter(c => c.base));
		const P = M.prepare({ def: { ...gd, seed: i }, mode: 'gather', cargo });
		const r = M.autoPlay(P, { skill: 0.65 });
		const items = M.award(P, r);
		for (const id in base) if ((items[id] || 0) < base[id]) baseOk = false;
		if (!within(items, cargo)) never = false;
		const nb = Object.values(base).reduce((s, n) => s + n, 0), ni = Object.values(items).reduce((s, n) => s + n, 0);
		if (ni > nb) extraSeen++;
		if ((r.won || []).some(j => cargo[j].rare)) rareSeen++;
		const q = M.award(P, M.finish(P, M.create(P), { quit: true }));
		if (JSON.stringify(q) !== JSON.stringify(base)) quitOk = false;
	}
	ok(!rareQuick, 'recoger rápido nunca da lo rare (y siempre da algo)');
	ok(baseOk, 'jugando nunca se pierde lo que daría recoger rápido');
	ok(never, 'jugando no se entrega más de lo que había en juego');
	ok(extraSeen >= 150, `jugar da más que recoger rápido casi siempre (${extraSeen}/200)`);
	ok(rareSeen >= 5, `lo rare sale jugando (${rareSeen}/200)`);
	ok(quitOk, 'salir a medias deja exactamente lo de recoger rápido');
	ok(M.gatherCargo(g, { rnd: M.rngFrom(1), extraPicks: 1, withExtra: false }).length - M.gatherCargo(g, { rnd: M.rngFrom(1), withExtra: false }).length === 1, 'la montura añade una tanda a la base');
	// pesca con salvajes en un punto diario
	const gf = { name: 'Lago', table: LOOT, game: { type: 'fish', level: 2, wild: WILD, wildChance: 1 } };
	const Pf = M.prepare({ def: { ...M.gatherGame('lago', gf), seed: 2 }, mode: 'gather', cargo: M.gatherCargo(gf, { rnd: M.rngFrom(2) }) });
	const rf = M.autoPlay(Pf, { skill: 0.95 });
	ok(rf.result === 'win' && rf.wild?.sp === 'magikarp' && rf.wild.lv >= 10 && rf.wild.lv <= 12, 'pesca: puede picar un Pokémon salvaje del nivel pedido');
}

// ---------- Validación de definiciones ----------
{
	const ctx = { has: id => ['stardust', 'firestone', 'nugget', 'redshard', 'heartscale', 'helixfossil', 'waterstone'].includes(id), hasSp: id => id === 'magikarp' };
	ok(!M.checkDef(defOf('dig', 3), ctx).length, 'checkDef: una definición correcta no da errores');
	ok(M.checkDef({ type: 'nada', loot: LOOT }, ctx).length === 1, 'checkDef: tipo desconocido');
	ok(M.checkDef({ type: 'dig', loot: [{ id: 'noexiste' }] }, ctx).some(e => e.includes('inexistente')), 'checkDef: objeto inexistente');
	ok(M.checkDef({ type: 'dig', loot: LOOT, level: 9 }, ctx).some(e => e.includes('level')), 'checkDef: nivel fuera de rango');
	ok(M.checkDef({ type: 'dig', loot: LOOT, theme: 'luna' }, ctx).some(e => e.includes('tema')), 'checkDef: tema desconocido');
	ok(M.checkDef({ type: 'dig' }, ctx).some(e => e.includes('sin premios')), 'checkDef: sin botín');
	ok(M.checkDef({ type: 'dig', loot: LOOT, wild: WILD }, ctx).some(e => e.includes('pesca')), 'checkDef: wild solo en la pesca');
	ok(M.checkDef({ type: 'fish', wild: [{ sp: 'missingno', lv: 5 }] }, ctx).some(e => e.includes('especie')), 'checkDef: especie inexistente');
	ok(M.checkDef({ type: 'lock', loot: LOOT, consolation: 'noexiste' }, ctx).some(e => e.includes('consolation')), 'checkDef: consolación inexistente');
	ok(!M.checkGatherGame('v', { table: LOOT, game: 'dig' }, ctx).length && M.checkGatherGame('v', { table: LOOT, game: { type: 'dig', nivel: 3 } }, ctx).some(e => e.includes('clave')), 'checkGatherGame: valida el game de un punto de recolección');
	ok(!M.checkGatherGame('v', { table: LOOT }, ctx).length, 'checkGatherGame: un punto sin game no da errores');
}

// ---------- Paso de guion `minigame` ----------
loadDataNode();
{
	const { C } = await import('../../app/js/content.js');
	const ST = await import('../../app/js/state.js');
	const { runScript, UI } = await import('../../app/js/guion.js');
	ST.setG(ST.newGame({ name: 'Mini' }));
	const said = [];
	UI.say = async (n, t) => { said.push(t); }; UI.toast = () => {}; UI.refresh = () => {};
	const DEF = { type: 'lock', id: 'prueba_cofre', title: 'Cofre de {jugador}', level: 2, loot: [{ id: 'stardust' }], guaranteed: ['waterstone'], seed: 4 };
	C.scripts.__mj = [{ minigame: DEF, onWin: [{ set: { 'flag.mj_win': true } }], onLose: [{ set: { 'flag.mj_lose': true } }], onQuit: [{ set: { 'flag.mj_quit': true } }] }];
	let mode = 'quit', seenTitle = '';
	UI.minigame = async P => { seenTitle = P.title; return mode === 'quit' ? { result: 'quit', score: 0, won: [] } : mode === 'lose' ? { result: 'lose', score: 0.1, won: [] } : M.autoPlay(P, { skill: 1 }); };
	const G = () => ST.G;
	await runScript('__mj');
	ok(seenTitle === 'Cofre de Mini', 'el guion prepara la partida y sustituye los marcadores del título');
	ok(G().flags.mj_quit && !G().flags.mj_win && !G().flags.mj_lose && !ST.count('waterstone') && !ST.count('stardust') && !G().minis?.prueba_cofre, 'salir: corre onQuit, no da nada y no cuenta');
	mode = 'lose';
	await runScript('__mj');
	ok(G().flags.mj_lose && !G().flags.mj_win && ST.count('stardust') === 1 && !ST.count('waterstone') && G().minis.prueba_cofre.ls === 1, 'perder: corre onLose, da la consolación y se puede reintentar');
	await runScript('__mj');
	ok(ST.count('stardust') === 1, 'perder otra vez seguido no vuelve a dar consolación');
	mode = 'win';
	await runScript('__mj');
	ok(G().flags.mj_win && ST.count('waterstone') === 1 && G().minis.prueba_cofre.w === 1 && G().minis.prueba_cofre.ls === 0, 'ganar: corre onWin, entrega el guaranteed y guarda el récord');
	ok(said.some(t => /Piedra Agua/.test(t)), 'sin resumen gráfico, el botín se dice por texto');
	let lootArg = null;
	UI.minigameLoot = async o => { lootArg = o; };
	await runScript('__mj');
	ok(lootArg && lootArg.items.some(it => it.id === 'waterstone' && it.n === 1) && ST.count('waterstone') === 2, 'con interfaz, el botín va al resumen (showLoot)');
	delete UI.minigame; delete UI.minigameLoot;
	G().flags.mj_win = false;
	await runScript('__mj');
	ok(G().flags.mj_win && ST.count('waterstone') === 3, 'sin interfaz de minijuegos (herramientas), cuenta como ganado');
	// pesca con salvaje: tras ganar, combate
	let fought = null;
	UI.battle = async cfg => { fought = cfg; return { result: 'run' }; };
	UI.minigame = async P => M.autoPlay(P, { skill: 1 });
	C.scripts.__mjf = [{ minigame: { type: 'fish', id: 'prueba_pesca', level: 1, wild: WILD, seed: 1 }, onWin: [{ set: { 'flag.mj_pez': true } }] }];
	await runScript('__mjf');
	ok(fought?.wild?.sp === 'magikarp' && fought.wild.unique === false && G().flags.mj_pez, 'pesca en guion: si pica un Pokémon, hay combate y luego sigue onWin');
	delete C.scripts.__mj; delete C.scripts.__mjf; delete UI.minigame; delete UI.battle;
}

console.log(fails ? `\n${fails} fallos` : '\nTodo bien');
process.exit(fails ? 1 : 0);
