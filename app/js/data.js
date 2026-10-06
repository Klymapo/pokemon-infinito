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

// ---------------- Legibilidad sobre colores de tipo ----------------
const lumOf = hex => { const h = hex.replace('#', ''); const c = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lumOf(a), y = lumOf(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const darken = (hex, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(hex.replace('#', '').slice(i, i + 2), 16) * (1 - k)).toString(16).padStart(2, '0')).join('');
export const INK = '#16203a';
const styleCache = {};
/** Fondo y color de texto para una pastilla o botón de tipo, con contraste ≥ 4,5:1 (WCAG AA). */
export function typeStyle(type, fallback = '#567') {
	const bg0 = TYPE_COLORS[type] || fallback;
	if (styleCache[bg0]) return { ...styleCache[bg0] };
	let st;
	if (ratio(bg0, INK) >= 4.5 && ratio(bg0, INK) > ratio(bg0, '#ffffff')) st = { background: bg0, color: INK, textShadow: 'none' };
	else { let bg = bg0, k = 0; while (ratio(bg, '#ffffff') < 4.5 && k < 0.5) { k += 0.04; bg = darken(bg0, k); } st = { background: bg, color: '#ffffff' }; }
	styleCache[bg0] = st;
	return { ...st };
}

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
