// Genera app/sw.js con la lista de archivos a precachear y una versión (hash del contenido).
// Ejecutar SIEMPRE antes de publicar:  node herramientas/build-sw.mjs
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../app');
const files = [];
(function walk(d) {
	for (const f of fs.readdirSync(d)) {
		const p = path.join(d, f);
		const rel = path.relative(root, p).split(path.sep).join('/');
		if (fs.statSync(p).isDirectory()) walk(p);
		else if (!/^sw\.js$|\.txt$|\.md$|^_headers$|^_redirects$/.test(rel)) files.push(rel);
	}
})(root);
files.sort();
const h = crypto.createHash('sha256');
for (const f of files) h.update(f).update(fs.readFileSync(path.join(root, f)));
const version = h.digest('hex').slice(0, 12);
const sw = `// Generado por herramientas/build-sw.mjs — no editar a mano
const VERSION = '${version}';
const APP_CACHE = 'app-' + VERSION;
const SPRITE_CACHE = 'sprites-v1';
const FILES = ${JSON.stringify(['./', ...files], null, 0)};

self.addEventListener('install', e => {
	e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});
self.addEventListener('activate', e => {
	e.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(keys.filter(k => k.startsWith('app-') && k !== APP_CACHE).map(k => caches.delete(k)));
		await self.clients.claim();
	})());
});
self.addEventListener('fetch', e => {
	const url = new URL(e.request.url);
	if (e.request.method !== 'GET') return;
	if (url.hostname === 'raw.githubusercontent.com' || url.hostname === 'play.pokemonshowdown.com') {
		e.respondWith((async () => {
			const c = await caches.open(SPRITE_CACHE);
			const hit = await c.match(e.request.url);
			if (hit) return hit;
			try {
				const r = await fetch(e.request);
				if (r.ok || r.type === 'opaque') c.put(e.request.url, r.clone());
				return r;
			} catch (err) { return new Response('', { status: 404 }); }
		})());
		return;
	}
	if (url.origin !== location.origin) return;
	e.respondWith((async () => {
		const c = await caches.open(APP_CACHE);
		const hit = await c.match(e.request, { ignoreSearch: true });
		if (hit) return hit;
		try { return await fetch(e.request); }
		catch (err) { return (await c.match('./')) || new Response('Sin conexión', { status: 503 }); }
	})());
});
`;
fs.writeFileSync(path.join(root, 'sw.js'), sw);
console.log('sw.js versión', version, '—', files.length, 'archivos');
