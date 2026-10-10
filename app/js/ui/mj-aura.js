// Rastreo con el aura (o con el Buscaobjetos): pulsos limitados que dicen frío, tibio o caliente. Lógica en ../minijuegos.js.
import { h } from './core.js';
import { itemName } from '../data.js';
import { auraProbe, AURA_TEXT } from '../minijuegos.js';
import { spr, drawObj, fitCanvas, hash2, MARK, MARK_PAL, AURA_THEMES, SPARK, SPARK_PAL } from './mj-arte.js';

const C = 12;
const PULSE = { cold: '#6fa0f0', warm: '#f5c542', hot: '#ff7a3a', near: '#ffffff', here: '#8fb0ff', none: '#6a7080' };

export function mountAura(api) {
	const { P, S, stage, stats, ctrl, say, buzz, reduced } = api;
	const radar = P.theme === 'buscaobjetos';
	const tones = AURA_THEMES[P.theme] || AURA_THEMES.ruina;
	const glow = radar ? '#7dffb0' : '#8fb0ff';
	const canvas = h('canvas', { class: 'px mj-canvas', 'aria-label': 'Terreno' });
	canvas.width = S.W * C; canvas.height = S.H * C;
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	// leyenda: la forma de cada marca, con su nombre (se entiende sin abrir la ayuda)
	const legend = h('div', { class: 'mj-legend-row' }, ...['cold', 'warm', 'hot', 'near'].map(b => {
		const c = h('canvas', { class: 'px', width: 12, height: 12 });
		spr(c.getContext('2d'), MARK[b], MARK_PAL[b], 0, 0);
		return h('span', { class: 'mj-leg' }, c, b === 'near' ? 'Al lado' : AURA_TEXT[b]);
	}));
	stage.append(canvas, legend);

	const pulses = h('span', { class: 'mj-stat-n' });
	const found = h('span', { class: 'mj-stat-n' });
	const pbar = h('div', { class: 'mj-bar-fill' });
	stats.append(
		h('div', { class: 'mj-stat grow' }, h('span', { class: 'mj-stat-l' }, 'Pulsos'), h('div', { class: 'mj-bar' }, pbar), pulses),
		h('div', { class: 'mj-stat' }, h('span', { class: 'mj-stat-l' }, 'Hallados'), found));
	ctrl.append(h('div', { class: 'mj-tip' }, radar ? 'Toca una casilla para escanear' : 'Toca una casilla para lanzar un pulso'));

	// terreno a oscuras (se pinta una vez)
	const bg = document.createElement('canvas'); bg.width = canvas.width; bg.height = canvas.height;
	{
		const b = bg.getContext('2d');
		for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++) {
			b.fillStyle = tones[0]; b.fillRect(x * C, y * C, C, C);
			// cada casilla es una losa con su bisel: se ve la cuadrícula sin que distraiga
			b.fillStyle = tones[1]; b.fillRect(x * C, y * C, C - 1, 1); b.fillRect(x * C, y * C, 1, C - 1);
			b.fillStyle = tones[2]; b.fillRect(x * C, y * C + C - 1, C, 1); b.fillRect(x * C + C - 1, y * C, 1, C);
			for (let i = 0; i < 3; i++) { b.fillStyle = tones[1 + (i % 2)]; b.fillRect(x * C + 2 + Math.floor(hash2(x, y, P.seed + i) * 8), y * C + 2 + Math.floor(hash2(y, x, P.seed + i * 5) * 8), i === 0 ? 2 : 1, 1); }
		}
	}

	const rings = []; // pulsos en marcha
	const shown = new Map(); // objeto → hasta cuándo brilla su silueta
	const foundAt = new Map();
	let raf = 0, alive = true;
	function ring(cx, cy, r, col, a) {
		ctx.fillStyle = col; ctx.globalAlpha = a;
		let x = r, y = 0, err = 1 - r;
		const plot = (px, py) => ctx.fillRect(cx + px, cy + py, 1, 1);
		while (x >= y) { plot(x, y); plot(y, x); plot(-x, y); plot(-y, x); plot(x, -y); plot(y, -x); plot(-x, -y); plot(-y, -x); y++; if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; } }
		ctx.globalAlpha = 1;
	}
	function draw(now = performance.now()) {
		ctx.drawImage(bg, 0, 0);
		for (const k in S.probes) {
			const [x, y] = k.split(',').map(Number), b = S.probes[k];
			if (b === 'here') continue;
			ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(x * C, y * C, C, C);
			spr(ctx, MARK[b], MARK_PAL[b], x * C, y * C);
		}
		for (const o of S.objs) {
			const id = P.cargo[o.ci].id;
			if (o.found) {
				ctx.fillStyle = 'rgba(143,176,255,.22)'; ctx.fillRect(o.x * C, o.y * C, C, C);
				drawObj(ctx, id, o.kind, o.x * C, o.y * C, { small: true });
				const t = foundAt.get(o);
				if (t && now - t < 1200 && (reduced() || Math.floor(now / 160) % 2 === 0)) spr(ctx, SPARK, SPARK_PAL, o.x * C + 6, o.y * C - 1);
			} else {
				const until = shown.get(o);
				if (until && now < until) { const k = reduced() ? 1 : 0.55 + 0.45 * Math.sin(now / 90); drawObj(ctx, id, o.kind, o.x * C, o.y * C, { small: true, mono: glow, alpha: k }); }
			}
		}
		for (const r of rings) { const k = (now - r.t0) / r.dur; if (k >= 0 && k <= 1) { ring(r.x, r.y, Math.round(2 + k * r.max), r.col, 1 - k); if (k > 0.25) ring(r.x, r.y, Math.round(2 + (k - 0.25) * r.max), r.col, (1 - k) * 0.6); } }
	}
	function hud() {
		pulses.textContent = String(S.pulses);
		pbar.style.width = Math.round(S.pulses / S.maxPulses * 100) + '%';
		pbar.dataset.lvl = S.pulses > S.maxPulses * 0.5 ? 'ok' : S.pulses > 2 ? 'mid' : 'low';
		found.textContent = `${S.objs.filter(o => o.found).length}/${S.objs.length}`;
	}
	function loop(now) {
		if (!alive) return;
		for (let i = rings.length - 1; i >= 0; i--) if (now - rings[i].t0 > rings[i].dur) rings.splice(i, 1);
		draw(now);
		raf = requestAnimationFrame(loop);
	}
	function probe(x, y) {
		if (S.over || api.paused()) return;
		const r = auraProbe(S, x, y);
		if (!r) { say('Ahí ya has mirado. Prueba en otra casilla.'); return; }
		const now = performance.now();
		if (!reduced()) rings.push({ x: x * C + 6, y: y * C + 6, t0: now, dur: 620, max: r.band === 'cold' ? 16 : r.band === 'warm' ? 26 : 36, col: PULSE[r.band] });
		for (const o of r.reveal) shown.set(o, now + (reduced() ? 2600 : 1500));
		if (r.found) { foundAt.set(r.found, now); buzz([20, 30, 40]); say(`**¡${itemName(P.cargo[r.found.ci].id)}!** ${S.over ? '' : 'Las marcas se actualizan: ahora hablan de lo que queda.'}`, 'good'); }
		else {
			buzz(r.band === 'near' ? [15, 20, 15] : r.band === 'hot' ? 20 : 8);
			const tail = S.pulses <= 0 ? '' : S.pulses <= 2 ? ` Te queda${S.pulses === 1 ? '' : 'n'} ${S.pulses} pulso${S.pulses === 1 ? '' : 's'}.` : '';
			say({ near: '**¡Aquí al lado!** Mira dónde brilla y tócalo.', hot: '**Caliente.** Está a dos casillas.', warm: '**Tibio.** Está a tres o cuatro casillas.', cold: '**Frío.** No hay nada a menos de cinco casillas.' }[r.band] + tail, r.band === 'near' || r.band === 'hot' ? 'good' : '');
		}
		hud();
		if (r.over) setTimeout(() => api.end(), r.over === 'clear' ? 700 : 500);
	}
	canvas.addEventListener('pointerdown', e => {
		const rc = canvas.getBoundingClientRect();
		probe(Math.floor((e.clientX - rc.left) / rc.width * S.W), Math.floor((e.clientY - rc.top) / rc.height * S.H));
	});
	function size() { const r = api.room(legend.offsetHeight + 8); fitCanvas(canvas, canvas.width, canvas.height, r.w, r.h); }
	const onResize = () => size();
	window.addEventListener('resize', onResize);
	if (!P.hint) say(`${radar ? 'El Buscaobjetos pita' : 'El aura nota'} ${S.objs.length === 1 ? 'algo escondido' : S.objs.length + ' cosas escondidas'}. Toca el terreno para ${radar ? 'escanear' : 'lanzar un pulso'}.`);
	size(); hud(); draw();
	raf = requestAnimationFrame(loop);

	return { destroy() { alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); } };
}
