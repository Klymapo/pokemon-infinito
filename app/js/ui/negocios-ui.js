// Pantallas de Negocios (administración de recursos). La lógica está en ../negocios.js.
import { D, toID, typeName, typeStyle, itemName } from '../data.js';
import { C, topLoc } from '../content.js';
import { G, saveGame } from '../state.js';
import { displayName } from '../pokemon.js';
import { runScript, tx } from '../guion.js';
import { monImg, itemImg } from '../art.js';
import { h, say, choose, toast, openSheet, portraitFor } from './core.js';
import { fmtMoney, fmtText } from '../util.js';
import {
	ventureDef, ventureState, ventureList, owned, linesOf, joinVenture, upgradesOf, managersOf, slotsOf, storeDays, sharePct,
	workerBonus, rates, pending, collect, shiftEffort, buyUpgrade, setManager, assignWorker, recallWorker, rollEvent, eventOptions, resolveEvent, tick,
} from '../negocios.js';

let hooks = {}; // { travel(locId), summary(p, onChange) } — los pone screens.js
export function setVentureHooks(hk) { hooks = hk; }

const npcOf = id => (id && C.npcs[id] ? { id, ...C.npcs[id] } : null);
const perDay = n => n >= 1 ? (Math.round(n * 10) / 10).toLocaleString('es-MX') + ' al día' : n > 0 ? `1 cada ${Math.max(2, Math.round(1 / n))} días` : '—';
const pctTxt = m => (m >= 1 ? '+' : '−') + Math.abs(Math.round((m - 1) * 100)) + ' %';
const section = t => h('div', { class: 'section-title' }, t);

/** Lista de negocios: los tuyos y las oportunidades. */
export function openVentures() {
	const sheet = openSheet('Negocios', null);
	sheet.el.dataset.menu = 'negocios';
	const draw = () => {
		const list = ventureList();
		const mine = list.filter(v => v.status === 'owned'), offers = list.filter(v => v.status === 'offer');
		const body = [h('div', { class: 'neg-wallet' }, h('span', {}, 'Tu dinero'), h('b', {}, fmtMoney(G.player.money)))];
		if (!list.length) body.push(h('div', { class: 'empty' }, 'Todavía no tienes negocios ni conoces a nadie que busque socio. Hay gente por el mundo con buenas ideas y poco dinero: cuando alguien te proponga algo, saldrá aquí.'));
		if (mine.length) {
			let total = 0;
			const rows = mine.map(v => {
				const p = pending(v.id), r = rates(v.id);
				total += r.money;
				const nItems = Object.values(p.items).reduce((a, b) => a + b, 0);
				const alert = v.st.pending ? '❗ Hay un imprevisto que decidir' : p.full ? '📦 Almacén lleno: pasa a recoger' : null;
				return h('button', { class: 'row neg-row' + (alert ? ' hl' : ''), onclick: () => openVenture(v.id, draw) },
					h('div', { class: 'ico' }, v.def.icon || '🏠'),
					h('div', { class: 'lbl' },
						h('div', { class: 't' }, v.def.name),
						h('div', { class: 's' }, `Por recoger: ${fmtMoney(p.money)}${nItems ? ` y ${nItems} ${nItems === 1 ? 'objeto' : 'objetos'}` : ''}`),
						h('div', { class: 's' }, `Produce ${fmtMoney(r.money)} al día · tu parte ${r.pct} %`),
						alert ? h('div', { class: 's neg-alert' }, alert) : null),
					h('span', { class: 'chev' }, '›'));
			});
			body.push(section('Tus negocios'), h('div', { class: 'list' }, ...rows));
			body.push(h('div', { class: 'note' }, `Entre todos te dan unos ${fmtMoney(total)} al día, más lo que produzcan en objetos. Se acumula aunque no juegues, hasta que se llena el almacén de cada uno.`));
		}
		if (offers.length) {
			body.push(section('Oportunidades'), h('div', { class: 'list' }, ...offers.map(v => h('button', { class: 'row neg-row q-new', onclick: () => openVenture(v.id, draw) },
				h('div', { class: 'ico' }, v.def.icon || '🏠'),
				h('div', { class: 'lbl' }, h('div', { class: 't' }, v.def.name), h('div', { class: 's' }, tx(v.def.blurb || '')), h('div', { class: 's' }, `📍 ${placeName(v.def.loc)} · Entrada: ${v.def.buy?.cost ? fmtMoney(v.def.buy.cost) : 'sin costo'}`)),
				h('span', { class: 'mk new' }, '!')))));
		}
		sheet.set(body);
	};
	draw();
	return sheet;
}
const placeName = id => { const t = topLoc(id); const l = C.locations[id]; return l ? (t && t.id !== id ? `${t.name} › ${l.name}` : l.name) : ''; };

/** Ficha de un negocio. */
export function openVenture(id, onChange) {
	const def = ventureDef(id);
	if (!def) return Promise.resolve();
	return new Promise(resolve => {
		const sheet = openSheet(def.name, null, { onClose: () => { clearInterval(timer); saveGame(); onChange?.(); resolve(); } });
		sheet.el.dataset.menu = 'negocios';
		let showWhy = false, busy = false;
		const partner = npcOf(def.partner);
		const act = async fn => { if (busy) return; busy = true; try { await fn(); } finally { busy = false; if (sheet.el.isConnected) draw(); } };

		const head = () => h('div', { class: 'neg-head' },
			partner ? h('div', { class: 'neg-pic' }, portraitFor(partner)) : h('div', { class: 'neg-pic ico' }, def.icon || '🏠'),
			h('div', { class: 'neg-headtxt' },
				h('div', { class: 'neg-blurb' }, tx(def.blurb || '')),
				h('div', { class: 'neg-meta' }, `📍 ${placeName(def.loc)}`, partner ? ` · Lo lleva ${partner.name}` : '')));

		const drawOffer = () => {
			const cost = def.buy?.cost || 0, pct = sharePct(id);
			const lines = Object.values(def.lines || {}).filter(l => !l.locked);
			sheet.set([head(),
				def.buy?.text ? h('div', { class: 'neg-quote', html: fmtText(tx(def.buy.text)) }) : null,
				h('div', { class: 'neg-facts' },
					h('div', {}, h('span', {}, 'Entrada'), h('b', {}, cost ? fmtMoney(cost) : 'Sin costo')),
					h('div', {}, h('span', {}, 'Tu parte'), h('b', {}, pct + ' %')),
					h('div', {}, h('span', {}, 'Almacén'), h('b', {}, `${storeDays(id)} días`))),
				section('Qué produce'),
				h('div', { class: 'list' }, ...lines.map(l => h('div', { class: 'row' }, h('div', { class: 'ico' }, l.icon || '•'), h('div', { class: 'lbl' }, h('div', { class: 't' }, l.name), h('div', { class: 's' }, tx(l.desc || '')))))),
				h('div', { class: 'note' }, 'Como socio decides a qué se dedica más esfuerzo, compras mejoras, mandas Pokémon del PC a echar una mano y pasas a recoger tu parte. Produce en tiempo real, juegues o no.'),
				h('div', { class: 'pad' }, h('button', { class: 'btn primary', style: { width: '100%' }, disabled: G.player.money < cost, onclick: () => act(async () => {
					const r = joinVenture(id);
					if (!r.ok) { toast(r.msg); return; }
					toast(`🤝 Ahora eres soci${G.player.pron === 'ella' ? 'a' : G.player.pron === 'elle' ? 'e' : 'o'} de ${def.name}`, 'quest');
					await saveGame();
					if (def.buy?.script && C.scripts[def.buy.script]) await runScript(def.buy.script);
				}) }, G.player.money < cost ? `Te faltan ${fmtMoney(cost - G.player.money)}` : cost ? `Entrar como socio · ${fmtMoney(cost)}` : 'Entrar como socio')),
			]);
		};

		const runEvent = ev => act(async () => {
			const who = npcOf(ev.npc) || partner;
			await say(who, tx(ev.text));
			const opts = eventOptions(ev);
			while (true) {
				const i = await choose(ev.name ? `**${ev.name}**` : null, opts.map(o => tx(o.text) + (o.cost ? ` · ${fmtMoney(o.cost)}` : '')));
				const o = opts[i];
				const r = resolveEvent(id, ev, o);
				if (!r.ok) { toast(r.msg); continue; }
				if (o.result) await say(null, tx(o.result));
				break;
			}
			await saveGame();
		});

		const pickWorker = () => {
			const ps = openSheet('¿Quién echa una mano?', null);
			ps.el.dataset.menu = 'negocios';
			const cands = [];
			G.party.forEach((p, idx) => cands.push({ p, src: { where: 'party', idx }, where: 'Equipo' }));
			G.boxes.forEach((b, bi) => b.forEach((p, idx) => cands.push({ p, src: { where: 'box', box: bi, idx }, where: `Caja ${bi + 1}` })));
			cands.forEach(c => { c.b = workerBonus(id, c.p); });
			cands.sort((a, b) => b.b.v - a.b.v);
			const jobs = def.jobs || {};
			ps.set([
				h('div', { class: 'note' }, tx(jobs.text || 'Los Pokémon que trabajan aquí suben la producción y te toman cariño. Puedes traerlos de vuelta cuando quieras.') + (jobs.types?.length ? ` Rinden más los de tipo ${jobs.types.map(typeName).join(', ')}.` : '')),
				h('div', { class: 'list' }, ...cands.map(c => {
					const s = D.species[c.p.sp];
					const no = c.p.uid === G.vars.riolu_uid ? 'Tu compañero no se separa de ti' : c.src.where === 'party' && G.party.length <= 1 ? 'No puedes quedarte sin equipo' : null;
					return h('button', { class: 'row' + (no ? ' done' : ''), disabled: !!no, onclick: () => {
						// los índices pueden haber cambiado: se vuelve a buscar por uid
						const list = c.src.where === 'party' ? G.party : G.boxes[c.src.box];
						const idx = list.findIndex(x => x.uid === c.p.uid);
						const r = assignWorker(id, { ...c.src, idx });
						if (!r.ok) { toast(r.msg); return; }
						toast(`${displayName(c.p)} se queda a trabajar en ${def.name}`);
						ps.close(); draw();
					} },
						h('div', { class: 'ico tut-mon' }, monImg(c.p.sp, { anim: false, shiny: c.p.shiny })),
						h('div', { class: 'lbl' },
							h('div', { class: 't' }, `${displayName(c.p)} · Nv. ${c.p.lv}`),
							h('div', { class: 's' }, no || `${c.where} · ${s.types.map(typeName).join(' / ')}${c.b.fav ? ' · ⭐ se le da de maravilla' : c.b.typed ? ' · ✔ tipo ideal' : ''}`)),
						h('b', { class: 'neg-plus' }, `+${Math.round(c.b.v * 100)} %`));
				})),
			]);
		};

		const drawOwned = () => {
			const st = ventureState(id), p = pending(id), r = rates(id), lines = linesOf(id);
			const keys = Object.keys(lines);
			const body = [head()];
			const ev = rollEvent(id);
			if (ev) body.push(h('button', { class: 'neg-event', onclick: () => runEvent(ev) }, h('b', {}, `❗ ${ev.name || 'Imprevisto'}`), h('span', {}, 'Te están esperando para decidir. Toca para verlo.')));

			// Caja
			const its = Object.entries(p.items);
			const fillPct = Math.min(100, p.fill / p.cap * 100);
			body.push(h('div', { class: 'neg-bank' + (p.full ? ' full' : '') },
				h('div', { class: 'neg-bank-top' }, h('span', {}, 'Por recoger'), h('b', {}, fmtMoney(p.money))),
				its.length ? h('div', { class: 'neg-items' }, ...its.map(([k, n]) => h('span', { class: 'neg-item' }, itemImg(k), `${itemName(k)} ×${n}`))) : null,
				h('div', { class: 'neg-store' }, h('i', { style: { width: fillPct + '%' } })),
				h('div', { class: 'neg-store-t' }, p.full ? '📦 Almacén lleno: lo que se produzca ahora se pierde' : `Almacén: ${(Math.round(p.fill * 10) / 10).toLocaleString('es-MX')} de ${p.cap} días`),
				h('button', { class: 'btn gold', disabled: !p.money && !its.length, onclick: () => act(async () => {
					const got = collect(id);
					if (got) toast(`💰 ${fmtMoney(got.money)}${Object.keys(got.items).length ? ' y ' + Object.entries(got.items).map(([k, n]) => `${itemName(k)} ×${n}`).join(', ') : ''}`, 'quest');
					await saveGame();
				}) }, 'Recoger')));

			// Producción
			body.push(section('A qué se dedica'));
			if (keys.length > 1) body.push(h('div', { class: 'note' }, 'Reparte el esfuerzo. Lo que subes en una línea se lo quitas a las demás.'));
			body.push(h('div', { class: 'list' }, ...keys.map(k => {
				const ln = lines[k], pl = r.perLine[k];
				const out = [pl.money > 0 ? `${fmtMoney(pl.money * r.pct / 100)} al día` : null, ...pl.items.filter(i => i.perDay > 0).map(i => `${itemName(i.id)}: ${perDay(i.perDay)}`)].filter(Boolean);
				return h('div', { class: 'neg-line', 'data-noswipe': '' },
					h('div', { class: 'neg-line-top' }, h('span', { class: 'neg-ico' }, ln.icon || '•'), h('div', { class: 'lbl' }, h('div', { class: 't' }, ln.name), h('div', { class: 's' }, tx(ln.desc || ''))),
						keys.length > 1 ? h('div', { class: 'stepper neg-step' },
							h('button', { 'aria-label': 'Menos esfuerzo', disabled: pl.pct <= 0, onclick: () => { shiftEffort(id, k, -10); draw(); } }, '−'),
							h('b', {}, pl.pct + ' %'),
							h('button', { 'aria-label': 'Más esfuerzo', disabled: pl.pct >= 100, onclick: () => { shiftEffort(id, k, 10); draw(); } }, '+')) : null),
					h('div', { class: 'neg-bar' }, h('i', { style: { width: pl.pct + '%' } })),
					h('div', { class: 'neg-out' }, out.length ? out.join(' · ') : 'Sin esfuerzo, no produce'));
			})));
			body.push(h('div', { class: 'neg-sum' },
				h('div', {}, h('span', {}, 'Ingresos'), h('b', {}, fmtMoney(r.gross))),
				h('div', {}, h('span', {}, 'Gastos'), h('b', {}, '−' + fmtMoney(r.upkeep))),
				h('div', {}, h('span', {}, `Tu parte (${r.pct} %)`), h('b', { class: 'gold' }, fmtMoney(r.money) + '/día'))));
			if (r.red) body.push(h('div', { class: 'note warn' }, 'Ahora mismo los gastos se comen los ingresos. Sube el esfuerzo en una línea que dé dinero o compra una mejora.'));
			if (r.why.length) {
				body.push(h('button', { class: 'linkbtn neg-why-btn', onclick: () => { showWhy = !showWhy; draw(); } }, showWhy ? 'Ocultar el desglose' : 'Ver qué suma y qué resta'));
				if (showWhy) body.push(h('div', { class: 'neg-why' }, ...r.why.map(w => h('div', {}, h('span', {}, w.label), h('b', {}, Object.entries(w.m).map(([k, m]) => `${k === 'all' ? 'Todo' : (def.lines[k]?.name || k)} ${pctTxt(m)}`).join(' · '))))));
			}

			// Pokémon trabajando
			const slots = slotsOf(id), ws = st.workers || [];
			if (slots > 0) {
				body.push(section(`Pokémon echando una mano · ${ws.length}/${slots}`));
				const grid = h('div', { class: 'neg-workers' });
				for (let i = 0; i < slots; i++) {
					const w = ws[i];
					if (!w) { grid.append(h('button', { class: 'neg-worker empty', onclick: pickWorker }, h('span', { class: 'plus' }, '+'), h('span', {}, 'Mandar a uno'))); continue; }
					const b = workerBonus(id, w);
					grid.append(h('button', { class: 'neg-worker', onclick: () => act(async () => {
						const k = await choose(`${displayName(w)} · Nv. ${w.lv} · aporta +${Math.round(b.v * 100)} %`, ['Ver sus datos', 'Traerlo de vuelta', 'Cancelar'], { cancel: 2 });
						if (k === 0) hooks.summary?.(w, draw);
						if (k === 1) { const back = recallWorker(id, ws.indexOf(w)); if (back) toast(back.where === 'party' ? `${displayName(w)} vuelve a tu equipo` : `${displayName(w)} vuelve al PC (Caja ${back.box + 1})`); await saveGame(); }
					}) },
						h('div', { class: 'neg-wsp' }, monImg(w.sp, { anim: false, shiny: w.shiny })),
						h('span', { class: 'neg-wname' }, displayName(w)),
						h('span', { class: 'neg-plus' }, `+${Math.round(b.v * 100)} %${b.fav ? ' ⭐' : ''}`)));
				}
				body.push(grid);
			}

			// Encargado
			const mgrs = managersOf(id);
			if (mgrs.length > 1) {
				body.push(section('Quién lo lleva'));
				body.push(h('div', { class: 'list' }, ...mgrs.map(m => h('button', { class: 'row neg-mgr' + (st.manager === m.id ? ' on' : ''), 'aria-pressed': String(st.manager === m.id), onclick: () => { if (st.manager !== m.id) { setManager(id, m.id); toast(`${m.name} queda al frente`); draw(); } } },
					h('div', { class: 'neg-mpic' }, portraitFor(npcOf(m.npc) || { name: m.name })),
					h('div', { class: 'lbl' }, h('div', { class: 't' }, m.name, st.manager === m.id ? h('span', { class: 'neg-tag' }, 'Al frente') : null), h('div', { class: 's' }, tx(m.desc || '')),
						h('div', { class: 's neg-eff' }, [...Object.entries(m.mult || {}).map(([k, x]) => `${k === 'all' ? 'Todo' : (def.lines[k]?.name || k)} ${pctTxt(x)}`), m.wage ? `Sueldo ${fmtMoney(m.wage)}/día` : null].filter(Boolean).join(' · ')))))));
			}

			// Mejoras
			const ups = upgradesOf(id);
			if (ups.length) {
				const todo = ups.filter(u => !u.bought), done = ups.filter(u => u.bought);
				body.push(section(`Mejoras · ${done.length}/${ups.length}`));
				const effTxt = u => [...Object.entries(u.mult || {}).map(([k, x]) => `${k === 'all' ? 'Todo' : (def.lines[k]?.name || k)} ${pctTxt(x)}`),
					u.unlock ? `Abre: ${def.lines[u.unlock]?.name || u.unlock}` : null, u.share ? `Tu parte +${u.share} puntos` : null, u.slots ? `+${u.slots} puesto para Pokémon` : null,
					u.store ? `+${u.store} ${u.store === 1 ? 'día' : 'días'} de almacén` : null, u.upkeep ? `Gastos ${u.upkeep < 0 ? '−' : '+'}${fmtMoney(Math.abs(u.upkeep))}/día` : null].filter(Boolean).join(' · ');
				body.push(h('div', { class: 'list' }, ...todo.map(u => {
					const lock = !u.available, poor = G.player.money < u.cost;
					return h('div', { class: 'neg-up' + (lock ? ' locked' : '') },
						h('div', { class: 'lbl' }, h('div', { class: 't' }, u.name), h('div', { class: 's' }, tx(u.desc || '')), h('div', { class: 's neg-eff' }, effTxt(u)),
							lock ? h('div', { class: 's' }, '🔒 ' + ((u.need || []).some(n => !st.ups[n]) ? 'Antes hace falta: ' + (u.need || []).filter(n => !st.ups[n]).map(n => def.upgrades.find(x => x.id === n)?.name || n).join(', ') : 'Todavía no se puede')) : null),
						h('button', { class: 'btn' + (lock || poor ? '' : ' primary'), disabled: lock || poor, onclick: () => act(async () => {
							const res = buyUpgrade(id, u.id);
							if (!res.ok) { toast(res.msg); return; }
							toast(`🔧 ${u.name}`, 'quest');
							await saveGame();
							if (u.script && C.scripts[u.script]) await runScript(u.script);
						}) }, fmtMoney(u.cost)));
				}), ...done.map(u => h('div', { class: 'neg-up bought' }, h('div', { class: 'lbl' }, h('div', { class: 't' }, '✔ ' + u.name), h('div', { class: 's neg-eff' }, effTxt(u)))))));
			}

			if (st.log?.length) {
				body.push(section('Cuaderno'));
				body.push(h('div', { class: 'neg-log' }, ...st.log.slice(0, 8).map(e => h('div', {}, h('span', {}, new Date(e.t).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })), ' ', tx(e.text)))));
			}
			body.push(h('div', { class: 'neg-foot' },
				h('div', { class: 'note' }, `Invertido: ${fmtMoney(st.spent || 0)} · Ganado hasta hoy: ${fmtMoney(st.earned || 0)}`),
				hooks.travel && def.loc && G.loc !== def.loc ? h('button', { class: 'btn', onclick: () => { sheet.close(); hooks.travel(def.loc); } }, `Ir a ${C.locations[def.loc]?.name || 'verlo'}`) : null));
			sheet.set(body);
		};

		const draw = () => {
			const y = sheet.body.scrollTop;
			if (owned(id)) drawOwned(); else drawOffer();
			sheet.body.scrollTop = y;
		};
		draw();
		const timer = setInterval(() => { if (!sheet.el.isConnected) { clearInterval(timer); return; } if (!busy && owned(id)) { tick(id); draw(); } }, 60e3);
	});
}
