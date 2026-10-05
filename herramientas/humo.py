"""Prueba de humo en un navegador real con la pantalla de un móvil (412x860).

Arranca un servidor local en app/, crea una partida, avanza por los diálogos
eligiendo siempre la primera opción, abre los menús principales y guarda capturas.
Falla (código 1) si hay errores de JavaScript en la página.

Uso: python3 herramientas/humo.py [--salida carpeta] [--pasos 120]
"""
import argparse, functools, http.server, os, socketserver, sys, threading, time
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--salida', default=os.environ.get('TMPDIR', '/tmp') + '/humo')
ap.add_argument('--pasos', type=int, default=400)
args = ap.parse_args()
os.makedirs(args.salida, exist_ok=True)

APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'app')
class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
Handler = functools.partial(Silencioso, directory=APP)
srv = socketserver.TCPServer(('127.0.0.1', 0), Handler)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

errores, avisos = [], []
shots = [0, 0]

def paso(pg, i):
    """Avanza un paso: diálogo, elección, texto o combate. Devuelve True si hizo algo."""
    ov = pg.query_selector('.overlay')
    if ov:
        btns = pg.query_selector_all('.overlay .choices button')
        inp = pg.query_selector('.overlay input.field-input')
        if inp:
            inp.fill('Lucky'); btns[-1].click(timeout=2000)
        elif btns:
            btns[0].click(timeout=2000)
        else:
            ov.click(timeout=2000)
        if i in (3, 20, 60) and shots[0] < 3:
            shots[0] += 1; pg.screenshot(path=f'{args.salida}/03-dialogo-{i}.png')
        return True
    if pg.query_selector('.battle'):
        # combate: Luchar y el primer movimiento disponible (clic directo por JS)
        for sel in ('.battle button.movebtn:not([disabled])', '.battle button.btn.fight', '.battle button.mon:not(.fainted):not(.sel)', '.battle .blog'):
            el = pg.query_selector(sel)
            if el:
                el.evaluate('e => e.click()'); break
        if not shots[1]:
            shots[1] = 1; pg.screenshot(path=f'{args.salida}/03-combate.png')
        return True
    return False

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None)
    ctx = b.new_context(viewport={'width': 412, 'height': 860}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errores.append(f'pageerror: {e}'))
    pg.on('console', lambda m: (errores if m.type == 'error' and 'Failed to load resource' not in m.text else avisos).append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
    pg.goto(f'http://127.0.0.1:{port}/index.html')
    pg.wait_for_selector('text=Nueva partida', timeout=20000)
    pg.screenshot(path=f'{args.salida}/01-titulo.png')
    pg.click('text=Nueva partida')
    pg.fill('input.field-input', 'Prueba')
    pg.screenshot(path=f'{args.salida}/02-creacion.png')
    pg.click('text=Empezar la aventura')
    for i in range(args.pasos):
        time.sleep(0.15)
        try:
            if paso(pg, i): continue
        except Exception as e:
            if 'not attached' in str(e) or 'Timeout' in str(e): continue
            raise
        if not pg.query_selector('.nav'):
            continue
        break
    pg.screenshot(path=f'{args.salida}/04-lugar.png')
    for nombre in ['Mapa', 'Equipo', 'Mochila', 'Diario', 'Más']:
        btn = pg.query_selector(f'.nav button:has-text("{nombre}")')
        if not btn:
            errores.append(f'no encuentro el botón {nombre} de la barra'); continue
        btn.click(); time.sleep(0.4)
        pg.screenshot(path=f'{args.salida}/05-{nombre.lower()}.png')
        x = pg.query_selector('.sheet .x')
        if x: x.click(); time.sleep(0.2)
    b.close()
srv.shutdown()

print(f'Capturas en {args.salida}')
if avisos: print('Avisos:\n  ' + '\n  '.join(avisos[:20]))
if errores:
    print('ERRORES:\n  ' + '\n  '.join(errores[:30]))
    sys.exit(1)
print('Humo OK: sin errores de JavaScript')
