// Cuadros «de acuarela» para objetos clave que se pueden mirar.
// Fondo y personas: pintados por código con veladuras de bordes irregulares, granulado y textura de papel.
// Pokémon: su arte oficial descargado en tiempo de ejecución (PokeAPI), pasado por un filtro de acuarela; no se dibujan a mano.
import { D, toID } from '../data.js';
import { G } from '../state.js';
import { h } from './core.js';

const PK = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const SKINS = ['#ffe0c7', '#f5cba7', '#e0ac85', '#c68863', '#9a6646', '#6e4630'];
const PAPER = [243, 236, 220];

function mulberry(seed) {
	let a = typeof seed === 'number' ? seed : [...String(seed)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) | 0, 7);
	return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hex2 = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const rgba = (hex, a) => { const [r, g, b] = hex2(hex); return `rgba(${r},${g},${b},${a})`; };
const shade = (hex, k) => { const c = hex2(hex).map(v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)))); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };

/** Polígono con bordes temblorosos: cada lado se subdivide y se desplaza al azar. */
function roughPath(ctx, R, pts, amp, seg = 5) {
	ctx.beginPath();
	for (let i = 0; i < pts.length; i++) {
		const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
		const nx = -(y2 - y1), ny = x2 - x1, len = Math.hypot(nx, ny) || 1;
		for (let k = 0; k < seg; k++) {
			const t = k / seg, o = (R() - 0.5) * amp;
			const x = x1 + (x2 - x1) * t + nx / len * o, y = y1 + (y2 - y1) * t + ny / len * o;
			if (i === 0 && k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
		}
	}
	ctx.closePath();
}
const ellipsePts = (cx, cy, rx, ry, n = 18, a0 = 0, a1 = Math.PI * 2) => Array.from({ length: n }, (_, i) => { const a = a0 + (a1 - a0) * i / (n - (a1 - a0 >= Math.PI * 2 ? 0 : 1)); return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });

/** Veladura: varias capas translúcidas de la misma forma (cada una tiembla distinto) + borde de pigmento. */
function wash(ctx, R, pts, color, { layers = 4, alpha = 0.2, amp = 3, blur = 1.2, edge = 0.28, seg = 5 } = {}) {
	ctx.save();
	for (let i = 0; i < layers; i++) {
		ctx.filter = `blur(${blur}px)`;
		ctx.globalAlpha = alpha * (0.7 + R() * 0.6);
		ctx.fillStyle = i % 2 ? color : shade(color, (R() - 0.5) * 0.12);
		roughPath(ctx, R, pts, amp, seg);
		ctx.fill();
	}
	if (edge) {
		ctx.filter = 'blur(0.6px)';
		ctx.globalAlpha = edge;
		ctx.strokeStyle = shade(color, -0.32);
		ctx.lineWidth = 1.1;
		roughPath(ctx, R, pts, amp * 0.6, seg);
		ctx.stroke();
	}
	ctx.restore();
}
/** Floraciones: manchas suaves de agua y pigmento. */
function blooms(ctx, R, x, y, w, hgt, color, n, size, a = 0.18) {
	ctx.save();
	ctx.filter = 'blur(5px)';
	for (let i = 0; i < n; i++) {
		const cx = x + R() * w, cy = y + R() * hgt, r = size * (0.5 + R());
		const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
		g.addColorStop(0, rgba(color, a * (0.7 + R() * 0.6)));
		g.addColorStop(0.7, rgba(color, a * 0.35));
		g.addColorStop(1, rgba(color, 0));
		ctx.fillStyle = g;
		ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
	}
	ctx.restore();
}

/** Pasada final sobre píxeles: textura de papel, granulado del pigmento y bordes húmedos. */
function watercolorPass(ctx, W, H, seed) {
	let img;
	try { img = ctx.getImageData(0, 0, W, H); } catch (e) { return false; } // lienzo «contaminado»: se omite
	const d = img.data, R = mulberry(seed);
	// ruido de valor (papel) con dos octavas
	const grid = (s) => { const gw = Math.ceil(W / s) + 2, gh = Math.ceil(H / s) + 2; const g = new Float32Array(gw * gh).map(() => R()); return (x, y) => { const fx = (x / s) % (gw - 2), fy = (y / s) % (gh - 2), ix = fx | 0, iy = fy | 0, tx = fx - ix, ty = fy - iy; const a = g[iy * gw + ix], b = g[iy * gw + ix + 1], c = g[(iy + 1) * gw + ix], e = g[(iy + 1) * gw + ix + 1]; const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty); return a + (b - a) * sx + (c - a) * sy + (a - b - c + e) * sx * sy; }; };
	const n1 = grid(9), n2 = grid(3);
	for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
		const i = (y * W + x) * 4;
		const paper = 0.955 + 0.03 * n1(x, y) + 0.015 * n2(x, y);
		// cuánto pigmento hay (distancia al color del papel)
		const pig = Math.min(1, (Math.abs(d[i] - PAPER[0]) + Math.abs(d[i + 1] - PAPER[1]) + Math.abs(d[i + 2] - PAPER[2])) / 160);
		const gran = 1 - pig * (R() < 0.18 ? 0.09 * R() : 0) - pig * 0.04 * n2(x * 1.7, y * 1.7);
		const k = paper * gran;
		d[i] *= k; d[i + 1] *= k; d[i + 2] *= k;
	}
	ctx.putImageData(img, 0, 0);
	return true;
}

/** Carga una imagen como bitmap legible (CORS) para poder tratar sus píxeles; si no, como <img> normal. */
async function loadArt(urls) {
	for (const u of urls) {
		try {
			const r = await fetch(u, { mode: 'cors' });
			if (r.ok && r.type !== 'opaque') return await createImageBitmap(await r.blob());
		} catch (e) { /* siguiente */ }
	}
	return await new Promise(resolve => {
		let i = 0; const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => { i++; if (i < urls.length) img.src = urls[i]; else resolve(null); };
		img.src = urls[0];
	});
}

/** Pokémon en acuarela: colores aclarados, bordes de pigmento más oscuros y contorno irregular. */
function paintMon(ctx, img, x, y, size, seed) {
	const off = document.createElement('canvas');
	off.width = off.height = size;
	const o = off.getContext('2d');
	o.filter = 'blur(0.5px)';
	o.drawImage(img, 0, 0, size, size);
	try {
		const im = o.getImageData(0, 0, size, size), d = im.data, R = mulberry(seed);
		const A = (xx, yy) => (xx < 0 || yy < 0 || xx >= size || yy >= size) ? 0 : d[(yy * size + xx) * 4 + 3];
		const out = new Uint8ClampedArray(d);
		for (let yy = 0; yy < size; yy++) for (let xx = 0; xx < size; xx++) {
			const i = (yy * size + xx) * 4, a = d[i + 3];
			if (!a) continue;
			// borde: cerca de un píxel transparente
			const rim = Math.min(A(xx - 2, yy), A(xx + 2, yy), A(xx, yy - 2), A(xx, yy + 2)) < 40;
			for (let c = 0; c < 3; c++) {
				let v = d[i + c];
				v = Math.round(v / 20) * 20;                 // tonos planos, como veladuras
				v = v * 0.82 + PAPER[c] * 0.18;              // transparencia: deja ver el papel
				if (rim) v *= 0.72;                          // pigmento acumulado en el borde
				out[i + c] = v * (0.96 + R() * 0.06);        // granulado
			}
			out[i + 3] = rim && R() < 0.35 ? a * 0.5 : a; // borde irregular
		}
		im.data.set(out);
		o.putImageData(im, 0, 0);
	} catch (e) {
		o.filter = 'saturate(0.8) contrast(0.92) brightness(1.06)'; // sin acceso a píxeles: filtro sencillo
	}
	ctx.save();
	ctx.globalAlpha = 0.25; ctx.filter = 'blur(1.5px) brightness(0.55)';
	ctx.drawImage(off, x + 1.5, y + 2);
	ctx.restore();
	ctx.drawImage(off, x, y);
}

/** Cuadro: tú en el puente de Pueblo Acuarela, con tu Riolu a los pies y un halo azul alrededor de él. */
export function paintAcuarelaRiolu({ look = {}, shiny = false } = {}) {
	const W = 480, H = 360;
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H;
	cv.className = 'acuarela';
	const ctx = cv.getContext('2d');
	const R = mulberry('acuarela-' + (G?.player?.id || 1));
	const M = 16; // margen de papel sin pintar
	ctx.fillStyle = `rgb(${PAPER.join(',')})`;
	ctx.fillRect(0, 0, W, H);

	// --- cielo (amanecer: azul arriba, melocotón cerca del horizonte)
	wash(ctx, R, [[M, M], [W - M, M], [W - M, 170], [M, 170]], '#a9c8e8', { layers: 5, alpha: 0.22, amp: 8, blur: 3, edge: 0 });
	wash(ctx, R, [[M, 118], [W - M, 104], [W - M, 178], [M, 178]], '#f3c9a0', { layers: 4, alpha: 0.2, amp: 10, blur: 5, edge: 0 });
	blooms(ctx, R, M, M, W - 2 * M, 90, '#86acd8', 10, 38, 0.2);
	for (let i = 0; i < 3; i++) { const cx = 70 + i * 150 + R() * 40, cy = 50 + R() * 30; for (let j = 0; j < 3; j++) wash(ctx, R, ellipsePts(cx + (j - 1) * 24 + R() * 8, cy + (j === 1 ? -6 : 0), 26 + R() * 12, 10 + R() * 6, 12), '#ffffff', { layers: 3, alpha: 0.32, amp: 7, blur: 3, edge: 0 }); }
	// --- colinas: lejanas (azuladas) y cercanas (verdes)
	wash(ctx, R, [[M, 150], [110, 126], [210, 142], [300, 120], [400, 136], [W - M, 124], [W - M, 196], [M, 196]], '#9fb8b8', { layers: 4, alpha: 0.24, amp: 5 });
	wash(ctx, R, [[M, 168], [90, 150], [180, 162], [260, 152], [350, 164], [W - M, 150], [W - M, 206], [M, 206]], '#86ad84', { layers: 4, alpha: 0.26, amp: 5 });
	// --- casas del pueblo
	for (let i = 0; i < 7; i++) {
		const hx = 30 + i * 64 + R() * 16, hw = 22 + R() * 14, hy = 152 + R() * 10, hh = 18 + R() * 8;
		const col = ['#e2b28c', '#efdcb6', '#bccbdc', '#dcb8c8', '#e8c99a'][i % 5];
		wash(ctx, R, [[hx, hy], [hx + hw, hy], [hx + hw, hy + hh], [hx, hy + hh]], col, { layers: 3, alpha: 0.38, amp: 1.6 });
		wash(ctx, R, [[hx - 4, hy + 1], [hx + hw / 2, hy - 11], [hx + hw + 4, hy + 1]], i % 2 ? '#b0604c' : '#7f8fa6', { layers: 3, alpha: 0.38, amp: 1.4 });
		ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#5a6a86'; ctx.fillRect(hx + hw * 0.35, hy + hh * 0.35, 4, 5); ctx.restore();
	}
	// --- árboles junto al río
	for (const tx of [40, 448]) { wash(ctx, R, ellipsePts(tx, 182, 26, 30, 16), '#5f8f5c', { layers: 4, alpha: 0.3, amp: 7 }); blooms(ctx, R, tx - 22, 160, 44, 40, '#3f6f48', 4, 12, 0.22); }
	// --- río
	wash(ctx, R, [[M, 236], [W - M, 232], [W - M, H - M], [M, H - M]], '#6c9bcc', { layers: 5, alpha: 0.24, amp: 6, blur: 2.2, edge: 0 });
	blooms(ctx, R, M, 250, W - 2 * M, 80, '#3f6fa8', 8, 26, 0.16);
	// --- puente de piedra: tablero, arco y su reflejo
	const deck = 214;
	wash(ctx, R, [[M, deck - 4], [W - M, deck - 8], [W - M, deck + 40], [M, deck + 42]], '#cfae86', { layers: 4, alpha: 0.36, amp: 3 });
	for (let i = 0; i < 14; i++) { const sx = M + 8 + i * 32 + R() * 8, sy = deck + 8 + (i % 2) * 14; ctx.save(); ctx.globalAlpha = 0.22; ctx.strokeStyle = '#8a6a48'; ctx.lineWidth = 1; ctx.strokeRect(sx, sy, 22 + R() * 6, 10); ctx.restore(); }
	wash(ctx, R, ellipsePts(W / 2, deck + 42, 96, 30, 20, Math.PI, Math.PI * 2), '#3c5c84', { layers: 4, alpha: 0.26, amp: 2 });
	wash(ctx, R, [[W / 2 - 84, deck + 34], [W / 2 + 84, deck + 34], [W / 2 + 92, deck + 42], [W / 2 - 92, deck + 42]], '#7fa8d4', { layers: 2, alpha: 0.3, amp: 2, edge: 0 });
	wash(ctx, R, ellipsePts(W / 2, deck + 46, 92, 26, 20, 0, Math.PI), '#2f4c70', { layers: 3, alpha: 0.14, amp: 4, blur: 3, edge: 0 }); // reflejo
	ctx.save();
	for (let i = 0; i < 26; i++) { ctx.globalAlpha = 0.3 + R() * 0.35; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1 + R() * 1.2; const yy = 268 + R() * 70, xx = 24 + R() * (W - 90); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 16 + R() * 44, yy + (R() - 0.5) * 2); ctx.stroke(); }
	ctx.restore();
	// --- barandilla (detrás de las figuras)
	ctx.save();
	ctx.strokeStyle = 'rgba(96,70,46,.6)'; ctx.lineWidth = 2.2; ctx.filter = 'blur(0.5px)';
	ctx.beginPath(); ctx.moveTo(M, deck - 34); ctx.lineTo(W - M, deck - 38); ctx.stroke();
	ctx.lineWidth = 1.6;
	for (let xx = M + 10; xx < W - M; xx += 30) { const t = (xx - M) / (W - 2 * M); ctx.beginPath(); ctx.moveTo(xx, deck - 34 - t * 4); ctx.lineTo(xx + 1, deck - 3 - t * 4); ctx.stroke(); }
	ctx.restore();

	// --- tú: de pie en el puente, mirando al pintor (figura suelta, sin detalle de cara, como en un apunte)
	const skin = typeof look.skin === 'number' ? SKINS[look.skin] || SKINS[1] : (look.skin || SKINS[1]);
	const hair = look.hairColor || '#5a3a26', outfit = look.outfit || '#4c7cf0', outfit2 = look.outfit2 || '#f3e6c4';
	const fx = 206, feet = deck - 2, head = feet - 112;
	const longHair = ['long', 'ponytail', 'braids', 'tied', 'bob'].includes(look.hair);
	if (longHair) wash(ctx, R, [[fx - 11, head + 2], [fx + 11, head + 2], [fx + 13, head + 34], [fx - 13, head + 34]], hair, { layers: 3, alpha: 0.45, amp: 3 });
	wash(ctx, R, [[fx - 9, feet - 52], [fx - 1, feet - 52], [fx - 3, feet - 2], [fx - 11, feet - 2]], '#3d4762', { layers: 3, alpha: 0.48, amp: 2 }); // pierna izq
	wash(ctx, R, [[fx + 1, feet - 52], [fx + 9, feet - 52], [fx + 11, feet - 2], [fx + 3, feet - 2]], '#3d4762', { layers: 3, alpha: 0.48, amp: 2 }); // pierna der
	wash(ctx, R, [[fx - 13, feet - 3], [fx - 1, feet - 3], [fx - 1, feet + 2], [fx - 14, feet + 2]], '#3a2e2a', { layers: 2, alpha: 0.5, amp: 1, edge: 0.15 });
	wash(ctx, R, [[fx + 1, feet - 3], [fx + 13, feet - 3], [fx + 14, feet + 2], [fx + 1, feet + 2]], '#3a2e2a', { layers: 2, alpha: 0.5, amp: 1, edge: 0.15 });
	wash(ctx, R, [[fx - 6, head + 20], [fx + 6, head + 20], [fx + 15, head + 25], [fx + 12, head + 44], [fx + 11, feet - 50], [fx - 11, feet - 50], [fx - 12, head + 44], [fx - 15, head + 25]], outfit, { layers: 4, alpha: 0.46, amp: 2.5 }); // torso
	wash(ctx, R, [[fx + 6, head + 24], [fx + 14, head + 26], [fx + 11, feet - 51], [fx + 5, feet - 51]], shade(outfit, -0.35), { layers: 2, alpha: 0.22, amp: 2, edge: 0 }); // sombra (luz desde la izquierda)
	ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = shade(outfit, -0.45); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(fx - 10, feet - 52); ctx.lineTo(fx + 10, feet - 53); ctx.stroke(); ctx.restore();
	wash(ctx, R, [[fx - 15, head + 23], [fx - 21, head + 50], [fx - 16, head + 52], [fx - 11, head + 30]], outfit, { layers: 3, alpha: 0.42, amp: 2 }); // brazo izq
	wash(ctx, R, [[fx + 15, head + 23], [fx + 21, head + 50], [fx + 16, head + 52], [fx + 11, head + 30]], outfit, { layers: 3, alpha: 0.42, amp: 2 }); // brazo der
	wash(ctx, R, ellipsePts(fx - 18, head + 54, 3, 4, 8), skin, { layers: 2, alpha: 0.5, amp: 1, edge: 0.15 });
	wash(ctx, R, ellipsePts(fx + 18, head + 54, 3, 4, 8), skin, { layers: 2, alpha: 0.5, amp: 1, edge: 0.15 });
	wash(ctx, R, [[fx - 6, head + 20], [fx + 6, head + 20], [fx + 4, head + 30], [fx - 4, head + 30]], outfit2, { layers: 2, alpha: 0.5, amp: 1, edge: 0.12 }); // cuello
	wash(ctx, R, ellipsePts(fx, head + 10, 9, 11, 14), skin, { layers: 3, alpha: 0.5, amp: 1.4 }); // cara
	wash(ctx, R, ellipsePts(fx, head + 5, 10.5, 8, 14, Math.PI * 0.9, Math.PI * 2.1), hair, { layers: 4, alpha: 0.55, amp: 2 }); // pelo
	wash(ctx, R, [[fx - 10, head + 2], [fx - 3, head + 7], [fx + 4, head + 4], [fx + 10, head + 8], [fx + 10, head + 1], [fx - 10, head]], hair, { layers: 3, alpha: 0.5, amp: 1.5, edge: 0.15 }); // flequillo
	wash(ctx, R, ellipsePts(fx + 4, head + 12, 4, 8, 10), shade(skin, -0.25), { layers: 2, alpha: 0.18, amp: 1, edge: 0 }); // sombra de la cara
	ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = '#3a2e2a'; ctx.fillRect(fx - 4, head + 10, 1.6, 1.8); ctx.fillRect(fx + 3, head + 10, 1.6, 1.8); ctx.restore();
	ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#e88a7a'; ctx.beginPath(); ctx.arc(fx - 5, head + 13, 2, 0, 7); ctx.arc(fx + 5, head + 13, 2, 0, 7); ctx.fill(); ctx.restore();

	// --- halo azul alrededor de Riolu: la «llama fría»
	const rsize = 92, rx = fx + 14, ry = feet - rsize + 14;
	ctx.save();
	ctx.filter = 'blur(6px)';
	const hcx = rx + rsize / 2, hcy = ry + rsize / 2 + 4;
	for (let i = 0; i < 4; i++) {
		const r = 44 + i * 6 + R() * 6, g = ctx.createRadialGradient(hcx + (R() - 0.5) * 6, hcy + (R() - 0.5) * 6, r * 0.45, hcx, hcy, r);
		g.addColorStop(0, 'rgba(120,170,255,0)'); g.addColorStop(0.55, 'rgba(84,140,250,0.30)'); g.addColorStop(0.8, 'rgba(110,165,255,0.16)'); g.addColorStop(1, 'rgba(120,170,255,0)');
		ctx.fillStyle = g; ctx.fillRect(hcx - r, hcy - r, r * 2, r * 2);
	}
	ctx.restore();
	ctx.save();
	ctx.filter = 'blur(1.4px)';
	for (let i = 0; i < 16; i++) {
		const a = -Math.PI / 2 + (R() - 0.5) * 2.4, cx = rx + rsize / 2 + Math.cos(a) * 36, cy = ry + rsize / 2 + 6 + Math.sin(a) * 34;
		ctx.globalAlpha = 0.28 + R() * 0.2; ctx.strokeStyle = R() < 0.5 ? '#5d95ff' : '#9cc0ff'; ctx.lineWidth = 2 + R() * 2;
		ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx + (R() - 0.5) * 14, cy - 10, cx + (R() - 0.5) * 8, cy - 18 - R() * 10); ctx.stroke();
	}
	ctx.restore();

	// firma y marco de papel
	const finish = () => {
		ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = '#5b4a38'; ctx.font = 'italic 600 13px Nunito, serif';
		ctx.fillText('Pueblo Acuarela', W - M - 112, H - M - 8);
		ctx.restore();
		watercolorPass(ctx, W, H, 77);
		ctx.save(); ctx.strokeStyle = `rgb(${PAPER.join(',')})`; ctx.lineWidth = M * 1.6; ctx.filter = 'blur(2px)'; ctx.strokeRect(0, 0, W, H); ctx.restore();
	};

	// Riolu (arte oficial, en acuarela) cuando cargue; mientras, el cuadro se ve sin él
	const pid = D.species.riolu?.pid || D.species.riolu?.num || 447;
	const sh = shiny ? 'shiny/' : '';
	const done = loadArt([PK + 'other/official-artwork/' + sh + pid + '.png', PK + 'other/home/' + sh + pid + '.png']).then(img => {
		if (img) paintMon(ctx, img, rx, ry, rsize, 5);
		finish();
		return !!img;
	});
	return { canvas: cv, done };
}

/** Trazo de lápiz: varias pasadas finas y temblorosas de grafito. */
function pencil(ctx, R, pts, { w = 0.9, a = 0.55, passes = 2, jit = 0.8, color = '#4a4640', close = false } = {}) {
	ctx.save();
	ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color;
	for (let p = 0; p < passes; p++) {
		ctx.globalAlpha = a * (0.6 + R() * 0.4); ctx.lineWidth = w * (0.7 + R() * 0.6);
		ctx.beginPath();
		pts.forEach(([x, y], i) => { const xx = x + (R() - 0.5) * jit, yy = y + (R() - 0.5) * jit; if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); });
		if (close) ctx.closePath();
		ctx.stroke();
	}
	ctx.restore();
}
/** Sombreado a lápiz: rayas paralelas dentro de un rectángulo inclinado. */
function hatch(ctx, R, x, y, w, hgt, { gap = 4, a = 0.28, slope = 0.6 } = {}) {
	ctx.save();
	ctx.beginPath(); ctx.rect(x, y, w, hgt); ctx.clip();
	for (let k = -hgt; k < w; k += gap) pencil(ctx, R, [[x + k, y + hgt], [x + k + hgt * slope, y]], { w: 0.7, a, passes: 1, jit: 0.6 });
	ctx.restore();
}

/** Cuadro: el boceto de cuaderno de campo que Petra hizo del Santuario del Encinar (lápiz y acuarela verde). */
export function paintSantuarioEncinar() {
	const W = 480, H = 360;
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H;
	cv.className = 'acuarela';
	const ctx = cv.getContext('2d');
	const R = mulberry('santuario-encinar');
	const M = 16;
	ctx.fillStyle = `rgb(${PAPER.join(',')})`;
	ctx.fillRect(0, 0, W, H);
	// renglones muy tenues de libreta y margen
	ctx.save(); ctx.globalAlpha = 0.12; ctx.strokeStyle = '#6f8fb0'; ctx.lineWidth = 1;
	for (let y = 34; y < H - 10; y += 18) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
	ctx.restore();

	// --- bruma del claro: verde muy aguado, más claro en el centro
	wash(ctx, R, [[M + 6, M + 10], [W - M - 6, M + 4], [W - M, H - 62], [M, H - 58]], '#cfe0bc', { layers: 4, alpha: 0.24, amp: 12, blur: 6, edge: 0 });
	blooms(ctx, R, M, M, W - 2 * M, H - 90, '#a9c99a', 12, 40, 0.16);
	// suelo del claro
	const groundPts = [];
	for (let x = M + 10; x <= W - M - 10; x += 24) groundPts.push([x, 244 + Math.sin(x / 37) * 6 + (R() - 0.5) * 6]);
	groundPts.push([W - M - 24, H - 62], [W / 2, H - 70], [M + 24, H - 60]);
	wash(ctx, R, groundPts, '#9cc283', { layers: 4, alpha: 0.24, amp: 6, edge: 0.12 });
	for (let i = 0; i < 40; i++) { const x = M + 20 + R() * (W - 2 * M - 40), y = 248 + R() * 36; pencil(ctx, R, [[x, y], [x + 1 - R() * 2, y - 4 - R() * 3]], { w: 0.6, a: 0.35, passes: 1, jit: 0.2 }); } // hierba
	blooms(ctx, R, M + 20, 250, W - 2 * M - 40, 40, '#6f9f5c', 6, 18, 0.18);
	// encinas lejanas, difuminadas por la bruma
	for (const [x, r] of [[150, 30], [330, 34], [250, 26]]) wash(ctx, R, ellipsePts(x, 170, r, r * 0.8, 14), '#b4cfa2', { layers: 3, alpha: 0.2, amp: 6, blur: 3, edge: 0 });

	// --- dos encinas enormes: troncos a los lados, copas que se tocan arriba
	const trunk = (x0, lean) => {
		const pts = [[x0 - 34, H - 60], [x0 + 32, H - 62], [x0 + 18 + lean * 0.3, H - 96], [x0 + 16 + lean * 0.5, 150], [x0 + 12 + lean, 70], [x0 - 8 + lean, 70], [x0 - 14 + lean * 0.5, 150], [x0 - 18 + lean * 0.3, H - 96]];
		wash(ctx, R, pts, '#8c7356', { layers: 3, alpha: 0.3, amp: 3, blur: 1.4 });
		pencil(ctx, R, [pts[0], pts[7], pts[6], pts[5]], { w: 1.2, a: 0.6 });
		pencil(ctx, R, [pts[1], pts[2], pts[3], pts[4]], { w: 1.2, a: 0.6 });
		for (let i = 0; i < 7; i++) { const y = 100 + i * 30 + R() * 10, x = x0 + lean * (1 - (y - 70) / 230) * 0.8; pencil(ctx, R, [[x - 8, y], [x - 2 + R() * 4, y + 12], [x + 4, y + 22]], { w: 0.7, a: 0.35, passes: 1 }); }
		// raíces
		pencil(ctx, R, [[x0 - 26, H - 60], [x0 - 44, H - 54], [x0 - 58, H - 52]], { w: 1, a: 0.5 });
		pencil(ctx, R, [[x0 + 26, H - 62], [x0 + 44, H - 56], [x0 + 56, H - 55]], { w: 1, a: 0.5 });
	};
	trunk(70, 26); trunk(W - 70, -26);
	hatch(ctx, R, W - 92, 120, 40, 170, { gap: 4, a: 0.22 }); // lado en sombra (luz desde la izquierda)
	// ramas que se cruzan por arriba
	pencil(ctx, R, [[96, 84], [150, 54], [220, 40], [262, 44]], { w: 1.6, a: 0.55 });
	pencil(ctx, R, [[W - 96, 84], [W - 150, 56], [W - 214, 44], [W - 250, 50]], { w: 1.6, a: 0.55 });
	const branchY = 66; // rama del reloj
	pencil(ctx, R, [[W - 120, 92], [W - 168, 76], [W - 196, branchY + 4]], { w: 1.2, a: 0.55 });
	// copas
	wash(ctx, R, [[M, M], [W - M, M], [W - M, 60], [M, 60]], '#6f9a58', { layers: 3, alpha: 0.22, amp: 8, blur: 3, edge: 0 });
	const canopyY = x => 70 + 26 * Math.pow(Math.abs(x - W / 2) / (W / 2), 1.6); // más baja en los lados, arco en el centro
	for (let x = M + 6; x < W - M; x += 30 + R() * 10) { // racimos de hojas
		const cy = canopyY(x) - 12 + R() * 10, rx = 26 + R() * 12, ry = 18 + R() * 8;
		wash(ctx, R, ellipsePts(x, cy, rx, ry, 14), R() < 0.5 ? '#6f9a58' : '#7fa860', { layers: 3, alpha: 0.24, amp: 6, blur: 1.6, edge: 0.18 });
		pencil(ctx, R, ellipsePts(x, cy + 2, rx * 0.9, ry * 0.9, 9, Math.PI * 0.15, Math.PI * 0.85), { w: 0.7, a: 0.35, passes: 1, jit: 2 });
	}
	blooms(ctx, R, M, M, W - 2 * M, 90, '#3f6e38', 10, 22, 0.22);
	blooms(ctx, R, M, M, W - 2 * M, 60, '#cfe39a', 5, 18, 0.18); // luz que se cuela
	for (let i = 0; i < 46; i++) { // hojitas a lápiz en el borde de la copa
		const x = M + R() * (W - 2 * M), y = canopyY(x) + 6 + R() * 16;
		pencil(ctx, R, [[x - 3, y], [x, y - 2], [x + 3, y], [x, y + 2]], { w: 0.6, a: 0.4, passes: 1, close: true });
	}

	// --- altar: casita de madera sobre un poste, con tejado de musgo
	const ax = W / 2 - 4, ay = 222; // base de la casita
	wash(ctx, R, [[ax - 3, ay], [ax + 3, ay], [ax + 4, H - 66], [ax - 4, H - 66]], '#8a6a46', { layers: 2, alpha: 0.4, amp: 1 });
	pencil(ctx, R, [[ax - 3, ay], [ax - 4, H - 66]], { w: 1, a: 0.6 }); pencil(ctx, R, [[ax + 3, ay], [ax + 4, H - 66]], { w: 1, a: 0.6 });
	const box = [[ax - 22, ay - 30], [ax + 22, ay - 30], [ax + 22, ay], [ax - 22, ay]];
	wash(ctx, R, box, '#b88a58', { layers: 3, alpha: 0.38, amp: 1.2 });
	pencil(ctx, R, box, { w: 1.1, a: 0.7, close: true });
	for (let y = ay - 24; y < ay; y += 7) pencil(ctx, R, [[ax - 21, y], [ax + 21, y + 0.5]], { w: 0.6, a: 0.3, passes: 1 }); // tablas
	const door = [[ax - 7, ay - 2], [ax - 7, ay - 16], [ax, ay - 21], [ax + 7, ay - 16], [ax + 7, ay - 2]];
	wash(ctx, R, door, '#4a3a2a', { layers: 2, alpha: 0.45, amp: 0.8, edge: 0 });
	pencil(ctx, R, door, { w: 0.9, a: 0.7 });
	const roof = [[ax - 30, ay - 28], [ax, ay - 52], [ax + 30, ay - 28]];
	wash(ctx, R, [...roof, [ax + 26, ay - 24], [ax - 26, ay - 24]], '#5f9a4a', { layers: 4, alpha: 0.42, amp: 3 });
	blooms(ctx, R, ax - 26, ay - 50, 52, 26, '#3f7a36', 4, 7, 0.3);
	pencil(ctx, R, roof, { w: 1.2, a: 0.7 });
	for (let i = 0; i < 9; i++) { const x = ax - 26 + i * 6.5; pencil(ctx, R, [[x, ay - 26], [x + 1, ay - 21 - R() * 3]], { w: 0.7, a: 0.45, passes: 1 }); } // musgo colgando
	// ofrendas: dos piedrecitas y una bellota
	for (const [x, r] of [[ax - 16, 4], [ax + 15, 3.4]]) { wash(ctx, R, ellipsePts(x, H - 66, r, r * 0.7, 8), '#9a9a90', { layers: 2, alpha: 0.4, amp: 0.6, edge: 0.2 }); }
	// cota de tamaño: el bocetista apunta la altura
	pencil(ctx, R, [[ax + 40, ay - 52], [ax + 40, ay]], { w: 0.6, a: 0.4, passes: 1 });
	pencil(ctx, R, [[ax + 37, ay - 52], [ax + 43, ay - 52]], { w: 0.6, a: 0.4, passes: 1 }); pencil(ctx, R, [[ax + 37, ay], [ax + 43, ay]], { w: 0.6, a: 0.4, passes: 1 });
	ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#4a4640'; ctx.font = 'italic 500 10px Nunito, serif'; ctx.fillText('≈ casita', ax + 46, ay - 22); ctx.fillText('de pájaros', ax + 46, ay - 11); ctx.restore();

	// --- reloj de bolsillo colgando de una rama
	const wx = W - 194, wy = 128;
	pencil(ctx, R, [[W - 196, branchY + 4], [wx - 2, 92], [wx, wy - 12]], { w: 0.7, a: 0.6, passes: 2, jit: 0.4 }); // cadena
	for (let y = branchY + 10; y < wy - 12; y += 5) pencil(ctx, R, [[wx - 2 + (y - branchY) * 0.02, y], [wx + (y - branchY) * 0.02, y + 2]], { w: 0.5, a: 0.35, passes: 1, jit: 0.2 });
	wash(ctx, R, ellipsePts(wx, wy, 11, 11, 16), '#d8c27a', { layers: 3, alpha: 0.4, amp: 0.8, edge: 0.35 });
	wash(ctx, R, ellipsePts(wx, wy, 7.5, 7.5, 14), '#fbf6e6', { layers: 2, alpha: 0.6, amp: 0.4, edge: 0 });
	pencil(ctx, R, ellipsePts(wx, wy, 11, 11, 18), { w: 0.9, a: 0.7, close: true, jit: 0.3 });
	pencil(ctx, R, [[wx, wy - 12], [wx, wy - 14]], { w: 2, a: 0.6, passes: 1 });
	pencil(ctx, R, [[wx, wy], [wx, wy - 5]], { w: 0.8, a: 0.8, passes: 1, jit: 0.1 }); pencil(ctx, R, [[wx, wy], [wx + 4, wy + 1]], { w: 0.8, a: 0.8, passes: 1, jit: 0.1 });
	ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = '#4a4640'; ctx.font = 'italic 500 10px Nunito, serif'; ctx.fillText('¿de quién?', wx + 16, wy + 4); ctx.restore();

	// --- hojas que caen HACIA ARRIBA: cada hoja con su estela curva por debajo
	const leaf = (x, y, s, rot, col) => {
		ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
		const pts = [[0, -s], [s * 0.55, -s * 0.2], [s * 0.4, s * 0.5], [0, s], [-s * 0.4, s * 0.5], [-s * 0.55, -s * 0.2]];
		wash(ctx, R, pts, col, { layers: 2, alpha: 0.55, amp: 0.6, blur: 0.4, edge: 0.4, seg: 2 });
		pencil(ctx, R, [[0, -s], [0, s + 2]], { w: 0.5, a: 0.5, passes: 1, jit: 0.2 });
		ctx.restore();
	};
	const leaves = [[120, 200], [176, 150], [300, 176], [372, 210], [214, 120], [404, 150], [140, 270], [330, 262], [260, 196]];
	leaves.forEach(([x, y], i) => {
		const s = 6 + R() * 2.5, col = ['#7fae5c', '#a8b84e', '#6f9a58', '#c2a24a'][i % 4];
		const dx = (R() - 0.5) * 30;
		ctx.save(); ctx.setLineDash([3, 3]);
		pencil(ctx, R, [[x + dx, y + 52], [x + dx * 0.5 + 8, y + 36], [x + dx * 0.2 - 6, y + 22], [x, y + s + 3]], { w: 0.9, a: 0.6, passes: 1, jit: 0.2 });
		ctx.restore();
		pencil(ctx, R, [[x - 7, y + s + 4], [x - 6, y + s + 10]], { w: 0.6, a: 0.45, passes: 1, jit: 0.1 });
		pencil(ctx, R, [[x + 7, y + s + 4], [x + 6, y + s + 10]], { w: 0.6, a: 0.45, passes: 1, jit: 0.1 });
		pencil(ctx, R, [[x - 4, y - s - 5], [x, y - s - 9], [x + 4, y - s - 5]], { w: 0.6, a: 0.45, passes: 1, jit: 0.2 }); // flechita hacia arriba
		leaf(x, y, s, (R() - 0.5) * 1.2, col);
	});
	ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#4a4640'; ctx.font = 'italic 500 10px Nunito, serif'; ctx.fillText('suben ↑ (!)', 418, 150); ctx.restore();

	// --- nota manuscrita y marco
	watercolorPass(ctx, W, H, 31);
	ctx.save();
	ctx.fillStyle = '#3e3a34'; ctx.globalAlpha = 0.8; ctx.font = 'italic 600 17px Nunito, serif';
	ctx.textAlign = 'center';
	ctx.translate(W / 2, H - 30); ctx.rotate(-0.012);
	ctx.fillText('Para que no se te olvide que fue verdad', 0, 0);
	ctx.globalAlpha = 0.5; ctx.lineWidth = 0.8; ctx.strokeStyle = '#3e3a34';
	ctx.beginPath(); ctx.moveTo(-150, 6); ctx.quadraticCurveTo(0, 9, 150, 5); ctx.stroke();
	ctx.restore();
	ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = '#5b4a38'; ctx.font = 'italic 600 11px Nunito, serif'; ctx.fillText('— P.', W - M - 34, H - 14); ctx.restore();
	ctx.save(); ctx.strokeStyle = `rgb(${PAPER.join(',')})`; ctx.lineWidth = M * 1.2; ctx.filter = 'blur(2px)'; ctx.strokeRect(0, 0, W, H); ctx.restore();
	// pliegue en cuatro: la hoja estuvo doblada
	ctx.save(); ctx.globalAlpha = 0.1; ctx.strokeStyle = '#5b4a38'; ctx.lineWidth = 1.4;
	ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2 + 2, H); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2 - 2); ctx.stroke();
	ctx.globalAlpha = 0.18; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(W / 2 + 1.5, 0); ctx.lineTo(W / 2 + 3.5, H); ctx.moveTo(0, H / 2 + 1.5); ctx.lineTo(W, H / 2 - 0.5); ctx.stroke();
	ctx.restore();
	return { canvas: cv, done: Promise.resolve(true) };
}

/** Lemniscata (∞) como lista de puntos. */
const lemniscate = (cx, cy, a, n = 64) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2, s = Math.sin(t), d = 1 + s * s; return [cx + a * Math.cos(t) / d, cy + a * s * Math.cos(t) / d]; });

/** Foto de grupo de la Gira (impresa): 23 novatos ante la Puerta de Trigal y tú, pegado después en una esquina. */
export function paintFotoGira({ look = {} } = {}) {
	const W = 480, H = 360;
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H;
	cv.className = 'acuarela foto';
	const ctx = cv.getContext('2d');
	const R = mulberry('foto-gira');
	const B = 14, IW = W - 2 * B, IH = H - 2 * B - 18; // borde blanco, más ancho abajo como una copia impresa
	ctx.fillStyle = '#f8f6f0'; ctx.fillRect(0, 0, W, H);
	ctx.save(); ctx.beginPath(); ctx.rect(B, B, IW, IH); ctx.clip();
	// --- cielo de atardecer (el sol a la izquierda, ya bajo)
	const sky = ctx.createLinearGradient(0, B, 0, B + 220);
	sky.addColorStop(0, '#3d3a78'); sky.addColorStop(0.35, '#8a4f8c'); sky.addColorStop(0.65, '#e9776a'); sky.addColorStop(1, '#ffc27a');
	ctx.fillStyle = sky; ctx.fillRect(B, B, IW, 230);
	const sun = ctx.createRadialGradient(70, 214, 4, 70, 214, 150);
	sun.addColorStop(0, 'rgba(255,240,190,1)'); sun.addColorStop(0.12, 'rgba(255,214,140,.85)'); sun.addColorStop(1, 'rgba(255,170,110,0)');
	ctx.fillStyle = sun; ctx.fillRect(B, B, IW, 240);
	ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#ffd6c0';
	for (const [x, y, w] of [[260, 70, 120], [360, 100, 90], [150, 110, 70]]) { ctx.beginPath(); ctx.ellipse(x, y, w, 7, -0.03, 0, 7); ctx.fill(); }
	ctx.restore();
	// campos de trigo lejanos y plaza
	ctx.fillStyle = '#c98e4e'; ctx.beginPath(); ctx.moveTo(B, 222); for (let x = B; x <= W - B; x += 20) ctx.lineTo(x, 218 + Math.sin(x / 50) * 4); ctx.lineTo(W - B, 240); ctx.lineTo(B, 240); ctx.fill();
	const ground = ctx.createLinearGradient(0, 230, 0, H);
	ground.addColorStop(0, '#9a6a52'); ground.addColorStop(1, '#4e3446');
	ctx.fillStyle = ground; ctx.fillRect(B, 232, IW, H);

	// --- arco plateado en forma de ∞, encendido en azul
	const acx = W / 2 + 10, acy = 150, aa = 110;
	ctx.save();
	ctx.fillStyle = '#7d8696'; ctx.fillRect(acx - aa - 4, acy, 10, 96); ctx.fillRect(acx + aa - 6, acy, 10, 96); // pilares
	ctx.fillStyle = '#c3cad6'; ctx.fillRect(acx - aa - 4, acy, 3, 96); ctx.fillRect(acx + aa - 6, acy, 3, 96);
	const inf = lemniscate(acx, acy, aa, 96);
	const strokeInf = (w, col, blur) => { ctx.filter = blur ? `blur(${blur}px)` : 'none'; ctx.lineWidth = w; ctx.strokeStyle = col; ctx.beginPath(); inf.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); };
	ctx.lineJoin = 'round';
	strokeInf(22, 'rgba(70,150,255,.55)', 10);
	strokeInf(11, '#59657a', 0);
	strokeInf(8, '#c8d0dc', 0);
	strokeInf(3, '#8fd0ff', 0);
	strokeInf(1.2, '#ffffff', 0);
	ctx.restore();
	// --- confeti
	for (let i = 0; i < 90; i++) {
		const x = B + R() * IW, y = B + 20 + R() * 220;
		ctx.save(); ctx.translate(x, y); ctx.rotate(R() * 3);
		ctx.fillStyle = ['#ffffff', '#cfd6e2', '#6fb4ff', '#ffd25a', '#9fc0ff'][i % 5]; ctx.globalAlpha = 0.85;
		ctx.fillRect(-2, -1, 4 + R() * 2, 2); ctx.restore();
	}

	// --- 23 novatos en dos filas, a contraluz (el sol a su izquierda)
	const person = (x, foot, s, col, hairCol, skin, k) => {
		const head = foot - 44 * s;
		ctx.fillStyle = shade(col, -0.25); ctx.beginPath(); ctx.roundRect(x - 9 * s, head + 10 * s, 18 * s, 22 * s, 6 * s); ctx.fill(); // torso
		ctx.fillStyle = '#3a3048'; ctx.fillRect(x - 6 * s, head + 30 * s, 5 * s, 14 * s); ctx.fillRect(x + 1 * s, head + 30 * s, 5 * s, 14 * s); // piernas
		ctx.fillStyle = shade(skin, -0.2); ctx.beginPath(); ctx.arc(x, head + 4 * s, 6.5 * s, 0, 7); ctx.fill(); // cabeza
		ctx.fillStyle = hairCol; ctx.beginPath(); ctx.arc(x, head + 2 * s, 6.8 * s, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
		if (k % 4 === 1) { ctx.fillRect(x - 7 * s, head + 2 * s, 3 * s, 9 * s); ctx.fillRect(x + 4 * s, head + 2 * s, 3 * s, 9 * s); } // melena
		if (k % 5 === 2) { ctx.fillStyle = shade(col, 0.2); ctx.fillRect(x - 8 * s, head - 4 * s, 16 * s, 3 * s); ctx.fillRect(x - 6 * s, head - 7 * s, 12 * s, 4 * s); } // gorra
		if (k % 3 === 0) { ctx.strokeStyle = shade(col, -0.25); ctx.lineWidth = 3 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 8 * s, head + 14 * s); ctx.lineTo(x + 13 * s, head + 2 * s); ctx.stroke(); } // brazo en alto
		// luz de contra en el lado izquierdo (de cara al sol)
		ctx.fillStyle = 'rgba(255,200,130,.55)'; ctx.fillRect(x - 9 * s, head + 12 * s, 2 * s, 18 * s);
		ctx.beginPath(); ctx.arc(x - 3 * s, head + 3 * s, 4 * s, Math.PI * 0.6, Math.PI * 1.4); ctx.lineWidth = 1.5 * s; ctx.strokeStyle = 'rgba(255,214,150,.7)'; ctx.stroke();
	};
	const cols = ['#d0573f', '#3f7ac8', '#e2b23f', '#4f9a64', '#8a5ab8', '#e07aa4', '#3fa8a8', '#c87a3f', '#5a6a8a', '#b84a5a', '#6aa83f', '#f0e0c0'];
	const hairs = ['#2b2b38', '#5a3a26', '#8a5a2f', '#d8a85a', '#c4473a', '#3b2a20', '#e9dcc0'];
	let k = 0;
	for (let i = 0; i < 12; i++) person(98 + i * 26 + (R() - 0.5) * 4, 262, 0.9, cols[(i * 5) % 12], hairs[(i * 3) % 7], SKINS[i % 6], k++); // fila de atrás (de pie)
	for (let i = 0; i < 11; i++) person(110 + i * 26 + (R() - 0.5) * 4, 290, 1.0, cols[(i * 7 + 3) % 12], hairs[(i * 2 + 1) % 7], SKINS[(i + 3) % 6], k++); // fila de delante
	// pancarta
	ctx.save(); ctx.translate(244, 300); ctx.rotate(-0.02);
	ctx.fillStyle = '#1e2a5c'; ctx.fillRect(-58, -2, 116, 16); ctx.fillStyle = '#d8dee8'; ctx.font = '800 10px Nunito, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('GIRA LEMNIS · NOVATOS', 0, 10);
	ctx.restore();

	// --- el seto de la esquina inferior derecha
	ctx.fillStyle = '#2f5a3a';
	ctx.beginPath(); ctx.moveTo(W - B - 120, H); ctx.lineTo(W - B - 120, IH + B - 42);
	for (let x = W - B - 120; x <= W - B; x += 12) ctx.arc(x + 6, IH + B - 44 + R() * 4, 9, Math.PI, 0);
	ctx.lineTo(W - B, H); ctx.fill();
	ctx.fillStyle = 'rgba(255,190,120,.35)'; for (let x = W - B - 116; x < W - B; x += 12) { ctx.beginPath(); ctx.arc(x + 4, IH + B - 48, 4, 0, 7); ctx.fill(); }
	ctx.restore(); // fin del clip de la imagen

	// --- tú, recortado y pegado: luz del lado contrario, cabeza grande, borde blanco de tijera
	const skin = typeof look.skin === 'number' ? SKINS[look.skin] || SKINS[1] : (look.skin || SKINS[1]);
	const hair = look.hairColor || '#5a3a26', outfit = look.outfit || '#4c7cf0', outfit2 = look.outfit2 || '#f3e6c4';
	const longHair = ['long', 'ponytail', 'braids', 'tied', 'bob'].includes(look.hair);
	const cut = document.createElement('canvas'); cut.width = 90; cut.height = 120;
	const c = cut.getContext('2d');
	const px = 45, foot = 112, hd = 30; // cabeza demasiado grande para el cuerpo
	if (longHair) { c.fillStyle = shade(hair, -0.1); c.beginPath(); c.roundRect(px - 18, 26, 36, 40, 10); c.fill(); }
	c.fillStyle = '#36405e'; c.fillRect(px - 10, foot - 30, 8, 30); c.fillRect(px + 2, foot - 30, 8, 30);
	c.fillStyle = outfit; c.beginPath(); c.roundRect(px - 15, 58, 30, 34, 8); c.fill();
	c.fillStyle = outfit2; c.beginPath(); c.moveTo(px - 7, 58); c.lineTo(px + 7, 58); c.lineTo(px, 68); c.fill();
	c.fillStyle = skin; c.beginPath(); c.arc(px, 34, hd * 0.66, 0, 7); c.fill();
	c.fillStyle = hair; c.beginPath(); c.arc(px, 30, hd * 0.7, Math.PI * 0.92, Math.PI * 2.08); c.fill();
	c.beginPath(); c.moveTo(px - 20, 28); c.lineTo(px - 6, 24); c.lineTo(px + 4, 30); c.lineTo(px + 20, 26); c.lineTo(px + 20, 20); c.lineTo(px - 20, 20); c.fill();
	c.fillStyle = '#2a2230'; c.fillRect(px - 8, 36, 3, 4); c.fillRect(px + 5, 36, 3, 4); // ojos
	c.strokeStyle = '#7a3a3a'; c.lineWidth = 1.6; c.beginPath(); c.arc(px, 42, 5, 0.2, Math.PI - 0.2); c.stroke(); // sonrisa de compromiso
	c.fillStyle = 'rgba(240,120,110,.35)'; c.beginPath(); c.arc(px - 11, 42, 3, 0, 7); c.arc(px + 11, 42, 3, 0, 7); c.fill();
	// la luz le viene de la DERECHA (en la foto el sol está a la izquierda) y es dura, de flash de oficina
	c.globalCompositeOperation = 'source-atop';
	const lg = c.createLinearGradient(px - 30, 0, px + 30, 0);
	lg.addColorStop(0, 'rgba(20,30,80,.35)'); lg.addColorStop(0.55, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(255,255,240,.45)');
	c.fillStyle = lg; c.fillRect(0, 0, 90, 120);
	c.globalCompositeOperation = 'source-over';
	// borde blanco de recorte: el contorno engordado en blanco, con tijeretazos irregulares
	const out = document.createElement('canvas'); out.width = 104; out.height = 132;
	const o = out.getContext('2d');
	for (let a = 0; a < 16; a++) { const r = 4 + (a % 3 === 0 ? 1.5 : 0); o.drawImage(cut, 7 + Math.cos(a / 16 * Math.PI * 2) * r, 6 + Math.sin(a / 16 * Math.PI * 2) * r); }
	o.globalCompositeOperation = 'source-in'; o.fillStyle = '#ffffff'; o.fillRect(0, 0, 104, 132);
	o.globalCompositeOperation = 'source-over'; o.drawImage(cut, 7, 6);
	ctx.save();
	ctx.translate(W - B - 52, IH + B - 166); ctx.rotate(0.07);
	ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = -3; ctx.shadowOffsetY = 3; // sombra hacia la izquierda: luz desde la derecha
	ctx.drawImage(out, -52, -6);
	ctx.restore();
	// un trocito de celo arriba
	ctx.save(); ctx.translate(W - B - 44, IH + B - 168); ctx.rotate(-0.25); ctx.fillStyle = 'rgba(255,255,230,.5)'; ctx.fillRect(-14, -5, 28, 10); ctx.restore();

	// --- acabado de copia impresa: grano, viñeteado, leve tono cálido
	ctx.save(); ctx.beginPath(); ctx.rect(B, B, IW, IH); ctx.clip();
	const vg = ctx.createRadialGradient(W / 2, B + IH / 2, IH * 0.4, W / 2, B + IH / 2, IW * 0.65);
	vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(30,10,30,.35)');
	ctx.fillStyle = vg; ctx.fillRect(B, B, IW, IH);
	ctx.restore();
	try {
		const img = ctx.getImageData(B, B, IW, IH), d = img.data, RN = mulberry(9);
		for (let i = 0; i < d.length; i += 4) { const n = (RN() - 0.5) * 18; d[i] += n + 4; d[i + 1] += n; d[i + 2] += n - 4; }
		ctx.putImageData(img, B, B);
	} catch (e) { /* sin acceso a píxeles: sin grano */ }
	ctx.save(); ctx.fillStyle = '#8a8478'; ctx.globalAlpha = 0.8; ctx.font = '600 10px Nunito, sans-serif';
	ctx.fillText('Puerta de Trigal · día 1', B + 4, H - 10);
	ctx.textAlign = 'right'; ctx.fillText('LEMNIS', W - B - 4, H - 10);
	ctx.restore();
	return { canvas: cv, done: Promise.resolve(true) };
}

/** Trazo de lápiz de color: muchas pasadas finas, con huecos donde el papel asoma. */
function crayon(ctx, R, pts, color, { w = 2.2, a = 0.75, passes = 3, jit = 1.6 } = {}) {
	pencil(ctx, R, pts, { w, a, passes, jit, color });
}
/** Relleno de lápiz de color: rayas en zigzag de un niño que colorea deprisa (se sale un poco). */
function crayonFill(ctx, R, pts, color, { gap = 3, a = 0.6, slope = 0.5, w = 2.4, over = 3 } = {}) {
	const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
	const x0 = Math.min(...xs) - over, x1 = Math.max(...xs) + over, y0 = Math.min(...ys) - over, y1 = Math.max(...ys) + over;
	ctx.save();
	roughPath(ctx, R, pts, over * 1.4, 3); ctx.clip();
	ctx.lineCap = 'round'; ctx.strokeStyle = color;
	const hgt = y1 - y0;
	for (let k = x0 - hgt; k < x1; k += gap * (0.7 + R() * 0.6)) {
		ctx.globalAlpha = a * (0.6 + R() * 0.5); ctx.lineWidth = w * (0.6 + R() * 0.7);
		ctx.beginPath(); ctx.moveTo(k + (R() - 0.5) * 2, y1); ctx.lineTo(k + hgt * slope + (R() - 0.5) * 2, y0); ctx.stroke();
	}
	ctx.restore();
}
/** Grano de lápiz de color: el papel blanco asoma entre el pigmento (dientes del papel). */
function paperTooth(ctx, W, H, seed, k = 0.5) {
	let img;
	try { img = ctx.getImageData(0, 0, W, H); } catch (e) { return; }
	const d = img.data, R = mulberry(seed);
	for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
		const i = (y * W + x) * 4;
		const tooth = ((x * 7 + y * 13) % 5 === 0 || R() < 0.12) ? k * R() : 0;
		const n = 1 - (R() - 0.5) * 0.05;
		d[i] = (d[i] + (252 - d[i]) * tooth) * n; d[i + 1] = (d[i + 1] + (250 - d[i + 1]) * tooth) * n; d[i + 2] = (d[i + 2] + (244 - d[i + 2]) * tooth) * n;
	}
	ctx.putImageData(img, 0, 0);
}

/** Cuadro: dibujo infantil a lápices de colores del rancho al atardecer. Torcido y tierno; sin figuras. */
export function paintRanchoAtardecer() {
	const W = 480, H = 360;
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H;
	cv.className = 'acuarela';
	const ctx = cv.getContext('2d');
	const R = mulberry('rancho-atardecer');
	ctx.fillStyle = '#fbfaf4'; ctx.fillRect(0, 0, W, H);
	// cielo: naranja abajo, rosa arriba, coloreado a rayas que no llegan a los bordes
	crayonFill(ctx, R, [[20, 18], [W - 22, 14], [W - 18, 96], [22, 100]], '#f59ab4', { gap: 3.2, a: 0.55 });
	crayonFill(ctx, R, [[18, 92], [W - 20, 88], [W - 16, 196], [20, 200]], '#f6a24a', { gap: 3, a: 0.6 });
	crayonFill(ctx, R, [[18, 150], [W - 20, 146], [W - 16, 200], [20, 204]], '#f7c84a', { gap: 4, a: 0.35 });
	// sol medio escondido con rayos de niño
	const sx = 300, sy = 188;
	crayonFill(ctx, R, ellipsePts(sx, sy, 30, 30, 16, Math.PI, Math.PI * 2).concat([[sx + 30, sy], [sx - 30, sy]]), '#f6d23a', { gap: 2.2, a: 0.8 });
	crayon(ctx, R, ellipsePts(sx, sy, 30, 30, 14, Math.PI, Math.PI * 2), '#e88a2a', { w: 1.8 });
	for (let i = 0; i < 7; i++) { const a = Math.PI + (i + 0.5) * Math.PI / 7; crayon(ctx, R, [[sx + Math.cos(a) * 38, sy + Math.sin(a) * 38], [sx + Math.cos(a) * 54, sy + Math.sin(a) * 54]], '#e8a02a', { w: 2, passes: 2 }); }
	// nubes en espiral
	for (const [x, y] of [[90, 52], [390, 40]]) crayon(ctx, R, Array.from({ length: 20 }, (_, i) => [x + Math.cos(i * 0.9) * (14 + i * 0.6) + i * 2.4, y + Math.sin(i * 0.9) * 7]), '#ffffff', { w: 3.4, a: 0.9, passes: 2 });
	// prado verde con lomita
	const meadow = [[16, 200]];
	for (let x = 16; x <= W - 16; x += 30) meadow.push([x, 198 - Math.sin((x - 16) / (W - 32) * Math.PI) * 14 + (R() - 0.5) * 5]);
	meadow.push([W - 16, H - 18], [16, H - 16]);
	crayonFill(ctx, R, meadow, '#5ab84a', { gap: 2.6, a: 0.62, slope: -0.4 });
	crayonFill(ctx, R, [[16, 290], [W - 16, 286], [W - 16, H - 16], [16, H - 16]], '#3a8a3a', { gap: 3.4, a: 0.35, slope: -0.4 });
	crayon(ctx, R, meadow.slice(0, -2), '#2e7a2e', { w: 2 });
	for (let i = 0; i < 36; i++) { const x = 24 + R() * (W - 48), y = 214 + R() * 120; crayon(ctx, R, [[x - 3, y], [x, y - 7], [x + 3, y]], '#2e7a2e', { w: 1.4, passes: 1, jit: 0.8 }); } // hierba en V
	for (let i = 0; i < 9; i++) { const x = 40 + R() * 220, y = 300 + R() * 34; crayonFill(ctx, R, ellipsePts(x, y, 3.5, 3.5, 6), ['#f05a8a', '#f6d23a', '#ffffff'][i % 3], { gap: 1.4, a: 0.9, over: 0.5 }); }

	// establo rojo torcido (izquierda): el niño no midió
	const bx = 34, by = 236; // esquina inferior izquierda
	const barn = [[bx, by], [bx + 12, by - 90], [bx + 70, by - 136], [bx + 122, by - 78], [bx + 110, by + 6]];
	crayonFill(ctx, R, barn, '#d83a3a', { gap: 2.4, a: 0.7 });
	crayon(ctx, R, [...barn, barn[0]], '#9a2424', { w: 2.2 });
	crayon(ctx, R, [[bx + 2, by - 84], [bx + 70, by - 144], [bx + 132, by - 74]], '#6a3a2a', { w: 3.4, passes: 3 }); // tejado
	const door = [[bx + 38, by + 2], [bx + 40, by - 48], [bx + 82, by - 46], [bx + 80, by + 3]];
	crayonFill(ctx, R, door, '#ffffff', { gap: 2, a: 0.7, over: 1 });
	crayon(ctx, R, [...door], '#ffffff', { w: 2.4 }); crayon(ctx, R, [door[0], door[2]], '#ffffff', { w: 2.4 }); crayon(ctx, R, [door[1], door[3]], '#ffffff', { w: 2.4 }); // la X de las puertas
	crayonFill(ctx, R, [[bx + 56, by - 92], [bx + 78, by - 90], [bx + 76, by - 70], [bx + 55, by - 72]], '#f6d23a', { gap: 1.6, a: 0.85, over: 0.5 }); // ventanita encendida
	// pozo
	const px0 = 168, py0 = 256;
	crayonFill(ctx, R, [[px0, py0], [px0 + 34, py0 + 1], [px0 + 33, py0 - 22], [px0 + 1, py0 - 23]], '#9a9aa4', { gap: 2.2, a: 0.7, over: 1 });
	for (let i = 0; i < 3; i++) crayon(ctx, R, [[px0, py0 - 7 - i * 7], [px0 + 34, py0 - 7 - i * 7 + 1]], '#5a5a66', { w: 1.2, passes: 1 });
	crayon(ctx, R, [[px0 + 3, py0 - 22], [px0 + 4, py0 - 52]], '#7a4e2c', { w: 2.4 }); crayon(ctx, R, [[px0 + 31, py0 - 22], [px0 + 30, py0 - 52]], '#7a4e2c', { w: 2.4 });
	crayon(ctx, R, [[px0 - 6, py0 - 50], [px0 + 17, py0 - 66], [px0 + 40, py0 - 50]], '#c83a2a', { w: 3.2 });
	crayon(ctx, R, [[px0 + 17, py0 - 52], [px0 + 17, py0 - 34]], '#5a4a3a', { w: 1, passes: 1 }); // cuerda con cubo
	crayonFill(ctx, R, [[px0 + 12, py0 - 34], [px0 + 22, py0 - 34], [px0 + 21, py0 - 26], [px0 + 13, py0 - 26]], '#7a7a88', { gap: 1.4, a: 0.9, over: 0.5 });

	// porche de madera a la derecha con una mecedora vacía
	const qx = 352, qy = 244;
	crayonFill(ctx, R, [[qx, qy], [qx + 112, qy - 2], [qx + 110, qy - 106], [qx + 2, qy - 104]], '#c8945a', { gap: 2.6, a: 0.6 });
	for (let i = 1; i < 6; i++) crayon(ctx, R, [[qx + 2, qy - i * 18], [qx + 110, qy - i * 18 - 1]], '#8a5a2e', { w: 1.2, passes: 1 }); // tablas
	crayon(ctx, R, [[qx - 10, qy - 104], [qx + 60, qy - 132], [qx + 124, qy - 108]], '#7a4e2c', { w: 3.4, passes: 3 }); // alero
	crayon(ctx, R, [[qx + 4, qy - 104], [qx + 4, qy + 2]], '#6a3e1e', { w: 3 }); crayon(ctx, R, [[qx + 108, qy - 106], [qx + 108, qy]], '#6a3e1e', { w: 3 }); // postes
	crayonFill(ctx, R, [[qx - 6, qy], [qx + 120, qy - 2], [qx + 122, qy + 12], [qx - 8, qy + 14]], '#9a6a3a', { gap: 2.2, a: 0.75, over: 1 }); // suelo del porche
	crayonFill(ctx, R, [[qx + 70, qy - 70], [qx + 92, qy - 71], [qx + 92, qy - 48], [qx + 70, qy - 47]], '#f6d23a', { gap: 1.6, a: 0.8, over: 0.5 }); // ventana con luz
	// mecedora: respaldo alto, asiento, patas y balancín curvo; nadie sentado
	const mx = qx + 38, my = qy - 4;
	crayon(ctx, R, [[mx - 12, my - 22], [mx - 16, my - 58]], '#4a2a14', { w: 2.4 });
	crayon(ctx, R, [[mx + 4, my - 22], [mx, my - 58]], '#4a2a14', { w: 2.4 });
	crayon(ctx, R, [[mx - 16, my - 58], [mx, my - 58]], '#4a2a14', { w: 2.4 });
	for (let i = 1; i < 4; i++) crayon(ctx, R, [[mx - 13 - i * 0.6, my - 22 - i * 9], [mx + 3 - i * 0.6, my - 22 - i * 9]], '#4a2a14', { w: 1.2, passes: 1 });
	crayon(ctx, R, [[mx - 12, my - 22], [mx + 18, my - 22]], '#4a2a14', { w: 2.6 }); // asiento
	crayon(ctx, R, [[mx - 10, my - 22], [mx - 12, my - 6]], '#4a2a14', { w: 2 }); crayon(ctx, R, [[mx + 16, my - 22], [mx + 14, my - 6]], '#4a2a14', { w: 2 });
	crayon(ctx, R, [[mx - 22, my - 10], [mx - 8, my - 4], [mx + 10, my - 4], [mx + 24, my - 12]], '#4a2a14', { w: 2.4 }); // balancín
	crayon(ctx, R, [[mx - 18, my - 30], [mx - 20, my - 34]], '#4a2a14', { w: 1.4, passes: 1 }); // (rayitas de movimiento: el niño la dibujó meciéndose)
	crayon(ctx, R, [[mx - 22, my - 22], [mx - 25, my - 26]], '#4a2a14', { w: 1.4, passes: 1 });

	// bolitas blancas de lana en el prado, cada una con una lucecita amarilla encima
	const sheep = [[120, 262], [220, 236], [262, 282], [312, 248], [196, 306], [304, 312], [96, 316]];
	sheep.forEach(([x, y], i) => {
		const r = 13 + R() * 3;
		for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; crayonFill(ctx, R, ellipsePts(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.4, r * 0.55, r * 0.5, 8), '#ffffff', { gap: 1.2, a: 0.95, over: 0.6, w: 2.6 }); }
		crayonFill(ctx, R, ellipsePts(x, y, r * 0.7, r * 0.55, 10), '#ffffff', { gap: 1.2, a: 0.95, over: 0.6, w: 2.6 });
		crayon(ctx, R, ellipsePts(x, y, r, r * 0.78, 14), '#a8a8b4', { w: 1.1, passes: 1, jit: 2.2 });
		crayon(ctx, R, [[x - 5, y + r * 0.7], [x - 6, y + r * 0.7 + 6]], '#3a3a44', { w: 2, passes: 2 }); crayon(ctx, R, [[x + 5, y + r * 0.7], [x + 6, y + r * 0.7 + 6]], '#3a3a44', { w: 2, passes: 2 });
		// lucecita
		const ly = y - r - 12 - R() * 4, lx = x + (R() - 0.5) * 4;
		crayonFill(ctx, R, ellipsePts(lx, ly, 4, 4, 8), '#f6d23a', { gap: 1.2, a: 0.95, over: 0.4 });
		for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; crayon(ctx, R, [[lx + Math.cos(a) * 7, ly + Math.sin(a) * 7], [lx + Math.cos(a) * 11, ly + Math.sin(a) * 11]], '#f2b43a', { w: 1.4, passes: 1, jit: 0.6 }); }
	});
	paperTooth(ctx, W, H, 77, 0.55);
	// firma infantil y un trozo de celo arriba
	ctx.save(); ctx.translate(W - 70, H - 26); ctx.rotate(-0.08); ctx.fillStyle = '#4a6ad0'; ctx.globalAlpha = 0.75; ctx.font = '700 15px "Comic Sans MS", Nunito, sans-serif'; ctx.fillText('mi rancho', -18, 0); ctx.restore();
	ctx.save(); ctx.translate(W / 2, 6); ctx.rotate(0.04); ctx.fillStyle = 'rgba(255,255,225,.55)'; ctx.fillRect(-34, -8, 68, 18); ctx.restore();
	return { canvas: cv, done: Promise.resolve(true) };
}

/** Grano y viñeteado de foto impresa sobre el área de la imagen. */
function photoFinish(ctx, x, y, w, hgt, seed, { grain = 18, warm = 4, vig = 0.4 } = {}) {
	ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, hgt); ctx.clip();
	const vg = ctx.createRadialGradient(x + w / 2, y + hgt / 2, hgt * 0.35, x + w / 2, y + hgt / 2, w * 0.65);
	vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,10,${vig})`);
	ctx.fillStyle = vg; ctx.fillRect(x, y, w, hgt);
	ctx.restore();
	try {
		const img = ctx.getImageData(x, y, w, hgt), d = img.data, RN = mulberry(seed);
		for (let i = 0; i < d.length; i += 4) { const n = (RN() - 0.5) * grain; d[i] += n + warm; d[i + 1] += n; d[i + 2] += n - warm * 0.5; }
		ctx.putImageData(img, x, y);
	} catch (e) { /* sin acceso a píxeles: sin grano */ }
}

/** Cuadro: foto desechable, algo movida, desde lo alto de un faro de noche. */
export function paintFaroNoche() {
	const W = 480, H = 360;
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H;
	cv.className = 'acuarela foto';
	const ctx = cv.getContext('2d');
	const R = mulberry('faro-olivo');
	const B = 14, IW = W - 2 * B, IH = H - 2 * B - 18;
	ctx.fillStyle = '#f8f6f0'; ctx.fillRect(0, 0, W, H);
	// la escena se pinta en un lienzo aparte y se estampa dos veces desplazada: foto movida
	const sc = document.createElement('canvas'); sc.width = IW; sc.height = IH;
	const c = sc.getContext('2d');
	const sky = c.createLinearGradient(0, 0, 0, IH);
	sky.addColorStop(0, '#070b1c'); sky.addColorStop(0.45, '#121c3c'); sky.addColorStop(1, '#0a1022');
	c.fillStyle = sky; c.fillRect(0, 0, IW, IH);
	for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(230,236,255,${0.2 + R() * 0.5})`; c.fillRect(R() * IW, R() * 90, 1.2, 1.2); }
	// mar del puerto: horizonte alto, agua oscura con brillos sueltos
	const hz = 92;
	c.fillStyle = '#0d1834'; c.fillRect(0, hz, IW, IH);
	c.fillStyle = 'rgba(140,160,220,.18)'; for (let i = 0; i < 60; i++) c.fillRect(IW * 0.35 + R() * IW * 0.65, hz + 6 + R() * (IH - hz), 3 + R() * 6, 1);
	// espigón del puerto con farolas
	c.fillStyle = '#1c2032'; c.beginPath(); c.moveTo(IW * 0.46, 200); c.lineTo(IW * 0.9, 150); c.lineTo(IW * 0.92, 156); c.lineTo(IW * 0.48, 208); c.fill();
	for (let k = 0; k < 6; k++) { const x = IW * 0.5 + k * 30, y = 196 - k * 7.2; const lg = c.createRadialGradient(x, y - 4, 0, x, y - 4, 8); lg.addColorStop(0, 'rgba(255,214,140,.9)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = lg; c.fillRect(x - 8, y - 12, 16, 16); }
	// cuesta con casas blancas (izquierda): baja desde arriba a la izquierda hasta el agua
	const slopeY = x => 84 + x * 0.78; // borde de la ladera
	c.fillStyle = '#20222e'; c.beginPath(); c.moveTo(0, 84); c.lineTo(IW * 0.5, slopeY(IW * 0.5)); c.lineTo(IW * 0.5, IH); c.lineTo(0, IH); c.fill();
	const houses = [];
	for (let y = 92; y < IH - 40; y += 17 + R() * 6) for (let x = 2 + R() * 14; x < IW * 0.48; x += 22 + R() * 18) {
		if (y < slopeY(x + 20) + 4 || R() < 0.22) continue;
		houses.push([x, y + R() * 5, 13 + R() * 11, 9 + R() * 5]);
	}
	houses.forEach(([x, y, w, hh]) => {
		c.fillStyle = '#b8bccb'; c.fillRect(x, y, w, hh);
		c.fillStyle = '#7a7e96'; c.fillRect(x + w - 4, y, 4, hh); // lado en sombra
		c.fillStyle = '#d8dbe6'; c.fillRect(x, y, w - 4, 1.5); // borde de azotea
		c.fillStyle = '#2a2c3a'; c.fillRect(x + 2 + R() * 4, y + hh - 5, 2.5, 5); // puerta
		if (R() < 0.5) { c.fillStyle = '#ffd88a'; c.fillRect(x + w - 9, y + 3, 3, 3); }
	});
	// calle en zigzag con farolas entre las casas
	for (let k = 0; k < 8; k++) { const x = 20 + k * 22 + (k % 2) * 8, y = slopeY(x) + 30 + k * 6; const lg = c.createRadialGradient(x, y, 0, x, y, 6); lg.addColorStop(0, 'rgba(255,200,120,.8)'); lg.addColorStop(1, 'rgba(255,190,110,0)'); c.fillStyle = lg; c.fillRect(x - 6, y - 6, 12, 12); }
	// barcas con lucecitas, en el agua del puerto
	for (let i = 0; i < 9; i++) {
		const x = IW * 0.6 + R() * IW * 0.36, y = 214 + R() * (IH - 290);
		c.fillStyle = '#3a4058'; c.beginPath(); c.moveTo(x - 10, y); c.lineTo(x + 10, y); c.lineTo(x + 7, y + 4); c.lineTo(x - 7, y + 4); c.fill();
		c.fillRect(x - 0.5, y - 12, 1, 12);
		const lg = c.createRadialGradient(x, y - 12, 0, x, y - 12, 8); lg.addColorStop(0, 'rgba(255,224,150,.95)'); lg.addColorStop(1, 'rgba(255,200,120,0)');
		c.fillStyle = lg; c.fillRect(x - 9, y - 21, 18, 18);
		c.fillStyle = 'rgba(255,214,140,.3)'; c.fillRect(x - 1, y + 5, 2, 8 + R() * 10); // reflejo
	}
	// barandilla del faro en primer plano (abajo), oscura
	c.fillStyle = '#07080e'; c.fillRect(0, IH - 14, IW, 14);
	for (let x = 4; x < IW; x += 26) c.fillRect(x, IH - 40, 3, 26);
	c.fillRect(0, IH - 42, IW, 4);
	c.fillStyle = 'rgba(200,190,170,.35)'; c.fillRect(0, IH - 42, IW, 1.2);
	// el haz: cono pálido en diagonal desde arriba a la izquierda hacia el puerto
	c.save(); c.globalCompositeOperation = 'lighter'; c.filter = 'blur(7px)';
	const ox = -30, oy = 6, ang = 0.42, len = IW * 1.4;
	for (let k = 0; k < 3; k++) {
		const spread = 0.05 + k * 0.05;
		const gr = c.createLinearGradient(ox, oy, ox + Math.cos(ang) * len, oy + Math.sin(ang) * len);
		gr.addColorStop(0, `rgba(255,248,210,${0.32 - k * 0.08})`); gr.addColorStop(0.6, `rgba(220,230,240,${0.14 - k * 0.03})`); gr.addColorStop(1, 'rgba(200,210,240,0)');
		c.fillStyle = gr; c.beginPath(); c.moveTo(ox, oy);
		c.lineTo(ox + Math.cos(ang - spread) * len, oy + Math.sin(ang - spread) * len);
		c.lineTo(ox + Math.cos(ang + spread) * len, oy + Math.sin(ang + spread) * len); c.fill();
	}
	c.restore();
	// estampado movido: copia fantasma desplazada + copia principal
	ctx.save(); ctx.beginPath(); ctx.rect(B, B, IW, IH); ctx.clip();
	ctx.drawImage(sc, B, B);
	ctx.globalAlpha = 0.45; ctx.drawImage(sc, B + 4, B + 2);
	ctx.globalAlpha = 0.25; ctx.drawImage(sc, B + 7, B + 3.5);
	ctx.globalAlpha = 1;
	// flash de la desechable reflejado en la barandilla
	const fl = ctx.createRadialGradient(B + IW * 0.3, B + IH - 30, 0, B + IW * 0.3, B + IH - 30, 60);
	fl.addColorStop(0, 'rgba(255,255,240,.35)'); fl.addColorStop(1, 'rgba(255,255,240,0)');
	ctx.fillStyle = fl; ctx.fillRect(B, B, IW, IH);
	ctx.restore();
	photoFinish(ctx, B, B, IW, IH, 21, { grain: 26, warm: 6, vig: 0.5 });
	ctx.save(); ctx.fillStyle = '#8a8478'; ctx.globalAlpha = 0.8; ctx.font = '600 10px Nunito, sans-serif'; ctx.fillText('desde arriba del faro', B + 4, H - 10); ctx.restore();
	return { canvas: cv, done: Promise.resolve(true) };
}

/** Cuadro: foto del lago de noche. Luna entera reflejada, halo azul en la orilla, ondulación roja bajo el agua. */
export function paintLagoNoche() {
	const W = 480, H = 360;
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H;
	cv.className = 'acuarela foto';
	const ctx = cv.getContext('2d');
	const R = mulberry('lago-furia');
	const B = 14, IW = W - 2 * B, IH = H - 2 * B - 18;
	ctx.fillStyle = '#f8f6f0'; ctx.fillRect(0, 0, W, H);
	ctx.save(); ctx.beginPath(); ctx.rect(B, B, IW, IH); ctx.clip();
	const hz = B + 132; // horizonte
	const sky = ctx.createLinearGradient(0, B, 0, hz);
	sky.addColorStop(0, '#04070f'); sky.addColorStop(1, '#0e1a34');
	ctx.fillStyle = sky; ctx.fillRect(B, B, IW, hz - B);
	for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(220,230,255,${0.15 + R() * 0.55})`; ctx.fillRect(B + R() * IW, B + R() * (hz - B - 20), 1.2, 1.2); }
	// luna llena
	const mx = W / 2 + 24, my = B + 52, mr = 22;
	const halo = ctx.createRadialGradient(mx, my, mr, mx, my, mr * 4); halo.addColorStop(0, 'rgba(220,226,240,.28)'); halo.addColorStop(1, 'rgba(200,210,240,0)');
	ctx.fillStyle = halo; ctx.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
	ctx.fillStyle = '#f2f0e2'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.fill();
	ctx.fillStyle = 'rgba(180,180,170,.35)'; for (const [dx, dy, r] of [[-7, -5, 5], [6, 4, 4], [-2, 9, 3]]) { ctx.beginPath(); ctx.arc(mx + dx, my + dy, r, 0, 7); ctx.fill(); }
	// lago: azul negro, quieto
	const lake = ctx.createLinearGradient(0, hz, 0, B + IH);
	lake.addColorStop(0, '#0c1630'); lake.addColorStop(1, '#050913');
	ctx.fillStyle = lake; ctx.fillRect(B, hz, IW, IH);
	// orilla lejana y pinos en silueta a los lados
	ctx.fillStyle = '#060a10'; ctx.fillRect(B, hz - 6, IW, 7);
	const pine = (x, base, hh, w) => { ctx.beginPath(); ctx.moveTo(x, base - hh); for (let k = 1; k <= 4; k++) { const yy = base - hh + hh * k / 4.4; ctx.lineTo(x + w * k / 4, yy); ctx.lineTo(x + w * k / 9, yy - 3); } ctx.lineTo(x + 2, base); ctx.lineTo(x - 2, base); for (let k = 4; k >= 1; k--) { const yy = base - hh + hh * k / 4.4; ctx.lineTo(x - w * k / 9, yy - 3); ctx.lineTo(x - w * k / 4, yy); } ctx.fill(); };
	ctx.fillStyle = '#03060a';
	for (let i = 0; i < 9; i++) pine(B + 6 + i * 13 + R() * 6, hz + 2 + i * 1.2, 80 - i * 6 + R() * 12, 18 - i);
	for (let i = 0; i < 9; i++) pine(W - B - 6 - i * 13 - R() * 6, hz + 2 + i * 1.2, 84 - i * 6 + R() * 12, 18 - i);
	// reflejo de la luna: un círculo entero, sin romperse (agua en calma total)
	const ry = hz + (hz - my) * 0.62;
	ctx.fillStyle = 'rgba(236,234,214,.82)'; ctx.beginPath(); ctx.ellipse(mx, ry, mr, mr * 0.96, 0, 0, 7); ctx.fill();
	// hilo azul pálido bajo el agua que se pierde a la derecha
	ctx.save(); ctx.strokeStyle = 'rgba(150,200,255,.5)'; ctx.lineWidth = 1; ctx.filter = 'blur(0.4px)';
	ctx.beginPath(); const tx0 = B + 96, ty0 = B + IH - 52;
	ctx.moveTo(tx0, ty0);
	for (let t = 1; t <= 24; t++) { const x = tx0 + t * 15, y = ty0 - t * 2.2 + Math.sin(t * 0.8) * 3; ctx.lineTo(x, y); }
	ctx.stroke(); ctx.globalAlpha = 0.25; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
	// ondulación roja bajo la superficie en el centro del lago: forma difusa, sin silueta
	const rx = W / 2 - 40, rcy = hz + 74;
	ctx.save(); ctx.globalCompositeOperation = 'lighter';
	const rg = ctx.createRadialGradient(rx, rcy + 4, 0, rx, rcy + 4, 26); rg.addColorStop(0, 'rgba(150,20,34,.35)'); rg.addColorStop(1, 'rgba(120,10,24,0)');
	ctx.filter = 'blur(4px)'; ctx.fillStyle = rg; ctx.fillRect(rx - 30, rcy - 14, 60, 36);
	ctx.filter = 'blur(1.6px)';
	for (let k = 0; k < 4; k++) { ctx.strokeStyle = `rgba(225,60,70,${0.6 - k * 0.12})`; ctx.lineWidth = 2 - k * 0.3; ctx.beginPath(); ctx.ellipse(rx, rcy, 10 + k * 13, 2.6 + k * 3.2, 0, 0, 7); ctx.stroke(); }
	ctx.restore();
	// orilla de arena gris en primer plano
	ctx.fillStyle = '#4a4c54'; ctx.beginPath(); ctx.moveTo(B, B + IH - 30);
	for (let x = B; x <= W - B; x += 24) ctx.lineTo(x, B + IH - 34 + Math.sin(x / 40) * 4 + (x - B) * 0.04);
	ctx.lineTo(W - B, B + IH); ctx.lineTo(B, B + IH); ctx.fill();
	ctx.fillStyle = 'rgba(160,166,180,.12)'; for (let i = 0; i < 80; i++) ctx.fillRect(B + R() * IW, B + IH - 30 + R() * 30, 1.5, 1);
	// figurita oscura en la orilla, con halo azul que se abre en anillos sobre el agua
	const fx = B + 96, fy = B + IH - 38;
	ctx.save(); ctx.globalCompositeOperation = 'lighter';
	for (let k = 0; k < 5; k++) { ctx.strokeStyle = `rgba(90,170,255,${0.5 - k * 0.09})`; ctx.lineWidth = 1.6 - k * 0.2; ctx.beginPath(); ctx.ellipse(fx + 8, fy - 8 - k * 1.5, 16 + k * 18, 3.5 + k * 3.6, 0, Math.PI, Math.PI * 2); ctx.stroke(); }
	const fh = ctx.createRadialGradient(fx, fy - 8, 0, fx, fy - 8, 22); fh.addColorStop(0, 'rgba(110,190,255,.75)'); fh.addColorStop(1, 'rgba(60,140,255,0)');
	ctx.fillStyle = fh; ctx.fillRect(fx - 24, fy - 32, 48, 48);
	ctx.restore();
	ctx.fillStyle = '#05070c'; // bulto pequeño e informe: no se distingue qué es
	ctx.beginPath(); ctx.ellipse(fx, fy - 4, 5, 6, 0, 0, 7); ctx.fill();
	ctx.beginPath(); ctx.arc(fx + 1, fy - 12, 3.6, 0, 7); ctx.fill();
	ctx.restore();
	photoFinish(ctx, B, B, IW, IH, 44, { grain: 20, warm: -2, vig: 0.45 });
	// título manuscrito en la esquina, sobre el borde blanco
	ctx.save(); ctx.translate(W - B - 8, H - 11); ctx.rotate(-0.05); ctx.fillStyle = '#2a3a6a'; ctx.globalAlpha = 0.8; ctx.font = 'italic 600 14px Nunito, serif'; ctx.textAlign = 'right';
	ctx.fillText('Silencio', 0, 0); ctx.restore();
	return { canvas: cv, done: Promise.resolve(true) };
}

/** Visor a pantalla completa para un objeto clave con cuadro. */
export async function viewArt(itemId) {
	const it = D.items[toID(itemId)] || {};
	const p = G.party.concat(G.boxes.flat()).find(x => x.uid === G.vars?.riolu_uid);
	const look = G.player.look || {};
	const painting = it.art === 'acuarela_riolu' ? paintAcuarelaRiolu({ look, shiny: !!p?.shiny })
		: it.art === 'santuario_encinar' ? paintSantuarioEncinar()
		: it.art === 'foto_gira' ? paintFotoGira({ look })
		: it.art === 'rancho_atardecer' ? paintRanchoAtardecer()
		: it.art === 'faro_olivo_noche' ? paintFaroNoche()
		: it.art === 'lago_furia_noche' ? paintLagoNoche()
		: null;
	if (!painting) return;
	const note = h('div', { class: 'art-note' }, it.desc || '');
	const ov = h('div', { class: 'overlay dim art-viewer', onclick: () => ov.remove() },
		h('div', { class: 'art-frame' }, painting.canvas),
		h('div', { class: 'art-title' }, it.name || ''),
		note,
		h('div', { class: 'art-hint' }, 'Toca para cerrar'));
	document.body.append(ov);
	const ok = await painting.done;
	if (!ok) note.textContent = 'La pintura está a medio secar: conéctate a internet una vez para que se vea entera.';
}
