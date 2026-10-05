// Hora real del teléfono: día/noche, estaciones y eventos por fecha.
export function now() { return new Date(); }

/** 'manana' (6-11), 'dia' (12-17), 'tarde' (18-19), 'noche' (20-5) */
export function phase(d = now()) {
	const h = d.getHours();
	if (h >= 6 && h < 12) return 'manana';
	if (h >= 12 && h < 18) return 'dia';
	if (h >= 18 && h < 20) return 'tarde';
	return 'noche';
}
export const isNight = (d = now()) => phase(d) === 'noche';
export const isDay = (d = now()) => !isNight(d);
export const PHASE_NAMES = { manana: 'Mañana', dia: 'Día', tarde: 'Atardecer', noche: 'Noche' };

/** Estación (hemisferio norte, como Kalos/Kanto). */
export function season(d = now()) {
	const m = d.getMonth() + 1;
	if (m >= 3 && m <= 5) return 'primavera';
	if (m >= 6 && m <= 8) return 'verano';
	if (m >= 9 && m <= 11) return 'otono';
	return 'invierno';
}

/** ¿La fecha actual está en el rango "MM-DD" a "MM-DD"? (admite cruzar año) */
export function inDateRange(from, to, d = now()) {
	const md = (d.getMonth() + 1) * 100 + d.getDate();
	const f = parseInt(from.replace('-', ''), 10);
	const t = parseInt(to.replace('-', ''), 10);
	return f <= t ? md >= f && md <= t : md >= f || md <= t;
}

export function timeScope() {
	const d = now();
	const ph = phase(d);
	return {
		time: ph,
		night: ph === 'noche',
		day: ph !== 'noche',
		morning: ph === 'manana',
		evening: ph === 'tarde',
		season: season(d),
		date: (from, to) => inDateRange(from, to || from, d),
		year: d.getFullYear(),
		weekday: d.getDay(),
	};
}
