// Puzles de rejilla táctil (pedido de Mario: «puzzles y mecánicas»). Lógica en ../puzle.js.
// Se lanza desde un guion con `{ puzzle: { grid: [...], title, hint, theme }, onSolve: [...], onQuit: [...] }`.
// Controles: cruceta, deslizar sobre la rejilla, tocar una casilla en línea con el jugador o las flechas del teclado.
import { h, openSheet } from './core.js';
import { parsePuzzle, initState, step, tileAt, doorsOpen } from '../puzle.js';

// ---------- Arte: casillas de 16×16 dibujadas a mano (letra = color de la paleta del tema) ----------
const T = {
	floor: [
		'aaaaaaaaaaaaaaab',
		'aAaaaaaaaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'aaaaaaacaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'aaaaaaaaaaaaAaab',
		'aaaaaaaaaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'aaacaaaaaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'aaaaaaaaaaacaaab',
		'aaaaaaaaaaaaaaab',
		'aaaaaAaaaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'bbbbbbbbbbbbbbbb',
	],
	wall: [
		'WWWWWWWWWWWWWWWW',
		'WVVVVVVwWVVVVVVw',
		'WVVVVVVwWVVVVVVw',
		'WVVVVVVwWVVVVVVw',
		'wwwwwwwwwwwwwwww',
		'VVVwWVVVVVVwWVVV',
		'VVVwWVVVVVVwWVVV',
		'VVVwWVVVVVVwWVVV',
		'wwwwwwwwwwwwwwww',
		'WVVVVVVwWVVVVVVw',
		'WVVVVVVwWVVVVVVw',
		'WVVVVVVwWVVVVVVw',
		'wwwwwwwwwwwwwwww',
		'xxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxx',
	],
	ice: [
		'iiiiiiiiiiiiiiij',
		'iIIiiiiiiiiiiiij',
		'iIiiiiiiiiiiiiij',
		'iiiiiiiiiiIiiiij',
		'iiiiiiiiiIiiiiij',
		'iiiiiiiiIiiiiiij',
		'iiiiiiiiiiiiiiij',
		'iiiiiiiiiiiiiiij',
		'iiiIiiiiiiiiiiij',
		'iiIiiiiiiiiiiiij',
		'iIiiiiiiiiiiiiij',
		'iiiiiiiiiiiiiIij',
		'iiiiiiiiiiiiIIij',
		'iiiiiiiiiiiiiiij',
		'iiiiiiiiiiiiiiij',
		'jjjjjjjjjjjjjjjj',
	],
	hole: [
		'aaaaaaaaaaaaaaab',
		'aaaakkkkkkkkaaab',
		'aakkKKKKKKKKkkab',
		'akKKKKKKKKKKKKkb',
		'akKKKKKKKKKKKKkb',
		'kKKKKKKKKKKKKKKk',
		'kKKKKKKKKKKKKKKk',
		'kKKKKKKKKKKKKKKk',
		'kKKKKKKKKKKKKKKk',
		'kKKKKKKKKKKKKKKk',
		'akKKKKKKKKKKKKkb',
		'akKKKKKKKKKKKKkb',
		'aakkKKKKKKKKkkab',
		'aaaakkkkkkkkaaab',
		'aaaaaaaaaaaaaaab',
		'bbbbbbbbbbbbbbbb',
	],
	switch: [
		'aaaaaaaaaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'aaaKKKKKKKKKKaab',
		'aaKssssssssssKab',
		'aaKsLLLLLLLLsKab',
		'aaKsLssssssLsKab',
		'aaKsLsSSSSsLsKab',
		'aaKsLsSSSSsLsKab',
		'aaKsLsSSSSsLsKab',
		'aaKsLsSSSSsLsKab',
		'aaKsLssssssLsKab',
		'aaKsLLLLLLLLsKab',
		'aaKssssssssssKab',
		'aaaKKKKKKKKKKaab',
		'aaaaaaaaaaaaaaab',
		'bbbbbbbbbbbbbbbb',
	],
	doorC: [
		'WWWWWWWWWWWWWWWW',
		'WKKKKKKKKKKKKKKw',
		'WKddddddddddddKw',
		'WKdDDDdDDdDDDdKw',
		'WKdDDDdDDdDDDdKw',
		'WKdDDDdDDdDDDdKw',
		'WKddddddddddddKw',
		'WKdDDDdyydDDDdKw',
		'WKdDDDdggdDDDdKw',
		'WKddddddddddddKw',
		'WKdDDDdDDdDDDdKw',
		'WKdDDDdDDdDDDdKw',
		'WKddddddddddddKw',
		'xKKKKKKKKKKKKKKx',
		'xxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxx',
	],
	doorO: [
		'aKKaaaaaaaaaaKKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKdaaaaaaaaaadKb',
		'aKKaaaaaaaaaaKKb',
		'bbbbbbbbbbbbbbbb',
	],
	goal: [
		'aaaaaaaaaaaaaaab',
		'aaaaaaaaaaaaaaab',
		'aaaaaggggggaaaab',
		'aaaagYYYYYYgaaab',
		'aaagYyyyyyyYgaab',
		'aagYyYYYYYYyYgab',
		'aagYyYggggYyYgab',
		'aagYyYgYYgYyYgab',
		'aagYyYgYYgYyYgab',
		'aagYyYggggYyYgab',
		'aagYyYYYYYYyYgab',
		'aaagYyyyyyyYgaab',
		'aaaagYYYYYYgaaab',
		'aaaaaggggggaaaab',
		'aaaaaaaaaaaaaaab',
		'bbbbbbbbbbbbbbbb',
	],
	water: [
		'qqqqqqqqqqqqqqqq',
		'qqqqqqqqqqqqqqqq',
		'qqqQQQqqqqqqqqqq',
		'qqQqqqQqqqqqqqqq',
		'qqqqqqqqqqqqqqqq',
		'qqqqqqqqqqQQQqqq',
		'qqqqqqqqqQqqqQqq',
		'qqqqqqqqqqqqqqqq',
		'qqqqqqqqqqqqqqqq',
		'qqqQQQqqqqqqqqqq',
		'qqQqqqQqqqqqqqqq',
		'qqqqqqqqqqqqqqqq',
		'qqqqqqqqqqQQQqqq',
		'qqqqqqqqqQqqqQqq',
		'qqqqqqqqqqqqqqqq',
		'qqqqqqqqqqqqqqqq',
	],
	// roca empujable (redonda, con brillo arriba a la izquierda) y piedra fija (angulosa, con musgo)
	rock: [
		'................',
		'.....OOOOOO.....',
		'...OOrrrrrrOO...',
		'..OrRRrrrrrrrO..',
		'..OrRrrrrrrrrO..',
		'.OrRrrrrrrrrrrO.',
		'.OrrrrrrrrrrrtO.',
		'.OrrrrrrrrtrrtO.',
		'.OrrrrrrrtrrrtO.',
		'.OrrrrrrrrrrttO.',
		'.OrrrrrrrrrrttO.',
		'..OrrrrrrrtttO..',
		'..OOttttttttOO..',
		'...OOOOOOOOOO...',
		'....eeeeeeee....',
		'................',
	],
	stone: [
		'aaaaaaaaaaaaaaab',
		'aaaaOOOOOOOaaaab',
		'aaaOMMrrrrrOOaab',
		'aaOMMRrrrrrrrOab',
		'aOrMRrrrrrrrrOab',
		'aOrRrrrrrrrrtOab',
		'OrrrrrrrrrrrtrOb',
		'OrrrrrrrrrrtrrOb',
		'OrrrrrrrrrrrrtOb',
		'OrrrrrrrrrrrttOb',
		'aOrrrrrrrrrttOab',
		'aOttrrrrrrtttOab',
		'aaOOttttttttOaab',
		'aaaaOOOOOOOOaaab',
		'aaaaaeeeeeeaaaab',
		'bbbbbbbbbbbbbbbb',
	],
	// el jugador visto desde arriba: gorra con visera, mochila y brazos
	player: [
		'................',
		'.....KKKKKK.....',
		'....KCCCCCCK....',
		'...KCCcCCCCCK...',
		'...KCCCCCCCCK...',
		'...KvvvvvvvvK...',
		'...KHFFFFFFHK...',
		'....KFeFFeFK....',
		'...KKFFFFFFKK...',
		'..KFKJJJJJJKFK..',
		'..KFKJjJJjJKFK..',
		'...KKJJJJJJKK...',
		'....KPPKKPPK....',
		'....KPPK.KPPK...',
		'....KKK...KKK...',
		'................',
	],
};

const THEMES = {
	cueva: { a: '#5b4a3f', A: '#6a584b', b: '#47382f', c: '#4f4036', W: '#7d6a5a', V: '#665446', w: '#4a3b31', x: '#2c231d', d: '#6e5a3a', D: '#8a7148' },
	ruina: { a: '#8b7a5c', A: '#9c8a69', b: '#6f604a', c: '#7c6c51', W: '#b9a57e', V: '#a08c66', w: '#6e5f46', x: '#3f3527', d: '#5e6e7c', D: '#7d93a6' },
	hielo: { a: '#7d9cb8', A: '#93b0ca', b: '#5f7e9b', c: '#6f8eab', W: '#d9ecf7', V: '#b5d2e6', w: '#7fa0bd', x: '#3e5873', d: '#5a7390', D: '#7e9ab6' },
	lab: { a: '#4b5468', A: '#5a6479', b: '#394054', c: '#434b5e', W: '#8d97ab', V: '#737e93', w: '#4d566a', x: '#262c3a', d: '#3a6e8f', D: '#56a3c9' },
};
const COMMON = {
	i: '#bfe6ff', I: '#ffffff', j: '#8cc4ea',
	k: '#1c1410', K: '#0f0b09',
	s: '#7a8396', S: '#a4adbf', L: '#4d5568', // interruptor apagado
	g: '#b07a1c', Y: '#ffe27a', y: '#f2b33d',
	q: '#3a78c2', Q: '#8fc3ff',
	O: '#2e2622', r: '#9b8b7c', R: '#cdbfae', t: '#76675a', e: 'rgba(0,0,0,.28)', M: '#5f8a4a',
	C: '#3460d0', c: '#8fb0ff', v: '#1f2e4f', H: '#4a3020', F: '#f0c8a0', J: '#e5484d', P: '#2a3c66',
};
const SWITCH_ON = { s: '#b07a1c', S: '#ffe27a', L: '#f2b33d' };

const TS = 16;
function paint(ctx, tpl, pal, ox, oy, overrides) {
	for (let y = 0; y < TS; y++) {
		const row = tpl[y];
		for (let x = 0; x < TS; x++) {
			const ch = row[x];
			if (ch === '.') continue;
			const col = overrides?.[ch] || pal[ch] || COMMON[ch];
			if (!col) continue;
			ctx.fillStyle = col;
			ctx.fillRect(ox + x, oy + y, 1, 1);
		}
	}
}

/** Dibuja el puzle en un canvas a 16 px por casilla (se escala con CSS sin suavizado). */
export function drawPuzzle(canvas, P, S, { theme = 'cueva', px = null, rockAnim = null } = {}) {
	const pal = { ...COMMON, ...(THEMES[theme] || THEMES.cueva) };
	canvas.width = P.w * TS; canvas.height = P.h * TS;
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	const open = doorsOpen(P, S);
	for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) {
		const t = tileAt(P, S, x, y);
		const ox = x * TS, oy = y * TS;
		const base = { wall: T.wall, ice: T.ice, hole: T.hole, switch: T.switch, goal: T.goal, water: T.water, stone: T.stone, door: open ? T.doorO : T.doorC }[t] || T.floor;
		paint(ctx, base, pal, ox, oy, t === 'switch' && S.rocks.has(x + ',' + y) ? SWITCH_ON : null);
	}
	for (const k of S.rocks) {
		if (rockAnim && rockAnim.to === k) continue;
		const [x, y] = k.split(',').map(Number);
		paint(ctx, T.rock, pal, x * TS, y * TS);
		if (P.tiles[y][x] === 'switch') { // interruptor pulsado bajo la roca: marco dorado que se ve alrededor
			ctx.fillStyle = COMMON.Y;
			ctx.fillRect(x * TS + 1, y * TS + 1, 14, 1); ctx.fillRect(x * TS + 1, y * TS + 14, 14, 1);
			ctx.fillRect(x * TS + 1, y * TS + 1, 1, 14); ctx.fillRect(x * TS + 14, y * TS + 1, 1, 14);
		}
	}
	if (rockAnim) paint(ctx, T.rock, pal, Math.round(rockAnim.x * TS), Math.round(rockAnim.y * TS));
	const [pxX, pxY] = px || [S.x, S.y];
	paint(ctx, T.player, pal, Math.round(pxX * TS), Math.round(pxY * TS));
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Abre el puzle. Resuelve { result: 'solved' | 'quit', moves }. */
export function playPuzzle(def) {
	return new Promise(resolve => {
		const P = parsePuzzle(def);
		if (P.errors.length) { console.warn('Puzle inválido', P.errors); resolve({ result: 'solved', moves: 0 }); return; }
		let S = initState(P);
		const hist = [];
		let busy = false, done = false;
		const theme = def.theme || 'cueva';

		const canvas = h('canvas', { class: 'px pz-canvas', 'aria-label': 'Rejilla del puzle' });
		const movesEl = h('span', { class: 'pz-moves' }, '0 pasos');
		const doorEl = h('span', { class: 'pz-doors' });
		const msg = h('div', { class: 'pz-msg', role: 'status' }, def.hint || 'Llega a la casilla dorada.');
		const btn = (label, aria, fn, cls = '') => h('button', { class: 'pz-btn ' + cls, 'aria-label': aria, onclick: fn }, label);
		const undoBtn = btn('Deshacer', 'Deshacer el último paso', () => undo());
		const pad = h('div', { class: 'pz-pad' },
			btn('▲', 'Arriba', () => move('up'), 'up'),
			btn('◀', 'Izquierda', () => move('left'), 'left'),
			btn('▶', 'Derecha', () => move('right'), 'right'),
			btn('▼', 'Abajo', () => move('down'), 'down'));
		const root = h('div', { class: 'puzzle', role: 'dialog', 'aria-label': def.title || 'Puzle' },
			h('div', { class: 'pz-top' },
				h('div', { class: 'pz-title' }, def.title || 'Puzle'),
				h('button', { class: 'pz-help', 'aria-label': 'Cómo se juega', onclick: help }, '?')),
			h('div', { class: 'pz-stats' }, movesEl, doorEl),
			h('div', { class: 'pz-stage' }, canvas),
			msg,
			h('div', { class: 'pz-ctrl' },
				h('div', { class: 'pz-side' }, undoBtn, btn('Reiniciar', 'Empezar de nuevo', () => reset())),
				pad,
				h('div', { class: 'pz-side' }, btn('Salir', 'Salir del puzle', () => quit(), 'quit'))));
		document.body.append(root);
		requestAnimationFrame(() => root.classList.add('in'));

		const hasSwitch = P.tiles.some(r => r.includes('switch'));
		const hasDoor = P.tiles.some(r => r.includes('door'));
		const render = (extra = {}) => {
			drawPuzzle(canvas, P, S, { theme, ...extra });
			movesEl.textContent = `${S.moves} ${S.moves === 1 ? 'paso' : 'pasos'}`;
			if (hasSwitch) {
				let on = 0, all = 0;
				for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) if (P.tiles[y][x] === 'switch') { all++; if (S.rocks.has(x + ',' + y)) on++; }
				doorEl.textContent = `Interruptores ${on}/${all}${hasDoor ? (on === all ? ' · puerta abierta' : '') : ''}`;
			}
			undoBtn.disabled = !hist.length;
			// tamaño: casillas enteras múltiplo de 16 cuando cabe, para que el píxel salga nítido
			const avail = Math.min(root.clientWidth - 24, 520), availH = Math.max(160, root.clientHeight - 330);
			const cell = Math.max(24, Math.floor(Math.min(avail / P.w, availH / P.h)));
			canvas.style.width = cell * P.w + 'px'; canvas.style.height = cell * P.h + 'px';
		};

		function animate(prev, next, events) {
			const dist = Math.abs(next.x - prev.x) + Math.abs(next.y - prev.y);
			if (reduced() || dist === 0) { render(); return Promise.resolve(); }
			// roca que se movió (si la hubo)
			let rockAnim = null;
			const gone = [...prev.rocks].find(k => !next.rocks.has(k));
			const came = [...next.rocks].find(k => !prev.rocks.has(k));
			if (gone) {
				const [ax, ay] = gone.split(',').map(Number);
				let to = came;
				if (!to) { const f = [...next.filled].find(k => !prev.filled.has(k)); to = f; }
				const [bx, by] = (to || gone).split(',').map(Number);
				rockAnim = { from: [ax, ay], dest: [bx, by], to: came };
			}
			const per = events.includes('slide') ? 70 : 110;
			const total = per * Math.max(dist, rockAnim ? Math.abs(rockAnim.dest[0] - rockAnim.from[0]) + Math.abs(rockAnim.dest[1] - rockAnim.from[1]) : 0);
			return new Promise(res => {
				const t0 = performance.now();
				const frame = now => {
					const k = Math.min(1, (now - t0) / total);
					const pk = Math.min(1, (now - t0) / (per * dist));
					const px = [prev.x + (next.x - prev.x) * pk, prev.y + (next.y - prev.y) * pk];
					const ra = rockAnim && { x: rockAnim.from[0] + (rockAnim.dest[0] - rockAnim.from[0]) * k, y: rockAnim.from[1] + (rockAnim.dest[1] - rockAnim.from[1]) * k, to: rockAnim.to };
					// mientras la roca vuela hacia un hoyo, el hoyo sigue abierto
					const view = rockAnim && !rockAnim.to && k < 1 ? { ...next, filled: prev.filled } : next;
					drawPuzzle(canvas, P, view, { theme, px, rockAnim: k < 1 ? ra : null });
					if (k < 1) requestAnimationFrame(frame); else { render(); res(); }
				};
				requestAnimationFrame(frame);
			});
		}

		const say = t => { msg.textContent = t; };
		let queued = null; // un toque rápido durante la animación no se pierde: se juega al terminar
		async function move(dir) {
			if (done) return;
			if (busy) { queued = dir; return; }
			const r = step(P, S, dir);
			if (!r.moved) { root.classList.remove('bump'); void root.offsetWidth; root.classList.add('bump'); try { navigator.vibrate?.(15); } catch (e) { /* */ } return; }
			busy = true;
			hist.push(S);
			const prev = S; S = r.state;
			await animate(prev, S, r.events);
			if (r.events.includes('fill')) say('¡La roca tapa el hoyo! Ya se puede pasar por encima.');
			else if (r.events.includes('door')) say(doorsOpen(P, S) ? '¡Clac! La puerta se abre.' : 'La puerta vuelve a cerrarse…');
			else if (r.events.includes('slide')) say('¡Resbalas por el hielo!');
			busy = false;
			if (S.solved) {
				done = true;
				root.classList.add('win');
				say(`¡Resuelto en ${S.moves} ${S.moves === 1 ? 'paso' : 'pasos'}!`);
				try { navigator.vibrate?.([30, 40, 60]); } catch (e) { /* */ }
				setTimeout(() => close({ result: 'solved', moves: S.moves }), reduced() ? 400 : 1100);
				return;
			}
			if (queued) { const d = queued; queued = null; if (!document.querySelector('.sheet')) move(d); }
		}
		function undo() { if (busy || done || !hist.length) return; S = hist.pop(); say('Paso deshecho.'); render(); }
		function reset() { if (busy || done) return; hist.length = 0; S = initState(P); say(def.hint || 'Desde el principio.'); render(); }
		async function quit() {
			if (busy || done) return;
			const ok = await new Promise(res => {
				const sh = openSheet('¿Salir del puzle?', [
					h('div', { class: 'note' }, 'Podrás volver a intentarlo cuando quieras; empezará desde el principio.'),
					h('div', { class: 'pz-confirm' },
						h('button', { class: 'btn', onclick: () => { sh.close(); res(true); } }, 'Salir'),
						h('button', { class: 'btn primary', onclick: () => { sh.close(); res(false); } }, 'Seguir intentando')),
				], { onClose: () => res(false) });
			});
			if (ok) close({ result: 'quit', moves: S.moves });
		}
		let helpSheet = null;
		function help() {
			if (done) return;
			const leg = [
				['Llega a la casilla dorada para resolverlo.'],
				P.rocks.size ? ['**Rocas:** camina contra una para empujarla una casilla. No se pueden empujar dos a la vez ni sacarlas de una esquina.'] : null,
				P.tiles.some(r => r.includes('ice')) ? ['**Hielo:** resbalas hasta chocar con algo o salir del hielo. Las rocas también resbalan.'] : null,
				hasSwitch ? ['**Interruptores:** se pulsan con una roca encima. Cuando están todos pulsados, se abren las puertas.'] : null,
				P.tiles.some(r => r.includes('hole')) ? ['**Hoyos:** no se pueden pisar. Empuja una roca dentro para taparlo.'] : null,
				['Si te atascas, **Deshacer** quita el último paso y **Reiniciar** lo deja como al principio.'],
				['Mueve con la cruceta, deslizando el dedo sobre la rejilla o tocando una casilla en línea contigo.'],
			].filter(Boolean);
			helpSheet = openSheet('Cómo se juega', [h('div', { class: 'list pz-legend' }, ...leg.map(([t]) => h('div', { class: 'row' }, h('div', { class: 'lbl', html: t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') }))))]);
		}
		function close(res) {
			if (helpSheet?.el.isConnected) helpSheet.close();
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('resize', onResize);
			root.classList.remove('in');
			setTimeout(() => root.remove(), reduced() ? 0 : 250);
			resolve(res);
		}

		// Teclado, deslizar y tocar
		const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
		const onKey = e => { if (KEYS[e.key] && !document.querySelector('.sheet')) { e.preventDefault(); move(KEYS[e.key]); } };
		const onResize = () => render();
		window.addEventListener('keydown', onKey);
		window.addEventListener('resize', onResize);
		let t0 = null;
		canvas.addEventListener('pointerdown', e => { t0 = { x: e.clientX, y: e.clientY }; try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* */ } });
		canvas.addEventListener('pointercancel', () => { t0 = null; });
		canvas.addEventListener('pointerup', e => {
			if (!t0) return;
			const dx = e.clientX - t0.x, dy = e.clientY - t0.y; t0 = null;
			if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) { move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')); return; }
			const rc = canvas.getBoundingClientRect();
			const cx = Math.floor((e.clientX - rc.left) / rc.width * P.w), cy = Math.floor((e.clientY - rc.top) / rc.height * P.h);
			if (cx === S.x && cy !== S.y) move(cy < S.y ? 'up' : 'down');
			else if (cy === S.y && cx !== S.x) move(cx < S.x ? 'left' : 'right');
		});
		render();
	});
}
