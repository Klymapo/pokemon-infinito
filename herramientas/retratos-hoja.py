# Genera las hojas de revisión a partir de retratos.json (ver retratos.mjs).
import json, sys, os, itertools
from PIL import Image, ImageDraw

out = sys.argv[1]
data = json.load(open(os.path.join(out, 'retratos.json')))
N = 48

def hexrgb(h):
    return tuple(int(h[i:i+2], 16) for i in (1, 3, 5))

def img(grid, bg=None, mode='color'):
    im = Image.new('RGB', (N, N), hexrgb(bg) if bg else (255, 255, 255))
    px = im.load()
    for y, row in enumerate(grid):
        for x, c in enumerate(row):
            if not c: continue
            r, g, b = hexrgb(c)
            if mode == 'sil': px[x, y] = (0, 0, 0)
            elif mode == 'grey':
                v = int(0.299*r + 0.587*g + 0.114*b); px[x, y] = (v, v, v)
            else: px[x, y] = (r, g, b)
    return im

def sheet(name, mode, scale=4, cols=6, key='base', bgmode='own'):
    cw, ch = N*scale + 12, N*scale + 26
    rows = (len(data) + cols - 1)//cols
    S = Image.new('RGB', (cols*cw, rows*ch), (245, 242, 235))
    d = ImageDraw.Draw(S)
    for i, p in enumerate(data):
        bg = p['bg'] if bgmode == 'own' else None
        if mode == 'grey' and bg: bg = '#7f7f7f'
        im = img(p[key], bg, mode).resize((N*scale, N*scale), Image.NEAREST)
        x, y = (i % cols)*cw + 6, (i//cols)*ch + 4
        S.paste(im, (x, y))
        d.text((x, y + N*scale + 4), p['id'][:22], fill=(20, 20, 30))
    S.save(os.path.join(out, name))

sheet('contactos.png', 'color')
sheet('siluetas.png', 'sil', bgmode='none')
sheet('grises.png', 'grey')
# tamaño real ×1 y ×2
cols = 10
S = Image.new('RGB', (cols*(N*3+8), ((len(data)+cols-1)//cols)*(N*2+8)), (40, 44, 60))
for i, p in enumerate(data):
    a = img(p['base'], p['bg']); b = a.resize((N*2, N*2), Image.NEAREST)
    x, y = (i % cols)*(N*3+8), (i//cols)*(N*2+8)
    S.paste(a, (x, y)); S.paste(b, (x+N+4, y))
S.save(os.path.join(out, 'real.png'))
# animación: base / parpadeo / hablar
cols = 4
S = Image.new('RGB', (cols*(N*3*3+20), ((len(data)+cols-1)//cols)*(N*3+20)), (245, 242, 235))
d = ImageDraw.Draw(S)
for i, p in enumerate(data):
    x, y = (i % cols)*(N*9+20), (i//cols)*(N*3+20)
    for k, key in enumerate(['base', 'blink', 'talk']):
        S.paste(img(p[key], p['bg']).resize((N*3, N*3), Image.NEAREST), (x + k*N*3, y))
    d.text((x, y+N*3+4), p['id'], fill=(20, 20, 30))
S.save(os.path.join(out, 'animacion.png'))
# IoU de siluetas
# Solo la cabeza, el cuello y lo que sale de ellos (filas < 40): el busto es parecido en todos y falsea la métrica.
masks = {p['id']: set((x, y) for y, r in enumerate(p['base']) for x, c in enumerate(r) if c and y < 40) for p in data}
pairs = []
for a, b in itertools.combinations(masks, 2):
    A, B = masks[a], masks[b]
    pairs.append((len(A & B)/max(1, len(A | B)), a, b))
pairs.sort(reverse=True)
with open(os.path.join(out, 'iou.txt'), 'w') as f:
    for v, a, b in pairs[:25]: f.write(f'{v:.3f}  {a} · {b}\n')
# Con bustos de 48 px rellenos y la cabeza siempre en el mismo sitio, casi todos los pares pasan de 0,85
# (ver docs/ARTE.md §8). Umbral práctico: por encima de 0,93 hay que cambiar uno de los dos.
UMBRAL = 0.93
over = [p for p in pairs if p[0] > UMBRAL]
print(f'{len(data)} retratos · IoU máx {pairs[0][0]:.3f} ({pairs[0][1]} · {pairs[0][2]}) · pares > 0,93 (cambiar): {len(over)} · pares > 0,85: {sum(1 for p in pairs if p[0] > 0.85)}' if pairs else f'{len(data)} retratos')
for v, a, b in over[:30]: print(f'  {v:.3f} {a} · {b}')
