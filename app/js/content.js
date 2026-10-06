// Registro de contenido (bloques de historia). Ver docs/CONTENIDO.md para el formato.
import { D, toID } from './data.js';

export const C = {
	blocks: [], regions: {}, locations: {}, npcs: {}, trainers: {}, quests: {}, scripts: {}, shops: {},
	challenges: {}, events: [], milestones: [], badges: {}, gather: {}, version: '',
};

function mergeLocation(base, patch) {
	for (const k in patch) {
		if (Array.isArray(patch[k]) && Array.isArray(base[k])) base[k] = base[k].concat(patch[k]);
		else if (k === 'route' && base.route) {
			const r = base.route, pr = patch.route;
			for (const kk in pr) {
				if (kk === 'tramos') {
					r.tramos ||= {};
					for (const n in pr.tramos) r.tramos[n] = [].concat(r.tramos[n] || [], pr.tramos[n]);
				} else if (kk === 'encounters') {
					r.encounters ||= {};
					for (const t in pr.encounters) r.encounters[t] = (r.encounters[t] || []).concat(pr.encounters[t]);
				} else r[kk] = pr[kk];
			}
		} else base[k] = patch[k];
	}
}

/** Registra un bloque de contenido. */
export function registerBlock(b) {
	C.blocks.push({ id: b.id, title: b.title, hours: b.hours, ends: b.ends, next: b.next, start: b.start });
	Object.assign(C.regions, b.regions || {});
	for (const id in b.locations || {}) C.locations[id] = { id, ...b.locations[id] };
	for (const id in b.patches || {}) { if (C.locations[id]) mergeLocation(C.locations[id], b.patches[id]); }
	Object.assign(C.npcs, b.npcs || {});
	for (const id in b.trainers || {}) C.trainers[id] = { id, ...b.trainers[id] };
	for (const id in b.quests || {}) C.quests[id] = { id, ...b.quests[id] };
	Object.assign(C.scripts, b.scripts || {});
	Object.assign(C.shops, b.shops || {});
	Object.assign(C.gather, b.gather || {});
	for (const id in b.challenges || {}) C.challenges[id] = { id, ...b.challenges[id] };
	Object.assign(C.badges, b.badges || {});
	C.events.push(...(b.events || []));
	C.milestones.push(...(b.milestones || []).map(m => ({ ...m, block: b.id })));
	// Objetos propios del juego (clave, etc.)
	for (const id in b.items || {}) D.items[toID(id)] = { pocket: 'key', cost: 0, ...b.items[id], custom: true };
	// El Cordón Unión viene sin descripción en los datos: sustituye al intercambio para evolucionar.
	if (D.items.linkingcord && !D.items.linkingcord.desc) D.items.linkingcord.desc = 'Un cordón misterioso. Hace evolucionar a los Pokémon que normalmente lo harían al intercambiarse, y a algunos con condiciones especiales.';
	// Vínculos simétricos en el mapa
	for (const id in b.locations || {}) {
		const L = C.locations[id];
		for (const n of L.links || []) {
			const o = C.locations[n] || b.locations[n];
			if (o) { o.links ||= []; if (!o.links.includes(id)) o.links.push(id); }
		}
	}
}

export async function loadContent() {
	const mod = await import('../content/index.js');
	C.version = mod.CONTENT_VERSION;
	for (const b of mod.BLOCKS) registerBlock(b);
	return C;
}

export const loc = id => C.locations[id];
export const npc = id => C.npcs[id] || { name: id };
export const trainer = id => C.trainers[id];
/** Ubicación "de mapa" (las sub-áreas apuntan a su padre). */
export function topLoc(id) {
	let L = C.locations[id];
	let guard = 0;
	while (L?.parent && guard++ < 5) L = C.locations[L.parent];
	return L;
}
