"""Bot «Designer de Canvas» (UX/UI): revisa todo lo visual del juego en un móvil real (412x860).

Carga una partida avanzada (la genera el bot de recorrido), recorre las pantallas (lugar, mapa, equipo,
mochila, diario, más, sus pestañas, la primera ficha de cada lista, el PC, una tienda, un diálogo y un
combate) y en cada una mide lo que un diseñador de interfaces miraría:

  ✖ grave   textos cortados, cosas fuera de pantalla, scroll horizontal, botones que se pisan,
            contraste < 3:1, letra < 10 px, objetivos táctiles < 32 px
  ⚠ detalle contraste < 4,5:1, letra < 12 px, objetivos táctiles < 40 px, fuentes fuera de la identidad
  · curiosidad emojis usados como iconos (Mario pidió iconos pixelados propios), lienzos borrosos

Guarda capturas de cada pantalla para revisarlas con ojos. Escribe secreto/auditorias/ux-AAAA-MM-DD.md.
Por defecto no bloquea; con --estricto sale con 1 si hay graves.

Uso: python3 herramientas/ux.py [--salida carpeta] [--informe ruta.md] [--partida save.json] [--estricto]
"""
import argparse, datetime, functools, http.server, json, os, socketserver, subprocess, sys, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
APP = os.path.join(ROOT, 'app')
hoy = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-6))).strftime('%Y-%m-%d')
ap = argparse.ArgumentParser()
ap.add_argument('--salida', default=os.environ.get('TMPDIR', '/tmp') + '/ux')
ap.add_argument('--informe', default=os.path.join(ROOT, 'secreto', 'auditorias', f'ux-{hoy}.md'))
ap.add_argument('--partida', default=None, help='JSON de una partida; si no, se genera con el bot de recorrido')
ap.add_argument('--estricto', action='store_true')
args = ap.parse_args()
os.makedirs(args.salida, exist_ok=True)

# ---------- Partida avanzada para que las pantallas tengan contenido ----------
save_path = args.partida
if not save_path:
    save_path = os.path.join(args.salida, 'partida.json')
    env = dict(os.environ, DUMP=save_path)
    subprocess.run(['node', 'herramientas/recorrido.mjs', '--semilla', '2'], cwd=ROOT, env=env, capture_output=True, timeout=900)
partida = open(save_path).read() if os.path.exists(save_path) else None

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Silencioso, directory=APP))
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

# ---------- Auditoría de una pantalla (se ejecuta dentro del navegador) ----------
AUDIT_JS = r"""
() => {
  const out = [];
  const W = innerWidth, H = innerHeight;
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const path = el => { const p = []; for (let e = el; e && e !== document.body && p.length < 4; e = e.parentElement) {
      let s = e.tagName.toLowerCase(); if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.'); p.unshift(s); } return p.join(' > '); };
  const txt = el => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v[3] ?? 1 }; };
  const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const bgOf = el => { let acc = null; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // degradados o imágenes: no se puede medir bien
      const c = parse(cs.backgroundColor); if (c && c.a > 0.01) { if (!acc) acc = c; else acc = { r: acc.r * acc.a + c.r * (1 - acc.a), g: acc.g * acc.a + c.g * (1 - acc.a), b: acc.b * acc.a + c.b * (1 - acc.a), a: Math.min(1, acc.a + c.a * (1 - acc.a)) };
        if (acc.a >= 0.99) return acc; } }
    const body = parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    if (!acc) return body; return { r: acc.r * acc.a + body.r * (1 - acc.a), g: acc.g * acc.a + body.g * (1 - acc.a), b: acc.b * acc.a + body.b * (1 - acc.a), a: 1 }; };
  const add = (sev, kind, el, msg) => out.push({ sev, kind, sel: path(el), text: txt(el), msg });
  if (document.documentElement.scrollWidth > W + 1) out.push({ sev: '✖', kind: 'scroll', sel: 'html', text: '', msg: `La página se puede mover de lado: mide ${document.documentElement.scrollWidth}px y la pantalla ${W}px.` });
  // Solo lo que de verdad se ve: lo que queda debajo de una hoja o un diálogo no cuenta
  const onTop = el => { const r = el.getBoundingClientRect(); const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 3, r.top + 3], [r.right - 3, r.bottom - 3]];
    return pts.some(([x, y]) => { if (x < 0 || y < 0 || x >= W || y >= H) return false; const t = document.elementFromPoint(x, y); return t && (el === t || el.contains(t) || t.contains(el)); }); };
  const all = [...document.querySelectorAll('body *')].filter(vis).filter(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < H ? onTop(el) : !document.querySelector('.sheet, .overlay') || el.closest('.sheet:last-of-type, .overlay'); });
  const inScrollX = el => { for (let e = el.parentElement; e; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
  const directText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
  const EMOJI = /\p{Extended_Pictographic}/u;
  for (const el of all) {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    // Fuera de pantalla (no cuenta lo que está dentro de un carrusel con scroll)
    if ((r.right > W + 2 || r.left < -2) && !inScrollX(el) && cs.position !== 'fixed' && r.width < W * 3 && !el.closest('.cs-stage')) add('✖', 'fuera', el, `Se sale de la pantalla (${Math.round(r.left)}–${Math.round(r.right)} px de ${W}).`);
    if (directText(el)) {
      // Texto cortado
      const clipX = ['hidden', 'clip'].includes(cs.overflowX) || cs.textOverflow === 'ellipsis';
      if (clipX && el.scrollWidth > el.clientWidth + 1) add('✖', 'cortado', el, `Texto cortado a lo ancho (${el.scrollWidth}px en ${el.clientWidth}px)${cs.textOverflow === 'ellipsis' ? ' con «…»' : ''}.`);
      const clamp = cs.webkitLineClamp && cs.webkitLineClamp !== 'none';
      if (['hidden', 'clip'].includes(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 && !clamp) add('✖', 'cortado', el, `Texto cortado a lo alto (${el.scrollHeight}px en ${el.clientHeight}px).`);
      // Tamaño de letra
      const inSvg = !!el.ownerSVGElement; // en un SVG escalado la letra se mide por lo que ocupa en pantalla
      const fs = inSvg ? Math.round(r.height * 0.8 * 10) / 10 : parseFloat(cs.fontSize);
      if (fs < 10) add('✖', 'letra', el, `Letra de ${fs}px: ilegible en el móvil.`);
      else if (fs < 12) add('⚠', 'letra', el, `Letra de ${fs}px: pequeña para leer de un vistazo (mínimo 12).`);
      // Fuente
      const fam = cs.fontFamily.toLowerCase();
      if (!/pixelify|nunito/.test(fam.split(',')[0])) add('⚠', 'fuente', el, `Fuente «${cs.fontFamily.split(',')[0]}» fuera de la identidad (Pixelify Sans + Nunito).`);
      // Contraste
      const fg = parse(cs.color), bg = bgOf(el);
      if (fg && bg) {
        const op = +cs.opacity * (fg.a ?? 1);
        const f = { r: fg.r * op + bg.r * (1 - op), g: fg.g * op + bg.g * (1 - op), b: fg.b * op + bg.b * (1 - op) };
        const L1 = lum(f), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const big = fs >= 24 || (fs >= 18.6 && +cs.fontWeight >= 700);
        if (ratio < 3) add('✖', 'contraste', el, `Contraste ${ratio.toFixed(2)}:1 (mínimo ${big ? 3 : 4.5}).`);
        else if (!big && ratio < 4.5) add('⚠', 'contraste', el, `Contraste ${ratio.toFixed(2)}:1 (mínimo 4,5 para texto normal).`);
      }
    }
    // Objetivos táctiles
    const tappable = el.matches('button, a[href], input, select, textarea, [role=button]') || (cs.cursor === 'pointer' && !el.parentElement?.closest('button, [role=button]') && getComputedStyle(el.parentElement || el).cursor !== 'pointer');
    if (tappable && !el.disabled && !el.closest('.overlay .log, .cs-stage')) {
      const rr = el.ownerSVGElement ? (el.closest('g') || el).getBoundingClientRect() : r; // en el mapa, el grupo incluye la zona de toque invisible
      const m = Math.min(rr.width, rr.height);
      if (m < 32) add('✖', 'tactil', el, `Botón de ${Math.round(rr.width)}×${Math.round(rr.height)} px: difícil de tocar (mínimo 44).`);
      else if (m < 40) add('⚠', 'tactil', el, `Botón de ${Math.round(rr.width)}×${Math.round(rr.height)} px (recomendado ≥ 44).`);
    }
    // Emojis como iconos
    if (el.matches('.ico, .tile-ico, .sc-ico, .nav button span, [class*=icon]') && EMOJI.test(el.textContent || '') && (el.textContent || '').trim().length <= 3) add('·', 'emoji', el, `Icono hecho con emoji «${el.textContent.trim()}»: pendiente de icono pixelado propio.`);
    // Lienzos borrosos
    if (el.tagName === 'CANVAS') {
      if (el.width < r.width * 1.5 && cs.imageRendering !== 'pixelated' && cs.imageRendering !== 'crisp-edges') add('·', 'lienzo', el, `Lienzo de ${el.width}px pintado a ${Math.round(r.width)}px sin \`image-rendering: pixelated\`: el pixel art se ve borroso.`);
    }
  }
  // Botones que se pisan
  const taps = all.filter(el => el.matches('button, a[href], input, [role=button]') && !el.closest('.cs-stage'));
  for (let i = 0; i < taps.length; i++) for (let j = i + 1; j < taps.length; j++) {
    const a = taps[i].getBoundingClientRect(), b = taps[j].getBoundingClientRect();
    if (taps[i].contains(taps[j]) || taps[j].contains(taps[i])) continue;
    const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (ox > 4 && oy > 4) add('✖', 'pisan', taps[i], `Se pisa con otro botón («${txt(taps[j]).slice(0, 25)}»): un toque puede caer en el equivocado.`);
  }
  return out;
}
"""

found = {}  # (kind, sel, msg-sin-números) -> registro
pantallas = []
errores_js = []

def auditar(pg, nombre):
    time.sleep(0.35)
    try:
        res = pg.evaluate(AUDIT_JS)
    except Exception as e:
        errores_js.append(f'{nombre}: {e}'); return
    shot = f'{len(pantallas) + 1:02d}-{nombre}.png'
    pg.screenshot(path=os.path.join(args.salida, shot))
    pantallas.append((nombre, shot, len(res)))
    for f in res:
        k = (f['kind'], f['sel'], f['sev'])
        if k in found: found[k]['donde'].add(nombre); continue
        found[k] = dict(f, donde={nombre})

def cerrar(pg):
    """Cierra la hoja de más arriba."""
    xs = pg.query_selector_all('.sheet .sheet-head .x')
    if xs:
        try: xs[-1].evaluate('e => e.click()'); time.sleep(0.3); return True
        except Exception: pass
    return False

def cerrar_todo(pg):
    for _ in range(8):
        avanzar_dialogos(pg, 8)
        if not cerrar(pg): return

def tocar(pg, el):
    """Toca un elemento aunque haya un diálogo encima: primero lo despacha (eligiendo la última opción, que suele ser «Cancelar»)."""
    avanzar_dialogos(pg, 8)
    try: el.click(timeout=1500)
    except Exception:
        try: el.evaluate('e => e.click()')
        except Exception: return False
    time.sleep(0.4)
    return True

def avanzar_dialogos(pg, max_pasos=60):
    for _ in range(max_pasos):
        ov = pg.query_selector('.overlay')
        if not ov: return
        btns = pg.query_selector_all('.overlay .choices button')
        try:
            (btns[-1] if btns else ov).click(timeout=1500)
        except Exception: pass
        time.sleep(0.12)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None)
    ctx = b.new_context(viewport={'width': 412, 'height': 860}, device_scale_factor=2, is_mobile=True, has_touch=True)
    if partida:
        ctx.add_init_script(f"try {{ if (!sessionStorage.getItem('ux_ok')) {{ localStorage.setItem('pinf-slot1', {json.dumps(partida)}); sessionStorage.setItem('ux_ok', '1'); }} }} catch (e) {{}}")
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errores_js.append(f'pageerror: {e}'))
    pg.goto(f'http://127.0.0.1:{port}/index.html')
    pg.wait_for_selector('text=Nueva partida', timeout=20000)
    auditar(pg, 'titulo')
    cont = pg.query_selector('button:has-text("Continuar")')
    if cont:
        cont.click()
    else:
        pg.click('text=Nueva partida'); pg.fill('input.field-input', 'Prueba'); pg.click('text=Empezar la aventura')
    time.sleep(1.2)
    avanzar_dialogos(pg)
    pg.wait_for_selector('.nav', timeout=20000)
    auditar(pg, 'lugar')
    # Barra inferior: cada hoja, sus pestañas y la primera ficha de cada lista
    for nombre in ['Mapa', 'Equipo', 'Mochila', 'Diario', 'Más']:
        btn = pg.query_selector(f'.nav button:has-text("{nombre}")')
        if not btn: errores_js.append(f'no encuentro {nombre} en la barra'); continue
        cerrar_todo(pg)
        btn = pg.query_selector(f'.nav button:has-text("{nombre}")')
        if not btn or not tocar(pg, btn): continue
        base = nombre.lower().replace('á', 'a')
        auditar(pg, base)
        tabs = pg.query_selector_all('.sheet .tabs button')
        for ti in range(len(tabs)):
            tabs = pg.query_selector_all('.sheet .tabs button')
            if ti >= len(tabs): break
            etiqueta = (tabs[ti].inner_text() or str(ti)).strip().split('\n')[0][:14].lower().replace(' ', '-')
            if not tocar(pg, tabs[ti]): continue
            auditar(pg, f'{base}-{etiqueta}')
            row = pg.query_selector('.sheet .list .row, .sheet .tiles > *, .sheet .pc-grid > *')
            if row:
                n0 = len(pg.query_selector_all('.sheet'))
                if tocar(pg, row):
                    auditar(pg, f'{base}-{etiqueta}-ficha')
                    avanzar_dialogos(pg, 8)
                    if len(pg.query_selector_all('.sheet')) > n0: cerrar(pg)
        if not tabs:
            row = pg.query_selector('.sheet button.mon, .sheet .list .row, .sheet .tiles > *')
            n0 = len(pg.query_selector_all('.sheet'))
            if row and tocar(pg, row):
                auditar(pg, f'{base}-ficha')
                sub = pg.query_selector('.sheet:last-of-type .tabs button:nth-child(2)')
                if sub and tocar(pg, sub): auditar(pg, f'{base}-ficha-2')
                avanzar_dialogos(pg, 8)
                if len(pg.query_selector_all('.sheet')) > n0: cerrar(pg)
        cerrar(pg); cerrar(pg)
    # Servicios del lugar: PC, tienda, centro (diálogo)
    for etiqueta, nombre in [('PC', 'pc'), ('Tienda', 'tienda'), ('Centro Pokémon', 'centro')]:
        el = pg.query_selector(f'.main button:has-text("{etiqueta}"), .main .row:has-text("{etiqueta}")')
        if not el: continue
        cerrar_todo(pg)
        try:
            if not tocar(pg, el): continue
            auditar(pg, nombre)
            if nombre == 'pc':
                cell = pg.query_selector('.pc-grid > *, .sheet .mon, .sheet .tile')
                if cell and tocar(pg, cell): auditar(pg, 'pc-opciones')
            avanzar_dialogos(pg); cerrar(pg); cerrar(pg)
        except Exception: pass
    # Un combate: explorar si se puede
    ex = pg.query_selector('.main button:has-text("Explorar"), .main button:has-text("Pescar"), .main button:has-text("Buscar Pokémon"), .main button:has-text("Entrenar")')
    if ex:
        try:
            cerrar_todo(pg); tocar(pg, ex); time.sleep(1.2)
            for _ in range(30):
                if pg.query_selector('.battle'): break
                ov = pg.query_selector('.overlay .choices button')
                if ov: tocar(pg, pg.query_selector_all('.overlay .choices button')[0])
                elif pg.query_selector('.overlay'): pg.query_selector('.overlay').click(timeout=1500)
                time.sleep(0.3)
            if pg.query_selector('.battle'):
                auditar(pg, 'combate')
                f = pg.query_selector('.battle button.btn.fight')
                if f: f.evaluate('e => e.click()'); time.sleep(0.4); auditar(pg, 'combate-movimientos')
        except Exception: pass
    b.close()
srv.shutdown()

# ---------- Informe ----------
orden = {'✖': 0, '⚠': 1, '·': 2}
TIT = {'scroll': 'Scroll horizontal', 'fuera': 'Cosas fuera de la pantalla', 'cortado': 'Textos cortados', 'pisan': 'Botones que se pisan',
       'contraste': 'Contraste', 'letra': 'Tamaño de letra', 'tactil': 'Objetivos táctiles pequeños', 'fuente': 'Fuentes fuera de la identidad',
       'emoji': 'Emojis como iconos', 'lienzo': 'Lienzos borrosos'}
tot = {'✖': 0, '⚠': 0, '·': 0}
for f in found.values(): tot[f['sev']] += 1
lines = [f'# Designer de Canvas (UX/UI) · {hoy}', '',
         '> Todo lo visual medido en un móvil de 412×860 con una partida avanzada. **✖ grave** · **⚠ detalle** · **· curiosidad**.', '',
         f"**Total:** {tot['✖']} graves · {tot['⚠']} detalles · {tot['·']} curiosidades en {len(pantallas)} pantallas. Capturas en `{args.salida}` (míralas: el ojo humano ve lo que las reglas no).", '']
for kind, title in TIT.items():
    l = sorted([f for f in found.values() if f['kind'] == kind], key=lambda f: (orden[f['sev']], f['sel']))
    lines.append(f'## {title} ({len(l)})'); lines.append('')
    if not l: lines += ['Impecable. ✨', '']; continue
    for f in l[:60]:
        donde = ', '.join(sorted(f['donde']))[:80]
        lines.append(f"- {f['sev']} `{f['sel']}`{' «' + f['text'][:40] + '»' if f['text'] else ''} — {f['msg']} _(en: {donde})_")
    if len(l) > 60: lines.append(f'- … y {len(l) - 60} más.')
    lines.append('')
lines += ['## Pantallas revisadas', ''] + [f'- {n}: {c} hallazgos (`{s}`)' for n, s, c in [(a, b_, c) for a, b_, c in pantallas]]
if errores_js: lines += ['', '## Errores durante la revisión', ''] + ['- ' + e for e in errores_js[:30]]
os.makedirs(os.path.dirname(args.informe), exist_ok=True)
open(args.informe, 'w').write('\n'.join(lines) + '\n')
print(f"Designer de Canvas: {tot['✖']} graves · {tot['⚠']} detalles · {tot['·']} curiosidades en {len(pantallas)} pantallas")
for kind, title in TIT.items():
    n = sum(1 for f in found.values() if f['kind'] == kind)
    if n: print(f'  {title}: {n}')
print(f'Informe: {os.path.relpath(args.informe, ROOT)} · capturas: {args.salida}')
sys.exit(1 if args.estricto and tot['✖'] else 0)
