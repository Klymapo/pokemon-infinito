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

/** Visor a pantalla completa para un objeto clave con cuadro. */
export async function viewArt(itemId) {
	const it = D.items[toID(itemId)] || {};
	const p = G.party.concat(G.boxes.flat()).find(x => x.uid === G.vars?.riolu_uid);
	const painting = it.art === 'acuarela_riolu' ? paintAcuarelaRiolu({ look: G.player.look || {}, shiny: !!p?.shiny }) : null;
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
