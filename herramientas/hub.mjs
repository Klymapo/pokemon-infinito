// Auditoría del hub de misiones (app/js/hub.js) contra partidas reales: lo que el juego anuncia o pide, ¿existe?
// Juega partidas con el bot de recorrido y, en muchos puntos (cada lugar nuevo, cada misión que cambia de etapa y
// cada N pasos), comprueba invariantes sobre el estado real, simulando en una copia de la partida lo que pasaría al
// tocar cada sitio. También revisa las partidas de prueba de herramientas/test/partidas/ (la de Mario incluida).
//
// Invariantes (categorías del informe):
//   1. Novedad fantasma: cada Novedad apunta a un lugar alcanzable; viajando allí el sitio existe, se ve y al tocarlo
//      cambia algo (flags, misiones, objetos, dinero, Pokémon, lugar, diario…).
//   2. Marcador mentiroso: igual para todo sitio con «!», «?» o «•» en lugares alcanzables.
//   3. Necesidad caducada: lo que pide «Lo que necesitas» lo usa algún sitio de ahora y se puede conseguir.
//   4. Por hacer / En espera: «Por hacer» tiene un sitio de ahora que la mueve (simulado) o algo conseguible que falta;
//      «En espera» no tiene ninguno.
//   5. Misiones colgadas: la etapa actual no avanza con nada publicado (error en main/side; aviso en thread).
//   6. Viajes: «Ir» no lleva a sub-lugares sin entrada ni deja en un sitio sin salida.
//   7. Regalos repetibles: tocar dos veces un sitio con señal no da dos veces lo mismo.
//
// Uso: node herramientas/hub.mjs [--semillas 3,5] [--cada 150] [--sin-bot] [--antiguo reach,needs,markers] [--salida archivo.md]
//   --antiguo: reproduce los criterios de antes (para comprobar que la auditoría caza los fallos que vio Mario).
// Escribe secreto/auditorias/hub-AAAA-MM-DD.md y sale con código 1 si hay hallazgos graves.
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELF = fileURLToPath(import.meta.url);
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const MARK = '@@HUB@@';
let CONTENT_FILES = null;
const CAT = {
	fantasma: '1. Novedad fantasma',
	marcador: '2. Marcador mentiroso',
	necesidad: '3. Necesidad caducada',
	clasif: '4. Por hacer / En espera',
	colgada: '5. Misiones colgadas',
	viaje: '6. Viajes',
	regalo: '7. Regalos repetibles',
	contenido: 'Contenido: `new` que no se apaga (el motor ya no lo anuncia)',
};

if (argv.includes('--hijo')) await child();
else await parent();

// =====================================================================
// Proceso principal: lanza un hijo por partida y junta el informe
// =====================================================================
async function parent() {
	const t0 = Date.now();
	const seeds = String(arg('--semillas', '3,5')).split(',').filter(Boolean).map(Number);
	const cada = arg('--cada', '150');
	const antiguo = arg('--antiguo', '');
	const jobs = [];
	const pass = antiguo ? ['--antiguo', antiguo] : [];
	const dir = path.join(ROOT, 'herramientas/test/partidas');
	const partidas = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort() : [];
	for (const p of partidas) jobs.push(['--partida', path.join(dir, p), ...pass]);
	if (!argv.includes('--sin-bot')) seeds.forEach((s, i) => jobs.push(['--semilla', String(s), '--hora', i % 2 ? '3' : '13', '--cada', cada, ...pass]));
	const PAR = Math.max(2, Math.min(6, os.cpus().length));
	const results = new Array(jobs.length);
	let next = 0;
	await Promise.all(Array.from({ length: PAR }, async () => {
		while (next < jobs.length) {
			const k = next++;
			results[k] = await runChild(jobs[k]);
		}
	}));
	// juntar
	const all = new Map();
	const runs = [];
	for (const r of results) {
		runs.push(r.meta);
		for (const f of r.findings) {
			const key = [f.cat, f.sev, f.loc, f.spot, f.quest, f.code].join('|');
			const cur = all.get(key);
			if (cur) { cur.n += f.n || 1; if (!cur.where.includes(r.meta.name)) cur.where.push(r.meta.name); }
			else all.set(key, { ...f, n: f.n || 1, where: [r.meta.name] });
		}
	}
	const findings = [...all.values()];
	const graves = findings.filter(f => f.sev === 'grave');
	const fecha = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
	const out = [];
	out.push(`# Auditoría del hub de misiones · ${fecha}`, '');
	out.push(`Comprueba que lo que el juego anuncia o pide (Novedades, Diario, recuadro 📌, marcas «!»/«?»/«•», ficha de misión, «Ir») existe de verdad, simulando cada sitio en una copia de la partida.${antiguo ? ` **Modo antiguo: ${antiguo}** (criterios de antes, para comprobar que se cazan los fallos).` : ''}`, '');
	out.push('| Partida | Puntos revisados | Sitios simulados | Tiempo |', '|---|---|---|---|');
	for (const m of runs) out.push(`| ${m.name} | ${m.checks} | ${m.sims} | ${(m.ms / 1000).toFixed(1)} s${m.error ? ' · **ERROR: ' + m.error + '**' : ''} |`);
	out.push('', `**${graves.length} graves**, ${findings.filter(f => f.sev === 'aviso').length} avisos, ${findings.filter(f => f.sev === 'info').length} notas. Tiempo total ${((Date.now() - t0) / 1000).toFixed(1)} s.`, '');
	for (const [k, title] of Object.entries(CAT)) {
		const xs = findings.filter(f => f.cat === k).sort((a, b) => (a.sev === 'grave' ? 0 : a.sev === 'aviso' ? 1 : 2) - (b.sev === 'grave' ? 0 : b.sev === 'aviso' ? 1 : 2));
		out.push(`## ${title} (${xs.length})`, '');
		if (!xs.length) { out.push('Nada.', ''); continue; }
		for (const f of xs.slice(0, 80)) {
			const who = [f.loc && `**${f.loc}**`, f.spot && `«${f.spot}»`, f.quest && `misión \`${f.quest}\``].filter(Boolean).join(' · ');
			out.push(`- ${f.sev === 'grave' ? '✖' : f.sev === 'aviso' ? '⚠' : '·'} ${who}: ${f.why}${f.file ? ` (${f.file})` : ''} — visto en ${f.where.join(', ')}: ${f.at}${f.n > 1 ? ` (×${f.n})` : ''}`);
		}
		if (xs.length > 80) out.push(`- …y ${xs.length - 80} más`);
		out.push('');
	}
	const file = arg('--salida', path.join(ROOT, 'secreto/auditorias', `hub-${fecha}.md`));
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, out.join('\n') + '\n');
	const resumen = Object.keys(CAT).map(k => `${CAT[k].replace(/^\d\. /, '').split(':')[0]} ${findings.filter(f => f.cat === k && f.sev !== 'info').length}`).join(' · ');
	console.log(`Hub: ${graves.length} graves · ${findings.filter(f => f.sev === 'aviso').length} avisos · ${runs.reduce((a, m) => a + m.checks, 0)} puntos revisados en ${runs.length} partidas · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
	console.log(resumen);
	for (const f of graves.slice(0, 25)) console.log(`  ✖ [${CAT[f.cat].split(' ')[0]}] ${[f.loc, f.spot && `«${f.spot}»`, f.quest].filter(Boolean).join(' · ')}: ${f.why}`);
	if (runs.some(m => m.error)) console.log('ERRORES: ' + runs.filter(m => m.error).map(m => m.name + ': ' + m.error).join(' / '));
	console.log(`Informe: ${path.relative(ROOT, file)}`);
	process.exit(graves.length || runs.some(m => m.error) ? 1 : 0);
}

function runChild(args) {
	return new Promise(res => {
		const p = spawn(process.execPath, [SELF, '--hijo', ...args], { cwd: ROOT, env: process.env });
		let out = '', err = '';
		p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
		const name = args[0] === '--partida' ? 'partida ' + path.basename(args[1], '.json') : `bot semilla ${args[1]} (${args[3]} h)`;
		const t = setTimeout(() => p.kill('SIGKILL'), 20 * 60e3);
		p.on('close', code => {
			clearTimeout(t);
			const line = out.split('\n').find(l => l.startsWith(MARK));
			if (!line) return res({ meta: { name, checks: 0, sims: 0, ms: 0, error: `el proceso terminó sin informe (código ${code}): ${(err || out).trim().split('\n').slice(-3).join(' ').slice(0, 300)}` }, findings: [] });
			const r = JSON.parse(line.slice(MARK.length));
			r.meta.name = name;
			res(r);
		});
	});
}

// =====================================================================
// Proceso hijo: una partida (de archivo o del bot) y sus comprobaciones
// =====================================================================
async function child() {
	const t0 = Date.now();
	const partida = arg('--partida', null);
	const CADA = +arg('--cada', 150);
	const antiguo = String(arg('--antiguo', '')).split(',').filter(Boolean);
	// Fecha y hora fijas, como el bot (los resultados no dependen de cuándo se ejecuta)
	if (partida) {
		const RealDate = Date, HORA = 13;
		globalThis.Date = class extends RealDate {
			constructor(...a) { if (a.length) super(...a); else { super(); this.setHours(HORA); } }
			static now() { return RealDate.now(); }
		};
	}
	const findings = [];
	let checks = 0, sims = 0, at = '';
	const TXT = new WeakMap();
	let H, S, GU, W, Cn, util, ST, DATA;
	const libs = async () => {
		H = await import('../app/js/hub.js');
		S = await import('../app/js/state.js');
		GU = await import('../app/js/guion.js');
		W = await import('../app/js/world.js');
		Cn = await import('../app/js/content.js');
		util = await import('../app/js/util.js');
		ST = await import('../app/js/movimientos.js');
		DATA = await import('../app/js/data.js');
		if (antiguo.includes('reach')) H.HUB_OPTS.reach = 'visited';
		if (antiguo.includes('needs')) H.HUB_OPTS.needsHidden = true;
		if (antiguo.includes('markers')) H.HUB_OPTS.markers = 'static';
	};
	const add = f => findings.push({ ...f, at });
	let error = null;
	try {
		if (partida) {
			const { loadDataNode } = await import('./test/node-env.mjs');
			loadDataNode();
			const { registerBlock } = await import('../app/js/content.js');
			const mod = await import('../app/content/index.js');
			for (const b of mod.BLOCKS) registerBlock(b);
			await libs();
			const { timeScope } = await import('../app/js/time.js');
			S.setExtraScope(() => ({ ...timeScope() }));
			const raw = JSON.parse(fs.readFileSync(partida, 'utf8'));
			const g = S.migrate(raw.save || raw);
			S.setG(g);
			const { repairSave } = await import('../app/js/reparaciones.js');
			const { retroUniques } = await import('../app/js/unicos.js');
			try { retroUniques(); } catch (e) { /* */ }
			repairSave();
			at = `${S.G.loc}`;
			await checkState();
		} else {
			// el bot llama a onStep en cada paso; revisamos al cambiar de lugar o de etapa, y cada CADA pasos
			let lastSig = '', lastStamp = '', stepNow = 0;
			globalThis.__RECORRIDO_HOOK = {
				async onStep(step) {
					stepNow = step;
					if (!H) await libs();
					const G = S.G;
					const sig = Object.keys(G.visited).filter(id => !Cn.C.locations[id]?.parent).length + '/' + Object.entries(G.quests).map(([k, q]) => k + q.stage + (q.done ? '✔' : '')).join(',');
					if (sig === lastSig && step % CADA) return;
					lastSig = sig;
					const k = H.stamp();
					if (k === lastStamp) return;
					lastStamp = k;
					at = `paso ${step}, en ${G.loc}`;
					await checkState();
				},
				async done() { void stepNow; },
			};
			await import('./recorrido.mjs');
		}
	} catch (e) { error = (e && e.stack || String(e)).split('\n').slice(0, 3).join(' '); }
	// sumar repeticiones dentro de esta partida
	const merged = new Map();
	for (const f of findings) {
		const key = [f.cat, f.sev, f.loc, f.spot, f.quest, f.code].join('|');
		const cur = merged.get(key);
		if (cur) cur.n++; else merged.set(key, { ...f, n: 1 });
	}
	process.stdout.write(MARK + JSON.stringify({ meta: { checks, sims, ms: Date.now() - t0, error }, findings: [...merged.values()] }) + '\n');
	process.exit(0);

	// ---------------------------------------------------------------
	// Comprobaciones sobre el estado actual (en copias: la partida real no se toca)
	// ---------------------------------------------------------------
	async function checkState() {
		checks++;
		const live = S.G;
		// copia sin lo que el hub no mira (registro de diálogos, textos del diario y expedientes): las copias salen baratas
		const base = util.clone({ ...live, dlog: [], diary: live.diary.map(() => 0), intel: Object.fromEntries(Object.entries(live.intel || {}).map(([k, v]) => [k, { notes: (v.notes || []).map(() => 0), teams: {} }])) });
		const savedUI = { ...GU.UI };
		const savedRandom = Math.random;
		const savedErr = console.error, savedWarn = console.warn;
		let seed = 12345;
		Math.random = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
		console.error = () => {}; console.warn = () => {};
		const tc = Date.now(), sims0 = sims;
		try {
			S.setG(util.clone(base)); H.invalidate();
			await runChecks(base);
		} finally {
			if (process.env.HUB_DEBUG) process.stderr.write(`[hub] ${at}: ${Date.now() - tc} ms, ${sims - sims0} simulaciones\n`);
			for (const k of Object.keys(GU.UI)) delete GU.UI[k];
			Object.assign(GU.UI, savedUI);
			Math.random = savedRandom;
			console.error = savedErr; console.warn = savedWarn;
			S.setG(live); H.invalidate();
		}
	}

	async function runChecks(base) {
		const { C, topLoc } = Cn;
		const reset = () => { S.setG(util.clone(base)); H.invalidate(); };
		reset();
		// las simulaciones cambian de partida (copias); antes de preguntar al hub, volver a la base
		const baseG = S.G;
		const B = () => { if (S.G !== baseG) { S.setG(baseG); H.invalidate(); } return true; };
		const R = H.reachable();
		const doors = entrances(); // comprobación independiente del hub: lugares con una entrada visible hoy
		const allSites = H.sites();
		const news = H.newsUpdate().items;
		const active = Object.keys(S.G.quests).filter(q => C.quests[q] && !S.G.quests[q].done);
		const status = Object.fromEntries(active.map(q => [q, H.questStatus(q)]));
		const needs = Object.fromEntries(active.map(q => [q, H.questNeeds(q)]));
		const qsites = Object.fromEntries(active.map(q => [q, H.questSites(q)]));
		const consumers = itemConsumers(allSites);
		const siteName = x => x.kind === 'spot' || x.kind === 'prize' ? (x.label || '') : x.kind === 'tramo' ? `escena del tramo ${x.tramo}` : `al entrar (${x.script})`;
		const locName = x => H.placeOf(x.loc, x.kind === 'spot' || x.kind === 'tramo' ? x.tramo : null);
		const marked = allSites.filter(x => x.kind === 'spot' && H.spotMarker(x.s)).map(x => ({ x, m: H.spotMarker(x.s) }));
		const newVisible = allSites.filter(x => x.kind === 'spot' && x.script && x.s.new !== undefined && !H.spotMarker(x.s) && S.evalCond(x.s.new));
		const obtainable = {};
		const canGet = id => (obtainable[id] ??= (B(), H.itemObtainable(id)));
		const explore = Object.fromEntries(active.map(q => [q, H.exploreSites(q)]));
		const hangs = Object.fromEntries(active.map(q => [q, H.questHangs(q)]));
		const stages = Object.fromEntries(active.map(q => [q, S.G.quests[q].stage]));
		const leave = [...R].filter(id => id !== S.G.loc && !H.canLeave(id));
		const stuckHere = !H.canLeave(S.G.loc);
		const markedIn = new Set(marked.map(({ x }) => x.loc.id));
		const contentNotes = [];
		for (const x of allSites) {
			if (x.kind !== 'spot') continue;
			const a = x.s.action || {};
			let isNew = false; try { isNew = x.s.new !== undefined && S.evalCond(x.s.new); } catch (e) { /* */ }
			if (isNew && (a.shop || a.center || a.pc)) contentNotes.push({ cat: 'contenido', sev: 'info', loc: locName(x), spot: siteName(x), code: 'new-servicio', why: `\`new\` en una tienda/Centro/PC: la pantalla no lo enseña y abrirla no lo apaga`, file: where(x) });
			if (isNew && a.go && !x.script && S.G.visited[a.go] && !H.spotMarker(x.s)) contentNotes.push({ cat: 'contenido', sev: 'info', loc: locName(x), spot: siteName(x), code: 'new-puerta', why: `\`new: '${x.s.new}'\` sigue verdadero aunque ya entraste y dentro no hay nada nuevo`, file: where(x) });
			if (x.script && x.probe.firstEnd) contentNotes.push({ cat: 'contenido', sev: 'aviso', loc: locName(x), spot: siteName(x), code: 'boton-vacio', why: `el botón se ve pero su guion (${typeof x.script === 'string' ? x.script : 'en línea'}) termina sin decir ni hacer nada: falta un \`cond\` que lo esconda o una variante \`talk\` de después`, file: where(x) });
		}
		const markedSet = new Set(marked.map(({ x }) => x));
		const visited0 = { ...S.G.visited };
		const simCache = new Map(), travelCache = new Map();
		const travelOf = async (id, tramo) => { const k = id + '|' + tramo; if (!travelCache.has(k)) travelCache.set(k, await simTravel(id, tramo, base)); return travelCache.get(k); };
		const simOf = async x => {
			const k = x.kind + '|' + x.loc.id + '|' + x.tramo + '|' + (x.label || '') + '|' + (typeof x.script === 'string' ? x.script : JSON.stringify(x.script));
			if (!simCache.has(k)) simCache.set(k, await simSite(x, base));
			return simCache.get(k);
		};

		// --- 1. Novedades: alcanzables, el sitio existe tras viajar y hace algo ---
		for (const it of news) {
			if (it.venture) continue;
			const loc = C.locations[it.loc];
			if (!loc) { add({ cat: 'fantasma', sev: 'grave', loc: it.loc, spot: it.title, code: 'sin-lugar', why: 'apunta a un lugar que no existe' }); continue; }
			if (!doors.has(it.loc) && !(it.kind === 'enter' && C.locations[it.loc]?.parent && doors.has(C.locations[it.loc].parent))) { add({ cat: 'fantasma', sev: 'grave', loc: H.placeOf(loc), spot: it.title, code: 'inalcanzable', why: 'apunta a un sitio sin entrada visible hoy (la historia no ha abierto su puerta)' }); continue; }
			const x = allSites.find(s => s.loc.id === it.loc && (s.tramo ?? null) === (it.tramo ?? null) && ((it.kind === 'enter' && (s.kind === 'enter' || (s.kind === 'arrive' && s.inside))) || (it.kind === 'prize' && s.kind === 'prize') || (['talk', 'quest', 'active'].includes(it.kind) && s.kind === 'spot' && markedSet.has(s) && s.label === it.label)));
			const tv = await travelOf(it.loc, it.tramo ?? null);
			if (!tv.ok && !(tv.code === 'sin-camino' && stuckHere)) { add({ cat: 'viaje', sev: tv.sev || 'grave', loc: H.placeOf(loc), spot: it.title, code: 'ir-' + tv.code, why: `«Ir» desde Novedades: ${tv.why}` }); }
			if (!x) { add({ cat: 'fantasma', sev: 'grave', loc: H.placeOf(loc), spot: it.title, code: 'sin-sitio', why: 'no hay ningún sitio visible que corresponda a la novedad' }); continue; }
			if (it.kind === 'enter') {
				// la novedad es la escena al llegar: viajar allí tiene que cambiar algo
				if (!tv.changed) { const r = await simOf(x); if (!r.changed) add({ cat: 'fantasma', sev: 'grave', loc: locName(x), spot: siteName(x), quest: it.q, code: 'sin-efecto', why: `«${it.title}»: llegar no cambia nada`, file: where(x) }); }
				continue;
			}
			// viajar en la copia y buscar el sitio allí (las escenas al llegar pueden haberlo cambiado)
			let x2 = x, from = base;
			if (tv.ok && tv.after && !tv.changed) {
				S.setG(util.clone(tv.after)); H.invalidate();
				x2 = H.sites().find(s => s.kind === x.kind && s.loc.id === x.loc.id && s.tramo === x.tramo && s.label === x.label);
				from = tv.after;
				if (!x2) { add({ cat: 'fantasma', sev: 'grave', loc: locName(x), spot: siteName(x), code: 'desaparece', why: `«${it.title}»: al llegar, el sitio ya no se ve` }); continue; }
			}
			const r = from === base ? await simOf(x2) : await simSite(x2, from);
			if (!r.changed && !tv.changed) add({ cat: 'fantasma', sev: 'grave', loc: locName(x), spot: siteName(x), quest: it.q, code: 'sin-efecto', why: `la novedad «${it.title}» no cambia nada al tocarla${r.firstEnd ? ' (el guion termina en la primera línea)' : ''}`, file: where(x) });
		}

		// --- 2. Marcas «!», «?», «•»: el sitio de verdad hace algo ---
		for (const { x, m } of marked) {
			const go = !x.script && x.s.action?.go;
			if (go) {
				// puerta con «•»: dentro tiene que haber algo (un sitio sin visitar o con señal)
				const inside = !visited0[go] || markedIn.has(go);
				if (!inside) add({ cat: 'marcador', sev: 'grave', loc: locName(x), spot: siteName(x), code: 'puerta-vacia', why: `la puerta lleva «•» pero dentro no hay nada nuevo`, file: where(x) });
				continue;
			}
			const r = await simOf(x);
			const kind = m.kind === 'new' ? '«!»' : m.kind === 'active' ? '«?»' : '«•»';
			if (!r.changed) add({ cat: 'marcador', sev: 'grave', loc: locName(x), spot: siteName(x), quest: m.q, code: 'sin-efecto-' + m.kind, why: `lleva ${kind} pero tocarlo no cambia nada${r.firstEnd ? ' (termina en la primera línea)' : ''}`, file: where(x) });
			else if (m.kind === 'new' && !r.quests.has(m.q)) add({ cat: 'marcador', sev: 'aviso', loc: locName(x), spot: siteName(x), quest: m.q, code: 'no-empieza', why: `lleva «!» de misión nueva pero no la empieza (${r.what.join(', ')})` });
			// --- 7. Regalos repetibles ---
			if (r.changed && r.gains.length && !r.minigame) {
				// solo si después sigue a la vista (con o sin señal): si desaparece, no se puede repetir
				S.setG(r.after);
				const again0 = H.sites().find(y => y.kind === x.kind && y.loc.id === x.loc.id && y.tramo === x.tramo && y.label === x.label);
				if (!again0) continue;
				const r2 = await simSite(again0, r.after, r.path);
				const again = r2.trade ? [] : r2.gains.filter(g => r.gains.includes(g));
				if (again.length) add({ cat: 'regalo', sev: 'grave', loc: locName(x), spot: siteName(x), code: 'repite', why: `dar dos veces da otra vez: ${again.join(', ')}`, file: where(x) });
			}
		}
		// sitios con `new` verdadero que no hacen nada (el motor ya no los marca): lista para el contenido
		for (const x of newVisible) {
			const r = await simOf(x);
			if (!r.changed) add({ cat: 'contenido', sev: 'info', loc: locName(x), spot: siteName(x), code: 'new-vacio', why: `\`new: '${x.s.new}'\` sigue verdadero pero el guion de ahora (${typeof x.script === 'string' ? x.script : 'en línea'}) no cambia nada`, file: where(x) });
		}

		// más cosas de contenido que el motor ya tapa (para quien revisa el contenido)
		for (const x of contentNotes) add(x);

		// --- 3. Lo que necesitas ---
		for (const q of active) for (const n of needs[q]) {
			if (n.kind !== 'item') continue;
			const used = consumers.has(n.id);
			if (!used) add({ cat: 'necesidad', sev: 'grave', quest: q, spot: itemLabel(n.id), code: 'sin-uso-' + n.id, why: `pide «${itemLabel(n.id)}» ${n.n > 1 ? '×' + n.n + ' ' : ''}pero ningún sitio de ahora lo usa (${n.ok ? 'ya lo tienes' : 'te faltan'})` });
			if (!n.ok) {
				const how = canGet(n.id);
				if (!how) {
					const st = ST.itemSources(n.id);
					add({ cat: 'necesidad', sev: st.story || st.unknown ? 'info' : 'grave', quest: q, spot: itemLabel(n.id), code: 'sin-fuente-' + n.id, why: `pide «${itemLabel(n.id)}» y hoy no hay forma de conseguirlo${st.story ? ' (solo sale en escenas que ahora no se pueden ver)' : st.unknown ? ' (solo en lugares que aún no conoces)' : ''}` });
				}
			}
		}

		// --- 4. Por hacer honesto / En espera vacía ---
		for (const q of active) {
			const st = status[q];
			const def = C.quests[q];
			// sitios de ahora que tocan esta misión (por su guion activo), simulados
			const cands = allSites.filter(x => x.script && touchesScript(x.script, q));
			let mover = null;
			for (const x of cands) {
				const r = await simOf(x);
				if (r.quests.has(q) || (r.changed && touchesScript(x.script, q))) { mover = { x, r }; break; }
			}
			const missing = needs[q].filter(n => !n.ok);
			const gettable = missing.filter(n => n.kind !== 'item' || canGet(n.id));
			if (st.status === 'todo') {
				if (st.reason === 'sitio' && !mover) add({ cat: 'clasif', sev: 'grave', quest: q, loc: qsites[q][0] ? locName(qsites[q][0]) : '', spot: qsites[q][0] ? siteName(qsites[q][0]) : '', code: 'todo-sin-sitio', why: `está en «Por hacer» por ${st.places.slice(0, 2).join(' / ') || 'ningún sitio'}, pero tocar ese sitio no la mueve` });
				if (st.reason === 'necesita' && !gettable.length) add({ cat: 'clasif', sev: 'grave', quest: q, code: 'todo-necesidad', why: 'está en «Por hacer» por algo que falta, pero no se puede conseguir' });
				if (st.reason === 'explorar' && !explore[q].length) add({ cat: 'clasif', sev: 'grave', quest: q, code: 'todo-explorar', why: 'está en «Por hacer» para explorar, pero no hay nada más adelante' });
			} else if (st.status === 'waiting') {
				if (mover) add({ cat: 'clasif', sev: 'grave', quest: q, loc: locName(mover.x), spot: siteName(mover.x), code: 'espera-con-sitio', why: `está en «En espera», pero tocar «${siteName(mover.x)}» la mueve (${mover.r.what.join(', ')})` });
				if (gettable.length) add({ cat: 'clasif', sev: 'grave', quest: q, code: 'espera-con-necesidad', why: `está en «En espera», pero le falta algo que se puede conseguir (${gettable.map(n => n.id).join(', ')})` });
			}
			// --- 5. Colgadas ---
			if (hangs[q]) {
				const ty = def.type || 'side';
				add({ cat: 'colgada', sev: ty === 'thread' || ty === 'event' ? 'info' : 'grave', quest: q, code: 'colgada-' + stages[q], why: `etapa «${stages[q]}»: ningún guion publicado la hace avanzar ni la termina${ty === 'thread' ? ' (hilo: espera a un bloque futuro)' : ''}` });
			}
		}

		// --- 6. Viajes: «Ir» de las zonas de interés y salidas ---
		for (const q of active) for (const x of qsites[q]) {
			if (x.kind === 'arrive' && !x.inside) continue;
			if (!doors.has(x.loc.id) && !(x.kind === 'arrive' && doors.has(x.loc.parent))) add({ cat: 'viaje', sev: 'grave', loc: H.placeOf(x.loc), quest: q, code: 'zona-sin-entrada', why: `«Zonas de interés» manda a un sitio sin entrada visible hoy` });
			if (x.kind === 'arrive') continue;
			const tv = await travelOf(x.loc.id, x.kind === 'spot' ? x.tramo : null);
			if (!tv.ok && !(tv.code === 'sin-camino' && stuckHere)) add({ cat: 'viaje', sev: tv.sev || 'grave', loc: H.placeOf(x.loc), quest: q, code: 'ir-' + tv.code, why: `ir a la zona de interés: ${tv.why}` });
		}
		for (const id of leave) {
			const l = C.locations[id];
			add({ cat: 'viaje', sev: 'grave', loc: H.placeOf(l), code: 'sin-salida', why: 'lugar alcanzable sin ninguna salida' });
		}
		for (const l of Object.values(C.locations)) for (const n of l.links || []) if (C.locations[n]?.parent) add({ cat: 'viaje', sev: 'grave', loc: l.id, code: 'link-sublugar-' + n, why: `el mapa enlaza con ${n}, que es un sub-lugar (el viaje rápido entraría sin puerta)` });
		reset();
	}

	// ---------------------------------------------------------------
	// Simulación de un sitio en una copia de la partida
	// ---------------------------------------------------------------
	// copias rápidas: el texto de cada estado de partida se guarda una vez y se vuelve a leer en cada simulación
	function copyOf(g) { let t = TXT.get(g); if (!t) { t = JSON.stringify(g); TXT.set(g, t); } return JSON.parse(t); }
	function snap(g) {
		const mons = [...g.party, ...g.boxes.flat()];
		return {
			flags: Object.fromEntries(Object.entries(g.flags).filter(([k]) => !k.startsWith('enter:') && !k.startsWith('premio:'))),
			vars: Object.fromEntries(Object.entries(g.vars).filter(([k]) => k !== 'repel')),
			rep: { ...g.rep }, af: { ...g.af },
			quests: Object.fromEntries(Object.entries(g.quests).map(([k, q]) => [k, (q.stage || '') + (q.done ? '✔' : '')])),
			bag: { ...g.bag }, money: g.player.money, mons: mons.length, sp: mons.map(m => m.sp).sort().join(), loc: g.loc,
			diary: g.diary.length, intel: JSON.stringify(g.intel).length, beaten: JSON.stringify(g.beaten), badges: g.player.badges.length,
			neg: JSON.stringify(Object.fromEntries(Object.entries(g.neg || {}).map(([k, v]) => [k, !!v.owned]))), visited: Object.keys(g.visited).length, cleared: Object.keys(g.cleared).length,
			caught: Object.keys(g.dex.caught).length, uniq: JSON.stringify(g.uniq?.missed || {}), puzzles: JSON.stringify(g.puzzles || {}),
		};
	}
	function diff(a, b) {
		const what = [], gains = [];
		for (const k of ['flags', 'vars', 'rep', 'af', 'quests']) {
			const keys = new Set([...Object.keys(a[k]), ...Object.keys(b[k])]);
			for (const x of keys) if (JSON.stringify(a[k][x] ?? (k === 'flags' ? false : k === 'quests' ? '' : 0)) !== JSON.stringify(b[k][x] ?? (k === 'flags' ? false : k === 'quests' ? '' : 0))) what.push(k + '.' + x);
		}
		for (const x of new Set([...Object.keys(a.bag), ...Object.keys(b.bag)])) if ((a.bag[x] || 0) !== (b.bag[x] || 0)) { what.push('objeto ' + x); if ((b.bag[x] || 0) > (a.bag[x] || 0)) gains.push(x); }
		if (b.money !== a.money) { what.push('dinero'); if (b.money > a.money) gains.push('dinero'); }
		if (b.mons !== a.mons || b.sp !== a.sp) { what.push('Pokémon'); if (b.mons > a.mons) gains.push('Pokémon'); }
		for (const k of ['loc', 'diary', 'intel', 'beaten', 'badges', 'neg', 'visited', 'cleared', 'caught', 'uniq', 'puzzles']) if (a[k] !== b[k]) what.push(k);
		return { what, gains };
	}
	function silentUI(path, rec) {
		let k = 0;
		const UI = GU.UI;
		for (const key of Object.keys(UI)) delete UI[key];
		Object.assign(UI, {
			say: async () => {},
			choose: async (p, opts) => { const i = k < path.length ? path[k] : 0; rec.choices.push(opts.length); rec.taken.push(Math.min(i, opts.length - 1)); k++; return Math.min(i, opts.length - 1); },
			prompt: async () => 'Prueba',
			toast: () => {}, refresh: () => {}, scene: () => {},
			goto: async id => { const g = S.G; g.visited[id] = true; for (let p = Cn.C.locations[id]?.parent; p && !g.visited[p]; p = Cn.C.locations[p]?.parent) g.visited[p] = true; g.loc = id; g.route = null; },
			battle: async cfg => {
				const g = S.G;
				if (cfg.trainer) { g.beaten[cfg.trainer] = (g.beaten[cfg.trainer] || 0) + 1; return { result: 'win' }; }
				const w = cfg.wild || {};
				const sp = w.mon?.sp || w.sp;
				if (sp) S.boxInsert(g, { sp, lv: w.lv || 5, uid: 'sim' + Math.random() });
				return { result: 'caught' };
			},
			receivePokemon: async p => { const g = S.G; rec.gifted++; if (g.party.length < 6) g.party.push(p); else S.boxInsert(g, p); },
			learnMove: async () => {}, nickname: async () => {}, shop: async () => {}, center: async () => {}, pc: async () => {},
			evolveCheck: async () => {}, forceEvolve: async (p, to) => { p.sp = to; }, cutscene: async () => {}, venture: async () => {},
			minigame: undefined, puzzle: undefined,
			onScript: () => {},
		});
		// minijuegos: sin interfaz cuentan como ganados (guion.js), pero lo marcamos para no confundirlos con regalos
		UI.minigameLoot = async () => { rec.minigame = true; };
	}
	async function runSite(x, rec) {
		const g = S.G;
		if (x.kind === 'prize') g.flags['premio:' + x.script] = true;
		if (x.kind === 'enter' || x.kind === 'arrive') {
			if (x.kind === 'arrive' || x.here || g.loc !== x.loc.id) await GU.UI.goto(x.loc.id);
			const i = (x.loc.onEnter || []).indexOf(x.s);
			g.flags['enter:' + x.loc.id + ':' + (x.s.script || i)] = true;
		}
		if (x.kind === 'tramo') { const pr = (g.routeProg[x.loc.id] ||= { seen: {}, done: {}, items: {} }); pr.done[x.tramo + ':' + x.script] = true; }
		// el guion de un spot se decide al tocarlo (con el estado de ese momento), como en la pantalla
		const script = x.kind === 'spot' ? H.activeScript(x.s) : x.script;
		if (!script) {
			const a = x.s?.action || {};
			if (a.gather) { const gk = x.loc.id + ':' + a.gather, def = Cn.C.gather[a.gather]; if (def && (g.gather[gk] || 0) + (def.hours || 20) * 3600e3 <= Date.now()) { g.gather[gk] = Date.now(); g.flags['rec_' + a.gather] = true; S.addItem((def.table || [])[0]?.id || 'potion', 1); } return; }
			if (a.trainer) { if (!g.beaten[a.trainer] || a.repeat) await GU.UI.battle({ trainer: a.trainer }); return; }
			if (a.training) { const pz = H.prizeState(a.training); if (pz && pz.ready && !pz.claimed) { g.flags['premio:' + a.training.prize.script] = true; await GU.runScript(a.training.prize.script); } return; }
			if (a.go) { if (W.canEnter(a.go).ok) await GU.UI.goto(a.go); return; }
			return;
		}
		if (JSON.stringify(script).includes('"minigame"')) rec.minigame = true;
		await GU.runScript(script);
	}
	/** Corre un sitio desde `from` (por defecto, la partida base) probando varias ramas de las decisiones. */
	async function simSite(x, from, fixedPath = null) {
		const tries = [fixedPath || []];
		let last = null, runs = 0;
		while (tries.length && runs < (fixedPath ? 1 : 6)) {
			const p = tries.shift();
			runs++; sims++;
			S.setG(copyOf(from));
			const before = snap(S.G);
			const rec = { choices: [], taken: [], minigame: false, gifted: 0 };
			silentUI(p, rec);
			try { await runSite(x, rec); } catch (e) { rec.error = String(e?.message || e); }
			const d = diff(before, snap(S.G));
			// un Pokémon capturado en un combate no es un regalo; uno que te dan (receivePokemon), sí
			if (!rec.gifted) d.gains = d.gains.filter(g => g !== 'Pokémon');
			// si a cambio te quitan algo (un fósil, dinero), es un intercambio, no un regalo repetido
			if (d.what.some(w => w.startsWith('objeto ') && (before.bag[w.slice(7)] || 0) > (S.G.bag[w.slice(7)] || 0)) || S.G.player.money < before.money) d.trade = true;
			const res = { changed: d.what.length > 0, what: d.what, gains: d.gains, trade: !!d.trade, quests: new Set(d.what.filter(w => w.startsWith('quests.')).map(w => w.slice(7))), path: rec.taken, after: S.G, minigame: rec.minigame, get firstEnd() { const g = S.G; S.setG(from); try { return H.probe(x.script).firstEnd; } finally { S.setG(g); } } };
			last = res;
			if (res.changed) return res;
			for (let i = p.length; i < Math.min(rec.choices.length, 3); i++) for (let alt = 1; alt < rec.choices[i]; alt++) tries.push([...rec.taken.slice(0, i), alt]);
		}
		return last || { changed: false, what: [], gains: [], quests: new Set(), path: [], after: from };
	}
	/** Simula «Ir» (travelTo) en una copia: ¿llega, se puede salir de allí, cambió algo al llegar? */
	async function simTravel(id, tramo, from) {
		S.setG(copyOf(from));
		const before = snap(S.G);
		const plan = H.travelPlan(id, tramo);
		if (plan.fallbackMsg) return { ok: false, code: 'sin-entrada', why: plan.fallbackMsg };
		if (!plan.ok) return { ok: false, sev: 'info', code: 'sin-camino', why: plan.msg + (Cn.topLoc(id)?.region !== Cn.topLoc(S.G.loc)?.region ? ' (otra región, sin camino de vuelta todavía)' : '') };
		const rec = { choices: [], taken: [], minigame: false };
		silentUI([], rec);
		const enter = async (lid, fromId) => {
			const g = S.G, loc = Cn.C.locations[lid];
			g.visited[lid] = true;
			for (let p = loc.parent; p && !g.visited[p]; p = Cn.C.locations[p]?.parent) g.visited[p] = true;
			g.loc = lid;
			if (loc.route) { g.route = { id: lid, pos: fromId === loc.route.to ? loc.route.length : 0 }; } else g.route = null;
			const enters = (loc.onEnter || []).concat(...W.activeEvents().map(e => e.onEnter?.[lid] || []));
			for (let i = 0; i < enters.length; i++) {
				const e = enters[i], key = 'enter:' + lid + ':' + (e.script || i);
				if (e.once !== false && g.flags[key]) continue;
				if (e.cond !== undefined && !S.evalCond(e.cond)) continue;
				g.flags[key] = true;
				try { await GU.runScript(e.script); } catch (er) { /* */ }
				if (S.G.loc !== lid) return false;
			}
			return true;
		};
		try {
			for (const step of plan.steps) {
				if (!W.canEnter(step.id).ok) return { ok: false, code: 'puerta', why: `${Cn.C.locations[step.id]?.name}: ${W.canEnter(step.id).msg}` };
				if (!(await enter(step.id, step.from))) return { ok: true, changed: true, moved: true };
			}
		} catch (e) { return { ok: false, code: 'error', why: 'error al viajar: ' + e.message }; }
		const g = S.G;
		if (g.loc !== plan.id) return { ok: false, code: 'no-llega', why: `acaba en ${g.loc} en vez de ${plan.id}` };
		if (!plan.here && !H.canLeave(g.loc)) return { ok: false, code: 'sin-salida', why: `deja en ${g.loc}, sin salida` };
		H.invalidate();
		const changed = diff(before, snap(g)).what.some(w => !['loc', 'visited'].includes(w));
		return { ok: true, changed, after: g };
	}
	/**
	 * Oráculo independiente del hub (usa world.js directamente): lugares de primer nivel visitados y, desde ellos,
	 * los sub-lugares con una puerta visible y abierta hoy (spot «ir a…» o desvío de ruta).
	 */
	function entrances() {
		const g = S.G, L = id => Cn.C.locations[id];
		const out = new Set(), q = [];
		const add = id => { if (id && L(id) && !out.has(id)) { out.add(id); q.push(id); } };
		for (const l of Object.values(Cn.C.locations)) if (!l.parent && g.visited[l.id]) add(l.id);
		add(g.loc); // donde estás ahora (aunque una escena te trajera sin puerta)
		while (q.length) {
			const l = L(q.pop());
			for (const s of W.spotsOf(l)) if (s.action?.go && L(s.action.go)?.parent && W.canEnter(s.action.go).ok) add(s.action.go);
			if (l.route) for (let n = 0; n <= l.route.length; n++) for (const it of W.tramoItems(l, n)) {
				const go = it.branch?.go || it.spot?.action?.go;
				if (go && L(go)?.parent && W.canEnter(go).ok && (!it.branch || S.evalCond(it.branch.cond ?? true))) add(go);
			}
		}
		return out;
	}
	/** Objetos que algún sitio de ahora usa: `has("x")`/`count("x")` sin negar en sus condiciones, o `{ take: 'x' }`. */
	function itemConsumers(list) {
		const out = new Set();
		const rx = /(^|[^!\w.])(?:has|count)\("(\w+)"\)/g;
		const conds = c => { for (const m of String(c).matchAll(rx)) out.add(m[2]); };
		const walk = (cmds, d = 0) => {
			for (const c of cmds || []) {
				if (!c || typeof c !== 'object') continue;
				if (c.cond) conds(c.cond);
				if (c.if) conds(c.if);
				if (c.take) out.add(c.take);
				if (c.call && d < 5) walk(Cn.C.scripts[c.call], d + 1);
				for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onRun', 'onSolve', 'onQuit']) if (Array.isArray(c[k])) walk(c[k], d);
				if (Array.isArray(c.choice)) for (const o of c.choice) { if (o?.cond) conds(o.cond); walk(o?.then, d); }
			}
		};
		for (const x of list) {
			const s = x.s || {};
			for (const t of [].concat(s.talk || [], s.action?.talk || [])) { if (t.cond) conds(t.cond); walk(typeof (t.script || t.do) === 'string' ? Cn.C.scripts[t.script] : t.do); }
			if (x.script) walk(typeof x.script === 'string' ? Cn.C.scripts[x.script] : x.script);
		}
		// escenas de tramo con condición (saltan cuando consigues algo)
		const R = H.reachable();
		for (const l of Object.values(Cn.C.locations)) if (l.route && R.has(l.id)) for (const n in l.route.tramos || {}) for (const it of [].concat(l.route.tramos[n] || [])) if (it.script && it.cond) conds(it.cond);
		return out;
	}
	function touchesScript(sc, q) {
		if (typeof sc === 'string') return !!H.questTouches()[sc]?.has(q);
		return JSON.stringify(sc).includes('"' + q + '"');
	}
	function itemLabel(id) { return DATA.D.items[id]?.name || id; }
	/** archivo:línea aproximados del sitio en app/content (por su etiqueta o su guion). */
	function where(x) {
		const needle = x.kind === 'spot' ? (x.s.label || '') : (typeof x.script === 'string' ? x.script : '');
		if (!needle) return '';
		return findInContent(needle);
	}
}

function findInContent(needle) {
	if (!CONTENT_FILES) {
		CONTENT_FILES = [];
		const walk = d => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (f.name.endsWith('.js')) CONTENT_FILES.push([path.relative(ROOT, p), fs.readFileSync(p, 'utf8').split('\n')]); } };
		walk(path.join(ROOT, 'app/content'));
	}
	const q = `'${needle.replace(/'/g, "\\'")}'`;
	for (const [f, lines] of CONTENT_FILES) { const i = lines.findIndex(l => l.includes(`label: ${q}`) || l.includes(`script: ${q}`)); if (i >= 0) return `${f}:${i + 1}`; }
	for (const [f, lines] of CONTENT_FILES) { const i = lines.findIndex(l => l.includes(needle)); if (i >= 0) return `${f}:${i + 1}`; }
	return '';
}
