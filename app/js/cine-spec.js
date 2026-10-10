// Vocabulario de las cinemáticas (ver docs/CINE.md). Módulo puro: sin DOM ni dependencias,
// para que lo importen tanto el motor (app/js/ui/cine.js) como el validador (herramientas/validar.mjs).

/** Efectos de un frame (`fx`: uno o una lista). */
export const CINE_FX = [
	// los seis de siempre
	'light', 'dark', 'flash', 'glow', 'shake', 'zoom',
	// transiciones
	'iris-in', 'iris-out', 'fade', 'wipe',
	// acción
	'speedlines', 'impact', 'slash', 'quake',
	// luz y energía
	'aura', 'sparkle', 'beam', 'ripple', 'rays',
	// clima emocional
	'heartbeat', 'tint', 'silhouette', 'letter',
	// sobre un actor
	'evolve', 'rise', 'fall',
];

/** Movimientos de cámara (`cam`). */
export const CINE_CAMS = ['still', 'drift', 'pan-left', 'pan-right', 'pan-up', 'pan-down', 'push', 'pull'];

/** Clima (`weather`, por escena o por frame; dura hasta que otro frame lo cambie). */
export const CINE_WEATHER = ['none', 'rain', 'snow', 'leaves', 'embers', 'petals', 'ash', 'fog', 'sparks', 'dust', 'smoke'];

/** Entradas y salidas de un actor (`enter`, `exit`). */
export const CINE_ENTER = ['left', 'right', 'up', 'down', 'fade', 'drop', 'pop', 'none'];

/** Acciones de un actor (`do`). */
export const CINE_DO = ['idle', 'bob', 'hop', 'shake', 'nod', 'turn', 'step', 'back', 'bow', 'faint', 'float', 'spin'];

/** Bocadillos de emoción sobre un actor (`emote`). */
export const CINE_EMOTES = ['!', '?', '...', 'heart', 'sweat', 'anger', 'note', 'zzz'];

/** Valor especial de `mon`: el compañero del jugador (su Riolu o Lucario, tal como esté). */
export const CINE_PARTNER = '{riolu}';

export const CINE_SIZES = ['s', 'm', 'l'];
export const CINE_AT = ['left', 'center', 'right'];
export const CINE_START = ['light', 'dark', 'iris', 'fade'];
export const CINE_TIMES = ['manana', 'dia', 'tarde', 'noche'];

/** Claves admitidas en cada nivel (el validador avisa de las demás). */
export const CINE_SCENE_KEYS = ['bg', 'start', 'frames', 'weather', 'tint', 'time', 'cam', 'auto', 'ambient'];
export const CINE_FRAME_KEYS = [
	'text', 'say', 'as', 'big', 'sub', 'item', 'npc', 'mon', 'shiny', 'clear', 'actors',
	'fx', 'cam', 'camMs', 'shake', 'weather', 'tint', 'color', 'on', 'hold', 'auto', 'bg', 'cond',
];
export const CINE_ACTOR_KEYS = [
	'key', 'id', 'npc', 'mon', 'item', 'shiny', 'at', 'enter', 'exit', 'do', 'size', 'flip', 'dim', 'speak', 'emote', 'remove',
];

/** Longitud máxima recomendada del texto de un frame. */
export const CINE_TEXT_MAX = 260;

export const asList = v => v === undefined || v === null || v === false ? [] : Array.isArray(v) ? v : [v];

/**
 * Comprueba una cinemática contra el vocabulario. Devuelve una lista de avisos (vacía si todo va bien).
 * `has` son funciones opcionales para comprobar que existen los actores: { npc(id), species(id), item(id) }.
 */
export function checkCutscene(spec, has = {}) {
	const out = [], bad = (m) => out.push(m);
	const one = (v, list, what) => { if (v !== undefined && !list.includes(v)) bad(`${what} desconocido: ${JSON.stringify(v)}`); };
	const keys = (o, list, what) => { for (const k in o) if (!list.includes(k)) bad(`clave desconocida en ${what}: "${k}"`); };
	const exists = (kind, id, what) => { if (id === undefined || id === null) return; if (typeof id !== 'string') { bad(`${what}: debe ser un id`); return; } if (kind === 'npc' && id === 'jugador') return; if (kind === 'species' && id === CINE_PARTNER) return; if (has[kind] && !has[kind](id)) bad(`${what} inexistente: ${id}`); };
	const checkBg = (b, where) => { if (b !== undefined && (!b || typeof b !== 'object')) bad(`${where}: bg debe ser un objeto { type, … }`); };
	if (!spec || typeof spec !== 'object') return ['la cinemática no es un objeto'];
	keys(spec, CINE_SCENE_KEYS, 'la escena');
	checkBg(spec.bg, 'escena');
	one(spec.start, CINE_START, 'start'); one(spec.time, CINE_TIMES, 'time'); one(spec.weather, CINE_WEATHER, 'weather'); one(spec.cam, CINE_CAMS, 'cam');
	if (!Array.isArray(spec.frames) || !spec.frames.length) { bad('sin frames'); return out; }
	const known = new Set(); // claves de actores vistas hasta ahora
	spec.frames.forEach((fr, i) => {
		const f = `frame ${i}`;
		if (!fr || typeof fr !== 'object') { bad(`${f}: no es un objeto`); return; }
		keys(fr, CINE_FRAME_KEYS, f);
		for (const fx of asList(fr.fx)) one(fx, CINE_FX, `${f}: fx`);
		one(fr.cam, CINE_CAMS, `${f}: cam`); one(fr.weather, CINE_WEATHER, `${f}: weather`);
		checkBg(fr.bg, f);
		if (fr.shake !== undefined && ![1, 2, 3].includes(fr.shake)) bad(`${f}: shake debe ser 1, 2 o 3`);
		if (fr.text !== undefined && typeof fr.text !== 'string') bad(`${f}: text no es una cadena`);
		if (typeof fr.text === 'string' && !fr.big && fr.text.length > CINE_TEXT_MAX) bad(`${f}: texto de ${fr.text.length} caracteres (máximo ${CINE_TEXT_MAX}): pártelo en dos frames`);
		if (fr.big && typeof fr.text === 'string' && fr.text.length > 28) bad(`${f}: rótulo (big) de más de 28 caracteres`);
		if (fr.sub !== undefined && !fr.big) bad(`${f}: sub solo tiene sentido con big`);
		exists('npc', fr.say, `${f}: say, npc`); exists('npc', fr.npc, `${f}: npc`); exists('species', fr.mon, `${f}: especie`); exists('item', fr.item, `${f}: objeto`);
		if (fr.clear) known.clear();
		if (fr.item || fr.npc || fr.mon) known.add('_c');
		const acts = asList(fr.actors);
		acts.forEach((a, j) => {
			const w = `${f}, actor ${j}`;
			if (!a || typeof a !== 'object') { bad(`${w}: no es un objeto`); return; }
			keys(a, CINE_ACTOR_KEYS, w);
			exists('npc', a.id, `${w}: npc`); exists('npc', a.npc, `${w}: npc`); exists('species', a.mon, `${w}: especie`); exists('item', a.item, `${w}: objeto`);
			one(a.enter, CINE_ENTER, `${w}: enter`); one(a.exit, CINE_ENTER, `${w}: exit`); one(a.do, CINE_DO, `${w}: do`); one(a.emote, CINE_EMOTES, `${w}: emote`); one(a.size, CINE_SIZES, `${w}: size`);
			if (a.at !== undefined && !CINE_AT.includes(a.at) && !(typeof a.at === 'number' && a.at >= 0 && a.at <= 1)) bad(`${w}: at debe ser left, center, right o un número de 0 a 1`);
			const src = a.id ?? a.npc ?? a.mon ?? a.item, key = String(a.key ?? src ?? '');
			if (!key) { bad(`${w}: sin key ni id/mon/item`); return; }
			if (!known.has(key) && src === undefined) bad(`${w}: «${key}» aún no está en escena (le falta id, mon o item)`);
			if (a.remove) known.delete(key); else known.add(key);
		});
		if (fr.on !== undefined && fr.on !== false && !known.has(String(fr.on))) bad(`${f}: on apunta a un actor que no está en escena: ${fr.on}`);
		const empty = !fr.text && !fr.item && !fr.npc && !fr.mon && !fr.clear && !acts.length && !asList(fr.fx).length && !fr.bg && fr.weather === undefined && fr.tint === undefined && !fr.cam && !fr.shake;
		if (empty) bad(`${f}: vacío (ni texto ni nada que ver)`);
	});
	return out;
}
