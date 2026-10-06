# BLOQUE 3: "ACTO II · LO QUE EL TIEMPO SE LLEVÓ" (plan detallado)

> **Región:** Johto (de Ciudad Iris al este y al oeste): Ciudad Malva, Torre Bellsprout, Ruta 32, **Ruinas Alfa** · Ciudad Trigal (gimnasio de intercambio) · Rutas 38-39, Granja MuuMuu, **Ciudad Olivo** y su Faro · Ruta 42 (este), **rancho de Aurelio**, **Monte Mortero**, **Pueblo Caoba**, Ruta 43, **Lago de la Furia** y la **guarida Rocket**.
> **Duración meta:** ~12 h.
> **Inicio:** al terminar el B2 (`flag.b02_fin`, el jugador está en Ciudad Iris). Spot en Iris «📨 Un mensaje de la Dra. Solberg» y `onEnter` en Iris (en `comun.js`) → guion `b03_inicio` (lo escribe T0).
> **Flag final:** `b03_fin`. **Aviso de ritmo:** `b03_m_aviso`, al entrar por primera vez en Pueblo Caoba (quedan ~3 h).
> **Prefijo de ids:** `b03_` en flags, misiones y guiones de historia.
> **Escrito:** 2026-10-05 noche (sesión de día, a petición de Mario). Mario iba por el final del B1.

## 0. Lo que pasa, en una frase por tramo

| Tramo | Archivo | Qué pasa | Duración |
|---|---|---|---|
| T0 | `t0-ruinas.js` | Irene llama: «las runas de "tomar" están por todo Johto». Ciudad Malva y la **Torre Bellsprout** (el show de Tobías, «la mazmorra de esta temporada»). **Ruinas Alfa:** Irene en persona; Lemnis excava «por patrimonio»; los Unown forman palabras; **N-02 es este sitio** (el jugador lo descubre: «Nodo 02»). Riolu/Lucario lee la cámara sellada. | ~3 h |
| T1 | `t1-faro.js` | Vuelta a Trigal: **Corelia** llega como líder de intercambio (medalla 6). **Lila**: su Eevee evoluciona a **Sylveon** por vínculo. Renata y Dámaso: el **sótano tapiado** del Tren Magnético (el prototipo de Puerta). Rutas 38-39 y la **Granja MuuMuu**. **Ciudad Olivo:** el Ampharos del Faro está **apagado** (drenaje). **Yasmina** (medalla 7). Kaori llega con el antídoto en pruebas. | ~3 h 30 |
| T2 | `t2-rancho.js` | **La pérdida de Don Aurelio** (biblia §9.2): llegas tarde al rancho; carta (`read`); decisión del rebaño. Copito te reconoce. Monte Mortero. Pueblo Caoba. | ~2 h 30 |
| T3 | `t3-caoba.js` | Lago de la Furia: el **Gyarados rojo** y unas ondas que obligan a evolucionar a los Magikarp. La **guarida Rocket** de Caoba: **Atlas** y lo que queda de «la familia»; prueba final de que Lemnis paga. Lance (canon) ayuda. **Decisión de los Rocket.** Final: el hilo apunta a **Kanto**. | ~3 h |

## 1. Curva de niveles

Al empezar el B3 el tope es 42 (fin del B2).

| Tramo | Salvajes | Entrenadores | Jefe | Tope |
|---|---|---|---|---|
| T0 Malva, Torre Bellsprout, Ruta 32, Ruinas Alfa | 36–41 | 38–42 | Sabio Li (Torre, 3 Pokémon, as 42) · Tobías (opcional, as 41) | 42 |
| T1 Gimnasio Trigal | — | 40–42 | **Corelia** (Lucha, intercambio): 5 Pokémon, as 44, **Mega-Lucario** (ella ya puede: ya la venciste) | 42 → **46** |
| T1 Rutas 38-39, Olivo | 38–43 | 41–44 | Rival opcional (Rhi o Bastien, as 45) | 46 |
| T1 Gimnasio Olivo | — | 42–44 | **Yasmina** (Acero): 5 Pokémon, as 46 (Steelix) | 46 → **48** |
| T2 Ruta 42 este, Monte Mortero, Caoba | 40–45 | 43–46 | — | 48 |
| T3 Ruta 43, Lago de la Furia | 42–46 | 44–47 | Gyarados rojo nv 47 (fijo, capturable, variocolor) | 48 |
| T3 Guarida Rocket | 43–46 | Reclutas 44–47 | **Atlas** (jefe de trama, 5 Pokémon, as 49, 2 objetos) | 48 → **50** al final |

**Zonas de entrenamiento:** Malva («Patio de la Torre», tope 41) · Olivo («Muelle», tope 45) · Caoba («Tienda de recuerdos» de canon con trastienda, tope 47).
**Respuestas claras:** Corelia (Lucha) → Volador/Psíquico/Hada (Gallade, Sylveon no es del jugador; Togekiss/Natu/Xatu de la Ruta 32-36); Yasmina (Acero) → Fuego, Lucha (Lucario), Tierra; Atlas (Siniestro/Veneno: Houndoom, Weezing, Golbat/Crobat, Arbok…) → Lucha (Lucario brilla), Tierra, Psíquico contra los Veneno.

## 2. Decisiones del B2 que se recogen

| Decisión B2 | Dónde |
|---|---|
| **Fragmento** `b02_frag_handsome` / `b02_frag_sera` / `b02_frag_melia` | T0 (Ruinas: Lemnis tiene o no la pieza; si `melia`, Melia aparece en las Ruinas como informante con la tarjeta negra) y T3 (Handsome: si `handsome`, el fragmento «se ha extraviado» en la custodia de Lebrun: pista del topo). Con `b02_frag_sera`, Sera manda un regalo frío y útil. Si había trato y no se lo diste, el Holomisor está en silencio (Sera rompió el trato). |
| Cetoddle `b02_cetoddle` | T1 (Olivo, mar frío; Noa pregunta por «Escarcha») |
| Aurelio `b02_ampharos` (Faro) / `b02_mareep_rosa` | T1 (el Ampharos del Faro de Olivo se llama **Amphy** en canon; Faro, el de Aurelio, lo reconoce) y T2 (la pérdida) |
| Furgoneta `b02_furgoneta_*` | T0: en Malva te reciben «el de Azalea» si te presentaste; si te escondiste, no saben |
| Lila `b02_lila_protegida` | T1: si la protegiste, Sylveon evoluciona igual, pero ella te pide que esta vez no intervengas |
| Kaori `b02_kaori_*` | T1/T3 |
| Lucien `b02_lucien_*` | Una llamada o carta (T1 o T2) |
| Crómlech `b01_*` | Ramas mínimas donde se mencione Lemnis |

## 3. Hilos que avanza (≥3) y el nuevo

| Hilo | Tramo | Qué pasa |
|---|---|---|
| **Tronco** | T0, T3 | **Nodo 02 = Ruinas Alfa** (el jugador ata N-02). Excavación de Lemnis «de patrimonio». Riolu/Lucario lee la cámara sellada: un mural de una máquina-flor y Unown que forman **«DAR / TOMAR»** (eco de las runas de la Torre Maestra y la Torre Quemada). T3: los Rocket emiten desde Caoba una señal que «despierta» la energía de los Pokémon (Lago de la Furia) por encargo de la Fundación Raíces: es una **prueba de campo** para el nodo. |
| Team Rocket (Atlas) | T3 | El último refugio de «la familia». Atlas es duro pero tiene su motivo (deudas, gente tirada). **Decisión:** entregar a Atlas a la policía, dejar que los reclutas se vayan (`b03_rocket_libres`), o ayudar a Atlas a quemar la información de la Fundación para que Lemnis no se entere de que la descubriste (`b03_rocket_quemar`) — o entregarlo con todo (`b03_rocket_policia`). |
| La primera llave (Lila) | T1 | Eevee → **Sylveon** por vínculo cuando ella se defiende sola en el combate de Corelia. Momento con el jugador. |
| La delantera (Rhi) | T1 o T2 | Llama a casa: su padre está enfermo (no grave) o ha perdido el trabajo en Macro Cosmos («está orgulloso» = se está despidiendo de algo). Combate opcional `rhi_4`. Prepara el Acto VI. |
| Letra pequeña (Bastien) | T1 | Combate opcional `bastien_4` en Olivo; su libreta de deudas; la insignia de Noa. |
| Las jaulas (Noa) | T1/T2 | Noa filtra datos del Nodo 02. **Pista del Diario del B3:** la entrada de ese día la llama **«la doctora Lambert»** (Noa nunca dijo que fuera doctora; el jugador nunca lo supo). Sin comentarlo. |
| **Aurelio (pérdida)** | T2 | Ver §5. |
| Casos Fríos (Renata) | T1 | Renata y Dámaso en el sótano tapiado de la estación: un despacho con el nombre **Matías Olmedo** y una taza; planos del prototipo con la lemniscata en una esquina. Renata quiere contarlo en el pódcast; el jugador decide si le da las pruebas ya o le pide esperar (`b03_renata_publica` / `b03_renata_espera`). |
| Ámbar (Petra) | T0 | Petra en las Ruinas Alfa (el Pachirisu ya despertó, la sigue). El ámbar late cerca de la cámara sellada. |
| Cabina (Ulises) | T0 o T3 | Aparece en el Lago de la Furia o en las Ruinas: el «pequeñito que late a destiempo» está asustado por las ondas. Se acerca la misión de la cabina (B4–B5). |
| Vencejos (Ysolde) | T1 | Ysolde te invita a su **sede** (un tejado de Olivo junto al Faro): rangos, una prueba de altura (salto de fe al mar). Te nombra **Pluma** si aceptas (`b03_vencejo_pluma`). |
| Show de Tobías | T0 | Torre Bellsprout = «la mazmorra de esta temporada». Duquesa desprecia a todos. |
| Kaori | T1, T3 | Llega a Olivo con el antídoto en pruebas para el Ampharos del Faro: funciona a medias. En T3 necesita una muestra de las ondas o del agua del Lago. |
| Melia | T0 o T3 | Según `b02_frag_*`. |
| Irene | T0 | En persona por fin: la escritura Unown; te enseña a leer una palabra; afinidad. |
| Gaspar | T2 | En Caoba, el Caramelo Furia (canon) «mal hecho»; mini-misión. |
| A.Z. | T3 | Una aparición (por acto): en la orilla del Lago de la Furia, de noche, sin explicar cómo llegó a Johto. |
| **NUEVO: Las ondas** (`b03_t_ondas`) | T3 | La señal de Caoba: quién la diseñó (un ingeniero de Lemnis que firma «M.» — **no** es Matías: es otro) y adónde iban los datos. Continúa en Kanto. |

## 4. Pistas del Diario (calendario de la biblia §7, B3)

- **«La doctora Lambert»** (T1 o T2): la entrada del día en que Noa te pasa datos la llama «doctora». Nunca se le dijo al jugador. No lo comentes.
- Nada de interferencias «bzzt… sincronizando» (eso es del B4).

## 5. La pérdida de Don Aurelio (biblia §9.2)

- **Pistas ya plantadas en el B2:** tos, «ya no estoy para estos trotes», «¿quién cuida de un rancho…?», Faro «por si acaso», cuaderno «¿Quién?».
- **Cómo pasa (T2):** tras la medalla 7, una llamada de **su sobrina** (OC nueva, con nombre y voz; 3+ apariciones futuras): «Mi tío quería verte.» Llegas al rancho y ya es tarde: murió de viejo, en paz, en su mecedora mirando el rebaño. Fuera de plano. Nada gráfico.
- **Carta** (`cartaaurelio`, `read`): de su puño y letra, escrita «por si acaso». Habla del rebaño, de Copito, de que el viaje por la Fisura le dejó cansado «como si me hubieran quitado unos años» (pista del drenaje, sin explicar). Frase final ranchera y tierna.
- **Copito** reconoce al jugador y no se separa de él durante la escena.
- **Decisión del rebaño** (sin respuesta correcta):
  - La sobrina se queda el rancho (`b03_rancho_sobrina`): sigue la tradición; aparecerá en el futuro.
  - El jugador «se queda» con el rancho (`b03_rancho_jugador`): la sobrina lo cuida, pero el rancho es del jugador (semilla del sistema de base, como Philippe); el jugador recibe a **Copito** si quiere.
  - Lemnis «ofrece ayuda» (`b03_rancho_lemnis`): un agente muy amable ofrece «cuidar del rebaño» con fondos de la Fundación… si se acepta, el rebaño se salva del cierre por deudas, pero lleva la lemniscata. Consecuencia en bloques futuros.
- **Duelo que dura:** el hueco se nota (la mecedora vacía), entrada del Diario (el Eco escribe el duelo; tierno), un recuerdo coleccionable (`art` o `read`), y Faro/Candela del jugador reaccionan si están en el equipo.
- **Humor:** nada en la misma escena. Vuelve poco a poco en Caoba.

## 6. Referencias escondidas

- **Torre Bellsprout + Tobías:** reality show en mazmorra (ya establecida); un «patrocinador» le manda un objeto ridículo.
- **Ruinas Alfa + Irene:** la torre de lenguas y la traducción como poder (*Babel*), sutil.
- **Faro de Olivo:** «quiere usted…» no; un faro que alumbra a quien se pierde (*BioShock Infinite*, faros), muy sutil.
- **Ysolde:** rangos de la hermandad y salto de fe al mar (ya establecida).
- **Caoba:** la tienda de recuerdos que esconde la guarida (canon) + «el agujero del donut» para una deducción (*Knives Out*), sutil.
- **Atlas:** «la familia» (*Yozakura*, ya establecida).

## 7. Colección

- `gather`: 4–6 puntos nuevos (bayas de la Ruta 32, Bonguris, orilla de Olivo, setas del Monte Mortero, orilla del Lago de la Furia).
- `read`: carta de Aurelio (T2), mensaje Unown traducido por Irene (T0), plano del prototipo (T1), registro de las ondas (T3).
- `art`: el rancho al atardecer con la mecedora vacía (T2), o el Faro de Olivo de noche (T1).

## 8. Contratos

Ver `b03-encargo.md`.
