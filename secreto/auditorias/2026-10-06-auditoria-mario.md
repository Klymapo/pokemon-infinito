# Auditoría completa pedida por Mario · 2026-10-06 (tarde)

> Pedida por Mario en el chat: «Auditemos el juego: jugabilidad, historia, gráficos, lore accurate, historias creativas, originales, con referencias geek, UX/UI y animaciones». Después añadió: **«Si puedes mejorar el juego con mini historias, puzzles, otras mecánicas de juego, mejor.»**
> A Mario se le entregó una versión sin spoilers. Este archivo es la versión interna para las sesiones de madrugada. **Prioridad alta**: trabájalo junto a los demás pedidos de `progreso.md`.

Auditoría automática del mismo día: **apta** (validador 0 errores). Avisos: `rhi_5` 2,38 derrotas de media (muro), 3 atascos del bot sin clasificar.

## Notas

| Área | Nota |
|---|---|
| Jugabilidad | 7,5 |
| Historia | 7,5 |
| Lore accurate | 8 |
| Historias creativas | 7,5 |
| Historias originales | 7 |
| Referencias geek | 6,5 |
| Gráficos | 6,5 |
| UX/UI | 8 |
| Animaciones | 4,5 |

---

## 1. Jugabilidad

1. **Únicos ligados a medallas** (`unicos.js:75,134,147` usan `badges.length`). B5 tiene pruebas, no medallas → los únicos no volverían. Contador propio `vars.hitos` que suba con medallas, pruebas y `{cap}` de jefes. **Urgente, S.**
2. **Guardado sin copia rotativa** (`state.js:80-95`, `catch → null`). Guardar `slot1-prev` y probarla si falla; recordatorio de respaldo. S.
3. **Dinero infinito en zonas de entrenamiento** (`screens.js:675`, `battle.js:660-665`; bot acaba con ₽105k). 100 % la primera vez al día, 25 % después. S.
4. **No hay en qué gastar a mitad de juego** (máx. MT 10 000). Tienda de combate tras 4-5 medallas: vitaminas, mentas, Cápsula Habilidad, Restos, Banda Focus. M.
5. **Pokémon nuevos de nivel bajo cuestan** (Gastly 10, Lechonk 14 junto a nv37; viene colección completa). ×2–×3 de exp si está ≥10 niveles bajo el tope, o Caramelos Exp. en zonas de entrenamiento. S.
6. **Secundarias agotándose**: B1 4,5 h, B2 0,5 h, B3 0,3 h, B4 0,8 h; B4 principal 15,1 h. Diseñador: avisar si < 3 h de secundarias o > 13 h de principal; `est` obligatorio en hilos. Mario juega de colección/exploración (B1 en 7,5 h, ~15 h en B2): las secundarias pesan más que la principal.
7. `blanca_g2` 1,92 derrotas (umbral 2). `rhi_5` ya pasa de 2: suavizar.
8. **Solo combates individuales** (`ai.js:142` `active[0]`). Dobles y combates con aliado (pedido 05-10). L.
9. **Derrota sin pista**: tras perder contra un entrenador con ficha, Rotom dice la pista de `challenges[*].info`. S.
10. **6,5 salvajes por entrenador** (`world.js:113-117`). Encuentros a la mitad en rutas despejadas (`G.cleared[id]`) o Repelente Máximo tras medalla 4. S.
11. **Zonas de entrenamiento por media del equipo** (`world.js:212-218`) → confuso con equipos mixtos. Usar el nivel más alto −2 o media de los 6 mejores; decir qué Pokémon ya no ganan exp. S.
12. **Segundas oportunidades sin escalar** (`unicos.js:148`). Nivel = máx(original, tope −8). S.
13. Bot: `recorrido.mjs:176` no cubre `wild.mon` («undefined en k_ruta8»); separar atasco del bot / de contenido. S.
14. `SAVE_VERSION` sin migraciones versionadas (`state.js:6,97-111`). Añadir `g.v` y prueba con guardado viejo. S.
15. Falso Tortazo recomendado por Rotom pero inconseguible (`unicos-ui.js:46`). MT en tienda temprana + enlace al Tutor. S.

Interno: atasco del bot en la niebla del Encinar (`b02/t1-encinar.js:125`, `flag.b02_encinar_libre`) justo donde está Mario (`b02_m2:santuario`): confirmar que el `cond` no puede quedar sin cumplir y, si depende de algo opcional, ponerlo en la ficha de `b02_m2`. Vigilar `rhi_4/5`, `atenea_2`, `corelia_g6`.

## 2. Historia

- **Las decisiones se diluyen** a partir del bloque n+2:

  | Flag | B1 | B2 | B3 | B4 |
  |---|---|---|---|---|
  | `b01_prensa_verdad` | 9 | 3 | 0 | 2 |
  | `b01_lechonk_lemnis` | 5 | 2 | 0 | 0 |
  | `b01_fennekin_rhi` | 2 | 3 | 0 | 0 |
  | `b01_lila_llama` | 8 | 2 | 1 | 0 |
  | `b01_delatar` | 11 | 10 | 2 | 1 |
  | `b03_lila_sola` | — | — | 4 | 0 |

  Regla nueva: cada gran decisión abre o cierra **una misión entera** en n+2 (no una frase). Ideas: reportaje-misión de Alexia según `b01_prensa_verdad`; el Lechonk «apagado» en un furgón N-03; Rhi con Delphox en la revancha. Reputación visible por ciudad/facción (`rep.lemnis`).
- **Plantilla fija de bloque** (llegar → gimnasio → guarida → decisión de 3 → despedida) y **ternas autoridad/piedad/pragmático** (`b02/t3-iris.js:1036`, `b03/t2-rancho.js:393`, `b03/t3-caoba.js:737`, `b04/t3-cueva.js:485`). B5: una decisión binaria sin salida buena y una **decisión por omisión** (plazo que vence).
- **8 medallas ya en B4** (`b04/comun.js:5`): segunda escalera competitiva en B5 (ranking de clasificados, temporada).
- Etiqueta de acto: B3 dice «Acto II · Lo que el tiempo se llevó», pero la biblia §5 usa ese título para el Acto III. Corregir. Además, **la pantalla de título enseña el nombre del acto** en la línea de versión: quitarlo (Ajustes).

## 3. Misterio de fondo (spoilers)

- **El Arquitecto está sobreseñalizado en B4**: «bzzt… sincronizando» (`b04/t0-azafran.js:523`), el eco de Sabrina (`:940`), «ahorro de energía» (`b04/t3-cueva.js:412`), la foto desde más arriba (`:611`), el +3 % de Magda, la tarta de hace doce días (`b04/t0-azafran.js:681-690`), el caramelo de menta azul (Ansel `b01/t4-encuentros.js:451`, `b04/t0-azafran.js:621`; Lebrun/Ω `b02/t2-trigal.js:750`, `b04/t2-silph.js:703-707`, `b04/t3-cueva.js:429,456`) y Lucario rechazando el caramelo (`b04/t0-azafran.js:622`). Un fan del whodunit lo resuelve 3 bloques antes.
- **Octavia: 0 apariciones en `app/content`.** Sin sospechoso alternativo no hay whodunit.
- Arreglo B5–B6: 1 pista por bloque como manda la biblia; Octavia en pantalla en Alola con detalles sospechosos; un momento «Ω» ambiguo de Xero; explicar los caramelos dentro del mundo (merchandising de Lemnis) para diluir la pista.

## 4. Historias creativas / misterios

- Todos los casos son opción múltiple con reintento gratis; la pista suele ser «niega lo que nadie le preguntó» o «la tabla no cuadra». Macaron (`b01/t0-luminalia.js:372`) repetido; Renata (`b02/t2-trigal.js:1180`) se resuelve solo al ver el Magneton. **Modelo a seguir:** hoja de procedencia (`b04/t2-silph.js:672`) con detalle visto antes (`b04/t0-azafran.js:547`) y respaldo.
- **Lucario resuelve demasiados clímax** (niebla B2, pared y lago B3, Mewtwo `b04/t3-cueva.js:354`). Alternar con clímax resueltos por deducción, objeto o NPC.
- **Tics de prosa en aumento**: «Pausa» 3→19→31→46; «como quien» 9→26→22→29; «muy bajito» 11 en B4; «Es un dato» (de Kaori) contagiado a Lebrun, Noa y Rotom (`b04/t1-celeste.js:561`, `b03/t1-faro.js:1028`). Máx. 10 «Pausa» por bloque; lista de muletillas por personaje en `personajes.md`.
- El Diario cierra B2, B3 y B4 con la misma frase («Mañana será otro día…»: `t3-iris.js:1319`, `t3-caoba.js:858`, `t3-cueva.js:611`). Variar.

## 5. Historias originales y romance

- Motivo «por mi hija/familia» repetido (Gonzalo `b02/t2-trigal.js:1263`, Lebrun y Camille `b04/t3-cueva.js:454`, Olmedo `b02/t2-trigal.js:1215`, padres de Rhi y Lila). B5: ideología, deuda, chantaje inverso, orgullo.
- **Romance sin recompensa**: afinidad máxima alcanzable Lila 64, Kaori 64, Rhi 56, Irene 44, Renata 37, Sera 25. Solo 5 escenas condicionadas, todas de umbral bajo; ninguna «Cercana» (45+). Líneas por bloque: Sera 40/44/0/20, Irene 24/10/75/0, Lila 55/21/23/7 (teléfono). Solo dos guiones juntan a 2+ candidatas.
  Arreglo: una escena alcanzable a 45 por candidata; escena de grupo (cena de clasificados); que se mencionen entre ellas; más fuentes de afinidad para Renata y Sera.
- Falta un **rival detective estilo Sherlock** que compita en deducción (encaja con la idea de ChatGPT del rival que estudia tus combates).
- Ysolde: «salto de fe» en cada bloque, dos veces en B4 (`b04/t2-silph.js:592`, `b04/t1-celeste.js:1035`), 50 líneas en B4. Bajar.
- **NPCs desaparecidos** (0 líneas en B3 y B4): Héctor, Philippe, Lucien, Nate, Conde, Cornelio, Ciprés, Brock, Blanca, Matière, Remedios, Lazare (Lazare 0 líneas en todo el juego). Ulises solo habla como `viajero`. Escena de reencuentros en Alola.

## 6. Lore accurate

- Unown «solo viven en las Ruinas Alfa» (`b03/t0-ruinas.js:337`): también Ruinas Sosiego y Tanoby. Que Irene lo corrija: momento de personaje.
- Honedge en la manga de Ysolde (0,8 m): que alguien lo comente.
- Sótano de fantasmas de la Torre Radio de Lavanda: una línea que lo enlace con la Casa Almas.
- Rivales: comprobar que los equipos escalan con la región y su momento canon, no solo con la curva.

## 7. Español para CDMX (prioridad 1 de texto)

«coger» ~48 (vulgar en México: `b04/misiones.js:5` «Coge el Tren Magnético», `b04/t1-celeste.js:575`, `b03/t0-ruinas.js:934`…), «os» 367, «vale» 153, ~38 -áis/-éis, «chaval» (`b03/t1-faro.js:232`), «mola» (`b01/t3-yantra.js:1605`), «guay» (`b02/t2-trigal.js:342`). Pasada: coger → tomar/agarrar/subir; os/vosotros → ustedes en narración y NPCs genéricos (se puede dejar en NPCs de Kalos como marca regional); vale → bueno/sale/va. Nombres oficiales de España se mantienen. Solo texto, no ids. Añadir al superfan una alerta de «coger» y «vosotros» fuera de NPCs marcados.

## 8. Referencias geek

- Repetidas o evidentes: Doctor Who («qué año es» ×4 en `b01/t4-encuentros.js`), salto de fe de Assassin's Creed cada bloque, «patrocinadores» de Tobías 30+, «Cool, cool, cool» ×8.
- Gustos «oro» sin usar: *Shangri-La Frontier*, *Dan Da Dan*, *Draw This, Then Die*, *Witch Hat Atelier* (Smeargle), *Portal* (IA pasivo-agresiva: Porygon-Z / sistemas de Silph o Æther), *inFAMOUS*, *Mistborn* (Kahuna de acero), *Red Rising* (castas del Programa de Talentos), *Ender* (Lucien). Solo en B1: *HIMYM*, *BioShock*, *Dr. Stone*.
- Más **referencias estructurales** (una misión con la forma de una obra sin nombrarla) y 1–2 sutiles por tramo, rotando obras.

## 9. Gráficos

1. **Sin red, un Pokémon no descargado es un rectángulo con dos letras** (`art.js:39-56`, `app.css:160`). Silueta pixelada genérica (Ball/huevo con color de tipo y «?»). M.
2. **Rotom tiene retrato humano** (`b01/npcs.js:4`). Usar `monImg('rotom')` en el marco; respaldo: icono de aparato con ojos. S.
3. Gimnasios e interiores pobres (`art.js:299-310`): motivos por tipo, gradas y focos. M.
4. **Todos los objetos con 💊** (`art.js:62`). Ampliar `PX_ITEMS` (`art.js:1064`) con ~12 iconos. M.
5. Rival flotando en combate: plataformas pixeladas por terreno. S.
6. Mapa: etiquetas tapadas («Nodo 03», «Casa de Bill»), mitad vacía. Halo de 3 px, colocación que evite nodos, agua/montes/bosque. M.
7. Emojis en barra inferior y servicios (8 avisos de `ux.py`): set SVG/pixel 16×16. M. (Ya pendiente en `progreso.md`.)
8. Título: «POKÉMON» poco legible sobre la torre; pie con poco contraste. S.
9. Bustos de retratos iguales y casi todos con fondo azul marino (65 pares IoU > 0,85): color de fondo por facción/región y 2–3 anchos de hombros. S.

## 10. UX/UI

1. **PC: Caja 1 marca «80/30»** (`screens.js:1482`, `BOX_MAX = 30`; inserción en `screens.js:988`). Pasar a la siguiente caja si está llena y repartir al cargar. **Bug, S.**
2. Datos del movimiento solo con pulsación larga (`battle-ui.js:271`): mostrar Pot./Prec. o «i». S.
3. Texto de combate avanza solo (650 ms, `battle-ui.js:126`): flecha ▼ y escritura progresiva. S.
4. «Más» con 11+ filas: fila de 4 accesos (Pokédex, Guía de zona, Recolección, Tutor). S.
5. Mapa: lista de destinos conectados con «Ir». M.
6. Sin estado de carga de sprites (tienda, PC): shimmer o silueta tras 1,5 s. S.
7. Actos en la pantalla de título (ver §2). S.
8. `choose` de combate tapa el campo: dentro de `.bpanel`. M.
9. `will-change` fijo (`app.css:615-617`): solo al deslizar. S.

## 11. Animaciones

Hay: parpadeo de golpe, tween de PS, debilitado, captura completa, flash de formas, entrada de entrenador, evolución, cinemáticas, escritura de diálogo, boca/parpadeo de retratos, movimiento reducido en CSS. **Falta:** sonido, vibración, clima, transición de entrada, y `G.settings.anim` no se usa.

1. **Eventos ignorados**: `eff`, `boost`, `mega`, `zpower` (`battle.js:246-262`) sin `case` en `battle-ui.js:144-221`. Sacudida en muy eficaz, burst gris en poco eficaz, flechas y tinte en cambios de stats, aro `conic-gradient` en Mega/Z. M.
2. Golpe flojo: números de PS animados con rAF, sacudida 6 px `steps(4)`, tinte blanco 60 ms. S.
3. **Vibración** (`navigator.vibrate`, con opción) y sonidos WebAudio sin archivos; gritos cacheados de Showdown. M.
4. Transición de entrada al combate (`battle-ui.js:66`): franjas o iris (`csopen`). S.
5. Sacar Pokémon: Ball que se abre y sprite de 0,2 a 1 (`battle-ui.js:151-159`). S.
6. Estados en el sprite (`::after`). M.
7. Clima: leer `-weather` y capa CSS. M.
8. Subida de nivel: barra dorada y «¡Nv. +1!» (`battle-ui.js:198-199`). S.
9. `document.startViewTransition` entre lugares y hojas (`screens.js:244`). S.
10. Ajuste «Animaciones: completas / rápidas / mínimas» que use `G.settings.anim` y acorte los `sleep`. S.

---

## 12. Mini historias, puzles y mecánicas nuevas (pedido de Mario)

Repartir en las noches de **profundidad** y en los bloques nuevos. Cada uno con su `type`, `est` y ficha en el hub. Prioridad a las zonas donde está Mario (B2–B3).

### Puzles (rompen el «elige entre 4 con reintento»)
1. **Expediente con pruebas**: reunir 3 pruebas en lugares distintos (objetos `read`, testimonios, horarios) y presentarlas en el careo. Equivocarse tiene consecuencia, no reintento gratis. Usar como formato estándar de los casos grandes.
2. **Cifrado Unown**: inscripciones en ruinas que se traducen solas a medida que registras formas de Unown en la Pokédex. Encaja con las Ruinas Alfa de B3 y con el arreglo de lore de Irene.
3. **Rejilla táctil 5×5** reutilizable para cuevas: empujar rocas con Fuerza, pista de hielo, interruptores. Un componente de interfaz, muchos puzles.
4. **Puzles de horario**: algo que solo pasa a cierta hora o día (ya hay `time.js`): un NPC que solo está de noche, una marea, una flor que se abre al amanecer.
5. **Puertas de tipo o movimiento**: se abren si tu equipo tiene un tipo o movimiento concreto (Destello, Corte, Psíquico). Recompensa por usar el Tutor y variar el equipo.
6. **Circuitos de Rotom**: minirompecabezas de conectar cables o redirigir energía en laboratorios (Silph, Æther).
7. **Caso que se puede fallar**: misión que «fracasa bien» (idea de ChatGPT): fallar abre otra rama, no la cierra.

### Mini historias (20–60 min, autoconclusivas, NPCs que vuelven)
1. **El Pokémon que no quiere evolucionar** (ChatGPT): cumple requisitos y se niega; razón emocional con su entrenador; evoluciona bloques después.
2. **El pueblo que recuerda distinto** (ChatGPT): testimonios incompatibles; usar el Expediente con pruebas.
3. **Cartas sin entregar**: una cartera perdida con cartas a NPCs de varias regiones; entregarlas reabre a los secundarios desaparecidos (§5).
4. **La Ampharosita de Candela** en el Faro de Olivo (ya pedida): modelo de «Megapiedra con historia».
5. **Los tres iniciales de Johto** con escena propia (ya pedido).
6. **Reencuentros**: una mini historia por cada NPC desaparecido de §5, con algo que cambió fuera de cámara.
7. **Una referencia estructural por mini historia** (ver §8): p. ej., la IA de recepción pasivo-agresiva tipo *Portal*, el NPC que hace speedrun de las pruebas tipo *Shangri-La Frontier*.

### Mecánicas (respetando RPG por texto en el móvil)
1. **Expediciones**: mandar Pokémon de la caja (hay 80+) a buscar objetos durante horas reales sin jugar; vuelven con objetos según tipo y nivel. Perfecto para jugar offline a ratos y da uso a la colección. M.
2. **Combates dobles y con aliado** (pedido 05-10). L.
3. **Cocina/campamento con Gaspar**: recetas con bayas recolectadas que dan ventajas cortas (más exp, más encuentros raros) y suben afinidad si cocinas con una candidata. M.
4. **Rival que estudia tus combates** (ChatGPT): un rival recurrente guarda qué tipos y movimientos usas más y prepara contramedidas. Usar estadísticas reales del guardado. M.
5. **Torre de combate / ranking de temporada** tras las 8 medallas: la segunda escalera competitiva de §2. M.
6. **Pesca con minijuego** de pulsar a tiempo. S.
7. **Álbum de fotos / museo de tu partida** (ChatGPT): fotos en momentos clave y una sala que se llena con tus decisiones y capturas. M.
8. **Reputación visible** por ciudad o facción, que cambia precios, diálogos y misiones. M.
9. **Concursos o Pokéathlon breves** en las regiones que los tienen. M.

## 13. Orden recomendado

> **Actualizado 14:58: Mario eligió «Puzzles y mecánicas» como prioridad.** Este orden manda sobre el de abajo:
>
> **Motor (0:47), varias noches seguidas:**
> 1. Bug PC «80/30» y únicos con `vars.hitos` (rápidos, siguen primero).
> 2. **Componente de rejilla táctil** (`app/js/ui/rejilla.js`): cuadrícula de hasta 7×7 con rocas empujables (Fuerza), hielo que desliza, interruptores, puertas y meta; definida en el contenido como `puzzle: { grid: [...], ... }` desde un guion; con prueba en `herramientas/test/` y soporte en el bot (que resuelva por BFS) y en el validador (que compruebe que tiene solución). Documentarlo en `docs/CONTENIDO.md`.
> 3. **Expediente con pruebas**: pestaña en el Diario con pruebas recogidas (`proof` en guiones) y un paso `accuse`/careo que pide presentar N pruebas; equivocarse tiene consecuencia (flag), no reintento gratis.
> 4. **Expediciones**: mandar hasta 3 Pokémon de la caja a una zona visitada durante 1–8 h reales; vuelven con objetos según tipo, nivel y zona (tabla en contenido). Funciona sin conexión con la hora del móvil; sin trampas por cambiar la hora (si el reloj retrocede, no se cobra).
> 5. **Puertas de tipo/movimiento** y **puzles de horario** como condiciones nuevas del guion (`cond: { teamType: 'electric' }`, `{ teamMove: 'flash' }`, ya existe la hora).
> 6. **Inscripciones Unown**: texto cifrado que se descifra letra a letra según las formas de Unown registradas.
> 7. Después: pesca con minijuego, cocina/campamento, rival que estudia tus combates, combates dobles/con aliado, torre/ranking, álbum/museo, reputación visible, concursos.
>
> **Historia (3:00):** en cuanto exista cada componente, usarlo en zonas que Mario ya pisa (B2–B3) como profundidad: al menos un puzle de rejilla por cueva o ruina importante, un caso con Expediente, una puerta de tipo y una inscripción Unown en las Ruinas Alfa. Cada uno con su mini historia y NPC que vuelva. La pasada de español neutro sigue siendo prioritaria en texto.
>
> Orden original (para lo demás):

**Noche de motor/arte (0:47):**
1. Bug PC «80/30».
2. Únicos con contador propio (`vars.hitos`) antes del B5.
3. Animaciones baratas: eventos `eff`/`boost`, PS animados con sacudida, vibración, transición de entrada, sacar Pokémon.
4. Silueta de respaldo sin red y retrato de Rotom.
5. Economía: recompensas de zonas de entrenamiento, exp para rezagados, MT Falso Tortazo, nivel escalado de segundas oportunidades.
6. Copia `slot1-prev`.
7. Componente de rejilla táctil y Expediente con pruebas (habilitan los puzles).

**Noche de historia (3:00):**
1. Pasada de español neutro (§7).
2. Secundarias y mini historias en B2–B3 (donde está Mario), con al menos un puzle nuevo.
3. Ajustar `rhi_5`.
4. Para B5: pistas del Arquitecto a 1 por bloque, Octavia en pantalla, decisión binaria y por omisión, escenas de afinidad a 45, escena de grupo, reencuentros, misterio sin Lucario como solución, referencias «oro».
