// Busca combates de entrenador que empiezan solos (al entrar a un lugar) sin
// curación ni decisión previa. Así no te retan recién salido de otro combate.
import { loadDataNode } from './node-env.mjs';
import { C, registerBlock } from '../../app/js/content.js';
loadDataNode();
const mod = await import('../../app/content/index.js');
for (const b of mod.BLOCKS) registerBlock(b);
const S = C.scripts;
function firstBattle(steps, d = 0) {
	if (!Array.isArray(steps) || d > 6) return null;
	for (const s of steps) {
		if (s.heal || s.center || s.choice) return null;
		if (s.battle) return s.battle;
		if (s.call) { const r = firstBattle(S[s.call], d + 1); if (r) return r; }
		if (s.if) { const r = firstBattle(s.then, d + 1) || firstBattle(s.else, d + 1); if (r) return r; }
	}
	return null;
}
const out = [];
for (const [id, l] of Object.entries(C.locations)) for (const e of l.onEnter || []) {
	const r = firstBattle(S[e.script]); if (r) out.push(`${id} · ${e.script} → ${r}`);
}
for (const [loc, list] of Object.entries(C.onEnter || {})) for (const e of list) {
	const r = firstBattle(S[e.script]); if (r) out.push(`${loc} (evento) · ${e.script} → ${r}`);
}
console.log(out.length ? 'Combates que empiezan sin curar ni elegir:\n' + out.join('\n') : 'OK: ningún combate automático sin curación o decisión previa.');
process.exit(out.length ? 1 : 0);
