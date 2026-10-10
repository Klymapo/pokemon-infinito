// Auditoría automática completa (la parte que no necesita ojos humanos).
// Uso: node herramientas/auditar.mjs [--semillas 12] [--rapido]
//
// Ejecuta, en este orden:
//   1. Validador de contenido (bloquea si hay ERRORES) y los bots Superfan (canon), Game Tester (lógica) y Game Designer (diseño); estos tres solo avisan.
//   2. Bot de recorrido con N semillas de día (13 h) y N de noche (3 h).
//   3. Bot en la fecha de inicio de cada evento por fechas.
//   4. Registro automático de continuidad.
//   5. Prueba de humo en un navegador con pantalla de móvil.
//   6. Designer de Canvas: UX/UI de todas las pantallas (solo avisa).
// Escribe el informe en secreto/auditorias/AAAA-MM-DD.md y sale con código 1 si algo bloquea la publicación.
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const N = +arg('--semillas', process.argv.includes('--rapido') ? 4 : 12);
const PAR = Math.max(2, Math.min(8, os.cpus().length));

function run(cmd, args, timeoutMs = 15 * 60e3) {
	return new Promise(res => {
		const p = spawn(cmd, args, { cwd: ROOT, env: process.env });
		let out = '';
		p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d);
		const t = setTimeout(() => { p.kill('SIGKILL'); out += '\n[TIEMPO AGOTADO]'; }, timeoutMs);
		p.on('close', code => { clearTimeout(t); res({ code, out }); });
	});
}
async function pool(jobs) {
	const results = new Array(jobs.length); let i = 0;
	await Promise.all(Array.from({ length: PAR }, async () => { while (i < jobs.length) { const k = i++; results[k] = await jobs[k](); } }));
	return results;
}

const report = [];
const blockers = [];
const warns = [];
const fecha = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
report.push(`# Auditoría automática · ${fecha}`, '');

// 1. Validador
const val = await run('node', ['herramientas/validar.mjs']);
report.push('## 1. Validador', '', '```', val.out.trim().slice(-3000), '```', '');
if (val.code !== 0) blockers.push('El validador encontró ERRORES');

// 1a. Superfan: detalles de canon que notaría un fan (no bloquea; los graves salen como aviso)
const fan = await run('node', ['herramientas/superfan.mjs']);
report.push('### Superfan (detalles de canon)', '', '```', fan.out.trim().slice(-1500), '```', '', 'Detalle completo en `secreto/auditorias/superfan-' + fecha + '.md`. Corrige los ✖ y revisa los ⚠; las · son opinables.', '');
const fanGraves = +(fan.out.match(/Superfan: (\d+) graves/)?.[1] || 0);
if (fan.code !== 0) warns.push('El Superfan no pudo terminar su revisión');
else if (fanGraves) warns.push(`El Superfan encontró ${fanGraves} detalles graves de canon (ver su informe)`);

// 1a-bis. Game Tester (lógica: combates sin curar, escenas que se atascan…) y Game Designer (hub de misiones, reglas de bloque, colección)
for (const [nombre, archivo, fich] of [['Game Tester', 'tester.mjs', 'tester'], ['Game Designer', 'disenador.mjs', 'disenador']]) {
	const r = await run('node', ['herramientas/' + archivo]);
	report.push(`### ${nombre}`, '', '```', r.out.trim().slice(-1500), '```', '', `Detalle completo en \`secreto/auditorias/${fich}-${fecha}.md\`.`, '');
	const g = +(r.out.match(/: (\d+) graves/)?.[1] || 0);
	if (r.code !== 0) warns.push(`El ${nombre} no pudo terminar su revisión`);
	else if (g) warns.push(`El ${nombre} encontró ${g} problemas graves (ver su informe)`);
}

// 1b. Pruebas del motor
for (const t of ['herramientas/test/shift-test.mjs', 'herramientas/test/combates-encadenados.mjs', 'herramientas/test/rejilla-test.mjs', 'herramientas/test/unicos-tutor-test.mjs', 'herramientas/test/pc-multi-test.mjs', 'herramientas/test/negocios-test.mjs']) {
	const r = await run('node', [t]);
	report.push(`Prueba \`${t}\`: ${r.code === 0 ? 'OK' : '**FALLA**'}`, '');
	if (r.code !== 0) { blockers.push(`Falla la prueba ${t}`); report.push('```', r.out.slice(-2000), '```', ''); }
}

// 2. Bot de recorrido
const parse = out => ({
	fin: /Final alcanzado: SÍ/.test(out),
	lost: +(out.match(/perdidos (\d+)/)?.[1] || 0),
	errores: /^ERRORES/m.test(out),
	atascos: /^ATASCOS/m.test(out),
	regalos: (out.split(/^REGALOS REPETIDOS:\n/m)[1] || '').split('\n').filter(l => l.startsWith('  ')).map(l => l.trim()),
	derrotas: [...(out.split(/^Derrotas:\n/m)[1] || '').split(/\n(?! {2})/)[0].matchAll(/^ {2}(\S+) en (\S+)/gm)].map(m => m[1]),
	nunca: (out.match(/Guiones nunca ejecutados \(\d+\): (.*)/)?.[1] || '').split(', '),
	out,
});
const jobs = [];
for (let s = 1; s <= N; s++) for (const hora of [13, 3]) jobs.push(async () => ({ s, hora, ...parse((await run('node', ['herramientas/recorrido.mjs', '--semilla', String(s), '--hora', String(hora)])).out) }));
const runs = await pool(jobs);
const okRuns = runs.filter(r => r.fin && !r.errores);
report.push('## 2. Bot de recorrido', '', `${okRuns.length} de ${runs.length} recorridos llegan al final sin errores (día 13 h y noche 3 h).`, '');
report.push('| Semilla | Hora | Final | Derrotas | Atascos | Errores |', '|---|---|---|---|---|---|');
for (const r of runs) report.push(`| ${r.s} | ${r.hora} h | ${r.fin ? 'sí' : '**NO**'} | ${r.lost} | ${r.atascos ? 'sí' : '—'} | ${r.errores ? '**SÍ**' : '—'} |`);
const losses = {};
for (const r of runs) for (const d of r.derrotas) if (d !== 'undefined') losses[d] = (losses[d] || 0) + 1;
report.push('', '**Derrotas por rival** (total en todos los recorridos; media por recorrido):', '');
for (const [k, v] of Object.entries(losses).sort((a, b) => b[1] - a[1])) report.push(`- \`${k}\`: ${v} (${(v / runs.length).toFixed(2)})`);
const perfect = runs.filter(r => r.fin && r.lost === 0).length;
report.push('', `Recorridos sin ninguna derrota: ${perfect} de ${runs.length}.`, '');
// criterios (ver secreto/balance.md §5)
if (runs.some(r => r.errores)) blockers.push('El bot encontró ERRORES de ejecución');
const regalos = [...new Set(runs.flatMap(r => r.regalos))];
if (regalos.length) { blockers.push(`Regalos que se repiten al volver a hablar (${regalos.length})`); report.push('**Regalos repetidos** (un NPC da lo mismo cada vez que le hablas):', '', ...regalos.map(x => '- ' + x), ''); }
if (okRuns.length < Math.ceil(runs.length * 0.75)) blockers.push(`Solo ${okRuns.length}/${runs.length} recorridos llegan al final (mínimo 75 %)`);
for (const [k, v] of Object.entries(losses)) if (v / runs.length > 2) warns.push(`Muro de balance: \`${k}\` con ${(v / runs.length).toFixed(2)} derrotas de media`);
if (perfect > runs.length * 2 / 3) warns.push(`Demasiado fácil: ${perfect}/${runs.length} recorridos sin perder nunca`);
const atascos = [...new Set(runs.filter(r => r.atascos).flatMap(r => (r.out.split(/^ATASCOS:\n/m)[1] || '').split('\n').filter(l => l.startsWith('  ')).map(l => l.trim().slice(0, 160))))];
if (atascos.length) { warns.push(`${atascos.length} atascos distintos del bot (revisa si son de contenido o del bot)`); report.push('**Atascos:**', '', ...atascos.slice(0, 15).map(a => '- ' + a), ''); }
const errs = [...new Set(runs.filter(r => r.errores).flatMap(r => (r.out.split(/^ERRORES[^\n]*\n/m)[1] || '').split('\n').filter(l => l.startsWith('  ')).map(l => l.trim().slice(0, 200))))];
if (errs.length) report.push('**Errores del bot:**', '', ...errs.slice(0, 30).map(a => '- ' + a), '');
// guiones que ningún recorrido ejecutó (posible contenido inalcanzable)
const neverAll = runs.length ? runs.map(r => new Set(r.nunca)).reduce((a, b) => new Set([...a].filter(x => b.has(x)))) : new Set();
const neverList = [...neverAll].filter(x => x && !x.startsWith('ev_') && x !== 'usar_menu_kalos');
report.push(`**Guiones que ningún recorrido ejecutó** (${neverList.length}; muchos son ramas de decisión o textos de "recordar", pero revisa los raros):`, '', neverList.join(', ') || '—', '');

// 3. Eventos por fechas
const mod = await import(path.join(ROOT, 'app/content/index.js'));
const events = mod.BLOCKS.flatMap(b => b.events || []);
report.push('## 3. Eventos por fechas', '');
const evRuns = await pool(events.map(e => async () => {
	const r = parse((await run('node', ['herramientas/recorrido.mjs', '--semilla', '1', '--fecha', e.from, '--hora', '20'])).out);
	const scripts = [...new Set([...JSON.stringify(e).matchAll(/"script":"(\w+)"/g)].map(m => m[1]))];
	const ran = scripts.filter(s => !r.nunca.includes(s));
	return { e, r, scripts, ran };
}));
for (const { e, r, scripts, ran } of evRuns) {
	report.push(`- **${e.name}** (${e.from} → ${e.to}): final ${r.fin ? 'sí' : 'NO'}, guiones del evento ejecutados ${ran.length}/${scripts.length}${r.errores ? ' · **ERRORES**' : ''}`);
	if (r.errores) blockers.push(`Errores del bot durante el evento ${e.id}`);
	if (scripts.length && !ran.length) blockers.push(`El evento ${e.id} no ejecuta ninguno de sus guiones en su fecha`);
}
// próximas fechas sin evento (aviso para la sesión)
const hoy = new Date();
const proximos = events.filter(e => { const [m, d] = e.from.split('-').map(Number); let t = new Date(hoy.getFullYear(), m - 1, d); if (t < hoy) t = new Date(hoy.getFullYear() + 1, m - 1, d); return (t - hoy) / 864e5 <= 60; });
report.push('', `Eventos que empiezan en los próximos 60 días: ${proximos.map(e => e.name + ' (' + e.from + ')').join(', ') || 'ninguno'}`, '');

// 4. Registro automático
const reg = await run('node', ['herramientas/registro.mjs']);
report.push('## 4. Registro automático', '', reg.code === 0 ? 'secreto/registro-auto.md regenerado.' : '```\n' + reg.out + '\n```', '');
if (reg.code !== 0) blockers.push('No se pudo generar el registro automático');

// 5. Humo en navegador
const shotDir = path.join(os.tmpdir(), 'humo-' + fecha);
const humo = await run('python3', ['herramientas/humo.py', '--salida', shotDir], 10 * 60e3);
report.push('## 5. Prueba de humo (móvil 412×860)', '', '```', humo.out.trim().split('\n').filter(l => !/404/.test(l)).slice(-15).join('\n'), '```', '', `Capturas en \`${shotDir}\`: míralas con la herramienta de lectura de imágenes.`, '');
if (humo.code !== 0) blockers.push('La prueba de humo encontró errores de JavaScript');

// 6. Designer de Canvas: UX/UI de todas las pantallas con una partida avanzada (no bloquea; los graves salen como aviso)
const uxDir = path.join(os.tmpdir(), 'ux-' + fecha);
const ux = await run('python3', ['herramientas/ux.py', '--salida', uxDir], 20 * 60e3);
report.push('## 6. Designer de Canvas (UX/UI)', '', '```', ux.out.trim().split('\n').slice(-12).join('\n'), '```', '', `Detalle en \`secreto/auditorias/ux-${fecha}.md\`; capturas de cada pantalla en \`${uxDir}\`. **Míralas**: textos, recuadros, iconos y menús.`, '');
const uxG = +(ux.out.match(/: (\d+) graves/)?.[1] || 0);
if (ux.code !== 0) warns.push('El Designer de Canvas no pudo terminar su revisión');
else if (uxG) warns.push(`El Designer de Canvas encontró ${uxG} problemas graves de interfaz (ver su informe)`);

// Resumen
report.splice(2, 0, '## Veredicto', '', blockers.length ? '**NO PUBLICAR.** Bloqueos:\n\n' + blockers.map(b => '- ' + b).join('\n') : '**Apto para publicar** (falta la revisión humana: lector independiente y capturas).', '', warns.length ? 'Avisos:\n\n' + warns.map(w => '- ' + w).join('\n') : 'Sin avisos.', '');
fs.mkdirSync(path.join(ROOT, 'secreto/auditorias'), { recursive: true });
const file = path.join(ROOT, 'secreto/auditorias', fecha + '.md');
fs.writeFileSync(file, report.join('\n') + '\n');
console.log(report.slice(0, 12).join('\n'));
console.log(`\nInforme completo: ${path.relative(ROOT, file)}`);
process.exit(blockers.length ? 1 : 0);
