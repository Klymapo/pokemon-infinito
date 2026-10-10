// Bloque 3 · Tramo 0: «Palabras de piedra».
// Ciudad Iris (llamada de Irene) → desvío de las Rutas 36-37 → Ciudad Malva (escuela, gimnasio cerrado, Torre Bellsprout:
// el show de Tobías y el Sabio Li) → Ruta 32 → Ruinas Alfa (Irene en persona, Lemnis «por patrimonio», Petra, N-02)
// → la cámara sellada ({riolu} lee la pared) → mensaje del gimnasio de Trigal.

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = 'inParty("riolu") || inParty("lucario")';
// La cámara necesita: haber hablado con Irene en las Ruinas, el calco del Sabio Li, haber visto la caja N-02 y a {riolu} en el equipo.
const CAMARA_OK = 'flag.b03_irene_ruinas && has("calcoli") && flag.b03_nodo02 && (' + LUC + ') && !flag.b03_ruinas_hecho';
const FRAG_NINGUNO = '!flag.b02_frag_handsome && !flag.b02_frag_sera && !flag.b02_frag_melia';
const CROMLECH_NINGUNO = '!flag.b01_delatar && !flag.b01_handsome && !flag.b01_trato_sera';

const BAYAS_R32 = [
	{ id: 'oranberry', w: 20, n: [1, 3] }, { id: 'sitrusberry', w: 12, n: [1, 2] }, { id: 'pechaberry', w: 12, n: [1, 2] },
	{ id: 'rawstberry', w: 10, n: [1, 2] }, { id: 'aspearberry', w: 8, n: [1, 2] }, { id: 'persimberry', w: 8, n: [1, 2] },
	{ id: 'leppaberry', w: 8, n: [1, 1] }, { id: 'lumberry', w: 3, n: [1, 1] },
];

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== CIUDAD MALVA ===================
		malva: {
			name: 'Ciudad Malva', short: 'Malva', region: 'johto', kind: 'city', map: { x: 62, y: 46 },
			bg: { type: 'town', roofs: ['#7a5aa6', '#5a4a8a', '#8c6cd0'], far: '#b9a6d6', hill: '#6a8a5a' },
			desc: 'Una ciudad tranquila de tejados **violeta**, calles anchas y árboles viejos. Huele a madera encerada y a tiza.\n\nEn el centro, junto a un estanque, se levanta la **Torre Bellsprout**: tres pisos de madera oscura alrededor de un pilar que, según los de aquí, **se mueve**. Al sur, la **Escuela de Entrenadores**, con las ventanas abiertas y una pizarra que se ve desde la calle. Al oeste, el **Gimnasio**, con la persiana bajada.',
			descNight: 'De noche, Malva se queda muy quieta. Solo la Torre Bellsprout cruje, despacio, como un barco amarrado. Los Hoothoot del estanque ululan a compás.',
			descs: [{ cond: 'flag.b03_ruinas_hecho', text: 'Malva, tranquila como siempre. En la plaza, un cartel nuevo de la Gira: «Ruinas Alfa · **próxima apertura al público** · Un patrimonio de todos, gracias a Lemnis». Alguien le ha dibujado bigote a la lemniscata.' }],
			links: ['ruta36', 'ruta32'],
			enterCond: 'flag.b03_inicio_hecho',
			blockedMsg: 'Un cartel de la Gira en el camino: «Ciudad Malva · fuera del itinerario de esta etapa. Los participantes deben seguir el programa». Alguien ha escrito debajo: «¿Qué programa?».',
			mapNote: 'Torre Bellsprout · Gimnasio cerrado (intercambio) · Escuela de Entrenadores',
			onEnter: [{ script: 'b03_llegada_malva', cond: '!flag.b03_llegada_malva', once: true }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Torre Bellsprout', sub: 'Tres pisos de madera que crujen', icon: '🗼', action: { go: 'torre_bellsprout' }, new: '!beat("sabio_li")' },
				{ label: 'Patio de la Torre', sub: 'Entrenamiento (nivel recomendado 41)', icon: '🥋', action: { go: 'patio_bellsprout' } },
				{ label: 'Escuela de Entrenadores', sub: 'Se oye a alguien explicar tipos a gritos', icon: '🏫', new: '!flag.b03_escuela', talk: [{ cond: 'flag.b03_escuela', script: 'b03_escuela_despues' }, { script: 'b03_escuela' }] },
				{ label: 'Gimnasio de Malva', sub: 'La persiana está bajada', icon: '🪶', talk: [{ script: 'b03_gym_malva' }] },
				{ label: 'Una vecina regando geranios', sub: 'Te mira como si te conociera', icon: '🌺', talk: [{ cond: 'flag.b03_ruinas_hecho', script: 'b03_vecina_malva_2' }, { script: 'b03_vecina_malva' }] },
			],
			rumors: [
				{ text: 'El pilar de la Torre Bellsprout se mueve porque está hecho del tronco de un Bellsprout gigante. Eso dicen los sabios. Los carpinteros dicen que es porque nadie lo ha apuntalado en trescientos años.' },
				{ text: 'Al sur, pasada la Ruta 32, están las **Ruinas Alfa**. Allí hay Pokémon con forma de letra. Si los miras mucho rato, dicen, acabas leyendo cosas que nadie ha escrito.' },
				{ cond: '!flag.b03_ruinas_hecho', text: 'Desde hace un mes pasan camiones de Lemnis hacia las Ruinas. De noche. «Material de conservación», pone en el lateral. Material de conservación que pesa como una casa.' },
				{ text: 'El líder del gimnasio está de intercambio en Kanto. Dicen que allí no hay viento bueno para volar. Dicen que vuelve pronto. Dicen.' },
			],
		},

		// ---------- Torre Bellsprout ----------
		torre_bellsprout: {
			name: 'Torre Bellsprout', parent: 'malva', kind: 'building',
			bg: { type: 'tower', wall: '#4a3826', floor: '#6a5238' },
			desc: 'Tres pisos de tablones oscuros alrededor de un **pilar central** gruesísimo, que se balancea muy despacio de un lado a otro. Toda la torre cruje al compás. Las escaleras están donde menos te lo esperas.\n\nLos **sabios** meditan en cada rellano con sus Bellsprout, que también se balancean. Arriba del todo, en el tercer piso, espera el **Sabio Li**.',
			descs: [{ cond: 'beat("sabio_li")', text: 'La torre sigue balanceándose. Ahora te parece que respira. Los sabios te saludan con una inclinación de cabeza al pasar, sin dejar de mecerse. En el tercer piso, el Sabio Li medita con los ojos cerrados. Sabe que has llegado. No hace falta que abra los ojos.' }],
			mapNote: 'Sabio Li · Tobías graba aquí',
			onEnter: [{ script: 'b03_torre_entrada', cond: '!flag.b03_torre_entrada', once: true }],
			spots: [
				{ label: 'Un hombre que narra a una cámara', sub: 'Y un Persian enorme que bosteza', icon: '🎬', new: '!flag.b03_tobias_1 || (beat("sabio_li") && !flag.b03_tobias_final)', talk: [
					{ cond: 'flag.b03_tobias_final', script: 'b03_tobias_despues' },
					{ cond: 'flag.b03_tobias_1 && beat("sabio_li")', script: 'b03_tobias_final' },
					{ cond: 'flag.b03_tobias_1', script: 'b03_tobias_espera' },
					{ script: 'b03_tobias_1' },
				] },
				{ label: 'Sabio del primer piso', sub: 'Se balancea con su Bellsprout', icon: '🧘', action: { trainer: 'sabio_chao' } },
				{ label: 'Sabio del segundo piso', sub: 'Al otro lado de un tablón que se mueve', icon: '🧘', action: { trainer: 'sabio_jin' } },
				{ label: 'Sabio de la escalera alta', sub: 'Te cierra el paso con una sonrisa', icon: '🧘', action: { trainer: 'sabio_edmundo' } },
				{ label: 'Sabio Li', sub: 'En lo alto de la torre', icon: '🪷', cond: 'beat("sabio_chao") && beat("sabio_jin") && beat("sabio_edmundo")', new: '!beat("sabio_li")', talk: [{ cond: 'beat("sabio_li")', script: 'b03_li_despues' }, { script: 'b03_li' }] },
				{ label: 'La escalera al tercer piso', sub: 'Un sabio la vigila', icon: '🪜', cond: '!(beat("sabio_chao") && beat("sabio_jin") && beat("sabio_edmundo"))', talk: [{ script: 'b03_li_espera' }] },
				{ label: 'El pilar que se mueve', sub: 'Grueso como diez personas', icon: '🌳', talk: [{ script: 'b03_pilar' }] },
				{ label: 'Rincones oscuros de la torre', sub: 'Algo se mueve entre las vigas', icon: '🕸️', action: { explore: 'cave' } },
			],
			encounters: {
				cave: [
					{ sp: 'haunter', lv: [37, 39], w: 30 },
					{ sp: 'raticate', lv: [36, 38], w: 25 },
					{ sp: 'weepinbell', lv: [37, 39], w: 20 },
					{ sp: 'noctowl', lv: [37, 39], w: 20, time: 'night' },
					{ sp: 'medicham', lv: [38, 39], w: 6, displaced: true },
					{ sp: 'spinda', lv: [37, 38], w: 4, displaced: true },
				],
			},
		},

		// ---------- Patio de la Torre (entrenamiento) ----------
		patio_bellsprout: {
			name: 'Patio de la Torre', parent: 'malva', kind: 'area',
			bg: { type: 'town', roofs: ['#7a5aa6', '#5a4a8a'], ground: '#7a8a5a', far: '#b9a6d6' },
			desc: 'Un patio de grava junto al estanque, a la sombra de la Torre Bellsprout. Los aprendices de sabio entrenan aquí: se balancean, combaten, se balancean otra vez.\n\nUn letrero de madera: «La flexibilidad es la fuerza del junco. (Por favor, no pisen el junco.)»',
			mapNote: 'Entrenamiento (nivel 41)',
			spots: [
				{ label: 'Entrenar con los aprendices', sub: 'Entrenamiento (nivel recomendado 41)', icon: '🥋', action: { training: { cap: 41, prize: { wins: 3, script: 'p7_premio_patio_bellsprout' }, trainers: ['patio_bs_1', 'patio_bs_2', 'patio_bs_3'], wild: [{ sp: 'weepinbell', lv: [37, 39] }, { sp: 'noctowl', lv: [37, 39] }, { sp: 'haunter', lv: [37, 39] }], coach: 'Aprendiz de sabio', closed: 'El aprendiz se balancea, te mira y deja de balancearse. «Tu equipo ya no necesita doblarse más. Ahora tiene que aprender a romperse sin romperse. Eso no se enseña aquí.»' } } },
			],
		},

		// =================== RUTA 32 ===================
		ruta32: {
			name: 'Ruta 32', short: 'Ruta 32', region: 'johto', kind: 'route', map: { x: 60, y: 64 },
			bg: { type: 'route', flowers: '#e9d36a', far: '#6a9a8a' },
			desc: 'Un camino largo que baja de Malva hacia el sur, entre hierba alta, charcas y un muelle de madera que se mete en el mar. Al oeste, entre colinas bajas, asoman unas **piedras viejas** colocadas en círculo: las **Ruinas Alfa**.\n\nAl final, la boca de la **Cueva Unión** y, al otro lado, **Pueblo Azalea**.',
			descNight: 'De noche, la Ruta 32 huele a mar. Las ranas de las charcas no se callan nunca. Hacia las Ruinas Alfa se ven focos blancos, quietos, que no son estrellas.',
			links: ['malva', 'azalea'],
			enterCond: 'flag.b03_inicio_hecho',
			blockedMsg: 'Unos operarios de Lemnis cortan el paso a la Ruta 32 con conos naranjas: «Obras de conservación. Prueben otro día». No dicen qué día.',
			mapNote: 'Desvío a las Ruinas Alfa · muelle',
			rumors: [
				{ text: 'En el muelle de la Ruta 32 pican unos Qwilfish que te pinchan aunque los sueltes. Por orgullo.' },
				{ text: 'Hay un pescador que dice que un día pescó un Pokémon con forma de letra. Una «R». Nadie le cree. Él tampoco, la verdad.' },
			],
			route: {
				from: 'malva', to: 'azalea', length: 9, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [{ text: 'El último tejado violeta de Malva queda atrás. Delante, un cartel: «Ruta 32 · Ruinas Alfa ← · Cueva Unión ↓». Debajo, otro más nuevo, con la lemniscata: «Acceso restringido a las Ruinas por obras de conservación».' }],
					1: [
						{ trainer: 'r32_lorenzo' },
						{ text: 'Un camión con la lemniscata adelanta por la cuneta, muy despacio, para no levantar polvo. Lleva una caja enorme atada con correas. Se nota que pesa: el camión va inclinado.' },
					],
					2: [
						{ item: 'hyperpotion' },
						{ spot: { action: { gather: 'bayas_r32' } }, label: 'Arbustos de bayas junto a la charca', icon: '🫐' },
						{ text: 'Una charca llena de Wooper que te miran con la boca abierta. No te miran por nada. Es que tienen así la boca.' },
					],
					3: [
						{ trainer: 'r32_amapola', optional: true, label: 'Una criadora con un Ampharos que no para de chispear' },
						{ item: 'ultraball', hidden: true },
					],
					4: [
						{ text: 'Un camino de tierra se aparta hacia el oeste, entre colinas. Al fondo, piedras grises colocadas en círculo, vallas metálicas y la punta de una carpa blanca.' },
						{ branch: { label: 'Tomar el camino a las Ruinas Alfa', go: 'ruinas_alfa', cond: 'has("calcoli") || flag.b03_irene_ruinas' } },
						{ talk: [{ script: 'b03_ruinas_sin_calco' }], label: 'El camino a las Ruinas Alfa', sub: 'Un técnico de Lemnis aparta conos', icon: '🚧', cond: '!has("calcoli") && !flag.b03_irene_ruinas' },
					],
					5: [
						{ trainer: 'r32_ulpiano' },
						{ text: 'Una piedra gris, sola, en mitad de la hierba. Alguien ha tallado en ella unas marcas. Parecen letras. Parecen ojos. Cuando pasas, juras que una se ha movido.' },
					],
					6: [
						{ terrain: 'water' },
						{ text: 'El **muelle**: tablones viejos que se meten en el mar. Al final, un pescador con sombrero de paja duerme con la caña sujeta entre los pies.' },
						{ trainer: 'r32_benigno', optional: true, label: 'El pescador del sombrero de paja (no duerme tanto)' },
						{ item: 'ppup', hidden: true },
					],
					7: [
						{ trainer: 'r32_aitana' },
						{ text: 'Unos novatos de la Gira hacen fotos a todo: a la hierba, a las charcas, a ti. Uno pregunta si las Ruinas Alfa «se pueden visitar ya o hay que esperar a que Lemnis las termine».' },
					],
					8: [
						{ item: 'revive' },
						{ trainer: 'r32_casimiro', optional: true, label: 'Un hombre con casco y pico, sentado en una roca, de muy mal humor' },
					],
					9: [{ text: 'La boca de la **Cueva Unión** se abre en la ladera, fresca y oscura. Hay un sendero bien marcado que la cruza por el borde: los de Azalea lo usan para ir al mercado. Al otro lado, entre árboles, se ven los tejados de **Pueblo Azalea**.' }],
				},
				encounters: {
					grass: [
						{ sp: 'weepinbell', lv: [36, 39], w: 24 },
						{ sp: 'quagsire', lv: [37, 39], w: 14 },
						{ sp: 'flaaffy', lv: [36, 38], w: 12 },
						{ sp: 'raticate', lv: [36, 38], w: 10 },
						{ sp: 'loudred', lv: [37, 39], w: 8 },
						{ sp: 'linoone', lv: [37, 39], w: 8 },
						{ sp: 'bibarel', lv: [37, 39], w: 8 },
						{ sp: 'skiploom', lv: [36, 38], w: 8, time: 'day' },
						{ sp: 'golbat', lv: [37, 40], w: 14, time: 'night' },
						{ sp: 'arbok', lv: [38, 40], w: 6, time: 'night' },
						{ sp: 'jumpluff', lv: [40, 41], w: 3, time: 'day' },
						{ sp: 'liepard', lv: [37, 39], w: 5, displaced: true },
						{ sp: 'pawmo', lv: [37, 39], w: 4, displaced: true },
					],
					water: [
						{ sp: 'tentacruel', lv: [37, 40], w: 40 },
						{ sp: 'quagsire', lv: [37, 40], w: 30 },
						{ sp: 'qwilfish', lv: [38, 41], w: 25 },
						{ sp: 'floatzel', lv: [37, 40], w: 13 },
					],
				},
			},
		},

		// =================== RUINAS ALFA ===================
		ruinas_alfa: {
			name: 'Ruinas Alfa', short: 'Ruinas Alfa', region: 'johto', kind: 'area', map: { x: 50, y: 72 },
			bg: { type: 'ruins', ground: '#8a9a6a', far: '#6a7a8a', hill: '#7a8a5a' },
			desc: 'Un valle de hierba entre colinas, salpicado de **cámaras de piedra** medio enterradas, como dientes viejos. En las paredes, filas y filas de **letras Unown** talladas que nadie ha terminado de leer.\n\nEn el centro del valle, alrededor de la cámara más grande, **vallas metálicas**, focos, tres carpas blancas y un cartel: «**Proyecto de Conservación del Patrimonio · Lemnis** · Un pasado de todos, protegido por todos».',
			descNight: 'De noche, los focos de Lemnis lo iluminan todo con una luz blanca y plana. Fuera del círculo de luz, entre las cámaras, a veces flotan formas oscuras del tamaño de una mano. Letras. Te miran.',
			descs: [{ cond: 'flag.b03_ruinas_hecho', text: 'Las Ruinas Alfa. Las vallas de Lemnis rodean ahora también la cámara sellada, con un foco apuntando a la puerta que abriste. Los técnicos entran y salen con cajas.\n\nIrene se ha ido. En la piedra de la entrada, alguien ha dejado una flor pequeña y una nota que solo dice: «Perdón».' }],
			links: ['ruta32'],
			mapNote: 'Cámara sellada · excavación de Lemnis · Unown',
			onEnter: [{ script: 'b03_ruinas_llegada', cond: '!flag.b03_irene_ruinas', once: true }],
			spots: [
				{ label: 'Irene', sub: 'Sombrero de ala ancha, dos trenzas, libreta enorme', icon: '📜', cond: 'flag.b03_irene_ruinas && !flag.b03_ruinas_hecho', new: '!flag.b03_irene_leccion', talk: [
					{ cond: '!flag.b03_irene_leccion', script: 'b03_irene_leccion' },
					{ script: 'b03_irene_generico' },
				] },
				{ label: 'La cámara sellada', sub: 'Una pared de piedra sin puerta', icon: '🚪', cond: CAMARA_OK, new: 'true', script: 'b03_camara_abrir' },
				{ label: 'La cámara sellada', sub: 'Todavía no pueden abrirla', icon: '🔒', cond: 'flag.b03_irene_ruinas && !flag.b03_ruinas_hecho && !(' + CAMARA_OK + ')', talk: [{ script: 'b03_camara_falta' }] },
				{ label: 'La cámara sellada', sub: 'Abierta. Ahora es de Lemnis', icon: '🚧', cond: 'flag.b03_ruinas_hecho', talk: [{ script: 'b03_camara_despues' }] },
				{ label: 'Vallas de Lemnis', sub: 'Un agente muy amable vigila la entrada', icon: '🚧', new: '!flag.b03_agente_ruinas', talk: [{ cond: 'flag.b03_agente_ruinas', script: 'b03_agente_generico' }, { script: 'b03_agente_ruinas' }] },
				{ label: 'Carpa de material', sub: 'Cajas apiladas hasta el techo', icon: '📦', cond: 'flag.b03_irene_ruinas', new: '!flag.b03_nodo02', talk: [{ cond: 'flag.b03_nodo02', script: 'b03_carpa_despues' }, { script: 'b03_caja_n02' }] },
				{ label: 'Una mujer dentro de un agujero', sub: 'Y un Pachirisu en el borde, vigilando', icon: '🦴', cond: 'flag.b03_irene_ruinas', new: '!flag.b03_petra_ruinas', talk: [{ cond: 'flag.b03_petra_ruinas', script: 'b03_petra_generico' }, { script: 'b03_petra_ruinas' }] },
				{ label: 'Una turista con gafas de sol', sub: 'Un pañuelo en la cabeza. Mechones rosas', icon: '🕶️', cond: 'flag.b02_frag_melia && flag.b03_irene_ruinas && !flag.b03_melia_ruinas', new: 'true', talk: [{ script: 'b03_melia_ruinas' }] },
				{ label: 'Tierra removida junto a las cámaras', sub: 'Lo que la excavadora deja atrás', icon: '⛏️', action: { gather: 'tierra_alfa' } },
				{ label: 'Pasear entre las cámaras', sub: 'Lejos de los focos', icon: '🌾', action: { explore: 'grass' } },
			],
			encounters: {
				grass: [
					{ sp: 'natu', lv: [37, 39], w: 30 },
					{ sp: 'xatu', lv: [40, 41], w: 8 },
					{ sp: 'loudred', lv: [37, 39], w: 14 },
					{ sp: 'quagsire', lv: [37, 39], w: 12 },
					{ sp: 'linoone', lv: [37, 39], w: 12 },
					{ sp: 'bibarel', lv: [37, 39], w: 12 },
					{ sp: 'smeargle', lv: [38, 40], w: 4 },
					{ sp: 'sigilyph', lv: [38, 40], w: 5, displaced: true },
					{ sp: 'unown', lv: [38, 40], w: 8, time: 'night' },
				],
			},
			rumors: [
				{ text: 'Los Unown no salen de las cámaras. Nunca. Bueno: casi nunca. Esta semana se han visto tres en la Ruta 32 y uno en Iris.' },
				{ text: 'Los técnicos de Lemnis no comen con los arqueólogos de la universidad. Comen en su carpa, con la cremallera cerrada.' },
				{ cond: 'flag.b03_ruinas_hecho', text: 'Dicen que la cámara grande la abrió un novato de la Gira con un Lucario. Lemnis dice que la abrió Lemnis. Los Unown no dicen nada. Pero se han ido todos a otra cámara.' },
			],
		},

		// ---------- La cámara sellada ----------
		camara_alfa: {
			name: 'Cámara sellada', parent: 'ruinas_alfa', kind: 'cave',
			bg: { type: 'ruins', dark: true, wall: '#4a4a52', floor: '#5a5648', crystals: '#7fb0e0' },
			desc: 'Una sala de piedra pequeña, más baja que tú, que huele a polvo frío. Nadie la había pisado en tres mil años: las huellas en el suelo son las tuyas.\n\nEn la pared del fondo, un **mural** tallado. Y en el techo, colgando como murciélagos dormidos, decenas de **Unown**.',
			descs: [{ cond: 'flag.b03_ruinas_hecho', text: 'La cámara, con un foco de Lemnis enchufado en la entrada. La luz blanca aplana el mural y le quita las sombras. Así parece solo un dibujo.\n\nLos Unown del techo se han ido casi todos. Quedan unos pocos, apretados en un rincón, de espaldas a la luz.' }],
			mapNote: 'Mural · Unown',
			spots: [
				{ label: 'El mural', sub: 'Una flor, una máquina y un gigante', icon: '🖼️', talk: [{ script: 'b03_mural' }] },
				{ label: 'Los Unown del techo', sub: 'Se mueven si los miras', icon: '🔣', action: { explore: 'cave' } },
			],
			encounters: {
				cave: [{ sp: 'unown', lv: [38, 40], w: 100 }],
			},
		},
	},

	// =====================================================================
	// PARCHES A LUGARES DE BLOQUES ANTERIORES
	// =====================================================================
	patches: {
		ruta36: {
			route: {
				tramos: {
					5: [
						{ cond: 'flag.b03_inicio_hecho', text: 'En el cruce, alguien ha clavado un cartel nuevo de la Gira debajo del viejo: «→ Ciudad Malva · Torre Bellsprout · Ruinas Alfa». Por el camino del este bajan dos Hoothoot volando en zigzag, como si también fueran de excursión.' },
						{ branch: { label: 'Desvío al este: Ciudad Malva', go: 'malva', cond: 'flag.b03_inicio_hecho' } },
					],
				},
			},
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Torre Bellsprout -----
		sabio_chao: { name: 'Chao', cls: 'Sabio', npc: 'sabio', ai: 2, team: [{ sp: 'weepinbell', lv: 38 }, { sp: 'noctowl', lv: 39 }],
			intro: 'La torre se mueve, el pilar se mueve, mi Weepinbell se mueve. Lo único que no se mueve es tu equipo. Eso hay que corregirlo.', win: 'Te has doblado sin romperte. O te has roto sin que se note. Las dos cosas valen.' },
		sabio_jin: { name: 'Jin', cls: 'Sabio', npc: 'sabio', ai: 2, team: [{ sp: 'haunter', lv: 39 }, { sp: 'noctowl', lv: 40 }],
			intro: 'Abajo hay un señor grabando un programa. Lleva dos días. Le he pedido silencio cuatro veces. Medito peor que nunca. Necesito pegarle a algo. Educadamente.', win: 'Ah. Ya estoy en paz. Gracias. Dile al señor de la cámara que su Persian me ha mirado mal.' },
		sabio_edmundo: { name: 'Edmundo', cls: 'Sabio', npc: 'sabio', ai: 2, team: [{ sp: 'weepinbell', lv: 40 }, { sp: 'victreebel', lv: 41 }],
			intro: 'Arriba está el maestro Li. Antes de subir, una pregunta: ¿qué es más fuerte, el roble o el junco? Responde con tus Pokémon.', win: 'El junco. Siempre el junco. Aunque hoy has sido roble, y has ganado igual. Qué fastidio. Sube.' },
		sabio_li: {
			name: 'Sabio Li', cls: 'Anciano', npc: 'li', ai: 4, iv: 28, reward: 2500, bg: 'tower',
			team: [
				{ sp: 'weepinbell', lv: 40, moves: ['gigadrain', 'sludgebomb', 'stunspore', 'knockoff'], ability: 'chlorophyll', item: 'eviolite', nature: 'bold' },
				{ sp: 'noctowl', lv: 41, moves: ['airslash', 'extrasensory', 'hypnosis', 'roost'], ability: 'tintedlens', item: 'sitrusberry', nature: 'modest' },
				{ sp: 'victreebel', lv: 42, moves: ['powerwhip', 'poisonjab', 'suckerpunch', 'sleeppowder'], ability: 'chlorophyll', item: 'blacksludge', nature: 'adamant' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'Siéntate. No. Levántate. La torre no se sube sentado. ¿Ves cómo se mueve el pilar? No lucha contra el viento. Por eso lleva trescientos años de pie. Veamos si tu equipo sabe moverse.',
			win: 'Ah. Tu compañero no se dobla nunca. Se queda quieto y deja que el viento pase a su lado. Eso no es un junco. Es otra cosa. Más antigua.',
			lose: 'Hoy has sido roble, y el roble se parte. Vuelve cuando seas junco.',
		},
		tobias_2: {
			name: 'Tobías', cls: '«Jefe de piso»', npc: 'tobias', ai: 3, iv: 24, reward: 1800,
			team: [
				{ sp: 'grumpig', lv: 39, moves: ['psychic', 'powergem', 'shadowball', 'thunderwave'], ability: 'thickfat', item: 'oranberry', nature: 'modest' },
				{ sp: 'swoobat', lv: 39, moves: ['airslash', 'psychic', 'heatwave', 'roost'], ability: 'unaware', item: 'sharpbeak', nature: 'timid' },
				{ sp: 'persian', lv: 41, moves: ['fakeout', 'bite', 'playrough', 'uturn'], ability: 'technician', item: 'silkscarf', nature: 'jolly' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: '¡Música dramática! ¡Luces! ¡Que alguien mueva el pilar más deprisa para que dé miedo! ¡EL JEFE DE PISO DE LA TEMPORADA DOS HA APARECIDO!',
			win: '¡Patrocinadores, gracias por las Pociones! ¡Las he gastado todas! ¡Mándenme más!',
			lose: '¡Victoria! ¡Duquesa, hemos ganado! …Duquesa está dormida. Se lo cuento luego. Se lo cuento con gráficos.',
		},

		// ----- Patio de la Torre (entrenamiento, repetibles) -----
		patio_bs_1: { name: 'Wen', cls: 'Aprendiz de sabio', npc: 'sabio', ai: 2, team: [{ sp: 'weepinbell', lv: 38 }, { sp: 'noctowl', lv: 38 }],
			intro: 'Llevo seis meses aprendiendo a balancearme. Hoy toca aprender a parar. Me cuesta.', win: 'Sigo balanceándome. Ya no sé si es la torre o soy yo.' },
		patio_bs_2: { name: 'Ruperta', cls: 'Aprendiz de sabio', npc: 'sabio', ai: 2, team: [{ sp: 'haunter', lv: 38 }, { sp: 'noctowl', lv: 39 }],
			intro: 'El maestro Li dice que el combate es una forma de meditación. Yo medito fatal. A ver si combato mejor.', win: 'Pues combato igual de fatal. Al menos soy coherente.' },
		patio_bs_3: { name: 'Poncio', cls: 'Aprendiz de sabio', npc: 'sabio', ai: 2, team: [{ sp: 'weepinbell', lv: 39 }, { sp: 'victreebel', lv: 40 }],
			intro: 'Mi Victreebel se tragó mi sombrero el primer día. Lo considero una prueba espiritual. La he suspendido.', win: 'Si ves un sombrero de paja dentro de un Victreebel, es el mío. No lo pidas de vuelta. Ya es suyo.' },

		// ----- Ruta 32 -----
		r32_lorenzo: { name: 'Lorenzo', cls: 'Montañero', ai: 2, team: [{ sp: 'graveler', lv: 39 }, { sp: 'sudowoodo', lv: 40 }],
			intro: 'Los camiones de Lemnis bajan por aquí cada noche hacia las Ruinas. Vacíos, no van. Llenos, tampoco vuelven. ¿Entonces qué traen? Combate y lo pensamos.', win: 'Material de conservación, dicen. Yo conservo mis botas veinte años y no necesito un camión.' },
		r32_amapola: { name: 'Leonor', cls: 'Criadora', ai: 2, team: [{ sp: 'ampharos', lv: 39 }, { sp: 'jumpluff', lv: 40 }],
			intro: 'Mi Ampharos chispea más desde que pasan esos camiones. Como si oyera algo. Como si le picara la piel por dentro, donde antes tenía la lana.', win: 'Le doy miel tibia y se calma. Una abuela de Azalea me dijo que miel, leche y paciencia. Funciona con todo.' },
		r32_ulpiano: { name: 'Ulpiano', cls: 'Universitario', ai: 2, team: [{ sp: 'xatu', lv: 40 }, { sp: 'quagsire', lv: 40 }],
			intro: 'Hice la tesis en las Ruinas Alfa. Me echaron la semana pasada. «Por tu seguridad.» Llevaba cinco años trabajando ahí con la misma seguridad que hoy.', win: 'La universidad tenía el permiso. Ahora lo tiene Lemnis. Nadie sabe cuándo cambió. El papel dice que siempre fue así.' },
		r32_benigno: { name: 'Benigno', cls: 'Pescador', ai: 2, team: [{ sp: 'qwilfish', lv: 40 }, { sp: 'tentacruel', lv: 41 }],
			intro: '¿Dormido? Jamás. Estaba meditando. Con los ojos cerrados. Y roncando. Es una técnica muy avanzada.', win: 'Hace una semana pesqué un Unown. Una «R». Lo devolví. Me miró como diciendo «¿y ahora qué hago yo en el mar?».' },
		r32_aitana: { name: 'Aitana', cls: 'Novata de la Gira', ai: 2, team: [{ sp: 'liepard', lv: 40 }, { sp: 'stoutland', lv: 41 }],
			intro: '¡Vengo de Teselia por la Puerta! Bueno, por la de Trigal. Tardé un segundo. Mi Liepard, tres días. Salió por otro sitio. Lemnis dice que es normal.', win: 'Lo encontré en la Ruta 32 lamiéndose una pata. No sé dónde ha estado. Él tampoco lo cuenta.' },
		r32_casimiro: { name: 'Macario', cls: 'Arqueólogo', npc: 'arqueologo', ai: 2, team: [{ sp: 'sandslash', lv: 41 }, { sp: 'claydol', lv: 42 }],
			intro: 'Treinta años excavando las Ruinas Alfa con un pico y una brocha. Llegan ellos con una excavadora y un folleto. ¿Patrimonio? ¡Patrimonio es la paciencia!', win: 'Bueno. Ya me he desahogado. Si ves a la doctora del sombrero, dile que tiene razón. En todo. Que no se lo diga a nadie.' },

		// ----- Ruinas Alfa (opcional) -----
		agente_ruinas: { name: 'Jefe de seguridad', cls: 'Agente de Lemnis', npc: 'agente_lemnis', ai: 3, iv: 22, reward: 1600,
			team: [{ sp: 'porygon2', lv: 40, moves: ['triattack', 'thunderbolt', 'icebeam', 'recover'] }, { sp: 'magneton', lv: 41, moves: ['flashcannon', 'thunderbolt', 'thunderwave', 'triattack'] }],
			intro: 'Lo siento muchísimo. De verdad. Me cae usted bien. Pero esto es propiedad del patrimonio de todos, y el patrimonio de todos me paga a mí.',
			win: 'Bueno. Ha sido un placer. Esto no lo pongo en el informe. Lo pondrá otro, eso sí.',
			lose: 'Lo siento. De verdad. ¿Quiere un café? Tenemos una máquina en la carpa dos.' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== INICIO ===================
		b03_inicio: [
			{ set: { 'flag.b03_inicio_hecho': true } },
			{ cap: 42 },
			{ text: 'Por la mañana, al salir del Centro Pokémon de Iris, algo pasa flotando a la altura de tus ojos.' },
			{ text: 'Es negro, plano, del tamaño de una mano. Tiene un solo ojo en el centro. Gira despacio sobre sí mismo, como una hoja seca que no termina de caer… y se queda quieto. Delante de {riolu}.', cond: LUC },
			{ text: 'Es negro, plano, del tamaño de una mano. Tiene un solo ojo en el centro. Gira despacio sobre sí mismo, como una hoja seca que no termina de caer… y se queda quieto. Delante de ti.', cond: '!(' + LUC + ')' },
			{ say: 'rotom', text: '¡Bzzt! ¡Un Unown! Tipo Psíquico. Viven en las Ruinas Alfa y no salen de allí nunca. Nunca, nunca. Así que esto es… ¿una excursión?' },
			{ text: '{riolu} levanta una pata, despacio. El Unown se ladea, como si leyera algo en el aire entre los dos. Luego se dobla sobre sí mismo, forma una letra que no conoces… y desaparece con un chasquido seco.', cond: LUC },
			{ text: 'El Unown se ladea, como si leyera algo en tu cara. Luego se dobla sobre sí mismo, forma una letra que no conoces… y desaparece con un chasquido seco.', cond: '!(' + LUC + ')' },
			{ say: 'rotom', text: 'Se ha ido. Y yo ya tenía la foto lista. Bueno, la tenía en la cabeza. ¡Bzzt! Llamada entrante. Sinnoh. «Dra. Irene Solberg». Son las… allí son las tantas.' },
			{ say: 'irene', text: '{jugador}. No cuelgues. Es decir, no he llamado para nada urgente. Es decir, sí. Es urgente. —Se le ve el sombrero torcido y, detrás, una maleta abierta—. ¿Dónde estás? Iris. Bien. Bien, bien.' },
			{ if: 'flag.b02_irene_iris', then: [
				{ say: 'irene', text: 'Desde que me mandaste las runas de la viga quemada no he dormido. Bueno, he dormido. Mal. Encima de un diccionario. Tengo la palabra «tomar» marcada en la mejilla. Del revés.' },
			], else: [
				{ if: 'flag.b01_enc_irene_1', then: [
					{ say: 'irene', text: 'Desde la Torre Maestra no he dejado de buscar esas runas raspadas. Y las he encontrado. No raspadas: quemadas. En Iris, en la Torre Quemada. ¿Has estado? Claro que has estado, estás en Iris.' },
				], else: [
					{ say: 'irene', text: 'Te acordarás de mí. De Crómlech. La de las piedras y la lente. Y el sombrero. Sobre todo el sombrero, la gente se acuerda del sombrero.' },
				] },
			] },
			{ say: 'irene', text: 'Escucha. Las runas de «tomar» no están solo en Yantra y en Iris. Llevo una semana cruzando registros. Hay en Malva, en Olivo, en Caoba, en el Lago de la Furia… por todo Johto. Y todas apuntan, como flechas, al mismo sitio.' },
			{ say: 'irene', text: 'Las **Ruinas Alfa**. Al sur de Ciudad Malva. —Respira hondo—. Allí hay una cámara que nadie ha abierto en tres mil años. Y que Lemnis quiere abrir esta semana.' },
			{ say: 'irene', text: '«Por patrimonio», dice el permiso. Con una excavadora. Una excavadora, {jugador}. En una cámara de tres mil años. Es como abrir una carta con un hacha.' },
			{ choice: [
				{ text: '«Acabo de ver un Unown aquí, en Iris.»', then: [
					{ af: { irene: 2 } },
					{ say: 'irene', text: '…¿Aquí? ¿En Iris? ¿Fuera de las Ruinas? —Se acerca tanto a la cámara que solo se le ve un ojo—. Eso no pasa. Los Unown no salen. A menos que algo los esté… despertando. O echando.' },
					{ say: 'irene', text: '¿Qué letra formó? ¿No la conoces? Claro que no la conoces, nadie la conoce, solo yo y cuatro personas más, y dos no me hablan. Da igual. Me la dibujas cuando nos veamos.' },
				] },
				{ text: '«¿Y qué quieres que haga yo?»', then: [
					{ say: 'irene', text: 'Que vengas. Contigo y con tu compañero. Las piedras de Crómlech brillaron cuando él las tocó. Las de la Torre Maestra también. Si alguien va a leer esa cámara antes que una excavadora, quiero que sea él.' },
					{ say: 'irene', text: 'Y que yo esté delante. Eso también. Sobre todo eso.' },
				] },
				{ text: '«¿Tres mil años? ¿Seguro?»', then: [
					{ af: { irene: 1 } },
					{ say: 'irene', text: 'Dos mil novecientos y pico. Redondeo por arriba porque me hace ilusión. —Se pone roja—. Es broma. No redondeo nunca. Bueno, esta vez sí. Tres mil.' },
				] },
			] },
			{ if: 'flag.b02_frag_handsome', then: [
				{ say: 'irene', text: 'Por cierto. Soy consultora de la Policía Internacional. Pedí ver la pieza que entregaste en Iris, por si tenía inscripciones. —Frunce el ceño—. El inspector Lebrun me ha dicho que está «en inventario». Tres veces. Con tres fechas distintas.' },
			] },
			{ if: 'flag.b02_frag_sera', then: [
				{ say: 'irene', text: 'Por cierto: el permiso de Lemnis para las Ruinas se firmó hace cinco días. El mismo día en que, según la prensa, «recuperaron un componente robado en Johto». Seguro que es casualidad. Las casualidades me ponen muy nerviosa.' },
			] },
			{ if: 'flag.b02_frag_melia', then: [
				{ say: 'irene', text: 'Rotom me dice que llevas en la mochila un metal partido con algo grabado. ¿Puedo…? —Rotom le manda la foto antes de que contestes—. Una lemniscata y «N-02». Mmm. Esa N no es Unown. Es solo una N. Qué decepción. Qué decepción tan sospechosa.' },
			] },
			{ say: 'irene', text: 'Tomo un vuelo esta noche. Llego a Malva mañana. Bueno, hoy. Para ti, hoy. Los husos horarios son un invento cruel. Te dejo un mensaje en el Centro de Malva.' },
			{ say: 'irene', text: 'Desde Iris, vuelve a las Rutas 36 y 37: en el cruce hay un desvío al este. —Pausa—. Y {jugador}… gracias por contestar. Mucha gente no me contesta el teléfono. Hablo mucho. Ya lo sé. Ya cuelgo.' },
			{ text: 'Cuelga. Rotom tarda un momento en quitar su cara de la pantalla.' },
			{ say: 'rotom', text: '¡Bzzt! Ruta apuntada: Ciudad Malva, por el cruce de las Rutas 36 y 37. Por cierto, el Unown de antes no está en mi registro de capturas, ni de avistamientos, ni de nada. Es como si no hubiera pasado. Pero ha pasado. Lo he visto yo. Con mi pantalla.' },
			{ quest: 'b03_m1', stage: 'malva' },
		],

		// =================== MALVA ===================
		b03_llegada_malva: [
			{ set: { 'flag.b03_llegada_malva': true } },
			{ text: 'Ciudad Malva te recibe con olor a madera y a tiza. En la plaza, una torre de madera oscura se balancea muy despacio, como si respirara. Nadie le hace caso. Aquí es normal.' },
			{ if: 'flag.b02_furgoneta_presentado', then: [
				{ text: 'En la puerta del Centro Pokémon, un chico con la gorra de la Gira te señala y le da un codazo a su amiga.' },
				{ say: 'empleado_gira', as: 'Novato de la Gira', text: '¡Mira, {el|la|le} de Azalea! {El|La|Le} que se perdió tres días en el bosque y salió con un Lucario. Sale en el boletín de la Gira. «Incidencia resuelta», pone. Con foto.' },
				{ text: 'Su amiga te saluda con la mano. No la conoces de nada. Ella a ti, por lo visto, sí.' },
			] },
			{ if: 'flag.b02_furgoneta_escondido', then: [
				{ text: 'Nadie se gira a mirarte. Un par de novatos de la Gira pasan a tu lado sin saber quién eres. En el tablón del Centro hay una lista de inscritos con fotos; la tuya tiene una pegatina encima: «En tránsito».' },
				{ say: 'rotom', text: '¡Bzzt! «En tránsito». ¡Qué misterioso! Somos un misterio. Me gusta ser un misterio. Bueno, me gustaría más ser un misterio con cobertura.' },
			] },
			{ if: '!flag.b02_furgoneta_presentado && !flag.b02_furgoneta_escondido', then: [
				{ text: 'Unos novatos de la Gira comparan medallas junto a la fuente. Uno lleva cinco. Te mira las tuyas, cuenta y suspira.' },
			] },
			{ text: 'La enfermera Joy del Centro te llama antes de que llegues al mostrador.' },
			{ say: 'joy_johto', text: 'Tú debes de ser {jugador}. Una señora bajita con un sombrero enorme dejó esto para ti esta mañana. Bueno… bajita. Me pidió que no dijera bajita. Ya lo he dicho. No se lo cuentes.' },
			{ text: 'Es una hoja de libreta doblada en ocho, con letra pequeña y muy limpia:' },
			{ text: '*«{jugador}: me he adelantado a las Ruinas Alfa (Ruta 32, desvío al oeste). Lemnis tiene vallas, pero no tiene paciencia; yo sí.\n\nAntes de venir, sube a la **Torre Bellsprout** y pídele al **Sabio Li** el calco de sus maestros. Hace un siglo copiaron la puerta de la cámara grande, antes de que la lluvia borrara media inscripción. Sin ese calco no la podemos leer. Li no presta nada a quien no ha subido la torre. Sube la torre.\n\n— I. S.\n\nP. D.: La torre se mueve. Es normal. No te marees. P. P. D.: No me llames bajita.»*' },
			{ say: 'rotom', text: '¡Bzzt! ¡Una misión con posdata doble! Eso es que es importante. Apuntado: Torre Bellsprout, Sabio Li, calco. Y Ruinas Alfa. Y no llamarla bajita. Esa la apunto en rojo.' },
			{ quest: 'b03_m1', stage: 'ruinas' },
		],
		b03_ruinas_sin_calco: [
			{ text: 'En la entrada del camino, un técnico de Lemnis con chaleco azul coloca conos naranjas en fila. Los mira. Mueve uno dos centímetros. Los vuelve a mirar.' },
			{ say: 'agente_lemnis', as: 'Técnico', text: 'Buenas. Ahora mismo estamos descargando material, no se puede pasar. Una horita, dos. Lo que tarde el camión. —Sonríe—. El patrimonio no tiene prisa.' },
			{ if: 'flag.b03_llegada_malva', then: [
				{ say: 'rotom', text: '¡Bzzt! Recordatorio de la nota de Irene, posdata incluida: primero la **Torre Bellsprout** de Malva y el calco del Sabio Li. «Sin ese calco no la podemos leer.» Y no llamarla bajita. Eso no viene a cuento, pero está en rojo.' },
			], else: [
				{ say: 'rotom', text: '¡Bzzt! Irene dijo que nos dejaba un mensaje en el Centro Pokémon de **Ciudad Malva**, al norte. Igual deberíamos pasar a leerlo antes de colarnos en unas ruinas. Lo digo por educación.' },
			] },
		],
		b03_vecina_malva: [
			{ say: 'vecina_malva', text: 'Ay, tú eres de la Gira, ¿verdad? Se les nota en la cara de cansancio. Y en la gorra.' },
			{ say: 'vecina_malva', text: 'Si vas a la Torre, ten cuidado con el señor de la cámara. Lleva dos días gritándole a una pared «¡patrocinadores!». Los sabios están que trinan. Bueno, que meditan con mucha fuerza.' },
			{ say: 'vecina_malva', text: 'Y si vas a las Ruinas… —Baja la voz—. Mi nieto trabajaba allí, con la universidad. Lo echaron hace una semana. Dice que de noche, desde la carpa grande, sale un zumbido. Que se te mete en los dientes.' },
		],
		b03_vecina_malva_2: [
			{ say: 'vecina_malva', text: 'Mi nieto dice que ya han abierto la cámara grande. Que la abrió alguien de la Gira, con un Lucario. —Te mira. Mira a {riolu}. Vuelve a regar los geranios—. Yo no he dicho nada.', cond: LUC },
			{ say: 'vecina_malva', text: 'Mi nieto dice que ya han abierto la cámara grande. Que la abrió alguien de la Gira. Lemnis dice que ha sido Lemnis. Yo me fío más de mi nieto.', cond: '!(' + LUC + ')' },
		],
		b03_gym_malva: [
			{ text: 'La persiana del gimnasio está bajada. Pegado a ella, un cartel escrito a mano, con letra de alguien que tiene prisa:' },
			{ text: '*«GIMNASIO DE MALVA — CERRADO TEMPORALMENTE.\nEl líder está en Kanto con el Programa de Intercambio del Circuito Infinito.\nNo, no hay líder de sustitución. Lo pedimos. Nos dijeron que «no había presupuesto». Hay presupuesto para camiones.\nLos Pidgeotto del tejado SÍ están. No les deis pan.\n— La dirección»*' },
			{ text: 'Encima del tejado, tres Pidgeotto te miran fijamente. Uno lleva una miga de pan en el pico. Alguien no ha leído el cartel.' },
			{ if: 'flag.b03_ruinas_hecho', then: [{ text: 'Debajo del cartel han añadido una línea con otra letra: «Vuelve pronto. De verdad. Lo ha dicho por teléfono».' }] },
		],
		b03_escuela: [
			{ set: { 'flag.b03_escuela': true } },
			{ text: 'La Escuela de Entrenadores de Malva es una sola aula, con pupitres de madera, una pizarra enorme y siete niños que te miran como si fueras un Pokémon raro. Bueno: miran a {riolu}.', cond: LUC },
			{ text: 'La Escuela de Entrenadores de Malva es una sola aula, con pupitres de madera, una pizarra enorme y siete niños que te miran como si fueras un Pokémon raro.', cond: '!(' + LUC + ')' },
			{ say: 'maestra_malva', text: '¡Una visita de la Gira! Qué ilusión. Niños, saluden. —Los niños saludan—. Estamos con los tipos. Justo ahora. A lo mejor nos puedes ayudar. Te prometo que no muerden. Casi ninguno.' },
			{ text: 'En la pizarra pone, con letra de maestra: «El tipo ACERO resiste a…». Y debajo, con letra de niño: «a TODO».' },
			{ say: 'nino_malva', as: 'Niño del primer pupitre', text: '¡El acero resiste a todo! ¡Mi primo tiene un Steelix y no le hace daño ni un camión!' },
			{ choice: [
				{ text: '«Casi. Al fuego, a la lucha y a la tierra no.»', then: [
					{ say: 'maestra_malva', text: '¡Exacto! Fuego, Lucha y Tierra. Apúntenlo. Y saben quién es de tipo Lucha y Acero a la vez, ¿verdad?' },
					{ text: 'Siete cabezas se giran hacia {riolu}. {riolu} cruza los brazos y se queda muy quieto, muy digno, como una estatua de sí mismo. Una niña aplaude.', cond: LUC },
					{ rep: { johto: 2 } },
				] },
				{ text: 'Dejar que Rotom lo explique.', then: [
					{ say: 'rotom', text: '¡Bzzt! ¡Lección de Rotom! El tipo Acero resiste a… Normal, Planta, Hielo, Volador, Psíquico, Bicho, Roca, Dragón, Acero, Hada… y es inmune a Veneno. ¡Es una lista larguísima! ¡Casi todo!' },
					{ say: 'nino_malva', as: 'Niño del primer pupitre', text: '¿Ves? ¡A TODO!' },
					{ say: 'rotom', text: '…He dicho «casi». Lo he dicho bajito, pero lo he dicho. ¡Fuego, Lucha y Tierra! ¡Apúntenlo! ¡Y no me corrijas, que tengo base de datos!' },
					{ say: 'maestra_malva', text: 'Ya veo que el Rotom también necesita repasar la parte de «no discutir con alumnos de siete años».' },
				] },
				{ text: '«Tu primo tiene razón. Ni un camión.»', then: [
					{ say: 'nino_malva', as: 'Niño del primer pupitre', text: '¡JA! ¡Lo ha dicho {el|la|le} de la Gira!' },
					{ say: 'maestra_malva', text: 'Gracias. Muchas gracias. Ahora tengo que deshacer eso durante tres semanas. —Suspira—. Bueno. Los camiones no son Pokémon. Técnicamente tienes razón. Técnicamente.' },
				] },
			] },
			{ say: 'maestra_malva', text: 'Toma. Es lo que les damos a los que aprueban el examen de tipos. Tú no te has examinado, pero has venido, que ya es mucho.' },
			{ give: 'lumberry' },
			{ text: 'Al salir, ves que alguien ha dibujado en la esquina de la pizarra un Lucario de tiza con los brazos cruzados. Con mucho detalle. Con más detalle que la lección.', cond: LUC },
		],
		b03_escuela_despues: [
			{ text: 'Los niños repasan en voz alta, todos a la vez: «¡Fuego, Lucha y Tierra! ¡Fuego, Lucha y Tierra!». El del primer pupitre añade bajito: «…y camiones no».' },
		],

		// =================== TORRE BELLSPROUT ===================
		b03_torre_entrada: [
			{ set: { 'flag.b03_torre_entrada': true } },
			{ text: 'Al entrar, el suelo se mueve. Un poco. Luego otro poco, hacia el otro lado. El pilar central, gordísimo, se balancea sobre su base como un péndulo dormido, y toda la torre cruje al compás.' },
			{ say: 'rotom', text: '¡Bzzt! Inclinación: dos grados. Tres. Dos. Uno. Tres otra vez. ¡Esto no es un edificio, es un columpio!' },
			{ text: 'Y en mitad del primer piso, con un trípode, un aro de luz y un micrófono de corbata enganchado a la chaqueta verde y amarilla, alguien habla muy alto a una cámara.' },
		],
		b03_tobias_1: [
			{ set: { 'flag.b03_tobias_1': true } },
			{ if: 'done.b01_t_tobias || flag.b01_enc_tobias_1', then: [
				{ say: 'tobias', text: '¡Patrocinadores, bienvenidos al episodio cincuenta y uno! ¡Temporada dos! ¡La mazmorra de esta temporada: la Torre Bellsprout, la torre que se mueve! Y tenemos… ¡INVITAD{O|A|E} SORPRESA!' },
				{ say: 'tobias', text: '¡{jugador}! ¡{jugador} de la Cueva Brillante! ¡Audiencia, se lo dije! ¡Les dije que volvería! —Mira el móvil—. Tenemos catorce personas en directo. ¡Récord! Una es mi madre. Otra también, desde el móvil de mi tía.' },
			], else: [
				{ say: 'tobias', text: '¡Patrocinadores, bienvenidos al episodio cincuenta y uno! ¡La mazmorra de esta temporada: la Torre Bellsprout! Soy Tobías, y ella es Duquesa, la verdadera estrella… ¡Un momento! ¡{Un|Una|Une} aventurer{o|a|e} salvaje aparece!' },
				{ say: 'tobias', text: 'Tobías Quiroga, encantado. Te he visto en el boletín de la Gira, creo. O a alguien con un Lucario. Todos los de la Gira tienen Lucario últimamente. Bueno, tú. Solo tú.' },
			] },
			{ text: 'A sus pies, sobre un cojín de terciopelo morado, un **Persian** enorme con un collar de pedrería se lame una pata. Te mira. Mira la torre. Mira a los sabios. Vuelve a lamerse la pata, como si todo lo que existe fuera un error de producción.' },
			{ text: 'Duquesa se fija en {riolu}. Lo mira de arriba abajo, muy despacio. Luego bosteza, enseñando todos los colmillos. Es lo más parecido a un saludo que vas a recibir.', cond: LUC },
			{ say: 'tobias', text: 'Temporada dos, novedades: ¡ahora tenemos patrocinadores DE VERDAD! Bueno, uno. «Pociones Patito, la poción que cura con cariño». Me pagan en pociones. Y me mandan regalos para Duquesa. Mira, mira, acaba de llegar uno.' },
			{ text: 'Abre una caja de cartón. Dentro hay un cojín. Un cojín con la cara de Tobías estampada, sonriendo, con el pulgar arriba. Debajo, en letras de colores: «¡DUQUESA, DUERME CON TU HUMANO FAVORITO!».' },
			{ text: 'Tobías lo pone junto a Duquesa, ilusionadísimo. Duquesa lo mira. Lo huele. Le da un zarpazo que le arranca media sonrisa a la cara estampada. Luego se tumba encima de su cojín morado, el de siempre, dándole la espalda.' },
			{ say: 'tobias', text: '…Le encanta. Es su forma de decir que le encanta. ¡Patrocinadores, gracias por el cojín! —Bajito, a ti—. ¿Lo quieres? Por favor. Si se lo devuelvo a Pociones Patito me quitan el patrocinio.' },
			{ choice: [
				{ text: 'Quedarte el cojín.', then: [
					{ give: 'cojintobias' },
					{ say: 'tobias', text: '¡Gracias! ¡Eres {el|la|le} mejor invitad{o|a|e} de la historia del programa! Y {el|la|le} únic{o|a|e} que vuelve. Eso también cuenta.' },
				] },
				{ text: '«Ni loco.»', then: [
					{ say: 'tobias', text: 'Lo entiendo. Yo tampoco dormiría con mi cara. Bueno, sí. Pero porque estoy acostumbrado.' },
					{ text: 'Al final lo esconde debajo del trípode. Duquesa lo vigila de reojo, por si se mueve.' },
				] },
			] },
			{ say: 'tobias', text: 'Bueno, que no te entretengo. La mazmorra: tres sabios, tres pisos, y arriba del todo, el jefe final. ¡El Sabio Li! No le he podido entrevistar. Me ha mirado una vez y se me ha olvidado lo que iba a preguntar. Durante una hora.' },
			{ say: 'tobias', text: 'Cuando lo venzas, vuelve. El episodio necesita un final. Y un final necesita un… ¡GIRO DE GUION! Ya verás. O no. Todavía no lo he escrito.' },
			{ quest: 'b03_t_tobias', stage: 'torre' },
			{ intel: { npc: 'tobias', text: 'Temporada dos de su «programa» en la Torre Bellsprout de Malva. Tiene un patrocinador de verdad, Pociones Patito, que le paga en pociones y le manda regalos ridículos para Duquesa. Duquesa los destroza.' } },
		],
		b03_tobias_espera: [
			{ say: 'tobias', text: '¡Seguimos en directo! Ahora mismo estamos en el momento «el héroe sube la torre». Es un momento de tensión. Por favor, sube la torre. La tensión no aguanta mucho.' },
			{ text: 'Duquesa duerme. El cojín con la cara de Tobías, si sigue ahí, tiene ahora un ojo menos.', cond: '!has("cojintobias")' },
			{ text: 'Duquesa duerme hecha un ovillo. De vez en cuando abre un ojo y te mira. Luego lo cierra, decepcionada de que sigas aquí.', cond: 'has("cojintobias")' },
		],
		b03_tobias_final: [
			{ set: { 'flag.b03_tobias_final': true } },
			{ say: 'tobias', text: '¡HA VENCIDO AL SABIO LI! ¡Audiencia, lo hemos visto todos! ¡Bueno, yo no, que estaba en el primer piso! ¡Pero he oído los golpes! ¡Y un «oh» muy profundo!' },
			{ say: 'tobias', text: 'Y ahora… ¡el giro de guion de la temporada! —Se gira hacia la cámara, muy serio—. Resulta que el VERDADERO jefe final… ¡SOY YO! Otra vez. Sí. Es una tradición. Las tradiciones son importantes.' },
			{ text: 'Duquesa se levanta de su cojín. Se estira. Despacio. Muy despacio. Las uñas fuera. Por primera vez desde que la conoces, parece interesada en algo.' },
			{ choice: [
				{ text: '«Venga, jefe de piso. Al lío.»', cond: '!beat("tobias_2")', then: [
					{ heal: true },
					{ text: 'Tobías le da a tu equipo un puñado de Pociones Patito antes de empezar. «Para que sea justo. Y porque me sobran.» Tu equipo se recupera del todo.' },
					{ battle: 'tobias_2', lose: 'continue',
						onWin: [
							{ say: 'tobias', text: '¡Y el jefe de piso cae! ¡Otra vez! ¡Dos temporadas seguidas! ¡Eso ya es un récord!' },
							{ text: 'Saca una caja de cartón con una pegatina dibujada a mano: «BOTÍN DE PLATA». Debajo, más pequeño: «(el de bronce era el anterior)».' },
							{ give: 'hyperpotion', n: 2 }, { give: 'revive' },
							{ text: 'Duquesa se acerca a {riolu}, lo mira muy de cerca… y le da un golpecito con la cola. Más suave que la última vez. Luego vuelve con Tobías sin mirar atrás.', cond: '(' + LUC + ') && (done.b01_t_tobias || flag.b01_enc_tobias_1)' },
							{ say: 'tobias', text: '¡Le caes mejor! ¡El golpe ha sido un treinta por ciento más flojo! Tengo los datos. Bueno, tengo la sensación. Es lo mismo.', cond: '(' + LUC + ') && (done.b01_t_tobias || flag.b01_enc_tobias_1)' },
							{ text: 'Duquesa se acerca a {riolu}, lo mira muy de cerca… y le da un golpecito con la cola. Luego vuelve con Tobías sin mirar atrás. Tobías jura que eso es un saludo.', cond: '(' + LUC + ') && !(done.b01_t_tobias || flag.b01_enc_tobias_1)' },
						],
						onLose: [{ say: 'tobias', text: '¡GANAMOS! ¡Duquesa, mira! …Duquesa ya está dormida. Bueno. Se lo cuento con gráficos. —A ti, en voz baja—: Vuelve cuando quieras. El jefe de piso no se mueve de aquí.' }] },
				] },
				{ text: '«Hoy no, Tobías. Me espera alguien.»', then: [
					{ say: 'tobias', text: '¡Suspense! ¡Cliffhanger! ¡Me encanta! ¡El jefe de piso esperará aquí! Literalmente. La torre se mueve tanto que no encuentro la salida.' },
				] },
			] },
			{ say: 'tobias', text: 'Oye. Una cosa, fuera de cámara. —Tapa el micrófono con la mano—. ¿Vas a las Ruinas Alfa? Quería grabar el próximo episodio allí. «La mazmorra de las letras.» Pero no me dejan pasar. Ni con el carné de prensa que me hice yo.' },
			{ say: 'tobias', text: 'El de la valla me ha dicho que «el patrimonio no se graba». Y luego me ha pedido que le hiciera una foto con Duquesa. Duquesa le ha arañado. Patrimonio arañado.' },
			{ quest: 'b03_t_tobias', done: true },
			{ diary: 'Hoy mi entrenador{|a|e} y yo subimos a una torre que se mueve. ¡De verdad! Se balancea como una cuna. Yo me mareé un poquito, aunque no tengo estómago.\n\nArriba vivía un señor muy sabio que hablaba del viento y de los juncos. {riolu} le escuchó muy atento. Creo que le entendió mejor que yo.\n\nY abajo estaba Tobías, el del programa, con su Persian Duquesa. ¡Ahora tiene patrocinador! Le mandaron un cojín con su cara. A Duquesa no le gustó. A mí sí. Me pareció muy realista.', cond: 'flag.b01_diario' },
		],
		b03_tobias_despues: [
			{ if: '!beat("tobias_2")', then: [
				{ say: 'tobias', text: '¡Ha vuelto! ¡Audiencia, el cliffhanger se resuelve! ¿Hoy sí? ¿Hoy hay jefe de piso?' },
				{ choice: [
					{ text: '«Hoy sí. Al lío.»', then: [
						{ heal: 'Tobías reparte Pociones Patito entre tu equipo. «Para que sea justo. Y porque me siguen sobrando.»' },
						{ battle: 'tobias_2', lose: 'continue',
							onWin: [
								{ say: 'tobias', text: '¡Y el jefe de piso cae! ¡Con retraso, pero cae! ¡El retraso también es suspense!' },
								{ text: 'Saca una caja de cartón con una pegatina dibujada a mano: «BOTÍN DE PLATA». Debajo, más pequeño: «(el de bronce era el anterior)».' },
								{ give: 'hyperpotion', n: 2 }, { give: 'revive' },
							],
							onLose: [{ say: 'tobias', text: '¡GANAMOS! Vuelve cuando quieras. El jefe de piso no se mueve de aquí. Literalmente: sigo sin encontrar la salida.' }] },
					] },
					{ text: '«Todavía no.»', then: [{ say: 'tobias', text: 'Más suspense. Me encanta. Bueno, a la audiencia no tanto. Bueno, a mi madre sí.' }] },
				] },
				{ end: true },
			] },
			{ say: 'tobias', text: '¡Episodio cincuenta y uno: completado! Y emitido. Y visto por… —mira el móvil— …diecinueve personas. ¡Diecinueve! Pociones Patito me ha mandado un mensaje: «Bien». Solo «Bien». ¡Pero me lo han mandado!' },
			{ text: 'Duquesa duerme en lo alto de la mochila de Tobías, que ya no se atreve a moverse. La torre se balancea. Ella, no. Ella es la única cosa quieta en todo el edificio.' },
		],
		b03_pilar: [
			{ text: 'El pilar es un tronco enorme, oscuro y liso como una piedra de río. Se balancea despacio sobre una base de piedra, sin tocar los suelos de los pisos: pasa por agujeros redondos, con un palmo de holgura.' },
			{ text: 'Si pones la mano encima, lo notas: no se mueve con el viento. Se mueve **antes** que el viento. Como si lo escuchara venir.' },
			{ text: '{riolu} pone la palma en el tronco, al lado de la tuya. Cierra los ojos. Durante un momento, el balanceo de la torre y la respiración de {riolu} van exactamente al mismo ritmo.', cond: LUC },
		],
		b03_li_espera: [
			{ say: 'sabio', as: 'Sabio de la escalera', text: 'El maestro Li está arriba. Para subir, primero tienes que haber bajado. Es decir: vence a los tres sabios de los pisos de abajo. Es decir: no hagas trampa. Es decir: sí, te estoy vigilando.' },
		],
		b03_li: [
			{ text: 'El tercer piso es una sala pequeña, abierta por los cuatro lados al viento. El pilar asoma por el centro del suelo y se pierde en el techo. Junto a él, sentado en una esterilla, hay un anciano diminuto con una barba blanca que le llega a las rodillas.' },
			{ say: 'li', text: 'Has subido la torre. —No abre los ojos—. La señora del sombrero me dijo que vendrías. Me dijo muchas cosas. Habla mucho, la señora del sombrero. Pero dice cosas verdaderas.' },
			{ say: 'li', text: 'Quiere el calco de mis maestros. Mis maestros lo hicieron hace cien años, con papel de arroz y carboncillo, de rodillas delante de la cámara grande de las Ruinas. Tardaron un invierno entero.' },
			{ say: 'li', text: 'No se presta a quien sube deprisa. Se presta a quien sabe moverse con el viento. —Abre los ojos. Son muy negros, muy tranquilos—. Enséñamelo.' },
			{ battle: 'sabio_li', onWin: [
				{ say: 'li', text: '…Ah.' },
				{ say: 'li', text: 'Esta torre se mueve para no caerse. Tu compañero no se mueve, y tampoco se cae. Hacía mucho tiempo que no veía eso. Desde que yo era muy joven. Desde que vi un Lucario, una vez, en una montaña de Sinnoh.', cond: LUC },
				{ say: 'li', text: 'Esta torre se mueve para no caerse. Tu equipo se mueve con ella. Bien. Eso es lo primero que hay que aprender. Lo segundo, nadie lo sabe.', cond: '!(' + LUC + ')' },
				{ text: 'Se levanta, despacio, apoyándose en el pilar. Detrás de la esterilla hay un arcón de madera lacada. Lo abre. Dentro, un rollo de papel de arroz atado con un cordón rojo.' },
				{ cutscene: { bg: { type: 'tower', wall: '#4a3826', floor: '#6a5238' }, start: 'dark', frames: [
					{ fx: 'light', text: 'El Sabio Li desata el cordón rojo. El papel de arroz cruje como hojas secas.' },
					{ item: 'calcoli', text: 'Es un **calco**: el papel apretado contra una piedra tallada y frotado con carboncillo. Filas de letras Unown, en negro sobre blanco, como fantasmas de las letras de verdad.' },
					{ fx: 'glow', text: 'En el centro, una forma grande que no es una letra: una flor de muchos pétalos. Alrededor de la flor, un círculo de letras. Y en el círculo, un hueco.' },
					{ text: 'En una esquina, con pincel y tinta, otra mano escribió hace cien años: «Lo que falta no se ha borrado. Se ha callado».' },
				] } },
				{ give: 'calcoli' },
				{ say: 'li', text: 'Llévaselo a la señora del sombrero. Y dile otra cosa, de mi parte. —Se vuelve a sentar—. Hay puertas que se cerraron porque lo de dentro era peligroso. Y hay puertas que se cerraron porque lo de fuera lo era.' },
				{ say: 'li', text: 'Que piense cuál es esta. Antes de abrirla.' },
				{ give: 'soothebell' },
				{ say: 'li', text: 'Y eso es para tu compañero. Un cascabel. No es para que lo oigas tú. Es para que se oiga él.' },
				{ quest: 'b03_m1', stage: 'ruinas' },
				{ intel: { npc: 'li', text: 'Anciano de la Torre Bellsprout. Te dio el calco de sus maestros: la puerta de la cámara grande de las Ruinas Alfa, copiada hace cien años. «Hay puertas que se cerraron porque lo de fuera era peligroso.»' } },
			] },
		],
		b03_li_despues: [
			{ say: 'li', text: 'La torre sigue en pie. Tú sigues en pie. El viento sigue pasando. —No abre los ojos—. Todo en orden.' },
			{ if: 'flag.b03_ruinas_hecho', then: [
				{ say: 'li', text: 'Han abierto la puerta. Lo noto en el pilar: se mueve un poco más deprisa desde ayer. —Pausa larga—. No es un reproche. Es un dato. La señora del sombrero te explicará la diferencia.' },
			] },
		],

		// =================== RUINAS ALFA ===================
		b03_ruinas_llegada: [
			{ set: { 'flag.b03_irene_ruinas': true } },
			{ text: 'El camino de tierra baja entre colinas y, de pronto, se abre el valle: hierba, piedras grises medio enterradas, y en el centro un círculo de vallas metálicas, focos y carpas blancas.' },
			{ text: 'Junto a la valla, sentada en una piedra con una libreta en las rodillas, hay una mujer con un abrigo azul marino lleno de bolsillos, dos trenzas larguísimas y un sombrero de ala ancha que le hace sombra hasta los codos.' },
			{ text: 'Al oírte, levanta la cabeza. Se pone de pie de un salto. De pie es… igual de alta que sentada en la piedra. Más o menos.' },
			{ say: 'irene', text: '¡{jugador}! Has venido. Has venido de verdad. —Te tiende la mano, la retira, se la limpia en el abrigo, te la vuelve a tender—. Perdona. Llevo seis horas copiando una pared. Tengo carboncillo hasta en los dientes.' },
			{ if: LUC, then: [
				{ text: 'Mira a {riolu}. Se le cambia la cara: es la cara de alguien que ve un manuscrito original.' },
				{ say: 'irene', text: 'Y tú. Hola. —Le habla a {riolu} con mucho respeto, como a un colega—. La última vez eras más pequeño. Las piedras de Crómlech te tenían muchas ganas. Las de aquí también, ya verás.' },
			] },
			{ choice: [
				{ text: '«Te imaginaba más alta, por holomisor.»', then: [
					{ af: { irene: -2 } },
					{ say: 'irene', text: '…' },
					{ say: 'irene', text: 'La cámara del holomisor me encuadra desde abajo. Es un problema técnico. De Rotom. —Se cala el sombrero—. Y el sombrero tiene veinte centímetros de copa, que se cuentan. Se cuentan a efectos legales.' },
					{ say: 'rotom', text: '¡Bzzt! Mi cámara encuadra perfectamente. —Pausa—. Bueno, me callo.' },
				] },
				{ text: '«¿Qué has encontrado?»', then: [
					{ af: { irene: 2 } },
					{ say: 'irene', text: 'Todo. Nada. Una cosa enorme. —Te enseña la libreta: páginas y páginas de letras Unown copiadas a mano—. Te lo explico enseñándotelo. Es la única forma decente de explicar algo.' },
				] },
				{ text: '«¿Has dormido algo?»', then: [
					{ af: { irene: 1 } },
					{ say: 'irene', text: 'En el avión. Tres horas. Encima del diccionario, otra vez. —Se toca la mejilla—. Ahora tengo «dar» marcado. Del revés. Es un progreso.' },
				] },
			] },
			{ say: 'irene', text: 'Mira allí. —Señala la cámara más grande, en el centro de las vallas—. La cámara sellada. Ni puerta, ni rendija. Solo una pared con una inscripción a medio borrar. La universidad lleva cuarenta años intentando leerla.' },
			{ say: 'irene', text: 'Y Lemnis lleva un mes poniendo vallas a su alrededor. «Por patrimonio.» Pasado mañana traen la excavadora. —Aprieta la libreta—. Antes de eso, quiero que tu compañero la lea. Y quiero leerla yo. Delante. En voz alta. Para que conste.' },
			{ if: 'has("calcoli")', then: [
				{ say: 'irene', text: '¿Traes el calco de Li? —Se le iluminan los ojos al ver el rollo—. ¡Lo traes! Te lo ha dado. A mí me tuvo una tarde entera hablando de juncos y no me lo dio. Dijo que yo «subía demasiado deprisa». Subí andando. Andando deprisa, bueno.' },
			], else: [
				{ say: 'irene', text: '¿Pasaste por la Torre Bellsprout? ¿No? Necesitamos el calco de Li. Sin él, a la inscripción le falta la mitad. Li no me lo quiso dar a mí. Dijo que yo «subía demasiado deprisa». Sube tú. Despacio. Con cara de junco.' },
			] },
			{ say: 'irene', text: 'Mientras tanto, deja que te enseñe a leer. Solo una palabra. Para empezar. —Duda—. Si quieres. No tienes por qué. Pero deberías. Es decir: quiero enseñarte. Hablamos cuando quieras.' },
		],
		b03_irene_leccion: [
			{ set: { 'flag.b03_irene_leccion': true } },
			{ text: 'Irene te lleva a una cámara pequeña, fuera de las vallas, en la ladera. Dentro, una sola pared con letras talladas. Las tapa con la mano, todas menos tres.' },
			{ say: 'irene', text: 'Veintiocho letras: las veintiséis que conoces y dos signos, uno de pregunta y uno de exclamación. Los Unown las copiaron. O las letras copiaron a los Unown. Hay un debate. Yo gano el debate. Eso no viene al caso.' },
			{ say: 'irene', text: 'La primera. Un palo vertical y un ojo abajo, a la derecha, como un pie. ¿Qué letra es?' },
			{ choice: [
				{ text: '«Una L.»', then: [{ af: { irene: 1 } }, { set: { 'vars.b03_unown_ok': '+1' } }, { say: 'irene', text: 'Una L. Exacto. El ojo hace de pie. Bien. Muy bien.' }] },
				{ text: '«Una J.»', then: [{ say: 'irene', text: 'Casi. La J mira al otro lado. Es la L. No pasa nada. A mí me costó un año. Bueno, una semana. Tenía nueve años.' }] },
				{ text: 'Pedirle que te lo explique otra vez, más despacio.', then: [{ af: { irene: 2 } }, { say: 'irene', text: '…Claro. —Lo explica otra vez. Más despacio. Con un dibujo en la libreta. Parece sorprendida de que alguien se lo pida—. El palo es el cuerpo. El ojo, abajo, a la derecha, es el pie. Una L. ¿Ves?' }] },
			] },
			{ say: 'irene', text: 'La segunda. Dos brazos que suben, y el ojo abajo, en el hueco, como si estuviera sentado en una taza.' },
			{ choice: [
				{ text: '«Una U.»', then: [{ af: { irene: 1 } }, { set: { 'vars.b03_unown_ok': '+1' } }, { say: 'irene', text: 'Una U. Sí. —Sonríe sin querer—. Tienes buen ojo. No, perdón, tienes buena vista. El ojo lo tiene el Unown.' }] },
				{ text: '«Una V.»', then: [{ say: 'irene', text: 'La V tiene el ojo arriba, entre los brazos. Esta lo tiene en el fondo. Es la U. Fíjate en el fondo. Siempre en el fondo.' }] },
			] },
			{ say: 'irene', text: 'La última. Esta es mala. Una línea arriba, una abajo y una diagonal que las une. El ojo, en el centro de la diagonal.' },
			{ choice: [
				{ text: '«Una Z.»', then: [{ af: { irene: 1 } }, { set: { 'vars.b03_unown_ok': '+1' } }, { say: 'irene', text: '¡Una Z! L, U, Z.' }] },
				{ text: '«Una N tumbada.»', then: [{ af: { irene: 1 } }, { say: 'irene', text: '…Técnicamente, una N tumbada es una Z. —Te mira con algo que podría ser respeto—. Eso es exactamente lo que dice un artículo de 1974 que nadie lee. Lo leí yo. Es la Z.' }] },
			] },
			{ say: 'irene', text: '«LUZ». Es lo que pone en casi todas las cámaras pequeñas. Es lo primero que escribían. Pedían luz para leer lo demás. —Pasa los dedos por encima, sin tocar la piedra—. Y es lo primero que se aprende. Ya lo sabes leer. Ya nadie te lo puede quitar.' },
			{ if: 'vars.b03_unown_ok >= 3', then: [
				{ say: 'irene', text: 'Tres de tres. Has… Has estudiado lo que te he enseñado. Mientras te lo enseñaba. Eso no lo hace nadie. Normalmente asienten y miran el móvil. —Se pone roja hasta las orejas—. Da igual. Sigue.' },
				{ af: { irene: 3 } },
			] },
			{ text: 'En la pared, al lado de LUZ, la piedra tiene un desconchón reciente. Blanco. Como si alguien hubiera golpeado con algo metálico.' },
			{ choice: [
				{ text: 'Pasar la mano por el desconchón.', then: [
					{ text: 'Está rugoso. Reciente. Hay polvo de piedra en el suelo, todavía sin pisar.' },
					{ say: 'irene', text: 'Una sonda de Lemnis. Para «medir la densidad del muro». Le han hecho un agujero a una palabra de tres mil años para medir cuánto pesa. —Se le quiebra un poco la voz—. Perdón. Me pongo… Ya está.' },
				] },
				{ text: 'No tocarlo y apartar a {riolu} para que no lo pise.', cond: LUC, then: [
					{ af: { irene: 3 } },
					{ text: 'Le pones la mano a {riolu} en el hombro. Se aparta contigo, sin protestar. El polvo de piedra se queda donde está.' },
					{ say: 'irene', text: '…Gracias. —Lo dice muy bajito—. Casi nadie se aparta. Pisan, tocan, se hacen fotos. Esa es la diferencia entre visitar algo y respetarlo. Has elegido sin que nadie te lo pida.' },
				] },
				{ text: '«¿Quién ha hecho esto?»', then: [
					{ say: 'irene', text: 'Una sonda de Lemnis. Para «medir». —Aprieta los labios—. Lo voy a poner en mi informe. En negrita. Con fotos. En tres idiomas.' },
				] },
			] },
			{ say: 'irene', text: 'Ahora, lo importante. Para la cámara grande necesito tres cosas: el calco de Li, a tu compañero… y saber qué está haciendo Lemnis aquí de verdad. Porque «patrimonio» no se trae en camiones a las tres de la mañana.' },
			{ if: '!has("calcoli")', then: [{ say: 'irene', text: 'El calco lo tiene Li. En la Torre Bellsprout, en Malva. Despacio, con cara de junco.' }] },
			{ if: '!flag.b03_nodo02', then: [{ say: 'irene', text: 'En la carpa de material guardan las cajas que llegan de noche. Yo no puedo acercarme: ya me conocen. A ti, todavía no. Mira, solo mira. No toques nada. Bueno, toca si hace falta.' }] },
			{ if: CAMARA_OK, then: [{ say: 'irene', text: 'Lo tenemos todo. Cuando quieras, vamos a la cámara.' }, { quest: 'b03_m1', stage: 'camara' }] },
		],
		b03_irene_generico: [
			{ if: CAMARA_OK, then: [
				{ say: 'irene', text: 'Calco, compañero, y ya sabemos qué traen en las cajas. —Respira hondo—. Lo tenemos todo. Vamos a la cámara antes de que llegue la excavadora.' },
				{ quest: 'b03_m1', stage: 'camara' },
			], else: [
				{ text: 'Irene copia letras en su libreta, sentada en una piedra. Escribe deprisa, con la lengua entre los dientes.' },
				{ say: 'irene', text: '¿El calco? En la Torre Bellsprout, con Li.', cond: '!has("calcoli")' },
				{ say: 'irene', text: '¿Has mirado en la carpa de material? Las cajas. Lo que traen de noche.', cond: '!flag.b03_nodo02' },
				{ say: 'irene', text: 'Tu compañero tiene que estar contigo. La pared no se va a leer sola. Bueno, a lo mejor sí, pero no delante de mí.', cond: '!(' + LUC + ')' },
			] },
		],
		b03_camara_falta: [
			{ text: 'La pared de la cámara grande: piedra lisa, sin puerta, con una inscripción en círculo alrededor de una flor tallada. Media inscripción está borrada por la lluvia. Hay una valla de Lemnis a dos metros y un foco apuntando.' },
			{ text: 'Les falta el calco del Sabio Li, en la Torre Bellsprout de Malva.', cond: '!has("calcoli")' },
			{ text: 'Irene quiere saber antes qué guarda Lemnis en la carpa de material.', cond: '!flag.b03_nodo02' },
			{ text: 'Sin {riolu} en el equipo, la pared es solo una pared.', cond: '!(' + LUC + ')' },
		],
		b03_agente_ruinas: [
			{ set: { 'flag.b03_agente_ruinas': true } },
			{ text: 'Un agente de Lemnis con chaleco azul y una tableta te ve llegar y sonríe. Es una sonrisa sincera. Eso es lo peor.' },
			{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: '¡Buenas! Bienvenid{o|a|e} al Proyecto de Conservación del Patrimonio. Por desgracia, de momento no se puede pasar de la valla. Es por la seguridad del patrimonio. Y por la suya. Sobre todo la del patrimonio.' },
			{ if: 'flag.b01_delatar', then: [
				{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: '¿Usted no es…? —Mira la tableta—. Ah. Crómlech. Las declaraciones. —Carraspea—. Quiero que sepa que aquí no hay nada que declarar. Somos muy transparentes. Por eso las vallas son de rejilla.' },
			] },
			{ if: 'flag.b01_handsome', then: [
				{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: 'Nos consta que tiene contactos en la Policía Internacional. ¡Qué bien! Si quieren venir, les enseñamos los permisos. Tenemos todos los permisos. Tenemos permisos de sobra. Nos sobran permisos.' },
			] },
			{ if: 'flag.b01_trato_sera', then: [
				{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: 'Ah, usted es de la lista de la señorita Serafina. —Se pone un poco más recto—. Lo siento, aun así no puede pasar. Pero se lo digo con más respeto.' },
			] },
			{ if: CROMLECH_NINGUNO, then: [
				{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: 'Lemnis lleva años protegiendo yacimientos. En Kalos tenemos uno precioso, en Crómlech. Algún día se podrá visitar. Cuando terminemos de protegerlo.' },
			] },
			{ text: 'Detrás de la valla, unos técnicos con mono azul descargan cajas de un camión. Las cajas no tienen pinta de llevar brochas. Tienen pinta de llevar maquinaria. Uno de los técnicos tiene cara de no haber visto una brocha en su vida.' },
			{ if: 'flag.b02_frag_sera', then: [
				{ text: 'Dos técnicos pasan junto a la valla, hablando sin bajar la voz.' },
				{ say: 'agente_lemnis', as: 'Técnico', text: '…ha llegado la pieza nueva. La de Iris. Con eso vamos dos semanas adelantados. La jefa quiere abrir pasado mañana, con o sin la universidad.' },
				{ text: 'La de Iris. La que devolviste.' },
			] },
			{ if: 'flag.b02_frag_handsome', then: [
				{ text: 'Un técnico se queja a otro, apoyado en un generador.' },
				{ say: 'agente_lemnis', as: 'Técnico', text: '…sin la pieza de Kalos vamos tarde. Se perdió en la policía, dicen. «Se perdió». Ya. La jefa dice que no nos preocupemos, que «la policía también es patrimonio». No sé qué significa eso. No me gusta lo que significa.' },
			] },
			{ if: 'flag.b02_frag_melia', then: [
				{ text: 'Un técnico revisa un esquema, frustrado.' },
				{ say: 'agente_lemnis', as: 'Técnico', text: '…sin la pieza tenemos que hacerlo a mano. Tres semanas más, mínimo. Alguien la frió. Literalmente. Con un Houndoom, dicen. ¿Quién le prende fuego a una pieza de ese precio?' },
			] },
			{ if: FRAG_NINGUNO, then: [
				{ say: 'agente_lemnis', as: 'Técnico', text: '…la jefa quiere abrir pasado mañana. Que la universidad llore otro día.' },
			] },
			{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: '¿Quiere un folleto? Tienen dibujos. El Unown de la portada lo diseñó un niño de Malva. Bueno, lo rediseñamos un poco. Para que sonriera.' },
			{ text: 'El Unown del folleto sonríe. Los Unown no tienen boca.' },
		],
		b03_agente_generico: [
			{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: 'Sigue sin poderse pasar, lo siento muchísimo. —Te sonríe—. ¿Otro folleto? Me sobran. Nadie los agarra. No entiendo por qué. El Unown sonríe.', cond: '!flag.b03_ruinas_hecho' },
			{ say: 'agente_lemnis', as: 'Agente de Lemnis', text: 'Gracias otra vez por abrirnos la puerta. —Lo dice de verdad. Eso es lo peor—. Le hemos puesto un foco. Ha quedado preciosa.', cond: 'flag.b03_ruinas_hecho' },
		],
		b03_caja_n02: [
			{ set: { 'flag.b03_nodo02': true } },
			{ text: 'La carpa de material está en el borde de las vallas, con la lona trasera mal atada. Esperas a que el agente mire su tableta y te cuelas por el hueco.' },
			{ text: 'Dentro huele a plástico nuevo y a aceite. Cajas de madera apiladas hasta el techo. Algunas ponen «FOCOS». Otras, «CABLEADO». Al fondo, separada de las demás, una caja enorme, larga como un coche, cerrada con precintos azules.' },
			{ text: '{riolu} se para delante de ella. El pelaje del cuello se le eriza. No gruñe. Se queda muy quieto, como cuando escucha algo que tú no oyes.', cond: LUC },
			{ text: 'En un lateral, una etiqueta impresa, con la lemniscata en una esquina.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Leo yo, leo yo! Me encanta leer etiquetas. «Material de conservación. Frágil. No apilar. Destino…» ¡Destino!' },
			{ say: 'rotom', text: '«**N-02 · Ruinas Alfa**».' },
			{ say: 'rotom', text: '¡Ah! ¡N-02 es esto! ¡Es un sitio! ¡Son las Ruinas Alfa! ¡Misterio resuelto! —La pantalla le hace un confeti—. Qué alivio. Llevaba días con eso en la memoria. Era un nombre de sitio. Un sitio con piedras. Qué aburrido. ¡Qué bien!' },
			{ text: 'Rotom está contento. Tú no.' },
			{ text: 'Porque te acuerdas de dónde has visto antes esas cuatro letras.' },
			{ text: 'En las jaulas vacías de Luminalia: «Destino asignado: N-02». Fila tras fila.', cond: 'flag.b02_noa_hecha' },
			{ text: 'En la carta de Noa: «He buscado adónde van los que tienen esa etiqueta. Solo sale un código: N-02».', cond: 'has("cartanoa")' },
			{ text: 'En el albarán de la Fundación Raíces, bajo el código de barras de los doce Slowpoke dormidos del pozo de Azalea: N-02.', cond: 'has("albaranraices")' },
			{ text: 'En la tarjeta de la Guardería de Trigal, escrita a mano detrás del logo de Lemnis: N-02.', cond: 'flag.b02_guarderia' },
			{ text: 'Grabado por dentro en el metal partido del fragmento, junto a una lemniscata: N-02.', cond: 'has("fragmentoroto")' },
			{ text: 'Y en la pantalla de la excavación de Crómlech, en Kalos, ponía «NODO 01 · KALOS». N de nodo. El uno, en Kalos. El dos, aquí.', cond: 'flag.b01_cromlech_hecha' },
			{ text: 'Los desplazados que nadie devuelve. Los Pokémon «sin destino asignado». Las furgonetas de madrugada a una Puerta apagada. Todos venían aquí. A este valle. A esta caja con forma de máquina, al lado de una cámara que nadie ha abierto en tres mil años.' },
			{ text: 'Y Noa lo dijo: una Puerta solo lleva a otra Puerta.', cond: 'flag.b02_noa_trigal || has("cartanoa")' },
			{ text: '{riolu} retrocede un paso. Luego otro. Te tira de la manga, muy suave, hacia la salida. No quiere estar aquí.', cond: LUC },
			{ choice: [
				{ text: 'Hacerle una foto a la etiqueta con Rotom.', then: [
					{ say: 'rotom', text: '¡Clic! ¡Foto! «Etiqueta de caja en sitio aburrido». La guardo en la carpeta de cosas aburridas. Está casi vacía. Le hará compañía a una foto de un Wooper.' },
					{ set: { 'flag.b03_foto_n02': true } },
				] },
				{ text: 'Salir de ahí sin tocar nada.', then: [
					{ text: 'Sales por el hueco de la lona. Fuera, el aire huele a hierba. Respiras hondo. {riolu} también.', cond: LUC },
					{ text: 'Sales por el hueco de la lona. Fuera, el aire huele a hierba. Respiras hondo.', cond: '!(' + LUC + ')' },
				] },
			] },
			{ intel: { npc: 'noa', text: 'N-02 son las Ruinas Alfa. En la carpa de material de Lemnis hay una caja con forma de máquina, larga como un coche, con la etiqueta «N-02 · Ruinas Alfa». Los desplazados con «Destino: por asignar» venían aquí.' } },
			{ if: 'flag.b03_irene_leccion', then: [{ text: 'Vuelves con Irene. Cuando le cuentas lo de la caja, deja de escribir. Se queda mirando la carpa un rato largo, sin decir nada. Luego cierra la libreta.' }, { say: 'irene', text: 'Entonces no vienen a abrirla. Vienen a enchufarla.' }] },
		],
		b03_carpa_despues: [
			{ text: 'La lona trasera de la carpa está atada ahora con un nudo doble. Por dentro se oye zumbar algo, grave, constante. Te lo notas en los dientes.' },
			{ text: '{riolu} no quiere acercarse. Se queda a tres pasos, con las orejas hacia atrás.', cond: LUC },
		],
		b03_petra_ruinas: [
			{ set: { 'flag.b03_petra_ruinas': true } },
			{ text: 'En la ladera, fuera de las vallas, hay un agujero perfectamente cuadrado. Junto al borde, un Diggersby sujeta un cubo con las orejas. Y sentado en el borde, vigilando el agujero con muchísima seriedad, un **Pachirisu**.' },
			{ if: 'flag.b02_apagados', then: [
				{ text: 'Lo reconoces. Es el Pachirisu del Encinar. El que no se despertaba. Tiene las mejillas chispeando, un poco, como un mechero viejo. Y en los ojos, ese puntito de luz que no tenía.' },
				{ text: '{riolu} da un paso hacia él. El Pachirisu le mira, ladea la cabeza… y le salta encima del hombro como si lo conociera de toda la vida. Puede que lo conozca.', cond: LUC },
			] },
			{ say: 'petra', as: 'Voz en el agujero', text: '¡Chispas, no! ¡No le saltes encima a la gente! ¡Ni a los Lucario! ¡Sobre todo a los Lucario! —Asoma una cabeza llena de barro con unas gafas de protección en la frente—. ¡{jugador}!' },
			{ say: 'petra', text: 'Espera, que subo. —Intenta subir. Resbala. Pala le tiende una oreja sin mirarla. Sube agarrada a la oreja—. Gracias, Pala. Novecientas doce. Llevo la cuenta.' },
			{ if: 'flag.b02_apagados', then: [
				{ say: 'petra', text: 'Se despertó. ¡Se despertó! Una mañana, en el Encinar, cuando los relojes ya volvían a ir bien. Abrió los ojos, se comió mi bocadillo entero y desde entonces no se separa de mí. Le he puesto Chispas. Bueno, se lo ha puesto él. No responde a otra cosa.' },
				{ say: 'petra', text: 'Y adivina adónde quería venir. Tiraba hacia el este todo el rato. Hacia aquí. Como si algo le llamara. O como si quisiera ver de dónde venía el sueño.' },
			], else: [
				{ say: 'petra', text: 'Te presento a Chispas. Lo encontré dormido en el Encinar. Dormido, dormido, de no despertarse. Hasta que una mañana se despertó, se comió mi bocadillo y decidió que soy suya.' },
			] },
			{ if: '!done.b02_t_ambar && quest.b02_t_ambar', then: [{ quest: 'b02_t_ambar', done: true }] },
			{ quest: 'b03_t_ambar', stage: 'ruinas' },
			{ say: 'petra', text: 'Las capas de aquí son preciosas. Tres mil años en orden, como un pastel. —Te enseña la pared del agujero—. Menos aquí. Esta franja oscura, ¿la ves? Debajo de la cámara grande. Es igual que la del Encinar. Tierra de ninguna época.' },
			{ if: 'has("ambarsinregistro")', then: [
				{ text: 'En tu bolsillo, algo se calienta. Sacas el ámbar. El brillo azul de dentro late. Deprisa. Tic-tac-tic-tac. Y cada vez que lo acercas a la cámara grande, más deprisa.' },
				{ say: 'petra', text: '…Late. Hacia allí. —Mira la cámara. Mira el ámbar. Se queda callada mucho rato, que en Petra es muchísimo—. En el Encinar latía cerca de lo muy viejo. Aquí late cerca de lo muy viejo y de lo muy nuevo a la vez. De la cámara y de esa carpa.' },
				{ say: 'petra', text: 'No sé qué significa. Lo apunto. Lo apunto dos veces. —Lo apunta. No se le cae nada—. No lo pierdas. Por favor.' },
			], else: [
				{ say: 'petra', text: 'Ojalá tuviera mi ámbar aquí. Juraría que latiría como loco. Pero no sé dónde lo dejé. Bueno, sí lo sé: se lo di a alguien con buenos reflejos. No me acuerdo de a quién. Tú tienes buenos reflejos, ¿no?' },
			] },
			{ text: 'Chispas te mira desde el hombro de {riolu}. Luego mira la carpa de Lemnis. Se le apagan las mejillas un segundo, como si tuviera miedo, y se esconde detrás de la oreja de {riolu}.', cond: 'flag.b02_apagados && (' + LUC + ')' },
			{ say: 'petra', text: 'Te dejo una cosa. —Arranca una hoja de la libreta, se le cae la libreta al agujero, Pala la recoge—. Mis notas de Chispas. Por si un día encuentras a otro que no se despierta. Que alguien sepa lo que funcionó.' },
			{ give: 'notapetra' },
			{ quest: 'b03_t_ambar', stage: 'abierto' },
			{ intel: { npc: 'petra', text: 'En las Ruinas Alfa con Chispas, el Pachirisu del Encinar (ya despierto, no se separa de ella). Bajo la cámara grande hay una franja de tierra «de ninguna época», como en el Encinar. El ámbar late más deprisa cerca de la cámara y de la carpa de Lemnis.' } },
		],
		b03_petra_generico: [
			{ text: 'Petra mide una capa de tierra con una regla. Chispas, sentado en su cabeza, vigila la regla. Pala vigila a Petra. Es un sistema muy eficiente.' },
			{ say: 'petra', text: '¡{jugador}! Nada nuevo. Bueno, sí: me he caído dos veces. Una a propósito, para comprobar una capa. La otra no. Las dos han sido útiles.', cond: '!flag.b03_ruinas_hecho' },
			{ say: 'petra', text: 'Desde que abrieron la cámara, la franja oscura está… tibia. La tierra no se pone tibia. Chispas no quiere bajar de mi cabeza. Creo que nos vamos a ir unos días. A medir otra cosa. Algo que no lata.', cond: 'flag.b03_ruinas_hecho' },
		],
		b03_melia_ruinas: [
			{ set: { 'flag.b03_melia_ruinas': true } },
			{ text: 'Junto a una cámara pequeña, una turista hace fotos a la valla con un móvil caro. Gafas de sol enormes, un pañuelo de seda en la cabeza, un abrigo largo de un color que no es rojo pero lo intenta. Por debajo del pañuelo asoman unos mechones rosas cortados a cuchilla.' },
			{ text: 'Cuando te acercas, no se gira.' },
			{ say: 'melia', as: 'Turista', text: 'Sigue mirando la valla. No me mires a mí. Los turistas no se conocen entre ellos.' },
			{ text: 'Es **Melia**.' },
			{ say: 'melia', text: '¿Todavía tienes mi tarjeta? No la gastes en esto. Esto te lo regalo. Cuenta como intereses.' },
			{ say: 'melia', text: 'Los técnicos de esa carpa no son arqueólogos. Son los mismos de Crómlech. Los conozco: les pagaba yo el café cuando creía que trabajábamos para lo mismo.' },
			{ say: 'melia', text: 'Y las cajas que llegan de noche no las trae Lemnis. Las trae «la familia». Camiones sin logo, conductores con gorra. Rocket. Lemnis paga y los Rocket cargan. —Ríe, sin ganas—. Igual que pagaba a los míos. A todos nos pagan con el mismo dinero.' },
			{ choice: [
				{ text: '«¿Por qué me lo cuentas?»', then: [
					{ say: 'melia', text: 'Porque quemaste el fragmento por mí. Bueno, lo quemó mi Houndoom. Pero lo elegiste tú. —Se ajusta las gafas—. Y porque el que manda aquí no sabe que yo lo sé. Me gusta que alguien más lo sepa. Por si acaso.' },
				] },
				{ text: '«¿Y tú qué haces aquí?»', then: [
					{ say: 'melia', text: 'Turismo. —Pausa—. Busco a los que me mintieron. Uno a uno. Sin prisa. Tengo tiempo y tengo un Houndoom con muy mala memoria para los perdones.' },
				] },
			] },
			{ text: 'Le da a una última foto a la valla, guarda el móvil y se aleja por el camino de la Ruta 32 con paso de turista aburrida. No mira atrás.' },
			{ rep: { flare: 3 } },
			{ intel: { npc: 'melia', text: 'De incógnito en las Ruinas Alfa. Los técnicos de Lemnis son los mismos de Crómlech. Las cajas que llegan de noche las transporta el Team Rocket («la familia»), pagado por Lemnis.' } },
		],

		// =================== LA CÁMARA ===================
		b03_camara_abrir: [
			{ quest: 'b03_m1', stage: 'camara' },
			{ text: 'Esperan al cambio de turno. A las seis y diez, el agente de la valla se va a por un café a la carpa dos, y los focos se quedan mirando a la nada.' },
			{ say: 'irene', text: 'Ahora. Despacio. Con cara de junco.' },
			{ text: 'Se cuelan por debajo de la valla. Irene se engancha el sombrero. Lo desengancha. Se engancha una trenza. La desenganchas tú. Llegan.' },
			{ text: 'La pared de la cámara grande: una flor de muchos pétalos tallada en el centro y, alrededor, un círculo de letras Unown. Media inscripción está borrada por la lluvia de tres mil años.' },
			{ text: 'Irene desenrolla el calco de Li sobre la hierba y lo sujeta con piedras. Mira la pared. Mira el calco. Vuelve a mirar la pared.' },
			{ say: 'irene', text: 'Aquí está lo que falta. Lo que la lluvia se llevó, lo copiaron los maestros de Li antes. —Pasa el dedo por el papel, sin tocar el carboncillo—. Y aquí… aquí no hay nada. Ni en la piedra ni en el calco. Un hueco. Justo en el círculo.' },
			{ say: 'irene', text: '«Lo que falta no se ha borrado. Se ha callado». —Se queda muy quieta—. No es un hueco. Es una palabra que no se escribe. Que se dice. O que se… lee de otra forma.' },
			{ text: 'Irene te mira. Tú miras a {riolu}.', cond: 'inParty("riolu") || inParty("lucario")' },
			{ cutscene: { bg: { type: 'ruins', dark: true, crystals: '#7fb0e0' }, start: 'dark', frames: [
				{ mon: 'lucario', text: '{riolu} se acerca a la pared. Despacio. Sin que nadie se lo pida. Pone la palma abierta en el hueco del círculo, donde no hay nada escrito.' },
				{ fx: 'glow', text: 'El halo azul le sube por el brazo. Pero esta vez no se apaga: se extiende por la piedra, letra a letra, como agua que encuentra los surcos.' },
				{ fx: 'light', text: 'Las letras borradas se encienden. Las que copiaron los maestros de Li se encienden. Y en el hueco del círculo, donde no había nada, aparece una palabra hecha de luz azul. Tres letras.' },
				{ fx: 'shake', text: 'La flor tallada en el centro gira. Un cuarto de vuelta. Se oye un crujido grave, enorme, de piedra contra piedra, que te sube por los pies hasta el pecho.' },
				{ fx: 'flash', text: 'Y la pared, que no tenía puerta, se abre. Hacia dentro. Despacio. Sale un aire frío que huele a polvo y a algo que no sabes nombrar. A tiempo, quizá.' },
				{ fx: 'dark', text: '{riolu} baja la mano. Tiembla un poco. Te mira. Luego mira hacia dentro.' },
			] } },
			{ say: 'irene', text: '…' },
			{ say: 'irene', text: 'Se ha abierto. Ha leído la palabra que faltaba y se ha abierto. —Le tiembla la voz—. Tres mil años. Cuarenta años de la universidad. Y tu compañero ha tardado… —mira el reloj— …once segundos.' },
			{ say: 'irene', text: '¿Qué palabra era? ¿Qué palabra era? No me la digas. Sí. No. Vamos dentro. Despacio. No toques nada. Toca si hace falta. Ay.' },
			{ go: 'camara_alfa' },
			{ call: 'b03_camara' },
		],
		b03_camara: [
			{ text: 'Dentro, la cámara es pequeña y baja. Tienes que agacharte. Irene no. Lo nota. No dice nada, pero lo nota.' },
			{ text: 'En el techo, colgando como murciélagos dormidos, decenas de **Unown**. Negros, planos, inmóviles. Cuando entra la luz de la linterna, se despiertan todos a la vez. Un susurro de papel.' },
			{ text: 'Y en la pared del fondo, un mural.' },
			{ cutscene: { bg: { type: 'ruins', dark: true, crystals: '#7fb0e0' }, start: 'dark', frames: [
				{ fx: 'light', text: 'A la izquierda, tallada en la piedra, una **flor** pequeña, de cinco pétalos. A su lado, una figura gigante, mucho más alta que las demás, con una corona. Se inclina hacia la flor con las manos abiertas.' },
				{ text: 'A la derecha, una **máquina**. Tiene forma de flor también, pero los pétalos son placas y el tallo es una columna. De la máquina salen líneas, rayos, hacia un grupo de figuras pequeñas: personas y Pokémon. Las figuras están tumbadas.' },
				{ fx: 'glow', mon: 'lucario', text: '{riolu} vuelve a poner la palma en la piedra, entre la flor y la máquina. El aura recorre el mural. Y los Unown del techo bajan.' },
				{ fx: 'zoom', text: 'Se colocan en el aire, en fila, delante de la flor. Se ordenan solos, letra a letra: **D · A · R**.' },
				{ fx: 'zoom', text: 'Otro grupo se coloca delante de la máquina, en otra fila: **T · O · M · A · R**.' },
				{ fx: 'flash', text: 'Las dos palabras flotan un momento en la oscuridad, una frente a la otra, como los dos platos de una balanza.' },
				{ fx: 'dark', text: 'Y los Unown se deshacen, vuelven al techo, se quedan quietos. El aura de {riolu} se apaga. Solo queda la luz de la linterna temblando en la mano de Irene.' },
			] } },
			{ say: 'irene', text: '«Dar». «Tomar». —Lo dice en voz alta, muy despacio, para que conste—. La palabra que faltaba en la puerta… era «dar». La que estaba raspada en Yantra y quemada en Iris era «tomar».' },
			{ say: 'irene', text: 'No es una prohibición. Es una balanza. Aquí la gramática es muy clara: «tomar» siempre lleva complemento. «Tomar de». Y «dar» también: «dar a». —Señala el mural—. Lo que la máquina toma… se lo quita a estos. A los tumbados.' },
			{ say: 'irene', text: 'Y el gigante… da. A la flor. Da algo suyo.' },
			{ choice: [
				{ text: '«Ya había visto a ese gigante. En Kalos.»', cond: 'flag.b01_cromlech_hecha', then: [
					{ af: { irene: 2 } },
					{ say: 'irene', text: '¿En Kalos? ¿Dónde? —Se gira de golpe—. Crómlech. Los petroglifos de Kalos. Un rey gigante, una flor, una máquina-flor. —Pasa las páginas de la libreta como si quemaran—. Es la misma historia. Tallada en dos regiones. Hace tres mil años. Eso es… imposible. Eso es precioso.' },
				] },
				{ text: '«¿Quién lo talló?»', then: [
					{ af: { irene: 1 } },
					{ say: 'irene', text: 'Alguien que lo vio. Esto no es un mito: los mitos se tallan bonitos. Esto está tallado deprisa, con miedo. Mira las figuras tumbadas. Les temblaba la mano. —Se le corta la voz—. Perdón. Me emociono. Ya está.' },
				] },
				{ text: 'Quedarte en silencio, mirando el mural.', then: [
					{ af: { irene: 2 } },
					{ text: 'Irene y tú se quedan en silencio. Un minuto. Dos. Irene no saca la libreta. Por una vez, solo mira.' },
					{ say: 'irene', text: 'Gracias. —No dice por qué. No hace falta.' },
				] },
			] },
			{ text: '{riolu} sigue mirando las figuras tumbadas. No se mueve. Tiene los puños cerrados.', cond: LUC },
			{ if: 'flag.b03_nodo02', then: [
				{ say: 'irene', text: 'Y fuera, a cincuenta metros, hay una caja con forma de máquina. Con la etiqueta de este sitio. —Se quita el sombrero. Lo aprieta contra el pecho—. Hemos abierto la puerta, {jugador}. Se la hemos abierto a ellos.' },
			] },
			{ say: 'irene', text: 'Dame un minuto. Uno. Lo copio todo. Que conste en algún sitio que no sea suyo.' },
			{ text: 'Copia el mural en su libreta, a toda velocidad, sin levantar la vista. Luego arranca la hoja, escribe debajo con letra pequeña y limpia, y te la da doblada en cuatro.' },
			{ cutscene: { bg: { type: 'ruins', dark: true }, frames: [
				{ item: 'traduccionunown', text: 'Una hoja de libreta. Arriba, las letras Unown copiadas con cuidado: la puerta, el mural, las dos palabras. Abajo, la letra de Irene.' },
				{ fx: 'glow', text: 'En una esquina, más pequeño, como si no quisiera que lo vieras, ha dibujado a {riolu} con la palma en la piedra. Es un dibujo malo. Es un dibujo muy bonito.' },
			] } },
			{ give: 'traduccionunown' },
			{ af: { irene: 3 } },
			{ say: 'irene', text: 'Guárdala tú. Si la llevo yo, me la pedirán. Si la llevas tú… —Se pone el sombrero—. A ti no te van a pedir nada. Todavía.' },
			{ go: 'ruinas_alfa' },
			{ call: 'b03_lemnis_llega' },
		],
		b03_lemnis_llega: [
			{ text: 'Salís de la cámara a gatas. Fuera ya es de día. Y los focos están encendidos. Todos. Apuntándoos.' },
			{ text: 'Delante de la puerta abierta, una mujer con traje gris y casco blanco, con la lemniscata en el pecho, mira la cámara. Mira la puerta. Los mira. Detrás de ella, el agente de la valla, con un café en la mano y cara de lo siento.' },
			{ say: 'agente_lemnis', as: 'Jefa de excavación', text: 'Vaya. Llegamos justo a tiempo. —Sonríe—. Bueno. Justo tarde. Ustedes han llegado justo a tiempo.' },
			{ say: 'agente_lemnis', as: 'Jefa de excavación', text: '{jugador}, ¿verdad? —Mira una tableta. Te enseña la pantalla: tu foto de inscripción, y debajo, en letras grandes, «RUINAS ALFA»—. Lo pone aquí. Nos dijeron que estaría por aquí.' },
			{ if: 'flag.b02_furgoneta_presentado', then: [{ say: 'agente_lemnis', as: 'Jefa de excavación', text: '{El|La|Le} de Azalea. Usted se pierde mucho, pero siempre aparece donde hace falta. Es un don.' }] },
			{ if: 'flag.b02_furgoneta_escondido', then: [{ say: 'agente_lemnis', as: 'Jefa de excavación', text: 'En la lista pone «en tránsito». Qué curioso: el sistema siempre sabe dónde está, pero la lista nunca. Tendremos que actualizar la lista.' }] },
			{ say: 'agente_lemnis', as: 'Jefa de excavación', text: 'Y la doctora Solberg. La universidad de Ciudad Canal nos ha hablado mucho de usted. Muchísimo. Por escrito. —Mira la cámara abierta, encantada—. Gracias. De verdad. Nos han ahorrado una semana de excavadora. El patrimonio se lo agradece.' },
			{ say: 'irene', text: 'El patrimonio no le ha pedido nada. —Lo dice muy bajito. Le tiemblan las manos. No se aparta.' },
			{ choice: [
				{ text: 'Ponerte delante de la puerta: «Nadie entra hasta que Irene termine».', then: [
					{ af: { irene: 5 } },
					{ rep: { lemnis: -3 } },
					{ say: 'agente_lemnis', as: 'Jefa de excavación', text: 'Ay. Qué lástima. —Suspira—. Seguridad, por favor. Con educación.' },
					{ text: 'El agente de la valla deja el café en el suelo, con muchísimo cuidado, y saca una Poké Ball.' },
					{ battle: 'agente_ruinas', lose: 'continue',
						onWin: [
							{ text: 'Mientras el agente recoge a su Magneton, Irene vuelve a entrar en la cámara y termina de copiar las últimas letras. Sale con la libreta apretada contra el pecho y la barbilla muy alta.' },
							{ say: 'agente_lemnis', as: 'Jefa de excavación', text: 'Muy bien. Ya está. ¿Contentos? —Teclea algo en la tableta—. Lo pongo en el informe como «colaboración ciudadana». Suena mejor.' },
						],
						onLose: [
							{ text: 'Mientras el agente te ofrece un café, Irene aprovecha para volver a entrar y copiar las últimas letras. Nadie la detiene. Nadie se fija en ella. Sale con la libreta apretada contra el pecho.' },
						] },
				] },
				{ text: 'Dejar que hable Irene.', then: [
					{ af: { irene: 3 } },
					{ say: 'irene', text: 'Según el Convenio de Patrimonio de Johto, artículo doce, punto tres, cualquier hallazgo epigráfico debe documentarse por un especialista acreditado antes de cualquier intervención. —Respira—. Soy una especialista acreditada. Y no he terminado de documentar.' },
					{ say: 'agente_lemnis', as: 'Jefa de excavación', text: '…Media hora. —Sonríe un poco menos—. Le doy media hora, doctora. Por el convenio. Que nadie diga que Lemnis no respeta los convenios.' },
					{ text: 'Irene vuelve a entrar. Sale a los veintinueve minutos exactos, con la libreta llena y los ojos rojos.' },
				] },
				{ text: '«Es todo suyo.» Y llevarte a Irene de allí.', then: [
					{ rep: { lemnis: 2 } },
					{ af: { irene: -2 } },
					{ say: 'irene', text: '{jugador}, no he terminado de… —La tomas del brazo. Se deja llevar. Mira atrás todo el camino—. No he terminado.' },
					{ say: 'agente_lemnis', as: 'Jefa de excavación', text: '¡Muchas gracias! ¡Muy amables! —Les dice adiós con la mano—. ¡Habrá visitas guiadas en primavera! ¡Con descuento para la Gira!' },
				] },
			] },
			{ text: 'Los técnicos ya están desenrollando cable hacia la puerta abierta. Desde la carpa de material sale un carro con la caja larga, precintada, empujado por cuatro personas.' },
			{ text: '{riolu} se gira a mirarla mientras se alejan. No aparta la vista hasta que la tapa una colina.', cond: LUC },
			{ call: 'b03_ruinas_cierre' },
		],
		b03_ruinas_cierre: [
			{ text: 'En el camino de vuelta a la Ruta 32, Irene se sienta en una piedra y no dice nada durante un rato. Luego saca la libreta y escribe algo, muy despacio.' },
			{ say: 'irene', text: 'Me voy a Ciudad Canal. A la biblioteca. Tengo que cruzar esto con todo lo que tengamos: Yantra, Iris, Crómlech… —Cierra la libreta—. Y tengo que escribir un informe que nadie va a querer leer.' },
			{ say: 'irene', text: '{jugador}. Esto… —Señala la libreta, luego a {riolu}, luego a ti, sin terminar la frase—. Ha sido el mejor día de mi vida profesional y uno de los peores de mi vida. Las dos cosas. No sabía que se podían tener a la vez.' },
			{ if: 'af.irene >= 15', then: [
				{ say: 'irene', text: 'Y gracias. Por aprender. Por apartarte. Por… —Se le corta la frase. Se ajusta el sombrero hasta taparse los ojos—. Por todo eso. Ya está. Lo he dicho. Me voy antes de decir algo más.' },
			], else: [
				{ say: 'irene', text: 'Gracias por venir. De verdad. —Se ajusta el sombrero—. Y cuida esa hoja.' },
			] },
			{ text: 'Se va por el camino de la Ruta 32, hacia Malva, muy deprisa, con la libreta apretada contra el pecho. No mira atrás. Bueno: una vez.' },
			{ set: { 'flag.b03_ruinas_hecho': true } },
			{ quest: 'b03_m1', done: true },
			{ say: 'rotom', text: '¡Bzzt! Mensaje nuevo. De Lila. ¡Lleva tres emojis de llama! Eso es mucho para Lila.' },
			{ text: '*«{jugador}: ¡el gimnasio de Trigal abre por fin! Las obras han terminado y Corelia llega mañana. Ella es la líder de intercambio. Corelia, sí, la de Yantra. Dice que te está esperando «a tope». Yo ayudo con los aprendices. Te esperamos. — Lila 🔥🔥🔥»*' },
			{ text: '*Y un segundo mensaje, un minuto después: «Bueno. Te espero. Es decir, te esperamos. Las dos. Bueno, todos».*', cond: 'af.lila >= 20' },
			{ say: 'rotom', text: '¡Ruta a Trigal! Por la Ruta 32 hasta Azalea, el Encinar y la Ruta 34. O volviendo por Malva y las Rutas 36 y 37. ¡Las dos están bien! Una tiene más Wooper.' },
			{ quest: 'b03_m2', stage: 'trigal' },
			{ diary: 'Hoy mi entrenador{|a|e} y yo conocimos en persona a la Dra. Irene, ¡la de los mensajes larguísimos! Es más bajita de lo que parece por la pantalla (eso no se lo digo). Nos enseñó a leer una palabra en letras Unown: LUZ. ¡Ya sé leer Unown! Bueno, tres letras.\n\nLas Ruinas Alfa son preciosas. Hay piedras viejísimas y unos señores muy amables de Lemnis que las cuidan por patrimonio. Uno nos dio un folleto con un Unown que sonríe.\n\n{riolu} tocó una pared y se puso a brillar entero. ¡Qué bonito! Después Irene se puso un poco triste, creo que porque se iba a casa. Le diré que vuelva pronto. Me cae muy bien.', cond: 'flag.b01_diario' },
			{ save: true },
		],
		b03_mural: [
			{ text: 'La flor pequeña. El rey gigante inclinado hacia ella. La máquina-flor y sus rayos. Las figuras tumbadas.' },
			{ text: 'Debajo de la flor, tres letras talladas: DAR. Debajo de la máquina, cinco: TOMAR.', cond: 'flag.b03_irene_leccion' },
			{ text: 'Cuanto más lo miras, más te fijas en un detalle que antes no viste: una de las figuras tumbadas, junto a la máquina, tiene orejas largas y un pincho en el pecho. Como {riolu}.', cond: LUC },
			{ text: '{riolu} no quiere mirar el mural otra vez. Se queda en la entrada, de espaldas.', cond: 'flag.b03_ruinas_hecho && (' + LUC + ')' },
		],
		b03_camara_despues: [
			{ text: 'La puerta que abrió {riolu} está ahora rodeada por una segunda valla. Un foco la ilumina. Un cartel nuevo: «**Cámara de la Balanza** · Descubierta por el Proyecto de Conservación del Patrimonio Lemnis».', cond: LUC },
			{ text: 'La puerta abierta está ahora rodeada por una segunda valla. Un foco la ilumina. Un cartel nuevo: «**Cámara de la Balanza** · Descubierta por el Proyecto de Conservación del Patrimonio Lemnis».', cond: '!(' + LUC + ')' },
			{ text: 'De la carpa de material sale un cable gordo, negro, que se mete por la puerta. Desde dentro llega un zumbido. Grave, constante. Lo notas en los dientes.' },
			{ text: 'Puedes entrar por el lateral, donde los técnicos han dejado una pasarela. Nadie te para. Te saludan.' },
			{ choice: [
				{ text: 'Entrar a mirar el mural.', then: [{ go: 'camara_alfa' }] },
				{ text: 'Mejor no.', then: [{ text: 'Te das la vuelta. A tu espalda, el zumbido sigue.' }] },
			] },
		],
	},

	// =====================================================================
	// NPCs genéricos de este tramo
	// =====================================================================
	npcs: {
		vecina_malva: { name: 'Vecina de Malva', generic: true, look: { hair: 'bun', hairColor: '#b9b0c0', outfit: '#8c6cd0', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'happy', mouth: 'smile', acc: 'flower' } },
		maestra_malva: { name: 'Maestra de la escuela', generic: true, look: { hair: 'ponytail', hairColor: '#5a3a26', outfit: '#5aa36b', outfit2: '#e9e3d0', skin: 2, acc: 'glasses', mouth: 'smile' } },
		nino_malva: { name: 'Niño', generic: true, look: { hair: 'spiky', hairColor: '#2b2b38', outfit: '#3b5bb5', outfit2: '#f2b33d', skin: 1, eyesStyle: 'happy', mouth: 'open' } },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		calcoli: { name: 'Calco del Sabio Li', pocket: 'key', desc: 'Un rollo de papel de arroz atado con un cordón rojo. Huele a carboncillo y a madera vieja.',
			read: 'Un calco de hace cien años: papel de arroz apretado contra la piedra y frotado con carboncillo. Filas de letras Unown en negro, alrededor de una flor de muchos pétalos.\n\nEn el círculo de letras que rodea la flor hay un hueco. No está borrado: el papel está limpio, como si allí la piedra nunca hubiera tenido nada.\n\nEn la esquina inferior, con pincel, una mano antigua escribió:\n\n*«Invierno del año del pilar torcido. Copiado por los hermanos de la torre, de rodillas, durante cuarenta y un días.\n\nLo que falta no se ha borrado. Se ha callado.\n\nQue nadie la abra con prisa. Que nadie la abra con hambre.»*' },
		notapetra: { name: 'Notas de Petra', pocket: 'key', desc: 'Una hoja de libreta con manchas de barro, una huella de Pachirisu y letra apretada.',
			read: '**REGISTRO: PACHIRISU «CHISPAS»** (nombre elegido por él, creo)\n\n*Día 1.* Dormido. No responde. Respira 6 veces por minuto. (Lo normal son 30. Lo he buscado.)\n*Día 3.* Igual. Pala le ha cavado una madriguera a medida. El Lucario de mi amig{o|a|e} de la Gira le dejó una hoja encima, como una manta. No la he quitado.\n*Día 6.* Respira 9 veces por minuto. Mejillas: nada.\n*Día 9.* Los relojes del bosque vuelven a ir bien. ¿Relación? Lo apunto por si acaso.\n*Día 10.* Respira 14 veces. Ha movido una oreja. He llorado. No lo apunto.\n*Día 12.* DESPIERTO. Se ha comido mi bocadillo. Entero. Con el papel.\n\n**Qué funcionó (creo):** calor, compañía, miel tibia, que alguien se quedara al lado. Y alejarlo de donde se apagó.\n**Qué no funcionó:** las bayas solas. Las medicinas del Centro. La prisa.\n\nNota al margen, con otra tinta: *No se apagó solo. Algo lo apagó. Algo que se lleva las ganas. No sé qué es. Pero a 50 metros de la carpa de Lemnis, Chispas deja de chispear.*' },
		cojintobias: { name: 'Cojín de Tobías', pocket: 'misc', cost: 0, desc: 'Un cojín con la cara de Tobías estampada, sonriendo con el pulgar arriba. Le falta media sonrisa: un zarpazo de Persian. «¡Duquesa, duerme con tu humano favorito!» Regalo de Pociones Patito.' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		bayas_r32: {
			name: 'Arbustos de bayas junto a la charca', icon: '🫐', hours: 18, picks: [1, 3],
			text: 'Rebuscas entre los arbustos, con cuidado de no pisar a ningún Wooper. Hay bayas maduras.',
			wait: 'Los Wooper se han comido todas las bayas maduras. Te miran con la boca abierta. No parecen arrepentidos.',
			table: BAYAS_R32,
		},
		tierra_alfa: {
			name: 'Tierra removida de las Ruinas', icon: '⛏️', hours: 22, picks: [1, 2],
			text: 'Las excavadoras de Lemnis dejan montones de tierra junto a las cámaras. Nadie los mira. Tú sí.',
			wait: 'Ya has cribado todo lo que había. Mañana habrá más: la excavadora no descansa.',
			table: [
				{ id: 'stardust', w: 24, n: [1, 2] }, { id: 'hardstone', w: 14, n: [1, 1] }, { id: 'tinymushroom', w: 14, n: [1, 2] },
				{ id: 'rarebone', w: 8, n: [1, 1] }, { id: 'starpiece', w: 5, n: [1, 1] }, { id: 'nugget', w: 4, n: [1, 1] },
				{ id: 'helixfossil', w: 2, n: [1, 1] }, { id: 'domefossil', w: 2, n: [1, 1] }, { id: 'oldamber', w: 1, n: [1, 1], cond: 'flag.b03_ruinas_hecho' },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		torre_bellsprout: {
			name: 'La Torre Bellsprout', npc: 'li', trainer: 'sabio_li', type: 'Grass', rec: 41,
			cond: 'visited("malva")',
			info: [
				{ text: 'Tres sabios en tres pisos y, arriba del todo, el **Sabio Li**. Guarda algo que Irene necesita.' },
				{ cond: 'visited("torre_bellsprout")', text: 'Los sabios combaten con **Bellsprout** y **Hoothoot**, y sus evoluciones. El **Fuego**, el **Hielo** y el **Psíquico** les van bien.' },
				{ cond: 'beat("sabio_edmundo")', text: 'Dicen que a los Pokémon de **Acero** el veneno ni les roza.' },
				{ cond: 'beat("sabio_li")', text: '**Sabio Li**: 3 Pokémon, niveles 40 a 42. ✔ Vencido.' },
				{ cond: 'flag.b03_tobias_1 && !beat("tobias_2")', text: 'Tobías y Duquesa graban en el primer piso. Tobías dice que habrá «giro de guion» cuando venzas a Li.' },
				{ cond: 'beat("tobias_2")', text: '✔ Venciste también al «jefe de piso» de la temporada dos.' },
			],
		},
		ruinas_alfa: {
			name: 'Las Ruinas Alfa', type: 'Psychic', rec: 41,
			cond: 'visited("ruinas_alfa")',
			info: [
				{ text: 'Una cámara sellada que nadie ha abierto en tres mil años. Lemnis la ha vallado «por patrimonio».' },
				{ cond: '!has("calcoli")', text: 'Irene necesita el calco del **Sabio Li** (Torre Bellsprout, Malva).' },
				{ cond: '!flag.b03_nodo02', text: 'Irene quiere saber qué guarda Lemnis en la **carpa de material**.' },
				{ cond: 'flag.b03_ruinas_hecho', text: '✔ La cámara está abierta.' },
			],
		},
	},
};
