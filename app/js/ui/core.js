// Utilidades de interfaz: creación de elementos, diálogos, elecciones, avisos.
import { fmtText, esc } from '../util.js';
import { portraitCanvas, trainerImg } from '../art.js';
import { G } from '../state.js';
import { C, topLoc } from '../content.js';

export function h(tag, attrs = {}, ...kids) {
	const el = document.createElement(tag);
	for (const k in attrs) {
		const v = attrs[k];
		if (v === undefined || v === null || v === false) continue;
		if (k === 'class') el.className = v;
		else if (k === 'html') el.innerHTML = v;
		else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
		else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
		else if (v === true) el.setAttribute(k, '');
		else el.setAttribute(k, v);
	}
	for (const kid of kids.flat()) {
		if (kid === null || kid === undefined || kid === false) continue;
		el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
	}
	return el;
}
export const $ = (s, r = document) => r.querySelector(s);
export const app = () => document.getElementById('app');

let speed = 2;
export function setTextSpeed(s) { speed = s; }

/** Retrato para un NPC: sprite de entrenador (canon) o retrato procedural (original). */
export function portraitFor(n) {
	if (!n) return null;
	if (n.id === 'jugador' || n.portrait === 'jugador') return portraitCanvas({ ...(G.player.look || {}), bg: '#2a3c66' });
	if (n.sprite) return trainerImg(n.sprite, n.look || { seed: n.name });
	return portraitCanvas({ ...(n.look || { seed: n.name }), bg: n.bg || n.look?.bg || '#2a3c66' });
}

// ---------- Diálogo ----------
/** Muestra un texto con retrato y nombre opcionales. Resuelve al tocar. */
export function say(n, text, opts = {}) {
	logLine({ k: n ? 'say' : 'narr', n: n?.name || null, t: text });
	return new Promise(resolve => {
		const ov = h('div', { class: 'overlay' + (opts.dim ? ' dim' : '') });
		const portrait = n && n.portrait !== false ? portraitFor(n) : null;
		const box = h('div', { class: 'dialog' + (portrait ? '' : ' noportrait') + (n ? '' : ' narr') });
		if (portrait) box.append(h('div', { class: 'portrait' }, portrait));
		if (n?.name) box.append(h('div', { class: 'nameplate' }, n.name));
		box.append(logButton());
		const tb = h('div', { class: 'textbox', role: 'status', 'aria-live': 'polite' });
		box.append(tb);
		ov.append(box);
		document.body.append(ov);
		// Escritura progresiva
		const html = fmtText(text);
		const plain = text.length;
		let shown = false, timer = null, shownAt = 0;
		// La boca del retrato se mueve mientras se escribe el texto (si el retrato es procedural)
		const mouth = on => box.querySelector('.portrait canvas')?.talk?.(on);
		const full = () => { shown = true; shownAt = Date.now(); clearInterval(timer); mouth(false); tb.innerHTML = html + '<span class="more"></span>'; };
		if (speed >= 3 || plain < 2) full();
		else {
			mouth(true);
			const tmp = h('div', { html });
			const textNodes = [];
			const walk = el => { for (const c of el.childNodes) { if (c.nodeType === 3) { textNodes.push([c, c.textContent]); c.textContent = ''; } else walk(c); } };
			walk(tmp);
			tb.innerHTML = '';
			tb.append(...tmp.childNodes);
			let ni = 0, ci = 0;
			const step = speed === 1 ? 1 : 3;
			timer = setInterval(() => {
				for (let k = 0; k < step; k++) {
					if (ni >= textNodes.length) { full(); return; }
					const [node, str] = textNodes[ni];
					node.textContent = str.slice(0, ++ci);
					if (ci >= str.length) { ni++; ci = 0; }
				}
			}, 16);
		}
		const done = () => {
			if (!shown) { full(); return; }
			// Un toque doble (o un toque de más) no se salta la línea que acaba de aparecer
			if (Date.now() - shownAt < 280) return;
			ov.remove();
			resolve();
		};
		ov.addEventListener('click', done);
		ov.tabIndex = 0;
		ov.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') done(); });
		setTimeout(() => ov.focus(), 30);
	});
}

/** Lista de opciones. Resuelve con el índice elegido. */
export function choose(prompt, options, opts = {}) {
	return new Promise(resolve => {
		const ov = h('div', { class: 'overlay dim' });
		const box = h('div', { class: 'choices' });
		if (prompt) box.append(h('div', { class: 'prompt' }, prompt));
		options.forEach((o, i) => {
			box.append(h('button', { onclick: () => { if (opts.choice) logLine({ k: 'pick', t: o }); ov.remove(); resolve(i); } }, h('span', { html: fmtText(o) })));
		});
		ov.append(box);
		if (opts.cancel !== undefined) ov.addEventListener('click', e => { if (e.target === ov) { ov.remove(); resolve(opts.cancel); } });
		document.body.append(ov);
	});
}

/** Pregunta de texto (nombre, mote...). */
export function prompt(question, def = '', { max = 12 } = {}) {
	return new Promise(resolve => {
		const ov = h('div', { class: 'overlay dim' });
		const input = h('input', { class: 'field-input', value: def, maxlength: max, autocomplete: 'off', enterkeyhint: 'done' });
		const ok = () => { const v = input.value.trim(); ov.remove(); resolve(v); };
		input.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
		const box = h('div', { class: 'choices' },
			h('div', { class: 'prompt' }, question),
			input,
			h('button', { onclick: ok, style: { textAlign: 'center' } }, 'Aceptar'));
		ov.append(box);
		document.body.append(ov);
		setTimeout(() => input.focus(), 50);
	});
}

export async function confirm(question, yes = 'Sí', no = 'No') {
	return (await choose(question, [yes, no])) === 0;
}

// ---------- Historial de conversaciones ----------
// Guarda las últimas líneas de diálogo, narración, cinemáticas y elecciones de historia,
// para poder releerlas si se pasaron sin querer. Va dentro de la partida (G.dlog).
const LOG_MAX = 400;
export function logLine(e) {
	if (!G || !e?.t) return;
	const L = (G.dlog ||= []);
	const last = L[L.length - 1];
	if (last && last.t === e.t && last.n === e.n && last.k === e.k) return;
	L.push({ ...e, l: G.loc || null, at: Date.now() });
	if (L.length > LOG_MAX) L.splice(0, L.length - LOG_MAX);
}
/** Botón pequeño para abrir el historial sin cerrar el diálogo. */
export function logButton(cls = 'dlg-log') {
	return h('button', { class: cls, 'aria-label': 'Releer la conversación', title: 'Releer', onclick: e => { e.stopPropagation(); openDialogLog(); } }, '📜');
}
function placeName(id) {
	if (!id) return '';
	const L = C.locations?.[id];
	const top = topLoc(id);
	return L?.name ? (top && top.id !== id && top.name ? `${L.name} · ${top.name}` : L.name) : '';
}
export function openDialogLog() {
	const sheet = openSheet('Conversaciones', null);
	sheet.el.classList.add('dlog-sheet');
	const all = (G?.dlog || []).slice();
	let limit = 150;
	const draw = () => {
		const items = all.slice(-limit);
		if (!items.length) { sheet.set(h('div', { class: 'empty' }, 'Todavía no hay conversaciones guardadas. A partir de ahora, todo lo que te digan se queda aquí.')); return; }
		const out = [];
		if (all.length > items.length) out.push(h('button', { class: 'btn dlog-more', onclick: () => { limit += 150; draw(); } }, `Ver anteriores (${all.length - items.length})`));
		let lastPlace = null, lastDay = null;
		for (const e of items) {
			const day = new Date(e.at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
			const place = placeName(e.l);
			if (place !== lastPlace || day !== lastDay) {
				out.push(h('div', { class: 'dlog-place' }, (place || 'En camino') + ' · ' + day));
				lastPlace = place; lastDay = day;
			}
			if (e.k === 'pick') out.push(h('div', { class: 'dlog-line pick', html: '➜ ' + fmtText(e.t) }));
			else if (e.k === 'say') out.push(h('div', { class: 'dlog-line' }, h('b', {}, e.n), h('span', { html: ' ' + fmtText(e.t) })));
			else out.push(h('div', { class: 'dlog-line narr', html: fmtText(e.t) }));
		}
		sheet.set(h('div', { class: 'dlog' }, ...out));
		requestAnimationFrame(() => { sheet.body.scrollTop = limit > 150 ? 0 : sheet.body.scrollHeight; });
	};
	draw();
	return sheet;
}

// ---------- Avisos ----------
let toastWrap = null;
export function toast(text, kind = '') {
	if (!toastWrap) { toastWrap = h('div', { class: 'toasts' }); document.body.append(toastWrap); }
	const t = h('div', { class: 'toast ' + kind, html: fmtText(text) });
	toastWrap.append(t);
	setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 2600);
	setTimeout(() => t.remove(), 3100);
}

// ---------- Hojas (pantallas superpuestas) ----------
const sheets = [];
export function openSheet(title, body, { onClose, actions } = {}) {
	const el = h('div', { class: 'sheet', role: 'dialog', 'aria-label': title });
	const close = () => { el.remove(); sheets.splice(sheets.indexOf(api), 1); onClose?.(); };
	const head = h('div', { class: 'sheet-head' }, h('h2', {}, title), actions || null, h('button', { class: 'x', 'aria-label': 'Cerrar', onclick: close }, '✕'));
	const bodyEl = h('div', { class: 'sheet-body' });
	el.append(head, bodyEl);
	document.body.append(el);
	const api = {
		el, body: bodyEl, close,
		set(content) { bodyEl.innerHTML = ''; bodyEl.append(...[].concat(content).filter(Boolean)); },
		title(t) { head.querySelector('h2').textContent = t; },
	};
	sheets.push(api);
	if (body) api.set(typeof body === 'function' ? body(api) : body);
	return api;
}
export function closeAllSheets() { while (sheets.length) sheets[sheets.length - 1].close(); }

export { esc, fmtText };
