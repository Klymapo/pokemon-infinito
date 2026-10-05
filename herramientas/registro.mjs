// Genera secreto/registro-auto.md: apariciones de NPCs por bloque, flags, misiones y entrenadores.
// Uso: node herramientas/registro.mjs
import fs from 'fs';
import { loadDataNode } from './test/node-env.mjs';
import { D } from '../app/js/data.js';
loadDataNode();
const mod = await import('../app/content/index.js');

const out = ['# Registro automático (no editar a mano)', '', `Generado: ${new Date().toISOString()} · contenido ${mod.CONTENT_VERSION}`, ''];
const npcAll = {}; const flagsSet = {}; const flagsRead = {};
function walk(list, ctx, blk) {
	for (const c of list || []) {
		if (!c || typeof c !== 'object') continue;
		if (c.say && c.say !== 'jugador') (npcAll[c.say] ||= {})[blk] = (npcAll[c.say][blk] || new Set()).add(ctx);
		if (c.set) for (const k in c.set) if (k.startsWith('flag')) (flagsSet[k.split('.')[1]] ||= new Set()).add(blk + ':' + ctx);
		for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun']) if (c[k]) walk(c[k], ctx, blk);
		if (c.choice) for (const o of c.choice) walk(o.then, ctx, blk);
	}
}
for (const b of mod.BLOCKS) {
	for (const [id, s] of Object.entries(b.scripts || {})) walk(s, id, b.id);
	for (const [id, t] of Object.entries(b.trainers || {})) if (t.npc) (npcAll[t.npc] ||= {})[b.id] = (npcAll[t.npc][b.id] || new Set()).add('combate:' + id);
}
out.push('## Apariciones de NPCs (escenas por bloque)', '', '| NPC | ' + mod.BLOCKS.map(b => b.id).join(' | ') + ' | Total |', '|---|' + mod.BLOCKS.map(() => '---|').join('') + '---|');
const allNpcs = Object.assign({}, ...mod.BLOCKS.map(b => b.npcs || {}));
for (const id of Object.keys(allNpcs).sort()) {
	if (allNpcs[id].generic) continue;
	const row = mod.BLOCKS.map(b => npcAll[id]?.[b.id]?.size || 0);
	const tot = row.reduce((a, c) => a + c, 0);
	const blocksWith = row.filter(x => x > 0).length;
	out.push(`| ${allNpcs[id].name} (\`${id}\`) | ${row.join(' | ')} | ${tot}${blocksWith < 3 ? ' ⚠ ' + blocksWith + ' bloque(s)' : ''} |`);
}
out.push('', '> ⚠ = aparece en menos de 3 bloques distintos. La regla de oro pide que reaparezca en bloques futuros.', '');
out.push('## Flags que se activan', '');
for (const f of Object.keys(flagsSet).sort()) out.push(`- \`${f}\` — ${[...flagsSet[f]].slice(0, 4).join(', ')}`);
out.push('', '## Misiones', '');
for (const b of mod.BLOCKS) for (const [id, q] of Object.entries(b.quests || {})) out.push(`- \`${id}\` (${q.type}) ${q.name}: ${Object.keys(q.stages).join(' → ')}`);
out.push('', '## Entrenadores con nombre de NPC', '');
for (const b of mod.BLOCKS) for (const [id, t] of Object.entries(b.trainers || {})) if (t.npc) out.push(`- \`${id}\` (${b.id}) ${t.name}: ${t.team.map(m => `${D.species[m.sp]?.name} ${m.lv}`).join(', ')}`);
out.push('', '## Nombres de entrenadores usados (para no repetir)', '');
const names = {};
for (const b of mod.BLOCKS) for (const t of Object.values(b.trainers || {})) if (!t.npc) names[t.name] = (names[t.name] || 0) + 1;
out.push(Object.entries(names).sort().map(([n, c]) => c > 1 ? `${n} (×${c})` : n).join(', '));
fs.writeFileSync(new URL('../secreto/registro-auto.md', import.meta.url), out.join('\n') + '\n');
console.log('secreto/registro-auto.md escrito');
