// Bloque 2 · Tramo 0: «Kalos se despide».
// El jugador vuelve de Yantra a Luminalia. Agencia (Handsome, Matière, Lebrun), Rouxel cae, Noa y el
// Pokémon de la manta, Héctor conoce a Matière, A.Z. junto a la Puerta, Lucien en la cola, Philippe,
// Remedios, Ciprés, el Conde, el encargo de Sera, revanchas de líderes y «nueva temporada» en rutas viejas.
// Termina en la ceremonia de la Gira: la Puerta desvía al jugador (lo que pasa al llegar es del T1).
// Todo va como `patches` sobre lugares del B1, salvo la sub-área nueva `centro_procesamiento`.

const FIN = '!flag.b02_puerta_cruzada';
const T0 = 'flag.b02_inicio_hecho';
const CEREMONIA_LISTA = 'flag.b02_agencia_hecha && flag.b02_noa_hecha';
const LUCIEN_OK = 'quest.b02_s_lucien != "devolver"';
const CROMLECH_NINGUNA = '!flag.b01_delatar && !flag.b01_handsome && !flag.b01_trato_sera';

export default {
	// =====================================================================
	// LUGARES NUEVOS
	// =====================================================================
	locations: {
		centro_procesamiento: {
			name: 'Centro de procesamiento de Lemnis', parent: 'luminalia', kind: 'building',
			bg: { type: 'indoor', wall: '#dfe7f2', floor: '#6f7a90' },
			desc: 'Una nave blanca detrás del Bulevar Este, sin ventanas. Dentro, filas y filas de **jaulas de contención** acolchadas, con la lemniscata bordada en cada cojín. Huele a desinfectante y a pienso caro.\n\nCasi todas están vacías.',
			descs: [{ cond: 'flag.b02_noa_hecha', text: 'La puerta trasera está cerrada con un candado nuevo. Por la rendija se ven las jaulas vacías, en fila, como camas de un hospital que nadie usa.' }],
			spots: [
				{ label: 'Las etiquetas de las jaulas', icon: '🏷️', talk: [{ script: 'b02_centro_etiquetas' }] },
			],
		},
	},

	// =====================================================================
	// PARCHES A LUGARES DEL B1
	// =====================================================================
	patches: {
		// ---------- Luminalia ----------
		luminalia: {
			spots: [
				{ label: 'Un mensaje de Noa', sub: '«Puerta trasera del Bulevar Este. Ven sol{o|a|e}.»', icon: '📩', cond: 'quest.b02_t_noa == "centro" && !flag.b02_noa_hecha', new: 'true', script: 'b02_noa_centro' },
				{ label: 'Un oficinista frente a la Agencia', sub: 'Lleva diez minutos con la mano en el pomo', icon: '🦸', cond: 'flag.b02_agencia_hecha && !flag.b02_hector_matiere', new: 'true', talk: [{ script: 'b02_hector' }] },
				{ label: 'El Holomisor de Serafina', sub: 'Vibra en tu bolsillo. Frío, como siempre', icon: '📳', cond: 'flag.b01_trato_sera && has("holomisorsera") && flag.b02_agencia_hecha && !flag.b02_sera_encargo && ' + FIN, new: 'true', script: 'b02_sera_encargo' },
			],
			rumors: [
				{ cond: T0 + ' && ' + FIN, text: 'Dicen que la noche en que la Puerta se encendió sola, alguien entró en la Central de Kalos. Y que salió por la puerta, como si tuviera llave.' },
				{ cond: T0 + ' && ' + FIN, text: 'La Gira sale de la Plaza de la Torre Prisma. Los novatos cruzan de cuatro en cuatro. Hay gente que ha pedido el día libre para verlo.' },
				{ cond: 'flag.b02_rouxel_caido', text: 'En Lemnis Kalos han cambiado al director. El nuevo no sale en los anuncios. Nadie sabe cómo se llama.' },
			],
		},
		agencia: {
			spots: [
				{ label: 'Handsome, Matière… y el inspector', sub: 'Te estaban esperando', icon: '🕵️', cond: T0 + ' && !flag.b02_agencia_hecha', new: 'true', talk: [{ script: 'b02_agencia' }] },
				{ label: 'Handsome, con un mapa de Johto', sub: 'Lleno de chinchetas', icon: '🗺️', cond: 'flag.b02_agencia_hecha && ' + FIN, talk: [{ script: 'b02_agencia_despues' }] },
			],
		},
		luminalia_plaza: {
			descs: [{ cond: T0 + ' && ' + FIN, text: 'Gradas nuevas alrededor de la **Puerta Lemnis**, banderines de Kalos y de Johto, y un escenario con un atril de cristal. Un cartel enorme: «**Primera Gira Interregional · Destino: Ciudad Trigal (Johto)**».\n\nLa Puerta está apagada. Aun así, si te acercas, zumba.' }],
			spots: [
				{ label: 'Un hombre enorme junto a la Puerta', sub: 'Con una flor roja en el hombro', icon: '🌺', cond: T0 + ' && !flag.b02_az_hecho && ' + FIN, new: 'true', talk: [{ script: 'b02_az' }] },
				{ label: 'Un novato con una gorra enorme', sub: 'En la cola de la Gira. Mide metro y medio', icon: '🧢', cond: 'flag.b02_agencia_hecha && !quest.b02_s_lucien && ' + FIN, new: 'true', talk: [{ script: 'b02_lucien_cola' }] },
				{ label: 'Philippe, con un cartel de «SE ALQUILA»', sub: 'Señala un ático. Y la Puerta. Y el ático', icon: '🏢', cond: T0 + ' && !flag.b02_philippe && ' + FIN, new: 'true', talk: [{ script: 'b02_philippe' }] },
				{ label: 'La ceremonia de la Gira', sub: 'Los novatos se ponen en fila', icon: '♾️', cond: CEREMONIA_LISTA + ' && ' + LUCIEN_OK + ' && ' + FIN, new: 'true', script: 'b02_ceremonia' },
				{ label: 'La ceremonia de la Gira', sub: 'Todavía montan el escenario', icon: '♾️', cond: T0 + ' && !(' + CEREMONIA_LISTA + ' && ' + LUCIEN_OK + ') && ' + FIN, talk: [{ script: 'b02_ceremonia_espera' }] },
			],
		},
		luminalia_sur: {
			spots: [
				{ label: 'Un hombre con una caja de cartón', sub: 'Traje caro. Corbata roja, aflojada', icon: '📦', cond: T0 + ' && !flag.b02_rouxel_caido', new: 'true', talk: [{ script: 'b02_rouxel' }] },
				{ label: 'Una señora mayor en un banco', sub: 'Con una bolsa de pan y una flor en el pelo', icon: '🍞', cond: T0 + ' && !flag.b02_remedios', new: 'true', talk: [{ script: 'b02_remedios' }] },
				{ label: 'Una señora que grita «¡LUCIEN!»', sub: 'Con una gorra de repuesto en la mano', icon: '🗣️', cond: 'quest.b02_s_lucien == "devolver" && flag.b02_lucien_rumbo_madre', new: 'true', talk: [{ script: 'b02_lucien_madre' }] },
			],
		},
		lab_cipres: {
			spots: [
				{ label: 'Despedirte del Prof. Ciprés', sub: 'Está empaquetando un telescopio', icon: '🔭', cond: T0 + ' && !flag.b02_cipres && ' + FIN, new: 'true', talk: [{ script: 'b02_cipres' }] },
				{ label: 'Llevar a Lucien con el profesor', sub: 'Lucien camina detrás de ti, arrastrando los pies', icon: '🧢', cond: 'quest.b02_s_lucien == "devolver" && flag.b02_lucien_rumbo_cipres', new: 'true', talk: [{ script: 'b02_lucien_cipres' }] },
			],
		},
		lemnis_kalos: {
			descs: [{ cond: 'flag.b02_rouxel_caido', text: 'El vestíbulo de cristal, igual de limpio. En la pared, donde estaba la foto sonriente del director, hay un rectángulo más claro y un cartel provisional: «**Dirección de Lemnis Kalos: en reestructuración**». La recepcionista sigue sonriendo. Un poco menos.' }],
		},

		// ---------- Vánitas ----------
		castillo_caduco: {
			spots: [
				{ label: 'El Conde, ante un retrato', sub: 'El más antiguo. El del barniz negro', icon: '🖼️', cond: T0 + ' && flag.b01_conde_1 && !flag.b02_conde', new: 'true', talk: [{ script: 'b02_conde' }] },
			],
		},

		// ---------- Revanchas de líderes ----------
		gym_novarte: {
			spots: [
				{ label: 'Revancha con Brock', sub: 'Nueva temporada · opcional', icon: '🪨', cond: T0 + ' && beat("brock_g1")', new: '!beat("brock_r2")', talk: [{ cond: 'beat("brock_r2")', script: 'b02_brock_r2_despues' }, { script: 'b02_brock_revancha' }] },
			],
		},
		gym_relieve: {
			spots: [
				{ label: 'Revancha con Blanca', sub: 'Nueva temporada · opcional', icon: '🎀', cond: T0 + ' && beat("blanca_g2")', new: '!beat("blanca_r2")', talk: [{ cond: 'beat("blanca_r2")', script: 'b02_blanca_r2_despues' }, { script: 'b02_blanca_revancha' }] },
			],
		},
		gym_yantra: {
			spots: [
				{ label: 'Revancha con Corelia', sub: 'Nueva temporada · opcional', icon: '🛼', cond: T0 + ' && beat("corelia_g3")', new: '!beat("corelia_r2")', talk: [{ cond: 'beat("corelia_r2")', script: 'b02_corelia_r2_despues' }, { script: 'b02_corelia_revancha' }] },
			],
		},

		// ---------- «Nueva temporada» en rutas viejas ----------
		ruta4: {
			route: {
				tramos: {
					3: [{ trainer: 'nt_r4_berenice', optional: true, label: 'Una florista mete semillas en una maleta', cond: T0 }],
					6: [{ text: 'En la fuente de los tres Flabébé de piedra alguien ha dejado una banderita de Johto. Se mueve con el viento como si saludara.', cond: T0 + ' && ' + FIN }],
				},
				encounters: {
					flowers: [
						{ sp: 'floette', lv: [28, 30], w: 18, cond: T0 },
						{ sp: 'fletchinder', lv: [28, 30], w: 12, cond: T0 },
						{ sp: 'ledian', lv: [28, 30], w: 10, cond: T0 },
						{ sp: 'roselia', lv: [28, 30], w: 10, cond: T0 },
						{ sp: 'vespiquen', lv: [29, 31], w: 6, cond: T0 },
						{ sp: 'kirlia', lv: [29, 31], w: 3, cond: T0 },
						{ sp: 'oinkologne', lv: [28, 30], w: 5, displaced: true, cond: T0 },
					],
				},
			},
		},
		ruta5: {
			route: {
				tramos: {
					4: [{ trainer: 'nt_r5_cyprien', optional: true, label: 'Un patinador ensaya un salto con la mochila puesta', cond: T0 }],
					5: [
						{ text: 'Donde estaba el campamento de Lemnis queda un rectángulo de hierba amarilla, aplastada por las jaulas. Alguien ha clavado en medio un cartel a mano: «¿Y A DÓNDE?». Es la misma letra que la de las vallas.', cond: T0 },
						{ spot: { action: { gather: 'campamento_vacio' } }, label: 'Rebuscar en la hierba aplastada', icon: '🔍', cond: T0 },
					],
				},
				encounters: {
					grass: [
						{ sp: 'diggersby', lv: [28, 30], w: 14, cond: T0 },
						{ sp: 'furfrou', lv: [28, 30], w: 12, cond: T0 },
						{ sp: 'gogoat', lv: [32, 33], w: 8, cond: T0 },
						{ sp: 'pangoro', lv: [32, 33], w: 7, cond: T0 },
						{ sp: 'scraggy', lv: [29, 31], w: 5, cond: T0 },
						{ sp: 'kadabra', lv: [28, 30], w: 6, time: 'night', cond: T0 },
						{ sp: 'dubwool', lv: 29, w: 4, displaced: true, cond: T0 },
					],
				},
			},
		},
		ruta7: {
			route: {
				tramos: {
					3: [{ trainer: 'nt_r7_eulalie', optional: true, label: 'Una pintora tapa su lienzo cuando la miras', cond: T0 }],
					5: [{ item: 'bigmushroom', hidden: true, cond: T0 }],
				},
				encounters: {
					grass: [
						{ sp: 'croagunk', lv: [29, 31], w: 10, cond: T0 },
						{ sp: 'ducklett', lv: [28, 30], w: 10, cond: T0 },
						{ sp: 'smeargle', lv: [29, 31], w: 8, cond: T0 },
						{ sp: 'roselia', lv: [28, 30], w: 8, cond: T0 },
						{ sp: 'volbeat', lv: [28, 30], w: 6, time: 'night', cond: T0 },
						{ sp: 'illumise', lv: [28, 30], w: 6, time: 'night', cond: T0 },
					],
					flowers: [
						{ sp: 'floette', lv: [28, 30], w: 16, cond: T0 },
						{ sp: 'smeargle', lv: [29, 31], w: 8, cond: T0 },
						{ sp: 'spritzee', lv: [28, 30], w: 6, cond: T0 },
						{ sp: 'swirlix', lv: [28, 30], w: 6, cond: T0 },
					],
				},
			},
		},
		ruta10: {
			route: {
				tramos: {
					6: [{ trainer: 'nt_r10_dorian', optional: true, label: 'Un montañero mira el cielo con unos prismáticos', cond: T0 }],
					8: [{ trainer: 'nt_r10_florian', optional: true, label: 'Un chico sentado en un menhir, con dos medallas en la gorra', cond: T0 }, { item: 'ultraball', n: 2, hidden: true, cond: T0 }],
				},
				encounters: {
					grass: [
						{ sp: 'golett', lv: [28, 30], w: 14, cond: T0 },
						{ sp: 'sigilyph', lv: [29, 31], w: 10, cond: T0 },
						{ sp: 'hawlucha', lv: [29, 31], w: 8, cond: T0 },
						{ sp: 'granbull', lv: [29, 31], w: 8, cond: T0 },
						{ sp: 'manectric', lv: [29, 31], w: 7, cond: T0 },
						{ sp: 'houndoom', lv: [30, 31], w: 4, time: 'night', cond: T0 },
						{ sp: 'dachsbun', lv: [28, 30], w: 4, displaced: true, cond: T0 },
					],
				},
			},
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Revanchas (nueva temporada) -----
		brock_r2: { name: 'Brock', cls: 'Líder', npc: 'brock', ai: 5, reward: 2400, bg: 'gym',
			team: [
				{ sp: 'boldore', lv: 35, moves: ['rockslide', 'bulldoze', 'irondefense', 'smackdown'], ability: 'sturdy', item: 'sitrusberry', nature: 'impish', iv: 27 },
				{ sp: 'graveler', lv: 35, moves: ['rockslide', 'earthquake', 'firepunch', 'rollout'], ability: 'rockhead', item: 'hardstone', nature: 'adamant', iv: 27 },
				{ sp: 'kabuto', lv: 36, moves: ['aquajet', 'rockslide', 'liquidation', 'knockoff'], ability: 'battlearmor', item: 'eviolite', nature: 'jolly', iv: 28 },
				{ sp: 'steelix', lv: 37, moves: ['ironhead', 'earthquake', 'rockslide', 'crunch'], ability: 'rockhead', item: 'leftovers', nature: 'adamant', iv: 30 },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'Nueva temporada, equipo nuevo. Bueno, equipo viejo con más años. Como yo. ¡Vamos allá!',
			win: '¡Ja! Me has vuelto a partir. Esta vez, en dos tortillas.',
			lose: 'La roca aguanta. Siempre aguanta. Vuelve cuando quieras: la pared no se mueve.' },
		blanca_r2: { name: 'Blanca', cls: 'Líder', npc: 'blanca', ai: 5, reward: 2400, bg: 'gym',
			team: [
				{ sp: 'clefable', lv: 35, moves: ['moonblast', 'thunderwave', 'meteormash', 'softboiled'], ability: 'magicguard', item: 'sitrusberry', nature: 'bold', iv: 27 },
				{ sp: 'furfrou', lv: 35, moves: ['return', 'bite', 'uturn', 'thunderwave'], ability: 'furcoat', item: 'silkscarf', nature: 'jolly', iv: 27 },
				{ sp: 'lopunny', lv: 36, moves: ['drainpunch', 'return', 'bounce', 'icepunch'], ability: 'limber', item: 'expertbelt', nature: 'jolly', iv: 28 },
				{ sp: 'miltank', lv: 37, moves: ['rollout', 'milkdrink', 'bodyslam', 'earthquake'], ability: 'thickfat', item: 'leftovers', nature: 'impish', iv: 30 },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: '¡Nueva temporada! ¡Nueva yo! ¡Misma Miltank! ¡A rodar!',
			win: '¡Waaah! ¡Otra vez! ¡Y eso que esta vez traía pañuelos de reserva!',
			lose: '¡Gané! ¡Gané la revancha! ¡Voy a llorar de alegría, que es como llorar normal pero con sonrisa!' },
		corelia_r2: { name: 'Corelia', cls: 'Líder', npc: 'corelia', ai: 5, reward: 3000, bg: 'gym', gimmick: 'mega', ace: 'lucario',
			team: [
				{ sp: 'mienfoo', lv: 36, moves: ['fakeout', 'drainpunch', 'uturn', 'stoneedge'], ability: 'regenerator', item: 'expertbelt', nature: 'jolly', iv: 28 },
				{ sp: 'pangoro', lv: 36, moves: ['crunch', 'drainpunch', 'bulletpunch', 'bulkup'], ability: 'ironfist', item: 'blackglasses', nature: 'adamant', iv: 28 },
				{ sp: 'hawlucha', lv: 37, moves: ['closecombat', 'acrobatics', 'roost', 'encore'], ability: 'unburden', item: 'sitrusberry', nature: 'jolly', iv: 29 },
				{ sp: 'lucario', lv: 38, moves: ['aurasphere', 'flashcannon', 'quickattack', 'darkpulse'], ability: 'justified', item: 'lucarionite', nature: 'hasty', iv: 31 },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: '¡Lucario! ¡Respondamos al vínculo! ¡Nueva temporada, A TOPE! ¡MEGAEVOLUCIÓN!',
			win: '¡Uaaah! ¡Me tiemblan las ruedas! ¡Y las rodillas! ¡Y Lucario!',
			lose: '¡A tope hasta el final! Vuelve cuando quieras, que la pista no se cierra nunca.' },

		// ----- «Nueva temporada» en rutas viejas (opcionales) -----
		nt_r4_berenice: { name: 'Bérénice', cls: 'Florista', ai: 2, sprite: 'aromalady',
			team: [{ sp: 'floette', lv: 32 }, { sp: 'vespiquen', lv: 33 }],
			intro: 'Mi hija cruza la Puerta con la Gira. Le he metido semillas en la maleta, por si en Johto no hay flores amarillas.', win: 'Si ves a una chica con olor a parterre, dile que riegue. Que la conozco.' },
		nt_r5_cyprien: { name: 'Cyprien', cls: 'Patinador', ai: 2, sprite: 'rollerskater',
			team: [{ sp: 'pangoro', lv: 33 }, { sp: 'gogoat', lv: 32 }],
			intro: 'Me han dicho que en Johto no hay rampas, solo templos. ¿Quién patina en un templo? …Yo. Yo patinaría en un templo.', win: 'Nueva temporada, mismas caídas. Al menos ahora me caigo con estilo.' },
		nt_r7_eulalie: { name: 'Eulalie', cls: 'Pintora', ai: 2, sprite: 'artist',
			team: [{ sp: 'smeargle', lv: 33 }, { sp: 'roselia', lv: 32 }],
			intro: 'Pinto la Puerta todos los días, de memoria. Desde que anunciaron la Gira, en mis cuadros sale de otro color. No lo elijo yo.', win: '¿Qué color? Verde. Un verde de bosque viejo. No me preguntes por qué.' },
		nt_r10_dorian: { name: 'Dorian', cls: 'Montañero', ai: 2, sprite: 'hiker',
			team: [{ sp: 'golett', lv: 33 }, { sp: 'sigilyph', lv: 33 }],
			intro: 'Los Sigilyph han vuelto a volar en círculo. Pero no alrededor de los menhires: alrededor de algo que está al sur. En Luminalia.', win: 'Yo me quedo aquí, con mis piedras. Las piedras no cruzan puertas. Es lo que más me gusta de ellas.' },
		nt_r10_florian: { name: 'Florian', cls: 'Chico Moderno', ai: 2, sprite: 'youngster',
			team: [{ sp: 'granbull', lv: 34 }, { sp: 'manectric', lv: 33 }],
			intro: 'Tengo dos medallas y media: a la de Relieve se le cayó un trozo. No me dejan ir a la Gira. Alguien tiene que quedarse en Kalos a ganar combates.', win: 'Bueno, alguien que no sea yo. Saluda a Johto de mi parte. Dile que la temporada que viene voy.' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== INICIO DEL BLOQUE ===================
		b02_inicio: [
			{ set: { 'flag.b02_inicio_hecho': true } },
			{ quest: 'b01_m8', done: true, silent: true },
			{ cutscene: { time: 'noche', bg: { type: 'route', ground: '#4a5a6a', far: '#2b2f45' }, start: 'dark', frames: [
				{ cam: 'pan-right', text: 'De madrugada, a medio camino de Luminalia, tu Rhyhorn frena en seco. Las cuatro patas clavadas en el asfalto.' },
				{ actors: [{ mon: '{riolu}', key: 'rio', at: 'center', enter: 'drop', emote: '!' }], fx: ['shake', 'aura'], text: '{riolu} salta al suelo. Tiene los apéndices de la cabeza de punta y el aura le tiembla en las patas, igual que anoche en el muelle.' },
				{ color: '#b79cff', tint: '#7a4ad8', cam: 'pan-up', actors: [{ key: 'rio', dim: true }], on: false, fx: 'flash', text: 'Muy al sur, por encima de los tejados de Luminalia, el cielo se enciende un segundo. Violeta. Luego, nada.' },
				{ tint: 'none', on: false, actors: [{ key: 'rio', dim: false, do: 'turn' }], fx: 'glow', text: 'Tu Pokédex vibra. Dos mensajes. Rhyhorn resopla y vuelve a andar, más deprisa que antes.' },
			] } },
			{ say: 'rotom', text: '¡Bzzt! Mensaje oficial de la Liga del Circuito Infinito: «A los inscritos en la Primera Gira Interregional: la Liga eleva su tope de entrenamiento autorizado. Prepárense para Johto». ¡Eso eres tú!' },
			{ cap: 37 },
			{ toast: 'El tope de nivel sube a 37.' },
			{ say: 'rotom', text: 'Y otro. Del número de la Tarjeta de Colaborador. Dice… «Agencia. En cuanto llegues. Trae a tu compañero. No traigas periodistas». Y una carita triste. No sé si la carita es parte del mensaje.' },
			{ text: 'Amanece cuando cruzas el Bulevar Norte a lomos de tu Rhyhorn. Los cafés todavía tienen las sillas encima de las mesas. En todas las farolas cuelga el mismo cartel: «**Primera Gira Interregional · Un mundo. Una liga.**»' },
			{ go: 'luminalia' },
			{ text: '{riolu} no deja de mirar hacia la Plaza de la Torre Prisma. Ya no tiembla. Pero tampoco se relaja.' },
			{ quest: 'b02_m1', stage: 'inicio' },
		],

		// =================== AGENCIA DE DETECTIVES ===================
		b02_agencia: [
			{ set: { 'flag.b02_agencia_hecha': true } },
			{ if: 'flag.b01_delatar', then: [
				{ text: 'Hay tres periodistas en la puerta de la Agencia. Al verte, te apuntan con los micrófonos. Una señora con abrigo y bigote te abre desde dentro, tira de tu manga y cierra de un portazo.' },
				{ say: 'handsome', as: 'Señora con bigote', text: 'Pasa, pasa. —Se quita el pañuelo de la cabeza. Es Handsome—. Llevan cuatro días ahí fuera. Handsome ha tenido que salir a comprar el pan disfrazado de abuela. El panadero ya me llama «doña».' },
				{ say: 'matiere', text: 'Desde lo de Crómlech, todas las cadenas de Kalos quieren una entrevista con «el policía que destapó la excavación». Handsome no destapó nada. Lo destapaste tú.' },
				{ say: 'handsome', text: 'Y Handsome está muy orgulloso. Muy orgulloso y muy cansado. Lemnis manda un desmentido cada hora. En punto. Ya los reconozco por el estilo, como a los pájaros.' },
			] },
			{ if: 'flag.b01_handsome', then: [
				{ text: 'La Agencia está en penumbra, con las persianas bajadas. Handsome te espera junto a la ventana, con una lupa en la mano y nada que mirar con ella.' },
				{ say: 'handsome', text: '{jugador}. Pasa. Cierra. —Baja la voz—. Lo de Crómlech sigue entre nosotros. Ni un informe. Handsome nunca había pasado tanto tiempo sin escribir un informe. Me pica la mano.' },
				{ say: 'handsome', text: 'Pero he estado pensando. La pantalla de la excavación decía **NODO 01**. Uno. Handsome será torpe, pero sabe contar: cuando alguien pone un uno, es porque piensa poner un dos.' },
				{ say: 'matiere', text: 'Lleva tres días con esa frase. Se la ha dicho al cartero.' },
			] },
			{ if: 'flag.b01_trato_sera', then: [
				{ text: 'Handsome está de pie junto al escritorio, de brazos cruzados. Matière, sentada, hace como que lee un informe.' },
				{ say: 'handsome', text: '{jugador}. —Te mira un buen rato—. Bien. Estás bien. Eso primero.' },
				{ say: 'handsome', text: 'No te voy a preguntar qué te dio la señorita Lemnis en Crómlech. Handsome tiene buena memoria y mal carácter, pero no es tonto: si me lo quisieras contar, ya me lo habrías contado.' },
				{ say: 'handsome', text: 'Solo te digo esto: si algún día quieres devolverlo, sea lo que sea, Handsome te guarda el recibo. —Se aclara la garganta—. Y te guarda un sitio en la Agencia. Eso no ha cambiado.' },
				{ say: 'matiere', text: 'Traducido: te ha echado de menos y no sabe decirlo. Siéntate.' },
			] },
			{ if: CROMLECH_NINGUNA, then: [
				{ text: 'Handsome está de pie junto al escritorio, mirando por la ventana. Matière, sentada, hace como que lee un informe.' },
				{ say: 'handsome', text: '{jugador}. Pasa. Crómlech nos dejó más preguntas que respuestas. Handsome odia eso. Handsome colecciona respuestas. Tiene un cajón.' },
				{ say: 'matiere', text: 'El cajón está vacío. Siéntate.' },
			] },
			{ text: 'Hay alguien más. En la silla de las visitas, con la carpeta gorda sobre las rodillas y el traje gris sin una arruga, el inspector Lebrun.', cond: 'flag.b01_lebrun_conocido' },
			{ text: 'Hay alguien más. En la silla de las visitas, un hombre de traje gris con una carpeta gorda sobre las rodillas y un bigote que sí parece suyo.', cond: '!flag.b01_lebrun_conocido' },
			{ if: '!flag.b01_lebrun_conocido', then: [
				{ say: 'lebrun', text: 'Inspector Lebrun. Policía Internacional, delegación de Kalos. El superior de este señor. El que firma lo que él gasta.' },
				{ set: { 'flag.b01_lebrun_conocido': true } },
			] },
			{ say: 'lebrun', text: 'Colaborador. Llegó usted a Luminalia a las seis y cuarenta y dos. Con un Rhyhorn. Que dejó aparcado en doble fila, delante de una panadería.' },
			{ say: 'handsome', text: '¿Cómo sabe…?' },
			{ say: 'lebrun', text: 'Es mi trabajo saberlo, Handsome. Y el suyo también, en teoría.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Exacto! ¡Seis y cuarenta y dos! Yo también lo tengo apuntado. ¡Qué bien coordinados estamos todos!' },
			{ if: 'flag.b01_delatar', then: [{ say: 'lebrun', text: 'Media Kalos sigue llamando a mi oficina. Lemnis, cada hora. Yo, sin comer. Le agradecería que la próxima vez que haga justicia la haga por los canales.' }] },
			{ if: 'flag.b01_handsome', then: [{ say: 'lebrun', text: 'Handsome sigue sin pasarme ningún informe sobre Crómlech. Él, que me pasa informes hasta de lo que desayuna. Empiezo a sospechar que desayuna secretos.' }] },
			{ if: 'flag.b01_trato_sera', then: [{ say: 'lebrun', text: 'Veo que sigue llevando aparatos elegantes en el bolsillo. No le pregunto. Me ahorra papel.' }] },
			{ say: 'lebrun', text: 'He venido por la Gira. La Policía Internacional tendrá un observador en la ceremonia. Yo. Con una carpeta. Que nadie toque mi carpeta.' },
			{ say: 'handsome', text: 'Justo de eso quería hablar. —Despliega un mapa de Johto encima de los papeles de Matière—. {jugador}: tú vas a ir en la Gira.' },
			{ say: 'handsome', text: 'De incógnito.' },
			{ choice: [
				{ text: '«Voy en la lista. Mi nombre salió en todas las pantallas de Kalos.»', then: [
					{ say: 'handsome', text: 'Por eso es el incógnito perfecto: nadie sospecha de quien va a la vista. Handsome lo leyó en un libro. Un libro muy bueno. Con dibujos.' },
				] },
				{ text: '«¿Me vas a dar un bigote?»', then: [
					{ say: 'handsome', text: '¿Me lo prestarías de vuelta? Es que es el bueno. —Matière le quita el bigote de la mano sin mirarlo—. …No. Sin bigote. Tú vas de ti mism{o|a|e}.' },
				] },
				{ text: 'Esperar a que se explique.', then: [
					{ say: 'handsome', text: 'Bien. Paciencia. Eso es lo primero que se aprende en la Policía. Lo segundo es a comer de pie.' },
				] },
			] },
			{ say: 'handsome', text: 'Escucha. Las Puertas son la escena del crimen. Todas las Fisuras empiezan en una. Y tú vas a pasar por la escena del crimen con una mochila, una sonrisa y los ojos muy abiertos.' },
			{ say: 'handsome', text: 'Mira quién se pone nervioso. Mira qué técnicos hay. Mira qué no te dejan mirar. Y cuéntaselo a Handsome. Solo a Handsome.' },
			{ say: 'lebrun', text: 'Y a mí, por triplicado.' },
			{ say: 'handsome', text: '…Y al inspector, por triplicado.' },
			{ say: 'matiere', text: 'Una cosa más, antes de que Handsome se emocione. —Te pasa una hoja impresa—. Esto pasó anoche. La misma noche en que la Puerta se encendió sola.' },
			{ say: 'matiere', text: 'Alguien entró en la **Central de Kalos**, la vieja central eléctrica del norte. No forzó nada. Fue directo a una sala del sótano que, según los planos oficiales, no existe. Y se llevó «un componente».' },
			{ say: 'matiere', text: 'La cámara solo grabó un traje rojo. Muy bien cortado. Y el guardia jura que la ladrona llevaba gafas de sol. De noche. Dentro de un sótano.' },
			{ choice: [
				{ text: '«Gafas de sol de noche. Ya la he visto antes.»', cond: 'flag.b01_cueva_flare_hecha', then: [
					{ say: 'matiere', text: 'Yo también. —No dice el nombre. Lo piensa muy fuerte—. Hay gente que nunca se quita las gafas. Ni para robar.' },
					{ rep: { policia: 1 } },
				] },
				{ text: '«¿Qué componente?»', then: [
					{ say: 'matiere', text: 'Eso es lo bonito: nadie lo sabe. O nadie lo dice. Lemnis tiene la concesión de la Central desde hace un año y ha pedido que «no se difunda». Así, con comillas.' },
				] },
				{ text: '«¿Una sala que no existe? Me suena a Lemnis.»', then: [
					{ say: 'handsome', text: '¡Eso mismo dije yo! —Lebrun carraspea—. …Eso mismo dije yo, en voz baja, sin pruebas y sin ánimo de acusar a nadie.' },
				] },
			] },
			{ say: 'lebrun', text: 'Un robo en una central privada no es competencia de la Policía Internacional. Lo he archivado como «hurto de material eléctrico». Caso cerrado.' },
			{ text: 'Matière y Handsome se miran. No dicen nada. Lebrun cierra la carpeta, se levanta y se pone el sombrero.' },
			{ say: 'lebrun', text: 'Nos vemos en la ceremonia, colaborador. Llegue puntual. Lo sabré.' },
			{ text: 'La puerta se cierra. Handsome espera tres segundos. Luego cinco. Luego se asoma a la ventana.' },
			{ say: 'handsome', text: 'Se ha ido. —Se gira—. {jugador}: si ese componente aparece en Johto, Handsome quiere saberlo antes que nadie. Antes que Lebrun, antes que Lemnis y antes que la ladrona de las gafas.' },
			{ say: 'matiere', text: 'Y antes de que te vayas: despídete de la gente. En serio. La Gira dura semanas. Kalos se queda aquí, pero la gente no espera sentada.' },
			{ intel: { npc: 'lebrun', text: 'En la Agencia sabía a qué hora llegaste a Luminalia, al minuto, y dónde dejaste el Rhyhorn. Archivó el robo de la Central de Kalos como «hurto de material eléctrico».' } },
			{ intel: { npc: 'melia', text: 'La noche en que la Puerta se encendió sola, alguien con traje rojo y gafas de sol robó «un componente» de una sala secreta de la Central de Kalos.' } },
			{ quest: 'b02_m1', stage: 'preparativos' },
			{ text: 'Al salir de la Agencia, tu Pokédex vibra. Un mensaje sin nombre, desde un número que no conoces.' },
			{ say: 'rotom', text: '¡Bzzt! Dice: «Soy Noa. Necesito enseñarte algo. Puerta trasera del centro de procesamiento, Bulevar Este. Ven sol{o|a|e}. Bueno, con {riolu} sí». Y luego: «Borra esto». ¡No sé borrar cosas! ¡Nunca he borrado nada!' },
			{ quest: 'b02_t_noa', stage: 'centro' },
		],
		b02_agencia_despues: [
			{ say: 'handsome', text: 'Handsome está marcando en el mapa de Johto todos los sitios donde ha habido Fisuras. Hay muchas chinchetas cerca de unas ruinas. Y en un bosque. Y en mi dedo, que me he pinchado.' },
			{ say: 'matiere', text: 'Despídete de quien tengas que despedirte y ve a la Plaza. La ceremonia no espera. Bueno, sí espera, pero Lebrun no.', cond: 'quest.b02_m1 == "preparativos"' },
			{ if: 'quest.b02_t_noa == "centro"', then: [{ say: 'rotom', text: '¡Bzzt! Recordatorio: Noa te espera en la puerta trasera del centro de procesamiento. No sé borrar recordatorios tampoco.' }] },
		],

		// =================== EL CENTRO DE PROCESAMIENTO (NOA) ===================
		b02_noa_centro: [
			{ text: 'El Bulevar Este, por detrás. Contenedores, una furgoneta blanca con la lemniscata y una puerta metálica sin cartel.' },
			{ text: 'La puerta se abre un dedo antes de que llames. Asoma Noa Lambert. Tiene ojeras, el moño deshecho y una tarjeta de acceso que no es suya colgada del cuello.' },
			{ say: 'noa', text: 'Pasa. Rápido. Hay cámara, pero la del pasillo apunta a la máquina de café desde hace un mes y nadie la ha movido. Es lo único bueno de esta empresa: nadie mueve nada.' },
			{ say: 'noa', text: 'La tarjeta es de mi compañera de mesa. Está de vacaciones. Le he dicho que se la regaba. Las plantas. Que le regaba las plantas.' },
			{ go: 'centro_procesamiento', silent: true },
			{ text: 'Dentro, una nave blanca enorme. Filas de **jaulas de contención**, acolchadas, con la lemniscata bordada en cada cojín. Decenas. Cientos, quizá.' },
			{ text: 'Están vacías. Todas. Los cojines, sin una arruga. Los bebederos, llenos.' },
			{ say: 'noa', text: 'Aquí traíamos a todos. A los cuarenta y tres que traje yo, por lo menos. Los dejábamos aquí y luego, a los dos o tres días, ya no estaban. «Devueltos a su región». Eso decía el sistema.' },
			{ say: 'noa', text: 'Mira las etiquetas.' },
			{ text: 'En la jaula más cercana hay una etiqueta. Debajo del «**Destino: por asignar**» de siempre, alguien ha impreso una línea nueva: «**Destino asignado: N-02**».' },
			{ text: 'La siguiente: N-02. La siguiente: N-02. Toda la fila.' },
			{ if: 'flag.b01_enc_noa_1', then: [{ say: 'noa', text: 'Esta era la de Merengue. El Wooloo del pañuelo. —Toca el cojín—. N-02. Galar dice que no llegó nunca. N-02 no es Galar.' }] },
			{ if: 'flag.b01_lechonk_lemnis', then: [
				{ text: 'Al fondo de la fila hay una jaula más pequeña, con un cartel escrito a mano: «Lechonk · Ruta 4». Vacía. La etiqueta, impresa encima: «**Destino asignado**».' },
				{ say: 'noa', text: 'El Lechonk de la Ruta 4. El que lloraba con el pitido de los camiones. Se lo llevaron el martes. Ni siquiera me avisaron. Yo le traía manzanas.' },
			] },
			{ if: 'flag.b01_agente_vencido && !flag.b01_lechonk_lemnis', then: [{ say: 'noa', text: 'El Lechonk de la Ruta 4 nunca llegó aquí, ¿verdad? Alguien se plantó en el camino. —Te mira—. Me alegro. No sabes cuánto me alegro.' }] },
			{ if: 'flag.b01_mareep_lemnis && !flag.b01_mareep_jaula', then: [{ text: 'De una de las jaulas cuelga un cencerro de latón. Lo mueves sin querer al pasar. Suena una vez, muy bajito. En el latón pone **CHISPITA**. La jaula está vacía.' }] },
			{ if: 'inParty("riolu") || inParty("lucario")', then: [
				{ text: '{riolu} se acerca a una etiqueta y apoya la palma encima de las letras N-02. El aura le sube por el brazo, despacio, como cuando lee una piedra. Luego retira la mano de golpe, como si quemara.' },
				{ say: 'rotom', text: '¡Bzzt! «N-02» no figura en mi base de datos. ¿Será una talla de jaula? ¿Un número de pasillo? ¡Qué misterio más aburrido!' },
			] },
			{ say: 'noa', text: 'He buscado en el sistema. Todos los que salen de aquí van a N-02. No hay ninguna región que se llame así. No hay ningún centro que se llame así. No hay nada.' },
			{ choice: [
				{ text: '«¿Se lo has contado a alguien más?»', then: [
					{ say: 'noa', text: 'A ti. —Se ríe, y le sale un ruido raro—. Bastien no sabe nada. No quiero que sepa nada. Ya tiene bastante con lo suyo.' },
				] },
				{ text: '«Esto hay que llevárselo a Handsome.»', then: [
					{ say: 'noa', text: 'Lleva lo que quieras. Pero yo no te he enseñado nada. Yo estaba regando plantas. —Le tiembla la barbilla—. Perdona. Es que nunca había tenido miedo de mi propia empresa.' },
					{ rep: { policia: 1 } },
				] },
				{ text: 'Ponerle una mano en el hombro.', then: [
					{ text: 'Noa se queda quieta. Respira. Una vez, dos.' },
					{ say: 'noa', text: 'Gracias. Ya está. Ya. —Se seca los ojos con la manga del uniforme—. Lo que te quería enseñar no son las jaulas vacías. Es la única que no lo está.' },
				] },
			] },
			{ text: 'Al final de la última fila, una jaula tiene la puerta entreabierta. Dentro hay algo pequeño, blanco y redondo, debajo de una manta azul.' },
			{ text: 'Lo reconoces. En la Ruta 5, en el campamento de Lemnis, temblaba debajo de esa misma manta.' },
			{ say: 'noa', text: 'Es un **Cetoddle**. De Paldea. De las montañas de allí, donde nieva medio año. Llegó con la primera Fisura.' },
			{ say: 'noa', text: 'Todo el mundo pensaba que temblaba de frío. Le pusieron mantas. Le pusieron una estufa al lado. Temblaba más.' },
			{ text: 'Noa levanta la manta. Por debajo está húmeda y fría: tiene cosidas dentro bolsas de hielo de la cafetería, como una compresa.' },
			{ say: 'noa', text: 'Tiembla porque tiene **calor**. Kalos le queda grande. O pequeña. O caliente. Le cambio el hielo cada hora. Cada hora, {jugador}. Llevo tres semanas durmiendo a ratos.' },
			{ say: 'noa', text: 'Lo dejé para el final. Le cambié la etiqueta dos veces, para que no le tocara. Pero mañana hay recogida. Y la etiqueta nueva ya está impresa.' },
			{ text: 'En la puerta de la jaula, una etiqueta todavía sin pegar: «**Destino asignado: N-02**».' },
			{ text: 'Se oyen pasos al otro lado de la nave. Un guardia silba una canción de anuncio. Noa te empuja detrás de un carro de pienso y se pone delante, muy derecha, con la tarjeta prestada en la mano.' },
			{ say: 'guardia_lemnis', text: '¿Señorita Lambert? ¿Otra vez aquí?' },
			{ say: 'noa', text: '¡Hola! Sí. Inventario. Me gusta contar cojines. Es relajante. ¿A ti no te relaja?' },
			{ say: 'guardia_lemnis', text: '…A mí me relaja que no me hagan preguntas. Buenas noches, señorita.' },
			{ text: 'Los pasos se alejan. Noa espera a que el silbido desaparezca del todo. Luego se agacha delante de la jaula.' },
			{ say: 'noa', text: 'Llévatelo. En la Gira. A Johto. Dicen que en Johto hay una cueva entera de hielo, una ruta donde nieva aunque sea verano. Lo que sea es mejor que N-02.' },
			{ say: 'noa', text: 'Yo le digo «Escarcha». Pero ponle el nombre que quieras. Es tuyo, si lo quieres. Si no… —No termina la frase.' },
			{ text: 'El Cetoddle asoma la cabeza por debajo de la manta y te mira. Luego mira a {riolu}. Luego estornuda. Un estornudo pequeño, con copos de nieve.' },
			{ prompt: 'El Cetoddle te mira desde la jaula.', choice: [
				{ text: 'Llevártelo.', then: [
					{ say: 'noa', text: 'Gracias. Gracias, gracias. —Mete la mano en el bolsillo y saca un sobre arrugado—. Te había escrito esto por si decías que sí. Léelo luego. Lejos de aquí.' },
					{ pokemon: { sp: 'cetoddle', lv: 30, nature: 'adamant', ability: 'thickfat', moves: ['icefang', 'avalanche', 'iceshard', 'takedown'], ivs: { hp: 28, atk: 31, def: 24, spa: 12, spd: 24, spe: 20 }, happy: 140, metAt: 'centro_procesamiento' } },
					{ give: 'cartanoa' },
					{ set: { 'flag.b02_cetoddle': true } },
					{ text: 'El Cetoddle se pega a tu pierna. Está fresquito, como una botella recién sacada de la nevera. Deja de temblar casi enseguida.' },
					{ happy: { who: 'riolu', n: 5 } },
				] },
				{ text: '«No puedo. Pero tú tampoco lo dejes aquí.»', then: [
					{ say: 'noa', text: '…No. Tienes razón. No lo voy a dejar aquí. —Carga al Cetoddle en brazos, con manta y todo—. Mi piso tiene una nevera grande. Y un balcón que da al norte. Algo es algo.' },
					{ say: 'noa', text: 'Si me descubren, diré que es un peluche. Un peluche que estornuda nieve. Los hay, ¿no? Seguro que los hay.' },
					{ set: { 'flag.b02_cetoddle_noa': true } },
					{ rep: { lemnis: -1 } },
				] },
			] },
			{ say: 'noa', text: 'Yo también voy a Johto, con la Gira. Me mandan a buscar talentos. —Se ríe, sin ganas—. Si allí veo algo raro, te busco. Lejos de las cámaras.' },
			{ say: 'noa', text: 'Y {jugador}… si alguien de Lemnis te pregunta por mí, di que soy muy simpática. Siempre lo dicen. Es lo único que dicen.' },
			{ set: { 'flag.b02_noa_hecha': true } },
			{ quest: 'b02_t_noa', stage: 'johto' },
			{ intel: { npc: 'noa', text: 'Las jaulas del centro de procesamiento de Luminalia están vacías. Todas las etiquetas dicen «Destino asignado: N-02». Ninguna región ni centro se llama así.' } },
			{ go: 'luminalia', silent: true },
			{ text: 'Sales por la puerta trasera. Fuera ya no hay nadie. Solo la furgoneta blanca, con la lemniscata recién lavada.' },
			{ diary: 'Hoy fuimos a ver a Noa, que nos enseñó dónde esperan los Pokémon antes de su viaje. ¡Noa es muy simpática! Estaba todo limpísimo y muy tranquilo. ¡Y tenemos un compañero nuevo de Paldea, redondito y blanco! Le gusta el frío. A mí también: así no me sobrecaliento. ¡Bzzt!', cond: 'flag.b01_diario && flag.b02_cetoddle' },
			{ diary: 'Hoy fuimos a ver a Noa, que nos enseñó dónde esperan los Pokémon antes de su viaje. ¡Noa es muy simpática! Estaba todo limpísimo y muy tranquilo. Había un pequeñín de Paldea que estornudaba nieve. Se va a quedar con ella. ¡Qué suerte tiene! ¡Bzzt!', cond: 'flag.b01_diario && !flag.b02_cetoddle' },
		],
		b02_centro_etiquetas: [
			{ text: 'Fila tras fila de etiquetas impresas. «Destino: por asignar». Y debajo, en todas: «**Destino asignado: N-02**».' },
			{ text: 'Ninguna dice adónde. Ninguna dice cuándo vuelven.' },
		],

		// =================== HÉCTOR CONOCE A MATIÈRE ===================
		b02_hector: [
			{ quest: 'b02_t_hector', stage: 'agencia', silent: true },
			{ text: 'Delante de la Agencia, un oficinista con traje gris y corbata roja tiene la mano en el pomo de la puerta. No empuja. No suelta. A su lado, un Hawlucha hace estiramientos para disimular.' },
			{ say: 'hector', text: '¡{jugador}! ¡Qué casualidad! Yo no estaba aquí. Bueno, sí estaba. Llevo aquí… —mira el reloj— …cuarenta minutos. He pedido otro día de vacaciones. Me han dado medio.' },
			{ say: 'hector', text: 'Esta es la séptima vez que vengo. La sexta llegué a tocar el timbre. Luego me escondí detrás de Hawlucha. Hawlucha no es muy ancho.' },
			{ choice: [
				{ text: 'Abrir la puerta por él.', then: [{ say: 'hector', text: '¡Espera, espera, que no he ensayado la entrada! —Ya es tarde. La puerta está abierta—. …Bueno. Bueno. Entrada improvisada. Como los héroes de verdad.' }] },
				{ text: '«Ser héroe no es el traje. Y entrar en una oficina, tampoco.»', then: [{ say: 'hector', text: 'Eso es. Eso es. —Respira hondo—. Lo tengo apuntado en la otra mano. Esta vez entero.' }] },
				{ text: 'Empujarlo dentro con cariño.', then: [{ text: 'Héctor entra en la Agencia dando un traspié. Hawlucha entra detrás haciendo una voltereta, por si había que hacer una voltereta.' }] },
			] },
			{ text: 'Matière levanta la vista de sus papeles. Handsome, detrás de ella, se mete un macaron entero en la boca, sorprendido.' },
			{ say: 'hector', text: 'Buenas tardes. Me llamo Héctor Batista. Trabajo en seguros. Bueno, eso da igual. Vengo porque… porque… —Se le quiebra la voz—. ¿Es usted Esprit?' },
			{ say: 'matiere', text: '¿Esprit? —Sonríe. Una sonrisa amable, perfecta, de las que no dejan entrar a nadie—. Me lo preguntan mucho. No. Yo dirijo una agencia de detectives. Esprit era un héroe. Los héroes no rellenan formularios.' },
			{ say: 'handsome', text: 'Bueno, técnicamente, Esprit sí que rellenaba formularios, porque Matière siempre… ¡AY!' },
			{ text: 'Algo ha pasado debajo del escritorio. Handsome se frota la espinilla y mira al techo con mucho interés.' },
			{ say: 'handsome', text: '…Esprit nunca rellenó un formulario. Handsome no sabe nada. Handsome tiene un calambre.' },
			{ text: 'Matière se levanta y le tiende la mano a Héctor.' },
			{ say: 'matiere', text: 'Pero si conoce a alguien que admira tanto a un héroe como para venir siete veces a una oficina, dígale que eso ya es bastante heroico. Encantada, señor Batista.' },
			{ text: 'Héctor mira la mano. Se pone rojo. Tan rojo que se le nota por debajo de la máscara, que lleva puesta sin darse cuenta.' },
			{ say: 'hector', text: '¡TRANSFORMACIÓN!' },
			{ text: 'Es un reflejo. Hawlucha lo entiende como una orden: salta, gira en el aire y aterriza con una Plancha Voladora perfecta sobre el escritorio de Handsome. La torre de macarons sale disparada. Llueve rosa y pistacho.' },
			{ text: 'Silencio. Un macaron rueda por el suelo y se para a los pies de Matière.' },
			{ say: 'matiere', text: '…Buen salto. Muy buen salto. Esprit lo habría aprobado. —Recoge el macaron—. Si lo conociera, claro. Que no.' },
			{ say: 'hector', text: 'Perdón. Perdón, perdón, perdón. Lo pago. Pago los macarons. Pago el escritorio. Trabajo en seguros: sé exactamente cuánto vale todo.' },
			{ say: 'handsome', text: 'El escritorio está bien. Handsome ha visto escritorios peores. Handsome ha sido un escritorio peor. Una vez. De incógnito.' },
			{ text: 'Al salir, Héctor lleva en la mano una tarjeta de la Agencia, firmada por Matière. La mira como si fuera una medalla.' },
			{ say: 'hector', text: 'Dice «Señor Batista: gracias por su visita». Gracias. A mí. —Te agarra del brazo—. No era ella. Estoy seguro. Bueno, casi seguro. Bueno… ¿tú qué crees?' },
			{ choice: [
				{ text: '«Creo que da igual. Has entrado.»', then: [{ say: 'hector', text: 'He entrado. —Se le humedecen los ojos detrás de la máscara—. Hawlucha, ¿lo has oído? Hemos entrado. Esta noche cenamos fuera.' }] },
				{ text: '«Creo que era ella.»', then: [{ say: 'hector', text: '¡Lo sabía! ¡No! ¡No lo sabía! ¡No lo digas en voz alta, que se rompe! Se guarda. Se guarda aquí. —Se toca el pecho, el lado equivocado.' }] },
				{ text: '«Creo que no.»', then: [{ say: 'hector', text: 'Ya. Ya. Tienes razón. —Mira la tarjeta otra vez—. Pero ha dicho que venir siete veces es heroico. Eso lo ha dicho ella. Sea quien sea.' }] },
			] },
			{ set: { 'flag.b02_hector_matiere': true } },
			{ quest: 'b02_t_hector', done: true },
		],

		// =================== ROUXEL CAE ===================
		b02_rouxel: [
			{ set: { 'flag.b02_rouxel_caido': true } },
			{ text: 'En la acera del Bulevar Sur, un hombre de traje impecable espera un taxi con una caja de cartón en los brazos. Dentro: un marco de fotos boca abajo, una planta de oficina y un megáfono.' },
			{ text: 'Es Fabien Rouxel. La corbata roja, aflojada. La sonrisa de anuncio sigue ahí, pero torcida, como un cartel al que se le ha caído un tornillo.' },
			{ say: 'rouxel', text: '¡{jugador}! ¡La cara de la inauguración! Qué alegría. Qué alegría de verdad. No me des la mano, que se me cae la planta.' },
			{ if: 'flag.b01_delatar', then: [
				{ say: 'rouxel', text: '¿Has visto las noticias? «Lemnis identifica al responsable de las filtraciones de Crómlech». El responsable soy yo. Lo dice el comunicado. Lo escribí yo mismo, a las cinco de la mañana. Me salió muy bien.' },
				{ say: 'rouxel', text: 'Yo no filtré nada. Tú lo sabes, yo lo sé, la señora lo sabe. Pero alguien tenía que ser el culpable, y yo soy muy fotogénico. Es una ventaja, en Relaciones Públicas. Hasta que deja de serlo.' },
			], else: [
				{ say: 'rouxel', text: '¿Te acuerdas del «informe de responsabilidades»? ¿El que me pidieron con mi nombre en el asunto? Lo entregué. Muy completo. Cuarenta páginas.', cond: 'flag.b01_enc_rouxel_2' },
					{ say: 'rouxel', text: 'Después de lo de Crómlech, la sede me pidió un «informe de responsabilidades». Con mi nombre en el asunto. Lo entregué. Muy completo. Cuarenta páginas.', cond: '!flag.b01_enc_rouxel_2' },
				{ say: 'rouxel', text: 'La conclusión del informe es que el responsable soy yo. La escribí yo, claro. Me pidieron que fuera honesto y fui honesto. Error de principiante: en esta empresa, la honestidad se entrega por triplicado y se archiva.' },
				{ say: 'rouxel', text: 'Oficialmente, me han «reestructurado». Es una palabra preciosa. Suena a obra, a algo que se construye. Es que se construye algo, sí: un hueco. En la foto de la entrada.' },
			] },
			{ text: 'El taxi no llega. Rouxel cambia la caja de brazo.' },
			{ if: 'flag.b01_prensa_verdad', then: [{ say: 'rouxel', text: 'Tú le contaste la verdad a la prensa el primer día. Yo grité «desajuste de calibración» por un megáfono. —Mira el megáfono de la caja—. Ganaste tú. Tarde, pero ganaste.' }] },
			{ if: 'flag.b01_prensa_lemnis', then: [{ say: 'rouxel', text: 'Tú fuiste {el|la|le} únic{o|a|e} que dijo a la prensa que Lemnis lo tenía controlado. Lo enmarqué. Está en la caja. —Lo saca. Es verdad, está ahí—. Te lo regalaría, pero es lo único bonito que me llevo.' }] },
			{ if: 'flag.b01_prensa_neutral', then: [{ say: 'rouxel', text: 'Tú no le dijiste nada a la prensa el primer día. Ni sí ni no. Yo pensé que era timidez. Ahora pienso que era inteligencia. Ojalá yo hubiera sido tímido.' }] },
			{ prompt: 'Rouxel espera el taxi.', choice: [
				{ text: '«Lo siento, Fabien.»', then: [
					{ say: 'rouxel', text: '¿Lo sientes? —Se le escapa una risa corta—. Eres la primera persona que me llama Fabien en dos años. En la empresa era «Rouxel», «director» o «el de la sonrisa». Gracias.' },
					{ rep: { lemnis: -1 } },
				] },
				{ text: '«Encubriste lo de la Puerta desde el primer día. Algo de culpa tienes.»', then: [
					{ say: 'rouxel', text: 'Toda. Tengo toda la culpa de lo que yo hice. —Asiente despacio—. Lo que pasa es que me han dado también la de los demás, y esa no me cabe en la caja.' },
				] },
				{ text: 'Sujetarle la planta mientras para un taxi.', then: [
					{ text: 'Le sostienes la planta. Rouxel levanta el brazo libre y para un taxi a la primera. Es lo único que le sale bien esta mañana, y lo sabe.' },
					{ say: 'rouxel', text: 'Mira. Para eso sí que sigo valiendo.' },
					{ rep: { lemnis: -1 } },
				] },
			] },
			{ text: 'Antes de subir al taxi, Rouxel saca una tarjeta del bolsillo interior de la chaqueta. Te la da con dos dedos, como en los anuncios.' },
			{ cutscene: { bg: { type: 'city', seed: 'sur' }, frames: [
				{ actors: [{ id: 'rouxel', at: 'left' }], on: '_c', item: 'tarjetarouxel', text: 'Una tarjeta de visita de cartulina gruesa. La lemniscata de la esquina está tachada a bolígrafo, con rabia, varias veces.' },
				{ actors: [{ key: 'rouxel', dim: true }, { key: '_c', size: 'l', do: 'turn' }], fx: 'zoom', text: 'Por detrás, a mano, un número de teléfono. Y una frase con una letra que ya no intenta ser bonita.' },
			] } },
			{ give: 'tarjetarouxel' },
			{ say: 'rouxel', text: 'Mi número personal. El de verdad. Por si algún día necesitas a alguien que sepa dónde están los cadáveres. —Pausa—. …Contables. Los cadáveres contables. Facturas. Partidas. Fundaciones con nombres bonitos.' },
			{ say: 'rouxel', text: 'Llevé las relaciones públicas de esa empresa dos años, {jugador}. Las relaciones públicas son saber qué se dice. Y para saber qué se dice, hay que saber qué se calla.' },
			{ text: 'Sube al taxi. Baja la ventanilla.' },
			{ say: 'rouxel', text: 'Un último consejo, gratis, de un experto en sonrisas: cuando en Lemnis alguien te sonríe mucho, no mires la boca. Mira las manos.' },
			{ text: 'El taxi arranca. Por la ventanilla trasera ves la planta, que asoma de la caja y se mueve con el bache como si dijera adiós.' },
			{ intel: { npc: 'rouxel', text: 'Lemnis lo despidió («reestructuración»). Te dio su número personal: sabe «dónde están los cadáveres contables» de la empresa. Posible informante.' } },
		],

		// =================== A.Z. JUNTO A LA PUERTA ===================
		b02_az: [
			{ set: { 'flag.b02_az_hecho': true } },
			{ quest: 'b01_t_az', done: true },
			{ quest: 'b02_t_az', stage: 'puerta', silent: true },
			{ text: 'La plaza está casi vacía. Los operarios han dejado las gradas a medio montar y se han ido a comer. Solo queda la Puerta, apagada. Y, apoyado en la valla, un hombre que es más alto que la valla.' },
			{ text: 'El pelo blanco, larguísimo. La ropa oscura, muy gastada. En su hombro, la Floette de la flor roja que no se marchita.' },
			{ text: '{riolu} se adelanta. Ahora es más alto que la última vez que lo vio el hombre. Mucho más alto. Su sombra cae sobre la Floette.' },
			{ text: 'La Floette se esconde detrás del cuello del hombre, temblando. Solo asoma la flor.' },
			{ say: 'az', text: 'No te reconoce. Has crecido deprisa. —Su voz es lenta, como si cada palabra pesara algo—. Ella se asusta de lo que crece deprisa. Yo también.' },
			{ text: '{riolu} se detiene. Se queda quieto un momento. Luego hinca una rodilla en el suelo, despacio, hasta que sus ojos quedan a la altura de la Floette, y abre la palma.' },
			{ text: 'La Floette lo mira. Baja flotando del hombro del gigante, muy despacio, y se posa en la palma de {riolu}. Un segundo. Luego vuelve a su sitio.' },
			{ happy: { who: 'riolu', n: 5 } },
			{ say: 'az', text: 'Sigue siendo el mismo. Bien. Lo que crece sin olvidar lo que era… eso es raro de ver.' },
			{ text: 'El hombre mira la Puerta. La mira como se mira una tumba que alguien ha abierto.' },
			{ say: 'az', text: 'Mañana la cruzarán. Todos. En fila, con música.' },
			{ choice: [
				{ text: '«¿Usted la cruzaría?»', then: [{ say: 'az', text: 'Yo ya crucé una vez una puerta como esa. Hace mucho. Lo que encontré al otro lado no era lo que había ido a buscar. —Acaricia la flor de la Floette con un dedo enorme—. O sí. Pero el precio no lo pagué yo.' }] },
				{ text: '«¿Qué sabe de las Puertas?»', then: [{ say: 'az', text: 'Que no son nuevas. Solo lo es el nombre. Y el lazo azul que le han puesto.' }] },
				{ text: 'Quedarte en silencio a su lado.', then: [{ text: 'Se quedan los dos mirando la Puerta. La Floette se duerme en su hombro. El hombre no se mueve, para no despertarla.' }, { happy: { who: 'riolu', n: 3 } }] },
			] },
			{ say: 'az', text: 'Escúchame. No crucen por ahí.' },
			{ say: 'az', text: 'Una puerta de verdad te deja al otro lado. Esa te deja donde ella quiere.' },
			{ text: 'Se aparta de la valla. Tarda un rato: hay mucho hombre que mover.' },
			{ say: 'az', text: 'Y si cruzan, que cruzarán… cuídalo. Él siente las cosas antes que tú. Hazle caso cuando tiemble.' },
			{ text: 'Se aleja hacia las calles del norte, sin prisa. La gente se aparta a su paso sin saber por qué. Nadie lo mira dos veces. Es como si la ciudad se hubiera acostumbrado a no verlo.' },
			{ say: 'rotom', text: '¡Bzzt! Sigue sin estar en mi base de datos. Ni con foto. Ni con medidas. ¡Mide casi tres metros! ¡Eso debería salir en algún sitio!' },
			{ quest: 'b02_t_az', stage: 'visto' },
		],

		// =================== LUCIEN SE CUELA EN LA COLA ===================
		b02_lucien_cola: [
			{ quest: 'b02_s_lucien', stage: 'cola' },
			{ text: 'En la fila de inscritos de la Gira, entre novatos que estiran y se hacen fotos, hay uno más bajito que el resto. Lleva una gorra tan grande que le tapa las cejas, una mochila más grande que él y un dorsal pintado a rotulador: **#101**.' },
			{ text: 'De la mochila asoma un Chespin. El Chespin te reconoce y saluda con la mano. El novato le da un manotazo suave para que se esconda.', cond: 'flag.b01_lucien_chespin' },
			{ text: 'La mochila se mueve sola. De dentro sale un ruidito de semilla mordisqueada.', cond: '!flag.b01_lucien_chespin' },
			{ say: 'lucien', as: 'Novato #101', text: 'Buenas. Soy… un novato. Del Circuito. Tengo tres medallas. Las tengo en casa. En otra chaqueta.' },
			{ choice: [
				{ text: '«Hola, Lucien.»', then: [{ say: 'lucien', text: '¡¿CÓMO LO HAS SABIDO?! ¡Llevo gorra! ¡Llevo dorsal! ¡He practicado la voz grave toda la mañana!' }] },
				{ text: '«¿Y cuáles son tus tres medallas?»', then: [{ say: 'lucien', as: 'Novato #101', text: 'La Roca, la… la otra, y… la de Chocolate. —Pausa—. No existe la de Chocolate, ¿verdad? …Soy Lucien. No se lo digas a nadie.' }] },
				{ text: 'Levantarle la visera de la gorra.', then: [{ text: 'Debajo de la gorra, un par de ojos enormes y una cara de doce años que sabe perfectamente que la han descubierto.' }, { say: 'lucien', text: '…Hola. Soy Lucien. Pero de incógnito.' }] },
			] },
			{ say: 'lucien', text: '¡Tienes que entenderlo! Llevo desde la inauguración apuntando cada vez que zumba la Puerta. ¡Cada vez! Las dos y diecisiete. ¡Nadie ha mirado esa Puerta más que yo! ¡Me lo merezco más que nadie!' },
			{ say: 'lucien', text: 'Y Chespin quiere ir. Me lo ha dicho. Bueno, no habla. Pero ha mordido el folleto de Johto y no el de Kalos. Eso es una señal.', cond: 'flag.b01_lucien_chespin' },
			{ text: 'Mira la Puerta. Se le van los ojos detrás, como a todo el que la mira mucho rato.' },
			{ say: 'lucien', text: 'Oye… ¿en Johto también hay Fisuras?' },
			{ prompt: 'Lucien espera la respuesta como si fuera muy importante.', choice: [
				{ text: '«Sí. Y por eso no puedes venir todavía.»', then: [{ say: 'lucien', text: '…Ya. —Se baja la visera—. Mi madre dice lo mismo. Pero con más gritos.' }] },
				{ text: '«No lo sé. Por eso voy.»', then: [{ say: 'lucien', text: '¿Vas a averiguarlo? ¿Como un detective? ¡Me lo tienes que contar todo! ¡Todo! ¡Con horas!' }] },
				{ text: '«Espero que no.»', then: [{ say: 'lucien', text: 'Yo espero que sí. Un poquito. Pequeñitas. Que no hagan daño. —Lo piensa mejor—. No. Mejor que no.' }] },
			] },
			{ say: 'empleado_gira', text: '¡Número ciento uno! ¿Dónde está tu acreditación? …Oye. Oye, tú no tienes doce años, ¿verdad?' },
			{ say: 'lucien', text: 'Tengo… veinte. De estatura baja. Es genético.' },
			{ text: 'El organizador te mira a ti. Tú eres la única persona adulta cerca que conoce al «novato».' },
			{ prompt: '¿Qué haces con Lucien?', choice: [
				{ text: '«Es conmigo. Lo llevo a casa con su madre.»', then: [
					{ say: 'lucien', text: '¡Noooo! ¡Con mi madre no! ¡Mi madre va a llamar a mi abuela! ¡Y mi abuela llama a todo el mundo!' },
					{ set: { 'flag.b02_lucien_rumbo_madre': true } },
					{ quest: 'b02_s_lucien', stage: 'devolver' },
				] },
				{ text: '«Es conmigo. Lo llevo al laboratorio del profesor Ciprés.»', then: [
					{ say: 'lucien', text: '¿Al profesor? …Bueno. El profesor tiene un telescopio. Y no grita. Bueno, grita, pero de alegría.' },
					{ set: { 'flag.b02_lucien_rumbo_cipres': true } },
					{ quest: 'b02_s_lucien', stage: 'devolver' },
				] },
				{ text: '«Déjelo ver la ceremonia desde la primera fila. Como público.»', then: [
					{ say: 'empleado_gira', text: '…Primera fila de público. Sin cruzar. Sin dorsal. Y sin colarse en la foto oficial.' },
					{ say: 'lucien', text: '¡Primera fila! ¡Voy a ver cómo se abre desde DOS METROS! ¡Lo voy a apuntar todo! ¡Con horas!' },
					{ text: 'Lucien se quita el dorsal, lo dobla con mucho cuidado y se lo guarda en el bolsillo. «Para la próxima temporada», dice.' },
					{ set: { 'flag.b02_lucien_publico': true } },
					{ rep: { kalos: 1 } },
					{ quest: 'b02_s_lucien', done: true },
				] },
			] },
		],
		b02_lucien_madre: [
			{ text: 'Una señora con delantal de panadería recorre el bulevar con una gorra de repuesto en la mano, mirando debajo de cada banco.' },
			{ say: 'madre_lucien', text: '¡LUCIEN PERROT! ¡Ven aquí ahora mismo! ¿Tú sabes el susto que me has dado? ¡Te he buscado hasta en el horno!' },
			{ say: 'lucien', text: 'Mamá, yo solo quería ver Johto. Un ratito. Y volver para cenar.' },
			{ say: 'madre_lucien', text: 'Johto no se ve «un ratito». —Lo abraza tan fuerte que se le cae la gorra grande—. Gracias, gracias. ¿Usted es {el|la|le} del Riolu? Mi hijo no habla de otra cosa. Bueno, de usted y de esa Puerta.' },
			{ say: 'madre_lucien', text: 'Tome. Es de ayer, pero el pan de ayer en mi casa vale más que el de hoy en otras.' },
			{ give: 'lumiosegalette' },
			{ say: 'lucien', text: '{jugador}… ¿me escribirás desde Johto? Con horas. Y con fotos de las Fisuras. Pequeñitas.' },
			{ rep: { kalos: 2 } },
			{ set: { 'flag.b02_lucien_madre': true } },
			{ quest: 'b02_s_lucien', done: true },
		],
		b02_lucien_cipres: [
			{ say: 'cipres', text: '¡Lucien! ¡Mi asistente más joven y más ilegal! ¿Dónde estabas? Tu madre ha llamado tres veces. La tercera, llorando. La segunda, amenazando.' },
			{ say: 'lucien', text: 'En la cola de la Gira. De incógnito. Me pilló.' },
			{ text: 'Lucien te señala con la barbilla, como si fuera tu culpa.' },
			{ say: 'cipres', text: 'Hmm. ¿Sabes qué? Te propongo un trato científico. Esta noche, el telescopio del laboratorio, la ventana que da a la Plaza y un cuaderno nuevo. Tú apuntas todo lo que haga la Puerta durante la ceremonia. Con horas.' },
			{ say: 'lucien', text: '¿Con horas de verdad? ¿Como un investigador?' },
			{ say: 'cipres', text: 'Como mi investigador. Y luego llamamos a tu madre. Primero a tu madre, en realidad. Ahora mismo.' },
			{ text: 'Lucien se sienta delante del telescopio sin quitarse la mochila. El Chespin asoma, mira por el ocular y estornuda.', cond: 'flag.b01_lucien_chespin' },
			{ give: 'ultraball', n: 2 },
			{ say: 'cipres', text: 'Esto, por traérmelo. Y por no dejar que cruzara. Algunas puertas hay que mirarlas mucho antes de abrirlas. Lo dice un científico. Lo dice también una madre muy enfadada.' },
			{ set: { 'flag.b02_lucien_cipres': true } },
			{ quest: 'b02_s_lucien', done: true },
		],

		// =================== PHILIPPE ===================
		b02_philippe: [
			{ set: { 'flag.b02_philippe': true } },
			{ text: 'Junto a las gradas, Philippe sujeta un cartel de «SE ALQUILA» con una mano y señala con la otra la última planta de un edificio de la plaza.' },
			{ say: 'philippe', text: '¡{jugador}! ¡Justo a quien buscaba! Bueno, buscaba a cualquiera, pero has llegado tú, y eso es el destino. Mira. Mira arriba. Ático. Terraza. Y vistas directas a la **Puerta Lemnis**.' },
			{ say: 'philippe', text: 'Ahora mismo, las vistas más cotizadas de Kalos. El dueño dice que de noche zumba. Yo digo que es «ambiente sonoro». En el anuncio pone «ambiente sonoro».' },
			{ choice: [
				{ text: '«Me voy a Johto mañana, Philippe.»', cond: FIN, then: [{ say: 'philippe', text: '¡Precisamente! ¿Y a qué vas a volver? ¿A una habitación del Centro Pokémon? Un entrenador necesita un sitio al que volver. La casa viene incluida. Phil-osofía.' }] },
				{ text: '«¿Cuánto cuesta?»', then: [{ say: 'philippe', text: 'Más de lo que tienes. Menos de lo que vale. —Mira tu cara—. Bastante más de lo que tienes. Pero te guardo la ficha.' }] },
				{ text: '«¿Vistas a una puerta que se abre sola?»', then: [{ say: 'philippe', text: 'Visto así… —Mira la Puerta. La Puerta zumba—. …Lo pondré como «ambiente sonoro con personalidad».' }] },
			] },
			{ say: 'philippe', text: 'Mira, te hago un truco para cerrar el trato. Piensa en una carta. ¿Ya? No me la digas.' },
			{ text: 'Baraja con mucho estilo. Demasiado estilo: medio mazo sale volando, pasa por encima de la valla y cae justo delante de la Puerta. Un guardia de Lemnis se agacha a recoger un tres de tréboles con cara de no cobrar lo suficiente.' },
			{ say: 'philippe', text: '¿Era el tres de tréboles? —Pausa—. ¿No? …Era la siguiente, entonces. La que se ha quedado al otro lado de la valla. Esa era.' },
			{ say: 'philippe', text: 'Ficha número uno, {jugador}. Cuando vuelvas, te espera un sitio. Quizá no este. Pero uno. Philippe no olvida a sus clientes. Philippe olvida cartas.' },
		],

		// =================== ABUELA REMEDIOS ===================
		b02_remedios: [
			{ set: { 'flag.b02_remedios': true } },
			{ text: 'En un banco del Bulevar Sur, una señora mayor descansa con una bolsa de pan en el regazo y una flor de cempasúchil de papel en el pelo. Respira despacio. Mira pasar a la gente como quien mira el mar.' },
			{ if: 'done.ev_muertos', then: [
				{ say: 'remedios', text: '¡Ay, mij{o|a|e}! {jugador}. Siéntate, siéntate, que me alegras el día. ¿Y mi Fuecoco? ¿Come bien? ¿Se abriga? No me contestes, que ya sé que sí.', cond: 'owns("fuecoco") || owns("crocalor") || owns("skeledirge")' },
				{ say: 'remedios', text: '¡Ay, mij{o|a|e}! {jugador}. Siéntate, siéntate, que me alegras el día.', cond: '!owns("fuecoco") && !owns("crocalor") && !owns("skeledirge")' },
			], else: [
				{ say: 'remedios', text: 'Siéntate, mij{o|a|e}, que el banco es grande y yo ocupo poco. ¿Tú eres de esos de la Gira? Mi nieta te vio en la pantalla. {jugador}, ¿verdad? Qué nombre tan bonito. Yo soy Remedios. La abuela de los Ortega.' },
				{ say: 'remedios', text: 'Venimos de Paldea, pero mi familia era de mucho más lejos. De donde las flores naranjas. Ya te contaré otro día.' },
			] },
			{ text: 'Se queda un momento callada, con los ojos cerrados, al sol.' },
			{ say: 'remedios', text: 'Antes venía andando hasta la plaza todas las mañanas, con el pan. Ahora llego hasta este banco y aquí me quedo un rato, a que el pan se enfríe. Las piernas me piden sillón y el corazón me pide calle. Últimamente gana el sillón.' },
			{ say: 'remedios', text: 'Mi nieta dice que la Gira los lleva lejísimos. A Johto. Allí no saben hacer pan de muerto, seguro. Saben hacer otras cosas, muy ricas, pero eso no.', cond: '!flag.b02_puerta_cruzada' },
			{ say: 'remedios', text: 'Mi nieta dice que ya vas y vienes por esa puerta como quien va al mercado. A Johto. Allí no saben hacer pan de muerto, seguro. Saben hacer otras cosas, muy ricas, pero eso no.', cond: 'flag.b02_puerta_cruzada' },
			{ text: 'Rebusca en la bolsa del pan y saca una hoja doblada en cuatro, con manchas de mantequilla.' },
			{ say: 'remedios', text: 'Toma. La receta. La de verdad, la de mi abuela. Las cantidades no vienen, porque nunca las he sabido: se hace a ojo, como todo lo importante.' },
			{ give: 'recetapanmuerto' },
			{ say: 'remedios', text: 'Para que no te falte. Y si un día la haces lejos de aquí y te sale fea, no pasa nada. El pan feo también se come. Y sabe a casa igual.' },
			{ choice: [
				{ text: '«Gracias, Remedios. La haré.»', then: [{ say: 'remedios', text: 'Ya sé que la harás. Se te ve en la cara que eres de los que cumplen. —Te da una palmadita en la mano—. Y si no te sale, me llamas y te riño.' }] },
				{ text: '«¿Por qué me la da a mí?»', then: [{ say: 'remedios', text: 'Porque tienes cara de ir a muchos sitios. Y las recetas, mij{o|a|e}, tienen que viajar. Si se quedan en un cajón, se olvidan de cómo se hacen.' }] },
				{ text: 'Quedarte un rato con ella, al sol.', then: [{ text: 'Se quedan los dos en el banco, sin decir nada. Ella te da un trozo de pan. Está tibio todavía. Sabe a naranja.' }, { happy: { who: 'riolu', n: 3 } }] },
			] },
			{ say: 'remedios', text: 'Anda, vete, que te van a dejar sin sitio en esa puerta. Yo me quedo un poquito más. Aquí se está bien.', cond: '!flag.b02_puerta_cruzada' },
			{ say: 'remedios', text: 'Anda, vete, que esa puerta no espera a nadie. Yo me quedo un poquito más. Aquí se está bien.', cond: 'flag.b02_puerta_cruzada' },
		],

		// =================== PROF. CIPRÉS ===================
		b02_cipres: [
			{ set: { 'flag.b02_cipres': true } },
			{ text: 'El laboratorio está patas arriba. Cajas, cables, un telescopio a medio desmontar. El profesor Ciprés intenta meter un termo de café en una caja que ya está llena de termos de café.' },
			{ say: 'cipres', text: '¡{jugador}! ¡Te vas mañana! Fascinante y preocupante. Mi combinación favorita, ya lo sabes.' },
			{ if: 'owns("fennekin") || owns("braixen") || owns("delphox")', then: [
				{ say: 'cipres', text: '¿Y el zorrito? ¿Viene contigo a Johto? ¡Pues claro que viene! Míralo. Ya no tiene miedo a las puertas. Ni a nada, diría yo. Sois un buen equipo.' },
				{ say: 'cipres', text: 'Cuidado en Johto con los bosques: los Fennekin y los árboles viejos se quieren mucho, pero los árboles viejos se queman fatal.', cond: 'owns("fennekin")' },
			], else: [
				{ if: 'flag.b01_fennekin_rhi', then: [
					{ say: 'cipres', text: 'El Fennekin que rescató tu amiga pelirroja sigue aquí. Ella vino ayer a despedirse de él. Le habló cinco minutos de tácticas de fútbol. Él la escuchó como quien escucha un poema.' },
				] },
				{ if: 'flag.b01_fennekin_libre && !flag.b01_fennekin_rhi', then: [
					{ say: 'cipres', text: 'El Fennekin sigue aquí. Mira por la ventana, hacia la Plaza, desde que se anunció la Gira. Creo que sabe que te vas. Los zorros de fuego saben esas cosas.' },
				] },
				{ say: 'cipres', text: 'Si algún día vuelves por aquí y lo quieres, ya sabes dónde está. Comiendo de más.', cond: 'flag.b01_fennekin_libre' },
			] },
			{ say: 'cipres', text: 'Mira esto. —Te enseña una pantalla con un mapa de Johto lleno de puntitos—. Fisuras en Johto. Pequeñas. Casi todas cerca de sitios muy viejos: unas ruinas con escritura antigua, un bosque sagrado, una torre que se quemó.' },
			{ say: 'cipres', text: 'Como si buscaran algo debajo de la tierra. Ansel dijo una vez algo parecido, en esta misma mesa. Que las Fisuras «se abren donde la tierra es más antigua». No me gustó cómo sonaba. Ahora me gusta todavía menos.', cond: 'flag.b01_enc_ansel_1' },
			{ say: 'cipres', text: 'Como si buscaran algo debajo de la tierra. No me gusta cómo suena. A un científico no deberían asustarle los patrones. Pero algunos patrones tienen dientes.', cond: '!flag.b01_enc_ansel_1' },
			{ choice: [
				{ text: '«¿Algún consejo para Johto?»', then: [{ say: 'cipres', text: 'Habla con los profesores de allí: saben más que yo de sus bosques. Y prueba los dulces de Iris. Eso no es ciencia, es supervivencia.' }] },
				{ text: '«¿Vendrá a la ceremonia?»', then: [{ say: 'cipres', text: 'La veré desde aquí, por el telescopio. —Señala la ventana, que da a la Plaza—. Me gusta mirar las cosas importantes desde un poco lejos. Se ve mejor qué se mueve alrededor.' }] },
			] },
			{ text: 'Mete la mano en una caja y saca un puñado de Ultra Balls, como quien saca caramelos.' },
			{ give: 'ultraball', n: 3 },
			{ say: 'cipres', text: 'Para lo que encuentres allí. Y apúntalo todo. Con fotos. Con gráficas, si es posible. ¡Buen viaje, {jugador}! ¡Y a ti también, {riolu}! Cuida de que no se meta en líos. Bueno: de que se meta en los justos.' },
		],

		// =================== CONDE VLADIMIRO ===================
		b02_conde: [
			{ set: { 'flag.b02_conde': true } },
			{ text: 'El Conde está de pie ante el retrato más antiguo del vestíbulo, el que está casi negro de barniz. Tiene una vela en la mano y la acerca al lienzo, muy despacio, como si leyera.' },
			{ say: 'conde', text: 'Ah. Mi visita favorita. Acérquese. Le presento a un viejo conocido. —Señala al hombre gigantesco del cuadro, el de la flor en la mano—. Bueno. Conocido de mi tatarabuelo. Que era yo. Digo… que se parecía mucho a mí.' },
			{ say: 'conde', text: 'Vino a Vánitas una vez, hace muchísimo, a pedir algo que nadie en este pueblo podía darle: más tiempo. Para alguien. Le dijimos que el tiempo no se vende. Él dijo que lo sabía, porque lo había comprado. Y que le había salido caro.' },
			{ say: 'conde', text: 'Lo curioso es que la semana pasada lo vi en Luminalia. Junto a esa Puerta nueva tan ruidosa. Igualito que en el cuadro. Ni una arruga más. —Se toca la mejilla, que tampoco tiene ninguna—. Y eso, viniendo de mí, es mucho decir.' },
			{ choice: [
				{ text: '«¿Quién es?»', then: [{ say: 'conde', text: 'Alguien que esperó demasiado. Eso me dijo él, y yo no le pregunté más. Entre gente que no envejece hay una regla: no se pregunta la edad. Ni el nombre antiguo.' }] },
				{ text: '«Usted tampoco ha cambiado nada.»', then: [{ say: 'conde', text: 'Gracias. Es la humedad del castillo. Y el no salir nunca al sol. Y… nada más. Es la humedad.' }] },
			] },
			{ say: 'rotom', text: '¡Bzzt! Vuelvo a medir el barniz: tres mil años. Sigue siendo imposible. Voy a dejar de medirlo, que me pongo nervioso.' },
			{ say: 'conde', text: 'Si lo ve, salúdelo de mi parte. No hace falta que le diga mi nombre. Sabrá quién es el que pregunta.' },
		],

		// =================== SERA: EL ENCARGO ===================
		b02_sera_encargo: [
			{ set: { 'flag.b02_sera_encargo': true } },
			{ text: 'El Holomisor de Serafina vibra. Una sola vez, larga. Cuando lo abres, la imagen ya está ahí: melena negra y recta, guantes blancos y, al fondo, una ventana con la noche de alguna otra ciudad.' },
			{ say: 'sera', text: 'Buenas tardes. Disculpe la hora; en mi oficina son otras. Le robaré tres minutos. Es una expresión. No pienso robarle nada.' },
			{ say: 'sera', text: 'Imagino que ya sabe lo de la Central de Kalos. Su amigo el policía de los disfraces es muchas cosas, pero no es lento.' },
			{ say: 'sera', text: 'Lo que se llevaron es nuestro. Le ahorraré los detalles técnicos: es una pieza pequeña, oscura y muy cara. Y quien la tiene no la robó para colgarla en el salón.' },
			{ say: 'sera', text: 'Mi encargo es sencillo. Usted va a Johto. Si esa pieza aparece en Johto, y aparecerá, quiero saber en qué manos está. Antes que la policía. Antes que mi propia empresa, si es posible.' },
			{ choice: [
				{ text: '«¿Antes que su propia empresa?»', then: [
					{ af: { sera: 2 } },
					{ say: 'sera', text: 'Buena pregunta. La educación me obliga a no contestarla. —Una pausa mínima—. Digamos que en una casa grande hay muchas puertas, y no todas las abre la misma llave.' },
				] },
				{ text: '«De acuerdo. Si la veo, le aviso.»', then: [
					{ af: { sera: 1 } },
					{ say: 'sera', text: 'Bien. Me gusta la gente que no negocia lo que no hace falta negociar. Es una forma de cortesía muy poco valorada.' },
				] },
				{ text: '«Se lo contaré a Handsome.»', then: [
					{ af: { sera: -1 } },
					{ say: 'sera', text: 'Hágalo. Él ya lo sabe. —No parpadea—. Yo solo quería saber si usted me lo diría a la cara. Me lo ha dicho. Eso también es información.' },
				] },
			] },
			{ say: 'sera', text: 'Mañana estaré en la ceremonia. En público, usted y yo no nos conocemos más que lo justo. En privado… ya veremos. La etiqueta tiene excepciones, pero hay que ganárselas.', cond: '!flag.b02_en_ceremonia' },
			{ say: 'sera', text: 'Dentro de un momento subiré a ese escenario. En público, usted y yo no nos conocemos más que lo justo. En privado… ya veremos. La etiqueta tiene excepciones, pero hay que ganárselas.', cond: 'flag.b02_en_ceremonia' },
			{ say: 'sera', text: 'Buen viaje. Un mundo. Una liga.' },
			{ text: 'La imagen se apaga. El Holomisor tarda un rato en dejar de estar frío.' },
			{ quest: 'b02_t_sera', stage: 'encargo' },
		],

		// =================== REVANCHAS DE LÍDERES ===================
		b02_brock_revancha: [
			{ text: 'Brock está en lo alto de la pared, con un delantal nuevo que pone «NUEVA TEMPORADA» bordado a mano. Torcido. Lo ha bordado él.' },
			{ say: 'brock', text: '¡{jugador}! ¿Te vas a Johto? ¡Pues no te vas sin revancha! Es la tradición. Bueno, la tradición la acabo de inventar. Pero suena a tradición, ¿no?', cond: '!flag.b02_puerta_cruzada' },
			{ say: 'brock', text: '¡{jugador}! ¿De visita desde Johto? ¡Pues no te vuelves sin revancha! Es la tradición. Bueno, la tradición la acabo de inventar. Pero suena a tradición, ¿no?', cond: 'flag.b02_puerta_cruzada' },
			{ say: 'brock', text: 'Antes me enamoraba de cada chica que veía. Ahora me enamoro de cada tortilla que me sale bien. Es más sano. Las tortillas no me dicen que no. Me lo dicen las sartenes.' },
			{ say: 'brock', text: 'Mis Pokémon han crecido. Yo también, un poco. Hacia los lados, sobre todo. ¿Listo?' },
			{ choice: [
				{ text: '«¡Vamos allá!»', then: [
					{ battle: 'brock_r2', lose: 'continue',
						onWin: [
							{ say: 'brock', text: '¡Ja! ¡Así me gusta! Toma: esto se lo daba a mis hermanos pequeños cuando iban de viaje. Bueno, a mis hermanos les daba bocadillos. Pero esto dura más.' },
							{ give: 'leftovers' },
							{ say: 'brock', text: 'Unos **Restos**. Tu Pokémon se va comiendo un poquito en cada turno. Como yo en la cocina.' },
							{ prompt: '¿Curar al equipo antes de seguir?', choice: [
								{ text: 'Sí, por favor.', then: [{ heal: 'Brock reparte galletas de mantequilla. Tu equipo se las come con las migas.' }] },
								{ text: 'No hace falta.', then: [{ say: 'brock', text: 'Como quieras. Las galletas se quedan en la mesa, por si cambias de idea.' }] },
							] },
						],
						onLose: [{ say: 'brock', text: 'La roca aguanta. Pero tú también: se te nota. Vuelve cuando quieras, que la pared no se va a mover.' }, { heal: 'Brock cura a tu equipo con unas Pociones que tenía en el delantal.' }] },
				] },
				{ text: 'Otro día.', then: [{ say: 'brock', text: '¡Aquí estaré! Con la pared y con la sartén.' }] },
			] },
		],
		b02_brock_r2_despues: [
			{ say: 'brock', text: '¿Sabes que me han vuelto a llamar de Teselia? Dicen que allí hay un gimnasio libre y una cocina enorme. Lo de la cocina me lo estoy pensando muy en serio.' },
			{ say: 'brock', text: 'Si en Johto pasas por Ciudad Plateada… no, espera, eso es Kanto. Bueno, si pasas por algún sitio con rocas, salúdalas de mi parte.' },
		],
		b02_blanca_revancha: [
			{ text: 'Blanca está en lo alto del muro, sentada en el borde, con las piernas colgando. Tiene una caja de pañuelos al lado. Llena. De momento.' },
			{ say: 'blanca', text: '¡{jugador}! ¡Te vas a Johto! ¡A MI Johto! ¡Y sin mí! ¡Eso no se hace! …Bueno, sí se hace, es la Gira, pero me da envidia.', cond: '!flag.b02_puerta_cruzada' },
			{ say: 'blanca', text: '¡{jugador}! ¡Vienes de MI Johto! ¡Y yo aquí! ¡Eso no se hace! …Bueno, sí se hace, es la Gira, pero me da envidia.', cond: 'flag.b02_puerta_cruzada' },
			{ say: 'blanca', text: 'Mi Miltank y yo hemos entrenado TODA la temporada para esto. Y he traído a una amiga nueva. Es muy mona. Y da patadas.' },
			{ choice: [
				{ text: '«¡A rodar!»', then: [
					{ battle: 'blanca_r2', lose: 'continue',
						onWin: [
							{ say: 'blanca', text: '¡Waaaah! ¡Otra vez no! ¡Toma! ¡Llévatelos! ¡Que te acuerdes de mí en Johto cada vez que los bebas!' },
							{ give: 'moomoomilk', n: 5 },
							{ say: 'blanca', text: 'Leche Mu-mu. De Miltank. No preguntes de cuál. Y si pasas por Ciudad Trigal, dile a mi madre que estoy bien. Que lloro lo normal.' },
							{ prompt: '¿Curar al equipo antes de seguir?', choice: [
								{ text: 'Sí, por favor.', then: [{ heal: 'Blanca reparte batidos entre tus Pokémon, sorbiendo por la nariz.' }] },
								{ text: 'No hace falta.', then: [{ say: 'blanca', text: '¡Pues me los bebo yo! Para el disgusto.' }] },
							] },
						],
						onLose: [{ say: 'blanca', text: '¡Gané! ¡Waaah, de alegría! Vuelve cuando quieras, que lloro mejor acompañada.' }, { heal: 'Blanca cura a tu equipo con sus batidos.' }] },
				] },
				{ text: 'Otro día.', then: [{ say: 'blanca', text: '¿Otro día? ¡Pero si siempre andas de paso! …Bueno. Aquí estaré. Llorando de antemano.' }] },
			] },
		],
		b02_blanca_r2_despues: [
			{ say: 'blanca', text: 'Ya no lloro. —Se suena la nariz—. Casi. Saluda a Ciudad Trigal de mi parte. Y si ves una tienda de bicis muy rosa, es la de mi prima. Ahí no compres, que te cobra de más.' },
		],
		b02_corelia_revancha: [
			{ text: 'Corelia frena delante de ti con un derrape que deja una raya negra en la pista. Lucario la espera al fondo, con los brazos cruzados y la Lucarita brillando en el pecho.' },
			{ say: 'corelia', text: '¡{jugador}! ¿Otra vez de viaje sin una revancha? ¡Ni hablar! ¡Esta vez, con todo! ¡Megaevolución contra Megaevolución! ¡Vínculo contra vínculo! ¡A TOPE!' },
			{ if: 'inParty("lucario")', then: [{ text: '{riolu} y el Lucario de Corelia se miran desde lados opuestos de la pista. Ninguno se mueve. El aire, entre los dos, parece temblar un poco.' }] },
			{ say: 'corelia', text: 'Lila se adelanta a Johto para prepararme el gimnasio del programa de intercambio. Yo iré más tarde. Así que no te despido: ¡te digo hasta luego! Pero antes, ¡combate!' },
			{ choice: [
				{ text: '«¡A tope!»', then: [
					{ battle: 'corelia_r2', lose: 'continue',
						onWin: [
							{ say: 'corelia', text: '¡Uaaah! ¡Qué combate! ¡El abuelo lo habrá oído desde la Torre! Toma, te la has ganado.' },
							{ give: 'expertbelt' },
							{ say: 'corelia', text: 'Una **Cinta Experto**. La llevé en mi primera temporada. Golpea más fuerte cuando el golpe es el que toca. Como tú.' },
							{ prompt: '¿Curar al equipo antes de seguir?', choice: [
								{ text: 'Sí, por favor.', then: [{ heal: 'Corelia pasa patinando a toda velocidad repartiendo Pociones. Ni frena.' }] },
								{ text: 'No hace falta.', then: [{ say: 'corelia', text: '¡Eso es actitud! ¡A tope incluso cansad{o|a|e}!' }] },
							] },
						],
						onLose: [{ say: 'corelia', text: '¡Así se hace, Lucario! ¡Pero tú tampoco te has rendido ni un segundo! Vuelve cuando quieras.' }, { heal: 'Corelia cura a tu equipo. Lo hace patinando.' }] },
				] },
				{ text: 'Otro día.', then: [{ say: 'corelia', text: '¡Va! ¡Pero que sea pronto, que me oxido! ¡Bueno, las ruedas se oxidan! ¡Yo no!' }] },
			] },
		],
		b02_corelia_r2_despues: [
			{ say: 'corelia', text: '¡Hasta luego, {jugador}! Lila se adelanta y yo llegaré a Johto más tarde. ¡Guárdame un gimnasio con rampas!' },
		],

		// =================== LA CEREMONIA ===================
		b02_ceremonia_espera: [
			{ if: '!flag.b02_agencia_hecha', then: [
				{ say: 'empleado_gira', text: 'La ceremonia todavía no ha empezado. ¿Inscrit{o|a|e}? Ah, sí, sales en la lista. Por cierto, en la Agencia de Detectives preguntaban por ti. Un señor con gabardina. Ha venido cuatro veces. Con cuatro bigotes distintos.' },
			], else: [
				{ say: 'empleado_gira', text: 'Todavía estamos montando. Vuelve en un rato. ¿Tienes algún asunto pendiente en Luminalia? Hazlo ahora. Luego no hay vuelta atrás en unos días.' },
				{ if: 'quest.b02_t_noa == "centro"', then: [{ say: 'rotom', text: '¡Bzzt! Recordatorio: Noa te espera en la puerta trasera del centro de procesamiento, en el Bulevar Este.' }] },
				{ if: 'quest.b02_s_lucien == "devolver"', then: [{ say: 'empleado_gira', text: 'Y el chiquillo de la gorra que se iba con usted… Llévelo a donde le dijo, por favor. Aquí no puede quedarse. Ni colarse.' }] },
			] },
		],
		b02_ceremonia: [
			{ text: 'La plaza se ha llenado. Gradas hasta arriba, banderines de Kalos y de Johto, drones con cámara. Los novatos de la Gira hacen fila delante de la Puerta, con el dorsal puesto.' },
			{ say: 'empleado_gira', text: '¡Inscritos, a la fila! Antes de cruzar, revisión médica del equipo. Y un consejo: guarden la partida de su vida. Es una broma. Más o menos.' },
			{ prompt: 'Después de cruzar no podrás volver a Kalos en un tiempo.', choice: [
				{ text: 'Estoy list{o|a|e}.', then: [] },
				{ text: 'Todavía tengo cosas que hacer en Kalos.', then: [
					{ say: 'empleado_gira', text: 'Sin prisa. La Puerta no se va a ningún sitio. Bueno, eso esperamos todos.' },
					{ end: true },
				] },
			] },
			{ text: 'Una enfermera Joy con la gorra de la Gira revisa a tu equipo con un escáner. Asiente. Te pone una pegatina en la manga: «APTO».' },
			{ heal: true },
			{ save: true },
			{ diary: 'Hoy es el día de la Gira. Mi entrenador{|a|e} se ha despedido de Kalos y {riolu} no se ha separado de su lado ni un momento. Dicen que cruzar la Puerta es como parpadear. ¡Voy a intentar no parpadear para no perderme nada! ¡Bzzt!', cond: 'flag.b01_diario' },
			{ if: '!flag.b02_rouxel_caido', then: [
				{ text: 'En la pantalla grande de la plaza pasa un titular de noticias, entre anuncio y anuncio: «Lemnis Kalos anuncia la reestructuración de su dirección». Debajo, una foto de Fabien Rouxel sonriendo. La quitan enseguida.' },
				{ set: { 'flag.b02_rouxel_caido': true } },
			] },
			{ if: '!flag.b02_hector_matiere', then: [
				{ text: 'Entre el público, un oficinista con máscara agita una tarjeta en alto. Es Héctor. Grita algo que no oyes con la música. Lees los labios: «¡HE ENTRADO! ¡EN LA AGENCIA! ¡SOLO!». Hawlucha, a su lado, hace una voltereta de celebración.' },
				{ set: { 'flag.b02_hector_matiere': true } },
				{ quest: 'b02_t_hector', done: true, silent: true },
			] },
			{ if: 'flag.b01_trato_sera && has("holomisorsera") && !flag.b02_sera_encargo', then: [{ set: { 'flag.b02_en_ceremonia': true } }, { call: 'b02_sera_encargo' }] },
			{ text: 'Junto al escenario, con la carpeta abierta y un bolígrafo en la mano, el inspector Lebrun mira el reloj de la Torre Prisma. Luego el suyo. Luego apunta algo.' },
			{ text: 'Un vendedor de churros con gabardina, gafas de sol y un bigote rubio pasa por tu lado sin mirarte.' },
			{ say: 'handsome', as: 'Vendedor de churros', text: 'No me mires. Handsome irá por su cuenta. Por la puerta de servicio. Tú cruza, mira y apunta. Nos vemos al otro lado. —Pausa—. ¿Quieres un churro? Son de verdad. Me los he comido casi todos.' },
			{ if: 'flag.b02_lucien_publico', then: [{ text: 'En la primera fila de público, pegado a la valla, Lucien apunta en su libreta con la lengua fuera. Te ve y levanta el lápiz como si fuera una espada.' }] },
			{ if: 'flag.b02_lucien_cipres', then: [{ text: 'En la ventana del laboratorio de Ciprés, al otro lado de la plaza, se ve el reflejo de un telescopio. Y una gorra enorme.' }] },
			// Lila, delegada de la Torre
			{ text: 'Al pie del escenario, junto a los representantes de cada gimnasio, hay una chica de pelo blanco con un mechón verde y una túnica de la Torre Maestra recién planchada. Te ve. Saluda con la mano. Luego se acuerda de que es una delegada y la baja.' },
			{ if: 'flag.b01_lila_llama', then: [
				{ say: 'lila', text: '¡{jugador}! Me han mandado a representar a la Torre. Otra vez. Pero esta vez no me ha temblado la voz al presentarme. Bueno, un poco. Al principio. Luego ya no.' },
				{ say: 'lila', text: 'Desde lo de la llama… no sé. Me miro al espejo y veo a alguien que puede hacer cosas. Es raro. Me estoy acostumbrando.' },
			], else: [
				{ say: 'lila', text: '¡{jugador}! Me han mandado a representar a la Torre. O-otra vez. «Quedarse de pie y no tirar nada». Ya he tirado un vaso de agua. Pero estaba vacío. Casi.' },
			] },
			{ say: 'lila', text: 'Te quería contar una cosa. Corelia va a ir a Johto con el programa de intercambio, más adelante. Y yo me adelanto. ¡Como ayudante! Para prepararle el gimnasio. Cruzo hoy, con los delegados, detrás del último grupo. Así que… nos vemos allí. Si quieres.' },
			{ choice: [
				{ text: '«Claro que quiero. Te guardo un sitio.»', then: [{ af: { lila: 2 } }, { say: 'lila', text: '¿S-sí? —Se le ponen las orejas rojas—. Ok. Bien. Guárdamelo. Que sea uno sin vasos de agua cerca.' }] },
				{ text: '«Vas a hacerlo genial. Tú sola.»', then: [{ af: { lila: 2 } }, { say: 'lila', text: '«Tú sola». —Lo repite bajito, como si lo probara—. Me gusta cómo suena. Me da miedo, pero me gusta.' }] },
				{ text: '«¿Corelia sabe que vas a tirar cosas allí también?»', then: [{ af: { lila: 1 } }, { say: 'lila', text: '¡Ja! P-perdón, me he reído por la nariz otra vez. Delante de las cámaras. —Se tapa la cara—. Corelia dice que mientras no tire la Torre, todo bien.' }] },
			] },
			{ quest: 'b02_t_lila', stage: 'ceremonia' },
			// Sera
			{ text: 'Las luces bajan. Sube al escenario Serafina Lemnis. Traje azul medianoche, guantes blancos, el broche de la lemniscata. La plaza entera se calla sin que nadie se lo pida.' },
			{ say: 'sera', text: 'Buenas tardes, Kalos. Buenas tardes, Johto, que nos ve al otro lado.' },
			{ say: 'sera', text: 'Hace unas semanas, esta plaza vio abrirse una herida en el aire. Hoy va a ver abrirse una puerta. La diferencia entre una herida y una puerta es que la puerta la abre alguien que sabe lo que hace.' },
			{ say: 'sera', text: 'Estos novatos han ganado tres medallas en Kalos. Ahora cruzarán a Johto, a Ciudad Trigal, donde les esperan sus próximos gimnasios. Son los primeros. No serán los últimos.' },
			{ say: 'sera', text: 'Un mundo. Una liga.' },
			{ text: 'Aplausos. La Puerta se enciende. Primero un zumbido grave, que se te mete en los dientes. Luego el arco se llena de luz azul y plata, como agua que se pone de pie. En la pantalla: «**DESTINO: CIUDAD TRIGAL · JOHTO**».' },
			{ if: 'flag.b01_trato_sera', then: [{ text: 'Desde el escenario, Serafina te mira un instante. En el bolsillo, el Holomisor vibra una vez. Un mensaje de dos palabras: «Puntual. Bien.»' }], else: [{ text: 'Serafina baja del escenario y da la mano, con el guante puesto, a cada novato de la primera fila. A todos les dice «Enhorabuena» con la misma voz. Exactamente la misma.' }] },
			// La fila
			{ text: 'Los novatos cruzan de cuatro en cuatro. Cada grupo entra en la luz y desaparece, con un sonido como de página que se pasa. En la pantalla, junto a cada nombre, aparece un tic verde: «**Llegada confirmada: Trigal**».' },
			{ text: 'Primer grupo. Una chica con una bufanda de Kalos que llora de emoción. Un chico que se santigua tres veces. Un tal Mathéo, de Novarte, que va mascando chicle muy deprisa.' },
			{ say: 'rhi', text: '¡Eh, novat{o|a|e}! —Rhi se te cuela delante, con el número 9 de la chaqueta brillando bajo los focos—. Segundo grupo. El mío. Llego antes que tú, como siempre.', cond: 'af.rhi >= 20' },
			{ say: 'rhi', text: '¡Eh! ¡Tú! —Rhi se te cuela delante, sin pedir permiso—. Segundo grupo. El mío. Llego antes que tú. Acostúmbrate.', cond: 'af.rhi < 20' },
			{ say: 'rhi', text: 'Te espero al otro lado. No llegues tarde, que en Johto el primer gol lo meto yo.' },
			{ say: 'nate', text: 'Qué flojera, cruzar de pie. —Nate se arrastra detrás de ella con las manos en los bolsillos—. Dice que te va a esperar. Lo ha dicho seis veces. A mí no me espera nunca.' },
			{ text: 'Rhi entra en la luz sin mirar atrás. Nate, sí: te hace un gesto con dos dedos, perezoso. Desaparecen.' },
			{ if: 'flag.b01_bastien_cubierto', then: [{ say: 'bastien', text: '¡{jugador}! Tercer grupo. Llevo el uniforme, pero esta vez lo llevo yo a él. —Se toca la libreta del bolsillo—. Nos vemos en Trigal. Te invito a algo. Te lo debo.' }] },
			{ if: 'flag.b01_bastien_rompe', then: [{ say: 'bastien', text: '{jugador}. Tercer grupo. Sin uniforme, sin patrocinio, sin un duro. —Sonríe—. Pero con mi nombre. Solo mi nombre. Nos vemos en Trigal.' }] },
			{ if: 'flag.b01_bastien_silencio', then: [{ text: 'En el tercer grupo, Bastien. Uniforme de Lemnis, perfectamente planchado. Te ve. Aparta la mirada antes de que puedas saludarle. Entra en la luz el primero de su grupo, muy derecho.' }] },
			{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe && !flag.b01_bastien_silencio', then: [{ say: 'bastien', text: '¡{jugador}! Tercer grupo. Nos vemos en Trigal. Froakie… bueno, Frogadier, está nerviosísimo. Yo no. Yo estoy muerto de miedo, que es distinto.' }] },
			{ text: 'Cuarto grupo. Quinto. Una novata de Yantra que entra patinando. Un señor mayor con dorsal y bastón al que todo el mundo aplaude.' },
			{ say: 'empleado_gira', text: '¡Sexto grupo! ¡Número veintitrés! ¡{jugador}!' },
			{ text: 'Te toca.' },
			{ text: 'Caminas hacia la luz. Al tercer paso, {riolu} se para en seco.' },
			{ text: 'Los apéndices de la cabeza, de punta. Las patas, clavadas en el suelo. El aura le tiembla igual que el primer día, en esta misma plaza, justo antes de que el aire se rasgara.' },
			{ prompt: '{riolu} no quiere avanzar.', choice: [
				{ text: 'Ponerle una mano en el hombro y cruzar juntos.', then: [{ text: 'Le pones la mano en el hombro. Él te mira. No se relaja. Pero da el paso contigo.' }, { happy: { who: 'riolu', n: 10 } }] },
				{ text: 'Esperar a que se calme.', then: [{ text: 'Esperas. El organizador carraspea. La fila murmura. {riolu} respira hondo, una vez, dos. Luego avanza, delante de ti, como si fuera él quien te protege a ti. Siempre ha sido así.' }, { happy: { who: 'riolu', n: 8 } }] },
				{ text: '«Si tiemblas, te hago caso.» Y cruzar igualmente, a su lado.', cond: 'flag.b02_az_hecho', then: [{ text: 'Te acuerdas de las palabras del gigante de la Floette. {riolu} te mira como si también las hubiera oído. Tiembla. Pero no te suelta. Cruzan los dos, despacio, con los ojos muy abiertos.' }, { happy: { who: 'riolu', n: 12 } }] },
			] },
			{ cutscene: { bg: { type: 'plaza', landmark: 'gate' }, frames: [
				{ cam: 'push', fx: 'light', text: 'La luz te envuelve. Es tibia. Huele a metal y a lluvia. Detrás de ti, los aplausos suenan cada vez más lejos, como desde debajo del agua.' },
				{ cam: 'still', fx: 'glow', text: 'Delante, en la luz, ves pasar las siluetas de los que cruzaron antes. Todas van en línea recta. Hacia el mismo sitio.' },
				{ shake: 3, cam: 'pan-left', fx: ['shake', 'speedlines'], text: 'Y entonces, un tirón. Hacia un lado. Fuerte, de golpe, como cuando un tren cambia de vía sin avisar.' },
				{ fx: ['zoom', 'speedlines'], text: 'Las siluetas siguen recto. Tú no.' },
				{ cam: 'still', fx: 'flash', text: 'Suenan relojes. Todos los relojes de la plaza a la vez: el de la Torre Prisma, el de Lebrun, el de tu Pokédex. Luego, uno a uno, a destiempo. Tic. Tac. Tic… tac.' },
				{ cam: 'still', fx: 'dark', text: 'Silencio.' },
				{ actors: [{ mon: '{riolu}', key: 'rio', at: 0.42, size: 's', enter: 'fade' }], text: '{riolu} te aprieta la mano. Muy fuerte.' },
				{ tint: '#3a7a4a', fx: 'iris-out', text: 'Huele a musgo.' },
			] } },
			{ set: { 'flag.b02_puerta_cruzada': true } },
			{ quest: 'b02_m1', done: true },
			{ quest: 'b02_m2', stage: 'santuario' },
			{ go: 'santuario_encinar' },
		],
	},

	// =====================================================================
	// NPCs GENÉRICOS DEL TRAMO
	// =====================================================================
	npcs: {
		madre_lucien: { name: 'Señora Perrot', title: 'Panadera, madre de Lucien', generic: true, look: { hair: 'bun', hairColor: '#6b4a2b', outfit: '#f3e6c4', outfit2: '#c4473a', skin: 1, eyes: '#6b4a2b', eyesStyle: 'sharp', mouth: 'open' } },
	},

	// =====================================================================
	// OBJETOS NUEVOS
	// =====================================================================
	items: {
		tarjetarouxel: { name: 'Tarjeta de Rouxel', pocket: 'key', desc: 'Una tarjeta de visita de cartulina gruesa. El logotipo de Lemnis está tachado a bolígrafo, varias veces.',
			read: 'Por delante, en letras grabadas: «**Fabien Rouxel** · Director de Lemnis Kalos». La palabra «Director» está tachada. La lemniscata de la esquina, también.\n\nPor detrás, a mano, un número de teléfono y una frase:\n\n«Para cuando quieras saber qué se calla. Llama de noche: de día sonrío por costumbre. — F.»' },
	},

	// =====================================================================
	// MISIONES NUEVAS (pequeñas)
	// =====================================================================
	quests: {
		b02_s_lucien: { name: 'El novato #101', type: 'side', est: 10, stages: {
			cola: 'Hay un «novato» muy bajito en la cola de la Gira, en la Plaza de la Torre Prisma.',
			devolver: 'Lucien quería colarse en la Gira. Llévalo con su madre (**Bulevar Sur**) o al **laboratorio del Prof. Ciprés**, como le dijiste.',
			hecha: 'Lucien no cruzó la Puerta. Esta vez.',
		} },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		campamento_vacio: { name: 'Hierba aplastada del campamento', icon: '🔍', hours: 24, picks: [1, 2],
			text: 'Rebuscas entre la hierba amarilla, donde estaban las jaulas. Se les cayeron cosas al recoger. Con prisa.',
			wait: 'Ya has rebuscado aquí hace poco. Solo queda hierba aplastada.',
			table: [
				{ id: 'pokeball', w: 20, n: [1, 2] },
				{ id: 'greatball', w: 14, n: [1, 1] },
				{ id: 'superpotion', w: 14, n: [1, 1] },
				{ id: 'oranberry', w: 14, n: [1, 2] },
				{ id: 'aspearberry', w: 10, n: [1, 1] },
				{ id: 'nevermeltice', w: 4, n: [1, 1] },
				{ id: 'icestone', w: 3, n: [1, 1], cond: 'flag.b02_noa_hecha' },
			] },
	},
};
