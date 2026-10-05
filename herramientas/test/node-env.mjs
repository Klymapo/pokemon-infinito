// Carga los datos del juego en Node para pruebas.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { D } from '../../app/js/data.js';
const here = path.dirname(fileURLToPath(import.meta.url));
export function loadDataNode() {
	const dir = path.join(here, '../../app/data');
	for (const n of ['species', 'learnsets', 'moves', 'abilities', 'items', 'types', 'natures', 'growth']) D[n] = JSON.parse(fs.readFileSync(path.join(dir, n + '.json'), 'utf8'));
	D.byNum = {};
	for (const id in D.species) { const s = D.species[id]; if (!s.base && !s.battleOnly && !D.byNum[s.num]) D.byNum[s.num] = id; }
	return D;
}
