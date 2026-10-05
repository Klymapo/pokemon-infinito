---
name: pixel-art
description: Dibujar pixel art por código (retratos procedurales, sprites, iconos y escenas) con siluetas y caras que se distinguen de un vistazo. Úsala siempre que vayas a crear o mejorar arte pixelado, sobre todo los retratos de NPCs de Pokémon Infinite.
---

# Pixel art por código: siluetas legibles y caras distintas

Esta guía sirve para arte pixelado generado por código (canvas, rejillas, SVG o PNG), sin herramientas de dibujo. La meta es **legibilidad**: que cada personaje se reconozca por su silueta, y que dos caras nunca se confundan.

## 0. Límites

- Solo arte **original**. No reproduzcas personajes, Pokémon, logos ni carátulas existentes, ni siquiera "con otro estilo". En Pokémon Infinite, los entrenadores canon usan sus sprites oficiales en tiempo de ejecución; el arte procedural es para personajes originales, escenas e iconos.
- Si un diseño empieza a parecerse a un personaje conocido, cambia la silueta y la paleta hasta que deje de parecerse.

## 1. El método: brief → silueta → valores → color → detalle → revisión

Nunca empieces por los detalles. En este orden:

1. **Brief del personaje.** Escribe 3 rasgos que lo definan visualmente y que salgan de su personalidad. Por ejemplo:
   - Inspectora meticulosa: moño tirante, gafas cuadradas, cuello alto.
   - Cocinero nómada: pañuelo en la cabeza, barba corta, hombros anchos.

   Si no puedes nombrar 3 rasgos, el personaje saldrá genérico.
2. **Silueta.** Rellena todo de negro. ¿Se reconoce? La silueta la deciden:
   - El **pelo** y el sombrero: es lo que más diferencia.
   - La forma de la **cabeza**.
   - La anchura de los **hombros** y el **cuello** de la ropa.
   - Los **accesorios** que sobresalen: plumas, antenas de pelo, capucha, bufanda, coleta, orejas de gorro.
3. **Valores** (claro/oscuro). En escala de grises debe haber 3 o 4 niveles bien separados:
   - Pelo frente a piel frente a ropa frente a fondo.
   - Si pelo y piel tienen el mismo valor, la cara se pierde.
4. **Color.** Paleta limitada: 12 a 16 colores por retrato.
   - **Desplaza el tono:** las sombras van hacia el azul o el violeta y con más saturación; las luces van hacia el amarillo o el naranja.
   - Nunca sombrees solo oscureciendo el mismo tono: queda sucio.
5. **Detalle de la cara** (§3).
6. **Revisión con imágenes** (§6). Obligatoria. Mínimo dos rondas.

## 2. Siluetas: catálogo de variación

Combina un elemento de cada fila. Dos personajes no pueden compartir más de dos filas iguales.

| Eje | Opciones |
|---|---|
| Cabeza | redonda, oval alargada, cuadrada (mandíbula marcada), corazón (barbilla fina), ancha y baja |
| Pelo | rapado, corto peinado, de punta, rizos/afro, melena lisa, bob, coleta alta, coleta baja, trenzas, moño, raya al lado con mechón, flequillo recto, calvo con laterales, rastas, mohicano |
| Encima de la cabeza | nada, gorra, sombrero de ala, boina, gorro de lana, pañuelo, diadema, capucha, casco, flor, orejas de animal (disfraz) |
| Cuello/hombros | estrechos, normales, anchos; cuello alto, camisa con cuello, sudadera, chaqueta con solapas, armadura, bata de laboratorio, bufanda, capa |
| Rasgo único | gafas, parche, cicatriz, pecas, lunar, barba, bigote, pendientes, maquillaje, tirita, mechón de color, auriculares |

**Regla de oro:** cada personaje importante tiene **un rasgo que sale del contorno de la cabeza** (pelo, sombrero o accesorio). Es lo que se reconoce a 32 px.

## 3. Caras a 32×32 o 48×48

A este tamaño, cada píxel de la cara es una decisión.

- **Las cejas son la herramienta más barata para dar carácter.** Con una línea de 1 píxel:

  | Cejas | Expresan |
  |---|---|
  | Rectas | Seriedad |
  | En pico hacia dentro | Enfado o determinación |
  | Altas y curvas | Sorpresa o amabilidad |
  | Gruesas de 2 px | Fuerza |
  | Caídas hacia fuera | Tristeza o cansancio |
  | Una más alta que la otra | Escepticismo |

- **Ojos:**
  - Catálogo: grandes con brillo, almendrados, finos (1 px de alto), caídos, afilados con rabillo, cerrados felices (∩), con ojeras, con pestañas (1 px extra arriba y fuera), heterocromía.
  - Separación: ojos juntos se leen intensos; separados, ingenuos.
  - Altura: más bajos dentro de la cara se lee más joven.
- **Nariz:** ninguna (chibi); 1 píxel de sombra; 2 píxeles en L (adulto); gancho de 3 píxeles (personaje mayor o con carácter).
- **Boca:** línea recta, sonrisa de 4 px, sonrisa ladeada (asimétrica), mueca, boca abierta, dientes, labios pintados de 2 tonos.
- **Edad:**
  - Niño: cabeza más grande, ojos bajos y grandes, sin nariz.
  - Adulto: mandíbula definida, nariz de 1 o 2 píxeles.
  - Mayor: canas, arrugas de 1 px bajo los ojos y en las comisuras, cejas más gruesas o más claras.
- **Vello facial:** barba de tres días con tramado (dithering) de piel y pelo; bigote de 4 a 6 px; barba completa que cambia la silueta de la barbilla.
- **Asimetría:** dibuja en espejo y después rompe la simetría en el pelo (raya, mechón) o en un rasgo (cicatriz, ceja). Las caras perfectamente simétricas parecen máscaras.

## 4. Limpieza del píxel

- **Contorno:** 1 px, con un tono oscuro del color de cada zona (*selout*), no negro puro. El contorno exterior es más oscuro que las líneas interiores.
- **Curvas:** los escalones deben progresar con regularidad (1-1-2-2-3 o 3-2-1). Evita escalones irregulares como 1-3-1 (*jaggies*).
- **Píxeles huérfanos:** ninguno, salvo que sean un brillo o un detalle intencionado.
- **Luz:** una sola fuente, arriba a la izquierda.
  - Evita el "sombreado almohada" (oscurecer todos los bordes por igual).
  - Sombra bajo el flequillo, bajo la barbilla y bajo la nariz.
- **Tramado:** con moderación, solo para transiciones grandes (barba, tela áspera, niebla).
- **Antialias manual:** solo en curvas grandes y hacia el fondo conocido. Nunca en retratos pequeños sobre fondos variables.

## 5. Implementación procedural

- **Plantillas ASCII en lugar de elipses matemáticas.** Las elipses rasterizadas salen con escalones feos. Define cada pieza como una lista de cadenas, una letra por color, y combínalas por capas:

  ```js
  const CABEZA_CORAZON = [
    '....oooooo....',
    '..ossssssso...',
    '.ossssssssso..',
    // …
  ];
  // o = contorno, s = piel, S = sombra de piel, h = pelo…
  ```

  Las plantillas se diseñan a mano píxel a píxel y se pueden reflejar en espejo.
- **Capas, en este orden:**
  1. Pelo de detrás.
  2. Cuerpo.
  3. Cuello.
  4. Cabeza.
  5. Orejas.
  6. Rasgos (ojos, cejas, nariz, boca, marcas).
  7. Pelo de delante.
  8. Accesorios.
  9. Contorno automático: cualquier píxel vacío junto a uno lleno se pinta del tono oscuro de su vecino.
- **Determinismo:** el aspecto sale de `look` (parámetros explícitos) o de una semilla. Los NPCs importantes llevan siempre `look` explícito y diseñado; la semilla es solo para extras.
- **Separa la lógica del dibujo:** una función pura `retratoGrid(look) → matriz de colores` y otra que la pinta en el canvas. Así se pueden generar PNG en Node para revisarlos sin navegador.
- **Paletas con nombre:** piel (6 a 8 tonos, del muy claro al muy oscuro, cada uno con sombra y luz con el tono desplazado), pelo (natural y fantasía) y ropa. Nada de colores sueltos en el código.

## 6. Revisión (obligatoria)

Genera estas hojas y **míralas con la herramienta de lectura de imágenes** antes de dar nada por bueno:

1. **Hoja de contactos:** todos los retratos en rejilla, ampliados ×4 a ×6 sin suavizado, con el nombre debajo.
2. **Hoja de siluetas:** los mismos retratos rellenos de negro sobre blanco. Si dos se confunden, cambia el pelo o el accesorio de uno.
3. **Hoja en grises:** comprueba los 3 o 4 niveles de valor de §1.
4. **Tamaño real (×1 y ×2):** a tamaño de móvil, ¿siguen siendo distintos?
5. **Métrica automática:** calcula el solapamiento (IoU) entre las máscaras de silueta de cada par de personajes. Si un par supera 0,85, cambia uno de los dos.

**Lista de críticas** (respóndela por escrito tras mirar cada ronda):

- [ ] ¿Cada personaje se reconoce solo por la silueta?
- [ ] ¿Puedo describir la personalidad de cada uno con solo mirar la cara?
- [ ] ¿Hay dos caras con los mismos ojos, cejas y boca? Cambia al menos dos de los tres.
- [ ] ¿Se lee la cara (ojos y cejas) a tamaño real?
- [ ] ¿Hay escalones irregulares, píxeles huérfanos o sombreado almohada?
- [ ] ¿Las sombras desplazan el tono, o solo oscurecen?
- [ ] ¿Se parece a algún personaje existente? Si es así, cámbialo.

Itera hasta que la lista salga limpia. **Mínimo dos rondas.** La primera versión nunca es la buena.

## 7. Animación ligera (opcional)

- **Parpadeo:** el mismo retrato con los ojos en línea, durante 120 ms, cada 3 a 6 s al azar.
- **Respiración:** el cuerpo baja 1 px cada 600 ms; la cabeza no se mueve.
- **Al hablar:** alterna 2 bocas (cerrada/abierta) mientras se escribe el texto.
