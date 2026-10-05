# PROGRESO DEL JUGADOR

> Lo actualiza cualquier sesión en la que Mario diga hasta dónde ha llegado (o pegue su "Exportar continuación").
> La sesión nocturna lo usa para no adelantarse demasiado ni quedarse corta.

| Fecha | Dónde va Mario | Fuente |
|---|---|---|
| 2026-10-05 | Empieza el Bloque 1 | Publicación inicial |

**Último bloque terminado:** ninguno.
**Bloques publicados:** B1.

## Pedidos de Mario pendientes

- **2026-10-05 · Retratos mucho más distintos** (prioridad alta en la próxima madrugada). Quiere reconocer a cada personaje por su silueta y distinguir mucho una cara de otra. Rehacer `portraitCanvas` en `app/js/art.js` siguiendo `docs/ARTE.md` (o la skill `pixel-art`, si está disponible):
  - Plantillas ASCII por capas y contorno automático.
  - Más formas de cabeza, pelo, cejas, ojos, narices, vello facial, edades y accesorios.
  - Un `look` diseñado a mano para cada NPC con nombre de `npcs.js`, con su brief de 3 rasgos.
  - Revisar con las hojas de contactos, siluetas y grises y la métrica de IoU antes de publicar.
  - Mantener los parámetros de `look` que ya existen (compatibilidad) y añadir los nuevos.

- **2026-10-05 · Arte pixelado de la mejor calidad posible, con animaciones e iconos.** Repartirlo en varias madrugadas, sin dejar de avanzar la historia, siguiendo `docs/ARTE.md` (o la skill `pixel-art`) y con revisión por imágenes en cada paso:
  1. **Noche 1:** retratos (punto anterior), con parpadeo y boca al hablar.
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

## Hecho a petición de Mario

- 2026-10-05: ver los datos de un Pokémon desde el menú de cambio en combate; estilo de combate «Cambio» (preguntar si quieres cambiar cuando cae un Pokémon rival, se puede poner en «Fijo» en Ajustes); descripciones de habilidades en español; pantalla para comparar movimientos al aprender uno nuevo (tipo, categoría, potencia, precisión, PP, descripción y si es del mismo tipo); diario de misiones con pestañas Activas / Nuevas / Hechas / Rotom, agrupadas por tipo y con 📍 dónde avanzar o empezar cada una.
