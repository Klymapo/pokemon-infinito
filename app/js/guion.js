// Intérprete de guiones (diálogos, decisiones, combates, recompensas...).
// Formato de comandos: ver docs/CONTENIDO.md
import { D, toID } from './data.js';
import { C, npc } from './content.js';
import { G, evalCond, setPath, addItem, removeItem, count, markCaught, saveGame } from './state.js';
import { createPokemon, displayName, healFull, addHappy, maxHp } from './pokemon.js';

export const UI = {}; // lo rellena la interfaz: say, choose, battle, toast, prompt, refresh, goto, receivePokemon, learnMove, nickname

class Abort extends Error {}

/** Sustituye marcadores en textos: {jugador}, {riolu}, {o|a|e} según pronombres, {dinero}. */
export function tx(s) {
	if (!s) return '';
	const pron = G?.player?.pron || 'el';
	const pi = pron === 'ella' ? 1 : pron === 'elle' ? 2 : 0;
	return String(s)
		.replace(/\{jugador\}/g, G?.player?.name || '')
		.replace(/\{riolu\}/g, () => {
			const p = findRiolu();
			return p ? displayName(p) : 'Riolu';
		})
		.replace(/\{dinero\}/g, () => '₽' + (G?.player?.money || 0))
		.replace(/\{([^{}|]*)\|([^{}|]*)\|([^{}|]*)\}/g, (m, a, b, c) => [a, b, c][pi]);
}

export function findRiolu() {
	const uid = G?.vars?.riolu_uid;
	if (!uid) return null;
	return G.party.find(p => p.uid === uid) || G.boxes.flat().find(p => p.uid === uid) || null;
}

function findMon(who) {
	if (!who) return G.party[0];
	if (who === 'riolu') return findRiolu();
	if (/^party\d$/.test(who)) return G.party[+who.slice(5)];
	const id = toID(who);
	return G.party.find(p => p.sp === id || D.species[p.sp]?.base === id) || G.party.find(p => p.uid === who);
}

export async function runScript(idOrCmds, ctx = {}) {
	const cmds = typeof idOrCmds === 'string' ? C.scripts[idOrCmds] : idOrCmds;
	if (typeof idOrCmds === 'string') UI.onScript?.(idOrCmds);
	if (!cmds) { console.warn('Guion inexistente', idOrCmds); return; }
	try {
		await runList(cmds, ctx);
	} catch (e) {
		if (!(e instanceof Abort)) { console.error(e); UI.toast?.('Error en guion: ' + e.message); }
	} finally {
		UI.refresh?.();
	}
}

async function runList(list, ctx) {
	for (const c of list) {
		if (ctx.ended) return;
		await runCmd(c, ctx);
	}
}

async function runCmd(c, ctx) {
	if (typeof c === 'string') { await UI.say(null, tx(c)); return; }
	if (c.cond !== undefined && !evalCond(c.cond)) return;

	if (c.say !== undefined) {
		const n = c.say === 'jugador' ? { name: G.player.name, portrait: 'jugador' } : c.say ? npc(c.say) : null;
		await UI.say(n ? { id: c.say, ...n, name: tx(c.as || n.name) } : null, tx(c.text), c);
		return;
	}
	if (c.text !== undefined) { await UI.say(null, tx(c.text), c); return; }
	if (c.choice) {
		const opts = c.choice.filter(o => o.cond === undefined || evalCond(o.cond));
		const i = await UI.choose(c.prompt ? tx(c.prompt) : null, opts.map(o => tx(o.text)), c);
		const o = opts[i];
		if (o?.then) await runList(o.then, ctx);
		return;
	}
	if (c.if !== undefined) {
		if (evalCond(c.if)) { if (c.then) await runList(c.then, ctx); } else if (c.else) await runList(c.else, ctx);
		return;
	}
	if (c.set) { for (const k in c.set) setPath(k, c.set[k]); return; }
	if (c.rep) { for (const k in c.rep) setPath('rep.' + k, (c.rep[k] >= 0 ? '+' : '') + c.rep[k]); return; }
	if (c.af) {
		for (const k in c.af) setPath('af.' + k, (c.af[k] >= 0 ? '+' : '') + c.af[k]);
		return;
	}
	if (c.give) {
		const n = c.n || 1;
		addItem(c.give, n);
		const it = D.items[toID(c.give)];
		if (!c.silent) await UI.say(null, `¡${G.player.name} ha obtenido **${it?.name || c.give}**${n > 1 ? ' ×' + n : ''}!`, { jingle: 'item' });
		return;
	}
	if (c.take) { removeItem(c.take, c.n || 1); return; }
	if (c.money !== undefined) {
		G.player.money = Math.max(0, G.player.money + c.money);
		if (!c.silent) await UI.say(null, c.money >= 0 ? `¡Has recibido ₽${c.money}!` : `Has pagado ₽${-c.money}.`);
		return;
	}
	if (c.pokemon) {
		const o = c.pokemon;
		const p = createPokemon(o.sp, { ot: G.player.name, metAt: G.loc, ...o, level: o.level ?? o.lv });
		if (o.uidVar) G.vars[o.uidVar] = p.uid;
		markCaught(p.sp);
		await UI.receivePokemon(p, { silent: c.silent, nickname: c.nickname !== false });
		return;
	}
	if (c.battle) {
		const res = await UI.battle({ trainer: c.battle, canLose: c.lose === 'continue' || !!c.onLose });
		ctx.lastBattle = res;
		if (res.result === 'win') { if (c.onWin) await runList(c.onWin, ctx); }
		else if (c.onLose) await runList(c.onLose, ctx);
		else if (res.result === 'lose' && c.lose !== 'continue') throw new Abort();
		return;
	}
	if (c.wild) {
		const res = await UI.battle({ wild: c.wild, canRun: c.canRun !== false, canLose: !!c.onLose || c.lose === 'continue' });
		ctx.lastBattle = res;
		if (res.result === 'caught' && c.onCatch) await runList(c.onCatch, ctx);
		else if ((res.result === 'win' || res.result === 'caught') && c.onWin) await runList(c.onWin, ctx);
		else if (res.result === 'run' && c.onRun) await runList(c.onRun, ctx);
		else if (res.result === 'lose') { if (c.onLose) await runList(c.onLose, ctx); else if (c.lose !== 'continue') throw new Abort(); }
		return;
	}
	if (c.heal) {
		for (const p of G.party) healFull(p);
		if (!c.silent) await UI.say(null, c.heal === true ? 'Tu equipo ha recuperado todas sus fuerzas.' : tx(c.heal));
		return;
	}
	if (c.go) { await UI.goto(c.go, { silent: c.silent }); return; }
	if (c.quest) {
		const q = (G.quests[c.quest] ||= { stage: '', started: Date.now() });
		if (q.done) return; // una misión terminada no se reabre ni se vuelve a completar
		const def = C.quests[c.quest];
		const isNew = !q.stage && !q.done;
		if (c.stage && c.stage !== q.stage) { q.stage = c.stage; (q.hist ||= []).push({ s: c.stage, t: Date.now() }); }
		if (c.done) { q.done = true; q.stage = c.stage || q.stage || 'hecha'; q.finished = Date.now(); }
		if (!c.silent && def) {
			if (c.done) UI.toast?.(`✔ Misión completada: ${def.name}`, 'quest');
			else if (isNew) UI.toast?.(`📜 Nueva misión: ${def.name}`, 'quest');
			else UI.toast?.(`📜 ${def.name}: actualizada`, 'quest');
		}
		return;
	}
	if (c.diary) {
		G.diary.push({ t: Date.now(), text: tx(c.diary), loc: G.loc });
		if (!c.silent) UI.toast?.('📔 Nueva entrada en el Diario', 'diary');
		return;
	}
	if (c.intel) {
		const k = c.intel.npc;
		(G.intel[k] ||= { notes: [], teams: {} }).notes.push({ t: Date.now(), text: tx(c.intel.text) });
		if (!c.silent) UI.toast?.(`📁 Expediente actualizado: ${npc(k).name}`, 'intel');
		return;
	}
	if (c.badge) {
		if (!G.player.badges.includes(c.badge)) G.player.badges.push(c.badge);
		const b = C.badges[c.badge];
		await UI.say(null, `¡${G.player.name} ha recibido la **${b?.name || c.badge}**!`, { jingle: 'badge', badge: c.badge });
		return;
	}
	if (c.cap !== undefined) { G.vars.cap = c.cap; return; }
	if (c.call) { UI.onScript?.(c.call); await runList(C.scripts[c.call] || [], ctx); return; }
	if (c.end) { ctx.ended = true; return; }
	if (c.notice) { UI.toast?.(tx(c.notice)); return; }
	if (c.toast) { UI.toast?.(tx(c.toast)); return; }
	if (c.scene !== undefined) { UI.scene?.(c.scene); return; }
	if (c.wait) { await new Promise(r => setTimeout(r, c.wait)); return; }
	if (c.happy) {
		const p = findMon(c.happy.who);
		if (p) addHappy(p, c.happy.n || 10);
		return;
	}
	if (c.learn) {
		const p = findMon(c.learn.who);
		if (p) await UI.learnMove(p, toID(c.learn.move), { force: c.learn.force });
		return;
	}
	if (c.forceEvolve) {
		const p = findMon(c.forceEvolve.who);
		if (p && p.sp !== toID(c.forceEvolve.to)) await UI.forceEvolve(p, toID(c.forceEvolve.to));
		return;
	}
	if (c.unlock) { G.flags['mec_' + c.unlock] = true; return; }
	if (c.shop) { await UI.shop(c.shop); return; }
	if (c.save) { await saveGame(); return; }
	if (c.evolveCheck) { await UI.evolveCheck?.(); return; }
	if (c.nickname) { const p = c.nickname === 'last' ? G.party[G.party.length - 1] : findMon(c.nickname); if (p) await UI.nickname(p); return; }
	if (c.center) { await UI.center?.(); return; }
	if (c.pc) { await UI.pc?.(); return; }
	if (c.mapUnlock) { G.flags['map_' + c.mapUnlock] = true; return; }
	if (c.clearRoute) { G.cleared[c.clearRoute] = true; return; }
	if (c.cutscene) { await UI.cutscene?.(c.cutscene); return; }
	if (c.input) {
		const v = await UI.prompt(tx(c.input.text), c.input.default || '');
		if (c.input.var) G.vars[c.input.var] = v;
		return;
	}
	console.warn('Comando desconocido', c);
}

/** Ejecuta el primer guion cuya condición se cumpla (para NPCs con varias conversaciones). */
export async function runFirst(variants, ctx) {
	for (const v of variants) {
		if (v.cond === undefined || evalCond(v.cond)) {
			await runScript(v.script || v.do, ctx);
			return true;
		}
	}
	return false;
}
