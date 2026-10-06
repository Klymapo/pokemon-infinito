# Encargo para escribir un tramo del Bloque 3

**Las reglas generales son las mismas que en el B2:** lee `secreto/bloques/b02-encargo.md` entero (qué leer, qué entregar, reglas de calidad, validación, técnica y respuesta final) y aplícalas cambiando «B2» por «B3», el prefijo `b02_` por `b03_` y la carpeta `app/content/b02/` por `app/content/b03/`. Aquí solo cambian el plan y los contratos.

## Lee además

1. `secreto/bloques/b03-plan.md` (tu tramo).
2. Todo el **B2** publicado (`app/content/b02/`), sobre todo el tramo que va justo antes del tuyo, y la sección «Publicación 3» de `secreto/registro.md` (decisiones del B2 y pistas plantadas) y la tabla «Estado tras el B2» de `secreto/hilos.md`.
3. La biblia §10 (fijado en la Publicación 3: N-02, Ω-0-0-0, Caramelos Lazo, Matías Olmedo).
4. Ya escritos para el B3 (no los edites): `app/content/b03/npcs.js`, `misiones.js`, `comun.js`, `index.js`.

**Mario aún no ha jugado el B2.** Escribe **todas** las ramas de sus decisiones (fragmento, Cetoddle, furgoneta, Lila protegida, Kaori, Lucien…) y de las del B1 que menciones (Crómlech, Bastien, Mareep), incluido el caso «ninguna».

## Contratos compartidos (no los cambies)

### Lugares (región `johto`, mapa 100 × 120)

Ya existen (B2): `trigal` (22,56), `gym_trigal` (en obras; lo «abre» T1 con `patches`), `puerta_trigal`, `ruta35`, `parque_nacional`, `ruta36` (Rutas 36 y 37, 10 tramos, `parque_nacional`→`iris`), `iris` (50,14), `ruta42` (`iris`→`rancho_aurelio`), `rancho_aurelio` (74,26), `azalea` (34,96), `encinar`, `ruta34`, `santuario_encinar`. Para añadir cosas a esos lugares usa `patches`.

| Tramo | Lugares nuevos |
|---|---|
| T0 | `malva` (62,46, city), `torre_bellsprout` (`parent: 'malva'`, kind `tower`), `ruta32` (60,64, ruta `from: 'malva'`, `to: 'azalea'`, ~9 tramos; las Ruinas Alfa son un `branch` en un tramo), `ruinas_alfa` (50,72, kind `area`, `links: ['ruta32']`), `camara_alfa` (`parent: 'ruinas_alfa'`). Conexión con lo existente: `patches.ruta36.route.tramos` con un `branch` hacia `malva` en un tramo intermedio (p. ej. el 4) y `malva.links` incluye `ruta36`. |
| T1 | `ruta38` (30,14, ruta «Rutas 38 y 39», `from: 'iris'`, `to: 'olivo'`, ~9 tramos), `granja_muumuu` (20,8, kind `area`, `bg: ranch`, como `branch` de la `ruta38`, `links: ['ruta38']`), `olivo` (8,24, city), `faro_olivo` (`parent: 'olivo'`), `gym_olivo` (`parent: 'olivo'`), sub-áreas de Olivo a tu criterio. En Trigal: `patches.gym_trigal` con los entrenadores de Corelia y `patches` de Trigal para Lila, Renata y el sótano (`sotano_estacion`, `parent: 'trigal'`, nuevo). |
| T2 | `monte_mortero` (82,24, ruta de cueva `from: 'rancho_aurelio'`, `to: 'caoba'`, ~8 tramos, terreno cave), `caoba` (88,14, town), sub-áreas de Caoba a tu criterio (la tienda de recuerdos `tienda_recuerdos` la crea T3), `patches.rancho_aurelio` para la pérdida. |
| T3 | `ruta43` (90,8, ruta `from: 'caoba'`, `to: 'lago_furia'`, ~7 tramos), `lago_furia` (92,3, kind `area`, bg `coast`), `tienda_recuerdos` (`parent: 'caoba'`), `guarida_rocket` (`parent: 'tienda_recuerdos'` o `'caoba'`, kind `cave`), sub-áreas de la guarida si las necesitas. |

`rancho_aurelio` debe enlazar con `monte_mortero` (lo hace la ruta de T2, que lo declara en `links`).

### Entrenadores con id fijo

| Tramo | Ids |
|---|---|
| T0 | `sabio_li` (Torre Bellsprout, as 42), `tobias_2` (npc `tobias`, opcional) |
| T1 | `gym_trigal_1`, `gym_trigal_2`, `corelia_g6` (npc `corelia`, `cls: 'Líder'`, `gimmick: 'mega'`, `ace: 'lucario'`), `gym_olivo_1`, `gym_olivo_2`, `yasmina_g7` (npc `yasmina`, `cls: 'Líder'`), `bastien_4` y/o `rhi_4` (opcionales) |
| T2 | — (rutas y cueva) |
| T3 | `atlas_1` (npc `atlas`, jefe de trama), reclutas a tu criterio |

### Flags y objetos que otros leen

| Tramo | Debe activar / dar |
|---|---|
| T0 | `b03_inicio_hecho` (al principio de `b03_inicio`, con `{ cap: 42 }` si hiciera falta) · `b03_nodo02` (el jugador entiende que N-02 son las Ruinas Alfa) · `b03_ruinas_hecho` (fin del tramo) · `b03_m1` hecha y `b03_m2` a etapa `trigal` |
| T1 | tras Corelia: `{ badge: 'medalla_planicie' }`, `{ cap: 46 }`, `b03_m3` hecha · `b03_sylveon` (Lila) · tras Yasmina: `{ badge: 'medalla_mineral' }`, `{ cap: 48 }`, `b03_m4` hecha · `b03_noa_doctora` (la entrada del Diario «la doctora Lambert», si va en T1) · `b03_m2` hecha y `b03_m5` a etapa `rancho` (esto dispara la llamada de la sobrina: el guion de la llamada es de T2; T1 solo cambia la etapa y pone `flag.b03_llamada_sobrina`) |
| T2 | `b03_aurelio_muerto` · `cartaaurelio` (`{ give }`) · una de `b03_rancho_sobrina` / `b03_rancho_jugador` / `b03_rancho_lemnis` · `b03_m_aviso` (onEnter de Caoba, primera vez) · `b03_m5` hecha y `b03_m6` a etapa `lago` |
| T3 | `b03_gyarados_rojo` · tras Atlas: una de `b03_rocket_policia` / `b03_rocket_libres` / `b03_rocket_quemar` · `{ cap: 50 }` · `b03_m6` hecha · `b03_fin` (último guion del bloque, `{ save: true }`) |

### Otras piezas existentes

- **Medallas (`comun.js`):** `medalla_planicie` (Lucha, Corelia de intercambio en Trigal), `medalla_mineral` (Acero, Yasmina en Olivo).
- **Objetos del B3 (`comun.js`):** `cartaaurelio` (read), `traduccionunown` (read), `planoprototipo` (read), `registroondas` (read), `pinzaonda` (objeto clave: bloquea la señal; lo da T3 a quien convenga), `mt_puno_drenaje` (MT Puño Drenaje), `mt_garra_umbria` (MT Garra Umbría), `mt_cola_ferrea` (MT Cola Férrea). Tiendas: `tienda_1`, `centro_comercial_trigal`, `tienda_iris` (B2) y `tienda_olivo`, `tienda_caoba` (B3).
- **NPCs nuevos (`npcs.js` del B3):** `yasmina`, `atlas`, `lance`, `li` (Sabio Li), `sobrina` (sobrina de Aurelio: **Adela Prado**, 34, veterinaria de pueblo, práctica, ruda de cariño), `recluta_rocket_b3` y genéricos.
- **Misiones del B3:** `app/content/b03/misiones.js`. Hilos que continúan: ciérralos al retomarlos si quedaron abiertos en el B2 (`b02_t_kaori`, `b02_t_noa`, `b02_t_ambar`, `b02_t_cabina`, `b02_t_vencejos`) y abre el `b03_t_x` correspondiente.
