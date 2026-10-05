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

## Hecho a petición de Mario

- 2026-10-05: ver los datos de un Pokémon desde el menú de cambio en combate; estilo de combate «Cambio» (preguntar si quieres cambiar cuando cae un Pokémon rival, se puede poner en «Fijo» en Ajustes); descripciones de habilidades en español; pantalla para comparar movimientos al aprender uno nuevo (tipo, categoría, potencia, precisión, PP, descripción y si es del mismo tipo).
