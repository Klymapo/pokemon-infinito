// Bot que juega el contenido sin interfaz: explora, habla, combate, captura y entrena.
// Sirve para auditar: detecta errores, atascos y problemas de balance.
// Uso: node herramientas/recorrido.mjs [--semilla N] [--max 20000] [--hasta flag] [--verbose] [--elecciones primera|azar] [--fecha MM-DD] [--hora HH]
import { loadDataNode } from './test/node-env.mjs';
import { D, toID } from '../app/js/data.js';
import { C, registerBlock, topLoc } from '../app/js/content.js';
import { G, newGame, evalCond, setExtraScope, addItem, removeItem, count, markCaught } from '../app/js/state.js';
import { timeScope } from '../app/js/time.js';
import { runScript, runFirst, UI } from '../app/js/guion.js';
import { createPokemon, healFull, maxHp, checkEvolution, evolve, movesLearnedAt, canLearn, displayName } from '../app/js/pokemon.js';
import { BattleCtl, buildTrainerTeam } from '../app/js/battle.js';
import * as AI from '../app/js/ai.js';
import {
	L, isRoute, spotsOf, tramoItems, tramoTerrain, rollWild, canMove, markTramo, walkFriendship, canEnter, healParty, whiteout,
	trainingOpen, routeProg, activeEvents, encounterRate,
} from '../app/js/world.js';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
let seed = +arg('--semilla', 1);
const MAX = +arg('--max', 25000);
const UNTIL = arg('--hasta', null);
const VERBOSE = process.argv.includes('--verbose');
const CHOICES = arg('--elecciones', 'azar');
// Fecha y hora simuladas (para que el resultado no dependa de cuándo se ejecuta).
// --fecha MM-DD (por defecto, hoy) · --hora HH (por defecto 13; usa 2 para probar la noche)
const FECHA = arg('--fecha', null);
const HORA = +arg('--hora', 13);
{
	const RealDate = Date;
	const [mm, dd] = FECHA ? FECHA.split('-').map(Number) : [new RealDate().getMonth() + 1, new RealDate().getDate()];
	globalThis.Date = class extends RealDate {
		constructor(...a) { if (a.length) super(...a); else { super(); this.setMonth(mm - 1, dd); this.setHours(HORA); } }
		static now() { return RealDate.now(); }
	};
}
// PRNG determinista para el bot (Math.random se sustituye)
let s0 = seed * 2654435761 % 4294967296;
Math.random = () => { s0 = (s0 * 1664525 + 1013904223) % 4294967296; return s0 / 4294967296; };

loadDataNode();
const mod = await import('../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);
setExtraScope(() => ({ ...timeScope(), night: false, day: true, time: 'dia' }));

const report = { errors: [], stuck: [], battles: { won: 0, lost: 0, wild: 0, trainer: 0 }, losses: [], gyms: [], log: [], scripts: new Set(), texts: 0, quests: {} };
const log = (...a) => { const s = a.join(' '); report.log.push(s); if (VERBOSE) console.log(s); };
let step = 0;
let curScript = '';

// ---------------- UI simulada ----------------
Object.assign(UI, {
	say: async (n, t) => { report.texts++; if (/undefined|\{[a-z]+\}|\[object/.test(t)) report.errors.push(`texto con marcador roto (${curScript}): ${t.slice(0, 120)}`); },
	choose: async (p, opts) => CHOICES === 'primera' ? 0 : Math.floor(Math.random() * opts.length),
	prompt: async () => 'Bot',
	toast: () => {},
	refresh: () => {},
	goto: async id => { await enter(id, {}); },
	battle: cfg => battle(cfg),
	receivePokemon: async (p) => receive(p),
	learnMove: async (p, m) => learn(p, m),
	nickname: async () => {},
	shop: async () => {},
	center: async () => { healParty(); },
	pc: async () => {},
	evolveCheck: async () => { for (const p of G.party) tryEvolve(p); },
	forceEvolve: async (p, to) => { evolve(p, to); markCaught(to); for (const m of movesLearnedAt(to, p.lv, true)) learn(p, m); },
});
const origConsoleError = console.error;
console.error = (...a) => { report.errors.push('console.error: ' + a.map(x => x?.message || String(x)).join(' ').slice(0, 300)); };
console.warn = (...a) => { report.errors.push('console.warn: ' + a.map(x => String(x)).join(' ').slice(0, 300)); };

function receive(p) {
	markCaught(p.sp);
	if (G.party.length < 6) G.party.push(p);
	else G.boxes[0].push(p);
}
function learn(p, moveId) {
	const md = D.moves[moveId];
	if (!md || p.moves.some(m => m.id === moveId)) return;
	if (p.moves.length < 4) { p.moves.push({ id: moveId, pp: md.pp, ppUps: 0 }); return; }
	// sustituir el de menor potencia si el nuevo es mejor
	let worst = 0, wbp = 999;
	p.moves.forEach((m, i) => { const bp = D.moves[m.id]?.bp || 0; if (bp < wbp) { wbp = bp; worst = i; } });
	if ((md.bp || 0) > wbp || (md.cat === 'Status' && wbp === 0)) p.moves[worst] = { id: moveId, pp: md.pp, ppUps: 0 };
}
function tryEvolve(p) {
	const to = checkEvolution(p, { trigger: 'level', time: 'day', region: topLoc(G.loc)?.region });
	if (to) { evolve(p, to); markCaught(to); for (const m of movesLearnedAt(to, p.lv, true)) learn(p, m); log(`  evoluciona → ${to}`); }
}

// ---------------- Combate automático ----------------
function battle(cfg) {
	let foes, trainer = null, kind;
	if (cfg.trainer) { trainer = C.trainers[cfg.trainer]; foes = buildTrainerTeam(trainer, createPokemon); kind = 'trainer'; }
	else { const w = cfg.wild; foes = [w.mon || createPokemon(w.sp, { level: w.lv, tera: w.tera, moves: w.moves })]; kind = 'wild'; }
	if (!G.party.some(p => p.hp > 0)) return { result: 'lose' };
	const hex = () => Math.floor(Math.random() * 4294967296).toString(16).padStart(8, '0');
	const ctl = new BattleCtl({ seed: 'sodium,' + hex() + hex() + hex() + hex(), kind, foes, trainer, terrain: 'grass', loc: G.loc, wildGimmick: cfg.wild?.gimmick, noCatch: cfg.wild?.noCatch });
	ctl.start();
	let r = {}, turns = 0;
	const wantCatch = kind === 'wild' && !cfg.wild?.noCatch && !G.dex.caught[D.species[foes[0].sp].num];
	while (turns++ < 300) {
		const o = ctl.options();
		let action;
		if (o.forceSwitch) {
			const bs = AI.bestSwitch(ctl.battle, ctl.battle.p1, ctl.battle.p2.active[0]);
			action = { type: 'switch', idx: bs ? bs.idx : o.switches.findIndex(s => !s.fainted && !s.active) };
		} else {
			const foe = ctl.battle.p2.active[0];
			const me = ctl.battle.p1.active[0];
			const balls = ['ultraball', 'greatball', 'pokeball'].filter(b => count(b) > 0);
			const easy = (D.species[foes[0].sp].catch || 45) >= 120;
			if (wantCatch && balls.length && (foe.hp / foe.maxhp < 0.5 || easy || turns > 6)) action = { type: 'ball', ball: balls[0] };
			else if (wantCatch) {
				// golpe más flojo que haga daño, para no debilitarlo
				const sc = AI.scoreMoves(ctl.battle, me, foe, 4).filter(x => x.move.category !== 'Status' && x.score > 0).sort((a, b) => a.score - b.score);
				action = sc.length ? { type: 'move', i: sc[0].i } : { type: 'move', i: 0 };
			}
			if (action) { /* ya decidido */ }
			else if (me.hp / me.maxhp < 0.25 && count('potion') + count('superpotion') > 0 && kind === 'trainer' && Math.random() < 0.6) {
				action = { type: 'item', item: count('superpotion') ? 'superpotion' : 'potion', uid: ctl.partyOf(me).uid };
			} else {
				const d = AI.decide(ctl.battle, 'p1', { level: 4, wild: false, gimmick: G.flags.mec_mega && count('megaring') ? 'mega' : null, gimmickUsed: ctl.gimmickUsed });
				if (!d) { action = { type: 'move', i: 0 }; }
				else if (d.choice.startsWith('switch')) action = { type: 'switch', idx: +d.choice.split(' ')[1] - 1 };
				else { const parts = d.choice.split(' '); action = { type: 'move', i: +parts[1] - 1, gimmick: parts[2] === 'mega' ? 'mega' : parts[2] === 'zmove' ? 'z' : parts[2] === 'dynamax' ? 'dynamax' : parts[2] === 'terastallize' ? 'tera' : null }; }
			}
		}
		r = ctl.turn(action);
		if (r.error) {
			const errs = [r.error];
			const tries = [0, 1, 2, 3].map(i => ({ type: 'move', i })).concat(ctl.options().switches.filter(x => !x.fainted && !x.active).map(x => ({ type: 'switch', idx: x.idx })));
			for (const t of tries) { r = ctl.turn(t); if (!r.error) break; errs.push(r.error); }
			if (r.error && process.env.DBG) { console.log('DBG p1', ctl.battle.p1.requestState, JSON.stringify(ctl.battle.p1.choice), 'p2', ctl.battle.p2.requestState, JSON.stringify(ctl.battle.p2.choice), '\nLOG:', ctl.battle.log.join('\n')); process.exit(3); }
			if (r.error) { report.errors.push(`acciones rechazadas en combate (${cfg.trainer || cfg.wild?.sp}): ${[...new Set(errs)].join(' / ')} · request ${JSON.stringify(ctl.battle.p1.activeRequest).slice(0, 300)}`); break; }
		}
		if (r.ended) break;
	}
	if (!r.ended) { report.errors.push(`combate sin terminar (${cfg.trainer || cfg.wild?.sp}) en ${G.loc}`); }
	const sum = ctl.finish();
	if (kind === 'wild') report.battles.wild++; else report.battles.trainer++;
	if (sum.result === 'win' || sum.result === 'caught') report.battles.won++;
	if (sum.result === 'lose') { report.battles.lost++; report.losses.push(`${cfg.trainer || cfg.wild?.sp} en ${G.loc} (equipo: ${G.party.map(p => p.sp + p.lv).join(',')})`); }
	if (sum.result === 'win' && trainer) {
		G.beaten[trainer.id] = (G.beaten[trainer.id] || 0) + 1;
		if (trainer.cls === 'Líder' || trainer.npc && ['brock', 'blanca', 'corelia'].includes(trainer.npc)) report.gyms.push(`${trainer.id}: ganado en paso ${step} con ${G.party.map(p => p.sp + ' ' + p.lv).join(', ')}`);
	}
	if (sum.result === 'lose' && trainer && (trainer.npc && ['brock', 'blanca', 'corelia'].includes(trainer.npc))) report.gyms.push(`${trainer.id}: PERDIDO en paso ${step} con ${G.party.map(p => p.sp + ' ' + p.lv).join(', ')}`);
	for (const lu of sum.levelUps) { const p = G.party.find(x => x.uid === lu.uid); if (p) for (const m of lu.moves) learn(p, m); }
	if (sum.caught) { receive(sum.caught); log(`  captura ${sum.caught.sp} nv${sum.caught.lv}`); }
	for (const uid of sum.leveled) { const p = G.party.find(x => x.uid === uid); if (p) tryEvolve(p); }
	if (sum.result === 'lose' && !cfg.canLose) { whiteout(); if (G.lastCenterSub && L(G.lastCenterSub)) G.loc = G.lastCenterSub; G.route = null; log('  DERROTA → Centro Pokémon'); }
	return Promise.resolve(sum);
}

// ---------------- Movimiento ----------------
async function enter(id, { from } = {}) {
	const loc = L(id);
	if (!loc) { report.errors.push('enter a lugar inexistente ' + id); return; }
	G.visited[id] = true;
	for (let p = L(id)?.parent; p && !G.visited[p]; p = L(p)?.parent) G.visited[p] = true;
	G.loc = id;
	if (isRoute(loc)) { const r = loc.route; G.route = { id, pos: from === r.to ? r.length : 0 }; markTramo(id, G.route.pos); }
	else G.route = null;
	const enters = (loc.onEnter || []).concat(...activeEvents().map(e => e.onEnter?.[id] || []));
	for (let i = 0; i < enters.length; i++) {
		const e = enters[i];
		const key = 'enter:' + id + ':' + (e.script || i);
		if (e.once !== false && G.flags[key]) continue;
		if (e.cond !== undefined && !evalCond(e.cond)) continue;
		G.flags[key] = true;
		await run(e.script);
		if (G.loc !== id) return;
	}
}
UI.onScript = id => report.scripts.add(id);
async function run(id) {
	const prev = curScript; curScript = typeof id === 'string' ? id : '(inline)';
	report.scripts.add(curScript);
	if (VERBOSE) log(`[${step}] ${G.loc} → guion ${curScript}`);
	await runScript(id);
	curScript = prev;
}

async function doSpot(s) {
	const a = s.action || {};
	if (s.script) return run(s.script);
	if (s.talk) { for (const v of s.talk) if (v.cond === undefined || evalCond(v.cond)) { await run(v.script); return; } return; }
	if (a.script) return run(a.script);
	if (a.talk) return runFirst(a.talk);
	if (a.center) { healParty(); G.lastCenter = topLoc(G.loc)?.id; G.lastCenterSub = G.loc; return; }
	if (a.shop) return autoShop(a.shop);
	if (a.go) { if (canEnter(a.go).ok) await enter(a.go, { from: G.loc }); return; }
	if (a.trainer) { if (!G.beaten[a.trainer] || a.repeat) await battle({ trainer: a.trainer }); return; }
	if (a.training) {
		if (!trainingOpen(a.training.cap)) return;
		if (a.training.trainers?.length) await battle({ trainer: a.training.trainers[Math.floor(Math.random() * a.training.trainers.length)] });
		return;
	}
	if (a.explore) { const w = rollWild(L(G.loc), a.explore === true ? 'grass' : a.explore); if (w) await battle({ wild: { mon: w.mon } }); }
}
function autoShop(id) {
	const shop = C.shops[id];
	for (const e of shop.items) {
		const o = typeof e === 'string' ? { id: e } : e;
		if (o.cond !== undefined && !evalCond(o.cond)) continue;
		const want = { pokeball: 8, greatball: 8, potion: 6, superpotion: 6, hyperpotion: 4, revive: 2 }[o.id];
		if (!want) continue;
		const price = o.price ?? D.items[o.id]?.cost ?? 100;
		while (count(o.id) < want && G.player.money > price + 500) { G.player.money -= price; addItem(o.id, 1); }
	}
}

const spotRuns = {}; // clave → veces
function spotKey(loc, s) {
	let v = '';
	if (s.talk) { const t = s.talk.find(x => x.cond === undefined || evalCond(x.cond)); v = t?.script || ''; }
	return loc.id + '|' + s.label + '|' + v;
}

async function routeWalk(loc) {
	const r = loc.route;
	// decidir dirección: hacia el extremo no visitado, o hacia donde haya cosas pendientes
	const pr = routeProg(loc.id);
	let dir = G.route.pos === 0 ? 1 : G.route.pos === r.length ? -1 : (G.route.dir || 1);
	if (G.route.pos === 0 && G.visited[r.to] && G.cleared[loc.id]) dir = 1;
	G.route.dir = dir;
	let guard = 0;
	while (guard++ < 60) {
		const pos = G.route.pos;
		// objetos visibles y ocultos (el bot "busca" en cada tramo)
		for (const it of tramoItems(loc, pos)) {
			if (it.item && !pr.items[pos + ':' + it.item]) { pr.items[pos + ':' + it.item] = true; addItem(it.item, it.n || 1); }
			if (it.trainer && it.optional && !G.beaten[it.trainer]) await battle({ trainer: it.trainer });
			if (it.talk && (it.cond === undefined || evalCond(it.cond))) { const k = loc.id + '|t' + pos + '|' + (it.talk.find(x => x.cond === undefined || evalCond(x.cond))?.script || ''); const sg = sigNow(); const rec = spotRuns[k] ||= { n: 0, sig: '' }; if (rec.sig !== sg && rec.n < 6) { rec.n++; rec.sig = sg; await runFirst(it.talk); } }
			if (it.branch && (it.branch.cond === undefined || evalCond(it.branch.cond)) && !G.visited[it.branch.go]) { await enter(it.branch.go, { from: loc.id }); return; }
			if (G.loc !== loc.id) return;
		}
		if (dir > 0 && pos === r.length) { await enter(r.to, { from: loc.id }); return; }
		if (dir < 0 && pos === 0) { await enter(r.from, { from: loc.id }); return; }
		const cm = canMove(loc, pos, dir);
		if (!cm.ok) {
			if (cm.script) await run(cm.script);
			if (!canMove(loc, pos, dir).ok) { dir = -dir; G.route.dir = dir; report.stuck.push(`bloqueo en ${loc.id} tramo ${pos}: ${cm.msg}`); if (guard > 30) return; continue; }
		}
		const n = Math.max(0, Math.min(r.length, pos + dir));
		G.route.pos = n;
		markTramo(loc.id, n);
		walkFriendship();
		// eventos del tramo
		let happened = false;
		for (const it of tramoItems(loc, n)) {
			if (it.script) { const key = n + ':' + it.script; if (it.once !== false && pr.done[key]) continue; if (it.dir !== undefined && it.dir !== dir) continue; pr.done[key] = true; await run(it.script); happened = true; }
			if (it.trainer && !it.optional && !G.beaten[it.trainer]) { const res = await battle({ trainer: it.trainer }); happened = true; if (res.result === 'lose') return; }
			if (it.wildFixed && !pr.done[n + ':wild']) { pr.done[n + ':wild'] = true; await battle({ wild: it.wildFixed }); happened = true; }
			if (G.loc !== loc.id) return;
		}
		if (!happened && Math.random() < encounterRate(loc)) {
			const w = rollWild(loc, tramoTerrain(loc, n));
			if (w) await battle({ wild: { mon: w.mon, gimmick: w.entry.gimmick } });
			if (G.loc !== loc.id) return;
		}
		if (G.party.every(p => p.hp <= 0)) return;
	}
}

function partyNeedsHeal() {
	const tot = G.party.reduce((s, p) => s + p.hp, 0), max = G.party.reduce((s, p) => s + maxHp(p), 0);
	return tot / max < 0.5 || G.party.filter(p => p.hp <= 0).length >= 2;
}
function usePotions() {
	for (const p of G.party) {
		while (p.hp > 0 && p.hp < maxHp(p) * 0.6 && (count('superpotion') || count('potion'))) {
			const it = count('superpotion') ? 'superpotion' : 'potion';
			removeItem(it); p.hp = Math.min(maxHp(p), p.hp + (it === 'superpotion' ? 60 : 20));
		}
	}
}
let rot = 0;
function manageTeam() {
	// equipo: Riolu + los 4 de mayor nivel + un hueco que rota entre los de la caja (como haría alguien probando Pokémon)
	const all = G.party.concat(G.boxes[0]);
	all.sort((a, b) => (b.uid === G.vars.riolu_uid) - (a.uid === G.vars.riolu_uid) || b.lv - a.lv);
	const core = all.slice(0, 5), rest = all.slice(5);
	// si algún sitio de aquí pide un Pokémon concreto en el equipo (inParty("x")), lo mete en el hueco libre
	const loc = L(G.loc);
	const wanted = loc ? new Set([...JSON.stringify(loc.spots || []).matchAll(/inParty\(\\?"(\w+)\\?"\)/g)].map(m => m[1])) : new Set();
	const want = wanted.size && !core.some(p => wanted.has(p.sp)) ? rest.findIndex(p => wanted.has(p.sp)) : -1;
	if (want >= 0) { core.push(rest[want]); rest.splice(want, 1); }
	else if (rest.length) { rot = (rot + 1) % rest.length; core.push(rest[rot]); rest.splice(rot, 1); }
	G.party = core;
	G.boxes[0] = rest;
}

async function grind(target) {
	// busca la ruta despejada más cercana con encuentros y combate hasta subir
	const here = topLoc(G.loc);
	const cand = [here.id, ...(here.links || [])].map(L).filter(l => l && isRoute(l) && canEnter(l.id).ok);
	const loc = cand[0];
	if (!loc) return false;
	if (G.loc !== loc.id) await enter(loc.id, { from: here.id });
	let n = 0;
	while (avg() < target && n++ < 40) {
		const w = rollWild(loc, loc.route.terrain || 'grass');
		if (!w) break;
		await battle({ wild: { mon: w.mon } });
		if (partyNeedsHeal()) { usePotions(); if (partyNeedsHeal()) { healParty(); } }
	}
	return true;
}
const avg = () => G.party.reduce((s, p) => s + p.lv, 0) / G.party.length;

// ---------------- Bucle principal ----------------
newGame({ name: 'Bot', pron: ['el', 'ella', 'elle'][seed % 3] });
await run(C.blocks[0].start);
const t0 = Date.now();
let lastProgress = 0, lastSig = '';
const sigNow = () => Object.keys(G.flags).length + '/' + Object.values(G.quests).map(q => q.stage).join(',') + '/' + G.player.badges.length + '/' + Object.keys(G.bag).length + '/' + G.party.map(p => p.sp).join(',');
for (step = 0; step < MAX; step++) {
	if (UNTIL ? G.flags[UNTIL] : G.flags[C.blocks[C.blocks.length - 1].ends]) break;
	const sig = Object.keys(G.flags).length + '/' + Object.values(G.quests).map(q => q.stage).join(',') + '/' + G.player.badges.length + '/' + Object.keys(G.visited).length;
	if (sig !== lastSig) { lastSig = sig; lastProgress = step; }
	if (step - lastProgress > 900) { report.stuck.push(`sin progreso desde el paso ${lastProgress}: lugar ${G.loc}, misiones ${JSON.stringify(Object.fromEntries(Object.entries(G.quests).filter(([k, q]) => !q.done).map(([k, q]) => [k, q.stage])))}`); break; }
	if (!G.party.some(p => p.hp > 0)) { whiteout(); }
	usePotions();
	if (partyNeedsHeal()) { healParty(); }
	manageTeam();
	const loc = L(G.loc);
	if (!loc) { report.errors.push('ubicación inválida ' + G.loc); break; }
	if (isRoute(loc)) { await routeWalk(loc); continue; }
	// lugar: ejecutar spots pendientes
	let did = false;
	for (const s of spotsOf(loc)) {
		const k = spotKey(loc, s);
		const isNew = s.new !== undefined && evalCond(s.new);
		const rec = spotRuns[k] ||= { n: 0, sig: '' };
		const a = s.action || {};
		const sg = sigNow();
		if (a.center || a.pc || a.shop) { if (!rec.n) { rec.n = 1; await doSpot(s); } continue; }
		if (a.training) continue;
		if (a.trainer) { if (!G.beaten[a.trainer] && rec.n < 8) { rec.n++; await doSpot(s); did = true; break; } continue; }
		if (a.go && G.visited[a.go]) { if (isNew && rec.n < 15 && Math.random() < 0.5) { rec.n++; await doSpot(s); did = true; break; } continue; }
		if (a.explore) { if (rec.n < 12 && Math.random() < 0.5) { rec.n++; await doSpot(s); did = true; break; } continue; }
		if (rec.n === 0 || (isNew && (rec.n < 4 || (rec.n < 25 && step - (rec.last || 0) > 40))) || (rec.sig !== sg && rec.n < 6 && (s.talk || s.script || a.script))) {
			rec.n++; rec.sig = sg; rec.last = step;
			await doSpot(s);
			did = true;
			break;
		}
	}
	if (did) continue;
	// moverse: preferir salidas/hijos no visitados o con algo nuevo
	const opts = [];
	for (const s of spotsOf(loc)) if (s.action?.go) opts.push({ id: s.action.go, w: G.visited[s.action.go] ? 1 : 20 });
	if (loc.parent) opts.push({ id: loc.parent, w: 2 });
	for (const n of loc.links || []) {
		const l = L(n); if (!l) continue;
		const ce = canEnter(n);
		if (!ce.ok) continue;
		opts.push({ id: n, w: !G.visited[n] ? 30 : isRoute(l) && !G.cleared[n] ? 15 : 3 });
	}
	// ¿hay que entrenar? (gimnasio pendiente y nivel bajo)
	if (avg() < (G.vars.cap || 15) - 4 && Math.random() < 0.25) { await grind((G.vars.cap || 15) - 3); continue; }
	if (!opts.length) { report.stuck.push('sin salidas en ' + loc.id); break; }
	const tot = opts.reduce((s, o) => s + o.w, 0);
	let r = Math.random() * tot;
	const pick = opts.find(o => (r -= o.w) < 0) || opts[0];
	if (canEnter(pick.id).ok) await enter(pick.id, { from: loc.id });
}

// ---------------- Informe ----------------
const done = Object.entries(G.quests).filter(([k, q]) => q.done).map(([k]) => k);
const open = Object.entries(G.quests).filter(([k, q]) => !q.done).map(([k, q]) => `${k}:${q.stage}`);
const never = Object.keys(C.quests).filter(k => !G.quests[k]);
const unvisited = Object.keys(C.locations).filter(k => !G.visited[k]);
const unusedScripts = Object.keys(C.scripts).filter(k => !report.scripts.has(k));
console.log(`\n=== RECORRIDO (semilla ${seed}${FECHA ? ' · fecha ' + FECHA : ''} · hora ${HORA}) ===`);
console.log(`Final alcanzado: ${G.flags[UNTIL || C.blocks[C.blocks.length - 1].ends] ? 'SÍ' : 'NO'} · pasos ${step} · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
console.log(`Medallas: ${G.player.badges.join(', ')} · Dinero ₽${G.player.money} · Equipo: ${G.party.map(p => `${p.sp} ${p.lv}`).join(', ')}`);
console.log(`Combates: ${report.battles.trainer} entrenador, ${report.battles.wild} salvajes · ganados ${report.battles.won} · perdidos ${report.battles.lost}`);
console.log(`Gimnasios:\n  ${report.gyms.join('\n  ') || '-'}`);
console.log(`Diario: ${G.diary.length} entradas · textos mostrados: ${report.texts}`);
console.log(`Misiones hechas (${done.length}): ${done.join(', ')}`);
console.log(`Misiones abiertas (${open.length}): ${open.join(', ')}`);
console.log(`Misiones nunca iniciadas (${never.length}): ${never.join(', ')}`);
console.log(`Lugares sin visitar (${unvisited.length}): ${unvisited.join(', ')}`);
console.log(`Guiones nunca ejecutados (${unusedScripts.length}): ${unusedScripts.slice(0, 80).join(', ')}`);
if (report.losses.length) console.log(`Derrotas:\n  ${report.losses.slice(0, 20).join('\n  ')}`);
if (report.stuck.length) console.log(`ATASCOS:\n  ${[...new Set(report.stuck)].slice(0, 15).join('\n  ')}`);
if (report.errors.length) console.log(`ERRORES (${report.errors.length}):\n  ${[...new Set(report.errors)].slice(0, 40).join('\n  ')}`);
process.exit(report.errors.length || !G.flags[UNTIL || C.blocks[C.blocks.length - 1].ends] ? 1 : 0);
