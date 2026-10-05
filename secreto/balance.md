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
| B2 | II · Kalos II y Johto | 4 | 36–40 | 42 |
| B3 | II/III · Johto y Kanto | 5–6 | 42–48 | 50 |
| B4 | III · Kanto | 7 | 48–54 | 56 |
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
