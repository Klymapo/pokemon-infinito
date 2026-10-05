// Controlador de combate: une el simulador de Showdown con el estado del juego.
import { Battle, Dex } from '../lib/ps-sim.js';
import { BattleTextParser, BattleText } from '../lib/battle-text.js';
import * as AI from './ai.js';
import { D, toID } from './data.js';
import { G, markSeen, markCaught, count, removeItem } from './state.js';
import {
	toSimSet, expGain, addExp, addEVs, addHappy, catchChance, rollCatch, maxHp, displayName,
	movesLearnedAt, isBall,
} from './pokemon.js';
import { isNight } from './time.js';
import { rint, clone } from './util.js';

// ---------- Movimiento oculto para "pasar turno" (usar objeto, fallar huida, lanzar Ball) ----------
let customReady = false;
function ensureCustom() {
	if (customReady) return;
	const data = Dex.data;
	data.Moves.pasarturno = {
		num: 99990, accuracy: true, basePower: 0, category: 'Status', name: 'Pasar Turno', pp: 64,
		priority: 0, flags: {}, target: 'self', type: '???', isNonstandard: 'Custom',
		onTry() { return null; },
	};
	customReady = true;
}

// ---------- Textos de combate ----------
const ES = () => BattleText.es.Default.default;
function setTextMode(wild) {
	const d = ES();
	d.opposingPokemon = wild ? 'el {NICKNAME} salvaje' : 'el {NICKNAME} rival';
	d.switchIn = '¡{TRAINER} saca a {FULLNAME}!';
	d.switchOut = '¡{TRAINER} retira a {NICKNAME}!';
	d.mega = d.mega || '  ¡{POKEMON} reacciona a la Megapulsera de {TRAINER}!';
	d.terastallize = d.terastallize || '¡{POKEMON} se ha teracristalizado en el tipo {TYPE}!';
	d.startBattle = '';
	d.winBattle = '';
	d.turn = '';
	d.eatItem = d.eatItem || '  ¡{POKEMON} se ha comido {ITEM:definite:classified}!';
	d.activate = d.activate || '  ({EFFECT})';
	d.start = d.start || '  ({EFFECT})';
}
function cleanText(t) {
	return t.split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('(') && !s.startsWith('==') && !/^Battle started/.test(s))
		.map(s => s.replace(/ de el /g, ' del ').replace(/ a el /g, ' al ').replace(/ De el /g, ' Del ')
			.replace(/^([¡¿]?)([a-záéíóúñ])/, (m, a, b) => a + b.toUpperCase()));
}

const CONSUMABLE = /berry$|gem$|herb$|seed$|^focussash$|^airballoon$|^boosterenergy$|^ejectbutton$|^redcard$|^weaknesspolicy$|^roomservice$|^adrenalineorb$|^throatspray$|^blunderpolicy$|^ejectpack$|^mirrorherb$|^whiteherb$|^powerherb$|^mentalherb$|^cellbattery$|^absorbbulb$|^snowball$|^luminousmoss$|^berryjuice$/;

const HEAL_ITEMS = {
	potion: { hp: 20 }, superpotion: { hp: 60 }, hyperpotion: { hp: 120 }, maxpotion: { hp: 9999 },
	fullrestore: { hp: 9999, cure: 'all' }, freshwater: { hp: 30 }, sodapop: { hp: 50 }, lemonade: { hp: 70 },
	moomoomilk: { hp: 100 }, berryjuice: { hp: 20 }, energypowder: { hp: 60 }, energyroot: { hp: 120 },
	sweetheart: { hp: 20 }, ragecandybar: { cure: 'all' }, lavacookie: { cure: 'all' }, oldgateau: { cure: 'all' },
	casteliacone: { cure: 'all' }, lumiosegalette: { cure: 'all' }, shalourable: { cure: 'all' }, bigmalasada: { cure: 'all' },
	pewtercrunchies: { cure: 'all' }, jubilifemuffin: { cure: 'all' },
	fullheal: { cure: 'all' }, healpowder: { cure: 'all' }, antidote: { cure: ['psn', 'tox'] }, paralyzeheal: { cure: ['par'] },
	burnheal: { cure: ['brn'] }, iceheal: { cure: ['frz'] }, awakening: { cure: ['slp'] },
	revive: { revive: 0.5 }, maxrevive: { revive: 1 }, revivalherb: { revive: 1 },
	oranberry: { hp: 10 }, sitrusberry: { pct: 0.25 }, ether: { pp: 10 }, maxether: { pp: 99 }, elixir: { ppAll: 10 }, maxelixir: { ppAll: 99 },
	xattack: { boost: { atk: 2 } }, xdefense: { boost: { def: 2 } }, xspatk: { boost: { spa: 2 } }, xspdef: { boost: { spd: 2 } },
	xspeed: { boost: { spe: 2 } }, xaccuracy: { boost: { accuracy: 2 } }, direhit: { crit: true }, guardspec: { mist: true },
};
export const isBattleUsable = id => !!HEAL_ITEMS[id] || isBall(id);
export const healInfo = id => HEAL_ITEMS[id];

const KEY_FOR = { mega: 'megaring', z: 'zring', dynamax: 'dynamaxband', tera: 'teraorb' };

export class BattleCtl {
	/**
	 * cfg: {
	 *   kind: 'wild'|'trainer', foes: [instancias], trainer: {id,name,cls,ai,items:[{id,n}],gimmick,ace,reward,...},
	 *   terrain: 'grass'|'cave'|'water'|'city'|'gym'|..., canRun, noCatch, wildGimmick: 'tera'|'dynamax', loc
	 * }
	 */
	constructor(cfg) {
		ensureCustom();
		this.cfg = cfg;
		this.kind = cfg.kind;
		this.wild = cfg.kind === 'wild';
		this.trainer = cfg.trainer || null;
		this.foes = cfg.foes;
		this.events = [];
		this.logIdx = 0;
		this.skipNext = 0;
		this.participants = new Set();
		this.gimmickUsed = false;
		this.aiGimmickUsed = false;
		this.aiItems = clone(this.trainer?.items || []);
		this.runAttempts = 0;
		this.result = null;
		this.caught = null;
		this.levelUps = [];
		this.expLog = [];
		this.turnNo = 0;
		this.firstFoeShown = false;
		this.p2SwitchedLast = false;
	}

	start() {
		setTextMode(this.wild);
		const b = this.battle = new Battle({ formatid: 'gen9infinite' });
		b.allowDynamax = true;
		b.send = (type, data) => {
			if (type === 'sideupdate' && typeof data === 'string' && data.includes('|error|')) this.lastError = data.split('|error|')[1];
		};
		// Equipo del jugador: el primero no debilitado va delante.
		const party = G.party;
		const order = party.map((p, i) => i).filter(i => party[i].hp > 0).concat(party.map((p, i) => i).filter(i => party[i].hp <= 0));
		this.partyOrder = order;
		b.setPlayer('p1', { name: G.player.name, team: order.map(i => toSimSet(party[i])) });
		this.simToParty = new Map();
		b.p1.pokemon.forEach((sp, k) => {
			const p = party[order[k]];
			this.simToParty.set(sp, p);
			// PS, estado y PP reales
			if (p.hp <= 0) {
				sp.hp = 0; sp.fainted = true; sp.status = 'fnt';
			} else {
				sp.hp = Math.min(p.hp, sp.maxhp);
				if (p.status) {
					sp.status = p.status;
					sp.statusState = b.initEffectState({ id: p.status, target: sp });
					if (p.status === 'slp') { sp.statusState.startTime = p.sleepTurns || rint(1, 3); sp.statusState.time = sp.statusState.startTime; }
					if (p.status === 'tox') sp.statusState.stage = 0;
				}
			}
			sp.moveSlots.forEach((ms, j) => {
				const pm = p.moves[j];
				if (pm) { ms.pp = pm.pp; ms.maxpp = Math.max(pm.pp, Math.floor((D.moves[pm.id]?.pp || ms.maxpp) * (5 + (pm.ppUps || 0)) / 5)); }
			});
			sp.baseMoveSlots = sp.moveSlots.map(m => ({ ...m }));
		});
		const foeName = this.wild ? 'Salvaje' : (this.trainer?.name || 'Rival');
		b.setPlayer('p2', { name: foeName, team: this.foes.map(f => toSimSet(f)) });
		// El simulador reinicia pokemonLeft al empezar: recontar sin los debilitados
		b.p1.pokemonLeft = b.p1.pokemon.filter(p => !p.fainted).length;
		this.simToFoe = new Map();
		b.p2.pokemon.forEach((sp, k) => {
			const f = this.foes[k];
			this.simToFoe.set(sp, f);
			if (f.hp !== undefined && f.hp > 0 && f.hp < sp.maxhp) sp.hp = f.hp;
			if (f.status) { sp.status = f.status; sp.statusState = b.initEffectState({ id: f.status, target: sp }); }
		});
		this.parser = new BattleTextParser('p1');
		this.parser.p1 = G.player.name;
		this.parser.p2 = foeName;
		for (const f of this.foes) markSeen(f.sp);
		this.events = [];
		if (this.wild) {
			const f = this.foes[0];
			const shiny = f.shiny ? ' ✨' : '';
			this.events.push({ t: 'text', s: `¡Un **${D.species[f.sp].name}** salvaje apareció!${shiny}` });
		} else if (this.trainer?.introBattle) {
			this.events.push({ t: 'text', s: this.trainer.introBattle });
		} else {
			this.events.push({ t: 'text', s: `¡**${this.trainer?.cls ? this.trainer.cls + ' ' : ''}${this.trainer?.name || 'Rival'}** te desafía!` });
		}
		this.participants = new Set([b.p1.active[0]]);
		this.pump();
		return this.flushEvents();
	}

	flushEvents() { const e = this.events; this.events = []; return e; }

	// ---------- Lectura del registro del simulador ----------
	pump() {
		const log = this.battle.log;
		while (this.logIdx < log.length) {
			const line = log[this.logIdx++];
			if (this.skipNext) { this.skipNext--; continue; }
			if (line.startsWith('|split|')) { this.skipNext = 0; this._afterSplit = true; continue; }
			if (this._afterSplit) { this._afterSplit = false; this.skipNext = 1; }
			this.handleLine(line);
		}
	}

	sideOf(ident) { return ident?.slice(0, 2); }
	simPokemon(ident) {
		if (!ident) return null;
		const side = this.battle[this.sideOf(ident)];
		return side?.active?.[0] || null;
	}

	handleLine(line) {
		const { args, kwArgs } = BattleTextParser.parseBattleLine(line);
		const cmd = args[0];
		if (cmd === 'move' && toID(args[2]) === 'pasarturno') return;
		// Eventos de estado para la interfaz
		switch (cmd) {
		case 'switch': case 'drag': case 'replace': {
			const side = this.sideOf(args[1]);
			const sp = this.battle[side].active[0];
			const [hp, maxhp] = (args[3] || '').split(' ')[0].split('/').map(Number);
			const details = args[2] || '';
			const spId = toID(details.split(',')[0]);
			const info = {
				name: sp?.name || args[1].slice(5), sp: D.species[spId] ? spId : toID(sp?.species?.name),
				lv: sp?.level, hp, maxhp: maxhp || sp?.maxhp, shiny: details.includes('shiny'), gender: sp?.gender,
				status: sp?.status && sp.status !== 'fnt' ? sp.status : '', boosts: {},
			};
			if (side === 'p2') {
				markSeen(info.sp);
				this.participants = new Set([this.battle.p1.active[0]]);
			} else if (sp) {
				this.participants.add(sp);
			}
			this.events.push({ t: 'switch', side, info });
			if (side === 'p2' && this.wild && !this.firstFoeShown) { this.firstFoeShown = true; return; }
			if (side === 'p2') this.firstFoeShown = true;
			break;
		}
		case 'detailschange': case '-formechange': {
			const side = this.sideOf(args[1]);
			const spId = toID((args[2] || '').split(',')[0]);
			if (D.species[spId]) this.events.push({ t: 'forme', side, sp: spId });
			break;
		}
		case '-damage': case '-heal': case '-sethp': {
			const side = this.sideOf(args[1]);
			const [hp, maxhp] = (args[2] || '').split(' ')[0].split('/').map(Number);
			this.events.push({ t: 'hp', side, hp: isNaN(hp) ? 0 : hp, maxhp: maxhp || undefined, from: kwArgs.from });
			break;
		}
		case 'faint': {
			const side = this.sideOf(args[1]);
			this.events.push({ t: 'faint', side });
			break;
		}
		case '-status': this.events.push({ t: 'status', side: this.sideOf(args[1]), status: args[2] }); break;
		case '-curestatus': this.events.push({ t: 'status', side: this.sideOf(args[1]), status: '' }); break;
		case 'move': {
			const mid = toID(args[2]);
			this.events.push({ t: 'move', side: this.sideOf(args[1]), move: mid, type: D.moves[mid]?.type, miss: !!kwArgs.miss, z: !!kwArgs.zeffect });
			break;
		}
		case '-terastallize': this.events.push({ t: 'tera', side: this.sideOf(args[1]), type: args[2] }); break;
		case '-mega': this.events.push({ t: 'mega', side: this.sideOf(args[1]) }); break;
		case '-zpower': this.events.push({ t: 'zpower', side: this.sideOf(args[1]) }); break;
		case '-start':
			if (args[2] === 'Dynamax') this.events.push({ t: 'dyn', side: this.sideOf(args[1]), on: true, gmax: args[3] === 'Gmax' });
			break;
		case '-end':
			if (args[2] === 'Dynamax') this.events.push({ t: 'dyn', side: this.sideOf(args[1]), on: false });
			break;
		case '-boost': case '-unboost': {
			const n = parseInt(args[3], 10) * (cmd === '-boost' ? 1 : -1);
			this.events.push({ t: 'boost', side: this.sideOf(args[1]), stat: args[2], n });
			break;
		}
		case '-crit': this.events.push({ t: 'crit' }); break;
		case '-supereffective': this.events.push({ t: 'eff', n: 2 }); break;
		case '-resisted': this.events.push({ t: 'eff', n: 0.5 }); break;
		case 'turn': this.turnNo = parseInt(args[1], 10); return;
		case 'win': case 'tie': return;
		}
		// Texto
		let text = '';
		try { text = this.parser.parseArgs(args, kwArgs) || ''; } catch (e) { text = ''; }
		for (const s of cleanText(text)) this.events.push({ t: 'text', s });
		// Experiencia tras debilitar a un rival
		if (cmd === 'faint' && this.sideOf(args[1]) === 'p2') this.awardExp(args[1]);
	}

	// ---------- Experiencia ----------
	awardExp(ident) {
		if (this.cfg.noExp) return;
		const foeSim = this.battle.p2.active[0];
		const foe = this.simToFoe.get(foeSim) || this.simToFoe.get(this.battle.p2.pokemon.find(p => p.fainted && !p._expGiven));
		if (!foe || foeSim?._expGiven) return;
		if (foeSim) foeSim._expGiven = true;
		const foeInst = { sp: foe.sp, lv: foe.lv };
		const share = !!G.settings.expShare;
		const cap = G.vars.cap || 100;
		for (const [simP, p] of this.simToParty) {
			if (p.hp <= 0 && simP.fainted) continue;
			if (simP.fainted) continue;
			const participated = this.participants.has(simP);
			if (!participated && !share) continue;
			const amount = expGain(p, foeInst, { trainer: !this.wild, participated, share, cap });
			if (amount <= 0) continue;
			addEVs(p, foe.sp);
			const levels = addExp(p, amount);
			this.events.push({ t: 'text', s: `¡${displayName(p)} ha ganado ${amount} puntos de experiencia!`, quiet: !participated });
			this.events.push({ t: 'exp', uid: p.uid });
			for (const lv of levels) {
				this.applyLevelToSim(simP, p);
				this.events.push({ t: 'text', s: `¡**${displayName(p)}** ha subido al nivel **${lv}**!` });
				this.events.push({ t: 'levelup', uid: p.uid, lv });
				const newMoves = movesLearnedAt(p.sp, lv);
				if (newMoves.length) this.levelUps.push({ uid: p.uid, moves: newMoves });
			}
			if (levels.length) this.leveled = (this.leveled || new Set()).add(p.uid);
		}
	}

	applyLevelToSim(simP, p) {
		const b = this.battle;
		simP.level = p.lv;
		simP.set.level = p.lv;
		simP.set.evs = { hp: p.evs[0], atk: p.evs[1], def: p.evs[2], spa: p.evs[3], spd: p.evs[4], spe: p.evs[5] };
		const stats = b.spreadModify(simP.species.baseStats, simP.set);
		const dyn = !!simP.volatiles.dynamax;
		const diff = stats.hp - simP.baseMaxhp;
		simP.baseMaxhp = stats.hp;
		simP.maxhp = dyn ? stats.hp * 2 : stats.hp;
		if (simP.hp > 0) simP.hp = Math.min(simP.maxhp, simP.hp + diff * (dyn ? 2 : 1));
		simP.baseStoredStats = stats;
		if (!simP.transformed) for (const st in simP.storedStats) simP.storedStats[st] = stats[st];
		if (simP.isActive) this.events.push({ t: 'hp', side: 'p1', hp: simP.hp, maxhp: simP.maxhp, lv: p.lv });
	}

	// ---------- Información para la interfaz ----------
	active(side = 'p1') { return this.battle[side].active[0]; }
	partyOf(simP) { return this.simToParty.get(simP); }

	options() {
		const side = this.battle.p1;
		const req = side.activeRequest;
		const out = { forceSwitch: !!req?.forceSwitch, wait: !!req?.wait, moves: [], gimmicks: {}, trapped: false, switches: [] };
		side.pokemon.forEach((sp, idx) => {
			const p = this.simToParty.get(sp);
			out.switches.push({ idx, uid: p?.uid, name: sp.name, sp: toID(sp.species.name), lv: sp.level, hp: sp.hp, maxhp: sp.maxhp, fainted: sp.fainted || sp.hp <= 0, active: sp.isActive, status: sp.status });
		});
		const a = req?.active?.[0];
		if (!a || out.forceSwitch) return out;
		out.trapped = !!(a.trapped || a.maybeTrapped);
		const simP = side.active[0];
		a.moves.forEach((m, i) => {
			if (m.id === 'pasarturno') return;
			const md = D.moves[m.id];
			out.moves.push({
				i, id: m.id, name: md?.name || m.move, type: md?.type || '???', cat: md?.cat, bp: md?.bp, acc: md?.acc,
				pp: m.pp, maxpp: m.maxpp, disabled: !!m.disabled, desc: md?.desc,
				eff: md && md.cat !== 'Status' && this.active('p2') ? AI.typeMult(this.battle, md.type, this.active('p2')) : null,
				z: a.canZMove?.[i] ? { id: toID(a.canZMove[i].move), name: D.moves[toID(a.canZMove[i].move)]?.name || a.canZMove[i].move } : null,
				max: a.maxMoves?.maxMoves?.[i] ? { id: a.maxMoves.maxMoves[i].move, name: D.moves[a.maxMoves.maxMoves[i].move]?.name || a.maxMoves.maxMoves[i].move } : null,
			});
		});
		const may = k => !this.gimmickUsed && count(KEY_FOR[k]) > 0 && G.flags['mec_' + k];
		if (a.canMegaEvo && may('mega')) out.gimmicks.mega = true;
		if (a.canZMove && a.canZMove.some(z => z) && may('z')) out.gimmicks.z = true;
		if (a.canDynamax && may('dynamax')) out.gimmicks.dynamax = true;
		if (a.canTerastallize && may('tera') && !simP.terastallized) out.gimmicks.tera = a.canTerastallize;
		return out;
	}

	// ---------- Turnos ----------
	/**
	 * action: {type:'move', i, gimmick} | {type:'switch', idx} | {type:'item', item, uid, moveIdx}
	 *       | {type:'ball', ball} | {type:'run'}
	 * Devuelve {events, ended, result, needSwitch, error}
	 */
	turn(action) {
		const b = this.battle;
		this.lastError = null;
		const ev = this.events;
		let p1choice = null;
		const side = b.p1;
		const req = side.activeRequest;

		if (req?.forceSwitch) {
			if (action.type !== 'switch') return { events: this.flushEvents(), error: 'Elige un Pokémon.' };
			p1choice = 'switch ' + (action.idx + 1);
		} else if (action.type === 'move') {
			p1choice = 'move ' + (action.i + 1);
			if (action.gimmick === 'mega') p1choice += ' mega';
			else if (action.gimmick === 'z') p1choice += ' zmove';
			else if (action.gimmick === 'dynamax') p1choice += ' dynamax';
			else if (action.gimmick === 'tera') p1choice += ' terastallize';
			if (action.gimmick) this.gimmickUsed = true;
		} else if (action.type === 'switch') {
			p1choice = 'switch ' + (action.idx + 1);
		} else if (action.type === 'run') {
			if (!this.wild || this.cfg.canRun === false) {
				return { events: [{ t: 'text', s: this.wild ? '¡No puedes huir!' : '¡No puedes huir de un combate contra un entrenador!' }] };
			}
			const me = b.p1.active[0], foe = b.p2.active[0];
			this.runAttempts++;
			const mySpe = me.getStat('spe', false, true), foeSpe = Math.max(1, foe.getStat('spe', false, true));
			const odds = Math.floor(mySpe * 128 / foeSpe) + 30 * this.runAttempts;
			const trapped = req?.active?.[0]?.trapped && !me.hasType('Ghost');
			if (!trapped && (mySpe >= foeSpe || odds > 255 || rint(0, 255) < odds || me.hasItem('smokeball'))) {
				ev.push({ t: 'text', s: '¡Escapaste sin problemas!' });
				this.result = 'run';
				return { events: this.flushEvents(), ended: true, result: 'run' };
			}
			ev.push({ t: 'text', s: '¡No has podido escapar!' });
			p1choice = this.passChoice('p1');
		} else if (action.type === 'ball') {
			if (!this.wild || this.cfg.noCatch) {
				return { events: [{ t: 'text', s: this.wild ? '¡No se puede capturar a este Pokémon!' : '¡No puedes capturar Pokémon de otros entrenadores!' }] };
			}
			if (!removeItem(action.ball)) return { events: [{ t: 'text', s: 'No te quedan de esas.' }] };
			const foe = b.p2.active[0];
			const inst = this.simToFoe.get(foe);
			const lead = b.p1.active[0];
			const chance = catchChance({
				sp: inst.sp, lv: foe.level, hp: foe.hp, maxhp: foe.maxhp, status: foe.status, ball: action.ball,
				turn: this.turnNo, time: isNight() ? 'night' : 'day', terrain: this.cfg.terrain, caughtBefore: !!G.dex.caught[D.species[inst.sp].num],
				playerLv: lead?.level,
			});
			const r = rollCatch(chance * (this.cfg.catchMod || 1));
			ev.push({ t: 'text', s: `¡${G.player.name} lanzó una **${D.items[action.ball]?.name || 'Poké Ball'}**!` });
			ev.push({ t: 'ball', ball: action.ball, shakes: r.shakes, caught: r.caught });
			if (r.caught) {
				ev.push({ t: 'text', s: `¡Ya está! ¡**${D.species[inst.sp].name}** atrapado!` });
				const caught = clone(inst);
				caught.hp = foe.hp;
				caught.status = foe.status && foe.status !== 'fnt' ? foe.status : '';
				caught.ball = action.ball;
				caught.ot = G.player.name;
				caught.metAt = this.cfg.loc || '';
				caught.metLv = foe.level;
				caught.metDate = Date.now();
				if (action.ball === 'friendball') caught.happy = 200;
				if (action.ball === 'healball') { caught.hp = maxHp(caught); caught.status = ''; }
				this.caught = caught;
				markCaught(inst.sp);
				this.result = 'caught';
				return { events: this.flushEvents(), ended: true, result: 'caught' };
			}
			const msgs = ['¡Oh, no! ¡El Pokémon se ha escapado!', '¡Vaya! ¡Parecía que ya lo tenías!', '¡Argh! ¡Casi lo consigues!', '¡Qué pena! ¡Te faltó muy poco!'];
			ev.push({ t: 'text', s: msgs[r.shakes] });
			p1choice = this.passChoice('p1');
		} else if (action.type === 'item') {
			const res = this.useItem('p1', action.item, action.uid, action.moveIdx);
			if (!res.ok) return { events: [{ t: 'text', s: res.msg }] };
			p1choice = this.passChoice('p1');
		}

		// IA del rival
		if (b.p2.requestState === 'move' || b.p2.requestState === 'switch') this.chooseAI();

		if (!b.choose('p1', p1choice)) {
			b.p1.clearChoice();
			this.cleanupPass();
			return { events: this.flushEvents(), error: this.lastError || 'Esa acción no es válida ahora.' };
		}
		this.cleanupPass();
		this.pump();
		this.settleForcedAI();
		return this.status();
	}

	settleForcedAI() {
		const b = this.battle;
		// Si el rival debe sacar otro Pokémon y el jugador no tiene que elegir nada, lo hace la IA
		let guard = 0;
		while (!b.ended && b.p2.requestState === 'switch' && guard++ < 6) {
			this.chooseAI();
			if (b.p1.requestState === 'switch') break; // ambos deben cambiar: espera al jugador
			this.pump();
		}
		this.pump();
	}

	status() {
		const b = this.battle;
		const out = { events: this.flushEvents() };
		if (b.ended) {
			out.ended = true;
			out.result = this.result = b.winner === G.player.name ? 'win' : 'lose';
		} else {
			out.needSwitch = !!b.p1.activeRequest?.forceSwitch;
		}
		return out;
	}

	chooseAI() {
		const b = this.battle;
		const t = this.trainer || {};
		const d = AI.decide(b, 'p2', {
			level: this.wild ? 1 : (t.ai || 2), gimmick: this.wild ? this.cfg.wildGimmick : t.gimmick,
			gimmickUsed: this.aiGimmickUsed, ace: t.ace, items: this.aiItems, wild: this.wild, switchedLastTurn: this.p2SwitchedLast,
		});
		if (!d) return;
		this.p2SwitchedLast = !!d.switched;
		let choice = d.choice;
		if (d.item) {
			const r = this.useItem('p2', d.item);
			if (r.ok) {
				const it = this.aiItems.find(x => x.id === d.item);
				if (it) it.n--;
				choice = this.passChoice('p2');
			} else {
				choice = 'move 1';
			}
		}
		if (choice && / (mega|zmove|dynamax|terastallize)$/.test(choice)) this.aiGimmickUsed = true;
		if (!b.choose('p2', choice)) {
			const firstErr = this.lastError;
			// plan B: primer movimiento válido (limpiando la elección fallida)
			const tryC = c => { b.p2.clearChoice(); return b.choose('p2', c); };
			const ok = [1, 2, 3, 4].some(n => tryC('move ' + n)) || tryC('default');
			if (!ok) console.warn('IA sin acción válida', firstErr, this.lastError);
		}
	}

	passChoice(sideId) {
		const sp = this.battle[sideId].active[0];
		if (!sp.moveSlots.some(m => m.id === 'pasarturno')) {
			sp.moveSlots.push({ id: 'pasarturno', move: 'Pasar Turno', pp: 64, maxpp: 64, target: 'self', disabled: false, used: false });
			this._passInjected = (this._passInjected || []).concat(sp);
		}
		return 'move pasarturno';
	}
	cleanupPass() {
		for (const sp of this._passInjected || []) sp.moveSlots = sp.moveSlots.filter(m => m.id !== 'pasarturno');
		this._passInjected = [];
	}

	/** Usa un objeto en combate. sideId 'p1' (jugador, target por uid) o 'p2' (IA, sobre su activo). */
	useItem(sideId, itemId, uid, moveIdx) {
		const b = this.battle;
		const info = HEAL_ITEMS[itemId];
		if (!info) return { ok: false, msg: 'No puedes usar eso ahora.' };
		let simP;
		if (sideId === 'p1') {
			simP = [...this.simToParty].find(([s, p]) => p.uid === uid)?.[0];
			if (!simP) return { ok: false, msg: 'Elige un Pokémon.' };
		} else {
			simP = b.p2.active[0];
		}
		const who = sideId === 'p1' ? simP.name : `el ${simP.name} rival`;
		const user = sideId === 'p1' ? G.player.name : this.trainer?.name || 'El rival';
		const iname = D.items[itemId]?.name || itemId;
		const msgs = [];
		if (info.revive) {
			if (!simP.fainted && simP.hp > 0) return { ok: false, msg: 'No tendría ningún efecto.' };
			simP.fainted = false; simP.faintQueued = false; simP.status = '';
			simP.hp = Math.max(1, Math.floor(simP.maxhp * info.revive));
			b[sideId].pokemonLeft++;
			msgs.push(`¡${who} se ha recuperado!`);
		} else {
			if (simP.fainted || simP.hp <= 0) return { ok: false, msg: 'No tendría ningún efecto.' };
			let did = false;
			if (info.hp || info.pct) {
				const amt = info.pct ? Math.floor(simP.maxhp * info.pct) : info.hp;
				if (simP.hp < simP.maxhp) {
					const before = simP.hp;
					simP.hp = Math.min(simP.maxhp, simP.hp + amt);
					msgs.push(`¡${who} ha recuperado ${simP.hp - before} PS!`);
					did = true;
				}
			}
			if (info.cure) {
				const list = info.cure === 'all' ? ['par', 'brn', 'psn', 'tox', 'slp', 'frz'] : info.cure;
				if (simP.status && list.includes(simP.status)) {
					simP.setStatus('');
					msgs.push(`¡${who} ya se encuentra bien!`);
					did = true;
				}
				if (info.cure === 'all' && simP.volatiles.confusion) { simP.removeVolatile('confusion'); did = true; }
			}
			if (info.pp || info.ppAll) {
				const slots = info.ppAll ? simP.moveSlots : [simP.moveSlots[moveIdx || 0]].filter(Boolean);
				for (const ms of slots) {
					if (ms.pp < ms.maxpp) { ms.pp = Math.min(ms.maxpp, ms.pp + (info.pp || info.ppAll)); did = true; }
				}
				if (did) msgs.push(`¡Se han restaurado los PP de ${who}!`);
			}
			if (info.boost) {
				if (!simP.isActive) return { ok: false, msg: 'Solo funciona con el Pokémon en combate.' };
				b.boost(info.boost, simP, simP, null, true);
				did = true;
			}
			if (info.crit) { if (!simP.isActive) return { ok: false, msg: 'Solo funciona con el Pokémon en combate.' }; simP.addVolatile('focusenergy'); did = true; }
			if (info.mist) { b[sideId].addSideCondition('mist'); did = true; }
			if (!did) return { ok: false, msg: 'No tendría ningún efecto.' };
		}
		if (sideId === 'p1' && !removeItem(itemId)) return { ok: false, msg: 'No te quedan.' };
		this.events.push({ t: 'text', s: `¡${user} ha usado **${iname}**!` });
		for (const m of msgs) this.events.push({ t: 'text', s: m.replace(/^¡el/, '¡El') });
		if (simP.isActive) this.events.push({ t: 'hp', side: sideId, hp: simP.hp, maxhp: simP.maxhp });
		if (simP.isActive) this.events.push({ t: 'status', side: sideId, status: simP.status || '' });
		this.pump();
		return { ok: true };
	}

	// ---------- Final ----------
	/** Copia el estado del combate de vuelta al equipo. Devuelve resumen. */
	finish() {
		const b = this.battle;
		for (const [simP, p] of this.simToParty) {
			p.hp = simP.fainted ? 0 : Math.max(0, Math.min(simP.hp, maxHp(p)));
			if (simP.volatiles?.dynamax) p.hp = Math.min(maxHp(p), Math.ceil(simP.hp / 2));
			p.status = p.hp > 0 && simP.status && simP.status !== 'fnt' ? simP.status : '';
			if (p.status === 'slp') p.sleepTurns = simP.statusState?.time || 1;
			const slots = simP.baseMoveSlots?.length ? simP.baseMoveSlots : simP.moveSlots;
			for (const pm of p.moves) {
				const ms = (simP.moveSlots.find(m => m.id === pm.id)) || slots.find(m => m.id === pm.id);
				if (ms) pm.pp = Math.max(0, Math.min(ms.pp, pm.pp));
			}
			// objetos consumidos (bayas, gemas...) se pierden; los robados o quitados vuelven
			if (p.item && !simP.item && simP.lastItem === p.item && CONSUMABLE.test(p.item)) p.item = '';
			if (simP.fainted) addHappy(p, -1);
		}
		const summary = { result: this.result, caught: this.caught, levelUps: this.levelUps, money: 0, leveled: [...(this.leveled || [])] };
		G.stats.battles = (G.stats.battles || 0) + 1;
		if (!this.wild && this.result === 'win' && this.trainer) {
			const lastLv = Math.max(...this.foes.map(f => f.lv));
			let money = this.trainer.reward ?? (this.trainer.base || 40) * lastLv;
			if (G.party.some(p => p.item === 'amuletcoin')) money *= 2;
			summary.money = Math.floor(money);
			G.player.money += summary.money;
		}
		if (this.result === 'lose') {
			const mult = [8, 16, 24, 36, 48, 64, 80, 100, 120][Math.min(8, G.player.badges.length)];
			const maxLv = Math.max(1, ...G.party.map(p => p.lv));
			const lost = Math.min(G.player.money, mult * maxLv);
			G.player.money -= lost;
			summary.money = -lost;
		}
		if (this.wild && this.result === 'win' && G.party.some(p => p.item === 'amuletcoin')) { /* nada */ }
		return summary;
	}
}

/** Crea instancias de Pokémon rivales a partir de la definición de un entrenador. */
export function buildTrainerTeam(def, createPokemon) {
	return def.team.map(m => {
		const inst = createPokemon(m.sp, {
			level: m.lv, moves: m.moves, nature: m.nature || 'serious', ability: m.ability, item: m.item,
			ivs: m.ivs || { hp: m.iv ?? 20, atk: m.iv ?? 20, def: m.iv ?? 20, spa: m.iv ?? 20, spd: m.iv ?? 20, spe: m.iv ?? 20 },
			evs: m.evs, gender: m.gender, shiny: !!m.shiny, nick: m.nick, tera: m.tera, gmax: m.gmax,
			happy: m.happy ?? 160,
		});
		return inst;
	});
}
