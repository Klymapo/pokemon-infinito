# PROGRESO DEL JUGADOR

> Lo actualiza cualquier sesión en la que Mario diga hasta dónde ha llegado (o pegue su "Exportar continuación").
> La sesión nocturna lo usa para no adelantarse demasiado ni quedarse corta.

| Fecha | Dónde va Mario | Fuente |
|---|---|---|
| 2026-10-05 | Empieza el Bloque 1 | Publicación inicial |
| 2026-10-05 15:21 | B1 · `b01_m7:cromlech` (antes de la decisión de Crómlech). 6 h 51 min, 2 medallas, 28/112 en la Pokédex. Le llegó el aviso de 3 h. Todas las secundarias disponibles hechas (falta `b01_s_espejo`, que está más adelante). Equipo nv27-28: Croagunk, Gallade, Tyrunt, Flaaffy «Candela», Budew + Honedge nv12 (capturado para leveleo). **Riolu ya evolucionó a Lucario** y está en la caja; Mario dice que lo vuelve a poner. Decisiones: `b01_prensa_lemnis`, `b01_agente_vencido`, `b01_fennekin_unido`, `b01_mareep_jaula` (6 Mareep), `b01_bastien_cubierto`. Afinidad: Rhi 14, Renata 6, Lila 4, Sera 1, Irene 1. Rep: Lemnis −5, policía 9, Kalos 10. | Exportar continuación |
| 2026-10-06 10:24 | B2 · `b02_m2:santuario` (Santuario del Encinar). 22 h 19 min, 3 medallas (Roca, Encanto, Lucha), 37 capturados / 150 vistos. Equipo: Lucario 37, Ampharos «Candela» 37, Delphox 37, Gastly 10, Cetoddle 30, Lechonk 14. Ya cruzó la Puerta (no puede volver a Kalos). Fósil elegido: Tyrunt (Amaura quedó sin elegir). Afinidad: Lila 17, Rhi 14, Sera 11, Renata 6, Irene 3. Rep: Lemnis 2, policía 6, Kalos 11. Preguntó si ya tiene «todos los importantes capturables». | Exportar continuación |

**Ritmo de Mario:** ~7 h de juego el primer día. Un bloque (~12 h) por noche le va por delante. Ofreció una **segunda sesión de madrugada** si hace falta; úsala para la cola de arte, interfaz y motor, no para adelantar más historia.


> **2026-10-06:** el B3 ya está publicado (sesión de día).
> Desde hoy hay **dos sesiones de madrugada**: 0:47 (arte, interfaz, sonido y motor) y 2:53 (historia). La de historia no toca `app/js/` salvo bugs; la de arte no toca la historia.

**Último bloque terminado:** ninguno (B1 casi terminado).
**Bloques publicados:** B1, B2, B3 (B2 y B3 publicados el 2026-10-05/06 en sesión de día, a petición de Mario) y **B4 (Kanto)**, publicado la madrugada del 2026-10-06. Vamos **3 bloques por delante**: la próxima madrugada de historia **no** escribe el B5 (Alola) salvo que Mario avance; toca eventos por fecha (Navidad entra en la ventana de 60 días a partir del 21 de octubre) o profundidad.

## Pedidos de Mario pendientes

- **2026-10-06 · Nada importante debe perderse para siempre.** Tras cruzar la Puerta ya no puede volver a Kalos, y ahí se quedaron capturas raras (Bagon, Larvitar, Eevee, Kecleon, Smeargle, Pikachu) y el fósil no elegido (Amaura). Propuesto a Mario: una vía para recuperarlos en Johto con historia. Pendiente de su respuesta.

- **2026-10-06 · Designer de Canvas (UX/UI).** Quiere que todo lo visual (textos, recuadros, iconos, menús) quede lo mejor posible. Bot `herramientas/ux.py` en la auditoría. Primera pasada corregida (contraste de tipos y botones, letra ≥ 12, toques ≥ 44, nombres del PC completos, pestañas con pista de desplazamiento). **Pendiente:** los iconos con emoji → iconos pixelados propios (ya era la noche 2 del pedido de arte); la sesión de arte de las 0:47 lo hace con `ux.py` como comprobación.

- **2026-10-06 · Colección completa.** Quiere tener todos los iniciales, pseudolegendarios, legendarios, singulares y Pokémon «particulares». Ver regla en `CLAUDE.md` §2.4 y la tabla del Game Designer (`secreto/auditorias/disenador-*.md`). Hoy: Iniciales 4/29, Pseudos 2/10, Fósiles 2/15, Eevee 8/8, Especiales 7/16, legendarios/singulares/ultraentes/paradojas 0.
- **2026-10-06 · «Rhi me reta sin dejarme curar».** HECHO: todos los combates contra personajes con nombre ofrecen curar antes; el Game Tester lo vigila.

- ~~**2026-10-05 · Retratos mucho más distintos**~~ **HECHO 2026-10-06 (madrugada de arte)**, ver «Hecho a petición de Mario». Quiere reconocer a cada personaje por su silueta y distinguir mucho una cara de otra. Rehacer `portraitCanvas` en `app/js/art.js` siguiendo `docs/ARTE.md` (o la skill `pixel-art`, si está disponible):
  - Plantillas ASCII por capas y contorno automático.
  - Más formas de cabeza, pelo, cejas, ojos, narices, vello facial, edades y accesorios.
  - Un `look` diseñado a mano para cada NPC con nombre de `npcs.js`, con su brief de 3 rasgos.
  - Revisar con las hojas de contactos, siluetas y grises y la métrica de IoU antes de publicar.
  - Mantener los parámetros de `look` que ya existen (compatibilidad) y añadir los nuevos.

- **2026-10-05 · Arte pixelado de la mejor calidad posible, con animaciones e iconos.** Repartirlo en varias madrugadas, sin dejar de avanzar la historia, siguiendo `docs/ARTE.md` (o la skill `pixel-art`) y con revisión por imágenes en cada paso:
  1. ~~**Noche 1:** retratos (punto anterior), con parpadeo y boca al hablar.~~ HECHO 2026-10-06.
  2. **Noche 2:** icono de la app (192/512, *maskable*) y un juego de iconos pixelados propios para la interfaz (barra inferior, lugares, objetos clave). Sustituyen a los emojis.
  3. **Noche 3:** escenas de fondo por tipo de lugar con animación ligera (nubes, agua, faroles de noche, hojas) y transiciones de entrada a combate.
  4. **Después:** efectos de movimientos por tipo en combate (partículas pixeladas) y pantalla de título animada.

- **2026-10-05 · Mejorar la interfaz y añadir sonido.** Repartirlo con el arte; esto puede ir en paralelo con la noche 2.
  - **Interfaz:** auditoría de toda la UI en el móvil (412×860), guiada por la skill `frontend-design`:
    - Jerarquía y legibilidad.
    - Pantalla de lugar menos "lista de botones".
    - Tarjetas de combate y menú más claros.
    - Transiciones cortas, retroalimentación al tocar y estados vacíos.
    - Mantener la identidad (azul marino, aura, crema, dorado; Pixelify + Nunito) y el rendimiento en móvil.
  - **Sonido:** todo sintetizado con Web Audio, sin archivos y sin melodías existentes (nada de temas de Pokémon; composiciones originales tipo chiptune):
    - Efectos: menú, golpe, supereficaz, debilitado, subida de nivel, captura, curación, medalla.
    - Música en bucle por ambiente: título, ciudad, ruta, ruta de noche, combate, líder o jefe, momentos emotivos.
    - Gritos de los Pokémon en combate: los OGG de PokeAPI (`PokeAPI/cries`), descargados en tiempo de ejecución y cacheados como los sprites; nunca en el repo.
    - En Ajustes: volumen de música, de efectos y de gritos, por separado.
    - El audio empieza tras el primer toque, como exige el navegador.

- **2026-10-05 · Combates dobles y hordas.** Hoy el motor solo hace combates individuales (`active[0]`).
  - **Dobles:** el simulador de Showdown los soporta de serie, con un formato de dobles basado en `gen9infinite`. Hay que adaptar:
    - `battle.js`: varias posiciones, elección por posición y objetivos.
    - La IA: objetivo y movimientos de área.
    - La interfaz: dos tarjetas por lado y elegir objetivo al tocar un movimiento que lo necesite.
    - El bot y una prueba en `herramientas/test/`.
    - Contenido: entrenadores con `double: true`, parejas de entrenadores y combates en equipo con un aliado de la IA (Lila, Rhi, Handsome… como compañeros en combates de historia).
  - **Hordas** (canon de Kalos, XY): 1 contra 5 salvajes. Showdown no tiene 1 contra 5; implementarlo propio:
    - Opción A: formato *free-for-all* (hasta 3 rivales) con la IA salvaje apuntando siempre al jugador.
    - Opción B: un modo propio que gestione los 5 como cola de apariciones.
    - Elegir la más fiel que se pueda probar bien.
    - En hordas no se puede capturar hasta que quede uno.
    - Encuentros de horda: un 5–10 % de los encuentros en hierba y cuevas de rutas avanzadas; nunca obligatorios.
  - Hacerlo en una madrugada dedicada al motor, con su prueba incluida en `auditar.mjs`.

- **2026-10-05 · Decisión de balance: «fijo con revanchas»** (ver `balance.md` §4b). Aplicarlo en cada bloque que vuelva a zonas viejas. El B2 vuelve a Kalos: incluir allí la primera «nueva temporada» y las revanchas de Brock, Blanca y Corelia.

- **2026-10-05 · Pérdidas importantes y giros que duelan** (Pokémon o NPCs). Límite elegido por Mario: **despedidas sí, muertes no** para su equipo. Reglas y plan en `biblia.md` §9. Cada bloque planta las pistas que tocan según §9.2 y las anota en `registro.md`.

## Bugs corregidos

- 2026-10-05: Ciprés (y otros 5 NPCs) volvían a dar su regalo cada vez que les hablabas: las condiciones leían la etapa de una misión ya terminada. Arreglo de motor: una misión terminada se lee siempre como `'hecha'` y no se puede reabrir. El bot ahora detecta «REGALOS REPETIDOS» y la auditoría lo bloquea. **Al escribir condiciones de diálogo, usa `!done.x` o lee `quest.x == 'hecha'`.**

## Hecho a petición de Mario

- 2026-10-05: ver los datos de un Pokémon desde el menú de cambio en combate; estilo de combate «Cambio» (preguntar si quieres cambiar cuando cae un Pokémon rival, se puede poner en «Fijo» en Ajustes); descripciones de habilidades en español; pantalla para comparar movimientos al aprender uno nuevo (tipo, categoría, potencia, precisión, PP, descripción y si es del mismo tipo); diario de misiones con pestañas Activas / Nuevas / Hechas / Rotom, agrupadas por tipo y con 📍 dónde avanzar o empezar cada una; Colección (postales de cada pueblo, registro de objetos con ??? y pistas, recuerdos con Mirar/Leer), iconos de objetos en la mochila y 25 puntos de recolección diarios en el B1 (bayas, plumas, setas, minerales, cristales, orilla, menhires y espejos). Guía de zona con probabilidades (1 de cada N, día/noche); botón de lanzamiento rápido de Ball con % real; DexNav (rastrear especies vistas, con cadenas: nivel, IVs perfectos, habilidad oculta, variocolor); marca de capturado (Poké Ball roja) en combate, guía y DexNav. Hub de lugar rehecho (Misiones aquí con «!» nueva / «?» en curso calculados solos a partir de los guiones; servicios en píldoras; mosaico «Explorar»; caminos en mosaico con estado). Diario con pestañas Por hacer / Nuevas / Registro / Hechas / Rotom («Por hacer» = hay sitio donde avanzar, algo que conseguir o es principal; «Registro» = historias abiertas sin nada que hacer); PC rehecho (equipo y 8 cajas en cuadrícula, ver datos de cualquiera, mover/intercambiar entre equipo y cajas y entre cajas, mandar a otra caja, ordenar caja); amistad con 10 corazones en los datos del Pokémon y aviso de evolución por amistad (cuánto falta, de día/de noche); bayas Grana, Algama, Ispero, Meluce, Uvav y Tamate usables (suben la amistad, como en el canon); ficha de misión con lista de partes (`parts`: cada Mareep con ✔/◐/○, tramo exacto y pista) y tramo exacto de los objetos escondidos que pide una misión (con cuántos llevas recogidos); avisos de eventos por fecha (recuadro en cada lugar con los activos y los de los próximos 7 días, aviso de Rotom al empezar, ficha con fechas y dónde, y sección en «Por hacer»); 📌 Seguir en pantalla (hasta 3 misiones en un recuadro dorado arriba de cada lugar y ruta, con su progreso); ficha de misión al tocarla (etapa actual, lo que necesitas con ✔ y barras —sacado solo de las condiciones de los diálogos—, zonas de interés, lo que ya pasó, fechas y duración estimada). **En cada bloque nuevo:** añadir puntos de recolección (`gather`), objetos con `read` (cartas, notas) y `art` (recuerdos para mirar), para que la Colección siga creciendo.

- **2026-10-05 · Lógica de combates (bug reportado).** Rhi lo retó nada más vencer a Blanca, con el equipo dañado y ella con el suyo entero. Corregido: ahora Rhi deja pasar al Centro o te lanza pociones antes. Nueva prueba `herramientas/test/combates-encadenados.mjs` (en la auditoría): ningún combate que empiece solo al entrar a un lugar puede ir sin curación o decisión antes. **Regla para todos los bloques:** un rival que te reta justo tras un líder/jefe siempre ofrece curarte primero.

- **2026-10-05 · Cinemáticas y objetos con cara propia.** Le gustó mucho la misión de los Mareep, sobre todo el Farol de Lana y que sirva para una zona concreta del mapa. Su patrón favorito: **personaje entrañable → objeto clave con pixel art propio → abre una zona concreta**. Desde ahora:
  - Cada objeto clave nuevo lleva su pixel art en `PX_ITEMS` (`app/js/art.js`) y una cinemática (`cutscene`, ver `docs/CONTENIDO.md`) al recibirlo y al usarlo por primera vez en su zona.
  - Usa cinemáticas en los momentos clave de cada bloque (giros, llegadas, legendarios), sin abusar: 2–4 por bloque.

- **2026-10-05 · Ideas de misiones secundarias de Mario** (semillas plantadas en B1 con Petra, Ulises e Ysolde; ver `referencias.md` e `hilos.md`): prehistórica (ámbar, fósiles, era antigua), inspirada en Doctor Who (cabina azul, Dialga joven) e inspirada en Assassin's Creed (hermandad, saltos de fe, hoja oculta). Son ejemplos del *tipo* de cosas que quiere: referencias geek no tan obvias, convertidas en arcos recurrentes.

- **2026-10-05 · Más personajes y más recurrentes.** Hecho en B1 (`t4-encuentros.js`). Mantenerlo: cada bloque debe traer reencuentros con secundarios y al menos un personaje nuevo con 3+ apariciones.

- **2026-10-05 · Hecho en interfaz:** entrenador rival visible en combate (entrada + ficha con su retrato) y Poké Balls de los equipos; tienda rediseñada (cuadrícula, filtros, cantidad y total); Poké Ball pixelada en el menú y animación de captura; tope de nivel visible en Equipo.

- **2026-10-06 · Retratos nuevos (madrugada de arte, noche 1).** Motor nuevo `app/js/retrato.js` (48×48, plantillas por capas, sombreado con desplazamiento de tono, contorno selectivo): 7 formas de cara, 26 peinados, 11 miradas, 7 cejas, 5 narices, 8 bocas, 14 tipos de ropa, edades (niño/adulto/mayor) y ~40 accesorios (sombreros, capucha, antifaz, monóculo, linterna frontal, bufanda, auriculares al cuello…). **Parpadeo** cada 3–6 s y **boca que se mueve al hablar** mientras se escribe el texto. Look diseñado a mano para los 29 personajes originales con nombre (cada uno con un rasgo que sale del contorno); los genéricos salen variados solos. **Editor de aspecto** nuevo en Ajustes › Cambiar aspecto (y en la creación): cara, mirada, cejas, 18 peinados y ropa. Herramienta de revisión `herramientas/retratos.mjs` (contactos, siluetas, grises, tamaño real, animación, IoU). Revisión independiente hecha; Nate, Ulises y Héctor ajustados para no parecerse a personajes conocidos.
  - **Siguiente noche de arte:** icono de la app (192/512, maskable) e iconos pixelados propios de la interfaz. Pendientes menores de retratos: tramado de barba de tres días (Simón) un poco ruidoso, la coleta baja de la jinete y añadir «Cambiar aspecto» a la prueba de humo.
