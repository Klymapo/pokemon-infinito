// Tutor de movimientos (pedido de Mario, 2026-10-06).
// · Por Pokémon: ver sus movimientos, olvidar, subir al primer lugar, recordar los que ya pudo
//   aprender por nivel (también los de sus preevoluciones, para que evolucionar con piedra no
//   haga perder nada), enseñar con las MT que tienes y ver qué aprenderá más adelante.
// · Dónde conseguir: piedras, objetos de evolución y MT, con las tiendas y sitios que ya conoces.
// · Buscador: qué Pokémon tuyos tienen, pueden recordar, aprenderán o pueden aprender con MT
//   un movimiento, y qué otros Pokémon de tu Pokédex lo aprenden por nivel.
import { D, toID, typeStyle, typeName } from '../data.js';
import { G, saveGame } from '../state.js';
import { displayName, canLearn } from '../pokemon.js';
import { recallable, upcoming, ownedTMs, owned, moveReport, evolutionInfo, sourcesText, shopGuide } from '../movimientos.js';
import { monImg } from '../art.js';
import { h, say, choose, openSheet, toast } from './core.js';
import { learnMoveUI } from './battle-ui.js';

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const catName = c => c === 'Physical' ? 'Físico' : c === 'Special' ? 'Especial' : 'Estado';
const mvName = id => D.moves[id]?.name || id;

function moveMeta(id, { pp = true } = {}) {
	const md = D.moves[id] || {};
	return [catName(md.cat), md.bp ? 'Pot. ' + md.bp : null, md.acc && md.acc !== true ? 'Prec. ' + md.acc : null, pp && md.pp ? 'PP ' + md.pp : null].filter(Boolean).join(' · ');
}

function moveRow(id, sub, onclick) {
	const md = D.moves[id] || {};
	return h(onclick ? 'button' : 'div', { class: 'row tut-move', onclick },
		h('span', { class: 'type tut-type', style: typeStyle(md.type) }, typeName(md.type)),
		h('div', { class: 'lbl' }, h('div', { class: 't' }, md.name || id), h('div', { class: 's' }, sub || moveMeta(id))));
}

function monLine(p, sub, onclick) {
	return h(onclick ? 'button' : 'div', { class: 'row', onclick },
		h('div', { class: 'ico tut-mon' }, monImg(p.sp, { anim: false, shiny: p.shiny })),
		h('div', { class: 'lbl' }, h('div', { class: 't' }, `${displayName(p)} · Nv. ${p.lv}`), sub ? h('div', { class: 's' }, sub) : null));
}

const section = t => h('div', { class: 'section-title' }, t);
const lvText = lv => lv === 0 ? 'Al evolucionar' : lv <= 1 ? 'Desde el principio' : `Nv. ${lv}`;

function infoRow(icon, title, sub, extra) {
	return h('div', { class: 'row tut-info' }, icon, h('div', { class: 'lbl' }, h('div', { class: 't' }, title), sub ? h('div', { class: 's' }, sub) : null, extra ? h('div', { class: 's tut-where' }, extra) : null));
}

// =================== Pantalla principal ===================
export function openTutor(p = null, onChange = null) {
	if (p) return openTutorMon(p, onChange);
	const sheet = openSheet('Tutor de movimientos', null);
	let tab = 'mons', query = '';
	let input = null;
	const draw = () => {
		const tabs = h('div', { class: 'tabs' }, ...[['mons', 'Mis Pokémon'], ['search', 'Buscar'], ['where', 'Dónde conseguir']].map(([k, n]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, n)));
		if (tab === 'mons') {
			const xs = owned();
			const list = h('div', { class: 'list' }, ...xs.map(({ p, where }) => {
				const r = recallable(p).length;
				return monLine(p, `${where} · ${r ? r + (r === 1 ? ' movimiento para recordar' : ' movimientos para recordar') : 'Nada que recordar'}`, () => openTutorMon(p, () => { onChange?.(); draw(); }));
			}));
			sheet.set([tabs, h('div', { class: 'note' }, 'Elige un Pokémon para recordarle movimientos que ya pudo aprender, olvidar alguno o enseñarle con tus MT. Es gratis.'), xs.length ? list : h('div', { class: 'empty' }, 'Todavía no tienes Pokémon.')]);
		} else if (tab === 'where') {
			const G2 = shopGuide();
			const stoneRow = x => infoRow(h('div', { class: 'ico' }, '🪨'), x.name + (x.have ? ` · tienes ${x.have}` : ''), null, x.text);
			const tmRow = x => infoRow(h('span', { class: 'type tut-type', style: typeStyle(D.moves[x.tm]?.type) }, typeName(D.moves[x.tm]?.type)), `${x.name}${x.have ? ' ✔' : ''}`, `${D.moves[x.tm]?.name || x.tm} · ${moveMeta(x.tm)}`, x.text);
			sheet.set([tabs,
				h('div', { class: 'note' }, 'Solo salen las tiendas y los sitios que ya conoces. Cuando descubras más, aparecerán aquí.'),
				section(`Piedras y objetos de evolución (${G2.stones.length})`),
				G2.stones.length ? h('div', { class: 'list' }, ...G2.stones.map(stoneRow)) : h('div', { class: 'empty' }, 'Aún no conoces dónde conseguir ninguno.'),
				section(`Máquinas técnicas (${G2.tms.length})`),
				G2.tms.length ? h('div', { class: 'list' }, ...G2.tms.map(tmRow)) : h('div', { class: 'empty' }, 'Aún no conoces dónde conseguir ninguna MT.'),
			]);
		} else {
			input = h('input', { class: 'field-input tut-search', value: query, placeholder: 'Nombre del movimiento (p. ej. Falso Tortazo)', autocomplete: 'off', enterkeyhint: 'search', 'aria-label': 'Buscar movimiento' });
			const results = h('div', { class: 'list' });
			const fill = () => {
				results.innerHTML = '';
				const q = norm(query);
				if (q.length < 2) { results.append(h('div', { class: 'empty' }, 'Escribe al menos dos letras.')); return; }
				const ids = Object.keys(D.moves).filter(id => norm(D.moves[id].name).includes(q) || norm(D.moves[id].nameEn).includes(q))
					.sort((a, b) => (norm(D.moves[a].name).startsWith(q) ? 0 : 1) - (norm(D.moves[b].name).startsWith(q) ? 0 : 1) || mvName(a).localeCompare(mvName(b))).slice(0, 25);
				if (!ids.length) { results.append(h('div', { class: 'empty' }, 'Ningún movimiento se llama así.')); return; }
				for (const id of ids) results.append(moveRow(id, null, () => openMoveSearch(id)));
			};
			input.addEventListener('input', () => { query = input.value; fill(); });
			fill();
			sheet.set([tabs, input, results]);
			setTimeout(() => input.focus(), 50);
		}
	};
	draw();
	return sheet;
}

// =================== Un Pokémon ===================
export function openTutorMon(p, onChange = null) {
	const sheet = openSheet('Tutor · ' + displayName(p), null, { onClose: () => onChange?.() });
	const draw = () => {
		const tms = ownedTMs();
		const rec = recallable(p);
		const tmMoves = Object.keys(tms).filter(m => !p.moves.some(x => x.id === m) && canLearn(p.sp, m) && D.moves[m]).sort((a, b) => mvName(a).localeCompare(mvName(b)));
		const next = upcoming(p);
		const evos = evolutionInfo(p.sp);
		const fromName = sp => D.species[sp]?.name || sp;
		const recSub = r => lvText(r.lv) + (r.from ? ` · como ${fromName(r.from)}` : '') + ' · ' + moveMeta(r.id);
		sheet.set([
			monLine(p, `${D.species[p.sp]?.name} · ${p.moves.length}/4 movimientos`),
			section('Movimientos actuales'),
			h('div', { class: 'list' }, ...p.moves.map((m, i) => moveRow(m.id, `PP ${m.pp}/${D.moves[m.id]?.pp ?? m.pp} · ${moveMeta(m.id, { pp: false })}`, () => currentMove(p, i, draw)))),
			section(`Puede recordar (${rec.length})`),
			rec.length ? h('div', { class: 'list' }, ...rec.map(r => moveRow(r.id, recSub(r), () => teach(p, r.id, draw)))) : h('div', { class: 'empty' }, 'No hay movimientos que recordar ahora mismo.'),
			tmMoves.length ? section(`Con tus MT (${tmMoves.length})`) : null,
			tmMoves.length ? h('div', { class: 'list' }, ...tmMoves.map(m => moveRow(m, `${D.items[tms[m]]?.name || 'MT'} · ${moveMeta(m)}`, () => teach(p, m, draw)))) : null,
			next.length ? section('Aprenderá más adelante') : null,
			next.length ? h('div', { class: 'list' }, ...next.map(n => moveRow(n.id, `Nv. ${n.lv} · ${moveMeta(n.id)}`))) : null,
			evos.length ? section('Cómo evoluciona') : null,
			evos.length ? h('div', { class: 'list' }, ...evos.map(e => infoRow(h('div', { class: 'ico tut-mon' }, monImg(e.to, { anim: false })), e.name, e.how, e.where))) : null,
			h('div', { class: 'note' }, 'Recordar es gratis y no tiene límite. Las MT no se gastan.'),
		]);
	};
	draw();
	return sheet;
}

async function currentMove(p, i, redraw) {
	const m = p.moves[i];
	const md = D.moves[m.id] || {};
	const opts = [i > 0 ? 'Subir al primer lugar' : null, p.moves.length > 1 ? 'Olvidar' : null, 'Cancelar'].filter(Boolean);
	const k = await choose(`**${md.name}** (${typeName(md.type)} · ${moveMeta(m.id)})\n${md.desc || ''}`, opts);
	const pick = opts[k];
	if (pick === 'Subir al primer lugar') { p.moves.splice(i, 1); p.moves.unshift(m); }
	else if (pick === 'Olvidar') {
		const ok = await choose(`¿Seguro que ${displayName(p)} olvida **${md.name}**? Podrás recordarlo aquí si lo aprendió por nivel.`, ['Sí, olvidarlo', 'No']);
		if (ok === 0) { p.moves.splice(i, 1); toast(`${displayName(p)} ha olvidado ${md.name}`); }
	}
	await saveGame();
	redraw();
}

async function teach(p, moveId, redraw) {
	await learnMoveUI(p, moveId);
	await saveGame();
	redraw();
}

// =================== Buscador ===================
function openMoveSearch(moveId) {
	const md = D.moves[moveId] || {};
	const sheet = openSheet(md.name || moveId, null);
	const draw = () => {
		const R = moveReport(moveId);
		const blocks = [
			moveRow(moveId, moveMeta(moveId)),
			md.desc ? h('div', { class: 'note' }, md.desc) : null,
		];
		const add = (title, rows) => { if (rows.length) blocks.push(section(title), h('div', { class: 'list' }, ...rows)); };
		// Cómo se aprende
		blocks.push(section('Cómo se aprende'), h('div', { class: 'list' },
			infoRow(h('div', { class: 'ico' }, '📈'), 'Por nivel', 'Los Pokémon que lo aprenden por nivel pueden recordarlo aquí, gratis, en cuanto llegan a ese nivel.'),
			R.tmItem ? infoRow(h('div', { class: 'ico' }, '💿'), `${D.items[R.tmItem]?.name || 'MT'}${R.haveTM ? ' · la tienes ✔' : ''}`, R.haveTM ? 'No se gasta: enséñasela a quien quieras.' : 'Para los que lo aprenden con MT.', R.haveTM ? null : sourcesText(R.tmItem))
				: infoRow(h('div', { class: 'ico' }, '💿'), 'Sin MT por ahora', 'Todavía no hay MT de este movimiento en el juego.')));
		add(`Lo tienen (${R.has.length})`, R.has.map(o => monLine(o.p, o.where, () => openTutorMon(o.p, draw))));
		add(`Pueden recordarlo ya (${R.recall.length})`, R.recall.map(o => monLine(o.p, `${o.where} · ${lvText(o.r.lv)}${o.r.from ? ' como ' + (D.species[o.r.from]?.name || o.r.from) : ''} · toca para enseñárselo`, async () => { await learnMoveUI(o.p, moveId); await saveGame(); draw(); })));
		add(`Lo aprenderán (${R.later.length})`, R.later.map(o => monLine(o.p, `${o.where} · al Nv. ${o.lv}`)));
		add(`Con MT (${R.viaTM.length})`, R.viaTM.map(o => monLine(o.p, `${o.where} · ${o.haveTM ? 'tienes la MT: toca para enseñárselo' : 'necesita la MT, aún no la tienes'}`, o.haveTM ? async () => { await learnMoveUI(o.p, moveId); await saveGame(); draw(); } : null)));
		if (R.dex.length) blocks.push(section('Otros de tu Pokédex que lo aprenden por nivel'), h('div', { class: 'list' }, ...R.dex.slice(0, 30).map(x => h('div', { class: 'row' },
			h('div', { class: 'ico tut-mon' }, monImg(x.sp, { anim: false })),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, D.species[x.sp]?.name || x.sp), h('div', { class: 's' }, lvText(x.lv)))))));
		if (!R.has.length && !R.recall.length && !R.later.length && !R.viaTM.length) blocks.push(h('div', { class: 'empty' }, 'Ninguno de tus Pokémon puede aprenderlo por nivel ni con MT por ahora.'));
		sheet.set(blocks);
	};
	draw();
	return sheet;
}
