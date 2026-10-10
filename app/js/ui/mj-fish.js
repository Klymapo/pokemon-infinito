// Pesca: lanzar, esperar la picada y mantener la tensión en la zona verde. Lógica en ../minijuegos.js.
import { h } from './core.js';
import { fishCast, fishStep, fishFaking, fishWarning } from '../minijuegos.js';
import { spr, fitCanvas, hash2, BOBBER, BOBBER_PAL, BANG, BANG_PAL, SHADOW_S, SHADOW_L } from './mj-arte.js';

const W = 96, H = 112;
const SCENES = {
	//        cielo (3 bandas)                    orilla lejana          agua (clara → honda)                         reflejo    muelle
	lago: { sky: ['#8fd0f0', '#a8dcf4', '#c8ecf8'], far: ['#3f8a52', '#2f6e44'], water: ['#3f8fd0', '#3478bc', '#2a62a4', '#224f8c'], glint: '#a8d8f8', wood: ['#a87a48', '#c89a60', '#6e4c28'] },
	mar: { sky: ['#6ab8f0', '#8accf4', '#b8e4f8'], far: ['#e8d8a0', '#c8b478'], water: ['#2f9ac0', '#2480ac', '#1c6896', '#165280'], glint: '#b0ecf8', wood: ['#9a8468', '#bca688', '#665440'] },
	rio: { sky: ['#a0d8c8', '#b8e4d4', '#d4f0e4'], far: ['#4f9a4a', '#3a7a3c'], water: ['#4aa8a0', '#3c908c', '#307876', '#266060'], glint: '#c0f0e4', wood: ['#a87a48', '#c89a60', '#6e4c28'] },
	cueva: { sky: ['#1c1a2a', '#242236', '#2c2a40'], far: ['#3a3650', '#2c2a3e'], water: ['#2a4a78', '#223e68', '#1c3258', '#162848'], glint: '#6a9ad8', wood: ['#6a6478', '#8a849a', '#464254'] },
};

export function mountFish(api) {
	const { P, S, stage, stats, ctrl, say, buzz, reduced } = api;
	const sc = SCENES[P.theme] || SCENES.lago;
	const canvas = h('canvas', { class: 'px mj-canvas', 'aria-label': 'Orilla' });
	canvas.width = W; canvas.height = H;
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	// --- tensión y distancia ---
	const needle = h('div', { class: 'mj-needle' });
	const zone = h('div', { class: 'mj-zone' });
	const gauge = h('div', { class: 'mj-gauge', role: 'meter', 'aria-label': 'Tensión del sedal' }, h('div', { class: 'mj-gauge-red' }), zone, needle);
	const dist = h('div', { class: 'mj-bar-fill' });
	const reelBox = h('div', { class: 'mj-reel idle' },
		h('div', { class: 'mj-gauge-lbl' }, h('span', {}, 'Floja'), h('b', {}, 'Tensión'), h('span', {}, 'Se parte')),
		gauge,
		h('div', { class: 'mj-stat grow' }, h('span', { class: 'mj-stat-l' }, 'Recogido'), h('div', { class: 'mj-bar' }, dist)));
	stage.append(canvas, reelBox);
	zone.style.left = S.zone[0] * 100 + '%'; zone.style.width = (S.zone[1] - S.zone[0]) * 100 + '%';
	gauge.querySelector('.mj-gauge-red').style.left = S.zone[1] * 100 + '%';
	needle.style.left = S.tension * 100 + '%'; dist.style.width = Math.round(S.prog * 100) + '%';

	const tries = h('span', { class: 'mj-pips' });
	stats.append(h('div', { class: 'mj-stat' }, h('span', { class: 'mj-stat-l' }, 'Intentos'), tries));

	const main = h('button', { class: 'mj-btn mj-main', 'aria-label': 'Lanzar la caña' }, 'Lanzar');
	ctrl.append(main);

	let hold = false, tapQ = false, last = 0, raf = 0, alive = true, t = 0, splash = 0, bangT = 0, castT = -1;
	const bob = { x: 44, y: 58 };
	const shadow = { x: 20, y: 70, a: 0 };

	function setMain(label, kind, aria) { main.textContent = label; main.dataset.kind = kind; main.setAttribute('aria-label', aria || label); }
	function hud() {
		tries.innerHTML = '';
		for (let i = 0; i < S.maxStrikes; i++) tries.append(h('i', { class: i < S.maxStrikes - S.strikes ? 'on' : '' }));
		tries.setAttribute('aria-label', `${S.maxStrikes - S.strikes} de ${S.maxStrikes}`);
	}
	function line(x0, y0, x1, y1, col) {
		ctx.fillStyle = col;
		const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
		let err = dx - dy, x = x0, y = y0, guard = 400;
		while (guard-- > 0) { ctx.fillRect(x, y, 1, 1); if (x === x1 && y === y1) break; const e2 = 2 * err; if (e2 > -dy) { err -= dy; x += sx; } if (e2 < dx) { err += dx; y += sy; } }
	}
	function draw() {
		// cielo y orilla lejana
		ctx.fillStyle = sc.sky[0]; ctx.fillRect(0, 0, W, 10);
		ctx.fillStyle = sc.sky[1]; ctx.fillRect(0, 10, W, 8);
		ctx.fillStyle = sc.sky[2]; ctx.fillRect(0, 18, W, 8);
		if (P.theme !== 'cueva') { // un par de nubes planas
			ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.85;
			for (const [cx, cy, cw] of [[10, 5, 18], [58, 11, 24]]) { const dx = reduced() ? 0 : Math.floor(t * 0.6) % (W + 30); const x0 = ((cx + dx) % (W + 30)) - 15; ctx.fillRect(x0 + 3, cy, cw - 8, 1); ctx.fillRect(x0, cy + 1, cw, 2); ctx.fillRect(x0 + 2, cy + 3, cw - 5, 1); }
			ctx.globalAlpha = 1;
		}
		for (let x = 0; x < W; x++) { // silueta de la orilla de enfrente: lomas suaves
			const hh = 4 + Math.round(2.5 * Math.sin(x * 0.11 + 1) + 1.5 * Math.sin(x * 0.29));
			ctx.fillStyle = sc.far[0]; ctx.fillRect(x, 26 - hh, 1, hh);
			ctx.fillStyle = sc.far[1]; ctx.fillRect(x, 25, 1, 2);
		}
		// agua en bandas, con reflejos que se mueven despacio
		const bands = [[27, 12], [39, 18], [57, 22], [79, 33]];
		bands.forEach(([y, hh], i) => { ctx.fillStyle = sc.water[i]; ctx.fillRect(0, y, W, hh); });
		const drift = reduced() ? 0 : t * 3;
		ctx.fillStyle = sc.glint;
		for (let y = 30; y < 100; y += 5) for (let k = 0; k < 4; k++) {
			const x = Math.floor((hash2(y, k, 3) * W + drift * (0.5 + hash2(k, y, 5))) % W), len = 2 + Math.floor(hash2(y, k, 9) * 4);
			ctx.globalAlpha = 0.25 + 0.3 * hash2(k, y, 11); ctx.fillRect(x, y, len, 1);
		}
		ctx.globalAlpha = 1;
		// sombra del pez
		if (S.phase !== 'ready') {
			const big = S.hook.type === 'wild';
			ctx.globalAlpha = 0.34;
			spr(ctx, big ? SHADOW_L : SHADOW_S, {}, shadow.x - (big ? 13 : 8), shadow.y - 3, { mono: '#0a1830' });
			ctx.globalAlpha = 1;
		}
		// muelle
		ctx.fillStyle = sc.wood[2]; ctx.fillRect(0, 100, W, 12);
		for (let x = 0; x < W; x += 12) { ctx.fillStyle = sc.wood[0]; ctx.fillRect(x, 100, 11, 11); ctx.fillStyle = sc.wood[1]; ctx.fillRect(x, 100, 11, 1); ctx.fillRect(x + 2 + (x % 5), 104, 4, 1); }
		// caña y sedal
		const tip = { x: 74, y: 84 };
		line(95, 111, tip.x, tip.y, '#3a2410'); line(95, 110, tip.x, tip.y - 1, '#8a5a2c');
		if (S.phase !== 'ready' || castT >= 0) {
			const by = Math.round(bob.y);
			line(tip.x, tip.y, Math.round(bob.x) + 3, by, '#f0f0f0');
			// ondas alrededor del corcho
			if (splash > 0) { ctx.fillStyle = '#ffffff'; ctx.globalAlpha = Math.min(1, splash * 2); const r = Math.round(10 - splash * 8); ctx.fillRect(bob.x + 3 - r, by + 6, r * 2, 1); ctx.fillRect(bob.x + 3 - r + 2, by + 8, Math.max(0, r * 2 - 4), 1); ctx.globalAlpha = 1; }
			const sink = S.phase === 'bite' ? 4 : fishFaking(S) ? 2 : 0;
			ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, by + 7 - 0); ctx.clip();
			spr(ctx, BOBBER, BOBBER_PAL, bob.x, by + sink);
			ctx.restore();
			if (S.phase === 'bite' && (reduced() || Math.floor(t * 8) % 2 === 0 || bangT < 0.3)) spr(ctx, BANG, BANG_PAL, bob.x, by - 15);
		}
	}
	function step(dt) {
		t += dt;
		const input = { hold, tap: tapQ };
		tapQ = false;
		const ev = fishStep(S, dt, input);
		for (const e of ev) {
			if (e === 'fake') { splash = 0.35; say('Algo ronda el anzuelo… Espera.'); }
			else if (e === 'bite') { splash = 0.6; bangT = 0; buzz(200); say('**¡Pica! ¡Toca ya!**', 'good'); setMain('¡Tira!', 'bite', 'Tirar de la caña'); }
			else if (e === 'scared') { say('¡Demasiado pronto! Lo has espantado.', 'bad'); buzz(40); setMain('Espera…', 'wait', 'Esperar la picada'); }
			else if (e === 'missed') { say('Se ha soltado. Hay que tocar en cuanto se hunda.', 'bad'); setMain('Espera…', 'wait', 'Esperar la picada'); }
			else if (e === 'hooked') { say('¡Enganchado! **Mantén pulsado** para recoger y **suelta** para aflojar.', 'good'); reelBox.classList.remove('idle'); setMain('Mantén para recoger', 'reel', 'Mantener pulsado para recoger sedal'); size(); buzz([20, 20, 20]); }
			else if (e === 'warn') say('¡Va a dar un tirón! Afloja un poco.', 'bad');
			else if (e === 'burst') { buzz(60); splash = 0.5; }
			else if (e === 'caught') { say('¡Fuera del agua!', 'good'); }
			else if (e === 'snap') { say('¡Chas! El sedal se ha partido.', 'bad'); }
			else if (e === 'escaped') { say(S.phase === 'reel' ? 'Se ha soltado y se aleja…' : 'Ya no pica nada aquí.', 'bad'); }
		}
		if (ev.length) hud();
		splash = Math.max(0, splash - dt);
		bangT += dt;
		// corcho: vuela al lanzar, se mece esperando, viene hacia el muelle al recoger
		if (castT >= 0) { castT += dt; const k = Math.min(1, castT / 0.45); bob.x = 74 + (44 - 74) * k; bob.y = 84 + (58 - 84) * k - Math.sin(k * Math.PI) * 26; if (k >= 1) { castT = -1; splash = 0.5; } }
		else if (S.phase === 'reel') { bob.y = 58 + S.prog * 34 + (reduced() ? 0 : Math.sin(t * 22) * S.tension * 1.2); bob.x = 44 + Math.sin(t * 2.3) * 10 * (1 - S.prog) + (S.burst > 0 && !reduced() ? Math.sin(t * 40) * 2 : 0); }
		else if (S.phase !== 'ready') { bob.x = 44; bob.y = 58 + (reduced() ? 0 : Math.sin(t * 2.2) * 0.8); }
		// sombra: merodea; al picar o al recoger, va bajo el corcho
		if (S.phase === 'wait' && !fishFaking(S)) { shadow.a += dt * 0.9; shadow.x += ((48 + Math.cos(shadow.a) * 26) - shadow.x) * dt * 2; shadow.y += ((66 + Math.sin(shadow.a * 1.3) * 12) - shadow.y) * dt * 2; }
		else { shadow.x += (bob.x + 3 - shadow.x) * dt * 6; shadow.y += (bob.y + 9 - shadow.y) * dt * 6; }
		if (S.phase === 'reel') {
			needle.style.left = S.tension * 100 + '%';
			dist.style.width = Math.round(S.prog * 100) + '%';
			const st = S.tension > S.zone[1] ? 'high' : S.tension < S.zone[0] ? 'low' : 'ok';
			if (gauge.dataset.st !== st) { gauge.dataset.st = st; if (st === 'high') say('¡Demasiada tensión! **Suelta**.', 'bad'); else if (st === 'low') say('Está floja: **mantén pulsado**.'); else say('¡Así! Aguanta en la zona verde.', 'good'); }
			gauge.style.setProperty('--stress', S.stress.toFixed(2));
			gauge.classList.toggle('warn', fishWarning(S) || S.burst > 0);
		}
		if (S.over) { reelBox.classList.add('done'); setMain(S.over === 'caught' ? '¡Lo tienes!' : '…', 'done'); setTimeout(() => api.end(), 450); }
	}
	function loop(now) {
		if (!alive) return;
		const dt = Math.min(0.05, (now - (last || now)) / 1000);
		last = now;
		if (!api.paused() && !S.over) step(dt);
		draw();
		raf = requestAnimationFrame(loop);
	}
	function press() {
		if (S.over || api.paused()) return;
		hold = true;
		if (S.phase === 'ready') {
			fishCast(S); castT = 0;
			say('Lanzas el anzuelo… Ahora, paciencia: toca **solo cuando salga «!»**.');
			setMain('Espera…', 'wait', 'Esperar la picada');
			return;
		}
		if (S.phase === 'wait' || S.phase === 'bite') tapQ = true;
	}
	const release = () => { hold = false; };
	for (const el of [main, canvas]) {
		el.addEventListener('pointerdown', e => { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (x) { /* */ } press(); });
		el.addEventListener('pointerup', release);
		el.addEventListener('pointercancel', release);
		el.addEventListener('contextmenu', e => e.preventDefault());
	}
	const onKey = e => { if (e.key !== ' ' || document.querySelector('.sheet')) return; e.preventDefault(); if (e.type === 'keydown') { if (!e.repeat) press(); } else release(); };
	window.addEventListener('keydown', onKey); window.addEventListener('keyup', onKey);
	function size() { const r = api.room(reelBox.offsetHeight + 8); fitCanvas(canvas, W, H, r.w, r.h); }
	const onResize = () => size();
	window.addEventListener('resize', onResize);
	if (!P.hint) say('Toca **Lanzar** para echar el anzuelo.');
	size(); hud(); draw();
	raf = requestAnimationFrame(loop);

	return {
		destroy() { alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); },
	};
}
