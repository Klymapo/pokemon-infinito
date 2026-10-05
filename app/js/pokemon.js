// Instancias de Pokémon del jugador: creación, stats, experiencia, movimientos, evolución.
import { D, toID, STATS, expForLevel, sp } from './data.js';
import { rng, rint, pick } from './util.js';

let uidCounter = Date.now() % 1e9;
export const newUid = () => 'p' + (uidCounter++).toString(36) + rint(0, 1295).toString(36);

const NATURE_IDS = () => Object.keys(D.natures);

/** Movimientos por defecto a cierto nivel: los últimos 4 aprendibles por nivel (como en los juegos). */
export function defaultMoves(speciesId, level) {
	const ls = learnsetOf(speciesId);
	if (!ls) return ['tackle'];
	const known = [];
	for (const [lv, m] of ls.lv) {
		if (lv > level) break;
		if (lv === 0) continue; // evolución: se aprende al evolucionar
		const i = known.indexOf(m);
		if (i >= 0) known.splice(i, 1);
		known.push(m);
	}
	const res = known.slice(-4);
	return res.length ? res : (ls.lv[0] ? [ls.lv[0][1]] : ['tackle']);
}

export function learnsetOf(speciesId) {
	let id = toID(speciesId);
	for (let i = 0; i < 4 && id; i++) {
		if (D.learnsets[id]) return D.learnsets[id];
		id = D.species[id]?.base;
	}
	return null;
}

/** Movimientos que aprende exactamente al llegar a `level` (incluye nivel 0 = al evolucionar si evo=true). */
export function movesLearnedAt(speciesId, level, evo = false) {
	const ls = learnsetOf(speciesId);
	if (!ls) return [];
	return ls.lv.filter(([lv]) => lv === level || (evo && lv === 0)).map(x => x[1]);
}

export function canLearn(speciesId, moveId) {
	const ls = learnsetOf(speciesId);
	if (!ls) return false;
	moveId = toID(moveId);
	return ls.lv.some(x => x[1] === moveId) || ls.tm.includes(moveId) || ls.tutor.includes(moveId) || ls.egg.includes(moveId);
}

function rollGender(s) {
	if (s.gender) return s.gender; // 'M', 'F', 'N'
	const f = s.gr ?? 0.5;
	return rng() < f ? 'F' : 'M';
}

function rollAbility(s, opts) {
	if (opts.abilitySlot && s.abil[opts.abilitySlot]) return { abil: toID(s.abil[opts.abilitySlot]), slot: opts.abilitySlot };
	if (opts.ability) {
		const id = toID(opts.ability);
		const slot = Object.keys(s.abil).find(k => toID(s.abil[k]) === id) || '0';
		return { abil: id, slot };
	}
	const slots = ['0', '1'].filter(k => s.abil[k]);
	const slot = opts.hidden && s.abil.H ? 'H' : pick(slots);
	return { abil: toID(s.abil[slot]), slot };
}

/**
 * Crea un Pokémon.
 * opts: level, moves, nature, ability, abilitySlot, hidden, ivs, evs, shiny, item, nick, ball, gender, happy, tera, gmax, metAt, ot, minIVs
 */
export function createPokemon(speciesId, opts = {}) {
	const id = toID(speciesId);
	const s = D.species[id];
	if (!s) throw new Error('Especie desconocida: ' + speciesId);
	const level = Math.max(1, Math.min(100, opts.level || 5));
	const ivs = opts.ivs ? STATS.map((k, i) => opts.ivs[k] ?? opts.ivs[i] ?? 31) : STATS.map(() => rint(opts.minIVs || 0, 31));
	const evs = opts.evs ? STATS.map((k, i) => opts.evs[k] ?? opts.evs[i] ?? 0) : [0, 0, 0, 0, 0, 0];
	const { abil, slot } = rollAbility(s, opts);
	const moves = (opts.moves || defaultMoves(id, level)).map(m => {
		const md = D.moves[toID(m)];
		return { id: toID(m), pp: md ? md.pp : 10, ppUps: 0 };
	});
	const shinyRate = opts.shinyRate || 4096;
	const p = {
		uid: newUid(),
		sp: id,
		nick: opts.nick || '',
		lv: level,
		exp: expForLevel(s.growth, level),
		nat: toID(opts.nature) || pick(NATURE_IDS()),
		abil, abilSlot: slot,
		gender: opts.gender || rollGender(s),
		shiny: opts.shiny ?? (rint(1, shinyRate) === 1),
		ivs, evs,
		moves,
		hp: 0,
		status: '',
		item: opts.item ? toID(opts.item) : '',
		happy: opts.happy ?? s.happy ?? 50,
		ball: opts.ball || 'pokeball',
		ot: opts.ot || '',
		metAt: opts.metAt || '',
		metLv: level,
		metDate: Date.now(),
		tera: opts.tera || s.types[0],
		gmax: !!opts.gmax,
		form: opts.form || undefined,
		flags: {},
	};
	p.hp = calcStats(p).hp;
	return p;
}

export function natureMod(nat, stat) {
	const n = D.natures[nat];
	if (!n) return 1;
	if (n.plus === stat) return 1.1;
	if (n.minus === stat) return 0.9;
	return 1;
}

export function calcStats(p) {
	const s = D.species[p.sp];
	const out = {};
	STATS.forEach((st, i) => {
		const b = s.bs[i];
		if (st === 'hp') {
			out.hp = s.num === 292 ? 1 : Math.floor((2 * b + p.ivs[i] + Math.floor(p.evs[i] / 4)) * p.lv / 100) + p.lv + 10;
		} else {
			const v = Math.floor((2 * b + p.ivs[i] + Math.floor(p.evs[i] / 4)) * p.lv / 100) + 5;
			out[st] = Math.floor(v * natureMod(p.nat, st));
		}
	});
	return out;
}

export const maxHp = p => calcStats(p).hp;
export const displayName = p => p.nick || D.species[p.sp]?.name || p.sp;
export const isFainted = p => p.hp <= 0;
export const types = p => D.species[p.sp].types;

export function healFull(p) {
	p.hp = maxHp(p);
	p.status = '';
	p.sleepTurns = 0;
	for (const m of p.moves) m.pp = maxPP(m);
}
export function maxPP(m) {
	const md = D.moves[m.id];
	if (!md) return m.pp;
	if (md.pp === 1) return 1;
	return Math.floor(md.pp * (5 + (m.ppUps || 0)) / 5);
}

// ---------------- Experiencia ----------------

/** EXP ganada por derrotar a `foe` (fórmula Gen V+ escalada). */
export function expGain(winner, foe, { trainer = false, participated = true, share = false, cap = 100 } = {}) {
	const fs = D.species[foe.sp];
	const b = fs.bexp || 60;
	const L = foe.lv, Lp = winner.lv;
	let exp = (b * L / 5) * Math.pow((2 * L + 10) / (L + Lp + 10), 2.5) + 1;
	if (trainer) exp *= 1.5;
	if (!participated) exp *= share ? 0.5 : 0;
	if (winner.item === 'luckyegg') exp *= 1.5;
	if (winner.ot && winner.ot !== '__self') exp *= 1.5; // intercambiados
	if (winner.happy >= 220) exp *= 1.2;
	// tope suave: por encima del nivel recomendado del siguiente reto, casi nada
	if (winner.lv >= cap) exp *= 0.1;
	return Math.max(participated || share ? 1 : 0, Math.floor(exp));
}

/** Aplica EXP. Devuelve lista de niveles alcanzados. */
export function addExp(p, amount) {
	const s = D.species[p.sp];
	const levels = [];
	if (p.lv >= 100) return levels;
	p.exp += amount;
	while (p.lv < 100 && p.exp >= expForLevel(s.growth, p.lv + 1)) {
		const oldMax = maxHp(p);
		p.lv++;
		const newMax = maxHp(p);
		if (p.hp > 0) p.hp += newMax - oldMax;
		levels.push(p.lv);
		// amistad por subir de nivel
		addHappy(p, p.happy < 100 ? 5 : p.happy < 200 ? 3 : 2);
	}
	if (p.lv >= 100) p.exp = expForLevel(s.growth, 100);
	return levels;
}

export function expProgress(p) {
	const s = D.species[p.sp];
	if (p.lv >= 100) return 1;
	const a = expForLevel(s.growth, p.lv), b = expForLevel(s.growth, p.lv + 1);
	return Math.max(0, Math.min(1, (p.exp - a) / (b - a)));
}

export function addEVs(p, foeSpeciesId) {
	const y = D.species[foeSpeciesId]?.ev || [0, 0, 0, 0, 0, 0];
	const mult = p.item === 'machobrace' ? 2 : 1;
	let total = p.evs.reduce((a, b) => a + b, 0);
	y.forEach((v, i) => {
		let add = v * mult;
		const powerItems = ['powerweight', 'powerbracer', 'powerbelt', 'powerlens', 'powerband', 'poweranklet'];
		if (p.item === powerItems[i]) add += 8;
		add = Math.min(add, 252 - p.evs[i], 510 - total);
		if (add > 0) { p.evs[i] += add; total += add; }
	});
}

export function addHappy(p, n) {
	if (n > 0 && p.item === 'soothebell') n = Math.floor(n * 1.5);
	if (n > 0 && p.ball === 'luxuryball') n += 1;
	p.happy = Math.max(0, Math.min(255, (p.happy || 0) + n));
}

// ---------------- Evolución ----------------

/**
 * ¿Qué evolución dispara este evento? ctx: {trigger:'level'|'item'|'trade', item, time:'day'|'night', region, party}
 * Devuelve el id de la especie destino o null.
 */
export function checkEvolution(p, ctx) {
	const s = D.species[p.sp];
	if (!s.evos || p.item === 'everstone' && ctx.trigger !== 'item') return null;
	for (const evoId of s.evos) {
		const e = D.species[evoId];
		if (!e) continue;
		// formas regionales: solo evoluciona a la forma de la región si aplica
		if (e.evoRegion && ctx.region && e.evoRegion.toLowerCase() !== ctx.region.toLowerCase()) continue;
		if (!e.evoRegion && s.evos.some(x => D.species[x]?.evoRegion && ctx.region && D.species[x].evoRegion.toLowerCase() === ctx.region.toLowerCase())) continue;
		const cond = (e.evoCondition || '').toLowerCase();
		const timeOk = !cond.includes('day') && !cond.includes('night') ? true :
			(cond.includes('night') ? ctx.time === 'night' : ctx.time !== 'night');
		const genderOk = !cond.includes('female') && !cond.includes('male') ? true : (cond.includes('female') ? p.gender === 'F' : p.gender === 'M');
		switch (e.evoType) {
		case undefined:
		case null:
			if (ctx.trigger === 'level' && e.evoLevel && p.lv >= e.evoLevel && timeOk && genderOk) {
				if (cond.includes('atk') || cond.includes('def')) {
					// Tyrogue y similares
					const st = calcStats(p);
					if (cond.includes('atk > def') && !(st.atk > st.def)) continue;
					if (cond.includes('atk < def') && !(st.atk < st.def)) continue;
					if (cond.includes('atk = def') && !(st.atk === st.def)) continue;
				}
				return evoId;
			}
			break;
		case 'levelFriendship':
			if (ctx.trigger === 'level' && p.happy >= 220 && timeOk) return evoId;
			break;
		case 'levelHold':
			if (ctx.trigger === 'level' && p.item === toID(e.evoItem) && timeOk) return evoId;
			break;
		case 'levelMove':
			if (ctx.trigger === 'level' && p.moves.some(m => m.id === e.evoMove)) return evoId;
			break;
		case 'useItem':
			if (ctx.trigger === 'item' && ctx.item === e.evoItem && genderOk) return evoId;
			break;
		case 'trade':
			if (ctx.trigger === 'trade' || (ctx.trigger === 'item' && ctx.item === 'linkingcord')) return evoId;
			break;
		case 'levelExtra':
			// Condiciones especiales (lluvia, ubicación, etc.): se resuelven con "Piedra Lazo" o eventos de historia.
			if (ctx.trigger === 'item' && ctx.item === 'linkingcord') return evoId;
			break;
		case 'other':
			if (ctx.trigger === 'item' && ctx.item === 'linkingcord') return evoId;
			break;
		}
	}
	return null;
}

export function evolve(p, toId) {
	const oldMax = maxHp(p);
	const from = p.sp;
	p.sp = toId;
	const s = D.species[toId];
	// conservar la ranura de habilidad
	const ab = s.abil[p.abilSlot] || s.abil['0'];
	p.abil = toID(ab);
	const newMax = maxHp(p);
	if (p.hp > 0) p.hp += newMax - oldMax;
	if (s.num === 292) p.hp = 1;
	// Shedinja: si hay hueco y Poké Ball (se maneja fuera)
	return from;
}

// ---------------- Captura ----------------

const BALLS = {
	pokeball: 1, greatball: 1.5, ultraball: 2, masterball: 255, safariball: 1.5, sportball: 1.5,
	premierball: 1, luxuryball: 1, healball: 1, cherishball: 1, friendball: 1, heavyball: 1, levelball: 1,
	loveball: 1, lureball: 1, moonball: 1, fastball: 1, netball: 1, diveball: 1, nestball: 1, repeatball: 1,
	timerball: 1, duskball: 1, quickball: 1, dreamball: 1, beastball: 0.1, parkball: 255,
};
export const isBall = id => id in BALLS;

/**
 * Probabilidad de captura (fórmula Gen V+, sin captura crítica).
 * ctx: {ball, hp, maxhp, status, turn, time, terrain, foe(sp,lv,gender), player lead, caughtBefore, legendCap}
 */
export function catchChance(ctx) {
	const s = D.species[ctx.sp];
	let rate = s.catch ?? 45;
	let ball = BALLS[ctx.ball] ?? 1;
	const b = ctx.ball;
	if (b === 'masterball') return 1;
	if (b === 'netball' && (s.types.includes('Water') || s.types.includes('Bug'))) ball = 3.5;
	if (b === 'nestball') ball = Math.max(1, (41 - ctx.lv) / 10);
	if (b === 'repeatball' && ctx.caughtBefore) ball = 3.5;
	if (b === 'timerball') ball = Math.min(4, 1 + ctx.turn * 1229 / 4096);
	if (b === 'duskball' && (ctx.time === 'night' || ctx.terrain === 'cave')) ball = 3;
	if (b === 'quickball' && ctx.turn <= 1) ball = 5;
	if (b === 'diveball' && ctx.terrain === 'water') ball = 3.5;
	if (b === 'fastball' && s.bs[5] >= 100) ball = 4;
	if (b === 'levelball' && ctx.playerLv) ball = ctx.playerLv >= ctx.lv * 4 ? 8 : ctx.playerLv >= ctx.lv * 2 ? 4 : ctx.playerLv > ctx.lv ? 2 : 1;
	if (b === 'moonball' && ['nidoranf', 'nidorino', 'nidoranm', 'nidorina', 'clefairy', 'jigglypuff', 'skitty', 'munna'].includes(ctx.sp)) ball = 4;
	if (b === 'heavyball') {
		const w = s.hw?.[1] || 10;
		rate = Math.max(1, rate + (w >= 300 ? 30 : w >= 200 ? 20 : w >= 100 ? 0 : -20));
	}
	if (b === 'beastball' && s.tags?.includes('Ultra Beast')) ball = 5;
	if (b !== 'beastball' && s.tags?.includes('Ultra Beast')) ball *= 0.1;
	let statusB = 1;
	if (ctx.status === 'slp' || ctx.status === 'frz') statusB = 2.5;
	else if (ctx.status) statusB = 1.5;
	// Bonus por nivel bajo (Gen VIII+): ayuda en los primeros niveles
	const lowLv = ctx.lv < 13 ? (36 - 2 * ctx.lv) / 10 : 1;
	const a = ((3 * ctx.maxhp - 2 * ctx.hp) * rate * ball / (3 * ctx.maxhp)) * statusB * lowLv;
	if (a >= 255) return 1;
	const bb = 65536 / Math.pow(255 / a, 0.1875);
	return Math.pow(bb / 65536, 4);
}

/** Simula sacudidas: devuelve número de sacudidas (0..3) y si se capturó. */
export function rollCatch(chance) {
	if (chance >= 1) return { shakes: 3, caught: true };
	const per = Math.pow(chance, 1 / 4);
	let shakes = 0;
	for (; shakes < 4; shakes++) if (rng() >= per) break;
	return { shakes: Math.min(3, shakes), caught: shakes >= 4 };
}

/** Datos de un Pokémon para el simulador (formato de set de Showdown). */
export function toSimSet(p, { nickname = true } = {}) {
	const s = D.species[p.sp];
	const nat = D.natures[p.nat];
	return {
		name: nickname ? (p.nick || s.name) : s.name,
		species: s.nameEn,
		level: p.lv,
		gender: p.gender === 'N' ? '' : p.gender,
		shiny: !!p.shiny,
		ability: D.abilities[p.abil] ? p.abil : toID(s.abil['0']),
		item: p.item || '',
		nature: nat ? nat.en : 'Hardy',
		moves: p.moves.map(m => m.id),
		evs: { hp: p.evs[0], atk: p.evs[1], def: p.evs[2], spa: p.evs[3], spd: p.evs[4], spe: p.evs[5] },
		ivs: { hp: p.ivs[0], atk: p.ivs[1], def: p.ivs[2], spa: p.ivs[3], spd: p.ivs[4], spe: p.ivs[5] },
		happiness: p.happy ?? 70,
		teraType: p.tera || s.types[0],
		gigantamax: !!p.gmax,
		pokeball: p.ball,
	};
}

export { sp };
