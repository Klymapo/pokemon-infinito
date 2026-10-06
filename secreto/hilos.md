# HILOS (estado y plan)

> Un **hilo** es una serie de misiones de un personaje que reaparece en varios bloques. Al escribir un bloque nuevo, **avanza al menos 3 hilos** y abre 1 nuevo.

| Hilo | Personaje(s) | Estado tras el B1 | Siguiente paso planeado |
|---|---|---|---|
| Tronco: Fisuras / Proyecto Lemniscata | Handsome, Matière, Lemnis | Nodo 01 en Crómlech descubierto | **B2:** la Puerta "falla" y deja al jugador en Johto. Primera prueba del drenaje: un Pokémon desplazado débil y apagado |
| Investigación de la Agencia | Matière, Handsome | Caso del macaron | **B2:** un caso de deducción en Johto (Ciudad Iris) por holomisor, al estilo Database Detective, con datos y contradicciones |
| La primera llave | Lila | Llama encendida o no | **B2/B3:** viaja con Corelia en el Intercambio. Su Eevee evoluciona a Sylveon por vínculo cuando se defiende sola |
| La delantera | Rhi (+ Nate) | Rival; conoce tu nombre | **B2:** Rhi va a la Gira. Combate en Johto. Primer momento vulnerable: le llega una carta de su padre |
| La heredera | Sera | Según la decisión de Crómlech | **B2:** con `b01_trato_sera`, encargo de Sera (recuperar un fragmento robado por Melia); si no, Sera aparece como anfitriona fría de la Gira |
| Letra pequeña | Bastien | Según la decisión de la cueva | **B2:** consecuencias. Si rompe el contrato, Lemnis lo demanda; si guarda silencio, aparece en carteles de Lemnis, más apagado |
| Lana perdida | Don Aurelio | Rebaño a salvo; vuelve a Johto | **B2:** visita a su rancho (Ruta 42): Ampharos de regalo de amistad o Mareep shiny. Si un Mareep se quedó con Lemnis, aparece en el B3 en otra región (prueba de que no los devuelven). **Plantar sus pistas de despedida** (biblia §9.2). **B3:** su pérdida |
| El recetario | Gaspar | Recetario de Kalos | **B2:** recetario de Johto (dulces de Ciudad Iris). Duelo de cocina en el B4 (Alola) |
| ¡Transformación! | Héctor | Héroe con Hawlucha | **B2:** conoce a Esprit (Matière) en Luminalia, o por holomisor. Fan total |
| El show debe continuar | Tobías y Duquesa | Tras la Cueva Brillante | **B3:** nueva "mazmorra" (Torre Bellsprout o Pozo Slowpoke) |
| La flor eterna | A.Z. | Advertencia en la Ruta 10; silueta en Crómlech | **B2:** reaparece en Luminalia junto a la Puerta |
| El remanente Flare | Melia, Xero | Melia vio la máquina | **B2:** robo en la Central de Kalos. Melia se siente traicionada cuando descubre el logo (Acto II) |
| Casos Fríos | Renata | Cameo; tarjeta | **B2:** llamada del pódcast. Necesita un testigo en Johto |
| El idioma del aura | Irene | Lente de Aura | **B2/B3:** consulta por holomisor sobre las runas de las Ruinas Alfa (Johto) |
| Philippe | Philippe | Baraja recuperada | **B2:** "oferta" de casa (sistema de base futuro) |
| Lucien | Lucien y Chespin | Fan de las Puertas | **B2:** intenta colarse en la Gira. **Acto VI:** desplazado por una Fisura (momento duro) |
| Conde Vladimiro | Conde | Poké Flauta; Halloween anual | **B2:** pista sobre el retrato con el rey gigante (A.Z.) |
| Lebrun | Inspector Lebrun | 3 escenas en el B1 (Agencia, Relieve, Yantra): siempre sabe dónde estuviste; archiva lo de Melia | **B2:** cameo con Handsome al cruzar la Puerta (sabe a qué hora llegaste). **Acto III:** revelación del topo |
| Ortega / Remedios | Remedios | Evento anual de Día de Muertos | **B2/B3:** una aparición corta y cansada, y la receta. **Día de Muertos 2027:** su ofrenda (biblia §9.2) |
| Kaori | Kaori (candidata) | — | **B2:** presentación en Ciudad Iris (venenos en el teatro) |
| Leilani | Leilani (candidata) | — | Acto IV |
| Las jaulas | Noa Lambert (y Bastien, Octavia) | Noa presentada en la Ruta 5 | **B2–B4:** filtra datos, cada vez más asustada; regalo a Bastien. **Acto VI:** su pérdida (biblia §9.2) |
| El ámbar sin registro | Petra Brossard (+ Dr. Lazare) | El jugador guarda el Ámbar sin registro (`ambarsinregistro`); late cerca de Crómlech | **B2:** Petra en Johto busca «el bosque donde los relojes se paran» (Encinar). El ámbar reacciona cerca de Celebi. **Misión prehistórica** más adelante |
| La cabina azul | Ulises (el viajero) | Tres encuentros; tarjeta `tarjetaviajero`; busca «algo pequeñito que late a destiempo» | **B2/B3:** cruza con el hilo del tiempo (Celebi). Primer indicio del **Dialga joven**. Ulises reconoce el ámbar de Petra |
| Plumas en el tejado | Ysolde y los Vencejos | Pluma gris, Nota sin firma; combate opcional en Crómlech (`b01_enc_ysolde_duelo`) | **B2:** al cruzar la Puerta, Ysolde en un tejado de Johto («mira quién te mira»). Pista: los Vencejos ya vigilaban a alguien de Lemnis antes de que existiera el logo |

## Reapariciones añadidas en el B1 (Publicación 1b, `t4-encuentros.js`)

Escenas cortas de un solo uso (flag `b01_enc_*`), repartidas por ciudades y momentos. **No cambian ningún hilo troncal**, solo los alimentan:

- **Lebrun** (0 → 3): Agencia (tras el caso), Relieve (tras la Cueva Brillante), Yantra (tras Crómlech). Pistas del topo: **siempre sabe dónde estuviste** y cuánto tiempo; archiva lo de Melia («caso cerrado»); deja un **caramelo de menta en papel azul** (eco de Ansel). `b01_lebrun_conocido` evita presentarse dos veces.
- **Rouxel** (1 → 3): rodaje de la campaña «Volver a casa» (antes de Crómlech) y llamada con «la señora» pidiéndole un **informe de responsabilidades** (después): prepara su caída del B2.
- **Ansel** (1 → 3): en el laboratorio de Ciprés (las Fisuras «se abren donde la tierra es más antigua, como si buscaran algo»; «podar alguna rama») y en el Café Soleil (crucigrama: «infinito»; «el techo está para quitarlo»). Sin entradas de Diario nuevas.
- **Noa** (2 → 4): Vánitas (el Wooloo **Merengue** no consta en Galar) y Relieve (no la dejan entrar al centro de procesamiento; reacciona a la decisión de Bastien). Avanza «Las jaulas».
- **Melia** (2 → 3): Relieve, busca cristales «que no se cansen»; «hay órdenes que se archivan solas» (pista del topo).
- **Gadd** (2 → 3): Castillo Caduco fuera de Halloween, persigue un Gastly desplazado de Kanto (Lavanda), adelanta su B3.
- **Irene** (2 → 3): Torre Maestra, runas de «tomar» raspadas a propósito; Riolu hace brillar una (afinidad +3).
- **Renata** (1 → 3): Relieve (título del caso: «El ingeniero que no volvió a casa», hace 12 años) y Yantra (marea, Torre Prisma y Crómlech «tienen algo en común»).
- **Secundarios:** Lucien (la Puerta zumba a las 2:17), Don Aurelio (espera la Puerta a Johto; ve a Candela), Héctor (en Luminalia, no se atreve a entrar en la Agencia: prepara su encuentro con Matière del B2), Philippe (casa en Novarte: semilla del sistema de base), Gaspar (en Yantra, quiere conocer a Brock; próximo destino Iris), Tobías (episodio 49; encuesta: Torre Bellsprout), Nate (en la playa de Yantra con Rhi).


## Estado tras el B2 (Publicación 3)

| Hilo | Estado tras el B2 | Siguiente paso (B3) |
|---|---|---|
| Tronco | Desvío manual (Ω-0-0-0); N-02 = nodo de Johto; Caramelos Lazo | **B3:** Ruinas Alfa (Nodo 02). Irene en persona. El jugador ata N-02 |
| Remanente Flare (Melia) | Traicionada: Lemnis paga a Flare y a Rocket | Según `b02_frag_*`: informante (melia), resentida o huida |
| Team Rocket (Protón, Atenea) | Pozo y Torre Quemada desmantelados; «la familia» | **B3:** Atlas (Kanto/Johto); los reclutas que se quedan sin «familia» |
| La primera llave (Lila) | En Trigal; se defendió sola | **B3:** Corelia llega a Trigal; Eevee → Sylveon |
| La delantera (Rhi) | Carta de su padre («está orgulloso»: algo pasa) | **B3:** Rhi llama a casa; Nate sabe algo |
| La heredera (Sera) | Según el fragmento; si trato roto, el Holomisor calla | **B3:** consecuencias |
| Letra pequeña (Bastien) | Cubierto/rompe/silencio recogidos; insignia de Noa | **B3:** combate en Kanto; su libreta de deudas |
| Las jaulas (Noa) | N-02 = una Puerta; muy asustada | **B3–B4:** filtra datos del Nodo 02 |
| Lana perdida / rancho (Aurelio) | 4 pistas de despedida plantadas | **B3: su pérdida** (biblia §9.2) |
| Recetario (Gaspar) | Menú de Johto | **B4:** duelo de cocina en Alola |
| ¡Transformación! (Héctor) | Conoció a Matière | **Acto V** |
| La flor eterna (A.Z.) | Advertencia en la Puerta | Una aparición por acto |
| Agencia | Caso del Miltank del tren resuelto | **B3:** caso en Kanto |
| Casos Fríos (Renata) | Testigo Dámaso Ferrán; Matías Olmedo | **B3:** Dámaso vuelve; Renata pide el sótano tapiado |
| Ámbar (Petra) | Se quedó en el Encinar con el Pachirisu dormido | **B3:** Petra y el Pachirisu; el ámbar y Celebi |
| Cabina (Ulises) | Primer indicio del Dialga joven (huellas) | **B3:** cruce con Celebi o misión de la cabina |
| Vencejos (Ysolde) | Trigal e Iris; registro del incendio de la Torre | **B3:** sede de los Vencejos |
| Irene | Runa «tomar» quemada (holomisor) | **B3:** en persona en Ruinas Alfa |
| **Dulce veneno (Kaori)** — nuevo | Antídoto parcial; tiene la muestra | **B3:** el antídoto avanza; necesita algo de Kanto |
| Lucien, Philippe, Remedios, Conde | Escenas del T0 | Lucien Acto VI; Philippe base; Remedios Día de Muertos 2027 |

## Estado tras el B3 (Publicación 4)

| Hilo | Estado | Siguiente paso (B4, Kanto) |
|---|---|---|
| Tronco | Nodo 02 identificado; señal de arranque probada en Caoba; datos hacia Azafrán | **B4:** Azafrán / Silph; el ingeniero «M.»; Cueva Celeste (Nodo de Kanto) |
| Team Rocket | Atlas preso, libre (quemar) o la familia dispersa | B4: consecuencias en Kanto (Giovanni nunca en persona) |
| Lila | Sylveon | Acto VI: su madre |
| Rhi | Padre despedido de Macro Cosmos | Acto VI |
| Bastien | Libreta (tachó una línea) | B4 |
| Noa | Le cambiaron la tarjeta: la vigilan | B4: más asustada; regalo a Bastien ya hecho |
| Aurelio | **Pérdida hecha** | Adela (3+ apariciones); el rebaño según la decisión |
| Renata | Prototipo de Trigal; publica o espera | Acto V |
| Ámbar / Cabina | Ulises en el lago: el pequeño asustado por la señal | Misión de la cabina (B4–B5) |
| Vencejos | Sede en Olivo; el jugador puede ser Pluma | B4: misión vertical en un edificio de Lemnis (Azafrán) |
| Kaori | Antídoto mejora con la muestra del lago | B4 |
| Las ondas (nuevo) | «M.» | B4 |
| Tobías | Torre Bellsprout hecha | B4 |
| Irene | Lección Unown, DAR/TOMAR | Acto VII |
