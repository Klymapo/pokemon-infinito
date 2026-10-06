# Pokémon Infinito: documento de diseño

> **Versión:** 0.1, borrador para aprobación · 4 oct 2026
> **Sin spoilers.** Aquí están las reglas y los sistemas del juego. La historia vive aparte, en `secreto/`. Si quieres sorprenderte, no abras esa carpeta.

---

## 1. La idea en una frase

Un RPG de Pokémon para Android que se juega sin internet, con todas las regiones, con la historia escrita por bloques que nunca deja de crecer, y donde tus decisiones, tus amistades y tus enemigos te siguen de región en región.

---

## 2. Plataforma

| Qué | Cómo |
|---|---|
| Dónde se juega | Android, como app instalada desde Chrome ("Agregar a pantalla de inicio") |
| Sin internet | Sí. Todo lo descargado se juega offline |
| Actualizaciones | Automáticas. Cuando tu cel tiene internet, baja el contenido nuevo solito |
| Guardado | En tu teléfono, con autoguardado al cambiar de zona y guardado manual |
| Respaldo | Botón **"Exportar respaldo"** que genera un archivo con tu partida, por si cambias de cel o borras datos |

---

## 3. Cómo se juega (opción A)

**Mapa de región.** Ves la región dibujada y tocas a dónde ir. Solo puedes viajar a lugares conectados o que ya desbloqueaste.

**Pueblos y ciudades.** Cada uno tiene su pantalla con ilustración y descripción, y botones: Centro Pokémon, Tienda, Gimnasio, gente con quien hablar, lugares especiales. Los NPCs cambian lo que dicen según lo que hayas hecho.

**Rutas, cuevas y bosques.** Se recorren por tramos, con una barra de avance tipo *Ruta 3 · tramo 4/10*. En cada tramo puede pasar algo:

- Encuentro salvaje (hierba, agua, cueva, árboles…)
- Entrenador que te reta
- Objeto escondido (algunos solo los ves con cierto Pokémon o montura)
- Evento, NPC o bifurcación

Las rutas que ya terminaste se cruzan rápido con **Atajo**, con la opción de explorar si quieres.

**Combate.** Pantalla de combate Pokémon de toda la vida: sprites, barras de PS, menú de movimientos, mochila, cambiar y huir.

---

## 4. Reglas del combate ("lore accurate")

Los datos salen de la base de datos de Pokémon Showdown, que es la más completa y precisa que existe. Nada de lo siguiente es inventado:

- **Los 1025 Pokémon** con sus stats base, tipos, habilidades (incluidas las ocultas) y movimientos por nivel, MT y tutor.
- **Fórmula de daño real** (Gen 9): STAB, efectividad, críticos, variación aleatoria, físico/especial.
- **IVs, EVs, naturalezas**, objetos equipados, clima, terrenos, estados y cambios de stats.
- **Captura** con la fórmula oficial y todas las Poké Balls.
- **Shiny:** 1/4096, con formas de mejorar la probabilidad.
- **Combates dobles** de vez en cuando, donde la historia lo pida.
- **Evoluciones por intercambio:** como no hay intercambios, las sustituye el **Cordón Unión** (también sirve para las de condiciones raras). La Enfermera Joy regala uno al curar con 2 medallas o más; después se vende en las tiendas. **Cualquier mecánica de evolución nueva tiene que tener una forma de conseguirse dentro del juego.**

### Las cuatro mecánicas

| Mecánica | Cómo se obtiene |
|---|---|
| Megaevolución | Por historia |
| Movimientos Z | Por historia |
| Dinamax/Gigamax | Por historia |
| Teracristalización | Por historia |

- **Una mecánica por combate**, igual que en los juegos.
- Por qué funcionan donde funcionan es parte de la trama. 🤐

### Monturas

Llegan con la historia y sirven para tres cosas:

- **Ir más rápido:** menos tramos en las rutas.
- **Llegar a lugares nuevos:** agua, paredes, cielo…
- **Viajar entre ciudades** que ya visitaste.

---

## 5. Dificultad: difícil, pero justa

| Elemento | Regla |
|---|---|
| Líderes y jefes | Equipos completos con movimientos, objetos y habilidades pensados en conjunto |
| IA | Cambia de Pokémon cuando le conviene, usa objetos de curación (limitados) y aprovecha debilidades |
| Entrenadores normales | Más listos que en los juegos oficiales, sin ser crueles |
| Perder | Como en los juegos: vuelves al último Centro Pokémon y pierdes parte del dinero |
| Nuzlocke | No. Tus Pokémon no se pierden |

### Entrenamiento con tope

Antes de cada líder o reto difícil hay una **zona de entrenamiento**: dojo, entrenadores repetibles o un lugar con Pokémon de buen nivel.

- Si tu equipo está **por debajo** del nivel recomendado, puedes entrenar ahí todo lo que quieras.
- Si ya **llegaste** al nivel, el encargado te cierra el paso: *"Ya estás listo. No te voy a dejar perder el tiempo aquí."*

### Tope suave de experiencia

Si un Pokémon tuyo pasa del nivel recomendado del siguiente reto, gana mucha menos experiencia. Así el juego nunca se vuelve fácil por accidente. *(ver decisión 1)*

---

## 6. Riolu

- **Es tu compañero desde el inicio.** No es un inicial de laboratorio; cómo llega a ti es parte de la historia.
- **El primer tramo está pensado para que brille:** los primeros rivales y líderes le permiten lucirse sin que te sobre o te falte.
- **Evoluciona por amistad,** con eventos especiales entre ustedes dos.
- **Habrá un tipo fuego disponible temprano** por si lo quieres en tu equipo.
- **Habrá variedad de tipos desde el principio,** para que armes un equipo sin repetir tipos.

---

## 7. La historia: cómo está construida

### Tronco y hilos

- **Tronco:** la trama principal, con varias facciones, varias regiones y viajes constantes entre ellas.
- **Hilos:** series de misiones de personajes secundarios que reaparecen en distintos bloques y regiones. Siempre tendrás 2 o 3 hilos largos abiertos, más misiones cortas en cada pueblo.
- **Misiones de recolección y rescate** (tipo "rescata a los Mareep") que dan objetos clave de inventario.

### Decisiones con consecuencias

- **Pocas decisiones grandes,** que cambian cosas de verdad a corto y a largo plazo.
- **Muchas decisiones chicas** que el mundo recuerda: alguien te saluda distinto, una tienda te cierra, alguien aparece a ayudarte… o a cobrártela.
- **Nunca hay una respuesta "correcta".**
- **Reputación con facciones:** ayudar a una puede enemistarte con otra.

### Reglas de oro de los personajes

1. **Ningún personaje con nombre aparece una sola vez.** Mínimo 3 apariciones en distintos bloques, y cada vez cambia algo en él.
2. **Los rivales y villanos entrenan.** Su equipo evoluciona de forma coherente entre una pelea y otra.
3. **Los personajes canon** (líderes, campeones, jefes de organizaciones) tienen motivos propios. No son cameos de adorno.
4. **El mundo se mueve aunque no estés mirando.** Lo que no resuelves avanza sin ti.
5. **Las sorpresas son justas.** Las pistas siempre estuvieron ahí.

### Romance

- **7 candidatas** en distintas regiones, cada una con su propio hilo largo y su propia historia aunque no la elijas.
- **El afecto se gana con hechos,** no eligiendo la frase bonita.
- **Al final eliges a una.** Las demás siguen en la historia, como aliadas o no según cómo terminaron las cosas.
- Tu personaje y las candidatas son **adultos**.

### Referencias escondidas

En las misiones va a haber guiños a tus gustos (anime, libros, series, pelis, juegos, D&D, datos…). Regla: **sutiles**, que las notes si las conoces y que no estorben si no.

---

## 8. Sistemas de información

| Sistema | Qué te dice | Cómo se llena |
|---|---|---|
| 📍 **Guía de zona** | Tipos de Pokémon por ruta y ciudad, rango de niveles, rumores. Los que ya viste salen con nombre; los demás, como silueta | Explorando |
| 🏅 **Ficha de reto** | Líderes y jefes: tipo principal, número de Pokémon, niveles y piezas clave | Guías de gimnasio, entrenadores del gym y NPCs |
| 📁 **Expediente** | Equipo y evolución de rivales, comandantes y villanos | Cada pelea, más la inteligencia que te dan las misiones secundarias |
| 📜 **Diario** | Misiones activas, hilos abiertos y decisiones tomadas | Automático |

---

## 9. Tiempo real

- **Día y noche** según la hora de tu cel. Cambian los Pokémon que aparecen y algunos NPCs y eventos.
- **Estaciones del año,** que afectan algunas rutas.
- **Eventos por fecha:** Día de Muertos, Halloween, Navidad, Año Nuevo, Día de Pokémon (27 feb) y más. *(ver decisión 5: tu cumpleaños)*

---

## 10. Contenido por bloques

| Qué | Cómo |
|---|---|
| Bloque 1 | Lo bastante largo para varios días de juego (meta: 12 a 15 horas) |
| Bloques siguientes | Los escribo cada madrugada y se publican solos |
| Aviso de ritmo | Cuando te quedan unas **3 horas** de contenido publicado, el juego te avisa |
| Continuidad | La historia se escribe en variantes según tus decisiones, y el juego elige la tuya. Para algo muy específico de tu partida, tienes **"Exportar continuación"** para pasármelo |

---

## 11. Arte

| Qué | Cómo |
|---|---|
| Personajes originales (tú, las 7, villanos nuevos, NPCs de hilos) | Pixel art mío, estilo chibi-soft de unas 2 cabezas, con siluetas limpias |
| Mundo (pueblos, rutas, objetos, medallas, íconos, interfaz) | Mío. Interfaz clara y legible |
| Pokémon | Sprites animados del repositorio de PokeAPI que me pasaste. Tu cel los descarga la primera vez que ve cada Pokémon y se quedan guardados para jugar offline. También habrá un botón de "Descargar todos" para usarlo con WiFi |
| Personajes canon (Giovanni, Brock…) | El mismo método, con los sprites públicos de entrenador. Si alguno no existe, retrato con silueta y su emblema |

---

## 12. Producción (cómo trabajo detrás)

```
pokemon-infinito/
├── app/        ← el juego (motor, interfaz, contenido); lo único que se publica
├── secreto/    ← biblia de la historia, hilos y planes (SPOILERS)
├── herramientas/ ← scripts de balance y pruebas automáticas
└── docs/       ← este documento
```

**Cada madrugada** (tarea programada):

1. Leo la biblia y el registro de continuidad.
2. Escribo el siguiente pedazo de historia.
3. Balanceo números y corro simulaciones de combate para verificar la dificultad.
4. Reviso que no se rompa nada con pruebas automáticas.
5. Lo publico. Tu cel lo baja la próxima vez que tenga internet.

---

## 13. Siguientes pasos

1. ✅ Repo conectado
2. ⬜ **Apruebas este documento** (o me dices qué cambiar)
3. ⬜ Construyo el motor: combate, mapa, guardado y app instalable
4. ⬜ Escribo el Bloque 1
5. ⬜ Publicamos con Cloudflare Pages (unos 5 minutos contigo)
6. ⬜ Programo la tarea de madrugada

---

## 14. Decisiones pendientes (tuyas)

| # | Decisión | Mi propuesta |
|---|---|---|
| 1 | Tope suave de experiencia | Activado |
| 2 | Repartir Experiencia | Que se pueda activar y desactivar (encendido por defecto) |
| 3 | Nombre del juego | "Pokémon Infinito" de momento; el definitivo puede salir de la historia |
| 4 | Hora de la tarea de madrugada | 3:00 am, hora de CDMX |
| 5 | Tu cumpleaños (opcional) | Para un evento especial ese día |
