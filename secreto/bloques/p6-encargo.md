# Encargo común · Publicación 6 (profundidad)

Repo: `/home/claude/pokemon-infinito`. Lee **antes de escribir**: `CLAUDE.md`, `docs/CONTENIDO.md` (formato exacto; §7.1 puzles), `secreto/biblia.md`, `secreto/personajes.md`, `secreto/registro.md`, `secreto/hilos.md`, `secreto/referencias.md`, `secreto/balance.md`, `secreto/progreso.md` (pedidos de Mario) y `secreto/bloques/p6-profundidad-plan.md`. Luego lee los archivos de contenido publicados de las zonas que tocas, para copiar estilo, ids reales de lugares, flags y voces.

## Reglas

1. **Solo escribes tus archivos nuevos** (los que te asignan). No edites ningún otro archivo de `app/` (otra persona está haciendo una pasada de español en los archivos existentes a la vez; si tocas uno, os pisaréis). Si necesitas un cambio en otro archivo, descríbelo en tu respuesta final.
2. Formato: módulo ES con datos planos, `export default { npcs, locations?, extraSpots, patches, trainers, quests, scripts, challenges, items, gather, events }`. **`extraSpots`** añade spots a lugares del **mismo bloque**; **`patches`** a lugares de bloques **anteriores** (`patches: { locId: { spots: [...] } }` o `route.tramos`). Mira cómo lo hacen `app/content/b03/t*.js`.
3. **Ids nuevos** con el prefijo que te asignan. Nunca reutilices ni renombres ids publicados. Comprueba que tus ids no existen ya (`grep -rn`).
4. **Condiciones:** que el contenido aparezca para quien está en la zona **y** para quien ya la pasó (usa `visited()`, `done.x`, `flag.x` de hitos que siempre se activan, `badges >= N`). No dependas de flags que solo existen en una rama de una decisión, salvo para variar textos. Lee bien qué flags marcan el final de cada misión de la zona (`grep` en los archivos del bloque). Nada debe interrumpir una misión principal a medias: si dudas, condiciona a que la principal de esa zona ya esté hecha.
5. **Español para México/CDMX** en diálogos y narración: nunca «coger» (usa tomar, agarrar, atrapar), nada de «vosotros/os/-áis/-éis» (usa ustedes), nada de «vale», «chaval», «mola», «guay», «tío» como muletilla. Nombres oficiales de Pokémon, objetos y lugares en español de España (Ampharosita, Fósil Domo, Ámbar Viejo, Ruinas Alfa…). Pronombres del jugador con `{o|a|e}`. Cada NPC con voz propia; los canon según su canon.
6. **Combates contra personajes con nombre:** siempre ofrecer curar antes (`heal: true` o elegir ir al Centro). Niveles según `balance.md` y la zona. Movimientos, habilidades y objetos de entrenadores con nombre elegidos a mano y legales (el validador lo comprueba).
7. **Pokémon que se regalan:** nivel por debajo de su nivel de evolución (el Superfan avisa de básicos sobrenivelados). Usa `{ pokemon: { sp, lv, nature, ability, happy, ivs } }`. Capturas únicas con `wild` (ver §7). Los regalos importantes con escena, nunca «toma y ya».
8. **Misiones** con `type`, `est` (minutos), etapas que dicen **qué hacer y dónde** (≤ 240 caracteres, con un lugar o personaje de ancla), final con premio. Las de reunir varias cosas, con `parts` (CONTENIDO §6).
9. **Puzles** (`{ puzzle: {...}, onSolve, onQuit }`): ≤ 8×8, que se puedan repetir si sales (spot con `cond` que siga visible hasta resolverlo). Empieza fácil (6–12 pasos) y sube. El validador comprueba que tienen solución y dice cuántos pasos miden.
10. **Diario de Rotom** (`diary`, con `cond: 'flag.b01_diario'`): voz de Rotom en primera persona, alegre, «¡Bzzt!». Lee `biblia.md` §3.5 y §7: el Diario **nunca miente pero omite**. Como mucho 1 entrada por pieza; no plantes pistas nuevas del calendario (ya están las de B2–B4).
11. **Colección:** al menos un objeto con `read` (carta, nota) en tu pieza. Puntos de recolección (`gather`) si encajan.
12. **Cero spoilers** en textos visibles: fichas de misión, `sub` de spots, descripciones de objetos.
13. **Referencias escondidas** (`referencias.md`): como mucho una evidente por misión.
14. Sin objetos clave nuevos que necesiten pixel art (`PX_ITEMS`): si usas un objeto clave, que sea de lectura (`read`) o reutiliza uno existente.

## Comprobación antes de terminar

```bash
cd /home/claude/pokemon-infinito
node herramientas/validar.mjs        # 0 errores; mira avisos de tus ids
node herramientas/superfan.mjs       # sin ✖ en tus ids
node herramientas/tester.mjs         # sin ✖ en tus ids
node herramientas/disenador.mjs      # mira avisos de tus misiones
node herramientas/recorrido.mjs --semilla 3   # y --semilla 3 --hora 2; que no haya ERRORES nuevos
```

Si otro archivo en construcción de otra persona rompe la validación, ignóralo (no es tuyo) y dilo en tu respuesta.

## Respuesta final (breve)

Ids nuevos (flags, misiones, NPCs, objetos, entrenadores, guiones principales), dónde aparece cada cosa y con qué `cond`, apariciones de cada NPC con nombre, pistas plantadas, decisiones del jugador, y cualquier cambio que necesites en archivos ajenos.
