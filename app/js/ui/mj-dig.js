// Excavación: una pared con capas, pico y martillo (homenaje al Subsuelo de Sinnoh). Lógica en ../minijuegos.js.
import { h } from './core.js';
import { itemName } from '../data.js';
import { digHit, digDepth } from '../minijuegos.js';
import { spr, digCell, drawObj, fitCanvas, iconCanvas, SPARK, SPARK_S, SPARK_PAL, TOOL, TOOL_PAL } from './mj-arte.js';

const C = 12; // píxeles lógicos por casilla

export function mountDig(api) {
	const { P, S, stage, stats, ctrl, say, buzz, reduced } = api;
	const theme = P.theme;
	const canvas = h('canvas', { class: 'px mj-canvas', 'aria-label': 'Pared de roca' });
	canvas.width = S.W * C; canvas.height = S.H * C;
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	stage.append(canvas);

	// --- marcador: aguante de la pared y objetos ---
	const bar = h('div', { class: 'mj-bar-fill' });
	const found = h('span', { class: 'mj-stat-n' });
	stats.append(
		h('div', { class: 'mj-stat grow' }, h('span', { class: 'mj-stat-l' }, 'Pared'), h('div', { class: 'mj-bar', role: 'meter', 'aria-label': 'Aguante de la pared' }, bar)),
		h('div', { class: 'mj-stat' }, h('span', { class: 'mj-stat-l' }, 'Objetos'), found));

	// --- herramientas ---
	let tool = 'pick';
	const fmt = n => String(Math.round(n));
	const toolBtn = (id, label) => h('button', { class: 'mj-btn mj-tool', 'aria-pressed': 'false', 'aria-label': `${label}: gasta ${fmt(S.cost[id])} de aguante`, onclick: () => setTool(id) },
		iconCanvas(TOOL[id], TOOL_PAL, 2), h('span', { class: 'mj-tool-t' }, h('span', { class: 'mj-tool-n' }, label), h('span', { class: 'mj-tool-c' }, (id === 'pick' ? 'fino' : 'ancho') + ' · −' + fmt(S.cost[id]))));
	const btns = { pick: toolBtn('pick', 'Pico'), hammer: toolBtn('hammer', 'Martillo') };
	ctrl.append(btns.pick, btns.hammer);
	function setTool(t) { tool = t; for (const k in btns) btns[k].setAttribute('aria-pressed', String(k === t)); }
	setTool('pick');

	// --- dibujo ---
	let radarUntil = performance.now() + (reduced() ? 2600 : 2200), flash = null, blink = 0, raf = 0, alive = true;
	const justFound = new Map(); // objeto → momento en que salió (para el brillo)
	function draw(now = performance.now()) {
		const dAt = (x, y) => { const v = digDepth(S, x, y); return v < 0 ? 9 : v; };
		// 1) suelo  2) objetos  3) capas que aún tapan
		for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++) digCell(ctx, theme, x, y, 0, [dAt(x, y - 1), dAt(x - 1, y), 0, 0], P.seed);
		for (const o of S.objs) {
			drawObj(ctx, P.cargo[o.ci].id, o.kind, o.x * C, o.y * C, { small: o.small || o.w * o.h === 1 });
			const t = justFound.get(o);
			if (t && now - t < 900 && !reduced()) { ctx.fillStyle = `rgba(255,255,255,${0.75 * (1 - (now - t) / 900)})`; ctx.fillRect(o.x * C, o.y * C, o.w * C, o.h * C); }
		}
		for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++) {
			const dd = dAt(x, y);
			if (dd > 0) digCell(ctx, theme, x, y, dd, [dAt(x, y - 1), dAt(x - 1, y), dAt(x, y + 1), dAt(x + 1, y)], P.seed);
		}
		// destellos: algo asoma bajo la última capa
		const on = reduced() || blink % 2 === 0;
		for (const o of S.objs) if (!o.found) for (const [x, y] of o.cells) if (dAt(x, y) === 1 && on) spr(ctx, SPARK_S, SPARK_PAL, x * C + 4 + ((x + y) % 2) * 2, y * C + 4);
		if (now < radarUntil) for (const [x, y] of S.radar) if (dAt(x, y) > 0 && on) spr(ctx, SPARK, SPARK_PAL, x * C + 3, y * C + 3);
		for (const [o, t] of justFound) if (now - t < 1400 && on) { spr(ctx, SPARK, SPARK_PAL, o.x * C + 1, o.y * C + 1); spr(ctx, SPARK_S, SPARK_PAL, (o.x + o.w) * C - 5, (o.y + o.h) * C - 5); }
		if (flash && now < flash.until) { ctx.fillStyle = 'rgba(255,255,255,.35)'; for (const [x, y] of flash.cells) ctx.fillRect(x * C, y * C, C, C); }
		// grietas: cuanto menos aguante, más bajan desde arriba
		const hurt = 1 - S.stab / S.maxStab;
		if (hurt > 0.35) {
			ctx.fillStyle = 'rgba(10,6,4,.8)';
			const len = Math.floor((hurt - 0.35) / 0.65 * 34);
			for (const [sx, dir] of [[20, 1], [58, -1], [80, 1]]) { let x = sx, y = 0; for (let i = 0; i < len; i++) { ctx.fillRect(x, y, 1, 1); if (i % 3 === 2) x += dir * (i % 2 ? 1 : -1) + dir; y += i % 4 === 3 ? 0 : 1; if (i % 4 === 3) x += dir; } }
		}
	}
	function hud() {
		const k = S.stab / S.maxStab;
		bar.style.width = Math.round(k * 100) + '%';
		bar.dataset.lvl = k > 0.5 ? 'ok' : k > 0.25 ? 'mid' : 'low';
		bar.parentElement.setAttribute('aria-valuenow', Math.round(k * 100));
		found.textContent = `${S.objs.filter(o => o.found).length}/${S.objs.length}`;
		btns.hammer.classList.toggle('risky', S.stab <= S.cost.hammer);
	}
	function size() { const r = api.room(); fitCanvas(canvas, canvas.width, canvas.height, r.w, r.h); }
	function loop(now) {
		if (!alive) return;
		const b = Math.floor(now / 380);
		if (b !== blink || (flash && now < flash.until + 60) || now < radarUntil + 60 || [...justFound.values()].some(t => now - t < 1500)) { blink = b; draw(now); }
		raf = requestAnimationFrame(loop);
	}

	// --- jugar ---
	function hit(x, y) {
		if (S.over || api.paused()) return;
		const r = digHit(S, x, y, tool);
		if (!r) return;
		radarUntil = Math.min(radarUntil, performance.now() + 500);
		flash = { cells: r.cells, until: performance.now() + 90 };
		buzz(tool === 'hammer' ? 30 : 12);
		if (!reduced()) { canvas.classList.remove('shake', 'shake-big'); void canvas.offsetWidth; canvas.classList.add(tool === 'hammer' ? 'shake-big' : 'shake'); }
		for (const o of r.found) justFound.set(o, performance.now());
		if (r.found.length) { say(`¡Has sacado **${r.found.map(o => itemName(P.cargo[o.ci].id)).join('** y **')}**!`, 'good'); buzz([20, 30, 40]); }
		else if (!r.cells.length) say('Ahí ya no queda nada que picar.');
		else {
			const peek = S.objs.some(o => !o.found && o.cells.some(([cx, cy]) => digDepth(S, cx, cy) <= 1 && r.cells.some(([hx, hy]) => hx === cx && hy === cy)));
			const k = S.stab / S.maxStab;
			say(peek ? '¡Algo brilla ahí debajo! Destápalo entero.' : k <= 0.25 ? '¡La pared cruje! Queda muy poco aguante.' : k <= 0.5 ? 'Caen piedrecitas… Ve con cuidado.' : tool === 'hammer' ? '¡Pum! Salta un buen trozo.' : 'Tic, tic… La roca cede.');
		}
		hud(); draw();
		if (r.over) {
			if (r.over === 'collapse') say('¡La pared se viene abajo!', 'bad');
			setTimeout(() => api.end(), r.over === 'clear' ? 600 : 350);
		}
	}
	canvas.addEventListener('pointerdown', e => {
		const rc = canvas.getBoundingClientRect();
		hit(Math.floor((e.clientX - rc.left) / rc.width * S.W), Math.floor((e.clientY - rc.top) / rc.height * S.H));
	});
	const onResize = () => size();
	window.addEventListener('resize', onResize);
	if (!P.hint) say(`Hay ${S.objs.length === 1 ? 'algo enterrado' : S.objs.length + ' cosas enterradas'}. ¡Fíjate en los destellos y pica ahí!`);
	size(); hud(); draw();
	raf = requestAnimationFrame(loop);

	return {
		destroy() { alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); },
		helpExtra: () => [P.cargo.some(c => c.must) ? 'Aquí hay **una pieza principal**: si la pared cae antes de sacarla entera, no hay premio (pero puedes volver a intentarlo).' : 'Lo que hayas sacado entero te lo quedas, aunque la pared caiga después.', `Aquí el pico gasta **${fmt(S.cost.pick)}** de aguante y el martillo, **${fmt(S.cost.hammer)}** (de ${S.maxStab}).`],
	};
}
