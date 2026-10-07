// Puzles de rejilla (lógica pura, sin DOM): la usan la interfaz (ui/rejilla.js), el bot, el validador y las pruebas.
//
// Un puzle se define en el contenido con una lista de filas de texto (máx. 9×9). Cada carácter es una casilla:
//   #  pared                      .  suelo
//   P  inicio del jugador         G  meta (llegar aquí resuelve el puzle)
//   R  roca empujable (sobre suelo; para empujarla basta caminar contra ella, como con Fuerza)
//   I  hielo: el jugador y las rocas resbalan hasta chocar o salir del hielo
//   S  interruptor: está pulsado mientras tiene una roca encima
//   D  puerta: se abre cuando TODOS los interruptores están pulsados
//   H  hoyo: no se puede pisar; una roca empujada dentro lo tapa y desaparece (queda suelo)
//   ~  agua (decorativa, no se pisa)    *  roca fija (no se mueve; decorativa)
// Para poner una roca encima de hielo, de un interruptor o de la meta, usa `rocks: [[x, y], …]` en la definición.

export const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
export const DIR_KEYS = ['up', 'down', 'left', 'right'];
export const MAX_SIZE = 9;

const TILE = { '#': 'wall', '.': 'floor', P: 'floor', G: 'goal', R: 'floor', I: 'ice', S: 'switch', D: 'door', H: 'hole', '~': 'water', '*': 'stone' };

/** Convierte la definición en { w, h, tiles[y][x], start, rocks:Set, errors }. */
export function parsePuzzle(def) {
	const errors = [];
	const rows = Array.isArray(def?.grid) ? def.grid.map(String) : [];
	if (!rows.length) errors.push('sin rejilla (grid)');
	const h = rows.length, w = Math.max(0, ...rows.map(r => r.length));
	if (w > MAX_SIZE || h > MAX_SIZE) errors.push(`rejilla de ${w}×${h}: el máximo es ${MAX_SIZE}×${MAX_SIZE}`);
	const tiles = [], rocks = new Set();
	let start = null, goals = 0;
	for (let y = 0; y < h; y++) {
		tiles.push([]);
		for (let x = 0; x < w; x++) {
			const ch = rows[y][x] ?? '#';
			const t = TILE[ch];
			if (!t) { errors.push(`carácter desconocido «${ch}» en (${x}, ${y})`); tiles[y].push('wall'); continue; }
			tiles[y].push(t);
			if (ch === 'P') { if (start) errors.push('más de un inicio P'); start = [x, y]; }
			if (ch === 'R') rocks.add(x + ',' + y);
			if (ch === 'G') goals++;
		}
	}
	for (const r of def?.rocks || []) {
		const [x, y] = r;
		if (!(x >= 0 && y >= 0 && x < w && y < h) || ['wall', 'hole', 'water', 'stone', 'door'].includes(tiles[y][x])) errors.push(`roca extra fuera de sitio en (${x}, ${y})`);
		else rocks.add(x + ',' + y);
	}
	if (!start) errors.push('falta el inicio P');
	if (!goals) errors.push('falta la meta G');
	return { w, h, tiles, start, rocks, errors };
}

/** Estado inicial: posición del jugador, rocas y hoyos tapados. */
export function initState(P) {
	return { x: P.start?.[0] ?? 0, y: P.start?.[1] ?? 0, rocks: new Set(P.rocks), filled: new Set(), moves: 0, solved: false };
}

const key = (x, y) => x + ',' + y;
export function tileAt(P, S, x, y) {
	if (x < 0 || y < 0 || x >= P.w || y >= P.h) return 'wall';
	const t = P.tiles[y][x];
	if (t === 'hole' && S.filled.has(key(x, y))) return 'floor';
	return t;
}
/** ¿Están todos los interruptores pulsados? (si no hay interruptores, las puertas están abiertas) */
export function doorsOpen(P, S) {
	for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) if (P.tiles[y][x] === 'switch' && !S.rocks.has(key(x, y))) return false;
	return true;
}
const solid = (t, open) => t === 'wall' || t === 'water' || t === 'stone' || (t === 'door' && !open);

/** Casilla a la que puede entrar una roca (sin rocas, sin paredes, puerta abierta; los hoyos la tragan). */
function rockCanEnter(P, S, x, y, open) {
	const t = tileAt(P, S, x, y);
	if (solid(t, open) || S.rocks.has(key(x, y))) return false;
	return true;
}

/**
 * Intenta mover al jugador en una dirección. Devuelve { state, moved, events } sin modificar el estado original.
 * events: 'push' (empujó roca), 'fill' (tapó un hoyo), 'slide' (resbaló), 'door' (cambió alguna puerta), 'goal'.
 */
export function step(P, S0, dir) {
	const [dx, dy] = DIRS[dir] || [0, 0];
	const S = { ...S0, rocks: new Set(S0.rocks), filled: new Set(S0.filled) };
	const events = [];
	if (S.solved || (!dx && !dy)) return { state: S0, moved: false, events };
	const wasOpen = doorsOpen(P, S);
	let moved = false;
	let first = true;
	while (true) {
		const nx = S.x + dx, ny = S.y + dy;
		const open = doorsOpen(P, S);
		const t = tileAt(P, S, nx, ny);
		if (solid(t, open) || t === 'hole') break;
		if (S.rocks.has(key(nx, ny))) {
			if (!first) break; // resbalando no se empujan rocas
			// empujar la roca: avanza una casilla, o resbala si está sobre hielo
			let rx = nx + dx, ry = ny + dy;
			if (!rockCanEnter(P, S, rx, ry, open)) break;
			S.rocks.delete(key(nx, ny));
			while (tileAt(P, S, rx, ry) === 'ice' && rockCanEnter(P, S, rx + dx, ry + dy, open)) { rx += dx; ry += dy; }
			if (tileAt(P, S, rx, ry) === 'hole') { S.filled.add(key(rx, ry)); events.push('fill'); }
			else S.rocks.add(key(rx, ry));
			events.push('push');
		}
		S.x = nx; S.y = ny; moved = true;
		if (!first) { if (!events.includes('slide')) events.push('slide'); }
		first = false;
		if (tileAt(P, S, S.x, S.y) === 'goal') break;
		if (tileAt(P, S, S.x, S.y) !== 'ice') break;
	}
	if (!moved) return { state: S0, moved: false, events: [] };
	S.moves = (S0.moves || 0) + 1;
	if (doorsOpen(P, S) !== wasOpen) events.push('door');
	if (tileAt(P, S, S.x, S.y) === 'goal') { S.solved = true; events.push('goal'); }
	return { state: S, moved: true, events };
}

const sig = S => S.x + ',' + S.y + '|' + [...S.rocks].sort().join(';') + '|' + [...S.filled].sort().join(';');

/** Resuelve por búsqueda en anchura. Devuelve la lista de direcciones más corta o null. */
export function solve(P, { limit = 200000 } = {}) {
	if (P.errors?.length) return null;
	const s0 = initState(P);
	const seen = new Set([sig(s0)]);
	let frontier = [{ s: s0, path: [] }], n = 0;
	while (frontier.length) {
		const next = [];
		for (const { s, path } of frontier) {
			for (const d of DIR_KEYS) {
				const r = step(P, s, d);
				if (!r.moved) continue;
				if (r.state.solved) return [...path, d];
				const k = sig(r.state);
				if (seen.has(k)) continue;
				seen.add(k);
				if (++n > limit) return null;
				next.push({ s: r.state, path: [...path, d] });
			}
		}
		frontier = next;
	}
	return null;
}

/** ¿Hay algún estado alcanzable desde el que ya no se pueda llegar a la meta? (para avisar de puzles que exigen «Reiniciar») */
export function canSoftlock(P, { limit = 20000 } = {}) {
	const s0 = initState(P);
	const seen = new Map([[sig(s0), s0]]);
	let frontier = [s0];
	while (frontier.length && seen.size < limit) {
		const next = [];
		for (const s of frontier) for (const d of DIR_KEYS) {
			const r = step(P, s, d);
			if (!r.moved || r.state.solved) continue;
			const k = sig(r.state);
			if (!seen.has(k)) { seen.set(k, r.state); next.push(r.state); }
		}
		frontier = next;
	}
	for (const s of seen.values()) {
		const sub = { ...P, start: [s.x, s.y], rocks: s.rocks };
		const st = { ...initState(sub), filled: s.filled };
		if (!solveFrom(P, st)) return true;
	}
	return false;
}
function solveFrom(P, s0, limit = 20000) {
	const seen = new Set([sig(s0)]);
	let frontier = [s0], n = 0;
	while (frontier.length) {
		const next = [];
		for (const s of frontier) for (const d of DIR_KEYS) {
			const r = step(P, s, d);
			if (!r.moved) continue;
			if (r.state.solved) return true;
			const k = sig(r.state);
			if (seen.has(k)) continue;
			seen.add(k);
			if (++n > limit) return true; // demasiado grande para saberlo: no avisar
			next.push(r.state);
		}
		frontier = next;
	}
	return false;
}
