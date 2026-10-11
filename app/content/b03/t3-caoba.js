// Bloque 3 · Tramo 3: «Las aguas revueltas».
// Pueblo Caoba → Ruta 43 (la caseta de peaje) → Lago de la Furia (el Gyarados rojo, Lance, A.Z., Ulises)
// → la tienda de recuerdos y la guarida Rocket (Atlas, la máquina de la señal) → la decisión de los Rocket → final del bloque.

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = 'inParty("riolu") || inParty("lucario")';
const M6_GUARIDA = 'quest.b03_m6 == "guarida"';
const PASS_OK = 'flag.b03_contrasena';
const PUERTA_OK = 'flag.b03_puerta_rota';
const MAQUINA_OK = 'flag.b03_maquina_vista';
const ROCKET_DECIDIDO = 'flag.b03_rocket_policia || flag.b03_rocket_libres || flag.b03_rocket_quemar';
const FIN_OK = 'done.b03_m6 && !flag.b03_fin';

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== RUTA 43 ===================
		ruta43: {
			name: 'Ruta 43', short: 'Ruta 43', region: 'johto', kind: 'route', map: { x: 90, y: 8 },
			bg: { type: 'route', flowers: '#d9c46a', far: '#6a8a5a', hill: '#5a7a4a' },
			desc: 'Un camino de tierra que sube hacia el norte desde Pueblo Caoba, entre hierba alta y pinos. El aire huele a resina y a agua. Mucha agua.\n\nA medio camino, una **caseta de madera** con una barrera de rayas rojas y blancas. Antes no estaba. Alguien ha pintado encima, con muy mala letra: «PEAJE».',
			descNight: 'De noche, la Ruta 43 está en silencio, salvo por los Noctowl. Y, de vez en cuando, desde el norte, un rugido que no es de ningún pájaro.',
			descs: [{ cond: 'flag.b03_peaje_hecho', text: 'Un camino de tierra que sube hacia el norte desde Pueblo Caoba, entre hierba alta y pinos.\n\nLa **caseta de peaje** sigue ahí, con la barrera levantada. Dentro no hay nadie. En la ventanilla, un cartel escrito a mano: «CERRADO POR REESTRUCTURACIÓN».' }],
			links: ['caoba', 'lago_furia'],
			enterCond: 'done.b03_m5',
			blockedMsg: 'Una vecina de Caoba te corta el paso, con los brazos cruzados: «¿Al lago? ¿Ahora? Primero termina lo que tengas pendiente, criatura. El lago no se va a ir a ningún sitio. Por desgracia».',
			mapNote: 'Caseta de peaje · al norte, el Lago de la Furia',
			rumors: [
				{ text: 'Han puesto un peaje en la Ruta 43. Nadie sabe quién. El ayuntamiento dice que no es suyo. Los del peaje dicen que el ayuntamiento no existe.' },
				{ text: 'Por la Ruta 43 ha pasado un hombre con capa y un Dragonite. No pagó el peaje. Nadie se atrevió a cobrárselo.' },
				{ cond: '!flag.b03_peaje_hecho', text: 'Dicen que el de las orejas de soplillo que cobra el peaje es de la Ruta 37. Que tiene una madre que cocina muy bien.' },
			],
			route: {
				from: 'caoba', to: 'lago_furia', length: 7, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [
						{ text: 'Pueblo Caoba queda atrás. El camino sube entre pinos. Desde que saliste del rancho no has hablado mucho. Rotom tampoco, y eso que Rotom siempre habla.', cond: '!done.b03_m6' },
						{ text: 'Pueblo Caoba queda atrás. El camino sube entre pinos que huelen a resina.', cond: 'done.b03_m6' },
					],
					1: [
						{ script: 'b03_r43_entrada', once: true },
						{ trainer: 'r43_aquilino' },
						{ text: 'Un cartel oficial: «Lago de la Furia · 3 km». Debajo, otro, más nuevo, de la Gira: «¡Visita el lago más bonito de Johto! Patrocinado por la Fundación Raíces». Alguien le ha dibujado un Gyarados con colmillos encima.' },
					],
					2: [
						{ spot: { action: { gather: 'arbol_r43' } }, label: 'Árbol cargado de bayas', icon: '🌳' },
						{ item: 'hyperpotion' },
						{ text: 'Un Pineco cuelga de una rama, muy quieto, fingiendo que es una piña. Lo hace muy bien. Demasiado bien. Lleva así desde la semana pasada, según un niño que pasa.' },
					],
					3: [
						{ text: 'Una caseta de madera recién pintada, con una barrera de rayas rojas y blancas que corta el camino de lado a lado. En la ventanilla, un cartel: «PEAJE · Impuesto de paso · Se aceptan Pokédólares, bayas y disculpas (las disculpas no)».' },
						{ talk: [{ script: 'b03_peaje' }], label: 'La caseta de peaje', sub: 'Dos personas con gorra te miran desde la ventanilla', icon: '🚧', cond: '!flag.b03_peaje_hecho', new: '!flag.b03_peaje_hecho' },
						{ block: { cond: 'flag.b03_peaje_hecho', msg: 'La barrera del peaje está bajada. Desde la ventanilla, alguien carraspea muy fuerte.', dir: 1, script: 'b03_peaje' } },
					],
					4: [
						{ trainer: 'r43_leocadia' },
						{ text: 'El camino se ensancha. Entre los pinos se ve agua: una franja azul oscuro, enorme, que no se acaba. Y, por encima del agua, algo que salta. Algo largo y furioso.' },
					],
					5: [
						{ item: 'ultraball', hidden: true },
						{ text: 'Un Farfetch’d con su puerro te observa desde la cuneta, como si te hubiera estado esperando. No es de aquí. Ni siquiera parece saber dónde está «aquí».' },
					],
					6: [
						{ terrain: 'water' },
						{ trainer: 'r43_pancracio', optional: true, label: 'Pesca en la orilla de un arroyo, de mal humor' },
						{ item: 'mysticwater', hidden: true },
						{ text: 'El camino baja hasta la orilla de un arroyo que corre hacia el lago. El agua está turbia. Los Magikarp del arroyo nadan todos en la misma dirección, contra la corriente, como si alguien los llamara.' },
					],
					7: [{ text: 'Los pinos se abren y aparece el **Lago de la Furia**: agua oscura hasta donde alcanza la vista, una orilla de arena gris y, en mitad del lago, un remolino que no debería estar ahí.' }],
				},
				encounters: {
					grass: [
						{ sp: 'pidgeotto', lv: [42, 45], w: 24 },
						{ sp: 'flaaffy', lv: [42, 44], w: 18 },
						{ sp: 'girafarig', lv: [43, 45], w: 14 },
						{ sp: 'loudred', lv: [42, 44], w: 10 },
						{ sp: 'linoone', lv: [43, 45], w: 10 },
						{ sp: 'bibarel', lv: [43, 45], w: 8 },
						{ sp: 'noctowl', lv: [43, 46], w: 20, time: 'night' },
						{ sp: 'venomoth', lv: [43, 46], w: 10, time: 'night' },
						{ sp: 'farfetchd', lv: [43, 45], w: 5, displaced: true },
						{ sp: 'kangaskhan', lv: [44, 46], w: 3, displaced: true },
					],
					water: [
						{ sp: 'magikarp', lv: [40, 44], w: 50 },
						{ sp: 'poliwhirl', lv: [42, 45], w: 25 },
						{ sp: 'floatzel', lv: [43, 45], w: 15 },
						{ sp: 'gyarados', lv: [44, 46], w: 6 },
					],
				},
			},
		},

		// =================== LAGO DE LA FURIA ===================
		lago_furia: {
			name: 'Lago de la Furia', short: 'Lago de la Furia', region: 'johto', kind: 'area', map: { x: 92, y: 3 },
			bg: { type: 'coast', far: '#2b4a6a', ground: '#8a8a7a' },
			desc: 'El lago más grande de Johto. Agua oscura, casi negra, una orilla de arena gris y pinos que bajan hasta el borde. Dicen que se llama así por una vieja sequía y un dragón enfadado.\n\nHoy se llama así por otra cosa. El agua **hierve** en remolinos. Los Magikarp saltan, se retuercen y, de pronto, **brillan**. Y donde había un Magikarp hay un Gyarados que ruge contra nada.',
			descNight: 'De noche, el lago es un espejo negro con la luna partida en mil trozos. Los rugidos no paran. A lo lejos, sobre el agua, una luz roja parpadea a un ritmo que no es el de ningún faro.',
			descs: [
				{ cond: 'flag.b03_fin', text: 'El Lago de la Furia vuelve a ser solo un lago. El agua está quieta, oscura, enorme. Los Magikarp saltan porque sí, como siempre han saltado. Los Gyarados que quedan dormitan en los bajíos, cansados, como quien sale de una fiebre.\n\nEn la orilla, un pescador viejo dice que hacía años que no veía el lago tan tranquilo. Luego dice que eso le da más miedo todavía.' },
				{ cond: 'done.b03_m6', text: 'El agua del lago se ha calmado. No del todo: de vez en cuando un Gyarados levanta la cabeza, mira alrededor como quien se despierta en un sitio que no conoce, y vuelve a hundirse.\n\nLa luz roja de la boya ya no parpadea.' },
				{ cond: 'flag.b03_lago_llegada', text: 'El agua sigue revuelta. Los Magikarp saltan y brillan, y algunos ya no vuelven a caer como Magikarp. En mitad del lago, una **boya** con una luz roja parpadea: tres destellos, una pausa, tres destellos.\n\nLance se ha ido hacia Caoba. Sobre la arena quedan las huellas enormes de su Dragonite.' },
			],
			links: ['ruta43'],
			mapNote: 'Magikarp revueltos · dicen que hay un Gyarados rojo',
			onEnter: [
				{ script: 'b03_lago_llegada', cond: 'quest.b03_m6 == "lago" && !flag.b03_lago_llegada', once: true },
				{ script: 'b03_fin', cond: FIN_OK, once: true },
			],
			spots: [
				{ label: 'Quedarte junto al lago', sub: 'Se está haciendo de noche', icon: '🌙', cond: FIN_OK, new: 'true', script: 'b03_fin' },
				{ label: 'El sitio del Gyarados rojo', sub: 'Una escama roja brilla entre las piedras', icon: '🔴', cond: 'flag.b03_gyarados_rojo', talk: [{ script: 'b03_gyarados_recuerdo' }] },
				{ label: 'Tomar una muestra del agua', sub: 'Kaori te pidió una', icon: '🧪', cond: 'quest.b03_t_kaori == "muestra" && !flag.b03_muestra_tomada', new: 'true', talk: [{ script: 'b03_muestra_lago' }] },
				{ label: 'Un hombre enorme en la orilla', sub: 'Lleva una flor roja en el hombro', icon: '🌺', cond: 'night && flag.b03_lago_llegada && !flag.b03_az', new: 'true', talk: [{ script: 'b03_az' }] },
				{ label: 'Unas huellas enormes en la arena', sub: 'Van hacia el agua y no vuelven', icon: '👣', cond: '!night && flag.b03_lago_llegada && !flag.b03_az', talk: [{ script: 'b03_az_huellas' }] },
				{ label: 'Una cabina azul entre los pinos', sub: 'Ayer no estaba. Respira', icon: '🟦', cond: 'flag.b03_lago_llegada && !flag.b03_ulises_lago', new: 'true', talk: [{ script: 'b03_ulises' }] },
				{ label: 'Orilla de arena gris', sub: 'El lago escupe cosas', icon: '🐚', action: { gather: 'orilla_furia' } },
				{ label: 'Pescar en la orilla', sub: 'Algo pica. Algo grande', icon: '🎣', action: { explore: 'water' } },
				{ label: 'Explorar entre los pinos', sub: 'Golpes en los troncos, ojos en las ramas', icon: '🌲', action: { explore: 'grass' } },
			],
			encounters: {
				water: [
					{ sp: 'magikarp', lv: [40, 44], w: 45 },
					{ sp: 'gyarados', lv: [43, 46], w: 25, cond: '!done.b03_m6' },
					{ sp: 'gyarados', lv: [43, 45], w: 8, cond: 'done.b03_m6' },
					{ sp: 'poliwhirl', lv: [42, 45], w: 15 },
					{ sp: 'lanturn', lv: [43, 45], w: 6, time: 'night' },
				],
				grass: [
					{ sp: 'noctowl', lv: [42, 45], w: 22, time: 'night' },
					{ sp: 'exeggcute', lv: [42, 44], w: 18 },
					{ sp: 'pineco', lv: [42, 43], w: 14 },
					{ sp: 'forretress', lv: [44, 46], w: 6 },
					{ sp: 'girafarig', lv: [43, 45], w: 12 },
					{ sp: 'venomoth', lv: [43, 46], w: 12, time: 'night' },
				],
			},
			rumors: [
				{ text: 'Los Magikarp del lago evolucionan solos desde hace una semana. Sin subir de nivel. Sin nada. Brillan y ¡zas!, Gyarados. Y furiosos.' },
				{ cond: '!flag.b03_gyarados_rojo', text: 'Hay un Gyarados rojo. Rojo como un buzón. Dicen que es el más furioso de todos.' },
				{ cond: 'flag.b03_lago_llegada', text: 'La luz de la boya parpadea tres veces y se para. Tres y se para. El pescador viejo dice que los Gyarados rugen justo después de cada tres.' },
				{ text: 'De noche, a veces, se ve a un hombre altísimo en la orilla. Nunca lo ves llegar. Nunca lo ves irse.' },
			],
		},

		// =================== TIENDA DE RECUERDOS (Caoba) ===================
		tienda_recuerdos: {
			name: 'Tienda de recuerdos', parent: 'caoba', kind: 'building',
			bg: { type: 'indoor', wall: '#7a5a3a', floor: '#4a3a2a' },
			desc: 'Una tienda pequeña y abarrotada: llaveros de Gyarados, tazas del lago, gorras de «Yo sobreviví al Lago de la Furia» y, en el mostrador, una montaña de **Caramelos Furia** envueltos en papel rojo.\n\nEn las esquinas, dos **estatuas de Persian** de escayola, con los ojos de cristal. Te siguen con la mirada. Seguro que es un efecto óptico.\n\nAl fondo, una cortina de cuentas da a la **trastienda**, de donde salen gritos de «¡Usa Mordisco!».',
			descs: [{ cond: 'flag.b03_guarida_abierta', text: 'La tienda de recuerdos, con sus llaveros de Gyarados y sus Caramelos Furia. Una de las estatuas de Persian está corrida a un lado y deja ver una **escalera** que baja a oscuras.\n\nEl dependiente ya no finge. Se ha sentado en un taburete y hace un crucigrama.' }],
			mapNote: 'Trastienda: combates clandestinos (entrenamiento)',
			spots: [
				{ label: 'El dependiente', sub: 'Sonríe demasiado', icon: '🧔', talk: [{ cond: 'flag.b03_guarida_abierta', script: 'b03_dependiente_despues' }, { script: 'b03_dependiente' }] },
				{ label: 'La trastienda', sub: 'Combates «amistosos» detrás de la cortina (tope 47)', icon: '🥊', action: { training: { cap: 47, prize: { wins: 3, script: 'p7_premio_trastienda' }, trainers: ['trastienda_1', 'trastienda_2', 'trastienda_3'], wild: [{ sp: 'raticate', lv: [43, 45] }, { sp: 'murkrow', lv: [43, 45] }, { sp: 'grimer', lv: [43, 45] }], coach: 'Dependiente', closed: 'El dependiente te para en la cortina: «Aquí ya no te queda nadie a quien ganar. Y yo ya no te quedo a quien sacarle dinero. Fuera, fuera».' } } },
				{ label: 'Las estatuas de Persian', sub: 'Lance las mira muy fijamente', icon: '🐈', cond: M6_GUARIDA + ' && !flag.b03_guarida_abierta', new: 'true', talk: [{ script: 'b03_tienda_puzle' }] },
				{ label: 'Bajar por la escalera oculta', sub: 'Huele a humedad y a ozono', icon: '🪜', cond: 'flag.b03_guarida_abierta', new: '!flag.b03_guarida_llegada || (flag.b03_atlas_visto && !beat("atlas_1"))', action: { go: 'guarida_rocket' } },
			],
		},

		// =================== GUARIDA ROCKET ===================
		guarida_rocket: {
			name: 'Guarida Rocket', parent: 'tienda_recuerdos', kind: 'cave',
			bg: { type: 'cave', dark: true, crystals: '#c4473a' },
			desc: 'Un sótano mucho más grande que la tienda de arriba. Pasillos de hormigón, tubos fluorescentes que zumban y carteles viejos con una **R** roja medio despintada. En las paredes, fotos de grupo enmarcadas: decenas de reclutas sonriendo, con el uniforme puesto, de hace muchos años.\n\nAl fondo, detrás de una puerta de acero, algo hace un ruido grave y constante, como una nevera enorme. Cada pocos segundos, el zumbido sube. Tres veces. Pausa. Tres veces.',
			descs: [
				{ cond: ROCKET_DECIDIDO, text: 'La guarida está vacía. Los fluorescentes siguen zumbando, pero la máquina del fondo ya no. Las fotos de grupo siguen en las paredes: decenas de reclutas sonriendo, de hace muchos años.\n\nAlguien ha dejado en el suelo, junto a la puerta, una gorra con la R. Bien doblada.' },
				{ cond: PUERTA_OK, text: 'La puerta de acero del fondo está en el suelo, doblada como una hoja de papel, con la marca de un Hiperrayo en el centro. Detrás, la **sala de la máquina**: un armatoste de cables y antenas que zumba, tres veces y pausa.\n\nA un lado, una fila de **tanques de agua** y de **jaulas**. No se mueve nada dentro.' },
			],
			mapNote: 'Team Rocket · la máquina de la señal',
			onEnter: [{ script: 'b03_guarida_llegada', cond: '!flag.b03_guarida_llegada', once: true }],
			spots: [
				{ label: 'Recluta del pasillo', sub: 'Vigila la entrada con un Weezing', cond: '!' + PASS_OK, action: { trainer: 'guarida_1' } },
				{ label: 'Interfono junto a las estatuas', sub: '«Diga la contraseña»', icon: '🔐', cond: 'beat("guarida_1") && !' + PASS_OK, new: 'true', talk: [{ script: 'b03_contrasena' }] },
				{ label: 'La Tercera', sub: 'Lima una ganzúa. Te reconoce', cond: PASS_OK, action: { trainer: 'guarida_2' } },
				{ label: 'La Mayor', sub: 'Reparte bocadillos a los demás', cond: PASS_OK, action: { trainer: 'guarida_3' } },
				{ label: 'La puerta de acero', sub: 'Gruesa como un colchón', icon: '🚪', cond: PASS_OK + ' && !' + PUERTA_OK, new: 'beat("guarida_2") && beat("guarida_3")', talk: [{ cond: 'beat("guarida_2") && beat("guarida_3")', script: 'b03_puerta' }, { script: 'b03_puerta_cerrada' }] },
				{ label: 'Recluta de la sala de máquinas', sub: 'Tiene un Electrode en cada mano', cond: PUERTA_OK, action: { trainer: 'guarida_4' } },
				{ label: 'Los tanques y las jaulas', sub: 'Pokémon que no se mueven', icon: '🫙', cond: PUERTA_OK, new: '!flag.b03_jaulas_vistas', talk: [{ cond: ROCKET_DECIDIDO, script: 'b03_jaulas_despues' }, { script: 'b03_jaulas' }] },
				{ label: 'La máquina de la señal', sub: 'Zumba: tres veces y pausa', icon: '📡', cond: PUERTA_OK + ' && beat("guarida_4")', new: '!' + MAQUINA_OK, talk: [{ cond: ROCKET_DECIDIDO, script: 'b03_maquina_despues' }, { cond: MAQUINA_OK, script: 'b03_maquina_otra_vez' }, { script: 'b03_maquina' }] },
				{ label: 'Lance vigila el pasillo', sub: 'Descansar y curar al equipo', icon: '🐉', cond: PUERTA_OK + ' && !(' + ROCKET_DECIDIDO + ')', talk: [{ script: 'b03_lance_descanso' }] },
				{ label: 'Una voz detrás de la máquina', sub: 'Alguien ha llegado por otra puerta', icon: '🚀', cond: MAQUINA_OK + ' && !(' + ROCKET_DECIDIDO + ')', new: 'true', talk: [{ script: 'b03_atlas' }] },
				{ label: 'Explorar los pasillos', sub: 'Ratas, murciélagos y humedad', icon: '🦇', action: { explore: 'cave' } },
			],
			encounters: {
				cave: [
					{ sp: 'golbat', lv: [43, 45], w: 25 },
					{ sp: 'raticate', lv: [43, 45], w: 22 },
					{ sp: 'weezing', lv: [44, 46], w: 12 },
					{ sp: 'muk', lv: [44, 46], w: 10 },
					{ sp: 'electrode', lv: [44, 46], w: 12 },
					{ sp: 'murkrow', lv: [43, 45], w: 10, time: 'night' },
					{ sp: 'sneasel', lv: [44, 46], w: 4 },
				],
			},
			rumors: [
				{ text: 'Debajo de Caoba hay más pasillos que calles. Eso dicen los viejos del pueblo. Los jóvenes dicen que los viejos dicen muchas cosas.' },
			],
		},
	},

	// Botones nuevos en Pueblo Caoba (lugar de T2)
	extraSpots: {
		caoba: [
			{ label: 'Tienda de recuerdos', sub: 'Llaveros, tazas y Caramelos Furia', icon: '🎁', new: '(' + M6_GUARIDA + ' && !flag.b03_guarida_abierta) || (flag.b03_atlas_visto && !beat("atlas_1"))', action: { go: 'tienda_recuerdos' } },
			{ label: 'Enviar la muestra a Kaori', sub: 'El mostrador de envíos del Centro Pokémon', icon: '📦', cond: 'has("muestralago") && quest.b03_t_kaori == "muestra"', new: 'true', talk: [{ script: 'b03_kaori_envio' }] },
		],
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Ruta 43 -----
		r43_aquilino: { name: 'Aquilino', cls: 'Pescador', ai: 2, team: [{ sp: 'lanturn', lv: 44 }, { sp: 'gyarados', lv: 45 }],
			intro: 'Cuarenta años pescando en el lago y nunca había pescado un Gyarados. Esta semana, seis. Todos eran Magikarp cuando picaron.', win: 'Mi Gyarados era un Magikarp el martes. El martes, te lo juro. Todavía no se ha acostumbrado a tener dientes.' },
		r43_leocadia: { name: 'Leocadia', cls: 'Pokéfan', ai: 2, team: [{ sp: 'clefable', lv: 45 }, { sp: 'wigglytuff', lv: 45 }],
			intro: 'Vine a hacerme la foto del lago para mi perfil. Me ha salido un Gyarados en todas. En TODAS. ¡Combate, que necesito desahogarme!', win: 'Bueno, al menos en la foto de la derrota no sale ningún Gyarados. Solo tú. Sonriendo. Qué rabia.' },
		r43_pancracio: { name: 'Pancracio', cls: 'Pescador', ai: 3, team: [{ sp: 'quagsire', lv: 46 }, { sp: 'xatu', lv: 47 }],
			intro: 'Los Magikarp del arroyo nadan hacia el lago como si los llamaran. Mi Xatu dice que los llaman. Mi Xatu dice cosas muy raras. Luego aciertan.', win: 'Mi Xatu ya sabía que ibas a ganar. Me lo dijo esta mañana. No le hice caso. Nunca le hago caso.' },

		// ----- El peaje -----
		peaje_toni: { name: 'Toni', cls: 'Recluta Rocket', npc: 'recluta_rocket_b3', ai: 3, team: [{ sp: 'raticate', lv: 44 }, { sp: 'golbat', lv: 45 }, { sp: 'mightyena', lv: 45 }],
			intro: 'Muy bien. Tú lo has querido. Te cobro en combate. Y si pierdo, pues… pues pierdo. Pero con dignidad.',
			win: 'Ya. Ya. Sin dignidad. Pasa.' },

		// ----- Trastienda (entrenamiento, repetibles) -----
		trastienda_1: { name: 'Higinio', cls: 'Apostador', ai: 2, team: [{ sp: 'persian', lv: 44 }, { sp: 'raticate', lv: 45 }],
			intro: 'Apuesto mil a que no aguantas tres turnos. ¿No? ¿Ni a eso? Qué poca gracia.', win: 'Apuesto mil a que vuelves. Esa sí la gano.' },
		trastienda_2: { name: 'Eloísa', cls: 'Pendenciera', ai: 2, team: [{ sp: 'skuntank', lv: 45 }, { sp: 'murkrow', lv: 44 }],
			intro: 'Aquí abajo no hay árbitro. Hay una cortina. Y la cortina no pita faltas.', win: 'La cortina tampoco me ha ayudado. Inútil de cortina.' },
		trastienda_3: { name: 'Fulgencio', cls: 'Mecánico', ai: 2, team: [{ sp: 'magneton', lv: 45 }, { sp: 'electrode', lv: 46 }],
			intro: 'Yo arreglo cosas en el pueblo. Neveras, radios, antenas raras que zumban de noche. Lo de las antenas no se lo digas a nadie.', win: 'Las antenas raras pagan bien. Pero los combates pagan mejor. Y no zumban.' },

		// ----- Guarida -----
		guarida_1: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket_b3', ai: 3, team: [{ sp: 'weezing', lv: 45 }, { sp: 'hypno', lv: 45 }],
			intro: '¡La tienda está cerrada! ¡Por inventario! ¡Por inventario de… sótano! ¿Cómo has bajado? ¿Quién te ha dado la contraseña?', win: 'La contraseña… la eligió Toni. Toni solo piensa en comer. No te digo más. Ya te he dicho demasiado. Siempre digo demasiado.' },
		guarida_2: { name: 'La Tercera', cls: 'Recluta Rocket', npc: 'recluta_rocket_f', ai: 3, team: [{ sp: 'arbok', lv: 45 }, { sp: 'muk', lv: 46 }, { sp: 'golbat', lv: 45 }],
			intro: 'Tú. El pozo de Azalea. Me abriste una caja que yo ya había abierto. —Guarda la ganzúa—. Tercera en cerraduras, en códigos y en llegar a tiempo. Hoy llego tarde a todo.', win: 'El Primero dijo que vendrías. El Primero siempre acierta en lo malo.' },
		guarida_3: { name: 'La Mayor', cls: 'Recluta Rocket', npc: 'recluta_rocket_f', ai: 3, team: [{ sp: 'honchkrow', lv: 46 }, { sp: 'raticate', lv: 45 }],
			intro: 'Toma, un bocadillo. No, no está envenenado. Aquí abajo cuidamos de la gente, aunque venga a echarnos. Ahora, combate.', win: 'Quédate el bocadillo. Te va a hacer falta. Lo que hay detrás de esa puerta no se digiere bien.' },
		guarida_4: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket_b3', ai: 3, team: [{ sp: 'electrode', lv: 46 }, { sp: 'magneton', lv: 46 }, { sp: 'electrode', lv: 47 }],
			intro: '¡Ni un paso más! ¡Esta máquina es delicadísima! ¡Si la tocas, explota! ¡No, explota no! ¡Se descalibra! ¡Que es peor!', win: 'No toques los cables. Ninguno. Sobre todo el rojo. El ingeniero lo dejó escrito: «NO el rojo».' },

		// ----- Atlas (jefe de trama) -----
		atlas_1: { name: 'Atlas', cls: 'Admin Rocket', npc: 'atlas', ai: 5, iv: 27, reward: 3920, bg: 'cave',
			team: [
				{ sp: 'weezing', lv: 44, moves: ['sludgebomb', 'thunderbolt', 'willowisp', 'painsplit'], ability: 'levitate', item: 'blacksludge', nature: 'bold' },
				{ sp: 'arbok', lv: 44, moves: ['poisonjab', 'crunch', 'earthquake', 'coil'], ability: 'intimidate', item: 'poisonbarb', nature: 'adamant' },
				{ sp: 'crobat', lv: 45, moves: ['crosspoison', 'airslash', 'confuseray', 'uturn'], ability: 'innerfocus', item: 'sharpbeak', nature: 'jolly' },
				{ sp: 'weavile', lv: 45, moves: ['knockoff', 'iceshard', 'poisonjab', 'lowkick'], ability: 'pressure', item: 'blackglasses', nature: 'jolly' },
				{ sp: 'houndoom', lv: 49, moves: ['darkpulse', 'firefang', 'suckerpunch', 'thunderfang'], ability: 'flashfire', item: 'sitrusberry', nature: 'modest' },
			],
			items: [{ id: 'hyperpotion', n: 1 }, { id: 'superpotion', n: 1 }],
			intro: 'Te enseñaré lo que pasa cuando alguien toca a la familia. No es personal. Es lo único que me queda que no sea personal.',
			win: '…Protón. Atenea. Y ahora yo. —Recoge a su Houndoom sin prisa—. Por lo menos ha sido contra alguien que pelea por algo.',
			lose: 'Vete. Sube a la tienda. Cómprate un llavero. Y olvídate de lo que has visto aquí abajo, que es lo que hace todo el mundo.' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== RUTA 43 ===================
		b03_r43_entrada: [
			{ say: 'rotom', text: '¡Bzzt! Ruta 43. Al norte, el Lago de la Furia. —Pausa—. {jugador}… nada. Que aquí estoy. Por si quieres hablar. O por si no.' },
			{ text: '{riolu} camina a tu lado, más cerca que de costumbre. De vez en cuando te roza el brazo con el hombro. Como sin querer.', cond: LUC },
		],
		b03_peaje: [
			{ if: 'flag.b03_peaje_hecho', then: [{ end: true }] },
			{ text: 'Te acercas a la caseta. Dentro, dos personas con gorras negras, sin la R, pero con el hueco descosido donde estaba la R. Una come pipas. El otro, bajito y con unas orejas de soplillo que parecen asas, se pone muy recto al verte.' },
			{ say: 'recluta_rocket_b3', as: 'Recluta bajito', text: '¡Alto! Peaje de la Ruta 43. Impuesto de paso. Quinientos por persona y quinientos por… —mira a {riolu}— …por el bicho azul, que tiene cara de rico.', cond: LUC },
			{ say: 'recluta_rocket_b3', as: 'Recluta bajito', text: '¡Alto! Peaje de la Ruta 43. Impuesto de paso. Quinientos por persona y quinientos por Pokémon. Bueno, por un Pokémon. El que tenga más cara de rico.', cond: '!(' + LUC + ')' },
			{ say: 'recluta_rocket_f', as: 'Recluta de las pipas', text: 'Mil en total. Se acepta efectivo. No se acepta «¿y esto es legal?». No, no es legal. Siguiente pregunta.' },
			{ say: 'rotom', text: '¡Bzzt! He buscado «peaje Ruta 43» en el registro de Johto. Resultado: no existe. He buscado «impuesto de paso». Resultado: un cómic del año pasado. Lo he leído. Está bien.' },
			{ choice: [
				{ text: 'Pagar los ₽1000.', cond: 'money >= 1000', then: [
					{ money: -1000 },
					{ set: { 'flag.b03_peaje_pagado': true } },
					{ say: 'recluta_rocket_b3', as: 'Recluta bajito', text: '¿De verdad? ¿Pagas? —Se le ilumina la cara—. ¡Lupe, ha pagado! ¡Nadie paga nunca!' },
					{ say: 'recluta_rocket_f', as: 'Lupe', text: 'Dale el recibo, Toni. Somos una organización seria.' },
					{ text: 'Toni rebusca en los bolsillos, arranca media hoja de un papel doblado y escribe algo con un lápiz mordido. Te lo da con una reverencia.' },
					{ say: 'recluta_rocket_b3', as: 'Toni', text: 'Recibo oficial. Gracias por su contribución a la familia. Que tenga un buen día y no se lo coma un Gyarados.' },
				] },
				{ text: '«No pienso pagar. El camino es de todos.»', then: [
					{ set: { 'flag.b03_peaje_negado': true } },
					{ say: 'recluta_rocket_b3', as: 'Recluta bajito', text: '¡El camino es de todos menos de este trozo! Este trozo es… es… ¡Lupe! ¿De quién es este trozo?' },
					{ say: 'recluta_rocket_f', as: 'Lupe', text: 'Toni. Esa es la que dejó sin cocina a Atenea en Iris. —Escupe una cáscara—. Y sin pozo a Protón. Déjala pasar antes de que nos deje sin caseta.', cond: 'pron == "ella"' },
					{ say: 'recluta_rocket_f', as: 'Lupe', text: 'Toni. Ese es el que dejó sin cocina a Atenea en Iris. —Escupe una cáscara—. Y sin pozo a Protón. Déjalo pasar antes de que nos deje sin caseta.', cond: 'pron == "el"' },
					{ say: 'recluta_rocket_f', as: 'Lupe', text: 'Toni. Esa persona es la que dejó sin cocina a Atenea en Iris. —Escupe una cáscara—. Y sin pozo a Protón. Déjala pasar antes de que nos deje sin caseta.', cond: 'pron == "elle"' },
					{ say: 'recluta_rocket_b3', as: 'Toni', text: '…Ah. —Levanta la barrera muy despacio—. Pase usted. Exento. Exento por… por mérito. Que tenga un buen día.' },
					{ text: 'Al levantar la barrera se le cae del bolsillo un papel doblado. No se da cuenta. Lo recoges.' },
				] },
				{ text: 'Retarle a un combate.', then: [
					{ say: 'recluta_rocket_b3', as: 'Recluta bajito', text: '¿Un combate? ¿Contra mí? Bueno. Va. Sí. Lupe, sujétame las pipas.' },
					{ battle: 'peaje_toni', onWin: [
						{ set: { 'flag.b03_peaje_pelea': true } },
						{ say: 'recluta_rocket_f', as: 'Lupe', text: 'Te lo dije, Toni. Te dije que no te metieras con la gente que lleva un Pokémon azul con pinchos.', cond: LUC },
						{ say: 'recluta_rocket_f', as: 'Lupe', text: 'Te lo dije, Toni. Te dije que no te metieras con la gente que sonríe al pagar.', cond: '!(' + LUC + ')' },
						{ text: 'Toni levanta la barrera, abatido. Al hacerlo, se le cae del bolsillo un papel doblado. No se da cuenta. Lo recoges.' },
					] },
				] },
				{ text: '«Toni, tu madre te ha guardado arroz.»', cond: 'beat("r37_ignacio")', then: [
					{ set: { 'flag.b03_peaje_toni': true } },
					{ text: 'El recluta bajito se queda helado. Las orejas se le ponen rojas, de dentro hacia fuera.' },
					{ say: 'recluta_rocket_b3', as: 'Toni', text: '¿Cómo… cómo sabes mi nombre? ¿Cómo sabes lo del arroz?' },
					{ text: 'Le cuentas lo de su primo Ignacio, en la Ruta 37. Que te pidió que se lo dijeras si lo veías. Toni se quita la gorra. Se la vuelve a poner. Se la quita otra vez.' },
					{ say: 'recluta_rocket_b3', as: 'Toni', text: 'Ignacio es un pesado. —Se le quiebra la voz en «pesado»—. Pasa. Pasa gratis. Y… gracias.' },
					{ say: 'recluta_rocket_f', as: 'Lupe', text: 'Toni, no llores en horario de peaje.' },
					{ text: 'Al secarse los ojos con la manga, se le cae del bolsillo un papel doblado. Te lo tiende él mismo: «Dáselo a mi madre, si pasas por la Ruta 37. Yo todavía no puedo».' },
					{ rep: { johto: 2 } },
				] },
			], prompt: '¿Qué haces con el peaje?' },
			{ set: { 'flag.b03_peaje_hecho': true } },
			{ cutscene: { bg: { type: 'route', flowers: '#d9c46a', far: '#6a8a5a' }, start: 'dark', frames: [
				{ cam: 'push', item: 'cartatoni', text: 'Media hoja de cuaderno, doblada en cuatro, con manchas de grasa. Por un lado, números: cuentas de pipas y de gasolina. Por el otro, una carta a medio escribir que empieza «Querida mamá».' },
				{ actors: [{ key: '_c', do: 'turn' }], text: 'La letra es redonda y aplicada, de alguien que aprendió a escribir despacio y nunca quiso hacerlo deprisa.' },
			] } },
			{ give: 'cartatoni' },
			{ say: 'rotom', text: '¡Bzzt! Primer peaje ilegal de mi vida. —Pausa—. Ha sido raro. Pero me he reído un poco. No sé si se puede, todavía.' },
			{ text: '{riolu} te mira de reojo. Tiene la comisura de la boca un poco levantada. Casi nada.', cond: LUC },
			{ text: 'Detrás de ti, Lupe le dice a Toni que «el Primero» se va a enfadar. Toni dice que el Primero siempre está enfadado. Que por eso es el Primero.' },
		],

		// =================== LAGO DE LA FURIA ===================
		b03_lago_llegada: [
			{ set: { 'flag.b03_lago_llegada': true } },
			{ text: 'La orilla del lago. Arena gris, pinos, un muelle de madera medio hundido. Y el agua.' },
			{ cutscene: { bg: { type: 'coast', far: '#2b4a6a' }, start: 'dark', frames: [
				{ actors: [{ mon: 'magikarp', key: 'k1', at: 0.22, size: 's', enter: 'up', do: 'hop' }, { mon: 'magikarp', key: 'k2', at: 0.55, size: 's', enter: 'up', do: 'hop' }, { mon: 'magikarp', key: 'k3', at: 0.85, size: 's', enter: 'up', do: 'hop' }], fx: ['light', 'ripple'], text: 'El agua hierve. No de calor: de cuerpos. Cientos de Magikarp saltan a la vez, se retuercen en el aire, caen.' },
				{ actors: [{ key: 'k2', mon: 'gyarados', size: 'm' }], fx: 'evolve', text: 'Uno brilla en pleno salto. Un destello blanco, cegador. Cuando cae, ya no es un Magikarp.' },
				{ shake: 3, actors: [{ key: 'k1', remove: true, exit: 'down' }, { key: 'k3', remove: true, exit: 'down' }, { key: 'k2', at: 'center', size: 'l', do: 'shake', emote: 'anger' }], fx: 'shake', text: 'Un Gyarados sale del agua rugiendo, enorme, desconcertado, furioso. Muerde el aire. Muerde las olas. No sabe qué morder.' },
				{ fx: 'heartbeat', color: '#c4473a', actors: [{ key: 'k2', dim: true }], on: false, cam: 'pull', text: 'Y otro. Y otro. A lo lejos, en mitad del lago, una boya con una luz roja: tres destellos. Pausa. Tres destellos. Cada vez que parpadea, el agua salta.' },
			] } },
			{ say: 'rotom', text: '¡Bzzt! Eso no es una evolución normal. Ninguno ha subido de nivel. Mis sensores dicen que… que el agua tiene una frecuencia. Una nota grave, muy grave, por debajo de lo que oyes. Como un tambor bajo el lago.' },
			{ if: LUC, then: [
				{ text: '{riolu} se lleva las patas a la cabeza. Los apéndices de detrás de las orejas le tiemblan. Gruñe bajito, con los ojos apretados, como quien soporta un pitido que nadie más oye.' },
			] },
			{ text: 'Una sombra cruza la arena. Algo enorme aterriza a tu lado, levantando una nube de polvo gris: un **Dragonite**, con un hombre de capa negra y pelo rojo en punta sobre el lomo.' },
			{ say: 'lance', text: 'No te acerques al agua. —Baja de un salto. La capa ondea sola, como si tuviera su propio viento—. Esos Gyarados no están enfadados contigo. Están enfadados con todo. Y tú eres lo que tienen más cerca.' },
			{ say: 'lance', text: 'Me llamo Lance. Entreno dragones. —Te mira de arriba abajo; mira a {riolu} un segundo más—. Tú eres de la Gira. Tienes cara de haber visto cosas que no salen en los folletos.', cond: LUC },
			{ say: 'lance', text: 'Me llamo Lance. Entreno dragones. —Te mira de arriba abajo—. Tú eres de la Gira. Tienes cara de haber visto cosas que no salen en los folletos.', cond: '!(' + LUC + ')' },
			{ choice: [
				{ text: '«¿Usted sabe qué les pasa?»', then: [
					{ say: 'lance', text: 'Sé que no es natural. Llevo tres días siguiendo una señal de radio que no está en ninguna frecuencia autorizada. Empieza aquí. Y termina en algún sitio del sur.' },
				] },
				{ text: '«¿El Lance de los dragones? ¿El de la Liga?»', then: [
					{ say: 'lance', text: 'El de los dragones. Lo de la Liga va y viene. Los dragones se quedan. —Casi sonríe. Casi—. Y hoy no he venido a firmar autógrafos.' },
				] },
				{ text: 'Mirar la boya roja.', then: [
					{ say: 'lance', text: 'Tú también la has visto. Bien. Tres destellos, una pausa. Es lo único en todo este lago que no está furioso. Por eso no me fío de ella.' },
				] },
			] },
			{ text: 'Un rugido distinto a todos los demás. Más grave. Más largo. Los Gyarados del lago se apartan, de golpe, como peces pequeños ante un pez grande.' },
			{ cutscene: { time: 'dia', bg: { type: 'coast', far: '#2b4a6a' }, start: 'dark', frames: [
				{ fx: 'ripple', cam: 'still', text: 'Algo sube desde el fondo. Una sombra larguísima bajo el agua oscura.' },
				{ shake: 3, actors: [{ mon: 'gyarados', shiny: true, key: 'rojo', at: 'center', size: 'l' }], fx: ['shake', 'rise', 'light'], text: 'Sale del lago en un arco enorme, chorreando, y la luz del sol le arranca un brillo imposible.' },
				{ color: '#e8503a', cam: 'push', fx: 'glow', text: 'Es un **Gyarados**. Pero no es azul. Es **rojo**. Rojo como un buzón, como una brasa, como una herida.' },
				{ fx: 'ripple', shake: 2, actors: [{ key: 'rojo', do: 'step', emote: 'anger' }], text: 'Cae a diez metros de la orilla. La ola te moja hasta las rodillas. Te mira. Tiene los ojos en blanco de rabia.' },
			] } },
			{ say: 'lance', text: 'Ese es el primero que cambió. Y el que peor lo lleva. Si sigue así, se va a romper por dentro. —Se coloca a tu lado; no delante: a tu lado—. Mi Dragonite podría con él. Pero le haría daño de verdad.' },
			{ say: 'lance', text: 'Tú lo harás mejor. Agótalo. Cálmalo. Atrápalo, si puedes; en una Poké Ball dejará de oír la señal. Y, sobre todo, no huyas. Si huyes, se queda solo con eso en la cabeza.' },
			{ text: 'Lance le pide a su Dragonite que reparta un poco de algo cálido entre tus Pokémon. No sabes qué es. Funciona.' },
			{ heal: true },
			{ wild: { sp: 'gyarados', lv: 47, shiny: true, moves: ['aquatail', 'crunch', 'icefang', 'scaryface'], ability: 'intimidate', nature: 'adamant', minIVs: 20 }, canRun: true,
				onCatch: [
					{ set: { 'flag.b03_gyarados_rojo': true, 'flag.b03_gyarados_atrapado': true } },
					{ text: 'La Poké Ball se sacude una vez. Dos. Tres. Se queda quieta. En el lago, durante un segundo, los rugidos se callan.' },
					{ say: 'lance', text: '…Bien. Muy bien. Dentro de la Ball no la oye. Ya no tiene que estar furioso. —Mira la Ball en tu mano con un respeto raro—. Cuídalo. Un Gyarados así no se ve dos veces en una vida.' },
				],
				onWin: [
					{ set: { 'flag.b03_gyarados_rojo': true, 'flag.b03_gyarados_calmado': true } },
					{ text: 'El Gyarados rojo se derrumba en los bajíos. Respira hondo, muy hondo. Los ojos dejan de estar en blanco. Te mira, y esta vez te ve.' },
					{ text: 'Luego se hunde despacio en el agua oscura y se aleja, sin rugir. Lento. Cansado. Libre.' },
					{ say: 'lance', text: 'Así también se vale. Lo has dejado tan cansado que no le quedan fuerzas para la rabia. A veces es la única manera.' },
				],
				onRun: [
					{ set: { 'flag.b03_gyarados_rojo': true, 'flag.b03_gyarados_huido': true } },
					{ text: 'Retrocedes. El Gyarados rojo ruge una vez más y se hunde en el lago. Su sombra se aleja hacia el centro, hacia la boya.' },
					{ say: 'lance', text: '…Hay días en los que lo más valiente es apartarse. —No suena a reproche. Casi—. Lo arreglaremos de otra manera. Desde la raíz.' },
				],
				onLose: [
					{ set: { 'flag.b03_gyarados_rojo': true, 'flag.b03_gyarados_huido': true } },
					{ text: 'Tus Pokémon caen uno tras otro. El Gyarados rojo ruge sobre ti, enorme… y, de pronto, se detiene. Mira la boya. Se hunde en el lago y desaparece.' },
					{ say: 'lance', text: '¡Dragonite! —El dragón se pone delante de ti, con las alas abiertas—. Tranquil{o|a|e}. Ya se ha ido. No era contra ti. Nunca lo ha sido.' },
					{ heal: true },
				],
			},
			{ text: 'Entre las piedras de la orilla, donde cayó el Gyarados rojo, algo brilla. Una escama, grande como la palma de tu mano. Roja.' },
			{ give: 'redscale' },
			{ text: 'Lance mira la boya roja. Saca una Poké Ball. Un **Gyarados** —azul, tranquilo, enorme— sale al agua, y Lance salta a su lomo con la capa al viento.' },
			{ text: 'Vuelve a los pocos minutos con algo en la mano: un cilindro de metal del tamaño de un termo, con una antena y una lucecita roja. La lucecita sigue parpadeando. Tres. Pausa. Tres.' },
			{ say: 'lance', text: 'Esto no emite. Repite. Es un altavoz. La señal viene de otro sitio y esto solo la mete en el agua. —Le da la vuelta. En la base, una pegatina medio despegada: «Prop. de Caramelos Furia Caoba S. L.»—. Caoba.' },
			{ say: 'lance', text: 'Hay una tienda de recuerdos en Pueblo Caoba que vende caramelos con ese nombre. Desde hace tres años. Y nunca ha tenido un solo cliente que repita. —Te mira—. Voy para allá. ¿Vienes conmigo?' },
			{ choice: [
				{ text: '«Voy con usted.»', then: [
					{ say: 'lance', text: 'Bien. Nos vemos en la tienda. Yo voy por el aire; tú, por el camino. Si llegas antes, no entres sol{o|a|e}.' },
				] },
				{ text: '«¿Por qué yo?»', then: [
					{ say: 'lance', text: 'Porque has llegado hasta aquí sin que nadie te llamara. Esa gente es la que me interesa. —Sube a su Dragonite—. Y porque tu compañero ha oído la señal antes que tu Pokédex. Eso no lo enseña nadie.', cond: LUC },
					{ say: 'lance', text: 'Porque has llegado hasta aquí sin que nadie te llamara. Esa gente es la que me interesa.', cond: '!(' + LUC + ')' },
				] },
			] },
			{ quest: 'b03_m6', stage: 'guarida' },
			{ diary: 'Hoy mi entrenador{|a|e} y yo vimos un Gyarados ROJO. ¡Rojo de verdad, como una fresa enorme y enfadada! Salió del lago dando un salto tan alto que tapó el sol.\n\nEl lago estaba muy alborotado y los Magikarp saltaban por todas partes. También conocimos a un señor con capa y un Dragonite muy educado que nos regaló un calorcito. ¡Las capas están infravaloradas!\n\nEncontramos una escama roja en la orilla. La he puesto en la carpeta de «cosas bonitas». Es la carpeta más grande que tengo.', cond: 'flag.b01_diario' },
		],
		b03_gyarados_recuerdo: [
			{ if: 'flag.b03_gyarados_atrapado', then: [
				{ text: 'Las piedras donde cayó el Gyarados rojo. El agua ya no hierve aquí. En tu equipo, o en la caja, una Poké Ball se sacude un poco cada vez que pasas por este sitio. Como quien saluda a su casa.' },
			], else: [
				{ text: 'Las piedras donde cayó el Gyarados rojo. A veces, a lo lejos, en mitad del lago, asoma una cresta roja. Se queda mirando un rato. Luego se hunde.' },
			] },
		],
		b03_muestra_lago: [
			{ set: { 'flag.b03_muestra_tomada': true } },
			{ text: 'Te agachas en la orilla con el frasquito que te dio Kaori. El agua está tibia. Demasiado tibia para un lago de montaña.' },
			{ cutscene: { bg: { type: 'coast', far: '#2b4a6a' }, start: 'dark', frames: [
				{ cam: 'still', text: 'Llenas el frasco hasta la marca. Lo tapas. Lo levantas a contraluz.' },
				{ color: '#8fd0ff', cam: 'push', item: 'muestralago', fx: 'glow', text: 'El agua es oscura, con motitas que brillan muy poco. Cuando la boya del lago parpadea, las motitas del frasco parpadean con ella. Tres. Pausa. Tres.' },
			] } },
			{ give: 'muestralago' },
			{ say: 'rotom', text: '¡Bzzt! Kaori querrá esto cuanto antes. En el Centro Pokémon de Caoba hay mostrador de envíos.' },
		],
		b03_az_huellas: [
			{ text: 'Huellas en la arena. Enormes. Más largas que tu antebrazo. Van desde los pinos hasta el agua y allí se acaban, como si quien las dejó hubiera seguido andando por encima del lago.' },
			{ text: 'Junto a la última huella, un pétalo rojo. No se ha marchitado.' },
			{ choice: [
				{ text: 'Esperar a que anochezca.', then: [
					{ text: 'Te sientas en un tronco caído. El sol baja detrás de los pinos. El lago se pone gris, luego negro. Los rugidos siguen.' },
					{ call: 'b03_az' },
				] },
				{ text: 'Dejarlo por ahora.', then: [{ text: 'Las huellas se quedan ahí. Tienes la sensación de que volverán a estar ahí cuando vuelvas.' }] },
			] },
		],
		b03_az: [
			{ set: { 'flag.b03_az': true } },
			{ quest: 'b02_t_az', done: true, silent: true },
			{ text: 'En la orilla, de pie, con el agua hasta los tobillos, un hombre tan alto que los pinos parecen de su tamaño. El pelo blanco, larguísimo. La ropa oscura, gastada. En el hombro, la Floette de la flor roja.' },
			{ text: 'No sabes cómo ha llegado a Johto. No te lo va a decir. Lo sabes antes de preguntar.' },
			{ text: 'Un Gyarados ruge muy cerca. El hombre no se mueve. La Floette se esconde detrás de su cuello.' },
			{ if: LUC, then: [
				{ text: '{riolu} se pone a su lado, mirando el agua. Los dos igual de quietos. La Floette asoma un poco, mira a {riolu}, y esta vez no se esconde.' },
				{ happy: { who: 'riolu', n: 3 } },
			] },
			{ say: 'az', text: 'Los obligan a crecer de golpe. —Su voz es lenta, como si cada palabra hubiera tenido que cruzar mucha distancia—. Ya te lo dije una vez. Lo que crece deprisa asusta. A ellos los primeros.' },
			{ choice: [
				{ text: '«¿Sabe quién lo hace?»', then: [
					{ say: 'az', text: 'Sé cómo. El quién cambia. Siempre cambia. El cómo, nunca.' },
				] },
				{ text: '«¿Cómo ha llegado hasta aquí?»', then: [
					{ say: 'az', text: 'Andando. —Lo dice muy en serio—. He tenido tiempo.' },
				] },
				{ text: 'Quedarte a su lado, mirando el lago.', then: [
					{ text: 'Se quedan los dos mirando el agua. Los rugidos, la luna partida, la boya roja. Al cabo de un rato, la Floette se duerme.' },
				] },
			] },
			{ say: 'az', text: 'Esa señal le promete a cada Magikarp una fuerza que no se acaba. Escúchame bien: la energía que no se acaba siempre es la de otro.' },
			{ say: 'az', text: 'Siempre.' },
			{ text: 'Se da la vuelta y camina hacia los pinos, sin prisa. Cuando miras otra vez, ya no está. Las huellas, sí.' },
			{ say: 'rotom', text: '¡Bzzt! Nada. Ni foto, ni ficha, ni medidas. —Pausa—. Es la tercera vez que no sale en ningún sitio. Empiezo a pensar que no es un fallo mío.' },
		],
		b03_ulises: [
			{ set: { 'flag.b03_ulises_lago': true } },
			{ quest: 'b02_t_cabina', done: true, silent: true },
			{ text: 'Entre dos pinos, una cabina de madera azul, con un farolillo encima y ventanitas. Respira: un ruido de acordeón tomando aire, que se apaga en un resoplido.' },
			{ text: 'La puerta se abre de golpe. Sale un hombre de rizos castaños y abrigo granate, y detrás de él sale una bufanda de rayas. Y sigue saliendo. Y sigue.' },
			{ say: 'viajero', text: '¡{jugador}! ¡Aquí! ¡Ahora! ¿Qué día es? No me lo digas. Martes. —Se para en seco—. No es martes. El agua dice que no es martes. El agua está diciendo muchas cosas hoy y ninguna buena.' },
			{ say: 'viajero', text: 'Esa nota. ¿La oyes? No, tú no la oyes. Tu amigo de las orejas sí. —Se agacha delante de {riolu}—. Duele, ¿verdad? A mí también. Es como un diente que te llama por teléfono.', cond: LUC },
			{ say: 'viajero', text: 'Esa nota. ¿La oyes? No, tú no la oyes. Yo sí. Es como un diente que te llama por teléfono.', cond: '!(' + LUC + ')' },
			{ say: 'viajero', text: 'El pequeñito. Lo que late a destiempo. Lo estaba encontrando, ¿sabes? Casi. Le iba siguiendo el tic y el tac. Y entonces alguien ha puesto un tambor debajo de un lago y el pequeñito se ha asustado y se ha escondido. Cuando se asusta, el tiempo se le escapa por las costuras.' },
			{ if: 'has("ambarsinregistro")', then: [
				{ text: 'En tu mochila, el **Ámbar sin registro** está tibio. Más que nunca. El brillo azul de dentro late deprisa, desacompasado, como un pájaro asustado.' },
				{ say: 'viajero', text: '¿Ves? Él también lo nota. Los dos se conocen. Bueno, se conocerán. Se conocieron. Odio los tiempos verbales.' },
			] },
			{ text: 'Por un momento, Ulises deja de moverse. Se queda mirando el lago, muy serio, y parece mucho más viejo de lo que es.' },
			{ say: 'viajero', text: 'Hay cosas que se despiertan cuando las llamas a gritos. Y no todas vuelven a dormirse.' },
			{ say: 'viajero', text: '…Eso no lo he dicho. Olvídalo. ¡Me voy! ¡Tengo que llegar antes de que me vaya!' },
			{ text: 'Se mete en la cabina. La bufanda tarda un poco más. Ruido de acordeón respirando hondo. Cuando se apaga, solo queda un cuadrado de arena seca entre los pinos.' },
			{ intel: { npc: 'viajero', text: 'En el Lago de la Furia: la señal asustó a «lo pequeñito que late a destiempo» y se escondió. «Cuando se asusta, el tiempo se le escapa por las costuras». El ámbar de Petra reacciona.' } },
		],

		// =================== CAOBA: KAORI ===================
		b03_kaori_envio: [
			{ if: '!has("muestralago") || quest.b03_t_kaori != "muestra"', then: [{ end: true }] },
			{ text: 'En el Centro Pokémon de Caoba hay un mostrador de envíos con un Pelipper dormido encima. Metes el frasco en una caja acolchada y escribes la dirección: «Botica del Teatro de Danza · Kaori».' },
			{ take: 'muestralago' },
			{ text: 'El Pelipper se despierta, mira la caja con desconfianza, se la mete en el pico y sale volando. Tarda menos de una hora en llegar la respuesta.' },
			{ say: 'kaori', as: 'Kaori (mensaje)', text: 'Recibido. Agua de lago con partículas en suspensión. Las partículas vibran. Solas. Sin que nadie las toque.' },
			{ say: 'kaori', as: 'Kaori (mensaje)', text: 'Oh. Esto es… precioso. Horrible, pero precioso. Es lo mismo que el polvo del sótano de Iris, pero despierto. Alguien ha encontrado la manera de que el cansancio de otros se mueva por el agua.' },
			{ say: 'kaori', as: 'Kaori (mensaje)', text: 'Con esto el antídoto da un paso. Uno. Pequeño. No me felicites, que no he terminado. —Una pausa larga en el mensaje—. Gracias. Me has ahorrado ir yo. Odio los lagos. Tienen demasiada agua.' },
			{ say: 'kaori', as: 'Kaori (mensaje)', text: 'Te mando dos cosas para tu equipo. No son veneno. Las he probado yo. Sigo viva.' },
			{ give: 'fullheal', n: 2 },
			{ af: { kaori: 5 } },
			{ quest: 'b03_t_kaori', stage: 'abierto', done: true },
		],

		// =================== LA TIENDA DE RECUERDOS ===================
		b03_dependiente: [
			{ if: M6_GUARIDA, then: [
				{ say: 'dependiente_caoba', text: '¡Bienvenid{o|a|e}! ¿Un llavero? ¿Una taza? ¿Un Caramelo Furia? Receta tradicional. Muy tradicional. Tan tradicional que no la sé ni yo.' },
				{ text: 'Mientras habla, sus ojos se van, una y otra vez, hacia una de las estatuas de Persian. Y vuelven. Y se van.' },
			], else: [
				{ say: 'dependiente_caoba', text: '¡Bienvenid{o|a|e} a la tienda de recuerdos de Caoba! Llaveros, tazas, gorras y nuestros famosos Caramelos Furia. ¿La trastienda? Ah, ahí se juntan unos amigos a echar combates. Muy sanos. Totalmente sanos.' },
			] },
		],
		b03_dependiente_despues: [
			{ say: 'dependiente_caoba', text: 'Seis letras, «lo que se queda cuando todo se va». —No levanta la vista del crucigrama—. Sí, ya sé que hay una escalera ahí detrás. La tienda sigue abierta. Los llaveros no tienen la culpa de nada.' },
		],
		b03_tienda_puzle: [
			{ if: '!flag.b03_tienda_lance', then: [
				{ set: { 'flag.b03_tienda_lance': true } },
				{ text: 'Lance ya está dentro, mirando una taza del lago como quien mira una prueba de un crimen. Al verte, la deja en la estantería sin hacer ruido.' },
				{ say: 'lance', text: 'Llegas a tiempo. Mira a tu alrededor y dime qué ves. Despacio.' },
				{ say: 'rotom', text: '¡Bzzt! Veo llaveros, tazas, gorras, caramelos, dos estatuas de Persian y un dependiente que suda. —Pausa—. Y cero clientes. En una tienda de recuerdos. En temporada alta. Esto es un caso con forma de donut, {jugador}: todo encaja alrededor de un agujero.' },
				{ say: 'lance', text: 'Exacto. El agujero. Hay un sitio en esta tienda donde lleva años sin limpiarse el polvo, y un sitio donde nunca hay polvo. Encuéntralo.' },
			] },
			{ choice: [
				{ text: 'Mirar la caja registradora.', cond: '!flag.b03_puzle_caja', then: [
					{ set: { 'flag.b03_puzle_caja': true } },
					{ text: 'Abres la caja registradora. Dentro hay tres monedas, un botón y una nota: «Esto no es la entrada secreta. Buen intento». La ha escrito alguien con mucho sentido del humor o con muy poca imaginación.' },
					{ say: 'rotom', text: '¡Bzzt! Ni un solo recibo en tres años. —Pausa—. Ni uno. Esto también es una pista, ¿no? Me la apunto.' },
					{ call: 'b03_tienda_puzle' },
				] },
				{ text: 'Mirar el póster del lago.', cond: '!flag.b03_puzle_poster', then: [
					{ set: { 'flag.b03_puzle_poster': true } },
					{ text: 'Levantas el póster. Detrás hay una pared. Con un póster más pequeño del mismo lago. Y detrás de ese, otra pared.' },
					{ say: 'lance', text: 'Fíjate en el suelo. No en las paredes.' },
					{ call: 'b03_tienda_puzle' },
				] },
				{ text: 'Mirar el suelo bajo las estatuas de Persian.', then: [
					{ text: 'Te agachas. Bajo la estatua de la izquierda hay un cerco de polvo gris, gordo, de años. Bajo la de la derecha, nada. El suelo está limpio. Y tiene dos arañazos en curva, como el rastro de algo pesado que gira.' },
					{ text: 'Empujas la estatua de la derecha. No pesa nada. Gira sobre sí misma con un chasquido, y donde estaba aparece un hueco cuadrado y una escalera que baja a oscuras.' },
					{ say: 'dependiente_caoba', text: '…Eso es un… desagüe. Muy grande. Con escalera. Para… bajar al desagüe.' },
					{ say: 'lance', text: 'Siéntese. —El dependiente se sienta—. Gracias.' },
					{ set: { 'flag.b03_guarida_abierta': true } },
				] },
			], prompt: '¿Dónde está el agujero del donut?' },
		],

		// =================== GUARIDA ROCKET ===================
		b03_guarida_llegada: [
			{ set: { 'flag.b03_guarida_llegada': true } },
			{ text: 'Abajo, un pasillo de hormigón. Tubos fluorescentes. Huele a humedad, a ozono y a café recalentado. Desde el fondo llega un zumbido grave: tres veces, pausa, tres veces.' },
			{ text: 'En las paredes, fotos enmarcadas. Decenas de reclutas, con el uniforme nuevo, sonriendo a la cámara. Una barbacoa. Un cumpleaños con tarta y una R de nata. Una boda. Todas de hace muchos años.' },
			{ say: 'lance', text: 'Una guarida que tiene fotos de bodas. —Lo dice muy bajo—. No es lo que esperaba.' },
			{ say: 'lance', text: 'Yo me quedo arriba un momento: alguien tiene que vigilar que el dependiente no avise a nadie. Abre camino. En cuanto haya una puerta que no se pueda abrir, llámame. Esas se me dan bien.' },
			{ text: 'Al fondo del pasillo, dos estatuas de Persian idénticas a las de la tienda, con los ojos de cristal encendidos en rojo. Entre ellas, un interfono. Delante, un recluta con un Weezing.' },
		],
		b03_contrasena: [
			{ if: 'flag.b03_contrasena', then: [{ end: true }] },
			{ text: 'Pulsas el botón del interfono. Los ojos de las estatuas de Persian se vuelven hacia ti con un zumbido. Una voz metálica, grabada: «Contraseña».' },
			{ choice: [
				{ text: '«Familia.»', cond: '!flag.b03_pass_familia', then: [
					{ set: { 'flag.b03_pass_familia': true } },
					{ text: '«Contraseña incorrecta». Los ojos de las estatuas parpadean. Por los altavoces suena, muy alto, un trocito de música de ascensor y luego una voz grabada, cansada: «La cambiamos después de lo de Iris. No somos tan previsibles». Pausa. «Bueno, un poco».' },
					{ say: 'rotom', text: '¡Bzzt! Me han citado. Indirectamente. Me hace ilusión y me ofende a la vez.' },
					{ call: 'b03_contrasena' },
				] },
				{ text: '«Giovanni.»', cond: '!flag.b03_pass_giovanni', then: [
					{ set: { 'flag.b03_pass_giovanni': true } },
					{ text: '«Contraseña incorrecta». Silencio. Luego, la misma voz grabada, más baja: «Ese nombre ya no abre nada aquí abajo».' },
					{ call: 'b03_contrasena' },
				] },
				{ text: '«Arroz con leche.»', then: [
					{ text: 'Un chasquido. Los ojos de las estatuas se apagan. La voz grabada dice: «Bienvenido a casa». Y luego, en voz de Toni, muy bajito, como si se le hubiera olvidado borrarlo: «…con canela por encima, mamá, que se te olvida».' },
					{ set: { 'flag.b03_contrasena': true } },
				] },
			], prompt: 'Toni solo piensa en comer…' },
		],
		b03_puerta_cerrada: [
			{ text: 'Una puerta de acero, gruesa como un colchón, con una rueda de submarino en el centro. No se mueve. Antes habrá que ocuparse de las dos reclutas del pasillo.' },
		],
		b03_puerta: [
			{ if: PUERTA_OK, then: [{ end: true }] },
			{ text: 'La puerta de acero no se mueve ni un milímetro. Detrás, el zumbido: tres veces, pausa, tres veces. Más fuerte aquí.' },
			{ say: 'rotom', text: '¡Bzzt! Cerradura de seis cilindros, acero de veinte centímetros y una pegatina que dice «NO EMPUJAR». Creo que es la hora de llamar a alguien con un dragón.' },
			{ text: 'No hace falta. Pasos en el pasillo. Lance, con la capa ondeando aunque aquí abajo no corre el aire.' },
			{ say: 'lance', text: 'Apártate. Un poco más. —Lanza una Poké Ball—. Dragonite. **Hiperrayo**.' },
			{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#c4473a' }, start: 'dark', frames: [
				{ actors: [{ id: 'lance', at: 'left', dim: true }, { mon: 'dragonite', at: 0.7, enter: 'pop' }], fx: 'glow', color: '#ffffff', text: 'El Dragonite abre la boca. Dentro se enciende una luz blanca, cada vez más fuerte, hasta que el pasillo entero se queda sin sombras.' },
				{ shake: 2, fx: ['flash', 'speedlines'], text: 'El rayo golpea el centro de la puerta.' },
				{ shake: 3, weather: 'dust', on: false, fx: ['impact', 'quake'], text: 'El acero se dobla hacia dentro como una hoja de papel mojada, se arranca de los goznes y cae al otro lado con un estruendo que hace temblar las fotos de las paredes.' },
				{ weather: 'none', cam: 'still', actors: [{ key: 'dragonite', remove: true, exit: 'fade' }, { key: 'lance', dim: false }], text: 'Una foto de boda se descuelga y cae boca abajo. Lance la recoge y la vuelve a colgar. Recta.' },
			] } },
			{ set: { 'flag.b03_puerta_rota': true } },
			{ say: 'lance', text: 'Eso hará que vengan todos. Mejor: no me gusta buscar. —Se queda en el umbral—. Yo vigilo el pasillo. Si necesitas que tu equipo descanse, aquí estoy.' },
		],
		b03_lance_descanso: [
			{ text: 'Lance, apoyado en el marco de la puerta destrozada, deja que su Dragonite se acerque a tu equipo. Un calor suave, como de piedra al sol.' },
			{ heal: true },
			{ say: 'lance', text: 'Respira. Aquí abajo todo el mundo tiene prisa. Tú no la tengas.' },
		],
		b03_jaulas: [
			{ set: { 'flag.b03_jaulas_vistas': true } },
			{ text: 'Una fila de tanques de cristal llenos de agua turbia. Dentro, Gyarados. Pequeños para ser Gyarados, encogidos, con las escamas desvaídas. No se mueven. Los ojos abiertos, sin mirar nada.' },
			{ text: 'Al lado, jaulas: un Magikarp en cada una, en un palmo de agua. Tampoco se mueven. Ni siquiera saltan, y un Magikarp siempre salta.' },
			{ say: 'rotom', text: '¡Bzzt! Constantes vitales: muy bajas. Las etiquetas dicen «Sujeto 9 · tras la excitación», «Sujeto 10 · tras la excitación»… —Pausa—. Primero los obligan a evolucionar. Luego se apagan. Como si hubieran gastado de golpe algo que tenía que durarles toda la vida.' },
			{ text: '{riolu} pone una pata en el cristal de un tanque. El Gyarados de dentro no reacciona. {riolu} deja la pata ahí un rato largo.', cond: LUC },
		],
		b03_jaulas_despues: [
			{ text: 'Los tanques están vacíos. Las jaulas, abiertas. Alguien ha dejado un cubo con agua limpia en el suelo, por si acaso.' },
		],
		b03_maquina: [
			{ set: { 'flag.b03_maquina_vista': true } },
			{ text: 'La máquina ocupa media sala: armarios de metal, cables gordos como brazos y, en el centro, un cilindro de cristal donde gira algo azul y brillante. Cada pocos segundos, el cilindro se ilumina. Tres veces. Pausa. Tres veces.' },
			{ text: 'Del techo bajan cables hacia una antena que atraviesa el hormigón. Y en el panel de control, sobre la mesa, hay una impresora que no para de escupir hojas: columnas y columnas de números.' },
			{ say: 'rotom', text: '¡Bzzt! Ese brillo azul… es el mismo que el del polvo del sótano de Iris. El de los Caramelos Lazo. Pero aquí no está en sacos. Está… funcionando.' },
			{ cutscene: { bg: { type: 'lab' }, start: 'dark', frames: [
				{ cam: 'still', text: 'Arrancas las hojas de la impresora. Están calientes.' },
				{ cam: 'push', item: 'registroondas', fx: 'glow', text: 'Columnas de números. Horas, frecuencias, «sujetos». Fechas de las últimas tres semanas. Y, al pie de cada hoja, la misma firma, con tinta azul: una sola letra.' },
				{ color: '#1f4a9a', actors: [{ key: '_c', size: 'l' }], fx: ['zoom', 'heartbeat'], text: '**M.**' },
			] } },
			{ give: 'registroondas' },
			{ quest: 'b03_t_ondas', stage: 'senal' },
			{ text: 'Lees la primera hoja. La cabecera dice: «Prueba de campo · Fase de excitación · Encargo y financiación: **Fundación Raíces de Johto**». Y debajo, en letra pequeña: «Objetivo: medir la respuesta de la fauna a la frecuencia de arranque del nodo».' },
			{ if: 'flag.b03_nodo02', then: [
				{ say: 'rotom', text: '¡Bzzt! «Del nodo». Nodo. Como en Nodo 02. —Pausa larga—. Las Ruinas Alfa. Esto era un ensayo. Un ensayo de lo que piensan encender allí.' },
			], else: [
				{ say: 'rotom', text: '¡Bzzt! «Frecuencia de arranque del nodo». No sé qué nodo. Pero no me gusta cómo suena «arranque».' },
			] },
			{ text: 'La firma. «M.» Una M grande, con el palo de la izquierda muy largo, como quien está acostumbrado a firmar planos.' },
			{ if: 'flag.b03_renata_publica || flag.b03_renata_espera || has("planoprototipo")', then: [
				{ say: 'rotom', text: '…¿M de Matías? ¿Matías Olmedo? ¿El ingeniero del sótano de Trigal? —Pausa—. Pero desapareció hace doce años. Y esto es de la semana pasada.' },
				{ if: 'has("planoprototipo")', then: [
					{ text: 'Sacas el plano del prototipo del sótano de Trigal y comparas las firmas. Se parecen. O no. La M del plano es más redonda. ¿O es que el papel es más viejo? Cuanto más las miras, menos sabes.' },
				] },
			], else: [
				{ say: 'rotom', text: '¡Bzzt! M. Solo M. Hay millones de personas que empiezan por M. Mi lista tiene… bueno, muchas. Ninguna me cuadra.' },
			] },
			{ text: 'Junto al panel, colgada de un gancho, una pinza de metal con cables, del tamaño de una pinza de la ropa. Lleva una pegatina: «NO TOCAR (en serio)». Debajo, a mano, la misma letra de las hojas: «Si sale mal: en el cable azul. NO en el rojo. — M.».' },
			{ text: 'Antes de que puedas agarrarla, oyes una puerta al otro lado de la máquina. Una puerta que no habías visto. Y pasos tranquilos. Muy tranquilos.' },
		],
		b03_maquina_otra_vez: [
			{ text: 'La máquina sigue zumbando. Tres veces. Pausa. Tres veces. La pinza sigue en su gancho. Al otro lado, alguien espera sin ninguna prisa.' },
		],
		b03_maquina_despues: [
			{ text: 'La máquina está muda. El cilindro de cristal ya no gira; el brillo azul de dentro se ha posado en el fondo, como arena en un vaso. La antena del techo ya no zumba.' },
		],
		b03_atlas: [
			{ if: 'flag.b03_atlas_visto', then: [
				{ say: 'atlas', text: 'Otra vez tú. Bien. —Sigue con las manos a la espalda, junto a la máquina—. Aquí sigo. La máquina, también.' },
				{ heal: 'Lance deja que su Dragonite reparta su calor entre tu equipo. Atlas espera. Es de los que esperan.' },
				{ battle: 'atlas_1', onWin: [{ call: 'b03_atlas_despues' }], onLose: [
					{ say: 'atlas', text: 'Todavía no. Respira. Yo no me voy a ninguna parte.' },
					{ heal: true },
				] },
				{ end: true },
			] },
			{ set: { 'flag.b03_atlas_visto': true } },
			{ text: 'Al otro lado de la máquina hay un hombre de pie, con las manos a la espalda, mirando el cilindro azul como quien mira una chimenea.' },
			{ text: 'Pelo azul peinado hacia atrás. Traje blanco impecable, con una **R** pequeña en la solapa. No lleva gorra. No la necesita.' },
			{ say: 'atlas', text: 'Protón en Azalea. Atenea en Iris. Y ahora, aquí. —No se gira—. Siempre tú. He visto tu cara en tantos informes que empezaba a pensar que eras una leyenda urbana.' },
			{ say: 'atlas', text: 'Atlas. Admin del Team Rocket. O de lo que queda. —Se gira—. Los chicos me llaman «el Primero». No porque mande. Porque fui el primero en quedarse.' },
			{ choice: [
				{ text: '«Esos Magikarp no aguantan más.»', then: [
					{ say: 'atlas', text: 'Lo sé. Lo leo cada mañana en esas hojas. Sujeto nueve. Sujeto diez. —Se encoge de hombros—. Y cada mañana pago con eso el alquiler de dos chicos que se quedaron sin casa cuando Giovanni se fue. Elige tú qué columna te duele más.' },
				] },
				{ text: '«¿Quién es M.?»', then: [
					{ say: 'atlas', text: 'Un ingeniero que no baja nunca. Manda los planos, manda las piezas, manda instrucciones muy educadas. Firma con una letra. —Sonríe apenas—. Yo tampoco le he visto la cara. Así funciona esta gente: tú pones las manos, ellos ponen la letra.' },
				] },
				{ text: '«Le están usando. Igual que a Atenea.»', then: [
					{ say: 'atlas', text: 'Claro que nos usan. Todo el mundo usa a todo el mundo. La diferencia es que yo sé cuánto cobro. —Pausa—. ¿Tú sabes cuánto cobras tú?' },
				] },
			] },
			{ say: 'atlas', text: 'Doscientos doce. Protón se sabía los nombres. Yo me sé las deudas. Cuando la Liga detuvo a los de arriba, nadie vino a por los de abajo. Una fundación muy generosa sí vino. Pagaba bien. No hacía preguntas. Yo tampoco.' },
			{ say: 'atlas', text: 'Y ahora vienes tú, y detrás de ti, el de la capa. Y mañana mis chicos vuelven a la calle. —Saca una Poké Ball—. No. Hoy no.' },
			{ text: 'Un Houndoom aparece a su lado con un gruñido que hace temblar los cristales de los tanques. Atlas no lo mira. Señala con la barbilla el último tanque de la fila, el único con un Magikarp que todavía se mueve un poco.' },
			{ say: 'atlas', text: 'Houndoom. Ese ya no sirve para la prueba. Que no haga sufrir a nadie.' },
			{ if: LUC, then: [
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#c4473a' }, start: 'dark', frames: [
					{ actors: [{ mon: 'houndoom', at: 0.78, enter: 'none', flip: true }], weather: 'embers', fx: 'glow', color: '#ff7a2a', text: 'El Houndoom abre las fauces hacia el tanque. Dentro se enciende el fuego.' },
					{ actors: [{ mon: '{riolu}', key: 'rio', at: 0.4, enter: 'left' }], fx: ['flash', 'speedlines'], text: 'Y {riolu} ya no está a tu lado. Está delante del tanque, con los brazos abiertos.' },
					{ on: 'rio', shake: 2, fx: ['aura', 'impact'], text: 'El Lanzallamas le da de lleno. Pero no llega al cristal. Se abre a su alrededor, partido en dos por un halo azul, firme, que le sale del pecho como una vela que no se apaga con el viento.' },
					{ weather: 'none', actors: [{ mon: 'magikarp', key: 'karp', at: 0.12, size: 's', enter: 'up', do: 'hop' }], text: 'Detrás de él, en el tanque, el Magikarp levanta la cabeza. Por primera vez en días, salta. Un saltito. Un palmo de agua. Pero salta.' },
					{ weather: 'smoke', actors: [{ key: 'karp', remove: true, exit: 'down' }, { key: 'houndoom', do: 'back' }, { key: 'rio', do: 'step', emote: 'anger' }], text: '{riolu} baja los brazos. Le humea el pelaje. No retrocede ni un paso. Mira a Atlas. No al Houndoom: a Atlas.' },
				] } },
				{ happy: { who: 'riolu', n: 10 } },
				{ say: 'atlas', text: '…Vaya. —Por primera vez, algo se le mueve en la cara—. Ese sí que protege a la familia.' },
			], else: [
				{ text: 'Te interpones entre el Houndoom y el tanque. El fuego se detiene a un palmo de tu cara: Atlas ha levantado una mano.' },
				{ say: 'atlas', text: '…Vaya. Valiente, o tont{o|a|e}. A esas edades se parecen mucho.' },
			] },
			{ choice: [
				{ text: 'Antes de nada, ocuparte de tu equipo.', then: [
					{ text: 'Revisas a tu equipo con calma. Atlas espera, con las manos a la espalda. Es de los que esperan.' },
					{ heal: true },
				] },
				{ text: '«Esto se acaba hoy.»', then: [
					{ say: 'atlas', text: 'Todo se acaba algún día. Lo difícil es decidir quién paga la cuenta.' },
					{ text: 'Mientras habla, Lance aparece en la puerta destrozada y deja que su Dragonite reparta su calor una última vez. Luego se queda ahí. No interviene. Es tu combate.' },
					{ heal: true },
				] },
			] },
			{ battle: 'atlas_1', onWin: [{ call: 'b03_atlas_despues' }], onLose: [
				{ text: 'Tu último Pokémon cae. Atlas no se mueve. Recoge a los suyos uno a uno, sin prisa, y vuelve a ponerse las manos a la espalda.' },
				{ say: 'atlas', text: 'Todavía no. —No suena a burla—. Siéntate. Respira. Aquí nadie se va a ir a ninguna parte. Yo menos que nadie.' },
				{ text: 'Lance entra desde el pasillo. Su Dragonite reparte su calor entre tus Pokémon sin decir nada. Atlas espera junto a la máquina.' },
				{ heal: true },
			] },
		],
		b03_atlas_despues: [
			{ text: 'El Houndoom de Atlas cae junto a la máquina. Atlas lo recoge sin prisa y se queda mirando la Poké Ball un rato largo.' },
			{ say: 'atlas', text: 'Bien. Ya está. —Se sienta en una caja de herramientas, con el traje blanco manchado de hollín—. Haz lo que tengas que hacer con esa máquina. Yo ya no tengo nada que defender.' },
			{ text: 'Tomas la pinza del gancho. «NO TOCAR (en serio)». Buscas el cable azul entre todos los cables. Hay uno rojo justo al lado. Muy al lado.' },
			{ cutscene: { bg: { type: 'lab' }, start: 'dark', frames: [
				{ cam: 'push', item: 'pinzaonda', text: 'La pinza pesa más de lo que parece. Las mordazas son de cobre, finas, con dientecitos. Tiemblan un poco cuando la acercas a la máquina, como si quisieran morder.' },
				{ fx: 'heartbeat', cam: 'still', text: 'El cable azul. Lo encuentras. Abres la pinza.' },
				{ fx: ['flash', 'slash'], text: 'Clac.' },
				{ actors: [{ key: '_c', remove: true, exit: 'fade' }], fx: 'shake', text: 'El cilindro de cristal deja de girar. El brillo azul de dentro se posa en el fondo, como arena en un vaso de agua. El zumbido baja… baja… y se apaga.' },
				{ cam: 'still', fx: 'dark', text: 'Silencio. Un silencio enorme. Hasta ahora no te habías dado cuenta de lo mucho que pesaba ese ruido.' },
			] } },
			{ give: 'pinzaonda' },
			{ if: LUC, then: [
				{ text: '{riolu} se acerca a la fila de jaulas. Pone una pata en el candado de la primera. El aura azul le sube por el brazo, despacio, y el candado se abre con un chasquido suave. Luego el siguiente. Y el siguiente.' },
				{ text: 'No lo hace deprisa. Va jaula por jaula, tanque por tanque, como quien da las buenas noches. Los Magikarp no saltan todavía. Pero ya no tienen los ojos vacíos.' },
				{ happy: { who: 'riolu', n: 5 } },
			], else: [
				{ text: 'Abres las jaulas una a una. Los Magikarp no saltan todavía. Pero ya no tienen los ojos vacíos.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! Señal: cero. Lago de la Furia: me llega un mensaje del Centro Pokémon de Caoba. Dicen que los Gyarados han dejado de rugir. De golpe. Todos a la vez.' },
			{ text: 'Lance entra en la sala con tres reclutas por delante: Toni, Lupe y la Mayor. No los empuja. Ellos caminan solos, con la cabeza baja. Detrás vienen más. Muchos más de los que pensabas.' },
			{ say: 'lance', text: 'Estaban en las literas del ala este. Catorce. Ninguno ha intentado pelear. —Mira a Atlas—. Ninguno.' },
			{ say: 'atlas', text: 'Les dije que no lo hicieran. Por una vez me han hecho caso.' },
			{ quest: 'b03_m6', stage: 'decision' },
			{ text: 'En la computadora del panel, una ventana abierta: «Fundación Raíces · Sincronizando…». Una barra que avanza. Todo lo que esta máquina ha medido en tres semanas, saliendo hacia algún sitio.' },
			{ say: 'atlas', text: 'Escúchame. —Se levanta—. Si eso termina de enviarse, la fundación sabrá que la prueba se cortó. Y sabrá quién la cortó, porque tu Pokédex ha estado aquí dentro toda la tarde. No sé quién está detrás de la fundación. Sé que no le gusta que le corten las cosas.' },
			{ say: 'atlas', text: 'Puedo quemarlo. Todo. Los discos, los registros, la sincronización. Que no sepan nada de ti. Pero entonces no habrá pruebas para nadie: ni para el de la capa, ni para la policía. Y yo me iré por donde he venido.' },
			{ say: 'lance', text: 'O podemos llamar a la policía y entregarlo todo. A él, la máquina, los registros. —Mira a los reclutas—. A todos.' },
			{ text: 'Toni te mira desde el fondo, con las orejas rojas. La Mayor le ha puesto una mano en el hombro.' },
			{ choice: [
				{ text: 'Entregar a Atlas y todo lo demás a la policía.', then: [{ call: 'b03_rocket_policia' }] },
				{ text: 'Que detengan a Atlas, pero dejar que los reclutas se vayan.', then: [{ call: 'b03_rocket_libres' }] },
				{ text: 'Ayudar a Atlas a quemar los datos de la fundación.', then: [{ call: 'b03_rocket_quemar' }] },
			], prompt: '¿Qué haces con los últimos de «la familia»?' },
			{ call: 'b03_rocket_cierre' },
		],
		b03_rocket_policia: [
			{ set: { 'flag.b03_rocket_policia': true } },
			{ rep: { policia: 5 } },
			{ text: '«Que venga la policía.» Lo dices en voz alta. Lance asiente y saca el teléfono.' },
			{ say: 'atlas', text: 'Claro. —Ni siquiera parece sorprendido—. Lo justo. Lo limpio. Lo que queda bien en un informe.' },
			{ text: 'Media hora después baja por la escalera de la tienda un hombre con gabardina, sombrero y un bigote postizo que se le despega por un lado. Lleva una cesta de picnic.' },
			{ say: 'handsome', as: 'Turista muy normal', text: '¡Buenas tardes! Vengo a comprar un llavero. Del lago. Muy turístico todo. —Se quita el bigote—. Ah, eres tú. Handsome ha venido en cuanto el señor de los dragones ha llamado. Handsome estaba en Caoba de incógnito. Comiendo caramelos.' },
			{ say: 'handsome', text: 'Todo esto… —mira la máquina, los tanques, las hojas— …es una prueba. Una prueba de verdad. Con papeles. Con firmas. Con una fundación. Handsome casi llora. Handsome no llora. Handsome se emociona con dignidad.' },
			{ if: 'flag.b02_frag_handsome', then: [
				{ say: 'handsome', text: 'Esta vez la custodio yo. En persona. —Baja la voz—. ¿Sabes la pieza de Kalos? ¿La que me diste en Iris? Se ha extraviado en la custodia. Un traslado de depósito, dicen. Pasa. Lebrun está muy disgustado. Me mandó un caramelo de menta para consolarme.' },
				{ text: 'Handsome se queda callado un segundo de más. Luego sonríe y cambia de tema.' },
			] },
			{ say: 'handsome', text: 'Señor Atlas, queda usted detenido. Y ustedes… —mira a los catorce reclutas—. Ustedes, también. Lo siento. De verdad. Handsome les traerá bocadillos.' },
			{ say: 'atlas', text: 'Bocadillos. —Extiende las muñecas—. Por lo menos esta vez alguien piensa en la comida.' },
			{ text: 'Los reclutas suben la escalera en fila, sin esposas: Handsome dice que no hacen falta. Toni es el último. Al pasar a tu lado no te mira.' },
		],
		b03_rocket_libres: [
			{ set: { 'flag.b03_rocket_libres': true } },
			{ rep: { johto: 5, policia: -1 } },
			{ text: '«Atlas va detenido. Ellos no.»' },
			{ say: 'lance', text: '¿Estás segur{o|a|e}? Son catorce. Mañana pueden volver a ponerse una gorra.' },
			{ text: 'Miras a los reclutas. A Toni. A la Mayor, que todavía reparte bocadillos. A la Tercera, que finge limarse las uñas con la ganzúa.' },
			{ choice: [
				{ text: '«Y pueden no ponérsela.»', then: [{ say: 'lance', text: '…Pueden. —Se queda un momento callado—. Muy bien. Es tu decisión. La respeto.' }] },
				{ text: '«La policía no les dio nada la otra vez.»', then: [{ say: 'lance', text: 'No. No se lo dio. —Lo dice como quien reconoce una deuda que no es suya—. Muy bien.' }] },
			] },
			{ say: 'atlas', text: 'Vaya. —Atlas te mira largo rato—. A mí me encierras y a ellos los dejas ir. Eso es exactamente lo que yo habría hecho. No sé si es un cumplido.' },
			{ say: 'atlas', text: 'Chicos. Ya lo han oído. Fuera. A casa. Al que vea con una gorra, se la como.' },
			{ text: 'Los reclutas suben la escalera de la tienda despacio, uno por uno, sin mirar atrás. Toni se queda el último. Se acerca a ti, se quita la gorra y la dobla en cuatro.' },
			{ say: 'recluta_rocket_b3', as: 'Toni', text: 'Gracias. —Se la guarda en el bolsillo—. Me voy a la Ruta 37. Mi madre ha guardado arroz. Siempre guarda arroz.' },
			{ text: 'Lance llama a la policía de Caoba. Se llevan a Atlas al anochecer, con las manos a la espalda, igual que lo encontraste. Antes de subir al coche, Atlas mira hacia la tienda de recuerdos. Hacia la escalera por la que se fueron los suyos.' },
		],
		b03_rocket_quemar: [
			{ set: { 'flag.b03_rocket_quemar': true } },
			{ rep: { policia: -5 } },
			{ text: '«Quémalo.» Lo dices bajo. Lance no te oye: ha salido al pasillo a llevarse a los reclutas.' },
			{ text: 'Atlas te mira un segundo. Luego se mueve deprisa, como quien lo tenía pensado desde hace mucho. Arranca los discos de la computadora, los mete en un cubo de metal, les echa algo de una botella que huele a gasolina y a limón.' },
			{ say: 'atlas', text: 'Houndoom. Poquito.' },
			{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#c4473a' }, start: 'dark', frames: [
				{ actors: [{ id: 'atlas', at: 'left', dim: true }, { mon: 'houndoom', at: 0.72, flip: true }], weather: 'embers', fx: 'glow', color: '#ff7a2a', text: 'El Houndoom suelta una llamita, casi delicada. El cubo prende con un *fump* grave.' },
				{ color: '#ff6a5a', tint: '#c4473a', on: false, fx: 'flash', text: 'En la pantalla del panel, la barra de «Sincronizando…» se congela. Parpadea. Se pone en rojo: «Error de conexión».' },
				{ weather: 'smoke', tint: 'none', cam: 'pan-up', actors: [{ key: 'houndoom', remove: true, exit: 'fade' }], text: 'El humo sube hasta los fluorescentes. Las fotos de boda de las paredes se ven a través de él, borrosas, como recuerdos de otra gente.' },
			] } },
			{ say: 'atlas', text: 'Esas hojas que llevas en el bolsillo. —Señala tu chaqueta; las ha visto—. Quédatelas. Que alguien sepa. Pero que no sepan que lo sabes tú.' },
			{ say: 'atlas', text: 'Te debo una. No me gusta deber cosas. —Se sacude el hollín del traje—. Pero yo pago lo que debo. Pregúntale a cualquiera de mis chicos.' },
			{ text: 'Y se va por la puerta del otro lado de la máquina. La que no habías visto. Antes de que puedas decir nada, ya no está.' },
			{ text: 'Lance vuelve corriendo, con la capa llena de humo. Mira el cubo. Mira la puerta abierta. Te mira a ti.' },
			{ say: 'lance', text: '…Supongo que tenías tus motivos. —No levanta la voz. Es peor—. Espero que sean buenos. Los de él, desde luego, lo eran para él.' },
			{ intel: { npc: 'atlas', text: 'Escapó por una puerta trasera de la guarida de Caoba después de quemar los datos que la máquina enviaba a la Fundación Raíces. Te dijo que te debe una. «Yo pago lo que debo».' } },
		],
		b03_rocket_cierre: [
			{ cap: 50 },
			{ quest: 'b03_m6', done: true },
			{ intel: { npc: 'atlas', text: 'Admin del Team Rocket, «el Primero» (el primero en quedarse tras la disolución). Dirigía la guarida de Caoba y la señal del Lago de la Furia, por encargo de la Fundación Raíces. Pagaba con eso las deudas de los reclutas abandonados: «Protón se sabía los nombres; yo me sé las deudas».' } },
			{ intel: { npc: 'lance', text: 'Maestro de dragones. Siguió durante tres días una señal ilegal hasta el Lago de la Furia. Su Dragonite derribó la puerta de acero de la guarida de Caoba de un Hiperrayo.' } },
			{ text: 'Arriba, en la tienda de recuerdos, ya es de noche. El dependiente ha cerrado. Lance te espera en la puerta, con Dragonite a su lado.' },
			{ if: 'flag.b03_rocket_quemar', then: [
				{ say: 'lance', text: 'No voy a preguntarte por qué. Hoy no. —Mira hacia el norte, hacia el lago—. Pero la señal está apagada, y eso lo has hecho tú. Eso no te lo quita nadie. Ni siquiera tú.' },
			], else: [
				{ say: 'lance', text: 'La señal está apagada. Los Gyarados duermen. Y abajo hay catorce personas que mañana tendrán que decidir qué hacer con su vida. Como todos. —Mira hacia el norte, hacia el lago—. Buen trabajo.' },
			] },
			{ say: 'lance', text: 'Toma. Para tu compañero. Ya sabe lanzar el aura; esto es lo mismo, pero con el aliento de un dragón. Me parece que le va.', cond: LUC },
			{ say: 'lance', text: 'Toma. Para tu equipo. El aliento de un dragón, para quien sepa usarlo.', cond: '!(' + LUC + ')' },
			{ give: 'mt_pulso_dragon' },
			{ say: 'lance', text: 'Si alguna vez vuelves a oír un tambor debajo de un lago, búscame. No suelo estar donde me buscan. Pero suelo estar donde hace falta.' },
			{ text: 'Sube a su Dragonite. La capa ondea. Durante un segundo, recortado contra la luna, parece exactamente lo que es: alguien que lleva mucho tiempo siendo el que llega volando cuando todo se rompe.' },
			{ text: 'Y se va. Hacia el este, hacia las montañas.' },
			{ say: 'rotom', text: '¡Bzzt! ¿Volvemos al lago? Dicen en el Centro que está precioso de noche. Ahora que se ha callado.' },
			{ go: 'lago_furia' },
		],

		// =================== FINAL DEL BLOQUE ===================
		b03_fin: [
			{ if: 'flag.b03_fin', then: [{ end: true }] },
			{ text: 'Esa noche, el Lago de la Furia está en silencio.' },
			{ text: 'No el silencio de antes, que era el de un tambor esperando. Otro. El de un sitio grande que por fin descansa. El agua es un espejo negro. La luna está entera dentro, sin partir.' },
			{ text: 'Te sientas en la arena gris, con las rodillas contra el pecho.' },
			{ text: 'Piensas en una mecedora vacía en un porche de la Ruta 42. No dices nada. Nadie te pide que lo digas.' },
			{ if: 'flag.b03_rocket_policia', then: [
				{ text: 'Rotom vibra. Un mensaje de Handsome: «Todos en Caoba. Bocadillos entregados. Atlas no ha dicho una palabra en todo el interrogatorio, salvo una: tu nombre. Lo ha dicho como quien apunta una deuda. H.».' },
			] },
			{ if: 'flag.b03_rocket_libres', then: [
				{ text: 'Rotom vibra. Una foto sin texto, desde un número desconocido: una mesa de cocina en la Ruta 37, un plato de arroz con leche con canela por encima y, al fondo, desenfocadas, unas orejas de soplillo.' },
			] },
			{ if: 'flag.b03_rocket_quemar', then: [
				{ text: 'Rotom vibra. Un mensaje sin remitente: «Lo prometido es deuda. Te debo una. —A.». Lo borras. Luego te arrepientes de haberlo borrado.' },
			] },
			{ text: 'Y otra vez. Un número que conoces. Noa Lambert. El mensaje llega a trozos, como escrito a escondidas.' },
			{ say: 'noa', as: 'Noa (mensaje)', text: 'No me contestes. Hoy en la oficina ha saltado una alerta: «Prueba de campo de Johto interrumpida». Nadie dice por qué. Todos te miran la ficha.' },
			{ say: 'noa', as: 'Noa (mensaje)', text: 'Los datos de esa prueba no se quedaban en Johto. Iban por el tendido del Tren Magnético, hacia el este. A Kanto. A Azafrán. Lo he visto en un panel que no debería haber visto.' },
			{ say: 'noa', as: 'Noa (mensaje)', text: 'Borra esto. Por favor.' },
			{ quest: 'b03_t_ondas', stage: 'abierto' },
			{ say: 'rotom', text: '…¡Bzzt! Y una notificación de la Gira, para todos los inscritos: «La Gira continúa en **Kanto**. Los participantes con siete medallas tienen billete gratis en el **Tren Magnético Trigal–Azafrán**. ¡Los esperamos a bordo!».' },
			{ say: 'rotom', text: 'El Tren Magnético. El que pasa justo por encima del sótano. —Pausa—. Ya sé, ya sé. No digo nada.' },
			{ if: LUC, then: [
				{ cutscene: { time: 'noche', bg: { type: 'coast', far: '#1a2438', ground: '#4a4a5a' }, start: 'dark', frames: [
					{ actors: [{ mon: '{riolu}', key: 'rio', at: 'center', enter: 'left' }], cam: 'still', text: '{riolu} se levanta. Camina hasta la orilla, hasta que el agua le moja las patas. Se agacha. Pone la palma abierta sobre la superficie del lago.' },
					{ fx: ['glow', 'ripple'], text: 'El aura se le enciende, azul, tranquila. Y baja al agua. Se extiende por el lago en anillos, despacio, como la luz de una linterna que alguien pasa por un mapa.' },
					{ fx: ['ripple', 'sparkle'], color: '#8fd0ff', cam: 'pan-right', text: 'Por donde pasa el aura, el agua se ilumina por dentro. Ves los bajíos. Las piedras. Los Magikarp dormidos. Los Gyarados acurrucados en el fondo, respirando despacio.' },
					{ cam: 'pan-right', fx: 'zoom', text: 'Y entonces lo ves: bajo el agua, un hilo. Finísimo, casi invisible, de luz azul pálida. Sale del fondo del lago y se va hacia el este. Hacia las montañas. Hacia más allá.' },
					{ actors: [{ key: 'rio', do: 'turn' }], cam: 'still', fx: 'dark', text: 'El aura de {riolu} lo alcanza, lo recorre un momento… y el hilo se apaga, como una cerilla. {riolu} retira la palma. Se queda mirando al este mucho rato.' },
				] } },
				{ text: 'Luego vuelve y se sienta a tu lado en la arena, con el hombro pegado al tuyo. No dice nada. No hace falta.' },
				{ happy: { who: 'riolu', n: 10 } },
			], else: [
				{ text: 'El agua del lago está tan quieta que, durante un momento, te parece ver bajo la superficie un hilo de luz azul, finísimo, que se aleja hacia el este. Parpadeas. Ya no está.' },
			] },
			{ if: 'flag.b03_gyarados_atrapado', then: [
				{ text: 'Abres una Poké Ball. El Gyarados rojo se desliza al agua sin un ruido, da una vuelta lenta delante de la orilla y se queda flotando, con la cabeza fuera, mirando la luna. Como quien vuelve a casa un rato, sabiendo que luego se va.' },
			], else: [
				{ text: 'Muy lejos, en el centro del lago, una cresta roja asoma del agua. El Gyarados rojo. Mira hacia la orilla. Inclina la cabeza, una vez, despacio. Y vuelve a hundirse.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! Foto. No he podido evitarlo. Era demasiado bonito para no guardarlo.' },
			{ cutscene: { time: 'noche', bg: { type: 'coast', far: '#1a2438', ground: '#4a4a5a' }, start: 'dark', frames: [
				{ cam: 'push', item: 'fotolago', fx: 'light', text: 'En la pantalla de la Pokédex: el lago de noche, la luna entera en el agua, una silueta azul en la orilla y, en el agua, una forma larga y roja. Rotom le ha puesto de título «Silencio». Es el mejor título que se le ha ocurrido nunca.' },
			] } },
			{ give: 'fotolago' },
			{ set: { 'flag.b03_fin': true } },
			{ diary: 'Hoy mi entrenador{|a|e} y yo nos quedamos en la orilla del Lago de la Furia hasta muy tarde. ¡El lago estaba tan tranquilo que la luna cabía entera dentro!\n\n{riolu} tocó el agua con la mano y se encendió todo de azul, como un acuario gigante. Hice una foto. La he llamado «Silencio». Creo que es mi mejor foto. ¡Y el mejor título!\n\nHa sido una temporada larga en Johto. Hubo días bonitos y días que no. Mi entrenador{|a|e} habló poco esta semana, así que yo hablé un poquito menos también, para hacerle compañía. Dicen que la Gira sigue en Kanto, ¡y que vamos en tren! ¡Nunca he montado en un tren que flota! Mañana será otro día. ¡Seguro que es un buen día!', cond: 'flag.b01_diario' },
			{ save: true },
			{ text: '**Fin del Acto II.**' },
			{ text: '*La historia continúa…*' },
		],
	},

	// =====================================================================
	// NPCs genéricos de este tramo
	// =====================================================================
	npcs: {
		dependiente_caoba: { name: 'Dependiente', generic: true, look: { hair: 'short', hairColor: '#3a2a1e', outfit: '#c4473a', outfit2: '#e9e3d0', skin: 2, eyesStyle: 'happy', mouth: 'grin', acc: 'mustache' } },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		cartatoni: { name: 'Carta de Toni', pocket: 'key', desc: 'Media hoja de cuaderno doblada en cuatro, con manchas de grasa. Por un lado, cuentas de pipas y gasolina. Por el otro, una carta a medio escribir.',
			read: '*Por detrás, en columnas torcidas: «Pipas 3 · Gasolina generador 40 · Pintura caseta 12 · Caramelos (los de la tienda NO, que dan dolor de cabeza) 0».*\n\n**Querida mamá:**\n\nEstoy bien. Como caliente. Tengo una litera de abajo, que es la buena, porque la Mayor dice que los bajitos van abajo para que no se caigan. No me he caído.\n\nTrabajo en una caseta. Es como un peaje pero de verdad no. Cobro a la gente por pasar. Casi nadie paga. Lupe dice que es normal. El Primero dice que no importa, que lo importante es que estemos juntos y ocupados. El Primero es muy serio pero el otro día me dio su bufanda porque hacía frío. No le digas a nadie que tiene bufanda.\n\nYa casi tenemos lo de la abuela. Un par de meses más y no le quitan la casa. Luego vuelvo. Te lo prometo.\n\nNo le digas a Ignacio dónde estoy. Si te pregunta, dile que estoy con la familia. Él sabe lo que es.\n\nGuárdame arroz con leche. Con canela por encima, que siempre se te olvida.\n\nTe quiere,\n**Toni**\n\n*(sin terminar; la última línea está tachada y vuelta a escribir: «Perdón por la R»)*' },
		mt_pulso_dragon: { name: 'MT Pulso Dragón', pocket: 'machines', tm: 'dragonpulse', desc: 'Una onda de choque que sale de la boca del usuario. Regalo de Lance.' },
		muestralago: { name: 'Muestra del Lago de la Furia', pocket: 'key', desc: 'Un frasco de cristal con agua oscura del lago. Tiene motitas que brillan muy poco. Cuando algo parpadea cerca, las motitas parpadean con ello.' },
		fotolago: { name: 'Foto «Silencio»', pocket: 'key', art: 'lago_furia_noche', desc: 'La foto que hizo Rotom en el Lago de la Furia, de noche: la luna entera en el agua, una silueta azul en la orilla y una forma larga y roja en el lago. Rotom la tiene de fondo de pantalla.' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		arbol_r43: {
			name: 'Árbol cargado de bayas', icon: '🌳', hours: 20, picks: [1, 3],
			text: 'Sacudes el tronco con cuidado. Caen bayas, hojas y, una vez, un Pineco muy ofendido que vuelve a subir solo.',
			wait: 'El árbol está pelado. Las bayas nuevas aún están verdes y el Pineco te vigila desde arriba.',
			table: [
				{ id: 'sitrusberry', w: 18, n: [1, 2] }, { id: 'pechaberry', w: 14, n: [1, 2] }, { id: 'razzberry', w: 14, n: [1, 3] },
				{ id: 'pinapberry', w: 12, n: [1, 2] }, { id: 'nanabberry', w: 10, n: [1, 2] }, { id: 'tinymushroom', w: 8, n: [1, 1] },
				{ id: 'honey', w: 8, n: [1, 1] }, { id: 'lumberry', w: 3, n: [1, 1] },
			],
		},
		orilla_furia: {
			name: 'Orilla de arena gris', icon: '🐚', hours: 18, picks: [1, 3],
			text: 'Caminas por la orilla con la vista en el suelo. El lago ha dejado cosas entre las piedras.',
			wait: 'La orilla está limpia. El lago todavía no ha tenido tiempo de escupir nada nuevo.',
			table: [
				{ id: 'pearl', w: 18, n: [1, 2] }, { id: 'shoalsalt', w: 14, n: [1, 2] }, { id: 'shoalshell', w: 14, n: [1, 2] },
				{ id: 'heartscale', w: 10, n: [1, 1] }, { id: 'bigpearl', w: 4, n: [1, 1] }, { id: 'mysticwater', w: 3, n: [1, 1] },
				{ id: 'dragonscale', w: 2, n: [1, 1], cond: 'done.b03_m6' },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		gyarados_rojo: {
			name: 'El Gyarados rojo', type: 'Water', rec: 47,
			cond: 'visited("lago_furia")',
			info: [
				{ text: 'Un Gyarados de un color que no debería existir, furioso, en el Lago de la Furia.' },
				{ cond: 'flag.b03_lago_llegada', text: 'Nivel 47. Agua y Volador. Su mirada intimida: los ataques físicos le hacen menos daño de entrada.' },
				{ cond: 'flag.b03_lago_llegada', text: 'Los ataques de tipo **Eléctrico** le hacen muchísimo daño.' },
				{ cond: 'flag.b03_gyarados_atrapado', text: '✔ Ahora viaja contigo. Ya no oye la señal.' },
				{ cond: 'flag.b03_gyarados_calmado', text: '✔ Lo calmaste. A veces asoma en el centro del lago.' },
			],
		},
		jefe_atlas: {
			name: 'La tienda de recuerdos', trainer: 'atlas_1', type: 'Dark', rec: 48,
			cond: 'quest.b03_m6 == "guarida" || quest.b03_m6 == "decision" || done.b03_m6',
			info: [
				{ text: 'Alguien en Pueblo Caoba emite la señal que enfurece el lago.' },
				{ cond: 'flag.b03_guarida_abierta', text: 'Debajo de la tienda de recuerdos hay una guarida del **Team Rocket**. Sus reclutas usan tipos **Veneno** y **Siniestro**.' },
				{ cond: 'flag.b03_atlas_visto', text: 'Su jefe: **Atlas**. Cinco Pokémon, hasta el nivel 49. Los tipos **Lucha**, **Tierra** y **Psíquico** le vienen bien.' },
				{ cond: 'flag.b03_atlas_visto', text: 'Uno de sus Pokémon flota y no le afectan los ataques de Tierra. Su as escupe fuego.' },
				{ cond: 'beat("atlas_1")', text: '✔ La señal está apagada.' },
			],
		},
	},
};
