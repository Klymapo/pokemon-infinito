// Retratos procedurales de busto, 48×48 (arte original). Módulo puro, sin DOM:
// retratoGrid(look, frame) → matriz 48×48 de colores (o null). Se usa en el juego (art.js)
// y en Node para generar las hojas de revisión (herramientas/retratos.mjs).
//
// look (todos opcionales; lo que falta se deduce de forma estable a partir del propio look):
//   skin: 0-7 | hex · hair: short|long|bob|ponytail|braids|spiky|curly|bun|tied|bald|cap|afro|mohawk|sidepart|
//         fringe|dreads|twintails|pompadour|buzz|wild|balding|hightail|slick|quiff|pixie|waves
//   hairColor, eyes (hex), eyes2 (heterocromía), outfit, outfit2, streak (mechón de color)
//   head: round|oval|square|heart|wide|long · age: child|adult|old · build: narrow|normal|broad
//   eyesStyle: normal|sleepy|sharp|happy|big|almond|narrow|droopy|lashes|tired|wide
//   brows: straight|angry|soft|thick|sad|skeptic|thin|none · nose: none|dot|l|hook|button
//   mouth: smile|flat|grin|open|smirk|frown|lips|teeth · eyeSep: 2|3|4
//   collar: tshirt|shirt|jacket|hoodie|turtleneck|coat|scarf|kimono|armor|cape|vest|apron|cardigan
//   acc (lista separada por espacios): glasses roundglasses squareglasses halfmoon goggles hat cap beret beanie
//         bandana headband hood helmet tophat chefhat flower bow hairpin scar freckles mole bandage eyepatch
//         headphones beard mustache stubble goatee earrings blush lipstick mask lemnis tie monocle headlamp feather
//   tie (hex), capColor, hatColor, scarfColor, scarf2 (rayas), lip (hex)

export const N = 48;
const CX = 24; // eje: columnas 23 | 24
const mirror = x => N - 1 - x;

// ---------- Color ----------
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = ([r, g, b]) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
export const shade = (c, t) => t < 0 ? mix(c, '#000000', -t) : mix(c, '#ffffff', t);
// Sombra con desplazamiento de tono (hacia azul violeta) y luz hacia amarillo cálido.
export const sombra = (c, t = 0.3) => mix(c, '#2a1d52', t);
export const luz = (c, t = 0.25) => mix(c, '#fff3cf', t);
const lum = c => { const [r, g, b] = hex(c); return 0.299 * r + 0.587 * g + 0.114 * b; };

export const SKINS = ['#ffe0c7', '#f5cba7', '#e0ac85', '#c68863', '#9a6646', '#6e4630', '#fff0e4', '#4e3022'];

function rng(seed) {
	let a = typeof seed === 'number' ? seed : [...String(seed)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
	return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const pick = (R, arr) => arr[(R() * arr.length) | 0];

// ---------- Formas de cabeza: semianchura por fila, de arriba a la barbilla ----------
const HEADS = {
	round: [5, 7, 9, 10, 10, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 11, 10, 9, 8, 7, 5],
	oval: [4, 6, 8, 9, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10, 10, 10, 9, 9, 8, 7, 6, 4],
	square: [7, 9, 10, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 10, 8],
	heart: [6, 8, 10, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 10, 10, 9, 8, 7, 6, 5, 4, 3],
	wide: [7, 9, 11, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 12, 11, 10, 8],
	long: [4, 6, 7, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 9, 8, 7, 6, 4],
	child: [6, 8, 9, 10, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 10, 9, 8, 7, 5],
};
const CHIN = 34;

// ---------- Ojos (ojo izquierdo; el borde derecho de la plantilla es el lagrimal) ----------
// k línea, i iris, I pupila, w blanco, g brillo, s ojera, l pestaña
const EYES = {
	normal: ['kkkk', 'wgIw', 'wiIw'],
	big: ['.kkk', 'kgIi', 'wiIi', '.ii.'],
	almond: ['..kkk', '.kgIw', 'kkiI.'],
	narrow: ['kkkk', '.iI.'],
	sleepy: ['....', 'kkkk', 'wiIw'],
	droopy: ['..kkk', '.kgIw', 'kkiIw'],
	sharp: ['kk...', '.kkkk', '..gIw', '...kk'],
	happy: ['.kk.', 'k..k'],
	lashes: ['l....', '.kkkk', '.wgIw', '.wiIw'],
	tired: ['kkkk', 'wgIw', 'wiIw', 'ssss'],
	wide: ['.kk.', 'kwwk', 'wgIw', 'wiIw', '.ww.'],
};
// Cejas (izquierda; borde derecho = lado interior)
const BROWS = {
	straight: ['kkkkk'],
	angry: ['kkk..', '...kk'],
	soft: ['.kkk.', 'k...k'],
	thick: ['kkkkk', '.kkkk'],
	sad: ['..kkk', 'kk...'],
	thin: ['.kkk.'],
	none: [],
};
// Bocas (centradas)
const MOUTHS = {
	smile: ['m...m', '.mmm.'],
	flat: ['.mmm.'],
	grin: ['mmmmm', 'mtttm', '.mmm.'],
	open: ['.mm.', 'mMMm', '.mm.'],
	smirk: ['....m', '.mmm.'],
	frown: ['.mmm.', 'm...m'],
	lips: ['.pp.', 'pPPp'],
	teeth: ['mtttm'],
};
const TALK = {
	smile: ['mmmmm', '.MqM.', '..m..'], grin: ['mmmmm', 'mtttm', 'mMqMm', '.mmm.'], open: ['.mm.', 'mMMm', 'mMqm', '.mm.'],
	flat: ['.mmm.', '.MMM.'], smirk: ['..mmm', '.mMMm', '..mm.'], frown: ['.mmm.', 'mMMMm'], lips: ['.pp.', 'pMMp', '.pp.'], teeth: ['mtttm', '.MMM.'],
};

/** Completa un look con valores deducidos (estables) para lo que no indique. */
export function resolveLook(look = {}) {
	const L = { skin: 1, hair: 'short', hairColor: '#5a3a26', eyes: '#3a5fc4', outfit: '#4c7cf0', outfit2: '#f3e6c4', acc: '', ...look };
	const key = JSON.stringify(Object.keys(look).sort().filter(k => k !== 'bg').map(k => [k, look[k]]));
	const R = rng(look.seed !== undefined ? 'seed:' + look.seed : key);
	if (look.seed !== undefined && !look.hairColor) {
		L.hairColor = pick(R, ['#2b2b38', '#5a3a26', '#8a5a2f', '#d8a85a', '#e9dcc0', '#c4473a', '#e07a3a', '#3b5bb5', '#5aa36b', '#d06aa6', '#8c6cd0', '#cfd6e2']);
		L.skin = (R() * 6) | 0;
		L.outfit = pick(R, ['#c4473a', '#3b5bb5', '#5aa36b', '#8c6cd0', '#d8a85a', '#4a4f6a']);
		L.hair = pick(R, ['short', 'long', 'bob', 'spiky', 'ponytail', 'curly', 'sidepart', 'fringe', 'buzz', 'waves']);
	}
	const acc = new Set(String(L.acc || '').split(/\s+/).filter(Boolean));
	if (acc.has('cap') && L.hair !== 'cap') L.capOver = true;
	L.accSet = acc;
	const grey = ['#cfd6e2', '#b9b0c0', '#8a8a8a', '#a0a0a0'].includes(String(L.hairColor).toLowerCase());
	if (!L.age) L.age = (grey && (L.hair === 'bald' || L.hair === 'balding' || acc.has('beard') || acc.has('mustache'))) ? 'old' : 'adult';
	if (!L.head) L.head = L.age === 'child' ? 'child' : pick(R, ['round', 'round', 'oval', 'square', 'heart', 'wide', 'long']);
	if (L.age === 'child' && !look.head) L.head = 'child';
	const es = L.eyesStyle || 'normal';
	if (!L.brows) L.brows = es === 'sharp' ? pick(R, ['angry', 'straight', 'thick']) : es === 'happy' ? 'soft' : es === 'sleepy' ? pick(R, ['straight', 'sad', 'thin']) : pick(R, ['straight', 'soft', 'thin', 'thick', 'skeptic']);
	if (!L.nose) L.nose = L.age === 'child' ? 'none' : L.age === 'old' ? pick(R, ['hook', 'l', 'button']) : pick(R, ['dot', 'l', 'l', 'button', 'dot']);
	if (!L.build) L.build = acc.has('beard') ? 'broad' : pick(R, ['normal', 'normal', 'narrow', 'broad']);
	if (!L.collar) L.collar = acc.has('tie') ? pick(R, ['shirt', 'jacket']) : pick(R, ['tshirt', 'shirt', 'jacket', 'hoodie', 'tshirt']);
	if (!L.eyeSep) L.eyeSep = pick(R, [3, 3, 3, 2, 4]);
	return L;
}

/**
 * Matriz 48×48 de colores hex (null = transparente). frame: {blink, talk}
 */
export function retratoGrid(look = {}, frame = {}) {
	const L = resolveLook(look);
	const acc = L.accSet;
	const col = Array.from({ length: N }, () => Array(N).fill(null));
	const mat = Array.from({ length: N }, () => Array(N).fill(''));
	const set = (x, y, c, m = 'x') => { if (x >= 0 && y >= 0 && x < N && y < N && c) { col[y][x] = c; mat[y][x] = m; } };
	const get = (x, y) => (x >= 0 && y >= 0 && x < N && y < N) ? mat[y][x] : '';
	const clear = (x, y) => { if (x >= 0 && y >= 0 && x < N && y < N) { col[y][x] = null; mat[y][x] = ''; } };
	const span = (y, xl, xr, c, m) => { for (let x = xl; x <= xr; x++) set(x, y, c, m); };
	const sym = (y, half, c, m) => span(y, CX - half, CX - 1 + half, c, m); // semianchura simétrica
	// Plantilla ASCII con mapa de letras; mir = también en espejo (la plantilla es la mitad izquierda)
	const stamp = (x0, y0, rows, map, mir = false, filter) => {
		rows.forEach((row, j) => [...row].forEach((ch, i) => {
			const v = map[ch]; if (!v) return;
			const [c, m] = Array.isArray(v) ? v : [v, 'x'];
			if (filter && !filter(x0 + i, y0 + j)) return;
			set(x0 + i, y0 + j, c, m);
			if (mir) set(mirror(x0 + i), y0 + j, c, m);
		}));
	};

	// ----- Paleta -----
	const skin = typeof L.skin === 'number' ? (SKINS[L.skin] || SKINS[1]) : L.skin;
	const skinS = sombra(skin, 0.22), skinD = sombra(skin, 0.4), skinH = luz(skin, 0.3);
	const hair = L.hairColor;
	const hairS = sombra(hair, 0.32), hairD = sombra(hair, 0.5), hairH = luz(hair, lum(hair) > 170 ? 0.5 : 0.32);
	const out = L.outfit, outS = sombra(out, 0.3), outH = luz(out, 0.22);
	const out2 = L.outfit2 || '#f3e6c4', out2S = sombra(out2, 0.25);
	const lineC = lum(hair) < 90 ? shade(hair, -0.35) : sombra(hair, 0.65);
	const eyeK = '#241c33';
	const browC = L.hair === 'bald' && lum(hair) > 150 ? sombra(hair, 0.2) : lum(hair) > 150 ? sombra(hair, 0.42) : hairS;
	const mouthC = mix(skin, '#5a1a2a', 0.62), mouthD = '#3a1222';

	const head = HEADS[L.head] || HEADS.round;
	const T = CHIN - head.length + 1; // primera fila de la cabeza
	const hw = y => (y < T || y > CHIN) ? 0 : head[y - T];
	const child = L.age === 'child', old = L.age === 'old';
	const eyeY = child ? CHIN - 10 : (L.head === 'long' ? CHIN - 13 : CHIN - 12);
	const H = eyeY - 5; // nacimiento del pelo (frente)
	const sep = +L.eyeSep || 3;

	// ================= 1. Pelo de detrás =================
	const backHair = (rows) => rows.forEach(([y, half]) => sym(y, half, hairS, 'hairb'));
	const longBack = (to, extra = 1) => { const r = []; for (let y = T + 2; y <= to; y++) { const base = Math.max(hw(Math.min(y, CHIN - 6)), 9) + extra; const taper = y > to - 3 ? (y - (to - 3)) : 0; r.push([y, base - taper]); } backHair(r); };
	switch (L.hair) {
	case 'long': longBack(46, 2); break;
	case 'waves': longBack(43, 3); for (let y = 30; y <= 43; y += 3) { set(CX - 15, y, hairD, 'hairb'); set(mirror(CX - 15), y + 1, hairD, 'hairb'); } break;
	case 'braids': longBack(36, 1); break;
	case 'bob': longBack(CHIN - 2, 2); break;
	case 'tied': { // coleta baja que cae por delante del hombro izquierdo
		longBack(CHIN - 4, 1);
		for (let y = eyeY + 1; y <= 44; y++) { const k = y - (eyeY + 1); const xl = CX - Math.max(hw(Math.min(y, CHIN - 3)), 11) - 3 + Math.min(3, k >> 3); const w = y > 41 ? 2 : 3 + (k > 6 && k < 16 ? 1 : 0); span(y, xl, xl + w, hair, 'hairf'); }
		span(CHIN - 1, CX - 13, CX - 9, out2, 'acc'); span(CHIN, CX - 13, CX - 9, out2, 'acc');
		break;
	}
	case 'hightail': case 'ponytail': { // coleta que asoma por detrás, a la derecha
		const hi = L.hair === 'hightail';
		const y0 = hi ? T - 3 : T + 3;
		const tl = hi ? [[0, 3], [1, 5], [2, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 6], [9, 6], [10, 6], [11, 5], [12, 5], [13, 5], [14, 4], [15, 4], [16, 3], [17, 3], [18, 2], [19, 2], [20, 1]]
			: [[0, 4], [1, 5], [2, 5], [3, 6], [4, 6], [5, 6], [6, 6], [7, 5], [8, 5], [9, 5], [10, 4], [11, 4], [12, 3], [13, 3], [14, 2]];
		tl.forEach(([j, w]) => { const x0 = 34 + (hi ? Math.min(6, j >> 1) : Math.min(4, j >> 2)); span(y0 + j, x0, x0 + w, hair, 'hairb'); });
		if (hi) for (let j = 0; j < 4; j++) span(y0 - 1 - j, 33 + j, 36 + j + (j < 2 ? 1 : 0), hair, 'hairb');
		break;
	}
	case 'twintails': {
		for (let j = 0; j < 16; j++) { const y = T + 4 + j; const w = j < 3 ? 3 + j : j > 11 ? 16 - j : 5; span(y, CX - 13 - w + (j > 8 ? 1 : 0), CX - 13 + (j > 8 ? 1 : 0), hair, 'hairf'); span(mirror(CX - 13 + (j > 8 ? 1 : 0)), y, mirror(CX - 13 - w + (j > 8 ? 1 : 0)), hair, 'hairf'); }
		break;
	}
	case 'afro': for (let y = T - 6; y <= CHIN - 6; y++) { const d = y < T + 3 ? (T + 3 - y) : y > CHIN - 10 ? (y - (CHIN - 10)) : 0; sym(y, 17 - Math.round(d * d / 4), hair, 'hairb'); } break;
	case 'dreads': longBack(41, 3); for (let x = CX - 15; x <= CX + 14; x += 3) for (let y = CHIN - 4; y <= 41; y++) if ((x + y) % 2) set(x, y, hairD, 'hairb'); break;
	case 'curly': longBack(CHIN - 1, 3); break;
	case 'wild': longBack(CHIN, 3); break;
	}
	// capucha (detrás)
	const hoodC = acc.has('hood') ? (L.hoodColor || (L.collar === 'cape' ? out : out)) : null;
	if (hoodC) for (let y = T - 3; y <= CHIN + 4; y++) { const half = y < T + 2 ? 13 + (y - T) : y > CHIN ? 16 + (y - CHIN) : 15; sym(y, half, sombra(hoodC, 0.15), 'hood'); }

	// ================= 2. Cuerpo y ropa =================
	const BUILDS = { narrow: [6, 10, 12, 13, 14, 14, 15, 15, 15, 15, 15, 15], normal: [7, 12, 14, 16, 17, 17, 18, 18, 18, 18, 18, 18], broad: [8, 14, 17, 19, 20, 21, 21, 22, 22, 22, 22, 22] };
	const body = BUILDS[L.build] || BUILDS.normal;
	const B0 = 36;
	if (L.collar === 'cape') for (let j = 0; j < 12; j++) sym(B0 + j, Math.min(23, body[j] + 2 + (j > 2 ? 1 : 0)), sombra(out2, 0.1), 'out2');
	body.forEach((half, j) => sym(B0 + j, half, out, 'out'));
	if (L.collar === 'armor') for (let j = 1; j < 6; j++) { span(B0 + j, CX - body[j] - 2, CX - body[j] + 6, out2, 'out2'); span(B0 + j, mirror(CX - body[j] + 6), mirror(CX - body[j] - 2), out2, 'out2'); }
	// cuello (piel)
	for (let y = CHIN - 1; y <= B0 + 2; y++) span(y, CX - 3, CX + 2, y <= CHIN + 1 ? skinD : skinS, 'neck');
	const nk = (y, half) => sym(y, half, skinS, 'neck');
	switch (L.collar) {
	case 'tshirt':
		nk(B0, 4); nk(B0 + 1, 3);
		span(B0 + 1, CX - 5, CX - 4, out2, 'out2'); span(B0 + 1, CX + 3, CX + 4, out2, 'out2'); span(B0 + 2, CX - 3, CX + 2, out2, 'out2');
		break;
	case 'shirt': case 'cardigan':
		nk(B0, 3); nk(B0 + 1, 2); nk(B0 + 2, 1);
		stamp(CX - 7, B0 - 1, ['cc.....', '.ccc...', '..cccc.', '...ccc.', '....cc.', '.....c.'], { c: [out2, 'out2'] }, true);
		if (L.collar === 'cardigan') { for (let y = B0 + 3; y < N; y++) { sym(y, 2, out2S, 'out2'); } for (let y = B0 + 5; y < N; y += 3) set(CX - 3, y, outH, 'out'); }
		break;
	case 'jacket': { // chaqueta abierta: camisa en V que se cierra hacia el pecho, solapas marcadas
		nk(B0, 3); nk(B0 + 1, 2);
		for (let y = B0; y < B0 + 9; y++) { const half = Math.max(0, 5 - ((y - B0) >> 1)); if (half) sym(y, half, out2, 'out2'); }
		for (let y = B0; y < B0 + 9; y++) { const half = Math.max(0, 5 - ((y - B0) >> 1)); set(CX - half - 1, y, outS, 'lapel'); set(mirror(CX - half - 1), y, outS, 'lapel'); }
		stamp(CX - 8, B0 + 1, ['oo.', '.oo', '..o'], { o: [outH, 'lapel'] }, true);
		for (let y = B0 + 10; y < N; y++) set(CX - 1, y, outS, 'lapel');
		break;
	}
	case 'overalls':
		nk(B0, 4); nk(B0 + 1, 3);
		span(B0 + 1, CX - 5, CX - 4, out2, 'out2'); span(B0 + 1, CX + 3, CX + 4, out2, 'out2'); span(B0 + 2, CX - 3, CX + 2, out2, 'out2');
		for (let y = B0 + 1; y < N; y++) { span(y, CX - 9, CX - 7, L.strap || '#3b5bb5', 'acc'); span(y, CX + 6, CX + 8, L.strap || '#3b5bb5', 'acc'); }
		for (let y = B0 + 7; y < N; y++) span(y, CX - 9, CX + 8, L.strap || '#3b5bb5', 'acc');
		set(CX - 8, B0 + 7, '#f2c84a', 'acc'); set(CX + 7, B0 + 7, '#f2c84a', 'acc');
		if (L.stains !== false) { set(CX - 3, B0 + 9, sombra(L.strap || '#3b5bb5', 0.5), 'acc'); set(CX - 2, B0 + 10, sombra(L.strap || '#3b5bb5', 0.5), 'acc'); set(CX + 4, B0 + 8, sombra(L.strap || '#3b5bb5', 0.5), 'acc'); }
		break;
	case 'hoodie':
		nk(B0, 3);
		for (let j = 0; j < 4; j++) sym(B0 - 1 + j, [9, 10, 9, 7][j], outS, 'out');
		nk(B0, 3); nk(B0 + 1, 2);
		set(CX - 3, B0 + 3, out2, 'out2'); set(CX - 3, B0 + 4, out2, 'out2'); set(CX - 3, B0 + 6, out2, 'out2');
		set(CX + 2, B0 + 3, out2, 'out2'); set(CX + 2, B0 + 4, out2, 'out2'); set(CX + 2, B0 + 5, out2, 'out2');
		break;
	case 'turtleneck':
		for (let y = CHIN; y <= B0 + 1; y++) sym(y, 5, y === CHIN ? out2S : out2, 'out2');
		for (let y = CHIN + 1; y <= B0 + 1; y += 2) sym(y, 5, out2S, 'out2');
		break;
	case 'coat': // abrigo, gabardina o bata: cuello alzado y solapas anchas
		nk(B0, 3); nk(B0 + 1, 2);
		for (let y = CHIN + 1; y <= B0; y++) { span(y, CX - 7, CX - 4, out, 'out'); span(y, CX + 3, CX + 6, outS, 'out'); }
		for (let y = B0; y < B0 + 8; y++) { const half = Math.max(0, 4 - ((y - B0) >> 1)); if (half) sym(y, half, out2, 'out2'); }
		stamp(CX - 10, B0 + 1, ['oooo....', '.oooo...', '..oooo..', '...ooo..', '....oo..', '.....o..'], { o: [outH, 'lapel'] });
		stamp(mirror(CX - 3), B0 + 1, ['....OOOO', '...OOOO.', '..OOOO..', '..OOO...', '..OO....', '..O.....'], { O: [outS, 'lapel'] });
		for (let y = B0 + 8; y < N; y++) set(CX - 1, y, outS, 'lapel');
		set(CX - 3, B0 + 10, outS, 'lapel'); set(CX - 3, B0 + 13, outS, 'lapel');
		break;
	case 'scarf': {
		nk(B0, 3);
		const sc = L.scarfColor || out2, sc2 = L.scarf2 || sombra(sc, 0.3);
		for (let y = CHIN; y <= B0 + 2; y++) sym(y, 7 - (y > B0 ? 1 : 0), (y % 2) ? sc : sc2, 'scarf');
		for (let y = B0 + 2; y < N; y++) span(y, CX + 3, CX + 7, (y % 3) ? sc : sc2, 'scarf'); // punta colgando
		for (let y = B0 + 2; y < B0 + 7; y++) span(y, CX - 7, CX - 4, (y % 3) ? sc : sc2, 'scarf');
		break;
	}
	case 'kimono': // cruce en Y: izquierda sobre derecha
		nk(B0, 4); nk(B0 + 1, 3); nk(B0 + 2, 2); nk(B0 + 3, 1);
		for (let k = 0; k < 6; k++) { span(B0 + k, CX - 6 + k, CX - 5 + k, out2, 'out2'); span(B0 + k, CX + 4 - k, CX + 5 - k, out2S, 'out2'); }
		for (let k = 6; k < 12; k++) span(B0 + k, CX + (k - 6) - 1, CX + (k - 6), out2, 'out2');
		for (let y = N - 3; y < N; y++) sym(y, body[11], y === N - 3 ? out2S : out2, 'out2'); // obi
		break;
	case 'armor':
		for (let y = CHIN; y <= B0 + 1; y++) sym(y, 5, out2S, 'out2');
		for (let y = B0 + 3; y < N; y += 3) sym(y, 6, outS, 'out');
		break;
	case 'cape':
		for (let y = CHIN - 3; y <= B0; y++) { const h2 = 6 + (B0 - y) + (y < CHIN ? 0 : 0); span(y, CX - h2 - 2, CX - 4, out2, 'out2'); span(y, CX + 3, mirror(CX - h2 - 2), sombra(out2, 0.2), 'out2'); }
		nk(B0, 3);
		for (let y = B0 + 1; y < N; y++) sym(y, 2, outS, 'out');
		break;
	case 'vest': case 'apron':
		nk(B0, 3); nk(B0 + 1, 2);
		if (L.collar === 'vest') for (let y = B0 + 1; y < N; y++) { sym(y, 6 + (y > B0 + 4 ? 0 : 0), out2, 'out2'); span(y, CX - 1, CX, outS, 'out'); }
		else { for (let y = B0 + 3; y < N; y++) sym(y, 9, out2, 'out2'); span(B0, CX - 7, CX - 6, out2S, 'out2'); span(B0 + 1, CX - 8, CX - 7, out2S, 'out2'); span(B0 + 2, CX - 9, CX - 8, out2S, 'out2'); }
		break;
	}
	if (acc.has('tie')) { const tc = L.tie || '#3b5bb5'; stamp(CX - 1, B0 + 1, ['tt', 'tt', 'tt', '.t', 'tt', 'tt', 'tt', 'tt', 'tt'], { t: [tc, 'acc'] }); set(CX, B0 + 4, sombra(tc, 0.3), 'acc'); }
	if (acc.has('lemnis')) stamp(CX - 11, B0 + 5, ['.w.w.', 'w.w.w', '.w.w.'], { w: ['#dfe6f0', 'acc'] }); // insignia en el pecho
	if (acc.has('feather')) stamp(CX + 7, B0 + 3, ['..g', '.gG', 'gG.', 'G..'], { g: ['#c9ced8', 'acc'], G: ['#8a90a0', 'acc'] });

	// ================= 3. Cabeza =================
	for (let y = T; y <= CHIN; y++) sym(y, hw(y), skin, 'skin');
	// orejas
	const earY = eyeY;
	for (const [dy, w] of [[0, 1], [1, 2], [2, 2], [3, 1]]) { const y = earY + dy, half = hw(y); span(y, CX - half - w, CX - half - 1, dy === 2 ? skinS : skin, 'skin'); span(y, CX + half, CX + half - 1 + w, skinS, 'skin'); }
	if (acc.has('earrings')) { set(CX - hw(earY + 3) - 1, earY + 5, '#f2c84a', 'acc'); set(CX + hw(earY + 3), earY + 5, '#f2c84a', 'acc'); set(CX - hw(earY + 3) - 1, earY + 4, '#c99a2a', 'acc'); set(CX + hw(earY + 3), earY + 4, '#c99a2a', 'acc'); }

	// ================= 4. Rasgos =================
	const ec = L.eyes || '#3a5fc4', ec2 = L.eyes2 || ec;
	const eyeMap = (c) => ({ k: [eyeK, 'eye'], i: [c, 'eye'], I: [sombra(c, 0.5), 'eye'], w: ['#f4efe6', 'eye'], g: ['#ffffff', 'eye'], s: [skinS, 'skin'], l: [eyeK, 'eye'] });
	let es = L.eyesStyle || 'normal';
	if (child && es === 'normal') es = 'big';
	const tpl = EYES[es] || EYES.normal;
	const ew = Math.max(...tpl.map(r => r.length));
	const eyeTop = eyeY - (tpl.length > 3 ? 1 : 0);
	const leftX = CX - sep - ew; // borde exterior del ojo izquierdo
	const drawEyes = (rows) => {
		const pad = rows.map(r => r.padEnd(ew, '.'));
		stamp(leftX, eyeTop, pad, eyeMap(ec));
		// derecho: espejo, pero el brillo queda arriba a la izquierda de la pupila
		const R = pad.map(r => [...r].reverse().join('').replace(/I(g)/g, 'gI').replace(/gI/g, 'gI'));
		const fixed = R.map(r => { const a = [...r]; const gi = a.indexOf('g'); if (gi >= 0) { const ii = a.findIndex(ch => ch === 'i' || ch === 'I'); if (ii >= 0 && ii < gi) { a[gi] = 'I'; a[ii] = 'g'; } } return a.join(''); });
		stamp(mirror(leftX + ew - 1), eyeTop, fixed, eyeMap(ec2));
	};
	if (frame.blink && es !== 'happy') {
		const closed = tpl.map((r, j) => j === tpl.length - 1 - (es === 'tired' ? 1 : 0) ? r.replace(/[^.]/g, 'k').replace(/^\.|\.$/g, '.') : r.replace(/[^.s]/g, '.'));
		// la línea del párpado ocupa todo el ancho del ojo
		const li = closed.findIndex(r => r.includes('k'));
		if (li >= 0) closed[li] = closed[li].replace(/\./g, (m, i) => (i > 0 && i < ew - 1) ? 'k' : '.');
		drawEyes(closed);
	} else drawEyes(tpl);
	// cejas
	const browY = eyeTop - 2 - (es === 'sleepy' ? -1 : 0);
	const bName = L.brows === 'skeptic' ? 'straight' : L.brows;
	const btpl = BROWS[bName] || BROWS.straight;
	const bMap = { k: [browC, 'brow'] };
	const bx = CX - sep - 5 + (ew > 4 ? 0 : 0);
	stamp(bx, browY - btpl.length + 1, btpl, bMap);
	const bR = (L.brows === 'skeptic' ? BROWS.soft : btpl).map(r => [...r].reverse().join(''));
	stamp(mirror(bx + 4), browY - bR.length + 1 - (L.brows === 'skeptic' ? 1 : 0), bR, bMap);
	// ojeras / arrugas de edad
	if (old) { set(leftX - 1, eyeY + 3, skinS, 'skin'); set(mirror(leftX - 1), eyeY + 3, skinS, 'skin'); span(eyeY + 3, leftX + 1, leftX + 2, skinS, 'skin'); span(eyeY + 3, mirror(leftX + 2), mirror(leftX + 1), skinS, 'skin'); }
	// nariz
	const noseY = eyeY + (child ? 3 : 4);
	switch (L.nose) {
	case 'dot': set(CX, noseY + 1, skinS, 'skin'); break;
	case 'l': set(CX, noseY, skinS, 'skin'); set(CX, noseY + 1, skinS, 'skin'); set(CX - 1, noseY + 1, skinS, 'skin'); break;
	case 'button': span(noseY + 1, CX - 1, CX, skinS, 'skin'); set(CX - 1, noseY, skinH, 'skin'); break;
	case 'hook': set(CX - 1, noseY - 1, skinS, 'skin'); set(CX, noseY, skinS, 'skin'); set(CX + 1, noseY + 1, skinD, 'skin'); set(CX, noseY + 1, skinS, 'skin'); set(CX - 1, noseY + 1, skinS, 'skin'); break;
	}
	// mejillas
	if (acc.has('blush') || child || L.eyesStyle === 'happy') { const bc = mix(skin, '#ff7a8a', 0.4); span(eyeY + 4, leftX - 1, leftX + 1, bc, 'skin'); span(eyeY + 4, mirror(leftX + 1), mirror(leftX - 1), bc, 'skin'); }
	// boca
	const mouthY = eyeY + (child ? 6 : 7);
	let mName = L.mouth || 'smile';
	if (acc.has('lipstick') && mName === 'flat') mName = 'lips';
	const mt = frame.talk ? (TALK[mName] || TALK.smile) : (MOUTHS[mName] || MOUTHS.smile);
	const lip = L.lip || (acc.has('lipstick') ? '#c4304f' : mouthC);
	const mMap = { m: [mouthC, 'mouth'], M: [mouthD, 'mouth'], t: ['#f6f2ea', 'mouth'], q: ['#d9606e', 'mouth'], p: [lip, 'mouth'], P: [sombra(lip, 0.35), 'mouth'] };
	const mw = Math.max(...mt.map(r => r.length));
	stamp(CX - Math.ceil(mw / 2), mouthY, mt, mMap);
	if (old) { set(CX - 4, mouthY - 1, skinS, 'skin'); set(CX + 3, mouthY - 1, skinS, 'skin'); }
	// marcas
	if (acc.has('freckles')) for (const [dx, dy] of [[0, 0], [2, 0], [1, 1]]) { set(leftX - 1 + dx, eyeY + 4 + dy, sombra(skin, 0.35), 'skin'); set(mirror(leftX - 1 + dx), eyeY + 4 + dy, sombra(skin, 0.35), 'skin'); }
	if (acc.has('mole')) set(CX + 5, mouthY - 1, sombra(skin, 0.6), 'skin');
	if (acc.has('scar')) { const sc = mix(skin, '#a0404a', 0.45); if (L.scarAt === 'chin') { span(CHIN - 1, CX + 1, CX + 3, sc, 'skin'); } else for (let k = 0; k < 4; k++) set(mirror(leftX) - 1 + (k >> 1), eyeTop - 2 + k, sc, 'skin'); }
	if (acc.has('bandage')) stamp(CX + 4, eyeY + 4, ['bbbb', 'bBbb'], { b: ['#f2e2c4', 'acc'], B: ['#d8c49e', 'acc'] });

	// ================= 5. Vello facial =================
	const bc = L.beardColor || hair;
	if (acc.has('beard')) {
		for (let y = mouthY - 2; y <= CHIN + 2; y++) {
			const half = y <= CHIN ? hw(y) : Math.max(3, hw(CHIN) - (y - CHIN) * 2);
			for (let x = CX - half; x <= CX - 1 + half; x++) {
				const inner = y < CHIN - 1 && Math.abs(x - CX + 0.5) < half - 3 && y < mouthY + 2;
				if (inner && y < mouthY - 0) continue;
				if (get(x, y) === 'mouth' && !frame.talk) continue;
				if (frame.talk && get(x, y) === 'mouth') continue;
				set(x, y, (x >= CX + half - 2 || y >= CHIN + 1) ? sombra(bc, 0.3) : bc, 'beard');
			}
		}
		// patillas
		for (let y = eyeY + 1; y < mouthY - 1; y++) { span(y, CX - hw(y), CX - hw(y) + 1, bc, 'beard'); span(y, CX + hw(y) - 2, CX + hw(y) - 1, sombra(bc, 0.3), 'beard'); }
	}
	if (acc.has('goatee')) for (let y = mouthY + 2; y <= CHIN + 1; y++) sym(y, y > CHIN ? 1 : 2, bc, 'beard');
	if (acc.has('stubble')) for (let y = mouthY - 1; y <= CHIN; y++) for (let x = CX - hw(y) + 1; x <= CX + hw(y) - 2; x++) if ((x + y) % 2 === 0 && (x % 3) && get(x, y) === 'skin' && (y > mouthY + 1 || Math.abs(x - CX + 0.5) > 4)) set(x, y, mix(skin, bc, 0.25), 'skin');
	if (acc.has('mustache')) stamp(CX - 4, mouthY - 1, ['.hhhhhh.', 'hh....hh'], { h: [bc, 'beard'] });

	// ================= 6. Pelo de delante =================
	const F = (x, y, c = hair) => set(x, y, c, 'hair');
	const cap = (v = 2, wid = 1, low = 0) => { // casquete que cubre la parte de arriba de la cabeza
		for (let y = T - v; y <= H + low; y++) { const half = hw(Math.min(y + v, CHIN)) + wid; sym(y, half, hair, 'hair'); }
	};
	const sides = (to, w = 2, out = 1) => { for (let y = H; y <= to; y++) { const half = hw(y) + out; span(y, CX - half, CX - half + w - 1, hair, 'hair'); span(y, CX + half - w, CX + half - 1, hair, 'hair'); } };
	const fringe = (rows, x0 = CX - 12) => stamp(x0, H + 1, rows, { h: [hair, 'hair'], H: [hairS, 'hair'] });
	switch (L.hair) {
	case 'bald': case 'balding':
		sides(eyeY + 1, 3, 1);
		if (L.hair === 'balding') for (let y = T + 1; y < H; y++) { const half = hw(y); span(y, CX - half, CX - half + 1, hair, 'hair'); span(y, CX + half - 2, CX + half - 1, hair, 'hair'); }
		break;
	case 'buzz':
		for (let y = T - 1; y <= H; y++) { const half = hw(Math.min(y + 1, CHIN)); for (let x = CX - half; x < CX + half; x++) set(x, y, ((x + y) % 2) ? hair : mix(hair, skin, 0.35), 'hair'); }
		sides(eyeY, 1, 0);
		break;
	case 'short':
		cap(2, 1); sides(eyeY + 1, 2, 1);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhh.hhhhhhhhh.hhhhhhhh', '.hhh...hhhh.hh...hhh.hh.', '..h.....hh........h.....']);
		break;
	case 'sidepart':
		cap(2, 1); sides(eyeY + 2, 2, 1);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhh.hhhhh', '.hhhhhhhhhhhhhhh....hhhh.', '..hhhhhhhhhhhh.......hhh.', '....hhhhhhhh.........hh..', '.......hhh............h..']);
		for (let y = T - 2; y < H - 1; y++) set(CX + 5, y, hairS, 'hair'); // raya
		break;
	case 'fringe':
		cap(2, 1); sides(eyeY + 3, 3, 1);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhhhhhhh', '.hHhhHhhHhhHhhHhhHhhHhh.']);
		break;
	case 'bob':
		cap(2, 2); sides(CHIN - 2, 4, 2);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhh.hhhhhhhhhhhhhh.hhhh', 'hh....hh.hhhhhh.hh....hh']);
		for (let y = CHIN - 4; y <= CHIN - 2; y++) { span(y, CX - hw(y) - 3, CX - hw(y) + 2, hair, 'hair'); span(y, CX + hw(y) - 3, CX + hw(y) + 2, hair, 'hair'); }
		break;
	case 'pixie':
		cap(2, 1); sides(eyeY, 2, 1);
		for (let y = H; y <= CHIN - 3; y++) span(y, CX - hw(y) - 2, CX - hw(y) + (y < CHIN - 5 ? 1 : 0), hair, 'hair'); // mechón largo a un lado
		fringe(['hhhhhhhhhhhhhhhhhhhhhhh', '.hhhhhhhhhhhhhhhhhhh.hh', '...hhhhhhhhhhh.......h.', '......hhhhh............', '........hh.............']);
		break;
	case 'long': case 'waves': case 'braids': case 'tied': case 'ponytail': case 'hightail': case 'twintails':
		cap(2, 2);
		if (['long', 'waves'].includes(L.hair)) { sides(CHIN + 2, 3, 2); }
		else sides(eyeY + 2, 2, 1);
		if (L.hair === 'ponytail' || L.hair === 'hightail' || L.hair === 'twintails') fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhh.hhhhhhhhhhhh', '.hhhhhhhh...hhhhhhhhhhh.', '..hhhhh.......hhhhhhhh..', '...hh............hhh....']);
		else if (L.hair === 'braids') fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhh.hhhhhhhhhhhh', 'hhhhhhhh.....hhhhhhhhhhh', '.hhhh..........hhhhhhh..']);
		else fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhh.hhhhhhhhhhhhh', 'hhhhhhh......hhhhhhhhhhh', '.hhh..........hhhhhhhhh.', '...............hhhhh....']);
		if (L.hair === 'braids') { // dos trenzas por delante de los hombros
			for (const sx of [CX - 13, mirror(CX - 13) - 2]) for (let y = eyeY + 2; y <= 45; y++) { const k = (y - eyeY) % 3; span(y, sx + (k === 1 ? 0 : 1), sx + (k === 1 ? 2 : 3) - (k === 2 ? 1 : 0), hair, 'hair'); if (k === 0) set(sx + 2, y, hairS, 'hair'); }
			for (const sx of [CX - 13, mirror(CX - 13) - 2]) span(45, sx, sx + 2, out2, 'acc');
		}
		if (L.hair === 'twintails') { set(CX - 13, T + 4, out2, 'acc'); set(CX - 12, T + 4, out2, 'acc'); set(mirror(CX - 13), T + 4, out2, 'acc'); set(mirror(CX - 12), T + 4, out2, 'acc'); }
		if (L.hair === 'hightail') { span(T - 1, 33, 35, L.tieColor || out2, 'acc'); span(T, 33, 35, L.tieColor || out2, 'acc'); } else if (L.hair === 'ponytail') { span(T + 3, 34, 36, L.tieColor || out2, 'acc'); }
		break;
	case 'bun':
		cap(2, 1); sides(eyeY, 2, 1);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhhhhhhh', '.hhhhhhhhhh..hhhhhhhhhh.', '..hhh..............hhh..']);
		stamp(CX - 5, T - 9, ['...hhhh...', '.hhhhhhhh.', 'hhhhhhhhhh', 'hhhhhhhhhh', 'hhhhhhhhhh', '.hhhhhhhh.', '..cccccc..'], { h: [hair, 'hair'], c: [out2, 'acc'] });
		break;
	case 'spiky':
		cap(2, 1); sides(eyeY, 2, 1);
		stamp(CX - 13, T - 8, [
			'.....h.......h........h...',
			'.....hh.....hh.......hh...',
			'....hhh....hhhh.....hhh...',
			'h...hhhh..hhhhh....hhhh..h',
			'hh.hhhhhhhhhhhhhh.hhhhh.hh',
			'hhhhhhhhhhhhhhhhhhhhhhhhhh',
			'.hhhhhhhhhhhhhhhhhhhhhhhh.',
			'.hhhhhhhhhhhhhhhhhhhhhhhh.',
			'..hhhhhhhhhhhhhhhhhhhhhh..'], { h: [hair, 'hair'] });
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhh.hhhh.hhhhh.hhhh.hhhh', '.h...hh...hhh...hh...hh.', '......h....h......h.....']);
		break;
	case 'mohawk':
		for (let y = T - 1; y <= H; y++) { const half = hw(Math.min(y + 1, CHIN)); for (let x = CX - half; x < CX + half; x++) if ((x + y) % 2) set(x, y, mix(hair, skin, 0.55), 'skin'); }
		stamp(CX - 3, T - 9, ['..hh..', '.hhhh.', '.hhhh.', 'hhhhhh', 'hhhhhh', 'hhhhhh', 'hhhhhh', 'hhhhhh', 'hhhhhh', 'hhhhhh', 'hhhhhh', '.hhhh.', '.hhhh.'], { h: [hair, 'hair'] });
		break;
	case 'curly': case 'afro':
		cap(L.hair === 'afro' ? 4 : 3, L.hair === 'afro' ? 3 : 2);
		if (L.hair === 'curly') sides(CHIN - 3, 4, 3);
		{ // borde festoneado (rizos que asoman) y rizos interiores en forma de «c»
			const top = L.hair === 'afro' ? T - 6 : T - 4;
			const bottom = L.hair === 'afro' ? CHIN - 6 : CHIN - 2;
			const rowsH = [];
			for (let y = top - 1; y <= bottom; y++) { let xl = -1, xr = -1; for (let x = 0; x < N; x++) if (['hair', 'hairb'].includes(get(x, y))) { if (xl < 0) xl = x; xr = x; } rowsH.push([y, xl, xr]); }
			for (const [y, xl, xr] of rowsH) if (xl >= 0 && ((y >> 1) % 2 === 0)) { set(xl - 1, y, hair, 'hair'); set(xr + 1, y, hair, 'hair'); }
			for (let x = CX - 13; x < CX + 13; x++) if (((x + 1) >> 1) % 2 === 0) { for (let y = 0; y < N; y++) if (['hair', 'hairb'].includes(get(x, y))) { set(x, y - 1, hair, 'hair'); break; } }
			for (let y = top + 2; y <= Math.min(H - 1, bottom); y += 4) for (let x = CX - 12 + ((y >> 2) % 2) * 3; x < CX + 11; x += 6) if (get(x, y) === 'hair' && get(x + 1, y + 1) === 'hair') { set(x, y, hairS, 'hairc'); set(x + 1, y + 1, hairS, 'hairc'); set(x, y + 1, hairS, 'hairc'); }
		}
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhh.hhhhh.hhhhhh.hhhhhhh', '.h...hhh...hhhh...hhh.h.', '......h......h.....h....']);
		break;
	case 'wild': // revuelto de recién levantado
		cap(3, 2); sides(CHIN - 2, 3, 3);
		stamp(CX - 16, T - 7, [
			'..........h.......h.............',
			'....h.....hh....hhh......h......',
			'.....hh...hhh..hhhh....hhh..h...',
			'..h..hhhhhhhhhhhhhhhhhhhhhhhh...',
			'...hhhhhhhhhhhhhhhhhhhhhhhhhhh..',
			'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.',
			'.hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'], { h: [hair, 'hair'] });
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hh.hhhhh.hhhhh.hhhhhhh.h', 'h...hh....hhh...hhh...hh', '.....h.....h.....h......']);
		break;
	case 'dreads':
		cap(2, 2); sides(eyeY + 3, 3, 2);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hh.hh.hh.hh.hh.hh.hh.hhh', 'h..h..h..h..h..h..h..h..', 'h.....h.....h.....h.....']);
		break;
	case 'pompadour': case 'quiff':
		cap(2, 1); sides(eyeY, 2, 1);
		stamp(CX - 11, T - 7, L.hair === 'pompadour' ? [
			'.......hhhhhhhh.......',
			'....hhhhhhhhhhhhhh....',
			'..hhhhhhhhhhhhhhhhhh..',
			'.hhhhhhhhhhhhhhhhhhhh.',
			'hhhhhhhhhhhhhhhhhhhhhh',
			'hhhhhhhhhhhhhhhhhhhhhh',
			'hhhhhhhhhhhhhhhhhhhhhh'] : [
			'..............hhh.....',
			'...........hhhhhhhh...',
			'........hhhhhhhhhhhhh.',
			'.....hhhhhhhhhhhhhhhhh',
			'..hhhhhhhhhhhhhhhhhhh.',
			'hhhhhhhhhhhhhhhhhhhhhh',
			'hhhhhhhhhhhhhhhhhhhhhh'], { h: [hair, 'hair'] });
		fringe(L.hair === 'pompadour' ? ['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhhhhhhh', 'hh....................hh'] : ['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhhhhhhh', 'hh.........hhhhhhhh...hh', '.............hhhh.......']);
		break;
	case 'slick': // hacia atrás con pico en la frente
		cap(1, 1); sides(eyeY + 1, 2, 1);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhhhhhhhhh', 'hh.....hhhhhhhhhh.....hh', 'h..........hh..........h']);
		for (let y = T; y < H; y += 2) for (let x = CX - 8; x < CX + 8; x += 4) set(x + (y % 4 ? 2 : 0), y, hairS, 'hair');
		break;
	case 'cap': default:
		cap(2, 1); sides(eyeY + 1, 2, 1);
		fringe(['hhhhhhhhhhhhhhhhhhhhhhhh', 'hhhhhh.hhhhhhhhhh.hhhhhh', '.hhh....hhhhhh....hhh.h.', '..h......hhh.......h....']);
	}
	if (acc.has('ahoge')) { let ty = 0; for (let y = 0; y < N; y++) if (get(CX - 2, y) === 'hair') { ty = y; break; } stamp(CX - 2, ty - 6, ['..hh', '.h..', '.h..', 'h...', 'h...', '.h..'], { h: [hair, 'hair'] }); }
	if (L.streak) for (let y = T - 1; y <= H + 3; y++) for (const x of [CX - 5, CX - 4]) if (get(x, y) === 'hair') set(x, y, L.streak, 'hairx');

	// ================= 7. Sombreros y accesorios =================
	const capC = L.capColor || L.outfit2 || '#c4473a';
	if (L.hair === 'cap' || L.capOver) {
		stamp(CX - 12, T - 4, [
			'......cccccccccccc......',
			'....cccccccccccccccc....',
			'...ccccccccccccccccccc..',
			'..cccccccccccccccccccc..',
			'..ccccccccccccccccccccc.',
			'.ccccccccccccccccccccccc',
			'.ccccccccccccccccccccccc',
			'bbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			'.bbbbbbbbbbbbbbbbbbbbb......'], { c: [capC, 'hat'], b: [sombra(capC, 0.3), 'hat'] });
		set(CX - 1, T - 4, luz(capC, 0.4), 'hat'); set(CX, T - 4, luz(capC, 0.4), 'hat');
		if (L.capLogo) stamp(CX - 2, T - 1, ['.ww.', 'wwww'], { w: [L.capLogo, 'hat'] });
	}
	const hatC = L.hatColor || '#5a4a36';
	if (acc.has('hat')) {
		stamp(CX - 18, T - 9, [
			'.........hhhhhhhhhhhhhhhhhh.........',
			'........hhhhhhhhhhhhhhhhhhhh........',
			'........hhhhhhhhhhhhhhhhhhhh........',
			'........hhhhhhhhhhhhhhhhhhhh........',
			'........bbbbbbbbbbbbbbbbbbbb........',
			'........hhhhhhhhhhhhhhhhhhhh........',
			'.rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr.',
			'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'], { h: [hatC, 'hat'], b: [L.outfit2 || '#c4473a', 'hat'], r: [sombra(hatC, 0.25), 'hat'] });
	}
	if (acc.has('fedora')) stamp(CX - 14, T - 7, [
		'.........hhh..hhhh.........',
		'.......hhhhhhhhhhhhhh......',
		'......hhhhhhhhhhhhhhhh.....',
		'......hhhhhhhhhhhhhhhh.....',
		'......bbbbbbbbbbbbbbbb.....',
		'..rrrrrrrrrrrrrrrrrrrrrrr..',
		'rrrrrrrrrrrrrrrrrrrrrrrrrrr'], { h: [hatC, 'hat'], b: [L.bandColor || '#1c1a2a', 'hat'], r: [sombra(hatC, 0.25), 'hat'] });
	if (acc.has('tophat')) stamp(CX - 12, T - 13, ['....hhhhhhhhhhhhhhhh....', ...Array(8).fill('....hhhhhhhhhhhhhhhh....'), '....bbbbbbbbbbbbbbbb....', '....hhhhhhhhhhhhhhhh....', 'rrrrrrrrrrrrrrrrrrrrrrrr'], { h: [hatC, 'hat'], b: [L.outfit2 || '#c4473a', 'hat'], r: [sombra(hatC, 0.3), 'hat'] });
	if (acc.has('chefhat')) stamp(CX - 11, T - 12, [
		'....wwww....wwww......',
		'..wwwwwwwwwwwwwwwww...',
		'.wwwwwwwwwwwwwwwwwwww.',
		'wwwwwwwwwwwwwwwwwwwwww',
		'wwwwwwwwwwwwwwwwwwwwww',
		'.wwwwwwwwwwwwwwwwwwww.',
		'..wwwwwwwwwwwwwwwwww..',
		'..WwwwwwwwwwwwwwwwwW..',
		'..WwwwwwwwwwwwwwwwwW..',
		'..WwwwwwwwwwwwwwwwwW..',
		'..WWWWWWWWWWWWWWWWWW..'], { w: ['#f7f4ee', 'hat'], W: ['#cfc8d8', 'hat'] });
	if (acc.has('beret')) stamp(CX - 14, T - 5, ['......bbbbbbbbbbb.......', '...bbbbbbbbbbbbbbbbb....', '.bbbbbbbbbbbbbbbbbbbbb..', 'bbbbbbbbbbbbbbbbbbbbbbbb', '.BBBBBBBBBBBBBBBBBBBBB..', '..................b.....'], { b: [L.hatColor || '#8a2e3a', 'hat'], B: [sombra(L.hatColor || '#8a2e3a', 0.3), 'hat'] });
	if (acc.has('beanie')) { const bcn = L.hatColor || out2; for (let y = T - 4; y <= T + 4; y++) sym(y, hw(Math.min(y + 4, CHIN)) + 1, (y % 2) ? bcn : sombra(bcn, 0.15), 'hat'); sym(T + 5, hw(T + 9) + 1, sombra(bcn, 0.3), 'hat'); stamp(CX - 2, T - 7, ['.pp.', 'pppp', '.pp.'], { p: [luz(bcn, 0.3), 'hat'] }); }
	if (acc.has('helmet')) { const hc = L.hatColor || '#c9ced8'; for (let y = T - 3; y <= H + 1; y++) sym(y, hw(Math.min(y + 3, CHIN)) + 2, hc, 'hat'); sym(H + 1, hw(H + 4) + 2, sombra(hc, 0.3), 'hat'); for (let y = T - 3; y <= H; y++) span(y, CX - 1, CX, luz(hc, 0.3), 'hat'); }
	if (acc.has('bandana')) { const bd = L.bandColor || '#c4473a'; for (let y = H - 1; y <= H; y++) sym(y, hw(y) + 1, y === H ? sombra(bd, 0.2) : bd, 'hat'); stamp(CX + hw(H) , H - 1, ['bb..', '.bbb', '..bb', '...b'], { b: [bd, 'hat'] }); }
	if (acc.has('headband')) { const hb = L.bandColor || out2; for (let y = T + 1; y <= T + 2; y++) sym(y, hw(y + 2) + 1, y === T + 2 ? sombra(hb, 0.2) : hb, 'hat'); }
	if (hoodC) { for (let y = T - 3; y <= H + 1; y++) { const half = hw(Math.min(y + 3, CHIN)) + 2; sym(y, half, hoodC, 'hood'); } for (let y = H + 2; y <= CHIN - 1; y++) { span(y, CX - hw(y) - 3, CX - hw(y) - 1, hoodC, 'hood'); span(y, CX + hw(y), CX + hw(y) + 2, sombra(hoodC, 0.2), 'hood'); } sym(H + 1, hw(H + 4) - 1, sombra(hoodC, 0.35), 'hood'); stamp(CX - 1, T - 5, ['hh', 'hh'], { h: [hoodC, 'hood'] }); }
	if (acc.has('goggles')) { const gy = H - 2; sym(gy + 1, hw(gy + 1) + 1, '#6b4a2b', 'acc'); stamp(CX - 9, gy - 1, ['.ffff.', 'fgggGf', 'fgGGGf', '.ffff.'], { f: ['#5a4a3a', 'acc'], g: ['#bfe6ff', 'acc'], G: ['#6fa8d8', 'acc'] }); stamp(CX + 3, gy - 1, ['.ffff.', 'fgggGf', 'fgGGGf', '.ffff.'], { f: ['#5a4a3a', 'acc'], g: ['#bfe6ff', 'acc'], G: ['#6fa8d8', 'acc'] }); }
	if (acc.has('headlamp')) { sym(H - 1, hw(H - 1) + 1, '#3a3a4a', 'acc'); stamp(CX - 2, H - 3, ['.ll.', 'lyyl', 'lyyl'], { l: ['#3a3a4a', 'acc'], y: ['#ffe680', 'acc'] }); }
	if (acc.has('flower')) stamp(CX + 6, T + 1, ['.p.', 'pyp', '.p.'], { p: ['#ff8ab3', 'acc'], y: ['#ffe08a', 'acc'] });
	if (acc.has('bow')) stamp(CX + 4, T - 2, ['bb.bb', 'bbcbb', 'b...b'], { b: ['#e05a7a', 'acc'], c: ['#b03a5a', 'acc'] });
	if (acc.has('hairstick')) { const pc = L.pinColor || '#5aa36b'; for (let k = 0; k <= 15; k++) set(CX - 8 + k, T - 11 + Math.floor(k / 3), k < 13 ? '#8a5a2f' : '#6b4a2b', 'acc'); stamp(CX - 12, T - 13, ['..gg', '.ggg', 'ggg.', 'gG..'], { g: [pc, 'acc'], G: [sombra(pc, 0.4), 'acc'] }); }
	if (acc.has('hairpin')) stamp(CX - 9, H, ['ppp'], { p: [L.pinColor || '#f2c84a', 'acc'] });
	// gafas
	const gl = L.glassColor || '#30343f';
	const gY = eyeTop - 1, gH = Math.max(tpl.length, 3) + 1;
	if (acc.has('glasses') || acc.has('squareglasses')) {
		for (const x0 of [leftX - 1, mirror(leftX + ew)]) { span(gY, x0, x0 + ew + 1, gl, 'acc'); span(gY + gH, x0, x0 + ew + 1, gl, 'acc'); for (let y = gY; y <= gY + gH; y++) { set(x0, y, gl, 'acc'); set(x0 + ew + 1, y, gl, 'acc'); } set(x0 + 1, gY + 1, '#e8f4ff', 'acc'); }
		span(gY + 1, leftX + ew + 1, mirror(leftX + ew + 1), gl, 'acc');
	}
	if (acc.has('roundglasses')) {
		for (const x0 of [leftX - 1, mirror(leftX + ew)]) { span(gY, x0 + 1, x0 + ew, gl, 'acc'); span(gY + gH, x0 + 1, x0 + ew, gl, 'acc'); for (let y = gY + 1; y < gY + gH; y++) { set(x0, y, gl, 'acc'); set(x0 + ew + 1, y, gl, 'acc'); } set(x0 + 1, gY + 1, '#e8f4ff', 'acc'); }
		span(gY + 2, leftX + ew + 1, mirror(leftX + ew + 1), gl, 'acc');
	}
	if (acc.has('halfmoon')) { // gafas de media luna, bajas
		for (const x0 of [leftX - 1, mirror(leftX + ew)]) { span(eyeY + 3, x0 + 1, x0 + ew, gl, 'acc'); set(x0, eyeY + 2, gl, 'acc'); set(x0 + ew + 1, eyeY + 2, gl, 'acc'); span(eyeY + 2, x0 + 1, x0 + ew, '#dfeefa', 'acc'); }
		span(eyeY + 2, leftX + ew + 1, mirror(leftX + ew + 1), gl, 'acc');
	}
	if (acc.has('monocle')) { const x0 = mirror(leftX + ew); span(gY, x0 + 1, x0 + ew, '#c99a2a', 'acc'); span(gY + gH, x0 + 1, x0 + ew, '#c99a2a', 'acc'); for (let y = gY + 1; y < gY + gH; y++) { set(x0, y, '#c99a2a', 'acc'); set(x0 + ew + 1, y, '#c99a2a', 'acc'); } for (let y = gY + gH + 1; y < CHIN + 3; y++) set(x0 + ew + 1 + ((y - gY) >> 2), y, '#c99a2a', 'acc'); }
	if (acc.has('eyepatch')) { stamp(mirror(leftX + ew) - 1, eyeTop - 1, ['.pppp.', 'pppppp', 'pppppp', '.pppp.'], { p: ['#20202a', 'acc'] }); for (let k = 0; k < 8; k++) set(mirror(leftX + ew) + 5 + k, eyeTop - 2 - (k >> 1), '#20202a', 'acc'); }
	if (acc.has('mask')) { // antifaz con agujeros: los ojos se ven
		const mc = L.maskColor || L.outfit2 || '#2b2b38';
		const x0 = leftX - 3, x1 = mirror(leftX - 3);
		for (let y = eyeTop - 2; y <= eyeTop + tpl.length; y++) { const inset = (y === eyeTop - 2 || y === eyeTop + tpl.length) ? 2 : 0; span(y, x0 + inset, x1 - inset, mc, 'acc'); }
		stamp(x0 - 3, eyeTop - 3, ['mm..', '.mmm', '..mm'], { m: [mc, 'acc'] }); stamp(x1, eyeTop - 3, ['..mm', 'mmm.', 'mm..'], { m: [mc, 'acc'] });
		span(eyeTop + tpl.length, CX - 1, CX, skinS, 'skin');
		if (L.maskTails !== false) stamp(x1 + 1, eyeTop, ['mm....', '.mmm..', '..mmmm', '...m.m', '....m.'], { m: [sombra(mc, 0.15), 'acc'] });
		drawEyes(frame.blink && es !== 'happy' ? tpl.map((r, j) => j === tpl.length - 1 ? r.replace(/[^.]/g, 'k') : r.replace(/[^.]/g, 'w')) : tpl);
	}
	if (acc.has('neckphones')) { const hp = L.phoneColor || '#2b2b38'; stamp(CX - 9, CHIN, ['pp..............pp', 'ppp............ppp', '.pppp........pppp.', '..pppppppppppppp..'], { p: [hp, 'acc'] }); stamp(CX - 10, CHIN - 1, ['ppp', 'ppp', 'ppp'], { p: [luz(hp, 0.2), 'acc'] }); stamp(CX + 7, CHIN - 1, ['ppp', 'ppp', 'ppp'], { p: [hp, 'acc'] }); }
	if (acc.has('headphones')) { const hp = L.phoneColor || '#2b2b38'; for (let y = T - 2; y <= T + 1; y++) sym(y, hw(Math.min(y + 2, CHIN)) + 2, hp, 'acc'); for (let y = T + 2; y <= T + 3; y++) sym(y, hw(y) + 2, null, 'x'); for (let y = T + 2; y <= eyeY + 3; y++) { span(y, CX - hw(y) - 3, CX - hw(y) - 2, hp, 'acc'); span(y, CX + hw(y) + 1, CX + hw(y) + 2, hp, 'acc'); } for (let y = eyeY; y <= eyeY + 4; y++) { span(y, CX - hw(y) - 4, CX - hw(y) - 1, hp, 'acc'); span(y, CX + hw(y), CX + hw(y) + 3, hp, 'acc'); } }
	// los auriculares no deben pintar una banda encima de la cara
	if (acc.has('headphones')) for (let y = T + 2; y <= T + 3; y++) for (let x = CX - hw(y) - 1; x <= CX + hw(y); x++) if (mat[y][x] === 'x' && !col[y][x]) mat[y][x] = '';

	// ================= 8. Sombreado direccional (luz arriba a la izquierda) =================
	const isM = (x, y, ms) => ms.includes(get(x, y));
	const shadeMat = (ms, sh, hi, opts = {}) => {
		const upd = [];
		for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
			if (!isM(x, y, ms) || (opts.keep && opts.keep.includes(get(x, y)))) continue;
			const c = col[y][x];
			const right = !isM(x + 1, y, ms) || !isM(x + 2, y, ms);
			const bottom = !isM(x, y + 1, ms);
			const topL = !isM(x - 1, y - 1, ms) && !isM(x, y - 1, ms);
			if ((right && x >= CX + (opts.rx || 0)) || (bottom && opts.bottom)) upd.push([x, y, sh(c)]);
			else if (topL && x < CX + (opts.hx || 0) && hi) upd.push([x, y, hi(c)]);
		}
		for (const [x, y, c] of upd) col[y][x] = c;
	};
	shadeMat(['hair', 'hairx', 'hairc'], c => sombra(c, 0.3), c => luz(c, lum(c) > 170 ? 0.45 : 0.35), { bottom: true, rx: 2, hx: 4, keep: ['hairc'] });
	shadeMat(['hat', 'hood'], c => sombra(c, 0.25), c => luz(c, 0.3), { rx: 3, hx: 2 });
	shadeMat(['out'], c => sombra(c, 0.25), c => luz(c, 0.2), { rx: 4 });
	// cara: sombra bajo el flequillo y en el lado derecho
	for (let y = T; y <= CHIN; y++) for (let x = 0; x < N; x++) if (get(x, y) === 'skin' && col[y][x] === skin) {
		if (isM(x, y - 1, ['hair', 'hat', 'hood', 'hairx', 'hairc'])) col[y][x] = skinS;
		else if (x >= CX + hw(y) - 2 && x < CX + hw(y)) col[y][x] = skinS;
	}
	// brillo del pelo: un arco de reflejo en la parte alta izquierda
	for (let y = T - 3; y <= T + 2; y++) for (let x = CX - 9; x <= CX - 2; x++) if (get(x, y) === 'hair' && !isM(x, y - 2, ['hair']) && isM(x, y + 1, ['hair']) && col[y][x] === hair) col[y][x] = hairH;

	// Pelo y piel de valor parecido (rubio platino sobre piel clara…): línea interior para que la cara no se pierda
	if (Math.abs(lum(hair) - lum(skin)) < 45) {
		const upd = [];
		for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) if (['hair', 'hairx'].includes(mat[y][x]) && [[0, 1], [1, 0], [-1, 0]].some(([dx, dy]) => mat[y + dy][x + dx] === 'skin')) upd.push([x, y]);
		for (const [x, y] of upd) col[y][x] = sombra(hair, 0.42);
	}
	// ================= 9. Contorno selectivo =================
	const og = col.map(r => r.slice());
	const om = mat.map(r => r.slice());
	for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
		if (og[y][x]) continue;
		let nb = null;
		for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const c = og[y + dy]?.[x + dx]; if (c) { nb = c; if (om[y + dy][x + dx] === 'skin') break; } }
		if (nb) col[y][x] = mix(sombra(nb, 0.55), '#140f24', 0.35);
	}
	// línea interior entre pelo y piel en el borde de la cara (lado derecho, más marcado)
	return col;
}

/** Máscara de silueta (true donde hay figura). */
export function siluetaMask(look) {
	const g = retratoGrid(look);
	return g.map(r => r.map(c => !!c));
}
