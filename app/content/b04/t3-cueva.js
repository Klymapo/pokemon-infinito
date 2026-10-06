// Bloque 4 · Tramo 3: «Lo que hay bajo Celeste».
// Cueva Celeste (desde Celeste, ~8 tramos, galería profunda con el Sintonizador de Bill) → Nodo 03 (núcleo):
// la fuente del nodo, Magda Ivers, el nodo dañado, Handsome y Lebrun (revelación del topo y gran decisión),
// Ulises, A.Z. al amanecer, la foto y el final del Acto III.

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = 'inParty("riolu") || inParty("lucario")';
const DECIDIDO = 'flag.b04_lebrun_detenido || flag.b04_lebrun_cebo || flag.b04_lebrun_libre';
const PIEZA_EN_NODO = 'flag.b02_frag_handsome || flag.b02_frag_sera';
const FRAG_NINGUNO = '!flag.b02_frag_handsome && !flag.b02_frag_sera && !flag.b02_frag_melia';

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== CUEVA CELESTE ===================
		cueva_celeste: {
			name: 'Cueva Celeste', short: 'Cueva Celeste', region: 'kanto', kind: 'cave', map: { x: 32, y: 18 },
			bg: { type: 'cave', dark: true, crystals: '#7fb8e0', far: '#24324a' },
			desc: 'Una boca de roca al pie del acantilado, al oeste de Ciudad Celeste, medio escondida tras un remanso del río. Dentro, galerías que bajan y bajan, lagos negros, columnas de cristal azul que crecen del suelo como dientes y un aire frío que huele a piedra mojada y a electricidad.\n\nLos de Celeste dicen que nadie ha llegado nunca al fondo. Los que dicen que han llegado no quieren hablar de ello.',
			descNight: 'De noche, la Cueva Celeste brilla por dentro. Muy poco: un azul pálido en los cristales, como el de una pantalla que alguien se ha olvidado de apagar. Y el goteo, que no para nunca.',
			descs: [
				{ cond: 'flag.b04_fin', text: 'La Cueva Celeste, en silencio. Los cristales de las paredes ya no laten: brillan quietos, azules, como siempre debieron brillar. Los cables de Lemnis siguen colgando del techo, cortados, como lianas muertas.\n\nEn la boca de la cueva alguien ha dejado una flor roja sobre una piedra. No se ha marchitado.' },
				{ cond: 'flag.b04_m_aviso', text: 'Galerías que bajan y bajan, lagos negros y columnas de cristal azul. Por el suelo corren **cables** gruesos, sujetos con grapas, que se pierden hacia el fondo. Cada pocos segundos, los cristales de las paredes se encienden todos a la vez, muy débilmente, como si la cueva respirara a través de ellos.\n\nEn la entrada queda una caseta de lona de Lemnis, vacía, con un cartel: «ESTUDIO GEOLÓGICO · PROHIBIDO EL PASO».' },
			],
			links: ['celeste', 'nucleo_celeste'],
			enterCond: 'flag.b04_silph_hecho',
			blockedMsg: 'En la boca de la cueva hay una caseta de lona con una lemniscata y dos guardias de Lemnis con chaleco reflectante. Uno levanta la mano antes de que te acerques: «Estudio geológico. Prohibido el paso. Riesgo de desprendimientos». El otro añade, sin que nadie le pregunte: «Muy geológico todo». Tienen orden de no dejar pasar a nadie. Y, por cómo te miran, sobre todo a ti.',
			mapNote: 'Lemnis · «estudio geológico» · prohibido el paso',
			onEnter: [{ script: 'b04_cueva_llegada', cond: '!flag.b04_m_aviso', once: true }],
			rumors: [
				{ text: 'En Celeste dicen que en el fondo de la cueva vive algo que no sale en ninguna Pokédex. Que una vez un entrenador bajó y volvió sin decir una palabra en tres días.' },
				{ text: '«El Escéptico» Simón, el del pódcast de leyendas, dice que lo de la cueva es un bulo de los años noventa. Luego pidió por favor que nadie se lo contara a Renata, porque «a lo mejor no».' },
				{ cond: '!flag.b04_fin', text: 'Desde que Lemnis puso la caseta, los Golduck del río no se acercan a la boca de la cueva. Se quedan río abajo, mirando, con las manos en la cabeza.' },
				{ cond: 'flag.b04_fin', text: 'Los Golduck del río han vuelto a bañarse junto a la boca de la cueva. Un pescador dice que ayer, al amanecer, vio salir volando algo de la montaña. Algo pálido, con cola. Dice que no hizo ningún ruido.' },
			],
			route: {
				from: 'celeste', to: 'nucleo_celeste', length: 8, terrain: 'cave', rate: 0.22,
				tramos: {
					0: [
						{ text: 'La boca de la cueva. Detrás de ti, el río y la luz de Celeste. Delante, la oscuridad y el goteo. Por el suelo corren cables gruesos, grapados a la roca, que bajan hacia el fondo.', cond: '!flag.b04_fin' },
						{ text: 'La boca de la cueva. Los cables de Lemnis siguen en el suelo, cortados. Ya no zumban.', cond: 'flag.b04_fin' },
					],
					1: [
						{ trainer: 'ccel_benigno' },
						{ text: 'Un poste de obra con una lámpara de Lemnis y un cartel plastificado: «Nodo 03 · Acceso técnico · Chaleco y casco obligatorios». Alguien ha añadido a rotulador: «y café».' },
					],
					2: [
						{ text: 'Columnas de cristal azul crecen del suelo, gruesas como troncos. Al tocarlas están tibias. Cada pocos segundos se encienden todas a la vez, muy débilmente. Una. Pausa. Otra.' },
						{ spot: { action: { gather: 'cristales_celeste' } }, label: 'Columnas de cristal azul', icon: '💎' },
						{ item: 'ultraball', n: 2 },
					],
					3: [
						{ terrain: 'water' },
						{ text: 'Un **lago subterráneo**, negro, enorme. En la orilla, un campamento de lona: literas plegables, un hornillo, una baraja. Los guardias de Lemnis del turno de descanso matan el tiempo a base de combates.' },
						{ spot: { action: { training: { cap: 54, trainers: ['ccel_turno_1', 'ccel_turno_2', 'ccel_turno_3'], wild: [{ sp: 'machoke', lv: [51, 53] }, { sp: 'primeape', lv: [51, 53] }, { sp: 'golduck', lv: [51, 54] }], coach: 'Capataz de turno', closed: 'El capataz recoge la baraja: «Aquí ya no te queda nadie a quien ganarle. Y a mí no me queda sueldo que apostar. Sigue, anda. Pero yo no te he visto».' } } }, label: 'El campamento del turno de descanso', sub: 'Zona de entrenamiento (tope 54)', icon: '🥋' },
						{ item: 'ppup', hidden: true },
					],
					4: [
						{ text: 'La galería se estrecha. En un hueco de la pared, entre dos cristales, algo amarillo se mueve muy despacio.' },
						{ talk: [{ cond: 'flag.b04_kadabra', script: 'b04_kadabra_despues' }, { script: 'b04_kadabra' }], label: 'Un Kadabra encogido en un hueco', sub: 'No se mueve. Respira muy despacio', icon: '🥄', new: '!flag.b04_kadabra' },
						{ spot: { action: { gather: 'charca_celeste' } }, label: 'Una charca entre las rocas', icon: '💧' },
					],
					5: [
						{ trainer: 'ccel_penalver' },
						{ text: 'Cajas de plástico apiladas contra la pared, con el logo de la lemniscata. Etiquetas impresas: «Inventario · Nodo 03 · Revisado por: N. Lambert». En la última, a lápiz, con una letra muy pequeña: «Vacías. Gracias a Dios, vacías».' },
						{ item: 'maxrepel' },
					],
					6: [
						{ text: 'Aquí la cueva se abre en una docena de galerías que se cruzan y se vuelven a cruzar. Los cables se separan, cada uno por un sitio. Todas las paredes son iguales. Todos los ecos vuelven de todas partes.', cond: '!has("sintonizadorbill")' },
						{ text: 'La cueva se abre en una docena de galerías. En tu bolsillo, el **Sintonizador de Bill** pita más deprisa cuando giras hacia la de la izquierda. Pi. Pi. Pi. Lo sigues.', cond: 'has("sintonizadorbill") && !flag.b04_fin' },
						{ block: { cond: 'has("sintonizadorbill")', msg: 'Pruebas una galería, y otra, y otra. Todas vuelven al mismo sitio. Sin algo que siga la señal, aquí abajo podrías dar vueltas durante días. Alguien tendría que saber escucharla por ti.', dir: 1 } },
						{ item: 'rarecandy', hidden: true },
					],
					7: [
						{ script: 'b04_cc_hilo', once: true, mark: true },
						{ trainer: 'ccel_fermin' },
						{ trainer: 'ccel_olegario', optional: true, label: 'Un guardia sentado sobre una caja, con la linterna apagada' },
					],
					8: [
						{ text: 'Al fondo de la galería, una luz azul, fuerte, constante. Y un zumbido grave que ya no es de la cueva: es de una máquina.', cond: '!flag.b04_fin' },
						{ text: 'Al fondo de la galería, la sala del nodo. Ya no hay luz azul. Solo la de tu linterna.', cond: 'flag.b04_fin' },
						{ item: 'maxrevive', hidden: true },
					],
				},
				encounters: {
					cave: [
						{ sp: 'golbat', lv: [50, 53], w: 22 },
						{ sp: 'parasect', lv: [50, 52], w: 14 },
						{ sp: 'magneton', lv: [51, 53], w: 14 },
						{ sp: 'machoke', lv: [50, 52], w: 12 },
						{ sp: 'primeape', lv: [51, 53], w: 10 },
						{ sp: 'kadabra', lv: [51, 53], w: 10, time: 'night' },
						{ sp: 'electrode', lv: [52, 54], w: 6 },
						{ sp: 'ditto', lv: [51, 53], w: 6 },
						{ sp: 'wobbuffet', lv: [52, 54], w: 3 },
						{ sp: 'carbink', lv: [51, 53], w: 4, displaced: true },
					],
					water: [
						{ sp: 'golduck', lv: [51, 53], w: 35 },
						{ sp: 'slowbro', lv: [51, 53], w: 30 },
						{ sp: 'psyduck', lv: [50, 51], w: 20 },
						{ sp: 'slowpoke', lv: [50, 51], w: 10 },
						{ sp: 'gyarados', lv: [52, 54], w: 5 },
					],
				},
			},
		},

		// =================== EL NODO 03 ===================
		nucleo_celeste: {
			name: 'El fondo de la Cueva Celeste', short: 'Nodo 03', region: 'kanto', kind: 'area', map: { x: 20, y: 10 },
			bg: { type: 'cave', dark: true, crystals: '#9fd8ff', fissure: true },
			desc: 'Una sala redonda, enorme, con el techo tan alto que la linterna no llega. En el centro, un **anillo de metal** del tamaño de una plaza, rodeado de columnas de cristal azul atadas con cables. Del anillo sube una columna de luz que zumba.\n\nY dentro de la luz hay algo. Alguien.',
			descs: [
				{ cond: 'flag.b04_fin', text: 'La sala del nodo, a oscuras. El anillo de metal sigue ahí, partido por tres sitios, con las columnas de cristal caídas como árboles después de una tormenta. Las lámparas de emergencia de Lemnis parpadean en rojo.\n\nEn el centro del anillo, donde estaba la luz, solo queda el suelo de roca. Y una marca en la roca, como si algo muy pesado hubiera estado mucho tiempo ahí de pie.' },
				{ cond: 'flag.b04_mewtwo', text: 'La sala del nodo. El anillo de metal está partido por tres sitios. Las columnas de cristal se han caído y los cables cuelgan sueltos, chisporroteando. La columna de luz ya no existe.\n\nEn el centro, donde estaba, solo queda una marca en la roca.' },
			],
			links: ['cueva_celeste'],
			mapNote: 'El Nodo 03',
			onEnter: [{ script: 'b04_nucleo_llegada', cond: '!flag.b04_magda_vista', once: true }],
			spots: [
				{ label: 'Magda Ivers, junto al nodo', sub: 'Bebe té de un termo y toma notas', icon: '📐', cond: 'flag.b04_magda_vista && !beat("magda_1")', new: 'true', talk: [{ script: 'b04_magda' }] },
				{ label: 'El nodo', sub: 'La luz tiembla. {riolu} no le quita los ojos de encima', icon: '💠', cond: 'beat("magda_1") && !flag.b04_mewtwo', new: 'true', talk: [{ script: 'b04_nodo' }] },
				{ label: 'Pasos en la galería', sub: 'Alguien baja corriendo. Y alguien más, detrás, sin prisa', icon: '👣', cond: 'flag.b04_mewtwo && !(' + DECIDIDO + ')', new: 'true', talk: [{ script: 'b04_lebrun' }] },
				{ label: 'Salir de la cueva', sub: 'Es hora de volver a la superficie', icon: '🌅', cond: '(' + DECIDIDO + ') && !flag.b04_fin', new: 'true', talk: [{ script: 'b04_salida' }] },
				{ label: 'Un manantial entre los cristales', sub: 'Agua clara y fría. Descansar', icon: '💧', talk: [{ script: 'b04_manantial' }] },
				{ label: 'El anillo partido', sub: 'Lo que queda del nodo', icon: '💠', cond: 'flag.b04_fin', talk: [{ script: 'b04_nodo_despues' }] },
			],
			rumors: [
				{ text: 'No hay rumores sobre este sitio. Nadie que haya llegado hasta aquí ha vuelto a contarlo en un bar.' },
			],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Cueva Celeste: Lemnis -----
		ccel_benigno: { name: 'Benigno', cls: 'Agente de Lemnis', npc: 'agente_lemnis', ai: 3, team: [{ sp: 'magneton', lv: 51 }, { sp: 'golbat', lv: 51 }],
			intro: '¡Alto! Estudio geológico. Muy geológico. Estudiamos… rocas. Que son geológicas. Por eso. ¿Me dejas terminar la frase o vamos directamente al combate?',
			win: 'Mis compañeros se han ido todos a Azafrán esta mañana, corriendo, por no sé qué lío en Silph. Me han dejado solo con las rocas. Y contigo. Me caían mejor las rocas.' },
		ccel_penalver: { name: 'Dra. Peñalver', cls: 'Científica de Lemnis', npc: 'cientifica_lemnis', ai: 3, team: [{ sp: 'porygon2', lv: 52 }, { sp: 'klang', lv: 52 }, { sp: 'electrode', lv: 52 }],
			intro: 'Llevo tres semanas aquí abajo midiendo un «cansancio». Mis aparatos dicen que la cueva entera está cansada. No sé qué significa eso. Me pagan por no preguntarlo.',
			win: 'Cuando empecé, las columnas de cristal brillaban solas. Ahora solo brillan cuando la máquina tira de ellas. Lo tengo apuntado. Nadie me ha pedido nunca que lo lea en voz alta.' },
		ccel_fermin: { name: 'Fermín', cls: 'Guardia de Lemnis', npc: 'guardia_lemnis', ai: 3, team: [{ sp: 'machamp', lv: 53 }, { sp: 'skarmory', lv: 52 }, { sp: 'hypno', lv: 52 }],
			intro: 'Me dijeron que esto era vigilar una obra. No me dijeron que la obra respiraba. Y que de noche, a veces, te mira desde dentro de la cabeza.',
			win: 'Ve. Pero no lo mires mucho rato a los ojos. El primer día lo hice. Todavía sueño con un sitio blanco lleno de tubos.' },
		ccel_olegario: { name: 'Olegario', cls: 'Guardia de Lemnis', npc: 'guardia_lemnis', ai: 3, team: [{ sp: 'bronzong', lv: 54 }, { sp: 'steelix', lv: 53 }],
			intro: 'El turno de noche aquí abajo es igual que el de día. Lo único que cambia es la cara del que te releva. Hoy no me ha relevado nadie. Combate, por lo menos, que pase el rato.',
			win: 'Treinta años de guardia de seguridad. Bancos, museos, un concierto de Lino una vez. Nunca había vigilado algo que diera pena. Esto da pena.' },

		// ----- Campamento del turno de descanso (entrenamiento, repetibles) -----
		ccel_turno_1: { name: 'Remigio', cls: 'Guardia de Lemnis', npc: 'guardia_lemnis', ai: 2, team: [{ sp: 'graveler', lv: 51 }, { sp: 'magneton', lv: 52 }],
			intro: 'Turno de descanso. Ocho horas en una litera junto a un lago negro. Lo que sea por un combate.', win: 'Apuntado en la libreta del campamento: «Remigio, otra vez cero». Tengo una racha preciosa.' },
		ccel_turno_2: { name: 'Nieves', cls: 'Guardia de Lemnis', npc: 'guardia_lemnis', ai: 2, team: [{ sp: 'primeape', lv: 52 }, { sp: 'golbat', lv: 52 }],
			intro: 'Mi Primeape no duerme desde que bajamos. Yo tampoco. Por lo menos él se desahoga a golpes.', win: 'Ya está más tranquilo. Gracias. En serio. A ver si ahora duerme alguno de los dos.' },
		ccel_turno_3: { name: 'Teodoro', cls: 'Técnico de Lemnis', npc: 'tecnico_lemnis', ai: 2, team: [{ sp: 'electrode', lv: 53 }, { sp: 'golduck', lv: 52 }],
			intro: 'Yo cambio fusibles. Cada vez que la luz del fondo pega un tirón, se funden doce. Doce. Esa cosa tira más que una ciudad entera.', win: 'Si ves a la jefa, no le digas que juego a las cartas en horario. Lo sabe. Pero que no se lo digas.' },

		// ----- Magda Ivers (jefa de trama) -----
		magda_1: { name: 'Magda Ivers', cls: 'Jefa de Infraestructura', npc: 'magda', ai: 5, iv: 28, reward: 4400, bg: 'cave', terrain: 'cave',
			team: [
				{ sp: 'magnezone', lv: 51, moves: ['thunderbolt', 'flashcannon', 'voltswitch', 'thunderwave'], ability: 'sturdy', item: 'leftovers', nature: 'modest' },
				{ sp: 'klinklang', lv: 50, moves: ['shiftgear', 'geargrind', 'wildcharge', 'return'], ability: 'clearbody', item: 'sitrusberry', nature: 'adamant' },
				{ sp: 'porygonz', lv: 51, moves: ['triattack', 'darkpulse', 'icebeam', 'thunderbolt'], ability: 'download', item: 'sitrusberry', nature: 'modest' },
				{ sp: 'electivire', lv: 52, moves: ['wildcharge', 'icepunch', 'firepunch', 'lowkick'], ability: 'motordrive', nature: 'adamant' },
				{ sp: 'metagross', lv: 53, moves: ['meteormash', 'zenheadbutt', 'bulletpunch', 'earthquake'], ability: 'clearbody', item: 'occaberry', nature: 'adamant' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'Cinco Pokémon. Acero, Eléctrico y Normal. Se lo digo para que no pierda el tiempo calculándolo. Yo ya he calculado lo suyo.',
			win: 'Cinco de cinco. —Lo anota, sin que le tiemble la letra—. Interesante. Tendré que repetir la medición.',
			lose: 'Ha perdido usted un cuarenta por ciento de eficiencia en el tercer cambio. Descanse. Vuelva cuando quiera: aquí estaré. Los números no se mueven.' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== CUEVA CELESTE ===================
		b04_cueva_llegada: [
			{ set: { 'flag.b04_m_aviso': true } },
			{ quest: 'b04_m5', stage: 'nodo' },
			{ text: 'La caseta de lona de Lemnis está vacía. Una silla volcada, un termo de café todavía caliente, una radio que repite en bucle: «A todas las unidades: incidencia en Silph, Azafrán. Repito: a todas las unidades…».' },
			{ say: 'rotom', text: '¡Bzzt! Se han ido corriendo por lo de Silph. —Pausa—. Lo de Silph lo hicimos nosotros. Es la primera vez que una cosa que hacemos nos abre una puerta en vez de cerrarla. Me gusta la sensación.' },
			{ text: 'Entras. El aire se enfría de golpe. El ruido del río se apaga detrás de ti, y solo queda el goteo. Y, muy por debajo, casi en los pies más que en los oídos, un zumbido.' },
			{ if: 'has("sintonizadorbill")', then: [
				{ text: 'En tu bolsillo, el **Sintonizador de Bill** se enciende solo. Una lucecita verde. Un pitido, flojito, cada varios segundos. *Pi.* … *Pi.*' },
				{ say: 'rotom', text: 'Bill dijo que cuanto más cerca, más pita. Ahora mismo pita como un despertador con sueño. —Pausa—. Vamos a despertarlo.' },
			] },
			{ if: LUC, then: [
				{ text: '{riolu} se para en la entrada. Los apéndices de detrás de las orejas se le levantan, despacio, y se quedan apuntando hacia el fondo de la cueva. No tiembla. Escucha.' },
				{ text: 'Luego te mira. Y, sin esperar a que digas nada, echa a andar delante de ti.' },
			] },
		],
		b04_kadabra: [
			{ set: { 'flag.b04_kadabra': true } },
			{ text: 'Un Kadabra, encogido en un hueco de la roca, abrazado a su cuchara como un niño a un peluche. Tiene los ojos medio cerrados. El bigote le cuelga. Cada vez que los cristales de la pared se encienden, se encoge un poco más.' },
			{ say: 'rotom', text: '¡Bzzt! Constantes muy bajas. No está herido. Está… vacío. Como los Magikarp de Caoba. Como los del Encinar. —Pausa—. Ya sé lo que es esto. No me gusta saberlo.' },
			{ if: LUC, then: [
				{ text: '{riolu} se agacha delante del hueco. Pone la palma abierta a un palmo de la cara del Kadabra, sin tocarlo. El aura se le enciende en la mano, azul y tibia, como una estufa pequeña.' },
				{ text: 'El Kadabra abre un ojo. Luego el otro. Se queda mirando la luz de la palma un rato largo. Y, muy despacio, deja de encogerse.' },
				{ text: 'Antes de que puedas hacer nada, desaparece con un *plop* de Teletransporte. En el hueco solo queda la cuchara, doblada, todavía tibia.' },
				{ happy: { who: 'riolu', n: 3 } },
			], else: [
				{ text: 'Te sientas a su lado un rato. No hace nada. Tú tampoco. Cuando los cristales se apagan, el Kadabra te mira por fin, muy despacio, y desaparece con un *plop* de Teletransporte.' },
				{ text: 'En el hueco solo queda la cuchara, doblada, todavía tibia.' },
			] },
			{ give: 'twistedspoon' },
		],
		b04_kadabra_despues: [
			{ text: 'El hueco de la roca donde estaba el Kadabra. Vacío. En la pared, alguien ha rascado con una uña muy fina un dibujo pequeño: una cuchara.', cond: '!flag.b04_fin' },
			{ text: 'El hueco de la roca donde estaba el Kadabra. Dentro hay ahora una cuchara nueva, recta, sin doblar. Alguien ha vuelto a por la vieja y ha dejado esta. O a lo mejor la ha dejado para ti.', cond: 'flag.b04_fin' },
		],
		b04_cc_hilo: [
			{ if: 'has("sintonizadorbill")', then: [
				{ text: 'El **Sintonizador de Bill** ya no pita: canta. *Pi-pi-pi-pi-pi*, sin pausa, tan deprisa que los pitidos se pegan unos a otros en un solo chillido.' },
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#7fb8e0' }, start: 'dark', frames: [
					{ item: 'sintonizadorbill', text: 'Sacas la radio color crema. La antena tiembla. La ruedecita gira sola, despacio, hasta el tope.' },
					{ fx: 'glow', text: 'Y la cueva se ilumina. No toda: un **hilo**. Un hilo finísimo de luz azul pálida que sale de la pared, cruza el techo de la galería y baja hacia el fondo, tenso como la cuerda de una guitarra.' },
					{ text: 'Es el mismo hilo. El del Lago de la Furia. El que viste apagarse bajo el agua, con el aura de {riolu}, la noche que se calló el lago. Ha cruzado medio Kanto bajo tierra. Y acaba aquí.' },
				] } },
			], else: [
				{ text: 'En el techo de la galería, muy fino, casi invisible, un hilo de luz azul pálida baja hacia el fondo, tenso como la cuerda de una guitarra.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! Lo veo. Lo mido. Es la misma frecuencia que las hojas de Caoba. La de «arranque». —Pausa—. Ya no es una prueba, {jugador}. Esto ya está arrancado.' },
			{ text: '{riolu} levanta la vista hacia el hilo y aprieta los puños. Por un segundo, el aura le recorre los brazos sola, sin que la llame, como un escalofrío azul.', cond: LUC },
		],

		// =================== EL NODO 03 ===================
		b04_nucleo_llegada: [
			{ set: { 'flag.b04_magda_vista': true } },
			{ text: 'La galería desemboca en una sala tan grande que tu linterna se pierde antes de llegar al techo. No hace falta linterna: la sala está llena de luz.' },
			{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#9fd8ff', fissure: true }, start: 'dark', frames: [
				{ text: 'En el centro, un anillo de metal del tamaño de una plaza, clavado en la roca. Alrededor, columnas de cristal azul arrancadas de la cueva y atadas con cables gruesos como brazos.' },
				{ fx: 'light', text: 'Del anillo sube una columna de luz que zumba, grave, constante. El hilo del techo baja hasta ella y se pierde dentro.' },
				{ fx: 'zoom', mon: 'mewtwo', text: 'Y dentro de la luz, flotando a un metro del suelo, hay alguien. Una figura alta, pálida, con una cola larga que cuelga sin fuerza. Hilos de luz le atraviesan los brazos, el pecho, la frente. Tiene los ojos cerrados.' },
				{ fx: 'shake', text: 'Cada pocos segundos, la columna pulsa. Y cada vez que pulsa, la figura se tensa entera, como quien aguanta un grito con la boca cerrada.' },
			] } },
			{ if: PIEZA_EN_NODO, then: [
				{ text: 'En el centro del anillo, encajada como una llave en su cerradura, hay una pieza de metal oscuro con vetas azul y plata. La conoces. La tuviste en las manos en la Torre Quemada de Iris. Estaba tibia.' },
			] },
			{ if: 'flag.b02_frag_melia', then: [
				{ text: 'En el centro del anillo hay una pieza de metal nueva, sin vetas, soldada con prisa y mal. Las soldaduras chisporrotean. Alguien tuvo que sustituir algo que se rompió en tres trozos.' },
			] },
			{ if: FRAG_NINGUNO, then: [
				{ text: 'En el centro del anillo, encajada como una llave en su cerradura, hay una pieza de metal oscuro con vetas azul y plata.' },
			] },
			{ if: LUC, then: [
				{ text: '{riolu} da un paso hacia la luz. Otro. Tiene el aura encendida por todo el cuerpo, sin quererlo, como quien tiene fiebre. Le pones una mano en el hombro. Se para. Pero no deja de mirar.' },
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#9fd8ff', fissure: true }, start: 'dark', frames: [
					{ fx: 'glow', mon: 'lucario', text: 'El aura de {riolu} se estira hacia la columna de luz. Sola. Como una mano que se tiende sin pedir permiso.' },
					{ text: 'Toca uno de los hilos. Durante un instante, solo un instante, la figura de dentro de la luz deja de tensarse.' },
					{ fx: 'flash', text: 'Y abre los ojos. Morados. Cansadísimos. Y te mira. No a ti: a {riolu}.' },
					{ text: '*…¿Quién…?*\n\nLa voz no suena. Está dentro de tu cabeza, como un pensamiento que no es tuyo.' },
					{ fx: 'dark', text: 'La columna pulsa otra vez, más fuerte. La figura cierra los ojos. El aura de {riolu} se retira de golpe, como una mano que se quema.' },
				] } },
				{ text: '{riolu} retrocede un paso y se queda jadeando. Tiene las palmas abiertas, temblando.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! Eso… eso no lo tengo. Busco la silueta y mi Pokédex me da una ficha casi vacía. Solo un nombre. —Pausa—. **Mewtwo**. Y una línea: «Creado por el ser humano». Nada más. Ni hábitat, ni dieta, ni nada. Como si alguien hubiera borrado el resto.' },
			{ if: 'has("diariofuji")', then: [
				{ text: 'Te acuerdas de la hoja del diario del Señor Fuji, amarilla y blanda de tanto doblarla. *Le quitamos todo lo que era para darle todo lo que nosotros queríamos que fuera. Se despertó enfadado. Tenía razón.*' },
			] },
			{ text: 'Junto al anillo hay una mesa plegable. Encima, un termo de té, una libreta de tapas grises y una calculadora de las de antes, con papel. Una mujer de pelo gris acero, muy corto, y abrigo largo gris, escribe sin levantar la vista.' },
			{ call: 'b04_magda' },
		],
		b04_magda: [
			{ if: 'beat("magda_1")', then: [{ end: true }] },
			{ if: 'flag.b04_magda_perdio', then: [
				{ say: 'magda', text: 'Ha vuelto. Bien. —Pasa una página de la libreta—. Una muestra de uno no es una muestra.' },
				{ text: 'Detrás de ella, la columna de luz pulsa. Dentro, Mewtwo se tensa entero.' },
				{ say: 'magda', text: 'Cure a su equipo si lo necesita. No quiero datos contaminados.' },
				{ heal: 'Te arrodillas junto al manantial de la sala y dejas que tu equipo beba y descanse. Magda espera. Sirve té en la tapa del termo. No te ofrece.' },
				{ battle: 'magda_1', lose: 'continue', onWin: [{ call: 'b04_magda_despues' }], onLose: [{ call: 'b04_magda_derrota' }] },
				{ end: true },
			] },
			{ say: 'magda', text: 'Cuarenta y un minutos desde la boca de la cueva. —Sigue escribiendo—. Mis técnicos tardan cincuenta y ocho de media. Usted no ha parado a mirar los cristales. Casi nadie para. Es una lástima: son muy bonitos.' },
			{ if: 'flag.b04_magda_tren', then: [
				{ say: 'magda', text: 'Nos conocemos. El tren. —Levanta la vista por fin. Ojos grises, tranquilos, sin prisa—. Usted miraba mi servilleta. Yo miraba su Pokédex. En el túnel consumió un tres por ciento más de lo normal. Durante cuarenta segundos. Lo apunté. Apunto todo.' },
			] },
			{ if: 'flag.b04_magda_nombre', then: [
				{ choice: [
					{ text: '«Magda Ivers.»', then: [
						{ say: 'magda', text: 'Sí. —Ni rastro de sorpresa—. Lo leería en Silph. Dejé el nombre completo en el calendario. Firmar con una sola letra me parece de mala educación. Lo hago porque me lo piden.' },
					] },
					{ text: '«Usted es "M."».', then: [
						{ say: 'magda', text: '«M.» es una inicial. Yo soy Magda Ivers, jefa de Infraestructura de Lemnis Kanto. Ingeniera de puentes, antes. —Cierra la libreta con un dedo dentro, para no perder la página—. Los puentes también unen cosas que estaban separadas. Esto es un puente más grande.' },
					] },
				] },
			], else: [
				{ say: 'magda', text: 'Magda Ivers. Infraestructura, Lemnis Kanto. —Lo dice como quien lee una placa—. Usted es quien colabora con la policía. Sale en todos los informes. Me alegra ver que los informes aciertan.' },
			] },
			{ choice: [
				{ text: '«¿Qué le están haciendo?»', then: [
					{ say: 'magda', text: 'En mis registros se llama F-03. Fuente tres. No aparece en ningún registro público. —Mira la columna de luz como quien mira una presa hidroeléctrica—. En una hora produce más energía de la que gasta Ciudad Celeste en un año.' },
					{ say: 'magda', text: 'No le estamos haciendo daño. Le estamos pidiendo prestado. No muere. Rinde.' },
				] },
				{ text: '«Suéltelo. Ahora.»', then: [
					{ say: 'magda', text: 'Si lo suelto, se pierde un treinta y uno por ciento de la red de pruebas de Kanto. Proyectado a cinco años, eso son once hospitales sin cortes de luz. —Te tiende la calculadora—. Haga la cuenta conmigo. O la hago yo, si quiere. Me gusta hacerla.' },
				] },
				{ text: '«Usted firmaba las hojas de Caoba.»', cond: 'has("registroondas")', then: [
					{ say: 'magda', text: 'Firmo todo lo que mido. —Asiente—. Los Magikarp de Caoba fueron un error de calibración. Lo anoté. No se repetirá. Ya no hace falta enfadar a nada: con F-03 basta.' },
				] },
			] },
			{ say: 'magda', text: 'Usted cree que soy cruel. Lo veo en cómo aprieta la mandíbula. —Bebe un sorbo de té—. No lo soy. Me crie en un barrio donde se iba la luz tres noches por semana. Lo que hago aquí abajo es que eso no le pase a nadie más. Nunca.' },
			{ say: 'magda', text: 'La eficiencia es una forma de bondad.' },
			{ if: LUC, then: [
				{ text: '{riolu} gruñe. Bajito. El aura le chisporrotea entre los dedos.' },
				{ say: 'magda', text: 'Su Lucario mide doce unidades por encima de la media de su especie. —Lo anota—. Eso no estaba en mis cálculos. Me gusta cuando algo no está en mis cálculos. Pasa muy poco.' },
			] },
			{ say: 'magda', text: 'No voy a dejar que toque el nodo. Pero tampoco tengo prisa. —Señala un manantial de agua clara entre los cristales—. Cure a su equipo. No quiero datos contaminados.' },
			{ choice: [
				{ text: 'Dejar que tu equipo beba y descanse.', then: [
					{ heal: 'Tus Pokémon beben del manantial. El agua está tan fría que duele, y luego deja de doler. Magda espera, con el bolígrafo en el aire.' },
				] },
				{ text: '«No necesito nada de usted.»', then: [
					{ say: 'magda', text: 'El agua no es mía. Es de la cueva. —Ni se inmuta—. Como todo lo demás que hay aquí. Beba.' },
					{ heal: 'Al final dejas que tu equipo beba del manantial. Magda no dice nada. Apunta algo.' },
				] },
			] },
			{ battle: 'magda_1', lose: 'continue', onWin: [{ call: 'b04_magda_despues' }], onLose: [{ call: 'b04_magda_derrota' }] },
		],
		b04_magda_derrota: [
			{ set: { 'flag.b04_magda_perdio': true } },
			{ text: 'Tu último Pokémon cae. Magda recoge al Metagross con un gesto pequeño, sin triunfo, como quien apaga una luz al salir de una habitación.' },
			{ say: 'magda', text: 'No se lo tome como algo personal. Es estadística. —Vuelve a sentarse—. La estadística también cambia, si se cambian las condiciones. Vuelva cuando haya cambiado las suyas.' },
			{ heal: 'Tus Pokémon se recuperan junto al manantial. Detrás de Magda, la columna de luz sigue pulsando.' },
		],
		b04_magda_despues: [
			{ text: 'El Metagross de Magda se derrumba con un ruido de campana rota. Magda lo recoge. Se queda un momento mirando la Poké Ball, y luego mirándote a ti. Por primera vez parece que está calculando algo que no le sale.' },
			{ if: LUC, then: [
				{ say: 'magda', text: 'Su Lucario golpea con un margen de error de un dos por ciento. Mis Pokémon de acero no estaban diseñados para eso. —Lo apunta. La letra sigue recta—. Nadie diseña nada para eso.' },
				{ happy: { who: 'riolu', n: 5 } },
			], else: [
				{ say: 'magda', text: 'Cinco de cinco. Con un equipo que no estaba en mis proyecciones. —Lo apunta. La letra sigue recta—. Interesante.' },
			] },
			{ say: 'magda', text: 'No voy a impedirle nada. No lo haría bien: no sé pelear sin mis Pokémon. Y no voy a fingir que sé.' },
			{ text: 'Arranca la libreta de su bolsillo, la cierra y te la tiende. Tapas grises. Cuadrícula milimetrada.' },
			{ say: 'magda', text: 'Mis notas. No se las doy para que me entienda. Se las doy para que haga las cuentas. —Pausa—. Si al final le salen distintas que a mí, escríbame. De verdad. Me gustaría saber dónde me he equivocado. Tengo copia, por si se lo pregunta. Siempre tengo copia.' },
			{ give: 'notasmagda' },
			{ intel: { npc: 'magda', text: 'Magda Ivers, jefa de Infraestructura de Lemnis Kanto. Firmaba «M.». Mantenía el Nodo 03 en la Cueva Celeste con una «fuente» que llama F-03. Cree de verdad que el proyecto acabará con los apagones: «La eficiencia es una forma de bondad». No pelea sin sus Pokémon. Te dio su libreta para que «hagas las cuentas».' } },
			{ call: 'b04_nodo' },
		],
		b04_nodo: [
			{ if: 'flag.b04_mewtwo', then: [{ end: true }] },
			{ text: 'Te acercas al anillo. El zumbido te sube por las piernas. La columna de luz pulsa, y dentro, Mewtwo se tensa entero. Tan cerca, se le ven las costillas.' },
			{ say: 'magda', text: 'No lo toque. —No se levanta. No grita. Solo lo dice—. No sabe lo que hace.' },
			{ if: LUC, then: [
				{ text: '{riolu} pasa a tu lado sin mirarte. Se planta delante de la pieza del centro del anillo. Respira hondo. Y pone las dos palmas encima.' },
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#9fd8ff', fissure: true }, start: 'dark', frames: [
					{ fx: 'glow', mon: 'lucario', text: 'El aura le sale de golpe, por las palmas, por el pecho, por los ojos. Azul. Mucha más de la que le has visto nunca. Baja por la pieza, se mete en el anillo y sube por los hilos de luz, uno a uno, como agua por raíces.' },
					{ text: 'Llega hasta Mewtwo. Lo envuelve. No tira de él: lo sostiene.' },
					{ fx: 'flash', text: 'Mewtwo abre los ojos. Esta vez no los cierra.' },
					{ text: '*…Tú no tomas.*\n\nOtra vez la voz dentro de tu cabeza. Más clara. Sorprendida.\n\n*…Das.*' },
					{ fx: 'shake', text: 'Mewtwo levanta una mano. Los hilos de luz que le atraviesan el cuerpo se tensan… y se tensan… y el aura de {riolu} empuja desde fuera mientras la mente de Mewtwo empuja desde dentro.' },
					{ fx: 'flash', text: 'Una columna de cristal se parte. Otra. El anillo cruje por tres sitios. Los cables saltan de sus grapas como látigos.' },
					{ fx: 'dark', text: 'La columna de luz se apaga. Silencio. Un silencio enorme. Solo el goteo, otra vez, como si la cueva hubiera estado aguantando la respiración y por fin la soltara.' },
				] } },
				{ text: '{riolu} cae de rodillas, con las palmas humeando. Corres hacia él. Te deja que lo sujetes. Está agotado. Y sonríe. Casi nada, con la comisura de la boca. Pero sonríe.' },
				{ happy: { who: 'riolu', n: 15 } },
			], else: [
				{ text: 'Sacas el **Sintonizador de Bill**. Sin saber muy bien por qué, giras la ruedecita hasta el tope, al revés. Si escucha la señal, a lo mejor también sabe contestarle.', cond: 'has("sintonizadorbill")' },
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#9fd8ff', fissure: true }, start: 'dark', frames: [
					{ fx: 'shake', text: 'La columna de luz tartamudea. Pulsa a destiempo. Durante un instante, la frecuencia se rompe.' },
					{ fx: 'flash', text: 'Y en ese instante, Mewtwo abre los ojos. Levanta una mano. Los hilos de luz que le atraviesan se tensan, y se tensan, y se parten.' },
					{ fx: 'dark', text: 'Las columnas de cristal se derrumban. El anillo cruje por tres sitios. La luz se apaga. Silencio.' },
				] } },
			] },
			{ text: 'En la oscuridad, a la luz roja de las lámparas de emergencia, Mewtwo está de pie en el centro del anillo partido. Más alto de lo que parecía dentro de la luz. Más delgado.' },
			{ text: 'Mira a {riolu}, mucho rato. Luego te mira a ti. Luego mira a Magda, que no se ha movido de su silla y sigue escribiendo, con la mano un poco menos firme.', cond: LUC },
			{ text: 'Te mira, mucho rato. Luego mira a Magda, que no se ha movido de su silla y sigue escribiendo, con la mano un poco menos firme.', cond: '!(' + LUC + ')' },
			{ text: 'No dice nada. Ni dentro de tu cabeza ni fuera.' },
			{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#9fd8ff' }, start: 'dark', frames: [
				{ fx: 'glow', mon: 'mewtwo', text: 'Un golpe de aire. Las gotas del techo, durante un segundo, caen hacia arriba.' },
				{ fx: 'flash', text: 'Y ya no está. En el centro del anillo solo queda una marca en la roca, como si algo muy pesado hubiera estado ahí de pie mucho, mucho tiempo.' },
			] } },
			{ say: 'magda', text: 'Rendimiento: cuatro por ciento. —Lo dice en voz alta, para su libreta—. No está destruido. Está herido. Se puede reparar. Tardaremos meses. —Levanta la vista—. Y ahora no tenemos fuente.' },
			{ say: 'magda', text: 'Lo apunto como un fallo mío. No suyo. Usted ha hecho exactamente lo que dicen sus informes que hace.' },
			{ say: 'rotom', text: '¡Bzzt! La señal… cero. La del hilo, la de Caoba, la de las hojas. Todo a cero. —Pausa larga—. {jugador}. Se ha ido. Esa cosa… ese Mewtwo… se ha ido. ¿Adónde se va algo así?' },
			{ set: { 'flag.b04_mewtwo': true } },
			{ quest: 'b03_t_ondas', done: true },
			{ quest: 'b04_t_cueva', stage: 'abierto' },
			{ intel: { npc: 'magda', text: 'En la Cueva Celeste: cuando el nodo se dañó, midió «rendimiento: cuatro por ciento» y dijo que se puede reparar en meses. «Ahora no tenemos fuente».' } },
			{ call: 'b04_lebrun' },
		],

		// =================== LEBRUN ===================
		b04_lebrun: [
			{ if: DECIDIDO, then: [{ end: true }] },
			{ text: 'Pasos en la galería. Rápidos, desiguales, de alguien que corre por un sitio por donde no se debe correr. Una linterna que se balancea. Un resbalón. Un «¡ay!» muy digno.' },
			{ text: 'Handsome aparece en la boca de la sala, con la gabardina empapada hasta las rodillas y un casco de minero mal abrochado. Te ve. Se le cae el aire de los pulmones de alivio.' },
			{ say: 'handsome', text: '¡{jugador}! Estás bien. Estás entero. —Se apoya en una columna caída para recuperar el aliento—. Handsome ha bajado corriendo. Handsome no está hecho para bajar corriendo.' },
			{ if: 'flag.b03_vencejo_pluma || flag.b04_vencejo_pluma', then: [
				{ say: 'handsome', text: 'Una pluma gris en el parabrisas de mi coche, en Celeste. Con una flecha dibujada hacia la montaña. Tu amiga la de la capucha tiene una manera muy suya de avisar.' },
			], else: [
				{ say: 'handsome', text: 'Los guardias del «estudio geológico» han pasado por Celeste en desbandada, hacia Azafrán. Handsome ha pensado: si los guardias se van de un sitio, es que alguien tiene que entrar. Y ya habías entrado tú.' },
			] },
			{ text: 'Mira el anillo partido. Los cables. La marca en la roca. A Magda, sentada a su mesa, que sirve té en la tapa del termo.' },
			{ say: 'magda', text: 'Magda Ivers. Infraestructura. Le daría la mano, pero tengo el té.' },
			{ text: 'Antes de que Handsome pueda contestar, otros pasos. Estos no corren. Tranquilos, ordenados, a buen ritmo, de alguien que sabe exactamente adónde va porque tiene un plano.' },
			{ text: 'Dos agentes de Lemnis con chaleco y linternas. Y entre ellos, con su traje gris sin una arruga y una carpeta gorda bajo el brazo, el inspector **Lebrun**.' },
			{ say: 'lebrun', text: 'Handsome. Colaborador. Señora Ivers. —Un saludo con la cabeza para cada uno, en ese orden—. Llegó usted al fondo de esta cueva hace cincuenta y tres minutos, colaborador. Algo más que en la Cueva Brillante. Es comprensible. Aquí hay más agua.' },
			{ say: 'lebrun', text: 'A partir de este momento, la Policía Internacional se hace cargo de la escena. Yo me hago cargo. —Tiende la mano hacia Handsome—. Los datos, Handsome. Todos. Y retírese. Es una orden.' },
			{ say: 'lebrun', text: 'Ustedes dos. —A los agentes de Lemnis—. Acompañen a la señora Ivers a la salida. Es personal técnico, con permiso de estudio. Con cuidado.' },
			{ text: 'Magda se levanta. Enrosca el termo. Recoge la calculadora. Al pasar a tu lado, se detiene un segundo.' },
			{ say: 'magda', text: 'Me ha dejado el nodo en un cuatro por ciento. Eso no estaba en mis cálculos. —Casi parece un cumplido—. Volveremos a hacer las cuentas. Usted y yo.' },
			{ text: 'Y se va galería arriba, entre los dos agentes, con el abrigo gris rozando los cables cortados. Nadie la detiene.' },
			{ text: 'Handsome no se ha movido. Tiene la mano a medio camino del bolsillo de la gabardina, donde guarda las cosas importantes. Se ha quedado ahí, quieta.' },
			{ say: 'handsome', text: 'Inspector. —Muy despacio—. ¿La deja ir? Y… ¿cómo sabe usted a qué hora ha llegado {jugador} al fondo de la cueva? ¿Cincuenta y tres minutos? Yo acabo de llegar. Usted también.' },
			{ text: 'Lebrun abre la boca. La cierra. Ajusta la carpeta bajo el brazo.' },
			{ text: 'En tu bolsillo, la pantalla de la Pokédex se ha apagado sola. «Ahorro de energía», pone, en letras pequeñas. Rotom no dice nada.' },
			{ choice: [
				{ text: 'Sacar el informe «Fuente: L.».', cond: 'has("informefuentel")', then: [
					{ text: 'Sacas las hojas grapadas del archivo de Silph. Se las das a Handsome. Él las coge sin entender. Lee la primera línea. Luego la segunda.' },
				] },
				{ text: 'No decir nada. Mirar a Handsome.', then: [
					{ if: 'has("informefuentel")', then: [
						{ text: 'No dices nada. Handsome te mira. Lo ve en tu cara antes de que lo veas tú en la suya. Tiende la mano, abierta. Le das las hojas grapadas del archivo de Silph.' },
					], else: [
						{ text: 'No dices nada. Handsome te mira. Luego, muy despacio, saca del bolsillo de la gabardina unas hojas dobladas: la copia del informe de Silph que le pasaste en Azafrán. No las había vuelto a mirar. No había querido.' },
					] },
				] },
			], prompt: 'Lebrun espera. Handsome espera. La cueva gotea.' },
			{ say: 'handsome', text: '«Luminalia, llegada: seis y cuarenta y dos. Fuente: L.» —Lee en voz alta, sin entonación, como un niño que aprende a leer—. «Encinar: hora corregida por Fuente: L.» «Tren Magnético: llegada prevista ayer, real hoy. Fuente: L.»' },
			{ say: 'handsome', text: 'Seis y cuarenta y dos. Usted me lo dijo en la Agencia. Delante de mí. Con el Rhyhorn aparcado en doble fila delante de la panadería. Yo pensé: qué cuidadoso es Lebrun. Siempre sabe dónde está todo.' },
			{ say: 'lebrun', text: 'Un informe sin firma no es una prueba, Handsome. Es un papel con… —Se calla.' },
			{ text: 'Ha visto lo que hay grapado a la última hoja. Un caramelo de menta, envuelto en papel azul.' },
			{ if: 'flag.b02_frag_handsome', then: [
				{ say: 'handsome', text: 'La pieza. —Handsome se gira hacia el anillo. Hacia el metal oscuro con vetas azules encajado en el centro—. La de Iris. La que {jugador} me dio en mano y yo le di a usted en mano. «Extraviada en un traslado de depósito».' },
				{ text: 'Lebrun mira la pieza. Mucho rato.' },
				{ say: 'lebrun', text: 'El traslado lo firmé yo. Un martes. Vino un furgón sin logo. —Se pasa la mano por el bigote canoso, despacio—. Le mandé un caramelo para consolarle. Me pareció lo más honrado que podía hacer.' },
			] },
			{ if: 'flag.b02_frag_sera', then: [
				{ say: 'lebrun', text: 'Y la pieza que usted le devolvió a la señorita Lemnis está ahí, en el anillo. —Señala con la barbilla, sin mirar—. No pasó por mi mesa. No hizo falta. Las cosas de Lemnis siempre acaban donde Lemnis quiere.' },
			] },
			{ if: 'flag.b02_frag_melia', then: [
				{ text: 'En el bolsillo de tu chaqueta, todavía, la tarjeta negra de Melia. «Una vez. Úsala».' },
				{ choice: [
					{ text: 'Usar la tarjeta negra de Melia.', then: [
						{ set: { 'flag.b04_melia_tarjeta': true } },
						{ text: 'Marcas el número plateado. No da tono. A los diez segundos, la Pokédex se enciende sola, solo para mostrar un mensaje sin remitente.' },
						{ say: 'melia', as: 'Melia (mensaje)', text: 'La orden de busca contra mí la archivó él. Dos veces. Xero me lo contó riéndose: dice que el inspector nunca pedía dinero. Solo que no se le mencionara en las actas.' },
						{ say: 'melia', as: 'Melia (mensaje)', text: 'Ya no te debo nada. Me alegro. No me gusta deber cosas. —M.' },
						{ text: 'Se lo enseñas a Handsome. Él lo lee dos veces. La segunda, con los ojos cerrados.' },
					] },
					{ text: 'Guardarla. No hace falta.', then: [
						{ text: 'Dejas la tarjeta donde está. No hace falta. Ya no.' },
					] },
				] },
			] },
			{ text: 'Lebrun se sienta en una de las columnas de cristal caídas. Deja la carpeta en el suelo, a su lado. Es la primera vez que lo ves soltarla.' },
			{ say: 'lebrun', text: 'Mi hija se llama Camille. Hace seis años necesitó una operación que en Kalos tenía dos años de lista de espera. A ella le quedaban ocho meses.' },
			{ say: 'lebrun', text: 'Un amigo pagó una clínica de la Fundación Æther, en Alola. Nunca supe qué amigo. Camille tiene quince años ahora. Juega al voleibol. Muy mal. —Algo se le mueve en la cara—. Al mes siguiente de la operación me llegó el primer sobre.' },
			{ say: 'lebrun', text: 'Dentro, una hoja. Instrucciones muy educadas. Una hora, un nombre, un sitio. Firmadas con una sola letra griega: una omega. Y un caramelo de menta, en papel azul. Siempre un caramelo. Como una propina. O como una broma que solo entiende quien la hace.' },
			{ choice: [
				{ text: '«¿Quién manda los sobres?»', then: [
					{ say: 'lebrun', text: 'No lo sé. —Te mira a los ojos para que veas que es verdad—. Intenté saberlo. Una vez. Al día siguiente, Camille recibió un ramo de flores en el colegio. Sin tarjeta. No volví a intentarlo.' },
				] },
				{ text: '«¿Y Handsome? ¿No le importaba?»', then: [
					{ say: 'lebrun', text: 'Handsome era lo único limpio que tenía en la oficina. —No lo mira; no puede—. Por eso le devolvía las facturas por triplicado. Para que hubiera alguien que leyera algo mío que fuera verdad.' },
				] },
				{ text: '«¿Por qué no lo denunció?»', then: [
					{ say: 'lebrun', text: '¿A quién? ¿A la Policía? Yo soy la Policía, colaborador. He visto los presupuestos de los dos lados. La Policía no le gana a Lemnis. No esta década.' },
				] },
			] },
			{ say: 'lebrun', text: 'La fruta cae del lado al que se inclina el árbol. Yo solo me aparté para que no me cayera encima. A mí. A ella.' },
			{ text: 'Handsome se quita el casco de minero. Lo deja en el suelo con mucho cuidado, como si pudiera romperse. Se queda mirándolo.' },
			{ say: 'handsome', text: 'Yo te defendía. —No dice «Handsome». Dice «yo»—. En cada reunión. Cuando decían que eras gris, que eras un chupatintas, que no salías nunca de tu despacho, yo decía: no. Es cuidadoso. Lebrun es cuidadoso. Siempre sabe dónde está todo.' },
			{ say: 'handsome', text: 'Y era verdad. Siempre sabías dónde estaba todo. Dónde estaba {jugador}. Dónde estaba yo.' },
			{ text: 'Nadie dice nada durante un rato. La cueva gotea.' },
			{ if: LUC, then: [
				{ text: '{riolu}, todavía agotado, se acerca a Handsome y se le queda al lado. No lo toca. Solo se queda ahí, hombro con hombro, mirando al suelo con él.' },
			] },
			{ say: 'handsome', text: 'Tengo que hacer algo con esto, {jugador}, y ahora mismo no puedo pensar como un policía. Solo como su amigo. Y eso hoy no sirve. —Respira hondo—. Así que lo voy a decir en voz alta, y tú vas a decidir. Tú has bajado hasta aquí. Yo no.' },
			{ say: 'handsome', text: 'Puedo detenerlo. Aquí. Ahora. Esos dos agentes de ahí fuera lo verán salir esposado, y Lemnis sabrá esta misma noche que lo sabemos.' },
			{ say: 'handsome', text: 'O… —traga saliva— …puede volver mañana a su mesa, a las ocho, como siempre. Escribir sus informes. Y cada palabra que salga hacia esa omega la escribo yo. Que crean que nadie sabe nada.' },
			{ say: 'lebrun', text: 'O pueden dejarme ir. —Sin levantar la vista—. A cambio de lo único que sé: cómo me llegan los sobres. No es mucho. Es todo lo que tengo.' },
			{ quest: 'b04_m5', stage: 'decision' },
			{ choice: [
				{ text: 'Detenerlo.', then: [{ call: 'b04_lebrun_detenido' }] },
				{ text: 'Usarlo de cebo: que siga en su puesto.', then: [{ call: 'b04_lebrun_cebo' }] },
				{ text: 'Dejarlo ir a cambio del canal de órdenes.', then: [{ call: 'b04_lebrun_libre' }] },
			], prompt: '¿Qué hacéis con Lebrun?' },
			{ call: 'b04_lebrun_cierre' },
		],
		b04_lebrun_detenido: [
			{ set: { 'flag.b04_lebrun_detenido': true } },
			{ rep: { lemnis: -10, policia: 10 } },
			{ text: '«Deténgalo.»' },
			{ text: 'Handsome asiente. Saca unas esposas del bolsillo de la gabardina. Le tiemblan las manos y tarda dos intentos en abrirlas.' },
			{ text: 'Lebrun se levanta solo. Extiende las muñecas. No protesta. Las esposas hacen un ruido muy pequeño al cerrarse.' },
			{ say: 'lebrun', text: 'Que avisen a Camille antes que a la prensa. —Es lo único que pide—. Y que no le digan que fue por ella. No fue por ella. Fue por mí. Ella solo era la excusa más bonita que tenía.' },
			{ say: 'handsome', text: 'Se lo diré yo. En persona.' },
			{ text: 'Suben juntos por la galería. Handsome delante, con la linterna; Lebrun detrás, con las manos juntas y la carpeta bajo el brazo, porque nadie le ha dicho que la suelte.' },
			{ text: 'En la boca de la cueva, los dos agentes de Lemnis que se llevaron a Magda están fumando. Ven salir al inspector esposado. Uno de ellos deja caer el cigarro. El otro ya está sacando el teléfono.' },
			{ say: 'rotom', text: '…Lemnis lo sabe. Ya sabe que lo sabemos. —Lo dice muy bajito—. Supongo que eso también era inevitable.' },
			{ say: 'handsome', text: 'Me han llamado de Luminalia mientras subíamos. —Handsome guarda el teléfono—. Mando provisional de la delegación de Kalos. Su despacho. Su silla. —Pausa—. No sé si voy a poder sentarme en ella.' },
			{ intel: { npc: 'lebrun', text: 'Era «Fuente: L.»: el topo de Lemnis en la Policía Internacional. Recibía órdenes en sobres firmados con una omega (Ω), siempre con un caramelo de menta en papel azul. Lo hizo por una deuda: la operación de su hija Camille en una clínica de la Fundación Æther, pagada por «un amigo». No sabe quién manda los sobres. **Detenido** por Handsome en la Cueva Celeste. Lemnis lo sabe.' } },
			{ intel: { npc: 'handsome', text: 'Detuvo a Lebrun, su superior y amigo, en la Cueva Celeste. Ahora tiene el mando provisional de la delegación de Kalos de la Policía Internacional.' } },
		],
		b04_lebrun_cebo: [
			{ set: { 'flag.b04_lebrun_cebo': true } },
			{ rep: { policia: 5 } },
			{ text: '«Que siga en su puesto.»' },
			{ text: 'Handsome cierra los ojos un segundo. Cuando los abre, es otra persona. Una que no conoces mucho. Una que da un poco de miedo.' },
			{ say: 'handsome', text: 'Mañana a las ocho estará usted en su mesa. Con su carpeta. Con su traje gris. Hará sus informes por triplicado, como siempre. —Se agacha delante de Lebrun, a su altura—. Y antes de que salgan, los leeré yo. Cada línea. Cada hora. Cada «Fuente: L.».' },
			{ say: 'lebrun', text: 'Si se dan cuenta…' },
			{ say: 'handsome', text: 'Entonces le protegeré. Como le protegía antes. —Se levanta—. Sin saber de qué.' },
			{ text: 'Lebrun asiente. Tarda mucho en conseguir que la cabeza deje de asentir.' },
			{ say: 'lebrun', text: 'Le debo esto, colaborador. A usted. —Te mira, y por primera vez desde que lo conoces no hay ni una carpeta entre los dos—. No sé cómo se paga una cosa así. Lo averiguaré.' },
			{ text: 'Sale primero, solo, por la galería. Recto, con la carpeta bajo el brazo. Cuando pasa junto a los agentes de Lemnis de la boca de la cueva, les dice algo sobre «un derrumbe sin importancia» y «papeleo». Lo oyes desde dentro. La voz no le tiembla. Eso es lo que más miedo da.' },
			{ say: 'handsome', text: 'Lemnis cree que nadie sabe nada. —Handsome se pone el casco otra vez, despacio—. Ahora tenemos que hacer que lo siga creyendo. Tú y yo. Y él.' },
			{ intel: { npc: 'lebrun', text: 'Era «Fuente: L.»: el topo de Lemnis en la Policía Internacional. Recibía órdenes en sobres firmados con una omega (Ω), siempre con un caramelo de menta en papel azul. Lo hizo por una deuda: la operación de su hija Camille en una clínica de la Fundación Æther, pagada por «un amigo». No sabe quién manda los sobres. **Sigue en su puesto como cebo**: Handsome revisa todo lo que envía.' } },
			{ intel: { npc: 'handsome', text: 'Propuso usar a Lebrun de cebo: que siga en su mesa y que todo lo que salga hacia la omega pase antes por sus manos.' } },
		],
		b04_lebrun_libre: [
			{ set: { 'flag.b04_lebrun_libre': true } },
			{ rep: { policia: -5 } },
			{ text: '«Váyase. Pero antes, díganos cómo le llegan los sobres.»' },
			{ text: 'Lebrun te mira como si no acabara de creérselo. Luego abre la carpeta, arranca una hoja en blanco y escribe con letra de funcionario, despacio, clara.' },
			{ say: 'lebrun', text: 'Bulevar Sur de Luminalia, número catorce. Una fila de buzones de una mensajería que no existe: «Ómicron Envíos». El mío es el último de abajo. Los martes dejo lo mío. Los jueves hay un sobre nuevo. Siempre con la omega. Siempre con el caramelo.' },
			{ say: 'lebrun', text: 'Nunca he visto quién los deja. Puse una cámara una vez. Grabó un buzón durante una semana. El jueves, el sobre estaba dentro y la cinta, en blanco.' },
			{ text: 'Te da la hoja. La guardas.' },
			{ say: 'lebrun', text: 'No me buscarán ustedes. Me buscarán ellos. —Recoge la carpeta. Se lo piensa. La deja en el suelo, junto al anillo partido—. Quédensela. Ahí está todo lo que he archivado en seis años. Por triplicado.' },
			{ text: 'Se va galería arriba, sin linterna, con las manos en los bolsillos. A la tercera curva ya no se le oyen los pasos.' },
			{ say: 'handsome', text: 'No estoy de acuerdo. —Lo dice muy despacio, mirando la carpeta del suelo—. Pero tú estabas aquí abajo cuando yo no estaba. Y lo has decidido tú. Lo respeto. Hoy no puedo hacer otra cosa que respetarlo.' },
			{ intel: { npc: 'lebrun', text: 'Era «Fuente: L.»: el topo de Lemnis en la Policía Internacional. Recibía órdenes en sobres firmados con una omega (Ω), siempre con un caramelo de menta en papel azul. Lo hizo por una deuda: la operación de su hija Camille en una clínica de la Fundación Æther, pagada por «un amigo». **Lo dejaste ir.** A cambio, el canal: buzón del Bulevar Sur 14 de Luminalia («Ómicron Envíos»), entregas los martes, respuesta los jueves. Dejó su carpeta de seis años de archivos.' } },
			{ intel: { npc: 'handsome', text: 'No estuvo de acuerdo en dejar ir a Lebrun, pero respetó tu decisión. Se quedó con la carpeta de seis años de archivos de Lebrun.' } },
		],
		b04_lebrun_cierre: [
			{ quest: 'b04_t_lebrun', stage: 'hecha', done: true },
			{ text: 'Handsome se queda un momento más en la sala del nodo. Recoge las hojas del informe del suelo, las alisa con la palma de la mano y se las guarda en el bolsillo de dentro de la gabardina. El de las cosas importantes.' },
			{ say: 'handsome', text: 'Gracias, {jugador}. Por bajar. Por no dejarme leerlo solo. —Intenta sonreír. Casi le sale—. Handsome… Yo. Handsome tiene que volver a Kalos. Hay que reorganizar muchas cosas. Muchos cajones.' },
			{ say: 'handsome', text: 'Sube cuando quieras. No tengas prisa. Esta cueva se ha ganado que alguien la mire un rato sin querer nada de ella.' },
			{ text: 'Y se va. Por primera vez desde que lo conoces, no tropieza con nada al salir.' },
		],

		// =================== SALIDA Y FINAL ===================
		b04_salida: [
			{ if: 'flag.b04_fin', then: [{ end: true }] },
			{ text: 'Subes por la galería. Sin la columna de luz, la cueva está oscura de verdad, y los cristales de las paredes brillan solos: un azul suave, quieto, que ya no late. Como debieron de brillar siempre.' },
			{ text: 'En la encrucijada de las doce galerías, donde el Sintonizador te guiaba, oyes un ruido que no es de la cueva. Un acordeón cogiendo aire, muy hondo, y soltándolo en un resoplido.' },
			{ text: 'Entre dos columnas de cristal hay una cabina de madera azul, con su farolillo y sus ventanitas. La puerta se abre de golpe. Sale un hombre de rizos castaños y abrigo granate. Y detrás, la bufanda. Y sigue saliendo.' },
			{ say: 'viajero', text: '¡{jugador}! ¡Debajo de una montaña! ¡Me encanta debajo de una montaña! ¿Qué día es? Martes. No me lo digas. —Se para en seco, con la cabeza ladeada—. Escucha. ¿Lo oyes?' },
			{ say: 'viajero', text: 'No, claro que no lo oyes. Es que no se oye nada. ¡Eso es lo que hay que oír! —Da una palmada—. El pequeñito. Desde lo del lago estaba temblando, todo el rato, como un vaso encima de una mesa cuando pasa un tren por debajo. Y hace una hora… ¡zas! Quieto. Dormido. Respirando a su ritmo. Bueno, a destiempo, que es su ritmo.' },
			{ say: 'viajero', text: 'Lo que habéis roto ahí abajo le hacía daño desde muy lejos. Gracias. De su parte. Él no sabe dar las gracias todavía. Aprenderá. Aprendió.' },
			{ if: 'has("ambarsinregistro")', then: [
				{ text: 'En tu mochila, el **Ámbar sin registro** está tibio. El brillo azul de dentro late despacio, tranquilo, como un corazón pequeño que por fin se ha dormido.' },
				{ say: 'viajero', text: '¿Ves? Él también. Los dos duermen a la vez. Eso es buena señal. O muy mala. Pero hoy es buena.' },
			] },
			{ if: LUC, then: [
				{ text: 'Ulises se agacha delante de {riolu}, que todavía camina despacio, con las palmas enrojecidas.' },
				{ say: 'viajero', text: 'Has dado mucho hoy, ¿eh? Más de lo que tenías. —Le pone un dedo en la frente, muy serio—. No lo hagas siempre. Hay quien da hasta que no le queda. Y luego se lo tienen que devolver otros.' },
			] },
			{ text: 'Y entonces se queda quieto. Del todo. Mira la cueva, las paredes azules, a ti. Y parece de pronto mucho más viejo de lo que es.' },
			{ say: 'viajero', text: 'Ya falta poco para que me necesites. O para que te necesite yo. Uno de los dos.' },
			{ say: 'viajero', text: '…Eso tampoco lo he dicho. ¡Me voy! ¡Llego tarde a algo que todavía no ha empezado!' },
			{ text: 'Se mete en la cabina. La bufanda tarda un poco más. El acordeón respira hondo. Cuando se apaga, en el suelo de la cueva queda un cuadrado de roca seca, en un sitio donde todo gotea.' },
			{ intel: { npc: 'viajero', text: 'En la Cueva Celeste: «el pequeñito» dejó de temblar cuando se dañó el nodo. «Ya falta poco para que me necesites. O para que te necesite yo. Uno de los dos».' } },
			{ text: 'Sigues subiendo. El aire cambia. Huele a río. Y, al final de la galería, la boca de la cueva es un rectángulo gris pálido que se va volviendo rosa.' },
			{ text: 'Está amaneciendo. Has pasado la noche entera ahí abajo y no te habías dado cuenta.' },
			{ text: 'En la orilla del río, delante de la boca de la cueva, hay un hombre. Tan alto que el acantilado parece de su tamaño. El pelo blanco, larguísimo. La ropa oscura. En el hombro, la Floette de la flor roja, con los ojos cerrados contra el sol.' },
			{ text: 'No sabes cómo ha llegado a Kanto. Tampoco esta vez te lo va a decir.' },
			{ if: LUC, then: [
				{ text: '{riolu} se le acerca sin miedo y se queda a su lado, mirando el amanecer con él. La Floette abre un ojo, mira a {riolu}, y se baja del hombro del hombre para sentarse en la cabeza de {riolu}. {riolu} no se mueve. Ni respira, casi.' },
				{ happy: { who: 'riolu', n: 5 } },
			] },
			{ say: 'az', text: 'Algo ha pasado volando sobre mí antes del alba. —Su voz es lenta, como si cada palabra hubiera tenido que cruzar mucha distancia—. Pensé que era muy viejo. No era viejo. Estaba cansado. A veces se parecen.' },
			{ say: 'az', text: 'A él también lo hicieron unas manos que querían algo de él. —Acaricia la flor de la Floette con un dedo enorme—. Como a mí.' },
			{ choice: [
				{ text: '«Lo hemos liberado.»', then: [
					{ say: 'az', text: 'Hoy. —No suena a reproche. Suena a verdad—. Hoy se ha negado a pagar. Bien. Pero la cuenta no se ha cerrado. Buscarán otra vida que la pague. La energía que no se acaba nunca cierra la cuenta. Solo le cambia el nombre.' },
				] },
				{ text: '«¿Por qué está aquí?»', then: [
					{ say: 'az', text: 'Porque ella quería ver amanecer en un sitio donde alguien hubiera dicho que no. —Mira a la Floette—. Y aquí alguien ha dicho que no.' },
					{ say: 'az', text: 'Pero recuérdalo: la cuenta no se ha cerrado. Buscarán otra vida que la pague. La energía que no se acaba nunca cierra la cuenta. Solo le cambia el nombre.' },
				] },
				{ text: 'Quedarte a su lado, en silencio, viendo salir el sol.', then: [
					{ text: 'El sol sale despacio por detrás de Celeste. El río se pone de oro. Ninguno de los dos dice nada en mucho rato.' },
					{ say: 'az', text: 'La cuenta no se ha cerrado. —Lo dice al final, sin mirarte—. Buscarán otra vida que la pague. La energía que no se acaba nunca cierra la cuenta. Solo le cambia el nombre.' },
				] },
			] },
			{ text: 'La Floette vuelve a su hombro. El hombre echa a andar río abajo, sin prisa. Cuando el sol te da en los ojos y parpadeas, ya no está. En la piedra donde estaba, una flor roja. No se marchita.' },
			{ say: 'rotom', text: '¡Bzzt! Nada otra vez. Ni foto, ni ficha. —Pausa—. Cuatro veces ya. He dejado de pensar que es un fallo mío. Ahora pienso que es un fallo del mundo.' },
			{ if: 'flag.b02_frag_sera', then: [
				{ text: 'La Pokédex vibra. Un mensaje con una lemniscata plateada como firma.' },
				{ say: 'sera', as: 'Serafina (mensaje)', text: 'Pedí ver la pieza que usted me devolvió en Iris. Me han dicho que está «en uso». Nadie ha sabido decirme en uso de qué. —S.', cond: '!flag.b01_trato_sera' },
				{ say: 'sera', as: 'Serafina (mensaje)', text: 'Si usted lo sabe, no me lo diga por este canal.', cond: '!flag.b01_trato_sera' },
				{ say: 'sera', as: 'Serafina (mensaje)', text: 'Pedí ver la pieza que me devolviste en Iris. Me han dicho que está «en uso». Nadie ha sabido decirme en uso de qué. —S.', cond: 'flag.b01_trato_sera' },
				{ say: 'sera', as: 'Serafina (mensaje)', text: 'Si lo sabes, no me lo digas por este canal. Dímelo en persona.', cond: 'flag.b01_trato_sera' },
			] },
			{ say: 'rotom', text: 'Oye, {jugador}. Mira lo que tengo en la galería. —La pantalla se enciende sola—. Una foto. De dentro de la cueva. Toda azul. Es preciosa.' },
			{ say: 'rotom', text: '…No me acuerdo de haberla hecho. —Pausa—. Será que estaba muy emocionado. Me pasa. Bueno, no me pasa nunca. Pero hoy ha sido un día de cosas que no pasan nunca.' },
			{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#9fd8ff' }, start: 'dark', frames: [
				{ item: 'fotocueva', fx: 'light', text: 'En la pantalla: la sala del nodo, iluminada entera por un aura azul. En el centro, una silueta pequeña con las palmas levantadas, y alrededor, todos los cristales de la cueva encendidos a la vez, como un cielo al revés.' },
				{ fx: 'zoom', text: 'Arriba, en la esquina, desenfocada, muy alta y muy pálida, una figura con una cola larga. Mira hacia abajo. Hacia la silueta pequeña.' },
				{ text: 'La foto está tomada desde un ángulo raro. Desde más arriba de donde llevabas la Pokédex. Rotom le ha puesto de título «Aura».' },
			] } },
			{ give: 'fotocueva' },
			{ text: 'Y otra vez. Una notificación de la Gira, para todos los inscritos.' },
			{ say: 'rotom', text: '¡Bzzt! «Enhorabuena a los participantes clasificados para la Copa Infinita. La Gira continúa. Próximo destino: **Alola**. Sol, playa, pruebas en vez de gimnasios… ¡y algo muy especial en el cielo! Detalles muy pronto».' },
			{ say: 'rotom', text: '¡Alola! ¡Islas! ¡Malasadas! —Pausa—. No sé qué es una malasada. Lo he buscado y sigo sin saberlo. Tengo muchísimas ganas de saberlo.' },
			{ if: LUC, then: [
				{ text: '{riolu} se sienta en la orilla, con los pies en el agua fría del río, y mira el sol. Tú te sientas a su lado. Te apoya la cabeza en el hombro un segundo. Solo uno. Luego hace como si no hubiera pasado.' },
			] },
			{ cap: 56 },
			{ quest: 'b04_m5', done: true },
			{ set: { 'flag.b04_fin': true } },
			{ diary: 'Hoy mi entrenador{|a|e} y yo bajamos a una cueva tan profunda que se nos hizo de noche sin enterarnos. ¡Estaba llena de cristales azules que brillaban solos! Era como estar dentro de una lámpara.\n\nConocimos a una señora muy ordenada que bebía té y sabía muchísimas matemáticas. Combatimos con ella. ¡Estuvimos increíbles! Luego vino Handsome a buscarnos, muy preocupado, el pobre, con un casco que le quedaba grande. Hablaron de cosas de trabajo durante mucho rato. Yo me quedé dormido un poquito.\n\nCuando salimos estaba amaneciendo y hacía un frío precioso. Encontré en mi galería una foto que no me acuerdo de haber hecho, pero es la más bonita que tengo. La he llamado «Aura».\n\n¡Y nos vamos a Alola! ¡Mi entrenador{|a|e} está clasificad{o|a|e} para la Copa Infinita! Estoy muy orgulloso. Mañana será otro día. ¡Seguro que es un buen día!', cond: 'flag.b01_diario' },
			{ go: 'celeste', silent: true },
			{ save: true },
			{ text: '**Fin del Acto III.**' },
			{ text: '*La historia continúa…*' },
		],

		// =================== OTROS ===================
		b04_manantial: [
			{ if: 'flag.b04_fin', then: [
				{ text: 'El manantial entre los cristales. Sin el zumbido del nodo, el agua suena distinto: más clara, como una conversación en voz baja.' },
			], else: [
				{ text: 'Un manantial de agua clara brota entre dos columnas de cristal. Está tan fría que duele, y luego deja de doler.' },
			] },
			{ heal: 'Tus Pokémon beben y descansan junto al manantial. Se levantan con fuerzas renovadas.' },
		],
		b04_nodo_despues: [
			{ text: 'El anillo de metal, partido por tres sitios. Las columnas de cristal caídas. Los cables colgando, cortados.' },
			{ if: PIEZA_EN_NODO, then: [
				{ text: 'La pieza de metal oscuro sigue encajada en el centro. Las vetas ya no brillan. Alguien de Lemnis vendrá a por ella tarde o temprano. Hoy no.' },
			] },
			{ text: 'En el centro, la marca en la roca. Si pones la mano encima, todavía está tibia.' },
			{ text: '{riolu} no se acerca al anillo. Se queda en la entrada de la sala, mirando la marca, con las orejas hacia delante. Como quien espera a alguien que sabe que no va a volver. Por ahora.', cond: LUC },
		],
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		cristales_celeste: {
			name: 'Columnas de cristal azul', icon: '💎', hours: 20, picks: [1, 2],
			text: 'Pasas la mano por las columnas de cristal. Algunas esquirlas se sueltan solas, como si la cueva te las diera.',
			wait: 'Las columnas están limpias. Las esquirlas nuevas tardan en crecer. Cosa de cuevas: aquí abajo todo tiene otro reloj.',
			table: [
				{ id: 'stardust', w: 18, n: [1, 2] }, { id: 'hardstone', w: 14, n: [1, 1] }, { id: 'starpiece', w: 10, n: [1, 1] },
				{ id: 'moonstone', w: 8, n: [1, 1] }, { id: 'thunderstone', w: 6, n: [1, 1] }, { id: 'dawnstone', w: 4, n: [1, 1] },
				{ id: 'cometshard', w: 2, n: [1, 1], cond: 'flag.b04_fin' },
			],
		},
		charca_celeste: {
			name: 'Charca entre las rocas', icon: '💧', hours: 18, picks: [1, 3],
			text: 'Metes la mano en la charca. El agua está helada y tan clara que parece que no hay agua. En el fondo, entre la grava, hay cosas.',
			wait: 'La charca está quieta. Solo grava y tu reflejo, con cara de frío.',
			table: [
				{ id: 'freshwater', w: 20, n: [1, 2] }, { id: 'pearl', w: 14, n: [1, 1] }, { id: 'tinymushroom', w: 12, n: [1, 2] },
				{ id: 'bigmushroom', w: 6, n: [1, 1] }, { id: 'everstone', w: 6, n: [1, 1] }, { id: 'nugget', w: 2, n: [1, 1] },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		zona_cueva_celeste: {
			name: 'Cueva Celeste', type: 'Steel', rec: 54,
			cond: 'visited("cueva_celeste")',
			info: [
				{ text: 'Una cueva profunda al oeste de Ciudad Celeste. Lemnis la tiene cerrada «por estudio geológico».' },
				{ cond: 'flag.b04_m_aviso', text: 'Guardias y técnicos de Lemnis, niveles 51 a 54. Mucho **Acero** y mucho **Eléctrico**: el **Fuego**, la **Tierra** y la **Lucha** van bien.' },
				{ cond: 'flag.b04_m_aviso', text: 'En el lago subterráneo, el turno de descanso combate para pasar el rato (entrenamiento, tope 54).' },
				{ cond: 'flag.b04_m_aviso', text: 'Las galerías del fondo son un laberinto. Hace falta algo que siga la señal.' },
				{ cond: 'flag.b04_fin', text: '✔ La señal está apagada.' },
			],
		},
	},
};
