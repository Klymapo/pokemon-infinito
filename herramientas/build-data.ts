/**
 * Genera app/data/*.json a partir de:
 *  - Pokémon Showdown (MIT): stats, tipos, habilidades, movimientos, learnsets, evoluciones, textos en español
 *  - PokeAPI (BSD): ratio de captura, curva de crecimiento, EXP base, EVs, nombres y textos de Pokédex en español
 *
 * Uso:  bun herramientas/build-data.ts <ruta-pokemon-showdown> <ruta-pokeapi>
 *   (clonar: git clone --depth 1 https://github.com/smogon/pokemon-showdown
 *            git clone --depth 1 --filter=blob:none --sparse https://github.com/PokeAPI/pokeapi && git sparse-checkout set data/v2/csv)
 */
import * as fs from 'fs';
import * as path from 'path';

const PS = process.argv[2] || '/home/claude/ps';
const PA = path.join(process.argv[3] || '/home/claude/pokeapi', 'data/v2/csv');
const OUT = path.join(import.meta.dir, '../app/data');
fs.mkdirSync(OUT, { recursive: true });

const toID = (s: any) => ('' + s).toLowerCase().replace(/[^a-z0-9]+/g, '');
const imp = async (f: string) => await import(path.join(PS, 'data', f));

const { Pokedex } = await imp('pokedex.ts');
const { Moves } = await imp('moves.ts');
const { Abilities } = await imp('abilities.ts');
const { Items } = await imp('items.ts');
const { Learnsets } = await imp('learnsets.ts');
const { FormatsData } = await imp('formats-data.ts');
const { TypeChart } = await imp('typechart.ts');
const { Natures } = await imp('natures.ts');
const esPokedex = (await imp('text/es/pokedex.ts')).PokedexText;
const esMoves = (await imp('text/es/moves.ts')).MovesText;
const esAbil = (await imp('text/es/abilities.ts')).AbilitiesText;
const esItems = (await imp('text/es/items.ts')).ItemsText;
const enMoves = (await imp('text/moves.ts')).MovesText;
const enAbil = (await imp('text/abilities.ts')).AbilitiesText;
const enItems = (await imp('text/items.ts')).ItemsText;

// ---------- CSV ----------
function csv(name: string): Record<string, string>[] {
	const txt = fs.readFileSync(path.join(PA, name + '.csv'), 'utf8');
	const rows: string[][] = [];
	let row: string[] = [], cur = '', q = false;
	for (let i = 0; i < txt.length; i++) {
		const c = txt[i];
		if (q) {
			if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
		} else if (c === '"') q = true;
		else if (c === ',') { row.push(cur); cur = ''; }
		else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
		else if (c !== '\r') cur += c;
	}
	if (cur || row.length) { row.push(cur); rows.push(row); }
	const head = rows.shift()!;
	return rows.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
const ES = '7';
const clean = (s: string) => s.replace(/\s*\n\s*/g, ' ').replace(/­ /g, '').replace(/­/g, '').replace(/\s+/g, ' ').trim();

// Text from "Official flavor text" comments in the Spanish Showdown files
function officialFlavor(file: string): Record<string, string> {
	const src = fs.readFileSync(path.join(PS, 'data/text/es', file), 'utf8');
	const out: Record<string, string> = {};
	let curId = '';
	for (const line of src.split('\n')) {
		const m = line.match(/^\t([a-z0-9]+): \{/);
		if (m) curId = m[1];
		const f = line.match(/Official flavor text: "(.*)"/);
		if (f && curId && !out[curId]) out[curId] = f[1];
	}
	return out;
}
const moveFlavorEs = officialFlavor('moves.ts');
const abilFlavorEs = officialFlavor('abilities.ts');
const itemFlavorEs = officialFlavor('items.ts');

// ---------- PokeAPI tables ----------
const paSpecies = new Map(csv('pokemon_species').map(r => [r.id, r]));
const paPokemon = csv('pokemon');
const paPokemonById = new Map(paPokemon.map(r => [r.id, r]));
const paPokemonByIdent = new Map(paPokemon.map(r => [toID(r.identifier), r]));
const statRows = csv('pokemon_stats');
const evYield = new Map<string, number[]>();
for (const r of statRows) {
	const a = evYield.get(r.pokemon_id) || [0, 0, 0, 0, 0, 0];
	a[+r.stat_id - 1] = +r.effort; evYield.set(r.pokemon_id, a);
}
const speciesNameEs = new Map<string, { name: string, genus: string }>();
for (const r of csv('pokemon_species_names')) if (r.local_language_id === ES) speciesNameEs.set(r.pokemon_species_id, { name: r.name, genus: r.genus });
const flavorEs = new Map<string, { v: number, t: string }>();
for (const r of csv('pokemon_species_flavor_text')) {
	if (r.language_id !== ES) continue;
	const prev = flavorEs.get(r.species_id);
	if (!prev || +r.version_id > prev.v) flavorEs.set(r.species_id, { v: +r.version_id, t: clean(r.flavor_text) });
}
const growthIds: Record<string, string> = { '1': 'slow', '2': 'medium', '3': 'fast', '4': 'mediumslow', '5': 'erratic', '6': 'fluctuating' };
const habitats = new Map(csv('pokemon_habitats').map(r => [r.id, r.identifier]));

// ---------- Species ----------
const species: Record<string, any> = {};
let missingPA = 0;
for (const id in Pokedex) {
	const s = Pokedex[id];
	if (s.num <= 0 || !s.baseStats) continue; // CAP / custom / cosmetic formes
	const fd = FormatsData[id] || {};
	if (fd.isNonstandard === 'CAP' || fd.isNonstandard === 'Custom' || fd.isNonstandard === 'LGPE') continue;
	const battleOnly = !!s.battleOnly || /-(Mega|Gmax|Primal|Ultra|Eternamax|Stellar|Terastal|Totem)/.test(s.name) || !!s.isMega;
	const baseId = toID(s.baseSpecies || s.name);
	const pas = paSpecies.get(String(s.num));
	const pap = paPokemonByIdent.get(id) || paPokemonByIdent.get(toID(s.name.replace(/-/g, ' '))) || paPokemonById.get(String(s.num));
	if (!pas || !pap) missingPA++;
	const esName = speciesNameEs.get(String(s.num));
	let name = esPokedex[id]?.name || esName?.name || s.name;
	if (s.forme && !esPokedex[id]?.name) name = (esName?.name || s.baseSpecies) + (s.forme ? ' (' + s.forme + ')' : '');
	species[id] = {
		num: s.num,
		pid: pap ? +pap.id : s.num,
		name,
		nameEn: s.name,
		base: baseId !== id ? baseId : undefined,
		forme: s.forme || undefined,
		battleOnly: battleOnly || undefined,
		types: s.types,
		bs: [s.baseStats.hp, s.baseStats.atk, s.baseStats.def, s.baseStats.spa, s.baseStats.spd, s.baseStats.spe],
		abil: s.abilities,
		gender: s.gender || undefined,
		gr: s.genderRatio ? s.genderRatio.F : undefined,
		prevo: s.prevo ? toID(s.prevo) : undefined,
		evos: s.evos?.map(toID),
		evoType: s.evoType, evoLevel: s.evoLevel, evoItem: s.evoItem ? toID(s.evoItem) : undefined,
		evoCondition: s.evoCondition, evoMove: s.evoMove ? toID(s.evoMove) : undefined, evoRegion: s.evoRegion,
		otherFormes: s.otherFormes?.map(toID),
		reqItem: s.requiredItem ? toID(s.requiredItem) : (s.requiredItems ? s.requiredItems.map(toID) : undefined),
		canGmax: s.canGigantamax ? true : undefined,
		cannotDynamax: s.cannotDynamax || undefined,
		hw: [s.heightm, s.weightkg],
		eggs: s.eggGroups,
		color: s.color,
		tags: s.tags,
		catch: pas ? +pas.capture_rate : 45,
		happy: pas ? +pas.base_happiness : 50,
		growth: pas ? growthIds[pas.growth_rate_id] : 'medium',
		legend: pas && (pas.is_legendary === '1' || pas.is_mythical === '1') ? (pas.is_mythical === '1' ? 'mythical' : 'legendary') : undefined,
		baby: pas?.is_baby === '1' || undefined,
		habitat: pas?.habitat_id ? habitats.get(pas.habitat_id) : undefined,
		bexp: pap ? +pap.base_experience || 60 : 60,
		ev: pap ? evYield.get(pap.id) : [0, 0, 0, 0, 0, 0],
		genus: esName?.genus,
		dex: flavorEs.get(String(s.num))?.t,
		gen: s.gen || (s.num <= 151 ? 1 : s.num <= 251 ? 2 : s.num <= 386 ? 3 : s.num <= 493 ? 4 : s.num <= 649 ? 5 : s.num <= 721 ? 6 : s.num <= 809 ? 7 : s.num <= 905 ? 8 : 9),
		nonstd: fd.isNonstandard || undefined,
	};
}
console.log('species', Object.keys(species).length, 'missing pokeapi rows', missingPA);

// ---------- Learnsets ----------
// For each move keep the most recent generation's sources. Level-up moves come from the newest gen with level-up data.
const learnsets: Record<string, any> = {};
function lsFor(id: string): any {
	let l = Learnsets[id]?.learnset;
	if (!l) {
		const s = Pokedex[id];
		const from = s?.changesFrom || s?.baseSpecies;
		if (from && toID(from) !== id) return lsFor(toID(from));
		return null;
	}
	return l;
}
for (const id in species) {
	if (species[id].battleOnly) continue;
	const l = lsFor(id);
	if (!l) continue;
	let bestGenL = 0;
	for (const m in l) for (const src of l[m]) if (src[1] === 'L') bestGenL = Math.max(bestGenL, +src[0]);
	const lv: [number, string][] = [], tm: string[] = [], egg: string[] = [], tutor: string[] = [];
	for (const m in l) {
		if (!Moves[m] || Moves[m].isNonstandard === 'CAP') continue;
		for (const src of l[m]) {
			if (+src[0] === bestGenL && src[1] === 'L') lv.push([+src.slice(2), m]);
		}
		const srcs = l[m] as string[];
		if (srcs.some(x => x[1] === 'M')) tm.push(m);
		if (srcs.some(x => x[1] === 'E')) egg.push(m);
		if (srcs.some(x => x[1] === 'T')) tutor.push(m);
	}
	lv.sort((a, b) => a[0] - b[0]);
	learnsets[id] = { lv, tm, egg, tutor };
}
console.log('learnsets', Object.keys(learnsets).length);

// ---------- Moves ----------
const paMoveDescEs = new Map<string, { v: number, t: string }>();
const paMoveIdent = new Map(csv('moves').map(r => [r.id, toID(r.identifier)]));
for (const r of csv('move_flavor_text')) {
	if (r.language_id !== ES) continue;
	const k = paMoveIdent.get(r.move_id)!;
	const prev = paMoveDescEs.get(k);
	if (!prev || +r.version_group_id > prev.v) paMoveDescEs.set(k, { v: +r.version_group_id, t: clean(r.flavor_text) });
}
const paMoveNameEs = new Map<string, string>();
for (const r of csv('move_names')) if (r.local_language_id === ES) paMoveNameEs.set(paMoveIdent.get(r.move_id)!, r.name);
const moves: Record<string, any> = {};
for (const id in Moves) {
	const m = Moves[id];
	if (m.isNonstandard === 'CAP' || m.isNonstandard === 'Custom' || m.isNonstandard === 'LGPE') continue;
	moves[id] = {
		name: esMoves[id]?.name || paMoveNameEs.get(id) || m.name,
		nameEn: m.name,
		type: m.type, cat: m.category, bp: m.basePower, acc: m.accuracy === true ? 0 : m.accuracy, pp: m.pp,
		prio: m.priority || undefined,
		target: m.target,
		z: m.isZ ? toID(m.isZ) : undefined, max: m.isMax || undefined,
		desc: moveFlavorEs[id] || paMoveDescEs.get(id)?.t || enMoves[id]?.shortDesc || enMoves[id]?.desc || '',
		flags: Object.keys(m.flags || {}).join(',') || undefined,
		nonstd: m.isNonstandard || undefined,
	};
}
console.log('moves', Object.keys(moves).length);

// ---------- Abilities ----------
const paAbIdent = new Map(csv('abilities').map(r => [r.id, toID(r.identifier)]));
const paAbNameEs = new Map<string, string>();
for (const r of csv('ability_names')) if (r.local_language_id === ES) paAbNameEs.set(paAbIdent.get(r.ability_id)!, r.name);
// Descripción oficial en español de PokeAPI (la versión de juego más reciente)
const paAbFlavor = new Map<string, { v: number; t: string }>();
for (const r of csv('ability_flavor_text')) {
	if (r.language_id !== ES) continue;
	const id = paAbIdent.get(r.ability_id)!, v = +r.version_group_id;
	if (!paAbFlavor.has(id) || paAbFlavor.get(id)!.v < v) paAbFlavor.set(id, { v, t: r.flavor_text.replace(/\s+/g, ' ').trim() });
}
const abilities: Record<string, any> = {};
for (const id in Abilities) {
	const a = Abilities[id];
	if (a.isNonstandard === 'CAP') continue;
	abilities[id] = {
		name: esAbil[id]?.name || paAbNameEs.get(id) || a.name,
		desc: abilFlavorEs[id] || paAbFlavor.get(id)?.t || enAbil[id]?.shortDesc || '',
	};
}

// ---------- Items ----------
const paItems = csv('items');
const paItemById = new Map(paItems.map(r => [r.id, r]));
const cats = new Map(csv('item_categories').map(r => [r.id, r]));
const pockets = new Map(csv('item_pockets').map(r => [r.id, r.identifier]));
const paItemNameEs = new Map<string, string>();
for (const r of csv('item_names')) if (r.local_language_id === ES) paItemNameEs.set(r.item_id, r.name);
const paItemDescEs = new Map<string, { v: number, t: string }>();
for (const r of csv('item_flavor_text')) {
	if (r.language_id !== ES) continue;
	const prev = paItemDescEs.get(r.item_id);
	if (!prev || +r.version_group_id > prev.v) paItemDescEs.set(r.item_id, { v: +r.version_group_id, t: clean(r.flavor_text) });
}
const items: Record<string, any> = {};
for (const r of paItems) {
	const id = toID(r.identifier);
	const cat = cats.get(r.category_id);
	items[id] = {
		name: esItems[id]?.name || paItemNameEs.get(r.id) || r.identifier,
		cat: cat?.identifier,
		pocket: cat ? pockets.get(cat.pocket_id) : 'misc',
		cost: +r.cost || 0,
		desc: itemFlavorEs[id] || paItemDescEs.get(r.id)?.t || '',
		ic: r.identifier, // nombre del icono en PokeAPI/sprites/items
	};
}
for (const id in Items) {
	const it = Items[id];
	if (it.isNonstandard === 'CAP') continue;
	const prev = items[id] || {};
	items[id] = {
		...prev,
		name: esItems[id]?.name || prev.name || it.name,
		desc: prev.desc || itemFlavorEs[id] || enItems[id]?.shortDesc || '',
		pocket: prev.pocket || (it.isBerry ? 'berries' : it.megaStone || it.zMove ? 'battle' : 'misc'),
		battle: true,
		mega: it.megaStone ? Object.values(it.megaStone).map(toID) : undefined,
		z: it.zMove ? (it.zMoveType || true) : undefined,
		berry: it.isBerry || undefined,
		fling: it.fling?.basePower,
	};
}
console.log('items', Object.keys(items).length);

// ---------- Types, natures, growth ----------
const paTypes = new Map(csv('types').map(r => [r.id, r.identifier]));
const typeNamesEs: Record<string, string> = {};
for (const r of csv('type_names')) if (r.local_language_id === ES) {
	const t = paTypes.get(r.type_id)!; typeNamesEs[t[0].toUpperCase() + t.slice(1)] = r.name;
}
typeNamesEs['Stellar'] = typeNamesEs['Stellar'] || 'Astral';
const types: Record<string, any> = {};
for (const id in TypeChart) {
	const T = id[0].toUpperCase() + id.slice(1);
	types[T] = { name: typeNamesEs[T] || T, dmg: TypeChart[id].damageTaken };
}
const paNat = new Map(csv('natures').map(r => [r.id, toID(r.identifier)]));
const natures: Record<string, any> = {};
for (const r of csv('nature_names')) if (r.local_language_id === ES) {
	const id = paNat.get(r.nature_id)!;
	if (Natures[id]) natures[id] = { name: r.name, plus: Natures[id].plus, minus: Natures[id].minus, en: Natures[id].name };
}
const growth: Record<string, number[]> = {};
for (const r of csv('experience')) {
	const g = growthIds[r.growth_rate_id];
	(growth[g] ||= [])[+r.level] = +r.experience;
}

const write = (name: string, obj: any) => {
	fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(obj));
	console.log(name, (fs.statSync(path.join(OUT, name + '.json')).size / 1024).toFixed(0) + 'KB');
};
write('species', species);
write('learnsets', learnsets);
write('moves', moves);
write('abilities', abilities);
write('items', items);
write('types', types);
write('natures', natures);
write('growth', growth);
