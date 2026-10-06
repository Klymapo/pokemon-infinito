// Bloque 3 · Acto II: Lo que el tiempo se llevó. Une las partes del bloque.
import npcs from './npcs.js';
import comun from './comun.js';
import misiones from './misiones.js';
import t0 from './t0-ruinas.js';
import t1 from './t1-faro.js';
import t2 from './t2-rancho.js';
import t3 from './t3-caoba.js';

const block = {
	id: 'b03', title: 'Acto II · Lo que el tiempo se llevó', hours: 12, ends: 'b03_fin',
	regions: {},
	npcs, quests: misiones,
	locations: {}, trainers: {}, scripts: {}, challenges: {}, badges: {}, shops: {}, items: {}, events: [], milestones: [],
	gather: {}, patches: {},
};
const extraSpots = {};
for (const part of [comun, t0, t1, t2, t3]) {
	for (const k of ['locations', 'trainers', 'scripts', 'challenges', 'badges', 'shops', 'items', 'quests', 'npcs', 'gather']) {
		for (const id in part[k] || {}) {
			if (block[k][id] && k !== 'npcs') console.warn(`[b03] ${k} duplicado: ${id}`);
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
	else console.warn('[b03] extraSpots para lugar inexistente: ' + loc);
}
export default block;
