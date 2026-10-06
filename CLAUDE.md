# Pokémon Infinite · instrucciones para Claude

Fangame personal de Pokémon para **un solo jugador: Mario** (usuario de GitHub `Klymapo`). Es un RPG por texto con combates Pokémon reales, pensado para jugarse en su móvil Android sin conexión. Es una PWA: `app/` se publica tal cual en Cloudflare Workers (recursos estáticos, ver `wrangler.jsonc`) desde la rama `main`, sin paso de compilación. **No cambies `assets.directory`**: si apunta a la raíz, se publicaría `secreto/`.

La historia es **infinita**: cada madrugada (3:00, hora de Ciudad de México) una sesión programada de Claude amplía el mundo, lo audita y lo publica. Este archivo es el procedimiento de esa sesión. También sirve para cualquier sesión que toque el contenido.

---

## 0. Reglas que no se rompen nunca

1. **Cero spoilers para Mario.**
   - Lo que escribas en el chat, en los mensajes de commit y en archivos fuera de `secreto/` debe estar libre de spoilers. Mario puede leer el historial de commits y el resumen de la sesión.
   - Los commits describen **qué tipo** de cambio hay, nunca qué pasa en la historia. Bien: "Bloque 2: nuevas zonas, misiones y eventos". Mal: cualquier mensaje que cuente quién hace qué en la historia.
2. **Nada de ROMs, ni de recursos extraídos de juegos o fangames.**
   - Los sprites de Pokémon se descargan en el móvil desde PokeAPI/sprites y quedan en caché. **No se suben al repo.**
   - Los entrenadores canon usan los sprites de Showdown en tiempo de ejecución, y si no cargan, un retrato procedural.
   - Los personajes originales usan retratos procedurales (`look` en `npcs.js`).
   - No dibujes a mano Pokémon ni personajes canon.
3. **Compatibilidad de partidas.**
   - Nunca renombres ni borres ids publicados: flags, vars, misiones, lugares, objetos, entrenadores ni guiones. Solo se añade.
   - Si algo publicado está mal, corrígelo con un parche (`patches` en el bloque) o con lógica nueva que lea el estado antiguo.
4. **Español.**
   - Nombres oficiales en español de España (Ciudad Luminalia, Poké Flauta…).
   - Diálogos con habla natural y cercana; Mario es de CDMX. Cada NPC tiene su propia voz (`secreto/personajes.md`).
   - Pronombres del jugador con `{o|a|e}`.
5. **Datos canon.** Stats, tipos, movimientos, habilidades y aprendizajes salen de `app/data/`, que se generan de Showdown y PokeAPI. No inventes Pokémon ni movimientos. El validador comprueba que cada Pokémon pueda aprender lo que le pones.
6. **Si la auditoría no pasa, esa noche no se publica contenido nuevo** (ver §4). Es mejor un día sin bloque que un bloque roto.

---

## 1. Mapa del repositorio

| Ruta | Qué es |
|---|---|
| `app/` | El juego (se publica). JavaScript vanilla con módulos ES. |
| `app/js/` | Motor: estado, guiones, mundo, combate (simulador de Showdown), IA, interfaz. |
| `app/lib/` | Bundles del simulador y del parser de textos de Showdown. **No tocar**; se regeneran con `herramientas/build-sim.sh`. |
| `app/data/` | Datos de Pokémon en JSON. Se regeneran con `bun herramientas/build-data.ts`. Casi nunca hace falta. |
| `app/content/` | **Contenido**: un módulo por bloque (`b01/`, `b02/`…) y `index.js` con la lista `BLOCKS` y `CONTENT_VERSION`. |
| `app/sw.js` | Service worker **generado**. Regenéralo siempre antes de publicar. |
| `docs/DISENO.md` | Diseño público (sin spoilers). |
| `docs/CONTENIDO.md` | **Formato exacto del contenido.** Léelo antes de escribir nada. |
| `docs/ARTE.md` | **Guía de pixel art** (siluetas, caras, revisión con imágenes). Obligatoria para cualquier trabajo de arte. |
| `secreto/` | Documentos con spoilers: biblia, personajes, candidatas, hilos, registro, balance, referencias, planes por bloque y auditorías. |
| `herramientas/` | Validador, bot de recorrido, registro, auditoría, prueba de humo y builds. |

---

## 2. Rutina de cada madrugada

Trabaja en este orden. Usa la lista de tareas para que Mario vea el progreso si abre la sesión.

### 2.1 Preparar

1. Sitúate en el repo y ejecuta `git pull --rebase origin main`.
2. Comprueba que existe `node` (≥ 20) y `python3` con Playwright. No hay dependencias npm.
3. Mira los **issues abiertos** del repo: `gh issue list --repo Klymapo/pokemon-infinito`. Ahí puede dejar Mario quejas o bugs.
4. Lee `secreto/progreso.md`: hasta dónde ha llegado Mario.
5. **Propuestas de ChatGPT:** `git fetch origin` y mira las ramas `chatgpt/*` (`git branch -r --list 'origin/chatgpt/*'`). Mario colabora con ChatGPT, que conoce muy bien sus gustos. Protocolo en `docs/COLABORACION.md`; tareas abiertas en `propuestas/TAREAS-CHATGPT.md`.
   - Lee lo nuevo (`git log main..origin/chatgpt/x`, `propuestas/chatgpt/`). **Considéralo en serio**: lo que diga de los gustos de Mario y de sus opiniones sobre el juego pesa tanto como `referencias.md`.
   - Adopta lo que encaje: ideas → plan del bloque o `referencias.md`; gustos y opiniones → `referencias.md` y `progreso.md`; imágenes → revísalas (originales, sin Pokémon ni personajes canon, tamaño razonable) y, si sirven, cópialas a `app/img/` e intégralas. **No fusiones la rama entera**: trae solo los archivos que uses (`git checkout origin/chatgpt/x -- ruta`).
   - Anota la decisión en `propuestas/RESPUESTAS.md` (sin spoilers) y, si hace falta, añade tareas nuevas en `propuestas/TAREAS-CHATGPT.md` (retratos de personajes que Mario ya conoce, fondos de regiones ya visitadas…). Nunca le pidas nada que revele la trama.

### 2.2 Leer el mundo (siempre, antes de escribir)

| Archivo | Para qué |
|---|---|
| `docs/CONTENIDO.md` | Formato |
| `secreto/biblia.md` | Tronco de la historia, actos y calendario de pistas del Diario |
| `secreto/personajes.md` | Personajes y voces |
| `secreto/candidatas.md` | Las 7 candidatas y cómo se gana afinidad |
| `secreto/hilos.md` | Qué hilos siguen abiertos y su siguiente paso |
| `secreto/registro.md` | Qué está publicado, qué decisiones pudo tomar Mario y qué pistas ya salieron |
| `secreto/registro-auto.md` | Apariciones de NPCs, flags, misiones y nombres de entrenadores usados |
| `secreto/balance.md` | Curva de niveles y reglas de combate |
| `secreto/referencias.md` | Gustos de Mario y referencias ya usadas |
| `secreto/bloques/` | Plan del último bloque y encargo de referencia |
| Última auditoría en `secreto/auditorias/` | Avisos pendientes |

### 2.3 Elegir el trabajo de la noche (por prioridad)

1. **Bugs reportados por Mario** (issues o notas en `secreto/progreso.md`). Corrígelos primero.
2. **Siguiente bloque** (si va por delante de Mario menos de 3 bloques; si va 3 o más, pasa al punto 3). Un bloque son unas **12 horas** de juego y se publica **completo**. Si no da tiempo a terminarlo y auditarlo, deja el trabajo en `app/content/bNN/` **sin** añadirlo a `BLOCKS` y súbelo igualmente; la noche siguiente lo terminas.
3. **Eventos por fecha** de los próximos 60 días que aún no existan. Fechas obligatorias:

   | Evento | Fechas |
   |---|---|
   | Halloween | 24–31 oct |
   | Día de Muertos | 28 oct – 3 nov |
   | Navidad | 20–26 dic |
   | Año Nuevo | 31 dic – 2 ene |
   | San Valentín (sutil; afinidad con candidatas) | 14 feb |
   | Primavera | 20–22 mar |
   | Día del Niño (México) | 30 abr |
   | **Cumpleaños de Mario** | **7 jun** |
   | Aniversario de Pokémon | 27 feb |
   | Aniversario de la partida | 5 oct |

   Ponlos en el bloque nuevo (`events`). Los eventos anuales se escriben para repetirse cada año con variaciones según `year`/`vars`.
4. **Profundidad:** misiones secundarias nuevas en zonas ya publicadas (con un `cond` que no rompa partidas en curso), mejoras de arte procedural, pulido de la interfaz, mejoras del bot y del validador.

### 2.4 Escribir un bloque nuevo

1. **Plan** en `secreto/bloques/bNN-plan.md`, con el mismo formato que `b01-plan.md`:
   - Región y tramo, duración meta (~12 h) y flags de inicio y final (`bNN_fin`).
   - Curva de niveles según `balance.md`.
   - Tramos, misiones y decisiones.
   - Hilos que avanza: **al menos 3** de `hilos.md`, y abre 1 nuevo.
   - Pistas del Diario según el calendario de la biblia.
   - Referencias escondidas: como mucho una evidente por misión.
   - Una aparición de cada NPC con nombre que lleve tiempo sin salir.
2. **Encargo** en `secreto/bloques/bNN-encargo.md`, copiando la estructura de `b01-encargo.md`, con los contratos de ids y flags que comparten los tramos.
3. **Escritura en paralelo:** lanza un subagente por tramo (3 o 4), cada uno con su archivo `app/content/bNN/tN-xxx.js`. Tú escribes `index.js`, `npcs.js`, `comun.js` (medallas, objetos, tiendas, retos y el aviso de ritmo) y `misiones.js`.
4. **Reglas de contenido:**
   - **Recoge las decisiones del bloque anterior** (tabla de `registro.md`). Cada gran decisión debe notarse.
   - **Ningún personaje con nombre aparece una sola vez.** Mínimo 3 apariciones en total, repartidas en bloques.
   - **Aviso de ritmo:** un `milestone` con `hoursLeft: 3` unas 3 h antes del final del bloque.
   - Zona de entrenamiento con tope antes de cada jefe. Ficha de reto (`challenges`) y nota de mapa (`mapNote`) para cada zona nueva.
   - Riolu/Lucario tiene que poder lucirse: al menos un momento de historia y combates donde brille.
   - **Misiones de reunir varias cosas** (rescatar N Pokémon, encontrar N piezas…): ponles `parts` (ver `docs/CONTENIDO.md` §6), para que la ficha diga cuáles faltan y en qué tramo están.
   - **Pérdidas y giros:** sigue `secreto/biblia.md` §9 (reglas, límites y plan). Planta las pistas que tocan en cada bloque.
   - Mecánicas por región (biblia §3.3): no des Z, Dinamax ni Tera antes de su acto.
   - **Colección:** cada bloque añade puntos de recolección (`gather`) en sus rutas y cuevas, 2 o 3 objetos para leer (`read`: cartas, notas, diarios de NPCs que cuenten algo de su historia) y al menos un recuerdo para mirar (`art`). Mario pidió poder ver y recolectar muchas cosas.
5. **Registro:**
   - Añade el bloque a `BLOCKS` en `app/content/index.js`.
   - Sube `CONTENT_VERSION` a `AAAA-MM-DD.N`.
   - El `start` del bloque nuevo debe funcionar al continuar una partida que terminó el anterior (`next`/`ends`).

---

## 3. Auditoría extensa (obligatoria cada noche, antes de publicar)

Mario pidió una auditoría extensa en cada actualización. Tiene dos partes y **las dos tienen que pasar**.

### 3.1 Automática

```bash
node herramientas/auditar.mjs            # 12 semillas de día + 12 de noche + eventos + registro + humo
```

Escribe `secreto/auditorias/AAAA-MM-DD.md` y sale con código 1 si algo bloquea. Incluye:

1. **Validador** (`herramientas/validar.mjs`): referencias rotas, condiciones inválidas, aprendizajes imposibles, flags que se leen pero nunca se activan, NPCs con pocas apariciones y **evoluciones imposibles** (un Pokémon conseguible que necesita un objeto que no se puede obtener). **0 errores.**
2. **Superfan** (`herramientas/superfan.mjs`): lee el contenido como un fan que se sabe la Pokédex de memoria y apunta lo que chirría: niveles imposibles para una evolución, básicos que ya deberían haber evolucionado, movimientos que aún no podrían saber, habilidades y géneros imposibles, Megapiedras o cristales Z que no sirven, líderes fuera de su tipo, formas regionales fuera de su región, hábitats y horarios raros, nombres en inglés en los textos y precios que no cuadran. Escribe `secreto/auditorias/superfan-AAAA-MM-DD.md`. **No bloquea**, pero los ✖ (graves) se corrigen esa misma noche si son de contenido nuevo; los de contenido publicado, cuando se toque esa zona. Las · son opinables: si algo es a propósito (un Pokémon de Fisura, un guiño), se deja.
3. **Bot de recorrido** (`herramientas/recorrido.mjs`): juega todo el contenido sin interfaz, de día y de noche.
   - **Bloquea si:** hay `ERRORES`, o menos del 75 % de los recorridos llegan al final.
   - **Avisos de balance:** un rival con más de 2 derrotas de media es un muro. Más de 2/3 de recorridos sin perder ni una vez es demasiado fácil.
   - Corrige el contenido o el balance según `secreto/balance.md` y vuelve a ejecutar.
   - El bot juega peor que una persona; si un atasco es culpa del bot, mejora el bot (y anótalo), no el contenido.
4. **Eventos por fecha:** el bot se ejecuta en la fecha de inicio de cada evento (`--fecha MM-DD`) y comprueba que sus guiones se disparan.
5. **Registro automático** regenerado (`secreto/registro-auto.md`).
6. **Prueba de humo** (`herramientas/humo.py`): Chromium real con pantalla de móvil (412×860). Crea partida, avanza diálogos y combate, y abre todos los menús. Bloquea si hay errores de JavaScript. **Mira las capturas** con la herramienta de lectura de imágenes: textos cortados, botones fuera de pantalla, contraste.

Si añadiste mecánicas nuevas al motor, añade también su prueba (por ejemplo, en `herramientas/test/battle-test.mjs`) y ejecútala.

### 3.2 Lector independiente (subagente)

Lanza un subagente que **no haya escrito** el contenido nuevo. Encárgale que lea `secreto/biblia.md`, `personajes.md`, `candidatas.md`, `registro.md`, `hilos.md`, `referencias.md`, el plan del bloque y **todo** el contenido nuevo o cambiado, y que revise:

- **Continuidad:**
  - Contradicciones con la biblia o con lo publicado.
  - Personajes que saben cosas que no deberían.
  - Decisiones del jugador que se ignoran.
  - Flags de bloques anteriores mal leídos.
- **Reglas del Diario de Rotom:** las de `secreto/biblia.md` §3.5 y §7. Comprueba que las entradas nuevas las cumplen, que las pistas siguen el calendario y que no se repiten.
- **Voces:** cada personaje suena como en `personajes.md`; no hay dos NPCs que hablen igual.
- **Español:** ortografía, concordancia, nombres oficiales, `{o|a|e}` donde toca, sin calcos raros del inglés.
- **Spoilers:** ningún texto visible (fichas de reto, guía de zona, avisos, descripciones de objetos) revela algo que el jugador aún no sabe.
- **Lógica:**
  - Misiones que se pueden romper (objetos que se pueden perder, flags que bloquean para siempre).
  - Recompensas desproporcionadas.
  - Condiciones que nunca se cumplen.
  - Combates obligatorios que rompen la curva.
- **Regla de las 3 apariciones**, y que las referencias escondidas sean sutiles.

El subagente **corrige directamente** lo que encuentre (cambios pequeños) o devuelve una lista (cambios grandes). Después, vuelve a ejecutar la auditoría automática.

### 3.3 Si algo no se puede arreglar esa noche

- Retira de `BLOCKS` lo que falle (el trabajo sigue en su carpeta) y publica solo lo que sí pasa: correcciones y eventos.
- Anota en `secreto/auditorias/AAAA-MM-DD.md` qué quedó pendiente, para la noche siguiente.

---

## 4. Publicar

1. Actualiza los documentos secretos:
   - `secreto/registro.md`: nueva sección "Publicación N", con el estado del mundo, las decisiones con sus flags, las pistas plantadas y los personajes pendientes.
   - `secreto/hilos.md`: estado y siguiente paso de cada hilo.
   - `secreto/referencias.md`: referencias usadas.
   - `secreto/balance.md`: historial de ajustes.
2. `node herramientas/build-sw.mjs`. **Siempre** como último paso antes del commit: cambia la versión de la caché y así el móvil de Mario descarga la actualización.
3. Haz el commit en `main`, con un mensaje sin spoilers y las líneas de atribución que indique la sesión. Después, `git push origin main`.
   - Si el push falla por cambios remotos: `git pull --rebase` y vuelve a empujar.
   - Cloudflare despliega solo en un minuto o dos (Workers Builds, al detectar el push).
4. **Mensaje final de la sesión** (Mario puede leerlo): 3 o 4 líneas, sin spoilers. Qué se publicó (p. ej., "Bloque 2, unas 12 h, con 2 eventos nuevos"), si la auditoría pasó y si hay algo que Mario deba saber (p. ej., "abre el juego con internet para que se actualice").

---

## 5. Comandos útiles

```bash
node herramientas/validar.mjs                          # validar contenido
node herramientas/superfan.mjs                         # detalles de canon con ojos de fan
node herramientas/recorrido.mjs --semilla 3            # una partida del bot (día)
node herramientas/recorrido.mjs --semilla 3 --hora 2   # de noche
node herramientas/recorrido.mjs --fecha 12-24          # en una fecha concreta
node herramientas/recorrido.mjs --hasta b02_m3 --verbose
node herramientas/registro.mjs                         # registro automático
python3 herramientas/humo.py --salida /tmp/humo        # humo en móvil
node herramientas/auditar.mjs                          # todo lo anterior + informe
node herramientas/build-sw.mjs                         # antes de cada commit
```

Para probar a mano, sirve `app/` con `python3 -m http.server -d app 8000` y ábrelo con Playwright en una pantalla de 412×860.

**Nombres de archivo:** no uses nombres que bloquean los bloqueadores de anuncios (`script.js`, `ads`, `analytics`, `track`, `banner`, `pixel`…). Al móvil de Mario no le llegaba `script.js` por eso; ahora se llama `guion.js`.

Sobre la red del entorno: `raw.githubusercontent.com` suele estar bloqueado, así que los sprites no cargan en las pruebas. Es normal y no es un error del juego.
