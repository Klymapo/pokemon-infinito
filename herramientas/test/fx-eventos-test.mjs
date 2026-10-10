// Invariantes del flujo de eventos de combate que necesitan las animaciones (app/js/ui/fx.js y battle-ui.js):
//  · todo «hp» marcado byMove va después de su «move», es del bando contrario y figura en sus hitEvs;
//  · los datos extra del «move» (golpes, eficacia, crítico, fallo, inmunidad) cuadran con lo que pasó;
//  · la experiencia («exp», «levelup») llega después del «faint» del rival, nunca antes.
import { loadDataNode } from './node-env.mjs';
import { newGame, G, addItem } from '../../app/js/state.js';
import { createPokemon } from '../../app/js/pokemon.js';
import { BattleCtl, buildTrainerTeam } from '../../app/js/battle.js';
loadDataNode();

let fails = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { fails++; console.log('  ✖ ' + msg); } };
const stats = { moves: 0, hits: 0, multi: 0, crit: 0, se: 0, nve: 0, miss: 0, immune: 0, faint: 0, exp: 0, levelup: 0, status: 0, boost: 0, weather: 0 };

function checkEvents(evs, tag) {
	let mv = null, foeFainted = false, hitsSeen = 0;
	const closeMove = () => {
		if (!mv) return;
		ok(mv.hits === mv.hitEvs.length, `${tag}: ${mv.move} dice ${mv.hits} golpes y tiene ${mv.hitEvs.length} eventos`);
		ok(hitsSeen === mv.hits, `${tag}: ${mv.move} anunció ${mv.hits} golpes y se vieron ${hitsSeen}`);
		if (mv.miss || mv.immune) ok(mv.hits === 0, `${tag}: ${mv.move} falló o no afecta, pero quita PS`);
		if (mv.hits > 1) stats.multi++;
		if (mv.crit) stats.crit++;
		if (mv.eff > 1) stats.se++; else if (mv.eff > 0 && mv.eff < 1) stats.nve++;
		if (mv.miss) stats.miss++;
		if (mv.immune) stats.immune++;
	};
	let crit = false, eff = null, miss = false;
	for (let i = 0; i < evs.length; i++) {
		const e = evs[i];
		switch (e.t) {
		case 'move':
			closeMove();
			mv = e; hitsSeen = 0; crit = false; eff = null; miss = false; stats.moves++;
			ok(e.side === 'p1' || e.side === 'p2', `${tag}: move sin bando`);
			ok(Array.isArray(e.hitEvs) && typeof e.hits === 'number', `${tag}: move sin datos de golpes`);
			ok(['Physical', 'Special', 'Status'].includes(e.cat), `${tag}: ${e.move} sin categoría (${e.cat})`);
			ok(evs[i + 1]?.t === 'text', `${tag}: tras el move ${e.move} no viene su texto`);
			break;
		case 'hp':
			if (e.byMove) {
				stats.hits++;
				ok(!!mv, `${tag}: hp byMove sin move anterior`);
				if (mv) {
					ok(e.side !== mv.side, `${tag}: hp byMove en el mismo bando que ataca (${mv.move})`);
					ok(mv.hitEvs.includes(e), `${tag}: hp byMove que no está en los hitEvs de ${mv.move}`);
					ok(mv.hitEvs.indexOf(e) === hitsSeen, `${tag}: golpes de ${mv.move} fuera de orden`);
					ok(mv.cat !== 'Status', `${tag}: ${mv.move} es de estado y hace daño directo`);
					hitsSeen++;
				}
				ok(!e.from, `${tag}: hp byMove con origen ${e.from}`);
			}
			break;
		case 'crit': crit = true; ok(mv?.crit === true, `${tag}: crítico que el move no recoge`); break;
		case 'eff': eff = e.n; ok(mv?.eff === e.n, `${tag}: eficacia ${e.n} que el move no recoge (${mv?.eff})`); break;
		case 'faint':
			stats.faint++;
			if (e.side === 'p2') foeFainted = true;
			break;
		case 'exp': case 'levelup':
			stats[e.t]++;
			ok(foeFainted, `${tag}: ${e.t} antes de que caiga el rival`);
			if (e.t === 'exp') ok(typeof e.prog === 'number' && e.prog >= 0 && e.prog <= 1, `${tag}: exp sin prog válido`);
			break;
		case 'switch': if (e.side === 'p2') foeFainted = false; mv && closeMove(); mv = null; break;
		case 'status': stats.status++; break;
		case 'boost': stats.boost++; ok(e.n !== 0 && !!e.stat, `${tag}: boost vacío`); break;
		case 'weather': stats.weather++; break;
		}
	}
	closeMove();
	// el exp nunca va antes del faint que lo causa dentro del mismo lote
	const iExp = evs.findIndex(e => e.t === 'exp'), iFaint = evs.findIndex(e => e.t === 'faint' && e.side === 'p2');
	if (iExp >= 0) ok(iFaint >= 0 && iFaint < iExp, `${tag}: exp (${iExp}) antes del faint del rival (${iFaint})`);
}

function play(name, party, cfgOf, pick, turns = 60) {
	newGame({ name: 'Mario' });
	for (const p of party) G.party.push(createPokemon(p.sp, p));
	addItem('potion', 5);
	const ctl = new BattleCtl(cfgOf());
	checkEvents(ctl.start(), name + ' inicio');
	let ended = false;
	for (let t = 0; t < turns && !ended; t++) {
		const o = ctl.options();
		let a;
		if (o.forceSwitch) { const idx = o.switches.findIndex(s => !s.fainted && !s.active); if (idx < 0) break; a = { type: 'switch', idx }; }
		else { const us = o.moves.filter(m => !m.disabled && m.pp > 0); a = us.length ? { type: 'move', i: pick(us, t).i } : { type: 'move', i: 0 }; }
		const r = ctl.turn(a);
		if (r.error) { ok(false, `${name}: error del motor: ${r.error}`); break; }
		checkEvents(r.events || [], `${name} t${t}`);
		ended = !!r.ended;
	}
	ctl.finish();
}

const rot = (us, t) => us[t % us.length];
// 1. Multigolpe, inmunidad (Tierra contra Volador) y eficacia
play('salvaje', [{ sp: 'lucario', level: 30, moves: ['bonerush', 'aurasphere', 'bulletpunch', 'swordsdance'] }],
	() => ({ kind: 'wild', foes: [createPokemon('pidgeotto', { level: 24, moves: ['gust', 'sandattack', 'quickattack', 'twister'] })], terrain: 'grass' }), rot);
// 2. Entrenador con varios Pokémon: clima, estados, cambios, experiencia y subidas de nivel
for (let k = 0; k < 4; k++) {
	const tr = { id: 't' + k, name: 'Prueba', cls: 'Montañero', ai: k % 3, team: [
		{ sp: 'geodude', lv: 14, moves: ['rockthrow', 'defensecurl', 'sandstorm', 'tackle'] },
		{ sp: 'zubat', lv: 15, moves: ['toxic', 'confuseray', 'poisonfang', 'wingattack'] },
		{ sp: 'magikarp', lv: 40, moves: ['splash', 'tackle'] },
		{ sp: 'gastly', lv: 16, moves: ['lick', 'hypnosis', 'curse', 'nightshade'] }] };
	play('entrenador' + k, [
		{ sp: 'riolu', level: 16, moves: ['forcepalm', 'quickattack', 'metalclaw', 'furyswipes'] },
		{ sp: 'mareep', level: 16, moves: ['thundershock', 'thunderwave', 'tackle', 'growl'] },
		{ sp: 'cyndaquil', level: 16, moves: ['ember', 'doublekick', 'smokescreen', 'swift'] }],
	() => ({ kind: 'trainer', foes: buildTrainerTeam(tr, createPokemon), trainer: tr, terrain: 'cave' }), (us, t) => us[(t * 7 + k) % us.length], 120);
}
// 3. Golpes fijos de 2 y de 2–5, y movimientos de dos turnos
play('multigolpe', [{ sp: 'cinccino', level: 40, moves: ['tailslap', 'bulletseed', 'doublehit', 'dig'] }],
	() => ({ kind: 'wild', foes: [createPokemon('snorlax', { level: 38, moves: ['bodyslam', 'rest', 'yawn', 'protect'] })], terrain: 'grass' }), rot, 40);

console.log(`  movimientos ${stats.moves} · golpes ${stats.hits} · multigolpe ${stats.multi} · críticos ${stats.crit} · eficaces ${stats.se} · poco eficaces ${stats.nve} · fallos ${stats.miss} · inmunes ${stats.immune} · debilitados ${stats.faint} · exp ${stats.exp} · niveles ${stats.levelup} · estados ${stats.status} · stats ${stats.boost} · clima ${stats.weather}`);
ok(stats.moves > 60 && stats.multi > 0 && stats.immune > 0 && stats.faint > 0 && stats.exp > 0 && stats.se > 0, 'la muestra no cubre lo mínimo (multigolpe, inmunidad, debilitados, experiencia, eficacia)');
if (fails) { console.log(`✖ ${fails} de ${checks} comprobaciones fallan`); process.exit(1); }
console.log(`  ✔ ${checks} comprobaciones del flujo de eventos\nTodo bien`);
