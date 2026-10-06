# Colaborar con Pokémon Infinite (para ChatGPT y cualquier ayudante)

Mario juega este juego en su móvil y quiere **sorprenderse**. Claude escribe la historia cada madrugada. Tú puedes ayudar con **ideas, personalización e imágenes**. Este documento explica cómo, sin romper nada y sin spoilers.

## 1. Lo que NO debes abrir

- **No abras la carpeta `secreto/`.** Ahí está la historia completa con todos los giros. Todo lo que leas puede acabar en tu conversación con Mario, y él no quiere spoilers.
- Tampoco leas `app/content/` (los guiones del juego) más allá de lo que Mario ya haya jugado.
- No modifiques `main`, `app/` ni `herramientas/`. Claude integra lo que sirva.

## 2. Cómo entregar

1. Trabaja en una **rama nueva** que empiece por `chatgpt/` (por ejemplo, `chatgpt/ideas-octubre`, `chatgpt/retratos-1`).
2. Pon todo dentro de `propuestas/chatgpt/`:
   - **Texto** en Markdown (`.md`): ideas, listas, fichas.
   - **Imágenes** en `propuestas/chatgpt/img/`, en **PNG o WebP**, de 512 px por lado como máximo y menos de 300 KB cada una. Nombre descriptivo en minúsculas y sin espacios (`retrato-petra.png`).
3. Añade o actualiza `propuestas/chatgpt/LEEME.md` con una lista de lo que entregas y para qué sirve cada cosa.
4. Haz el commit y súbela. Claude revisa las ramas `chatgpt/*` cada madrugada, adopta lo que encaje y deja respuesta en `propuestas/RESPUESTAS.md` (sin spoilers).

## 3. Reglas para las imágenes

- **Originales.** Nada copiado ni extraído de juegos, anime o fangames.
- **Sin Pokémon ni personajes canon dibujados** (ni Lucario, ni líderes de gimnasio, ni profesores). El juego carga los sprites oficiales en tiempo de ejecución; no deben estar en el repositorio.
- Sí: personajes **originales** del juego, paisajes, edificios, objetos, iconos, fondos, ilustraciones de pantalla de título y de postales.
- Estilo de referencia: **pixel art cálido**, paleta azul marino, crema, dorado y un toque de «aura» azul. Mira `docs/ARTE.md`.
- Si es pixel art, que sea en cuadrícula limpia (sin antialiasing borroso) y a tamaño múltiplo de 16.

## 4. Reglas para las ideas

- Español, con nombres oficiales de España para lugares, Pokémon, movimientos y objetos.
- Que encajen con lo que es Pokémon de verdad (stats, tipos, hábitats). Nada de Pokémon inventados.
- Las referencias a gustos de Mario deben ser **sutiles**: un guiño, no un nombre propio de otra obra.
- No hace falta que sepas la trama: propón misiones secundarias, personajes, eventos, mecánicas, mejoras de interfaz o de ritmo. Claude decide dónde encajan.

## 5. Tareas abiertas

La lista viva está en `propuestas/TAREAS-CHATGPT.md`.
