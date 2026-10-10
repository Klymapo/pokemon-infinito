// Cerradura de runas: repetir una secuencia que crece (memoria). Lógica en ../minijuegos.js.
import { h } from './core.js';
import { lockPress, lockTarget } from '../minijuegos.js';
import { spr, fitCanvas, RUNES, RUNE_COL, LOCK_THEMES, SPARK, SPARK_S, SPARK_PAL } from './mj-arte.js';

const W = 72, H = 44;

export function mountLock(api) {
	const { P, S, stage, stats, ctrl, say, buzz, reduced } = api;
	const th = LOCK_THEMES[P.theme] || LOCK_THEMES.cofre;
	const canvas = h('canvas', { class: 'px mj-canvas mj-chest', 'aria-label': 'Cerradura' });
	canvas.width = W; canvas.height = H;
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	const dots = h('div', { class: 'mj-dots', 'aria-hidden': 'true' });
	const pads = [];
	for (let i = 0; i < S.pads; i++) {
		const col = RUNE_COL[i];
		const g = h('canvas', { class: 'px', width: 12, height: 12 });
		const b = h('button', { class: 'mj-rune', 'aria-label': 'Runa ' + (i + 1), style: { '--off': col.off, '--on': col.on, '--ink': col.ink } }, g);
		b.style.setProperty('--off', col.off); b.style.setProperty('--on', col.on); b.style.setProperty('--ink', col.ink);
		b._g = g; b._col = col;
		b.addEventListener('pointerdown', e => { e.preventDefault(); press(i); });
		pads.push(b);
		paintRune(i, false);
	}
	const grid = h('div', { class: 'mj-runes n' + S.pads }, ...pads);
	stage.append(canvas, dots, grid);

	const roundEl = h('span', { class: 'mj-stat-n' });
	const lives = h('span', { class: 'mj-pips' });
	stats.append(h('div', { class: 'mj-stat' }, h('span', { class: 'mj-stat-l' }, 'Ronda'), roundEl), h('div', { class: 'mj-stat' }, h('span', { class: 'mj-stat-l' }, 'Fallos que quedan'), lives));
	const again = h('button', { class: 'mj-btn mj-main', 'aria-label': 'Ver la secuencia otra vez', onclick: () => { if (!showing && !S.over && !api.paused()) { S.replays++; S.pos = 0; show(250); } } }, 'Ver otra vez');
	ctrl.append(again);

	let showing = false, token = 0, alive = true, openK = 0, raf = 0;
	function paintRune(i, lit) {
		const b = pads[i], c = b._g.getContext('2d');
		c.clearRect(0, 0, 12, 12);
		spr(c, RUNES[i], {}, 0, 0, { mono: lit ? '#1a1206' : b._col.ink });
		b.classList.toggle('lit', lit);
	}
	function drawChest() {
		ctx.clearRect(0, 0, W, H);
		const lift = Math.round(openK * 9);
		// sombra en el suelo
		ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(8, 41, 56, 2);
		// interior (se ve al abrir) y brillo
		if (lift > 0) {
			ctx.fillStyle = th.inside; ctx.fillRect(10, 20 - lift, 52, lift + 2);
			ctx.fillStyle = '#ffe08a'; ctx.globalAlpha = 0.85; ctx.fillRect(14, 21 - lift + 2, 44, Math.max(1, lift - 3)); ctx.globalAlpha = 1;
			ctx.fillStyle = '#fff6c8'; ctx.fillRect(20, 20 - Math.min(lift, 4), 32, 2);
		}
		// tapa: curva hecha de franjas, más estrecha arriba
		const ly = 6 - lift;
		const rows = [[14, 44], [12, 48], [10, 52], [9, 54], [8, 56], [8, 56], [8, 56]];
		rows.forEach(([x, w], i) => { ctx.fillStyle = i < 2 ? th.woodHi : th.wood; ctx.fillRect(x, ly + i * 2, w, 2); });
		ctx.fillStyle = th.woodLo; for (const x of [22, 36, 50]) ctx.fillRect(x, ly + 2, 1, 12);
		ctx.fillStyle = th.dark; ctx.fillRect(14, ly - 1, 44, 1); ctx.fillRect(8, ly + 14, 56, 1);
		ctx.fillRect(7, ly + 8, 1, 6); ctx.fillRect(64, ly + 8, 1, 6);
		// caja
		ctx.fillStyle = th.wood; ctx.fillRect(8, 21, 56, 20);
		ctx.fillStyle = th.woodHi; ctx.fillRect(8, 21, 56, 1);
		ctx.fillStyle = th.woodLo; ctx.fillRect(8, 30, 56, 1); ctx.fillRect(8, 39, 56, 2); ctx.fillRect(60, 21, 4, 20);
		ctx.fillStyle = th.dark; ctx.fillRect(7, 21, 1, 21); ctx.fillRect(64, 21, 1, 21); ctx.fillRect(8, 41, 56, 1);
		// herrajes
		for (const x of [14, 54]) {
			ctx.fillStyle = th.metal; ctx.fillRect(x, 21, 4, 20); ctx.fillRect(x, ly, 4, 15);
			ctx.fillStyle = th.metalHi; ctx.fillRect(x, 21, 1, 20); ctx.fillRect(x, ly, 1, 15);
			ctx.fillStyle = th.metalLo; ctx.fillRect(x + 3, 21, 1, 20); ctx.fillRect(x + 3, ly, 1, 15);
		}
		// cerrojos: uno por ronda, entre la tapa y la caja
		const n = S.rounds.length, gap = 28 / n;
		for (let i = 0; i < n; i++) {
			const x = Math.round(22 + gap * i + gap / 2 - 3), open = i < S.round;
			ctx.fillStyle = th.dark; ctx.fillRect(x - 1, 17 - (open ? lift : 0), 8, open ? 5 : 9);
			ctx.fillStyle = open ? '#5ee08a' : th.metal; ctx.fillRect(x, 18 - (open ? lift : 0), 6, open ? 3 : 7);
			ctx.fillStyle = open ? '#c2f5d2' : th.metalHi; ctx.fillRect(x, 18 - (open ? lift : 0), 6, 1);
			if (!open) { ctx.fillStyle = th.dark; ctx.fillRect(x + 2, 21, 2, 2); }
		}
		if (openK > 0.6 && (reduced() || Math.floor(performance.now() / 180) % 2 === 0)) { spr(ctx, SPARK, SPARK_PAL, 16, 2); spr(ctx, SPARK_S, SPARK_PAL, 52, 6); spr(ctx, SPARK_S, SPARK_PAL, 34, 0); }
	}
	function hud() {
		roundEl.textContent = `${Math.min(S.round + 1, S.rounds.length)}/${S.rounds.length}`;
		lives.innerHTML = '';
		for (let i = 0; i < S.maxMistakes; i++) lives.append(h('i', { class: i < S.maxMistakes - S.mistakes ? 'on' : '' }));
		lives.setAttribute('aria-label', `${Math.max(0, S.maxMistakes - S.mistakes)}`);
		const len = lockTarget(S).length;
		dots.innerHTML = '';
		for (let i = 0; i < len; i++) dots.append(h('i', { class: !showing && i < S.pos ? 'on' : '' }));
		again.disabled = showing;
		grid.classList.toggle('showing', showing);
	}
	const sleep = ms => new Promise(r => setTimeout(r, ms));
	async function waitPause() { while (alive && api.paused() && !S.over) await sleep(120); }
	async function show(delay = 700) {
		const my = ++token;
		showing = true; hud();
		say(`**Mira bien…** ${lockTarget(S).length} runas.`);
		await sleep(delay);
		for (const p of lockTarget(S)) {
			await waitPause();
			if (my !== token || !alive || S.over) return;
			paintRune(p, true); buzz(25);
			await sleep(S.showMs * 0.62);
			paintRune(p, false);
			await sleep(S.showMs * 0.38);
		}
		if (my !== token || !alive) return;
		showing = false; hud();
		say('**Tu turno:** repite la secuencia.', 'good');
	}
	function press(i) {
		if (showing || S.over || api.paused()) return;
		paintRune(i, true); buzz(15);
		setTimeout(() => { if (alive) paintRune(i, false); }, 170);
		const r = lockPress(S, i);
		hud();
		if (r === 'ok') return;
		if (r === 'wrong') {
			const left = S.maxMistakes - S.mistakes;
			say(`Así no era. ${left > 0 ? `Puedes fallar ${left === 1 ? 'una vez' : left + ' veces'} más.` : 'Es tu última oportunidad.'} Mira otra vez.`, 'bad');
			buzz(80);
			if (!reduced()) { grid.classList.remove('shake'); void grid.offsetWidth; grid.classList.add('shake'); }
			show(900);
		} else if (r === 'round') {
			say('¡Clac! Un cerrojo menos.', 'good'); buzz([20, 30, 20]); drawChest();
			show(1000);
		} else if (r === 'open') {
			say('¡Clac, clac, clac! Se abre.', 'good');
			const t0 = performance.now();
			const anim = now => { if (!alive) return; openK = reduced() ? 1 : Math.min(1, (now - t0) / 450); drawChest(); if (openK < 1 || now - t0 < 1600) raf = requestAnimationFrame(anim); };
			raf = requestAnimationFrame(anim);
			setTimeout(() => api.end(), 500);
		} else if (r === 'fail') {
			say('El mecanismo se traba con un chasquido.', 'bad');
			setTimeout(() => api.end(), 400);
		}
		drawChest();
	}
	function size() {
		const r = api.room();
		fitCanvas(canvas, W, H, r.w, Math.max(88, r.h - grid.offsetHeight - dots.offsetHeight - 24), { maxScale: 4 });
	}
	const onResize = () => size();
	window.addEventListener('resize', onResize);
	size(); drawChest(); hud();
	show(900);

	return {
		destroy() { alive = false; token++; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); },
		helpExtra: () => [`Son ${S.rounds.length} rondas: de ${S.rounds[0]} a ${S.rounds[S.rounds.length - 1]} runas.`],
	};
}
