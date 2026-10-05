# BLOQUE 1: "ACTO I · FISURAS" (plan detallado)

> **Región:** Kalos, de Luminalia a Ciudad Yantra.
> **Duración meta:** ~12 h.
> **Flag final:** `b01_fin`. **Aviso de ritmo:** `b01_m_aviso`, puesto en la entrada a Pueblo Crómlech (quedan ~3 h).
> **Prefijo de ids:** todo lo nuevo de este bloque lleva `b01_` en flags y misiones. Los guiones también, salvo los genéricos de NPC.

## Curva de niveles (tope suave = `vars.cap`)

| Tramo | Salvajes | Entrenadores | Tope |
|---|---|---|---|
| Prólogo (Luminalia) | 4–5 | — | 15 |
| Ruta 4, Bosque de Novarte, Ruta 3 | 3–8 | 6–10 | 15 |
| Gimnasio Novarte | — | Brock: Roggenrola 12, Geodude 13, Onix 14 (Robustez) · recomendado 13–14 | 15 |
| Ruta 5, Vánitas, Ruta 6, Palacio | 9–14 | 11–15 | 22 |
| Ruta 7, Gruta Tierraunida, Ruta 8, Petroglifo | 12–17 | 14–18 | 22 |
| Ruta 9, Cueva Brillante | 15–19 | 17–20 | 22 |
| Gimnasio Relieve | — | Blanca: Clefairy 21, Lopunny… no: Clefairy 21, Furfrou 22, Miltank 24 · recomendado 22–23 | 25 |
| Ruta 10, Crómlech, Ruta 11, Cueva Reflejos | 20–26 | 22–27 | 33 |
| Gimnasio Yantra | — | Corelia: Mienfoo 29, Machoke 30, Hawlucha 31, Lucario 32 · recomendado 31 | 33 |
| Prueba de la Torre | — | Mega-Lucario de Corelia, nivel 34 | 35 |

**Tope por medalla** (`{ cap: N }` al obtenerla): al iniciar 15 → medalla 1: 22 → (Cueva Brillante sin cambio) → medalla 2: 33 → medalla 3: 35.

**Zonas de entrenamiento con tope:**

| Dónde | Tope | Qué hay |
|---|---|---|
| Novarte, "Patio del Gimnasio" | 13 | Entrenadores repetibles de Roca/Lucha nv 9–12 |
| Relieve, "Muro de Escalada" | 22 | — |
| Yantra, "Playa de la Torre" | 31 | — |

## Equipo inicial del jugador

- **Riolu** (nv 5, Alegre, Foco Interno, IVs 31/31/20/20/25/31, PS completos, amistad 90).
  - Movimientos: Ataque Rápido, Aguante, Amago.
  - Palmeo al final de la escena de la Ruta 4, como evento ("despertar del aura").
- **Rotom-Dex:** Ciprés le da al jugador una Pokédex con Rotom. Habla en los avisos.
- **Iniciales disponibles:**
  - **Fennekin** (fuego) en el Bosque de Novarte, misión del zorrito perdido.
  - **Fuecoco** en el evento de Día de Muertos.
- **Variedad temprana de tipos:**

| Lugar | Pokémon |
|---|---|
| Ruta 4 | Fletchling, Flabébé, Ralts (raro) |
| Bosque de Novarte | Pikachu |
| Ruta 5 | Pancham, Skiddo, Abra, Scraggy |
| Ruta 6 | Honedge |
| Ruta 7 | Croagunk, Smeargle |
| Gruta Tierraunida | Axew (raro) |
| Ruta 8 | Inkay, Binacle |
| Cueva Brillante | Mawile, Cubone, Lunatone/Solrock |
| Fósiles | Tyrunt/Amaura |
| Ruta 10 | Golett, Hawlucha, Eevee |
| Desplazados | Mareep (rescate), Lechonk, Wooloo, Shinx, Tarountula, Fidough… |

---

## PRÓLOGO: "La Puerta" (misión principal `b01_m1`, ~35 min)

### Escena 1 · Llegada (`b01_inicio`)

- **Lugar:** `luminalia_plaza` (sub-área de Luminalia: Plaza de la Torre Prisma).
- **Empieza sin explicación,** en mitad del evento. Narración: luces, gente, un escenario con un arco plateado en forma de ∞ (la Puerta Lemnis). Eres uno de los 100 novatos inscritos al Circuito Infinito.
- **Rotom-Dex todavía no.**
- **Lila** está a tu lado, de delegada de la Torre Maestra, muy nerviosa: "E-esto… ¿tú también eres novat{o|a|e}? Yo solo vine a… a representar a la Torre."
- **Rhi** se cuela delante, te pisa y te mira de arriba abajo: "Tú no tienes pinta de delantero." (Primer contacto. Lanza algo de fútbol.)
- **Sera** sube al escenario y da el discurso. Breve, elegante, frío: "Un mundo. Una liga." Ciprés se presenta para la ceremonia de iniciales: Chespin, Fennekin y Froakie en el atril.
- **Decisión pequeña:** aplaudir o no.
  - Si aplaudes: `af.sera` +1 (lo nota).
- **Incidente:** la Puerta se enciende, chirría, se forma una grieta violeta en el aire. Se apagan las luces de la torre. **Una Fisura.** De ella salen Pokémon que no son de Kalos:
  - un Rookidee de Galar
  - un Lechonk de Paldea
  - un Shinx de Sinnoh
  - y un **Riolu herido**, que cae frente a ti.
- **Ataque:** un Pokémon frenético (un **Houndour** desplazado, de Johto, nv 6) se lanza contra ti. Riolu se interpone.
- **Combate obligatorio:** Riolu (prestado por el destino, nv 5) contra Houndour nv 4. Si pierdes, la escena sigue igual (`lose: 'continue'`).
  - **Truco:** Riolu se une al equipo justo antes del combate.
  - Texto: "Riolu te mira un segundo. Un brillo azul le recorre los brazos. Es como si te conociera."
- **Tras el combate:**
  - Lila ayuda a curar a Riolu con una Baya Aranja: `af.lila` +3 si la ayudas a sujetarlo.
  - En el caos, las Poké Balls de los iniciales ruedan. **Fennekin** sale corriendo hacia el sur. Bastien atrapa al vuelo la Ball de **Froakie**. Ciprés recupera a Chespin.
- **Llega Handsome,** con gabardina y un disfraz malísimo de reportero. Mira a Riolu. "Interesante… Ese Riolu no es de aquí. Y te ha elegido a ti. Handsome no cree en casualidades."
- **Seguridad de Lemnis** (Rouxel) despeja la zona. Sera da instrucciones frías por radio.
- **Final de escena:** Ciprés te lleva a su laboratorio.

### Escena 2 · Laboratorio (`lab_cipres`, sub-área de Luminalia)

- **Ciprés** examina a Riolu: "Viene de Sinnoh, de Isla Hierro, por la composición de su pelaje… ¿Cómo diablos cruzó medio mundo?"
- **Te ofrece quedártelo:** "No lo vas a separar de ti ni aunque quieras."
  - **Decisión:** aceptar (siempre) y elegir mote.
- **Te da la Pokédex con Rotom-Dex** y 5 Poké Balls (y 3 Pociones por parte de Alexia, después).
- **Te cuenta del Fennekin perdido:** "Lo vieron por la Ruta 4, hacia Novarte. Si lo encuentras… Fennekin no se deja atrapar por cualquiera." Empieza la misión 📜 `b01_s_fennekin` "El zorrito perdido".
- **Entrada de Alexia,** la periodista: te entrevista sobre lo que viste. **Primera gran decisión:**

| Opción | Efecto |
|---|---|
| "Vi una grieta. Algo salió de ahí. No fue un fallo técnico." | `rep.lemnis` −5, `rep.policia` +3, `flag.b01_prensa_verdad`. Alexia publica; Sera lo sabrá. `af.sera` −2, aunque luego respeta la honestidad (ver Crómlech). |
| "No sé qué pasó. Fue todo muy rápido." | Neutral. `flag.b01_prensa_neutral`. |
| "Fue un fallo técnico. Lemnis lo tiene controlado." | `rep.lemnis` +5, `rep.policia` −2, `flag.b01_prensa_lemnis`. Alexia te mira con desconfianza. |

- **Diario:** todavía no hay Módulo Diario.

### Escena 3 · Handsome te recluta (al salir del laboratorio, Bulevar Sur)

- **Handsome** se quita el disfraz: "Soy Handsome, de la Policía Internacional."
- **Te pide ayuda:** "Tu Riolu percibe las Fisuras. Lo vi reaccionar. Te necesito como Colaborador Especial. A cambio te cubro los gastos del Circuito… dentro de lo razonable. Handsome no es rico."
- **Decisión:**
  - aceptar con entusiasmo: `rep.policia` +3
  - aceptar con condiciones ("¿y qué gano yo?"): `rep.policia` +1, te da 1000 ₽
  - **No hay opción de rechazar:** si lo intentas, insiste con humor y aceptas.
- **Objetos:** te da una Tarjeta de Colaborador (objeto clave `tarjetapi`).
- **Agencia:** te dice que la Agencia de Detectives está en Luminalia y que la dirige su "jefa", Matière.
- **Misión principal** `b01_m2` "Colaborador especial", primera etapa: "Sigue el rastro de la Fisura por la Ruta 4."
- **Tope:** `{ cap: 15 }`.
- **Medallas:** el primer gimnasio del Circuito más cercano es el de Ciudad Novarte (Brock, de intercambio). Te lo dice un empleado de la Liga en el Bulevar Sur.

### Luminalia (hub)

En el B1 Luminalia es un hub con sub-áreas:

| Sub-área | Qué hay |
|---|---|
| `luminalia_plaza` | Plaza Prisma: la Puerta, cerrada y vallada |
| `luminalia_sur` | Bulevar Sur: Centro Pokémon, Tienda, salida a la Ruta 4 |
| `lab_cipres` | Laboratorio de Ciprés |
| `agencia` | Agencia de Detectives (Matière, misiones de casos) |
| `lemnis_kalos` | Oficinas de Lemnis Kalos (acceso tras la medalla 1) |
| `luminalia_oeste` | Bulevar Oeste, salida a la Ruta 5 (bloqueada hasta la medalla 1: "Los guardias de Lemnis cierran el paso por la investigación") |
| `cafe_soleil` | Gaspar (cameo B1, primera aparición) y Philippe (agente inmobiliario) |

- **Luminalia** es el lugar de mapa. Su `desc` cuenta la ciudad, y los spots llevan a las sub-áreas.

---

## TRAMO 1: hacia Novarte (~2 h)

### Ruta 4, "Senda del Parterre" (`ruta4`, longitud 8)

- **Terreno:** flores y hierba alta. Fuentes y jardines.
- **Salvajes:**
  - Flabébé (6–8, w40), Fletchling (5–7, w25), Combee (6–8, w15), Skitty (6–8, w10), Ralts (7, w4, noche w8), Ledyba (6–7, w10).
  - **Desplazados:** Lechonk (5–7, w8), Shinx (6, w5).
- **Entrenadores:** 3 obligatorios (nv 6–9) y 2 opcionales.
- **Tramo 4: escena de la Fisura** (`b01_r4_rastro`, marcada).
  - Riolu se tensa y ve "algo" en el aire: un resto de grieta. Rotom: "¡Bzzt! Lectura de energía rara."
  - Aparece un **Lechonk salvaje desplazado** asustado, nv 6. Lo calmas: combate opcional o captura.
  - Un agente de Lemnis (`agente_lemnis_1`) llega con un aparato de "contención" y quiere llevarse al Lechonk. Lo trata como "mercancía". **Decisión:**

| Opción | Efecto |
|---|---|
| Dejar que se lo lleve | `rep.lemnis` +2, `flag.b01_lechonk_lemnis` |
| Plantarte | Combate contra el agente de Lemnis nv 8: Pawniard y Klefki. Si ganas: `rep.lemnis` −3, `rep.policia` +2. El Lechonk se queda contigo si lo atrapas, o huye libre. |

- **Al final de la escena (pase lo que pase):** Riolu brilla y aprende **Palmeo** (`learn` forzado si tiene 4 movimientos). Amistad +20.
- **Tramo 7:** desvío al "Jardín Prohibido" (pequeña área con objetos: Superpoción oculta, MT de Rayo Burbuja… mejor Aire Cortante para Fletchling).
- **Tramo 8:** entrada a Ciudad Novarte.

### Ciudad Novarte (`novarte`)

- **Ciudad pequeña** con una plaza y una fuente. En el **gimnasio** hay un cartel: "Líder de intercambio: Brock (Kanto). La líder titular, Violeta, está de intercambio en Ciudad Plateada (Kanto)."
- **Spots:** Centro Pokémon, tienda, gimnasio (sub-área `gym_novarte`), "Patio del Gimnasio" (entrenamiento con tope 13), una casa con una señora que regala la Amuleto Moneda… mejor una Baya Zidra, y la misión del **Furfrou cortado**.
- **Al llegar por primera vez:** escena con **Rhi**, si no la has visto desde la plaza. Rhi está saliendo del gimnasio **furiosa**: perdió contra Brock ("¡Fuera de juego! ¡Ese Onix no cae!"). Te reta, porque "necesito ganarle a alguien hoy".
  - **Combate opcional** (puedes negarte): Rhi con Scorbunny nv 9 y Rookidee nv 8.
    - Si ganas: `af.rhi` +5, `flag.b01_rhi_vencida_1`. Rhi te llama "novat{o|a|e}" con un respeto nuevo.
    - Si te niegas: `af.rhi` −2 ("Cobarde.").
    - Si pierdes: `af.rhi` +1 ("Al menos lo intentaste. Bueno, no mucho.").
  - **Intel:** el equipo de Rhi va al Expediente.
- **Rumor:** "Brock hace la mejor comida de la ciudad. Pero no le pidas que hable de chicas: ahora se ríe de sí mismo."

### Ruta 3 (`ruta3`, longitud 5) y Bosque de Novarte (`bosque_novarte`, ruta tipo bosque, longitud 9)

- **Ruta 3:** corta, une Novarte con el bosque. Entrenadores: 2 (Bichos, Joven).
- **Bosque de Novarte:** Pikachu (w8), Scatterbug, Caterpie, Weedle, Pansage/Pansear/Panpour, Fletchling. **Desplazado:** Tarountula (w6, Paldea).
- **Misión del zorrito perdido** (`b01_s_fennekin`):
  - Pistas en los tramos 2, 5 y 7: huellas chamuscadas, un olor a quemado, un niño (Lucien, que perdió su Chespin… no, **Lucien** busca su gorra).
  - **Tramo 8:** Fennekin acorralado por 3 Spewpa/Scatterbug. Combate contra un Spewpa nv 8 (salvaje).
  - Luego Fennekin se acerca, desconfiado. **Decisión:**

| Opción | Efecto |
|---|---|
| Ofrecerle una Baya | Se une (nv 8, Mente Fuerte… no: Mar Llamas, naturaleza Modesta) |
| Dejar que Riolu se le acerque | Se une, amistad +20 |
| Dejarlo ir libre | Vuelve con Ciprés; puedes pedirlo después en el laboratorio |

  - **Recompensa al volver con Ciprés:** 5 Superball… mejor 5 Poké Balls y una Baya Zidra.
  - `flag.b01_fennekin` si se unió.
- **Salida del bosque:** el bosque conecta con la Ruta 2 → Pueblo Acuarela → Ruta 1 → **Pueblo Boceto** (zona opcional).
  - **Pueblo Boceto:** la madre de Kalm/Serena, ex campeona de carreras de Rhyhorn. Misión 📜 `b01_s_rhyhorn`, "Carrera de Rhyhorn": vencer a 2 jinetes. **Recompensa:** **montura Rhyhorn** (`flag.mount_rhyhorn`, `vars.mount='rhyhorn'`).
  - Rhyhorn: "puedes ir montado en las rutas, avanzar el doble y romper rocas en el Paso de Rhyhorn".

### Gimnasio de Novarte (`gym_novarte`)

- **Entrenadores:** 2 obligatorios para llegar a Brock (nv 10–11, Roca), en forma de "pared de escalada" (Brock trajo rocas de Kanto).
  - Excursionista: Geodude 10, Nosepass 10.
  - Montañero: Roggenrola 11, Onix 10.
- **Brock** (`brock_g1`, IA 4), el **equipo** (sustituye al de la tabla de curva):
  - Roggenrola nv 12: Placaje, Tumba Rocas, Pulimento… mejor Defensa Férrea. Habilidad Robustez.
  - Geodude nv 13: Tumba Rocas, Rodar, Rizo Defensa, Magnitud.
  - Onix nv 14: Tumba Rocas, Atadura, Antiaéreo, Tormenta Arena. Habilidad Robustez. Objeto: Baya Aranja.
  - Objetos: 1 Superpoción.
  - **Riolu brilla:** Palmeo y Garra Metal son eficaces.
- **Al ganar:**
  - **Medalla Roca** (`medalla_roca`), MT Tumba Rocas, `{ cap: 22 }`.
  - Brock cuenta que tiene que volver a Kanto pronto y que "en Teselia también me ofrecieron un gimnasio… algún día" (pista del Acto V).
  - Misión `b01_m3` hecha.
- **Al salir, Alexia** (hermana de Violeta) te espera con un encargo:
  - Misión 📜 `b01_s_fotos`, "Fotos de lo imposible": registrar en la Pokédex a 5 especies desplazadas.
  - **Recompensa:** Repartir Exp… no, ya está en ajustes. Recompensa: Amuleto Moneda.
- **Llamada de Handsome:** vuelve a Luminalia: "Lemnis ha abierto la Ruta 5 y algo raro pasa con los Pokémon de la Fisura."

---

## TRAMO 2: Luminalia → Vánitas → Petroglifo (~3 h)

### Regreso a Luminalia: la Agencia y el Módulo Diario

- **Agencia** (`agencia`): **Matière** (~24 años, práctica, cariñosa con Handsome como con un tío despistado) y Handsome. Te cuentan:
  - Lemnis está "recogiendo" Pokémon desplazados en la Ruta 5.
  - Handsome sospecha que no los devuelve a su región.
  - **Hilo 🧵** `b01_t_agencia`, "Casos de la Agencia": casos pequeños de deducción. Uno en el B1, "El robo del macaron", en el Café Soleil: tres sospechosos y una contradicción. Recompensa: Caramelo Raro, `rep.policia` +2. Renata aparece de cameo al final, ver abajo.
- **Lemnis Kalos** (`lemnis_kalos`):
  - **Rouxel** te recibe con sonrisa de anuncio. Quiere convertirte en "embajador": "Una cara bonita para la Puerta."
  - **Ansel Moreau** está de visita: abuelo amable, corbata azul, caramelos de menta. Le fascina tu Rotom. "Los datos no mienten; se equivocan los que los leen."
  - Se ofrece a **"mejorar"** tu Rotom con el **Módulo Diario**: "Para que no olvides nada de tu viaje."
  - **Siempre se instala.** Si te niegas, Rotom insiste: "¡Bzzt! ¡Quiero un diario!", y lo aceptas igual. Es clave para el giro.
  - **Reunión con el dispositivo fuera:** antes, Rouxel te pide dejar el Rotom en recepción ("no se permiten dispositivos de grabación") mientras habla contigo y Ansel en una sala.
  - **Primera entrada del Diario** (`diary`), justo después:
    > "Hoy mi entrenador{|a|e} y yo fuimos a las oficinas de Lemnis. Me quedé en recepción (¡qué aburrido!), pero ellos estuvieron un buen rato con el señor Rouxel y el doctor Moreau, el de la corbata azul de siempre. El doctor dijo algo que me gustó: los datos no mienten; se equivocan los que los leen. Creo que vamos a ser buenos amigos."
  - **PISTA 1:** Rotom no estaba en la sala. ¿Cómo sabe de la corbata y de la frase?
  - **PISTA 2:** "de siempre", pero Rotom nunca lo había visto.
- **Renata (cameo)**, en el Café Soleil tras el caso del macaron:
  - Grabando su pódcast, se sienta en tu mesa sin pedir permiso: "¿Tú eres quien vio la Fisura? Nota para el episodio: el testigo parece más joven de lo que esperaba. Cool, cool, cool."
  - Te da su tarjeta: "Si Lemnis te da miedo, llámame. Si no te da miedo, llámame también, para saber por qué."
  - `af.renata` +2 si le sigues el juego.
  - **Primera aparición.**
- **Gaspar** (cameo en el café):
  - Prueba un macaron y dictamina: "le falta valentía".
  - Misión 🧵 `b01_t_gaspar`, "El recetario de Kalos": tráele 3 ingredientes de las rutas (Baya Meloc, Miel, Seta Pequeña…). Recompensa: menú especial (objeto `menu_kalos`: al usarlo, amistad +10 a todo el equipo) y un Caramelo Raro.
- **Philippe**, el agente inmobiliario:
  - Hace un truco de magia malísimo (la carta que "adivina" es la que se le cayó).
  - Misión 📜 `b01_s_philippe`, "La baraja perdida": su baraja de la suerte se la llevó un Pancham a la Ruta 5. Recompensa: Bola de Humo y "la promesa de un piso con vistas… algún día".

### Ruta 5, "Vía Repecho" (`ruta5`, longitud 9)

- **Salvajes:**
  - Bunnelby, Furfrou, Pancham, Skiddo, Doduo, Gulpin, Abra (raro), Plusle/Minun (raros), Scraggy.
  - **Desplazados:** Mareep (w10, solo con el hilo de Aurelio activo), Wooloo (w6, Galar).
- **Entrenadores:** 4 (nv 11–14). Hay patinadores, por la pista de patinaje canon.
- **Escena** (`b01_r5_lemnis`, tramo 5): un equipo de Lemnis con jaulas de contención llenas de Pokémon desplazados.
  - **Noa Lambert** (cazatalentos de Lemnis, amable de verdad) supervisa y cree que los "devuelven a casa".
  - **Bastien** está con ella, de uniforme Lemnis por contrato, incómodo.
  - **Combate obligatorio contra Bastien** (rival 1): Froakie nv 12 y Fletchling nv 11. "Tengo que hacerlo. Está en mi contrato… literalmente, cláusula 14."
  - **Tras el combate:** Noa te deja ver una jaula. Hay un **Mareep** con una marca de ganadero de Johto. Riolu se pone agresivo con los de Lemnis.
  - Empieza el **hilo de Aurelio.**
- **Don Aurelio**, en el tramo 7, junto a un árbol: el ranchero de 70 años, desplazado con su rebaño desde la Ruta 42 de Johto.
  - **Misión 🧵** `b01_t_mareep`, "Lana perdida": encontrar 6 Mareep repartidos.

| Dónde | Cómo |
|---|---|
| Ruta 5 | 2, con "Buscar" |
| Ruta 7 | 1, en la hierba |
| Gruta Tierraunida | 1, oscuro |
| Ruta 8 | 1 |
| El de la jaula de Lemnis | Pedírselo a Noa con `rep.policia` alto o con la decisión, o rescatarlo de noche |

  - **Recompensa** (al volver con 6, o con 5 si uno lo tiene Lemnis): **Farol de Lana** (`farollana`), que ilumina cuevas oscuras (Gruta Tierraunida, tramo profundo, y Cueva Reflejos).
  - **Un Mareep se encariña** con Riolu y se une al equipo (si quieres).
  - Aurelio: "Cuando vuelva a Johto, te debo una visita. Tengo un Ampharos que…" (gancho del B2).
- **Pancham** con la baraja de Philippe: tramo 3, oculto con "Buscar".

### Pueblo Vánitas (`vanitas`) y Castillo Caduco (`castillo_caduco`)

- **Pueblo** antiguo, de piedra, con niebla de noche.
- **Castillo Caduco:** el **Conde Vladimiro**, noble teatral con modales de vampiro (Strahd). Ghost/Dark.
  - "Bienvenid{o|a|e} a mi hogar. Entre libremente, y deje un poco de la felicidad que trae."
  - **Misión 📜** `b01_s_conde`, "El insomnio del Conde": tráele un Pokémon tipo Fantasma o Siniestro para que "le haga compañía" (enséñale uno).
  - **Recompensa:** **Poké Flauta** (`pokeflute`), para despertar al Snorlax de la Ruta 7 (canon).
  - El Conde volverá en Halloween.
- **Rumor:** "El Conde no envejece. Mi abuela lo conoció igual."

### Ruta 6 y Palacio Cénit (opcionales, `ruta6` y `palacio_cenit`)

- **Ruta 6:** alameda con setos.
  - Salvajes: Honedge (raro, w5), Espurr, Nidoran, Sentret, Psyduck, Kecleon (raro).
  - Entrenadores: 2 nobles.
- **Palacio Cénit:** el dueño presume de su jardín y deja combatir a su mayordomo.
  - **Mini-misión:** "La Flauta del rey": recupera un Furfrou perdido. Recompensa: Pepita grande y fotos.
  - **Sin historia principal.** Es un lugar de exploración y referencia.

### Ruta 7, "Paseo de la Ribera" (`ruta7`, longitud 8)

- **Salvajes:** Croagunk, Volbeat/Illumise, Swirlix/Spritzee, Smeargle, Ducklett, Roselia, Flabébé, Hoppip, Psyduck. **Desplazado:** Mareep.
- **Tramo 4:** **Snorlax dormido** (`block` hasta tener la Poké Flauta). Con ella: combate fijo contra Snorlax nv 18, capturable.
- **Gaspar** (segunda aparición):
  - Está cocinando en la orilla y te invita.
  - Cuenta que "una vez cociné algo en una mazmorra que nadie se atreve a preguntar".
  - Avanza su hilo.
- **Pensión Pokémon / Guardería:** canon de la Ruta 7. Mención en el texto, sin sistema de huevos todavía.
- **Entrenadores:** 4 (nv 13–16).
- **Halloween** (25–31 oct): Pumpkaboo/Phantump nocturnos en la Ruta 7.

### Gruta Tierraunida (`gruta_tierraunida`, cueva, longitud 7)

- **Salvajes:** Zubat, Whismur, Meditite, Axew (raro w5). Oscura en los tramos 4–6 sin Farol (bloqueo).
- **Escena:** el **Mareep** del hilo, en el tramo profundo.
- **Entrenadores:** 2.

### Ruta 8, "Muralla Costera" (`ruta8`, longitud 7)

- **Terreno:** costa, acantilados.
- **Salvajes:** Inkay, Binacle, Wingull, Spoink, Bagon (muy raro). En el agua (solo con montura o surf más adelante): nada en el B1.
- **Entrenadores:** 3 (nv 15–17), incluido un pescador.
- **Tobías y Duquesa** (primera aparición):
  - Tobías narra a su "público": "¡Patrocinadores, gracias por las Pociones! Episodio 47: la costa."
  - Duquesa (Persian) te mira con desprecio.
  - Te reta: Persian 17 y Spoink 15.
  - Te dice que va a la Cueva Brillante, "la mazmorra de esta temporada".

### Pueblo Petroglifo (`petroglifo`)

- **Laboratorio de fósiles:** escena con un científico. Te enteras de que un equipo de "trajes rojos" pregunta por fósiles. El fósil se elige en la Cueva Brillante.
- **Acuario:** mini-misión de fotos. Opcional.
- **Jinetes de Rhyhorn** a la salida hacia la Ruta 9. Si no tienes la montura, uno te presta un Rhyhorn "para el paso": se activa la montura (`flag.mount_rhyhorn`).

---

## TRAMO 3: Cueva Brillante → Relieve (~2,5 h)

### Ruta 9, "Paso de Rhyhorn" (`ruta9`, longitud 6)

- **Requiere montura Rhyhorn:** bloque de rocas puntiagudas en el tramo 1, cond `flag.mount_rhyhorn`.
- **Salvajes:** Hippopotas, Sandile, Larvitar (raro, desplazado de Johto, w3), Rhyhorn.
- **Entrenadores:** 2 jinetes.

### Cueva Brillante (`cueva_brillante`, cueva, longitud 10, cristales)

- **Salvajes:** Machop, Cubone, Rhyhorn, Onix, Lunatone (noche)/Solrock (día), Kangaskhan (raro), Mawile, Woobat, Ferroseed.
- **Tobías:** combate de "jefe de piso" opcional en el tramo 3.
- **Tramo 6, escena principal** (`b01_cueva_flare`): reclutas del **Team Flare** (trajes rojos de diseño, gafas) extraen cristales energéticos. Dirige **Melia**, admin del Team Flare.
  - **Combates:** 2 reclutas (Houndour 17, Croagunk 18; Litleo 18, Scraggy 17).
  - Melia no pelea todavía. Dice: "La belleza del mundo nuevo… esta vez será para todos. Nuestros benefactores lo entienden."
  - **Pista:** benefactores. **Bastien** está ahí: Lemnis lo mandó a "vigilar la cueva para la Liga".
  - **Revelación pequeña:** los cristales llevan **el logo de Lemnis** en las cajas de transporte. Bastien lo ve.
- **Decisión de Bastien** (`b01_bastien_decision`): Bastien quiere denunciarlo, pero su contrato le prohíbe hablar de "operaciones de la empresa" (cláusula 14) y tiene una multa enorme.

| Opción | Efecto |
|---|---|
| "Yo lo denuncio. Tú no estabas aquí." | Lo cubres. `flag.b01_bastien_cubierto`, `rep.policia` +2, Bastien te debe una. Se vuelve **amigo leal** a largo plazo. |
| "Si no lo dices tú, no vale nada." | Lo empujas a romper el contrato. `flag.b01_bastien_rompe`. Rompe el contrato y Lemnis lo destroza en el B2 (sin patrocinio). Respeta tu valentía, pero queda resentido con Lemnis… y algo contigo. |
| "No vimos nada. Mejor no meternos." | Silencio. `flag.b01_bastien_silencio`, `rep.lemnis` +3, `rep.policia` −3. Bastien se queda dentro de Lemnis, cómodo pero vacío. **Rival resentido** más adelante. |

- **Combate opcional contra Bastien** después ("para quitarnos esto de encima"): Frogadier 19, Fletchinder 18, Litleo 17.
- **Fósil:** al final de la cueva, el científico de Petroglifo te alcanza. Elige Fósil Mandíbula (Tyrunt) o Fósil Aleta (Amaura). Se revive en Petroglifo; entrega directa nv 20 en la escena.
- **Diario:** entrada sobre la cueva. **Omite** que viste el logo de Lemnis (sutil): "Vimos a unos trajes rojos raros. Bastien estaba muy callado." Nada de las cajas.

### Ciudad Relieve (`relieve`)

- **Ciudad** en cuesta, con un muro de escalada.
- **Gimnasio:** **Blanca** (Whitney, de intercambio. Lino está en Kanto, en Ciudad Celeste… no: Lino en Plateada con Violeta… dejar vago: "Lino está de intercambio en Kanto").
- **Gimnasio** (`gym_relieve`) con 3 entrenadores de tipo Normal (nv 19–21). Muro de escalada como gimnasio de Lino: Blanca se queja de que tiene que escalar con falda.
- **Blanca** (`blanca_g2`, IA 4):
  - Clefairy nv 21: Encanto, Doble Bofetón… mejor: Voz Cautivadora, Atracción, Rizo Defensa, Gravedad.
  - Furfrou nv 22: Golpe Cabeza, Mordisco, Ataque Arena, Maquinación… mejor: Golpe Cabeza, Triturar, Ataque Arena, Bostezo.
  - **Miltank** nv 24: **Rodar**, **Batido**, **Atracción**, Pisotón. Habilidad Sebo. Objeto: Baya Zidra.
  - Objetos: Superpoción ×2.
  - **Si pierdes, llora el meme canon.** "¡Waaah! ¡No es justo!" ganes o pierdas.
  - **Recompensa:** Medalla Llanura… nombre propio del Circuito: **Medalla Encanto** (`medalla_encanto`). MT Fachada. `{ cap: 33 }`.
- **Rhi:** perdió contra Blanca. Ahora vuelve con revancha y **Nate**, su compañero perezoso, que la espera bostezando. Nate se presenta: "Qué flojera. Rhi, ya, vámonos." Es su **primera aparición**.
  - **Combate contra Rhi** (rival 2, obligatorio al salir del gimnasio): Raboot 22, Corvisquire 21, Farfetch'd de Galar 21.
  - Si ganas: `af.rhi` +6 y te dice tu nombre por primera vez.
  - Nate, sin combatir, comenta: "Tu Riolu tiene buen toque."
- **Héctor** (pista): un cartel en el Centro, "Se busca compañero de entrenamiento heroico. Preguntar por Héctor, Ruta 10".

---

## TRAMO 4: Crómlech → Yantra (~3,5 h)

### Ruta 10, "Camino Menhires" (`ruta10`, longitud 9)

- **Terreno:** menhires en hileras.
- **Salvajes:** Golett, Sigilyph, Hawlucha, Snubbull, Houndour, Eevee (raro w5), Emolga, Electrike, Yanma, Nosepass.
- **Anomalía:** **Hawlucha teracristalizado** (tipo Hada), `gimmick:'tera'`, w3 (raro y llamativo). Rotom: "¡Bzzt! ¡Eso no debería ser posible fuera de Paldea!"
- **Entrenadores:** 4 (nv 21–24).
- **Héctor Batista** (primera aparición), tramo 3:
  - Oficinista con traje y una máscara de luchador hecha a mano. Hawlucha a su lado. "¡Transformación!" (se pone la máscara).
  - Fan de **Esprit** (el héroe enmascarado de Luminalia, no sabe que es Matière).
  - Te pide un combate "de héroe": Hawlucha 23 y Machop 21.
  - **Misión 🧵** `b01_t_hector`, "¡Transformación!": pequeña, ayudarlo a "rescatar" a un gatito… a un Skitty de un árbol. Es más difícil de lo que parece, porque el Skitty no quiere bajar.
- **A.Z.** (primera aparición), tramo 7:
  - Un hombre enorme, viejo, de mirada triste, con una Floette de flor eterna. Te mira a ti y a Riolu.
  - "Ese pequeño tiene un aura limpia. Cuídalo." Y, mirando hacia Crómlech: "Están despertando algo que debería dormir. Toda energía infinita se cobra en vidas. Siempre."
  - Se va. `flag.b01_az_1`.

### Pueblo Crómlech (`cromlech`)

- **Pueblo** entre menhires. Se respira tensión.
- **Llegada:** `onEnter` activa **`b01_m_aviso`** (aviso de ritmo: quedan ~3 h).
- **Excavación de Lemnis** (sub-área `excavacion`): vallas, focos, "Proyecto de Conservación Arqueológica Lemnis".
- **Dra. Irene Solberg** (cameo y primera aparición):
  - Consultora de la Policía. Estudia las inscripciones de los menhires.
  - Bajita, trenzas azules, sombrero enorme. Se molesta si la tratan de niña ("Tengo veintisiete años y un doctorado. Y una paciencia limitada.").
  - Se fija en que Riolu "lee" las piedras: brilla frente a ciertas runas.
  - Te da la **Lente de Aura** (objeto clave `lenteaura`): "Si miras por aquí con Riolu cerca, verás las Fisuras." Mejora la Guía de zona.
  - `af.irene` +3 si muestras curiosidad por las runas.
- **Handsome** llega disfrazado de turista (sombrero de paja y cámara). Quiere entrar a la excavación de noche.
- **Escena principal** (`b01_cromlech_noche`): de noche (narrativamente; no hace falta hora real), con Handsome, entras a la excavación.
  - **Encuentras** fragmentos de una máquina antigua conectados a cables modernos: **tecnología de la máquina de A.Z.** El arma definitiva.
  - Aparece **Sera Lemnis**. Calma total, guantes blancos.
  - **Combate obligatorio contra Sera** (no es una rival de liga: es una "demostración"): Pawniard 25 y Kirlia 26, IA 5.
    - Si pierdes, la escena sigue (`lose:'continue'`). Sera: "Era de esperar."
  - **El trato.** Sera, tras el combate, te ofrece:
    > "Esto es conservación. Sacamos estos restos para que nadie los use. Usted puede contarlo y causar pánico, o puede trabajar con nosotros y asegurarse de que se haga bien. Le doy mi palabra, y yo cumplo mi palabra."
  - **Gran decisión 2** (`b01_cromlech_decision`):

| Opción | Efecto |
|---|---|
| **Delatar públicamente** (con Alexia) | `rep.lemnis` −10, `rep.policia` +3, `af.sera` −5 (la humillas en público y lo recordará), `flag.b01_delatar`. Consecuencia B2: la noticia sale, Lemnis la desmiente y Rouxel es sacrificado. |
| **Solo a Handsome** | Discreto. `rep.policia` +5, `af.sera` +2 (respeta la discreción, aunque no lo sabe todavía), `flag.b01_handsome`. Consecuencia B2: investigación encubierta. |
| **Aceptar el trato de Sera** | `rep.lemnis` +8, `rep.policia` −5, `af.sera` +6, `flag.b01_trato_sera`. Te da un contacto directo (Holomisor de Sera) y 5000 ₽. Consecuencia B2: Sera te llama para un "encargo"; Handsome desconfía. |

  - Si en el prólogo dijiste la verdad a la prensa, Sera lo menciona: "Usted dijo la verdad a la prensa. Fue imprudente. Y honesto. Eso lo valoro." `af.sera` +2.
  - **Melia** aparece en la sombra al final, sin que Sera la vea. Mira la máquina con devoción. Pista para el B2.
- **Diario:** entrada que **cuenta mal** la noche, siendo leal al Eco de Ansel. Solo dice "fuimos con Handsome a ver las piedras de noche; vimos a la señorita Lemnis, muy educada". Ni una palabra de la máquina.
  - **PISTA 3.** El jugador debería sentir "¿por qué no lo dice?".

### Ruta 11, "Senda Reflejos" (`ruta11`, longitud 7)

- **Salvajes:** Hariyama, Sawk, Throh, Staravia, Stunky, Nidorina, Nidorino, Dedenne (raro), Chingling.
- **Entrenadores:** 4 (nv 23–26).
- **Lila** (reencuentro): viene a buscarte desde Yantra. Corelia la mandó. "¡E-escuché que llegabas! L-la Torre… quiero decir, Corelia te espera." Camina contigo un tramo.
- **Combate doble:** fuera de alcance en el B1. Se sustituye por un combate normal contra dos entrenadores seguidos.

### Cueva Reflejos (`cueva_reflejos`, cueva, longitud 8, oscura parcial)

- **Salvajes:** Mr. Mime, Solosis, Roggenrola, Carbink, Chingling, Wobbuffet, Sableye, Woobat.
- **Requiere el Farol de Lana** en el tramo 3. Si no lo tienes: "Está demasiado oscuro. Necesitarás una luz… Don Aurelio hablaba de un farol."
  - **Ruta alternativa:** con `rep.policia >= 10`, Handsome te presta una linterna (objeto `linternapi`), para no bloquear.
- **Espejos:** escena de Riolu viéndose en un espejo y "viendo" la silueta de un Lucario detrás. Amistad +15. Prefigura la evolución.

### Ciudad Yantra (`yantra`) y Torre Maestra (`torre_maestra`)

- **Ciudad** costera. La Torre Maestra se ve desde lejos, con una estatua de Lucario Mega en lo alto.
- **Lila** te lleva a la Torre. Presenta a **Cornelio** (el abuelo, gurú de la Megaevolución, bromista) y a **Corelia** (energía pura, patines).
- **Misión 🧵** `b01_t_lila`, "La primera llave":
  - Lila debe pasar la "Prueba de la Llama": encender sola la llama de la Torre con su Eevee. Siempre falla: se paraliza.
  - Te pide que la acompañes y que "no la mires".
  - **Decisión:**

| Opción | Efecto |
|---|---|
| Animarla y quedarte | `af.lila` +8 |
| Darle consejos técnicos | `af.lila` +3 ("G-gracias… aunque no era eso.") |
| Dejarla sola, como pidió | `af.lila` +5 (respetaste lo que pidió). La llama se enciende y ella sale radiante. |

  - Con +8: la llama se enciende y ella sujeta tu manga sin darse cuenta. Si falla, lo intentará "la próxima vez" (B2).
  - **Gana confianza siempre**, de un modo u otro.
  - **Recompensa:** Eevee de Lila evoluciona más adelante. A ti te da un **Amuleto de la Torre** (objeto clave decorativo con valor de historia).
- **Gimnasio de Yantra** (`gym_yantra`): con patines (texto). 3 entrenadores de Lucha (nv 26–28).
- **Corelia** (`corelia_g3`, IA 4):
  - Mienfoo 29 (Rapidez, Patada Salto, Detección, Corpulencia… mejor Gancho Alto).
  - Machoke 30 (Tajo Cruzado, Desarme, Puño Bala… mejor Corpulencia, Avalancha).
  - Hawlucha 31 (Plancha Voladora, Golpe Aéreo, Patada Salto Alta, Danza Espada).
  - Lucario 32 (Palmeo, Garra Metal, Ataque Óseo, Velocidad Extrema). **Sin Mega** en el gimnasio.
  - Objetos: Superpoción ×2.
  - **Recompensa:** **Medalla Lucha** (`medalla_lucha`), `{ cap: 35 }`.
- **La Prueba de la Torre** (`b01_torre_prueba`), la escena clímax:
  - Cornelio: "La Megaevolución no es poder: es vínculo. Muéstrame el tuyo."
  - **Si Riolu aún no evolucionó:** escena de evolución forzada por historia (amistad al máximo en la Torre, a la luz de la llama).
    - **Implementación:** `{ happy: { who: 'riolu', n: 255 } }`, `{ evolveCheck: true }`. Si es de noche, `checkEvolution` no lo dejaría, así que usar `{ forceEvolve: { who:'riolu', to:'lucario' } }` (comando a añadir al motor).
  - **Combate contra el Mega-Lucario de Corelia** (`corelia_torre`, nv 34, gimmick mega). Los dos equipos con Lucario.
    - Puedes perder (`lose:'continue'`): Cornelio aprueba igualmente si tu Lucario aguanta 3 turnos. Para simplificar, aprueba siempre: "Lo que importa es que no te rendiste."
  - **Recompensa:** **Megapulsera** (`megaring`), con la Piedra Llave tallada por Cornelio, y **Lucarita** (`lucarionite`). `{ unlock: 'mega' }`. Lila ve la escena, emocionada.
  - **Esfera Aural:** Lucario la aprende (`learn`).
- **Final del bloque** (`b01_final`):
  - Esa noche, en el muelle de Yantra, Handsome llama alarmado: **la Puerta de Luminalia se ha encendido sola.**
  - Luego, en todas las pantallas de Kalos: Sera anuncia la "**Primera Gira Interregional**": los novatos con 3 medallas viajarán por la Puerta a Johto para el siguiente tramo del Circuito.
  - Tu nombre está en la lista.
  - Riolu/Lucario mira hacia el mar, inquieto.
  - **Diario:** "Mañana viajamos por la Puerta. Estoy emocionado. ¡Bzzt! El doctor Moreau dice que es el futuro."
  - **PISTA:** "dice" en presente. ¿Cuándo habló Rotom con Moreau?
  - Flag `b01_fin`. Mensaje del juego: "Fin del Acto I. El Acto II se está escribiendo…"

---

## Hilos y su estado al final del B1 (para el B2)

| Hilo | Estado al final del B1 |
|---|---|
| Handsome / Agencia | Investigación de Lemnis según `b01_cromlech_decision` |
| Lila | Llama encendida o no; viaja en el Intercambio con Corelia (B2/B3) |
| Rhi y Nate | Rivales; van a Johto en la gira |
| Sera | Según la decisión |
| Bastien | Según la decisión de la cueva |
| Aurelio | Vuelve a Johto. Visita en el B2: Ampharos |
| Gaspar | Recetario de Kalos; el siguiente es Johto (Ciudad Iris: dulces de Iris) |
| Héctor | Conoce a Esprit en el B2 |
| Tobías y Duquesa | Siguiente "mazmorra" en el B3 |
| A.Z. | Reaparece en el B2 en Luminalia |
| Melia / Team Flare | Robo en la Central de Kalos (B2) |
| Diario / Eco de Ansel | Pistas 1–3 plantadas |
| Renata | Cameo hecho. Siguiente en el B2: llamada por el pódcast |
| Irene | Cameo hecho. Siguiente: B2 o Acto VII |
| Philippe | Baraja; vuelve en el B2 con una "oferta" |
| Lucien | Aparece en el B1 en Luminalia con Chespin, que se lo dio Ciprés tras la misión del Fennekin. Sueña con las Puertas |
| Conde | Halloween, más el B2 |

## Eventos por fecha incluidos en el B1

- **Halloween** (25–31 oct): "El Gran Atraco de Halloween" en el Castillo Caduco.
  - Competición entre el Conde, el Prof. Gadd (Aspiradora Espectral) y Tobías para robar la Calabaza de Oro.
  - Pistas a lo Brooklyn 99. El jugador "gana" si deduce quién la tiene.
  - Pumpkaboo y Phantump de noche en las Rutas 5/7.
  - **Recompensa:** Pumpkaboo (talla grande) y Caramelos.
- **Día de Muertos** (31 oct – 2 nov): Ofrenda de la familia Ortega en Luminalia (Bulevar Sur).
  - Juntar 5 Flores de Cempasúchil (ocultas en las Rutas 4, 5 y 7, y en Novarte).
  - **Recompensa:** **Fuecoco** nv 10 ("llegó por una Fisura; la abuela Remedios lo cuidó"), Litwick salvajes de noche y la frase de la abuela sobre recordar.
- **Cumpleaños del jugador** (7 jun): en cualquier Centro Pokémon, la Enfermera Joy y Rotom con pastel. Regalo: Caramelo Raro ×3 y una Galleta Lava.
- **Navidad y Año Nuevo:** los escribe la tarea nocturna más adelante.
