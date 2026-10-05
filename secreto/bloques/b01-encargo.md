# Encargo para escribir un tramo del Bloque 1

Vas a escribir **un archivo de contenido** de Pokémon Infinite, un fangame personal en español para un solo jugador (Mario, 24 años, CDMX, fan de las historias con giros justos, los NPCs memorables y los sistemas con reglas). Su perfil resumido está en `secreto/referencias.md`.

## Lee primero (en este orden)

1. `docs/CONTENIDO.md`: el formato exacto. **Respétalo al pie de la letra.**
2. `secreto/biblia.md`, `secreto/personajes.md` y `secreto/candidatas.md`: la historia secreta, los personajes y su voz.
3. `secreto/bloques/b01-plan.md`: el plan detallado del bloque. **Tu tramo está ahí.** Síguelo; puedes mejorar detalles sin romper nada de lo que se lista abajo.
4. `secreto/referencias.md`: gustos del jugador y reglas de referencias.
5. Como **ejemplo de estilo y nivel de calidad**: `app/content/b01/t0-luminalia.js` (prólogo ya escrito), `app/content/b01/npcs.js`, `app/content/b01/misiones.js` y `app/content/b01/comun.js`.
6. Tablas canon de encuentros: `secreto/ref/encuentros-kalos-xy.json`. **Sube los niveles** a la curva del plan; las especies, mantenlas canon.

## Qué entregar

**Un solo archivo**, el que se te indique (`app/content/b01/tN-xxx.js`), que exporte:

```js
export default {
  locations: { ... },
  trainers: { ... },
  scripts: { ... },
  extraSpots: { luminalia_sur: [ ... ] },  // solo si necesitas añadir botones a lugares de OTRO archivo
  npcs: { ... },     // solo NPCs nuevos y genéricos de tu tramo (los importantes ya están en npcs.js)
  items: { ... },    // solo objetos nuevos que necesites
  quests: { ... },   // solo misiones NUEVAS y pequeñas de tu tramo (las grandes ya están en misiones.js)
};
```

- **No edites ningún otro archivo.**
- Si crees que falta algo en un archivo ajeno (por ejemplo, una misión de `misiones.js` que necesita otra etapa), **dilo en tu respuesta final** en vez de editarlo.

## Reglas de calidad

- **La historia es lo primero.** Diálogos con voz propia para cada personaje (ver `personajes.md` y `candidatas.md`). Humor que sale del personaje. Escenas que avanzan algo.
- **Nada de relleno genérico.** Cada entrenador de ruta tiene una frase con personalidad, de una línea. Mejor si deja ver un trocito de mundo, por ejemplo cómo vive la gente lo de las Fisuras o lo del Circuito.
- **Español natural,** cercano y neutro-latino en los diálogos. Usa los **nombres oficiales de España** para lugares, movimientos, objetos y personajes canon: Ciudad Novarte, Ruta 4, Palmeo, Poké Ball, Baya Aranja, Brock, Blanca, Corelia…
  - Si dudas del nombre en español de un movimiento u objeto, consulta `app/data/moves.json` o `app/data/items.json` (campo `name`) por su id en inglés en minúsculas sin espacios.
- **Usa los marcadores** `{jugador}`, `{riolu}` y `{o|a|e}` donde corresponda. El protagonista puede ser él, ella o elle.
- **Decisiones:** sin respuesta "correcta", con efectos (`rep`, `af`, `flag`) como dice el plan.
- **Afecto con hechos:** las opciones de diálogo cambian la afinidad ±1–3, y las acciones ±5–10.
- **Referencias escondidas:** 1 o 2 por zona, sutiles, y apúntalas en tu respuesta final.
- **Combates de líderes y rivales:** movimientos, habilidades y objetos elegidos a mano. Tienen que ser movimientos que esa especie aprende (el validador avisa). Los de ruta pueden ir sin `moves`.
- **Encuentros:** 6–10 especies por ruta, con pesos razonables. Incluye 1–2 **desplazados** de otras regiones donde el plan lo diga (`displaced: true`). Usa `time: 'night'` para alguna especie nocturna.
- **Rutas:** de 6 a 10 tramos, con 3–5 entrenadores (alguno opcional), 2–4 objetos (al menos uno oculto) y algún `text` de ambiente en tramos sueltos.
- **Ciudades:** Centro Pokémon, tienda (`tienda_1`), los spots de NPCs, y al menos una misión pequeña o conversación interesante por ciudad.
- **Diario de Rotom:** entre 1 y 3 entradas en todo tu tramo, en momentos importantes, con `{ diary: '…' }`.
  - **Voz:** primera persona, alegre, ingenua y cariñosa: "Hoy mi entrenador{|a|e}…".
  - **Ojo, es el narrador no fiable** (ver `biblia.md` §3.5 y §7). Sigue el plan sobre qué omite.
  - Solo escribe entradas **después** de `flag.b01_diario` (Ansel instala el módulo tras la medalla 1). Antes de eso, usa `{ diary: …, cond: 'flag.b01_diario' }` o no las pongas.
- **Estimación de duración:** apunta en tu respuesta cuántos minutos crees que dura tu tramo.

## Validación (obligatoria)

```
cd /home/claude/pokemon-infinito && node herramientas/validar.mjs
```

- Otros archivos del bloque se escriben **en paralelo**, así que verás errores ajenos (lugares o entrenadores de otros tramos que aún no existen). **Arregla todos los errores de tu archivo** y las advertencias razonables (sobre todo "normalmente no aprende" y flags que se consultan pero nunca se activan).
- Comprueba también que tu archivo carga: `node -e "import('./app/content/b01/tN-xxx.js').then(m=>console.log(Object.keys(m.default)))"`.

## Contratos compartidos (no los cambies)

### Lugares (id → coordenadas de mapa; región `kalos`, mapa de 100×140)

| Tramo | Lugares |
|---|---|
| T0 (ya hecho) | `luminalia` (55,70), sub-áreas `luminalia_plaza`, `luminalia_sur`, `lab_cipres`, `agencia`, `cafe_soleil`, `lemnis_kalos`. `luminalia.links = ['ruta4','ruta5']` |
| T1 | `ruta4` (55,82), `novarte` (55,94), `gym_novarte` (parent novarte), `ruta3` (55,103), `bosque_novarte` (55,111), `ruta2` (55,119), `acuarela` (55,125), `ruta1` (55,131), `boceto` (55,137) |
| T2 | `ruta5` (43,70), `vanitas` (31,70), `castillo_caduco` (parent vanitas), `ruta6` (31,61), `palacio_cenit` (31,52), `ruta7` (27,80), `gruta_tierraunida` (19,86), `ruta8` (12,93), `petroglifo` (6,101), sub-áreas de Petroglifo a tu criterio |
| T3 | `ruta9` (3,88), `cueva_brillante` (5,76), `relieve` (8,64), `gym_relieve` (parent relieve), `ruta10` (11,52), `cromlech` (14,41), `excavacion` (parent cromlech), `ruta11` (23,34), `cueva_reflejos` (32,29), `yantra` (42,24), `torre_maestra` (parent yantra), `gym_yantra` (parent yantra) |

**Conexiones:** luminalia–ruta4–novarte–ruta3–bosque_novarte–ruta2–acuarela–ruta1–boceto · luminalia–ruta5–vanitas–ruta6–palacio_cenit · vanitas–ruta7–gruta_tierraunida–ruta8–petroglifo–ruta9–cueva_brillante–relieve–ruta10–cromlech–ruta11–cueva_reflejos–yantra.

- Cada ruta declara `links` con sus dos extremos, y `route.from`/`route.to` iguales.
- Ojo: **`ruta5` debe tener `enterCond: 'flag.b01_ruta5_abierta'`** con un `blockedMsg` de guardias de Lemnis.

### Entrenadores con id fijo (otros archivos los referencian)

| Tramo | Ids |
|---|---|
| T1 | `gym_novarte_1`, `gym_novarte_2`, `brock_g1` (npc brock), `rhi_1` (npc rhi, en Novarte) |
| T2 | `bastien_1` (npc bastien, Ruta 5) |
| T3 | `bastien_2` (Cueva Brillante), `blanca_g2` (npc blanca), `rhi_2` (Relieve), `corelia_g3` (npc corelia), `corelia_torre` (Mega-Lucario, `gimmick: 'mega'`, `ace: 'lucario'`, Lucario con `item: 'lucarionite'`), `sera_1` (npc sera, Crómlech) |

### Flags que otros archivos leen

| Tramo | Flags |
|---|---|
| T1 | `b01_palmeo` (Riolu aprendió Palmeo en la Ruta 4) · `b01_fennekin_unido` o `b01_fennekin_libre` + misión `b01_s_fennekin` a etapa `volver` · `b01_rhi_conto_onix` (Rhi te cuenta lo del Onix) · `mount_rhyhorn` + `vars.mount = 'rhyhorn'` (montura) · tras vencer a Brock: `{ badge: 'medalla_roca' }`, `{ cap: 22 }`, `{ give: 'mt_tumbarocas' }`, misión `b01_m3` hecha, `b01_m2` a etapa `agencia` |
| T2 | `b01_bastien_ruta5` · misión `b01_t_mareep` (etapas buscar/volver/hecha) · `vars.mareep` (contador de 0 a 6) · objeto `farollana` · `pokeflute` (del Conde) · `b01_snorlax` · `barajasuerte` (objeto clave que encuentras en la Ruta 5; luego `b01_s_philippe` a etapa `volver`) · ingredientes de Gaspar: `honey`, `tinymushroom`, `pechaberry` (ojo: Miel está en la Ruta 4 de T1; T2 resuelve el hilo en la Ruta 7) |
| T3 | `b01_bastien_cubierto`, `b01_bastien_rompe` o `b01_bastien_silencio` · `b01_m_aviso` (al entrar a Crómlech por primera vez: `onEnter`) · `b01_delatar`, `b01_handsome` o `b01_trato_sera` · `b01_rhi_conto_miltank` · `b01_lila_conto_corelia` · `megaring`, `lucarionite`, `{ unlock: 'mega' }` · `b01_fin` (último guion del bloque) |

Ya existen en T0 y los puedes leer: `b01_handsome_recluta`, `b01_diario`, `b01_ruta5_abierta`, `b01_prensa_verdad`, `b01_prensa_neutral`, `b01_prensa_lemnis`, `b01_lila_conocida`, `b01_rhi_conocida`, `b01_bastien_conocido`, `b01_sera_vista`, `b01_gaspar_1`, `b01_philippe_1`. Variable `vars.riolu_uid` (usa `who: 'riolu'` en comandos).

### Otras piezas existentes

- **Tiendas:** `tienda_1`, `boutique_luminalia`, `herbolario`, `tienda_piedras`.
- **Medallas:** `medalla_roca`, `medalla_encanto`, `medalla_lucha`.
- **Objetos propios:** `tarjetapi`, `farollana`, `lenteaura`, `amuletotorre`, `barajasuerte`, `linternapi`, `holomisorsera`, `cempasuchil`, `calabazaoro`, `menukalos`, `mt_tumbarocas`, `mt_fachada`, `mt_puñocerteza`, `mt_airecortante`.
- **Retos** (`comun.js`): ya leen los entrenadores y flags de arriba.
- **Misiones existentes:** `app/content/b01/misiones.js`. Avánzalas con sus etapas exactas.

## Técnica

- **Combates de historia que se pueden perder:** `{ battle: 'id', lose: 'continue', onWin: [...], onLose: [...] }`.
- **Rival de ruta opcional:** tramo con `{ trainer: 'x', optional: true, label: '…' }`, o un spot con `talk` que lance `{ battle: 'x' }` dentro de un guion.
- **Bloqueos de cueva oscura:** `{ block: { cond: 'has("farollana") || has("linternapi")', msg: '…', dir: 1 } }`.
- **Encuentros nocturnos:** `time: 'night'`.
- **Sub-áreas:** `kind: 'building'` o `'gym'`, con `parent`. El gimnasio va como sub-área, con los entrenadores como spots `{ action: { trainer: 'id' } }`. Para que no se pueda retar al líder sin pasar por los entrenadores, usa `cond: 'beat("gym_novarte_1") && beat("gym_novarte_2")'` en el spot del líder, y un spot alternativo que lo explique mientras no se cumpla.
- **No inventes comandos** que no estén en `docs/CONTENIDO.md` §7.

## Respuesta final

Al terminar, responde con:

1. Resumen breve de lo que escribiste.
2. Minutos estimados.
3. Referencias escondidas que usaste.
4. Apariciones de NPCs con nombre: quién, dónde y en qué escena.
5. Pistas plantadas.
6. Cualquier cosa que deba cambiar fuera de tu archivo.
