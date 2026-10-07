# Publicación 6 · Profundidad en Johto y Kanto (madrugada del 2026-10-07)

> **Por qué no hay B5 esta noche:** Mario va por el B2 (`b02_m2`) y están publicados B3 y B4: vamos 3 bloques por delante (CLAUDE.md §2.3). Los eventos de los próximos 60 días (Halloween y Día de Muertos) ya existen; Navidad entra en la ventana a partir del 21 de octubre. Toca **profundidad** (§2.3.4) con los pedidos pendientes de `progreso.md`.

## Qué entra

| # | Pieza | Archivos (nuevos) | Pedido de Mario que cubre |
|---|---|---|---|
| 1 | **Los tres de Primavera**: Chikorita, Cyndaquil y Totodile, cada uno con su escena, con un becario del Prof. Elm | `b02/t5-iniciales.js`, `b03/t5-iniciales.js` | Iniciales de Johto (los tres), puzle en la Torre Quemada |
| 2 | **La luz de Candela**: Ampharosita en el Faro de Olivo, con Amphy y Yasmina | `b03/t6-ampharosita.js` | Megapiedras con historia (la primera, Ampharosita de Candela); puzle de rejilla |
| 3 | **Las cámaras de los paneles** (Ruinas Alfa): tres salas con puzles de rejilla y tres fósiles (Kabuto, Omanyte, Aerodactyl) que se reviven en el Laboratorio de Fósiles; segunda vía para el fósil de Kalos no elegido | `b03/t7-paneles.js` | Puzles en ruinas; colección (fósiles); nada importante perdido para siempre |
| 4 | **La arrepentida**: Lola Arriaga, ex recluta del Team Rocket de hace años. Tres apariciones con pistas; el giro llega en un bloque futuro | `b02/t6-lola.js`, `b03/t8-lola.js`, `b04/t4-lola.js` | Idea de historia de Mario |
| 5 | Pasada de **español para CDMX** en todo el contenido publicado (coger, vosotros/os, vale, chaval, mola, guay…) | archivos existentes | Auditoría de Mario §7 |
| 6 | `rhi_5` (opcional del B4) un nivel más bajo y con Baya Aranja | `b04/t0-azafran.js` | Muro de balance |

## Contratos

- Cada parte nueva se registra en el `index.js` de su bloque (lo hace la sesión principal). Spots en lugares **del mismo bloque** van en `extraSpots`; en lugares de bloques anteriores, en `patches`.
- Las partes nuevas pueden definir sus NPCs en su propia clave `npcs`.
- **Ningún id publicado se toca.** Prefijos nuevos: `b02_ini_*`/`b03_ini_*` (iniciales), `b03_amphita_*` (Ampharosita), `b03_panel_*` (paneles), `lola_*` (Lola).
- Misiones nuevas: `b02_s_iniciales` (side, 3 partes con `parts`), `b03_s_ampharosita` (side), `b03_s_paneles` (side, 3 partes), `b02_t_lola` (thread).
- NPCs nuevos: `elm` (canon, Profesor Elm, por holomisor), `becario_elm` (Ramiro Alcalde, OC), `lola` (Lola Arriaga, OC). Los tres con 3+ apariciones.
- Todas las condiciones de aparición dejan jugar a quien ya pasó la zona (no dependen de flags que solo se activan en el momento) y no rompen partidas en curso.
- Sin objetos clave nuevos que necesiten pixel art propio (el motor no se toca esta noche). Si alguno hace falta, se anota para la sesión de arte.

## Hilos que avanza

Remanentes Rocket (nuevo personaje, Lola) · Ámbar/Petra (si aparece en los paneles) · Rancho/Amphy y Kaori (antídoto en el Faro) · Yasmina (2.ª aparición) · nuevo hilo **La arrepentida** (`b02_t_lola`).

## Lo que sabe la historia y Mario no

Ver la sección «Publicación 6» de `registro.md` (se escribe al terminar).
