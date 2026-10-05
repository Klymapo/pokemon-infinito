// Generado por herramientas/build-sw.mjs — no editar a mano
const VERSION = 'ee9ad928be0f';
const APP_CACHE = 'app-' + VERSION;
const SPRITE_CACHE = 'sprites-v1';
const FILES = ["./","content/b01/comun.js","content/b01/eventos.js","content/b01/index.js","content/b01/misiones.js","content/b01/npcs.js","content/b01/recoleccion.js","content/b01/t0-luminalia.js","content/b01/t1-novarte.js","content/b01/t2-costa.js","content/b01/t3-yantra.js","content/index.js","css/app.css","data/abilities.json","data/growth.json","data/items.json","data/learnsets.json","data/moves.json","data/natures.json","data/species.json","data/types.json","fonts/nunito-italic.ttf","fonts/nunito.ttf","fonts/pixelify.ttf","icons/icon-192.png","icons/icon-512.png","index.html","js/ai.js","js/art.js","js/battle.js","js/content.js","js/data.js","js/guion.js","js/main.js","js/pokemon.js","js/state.js","js/time.js","js/ui/acuarela.js","js/ui/battle-ui.js","js/ui/core.js","js/ui/screens.js","js/util.js","js/world.js","lib/battle-text.js","lib/ps-sim.js","manifest.webmanifest"];

self.addEventListener('install', e => {
	e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
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
