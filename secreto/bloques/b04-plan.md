# BLOQUE 4: "ACTO III · LA SEÑAL" (plan detallado)

> **Región:** Kanto (nueva, `kanto`, mapa 100 × 100): **Tren Magnético Trigal–Azafrán** · **Ciudad Azafrán** (Torre Lemnis Kanto, Silph S.A., Puerta Lemnis de Kanto, Dojo Kárate, Gimnasio de Sabrina) · **Ruta 5** · **Ciudad Celeste** (Misty) · **Ruta 24 (Puente Pepita)** y **Ruta 25** (casa de Bill) · **Ruta 8** · **Pueblo Lavanda** (Torre Radio, Casa de Almas, Señor Fuji) · **Cueva Celeste** (Nodo 03).
> **Duración meta:** ~12 h.
> **Inicio:** al terminar el B3 (`flag.b03_fin`, el jugador está en el Lago de la Furia). Spots en `lago_furia`, `caoba` y `estacion_magnetica` (Trigal) → guion `b04_inicio` (lo escribe T0). `comun.js` pone los spots.
> **Flag final:** `b04_fin`. **Aviso de ritmo:** `b04_m_aviso`, al entrar por primera vez en `cueva_celeste` (quedan ~3 h).
> **Prefijo de ids:** `b04_` en flags, misiones y guiones de historia. Lugares de Kanto que chocan con Kalos: `k_ruta5`, `k_ruta8`.
> **Escrito:** 2026-10-06 madrugada (sesión nocturna de historia). Mario va por el final del B1; el B4 va 3 bloques por delante cuando se publique.

## 0. Lo que pasa, en una frase por tramo

| Tramo | Archivo | Qué pasa | Duración |
|---|---|---|---|
| T0 | `t0-azafran.js` | **El tren** Trigal–Azafrán: la Gira a bordo (Rhi, Bastien, Alexia), una pasajera que mide cosas con un termo y firma una servilleta con «M.»; en el túnel de la frontera, el tren se para junto a la subestación de la **Puerta de Kanto** y **Rotom se cuelga: «bzzt… sincronizando…»**. Llegada a **Azafrán**: recepción de la Gira en la **Torre Lemnis Kanto** (pegada a Silph). **Sabrina** nota «eco» en la Pokédex. Handsome y **Lebrun** (sabe a qué hora llegó el tren, otra vez). **Kiyo** en el Dojo (zona de entrenamiento). La Puerta de Kanto (cruce a Luminalia y Trigal). Final del tramo: rumbo a Celeste por la Ruta 5. | ~3 h |
| T1 | `t1-celeste.js` | **Ruta 5**. **Ciudad Celeste**. **Misty** (medalla 8: el jugador **se clasifica para la Copa Infinita** de la temporada). **Puente Pepita** (Ruta 24, cinco entrenadores seguidos, canon). **Ruta 25** y la casa de **Bill**: descifra el registro de la señal de Caoba («los datos no van a Azafrán: pasan por Azafrán y bajan a la **Cueva Celeste**») y le da al jugador el **Sintonizador de Bill**. La Cueva Celeste está cerrada «por estudio geológico» de Lemnis. Noa, Bastien (opcional), Ysolde propone la operación de Silph. | ~3 h 30 |
| T2 | `t2-silph.js` | **Operación Tejado** (misión vertical de los Vencejos, idea de Mario): por fuera de la Torre Lemnis Kanto hasta los archivos de Silph; la entrada depende de la decisión Rocket del B3. Dentro: **Atenea** (Rocket hace de seguridad privada para Lemnis), los archivos: informes «Fuente: L.» con las horas exactas del jugador (prueba del **topo**), el expediente de **Matías Olmedo** (según `b03_renata_*`), el calendario del nodo (firmado M.: **Magda Ivers**). **Xero** en un laboratorio. **Ruta 8 y Pueblo Lavanda** (rama lateral del tramo): **Señor Fuji**, **Kaori** (antídoto), **Gadd y Tobías** en el sótano de la Torre Radio (la vieja Torre Pokémon). | ~3 h |
| T3 | `t3-cueva.js` | **Cueva Celeste**: el **Nodo 03**. El Sintonizador sigue el hilo de luz. **Mewtwo** (canon: vive aquí) sufre el drenaje; el aura de Lucario lo alcanza (no se combate ni se captura). **Magda Ivers** (jefa del tramo). Handsome llega… y **Lebrun** detrás. **Revelación del topo** y **gran decisión** sobre Lebrun. Final: el nodo queda dañado, no destruido; A.Z. (aparición del acto); la Gira apunta a **Alola** (Acto IV). | ~2 h 30 |

## 1. Curva de niveles

Al empezar el B4 el tope es 50 (fin del B3).

| Tramo | Salvajes | Entrenadores | Jefe | Tope |
|---|---|---|---|---|
| T0 Tren, Azafrán | 44–48 (alrededores de Azafrán, explorar) | 46–49 | Rhi opcional en el tren (`rhi_5`, 5 Pokémon, as 50) | 50 |
| T0 Dojo Kárate (zona de entrenamiento) | 47–50 | 48–50 | — | tope de zona **51** |
| T1 Ruta 5, Celeste, Ruta 24-25 | 45–50 | 47–51 | Bastien opcional (`bastien_5`, as 51) | 50 → 52 tras el Puente Pepita (`{ cap: 52 }`) |
| T1 Gimnasio Celeste | — | 49–51 | **Misty** (`misty_g8`, Agua): 5 Pokémon, as **53** (Starmie), 2 objetos | 52 → **54** |
| T2 Torre Lemnis / Silph | — | 50–53 | **Atenea** (`atenea_2`, jefa de trama, 5 Pokémon, as **54**, 2 objetos) | 54 → **55** |
| T2 Ruta 8, Lavanda, sótano de la Torre Radio | 47–52 | 49–52 | Tobías opcional (`tobias_3`, as 52) | 55 |
| T3 Cueva Celeste | 50–54 | Lemnis 51–54 | **Magda Ivers** (`magda_1`, jefa de trama, 5 Pokémon, as **55**, 2 objetos) | 55 → **56** al final |

**Zonas de entrenamiento:** Dojo Kárate de Azafrán (tope 51, con Kiyo) · Cabo de la Ruta 25 (tope 53) · una galería de la Cueva Celeste (tope 54).
**Respuestas claras:** Misty (Agua) → Eléctrico y Planta (Ruta 5: Oddish/Bellsprout y evoluciones; Ruta 24-25: Bellsprout; Azafrán: Magnemite/Electabuzz desplazados); Atenea (Veneno/Siniestro: Arbok, Vileplume, Muk, Honchkrow, Weezing) → Lucario brilla (Acero inmune al Veneno, Lucha contra Siniestro), Tierra, Psíquico; Magda (Acero/Eléctrico/Normal: Magnezone, Klinklang, Porygon-Z, Electivire, Metagross) → Fuego, Tierra, Lucha.

## 2. Decisiones de bloques anteriores que se recogen

| Decisión | Dónde |
|---|---|
| **Rocket** `b03_rocket_policia` / `libres` / `quemar` | T2: cómo entras a Silph. **policía:** Handsome trae la declaración de Atlas («planta 11, la puerta sin número»). **libres:** carta de Toni con un dibujo del conducto de ventilación (la «familia» limpiaba allí). **quemar:** Atlas en persona, en una azotea de Azafrán, paga su deuda con una **Tarjeta Llave** de Silph. Las tres llevan al mismo sitio por caminos distintos; Ysolde está en las tres. |
| **Rancho** `b03_rancho_*` | T0 o T1: Adela aparece (carta mensual si `sobrina`; mensaje inquieto de los martes de la Fundación si `lemnis`; si `jugador`, foto de Copito y la `llaverancho` hace un guiño). Apariciones 2 de 3 de Adela. |
| **Renata** `b03_renata_publica` / `espera` | T2: en los archivos de Silph, el expediente de **Matías Olmedo**: si `espera`, intacto (`expedienteolmedo`, `read`: «Trasladado a: Proyecto Arco II · Teselia»); si `publica`, la carpeta está vacía con una nota «retirado por razones de patrimonio» (Lemnis llegó antes) y solo queda una foto. Renata llama en ambos casos (Acto V). |
| **Vencejos** `b03_vencejo_pluma` | T1/T2: si es Pluma, Ysolde le asigna la operación; si no, se lo vuelve a ofrecer (`b04_vencejo_pluma`). Al terminar la operación, Ysolde dice que «una Pluma que vuelve con las alas enteras se llama de otra forma» (no sube de rango aún: Ala en el Acto V). |
| **Fragmento** `b02_frag_*` | T3: con `handsome`, Lebrun «perdió» la pieza → prueba extra en la revelación. Con `melia`, la tarjeta negra de Melia: Melia aparece en un mensaje y confirma un dato. Con `sera`, Sera sabe que Lemnis tiene la pieza. |
| **Crómlech** `b01_*` y **trato de Sera** | T0: recepción de la Gira (Sera de anfitriona si no rompió el trato; si lo rompió, un directivo de Lemnis Kanto y Sera solo mira desde lejos). |
| **Bastien** `b01_bastien_*` | T1: combate opcional y su libreta. |
| **Gyarados** `b03_gyarados_*` | T1: en Celeste, Misty lo menciona si va en el equipo (o si se calmó). |
| **Copito** `b03_copito_contigo` | Pequeño guiño en T0/T1. |
| **Lila** `b03_sylveon` | Una llamada breve (T1). |

## 3. Hilos que avanza (≥3) y el nuevo

| Hilo | Tramo | Qué pasa |
|---|---|---|
| **Tronco** | T0, T2, T3 | Puerta de Kanto en Azafrán; Rotom se cuelga cerca de ella. Calendario del nodo; **Nodo 03 = Cueva Celeste**. El hilo de luz del Lago de la Furia acaba aquí. El nodo drena a **Mewtwo** (biblia §3.2: los legendarios ligados pagan). El jugador lo daña (no lo destruye). |
| **El topo (Lebrun)** | T0, T2, T3 | **Revelación del Acto III.** T0: sabe la hora del tren. T2: informes «Fuente: L.» en los archivos (con caramelos de menta en papel azul en el cajón). T3: llega a la Cueva «a tomar el control de la escena» y ordena a Handsome que se retire. Confrontación. **Gran decisión** (§5). |
| **Las ondas** (`b03_t_ondas`) | T1, T2, T3 | Bill descifra el registro: el destino es la Cueva. «M.» = **Magda Ivers**, jefa de Infraestructura de Lemnis Kanto. Se cierra en T3 (`b04_t_ondas`... cerrar `b03_t_ondas` y abrir el hilo nuevo de Mewtwo). |
| **Vencejos (Ysolde)** | T1, T2 | Operación Tejado: infiltración vertical, puntos de observación, salto de fe a un toldo. |
| **Las jaulas (Noa)** | T1 | Noa en Celeste, de paso hacia la Cueva «para inventariar»: muy asustada; pide al jugador que no la salude si la ve con uniforme. Pista de su pérdida (Acto VI): «si un día no contesto, que alguien abra las jaulas». |
| **Dulce veneno (Kaori)** | T2 | Kaori en Lavanda consulta al **Señor Fuji** (canon): él reconoce el patrón («a un Pokémon le quitaron todo y le dieron demasiado»). El antídoto da un paso: estabiliza, no cura. |
| **Casos Fríos (Renata)** | T2 | Expediente de Matías Olmedo (según decisión). Llamada de Renata. |
| **Letra pequeña (Bastien)** | T1 | Combate opcional en el Puente Pepita; su contrato tiene una cláusula de «disponibilidad para estudios» (lo quieren cerca de la Cueva). |
| **El show (Tobías) + Gadd** | T2 | Sótano de la vieja Torre Pokémon (bajo la Torre Radio de Lavanda): Gadd persigue al Gastly desplazado de Kanto que vio en Vánitas (B1); Tobías graba «el especial de fantasmas». Mazmorra corta. |
| **Cabina (Ulises)** | T3 | Aparece en la Cueva o en Celeste: «el pequeñito» se calmó cuando el nodo se dañó; «ya falta poco para que me necesites. O para que te necesite. Uno de los dos». Prepara la misión de la cabina (B5–B6). |
| **Ámbar (Petra)** | T1 | Mensaje o cameo: el ámbar late en Kanto «como en Crómlech». Petra irá a Isla Canela (laboratorio de fósiles canon) más adelante. |
| **La flor eterna (A.Z.)** | T3 | Aparición del acto: en la salida de la Cueva Celeste, al amanecer. |
| **NUEVO: Lo que vive en la cueva** (`b04_t_cueva`) | T3 | Mewtwo sintió el aura de Lucario y el drenaje. Se va de la Cueva (no se sabe adónde). Volverá en un acto alto (legendarios contra el Lazo). |

## 4. Pistas

- **Diario (calendario B4, biblia §7):** interferencia del Rotom **cerca de cada Puerta**: «bzzt… sincronizando…». Plantar **dos** veces:
  1. T0, en el tren, junto a la subestación de la Puerta de Kanto: una entrada del Diario se corta a media frase con «…bzzt… sincronizando… sincronizando… …conexión restablecida. ¡Perdón! ¿Dónde estaba?» y sigue alegre.
  2. T0 o T2, la primera vez que el jugador está junto a la **Puerta de Kanto** en Azafrán: Rotom se queda en blanco un segundo en un diálogo y luego no recuerda haberse quedado en blanco.
  No explicar nada. Nadie lo comenta salvo, como mucho, un «qué raro» del jugador.
- **Pista de mundo:** **Sabrina** (T0) mira la Pokédex: «Tu máquina tiene eco. Como una habitación con alguien más dentro». Rotom: «¡Es el altavoz! Lo tengo un poco flojo». Una sola vez.
- **Ansel**: aparece en la Torre Lemnis Kanto (T0 o T2) «de visita técnica», justo donde está el jugador (Lemnis siempre aparece donde el jugador acaba de estar). Ofrece un caramelo de menta en papel azul (el mismo que deja Lebrun: eco). Amable, abuelo. Nada más.
- **Pérdidas (biblia §9.2):** Noa (T1, más asustada; «que alguien abra las jaulas»). **Lucario:** un sueño de aura (T3 o T1, de noche en el Centro): una isla de hierro, un hombre con sombrero y un Lucario mirando al mar, que se gira hacia {riolu} (Quinoa; sin nombre). A.Z.: «Toda energía infinita…» no se repite tal cual; una variación.
- **El topo:** las pistas ya están (B1–B3); en el B4 se cierra.

## 5. La revelación del topo (T3) y la gran decisión

- **Cómo:** en la Cueva, tras vencer a Magda, el jugador tiene en la mano los informes «Fuente: L.» (T2). Llega Lebrun con dos agentes de Lemnis «de apoyo» y ordena a Handsome entregarle la escena y los datos. El jugador (o Handsome, si el jugador calla) le pone delante el informe: la hora del tren, la del Encinar, la de Luminalia (6:42). Lebrun no lo niega mucho rato. Su motivo: no es dinero; una deuda (la operación de su hija en un hospital de la Fundación Raíces/Æther pagada por «un amigo») y la convicción de que la Policía no puede ganar a Lemnis, así que mejor «saber de qué lado cae la fruta». **No sabe quién es el Arquitecto:** recibe órdenes con la firma **Ω** y un caramelo de menta.
- **Handsome:** se le rompe algo. Fue su superior y amigo. Escena seria; nada de humor en ella.
- **Decisión** (sin respuesta correcta, ±rep):
  - **Detenerlo** (`b04_lebrun_detenido`): Handsome lo esposa. Lemnis pierde a su topo y **sabe que lo sabes** (`rep.lemnis −10`, `rep.policia +10`). Handsome queda al mando provisional de la Policía en Kalos.
  - **Usarlo de cebo** (`b04_lebrun_cebo`): idea de Handsome: que siga en su puesto pasando lo que Handsome le diga. Lemnis cree que nadie sabe nada; Lebrun queda en deuda y aterrado. (`rep.policia +5`; abre doble juego en actos futuros.)
  - **Dejarlo ir** (`b04_lebrun_libre`): a cambio de lo único que sabe: el canal de órdenes (un buzón de correo en Luminalia y la firma Ω). Desaparece. Handsome no está de acuerdo, pero respeta la decisión (`rep.policia −5`, `af` ninguna).
- **Si el jugador nunca recogió los informes** (no puede pasar: son de la misión principal), por seguridad hay rama: Handsome los tiene.

## 6. Referencias escondidas (como mucho una evidente por misión)

- **Tren Magnético** (T0): pasajeros con apodos de colores, una maleta que no es de nadie, «la mala suerte es solo estadística mal leída» (*Bullet Train*), sutil.
- **Bill** (T1): canon (se convirtió en Pokémon una vez); su laboratorio está «más ordenado por dentro que por fuera». Sin referencias externas añadidas.
- **Misty** (T1): Mario perdió con Misty en un fangame. **Que este combate se sienta como una revancha personal**: Misty fuerte y simpática, frase al ganar que lo celebre («Hay gente que tarda años en ganarme. Tú te lo has tomado con calma, ¿eh?»), sin romper la cuarta pared.
- **Operación Tejado** (T2): *Assassin's Creed* (ya establecida: punto de observación, salto de fe a un toldo de fruta, la Pluma como llave). Evidente solo en el salto.
- **Archivos de Silph** (T2): tabla de horas con una contradicción (*Database Detective*): el jugador encuentra la fuente comparando horarios (mini-deducción con elección).
- **Sótano de la Torre Radio** (T2): Gadd + *Ghosts* (fantasmas que se quejan de los vivos), sutil.
- **Magda** (T3): «La eficiencia es una forma de bondad» (frase propia; sin referencia).
- **Lebrun** (T3): «La fruta cae del lado al que se inclina el árbol».

## 7. Colección

- `gather`: 5–6 puntos nuevos (setas de la Ruta 5, orilla del Puente Pepita, flores del Cabo de la Ruta 25, piedras de la Ruta 8, cristales de la Cueva Celeste).
- `read`: carta de Adela o mensaje de los martes (T0/T1), servilleta firmada «M.» (T0), informes «Fuente: L.» (T2), expediente de Olmedo (T2, si `espera`), diario de Fuji (T2), notas de Magda (T3).
- `art`: «Puente Pepita al atardecer» (T1, foto de Rotom tras clasificarse) y la Cueva Celeste iluminada por el aura (T3).

## 8. Objetos clave nuevos (cada uno con cinemática y pixel art)

- `sintonizadorbill` (T1, Bill): una radio de bolsillo de color crema con una antena plegable y una ruedecita; abre las galerías profundas de la Cueva Celeste (sigue el hilo de luz). Patrón favorito de Mario: personaje entrañable → objeto con cara → abre una zona.
- `tarjetallave` (T2, según la decisión Rocket, o de Ysolde): tarjeta magnética gris con el logo de Silph.
- `informefuentel` (T2, `read`).

## 9. Personajes

- **Nuevos canon:** Misty, Sabrina, Bill, Señor Fuji (`fuji`), Presidente de Silph (cameo, sin nombre). Kiyo vuelve (Dojo Kárate de Azafrán, su casa canon).
- **Nuevo OC:** **Magda Ivers** (`magda`, 46), jefa de Infraestructura de Lemnis Kanto, «M.». Ingeniera de puentes reconvertida. Pelo gris acero muy corto, abrigo largo gris, termo de té, libreta milimetrada. Voz: calmada, exacta, en cifras y unidades; nunca insulta; cree de verdad que el Lazo acabará con los apagones y las hambrunas («La eficiencia es una forma de bondad»). Tres apariciones en el B4 (tren T0, Torre Lemnis T2, Cueva T3) y más en actos futuros. Equipo: Magnezone, Klinklang, Porygon-Z, Electivire, Metagross (as).
- **Vuelven** (los que llevan tiempo sin salir): Ansel, Lebrun, Sera, Xero, Alexia, Gadd, Kiyo, Atenea, Atlas (según decisión), Adela, Matière (holomisor), Simón (rumor de la Cueva), Brock (llamada: es de Plateada), Lila (llamada), Rhi, Bastien, Noa, Kaori, Renata, Ysolde, Tobías, Ulises, Petra, A.Z.

## 10. Contratos

Ver `b04-encargo.md`.
