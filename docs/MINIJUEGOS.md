# Minijuegos para conseguir objetos

Pedido de Mario (2026-10-10): «Las diferentes mecánicas para obtener objetos: incluye más. Me gustó lo de deslizar la piedra para los fósiles». Además del puzle de rejilla (`puzzle`, `docs/CONTENIDO.md` §7.1) hay cinco minijuegos táctiles. Cada uno pide una destreza distinta, para que no se sientan el mismo juego con otro dibujo.

| `type` | Nombre | Destreza | Cómo se juega | Dónde pega | `theme` |
|---|---|---|---|---|---|
| `dig` | Excavación | Planificar | Pared de 8×8 con capas. Pico (fino, gasta poco) y martillo (ancho, gasta más). Hay que destapar los objetos **enteros** antes de que la pared se quede sin aguante. Los destellos del principio marcan dónde hay algo. | Canteras, cuevas, vetas, bloques de roca, hielo | `cueva` · `cantera` · `hielo` · `ruina` |
| `fish` | Pesca | Pulso y tiempo | Lanzar, esperar el «!» (tocar antes lo espanta; 3 intentos) y recoger manteniendo pulsado para que la aguja se quede en la zona verde. Puede picar un Pokémon salvaje (`wild`). | Lagos, muelles, ríos, charcas de cueva | `lago` · `mar` · `rio` · `cueva` |
| `catch` | Cosecha | Puntería | Deslizar sobre la copa para sacudir el árbol (3 tandas) y arrastrar la cesta. Las doradas valen por tres; piñas y bayas pochas restan. | Árboles de bayas, Bonguris, huertos | `bosque` · `huerto` · `otono` · `nieve` |
| `aura` | Rastreo | Deducción | Tablero de 7×8. Cada pulso dice lo cerca que está lo más próximo: frío, tibio, caliente o «¡aquí al lado!» (y entonces su silueta brilla). Pulsos limitados. | Lucario/Riolu rastreando en ruinas, bosques y cuevas; con `theme: 'buscaobjetos'`, el Buscaobjetos | `ruina` · `playa` · `campo` · `cueva` · `buscaobjetos` |
| `lock` | Cerradura | Memoria | Runas que se encienden en orden; hay que repetir la secuencia, que crece una runa por cerrojo. Dos fallos de margen y «Ver otra vez» gratis. | Cofres, arcones, vitrinas, taquillas, puertas | `cofre` · `ruina` · `caja` |

Archivos: lógica pura en `app/js/minijuegos.js` (sin DOM: la usan el juego, el bot, el validador y las pruebas); interfaz en `app/js/ui/minijuegos.js` (marco común y resumen del botín) y `app/js/ui/mj-*.js` (un archivo por juego; el arte, en `mj-arte.js`); estilos en `app/css/minijuegos.css`.

**El rastreo (`aura`) es de Riolu/Lucario:** el motor no lo comprueba. Pon en el spot `cond: '(inParty("lucario") || inParty("riolu"))'` y un segundo spot con la condición contraria que diga que ahí hay algo y que hace falta él (mira `p8_sin_aura` en `app/content/b04/t7-minijuegos.js`).

---

## 1. En un guion: `{ minigame }`

```js
{ minigame: {
    type: 'dig',                    // dig | fish | catch | aura | lock
    id: 'p8_bloque_lazare',         // recomendado: récord, racha y ayuda adaptativa propios en G.minis[id]
    title: 'El bloque 14',          // título de la pantalla (admite {jugador}, {riolu}…). Por defecto, el nombre del juego
    hint: 'Hay algo redondo…',      // primera línea de ayuda (≤ 140 caracteres; admite marcadores). Por defecto, la del juego
    theme: 'cantera',               // ver la tabla. Por defecto, el primero de cada juego
    level: 3,                       // 1–5 (por defecto 2). Ver §3
    guaranteed: ['skullfossil'],    // premios seguros: se entregan SIEMPRE que se gana (y solo si se gana)
    loot: [                         // tabla de la que se tiran `picks` premios más
      { id: 'hardstone', w: 6 },                  // w: peso (por defecto 1)
      { id: 'stardust', w: 6, n: [1, 2] },        // n: cantidad fija o [mín, máx]
      { id: 'sunstone', w: 1, rare: true },       // rare: solo se gana jugando bien (ver §2)
      { id: 'rarebone', w: 4, cond: 'badges >= 4' },
    ],
    picks: 2,                       // tiradas de `loot` (por defecto: dig 3, fish 1, catch 3, aura 3, lock 2). 0 = solo los guaranteed
    consolation: 'hardstone',       // lo que te llevas si pierdes: 'id' o { id, n }. Por defecto, una unidad de la primera
                                    //   entrada normal que haya salido. `false` lo quita
    lootTitle: 'Dentro del bloque', // título del resumen del botín (por defecto «¡Botín!»)
    wild: [{ sp: 'magikarp', lv: [24, 30], w: 6 }],   // SOLO fish: lo que puede picar en vez de un objeto
    wildChance: 0.3,                // SOLO fish: probabilidad de que pique un salvaje (por defecto, según los pesos)
    seed: 7,                        // opcional: fija el tablero (para pruebas; normalmente no se pone)
  },
  onWin: [ … ],     // tras entregar el botín (y tras el combate, si picó un salvaje)
  onLose: [ … ],    // la pared se vino abajo, se escapó el pez, la cerradura se trabó… Ya se dio la consolación
  onQuit: [ … ],    // el jugador pulsó «Salir» y confirmó. No se da nada
}
```

Qué hace el motor (`app/js/guion.js`), siguiendo el patrón de `puzzle`:

1. Prepara la partida (`prepare`): nivel, ayuda adaptativa, tablero y **carga** (los `guaranteed` más `picks` tiradas de `loot`).
2. La juega la interfaz (`UI.minigame`). **Sin interfaz (herramientas) cuenta como ganado** con nota media.
3. Guarda el resultado en `ctx.lastMinigame` y el récord en `G.minis[id]` (`n` veces, `w` victorias, `best` mejor nota, `ls` derrotas seguidas). Salir no cuenta.
4. **Entrega el botín él solo** y lo enseña en el resumen (`showLoot`; sin interfaz, por texto). No hace falta ningún `give`.
5. Pesca: si lo que picó era un Pokémon salvaje, hay combate (se puede huir y perder no corta el guion; no cuenta como «único»).
6. Corre `onWin`, `onLose` u `onQuit`.

**Reintentos.** Perder y salir nunca castigan: activa la flag de «hecho» **solo en `onWin`** y deja el spot con `talk: [{ cond: '!flag.x_hecho', script: 'x' }, { script: 'x_despues' }]`. Pon una flag de «visto» para acortar la presentación la segunda vez. El validador avisa si un minijuego no tiene `id`.

**Ganar** es: `dig` y `aura`, sacar todos los `guaranteed` y al menos una cosa; `fish`, sacarlo del agua; `catch`, llenar la cesta lo bastante (más exigente con el nivel); `lock`, abrir todos los cerrojos.

## 2. Reglas de botín

- `guaranteed` es **el** premio (la Megapiedra, el fósil, la MT, la carta): ganar lo da siempre. En `dig` y `aura` está en el tablero y hay que sacarlo.
- Las entradas normales de `loot` acompañan. En `dig` y `aura` te llevas las que saques; en `fish`, `catch` y `lock`, más cuantas mejor nota.
- Las entradas `rare: true` solo se ganan **jugando bien**: en `dig` van más hondas, y en `fish`, `catch` y `lock` piden una nota de 0,7 o más. Úsalas para lo que brilla.
- **Perder da la consolación** (una unidad de algo corriente) como mucho una vez cada 20 h por minijuego, para que perder aposta no sea un negocio. **Salir no da nada.**
- Solo objetos que existan (`app/data/items.json` o `items` de un bloque). El validador lo comprueba, igual que las especies de `wild`.
- No dibujes objetos: en el tablero, cada objeto toma su forma del id (piedras, fósiles, pepitas, perlas, fragmentos, escamas, estrellas; lo demás, una cápsula).

## 3. Niveles

| `level` | Para qué | Gana un jugador normal\* |
|---|---|---|
| 1 | Primer contacto, puntos de paso | casi siempre (≥ 95 %) |
| 2 | **Puntos diarios** (por defecto) | ≥ 95 % |
| 3 | Puntos diarios con buen botín; premios de historia | ≥ 90 % |
| 4 | Retos opcionales con premio gordo | 85–97 % |
| 5 | Solo si la historia lo pide y hay reintento | 65–90 % |

\* `winRate` con el jugador automático «normal» (`NORMAL_SKILL` = 0,65) y un `guaranteed`; los números exactos salen en `node herramientas/test/minijuegos-test.mjs`. Son una estimación: el jugador automático no es una persona. Por eso hay **ayuda adaptativa**: tras dos derrotas seguidas en el mismo minijuego (`id`), la siguiente partida baja 0,75 de nivel, y tras cuatro, 1,5.

Lo que cambia con el nivel: `dig`, menos aguante y roca más gruesa; `fish`, zona verde más estrecha, tirones y amagos; `catch`, cae más deprisa, más cosas malas y hace falta más nota; `aura`, menos pulsos; `lock`, secuencias más largas (de 4 a 7) y 6 runas en vez de 4 desde el nivel 3.

## 4. En un punto de recolección: `gather.game`

```js
gather: {
  p8_cantera: {
    name: 'Frente viejo de la cantera', icon: '⛏️', hours: 20, picks: [1, 2],
    game: { type: 'dig', level: 2, theme: 'cantera' },   // o solo game: 'dig'
    ask: 'El frente viejo de la cantera: una pared de roca a rayas…',   // lo que se lee al elegir (si falta, usa `text`)
    text: 'La pared de la cantera suelta lo suyo.',                     // encabeza el resultado
    wait: 'Hoy la pared ya dio lo que tenía…',
    table: [ { id: 'hardstone', w: 14 }, { id: 'stardust', w: 16, n: [1, 2] }, /* … */
             { id: 'moonstone', w: 3, rare: true }, { id: 'nugget', w: 2, rare: true } ],
  },
}
```

`game` admite `type`, `level` (por defecto 2), `theme`, `title` (por defecto, el `name` del punto), `hint` y, en la pesca, `wild` y `wildChance` (por defecto 0,35).

Al recoger, el jugador elige:

- **«Excavar / Pescar / Cosechar / Rastrear / Abrir (puede salir más)»**: se tiran las tandas de siempre (la **base**) y otras tantas **extra**, estas con acceso a las entradas `rare`. La base va segura pase lo que pase; lo extra, según cómo juegue. Salir a medias deja exactamente la base.
- **«Recoger rápido»**: lo de siempre, sin minijuego, sin extra y **sin las `rare`**. Para que no sea una obligación diaria.
- **«Ahora no»**: no gasta el punto.

Jugando nunca se saca menos que recogiendo rápido. La **montura** sigue dando una tanda más en vetas y piedras (`rocky`), en las dos vías. El punto se agota igual (`hours`) se juegue o no. El motor activa `flag.rec_<id>` la primera vez: úsala en el `new` del spot.

Las entradas `rare` **sin** `game` salen como cualquier otra (el validador avisa).

## 5. Economía

- Un punto diario bien jugado debe rondar **₽3 000–8 000 de valor de venta**, y de vez en cuando algo que ilusione (una piedra evolutiva, un objeto equipable, una baya de las raras). Lo valioso va en `rare` con peso bajo (≤ 10 % del peso total entre todas las `rare` caras).
- `picks: [1, 2]` en puntos de objetos sueltos y `[2, 3]` en bayas y Bonguris. Jugar, como mucho, lo duplica.
- Nada que rompa la curva: **Caramelo Raro** solo como `rare` de peso 1; nada de Master Ball, Cápsula Habilidad ni Chapas Doradas en puntos diarios. Megapiedras, fósiles nuevos y MT, solo en minijuegos de guion, una vez, con su escena.
- Salvajes de la pesca: especies del lugar y niveles de la zona.
- **Megapiedras:** como mucho dos por tanda de contenido, cada una con su escena, de Pokémon que Mario tenga (mira `secreto/progreso.md`) y sin repetir las ya dadas (`grep -rn "ite'" app/content`).

## 6. Bot, validador y pruebas

- **Validador** (`herramientas/validar.mjs`): cada `minigame` y cada `gather.game` pasan por `checkDef` / `checkGatherGame` (tipo, nivel, tema, objetos y especies existentes, botín no vacío, claves desconocidas). Además juega 40 partidas con el jugador automático: error si un jugador normal gana menos de la mitad o si las `rare` no se consiguen nunca. La línea «Minijuegos: …» resume cuántos hay y su % de victorias.
- **Bot** (`herramientas/recorrido.mjs`): juega los minijuegos de guion con `autoPlay` y, en los puntos con `game`, prueba las dos vías (jugar y recoger rápido). Da error si se entrega algo que no estaba en la carga, si jugando se pierde la base o si recoger rápido da algo `rare`. Los puntos sin `game` los sigue sin tocar.
- **Pruebas** (`node herramientas/test/minijuegos-test.mjs`): cada tipo y nivel termina, es determinista con semilla, el botín sale de la carga, salir y perder no rompen nada, % de victorias dentro de rango, récords, consolación, las dos vías de la recolección y el paso de guion.
- Si cambias la dificultad de un juego, cámbiala en `app/js/minijuegos.js` y vuelve a pasar las pruebas: los rangos de §3 están ahí.

## 7. Interfaz (para quien toque `mj-*.js`)

Todo con *pointer events* (nada depende de hover ni de teclado; el teclado es un extra). El marco lleva `data-noswipe` y `touch-action: none`. «Salir» siempre pide confirmación y dice lo que pasa. La ayuda «?» pausa el juego. Respeta «reducir movimiento». Colores de interfaz con `var(--ink)`, `var(--ink-2)`, `var(--ink-3)` y `var(--line)`; los colores fijos son solo del arte pixelado de cada escena. Con `window.__mjTest = {}` antes de abrir un minijuego, `window.__mjTest.cur = { P, S }` deja ver el estado desde Playwright.
