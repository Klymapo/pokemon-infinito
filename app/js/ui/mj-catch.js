// Cosecha: sacudir el árbol y atrapar con la cesta lo que cae. Lógica en ../minijuegos.js.
import { h } from './core.js';
import { catchShake, catchCanShake, catchStep, catchY, catchScore, CATCH_LINE, catchNeed } from '../minijuegos.js';
import { spr, fitCanvas, hash2, BERRY, CONE, ROT, BASKET, BASKET_PAL, BAD_PAL, GOLD_BERRY, berryPal, SPARK_S, SPARK_PAL } from './mj-arte.js';

const W = 96, H = 120;
const SCENES = {
	//         cielo                               lomas                  copa (oscuro, medio, claro)        tronco                          hierba
	bosque: { sky: ['#8fd0f0', '#b0e0f6', '#d4f0fa'], hill: ['#6ab46a', '#4f9a56'], leaf: ['#1f5a30', '#2f7a3e', '#4fa052'], bark: ['#5c3a1e', '#7a5230', '#3e2612'], grass: ['#4f9a4a', '#6cc060', '#3a7a3a'] },
	huerto: { sky: ['#f6d8a0', '#fae6bc', '#fdf2d8'], hill: ['#a8c46a', '#86a850'], leaf: ['#2a6a2a', '#3f8a38', '#68b04c'], bark: ['#6a4424', '#8a5e36', '#462c14'], grass: ['#7aaa4a', '#98c860', '#5a8a36'] },
	otono: { sky: ['#f0c8a0', '#f6dcbc', '#faeed8'], hill: ['#c89a50', '#a87a3c'], leaf: ['#8a3a14', '#c05e1c', '#e8922c'], bark: ['#4e3220', '#6c4a30', '#342014'], grass: ['#a89a4a', '#c8b860', '#7a7036'] },
	nieve: { sky: ['#b8d0e8', '#d0e2f2', '#e8f2fa'], hill: ['#e8f0f8', '#c8d8e8'], leaf: ['#1f4a44', '#2f6a5e', '#e8f4fa'], bark: ['#4a3a30', '#665246', '#30241c'], grass: ['#dce8f2', '#f4faff', '#b4c8dc'] },
};
const ARROW_L = ['..x', '.xx', 'xxx', '.xx', '..x'], ARROW_R = ['x..', 'xx.', 'xxx', 'xx.', 'x..'];

export function mountCatch(api) {
	const { P, S, stage, stats, ctrl, say, buzz, reduced } = api;
	const sc = SCENES[P.theme] || SCENES.bosque;
	const canvas = h('canvas', { class: 'px mj-canvas', 'aria-label': 'Árbol de bayas' });
	canvas.width = W; canvas.height = H;
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	stage.append(canvas);

	const count = h('span', { class: 'mj-stat-n' }, '0');
	const shakes = h('span', { class: 'mj-pips' });
	stats.append(h('div', { class: 'mj-stat' }, h('span', { class: 'mj-stat-l' }, 'En la cesta'), count), h('div', { class: 'mj-stat' }, h('span', { class: 'mj-stat-l' }, 'Sacudidas'), shakes));
	const shakeBtn = h('button', { class: 'mj-btn mj-main', 'aria-label': 'Sacudir el árbol', onclick: () => shake() }, 'Sacudir');
	ctrl.append(shakeBtn);

	// fondo fijo (se pinta una vez): cielo, lomas, tronco, hierba. La copa va aparte porque se mueve al sacudir.
	const bg = document.createElement('canvas'); bg.width = W; bg.height = H;
	const crown = document.createElement('canvas'); crown.width = W + 8; crown.height = 46;
	{
		const b = bg.getContext('2d');
		b.fillStyle = sc.sky[0]; b.fillRect(0, 0, W, 40); b.fillStyle = sc.sky[1]; b.fillRect(0, 40, W, 26); b.fillStyle = sc.sky[2]; b.fillRect(0, 66, W, 40);
		for (let x = 0; x < W; x++) {
			const h1 = 10 + Math.round(5 * Math.sin(x * 0.07 + 0.6) + 2 * Math.sin(x * 0.23));
			b.fillStyle = sc.hill[0]; b.fillRect(x, 100 - h1, 1, h1);
			const h2 = 5 + Math.round(3 * Math.sin(x * 0.11 + 2.4));
			b.fillStyle = sc.hill[1]; b.fillRect(x, 100 - h2, 1, h2);
		}
		// tronco: se ensancha hacia abajo; corteza con vetas
		for (let y = 30; y < 106; y++) {
			const half = 5 + Math.round(Math.max(0, y - 88) * 0.35) + (y < 40 ? 1 : 0);
			b.fillStyle = sc.bark[1]; b.fillRect(48 - half, y, half * 2, 1);
			b.fillStyle = sc.bark[0]; b.fillRect(48 + half - 3, y, 3, 1);
			b.fillStyle = sc.bark[2]; b.fillRect(48 - half, y, 1, 1); b.fillRect(48 + half - 1, y, 1, 1);
			if (hash2(y, 1, 4) > 0.55) { b.fillStyle = sc.bark[2]; b.fillRect(48 - half + 2 + Math.floor(hash2(y, 2, 4) * (half * 2 - 6)), y, 1, 2); }
		}
		// hierba
		b.fillStyle = sc.grass[0]; b.fillRect(0, 104, W, 16);
		b.fillStyle = sc.grass[2]; b.fillRect(0, 112, W, 8);
		for (let x = 0; x < W; x++) { const t = hash2(x, 7, 2); b.fillStyle = sc.grass[1]; if (t > 0.5) b.fillRect(x, 103 - (t > 0.85 ? 1 : 0), 1, 2); if (t < 0.12) { b.fillStyle = sc.grass[1]; b.fillRect(x, 108 + Math.floor(t * 60), 2, 1); } }
		// copa: racimos redondeados en tres tonos (oscuro al fondo y abajo, claro arriba a la izquierda)
		const c = crown.getContext('2d');
		const blob = (cx, cy, r, col) => { c.fillStyle = col; for (let y = -r; y <= r; y++) { const half = Math.round(Math.sqrt(r * r - y * y) * 1.25); c.fillRect(cx - half, cy + y, half * 2, 1); } };
		const pts = [];
		for (let i = 0; i < 13; i++) pts.push([4 + i * 8 + Math.round(hash2(i, 1, 6) * 4), 24 + Math.round(hash2(i, 2, 6) * 12), 9 + Math.round(hash2(i, 3, 6) * 3)]);
		c.fillStyle = sc.leaf[0]; c.fillRect(0, 0, W + 8, 22);
		for (const [x, y, r] of pts) blob(x, y, r, sc.leaf[0]);
		for (const [x, y, r] of pts) blob(x - 1, y - 4, r - 3, sc.leaf[1]);
		for (let i = 0; i < 9; i++) blob(6 + i * 12 + Math.round(hash2(i, 5, 6) * 5), 6 + Math.round(hash2(i, 6, 6) * 8), 6, sc.leaf[1]);
		for (const [x, y, r] of pts) if (r > 9) blob(x - 3, y - 7, 2, sc.leaf[2]);
		for (let i = 0; i < 26; i++) { c.fillStyle = sc.leaf[2]; c.fillRect(Math.floor(hash2(i, 8, 6) * (W + 6)), Math.floor(hash2(i, 9, 6) * 26), 2, 1); }
		// bayas colgando (lo que hay para cosechar)
		const looks = [...new Set(S.waves.flat().filter(o => o.kind === 'good').map(o => o.look))];
		for (let i = 0; i < 9; i++) { const pal = berryPal(looks[i % Math.max(1, looks.length)]); const x = 8 + i * 10 + Math.floor(hash2(i, 10, 6) * 5), y = 22 + Math.floor(hash2(i, 11, 6) * 12); c.fillStyle = pal.o; c.fillRect(x + 1, y, 3, 5); c.fillRect(x, y + 1, 5, 3); c.fillStyle = pal.a; c.fillRect(x + 1, y + 1, 3, 3); c.fillStyle = pal.b; c.fillRect(x + 3, y + 3, 1, 1); c.fillStyle = pal.c; c.fillRect(x + 1, y + 1, 1, 1); }
	}

	let last = 0, raf = 0, alive = true, t = 0, shakeT = 0, bump = 0, hurt = 0, target = 0.5;
	const fx = []; // partículas: hojas al sacudir, bayas que saltan de la cesta, salpicaduras en el suelo
	function hud() {
		count.textContent = String(S.pts);
		shakes.innerHTML = '';
		for (let i = 0; i < S.waves.length; i++) shakes.append(h('i', { class: i >= S.wave ? 'on' : '' }));
		shakes.setAttribute('aria-label', `${S.waves.length - S.wave} de ${S.waves.length}`);
		shakeBtn.disabled = S.wave >= S.waves.length;
		shakeBtn.textContent = S.wave >= S.waves.length ? 'Árbol vacío' : 'Sacudir';
	}
	function draw() {
		ctx.drawImage(bg, 0, 0);
		const sway = shakeT > 0 && !reduced() ? Math.round(Math.sin(shakeT * 40) * 3 * Math.min(1, shakeT * 3)) : 0;
		ctx.drawImage(crown, -4 + sway, 0);
		// pista: flechas sobre la copa mientras se pueda sacudir y no caiga nada
		if (catchCanShake(S) && !S.air.length && (reduced() || Math.floor(t * 2.5) % 2 === 0)) {
			spr(ctx, ARROW_L, {}, 28, 14, { mono: '#ffffff' }); spr(ctx, ARROW_R, {}, 65, 14, { mono: '#ffffff' });
			ctx.fillStyle = '#ffffff'; ctx.fillRect(32, 16, 32, 1);
		}
		for (const it of S.air) {
			if (S.t < it.t0) continue;
			const x = Math.round(it.x * W) - 5, y = Math.round(catchY(it, S.t) * H) - 8;
			if (it.kind === 'bad') spr(ctx, it.look === 'cone' ? CONE : ROT, BAD_PAL, x, y);
			else { spr(ctx, BERRY, it.kind === 'gold' ? GOLD_BERRY : berryPal(it.look), x, y); if (it.kind === 'gold' && (reduced() || Math.floor(t * 6) % 2 === 0)) spr(ctx, SPARK_S, SPARK_PAL, x + 7, y); }
		}
		// cesta
		const bx = Math.round(S.bx * W) - 14 + (hurt > 0 && !reduced() ? Math.round(Math.sin(hurt * 50) * 2) : 0), by = Math.round(CATCH_LINE * H) - 3 + (bump > 0 ? 1 : 0);
		// lo que ya llevas asoma por la boca de la cesta
		const fill = Math.min(9, S.pts);
		for (let i = 0; i < fill; i++) { const pal = i % 4 === 3 ? GOLD_BERRY : berryPal(S.waves[0][i % S.waves[0].length].look); ctx.fillStyle = pal.b; ctx.fillRect(bx + 3 + i * 2.4 | 0, by - 2 + (i % 2), 3, 3); ctx.fillStyle = pal.c; ctx.fillRect(bx + 3 + i * 2.4 | 0, by - 2 + (i % 2), 1, 1); }
		spr(ctx, BASKET, BASKET_PAL, bx, by);
		for (const p of fx) { ctx.fillStyle = p.c; ctx.globalAlpha = Math.min(1, p.life * 2); ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); }
		ctx.globalAlpha = 1;
	}
	function step(dt) {
		t += dt; shakeT = Math.max(0, shakeT - dt); bump = Math.max(0, bump - dt); hurt = Math.max(0, hurt - dt);
		const ev = catchStep(S, dt, target);
		for (const e of ev) {
			const px = e.x * W;
			if (e.e === 'catch') {
				if (e.kind === 'bad') { hurt = 0.4; buzz(60); say(e.look === 'cone' ? '¡Ay, una piña! Se te caen bayas de la cesta.' : '¡Puaj, una pocha! Se te caen bayas de la cesta.', 'bad'); if (!reduced()) for (let i = 0; i < 6; i++) fx.push({ x: px, y: CATCH_LINE * H, vx: (hash2(i, fx.length, 1) - 0.5) * 60, vy: -40 - hash2(i, 3, fx.length) * 30, life: 0.7, c: '#e5484d', s: 2 }); }
				else { bump = 0.12; buzz(e.kind === 'gold' ? [15, 30, 15] : 10); say(e.kind === 'gold' ? '**¡Una dorada!** Vale por tres.' : '¡Dentro!', 'good'); }
			} else if (e.kind !== 'bad' && !reduced()) for (let i = 0; i < 4; i++) fx.push({ x: px, y: 104, vx: (hash2(i, fx.length, 2) - 0.5) * 40, vy: -20 - hash2(i, 5, fx.length) * 20, life: 0.4, c: berryPal(e.look).a, s: 1 });
		}
		for (const p of fx) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt; p.life -= dt; }
		for (let i = fx.length - 1; i >= 0; i--) if (fx[i].life <= 0) fx.splice(i, 1);
		if (ev.length) hud();
		if (S.over) { const good = catchScore(S) >= catchNeed(P.d); say(good ? '¡Cesta llena!' : 'Se te ha escapado casi todo…', good ? 'good' : 'bad'); setTimeout(() => api.end(), 500); }
	}
	function loop(now) {
		if (!alive) return;
		const dt = Math.min(0.05, (now - (last || now)) / 1000);
		last = now;
		if (!api.paused() && !S.over) step(dt);
		draw();
		raf = requestAnimationFrame(loop);
	}
	function shake() {
		if (api.paused() || !catchShake(S)) return;
		shakeT = 0.5; buzz(25);
		say(S.wave >= S.waves.length ? '¡Última sacudida! Atrapa todo lo que puedas.' : '¡Ahí van! **Arrastra la cesta** para atraparlas.');
		if (!reduced()) for (let i = 0; i < 10; i++) fx.push({ x: hash2(i, S.wave, 3) * W, y: 30 + hash2(i, S.wave, 4) * 10, vx: (hash2(i, S.wave, 5) - 0.5) * 20, vy: 10 + hash2(i, S.wave, 6) * 20, life: 0.9, c: sc.leaf[2], s: 2 });
		hud();
	}
	// --- dedo: la cesta sigue la x del dedo en cualquier parte; un vaivén rápido sobre la copa sacude ---
	let g = null;
	const fracX = e => { const rc = canvas.getBoundingClientRect(); return (e.clientX - rc.left) / rc.width; };
	const fracY = e => { const rc = canvas.getBoundingClientRect(); return (e.clientY - rc.top) / rc.height; };
	stage.addEventListener('pointerdown', e => { if (S.over) return; try { stage.setPointerCapture(e.pointerId); } catch (x) { /* */ } g = { x0: e.clientX, top: fracY(e) < 0.36, done: false }; target = fracX(e); });
	stage.addEventListener('pointermove', e => {
		if (!g) return;
		target = fracX(e);
		if (g.top && !g.done && Math.abs(e.clientX - g.x0) > 36) { g.done = true; shake(); g.x0 = e.clientX; setTimeout(() => { if (g) g.done = false; }, 450); }
	});
	const up = () => { g = null; };
	stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
	const onKey = e => { if (document.querySelector('.sheet')) return; if (e.key === 'ArrowLeft') target = Math.max(0, S.bx - 0.08); else if (e.key === 'ArrowRight') target = Math.min(1, S.bx + 0.08); else if (e.key === ' ') { e.preventDefault(); shake(); } };
	window.addEventListener('keydown', onKey);
	function size() { const r = api.room(); fitCanvas(canvas, W, H, r.w, r.h); }
	const onResize = () => size();
	window.addEventListener('resize', onResize);
	if (!P.hint) say('**Desliza de lado sobre la copa** para sacudir el árbol.');
	size(); hud(); draw();
	raf = requestAnimationFrame(loop);

	return { destroy() { alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('keydown', onKey); } };
}
