# REGISTRO DE CONTINUIDAD (manual)

> Qué está publicado, qué decisiones puede haber tomado el jugador y qué debe recoger lo siguiente.
> El registro automático (apariciones, flags, nombres de entrenadores) está en `registro-auto.md`: regenéralo con `node herramientas/registro.mjs`.
> **Añade una sección por cada publicación.**

---

## Publicación 1 · 2026-10-05 · Bloque 1 "Acto I · Fisuras" (Kalos: Luminalia → Yantra)

### Estado del mundo al terminar el B1 (`flag.b01_fin`)

- **El jugador:**
  - Tiene 3 medallas: `medalla_roca`, `medalla_encanto` y `medalla_lucha`.
  - Tiene Megaevolución: `mec_mega`, objetos `megaring` y `lucarionite`.
  - Lucario seguro (`forceEvolve` en la Torre si no había evolucionado).
  - Montura Rhyhorn (`flag.mount_rhyhorn`).
- **Diario de Rotom:** instalado tras la medalla 1 (`flag.b01_diario`).
- **La Puerta Lemnis de Luminalia** se encendió sola. Sera anunció la **Primera Gira Interregional**: los novatos con 3 medallas viajan a **Johto**. El jugador está en la lista. El B2 empieza ahí.
- **Tope suave** al final: `vars.cap = 35`.

### Decisiones del jugador que el B2 DEBE leer

| Decisión | Flags | Qué cambia |
|---|---|---|
| Prensa en el prólogo | `b01_prensa_verdad` / `b01_prensa_neutral` / `b01_prensa_lemnis` | Tono de Alexia, Rouxel y Sera |
| Lechonk en la Ruta 4 | `b01_lechonk_lemnis` (se lo llevaron) / `b01_agente_vencido` (te plantaste) | Handsome sabe que el Lechonk no llegó a Paldea |
| Fennekin | `b01_fennekin_unido` / `b01_fennekin_libre` / `b01_fennekin_rhi` | — |
| Rhi | `b01_rhi_vencida_1`, `b01_rhi_2_hecho`, `af.rhi` | — |
| Mareep de la jaula | `b01_mareep_lemnis` (se quedó con Lemnis) / `b01_mareep_jaula`, `b01_mareep_forzado`, `b01_mareep_noche` | Aurelio con 5 o 6 Mareep |
| **Bastien** (Cueva Brillante) | `b01_bastien_cubierto` / `b01_bastien_rompe` / `b01_bastien_silencio` | **El B2 debe mostrar la consecuencia** (ver `biblia.md`) |
| **Crómlech** | `b01_delatar` / `b01_handsome` / `b01_trato_sera` | Gran decisión. Si `b01_trato_sera`: el jugador tiene `holomisorsera` y Sera le llamará con un "encargo" |
| Lila | `b01_lila_llama` (encendió la llama), `af.lila` | — |
| Afinidades | `af.lila`, `af.rhi`, `af.sera`, `af.renata`, `af.irene` | — |
| Reputaciones | `rep.lemnis`, `rep.policia`, `rep.kalos` | — |

### Pistas del Eco de Ansel ya plantadas (no repetirlas; escalar)

1. **Primera entrada del Diario** (Lemnis): describe la corbata azul "de siempre" y la frase de Ansel, aunque Rotom estaba en recepción.
2. **Ruta 5:** el Diario omite la marca de ganadero y la jaula. Presenta el enfado de Riolu como "tenía hambre".
3. **Cueva Brillante:** omite el logo de Lemnis, a Melia y la decisión.
4. **Crómlech:** omite la máquina, a Xero, el combate y el trato ("vimos a la señorita Lemnis, muy educada").
5. **Final:** "El doctor Moreau **dice** que es el futuro", en presente.
6. **Pista de mundo:** Lemnis siempre aparece donde el jugador acaba de estar (técnicos en la boca de la Gruta Tierraunida; Lazare: "preguntaron por un entrenador con un Riolu").

**Siguiente según el calendario (B2):** una entrada que **omite por completo** un encuentro importante con Handsome (el día "sin novedades").

### Otras pistas plantadas (arco largo)

- La pantalla de la excavación dice **"NODO 01 · KALOS"**: es la red de nodos.
- "Coeficiente de transferencia 12 %", "energía negativa, tira hacia dentro" y el aura de Riolu que parpadea junto a la máquina: el **drenaje vital**.
- Petroglifos de un rey gigante con una flor y una máquina-flor: A.Z. (Galería Honda, Ruta 6, retrato del Conde).
- La tela de Lila: "hilo azul y plata, un lazo que nunca se acaba". Lleva al Acto VI.
- Xero: "Dale recuerdos a… a nadie" (Matière). Rotom: el traje de Xero, "datos restringidos" (Esprit).
- Rotom: la orden contra Melia está "archivada". Pista del topo (Lebrun, Acto III).
- Brock comenta que le ofrecieron un gimnasio en Teselia (Acto V).
- Cornelio: "El vínculo es enorme, pero no es infinito".

### Personajes pendientes de aparecer

- **Lebrun:** no apareció en el B1. Debe salir al inicio del B2 (cameo con Handsome) para empezar su arco de topo.
- Por la regla de las 3 apariciones, todos los NPCs con nombre del B1 deben volver en bloques futuros. Ver `registro-auto.md`.

### Notas de balance de la publicación 1

- Auditoría final (12 semillas de día + 12 de noche): 24/24 llegan al final. Antes de los ajustes, 11 de 14.
  - Los muros son Brock (con un equipo flojo), Blanca (Miltank) y Corelia (Hawlucha).
  - Ajustes ya aplicados: Ruta 4 más suave al principio; tope tras la medalla 1 de 22 a 24; Miltank de 24 a 23 con una sola Superpoción; Hawlucha de Corelia sin Danza Espada y con una Superpoción.
- **Si Mario se queja de dificultad,** el primer sitio a revisar es Corelia.
