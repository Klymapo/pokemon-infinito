# Publicación 7 · profundidad a partir de las notas de Mario (2026-10-10)

> Mario terminó el B3 y mandó una lista larga de notas (ver `secreto/progreso.md`, «2026-10-10»). Esta publicación **no** añade bloque: arregla interfaz y motor, y añade contenido en zonas que ya pisó (Kalos B1–B2, Johto B2–B3) y un poco en Kanto (B4, que aún no juega).

## Motor nuevo (ya hecho; el contenido lo usa)

| Cosa | Dónde está el formato |
|---|---|
| **Negocios** (`ventures`): administración de recursos en tiempo real | `docs/CONTENIDO.md` §13 · `app/js/negocios.js` |
| **Premio del instructor** (`training.prize`) | CONTENIDO §3.1 |
| `{ read: 'obj' }` hoja de papel para cartas · `{ venture: 'id' }` | CONTENIDO §7 |
| Condiciones `partner('id')`, `works('especie')` | CONTENIDO §9 |
| Tiendas: pestañas «Piedras» y «MT» automáticas según lo que vendan | — |

## Piezas de contenido

| Pieza | Archivo nuevo | Qué |
|---|---|---|
| **A · Tiendas y premios** | `app/content/b04/t5-tiendas-premios.js` (+ añadir `prize` a los 11 spots de entrenamiento que ya existen) | Tienda de **piedras evolutivas** y tienda de **MT** en sitios que Mario ya pisó (y versión de Kanto); MT nuevas como objetos; **premios temáticos** en las 11 zonas de entrenamiento; más **Megas y Teras a la vista** sin romper la curva |
| **B · Negocios y rancho** | `app/content/b04/t6-negocios.js` | **Rancho Prado** como negocio (financiarlo si se lo quedó Adela; más parte si es del jugador), **alguien que lo merezca** como encargado, sitio para que Faro/Copito se queden a vivir allí; **dos negocios más** con personajes queridos de zonas ya visitadas |

## Reglas nuevas que salen de las notas (van a `CLAUDE.md` §2.4)

- Nunca regalar una especie o línea que ya se regaló o que el jugador ya tiene (`owns()`): otro regalo, o que el Pokémon se quede en el sitio y se le pueda visitar.
- Toda zona de entrenamiento nueva lleva `prize`.
- Cada bloque añade o amplía un negocio.
- Cada bloque enseña al menos dos Megas ajenas y una Tera salvaje o de entrenador (dentro de las reglas de `balance.md` §4.8).
