// Pixel art de los minijuegos: plantillas dibujadas a mano (una letra = un color de la paleta) y utilidades de pintado.
// Todo es original: objetos, herramientas, runas y paisaje. Ni Pokémon ni personajes (regla 0.2 de CLAUDE.md).
// Luz arriba a la izquierda; contorno con un tono oscuro del propio color, no negro puro.

/** Pinta una plantilla. `mono` la pinta de un solo color (siluetas). */
export function spr(ctx, tpl, pal, x, y, { mono = null, alpha = 1 } = {}) {
	x = Math.round(x); y = Math.round(y);
	if (alpha !== 1) ctx.globalAlpha = alpha;
	for (let j = 0; j < tpl.length; j++) {
		const row = tpl[j];
		for (let i = 0; i < row.length; i++) {
			const ch = row[i];
			if (ch === '.') continue;
			const col = mono || pal[ch];
			if (!col) continue;
			ctx.fillStyle = col;
			ctx.fillRect(x + i, y + j, 1, 1);
		}
	}
	if (alpha !== 1) ctx.globalAlpha = 1;
}
/** Ruido determinista 0..1 por casilla (texturas que no bailan entre fotogramas). */
export function hash2(x, y, s = 0) {
	let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 2147483647);
	n = Math.imul(n ^ (n >>> 13), 1274126177);
	return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
/** Ajusta el tamaño CSS de un lienzo de lw×lh píxeles lógicos al hueco disponible, con escala entera si cabe. */
export function fitCanvas(canvas, lw, lh, availW, availH, { maxScale = 6 } = {}) {
	let k = Math.min(availW / lw, availH / lh, maxScale);
	if (k >= 2) k = Math.floor(k);
	k = Math.max(1, k);
	canvas.style.width = Math.round(lw * k) + 'px';
	canvas.style.height = Math.round(lh * k) + 'px';
	return k;
}
/** Lienzo pequeño con una plantilla (iconos de botones). */
export function iconCanvas(tpl, pal, scale = 2) {
	const c = document.createElement('canvas');
	c.width = tpl[0].length; c.height = tpl.length;
	c.className = 'px mj-ico';
	c.style.width = c.width * scale + 'px'; c.style.height = c.height * scale + 'px';
	spr(c.getContext('2d'), tpl, pal, 0, 0);
	return c;
}

// =====================================================================================================
// Objetos enterrados (excavación a 12 px por casilla; rastreo usa los de 12×12)
// o contorno · a base · b sombra · c luz · w brillo
// =====================================================================================================
export const OBJ = {
	gem: [
		'........................',
		'........................',
		'........oooooooo........',
		'......oocccccccaoo......',
		'.....occwwccccaaaao.....',
		'....occwwcccccaaaaao....',
		'...occwwccccccaaaaaao...',
		'...occwccccccaaaaaaao...',
		'..occccccccccaaaaaaaao..',
		'..occcccccccaaaaaaaabo..',
		'..occccccccaaaaaaaabbo..',
		'..occcccccaaaaaaaabbbo..',
		'..occccaaaaaaaaaabbbbo..',
		'..ocaaaaaaaaaaaabbbbbo..',
		'..oaaaaaaaaaaaabbbbbbo..',
		'...oaaaaaaaaaabbbbbbo...',
		'...oaaaaaaaaabbbbbbbo...',
		'....oaaaaaaabbbbbbbo....',
		'.....oaaaaabbbbbbbo.....',
		'......oobbbbbbbboo......',
		'........oooooooo........',
		'........................',
		'........................',
		'........................',
	],
	// fósil: una concha en espiral dentro de su losa
	fossil: [
		'........................',
		'........................',
		'.......ooooooooo........',
		'.....ooccccccccaoo......',
		'....occcoooooocaaao.....',
		'...occooaaaaaaooaaao....',
		'...ocoaaaaaaaaaaoaao....',
		'..ocoaaaaoooooaaaoaao...',
		'..ocoaaaoocccooaaoaao...',
		'..ooaaaoocaaaaoaaaoabo..',
		'..ooaaaocaaooaaoaaoabo..',
		'..ooaaaocaoaaoaoaaoabo..',
		'..ooaaaocaoaaaaoaaoabo..',
		'..ocoaaaoaaooooaaoabbo..',
		'..ocoaaaaoaaaaaaaoabbo..',
		'...ocoaaaaoooooooabbo...',
		'...oaaoaaaaaaaaaabbbo...',
		'....oaaooaaaaaaabbbo....',
		'.....oaaaoooooobbbo.....',
		'......oobbbbbbbboo......',
		'........oooooooo........',
		'........................',
		'........................',
		'........................',
	],
	// pepita grande: bulto irregular de oro
	gold: [
		'........................',
		'........................',
		'.........ooooo..........',
		'.......oocccccoo..ooo...',
		'......occwwccccaoocaao..',
		'.....occwwcccccaaccaaao.',
		'....occwcccccaaaaaaaaao.',
		'...occccccccaaaaaaaaabo.',
		'..occcccccaaaaaabaaabbo.',
		'..occcccaaaaaaabbaaabo..',
		'.occccaaaaaaaaaaaaabbo..',
		'.occcaaaaaaaaaaaaaabbo..',
		'.ocaaaaaabaaaaaaaabbbo..',
		'.oaaaaaabbaaaaaaabbbbo..',
		'.oaaaaaaaaaaaaaabbbbo...',
		'..oaaaaaaaaaaaabbbbbo...',
		'..oaaaaaaaaabbbbbbbo....',
		'...oaaabbbbbbbbbboo.....',
		'....ooobbbbbbbooo.......',
		'.......ooooooo..........',
		'........................',
		'........................',
		'........................',
		'........................',
	],
	// bola de objeto (la de los objetos del suelo): r arriba, a abajo, k banda
	ball: [
		'........................',
		'........................',
		'........oooooooo........',
		'......oorrrrrrrroo......',
		'.....orrwwrrrrrrrro.....',
		'....orrwwrrrrrrrrrRo....',
		'...orrwwrrrrrrrrrrRRo...',
		'...orrrrrrrrrrrrrrRRo...',
		'..orrrrrrrrrrrrrrrRRRo..',
		'..orrrrrrrrkkkrrrRRRRo..',
		'..okkkkkkkkkcckkkkkkko..',
		'..okkkkkkkkcccckkkkkko..',
		'..oaaaaaaakkcckkbbbbbo..',
		'..oaaaaaaaakkkabbbbbbo..',
		'..oaaaaaaaaaaaabbbbbbo..',
		'...oaaaaaaaaaaabbbbbo...',
		'...oaaaaaaaaaabbbbbbo...',
		'....oaaaaaaaabbbbbbo....',
		'.....oaaaaaabbbbbbo.....',
		'......oobbbbbbbboo......',
		'........oooooooo........',
		'........................',
		'........................',
		'........................',
	],
	shard: [
		'............',
		'.....oo.....',
		'....occo....',
		'....ocao....',
		'...occao....',
		'...occaao...',
		'...ocwaao...',
		'..occwaao...',
		'..occcaao...',
		'..occaaabo..',
		'..occaaabo..',
		'..ocaaaabo..',
		'..ocaaaabo..',
		'..ocaaabbo..',
		'..ocaaabbo..',
		'...oaaabbo..',
		'...oaaabo...',
		'...oaabbo...',
		'....oabbo...',
		'....oabo....',
		'....oabo....',
		'.....oo.....',
		'............',
		'............',
	],
	nugget: [
		'........................',
		'......oooo....ooooo.....',
		'....oocccaoooocccaaoo...',
		'...occwccaaaacccaaaaao..',
		'..occwcccaaaaaaaaaaaabo.',
		'..occccaaaaaaaaaaaaabbo.',
		'..ocaaaaaaaaaaaaaaabbbo.',
		'..oaaaaaaaaabaaaaabbbo..',
		'...oaaabaaaabbaaabbbo...',
		'....oobbbooobbbbbooo....',
		'......ooo...ooooo.......',
		'........................',
	],
	orb: [
		'............',
		'...oooooo...',
		'..occcccao..',
		'.occwwccaao.',
		'.occwcccaao.',
		'.occcccaaao.',
		'.occccaaabo.',
		'.ocaaaaabbo.',
		'.oaaaaabbbo.',
		'..oaabbbbo..',
		'...oooooo...',
		'............',
	],
	star: [
		'............',
		'.....oo.....',
		'....occo....',
		'....ocao....',
		'.oooocaoooo.',
		'.occccaaaao.',
		'..ocwaaaao..',
		'...ocaaao...',
		'..ocaaaabo..',
		'..oaaoobbo..',
		'.oaoo..oobo.',
		'.oo......oo.',
	],
	scale: [
		'............',
		'..ooo..ooo..',
		'.occaooaaao.',
		'.ocwcaaaaao.',
		'.occaaaaabo.',
		'.ocaaaaaabo.',
		'..oaaaaabo..',
		'...oaaabo...',
		'....oabo....',
		'.....oo.....',
		'............',
		'............',
	],
};
// versiones de una casilla (rastreo y objetos apretados)
export const OBJ12 = {
	gem: [
		'............',
		'...oooooo...',
		'..occccaao..',
		'.occwccaaao.',
		'.occccaaaao.',
		'.occcaaaabo.',
		'.ocaaaaabbo.',
		'.oaaaaabbbo.',
		'.oaaaabbbbo.',
		'..oaabbbbo..',
		'...oooooo...',
		'............',
	],
	fossil: [
		'............',
		'...oooooo...',
		'..occoooao..',
		'.ocooaaaoao.',
		'.ooaaoooaoo.',
		'.ooaocaaoao.',
		'.ooaoaoaoao.',
		'.ocoaoooaoo.',
		'.oaoaaaaabo.',
		'..oaooobbo..',
		'...oooooo...',
		'............',
	],
	gold: [
		'............',
		'....ooo.oo..',
		'...occcoaao.',
		'..occwcaaao.',
		'.occccaaabo.',
		'.occaaaaabo.',
		'.ocaaabaabo.',
		'.oaaaaaabbo.',
		'..oaaabbbo..',
		'...oobboo...',
		'.....oo.....',
		'............',
	],
	ball: [
		'............',
		'...oooooo...',
		'..orrrrrro..',
		'.orwwrrrrRo.',
		'.orwrrrrRRo.',
		'.okkkkcckko.',
		'.okkkkcckko.',
		'.oaaaaaabbo.',
		'.oaaaaabbbo.',
		'..oaabbbbo..',
		'...oooooo...',
		'............',
	],
	shard: [
		'............',
		'.....oo.....',
		'....occo....',
		'....ocao....',
		'...ocwao....',
		'...occaao...',
		'...ocaabo...',
		'...ocaabo...',
		'....oabo....',
		'....oabo....',
		'.....oo.....',
		'............',
	],
	nugget: [
		'............',
		'............',
		'....ooo.....',
		'..oocccoo...',
		'.occwccaaoo.',
		'.occcaaaaao.',
		'.ocaaaabaabo',
		'.oaaaaaabbo.',
		'..oabbbbbo..',
		'...ooooo....',
		'............',
		'............',
	],
	orb: null, star: null, scale: null,
};
OBJ12.orb = OBJ.orb; OBJ12.star = OBJ.star; OBJ12.scale = OBJ.scale;

const P3 = (o, b, a, c, w = '#ffffff') => ({ o, b, a, c, w });
const STONE = {
	firestone: P3('#6b2413', '#c2452a', '#f08a3c', '#ffd27a'),
	waterstone: P3('#173a73', '#2f6fc4', '#58a6ee', '#b8e3ff'),
	thunderstone: P3('#4b5a12', '#8aa51f', '#d6e34a', '#fbffb0'),
	leafstone: P3('#1d4a26', '#3d8a3f', '#7cc85a', '#d3f2a0'),
	moonstone: P3('#23233a', '#45456b', '#77779c', '#c2c2dc'),
	sunstone: P3('#7a3210', '#d86a1e', '#f7a43a', '#ffe08a'),
	dawnstone: P3('#17514f', '#2f9a8f', '#74d6c4', '#d5fff4'),
	duskstone: P3('#2b1740', '#573083', '#8a5cc0', '#d0b0f0'),
	shinystone: P3('#6d6230', '#cfc27a', '#f4ecb6', '#ffffff'),
	icestone: P3('#24506b', '#4f9cc2', '#9bdcf2', '#e8fbff'),
	everstone: P3('#33373f', '#5e6672', '#8d96a3', '#c9d0d9'),
	hardstone: P3('#2e2a26', '#5a5148', '#877a6c', '#b9ad9d'),
	ovalstone: P3('#5b5a52', '#a3a195', '#d5d3c6', '#f6f5ee'),
	floatstone: P3('#3e4a63', '#7689ab', '#a9b9d6', '#e3ebf8'),
	redshard: P3('#6b1418', '#b8262c', '#e85a50', '#ffb3a6'),
	blueshard: P3('#142a6b', '#2649b8', '#5080e8', '#a6c8ff'),
	yellowshard: P3('#6b5010', '#b88e1c', '#e8c440', '#fff0a0'),
	greenshard: P3('#145020', '#268a3a', '#50c868', '#a6f0b0'),
};
const KIND_PAL = {
	gem: P3('#3a2a55', '#6a4fa0', '#9a7fd0', '#d8c8f8'),
	fossil: P3('#4a3a26', '#8f7650', '#c4aa7c', '#ecdcb4'),
	gold: P3('#6a4208', '#c48a14', '#f2c63a', '#fff2a0'),
	nugget: P3('#6a4208', '#c48a14', '#f2c63a', '#fff2a0'),
	shard: P3('#1e3f5c', '#3f7fb0', '#7fc0e6', '#d8f2ff'),
	orb: P3('#5c5a70', '#b4b2c8', '#e6e4f2', '#ffffff'),
	star: P3('#7a4a10', '#e0982a', '#ffd95a', '#fff8c8'),
	scale: P3('#7a2848', '#d85a8a', '#f79ab8', '#ffdbe8'),
	ball: { o: '#2a2028', r: '#e5484d', R: '#a82a34', k: '#2a2028', a: '#f2efe6', b: '#bdb8ab', c: '#ffffff', w: '#ffd0d0' },
};
/** Paleta de un objeto enterrado: las piedras evolutivas y las esquirlas llevan su color. */
export function objPal(id, kind) {
	if (kind === 'ball') return KIND_PAL.ball;
	if (STONE[id]) return STONE[id];
	if (kind === 'orb' && /bigpearl|pearlstring/.test(id)) return P3('#5a4a70', '#b09ac8', '#eadcf6', '#ffffff');
	if (kind === 'star' && /comet|meteor/.test(id)) return P3('#1e3a6b', '#3f7fd0', '#8fd0ff', '#ffffff');
	if (kind === 'shard') { const m = /^(fire|water|electric|grass|ice|fighting|poison|ground|flying|psychic|bug|rock|ghost|dragon|dark|steel|fairy|normal)tera/.exec(id); if (m) return { fire: STONE.redshard, water: STONE.blueshard, electric: STONE.yellowshard, grass: STONE.greenshard }[m[1]] || KIND_PAL.shard; }
	return KIND_PAL[kind] || KIND_PAL.gem;
}
/** Dibuja un objeto de la carga. `small` usa la versión de una casilla. */
export function drawObj(ctx, id, kind, x, y, { small = false, mono = null, alpha = 1 } = {}) {
	const tpl = small ? (OBJ12[kind] || OBJ12.ball) : (OBJ[kind] || OBJ.ball);
	spr(ctx, tpl, objPal(id, kind), x, y, { mono, alpha });
}

// =====================================================================================================
// Excavación: capas de la pared (12×12 por casilla), herramientas
// =====================================================================================================
export const DIG_THEMES = {
	//          suelo            capa 1 (polvo)     capa 2 (tierra)    capa 3 (roca)
	cueva: { f: ['#2a1f1c', '#352723', '#1f1614'], l1: ['#c9a876', '#dcc091', '#a88a5c'], l2: ['#8a5a3a', '#a06c48', '#6c442a'], l3: ['#6f7480', '#878d9a', '#535862'] },
	cantera: { f: ['#2b2620', '#383128', '#1e1a16'], l1: ['#d8c8a4', '#eadcbc', '#b4a480'], l2: ['#a4845a', '#b8986c', '#806444'], l3: ['#8a8478', '#a39d90', '#68635a'] },
	hielo: { f: ['#1c2c40', '#26384f', '#142030'], l1: ['#e4f4fc', '#ffffff', '#b8d8ea'], l2: ['#8fc0e0', '#a8d4ee', '#6c9cc0'], l3: ['#5878a0', '#6c8cb4', '#415c80'] },
	ruina: { f: ['#2a2418', '#362e20', '#1e1a10'], l1: ['#d4c08c', '#e6d4a4', '#b09c68'], l2: ['#9c8454', '#b09868', '#7a663e'], l3: ['#7c7460', '#948c76', '#5e5846'] },
};
/** Pinta una casilla de pared a su profundidad, con relieve según las vecinas (dN, dW, dS, dE = profundidades alrededor). */
export function digCell(ctx, theme, x, y, depth, nb, seed = 0) {
	const T = DIG_THEMES[theme] || DIG_THEMES.cueva;
	const [base, hi, lo] = depth <= 0 ? T.f : depth === 1 ? T.l1 : depth === 2 ? T.l2 : T.l3;
	const ox = x * 12, oy = y * 12;
	ctx.fillStyle = base; ctx.fillRect(ox, oy, 12, 12);
	// textura: motas claras y oscuras fijas por casilla; la roca lleva grietas, la tierra piedrecitas
	const n = depth >= 3 ? 5 : depth === 2 ? 6 : depth === 1 ? 4 : 5;
	for (let i = 0; i < n; i++) {
		const px = Math.floor(hash2(x, y, seed + i * 7 + depth) * 11), py = Math.floor(hash2(y, x, seed + i * 13 + depth * 3) * 11);
		ctx.fillStyle = i % 2 ? hi : lo;
		if (depth >= 3 && i < 2) ctx.fillRect(ox + px, oy + py, i ? 3 : 1, i ? 1 : 3);
		else if (depth === 2 && i < 2) ctx.fillRect(ox + px, oy + py, 2, 2);
		else ctx.fillRect(ox + px, oy + py, 1, 1);
	}
	if (depth <= 0) {
		// sombra que proyectan las casillas más altas de arriba y de la izquierda
		ctx.fillStyle = 'rgba(0,0,0,.38)';
		if (nb[0] > 0) ctx.fillRect(ox, oy, 12, 2);
		if (nb[1] > 0) ctx.fillRect(ox, oy, 2, 12);
		return;
	}
	// relieve: borde claro arriba/izquierda y oscuro abajo/derecha donde la vecina está más baja
	if (nb[0] < depth) { ctx.fillStyle = hi; ctx.fillRect(ox, oy, 12, 1); }
	if (nb[1] < depth) { ctx.fillStyle = hi; ctx.fillRect(ox, oy, 1, 12); }
	if (nb[2] < depth) { ctx.fillStyle = lo; ctx.fillRect(ox, oy + 11, 12, 1); }
	if (nb[3] < depth) { ctx.fillStyle = lo; ctx.fillRect(ox + 11, oy, 1, 12); }
	if (nb[0] > depth) { ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(ox, oy, 12, 1); }
	if (nb[1] > depth) { ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(ox, oy, 1, 12); }
}
export const SPARK = [
	'..w..',
	'..w..',
	'wwWww',
	'..w..',
	'..w..',
];
export const SPARK_S = ['.w.', 'wWw', '.w.'];
export const SPARK_PAL = { w: '#fff6c8', W: '#ffffff' };

export const TOOL = {
	pick: [
		'................',
		'....kkkkkkk.....',
		'..kkmmmmmmMkk...',
		'.kmMkkkkkmmMMk..',
		'.kk.....khhkmMk.',
		'.......khHhkkmk.',
		'......khHhk.kMk.',
		'.....khHhk..kmk.',
		'....khHhk....kk.',
		'...khHhk........',
		'..khHhk.........',
		'.khHhk..........',
		'.khhk...........',
		'..kk............',
		'................',
		'................',
	],
	hammer: [
		'................',
		'.....kkkkkkkk...',
		'....kMMMMMMMmk..',
		'....kMmmmmmmmk..',
		'....kmmmmmmmdk..',
		'....kmmmmmmddk..',
		'.....kkkhhkkk...',
		'.......khHk.....',
		'.......khHk.....',
		'.......khHk.....',
		'.......khHk.....',
		'.......khHk.....',
		'.......khHk.....',
		'.......khhk.....',
		'........kk......',
		'................',
	],
};
export const TOOL_PAL = { k: '#1a1612', m: '#9aa3b2', M: '#dfe5ee', d: '#5d6675', h: '#8a5a2c', H: '#c08a4a' };

// =====================================================================================================
// Cosecha: bayas, cosas que no quieres, cesta
// =====================================================================================================
export const BERRY = [
	'.....gg...',
	'...gGg....',
	'..oogooo..',
	'.occaaaao.',
	'occwaaaabo',
	'ocwaaaaabo',
	'ocaaaaabbo',
	'oaaaaabbbo',
	'.oaabbbbo.',
	'..oooooo..',
];
export const CONE = [
	'....kk....',
	'...kddk...',
	'..kdDdDk..',
	'.kDdkdkDk.',
	'.kdkDdDkk.',
	'kDdDkdkdDk',
	'kdkdDkDdkk',
	'.kDkdDkdk.',
	'.kkdDkdkk.',
	'..kkdkkk..',
	'....kk....',
];
export const ROT = [
	'..........',
	'...v..v...',
	'..oo.ooo..',
	'.oppopppo.',
	'opPppmpppo',
	'opppppppmo',
	'ompppPpppo',
	'opppmppppo',
	'.opppppmo.',
	'..oooooo..',
];
export const BASKET = [
	'..kkkkkkkkkkkkkkkkkkkkkkkk..',
	'.kHHHHHHHHHHHHHHHHHHHHHHHHk.',
	'kHhhhhhhhhhhhhhhhhhhhhhhhhhk',
	'kkkkkkkkkkkkkkkkkkkkkkkkkkkk',
	'.khHhdhHhdhHhdhHhdhHhdhHhdk.',
	'.kHhdhHhdhHhdhHhdhHhdhHhdhk.',
	'.khdhHhdhHhdhHhdhHhdhHhdhHk.',
	'..kdHhdhHhdhHhdhHhdhHhdhdk..',
	'..khHhdhHhdhHhdhHhdhHhdhhk..',
	'...kHhdhHhdhHhdhHhdhHhddk...',
	'...kkdhHhdhHhdhHhdhHhddkk...',
	'.....kkkkkkkkkkkkkkkkkk.....',
];
export const BASKET_PAL = { k: '#3a2410', H: '#e2b46a', h: '#c08a44', d: '#8a5a26' };
export const BAD_PAL = { k: '#2a1a0e', d: '#6a4424', D: '#9a6a3a', o: '#241426', p: '#5a3a5c', P: '#7a5680', m: '#7a8a3a', v: '#9ab04a' };
const B3 = (o, b, a, c) => ({ o, b, a, c, w: '#ffffff', g: '#2f7a3a', G: '#6cc85a' });
const BERRIES = {
	oranberry: B3('#16306b', '#2a56b8', '#4c86ee', '#a8ccff'),
	sitrusberry: B3('#6b5210', '#c89a20', '#f4d048', '#fff4b0'),
	pechaberry: B3('#7a2850', '#d8609a', '#f8a0c4', '#ffe0ee'),
	cheriberry: B3('#6b1418', '#c02830', '#f05a58', '#ffb8b0'),
	rawstberry: B3('#16506b', '#2a94b8', '#58c8e8', '#c0f0ff'),
	aspearberry: B3('#6b6a20', '#c0be48', '#eeec80', '#ffffd0'),
	leppaberry: B3('#6b2a10', '#c8541e', '#f48a48', '#ffd0a8'),
	lumberry: B3('#1d5a26', '#3aa048', '#78d870', '#d0ffc0'),
	razzberry: B3('#6b1430', '#c02858', '#f05888', '#ffb8d0'),
	nanabberry: B3('#7a4a50', '#e0a0a8', '#fbd0d0', '#fff0f0'),
	pinapberry: B3('#6b4a10', '#c88a20', '#f4b848', '#ffe8a8'),
	chestoberry: B3('#201a50', '#40389a', '#6a60d0', '#b8b0ff'),
	persimberry: B3('#6b3a30', '#c87868', '#f0a898', '#ffe0d8'),
	honey: B3('#6b4208', '#d08a14', '#f8c040', '#fff0a8'),
	tinymushroom: B3('#6b2a20', '#c8604a', '#f09880', '#ffe0d0'),
};
const BERRY_ANY = B3('#3a1a5c', '#6a38a8', '#9a68d8', '#d8c0ff');
export const GOLD_BERRY = { ...B3('#7a4a08', '#d89a14', '#ffd84a', '#fffbd0'), g: '#b8860a', G: '#ffe890' };
export const berryPal = id => BERRIES[id] || BERRY_ANY;

// =====================================================================================================
// Pesca
// =====================================================================================================
export const BOBBER = [
	'..kk..',
	'.krrk.',
	'krwrrk',
	'krrrrk',
	'kwwwwk',
	'kwwwck',
	'.kwck.',
	'..kk..',
];
export const BOBBER_PAL = { k: '#1c1420', r: '#e5484d', w: '#f6f1e4', c: '#c8c0b0' };
export const BANG = [
	'.kkkk.',
	'kyyyyk',
	'kyyyyk',
	'kyyyyk',
	'kyyyyk',
	'.kyyk.',
	'.kyyk.',
	'..kk..',
	'.kkkk.',
	'kyyyyk',
	'kyyyyk',
	'.kkkk.',
];
export const BANG_PAL = { k: '#3a1a08', y: '#ffd84a' };
// sombra bajo el agua: solo una mancha con cola; nunca se ve qué es hasta sacarlo
export const SHADOW_S = [
	'...ssssss.....s.',
	'.ssssssssss..ss.',
	'sssssssssssssss.',
	'.ssssssssss..ss.',
	'...ssssss.....s.',
];
export const SHADOW_L = [
	'.....ssssssssss.........s.',
	'...ssssssssssssss......ss.',
	'.sssssssssssssssssss..sss.',
	'ssssssssssssssssssssssss..',
	'.sssssssssssssssssss..sss.',
	'...ssssssssssssss......ss.',
	'.....ssssssssss.........s.',
];

// =====================================================================================================
// Rastreo: marcas de temperatura (forma distinta además del color)
// =====================================================================================================
export const MARK = {
	cold: [
		'............',
		'............',
		'............',
		'............',
		'.....mm.....',
		'....mMMm....',
		'....mMMm....',
		'.....mm.....',
		'............',
		'............',
		'............',
		'............',
	],
	warm: [
		'............',
		'............',
		'....mmmm....',
		'...mMMMMm...',
		'..mMm..mMm..',
		'..mM....Mm..',
		'..mM....Mm..',
		'..mMm..mMm..',
		'...mMMMMm...',
		'....mmmm....',
		'............',
		'............',
	],
	hot: [
		'............',
		'...mmmmmm...',
		'..mMMMMMMm..',
		'.mMm....mMm.',
		'.mM..mm..Mm.',
		'.mM.mMMm.Mm.',
		'.mM.mMMm.Mm.',
		'.mM..mm..Mm.',
		'.mMm....mMm.',
		'..mMMMMMMm..',
		'...mmmmmm...',
		'............',
	],
	near: [
		'.....mm.....',
		'.m...mM...m.',
		'..m..mM..m..',
		'...m.mM.m...',
		'............',
		'mmm..MM..mmm',
		'mMM..MM..MMm',
		'............',
		'...m.mM.m...',
		'..m..mM..m..',
		'.m...mM...m.',
		'.....mm.....',
	],
	none: [
		'............',
		'............',
		'............',
		'............',
		'............',
		'...mmmmmm...',
		'...mMMMMm...',
		'............',
		'............',
		'............',
		'............',
		'............',
	],
};
export const MARK_PAL = {
	cold: { m: '#1f3f7a', M: '#6fa0f0' },
	warm: { m: '#7a5a10', M: '#f5c542' },
	hot: { m: '#7a2410', M: '#ff7a3a' },
	near: { m: '#7a1030', M: '#ffffff' },
	none: { m: '#30343c', M: '#6a7080' },
};
export const AURA_THEMES = {
	ruina: ['#34364a', '#474a62', '#232538'],
	playa: ['#4a4636', '#5e5a46', '#353224'],
	campo: ['#22402e', '#2e543c', '#152c1e'],
	cueva: ['#2e2a38', '#3e394c', '#1e1b28'],
	buscaobjetos: ['#1c3a2e', '#285240', '#11281e'],
};

// =====================================================================================================
// Cerradura: seis runas originales de 12×12 (formas bien distintas: no dependen del color)
// =====================================================================================================
export const RUNES = [
	[ // espiral cuadrada
		'############',
		'#..........#',
		'#.########.#',
		'#.#......#.#',
		'#.#.####.#.#',
		'#.#.#..#.#.#',
		'#.#.#.##.#.#',
		'#.#.#....#.#',
		'#.#.######.#',
		'#.#........#',
		'#.##########',
		'#...........',
	].map(r => r.replace(/#/g, 'x')),
	[ // tridente
		'x....xx....x',
		'x....xx....x',
		'x....xx....x',
		'x....xx....x',
		'xx...xx...xx',
		'.xx..xx..xx.',
		'..xxxxxxxx..',
		'....xxxx....',
		'.....xx.....',
		'.....xx.....',
		'...xxxxxx...',
		'...xxxxxx...',
	],
	[ // ojo en rombo
		'.....xx.....',
		'....xxxx....',
		'...xx..xx...',
		'..xx....xx..',
		'.xx..xx..xx.',
		'xx..xxxx..xx',
		'xx..xxxx..xx',
		'.xx..xx..xx.',
		'..xx....xx..',
		'...xx..xx...',
		'....xxxx....',
		'.....xx.....',
	],
	[ // olas
		'............',
		'..xx....xx..',
		'.xxxx..xxxx.',
		'xx..xxxx..xx',
		'x....xx....x',
		'............',
		'..xx....xx..',
		'.xxxx..xxxx.',
		'xx..xxxx..xx',
		'x....xx....x',
		'............',
		'............',
	],
	[ // tres puntos en triángulo
		'....xxxx....',
		'....xxxx....',
		'....xxxx....',
		'....xxxx....',
		'............',
		'............',
		'............',
		'xxxx....xxxx',
		'xxxx....xxxx',
		'xxxx....xxxx',
		'xxxx....xxxx',
		'............',
	],
	[ // sol: aro con cruz
		'.....xx.....',
		'.....xx.....',
		'..x.xxxx.x..',
		'...xx..xx...',
		'..xx....xx..',
		'xxx......xxx',
		'xxx......xxx',
		'..xx....xx..',
		'...xx..xx...',
		'..x.xxxx.x..',
		'.....xx.....',
		'.....xx.....',
	],
];
// color de cada runa: fondo apagado, fondo encendido, tinta apagada (≥ 4,5:1 sobre el fondo apagado)
export const RUNE_COL = [
	{ off: '#5a1f24', on: '#ff6a6a', ink: '#ffc9c2' },
	{ off: '#1c356e', on: '#6aa8ff', ink: '#c4dcff' },
	{ off: '#5c4a0e', on: '#ffd84a', ink: '#ffeeb0' },
	{ off: '#1a4a2a', on: '#5ee08a', ink: '#c2f5d2' },
	{ off: '#3e2460', on: '#b88aff', ink: '#e0ccff' },
	{ off: '#5c3210', on: '#ff9a4a', ink: '#ffd8b8' },
];
export const LOCK_THEMES = {
	cofre: { wood: '#8a5a2c', woodHi: '#b07a40', woodLo: '#5c3a1a', metal: '#d8a838', metalHi: '#ffe08a', metalLo: '#8a6a18', dark: '#2a1a0c', inside: '#1a100a' },
	ruina: { wood: '#8c8468', woodHi: '#aaa284', woodLo: '#625c46', metal: '#5e9a8a', metalHi: '#9ad8c4', metalLo: '#346454', dark: '#2a281e', inside: '#14130e' },
	caja: { wood: '#5a6478', woodHi: '#7a869c', woodLo: '#3a4254', metal: '#b8c0cc', metalHi: '#f0f4f8', metalLo: '#6a7484', dark: '#1a1e28', inside: '#0c0e14' },
};
