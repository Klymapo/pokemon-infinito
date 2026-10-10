# Cinemáticas · guía para escribir contenido

Una cinemática es una escena corta a pantalla completa: fondo por capas con paralaje y vida propia (nubes, hojas, polvo, luciérnagas, goteras, olas), cámara, personajes y Pokémon que entran, se mueven y reaccionan, clima, efectos y texto que se escribe letra a letra.

- Motor: `app/js/ui/cine.js`. Estilos: `app/css/cine.css`. Vocabulario (lo que el validador acepta): `app/js/cine-spec.js`.
- Se lanza desde un guion con el comando `{ cutscene: { … } }` (`docs/CONTENIDO.md` §7).
- El jugador toca una vez para completar el texto y otra para avanzar. Si mantiene pulsado, aparece «Saltar escena». El botón del pergamino abre el historial: todos los textos de la cinemática quedan apuntados ahí, también si se salta.
- Con **Animaciones: No** o «reducir movimiento» del sistema, la escena pasa a modo ligero: sin partículas, sin cámara y sin sacudidas; solo fundidos. Nada de lo que escribas puede depender de que una animación se vea.

## 1. La forma mínima (la de siempre)

```js
{ cutscene: { bg: { type: 'cave', crystals: '#7fd6e0' }, start: 'dark', frames: [
	{ text: 'Negro. Tan negro que la rampa parece no tener fondo.' },
	{ item: 'farollana', fx: 'glow', text: 'Sacas el Farol de Lana y lo frotas contra la manga.' },
	{ fx: 'light', clear: true, text: 'La luz baja por la rampa… y la galería aparece entera.' },
] } }
```

Esto ya se ve vivo sin pedir nada más: el fondo respira según su tipo, la cámara deriva despacio y cambia de rumbo en cada frame, el objeto entra con un salto y flota, y el texto se escribe. Todo lo demás de esta guía es opcional y sirve para **contar con imagen lo que el texto dice**.

## 2. La escena

| Campo | Valores | Qué hace |
|---|---|---|
| `bg` | `{ type, … }` | El mismo objeto `bg` que usan los lugares: `route`, `ranch`, `town`, `city`, `plaza`, `forest`, `coast`, `mountain`, `ruins`, `castle`, `palace`, `tower`, `cave`, `gym`, `lab`, `indoor`, `center`, con sus colores (`far`, `ground`, `roofs`, `wall`, `floor`, `crystals`…), `fog`, `dark` y `fissure`. El ambiente sale del tipo: no hay que pedirlo. |
| `start` | `light` (por defecto), `dark`, `iris`, `fade` | Cómo se abre. `dark` empieza a oscuras y se queda así hasta un `fx: 'light'`; quien esté en escena se adivina dentro de un foco tenue. |
| `time` | `manana`, `dia`, `tarde`, `noche` | Hora de la escena. **Ponla siempre que el texto diga la hora** («esa noche», «al amanecer»); si no, se usa la hora real del móvil y puede contradecir al texto. |
| `weather` | `none`, `rain`, `snow`, `leaves`, `petals`, `embers`, `ash`, `fog`, `sparks`, `dust`, `smoke` | Clima de partida. Cualquier frame puede cambiarlo y dura hasta el siguiente cambio. |
| `tint` | un color (`'#c4473a'`) | Tiñe toda la escena (alarma, sueño, recuerdo). Se quita con `tint: 'none'` en un frame. |
| `cam` | ver §4 | Cámara por defecto de los frames que no digan otra. |
| `auto` | `true` o milisegundos | Los frames avanzan solos al terminar el texto. Úsalo solo en secuencias muy cortas; lo normal es que el jugador marque el ritmo. |
| `ambient` | `false` | Apaga la vida del fondo (para una foto fija o un recuerdo congelado). |

## 3. Los frames

Cada frame es un momento. Lo que no cambies se queda como estaba: los actores siguen en escena, el clima sigue, el tinte sigue. Los efectos (`fx`) y los bocadillos (`emote`) duran solo su frame.

| Campo | Qué hace |
|---|---|
| `text` | Narración. Admite `**negrita**`, `*cursiva*`, `{jugador}`, `{riolu}` y los pronombres de siempre. Máximo 260 caracteres; lo cómodo son 80–160. |
| `say` | Id de un NPC: el texto es **su frase**. Sale su nombre y, si está en escena, mueve la boca. No lo pongas en narración. `as` cambia el nombre que se muestra. |
| `big` + `sub` | Rótulo grande centrado (nombre de una ciudad, de un capítulo). Máximo 28 caracteres. Con `hold: 2400` pasa solo. |
| `item` / `npc` / `mon` | Atajo: un único actor en el centro (clave `_c`). Sustituye al que hubiera en el centro. `shiny: true` con `mon`. |
| `clear` | Vacía la escena de actores. |
| `actors` | Lista de actores que entran, cambian o se van (§5). |
| `fx` | Un efecto o una lista (§6). `color` cambia su color. `shake: 1–3` gradúa la sacudida. |
| `on` | Clave del actor sobre el que caen los efectos (por defecto, el último que se nombró en el frame). `on: false`: el efecto es de la escena, no de nadie. |
| `cam`, `camMs` | Cámara de este frame (§4) y cuánto tarda. |
| `weather`, `tint`, `bg` | Cambian el clima, el tinte o el fondo desde este frame (el fondo se funde; con `fx: 'fade'` o `'wipe'`, corta). |
| `hold` | Milisegundos tras los que el frame avanza solo. Para rótulos y golpes de efecto sin texto. |
| `cond` | Condición: el frame solo existe si se cumple (variantes con y sin Lucario, según una decisión…). |

## 4. Cámara

`drift` (por defecto: deriva lenta, distinta en cada frame), `still` (quieta: silencios, tensión), `pan-left`, `pan-right`, `pan-up` (torres, cielo, algo que aparece arriba), `pan-down` (caídas, descensos), `push` (acercarse: un detalle, una cara, un objeto) y `pull` (alejarse: una llegada, un final).

La cámara cuenta dónde mira el jugador. Si el texto dice «al norte, dos torres», `pan-up`. Si dice «silencio», `still`.

## 5. Actores

```js
actors: [
	{ id: 'irene', at: 'right', dim: true },                        // un NPC (retrato procedural o sprite canon)
	{ mon: '{riolu}', key: 'rio', at: 0.36, enter: 'left' },       // el compañero del jugador, tal como esté
	{ mon: 'gyarados', shiny: true, key: 'rojo', size: 'l' },      // un Pokémon
	{ item: 'calcoli', key: 'calco', at: 'center' },               // un objeto
]
```

| Campo | Valores | Notas |
|---|---|---|
| `id` (o `npc`) / `mon` / `item` | id de NPC (`'jugador'` vale), especie, objeto | Solo hace falta la primera vez. `mon: '{riolu}'` es el compañero del jugador: sale como Riolu o Lucario (y variocolor) según su partida. |
| `key` | texto | Nombre del actor dentro de la escena. Si no lo pones, es su id. Ponlo cuando haya dos iguales o para escribir menos. |
| `at` | `left`, `center`, `right` o de `0` a `1` | Dónde está. Si cambia en un frame posterior, camina hasta allí. Nunca se sale de la pantalla. |
| `enter` | `left`, `right`, `up`, `down`, `fade`, `drop`, `pop`, `none` | Cómo entra. Por defecto: los NPC desde su lado, los Pokémon y objetos con `pop`. `none` = ya estaba ahí. |
| `remove` + `exit` | `remove: true`, y `exit` con los mismos valores | Se va de la escena. |
| `do` | `idle`, `bob`, `float`, `hop`, `shake`, `nod`, `bow`, `turn`, `spin`, `step`, `back`, `faint` | Lo que hace en este frame. `step`/`back` lo acercan o alejan; `turn` le da la vuelta; `faint` lo tumba. |
| `emote` | `!`, `?`, `...`, `heart`, `sweat`, `anger`, `note`, `zzz` | Bocadillo de emoción (solo este frame). |
| `size` | `s`, `m`, `l` | Tamaño. Con tres o más Pokémon a la vez, `s`. |
| `dim` | `true` / `false` | En penumbra: está, pero no es el centro. |
| `flip` | `true` | Mira hacia el otro lado. |
| `speak` | `true` | Mueve la boca aunque el frame no tenga `say`. |

Caben **dos retratos** (izquierda y derecha) y un Pokémon u objeto en medio; o hasta cuatro Pokémon pequeños. Más que eso se pisa.

Para tocar a un actor que ya está, basta su clave: `{ key: 'rio', do: 'step', emote: 'anger' }`. El actor del atajo se llama `_c`: `{ key: '_c', size: 'l' }`.

Si el sprite de un Pokémon no carga (sin conexión y sin caché), sale un medallón con sus tipos y su nombre. No hay que hacer nada.

## 6. Efectos (`fx`)

| Grupo | Efectos |
|---|---|
| Luz | `dark` (la escena se apaga), `light` (la luz se abre desde el actor y la oscuridad se va), `glow` (halo sobre el actor; rayos si es un objeto; **aura azul sola si es Riolu o Lucario**), `rays`, `sparkle`, `beam` (columna de luz hacia arriba), `aura`, `ripple` (ondas por el suelo o el agua), `flash` |
| Acción | `shake`, `quake` (temblor sostenido con polvo), `impact` (golpe con estallido), `slash` (corte), `speedlines` (velocidad, caída, tirón), `zoom` |
| Emoción | `heartbeat` (latido con viñeta; `color` la cambia: rojo alarma, azul frío), `silhouette` (contraluz: los actores en negro), `letter` (la caja de texto se vuelve papel: cartas, registros, notas) |
| Actor | `evolve` (el actor cambia de forma con destello: pon la especie nueva en el mismo actor), `rise` (el actor que entra emerge desde abajo), `fall` (cae desde arriba) |
| Transición | `fade`, `wipe` (cortan a negro antes del frame; para cambiar de `bg`), `iris-in`, `iris-out` (cierra en círculo sobre el actor: buen final) |

Se combinan con una lista: `fx: ['shake', 'quake']`, `fx: ['light', 'sparkle']`. Más de tres a la vez es ruido.

## 7. Recetas

**Recibir un objeto clave.** Quien lo da, a la izquierda; el objeto, en el centro; acercarse; al final, brillo.

```js
{ cutscene: { bg: { type: 'ranch' }, start: 'dark', frames: [
	{ actors: [{ id: 'aurelio', at: 'left', enter: 'left' }], on: '_c', cam: 'push', item: 'farollana', text: '…' },
	{ actors: [{ key: 'aurelio', do: 'nod' }], on: '_c', fx: ['flash', 'sparkle'], text: '…' },
	{ on: '_c', cam: 'pull', fx: 'light', text: '…' },
	{ actors: [{ key: 'aurelio', dim: true }], on: '_c', fx: 'glow', text: '…' },
] } }
```

**Llegada a una ciudad o región.** Rótulo que pasa solo, la luz se abre, la cámara se aleja y luego busca lo que el texto señala. Clima del lugar.

```js
{ cutscene: { weather: 'leaves', bg: { type: 'town', … }, start: 'dark', frames: [
	{ big: true, text: 'Ciudad Iris', sub: 'Johto', hold: 2400, cam: 'still' },
	{ cam: 'pull', fx: 'light', text: '…' },
	{ cam: 'pan-up', text: 'Al norte, dos torres…' },
] } }
```

**Giro oscuro.** Cámara quieta, poca cosa en pantalla, y un solo golpe: `heartbeat` en la línea que duele. Si lo que se lee es un documento, `letter`. Termina en `dark`.

```js
{ actors: [{ id: 'handsome', at: 'left', dim: true }], fx: 'letter', cam: 'still', text: '«Salto 23 · Destino programado: Trigal.»' },
{ fx: ['shake', 'letter', 'heartbeat'], text: '«Autorización: código **Ω-0-0-0**. Operador: —.»' },
{ actors: [{ key: 'handsome', remove: true, exit: 'fade' }], cam: 'still', fx: 'dark', text: '…' },
```

**Despedida o pérdida.** `time` de la escena, cámara lenta (`still`, `pull`), nadie hace aspavientos. Una carta va con `letter` frame a frame. Cierra con `iris-out` sobre quien se queda.

**Legendario.** Primero el lugar vacío (`still`); luego aparece con `rise` o `fall`, tamaño `l`, y la escena reacciona (`shake`, `ripple`, `heartbeat`). Se va con `{ key, remove: true, exit: 'up' }` y un `flash`. Nunca lo dejes en pantalla sin que el texto lo haya nombrado o descrito.

```js
{ fx: 'ripple', cam: 'still', text: 'Algo sube desde el fondo…' },
{ shake: 3, actors: [{ mon: 'gyarados', shiny: true, key: 'rojo', at: 'center', size: 'l' }], fx: ['shake', 'rise', 'light'], text: '…' },
```

**Evolución por vínculo.** El Pokémon y su persona en escena; brillo que crece; `evolve` en el frame en que el texto dice que ya es otro; después, la reacción.

```js
{ actors: [{ id: 'lila', at: 'left', dim: true }], on: '_c', mon: 'eevee', text: '…' },
{ color: '#ff9fc4', cam: 'push', fx: 'glow', text: '…' },
{ color: '#ffc4dc', fx: 'evolve', mon: 'sylveon', text: '…' },
{ actors: [{ key: 'lila', dim: false, emote: 'heart' }, { key: '_c', do: 'step' }], text: '…' },
```

**El compañero usa su aura.** `{ mon: '{riolu}', key: 'rio' }` y `fx: 'glow'` (el aura sale sola); si se extiende, añade `ripple`. Si la escena solo ocurre con Lucario en el equipo, ponle la condición al comando o a los frames.

## 8. Cuánto y cuándo

- **De 2 a 4 cinemáticas por bloque**, más las pequeñas de objeto clave (2 o 3 frames). Si todo es cinemática, ninguna pesa.
- Úsalas para: objetos clave, llegadas a ciudad o región, giros, pérdidas, legendarios, evoluciones con historia y el clímax del bloque. No para conversaciones: eso es diálogo normal.
- **De 3 a 6 frames**; 8 como mucho en un clímax. De 20 a 60 segundos leyendo sin prisa.
- Un frame, una idea. Si el texto pasa de 160 caracteres, casi siempre son dos frames.
- En cada frame tiene que **cambiar algo que se vea**: entra alguien, se mueve la cámara, cambia la luz. Dos frames seguidos iguales con distinto texto es justo lo que no queremos.

## 9. Qué no hacer

- No pongas en escena a nadie que el guion no haya puesto ahí. Ni Pokémon de adorno, ni un personaje que «podría estar».
- No enseñes lo que el texto aún esconde: si dice «una figura», no pongas el retrato de quien es. Usa `silhouette`, `dim` o nada.
- No pongas `say` a la narración ni cambies el texto para que «quepa» el efecto: manda el texto.
- No fíes una pista a una animación: en modo ligero no se ve. Lo importante, además, se lee.
- No encadenes `flash` y `shake` en todos los frames. Un golpe por escena; dos en un clímax.
- No uses `mon: 'lucario'` para el compañero: usa `'{riolu}'`, que respeta si aún es Riolu.
- No dibujes Pokémon ni personajes canon a mano, ni subas sprites al repo (`CLAUDE.md` §0.2).

## 10. Comprobar

```bash
node herramientas/validar.mjs            # avisa de claves, efectos, cámaras, climas, acciones y emotes desconocidos, actores inexistentes y frames vacíos
node herramientas/test/cine-test.mjs     # todas las cinemáticas publicadas contra el vocabulario (--lista las enumera)
```

Para verla: sirve `app/` y, en la consola del navegador, `(await import('./js/ui/cine.js')).previewCutscene({ … })` (no apunta nada en el historial). Mírala también con Animaciones: No.
