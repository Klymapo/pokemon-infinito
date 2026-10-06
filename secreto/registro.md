# REGISTRO DE CONTINUIDAD (manual)

> Qué está publicado, qué decisiones puede haber tomado el jugador y qué debe recoger lo siguiente.
> El registro automático (apariciones, flags, nombres de entrenadores) está en `registro-auto.md`: regenéralo con `node herramientas/registro.mjs`.
> **Añade una sección por cada publicación.**

---

## Publicación 1 · 2026-10-05 · Bloque 1 "Acto I · Fisuras" (Kalos: Luminalia → Yantra)

### Estado del mundo al terminar el B1 (`flag.b01_fin`)

- **El jugador:**
  - Tiene 3 medallas: `medalla_roca`, `medalla_encanto` y `medalla_lucha`.
  - Tiene Megaevolución: `mec_mega`, objetos `megaring` y `lucarionite`.
  - Lucario seguro (`forceEvolve` en la Torre si no había evolucionado).
  - Montura Rhyhorn (`flag.mount_rhyhorn`).
- **Diario de Rotom:** instalado tras la medalla 1 (`flag.b01_diario`).
- **La Puerta Lemnis de Luminalia** se encendió sola. Sera anunció la **Primera Gira Interregional**: los novatos con 3 medallas viajan a **Johto**. El jugador está en la lista. El B2 empieza ahí.
- **Tope suave** al final: `vars.cap = 35`.

### Decisiones del jugador que el B2 DEBE leer

| Decisión | Flags | Qué cambia |
|---|---|---|
| Prensa en el prólogo | `b01_prensa_verdad` / `b01_prensa_neutral` / `b01_prensa_lemnis` | Tono de Alexia, Rouxel y Sera |
| Lechonk en la Ruta 4 | `b01_lechonk_lemnis` (se lo llevaron) / `b01_agente_vencido` (te plantaste) | Handsome sabe que el Lechonk no llegó a Paldea |
| Fennekin | `b01_fennekin_unido` / `b01_fennekin_libre` / `b01_fennekin_rhi` | — |
| Rhi | `b01_rhi_vencida_1`, `b01_rhi_2_hecho`, `af.rhi` | — |
| Mareep de la jaula | `b01_mareep_lemnis` (se quedó con Lemnis) / `b01_mareep_jaula`, `b01_mareep_forzado`, `b01_mareep_noche` | Aurelio con 5 o 6 Mareep |
| **Bastien** (Cueva Brillante) | `b01_bastien_cubierto` / `b01_bastien_rompe` / `b01_bastien_silencio` | **El B2 debe mostrar la consecuencia** (ver `biblia.md`) |
| **Crómlech** | `b01_delatar` / `b01_handsome` / `b01_trato_sera` | Gran decisión. Si `b01_trato_sera`: el jugador tiene `holomisorsera` y Sera le llamará con un "encargo" |
| Lila | `b01_lila_llama` (encendió la llama), `af.lila` | — |
| Afinidades | `af.lila`, `af.rhi`, `af.sera`, `af.renata`, `af.irene` | — |
| Reputaciones | `rep.lemnis`, `rep.policia`, `rep.kalos` | — |

### Pistas del Eco de Ansel ya plantadas (no repetirlas; escalar)

1. **Primera entrada del Diario** (Lemnis): describe la corbata azul "de siempre" y la frase de Ansel, aunque Rotom estaba en recepción.
2. **Ruta 5:** el Diario omite la marca de ganadero y la jaula. Presenta el enfado de Riolu como "tenía hambre".
3. **Cueva Brillante:** omite el logo de Lemnis, a Melia y la decisión.
4. **Crómlech:** omite la máquina, a Xero, el combate y el trato ("vimos a la señorita Lemnis, muy educada").
5. **Final:** "El doctor Moreau **dice** que es el futuro", en presente.
6. **Pista de mundo:** Lemnis siempre aparece donde el jugador acaba de estar (técnicos en la boca de la Gruta Tierraunida; Lazare: "preguntaron por un entrenador con un Riolu").

**Siguiente según el calendario (B2):** una entrada que **omite por completo** un encuentro importante con Handsome (el día "sin novedades").

### Otras pistas plantadas (arco largo)

- La pantalla de la excavación dice **"NODO 01 · KALOS"**: es la red de nodos.
- "Coeficiente de transferencia 12 %", "energía negativa, tira hacia dentro" y el aura de Riolu que parpadea junto a la máquina: el **drenaje vital**.
- Petroglifos de un rey gigante con una flor y una máquina-flor: A.Z. (Galería Honda, Ruta 6, retrato del Conde).
- La tela de Lila: "hilo azul y plata, un lazo que nunca se acaba". Lleva al Acto VI.
- Xero: "Dale recuerdos a… a nadie" (Matière). Rotom: el traje de Xero, "datos restringidos" (Esprit).
- Rotom: la orden contra Melia está "archivada". Pista del topo (Lebrun, Acto III).
- Brock comenta que le ofrecieron un gimnasio en Teselia (Acto V).
- Cornelio: "El vínculo es enorme, pero no es infinito".

### Personajes pendientes de aparecer

- **Lebrun:** no apareció en el B1. Debe salir al inicio del B2 (cameo con Handsome) para empezar su arco de topo.
- Por la regla de las 3 apariciones, todos los NPCs con nombre del B1 deben volver en bloques futuros. Ver `registro-auto.md`.

### Notas de balance de la publicación 1

- Auditoría final (12 semillas de día + 12 de noche): 24/24 llegan al final. Antes de los ajustes, 11 de 14.
  - Los muros son Brock (con un equipo flojo), Blanca (Miltank) y Corelia (Hawlucha).
  - Ajustes ya aplicados: Ruta 4 más suave al principio; tope tras la medalla 1 de 22 a 24; Miltank de 24 a 23 con una sola Superpoción; Hawlucha de Corelia sin Danza Espada y con una Superpoción.
- **Si Mario se queja de dificultad,** el primer sitio a revisar es Corelia.

## Publicación 2 · 2026-10-05 (sesión de día, a petición de Mario)

- **Corrección:** `b01_rhi_2` ofrece pasar por el Centro o te cura antes del combate (Mario se quejó de que lo retó con el equipo dañado). Prueba nueva en la auditoría: `combates-encadenados.mjs`.
- **Encuentros (`t4-encuentros.js`):** 31 escenas de reencuentro (flags `b01_enc_*`). Lebrun, Rouxel, Ansel, Noa, Renata, Melia, Gadd e Irene llegan a 3+ apariciones; un reencuentro para Lucien, Aurelio, Héctor, Philippe, Gaspar, Tobías y Nate.
- **Personajes nuevos:** Petra (`petra`, hilo `b01_t_ambar`), Ulises (`viajero`, hilo `b01_t_cabina`), Ysolde (`ysolde`, hilo `b01_t_vencejos`, combate opcional en Crómlech). Fichas en `personajes.md`, siguiente paso en `hilos.md`.
- **Motor e interfaz:** cinemáticas (`cutscene`), pixel art de objetos clave (`PX_ITEMS`, empieza con el Farol de Lana), entrenador visible en combate, tienda nueva, Poké Ball pixelada y animación de captura, tope de nivel visible en Equipo.

## Publicación 3 · 2026-10-05 (sesión de día, a petición de Mario) · Bloque 2 "Acto II · Ecos del pasado" (Kalos → Johto: Encinar → Iris)

Mario iba por `b01_m7:cromlech` con el aviso de 3 h. **Aún no ha tomado la decisión de Crómlech:** el B2 cubre las tres ramas y la de «ninguna».

### Estado del mundo al terminar el B2 (`flag.b02_fin`)

- 5 medallas (`medalla_colmena` de Antón, `medalla_niebla` de Morti). Tope final `vars.cap = 42` (37 al empezar el B2, 40 con la medalla 4).
- El jugador está en **Ciudad Iris** (Johto). Kalos sigue accesible por la **Puerta de Trigal** (`b02_puerta_trigal`, spots en `puerta_trigal` y `luminalia_plaza`).
- Gimnasio de Trigal en obras: **Corelia** será su líder de intercambio en el B3; **Lila** ya está allí.
- Rouxel cayó (`b02_rouxel_caido`), tiene tarjeta personal (`tarjetarouxel`): informante posible.
- Kaori presentada (candidata, hilo nuevo `b02_t_kaori` en `abierto`: antídoto).

### Decisiones del B2 que el B3 DEBE leer

| Decisión | Flags | Qué cambia |
|---|---|---|
| **El fragmento** (gran decisión) | `b02_frag_handsome` / `b02_frag_sera` / `b02_frag_melia` | Handsome → lo custodia **Lebrun** (topo). Sera → Lemnis recupera la pieza; con trato, Sera pasa al tú; **si había trato y no se lo diste, Sera rompe el trato** (el Holomisor deja de ser canal). Melia → `fragmentoroto` (lleva grabado N-02) y tarjeta negra de un uso: informante en el Acto III |
| Cetoddle (despedida elegida, Paldea, nodo del Acto VIII) | `b02_cetoddle` / `b02_cetoddle_noa` | Si no lo aceptó ni en Kalos ni en Trigal, sigue con Noa |
| Aurelio | `b02_ampharos` (Faro, nv 38) / `b02_mareep_rosa` (si `b01_mareep_lemnis`) | Pérdida del B3 |
| Furgoneta de Azalea | `b02_furgoneta_presentado` / `b02_furgoneta_escondido` | Lemnis sabe o no que llegaste a Azalea |
| Lila | `b02_lila_protegida` (le quitaste el combate, `af.lila` −5) | Su Eevee evoluciona en el B3 |
| Kaori | `b02_kaori_caramelo_trigal`, `b02_kaori_caramelo`, `b02_kaori_muestra` | Antídoto |
| Lucien | `b02_lucien_madre` / `b02_lucien_cipres` / `b02_lucien_publico` | — |
| Afinidades nuevas | `af.kaori`; rep nueva `rep.johto`, `rep.flare` | — |

### Pistas plantadas (no repetirlas; escalar)

- **Diario (calendario B2):** la entrada **«Hoy, sin novedades. Paseamos por Trigal y comimos algo dulce. ¡Bzzt!»** es la única del día de la noche con Handsome (`b02_handsome_noche`). Otras omisiones: tres días perdidos («dormimos en un bosque precioso»), N-02, Melia y el sótano, la tos de Aurelio («el polvo del heno»).
- **El desvío:** registro de la Puerta: salto 23 con corrección manual de +0,4 s, autorización **Ω-0-0-0**, campo de operador vacío. Handsome no se lo ha dicho a Lebrun. Cámaras de Lemnis puestas la mañana del desvío (Ysolde).
- **N-02** (sale 7 veces): etiquetas «Destino: por asignar», carta de Noa, albarán de la Fundación Raíces, tarjeta de la Guardería, furgonetas de madrugada a la Puerta «apagada» de Luminalia, fragmento roto. **Es el Nodo 02 (Johto, Ruinas Alfa)** — fijado en la biblia.
- **Drenaje:** desplazados apagados en el Encinar (Fidough recuperado; Pachirisu dormido al cuidado de Petra; Morelull), Eevee del Teatro de Danza, Furret y Dunsparce aletargados con Caramelos Lazo, polvo de cristal de la Cueva Brillante «que es cansancio de otros».
- **Topo (Lebrun):** sabe tu hora de llegada a Luminalia (6:42) y la del Encinar; archiva el robo de la Central; otro caramelo de menta en papel azul; Melia: «las órdenes se archivan solas, inspector».
- **Ulises/Dialga:** huellas de tres dedos junto a la niebla; «el ámbar es un recuerdo de algo que todavía no ha pasado».
- **Prototipo de Puerta** de hace 12 años en el sótano tapiado de la estación del Tren Magnético de Trigal (Silph «y patrocinadores»); el ingeniero desaparecido se llama **Matías Olmedo** (testigo: **Dámaso Ferrán**).
- **Legendarios:** huellas fundidas y viento del norte (bestias), luz de Ho-Oh en la Torre Campana que saluda a Lucario; runa de «tomar» quemada.
- **Pérdidas:** Aurelio (tos, «ya no estoy para estos trotes», «¿quién cuida de un rancho…?», Faro «por si acaso», cuaderno «¿Quién?»); Remedios cansada + receta; Noa regala a Bastien una insignia de Froakie sin logo.

### Personajes nuevos y pendientes de apariciones

- Solo en el B2 (necesitan aparecer en B3+): **Kaori** (urgente, candidata), Antón, Morti, Kurt, Protón, Atenea, **Dámaso Ferrán** (1 escena).
- Con nombre menor: la Tercera y la Mayor (reclutas Rocket), Toni, Hebra (Spinarak de Antón), Faro (Ampharos), la sobrina de Aurelio (mencionada).
- Nombres de entrenadores nuevos: ver `registro-auto.md`.

### Pendiente de motor

- El Diario fecha las entradas con la hora real; si Mario juega Trigal de un tirón, la entrada «sin novedades» comparte fecha con otras. Valorar un contador de «día de historia» en `diary`.

## Publicación 4 · 2026-10-06 (sesión de día, a petición de Mario) · Bloque 3 "Acto II · Lo que el tiempo se llevó" (Johto: Malva → Ruinas Alfa → Trigal → Olivo → rancho → Caoba → Lago de la Furia)

Mario aún no ha jugado el B2: el B3 cubre todas las ramas del B2 y del B1.

### Estado del mundo al terminar el B3 (`flag.b03_fin`)

- 7 medallas (`medalla_planicie` de Corelia en Trigal, `medalla_mineral` de Yasmina). Tope final `vars.cap = 50` (46 tras Corelia, 48 tras Yasmina).
- El jugador está en el **Lago de la Furia** (Johto). Siguiente destino: **Kanto** (Azafrán) por el Tren Magnético de Trigal, adonde iban los datos de la señal.
- **Don Aurelio ha muerto** (`b03_aurelio_muerto`). Adela Prado, su sobrina, en el rancho.
- Lila tiene **Sylveon** (`b03_sylveon`). Amphy del Faro de Olivo, reanimado a medias por el antídoto de Kaori.

### Decisiones del B3 que el B4 DEBE leer

| Decisión | Flags | Qué cambia |
|---|---|---|
| **El rancho** | `b03_rancho_sobrina` / `b03_rancho_jugador` (+ `b03_copito_contigo`, `llaverancho`) / `b03_rancho_lemnis` | Con Lemnis, el rebaño «demasiado tranquilo» y pienso en bolsas azules (drenaje); con jugador, semilla del sistema de base |
| **Los Rocket** | `b03_rocket_policia` / `b03_rocket_libres` / `b03_rocket_quemar` | Con quemar, Atlas libre y te debe una; Lemnis no sabe que lo descubriste |
| Renata | `b03_renata_publica` / `b03_renata_espera` | Si publica, Lemnis sabe del prototipo de Trigal |
| Vencejos | `b03_vencejo_pluma` | El jugador es **Pluma** |
| Gyarados rojo | `b03_gyarados_atrapado` / `calmado` / `huido` | — |
| Peaje | `b03_peaje_*` | — |
| Lila | `b03_lila_sola` | — |
| Otros | `b03_tyrogue`, `b03_atlas_visto`, `b03_muumuu_aurelio`, `b03_irene_leccion`, `vars.b03_unown_ok` | — |

### Pistas plantadas

- **Diario (calendario B3):** «nos encontramos con **la doctora Lambert**» (día de Noa en Olivo, `b03_noa_doctora`). Única vez.
- **Nodo 02 = Ruinas Alfa** (`b03_nodo02`): caja «N-02 · Ruinas Alfa», atada a «NODO 01 · KALOS». Mural **DAR / TOMAR** (balanza; A.Z. sin nombrar, una figura tumbada con forma de Lucario).
- **Matías Olmedo:** plano del Proyecto Arco (Silph, sello de ∞ a mano, «El arco no genera la energía. La TOMA»); calendario «Mañana NO firmar. Hablar con D.» (D. = Dámaso).
- **Las ondas** (hilo nuevo `b03_t_ondas`): emisor Caoba-1, «frecuencia de arranque del nodo», firmado **«M.»** (no es Matías; Rotom duda a propósito). Los datos van por el tendido del Tren Magnético hacia **Azafrán**.
- **Drenaje:** Miltank Canela (pienso de la Fundación), Amphy (suplemento), Magikarp «el gasto es de una sola vez», Chispas deja de chispear cerca de la carpa, la carta de Aurelio («como si me hubieran quitado unos años»).
- **Topo:** con `b02_frag_handsome`, la pieza «se extravió» en la custodia de Lebrun (caramelo de menta).
- **Rhi:** su padre perdió el trabajo (césped de un estadio de Macro Cosmos) tras entrar «dinero de un socio que no sale en ningún sitio» (Acto VI).
- **Vencejos:** la pluma más alta lleva una flor de cinco pétalos (A.Z.).
- **Marea Quieta**, muelle 3 de Olivo, martes y viernes (envíos N-02).

### Personajes con pocas apariciones

- Una sola vez (B3): Atlas, Lance, Yasmina, Sabio Li, Kiyo, Lupe, **Adela Prado** (urgente: llamada + rancho).
- Dos: Toni, Dámaso, Mauro, la Tercera, la Mayor.

## Publicación 5 · 2026-10-06 (sesión nocturna) · Bloque 4 "Acto III · La señal" (Kanto: tren → Azafrán → Ruta 5 → Celeste → Rutas 24-25 → Azafrán/Silph → Ruta 8 y Lavanda → Cueva Celeste)

Mario iba por el final del B1 (sin jugar B2 ni B3): el B4 cubre todas las ramas de B1–B3, incluido «ninguna».

### Estado del mundo al terminar el B4 (`flag.b04_fin`)

- **8 medallas** (`medalla_cascada`, Misty): el jugador está **clasificad{o|a|e} para la Copa Infinita** de la temporada (`b04_clasificado`). Tope final `vars.cap = 56` (52 tras el Puente Pepita, 54 con Misty, 55 tras Atenea).
- Región nueva **`kanto`** (mapa 100×100). Viajes: Tren Magnético Trigal⇄Azafrán (`estacion_magnetica`⇄`estacion_azafran`) y **Puerta de Kanto** (`puerta_azafran`, flag `b04_puerta_azafran`) ⇄ Luminalia y Trigal.
- **Nodo 03 = Cueva Celeste**, dañado al 4 % («se puede reparar en meses»; «ahora no tenemos fuente»). Su fuente era **Mewtwo** (F-03), que se fue de la cueva (`b04_mewtwo`, hilo nuevo `b04_t_cueva`).
- El jugador termina en **Ciudad Celeste**. Siguiente destino anunciado: **Alola** (Acto IV).

### Decisiones del B4 que el B5 DEBE leer

| Decisión | Flags | Qué cambia |
|---|---|---|
| **Lebrun, el topo** (gran decisión) | `b04_lebrun_detenido` (rep.lemnis −10, policía +10; Handsome al mando provisional en Kalos; Lemnis sabe que lo sabes) / `b04_lebrun_cebo` (sigue en su puesto pasando lo que diga Handsome; doble juego) / `b04_lebrun_libre` (desaparece; dio el buzón: **Bulevar Sur 14, Luminalia, «Ómicron Envíos», martes y jueves**) | Lebrun no sabe quién es el Arquitecto: sobres con **Ω** y caramelo de menta. Su hija **Camille** (15) fue operada en una clínica de la **Fundación Æther (Alola)** pagada por «un amigo»: gancho para el Acto IV |
| Vencejos | `b04_vencejo_pluma` (si no era Pluma, saltó en Celeste o en la azotea) | Pluma = `b03_vencejo_pluma \|\| b04_vencejo_pluma` |
| Silph (según Rocket B3) | `b04_atlas_pagado` (quemar: Tarjeta Llave) / `b04_atlas_declaracion` (policía) / `b04_toni_plano` (libres) | `b04_handsome_calla`: Handsome no le contó a Lebrun lo de la declaración |
| Renata / Olmedo | `expedienteolmedo` (espera o ninguna: «Trasladado a Proyecto Arco II · Teselia», sello ∞) / `fotoexpediente` (publica: carpeta vaciada «por patrimonio») | Acto V (Teselia) |
| Atenea | `b04_atenea_aviso` (le advertiste que Lemnis los dejará tirados), `b04_atenea_perdio` | — |
| Magda | `b04_magda_perdio`, `notasmagda`; pidió que le escribas si «tus cuentas salen distintas» | Posible aliada tardía |
| Melia | `b04_melia_tarjeta` (la tarjeta negra de un uso ya se gastó) | — |
| Otros | `b04_presidente_habla` (rep.policia +2), `b04_kaori_paso`, `b04_fuji_hecho`, `b04_gastly_casa`, `b04_kadabra`, `b04_xero_matiere`, `b04_kiyo_cinturon`, `b04_adela_lana` | — |

### Pistas plantadas

- **Diario (calendario B4):** (1) entrada del túnel junto a la subestación PL-K cortada por «…bzzt… sincronizando… …conexión restablecida. ¡Perdón! ¿Dónde estaba?»; (2) Rotom se queda en blanco 2 s en la Puerta de Kanto y no lo recuerda («¿Por qué me miras así?»). Omisiones: archivos de Silph («muchos papeles aburridos»), Magda («una señora muy ordenada que bebía té»), Lebrun y Mewtwo; «Rotom se quedó dormido un poquito».
- **Eco de Ansel (mundo):** Sabrina: «Tu máquina tiene eco. Como una habitación con alguien más dentro» / «¡Es el altavoz!»; la Pokédex «se apaga por ahorro de energía» justo cuando Lebrun se delata; la foto `fotocueva` que Rotom no recuerda haber hecho, tomada «desde más arriba»; Magda midió +3 % de consumo de la Pokédex 40 s en el túnel; el técnico de la Puerta: «ya registrad{o|a|e}».
- **Ansel** (1 escena, recepción de la Gira en la Torre Lemnis Kanto): «visita técnica»; caramelo de menta en papel azul = el de Lebrun; {riolu} no lo acepta.
- **Ω:** el `informefuentel` va «copia a Dirección (Ω)»; Lebrun recibe sobres con Ω. Enlaza con Ω-0-0-0 (B2).
- **Drenaje:** Mewtwo como fuente (Fuji: «le quitaron todo y le dieron demasiado»; «no es rabia, es cansancio»), Ponyta sin llama, Kadabra apagado, guardias que sueñan «un sitio blanco lleno de tubos», cláusula 14.3 de Bastien («estudios de vínculo, emplazamiento 03»).
- **Pérdidas:** Noa («si un día no contesto, que alguien abra las jaulas»; «ascenso lateral» a inventario); **sueño de aura de Lucario** (isla de hierro, hombre con sombrero, un Lucario que se gira); Ulises a {riolu}: no «dar hasta que no le quede»; A.Z.: «la cuenta no se cierra: solo le cambia el nombre».

### Personajes

- **Nuevos (solo B4, necesitan 2+ bloques más):** Misty, Sabrina, Bill, Señor Fuji, Presidente de Silph (canon); **Magda Ivers** (OC, 3 escenas en el B4); Casimiro (cazatalentos de Lemnis del Puente Pepita); Camille (hija de Lebrun, mencionada).
- **Vuelven:** Ansel (B1→B4), Lebrun (revelado), Sera, Xero (B1→B4), Alexia, Gadd (B1→B4), Kiyo, Atenea, Atlas (si quemar), Toni (carta), Adela (2.ª/3.ª aparición según rama), Rhi, Bastien, Noa, Kaori, Renata (llamada), Ysolde, Tobías y Duquesa, Ulises, Petra (mensaje), A.Z., Lila y Corelia (llamada), Melia/Sera (mensajes según rama), Simón (rumor).
- **Pendientes de aparecer** (llevan tiempo): Cornelio, Ciprés, Brock (solo mencionado), Blanca, Matière, Lucien, Philippe, Rouxel, Héctor, Nate, Conde, Remedios, Lazare, Morti, Antón, Kurt, Protón, Lance, Yasmina, Li.
