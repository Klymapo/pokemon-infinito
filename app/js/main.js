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
			reg.addEventListener('updatefound', () => {
				const w = reg.installing;
				w?.addEventListener('statechange', () => {
					if (w.state === 'installed' && navigator.serviceWorker.controller) {
						import('./ui/core.js').then(m => m.toast('¡Contenido nuevo descargado! Se aplicará la próxima vez que abras el juego.', 'quest'));
					}
				});
			});
		} catch (e) { console.warn('SW', e); }
	}
}
boot();
