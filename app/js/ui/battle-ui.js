// Pantalla de combate.
import { D, toID, TYPE_COLORS, typeStyle, typeName } from '../data.js';
import { G, count, markCaught } from '../state.js';
import { C } from '../content.js';
import { BattleCtl, buildTrainerTeam, isBattleUsable, healInfo } from '../battle.js';
import { createPokemon, displayName, maxHp, expProgress, checkEvolution, evolve, movesLearnedAt, isBall } from '../pokemon.js';
import { monImg, sceneCanvas, ballIcon } from '../art.js';
import { portraitFor } from './core.js';
import { h, say, choose, prompt, toast } from './core.js';
import { sleep, fmtText } from '../util.js';
import { isNight } from '../time.js';
import { createFx } from './fx.js';
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
	const mkCard = side => {
		const c = h('div', { class: 'bcard ' + side, style: { visibility: 'hidden' } });
		c.innerHTML = `<div class="n"><span class="nm"></span><span class="lv"></span></div><div class="hpbar"><i></i></div>${side === 'me' ? '<div class="hpn"></div><div class="expbar"><i></i></div>' : ''}<div class="tags"></div>`;
		if (side === 'me' || kind === 'trainer') c.append(h('div', { class: 'teamrow' }));
		return c;
	};
	const foeCard = mkCard('foe'), meCard = mkCard('me');
	const field = h('div', { class: 'field' }, bg, h('div', { class: 'plat foe' }), h('div', { class: 'plat me' }), foeSprite, meSprite, foeCard, meCard);
	const log = h('div', { class: 'blog', role: 'log', 'aria-live': 'polite' });
	const panel = h('div', { class: 'bpanel' });
	const root = h('div', { class: 'battle' }, field, log, panel);
	document.body.append(root);
	// Efectos: lienzo pixelado bajo las tarjetas de PS y coreografía de los sprites (fx.js)
	const fx = createFx(field, { spriteOf: side => side === 'p1' ? meSprite : foeSprite, settings: () => G.settings, before: foeCard, root });
	root.classList.toggle('fx-off', fx.off);

	// Ficha del entrenador rival: retrato pequeño + nombre, dentro de la tarjeta rival
	let trainerPortrait = null;
	if (trainer) {
		const tn = trainer.npc ? { id: trainer.npc, ...C.npcs[trainer.npc] } : { name: trainer.name, look: trainer.look || { seed: trainer.name }, sprite: trainer.sprite };
		trainerPortrait = () => portraitFor(tn);
		const chip = h('div', { class: 'tchip' }, h('span', { class: 'tpic' }, trainerPortrait()), h('span', { class: 'tname' }, (trainer.cls ? trainer.cls + ' ' : '') + trainer.name));
		foeCard.prepend(chip);
	}
	// Fila de Poké Balls: una por Pokémon del equipo (llena, con problema de estado o debilitado)
	function renderTeams() {
		if (!ctl.battle) return;
		for (const [side, card] of [['p1', meCard], ['p2', foeCard]]) {
			const row = card.querySelector('.teamrow');
			if (!row) continue;
			const mons = ctl.battle[side].pokemon;
			row.innerHTML = '';
			const left = mons.filter(p => !p.fainted && p.hp > 0).length;
			for (const p of mons) {
				const st = (p.fainted || p.hp <= 0) ? 'out' : p.status ? 'sick' : 'ok';
				row.append(h('span', { class: 'tb ' + st }));
			}
			row.setAttribute('aria-label', side === 'p2' ? `Le quedan ${left} de ${mons.length}` : `Te quedan ${left} de ${mons.length}`);
			if (side === 'p2') row.append(h('span', { class: 'tleft' }, `${left}/${mons.length}`));
		}
	}

	const vis = { p1: {}, p2: {} };
	// Experiencia que se ve en pantalla: la real ya está sumada cuando empieza la reproducción del turno,
	// así que la barra solo avanza cuando llega su evento (después del golpe y del «se debilitó»).
	const expShown = Object.fromEntries(G.party.map(p => [p.uid, expProgress(p)]));
	const cardOf = side => side === 'p1' ? meCard : foeCard;
	const spriteOf = side => side === 'p1' ? meSprite : foeSprite;

	function renderCard(side) {
		const v = vis[side], c = cardOf(side);
		c.style.visibility = v.name ? 'visible' : 'hidden';
		c.querySelector('.nm').textContent = v.name + (v.gender === 'M' ? ' ♂' : v.gender === 'F' ? ' ♀' : '');
		if (side === 'p2' && kind === 'wild' && v.sp && G.dex.caught[D.species[v.sp]?.num]) c.querySelector('.nm').append(h('span', { class: 'caughtmark', title: 'Ya lo capturaste' }, '◓'));
		c.querySelector('.lv').textContent = 'Nv.' + v.lv;
		const r = v.maxhp ? v.hp / v.maxhp : 0;
		const bar = c.querySelector('.hpbar i');
		bar.style.width = (r * 100).toFixed(1) + '%';
		bar.className = hpClass(r);
		if (side === 'p1') {
			const hpn = c.querySelector('.hpn');
			hpn.textContent = `${Math.max(0, Math.round(v.hp))}/${v.maxhp}`;
			hpn.className = 'hpn ' + hpClass(r);
			if (expShown[v.uid] !== undefined) c.querySelector('.expbar i').style.width = (expShown[v.uid] * 100) + '%';
		}
		const tags = c.querySelector('.tags');
		tags.innerHTML = '';
		if (v.status) tags.append(h('span', { class: 'status ' + v.status }, STATUS_ES[v.status] || v.status));
		if (v.tera) tags.append(h('span', { class: 'type', style: typeStyle(v.tera) }, 'Tera ' + typeName(v.tera)));
	}
	function setSprite(side, sp, shiny) {
		const s = spriteOf(side);
		s.innerHTML = '';
		s.className = 'bsprite ' + (side === 'p1' ? 'me' : 'foe') + (vis[side].tera ? ' tera' : '') + (vis[side].dyn ? ' dyn' : '') + (vis[side].mega ? ' mega' : '');
		s.append(monImg(sp, { back: side === 'p1', shiny }));
	}

	// ---------- Reproducción de eventos ----------
	const textDelay = () => [1400, 950, 650, 380][G.settings.textSpeed ?? 2] || 650;
	let skipWait = null;
	field.addEventListener('click', () => skipWait?.());
	log.addEventListener('click', () => skipWait?.());
	const wait = ms => new Promise(r => { const t = setTimeout(r, ms); skipWait = () => { clearTimeout(t); r(); }; });

	// Un toque acelera la animación en curso (no la corta) y salta la espera del texto
	field.addEventListener('click', () => fx.hurry());
	log.addEventListener('click', () => fx.hurry());
	const other = side => side === 'p1' ? 'p2' : 'p1';
	/** Aplica un cambio de PS a la tarjeta y devuelve la fracción perdida (>0) o ganada (<0). */
	function applyHp(e) {
		const v = vis[e.side], before = v.hp, max = e.maxhp || v.maxhp || 1;
		const sameScale = !e.maxhp || e.maxhp === v.maxhp;
		v.hp = e.hp;
		if (e.maxhp) v.maxhp = e.maxhp;
		if (e.lv) v.lv = e.lv;
		renderCard(e.side);
		if (!sameScale || e.lv || before === undefined) return 0;
		if (before !== e.hp) fx.number(e.side, e.hp - before);
		return (before - e.hp) / max;
	}

	let lastLine = '';
	async function play(events) {
		for (let i = 0; i < events.length; i++) {
			const e = events[i];
			if (e.done) continue;
			fx.calm();
			switch (e.t) {
			case 'text':
				if (e.quiet && G.settings.textSpeed >= 2) break;
				// «¡Es supereficaz!» repetido en cada golpe de un movimiento múltiple: una sola vez
				if (e.s === lastLine && events[i - 1]?.t !== 'move') break;
				lastLine = e.s;
				log.innerHTML = fmtText(e.s);
				await wait(textDelay());
				break;
			case 'switch': {
				const v = vis[e.side];
				// El texto de la salida («¡Adelante!», «X saca a Y») se ve a la vez que la Ball, no después
				const nx = events[i + 1], t0 = performance.now();
				const line = e.say || (nx?.t === 'text' && !nx.done && !nx.quiet ? (nx.done = true, nx.s) : null);
				if (v.name && !fx.gone(e.side)) await fx.recall(e.side);
				if (line) { log.innerHTML = fmtText(line); lastLine = line; }
				Object.assign(v, e.info, { tera: null, dyn: false, mega: false });
				if (e.side === 'p1') v.uid = ctl.partyOf(ctl.active('p1'))?.uid;
				setSprite(e.side, e.info.sp, e.info.shiny);
				renderCard(e.side); renderTeams();
				await fx.sendOut(e.side, { wild: kind === 'wild' && e.side === 'p2', shiny: e.info.shiny });
				if (line) await wait(Math.max(120, textDelay() * 0.85 - (performance.now() - t0)));
				break;
			}
			case 'forme': {
				const v = vis[e.side];
				const isMega = events.slice(i + 1, i + 5).some(x => x.t === 'mega' && x.side === e.side);
				const swap = () => { v.sp = e.sp; if (isMega) v.mega = true; setSprite(e.side, e.sp, v.shiny); };
				if (isMega) await fx.mega(e.side, swap); else await fx.morph(e.side, swap);
				break;
			}
			case 'hp': {
				const from = toID(e.from || '');
				const d = applyHp(e);
				if (d > 0) {
					if (from === 'psn' || from === 'brn' || from === 'tox') await fx.statusTick(e.side, from === 'tox' ? 'psn' : from);
					else if (from === 'confusion') await fx.statusTick(e.side, 'confusion');
					await fx.hurt(e.side, d);
				} else if (d < 0) fx.heal(e.side);
				await fx.wait(d ? 260 : 120);
				break;
			}
			case 'move': {
				// El texto «X usó Y» sale a la vez que la animación, no después
				const nx = events[i + 1], t0 = performance.now();
				if (nx?.t === 'text' && !nx.done) { log.innerHTML = fmtText(nx.s); nx.done = true; lastLine = nx.s; }
				const hitEvs = e.hitEvs || [];
				const shown = Math.min(hitEvs.length, 5);
				await fx.move(e, { onHit: k => {
					let d = 0, any = false;
					for (let q = k; q < (k >= shown - 1 ? hitEvs.length : k + 1); q++) { const he = hitEvs[q]; if (!he || he.done) continue; he.done = true; any = true; d += applyHp(he); }
					renderTeams();
					return any ? d : 0.2;
				} });
				if (nx?.done) await wait(Math.max(120, textDelay() * 0.85 - (performance.now() - t0)));
				break;
			}
			case 'faint':
				vis[e.side].hp = 0; renderCard(e.side); renderTeams();
				await fx.faint(e.side);
				break;
			case 'status': vis[e.side].status = e.status; renderCard(e.side); renderTeams(); await fx.status(e.side, e.status); break;
			case 'cant': if (['par', 'slp', 'frz'].includes(e.why)) await fx.statusTick(e.side, e.why); break;
			case 'vol': await fx.statusTick(e.side, e.v); break;
			case 'boost': await fx.boost(e.side, e.stat, e.n); break;
			case 'weather': await fx.weather(e.w, e.upkeep); break;
			case 'zpower': await fx.zpower(e.side); break;
			case 'tera': vis[e.side].tera = e.type; await fx.tera(e.side, e.type); spriteOf(e.side).classList.add('tera'); renderCard(e.side); break;
			case 'dyn': vis[e.side].dyn = e.on; spriteOf(e.side).classList.toggle('dyn', e.on); await fx.dyn(e.side, e.on); break;
			case 'exp': {
				const p = G.party.find(x => x.uid === e.uid);
				const to = e.prog ?? (p ? expProgress(p) : 0);
				expShown[e.uid] = to;
				if (vis.p1.uid === e.uid) {
					const bar = meCard.querySelector('.expbar i');
					if (e.reset) { bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = ''; }
					bar.style.width = (to * 100) + '%';
					await sleep(e.reset ? 300 : 520);
				}
				break;
			}
			case 'levelup': if (vis.p1.uid === e.uid) { vis.p1.lv = e.lv; renderCard('p1'); await fx.levelup(e.lv); } break;
			case 'ball': {
				const kindB = e.ball === 'greatball' ? 'great' : e.ball === 'ultraball' ? 'ultra' : 'poke';
				const ball = h('div', { class: 'cball throw' }, ballIcon(40, kindB));
				fx.over.append(ball);
				await sleep(420);
				await fx.capIn('p2', ball);
				ball.classList.remove('throw'); ball.classList.add('land');
				await sleep(380);
				fx.capLand(ball);
				for (let k = 0; k < e.shakes; k++) { ball.classList.remove('shake'); void ball.offsetWidth; ball.classList.add('shake'); fx.capShake(ball, k); await sleep(620); }
				if (e.caught) {
					ball.classList.add('caught');
					fx.capStars(ball);
					for (let k = 0; k < 3; k++) fx.over.append(h('div', { class: 'cstar s' + k }, '✦'));
					await sleep(900);
					fx.over.querySelectorAll('.cstar').forEach(x => x.remove());
				} else {
					ball.classList.add('pop'); await sleep(220); ball.remove();
					await fx.capOut('p2', ball);
				}
				break;
			}
			}
		}
		skipWait = null;
		fx.calm();
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
							h('span', { class: 'qb-ico' }, ballIcon(22, best === 'greatball' ? 'great' : best === 'ultraball' ? 'ultra' : 'poke')), h('span', {}, `Lanzar ${D.items[best]?.name || best}`), h('span', { class: 'qb-n' }, `×${G.bag[best]} · ${pTxt}`)),
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
				const btn = h('button', { class: 'movebtn', disabled: dis, style: typeStyle(m.type), onclick: () => resolve({ type: 'move', i: m.i, gimmick }) },
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
			// Elegir objetivo, con los PS reales de este combate (antes salían los de antes de empezar: debilitados «al máximo»)
			const useful = sw => info?.revive ? sw.fainted : !sw.fainted && ((info?.hp || info?.pct) && sw.hp < sw.maxhp || info?.cure && sw.status && sw.status !== 'fnt' || info?.pp || info?.ppAll);
			teamOverlay({
				title: `Usar ${D.items[id]?.name || id}`,
				hint: info?.revive ? 'Elige a un Pokémon debilitado.' : 'Elige en quién usarlo. Los PS son los de este combate.',
				dim: sw => !useful(sw),
				onTap: async (sw, close) => {
					const p = G.party.find(x => x.uid === sw.uid);
					if (!p) return;
					let moveIdx;
					if (info?.pp) {
						const j = await choose('¿Qué movimiento?', sw.moves.map(m => `${D.moves[m.id]?.name || m.id} · PP ${m.pp}/${m.maxpp}`).concat(['Cancelar']), { cancel: sw.moves.length });
						if (j >= sw.moves.length) return;
						moveIdx = j;
					}
					close();
					resolve({ type: 'item', item: id, uid: p.uid, moveIdx });
				},
				back: () => {},
			});
		};
		/**
		 * Resumen del equipo a pantalla completa: los seis a la vez, con PS, estado, tipos, objeto,
		 * sus cuatro movimientos (con PP) y sus características. Sirve para cambiar y para elegir en quién usar un objeto.
		 */
		const teamOverlay = ({ title, hint, onTap, dim, back, backLabel = 'Atrás' }) => {
			root.querySelector('.bteam')?.remove();
			const close = () => ov.remove();
			const grid = h('div', { class: 'bteam-grid' });
			const SN = [['atk', 'Atq'], ['def', 'Def'], ['spa', 'AtE'], ['spd', 'DfE'], ['spe', 'Vel']];
			for (const sw of o.switches) {
				const p = G.party.find(x => x.uid === sw.uid);
				const r = sw.maxhp ? sw.hp / sw.maxhp : 0;
				const st = sw.status && sw.status !== 'fnt' ? sw.status : '';
				grid.append(h('button', { class: 'tcard' + (sw.fainted ? ' fainted' : '') + (sw.active ? ' active' : '') + (dim?.(sw) ? ' dim' : ''), onclick: () => onTap(sw, close) },
					h('div', { class: 'tc-head' },
						h('div', { class: 'tc-sp' }, monImg(sw.sp, { anim: false, shiny: p?.shiny })),
						h('div', { class: 'tc-id' },
							h('div', { class: 'tc-name' }, h('span', { class: 'tc-nm' }, sw.name), h('span', { class: 'lv' }, 'Nv.' + sw.lv)),
							h('div', { class: 'hpbar' }, h('i', { class: hpClass(r), style: { width: (r * 100) + '%' } })),
							h('div', { class: 'tc-hp' },
								h('span', { class: 'tc-tags' }, sw.active ? h('span', { class: 'status act' }, 'ACTIVO') : null, sw.fainted ? h('span', { class: 'status fnt' }, 'DEB') : null, st ? h('span', { class: 'status ' + st }, STATUS_ES[st]) : null),
								h('span', { class: 'hpnum ' + hpClass(r) }, `${sw.hp}/${sw.maxhp}`)))),
					h('div', { class: 'tc-types' }, ...(sw.types || []).map(t => h('span', { class: 'type', style: typeStyle(t) }, typeName(t))), sw.item ? h('span', { class: 'tc-item' }, '✦ ' + (D.items[sw.item]?.name || sw.item)) : null),
					h('div', { class: 'tc-moves' }, ...sw.moves.map(m => {
						const md = D.moves[m.id] || {};
						return h('div', { class: 'tc-mv' + (m.pp <= 0 ? ' out' : ''), style: typeStyle(md.type) }, h('span', {}, md.name || m.id), h('b', {}, `${m.pp}/${m.maxpp}`));
					})),
					h('div', { class: 'tc-stats' }, ...SN.map(([k, n]) => h('div', {}, h('span', {}, n), h('b', {}, sw.stats?.[k] ?? '–'))))));
			}
			const ov = h('div', { class: 'bteam' },
				h('div', { class: 'bteam-head' }, h('h2', {}, title), hint ? h('div', { class: 'bteam-hint' }, hint) : null),
				grid,
				back ? h('div', { class: 'bteam-foot' }, h('button', { class: 'btn', onclick: () => { close(); back(); } }, backLabel)) : null);
			root.append(ov);
			return close;
		};
		const showSwitch = (forced) => {
			panel.innerHTML = '';
			const blocked = o.trapped && !forced;
			const onTap = async (s, close) => {
				const p = G.party.find(x => x.uid === s.uid);
				const canSwitch = !s.fainted && !s.active && !blocked;
				const opts = [canSwitch ? (forced || o.shift ? 'Sacarlo' : 'Cambiar') : null, 'Ver todos sus datos', 'Cancelar'].filter(Boolean);
				const why = s.active ? ' · ya está en combate' : s.fainted ? ' · debilitado' : blocked ? ' · no puedes cambiar ahora' : '';
				const i = await choose(`${s.name} · Nv. ${s.lv} · ${s.hp}/${s.maxhp} PS${why}`, opts, { cancel: opts.length - 1 });
				if (opts[i] === 'Sacarlo' || opts[i] === 'Cambiar') { close(); resolve({ type: 'switch', idx: s.idx }); }
				else if (opts[i] === 'Ver todos sus datos' && p) {
					const { openSummary } = await import('./screens.js');
					openSummary(p, null, { battle: true, hp: s.hp, maxhp: s.maxhp, status: s.status });
				}
			};
			teamOverlay({
				title: 'Tu equipo',
				hint: blocked ? '¡No puedes cambiar de Pokémon ahora! Puedes mirar cómo están.' : o.shift ? '¿A quién quieres sacar?' : forced ? '¿Qué Pokémon vas a sacar?' : 'Toca un Pokémon para cambiarlo o ver todos sus datos.',
				onTap,
				back: o.shift ? () => resolve({ type: 'noshift' }) : forced ? null : showMain,
				backLabel: o.shift ? 'No cambiar' : 'Atrás',
			});
			log.innerHTML = blocked ? fmtText('¡No puedes cambiar de Pokémon ahora!') : o.shift ? '¿A quién quieres sacar?' : forced ? '¿Qué Pokémon vas a sacar?' : 'Elige un Pokémon.';
		};
		if (o.forceSwitch) showSwitch(true); else showMain();
	});

	// ---------- Bucle ----------
	// Entrada: el entrenador aparece en su sitio antes de sacar a su primer Pokémon
	await fx.intro(kind === 'wild' ? 'wild' : (trainer?.ai || 0) >= 4 ? 'boss' : 'trainer');
	if (trainer && trainerPortrait) {
		const big = h('div', { class: 'tintro' }, trainerPortrait());
		foeSprite.append(big);
		log.innerHTML = fmtText(`¡**${(trainer.cls ? trainer.cls + ' ' : '') + trainer.name}** quiere combatir!`);
		await wait(1100);
		big.classList.add('out');
		await sleep(280);
	}
	// Al empezar se ve primero al rival (el salvaje salta de la hierba con su texto) y luego sale tu Pokémon
	const opening = evs => {
		const i = evs.findIndex(e => e.t === 'switch' && e.side === 'p1'), j = evs.findIndex(e => e.t === 'switch' && e.side === 'p2');
		if (i < 0 || j < i) return evs;
		const out = evs.slice(), grp = out.splice(j, out[j + 1]?.t === 'text' ? 2 : 1);
		out.splice(i, 0, ...grp);
		if (kind === 'wild' && grp.length === 1 && out[i - 1]?.t === 'text') { grp[0].say = out[i - 1].s; out.splice(i - 1, 1); }
		return out;
	};
	await play(opening(ctl.start()));
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
	fx.destroy();
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
					h('span', { class: 'type', style: typeStyle(md.type) }, typeName(md.type))),
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
