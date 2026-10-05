// IA de entrenadores. Niveles 1 (novato) a 5 (jefe).
// Trabaja directamente con objetos del simulador de Showdown.

const ABILITY_IMMUNE = {
	Ground: ['levitate', 'eartheater'],
	Fire: ['flashfire', 'wellbakedbody'],
	Water: ['waterabsorb', 'stormdrain', 'dryskin'],
	Electric: ['voltabsorb', 'lightningrod', 'motordrive'],
	Grass: ['sapsipper'],
};

function hasAbility(p, ids) {
	const a = p.getAbility?.()?.id || p.ability;
	return ids.includes(a);
}

export function typeMult(battle, type, def) {
	if (!battle.dex.getImmunity(type, def)) return 0;
	if (ABILITY_IMMUNE[type] && hasAbility(def, ABILITY_IMMUNE[type])) return 0;
	if (type === 'Ground' && def.hasItem?.('airballoon')) return 0;
	const e = battle.dex.getEffectiveness(type, def);
	let m = Math.pow(2, e);
	if (hasAbility(def, ['wonderguard']) && m <= 1) return 0;
	if (hasAbility(def, ['thickfat']) && (type === 'Fire' || type === 'Ice')) m *= 0.5;
	return m;
}

/** Daño estimado (promedio) de `atk` usando `moveId` contra `def`. Devuelve PS. */
export function estDamage(battle, atk, def, moveId) {
	const move = battle.dex.moves.get(moveId);
	if (!move.exists || move.category === 'Status') return 0;
	const L = atk.level;
	// daño fijo
	if (move.damage === 'level') return typeMult(battle, move.type, def) ? L : 0;
	if (typeof move.damage === 'number') return typeMult(battle, move.type, def) ? move.damage : 0;
	if (move.id === 'superfang' || move.id === 'ruination' || move.id === 'naturesmadness') return Math.floor(def.hp / 2);
	if (move.ohko) return typeMult(battle, move.type, def) && L >= def.level ? def.hp * 0.3 : 0;
	let bp = move.basePower || 60;
	switch (move.id) {
	case 'eruption': case 'waterspout': case 'dragonenergy': bp = Math.max(1, Math.floor(150 * atk.hp / atk.maxhp)); break;
	case 'reversal': case 'flail': { const r = atk.hp / atk.maxhp; bp = r < 0.042 ? 200 : r < 0.105 ? 150 : r < 0.209 ? 100 : r < 0.355 ? 80 : r < 0.688 ? 40 : 20; break; }
	case 'acrobatics': if (!atk.item) bp *= 2; break;
	case 'facade': if (atk.status) bp *= 2; break;
	case 'hex': if (def.status) bp *= 2; break;
	case 'knockoff': if (def.item) bp *= 1.5; break;
	case 'venoshock': if (def.status === 'psn' || def.status === 'tox') bp *= 2; break;
	case 'brine': if (def.hp * 2 <= def.maxhp) bp *= 2; break;
	case 'lowkick': case 'grassknot': { const w = def.getWeight() / 10; bp = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20; break; }
	case 'return': bp = 102; break;
	case 'frustration': bp = 30; break;
	case 'storedpower': case 'powertrip': bp = 20 + 20 * Object.values(atk.boosts).reduce((s, b) => s + Math.max(0, b), 0); break;
	}
	const physical = move.category === 'Physical' || move.id === 'psyshock' || move.id === 'psystrike' || move.id === 'secretsword';
	let A = move.id === 'foulplay' ? def.getStat('atk', false, true) : move.id === 'bodypress' ? atk.getStat('def', false, true) : atk.getStat(move.category === 'Physical' ? 'atk' : 'spa', false, true);
	let D = def.getStat(physical ? 'def' : 'spd', false, true);
	let type = move.type;
	const ab = atk.getAbility?.()?.id;
	if (type === 'Normal' && ab === 'pixilate') type = 'Fairy';
	if (type === 'Normal' && ab === 'aerilate') type = 'Flying';
	if (type === 'Normal' && ab === 'refrigerate') type = 'Ice';
	if (type === 'Normal' && ab === 'galvanize') type = 'Electric';
	const eff = typeMult(battle, type, def);
	if (!eff) return 0;
	let dmg = Math.floor(Math.floor(Math.floor(2 * L / 5 + 2) * bp * A / Math.max(1, D)) / 50) + 2;
	const types = atk.getTypes();
	if (types.includes(type)) dmg *= ab === 'adaptability' ? 2 : 1.5;
	dmg *= eff;
	if (atk.status === 'brn' && move.category === 'Physical' && ab !== 'guts') dmg *= 0.5;
	const w = battle.field.effectiveWeather?.() || battle.field.weather;
	if (w === 'raindance' || w === 'primordialsea') { if (type === 'Water') dmg *= 1.5; if (type === 'Fire') dmg *= 0.5; }
	if (w === 'sunnyday' || w === 'desolateland') { if (type === 'Fire') dmg *= 1.5; if (type === 'Water') dmg *= 0.5; }
	const item = atk.getItem?.()?.id;
	if (item === 'choiceband' && move.category === 'Physical') dmg *= 1.5;
	if (item === 'choicespecs' && move.category === 'Special') dmg *= 1.5;
	if (item === 'lifeorb') dmg *= 1.3;
	if (item === 'expertbelt' && eff > 1) dmg *= 1.2;
	if (ab === 'technician' && bp <= 60) dmg *= 1.5;
	if (ab === 'hugepower' || ab === 'purepower') { if (move.category === 'Physical') dmg *= 2; }
	if (move.multihit) dmg *= Array.isArray(move.multihit) ? (ab === 'skilllink' ? move.multihit[1] : 3) : move.multihit;
	return dmg * 0.925;
}

const STATUS_SETUP = new Set(['swordsdance', 'nastyplot', 'calmmind', 'dragondance', 'bulkup', 'quiverdance', 'shellsmash', 'irondefense', 'agility', 'rockpolish', 'workup', 'growth', 'howl', 'coil', 'shiftgear', 'curse', 'tailglow', 'victorydance', 'tidyup', 'defensecurl', 'amnesia', 'cottonguard', 'acidarmor', 'barrier', 'harden', 'withdraw', 'focusenergy', 'meditate', 'sharpen', 'charge']);
const STATUS_INFLICT = { thunderwave: 'par', glare: 'par', stunspore: 'par', nuzzle: 'par', willowisp: 'brn', toxic: 'tox', poisonpowder: 'psn', poisongas: 'psn', spore: 'slp', sleeppowder: 'slp', hypnosis: 'slp', sing: 'slp', yawn: 'slp', lovelykiss: 'slp', grasswhistle: 'slp', darkvoid: 'slp', confuseray: 'conf', supersonic: 'conf', swagger: 'conf', attract: 'attract' };
const HEALING = new Set(['recover', 'roost', 'softboiled', 'milkdrink', 'slackoff', 'synthesis', 'moonlight', 'morningsun', 'shoreup', 'rest', 'wish', 'healorder', 'strengthsap', 'junglehealing', 'lunarblessing']);
const HAZARDS = { stealthrock: 'stealthrock', spikes: 'spikes', toxicspikes: 'toxicspikes', stickyweb: 'stickyweb' };

function canStatus(battle, target, st) {
	if (st === 'conf') return !target.volatiles.confusion;
	if (st === 'attract') return !target.volatiles.attract;
	if (target.status) return false;
	const t = target.getTypes();
	if (st === 'par' && t.includes('Electric')) return false;
	if (st === 'brn' && t.includes('Fire')) return false;
	if ((st === 'psn' || st === 'tox') && (t.includes('Poison') || t.includes('Steel'))) return false;
	if (battle.field.terrain === 'mistyterrain' || battle.field.terrain === 'electricterrain' && st === 'slp') return false;
	return true;
}

/** Puntuación de cada movimiento utilizable. */
export function scoreMoves(battle, me, foe, level) {
	const req = me.getMoveRequestData();
	const out = [];
	const foeHp = Math.max(1, foe.hp);
	req.moves.forEach((m, i) => {
		if (m.disabled || (m.pp !== undefined && m.pp <= 0)) return;
		const move = battle.dex.moves.get(m.id);
		let score = 0;
		if (move.category !== 'Status') {
			const d = estDamage(battle, me, foe, m.id);
			const acc = move.accuracy === true ? 1 : move.accuracy / 100;
			score = Math.min(1.2, d / foeHp) * 100 * acc;
			if (d >= foeHp) score += 40 * acc + (move.priority > 0 ? 30 : 0);
			if (move.priority > 0 && foe.hp / foe.maxhp < 0.3) score += 15;
			if (move.recoil || move.mindBlownRecoil) score -= 8;
			if (move.selfdestruct) score = me.hp / me.maxhp < 0.25 ? score : score * 0.2;
			if (move.flags?.charge && !me.hasItem?.('powerherb')) score *= 0.6;
			if (move.self?.volatileStatus === 'mustrecharge') score *= 0.75;
			if (d === 0) score = -50;
		} else {
			const hpR = me.hp / me.maxhp;
			if (STATUS_SETUP.has(move.id)) {
				const boosted = Object.values(me.boosts).reduce((s, b) => s + b, 0);
				score = hpR > 0.7 && boosted < 2 ? 45 : hpR > 0.5 && boosted < 1 ? 25 : 2;
			} else if (STATUS_INFLICT[move.id]) {
				const st = STATUS_INFLICT[move.id];
				if (move.flags?.powder && foe.getTypes().includes('Grass')) score = -20;
				else score = canStatus(battle, foe, st) ? (st === 'slp' ? 55 : st === 'par' ? 45 : st === 'tox' || st === 'brn' ? 40 : 25) : -20;
				if (move.accuracy !== true) score *= move.accuracy / 100;
			} else if (HEALING.has(move.id)) {
				score = hpR < 0.4 ? 70 : hpR < 0.6 ? 35 : -10;
			} else if (HAZARDS[move.id]) {
				const sc = foe.side.sideConditions;
				score = sc[HAZARDS[move.id]] ? -10 : 30;
			} else if (move.id === 'protect' || move.id === 'detect' || move.id === 'spikyshield' || move.id === 'kingsshield' || move.id === 'banefulbunker') {
				score = me.volatiles.stall ? -20 : 12;
			} else {
				score = 10;
			}
		}
		out.push({ i, id: m.id, move, score });
	});
	return out;
}

function noise(level) { return (6 - level) * 10 * Math.random(); }

/** Mejor reemplazo del banco contra `foe`. */
export function bestSwitch(battle, side, foe, excludeActive = true) {
	let best = null, bestScore = -Infinity;
	side.pokemon.forEach((p, idx) => {
		if (p.fainted || (excludeActive && p.isActive) || p.hp <= 0) return;
		const foeTypes = foe.getTypes();
		// cuánto daño le hace al rival y cuánto recibe (aprox. por tipos)
		let off = 0;
		for (const m of p.moveSlots) {
			const d = estDamage(battle, p, foe, m.id);
			off = Math.max(off, d / Math.max(1, foe.hp));
		}
		let def = 0;
		for (const t of foeTypes) def = Math.max(def, typeMult(battle, t, p));
		const score = off * 100 - def * 35 + (p.hp / p.maxhp) * 20;
		if (score > bestScore) { bestScore = score; best = idx; }
	});
	return best === null ? null : { idx: best, score: bestScore };
}

/**
 * Decide la acción de la IA.
 * opts: {level, gimmick:'mega'|'z'|'dynamax'|'tera'|null, gimmickUsed, ace, items:[{id,n}], wild}
 * Devuelve {choice:'move 2 mega'} | {item:'hyperpotion'} | {choice:'switch 3'}
 */
export function decide(battle, sideId, opts) {
	try { return decideInner(battle, sideId, opts); } catch (e) { console.warn('IA: error, uso movimiento 1', e?.message); return { choice: battle[sideId].activeRequest?.forceSwitch ? 'switch ' + (battle[sideId].pokemon.findIndex(p => !p.fainted && !p.isActive) + 1) : 'move 1' }; }
}
function decideInner(battle, sideId, opts) {
	const side = battle[sideId];
	const foeSide = side.foe;
	const me = side.active[0];
	const foe = foeSide.active[0];
	const req = side.activeRequest;
	const level = opts.level || 1;
	if (!req || req.wait) return null;
	if (req.forceSwitch) {
		const bs = level >= 3 ? bestSwitch(battle, side, foe) : null;
		if (bs) return { choice: 'switch ' + (bs.idx + 1) };
		const idx = side.pokemon.findIndex(p => !p.fainted && !p.isActive && p.hp > 0);
		return { choice: 'switch ' + (idx + 1) };
	}
	const active = req.active?.[0];
	if (!active) return { choice: 'move 1' };
	// Movimiento bloqueado (Enfado, recarga...)
	if (active.moves.length === 1 && (active.trapped || active.moves[0].id === 'struggle' || active.moves[0].id === 'recharge')) return { choice: 'move 1' };

	// Objetos curativos (nivel 3+)
	if (!opts.wild && level >= 3 && opts.items?.length && me.hp / me.maxhp < 0.28 && me.hp > 0) {
		const foeBest = Math.max(0, ...foe.moveSlots.map(m => estDamage(battle, foe, me, m.id)));
		const myBest = Math.max(0, ...me.moveSlots.map(m => estDamage(battle, me, foe, m.id)));
		const iKO = myBest >= foe.hp && me.getStat('spe', false, true) >= foe.getStat('spe', false, true);
		if (!iKO && foeBest < me.maxhp * 0.6) {
			const itm = opts.items.find(x => x.n > 0);
			if (itm) return { item: itm.id };
		}
	}

	const scored = scoreMoves(battle, me, foe, level);

	// Cambio defensivo (nivel 4+)
	if (!opts.wild && level >= 4 && !active.trapped && !active.maybeTrapped && !opts.switchedLastTurn) {
		const myBest = scored.length ? Math.max(...scored.map(s => s.score)) : 0;
		let danger = 0;
		for (const t of foe.getTypes()) danger = Math.max(danger, typeMult(battle, t, me));
		if (danger >= 2 && myBest < 60 && Math.random() < (level >= 5 ? 0.7 : 0.45)) {
			const bs = bestSwitch(battle, side, foe);
			if (bs && bs.score > 40) return { choice: 'switch ' + (bs.idx + 1), switched: true };
		}
	}

	if (!scored.length) return { choice: 'move 1' };
	let chosen;
	if (opts.wild || level <= 1) {
		// aleatorio, con algo de preferencia por movimientos de daño
		const pool = scored.filter(s => s.score > -20);
		const tot = pool.reduce((s, x) => s + Math.max(5, x.score), 0);
		let r = Math.random() * tot;
		chosen = pool.find(x => (r -= Math.max(5, x.score)) < 0) || pool[0] || scored[0];
	} else {
		for (const s of scored) s.final = s.score + noise(level);
		scored.sort((a, b) => b.final - a.final);
		chosen = level === 2 && Math.random() < 0.35 ? scored[Math.floor(Math.random() * scored.length)] : scored[0];
	}
	let choice = 'move ' + (chosen.i + 1);
	// Mecánicas (Mega/Z/Dinamax/Tera)
	if (opts.gimmick && !opts.gimmickUsed) {
		const isAce = opts.ace ? me.species.baseSpecies.toLowerCase().replace(/[^a-z0-9]/g, '') === opts.ace || me.name === opts.ace : side.pokemonLeft === 1;
		if (isAce) {
			if (opts.gimmick === 'mega' && active.canMegaEvo) choice += ' mega';
			else if (opts.gimmick === 'tera' && active.canTerastallize) choice += ' terastallize';
			else if (opts.gimmick === 'dynamax' && active.canDynamax) choice += ' dynamax';
			else if (opts.gimmick === 'z' && active.canZMove) {
				const zi = active.canZMove.findIndex(z => z);
				if (zi >= 0) choice = 'move ' + (zi + 1) + ' zmove';
			}
		}
	}
	return { choice };
}
