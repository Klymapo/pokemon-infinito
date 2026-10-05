// Utilidades varias
export const rng = () => Math.random();
export const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const clone = o => JSON.parse(JSON.stringify(o));
export function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
	return a;
}
export function weightedPick(list, w = x => x.w ?? 1) {
	const total = list.reduce((s, x) => s + w(x), 0);
	if (total <= 0) return null;
	let r = Math.random() * total;
	for (const x of list) { r -= w(x); if (r < 0) return x; }
	return list[list.length - 1];
}
export const fmtMoney = n => '₽' + Math.floor(n).toLocaleString('es-MX');
export function esc(s) {
	return ('' + (s ?? '')).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
/** Formato ligero para textos de diálogo: **negrita**, *cursiva*, saltos de línea. Escapa HTML primero. */
export function fmtText(s) {
	return esc(s)
		.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
		.replace(/\*(.+?)\*/g, '<i>$1</i>')
		.replace(/\n/g, '<br>');
}
export function fmtDuration(ms) {
	const m = Math.floor(ms / 60000);
	const h = Math.floor(m / 60);
	return h ? `${h} h ${m % 60} min` : `${m} min`;
}
