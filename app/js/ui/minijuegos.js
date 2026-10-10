// Minijuegos para conseguir objetos (pedido de Mario: «más mecánicas para obtener objetos, con las manos»).
// Lógica pura en ../minijuegos.js; cada juego tiene su interfaz en mj-*.js y el arte está en mj-arte.js.
// Este archivo es el marco común: título, ayuda «?», mensajes, Salir con confirmación, cierre y resumen del botín.
// Formato del contenido: docs/MINIJUEGOS.md.
import { h, openSheet } from './core.js';
import { G } from '../state.js';
import { itemName } from '../data.js';
import { itemImg } from '../art.js';
import { UI } from '../guion.js';
import { prepare, create, finish, MINI_INFO } from '../minijuegos.js';
import { mountDig } from './mj-dig.js';
import { mountFish } from './mj-fish.js';
import { mountCatch } from './mj-catch.js';
import { mountAura } from './mj-aura.js';
import { mountLock } from './mj-lock.js';

const MOUNT = { dig: mountDig, fish: mountFish, catch: mountCatch, aura: mountAura, lock: mountLock };
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz = p => { try { navigator.vibrate?.(p); } catch (e) { /* sin vibración */ } };
const rich = t => h('span', { html: String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') });

const END_TEXT = {
	dig: { win: '¡Lo has sacado!', lose: 'La pared se vino abajo' },
	fish: { win: '¡Lo tienes!', lose: 'Se escapó…' },
	catch: { win: '¡Buena cosecha!', lose: 'Casi todo al suelo…' },
	aura: { win: '¡Encontrado!', lose: 'Sin pulsos' },
	lock: { win: '¡Clac! Abierta', lose: 'Se ha bloqueado' },
};

/**
 * Juega un minijuego. Acepta una partida ya preparada (`prepare`) o una definición de guion.
 * Resuelve { result: 'win'|'lose'|'quit', score: 0..1, won: [índices de la carga], wild? }.
 */
export function playMinigame(def) {
	return new Promise(resolve => {
		let P;
		try { P = def.cargo ? def : prepare({ def, G }); } catch (e) { console.warn('Minijuego inválido', e); resolve({ result: 'win', score: 0.5, won: [] }); return; }
		const S = create(P);
		if (typeof window !== 'undefined' && window.__mjTest) window.__mjTest.cur = { P, S }; // gancho para las pruebas con navegador
		const info = MINI_INFO[P.type];
		let done = false, game = null, helpSheet = null;

		const stats = h('div', { class: 'mj-stats' });
		const stage = h('div', { class: 'mj-stage' });
		const msg = h('div', { class: 'mj-msg', role: 'status', 'aria-live': 'polite' });
		const ctrl = h('div', { class: 'mj-game-ctrl' });
		const quitBtn = h('button', { class: 'mj-btn quit', 'aria-label': 'Salir del minijuego', onclick: () => quit() }, 'Salir');
		const root = h('div', { class: 'mj', 'data-noswipe': '', role: 'dialog', 'aria-label': P.title, 'data-type': P.type, 'data-theme': P.theme },
			h('div', { class: 'mj-top' },
				h('div', { class: 'mj-title' }, P.title),
				h('button', { class: 'mj-help', 'aria-label': 'Cómo se juega', onclick: () => help() }, '?')),
			stats, stage, msg,
			h('div', { class: 'mj-ctrl' }, ctrl, quitBtn));
		document.body.append(root);
		requestAnimationFrame(() => root.classList.add('in'));

		const say = (t, kind = '') => { msg.innerHTML = ''; msg.append(rich(t)); msg.dataset.kind = kind; };
		const paused = () => done || !!document.querySelector('.sheet');
		const api = {
			P, S, root, stage, stats, ctrl, say, buzz, reduced, paused,
			/** Hueco disponible para el lienzo, en píxeles CSS. */
			room: (reserve = 0) => ({ w: Math.min(stage.clientWidth || root.clientWidth - 24, 520), h: Math.max(140, (stage.clientHeight || root.clientHeight - 300) - reserve) }),
			end: () => end(),
		};
		say(P.hint || info.help[0]);
		game = MOUNT[P.type](api);

		function end(quitting = false) {
			if (done) return;
			done = true;
			const res = finish(P, S, { quit: quitting });
			if (quitting) { close(res); return; }
			const win = res.result === 'win';
			root.classList.add(win ? 'win' : 'lose');
			buzz(win ? [30, 40, 60] : 80);
			stage.append(h('div', { class: 'mj-end ' + res.result }, h('div', { class: 'mj-end-t' }, P.type === 'fish' && S.over === 'snap' ? 'Se partió el sedal' : END_TEXT[P.type][res.result]),
				res.wild ? h('div', { class: 'mj-end-s' }, '¡Es un Pokémon salvaje!') : null));
			setTimeout(() => close(res), reduced() ? 900 : 1500);
		}
		async function quit() {
			if (done) return;
			const ok = await new Promise(res => {
				const sh = openSheet('¿Salir?', [
					h('div', { class: 'note' }, P.mode === 'gather' ? 'Si sales ahora, te llevas solo lo básico, como al recoger rápido.' : 'Si sales ahora, no te llevas nada. Podrás volver a intentarlo.'),
					h('div', { class: 'mj-confirm' },
						h('button', { class: 'btn', onclick: () => { res(true); sh.close(); } }, 'Salir'),
						h('button', { class: 'btn primary', onclick: () => { res(false); sh.close(); } }, 'Seguir jugando')),
				], { onClose: () => res(false) });
			});
			if (ok) end(true);
		}
		function help() {
			if (done) return;
			const lines = [...info.help, ...(game?.helpExtra?.() || [])];
			helpSheet = openSheet('Cómo se juega', [h('div', { class: 'list mj-legend' }, ...lines.map(t => h('div', { class: 'row' }, h('div', { class: 'lbl' }, rich(t)))))]);
		}
		function close(res) {
			if (helpSheet?.el.isConnected) helpSheet.close();
			try { game?.destroy?.(); } catch (e) { console.warn(e); }
			root.classList.remove('in');
			setTimeout(() => root.remove(), reduced() ? 0 : 220);
			resolve(res);
		}
	});
}

/**
 * Resumen del botín. `items`: [{ id, n, fresh, extra }]. Resuelve al tocar Continuar.
 * `note` es una línea opcional debajo (por ejemplo, lo que aporta la montura).
 */
export function showLoot({ title = '¡Botín!', text = '', items = [], note = '' } = {}) {
	return new Promise(resolve => {
		const close = () => { ov.remove(); resolve(); };
		const ov = h('div', { class: 'mj-loot', 'data-noswipe': '', role: 'dialog', 'aria-label': title },
			h('div', { class: 'mj-loot-card' },
				h('div', { class: 'mj-loot-title' }, title),
				text ? h('div', { class: 'mj-loot-text' }, rich(text)) : null,
				items.length
					? h('div', { class: 'mj-loot-list' }, ...items.map((it, i) => h('div', { class: 'mj-loot-row' + (it.extra ? ' extra' : ''), style: { animationDelay: (reduced() ? 0 : i * 70) + 'ms' } },
						itemImg(it.id),
						h('div', { class: 'mj-loot-name' }, itemName(it.id)),
						it.extra ? h('span', { class: 'mj-chip extra' }, 'Extra') : null,
						it.fresh ? h('span', { class: 'mj-chip new' }, 'Nuevo') : null,
						h('b', { class: 'mj-loot-n' }, '×' + it.n))))
					: h('div', { class: 'mj-loot-text' }, 'Esta vez no ha salido nada.'),
				note ? h('div', { class: 'mj-loot-note' }, rich(note)) : null,
				h('button', { class: 'btn primary mj-loot-ok', onclick: close }, 'Continuar')));
		document.body.append(ov);
		requestAnimationFrame(() => ov.classList.add('in'));
	});
}

// El intérprete de guiones usa este resumen si hay interfaz (ver el paso `minigame` en guion.js).
UI.minigameLoot = showLoot;
