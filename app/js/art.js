// Arte: sprites de Pokémon (PokeAPI, descargados por el teléfono) y arte original procedural en pixel art.
import { D, toID, TYPE_COLORS } from './data.js';
import { phase } from './time.js';
import { retratoGrid, N as RN } from './retrato.js';

const PK = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const TR = 'https://play.pokemonshowdown.com/sprites/trainers/';

function pidOf(spId) {
	const s = D.species[toID(spId)];
	return s ? (s.pid || s.num) : 0;
}

/** URLs candidatas para un sprite de Pokémon, en orden de preferencia. */
export function monUrls(spId, { back = false, shiny = false, anim = true } = {}) {
	const pid = pidOf(spId);
	const num = D.species[toID(spId)]?.num || pid;
	const sh = shiny ? 'shiny/' : '';
	const urls = [];
	if (anim) urls.push(PK + 'other/showdown/' + (back ? 'back/' : '') + sh + pid + '.gif');
	urls.push(PK + (back ? 'back/' : '') + sh + pid + '.png');
	if (!back) urls.push(PK + 'other/home/' + sh + pid + '.png');
	if (pid !== num) {
		if (anim) urls.push(PK + 'other/showdown/' + (back ? 'back/' : '') + sh + num + '.gif');
		urls.push(PK + (back ? 'back/' : '') + sh + num + '.png');
	}
	return urls;
}

/** Elemento <img> con cadena de respaldos y tarjeta de color si nada carga. */
export function monImg(spId, opts = {}) {
	const urls = monUrls(spId, opts);
	const img = document.createElement('img');
	img.className = 'px';
	img.alt = D.species[toID(spId)]?.name || '';
	img.decoding = 'async';
	img.draggable = false;
	let i = 0;
	img.onerror = () => {
		i++;
		if (i < urls.length) img.src = urls[i];
		else {
			const fb = fallbackCard(spId);
			img.replaceWith(fb);
		}
	};
	img.src = urls[0];
	return img;
}

export function fallbackCard(spId) {
	const s = D.species[toID(spId)];
	const d = document.createElement('div');
	d.className = 'fallback';
	const c1 = TYPE_COLORS[s?.types?.[0]] || '#678', c2 = TYPE_COLORS[s?.types?.[1]] || c1;
	d.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
	d.textContent = (s?.name || '?').slice(0, 2);
	return d;
}

const IT = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';
const POCKET_EMOJI = { medicine: '💊', pokeballs: '◓', berries: '🍒', key: '🗝️', machines: '💿', battle: '⚔️', mail: '✉️', misc: '✦' };
/** Icono de objeto (sprite de PokeAPI, en caché); si no hay, un emoji según el bolsillo. */
export function itemImg(id, { found = true } = {}) {
	const it = D.items[toID(id)] || {};
	const box = document.createElement('span');
	box.className = 'itemicon' + (found ? '' : ' unknown');
	const emoji = () => { box.textContent = it.icon || POCKET_EMOJI[it.pocket] || '✦'; };
	const px = PX_ITEMS[toID(id)];
	if (px) { box.classList.add('px'); box.append(pxItem(toID(id), 32)); return box; }
	if (it.ic && !it.custom) {
		const img = document.createElement('img');
		img.alt = ''; img.decoding = 'async'; img.draggable = false;
		img.onerror = () => { img.remove(); emoji(); };
		img.src = IT + it.ic + '.png';
		box.append(img);
	} else emoji();
	return box;
}

export function trainerImg(name, look) {
	const img = document.createElement('img');
	img.className = 'px';
	img.draggable = false;
	img.onerror = () => { img.replaceWith(portraitCanvas(look || { seed: name })); };
	img.src = TR + name + '.png';
	return img;
}

// ---------------- Utilidades de pixel art ----------------
function mulberry(seed) {
	let a = typeof seed === 'number' ? seed : [...String(seed)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
	return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = ([r, g, b]) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const shade = (c, t) => t < 0 ? mix(c, '#000000', -t) : mix(c, '#ffffff', t);

// ---------------- Escenas ----------------
const SKY = {
	manana: ['#9ec9f5', '#ffd9b3'], dia: ['#5aa8f0', '#bfe3ff'], tarde: ['#5b4b9a', '#ff9b6b'], noche: ['#0e1630', '#273866'],
};

/**
 * Dibuja una escena pixel art en un canvas. spec: {type, seed, palette?, landmark?, ...}
 * types: city, town, route, forest, cave, coast, mountain, ruins, gym, lab, indoor, castle, tower, palace, plaza, ranch
 */
export function sceneCanvas(spec = {}, opts = {}) {
	const W = 192, H = 108;
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H; cv.className = 'px';
	const g = cv.getContext('2d');
	const R = mulberry(spec.seed || spec.type || 'x');
	const ph = opts.phase || phase();
	const night = ph === 'noche';
	const type = spec.type || 'route';
	const indoor = ['gym', 'lab', 'indoor', 'center'].includes(type);
	const px = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };

	if (indoor) {
		drawIndoor(g, W, H, type, spec, R, px);
		return cv;
	}
	// Cielo
	const [s1, s2] = SKY[ph];
	for (let y = 0; y < H; y++) { px(0, y, W, 1, mix(s1, s2, Math.min(1, y / (H * 0.7)))); }
	if (night) for (let i = 0; i < 40; i++) px(R() * W, R() * H * 0.5, 1, 1, R() < .3 ? '#ffffff' : '#9fb3e8');
	if (type === 'cave') { drawCave(g, W, H, R, px, spec); return cv; }
	// Sol/luna
	if (ph === 'tarde') { g.fillStyle = '#ffcf8a'; g.beginPath(); g.arc(150, 62, 11, 0, 7); g.fill(); }
	if (night) { g.fillStyle = '#f3efd8'; g.beginPath(); g.arc(160, 18, 7, 0, 7); g.fill(); g.fillStyle = s1; g.beginPath(); g.arc(163, 16, 6, 0, 7); g.fill(); }
	// Nubes
	if (!night) for (let i = 0; i < 4; i++) { const x = R() * W, y = 8 + R() * 25; const c = ph === 'tarde' ? '#f6b89a' : '#ffffff'; px(x, y, 18 + R() * 16, 4, c); px(x + 4, y - 3, 12, 3, c); }
	const tint = c => night ? mix(c, '#1a2550', 0.55) : ph === 'tarde' ? mix(c, '#7a3d5a', 0.25) : c;
	const pal = { far: tint(spec.far || '#7d9fc4'), hill: tint(spec.hill || '#5f9a5a'), ground: tint(spec.ground || '#6fb45f'), path: tint(spec.path || '#d8c08a'), dark: tint('#2f5a35') };
	// Montañas lejanas
	if (type !== 'coast') {
		g.fillStyle = pal.far;
		g.beginPath(); g.moveTo(0, 70);
		for (let x = 0; x <= W; x += 8) g.lineTo(x, 46 + Math.sin(x / 23 + R()) * 8 + R() * 6);
		g.lineTo(W, 108); g.lineTo(0, 108); g.fill();
	}
	switch (type) {
	case 'city': case 'plaza': drawCity(g, W, H, R, px, pal, night, spec); break;
	case 'town': case 'ranch': drawTown(g, W, H, R, px, pal, night, spec); break;
	case 'forest': drawForest(g, W, H, R, px, pal, night); break;
	case 'coast': drawCoast(g, W, H, R, px, pal, night, ph); break;
	case 'mountain': drawMountain(g, W, H, R, px, pal); break;
	case 'ruins': drawRuins(g, W, H, R, px, pal, night); break;
	case 'castle': case 'palace': drawCastle(g, W, H, R, px, pal, night, type); break;
	case 'tower': drawTower(g, W, H, R, px, pal, night); break;
	default: drawRoute(g, W, H, R, px, pal, night, spec);
	}
	if (spec.fog || (type === 'castle' && night)) { for (let y = 60; y < H; y++) { g.fillStyle = `rgba(220,225,240,${(y - 60) / 200})`; g.fillRect(0, y, W, 1); } }
	if (spec.fissure) drawFissure(g, W, H, R);
	return cv;
}

function grassBand(g, W, H, R, px, pal, y0) {
	px(0, y0, W, H - y0, pal.ground);
	for (let i = 0; i < 70; i++) { const x = R() * W, y = y0 + 2 + R() * (H - y0); px(x, y, 1, 2, shade(pal.ground, -0.18)); px(x + 1, y + 1, 1, 1, shade(pal.ground, 0.15)); }
}
function tree(g, x, y, s, px, pal, R) {
	const trunk = '#6b4a2b';
	px(x + s * 0.42, y + s * 0.7, s * 0.16, s * 0.35, trunk);
	g.fillStyle = shade(pal.dark, -0.05);
	g.beginPath(); g.arc(x + s / 2, y + s * 0.42, s * 0.42, 0, 7); g.fill();
	g.fillStyle = pal.dark;
	g.beginPath(); g.arc(x + s * 0.44, y + s * 0.36, s * 0.32, 0, 7); g.fill();
	g.fillStyle = shade(pal.dark, 0.12);
	g.beginPath(); g.arc(x + s * 0.38, y + s * 0.28, s * 0.14, 0, 7); g.fill();
}
function drawRoute(g, W, H, R, px, pal, night, spec) {
	g.fillStyle = pal.hill; g.beginPath(); g.moveTo(0, 74);
	for (let x = 0; x <= W; x += 6) g.lineTo(x, 66 + Math.sin(x / 17) * 4);
	g.lineTo(W, H); g.lineTo(0, H); g.fill();
	for (let i = 0; i < 6; i++) tree(g, R() * W - 10, 52 + R() * 8, 18 + R() * 8, px, pal, R);
	grassBand(g, W, H, R, px, pal, 76);
	// camino
	g.fillStyle = pal.path; g.beginPath(); g.moveTo(80, H); g.lineTo(96, 76); g.lineTo(104, 76); g.lineTo(130, H); g.fill();
	// hierba alta
	for (let i = 0; i < 18; i++) { const x = (i < 9 ? R() * 70 : 120 + R() * 70), y = 84 + R() * 20; px(x, y, 6, 3, shade(pal.ground, -0.3)); px(x + 1, y - 2, 1, 2, shade(pal.ground, -0.3)); px(x + 4, y - 2, 1, 2, shade(pal.ground, -0.3)); }
	if (spec.flowers) for (let i = 0; i < 26; i++) px(R() * W, 80 + R() * 28, 2, 2, spec.flowers);
}
function drawForest(g, W, H, R, px, pal, night) {
	px(0, 40, W, H, shade(pal.dark, -0.35));
	for (let i = 0; i < 14; i++) tree(g, R() * W - 14, 20 + R() * 30, 34 + R() * 20, px, { ...pal, dark: shade(pal.dark, -0.2 + R() * 0.2) }, R);
	grassBand(g, W, H, R, px, { ...pal, ground: shade(pal.ground, -0.25) }, 84);
	for (let i = 0; i < 8; i++) tree(g, R() * W - 14, 64 + R() * 14, 26 + R() * 14, px, pal, R);
	if (!night) for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(255,250,200,0.10)'; g.beginPath(); const x = R() * W; g.moveTo(x, 0); g.lineTo(x + 8, 0); g.lineTo(x + 30, H); g.lineTo(x + 18, H); g.fill(); }
	if (night) for (let i = 0; i < 12; i++) px(R() * W, 40 + R() * 60, 1, 1, '#e8ff9a');
}
function drawCity(g, W, H, R, px, pal, night, spec) {
	const bcols = ['#c9cfe0', '#aab6cf', '#d9c9b6', '#b9c4b4', '#cbb5c6', '#9fb0c9'];
	let x = -4;
	while (x < W) {
		const w = 14 + R() * 18, h = 26 + R() * 34;
		const c = night ? mix(bcols[(R() * 6) | 0], '#1a2550', 0.6) : bcols[(R() * 6) | 0];
		px(x, 80 - h, w, h, c);
		px(x, 80 - h, w, 2, shade(c, -0.2));
		for (let wy = 80 - h + 5; wy < 76; wy += 6) for (let wx = x + 3; wx < x + w - 3; wx += 5) px(wx, wy, 2, 3, night ? (R() < 0.6 ? '#ffd77a' : '#36406a') : shade(c, -0.25));
		x += w + 2;
	}
	if (spec.landmark === 'prism') {
		// Torre Prisma
		const cx = 96;
		px(cx - 5, 20, 10, 60, night ? '#cfe0ff' : '#e9eef8');
		px(cx - 8, 62, 16, 18, night ? '#9fb6ea' : '#cdd7ea');
		g.fillStyle = night ? '#ffe9a8' : '#bcd5ff'; g.beginPath(); g.moveTo(cx - 6, 20); g.lineTo(cx, 4); g.lineTo(cx + 6, 20); g.fill();
		for (let y = 24; y < 62; y += 6) px(cx - 3, y, 6, 2, night ? '#ffd77a' : '#9fb6d8');
		if (night) { g.fillStyle = 'rgba(255,230,150,0.18)'; g.beginPath(); g.arc(cx, 10, 22, 0, 7); g.fill(); }
	}
	if (spec.landmark === 'gate') {
		// Puerta Lemnis: arco con lemniscata
		const cx = 96, cy = 54;
		g.strokeStyle = night ? '#9fc3ff' : '#4c7cf0'; g.lineWidth = 3;
		g.beginPath();
		for (let t = 0; t <= Math.PI * 2 + 0.1; t += 0.05) { const d = 1 + Math.sin(t) ** 2; const xx = cx + 30 * Math.cos(t) / d, yy = cy + 30 * Math.sin(t) * Math.cos(t) / d; t === 0 ? g.moveTo(xx, yy) : g.lineTo(xx, yy); }
		g.stroke();
		g.fillStyle = 'rgba(160,200,255,0.25)'; g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.fill();
	}
	px(0, 80, W, H, night ? '#3b4366' : '#b9b3a6');
	for (let i = 0; i < W; i += 12) px(i, 92, 6, 1, night ? '#59628a' : '#d8d1c2');
	if (spec.trees !== false) for (let i = 0; i < 5; i++) tree(g, R() * W - 8, 70 + R() * 6, 14, px, pal, R);
}
function drawTown(g, W, H, R, px, pal, night, spec) {
	drawRoute.length;
	g.fillStyle = pal.hill; g.fillRect(0, 70, W, 40);
	grassBand(g, W, H, R, px, pal, 78);
	const roofs = spec.roofs || ['#c4533f', '#3f6ec4', '#c48f3f', '#5a9b4c'];
	for (let i = 0; i < 4; i++) {
		const x = 10 + i * 46 + R() * 8, y = 58 + R() * 6, w = 30, h = 20;
		px(x, y, w, h, night ? '#7f86a8' : '#f2ead8');
		g.fillStyle = night ? shade(roofs[i % roofs.length], -0.45) : roofs[i % roofs.length];
		g.beginPath(); g.moveTo(x - 4, y + 1); g.lineTo(x + w / 2, y - 12); g.lineTo(x + w + 4, y + 1); g.fill();
		px(x + 12, y + 9, 6, 11, '#6b4a2b');
		px(x + 4, y + 6, 5, 5, night ? '#ffd77a' : '#9cc3e8'); px(x + w - 9, y + 6, 5, 5, night ? '#ffd77a' : '#9cc3e8');
	}
	if (spec.ranch) for (let i = 0; i < W; i += 10) { px(i, 86, 2, 10, '#8a6a42'); px(i, 89, 10, 1, '#8a6a42'); }
	for (let i = 0; i < 4; i++) tree(g, R() * W - 8, 70 + R() * 10, 16, px, pal, R);
	g.fillStyle = pal.path; g.fillRect(0, 96, W, 6);
}
function drawCoast(g, W, H, R, px, pal, night, ph) {
	const sea = night ? '#1d3a6b' : ph === 'tarde' ? '#5a6fb0' : '#2f86d6';
	px(0, 54, W, 30, sea);
	for (let i = 0; i < 40; i++) px(R() * W, 56 + R() * 26, 6, 1, shade(sea, 0.25));
	px(0, 84, W, H, night ? '#8a7f62' : '#ead9a6');
	for (let i = 0; i < W; i += 14) px(i + R() * 6, 82, 10, 2, '#ffffff');
	if (R() < 0.7) { px(140, 40, 34, 18, night ? '#4a4a5f' : '#8f8a80'); g.fillStyle = night ? '#4a4a5f' : '#8f8a80'; g.beginPath(); g.moveTo(140, 58); g.lineTo(130, 70); g.lineTo(180, 70); g.lineTo(174, 58); g.fill(); }
}
function drawMountain(g, W, H, R, px, pal) {
	g.fillStyle = '#8d8070'; g.beginPath(); g.moveTo(0, 80); g.lineTo(50, 24); g.lineTo(90, 70); g.lineTo(130, 30); g.lineTo(192, 82); g.lineTo(192, 108); g.lineTo(0, 108); g.fill();
	g.fillStyle = '#a89a86'; g.beginPath(); g.moveTo(50, 24); g.lineTo(62, 40); g.lineTo(42, 36); g.fill();
	grassBand(g, W, H, R, px, { ...pal, ground: '#9b9474' }, 86);
	for (let i = 0; i < 10; i++) px(R() * W, 86 + R() * 20, 6, 4, '#7a7062');
}
function drawRuins(g, W, H, R, px, pal, night) {
	drawRoute(g, W, H, R, px, pal, night, {});
	for (let i = 0; i < 7; i++) {
		const x = 14 + i * 26 + R() * 6, h = 18 + R() * 16;
		px(x, 82 - h, 9, h, night ? '#6a6f86' : '#9c9a8e');
		px(x, 82 - h, 9, 2, night ? '#868ba3' : '#b9b7aa');
		px(x + 2, 82 - h + 5, 1, h - 8, night ? '#5a5f76' : '#86847a');
	}
}
function drawCastle(g, W, H, R, px, pal, night, type) {
	drawRoute(g, W, H, R, px, pal, night, {});
	const c = night ? '#3c3f5a' : type === 'palace' ? '#e8dcc0' : '#8d8a9c';
	px(60, 34, 72, 46, c);
	for (let x = 60; x < 132; x += 8) px(x, 30, 5, 5, c);
	px(52, 22, 14, 58, shade(c, -0.08)); px(126, 22, 14, 58, shade(c, -0.08));
	g.fillStyle = night ? '#5a3550' : '#5b6fa8';
	g.beginPath(); g.moveTo(50, 22); g.lineTo(59, 6); g.lineTo(68, 22); g.fill();
	g.beginPath(); g.moveTo(124, 22); g.lineTo(133, 6); g.lineTo(142, 22); g.fill();
	px(88, 60, 16, 20, '#4a2f20');
	for (let y = 40; y < 56; y += 10) for (let x = 70; x < 124; x += 14) px(x, y, 4, 6, night ? '#ffcf6a' : '#3d4f78');
}
function drawTower(g, W, H, R, px, pal, night) {
	drawTown(g, W, H, R, px, pal, night, {});
	const c = night ? '#7a7f9a' : '#d8d2c2';
	px(84, 4, 24, 78, c);
	px(80, 70, 32, 12, shade(c, -0.1));
	for (let y = 12; y < 66; y += 9) px(92, y, 8, 5, night ? '#ffd77a' : '#7f8fb0');
	// estatua de Lucario en lo alto
	px(93, 0, 6, 5, night ? '#4c6fd0' : '#3f63c9');
}
function drawCave(g, W, H, R, px, spec) {
	const base = spec.rock || '#3d3a4a';
	px(0, 0, W, H, shade(base, -0.4));
	g.fillStyle = shade(base, 0.05);
	g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= W; x += 6) g.lineTo(x, 12 + R() * 16); g.lineTo(W, 0); g.fill();
	g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 6) g.lineTo(x, 78 + R() * 10); g.lineTo(W, H); g.fill();
	for (let i = 0; i < 10; i++) { const x = R() * W; g.beginPath(); g.moveTo(x, 18); g.lineTo(x + 3, 30 + R() * 14); g.lineTo(x + 6, 18); g.fill(); }
	if (spec.crystals) for (let i = 0; i < 14; i++) { const x = R() * W, y = 74 + R() * 20, c = spec.crystals; g.fillStyle = c; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3, y - 8); g.lineTo(x + 6, y); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x + 2, y - 5, 1, 3); }
	g.fillStyle = 'rgba(255,220,150,0.10)'; g.beginPath(); g.arc(W / 2, H * 0.6, 60, 0, 7); g.fill();
	if (spec.dark) { g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(0, 0, W, H); }
}
function drawIndoor(g, W, H, type, spec, R, px) {
	const wall = spec.wall || (type === 'center' ? '#f3d9df' : type === 'lab' ? '#dfe7f2' : type === 'gym' ? '#4a4f6a' : '#e6dcc8');
	const floor = spec.floor || (type === 'gym' ? '#8c7c66' : '#c8b49a');
	px(0, 0, W, 64, wall);
	px(0, 60, W, 4, shade(wall, -0.2));
	px(0, 64, W, H, floor);
	for (let y = 64; y < H; y += 8) for (let x = (y / 8) % 2 ? 0 : 8; x < W; x += 16) px(x, y, 8, 8, shade(floor, -0.06));
	if (type === 'gym') { g.strokeStyle = '#f3e6c4'; g.lineWidth = 2; g.strokeRect(30, 70, 132, 34); g.beginPath(); g.arc(96, 87, 10, 0, 7); g.stroke(); }
	for (let i = 0; i < 3; i++) { const x = 20 + i * 62; px(x, 14, 30, 22, type === 'gym' ? '#2c3150' : '#9cc3e8'); px(x, 24, 30, 1, shade(wall, -0.1)); }
	if (type === 'lab') { px(20, 44, 44, 18, '#ffffff'); px(130, 30, 40, 32, '#7a8aa8'); for (let i = 0; i < 5; i++) px(134 + i * 7, 34, 4, 4, R() < .5 ? '#7ad67a' : '#ff7a7a'); }
	if (type === 'center') { px(70, 40, 52, 22, '#e85a6a'); px(70, 40, 52, 4, '#ffffff'); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(96, 22, 9, 0, 7); g.fill(); g.fillStyle = '#e85a6a'; g.fillRect(87, 21, 18, 2); }
}
function drawFissure(g, W, H, R) {
	g.save();
	g.strokeStyle = 'rgba(170,140,255,0.9)'; g.lineWidth = 2; g.shadowColor = '#a58cff'; g.shadowBlur = 8;
	g.beginPath(); let x = 120, y = 18; g.moveTo(x, y);
	for (let i = 0; i < 9; i++) { x += (R() - 0.5) * 14; y += 7; g.lineTo(x, y); }
	g.stroke(); g.restore();
}

// ---------------- Retratos (arte original; el dibujo está en retrato.js) ----------------
export const HAIRS = ['#2b2b38', '#5a3a26', '#8a5a2f', '#d8a85a', '#e9dcc0', '#c4473a', '#e07a3a', '#3b5bb5', '#5aa36b', '#d06aa6', '#8c6cd0', '#cfd6e2'];
export const LOOK_DEFAULTS = { skin: 1, hair: 'short', hairColor: '#5a3a26', eyes: '#3a5fc4', outfit: '#4c7cf0', outfit2: '#f3e6c4', acc: '' };

// Las matrices se comparten entre canvas con el mismo look (listas con muchos retratos, editor de aspecto).
const GRID_CACHE = new Map();
const reduceMotion =() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
function paintGrid(g, grid, bg) {
	g.fillStyle = bg; g.fillRect(0, 0, RN, RN);
	g.fillStyle = shade(bg, 0.07); for (let y = 0; y < RN; y += 6) g.fillRect(0, y, RN, 3);
	for (let y = 0; y < RN; y++) for (let x = 0; x < RN; x++) if (grid[y][x]) { g.fillStyle = grid[y][x]; g.fillRect(x, y, 1, 1); }
}

/**
 * Retrato de busto 48×48 (ver retrato.js para todos los parámetros de look).
 * El canvas devuelto parpadea solo mientras está en pantalla y tiene .talk(true|false) para mover la boca.
 */
export function portraitCanvas(look = {}, opts = {}) {
	const cv = document.createElement('canvas');
	cv.width = RN; cv.height = RN; cv.className = 'px portrait-px';
	const g = cv.getContext('2d');
	const bg = look.bg || '#2a3c66';
	const lk = JSON.stringify(look);
	const frame = (blink, talk) => {
		const k = (blink ? 'b' : '') + (talk ? 't' : '') + '|' + lk;
		let g = GRID_CACHE.get(k);
		if (!g) { g = retratoGrid(look, { blink, talk }); if (GRID_CACHE.size > 240) GRID_CACHE.delete(GRID_CACHE.keys().next().value); GRID_CACHE.set(k, g); }
		return g;
	};
	let blinking = false, talking = false, mouthOpen = false;
	const draw = () => paintGrid(g, frame(blinking, talking && mouthOpen), bg);
	draw();
	if (opts.animate === false || reduceMotion()) { cv.talk = () => {}; return cv; }
	// Parpadeo: 120 ms cada 3–6 s al azar, solo mientras el canvas siga en el documento
	// (si nunca llega a montarse en ~20 s, se abandona para no dejar temporizadores huérfanos)
	let seen = false, tries = 0;
	const blinkLoop = () => {
		if (!cv.isConnected) { if (seen || ++tries > 50) return; setTimeout(blinkLoop, 400); return; }
		seen = true;
		blinking = true; draw();
		setTimeout(() => { blinking = false; draw(); setTimeout(blinkLoop, 3000 + Math.random() * 3000); }, 120);
	};
	setTimeout(blinkLoop, 1200 + Math.random() * 2500);
	// Al hablar: alterna boca cerrada/abierta
	let talkTimer = null;
	cv.talk = (on) => {
		talking = !!on;
		clearInterval(talkTimer); talkTimer = null;
		mouthOpen = false;
		if (talking) talkTimer = setInterval(() => { if (!cv.isConnected) { clearInterval(talkTimer); return; } mouthOpen = !mouthOpen; draw(); }, 130);
		draw();
	};
	return cv;
}

// ---------------- Poké Ball pixelada (icono de interfaz) ----------------
const BALL_PX = [
	'.....KKKKKK.....',
	'...KKRRRRRRKK...',
	'..KRRRRRRWRRRK..',
	'.KRRRRRRRRWWRRK.',
	'.KRRRRRRRRRWRRK.',
	'KRRRRRRRRRRRRRRK',
	'KRRRRRKKKKRRRRRK',
	'KKKKKKKWWKKKKKKK',
	'KWWWWKKWWKKWWWWK',
	'KWWWWWKKKKWWWWWK',
	'.KWWWWWWWWWWWWK.',
	'.KWWWWWWWWWWWSK.',
	'..KWWWWWWWWWSK..',
	'...KKSSWWSSSKK..',
	'.....KKKKKK.....',
	'................',
];
const BALL_PAL = {
	poke: { R: '#e0453a', W: '#f6f1e4', S: '#c9bfa8', K: '#1d2233' },
	great: { R: '#3b6fc4', W: '#f6f1e4', S: '#c9bfa8', K: '#1d2233' },
	ultra: { R: '#2b2b38', W: '#f6f1e4', S: '#c9bfa8', K: '#1d2233' },
	dim: { R: '#7d8597', W: '#c9cdd6', S: '#a3a9b5', K: '#3a4052' },
};
/** Poké Ball pixel art en SVG nítido. kind: poke|great|ultra|dim */
export function ballIcon(size = 20, kind = 'poke') {
	const pal = BALL_PAL[kind] || BALL_PAL.poke;
	const ns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('viewBox', '0 0 16 16');
	svg.setAttribute('width', size); svg.setAttribute('height', size);
	svg.setAttribute('shape-rendering', 'crispEdges');
	svg.setAttribute('aria-hidden', 'true');
	svg.classList.add('ballico');
	BALL_PX.forEach((row, y) => {
		let x = 0;
		while (x < 16) {
			const c = row[x];
			if (c === '.') { x++; continue; }
			let w = 1; while (x + w < 16 && row[x + w] === c) w++;
			const r = document.createElementNS(ns, 'rect');
			r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', 1);
			r.setAttribute('fill', pal[c]);
			svg.append(r); x += w;
		}
	});
	return svg;
}

// ---------------- Objetos clave propios en pixel art ----------------
// Cada letra es un color de la paleta; '.' es transparente. 16×16.
export const PX_ITEMS = {
	farollana: {
		pal: { K: '#1d2233', M: '#9aa0ad', m: '#5f6574', Y: '#fff1a8', y: '#f2b33d', o: '#d9822b', W: '#f6f1e4', w: '#cfc6b0' },
		px: [
			'......KKKK......',
			'.....K....K.....',
			'.....K....K.....',
			'....KKKKKKKK....',
			'...KMMMMMMMMK...',
			'...KmKYYYYKmK...',
			'...KmYWWWWYmK...',
			'...KmYWYYWyKK...',
			'...KmWYYYYWmK...',
			'...KmWwYYwWmK...',
			'...KmYWWWWymK...',
			'...KmKyyyyKmK...',
			'...KMMMMMMMMK...',
			'....KmmmmmmK....',
			'.....KKKKKK.....',
			'................',
		],
		glow: '#ffe27a',
	},
	regaderaardilla: {
		pal: { K: '#16233f', B: '#4f9ee8', b: '#2f66b8', L: '#a8dcff', W: '#ffffff', S: '#a8703c', s: '#6e4426', c: '#f0d9a0', D: '#8fd8ff' },
		px: [
			'................',
			'.........KKK....',
			'........K...K...',
			'.....KKKKK...K..',
			'....KLLBBBcK.K..',
			'...KLWWBBcSsKK..',
			'K..KLWKBBcSSsK..',
			'KKKKBBBBBcSSsK..',
			'KLLLBBBBBcSssK..',
			'KKKKBBBBBcSssK..',
			'K..KbBBBBBcssK..',
			'D...KbbbbbbcK...',
			'....KbbKKbbK....',
			'.D...KK..KK.....',
			'................',
			'................',
		],
	},
	fragmentored: {
		pal: { K: '#0d1222', M: '#3a4256', m: '#262c3c', H: '#5e6882', V: '#5fb6ff', v: '#2e6fc0', S: '#eef4fc' },
		px: [
			'................',
			'.........K......',
			'........KHK.....',
			'.......KHMMK....',
			'......KHMVmK....',
			'.....KHMMVSmK...',
			'....KHMMVmMmK...',
			'...KHMMVMmmmmK..',
			'..KHMMVvMMmmmK..',
			'..KMMSVMMmVmmmK.',
			'...KMVMmmmVvmK..',
			'...KMVmmmVmmK...',
			'....KmmmVmmK....',
			'.....KmmmmK.....',
			'......KKKK......',
			'................',
		],
		glow: '#4f8cff',
	},
	fragmentoroto: {
		pal: { K: '#1c1a22', G: '#667082', g: '#454d5c', h: '#8a94a4', v: '#7a7e84', R: '#d23a3a', r: '#8e1f2a', W: '#f2e6dc' },
		px: [
			'................',
			'..KK.....KK.....',
			'.KhgK...KhK.....',
			'.KhGK..KhGgK.KK.',
			'.KGvgK.KhvgK.KhK',
			'.KGgGK.KGGgKKhgK',
			'..KggKKKGggKKvgK',
			'.KRRWWRRWWRRWWK.',
			'KRRRWWRRWWRRWWrK',
			'KWWRRWWRRWWRRrrK',
			'KWWRRWWRRWWRRrK.',
			'.KRRWWRRWWRRrK..',
			'.KRRWWRRWWrrK.RK',
			'..KKKKKKKKKKKRRK',
			'............KKK.',
			'................',
		],
	},
	caramelolazo: {
		pal: { K: '#1a1f3a', B: '#3a63c8', b: '#24408e', S: '#e4eaf4', s: '#9aa6bc', P: '#ff8fd0', p: '#ffd0ee' },
		px: [
			'................',
			'................',
			'................',
			'.KK..........KK.',
			'KSSK.KKKKKK.KSSK',
			'KsSSKpPBBBBKSSsK',
			'.KsSKPBBBBbKSsK.',
			'..KSKBSBBSbKSK..',
			'..KSKSBSSBSKSK..',
			'.KsSKBSBBSbKSsK.',
			'KsSSKBBBBbbKSSsK',
			'KSSK.KKKKKK.KSSK',
			'.KK..........KK.',
			'................',
			'................',
			'................',
		],
		glow: '#ff9ad6',
	},
	muestralab: {
		pal: { K: '#16303a', C: '#c08a54', c: '#7a4e2c', G: '#d8f2f4', g: '#8ec6cc', T: '#7fe6e0', t: '#3fb0b0', W: '#ffffff', D: '#effffd' },
		px: [
			'................',
			'......KKKK......',
			'.....KCCCcK.....',
			'.....KCCccK.....',
			'.....KKKKKK.....',
			'.....KWGGgK.....',
			'.....KWGGgK.....',
			'.....KWTDtK.....',
			'.....KGTTtK.....',
			'.....KWDTtK.....',
			'.....KGTTtK.....',
			'.....KGTDtK.....',
			'.....KgttgK.....',
			'......KKKK......',
			'................',
			'................',
		],
		glow: '#5ee8dc',
	},
	tarjetarouxel: {
		pal: { N: '#1c2654', W: '#efe8d6', w: '#c9bfa6', B: '#3b6fd0', S: '#c8d2e0', R: '#e0303a', g: '#6a6256', b: '#e0d8c2' },
		px: [
			'................',
			'................',
			'................',
			'................',
			'.NNNNNNNNNNNNNN.',
			'.NWWWWWWWBWSRWN.',
			'.NwwwwWWBWRWSWN.',
			'.NWWWWWWRBWSWWN.',
			'.NwwwWWWWWWWWWN.',
			'.NWWWWWWWWWWNNN.',
			'.NwwwwwwwwwNgbN.',
			'.NNNNNNNNNNNbN..',
			'............N...',
			'................',
			'................',
			'................',
		],
	},
	cartaabogados: {
		pal: { K: '#121a3a', B: '#3e5fb0', b: '#2a4486', S: '#cdd6e4', s: '#8e9ab0', W: '#ffffff' },
		px: [
			'................',
			'................',
			'KKKKKKKKKKKKK...',
			'KSBBBBBBBBBBKSK.',
			'KBSBBBBBBBBBKsSK',
			'KBBSBBBBBBBSKKKK',
			'KBBBSBBBBBSBBBbK',
			'KBBBBSSWSSBBBBbK',
			'KBBBBSWSWSBBBBbK',
			'KBBBBBSSSBBBBBbK',
			'KBBBBBBBBBBBBBbK',
			'KbbbbbbbbbbbbbbK',
			'KssssssssssssssK',
			'KKKKKKKKKKKKKKKK',
			'................',
			'................',
		],
	},
	folletogira: {
		pal: { K: '#0a0f28', N: '#26337a', n: '#151d4a', S: '#d4dcea', s: '#8a96b4', Y: '#f2c440' },
		px: [
			'................',
			'KKKKKKKKKK......',
			'KNNNNNNNNKKK....',
			'KNNNNNNNNKnnKK..',
			'KSSSSSSSSKsssnK.',
			'KNNNNNNNNKnnnnK.',
			'KNYYNYYNNKnnnnK.',
			'KYNNYNNYNKnnnnK.',
			'KNYYNYYNNKnnnnK.',
			'KNNNNNNNNKnnnnK.',
			'KSSSSSSSSKsssnK.',
			'KNNNNNNNNKnnKK..',
			'KNNNNNNNNKKK....',
			'KKKKKKKKKK......',
			'................',
			'................',
		],
	},
	fotogira: {
		pal: { K: '#2a2230', W: '#fbfaf6', T: '#e8dcb0', O: '#ffa04a', P: '#ec6c7c', V: '#6a4a9a', S: '#e4ecf6', g: '#2e4a3a', F: '#f0c090', f: '#4c7cf0' },
		px: [
			'................',
			'................',
			'.TTKKKKKKKKKKTT.',
			'.KTTWWWWWWWWTTK.',
			'.KWVVVVVVVVVVWK.',
			'.KWPPPSSSSPPPWK.',
			'.KWPPSPPPPSPPWK.',
			'.KWOOSOOOOSWWWW.',
			'.KWOOSOOOOWFFFWW',
			'.KWggggggWWFFFWW',
			'.KWgggggggWWfWW.',
			'.KWgggggggWfffW.',
			'.KWWWWWWWWWfffW.',
			'..KKKKKKKKWWWWW.',
			'................',
			'................',
		],
	},
	bocetosantuario: {
		pal: { K: '#4a3a28', C: '#f5e8c8', c: '#d8c69e', G: '#6aa850', g: '#3d6e34', M: '#a06a3e', m: '#5e3c20', D: '#7a5636', d: '#54391f' },
		px: [
			'..K.K.K.K.K.....',
			'.KCKCKCKCKCKK...',
			'.KCCCCCCCCcCcK..',
			'.KCCCCCCCCKccK..',
			'.KCCCCGGCCCKKK..',
			'.KCCCGGGGCCCCK..',
			'.KCCGGgGGGCCCK..',
			'.KCGGGGGGgGCCK..',
			'.KCCMMMMMMCCCK..',
			'.KCCMMmmMMCCCK..',
			'.KCCMMmmMMCCCK..',
			'.KCCCMCCMCCCDK..',
			'.KCgGgGgGgCDdK..',
			'.KCCCCCCCCDddK..',
			'.KKKKKKKKKKKKK..',
			'................',
		],
	},
	cartanoa: {
		pal: { K: '#2a3448', W: '#fbf8f0', w: '#d8d6d0', I: '#5a6aa8', L: '#7cc8ff' },
		px: [
			'................',
			'.........KK.....',
			'.......KKWWK....',
			'.....KKWWLWK....',
			'....KWWWLLLWK...',
			'...KWIIWWLWWK...',
			'..KWWWWIIWWWWK..',
			'.KWIIIWWWWIWwK..',
			'..KWWWIIWIWwwK..',
			'...KWIWWIWwwwK..',
			'....KWWIWwwwK...',
			'.....KWWwwwK....',
			'......KwwwK.....',
			'.......KKK......',
			'................',
			'................',
		],
	},
	recetapanmuerto: {
		pal: { K: '#4a3220', P: '#f6ecd8', p: '#d2bf98', I: '#9a8a74', Y: '#ecd070', B: '#c47a36', b: '#8a4e22', H: '#f8e2b4' },
		px: [
			'................',
			'.KKKKKKKKK......',
			'.KPPPPPPPK......',
			'.KPIIIIPPK......',
			'.KPPPPPPPK......',
			'.KPIIIPYPK......',
			'.KPPPPYYPK......',
			'.KpppppppKKKKKK.',
			'.KPPKBKPPKpppYK.',
			'.KPKBHBKPKppYYK.',
			'.KKHHHHHKKppppK.',
			'.KKBBHBBKKppppK.',
			'.KPKbHbKPKYpppK.',
			'.KPPKKKPPKpppKK.',
			'.KKKKKKKKKKKKK..',
			'................',
		],
	},
	traduccionunown: {
		pal: { K: '#2a3046', W: '#fbf9f2', w: '#d6d2c4', v: '#b2ae9e', l: '#b8cde6', N: '#1a1a22', B: '#3a78e0', b: '#2a52a8', o: '#9aa0b4' },
		px: [
			'................',
			'..KKKKKKKK......',
			'.oKWNWWNNKK.....',
			'..KWNNWWNKwK....',
			'.oKllllllKvwK...',
			'..KWWNWNWKKKKK..',
			'.oKWNNWNNWWNWK..',
			'..KllllllllllK..',
			'.oKWNWWNNWNWWK..',
			'..KWNWWNWWNNWK..',
			'.oKllllllllllK..',
			'..KWNNWWWWBBWK..',
			'.oKWWNWWWBWWBK..',
			'..KWWWWWWWBBbK..',
			'..KKKKKKKKKKKK..',
			'................',
		],
	},
	calcoli: {
		pal: { K: '#3a3a44', W: '#fbfbf6', w: '#dcdcd2', s: '#b4b4aa', C: '#3a3632', R: '#d8343a', r: '#8e1c28' },
		px: [
			'................',
			'..........K.K.K.',
			'.........KWKWKWK',
			'........KWWCWWsK',
			'.......KWWCWWWsK',
			'......KWWWWCWsK.',
			'.....KWWCWWWsK..',
			'....KRRWWWWsK...',
			'...KWrRRWWsK....',
			'..KWWWKRRrsK....',
			'.KWWWWsKRrK.....',
			'KWWWWsK.RK......',
			'KwWWsK..rRK.....',
			'KswsK....rK.....',
			'.KKK............',
			'................',
		],
	},
	planoprototipo: {
		pal: { K: '#3a3420', P: '#efe2b0', p: '#cdbb80', o: '#a8945a', B: '#2f62c8', b: '#9ab4e4' },
		px: [
			'..KKKKKKKKKKKK..',
			'.KPPPPPPPPPPPpK.',
			'.KoppppppppppoK.',
			'..KKKKKKKKKKKK..',
			'..KPPPPPPPPPPK..',
			'..KPBBBBBBPPPK..',
			'..KPBPPPPBPPPK..',
			'..KPBPbbPBBBPK..',
			'..KPBPbbPPPBPK..',
			'..KPBBBBBBBBPK..',
			'..KPPPPPPPPPPK..',
			'..KPPPPPPPPPPK..',
			'..KPPPPPBBPBBK..',
			'..KppppPBPBPBK..',
			'..KPPPPPBBPBBK..',
			'..KKKKKKKKKKKK..',
		],
	},
	cartaaurelio: {
		pal: { K: '#3a2814', E: '#c49a62', e: '#9a7240', d: '#7a5630', I: '#4a3018', T: '#e8d8a8', t: '#b8a070' },
		px: [
			'................',
			'.....TT..TT.....',
			'....T..TT..T....',
			'.....TTTTTT.....',
			'.KKKKKKtKKKKKKK.',
			'KEeEEEEtEEEEEeEK',
			'KEEeEEEtEEEEeEEK',
			'KEEEeEEtEEEeEEEK',
			'KTTTTTTTTTTTTTTK',
			'KEIIEIIEtIIEeEEK',
			'KEEEEEEEtEEEEEEK',
			'KEIIIEIItEIIEEEK',
			'KEEEEEEEtEEEEEdK',
			'KedddddtdddddddK',
			'.KKKKKKKKKKKKKK.',
			'................',
		],
	},
	llaverancho: {
		pal: { K: '#14141a', H: '#4a4a56', h: '#2c2c36', L: '#7a7a88', O: '#b0602a', o: '#7a3a1a', T: '#c8b48a', Y: '#f2c440', y: '#b8862a', W: '#fff4c0' },
		px: [
			'...KKKK.........',
			'..KLLHhK........',
			'.KLKKKHhK.......',
			'.KLK..KhK.......',
			'.KHK..KhK.......',
			'..KhKKhK........',
			'...KhhKHK.......',
			'....KKHhK..T....',
			'.......KHK.T....',
			'........KHKT....',
			'.....KOKKhKKK...',
			'......KoOhK.KYK.',
			'.....KOoKKhKYWyK',
			'......KK..KYYyyK',
			'..........KKyyK.',
			'............KK..',
		],
	},
	dibujorancho: {
		pal: { K: '#4a4440', W: '#fbfaf4', w: '#dcd8cc', O: '#f2a04a', P: '#f08aa0', R: '#d83a3a', r: '#9a2424', G: '#5ab84a', g: '#3a8a3a', S: '#ffffff', Y: '#f6d23a', V: '#7a5ac8', v: '#4a3488', T: '#f0d8a8' },
		px: [
			'................',
			'................',
			'KKKKKKKKKKKKK...',
			'KWPPPPPPPPPPK...',
			'KWRRPOOOOOOOK...',
			'KRRRROOOOOOOK...',
			'KWRSRGGYGGYGK...',
			'KWRRRGGSGGSGK...',
			'KWGGGGYGGYGGK...',
			'KWggggSggSggKKK.',
			'KWWWWWWWWWWKVVvK',
			'KKKKKKKKKKKVVvK.',
			'..........KVvK..',
			'.........KTvK...',
			'.........KKK....',
			'................',
		],
	},
	registroondas: {
		pal: { K: '#2a3038', W: '#f6f8f4', w: '#cfd6d0', s: '#a8b2ac', o: '#8a948e', B: '#2a6ae0', G: '#bfe0c8' },
		px: [
			'................',
			'..KKKKKKKKKKKK..',
			'.KWoWGGGGGGWoWK.',
			'.KWWWBWWWBWWWWK.',
			'.KWoWBBWBBWWoWK.',
			'.KWWWBWBWBWWWWK.',
			'.KWoWBWWWBWWoWK.',
			'..KKKKKKKKKKKK..',
			'..KwswwwwwwswK..',
			'.KKKKKKKKKKKKKK.',
			'.KWoWWWWWWWWoWK.',
			'..KKKKKKKKKKKK..',
			'..KwswwwwwwswK..',
			'.KKKKKKKKKKKKKK.',
			'.KsosssssssssoK.',
			'..KKKKKKKKKKKK..',
		],
	},
	pinzaonda: {
		pal: { K: '#2a1a10', C: '#e08a4a', c: '#a8582a', H: '#ffc890', Y: '#f6d23a', B: '#3a7ae0', b: '#24489a', R: '#e0383a', r: '#9a1c24' },
		px: [
			'................',
			'................',
			'..KKKKKKKK......',
			'.KHHCCCCCCKK....',
			'KCKCKCKCCYYCK...',
			'.K.K.K.KCYYcCKKK',
			'.K.K.K.KcccccKBB',
			'KCKCKCKCcccccKRR',
			'.KccccccccccKKB.',
			'..KKKKKKKKKK..B.',
			'.............R.B',
			'.............R..',
			'..............R.',
			'............BB.R',
			'...........B...R',
			'................',
		],
	},
	muestralago: {
		pal: { K: '#0c1424', C: '#c08a54', c: '#7a4e2c', G: '#cfe4f0', g: '#7ea0b8', A: '#14285a', a: '#0a1838', S: '#bfe6ff', L: '#f4f4ee', l: '#a8a8a0' },
		px: [
			'................',
			'................',
			'......KKKK......',
			'......KCCK......',
			'......KCcK......',
			'.....KKKKKK.....',
			'.....KGAAgK.....',
			'....KGAAAAgK....',
			'...KGAASAAAgK...',
			'...KGLLLLLLgK...',
			'...KALLlllLaK...',
			'...KASAAAAAaK...',
			'...KAAAAASaaK...',
			'....KAAAAaaK....',
			'.....KKKKKK.....',
			'................',
		],
		glow: '#3a6ad8',
	},
	fotofaro: {
		pal: { K: '#2a2a34', W: '#fbfaf6', w: '#d8d6ce', N: '#141c3a', n: '#22305a', Y: '#fff2a8', y: '#c8c08a', F: '#e8e8f0', R: '#d84a4a', A: '#0c1228' },
		px: [
			'................',
			'...KKKKKKKKKK...',
			'...KWWWWWWWWK...',
			'...KWNNNNNyYK...',
			'...KWNNNyYYnK...',
			'...KWNnyYYnNK...',
			'...KWyYYRnNNK...',
			'...KWNnFFnNNK...',
			'...KWNnRRnNNK...',
			'...KWnnFFnnNK...',
			'...KWAAFFAAAK...',
			'...KWAAAAAAAK...',
			'...KWWWWWWWWK...',
			'...KWWWWWWWwK...',
			'...KKKKKKKKKK...',
			'................',
		],
	},
	sintonizadorbill: {
		pal: { K: '#2a2018', C: '#f2e6c4', c: '#c8b48a', S: '#cfd6e2', s: '#8a94a4', G: '#4a4a52', g: '#2a2a32', R: '#e0383a', B: '#3a7ae0' },
		px: [
			'..........S.....',
			'..........S.....',
			'..........S.....',
			'..........S.....',
			'...KKKKKKKSKK...',
			'..KCCCCCCCCCCK..',
			'..KCKKKKKKCcCK..',
			'..KCKGGGGKCRCK..',
			'..KCKGBGBKCcCKs.',
			'..KCKGGGGKCcCKs.',
			'..KCKGBBGKCcCKs.',
			'..KCKKKKKKCcCK..',
			'..KCcccccccccK..',
			'...KKKKKKKKKK...',
			'................',
			'................',
		],
	},
	tarjetallave: {
		pal: { K: '#1c2028', G: '#b8bcc8', g: '#8a8e9a', W: '#eef0f4', R: '#d83a3a', r: '#9a2024', N: '#1a1a1a', Y: '#e8c84a' },
		px: [
			'................',
			'................',
			'................',
			'.KKKKKKKKKKKKKK.',
			'.KWGGGGGGGGGGgK.',
			'.KGRRGGGGGGGGgK.',
			'.KGRrGGGGNNNGgK.',
			'.KGGGGGGGGGNGgK.',
			'.KGYYYGGGGNNGgK.',
			'.KGYYYGGGGGNGgK.',
			'.KGGGGGGGGNNNgK.',
			'.KNNNNNNNNNNNNK.',
			'.KggggggggggggK.',
			'.KKKKKKKKKKKKKK.',
			'................',
			'................',
		],
	},
	informefuentel: {
		pal: { K: '#2a2a34', W: '#fbfaf6', w: '#d8d6ce', L: '#5a6a9a', S: '#9aa0aa', B: '#3a6ad8', b: '#bfd6ff' },
		px: [
			'................',
			'....SS..........',
			'..KKSSKKKKKK....',
			'..KWWWWWWWWK....',
			'..KWLLLLLWWKK...',
			'..KWWWWWWWWKwK..',
			'..KWLLLLWLWKwK..',
			'..KWWWWWWWWKwK..',
			'..KWLLWLLLWKwK..',
			'..KWWWWWWWWKwK..',
			'..KWLLLWWBbKwK..',
			'..KWWWWWWbBKwK..',
			'..KKKKKKKKKKwK..',
			'...KwwwwwwwwwK..',
			'...KKKKKKKKKKK..',
			'................',
		],
	},
	expedienteolmedo: {
		pal: { K: '#2a2018', F: '#d8b46a', f: '#a8843a', W: '#fbfaf6', w: '#d8d6ce', L: '#5a5a6a', P: '#e0c8a8', p: '#7a5a3a' },
		px: [
			'................',
			'................',
			'..KKKKK.........',
			'.KFFFFFKKKKKKK..',
			'.KFFFFFFFFFFFFK.',
			'.KFWWWWWWWWWWFK.',
			'.KFWPPPWLLLLWFK.',
			'.KFWPppWWWWWWFK.',
			'.KFWPPPWLLLWWFK.',
			'.KFWWWWWWWWWWFK.',
			'.KFWLLLLLLLWWFK.',
			'.KFffffffffffFK.',
			'.KFFFFFFFFFFF.K.',
			'..KKKKKKKKKKKKK.',
			'................',
			'................',
		],
	},
	servilletam: {
		pal: { K: '#3a3a44', W: '#fbfaf6', w: '#dcdad2', B: '#3a6ad8', b: '#8aaae8', R: '#c83a4a' },
		px: [
			'................',
			'................',
			'..KKKKKKKKKKK...',
			'..KWWWWWWWWWwK..',
			'..KWRRWWWWWWwK..',
			'..KWWWWBWBWWwK..',
			'..KWBWWBWBWWwK..',
			'..KWBWWbWBWWwK..',
			'..KWBWWBWbWWwK..',
			'..KWbWWBWBWWwK..',
			'..KWBBBBBBBWwK..',
			'..KWWWWWWBBWwK..',
			'..KwwwwwwwwwwK..',
			'..KKKKKKKKKKKK..',
			'................',
			'................',
		],
	},
	cenizatorre: {
		pal: { K: '#2a2a34', W: '#fbfaf6', w: '#d0ccc4', A: '#8a8a92', a: '#5a5a62', L: '#c8a8e8', l: '#9a7ac8' },
		px: [
			'.......l........',
			'........L.......',
			'.......l........',
			'......L.........',
			'.......l........',
			'................',
			'.......KK.......',
			'......KAAK......',
			'.....KWAaWK.....',
			'....KWWAAWWK....',
			'...KWWWWWWWWK...',
			'..KWWWWWWWWWwK..',
			'.KWWWWWWWWWWwwK.',
			'.KKKKKKKKKKKKKK.',
			'................',
			'................',
		],
	},
	fotolago: {
		pal: { K: '#24242e', W: '#fbfaf6', w: '#d8d6ce', N: '#0e1630', n: '#1a2850', M: '#f4f0d8', P: '#0a1a14', B: '#5ab4ff', R: '#c83a4a', T: '#e8e4c0', t: '#c4bf96' },
		px: [
			'................',
			'.....TTTT.......',
			'..KKKTtTTKKKKK..',
			'..KWWTTTtWWWWK..',
			'..KWnnnnnnMnWK..',
			'..KWPnnnnnnPWK..',
			'..KWPPnnnnPPWK..',
			'..KWNNBNNNMNWK..',
			'..KWNBNBNRNNWK..',
			'..KWNNBNNNNNWK..',
			'..KWWWWWWWWWWK..',
			'..KWWWWWWWWWKK..',
			'..KWWWWWWWWKwK..',
			'..KKKKKKKKKKK...',
			'................',
			'................',
		],
	},
};
/** Dibuja un objeto de PX_ITEMS como SVG nítido. */
export function pxItem(id, size = 32) {
	const d = PX_ITEMS[id];
	if (!d) return null;
	const ns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('viewBox', '0 0 16 16');
	svg.setAttribute('width', size); svg.setAttribute('height', size);
	svg.setAttribute('shape-rendering', 'crispEdges');
	svg.setAttribute('aria-hidden', 'true');
	svg.classList.add('pxitem');
	if (d.glow) svg.style.setProperty('--glow', d.glow);
	d.px.forEach((row, y) => {
		let x = 0;
		while (x < 16) {
			const c = row[x];
			if (c === '.') { x++; continue; }
			let w = 1; while (x + w < 16 && row[x + w] === c) w++;
			const r = document.createElementNS(ns, 'rect');
			r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', 1);
			r.setAttribute('fill', d.pal[c]);
			svg.append(r); x += w;
		}
	});
	return svg;
}
