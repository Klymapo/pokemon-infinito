// Pantallas principales: título, creación, lugar, ruta, mapa y menús.
import { D, toID, TYPE_COLORS, typeName, STAT_NAMES, STATS, abilityName, natureName, moveName, itemName } from '../data.js';
import { C, topLoc } from '../content.js';
import {
	G, newGame, setG, saveGame, loadSaved, exportSave, importSave, deleteSave, evalCond, addItem, removeItem, count, markCaught,
} from '../state.js';
import {
	createPokemon, displayName, maxHp, calcStats, healFull, expProgress, checkEvolution, addHappy, natureMod, canLearn,
} from '../pokemon.js';
import {
	L, isRoute, spotsOf, descOf, tramoItems, tramoTerrain, encounterTable, rollWild, mounted, encounterRate, canMove,
	markTramo, walkFriendship, findPath, canEnter, healParty, whiteout, trainingOpen, avgLevel, pendingNotices, routeProg, activeEvents,
} from '../world.js';
import { runScript, runFirst, UI, tx, findRiolu } from '../guion.js';
import { monImg, sceneCanvas, portraitCanvas, HAIRS, LOOK_DEFAULTS } from '../art.js';
import { h, $, app, say, choose, prompt, confirm, toast, openSheet, closeAllSheets, setTextSpeed, portraitFor } from './core.js';
import { runBattle, learnMoveUI, evolveUI } from './battle-ui.js';
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
	});
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

// =================== Creación de personaje ===================
function creation() {
	const root = app();
	root.innerHTML = '';
	const look = { ...LOOK_DEFAULTS, skin: 1 };
	let name = '', pron = 'el';
	const preview = h('div', { style: { width: '120px', height: '120px', borderRadius: '20px', overflow: 'hidden', border: '3px solid var(--cream)', margin: '0 auto' } });
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
	const styles = [['short', 'Corto'], ['long', 'Largo'], ['bob', 'Melena'], ['ponytail', 'Coleta'], ['braids', 'Trenzas'], ['spiky', 'Puntas'], ['curly', 'Rizado'], ['bun', 'Moño'], ['cap', 'Gorra']];
	const styleRow = h('div', { class: 'tabs', style: { flexWrap: 'wrap' } });
	styles.forEach(([k, n]) => {
		const b = h('button', { class: look.hair === k ? 'on' : '' }, n);
		b.onclick = () => { look.hair = k; styleRow.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); redraw(); };
		styleRow.append(b);
	});
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
		preview,
		h('div', { class: 'section-title' }, 'Nombre'), h('div', { class: 'pad' }, nameInput),
		h('div', { class: 'section-title' }, 'Pronombres'), pronRow,
		h('div', { class: 'section-title' }, 'Piel'), swatchRow(['#ffe0c7', '#f5cba7', '#e0ac85', '#c68863', '#9a6646', '#6e4630'], 'skin'),
		h('div', { class: 'section-title' }, 'Peinado'), styleRow,
		h('div', { class: 'section-title' }, 'Color de pelo'), swatchRow(HAIRS, 'hairColor'),
		h('div', { class: 'section-title' }, 'Ojos'), swatchRow(['#3a5fc4', '#3f8a4f', '#6b4a2b', '#2b2b38', '#8c6cd0', '#c4473a'], 'eyes'),
		h('div', { class: 'section-title' }, 'Ropa'), swatchRow(['#4c7cf0', '#c4473a', '#3f9d58', '#d8a85a', '#8c6cd0', '#2b2b38', '#e9e3d0', '#e07a3a'], 'outfit'),
		h('div', { class: 'note' }, 'Tu personaje es un adulto joven que acaba de inscribirse en el Circuito Infinito. Puedes cambiar estos detalles más adelante en Ajustes.'),
		h('div', { class: 'pad' }, h('button', { class: 'btn primary', style: { width: '100%' }, onclick: start }, 'Empezar la aventura')),
	);
	root.append(wrap);
	redraw();
}

// =================== Render principal ===================
export function render() {
	if (!G) return;
	const root = app();
	const loc = L(G.loc);
	if (!loc) { root.innerHTML = '<div class="empty">Ubicación desconocida.</div>'; return; }
	root.innerHTML = '';
	const ph = phase();
	const top = h('div', { class: 'topbar' },
		h('div', { class: 'place' }, loc.name),
		h('div', { class: 'chip', title: PHASE_NAMES[ph] }, PHASE_ICON[ph]),
		h('div', { class: 'chip money' }, fmtMoney(G.player.money)));
	const main = h('div', { class: 'main' });
	const scene = h('div', { class: 'scene' }, sceneCanvas({ ...(loc.bg || {}), seed: loc.bg?.seed || loc.id }));
	main.append(scene);
	if (isRoute(loc)) renderRoute(main, loc);
	else renderPlace(main, loc);
	root.append(top, main, navBar());
	// avisos de ritmo pendientes
	const notes = pendingNotices();
	if (notes.length) setTimeout(() => showPaceNotice(notes[0]), 300);
}

function navBar() {
	const nav = h('div', { class: 'nav' });
	const items = [['🗺️', 'Mapa', openMap], ['◓', 'Equipo', openParty], ['🎒', 'Mochila', () => openBag()], ['📔', 'Diario', () => openDiary()], ['☰', 'Más', openMore]];
	for (const [i, t, f] of items) nav.append(h('button', { onclick: f }, h('span', { class: 'i' }, i), t));
	return nav;
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
	if (a.center) return '❤️'; if (a.shop) return '🛒'; if (a.pc) return '💻'; if (a.gym || s.gym) return '🏅';
	if (a.go) return '🚪'; if (a.training) return '🥋'; if (a.trainer) return '⚔️'; if (a.explore) return '🌿';
	return '💬';
}

function renderPlace(main, loc) {
	main.append(h('div', { class: 'desc' }, ...descOf(loc).split('\n\n').map(p => h('p', { html: fmtText(tx(p)) }))));
	const spots = spotsOf(loc);
	if (spots.length) {
		main.append(h('div', { class: 'section-title' }, 'Aquí'));
		const list = h('div', { class: 'list' });
		for (const s of spots) {
			const a = s.action || {};
			const isNew = s.new !== undefined ? evalCond(s.new) : false;
			const done = s.doneIf !== undefined && evalCond(s.doneIf);
			const row = h('button', { class: 'row' + (isNew ? ' hl' : '') + (s.event ? ' event' : '') + (done ? ' done' : ''), onclick: () => guarded(() => doSpot(s, loc)) },
				h('div', { class: 'ico' }, spotIcon(s)),
				h('div', { class: 'lbl' }, h('div', { class: 't' }, tx(s.label)), s.sub ? h('div', { class: 's' }, tx(s.sub)) : null),
				isNew ? h('span', { class: 'badge-new' }, '!') : null);
			list.append(row);
		}
		main.append(list);
	}
	// Salidas
	const exits = [];
	if (loc.parent) exits.push({ id: loc.parent, label: 'Salir a ' + (L(loc.parent)?.name || ''), icon: '🚪' });
	for (const n of loc.links || []) {
		const l = L(n);
		if (!l || (l.hidden !== undefined && evalCond(l.hidden))) continue;
		const ce = canEnter(n);
		exits.push({ id: n, label: l.name, icon: isRoute(l) ? '🛤️' : '🏘️', sub: G.cleared[n] ? 'Despejada' : G.visited[n] ? 'Visitada' : 'Sin explorar', blocked: !ce.ok, msg: ce.msg });
	}
	if (exits.length) {
		main.append(h('div', { class: 'section-title' }, 'Caminos'));
		const list = h('div', { class: 'list' });
		for (const e of exits) list.append(h('button', { class: 'row', onclick: () => guarded(async () => { if (e.blocked) { await say(null, tx(e.msg)); return; } await enterLocation(e.id, { from: loc.id }); }) },
			h('div', { class: 'ico' }, e.icon), h('div', { class: 'lbl' }, h('div', { class: 't' }, e.label), e.sub ? h('div', { class: 's' }, e.sub) : null)));
		main.append(list);
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
	if (a.explore) return exploreHere(loc, a.explore === true ? 'grass' : a.explore);
}

async function pokemonCenter(a = {}) {
	const nurse = { name: a.nurse || 'Enfermera Joy', look: { hair: 'long', hairColor: '#e98aa8', outfit: '#f3e6e8', outfit2: '#e85a6a', eyes: '#3a5fc4', skin: 0, acc: 'bow' } };
	await say(nurse, '¡Hola! Bienvenid{o|a|e} al Centro Pokémon. Deja que tus Pokémon descansen un momento.');
	healParty();
	G.lastCenter = topLoc(G.loc)?.id || G.loc;
	G.lastCenterSub = G.loc;
	await say(nurse, '¡Listo! Tus Pokémon están en plena forma. ¡Esperamos volver a verte!');
	await saveGame();
}

async function training(t, s) {
	const cap = t.cap || G.vars.cap || 15;
	const coach = t.npc ? { id: t.npc, ...C.npcs[t.npc] } : { name: t.coach || 'Instructor', look: { seed: s.label } };
	if (!trainingOpen(cap)) {
		await say(coach, tx(t.closed || `Tu equipo ya tiene el nivel que necesita (media ${avgLevel().toFixed(1)} ≥ ${cap}). Ya estás listo. No te voy a dejar perder el tiempo aquí.`));
		return;
	}
	const i = await choose(tx(t.prompt || `Nivel recomendado: ${cap}. Tu media: ${avgLevel().toFixed(1)}. ¿Entrenamos?`), ['Combate de práctica', t.wild ? 'Buscar Pokémon salvajes' : null, 'Ahora no'].filter(Boolean));
	if (i === 0 && t.trainers?.length) return battle({ trainer: pick(t.trainers) });
	if (i === 1 && t.wild) {
		const loc = L(G.loc);
		const tbl = t.wild;
		const e = pick(tbl);
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
			extra.append(h('button', { class: 'row' + (it.new && evalCond(it.new) ? ' hl' : ''), onclick: () => guarded(() => it.talk ? runFirst(it.talk) : doSpot(sp, loc)) }, h('div', { class: 'ico' }, it.icon || '💬'), h('div', { class: 'lbl' }, h('div', { class: 't' }, tx(it.label || sp.label || 'Hablar')), it.sub ? h('div', { class: 's' }, tx(it.sub)) : null)));
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
	main.append(actions);
	if (routeMsg) main.append(h('div', { class: 'route-log', html: fmtText(routeMsg) }));
	if (mounted()) main.append(h('div', { class: 'note' }, `Vas a lomos de tu montura: avanzas dos tramos por paso y hay menos encuentros.`));
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
	let n = pos;
	for (let k = 0; k < step; k++) {
		const nn = Math.max(0, Math.min(r.length, n + dir));
		if (nn === n) break;
		// no saltar tramos con eventos obligatorios
		n = nn;
		markTramo(loc.id, n);
		if (tramoItems(loc, n).some(x => (x.trainer && !x.optional && !G.beaten[x.trainer]) || (x.script && !routeProg(loc.id).done[n + ':' + x.script]) || x.block)) break;
	}
	G.route = { id: loc.id, pos: n };
	const ev = walkFriendship();
	if (ev === 'repel_end') await say(null, 'El efecto del repelente se ha agotado.');
	await arriveTramo(loc, n, dir);
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
			pr.done[key] = true;
			await runScript(it.script);
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

async function searchHere() {
	const loc = L(G.loc);
	const n = G.route.pos;
	const pr = routeProg(loc.id);
	const hidden = tramoItems(loc, n).find(x => x.item && x.hidden && !pr.items[n + ':' + x.item]);
	if (hidden) {
		pr.items[n + ':' + hidden.item] = true;
		addItem(hidden.item, hidden.n || 1);
		await say(null, `Rebuscando entre la hierba… ¡Has encontrado **${itemName(hidden.item)}**!`);
		return;
	}
	const terrain = tramoTerrain(loc, n);
	const w = rollWild(loc, terrain);
	if (w && rng() < 0.85) {
		routeMsg = '';
		await say(null, terrain === 'water' ? 'Algo se mueve bajo el agua…' : terrain === 'cave' ? 'Algo se mueve entre las rocas…' : '¡La hierba se agita!');
		await battle({ wild: { mon: w.mon, gimmick: w.entry.gimmick }, terrain });
	} else {
		routeMsg = 'Buscas un rato, pero no encuentras nada.';
	}
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
		G.flags[key] = true;
		await runScript(e.script);
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
	if (G.party.length < 6) G.party.push(p);
	else {
		const bi = G.boxes.findIndex(b => b.length < 30);
		(G.boxes[bi >= 0 ? bi : 0]).push(p);
		await say(null, `Tu equipo está lleno. **${displayName(p)}** se ha enviado a la Caja ${bi + 1} del PC.`);
	}
}

// =================== Mapa ===================
function openMap() {
	const here = topLoc(G.loc);
	const region = here?.region || Object.keys(C.regions)[0];
	const R = C.regions[region] || { name: region };
	const nodes = Object.values(C.locations).filter(l => l.region === region && l.map && !l.parent);
	const W = 100, H = R.h || 130;
	const known = id => G.visited[id] || (L(id)?.links || []).some(n => G.visited[n]);
	let sel = here?.id;
	const sheet = openSheet('Mapa de ' + (R.name || region), null);
	const draw = () => {
		const svgNS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(svgNS, 'svg');
		svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
		const el = (t, a) => { const e = document.createElementNS(svgNS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
		svg.append(el('rect', { x: 0, y: 0, width: W, height: H, fill: R.sea || '#24477a' }));
		if (R.land) svg.append(el('path', { d: R.land, fill: '#5d8f5a', stroke: '#e9dfc0', 'stroke-width': .6 }));
		// líneas
		const drawn = new Set();
		for (const n of nodes) for (const m of n.links || []) {
			const o = L(m);
			if (!o?.map || o.region !== region) continue;
			const k = [n.id, m].sort().join('|');
			if (drawn.has(k)) continue;
			drawn.add(k);
			if (!known(n.id) && !known(m)) continue;
			svg.append(el('line', { x1: n.map.x, y1: n.map.y, x2: o.map.x, y2: o.map.y, stroke: (G.visited[n.id] && G.visited[m]) ? '#f3e6c4' : 'rgba(243,230,196,.35)', 'stroke-width': 1.4, 'stroke-dasharray': (G.visited[n.id] && G.visited[m]) ? '' : '2 2' }));
		}
		for (const n of nodes) {
			if (!known(n.id)) continue;
			const isR = isRoute(n);
			const vis = G.visited[n.id];
			const fill = n.id === here?.id ? '#f2b33d' : isR ? (G.cleared[n.id] ? '#8fb0ff' : vis ? '#4c7cf0' : '#3a4f80') : vis ? '#ffffff' : '#7d8aa8';
			const shape = isR ? el('circle', { cx: n.map.x, cy: n.map.y, r: 2.2, fill, stroke: '#17223b', 'stroke-width': .6 })
				: el('rect', { x: n.map.x - 3.4, y: n.map.y - 3.4, width: 6.8, height: 6.8, rx: n.kind === 'city' ? 1 : 3.4, fill, stroke: '#17223b', 'stroke-width': .8 });
			shape.style.cursor = 'pointer';
			const g = el('g', {});
			g.append(shape);
			if (!isR && vis) { const t = el('text', { x: n.map.x, y: n.map.y + 8.5, 'font-size': 3.6, 'text-anchor': 'middle', fill: '#f3e6c4', 'font-family': 'Pixelify, sans-serif' }); t.textContent = n.short || n.name.replace(/^(Ciudad|Pueblo) /, ''); g.append(t); }
			if (n.id === sel) g.append(el('circle', { cx: n.map.x, cy: n.map.y, r: 5.5, fill: 'none', stroke: '#f2b33d', 'stroke-width': .8 }));
			const hit = el('circle', { cx: n.map.x, cy: n.map.y, r: 6, fill: 'transparent' });
			hit.addEventListener('click', () => { sel = n.id; draw(); });
			g.append(hit);
			svg.append(g);
		}
		const info = h('div', { class: 'mapinfo' });
		const s = L(sel);
		if (s) {
			info.append(h('h3', {}, s.name));
			const status = isRoute(s) ? (G.cleared[s.id] ? 'Despejada' : G.visited[s.id] ? 'Explorando' : 'Sin explorar') : (G.visited[s.id] ? 'Visitado' : 'Sin visitar');
			info.append(h('div', { style: { color: 'var(--muted)', fontSize: '14px', marginBottom: '8px' } }, status + (s.mapNote ? ' · ' + tx(s.mapNote) : '')));
			if (s.id !== here?.id) {
				const start = G.route ? G.loc : here.id;
				const path = findPath(start, s.id);
				if (path) {
					const btn = h('button', { class: 'btn primary', style: { width: '100%' }, onclick: async () => {
						const ce = canEnter(s.id);
						if (!ce.ok) { toast(tx(ce.msg)); return; }
						sheet.close();
						await guarded(async () => {
							const prev = path.length >= 2 ? path[path.length - 2] : start;
							await enterLocation(s.id, { from: prev });
						});
					} }, path.length > 2 ? 'Viajar (camino conocido)' : 'Ir');
					info.append(btn);
				} else info.append(h('div', { class: 'note' }, 'Aún no conoces un camino seguro hasta aquí.'));
			}
		}
		sheet.set([h('div', { class: 'mapwrap' }, svg), info]);
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
			h('div', { class: 'name' }, displayName(p), p.gender === 'M' ? '♂' : p.gender === 'F' ? '♀' : '', h('span', { class: 'lv' }, 'Nv.' + p.lv),
				p.status ? h('span', { class: 'status ' + p.status }, STATUS_ES[p.status]) : null, p.hp <= 0 ? h('span', { class: 'status fnt' }, 'DEB') : null,
				p.item ? h('span', { title: itemName(p.item) }, '✦') : null),
			h('div', { class: 'hpbar' }, h('i', { class: r > .5 ? '' : r > .2 ? 'mid' : 'low', style: { width: (r * 100) + '%' } })),
			h('div', { class: 'hptext' }, h('span', { class: 'typechip-row' }, ...s.types.map(t => h('span', { class: 'type', style: { background: TYPE_COLORS[t] } }, typeName(t)))), h('span', {}, `${p.hp}/${mhp}`))));
}

function openParty() {
	const sheet = openSheet('Equipo', null);
	const draw = () => {
		const list = h('div', { class: 'list' });
		G.party.forEach((p, i) => list.append(monRow(p, () => openSummary(p, draw))));
		if (!G.party.length) list.append(h('div', { class: 'empty' }, 'Todavía no tienes Pokémon.'));
		sheet.set([list, h('div', { class: 'note' }, 'Toca un Pokémon para ver sus datos, cambiar su orden, darle objetos o ponerle mote.')]);
	};
	draw();
}

function happyText(v) {
	return v >= 255 ? 'Te adora. Está totalmente unido a ti.' : v >= 200 ? 'Te tiene muchísimo cariño.' : v >= 150 ? 'Le caes muy bien.' : v >= 100 ? 'Está a gusto contigo.' : v >= 50 ? 'Todavía no te conoce mucho.' : 'No parece muy contento.';
}

export function openSummary(p, onChange, live = null) {
	// live: datos del combate en curso ({battle, hp, maxhp, status}); oculta las acciones que cambiarían el equipo
	const s = D.species[p.sp];
	const sheet = openSheet(displayName(p), null);
	let tab = 'info';
	const draw = () => {
		const st = calcStats(p);
		const head = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 16px' } },
			h('div', { class: 'sprite', style: { width: '110px', height: '110px', display: 'grid', placeItems: 'center' } }, monImg(p.sp, { shiny: p.shiny })),
			h('div', {},
				h('div', { style: { fontWeight: 900, fontSize: '19px' } }, displayName(p), ' ', p.gender === 'M' ? '♂' : p.gender === 'F' ? '♀' : '', p.shiny ? ' ✨' : ''),
				h('div', { style: { color: 'var(--muted)' } }, `${s.name} · Nv. ${p.lv}`),
				h('div', { class: 'typechip-row', style: { marginTop: '6px' } }, ...s.types.map(t => h('span', { class: 'type', style: { background: TYPE_COLORS[t] } }, typeName(t)))),
				h('div', { class: 'hpbar', style: { width: '160px' } }, h('i', { style: { width: ((live ? live.hp / live.maxhp : p.hp / st.hp) * 100) + '%' } })),
				h('div', { style: { fontSize: '13px', color: 'var(--muted)' } }, live ? `${live.hp}/${live.maxhp} PS` : `${p.hp}/${st.hp} PS`)));
		const tabs = h('div', { class: 'tabs' }, ...[['info', 'Datos'], ['stats', 'Stats'], ['moves', 'Movimientos'], live?.battle ? null : ['actions', 'Acciones']].filter(Boolean).map(([k, n]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, n)));
		let body;
		if (tab === 'info') {
			body = h('dl', { class: 'kv' },
				h('dt', {}, 'Especie'), h('dd', {}, `${s.name} (Nº ${s.num})`),
				h('dt', {}, 'Habilidad'), h('dd', {}, abilityName(p.abil)),
				h('dt', {}, ''), h('dd', { style: { fontWeight: 400, color: 'var(--muted)' } }, D.abilities[p.abil]?.desc || ''),
				h('dt', {}, 'Naturaleza'), h('dd', {}, natureName(p.nat) + (D.natures[p.nat]?.plus ? ` (+${STAT_NAMES[D.natures[p.nat].plus]}, −${STAT_NAMES[D.natures[p.nat].minus]})` : '')),
				h('dt', {}, 'Objeto'), h('dd', {}, p.item ? itemName(p.item) : 'Ninguno'),
				h('dt', {}, 'Tera'), h('dd', {}, typeName(p.tera)),
				h('dt', {}, 'Experiencia'), h('dd', {}, h('div', { class: 'hpbar' }, h('i', { style: { width: (expProgress(p) * 100) + '%', background: 'var(--aura)' } }))),
				h('dt', {}, 'Amistad'), h('dd', { style: { fontWeight: 400 } }, happyText(p.happy)),
				h('dt', {}, 'Origen'), h('dd', { style: { fontWeight: 400 } }, `${L(p.metAt)?.name || 'Lugar desconocido'}, Nv. ${p.metLv}`),
				h('dt', {}, 'Ball'), h('dd', {}, itemName(p.ball)),
			);
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

async function giveItemTo(p, redraw) {
	if (p.item) {
		const i = await choose(`${displayName(p)} lleva ${itemName(p.item)}.`, ['Guardarlo en la mochila', 'Cambiarlo por otro', 'Cancelar']);
		if (i === 2) return;
		addItem(p.item, 1);
		toast(`Has guardado ${itemName(p.item)}`);
		p.item = '';
		if (i === 0) { redraw(); return; }
	}
	const holdable = Object.keys(G.bag).filter(id => D.items[id] && D.items[id].pocket !== 'key' && !['pokeballs'].includes(D.items[id].pocket));
	if (!holdable.length) { toast('No tienes objetos para equipar'); redraw(); return; }
	const i = await choose('¿Qué objeto le das?', holdable.map(id => `${itemName(id)} ×${G.bag[id]}`).concat(['Cancelar']));
	if (i >= holdable.length) { redraw(); return; }
	removeItem(holdable[i]);
	p.item = holdable[i];
	toast(`${displayName(p)} lleva ${itemName(p.item)}`);
	redraw();
}

// =================== Mochila ===================
const USE_ON_MON = {
	potion: 20, superpotion: 60, hyperpotion: 120, maxpotion: 9999, fullrestore: 9999, freshwater: 30, sodapop: 50, lemonade: 70, moomoomilk: 100,
	berryjuice: 20, energypowder: 60, energyroot: 120, oranberry: 10, sitrusberry: 0.25,
};
const CURES = { antidote: ['psn', 'tox'], paralyzeheal: ['par'], burnheal: ['brn'], iceheal: ['frz'], awakening: ['slp'], fullheal: 'all', healpowder: 'all', fullrestore: 'all', lavacookie: 'all', lumiosegalette: 'all', shalourable: 'all', pechaberry: ['psn', 'tox'], cheriberry: ['par'], rawstberry: ['brn'], aspearberry: ['frz'], chestoberry: ['slp'], lumberry: 'all' };
const REVIVES = { revive: 0.5, maxrevive: 1, revivalherb: 1 };
const VITAMINS = { hpup: 0, protein: 1, iron: 2, calcium: 3, zinc: 4, carbos: 5 };
const REPELS = { repel: 100, superrepel: 200, maxrepel: 250 };

export function openBag(onPick) {
	let pocket = 'medicine';
	const sheet = openSheet('Mochila', null);
	const draw = () => {
		const tabs = h('div', { class: 'tabs' }, ...POCKETS.map(([k, n]) => h('button', { class: pocket === k ? 'on' : '', onclick: () => { pocket = k; draw(); } }, n)));
		const ids = Object.keys(G.bag).filter(id => G.bag[id] > 0 && (D.items[id]?.pocket || 'misc') === pocket).sort((a, b) => itemName(a).localeCompare(itemName(b)));
		const list = h('div', { class: 'list' });
		for (const id of ids) {
			const it = D.items[id] || {};
			list.append(h('button', { class: 'row', onclick: () => itemMenu(id, draw) }, h('div', { class: 'lbl' }, h('div', { class: 't' }, it.name || id), h('div', { class: 's' }, it.desc || '')), h('b', {}, pocket === 'key' ? '' : '×' + G.bag[id])));
		}
		if (!ids.length) list.append(h('div', { class: 'empty' }, 'No hay nada en este bolsillo.'));
		sheet.set([tabs, list, h('div', { class: 'note' }, `Dinero: ${fmtMoney(G.player.money)}`)]);
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
	const usable = USE_ON_MON[id] !== undefined || CURES[id] || REVIVES[id] || VITAMINS[id] !== undefined || id === 'rarecandy' || it.cat === 'evolution' || REPELS[id] || id === 'ppup' || id === 'ppmax' || id === 'ether' || id === 'elixir' || id === 'maxether' || id === 'maxelixir' || it.use;
	const opts = [];
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
	if (it.use) { if (removeItem(id, it.consumable === false ? 0 : 1) || it.consumable === false) await runScript(it.use); return; }
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
	return new Promise(resolve => {
		let mode = 'buy';
		const sheet = openSheet(shop.name || 'Tienda', null, { onClose: resolve });
		const draw = () => {
			const tabs = h('div', { class: 'tabs' }, h('button', { class: mode === 'buy' ? 'on' : '', onclick: () => { mode = 'buy'; draw(); } }, 'Comprar'), h('button', { class: mode === 'sell' ? 'on' : '', onclick: () => { mode = 'sell'; draw(); } }, 'Vender'));
			const list = h('div', { class: 'list' });
			if (mode === 'buy') {
				for (const e of shop.items) {
					const o = typeof e === 'string' ? { id: e } : e;
					if (o.cond !== undefined && !evalCond(o.cond)) continue;
					const it = D.items[toID(o.id)] || {};
					const price = o.price ?? it.cost ?? 100;
					list.append(h('button', { class: 'row', onclick: async () => {
						const q = await choose(`${it.name} · ${fmtMoney(price)}\n${it.desc || ''}\nTienes: ${count(o.id)}. Dinero: ${fmtMoney(G.player.money)}`, ['×1', '×5', '×10', 'Cancelar']);
						const n = [1, 5, 10][q];
						if (!n) return;
						if (G.player.money < price * n) { toast('No tienes suficiente dinero'); return; }
						G.player.money -= price * n;
						addItem(o.id, n);
						if (toID(o.id) === 'pokeball' && n >= 10) { addItem('premierball', 1); toast('¡De regalo, una Honor Ball!'); }
						toast(`Has comprado ${it.name} ×${n}`);
						draw();
					} }, h('div', { class: 'lbl' }, h('div', { class: 't' }, it.name || o.id), h('div', { class: 's' }, it.desc || '')), h('b', { style: { color: 'var(--gold)' } }, fmtMoney(price))));
				}
			} else {
				for (const id2 of Object.keys(G.bag).filter(k => D.items[k] && D.items[k].pocket !== 'key' && D.items[k].cost > 0)) {
					const it = D.items[id2];
					const price = Math.floor(it.cost / 2);
					list.append(h('button', { class: 'row', onclick: async () => {
						const q = await choose(`Vender ${it.name} a ${fmtMoney(price)} cada uno (tienes ${G.bag[id2]}).`, ['×1', 'Todos', 'Cancelar']);
						const n = q === 0 ? 1 : q === 1 ? G.bag[id2] : 0;
						if (!n) return;
						removeItem(id2, n); G.player.money += price * n;
						toast(`Has vendido ${it.name} ×${n}`); draw();
					} }, h('div', { class: 'lbl' }, h('div', { class: 't' }, it.name), h('div', { class: 's' }, '×' + G.bag[id2])), h('b', { style: { color: 'var(--gold)' } }, fmtMoney(price))));
				}
				if (!list.children.length) list.append(h('div', { class: 'empty' }, 'No tienes nada que vender.'));
			}
			sheet.set([tabs, h('div', { class: 'note' }, `Dinero: ${fmtMoney(G.player.money)}`), list]);
		};
		draw();
	});
}

// =================== PC ===================
async function openPC() {
	return new Promise(resolve => {
		let box = 0;
		const sheet = openSheet('PC de almacenamiento', null, { onClose: resolve });
		const draw = () => {
			const party = h('div', { class: 'list' }, ...G.party.map(p => monRow(p, async () => {
				if (G.party.length <= 1) { toast('Necesitas al menos un Pokémon en el equipo'); return; }
				if (await confirm(`¿Dejar a ${displayName(p)} en la Caja ${box + 1}?`, 'Depositar', 'Cancelar')) {
					if (G.boxes[box].length >= 30) { toast('Esa caja está llena'); return; }
					G.party.splice(G.party.indexOf(p), 1); healFull(p); G.boxes[box].push(p); draw();
				}
			})));
			const boxTabs = h('div', { class: 'tabs' }, ...G.boxes.map((b, i) => h('button', { class: box === i ? 'on' : '', onclick: () => { box = i; draw(); } }, `Caja ${i + 1} (${b.length})`)));
			const inBox = h('div', { class: 'list' }, ...G.boxes[box].map(p => monRow(p, async () => {
				const i = await choose(displayName(p), ['Sacar al equipo', 'Ver datos', 'Cancelar']);
				if (i === 0) { if (G.party.length >= 6) { toast('Tu equipo está lleno'); return; } G.boxes[box].splice(G.boxes[box].indexOf(p), 1); G.party.push(p); draw(); }
				if (i === 1) openSummary(p, draw);
			})));
			if (!G.boxes[box].length) inBox.append(h('div', { class: 'empty' }, 'Caja vacía.'));
			sheet.set([h('div', { class: 'section-title' }, 'Tu equipo'), party, h('div', { class: 'section-title' }, 'Cajas'), boxTabs, inBox]);
		};
		draw();
	});
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
			for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun']) if (Array.isArray(c[k])) scan(c[k], set, depth);
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
		for (const sc of scripts) for (const q of touch[sc] || []) {
			const arr = (out[q] ||= []);
			const txt = spot.label ? `${where} · ${spot.label}` : where;
			if (!arr.includes(txt)) arr.push(txt);
		}
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

function openDiary(startTab = 'active') {
	let tab = startTab;
	const sheet = openSheet('Diario', null);
	const TYPES = [['main', '⭐', 'Historia principal'], ['thread', '🧵', 'Historias de personajes'], ['side', '📜', 'Secundarias'], ['event', '🎉', 'Eventos']];
	const draw = () => {
		const places = questPlaces();
		const active = Object.entries(G.quests).filter(([id, q]) => C.quests[id] && !q.done);
		const done = Object.entries(G.quests).filter(([id, q]) => C.quests[id] && q.done);
		const avail = Object.keys(places).filter(id => C.quests[id] && !G.quests[id]).map(id => [id, null]);
		const counts = { active: active.length, avail: avail.length, done: done.length };
		const tabs = h('div', { class: 'tabs' }, ...[['active', 'Activas'], ['avail', 'Nuevas'], ['done', 'Hechas'], ['diary', 'Rotom']].map(([k, n]) =>
			h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, n, counts[k] ? h('span', { class: 'tabcount' }, String(counts[k])) : null)));
		const body = h('div', {});
		if (tab === 'diary') {
			if (!G.diary.length) body.append(h('div', { class: 'empty' }, 'Rotom todavía no ha escrito nada.'));
			for (const e of G.diary.slice().reverse()) {
				const d = new Date(e.t);
				body.append(h('div', { class: 'diary-entry' }, h('div', { class: 'when' }, d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) + ' · ' + (L(e.loc)?.name || '')), h('div', { html: fmtText(e.text) })));
			}
		} else {
			const qs = tab === 'active' ? active : tab === 'avail' ? avail : done;
			if (tab === 'done') qs.sort((a, b) => (b[1].finished || 0) - (a[1].finished || 0));
			if (!qs.length) body.append(h('div', { class: 'empty' }, {
				active: 'No tienes misiones en curso. Mira en «Nuevas» o habla con la gente: siempre hay alguien que necesita ayuda.',
				avail: 'No hay misiones nuevas en los lugares que conoces. Explora y vuelve a hablar con la gente después de avanzar en la historia.',
				done: 'Aún no has completado misiones.',
			}[tab]));
			for (const [type, icon, title] of TYPES) {
				const group = qs.filter(([id]) => (C.quests[id].type || 'side') === type);
				if (!group.length) continue;
				body.append(h('div', { class: 'section-title' }, `${icon} ${title}`));
				const list = h('div', { class: 'list' });
				for (const [id, q] of group) {
					const def = C.quests[id];
					const where = (places[id] || []).slice(0, 2);
					const lines = [];
					if (tab === 'active') lines.push(h('div', { class: 's', html: fmtText(tx(def.stages?.[q.stage] || '')) }));
					if (tab === 'done') lines.push(h('div', { class: 's' }, '✔ Completada' + (q.finished ? ' el ' + new Date(q.finished).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : '')));
					if (tab === 'avail') lines.push(h('div', { class: 's' }, (places[id] || []).some(w => w.startsWith('Al llegar')) ? 'Empieza cuando llegues al lugar.' : 'Habla con quien la ofrece para empezarla.'));
					if (tab !== 'done') for (const w of where) lines.push(h('div', { class: 'qwhere' }, '📍 ' + w));
					list.append(h('div', { class: 'row quest' + (type === 'main' && tab === 'active' ? ' hl' : '') + (tab === 'done' ? ' doneq' : '') },
						h('div', { class: 'ico' }, icon), h('div', { class: 'lbl' }, h('div', { class: 't' }, def.name), ...lines)));
				}
				body.append(list);
			}
		}
		sheet.set([tabs, body]);
	};
	draw();
}

// =================== Más ===================
function openMore() {
	const sheet = openSheet('Menú', null);
	const row = (ico, t, s, f) => h('button', { class: 'row', onclick: f }, h('div', { class: 'ico' }, ico), h('div', { class: 'lbl' }, h('div', { class: 't' }, t), s ? h('div', { class: 's' }, s) : null));
	const caught = Object.keys(G.dex.caught).length, seen = Object.keys(G.dex.seen).length;
	sheet.set(h('div', { class: 'list' },
		row('📕', 'Pokédex', `Vistos ${seen} · Capturados ${caught}`, openDex),
		row('📍', 'Guía de zona', 'Qué Pokémon hay por aquí', openZoneGuide),
		row('🏅', 'Retos', 'Líderes y combates importantes', openChallenges),
		row('📁', 'Expediente', 'Rivales y enemigos que conoces', openIntel),
		row('🎖️', 'Medallas', `${G.player.badges.length} medallas`, openBadges),
		row('💾', 'Guardar', G.lastSave ? 'Último guardado: ' + new Date(G.lastSave).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '', async () => { await saveGame(); toast('Partida guardada'); }),
		row('⚙️', 'Ajustes', 'Texto, Repartir Exp., sprites y respaldos', openSettings),
		row('📤', 'Exportar continuación', 'Resumen de tu partida para Claude', exportContinuation),
	));
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
		h('div', { class: 'pad' }, h('div', { class: 'typechip-row' }, ...s.types.map(t => h('span', { class: 'type', style: { background: TYPE_COLORS[t] } }, typeName(t)))), h('div', { style: { color: 'var(--muted)', marginTop: '6px' } }, s.genus || '')),
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
		for (const e of all) {
			if (seenSp.has(e.sp)) continue;
			seenSp.add(e.sp);
			const s = D.species[e.sp];
			const seen = G.dex.seen[s.num];
			const now = tbl.includes(e);
			list.append(h('div', { class: 'mon' + (now ? '' : ' fainted') },
				h('div', { class: 'sprite' }, seen ? monImg(e.sp, { anim: false }) : h('div', { style: { fontSize: '26px' } }, '❔')),
				h('div', { class: 'info' }, h('div', { class: 'name' }, seen ? s.name : '???', G.dex.caught[s.num] ? '◓' : '', e.displaced ? h('span', { class: 'status', style: { background: '#7a5cd6' } }, 'DESPLAZADO') : null),
					h('div', { class: 'hptext' }, h('span', {}, (e.time === 'night' ? '🌙 Noche · ' : e.time === 'day' ? '☀️ Día · ' : '') + (e.w >= 30 ? 'Común' : e.w >= 10 ? 'Poco común' : 'Raro')), h('span', {}, `Nv. ${Array.isArray(e.lv) ? e.lv.join('–') : e.lv}`)))));
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
				c.type ? h('div', { class: 'typechip-row', style: { margin: '4px 0' } }, h('span', { class: 'type', style: { background: TYPE_COLORS[c.type] } }, typeName(c.type))) : null,
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
async function showPaceNotice(m) {
	if (busy) return;
	G.notices[m.flag] = Date.now();
	busy = true;
	try {
		await say({ name: 'Rotom', look: { hair: 'spiky', hairColor: '#e07a3a', skin: '#f6f0e6', eyes: '#4c7cf0', outfit: '#e07a3a', outfit2: '#4c7cf0', eyesStyle: 'happy', mouth: 'grin' } },
			tx(m.text || `¡Bzzt! Aviso de ritmo: te quedan unas **${m.hoursLeft} horas** de historia publicada. Ve pidiéndole a Claude que escriba el siguiente bloque mientras llegas al final de este. (Si tu juego se actualiza solo cada noche, puede que ya esté en camino.)`));
	} finally { busy = false; }
	await saveGame();
}
