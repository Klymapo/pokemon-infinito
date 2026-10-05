// Arranque de Pokémon Infinite
import { loadData } from './data.js';
import { loadContent } from './content.js';
import { setExtraScope } from './state.js';
import { timeScope } from './time.js';
import { installHooks, titleScreen } from './ui/screens.js';
import { setTextSpeed } from './ui/core.js';

async function boot() {
	const app = document.getElementById('app');
	try {
		app.innerHTML = '<div class="empty" style="margin-top:40vh">Cargando…</div>';
		await loadData('./data/');
		await loadContent();
		setExtraScope(timeScope);
		installHooks();
		setTextSpeed(2);
		await titleScreen();
	} catch (e) {
		console.error(e);
		app.innerHTML = '<div class="empty" style="margin-top:30vh">No se pudo cargar el juego.<br><small>' + (e && e.message || e) + '</small><br><br><button class="btn" onclick="location.reload()">Reintentar</button></div>';
	}
	if ('serviceWorker' in navigator && location.protocol !== 'file:') {
		try {
			const reg = await navigator.serviceWorker.register('./sw.js');
			// Solo recarga cuando el jugador pidió aplicar la actualización (no en la primera instalación)
			let reloading = false;
			navigator.serviceWorker.addEventListener('controllerchange', () => { if (window.__pinfUpdate && !reloading) { reloading = true; location.reload(); } });
			const offer = w => { if (w && navigator.serviceWorker.controller) showUpdateBanner(w); };
			if (reg.waiting) offer(reg.waiting);
			reg.addEventListener('updatefound', () => {
				const w = reg.installing;
				w?.addEventListener('statechange', () => { if (w.state === 'installed') offer(w); });
			});
			// Busca actualizaciones al volver a la app (por si se quedó abierta en segundo plano)
			document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
		} catch (e) { console.warn('SW', e); }
	}
}

/** Aviso fijo: hay versión nueva. Al tocar, guarda la partida y recarga con la versión nueva. */
function showUpdateBanner(worker) {
	if (document.querySelector('.update-banner')) return;
	const b = document.createElement('button');
	b.className = 'update-banner';
	b.innerHTML = '✨ <b>Actualización lista</b> · toca para aplicarla';
	b.onclick = async () => {
		// Solo con el juego en reposo (sin diálogo ni combate abierto), para no guardar a medias
		if (document.querySelector('.overlay, .battle')) {
			b.innerHTML = 'Termina el diálogo o combate y vuelve a tocar';
			setTimeout(() => { b.innerHTML = '✨ <b>Actualización lista</b> · toca para aplicarla'; }, 2500);
			return;
		}
		b.textContent = 'Guardando y actualizando…';
		try { const { saveGame } = await import('./state.js'); await saveGame(); } catch (e) { /* sin partida aún */ }
		window.__pinfUpdate = true;
		worker.postMessage('skipWaiting');
		setTimeout(() => location.reload(), 2500); // por si el navegador no avisa del cambio
	};
	document.body.append(b);
}
boot();
