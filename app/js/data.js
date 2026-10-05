// Datos del juego: Pokédex, movimientos, objetos, etc. (generados por herramientas/build-data.ts)
export const D = {
	species: {}, learnsets: {}, moves: {}, abilities: {}, items: {}, types: {}, natures: {}, growth: {},
};

export async function loadData(base = './data/') {
	const names = ['species', 'learnsets', 'moves', 'abilities', 'items', 'types', 'natures', 'growth'];
	const res = await Promise.all(names.map(n => fetch(base + n + '.json').then(r => {
		if (!r.ok) throw new Error('No se pudo cargar ' + n);
		return r.json();
	})));
	names.forEach((n, i) => { D[n] = res[i]; });
	// índice por número de Pokédex (forma base)
	D.byNum = {};
	for (const id in D.species) {
		const s = D.species[id];
		if (!s.base && !s.battleOnly && !D.byNum[s.num]) D.byNum[s.num] = id;
	}
	return D;
}

export const toID = s => ('' + (s ?? '')).toLowerCase().replace(/[^a-z0-9]+/g, '');

export const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
export const STAT_NAMES = { hp: 'PS', atk: 'Ataque', def: 'Defensa', spa: 'At. Esp.', spd: 'Def. Esp.', spe: 'Velocidad' };

export const TYPE_COLORS = {
	Normal: '#9fa19f', Fire: '#e62829', Water: '#2980ef', Electric: '#fac000', Grass: '#3fa129', Ice: '#3dcef3',
	Fighting: '#ff8000', Poison: '#9141cb', Ground: '#915121', Flying: '#81b9ef', Psychic: '#ef4179', Bug: '#91a119',
	Rock: '#afa981', Ghost: '#704170', Dragon: '#5060e1', Dark: '#624d4e', Steel: '#60a1b8', Fairy: '#ef70ef',
	Stellar: '#40b5a5', '???': '#68a090',
};

export const sp = id => D.species[toID(id)];
export const mv = id => D.moves[toID(id)];
export const it = id => D.items[toID(id)];
export const typeName = t => D.types[t]?.name || t;
export const abilityName = a => D.abilities[toID(a)]?.name || a;
export const natureName = n => D.natures[toID(n)]?.name || n;
export const itemName = i => D.items[toID(i)]?.name || i;
export const moveName = m => D.moves[toID(m)]?.name || m;
export const speciesName = s => D.species[toID(s)]?.name || s;

/** Multiplicador de efectividad de un tipo de ataque contra una lista de tipos. */
export function effectiveness(atkType, defTypes) {
	let m = 1;
	for (const t of defTypes) {
		const v = D.types[t]?.dmg?.[atkType];
		if (v === 1) m *= 2; else if (v === 2) m *= 0.5; else if (v === 3) m *= 0;
	}
	return m;
}

/** EXP total necesaria para alcanzar un nivel según curva de crecimiento. */
export function expForLevel(growth, level) {
	const g = D.growth[growth] || D.growth.medium;
	if (level <= 1) return 0;
	if (level >= 100) return g[100];
	return g[level];
}
