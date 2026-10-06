// Si el rival cae antes de que tu Pokémon actúe (Explosión, retroceso…), tu Pokémon no debe «atacar al aire».
// Uso: node herramientas/test/sin-objetivo-test.mjs  (sale con código 1 si falla)
import { loadDataNode } from './node-env.mjs';
import { newGame, G } from '../../app/js/state.js';
import { createPokemon } from '../../app/js/pokemon.js';
import { BattleCtl, buildTrainerTeam } from '../../app/js/battle.js';
loadDataNode();
let fails = 0;
const check = (ok, msg) => { console.log((ok ? '  ✔ ' : '  ✘ ') + msg); if (!ok) fails++; };
for (const [shift, mv] of [[true, 'explosion'], [false, 'explosion'], [true, 'doubleedge'], [false, 'doubleedge']]) {
	newGame({ name: 'Mario' });
	G.party.push(createPokemon('snorlax', { level: 30, moves: ['tackle', 'growl'] }));
	G.party.push(createPokemon('braixen', { level: 30 }));
	const t = { id: 'test', name: 'Prueba', cls: 'Entrenador', ai: 1, team: [{ sp: 'electrode', lv: 30, moves: [mv] }, { sp: 'zigzagoon', lv: 20, moves: ['tackle'] }] };
	const foes = buildTrainerTeam(t, createPokemon);
	foes[0].hp = 3;
	const ctl = new BattleCtl({ kind: 'trainer', foes, trainer: t, terrain: 'gym', shift, seed: 'sodium,00000000000000000000000000000002' });
	ctl.start();
	let r = ctl.turn({ type: 'move', i: 0 });
	const evs = r.events || [];
	const fi = evs.findIndex(e => e.t === 'faint' && e.side === 'p2');
	check(fi >= 0, `${mv} (estilo ${shift ? 'Cambio' : 'Fijo'}): el rival cae solo`);
	check(!evs.slice(fi).some(e => e.t === 'move' && e.side === 'p1'), '…y tu Pokémon no ataca después');
	check(!evs.some(e => e.t === 'text' && /ha fallado/.test(e.s)), '…ni sale «¡Pero ha fallado!»');
	if (r.shiftOffer) r = ctl.turn({ type: 'noshift' });
	r = ctl.turn({ type: 'move', i: 0 });
	check((r.events || []).some(e => e.t === 'move' && e.side === 'p1'), '…y el turno siguiente ataca normal');
}
console.log(fails ? `FALLAN ${fails}` : 'Todo bien');
process.exit(fails ? 1 : 0);
