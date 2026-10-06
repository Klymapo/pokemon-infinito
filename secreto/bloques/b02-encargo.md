# Encargo para escribir un tramo del Bloque 2

Vas a escribir **un archivo de contenido** de Pokémon Infinite, un fangame personal en español para un solo jugador (Mario, 24 años, CDMX, fan de las historias con giros justos, los NPCs memorables y los sistemas con reglas). Su perfil resumido está en `secreto/referencias.md`.

## Lee primero (en este orden)

1. `docs/CONTENIDO.md`: el formato exacto. **Respétalo al pie de la letra.** No inventes comandos.
2. `secreto/biblia.md`, `secreto/personajes.md` y `secreto/candidatas.md`: la historia secreta, los personajes y su voz.
3. `secreto/bloques/b02-plan.md`: el plan del bloque. **Tu tramo está ahí.** Síguelo; mejora detalles sin romper los contratos de abajo.
4. `secreto/registro.md` y `secreto/hilos.md`: qué se publicó en el B1, qué decisiones pudo tomar el jugador y qué sigue en cada hilo.
5. `secreto/referencias.md`: gustos del jugador y reglas de referencias.
6. `secreto/balance.md`: reglas de combate (equipos de jefe, objetos, preparación, recompensas).
7. **Ejemplo de estilo y nivel de calidad:** el B1 entero en `app/content/b01/` (sobre todo `t2-costa.js`, `t3-yantra.js` y `t4-encuentros.js`). Mira cómo están hechos los diálogos, las ramas por flag, las rutas, las cinemáticas (`cutscene`), las `parts` y los `gather`.
8. Ya escritos para el B2 (no los edites): `app/content/b02/npcs.js`, `misiones.js`, `comun.js`, `index.js`.
9. Tablas canon de encuentros: `secreto/ref/encuentros-johto.json` (y `encuentros-kalos-xy.json` para el T0). **Sube los niveles** a la curva del plan; mantén las especies canon de la zona. Los desplazados vienen de otras regiones.

## Qué entregar

**Un solo archivo**, el que se te indique (`app/content/b02/tN-xxx.js`), que exporte:

```js
export default {
  locations: { ... },
  trainers: { ... },
  scripts: { ... },
  extraSpots: { trigal: [ ... ] },   // solo para añadir botones a lugares NUEVOS del B2 que estén en OTRO archivo
  patches: { yantra: { spots: [...], onEnter: [...] }, ruta4: { route: { tramos: { 3: [...] }, encounters: { grass: [...] } } } }, // lugares del B1
  npcs: { ... },     // solo NPCs nuevos y genéricos de tu tramo (los importantes están en npcs.js)
  items: { ... },    // solo objetos nuevos que necesites
  quests: { ... },   // solo misiones NUEVAS y pequeñas de tu tramo (las grandes ya están en misiones.js)
  gather: { ... },   // puntos de recolección nuevos de tu tramo
  challenges: { ... }, // fichas de reto de tus zonas (además de las de comun.js)
};
```

- **No edites ningún otro archivo.** Si crees que falta algo en un archivo ajeno (una etapa en `misiones.js`, un objeto en `comun.js`, pixel art para un objeto clave), **dilo en tu respuesta final**.
- **Nunca toques nada del B1** (`app/content/b01/`). Para añadir cosas a lugares del B1 usa `patches` en tu archivo.
- **Ids nuevos con prefijo `b02_`** en flags, misiones y guiones de historia. Entrenadores y lugares sin prefijo, pero que no choquen con el B1 (mira `secreto/registro-auto.md`).

## Reglas de calidad

- **La historia es lo primero.** Diálogos con voz propia (ver `personajes.md` y `candidatas.md`). Humor que sale del personaje. Cada escena avanza algo.
- **Recoge las decisiones del B1** que el plan (§4) asigna a tu tramo. Escribe **todas** las ramas; Mario aún no ha decidido Crómlech, así que prevé también el caso de que no exista ningún flag de esa decisión (`!flag.b01_delatar && !flag.b01_handsome && !flag.b01_trato_sera`).
- **Nada de relleno genérico.** Cada entrenador de ruta tiene una frase con personalidad, de una línea, que deje ver un trocito de mundo (la Gira, las Puertas, los Rocket que «han vuelto», los desplazados…).
- **Español natural,** cercano y neutro-latino en los diálogos. **Nombres oficiales de España**: Ciudad Trigal, Pueblo Azalea, Encinar, Ciudad Iris, Pozo Slowpoke, Torre Quemada, Torre Campana, Parque Nacional, Ruinas Alfa, Antón, Morti, Kurt, Atlas, Atenea, Protón, Chicas Kimono, Sudowoodo, Regadera Ardilla, Bonguri… Si dudas del nombre de un movimiento u objeto, consulta `app/data/moves.json` o `app/data/items.json` (campo `name`).
- **Marcadores** `{jugador}`, `{riolu}` (el mote de su Riolu/Lucario) y `{o|a|e}`. El protagonista puede ser él, ella o elle. **El compañero ya es Lucario** casi seguro en el B2 (la Torre lo garantiza): escribe «{riolu}» y descríbelo como Lucario; si quieres cubrir el caso raro, usa `inParty("riolu") || inParty("lucario")` en condiciones.
- **Decisiones** sin respuesta correcta, con efectos (`rep`, `af`, `flag`).
- **Afecto con hechos:** opciones de diálogo ±1–3; acciones ±5–10. Las candidatas: `af.lila`, `af.rhi`, `af.sera`, `af.renata`, `af.irene`, `af.kaori`.
- **Referencias escondidas:** 1 o 2 por zona, sutiles; como mucho una evidente por misión. Apúntalas en tu respuesta final.
- **Líderes, rivales y jefes:** movimientos, habilidad, objeto y naturaleza elegidos a mano, IVs 25–31. Deben ser movimientos que la especie aprende (el validador avisa). Respeta `balance.md` §4: tamaño de equipo (4 Pokémon con medallas 3–5), objetos curativos (máximo 1 hasta la medalla 4 en líderes, luego 2; jefes de trama 2), como mucho un movimiento de preparación por equipo de jefe, Robustez/Banda Focus una vez por combate, y que Lucario nunca quede inútil.
- **Combates obligatorios contra rivales con 2+ Pokémon:** Centro antes o `{ heal: true }`. **Un rival que te reta justo después de un líder o jefe siempre ofrece curarte primero.**
- **Encuentros:** 6–10 especies por ruta, pesos razonables, 1 rara (≤5 %), 1–2 desplazados de otras regiones (`displaced: true`), alguna nocturna (`time: 'night'`).
- **Rutas:** de 6 a 10 tramos, 3–5 entrenadores (alguno opcional), 2–4 objetos (al menos uno oculto) y `text` de ambiente en tramos sueltos.
- **Ciudades:** Centro Pokémon (`{ center: true }`), PC, tienda (`tienda_1`, que ya existe) y al menos una misión pequeña o conversación interesante. Las ciudades y pueblos llevan `kind: 'city'` o `'town'` (dan postal).
- **Fichas de reto** (`challenges`) para cada jefe o zona nueva con combate importante, y **`mapNote`** en cada lugar nuevo con algo destacable.
- **Colección:** en tus rutas y cuevas, 1–2 puntos `gather` nuevos; 1–2 objetos con `read` (cartas, notas, diarios de NPCs que cuenten algo de su historia) y, si encaja, uno con `art` (se pinta en `app/js/ui/acuarela.js`; si usas un `art` nuevo, dilo en tu respuesta y descríbelo, lo pinto yo).
- **Objetos clave nuevos:** cada uno con una **cinemática** (`cutscene`) al recibirlo, como el Farol de Lana del B1. El pixel art de `PX_ITEMS` lo añado yo: describe en tu respuesta cómo es (forma, colores) en 2 líneas.
- **Diario de Rotom:** 1–3 entradas en tu tramo, en momentos importantes (`{ diary: '…' }`). Voz: primera persona, alegre, ingenua, cariñosa («Hoy mi entrenador{|a|e}…»). **Narrador no fiable:** omite lo que el plan dice que omita (ver plan §6 y biblia §3.5 y §7). No repitas pistas del B1.
- **Duración:** apunta en tu respuesta cuántos minutos crees que dura tu tramo. Apunta a la del plan.

## Validación (obligatoria)

```
cd /home/claude/pokemon-infinito && node herramientas/validar.mjs
node -e "import('./app/content/b02/tN-xxx.js').then(m=>console.log(Object.keys(m.default)))"
```

- Los otros tramos se escriben **en paralelo**: verás errores ajenos (lugares o entrenadores de otros tramos que aún no existen). **Arregla todos los errores de tu archivo** y las advertencias razonables (sobre todo «normalmente no aprende» y flags que se leen pero nunca se activan).
- Si puedes, prueba tu tramo con el bot: `node herramientas/recorrido.mjs --semilla 3 --hasta <flag de tu final de tramo>` (el bot juega todo el B1 antes; tarda). Si se atasca por culpa de otro tramo que aún no existe, no pasa nada: dilo.

## Contratos compartidos (no los cambies)

### Región y mapa

- `johto` ya está declarada en `index.js` (mapa 100 × 120). Kalos es `kalos` (100 × 140).

### Lugares (id → coordenadas de mapa)

| Tramo | Lugares (región) |
|---|---|
| T0 | Solo `patches` de lugares del B1 (`yantra`, `luminalia`, `luminalia_plaza`, `agencia`, `lab_cipres`, `cafe_soleil`, `lemnis_kalos`, `luminalia_sur`, `gym_novarte`, `gym_relieve`, `gym_yantra`, `vanitas`, `castillo_caduco`, rutas…). Sub-áreas nuevas de Luminalia si las necesitas (por ejemplo, `centro_procesamiento`, `parent: 'luminalia'`). |
| T1 (johto) | `santuario_encinar` (14,88, kind `forest`, **no es ruta**; `links: ['encinar']`), `encinar` (22,86, ruta `from: 'azalea'`, `to: 'ruta34'`, terreno forest, ~9 tramos; el Santuario es un `branch` en un tramo central), `azalea` (34,96, town), `pozo_slowpoke` (`parent: 'azalea'`, kind `cave`, con `encounters` y spots `explore`), `gym_azalea` (`parent: 'azalea'`), casa de Kurt y lo que quieras como sub-áreas de Azalea |
| T2 (johto) | `ruta34` (22,72, ruta `from: 'encinar'`, `to: 'trigal'`), `trigal` (22,56, city), `puerta_trigal` (`parent: 'trigal'`: la Puerta Lemnis de Johto), `gym_trigal` (`parent: 'trigal'`, en obras), sub-áreas de Trigal a tu criterio (Torre Radio, Centro Comercial, pabellón de la Gira, floristería…), `ruta35` (22,42, ruta `from: 'trigal'`, `to: 'parque_nacional'`), `parque_nacional` (28,32, kind `area`) |
| T3 (johto) | `ruta36` (40,28, ruta `from: 'parque_nacional'`, `to: 'iris'`, nombre **«Rutas 36 y 37»**, ~10 tramos, Sudowoodo bloqueando un tramo), `iris` (50,14, city), `gym_iris` (`parent: 'iris'`), `teatro_danza` (`parent: 'iris'`), `torre_quemada` (`parent: 'iris'`, kind `cave`), sub-áreas de Iris a tu criterio, `ruta42` (66,16, ruta `from: 'iris'`, `to: 'rancho_aurelio'`), `rancho_aurelio` (74,26, kind `area`, bg `ranch`) |

**Conexiones:** santuario_encinar–encinar · azalea–encinar–ruta34–trigal–ruta35–parque_nacional–ruta36–iris–ruta42–rancho_aurelio.
- Cada ruta declara `links` con sus dos extremos y `route.from`/`route.to` iguales.
- `encinar`: bloqueo en el tramo hacia la Ruta 34: `{ block: { cond: 'flag.b02_encinar_libre', msg: '…niebla…', dir: 1 } }`. Lo pone T1.
- `ruta36`: `enterCond: 'flag.b02_trigal_hecho'` (con `blockedMsg`). Sudowoodo: `{ block: { cond: 'flag.b02_sudowoodo', … } }` + guion que usa la `regaderaardilla`.
- **Volver a Kalos (T2):** en `puerta_trigal`, spot «Cruzar a Kalos» `{ action: { go: 'luminalia_plaza' } }` con `cond: 'flag.b02_puerta_trigal'`; y en `patches.luminalia_plaza`, spot «Cruzar a Johto (Trigal)» `{ action: { go: 'puerta_trigal' } }` con la misma `cond`.

### Entrenadores con id fijo (otros archivos o `comun.js` los referencian)

| Tramo | Ids |
|---|---|
| T0 | `brock_r2`, `blanca_r2`, `corelia_r2` (revanchas opcionales; Corelia con `gimmick: 'mega'`, `ace: 'lucario'`) |
| T1 | `proton_1` (npc `proton`), `gym_azalea_1`, `gym_azalea_2`, `anton_g4` (npc `anton`, `cls: 'Líder'`) |
| T2 | `rhi_3` (npc `rhi`), `bastien_3` (npc `bastien`) |
| T3 | `gym_iris_1`, `gym_iris_2`, `morti_g5` (npc `morti`, `cls: 'Líder'`), `atenea_1` (npc `atenea`) |

### Flags y objetos que otros archivos leen

| Tramo | Debe activar / dar |
|---|---|
| T0 | `b02_inicio_hecho` (al principio de `b02_inicio`, con `{ cap: 37 }`) · `b02_cetoddle` si el jugador acepta al Cetoddle (si no, `b02_cetoddle_noa`) · `b02_rouxel_caido` · `b02_hector_matiere` · `b02_puerta_cruzada` (justo antes de `{ go: 'santuario_encinar' }`, último paso del T0) · misión `b02_m1` hecha y `b02_m2` a etapa `santuario` |
| T1 | `b02_celebi_visto` · `b02_pozo_hecho` · tras vencer a Antón: `{ badge: 'medalla_colmena' }`, `{ cap: 40 }`, `b02_m3` hecha · `b02_encinar_libre` (después de la medalla) · `b02_m2` hecha y `b02_m4` a etapa `ruta34` |
| T2 | `b02_trigal_llegada` (onEnter de Trigal) · `b02_puerta_trigal` (vuelta a Kalos disponible) · `b02_handsome_noche` (la escena que el Diario omite) · `{ give: 'regaderaardilla' }` · `b02_kaori_trigal` (cameo de Kaori) · `b02_trigal_hecho` (fin del tramo) · `b02_m4` hecha y `b02_m5` a etapa `rutas` |
| T3 | `b02_m_aviso` (onEnter de Iris, primera vez) · `b02_sudowoodo` · tras vencer a Morti: `{ badge: 'medalla_niebla' }`, `{ cap: 42 }`, `b02_m6` hecha · `{ give: 'fragmentored' }` y una de `b02_frag_handsome` / `b02_frag_sera` / `b02_frag_melia` · `b02_fin` (último guion del bloque) · `b02_m5` hecha |

Ya existen y los puedes leer: todos los flags del B1 (tabla de `registro.md`) y `secreto/registro-auto.md`. Variables: `vars.riolu_uid` (usa `who: 'riolu'`), `vars.mareep`, `vars.cap`. Reputaciones: `rep.lemnis`, `rep.policia`, `rep.kalos`, `rep.flare`, `rep.johto` (nueva para la gente de Johto).

### Otras piezas existentes

- **Tiendas:** `tienda_1` (ya trae Hiperpoción y Ultra Ball con 3 medallas), `boutique_luminalia`, `herbolario`, `tienda_piedras`; y en el B2 (`comun.js`): `centro_comercial_trigal` (variado, MT), `tienda_iris` (Bonguris, inciensos, objetos de Fantasma).
- **Medallas (`comun.js`):** `medalla_colmena` (Bicho, Antón), `medalla_niebla` (Fantasma, Morti).
- **Objetos propios del B2 (`comun.js`):** `regaderaardilla`, `fragmentored`, `caramelolazo` (no usable: Rotom lo desaconseja), `menujohto` (de Gaspar, `use: 'usar_menu_johto'`), `cartanoa`, `recetapanmuerto`, `mt_pulsoumbrio` (MT Pulso Umbrío), `mt_ida_vuelta` (MT Ida y Vuelta), `mt_bola_sombra` (MT Bola Sombra). Si necesitas más, créalos en tu archivo (`items`).
- **Del B1:** `tarjetapi`, `farollana`, `lenteaura`, `holomisorsera`, `ambarsinregistro`, `tarjetaviajero`, `plumagris`, `notavencejo`, `megaring`, `lucarionite`, `menukalos`.
- **Misiones del B2:** `app/content/b02/misiones.js`. Avánzalas con sus etapas exactas. Al retomar un hilo del B1 que quedó abierto, ciérralo (`{ quest: 'b01_t_x', done: true }`, sin texto extra) y abre el nuevo del B2 (`{ quest: 'b02_t_x', stage: '…' }`).

## Técnica

- **Combates de historia que se pueden perder:** `{ battle: 'id', lose: 'continue', onWin: [...], onLose: [...] }`.
- **Rival opcional:** tramo con `{ trainer: 'x', optional: true, label: '…' }` o spot con `talk` que lance `{ battle: 'x' }`.
- **Sub-áreas:** `kind: 'building'`, `'gym'`, `'cave'` o `'area'`, con `parent`. El gimnasio va como sub-área, con los entrenadores como spots `{ action: { trainer: 'id' } }`, y el líder con `cond: 'beat("gym_x_1") && beat("gym_x_2")'` más un spot alternativo que lo explique mientras no se cumpla.
- **Una sola vez:** usa `flag` propios y `!flag.x` en las variantes de `talk`, y `!done.x` o `quest.x == 'hecha'` para misiones. **Nunca** des un regalo dos veces (el bot detecta «REGALOS REPETIDOS» y la auditoría lo bloquea).
- **Hora del día:** el bot juega de día y de noche. Si una escena solo pasa de noche, deja una alternativa de día o una forma de esperar («Esperar a que anochezca» que avance la escena) para no bloquear la historia.
- **No inventes comandos** que no estén en `docs/CONTENIDO.md` §7.

## Respuesta final

Al terminar, responde con:

1. Resumen breve de lo que escribiste.
2. Minutos estimados.
3. Referencias escondidas que usaste.
4. Apariciones de NPCs con nombre: quién, dónde y en qué escena.
5. Pistas plantadas (Diario, mundo, pérdidas).
6. Decisiones y flags nuevos que el siguiente bloque debe leer.
7. Objetos clave nuevos con su descripción para el pixel art; `art` nuevos con su descripción.
8. Cualquier cosa que deba cambiar fuera de tu archivo.
