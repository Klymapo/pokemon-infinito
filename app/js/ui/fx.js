// Efectos de combate: un lienzo pixelado de partículas pintadas por código y la coreografía de los sprites.
// Un único requestAnimationFrame, que se para solo cuando no queda nada vivo y al cerrar el combate.
import { D } from '../data.js';

const SCALE = 3; // píxeles de pantalla por píxel del lienzo
const TAU = Math.PI * 2;
const MAXP = 600;
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const other = s => s === 'p1' ? 'p2' : 'p1';
const ease = {
	lin: t => t, out: t => 1 - (1 - t) ** 3, in: t => t * t * t,
	io: t => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
	back: t => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2,
};

// Rampas de color por tipo: [luz, medio, sombra, fondo]
const RAMP = {
	Normal: ['#ffffff', '#ece6d2', '#b4ae94', '#7c7662'],
	Fire: ['#fff3a0', '#ffb030', '#f05a18', '#8a2408'],
	Water: ['#e8f8ff', '#78c8ff', '#2c7fe0', '#1a4a9a'],
	Grass: ['#d8ff90', '#78d048', '#2e9a38', '#1c6028'],
	Electric: ['#ffffff', '#fff36a', '#f8c820', '#b88a00'],
	Ice: ['#ffffff', '#c8f4ff', '#78d8f0', '#3a98c8'],
	Fighting: ['#fff0d0', '#ff9a50', '#d84828', '#7a1c10'],
	Poison: ['#f0c0ff', '#c060e0', '#8a30b0', '#4a1868'],
	Ground: ['#f8e0a0', '#d8b060', '#a87838', '#604020'],
	Flying: ['#ffffff', '#d8e8ff', '#a0b8f0', '#6078c0'],
	Psychic: ['#ffe0f0', '#ff78b0', '#e83888', '#901858'],
	Bug: ['#f0ff90', '#b8d020', '#789010', '#405008'],
	Rock: ['#e8d8a8', '#b8a058', '#806830', '#483818'],
	Ghost: ['#d0b8ff', '#8860d0', '#503090', '#201040'],
	Dragon: ['#c0d0ff', '#7060f8', '#9030d0', '#301880'],
	Dark: ['#e8405c', '#4a3440', '#1a1018', '#000000'],
	Steel: ['#ffffff', '#d8e0e8', '#98a8b8', '#586878'],
	Fairy: ['#ffffff', '#ffc8e8', '#f888c0', '#c84890'],
};
const STATC = { atk: '#f0603c', def: '#f0b830', spa: '#5c98f8', spd: '#58c878', spe: '#f078b8', accuracy: '#d0d0e0', evasion: '#90e0e0' };
const WHITE = 'saturate(0) brightness(6)';
const RED = 'sepia(1) saturate(9) hue-rotate(-45deg) brightness(1.4)';

// Mapas de bits: '#' color, 'o' luz, '+' sombra
const BM = {
	leaf: [['..#.', '.#o#', '#o#.', '##..'], ['##..', '#o#.', '.#o#', '..##'], ['.#..', '#o#.', '.#o#', '..##'].reverse(), ['..##', '.#o#', '#o#.', '##..'].reverse()],
	star4: [['.#.', '#o#', '.#.'], ['..#..', '..o..', '#ooo#', '..o..', '..#..'], ['.#.', '#o#', '.#.'], ['#.#', '.o.', '#.#']],
	star5: [['...#...', '...#...', '.##o##.', '###o###', '.#####.', '.##.##.', '.#...#.']],
	shard: [['.#.', '#o#', '#o#', '+#+', '.+.'], ['..#', '.#o', '#o+', '#+.', '+..'], ['.#o', '#o#', 'o#+', '#+.'], ['#..', 'o#.', '+o#', '.+#', '..+']],
	feather: [['..##', '.#o#', '#o#.', '+#..'], ['##..', '#o#.', '.#o#', '..#+']],
	rock: [['.##.', '#o##', '####', '+##+', '.++.']],
	rockL: [['..###.', '.#oo##', '##o###', '######', '+####+', '.++++.']],
	snow: [['.oo.', 'oo#o', 'o###', '+##+', '.++.']],
	up: [['..#..', '.#o#.', '#####', '..#..', '..#..', '..+..']],
	down: [['..+..', '..#..', '..#..', '#####', '.#o#.', '..#..']],
	zed: [['####', '..#.', '.#..', '####']],
	plus: [['.#.', '#o#', '.#.']],
	bone: [['#.....#', '#ooooo#', '#.....#'], ['##...', '#o#..', '..o..', '..#o#', '...##'], ['###', '.o.', '.o.', '.o.', '.o.', '.o.', '###'], ['...##', '..#o#', '..o..', '#o#..', '##...']],
	fist: [['.#####.', '##o#o#o', '#######', '#######', '+#####+', '.+++++.']],
	note: [['..##', '..#.', '..#.', '###.', '###.']],
	bird: [['#...#', '.#o#.', '..#..']],
};

const FAM_SIG = {
	aurasphere: 'aurasphere', meteormash: 'meteormash', bonerush: 'bone', bonemerang: 'bone', boneclub: 'bone', shadowbone: 'bone',
	thunderbolt: 'skybolt', thunder: 'skybolt', earthquake: 'quake', hyperbeam: 'hyperbeam', gigaimpact: 'gigaimpact', surf: 'surf', muddywater: 'surf',
	psychic: 'psychic', shadowball: 'shadowball', flamethrower: 'flamethrower', nightslash: 'nightslash', sacredsword: 'sacredsword',
	rockslide: 'rockslide', avalanche: 'avalanche', dracometeor: 'rockslide',
};

/** Qué coreografía le toca a un movimiento (familia), deducido de sus datos. */
export function moveInfo(e) {
	const md = D.moves[e.move] || {};
	const fl = (md.flags || '').split(',');
	const has = f => fl.includes(f);
	const id = e.move || '';
	const cat = e.cat || md.cat || 'Physical';
	const type = RAMP[e.type] ? e.type : RAMP[md.type] ? md.type : 'Normal';
	const selfish = /^(self|allySide|allyTeam|allies|adjacentAlly|adjacentAllyOrSelf|all)$/.test(md.target || '');
	const tside = cat === 'Status' ? (selfish ? e.side : other(e.side)) : other(e.side);
	const contact = e.contact ?? has('contact');
	let fam;
	if (cat === 'Status') {
		fam = /protect|detect|shield|bunker|obstruct|silktrap|bulwark|endure|wideguard|quickguard|maxguard/.test(id) ? 'protect'
			: /^(reflect|lightscreen|auroraveil|safeguard|mist)$/.test(id) ? 'screen'
			: /spikes|stealthrock|stickyweb/.test(id) ? 'hazard'
			: has('heal') || /^(rest|wish|aquaring|ingrain|lifedew|junglehealing)$/.test(id) ? 'heal'
			: has('powder') ? 'powder' : has('sound') ? 'sound' : has('dance') ? 'dance'
			: tside === e.side ? 'buff' : 'curse';
	} else if (FAM_SIG[id]) fam = FAM_SIG[id];
	else if (contact) {
		fam = has('punch') || /punch|hammer|chop|forcepalm|armthrust|wakeupslap/.test(id) ? 'punch'
			: has('bite') || /fang|bite|crunch|jaw/.test(id) ? 'bite'
			: /kick|stomp|lowsweep|axe|axel/.test(id) ? 'kick'
			: /claw|scratch|furyswipes/.test(id) ? 'claw'
			: has('slicing') || /slash|cut$|blade|sword|scissor|razor/.test(id) ? 'slice'
			: /tail|whip|slam$/.test(id) ? 'tail'
			: /horn|drill|peck|jab|needle|lunge|spear/.test(id) ? 'horn' : 'tackle';
	} else {
		fam = /quake|magnitude|bulldoze|earthpower|landswrath|precipiceblades|fissure/.test(id) ? 'quake'
			: /explosion|selfdestruct/.test(id) ? 'boom'
			: /beam|laser|cannon|hydropump|originpulse|lightofruin|ray$/.test(id) ? 'beam'
			: has('sound') ? 'sound'
			: has('pulse') || /wave$|pulse/.test(id) ? 'pulse'
			: has('wind') ? 'wind'
			: has('bullet') || /bomb|ball$|sphere|blast$/.test(id) ? 'ball'
			: has('slicing') ? 'cutwave' : 'shot';
	}
	const drain = cat !== 'Status' && (has('heal') || /drain|absorb|leech|oblivionwing|paraboliccharge|dreameater|bitterblade|matchagotcha/.test(id));
	return { id, cat, type, tside, contact, fam, drain, bp: md.bp || 0 };
}

export function createFx(field, opt) {
	const { spriteOf, settings, before, root } = opt;
	const mkEl = (tag, cls) => { const el = document.createElement(tag); el.className = cls; return el; };
	const cv = mkEl('canvas', 'fxc');
	const over = mkEl('div', 'fxo');
	const flashEl = mkEl('div', 'fx-flash');
	field.insertBefore(cv, before || null);
	field.append(over, flashEl);
	let ctx = cv.getContext('2d');
	let W = 0, H = 0, dead = false, raf = 0, inFrame = false, last = 0, T = 0, hurryK = 1;
	const PA = [], EN = [], pend = new Set();
	let waits = [];
	const sh = { amp: 0, t: 0, dur: 1 };

	function fit() {
		const w = Math.max(1, Math.ceil(field.clientWidth / SCALE)), hh = Math.max(1, Math.ceil(field.clientHeight / SCALE));
		if (w !== W || hh !== H) { W = cv.width = w; H = cv.height = hh; }
	}
	fit();
	const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (!dead) fit(); }) : null;
	ro?.observe(field);

	const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	const off = () => settings().anim === false || reduced();
	const speed = () => ([0.85, 1, 1.1, 2][settings().textSpeed ?? 2] || 1) * hurryK;
	const sleep = ms => new Promise(r => setTimeout(r, ms));

	// ---------- Bucle ----------
	function frame(ts) {
		raf = 0;
		if (dead) return;
		inFrame = true; // lo que se emita durante el fotograma no debe pedir otro (se duplicaría el bucle)
		try {
		const dt = Math.min(50, ts - last) * speed();
		last = ts;
		T += dt;
		for (let i = EN.length - 1; i >= 0; i--) if (EN[i].u(dt) === false) EN.splice(i, 1);
		for (let i = PA.length - 1; i >= 0; i--) if (!stepP(PA[i], dt)) PA.splice(i, 1);
		if (waits.length) waits = waits.filter(w => w.done ? false : T >= w.at ? (w.fire(), false) : true);
		if (sh.t > 0) {
			sh.t -= dt;
			const a = sh.t > 0 ? sh.amp * SCALE * (sh.t / sh.dur) : 0;
			field.style.transform = a > 0.5 ? `translate(${Math.round(rnd(-a, a))}px,${Math.round(rnd(-a, a))}px)` : '';
		}
		ctx.clearRect(0, 0, W, H);
		for (const e of EN) e.d?.();
		for (const p of PA) drawP(p);
		} finally { inFrame = false; }
		if (PA.length || EN.length || waits.length || sh.t > 0) raf = requestAnimationFrame(frame);
	}
	function kick() { if (!raf && !inFrame && !dead) { last = performance.now(); raf = requestAnimationFrame(frame); } }
	function add(u, d) { const e = { u, d }; EN.push(e); kick(); return e; }
	function after(ms, fn) { add(dt => { ms -= dt; if (ms <= 0) { fn(); return false; } return true; }); }
	function wait(ms) {
		if (ms <= 0 || dead) return Promise.resolve();
		return new Promise(res => {
			const w = { at: T + ms, done: false };
			w.fire = () => { if (w.done) return; w.done = true; clearTimeout(w.to); pend.delete(w.fire); res(); };
			w.to = setTimeout(w.fire, ms * 2.5 + 800); // por si el navegador para los fotogramas (pestaña oculta)
			waits.push(w); pend.add(w.fire); kick();
		});
	}
	function shake(amp, dur) { if (amp * dur > sh.amp * sh.t) { sh.amp = amp; sh.t = sh.dur = dur; kick(); } }
	function flash(col = '#fff', op = 0.6, dur = 260) {
		flashEl.style.background = col;
		flashEl.animate?.([{ opacity: op }, { opacity: 0 }], { duration: dur / speed(), easing: 'ease-out' });
	}

	// ---------- Primitivas pixeladas ----------
	const R = (c, x, y, w = 1, hh = w) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, hh); };
	function line(x0, y0, x1, y1, c, w = 1) {
		x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
		const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
		let err = dx + dy, n = 0;
		const o = w >> 1;
		ctx.fillStyle = c;
		while (n++ < 600) {
			ctx.fillRect(x0 - o, y0 - o, w, w);
			if (x0 === x1 && y0 === y1) break;
			const e2 = 2 * err;
			if (e2 >= dy) { err += dy; x0 += sx; }
			if (e2 <= dx) { err += dx; y0 += sy; }
		}
	}
	function ring(cx, cy, r, c, ell = 1, w = 1) {
		if (r < 0.6) { R(c, cx, cy, w); return; }
		const n = Math.max(8, Math.ceil(r * 6.4));
		ctx.fillStyle = c;
		for (let i = 0; i < n; i++) { const a = i / n * TAU; ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r * ell), w, w); }
	}
	function disc(cx, cy, r, c, ell = 1) {
		ctx.fillStyle = c;
		cx = Math.round(cx); cy = Math.round(cy);
		const ry = Math.max(0, Math.round(r * ell));
		for (let dy = -ry; dy <= ry; dy++) {
			const k = ry ? dy / (r * ell) : 0;
			const hw = Math.round(Math.sqrt(Math.max(0, 1 - k * k)) * r);
			ctx.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
		}
	}
	function bmp(f, x, y, col, hi = '#fff', shd = col, sc = 1) {
		const hh = f.length, w = f[0].length;
		const ox = Math.round(x - w * sc / 2), oy = Math.round(y - hh * sc / 2);
		for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) {
			const ch = f[j][i];
			if (ch === '#' || ch === 'o' || ch === '+') { ctx.fillStyle = ch === '#' ? col : ch === 'o' ? hi : shd; ctx.fillRect(ox + i * sc, oy + j * sc, sc, sc); }
		}
	}
	function jag(x0, y0, x1, y1, j = 4, seg = 7) {
		const d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(d / seg));
		const nx = -(y1 - y0) / (d || 1), ny = (x1 - x0) / (d || 1);
		const pts = [[x0, y0]];
		for (let i = 1; i < n; i++) { const k = i / n, o = rnd(-j, j); pts.push([lerp(x0, x1, k) + nx * o, lerp(y0, y1, k) + ny * o]); }
		pts.push([x1, y1]);
		return pts;
	}
	function poly(pts, c, w = 1, upto = 1) {
		const n = Math.max(1, Math.round((pts.length - 1) * upto));
		for (let i = 0; i < n; i++) line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], c, w);
	}
	function drawBall(x, y) {
		disc(x, y, 3, '#1c1c24');
		R('#e04038', x - 2, y - 2, 5, 2); R('#ff8a80', x - 1, y - 2, 2, 1);
		R('#f4f4f4', x - 2, y + 1, 5, 2); R('#fff', x, y, 1, 1);
	}

	// ---------- Partículas ----------
	function emit(o) {
		const p = { x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0, drag: 0, life: 400, age: 0, size: 1, col: '#fff', kind: 'dot', delay: 0 };
		Object.assign(p, o);
		if (PA.length < MAXP) PA.push(p); // tope de partículas
		kick();
		return p;
	}
	function stepP(p, dt) {
		if (p.delay > 0) { p.delay -= dt; return true; }
		p.age += dt;
		if (p.age >= p.life) return false;
		const s = dt / 1000;
		p.vx += p.ax * s; p.vy += p.ay * s;
		if (p.drag) { const k = Math.max(0, 1 - p.drag * s); p.vx *= k; p.vy *= k; }
		if (p.jit) { p.vx += rnd(-p.jit, p.jit); p.vy += rnd(-p.jit, p.jit); }
		if (p.wob) p.x += Math.sin((p.age + (p.ph || 0)) / 90) * p.wob * s;
		p.x += p.vx * s; p.y += p.vy * s;
		return true;
	}
	function drawP(p) {
		if (p.delay > 0) return;
		const k = p.age / p.life;
		if (p.blink && k > 0.65 && ((p.age / 45) | 0) % 2) return;
		const col = p.ramp ? p.ramp[Math.min(p.ramp.length - 1, (k * p.ramp.length) | 0)] : p.col;
		if (p.alpha) ctx.globalAlpha = p.alpha;
		switch (p.kind) {
		case 'dot': { let s = p.size + 1; if (p.shrink) s = Math.max(1, Math.round(s * (1 - k))); R(col, p.x - s / 2, p.y - s / 2, s, s); break; }
		case 'disc': { let s = p.size; if (p.shrink) s *= 1 - k; if (p.grow) s += p.grow * k; disc(p.x, p.y, s, col, p.ell); break; }
		case 'bm': { const f = p.bm[p.spin ? ((p.age / p.spin + (p.f || 0)) | 0) % p.bm.length : (p.f || 0) % p.bm.length]; bmp(f, p.x, p.y, col, p.hi, p.sh, p.sc || 2); break; }
		case 'ring': ring(p.x, p.y, lerp(p.r0, p.r1, p.ez ? p.ez(k) : k), col, p.ell || 1, p.w || 1); break;
		case 'line': { const l = p.len * 1.4 * (p.shrink ? 1 - k : 1), sp = Math.hypot(p.vx, p.vy) || 1; line(p.x, p.y, p.x - p.vx / sp * l, p.y - p.vy / sp * l, col, p.w || 2); break; }
		case 'zap': { const f = (p.age / 50) | 0; if (f !== p._f) { p._f = f; p.pts = jag(p.x, p.y, p.x + rnd(-p.size, p.size), p.y + rnd(-p.size, p.size), 2, 3); } poly(p.pts, f % 2 ? p.hi || '#fff' : col); break; }
		case 'bub': { const r = p.size; if (k > 0.85) { for (let i = 0; i < 4; i++) R(col, p.x + Math.cos(i * 1.57 + 0.8) * (r + 2), p.y + Math.sin(i * 1.57 + 0.8) * (r + 2)); } else { disc(p.x, p.y, r, p.sh || col); ring(p.x, p.y, r, col); R(p.hi || '#fff', p.x - 1, p.y - r + 1); } break; }
		}
		if (p.alpha) ctx.globalAlpha = 1;
	}
	function burst(x, y, n, o = {}) {
		n = Math.round(n);
		for (let i = 0; i < n; i++) {
			const a = (o.a0 ?? 0) + rnd(o.arc ?? TAU), sp = rnd(o.s0 ?? 20, o.s1 ?? 70);
			emit({ x: x + rnd(-(o.jx || 0), o.jx || 0), y: y + rnd(-(o.jy || 0), o.jy || 0), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rnd(o.l0 ?? 250, o.l1 ?? 450), ...o.p, ...(o.each ? o.each(i) : null) });
		}
	}
	const UP = { a0: Math.PI * 1.12, arc: Math.PI * 0.76 };
	function rings(x, y, cols, n = 2, r0 = 2, r1 = 16, life = 260, gap = 70, ell = 1) {
		for (let i = 0; i < n; i++) emit({ kind: 'ring', x, y, r0, r1, life, delay: i * gap, col: cols[i % cols.length], ez: ease.out, ell });
	}
	function puff(x, y, r, col, life = 130) { emit({ kind: 'disc', x, y, size: r * 0.5, grow: r * 0.5, col, life, blink: 1 }); }
	function conv(x, y, n, cols, life = 320, r0 = 26, r1 = 42, o = {}) {
		for (let i = 0; i < n; i++) {
			const a = rnd(TAU), r = rnd(r0, r1), l = life * rnd(0.7, 1);
			emit({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vx: -Math.cos(a) * r / l * 1000, vy: -Math.sin(a) * r / l * 1000, life: l, delay: rnd(life * 0.3), col: cols[i % cols.length], size: 2, shrink: 1, ...o });
		}
	}
	function star(x, y, r, cols, life = 200, n = 8) {
		const rot = rnd(TAU);
		let t = 0;
		add(dt => { t += dt; return t < life; }, () => {
			const k = t / life;
			if (k > 0.6 && ((t / 40) | 0) % 2) return;
			const rr = r * Math.min(1, k / 0.25);
			for (let i = 0; i < n; i++) {
				const a = rot + i * TAU / n, L = rr * (i % 2 ? 0.55 : 1);
				line(x + Math.cos(a) * rr * 0.3, y + Math.sin(a) * rr * 0.3, x + Math.cos(a) * L, y + Math.sin(a) * L, cols[i % 2 ? 1 : 0], i % 2 ? 1 : 2);
			}
			disc(x, y, Math.max(1, rr * 0.34 * (1 - k)), cols[0]);
		});
	}
	/** Corte curvo centrado en (x, y) con dirección ang. */
	function slash(x, y, len, ang, cols, life = 230, curve = 0.3, w = 2) {
		let t = 0;
		add(dt => { t += dt; return t < life; }, () => {
			const k = t / life;
			if (k > 0.75 && ((t / 40) | 0) % 2) return;
			const rev = Math.min(1, k / 0.3), st = k > 0.55 ? (k - 0.55) / 0.45 : 0;
			const n = Math.ceil(len * 1.4), dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
			for (let i = Math.floor(n * st); i < n * rev; i++) {
				const u = i / n - 0.5, o = (0.25 - u * u) * len * curve * 4;
				const X = x + dx * u * len + nx * o, Y = y + dy * u * len + ny * o;
				const th = Math.abs(u) < 0.32 ? w : 1;
				R(cols[1], X - th / 2 + nx * 1.5, Y - th / 2 + ny * 1.5, th, th);
				R(cols[0], X - th / 2, Y - th / 2, th, th);
			}
		});
	}
	function travel(a, b, dur, { arc = 0, ez = ease.lin, step, draw, over: ov = 0 } = {}) {
		return new Promise(res => {
			let t = 0, done = false, X = a.x, Y = a.y, K = 0;
			const fin = () => { if (!done) { done = true; pend.delete(fin); res(); } };
			pend.add(fin);
			add(dt => {
				t += dt;
				K = Math.min(1 + ov, t / dur);
				const e = K <= 1 ? ez(K) : K;
				X = lerp(a.x, b.x, e); Y = lerp(a.y, b.y, e) - Math.sin(Math.min(1, e) * Math.PI) * arc;
				step?.(X, Y, K, dt);
				if (K >= 1) fin();
				return K < 1 + ov;
			}, () => draw?.(X, Y, K));
		});
	}
	/** Chorro: partículas que salen de a durante dur y tardan tr en llegar a b. */
	function stream(a, b, dur, tr, mk, rate = 1, spread = 0.09) {
		let t = 0, acc = 1;
		const dx = b.x - a.x, dy = b.y - a.y;
		add(dt => {
			t += dt; acc += dt * rate / 16;
			while (acc >= 1) {
				acc--;
				const j = rnd(-1, 1), life = tr * rnd(0.92, 1.12);
				mk({ x: a.x, y: a.y, vx: (dx - dy * spread * j) / life * 1000, vy: (dy + dx * spread * j) / life * 1000, life });
			}
			return t < dur;
		});
		return wait(tr);
	}
	function beam(a, b, cols, dur, w) {
		let t = 0;
		add(dt => { t += dt; return t < dur; }, () => {
			const k = t / dur, g = Math.min(1, k / 0.18);
			const x1 = lerp(a.x, b.x, g), y1 = lerp(a.y, b.y, g);
			const ww = k > 0.8 ? Math.max(1, Math.round(w * (1 - k) / 0.2)) : w + (((t / 45) | 0) % 2);
			line(a.x, a.y, x1, y1, cols[2], ww + 2); line(a.x, a.y, x1, y1, cols[1], ww); line(a.x, a.y, x1, y1, cols[0], Math.max(1, ww - 2));
			disc(a.x, a.y, ww / 2 + 2, cols[0]);
			if (g >= 1) disc(b.x, b.y, ww / 2 + 2 + (((t / 40) | 0) % 2) * 2, cols[0]);
		});
		return wait(dur * 0.2);
	}
	const every = (ms, fn) => { let acc = ms; return dt => { acc += dt; while (acc >= ms) { acc -= ms; fn(); } }; };

	// ---------- Lenguaje de cada tipo: chispa suelta, impacto y proyectil ----------
	const SPK = {
		Normal: (x, y) => emit({ x, y, vx: rnd(-20, 20), vy: rnd(-20, 20), life: 200, col: '#fff', size: 1 }),
		Fire: (x, y) => emit({ x, y, vx: rnd(-14, 14), vy: rnd(-70, -25), life: rnd(280, 480), ramp: RAMP.Fire, size: 2, shrink: 1 }),
		Water: (x, y) => emit({ x, y, vx: rnd(-30, 30), vy: rnd(-60, -15), ay: 230, life: 400, col: Math.random() < 0.3 ? '#fff' : RAMP.Water[1], size: Math.random() < 0.4 ? 2 : 1 }),
		Grass: (x, y) => emit({ kind: 'bm', bm: BM.leaf, spin: 70, f: rnd(4) | 0, x, y, vx: rnd(-40, 40), vy: rnd(-35, 10), ay: 50, life: 520, col: RAMP.Grass[1], hi: RAMP.Grass[0], blink: 1 }),
		Electric: (x, y) => emit({ kind: 'zap', x, y, size: 6, life: 150, col: RAMP.Electric[1], hi: '#fff' }),
		Ice: (x, y) => emit({ kind: 'bm', bm: BM.star4, spin: 80, x, y, vx: rnd(-22, 22), vy: rnd(-22, 22), life: 380, col: RAMP.Ice[1], hi: '#fff', blink: 1 }),
		Fighting: (x, y) => { const a = rnd(TAU); emit({ kind: 'line', x, y, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, len: 4, life: 170, col: RAMP.Fighting[1], shrink: 1 }); },
		Poison: (x, y) => emit({ kind: 'bub', x, y, vx: rnd(-8, 8), vy: rnd(-34, -16), wob: 14, ph: rnd(600), life: rnd(380, 560), size: rnd(1, 2.6) | 0, col: RAMP.Poison[0], sh: RAMP.Poison[2], hi: '#fff' }),
		Ground: (x, y) => emit({ x, y, vx: rnd(-40, 40), vy: rnd(-70, -20), ay: 260, life: 430, col: RAMP.Ground[(rnd(3)) | 0], size: Math.random() < 0.4 ? 2 : 1 }),
		Flying: (x, y) => emit({ kind: 'bm', bm: BM.feather, spin: 160, x, y, vx: rnd(-24, 24), vy: rnd(6, 30), wob: 30, ph: rnd(600), life: 600, col: '#fff', hi: RAMP.Flying[1], sh: RAMP.Flying[2], blink: 1 }),
		Psychic: (x, y) => emit({ kind: 'ring', x, y, r0: 1, r1: 4, life: 280, col: RAMP.Psychic[(rnd(2)) | 0] }),
		Bug: (x, y) => emit({ x, y, vx: rnd(-30, 30), vy: rnd(-30, 30), jit: 9, life: 380, col: Math.random() < 0.5 ? RAMP.Bug[0] : RAMP.Bug[1], size: 1 }),
		Rock: (x, y) => emit({ kind: 'bm', bm: BM.rock, x, y, vx: rnd(-36, 36), vy: rnd(-70, -30), ay: 300, life: 480, col: RAMP.Rock[1], hi: RAMP.Rock[0], sh: RAMP.Rock[3], blink: 1 }),
		Ghost: (x, y) => emit({ x, y, vx: rnd(-10, 10), vy: rnd(-34, -12), wob: 26, ph: rnd(600), life: 520, ramp: [RAMP.Ghost[0], RAMP.Ghost[1], RAMP.Ghost[2]], size: 3, shrink: 1 }),
		Dragon: (x, y) => emit({ x, y, vx: rnd(-18, 18), vy: rnd(-55, -20), wob: 22, ph: rnd(600), life: 420, ramp: ['#e0e8ff', '#70a0ff', '#7060f8', '#9030d0', '#501890'], size: 2, shrink: 1 }),
		Dark: (x, y) => { const a = rnd(TAU); emit({ kind: 'line', x, y, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, len: 5, life: 240, col: Math.random() < 0.3 ? RAMP.Dark[0] : RAMP.Dark[2], shrink: 1 }); },
		Steel: (x, y) => emit({ kind: 'line', x, y, vx: rnd(-60, 60), vy: rnd(-80, -20), ay: 320, len: 3, life: 300, ramp: ['#fff', '#fff8c0', RAMP.Steel[2]] }),
		Fairy: (x, y) => emit({ kind: 'bm', bm: BM.star4, spin: 90, f: rnd(4) | 0, x, y, vx: rnd(-16, 16), vy: rnd(-34, -8), life: 480, col: RAMP.Fairy[Math.random() < 0.5 ? 1 : 2], hi: '#fff', blink: 1 }),
	};
	const sprinkle = (type, x, y, n, jx = 8, jy = 8) => { for (let i = 0; i < n; i++) (SPK[type] || SPK.Normal)(x + rnd(-jx, jx), y + rnd(-jy, jy)); };

	const IMPACT = {
		Normal(x, y, pw) { star(x, y, 12 * pw, ['#fff', '#ece6d2']); burst(x, y, 7 * pw, { s0: 60, s1: 120, p: { kind: 'line', len: 4, col: '#fff', life: 180, shrink: 1 } }); },
		Fire(x, y, pw, c) {
			puff(x, y, 8 * pw, c[0], 110);
			burst(x, y + 5, 18 * pw, { ...UP, s0: 25, s1: 90 * pw, jx: 7, l0: 300, l1: 580, p: { ramp: c, size: 3, shrink: 1, ay: -70 } });
			burst(x, y + 2, 5 * pw, { ...UP, s0: 10, s1: 30, jx: 5, p: { kind: 'disc', ramp: [c[0], c[1], c[2], c[3]], size: 3, shrink: 1, ay: -90, life: 380 } });
			rings(x, y, [c[1]], 1, 3, 13 * pw, 200);
		},
		Water(x, y, pw, c) {
			burst(x, y, 14 * pw, { ...UP, s0: 50, s1: 120 * pw, p: { ay: 330, life: 480, col: c[1], size: 2 }, each: i => i % 3 ? null : { col: '#fff', size: 1 } });
			rings(x, y + 6, ['#fff', c[1]], 2, 3, 15 * pw, 280, 70, 0.4);
			puff(x, y, 6 * pw, c[0], 100);
		},
		Grass(x, y, pw, c) {
			burst(x, y, 9 * pw, { s0: 40, s1: 100, p: { kind: 'bm', bm: BM.leaf, spin: 60, ay: 90, life: 500, col: c[1], hi: c[0], blink: 1 }, each: i => ({ f: i }) });
			slash(x, y, 16 * pw, -0.8, [c[0], c[2]], 200); slash(x, y, 16 * pw, 0.8 + Math.PI, [c[0], c[2]], 200);
		},
		Electric(x, y, pw, c) {
			puff(x, y, 7 * pw, '#fff', 90);
			let t = 0, pts = [];
			const re = every(55, () => { pts = [0, 1, 2, 3, 4].map(() => { const a = rnd(TAU), r = rnd(9, 17) * pw; return jag(x, y, x + Math.cos(a) * r, y + Math.sin(a) * r, 3, 4); }); });
			add(dt => { t += dt; re(dt); return t < 240; }, () => { const f = ((t / 55) | 0) % 2; for (const p of pts) poly(p, f ? '#fff' : c[1]); });
			burst(x, y, 6 * pw, { s0: 20, s1: 60, p: { kind: 'zap', size: 5, life: 200, col: c[1] } });
		},
		Ice(x, y, pw, c) {
			let t = 0;
			add(dt => { t += dt; return t < 300; }, () => {
				const k = t / 300; if (k > 0.7 && ((t / 40) | 0) % 2) return;
				const r = 13 * pw * Math.min(1, k / 0.3);
				for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + 0.26; const ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r; line(x, y, ex, ey, i % 2 ? c[1] : '#fff'); R('#fff', x + Math.cos(a + 0.5) * r * 0.6, y + Math.sin(a + 0.5) * r * 0.6); R(c[2], x + Math.cos(a - 0.5) * r * 0.6, y + Math.sin(a - 0.5) * r * 0.6); }
			});
			burst(x, y, 7 * pw, { s0: 40, s1: 100, p: { kind: 'bm', bm: BM.shard, col: c[1], hi: '#fff', sh: c[3], life: 380, ay: 120, blink: 1 }, each: i => ({ f: i }) });
			rings(x, y + 7, [c[1]], 1, 3, 14, 320, 0, 0.35);
		},
		Fighting(x, y, pw, c) { star(x, y, 15 * pw, ['#fff', c[1]], 220, 10); rings(x, y, [c[1], c[2]], 2, 4, 20 * pw, 260, 80); burst(x, y, 6, { s0: 70, s1: 130, p: { kind: 'line', len: 5, col: c[0], life: 170, shrink: 1 } }); },
		Poison(x, y, pw, c) {
			emit({ kind: 'disc', x, y, size: 3, grow: 5 * pw, col: c[2], life: 220, blink: 1 }); emit({ kind: 'disc', x: x - 1, y: y - 1, size: 2, grow: 3 * pw, col: c[1], life: 200 });
			for (let i = 0; i < 9 * pw; i++) emit({ kind: 'bub', x: x + rnd(-9, 9), y: y + rnd(-4, 8), vx: rnd(-10, 10), vy: rnd(-50, -20), wob: 16, ph: rnd(600), delay: rnd(160), life: rnd(360, 560), size: (rnd(1, 3.4)) | 0, col: c[0], sh: c[2] });
			burst(x, y, 6, { a0: 0.3, arc: 2.5, s0: 20, s1: 50, p: { ay: 260, col: c[1], size: 2, life: 380 } });
		},
		Ground(x, y, pw, c) {
			const fy = y + 9;
			for (let i = 0; i < 6 * pw; i++) emit({ kind: 'disc', x: x + rnd(-12, 12), y: fy + rnd(-3, 1), vx: rnd(-28, 28), vy: rnd(-22, -6), drag: 2.5, size: rnd(3, 5), shrink: 1, col: c[i % 2 ? 0 : 1], life: rnd(380, 560) });
			burst(x, fy, 10 * pw, { ...UP, s0: 50, s1: 110, p: { ay: 320, col: c[2], size: 2, life: 460 }, each: i => i % 2 ? { col: c[3], size: 1 } : null });
			const cr = [-1, 1].map(s => jag(x, fy, x + s * rnd(12, 18) * pw, fy + rnd(-2, 3), 2, 4));
			let t = 0; add(dt => { t += dt; return t < 380; }, () => { for (const p of cr) poly(p, c[3], 1, Math.min(1, t / 120)); });
		},
		Flying(x, y, pw, c) {
			slash(x, y - 2, 20 * pw, -0.5, ['#fff', c[2]], 220, 0.4); slash(x, y + 3, 16 * pw, -0.5, ['#fff', c[2]], 240, 0.4);
			burst(x, y, 5, { s0: 20, s1: 50, p: { kind: 'bm', bm: BM.feather, spin: 140, wob: 30, ay: 60, life: 620, col: '#fff', hi: c[1], sh: c[2], blink: 1 } });
			burst(x, y, 5, { a0: -0.8, arc: 0.6, s0: 80, s1: 140, p: { kind: 'line', len: 7, col: c[1], life: 200, shrink: 1 } });
		},
		Psychic(x, y, pw, c) {
			for (let i = 0; i < 3; i++) emit({ kind: 'ring', x, y, r0: 22 * pw, r1: 2, life: 300, delay: i * 80, col: [c[1], c[2], '#fff'][i], ez: ease.in, w: i === 2 ? 1 : 2 });
			after(300, () => { puff(x, y, 6, '#fff', 90); burst(x, y, 6, { s0: 30, s1: 70, p: { kind: 'bm', bm: BM.star4, spin: 70, col: c[1], hi: '#fff', life: 260, blink: 1 } }); });
		},
		Bug(x, y, pw, c) {
			for (let i = 0; i < 18 * pw; i++) { const a = rnd(TAU), r = rnd(6, 15); emit({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vx: -Math.sin(a) * 60, vy: Math.cos(a) * 60, jit: 12, drag: 1.5, life: rnd(300, 480), col: i % 3 ? c[1] : c[0], size: i % 4 ? 1 : 2 }); }
			slash(x, y, 13 * pw, 0.8, [c[0], c[2]], 180, 0); slash(x, y, 13 * pw, -0.8, [c[0], c[2]], 180, 0);
		},
		Rock(x, y, pw, c) {
			burst(x, y + 3, 7 * pw, { ...UP, s0: 50, s1: 110, p: { kind: 'bm', bm: BM.rock, ay: 340, life: 480, col: c[1], hi: c[0], sh: c[3], blink: 1 } });
			for (let i = 0; i < 4; i++) emit({ kind: 'disc', x: x + rnd(-10, 10), y: y + 8, vx: rnd(-24, 24), vy: rnd(-16, -4), drag: 2.5, size: 4, shrink: 1, col: c[0], life: 420 });
			star(x, y, 9 * pw, [c[0], c[2]], 150, 6);
		},
		Ghost(x, y, pw, c) {
			emit({ kind: 'disc', x, y, size: 9 * pw, shrink: 1, col: c[3], life: 260, alpha: 0.75 });
			let t = 0; const ph = rnd(TAU);
			add(dt => {
				t += dt; const k = t / 420, r = lerp(18 * pw, 3, ease.io(k));
				for (let i = 0; i < 4; i++) { const a = ph + i * TAU / 4 + k * 7; emit({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r * 0.75, life: 200, ramp: [c[0], c[1], c[2]], size: 2, shrink: 1 }); }
				return t < 420;
			});
			after(420, () => rings(x, y, [c[0], c[1]], 2, 2, 12, 200, 50));
		},
		Dragon(x, y, pw, c) {
			let t = 0; const ph = rnd(TAU), rp = ['#e0e8ff', '#70a0ff', '#7060f8', '#9030d0', '#501890'];
			add(dt => {
				t += dt; const k = t / 300, r = lerp(2, 19 * pw, ease.out(k));
				for (let i = 0; i < 3; i++) { const a = ph + i * TAU / 3 + k * 6; emit({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vy: -30, life: 260, ramp: rp, size: 3, shrink: 1 }); }
				return t < 300;
			});
			puff(x, y, 7 * pw, '#e0e8ff', 110); rings(x, y, [c[1], c[2]], 2, 3, 18 * pw, 280, 90);
		},
		Dark(x, y, pw, c) {
			emit({ kind: 'disc', x, y, size: 10 * pw, shrink: 1, col: '#000', life: 200, alpha: 0.55 });
			for (let i = -1; i <= 1; i++) { const ox = i * 5, oy = i * 4; slash(x + ox, y + oy, 20 * pw, 2.2, [c[2], c[0]], 240 + i * 20, 0.12, 2); }
			burst(x, y, 8, { s0: 40, s1: 90, p: { kind: 'line', len: 5, col: c[2], life: 260, shrink: 1 }, each: i => i % 3 ? null : { col: c[0] } });
		},
		Steel(x, y, pw, c) {
			let t = 0; add(dt => { t += dt; return t < 170; }, () => { const k = t / 170, o = lerp(-12, 12, k) * pw; line(x - 9 + o, y + 9, x + 9 + o, y - 9, '#fff', 2); line(x - 12 + o, y + 9, x + 6 + o, y - 9, c[1]); });
			for (let i = 0; i < 4; i++) emit({ kind: 'bm', bm: BM.star4, spin: 55, x: x + rnd(-11, 11), y: y + rnd(-11, 11), delay: i * 45, life: 220, col: '#fff', hi: '#fff8c0' });
			burst(x, y, 10 * pw, { ...UP, s0: 60, s1: 130, p: { kind: 'line', len: 3, ay: 360, life: 340, ramp: ['#fff', '#fff8c0', '#ffd060', c[2]] } });
			rings(x, y, [c[1]], 1, 3, 12 * pw, 180);
		},
		Fairy(x, y, pw, c) {
			burst(x, y, 9 * pw, { s0: 40, s1: 95, p: { kind: 'bm', bm: BM.star4, spin: 80, drag: 2, life: 480, col: c[2], hi: '#fff', blink: 1 }, each: i => ({ f: i, col: i % 2 ? c[1] : c[2] }) });
			emit({ kind: 'bm', bm: BM.star5, x, y, col: '#fff', life: 200, blink: 1 });
			burst(x, y, 14, { s0: 10, s1: 50, p: { col: c[1], size: 1, life: 520, ay: 30 } });
			rings(x, y, [c[1], '#fff'], 2, 3, 16 * pw, 300, 90);
		},
	};
	const impact = (type, x, y, pw) => (IMPACT[type] || IMPACT.Normal)(x, y, pw * 1.35, RAMP[type] || RAMP.Normal);

	const orb = (c, r = 5) => (x, y) => { disc(x, y, r + 1, c[2]); disc(x, y, r, c[1]); disc(x - 1, y - 1, Math.max(1, r - 2), c[0]); };
	const trailOf = (type, ms = 26) => { let px_ = 0, py_ = 0; const f = every(ms, () => SPK[type](px_ + rnd(-2, 2), py_ + rnd(-2, 2))); return (x, y, k, dt) => { px_ = x; py_ = y; f(dt); }; };

	// Proyectil por defecto de cada tipo: (a, b, pw, c) → promesa que se cumple al llegar
	const SHOT = {
		Normal: (a, b, pw, c) => travel(a, b, 240, { step: trailOf('Normal', 18), draw: (x, y) => { bmp(BM.star5[0], x, y, '#fff', c[1], '#fff', 2); } }),
		Fire: (a, b, pw, c) => stream(a, b, 300, 250, o => emit({ ...o, kind: 'disc', ramp: ['#fff', c[0], c[1], c[2], c[3]], size: rnd(1.5, 3), grow: 1.5 }), 3.2, 0.1),
		Water: (a, b, pw, c) => stream(a, b, 240, 240, o => emit({ ...o, col: Math.random() < 0.25 ? '#fff' : c[(rnd(1, 3)) | 0], size: Math.random() < 0.3 ? 3 : 2 }), 4.5, 0.06),
		Grass: (a, b) => { for (let i = 1; i < 5; i++) after(i * 45, () => leafShot(a, b, i)); return leafShot(a, b, 0); },
		Electric: (a, b, pw, c) => {
			let t = 0, pts = jag(a.x, a.y, b.x, b.y, 6, 9);
			const re = every(60, () => { pts = jag(a.x, a.y, b.x, b.y, 6, 9); });
			add(dt => { t += dt; re(dt); return t < 260; }, () => { const f = ((t / 60) | 0) % 2; poly(pts, c[2], 5, Math.min(1, t / 70)); poly(pts, f ? '#fff' : c[1], 2, Math.min(1, t / 70)); });
			return wait(90);
		},
		Ice: (a, b, pw, c) => { const one = d => travel({ x: a.x + rnd(-3, 3), y: a.y + rnd(-3, 3) }, { x: b.x + rnd(-5, 5), y: b.y + rnd(-5, 5) }, 200, { step: ((x, y) => { if (Math.random() < 0.4) emit({ x, y, life: 160, col: '#fff', size: 1 }); }), draw: (x, y) => bmp(BM.shard[a.x < b.x ? 1 : 3], x, y, c[1], '#fff', c[3], 2) }); for (let i = 1; i < 6; i++) after(i * 50, () => one()); return one(); },
		Fighting: (a, b, pw, c) => travel(a, b, 230, { step: trailOf('Fighting', 30), draw: orb(c, 5) }),
		Poison: (a, b, pw, c) => { const one = () => travel(a, { x: b.x + rnd(-4, 4), y: b.y + rnd(-4, 4) }, 300, { arc: 20, step: (x, y) => { if (Math.random() < 0.25) emit({ x, y, vy: 30, life: 220, col: c[1], size: 1 }); }, draw: (x, y) => { disc(x, y, 5, c[2]); ring(x, y, 5, c[0]); R('#fff', x - 2, y - 3, 2, 2); } }); after(70, one); after(140, one); return one(); },
		Ground: (a, b, pw, c) => {
			const A = { x: a.x, y: a.fy - 2 }, B = { x: b.x, y: b.fy - 2 }, pts = jag(A.x, A.y, B.x, B.y, 3, 6);
			let t = 0;
			add(dt => { t += dt; return t < 520; }, () => { if (t > 400 && ((t / 40) | 0) % 2) return; poly(pts, c[3], 2, Math.min(1, t / 260)); poly(pts, '#201008', 1, Math.min(1, t / 260)); });
			return travel(A, B, 260, { step: (x, y) => { if (Math.random() < 0.6) SPK.Ground(x, y); } });
		},
		Flying: (a, b, pw, c) => gust(a, b, c, 'Flying'),
		Psychic: (a, b, pw, c) => { const one = i => travel(a, b, 260, { draw: (x, y, k) => { ring(x, y, 4 + k * 7, i % 2 ? c[1] : c[2], 1, 2); ring(x, y, 2 + k * 4, '#fff'); } }); after(70, () => one(1)); after(140, () => one(2)); return one(0); },
		Bug: (a, b, pw, c) => travel(a, b, 300, { step: (x, y) => { for (let i = 0; i < 4; i++) emit({ x: x + rnd(-10, 10), y: y + rnd(-10, 10), vx: rnd(-40, 40), vy: rnd(-40, 40), jit: 12, life: 200, col: Math.random() < 0.5 ? c[0] : c[1], size: Math.random() < 0.25 ? 2 : 1 }); } }),
		Rock: (a, b, pw, c) => rockfall(b, 4, c, BM.rockL, 230),
		Ghost: (a, b, pw, c) => travel(a, b, 280, { arc: 8, step: trailOf('Ghost', 30), draw: (x, y) => { disc(x, y, 6, c[3]); ring(x, y, 6, c[1]); ring(x, y, 3, c[2]); disc(x - 2, y - 2, 1, c[0]); } }),
		Dragon: (a, b, pw, c) => {
			const d = Math.hypot(b.x - a.x, b.y - a.y) || 1, nx = -(b.y - a.y) / d, ny = (b.x - a.x) / d, rp = ['#e0e8ff', '#70a0ff', '#7060f8', '#9030d0', '#501890'];
			return travel(a, b, 290, { step: (x, y, k) => { for (const s of [1, -1]) { const o = Math.sin(k * 16) * 6 * s; emit({ x: x + nx * o, y: y + ny * o, life: 260, ramp: rp, size: 3, shrink: 1 }); } }, draw: (x, y) => { disc(x, y, 5, c[1]); disc(x, y, 2, '#fff'); } });
		},
		Dark: (a, b, pw, c) => { const ang = Math.atan2(b.y - a.y, b.x - a.x); const one = () => travel(a, b, 220, { draw: (x, y, k) => { const r = 7 + k * 6; for (let i = -r; i <= r; i++) { const u = i / r, o = (1 - u * u) * 4; R(c[2], x - Math.sin(ang) * i + Math.cos(ang) * o, y + Math.cos(ang) * i + Math.sin(ang) * o, 2, 2); R(c[0], x - Math.sin(ang) * i + Math.cos(ang) * (o + 2), y + Math.cos(ang) * i + Math.sin(ang) * (o + 2)); } } }); after(80, one); return one(); },
		Steel: (a, b, pw, c) => { let X = a.x, Y = a.y; return travel(a, b, 190, { step: (x, y) => { X = x; Y = y; if (Math.random() < 0.5) emit({ kind: 'bm', bm: BM.star4, x: x + rnd(-3, 3), y: y + rnd(-3, 3), life: 150, col: '#fff', hi: '#fff8c0' }); }, draw: (x, y) => { const k = 0.35; line(lerp(x, a.x, k), lerp(y, a.y, k), x, y, c[2], 3); line(lerp(x, a.x, k), lerp(y, a.y, k), x, y, '#fff', 1); bmp(BM.star4[1], x, y, '#fff', '#fff', '#fff', 2); } }); },
		Fairy: (a, b, pw, c) => { const one = i => travel(a, { x: b.x + rnd(-4, 4), y: b.y + rnd(-4, 4) }, 300, { arc: 12 + i * 7, step: (x, y) => { if (Math.random() < 0.5) emit({ x: x + rnd(-2, 2), y: y + rnd(-2, 2), vy: 14, life: 300, col: c[(rnd(1, 3)) | 0], size: 1 }); }, draw: (x, y, k) => bmp(BM.star4[1 + (((k * 8) | 0) % 2) * 2], x, y, c[2], '#fff', c[2], 2) }); after(60, () => one(1)); after(120, () => one(2)); return one(0); },
	};
	function leafShot(a, b, i) {
		const d = Math.hypot(b.x - a.x, b.y - a.y) || 1, nx = -(b.y - a.y) / d, ny = (b.x - a.x) / d, ph = i * 1.9, c = RAMP.Grass;
		let age = 0;
		return travel(a, { x: b.x + rnd(-4, 4), y: b.y + rnd(-4, 4) }, 260, { step: (x, y, k, dt) => { age += dt; }, draw: (x, y, k) => { const o = Math.sin(k * 9 + ph) * 7 * (1 - k); bmp(BM.leaf[((age / 50) | 0) % 4], x + nx * o, y + ny * o, c[1], c[0], c[2], 2); } });
	}
	function gust(a, b, c, type) {
		const d = Math.hypot(b.x - a.x, b.y - a.y) || 1, nx = -(b.y - a.y) / d, ny = (b.x - a.x) / d, ang = Math.atan2(b.y - a.y, b.x - a.x);
		const one = i => { const off = (i - 2) * 5; return travel({ x: a.x + nx * off, y: a.y + ny * off }, { x: b.x + nx * off, y: b.y + ny * off }, 250, { step: (x, y) => { if (Math.random() < 0.12) SPK[type](x, y); }, draw: (x, y, k) => { const L = 20; for (let j = 0; j < L; j++) { const u = j / L, cu = Math.sin(u * Math.PI + i) * 4; R(j < 5 ? '#fff' : c[1], x - Math.cos(ang) * j + nx * cu, y - Math.sin(ang) * j + ny * cu, 2, 2); } } }); };
		for (let i = 1; i < 5; i++) after(i * 40, () => one(i));
		return one(0);
	}
	function rockfall(b, n, c, bm, dur, spreadX = 9) {
		const one = big => { const x = b.x + rnd(-spreadX, spreadX), y1 = b.y + rnd(-2, 8); return travel({ x: x + rnd(-10, 10), y: -8 }, { x, y: y1 }, dur, { ez: ease.in, draw: (X, Y) => bmp(bm[0], X, Y, c[1], c[0], c[3], big ? 2 : 1) }).then(() => { if (dead) return; for (let i = 0; i < 3; i++) emit({ kind: 'disc', x: x + rnd(-4, 4), y: y1 + 3, vx: rnd(-22, 22), vy: rnd(-14, -2), drag: 2.5, size: 3, shrink: 1, col: c[0], life: 340 }); burst(x, y1, 3, { ...UP, s0: 40, s1: 90, p: { kind: 'bm', bm: BM.rock, ay: 340, life: 380, col: c[1], hi: c[0], sh: c[3], blink: 1 } }); }); };
		for (let i = 1; i < n; i++) after(i * 70, () => one(false));
		return one(n > 5);
	}

	// ---------- Sprites ----------
	const mkS = () => ({ x: 0, y: 0, sx: 1, sy: 1, rot: 0, op: 1, base: 1, gone: true, f: '' });
	const ST = { p1: mkS(), p2: mkS() };
	function apply(side) {
		const s = ST[side], el = spriteOf(side);
		el.style.transform = `translate(${(s.x * SCALE).toFixed(1)}px,${(s.y * SCALE).toFixed(1)}px) rotate(${s.rot.toFixed(1)}deg) scale(${(s.base * s.sx).toFixed(3)},${(s.base * s.sy).toFixed(3)})`;
		el.style.opacity = s.op;
		el.style.filter = s.f;
	}
	const setF = (side, f) => { ST[side].f = f; apply(side); };
	const front = (side, on) => spriteOf(side).classList.toggle('fx-front', on);
	function tw(side, to, dur, ez = ease.out) {
		const s = ST[side], from = {};
		for (const k in to) from[k] = s[k];
		if (dead) { Object.assign(s, to); return Promise.resolve(); }
		return new Promise(res => {
			let t = 0, done = false;
			const fin = () => { if (!done) { done = true; pend.delete(fin); res(); } };
			pend.add(fin);
			add(dt => {
				t += dt;
				const k = Math.min(1, t / dur), e = ez(k);
				for (const p in to) s[p] = lerp(from[p], to[p], e);
				apply(side);
				if (k >= 1) { fin(); return false; }
				return true;
			});
		});
	}
	function blink(side, n) {
		const s = ST[side]; let t = 0;
		add(dt => { t += dt; if (s.gone) return false; s.op = t >= n * 110 ? 1 : ((t / 55) | 0) % 2 ? 1 : 0.15; apply(side); return t < n * 110; });
	}
	/** Centro, pies y tamaño visibles del sprite, en píxeles del lienzo. */
	function pos(side) {
		const el = spriteOf(side), b = Math.min(ST[side].base, 1.3);
		const x = el.offsetLeft / SCALE, y = el.offsetTop / SCALE, w = el.offsetWidth / SCALE, hh = el.offsetHeight / SCALE;
		return { x: x + w / 2, y: y + hh - hh * 0.38 * b, fy: y + hh, top: y + hh - hh * 0.74 * b, w: w * 0.6 * b, h: hh * 0.74 * b };
	}
	function reset(side) { Object.assign(ST[side], mkS(), { gone: false }); front(side, false); apply(side); }
	function dust(x, y, n = 8, w = 10, col = '#e0d8c8') {
		for (let i = 0; i < n; i++) emit({ kind: 'disc', x: x + rnd(-w, w), y: y + rnd(-2, 1), vx: rnd(-30, 30), vy: rnd(-20, -4), drag: 2.5, size: rnd(2, 4), shrink: 1, col, life: rnd(320, 520) });
	}

	// ---------- Rótulos (DOM, por encima de las tarjetas) ----------
	function label(side, text, cls = '') {
		const el = mkEl('div', 'fx-lbl ' + cls);
		el.textContent = text;
		const sp = spriteOf(side);
		const num = /num/.test(cls);
		const x = sp.offsetLeft + sp.offsetWidth / 2 + (num ? rnd(-26, 26) : 0);
		const y = side === 'p2' ? sp.offsetTop + sp.offsetHeight * (num ? 0.45 : 1) + 8 : sp.offsetTop + sp.offsetHeight * (num ? 0.42 : 0.2);
		el.style.left = clamp(x, 70, field.clientWidth - 70) + 'px'; el.style.top = y + 'px';
		over.append(el);
		setTimeout(() => el.remove(), 1000);
	}
	function number(side, n) { if (settings().dmgNumbers !== false && n) label(side, (n > 0 ? '+' : '−') + Math.abs(n), n > 0 ? 'num heal' : 'num'); }
	function critLines() { const el = mkEl('div', 'fx-crit'); over.append(el); setTimeout(() => el.remove(), 380); }

	// ---------- Reacción al golpe ----------
	async function react(side, dmg, eff, crit) {
		const s = ST[side];
		if (s.gone) return;
		const dir = side === 'p2' ? { x: 1, y: -0.55 } : { x: -1, y: 0.55 };
		if (eff > 0 && eff < 1) { // golpe apagado
			setF(side, 'brightness(.75)');
			await tw(side, { x: dir.x * 1.5, y: dir.y * 1.5 }, 60);
			setF(side, '');
			await tw(side, { x: 0, y: 0 }, 110, ease.io);
			return;
		}
		const big = dmg >= 0.4 || (eff > 1 && dmg >= 0.2) || crit, small = dmg < 0.12 && !big;
		const kb = small ? 2 : big ? 9 + Math.min(5, dmg * 6) : 5;
		setF(side, WHITE);
		if (big) { shake(dmg >= 0.5 || eff > 1 ? 4 : 2.5, 280); flash('#fff', eff > 1 ? 0.6 : 0.4, 240); }
		else if (!small) shake(1.2, 140);
		await tw(side, { x: dir.x * kb, y: dir.y * kb, sx: big ? 0.9 : 1, sy: big ? 1.08 : 1 }, 70);
		setF(side, '');
		blink(side, small ? 1 : big ? 3 : 2);
		await tw(side, { x: 0, y: 0, sx: 1, sy: 1 }, big ? 240 : 140, ease.io);
	}
	/** Daño que no viene de un ataque directo (retroceso, trampas, clima…). */
	async function hurt(side, frac = 0.1) {
		if (ST[side].gone) return;
		if (off()) { await sleep(200); return; }
		const d = side === 'p2' ? 1 : -1;
		blink(side, 1);
		await tw(side, { x: d * 2 }, 50); await tw(side, { x: -d * 2 }, 70); await tw(side, { x: 0 }, 60);
		if (frac > 0.3) shake(1.5, 150);
	}

	// ---------- Marcas de contacto por familia ----------
	function mark(fam, type, b, pw, side) {
		const c = RAMP[type], dirX = side === 'p2' ? 1 : -1;
		switch (fam) {
		case 'punch':
			emit({ kind: 'bm', bm: BM.fist, x: b.x - dirX * 4, y: b.y, vx: dirX * 60, drag: 6, col: c[1], hi: c[0], sh: c[2], life: 190, sc: pw > 1.1 ? 2 : 1, blink: 1 });
			star(b.x, b.y, 12 * pw, ['#fff', c[1]], 190); impact(type, b.x, b.y, pw * 0.8); break;
		case 'kick':
			slash(b.x, b.y, 22 * pw, dirX > 0 ? 2.4 : 0.7, ['#fff', c[1]], 200, 0.1, 3); star(b.x, b.y + 4, 10 * pw, ['#fff', c[1]], 180, 6); impact(type, b.x, b.y, pw * 0.75); break;
		case 'claw':
			for (let i = -1; i <= 1; i++) slash(b.x + i * 5, b.y + i * 3, 19 * pw, 2.15, ['#fff', c[1]], 230, 0.1, 2);
			sprinkle(type, b.x, b.y, 5 * pw); break;
		case 'slice':
			slash(b.x, b.y, 28 * pw, dirX > 0 ? 2.3 : 0.85, ['#fff', c[1]], 260, 0.35, 3); sprinkle(type, b.x, b.y, 6 * pw); rings(b.x, b.y, [c[1]], 1, 3, 12, 180); break;
		case 'bite': {
			let t = 0;
			add(dt => { t += dt; return t < 260; }, () => {
				const k = Math.min(1, t / 110), gap = lerp(13, 1, ease.in(k));
				if (t > 200 && ((t / 30) | 0) % 2) return;
				for (let i = -2; i <= 2; i++) for (let j = 0; j < 5; j++) { const w = 5 - j; if (w <= 0) continue; R(j < 2 ? '#fff' : c[0], b.x + i * 5 - w / 2, b.y - gap - 5 + j, w, 1); R(j < 2 ? '#fff' : c[0], b.x + i * 5 + 2.5 - w / 2, b.y + gap + 5 - j, w, 1); }
			});
			after(110, () => impact(type, b.x, b.y, pw * 0.8)); break;
		}
		case 'tail': slash(b.x, b.y + 2, 30 * pw, dirX > 0 ? 3.0 : 0.15, [c[0], c[1]], 240, 0.5, 3); impact(type, b.x, b.y, pw * 0.7); break;
		case 'horn': burst(b.x, b.y, 7, { a0: dirX > 0 ? -0.9 : 2.2, arc: 0.9, s0: 70, s1: 140, p: { kind: 'line', len: 7, col: '#fff', life: 170, shrink: 1 } }); star(b.x, b.y, 9 * pw, ['#fff', c[1]], 170, 6); impact(type, b.x, b.y, pw * 0.7); break;
		default: impact(type, b.x, b.y, pw);
		}
	}

	// ---------- Movimientos ----------
	async function dash(A, a, b, type, k = 0.68) {
		front(A, true);
		const dx = (b.x - a.x) * k, dy = (b.y - a.y) * k, sc = A === 'p1' ? 0.84 : 1.16, s = ST[A];
		await tw(A, { x: -dx * 0.07, y: -dy * 0.07, sx: 1.1, sy: 0.9 }, 80);
		let on = true;
		const tr = every(22, () => { (SPK[type] || SPK.Normal)(a.x + s.x + rnd(-5, 5), a.y + s.y + rnd(-7, 7)); emit({ kind: 'line', x: a.x + s.x + rnd(-6, 6), y: a.y + s.y + rnd(-8, 8), vx: -dx, vy: -dy, len: 9, life: 150, col: RAMP[type][1], shrink: 1 }); });
		add(dt => { if (on) tr(dt); return on; });
		await tw(A, { x: dx, y: dy, sx: sc, sy: sc }, 150, ease.in);
		on = false;
	}
	async function goBack(A) { await tw(A, { x: 0, y: 0, sx: 1, sy: 1, rot: 0 }, 180, ease.out); front(A, false); }
	async function nudge(A, a, b, amt = 3) {
		const d = Math.hypot(b.x - a.x, b.y - a.y) || 1, ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
		await tw(A, { x: -ux * 2, y: -uy * 2, sx: 1.06, sy: 0.94 }, 70);
		tw(A, { x: ux * amt, y: uy * amt, sx: 1, sy: 1 }, 70).then(() => tw(A, { x: 0, y: 0 }, 160, ease.io));
	}
	function shield(p, cols) {
		let t = 0;
		add(dt => { t += dt; return t < 520; }, () => {
			if (t > 400 && ((t / 40) | 0) % 2) return;
			const r = p.h * 0.62 * Math.min(1, t / 120);
			const pts = []; for (let i = 0; i <= 6; i++) { const a = i * TAU / 6 + Math.PI / 6; pts.push([p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * 1.05]); }
			poly(pts, cols[1], 2); poly(pts, cols[0], 1);
			const sx = p.x - r + ((t / 3) % (r * 2)); line(sx, p.y - r * 0.5, sx - 4, p.y + r * 0.5, cols[0]);
		});
	}

	async function statusMove(e, m, a, b) {
		const A = e.side, c = RAMP[m.type], p = m.tside === A ? a : b;
		if (e.still) { conv(a.x, a.y, 14, c, 300); await wait(320); return; }
		await tw(A, { sx: 1.06, sy: 0.94 }, 70); tw(A, { sx: 1, sy: 1 }, 140);
		if (e.fail || e.miss || e.immune || e.blocked) {
			if (e.blocked) shield(b, ['#fff', '#78e8c8']);
			else puff(p.x, p.y, 5, '#b8b8b8', 160);
			await wait(220); return;
		}
		switch (m.fam) {
		case 'protect': shield(a, ['#fff', '#78e8c8']); rings(a.x, a.y, ['#78e8c8'], 1, 4, a.h * 0.7, 300); await wait(380); break;
		case 'screen': {
			const col = m.id === 'reflect' ? ['#fff', '#ffb878'] : m.id === 'lightscreen' ? ['#fff', '#fff078'] : m.id === 'auroraveil' ? ['#fff', '#a0f0ff'] : ['#fff', '#b8f8b8'];
			const d = A === 'p1' ? 1 : -1, cx = a.x + d * a.w * 0.6, hh = a.h * 0.9;
			let t = 0;
			add(dt => { t += dt; return t < 560; }, () => {
				if (t > 440 && ((t / 40) | 0) % 2) return;
				const g = Math.min(1, t / 160) * hh;
				ctx.globalAlpha = 0.35; R(col[1], cx - 7, a.fy - g, 14, g); ctx.globalAlpha = 1;
				R(col[0], cx - 7, a.fy - g, 14, 1); R(col[0], cx - 7, a.fy - g, 1, g); R(col[1], cx + 6, a.fy - g, 1, g);
				const sy = a.fy - ((t / 4) % hh); if (sy > a.fy - g) line(cx - 6, sy, cx + 5, sy - 5, col[0]);
			});
			await wait(420); break;
		}
		case 'heal': heal(A); await wait(380); break;
		case 'hazard': {
			const g = { x: b.x, y: b.fy };
			for (let i = 0; i < 6; i++) after(i * 45, () => { const to = { x: g.x + rnd(-18, 18), y: g.y + rnd(-3, 3) }; travel(a, to, 280, { arc: 26, draw: (x, y) => bmp(m.type === 'Rock' ? BM.rock[0] : BM.shard[0], x, y, c[1], c[0], c[3]) }).then(() => { if (!dead) emit({ kind: 'bm', bm: m.type === 'Rock' ? BM.rock : BM.shard, x: to.x, y: to.y, col: c[1], hi: c[0], sh: c[3], life: 420, blink: 1 }); }); });
			await wait(520); break;
		}
		case 'powder':
			for (let i = 0; i < 26; i++) emit({ x: b.x + rnd(-b.w / 2, b.w / 2), y: b.top - rnd(4, 14), vy: rnd(26, 50), wob: 20, ph: rnd(600), delay: rnd(260), life: rnd(420, 620), col: c[i % 3], size: i % 3 ? 1 : 2 });
			await wait(480); break;
		case 'sound': await soundWaves(a, b, c, m.tside === A); break;
		case 'dance':
			sprinkle(m.type, a.x, a.y, 6, a.w / 2, a.h / 2);
			await tw(A, { rot: -9, y: -3 }, 110); await tw(A, { rot: 9, y: 0 }, 130); await tw(A, { rot: -6, y: -3 }, 110); await tw(A, { rot: 0, y: 0 }, 110);
			rings(a.x, a.fy - 2, [c[1], c[0]], 2, 3, a.w * 0.7, 300, 80, 0.35); break;
		case 'buff':
			for (let i = 0; i < 2; i++) { let t = -i * 130; add(dt => { t += dt; return t < 330; }, () => { if (t < 0) return; const k = t / 330; ring(a.x, lerp(a.fy - 1, a.top, k), a.w * 0.55 * (1 - k * 0.3), i ? c[0] : c[1], 0.32, 2); }); }
			for (let i = 0; i < 12; i++) after(i * 28, () => (SPK[m.type] || SPK.Normal)(a.x + rnd(-a.w / 2, a.w / 2), a.fy - rnd(2, a.h * 0.6)));
			setF(A, 'brightness(1.5)'); await wait(240); setF(A, ''); await wait(180); break;
		default: { // sobre el rival
			const from = { x: a.x + (b.x - a.x) * 0.15, y: a.y + (b.y - a.y) * 0.15 };
			await travel(from, b, 240, { draw: (x, y, k) => { ring(x, y, 4 + k * 5, c[1], 1, 2); ring(x, y, 2 + k * 2, c[0]); }, step: (x, y) => { if (Math.random() < 0.2) (SPK[m.type] || SPK.Normal)(x, y); } });
			for (let i = 0; i < 2; i++) { let t = -i * 120; add(dt => { t += dt; return t < 320; }, () => { if (t < 0) return; const k = t / 320; ring(b.x, lerp(b.top, b.fy - 1, k), b.w * 0.55, i ? c[2] : c[1], 0.32, 2); }); }
			for (let i = 0; i < 10; i++) after(i * 30, () => { const q = (SPK[m.type] || SPK.Normal)(b.x + rnd(-b.w / 2, b.w / 2), b.top + rnd(0, 8)); });
			const T_ = m.tside; setF(T_, 'brightness(.7)');
			await tw(T_, { x: 1.5 }, 50); await tw(T_, { x: -1.5 }, 70); await tw(T_, { x: 0 }, 60);
			await wait(160); setF(T_, '');
		}
		}
	}
	async function soundWaves(a, b, c, self) {
		const ang = Math.atan2(b.y - a.y, b.x - a.x);
		const from = { x: a.x + Math.cos(ang) * 6, y: a.y - a.h * 0.15 + Math.sin(ang) * 6 }, to = self ? { x: from.x + Math.cos(ang) * 30, y: from.y + Math.sin(ang) * 30 } : b;
		const one = i => travel(from, to, 300, { draw: (x, y, k) => { const r = 4 + k * 12; for (let j = -8; j <= 8; j++) { const aa = ang + j * 0.085; R(i % 2 ? c[0] : c[1], x + Math.cos(aa) * r - Math.cos(ang) * r, y + Math.sin(aa) * r - Math.sin(ang) * r, k < 0.5 ? 2 : 1); } } });
		for (let i = 0; i < 3; i++) emit({ kind: 'bm', bm: BM.note, x: from.x + rnd(-6, 6), y: from.y, vx: Math.cos(ang) * 40 + rnd(-10, 10), vy: Math.sin(ang) * 40 - 20, life: 480, delay: i * 80, col: c[1], blink: 1 });
		after(80, () => one(1)); after(160, () => one(2));
		await one(0);
	}

	/**
	 * Anima un movimiento. cb.onHit(i) se llama en el instante de cada golpe (para bajar la barra de PS a la vez)
	 * y devuelve la fracción de PS que quita ese golpe.
	 */
	async function move(e, cb = {}) {
		const m = moveInfo(e), A = e.side, Tg = m.tside;
		const nHits = Math.max(1, Math.min(e.hits || 1, 5));
		const failed = e.fail && !(e.hits > 0);
		const whiff = e.miss || failed || e.immune || e.blocked;
		if (off() || ST[A].gone) {
			for (let i = 0; i < nHits; i++) cb.onHit?.(i);
			if (!whiff && m.cat !== 'Status' && !ST[Tg].gone && !e.still) { flash('#fff', 0.5, 220); blink(Tg, 2); if (off()) { const el = spriteOf(Tg); el.style.opacity = 0.2; await sleep(110); el.style.opacity = 1; } }
			await sleep(180);
			return;
		}
		fit();
		const a = pos(A), b = pos(Tg), c = RAMP[m.type];
		if (m.cat === 'Status') { await statusMove(e, m, a, b); return; }
		if (e.still) { conv(a.x, a.y, 16, c, 300); setF(A, 'brightness(1.4)'); await wait(340); setF(A, ''); return; }
		if (failed && !e.miss && !e.immune && !e.blocked) { await tw(A, { sx: 1.05, sy: 0.95 }, 70); await tw(A, { sx: 1, sy: 1 }, 100); return; }
		const pwOf = d => clamp(0.75 + d * 1.1, 0.75, 1.45) * (e.eff > 1 ? 1.2 : e.eff > 0 && e.eff < 1 ? 0.7 : 1);
		const muzzle = { x: a.x + (b.x - a.x) * 0.13, y: a.y + (b.y - a.y) * 0.13, fy: a.fy };
		// Si falla, el proyectil pasa de largo y el rival se aparta
		const d0 = Math.hypot(b.x - a.x, b.y - a.y) || 1, nx = -(b.y - a.y) / d0, ny = (b.x - a.x) / d0;
		const aim = e.miss ? { x: a.x + (b.x - a.x) * 1.7 + nx * 16, y: a.y + (b.y - a.y) * 1.7 + ny * 16, fy: b.fy, top: b.top, w: b.w, h: b.h } : b;
		const dodge = () => { if (e.miss) { tw(Tg, { x: -nx * 7, y: -ny * 3 }, 110).then(() => wait(160)).then(() => tw(Tg, { x: 0, y: 0 }, 150, ease.io)); } };
		let lastReact = null;
		const land = (i = 0, at = b, o = {}) => {
			if (dead) return;
			if (e.miss) return;
			if (e.blocked) { shield(b, ['#fff', '#78e8c8']); burst(b.x, b.y, 6, { s0: 50, s1: 100, p: { kind: 'line', len: 4, col: '#fff', life: 160, shrink: 1 } }); return; }
			if (e.immune) { puff(b.x, b.y, 6, '#b8b8b8', 180); return; }
			const dmg = cb.onHit?.(i) ?? 0.2, pw = pwOf(dmg), lastHit = i >= nHits - 1;
			if (!o.noImpact) { if (o.mark) mark(o.mark, m.type, at, pw, Tg); else impact(m.type, at.x, at.y, pw); }
			if (e.eff > 1) { rings(at.x, at.y, ['#fff', c[1], '#fff'], 3, 5, 26, 320, 60); star(at.x, at.y, 18, ['#fff', c[0]], 240, 12); }
			if (lastHit) {
				if (e.crit) { critLines(); label(Tg, '¡Crítico!', 'crit'); }
				if (e.eff > 1) label(Tg, '¡Supereficaz!', 'se' + (e.crit ? ' low' : ''));
				else if (e.eff > 0 && e.eff < 1) label(Tg, 'Poco eficaz…', 'nve' + (e.crit ? ' low' : ''));
			}
			lastReact = react(Tg, dmg, e.eff ?? 1, lastHit && e.crit);
		};
		const after_ = () => { if (e.miss) label(Tg, 'Falló', 'miss'); if (e.immune) label(Tg, 'No afecta', 'miss'); };

		const X = { e, m, A, Tg, a, b, c, aim, muzzle, land, nHits, dodge };
		if (!whiff && SIGS[m.fam]) await SIGS[m.fam](X);
		else if (m.contact || ['punch', 'bite', 'kick', 'claw', 'slice', 'tail', 'horn', 'tackle', 'meteormash', 'nightslash', 'sacredsword', 'gigaimpact', 'avalanche'].includes(m.fam)) {
			await dash(A, a, e.miss ? { x: lerp(a.x, b.x, 1.1) + nx * 10, y: lerp(a.y, b.y, 1.1) + ny * 10 } : b, m.type);
			dodge();
			const fam = SIGS[m.fam] ? 'tackle' : m.fam;
			for (let i = 0; i < nHits; i++) {
				if (i) { await tw(A, { x: ST[A].x - (b.x - a.x) * 0.08, y: ST[A].y - (b.y - a.y) * 0.08 }, 60); await tw(A, { x: ST[A].x + (b.x - a.x) * 0.08, y: ST[A].y + (b.y - a.y) * 0.08 }, 60, ease.in); }
				land(i, b, { mark: fam });
				if (i < nHits - 1) await wait(120);
			}
			await wait(60);
			await goBack(A);
		} else {
			await nudge(A, a, b);
			for (let i = 0; i < nHits; i++) {
				const fam = SIGS[m.fam] ? 'shot' : m.fam;
				await deliver(fam, m.type, muzzle, aim, c, X);
				if (i === 0) dodge();
				land(i);
				if (i < nHits - 1) await wait(90);
			}
		}
		after_();
		if (m.drain && !whiff && !dead) {
			for (let i = 0; i < 6; i++) after(i * 45, () => travel({ x: b.x + rnd(-6, 6), y: b.y + rnd(-6, 6) }, a, 300, { arc: rnd(-12, 12), ez: ease.io, draw: (x, y) => { disc(x, y, 2, '#58d868'); R('#e0ffe0', x - 1, y - 1); } }));
			await wait(380);
		}
		if (lastReact) await lastReact; else await wait(e.miss ? 260 : 120);
	}

	/** Entrega a distancia según la familia. */
	function deliver(fam, type, a, b, c, X) {
		switch (fam) {
		case 'beam': sprinkle(type, a.x, a.y, 4); after(80, () => { let n = 0; add(dt => { n += dt; if (Math.random() < 0.5) (SPK[type] || SPK.Normal)(b.x + rnd(-6, 6), b.y + rnd(-6, 6)); return n < 240; }); }); return beam(a, b, c, 340, 4);
		case 'ball': return travel(a, b, 270, { arc: 9, step: trailOf(type, 24), draw: (x, y, k) => { orb(c, 6)(x, y); ring(x, y, 9 + (((k * 10) | 0) % 2), c[0]); } });
		case 'pulse': { const one = i => travel(a, b, 250, { draw: (x, y, k) => { ring(x, y, 3 + k * 7, c[i % 2 ? 0 : 1], 1, 2); ring(x, y, 1 + k * 4, c[2]); } }); after(70, () => one(1)); after(140, () => one(2)); return one(0); }
		case 'sound': return soundWaves(X.a, b, c, false);
		case 'wind': return gust(a, b, c, type);
		case 'cutwave': { const ang = Math.atan2(b.y - a.y, b.x - a.x); const one = () => travel(a, b, 210, { step: (x, y) => { if (Math.random() < 0.3) (SPK[type] || SPK.Normal)(x, y); }, draw: (x, y) => { for (let i = -7; i <= 7; i++) { const u = i / 7, o = (1 - u * u) * 5; R(c[1], x - Math.sin(ang) * i + Math.cos(ang) * (o - 2), y + Math.cos(ang) * i + Math.sin(ang) * (o - 2), 2, 2); R('#fff', x - Math.sin(ang) * i + Math.cos(ang) * o, y + Math.cos(ang) * i + Math.sin(ang) * o, Math.abs(u) < 0.5 ? 2 : 1); } } }); after(90, one); return one(); }
		case 'quake': return SIGS.quakeRun(X, 0.7);
		case 'boom': { puff(X.a.x, X.a.y, 22, '#fff', 200); impact('Fire', X.a.x, X.a.y, 1.5); rings(X.a.x, X.a.y, ['#fff', '#ffb030', '#f05a18'], 3, 6, 60, 420, 70); shake(5, 420); flash('#fff', 0.8, 360); return wait(200); }
		default: return (SHOT[type] || SHOT.Normal)(a, b, 1, c);
		}
	}

	// ---------- Firmas ----------
	const SIGS = {
		async aurasphere({ A, a, b, muzzle, land }) {
			const c = ['#e8f8ff', '#58b8ff', '#2060e0', '#102878'];
			let r = 0, on = true;
			conv(muzzle.x, muzzle.y, 16, c, 240, 14, 26);
			add(dt => { r = Math.min(5, r + dt / 48); return on; }, () => { disc(muzzle.x, muzzle.y, r + 1, c[2]); disc(muzzle.x, muzzle.y, r, c[1]); disc(muzzle.x - 1, muzzle.y - 1, r * 0.45, c[0]); ring(muzzle.x, muzzle.y, r + 3 + ((T / 60 | 0) % 2), c[0]); });
			await tw(A, { sx: 1.08, sy: 0.92 }, 240);
			on = false;
			tw(A, { sx: 1, sy: 1 }, 120);
			await travel(muzzle, b, 190, { ez: ease.in, step: ((x, y) => { emit({ x: x + rnd(-2, 2), y: y + rnd(-2, 2), life: 220, ramp: [c[0], c[1], c[2]], size: 3, shrink: 1 }); if (Math.random() < 0.3) emit({ kind: 'ring', x, y, r0: 2, r1: 7, life: 200, col: c[1] }); }), draw: (x, y) => { disc(x, y, 6, c[2]); disc(x, y, 5, c[1]); disc(x - 1, y - 1, 2, c[0]); } });
			land(0, b, { noImpact: true });
			puff(b.x, b.y, 12, c[0], 120); rings(b.x, b.y, [c[0], c[1], c[2]], 3, 4, 26, 340, 70); star(b.x, b.y, 15, ['#fff', c[1]], 220, 10);
			burst(b.x, b.y, 14, { s0: 50, s1: 120, p: { ramp: [c[0], c[1], c[2]], size: 3, shrink: 1, life: 380, drag: 2 } });
		},
		async meteormash({ A, a, b, land }) {
			const c = RAMP.Steel, s = ST[A];
			front(A, true);
			await tw(A, { x: -(b.x - a.x) * 0.1, y: -(b.y - a.y) * 0.1, sx: 1.12, sy: 0.88 }, 120);
			let on = true;
			const tr = every(16, () => { emit({ kind: 'bm', bm: BM.star4, spin: 60, f: rnd(4) | 0, x: a.x + s.x + rnd(-8, 8), y: a.y + s.y + rnd(-9, 9), life: 360, col: Math.random() < 0.5 ? '#ffe86a' : '#a0c8ff', hi: '#fff', blink: 1 }); emit({ kind: 'line', x: a.x + s.x + rnd(-5, 5), y: a.y + s.y + rnd(-6, 6), vx: -(b.x - a.x), vy: -(b.y - a.y), len: 14, life: 200, ramp: ['#fff', '#a0c8ff', '#5878d0'], w: 2, shrink: 1 }); });
			add(dt => { if (on) tr(dt); return on; });
			await tw(A, { x: (b.x - a.x) * 0.7, y: (b.y - a.y) * 0.7, sx: A === 'p1' ? 0.84 : 1.16, sy: A === 'p1' ? 0.84 : 1.16 }, 150, ease.in);
			on = false;
			land(0, b, { mark: 'punch' });
			emit({ kind: 'bm', bm: BM.star5, x: b.x, y: b.y, sc: 3, col: '#ffe86a', hi: '#fff', life: 220, blink: 1 });
			burst(b.x, b.y, 10, { s0: 60, s1: 130, p: { kind: 'bm', bm: BM.star4, spin: 60, drag: 2, life: 460, col: '#ffe86a', hi: '#fff', blink: 1 }, each: i => i % 2 ? { col: '#a0c8ff' } : null });
			shake(3, 220);
			await wait(90);
			await goBack(A);
		},
		async bone({ A, a, b, muzzle, land, nHits, m }) {
			const c = m.type === 'Ghost' ? ['#d0b8ff', '#8860d0'] : ['#fff', '#f0e8c8'];
			await nudge(A, a, b);
			for (let i = 0; i < nHits; i++) {
				let age = 0;
				await travel(muzzle, { x: b.x + rnd(-4, 4), y: b.y + rnd(-4, 4) }, nHits > 1 ? 170 : 240, { arc: 10, step: (x, y, k, dt) => { age += dt; if (Math.random() < 0.3) emit({ x, y, life: 140, col: c[1], size: 1 }); }, draw: (x, y) => bmp(BM.bone[((age / 40) | 0) % 4], x, y, c[1], c[0]) });
				land(i, b, { noImpact: true });
				star(b.x, b.y, 9, ['#fff', c[1]], 150, 6); impact(m.type, b.x, b.y, 0.7);
				// el hueso rebota
				let ag2 = 0; travel(b, { x: b.x + rnd(-14, 14), y: b.y - 16 }, 220, { arc: 8, step: (x, y, k, dt) => { ag2 += dt; }, draw: (x, y, k) => { if (k < 0.8 || ((ag2 / 40) | 0) % 2) bmp(BM.bone[((ag2 / 40) | 0) % 4], x, y, c[1], c[0]); } });
				if (i < nHits - 1) await wait(70);
			}
		},
		async skybolt({ A, a, b, land, m }) {
			const c = RAMP.Electric, bigT = m.id === 'thunder';
			tw(A, { sx: 1.06, sy: 0.94 }, 80).then(() => tw(A, { sx: 1, sy: 1 }, 120));
			sprinkle('Electric', a.x, a.y, 5, a.w / 2, a.h / 2);
			await wait(140);
			let t = 0, pts = [], br = [];
			const mk = () => { const tx = b.x + rnd(-14, 14); pts = jag(tx, -4, b.x, b.y, bigT ? 8 : 6, 8); const k = pts[(pts.length / 2) | 0]; br = jag(k[0], k[1], k[0] + rnd(-22, 22), k[1] + rnd(10, 24), 4, 6); };
			const re = every(70, mk);
			add(dt => { t += dt; re(dt); return t < 330; }, () => { const f = ((t / 70) | 0) % 2; if (t > 250 && f) return; poly(pts, c[2], bigT ? 5 : 3); poly(pts, f ? c[1] : '#fff', bigT ? 3 : 1); poly(br, c[1], 1); });
			flash('#fff8a0', 0.55, 300);
			await wait(60);
			land(0);
			after(120, () => impact('Electric', b.x, b.y, 1.1));
			rings(b.x, b.fy - 2, [c[1], '#fff'], 2, 3, 22, 300, 80, 0.35);
			shake(bigT ? 4 : 2.5, 260);
		},
		async quakeRun({ A, a, b, land, e }, k = 1) {
			const c = RAMP.Ground;
			await tw(A, { y: -5 * k, sy: 1.06 }, 110); await tw(A, { y: 0, sy: 0.88, sx: 1.1 }, 70, ease.in); tw(A, { sy: 1, sx: 1 }, 160);
			shake(5 * k, 620); dust(a.x, a.fy - 1, 6, a.w / 2, c[0]);
			const cr = []; for (let i = 0; i < 4; i++) cr.push(jag(a.x, a.fy - 2, lerp(a.x, b.x, 1) + rnd(-26, 26), b.fy - 2 + rnd(-4, 6), 5, 7));
			let t = 0;
			add(dt => { t += dt; return t < 700; }, () => { if (t > 560 && ((t / 40) | 0) % 2) return; for (const p of cr) { poly(p, c[3], 2, Math.min(1, t / 240)); poly(p, '#1c0c04', 1, Math.min(1, t / 240)); } });
			for (let i = 0; i < 12; i++) after(i * 40, () => { const x = rnd(4, W - 4), y = lerp(a.fy, b.fy, clamp((x - a.x) / ((b.x - a.x) || 1), -0.2, 1.2)) + rnd(-6, 6); burst(x, y, 3, { ...UP, s0: 40, s1: 100, p: { ay: 320, col: c[2], size: 2, life: 420 } }); emit({ kind: 'disc', x, y, vy: -30, size: 3, shrink: 1, col: c[0], life: 380 }); if (i % 3 === 0) SPK.Rock(x, y); });
			await wait(240);
			land(0, { x: b.x, y: b.y + 4 });
		},
		quake(X) { return SIGS.quakeRun(X, 1); },
		async hyperbeam({ A, a, b, muzzle, land }) {
			const c = ['#ffffff', '#fff0a0', '#ff9a30', '#c84810'];
			let r = 0, on = true;
			conv(muzzle.x, muzzle.y, 26, c, 280, 18, 34);
			add(dt => { r = Math.min(6, r + dt / 46); return on; }, () => { disc(muzzle.x, muzzle.y, r + 1, c[2]); disc(muzzle.x, muzzle.y, r, c[0]); });
			await tw(A, { sx: 1.1, sy: 0.9 }, 280);
			on = false;
			const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
			tw(A, { x: -(b.x - a.x) / d * 4, y: -(b.y - a.y) / d * 4, sx: 1, sy: 1 }, 80).then(() => wait(380)).then(() => tw(A, { x: 0, y: 0 }, 160));
			flash('#fff', 0.5, 200); shake(2.5, 480);
			const far = { x: b.x + (b.x - a.x) * 0.12, y: b.y + (b.y - a.y) * 0.12 };
			beam(muzzle, far, c, 480, 7);
			let n = 0; add(dt => { n += dt; if (n > 90) for (let i = 0; i < 2; i++) emit({ x: b.x + rnd(-8, 8), y: b.y + rnd(-8, 8), vx: rnd(-80, 80), vy: rnd(-80, 80), life: 240, ramp: c, size: 3, shrink: 1 }); return n < 460; });
			await wait(110);
			land(0, b, { noImpact: true });
			star(b.x, b.y, 20, ['#fff', c[2]], 300, 12); rings(b.x, b.y, ['#fff', c[1], c[2]], 3, 5, 32, 380, 80);
			await wait(300);
		},
		async gigaimpact({ A, a, b, land }) {
			const c = ['#fff', '#ffd0f0', '#c070e0', '#6030a0'], s = ST[A];
			front(A, true);
			conv(a.x, a.y, 20, c, 240); setF(A, 'brightness(1.6)');
			await tw(A, { sx: 1.15, sy: 0.85 }, 240);
			let on = true; const tr = every(14, () => { emit({ kind: 'line', x: a.x + s.x + rnd(-9, 9), y: a.y + s.y + rnd(-10, 10), vx: -(b.x - a.x), vy: -(b.y - a.y), len: 18, life: 220, ramp: c, w: 2, shrink: 1 }); });
			add(dt => { if (on) tr(dt); return on; });
			await tw(A, { x: (b.x - a.x) * 0.75, y: (b.y - a.y) * 0.75, sx: A === 'p1' ? 0.9 : 1.2, sy: A === 'p1' ? 0.9 : 1.2 }, 130, ease.in);
			on = false; setF(A, '');
			land(0, b, { noImpact: true });
			star(b.x, b.y, 22, ['#fff', c[2]], 300, 12); rings(b.x, b.y, c, 3, 5, 34, 380, 70); shake(5, 380); flash('#fff', 0.7, 300);
			burst(b.x, b.y, 16, { s0: 60, s1: 150, p: { ramp: c, size: 3, shrink: 1, life: 400, drag: 2 } });
			await wait(120);
			await goBack(A);
		},
		async surf({ A, a, b, land }) {
			const c = RAMP.Water, up = b.y < a.y;
			tw(A, { y: -4 }, 160).then(() => tw(A, { y: 0 }, 200, ease.io));
			const y0 = up ? H + 20 : -30, y1 = up ? b.y - 22 : b.fy + 10, dur = 520;
			let t = 0;
			add(dt => { t += dt; return t < dur + 220; }, () => {
				const k = Math.min(1, t / dur), yc = lerp(y0, y1, ease.out(k)), fade = t > dur ? (t - dur) / 220 : 0;
				const band = 34 * (1 - fade);
				for (let x = 0; x < W; x += 2) {
					const crest = Math.sin(x * 0.11 + t * 0.012) * 4 + Math.sin(x * 0.29 - t * 0.02) * 2;
					const top = up ? yc + crest : yc - band + crest, bot = up ? yc + band : yc + crest;
					const edge = up ? top : bot;
					ctx.globalAlpha = 0.78; R(c[2], x, top, 2, Math.max(0, bot - top)); ctx.globalAlpha = 1;
					R(c[1], x, edge + (up ? 2 : -5), 2, 3);
					R('#fff', x, edge - (up ? 1 : 2), 2, 2 + ((x + (t / 60 | 0)) % 6 === 0 ? 2 : 0));
				}
				if (Math.random() < 0.7) emit({ x: rnd(W), y: yc + (up ? -2 : 2), vx: rnd(-20, 20), vy: up ? rnd(-70, -20) : rnd(20, 70), ay: 200, life: 320, col: Math.random() < 0.5 ? '#fff' : c[1], size: 2 });
			});
			await wait(dur * 0.72);
			land(0);
			burst(b.x, b.y, 16, { ...UP, s0: 60, s1: 140, p: { ay: 330, col: '#fff', size: 2, life: 500 }, each: i => i % 2 ? { col: c[1] } : null });
			await wait(160);
		},
		async psychic({ A, a, b, Tg, land }) {
			const c = RAMP.Psychic;
			setF(A, 'brightness(1.4)'); rings(a.x, a.y - a.h * 0.2, [c[1], '#fff'], 2, 2, 12, 240, 80);
			await tw(A, { sx: 1.05, sy: 0.95 }, 90); setF(A, ''); tw(A, { sx: 1, sy: 1 }, 120);
			flash('#e83888', 0.28, 520);
			for (let i = 0; i < 4; i++) emit({ kind: 'ring', x: b.x, y: b.y, r0: 30, r1: 3, life: 360, delay: i * 75, col: [c[1], c[2], c[0], '#fff'][i], ez: ease.in, w: 2 });
			let on = true, t = 0;
			add(dt => { t += dt; for (let i = 0; i < 2; i++) { const an = t / 60 + i * Math.PI; R(c[0], b.x + Math.cos(an) * b.w * 0.6, b.y + Math.sin(an) * b.h * 0.45); } return on; }, () => { for (let i = 0; i < 6; i++) { const an = t / 70 + i * TAU / 6; R(i % 2 ? c[1] : '#fff', b.x + Math.cos(an) * b.w * 0.62, b.y + Math.sin(an) * b.h * 0.4, 2, 2); } });
			setF(Tg, 'hue-rotate(280deg) brightness(1.2)');
			await tw(Tg, { y: -7, sx: 0.9, sy: 1.12 }, 170);
			await tw(Tg, { sx: 1.14, sy: 0.88, rot: 5 }, 110); await tw(Tg, { sx: 0.92, sy: 1.1, rot: -5 }, 110);
			on = false; setF(Tg, '');
			tw(Tg, { rot: 0 }, 60);
			land(0, b, { noImpact: true });
			puff(b.x, b.y, 10, '#fff', 110); burst(b.x, b.y, 10, { s0: 40, s1: 100, p: { kind: 'bm', bm: BM.star4, spin: 70, col: c[1], hi: '#fff', life: 300, blink: 1 } }); rings(b.x, b.y, [c[1], c[2]], 2, 3, 22, 280, 70);
		},
		async shadowball({ A, a, b, muzzle, land }) {
			const c = RAMP.Ghost;
			let r = 0, on = true;
			conv(muzzle.x, muzzle.y, 12, [c[1], c[2], c[0]], 200, 12, 22);
			add(dt => { r = Math.min(5, r + dt / 40); return on; }, () => { disc(muzzle.x, muzzle.y, r, c[3]); ring(muzzle.x, muzzle.y, r, c[1]); });
			await tw(A, { sx: 1.06, sy: 0.94 }, 200);
			on = false; tw(A, { sx: 1, sy: 1 }, 120);
			await travel(muzzle, b, 260, { arc: 7, step: (x, y, k) => { if (Math.random() < 0.7) emit({ x: x + rnd(-3, 3), y: y + rnd(-3, 3), vy: -18, wob: 26, ph: rnd(600), life: 320, ramp: [c[1], c[2], c[3]], size: 3, shrink: 1 }); }, draw: (x, y, k) => { disc(x, y, 6, c[3]); ring(x, y, 6, c[1]); ring(x, y, 3 + (((k * 12) | 0) % 2), c[2]); disc(x - 2, y - 2, 1, c[0]); } });
			land(0);
			emit({ kind: 'disc', x: b.x, y: b.y, size: 4, grow: 10, col: c[3], life: 200, alpha: 0.8 });
			rings(b.x, b.y, [c[1], c[0]], 2, 4, 22, 300, 70);
		},
		async flamethrower({ A, a, b, muzzle, land }) {
			const c = RAMP.Fire;
			await nudge(A, a, b, 2);
			const p = stream(muzzle, b, 430, 230, o => emit({ ...o, ramp: ['#fff', c[0], c[1], c[2], c[3]], kind: 'disc', size: rnd(1.5, 3.4), grow: 2 }), 2.6, 0.13);
			let n = 0; add(dt => { n += dt; if (n > 220 && Math.random() < 0.8) SPK.Fire(b.x + rnd(-9, 9), b.y + rnd(-4, 9)); return n < 640; });
			await p;
			land(0);
			after(160, () => IMPACT.Fire(b.x, b.y, 1.2, c));
			await wait(220);
		},
		async nightslash({ A, a, b, land }) {
			const c = RAMP.Dark;
			flash('#000', 0.62, 520);
			await dash(A, a, b, 'Dark');
			slash(b.x, b.y, 38, A === 'p1' ? 2.3 : 0.85, ['#fff', c[0]], 300, 0.4, 3);
			slash(b.x, b.y, 34, A === 'p1' ? 2.3 : 0.85, [c[0], '#000'], 340, 0.55, 2);
			land(0, b, { noImpact: true });
			burst(b.x, b.y, 12, { s0: 50, s1: 120, p: { kind: 'line', len: 6, col: c[2], life: 300, shrink: 1 }, each: i => i % 3 ? null : { col: c[0] } });
			await wait(80);
			await goBack(A);
		},
		async sacredsword({ A, a, b, land }) {
			const c = ['#ffffff', '#fff3a0', '#f0c040', '#a07010'];
			let t = 0, on = true;
			const bx = a.x + (A === 'p1' ? 8 : -8);
			add(dt => { t += dt; return on; }, () => { const L = Math.min(22, t / 7); line(bx, a.y, bx, a.y - L, c[2], 3); line(bx, a.y, bx, a.y - L, c[0], 1); R(c[2], bx - 3, a.y, 7, 2); if (t > 120) bmp(BM.star4[1], bx, a.y - L, '#fff', c[1]); });
			sprinkle('Steel', bx, a.y - 12, 3);
			await tw(A, { sy: 1.08, sx: 0.96 }, 190);
			on = false;
			await dash(A, a, b, 'Fighting');
			slash(b.x, b.y, 36, 2.3, [c[0], c[2]], 280, 0.3, 3);
			after(70, () => slash(b.x, b.y, 30, 0.85, [c[0], c[2]], 260, 0.3, 3));
			land(0, b, { noImpact: true });
			for (let i = 0; i < 5; i++) emit({ kind: 'bm', bm: BM.star4, spin: 55, x: b.x + rnd(-12, 12), y: b.y + rnd(-12, 12), delay: i * 40, life: 240, col: '#fff', hi: c[1] });
			burst(b.x, b.y, 8, { ...UP, s0: 60, s1: 130, p: { kind: 'line', len: 3, ay: 340, life: 340, ramp: ['#fff', c[1], c[2]] } });
			await wait(110);
			await goBack(A);
		},
		async rockslide({ A, a, b, land, m }) {
			const c = m.id === 'dracometeor' ? ['#ffd0a0', '#f07030', '#9030d0', '#301880'] : RAMP.Rock;
			await tw(A, { y: -4 }, 90); await tw(A, { y: 0 }, 80, ease.in);
			shake(2, 300);
			const p = rockfall(b, 9, c, BM.rockL, 250, 16);
			await p;
			land(0);
			shake(4, 420);
			after(140, () => IMPACT.Rock(b.x, b.y + 2, 1.2, RAMP.Rock));
			await wait(300);
		},
		async avalanche({ A, a, b, land }) {
			const c = ['#ffffff', '#e0f4ff', '#a8d8f0', '#78b0d8'];
			await tw(A, { y: -4 }, 90); await tw(A, { y: 0 }, 80, ease.in);
			let n = 0; add(dt => { n += dt; for (let i = 0; i < 2; i++) emit({ x: b.x + rnd(-22, 22), y: -2, vx: rnd(-10, 10), vy: rnd(160, 260), life: 420, col: i ? '#fff' : c[2], size: i ? 2 : 1 }); return n < 420; });
			const p = rockfall(b, 8, c, BM.snow, 240, 16);
			await p;
			land(0);
			shake(3, 360);
			after(120, () => { IMPACT.Ice(b.x, b.y, 1.1, RAMP.Ice); dust(b.x, b.fy - 2, 8, b.w / 2, '#fff'); });
			await wait(280);
		},
	};

	// ---------- Entradas, salidas y estados ----------
	async function sendOut(side, { wild = false, shiny = false } = {}) {
		const s = ST[side];
		Object.assign(s, mkS(), { gone: false });
		front(side, false);
		if (off()) { apply(side); await sleep(200); return; }
		fit();
		const p = pos(side);
		if (wild) {
			Object.assign(s, { op: 0, sx: 0.7, sy: 0.7, y: 3 }); apply(side);
			burst(p.x, p.fy - 2, 9, { ...UP, s0: 30, s1: 80, jx: p.w / 3, p: { kind: 'bm', bm: BM.leaf, spin: 70, col: '#5cb848', hi: '#b8f080', ay: 200, life: 520, blink: 1 }, each: i => ({ f: i }) });
			dust(p.x, p.fy - 1, 5, p.w / 2);
			await tw(side, { op: 1, sx: 1, sy: 1, y: 0 }, 280, ease.back);
		} else {
			s.op = 0; apply(side);
			const from = side === 'p1' ? { x: -6, y: p.fy - 26 } : { x: W + 6, y: p.fy - 30 }, to = { x: p.x, y: p.fy - 7 };
			await travel(from, to, 270, { arc: 20, draw: (x, y) => drawBall(x, y), step: (x, y) => { if (Math.random() < 0.3) emit({ x, y, life: 120, col: '#fff', size: 1 }); } });
			puff(to.x, to.y, 12, '#fff', 140);
			rings(to.x, to.y, ['#fff', '#ffb0a8'], 2, 3, 20, 260, 60);
			burst(to.x, to.y, 10, { s0: 40, s1: 110, p: { kind: 'bm', bm: BM.star4, spin: 60, col: '#fff', hi: '#ffe27a', life: 320, blink: 1, drag: 2 } });
			Object.assign(s, { op: 1, sx: 0.12, sy: 0.12, f: WHITE }); apply(side);
			const g = tw(side, { sx: 1, sy: 1 }, 250, ease.back);
			await wait(150); setF(side, '');
			await g;
		}
		if (shiny) {
			flash('#fff', 0.45, 260);
			for (let i = 0; i < 9; i++) emit({ kind: 'bm', bm: BM.star4, spin: 70, f: i, x: p.x + rnd(-p.w / 2, p.w / 2), y: p.y + rnd(-p.h / 2, p.h / 2), delay: i * 45, life: 380, col: '#ffe86a', hi: '#fff', blink: 1 });
			await wait(300);
		}
	}
	async function recall(side) {
		const s = ST[side];
		if (s.gone) return;
		if (off()) { s.gone = true; s.op = 0; apply(side); return; }
		fit();
		const p = pos(side), from = side === 'p1' ? { x: 1, y: p.fy - 18 } : { x: W - 2, y: p.fy - 28 };
		let t = 0;
		add(dt => { t += dt; return t < 250; }, () => { const g = Math.min(1, t / 70); const x = lerp(from.x, p.x, g), y = lerp(from.y, p.y, g); line(from.x, from.y, x, y, '#ff4a3a', 3); line(from.x, from.y, x, y, '#ffe0d8', 1); });
		setF(side, RED);
		await wait(90);
		await tw(side, { sx: 0.05, sy: 0.05, x: (from.x - p.x) * 0.55, y: (from.y - p.y) * 0.3, op: 0.7 }, 170, ease.in);
		burst(lerp(p.x, from.x, 0.5), p.y, 5, { s0: 20, s1: 60, p: { col: '#ff8a80', size: 1, life: 200 } });
		Object.assign(s, { op: 0, gone: true, f: '' }); apply(side);
	}
	async function faint(side) {
		const s = ST[side];
		if (s.gone) return;
		if (off()) { s.gone = true; s.op = 0; apply(side); await sleep(250); return; }
		fit();
		const p = pos(side);
		front(side, false);
		await tw(side, { sy: 0.86, sx: 1.08, x: 0 }, 100);
		after(170, () => dust(p.x, p.fy - 1, 10, p.w / 2));
		setF(side, 'brightness(.6) saturate(.5)');
		await tw(side, { y: p.h * 0.42, sy: 0.3, op: 0 }, 400, ease.in);
		Object.assign(s, { gone: true, f: '' }); apply(side);
	}
	async function boost(side, stat, n) {
		if (off() || ST[side].gone || !n) return;
		fit();
		const p = pos(side), up = n > 0, col = STATC[stat] || '#fff', cnt = 4 + Math.min(3, Math.abs(n)) * 2;
		for (let i = 0; i < cnt; i++) emit({ kind: 'bm', bm: up ? BM.up : BM.down, x: p.x + (i / (cnt - 1) - 0.5) * p.w * 1.1 + rnd(-2, 2), y: up ? p.fy - rnd(0, 10) : p.top - rnd(0, 6), vy: (up ? -1 : 1) * rnd(70, 105), life: 430, delay: (i * 97) % 180, col: up ? col : '#6880c8', hi: up ? '#fff' : col, sh: up ? col : '#303860', blink: 1 });
		rings(p.x, up ? p.fy - 2 : p.top + 4, [col, '#fff'], 2, 3, p.w * 0.7, 320, 90, 0.33);
		setF(side, up ? 'brightness(1.55)' : 'brightness(.55)');
		await wait(260); setF(side, '');
		await wait(170);
	}
	function statusFx(side, st, mini) {
		const p = pos(side), n = mini ? 0.45 : 1;
		switch (st) {
		case 'psn': case 'tox': for (let i = 0; i < 10 * n; i++) emit({ kind: 'bub', x: p.x + rnd(-p.w / 2, p.w / 2), y: p.y + rnd(-4, p.h * 0.3), vy: rnd(-44, -20), wob: 16, ph: rnd(600), delay: rnd(240), life: rnd(380, 560), size: (rnd(1, 3.3)) | 0, col: RAMP.Poison[0], sh: st === 'tox' ? RAMP.Poison[3] : RAMP.Poison[2] }); setF(side, 'hue-rotate(250deg) saturate(1.4)'); after(260, () => setF(side, '')); break;
		case 'brn': for (let i = 0; i < 10 * n; i++) after(i * 25, () => SPK.Fire(p.x + rnd(-p.w / 2, p.w / 2), p.y + rnd(-2, p.h * 0.3))); for (let i = 0; i < 5 * n; i++) emit({ kind: 'disc', x: p.x + rnd(-p.w / 3, p.w / 3), y: p.top + rnd(0, 8), vy: -24, wob: 14, ph: rnd(600), delay: 150 + i * 60, size: 2, grow: 2, col: '#787078', life: 460, alpha: 0.7, blink: 1 }); break;
		case 'par': for (let i = 0; i < 8 * n; i++) emit({ kind: 'zap', x: p.x + rnd(-p.w / 2, p.w / 2), y: p.y + rnd(-p.h / 2, p.h / 3), size: 7, delay: rnd(220), life: 200, col: RAMP.Electric[1] }); if (!mini) { tw(side, { x: 1.5 }, 40).then(() => tw(side, { x: -1.5 }, 60)).then(() => tw(side, { x: 1 }, 50)).then(() => tw(side, { x: 0 }, 50)); } break;
		case 'slp': for (let i = 0; i < 3; i++) emit({ kind: 'bm', bm: BM.zed, x: p.x + p.w * 0.25 + i * 4, y: p.top + 4 - i * 2, vx: 9, vy: -22, wob: 12, delay: i * 170, life: 620, sc: i === 2 && !mini ? 2 : 1, col: '#fff', blink: 1 }); break;
		case 'frz': {
			if (!mini) conv(p.x, p.y, 14, [RAMP.Ice[0], RAMP.Ice[1]], 240, 20, 32, { kind: 'bm', bm: BM.shard, hi: '#fff', sh: RAMP.Ice[3] });
			let t = mini ? 0 : -220; const w = p.w * 1.05, hh = p.h * 1.05, dur = mini ? 300 : 520;
			add(dt => { t += dt; return t < dur; }, () => {
				if (t < 0) return; if (t > dur - 120 && ((t / 40) | 0) % 2) return;
				const x0 = p.x - w / 2, y0 = p.fy - hh;
				ctx.globalAlpha = 0.4; R(RAMP.Ice[1], x0, y0, w, hh); ctx.globalAlpha = 1;
				R('#fff', x0, y0, w, 1); R('#fff', x0, y0, 1, hh); R(RAMP.Ice[3], x0 + w - 1, y0, 1, hh); R(RAMP.Ice[3], x0, y0 + hh - 1, w, 1);
				line(x0 + 3, y0 + 8, x0 + 8, y0 + 3, '#fff'); line(x0 + 3, y0 + 13, x0 + 13, y0 + 3, '#fff');
			});
			break;
		}
		case 'confusion': { let t = 0; add(dt => { t += dt; return t < 620; }, () => { if (t > 500 && ((t / 40) | 0) % 2) return; for (let i = 0; i < 3; i++) { const a = t / 90 + i * TAU / 3; bmp(i === 0 ? BM.bird[0] : BM.star4[0], p.x + Math.cos(a) * p.w * 0.4, p.top + 2 + Math.sin(a) * 3, '#ffe86a', '#fff'); } }); break; }
		default: for (let i = 0; i < 7; i++) emit({ kind: 'bm', bm: BM.star4, spin: 80, f: i, x: p.x + rnd(-p.w / 2, p.w / 2), y: p.y + rnd(-p.h / 3, p.h / 3), vy: -26, delay: i * 40, life: 360, col: '#b8ffc8', hi: '#fff', blink: 1 });
		}
	}
	async function status(side, st) { if (off() || ST[side].gone) return; fit(); statusFx(side, st, false); await wait(st ? 380 : 220); }
	async function statusTick(side, st) { if (off() || ST[side].gone) return; fit(); statusFx(side, st, true); await wait(180); }
	function heal(side) {
		if (off() || ST[side].gone) return;
		fit();
		const p = pos(side);
		for (let i = 0; i < 10; i++) emit({ kind: 'bm', bm: i % 3 ? BM.plus : BM.star4, spin: i % 3 ? 0 : 80, x: p.x + rnd(-p.w / 2, p.w / 2), y: p.fy - rnd(2, p.h * 0.7), vy: rnd(-48, -22), delay: i * 35, life: 460, col: '#58d868', hi: '#e0ffe0', blink: 1 });
		rings(p.x, p.fy - 2, ['#58d868', '#e0ffe0'], 2, 3, p.w * 0.7, 340, 100, 0.33);
		setF(side, 'brightness(1.35)'); after(240, () => setF(side, ''));
	}
	async function weather(w, upkeep) {
		if (off() || !w || w === 'none') return;
		fit();
		const n = upkeep ? 16 : 44, span = upkeep ? 260 : 520;
		if (/rain|primordial/.test(w)) for (let i = 0; i < n * 1.4; i++) emit({ kind: 'line', x: rnd(-10, W + 30), y: rnd(-30, -2), vx: -70, vy: rnd(330, 420), len: 6, delay: rnd(span), life: 620, col: i % 3 ? '#78b8ff' : '#d0e8ff' });
		else if (/sun|desolate/.test(w)) {
			let t = 0; add(dt => { t += dt; return t < span + 200; }, () => { if (((t / 60) | 0) % 3 === 2) return; for (let i = 0; i < 6; i++) { const a = 2.0 + i * 0.22 + Math.sin(t / 200) * 0.03; line(W + 4, -4, W + 4 + Math.cos(a) * H * 1.3, -4 + Math.sin(a) * H * 1.3, i % 2 ? '#fff3a0' : '#ffd040'); } disc(W, 0, 9, '#fff3a0'); });
			if (!upkeep) flash('#ffe890', 0.3, 500);
		} else if (/sand/.test(w)) for (let i = 0; i < n * 1.6; i++) emit({ kind: 'line', x: rnd(-40, -2), y: rnd(H), vx: rnd(300, 420), vy: rnd(-20, 30), len: rnd(2, 6), delay: rnd(span), life: 560, col: RAMP.Ground[i % 3] });
		else if (/snow|hail/.test(w)) for (let i = 0; i < n * 1.2; i++) emit({ x: rnd(-10, W + 20), y: rnd(-20, -2), vx: rnd(-40, -10), vy: rnd(120, 200), wob: 30, ph: rnd(600), delay: rnd(span), life: 1100, col: i % 4 ? '#fff' : '#b8e8ff', size: w === 'hail' && i % 3 === 0 ? 2 : 1 });
		else if (/delta|wind/.test(w)) for (let i = 0; i < n; i++) emit({ kind: 'line', x: rnd(-40, -2), y: rnd(H), vx: rnd(360, 460), vy: -30, len: 10, delay: rnd(span), life: 500, col: '#d8f0e0' });
		else return;
		if (!upkeep) await wait(480);
	}

	// ---------- Momentos grandes ----------
	async function mega(side, swap) {
		if (off() || ST[side].gone) { swap(); apply(side); flash('#fff', 0.6, 300); await sleep(350); return; }
		fit();
		const p = pos(side), C = ['#ff6ad0', '#6ad0ff', '#ffe86a', '#8aff8a', '#ffffff'];
		conv(p.x, p.y, 34, C, 380, 28, 48, { size: 2 });
		let t = 0, open = false, R0 = p.h * 0.62;
		add(dt => { t += dt; return !open; }, () => {
			const r = R0 * ease.out(Math.min(1, t / 360));
			disc(p.x, p.y, r, '#fff');
			ring(p.x, p.y, r, C[(t / 60 | 0) % 4], 1, 2); ring(p.x, p.y, r * 0.72, C[((t / 60 | 0) + 2) % 4]);
			for (let i = 0; i < 2; i++) ring(p.x, p.y, r * 0.95, C[(i + (t / 80 | 0)) % 4], 0.3 + 0.25 * Math.sin(t / 90 + i * 2));
		});
		setF(side, 'brightness(1.6)');
		await wait(380);
		shake(2, 320); setF(side, WHITE);
		for (let i = 0; i < 3; i++) emit({ kind: 'ring', x: p.x, y: p.y, r0: R0 * 1.8, r1: R0, life: 260, delay: i * 80, col: C[i], ez: ease.in });
		await wait(300);
		swap();
		open = true;
		flash('#fff', 0.75, 340); shake(4.5, 340);
		rings(p.x, p.y, C, 4, R0 * 0.6, R0 * 2.6, 420, 55);
		burst(p.x, p.y, 22, { s0: 70, s1: 170, p: { kind: 'bm', bm: BM.shard, drag: 1.5, life: 520, col: '#fff', hi: '#fff', sh: '#ffb0e8', blink: 1 }, each: i => ({ f: i, col: C[i % 5] }) });
		// Símbolo: doble hélice dentro de un anillo irisado
		let st = 0; const sy = Math.max(12, p.top - 12);
		add(dt => { st += dt; return st < 760; }, () => {
			if (st > 620 && ((st / 40) | 0) % 2) return;
			const k = Math.min(1, st / 140), rr = 8 * ease.back(k);
			disc(p.x, sy, rr + 1, '#241838');
			for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; R(C[((i / 7) | 0 + (st / 90 | 0)) % 4], p.x + Math.cos(a) * rr, sy + Math.sin(a) * rr); }
			for (let j = -5; j <= 5; j++) { const o = Math.sin(j * 0.62 + st / 110) * 3 * k; R('#fff', p.x + o, sy + j * k); R(C[0], p.x - o, sy + j * k); }
		});
		Object.assign(ST[side], { sx: 1.3, sy: 1.3, f: '' }); apply(side);
		await tw(side, { sx: 1, sy: 1 }, 300, ease.back);
		await wait(240);
	}
	async function morph(side, swap) {
		if (off() || ST[side].gone) { swap(); apply(side); await sleep(200); return; }
		fit();
		const p = pos(side);
		setF(side, WHITE);
		await tw(side, { sx: 0.8, sy: 1.15 }, 110);
		swap();
		rings(p.x, p.y, ['#fff'], 2, 4, p.h * 0.8, 260, 70); burst(p.x, p.y, 8, { s0: 40, s1: 100, p: { kind: 'bm', bm: BM.star4, spin: 60, col: '#fff', hi: '#ffe86a', life: 300, blink: 1 } });
		await tw(side, { sx: 1, sy: 1 }, 180, ease.back);
		setF(side, '');
	}
	async function tera(side, type) {
		if (off() || ST[side].gone) { flash('#fff', 0.6, 300); await sleep(300); return; }
		fit();
		const p = pos(side), c = RAMP[type] || ['#fff', '#b8f8ff', '#78d8f0', '#3a98c8'];
		let t = 0, shut = false;
		const N = 9, R0 = p.h * 1.05, R1 = p.h * 0.42;
		add(dt => { t += dt; return !shut; }, () => {
			const k = ease.in(Math.min(1, t / 380)), r = lerp(R0, R1, k);
			for (let i = 0; i < N; i++) {
				const a = i * TAU / N + t / 500, x = p.x + Math.cos(a) * r, y = p.y + Math.sin(a) * r * 0.9;
				bmp(BM.shard[i % 2 ? 0 : 1], x, y, i % 3 ? c[1] : '#fff', '#fff', c[2], 2);
				line(x, y, p.x + Math.cos(a) * (r + 7), p.y + Math.sin(a) * (r + 7) * 0.9, c[0]);
			}
			if (k >= 1) { const hw = p.w * 0.55; for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + Math.PI / 6, a2 = (i + 1) * TAU / 6 + Math.PI / 6; line(p.x + Math.cos(a) * hw, p.y + Math.sin(a) * hw * 1.1, p.x + Math.cos(a2) * hw, p.y + Math.sin(a2) * hw * 1.1, '#fff', 2); line(p.x, p.y, p.x + Math.cos(a) * hw, p.y + Math.sin(a) * hw * 1.1, c[1]); } }
		});
		setF(side, 'brightness(1.5)');
		await wait(400);
		setF(side, WHITE);
		await wait(170);
		shut = true;
		flash('#fff', 0.7, 320); shake(3.5, 300);
		burst(p.x, p.y, 20, { s0: 70, s1: 170, p: { kind: 'bm', bm: BM.shard, drag: 1.5, ay: 80, life: 520, col: c[1], hi: '#fff', sh: c[2], blink: 1 }, each: i => ({ f: i, col: i % 3 ? c[1] : '#fff', sc: i % 4 ? 1 : 2 }) });
		rings(p.x, p.y, ['#fff', c[1], c[0]], 3, R1 * 0.6, R1 * 2.4, 400, 70);
		for (let i = 0; i < 6; i++) emit({ kind: 'bm', bm: BM.star4, spin: 55, x: p.x + rnd(-p.w / 2, p.w / 2), y: p.y + rnd(-p.h / 2, p.h / 2), delay: 80 + i * 55, life: 260, col: '#fff', hi: c[0] });
		// Joya del tipo sobre la cabeza
		let g = 0; const gy = Math.max(10, p.top - 9);
		add(dt => { g += dt; return g < 820; }, () => {
			if (g > 680 && ((g / 40) | 0) % 2) return;
			const k = ease.back(Math.min(1, g / 160)), y = gy + Math.sin(g / 130) * 1.5, w = 6 * k, hh = 8 * k;
			const P = [[0, -hh], [w, -hh * 0.35], [w, hh * 0.35], [0, hh], [-w, hh * 0.35], [-w, -hh * 0.35], [0, -hh]].map(q => [p.x + q[0], y + q[1]]);
			for (let j = -hh; j <= hh; j++) { const ww = Math.abs(j) > hh * 0.35 ? w * (hh - Math.abs(j)) / (hh * 0.65) : w; R(j < 0 ? c[1] : c[2], p.x - ww, y + j, ww * 2 + 1, 1); }
			R(c[0], p.x - w + 1, y - hh * 0.35, w, 1); line(p.x, y - hh, p.x, y + hh, c[0]);
			poly(P, '#fff'); R('#fff', p.x - 2, y - 3, 2, 2);
		});
		setF(side, '');
		Object.assign(ST[side], { sx: 1.18, sy: 1.18 }); apply(side);
		await tw(side, { sx: 1, sy: 1 }, 280, ease.back);
		await wait(160);
	}
	async function dyn(side, on) {
		const s = ST[side];
		if (off() || s.gone) { s.base = on ? 1.45 : 1; apply(side); await sleep(300); return; }
		fit();
		const p = pos(side);
		if (!on) { dust(p.x, p.fy - 1, 8, p.w / 2, '#ffb0c0'); setF(side, WHITE); await tw(side, { base: 1 }, 260, ease.in); setF(side, ''); return; }
		const c = ['#ffd0e0', '#ff5080', '#c01850', '#600828'];
		let n = 0; add(dt => { n += dt; for (let i = 0; i < 2; i++) emit({ kind: 'line', x: p.x + rnd(-p.w * 0.8, p.w * 0.8), y: p.fy + rnd(-2, 2), vy: -rnd(160, 300), len: rnd(6, 14), life: 420, ramp: c, w: i ? 1 : 2 }); if (Math.random() < 0.3) emit({ kind: 'disc', x: p.x + rnd(-p.w, p.w), y: p.top - rnd(8, 22), vx: rnd(-20, 20), size: 3, grow: 3, col: c[3], life: 500, alpha: 0.7, blink: 1 }); return n < 760; });
		flash('#ff3060', 0.4, 600); shake(3, 760);
		setF(side, 'brightness(1.3) saturate(1.4)');
		for (const b of [1.2, 1.08, 1.32, 1.2, 1.45]) await tw(side, { base: b }, 110, ease.io);
		setF(side, '');
		rings(p.x, p.fy - 2, [c[1], c[0]], 3, 4, p.w * 1.4, 420, 80, 0.33);
		await wait(180);
	}
	async function zpower(side) {
		if (off() || ST[side].gone) { flash('#fff8c0', 0.5, 300); await sleep(300); return; }
		fit();
		const p = pos(side), c = ['#ffffff', '#fff3a0', '#ffc830', '#f08010'];
		let n = 0; add(dt => { n += dt; for (let i = 0; i < 2; i++) { const a = rnd(TAU); emit({ kind: 'line', x: p.x + Math.cos(a) * p.w * 0.7, y: p.fy - 1 + Math.sin(a) * 4, vy: -rnd(180, 320), len: rnd(6, 13), life: 380, ramp: c }); } return n < 620; });
		rings(p.x, p.fy - 2, [c[1], c[2]], 3, 3, p.w * 1.1, 360, 110, 0.33);
		flash('#fff8c0', 0.4, 420);
		await tw(side, { sy: 0.84, sx: 1.1 }, 140);
		setF(side, 'brightness(1.6)');
		emit({ kind: 'bm', bm: BM.zed, x: p.x, y: Math.max(12, p.top - 10), sc: 4, col: c[2], life: 520, blink: 1 });
		emit({ kind: 'bm', bm: BM.zed, x: p.x - 1, y: Math.max(11, p.top - 11), sc: 4, col: '#fff', life: 520, blink: 1 });
		await tw(side, { sy: 1.18, sx: 0.94, y: -3 }, 120, ease.back);
		shake(2, 260);
		await wait(240);
		setF(side, '');
		await tw(side, { sy: 1, sx: 1, y: 0 }, 140);
	}
	async function levelup(lv) {
		const side = 'p1';
		if (ST[side].gone) return;
		label(side, `¡Nv. ${lv}!`, 'lvl');
		if (off()) return;
		fit();
		const p = pos(side);
		for (let i = 0; i < 14; i++) emit({ kind: 'bm', bm: BM.star4, spin: 70, f: i, x: p.x + rnd(-p.w * 0.6, p.w * 0.6), y: p.fy - rnd(0, 6), vy: -rnd(60, 120), delay: i * 28, life: 520, col: '#ffe86a', hi: '#fff', blink: 1 });
		for (let i = 0; i < 8; i++) emit({ kind: 'line', x: p.x + rnd(-p.w * 0.6, p.w * 0.6), y: p.fy, vy: -rnd(140, 220), len: 8, delay: rnd(200), life: 380, ramp: ['#fff', '#ffe86a', '#f0a020'] });
		rings(p.x, p.fy - 2, ['#ffe86a', '#fff'], 2, 3, p.w * 0.9, 380, 100, 0.33);
		setF(side, 'brightness(1.5)');
		await tw(side, { y: -6, sy: 1.06 }, 130);
		await tw(side, { y: 0, sy: 1 }, 150, ease.in);
		setF(side, '');
		await wait(120);
	}

	// ---------- Captura (la Ball es un elemento del DOM; aquí van el rayo, el polvo y las estrellas) ----------
	const cpt = el => ({ x: (el.offsetLeft + el.offsetWidth / 2) / SCALE, y: (el.offsetTop + el.offsetHeight * 0.5) / SCALE });
	async function capIn(side, ballEl) {
		const s = ST[side];
		if (off()) { s.op = 0; apply(side); await sleep(250); return; }
		fit();
		const p = pos(side), bp = cpt(ballEl);
		puff(bp.x, bp.y, 9, '#fff', 120); rings(bp.x, bp.y, ['#fff', '#ff8a80'], 2, 2, 14, 220, 60);
		let t = 0; add(dt => { t += dt; return t < 260; }, () => { if (((t / 40) | 0) % 2) return; line(bp.x, bp.y, p.x, p.y, '#ff4a3a', 3); line(bp.x, bp.y, p.x, p.y, '#ffe0d8', 1); });
		setF(side, RED);
		await wait(110);
		await tw(side, { sx: 0.06, sy: 0.06, x: (bp.x - p.x) * 0.5, y: (bp.y - p.fy) * 0.9, op: 0.8 }, 190, ease.in);
		s.op = 0; apply(side);
		burst(bp.x, bp.y, 6, { s0: 20, s1: 60, p: { col: '#ff8a80', size: 1, life: 220 } });
	}
	function capLand(ballEl) { if (off()) return; const bp = cpt(ballEl); dust(bp.x, bp.y + 16, 5, 6); }
	function capShake(ballEl, i) { if (off()) return; const bp = cpt(ballEl); const d = i % 2 ? 1 : -1; emit({ kind: 'bm', bm: BM.star4, x: bp.x + d * 9, y: bp.y + 6, vx: d * 26, vy: -20, life: 300, col: '#ffe86a', hi: '#fff', blink: 1 }); dust(bp.x, bp.y + 16, 2, 5); }
	function capStars(ballEl) {
		if (off()) return;
		const bp = cpt(ballEl), y = bp.y + 9;
		rings(bp.x, y, ['#ffe86a', '#fff'], 2, 3, 20, 360, 90);
		burst(bp.x, y, 12, { ...UP, s0: 50, s1: 120, p: { kind: 'bm', bm: BM.star4, spin: 70, ay: 150, life: 640, col: '#ffe86a', hi: '#fff', blink: 1 }, each: i => ({ f: i }) });
		for (let i = 0; i < 3; i++) emit({ kind: 'bm', bm: BM.star5, x: bp.x + (i - 1) * 13, y: y - 4, vy: -44, delay: i * 90, life: 600, col: '#ffe86a', hi: '#fff', blink: 1 });
	}
	async function capOut(side, ballEl) {
		const s = ST[side];
		if (off()) { Object.assign(s, mkS(), { gone: false }); apply(side); return; }
		const bp = cpt(ballEl), y = bp.y + 9;
		puff(bp.x, y, 12, '#fff', 140); rings(bp.x, y, ['#fff', '#ffb0a8'], 2, 3, 22, 260, 60);
		burst(bp.x, y, 10, { s0: 50, s1: 120, p: { kind: 'line', len: 5, col: '#fff', life: 200, shrink: 1 } });
		Object.assign(s, { x: 0, y: 0, sx: 0.15, sy: 0.15, op: 1, f: WHITE }); apply(side);
		const g = tw(side, { sx: 1, sy: 1 }, 260, ease.back);
		await wait(140); setF(side, '');
		await g;
	}

	// ---------- Transición de entrada ----------
	async function intro(kind) {
		if (off() || !root) return;
		const tc = mkEl('canvas', 'fxt');
		const Z = 4;
		const w = tc.width = Math.ceil(root.clientWidth / Z), hh = tc.height = Math.ceil(root.clientHeight / Z);
		root.append(tc);
		const c = tc.getContext('2d');
		const dur = kind === 'boss' ? 1050 : kind === 'trainer' ? 760 : 600;
		const main = ctx;
		let t = 0;
		const paint = () => {
			c.clearRect(0, 0, w, hh);
			const k = Math.min(1, t / dur);
			ctx = c;
			if (kind === 'wild') {
				if (k < 0.24) { R(((t / 55) | 0) % 2 ? '#f4f4ec' : '#10140c', 0, 0, w, hh); }
				else {
					const e = ease.in((k - 0.24) / 0.76), bh = 7;
					for (let y = 0, i = 0; y < hh; y += bh, i++) {
						const off_ = Math.round(e * (w + 24) * (1 + (i % 3) * 0.12)), d = i % 2 ? 1 : -1;
						R('#10140c', d * off_, y, w, bh);
						R('#3aa044', d > 0 ? off_ - 3 : w - off_, y, 3, bh); R('#b8f080', d > 0 ? off_ - 1 : w - off_ + 2, y + 1, 1, bh - 2);
					}
				}
			} else if (kind === 'trainer') {
				const e = k < 0.3 ? 0 : ease.io((k - 0.3) / 0.7), mid = hh / 2, o = Math.round(e * (mid + 12));
				if (k < 0.3 && ((t / 60) | 0) % 2) R('#fff', 0, 0, w, hh);
				R('#d8382e', 0, -o, w, mid); R('#f08078', 0, -o + 4, w, 3); R('#a02018', 0, mid - o - 9, w, 5);
				R('#f4f0e4', 0, mid + o, w, mid + 2); R('#c8c0b0', 0, hh - 8 + o, w, 8);
				R('#18181c', 0, mid - o - 4, w, 4); R('#18181c', 0, mid + o, w, 4);
				const br = 13 * (1 - e * 0.4);
				disc(w / 2, mid - o, br, '#18181c'); disc(w / 2, mid + o, br, '#18181c');
				if (e < 0.06) { disc(w / 2, mid, br - 4, '#f4f0e4'); ring(w / 2, mid, br - 7, '#c8c0b0'); }
				else { ring(w / 2, mid, e * w * 0.9, '#fff', 1, 2); }
			} else {
				const cx = w / 2, cy = hh * 0.42;
				if (k < 0.5) {
					R(((t / 70) | 0) % 4 === 3 ? '#f8e8a0' : '#140c1c', 0, 0, w, hh);
					for (let i = 0; i < 16; i++) { const y = (i * 37 + 11) % hh, sp = 1.4 + (i % 5) * 0.5, x = ((t * sp * 0.5 + i * 53) % (w + 60)) - 30; line(x, y, x + 26, y - 9, i % 3 ? '#e8b830' : '#c8304a', i % 4 ? 1 : 2); }
					const rr = (t / 4) % 40; ring(cx, cy, rr, '#e8b830', 1, 2); ring(cx, cy, (rr + 20) % 40, '#c8304a');
					for (let i = 0; i < 2; i++) { const d = i ? 1 : -1; const xx = cx + d * lerp(w, 9, ease.out(Math.min(1, k / 0.3))); line(xx - 9 * d, cy - 12, xx + 9 * d, cy + 12, '#fff', 3); line(xx - 9 * d, cy - 12, xx + 9 * d, cy + 12, '#e8b830', 1); }
				} else {
					const e = ease.in((k - 0.5) / 0.5), r = e * Math.hypot(w, hh) * 0.72;
					c.fillStyle = '#140c1c';
					for (let y = 0; y < hh; y++) { const dy = y - cy; if (Math.abs(dy) >= r) { c.fillRect(0, y, w, 1); continue; } const hw = Math.sqrt(r * r - dy * dy); c.fillRect(0, y, Math.max(0, cx - hw), 1); c.fillRect(cx + hw, y, w, 1); }
					ring(cx, cy, r, '#e8b830', 1, 2); ring(cx, cy, r + 3, '#c8304a');
				}
			}
			ctx = main;
		};
		paint();
		add(dt => { t += dt; return t < dur; }, paint);
		if (kind === 'boss') after(dur * 0.5, () => shake(3, 300));
		await wait(dur);
		tc.remove();
	}

	function destroy() {
		if (dead) return;
		dead = true;
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
		for (const f of [...pend]) f();
		pend.clear(); waits = []; PA.length = 0; EN.length = 0;
		ro?.disconnect();
		field.style.transform = '';
		cv.remove(); over.remove(); flashEl.remove();
		root?.querySelectorAll('.fxt').forEach(x => x.remove());
	}

	return {
		intro, sendOut, recall, move, faint, boost, status, statusTick, hurt, heal, weather, mega, morph, tera, dyn, zpower, levelup,
		capIn, capLand, capShake, capStars, capOut, label, over, number, reset, wait, destroy, flash,
		hurry() { hurryK = 3.2; }, calm() { hurryK = 1; },
		gone: side => ST[side].gone,
		get off() { return off(); },
		get busy() { return !!raf; },
		_dbg: { PA, EN, pos, impact, deliver, SHOT, mark, ST },
	};
}
