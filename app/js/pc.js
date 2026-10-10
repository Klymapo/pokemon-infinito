// Lógica del PC sin interfaz: mover varios Pokémon a la vez, reordenar cajas y ponerles nombre.
// (Pedido de Mario, publicación 7.) La usa openPC en ui/screens.js y se prueba en herramientas/test/pc-multi-test.mjs.
import { BOX_MAX } from './state.js';
import { healFull } from './pokemon.js';

export const BOX_NAME_MAX = 12;

/** Los nombres van en G.boxNames, un array paralelo a G.boxes (null o '' = sin nombre). */
function names(G) {
	if (!Array.isArray(G.boxNames)) G.boxNames = [];
	while (G.boxNames.length < G.boxes.length) G.boxNames.push(null);
	return G.boxNames;
}
export function hasBoxName(G, i) { return !!(Array.isArray(G.boxNames) && G.boxNames[i]); }
export function boxName(G, i) { return hasBoxName(G, i) ? G.boxNames[i] : `Caja ${i + 1}`; }
export function setBoxName(G, i, name) {
	if (i < 0 || i >= G.boxes.length) return false;
	names(G)[i] = String(name || '').trim().slice(0, BOX_NAME_MAX) || null;
	return true;
}

/** Saca la caja `from` y la pone en la posición `to`; las demás se recorren. El nombre viaja con ella. Devuelve la nueva posición. */
export function moveBox(G, from, to) {
	const n = G.boxes.length;
	if (!(from >= 0 && from < n)) return from;
	to = Math.max(0, Math.min(n - 1, to));
	if (to === from) return from;
	const N = names(G);
	const [b] = G.boxes.splice(from, 1); G.boxes.splice(to, 0, b);
	const [nm] = N.splice(from, 1); N.splice(to, 0, nm);
	return to;
}
/** Intercambia de sitio dos cajas (con sus nombres). */
export function swapBoxes(G, a, b) {
	const n = G.boxes.length;
	if (!(a >= 0 && a < n && b >= 0 && b < n) || a === b) return false;
	const N = names(G);
	[G.boxes[a], G.boxes[b]] = [G.boxes[b], G.boxes[a]];
	[N[a], N[b]] = [N[b], N[a]];
	return true;
}

/** Dónde está un Pokémon (objeto o uid): { where: 'party'|'box', box, idx, mon } o null. */
export function locate(G, ref) {
	const is = m => m === ref || (typeof ref === 'string' && m && m.uid === ref);
	let idx = G.party.findIndex(is);
	if (idx >= 0) return { where: 'party', box: -1, idx, mon: G.party[idx] };
	for (let b = 0; b < G.boxes.length; b++) {
		idx = G.boxes[b].findIndex(is);
		if (idx >= 0) return { where: 'box', box: b, idx, mon: G.boxes[b][idx] };
	}
	return null;
}

/**
 * Mueve varios Pokémon (objetos o uids, en el orden dado) a un destino:
 *   { where: 'box', box: n }                  entran mientras quepan
 *   { where: 'box', box: n, overflow: true }  los que no quepan van a la siguiente caja con hueco
 *   { where: 'party' }                        mientras haya hueco en el equipo (6)
 * Reglas: el equipo nunca se queda vacío y quien pasa del equipo a una caja se cura del todo.
 * Devuelve { moved, noRoom, kept, already }: movidos, los que no caben, los que se quedan para no vaciar el equipo
 * y los que ya estaban en el destino.
 */
export function moveMany(G, sel, dest) {
	const out = { moved: [], noRoom: [], kept: [], already: [] };
	const seen = new Set();
	for (const ref of sel || []) {
		const at = locate(G, ref);
		if (!at || seen.has(at.mon)) continue;
		seen.add(at.mon);
		const p = at.mon;
		if (dest.where === 'party') {
			if (at.where === 'party') { out.already.push(p); continue; }
			if (G.party.length >= 6) { out.noRoom.push(p); continue; }
			G.boxes[at.box].splice(at.idx, 1);
			G.party.push(p);
			out.moved.push(p);
			continue;
		}
		if (at.where === 'box' && at.box === dest.box) { out.already.push(p); continue; }
		let b = dest.box;
		if (!G.boxes[b]) { out.noRoom.push(p); continue; }
		if (G.boxes[b].length >= BOX_MAX) {
			b = -1;
			if (dest.overflow) {
				for (let k = 1; k < G.boxes.length; k++) {
					const c = (dest.box + k) % G.boxes.length;
					if (G.boxes[c].length < BOX_MAX && !(at.where === 'box' && at.box === c)) { b = c; break; }
				}
			}
			if (b < 0) { out.noRoom.push(p); continue; }
		}
		if (at.where === 'party') {
			if (G.party.length <= 1) { out.kept.push(p); continue; }
			G.party.splice(at.idx, 1);
			healFull(p);
		} else G.boxes[at.box].splice(at.idx, 1);
		G.boxes[b].push(p);
		out.moved.push(p);
	}
	return out;
}
