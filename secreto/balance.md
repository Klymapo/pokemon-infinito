# BALANCE (curva de niveles y reglas de diseño)

> Dificultad pedida: **"pasable pero difícil"**. El jugador debe sudar en los jefes, pero sin tener que farmear horas.
> El jugador quiere poder **pasar fácil con Riolu/Lucario** si lo cuida: los jefes pueden castigar a Lucario, pero nunca dejarlo inútil (nada de muros de Fantasma + Volador + Psíquico juntos sin respuesta).

## 1. Herramientas del jugador (ya existen en el motor)

- **Tope suave** (`vars.cap`): a partir de ese nivel, la experiencia se multiplica por ×0.1. Se sube con `{ cap: N }` al obtener una medalla o vencer a un jefe.
- **Repartir Experiencia** (activable en Ajustes, encendido por defecto): 50 % para los que no combatieron.
- **Zonas de entrenamiento** (`training: { cap: N }`): se cierran si la media del equipo ya llega al tope de la zona.
- **IA de entrenadores** del 1 al 5:
  - 1–2: genéricos.
  - 3: rivales y entrenadores de gimnasio.
  - 4: líderes.
  - 5: jefes de trama y revanchas.

## 2. Curva publicada

| Bloque | Región | Tramo | Salvajes | Entrenadores | Jefe | Tope al final |
|---|---|---|---|---|---|---|
| B1 | Kalos | Prólogo, Rutas 4 y 3 | 3–8 | 6–10 | Brock: 12–14 | 15 → **24** con la medalla 1 |
| B1 | Kalos | Rutas 5 a 9, Cueva Brillante | 9–19 | 11–20 | Blanca: 21–23 | **33** con la medalla 2 (antes 23 en la zona de entrenamiento) |
| B1 | Kalos | Ruta 10, Crómlech, Ruta 11 | 20–26 | 22–28 | Corelia: 29–32; Torre: Mega-Lucario 34 | **35** |

## 3. Curva planeada (ajustable; anótalo aquí si la cambias)

Regla general: cada bloque de ~12 h sube el techo de **+8 a +10 niveles**. A partir de nivel 60 sube más despacio (+6 a +8), para que el nivel 100 llegue en el Acto IX y no antes.

| Bloque | Acto / región | Medallas | Jefes de la curva | Tope al final |
|---|---|---|---|---|
| B2 | II · Kalos II y Johto | **5** (publicado) | Antón 36, Rhi 37, Bastien 38, Morti 39, Atenea 41 | 42 (37 al empezar; 40 con la medalla 4) |
| B3 | II · Johto | **7** (publicado) | Li 42, Corelia 43 (Mega), Yasmina 45, Atlas 49 | 50 (46 y 48 con las medallas) |
| B4 | III · Kanto | **8** (publicado: Misty, clasificación para la Copa) | Rhi 49 (opc.), Misty 53, Atenea 53, Magda 53 | 56 (52 Puente Pepita, 54 Misty, 55 Atenea) |
| B5 | IV · Alola (pruebas en vez de medallas) | Z | 54–60 | 62 |
| B6 | V · Teselia | 8 + Copa | 60–66 | 68 |
| B7+ | VI–IX | — | +6 por bloque | 100 en el Acto IX |

El Circuito Infinito tiene medallas de todas las regiones. No hay 8 medallas por región; hay una temporada continua. El número de medallas de cada bloque lo fija su plan.

## 4. Reglas de diseño de combates

1. **Jefe = tope del tramo − 1 en su as.** El resto del equipo va de −3 a −1 por debajo.
2. **Tamaño de los equipos de jefe:**

   | Etapa | Pokémon |
   |---|---|
   | Medallas 1–2 | 3 |
   | Medallas 3–5 | 4 |
   | Medallas 6+ | 5 |
   | Actos finales | 6 |

3. **Objetos curativos del rival:**
   - Líderes: máximo 1 hasta la medalla 4; luego 2.
   - Jefes de trama: máximo 2.
   - Nunca curaciones totales antes del Acto IV.
4. **Movimientos de preparación** (Danza Espada, Paz Mental, Maquinación…):
   - Como mucho uno por equipo de jefe hasta el B3.
   - Nunca en el as de un líder si ese as ya supera en velocidad al equipo esperado del jugador.
5. **Los Pokémon con Robustez/Banda Focus** solo pueden aparecer una vez por combate.
6. **Cada jefe tiene al menos una respuesta clara** que el jugador pudo capturar en las 2–3 zonas anteriores. La ficha de reto lo insinúa ("dicen que el agua le sienta mal").
7. **Combates obligatorios contra rivales con 2 o más Pokémon:**
   - El equipo del jugador tiene derecho a pasar por un Centro antes.
   - Si no hay Centro, el guion cura al equipo (`heal: true`).
8. **Megaevolución, Z, Dinamax y Tera en el enemigo** solo después de que el jugador las tenga, con una excepción: un jefe de trama puede usarlas una vez como "demostración" si el combate se puede perder sin consecuencias.
9. **Dinero:**
   - Recompensa base = nivel del as × 20 × clase.
   - Clases: genérico ×1, gimnasio ×1.5, líder/rival ×3, jefe ×4.
   - Los precios de tienda son los canon.
10. **Salvajes:**
    - Usa las tablas canon (`ref/encuentros-*.json`) con niveles reajustados.
    - Cada zona tiene 1 especie rara (≤5 %) que da ilusión.
    - Los desplazados por Fisura se marcan con `desplazado: true`.

## 4b. Zonas viejas y revanchas (decisión de Mario, 2026-10-05: «fijo con revanchas»)

Los niveles siguen **fijos por zona**: no hay escalado al nivel del equipo. Pero cuando la historia vuelve a una región o zona ya jugada:

- **Nueva temporada:** en las rutas viejas aparecen entrenadores nuevos (o los de siempre con equipos nuevos) con niveles de la curva **actual** − 3, con su `cond` del acto/bloque. Los originales siguen derrotados.
- **Revanchas de líderes:** en el Circuito, cada líder ya vencido ofrece una revancha opcional, una vez por bloque, con el equipo al nivel del jefe del bloque actual y uno o dos Pokémon nuevos. Recompensa: dinero y un objeto útil (nunca obligatoria).
- **Salvajes de zonas viejas:** cuando se vuelve en un acto posterior, se añade a la tabla una variante con niveles = curva actual − 8 a − 4 (`cond` por bloque), sin quitar la original. Puede incluir una evolución de lo que ya había.
- **Nunca** subir los niveles de los combates obligatorios ya publicados (rompería partidas en curso).
- Todo esto se anota en el plan de cada bloque que vuelva a zonas viejas.

## 5. Criterios de la auditoría de balance (bot)

`node herramientas/auditar.mjs` ejecuta 12 semillas de día (13 h) y 12 de noche (3 h) y aplica estos umbrales:

| Señal | Umbral | Qué hacer |
|---|---|---|
| Recorridos que llegan al final | ≥ 75 % (bloquea) | Busca el atasco: suele ser un `cond` o un flag; a veces es culpa del bot |
| Derrotas de media contra un mismo rival | ≤ 2 (aviso) | Baja 1 nivel al as o quita una poción |
| Recorridos sin ninguna derrota | ≤ 2/3 (aviso) | El bloque es demasiado fácil: sube +1 a los ases o añade cobertura |
| `ERRORES` | 0 (bloquea) | — |

**Ojo:** el bot juega peor que una persona (no planea el equipo, a veces rechaza combates al azar y su Riolu puede no evolucionar). Que pierda un poco es lo esperado; que pierda mucho contra el mismo rival es un muro.

**Referencia de la publicación 1** (24 recorridos): 24/24 llegan al final. Derrotas medias: Blanca 0.83, Mega-Lucario de la Torre 0.46, Brock 0.25, Corelia 0.13. 3 recorridos sin derrotas.

## 6. Historial de ajustes

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-10-04 | Ruta 4 más suave; tope tras la medalla 1 de 22 a 24 | El bot se estancaba antes de Blanca |
| 2026-10-04 | Miltank de Blanca 24 → 23, una sola Superpoción | Muro en 4 de 14 semillas |
| 2026-10-04 | Hawlucha de Corelia sin Danza Espada, con una Superpoción | Muro en Corelia |
| 2026-10-04 | Bot: hora fija (día/noche), reintenta gimnasios y mete en el equipo los Pokémon que pide un sitio (`inParty`) | Atascos del bot, no del contenido |
| 2026-10-05 | B2: Protón sin Lanzallamas, 1 objeto, Golbat y Muk a 33 | Perdía 11 veces en una semilla |
| 2026-10-05 | B2: Rhi as 37 (Cinderace), Corvisquire en vez de Corviknight; Bastien Greninja 38; una Superpoción cada uno | Muro en las primeras pruebas (7 y 6 derrotas) |
| 2026-10-05 | B2: Atenea con 1 objeto, Honchkrow sin Ala de Acero, Vileplume 38; Morti con Infortunio en vez de Hipnosis y 1 objeto | Si Mario se queja, revisar primero el Honchkrow de Atenea |
| 2026-10-05 | Bot: prefiere la región del último lugar nuevo (no vagar por Kalos tras cruzar la Puerta de Trigal) | Atasco del bot, no del contenido |

**Referencia de la publicación 3** (24 recorridos B1+B2): 23/24 llegan al final (el atasco es el del bot contra Brock en la semilla 8, ya conocido). Derrotas medias: Blanca 1.29, revanchas de Brock 1.13 / Corelia 1.04 / Blanca 0.92 (opcionales), Morti 0.96, Antón 0.58, Atenea 0.42, Bastien 0.29. Ningún recorrido sin derrotas.
| 2026-10-06 | B3: Corelia de Trigal 39–43, sin objeto, Machamp con Agallas | Muro (3.08 derrotas de media) → 1.58 |
| 2026-10-06 | B3: entrada a la guarida marcada como nueva mientras Atlas no esté vencido | El bot (y una persona) no sabía volver |
| 2026-10-06 | B3: Atlas 44–45 + Houndoom 49, una Hiper y una Super, revancha con curación | Muro en las primeras pruebas |

**Referencia de la publicación 4** (24 recorridos B1+B2+B3): 23/24 llegan al final (semilla 8: atasco conocido del bot con Brock). Derrotas medias: Corelia (Trigal) 1.58, Blanca 1.29, Rhi opcional 1.21; Yasmina 0.42, Atlas 0.33.
| 2026-10-06 | B4: Atenea 50–53 sin Maldición ni Divide Dolor, una Hiperpoción | El bot se encallaba en los archivos (desgaste) |
| 2026-10-06 | B4: Magda 50–53, Magnezone con Robustez en vez de Cálculo, Porygon-Z con Descarga, una Hiperpoción | Muro en el nodo con equipos débiles al Acero/Eléctrico |
| 2026-10-06 | B4: Rhi del tren 45–49 (Cinderace 49) y una Superpoción en vez de Hiperpoción | Rival opcional con 2.21 derrotas de media |
| 2026-10-06 | Misty: as 53 con tope 52 a propósito (la «revancha»); si Mario se queja, bajar a 52 o quitar una Superpoción | Decisión de diseño |
| 2026-10-06 | Bot: el «frente» solo cambia con lugares nuevos del bloque más reciente; fuera del frente vuelve por el camino más corto; y, como una persona, camina hacia el «!» más cercano o el sitio sin visitar (sin volver en bucle a rutas bloqueadas) | Se perdía en Johto/Kalos tras cruzar Puertas y vagaba por Kanto (el B4 tiene muchos sub-lugares) |
- 2026-10-06 (día): `rhi_4` suavizado (Cinderace 44→43, sin Superpoción): subió a 2,0–2,75 derrotas de media del bot tras los ajustes de canon; con el cambio, ~0,75 en 8 recorridos.
- 2026-10-07 (madrugada de historia): `rhi_5` (opcional, tren) 44–48 (Cinderace 48) con Baya Aranja en vez de Baya Zidra. Antes 2,29–2,38 derrotas de media del bot; ya no sale como muro. Regalos nuevos: Chikorita 15, Cyndaquil 13, Totodile 17 (bajo su nivel de evolución), Huevo Suerte al cerrar la misión para que alcancen; 5 fósiles revividos a nv 25. Amistosos opcionales: Ramiro (42–44) y Yasmina con su equipo de gimnasio (46–47).
- 2026-10-10 (Publicación 7): premios de entrenamiento (4 Megapiedras de 12: Aerodactyl, Delphox, Gyarados, Gallade); Megas enemigas **opcionales** a 48, 50, 50 y 53; Teras salvajes de peso 3–4. Tiendas de MT: preparación y potencia ≥ 110 solo con 8 medallas (Paz Mental llega antes como premio en Malva); Terremoto a ₽20 000 con 7 medallas. **Negocios:** todo comprado ≈ ₽420 000, ₽14 000–27 000/día entre los tres; Caramelo Raro ≤ 0,08/día; vitaminas ≤ 0,11/día cada una. Si Mario se queja de que rinden poco, sube primero las entradas de dinero base (`money` de las líneas), no las partes.
- **Decidido por Mario (2026-10-10):** la curva se queda como está (tope suave que sube por bloque, 100 en el Acto IX, equipo libre entre regiones). No restringir el equipo al cambiar de región ni igualar niveles.
- 2026-10-10 (Publicación 8): minijuegos. Un jugador normal gana 87–100 % en los 18 publicados (niveles 2–4); economía en `docs/MINIJUEGOS.md` §5 (₽3 000–7 400 por punto jugando; raras ≤ 10 %). Megapiedras nuevas: Heracrossita y Absolita. Auditoría: 24/24 recorridos; `rhi_4` (2,08) y `rhi_5` (2,25) salen como muro en esta tanda (rivales opcionales, ya suavizados dos veces: mirar si se repite antes de tocar).
