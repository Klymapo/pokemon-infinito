// Pantallas principales: título, creación, lugar, ruta, mapa y menús.
import { D, toID, TYPE_COLORS, typeStyle, typeName, STAT_NAMES, STATS, abilityName, natureName, moveName, itemName } from '../data.js';
import { C, topLoc } from '../content.js';
import {
	G, newGame, setG, saveGame, beginScene, endScene, loadSaved, exportSave, importSave, deleteSave, evalCond, addItem, removeItem, count, markCaught, BOX_MAX, boxInsert,
} from '../state.js';
import {
	createPokemon, displayName, maxHp, calcStats, healFull, expProgress, checkEvolution, addHappy, natureMod, canLearn,
} from '../pokemon.js';
import {
	L, isRoute, spotsOf, descOf, tramoItems, tramoTerrain, encounterTable, encounterOdds, rollWild, mounted, encounterRate, canMove,
	markTramo, walkFriendship, findPath, canEnter, healParty, whiteout, trainingOpen, avgLevel, pendingNotices, routeProg, activeEvents, eventCalendar,
} from '../world.js';
import { runScript, runFirst, UI, tx, findRiolu } from '../guion.js';
import { monImg, itemImg, sceneCanvas, portraitCanvas, HAIRS, LOOK_DEFAULTS, ballIcon, pxItem } from '../art.js';
import { h, $, app, say, readPaper, choose, prompt, confirm, toast, openSheet, closeAllSheets, topSheet, onSwipe, lastTab, slideIn, setTextSpeed, portraitFor, logLine, logButton, openDialogLog } from './core.js';
import { runBattle, learnMoveUI, evolveUI } from './battle-ui.js';
import { resolveLook } from '../retrato.js';
import { announceUniques, announceRetro, uniqueEncounter, openUniques, uniquesDue } from './unicos-ui.js';
import { retroUniques } from '../unicos.js';
import { openTutor } from './tutor.js';
import { evolutionInfo } from '../movimientos.js';
import { moveMany, moveBox, swapBoxes, boxName, hasBoxName, setBoxName, BOX_NAME_MAX } from '../pc.js';
import { playPuzzle } from './rejilla.js';
import { openVentures, openVenture, setVentureHooks } from './negocios-ui.js';
import { ventureList, venturesSummary, pending as venturePending } from '../negocios.js';
import { phase, PHASE_NAMES, isNight } from '../time.js';
import { fmtMoney, fmtText, rng, pick, fmtDuration, clone } from '../util.js';

const PHASE_ICON = { manana: '🌅', dia: '☀️', tarde: '🌇', noche: '🌙' };
const STATUS_ES = { par: 'PAR', brn: 'QUE', psn: 'ENV', tox: 'ENV', slp: 'DOR', frz: 'CON' };
const POCKETS = [
	['medicine', 'Medicinas'], ['pokeballs', 'Poké Balls'], ['misc', 'Objetos'], ['berries', 'Bayas'], ['battle', 'Combate'], ['machines', 'MT'], ['key', 'Clave'],
];
let busy = false; // evita dobles toques mientras corre un guion o combate
let routeMsg = '';

// =================== Ganchos para guiones ===================
export function installHooks() {
	Object.assign(UI, {
		say: (n, t, o) => say(n, t, o),
		choose: (p, opts) => choose(p, opts),
		prompt: (q, d) => prompt(q, d),
		toast: (t, k) => toast(t, k),
		refresh: () => render(),
		goto: (id, o) => enterLocation(id, o),
		battle: cfg => battle(cfg),
		receivePokemon: (p, o) => receivePokemon(p, o),
		learnMove: (p, m, o) => learnMoveUI(p, m, o),
		nickname: p => askNickname(p),
		shop: id => openShop(id),
		center: () => pokemonCenter(),
		pc: () => openPC(),
		evolveCheck: async () => { for (const p of G.party) await tryEvolve(p, { trigger: 'level' }); },
		forceEvolve: (p, to) => evolveUI(p, to),
		cutscene: spec => playCutscene(spec),
		puzzle: def => playPuzzle(def),
		read: (title, text, itemId) => readPaper(title, text, { icon: itemId ? itemImg(itemId) : null }),
		venture: id => openVenture(id),
	});
	setVentureHooks({ travel: id => guarded(() => travelTo(id)), summary: (p, onChange) => openSummary(p, onChange, { battle: true, hp: p.hp, maxhp: maxHp(p) }) });
}

// =================== Cinemáticas ===================
/**
 * Escena corta a pantalla completa con bandas de cine. spec:
 * { bg: {type, ...}, start: 'dark'|'light', frames: [{ text, item, npc, mon, fx }] }
 * fx: 'light' (la luz se abre desde el centro), 'dark', 'flash', 'shake', 'glow', 'zoom'.
 * Se avanza tocando. Respeta «reducir movimiento» del sistema.
 */
async function playCutscene(spec = {}) {
	const bg = sceneCanvas({ ...(spec.bg || {}), seed: (spec.bg?.seed || G.loc || 'cs') + 'cs' });
	bg.classList.add('cs-bg');
	const veil = h('div', { class: 'cs-veil' + (spec.start === 'dark' ? ' on' : '') });
	const center = h('div', { class: 'cs-center' });
	const cap = h('div', { class: 'cs-cap' });
	const hint = h('div', { class: 'cs-hint' }, 'Toca para seguir');
	const stage = h('div', { class: 'cs-stage' }, bg, center, veil);
	const root = h('div', { class: 'cutscene', role: 'dialog', 'aria-label': 'Escena' }, h('div', { class: 'cs-bar top' }, logButton('dlg-log cs-log')), stage, h('div', { class: 'cs-bar bot' }, cap, hint));
	document.body.append(root);
	requestAnimationFrame(() => root.classList.add('in'));
	const tap = () => new Promise(r => { const f = () => { root.removeEventListener('click', f); r(); }; setTimeout(() => root.addEventListener('click', f), 250); });
	for (const fr of spec.frames || []) {
		if (fr.item || fr.npc || fr.mon) {
			center.innerHTML = '';
			const el = fr.item ? (pxItem(fr.item, 96) || itemImg(fr.item)) : fr.npc ? portraitFor({ id: fr.npc, ...C.npcs[fr.npc] }) : monImg(fr.mon, { anim: true });
			center.append(h('div', { class: 'cs-obj' }, el));
		}
		if (fr.clear) center.innerHTML = '';
		for (const k of ['light', 'glow', 'shake', 'zoom']) stage.classList.remove('fx-' + k);
		if (fr.fx === 'dark') veil.className = 'cs-veil on';
		if (fr.fx === 'light') { veil.className = 'cs-veil on'; void veil.offsetWidth; veil.className = 'cs-veil open'; }
		if (fr.fx === 'flash') { const f = h('div', { class: 'cs-flash' }); stage.append(f); setTimeout(() => f.remove(), 600); }
		if (fr.fx && fr.fx !== 'dark' && fr.fx !== 'flash') { void stage.offsetWidth; stage.classList.add('fx-' + fr.fx); }
		cap.innerHTML = fr.text ? fmtText(tx(fr.text)) : '';
		if (fr.text) logLine({ k: 'narr', t: tx(fr.text) });
		await tap();
	}
	root.classList.remove('in');
	await new Promise(r => setTimeout(r, 300));
	root.remove();
}

// =================== Título ===================
export async function titleScreen() {
	const root = app();
	root.innerHTML = '';
	const saved = await loadSaved();
	const bg = sceneCanvas({ type: 'city', landmark: 'prism', seed: 'title' });
	bg.classList.add('bg');
	const screen = h('div', { class: 'title-screen' }, bg,
		h('div', { class: 'logo' }, h('div', { class: 'a' }, 'POKéMON'), h('div', { class: 'b' }, 'Infinite'), h('span', { class: 'inf' }, '∞')),
		saved ? h('button', { class: 'btn primary', onclick: () => continueGame(saved) }, `Continuar · ${saved.player.name} · ${fmtDuration(saved.playMs || 0)}`) : null,
		h('button', { class: 'btn' + (saved ? '' : ' primary'), onclick: () => saved ? confirmNew() : creation() }, 'Nueva partida'),
		h('button', { class: 'btn', onclick: importBackup }, 'Importar respaldo'),
		h('div', { class: 'ver' }, 'Contenido ' + (C.version || '') + ' · ' + C.blocks.map(b => b.title).join(' · ')),
	);
	root.append(screen);
	async function confirmNew() {
		if (await confirm('Ya tienes una partida guardada. Si empiezas otra, se sobrescribirá al guardar. ¿Seguro?', 'Empezar de cero', 'Cancelar')) creation();
	}
}

async function importBackup() {
	const input = h('input', { type: 'file', accept: '.json,application/json,text/plain' });
	input.onchange = async () => {
		const f = input.files[0];
		if (!f) return;
		try {
			importSave(await f.text());
			await saveGame();
			toast('Respaldo importado');
			continueGame(G);
		} catch (e) { toast('No se pudo importar: ' + e.message); }
	};
	input.click();
}

function continueGame(save) {
	setG(save);
	mainSwipe();
	try { const added = retroUniques(); if (added.length) G.uniq.retroNews = added; } catch (e) { console.error(e); }
	startClock();
	render();
}

let clockStarted = false;
function startClock() {
	if (clockStarted) return;
	clockStarted = true;
	let last = Date.now();
	setInterval(() => { const n = Date.now(); if (G && document.visibilityState === 'visible') G.playMs = (G.playMs || 0) + (n - last); last = n; }, 5000);
	document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && G) saveGame(); });
}

// =================== Aspecto del entrenador ===================
/** Vista previa y controles para editar un look. Devuelve { preview, parts }. */
function lookEditor(look, { size = 120 } = {}) {
	const preview = h('div', { style: { width: size + 'px', height: size + 'px', borderRadius: '20px', overflow: 'hidden', border: '3px solid var(--cream)', margin: '0 auto' } });
	const redraw = () => { preview.innerHTML = ''; const c = portraitCanvas(look); c.style.width = '100%'; c.style.height = '100%'; preview.append(c); };
	const swatchRow = (colors, key) => {
		const row = h('div', { class: 'swatches' });
		colors.forEach((c, i) => {
			const val = key === 'skin' ? i : c;
			const b = h('button', { 'aria-label': 'Color', style: { background: c }, class: look[key] === val ? 'on' : '' });
			b.onclick = () => { look[key] = val; row.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); redraw(); };
			row.append(b);
		});
		return row;
	};
	const optRow = (key, opts) => {
		const row = h('div', { class: 'tabs', style: { flexWrap: 'wrap' } });
		opts.forEach(([k, n]) => {
			const b = h('button', { class: look[key] === k ? 'on' : '' }, n);
			b.onclick = () => { look[key] = k; row.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); redraw(); };
			row.append(b);
		});
		return row;
	};
	const T = t => h('div', { class: 'section-title' }, t);
	redraw();
	return {
		preview,
		parts: [
			T('Piel'), swatchRow(['#ffe0c7', '#f5cba7', '#e0ac85', '#c68863', '#9a6646', '#6e4630'], 'skin'),
			T('Cara'), optRow('head', [['round', 'Redonda'], ['oval', 'Ovalada'], ['square', 'Cuadrada'], ['heart', 'Corazón'], ['long', 'Alargada']]),
			T('Mirada'), optRow('eyesStyle', [['normal', 'Normal'], ['big', 'Grandes'], ['almond', 'Almendrados'], ['sharp', 'Afilados'], ['sleepy', 'Tranquilos'], ['lashes', 'Pestañas']]),
			T('Cejas'), optRow('brows', [['soft', 'Suaves'], ['straight', 'Rectas'], ['thick', 'Gruesas'], ['angry', 'Decididas'], ['thin', 'Finas']]),
			T('Peinado'), optRow('hair', [['short', 'Corto'], ['sidepart', 'Raya'], ['fringe', 'Flequillo'], ['pixie', 'Muy corto'], ['long', 'Largo'], ['waves', 'Ondas'], ['bob', 'Melena'], ['ponytail', 'Coleta'], ['hightail', 'Coleta alta'], ['twintails', 'Dos coletas'], ['braids', 'Trenzas'], ['spiky', 'Puntas'], ['wild', 'Revuelto'], ['curly', 'Rizado'], ['afro', 'Afro'], ['bun', 'Moño'], ['buzz', 'Rapado'], ['cap', 'Gorra']]),
			T('Color de pelo'), swatchRow(HAIRS, 'hairColor'),
			T('Ojos'), swatchRow(['#3a5fc4', '#3f8a4f', '#6b4a2b', '#2b2b38', '#8c6cd0', '#c4473a'], 'eyes'),
			T('Ropa'), optRow('collar', [['jacket', 'Chaqueta'], ['tshirt', 'Camiseta'], ['hoodie', 'Sudadera'], ['shirt', 'Camisa'], ['coat', 'Abrigo'], ['scarf', 'Bufanda']]),
			swatchRow(['#4c7cf0', '#c4473a', '#3f9d58', '#d8a85a', '#8c6cd0', '#2b2b38', '#e9e3d0', '#e07a3a'], 'outfit'),
		],
	};
}

function openLookEditor() {
	// Rasgos que una partida antigua no guardó: se fijan con los mismos valores deducidos que ya se ven en el juego
	const cur = G.player.look || {}, R = resolveLook(cur);
	const look = { ...LOOK_DEFAULTS, eyesStyle: 'normal', ...Object.fromEntries(['head', 'brows', 'nose', 'collar', 'build', 'eyeSep', 'age'].map(k => [k, R[k]])), ...cur };
	const ed = lookEditor(look);
	const sheet = openSheet('Tu aspecto', [
		h('div', { class: 'pad' }, ed.preview),
		...ed.parts,
		h('div', { class: 'pad' }, h('button', { class: 'btn primary', style: { width: '100%' }, onclick: async () => { G.player.look = { ...look }; await saveGame(); sheet.close?.(); toast('Aspecto guardado'); } }, 'Guardar')),
	]);
}

// =================== Creación de personaje ===================
function creation() {
	const root = app();
	root.innerHTML = '';
	const look = { ...LOOK_DEFAULTS, skin: 1, head: 'round', eyesStyle: 'normal', brows: 'soft', nose: 'dot', collar: 'jacket', build: 'normal', eyeSep: 3 };
	let name = '', pron = 'el';
	const ed = lookEditor(look);
	const pronRow = h('div', { class: 'tabs' });
	[['el', 'Él'], ['ella', 'Ella'], ['elle', 'Elle']].forEach(([k, n]) => {
		const b = h('button', { class: pron === k ? 'on' : '' }, n);
		b.onclick = () => { pron = k; pronRow.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); };
		pronRow.append(b);
	});
	const nameInput = h('input', { class: 'field-input', placeholder: 'Tu nombre', maxlength: 12, autocomplete: 'off' });
	const start = async () => {
		name = nameInput.value.trim();
		if (!name) { toast('Escribe un nombre'); nameInput.focus(); return; }
		newGame({ name, pron, look });
		mainSwipe();
		startClock();
		const first = C.blocks[0];
		const startScript = C.scripts[first?.start || 'inicio'] ? (first?.start || 'inicio') : null;
		root.innerHTML = '';
		root.append(h('div', { class: 'main' }));
		busy = true;
		try { if (startScript) await runScript(startScript); } finally { busy = false; }
		if (!G.loc) G.loc = Object.keys(C.locations)[0];
		await saveGame();
		render();
	};
	const wrap = h('div', { class: 'main', style: { paddingTop: 'calc(16px + var(--safe-t))' } },
		h('div', { class: 'section-title', style: { textAlign: 'center', fontSize: '22px' } }, 'Tu entrenador'),
		ed.preview,
		h('div', { class: 'section-title' }, 'Nombre'), h('div', { class: 'pad' }, nameInput),
		h('div', { class: 'section-title' }, 'Pronombres'), pronRow,
		...ed.parts,
		h('div', { class: 'note' }, 'Tu personaje es un adulto joven que acaba de inscribirse en el Circuito Infinito. Puedes cambiar tu aspecto más adelante en Ajustes.'),
		h('div', { class: 'pad' }, h('button', { class: 'btn primary', style: { width: '100%' }, onclick: start }, 'Empezar la aventura')),
	);
	root.append(wrap);
}

// =================== Contexto visual ===================
// Cada tipo de sitio tiene su color de fondo y su etiqueta, para saber de un vistazo si estás en una ciudad,
// dentro de un edificio, en una ruta, en una cueva o en un menú (los menús van en gris carbón, ver app.css).
const CTX_NAME = { city: 'Ciudad', town: 'Pueblo', indoor: 'Interior', gym: 'Gimnasio', route: 'Ruta', forest: 'Bosque', cave: 'Cueva', water: 'Agua', snow: 'Nieve', sand: 'Arena', area: 'Paraje' };
function ctxOf(loc) {
	const byBg = t => ['indoor', 'lab', 'center', 'castle', 'palace', 'tower'].includes(t) ? 'indoor' : t === 'gym' ? 'gym' : t === 'cave' ? 'cave' : t === 'coast' ? 'water' : t === 'forest' ? 'forest' : null;
	if (loc.route) {
		const t = tramoTerrain(loc, G.route?.id === loc.id ? G.route.pos : 0);
		return { cave: 'cave', rocks: 'cave', water: 'water', forest: 'forest', snow: 'snow', sand: 'sand' }[t] || (loc.kind === 'cave' ? 'cave' : loc.kind === 'forest' ? 'forest' : 'route');
	}
	if (loc.kind === 'gym') return 'gym';
	if (loc.kind === 'building') return byBg(loc.bg?.type) === 'gym' ? 'gym' : 'indoor';
	if (loc.kind === 'cave') return 'cave';
	if (loc.kind === 'forest') return 'forest';
	if (loc.kind === 'city') return 'city';
	if (loc.kind === 'town') return 'town';
	return byBg(loc.bg?.type) || 'area';
}

// =================== Render principal ===================
export function render() {
	if (!G) return;
	const root = app();
	const loc = L(G.loc);
	if (!loc) { root.innerHTML = '<div class="empty">Ubicación desconocida.</div>'; return; }
	root.innerHTML = '';
	const ph = phase();
	const ctx = ctxOf(loc);
	root.dataset.ctx = ctx;
	const top = h('div', { class: 'topbar' },
		h('div', { class: 'place' }, loc.name),
		h('div', { class: 'chip', title: PHASE_NAMES[ph] }, PHASE_ICON[ph]),
		h('div', { class: 'chip money' }, fmtMoney(G.player.money)));
	const main = h('div', { class: 'main' });
	const topL = topLoc(loc.id);
	const scene = h('div', { class: 'scene' }, sceneCanvas({ ...(loc.bg || {}), seed: loc.bg?.seed || loc.id }),
		h('span', { class: 'ctxchip' }, CTX_NAME[ctx] || 'Lugar'),
		topL && topL.id !== loc.id ? h('div', { class: 'scene-label' }, `${topL.name} › ${loc.name}`) : null);
	main.append(scene);
	const evs = eventStrip();
	if (evs) main.append(evs);
	const tracker = questTracker();
	if (tracker) main.append(tracker);
	if (isRoute(loc)) renderRoute(main, loc);
	else renderPlace(main, loc);
	try { newsState({ announce: !busy, force: true }); } catch (e) { console.error(e); }
	root.append(top, main, navBar());
	// avisos de ritmo pendientes
	const due = uniquesDue(); // asigna lugar a los únicos que ya vuelven aunque haya otro aviso delante
	const notes = pendingNotices();
	if (notes.length) setTimeout(() => showPaceNotice(notes[0]), 300);
	else if (G.uniq?.retroNews?.length) setTimeout(() => showQueued(async () => { const k = G.uniq.retroNews; G.uniq.retroNews = null; await announceRetro(k); }), 300);
	else if (due.length) setTimeout(() => showQueued(() => { const d = uniquesDue(); return d.length ? announceUniques(d) : null; }), 300);
	else { const ev = eventCalendar().find(c => c.state === 'active' && !c.locked && !c.done && G.eventsSeen?.[c.e.id] !== new Date().getFullYear()); if (ev) setTimeout(() => showEventNotice(ev), 300); }
}

// =================== Eventos por fecha: avisos ===================
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fmtMD = md => { const [m, d] = md.split('-').map(Number); return `${d} ${MESES[m - 1]}`; };
function eventWhen(c) {
	if (c.state === 'soon') return c.daysTo === 1 ? 'Empieza mañana' : `Empieza en ${c.daysTo} días (${fmtMD(c.e.from)})`;
	if (c.done) return '✔ Completado' + (c.daysLeft ? ` · sigue hasta el ${fmtMD(c.e.to)}` : ' · hoy es el último día');
	return c.daysLeft === 0 ? '¡Hoy es el último día!' : c.daysLeft === 1 ? 'Termina mañana' : `Quedan ${c.daysLeft + 1} días · hasta el ${fmtMD(c.e.to)}`;
}
function eventRow(c) {
	const sub = c.locked ? (c.state === 'active' ? 'Evento activo · se desbloquea al avanzar un poco en la historia' : eventWhen(c) + ' · se desbloquea al avanzar en la historia') : eventWhen(c);
	return h('button', { class: 'evrow ' + c.state + (c.done ? ' done' : '') + (c.locked ? ' locked' : '') + (c.state === 'active' && !c.done && !c.locked && c.daysLeft === 0 ? ' last' : ''), onclick: () => openEventSheet(c) },
		h('span', { class: 'evico' }, c.e.icon || '🎉'),
		h('span', { class: 'evtxt' }, h('b', {}, c.e.name), h('small', {}, sub)),
		h('span', { class: 'chev' }, '›'));
}
/** Recuadro en cada lugar: eventos activos sin completar y los que empiezan esta semana. */
function eventStrip() {
	const list = eventCalendar().filter(c => !c.done);
	if (!list.length) return null;
	return h('div', { class: 'evstrip' }, ...list.map(eventRow));
}
function openEventSheet(c) {
	const e = c.e;
	const sheet = openSheet(`${e.icon || '🎉'} ${e.name}`, null);
	const dates = e.from === e.to ? `El ${fmtMD(e.from)}, cada año` : `Del ${fmtMD(e.from)} al ${fmtMD(e.to)}, cada año`;
	const body = [
		h('div', { class: 'qgroup' + (c.state === 'active' ? '' : ' log') }, h('b', {}, c.state === 'active' ? (c.done ? 'Completado' : 'Evento activo') : 'Próximamente'), h('span', {}, eventWhen(c))),
		h('div', { class: 'pad', html: fmtText(tx(e.blurb || '')) }),
		h('div', { class: 'note' }, '🗓️ ' + dates + '.'),
	];
	if (c.locked) body.push(h('div', { class: 'note' }, '🔒 Todavía no puedes participar: se desbloquea al avanzar un poco en la historia principal.'));
	if (c.places.length) {
		body.push(h('div', { class: 'section-title' }, 'Dónde'));
		body.push(h('div', { class: 'list' }, ...c.places.map(p => h('div', { class: 'row' }, h('div', { class: 'ico' }, p.mons ? '🌿' : '📍'),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, p.known ? p.name : 'Un lugar que aún no conoces'), p.mons ? h('div', { class: 's' }, 'Pokémon de temporada' + (p.night ? ', de noche' : '')) : null)))));
	}
	sheet.set(body);
}
async function showEventNotice(c) {
	if (busy) return;
	G.eventsSeen ||= {};
	G.eventsSeen[c.e.id] = new Date().getFullYear();
	busy = true;
	try {
		await say({ name: 'Rotom', look: { hair: 'spiky', hairColor: '#e07a3a', skin: '#f6f0e6', eyes: '#4c7cf0', outfit: '#e07a3a', outfit2: '#4c7cf0', eyesStyle: 'happy', mouth: 'grin' } },
			tx(`¡Bzzt! ¡Empezó un evento! ${c.e.icon || '🎉'} **${c.e.name}**. ${c.e.blurb || ''} ${c.daysLeft === 0 ? 'Solo dura hoy.' : `Dura hasta el ${fmtMD(c.e.to)}.`} Lo tienes arriba, en cada lugar.`));
	} finally { busy = false; }
	await saveGame();
	render();
}

const NAV = () => [['🗺️', 'Mapa', openMap], [ballIcon(22), 'Equipo', openParty], ['🎒', 'Mochila', () => openBag()], ['📔', 'Diario', () => openDiary()], ['☰', 'Más', openMore]];
function navBar(active = -1) {
	const nav = h('div', { class: 'nav' });
	const unread = G ? newsState().unread : 0;
	NAV().forEach(([i, t], k) => nav.append(h('button', { class: k === active ? 'on' : '', 'aria-current': k === active ? 'page' : null, onclick: () => k === active ? null : openNav(k, k > active ? 1 : -1, true) }, h('span', { class: 'i' }, i, k === 3 && unread ? h('span', { class: 'navbadge', 'aria-label': `${unread} novedades` }, unread > 9 ? '9+' : String(unread)) : null), t)));
	return nav;
}
// Los cinco menús de abajo forman un carrusel: deslizando se pasa de uno a otro (y por sus pestañas).
// Desde la pantalla principal, deslizar a la izquierda abre el Mapa y a la derecha, Más.
// Dentro de cada menú se queda la barra de abajo (con el menú actual marcado): tocar salta directo a otro menú
// y deslizar sobre la barra también cambia de menú sin pasar por las pestañas.
function openNav(k, from = 0, tapped = false) {
	const items = NAV();
	if (k < 0 || k >= items.length) {
		closeAllSheets();
		const m = app()?.querySelector('.main');
		if (m && from) slideIn(m, from);
		return;
	}
	closeAllSheets();
	items[k][2]();
	const s = topSheet();
	if (!s) return;
	if (from < 0 && !tapped) lastTab(s.body);
	if (from) slideIn(s.body, from);
	s.el.dataset.menu = ['mapa', 'equipo', 'mochila', 'diario', 'mas'][k];
	s.onEdgeSwipe = dir => openNav(k + dir, dir);
	const bar = navBar(k);
	bar.classList.add('nav-sheet');
	s.el.append(bar);
	onSwipe(bar, dir => openNav(k + dir, dir, true), { target: () => s.body, skip: '[data-noswipe]' });
}
let swipeReady = false;
function mainSwipe() {
	if (swipeReady) return;
	swipeReady = true;
	const can = () => !busy && !topSheet() && G && document.querySelector('#app .nav') && !document.querySelector('.dialog, .choices, .battle, .field');
	onSwipe(app(), dir => { if (can()) openNav(dir > 0 ? 0 : NAV().length - 1, dir); },
		{ target: () => app().querySelector('.main'), can });
}

async function guarded(fn) {
	if (busy) return;
	busy = true;
	try { await fn(); } catch (e) { console.error(e); toast('Error: ' + e.message); }
	finally { busy = false; render(); }
}

// =================== Lugares (ciudades, pueblos, interiores) ===================
function spotIcon(s) {
	if (s.icon) return s.icon;
	const a = s.action || {};
	if (a.venture) return C.ventures[a.venture]?.icon || '🤝';
	if (a.center) return '❤️'; if (a.shop) return '🛒'; if (a.pc) return '💻'; if (a.gym || s.gym) return '🏅';
	if (a.go) return '🚪'; if (a.training) return '🥋'; if (a.trainer) return '⚔️'; if (a.explore) return '🌿';
	return '💬';
}

/** Qué señal lleva un sitio: «!» misión nueva, «?» misión en curso, «•» novedad sin misión. */
function spotMarker(s) {
	const a = s.action || {};
	const scripts = [];
	const talk = s.talk || a.talk;
	if (Array.isArray(talk)) { const t = talk.find(e => { try { return e.cond === undefined || evalCond(e.cond); } catch (x) { return false; } }); if (t?.script) scripts.push(t.script); }
	if (s.script) scripts.push(s.script);
	if (a.script) scripts.push(a.script);
	const touch = questTouches();
	let active = null, touchedAny = false;
	for (const sc of scripts) for (const q of touch[sc] || []) {
		if (!C.quests[q]) continue;
		touchedAny = true;
		const st = G.quests[q];
		if (!st) return { kind: 'new', q };
		if (!st.done && !active) active = { kind: 'active', q };
	}
	if (active) return active;
	let isNew = false;
	try { isNew = s.new !== undefined && evalCond(s.new); } catch (x) { isNew = false; }
	if (isNew && !touchedAny) return { kind: 'hint' };
	return null; // solo toca misiones ya terminadas: sin señal
}
function markerEl(m) {
	if (!m) return null;
	if (m.kind === 'new') return h('span', { class: 'mk new', title: 'Misión nueva' }, '!');
	if (m.kind === 'active') return h('span', { class: 'mk active', title: 'Misión en curso' }, '?');
	return h('span', { class: 'mk hint', title: 'Novedad' });
}
function spotKind(s) {
	const a = s.action || {};
	if (a.center || a.shop || a.pc) return 'services';
	if (a.venture) return 'places';
	if (a.go) return 'places';
	if (a.trainer || a.training || a.unique) return 'battle';
	if (a.explore || a.gather) return 'nature';
	return 'people';
}

function renderPlace(main, loc) {
	// Descripción: el primer párrafo siempre; el resto, plegable
	const paras = descOf(loc).split('\n\n').filter(Boolean);
	const desc = h('div', { class: 'desc' }, h('p', { html: fmtText(tx(paras[0] || '')) }));
	if (paras.length > 1) {
		const more = h('div', { class: 'desc-more', hidden: true }, ...paras.slice(1).map(p => h('p', { html: fmtText(tx(p)) })));
		const btn = h('button', { class: 'linkbtn', onclick: () => { more.hidden = !more.hidden; btn.textContent = more.hidden ? 'Leer más' : 'Leer menos'; } }, 'Leer más');
		desc.append(more, btn);
	}
	main.append(desc);
	const spots = spotsOf(loc).map(s => ({ s, m: spotMarker(s), kind: spotKind(s) }));
	// Misiones aquí: lo que tiene «!» o «?» va primero, con el nombre de la misión
	const quests = spots.filter(x => x.m && x.m.kind !== 'hint' && x.kind === 'people');
	const rowFor = ({ s, m }) => {
		const done = s.doneIf !== undefined && evalCond(s.doneIf);
		const sub = s.action?.gather ? gatherSub(s.action.gather, loc) : m?.q ? (m.kind === 'new' ? 'Misión nueva' : `En curso: ${C.quests[m.q]?.name || ''}`) : s.sub ? tx(s.sub) : '';
		return h('button', { class: 'row' + (m?.kind === 'new' ? ' q-new' : m?.kind === 'active' ? ' q-active' : m ? ' hl' : '') + (s.event ? ' event' : '') + (done ? ' done' : ''), onclick: () => guarded(() => doSpot(s, loc)) },
			h('div', { class: 'ico' }, spotIcon(s)),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, tx(s.label)), sub ? h('div', { class: 's' }, sub) : null),
			markerEl(m));
	};
	if (quests.length) {
		main.append(h('div', { class: 'section-title' }, 'Misiones aquí'));
		main.append(h('div', { class: 'list' }, ...quests.map(rowFor)));
	}
	// Servicios: píldoras compactas
	const services = spots.filter(x => x.kind === 'services');
	if (services.length) {
		main.append(h('div', { class: 'pills' }, ...services.map(({ s }) => h('button', { class: 'pill', onclick: () => guarded(() => doSpot(s, loc)) }, h('span', { class: 'pi' }, spotIcon(s)), tx(s.label)))));
	}
	const people = spots.filter(x => x.kind === 'people' && !quests.includes(x));
	if (people.length) {
		main.append(h('div', { class: 'section-title' }, 'Gente y rincones'));
		main.append(h('div', { class: 'list' }, ...people.map(rowFor)));
	}
	// Lugares, combates y naturaleza en un solo mosaico (así se llena la cuadrícula)
	{
		const order = { places: 0, battle: 1, nature: 2 };
		const xs = spots.filter(x => order[x.kind] !== undefined).sort((a, b) => order[a.kind] - order[b.kind]);
		if (xs.length) main.append(h('div', { class: 'section-title' }, 'Explorar'));
		const grid = h('div', { class: 'tiles' });
		for (const x of xs) {
			const { s, m } = x;
			const a = s.action || {};
			const done = (s.doneIf !== undefined && evalCond(s.doneIf)) || (a.trainer && G.beaten[a.trainer] && !a.repeat);
			const pzs = a.training ? prizeState(a.training) : null;
			const sub = pzs && !pzs.claimed ? (pzs.ready ? '🎁 ¡Premio listo! Habla con el encargado' : `🎁 Premio: ${pzs.wins}/${pzs.need} combates`) : a.gather ? gatherSub(a.gather, loc) : a.go ? (G.visited[a.go] ? (s.sub ? tx(s.sub) : 'Visitado') : (s.sub ? tx(s.sub) : 'Sin visitar')) : done ? 'Hecho' : s.sub ? tx(s.sub) : '';
			grid.append(h('button', { class: 'tile' + (m?.kind === 'new' ? ' q-new' : m?.kind === 'active' ? ' q-active' : (m || pzs?.ready && !pzs.claimed) ? ' hl' : '') + (done ? ' done' : '') + (s.event ? ' event' : ''), onclick: () => guarded(() => doSpot(s, loc)) },
				h('div', { class: 'tile-top' }, h('span', { class: 'tile-ico' }, spotIcon(s)), markerEl(m || (pzs?.ready && !pzs.claimed ? { kind: 'hint' } : null))),
				h('div', { class: 'tile-t' }, tx(s.label)),
				sub ? h('div', { class: 'tile-s' }, sub) : null));
		}
		if (xs.length) main.append(grid);
	}
	// Salidas
	const exits = [];
	if (loc.parent) exits.push({ id: loc.parent, label: 'Salir a ' + (L(loc.parent)?.name || ''), icon: '🚪', sub: 'Volver' });
	for (const n of loc.links || []) {
		const l = L(n);
		if (!l || (l.hidden !== undefined && evalCond(l.hidden))) continue;
		const ce = canEnter(n);
		exits.push({ id: n, label: l.name, icon: l.kind === 'cave' ? '⛰️' : l.kind === 'forest' ? '🌲' : isRoute(l) ? '🛤️' : l.kind === 'city' ? '🏙️' : '🏘️', sub: !ce.ok ? '🔒 Cerrado por ahora' : G.cleared[n] ? 'Despejada ✔' : G.visited[n] ? 'Visitada' : 'Sin explorar', blocked: !ce.ok, msg: ce.msg, fresh: !G.visited[n] && ce.ok });
	}
	if (exits.length) {
		main.append(h('div', { class: 'section-title' }, 'Caminos'));
		const grid = h('div', { class: 'tiles' });
		for (const e of exits) grid.append(h('button', { class: 'tile exit' + (e.blocked ? ' locked' : '') + (e.fresh ? ' fresh' : ''), onclick: () => guarded(async () => { if (e.blocked) { await say(null, tx(e.msg)); return; } await enterLocation(e.id, { from: loc.id }); }) },
			h('div', { class: 'tile-top' }, h('span', { class: 'tile-ico' }, e.icon), e.fresh ? h('span', { class: 'mk hint' }) : null),
			h('div', { class: 'tile-t' }, e.label),
			h('div', { class: 'tile-s' }, e.sub)));
		main.append(grid);
	}
}

async function doSpot(s, loc) {
	const a = s.action || {};
	if (s.script) return runScript(s.script);
	if (s.talk) return runFirst(s.talk);
	if (a.script) return runScript(a.script);
	if (a.talk) return runFirst(a.talk);
	if (a.center) return pokemonCenter(a);
	if (a.shop) return openShop(a.shop);
	if (a.pc) return openPC();
	if (a.go) { const ce = canEnter(a.go); if (!ce.ok) return say(null, tx(ce.msg)); return enterLocation(a.go, { from: loc.id }); }
	if (a.trainer) {
		if (G.beaten[a.trainer] && !a.repeat) return say(null, 'Ya te enfrentaste a este entrenador.');
		return battle({ trainer: a.trainer });
	}
	if (a.training) return training(a.training, s);
	if (a.unique) return uniqueEncounter(a.unique);
	if (a.explore) return exploreHere(loc, a.explore === true ? 'grass' : a.explore);
	if (a.gather) return gatherHere(a.gather, loc);
	if (a.venture) return openVenture(a.venture);
}

// =================== Recolección ===================
function gatherLeft(gid, loc) {
	const def = C.gather[gid];
	if (!def) return 0;
	const last = G.gather?.[loc.id + ':' + gid] || 0;
	return Math.max(0, last + (def.hours || 20) * 3600e3 - Date.now());
}
function gatherSub(gid, loc, extra) {
	const left = gatherLeft(gid, loc);
	const st = left ? `Vuelve en ${left > 3600e3 ? Math.ceil(left / 3600e3) + ' h' : Math.ceil(left / 60e3) + ' min'}` : '✨ Listo para recoger';
	return extra ? `${tx(extra)} · ${st}` : st;
}
async function gatherHere(gid, loc) {
	const def = C.gather[gid];
	if (!def) return;
	const left = gatherLeft(gid, loc);
	if (left) { await say(null, tx(def.wait || 'Ya recogiste lo que había.') + ` Vuelve en unas ${Math.ceil(left / 3600e3)} h.`); return; }
	const table = def.table.filter(e => e.cond === undefined || evalCond(e.cond));
	const tot = table.reduce((s, e) => s + (e.w || 1), 0);
	const roll = () => { let r = rng() * tot; return table.find(e => (r -= (e.w || 1)) < 0) || table[0]; };
	const [p0, p1] = def.picks || [1, 2];
	// La montura rompe roca: en vetas, piedras y cristales saca una tanda más
	const rocky = mounted() && (def.rocky ?? (/[⛏💎🪨]/u.test(def.icon || '') || table.some(e => ['loot', 'evolution', 'collectibles', 'jewels'].includes(D.items[toID(e.id)]?.cat) && /stone|shard|nugget|crystal|ore|gem|rock|fossil|dust/.test(toID(e.id)))));
	const picks = p0 + Math.floor(rng() * (p1 - p0 + 1)) + (rocky ? 1 : 0);
	const got = {};
	for (let i = 0; i < picks; i++) { const e = roll(); const [n0, n1] = e.n || [1, 1]; got[e.id] = (got[e.id] || 0) + n0 + Math.floor(rng() * (n1 - n0 + 1)); }
	const fresh = Object.keys(got).filter(id => !G.found?.[id]);
	for (const id in got) addItem(id, got[id]);
	G.gather[loc.id + ':' + gid] = Date.now();
	const lines = Object.entries(got).map(([id, n]) => `**${itemName(id)}**${n > 1 ? ' ×' + n : ''}${fresh.includes(id) ? ' 🆕' : ''}`);
	await say(null, tx(def.text || 'Has recogido algunas cosas.') + (rocky ? ' Tu montura parte la roca de una embestida y aparece algo más.' : '') + '\n' + lines.join(' · '));
	if (fresh.length) toast(`📖 ${fresh.length === 1 ? 'Nuevo objeto' : fresh.length + ' objetos nuevos'} en tu Colección`);
	await saveGame();
	render();
}

/** Todos los puntos de recolección que ya conoces (lugares visitados y tramos de ruta vistos). */
function knownGatherPoints() {
	const out = [];
	for (const loc of Object.values(C.locations)) {
		const top = topLoc(loc.id);
		const place = top && top.id !== loc.id ? `${top.name} › ${loc.name}` : loc.name;
		if (G.visited[loc.id]) for (const sp of spotsOf(loc)) {
			const gid = sp.action?.gather;
			if (gid && C.gather[gid]) out.push({ gid, loc, tramo: null, label: sp.label, icon: sp.icon, place });
		}
		if (loc.route) {
			const pr = routeProg(loc.id);
			for (let n = 0; n <= loc.route.length; n++) {
				if (!pr.seen[n]) continue;
				for (const it of tramoItems(loc, n)) {
					const gid = it.spot?.action?.gather;
					if (gid && C.gather[gid]) out.push({ gid, loc, tramo: n, label: it.label || it.spot.label, icon: it.icon || it.spot.icon, place: `${place} · tramo ${n}` });
				}
			}
		}
	}
	// Un mismo punto puede salir en dos tramos: se queda uno
	const seen = new Set();
	return out.filter(p => { const k = p.loc.id + ':' + p.gid; if (seen.has(k)) return false; seen.add(k); return true; });
}
function gatherReadyCount() { return knownGatherPoints().filter(p => !gatherLeft(p.gid, p.loc)).length; }
function isHere(p) { return G.loc === p.loc.id && (p.tramo === null || G.route?.pos === p.tramo); }

/** Viaja a un punto de recolección por caminos conocidos (como el mapa). */
async function goToGather(p) {
	if (isHere(p)) return gatherHere(p.gid, p.loc);
	const dest = topLoc(p.loc.id) || p.loc;
	const here = topLoc(G.loc);
	const start = G.route ? G.loc : here?.id;
	const path = dest.id === start ? [start] : findPath(start, dest.id);
	if (!path) { await say(null, `Aún no conoces un camino seguro hasta ${dest.name}. Ve a pie desde el mapa.`); return; }
	const ce = canEnter(p.loc.id);
	if (!ce.ok) { await say(null, tx(ce.msg)); return; }
	const prev = path.length >= 2 ? path[path.length - 2] : start;
	if (dest.id !== G.loc) await enterLocation(dest.id, { from: prev });
	if (G.loc !== dest.id) return; // un guion al entrar nos movió
	if (p.loc.id !== dest.id) await enterLocation(p.loc.id, { from: dest.id });
	if (p.tramo !== null && G.loc === p.loc.id) {
		if (G.cleared[p.loc.id]) { G.route = { id: p.loc.id, pos: p.tramo }; await saveGame(); }
		else toast(`Está en el tramo ${p.tramo}: avanza por la ruta hasta llegar.`);
	}
	render();
}

function openGatherMenu() {
	const sheet = openSheet('Recolección', null);
	let tab = 'ready', berries = false;
	const isBerry = id => { const it = D.items[toID(id)]; return !!(it && (it.berry || it.pocket === 'berries')); };
	const draw = () => {
		const here = topLoc(G.loc);
		const start = G.route ? G.loc : here?.id;
		const dist = p => { if (isHere(p)) return -1; const d = topLoc(p.loc.id) || p.loc; const path = d.id === start ? [start] : findPath(start, d.id); return path ? path.length : 999; };
		let pts = knownGatherPoints().map(p => ({ ...p, left: gatherLeft(p.gid, p.loc) }));
		if (!pts.length) {
			sheet.set(h('div', { class: 'empty' }, 'Todavía no conoces ningún punto de recolección. Busca huertos, árboles con bayas, vetas y orillas en rutas y cuevas.'));
			return;
		}
		if (berries) pts = pts.filter(p => (C.gather[p.gid].table || []).some(e => isBerry(e.id)));
		pts.forEach(p => { p.d = dist(p); });
		const ready = pts.filter(p => !p.left).sort((a, b) => a.d - b.d || a.place.localeCompare(b.place, 'es'));
		const wait = pts.filter(p => p.left).sort((a, b) => a.left - b.left);
		const yields = gid => {
			const ids = [...new Set((C.gather[gid].table || []).map(e => toID(e.id)))];
			const known = ids.filter(id => G.found?.[id]).map(id => itemName(id));
			const unk = ids.length - known.length;
			return known.length ? `Puede dar: ${known.join(', ')}${unk ? ` y ${unk} más por descubrir` : ''}` : `${ids.length} cosas por descubrir`;
		};
		const row = p => {
			const def = C.gather[p.gid];
			const hereP = isHere(p);
			const st = p.left ? `⏳ ${gatherSub(p.gid, p.loc)}` : hereP ? '✨ Listo · estás aquí' : p.d >= 999 ? '✨ Listo · sin camino rápido' : '✨ Listo para recoger';
			return h('button', { class: 'row' + (p.left ? ' done' : ' hl'), onclick: () => { closeAllSheets(); guarded(() => goToGather(p)); } },
				h('div', { class: 'ico' }, p.icon || def.icon || '🧺'),
				h('div', { class: 'lbl' },
					h('div', { class: 't' }, tx(p.label || def.name || 'Recolección')),
					h('div', { class: 's' }, `📍 ${p.place}`),
					h('div', { class: 's' }, st),
					h('div', { class: 's' }, yields(p.gid))),
				h('b', {}, hereP ? (p.left ? 'Aquí' : 'Recoger') : 'Ir'));
		};
		const tabs = h('div', { class: 'tabs' }, ...[['ready', 'Listos', ready.length], ['wait', 'Creciendo', wait.length]]
			.map(([k, n, c]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, n, h('span', { class: 'tabcount' }, String(c)))));
		const filter = h('div', { class: 'pills' },
			h('button', { class: 'pill' + (berries ? '' : ' on'), 'aria-pressed': String(!berries), onclick: () => { berries = false; draw(); } }, 'Todo'),
			h('button', { class: 'pill' + (berries ? ' on' : ''), 'aria-pressed': String(berries), onclick: () => { berries = true; draw(); } }, h('span', { class: 'pi' }, '🍒'), 'Solo con bayas'));
		const list = tab === 'ready' ? ready : wait;
		sheet.set([
			tabs, filter,
			h('div', { class: 'note' }, tab === 'ready' ? 'Los más cercanos primero. Toca uno para viajar hasta allí por caminos que ya conoces.' : 'Cada punto vuelve a dar cosas pasadas unas horas reales. Los que están por volver salen primero.'),
			list.length ? h('div', { class: 'list' }, ...list.map(row)) : h('div', { class: 'empty' }, tab === 'ready' ? 'Nada listo por ahora. Mira en «Creciendo» cuándo vuelve cada uno.' : 'Todo está listo para recoger.'),
		]);
	};
	draw();
	const timer = setInterval(() => { if (!sheet.el.isConnected) { clearInterval(timer); return; } draw(); }, 60e3);
}

async function pokemonCenter(a = {}) {
	const nurse = { name: a.nurse || 'Enfermera Joy', look: { hair: 'long', hairColor: '#e98aa8', outfit: '#f3e6e8', outfit2: '#e85a6a', eyes: '#3a5fc4', skin: 0, acc: 'bow' } };
	await say(nurse, '¡Hola! Bienvenid{o|a|e} al Centro Pokémon. Deja que tus Pokémon descansen un momento.');
	healParty();
	G.lastCenter = topLoc(G.loc)?.id || G.loc;
	G.lastCenterSub = G.loc;
	await say(nurse, '¡Listo! Tus Pokémon están en plena forma. ¡Esperamos volver a verte!');
	// Regalo único del Cordón Unión: sustituye a las evoluciones por intercambio (no hay intercambios en el juego).
	if (!G.flags.regalo_cordon && G.player.badges.length >= 2) {
		await say(nurse, 'Ah, ¡espera! Como viajas sin nadie con quien intercambiar, la Liga nos pide darte esto. Con él evolucionan los Pokémon que normalmente lo harían al intercambiarse.');
		addItem('linkingcord', 1);
		G.flags.regalo_cordon = true;
		await say(null, `¡${G.player.name} ha obtenido **${itemName('linkingcord')}**!`, { jingle: 'item' });
		await say(nurse, 'Úsalo desde la mochila sobre el Pokémon. Si necesitas más, desde ahora las tiendas lo venden.');
	}
	await saveGame();
}

// Premio del instructor: al ganar `prize.wins` combates de práctica en una zona, su encargado te da algo
// del lugar (una MT o una Megapiedra temática) con su propia escena. Cuentan las victorias de antes.
function trainWins(t) { return (t.trainers || []).reduce((a, id) => a + (G.beaten[id] || 0), 0); }
function prizeState(t) {
	const pz = t?.prize;
	if (!pz?.script || !C.scripts[pz.script]) return null;
	const need = pz.wins || 3, wins = trainWins(t);
	return { claimed: !!G.flags['premio:' + pz.script], wins: Math.min(wins, need), need, ready: wins >= need };
}
async function givePrize(t) {
	const pz = t.prize;
	beginScene();
	try { G.flags['premio:' + pz.script] = true; await runScript(pz.script); } finally { endScene(); }
	await saveGame();
}
async function training(t, s) {
	const cap = t.cap || G.vars.cap || 15;
	const coach = t.npc ? { id: t.npc, ...C.npcs[t.npc] } : { name: t.coach || 'Instructor', look: { seed: s.label } };
	let pz = prizeState(t);
	if (pz && !pz.claimed && pz.ready) return givePrize(t);
	const pzTxt = pz && !pz.claimed ? `\n🎁 Premio del lugar: ${pz.wins}/${pz.need} combates ganados.` : '';
	const open = trainingOpen(cap);
	if (!open && !(pz && !pz.claimed)) {
		await say(coach, tx(t.closed || `Tu equipo ya tiene el nivel que necesita (media ${avgLevel().toFixed(1)} ≥ ${cap}). Ya estás listo. No te voy a dejar perder el tiempo aquí.`));
		return;
	}
	const opts = [open ? 'Combate de práctica' : 'Combate de exhibición', open && t.wild ? 'Buscar Pokémon salvajes' : null, 'Ahora no'].filter(Boolean);
	const k = opts[await choose(tx(open ? (t.prompt || `Nivel recomendado: ${cap}. Tu media: ${avgLevel().toFixed(1)}. ¿Entrenamos?`) : 'Tu equipo ya tiene nivel de sobra para esta zona, pero todavía puedes ganarte el premio del lugar.') + pzTxt, opts)];
	if ((k === 'Combate de práctica' || k === 'Combate de exhibición') && t.trainers?.length) {
		// Primero los que aún no has vencido: así el premio no depende de la suerte
		const fresh = t.trainers.filter(id => !G.beaten[id]);
		const res = await battle({ trainer: pick(fresh.length ? fresh : t.trainers) });
		pz = prizeState(t);
		if (res?.result === 'win' && pz && !pz.claimed) {
			if (pz.ready) await givePrize(t);
			else toast(`🎁 Premio del lugar: ${pz.wins}/${pz.need}`);
		}
		return res;
	}
	if (k === 'Buscar Pokémon salvajes') {
		const e = pick(t.wild);
		return battle({ wild: { sp: e.sp, lv: Array.isArray(e.lv) ? e.lv[0] + Math.floor(rng() * (e.lv[1] - e.lv[0] + 1)) : e.lv } });
	}
}

async function exploreHere(loc, terrain) {
	const w = rollWild(loc, terrain);
	if (!w) { await say(null, 'No parece haber Pokémon por aquí.'); return; }
	await battle({ wild: { mon: w.mon, gimmick: w.entry.gimmick } });
}

// =================== Rutas ===================
function renderRoute(main, loc) {
	const r = loc.route;
	const pos = G.route?.id === loc.id ? G.route.pos : 0;
	const pr = routeProg(loc.id);
	const track = h('div', { class: 'track' });
	for (let i = 0; i <= r.length; i++) {
		const items = tramoItems(loc, i);
		const marked = items.some(x => (x.trainer && !G.beaten[x.trainer] && !x.optional) || (x.script && x.mark));
		track.append(h('div', { class: 'seg' + (i === pos ? ' here' : pr.seen[i] ? ' seen' : '') + (marked && pr.seen[i] && i !== pos ? ' mark' : '') }));
	}
	const fromL = L(r.from), toL = L(r.to);
	main.append(h('div', { class: 'route-hud' }, track,
		h('div', { class: 'route-ends' }, h('span', {}, '↑ ', h('b', {}, fromL?.name || '')), h('span', {}, `Tramo ${pos}/${r.length}`), h('span', {}, h('b', {}, toL?.name || ''), ' ↓'))));
	// Texto del tramo
	const items = tramoItems(loc, pos);
	const textItem = items.filter(x => x.text).map(x => tx(x.text)).join(' ');
	const terrain = tramoTerrain(loc, pos);
	const tdesc = { grass: 'Hierba alta a los lados del camino.', cave: 'Pasillos de roca en penumbra.', water: 'Agua por todas partes.', forest: 'Árboles altos y maleza.', sand: 'Arena y viento.', path: 'Un camino despejado.', flowers: 'Un mar de flores.', snow: 'Nieve crujiente.' }[terrain] || '';
	main.append(h('div', { class: 'desc' }, h('p', { html: fmtText(tx(pos === 0 && !G.visited[loc.id + '_desc'] ? descOf(loc) : (textItem || descOf(loc) || tdesc))) })));
	// Acciones de tramo
	const extra = h('div', { class: 'list' });
	for (const it of items) {
		if (it.trainer && it.optional && !G.beaten[it.trainer]) {
			const t = C.trainers[it.trainer];
			extra.append(h('button', { class: 'row hl', onclick: () => guarded(() => battle({ trainer: it.trainer })) }, h('div', { class: 'ico' }, '⚔️'), h('div', { class: 'lbl' }, h('div', { class: 't' }, `${t?.cls || ''} ${t?.name || ''}`), h('div', { class: 's' }, it.label || 'Te mira con ganas de combatir'))));
		}
		if (it.item && !it.hidden && !pr.items[pos + ':' + it.item]) {
			extra.append(h('button', { class: 'row', onclick: () => guarded(async () => { pr.items[pos + ':' + it.item] = true; addItem(it.item, it.n || 1); await say(null, `¡Has encontrado **${itemName(it.item)}**${(it.n || 1) > 1 ? ' ×' + it.n : ''}!`); }) }, h('div', { class: 'ico' }, '✨'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Algo brilla en el suelo'), h('div', { class: 's' }, 'Recoger'))));
		}
		if (it.branch && (it.branch.cond === undefined || evalCond(it.branch.cond))) {
			extra.append(h('button', { class: 'row', onclick: () => guarded(() => enterLocation(it.branch.go, { from: loc.id })) }, h('div', { class: 'ico' }, '↪️'), h('div', { class: 'lbl' }, h('div', { class: 't' }, tx(it.branch.label)), it.branch.sub ? h('div', { class: 's' }, tx(it.branch.sub)) : null)));
		}
		if (it.talk || it.spot) {
			const sp = it.spot || {};
			const mk = it.talk ? spotMarker(it) : null;
			extra.append(h('button', { class: 'row' + (mk?.kind === 'new' ? ' q-new' : mk?.kind === 'active' ? ' q-active' : (mk || (it.new && !it.talk && evalCond(it.new))) ? ' hl' : ''), onclick: () => guarded(() => it.talk ? runFirst(it.talk) : doSpot(sp, loc)) }, h('div', { class: 'ico' }, it.icon || '💬'), markerEl(mk), h('div', { class: 'lbl' }, h('div', { class: 't' }, tx(it.label || sp.label || 'Hablar')), sp.action?.gather ? h('div', { class: 's' }, gatherSub(sp.action.gather, loc, it.sub)) : it.sub ? h('div', { class: 's' }, tx(it.sub)) : null)));
		}
	}
	if (extra.children.length) main.append(extra);
	// Controles
	const back = pos === 0 ? `Salir a ${fromL?.name}` : `Hacia ${fromL?.name}`;
	const fwd = pos === r.length ? `Salir a ${toL?.name}` : `Hacia ${toL?.name}`;
	const actions = h('div', { class: 'route-actions' },
		h('button', { class: 'btn', onclick: () => guarded(() => routeStep(-1)) }, '↑ ' + back),
		h('button', { class: 'btn primary', onclick: () => guarded(() => routeStep(1)) }, fwd + ' ↓'),
		h('button', { class: 'btn', onclick: () => guarded(searchHere) }, '🔍 Buscar'),
		G.cleared[loc.id] ? h('button', { class: 'btn', onclick: () => guarded(shortcut) }, '⏩ Atajo') : h('button', { class: 'btn', onclick: openZoneGuide }, '📍 Guía'),
	);
	actions.append(h('button', { class: 'btn dexnav-btn', onclick: () => openDexNav() }, '🔎 DexNav · rastrear un Pokémon'));
	main.append(actions);
	if (routeMsg) main.append(h('div', { class: 'route-log', html: fmtText(routeMsg) }));
	if (mounted()) {
		actions.append(h('button', { class: 'btn wide mount-btn', onclick: () => gallop() }, '🐎 Galopar a un tramo que ya conoces'));
		main.append(h('div', { class: 'note' }, 'Vas a lomos de tu montura: avanzas dos tramos por paso, hay menos encuentros y frena sola donde hay algo que recoger o alguien nuevo. En vetas y rocas, rompe la piedra y saca un poco más.'));
	} else if (G.vars.mount && G.flags['mount_' + G.vars.mount]) {
		main.append(h('button', { class: 'linkbtn mount-on', onclick: () => { G.settings.useMount = true; render(); } }, '🐎 Tienes la montura guardada. Toca para subirte'));
	}
}

async function routeStep(dir) {
	const loc = L(G.loc);
	const r = loc.route;
	const pos = G.route?.pos ?? 0;
	routeMsg = '';
	if (dir < 0 && pos === 0) return enterLocation(r.from, { from: loc.id });
	if (dir > 0 && pos === r.length) return enterLocation(r.to, { from: loc.id });
	const cm = canMove(loc, pos, dir);
	if (!cm.ok) { if (cm.script) await runScript(cm.script); else await say(null, tx(cm.msg)); return; }
	const step = mounted() ? 2 : 1;
	let n = pos, stopped = null;
	for (let k = 0; k < step; k++) {
		const nn = Math.max(0, Math.min(r.length, n + dir));
		if (nn === n) break;
		// no saltar tramos con eventos obligatorios
		n = nn;
		markTramo(loc.id, n);
		if (tramoItems(loc, n).some(x => (x.trainer && !x.optional && !G.beaten[x.trainer]) || (x.script && !routeProg(loc.id).done[n + ':' + x.script]) || x.block)) break;
		// La montura no se pasa de largo nada que valga la pena: frena donde hay algo que recoger, alguien nuevo o un reto pendiente
		if (k < step - 1 && n > 0 && n < r.length && tramoStop(loc, n)) { stopped = tramoStop(loc, n); break; }
	}
	G.route = { id: loc.id, pos: n };
	const ev = walkFriendship();
	if (ev === 'repel_end') await say(null, 'El efecto del repelente se ha agotado.');
	await arriveTramo(loc, n, dir);
	if (stopped && G.loc === loc.id && !routeMsg) routeMsg = `Tu montura frena sola: ${stopped}.`;
}

/** ¿Hay en este tramo algo por lo que valga la pena parar? Devuelve una frase corta o null. */
function tramoStop(loc, n) {
	const pr = routeProg(loc.id);
	for (const it of tramoItems(loc, n)) {
		const gid = it.spot?.action?.gather;
		if (gid && C.gather[gid] && !gatherLeft(gid, loc)) return 'aquí hay algo listo para recoger';
		if (it.item && !it.hidden && !pr.items[n + ':' + it.item]) return 'algo brilla en el suelo';
		if (it.trainer && it.optional && !G.beaten[it.trainer]) return 'alguien quiere combatir';
		if (it.talk && spotMarker(it)) return 'aquí hay alguien con algo que decirte';
		if (it.branch && (it.branch.cond === undefined || evalCond(it.branch.cond)) && !G.visited[it.branch.go]) return 'aquí sale un desvío que no conoces';
	}
	return null;
}
/** A lomos de la montura: ir directo a cualquier tramo que ya hayas pisado, viendo qué hay en cada uno. */
async function gallop() {
	const loc = L(G.loc), r = loc.route, pr = routeProg(loc.id), pos = G.route?.pos ?? 0;
	const sheet = openSheet('Galopar', null);
	const rows = [];
	for (let n = 0; n <= r.length; n++) {
		if (!pr.seen[n] && n !== pos) continue;
		// no se puede saltar un bloqueo ni un combate obligatorio pendiente entre medias
		let blocked = false;
		for (let k = Math.min(pos, n); k <= Math.max(pos, n) && !blocked; k++) {
			if (k !== n && k !== pos && tramoItems(loc, k).some(x => (x.trainer && !x.optional && !G.beaten[x.trainer]) || (x.script && x.once !== false && !pr.done[k + ':' + x.script]))) blocked = true;
			if (k !== n && !canMove(loc, k, n > pos ? 1 : -1).ok) blocked = true;
		}
		const what = [];
		for (const it of tramoItems(loc, n)) {
			const gid = it.spot?.action?.gather;
			if (gid && C.gather[gid]) what.push(`${it.icon || C.gather[gid].icon || '🧺'} ${tx(it.label || it.spot.label || C.gather[gid].name)} · ${gatherLeft(gid, loc) ? gatherSub(gid, loc) : '✨ listo'}`);
			else if (it.item && !it.hidden && !pr.items[n + ':' + it.item]) what.push('✨ Algo brilla en el suelo');
			else if (it.trainer && it.optional && !G.beaten[it.trainer]) what.push('⚔️ Alguien quiere combatir');
			else if (it.talk) what.push(`${it.icon || '💬'} ${tx(it.label || 'Alguien')}`);
			else if (it.branch && (it.branch.cond === undefined || evalCond(it.branch.cond))) what.push(`↪️ ${tx(it.branch.label)}`);
		}
		const stop = tramoStop(loc, n);
		rows.push(h('button', { class: 'row' + (n === pos ? ' done' : stop ? ' hl' : ''), disabled: n === pos || blocked, onclick: () => { sheet.close(); guarded(async () => { G.route = { id: loc.id, pos: n }; routeMsg = ''; markTramo(loc.id, n); await saveGame(); }); } },
			h('div', { class: 'ico' }, String(n)),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, n === 0 ? `Tramo 0 · salida a ${L(r.from)?.name}` : n === r.length ? `Tramo ${n} · salida a ${L(r.to)?.name}` : `Tramo ${n}`), ...(what.length ? what.map(w => h('div', { class: 's' }, w)) : [h('div', { class: 's' }, n === pos ? 'Estás aquí' : 'Camino despejado')]),
				blocked ? h('div', { class: 's' }, '🔒 Hay algo pendiente por el camino') : null),
			n === pos ? null : h('b', {}, blocked ? '' : 'Ir')));
	}
	sheet.set([h('div', { class: 'note' }, 'A lomos de tu montura llegas de un tirón a cualquier tramo que ya conozcas, sin encuentros por el camino. Los que tienen algo que hacer salen marcados.'), h('div', { class: 'list' }, ...rows)]);
}

async function arriveTramo(loc, n, dir) {
	const items = tramoItems(loc, n);
	const pr = routeProg(loc.id);
	let happened = false;
	for (const it of items) {
		if (it.script) {
			const key = n + ':' + it.script;
			if (it.once !== false && pr.done[key]) continue;
			if (it.dir !== undefined && it.dir !== dir) continue;
			beginScene(); // la marca de «ya pasó» solo se guarda si la escena termina
			try { pr.done[key] = true; await runScript(it.script); } finally { endScene(); }
			happened = true;
		}
		if (it.trainer && !it.optional && !G.beaten[it.trainer]) {
			const res = await battle({ trainer: it.trainer });
			happened = true;
			if (res?.result === 'lose') return;
		}
		if (it.wildFixed && !pr.done[n + ':wild']) {
			pr.done[n + ':wild'] = true;
			await battle({ wild: it.wildFixed });
			happened = true;
		}
	}
	if (G.loc !== loc.id) return; // un guion nos movió
	if (!happened) {
		const terrain = tramoTerrain(loc, n);
		if (rng() < encounterRate(loc)) {
			const w = rollWild(loc, terrain);
			if (w) {
				const lead = G.party.find(p => p.hp > 0);
				if ((G.vars.repel || 0) > 0 && lead && w.mon.lv < lead.lv) return;
				await battle({ wild: { mon: w.mon, gimmick: w.entry.gimmick }, terrain });
			}
		}
	}
}

// Textos según el terreno del tramo (antes todo decía «hierba», también en rocas, arena o nieve)
const TERRAIN_TXT = {
	grass: { en: 'entre la hierba', move: '¡La hierba se agita!' },
	flowers: { en: 'entre las flores', move: '¡Las flores se agitan!' },
	forest: { en: 'entre la maleza', move: '¡La maleza se agita!' },
	rocks: { en: 'entre las rocas', move: '¡Algo se mueve entre las rocas!' },
	cave: { en: 'entre las rocas', move: 'Algo se mueve entre las rocas…' },
	sand: { en: 'en la arena', move: '¡La arena se remueve!' },
	snow: { en: 'en la nieve', move: '¡La nieve se remueve!' },
	water: { en: 'bajo la superficie del agua', move: 'Algo se mueve bajo el agua…' },
	path: { en: 'junto al camino', move: '¡Algo se mueve junto al camino!' },
};
const terrainTxt = t => TERRAIN_TXT[t] || TERRAIN_TXT.grass;

async function searchHere() {
	const loc = L(G.loc);
	const n = G.route.pos;
	const pr = routeProg(loc.id);
	const hidden = tramoItems(loc, n).find(x => x.item && x.hidden && !pr.items[n + ':' + x.item]);
	if (hidden) {
		pr.items[n + ':' + hidden.item] = true;
		addItem(hidden.item, hidden.n || 1);
		await say(null, `Rebuscando ${terrainTxt(tramoTerrain(loc, n)).en}… ¡Has encontrado **${itemName(hidden.item)}**!`);
		return;
	}
	const terrain = tramoTerrain(loc, n);
	const w = rollWild(loc, terrain);
	if (w && rng() < 0.85) {
		routeMsg = '';
		await say(null, terrainTxt(terrain).move);
		await battle({ wild: { mon: w.mon, gimmick: w.entry.gimmick }, terrain });
	} else {
		routeMsg = 'Buscas un rato, pero no encuentras nada.';
	}
}

// =================== DexNav ===================
// Rastrea una especie ya vista en este tramo. Cada éxito seguido con la misma especie sube la cadena:
// más nivel, más IVs perfectos, más probabilidad de habilidad oculta y de variocolor. Huir o fallar rompe la cadena.
function dexnavBonus(chain) {
	return {
		perfect: chain >= 20 ? 3 : chain >= 10 ? 2 : chain >= 5 ? 1 : 0,
		hidden: Math.min(0.35, 0.05 + chain * 0.015),
		shinyRate: Math.max(400, Math.round(4096 / (1 + chain / 4))),
		lv: chain >= 15 ? 3 : chain >= 10 ? 2 : chain >= 5 ? 1 : 0,
		find: Math.min(0.92, 0.7 + chain * 0.01),
	};
}
function openDexNav() {
	const loc = L(G.loc);
	if (!loc?.route) return;
	const pos = G.route?.pos || 0;
	const terrain = tramoTerrain(loc, pos);
	const all = encounterTable(loc, terrain);
	const odds = encounterOdds(loc, terrain);
	const dn = G.dexnav || {};
	const sheet = openSheet('DexNav', null);
	const TN = { grass: 'hierba alta', cave: 'cueva', water: 'agua', forest: 'bosque', flowers: 'flores', sand: 'arena', snow: 'nieve', path: 'camino', rocks: 'rocas' };
	const body = [h('div', { class: 'note' }, `Rastrea un Pokémon que ya hayas visto en este tramo (${TN[terrain] || terrain}). Si lo encuentras varias veces seguidas, la cadena sube: más nivel, más potencial, más opciones de habilidad oculta y de variocolor. Huir o fallar el rastreo rompe la cadena.`)];
	if (dn.sp) { const b = dexnavBonus(dn.chain); body.push(h('div', { class: 'note' }, `🔗 Cadena actual: **${D.species[dn.sp]?.name}** ×${dn.chain} · IVs perfectos: ${b.perfect} · Hab. oculta: ${Math.round(b.hidden * 100)} % · Variocolor: 1/${b.shinyRate}`.replace(/\*\*/g, ''))); }
	const list = h('div', { class: 'list' });
	const species = [...new Set(all.map(e => e.sp))].sort((a, b) => (odds[b] || 0) - (odds[a] || 0));
	for (const sp of species) {
		const s = D.species[sp];
		const seen = G.dex.seen[s.num], caught = G.dex.caught[s.num];
		const chain = dn.sp === sp ? dn.chain : 0;
		const p = odds[sp] || 0;
		const row = h('div', { class: 'mon' + (seen ? '' : ' fainted') },
			h('div', { class: 'sprite' }, seen ? monImg(sp, { anim: false }) : h('div', { style: { fontSize: '26px' } }, '❔')),
			h('div', { class: 'info' },
				h('div', { class: 'name' }, seen ? s.name : '???', caught ? h('span', { class: 'caughtmark' }, '◓') : null, all.find(e => e.sp === sp)?.displaced ? h('span', { class: 'status', style: { background: '#7a5cd6' } }, 'DESPLAZADO') : null),
				h('div', { class: 'hptext' }, h('span', {}, seen ? (caught ? 'Capturado' : 'Visto, sin capturar') + (chain ? ` · 🔗 ${chain}` : '') : 'Aún no lo has visto'), h('span', {}, p ? `1 de cada ${Math.round(1 / p)}` : ''))),
			seen ? h('button', { class: 'btn primary dn-go', onclick: async () => { sheet.close(); await guarded(() => dexnavTrack(loc, terrain, sp)); } }, 'Rastrear') : null);
		list.append(row);
	}
	if (!species.length) list.append(h('div', { class: 'empty' }, 'Aquí no hay Pokémon que rastrear ahora mismo.'));
	body.push(list);
	sheet.set(body);
}
async function dexnavTrack(loc, terrain, sp) {
	const entries = encounterTable(loc, terrain).filter(e => e.sp === sp);
	if (!entries.length) { await say(null, 'Ahora mismo no hay rastro de ese Pokémon por aquí.'); return; }
	G.dexnav ||= {};
	if (G.dexnav.sp !== sp) G.dexnav = { sp, chain: 0 };
	const b = dexnavBonus(G.dexnav.chain);
	await say(null, `Rotom marca un movimiento ${terrainTxt(terrain).en}. Te acercas despacio…`);
	if (rng() > b.find) {
		const had = G.dexnav.chain;
		G.dexnav.chain = 0;
		await say(null, `¡Vaya! Se ha dado cuenta y ha huido.${had ? ' La cadena se rompe.' : ''}`);
		return;
	}
	const e = entries[Math.floor(rng() * entries.length)];
	const [l0, l1] = Array.isArray(e.lv) ? e.lv : [e.lv, e.lv];
	const level = Math.min(100, l0 + Math.floor(rng() * (l1 - l0 + 1)) + b.lv);
	const ivIdx = [0, 1, 2, 3, 4, 5].sort(() => rng() - 0.5).slice(0, b.perfect);
	const ivs = [0, 1, 2, 3, 4, 5].map(i => ivIdx.includes(i) ? 31 : Math.floor(rng() * 32));
	const mon = createPokemon(sp, { level, ivs, hidden: rng() < b.hidden, shinyRate: count('shinycharm') ? Math.round(b.shinyRate / 3) : b.shinyRate, form: e.form });
	const res = await battle({ wild: { mon }, terrain });
	if (res?.result === 'win' || res?.result === 'caught') {
		G.dexnav.chain = (G.dexnav.chain || 0) + 1;
		const nb = dexnavBonus(G.dexnav.chain);
		toast(`🔗 Cadena DexNav: ${D.species[sp].name} ×${G.dexnav.chain}${nb.perfect > b.perfect ? ' · ¡más potencial!' : ''}`);
	} else {
		G.dexnav.chain = 0;
		toast('🔗 La cadena DexNav se ha roto');
	}
	await saveGame();
	render();
}

async function shortcut() {
	const loc = L(G.loc);
	const r = loc.route;
	const i = await choose('Ya conoces bien este camino. ¿A dónde vas?', [L(r.from).name, L(r.to).name, 'Cancelar']);
	if (i === 0) await enterLocation(r.from, { from: loc.id });
	if (i === 1) await enterLocation(r.to, { from: loc.id });
}

// =================== Moverse ===================
export async function enterLocation(id, { from, silent } = {}) {
	const loc = L(id);
	if (!loc) { toast('Lugar desconocido: ' + id); return; }
	const firstTime = !G.visited[id];
	G.visited[id] = true;
	{ const top = topLoc(id); if (top && ['city', 'town'].includes(top.kind) && G.album && !G.album[top.id]) { G.album[top.id] = Date.now(); setTimeout(() => toast(`📮 Nueva postal: ${top.name}`), 600); } }
	for (let p = loc.parent; p && !G.visited[p]; p = L(p)?.parent) G.visited[p] = true;
	G.loc = id;
	if (isRoute(loc)) {
		const r = loc.route;
		const pos = from === r.to ? r.length : 0;
		G.route = { id, pos };
		markTramo(id, pos);
	} else {
		G.route = null;
	}
	routeMsg = '';
	// guiones al entrar
	const enters = (loc.onEnter || []).concat(...activeEvents().map(e => e.onEnter?.[id] || []));
	for (let i = 0; i < enters.length; i++) {
		const e = enters[i];
		const key = 'enter:' + id + ':' + (e.script || i);
		if (e.once !== false && G.flags[key]) continue;
		if (e.cond !== undefined && !evalCond(e.cond)) continue;
		beginScene(); // la marca de «ya pasó» solo se guarda si la escena termina
		try { G.flags[key] = true; await runScript(e.script); } finally { endScene(); }
		if (G.loc !== id) return;
	}
	await saveGame();
	render();
}

/** Combate genérico (desde guiones o rutas). */
export async function battle(cfg) {
	const hooksObj = {
		currentLoc: () => L(G.loc),
		terrainHere: () => (G.route ? tramoTerrain(L(G.loc), G.route.pos) : 'grass'),
		learnMove: (p, m) => learnMoveUI(p, m),
		receivePokemon: (p, o) => receivePokemon(p, o),
		tryEvolve: (p, ctx) => tryEvolve(p, ctx),
	};
	const res = await runBattle(cfg, hooksObj);
	if (res.result === 'lose' && !cfg.canLose) {
		const dest = whiteout();
		await say(null, `${G.player.name} vuelve corriendo al Centro Pokémon más cercano…`);
		if (G.lastCenterSub && L(G.lastCenterSub)) G.loc = G.lastCenterSub;
		G.route = null;
		await say({ name: 'Enfermera Joy', look: { hair: 'long', hairColor: '#e98aa8', outfit: '#f3e6e8', outfit2: '#e85a6a', skin: 0, acc: 'bow' } }, 'Tus Pokémon ya están recuperados. ¡No te rindas!');
	}
	await saveGame();
	return res;
}

export async function tryEvolve(p, ctx) {
	const loc = topLoc(G.loc);
	const to = checkEvolution(p, { ...ctx, time: isNight() ? 'night' : 'day', region: loc?.region });
	if (!to) return false;
	return evolveUI(p, to);
}

async function askNickname(p) {
	if (await confirm(`¿Quieres ponerle un mote a ${D.species[p.sp].name}?`)) {
		const n = await prompt('Mote:', '');
		if (n) p.nick = n.slice(0, 12);
	}
}

export async function receivePokemon(p, { caught = false, silent = false, nickname = true } = {}) {
	markCaught(p.sp);
	if (!caught && !silent) await say(null, `¡${G.player.name} ha recibido a **${D.species[p.sp].name}**!`);
	if (nickname && !silent) await askNickname(p);
	if (G.party.length < 6) { G.party.push(p); return; }
	const toBox = async (mon, msg = true) => {
		const bi = boxInsert(G, mon);
		if (msg) await say(null, `**${displayName(mon)}** se ha enviado a la Caja ${bi + 1} del PC.`);
	};
	if (silent) { await toBox(p, false); return; }
	// Equipo lleno: elegir si entra al equipo (y quién sale) o va al PC
	while (true) {
		const i = await choose(`Tu equipo está lleno. ¿Qué hacemos con ${displayName(p)} (Nv. ${p.lv})?`, ['Meterlo en el equipo (otro va al PC)', 'Enviarlo al PC', 'Ver sus datos']);
		if (i === 2) { await new Promise(res => openSummary(p, null, { battle: true, hp: p.hp, maxhp: maxHp(p), onClose: res })); continue; }
		if (i === 1) { await toBox(p); return; }
		const opts = G.party.map(m => `${displayName(m)} · Nv. ${m.lv} · ${m.hp}/${maxHp(m)} PS${m.uid === G.vars.riolu_uid ? ' ⭐' : ''}`).concat(['Cancelar']);
		const j = await choose(`¿Quién deja su sitio a ${displayName(p)}?`, opts);
		if (j >= G.party.length) continue;
		const out = G.party[j];
		G.party[j] = p;
		await toBox(out, false);
		await say(null, `**${displayName(p)}** se une a tu equipo. **${displayName(out)}** se va al PC.`);
		return;
	}
}

// =================== Mapa ===================
// Símbolos del mapa: cada tipo de lugar tiene su dibujo (unidades del viewBox; centrado en 0,0, caben en ±4).
const MAP_SYMBOLS = {
	city: 'M-3.6,3.4 V-1.2 H-1.4 V3.4 Z M-1.2,3.4 V-3.6 H1.4 V3.4 Z M1.6,3.4 V-0.2 H3.6 V3.4 Z',
	town: 'M-3.4,3.2 V-0.4 L0,-3.4 L3.4,-0.4 V3.2 Z',
	cave: 'M-3.8,3.2 L-1,-3 L0.6,-0.6 L1.8,-2 L3.8,3.2 Z',
	forest: 'M0,-3.8 L3,0.2 H1.4 L3.4,2.4 H0.7 V3.6 H-0.7 V2.4 H-3.4 L-1.4,0.2 H-3 Z',
	area: 'M0,-3.6 L3.6,0 L0,3.6 L-3.6,0 Z',
	water: 'M-3.6,-1 Q-1.8,-3 0,-1 T3.6,-1 V3 H-3.6 Z',
};
const MAP_DETAIL = { // huecos oscuros encima del símbolo (ventanas, puerta, boca de cueva)
	city: 'M-2.9,-0.2 h0.8 v0.9 h-0.8 Z M-2.9,1.5 h0.8 v0.9 h-0.8 Z M-0.5,-2.6 h1.2 v1 h-1.2 Z M-0.5,-0.8 h1.2 v1 h-1.2 Z M-0.5,1 h1.2 v1 h-1.2 Z M2.2,0.8 h0.8 v0.9 h-0.8 Z',
	town: 'M-0.8,3.2 V1 H0.8 V3.2 Z',
	cave: 'M-1.2,3.2 V1.6 Q0,0 1.2,1.6 V3.2 Z',
};
const mapKind = n => isRoute(n) ? (n.kind === 'cave' ? 'cave' : n.kind === 'forest' ? 'forest' : 'route') : (MAP_SYMBOLS[n.kind] ? n.kind : 'area');
const MAP_KIND_NAME = { city: 'Ciudad', town: 'Pueblo', route: 'Ruta', cave: 'Cueva', forest: 'Bosque', area: 'Lugar especial' };
/** Servicios de un lugar y de sus edificios, para la ficha del mapa. */
function placeServices(loc) {
	const out = new Set();
	const all = [loc, ...Object.values(C.locations).filter(l => topLoc(l.id)?.id === loc.id && l.id !== loc.id)];
	for (const l of all) {
		if (l.kind === 'gym') out.add('🏅 Gimnasio');
		for (const sp of l.spots || []) {
			const a = sp.action || {};
			if (a.center) out.add('❤️ Centro Pokémon'); if (a.shop) out.add('🛒 Tienda'); if (a.pc) out.add('💻 PC'); if (a.training) out.add('🥋 Entrenamiento');
		}
	}
	return [...out];
}
function openMap(startRegion = null) {
	const here = topLoc(G.loc);
	let region = startRegion || here?.region || Object.keys(C.regions)[0];
	const known = id => G.visited[id] || (L(id)?.links || []).some(n => G.visited[n]);
	const regionsKnown = Object.keys(C.regions).filter(r => Object.values(C.locations).some(l => l.region === r && !l.parent && G.visited[l.id]));
	let sel = here?.id, legend = false;
	const sheet = openSheet('Mapa', null);
	const svgNS = 'http://www.w3.org/2000/svg';
	const el = (t, a, txt) => { const e = document.createElementNS(svgNS, t); for (const k in a) e.setAttribute(k, a[k]); if (txt !== undefined) e.textContent = txt; return e; };
	const draw = () => {
		const R = C.regions[region] || { name: region };
		sheet.title('Mapa de ' + (R.name || region));
		const nodes = Object.values(C.locations).filter(l => l.region === region && l.map && !l.parent);
		const W = 100, H = R.h || 130;
		const news = newsByPlace();
		const gatherReady = {};
		for (const p of knownGatherPoints()) if (!gatherLeft(p.gid, p.loc)) { const t = (topLoc(p.loc.id) || p.loc).id; gatherReady[t] = (gatherReady[t] || 0) + 1; }
		const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Mapa de ' + (R.name || region) });
		svg.append(el('rect', { x: 0, y: 0, width: W, height: H, fill: R.sea || '#1d3a66' }));
		// olas del mar, para que no sea un plano liso
		for (let y = 6; y < H; y += 11) for (let x = (y % 22 ? 4 : 12); x < W; x += 16) svg.append(el('path', { d: `M${x},${y} q1.5,-1.4 3,0 t3,0`, fill: 'none', stroke: 'rgba(255,255,255,.12)', 'stroke-width': .5 }));
		if (R.land) svg.append(el('path', { d: R.land, fill: R.landColor || '#4f8a55', stroke: '#e9dfc0', 'stroke-width': .7, 'stroke-linejoin': 'round' }));
		// caminos
		const drawn = new Set();
		for (const n of nodes) for (const m of n.links || []) {
			const o = L(m);
			if (!o?.map || o.region !== region) continue;
			const k = [n.id, m].sort().join('|');
			if (drawn.has(k)) continue;
			drawn.add(k);
			if (!known(n.id) && !known(m)) continue;
			const both = G.visited[n.id] && G.visited[m];
			svg.append(el('line', { x1: n.map.x, y1: n.map.y, x2: o.map.x, y2: o.map.y, stroke: '#17223b', 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: both ? .9 : .35 }));
			svg.append(el('line', { x1: n.map.x, y1: n.map.y, x2: o.map.x, y2: o.map.y, stroke: both ? '#f3e6c4' : 'rgba(243,230,196,.55)', 'stroke-width': 1.2, 'stroke-linecap': 'round', 'stroke-dasharray': both ? '' : '1.6 2.2' }));
		}
		const labels = [];
		for (const n of nodes) {
			if (!known(n.id)) continue;
			const kind = mapKind(n), vis = G.visited[n.id], isHere = n.id === here?.id;
			const g = el('g', { transform: `translate(${n.map.x},${n.map.y})` });
			if (n.id === sel) g.append(el('circle', { r: 6.4, fill: 'rgba(242,179,61,.18)', stroke: '#f2b33d', 'stroke-width': .8 }));
			if (kind === 'route') {
				const fill = !vis ? '#33456f' : G.cleared[n.id] ? '#9fe08f' : '#8fb0ff';
				g.append(el('rect', { x: -1.9, y: -1.9, width: 3.8, height: 3.8, rx: 1.1, fill, stroke: '#17223b', 'stroke-width': .7, transform: 'rotate(45)' }));
				if (G.cleared[n.id]) g.append(el('path', { d: 'M-1,0 L-0.2,0.9 L1.2,-0.9', fill: 'none', stroke: '#17223b', 'stroke-width': .7, 'stroke-linecap': 'round' }));
				else if (!vis) g.append(el('text', { y: 1, 'font-size': 3, 'text-anchor': 'middle', fill: '#c9d3ea', 'font-family': 'Pixelify, sans-serif' }, '?'));
			} else {
				const base = kind === 'cave' ? '#b9a98c' : kind === 'forest' ? '#7fd08a' : kind === 'area' ? '#f0c6ff' : '#ffffff';
				g.append(el('path', { d: MAP_SYMBOLS[kind], fill: vis ? base : '#7d8aa8', stroke: '#17223b', 'stroke-width': .8, 'stroke-linejoin': 'round' }));
				if (MAP_DETAIL[kind]) g.append(el('path', { d: MAP_DETAIL[kind], fill: vis ? '#2a3c66' : '#56617c' }));
				if (kind === 'town') g.append(el('path', { d: 'M-3.4,-0.4 L0,-3.4 L3.4,-0.4 Z', fill: vis ? '#e5686b' : '#6b7590', stroke: '#17223b', 'stroke-width': .8, 'stroke-linejoin': 'round' }));
			}
			// señales: novedad sin ver (dorado «!»), cosas pendientes ya vistas (azul), recolección lista (hoja verde)
			const nw = news[n.id];
			if (nw) {
				g.append(el('circle', { cx: 3.6, cy: -3.6, r: 2.2, fill: nw.unread ? '#f2b33d' : '#4c7cf0', stroke: '#17223b', 'stroke-width': .6 }));
				g.append(el('text', { x: 3.6, y: -2.5, 'font-size': 3.2, 'text-anchor': 'middle', fill: nw.unread ? '#3a2a06' : '#fff', 'font-weight': 700, 'font-family': 'Pixelify, sans-serif' }, nw.unread ? '!' : String(Math.min(9, nw.news))));
			}
			if (gatherReady[n.id]) g.append(el('circle', { cx: -3.8, cy: -3.4, r: 1.5, fill: '#3fbf7f', stroke: '#17223b', 'stroke-width': .5 }));
			if (isHere) {
				const pin = el('g', { class: 'map-pin' });
				pin.append(el('path', { d: 'M0,-5.2 L2.2,-9 A2.6,2.6 0 1 0 -2.2,-9 Z', fill: '#f2b33d', stroke: '#17223b', 'stroke-width': .7, 'stroke-linejoin': 'round' }));
				pin.append(el('circle', { cy: -9.6, r: 1, fill: '#17223b' }));
				g.append(pin);
			}
			const hit = el('circle', { r: 6.5, fill: 'transparent' });
			hit.style.cursor = 'pointer';
			hit.addEventListener('click', () => { sel = n.id; draw(); });
			g.append(hit);
			svg.append(g);
			if (kind !== 'route' || n.id === sel) labels.push({ n, kind, vis });
		}
		// rótulos encima de todo, con borde para leerse sobre tierra, mar y caminos
		for (const { n, kind, vis } of labels) {
			const name = vis ? (n.short || n.name.replace(/^(Ciudad|Pueblo) /, '')) : '???';
			svg.append(el('text', { x: Math.max(8, Math.min(W - 8, n.map.x)), y: n.map.y + (kind === 'route' ? 6.6 : 8.2), 'font-size': 3.5, 'text-anchor': 'middle', fill: n.id === sel ? '#ffd98a' : '#fff6dc', stroke: '#17223b', 'stroke-width': 1.1, 'paint-order': 'stroke', 'stroke-linejoin': 'round', 'font-family': 'Pixelify, sans-serif', 'pointer-events': 'none' }, name));
		}

		const info = h('div', { class: 'mapinfo' });
		const s = L(sel);
		if (s && s.region === region) {
			const kind = mapKind(s), vis = G.visited[s.id];
			info.append(h('div', { class: 'mapinfo-head' }, h('h3', {}, vis ? s.name : 'Lugar sin visitar'), h('span', { class: 'mapkind k-' + kind }, MAP_KIND_NAME[kind])));
			const status = isRoute(s) ? (G.cleared[s.id] ? '✔ Despejada' : vis ? 'Explorando' : 'Sin explorar') : (vis ? 'Visitado' : 'Sin visitar');
			info.append(h('div', { class: 'mapinfo-sub' }, status + (s.id === here?.id ? ' · estás aquí' : '') + (vis && s.mapNote ? ' · ' + tx(s.mapNote) : '')));
			if (vis) {
				const sv = placeServices(s);
				if (sv.length) info.append(h('div', { class: 'mapchips' }, ...sv.map(x => h('span', {}, x))));
				if (isRoute(s)) {
					const lv = Object.values(s.route.encounters || {}).flat().flatMap(e => [].concat(e.lv)).filter(Number.isFinite);
					if (lv.length) info.append(h('div', { class: 'mapchips' }, h('span', {}, `🌿 Salvajes Nv. ${Math.min(...lv)}–${Math.max(...lv)}`), h('span', {}, `${s.route.length} tramos`)));
				}
				if (gatherReady[s.id]) info.append(h('div', { class: 'mapchips' }, h('span', { class: 'ok' }, `✨ ${gatherReady[s.id]} ${gatherReady[s.id] === 1 ? 'punto de recolección listo' : 'puntos de recolección listos'}`)));
			}
			if (s.id !== here?.id) {
				const start = G.route ? G.loc : here.id;
				const path = findPath(start, s.id);
				if (path) {
					info.append(h('button', { class: 'btn primary', style: { width: '100%' }, onclick: async () => {
						const ce = canEnter(s.id);
						if (!ce.ok) { toast(tx(ce.msg)); return; }
						sheet.close();
						await guarded(async () => { await enterLocation(s.id, { from: path.length >= 2 ? path[path.length - 2] : start }); });
					} }, path.length > 2 ? `Viajar · ${path.length - 1} tramos de camino conocido` : 'Ir'));
				} else info.append(h('div', { class: 'note' }, 'Aún no conoces un camino seguro hasta aquí.'));
			}
			const here2 = newsState().items.filter(i => i.loc && (topLoc(i.loc) || L(i.loc))?.id === s.id);
			if (here2.length) info.append(h('div', { class: 'section-title' }, `Novedades aquí (${here2.length})`), h('div', { class: 'list' }, ...here2.slice(0, 6).map(i => newsRow(i))));
		} else info.append(h('div', { class: 'mapinfo-sub' }, 'Toca un lugar del mapa para ver qué hay y viajar.'));

		const tabs = regionsKnown.length > 1 ? h('div', { class: 'tabs' }, ...regionsKnown.map(r => h('button', { class: r === region ? 'on' : '', onclick: () => { region = r; sel = r === here?.region ? here.id : null; draw(); } }, C.regions[r].name || r, r === here?.region ? ' 📍' : ''))) : null;
		const LEG = [['city', 'Ciudad'], ['town', 'Pueblo'], ['cave', 'Cueva'], ['forest', 'Bosque'], ['area', 'Lugar especial']];
		const legBox = h('div', { class: 'maplegend' },
			h('button', { class: 'linkbtn', onclick: () => { legend = !legend; draw(); } }, legend ? 'Ocultar leyenda' : 'Ver leyenda'),
			legend ? h('div', { class: 'leg-grid' },
				...LEG.map(([k, n]) => { const sv = el('svg', { viewBox: '-5 -5 10 10', width: 22, height: 22 }); sv.append(el('path', { d: MAP_SYMBOLS[k], fill: k === 'cave' ? '#b9a98c' : k === 'forest' ? '#7fd08a' : k === 'area' ? '#f0c6ff' : '#fff', stroke: '#17223b', 'stroke-width': .8 })); if (MAP_DETAIL[k]) sv.append(el('path', { d: MAP_DETAIL[k], fill: '#2a3c66' })); return h('span', {}, sv, n); }),
				h('span', {}, h('i', { class: 'lg r-new' }), 'Ruta explorando'), h('span', {}, h('i', { class: 'lg r-ok' }), 'Ruta despejada'), h('span', {}, h('i', { class: 'lg r-unk' }), 'Sin explorar'),
				h('span', {}, h('i', { class: 'lg b-new' }, '!'), 'Novedad sin ver'), h('span', {}, h('i', { class: 'lg b-num' }, '2'), 'Cosas pendientes'), h('span', {}, h('i', { class: 'lg b-leaf' }), 'Recolección lista'), h('span', {}, h('i', { class: 'lg b-pin' }), 'Tú')) : null);
		const y = sheet.body.scrollTop;
		sheet.set([tabs, h('div', { class: 'mapwrap', 'data-noswipe': '' }, svg), legBox, info]);
		sheet.body.scrollTop = y;
	};
	draw();
}

// =================== Equipo ===================
function monRow(p, onclick, { sel = false } = {}) {
	const mhp = maxHp(p);
	const r = p.hp / mhp;
	const s = D.species[p.sp];
	return h('button', { class: 'mon' + (p.hp <= 0 ? ' fainted' : '') + (sel ? ' sel' : ''), onclick },
		h('div', { class: 'sprite' }, monImg(p.sp, { anim: false, shiny: p.shiny })),
		h('div', { class: 'info' },
			h('div', { class: 'name' }, displayName(p), p.gender === 'M' ? '♂' : p.gender === 'F' ? '♀' : '', h('span', { class: 'lv' }, 'Nv.' + p.lv), G.vars.cap && p.lv >= G.vars.cap ? h('span', { class: 'status capped', title: 'En el tope de nivel' }, 'TOPE') : null,
				p.status ? h('span', { class: 'status ' + p.status }, STATUS_ES[p.status]) : null, p.hp <= 0 ? h('span', { class: 'status fnt' }, 'DEB') : null,
				p.item ? h('span', { title: itemName(p.item) }, '✦') : null),
			h('div', { class: 'hpbar' }, h('i', { class: r > .5 ? '' : r > .2 ? 'mid' : 'low', style: { width: (r * 100) + '%' } })),
			h('div', { class: 'hptext' }, h('span', { class: 'typechip-row' }, ...s.types.map(t => h('span', { class: 'type', style: typeStyle(t) }, typeName(t)))), h('span', { class: 'hpnum ' + (r > .5 ? '' : r > .2 ? 'mid' : 'low') }, `${p.hp}/${mhp}`))));
}

function openParty() {
	const sheet = openSheet('Equipo', null);
	const draw = () => {
		const list = h('div', { class: 'list' });
		G.party.forEach((p, i) => list.append(monRow(p, () => openSummary(p, draw))));
		if (!G.party.length) list.append(h('div', { class: 'empty' }, 'Todavía no tienes Pokémon.'));
		const cap = G.vars.cap;
		const capBox = cap ? h('div', { class: 'capbox' + (G.party.some(p => p.lv >= cap) ? ' hit' : '') },
			h('span', { class: 'capn' }, 'Nv. ' + cap),
			h('div', {}, h('div', { class: 'capt' }, 'Tope de nivel'), h('div', { class: 'caps' }, G.party.some(p => p.lv >= cap)
				? 'Los que están en el tope casi no ganan experiencia. Sube al vencer al siguiente líder o jefe.'
				: 'Por encima de este nivel casi no se gana experiencia. Sube al vencer al siguiente líder o jefe.'))) : null;
		sheet.set([capBox, list, h('div', { class: 'note' }, 'Toca un Pokémon para ver sus datos, cambiar su orden, darle objetos o ponerle mote.')].filter(Boolean));
	};
	draw();
}

function happyText(v) {
	return v >= 255 ? 'Te adora. Está totalmente unido a ti.' : v >= 220 ? 'Te tiene muchísimo cariño.' : v >= 200 ? 'Te tiene mucho cariño.' : v >= 150 ? 'Le caes muy bien.' : v >= 100 ? 'Está a gusto contigo.' : v >= 50 ? 'Todavía no te conoce mucho.' : 'No parece muy contento.';
}
/** Medidor de amistad (10 corazones = 255) y aviso si evoluciona por amistad. */
function friendshipView(p) {
	const v = p.happy || 0;
	const full = Math.floor(v / 25.5);
	const hearts = h('div', { class: 'hearts', title: `${v}/255` }, ...Array.from({ length: 10 }, (_, i) => h('span', { class: i < full ? 'on' : i === full && v % 25.5 >= 12.75 ? 'half' : '' }, '♥')));
	const out = [h('div', {}, happyText(v)), hearts];
	const evos = (D.species[p.sp]?.evos || []).map(id => D.species[id]).filter(e => e && e.evoType === 'levelFriendship');
	for (const e of evos) {
		const c = (e.evoCondition || '').toLowerCase();
		const when = c.includes('night') ? ' de noche (20:00 a 5:59)' : c.includes('day') ? ' de día (6:00 a 19:59)' : '';
		const name = G.dex.seen[e.num] ? e.name : 'su evolución';
		out.push(h('div', { class: 'evo-hint' + (v >= 220 ? ' ready' : '') }, v >= 220
			? `✨ Ya tiene la amistad para evolucionar a ${name}: súbelo de nivel${when}.`
			: `Evoluciona por amistad${when}, cuando llegue a unos 9 corazones. Le faltan ${(Math.ceil((220 - v) / 25.5 * 2) / 2).toLocaleString('es-MX')}.`));
	}
	return h('div', { class: 'friend' }, ...out);
}
/** Tarjeta «Evolución» de la ficha: a qué evoluciona, cómo, cuánto le falta y dónde está el objeto. `hints` son los avisos de amistad de friendshipView. */
let MEGA_WORLD = null;
/** Megapiedras que se pueden conseguir en lo publicado (guiones, tiendas, recolección). */
function megaInWorld() {
	if (MEGA_WORLD) return MEGA_WORLD;
	MEGA_WORLD = new Set();
	const txt = JSON.stringify([C.scripts, C.shops, C.gather, C.ventures]);
	for (const id of Object.keys(D.items)) if (D.items[id].mega && txt.includes('"' + id + '"')) MEGA_WORLD.add(id);
	return MEGA_WORLD;
}
function evolutionCard(p, hints = [], { all = false, onMore } = {}) {
	const s = D.species[p.sp];
	const evos = evolutionInfo(p.sp);
	const lines = [];
	const shown = all || evos.length <= 3 ? evos : evos.slice(0, 3);
	const friendHints = hints.slice();
	const hintOf = new Map();
	for (const e of evos) if (D.species[e.to]?.evoType === 'levelFriendship') hintOf.set(e.to, friendHints.shift());
	for (const e of shown) {
		const es = D.species[e.to];
		const seen = !!G.dex.seen[es.num];
		const more = [];
		if (!es.evoType && es.evoLevel) {
			const d = es.evoLevel - p.lv;
			more.push(h('div', { class: 'evo-left' + (d <= 0 ? ' ready' : '') }, d > 0 ? `Le falta${d === 1 ? '' : 'n'} ${d} nivel${d === 1 ? '' : 'es'}` : '¡Ya puede! Sube un nivel'));
		}
		if (hintOf.get(e.to)) more.push(hintOf.get(e.to));
		if (e.item) {
			const n = G.bag[e.item] || 0, on = p.item === e.item;
			if (n || on) more.push(h('div', { class: 'evo-left ready' }, on ? `Lleva ${itemName(e.item)} ✔` : `Tienes ${itemName(e.item)} ×${n} ✔`));
			else if (e.where) more.push(h('div', { class: 'evo-where' }, h('b', {}, `${itemName(e.item)}: `), e.where));
		}
		lines.push(h('div', { class: 'evo-row' },
			h('div', { class: 'evo-sp' + (seen ? '' : ' unseen') }, monImg(e.to, { anim: false })),
			h('div', { class: 'evo-txt' }, h('div', { class: 'evo-name' }, '→ ' + (seen ? e.name : '???')), h('div', { class: 'evo-how' }, e.how), ...more)));
	}
	if (shown.length < evos.length) lines.push(h('button', { class: 'btn evo-more', onclick: onMore }, `Ver las ${evos.length} evoluciones`));
	if (!evos.length && s.prevo) lines.push(h('div', { class: 'evo-none' }, 'No evoluciona más.'));
	if (G.flags.mec_mega) {
		const base = s.base || p.sp;
		const owned = id => G.bag[id] > 0 || G.party.some(m => m.item === id) || G.boxes.some(bx => bx.some(m => m.item === id));
		const megaIds = Object.keys(D.items).filter(id => { const f = D.items[id].mega?.[0]; return f && D.species[f]?.base === base; });
		for (const id of megaIds) {
			const have = owned(id);
			// Solo las que tienes o las que ya existen en el mundo publicado (hay Megapiedras en los datos que aún no salen en el juego)
			if (!have && megaIds.filter(x => owned(x)).length) continue;
			if (!have && !megaInWorld().has(id)) continue;
			lines.push(h('div', { class: 'evo-row mega' }, itemImg(id), h('div', { class: 'evo-txt' }, h('div', { class: 'evo-how' }, `Megaevoluciona con ${itemName(id)}`), h('div', { class: 'evo-left' + (have ? ' ready' : '') }, have ? (p.item === id ? 'la lleva puesta ✔' : 'la tienes ✔') : 'aún no la tienes'))));
		}
	}
	if (!lines.length) return null;
	return h('div', { class: 'evo-card' }, h('div', { class: 'evo-title' }, 'Evolución'), ...lines);
}
export function openSummary(p, onChange, live = null) {
	// live: datos del combate en curso ({battle, hp, maxhp, status}); oculta las acciones que cambiarían el equipo
	const s = D.species[p.sp];
	const sheet = openSheet(displayName(p), null, { onClose: live?.onClose });
	let tab = 'info', evoAll = false;
	const draw = () => {
		const st = calcStats(p);
		const hpR = live ? live.hp / live.maxhp : p.hp / st.hp, hpCls = hpR > .5 ? '' : hpR > .2 ? 'mid' : 'low';
		const head = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 16px' } },
			h('div', { class: 'sprite', style: { width: '110px', height: '110px', display: 'grid', placeItems: 'center' } }, monImg(p.sp, { shiny: p.shiny })),
			h('div', {},
				h('div', { style: { fontWeight: 900, fontSize: '19px' } }, displayName(p), ' ', p.gender === 'M' ? '♂' : p.gender === 'F' ? '♀' : '', p.shiny ? ' ✨' : ''),
				h('div', { style: { color: 'var(--muted)' } }, `${s.name} · Nv. ${p.lv}`),
				h('div', { class: 'typechip-row', style: { marginTop: '6px' } }, ...s.types.map(t => h('span', { class: 'type', style: typeStyle(t) }, typeName(t)))),
				h('div', { class: 'hpbar', style: { width: '160px' } }, h('i', { class: hpCls, style: { width: (hpR * 100) + '%' } })),
				h('div', { class: 'hpnum ' + hpCls, style: { fontSize: '13px' } }, live ? `${live.hp}/${live.maxhp} PS` : `${p.hp}/${st.hp} PS`)));
		const tabs = h('div', { class: 'tabs' }, ...[['info', 'Datos'], ['stats', 'Stats'], ['moves', 'Movimientos'], live?.battle ? null : ['actions', 'Acciones']].filter(Boolean).map(([k, n]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, n)));
		let body;
		if (tab === 'info') {
			// La información de evolución va arriba del todo (antes había que ir a Acciones → Tutor y bajar hasta el fondo)
			const friend = friendshipView(p);
			const hints = [...friend.querySelectorAll('.evo-hint')];
			hints.forEach(n => n.remove());
			const evo = evolutionCard(p, hints, { all: evoAll, onMore: () => { evoAll = true; draw(); } });
			const kv = h('dl', { class: 'kv' },
				h('dt', {}, 'Especie'), h('dd', {}, `${s.name} (Nº ${s.num})`),
				h('dt', {}, 'Habilidad'), h('dd', {}, abilityName(p.abil)),
				h('dt', {}, ''), h('dd', { style: { fontWeight: 400, color: 'var(--muted)' } }, D.abilities[p.abil]?.desc || ''),
				h('dt', {}, 'Naturaleza'), h('dd', {}, natureName(p.nat) + (D.natures[p.nat]?.plus ? ` (+${STAT_NAMES[D.natures[p.nat].plus]}, −${STAT_NAMES[D.natures[p.nat].minus]})` : '')),
				h('dt', {}, 'Objeto'), h('dd', {}, p.item ? itemName(p.item) : 'Ninguno'),
				h('dt', {}, 'Tera'), h('dd', {}, typeName(p.tera)),
				h('dt', {}, 'Experiencia'), h('dd', {}, h('div', { class: 'hpbar' }, h('i', { style: { width: (expProgress(p) * 100) + '%', background: 'var(--aura)' } }))),
				h('dt', {}, 'Amistad'), h('dd', { style: { fontWeight: 400 } }, friend),
				h('dt', {}, 'Origen'), h('dd', { style: { fontWeight: 400 } }, `${L(p.metAt)?.name || 'Lugar desconocido'}, Nv. ${p.metLv}`),
				h('dt', {}, 'Ball'), h('dd', {}, itemName(p.ball)),
			);
			body = h('div', {}, evo, kv);
		} else if (tab === 'stats') {
			body = h('div', {}, ...STATS.map((k, i) => {
				const m = k === 'hp' ? 1 : natureMod(p.nat, k);
				return h('div', { class: 'statbar' }, h('span', { class: m > 1 ? 'up' : m < 1 ? 'down' : '' }, STAT_NAMES[k]), h('b', {}, st[k]), h('div', { class: 'b' }, h('i', { style: { width: Math.min(100, st[k] / (p.lv * 3 + 20) * 60) + '%' } })));
			}), h('div', { class: 'note' }, `Base: ${s.bs.join(' / ')} (total ${s.bs.reduce((a, b) => a + b, 0)}). EVs: ${p.evs.join(' / ')}.`),
			h('div', { class: 'note' }, 'Potencial (IVs): ' + p.ivs.map((v, i) => `${STAT_NAMES[STATS[i]]} ${v >= 31 ? '¡Máximo!' : v >= 26 ? 'Fantástico' : v >= 16 ? 'Muy bueno' : v >= 1 ? 'Bastante bueno' : 'No es bueno'}`).join(' · ')));
		} else if (tab === 'moves') {
			body = h('div', { class: 'list' }, ...p.moves.map(m => {
				const md = D.moves[m.id] || {};
				return h('div', { class: 'row', style: { alignItems: 'flex-start' } }, h('div', { class: 'ico', style: { background: TYPE_COLORS[md.type] } }, ''),
					h('div', { class: 'lbl' }, h('div', { class: 't' }, md.name || m.id, h('span', { style: { color: 'var(--muted)', fontWeight: 600, fontSize: '13px' } }, `  ${typeName(md.type)} · ${md.cat === 'Physical' ? 'Físico' : md.cat === 'Special' ? 'Especial' : 'Estado'}${md.bp ? ' · Pot. ' + md.bp : ''}${md.acc ? ' · Prec. ' + md.acc : ''}`)),
						h('div', { class: 's' }, md.desc || '')), h('b', {}, `${m.pp}/${Math.floor((md.pp || m.pp) * (5 + (m.ppUps || 0)) / 5)}`));
			}));
		} else {
			const idx = G.party.indexOf(p);
			body = h('div', { class: 'list' },
				idx > 0 ? h('button', { class: 'row', onclick: () => { G.party.splice(idx, 1); G.party.unshift(p); onChange?.(); toast(`${displayName(p)} irá en cabeza`); draw(); } }, h('div', { class: 'ico' }, '⬆️'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Poner en cabeza'))) : null,
				h('button', { class: 'row', onclick: async () => { const n = await prompt('Nuevo mote (vacío para quitarlo):', p.nick || ''); p.nick = (n || '').slice(0, 12); sheet.title(displayName(p)); onChange?.(); draw(); } }, h('div', { class: 'ico' }, '✏️'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Cambiar mote'))),
				h('button', { class: 'row', onclick: () => giveItemTo(p, draw) }, h('div', { class: 'ico' }, '✦'), h('div', { class: 'lbl' }, h('div', { class: 't' }, p.item ? `Objeto: ${itemName(p.item)}` : 'Darle un objeto'), h('div', { class: 's' }, p.item ? 'Toca para quitarlo o cambiarlo' : 'Objetos equipables de la mochila'))),
				h('button', { class: 'row', onclick: () => moveOrder(p, draw) }, h('div', { class: 'ico' }, '↕️'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Ordenar movimientos'))),
				h('button', { class: 'row', onclick: () => openTutor(p, () => { onChange?.(); draw(); }) }, h('div', { class: 'ico' }, '🎓'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Tutor de movimientos'), h('div', { class: 's' }, 'Recordar y olvidar movimientos'))),
			);
		}
		sheet.set([head, tabs, body]);
	};
	draw();
}

async function moveOrder(p, redraw) {
	const i = await choose('¿Qué movimiento quieres mover al primer lugar?', p.moves.map(m => moveName(m.id)).concat(['Cancelar']));
	if (i < p.moves.length && i > 0) { const [m] = p.moves.splice(i, 1); p.moves.unshift(m); }
	redraw();
}

/** Hoja para dar un objeto a un Pokémon: lo que lleva (con «Quitar») y la mochila por pestañas, como en la mochila. */
const HOLD_CATS = ['held-items', 'choice', 'type-enhancement', 'plates', 'scarves', 'species-specific', 'bad-held-items', 'z-crystals'];
const HOLD_TABS = [['equip', 'Equipables'], ['berries', 'Bayas'], ['mega', 'Megapiedras'], ['other', 'Otros']];
function holdClass(id) {
	const it = D.items[id];
	if (!it || ['key', 'pokeballs', 'machines'].includes(it.pocket) || it.tm || it.cat === 'all-machines') return null;
	if (it.mega || it.cat === 'mega-stones') return 'mega';
	if (it.berry || it.pocket === 'berries') return 'berries';
	if (HOLD_CATS.includes(it.cat) || (it.battle && it.cat !== 'evolution')) return 'equip'; // las piedras evolutivas no hacen nada equipadas
	return 'other';
}
function giveItemTo(p, redraw) {
	const s = D.species[p.sp];
	const sheet = openSheet('Dar un objeto', null, { onClose: () => redraw?.() });
	sheet.el.classList.add('give-sheet');
	let tab = null;
	const megaOwner = id => D.species[D.species[D.items[id].mega?.[0]]?.base]?.name || '';
	const megaFits = id => (D.items[id].mega || []).some(f => { const b = D.species[f]?.base; return b && (b === p.sp || b === s.base); });
	const short = t => { t = String(t || ''); if (t.length <= 110) return t; const cut = t.search(/\.\s/); return cut > 20 ? t.slice(0, cut + 1) : t; };
	const give = id => {
		const old = p.item;
		if (!removeItem(id)) return;
		if (old) addItem(old, 1);
		p.item = id;
		toast(old ? `${displayName(p)} lleva ${itemName(id)}. ${itemName(old)} vuelve a la mochila.` : `${displayName(p)} lleva ${itemName(id)}`);
		sheet.close();
	};
	const draw = () => {
		const groups = { equip: [], berries: [], mega: [], other: [] };
		for (const id of Object.keys(G.bag)) { const k = G.bag[id] > 0 && holdClass(id); if (k) groups[k].push(id); }
		const avail = HOLD_TABS.filter(([k]) => groups[k].length);
		if (!avail.some(([k]) => k === tab)) tab = avail[0]?.[0] || null;
		const head = h('div', { class: 'give-head' },
			h('div', { class: 'give-sp' }, monImg(p.sp, { anim: false, shiny: p.shiny })),
			h('div', { class: 'give-who' }, h('b', {}, displayName(p)), h('span', {}, `${s.name} · Nv. ${p.lv}`)));
		const held = p.item
			? h('div', { class: 'row give-held' }, itemImg(p.item), h('div', { class: 'lbl' }, h('div', { class: 's' }, 'Lleva'), h('div', { class: 't' }, itemName(p.item)), h('div', { class: 's' }, short(D.items[p.item]?.desc))),
				h('button', { class: 'btn', onclick: () => { const old = p.item; addItem(old, 1); p.item = ''; toast(`Has guardado ${itemName(old)}`); draw(); redraw?.(); } }, 'Quitar'))
			: h('div', { class: 'give-none' }, 'No lleva ningún objeto.');
		const out = [head, held];
		if (!avail.length) out.push(h('div', { class: 'empty' }, 'No tienes objetos para equipar en la mochila.'));
		else {
			out.push(h('div', { class: 'section-title' }, p.item ? 'Cambiarlo por…' : 'Darle…'));
			out.push(h('div', { class: 'tabs' }, ...avail.map(([k, n]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); sheet.body.scrollTop = 0; } }, n, h('span', { class: 'give-n' }, ' ' + groups[k].length)))));
			const order = itemSort(G.settings.bagSort || 'tipo');
			const ids = groups[tab].sort(tab === 'mega' ? (a, b) => megaFits(b) - megaFits(a) || order(a, b) : order);
			out.push(h('div', { class: 'list' }, ...ids.map(id => {
				const it = D.items[id];
				const off = tab === 'mega' && !megaFits(id);
				return h('button', { class: 'row' + (off ? ' give-off' : ''), onclick: () => give(id) }, itemImg(id),
					h('div', { class: 'lbl' }, h('div', { class: 't' }, it.name || id), h('div', { class: 's' }, off ? `Es de ${megaOwner(id) || 'otra especie'}: a ${s.name} no le sirve.` : short(it.desc))),
					h('b', {}, '×' + G.bag[id]));
			})));
		}
		sheet.set(out);
	};
	draw();
}

// =================== Mochila ===================
const USE_ON_MON = {
	potion: 20, superpotion: 60, hyperpotion: 120, maxpotion: 9999, fullrestore: 9999, freshwater: 30, sodapop: 50, lemonade: 70, moomoomilk: 100,
	berryjuice: 20, energypowder: 60, energyroot: 120, oranberry: 10, sitrusberry: 0.25,
};
const CURES = { antidote: ['psn', 'tox'], paralyzeheal: ['par'], burnheal: ['brn'], iceheal: ['frz'], awakening: ['slp'], fullheal: 'all', healpowder: 'all', fullrestore: 'all', lavacookie: 'all', lumiosegalette: 'all', shalourable: 'all', pechaberry: ['psn', 'tox'], cheriberry: ['par'], rawstberry: ['brn'], aspearberry: ['frz'], chestoberry: ['slp'], lumberry: 'all' };
const REVIVES = { revive: 0.5, maxrevive: 1, revivalherb: 1 };
const VITAMINS = { hpup: 0, protein: 1, iron: 2, calcium: 3, zinc: 4, carbos: 5 };
// Bayas que bajan esfuerzo y suben la amistad (canon)
const EV_BERRIES = { pomegberry: 0, kelpsyberry: 1, qualotberry: 2, hondewberry: 3, grepaberry: 4, tamatoberry: 5 };
const REPELS = { repel: 100, superrepel: 200, maxrepel: 250 };

// =================== Orden de objetos (mochila y tiendas) ===================
// «Tipo» sigue el orden de los juegos: por clase de objeto y, dentro de cada clase, de más barato a más caro
// (Poción → Superpoción → Hiperpoción…). Las MT van por número.
const CAT_ORDER = ['standard-balls', 'special-balls', 'apricorn-balls', 'healing', 'revival', 'status-cures', 'pp-recovery', 'vitamins', 'nature-mints',
	'medicine', 'picky-healing', 'in-a-pinch', 'type-protection', 'effort-drop', 'catching-bonus', 'baking-only', 'other',
	'stat-boosts', 'flutes', 'miracle-shooter', 'evolution', 'held-items', 'choice', 'type-enhancement', 'plates', 'mega-stones', 'z-crystals',
	'training', 'effort-training', 'spelunking', 'collectibles', 'loot', 'all-machines', 'gameplay', 'plot-advancement', 'event-items'];
const catRank = id => { const i = CAT_ORDER.indexOf(D.items[id]?.cat); return i < 0 ? CAT_ORDER.length : i; };
const BAG_SORTS = [['tipo', 'Tipo'], ['az', 'A-Z'], ['nuevo', 'Recientes'], ['cantidad', 'Cantidad']];
const SHOP_SORTS = [['tipo', 'Tipo'], ['precio', 'Precio'], ['az', 'A-Z']];
function itemSort(mode, priceOf) {
	const name = (a, b) => itemName(a).localeCompare(itemName(b), 'es', { numeric: true });
	const cost = id => priceOf ? priceOf(id) : (D.items[id]?.cost ?? 0);
	return (a, b) => {
		if (mode === 'az') return name(a, b);
		if (mode === 'nuevo') return (G.found?.[b] || 0) - (G.found?.[a] || 0) || name(a, b);
		if (mode === 'cantidad') return (G.bag[b] || 0) - (G.bag[a] || 0) || name(a, b);
		if (mode === 'precio') return cost(a) - cost(b) || name(a, b);
		return catRank(a) - catRank(b) || (D.items[a]?.cat === 'all-machines' ? 0 : cost(a) - cost(b)) || name(a, b);
	};
}
function sortBar(opts, mode, set) {
	return h('div', { class: 'sortbar', 'data-noswipe': '' }, h('span', {}, 'Orden'),
		...opts.map(([k, n]) => h('button', { class: mode === k ? 'on' : '', 'aria-pressed': String(mode === k), onclick: () => set(k) }, n)));
}

export function openBag(onPick) {
	let pocket = 'medicine';
	const sheet = openSheet('Mochila', null);
	const draw = () => {
		const tabs = h('div', { class: 'tabs' }, ...POCKETS.map(([k, n]) => h('button', { class: pocket === k ? 'on' : '', onclick: () => { pocket = k; draw(); } }, n)));
		const mode = G.settings.bagSort || 'tipo';
		const ids = Object.keys(G.bag).filter(id => G.bag[id] > 0 && (D.items[id]?.pocket || 'misc') === pocket).sort(itemSort(mode));
		const sortbar = sortBar(BAG_SORTS, mode, m => { G.settings.bagSort = m; draw(); });
		const list = h('div', { class: 'list' });
		for (const id of ids) {
			const it = D.items[id] || {};
			list.append(h('button', { class: 'row', onclick: () => itemMenu(id, draw) }, itemImg(id), h('div', { class: 'lbl' }, h('div', { class: 't' }, it.name || id), h('div', { class: 's' }, it.desc || '')), h('b', {}, pocket === 'key' ? '' : '×' + G.bag[id])));
		}
		if (!ids.length) list.append(h('div', { class: 'empty' }, 'No hay nada en este bolsillo.'));
		sheet.set([tabs, ids.length > 1 ? sortbar : null, list, h('div', { class: 'note' }, `Dinero: ${fmtMoney(G.player.money)}`)]);
	};
	draw();
}

async function itemMenu(id, redraw) {
	const it = D.items[id] || {};
	if (it.tm) {
		const md = D.moves[it.tm];
		const can = G.party.filter(p => canLearn(p.sp, it.tm));
		const opts2 = G.party.map(p => `${displayName(p)} · ${p.moves.some(m => m.id === it.tm) ? 'Ya lo sabe' : canLearn(p.sp, it.tm) ? 'Puede aprenderlo' : 'No puede'}`).concat(['Cancelar']);
		const i2 = await choose(`**${it.name}**: ${md?.name} (${typeName(md?.type)}${md?.bp ? ', pot. ' + md.bp : ''}).\n${md?.desc || ''}\nLas MT no se gastan.`, opts2);
		if (i2 < G.party.length) {
			const p = G.party[i2];
			if (!canLearn(p.sp, it.tm)) await say(null, `${displayName(p)} no puede aprender ${md?.name}.`);
			else await learnMoveUI(p, it.tm);
		}
		redraw();
		return;
	}
	const usable = USE_ON_MON[id] !== undefined || CURES[id] || REVIVES[id] || VITAMINS[id] !== undefined || EV_BERRIES[id] !== undefined || id === 'rarecandy' || it.cat === 'evolution' || REPELS[id] || id === 'ppup' || id === 'ppmax' || id === 'ether' || id === 'elixir' || id === 'maxether' || id === 'maxelixir' || it.use;
	const opts = [];
	if (it.read) opts.push(['Leer', () => readPaper(it.name, tx(it.read), { icon: itemImg(id) })]);
	if (it.art) opts.push(['Mirar', async () => { const { viewArt } = await import('./acuarela.js'); await viewArt(id); }]);
	if (usable) opts.push(['Usar', () => useItemOutside(id)]);
	if (it.pocket !== 'key') opts.push(['Dar a un Pokémon', async () => {
		const i = await choose('¿A quién?', G.party.map(p => displayName(p)).concat(['Cancelar']));
		if (i >= G.party.length) return;
		const p = G.party[i];
		if (p.item) addItem(p.item, 1);
		removeItem(id); p.item = id;
		toast(`${displayName(p)} lleva ${it.name}`);
	}]);
	if (it.pocket !== 'key' && it.cost) opts.push(['Tirar uno', async () => { if (await confirm(`¿Tirar ${it.name}?`)) removeItem(id); }]);
	opts.push(['Cancelar', () => {}]);
	const i = await choose(`**${it.name}**\n${it.desc || ''}`, opts.map(o => o[0]));
	await opts[i][1]();
	redraw();
}

async function useItemOutside(id) {
	const it = D.items[id] || {};
	if (it.use) { beginScene(); try { if (removeItem(id, it.consumable === false ? 0 : 1) || it.consumable === false) await runScript(it.use); } finally { endScene(); } return; }
	if (REPELS[id]) {
		if ((G.vars.repel || 0) > 0) { await say(null, 'Todavía tienes activo un repelente.'); return; }
		removeItem(id); G.vars.repel = REPELS[id];
		await say(null, `Has usado ${it.name}. Los Pokémon salvajes débiles no se acercarán durante un rato.`);
		return;
	}
	const i = await choose(`¿En quién usar ${it.name}?`, G.party.map(p => `${displayName(p)} · Nv.${p.lv} · ${p.hp}/${maxHp(p)}`).concat(['Cancelar']));
	if (i >= G.party.length) return;
	const p = G.party[i];
	const mhp = maxHp(p);
	let did = false, msg = '';
	if (REVIVES[id] !== undefined) {
		if (p.hp > 0) { await say(null, 'No tendría ningún efecto.'); return; }
		p.hp = Math.max(1, Math.floor(mhp * REVIVES[id])); p.status = ''; did = true; msg = `¡${displayName(p)} se ha reanimado!`;
		if (id === 'revivalherb') addHappy(p, -15);
	} else if (USE_ON_MON[id] !== undefined || CURES[id]) {
		if (p.hp <= 0) { await say(null, 'Está debilitado. Necesita algo para reanimarlo.'); return; }
		if (USE_ON_MON[id] !== undefined && p.hp < mhp) { const before = p.hp; const v = USE_ON_MON[id]; p.hp = Math.min(mhp, p.hp + (v < 1 ? Math.floor(mhp * v) : v)); did = true; msg = `¡${displayName(p)} ha recuperado ${p.hp - before} PS!`; }
		const cure = CURES[id];
		if (cure && p.status && (cure === 'all' || cure.includes(p.status))) { p.status = ''; did = true; msg = msg || `¡${displayName(p)} ya se encuentra bien!`; }
		if (id === 'energypowder' || id === 'energyroot') addHappy(p, -5);
		if (id === 'healpowder') addHappy(p, -5);
	} else if (VITAMINS[id] !== undefined) {
		const k = VITAMINS[id];
		const total = p.evs.reduce((a, b) => a + b, 0);
		if (p.evs[k] >= 252 || total >= 510) { await say(null, 'No tendría ningún efecto.'); return; }
		const oldMax = mhp;
		p.evs[k] = Math.min(252, p.evs[k] + Math.min(10, 510 - total));
		if (k === 0 && p.hp > 0) p.hp += maxHp(p) - oldMax;
		addHappy(p, 5); did = true; msg = `¡Ha subido el ${STAT_NAMES[STATS[k]]} base de ${displayName(p)}!`;
	} else if (EV_BERRIES[id] !== undefined) {
		const k = EV_BERRIES[id];
		if (p.evs[k] <= 0 && (p.happy || 0) >= 255) { await say(null, 'No tendría ningún efecto.'); return; }
		const oldMax = mhp, before = p.happy || 0, hadEv = p.evs[k] > 0;
		p.evs[k] = Math.max(0, p.evs[k] - 10);
		if (k === 0 && p.hp > 0) p.hp = Math.max(1, Math.min(maxHp(p), p.hp + maxHp(p) - oldMax));
		addHappy(p, before < 100 ? 10 : before < 200 ? 5 : 2);
		did = true; msg = `¡${displayName(p)} te mira con más cariño!` + (hadEv ? ` (Pierde unos pocos puntos de esfuerzo de ${STAT_NAMES[STATS[k]]}.)` : '');
	} else if (id === 'rarecandy') {
		if (p.lv >= 100) { await say(null, 'No tendría ningún efecto.'); return; }
		removeItem(id);
		const { addExp } = await import('../pokemon.js');
		const { expForLevel } = await import('../data.js');
		const lv = addExp(p, expForLevel(D.species[p.sp].growth, p.lv + 1) - p.exp);
		await say(null, `¡${displayName(p)} ha subido al nivel ${p.lv}!`);
		const { movesLearnedAt } = await import('../pokemon.js');
		for (const m of movesLearnedAt(p.sp, p.lv)) await learnMoveUI(p, m);
		await tryEvolve(p, { trigger: 'level' });
		return;
	} else if (it.cat === 'evolution' || id === 'linkingcord') {
		const loc = topLoc(G.loc);
		const to = checkEvolution(p, { trigger: 'item', item: id, time: isNight() ? 'night' : 'day', region: loc?.region });
		if (!to) { await say(null, 'No tendría ningún efecto.'); return; }
		removeItem(id);
		await evolveUI(p, to);
		return;
	} else if (['ether', 'maxether', 'elixir', 'maxelixir', 'ppup', 'ppmax'].includes(id)) {
		const all = id.includes('elixir');
		let slots = p.moves;
		if (!all) {
			const j = await choose('¿Qué movimiento?', p.moves.map(m => `${moveName(m.id)} ${m.pp}`).concat(['Cancelar']));
			if (j >= p.moves.length) return;
			slots = [p.moves[j]];
		}
		for (const m of slots) {
			const base = D.moves[m.id]?.pp || 10;
			if (id === 'ppup' || id === 'ppmax') { if ((m.ppUps || 0) < 3) { m.ppUps = id === 'ppmax' ? 3 : (m.ppUps || 0) + 1; did = true; } }
			const max = Math.floor(base * (5 + (m.ppUps || 0)) / 5);
			if (id.includes('ether') || id.includes('elixir')) { const add = id.startsWith('max') ? 99 : 10; if (m.pp < max) { m.pp = Math.min(max, m.pp + add); did = true; } }
		}
		msg = did ? 'Se han restaurado o aumentado los PP.' : '';
	}
	if (!did) { await say(null, 'No tendría ningún efecto.'); return; }
	removeItem(id);
	await say(null, msg);
}

// =================== Tienda ===================
async function openShop(id) {
	const shop = C.shops[id];
	if (!shop) return;
	const CATS = [
		['all', 'Todo'], ['pokeballs', 'Balls'], ['heal', 'Curación'], ['status', 'Estados'], ['evo', 'Piedras'], ['tm', 'MT'], ['mega', 'Megapiedras'], ['held', 'Equipables'], ['other', 'Otros'],
	];
	const HELD_CATS = ['held-items', 'choice', 'type-enhancement', 'plates', 'scarves', 'bad-held-items', 'species-specific'];
	const catOf = it => it.pocket === 'pokeballs' ? 'pokeballs'
		: it.tm ? 'tm' : it.cat === 'evolution' ? 'evo' : it.cat === 'mega-stones' ? 'mega' : HELD_CATS.includes(it.cat) ? 'held'
		: it.pocket === 'medicine' ? (/heal|antidote|awakening|parlyz|paralyz|fullheal|burn|ice/i.test(it.ic || '') && !/potion|revive|restore|water|lemonade|milk/i.test(it.ic || '') ? 'status' : 'heal')
		: 'other';
	return new Promise(resolve => {
		let mode = 'buy', cat = 'all', sel = null, qty = 1;
		const sheet = openSheet(shop.name || 'Tienda', null, { onClose: resolve });
		sheet.el.dataset.menu = 'tienda';
		const entries = () => shop.items.map(e => typeof e === 'string' ? { id: e } : e).map(o => {
			const it = D.items[toID(o.id)] || {};
			const ok = o.cond === undefined || evalCond(o.cond);
			const m = !ok && /^\s*badges\s*>=\s*(\d+)\s*$/.exec(o.cond || '');
			return { id: toID(o.id), it, price: o.price ?? it.cost ?? 100, ok, lockBadges: m ? +m[1] : null };
		}).filter(e => e.ok || e.lockBadges);
		const sellable = () => Object.keys(G.bag).filter(k => G.bag[k] > 0 && D.items[k] && D.items[k].pocket !== 'key' && D.items[k].cost > 0)
			.map(k => ({ id: k, it: D.items[k], price: Math.floor(D.items[k].cost / 2), ok: true }));
		const draw = () => {
			const all = mode === 'buy' ? entries() : sellable();
			const present = new Set(all.map(e => catOf(e.it)));
			if (cat !== 'all' && !present.has(cat)) cat = 'all';
			const smode = G.settings.shopSort || 'tipo';
			const priceOf = Object.fromEntries(all.map(e => [e.id, e.price]));
			const cmp = itemSort(smode, id => priceOf[id]);
			const shown = all.filter(e => cat === 'all' || catOf(e.it) === cat).sort((a, b) => (b.ok - a.ok) || cmp(a.id, b.id));
			if (sel && !all.some(e => e.id === sel && e.ok)) sel = null;

			const head = h('div', { class: 'shop-head' },
				h('div', { class: 'shop-money' }, h('span', { class: 'lab' }, 'Tu dinero'), h('b', {}, fmtMoney(G.player.money))),
				h('div', { class: 'shop-mode' },
					h('button', { class: mode === 'buy' ? 'on' : '', onclick: () => { mode = 'buy'; sel = null; draw(); } }, 'Comprar'),
					h('button', { class: mode === 'sell' ? 'on' : '', onclick: () => { mode = 'sell'; sel = null; draw(); } }, 'Vender')));
			const chips = h('div', { class: 'tabs shop-cats' }, ...CATS.filter(([k]) => k === 'all' || present.has(k))
				.map(([k, n]) => h('button', { class: cat === k ? 'on' : '', onclick: () => { cat = k; draw(); } }, n)));
			const grid = h('div', { class: 'shop-grid' });
			for (const e of shown) {
				const have = count(e.id);
				const card = h('button', { class: 'shop-card' + (sel === e.id ? ' sel' : '') + (e.ok ? '' : ' locked'), disabled: !e.ok, onclick: () => { sel = sel === e.id ? null : e.id; qty = 1; draw(); } },
					h('div', { class: 'sc-ico' }, itemImg(e.id)),
					h('div', { class: 'sc-name' }, e.it.name || e.id),
					e.it.tm && D.moves[toID(e.it.tm)] ? h('span', { class: 'type sc-type', style: typeStyle(D.moves[toID(e.it.tm)].type) }, typeName(D.moves[toID(e.it.tm)].type)) : null,
					e.ok ? h('div', { class: 'sc-price' + (mode === 'buy' && G.player.money < e.price ? ' short' : '') }, fmtMoney(e.price))
						: h('div', { class: 'sc-lock' }, `🔒 ${e.lockBadges} medalla${e.lockBadges === 1 ? '' : 's'}`),
					have ? h('div', { class: 'sc-have' }, '×' + have) : null);
				grid.append(card);
			}
			if (!shown.length) grid.append(h('div', { class: 'empty' }, mode === 'buy' ? 'Aquí no hay nada de esto.' : 'No tienes nada que vender.'));

			let foot = null;
			const e = all.find(x => x.id === sel);
			if (e) {
				const have = count(e.id);
				const max = mode === 'buy' ? (e.it.tm ? (have ? 0 : Math.min(1, Math.floor(G.player.money / e.price))) : Math.max(0, Math.min(99, Math.floor(G.player.money / e.price)))) : have;
				qty = Math.max(1, Math.min(qty, Math.max(1, max)));
				const total = e.price * qty;
				const can = max >= 1;
				const step = d => () => { qty = Math.max(1, Math.min(Math.max(1, max), qty + d)); draw(); };
				const bonus = mode === 'buy' && e.id === 'pokeball' && qty >= 10;
				foot = h('div', { class: 'shop-foot' },
					h('div', { class: 'sf-top' }, h('div', { class: 'sc-ico' }, itemImg(e.id)),
						h('div', { class: 'sf-txt' }, h('div', { class: 'sf-name' }, e.it.name), h('div', { class: 'sf-desc' }, e.it.desc || ''),
							e.it.tm ? h('div', { class: 'sf-have' }, (() => { const md = D.moves[toID(e.it.tm)] || {}; const can = G.party.filter(p => canLearn(p.sp, toID(e.it.tm))).map(p => displayName(p)); return `${typeName(md.type)} · ${md.cat === 'Physical' ? 'Físico' : md.cat === 'Special' ? 'Especial' : 'Estado'}${md.bp ? ' · Pot. ' + md.bp : ''}${md.acc && md.acc !== true ? ' · Prec. ' + md.acc : ''} · ${can.length ? 'Lo aprenden: ' + can.join(', ') : 'Nadie de tu equipo lo aprende'}`; })()) : null,
							h('div', { class: 'sf-have' }, e.it.tm ? (have ? 'Ya la tienes (no se gasta)' : 'No se gasta') : `Tienes ${have}`))),
					h('div', { class: 'sf-row' },
						h('div', { class: 'stepper' },
							h('button', { onclick: step(-10), disabled: qty <= 1, 'aria-label': 'Diez menos' }, '−10'),
							h('button', { onclick: step(-1), disabled: qty <= 1, 'aria-label': 'Uno menos' }, '−'),
							h('b', {}, qty),
							h('button', { onclick: step(1), disabled: qty >= max, 'aria-label': 'Uno más' }, '+'),
							h('button', { onclick: step(10), disabled: qty >= max, 'aria-label': 'Diez más' }, '+10')),
						h('button', { class: 'btn primary sf-go', disabled: !can, onclick: () => {
							if (mode === 'buy') {
								if (G.player.money < total) { toast('No te alcanza'); return; }
								G.player.money -= total; addItem(e.id, qty);
								toast(`Has comprado ${e.it.name} ×${qty}`);
								if (bonus) { addItem('premierball', 1); toast('¡De regalo, una Honor Ball!'); }
							} else {
								removeItem(e.id, qty); G.player.money += total;
								toast(`Has vendido ${e.it.name} ×${qty}`);
							}
							qty = 1; draw();
						} }, can ? `${mode === 'buy' ? 'Comprar' : 'Vender'} · ${fmtMoney(total)}` : (mode === 'buy' && e.it.tm && have ? 'Ya la tienes' : 'No te alcanza'))),
					bonus ? h('div', { class: 'sf-bonus' }, '🎁 Por 10 Poké Balls te regalan una Honor Ball') : null);
			}
			const sortbar = shown.length > 1 ? sortBar(SHOP_SORTS, smode, m => { G.settings.shopSort = m; draw(); }) : null;
			sheet.set([head, chips, sortbar, grid, foot].filter(Boolean));
		};
		draw();
	});
}

// =================== PC ===================
async function openPC() {
	return new Promise(resolve => {
		let box = Math.max(0, Math.min(G.vars.pc_box || 0, G.boxes.length - 1));
		let sel = null; // { where: 'party'|'box', box, idx } mientras mueves un Pokémon
		let multi = false, marks = [], skipTap = false; // modo «Seleccionar»: Pokémon marcados, en el orden en que se tocaron
		const sheet = openSheet('PC de almacenamiento', null, { onClose: () => { G.vars.pc_box = box; resolve(); } });
		sheet.el.dataset.menu = 'pc';
		// Barra fija de acciones del modo «Seleccionar»: va debajo del cuerpo de la hoja, no se desplaza con él
		const bar = h('div', { class: 'pc-bar', 'data-noswipe': '' });
		bar.hidden = true;
		sheet.el.append(bar);
		sheet.el.addEventListener('pointerdown', () => { skipTap = false; }, true);
		const listOf = (where, b) => where === 'party' ? G.party : G.boxes[b];
		const monAt = (where, b, i) => listOf(where, b)[i];
		const rioluUid = G.vars.riolu_uid;
		const bname = b => boxName(G, b);
		const inBox = b => hasBoxName(G, b) ? `«${bname(b)}»` : `la Caja ${b + 1}`;
		const place = (where, b) => where === 'party' ? 'tu equipo' : inBox(b);
		const boxLine = n => `${bname(n)} (${G.boxes[n].length}/${BOX_MAX})`;

		/** Mueve el seleccionado a (where, b, i): intercambia si hay alguien, o lo pone al final si es un hueco. */
		const drop = (where, b, i) => {
			const src = listOf(sel.where, sel.box), A = src[sel.idx];
			const dst = listOf(where, b), B = dst[i];
			if (!A) { sel = null; return; }
			if (B) {
				src[sel.idx] = B; dst[i] = A;
				if (sel.where === 'party' && where !== 'party') healFull(A);
				if (where === 'party' && sel.where !== 'party') healFull(B);
				toast(`${displayName(A)} ⇄ ${displayName(B)}`);
			} else {
				if (src === dst) { dst.splice(sel.idx, 1); dst.push(A); }
				else {
					if (where === 'party' && dst.length >= 6) { toast('Tu equipo ya tiene 6. Toca a uno para intercambiarlos.'); return; }
					if (where === 'box' && dst.length >= BOX_MAX) { toast('Esa caja está llena'); return; }
					if (sel.where === 'party' && G.party.length <= 1) { toast('Necesitas al menos un Pokémon en el equipo'); return; }
					src.splice(sel.idx, 1); dst.push(A);
					if (sel.where === 'party') healFull(A);
					toast(`${displayName(A)} → ${place(where, b)}`);
				}
			}
			sel = null;
		};

		// ---------- Modo «Seleccionar» ----------
		const startMulti = p => { multi = true; sel = null; marks = p ? [p] : []; draw(); };
		const stopMulti = () => { multi = false; marks = []; draw(); };
		const toggle = p => { const k = marks.indexOf(p); if (k >= 0) marks.splice(k, 1); else marks.push(p); draw(); };
		const toggleBox = () => {
			const all = G.boxes[box];
			if (all.every(p => marks.includes(p))) marks = marks.filter(p => !all.includes(p));
			else for (const p of all) if (!marks.includes(p)) marks.push(p);
			draw();
		};
		/** Cuenta lo que pasó y deja marcados solo los que no se pudieron mover. */
		const report = (r, dest) => {
			const parts = [];
			if (r.moved.length) parts.push(`${r.moved.length === 1 ? displayName(r.moved[0]) : r.moved.length + ' Pokémon'} → ${dest}`);
			if (r.noRoom.length) parts.push(r.noRoom.length === 1 ? `${displayName(r.noRoom[0])} no cabe` : `${r.noRoom.length} no caben`);
			if (r.kept.length) parts.push(`${displayName(r.kept[0])} se queda: necesitas al menos un Pokémon en el equipo`);
			if (!parts.length) parts.push('Ya estaban ahí');
			toast(parts.join('. ') + '.', r.noRoom.length || r.kept.length ? 'warn' : '');
			if (r.moved.length) { marks = r.noRoom.concat(r.kept); if (!marks.length) multi = false; }
			draw();
		};
		const multiToBox = async () => {
			const j = await choose(`¿A qué caja mueves ${marks.length === 1 ? 'a ' + displayName(marks[0]) : 'los ' + marks.length + ' seleccionados'}?`, G.boxes.map((bx, n) => boxLine(n)).concat(['Cancelar']));
			if (j >= G.boxes.length) return;
			report(moveMany(G, marks, { where: 'box', box: j }), inBox(j));
		};
		const multiHere = () => report(moveMany(G, marks, { where: 'box', box }), inBox(box));
		const multiToParty = () => report(moveMany(G, marks, { where: 'party' }), 'tu equipo');
		const multiLeave = () => report(moveMany(G, marks.filter(p => G.party.includes(p)), { where: 'box', box, overflow: true }), 'el PC');

		const tapMon = async (where, b, i) => {
			if (multi) { if (skipTap) { skipTap = false; return; } toggle(monAt(where, b, i)); return; }
			if (sel) {
				if (sel.where === where && sel.box === b && sel.idx === i) { sel = null; draw(); return; }
				drop(where, b, i); draw(); return;
			}
			const p = monAt(where, b, i);
			const s = D.species[p.sp];
			const opts = [['datos', '📋 Ver datos'], ['mover', '⇄ Mover o intercambiar']];
			if (where === 'party') opts.push(['dejar', `📦 Dejar en ${inBox(box)}`]);
			else if (G.party.length < 6) opts.push(['sacar', '◓ Llevar al equipo']);
			else opts.push(['cambiar', '◓ Cambiar por uno del equipo']);
			if (where === 'box' && G.boxes.length > 1) opts.push(['caja', '📦 Mandar a otra caja']);
			opts.push(['multi', '☑ Seleccionar varios']);
			opts.push(['x', 'Cancelar']);
			const k = opts[await choose((p.nick ? `${p.nick} (${s.name})` : s.name) + ` · Nv. ${p.lv}` + (p.uid === rioluUid ? ' · tu compañero' : ''), opts.map(o => o[1]))]?.[0];
			if (k === 'datos') openSummary(p, draw);
			else if (k === 'mover') { sel = { where, box: b, idx: i }; draw(); }
			else if (k === 'multi') startMulti(p);
			else if (k === 'dejar') { sel = { where, box: b, idx: i }; drop('box', box, G.boxes[box].length); draw(); }
			else if (k === 'sacar') { sel = { where, box: b, idx: i }; drop('party', 0, G.party.length); draw(); }
			else if (k === 'cambiar') {
				const j = await choose(`¿Por quién cambias a ${displayName(p)}?`, G.party.map(m => `${displayName(m)} · Nv. ${m.lv}`).concat(['Cancelar']));
				if (j < G.party.length) { sel = { where, box: b, idx: i }; drop('party', 0, j); }
				draw();
			} else if (k === 'caja') {
				const others = G.boxes.map((bx, n) => n).filter(n => n !== b);
				const j = await choose('¿A qué caja?', others.map(boxLine).concat(['Cancelar']));
				if (j < others.length) { sel = { where, box: b, idx: i }; drop('box', others[j], G.boxes[others[j]].length); }
				draw();
			}
		};
		const tapEmpty = (where, b) => { if (!sel) return; drop(where, b, listOf(where, b).length); draw(); };

		const slot = (p, where, b, i) => {
			if (!p) return h('button', { class: 'pc-slot empty' + (sel ? ' target' : ''), onclick: () => tapEmpty(where, b), 'aria-label': 'Hueco libre' });
			const isSel = sel && sel.where === where && sel.box === b && sel.idx === i;
			const marked = multi && marks.includes(p);
			// Mantener pulsado (≈450 ms) entra en el modo «Seleccionar» con este ya marcado; si el dedo se mueve (desplazar), no cuenta
			let timer = null, sx = 0, sy = 0;
			const cancel = () => { clearTimeout(timer); timer = null; };
			return h('button', {
				class: 'pc-slot' + (isSel || marked ? ' sel' : '') + (sel && !isSel ? ' target' : '') + (p.hp <= 0 ? ' fainted' : ''), title: displayName(p),
				'aria-pressed': multi ? String(marked) : null,
				onclick: () => tapMon(where, b, i),
				onpointerdown: e => {
					if (multi || sel || (e.pointerType === 'mouse' && e.button !== 0)) return;
					sx = e.clientX; sy = e.clientY;
					timer = setTimeout(() => { timer = null; skipTap = true; navigator.vibrate?.(15); startMulti(p); }, 450);
				},
				onpointermove: e => { if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) cancel(); },
				onpointerup: cancel, onpointercancel: cancel, onpointerleave: cancel,
				oncontextmenu: e => e.preventDefault(),
			},
				h('div', { class: 'pc-sp' }, monImg(p.sp, { anim: false, shiny: p.shiny })),
				h('span', { class: 'pc-lv' }, p.lv),
				p.item ? h('span', { class: 'pc-item' }, '✦') : null,
				marked ? h('span', { class: 'pc-check' }, '✓') : p.shiny ? h('span', { class: 'pc-shiny' }, '★') : null,
				h('span', { class: 'pc-name' + (where === 'party' ? '' : ' small') }, displayName(p)));
		};

		const sortBox = async () => {
			const keys = [['Nº de Pokédex', (a, c) => D.species[a.sp].num - D.species[c.sp].num || c.lv - a.lv], ['Nivel (de mayor a menor)', (a, c) => c.lv - a.lv], ['Nombre', (a, c) => displayName(a).localeCompare(displayName(c), 'es')], ['Tipo', (a, c) => D.species[a.sp].types[0].localeCompare(D.species[c.sp].types[0]) || D.species[a.sp].num - D.species[c.sp].num]];
			const j = await choose(`Ordenar ${inBox(box)} por…`, keys.map(k => k[0]).concat(['Cancelar']));
			if (j < keys.length) { G.boxes[box].sort(keys[j][1]); toast('Caja ordenada'); }
			draw();
		};

		// ---------- Opciones de la caja: nombre y lugar ----------
		const renameBox = async () => {
			const n = await prompt(`Nombre para ${inBox(box)} (vacío para quitarlo):`, hasBoxName(G, box) ? bname(box) : '', { max: BOX_NAME_MAX });
			setBoxName(G, box, n);
			draw();
		};
		const relocateBox = async () => {
			const n = G.boxes.length, cur = bname(box);
			const opts = [
				box > 0 ? ['antes', `← Una antes (posición ${box})`] : null,
				box < n - 1 ? ['despues', `→ Una después (posición ${box + 2})`] : null,
				box > 1 ? ['inicio', 'Al principio (posición 1)'] : null,
				box < n - 2 ? ['fin', `Al final (posición ${n})`] : null,
				['swap', '⇄ Intercambiar lugar con otra caja…'],
				['x', 'Cancelar'],
			].filter(Boolean);
			const k = opts[await choose(`Mover ${inBox(box)}. Ahora está en la posición ${box + 1} de ${n}.`, opts.map(o => o[1]))]?.[0];
			if (k === 'swap') {
				const others = G.boxes.map((bx, i) => i).filter(i => i !== box);
				const j = await choose(`¿Con qué caja intercambia su lugar ${inBox(box)}?`, others.map(i => `${i + 1}. ${boxLine(i)}`).concat(['Cancelar']));
				if (j < others.length) { swapBoxes(G, box, others[j]); box = others[j]; toast(`${cur} pasa a la posición ${box + 1}`); }
			} else if (k && k !== 'x') {
				box = moveBox(G, box, k === 'antes' ? box - 1 : k === 'despues' ? box + 1 : k === 'inicio' ? 0 : n - 1);
				toast(`${hasBoxName(G, box) ? cur : 'La caja'} pasa a la posición ${box + 1}`);
			}
			draw();
		};
		const boxMenu = async () => {
			const k = await choose(`${bname(box)} · ${G.boxes[box].length}/${BOX_MAX}`, [hasBoxName(G, box) ? 'Cambiar el nombre' : 'Poner nombre', 'Mover caja de lugar', 'Seleccionar toda la caja', 'Cancelar']);
			if (k === 0) renameBox();
			else if (k === 1) relocateBox();
			else if (k === 2) { if (!multi) { multi = true; sel = null; marks = []; } for (const p of G.boxes[box]) if (!marks.includes(p)) marks.push(p); draw(); }
		};

		const drawBar = () => {
			bar.hidden = !multi;
			sheet.el.classList.toggle('pc-multi', multi);
			if (!multi) { bar.innerHTML = ''; return; }
			const n = marks.length, inParty = marks.filter(p => G.party.includes(p)).length, inBoxes = n - inParty;
			const allHere = n > 0 && marks.every(p => G.boxes[box].includes(p));
			const btn = (label, fn, off, cls = '') => h('button', { class: 'btn ' + cls, disabled: off, onclick: fn }, label);
			bar.innerHTML = '';
			bar.append(...[
				h('div', { class: 'pc-count', role: 'status' }, n === 1 ? '1 seleccionado' : `${n} seleccionados`, h('span', {}, n ? (inParty && inBoxes ? `${inParty} del equipo · ${inBoxes} de cajas` : inParty ? 'del equipo' : 'de las cajas') : 'Toca los que quieras mover')),
				btn('Mover a la caja…', multiToBox, !n, 'primary'),
				btn('Mover aquí', multiHere, !n || allHere),
				btn('Llevar al equipo', multiToParty, !inBoxes),
				btn('Dejar en el PC', multiLeave, !inParty),
				n === 1 ? btn('Ver datos', () => openSummary(marks[0], draw), false) : null,
				btn('Cancelar', stopMulti, false, n === 1 ? '' : 'wide')].filter(Boolean));
		};

		const draw = () => {
			marks = marks.filter(p => G.party.includes(p) || G.boxes.some(bx => bx.includes(p)));
			const body = [];
			if (multi) {
				const all = G.boxes[box].length > 0 && G.boxes[box].every(p => marks.includes(p));
				body.push(h('div', { class: 'pc-moving', 'data-noswipe': '' }, h('div', {}, h('b', {}, marks.length === 1 ? '1 seleccionado' : `${marks.length} seleccionados`), h('span', {}, 'Toca para marcar o desmarcar. Puedes cambiar de caja: la selección se conserva.')),
					h('button', { class: 'btn', onclick: toggleBox, disabled: !G.boxes[box].length }, all ? 'Quitar la caja' : 'Toda la caja')));
			} else if (sel) {
				const p = monAt(sel.where, sel.box, sel.idx);
				body.push(h('div', { class: 'pc-moving' }, h('div', {}, h('b', {}, `Moviendo a ${p ? displayName(p) : ''}`), h('span', {}, 'Toca un hueco para dejarlo ahí, u otro Pokémon para intercambiarlos. Puedes cambiar de caja.')),
					h('button', { class: 'btn', onclick: () => { sel = null; draw(); } }, 'Cancelar')));
			} else body.push(h('div', { class: 'pc-top' },
				h('div', { class: 'note' }, 'Toca un Pokémon para ver sus datos o moverlo. Mantén pulsado uno para marcar varios. Al dejarlo en una caja se cura del todo.'),
				h('button', { class: 'btn', onclick: () => startMulti(null) }, 'Seleccionar')));
			body.push(h('div', { class: 'section-title' }, `Tu equipo · ${G.party.length}/6`));
			body.push(h('div', { class: 'pc-grid party', 'data-noswipe': '' }, ...Array.from({ length: 6 }, (_, i) => slot(G.party[i], 'party', 0, i))));
			const nav = h('div', { class: 'pc-boxnav', 'data-noswipe': '' },
				h('button', { class: 'btn', 'aria-label': 'Caja anterior', onclick: () => { box = (box + G.boxes.length - 1) % G.boxes.length; draw(); } }, '‹'),
				h('button', { class: 'pc-boxname', 'aria-label': `${bname(box)}: opciones de la caja`, onclick: boxMenu }, h('b', {}, bname(box)), h('span', {}, `${G.boxes[box].length}/${BOX_MAX}`)),
				h('button', { class: 'btn', 'aria-label': 'Caja siguiente', onclick: () => { box = (box + 1) % G.boxes.length; draw(); } }, '›'),
				h('button', { class: 'btn pc-sort', onclick: sortBox, disabled: G.boxes[box].length < 2 }, 'Ordenar'),
				h('button', { class: 'btn pc-more', 'aria-label': 'Opciones de la caja: nombre y mover de lugar', onclick: boxMenu }, '⋯ Caja'));
			body.push(h('div', { class: 'section-title' }, 'Cajas'), nav);
			body.push(h('div', { class: 'pc-dots', 'data-noswipe': '' }, ...G.boxes.map((bx, n) => {
				const m = multi ? bx.filter(p => marks.includes(p)).length : 0;
				return h('button', { class: (n === box ? 'on' : '') + (bx.length ? ' has' : '') + (m ? ' marked' : ''), onclick: () => { box = n; draw(); }, 'aria-label': bname(n) + (m ? `, ${m} seleccionados` : '') }, String(n + 1));
			})));
			body.push(h('div', { class: 'pc-grid box', 'data-noswipe': '' }, ...Array.from({ length: BOX_MAX }, (_, i) => slot(G.boxes[box][i], 'box', box, i))));
			const total = G.boxes.reduce((a, bx) => a + bx.length, 0);
			body.push(h('div', { class: 'note' }, `En el PC: ${total} Pokémon. Toca el nombre de la caja para ponerle nombre o cambiarla de lugar.`));
			const top = sheet.body.scrollTop;
			sheet.set(body);
			sheet.body.scrollTop = top;
			drawBar();
		};
		draw();
	});
}

// =================== Viajar a un lugar conocido ===================
/** Va a un lugar (o sub-lugar) por caminos conocidos, como el mapa. `tramo` coloca en ese tramo si la ruta ya está despejada. */
async function travelTo(id, tramo = null) {
	const target = L(id);
	if (!target) return;
	if (G.loc === id && (tramo === null || G.route?.pos === tramo)) { render(); return; }
	const dest = topLoc(id) || target;
	const here = topLoc(G.loc);
	const start = G.route ? G.loc : here?.id;
	const path = dest.id === start ? [start] : findPath(start, dest.id);
	if (!path) { await say(null, `Aún no conoces un camino seguro hasta ${dest.name}. Ve a pie desde el mapa.`); return; }
	const ce = canEnter(id);
	if (!ce.ok) { await say(null, tx(ce.msg)); return; }
	const prev = path.length >= 2 ? path[path.length - 2] : start;
	if (dest.id !== G.loc && !(G.route && G.loc === dest.id)) await enterLocation(dest.id, { from: prev });
	if (G.loc !== dest.id) return; // un guion al entrar nos movió
	if (id !== dest.id) {
		// sub-lugares anidados: entra de fuera hacia dentro
		const chain = [];
		for (let l = target; l && l.id !== dest.id; l = L(l.parent)) chain.unshift(l.id);
		for (const step of chain) { const c2 = canEnter(step); if (!c2.ok) { await say(null, tx(c2.msg)); break; } await enterLocation(step, { from: G.loc }); if (G.loc !== step) return; }
	}
	if (tramo !== null && G.loc === id && L(id).route) {
		if (G.cleared[id] || mounted()) { G.route = { id, pos: tramo }; markTramo(id, tramo); await saveGame(); }
		else toast(`Está en el tramo ${tramo}: avanza por la ruta hasta llegar.`);
	}
	render();
}

// =================== Novedades ===================
// Pedido de Mario (2026-10-10): «notificaciones o alguna mecánica para saber de misiones nuevas o recién aparecidas,
// para que no tenga que ir todos los días a recorrer Kalos, Johto y Kanto en cada ciudad, cada edificio y cada ruta».
// Rotom revisa todos los lugares que ya conoces y lista lo que hay nuevo: misiones que alguien ofrece, gente con algo
// que decir («!»), cosas que pasarán al llegar a un sitio, premios de instructores listos y negocios que piden socio
// o tienen algo pendiente. Cada cosa lleva su «Ir». Lo que aparece por primera vez se avisa y queda marcado como nuevo.
function newsScan() {
	const out = [], seen = new Set();
	const safe = c => { try { return c === undefined || evalCond(c); } catch (e) { return false; } };
	const put = it => { if (seen.has(it.key)) return; seen.add(it.key); out.push(it); };
	const placeOf = (loc, n) => { const top = topLoc(loc.id); return (top && top.id !== loc.id ? `${top.name} › ${loc.name}` : loc.name) + (n !== undefined && n !== null ? ` · tramo ${n}` : ''); };
	const addSpot = (loc, s, n = null) => {
		const a = s.action || s.spot?.action || {};
		const label = tx(s.label || s.spot?.label || 'Alguien quiere hablar contigo');
		const pz = a.training ? prizeState(a.training) : null;
		if (pz && !pz.claimed && pz.ready) put({ key: 'pz:' + a.training.prize.script, kind: 'prize', icon: '🎁', title: `Premio listo: ${label}`, sub: 'Ya ganaste los combates. Pasa a recogerlo.', loc: loc.id, tramo: n, place: placeOf(loc, n) });
		if (!(s.talk || s.script || a.script || a.talk)) return;
		const m = spotMarker(s);
		if (!m || m.kind === 'active') return;
		if (m.kind === 'new') {
			const def = C.quests[m.q];
			put({ key: 'q:' + m.q, kind: 'quest', icon: def.type === 'main' ? '⭐' : def.type === 'thread' ? '🧵' : def.type === 'event' ? '🎉' : '📜', title: def.name, sub: `Misión nueva · ${label}`, loc: loc.id, tramo: n, place: placeOf(loc, n), q: m.q });
		} else {
			// El mismo aviso puede estar en varias ciudades (un mensaje que te alcanza donde estés): sale una vez, en el sitio más a mano
			const talk = s.talk || a.talk;
			const sc = s.script || a.script || (Array.isArray(talk) ? talk.find(e => safe(e.cond))?.script : null);
			const key = sc ? 's:' + sc : 's:' + loc.id + ':' + (s.label || s.spot?.label || '');
			const dup = out.find(o => o.key === key);
			if (dup) { if (loc.id === G.loc || (topLoc(loc.id)?.id === topLoc(G.loc)?.id && topLoc(dup.loc)?.id !== topLoc(G.loc)?.id)) Object.assign(dup, { loc: loc.id, tramo: n, place: placeOf(loc, n) }); return; }
			put({ key, kind: 'talk', icon: s.icon || '💬', title: label, sub: s.sub ? tx(s.sub) : 'Tiene algo nuevo que decirte', loc: loc.id, tramo: n, place: placeOf(loc, n) });
		}
	};
	const touch = questTouches();
	for (const loc of Object.values(C.locations)) {
		const top = topLoc(loc.id);
		if (!G.visited[loc.id] && !G.visited[top?.id]) continue;
		if (loc.hidden !== undefined && safe(loc.hidden)) continue;
		for (const s of spotsOf(loc)) addSpot(loc, s);
		if (loc.route && G.visited[loc.id]) for (let n = 0; n <= (loc.route.length || 0); n++) for (const it of tramoItems(loc, n)) if (it.talk || it.spot) addSpot(loc, it, n);
		// Escenas que saltan al entrar a un sitio que ya conoces (la historia sigue allí)
		if (loc.id !== G.loc && G.visited[loc.id]) (loc.onEnter || []).forEach((e, i) => {
			if (!e.script || (e.once !== false && G.flags['enter:' + loc.id + ':' + (e.script || i)]) || !safe(e.cond) || e.once === false) return;
			if (!canEnter(loc.id).ok) return;
			const qs = [...(touch[e.script] || [])].filter(q => C.quests[q]);
			const q = qs.find(x => G.quests[x] && !G.quests[x].done) || qs.find(x => !G.quests[x]);
			put({ key: 'e:' + loc.id + ':' + e.script, kind: 'enter', icon: '📍', title: q ? C.quests[q].name : `Algo te espera en ${loc.name}`, sub: 'Pasará algo cuando llegues', loc: loc.id, tramo: null, place: placeOf(loc) });
		});
	}
	for (const v of ventureList()) {
		if (v.status === 'offer') put({ key: 'v:' + v.id, kind: 'venture', icon: v.def.icon || '🤝', title: v.def.name, sub: 'Buscan socio: puedes invertir', venture: v.id, loc: v.def.loc, place: v.def.loc ? placeOf(L(v.def.loc)) : '' });
		else {
			const p = venturePending(v.id);
			if (v.st.pending) put({ key: 'vi:' + v.id + ':' + v.st.pending + ':' + (v.st.lastEvent || 0), kind: 'venture', icon: v.def.icon || '🤝', title: v.def.name, sub: '❗ Hay un imprevisto que decidir', venture: v.id, loc: v.def.loc, place: '' });
			else if (p.full) put({ key: 'vf:' + v.id + ':' + Math.floor((v.st.last || 0) / 864e5), kind: 'venture', icon: v.def.icon || '🤝', title: v.def.name, sub: '📦 Almacén lleno: pasa a recoger', venture: v.id, loc: v.def.loc, place: '' });
		}
	}
	return out;
}
let newsCache = null, newsAt = 0;
/** Novedades actuales, con cuáles no has visto todavía. Avisa (una vez) de las que acaban de aparecer. */
function newsState({ announce = false, force = false } = {}) {
	if (!force && newsCache && Date.now() - newsAt < 1500) return newsCache;
	const N = (G.news ||= { known: {}, unread: {} });
	const first = !N.init;
	const items = newsScan();
	const keys = new Set(items.map(i => i.key));
	const fresh = items.filter(i => !N.known[i.key]);
	for (const i of fresh) { N.known[i.key] = Date.now(); N.unread[i.key] = Date.now(); }
	for (const k in N.unread) if (!keys.has(k)) delete N.unread[k];
	// lo que desapareció hace mucho se olvida, para que la lista de conocidas no crezca sin fin
	const ks = Object.keys(N.known);
	if (ks.length > 600) for (const k of ks) if (!keys.has(k) && Date.now() - N.known[k] > 30 * 864e5) delete N.known[k];
	N.init = true;
	for (const i of items) i.unread = !!N.unread[i.key];
	newsCache = { items, unread: items.filter(i => i.unread).length, fresh };
	newsAt = Date.now();
	if (announce && fresh.length) {
		const txt = first ? `🔔 Rotom revisó los lugares que conoces: hay ${items.length} ${items.length === 1 ? 'cosa pendiente' : 'cosas pendientes'} en Diario › Novedades.`
			: fresh.length === 1 ? `🔔 Novedad: **${fresh[0].title}**${fresh[0].place ? ' · ' + fresh[0].place : ''}` : `🔔 ${fresh.length} novedades en lugares que conoces. Míralas en Diario › Novedades.`;
		toast(txt, 'quest');
	}
	return newsCache;
}
function newsRow(it, after) {
	const go = () => {
		const N = G.news; if (N) delete N.unread[it.key];
		newsCache = null;
		closeAllSheets();
		if (it.venture) { openVenture(it.venture).then(() => render()); return; }
		guarded(() => travelTo(it.loc, it.tramo));
	};
	const here = it.loc && G.loc === it.loc && (it.tramo === null || it.tramo === undefined || G.route?.pos === it.tramo);
	return h('button', { class: 'row news' + (it.unread ? ' unread' : ''), onclick: go },
		h('div', { class: 'ico' }, it.icon),
		h('div', { class: 'lbl' }, h('div', { class: 't' }, it.title, it.unread ? h('span', { class: 'badge-new' }, 'NUEVO') : null), h('div', { class: 's' }, it.sub), it.place ? h('div', { class: 'qwhere' }, '📍 ' + it.place) : null),
		h('b', { class: 'news-go' }, it.venture ? 'Abrir' : here ? 'Aquí' : 'Ir'));
}
/** Señales por lugar de primer nivel para el mapa: { [topId]: { news: n, unread: n } } */
function newsByPlace() {
	const out = {};
	for (const it of newsState().items) {
		if (!it.loc) continue;
		const top = (topLoc(it.loc) || L(it.loc))?.id;
		if (!top) continue;
		const o = (out[top] ||= { news: 0, unread: 0 });
		o.news++; if (it.unread) o.unread++;
	}
	return out;
}

// =================== Diario y misiones ===================
// ---------- Índice de misiones: qué guiones tocan cada misión y dónde están ----------
let QTOUCH = null;
function questTouches() {
	if (QTOUCH) return QTOUCH;
	QTOUCH = {};
	const scan = (list, set, depth) => {
		for (const c of list || []) {
			if (!c || typeof c !== 'object') continue;
			if (c.quest) set.add(c.quest);
			if (c.call && depth < 4) scan(C.scripts[c.call], set, depth + 1);
			for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit']) if (Array.isArray(c[k])) scan(c[k], set, depth);
			if (Array.isArray(c.choice)) for (const o of c.choice) scan(o.then, set, depth);
		}
	};
	for (const id in C.scripts) { const set = new Set(); scan(C.scripts[id], set, 0); QTOUCH[id] = set; }
	return QTOUCH;
}
/** Para cada misión, los sitios (visibles ahora mismo y en lugares ya visitados) donde se avanza o se empieza. */
function questPlaces() {
	const touch = questTouches();
	const out = {};
	const safe = c => { try { return c === undefined || evalCond(c); } catch (e) { return false; } };
	const add = (loc, spot) => {
		const scripts = [];
		if (Array.isArray(spot.talk)) { const t = spot.talk.find(e => safe(e.cond)); if (t?.script) scripts.push(t.script); }
		if (spot.script) scripts.push(spot.script);
		if (spot.action?.script) scripts.push(spot.action.script);
		const top = topLoc(loc.id);
		const where = top && top.id !== loc.id ? `${top.name} · ${loc.name}` : loc.name;
		const txt = spot.label ? `${where} · ${spot.label}` : where;
		const put = q => { const arr = (out[q] ||= []); if (!arr.includes(txt)) arr.push(txt); };
		for (const sc of scripts) for (const q of touch[sc] || []) put(q);
		// Misiones ya en curso: también los diálogos que se abrirán cuando cumplas lo que piden
		if (Array.isArray(spot.talk)) for (const e of spot.talk) for (const q of touch[e.script] || []) if (G.quests[q] && !G.quests[q].done) put(q);
	};
	for (const loc of Object.values(C.locations)) {
		const top = topLoc(loc.id);
		if (!G.visited[loc.id] && !G.visited[top?.id]) continue;
		for (const sp of spotsOf(loc)) add(loc, sp);
		if (loc.route) for (let n = 0; n <= (loc.route.length || 0); n++) for (const it of tramoItems(loc, n)) if (it.talk || it.script) add(loc, it);
	}
	// Lugares que conoces pero no has pisado: lo que pasa al llegar (así se ve hacia dónde sigue la historia)
	const known = new Set();
	for (const id in G.visited) for (const n of L(id)?.links || []) if (!G.visited[n]) known.add(n);
	for (const id of known) {
		const loc = L(id);
		if (!loc) continue;
		(loc.onEnter || []).forEach((e, i) => {
			if (!e.script || (e.once !== false && G.flags['enter:' + id + ':' + (e.script || i)]) || !safe(e.cond)) return;
			for (const q of touch[e.script] || []) {
				const arr = (out[q] ||= []);
				const txt = `Al llegar a ${loc.name}`;
				if (!arr.includes(txt)) arr.push(txt);
			}
		});
	}
	return out;
}

function openDiary(startTab = null) {
	let tab = startTab || (newsState({ force: true }).unread ? 'news' : 'active');
	const sheet = openSheet('Diario', null);
	const TYPES = [['main', '⭐', 'Historia principal'], ['thread', '🧵', 'Historias de personajes'], ['side', '📜', 'Secundarias'], ['event', '🎉', 'Eventos']];
	const draw = () => {
		const places = questPlaces();
		const active = Object.entries(G.quests).filter(([id, q]) => C.quests[id] && !q.done);
		const done = Object.entries(G.quests).filter(([id, q]) => C.quests[id] && q.done);
		const avail = Object.keys(places).filter(id => C.quests[id] && !G.quests[id]).map(id => [id, null]);
		// Por hacer: hay un sitio donde avanzar o algo concreto que conseguir. Registro: historias abiertas sin nada que hacer ahora.
		const isTodo = id => (places[id] || []).length || C.quests[id].type === 'main' || questNeeds(id).length;
		const todo = active.filter(([id]) => isTodo(id));
		const logq = active.filter(x => !todo.includes(x));
		const NS = newsState({ force: true });
		const counts = { news: NS.unread || NS.items.length, active: todo.length, avail: avail.length, log: logq.length, done: done.length };
		const tabs = h('div', { class: 'tabs' }, ...[['news', 'Novedades'], ['active', 'Por hacer'], ['avail', 'Nuevas'], ['log', 'Registro'], ['done', 'Hechas'], ['diary', 'Rotom']].map(([k, n]) =>
			h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, n, counts[k] ? h('span', { class: 'tabcount' }, String(counts[k])) : null)));
		const body = h('div', {});
		if (tab === 'news') {
			const KINDS = [['quest', 'Misiones que te ofrecen'], ['enter', 'La historia sigue en…'], ['talk', 'Gente con algo nuevo que decir'], ['prize', 'Premios por recoger'], ['venture', 'Negocios']];
			body.append(h('div', { class: 'qgroup' }, h('b', {}, '🔔 Novedades'), h('span', {}, 'Rotom revisa por ti todos los lugares que ya conoces, sus edificios y sus rutas. Toca «Ir» para viajar directo. Cuando aparezca algo nuevo, te avisa.')));
			if (!NS.items.length) body.append(h('div', { class: 'empty' }, 'Nada nuevo en los lugares que conoces. Cuando avances en la historia o pase el tiempo, Rotom te avisará aquí.'));
			const unread = NS.items.filter(i => i.unread);
			if (unread.length && unread.length < NS.items.length) {
				body.append(h('div', { class: 'section-title' }, `Recién aparecidas (${unread.length})`), h('div', { class: 'list' }, ...unread.map(i => newsRow(i))));
			}
			for (const [k, title] of KINDS) {
				const xs = NS.items.filter(i => i.kind === k && !(unread.length < NS.items.length && i.unread));
				if (xs.length) body.append(h('div', { class: 'section-title' }, `${title} (${xs.length})`), h('div', { class: 'list' }, ...xs.map(i => newsRow(i))));
			}
			if (NS.unread) body.append(h('div', { class: 'pad' }, h('button', { class: 'btn', style: { width: '100%' }, onclick: () => { G.news.unread = {}; newsCache = null; draw(); } }, 'Marcar todo como visto')));
		} else if (tab === 'diary') {
			if (!G.diary.length) body.append(h('div', { class: 'empty' }, 'Rotom todavía no ha escrito nada.'));
			for (const e of G.diary.slice().reverse()) {
				const d = new Date(e.t);
				body.append(h('div', { class: 'diary-entry' }, h('div', { class: 'when' }, d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) + ' · ' + (L(e.loc)?.name || '')), h('div', { html: fmtText(e.text) })));
			}
		} else {
			const qs = tab === 'active' ? todo : tab === 'avail' ? avail : tab === 'log' ? logq : done;
			if (tab === 'done') qs.sort((a, b) => (b[1].finished || 0) - (a[1].finished || 0));
			if (!qs.length) body.append(h('div', { class: 'empty' }, {
				active: 'No tienes misiones en curso. Mira en «Nuevas» o habla con la gente: siempre hay alguien que necesita ayuda.',
				avail: 'No hay misiones nuevas en los lugares que conoces. Explora y vuelve a hablar con la gente después de avanzar en la historia.',
				done: 'Aún no has completado misiones.',
				log: 'No hay historias en pausa. Todo lo abierto tiene algo que puedes hacer ahora.',
			}[tab]));
			const rowOf = (id, q, extraCls = '') => {
				const def = C.quests[id];
				const type = def.type || 'side';
				const icon = (TYPES.find(t => t[0] === type) || TYPES[2])[1];
				const where = (places[id] || []).slice(0, 2);
				const lines = [];
				if (tab === 'active' || tab === 'log') lines.push(h('div', { class: 's', html: fmtText(tx(def.stages?.[q.stage] || '')) }));
				if (tab === 'done') lines.push(h('div', { class: 's' }, '✔ Completada' + (q.finished ? ' el ' + new Date(q.finished).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : '')));
				if (tab === 'avail') lines.push(h('div', { class: 's' }, (places[id] || []).some(w => w.startsWith('Al llegar')) ? 'Empieza cuando llegues al lugar.' : 'Habla con quien la ofrece para empezarla.'));
				if (tab !== 'done') for (const w of where) lines.push(h('div', { class: 'qwhere' }, '📍 ' + w));
				return h('button', { class: 'row quest' + extraCls + (type === 'main' && tab === 'active' ? ' hl' : '') + (tab === 'done' ? ' doneq' : '') + (tab === 'log' ? ' logq' : ''), onclick: () => openQuestDetail(id, places, draw) },
					h('div', { class: 'ico' }, icon), h('div', { class: 'lbl' }, h('div', { class: 't' }, def.name, (G.settings.tracked || []).includes(id) ? h('span', { class: 'pinmark' }, ' 📌') : null), ...lines), h('span', { class: 'chev' }, '›'));
			};
			const byType = (list, intoBody) => {
				for (const [type, icon, title] of TYPES) {
					const group = list.filter(([id]) => (C.quests[id].type || 'side') === type);
					if (!group.length) continue;
					intoBody.append(h('div', { class: 'section-title' }, `${icon} ${title}`));
					intoBody.append(h('div', { class: 'list' }, ...group.map(([id, q]) => rowOf(id, q))));
				}
			};
			if (tab === 'log') body.append(h('div', { class: 'qgroup log' }, h('b', {}, '📖 Registro'), h('span', {}, 'Historias abiertas que seguirán más adelante. No tienes que hacer nada por ahora: se avisará cuando haya novedades.')));
			const cal = tab === 'active' ? eventCalendar() : [];
			if (cal.length) body.append(h('div', { class: 'section-title' }, '🎉 Eventos de temporada'), h('div', { class: 'evstrip inlist' }, ...cal.map(eventRow)));
			if (tab === 'active' && qs.length) body.append(h('div', { class: 'qgroup' }, h('b', {}, '📌 Por hacer'), h('span', {}, 'Toca una misión para ver todo lo que necesitas. Con 📌 Seguir la tienes siempre a la vista.')));
			byType(qs, body);
		}
		sheet.set([tabs, body]);
	};
	draw();
}

/** Dónde sale una especie en lo publicado: lugares conocidos primero, con la hora si importa. */
function speciesWhere(sp, onlyKnown = false) {
	const found = [];
	for (const loc of Object.values(C.locations)) {
		const enc = loc.route?.encounters || loc.encounters || {};
		const es = Object.values(enc).flat().filter(e => e.sp === sp);
		if (!es.length) continue;
		const known = G.visited[loc.id] || (loc.links || []).some(n => G.visited[n]);
		if (onlyKnown && !known) continue;
		const times = new Set(es.map(e => e.time || 'any'));
		const t = times.has('any') || (times.has('day') && times.has('night')) ? '' : times.has('night') ? ' (🌙 de noche)' : times.has('day') ? ' (☀️ de día)' : '';
		found.push({ name: known ? loc.name : 'un lugar que aún no conoces', t, known });
	}
	found.sort((a, b) => b.known - a.known);
	const uniq = [...new Map(found.map(f => [f.name, f])).values()];
	if (!uniq.length) return onlyKnown ? '' : 'Se consigue por otra vía (historia o intercambio)';
	return uniq.slice(0, 3).map(f => f.name + f.t).join(' · ');
}

// ---------- Seguimiento en pantalla (hasta 3 misiones con 📌) ----------
function questTracker() {
	const ids = (G.settings.tracked || []).filter(id => C.quests[id] && G.quests[id] && !G.quests[id].done);
	if (G.settings.tracked && ids.length !== G.settings.tracked.length) G.settings.tracked = ids;
	if (!ids.length) return null;
	const box = h('div', { class: 'tracker' });
	for (const id of ids) {
		const def = C.quests[id], q = G.quests[id];
		const needs = questNeeds(id).filter(n => (n.kind === 'item' || n.kind === 'var') && !(def.parts && n.kind === 'var' && n.id === def.parts.var));
		const partsProg = def.parts ? [`${def.parts.title || 'Lista'} ${(def.parts.items || []).filter(it => { try { return evalCond(it.done); } catch (e) { return false; } }).length}/${(def.parts.items || []).length}`] : [];
		const prog = partsProg.concat(needs.map(n => n.kind === 'item' ? `${itemName(n.id)} ${Math.min(count(n.id), n.n)}/${n.n}` : `${n.id.charAt(0).toUpperCase() + n.id.slice(1)} ${Math.min(G.vars[n.id] || 0, n.n)}/${n.n}`)).join(' · ');
		const stage = (def.stages?.[q.stage] || '').replace(/\*\*/g, '');
		box.append(h('button', { class: 'trk', onclick: () => openQuestDetail(id) },
			h('div', { class: 'trk-t' }, '📌 ' + def.name),
			h('div', { class: 'trk-s' }, tx(stage)),
			prog ? h('div', { class: 'trk-p' }, prog) : null));
	}
	return box;
}

// ---------- Ficha de una misión ----------
const NEED_RX = [
	[/(^|[^!\w.])has\("(\w+)"\)/g, (m) => ({ kind: 'item', id: m[2], n: 1 })],
	[/(^|[^!\w.])count\("(\w+)"\)\s*>=\s*(\d+)/g, (m) => ({ kind: 'item', id: m[2], n: +m[3] })],
	[/(^|[^!\w.])inParty\("(\w+)"\)/g, (m) => ({ kind: 'party', id: m[2] })],
	[/(^|[^!\w.])(seen|caught|owns)\("(\w+)"\)/g, (m) => ({ kind: m[2], id: m[3] })],
	[/(^|[^!\w.])vars\.(\w+)\s*>=\s*(\d+)/g, (m) => ({ kind: 'var', id: m[2], n: +m[3] })],
	[/(^|[^!\w.])beat\("(\w+)"\)/g, (m) => ({ kind: 'beat', id: m[2] })],
];
/** Lo que piden los diálogos que avanzan la misión en su etapa actual (objetos, Pokémon, combates, contadores). */
function questNeeds(id) {
	const q = G.quests[id];
	if (!q || q.done) return [];
	const conds = [];
	const touch = questTouches();
	// Una condición vale si no habla de otra etapa de esta misión (si menciona una, debe ser la actual)
	const stageOk = c => { const m = [...c.matchAll(new RegExp(`quest\\.${id}\\s*==\\s*["'](\\w+)["']`, 'g'))]; return !m.length || m.some(x => x[1] === q.stage); };
	const scan = (sp) => {
		for (const t of [].concat(sp.talk || sp.spot?.talk || [])) if (t.cond && (touch[t.script] || new Set()).has(id) && stageOk(t.cond)) conds.push(t.cond);
		// escenas de tramo que se disparan solas cuando cumples algo (p. ej., al encontrar un objeto)
		if (sp.script && sp.cond && (touch[sp.script] || new Set()).has(id) && stageOk(sp.cond)) conds.push(sp.cond);
	};
	// También los «si…» dentro de los guiones cuyo «entonces» avanza la misión
	const touchesList = (list, d = 0) => (list || []).some(c => c && typeof c === 'object' && (c.quest === id || (c.call && d < 4 && touchesList(C.scripts[c.call], d + 1)) || ['then', 'else', 'onWin', 'onCatch', 'onSolve'].some(k => Array.isArray(c[k]) && touchesList(c[k], d)) || (Array.isArray(c.choice) && c.choice.some(o => touchesList(o.then, d)))));
	const walkIfs = (list, d = 0) => { for (const c of list || []) { if (!c || typeof c !== 'object') continue; if (c.if && touchesList(c.then) && stageOk(c.if)) conds.push(c.if); for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit']) if (Array.isArray(c[k])) walkIfs(c[k], d); if (Array.isArray(c.choice)) for (const o of c.choice) walkIfs(o.then, d); } };
	for (const sid in C.scripts) if ((touch[sid] || new Set()).has(id)) walkIfs(C.scripts[sid]);
	for (const loc of Object.values(C.locations)) {
		for (const sp of loc.spots || []) scan(sp);
		if (loc.route) for (const n in loc.route.tramos || {}) for (const it of [].concat(loc.route.tramos[n] || [])) scan(it);
	}
	// contadores de una sola escena (el guion los pone a 0 antes de usarlos): no son algo que reunir
	const scratch = new Set([...JSON.stringify(C.scripts).matchAll(/"vars\.(\w+)":0[,}]/g)].map(m => m[1]));
	const out = [], keys = new Set();
	for (const c of conds) for (const [rx, mk] of NEED_RX) for (const m of c.matchAll(rx)) { const n = mk(m); if (n.kind === 'var' && scratch.has(n.id)) continue; const k = n.kind + ':' + n.id; if (!keys.has(k)) { keys.add(k); out.push({ ...n, alt: /\|\|/.test(c) }); } }
	return out;
}
/** Nombre de un punto de ruta: «Ruta 5 · tramo 4 de 9 (desde Ciudad Luminalia)». */
function tramoName(locId, n) {
	const loc = L(locId);
	if (!loc) return locId;
	if (!loc.route || !n) return loc.name;
	const from = L(loc.route.from);
	return `${loc.name} · tramo ${n} de ${loc.route.length}` + (from ? ` (desde ${from.name})` : '');
}
/** Dónde hay un objeto tirado o escondido en las rutas (incluye eventos activos), con tramo y si ya lo recogiste. */
function itemSpots(itemId) {
	const out = [];
	for (const loc of Object.values(C.locations)) {
		if (!loc.route) continue;
		const pr = G.routeProg?.[loc.id] || { items: {} };
		for (let n = 0; n <= (loc.route.length || 0); n++) {
			const list = [].concat(loc.route.tramos?.[n] || []);
			for (const e of activeEvents()) if (e.tramos?.[loc.id]?.[n]) list.push(...e.tramos[loc.id][n]);
			for (const it of list) if (it.item === itemId) {
				const top = topLoc(loc.id);
				out.push({ loc: loc.id, n, hidden: !!it.hidden, got: !!pr.items?.[n + ':' + itemId], known: !!G.visited[loc.id] || !!G.visited[top?.id] || (loc.links || []).some(x => G.visited[x]) });
			}
		}
	}
	return out;
}
/** Lista de partes de una misión (`parts` en el contenido): qué llevas, qué falta y dónde. */
function questPartsList(def) {
	const P = def.parts;
	const safe = c => { try { return !!c && evalCond(c); } catch (e) { return false; } };
	const items = P.items || [];
	const doneN = items.filter(it => safe(it.done)).length;
	const list = h('div', { class: 'list' });
	for (const it of items) {
		const ok = safe(it.done), half = !ok && safe(it.got);
		const hint = Array.isArray(it.hint) ? (it.hint.find(x => x.cond === undefined || safe(x.cond)) || {}).text : it.hint;
		const info = [];
		if (!ok) {
			if (it.where) info.push('📍 ' + tramoName(it.where, it.tramo));
			const txt = half ? (it.gotHint || hint) : hint;
			if (txt) info.push(txt);
		}
		list.append(h('div', { class: 'row need part' + (ok ? ' ok' : half ? ' half' : '') },
			h('div', { class: 'ico' }, ok ? '✔' : half ? '◐' : '○'),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, ok ? (it.doneLabel || it.label) : it.label), ...info.map(t => h('div', { class: 'needwhere', html: fmtText(tx(t)) }))),
			h('b', {}, ok ? 'Listo' : half ? 'Casi' : '')));
	}
	return [h('div', { class: 'section-title' }, `${P.title || 'Lista'} · ${doneN}/${items.length}`), list];
}
function openQuestDetail(id, places, onChange) {
	const def = C.quests[id], q = G.quests[id];
	if (!def) return;
	const TL = { main: ['⭐', 'Historia principal'], thread: ['🧵', 'Historia de personaje'], side: ['📜', 'Secundaria'], event: ['🎉', 'Evento'] }[def.type || 'side'] || ['📜', 'Secundaria'];
	const sheet = openSheet(def.name, null);
	const status = !q ? ['Nueva', 'new'] : q.done ? ['Completada', 'done'] : ['En curso', 'active'];
	const body = [];
	body.push(h('div', { class: 'qd-head' },
		h('span', { class: 'qd-type' }, `${TL[0]} ${TL[1]}`),
		h('span', { class: 'qd-status ' + status[1] }, status[0]),
		def.est ? h('span', { class: 'qd-est' }, `⏱ ~${def.est >= 60 ? Math.round(def.est / 60 * 10) / 10 + ' h' : def.est + ' min'}`) : null));
	if (q && !q.done) {
		const tracked = (G.settings.tracked ||= []).includes(id);
		body.push(h('div', { class: 'qd-actions' }, h('button', { class: 'btn' + (tracked ? '' : ' primary'), onclick: () => {
			const t = (G.settings.tracked ||= []);
			if (tracked) t.splice(t.indexOf(id), 1);
			else { t.unshift(id); if (t.length > 3) t.length = 3; }
			sheet.close(); onChange?.(); render(); openQuestDetail(id, places, onChange);
		} }, tracked ? 'Dejar de seguir' : '📌 Seguir en pantalla')));
	}
	if (q && !q.done) body.push(h('div', { class: 'qd-now' }, h('div', { class: 'qd-label' }, 'Ahora'), h('div', { html: fmtText(tx(def.stages?.[q.stage] || '')) })));
	if (q?.done) body.push(h('div', { class: 'qd-now done' }, h('div', { class: 'qd-label' }, 'Desenlace'), h('div', { html: fmtText(tx(def.stages?.[q.stage] || def.stages?.hecha || 'Completada.')) })));
	if (!q) body.push(h('div', { class: 'qd-now' }, h('div', { class: 'qd-label' }, 'Cómo empezarla'), h('div', {}, (places?.[id] || []).some(w => w.startsWith('Al llegar')) ? 'Empieza sola cuando llegues al lugar indicado.' : 'Habla con quien la ofrece.')));
	// Lo que necesitas
	const needs = questNeeds(id).filter(n => !(def.parts && q && !q.done && n.kind === 'var' && n.id === def.parts.var));
	if (def.parts && q && !q.done) body.push(...questPartsList(def));
	if (needs.length) {
		const list = h('div', { class: 'list' });
		const party = needs.filter(n => n.kind === 'party');
		const uni = itemUniverse();
		const ownedWhere = sp => G.party.some(m => m.sp === sp) ? 'en tu equipo' : G.boxes.flat().some(m => m.sp === sp) ? 'en el PC' : '';
		const whereLine = txt => h('div', { class: 'needwhere' }, txt);
		for (const n of needs) {
			if (n.kind === 'party') continue;
			let label = '', ok = false, extra = '', info = [];
			if (n.kind === 'item') {
				const have = count(n.id); ok = have >= n.n; label = itemName(n.id); extra = `${Math.min(have, n.n)}/${n.n}`;
				info.push(have ? `Ya tienes ${have}` : 'No tienes ninguno');
				const spots = itemSpots(n.id);
				if (!ok && spots.length) {
					const left = spots.filter(x => !x.got);
					if (spots.length > 1) info.push(`Recogidos en el mapa: ${spots.length - left.length} de ${spots.length}`);
					for (const x of left.slice(0, 4)) info.push('📍 ' + (x.known ? tramoName(x.loc, x.n) : 'Un lugar que aún no conoces') + (x.hidden ? ' · escondido: usa 🔍 Buscar' : ' · en el camino'));
					if (left.length > 4) info.push(`…y ${left.length - 4} sitios más`);
				} else if (!ok) {
					const src = [...(uni[n.id] || [])].filter(w => w !== 'encontrado');
					const shown = src.filter(w => w !== 'historia');
					info.push(shown.length ? '📍 ' + shown.slice(0, 3).join(' · ') : src.includes('historia') ? '📍 Te lo darán en la historia' : '📍 Sigue explorando');
				}
			} else if (n.kind === 'var') { const v = G.vars[n.id] || 0; ok = v >= n.n; label = n.id.charAt(0).toUpperCase() + n.id.slice(1).replace(/_/g, ' '); extra = `${Math.min(v, n.n)}/${n.n}`; if (!ok) info.push(`Te faltan ${n.n - v}. Mira las zonas de interés de abajo.`); }
			else if (n.kind === 'beat') { ok = !!G.beaten[n.id]; const t = C.trainers[n.id]; label = `Vencer a ${t ? (t.cls ? t.cls + ' ' : '') + t.name : n.id}`; }
			else {
				const sp = D.species[n.id]; const num = sp?.num;
				ok = n.kind === 'seen' ? !!G.dex.seen[num] : !!G.dex.caught[num];
				label = `${n.kind === 'seen' ? 'Ver a' : 'Capturar a'} ${G.dex.seen[num] ? sp?.name : sp?.name || n.id}`;
				const w = ownedWhere(n.id);
				if (ok) info.push(n.kind === 'seen' ? 'Ya lo viste' + (G.dex.caught[num] ? ' y lo capturaste' : '') : 'Ya lo tienes' + (w ? ' (' + w + ')' : ''));
				else info.push('📍 ' + speciesWhere(n.id));
			}
			list.append(h('div', { class: 'row need' + (ok ? ' ok' : '') }, n.kind === 'item' ? itemImg(n.id) : n.kind === 'seen' || n.kind === 'caught' || n.kind === 'owns' ? (G.dex.seen[D.species[n.id]?.num] ? h('div', { class: 'sprite need-sp' }, monImg(n.id, { anim: false })) : h('div', { class: 'ico' }, '❔')) : h('div', { class: 'ico' }, n.kind === 'beat' ? '⚔️' : n.kind === 'var' ? '🔢' : '◓'),
				h('div', { class: 'lbl' }, h('div', { class: 't' }, label), extra ? h('div', { class: 'needbar' }, h('i', { style: { width: (n.kind === 'item' ? Math.min(1, count(n.id) / n.n) : Math.min(1, (G.vars[n.id] || 0) / n.n)) * 100 + '%' } })) : null, ...info.map(whereLine)),
				h('b', {}, ok ? '✔' : extra || '✘')));
		}
		if (party.length) {
			const names = party.map(n => D.species[n.id]).filter(Boolean);
			const inTeam = party.filter(n => G.party.some(p => p.sp === n.id)).map(n => D.species[n.id].name);
			const inBox = party.filter(n => !G.party.some(p => p.sp === n.id) && G.boxes.flat().some(p => p.sp === n.id)).map(n => D.species[n.id].name);
			const ok = inTeam.length > 0;
			let text;
			if (names.length <= 5) text = 'Lleva en tu equipo a ' + names.map(s => s.name).join(' o ');
			else { const types = {}; names.forEach(s => s.types.forEach(t => types[t] = (types[t] || 0) + 1)); const top = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => typeName(t)); text = `Lleva en tu equipo un Pokémon de tipo ${top.join(' o ')} (valen ${names.length} especies)`; }
			const info = [];
			if (inTeam.length) info.push('Ya lo cumples con: ' + inTeam.join(', '));
			else if (inBox.length) info.push('Tienes en el PC a ' + inBox.slice(0, 4).join(', ') + ': sácalo en un Centro Pokémon');
			else {
				// dónde atrapar alguno de los que valen, empezando por los de zonas que ya conoces
				const near = party.map(n => ({ name: D.species[n.id]?.name, w: speciesWhere(n.id, true) })).filter(x => x.w && x.name).slice(0, 3);
				info.push(near.length ? '📍 ' + near.map(x => `${x.name}: ${x.w}`).join(' · ') : '📍 Busca en cuevas, bosques y de noche');
			}
			list.append(h('div', { class: 'row need' + (ok ? ' ok' : '') }, h('div', { class: 'ico' }, '◓'), h('div', { class: 'lbl' }, h('div', { class: 't' }, text), ...info.map(whereLine)), h('b', {}, ok ? '✔' : '✘')));
		}
		body.push(h('div', { class: 'section-title' }, 'Lo que necesitas'), list);
	}
	// Dónde
	const where = (places?.[id] || questPlaces()[id] || []);
	if (where.length && !q?.done) body.push(h('div', { class: 'section-title' }, 'Zonas de interés'), h('div', { class: 'list' }, ...where.map(w => h('div', { class: 'row' }, h('div', { class: 'ico' }, '📍'), h('div', { class: 'lbl' }, h('div', { class: 't' }, w))))));
	// Historial
	if (q) {
		const keys = Object.keys(def.stages || {});
		const reached = q.hist?.length ? q.hist.map(x => x.s) : keys.slice(0, Math.max(0, keys.indexOf(q.stage)) + 1);
		const past = reached.filter((k, i) => k !== q.stage || q.done).filter((k, i, a) => a.indexOf(k) === i && k !== 'hecha');
		if (past.length) {
			body.push(h('div', { class: 'section-title' }, 'Lo que ya pasó'));
			body.push(h('div', { class: 'qd-steps' }, ...past.map(k => h('div', { class: 'qd-step' }, h('span', { class: 'dot' }, '✔'), h('div', { html: fmtText(tx(def.stages[k] || k)) })))));
		}
		body.push(h('div', { class: 'note' }, `Empezada el ${new Date(q.started || Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}` + (q.finished ? ` · terminada el ${new Date(q.finished).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}` : '')));
	}
	sheet.set(body);
}

// =================== Más ===================
function openMore() {
	const sheet = openSheet('Menú', null);
	const row = (ico, t, s, f) => h('button', { class: 'row', onclick: f }, h('div', { class: 'ico' }, ico), h('div', { class: 'lbl' }, h('div', { class: 't' }, t), s ? h('div', { class: 's' }, s) : null));
	const caught = Object.keys(G.dex.caught).length, seen = Object.keys(G.dex.seen).length;
	sheet.set(h('div', { class: 'list' },
		row('📕', 'Pokédex', `Vistos ${seen} · Capturados ${caught}`, openDex),
		(() => { const n = gatherReadyCount(), tot = knownGatherPoints().length; return row('🍒', 'Recolección', tot ? (n ? `✨ ${n} ${n === 1 ? 'punto listo' : 'puntos listos'} de ${tot}` : `${tot} ${tot === 1 ? 'punto' : 'puntos'} · nada listo aún`) : 'Bayas, huertos y vetas que conoces', openGatherMenu); })(),
		row('🧺', 'Colección', `Postales ${Object.keys(G.album || {}).length} · Objetos ${Object.keys(G.found || {}).length}`, () => openCollection()),
		row('📜', 'Conversaciones', 'Relee lo último que te dijeron', () => openDialogLog()),
		row('📍', 'Guía de zona', 'Qué Pokémon hay por aquí', openZoneGuide),
		(() => { const v = venturesSummary(); return (v.mine || v.offers) ? row('🤝', 'Negocios', v.mine ? `${v.mine} ${v.mine === 1 ? 'negocio' : 'negocios'} · por recoger ${fmtMoney(v.money)}${v.ready ? ' · ❗ te necesitan' : ''}${v.offers ? ` · ${v.offers} ${v.offers === 1 ? 'oportunidad' : 'oportunidades'}` : ''}` : `${v.offers} ${v.offers === 1 ? 'oportunidad' : 'oportunidades'} para invertir`, () => openVentures()) : null; })(),
		row('🎓', 'Tutor de movimientos', 'Recordar, olvidar y buscar movimientos', () => openTutor()),
		(() => { const n = Object.keys(G.uniq?.missed || {}).length; return row('🐾', 'Segundas oportunidades', n ? `${n} ${n === 1 ? 'Pokémon único volverá' : 'Pokémon únicos volverán'}` : 'Pokémon únicos que se escaparon', openUniques); })(),
		row('🏅', 'Retos', 'Líderes y combates importantes', openChallenges),
		row('📁', 'Expediente', 'Rivales y enemigos que conoces', openIntel),
		row('🎖️', 'Medallas', `${G.player.badges.length} medallas`, openBadges),
		row('💾', 'Guardar', G.lastSave ? 'Último guardado: ' + new Date(G.lastSave).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '', async () => { await saveGame(); toast('Partida guardada'); }),
		row('⚙️', 'Ajustes', 'Texto, Repartir Exp., sprites y respaldos', openSettings),
		row('📤', 'Exportar continuación', 'Resumen de tu partida para Claude', exportContinuation),
	));
}

// =================== Colección ===================
const COL_GROUPS = [
	['berries', '🍒', 'Bayas', it => it.berry || it.pocket === 'berries'],
	['treasure', '💎', 'Tesoros y minerales', it => ['loot', 'collectibles'].includes(it.cat)],
	['stones', '🪨', 'Piedras evolutivas', it => it.cat === 'evolution'],
	['wings', '🪶', 'Plumas', (it, id) => /wing$/.test(id) && id !== 'prettywing'],
	['balls', '◓', 'Poké Balls', it => it.pocket === 'pokeballs'],
	['medicine', '💊', 'Medicinas', it => it.pocket === 'medicine'],
	['held', '✦', 'Objetos para equipar', it => it.battle && it.pocket === 'misc'],
	['tms', '💿', 'Máquinas técnicas', it => it.pocket === 'machines' || !!it.tm],
];
/** Todos los objetos que existen en el mundo publicado y dónde se consiguen (sin revelar los de la historia). */
function itemUniverse() {
	const src = {};
	const add = (id, where) => { id = toID(id); if (!D.items[id] || D.items[id].pocket === 'key') return; (src[id] ||= new Set()).add(where); };
	for (const loc of Object.values(C.locations)) {
		const top = topLoc(loc.id);
		const name = top && top.id !== loc.id ? top.name : loc.name;
		const spots = [...(loc.spots || [])];
		if (loc.route) for (const n in loc.route.tramos || {}) for (const it of [].concat(loc.route.tramos[n] || [])) { spots.push(it.spot || it); if (it.item) add(it.item, `${loc.name} (${it.hidden ? 'escondido' : 'en el camino'})`); }
		for (const sp of spots) {
			const g = sp.action?.gather && C.gather[sp.action.gather];
			if (g) for (const e of g.table || []) add(e.id, `${name} · ${g.name}`);
			if (sp.action?.shop && C.shops[sp.action.shop]) for (const e of C.shops[sp.action.shop].items || []) add(typeof e === 'string' ? e : e.id, `${C.shops[sp.action.shop].name} (${name})`);
		}
	}
	const scan = list => { for (const c of list || []) { if (!c || typeof c !== 'object') continue; if (c.give) add(c.give, 'historia'); for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit']) if (Array.isArray(c[k])) scan(c[k]); if (Array.isArray(c.choice)) for (const o of c.choice) scan(o.then); } };
	for (const id in C.scripts) scan(C.scripts[id]);
	for (const id in G.found || {}) if (!src[id]) add(id, 'encontrado');
	return src;
}

function openCollection(startTab = 'postcards') {
	let tab = startTab;
	const sheet = openSheet('Colección', null);
	const draw = () => {
		const towns = Object.values(C.locations).filter(l => !l.parent && ['city', 'town'].includes(l.kind));
		const album = G.album || {};
		const uni = itemUniverse();
		const keys = Object.keys(G.bag).filter(id => G.bag[id] > 0 && D.items[id]?.pocket === 'key');
		const tabs = h('div', { class: 'tabs' }, ...[['postcards', 'Postales', `${towns.filter(t => album[t.id]).length}/${towns.length}`], ['items', 'Objetos', `${Object.keys(uni).filter(id => G.found?.[id]).length}/${Object.keys(uni).length}`], ['keep', 'Recuerdos', String(keys.length)]]
			.map(([k, n, c]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, n, h('span', { class: 'tabcount' }, c))));
		const body = h('div', {});
		if (tab === 'postcards') {
			body.append(h('div', { class: 'note' }, 'Cada ciudad y pueblo que visitas te deja una postal. Toca una para verla en grande.'));
			const byRegion = {};
			for (const t of towns) (byRegion[t.region || 'otros'] ||= []).push(t);
			for (const [reg, list] of Object.entries(byRegion)) {
				body.append(h('div', { class: 'section-title' }, `${C.regions[reg]?.name || reg} · ${list.filter(t => album[t.id]).length}/${list.length}`));
				const grid = h('div', { class: 'postgrid' });
				for (const t of list) {
					const have = album[t.id];
					const card = h('button', { class: 'postcard' + (have ? '' : ' locked'), onclick: () => have && viewPostcard(t) },
						have ? sceneCanvas({ ...(t.bg || {}), seed: t.bg?.seed || t.id }, { phase: 'dia' }) : h('div', { class: 'pc-q' }, '?'),
						h('div', { class: 'pc-name' }, have ? (t.short || t.name.replace(/^(Ciudad|Pueblo) /, '')) : '???'));
					grid.append(card);
				}
				body.append(grid);
			}
		} else if (tab === 'items') {
			body.append(h('div', { class: 'note' }, 'Todo lo que se puede conseguir en el mundo publicado. Los que aún no tienes salen como ???, con una pista de dónde buscarlos.'));
			for (const [gid, icon, title, test] of COL_GROUPS) {
				const ids = Object.keys(uni).filter(id => { const it = D.items[id]; return it && test(it, id); }).sort((a, b) => (!!G.found?.[b] - !!G.found?.[a]) || itemName(a).localeCompare(itemName(b)));
				if (!ids.length) continue;
				const got = ids.filter(id => G.found?.[id]).length;
				body.append(h('div', { class: 'section-title' }, `${icon} ${title} · ${got}/${ids.length}${got === ids.length ? ' ⭐' : ''}`));
				const list = h('div', { class: 'list' });
				for (const id of ids) {
					const have = !!G.found?.[id];
					const where = [...uni[id]].filter(w => w !== 'encontrado');
					const hint = where.includes('historia') && where.length === 1 ? 'Aparece en la historia' : where.filter(w => w !== 'historia').slice(0, 2).join(' · ');
					list.append(h('div', { class: 'row colitem' + (have ? '' : ' unknown') }, itemImg(id, { found: have }),
						h('div', { class: 'lbl' }, h('div', { class: 't' }, have ? itemName(id) : '???'), h('div', { class: 's' }, have ? (D.items[id].desc || '') : hint || 'Sigue explorando')),
						have ? h('b', {}, G.bag[id] ? '×' + G.bag[id] : '') : null));
				}
				body.append(list);
			}
		} else {
			if (!keys.length) body.append(h('div', { class: 'empty' }, 'Aún no guardas ningún recuerdo.'));
			const list = h('div', { class: 'list' });
			for (const id of keys) {
				const it = D.items[id];
				const act = it.art ? ['Mirar', async () => { const { viewArt } = await import('./acuarela.js'); await viewArt(id); }] : it.read ? ['Leer', () => readPaper(it.name, tx(it.read), { icon: itemImg(id) })] : null;
				list.append(h(act ? 'button' : 'div', { class: 'row', onclick: act ? act[1] : null }, itemImg(id),
					h('div', { class: 'lbl' }, h('div', { class: 't' }, it.name), h('div', { class: 's' }, it.desc || '')), act ? h('b', {}, act[0]) : null));
			}
			body.append(list);
		}
		sheet.set([tabs, body]);
	};
	draw();
}

function viewPostcard(t) {
	const cv = sceneCanvas({ ...(t.bg || {}), seed: t.bg?.seed || t.id }, { phase: 'dia' });
	const date = new Date(G.album[t.id]).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
	const first = (descOf(t) || '').replace(/\*\*/g, '').split(/(?<=\.)\s/)[0];
	const ov = h('div', { class: 'overlay dim art-viewer', onclick: () => ov.remove() },
		h('div', { class: 'postcard-big' },
			cv,
			h('div', { class: 'pcb-text' },
				h('div', { class: 'pcb-greet' }, `Recuerdos desde ${t.name}`),
				h('div', { class: 'pcb-desc' }, tx(first)),
				h('div', { class: 'pcb-date' }, `${C.regions[t.region]?.name || ''} · ${date}`)),
			h('div', { class: 'pcb-stamp' }, '♾️')),
		h('div', { class: 'art-hint' }, 'Toca para cerrar'));
	document.body.append(ov);
}

function openDex() {
	const sheet = openSheet('Pokédex', null);
	let filter = 'seen';
	const draw = () => {
		const tabs = h('div', { class: 'tabs' }, ...[['seen', 'Vistos'], ['caught', 'Capturados'], ['all', 'Nacional']].map(([k, n]) => h('button', { class: filter === k ? 'on' : '', onclick: () => { filter = k; draw(); } }, n)));
		const grid = h('div', { class: 'dexgrid' });
		const nums = Object.keys(D.byNum).map(Number).sort((a, b) => a - b);
		let shown = 0;
		for (const n of nums) {
			const seen = G.dex.seen[n], caught = G.dex.caught[n];
			if (filter === 'seen' && !seen) continue;
			if (filter === 'caught' && !caught) continue;
			if (filter === 'all' && shown > 400) break;
			shown++;
			const id = D.byNum[n];
			const cell = h('button', { class: 'dexcell' + (seen ? '' : ' unk'), onclick: () => seen && dexEntry(id) },
				seen ? monImg(id, { anim: false }) : h('div', { style: { height: '70%' } }),
				h('span', {}, (caught ? '◓ ' : '') + (seen ? D.species[id].name : '#' + String(n).padStart(4, '0'))));
			grid.append(cell);
		}
		if (!shown) grid.append(h('div', { class: 'empty', style: { gridColumn: '1 / -1' } }, 'Aún no hay nada aquí.'));
		sheet.set([tabs, grid]);
	};
	draw();
}

function knownLocationsOf(spId) {
	const out = [];
	for (const l of Object.values(C.locations)) {
		if (!G.visited[l.id]) continue;
		const enc = l.route?.encounters || l.encounters || {};
		for (const t in enc) if (enc[t].some(e => e.sp === spId)) { out.push(l.name); break; }
	}
	return out;
}

function dexEntry(id) {
	const s = D.species[id];
	const caught = G.dex.caught[s.num];
	const where = knownLocationsOf(id);
	openSheet(`#${String(s.num).padStart(4, '0')} ${s.name}`, h('div', {},
		h('div', { style: { display: 'grid', placeItems: 'center', height: '160px' } }, monImg(id)),
		h('div', { class: 'pad' }, h('div', { class: 'typechip-row' }, ...s.types.map(t => h('span', { class: 'type', style: typeStyle(t) }, typeName(t)))), h('div', { style: { color: 'var(--muted)', marginTop: '6px' } }, s.genus || '')),
		caught ? h('div', { class: 'diary-entry' }, s.dex || '') : h('div', { class: 'note' }, 'Captúralo para ver su entrada completa.'),
		caught ? h('div', {}, ...STATS.map((k, i) => h('div', { class: 'statbar' }, h('span', {}, STAT_NAMES[k]), h('b', {}, s.bs[i]), h('div', { class: 'b' }, h('i', { style: { width: Math.min(100, s.bs[i] / 1.8) + '%' } }))))) : null,
		h('dl', { class: 'kv' }, h('dt', {}, 'Altura'), h('dd', {}, (s.hw?.[0] || '?') + ' m'), h('dt', {}, 'Peso'), h('dd', {}, (s.hw?.[1] || '?') + ' kg'),
			caught ? h('dt', {}, 'Habilidades') : null, caught ? h('dd', {}, Object.values(s.abil).map(abilityName).join(', ')) : null,
			h('dt', {}, 'Dónde'), h('dd', {}, where.length ? where.join(', ') : 'Desconocido')),
	));
}

export function openZoneGuide() {
	const loc = L(G.loc);
	const sheet = openSheet('Guía de zona', null);
	const body = [h('div', { class: 'section-title' }, loc.name)];
	const enc = loc.route?.encounters || loc.encounters || {};
	const TNAMES = { grass: 'Hierba alta', cave: 'Cueva', water: 'Agua', fish: 'Pesca', forest: 'Bosque', flowers: 'Flores', sand: 'Arena', snow: 'Nieve', path: 'Camino', rocks: 'Rocas' };
	let any = false;
	for (const t in enc) {
		const tbl = encounterTable(loc, t);
		const all = enc[t];
		if (!all.length) continue;
		any = true;
		const lvs = all.map(e => Array.isArray(e.lv) ? e.lv : [e.lv, e.lv]).flat();
		const types = new Set();
		all.forEach(e => D.species[e.sp]?.types.forEach(x => types.add(x)));
		body.push(h('div', { class: 'note' }, h('b', {}, TNAMES[t] || t), ` · Nv. ${Math.min(...lvs)}–${Math.max(...lvs)} · Tipos: ${[...types].map(typeName).join(', ')}`));
		const list = h('div', { class: 'list' });
		const seenSp = new Set();
		const ph = phase();
		const oNow = encounterOdds(loc, t, ph), oDay = encounterOdds(loc, t, 'dia'), oNight = encounterOdds(loc, t, 'noche');
		const odds = p => p >= 0.5 ? '1 de cada 2' : `1 de cada ${Math.round(1 / p)}`;
		const pct = p => p >= 0.1 ? Math.round(p * 100) + ' %' : (Math.round(p * 1000) / 10).toString().replace('.', ',') + ' %';
		const rarity = p => p >= 0.25 ? ['Muy común', '#3f9b5a'] : p >= 0.12 ? ['Común', '#5aa36b'] : p >= 0.06 ? ['Poco común', '#c99a2e'] : p >= 0.03 ? ['Raro', '#d0743a'] : ['Muy raro', '#c4473a'];
		const species = [...new Set(all.map(e => e.sp))].sort((a, b) => (oNow[b] || 0) - (oNow[a] || 0) || ((oDay[b] || 0) + (oNight[b] || 0)) - ((oDay[a] || 0) + (oNight[a] || 0)));
		for (const sp of species) {
			if (seenSp.has(sp)) continue;
			seenSp.add(sp);
			const entries = all.filter(e => e.sp === sp);
			const e = entries[0];
			const s = D.species[sp];
			const seen = G.dex.seen[s.num];
			const pNow = oNow[sp] || 0, pD = oDay[sp] || 0, pN = oNight[sp] || 0;
			const lvs = entries.map(x => Array.isArray(x.lv) ? x.lv : [x.lv, x.lv]).flat();
			const lvTxt = Math.min(...lvs) === Math.max(...lvs) ? `Nv. ${lvs[0]}` : `Nv. ${Math.min(...lvs)}–${Math.max(...lvs)}`;
			const [rName, rCol] = rarity(pNow || Math.max(pD, pN));
			const nowTxt = pNow ? `${odds(pNow)} (${pct(pNow)})` : (pN && !pD ? 'Ahora no: solo de noche' : pD && !pN ? 'Ahora no: solo de día' : 'Ahora no sale');
			const split = (!pD !== !pN) || (pD && pN && Math.max(pD, pN) / Math.min(pD, pN) > 1.5) ? `☀️ ${pD ? odds(pD) : '—'} · 🌙 ${pN ? odds(pN) : '—'}` : '';
			list.append(h('div', { class: 'mon' + (pNow ? '' : ' fainted') },
				h('div', { class: 'sprite' }, seen ? monImg(sp, { anim: false }) : h('div', { style: { fontSize: '26px' } }, '❔')),
				h('div', { class: 'info' },
					h('div', { class: 'name' }, seen ? s.name : '???', G.dex.caught[s.num] ? h('span', { class: 'caughtmark' }, '◓') : null, e.displaced ? h('span', { class: 'status', style: { background: '#7a5cd6' } }, 'DESPLAZADO') : null),
					h('div', { class: 'hptext' }, h('span', {}, h('b', { style: { color: rCol } }, rName), ' · ' + nowTxt), h('span', {}, lvTxt)),
					split ? h('div', { class: 'oddsplit' }, split) : null)));
		}
		body.push(list);
	}
	if (!any) body.push(h('div', { class: 'empty' }, 'Aquí no hay Pokémon salvajes.'));
	const rumors = (loc.rumors || []).filter(r => r.cond === undefined || evalCond(r.cond));
	if (rumors.length) body.push(h('div', { class: 'section-title' }, 'Rumores'), ...rumors.map(r => h('div', { class: 'note' }, tx(r.text))));
	sheet.set(body);
}

function openChallenges() {
	const sheet = openSheet('Retos', null);
	const list = h('div', {});
	const chs = Object.values(C.challenges).filter(c => c.cond === undefined || evalCond(c.cond));
	if (!chs.length) list.append(h('div', { class: 'empty' }, 'Todavía no conoces ningún reto importante.'));
	for (const c of chs) {
		const t = C.trainers[c.trainer];
		const beaten = c.trainer && G.beaten[c.trainer];
		const lines = (c.info || []).filter(i => i.cond === undefined || evalCond(i.cond));
		const n = c.npc ? { id: c.npc, ...C.npcs[c.npc] } : null;
		const p = n ? portraitFor(n) : null;
		if (p) { p.style.width = '56px'; p.style.height = '56px'; p.style.borderRadius = '12px'; }
		list.append(h('div', { class: 'row', style: { alignItems: 'flex-start', margin: '0 12px 8px', width: 'auto' } },
			p ? h('div', { style: { width: '56px', height: '56px', flex: 'none', borderRadius: '12px', overflow: 'hidden' } }, p) : h('div', { class: 'ico' }, '🏅'),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, c.name + (beaten ? ' ✔' : '')),
				c.type ? h('div', { class: 'typechip-row', style: { margin: '4px 0' } }, h('span', { class: 'type', style: typeStyle(c.type) }, typeName(c.type))) : null,
				c.rec ? h('div', { class: 's' }, `Nivel recomendado: ${c.rec}`) : null,
				...lines.map(l => h('div', { class: 's', html: '• ' + fmtText(tx(l.text)) })))));
	}
	sheet.set(list);
}

function openIntel() {
	const sheet = openSheet('Expediente', null);
	const list = h('div', {});
	const ids = Object.keys(G.intel);
	if (!ids.length) list.append(h('div', { class: 'empty' }, 'El expediente está vacío. Lo que descubras de tus rivales y enemigos aparecerá aquí.'));
	for (const id of ids) {
		const n = { id, ...(C.npcs[id] || { name: id }) };
		const it = G.intel[id];
		const p = portraitFor(n);
		if (p) { p.style.width = '56px'; p.style.height = '56px'; }
		const teams = Object.entries(it.teams || {});
		list.append(h('div', { class: 'row', style: { alignItems: 'flex-start', margin: '0 12px 8px', width: 'auto' } },
			h('div', { style: { width: '56px', height: '56px', flex: 'none', borderRadius: '12px', overflow: 'hidden' } }, p),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, n.name), n.title ? h('div', { class: 's' }, n.title) : null,
				...teams.slice(-1).map(([tid, tm]) => h('div', { class: 's' }, 'Último equipo visto: ' + tm.map(m => `${D.species[m.sp]?.name} (${m.lv})`).join(', '))),
				...(it.notes || []).slice(-4).map(x => h('div', { class: 's', html: '• ' + fmtText(x.text) })))));
	}
	sheet.set(list);
}

function openBadges() {
	const list = h('div', { class: 'list' });
	if (!G.player.badges.length) list.append(h('div', { class: 'empty' }, 'Aún no tienes medallas del Circuito Infinito.'));
	for (const b of G.player.badges) {
		const d = C.badges[b] || { name: b };
		list.append(h('div', { class: 'row' }, h('div', { class: 'ico', style: { background: TYPE_COLORS[d.type] || 'var(--ink-3)' } }, '🏅'), h('div', { class: 'lbl' }, h('div', { class: 't' }, d.name), h('div', { class: 's' }, d.desc || ''))));
	}
	openSheet('Medallas', [list, h('div', { class: 'note' }, `Temporada 1 del Circuito Infinito: ${G.player.badges.length}/8 medallas.`)]);
}

function openSettings() {
	const sheet = openSheet('Ajustes', null);
	const draw = () => {
		const toggle = (label, sub, key, def = true) => h('button', { class: 'row', onclick: () => { G.settings[key] = !(G.settings[key] ?? def); draw(); } }, h('div', { class: 'lbl' }, h('div', { class: 't' }, label), h('div', { class: 's' }, sub)), h('b', {}, (G.settings[key] ?? def) ? 'Sí' : 'No'));
		const speeds = ['Lenta', 'Normal', 'Rápida', 'Instantánea'];
		sheet.set([
			h('div', { class: 'section-title' }, 'Juego'),
			h('div', { class: 'list' },
				h('button', { class: 'row', onclick: () => { G.settings.textSpeed = ((G.settings.textSpeed ?? 2) + 1) % 4; setTextSpeed(G.settings.textSpeed); draw(); } }, h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Velocidad del texto')), h('b', {}, speeds[G.settings.textSpeed ?? 2])),
				toggle('Repartir Experiencia', 'Todo el equipo gana EXP (la mitad si no combate).', 'expShare'),
				h('button', { class: 'row', onclick: () => { G.settings.battleStyle = (G.settings.battleStyle ?? 'shift') === 'shift' ? 'set' : 'shift'; draw(); } }, h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Estilo de combate'), h('div', { class: 's' }, (G.settings.battleStyle ?? 'shift') === 'shift' ? 'Cambio: cuando cae un Pokémon rival, te pregunta si quieres cambiar el tuyo.' : 'Fijo: no te pregunta; sigues con el mismo Pokémon.')), h('b', {}, (G.settings.battleStyle ?? 'shift') === 'shift' ? 'Cambio' : 'Fijo')),
				G.vars.mount ? toggle('Usar montura', 'Avanzas dos tramos por paso en rutas.', 'useMount') : null,
			),
			h('div', { class: 'section-title' }, 'Tu entrenador'),
			h('div', { class: 'list' }, h('button', { class: 'row', onclick: openLookEditor }, h('div', { class: 'ico' }, '🪞'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Cambiar aspecto'), h('div', { class: 's' }, 'Cara, mirada, peinado, colores y ropa')))),
			h('div', { class: 'section-title' }, 'Sprites de Pokémon'),
			h('div', { class: 'note' }, 'El juego descarga cada sprite la primera vez que ves a un Pokémon y lo guarda para jugar sin internet. Con WiFi puedes bajarlos todos de una vez.'),
			h('div', { class: 'list' }, h('button', { class: 'row', onclick: downloadAllSprites }, h('div', { class: 'ico' }, '⬇️'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Descargar todos los sprites'), h('div', { class: 's', id: 'dlstatus' }, 'Unos 60 MB · usa WiFi')))),
			h('div', { class: 'section-title' }, 'Respaldo'),
			h('div', { class: 'list' },
				h('button', { class: 'row', onclick: downloadBackup }, h('div', { class: 'ico' }, '💾'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Exportar respaldo'), h('div', { class: 's' }, 'Archivo con tu partida, por si cambias de teléfono'))),
				h('button', { class: 'row', onclick: importBackup }, h('div', { class: 'ico' }, '📥'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Importar respaldo'))),
				h('button', { class: 'row', onclick: async () => { if (await confirm('Esto borra tu partida de este teléfono. ¿Seguro?', 'Borrar', 'Cancelar') && await confirm('¿De verdad? No se puede deshacer.', 'Sí, borrar', 'No')) { await deleteSave(); location.reload(); } } }, h('div', { class: 'ico' }, '🗑️'), h('div', { class: 'lbl' }, h('div', { class: 't' }, 'Borrar partida')))),
			h('div', { class: 'note' }, `Pokémon Infinite · contenido ${C.version} · tiempo de juego ${fmtDuration(G.playMs || 0)}. Fangame sin ánimo de lucro. Pokémon y sus personajes son de Nintendo, Game Freak y The Pokémon Company.`),
		]);
	};
	draw();
}

function downloadFile(name, text) {
	const blob = new Blob([text], { type: 'application/json' });
	const a = h('a', { href: URL.createObjectURL(blob), download: name });
	document.body.append(a); a.click(); a.remove();
}
function downloadBackup() {
	const d = new Date().toISOString().slice(0, 10);
	downloadFile(`pokemon-infinite-${d}.json`, exportSave());
	toast('Respaldo exportado');
}

async function downloadAllSprites() {
	const st = document.getElementById('dlstatus');
	if (!('caches' in self)) { toast('Este navegador no permite guardar sprites'); return; }
	const { monUrls } = await import('../art.js');
	const ids = Object.values(D.byNum);
	const cache = await caches.open('sprites-v1');
	let done = 0, fail = 0;
	const queue = ids.slice();
	const worker = async () => {
		while (queue.length) {
			const id = queue.shift();
			for (const back of [false, true]) {
				const url = monUrls(id, { back })[0];
				try {
					if (!(await cache.match(url))) { const r = await fetch(url, { mode: 'cors' }); if (r.ok) await cache.put(url, r); else fail++; }
				} catch (e) { fail++; }
			}
			done++;
			if (st && done % 10 === 0) st.textContent = `Descargando… ${done}/${ids.length}`;
		}
	};
	await Promise.all([worker(), worker(), worker(), worker()]);
	if (st) st.textContent = `Listo: ${done} Pokémon${fail ? ` (${fail} no disponibles)` : ''}`;
	toast('Sprites descargados');
}

function exportContinuation() {
	const quests = Object.entries(G.quests).map(([id, q]) => `${id}:${q.done ? 'hecha' : q.stage}`).join(', ');
	const party = G.party.map(p => `${D.species[p.sp].name}${p.nick ? ' "' + p.nick + '"' : ''} nv${p.lv}`).join(', ');
	const flags = Object.keys(G.flags).filter(k => G.flags[k] && !k.startsWith('enter:')).join(', ');
	const summary = {
		juego: 'Pokémon Infinite', contenido: C.version, fecha: new Date().toISOString(), jugador: G.player.name, pron: G.player.pron,
		lugar: G.loc, medallas: G.player.badges, dinero: G.player.money, tiempo: fmtDuration(G.playMs || 0), equipo: party, misiones: quests,
		flags, vars: G.vars, rep: G.rep, af: G.af, pokedex: { vistos: Object.keys(G.dex.seen).length, capturados: Object.keys(G.dex.caught).length },
	};
	const text = 'CONTINUACIÓN POKÉMON INFINITE\n' + JSON.stringify(summary, null, 1);
	const sheet = openSheet('Exportar continuación', [
		h('div', { class: 'note' }, 'Copia este texto y pégaselo a Claude si quieres que el siguiente bloque tenga en cuenta algo muy específico de tu partida. No contiene spoilers.'),
		h('div', { class: 'pad' }, h('textarea', { class: 'field-input', style: { height: '45vh', fontSize: '12px', fontFamily: 'monospace' }, readonly: true }, text)),
		h('div', { class: 'pad' }, h('button', { class: 'btn primary', style: { width: '100%' }, onclick: async () => { try { await navigator.clipboard.writeText(text); toast('Copiado'); } catch (e) { toast('Mantén pulsado el texto para copiarlo'); } } }, 'Copiar')),
	]);
}

// =================== Aviso de ritmo ===================
/** Avisos que salen solos al pintar el lugar (Rotom), sin pisar un guion en curso. */
async function showQueued(fn) {
	if (busy) return;
	busy = true;
	try { await fn(); } catch (e) { console.error(e); } finally { busy = false; }
	render();
}

async function showPaceNotice(m) {
	if (busy) return;
	G.notices[m.flag] = Date.now();
	busy = true;
	try {
		await say({ name: 'Rotom', look: { hair: 'spiky', hairColor: '#e07a3a', skin: '#f6f0e6', eyes: '#4c7cf0', outfit: '#e07a3a', outfit2: '#4c7cf0', eyesStyle: 'happy', mouth: 'grin' } },
			tx(m.text || `¡Bzzt! Aviso de ritmo: te quedan unas **${m.hoursLeft} horas** de historia publicada. Ve pidiéndole a Claude que escriba el siguiente bloque mientras llegas al final de este. (Si tu juego se actualiza solo cada noche, puede que ya esté en camino.)`));
	} finally { busy = false; }
	await saveGame();
	render(); // por si hay más avisos en cola (únicos que vuelven, eventos)
}
