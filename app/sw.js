// Generado por herramientas/build-sw.mjs — no editar a mano
const VERSION = '44072cf196f8';
const APP_CACHE = 'app-' + VERSION;
const SPRITE_CACHE = 'sprites-v1';
const FILES = ["./","content/b01/comun.js","content/b01/eventos.js","content/b01/index.js","content/b01/misiones.js","content/b01/npcs.js","content/b01/recoleccion.js","content/b01/t0-luminalia.js","content/b01/t1-novarte.js","content/b01/t2-costa.js","content/b01/t3-yantra.js","content/b01/t4-encuentros.js","content/b02/comun.js","content/b02/index.js","content/b02/misiones.js","content/b02/npcs.js","content/b02/t0-kalos.js","content/b02/t1-encinar.js","content/b02/t2-trigal.js","content/b02/t3-iris.js","content/b03/comun.js","content/b03/index.js","content/b03/misiones.js","content/b03/npcs.js","content/b03/t0-ruinas.js","content/b03/t1-faro.js","content/b03/t2-rancho.js","content/b03/t3-caoba.js","content/b04/comun.js","content/b04/index.js","content/b04/misiones.js","content/b04/npcs.js","content/b04/t0-azafran.js","content/b04/t1-celeste.js","content/b04/t2-silph.js","content/b04/t3-cueva.js","content/index.js","css/app.css","data/abilities.json","data/growth.json","data/items.json","data/learnsets.json","data/moves.json","data/natures.json","data/species.json","data/types.json","fonts/nunito-italic.ttf","fonts/nunito.ttf","fonts/pixelify.ttf","icons/icon-192.png","icons/icon-512.png","index.html","js/ai.js","js/art.js","js/battle.js","js/content.js","js/data.js","js/guion.js","js/main.js","js/pokemon.js","js/retrato.js","js/state.js","js/time.js","js/ui/acuarela.js","js/ui/battle-ui.js","js/ui/core.js","js/ui/screens.js","js/util.js","js/world.js","lib/battle-text.js","lib/ps-sim.js","manifest.webmanifest"];

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
