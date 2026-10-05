// Prueba del estilo «Cambio»: al caer un Pokémon rival, el jugador puede cambiar gratis o no.
// Uso: node herramientas/test/shift-test.mjs  (sale con código 1 si falla)
import { loadDataNode } from './node-env.mjs';
import { newGame, G } from '../../app/js/state.js';
import { createPokemon } from '../../app/js/pokemon.js';
import { BattleCtl, buildTrainerTeam } from '../../app/js/battle.js';
loadDataNode();
let fails = 0;
const check = (ok, msg) => { console.log((ok ? '  ✔ ' : '  ✘ ') + msg); if (!ok) fails++; };
function setup() {
	newGame({ name: 'Mario' });
	G.party.push(createPokemon('lucario', { level: 50, moves: ['aurasphere', 'flashcannon', 'extremespeed', 'swordsdance'] }));
	G.party.push(createPokemon('braixen', { level: 40 }));
	const t = { id: 'test', name: 'Prueba', cls: 'Entrenador', ai: 2, team: [{ sp: 'rattata', lv: 5, ability: 'runaway' }, { sp: 'zigzagoon', lv: 5, ability: 'pickup' }, { sp: 'bidoof', lv: 5, ability: 'simple' }] };
	return new BattleCtl({ kind: 'trainer', foes: buildTrainerTeam(t, createPokemon), trainer: t, terrain: 'gym', shift: true, seed: 'sodium,00000000000000000000000000000001' });
}
const atk = ctl => ({ type: 'move', i: ctl.options().moves.findIndex(m => m.id === 'extremespeed') });
for (const mode of ['rechaza', 'acepta']) {
	console.log('Modo:', mode);
	const ctl = setup();
	ctl.start();
	let r = ctl.turn(atk(ctl));
	check(!!r.shiftOffer, 'tras debilitar al primero, ofrece cambiar (' + (r.shiftOffer?.foe || '—') + ')');
	if (mode === 'rechaza') {
		r = ctl.turn({ type: 'noshift' });
		check(!r.error && !r.shiftOffer, 'rechazar no da error');
		check(ctl.active('p1').species.id === 'lucario', 'sigue Lucario en el campo');
		check(!ctl.active('p2').fainted, 'el rival sacó a su siguiente Pokémon');
		check(ctl.options().moves.length > 0 && !ctl.options().forceSwitch, 'el siguiente turno es normal');
	} else {
		const o = ctl.options();
		check(o.forceSwitch && o.shift, 'el menú de cambio está abierto con opción de no cambiar');
		r = ctl.turn({ type: 'switch', idx: o.switches.findIndex(s => s.sp === 'braixen') });
		check(!r.error, 'cambiar no da error ' + (r.error || ''));
		check(ctl.active('p1').species.id === 'braixen', 'sale Braixen');
		check(!ctl.active('p2').fainted && ctl.active('p2').hp === ctl.active('p2').maxhp, 'el rival sacó a su siguiente Pokémon sin recibir daño');
		check(ctl.options().moves.length > 0, 'el siguiente turno es normal');
	}
	// terminar el combate
	for (let i = 0; i < 20 && !r.ended; i++) {
		if (r.shiftOffer) { r = ctl.turn({ type: 'noshift' }); continue; }
		const o = ctl.options();
		r = ctl.turn(o.forceSwitch ? { type: 'switch', idx: o.switches.findIndex(s => !s.fainted && !s.active) } : { type: 'move', i: 0 });
		if (r.error) { check(false, 'error: ' + r.error); break; }
	}
	check(r.ended && r.result === 'win', 'el combate termina con victoria');
}
// Sin la opción, no ofrece nada
{
	const ctl = setup(); ctl.cfg.shift = false; ctl.start();
	const r = ctl.turn(atk(ctl));
	check(!r.shiftOffer && ctl.active('p2') && !ctl.active('p2').fainted, 'con estilo Fijo no pregunta');
}
console.log(fails ? `FALLAN ${fails}` : 'Todo bien');
process.exit(fails ? 1 : 0);
