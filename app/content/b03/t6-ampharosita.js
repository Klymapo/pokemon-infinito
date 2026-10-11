// Bloque 3 · Pieza 6 (Publicación 6): «La luz de Candela» (~40 min).
// Faro de Olivo, después de vencer a Yasmina (sirve para quien sigue en Olivo y para quien ya pasó el B3).
// La lente del Faro gira a tirones: la maquinaria de abajo (contrapesos y engranajes) lleva años sin tocarse.
// Dos puzles de rejilla en la sala de máquinas (fácil y medio). Al final, un Mareep, Flaaffy o Ampharos del jugador
// enciende la lente junto a Amphy, la lente da la vuelta entera y suelta lo que el farero guardaba en su eje:
// la Ampharosita. Combate amistoso opcional con Yasmina después.
// Ojo con la continuidad: Amphy NO se cura (eso es el hilo de Kaori). La luz llega más lejos porque la lente
// vuelve a girar bien, no porque Amphy esté mejor.

const LINEA = '(inParty("mareep") || inParty("flaaffy") || inParty("ampharos"))';
const RL = '(inParty("riolu") || inParty("lucario"))';
const ABIERTA = 'beat("yasmina_g7")';

export default {
	// =====================================================================
	// LUGAR NUEVO (sub-área del Faro)
	// =====================================================================
	locations: {
		faro_maquinas: {
			name: 'Sala de máquinas del Faro', parent: 'faro_olivo', kind: 'building',
			bg: { type: 'indoor', wall: '#3a3f52', floor: '#2a2620' },
			desc: 'Bajo la linterna, por una trampilla y una escalerilla de hierro, hay un cuarto redondo que huele a aceite viejo y a sal. Del techo cuelgan cadenas. En el suelo, **contrapesos** de plomo del tamaño de una maleta. Al fondo, una **caja de engranajes** enorme, con dientes de bronce verdes de humedad.\n\nEn la pared, una placa de latón: «NO TOCAR NADA. — El farero». Debajo, con otra letra, más pequeña: «Yasmi, eso va por ti».',
			descs: [
				{ cond: 'flag.b03_amphita_sala2', text: 'La sala de máquinas del Faro. Las cadenas bajan y suben despacio, sin un crujido, y los engranajes de bronce giran con un tic-tac grave, como un reloj de pared muy grande. Arriba, a través del techo, se oye la lente dar la vuelta.\n\nLa placa de latón sigue ahí: «NO TOCAR NADA». Alguien ha tocado. Para bien.' },
				{ cond: 'flag.b03_amphita_sala1', text: 'Bajo la linterna, un cuarto redondo que huele a aceite y a sal. Los **contrapesos** ya cuelgan donde deben y las cadenas están tensas. Pero la **caja de engranajes** del fondo sigue trabada: cada pocos segundos da un «clac» y se queda quieta.\n\nEn la pared, la placa de latón: «NO TOCAR NADA. — El farero».' },
			],
			mapNote: 'Contrapesos y engranajes del Faro',
			onEnter: [{ script: 'b03_amphita_llegada', cond: '!flag.b03_amphita_llegada', once: true }],
			spots: [
				{ label: 'Los contrapesos', sub: 'Bloques de plomo tirados por el suelo', icon: '⛓️', cond: '!flag.b03_amphita_sala1', new: 'true', talk: [{ script: 'b03_amphita_sala1' }] },
				{ label: 'La caja de engranajes', sub: 'Da un «clac» y se queda quieta', icon: '⚙️', cond: 'flag.b03_amphita_sala1 && !flag.b03_amphita_sala2', new: 'true', talk: [{ script: 'b03_amphita_sala2' }] },
				{ label: 'El eje de la lente', sub: 'Sube por el techo hasta la linterna', icon: '🔩', cond: 'flag.b03_amphita_sala2', talk: [{ script: 'b03_amphita_eje' }] },
				{ label: 'Cajón de herramientas del farero', sub: 'Lleno de cosas que nadie ha ordenado en años', icon: '🧰', cond: 'flag.b03_amphita_sala1', action: { gather: 'b03_amphita_cajon' } },
				{ label: 'La placa de latón', sub: '«NO TOCAR NADA»', icon: '🪧', talk: [{ script: 'b03_amphita_placa' }] },
			],
		},
	},

	// =====================================================================
	// SPOTS EN EL FARO DE OLIVO (mismo bloque)
	// =====================================================================
	extraSpots: {
		faro_olivo: [
			{ label: 'La lente de la linterna', sub: 'Gira a tirones. Clac. Clac', icon: '🔦', cond: ABIERTA + ' && !flag.b03_amphita_visto', new: 'true', talk: [{ script: 'b03_amphita_inicio' }] },
			{ label: 'Bajar a la sala de máquinas', sub: 'Una trampilla bajo la lente', icon: '🪜', cond: 'flag.b03_amphita_visto', new: '!flag.b03_amphita_sala2', action: { go: 'faro_maquinas' } },
			{ label: 'Encender la lente con Yasmina', sub: 'La maquinaria ya gira. Falta la chispa', icon: '💡', cond: 'flag.b03_amphita_sala2 && !flag.b03_amphita_hecho', new: LINEA, talk: [{ script: 'b03_amphita_chispa' }] },
			{ label: 'Un combate amistoso con Yasmina', sub: 'Amphy mira desde la manta', icon: '🍵', cond: 'flag.b03_amphita_hecho && !beat("b03_amphita_yasmina")', new: 'true', talk: [{ script: 'b03_amphita_duelo' }] },
			{ label: 'Los dos faros', sub: 'Amphy, junto a la lente', icon: '✨', cond: 'flag.b03_amphita_hecho', talk: [{ script: 'b03_amphita_despues' }] },
		],
	},

	// =====================================================================
	// MISIÓN
	// =====================================================================
	quests: {
		b03_s_ampharosita: { name: 'Una luz que enciende otra', type: 'side', est: 40, stages: {
			contrapesos: 'Baja a la **sala de máquinas** del **Faro de Olivo** (la trampilla bajo la lente) y coloca los contrapesos.',
			engranajes: 'En la sala de máquinas del **Faro de Olivo** queda la **caja de engranajes** trabada. Destrábala.',
			chispa: 'La maquinaria del **Faro de Olivo** ya gira. Sube a la linterna con un Mareep, un Flaaffy o un Ampharos en el equipo y habla con **Yasmina**.',
			hecha: 'La lente del Faro de Olivo vuelve a dar la vuelta entera. Y Yasmina te dio lo que el farero guardaba en el eje.',
		} },
	},

	// =====================================================================
	// ENTRENADOR (combate amistoso, opcional)
	// =====================================================================
	trainers: {
		b03_amphita_yasmina: { name: 'Yasmina', cls: 'Líder', npc: 'yasmina', ai: 3, iv: 25, reward: 2400, bg: 'tower', terrain: 'city',
			team: [
				{ sp: 'magnezone', lv: 46, moves: ['flashcannon', 'spark', 'triattack', 'supersonic'], ability: 'sturdy', item: 'oranberry', nature: 'modest' },
				{ sp: 'bronzong', lv: 46, moves: ['gyroball', 'extrasensory', 'payback', 'confuseray'], ability: 'levitate', nature: 'relaxed' },
				{ sp: 'steelix', lv: 47, moves: ['ironhead', 'dig', 'rockslide', 'crunch'], ability: 'rockhead', item: 'sitrusberry', nature: 'impish' },
			],
			intro: 'Eh… combate amistoso. Sin medalla. Sin nervios. Bueno, nervios un poco. Amphy, tú mira.',
			win: 'Ha sido… bonito. Como ver dos faros a la vez. Gracias.',
			lose: 'Lo siento. Ha sido sin querer. Bueno, no. Pero lo siento igual.' },
	},

	// =====================================================================
	// OBJETOS Y RECOLECCIÓN
	// =====================================================================
	items: {
		paginafaro: { name: 'Página suelta de la bitácora', pocket: 'key', desc: 'Una hoja arrancada de un cuaderno de tapas de hule, doblada en cuatro y metida en una lata de tabaco vacía. Letra grande y torcida.',
			read: '*(Letra grande y torcida. Tinta antigua, corrida en una esquina por la humedad.)*\n\nEsto no va en la bitácora, porque no es del mar. Es de Amphy.\n\nLa noche de la tormenta grande, cuando Amphy era una Mareep que no me llegaba a la rodilla, la marea dejó en la playa una piedra redonda. Amphy no la soltaba. Se pasó la noche con la cola pegada a ella, encendiéndose y apagándose, como si se hablaran.\n\nLa llevé a un señor de Kalos que sabía de piedras. Me dijo lo que era y para qué servía. Que con ella un Ampharos se vuelve otra cosa en combate. Más grande. Más fuerte. Con luz hasta en la lana.\n\nSe la ofrecí a Amphy. No la quiso. Amphy no es de pelear. Es de alumbrar. Lo he sabido siempre.\n\nAsí que la he puesto en el eje de la lente, en el corazón del Faro, donde Amphy la vea cada noche al dar la vuelta. Si un día sube alguien con un Ampharos que pelee por alguien a quien quiere, que la lente dé la vuelta entera y que se la lleve. Una luz así no se guarda en una caja.\n\nY si eres tú, Yasmi: no toques nada. Pero si tocas, toca bien.' },
	},
	gather: {
		b03_amphita_cajon: {
			name: 'Cajón de herramientas del farero', icon: '🧰', hours: 24, picks: [1, 2],
			text: 'Revuelves entre llaves inglesas, latas de grasa, bombillas de repuesto y una armónica sin tapa. Algo aprovechable aparece siempre.',
			wait: 'Ya lo revolviste todo. Yasmina dice que el abuelo dejaba cosas en el cajón «para cuando hicieran falta». Mañana harán falta otras.',
			table: [
				{ id: 'cellbattery', w: 16, n: [1, 1] },
				{ id: 'magnet', w: 8, n: [1, 1] },
				{ id: 'thunderstone', w: 5, n: [1, 1] },
				{ id: 'metalcoat', w: 3, n: [1, 1] },
			],
		},
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// ---------- Gancho: la lente gira a tirones ----------
		b03_amphita_inicio: [
			{ set: { 'flag.b03_amphita_visto': true } },
			{ text: 'La lente enorme de la linterna gira. Más o menos. Avanza un palmo, se para con un **clac** que retumba en toda la torre, tiembla, y vuelve a avanzar. El haz de Amphy sale a trompicones: un rato hacia el mar, un rato contra el techo.' },
			{ say: 'yasmina', text: 'Eh… lo has notado. —Se encoge un poco—. Lo siento. Es la lente. No es Amphy. Bueno, Amphy también. Pero esto es la lente.' },
			{ say: 'yasmina', text: 'La boticaria dijo que Amphy está… a medias. Que el frasco lo sostiene y ya. Lo sé. Lo apunto todos los días en la bitácora.' },
			{ say: 'yasmina', text: 'Pero la luz que da, poca o mucha, se pierde. La mitad se va al techo. El abuelo hacía girar la lente con la maquinaria de abajo: contrapesos, cadenas, engranajes. Desde que dejó de subir, nadie la toca.' },
			{ text: 'Señala una trampilla de hierro en el suelo, junto a la manta de Amphy. Tiene un candado abierto colgando, oxidado, como si alguien lo hubiera quitado hace mucho y luego no se hubiera atrevido a más.' },
			{ say: 'yasmina', text: 'Yo nunca he bajado. El abuelo siempre decía: «No toques nada, Yasmi». Y yo… le hice caso. Mucho caso. Demasiado caso.' },
			{ prompt: 'Yasmina mira la trampilla como quien mira un pozo.', choice: [
				{ text: '«Bajo yo. Tú quédate con Amphy.»', then: [
					{ say: 'yasmina', text: '¿De verdad? —Se le escapa una sonrisa que corrige enseguida—. Perdón. No debería alegrarme de que bajes tú. Pero me alegro. Un poco.' },
				] },
				{ text: '«¿Y si bajamos los dos?»', then: [
					{ say: 'yasmina', text: 'Eh… —Mira a Amphy. Amphy la mira a ella—. No puedo dejarlo solo. Todavía no. Pero te grito desde aquí lo que me acuerde. Grito bajito, ¿eh? Lo siento de antemano.' },
				] },
				{ text: '«Si tu abuelo dijo que no tocaras, a lo mejor era por algo.»', then: [
					{ say: 'yasmina', text: 'Era por algo. Era porque yo tenía seis años y me metía en todas partes. —Casi se ríe—. Ahora tengo… más. Y tú no tienes seis.' },
				] },
			] },
			{ say: 'yasmina', text: 'Los contrapesos tienen que ir sobre las placas del suelo. Eso lo sé porque el abuelo lo decía cantando. «Plomo en su placa, cadena tirante, la lente que gire y el barco adelante». No rima muy bien. Él decía que sí.' },
			{ quest: 'b03_s_ampharosita', stage: 'contrapesos' },
		],

		// ---------- Llegada a la sala de máquinas (una vez) ----------
		b03_amphita_llegada: [
			{ set: { 'flag.b03_amphita_llegada': true } },
			{ text: 'La escalerilla de hierro baja a la oscuridad. Abajo hace frío y huele a aceite viejo, a sal y a algo dulce, como a cobre.' },
			{ if: 'has("farollana")', then: [
				{ text: 'Sacas el **Farol de Lana** y lo frotas contra la manga. *Chss.* La luz amarilla se abre en círculo: cadenas que cuelgan del techo, bloques de plomo tirados por el suelo y, al fondo, la boca dentada de una caja de engranajes.' },
				{ text: 'Desde arriba, por la trampilla, se oye un «pa» bajito. Amphy ha visto la luz. Y la ha reconocido como luz de la buena.' },
			], else: [
				{ if: RL, then: [
					{ text: '{riolu} se adelanta. El aura se le enciende en las palmas, azul, y alumbra lo justo: cadenas que cuelgan del techo, bloques de plomo por el suelo y, al fondo, la boca dentada de una caja de engranajes.' },
				], else: [
					{ text: 'Yasmina te pasa una linterna de pilas por la trampilla. Alumbra poco y a ratos, pero alumbra: cadenas que cuelgan del techo, bloques de plomo por el suelo y, al fondo, la boca dentada de una caja de engranajes.' },
				] },
			] },
			{ if: RL, then: [
				{ text: '{riolu} pone una mano en la pared curva y cierra los ojos. Luego mira hacia arriba, hacia donde está Amphy, y después hacia la caja de engranajes. Como si siguiera un hilo que va de uno a otra.' },
			] },
			{ say: 'yasmina', as: 'Voz desde arriba', text: '¿Estás bien? ¿Hay… hay ratas? El abuelo decía que no había ratas. Lo decía muy deprisa.' },
		],

		b03_amphita_placa: [
			{ text: 'Una placa de latón atornillada a la pared, verde en los bordes: «**NO TOCAR NADA. — El farero**».' },
			{ text: 'Debajo, grabado con la punta de un clavo, más pequeño: «Yasmi, eso va por ti».' },
			{ text: 'Y debajo de eso, más pequeño todavía, casi borrado: «Bueno. Cuando seas mayor, toca. Pero toca bien».', cond: 'flag.b03_amphita_sala1' },
		],

		// ---------- Sala 1: los contrapesos (fácil) ----------
		b03_amphita_sala1: [
			{ text: 'Las placas de hierro del suelo tienen marcas de rozaduras: ahí iba el plomo. Los contrapesos están tirados donde los dejó el último temblor, o el último descuido.' },
			{ say: 'yasmina', as: 'Voz desde arriba', text: '«Plomo en su placa…». ¡Eso! Creo que con una basta para abrir la reja de la cadena. Creo. Lo siento si no.', cond: '!flag.b03_amphita_sala1_intento' },
			{ set: { 'flag.b03_amphita_sala1_intento': true } },
			{ puzzle: {
				id: 'b03_amphita_contrapesos',
				title: 'Los contrapesos',
				hint: 'Un contrapeso sobre la placa abre la reja de la cadena. Llega hasta la cadena para tensarla.',
				theme: 'lab',
				grid: [
					'#######',
					'#P..#.#',
					'#.R.#.#',
					'#....D#',
					'#S..#G#',
					'#######',
				],
			}, onSolve: [
				{ set: { 'flag.b03_amphita_sala1': true } },
				{ text: 'El plomo encaja en su placa con un golpe sordo. La reja se abre. Tiras de la cadena con las dos manos y, arriba, en el techo, algo se tensa: un gruñido largo de hierro que sube por la torre.' },
				{ text: 'El «clac» de la lente se oye distinto. Más espaciado. Más perezoso.' },
				{ say: 'yasmina', as: 'Voz desde arriba', text: '¡Se ha…! Eh, perdón. Se ha movido algo. Mucho mejor. Bueno. Un poco mejor. Pero mejor.' },
				{ quest: 'b03_s_ampharosita', stage: 'engranajes' },
			], onQuit: [
				{ text: 'Te sientas en la escalerilla a mirar los bloques un rato. Los contrapesos no se van a ir a ningún sitio. Llevan años sin irse.' },
			] },
		],

		// ---------- Sala 2: la caja de engranajes (media) ----------
		b03_amphita_sala2: [
			{ text: 'La caja de engranajes es casi tan alta como tú. Por dentro, entre los dientes de bronce, hay bloques de plomo caídos, un hueco en el suelo donde se rompió una tabla y dos placas de presión que sueltan el freno del eje.' },
			{ text: 'Al fondo, una portezuela da al eje central de la lente. Para llegar hay que soltar el freno y tapar el hueco.' },
			{ if: RL, then: [{ text: '{riolu} mira la caja con la cabeza ladeada, y luego te mira a ti. Algo hay ahí dentro que no es solo hierro. Lo nota.' }], cond: '!flag.b03_amphita_sala2_intento' },
			{ set: { 'flag.b03_amphita_sala2_intento': true } },
			{ puzzle: {
				id: 'b03_amphita_engranajes',
				title: 'La caja de engranajes',
				hint: 'Las dos placas sueltan el freno de la portezuela. El hueco del suelo se tapa empujando un bloque dentro.',
				theme: 'lab',
				grid: [
					'########',
					'#P.....#',
					'#S.R#R.#',
					'#.R....#',
					'#....S.#',
					'###H####',
					'###D####',
					'###G####',
				],
			}, onSolve: [
				{ set: { 'flag.b03_amphita_sala2': true } },
				{ text: 'El freno se suelta con un chasquido. Los engranajes, de golpe, giran. Primero uno, luego otro, luego todos, con un tic-tac grave que te sube por los pies. Arriba, la lente deja de hacer «clac».' },
				{ text: 'Pero no da la vuelta entera. Llega a la mitad, se queda quieta un segundo y vuelve atrás. Le falta fuerza.' },
				{ text: 'Detrás de la portezuela, atada con alambre al eje central, hay una lata de tabaco vacía. Dentro, una hoja doblada en cuatro.' },
				{ give: 'paginafaro' },
				{ text: 'Y en el eje, justo donde sube hacia la linterna, una cuna de latón cerrada, del tamaño de un puño. Está encajada en el mecanismo. Por la rendija se escapa una luz que no es la de Amphy.' },
				{ say: 'yasmina', as: 'Voz desde arriba', text: '¡Gira! ¡Bueno, casi! Amphy se ha levantado a mirar. —Pausa—. ¿Puedes subir? Creo que ya sé lo que falta. Bueno. Creo que lo sabe Amphy.' },
				{ quest: 'b03_s_ampharosita', stage: 'chispa' },
			], onQuit: [
				{ text: 'Te limpias la grasa de las manos en el pantalón. Los engranajes llevan años esperando. Pueden esperar un poco más.' },
			] },
		],

		b03_amphita_eje: [
			{ if: '!flag.b03_amphita_hecho', then: [
				{ text: 'El eje central sube por el techo hacia la linterna. A media altura, la cuna de latón: cerrada, encajada, con una luz que se escapa por la rendija. No se puede abrir desde aquí. Solo se abriría si la lente diera la vuelta entera.' },
			], else: [
				{ text: 'El eje central gira despacio, sin un ruido. La cuna de latón está abierta y vacía, y da la vuelta con él, una y otra vez, como un reloj que ya no tiene nada que guardar.' },
			] },
		],

		// ---------- La chispa: dos Ampharos y una lente ----------
		b03_amphita_chispa: [
			{ if: '!' + LINEA, then: [
				{ say: 'yasmina', text: 'La maquinaria ya gira. Lo has oído. Pero la lente se queda a la mitad. Amphy solo… no llega. No tiene bastante.' },
				{ say: 'yasmina', text: 'El abuelo decía que una luz enciende a otra. Que por eso los faros se ven de lejos: para que otro faro conteste.' },
				{ say: 'yasmina', text: '¿Tienes… algún Pokémon de lana? Un Mareep. Un Flaaffy. Un Ampharos. Con uno basta. Amphy se pondría contento. Yo también. —Se ruboriza—. Pero lo de Amphy importa más.' },
				{ text: 'Amphy, en la manta, te mira la cintura, donde llevas las Poké Balls. Busca algo. No lo encuentra. Suelta un «pa» muy bajito, sin reproche, y vuelve a mirar el mar.' },
				{ say: 'yasmina', text: 'No hay prisa. Amphy y yo no nos vamos a ninguna parte. Hago té.' },
				{ quest: 'b03_s_ampharosita', stage: 'chispa' },
				{ end: true },
			] },
			{ say: 'yasmina', text: 'La maquinaria ya gira. Pero la lente se queda a la mitad. Amphy solo no llega.' },
			{ say: 'yasmina', text: 'El abuelo decía que una luz enciende a otra. —Te mira el cinturón—. ¿Nos… nos prestas a alguien?' },
			{ prompt: '¿Quién se acerca a Amphy?', choice: [
				{ text: 'Candela.', cond: 'flag.b01_candela_unida', then: [{ set: { 'flag.b03_amphita_candela': true } }] },
				{ text: 'Faro, el de Don Aurelio.', cond: 'flag.b02_ampharos && inParty("ampharos")', then: [{ set: { 'flag.b03_amphita_faro': true } }] },
				{ text: 'Tu Pokémon de lana.', then: [] },
			] },
			// --- Candela ---
			{ if: 'flag.b03_amphita_candela', then: [
				{ text: 'Candela sale de su Poké Ball, mira la sala de la linterna, mira la lente enorme, mira a Amphy… y se pega a tu pierna.' },
				{ text: 'Te acuerdas de Don Aurelio, en Kalos: «Candela le tenía miedo a la oscuridad». Aquí arriba no está oscuro. Pero es muy alto, y la lente es muy grande, y Amphy es muy viejo.' },
				{ text: 'Amphy se levanta despacio. Le cuesta. Cruza la sala con pasos cortos y se agacha delante de Candela, hasta ponerse a su altura. Le junta la frente con la frente. Se quedan así un rato. Como un abuelo que saluda a una nieta que no conocía.' },
				{ text: 'Candela deja de esconderse.' },
			] },
			// --- Faro ---
			{ if: 'flag.b03_amphita_faro', then: [
				{ text: 'Faro sale de su Poké Ball con esos pasos de abuelo tranquilo que aprendió en el rancho. Amphy ya está de pie, esperándolo junto a la lente.' },
				{ text: 'Amphy enciende la cola: dos destellos largos y uno corto. Faro contesta igual. Dos largos. Uno corto.' },
				{ say: 'yasmina', text: 'Eso… eso lo hacía el abuelo con el farol, desde aquí arriba, cuando veía venir a alguien conocido por el camino de la costa. Quería decir «todo en orden».' },
				{ if: 'flag.b03_aurelio_muerto', then: [
					{ text: 'Faro gira la cabeza hacia el este. Hacia la Ruta 42, hacia un porche con una mecedora que ahora se mueve sola cuando sopla el viento. Se queda mirando un momento. Luego vuelve a mirar a Amphy, y repite la señal. Dos largos. Uno corto. Todo en orden.' },
					{ text: 'Yasmina no pregunta. Se sienta en el suelo junto a Faro y le pone la mano en la lana, sin decir nada. Es lo que mejor sabe hacer.' },
				] },
			] },
			// --- Genérico ---
			{ if: '!flag.b03_amphita_candela && !flag.b03_amphita_faro', then: [
				{ text: 'Tu Pokémon de lana sale de su Poké Ball y se queda mirando la lente enorme con la boca abierta. Amphy se levanta despacio, cruza la sala con pasos cortos y lo olfatea, de arriba abajo, muy serio. Luego le pone una mano en la cabeza.' },
				{ text: 'Ya está. Examen aprobado.' },
			] },
			{ say: 'yasmina', text: 'Las colas. Que se toquen las colas. El abuelo decía que los faros se encienden mirándose. Con los Ampharos… creo que es igual. Bueno. Lo sé.' },
			{ cutscene: { bg: { type: 'tower' }, start: 'dark', frames: [
				{ actors: [{ id: 'yasmina', at: 'left', dim: true }], on: '_c', mon: 'ampharos', text: 'Las dos colas se acercan. La de Amphy, pálida, rosada, como una brasa. La otra, fuerte, joven, que no tiembla.' },
				{ shake: 1, color: '#ffe27a', fx: ['flash', 'sparkle'], text: 'Se tocan. *Chss.* Una chispa salta entre las dos esferas, y la lana de los dos se eriza a la vez.' },
				{ color: '#ffb070', cam: 'push', fx: 'glow', text: 'La luz de Amphy no crece. Pero ya no está sola. Las dos se suman, entran juntas en la lente, y la lente, por primera vez en años, no se para a la mitad.' },
				{ cam: 'pan-up', color: '#fff2c8', fx: ['light', 'beam'], text: 'Da la vuelta entera. Y otra. Y otra. El haz barre el puerto, la bocana, el cabo, el mar abierto. Llega hasta donde no llegaba desde hacía mucho tiempo.' },
			] } },
			{ text: 'Abajo, en el puerto, los barcos tocan la sirena. No todos a la vez, esta vez. Uno detrás de otro, cada vez que el haz les pasa por encima. Como si fueran diciendo «presente».' },
			{ text: 'Con la última vuelta se oye un clic metálico bajo el suelo. La cuna de latón del eje sube por el centro de la lente, se abre como una flor de cuatro pétalos y se queda quieta, mostrando lo que guardaba.' },
			{ cutscene: { bg: { type: 'tower' }, start: 'dark', frames: [
				{ fx: 'rays', cam: 'push', item: 'ampharosite', text: 'Una esfera del tamaño de una nuez. Dentro, un remolino de colores, amarillo y azul, enroscado sobre sí mismo como una espiral.' },
				{ fx: 'glow', text: 'Late. Cada vez que el haz de la lente pasa por encima, la espiral se ilumina por dentro, al mismo ritmo.' },
				{ actors: [{ id: 'yasmina', at: 'left' }, { mon: 'ampharos', at: 0.78, size: 's', enter: 'fade' }], on: '_c', text: 'Yasmina la toma con las dos manos, como se toma un pájaro herido. La mira. Mira a Amphy. Amphy la mira a ella, tranquilo, como si llevara cuarenta años esperando a que alguien la encontrara.' },
			] } },
			{ if: 'has("paginafaro")', then: [
				{ text: 'Le enseñas la hoja de la lata de tabaco. Yasmina reconoce la letra grande y torcida antes de leer una sola palabra. La lee entera. Luego otra vez. En la última línea se ríe y se le saltan las lágrimas a la vez.' },
				{ say: 'yasmina', text: '«Si tocas, toca bien». —Se seca los ojos con la manga—. Lo has hecho tú. Tocar bien. Yo solo he mirado.' },
			] },
			{ say: 'yasmina', text: 'Es una… Megapiedra. Una **Ampharosita**. El abuelo la guardaba para Amphy. Pero Amphy no es de pelear. Es de alumbrar. Siempre lo ha sido.' },
			{ say: 'yasmina', text: 'Y la nota dice que es para quien suba con un Ampharos que pelee por alguien a quien quiere. —Te la pone en la mano y te cierra los dedos encima—. Ese… eres tú. Bueno. Tu Pokémon. Bueno. Los dos.' },
			{ give: 'ampharosite' },
			{ if: 'has("megaring")', then: [
				{ text: 'La Piedra Llave de tu Megapulsera se calienta en la muñeca. La Ampharosita contesta con un destello. Como dos faros.' },
				{ say: 'yasmina', text: 'Si un Ampharos la lleva encima, en combate… con esa pulsera… se vuelve otra cosa. El abuelo lo apuntó. «Con luz hasta en la lana». —Sonríe—. Me gustaría verlo. Algún día.' },
			], else: [
				{ say: 'yasmina', text: 'El abuelo apuntó que hace falta algo más para que funcione. Algo de Kalos. Yo no sé de eso. Pero tú viajas mucho.' },
			] },
			{ if: '!inParty("ampharos")', then: [
				{ say: 'yasmina', text: 'Tu Pokémon de lana todavía no es Ampharos. —Mira a tu Pokémon con cariño—. No importa. La piedra espera. Lleva cuarenta años esperando. Sabe hacerlo.' },
			] },
			{ say: 'yasmina', text: 'Amphy no está curado. Lo sé. La boticaria tenía razón: el frasco lo sostiene y ya. —Mira el haz—. Pero ya no se pierde la mitad de su luz. Eso es tuyo.' },
			{ happy: { who: 'ampharos', n: 20 }, cond: 'inParty("ampharos")' },
			{ happy: { who: 'flaaffy', n: 20 }, cond: '!inParty("ampharos") && inParty("flaaffy")' },
			{ happy: { who: 'mareep', n: 20 }, cond: '!inParty("ampharos") && !inParty("flaaffy") && inParty("mareep")' },
			{ set: { 'flag.b03_amphita_hecho': true } },
			{ quest: 'b03_s_ampharosita', done: true },
			{ rep: { johto: 2 } },
			{ intel: { npc: 'yasmina', text: 'Te dio la Ampharosita que su abuelo, el farero, guardaba en el eje de la lente del Faro de Olivo. Amphy nunca la quiso: «no es de pelear, es de alumbrar».' } },
			{ diary: 'Hoy mi entrenador{|a|e} y yo bajamos a las tripas del Faro de Olivo. ¡Había cadenas, bloques de plomo y engranajes de bronce que hacían tic-tac como un reloj gigante! Lo arreglamos todo sin romper nada. ¡Ni una tuerca!\n\nLuego Amphy y nuestro Pokémon de lana se tocaron las colas, *chss*, y la lente dio la vuelta entera. ¡Los barcos fueron pitando uno detrás de otro, como cuando pasan lista en la escuela!\n\nDentro del eje había una piedra que brilla al ritmo del faro. Yasmina dice que su abuelo la guardaba allí para que Amphy la viera cada noche. Creo que es lo más bonito que ha guardado nadie en una máquina. ¡Bzzt!', cond: 'flag.b01_diario' },
		],

		// ---------- Después ----------
		b03_amphita_despues: [
			{ text: 'Amphy está junto a la lente, que da la vuelta entera, despacio, sin un crujido. Su luz sigue siendo pálida. Pero la lente la lleva lejos.' },
			{ if: 'inParty("ampharos") || inParty("flaaffy") || inParty("mareep")', then: [
				{ text: 'Al verte, Amphy hace dos destellos largos y uno corto. Desde tu cinturón, una Poké Ball se calienta y contesta. Todo en orden.' },
			], else: [
				{ text: 'Al verte, Amphy hace dos destellos largos y uno corto. Todo en orden.' },
			] },
			{ if: 'night', then: [{ text: 'Abajo, en el puerto, cada barco que entra toca la sirena una vez cuando el haz le pasa por encima. Nadie se lo ha pedido. Ya es costumbre.' }] },
		],

		// ---------- Combate amistoso (opcional) ----------
		b03_amphita_duelo: [
			{ say: 'yasmina', text: 'Eh… {jugador}. ¿Puedo pedirte una cosa? Una cosa pequeña. Bueno, no tan pequeña.' },
			{ say: 'yasmina', text: 'Me gustaría ver la piedra funcionar. Una vez. Un combate amistoso, aquí arriba. Sin medalla. Amphy mira desde la manta. —Pausa—. Amphy no pelea. Nunca ha peleado. Pero le gusta mirar.' },
			{ prompt: '¿Un combate amistoso con Yasmina?', choice: [
				{ text: '«Claro. Cuando quieras.»', then: [
					{ text: 'Yasmina sirve té en tres tazas desportilladas: una para ella, una para ti y una para Amphy, que no se la bebe pero le gusta tenerla delante. Mientras se enfría, le pasa a tu equipo un paño húmedo y una Superpoción a cada uno, con mucho cuidado, como si fueran de cristal.' },
					{ heal: true },
					{ text: 'Tu equipo está como nuevo.' },
					{ if: 'has("ampharosite") && has("megaring") && inParty("ampharos")', then: [
						{ say: 'yasmina', text: 'Acuérdate: la piedra tiene que llevarla tu Ampharos encima. Y solo una vez por combate. El abuelo lo subrayó dos veces.' },
					] },
					{ battle: 'b03_amphita_yasmina', lose: 'continue', onWin: [
						{ text: 'Amphy, desde la manta, hace «pa» cada vez que alguien acierta. Al final hace «pa» tres veces seguidas y se tumba, agotado de aplaudir.' },
						{ say: 'yasmina', text: 'Ha sido… bonito. —Mira a Amphy, que ya cabecea—. Él también lo piensa. Toma. Era del abuelo. Para que tu Pokémon de lana aguante más tormentas.' },
						{ give: 'sitrusberry', n: 2 },
						{ say: 'yasmina', text: 'Vuelve cuando quieras. De noche es más bonito. Ya te lo había dicho. Te lo digo otra vez.' },
					], onLose: [
						{ say: 'yasmina', text: 'Lo siento. Lo siento mucho. Era amistoso. ¡Era amistoso! —Te sirve más té, nerviosa—. Vuelve a intentarlo cuando quieras. Amphy y yo no nos vamos a ninguna parte.' },
						{ heal: true },
					] },
				] },
				{ text: '«Otro día.»', then: [
					{ say: 'yasmina', text: 'Claro. Claro. Perdona. No tenía que haber pedido. —Pausa—. Pero si otro día quieres, aquí estamos.' },
				] },
			] },
		],
	},
};
