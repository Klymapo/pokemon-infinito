// Cinemáticas: escenas vivas a pantalla completa (fondo por capas con paralaje y ambiente, cámara,
// actores que entran, se mueven y hablan, efectos y texto que se escribe). Formato y guía: docs/CINE.md.
import { C } from '../content.js';
import { G, evalCond } from '../state.js';
import { D, toID, TYPE_COLORS } from '../data.js';
import { tx, findRiolu } from '../guion.js';
import { monUrls, itemImg, sceneCanvas, pxItem, trainerImg } from '../art.js';
import { retratoGrid } from '../retrato.js';
import { phase } from '../time.js';
import { h, portraitFor, logLine, logButton } from './core.js';
import { fmtText } from '../util.js';
import { asList, CINE_PARTNER } from '../cine-spec.js';
export * from '../cine-spec.js';

// ---------- Constantes de composición ----------
const SW = 192, SH = 108;          // escena de sceneCanvas
const BW = 260;                    // ancho del lienzo (píxeles de respaldo); el alto sale de la pantalla
const MAX_P = 150;                 // tope de partículas
const SLACK = 14;                  // margen vertical (px de escena) para mover la cámara arriba y abajo
const FAR = 0.72;                  // paralaje de lo que queda por encima del horizonte
const INDOOR = new Set(['gym', 'lab', 'indoor', 'center']);
const HORIZON = { route: 76, ranch: 78, town: 78, tower: 78, city: 80, plaza: 80, forest: 84, coast: 54, mountain: 86, ruins: 78, castle: 78, palace: 78, cave: 80, gym: 64, lab: 64, indoor: 64, center: 64 };
const DARK = 0.86;                 // opacidad de la oscuridad (start: 'dark', fx: 'dark')
const AT = { left: 0.25, center: 0.5, right: 0.75 };
const CPS = [26, 44, 80, Infinity]; // letras por segundo según G.settings.textSpeed
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOut = t => 1 - (1 - t) ** 3;
const easeIO = t => 0.5 - Math.cos(Math.PI * t) / 2;
const seedRand = s => { let a = [...String(s)].reduce((x, c) => (x * 31 + c.charCodeAt(0)) | 0, 7); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const isLite = () => G?.settings?.anim === false || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

// Iconos de los bocadillos (plantillas a mano; o = contorno, x = color, w = brillo)
const EMOTE_PX = {
	heart: { c: '#e8506a', px: ['.oo.oo.', 'oxwoxxo', 'oxxxxxo', 'oxxxxxo', '.oxxxo.', '..oxo..', '...o...'] },
	sweat: { c: '#6fb8f0', px: ['...o...', '..oxo..', '..oxo..', '.oxxxo.', 'oxwxxxo', 'oxxxxxo', '.ooooo.'] },
	anger: { c: '#e8503a', px: ['.xx.xx.', '.xx.xx.', 'xx...xx', '.......', 'xx...xx', '.xx.xx.', '.xx.xx.'] },
	note: { c: '#3a4a7a', px: ['..xxxx.', '..x..x.', '..x..x.', '..x..x.', '.xx.xx.', 'xxx.xxx', '.x...x.'] },
};

/**
 * Reproduce una cinemática. spec (docs/CINE.md):
 * { bg: {type,…}, start, time, weather, tint, cam, auto, frames: [ { text, say, big, item, npc, mon, actors, fx, cam, shake, weather, tint, hold, … } ] }
 * Tocar: completa el texto y luego avanza. Mantener pulsado: ofrece «Saltar escena».
 */
export function playCutscene(spec = {}, opts = {}) {
	return new Promise(resolve => runScene(spec, opts, resolve));
}
/** Igual que playCutscene, pero sin apuntar los textos en el registro de diálogo (pruebas y vistas previas). */
export const previewCutscene = spec => playCutscene(spec, { log: false });

function runScene(spec, opts, resolve) {
	const lite = isLite();
	const ph = spec.time || phase();
	const night = ph === 'noche';
	const ac = new AbortController();
	const sig = { signal: ac.signal };
	const timers = new Set();
	let alive = true, raf = 0;
	const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); return id; };
	const wait = ms => new Promise(r => later(r, ms));
	const log = e => { if (opts.log !== false) logLine(e); };

	// ---------- DOM ----------
	const bgc = h('canvas', { class: 'cs-bg' });
	const fxc = h('canvas', { class: 'cs-fxc' });
	const actorsEl = h('div', { class: 'cs-actors' });
	const tintEl = h('div', { class: 'cs-tint' });
	const vigEl = h('div', { class: 'cs-vig' });
	const irisEl = h('div', { class: 'cs-iris' });
	const coverEl = h('div', { class: 'cs-cover' });
	const bigEl = h('div', { class: 'cs-big' });
	const shakeEl = h('div', { class: 'cs-shake' }, bgc, actorsEl, fxc, tintEl);
	const stage = h('div', { class: 'cs-stage' }, shakeEl, vigEl, bigEl, irisEl, coverEl);
	const nameEl = h('div', { class: 'cs-name' });
	const cap = h('div', { class: 'cs-cap', role: 'status', 'aria-live': 'polite' });
	const hint = h('div', { class: 'cs-hint' }, h('span', { class: 'cs-hint-t' }, 'Toca para seguir'), h('i', {}));
	const band = h('div', { class: 'cs-band' }, nameEl, cap, hint);
	const skipBtn = h('button', { class: 'cs-skip', type: 'button' }, 'Saltar escena');
	const holdEl = h('div', { class: 'cs-hold' });
	const root = h('div', { class: 'cutscene' + (lite ? ' lite' : ''), role: 'dialog', 'aria-label': 'Escena', tabindex: '0' },
		stage, h('div', { class: 'cs-bar top' }), h('div', { class: 'cs-bar bot' }), band, logButton('dlg-log cs-log'), holdEl, skipBtn);
	document.body.append(root);

	// ---------- Lienzos ----------
	const g = bgc.getContext('2d'), fg = fxc.getContext('2d');
	let BH = 540, K = 3, sceneTop = 80, eT = 40, TH = 200, stW = 412, stH = 860, sc = 1.58;
	const measure = () => {
		const r = stage.getBoundingClientRect();
		stW = r.width || 412; stH = r.height || 860;
		BH = clamp(Math.round(BW * stH / stW), 150, 600);
		K = BH >= 400 ? 3 : BH >= 250 ? 2 : 1.5;
		sceneTop = Math.round((BH - SH * K) * 0.37 / K) * K;
		eT = Math.ceil(Math.max(0, sceneTop) / K) + SLACK;
		TH = Math.ceil(BH / K) + SLACK * 2 + 2;
		for (const c of [bgc, fxc]) { c.width = BW; c.height = BH; }
		g.imageSmoothingEnabled = false; fg.imageSmoothingEnabled = false;
		sc = BW / stW;
	};
	measure();

	// ---------- Fondo: escena alta (cielo o techo por arriba, suelo por abajo) ----------
	let bgSpec = spec.bg || {}, type = bgSpec.type || 'route', tall = null, tallOld = null, tallMix = 1, horizon = 76;
	const outdoor = () => !INDOOR.has(type) && type !== 'cave';
	const buildTall = (b) => {
		const src = sceneCanvas({ ...b, seed: (b.seed || G?.loc || 'cs') + 'cs' }, { phase: ph });
		const t = b.type || 'route';
		const cv = document.createElement('canvas'); cv.width = SW; cv.height = TH;
		const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
		const R = seedRand((b.seed || t) + 'tall');
		const top = eT, bot = eT + SH;
		if (INDOOR.has(t) || t === 'cave') {
			c.drawImage(src, 0, 0, SW, 1, 0, 0, SW, top);
			for (let i = 0; i < 5; i++) { c.fillStyle = `rgba(10,10,24,${0.14 + 0.12 * (4 - i)})`; c.fillRect(0, 0, SW, Math.round(top * (i + 1) / 6)); }
			if (INDOOR.has(t)) { c.fillStyle = 'rgba(10,10,24,.5)'; c.fillRect(0, Math.round(top * 5 / 6) - 2, SW, 2); }
		} else {
			const d = src.getContext('2d').getImageData(0, 0, SW, 1).data, n = {};
			let best = '#000', bn = 0;
			for (let i = 0; i < d.length; i += 4) { const k = `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`; n[k] = (n[k] || 0) + 1; if (n[k] > bn) { bn = n[k]; best = k; } }
			c.fillStyle = best; c.fillRect(0, 0, SW, top);
			for (let i = 0; i < 4; i++) { c.fillStyle = `rgba(8,12,44,${0.07})`; c.fillRect(0, 0, SW, Math.round(top * (i + 1) / 5)); }
			if (ph === 'noche') for (let i = 0; i < 46; i++) { c.fillStyle = R() < .3 ? '#ffffff' : '#9fb3e8'; c.fillRect((R() * SW) | 0, (R() * top) | 0, 1, 1); }
		}
		c.drawImage(src, 0, SH - 1, SW, 1, 0, bot, SW, TH - bot);
		for (let i = 0; i < 160; i++) { c.fillStyle = R() < .5 ? 'rgba(0,0,0,.14)' : 'rgba(255,255,255,.06)'; c.fillRect((R() * SW) | 0, bot + ((R() * (TH - bot)) | 0), 2, 1); }
		for (let i = 0; i < 5; i++) { c.fillStyle = 'rgba(6,8,20,.13)'; c.fillRect(0, bot + Math.round((TH - bot) * i / 6), SW, TH); }
		c.drawImage(src, 0, top);
		return cv;
	};
	const setBg = (b, instant) => {
		bgSpec = b || {}; type = bgSpec.type || 'route'; horizon = HORIZON[type] || 76;
		tallOld = instant ? null : tall; tallMix = instant ? 1 : 0;
		tall = buildTall(bgSpec);
		buildFore(); setupAmbient(true);
	};

	// ---------- Cámara ----------
	const cam = { x: 0, y: 0, z: lite ? 1 : 1.05, fx: 0, fy: 0, fz: 1.05, tx: 0, ty: 0, tz: 1.05, t0: 0, dur: 1, ease: easeIO, sway: lite ? 0 : 1, swayT: lite ? 0 : 1, ox: 0, oy: 0, oz: 1 };
	const camTo = (mode, ms, idx) => {
		if (lite) return;
		cam.fx = cam.x; cam.fy = cam.y; cam.fz = cam.z; cam.t0 = now; cam.swayT = 1; cam.ease = easeOut;
		let x = cam.x, y = cam.y, z = cam.z, dur = 4500;
		switch (mode) {
		case 'still': cam.swayT = 0; dur = 900; break;
		case 'pan-left': x -= 30; dur = 5200; break;
		case 'pan-right': x += 30; dur = 5200; break;
		case 'pan-up': y -= 11; dur = 4600; break;
		case 'pan-down': y += 11; dur = 4600; break;
		case 'push': z = 1.22; dur = 3600; break;
		case 'pull': if (cam.z < 1.12) cam.fz = cam.z = 1.22; z = 1; dur = 4200; break;
		default: { // drift: un rumbo distinto en cada frame
			const s = (idx * 37 + type.length) % 2 ? 1 : -1;
			x += s * (6 + (idx * 13) % 5); if (Math.abs(x) > 26) x = cam.x - s * (6 + (idx * 13) % 5);
			y += ((idx * 7) % 3 - 1) * 2.5; z = 1.05 + (idx % 2 ? 0.035 : 0);
			dur = 11000; cam.ease = easeIO;
		}
		}
		cam.tx = clamp(x, -40, 40); cam.ty = clamp(y, -12, 12); cam.tz = clamp(z, 1, 1.25); cam.dur = ms || dur;
	};
	const camTick = (dt) => {
		const t = clamp((now - cam.t0) / cam.dur, 0, 1), e = cam.ease(t);
		cam.x = cam.fx + (cam.tx - cam.fx) * e; cam.y = cam.fy + (cam.ty - cam.fy) * e; cam.z = cam.fz + (cam.tz - cam.fz) * e;
		cam.sway += (cam.swayT - cam.sway) * Math.min(1, dt * 2);
		cam.ox = clamp(cam.x + Math.sin(now / 3100) * 1.6 * cam.sway, -40, 40);
		cam.oy = clamp(cam.y + Math.sin(now / 4300 + 1) * 1.1 * cam.sway, -SLACK + 1, SLACK - 1);
		cam.oz = cam.z + Math.sin(now / 5200) * 0.006 * cam.sway;
	};
	// Proyección de coordenadas de escena a píxeles del lienzo (con el paralaje de su fila)
	const depth = row => row <= horizon ? FAR : Math.min(1.22, FAR + (row - horizon) / (SH - horizon) * (1 - FAR));
	const ybase = () => Math.round(sceneTop - (eT + cam.oy) * K);
	const px = (x, row) => BW / 2 + (x - SW / 2 - cam.ox * depth(row)) * K;
	const py = row => ybase() + (row + eT) * K;

	const drawTall = (cv) => {
		const yb = ybase(), hzRows = eT + horizon;
		g.drawImage(cv, 0, 0, SW, hzRows, Math.round((BW / 2 - (SW / 2 + cam.ox * FAR) * K) * 2) / 2, yb, SW * K, hzRows * K);
		for (let r = hzRows; r < TH; r++) {
			const y = yb + r * K; if (y > BH) break; if (y + K < 0) continue;
			g.drawImage(cv, 0, r, SW, 1, Math.round((BW / 2 - (SW / 2 + cam.ox * depth(r - eT)) * K) * 2) / 2, y, SW * K, K);
		}
	};

	// ---------- Primer plano (siluetas con más paralaje) ----------
	let fore = [];
	const buildFore = () => {
		fore = [];
		const R = seedRand((bgSpec.seed || type) + 'fore');
		const kind = type === 'forest' ? 'leaf' : type === 'cave' ? 'rock' : (type === 'route' || type === 'ranch') ? 'branch' : null;
		if (!kind || lite) return;
		const n = kind === 'branch' ? 2 : 6;
		for (let i = 0; i < n; i++) {
			const cv = document.createElement('canvas'), c = cv.getContext('2d');
			if (kind === 'rock') {
				const w = 14 + (R() * 22 | 0), hgt = 26 + (R() * 50 | 0);
				cv.width = w; cv.height = hgt;
				for (let y = 0; y < hgt; y++) { const half = (w / 2) * (1 - y / hgt) ** 1.4; c.fillStyle = '#0b0912'; c.fillRect(Math.round(w / 2 - half), y, Math.max(1, Math.round(half * 2)), 1); c.fillStyle = '#231f33'; c.fillRect(Math.round(w / 2 - half), y, 1, 1); }
				fore.push({ cv, x: -40 + i * (SW + 80) / n + R() * 20, y: 0, top: true });
			} else {
				const w = 46 + (R() * 30 | 0), hgt = 22 + (R() * 16 | 0);
				cv.width = w; cv.height = hgt;
				const dark = night ? '#070d14' : '#10261a', mid = night ? '#0d1820' : '#1b3a26';
				for (let k = 0; k < 16; k++) { const bx = R() * (w - 12), by = R() * (hgt - 9) * (1 - Math.abs(bx / w - .5)), s = 6 + R() * 7; c.fillStyle = k % 3 ? dark : mid; c.fillRect(bx | 0, by | 0, s | 0, (s * .7) | 0); c.fillRect((bx + 2) | 0, (by + s * .7) | 0, (s - 4) | 0, 2); }
				fore.push({ cv, x: kind === 'branch' ? (i ? SW - 30 : -24) : -50 + i * (SW + 100) / n + R() * 16, y: 0, top: true, sway: R() * 6 });
			}
		}
	};
	const drawFore = () => {
		for (const f of fore) {
			const x = BW / 2 + (f.x - SW / 2 - cam.ox * 1.7) * K + (f.sway !== undefined ? Math.round(Math.sin(now / 1700 + f.sway) * 1.5) : 0);
			g.drawImage(f.cv, Math.round(x), Math.round(-cam.oy * K * 1.3 - SLACK * 0.5), f.cv.width * K, f.cv.height * K);
		}
	};

	// ---------- Partículas: ambiente y clima ----------
	const P = [];
	let lastCx = 0;
	let emitters = [], weather = 'none', clouds = [], fogs = [], birdAt = 0, dripAt = 0, glintAt = 0, leds = null, ledAt = 0;
	const spawn = (k, o) => { if (P.length >= MAX_P) return null; const p = { k, x: 0, y: 0, vx: 0, vy: 0, t: 0, life: 1e9, d: 1, s: 2, c: '#fff', a: 1, ph: rnd(6.3), ...o }; P.push(p); return p; };
	const groundY = () => clamp(py(horizon + 6), BH * 0.4, BH * 0.7);
	const born = (k, init) => {
		const front = Math.random() < 0.28, d = front ? 1.5 : rnd(0.7, 1.1), s = front ? 3 : 2;
		switch (k) {
		case 'rain': return spawn(k, { x: rnd(-20, BW + 60), y: init ? rnd(BH) : -10, vx: -46, vy: rnd(300, 390), d, s: front ? 9 : 6, c: '#b9d4ff', a: front ? .7 : .45, gy: rnd(groundY(), BH * 0.78) });
		case 'snow': return spawn(k, { x: rnd(BW), y: init ? rnd(BH) : -4, vx: rnd(-6, 6), vy: rnd(14, 30), d, s, c: '#fff', a: rnd(.6, 1) });
		case 'leaves': case 'leaf': return spawn('leaf', { x: init ? rnd(BW) : BW + 6, y: rnd(-10, BH * .7), vx: k === 'leaves' ? rnd(-70, -34) : rnd(-16, -6), vy: rnd(8, 22), d, s, c: ['#8cc86a', '#d8c84a', '#e09a3a', '#5fa45a'][rnd(4) | 0], a: 1, wind: k === 'leaves' });
		case 'petals': return spawn('leaf', { x: init ? rnd(BW) : BW + 6, y: rnd(-10, BH * .7), vx: rnd(-30, -12), vy: rnd(10, 22), d, s, c: ['#ffc4dc', '#ff9fc4', '#ffe4ee'][rnd(3) | 0], a: 1 });
		case 'ash': return spawn('snow', { x: rnd(BW), y: init ? rnd(BH) : -4, vx: rnd(-10, 2), vy: rnd(7, 15), d, s, c: ['#8a8a92', '#b4b4ba', '#5a5a64'][rnd(3) | 0], a: rnd(.5, .85) });
		case 'embers': return spawn('ember', { x: rnd(BW), y: init ? rnd(BH * .3, BH) : BH * rnd(.6, 1), vx: rnd(-8, 8), vy: -rnd(18, 40), d, s, life: rnd(2.2, 4.5) });
		case 'sparks': return spawn('spark', { x: rnd(BW), y: rnd(BH * .15, BH * .75), vx: rnd(-14, 14), vy: -rnd(8, 36), d, s, life: rnd(.5, 1.2), c: Math.random() < .7 ? '#b79cff' : '#8fe8ff' });
		case 'dust': return spawn('mote', { x: init ? rnd(BW) : -4, y: rnd(BH * .2, BH * .75), vx: rnd(12, 30), vy: rnd(-3, 3), d, s: front ? 2 : 1, c: '#e8dcc0', a: rnd(.35, .7) });
		case 'smoke': return spawn('smoke', { x: rnd(BW), y: init ? rnd(BH * .3, BH * .8) : BH * rnd(.62, .8), vx: rnd(-6, 2), vy: -rnd(8, 16), d, s: 5 + (rnd(5) | 0), life: rnd(4, 7), c: '#8a8690' });
		case 'mote': { const b = beams.length ? beams[rnd(beams.length) | 0] : null, row = rnd(30, 96), x = b ? b.x + (row - 36) * 0.42 + rnd(2, 26) : rnd(SW); return spawn('mote', { wx: x, wy: row, vx: rnd(-1.2, 1.2), vy: rnd(-1.5, .6), s: 1, c: '#fff4d0', a: rnd(.35, .85), world: true, life: rnd(5, 10) }); }
		case 'firefly': return spawn('firefly', { x: rnd(BW), y: rnd(BH * .32, BH * .72), d: rnd(.8, 1.4), c: '#e8ff9a' });
		case 'star': return spawn('star', { x: rnd(BW * 1.3), y: rnd(BH * .34), d: .25, s: Math.random() < .2 ? 2 : 1, c: Math.random() < .4 ? '#fff' : '#bcd0ff' });
		case 'fsp': return spawn('spark', { wx: 120 + rnd(-9, 9), wy: rnd(20, 78), world: true, vx: rnd(-4, 4), vy: -rnd(4, 14), s: 2, life: rnd(.6, 1.4), c: Math.random() < .75 ? '#b79cff' : '#f0e4ff' });
		}
		return null;
	};
	let beams = [];
	const setupAmbient = (init) => {
		for (let i = P.length - 1; i >= 0; i--) if (!P[i].keep) P.splice(i, 1);
		emitters = []; clouds = []; fogs = []; beams = []; leds = null;
		if (lite || spec.ambient === false) { setWeather(weather, init); return; }
		const out = outdoor();
		if (out) {
			const R = seedRand((bgSpec.seed || type) + 'cl');
			const col = night ? 'rgba(160,176,230,.16)' : ph === 'tarde' ? 'rgba(255,196,170,.8)' : 'rgba(255,255,255,.86)';
			for (let i = 0; i < (night ? 3 : 5); i++) {
				const w = 26 + (R() * 30 | 0), parts = [];
				for (let k = 0; k < 5; k++) parts.push([(R() * (w - 12)) | 0, (R() * 5) | 0, 10 + (R() * 12 | 0), 3 + (R() * 3 | 0)]);
				clouds.push({ x: R() * (BW + 80) - 40, y: 6 + R() * sceneTop * 0.9 + (i % 2) * 14, w, parts, v: 2.2 + R() * 3, col });
			}
			if (night) emitters.push({ k: 'star', n: 24 });
			if (night && ['forest', 'route', 'ranch', 'town', 'ruins', 'castle'].includes(type)) emitters.push({ k: 'firefly', n: type === 'forest' ? 16 : 10 });
			if (!night && ['forest', 'route', 'ranch'].includes(type)) emitters.push({ k: 'leaf', n: type === 'forest' ? 9 : 5 });
			if (!night && ['city', 'plaza', 'town', 'mountain'].includes(type)) emitters.push({ k: 'dust', n: 6 });
			birdAt = now + rnd(1500, 4000);
		}
		if (INDOOR.has(type)) {
			if (!night) for (let i = 0; i < 3; i++) beams.push({ x: 20 + i * 62 });
			emitters.push({ k: 'mote', n: night ? 8 : 26 });
			if (type === 'lab') { leds = [0, 1, 2, 3, 4].map(() => Math.random() < .5); ledAt = 0; }
		}
		if (type === 'cave') { emitters.push({ k: 'dust', n: 8 }); dripAt = now + rnd(600, 1800); }
		if (bgSpec.fissure) emitters.push({ k: 'fsp', n: 14 });
		if (bgSpec.fog || ['ruins', 'tower', 'castle'].includes(type) || (type === 'forest' && night)) makeFog(bgSpec.fog ? 6 : 4);
		glintAt = now + 400;
		setWeather(weather, init);
	};
	const makeFog = (n) => {
		for (let i = fogs.length; i < n; i++) {
			const parts = []; for (let k = 0; k < 6; k++) parts.push([rnd(0, 70) | 0, rnd(0, 6) | 0, rnd(24, 50) | 0, rnd(3, 7) | 0]);
			fogs.push({ x: rnd(-60, BW), row: horizon - 10 + rnd(0, 34), v: rnd(3, 8) * (i % 2 ? 1 : -1), parts, a: rnd(.09, .17) });
		}
	};
	const W_N = { rain: 70, snow: 60, leaves: 22, petals: 26, ash: 40, embers: 30, sparks: 24, dust: 34, smoke: 14 };
	const setWeather = (w, init) => {
		weather = w || 'none';
		emitters = emitters.filter(e => !e.weather);
		if (lite) return;
		if (W_N[weather]) emitters.push({ k: weather, n: W_N[weather], weather: true });
		if (weather === 'fog') makeFog(8);
	};
	const stepParticles = (dt) => {
		// Reposición hasta el cupo de cada emisor
		for (const e of emitters) {
			if (e.have === undefined) { for (let i = 0; i < e.n; i++) { const p = born(e.k, true); if (p) p.em = e; } e.have = 1; continue; }
			let c = 0; for (const p of P) if (p.em === e) c++;
			if (c < e.n && Math.random() < dt * e.n * 0.9) { const p = born(e.k, false); if (p) p.em = e; }
		}
		const dcx = (cam.ox - lastCx) * K; lastCx = cam.ox;
		for (let i = P.length - 1; i >= 0; i--) {
			const p = P[i]; p.t += dt;
			if (p.world) { p.wx += p.vx * dt; p.wy += p.vy * dt; p.x = px(p.wx, p.wy); p.y = py(p.wy); }
			else { p.x += p.vx * dt - dcx * p.d; p.y += p.vy * dt; }
			let dead = p.t > p.life;
			switch (p.k) {
			case 'rain': if (p.y > p.gy) { dead = true; if (Math.random() < .35) spawn('splash', { x: p.x, y: p.gy, life: .2, d: p.d, c: '#cfe2ff' }); } break;
			case 'snow': p.x += Math.sin(p.t * 1.6 + p.ph) * 10 * dt; if (p.y > BH * .8) dead = true; break;
			case 'leaf': p.y += Math.sin(p.t * 2.4 + p.ph) * 14 * dt; if (p.x < -10 || p.y > BH * .82) dead = true; break;
			case 'ember': p.x += Math.sin(p.t * 3 + p.ph) * 12 * dt; break;
			case 'mote': if (!p.world && (p.x > BW + 6 || p.x < -8)) dead = true; break;
			case 'smoke': p.x += Math.sin(p.t + p.ph) * 5 * dt; break;
			case 'firefly': p.x += Math.sin(p.t * .7 + p.ph) * 9 * dt; p.y += Math.cos(p.t * .9 + p.ph * 2) * 7 * dt; if (p.x < -6) p.x = BW + 4; if (p.x > BW + 6) p.x = -4; break;
			case 'star': if (p.x < -4) p.x += BW * 1.3; if (p.x > BW * 1.3) p.x -= BW * 1.3; break;
			case 'drip': p.vy += 260 * dt; if (p.wy > p.fy) { dead = true; spawn('splash', { x: p.x, y: p.y, life: .32, c: '#bfe6ff', big: true }); } break;
			case 'burst': p.vy += 220 * dt; break;
			case 'qdust': p.vy += 200 * dt; if (p.y > BH * .8) dead = true; break;
			}
			if (dead) P.splice(i, 1);
		}
		// Sucesos sueltos del ambiente
		if (lite || spec.ambient === false) return;
		if (outdoor() && !night && now > birdAt && weather !== 'rain') { const dir = Math.random() < .5 ? 1 : -1; spawn('bird', { x: dir > 0 ? -8 : BW + 8, y: rnd(BH * .06, BH * .3), vx: dir * rnd(24, 38), d: .3, life: 14, c: ph === 'tarde' ? '#3a2a4a' : '#39415a' }); birdAt = now + rnd(4500, 9000); }
		if (type === 'cave' && now > dripAt) { const wx = rnd(SW / 2 - 40, SW / 2 + 40); spawn('drip', { wx, wy: rnd(14, 24), fy: rnd(84, 100), world: true, vy: 4, c: '#bfe6ff' }); dripAt = now + rnd(1300, 3200); }
		if (now > glintAt) {
			glintAt = now + rnd(260, 700);
			if (bgSpec.crystals) spawn('glint', { wx: rnd(SW / 2 - 46, SW / 2 + 46), wy: rnd(68, 94), world: true, life: .8, c: bgSpec.crystals });
			else if (type === 'coast') spawn('glint', { wx: rnd(SW / 2 - 46, SW / 2 + 46), wy: rnd(57, 80), world: true, life: .7, c: '#ffffff', flat: true });
			else glintAt = now + 5000;
		}
	};
	const drawParticle = (c, p) => {
		const x = Math.round(p.x), y = Math.round(p.y), u = p.t / p.life;
		switch (p.k) {
		case 'rain': c.globalAlpha = p.a; c.fillStyle = p.c; c.fillRect(x, y, 1, p.s); c.fillRect(x + 1, y - p.s * .6, 1, p.s * .6); break;
		case 'splash': c.globalAlpha = 1 - u; c.fillStyle = p.c; { const r = Math.round((p.big ? 3 : 1) + u * (p.big ? 7 : 4)); c.fillRect(x - r, y, 2, 1); c.fillRect(x + r - 1, y, 2, 1); c.fillRect(x - 1, y - (p.big ? 3 : 1) * (1 - u) * 2, 2, 1); } break;
		case 'snow': c.globalAlpha = p.a; c.fillStyle = p.c; c.fillRect(x, y, p.s, p.s); break;
		case 'leaf': { c.globalAlpha = p.a; c.fillStyle = p.c; const f = Math.sin(p.t * 5 + p.ph) > 0; c.fillRect(x, y, f ? p.s + 1 : p.s, f ? p.s - 1 : p.s); c.fillRect(x + 1, y + (f ? p.s - 1 : p.s), 1, 1); } break;
		case 'ember': c.globalAlpha = Math.min(1, (1 - u) * 1.6) * (.6 + .4 * Math.sin(p.t * 14 + p.ph)); c.fillStyle = u < .4 ? '#ffe9a0' : u < .75 ? '#ff9a3a' : '#c8402a'; c.fillRect(x, y, p.s, p.s); break;
		case 'spark': { const a = Math.sin(Math.min(1, u) * Math.PI); c.globalAlpha = a * (.55 + .45 * Math.sin(p.t * 30 + p.ph)); c.fillStyle = p.c; c.fillRect(x, y, p.s, p.s); if (a > .6) { c.fillRect(x - p.s, y, p.s * 3, 1); c.fillRect(x, y - p.s, 1, p.s * 3); } } break;
		case 'mote': c.globalAlpha = p.a * (.5 + .5 * Math.sin(p.t * 1.3 + p.ph)) * (p.life < 1e8 ? Math.sin(Math.min(1, u) * Math.PI) : 1); c.fillStyle = p.c; c.fillRect(x, y, p.s * (p.world ? K - 1 : 1), p.s * (p.world ? K - 1 : 1)); break;
		case 'smoke': { const a = Math.sin(Math.min(1, u) * Math.PI) * .22, s = Math.round(p.s * (1 + u * 1.6)); c.globalAlpha = a; c.fillStyle = p.c; c.fillRect(x, y, s, s * .7); c.fillRect(x + 2, y - 2, s - 4, 2); } break;
		case 'firefly': { const a = .5 + .5 * Math.sin(p.t * 2.2 + p.ph); c.globalAlpha = a * .22; c.fillStyle = p.c; c.fillRect(x - 3, y - 3, 8, 8); c.globalAlpha = a * .5; c.fillRect(x - 1, y - 1, 4, 4); c.globalAlpha = a; c.fillRect(x, y, 2, 2); } break;
		case 'star': c.globalAlpha = .45 + .55 * Math.sin(p.t * (1 + p.ph * .4) + p.ph); c.fillStyle = p.c; c.fillRect(x, y, p.s * 2, p.s * 2); break;
		case 'bird': { c.globalAlpha = .9; c.fillStyle = p.c; const up = Math.sin(p.t * 9) > 0, yy = y + Math.round(Math.sin(p.t * 1.3 + p.ph) * 4); c.fillRect(x - 4, yy + (up ? -2 : 1), 3, 2); c.fillRect(x + 3, yy + (up ? -2 : 1), 3, 2); c.fillRect(x - 1, yy, 4, 2); } break;
		case 'drip': c.globalAlpha = .9; c.fillStyle = p.c; c.fillRect(x, y, 2, 4); break;
		case 'glint': { const a = Math.sin(u * Math.PI), r = Math.round(a * (p.flat ? 5 : 4)); c.globalAlpha = a; c.fillStyle = '#fff'; c.fillRect(x - r, y, r * 2 + 2, p.flat ? 1 : 2); if (!p.flat) { c.fillRect(x, y - r, 2, r * 2 + 2); c.fillStyle = p.c; c.fillRect(x - 1, y - 1, 4, 4); c.fillStyle = '#fff'; c.fillRect(x, y, 2, 2); } } break;
		case 'fxspark': { const a = Math.sin(u * Math.PI), r = Math.round(a * p.s); c.globalAlpha = a; c.fillStyle = p.c; c.fillRect(x - r, y, r * 2 + 2, 2); c.fillRect(x, y - r, 2, r * 2 + 2); c.fillStyle = '#fff'; c.fillRect(x, y, 2, 2); } break;
		case 'burst': { c.globalAlpha = 1 - u * u; c.fillStyle = p.c; const r = p.s; c.fillRect(x - r, y - 1, r * 2, 2); c.fillRect(x - 1, y - r, 2, r * 2); c.fillRect(x - r / 2, y - r / 2, r, r); } break;
		case 'qdust': c.globalAlpha = .8; c.fillStyle = p.c; c.fillRect(x, y, p.s, p.s); break;
		case 'amote': c.globalAlpha = Math.sin(Math.min(1, u) * Math.PI) * .9; c.fillStyle = p.c; c.fillRect(x, y, 2, 3); break;
		}
		c.globalAlpha = 1;
	};

	// ---------- Oscuridad y luz ----------
	const dark = { veil: spec.start === 'dark' ? DARK : 0, veilT: spec.start === 'dark' ? DARK : 0, r: 0, rT: 0, x: BW / 2, y: BH * .5, open: 0, col: '#ffe27a', hs: 1 };
	const drawDark = () => {
		const amb = bgSpec.dark && type !== 'cave' ? 0.42 : 0;
		const a = 1 - (1 - dark.veil) * (1 - amb);
		if (a < 0.01) return;
		if (dark.r < 2) { g.fillStyle = `rgba(3,4,12,${a})`; g.fillRect(0, 0, BW, BH); return; }
		const r = dark.r * (1 + Math.sin(now / 420) * 0.035), gr = g.createRadialGradient(dark.x, dark.y, 0, dark.x, dark.y, r);
		const st = (o, k) => gr.addColorStop(o, `rgba(3,4,12,${amb + (a - amb) * (1 - dark.hs * (1 - k))})`);
		st(0, 0); st(.5, 0); st(.5, .3); st(.72, .3); st(.72, .62); st(.9, .62); st(.9, 1); st(1, 1);
		g.fillStyle = gr; g.fillRect(0, 0, BW, BH);
		g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.16 * Math.min(1, a * 1.4) * (dark.hs < 1 ? 0 : 1);
		g.fillStyle = dark.col; g.beginPath(); g.arc(dark.x, dark.y, r * .5, 0, 7); g.fill();
		g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
	};

	// ---------- Efectos dibujados ----------
	let FX = [];
	const addFx = (k, o = {}) => { const f = { k, t0: now, dur: 1e9, frame: true, ...o }; FX.push(f); return f; };
	const ring = (c, x, y, r, w, col, a, ry) => { if (r <= 0 || a <= 0) return; c.globalAlpha = a; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.ellipse(x, y, r, ry ?? r, 0, 0, 7); c.stroke(); c.globalAlpha = 1; };
	const drawFxBack = () => {
		for (const f of FX) {
			const t = (now - f.t0) / 1000;
			if (f.k === 'aura') {
				const p = f.pt();
				g.globalCompositeOperation = 'lighter';
				g.globalAlpha = .2 + .08 * Math.sin(t * 5); g.fillStyle = f.c; g.beginPath(); g.arc(p.x, p.y, 34, 0, 7); g.fill();
				g.globalAlpha = .16; g.beginPath(); g.arc(p.x, p.y, 54, 0, 7); g.fill(); g.globalAlpha = 1;
				if (!lite) for (let i = 0; i < 3; i++) { const u = ((t / 1.5) + i / 3) % 1; ring(g, p.x, p.y, 16 + u * 110, 3 - u * 2, i % 2 ? '#dfe9ff' : f.c, (1 - u) * .85); }
				g.globalCompositeOperation = 'source-over';
				if (!lite && Math.random() < .3) spawn('amote', { x: p.x + rnd(-40, 40), y: p.y + rnd(-10, 50), vy: -rnd(30, 60), life: rnd(.6, 1.1), c: Math.random() < .5 ? '#dfe9ff' : f.c, keep: true });
			} else if (f.k === 'beam') {
				const p = f.pt(), fl = 1 + Math.sin(t * 9) * .06, grow = Math.min(1, t / .45);
				g.globalCompositeOperation = 'lighter'; g.fillStyle = f.c;
				for (const [w, a] of [[46, .12], [30, .2], [16, .34], [6, .6]]) { g.globalAlpha = a * grow; const ww = Math.round(w * fl * grow); g.fillRect(Math.round(p.x - ww / 2), 0, ww, p.gy); }
				g.globalAlpha = .3 * grow; g.beginPath(); g.ellipse(p.x, p.gy, 44 * fl, 9, 0, 0, 7); g.fill();
				g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
				if (!lite && Math.random() < .35) spawn('amote', { x: p.x + rnd(-18, 18), y: p.gy - rnd(0, 60), vy: -rnd(40, 90), life: rnd(.7, 1.3), c: '#fff', keep: true });
			} else if (f.k === 'ripple') {
				const p = f.pt();
				for (let i = 0; i < 3; i++) { const u = lite ? .25 + i * .25 : (t - i * .28) / 1.3; if (u > 0 && u < 1) ring(g, p.x, p.gy, 8 + u * 96, 2, f.c, (1 - u) * .8, (8 + u * 96) * .26); }
			} else if (f.k === 'backlight') {
				const p = f.pt(), gr = g.createRadialGradient(p.x, p.y, 4, p.x, p.y, 190);
				gr.addColorStop(0, f.c); gr.addColorStop(1, 'rgba(0,0,0,0)');
				g.globalCompositeOperation = 'lighter'; g.fillStyle = gr;
				g.globalAlpha = Math.min(1, t * 2) * (f.soft ? f.soft * (.8 + .2 * Math.sin(t * 3.6)) : .85);
				g.fillRect(0, 0, BW, BH);
				g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
			}
		}
	};
	const drawFxFront = () => {
		const cx = BW / 2, cy = BH * .46;
		for (const f of FX) {
			const t = (now - f.t0) / 1000;
			if (f.k === 'speedlines') {
				const R = seedRand('sl' + Math.floor(now / 70));
				fg.fillStyle = '#fff';
				for (let i = 0; i < 30; i++) {
					const a = R() * 6.283, r0 = BH * (.24 + R() * .16), r1 = BH * .8, w = .012 + R() * .022;
					fg.globalAlpha = .55 + R() * .4; fg.beginPath();
					fg.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 1.25);
					fg.lineTo(cx + Math.cos(a - w) * r1, cy + Math.sin(a - w) * r1 * 1.25);
					fg.lineTo(cx + Math.cos(a + w) * r1, cy + Math.sin(a + w) * r1 * 1.25);
					fg.fill();
				}
				fg.globalAlpha = 1;
			} else if (f.k === 'impact' && t < .34) {
				const p = f.p, u = t / .34, r = 12 + easeOut(u) * 46;
				for (const [k, col] of [[1, '#ffd24a'], [.62, '#ffffff']]) {
					fg.fillStyle = col; fg.globalAlpha = 1 - u * u; fg.beginPath();
					for (let i = 0; i < 20; i++) { const a = i / 20 * 6.283 + f.rot, rr = (i % 2 ? r * .46 : r) * k; fg.lineTo(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr); }
					fg.fill();
				}
				fg.globalAlpha = 1;
			} else if (f.k === 'slash' && t < .5) {
				const p = f.p, u = Math.min(1, t / .16), L = 120, a = 1 - Math.max(0, (t - .16) / .34);
				const x0 = p.x + L * .7, y0 = p.y - L, x1 = x0 - L * 1.4 * u, y1 = y0 + L * 2 * u, w = 7 * a;
				fg.globalAlpha = a; fg.fillStyle = '#fff'; fg.beginPath(); fg.moveTo(x0, y0); fg.lineTo((x0 + x1) / 2 + w, (y0 + y1) / 2 + w * .6); fg.lineTo(x1, y1); fg.lineTo((x0 + x1) / 2 - w, (y0 + y1) / 2 - w * .6); fg.fill();
				fg.fillStyle = f.c; fg.globalAlpha = a * .6; fg.beginPath(); fg.moveTo(x0 + 6, y0); fg.lineTo((x0 + x1) / 2 + w + 6, (y0 + y1) / 2 + w * .6); fg.lineTo(x1 + 6, y1); fg.fill();
				fg.globalAlpha = 1;
			} else if (f.k === 'sparkle' || f.k === 'evolve') {
				if (!lite && Math.random() < (f.k === 'evolve' ? .5 : .28)) { const p = f.pt(), a = rnd(6.283), r = rnd(14, f.k === 'evolve' ? 86 : 64); spawn('fxspark', { x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r, life: rnd(.4, .8), s: 3 + (rnd(4) | 0), c: f.c, d: 2, keep: true }); }
				if (f.k === 'evolve') { const p = f.pt(); for (let i = 0; i < 2; i++) { const u = ((t / .9) + i / 2) % 1; ring(fg, p.x, p.y, 96 - u * 84, 2, '#fff', u * .8); } }
			} else if (f.k === 'quake') {
				if (!lite && Math.random() < .5) spawn('qdust', { x: rnd(BW), y: rnd(-4, BH * .2), vy: rnd(20, 80), s: 1 + (rnd(3) | 0), life: 3, c: ['#8a7f72', '#5a5148', '#b4a898'][rnd(3) | 0], d: 2, keep: true });
			}
		}
	};

	// ---------- Bucle único ----------
	let now = performance.now(), last = now, lastDraw = 0;
	const vig = (() => { const cv = document.createElement('canvas'); cv.width = 65; cv.height = 130; const c = cv.getContext('2d'); const gr = c.createRadialGradient(32, 60, 28, 32, 60, 86); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.6, 'rgba(0,0,8,.16)'); gr.addColorStop(1, 'rgba(0,0,8,.5)'); c.fillStyle = gr; c.fillRect(0, 0, 65, 130); return cv; })();
	let lastTf = '';
	const draw = (dt) => {
		camTick(dt);
		g.setTransform(1, 0, 0, 1, 0, 0);
		g.fillStyle = '#05060c'; g.fillRect(0, 0, BW, BH);
		if (tallOld && tallMix < 1) { drawTall(tallOld); g.globalAlpha = tallMix; drawTall(tall); g.globalAlpha = 1; tallMix = Math.min(1, tallMix + dt / .6); if (tallMix >= 1) tallOld = null; } else drawTall(tall);
		// Nubes (paralaje lento)
		for (const c of clouds) {
			c.x += c.v * dt; if (c.x > BW + 60) c.x = -c.w * 2 - 20;
			const x = Math.round(c.x - cam.ox * K * .3), y = Math.round(c.y - cam.oy * K * .5);
			g.fillStyle = c.col; for (const [a, b, w, hh] of c.parts) g.fillRect(x + a * 2, y + b * 2, w * 2, hh * 2);
		}
		// Detalles anclados a la escena
		if (INDOOR.has(type) && beams.length) {
			g.globalCompositeOperation = 'lighter'; g.fillStyle = ph === 'tarde' ? '#ffb070' : '#fff2c8';
			const a = .085 + Math.sin(now / 2300) * .02;
			for (const b of beams) { g.globalAlpha = a; g.beginPath(); g.moveTo(px(b.x, 36), py(36)); g.lineTo(px(b.x + 30, 36), py(36)); g.lineTo(px(b.x + 62, 108), py(112)); g.lineTo(px(b.x + 18, 108), py(112)); g.fill(); }
			g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
		}
		if (leds) {
			if (now > ledAt) { leds[rnd(5) | 0] = Math.random() < .5; ledAt = now + rnd(180, 700); }
			leds.forEach((on, i) => { g.fillStyle = on ? '#9dff9d' : '#ff6a6a'; g.fillRect(Math.round(px(134 + i * 7, 34)), py(34), 4 * K, 4 * K); });
			g.fillStyle = 'rgba(120,200,255,.35)'; g.fillRect(Math.round(px(20, 44)), py(44 + ((now / 160) % 18 | 0)), 44 * K, K);
		}
		if (type === 'coast') {
			g.fillStyle = '#fff';
			for (let i = -2; i < 16; i++) { const o = Math.sin(now / 900 + i * 1.7); g.globalAlpha = .55 + .4 * o; g.fillRect(Math.round(px(i * 14 + o * 5, 83)), py(82) + Math.round(o * K), 9 * K, K); }
			g.globalAlpha = .5; for (let i = -2; i < 14; i++) { const o = Math.sin(now / 1300 + i * 2.3); g.fillRect(Math.round(px(i * 17 + o * 7 + 5, 70)), py(64 + (i * 5) % 14), 6 * K, 1); }
			g.globalAlpha = 1;
		}
		if (type === 'cave' && !lite) { const x = px(96, 66), y = py(66), gr = g.createRadialGradient(x, y, 6, x, y, 150); gr.addColorStop(0, 'rgba(255,207,138,1)'); gr.addColorStop(.45, 'rgba(255,190,120,.4)'); gr.addColorStop(1, 'rgba(255,190,120,0)'); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .1 + .05 * Math.sin(now / 190) * Math.sin(now / 730); g.fillStyle = gr; g.fillRect(0, 0, BW, BH); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
		if (type === 'tower' && night && !lite) { g.fillStyle = '#fff2b0'; for (let i = 0; i < 6; i++) { g.globalAlpha = .25 + .25 * Math.sin(now / 260 + i * 2.1) * Math.sin(now / 97 + i); g.fillRect(Math.round(px(92, 12 + i * 9)), py(12 + i * 9), 8 * K, 5 * K); } g.globalAlpha = 1; }
		for (const f of fogs) {
			f.x += f.v * dt; if (f.x > BW + 40) f.x = -220; if (f.x < -230) f.x = BW + 30;
			const x = Math.round(f.x - cam.ox * K * 1.1), y = py(f.row);
			g.fillStyle = night ? '#aab8e0' : '#e4e8f4'; g.globalAlpha = f.a;
			for (const [a, b, w, hh] of f.parts) g.fillRect(x + a * 2, y + b * 2, w * 2, hh * 2);
			g.globalAlpha = 1;
		}
		if (weather === 'rain') { g.fillStyle = 'rgba(16,26,60,.24)'; g.fillRect(0, 0, BW, BH); }
		if (weather === 'fog') { g.fillStyle = 'rgba(220,226,240,.1)'; g.fillRect(0, 0, BW, BH); }
		if (weather === 'embers') { g.fillStyle = 'rgba(255,120,40,.07)'; g.fillRect(0, 0, BW, BH); }
		stepParticles(dt);
		for (const p of P) if (p.d <= 1.15) drawParticle(g, p);
		drawFore();
		// Oscuridad con hueco de luz
		dark.veil += (dark.veilT - dark.veil) * Math.min(1, dt * 4);
		if (dark.open) { const u = (now - dark.open) / 1900; dark.r = dark.r0 + (BH * 1.2 - dark.r0) * u * u; if (u >= 1) { dark.open = 0; dark.veil = dark.veilT = 0; dark.r = dark.rT = 0; } } else { dark.r += (dark.rT - dark.r) * Math.min(1, dt * 5); if (dark.pt) { const p = dark.pt(), k = dark.r < 12 ? 1 : Math.min(1, dt * 8); dark.x += (p.x - dark.x) * k; dark.y += (p.y - dark.y) * k; } }
		drawDark();
		if (bgSpec.fissure) {
			// Columna de luz: núcleo fino, halo ancho y un pulso lento
			const x = Math.round(px(120, 50)), top = py(-eT), bot = py(92), pulse = .5 + .5 * Math.sin(now / 520);
			g.globalCompositeOperation = 'lighter';
			for (const [w, a, col] of [[46, .05, '#7a5cff'], [28, .09, '#8f76ff'], [14, .16, '#b7a4ff'], [5, .5, '#efe8ff']]) { const ww = Math.round(w * (1 + pulse * .12)); g.globalAlpha = a * (.75 + pulse * .25); g.fillStyle = col; g.fillRect(x - ww / 2, top, ww, bot - top); }
			g.globalAlpha = .22 + pulse * .1; g.fillStyle = '#a58cff'; g.beginPath(); g.ellipse(x, bot, 40, 8, 0, 0, 7); g.fill();
			g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
		}
		drawFxBack();
		g.drawImage(vig, 0, 0, BW, BH);
		// Capa delantera
		fg.clearRect(0, 0, BW, BH);
		for (const p of P) if (p.d > 1.15) drawParticle(fg, p);
		if (dark.veil > .05) { fg.globalCompositeOperation = 'source-atop'; fg.fillStyle = `rgba(3,4,12,${dark.veil * .8})`; fg.fillRect(0, 0, BW, BH); fg.globalCompositeOperation = 'source-over'; }
		drawFxFront();
		FX = FX.filter(f => now - f.t0 < f.dur);
		// Zoom (lo hace el compositor: suave y barato)
		const tf = `scale(${cam.oz.toFixed(4)})`;
		if (tf !== lastTf) { lastTf = tf; bgc.style.transform = tf; actorsEl.style.transform = `scale(${(1 + (cam.oz - 1) * .6).toFixed(4)})`; }
	};
	const tick = (t) => {
		if (!alive) return;
		raf = requestAnimationFrame(tick);
		now = t; const dt = Math.min(0.05, (t - last) / 1000); last = t;
		typeTick(dt); actorTick(); autoTick();
		if (lite) { if (t - lastDraw < 120) return; lastDraw = t; }
		draw(lite ? 0.12 : dt);
	};

	// ---------- Actores ----------
	const actors = new Map();
	const npcOf = id => id === 'jugador' ? { id, name: G?.player?.name || '', look: G?.player?.look || {} } : C.npcs[id] ? { id, ...C.npcs[id] } : { id, name: id, look: { seed: id } };
	const bust = (look) => {
		const cv = h('canvas', { class: 'cs-bust', width: 48, height: 48 }), c = cv.getContext('2d'), cache = {};
		const st = { blink: false, talk: false, open: false, nextBlink: now + rnd(1200, 3600), blinkEnd: 0, nextMouth: 0 };
		const paint = () => {
			const k = (st.blink ? 'b' : '') + (st.talk && st.open ? 't' : '');
			const grid = cache[k] ||= retratoGrid(look, { blink: st.blink, talk: st.talk && st.open });
			c.clearRect(0, 0, 48, 48);
			for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) if (grid[y][x]) { c.fillStyle = grid[y][x]; c.fillRect(x, y, 1, 1); }
		};
		paint();
		cv._tick = () => {
			let ch = false;
			if (!lite) {
				if (!st.blink && now > st.nextBlink) { st.blink = true; st.blinkEnd = now + 120; ch = true; }
				else if (st.blink && now > st.blinkEnd) { st.blink = false; st.nextBlink = now + rnd(2800, 6000); ch = true; }
			}
			if (st.talk && now > st.nextMouth) { st.open = !st.open; st.nextMouth = now + 130; ch = true; }
			if (ch) paint();
		};
		cv._talk = on => { if (st.talk === !!on) return; st.talk = !!on; st.open = false; st.nextMouth = 0; paint(); };
		return cv;
	};
	const medal = (sp, shiny) => {
		const s = D.species[toID(sp)], c1 = TYPE_COLORS[s?.types?.[0]] || '#678', c2 = TYPE_COLORS[s?.types?.[1]] || c1;
		const el = h('div', { class: 'cs-medal' + (shiny ? ' shiny' : '') }, h('i', {}, (s?.name || '?')[0]), h('b', {}, s?.name || '?')); el.style.setProperty('--c1', c1); el.style.setProperty('--c2', c2); return el;
	};
	const monEl = (sp, shiny) => {
		// El sprite se ve cuando ha cargado; si tarda (o no hay conexión ni caché), el medallón ocupa su sitio desde el principio
		const urls = monUrls(sp, { anim: !lite, shiny: !!shiny });
		const img = h('img', { class: 'cs-mon', alt: '', draggable: 'false' });
		const wrap = h('span', { class: 'cs-monw' }, img);
		let i = 0, med = null;
		const fallback = () => { if (!med && wrap.isConnected !== false) wrap.append(med = medal(sp, shiny)); };
		img.style.display = 'none';
		img.onerror = () => { i++; if (i < urls.length) img.src = urls[i]; else { img.remove(); fallback(); } };
		img.onload = () => { const n = Math.max(img.naturalWidth, img.naturalHeight) || 96; img.style.width = Math.round(img.naturalWidth * (n <= 64 ? 2.6 : n <= 100 ? 1.9 : 1.3)) + 'px'; med?.remove(); med = null; img.style.display = ''; };
		img.src = urls[0];
		later(() => { if (!img.complete || !img.naturalWidth) fallback(); }, 260);
		return wrap;
	};
	const visual = (a) => {
		if (a.kind === 'item') { const el = pxItem(toID(a.src), 96) || itemImg(a.src); el.classList.add('cs-item'); return el; }
		if (a.kind === 'mon') return monEl(a.src, a.shiny);
		const n = npcOf(a.src), look = n.look || { seed: n.name };
		if (n.sprite && a.src !== 'jugador') {
			const img = trainerImg(n.sprite, look); img.classList.add('cs-spr');
			img.onerror = () => { const b = bust(look); a.el.classList.replace('k-spr', 'k-npc'); img.replaceWith(b); a.vis = b; };
			a.el.classList.replace('k-npc', 'k-spr');
			return img;
		}
		return bust(look);
	};
	const emoteEl = (e) => {
		const d = EMOTE_PX[e];
		if (!d) return h('div', { class: 'cs-emote' }, e === '...' ? '…' : e === 'zzz' ? 'Zz' : e);
		const cv = h('canvas', { width: 7, height: 7 }), c = cv.getContext('2d');
		d.px.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '.') return; c.fillStyle = ch === 'o' ? '#2a1830' : ch === 'w' ? '#fff' : d.c; c.fillRect(x, y, 1, 1); }));
		return h('div', { class: 'cs-emote ico' }, cv);
	};
	// mon: '{riolu}' es el compañero del jugador tal como está ahora (Riolu o Lucario, variocolor si lo es)
	const partner = () => { const p = findRiolu(); return p ? { sp: p.sp, shiny: !!p.shiny } : { sp: 'riolu', shiny: false }; };
	const srcOf = a => a.item ? ['item', a.item] : a.mon ? ['mon', a.mon === CINE_PARTNER ? partner().sp : a.mon] : (a.id || a.npc) ? ['npc', a.id || a.npc] : null;
	const atOf = v => typeof v === 'number' ? clamp(v, 0, 1) : AT[v] ?? 0.5;
	const anim = (el, cls, ms, done) => { el.classList.remove(...[...el.classList].filter(c => c.startsWith(cls.split('-')[0] + '-'))); void el.offsetWidth; el.classList.add(cls); if (ms) later(() => { el.classList.remove(cls); done?.(); }, ms); };
	const removeActor = (a, how) => {
		if (!a || a.gone) return; a.gone = true; actors.delete(a.key);
		if (lite || how === 'none') { a.el.remove(); return; }
		a.el.classList.add('leaving'); anim(a.inEl, 'out-' + (how || 'fade'), 0);
		later(() => a.el.remove(), 520);
	};
	const doAct = (a, act) => {
		const el = a.doEl;
		for (const c of [...el.classList]) if (c.startsWith('do-')) el.classList.remove(c);
		if (act === 'turn') { a.flip = !a.flip; a.body.classList.toggle('flip', a.flip); act = null; anim(el, 'do-turn', 320); return; }
		if (act === 'step' || act === 'back') { a.el.classList.toggle('near', act === 'step'); a.el.classList.toggle('away', act === 'back'); act = null; }
		if (act === 'faint') { a.el.classList.add('fainted'); void el.offsetWidth; el.classList.add('do-faint'); return; }
		a.el.classList.remove('fainted');
		const once = { hop: 700, shake: 520, nod: 760, bow: 1500, spin: 900 }[act];
		void el.offsetWidth;
		if (once) { el.classList.add('do-' + act); later(() => { el.classList.remove('do-' + act); el.classList.add('do-' + a.idle); }, once); }
		else el.classList.add('do-' + (act && act !== 'idle' ? act : a.idle));
		if (act === 'bob' || act === 'float') a.idle = act;
	};
	const applyActor = (spec0, fxs) => {
		const s = srcOf(spec0), key = String(spec0.key ?? spec0.id ?? spec0.npc ?? spec0.mon ?? spec0.item ?? '');
		let a = actors.get(key);
		if (spec0.remove) { removeActor(a, spec0.exit); return null; }
		if (!a) {
			if (!s) return null;
			a = { key, kind: s[0], src: s[1], shiny: spec0.mon === CINE_PARTNER ? partner().shiny : spec0.shiny, flip: false, idle: s[0] === 'item' ? 'float' : 'idle' };
			a.body = h('div', { class: 'cs-a-body' });
			a.doEl = h('div', { class: 'cs-a-do do-' + a.idle }, h('div', { class: 'cs-a-rays' }), h('div', { class: 'cs-a-halo' }), a.body);
			a.inEl = h('div', { class: 'cs-a-in' }, a.doEl);
			a.el = h('div', { class: 'cs-actor k-' + a.kind }, h('div', { class: 'cs-a-shadow' }), a.inEl);
			a.body.append(a.vis = visual(a));
			a.at = atOf(spec0.at); a.el.style.setProperty('--x', (a.at * 100) + '%');
			if (spec0.size) a.el.classList.add('sz-' + spec0.size);
			actorsEl.append(a.el); actors.set(key, a);
			const enter = fxs.includes('rise') ? 'rise' : fxs.includes('fall') ? 'drop' : spec0.enter || (a.kind === 'npc' ? (a.at < .4 ? 'left' : a.at > .6 ? 'right' : 'up') : 'pop');
			if (!lite && enter !== 'none') anim(a.inEl, 'in-' + enter, 1500);
		} else {
			if (s && (s[0] !== a.kind || s[1] !== a.src)) { // mismo actor, otra imagen (evolución o cambio)
				const evo = fxs.includes('evolve') && !lite;
				const swap = () => { if (a.gone) return; a.el.classList.replace('k-' + a.kind, 'k-' + s[0]); a.kind = s[0]; a.src = s[1]; a.shiny = spec0.mon === CINE_PARTNER ? partner().shiny : spec0.shiny; a.vis.remove(); a.body.querySelector('.cs-medal, .cs-bust, .cs-monw, img')?.remove(); a.body.append(a.vis = visual(a)); };
				if (evo) { a.el.classList.add('evolving'); later(swap, 1500); later(() => { a.el.classList.remove('evolving'); flash('#fff'); }, 1650); } else swap();
			}
			if (spec0.at !== undefined) { const n = atOf(spec0.at); if (Math.abs(n - a.at) > 0.01) { a.at = n; a.el.style.setProperty('--x', (n * 100) + '%'); if (!lite && a.kind !== 'item') anim(a.inEl, 'in-walk', 800); } }
			if (spec0.size) { a.el.classList.remove('sz-s', 'sz-m', 'sz-l'); a.el.classList.add('sz-' + spec0.size); }
		}
		if (spec0.flip !== undefined) { a.flip = !!spec0.flip; a.body.classList.toggle('flip', a.flip); }
		if (spec0.dim !== undefined) a.el.classList.toggle('dim', !!spec0.dim);
		if (spec0.do) doAct(a, spec0.do);
		a.el.querySelector('.cs-emote')?.remove();
		if (spec0.emote) a.inEl.append(emoteEl(spec0.emote));
		a.speak = !!spec0.speak;
		return a;
	};
	const actorTick = () => { for (const a of actors.values()) a.vis?._tick?.(); };
	const pointOf = (a) => {
		// Centro y pie de un actor, en píxeles del lienzo
		if (!a || a.gone) return { x: BW / 2, y: BH * .44, gy: BH * .62 };
		// Se mide el ancla (no el cuerpo): así el foco apunta a donde el actor va a quedar, no a su animación de entrada
		const e = a.el.getBoundingClientRect(), s = stage.getBoundingClientRect(), hgt = a.body.offsetHeight || 110;
		const lift = a.kind === 'item' ? parseFloat(getComputedStyle(a.el).getPropertyValue('--lift')) || 0 : 0;
		return { x: (e.left - s.left) * sc, y: (e.top - s.top - lift - hgt / 2) * sc, gy: Math.min(BH * .74, (e.top - s.top) * sc + 8) };
	};
	// Punto de un actor que se refresca unas pocas veces por segundo (sin medir en cada fotograma)
	const tracker = (a) => { let p = pointOf(a), at = now; return () => { if (now - at > 160) { p = pointOf(a); at = now; } return p; }; };

	// ---------- Efectos de DOM ----------
	const flash = (col) => { const f = h('div', { class: 'cs-flash', style: col ? { background: col } : null }); stage.append(f); later(() => f.remove(), 700); };
	const shake = (n) => { const c = 'sh' + clamp(n | 0, 1, 3); shakeEl.classList.remove('sh1', 'sh2', 'sh3'); if (lite) return; void shakeEl.offsetWidth; shakeEl.classList.add(c); later(() => shakeEl.classList.remove(c), 900); };
	const FRAME_CLASSES = ['fx-heartbeat', 'fx-quake', 'fx-silhouette'];
	const clearFrameFx = () => {
		stage.classList.remove(...FRAME_CLASSES); band.classList.remove('paper');
		FX = FX.filter(f => !f.frame);
		for (const a of actors.values()) { a.el.classList.remove('fx-glow', 'fx-rays', 'fx-aura', 'lit'); a.el.style.removeProperty('--glow'); a.el.querySelector('.cs-emote')?.remove(); a.speak = false; }
		dark.rT = 0; dark.hs = 1; dark.pt = null;
	};
	const startFx = (fx, fr, focus) => {
		const col = fr.color;
		const pt = tracker(focus);
		switch (fx) {
		case 'dark': dark.veilT = DARK; dark.open = 0; stage.classList.add('is-dark'); break;
		case 'light': if (dark.veil < .5) dark.veil = DARK; dark.veilT = DARK; { const p = pointOf(focus); dark.x = p.x; dark.y = p.y; } dark.col = col || '#ffe27a'; dark.r0 = Math.max(dark.r, 10); dark.open = now; stage.classList.remove('is-dark'); if (lite) { dark.open = 0; dark.veil = dark.veilT = 0; } break;
		case 'flash': flash(col); break;
		case 'shake': shake(fr.shake || 2); break;
		case 'zoom': break; // lo mueve la cámara (push)
		case 'glow': if (!focus) { addFx('backlight', { pt: () => ({ x: BW / 2, y: BH * .46 }), c: col || '#ffe9a8', soft: .55 }); if (dark.veilT > .5) { dark.col = col || '#ffe27a'; dark.x = BW / 2; dark.y = BH * .46; dark.rT = 110; } } else {
			focus.el.classList.add('fx-glow', 'lit'); focus.el.style.setProperty('--glow', col || focus.vis?.style?.getPropertyValue?.('--glow') || '#ffe27a');
			if (focus.kind === 'item') { focus.el.classList.add('fx-rays'); addFx('sparkle', { pt, c: col || '#fff3b0' }); }
			// El brillo de Riolu y Lucario es su aura
			if (focus.kind === 'mon' && !col && /^(riolu|lucario)/.test(toID(focus.src))) { focus.el.style.setProperty('--glow', '#6f9bff'); focus.el.classList.add('fx-aura'); addFx('aura', { pt, c: '#4c7cf0' }); dark.col = '#6f9bff'; }
			if (dark.veilT > .5) { dark.col = col || '#ffe27a'; dark.rT = 104; dark.pt = pt; }
		} break;
		case 'rays': if (focus) { focus.el.classList.add('fx-rays', 'lit'); focus.el.style.setProperty('--glow', col || '#ffe27a'); } break;
		case 'aura': addFx('aura', { pt, c: col || '#4c7cf0' }); if (focus) { focus.el.classList.add('fx-aura', 'lit'); focus.el.style.setProperty('--glow', col || '#6f9bff'); } break;
		case 'sparkle': addFx('sparkle', { pt, c: col || '#fff3b0' }); break;
		case 'beam': addFx('beam', { pt, c: col || '#fff6c8' }); focus?.el.classList.add('lit'); break;
		case 'ripple': addFx('ripple', { pt, c: col || '#cfe6ff', dur: 2100 }); break;
		case 'speedlines': addFx('speedlines'); break;
		case 'impact': later(() => { addFx('impact', { p: pointOf(focus), rot: rnd(6), dur: 400, frame: false }); const p = pointOf(focus); if (!lite) for (let i = 0; i < 8; i++) { const a = rnd(6.283), v = rnd(90, 190); spawn('burst', { x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: rnd(.4, .7), s: 3 + (rnd(3) | 0), c: Math.random() < .5 ? '#ffd24a' : '#fff', d: 2, keep: true }); } }, 30); shake(fr.shake || 2); flash('rgba(255,255,255,.55)'); if (focus && !lite) later(() => doAct(focus, 'shake'), 40); break;
		case 'slash': addFx('slash', { p: pointOf(focus), c: col || '#8fd0ff', dur: 520, frame: false }); shake(fr.shake || 1); break;
		case 'quake': stage.classList.add('fx-quake'); addFx('quake'); break;
		case 'heartbeat': stage.classList.add('fx-heartbeat'); if (col) vigEl.style.setProperty('--vig', col); else vigEl.style.removeProperty('--vig'); break;
		case 'silhouette': stage.classList.add('fx-silhouette'); addFx('backlight', { pt: () => ({ x: BW / 2, y: BH * .5 }), c: col || '#ffd9a0' }); break;
		case 'evolve': addFx('evolve', { pt, c: col || '#bfe4ff', dur: 2000, frame: false }); break;
		case 'letter': band.classList.add('paper'); break;
		case 'iris-in': irisEl.classList.remove('shut', 'hole'); break;
		// El círculo se cierra hasta dejar a la vista al actor (o el centro de la escena) y termina de cerrarse al avanzar
		case 'iris-out': { const p = focus ? pointOf(focus) : { x: BW / 2, y: BH * .64 }; irisEl.style.setProperty('--ix', (p.x / BW * 100).toFixed(1) + '%'); irisEl.style.setProperty('--iy', (p.y / BH * 100).toFixed(1) + '%'); irisEl.classList.add('hole'); } break;
		}
	};

	// ---------- Texto ----------
	const ty = { nodes: [], ni: 0, ci: 0, acc: 0, pause: 0, done: true, doneAt: 0, speaker: null, cps: 44 };
	const talk = on => { for (const a of actors.values()) a.vis?._talk?.(on && a === ty.speaker); };
	const typeEnd = () => { if (ty.done) return; for (; ty.ni < ty.nodes.length; ty.ni++) { const [s, hd, str] = ty.nodes[ty.ni]; s.textContent = str; hd.textContent = ''; } ty.done = true; ty.doneAt = now; talk(false); band.classList.add('ready'); };
	const typeStart = (html, speaker) => {
		cap.innerHTML = html; ty.nodes = []; ty.ni = 0; ty.ci = 0; ty.acc = 0; ty.pause = 0; ty.speaker = speaker;
		ty.cps = CPS[G?.settings?.textSpeed ?? 2] ?? 44;
		band.classList.remove('ready');
		const walk = el => { for (const c of [...el.childNodes]) { if (c.nodeType === 3) { const str = c.textContent, hd = h('span', { class: 'cs-hid' }, str), s = document.createTextNode(''); c.replaceWith(s, hd); ty.nodes.push([s, hd, str]); } else walk(c); } };
		walk(cap);
		ty.done = false;
		if (!ty.nodes.length || ty.cps === Infinity) { typeEnd(); return; }
		talk(true);
	};
	const typeTick = (dt) => {
		if (ty.done) return;
		if (ty.pause > 0) { ty.pause -= dt; if (ty.pause > 0) return; talk(true); }
		ty.acc += dt * ty.cps;
		while (ty.acc >= 1 && !ty.done) {
			ty.acc--;
			const n = ty.nodes[ty.ni]; if (!n) { typeEnd(); break; }
			const [s, hd, str] = n; ty.ci++;
			s.textContent = str.slice(0, ty.ci); hd.textContent = str.slice(ty.ci);
			const ch = str[ty.ci - 1], nx = str[ty.ci];
			if (ty.ci >= str.length) { ty.ni++; ty.ci = 0; if (ty.ni >= ty.nodes.length) { typeEnd(); break; } }
			if ((nx === ' ' || nx === undefined) && '.!?…'.includes(ch)) { ty.pause = .26; ty.acc = 0; talk(false); break; }
			if (nx === ' ' && ',;:—'.includes(ch)) { ty.pause = .1; ty.acc = 0; break; }
		}
	};

	// ---------- Avance, mantener para saltar ----------
	const st = { adv: null, frameAt: 0, autoMs: 0, skipped: false, skipShown: false, swallow: false, holdT: 0, skipT: 0, busy: true };
	const advance = () => { const r = st.adv; st.adv = null; r?.(); };
	const autoTick = () => {
		if (!st.adv || !st.autoMs || !ty.done || st.skipShown) return;
		if (now - Math.max(ty.doneAt, st.frameAt) < st.autoMs) return;
		if (document.querySelector('.overlay')) { ty.doneAt = now; return; }
		advance();
	};
	const hideSkip = () => { st.skipShown = false; root.classList.remove('skip-on'); clearTimeout(st.skipT); timers.delete(st.skipT); };
	const onTap = () => {
		if (st.skipShown) { hideSkip(); return; }
		if (st.busy || !st.adv) return;
		if (now - st.frameAt < 220) return;
		if (!ty.done) { typeEnd(); return; }
		if (now - ty.doneAt < 260) return;
		advance();
	};
	root.addEventListener('click', e => {
		if (e.target.closest('.cs-log')) return;
		if (e.target.closest('.cs-skip')) { if (st.skipShown) { st.skipped = true; hideSkip(); advance(); } return; }
		if (st.swallow) { st.swallow = false; return; }
		onTap();
	}, sig);
	const holdEnd = () => { clearTimeout(st.holdT); timers.delete(st.holdT); root.classList.remove('holding'); };
	root.addEventListener('pointerdown', e => {
		st.swallow = false;
		if (e.target.closest('.cs-log, .cs-skip') || st.skipShown) return;
		holdEl.style.left = e.clientX - root.getBoundingClientRect().left + 'px'; holdEl.style.top = e.clientY + 'px';
		root.classList.add('holding');
		st.holdT = later(() => { root.classList.remove('holding'); st.swallow = true; st.skipShown = true; root.classList.add('skip-on'); st.skipT = later(hideSkip, 4000); }, 600);
	}, sig);
	for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) root.addEventListener(ev, holdEnd, sig);
	root.addEventListener('contextmenu', e => e.preventDefault(), sig);
	root.addEventListener('keydown', e => {
		if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); }
		else if (e.key === 'Escape') { st.skipShown = true; root.classList.add('skip-on'); st.skipT = later(hideSkip, 4000); }
	}, sig);
	window.addEventListener('resize', () => { measure(); tall = buildTall(bgSpec); tallOld = null; }, sig);

	// ---------- Un frame ----------
	const showFrame = async (fr, idx) => {
		const fxs = asList(fr.fx);
		st.busy = true;
		if (irisEl.classList.contains('hole')) { irisEl.classList.replace('hole', 'shut'); if (!lite) { await wait(420); if (!alive) return; } if (!fxs.includes('iris-out')) later(() => irisEl.classList.remove('shut'), 60); }
		const cut = !lite && (fxs.includes('fade') ? 'fade' : fxs.includes('wipe') ? 'wipe' : null);
		if (cut) { coverEl.className = 'cs-cover ' + cut + ' on'; await wait(cut === 'fade' ? 420 : 380); if (!alive) return; }
		clearFrameFx();
		if (fr.bg) setBg(fr.bg, !!cut || lite);
		if (fr.weather !== undefined) setWeather(fr.weather);
		if (fr.tint !== undefined || fxs.includes('tint')) { const t = fr.tint && fr.tint !== 'none' ? fr.tint : null; tintEl.style.background = t || 'transparent'; tintEl.classList.toggle('on', !!t); }
		// Actores: el atajo de siempre (uno en el centro) y la lista nueva
		let focus = null;
		if (fr.clear) for (const a of [...actors.values()]) removeActor(a, 'fade');
		if (fr.item || fr.npc || fr.mon) {
			const s = fr.item ? { item: fr.item } : fr.npc ? { id: fr.npc } : { mon: fr.mon, shiny: fr.shiny };
			const old = actors.get('_c'), n = srcOf(s);
			if (old && (old.kind !== n[0] || old.src !== n[1]) && !fxs.includes('evolve')) removeActor(old, 'fade');
			focus = applyActor({ key: '_c', at: 'center', ...s }, fxs);
		}
		for (const a of asList(fr.actors)) { const r = applyActor(a, fxs); if (r) focus = r; }
		if (fr.on === false) focus = null; // efectos de escena, no de un actor
		else { if (fr.on !== undefined) focus = actors.get(String(fr.on)) || focus; if (!focus) focus = actors.get('_c') || [...actors.values()].pop() || null; }
		camTo(fr.cam || (fxs.includes('zoom') ? 'push' : spec.cam) || 'drift', fr.camMs, idx);
		if (fr.shake && !fxs.includes('shake') && !fxs.includes('impact') && !fxs.includes('slash')) shake(fr.shake);
		if (cut) { coverEl.classList.add('off'); coverEl.classList.remove('on'); later(() => { coverEl.className = 'cs-cover'; }, 460); }
		if (idx === 0 && spec.start === 'iris') later(() => irisEl.classList.remove('shut'), 80);
		if (idx === 0 && spec.start === 'fade') { coverEl.className = 'cs-cover fade off'; later(() => { coverEl.className = 'cs-cover'; }, 520); }
		root.classList.toggle('first', idx === 0);
		root.dataset.frame = idx;
		for (const fx of fxs) startFx(fx, fr, focus);
		// A oscuras, quien está en escena se adivina: un foco tenue a su alrededor
		if (dark.veilT > .5 && !dark.open && dark.rT === 0 && focus) { dark.hs = .55; dark.rT = 92; dark.pt = tracker(focus); }
		// Texto
		const who = fr.say ? npcOf(fr.say) : null;
		const text = fr.text ? tx(fr.text) : '';
		const speaker = who ? ([...actors.values()].find(a => a.kind === 'npc' && a.src === fr.say) || null) : ([...actors.values()].find(a => a.speak) || null);
		for (const a of actors.values()) a.el.classList.toggle('speaking', a === speaker || a.speak);
		nameEl.innerHTML = ''; bigEl.innerHTML = ''; bigEl.classList.remove('on');
		const name = fr.as ? tx(fr.as) : who?.name || '';
		root.classList.toggle('is-big', !!fr.big);
		if (fr.big) {
			cap.innerHTML = ''; ty.done = true; ty.doneAt = now; band.classList.add('ready');
			bigEl.append(h('div', { class: 'cs-big-t', html: fmtText(text) }), fr.sub ? h('div', { class: 'cs-big-s', html: fmtText(tx(fr.sub)) }) : null);
			void bigEl.offsetWidth; bigEl.classList.add('on');
			if (text) log({ k: 'narr', t: text + (fr.sub ? ' · ' + tx(fr.sub) : '') });
		} else {
			if (name) { if (who && !speaker && fr.say) { const p = portraitFor(who); if (p) nameEl.append(h('span', { class: 'cs-chip' }, p)); } nameEl.append(h('b', {}, name)); }
			band.classList.toggle('has-name', !!name); band.classList.toggle('empty', !text);
			typeStart(text ? fmtText(text) : '', speaker);
			if (text) log(name ? { k: 'say', n: name, t: text } : { k: 'narr', t: text });
		}
		const auto = fr.auto ?? spec.auto;
		st.autoMs = fr.hold ? fr.hold : auto ? (typeof auto === 'number' ? auto : Math.max(1300, text.length * 42)) : 0;
		root.classList.toggle('is-auto', !!st.autoMs);
		st.frameAt = now; st.busy = false;
		await new Promise(r => { st.adv = r; });
	};

	// ---------- Vida de la escena ----------
	const close = async () => {
		st.busy = true; hideSkip();
		if (irisEl.classList.contains('hole')) { irisEl.classList.replace('hole', 'shut'); await wait(lite ? 60 : 380); }
		root.classList.remove('in'); root.classList.add('out');
		await wait(lite ? 120 : 420);
		alive = false; cancelAnimationFrame(raf); ac.abort();
		for (const id of timers) clearTimeout(id); timers.clear();
		root.remove();
		resolve();
	};
	(async () => {
		try {
			if (spec.start === 'iris') irisEl.classList.add('shut');
			if (spec.start === 'fade') coverEl.className = 'cs-cover fade on';
			if (spec.start === 'dark') stage.classList.add('is-dark');
			if (spec.tint) { tintEl.style.background = spec.tint; tintEl.classList.add('on'); }
			weather = spec.weather || 'none';
			setBg(spec.bg || {}, true);
			raf = requestAnimationFrame(tick);
			requestAnimationFrame(() => root.classList.add('in'));
			later(() => root.focus({ preventScroll: true }), 30);
			await wait(lite ? 60 : 380);
			const frames = (spec.frames || []).filter(f => f && (f.cond === undefined || evalCond(f.cond)));
			let i = 0;
			for (; i < frames.length && !st.skipped && alive; i++) await showFrame(frames[i], i);
			// Si se saltó, lo que quedaba por leer va igualmente al registro
			if (st.skipped) for (; i < frames.length; i++) if (frames[i].text) log({ k: frames[i].say ? 'say' : 'narr', n: frames[i].say ? (frames[i].as || npcOf(frames[i].say).name) : null, t: tx(frames[i].text) });
		} catch (e) { console.error('cinemática', e); }
		if (alive) await close();
	})();
}
