// Bloque 1 · Acto I: Fisuras. Une las partes del bloque.
import npcs from './npcs.js';
import comun from './comun.js';
import misiones from './misiones.js';
import eventos from './eventos.js';
import t0 from './t0-luminalia.js';
import t1 from './t1-novarte.js';
import t2 from './t2-costa.js';
import t3 from './t3-yantra.js';

const block = {
	id: 'b01', title: 'Acto I · Fisuras', hours: 12, start: 'b01_inicio', ends: 'b01_fin',
	regions: { kalos: { name: 'Kalos', h: 140, land: 'M3,26 L22,12 L48,8 L70,10 L92,22 L97,52 L94,84 L84,112 L66,138 L44,139 L22,132 L8,118 L1,96 L2,60 Z' } },
	npcs, quests: misiones,
	locations: {}, trainers: {}, scripts: {}, challenges: {}, badges: {}, shops: {}, items: {}, events: [], milestones: [],
};
const extraSpots = {};
for (const part of [comun, eventos, t0, t1, t2, t3]) {
	for (const k of ['locations', 'trainers', 'scripts', 'challenges', 'badges', 'shops', 'items', 'quests', 'npcs']) {
		for (const id in part[k] || {}) {
			if (block[k][id] && k !== 'npcs') console.warn(`[b01] ${k} duplicado: ${id}`);
			block[k][id] = part[k][id];
		}
	}
	block.events.push(...(part.events || []));
	block.milestones.push(...(part.milestones || []));
	for (const loc in part.extraSpots || {}) (extraSpots[loc] ||= []).push(...part.extraSpots[loc]);
}
for (const loc in extraSpots) {
	if (block.locations[loc]) block.locations[loc].spots = (block.locations[loc].spots || []).concat(extraSpots[loc]);
	else console.warn('[b01] extraSpots para lugar inexistente: ' + loc);
}
export default block;
