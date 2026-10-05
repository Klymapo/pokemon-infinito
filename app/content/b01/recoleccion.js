// Recolección del Bloque 1: árboles de bayas, plumas, setas, minerales y la orilla.
// Cada punto se puede recoger una vez cada `hours` horas reales. Tablas con peso `w` y cantidad `n`.
// Nota: no se incluyen Miel, Miniseta ni Baya Meloc (son los ingredientes de la misión de Gaspar).

const BAYAS_BASICAS = [
	{ id: 'oranberry', w: 30, n: [1, 3] }, { id: 'cheriberry', w: 14, n: [1, 2] }, { id: 'chestoberry', w: 14, n: [1, 2] },
	{ id: 'rawstberry', w: 12, n: [1, 2] }, { id: 'aspearberry', w: 10, n: [1, 2] }, { id: 'persimberry', w: 10, n: [1, 2] },
	{ id: 'leppaberry', w: 8, n: [1, 1] }, { id: 'sitrusberry', w: 6, n: [1, 1] },
];
const BAYAS_SABOR = [
	{ id: 'figyberry', w: 6, n: [1, 1] }, { id: 'wikiberry', w: 6, n: [1, 1] }, { id: 'magoberry', w: 6, n: [1, 1] },
	{ id: 'aguavberry', w: 6, n: [1, 1] }, { id: 'iapapaberry', w: 6, n: [1, 1] },
];
const BAYAS_RARAS = [
	{ id: 'razzberry', w: 5, n: [1, 2] }, { id: 'blukberry', w: 5, n: [1, 2] }, { id: 'nanabberry', w: 5, n: [1, 2] },
	{ id: 'wepearberry', w: 5, n: [1, 2] }, { id: 'pinapberry', w: 5, n: [1, 2] },
	{ id: 'pomegberry', w: 3, n: [1, 1] }, { id: 'kelpsyberry', w: 3, n: [1, 1] }, { id: 'qualotberry', w: 3, n: [1, 1] },
	{ id: 'hondewberry', w: 3, n: [1, 1] }, { id: 'grepaberry', w: 3, n: [1, 1] }, { id: 'tamatoberry', w: 3, n: [1, 1] },
	{ id: 'lumberry', w: 2, n: [1, 1] },
];
const PLUMAS = [
	{ id: 'prettywing', w: 30, n: [1, 2] }, { id: 'healthwing', w: 12, n: [1, 2] }, { id: 'musclewing', w: 12, n: [1, 2] },
	{ id: 'resistwing', w: 12, n: [1, 2] }, { id: 'geniuswing', w: 12, n: [1, 2] }, { id: 'cleverwing', w: 12, n: [1, 2] },
	{ id: 'swiftwing', w: 12, n: [1, 2] },
];

export default {
	gather: {
		arbol_bayas: {
			name: 'Árbol de bayas', icon: '🌳', hours: 20, picks: [1, 3],
			text: 'Sacudes el árbol con cuidado. Caen unas cuantas bayas.',
			wait: 'El árbol todavía no ha dado bayas nuevas.',
			table: [...BAYAS_BASICAS, ...BAYAS_SABOR],
		},
		arbol_bayas_raro: {
			name: 'Árbol de bayas silvestre', icon: '🌳', hours: 20, picks: [1, 3],
			text: 'Es un árbol viejo, de ramas retorcidas. Sus bayas no son las de siempre.',
			wait: 'Las ramas están peladas. Volverá a dar fruto.',
			table: [...BAYAS_BASICAS.map(e => ({ ...e, w: e.w / 2 })), ...BAYAS_SABOR, ...BAYAS_RARAS],
		},
		nido_plumas: {
			name: 'Nido abandonado', icon: '🪶', hours: 20, picks: [1, 2],
			text: 'Entre las ramitas del nido hay plumas que los Pokémon pájaro dejaron atrás.',
			wait: 'El nido está vacío. Los Pokémon pájaro volverán.',
			table: PLUMAS,
		},
		setas_bosque: {
			name: 'Corro de setas', icon: '🍄', hours: 22, picks: [1, 2],
			text: 'Al pie de un tronco húmedo crece un corro de setas.',
			wait: 'Solo quedan los tallos. Crecerán de nuevo.',
			table: [{ id: 'bigmushroom', w: 30, n: [1, 1] }, { id: 'energyroot', w: 18, n: [1, 1] }, { id: 'healpowder', w: 18, n: [1, 2] }, { id: 'energypowder', w: 18, n: [1, 2] }, { id: 'revivalherb', w: 4, n: [1, 1] }, { id: 'balmmushroom', w: 3, n: [1, 1] }, { id: 'bigroot', w: 2, n: [1, 1] }],
		},
		flores_ruta4: {
			name: 'Macizo de flores', icon: '🌸', hours: 20, picks: [1, 2],
			text: 'Entre las flores hay cosas que la gente pierde y cosas que la tierra regala.',
			wait: 'Ya buscaste aquí hoy.',
			table: [{ id: 'oranberry', w: 25, n: [1, 2] }, { id: 'prettywing', w: 20, n: [1, 1] }, { id: 'energypowder', w: 12, n: [1, 1] }, { id: 'whiteherb', w: 6, n: [1, 1] }, { id: 'miracleseed', w: 3, n: [1, 1] }, ...BAYAS_SABOR],
		},
		veta_mineral: {
			name: 'Veta de mineral', icon: '⛏️', hours: 24, picks: [1, 2],
			text: 'Golpeas la veta con una piedra. Se desprenden algunos trozos.',
			wait: 'La veta está agotada por hoy.',
			table: [{ id: 'hardstone', w: 16, n: [1, 1] }, { id: 'everstone', w: 10, n: [1, 1] }, { id: 'stardust', w: 22, n: [1, 2] }, { id: 'smoothrock', w: 6, n: [1, 1] }, { id: 'heatrock', w: 6, n: [1, 1] }, { id: 'damprock', w: 6, n: [1, 1] }, { id: 'redshard', w: 8, n: [1, 1] }, { id: 'blueshard', w: 8, n: [1, 1] }, { id: 'yellowshard', w: 8, n: [1, 1] }, { id: 'greenshard', w: 8, n: [1, 1] }, { id: 'thunderstone', w: 2, n: [1, 1] }, { id: 'firestone', w: 2, n: [1, 1] }, { id: 'waterstone', w: 2, n: [1, 1] }, { id: 'leafstone', w: 2, n: [1, 1] }, { id: 'moonstone', w: 2, n: [1, 1] }],
		},
		cristales: {
			name: 'Cristales brillantes', icon: '💎', hours: 24, picks: [1, 2],
			text: 'Los cristales tintinean al tocarlos. Algunos se sueltan en tu mano.',
			wait: 'Los cristales que quedan están bien sujetos a la roca.',
			table: [{ id: 'stardust', w: 26, n: [1, 2] }, { id: 'starpiece', w: 6, n: [1, 1] }, { id: 'lightclay', w: 6, n: [1, 1] }, { id: 'pearl', w: 10, n: [1, 1] }, { id: 'shinystone', w: 2, n: [1, 1] }, { id: 'dawnstone', w: 2, n: [1, 1] }, { id: 'duskstone', w: 2, n: [1, 1] }, { id: 'icyrock', w: 4, n: [1, 1] }],
		},
		orilla: {
			name: 'Orilla de la playa', icon: '🐚', hours: 18, picks: [1, 3],
			text: 'La marea ha dejado cosas en la arena.',
			wait: 'La marea todavía no ha vuelto a subir.',
			table: [{ id: 'shoalsalt', w: 24, n: [1, 3] }, { id: 'shoalshell', w: 24, n: [1, 3] }, { id: 'pearl', w: 14, n: [1, 1] }, { id: 'heartscale', w: 10, n: [1, 1] }, { id: 'bigpearl', w: 3, n: [1, 1] }, { id: 'mysticwater', w: 2, n: [1, 1] }, { id: 'starpiece', w: 1, n: [1, 1] }],
		},
		piedras_menhir: {
			name: 'Pie de un menhir', icon: '🗿', hours: 24, picks: [1, 2],
			text: 'Al pie de la piedra antigua, la tierra está removida.',
			wait: 'No queda nada a la vista.',
			table: [{ id: 'stardust', w: 20, n: [1, 1] }, { id: 'rarebone', w: 6, n: [1, 1] }, { id: 'hardstone', w: 12, n: [1, 1] }, { id: 'oddkeystone', w: 2, n: [1, 1] }, { id: 'starpiece', w: 3, n: [1, 1] }, { id: 'nugget', w: 2, n: [1, 1] }],
		},
		espejos: {
			name: 'Reflejo en la roca', icon: '🪞', hours: 24, picks: [1, 2],
			text: 'En la superficie pulida de la roca hay incrustaciones que se desprenden.',
			wait: 'La roca solo te devuelve tu reflejo.',
			table: [{ id: 'stardust', w: 20, n: [1, 2] }, { id: 'starpiece', w: 8, n: [1, 1] }, { id: 'lightclay', w: 6, n: [1, 1] }, { id: 'duskstone', w: 3, n: [1, 1] }, { id: 'shinystone', w: 3, n: [1, 1] }, { id: 'cometshard', w: 1, n: [1, 1] }],
		},
	},
	patches: {
		ruta4: { route: { tramos: { 3: [{ spot: { action: { gather: 'flores_ruta4' } }, label: 'Macizo de flores', icon: '🌸' }], 6: [{ spot: { action: { gather: 'arbol_bayas' } }, label: 'Árbol de bayas', icon: '🌳' }] } } },
		ruta3: { route: { tramos: { 3: [{ spot: { action: { gather: 'arbol_bayas' } }, label: 'Árbol de bayas', icon: '🌳' }] } } },
		bosque_novarte: { route: { tramos: { 4: [{ spot: { action: { gather: 'setas_bosque' } }, label: 'Corro de setas', icon: '🍄' }], 7: [{ spot: { action: { gather: 'nido_plumas' } }, label: 'Nido abandonado', icon: '🪶' }] } } },
		ruta2: { route: { tramos: { 3: [{ spot: { action: { gather: 'arbol_bayas' } }, label: 'Árbol de bayas', icon: '🌳' }] } } },
		ruta1: { route: { tramos: { 4: [{ spot: { action: { gather: 'nido_plumas' } }, label: 'Nido abandonado', icon: '🪶' }] } } },
		ruta5: { route: { tramos: { 2: [{ spot: { action: { gather: 'arbol_bayas' } }, label: 'Árbol de bayas', icon: '🌳' }], 7: [{ spot: { action: { gather: 'nido_plumas' } }, label: 'Nido abandonado', icon: '🪶' }] } } },
		ruta6: { route: { tramos: { 3: [{ spot: { action: { gather: 'arbol_bayas_raro' } }, label: 'Árbol de bayas silvestre', icon: '🌳', sub: 'Uno de los árboles viejos de la alameda' }] } } },
		ruta7: { route: { tramos: { 2: [{ spot: { action: { gather: 'arbol_bayas' } }, label: 'Árbol de bayas', icon: '🌳' }], 6: [{ spot: { action: { gather: 'nido_plumas' } }, label: 'Nido en el sauce', icon: '🪶' }] } } },
		gruta_tierraunida: { route: { tramos: { 3: [{ spot: { action: { gather: 'veta_mineral' } }, label: 'Veta de mineral', icon: '⛏️' }] } } },
		ruta8: { route: { tramos: { 2: [{ spot: { action: { gather: 'orilla' } }, label: 'Orilla de la playa', icon: '🐚' }], 5: [{ spot: { action: { gather: 'orilla' } }, label: 'Cala escondida', icon: '🐚' }] } } },
		ruta9: { route: { tramos: { 3: [{ spot: { action: { gather: 'veta_mineral' } }, label: 'Veta de mineral', icon: '⛏️' }] } } },
		cueva_brillante: { route: { tramos: { 4: [{ spot: { action: { gather: 'cristales' } }, label: 'Cristales brillantes', icon: '💎' }], 8: [{ spot: { action: { gather: 'veta_mineral' } }, label: 'Veta de mineral', icon: '⛏️' }] } } },
		ruta10: { route: { tramos: { 3: [{ spot: { action: { gather: 'piedras_menhir' } }, label: 'Pie de un menhir', icon: '🗿' }], 6: [{ spot: { action: { gather: 'arbol_bayas_raro' } }, label: 'Árbol de bayas silvestre', icon: '🌳' }] } } },
		ruta11: { route: { tramos: { 4: [{ spot: { action: { gather: 'arbol_bayas_raro' } }, label: 'Árbol de bayas silvestre', icon: '🌳' }] } } },
		cueva_reflejos: { route: { tramos: { 4: [{ spot: { action: { gather: 'espejos' } }, label: 'Reflejo en la roca', icon: '🪞' }] } } },
	},
};
