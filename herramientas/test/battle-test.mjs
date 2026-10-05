import { loadDataNode } from './node-env.mjs';
import { newGame, G, addItem } from '../../app/js/state.js';
import { createPokemon } from '../../app/js/pokemon.js';
import { BattleCtl, buildTrainerTeam } from '../../app/js/battle.js';
loadDataNode();
newGame({ name: 'Mario' });
G.party.push(createPokemon('riolu', { level: 12, moves: ['quickattack', 'metalclaw', 'counter', 'forcepalm'] }));
G.party.push(createPokemon('fennekin', { level: 11 }));
addItem('potion', 3); addItem('pokeball', 5);
const print = r => { for (const e of r.events) if (e.t === 'text') console.log('  ' + e.s); else if (e.t !== 'hp') console.log('   [' + e.t + ' ' + (e.side || '') + (e.info ? ' ' + e.info.name + ' ' + e.info.hp + '/' + e.info.maxhp : '') + ']'); };
// Combate contra entrenador
const brock = { id: 'brock', name: 'Brock', cls: 'Líder', ai: 4, items: [{ id: 'superpotion', n: 1 }], team: [
	{ sp: 'geodude', lv: 12, moves: ['rocktomb', 'defensecurl', 'rollout', 'rockpolish'] },
	{ sp: 'onix', lv: 14, moves: ['rocktomb', 'bind', 'sandstorm', 'smackdown'], ability: 'sturdy' }] };
const { createPokemon: cp } = await import('../../app/js/pokemon.js');
const ctl = new BattleCtl({ kind: 'trainer', foes: buildTrainerTeam(brock, cp), trainer: brock, terrain: 'gym' });
print({ events: ctl.start() });
let r;
for (let i = 0; i < 30; i++) {
	const o = ctl.options();
	let a;
	if (o.forceSwitch) a = { type: 'switch', idx: o.switches.findIndex(s => !s.fainted && !s.active) };
	else if (i === 2) a = { type: 'item', item: 'potion', uid: G.party[0].uid };
	else a = { type: 'move', i: Math.max(0, o.moves.findIndex(m => m.id === 'forcepalm')) };
	console.log('> ' + JSON.stringify(a));
	r = ctl.turn(a);
	print(r);
	if (r.error) console.log('ERROR', r.error);
	if (r.ended) break;
}
const sum = ctl.finish();
console.log('RESULT', sum.result, 'money', sum.money, 'party', G.party.map(p => p.sp + ' L' + p.lv + ' ' + p.hp + 'hp exp' + p.exp));
// Salvaje + captura
for (const p of G.party) { p.hp = 40; p.status=''; }
const wild = createPokemon('fletchling', { level: 6 });
const w = new BattleCtl({ kind: 'wild', foes: [wild], terrain: 'grass' });
print({ events: w.start() });
for (let i = 0; i < 10; i++) {
	const rr = w.turn(i < 1 ? { type: 'move', i: 0 } : { type: 'ball', ball: 'pokeball' });
	print(rr); if (rr.error) console.log('ERR', rr.error);
	if (rr.ended) { console.log('END', rr.result); break; }
}
console.log(w.finish().result, w.caught && w.caught.sp);
