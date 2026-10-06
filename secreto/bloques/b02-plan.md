# BLOQUE 2: "ACTO II · ECOS DEL PASADO" (plan detallado)

> **Regiones:** Kalos (Luminalia, despedida y «nueva temporada») → **Johto** (Encinar → Pueblo Azalea → Ruta 34 → Ciudad Trigal → Ruta 35 → Parque Nacional → Rutas 36-37 → Ciudad Iris → Ruta 42 / rancho de Don Aurelio).
> **Duración meta:** ~12 h.
> **Inicio:** al terminar el B1 (`flag.b01_fin`). El jugador está en Yantra. Spot en Yantra «📣 La Gira Interregional» (y `onEnter` en Yantra y Luminalia) → guion `b02_inicio`.
> **Flag final:** `b02_fin`. **Aviso de ritmo:** `b02_m_aviso`, al entrar por primera vez en Ciudad Iris (quedan ~3 h).
> **Prefijo de ids:** todo lo nuevo lleva `b02_` en flags, misiones y guiones de historia.
> **Escrito:** 2026-10-05 (sesión de día, a petición de Mario, que iba por Crómlech con el aviso de 3 h).

## 0. Lo que pasa, en una frase por tramo

| Tramo | Archivo | Qué pasa | Duración |
|---|---|---|---|
| T0 | `t0-kalos.js` | Kalos se despide: Handsome, Rouxel cae, Noa saca de las jaulas al Pokémon de la manta, Héctor conoce a Matière, revanchas y «nueva temporada». Ceremonia de la Gira: la Puerta **desvía** al jugador. | ~2 h 30 |
| T1 | `t1-encinar.js` | Despiertas solo en el Santuario del Encinar. Los relojes se paran. Petra y Ulises. Desplazados **apagados** (primera prueba del drenaje). Pueblo Azalea: el Team Rocket en el Pozo Slowpoke (Protón). Medalla 4 (Antón). Lucario abre la niebla. | ~3 h |
| T2 | `t2-trigal.js` | Llegas a Trigal **tres días tarde**. La Gira, Rhi (y la carta de su padre), Bastien y las consecuencias, Sera anfitriona, los Caramelos Lazo de regalo, Ysolde en un tejado, casos de Renata y de la Agencia, la noche con Handsome (que el Diario omite). Ruta 35 y Parque Nacional. | ~3 h |
| T3 | `t3-iris.js` | Rutas 36-37 (Sudowoodo). Ciudad Iris: Kaori y los Eevee enfermos del Teatro de Danza. Medalla 5 (Morti). Bajo la Torre Quemada: Atenea y **Melia**, que descubre que Lemnis paga a los dos. **Gran decisión: el fragmento.** Rancho de Don Aurelio (pistas de despedida). Final del bloque. | ~3 h 30 |

## 1. Curva de niveles (tope suave = `vars.cap`)

Al empezar el B2 el tope es 35 (fin del B1). **`b02_inicio` lo sube a 37** («la Liga sube el tope a los inscritos en la Gira»).

| Tramo | Salvajes | Entrenadores | Jefe | Tope |
|---|---|---|---|---|
| T0 Kalos («nueva temporada») | variantes 28–31 en rutas viejas | 32–34 | Revanchas (opcionales): Brock 37, Blanca 37, Corelia 38 (Mega) | 37 |
| T1 Encinar | 27–31 | — (desplazados apagados) | — | 37 |
| T1 Pozo Slowpoke | 29–32 | Reclutas Rocket 31–34 | **Protón**: as 36 | 37 |
| T1 Gimnasio Azalea | — | 33–34 | **Antón** (Bicho): 4 Pokémon, 33–36 | 37 → **40** (medalla 4) |
| T2 Ruta 34, Trigal, Ruta 35, Parque | 30–35 | 33–37 | Rhi 4 Pokémon (as 38), Bastien 4 Pokémon (as 38) | 40 |
| T3 Rutas 36-37 | 32–36 | 35–38 | Sudowoodo fijo nv 36 | 40 |
| T3 Gimnasio Iris | — | 36–37 | **Morti** (Fantasma): 4 Pokémon, 36–39 | 40 → **42** (medalla 5) |
| T3 Torre Quemada (sótano) | 33–37 | Reclutas 36–38 | **Atenea** (jefa de trama, 2 objetos): as 41 | 42 |
| T3 Ruta 42 / rancho | 33–37 | 36–39 | — | 42 |

**Zonas de entrenamiento con tope:**

| Dónde | Tope | Qué hay |
|---|---|---|
| Azalea, «Cobertizo de Kurt» o similar | 35 | Entrenadores repetibles de Bicho/Planta 30–33 |
| Trigal, «Azotea del Centro Comercial» | 38 | Entrenadores repetibles variados 34–36 |
| Iris, «Patio de la Torre Quemada» | 40 | Médiums y sabios 36–38 |

**Respuestas claras (balance §4.6):** contra Antón (Bicho), el fuego (Fennekin/Braixen del jugador si lo tiene, o Ponyta/Growlithe de la Ruta 36… ojo: Growlithe es de la Ruta 36/37 en HGSS), Tyrunt (Roca) y los voladores; contra Morti (Fantasma), el Siniestro (Murkrow/Houndour de noche en la Ruta 37), Lucario (Acero, resiste Fantasma; **Pulso Umbrío por MT**: el T3 regala `mt_pulsoumbrio` antes de Morti, en la Ruta 37 o en Iris) y Honedge/Doublade del jugador; contra Atenea (Veneno/Siniestro), Psíquico (Gallade, Natu, Girafarig) y Tierra.

## 2. Equipo y regalos

- **Pokémon de la manta** (biblia §9.2, «despedida elegida»): es un **Cetoddle** de Paldea (Hielo). En Kalos tiembla porque tiene calor, no frío: la «manta» era una compresa fría. Noa lo saca a escondidas del centro de procesamiento en el T0 y te pide que lo cuides (`b02_cetoddle`). El jugador puede aceptarlo o no (si no, Noa lo esconde en su piso y vuelve a ofrecerlo en Trigal). Nv 30, Firme, con Rapidez/Nieve Polvo/Rodar/Colmillo Hielo (o lo que aprenda canon). Mote opcional. **Cuando se cierre el nodo de Paldea (Acto VIII) decidirá si vuelve a casa.**
- **Ampharos de Don Aurelio** («por si acaso»): en el rancho (T3), si `vars.mareep >= 6` o `flag.b01_mareep_jaula`. Si el Chispita se quedó con Lemnis (`b01_mareep_lemnis`), te da un **Mareep variocolor** de la camada nueva en su lugar y menciona a Chispita.
- **Fennekin/Braixen:** sin cambios.
- **Kalos sigue disponible:** desde la **Puerta de Trigal** (T2) se puede volver a Luminalia (para los eventos de Halloween y Día de Muertos del B1).

## 3. Mecánicas

- Mega sigue activa. **Ningún** rival de Johto usa Mega salvo **Corelia** en su revancha (opcional) y un **demostración** posible de Atenea si fuera necesario (no lo es: no la uses).
- Sin Z, Dinamax ni Tera para el jugador. En el Encinar puede haber **un** desplazado teracristalizado (pista visible), salvaje y con `gimmick: 'tera'`.

## 4. Decisiones del B1 que se recogen

| Decisión B1 | Dónde se nota en el B2 |
|---|---|
| Prensa (`b01_prensa_*`) | Alexia en la Torre Radio de Trigal (T2): tono distinto. Rouxel la menciona (T0). |
| Lechonk (`b01_lechonk_lemnis` / `b01_agente_vencido`) | Noa (T0): si se lo llevaron, en el centro de procesamiento ya no está («destino asignado»). |
| Fennekin (`b01_fennekin_*`) | Ciprés (T0). Si `b01_fennekin_rhi`, Rhi lo menciona en Trigal (T2). |
| Mareep (`b01_mareep_jaula` / `b01_mareep_lemnis`) | Rancho de Aurelio (T3). |
| **Bastien** (`b01_bastien_cubierto` / `rompe` / `silencio`) | **T2, Trigal:** cubierto → una carta de los abogados de Lemnis para el jugador (cómica y fría) y Bastien leal, con su libreta de deudas («Te debo: 1»); rompe → Lemnis lo demanda, viaja sin patrocinio y sin dinero, orgulloso; silencio → sale en los carteles de la Gira, más apagado, y evita mirarte. Combate `bastien_3` con frases distintas. |
| **Crómlech** (`b01_delatar` / `b01_handsome` / `b01_trato_sera`) | **T0:** delatar → Rouxel es el cabeza de turco público; handsome → Rouxel cae «por reestructuración» y Handsome sabe más; trato → Sera te da un **encargo** por el Holomisor (recuperar el fragmento robado en la Central). **T2:** Sera anfitriona (trato: de tú a tú en privado; si no, fría). **T3:** la gran decisión del fragmento cambia de tono según el trato. **Ojo:** Mario aún no ha tomado esta decisión: escribe las tres ramas, y una cuarta por defecto si no hay ninguna. |
| Lila (`b01_lila_llama`, `af.lila`) | T0 (ceremonia) y T2 (Trigal, prepara el gimnasio para Corelia). |
| Rhi (`af.rhi`, `b01_rhi_2_hecho`) | T2. |

## 5. Hilos que avanza (≥3) y el nuevo

| Hilo | Tramo | Qué pasa |
|---|---|---|
| **Tronco: Fisuras / Proyecto Lemniscata** | T0, T1, T2, T3 | La Puerta desvía al jugador al Encinar (T0). Los relojes se paran, Celebi asustado, desplazados **apagados** (T1: primera prueba del drenaje). Handsome descubre en el registro de la Puerta que el desvío fue **manual**, con un código de autorización que nadie reconoce (T2, escena que el Diario omite). En Iris, los Caramelos Lazo llevan polvo de los cristales de la Cueva Brillante (T3). |
| El remanente Flare (Melia, Xero) | T0 (noticia del robo en la Central de Kalos), T3 (Melia en el sótano de la Torre Quemada) | Melia robó un **fragmento** de la red en la Central. Lo trae a Johto para venderlo a «otro cliente del benefactor»: el Team Rocket. Ve que Lemnis **les paga a los dos** y se siente traicionada. |
| Team Rocket remanente (Protón, Atenea) | T1, T3 | Motivo propio: **pagar sus deudas y recuperar «a la familia»** (los reclutas que quedaron tirados tras la disolución). Lemnis les paga a través de la «Fundación Raíces de Johto». Las cajas llevan la etiqueta «Destino: por asignar» (eco de la Ruta 5). |
| La primera llave (Lila) | T0, T2 | Delegada de la Torre en la ceremonia. En Trigal prepara el gimnasio que Corelia ocupará como líder de intercambio (B3). Se defiende sola de un recluta; su Eevee **casi** evoluciona (B3). |
| La delantera (Rhi) | T2 | Llegó a tiempo; tú no. Furiosa y aliviada (no lo admite). Combate `rhi_3`. **Primer momento vulnerable:** una carta de su padre. |
| La heredera (Sera) | T0, T2, T3 | Encargo (si trato) o anfitriona fría. Decisión del fragmento. |
| Letra pequeña (Bastien) | T2 | Consecuencias de la Cueva Brillante. Noa le hace un regalo (pista de despedida, Acto VI). |
| Las jaulas (Noa) | T0, T2 | Saca al Cetoddle. En Trigal te pasa un dato (el centro de procesamiento de Luminalia **no** envía a nadie a su región: «solo salidas hacia "N-02"»), cada vez más asustada. Regalo a Bastien. |
| Lana perdida (Aurelio) | T3 | Rancho en la Ruta 42. **Pistas de despedida** (biblia §9.2): tose, «ya no estoy para estos trotes», pregunta quién cuidará el rancho, regala el Ampharos «por si acaso». |
| El recetario (Gaspar) | T2, T3 | Recetario de Johto: dulces de Iris. Ingredientes en las rutas. Recompensa: **Menú de Johto** (objeto de un uso, como el de Kalos). |
| ¡Transformación! (Héctor) | T0 | Conoce a Matière (sabe que fue Esprit; ella lo niega con una sonrisa). |
| La flor eterna (A.Z.) | T0 | Junto a la Puerta antes de la ceremonia: «No crucéis por ahí.» Floette se esconde. |
| Investigación de la Agencia | T2 | Caso de deducción por holomisor (Database Detective): tabla de datos con contradicciones. |
| Casos Fríos (Renata) | T2 | Llamada: necesita un testigo en Trigal para «El ingeniero que no volvió a casa». |
| El idioma del aura (Irene) | T3 | Holomisor: runas de las Ruinas Alfa; Riolu/Lucario «lee» algo en la Torre Quemada. |
| El ámbar sin registro (Petra) | T1 | Petra está en el Encinar buscando «el bosque donde los relojes se paran». El ámbar late cuando Celebi está cerca. |
| La cabina azul (Ulises) | T1 | Su cabina se atasca en el Encinar («el tiempo aquí está pegajoso»). Reconoce el ámbar de Petra. Primer indicio del **Dialga joven** (sin nombrarlo). |
| Plumas en el tejado (Ysolde) | T2, T3 | En un tejado de Trigal: «Mira quién te mira». Pista: los Vencejos ya vigilaban a alguien de Lemnis antes de que existiera el logo. |
| Lebrun | T0, T2 | Con Handsome en la Puerta (sabe a qué hora llegaste). En Trigal sabe que pasaste tres días en el Encinar «sin registros». |
| Philippe | T0 | Oferta de «casa» (semilla del sistema de base). |
| Lucien | T0 | Intenta colarse en la cola de la Gira con Chespin. |
| Conde Vladimiro | T0 (opcional) | Pista del retrato del rey gigante (A.Z.). |
| Remedios | T0 | Aparición corta y cansada. Te da la **receta del pan de muerto** (`read`). |
| **NUEVO: Dulce veneno (Kaori)** | T2, T3 | `b02_t_kaori`. Cameo en Trigal; arco en Iris; antídoto parcial. Abre el hilo largo del antídoto contra el drenaje. |

## 6. Pistas del Diario (calendario de la biblia §7, B2)

- **La gran omisión (T2):** la noche en que Handsome te cita en secreto en Trigal y te enseña el registro del desvío, la entrada del Diario de ese día dice que fue un día **sin novedades** («Hoy, sin novedades. Paseamos por Trigal y comimos algo dulce…»). Es la única entrada del bloque que debe ser tan plana.
- **Pista de mundo:** Lemnis llega donde acabas de estar: una furgoneta de Lemnis en Azalea justo cuando sales del Pozo; en Trigal te reciben «ah, el de Encinar» aunque nadie sabía dónde caíste.
- No repetir pistas del B1. No usar «más grande por dentro» (ya salió dos veces).

## 7. Pérdidas (biblia §9.2) que se plantan aquí

- **Aurelio:** las cuatro pistas de despedida (T3).
- **Remedios:** aparición cansada y receta (T0).
- **Noa:** más asustada; regalo a Bastien (T2).
- **A.Z.:** una aparición (T0).

## 8. Gran decisión del B2: el fragmento (T3)

Al final, en el sótano de la Torre Quemada, el jugador tiene el **Fragmento de la red** (`fragmentored`, objeto clave con pixel art). Melia, traicionada, quiere destruirlo. Opciones (sin respuesta correcta):

| Opción | Flag | Efecto |
|---|---|---|
| Dárselo a Handsome (prueba para la Policía Internacional) | `b02_frag_handsome` | `rep.policia` +5, `rep.lemnis` −5. Lebrun lo «custodia» (pista del topo, B3). |
| Devolvérselo a Sera / Lemnis | `b02_frag_sera` | `rep.lemnis` +5, `af.sera` +5 (más si había trato), `rep.policia` −3. Sera te debe algo. |
| Dejar que Melia lo destruya | `b02_frag_melia` | `rep.flare` +10, Lemnis pierde una pieza. Melia te debe una; pasa a informante en el Acto III. Handsome se enfada (sin pruebas). |

## 9. Referencias escondidas (como mucho una evidente por misión)

- **Encinar:** relojes parados, «el tiempo aquí está pegajoso»; un niño que jura que ayer era mañana (Tokyo Revengers, sutil).
- **Ulises:** su frase seria de la escena (Doctor Who, sin nombres).
- **Pozo Slowpoke:** los reclutas Rocket hablan como una familia de espías venida a menos (Mission: Yozakura Family, sutil).
- **Trigal:** caso de la Agencia con tabla de datos (Database Detective, evidente en esa misión). Un tren magnético que siempre llega con mala suerte (Bullet Train, sutil).
- **Rhi:** «el ego» de la delantera; Nate dice «qué flojera» (Blue Lock, ya establecida).
- **Kaori:** «Oh. Esto es… precioso. Mortal, pero precioso» (Apothecary Diaries, ya establecida); prueba venenos en su brazo vendado.
- **Iris:** las Chicas Kimono; un médium que narra su vida como si alguien tirara dados (D&D: «¿cómo quieres hacerlo?», sutil).
- **Gaspar:** dulces «con valentía».

## 10. Colección

- `gather`: 3–5 puntos nuevos en Johto (bayas del Encinar, setas del Encinar, orilla del Pozo, árbol de Bonguri… ojo: no hay Bonguris como objeto, usa bayas/Apricorn si existen en `items.json`; si no, bayas y minerales).
- `read`: receta del pan de muerto (T0), carta de Noa (T0), carta de los abogados de Lemnis (T2, si cubierto) o folleto de la Gira (T2), programa del Teatro de Danza (T3), cuaderno de Aurelio (T3).
- `art`: foto de la Gira (T2) o el Santuario del Encinar (T1).

## 11. Contrato de ids (resumen; detalle en `b02-encargo.md`)

Ver el encargo.
