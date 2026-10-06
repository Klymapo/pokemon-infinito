// Interfaz de los Pokémon únicos que vuelven: avisos de Rotom, combate de segunda oportunidad y lista.
import { D } from '../data.js';
import { C } from '../content.js';
import { G, saveGame } from '../state.js';
import { displayName } from '../pokemon.js';
import { healParty } from '../world.js';
import { tx } from '../guion.js';
import { h, say, choose, openSheet } from './core.js';
import { battle } from './screens.js';
import { moveReport } from '../movimientos.js';
import { uniqueWild, uniqueResult, uniquesList, placeName, uniquesDue, markAnnounced } from '../unicos.js';

const ROTOM = () => ({ id: 'rotom', ...(C.npcs.rotom || { name: 'Rotom' }) });
const spName = sp => D.species[sp]?.name || sp;
const joinY = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1];

const CATCH_HELP = ['falseswipe', 'holdback'];
const SLEEP_PARA = ['spore', 'sleeppowder', 'hypnosis', 'yawn', 'sing', 'lovelykiss', 'grasswhistle', 'darkvoid', 'thunderwave', 'stunspore', 'glare', 'nuzzle'];

function prepNotes() {
	const balls = Object.entries(G.bag).filter(([id]) => D.items[id]?.pocket === 'pokeballs').reduce((a, [, n]) => a + n, 0);
	const swiper = G.party.find(p => p.moves.some(m => CATCH_HELP.includes(m.id)));
	const sleeper = G.party.find(p => p.moves.some(m => SLEEP_PARA.includes(m.id)));
	const lines = [`Llevas **${balls}** Poké Balls en total.`];
	if (swiper) lines.push(`**${displayName(swiper)}** sabe ${D.moves[swiper.moves.find(m => CATCH_HELP.includes(m.id)).id].name}: perfecto para dejarlo con 1 PS.`);
	else {
		const R = moveReport('falseswipe');
		const who = [...R.recall, ...R.has].map(o => `${displayName(o.p)}${o.where === 'Equipo' ? '' : ' (' + o.where.toLowerCase() + ')'}`);
		lines.push(who.length
			? `Nadie de tu equipo sabe **Falso Tortazo**, pero ${joinY(who.slice(0, 3).map(n => '**' + n + '**'))} ${who.length > 1 ? 'pueden' : 'puede'} aprenderlo en el **Tutor de movimientos** (menú Más).`
			: 'Nadie de tu equipo sabe **Falso Tortazo**. Puedes buscar quién lo aprende en el **Tutor de movimientos** (menú Más).');
	}
	if (sleeper) lines.push(`${displayName(sleeper)} puede dormirlo o paralizarlo con ${D.moves[sleeper.moves.find(m => SLEEP_PARA.includes(m.id)).id].name}.`);
	return lines.join('\n');
}

/** Aviso de Rotom cuando vuelven (se llama desde render). */
export async function announceUniques(list) {
	markAnnounced(list.map(e => e.key));
	const byPlace = {};
	for (const e of list) (byPlace[e.where] ||= []).push(e);
	for (const [where, es] of Object.entries(byPlace)) {
		const names = es.map(e => `**${spName(e.sp)}**${e.origin ? ` (el de ${placeName(e.origin)})` : ''}`);
		await say(ROTOM(), tx(`¡Bzzt! ¡Alerta de Pokédex! ${es.length > 1 ? 'Han vuelto' : 'Ha vuelto'} ${joinY(names)}. ${es.length > 1 ? 'Los' : 'Lo'} detecto en **${placeName(where)}**.`));
	}
	await say(ROTOM(), tx('Esta vez ve preparad{o|a|e}: Poké Balls de sobra y algo que no lo debilite, como **Falso Tortazo**, o que lo duerma. Si se vuelve a escapar, regresará después de tu siguiente medalla.'));
	await saveGame();
}

/** Aviso único cuando el sistema registra encuentros antiguos (efecto retroactivo). */
export async function announceRetro(keys) {
	const names = keys.map(k => spName(k.split(':')[1]));
	await say(ROTOM(), tx(`¡Bzzt! Repasando mis registros he encontrado ${keys.length === 1 ? 'un Pokémon único que se nos escapó' : keys.length + ' Pokémon únicos que se nos escaparon'}: ${joinY(names.map(n => '**' + n + '**'))}.`));
	await say(ROTOM(), tx('No están perdidos. Volverán a aparecer después de tu **próxima medalla**, y te avisaré de dónde en cuanto los detecte. Puedes verlos en **Más › Segundas oportunidades**.'));
	await saveGame();
}

/** El combate de segunda oportunidad. */
export async function uniqueEncounter(key) {
	const e = G.uniq?.missed?.[key];
	const wild = uniqueWild(key);
	if (!e || !wild) return;
	const name = spName(e.sp);
	await say(ROTOM(), tx(`¡Bzzt! Ahí está: **${name}**, Nv. ${e.lv}. Es tu segunda oportunidad.\n${prepNotes()}`));
	const i = await choose(`¿Vas a por ${name}?`, ['¡Vamos a por él!', 'Todavía no, voy a prepararme']);
	if (i !== 0) { await say(ROTOM(), tx('Vale. No se moverá de aquí hasta que vuelvas.')); return; }
	const res = await battle({ wild, canRun: true, canLose: true });
	if (res.result === 'caught') {
		uniqueResult(key, 'caught');
		await say(ROTOM(), tx(`¡Bzzt! ¡Registrado! A la segunda, **${name}** ya es parte del equipo. Esta vez sí.`));
	} else {
		uniqueResult(key, res.result);
		if (res.result === 'lose') { healParty(); await say(null, tx(`${name} aprovecha el desastre y desaparece. Tu equipo se recupera poco a poco.`)); }
		else await say(null, tx(`${name} se escabulle y vuelve a esconderse.`));
		await say(ROTOM(), tx('No pasa nada. Volverá después de tu **siguiente medalla**, y te aviso.'));
	}
	await saveGame();
}

/** Más › Segundas oportunidades. */
export function openUniques() {
	const sheet = openSheet('Segundas oportunidades', null);
	const xs = uniquesList();
	sheet.set([
		h('div', { class: 'note' }, 'Los Pokémon únicos que se te escapan no se pierden: vuelven después de tu siguiente medalla y Rotom te avisa de dónde.'),
		xs.length ? h('div', { class: 'list' }, ...xs.map(e => h('div', { class: 'row' },
			h('div', { class: 'ico' }, '🐾'),
			h('div', { class: 'lbl' }, h('div', { class: 't' }, `${e.name} · Nv. ${e.lv}`),
				h('div', { class: 's' }, e.ready ? `Te espera en ${placeName(e.where)}` : `Volverá después de tu próxima medalla${e.origin ? ` · Se escapó en ${placeName(e.origin)}` : ''}`)))))
			: h('div', { class: 'empty' }, 'No se te ha escapado ningún Pokémon único. ¡Bien hecho!'),
	]);
}

export { uniquesDue };
