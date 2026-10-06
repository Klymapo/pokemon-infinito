// Bloque 2 · Acto II: Ecos del pasado. Une las partes del bloque.
import npcs from './npcs.js';
import comun from './comun.js';
import misiones from './misiones.js';
import t0 from './t0-kalos.js';
import t1 from './t1-encinar.js';
import t2 from './t2-trigal.js';
import t3 from './t3-iris.js';

const block = {
	id: 'b02', title: 'Acto II · Ecos del pasado', hours: 12, ends: 'b02_fin',
	regions: { johto: { name: 'Johto', h: 120, land: 'M4,40 L14,24 L34,10 L58,4 L80,8 L95,20 L97,46 L92,70 L80,92 L58,110 L38,116 L16,110 L5,92 L2,66 Z' } },
	npcs, quests: misiones,
	locations: {}, trainers: {}, scripts: {}, challenges: {}, badges: {}, shops: {}, items: {}, events: [], milestones: [],
	gather: {}, patches: {},
};
const extraSpots = {};
for (const part of [comun, t0, t1, t2, t3]) {
	for (const k of ['locations', 'trainers', 'scripts', 'challenges', 'badges', 'shops', 'items', 'quests', 'npcs', 'gather']) {
		for (const id in part[k] || {}) {
			if (block[k][id] && k !== 'npcs') console.warn(`[b02] ${k} duplicado: ${id}`);
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
	else console.warn('[b02] extraSpots para lugar inexistente: ' + loc);
}
export default block;
