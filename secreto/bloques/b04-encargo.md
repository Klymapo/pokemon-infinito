# Encargo para escribir un tramo del Bloque 4

**Las reglas generales son las mismas que en el B2 y el B3:** lee `secreto/bloques/b02-encargo.md` entero (qué leer, qué entregar, reglas de calidad, validación, técnica y respuesta final) y aplícalas cambiando «B2» por «B4», el prefijo `b02_` por `b04_` y la carpeta `app/content/b02/` por `app/content/b04/`. Aquí solo cambian el plan y los contratos.

## Lee además

1. `secreto/bloques/b04-plan.md` (tu tramo, y los demás para saber qué hacen).
2. El **B3** publicado (`app/content/b03/`), sobre todo `t3-caoba.js` (el final, `b03_fin`) y `t1-faro.js` (Vencejos, Renata), y las secciones «Publicación 4» de `secreto/registro.md` y «Estado tras el B3» de `secreto/hilos.md`.
3. La biblia completa, sobre todo §3.5 (Diario), §7 (calendario: **B4 = «bzzt… sincronizando…» cerca de las Puertas**), §9 (pérdidas) y §10.
4. Ya escritos para el B4 (no los edites): `app/content/b04/npcs.js`, `misiones.js`, `comun.js`, `index.js`.
5. Tablas canon: `secreto/ref/encuentros-kanto.json` (claves `kanto-route-5`, `kanto-route-8`, `kanto-route-24`, `kanto-route-25`, `cerulean-cave/*`, `pokemon-tower/*`…). Sube los niveles a la curva del plan.

**Mario aún no ha jugado el B2 ni el B3.** Escribe **todas** las ramas de las decisiones que toques (sobre todo `b03_rocket_*`, `b03_rancho_*`, `b03_renata_*`, `b03_vencejo_pluma`, `b02_frag_*`, trato de Sera) y prevé el caso «ninguna» con un texto neutro.

**El compañero es Lucario** casi seguro. Usa `{riolu}` y la condición `inParty("riolu") || inParty("lucario")` cuando la escena dependa de que esté en el equipo. Riolu/Lucario tiene que **lucirse** (aura, combates donde brille).

**Mecánicas:** solo Mega (el jugador la tiene). Nada de Z, Dinamax ni Tera en el B4, ni en el jugador ni en los rivales.

## Contratos compartidos (no los cambies)

### Región y mapa

`kanto` ya está declarada en `index.js` (mapa 100 × 100). Las coordenadas son de primer nivel; las sub-áreas llevan `parent`.

| Tramo | Lugares nuevos |
|---|---|
| T0 | `azafran` (50,52, city, «Ciudad Azafrán»), sub-áreas con `parent: 'azafran'`: `estacion_azafran` (estación del Tren Magnético), `torre_lemnis_kanto` (building), `silph` (building, **cerrada** al público en T0: solo un spot que lo explique; T2 la abre), `puerta_azafran` (la Puerta Lemnis de Kanto), `dojo_karate` (con zona de entrenamiento, tope 51, Kiyo), `gym_azafran` (Sabrina; **no da medalla** en el B4: su gimnasio está «en pausa por el Intercambio»; escena del eco) y las que quieras. Explorar en Azafrán: `encounters` del lugar con spot `explore` (jardines y solares, 44–48). |
| T1 | `k_ruta5` (50,38, ruta «Ruta 5», `from: 'azafran'`, `to: 'celeste'`, ~7 tramos), `celeste` (50,22, city, «Ciudad Celeste»), `gym_celeste` (`parent: 'celeste'`), sub-áreas de Celeste a tu criterio, `ruta24` (64,10, ruta «Rutas 24 y 25», `from: 'celeste'`, `to: 'casa_bill'`, ~9 tramos; el **Puente Pepita** son los tramos 1–5 con 5 entrenadores seguidos, canon), `casa_bill` (84,8, kind `area`, «Casa de Bill», con zona de entrenamiento «Cabo», tope 53). |
| T2 | `k_ruta8` (68,52, ruta «Ruta 8», `from: 'azafran'`, `to: 'lavanda'`, ~7 tramos), `lavanda` (84,52, town, «Pueblo Lavanda»), sub-áreas con `parent: 'lavanda'`: `torre_radio_lavanda`, `sotano_torre` (kind `cave`, la vieja Torre Pokémon: mazmorra corta con `encounters`), `casa_fuji` (Casa Pokémon del Señor Fuji). En Azafrán: `patches.silph` (abrirla) y sub-áreas nuevas de la operación con `parent: 'azafran'` o `'silph'`: `azotea_lemnis` (tejados), `archivo_silph` (archivos). |
| T3 | `cueva_celeste` (32,18, ruta de cueva «Cueva Celeste», `from: 'celeste'`, `to: 'nucleo_celeste'`, ~8 tramos, terreno `cave`, `enterCond: 'flag.b04_silph_hecho'` con `blockedMsg` de guardias de Lemnis «estudio geológico»; bloqueo de galería profunda con `has("sintonizadorbill")`), `nucleo_celeste` (20,10, kind `area`, el Nodo 03; `links: ['cueva_celeste']`). |

**Conexiones:** azafran–k_ruta5–celeste–ruta24–casa_bill · celeste–cueva_celeste–nucleo_celeste · azafran–k_ruta8–lavanda. Cada ruta declara `links` con sus dos extremos y `route.from`/`route.to` iguales.

**Johto y Kalos siguen accesibles:** T0 pone en `estacion_azafran` el spot «🚆 Tren a Trigal» (`{ action: { go: 'estacion_magnetica' } }`, `cond: 'flag.b04_inicio_hecho'`) y en `puerta_azafran` los spots «Cruzar a Kalos (Luminalia)» → `luminalia_plaza` y «Cruzar a Johto (Trigal)» → `puerta_trigal`, con `cond: 'flag.b04_puerta_azafran'`. `comun.js` ya pone el «Tren a Azafrán» en `estacion_magnetica` (Trigal) y el cruce a Kanto en `luminalia_plaza` y `puerta_trigal`.

### Entrenadores con id fijo

| Tramo | Ids |
|---|---|
| T0 | `rhi_5` (npc `rhi`, opcional, en el tren o en la estación; as 50, 5 Pokémon), entrenadores del Dojo (`dojo_az_1`…) |
| T1 | `gym_celeste_1`, `gym_celeste_2`, `misty_g8` (npc `misty`, `cls: 'Líder'`, 5 Pokémon, as 53 Starmie, 2 objetos, sin Mega), `pepita_1` … `pepita_5` (Puente Pepita), `bastien_5` (npc `bastien`, opcional) |
| T2 | `atenea_2` (npc `atenea`, jefa de trama, 5 Pokémon, as 54, 2 objetos), guardias de Lemnis/Rocket a tu criterio, `tobias_3` (npc `tobias`, opcional) |
| T3 | `magda_1` (npc `magda`, jefa de trama, 5 Pokémon, as 55, 2 objetos; puede perderse sin perder la partida: `lose: 'continue'` con revancha) |

### Flags y objetos que otros leen

| Tramo | Debe activar / dar |
|---|---|
| T0 | `b04_inicio_hecho` (al principio de `b04_inicio`) · `b04_tren_hecho` · `b04_azafran_llegada` (onEnter de Azafrán) · `b04_puerta_azafran` (la Puerta de Kanto ya se puede usar) · `b04_sabrina_eco` (escena de Sabrina) · `b04_magda_tren` (la pasajera del termo) · `b04_t0_hecho` (fin del tramo) · `b04_m1` hecha y `b04_m2` a etapa `ruta5` |
| T1 | `b04_puente_hecho` (al vencer a `pepita_5`, con `{ cap: 52 }`) · tras Misty: `{ badge: 'medalla_cascada' }`, `{ cap: 54 }`, `b04_m3` hecha, `b04_clasificado` (8 medallas: clasificad{o|a|e} para la Copa Infinita) · `b04_bill_hecho` y `{ give: 'sintonizadorbill' }` (con cinemática) · `b04_ysolde_plan` (Ysolde propone la operación) · `b04_m2` hecha y `b04_m4` a etapa `tejado` (cuando estén hechas Misty **y** Bill) |
| T2 | `{ give: 'informefuentel' }` y `b04_fuente_l` (el jugador tiene la prueba del topo) · `b04_magda_nombre` (sabe que «M.» es Magda Ivers) · tras Atenea: `{ cap: 55 }`, `b04_atenea_vencida` · `b04_silph_hecho` (fin de la operación) · `b04_m4` hecha y `b04_m5` a etapa `cueva` · Lavanda: `b04_fuji_hecho`, `b04_kaori_paso` (el antídoto da un paso) |
| T3 | `b04_m_aviso` (onEnter de `cueva_celeste`, primera vez) · `b04_mewtwo` (la escena del aura) · tras Magda: una de `b04_lebrun_detenido` / `b04_lebrun_cebo` / `b04_lebrun_libre` · `{ cap: 56 }` · `b04_m5` hecha · `b04_fin` (último guion del bloque, con `{ save: true }`) |

### Otras piezas existentes

- **Medalla (`comun.js`):** `medalla_cascada` (Agua, Misty, Celeste).
- **Objetos del B4 (`comun.js`):** `sintonizadorbill` (clave), `tarjetallave` (clave), `informefuentel` (read), `expedienteolmedo` (read), `fotoexpediente` (read, la foto que queda si `b03_renata_publica`), `servilletam` (read), `diariofuji` (read), `notasmagda` (read), `fotopuente` (art `puente_pepita`), `fotocueva` (art `cueva_celeste_aura`), `mt_escaldar` (Misty), `mt_psiquico` (Sabrina), `mt_foco_resplandor`, `mt_onda_voltio` (Volt Switch). Tiendas: `tienda_azafran`, `tienda_celeste`, `tienda_lavanda`.
- **NPCs nuevos (`npcs.js` del B4):** `misty`, `sabrina`, `bill`, `fuji`, `magda` (Magda Ivers), `presidente_silph`, genéricos `guardia_silph`, `cientifica_lemnis`, `vecino_kanto`, `nadador`, `domador`, `medium_kanto`. Siguen disponibles todos los anteriores (`kiyo`, `atenea`, `atlas`, `lebrun`, `ansel`, `xero`, `sera`, `alexia`, `gadd`, `tobias`, `kaori`, `noa`, `bastien`, `rhi`, `ysolde`, `renata`, `viajero`, `petra`, `sobrina`, `az`, `matiere`, `simon`, `brock`, `lila`, `recluta_rocket_b3`, `guardia_lemnis`, `agente_lemnis`, `tecnico_lemnis`…).
- **Misiones del B4:** `app/content/b04/misiones.js`. Hilos del B3 que siguen abiertos y debes **cerrar al retomarlos** (`{ quest: 'b03_t_x', done: true }` sin texto) abriendo el del B4: `b03_t_noa` y `b03_t_vencejos` y `b03_t_ambar` (T1), `b03_t_kaori` (T2), `b03_t_ondas` (T3).
- **Gran decisión del B4 (T3):** ver plan §5.
- **Arte:** si usas un objeto clave nuevo o un `art` nuevo, descríbelo en la respuesta; el pixel art y los cuadros los pinto yo.
