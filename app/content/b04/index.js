// Bloque 4 · Acto III: La señal. Une las partes del bloque.
import npcs from './npcs.js';
import comun from './comun.js';
import misiones from './misiones.js';
import t0 from './t0-azafran.js';
import t1 from './t1-celeste.js';
import t2 from './t2-silph.js';
import t3 from './t3-cueva.js';
import t4 from './t4-lola.js';

const block = {
	id: 'b04', title: 'Acto III · La señal', hours: 12, ends: 'b04_fin',
	regions: { kanto: { name: 'Kanto', h: 100, land: 'M6,30 L18,14 L40,6 L66,4 L88,10 L97,28 L96,56 L90,78 L74,94 L48,97 L24,92 L8,78 L3,54 Z' } },
	npcs, quests: misiones,
	locations: {}, trainers: {}, scripts: {}, challenges: {}, badges: {}, shops: {}, items: {}, events: [], milestones: [],
	gather: {}, patches: {},
};
const extraSpots = {};
for (const part of [comun, t0, t1, t2, t3, t4]) {
	for (const k of ['locations', 'trainers', 'scripts', 'challenges', 'badges', 'shops', 'items', 'quests', 'npcs', 'gather']) {
		for (const id in part[k] || {}) {
			if (block[k][id] && k !== 'npcs') console.warn(`[b04] ${k} duplicado: ${id}`);
			block[k][id] = part[k][id];
		}
	}
	block.events.push(...(part.events || []));
	block.milestones.push(...(part.milestones || []));
	for (const loc in part.extraSpots || {}) (extraSpots[loc] ||= []).push(...part.extraSpots[loc]);
	// Parches a lugares del B1: se acumulan (varios tramos pueden tocar el mismo lugar)
	for (const loc in part.patches || {}) {
		const p = part.patches[loc], acc = (block.patches[loc] ||= {});
		for (const k in p) {
			if (k === 'route') {
				const r = (acc.route ||= {});
				for (const kk in p.route) {
					if (kk === 'tramos') { r.tramos ||= {}; for (const n in p.route.tramos) r.tramos[n] = (r.tramos[n] || []).concat(p.route.tramos[n]); }
					else if (kk === 'encounters') { r.encounters ||= {}; for (const t in p.route.encounters) r.encounters[t] = (r.encounters[t] || []).concat(p.route.encounters[t]); }
					else r[kk] = p.route[kk];
				}
			} else if (Array.isArray(p[k])) acc[k] = (acc[k] || []).concat(p[k]);
			else acc[k] = p[k];
		}
	}
}
for (const loc in extraSpots) {
	if (block.locations[loc]) block.locations[loc].spots = (block.locations[loc].spots || []).concat(extraSpots[loc]);
	else console.warn('[b04] extraSpots para lugar inexistente: ' + loc);
}
export default block;
