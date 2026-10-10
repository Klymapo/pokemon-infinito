# Encargo común · Publicación 7 (notas de Mario del 2026-10-10)

Repo: `/home/claude/pokemon-infinito`. Lee **antes de escribir**: `CLAUDE.md`, `docs/CONTENIDO.md` (formato exacto; lo nuevo está en §3.1 «Premio del instructor», §7 `read`/`venture`, §9 y **§13 Negocios**), `secreto/biblia.md`, `secreto/personajes.md`, `secreto/candidatas.md`, `secreto/registro.md`, `secreto/registro-auto.md`, `secreto/hilos.md`, `secreto/referencias.md`, `secreto/balance.md`, `secreto/progreso.md` (las notas de Mario del 2026-10-10, con sus palabras) y `secreto/bloques/p7-plan.md`. Luego lee los archivos de contenido publicados de las zonas que tocas, para copiar estilo, ids reales de lugares, flags y voces.

**Dónde está Mario:** acaba de terminar el B3 (Johto). Conoce Kalos (B1–B2) y Johto (B2–B3). El B4 (Kanto) aún no lo ha jugado. Tiene casi ₽500 000 y unos 30 Pokémon sobre el nivel 50.

## Reglas

1. **Solo escribes tu archivo nuevo** y los cambios en archivos existentes que tu encargo te asigne de forma expresa. Hay otras personas trabajando a la vez en `app/js/` y en otros archivos de contenido: no los toques. **No edites** `app/content/*/index.js` (lo conecta quien coordina), ni `app/sw.js`, ni hagas commits. Si necesitas un cambio en otro archivo, descríbelo en tu respuesta final.
2. Formato: módulo ES con datos planos, `export default { npcs, extraSpots, patches, trainers, quests, scripts, challenges, items, shops, gather, ventures, events }`. Tu archivo va en `app/content/b04/`: **`extraSpots`** añade spots a lugares del **B4**; **`patches`** a lugares de bloques **anteriores** (`patches: { locId: { spots: [...] } }` o `route.tramos`). Mira cómo lo hacen `app/content/b03/t6-ampharosita.js` y `app/content/b04/t4-lola.js`.
3. **Ids nuevos** con el prefijo `p7_` (flags, guiones, misiones, objetos, entrenadores, npcs). Nunca reutilices ni renombres ids publicados. Comprueba que tus ids no existen ya (`grep -rn`).
4. **Condiciones:** que el contenido aparezca para quien está en la zona **y** para quien ya la pasó. No dependas de flags que solo existen en una rama de una decisión, salvo para variar textos o cuando la rama **es** el tema (el rancho). Nada debe interrumpir una misión principal a medias.
5. **Español para México/CDMX** en diálogos y narración: nunca «coger» (usa tomar, agarrar, atrapar), nada de «vosotros/os/-áis/-éis» (usa ustedes), nada de «vale», «chaval», «mola», «guay», «tío» como muletilla. Nombres oficiales de Pokémon, objetos, movimientos y lugares en español de España. Pronombres del jugador con `{o|a|e}`. Cada NPC con voz propia (`personajes.md`); los canon según su canon.
6. **Combates contra personajes con nombre:** siempre ofrecer curar antes. Niveles según `balance.md` y la zona. Movimientos, habilidades y objetos elegidos a mano y legales (el validador lo comprueba).
7. **Nunca regales una especie o línea que el jugador ya tiene o que ya se regaló.** (Queja de Mario: «ahora tengo dos Ampharos del mismo lugar».)
8. **Cartas y notas:** como objeto con `read` y, si se leen en el momento, con `{ read: 'id' }` (hoja de papel). Nunca una carta larga en un `text`.
9. **Diario de Rotom** (`diary`, con `cond: 'flag.b01_diario'`): como mucho 1 entrada por pieza; el Diario nunca miente pero omite (biblia §3.5 y §7); no plantes pistas nuevas del calendario.
10. **Cero spoilers** en textos visibles antes de tiempo: fichas de misión, `sub` de spots, descripciones de objetos, `blurb` y `desc` de negocios y mejoras.
11. **Referencias escondidas** (`referencias.md`): como mucho una evidente por misión o negocio.
12. Sin objetos clave nuevos que necesiten pixel art (`PX_ITEMS`): si usas un objeto clave, que sea de lectura (`read`) o reutiliza uno existente.
13. Ningún personaje con nombre nuevo se queda en una sola aparición: si creas uno, dale 3 momentos (aquí o anotados para después) y dilo en tu respuesta.

## Comprobación antes de terminar

(Durante la escritura, el índice del B4 admitía la variable `P7_EXTRA` para probar piezas sin conectarlas; al publicar se quitó y las piezas quedaron importadas en `app/content/b04/index.js`.)

```bash
node herramientas/validar.mjs && node herramientas/superfan.mjs && node herramientas/tester.mjs && node herramientas/disenador.mjs
```

Si otro archivo en construcción de otra persona rompe la validación, ignóralo (no es tuyo) y dilo en tu respuesta.

## Respuesta final (breve, para quien coordina; Mario no la lee)

Ids nuevos (flags, misiones, NPCs, objetos, entrenadores, guiones principales, tiendas, negocios), dónde aparece cada cosa y con qué `cond`, apariciones de cada NPC con nombre, decisiones del jugador, qué hay que anotar en `registro.md`/`hilos.md`/`referencias.md`/`balance.md`, y cualquier cambio que necesites en archivos ajenos.
