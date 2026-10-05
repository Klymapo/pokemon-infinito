// Pantalla de combate.
import { D, toID, TYPE_COLORS, typeName } from '../data.js';
import { G, count, markCaught } from '../state.js';
import { C } from '../content.js';
import { BattleCtl, buildTrainerTeam, isBattleUsable, healInfo } from '../battle.js';
import { createPokemon, displayName, maxHp, expProgress, checkEvolution, evolve, movesLearnedAt, isBall } from '../pokemon.js';
import { monImg, sceneCanvas } from '../art.js';
import { h, say, choose, prompt, toast } from './core.js';
import { sleep, fmtText } from '../util.js';
import { isNight } from '../time.js';
import { tx } from '../guion.js';

const STATUS_ES = { par: 'PAR', brn: 'QUE', psn: 'ENV', tox: 'ENV', slp: 'DOR', frz: 'CON', fnt: 'DEB' };
const BG_FOR = { grass: 'route', cave: 'cave', water: 'coast', gym: 'gym', city: 'city', forest: 'forest' };

function hpClass(r) { return r > 0.5 ? '' : r > 0.2 ? 'mid' : 'low'; }

export async function runBattle(cfg, hooks) {
	const here = hooks.currentLoc();
	let foes, trainer = null, kind;
	if (cfg.trainer) {
		trainer = C.trainers[cfg.trainer];
		if (!trainer) { toast('Entrenador inexistente: ' + cfg.trainer); return { result: 'win' }; }
		foes = buildTrainerTeam(trainer, createPokemon);
		kind = 'trainer';
	} else {
		const w = cfg.wild;
		const mon = w.mon || createPokemon(w.sp, { level: w.lv, moves: w.moves, shiny: w.shiny, ability: w.ability, hidden: w.hidden, nature: w.nature, tera: w.tera, minIVs: w.minIVs });
		foes = [mon];
		kind = 'wild';
	}
	if (!G.party.some(p => p.hp > 0)) return { result: 'lose' };

	// Diálogo previo del entrenador
	if (trainer?.intro) {
		const n = trainer.npc ? { id: trainer.npc, ...C.npcs[trainer.npc] } : { name: trainer.name, look: trainer.look || { seed: trainer.name }, sprite: trainer.sprite };
		await say({ ...n, name: (trainer.cls ? trainer.cls + ' ' : '') + trainer.name }, tx(trainer.intro));
	}

	const terrain = cfg.terrain || trainer?.terrain || here?.battleTerrain || (here?.route ? hooks.terrainHere() : (here?.kind === 'gym' ? 'gym' : 'city'));
	const ctl = new BattleCtl({
		kind, foes, trainer, terrain, loc: G.loc, canRun: cfg.canRun !== false, shift: (G.settings?.battleStyle ?? 'shift') === 'shift',
		wildGimmick: cfg.wild?.gimmick, noCatch: cfg.wild?.noCatch,
	});

	// ---------- DOM ----------
	const bgType = trainer?.bg || (terrain === 'gym' ? 'gym' : BG_FOR[terrain] || here?.bg?.type || 'route');
	const bg = sceneCanvas({ ...(here?.bg || {}), type: bgType, seed: (G.loc || '') + 'b' });
	bg.classList.add('bg');
	const foeSprite = h('div', { class: 'bsprite foe' });
	const meSprite = h('div', { class: 'bsprite me' });
	const fx = h('div', { class: 'fx' });
	const flash = h('div', { class: 'flash' });
	const mkCard = side => {
		const c = h('div', { class: 'bcard ' + side, style: { visibility: 'hidden' } });
		c.innerHTML = `<div class="n"><span class="nm"></span><span class="lv"></span></div><div class="hpbar"><i></i></div>${side === 'me' ? '<div class="hpn"></div><div class="expbar"><i></i></div>' : ''}<div class="tags"></div>`;
		return c;
	};
	const foeCard = mkCard('foe'), meCard = mkCard('me');
	const field = h('div', { class: 'field' }, bg, h('div', { class: 'plat foe' }), h('div', { class: 'plat me' }), foeSprite, meSprite, foeCard, meCard, fx, flash);
	const log = h('div', { class: 'blog', role: 'log', 'aria-live': 'polite' });
	const panel = h('div', { class: 'bpanel' });
	const root = h('div', { class: 'battle' }, field, log, panel);
	document.body.append(root);

	const vis = { p1: {}, p2: {} };
	const cardOf = side => side === 'p1' ? meCard : foeCard;
	const spriteOf = side => side === 'p1' ? meSprite : foeSprite;

	function renderCard(side) {
		const v = vis[side], c = cardOf(side);
		c.style.visibility = v.name ? 'visible' : 'hidden';
		c.querySelector('.nm').textContent = v.name + (v.gender === 'M' ? ' ♂' : v.gender === 'F' ? ' ♀' : '');
		c.querySelector('.lv').textContent = 'Nv.' + v.lv;
		const r = v.maxhp ? v.hp / v.maxhp : 0;
		const bar = c.querySelector('.hpbar i');
		bar.style.width = (r * 100).toFixed(1) + '%';
		bar.className = hpClass(r);
		if (side === 'p1') {
			c.querySelector('.hpn').textContent = `${Math.max(0, Math.round(v.hp))}/${v.maxhp}`;
			const p = G.party.find(x => x.uid === v.uid);
			if (p) c.querySelector('.expbar i').style.width = (expProgress(p) * 100) + '%';
		}
		const tags = c.querySelector('.tags');
		tags.innerHTML = '';
		if (v.status) tags.append(h('span', { class: 'status ' + v.status }, STATUS_ES[v.status] || v.status));
		if (v.tera) tags.append(h('span', { class: 'type', style: { background: TYPE_COLORS[v.tera] } }, 'Tera ' + typeName(v.tera)));
		if (side === 'p2' && kind === 'wild' && v.sp && G.dex.caught[D.species[v.sp]?.num]) tags.append(h('span', { style: { fontSize: '12px' } }, '◓ capturado'));
	}
	function setSprite(side, sp, shiny) {
		const s = spriteOf(side);
		s.innerHTML = '';
		s.className = 'bsprite ' + (side === 'p1' ? 'me' : 'foe');
		s.append(monImg(sp, { back: side === 'p1', shiny }));
	}

	// ---------- Reproducción de eventos ----------
	const textDelay = () => [1400, 950, 650, 380][G.settings.textSpeed ?? 2] || 650;
	let skipWait = null;
	field.addEventListener('click', () => skipWait?.());
	log.addEventListener('click', () => skipWait?.());
	const wait = ms => new Promise(r => { const t = setTimeout(r, ms); skipWait = () => { clearTimeout(t); r(); }; });

	function burst(side, type) {
		const b = h('div', { class: 'burst go' });
		const c = TYPE_COLORS[type] || '#fff';
		b.style.background = `radial-gradient(circle, #fff 0%, ${c} 40%, transparent 70%)`;
		const tgt = spriteOf(side).getBoundingClientRect(), fr = field.getBoundingClientRect();
		b.style.left = (tgt.left - fr.left + tgt.width / 2 - 45) + 'px';
		b.style.top = (tgt.top - fr.top + tgt.height / 2 - 45) + 'px';
		fx.append(b);
		setTimeout(() => b.remove(), 600);
	}

	async function play(events) {
		for (const e of events) {
			switch (e.t) {
			case 'text':
				if (e.quiet && G.settings.textSpeed >= 2) break;
				log.innerHTML = fmtText(e.s);
				await wait(textDelay());
				break;
			case 'switch': {
				const v = vis[e.side];
				Object.assign(v, e.info, { tera: null });
				if (e.side === 'p1') v.uid = ctl.partyOf(ctl.active('p1'))?.uid;
				setSprite(e.side, e.info.sp, e.info.shiny);
				renderCard(e.side);
				if (e.info.shiny) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
				await sleep(250);
				break;
			}
			case 'forme':
				vis[e.side].sp = e.sp;
				setSprite(e.side, e.sp, vis[e.side].shiny);
				spriteOf(e.side).classList.add('mega');
				flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
				await sleep(500);
				break;
			case 'hp':
				vis[e.side].hp = e.hp;
				if (e.maxhp) vis[e.side].maxhp = e.maxhp;
				if (e.lv) vis[e.side].lv = e.lv;
				renderCard(e.side);
				await sleep(380);
				break;
			case 'move': {
				const s = spriteOf(e.side);
				s.classList.add(e.side === 'p1' ? 'lunge-me' : 'lunge-foe');
				await sleep(160);
				s.classList.remove('lunge-me', 'lunge-foe');
				const md = D.moves[e.move];
				const tgt = md?.target === 'self' || md?.cat === 'Status' && /self|ally/.test(md?.target || '') ? e.side : (e.side === 'p1' ? 'p2' : 'p1');
				if (!e.miss) {
					burst(tgt, e.type);
					if (md?.cat !== 'Status' && tgt !== e.side) { const t = spriteOf(tgt); t.classList.remove('hit'); void t.offsetWidth; t.classList.add('hit'); }
				}
				await sleep(200);
				break;
			}
			case 'faint':
				spriteOf(e.side).classList.add('faint');
				vis[e.side].hp = 0; renderCard(e.side);
				await sleep(450);
				break;
			case 'status': vis[e.side].status = e.status; renderCard(e.side); break;
			case 'tera': vis[e.side].tera = e.type; spriteOf(e.side).classList.add('tera'); renderCard(e.side); flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); await sleep(400); break;
			case 'dyn': spriteOf(e.side).classList.toggle('dyn', e.on); await sleep(400); break;
			case 'crit': flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); break;
			case 'exp': if (vis.p1.uid === e.uid) { const p = G.party.find(x => x.uid === e.uid); if (p) { meCard.querySelector('.expbar i').style.width = (expProgress(p) * 100) + '%'; } } break;
			case 'levelup': if (vis.p1.uid === e.uid) { vis.p1.lv = e.lv; renderCard('p1'); } break;
			case 'ball': {
				const fs = foeSprite.querySelector('img,.fallback');
				if (fs) fs.style.opacity = '0';
				const ball = h('div', { style: { position: 'absolute', right: '24%', top: '24%', fontSize: '34px', transition: 'transform .2s' } }, '◓');
				fx.append(ball);
				await sleep(450);
				for (let i = 0; i < e.shakes; i++) { ball.style.transform = 'rotate(-25deg)'; await sleep(220); ball.style.transform = 'rotate(25deg)'; await sleep(220); ball.style.transform = ''; await sleep(380); }
				if (e.caught) { ball.textContent = '◓✨'; await sleep(700); }
				else { ball.remove(); if (fs) fs.style.opacity = '1'; }
				break;
			}
			}
		}
		skipWait = null;
	}

	// ---------- Menús ----------
	const pickAction = () => new Promise(resolve => {
		const o = ctl.options();
		const showMain = () => {
			panel.innerHTML = '';
			const meName = vis.p1.name || '';
			log.innerHTML = fmtText(`¿Qué debería hacer **${meName}**?`);
			panel.append(
				h('button', { class: 'btn fight', onclick: showMoves }, 'Luchar'),
				h('button', { class: 'btn bag', onclick: showBag }, 'Mochila'),
				h('button', { class: 'btn pkmn', onclick: () => showSwitch(false) }, 'Pokémon'),
				h('button', { class: 'btn run', onclick: () => resolve({ type: 'run' }) }, kind === 'wild' ? 'Huir' : 'Huir'),
			);
			// Lanzamiento rápido: la Ball con más probabilidad (o la que elijas), con su % real
			if (kind === 'wild' && !cfg.wild?.noCatch) {
				const balls = Object.keys(G.bag).filter(id => G.bag[id] > 0 && isBall(id) && id !== 'masterball');
				if (balls.length) {
					const pref = G.settings.ballPick || 'auto';
					const odds = Object.fromEntries(balls.map(id => [id, ctl.catchOdds(id)]));
					const best = pref !== 'auto' && G.bag[pref] > 0 ? pref : balls.slice().sort((a, b) => (odds[b] - odds[a]) || ((D.items[a]?.cost || 0) - (D.items[b]?.cost || 0)))[0];
					const p = odds[best];
					const pTxt = p >= 0.995 ? '100 %' : p < 0.01 ? '<1 %' : Math.round(p * 100) + ' %';
					panel.append(h('div', { class: 'quickball' },
						h('button', { class: 'btn qb-throw', onclick: () => { G.settings.lastBall = best; resolve({ type: 'ball', ball: best }); } },
							h('span', { class: 'qb-ico' }, '◓'), h('span', {}, `Lanzar ${D.items[best]?.name || best}`), h('span', { class: 'qb-n' }, `×${G.bag[best]} · ${pTxt}`)),
						h('button', { class: 'btn qb-pick', 'aria-label': 'Elegir Ball', onclick: async () => {
							const opts = ['auto', ...balls];
							const i = await choose('¿Qué Ball quieres en el botón rápido?', opts.map(id => id === 'auto' ? `Automática (la de más probabilidad)${pref === 'auto' ? ' ✔' : ''}` : `${D.items[id]?.name} ×${G.bag[id]} · ${Math.round(odds[id] * 100)} %${pref === id ? ' ✔' : ''}`).concat(['Cancelar']), { cancel: opts.length });
							if (i < opts.length) G.settings.ballPick = opts[i];
							showMain();
						} }, '⇄')));
				}
			}
		};
		let gimmick = null;
		const showMoves = () => {
			panel.innerHTML = '';
			const zOn = gimmick === 'z', dOn = gimmick === 'dynamax';
			for (const m of o.moves) {
				const label = zOn && m.z ? m.z.name : dOn && m.max ? m.max.name : m.name;
				const dis = m.disabled || m.pp <= 0 || (zOn && !m.z);
				const effTxt = m.eff === null || m.eff === undefined ? '' : m.eff === 0 ? 'No afecta' : m.eff >= 2 ? 'Eficaz' : m.eff < 1 ? 'Poco eficaz' : '';
				const btn = h('button', { class: 'movebtn', disabled: dis, style: { background: TYPE_COLORS[m.type] || '#567' }, onclick: () => resolve({ type: 'move', i: m.i, gimmick }) },
					h('span', { class: 'mn' }, label),
					h('span', { class: 'mm' }, h('span', {}, typeName(m.type)), h('span', {}, `PP ${m.pp}/${m.maxpp}`), effTxt ? h('span', { class: 'se' }, effTxt) : null));
				btn.addEventListener('contextmenu', ev => { ev.preventDefault(); toast(`**${m.name}** · ${m.cat === 'Physical' ? 'Físico' : m.cat === 'Special' ? 'Especial' : 'Estado'}${m.bp ? ' · Pot. ' + m.bp : ''}${m.acc ? ' · Prec. ' + m.acc : ''}\n${m.desc || ''}`); });
				panel.append(btn);
			}
			const gk = Object.keys(o.gimmicks);
			if (gk.length) {
				const names = { mega: 'Megaevolucionar', z: 'Movimiento Z', dynamax: 'Dinamax', tera: 'Teracristal' };
				panel.append(h('div', { class: 'gimmick' }, ...gk.map(k => h('button', { class: gimmick === k ? 'on' : '', onclick: () => { gimmick = gimmick === k ? null : k; showMoves(); } }, names[k]))));
			}
			panel.append(h('button', { class: 'btn backrow', onclick: showMain }, 'Atrás'));
		};
		const showBag = () => {
			panel.innerHTML = '';
			const items = Object.keys(G.bag).filter(id => isBattleUsable(id) && G.bag[id] > 0);
			const balls = items.filter(isBall), meds = items.filter(i => !isBall(i));
			const list = h('div', { style: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '38vh', overflowY: 'auto' } });
			const add = id => list.append(h('button', { class: 'row', onclick: () => useItem(id) },
				h('div', { class: 'lbl' }, h('div', { class: 't' }, D.items[id]?.name || id), h('div', { class: 's' }, D.items[id]?.desc || '')),
				h('b', {}, '×' + G.bag[id])));
			if (kind === 'wild') balls.forEach(add);
			meds.forEach(add);
			if (!list.children.length) list.append(h('div', { class: 'empty' }, 'No tienes objetos que puedas usar en combate.'));
			panel.append(list, h('button', { class: 'btn backrow', onclick: showMain }, 'Atrás'));
		};
		const useItem = async id => {
			if (isBall(id)) { G.settings.lastBall = id; resolve({ type: 'ball', ball: id }); return; }
			const info = healInfo(id);
			if (info?.boost || info?.crit || info?.mist) { resolve({ type: 'item', item: id, uid: vis.p1.uid }); return; }
			// elegir objetivo
			const targets = G.party;
			const i = await choose(`¿En qué Pokémon usar ${D.items[id]?.name}?`, targets.map(p => `${displayName(p)} · ${p.hp}/${maxHp(p)} PS${p.status ? ' · ' + STATUS_ES[p.status] : ''}`).concat(['Cancelar']));
			if (i >= targets.length) return;
			const p = targets[i];
			let moveIdx;
			if (info?.pp) {
				const j = await choose('¿Qué movimiento?', p.moves.map(m => `${D.moves[m.id]?.name} ${m.pp}`).concat(['Cancelar']));
				if (j >= p.moves.length) return;
				moveIdx = j;
			}
			resolve({ type: 'item', item: id, uid: p.uid, moveIdx });
		};
		const showSwitch = (forced) => {
			panel.innerHTML = '';
			const list = h('div', { style: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '44vh', overflowY: 'auto' } });
			for (const s of o.switches) {
				const p = G.party.find(x => x.uid === s.uid);
				const r = s.maxhp ? s.hp / s.maxhp : 0;
				const canSwitch = !s.fainted && !s.active && !(o.trapped && !forced);
				const onTap = async () => {
					const opts = [canSwitch ? (forced ? 'Sacarlo' : 'Cambiar') : null, 'Ver datos', 'Cancelar'].filter(Boolean);
					const i = await choose(`${s.name} · Nv. ${s.lv} · ${s.hp}/${s.maxhp} PS`, opts, { cancel: opts.length - 1 });
					if (opts[i] === 'Sacarlo' || opts[i] === 'Cambiar') resolve({ type: 'switch', idx: s.idx });
					else if (opts[i] === 'Ver datos' && p) {
						const { openSummary } = await import('./screens.js');
						openSummary(p, null, { battle: true, hp: s.hp, maxhp: s.maxhp, status: s.status });
					}
				};
				const card = h('button', { class: 'mon' + (s.fainted ? ' fainted' : '') + (s.active ? ' sel' : ''), onclick: onTap },
					h('div', { class: 'sprite' }, monImg(s.sp, { anim: false, shiny: p?.shiny })),
					h('div', { class: 'info' },
						h('div', { class: 'name' }, s.name, h('span', { class: 'lv' }, 'Nv.' + s.lv), s.status && s.status !== 'fnt' ? h('span', { class: 'status ' + s.status }, STATUS_ES[s.status]) : null),
						h('div', { class: 'hpbar' }, h('i', { class: hpClass(r), style: { width: (r * 100) + '%' } })),
						h('div', { class: 'hptext' }, h('span', {}, s.active ? 'En combate' : s.fainted ? 'Debilitado' : ''), h('span', {}, `${s.hp}/${s.maxhp}`))));
				list.append(card);
			}
			panel.append(list);
			if (o.shift) panel.append(h('button', { class: 'btn backrow', onclick: () => resolve({ type: 'noshift' }) }, 'No cambiar'));
			else if (!forced) panel.append(h('button', { class: 'btn backrow', onclick: showMain }, 'Atrás'));
			if (o.trapped && !forced) log.innerHTML = fmtText('¡No puedes cambiar de Pokémon ahora!');
			else log.innerHTML = o.shift ? '¿A quién quieres sacar?' : forced ? '¿Qué Pokémon vas a sacar?' : 'Toca un Pokémon para cambiarlo o ver sus datos.';
		};
		if (o.forceSwitch) showSwitch(true); else showMain();
	});

	// ---------- Bucle ----------
	await play(ctl.start());
	let res = { result: null };
	let guard = 0;
	while (guard++ < 500) {
		const action = await pickAction();
		panel.innerHTML = '';
		let r = ctl.turn(action);
		await play(r.events || []);
		if (r.error) { log.innerHTML = fmtText(r.error); await wait(1100); }
		if (r.ended) { res = r; break; }
		if (r.shiftOffer) {
			const who = trainer ? (trainer.cls ? trainer.cls + ' ' : '') + trainer.name : 'El rival';
			const i = await choose(`${who} va a sacar a ${r.shiftOffer.foe}. ¿Quieres cambiar de Pokémon?`, ['Sí', 'No']);
			if (i !== 0) {
				r = ctl.turn({ type: 'noshift' });
				await play(r.events || []);
				if (r.ended) { res = r; break; }
			}
		}
	}

	// ---------- Final ----------
	const summary = ctl.finish();
	summary.trainer = trainer;
	if (summary.result === 'win' && trainer) {
		if (trainer.win) {
			const n = trainer.npc ? { id: trainer.npc, ...C.npcs[trainer.npc] } : { name: trainer.name, look: trainer.look || { seed: trainer.name }, sprite: trainer.sprite };
			log.innerHTML = '';
			await say({ ...n, name: (trainer.cls ? trainer.cls + ' ' : '') + trainer.name }, tx(trainer.win));
		}
		if (summary.money) { log.innerHTML = fmtText(`¡Has ganado **₽${summary.money}**!`); await wait(1300); }
		G.beaten[trainer.id] = (G.beaten[trainer.id] || 0) + 1;
		// Expediente: registrar el equipo visto
		const key = trainer.npc || trainer.id;
		if (trainer.npc) {
			const it = (G.intel[key] ||= { notes: [], teams: {} });
			it.teams[trainer.id] = trainer.team.map(m => ({ sp: m.sp, lv: m.lv }));
		}
	}
	if (summary.result === 'lose') {
		if (trainer?.lose) {
			const n = trainer.npc ? { id: trainer.npc, ...C.npcs[trainer.npc] } : { name: trainer.name, look: trainer.look || { seed: trainer.name }, sprite: trainer.sprite };
			await say({ ...n, name: (trainer.cls ? trainer.cls + ' ' : '') + trainer.name }, tx(trainer.lose));
		}
		if (!cfg.canLose) {
			log.innerHTML = fmtText(`¡A ${G.player.name} no le quedan Pokémon en condiciones de luchar!${summary.money ? ` Has perdido ₽${-summary.money}…` : ''}`);
			await wait(1800);
		}
	}
	root.remove();

	// Movimientos nuevos
	for (const lu of summary.levelUps) {
		const p = G.party.find(x => x.uid === lu.uid);
		if (!p) continue;
		for (const m of lu.moves) await hooks.learnMove(p, m);
	}
	// Captura
	if (summary.caught) {
		markCaught(summary.caught.sp);
		await hooks.receivePokemon(summary.caught, { caught: true });
	}
	// Evoluciones
	for (const uid of summary.leveled) {
		const p = G.party.find(x => x.uid === uid);
		if (p && p.hp >= 0) await hooks.tryEvolve(p, { trigger: 'level' });
	}
	return summary;
}

// ---------- Aprender movimiento ----------
export async function learnMoveUI(p, moveId, { force = false } = {}) {
	const md = D.moves[moveId];
	if (!md) return false;
	if (p.moves.some(m => m.id === moveId)) return false;
	const name = displayName(p);
	if (p.moves.length < 4) {
		p.moves.push({ id: moveId, pp: md.pp, ppUps: 0 });
		await say(null, `¡**${name}** ha aprendido **${md.name}**!`);
		return true;
	}
	while (true) {
		await say(null, `**${name}** quiere aprender **${md.name}**, pero ya conoce cuatro movimientos.`);
		const i = await compareMoves(p, moveId);
		if (i < 0) {
			if (force) continue;
			await say(null, `**${name}** no ha aprendido **${md.name}**.`);
			return false;
		}
		const old = D.moves[p.moves[i].id]?.name;
		p.moves[i] = { id: moveId, pp: md.pp, ppUps: 0 };
		await say(null, `1, 2 y… ¡Puf! **${name}** ha olvidado **${old}**… y ha aprendido **${md.name}**.`);
		return true;
	}
}

/** Pantalla para comparar el movimiento nuevo con los cuatro actuales. Devuelve el índice a olvidar o -1. */
function compareMoves(p, newId) {
	return new Promise(resolve => {
		const types = D.species[p.sp]?.types || [];
		const catName = c => c === 'Physical' ? 'Físico' : c === 'Special' ? 'Especial' : 'Estado';
		const card = (id, extra = {}) => {
			const md = D.moves[id] || {};
			const stab = md.cat !== 'Status' && types.includes(md.type);
			const pp = extra.pp !== undefined ? `PP ${extra.pp}/${md.pp}` : `PP ${md.pp}`;
			return h(extra.onclick ? 'button' : 'div', { class: 'cmpmove' + (extra.isNew ? ' new' : ''), onclick: extra.onclick, style: { borderLeftColor: TYPE_COLORS[md.type] || '#567', borderLeftWidth: '6px' } },
				h('div', { class: 'cm-top' },
					h('b', {}, md.name || id),
					h('span', { class: 'type', style: { background: TYPE_COLORS[md.type] } }, typeName(md.type))),
				h('div', { class: 'cm-stats' },
					h('span', {}, catName(md.cat)),
					h('span', {}, 'Pot. ' + (md.bp || '—')),
					h('span', {}, 'Prec. ' + (md.acc === true || !md.acc ? '—' : md.acc)),
					h('span', {}, pp),
					stab ? h('span', { class: 'stab' }, 'Mismo tipo ×1.5') : null),
				md.desc ? h('div', { class: 'cm-desc' }, md.desc) : null);
		};
		const ov = h('div', { class: 'overlay dim' });
		const close = v => { ov.remove(); resolve(v); };
		const box = h('div', { class: 'choices cmpbox' },
			h('div', { class: 'prompt' }, 'Movimiento nuevo'),
			card(newId, { isNew: true }),
			h('div', { class: 'prompt' }, `Toca el movimiento que ${displayName(p)} debe olvidar`),
			...p.moves.map((m, i) => card(m.id, { pp: m.pp, onclick: () => close(i) })),
			h('button', { class: 'cm-cancel', onclick: () => close(-1) }, `No aprender ${D.moves[newId]?.name || newId}`));
		ov.append(box);
		document.body.append(ov);
	});
}

// ---------- Evolución ----------
export async function evolveUI(p, toId) {
	const from = D.species[p.sp], to = D.species[toId];
	const ov = h('div', { class: 'overlay dim', style: { justifyContent: 'center', background: 'rgba(10,15,30,.92)' } });
	const stage = h('div', { class: 'evo-stage glow' }, monImg(p.sp, { shiny: p.shiny }));
	const stopBtn = h('button', { class: 'btn', style: { margin: '0 auto', width: '70%' } }, 'Detener');
	ov.append(stage, h('div', { style: { height: '20px' } }), stopBtn);
	document.body.append(ov);
	let stopped = false;
	stopBtn.onclick = () => { stopped = true; };
	await say(null, `¿Eh? ¡**${displayName(p)}** está evolucionando!`);
	for (let i = 0; i < 6 && !stopped; i++) {
		stage.innerHTML = '';
		stage.append(monImg(i % 2 ? toId : p.sp, { shiny: p.shiny }));
		await sleep(380 - i * 30);
	}
	if (stopped) {
		stage.innerHTML = ''; stage.append(monImg(p.sp, { shiny: p.shiny }));
		stage.classList.remove('glow');
		await say(null, `¿Eh? ¡**${displayName(p)}** no ha evolucionado!`);
		ov.remove();
		return false;
	}
	const oldName = displayName(p);
	evolve(p, toId);
	stage.innerHTML = ''; stage.append(monImg(toId, { shiny: p.shiny }));
	stage.classList.remove('glow');
	stopBtn.remove();
	await say(null, `¡Enhorabuena! ¡Tu **${oldName}** ha evolucionado a **${to.name}**!`);
	ov.remove();
	markCaught(toId);
	for (const m of movesLearnedAt(toId, p.lv, true)) await learnMoveUI(p, m);
	return true;
}
