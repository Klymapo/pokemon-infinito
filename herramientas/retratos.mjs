// Hojas de revisión de retratos (docs/ARTE.md §6).
// Uso: node herramientas/retratos.mjs [--salida dir] [--todos] [--solo id1,id2]
// Escribe retratos.json y llama a retratos-hoja.py para generar:
//   contactos.png, siluetas.png, grises.png, real.png, animacion.png y el informe IoU (iou.txt).
// Por defecto revisa los personajes originales con nombre (sin sprite canon y no genéricos).
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { loadDataNode } from './test/node-env.mjs';
import { C, registerBlock } from '../app/js/content.js';
import { retratoGrid } from '../app/js/retrato.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const out = arg('--salida', '/tmp/retratos');
const todos = process.argv.includes('--todos');
const solo = arg('--solo', '');
fs.mkdirSync(out, { recursive: true });
loadDataNode();
const mod = await import('../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);

const list = [];
for (const [id, n] of Object.entries(C.npcs)) {
	if (solo && !solo.split(',').includes(id)) continue;
	if (!solo && !todos && (n.sprite || n.generic)) continue;
	const look = n.look || { seed: n.name };
	list.push({ id, name: n.name, bg: look.bg || n.bg || '#2a3c66', base: retratoGrid(look), blink: retratoGrid(look, { blink: true }), talk: retratoGrid(look, { talk: true }) });
}
fs.writeFileSync(path.join(out, 'retratos.json'), JSON.stringify(list));
execFileSync('python3', [path.join(here, 'retratos-hoja.py'), out], { stdio: 'inherit' });
