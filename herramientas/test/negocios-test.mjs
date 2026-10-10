// Pruebas del motor de Negocios (app/js/negocios.js) con los negocios publicados.
// Uso: node herramientas/test/negocios-test.mjs
import { loadDataNode } from './node-env.mjs';
import { C, registerBlock } from '../../app/js/content.js';
import { newGame, setG, G, evalCond } from '../../app/js/state.js';
import { createPokemon } from '../../app/js/pokemon.js';
loadDataNode();
const mod = await import('../../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);
const N = await import('../../app/js/negocios.js');

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('✖', m); } else console.log('✔', m); };
const fresh = () => { setG(newGame({ name: 'Prueba' })); G.player.money = 1e6; G.party = [createPokemon('pidgey', { level: 30 }), createPokemon('ampharos', { level: 50 })]; G.boxes[0] = [createPokemon('mareep', { level: 12 }), createPokemon('gastly', { level: 40 })]; };

ok(Object.keys(C.ventures).length >= 3, `hay ${Object.keys(C.ventures).length} negocios publicados`);
for (const id of Object.keys(C.ventures)) {
	const def = C.ventures[id];
	fresh();
	// Entrar
	const money0 = G.player.money;
	const j = N.joinVenture(id);
	ok(j.ok && N.owned(id), `${id}: se puede entrar`);
	ok(G.player.money === money0 - (def.buy?.cost || 0), `${id}: cobra la entrada`);
	ok(!N.joinVenture(id).ok, `${id}: no se entra dos veces`);
	const st = N.ventureState(id);
	const sum = () => Object.values(st.effort).reduce((a, b) => a + b, 0);
	ok(sum() === 100, `${id}: el esfuerzo suma 100`);
	// Producción y acumulación con tope de almacén
	const r0 = N.rates(id);
	ok(r0.money >= 0 && r0.pct > 0 && r0.pct <= 100, `${id}: produce ₽${Math.round(r0.money)}/día con el ${r0.pct} %`);
	st.last = Date.now() - 1 * N.DAY;
	let p = N.pending(id);
	ok(Math.abs(p.money - Math.floor(r0.money)) <= 1, `${id}: un día acumula un día (${p.money})`);
	st.last = Date.now() - 30 * N.DAY;
	p = N.pending(id);
	ok(p.full && p.money <= Math.ceil(r0.money * N.storeDays(id)) + 1, `${id}: el almacén se llena a los ${N.storeDays(id)} días y no pasa de ahí`);
	const m1 = G.player.money;
	const got = N.collect(id);
	ok(got && G.player.money === m1 + got.money && N.pending(id).money === 0, `${id}: recoger pasa el dinero a la cartera y vacía la caja`);
	// Esfuerzo
	const keys = Object.keys(N.linesOf(id));
	if (keys.length > 1) {
		N.shiftEffort(id, keys[0], 30);
		ok(sum() === 100 && Object.values(st.effort).every(v => v >= 0 && v <= 100 && v % 10 === 0), `${id}: mover el esfuerzo sigue sumando 100`);
		for (let i = 0; i < 12; i++) N.shiftEffort(id, keys[1], 10);
		ok(st.effort[keys[1]] === 100 && sum() === 100, `${id}: una línea puede llevarse todo`);
		for (let i = 0; i < 12; i++) N.shiftEffort(id, keys[1], -10);
		ok(st.effort[keys[1]] === 0 && sum() === 100, `${id}: y quedarse en cero`);
	}
	// Trabajadores: suben la producción, salen del PC y vuelven; el equipo no se queda vacío
	const before = N.rates(id).gross;
	const a = N.assignWorker(id, { where: 'box', box: 0, idx: 0 });
	ok(a.ok && G.boxes[0].length === 1 && st.workers.length === 1, `${id}: un Pokémon del PC se queda a trabajar`);
	ok(N.rates(id).gross > before || before === 0, `${id}: con un Pokémon trabajando se produce más`);
	ok(evalCond('works("mareep")') && evalCond('owns("mareep")') && !evalCond('inParty("mareep")'), `${id}: works() y owns() lo ven, inParty() no`);
	G.party.length = 1;
	ok(!N.assignWorker(id, { where: 'party', idx: 0 }).ok, `${id}: no puedes mandar a tu último Pokémon`);
	const back = N.recallWorker(id, 0);
	ok(back && st.workers.length === 0 && G.party.length === 2, `${id}: vuelve al equipo si hay sitio`);
	// Mejoras: todas se pueden comprar en algún orden (con las condiciones abiertas) y ninguna rompe las cuentas
	let bought = 0, guard = 0;
	G.flags = new Proxy({}, { get: (t, k) => k in t ? t[k] : true, has: () => true }); // todas las condiciones de historia abiertas
	while (guard++ < 40) {
		const u = N.upgradesOf(id).find(x => !x.bought && x.available);
		if (!u) break;
		const res = N.buyUpgrade(id, u.id);
		if (!res.ok) { ok(false, `${id}: no se pudo comprar ${u.id}: ${res.msg}`); break; }
		bought++;
	}
	const left = N.upgradesOf(id).filter(x => !x.bought);
	ok(bought > 0, `${id}: ${bought} mejoras compradas; sin comprar: ${left.map(x => x.id).join(', ') || 'ninguna'}`);
	const r1 = N.rates(id);
	ok(Number.isFinite(r1.money) && r1.money > r0.money, `${id}: con mejoras da más (₽${Math.round(r0.money)} → ₽${Math.round(r1.money)}/día, parte ${r1.pct} %)`);
	ok(r1.pct <= 100 && sum() === 100, `${id}: la parte no pasa de 100 y el esfuerzo sigue sumando 100`);
	// Imprevistos: todos se pueden resolver con su opción gratis
	for (const ev of def.events || []) {
		st.pending = ev.id;
		const free = N.eventOptions(ev).find(o => !o.cost);
		ok(!!free && N.resolveEvent(id, ev, free).ok && !st.pending, `${id}: imprevisto «${ev.id}» se resuelve gratis`);
	}
	// Un imprevisto como mucho por día
	st.pending = null; st.lastEvent = Date.now();
	ok(N.rollEvent(id, () => 0) === null, `${id}: no sale otro imprevisto el mismo día`);
	st.lastEvent = Date.now() - 2 * N.DAY;
	ok(!(def.events || []).length || N.rollEvent(id, () => 0) !== null, `${id}: al día siguiente sí`);
}
console.log(fails ? `\n${fails} fallos` : '\nTodo bien');
process.exit(fails ? 1 : 0);
