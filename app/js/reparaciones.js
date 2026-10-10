// Reparaciones de partidas: arreglos puntuales de estados a los que una versión con un fallo dejó llegar.
// Cada una se aplica una sola vez (G.fixes[id]) y solo si reconoce exactamente el estado roto.
import { G } from './state.js';
import { C } from './content.js';

const FIXES = {
	// 2026-10-10: «Ir» desde Novedades dejaba entrar en un sitio de Azafrán antes de que la historia abriera su entrada.
	// Si se entró así (sin la escena que abre la entrada) y no se pasó de ahí, se deshace: la historia lo abrirá a su tiempo.
	p7_entrada_adelantada() {
		const f = G.flags;
		if (!f.b04_azotea_llegada || f.b04_tejado_inicio || f.b04_salto) return false;
		for (const k of ['b04_azotea_llegada', 'enter:azotea_lemnis:b04_azotea_llegada', 'b04_obs_cornisa', 'b04_obs_antena', 'b04_obs_deposito', 'b04_entrada_lista', 'b04_toni_plano', 'b04_atlas_tarjeta', 'b04_handsome_declaracion']) delete f[k];
		for (const q of ['b04_m4', 'b04_q_tejado']) {
			const st = G.quests[q];
			if (!st || st.done) continue;
			const hist = (st.hist || []).filter(x => !['dentro', 'mirar'].includes(x.s));
			if (hist.length) { st.hist = hist; st.stage = hist[hist.length - 1].s; } else delete G.quests[q];
		}
		for (const t of ['tejado_vigilante', 'tejado_tecnica']) delete G.beaten[t];
		delete G.visited.azotea_lemnis;
		if (G.settings?.tracked) G.settings.tracked = G.settings.tracked.filter(q => G.quests[q]);
		if (G.loc === 'azotea_lemnis') { G.loc = 'azafran'; G.route = null; }
		return 'Rotom ha deshecho un salto en la historia que un fallo te dejó dar en Azafrán. No has perdido nada: ese sitio se abrirá cuando toque.';
	},
};

/** Aplica las reparaciones pendientes. Devuelve los avisos para enseñar al jugador. */
export function repairSave() {
	if (!G) return [];
	G.fixes ||= {};
	const notes = [];
	for (const id in FIXES) {
		if (G.fixes[id]) continue;
		try { const r = FIXES[id](); G.fixes[id] = r ? Date.now() : 0; if (r) notes.push(r); else delete G.fixes[id]; } catch (e) { console.error('reparación', id, e); }
	}
	// Si estás en un lugar que ya no existe o quedó inválido, vuelve al último Centro
	if (!C.locations[G.loc]) { G.loc = G.lastCenter && C.locations[G.lastCenter] ? G.lastCenter : Object.keys(C.locations)[0]; G.route = null; }
	return notes;
}
