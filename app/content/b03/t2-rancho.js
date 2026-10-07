// Bloque 3 · Tramo 2: «Lo que el tiempo se llevó».
// La llamada de Adela → el rancho de la Ruta 42 (la pérdida de Don Aurelio, la carta, la decisión del rebaño)
// → Monte Mortero (Kiyo y su Tyrogue) → Pueblo Caoba (aviso de ritmo, Gaspar y el Caramelo Furia, carta de Lucien,
// rumores del Lago de la Furia). Cierra con b03_m6 en etapa «lago».
//
// NOTA: el rancho se redefine entero en `locations` (mismo id, mismos spots del B2 con condiciones) porque un
// `patch` no puede ocultar el spot «Don Aurelio, en el porche» del B2. Todo lo del B2 sigue funcionando igual.

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = 'inParty("riolu") || inParty("lucario")';
const MUERTO = 'flag.b03_aurelio_muerto';
const DECIDIDO = 'flag.b03_rancho_sobrina || flag.b03_rancho_jugador || flag.b03_rancho_lemnis';
const COPITO_TUYA = 'flag.b01_mareep_copito'; // la rescató el jugador en Kalos (B1): lo reconoce
const FARO_AQUI = 'flag.b02_ampharos && inParty("ampharos")';
const CANDELA_AQUI = 'flag.b01_candela_unida && (inParty("mareep") || inParty("flaaffy") || inParty("ampharos"))';
const CHISPITA_FUERA = 'flag.b01_mareep_lemnis && !flag.b01_mareep_jaula';
const RAICES_VISTO = 'has("albaranraices") || flag.b02_pista_caja';
const LLAMADA = 'flag.b03_llamada_sobrina && !flag.b03_adela_llamo';

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== RANCHO DE DON AURELIO (redefinido: B2 + B3) ===================
		rancho_aurelio: {
			name: 'Rancho de Don Aurelio', short: 'Rancho Prado', region: 'johto', kind: 'area', map: { x: 74, y: 26 },
			bg: { type: 'ranch', ground: '#8ab86a', far: '#8a9ab0' },
			desc: 'Un establo rojo, una casa de madera con porche y mecedora, un pozo, un huerto y un prado enorme lleno de **Mareep** que chisporrotean al rozarse. Cuando sopla el viento, el rancho entero hace *chss*.\n\nEn el porche, un cartel de madera tallada: «Rancho Prado. Desde siempre. Hasta que haga falta».',
			descs: [
				{ cond: 'flag.b03_rancho_lemnis', text: 'El establo rojo tiene el tejado nuevo. La cerca, también: blanca, recta, con una **placa azul** atornillada junto a la cancela. Una lemniscata y unas letras plateadas: «Fundación Raíces de Johto · Cuidando lo que importa».\n\nEl rebaño pasta tranquilo. Muy tranquilo.\n\nEn el porche sigue la mecedora. Vacía. Alguien le ha puesto un cojín nuevo, azul, con el mismo logo.' },
				{ cond: 'flag.b03_rancho_jugador && flag.b03_copito_contigo', text: 'Tu rancho. Todavía suena raro decirlo.\n\nEl establo rojo, el pozo, el huerto de zanahorias torcidas. Adela ha clavado el cartel viejo un poco más arriba, para que no se lo coma Borla.\n\nEn el porche, la mecedora. Vacía. Nadie se sienta en ella. Nadie lo ha decidido; simplemente, nadie lo hace.' },
				{ cond: 'flag.b03_rancho_jugador', text: 'Tu rancho. Todavía suena raro decirlo.\n\nEl establo rojo, el pozo, el huerto de zanahorias torcidas. Adela ha clavado el cartel viejo un poco más arriba, para que no se lo coma Borla.\n\nEn el porche, la mecedora. Copito duerme en ella todas las tardes, hecha una bola, con el lazo azul colgando.' },
				{ cond: 'flag.b03_rancho_sobrina', text: 'Junto al cartel de «Rancho Prado» hay ahora una placa nueva, pequeña, de latón: «A. Prado · Veterinaria». Debajo, a rotulador: «Urgencias, gritar fuerte».\n\nEl rebaño pasta en el prado. Adela va y viene con un maletín.\n\nEn el porche, la mecedora. Vacía. Se mueve un poco cuando sopla el viento.' },
				{ cond: MUERTO, text: 'El rancho está en silencio. El rebaño no bala: pasta muy junto, todas las Mareep pegadas, como en las noches de tormenta.\n\nEn el porche, la mecedora. Vacía. Se mueve un poco cuando sopla el viento.' },
				{ cond: 'flag.b02_rancho_hecho', text: 'El rancho de Don Aurelio, con su establo rojo y su prado de lana. La mecedora del porche se mueve sola con el viento. En la ventana de la cocina hay una luz encendida.\n\nCopito te ve llegar desde el otro lado del prado y se pone a balar como si no te hubiera visto en un año.' },
			],
			links: ['ruta42', 'monte_mortero'],
			mapNote: 'Rancho Prado · Ruta 42',
			onEnter: [
				{ script: 'b02_rancho_llegada', cond: '!flag.b02_rancho_llegada', once: true },
				{ script: 'b03_rancho_tarde', cond: 'flag.b03_llamada_sobrina && !flag.b03_aurelio_muerto', once: true },
			],
			spots: [
				// --- Del B2 (con condición para después de la pérdida) ---
				{ label: 'Don Aurelio, en el porche', sub: 'En su mecedora', icon: '🤠', cond: '!' + MUERTO, new: '!flag.b02_rancho_hecho', talk: [{ cond: 'flag.b02_rancho_hecho', script: 'b02_aurelio_despues' }, { script: 'b02_aurelio_visita' }] },
				{ label: 'El rebaño', sub: 'Un mar de lana que bala', icon: '🐑', talk: [{ cond: MUERTO, script: 'b03_rebano_duelo' }, { script: 'b02_rebano' }] },
				{ label: 'Copito', sub: 'Una Mareep con un lazo azul en el cencerro', icon: '🎀', cond: '!(flag.b03_copito_contigo && ' + COPITO_TUYA + ')', talk: [{ cond: MUERTO, script: 'b03_copito_duelo' }, { script: 'b02_copito' }] },
				{ label: 'Huerto del rancho', icon: '🥕', cond: '!' + MUERTO, action: { gather: 'huerto_rancho' } },
				// --- B3 ---
				{ label: 'Adela, en el escalón del porche', sub: 'Tiene una taza de café en las manos', icon: '🩺', cond: MUERTO + ' && !(' + DECIDIDO + ')', new: 'true', talk: [{ script: 'b03_rancho_decision' }] },
				{ label: 'Adela', sub: 'Va y viene con un maletín', icon: '🩺', cond: DECIDIDO, talk: [{ script: 'b03_adela_despues' }] },
				{ label: 'La mecedora', sub: 'Vacía', icon: '🪑', cond: MUERTO, new: '!flag.b03_dibujo_rancho', talk: [{ script: 'b03_mecedora' }] },
				{ label: 'Huerto del rancho', sub: 'Lo riega Adela', icon: '🥕', cond: MUERTO, action: { gather: 'huerto_prado' } },
			],
			rumors: [
				{ cond: '!' + MUERTO, text: 'Don Aurelio dice que su Ampharos alumbra mejor que el faro de Olivo. El farero de Olivo no lo ha desmentido.' },
				{ cond: MUERTO, text: 'En la Ruta 42 ya nadie oye el silbato del rancho al atardecer. Los Mareep vuelven solos al establo. Casi todos.' },
				{ cond: 'flag.b03_rancho_lemnis', text: 'Los de la Fundación vienen al rancho Prado los martes. Traen pienso «del bueno» y se van antes de comer.' },
			],
		},

		// =================== MONTE MORTERO ===================
		monte_mortero: {
			name: 'Monte Mortero', short: 'Mte. Mortero', region: 'johto', kind: 'cave', map: { x: 82, y: 24 },
			bg: { type: 'cave', crystals: '#a8b8c8', far: '#4a4f6a' },
			desc: 'Un monte hueco por dentro. Galerías anchas, columnas de roca que parecen hechas a mano, el goteo constante de un lago subterráneo y, al fondo, muy al fondo, un eco rítmico: *hu… ha… hu… ha…*\n\nLa senda que sale de detrás del establo de Don Aurelio cruza la montaña hasta **Pueblo Caoba**.',
			descNight: 'De noche el monte respira. Los Golbat salen en nubes por las grietas del techo y el eco del *hu… ha…* se oye más lejos, como si viniera de dentro de la piedra.',
			links: ['rancho_aurelio', 'caoba'],
			enterCond: 'done.b03_m5',
			blockedMsg: 'La senda al **Monte Mortero** sale de detrás del establo, pero una cancela vieja la cierra con candado. La llave la tiene quien lleve el rancho.',
			hidden: '!' + MUERTO,
			mapNote: 'Cueva · Karateka Kiyo · paso a Caoba',
			rumors: [
				{ text: 'Dentro del Monte Mortero vive el **Rey del Kárate**. Lleva diez años golpeando la misma roca. Dice que ya casi.' },
				{ text: 'Las setas del lago de dentro del monte son las que usan en Caoba para los caramelos. O las usaban, antes.' },
				{ text: 'Desde hace unos meses salen piedras de **sal** en las galerías de abajo. En un monte de Johto. Nadie sabe de dónde.' },
			],
			route: {
				from: 'rancho_aurelio', to: 'caoba', length: 8, terrain: 'cave', rate: 0.22,
				tramos: {
					0: [{ text: 'La senda sube por detrás del establo y se mete en la montaña. Lo último que oyes del rancho es un cencerro. Luego, solo el goteo.' }],
					1: [
						{ trainer: 'mortero_saturnino' },
						{ item: 'ether' },
					],
					2: [
						{ text: 'En las paredes húmedas crecen setas pálidas que brillan un poco. Huelen a tierra y a algo dulce.' },
						{ spot: { action: { gather: 'setas_mortero' } }, label: 'Setas de la galería', icon: '🍄' },
					],
					3: [
						{ terrain: 'water' },
						{ text: 'Un **lago subterráneo**, negro y quieto. En la orilla, alguien ha clavado un cartel: «Prohibido pescar. Por favor. Los peces ya sufren bastante con el ruido».' },
						{ trainer: 'mortero_wenceslao', optional: true, label: 'Un pescador ignora el cartel con mucha dignidad' },
						{ item: 'ppup', hidden: true },
					],
					4: [
						{ text: 'El eco ya no es un eco. *¡HU! ¡HA!* Viene de una sala redonda, con el techo altísimo y una roca enorme en el centro. La roca tiene una abolladura. Pequeña. Muy trabajada.' },
						{ talk: [{ cond: 'beat("kiyo_mortero")', script: 'b03_kiyo_despues' }, { script: 'b03_kiyo' }], label: 'Un karateka golpea una roca', sub: 'Hu. Ha. Hu. Ha.', icon: '🥋', new: '!flag.b03_kiyo_visto' },
					],
					5: [
						{ trainer: 'mortero_leonor' },
						{ text: 'Una galería estrecha, con las paredes llenas de marcas de garras antiguas. Algunas brillan como si fueran de sal.' },
					],
					6: [
						{ item: 'hyperpotion' },
						{ spot: { action: { gather: 'vetas_mortero' } }, label: 'Vetas en la roca', icon: '⛏️' },
					],
					7: [
						{ trainer: 'mortero_begona', optional: true, label: 'Una excursionista se come un bocadillo sobre una roca' },
						{ text: 'Las galerías empiezan a subir. Entra aire frío por algún sitio, y con el aire, un olor rarísimo para una cueva: **caramelo quemado**.' },
						{ item: 'maxrevive', hidden: true },
					],
					8: [{ text: 'Una boca de cueva entre pinos. Abajo, en un valle frío, un pueblo de tejados oscuros con humo en todas las chimeneas: **Pueblo Caoba**.' }],
				},
				encounters: {
					cave: [
						{ sp: 'golbat', lv: [40, 43], w: 22 },
						{ sp: 'golbat', lv: [41, 44], w: 12, time: 'night' },
						{ sp: 'machoke', lv: [40, 43], w: 14 },
						{ sp: 'graveler', lv: [40, 43], w: 14 },
						{ sp: 'hariyama', lv: [41, 44], w: 10 },
						{ sp: 'bronzong', lv: [41, 44], w: 8 },
						{ sp: 'chimecho', lv: [41, 43], w: 8 },
						{ sp: 'raticate', lv: [40, 42], w: 8 },
						{ sp: 'absol', lv: [43, 45], w: 3 },
						{ sp: 'naclstack', lv: [41, 43], w: 5, displaced: true },
						{ sp: 'carkol', lv: [40, 42], w: 4, displaced: true },
					],
					water: [
						{ sp: 'goldeen', lv: [40, 42], w: 35 },
						{ sp: 'seaking', lv: [42, 44], w: 20 },
						{ sp: 'azumarill', lv: [41, 43], w: 10 },
						{ sp: 'quagsire', lv: [41, 43], w: 8, time: 'night' },
					],
				},
			},
		},

		// =================== PUEBLO CAOBA ===================
		caoba: {
			name: 'Pueblo Caoba', short: 'Caoba', region: 'johto', kind: 'town', map: { x: 88, y: 14 },
			bg: { type: 'town', roofs: ['#3d2a22', '#4a3a4a', '#2b2f3a'], far: '#6a7a8a', hill: '#3a5a4a' },
			desc: 'Un pueblo de montaña metido entre pinos. Casas bajas de madera oscura, tejados de pizarra, humo en todas las chimeneas y un frío que se mete por las mangas.\n\nEn la calle mayor, la **tienda de recuerdos** tiene el escaparate lleno de cajas de **Caramelos Furia** «hechos en Caoba desde siempre». Al norte, el camino sube hacia el **Lago de la Furia**. Al final de la calle, el **gimnasio**, con la persiana bajada.',
			descNight: 'De noche Caoba se encierra pronto. Solo queda encendido el Centro Pokémon y, en la calle mayor, el letrero de la tienda de recuerdos, que parpadea. Desde el norte llega un rumor de agua revuelta. El lago no debería sonar así.',
			links: ['monte_mortero'],
			mapNote: 'Gimnasio cerrado (Fredo, de viaje) · Gaspar',
			onEnter: [{ script: 'b03_caoba_llegada', cond: '!flag.b03_m_aviso', once: true }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC', action: { pc: true } },
				{ label: 'Tienda de Caoba', icon: '🛒', action: { shop: 'tienda_caoba' } },
				{ label: 'Correo en el Centro Pokémon', sub: 'Un sobre con tu nombre, con letra de niño', icon: '✉️', cond: '!flag.b03_carta_lucien', new: 'true', talk: [{ script: 'b03_carta_lucien' }] },
				{ label: 'Un puesto de cocina con toldo de rayas', sub: 'Huele a caramelo. A caramelo bien hecho', icon: '🍳', new: '!flag.b03_gaspar_caoba || (quest.b03_s_caramelo == "ingredientes" && has("honey") && has("tinymushroom"))',
					talk: [
						{ cond: '!flag.b03_gaspar_caoba', script: 'b03_gaspar_caoba' },
						{ cond: 'quest.b03_s_caramelo == "ingredientes" && has("honey") && has("tinymushroom")', script: 'b03_gaspar_cocina' },
						{ cond: 'quest.b03_s_caramelo == "ingredientes"', script: 'b03_gaspar_falta' },
						{ script: 'b03_gaspar_despues' },
					] },
				{ label: 'Un pescador con un cubo', sub: 'Mira el cubo como si le debiera dinero', icon: '🎣', talk: [{ script: 'b03_caoba_pescador' }] },
				{ label: 'Gimnasio de Caoba', sub: 'La persiana está bajada', icon: '🥶', talk: [{ script: 'b03_gym_caoba_cerrado' }] },
				{ label: 'Colmenas de la ladera', icon: '🍯', action: { gather: 'colmenas_caoba' } },
			],
			rumors: [
				{ text: 'En el **Lago de la Furia** los Magikarp evolucionan solos. Sin pelear, sin crecer. Se les ponen los ojos rojos y, ¡zas!, Gyarados.' },
				{ text: 'Dicen que en el lago hay un **Gyarados rojo**. Rojo como un farol. Los pescadores ya no salen de noche.' },
				{ text: 'El líder del gimnasio, Fredo, se fue de viaje «hasta que se hiele el lago». Con lo revuelta que está el agua, va para largo.' },
				{ cond: 'visited("caoba")', text: 'Los Caramelos Furia de la tienda de recuerdos ya no saben como antes. La gente los compra igual. Por costumbre.' },
			],
		},
	},

	// =====================================================================
	// PARCHES (lugares de otros bloques o de otros tramos)
	// =====================================================================
	patches: {
		iris: {
			onEnter: [{ script: 'b03_llamada_adela', cond: LLAMADA, once: true }],
			spots: [
				{ label: '📞 Llamada perdida', sub: 'Un número de la Ruta 42', icon: '📞', cond: LLAMADA, new: LLAMADA, talk: [{ script: 'b03_llamada_adela' }] },
			],
		},
		ruta42: {
			route: { tramos: {
				7: [{ cond: 'flag.b03_llamada_sobrina && !' + MUERTO, text: 'El buzón con forma de Mareep está lleno hasta arriba. Nadie lo ha vaciado en días.' }],
				8: [{ cond: MUERTO + ' && !(' + DECIDIDO + ')', text: 'La cancela está abierta. El cencerro no suena: alguien le ha atado el badajo con un cordel.' }],
			} },
			rumors: [{ cond: MUERTO, text: 'Rosaura, la ranchera de la Ruta 42, ha dejado un ramo de flores silvestres en la cancela del rancho Prado. Sin tarjeta. No hace falta.' }],
		},
	},
	extraSpots: {
		olivo: [
			{ label: '📞 Llamada perdida', sub: 'Un número de la Ruta 42', icon: '📞', cond: LLAMADA, new: LLAMADA, talk: [{ script: 'b03_llamada_adela' }] },
		],
	},

	// =====================================================================
	// NPCs (solo los de este tramo)
	// =====================================================================
	npcs: {
		kiyo: { name: 'Kiyo', title: 'Rey del Kárate (Monte Mortero)', sprite: 'blackbelt', look: { hair: 'spiky', hairColor: '#2b2b38', outfit: '#e9e8e0', outfit2: '#2b2b38', skin: 2, acc: 'bandana', eyesStyle: 'sharp', mouth: 'grin' } },
		pescador_caoba: { name: 'Pescador', generic: true, sprite: 'fisherman', look: { hair: 'cap', hairColor: '#5a5a5a', outfit: '#5a7a5a', outfit2: '#c9a66b', skin: 3, acc: 'beard', mouth: 'flat' } },
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		mortero_saturnino: { name: 'Saturnino', cls: 'Montañero', ai: 2, team: [{ sp: 'graveler', lv: 43 }, { sp: 'rhydon', lv: 44 }],
			intro: 'Treinta años subiendo este monte y este año encuentro piedras de sal en las galerías de abajo. ¡Sal! ¡En un monte de Johto! A ver si tú me explicas algo.', win: 'No me lo has explicado. Me has dado una paliza, que no es lo mismo.' },
		mortero_wenceslao: { name: 'Wenceslao', cls: 'Pescador', ai: 2, team: [{ sp: 'seaking', lv: 44 }, { sp: 'quagsire', lv: 45 }],
			intro: 'En este lago no pica nada desde hace diez años. Desde que el de arriba empezó con el «hu, ha». Los peces se asustan. Yo también, pero vengo igual.', win: 'Ni pican ni gano. Hoy es un día redondo.' },
		mortero_leonor: { name: 'Engracia', cls: 'Médium', ai: 2, team: [{ sp: 'haunter', lv: 44 }, { sp: 'chimecho', lv: 45 }],
			intro: 'Desde ayer el monte entero está callado. Así se calla cuando alguien bueno se va de la ladera. Pelea despacio, ¿quieres? Por respeto.', win: 'Gracias. Ha sido un combate tranquilo. Como tiene que ser hoy.' },
		mortero_begona: { name: 'Maite', cls: 'Excursionista', ai: 2, team: [{ sp: 'golbat', lv: 44 }, { sp: 'hariyama', lv: 45 }],
			intro: 'Aquí dentro no hay cobertura. La Gira no retransmite, Lemnis no manda avisos y nadie me pregunta si he pensado en el futuro de nada. Por eso como aquí.', win: 'Me has quitado el bocadillo de la boca. No literalmente. Bueno, un poco.' },

		// ----- Karateka Kiyo, el Rey del Kárate (canon) -----
		kiyo_mortero: {
			name: 'Kiyo', cls: 'Karateka', npc: 'kiyo', ai: 4, reward: 4600,
			team: [
				{ sp: 'hitmonlee', lv: 45, moves: ['highjumpkick', 'blazekick', 'knockoff', 'fakeout'], ability: 'reckless', item: 'expertbelt', nature: 'jolly', iv: 26 },
				{ sp: 'hitmonchan', lv: 45, moves: ['drainpunch', 'icepunch', 'thunderpunch', 'machpunch'], ability: 'ironfist', item: 'sitrusberry', nature: 'adamant', iv: 26 },
				{ sp: 'hitmontop', lv: 46, moves: ['tripleaxel', 'closecombat', 'suckerpunch', 'rapidspin'], ability: 'intimidate', item: 'leftovers', nature: 'impish', iv: 27 },
				{ sp: 'machamp', lv: 46, moves: ['dynamicpunch', 'stoneedge', 'knockoff', 'bulkup'], ability: 'noguard', item: 'blackbelt', nature: 'adamant', iv: 28 },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: '¡Diez años sin un rival de verdad! ¡Ni una pausa para comer! —Pausa—. Bueno, alguna. ¡En guardia!',
			win: '¡HU! …Ha. —Se sienta en el suelo—. Diez años golpeando una roca y lo que me faltaba era que alguien me golpeara a mí.',
			lose: 'La roca no se defiende. Tú sí. Vuelve cuando quieras: yo estaré aquí. Llevo diez años aquí.',
			terrain: 'cave',
		},
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== LA LLAMADA ===================
		b03_llamada_adela: [
			{ if: 'flag.b03_adela_llamo', then: [{ end: true }] },
			{ set: { 'flag.b03_adela_llamo': true } },
			{ text: 'Tu Pokédex vibra. No es Rotom: es una llamada. Un número de Johto que no tienes guardado. Prefijo de la Ruta 42.' },
			{ say: 'rotom', text: '¿Contesto? Bzzt… Contesto.' },
			{ say: 'sobrina', as: 'Voz de mujer', text: '¿{jugador}? ¿Eres tú? —Ruido de fondo: viento, un cencerro—. Soy Adela. Adela Prado. La sobrina de Aurelio.' },
			{ say: 'sobrina', text: 'Tenía tu número en la puerta de la nevera. Con letras así de grandes. Para no perderlo.' },
			{ text: 'Silencio. Del otro lado se oye a alguien respirar hondo, por la nariz, como quien se obliga a hacerlo.' },
			{ say: 'sobrina', text: 'Mi tío quería verte. Ven en cuanto puedas.' },
			{ choice: [
				{ text: '«¿Está bien?»', then: [
					{ text: 'Otro silencio. Más largo.' },
					{ say: 'sobrina', text: 'Ven, ¿sí? Ven y ya.' },
				] },
				{ text: '«Voy para allá.»', then: [
					{ say: 'sobrina', text: 'Bien. —Pausa—. Bien.' },
				] },
				{ text: 'No decir nada.', then: [
					{ say: 'sobrina', text: '¿Sigues ahí? …Bueno. Ven en cuanto puedas. ¿Estamos?' },
				] },
			] },
			{ text: '*Clic.*' },
			{ say: 'rotom', text: 'La llamada venía del rancho. De Don Aurelio. —La pantalla parpadea despacio—. No ha dicho por qué. ¿Por qué no ha dicho por qué?' },
			{ text: 'El rancho está en la **Ruta 42**, al este de Ciudad Iris.' },
			{ intel: { npc: 'sobrina', text: 'Adela Prado, sobrina de Don Aurelio. Te ha pedido que vayas al rancho de la Ruta 42 «en cuanto puedas».' } },
		],

		// =================== EL RANCHO: LLEGAS TARDE ===================
		b03_rancho_tarde: [
			{ set: { 'flag.b03_adela_llamo': true, 'flag.b03_aurelio_muerto': true } },
			{ text: 'La cancela está abierta. El cencerro no suena: alguien le ha atado el badajo con un cordel.' },
			{ text: 'El rebaño no bala. Cincuenta y tantas Mareep pastan muy juntas, pegadas unas a otras, como en las noches de tormenta. Ninguna chisporrotea.' },
			{ text: '{riolu} se para en seco en la cancela. Las orejas bajas. Los apéndices de la nuca, quietos. Mira el porche. Lleva mirándolo desde antes de que llegaras a verlo tú.', cond: LUC },
			{ text: 'En el escalón del porche hay una mujer sentada. Trenzas castañas, pecas, una camisa verde de trabajo con las mangas remangadas y un maletín de veterinaria a los pies. Tiene dos tazas de café en la barandilla. No bebe de ninguna.' },
			{ text: 'Detrás de ella, la mecedora. Vacía. Se mueve un poco con el viento.' },
			{ text: 'La mujer se levanta. Se limpia las manos en el pantalón aunque no las tiene sucias.' },
			{ say: 'sobrina', text: 'Llegas tarde. —No lo dice como reproche. Lo dice como quien dice la hora—. Soy Adela.' },
			{ say: 'sobrina', text: 'Mi tío se murió esta mañana.' },
			{ text: 'Lo dice así. Sin rodeos. Como se le dice a alguien que su Pokémon no va a poder volver a correr: de cara, y rápido, para que no tenga que adivinarlo.' },
			{ say: 'sobrina', text: 'En la mecedora. Mirando el rebaño. Yo estaba en la cocina haciendo café. Me dijo «sácame uno, que hoy hace fresco». Cuando salí con las dos tazas, ya estaba. Con los ojos abiertos y mirando a las Mareep. Tranquilo.' },
			{ say: 'sobrina', text: 'El médico de Caoba dice que fue el corazón. Que estaba cansado. Setenta años de rancho, y luego… lo de Kalos. Se le notaba desde que volvió. Él decía que era el polvo del heno. Ya.' },
			// Copito (o Nieve) no se separa del jugador
			{ if: COPITO_TUYA, then: [
				{ text: 'Una Mareep con un lazo azul en el cencerro cruza el prado hacia ti. No corre. No bala. **Copito** llega, te huele la mano y se te pega a las piernas, apretada, como cuando la encontraste temblando debajo de un arbusto de Kalos.' },
				{ text: 'No se mueve de ahí. No piensa moverse de ahí.' },
			], else: [
				{ text: 'Una Mareep vieja, sin cencerro, con la lana gris en las puntas, cruza el prado hacia ti. Es **Nieve**, la madre de Copito; la que dormía a los pies de la mecedora todas las noches. No te conoce mucho. Te elige igual.' },
				{ text: 'Se te pega a las piernas, apretada, y no se mueve de ahí. Copito la sigue y se queda detrás, con el lazo azul torcido.' },
			] },
			{ text: 'Adela la mira. Algo se le quiebra en la cara, solo un segundo. Lo arregla enseguida, como quien endereza un cuadro.' },
			{ say: 'sobrina', text: 'Lleva toda la mañana buscando a alguien a quien pegarse. A mí no. Yo huelo a clínica. —Se encoge de hombros—. Tú hueles a él. A heno y a leche. Debiste de pasar aquí una tarde de esas suyas.' },
			{ choice: [
				{ text: '«Lo siento mucho, Adela.»', then: [
					{ say: 'sobrina', text: 'Ya. Yo también. —Se le va la mirada a la mecedora—. No me abraces, que se me corre todo. …Bueno. Va. Uno corto.' },
					{ text: 'Es un abrazo corto. Muy corto. Huele a desinfectante y a café frío. Cuando se separa, se aclara la garganta como si hubiera tosido.' },
				] },
				{ text: '«¿Puedo hacer algo?»', then: [
					{ say: 'sobrina', text: 'Sí. Estar. Ya lo estás haciendo. —Pausa—. Y luego hay una cosa que es para ti. Pero primero respira. Por la nariz. Así.' },
				] },
				{ text: 'Sentarte en el escalón, en silencio.', then: [
					{ text: 'Te sientas en el escalón. El mismo donde te sentaste aquella tarde, con la Leche Mu-mu caliente. Adela se sienta a tu lado. No dice nada. El silencio está bien.' },
					{ say: 'sobrina', text: '…Ahí se sentaba mi tía. Él no dejaba que se sentara nadie. Si te dejó a ti, ya sé todo lo que tengo que saber.' },
				] },
			] },
			{ say: 'sobrina', text: 'Él le decía a todo el mundo que yo trabajaba en una oficina en Trigal, con aire acondicionado, y que me daban alergia los Mareep. Lo dejé hace cinco años. Soy veterinaria. Al otro lado del Monte Mortero. De Mareep, mira tú.' },
			{ say: 'sobrina', text: 'Se lo dije. Varias veces. Él seguía con lo de la oficina. Creo que le gustaba más así: la sobrina lista, en la ciudad. No la que viene a pincharle a las ovejas.' },
			{ intel: { npc: 'sobrina', text: 'Adela Prado, 34. Veterinaria rural al otro lado del Monte Mortero (dejó una oficina en Trigal hace cinco años). Sobrina de Don Aurelio.' } },
			// Faro y Candela: su momento callado
			{ if: FARO_AQUI, then: [
				{ text: 'La Poké Ball de **Faro** se abre sola.' },
				{ text: 'El Ampharos sube los tres escalones del porche, despacio. Se queda delante de la mecedora vacía. Le pone la mano en el respaldo. Un segundo. Igual que le puso la mano en el hombro a Don Aurelio el día que se fue contigo.' },
				{ text: 'Luego se le enciende la esfera de la cola. No parpadea. Es una luz amarilla, quieta, la que usaba para traer de vuelta a las Mareep perdidas de noche. La deja encendida. A pleno día.' },
				{ text: 'Nadie le dice que la apague.' },
			] },
			{ if: 'flag.b02_ampharos && !inParty("ampharos")', then: [
				{ say: 'sobrina', text: '¿Y Faro? ¿Está contigo? Él quería que estuviera contigo. Lo dijo así: «Que tenga una luz». No lo saques ahora si no quieres. O sí. Como veas.' },
			] },
			{ if: CANDELA_AQUI, then: [
				{ text: 'Candela sale de su Poké Ball y se queda mirando el rebaño. Luego trota hacia ellas sin hacer ruido. Se le enciende la punta de la cola. Una lucecita.' },
				{ text: 'Una a una, las demás Mareep se encienden también. *Chss.* *Chss.* No mucho. Lo justo. Todo el prado brilla un poco, en silencio, como velas.' },
			] },
			{ if: 'flag.b02_mareep_rosa', then: [
				{ say: 'sobrina', text: 'La rosa la tienes tú, ¿verdad? Me escribió una carta solo para contármelo. Una carta entera. «Ha nacido una rosa». Él, que no escribía ni la lista de la compra.' },
			] },
			{ if: CHISPITA_FUERA, then: [
				{ say: 'sobrina', text: 'Todas las noches contaba con los dedos. Cincuenta y tres. Y se paraba en «y Chispita no». Todas las noches.' },
			] },
			{ text: 'Tu Pokédex no dice nada. Por primera vez desde Kalos, Rotom no dice nada.' },
			// La carta
			{ say: 'sobrina', text: 'Me dijo que si no llegabas a tiempo te diera esto. Lo escribió hace un mes. Lo tenía en la lata de las galletas, con las escrituras y el jarabe de la tos.' },
			{ text: 'Te da un sobre de papel de estraza. En el remite, con letra grande y apretada: «Para cuando haga falta».' },
			{ give: 'cartaaurelio' },
			{ say: 'sobrina', text: 'No la he leído. Es tuya. Léela aquí, si quieres. Yo voy a… a hacer algo con el café.' },
			{ cutscene: { bg: { type: 'ranch', ground: '#8ab86a', far: '#c97a4a' }, start: 'dark', frames: [
				{ item: 'cartaaurelio', text: 'Abres el sobre. Una hoja de cuaderno, escrita por las dos caras con letra grande, redonda y temblorosa.' },
				{ text: '«Muchach{o|a|e}: si está leyendo esto, es que no me dio tiempo a decírselo en el porche. Ya me perdonará. Nunca he sido bueno con los tiempos: llego tarde a todo menos al ordeño.»' },
				{ text: '«Desde lo de Kalos ando cansado. Volví de aquella grieta morada como si me hubieran quitado unos años. No de encima: de los que me quedaban.»' },
				{ text: '«Copito se va a poner rara. Se pone rara cuando falta alguien. Rásquele detrás de la oreja izquierda. La derecha no.»' },
				{ text: '«Las cosas buenas se quedan en los sitios. Usted es de las que se van, y está bien: alguien tiene que llevárselas a otros sitios.»' },
				{ fx: 'glow', text: '«P. D.: La mecedora no se vende. Que se siente alguien. Aunque sea Copito.»' },
			] } },
			{ if: COPITO_TUYA, then: [
				{ text: 'Copito apoya la cabeza en tu rodilla mientras doblas la carta. Le rascas detrás de la oreja izquierda. La derecha no.' },
			], else: [
				{ text: 'Nieve apoya la cabeza en tu rodilla mientras doblas la carta. Copito se acerca también. Le rascas detrás de la oreja izquierda. La derecha no.' },
			] },
			{ text: 'Adela vuelve sin el café. Ha tirado las dos tazas en el huerto. Se nota en el barro de las botas.' },
			{ say: 'sobrina', text: 'Quédate esta noche. El sofá es tuyo; está duro, pero él dormía la siesta ahí y nunca se quejó. —Mira el prado—. Mañana hablamos de ellas. De qué pasa con el rebaño. Hoy no. Hoy no puedo.' },
			{ quest: 'b03_m5', stage: 'decision' },
		],

		// =================== LA NOCHE Y LA DECISIÓN ===================
		b03_rancho_decision: [
			{ if: 'flag.b03_rancho_sobrina || flag.b03_rancho_jugador || flag.b03_rancho_lemnis', then: [{ call: 'b03_adela_despues' }, { end: true }] },
			{ cutscene: { bg: { type: 'ranch', ground: '#3a4a3a', far: '#1e2238' }, start: 'dark', frames: [
				{ text: 'Esa noche duermes en el sofá de Don Aurelio. Está duro. Huele a heno y a pipa vieja.' },
				{ fx: 'glow', text: 'Por la ventana se ven las Mareep del establo, encendiéndose una a una conforme oscurece. El rancho entero parece un pueblo de noche, visto desde una montaña.' },
				{ text: 'En el porche no se enciende nada. La mecedora es la única cosa oscura de todo el prado.' },
				{ text: 'Copito duerme a tus pies. {riolu} se ha quedado sentado en el escalón, toda la noche, mirando el camino. Como quien hace guardia.' },
			] } },
			{ diary: 'Hoy llegamos tarde al rancho de Don Aurelio. Se fue esta mañana, en su mecedora, mirando a sus Mareep. Adela dice que fue en paz. Yo la creo.\n\nCopito no se separó de mi entrenador{|a|e} en todo el día. {riolu} tampoco. Yo no tengo patas para pegarme a nadie, así que me quedé encendido toda la noche, por si alguien necesitaba luz.\n\nDon Aurelio decía que las cosas buenas se quedan en los sitios. Hoy he guardado el rancho entero en mi memoria: el establo rojo, el pozo, el escalón del porche y las cincuenta y tres. Para que se quede en algún sitio más.\n\nLo vamos a echar mucho de menos. Los Rotom no sabemos muy bien cómo se hace eso. Creo que lo estoy aprendiendo.', cond: 'flag.b01_diario' },
			{ text: 'Por la mañana, Adela está en el escalón del porche con una taza de café. Solo una. La otra mano la tiene vacía y no sabe dónde ponerla.' },
			{ say: 'sobrina', text: 'Buenos días. Hay café. No hay nada más; mi tío vivía de leche y de cabezonería.' },
			{ say: 'sobrina', text: 'Vamos a lo práctico, que si no, no lo hago. El rancho debe dinero. No mucho. Bueno, sí: mucho para un rancho. El pienso del invierno, el tejado del establo, el veterinario…' },
			{ say: 'sobrina', text: '…que era yo y no le cobraba, y aun así. —Resopla—. La casa me la deja a mí. Pero él escribió en tu carta que el rancho no es la casa. Que el rancho son ellas. Y que lo decidamos entre los dos.' },
			{ text: 'Se oye un motor en la Ruta 42. Un coche azul, limpísimo, se para delante de la cancela. Baja un hombre joven, con traje azul, corbata gris y un ramo enorme de lirios blancos.' },
			{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Buenos días. Lamento muchísimo su pérdida. De verdad. Don Aurelio era una persona entrañable; toda la comarca lo dice.' },
			{ say: 'sobrina', text: '¿Y usted quién es? ¿Y cómo se ha enterado? Si no lo sabe ni el cura.' },
			{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Vengo de parte de la **Fundación Raíces de Johto**. Raíces está muy atenta a su comunidad. —Sonríe. Tiene una sonrisa amable de verdad, que es lo peor—. Estas flores son para el rancho.' },
			{ text: 'No dice su nombre. Dice el de la Fundación tres veces en un minuto.' },
			{ if: RAICES_VISTO, then: [
				{ text: '«Fundación Raíces de Johto». Ya has leído ese nombre. En un albarán mojado del Pozo Slowpoke. En una tarjeta, dentro de una caja de Caramelos Lazo. «Destino: por asignar».', cond: 'has("albaranraices")' },
				{ text: '«Fundación Raíces de Johto». Ya has leído ese nombre. En una tarjeta, dentro de una caja de Caramelos Lazo, en Ciudad Iris.', cond: '!has("albaranraices")' },
				{ choice: [
					{ text: '«¿La Fundación Raíces? ¿La del Pozo Slowpoke?»', cond: 'has("albaranraices")', then: [
						{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Hacemos mucho bien en muchos sitios. A veces la gente confunde a quien recoge con quien tira. —No pestañea—. Lo entiendo. Es un día difícil.' },
						{ say: 'sobrina', text: '¿Qué pozo? ¿{jugador}, de qué habla?' },
						{ rep: { lemnis: -2 } },
					] },
					{ text: '«¿La de los caramelos de la Gira?»', then: [
						{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Colaboramos con muchas iniciativas. Los caramelos han hecho muy felices a muchos entrenadores. —Pausa amable—. Pero no he venido a hablar de dulces.' },
					] },
					{ text: 'No decir nada. Mirarlo.', then: [
						{ text: 'Lo miras. Él te mira a ti. Te reconoce. No lo dice, pero se le nota en cómo deja de sonreírle a Adela para sonreírte a ti.' },
					] },
				] },
			] },
			{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Seré breve, que no es momento. La Fundación tiene un programa para ranchos familiares en dificultades. Nos hacemos cargo de las deudas. Todas. Y del rebaño: pienso, cuidados, veterinario.' },
			{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'El rancho seguiría llamándose Rancho Prado. La familia conservaría la casa. Solo pondríamos nuestra placa en la cerca. Una placa pequeñita. —Mira a Adela—. Y a usted le pagaríamos un sueldo por seguir atendiéndolas. Un sueldo de verdad.' },
			{ text: 'Deja el ramo en la barandilla, al lado de la taza de café. Junto a la mecedora.' },
			{ say: 'sobrina', text: '«A los del folleto, ni agua». Eso decía. —Se frota la cara—. Pero también decía que el rancho son ellas. Y ellas comen todos los días.' },
			{ say: 'sobrina', text: 'Dime tú. Él quería que lo decidiéramos los dos, y yo ahora mismo no sé ni dónde he dejado las llaves del carro.' },
			{ prompt: '¿Qué pasa con el rancho Prado?', choice: [
				{ text: '«Que sea tuyo, Adela. Eres su familia.»', then: [
					{ say: 'sobrina', text: '…Mío. —Lo repite como quien prueba una palabra en otro idioma—. Me voy a pasar el resto de la vida oliendo a oveja.' },
					{ say: 'sobrina', text: 'Bueno. Bueno. Me traigo la consulta aquí. Las Miltank de la ruta pueden venir a mí, en vez de ir yo a ellas. Vendo el carro. Pago el pienso. El tejado, que espere. —Respira hondo, por la nariz—. Sale. Justo, pero sale.' },
					{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Lo respeto muchísimo. La oferta seguirá en pie. Siempre. —Deja una tarjeta en la barandilla, sin nombre, con la lemniscata en una esquina—. Las flores, quédenselas igual. Por el difunto.' },
					{ text: 'El coche azul se va por la Ruta 42. Adela tira la tarjeta al cubo del pienso. Los lirios los deja.' },
					{ say: 'sobrina', text: 'Te voy a escribir. Cada mes. Para que sepas cómo están. Y si un mes no te escribo, es que estoy esquilando. ¿Estamos?' },
					{ set: { 'flag.b03_rancho_sobrina': true } },
					{ rep: { johto: 3, lemnis: -2 } },
				] },
				{ text: '«Me quedo yo con el rancho.»', then: [
					{ say: 'sobrina', text: '¿Tú? ¿Que no paras quieto ni dos días? —Te mira un rato largo—. …Él lo sabía. Por eso te dio el cuaderno. «Por si alguna vez alguien le pregunta a usted». Pues ya te han preguntado.' },
					{ say: 'sobrina', text: 'Así lo hacemos: el rancho es tuyo. Yo lo cuido, que vivo al otro lado del monte y no me cuesta nada. Tú pagas el pienso cuando puedas, vienes cuando puedas, y cuando vengas, esquilas. ¿Estamos?' },
					{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Vaya. Qué bonito. —Lo dice como si lo pensara de verdad—. La oferta seguirá en pie. Para usted también, {jugador}. Siempre. Las flores, quédenselas.' },
					{ text: 'El coche azul se va por la Ruta 42. Adela entra en la casa y vuelve con algo en la mano.' },
					{ cutscene: { bg: { type: 'ranch', ground: '#8ab86a', far: '#c9a46a' }, start: 'dark', frames: [
						{ item: 'llaverancho', text: 'Una llave de hierro, grande, oxidada en los dientes, atada a un cencerro diminuto de latón.' },
						{ text: 'En el cencerro hay algo grabado a punta de navaja, con letra torpe: «PRADO».' },
						{ fx: 'light', text: 'Abre la cancela, el establo y la casa. Y la senda del monte, detrás del establo. «Las tres puertas que importan», decía él.' },
					] } },
					{ give: 'llaverancho' },
					{ set: { 'flag.b03_rancho_jugador': true } },
					{ rep: { johto: 3, lemnis: -2 } },
					{ if: COPITO_TUYA, then: [
						{ say: 'sobrina', text: 'Y otra cosa. —Señala a Copito, que no se ha despegado de ti—. Esa no se queda. Ya lo ha decidido ella. Nunca ha querido evolucionar, ¿sabes? Yo creo que esperaba algo. O a alguien.' },
					], else: [
						{ say: 'sobrina', text: 'Y otra cosa. —Señala a Nieve, que no se ha despegado de ti—. Esa no se queda. Ya lo ha decidido ella. Nunca quiso evolucionar, ¿sabes? Mi tío decía que esperaba algo. O a alguien.' },
					] },
					{ choice: [
						{ text: 'Llevártela contigo.', then: [
							{ if: COPITO_TUYA, then: [
								{ pokemon: { sp: 'mareep', lv: 40, nick: 'Copito', nature: 'calm', ability: 'static', moves: ['thunderwave', 'discharge', 'cottonguard', 'powergem'], happy: 230 } },
							], else: [
								{ pokemon: { sp: 'mareep', lv: 40, nick: 'Nieve', nature: 'calm', ability: 'static', moves: ['thunderwave', 'discharge', 'cottonguard', 'powergem'], happy: 230 } },
							] },
							{ set: { 'flag.b03_copito_contigo': true } },
							{ say: 'sobrina', text: 'Cuídamela. Y si evoluciona, mándame una foto. Mi tío no se lo va a creer. —Se calla. Se da cuenta de lo que ha dicho—. …Bueno. Mándamela igual.' },
						] },
						{ text: 'Que se quede en el rancho.', then: [
							{ say: 'sobrina', text: 'También se vale. Así tienes una razón para volver. Ella te va a esperar en la mecedora. Ya verás.' },
						] },
					] },
				] },
				{ text: '«Que se encargue la Fundación. Que coman, que es lo que importa.»', then: [
					{ text: 'Adela no dice nada durante un rato. Mira el ramo. Mira la mecedora.' },
					{ say: 'sobrina', text: '…Bueno. Si es lo que hay que hacer para que coman. —Se le endurece la voz—. Pero la casa no la tocan. Ni la mecedora. Ni el cartel.' },
					{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Por supuesto. Por supuesto que no. —Saca una carpeta azul del coche. Ya traía los papeles hechos. Con el nombre del rancho escrito—. Firme aquí. Y aquí. Y una inicial aquí.' },
					{ text: 'Adela firma. Tarda mucho en la última inicial.' },
					{ text: 'El hombre del ramo saca de la maleta del coche una placa azul con una lemniscata y la atornilla en la cerca, junto a la cancela. Tarda dos minutos. Ya traía el destornillador.' },
					{ say: 'agente_lemnis', as: 'Señor del ramo', text: 'Para sus Pokémon, {jugador}. Han tenido un día muy difícil. Un detalle de la Fundación.' },
					{ give: 'caramelolazo', n: 2 },
					{ say: 'rotom', text: 'Bzzt… Caramelos Lazo. Los mismos de la Gira.' },
					{ say: 'sobrina', text: 'Vete ya, por favor. Con todo el respeto. Vete.' },
					{ text: 'El coche azul se va por la Ruta 42. La placa brilla al sol. Las Mareep la huelen y se apartan.' },
					{ set: { 'flag.b03_rancho_lemnis': true } },
					{ rep: { lemnis: 6, johto: -5 } },
				] },
			] },
			{ quest: 'b03_m5', done: true },
			{ quest: 'b03_m6', stage: 'caoba' },
			{ say: 'sobrina', text: 'Detrás del establo sale la senda del **Monte Mortero**. Te abro la cancela. Al otro lado está **Pueblo Caoba**: por ahí iba él a ver al médico, una vez al mes, y volvía con caramelos para las Mareep. Que no se los podía dar. Y se los daba.' },
			{ say: 'sobrina', text: 'Vete cuando quieras. No hay prisa. Y vuelve. —Lo dice rápido, mirando para otro lado—. Que aquí siempre va a haber leche. Eso también lo decía él, ¿no? Pues eso.' },
		],

		// =================== ADELA, DESPUÉS ===================
		b03_adela_despues: [
			{ if: 'flag.b03_rancho_sobrina', then: [
				{ say: 'sobrina', text: '¡{jugador}! Pasa, pasa. No toques el maletín, que hay agujas. —Se limpia las manos—. Ya tengo tres Miltank de clientas fijas y un Tauros que me odia. Esto va saliendo.' },
				{ say: 'sobrina', text: 'Te escribí una carta. ¿Te llegó? …No, no te ha llegado. No la he mandado. Está en la lata de las galletas. Algún día.' },
			] },
			{ if: 'flag.b03_rancho_jugador', then: [
				{ say: 'sobrina', text: 'Mira quién viene. {El|La|Le} dueñ{o|a|e}. —Se cruza de brazos—. El pienso está pagado hasta el mes que viene. El tejado gotea. Borla se ha comido una zanahoria derecha. Ese es el informe.' },
				{ say: 'sobrina', text: 'Copito te espera en la mecedora todas las tardes. No me mires así: yo no le he enseñado. Lo hace sola.', cond: '!flag.b03_copito_contigo' },
				{ say: 'sobrina', text: '¿Y Copito? ¿Ha evolucionado ya? Dime que sí. Dime que es enorme y que alumbra.', cond: 'flag.b03_copito_contigo && ' + COPITO_TUYA },
				{ say: 'sobrina', text: '¿Y Nieve? ¿Ha evolucionado ya? Dime que sí. A sus años.', cond: 'flag.b03_copito_contigo && !' + COPITO_TUYA },
			] },
			{ if: 'flag.b03_rancho_lemnis', then: [
				{ say: 'sobrina', text: 'Hola. —Mira de reojo la placa azul de la cerca—. Vienen los martes. Muy amables. Traen pienso del bueno, bolsas azules, sin etiqueta. Se van antes de comer.' },
				{ say: 'sobrina', text: 'Las Mareep están bien. Tranquilas. Más tranquilas que nunca, la verdad. —Se queda callada—. Mi tío decía que una Mareep tranquila es una Mareep que está pensando en algo. No sé en qué piensan estas.' },
			] },
			{ say: 'sobrina', text: 'La mecedora sigue ahí. Nadie se sienta. —Se encoge de hombros—. Ya se sentará alguien.' },
		],

		b03_mecedora: [
			{ text: 'La mecedora de Don Aurelio. Madera de pino, el asiento hundido por cuarenta años del mismo hombre, el respaldo gastado en dos sitios exactos donde apoyaba los hombros.' },
			{ text: 'Se mueve un poco cuando sopla el viento. Luego se para.' },
			{ text: 'Copito está hecha una bola en el asiento. Abre un ojo cuando te acercas y lo vuelve a cerrar.', cond: 'flag.b03_rancho_jugador && !flag.b03_copito_contigo' },
			{ text: 'El ramo de lirios sigue en la barandilla. Ya está mustio. Nadie lo ha tirado.', cond: '!flag.b03_rancho_lemnis' },
			{ text: 'Tiene un cojín azul nuevo, con el logo de la Fundación. Alguien lo ha puesto del revés, con el logo hacia abajo.', cond: 'flag.b03_rancho_lemnis' },
			{ text: 'Faro sale de su Poké Ball, se queda de pie junto a la mecedora un momento y vuelve. No hace falta nada más.', cond: FARO_AQUI + ' && flag.b03_dibujo_rancho' },
			{ if: '!flag.b03_dibujo_rancho', then: [
				{ set: { 'flag.b03_dibujo_rancho': true } },
				{ text: 'Debajo del cojín hay un papel doblado en cuatro. Lo saca Adela, que te ha visto mirar.' },
				{ say: 'sobrina', text: 'Lo estaba haciendo la semana pasada. Con los lápices de colores que me quitó cuando yo tenía diez años. Dibujaba fatal. —Lo desdobla—. Mira.' },
				{ cutscene: { bg: { type: 'ranch', ground: '#8ab86a', far: '#e0903a' }, start: 'dark', frames: [
					{ item: 'dibujorancho', text: 'El rancho Prado al atardecer, visto desde el prado. El establo rojo, torcido. El pozo. Las Mareep, cada una con una lucecita amarilla pintada encima.' },
					{ text: 'Y el porche. Y en el porche, la mecedora. Vacía.' },
					{ fx: 'glow', text: 'Él no se dibujó. Él era el que estaba mirando.' },
				] } },
				{ say: 'sobrina', text: '«Uno no se ve desde fuera», decía. —Te lo da—. Quédatelo tú. Yo ya tengo el de verdad.' },
				{ give: 'dibujorancho' },
			] },
		],

		b03_rebano_duelo: [
			{ text: 'El rebaño pasta en el prado. Cuando pasas cerca, las Mareep se apartan sin dejar de comer y, al rozarse, sueltan chispitas. Poco a poco han vuelto a hacerlo.' },
			{ text: 'Al atardecer, sin que nadie silbe, se van solas hacia el establo. En orden. Como él les enseñó.', cond: 'flag.b03_rancho_sobrina || flag.b03_rancho_jugador' },
			{ text: 'Al atardecer se van solas hacia el establo. En fila. Despacio. Sin un balido. Muy obedientes. Demasiado.', cond: 'flag.b03_rancho_lemnis' },
			{ text: '{riolu} se tumba en mitad del prado. En dos minutos tiene tres Mareep dormidas encima. Esta vez se queda más rato que la otra.', cond: LUC },
		],
		b03_copito_duelo: [
			{ text: 'Copito te ve y viene trotando. El lazo azul del cencerro está bien atado: lo ha atado Adela, con un nudo de cirujana.', cond: COPITO_TUYA },
			{ text: 'Copito viene detrás de Nieve, como siempre. El lazo azul del cencerro está bien atado: lo ha atado Adela, con un nudo de cirujana.', cond: '!' + COPITO_TUYA + ' && !flag.b03_copito_contigo' },
			{ text: 'Copito viene sola. Desde que Nieve se fue contigo, ya no sigue a nadie. El lazo azul del cencerro está bien atado: lo ha atado Adela, con un nudo de cirujana.', cond: '!' + COPITO_TUYA + ' && flag.b03_copito_contigo' },
			{ text: 'Te frota la cabeza contra la pierna, *chss*, y luego se sienta a tu lado, muy pegada, mirando hacia el porche. Hacia la mecedora. Le rascas detrás de la oreja izquierda.' },
		],

		// =================== MONTE MORTERO: KIYO ===================
		b03_kiyo: [
			{ set: { 'flag.b03_kiyo_visto': true } },
			{ text: 'En el centro de la sala, un hombre con kimono de kárate blanco, descalzo, golpea la roca enorme. *¡HU!* La roca no se mueve. *¡HA!* La roca sigue sin moverse.' },
			{ say: 'kiyo', as: 'Karateka', text: 'Nueve mil novecientos noventa y ocho. Nueve mil novecientos noventa y nueve. —Se para con el puño en alto—. Si llego a diez mil, se abre un movimiento secreto. Lo sé. Lo noto.' },
			{ say: 'kiyo', text: 'Soy **Kiyo**. Me llaman el Rey del Kárate. Me lo llamo yo, en realidad, pero se ha extendido. Llevo diez años en este monte. Ya casi.' },
			{ if: 'beat("r42_mauro")', then: [
				{ text: 'Por una galería lateral aparece un karateka con una bolsa de pan bajo el brazo. Lo conoces: es **Mauro**, el de la entrada de la Ruta 42. El que salió «a por pan».' },
			], else: [
				{ text: 'Por una galería lateral aparece un karateka joven con una bolsa de pan bajo el brazo.' },
			] },
			{ say: 'kiyo', text: '¡Mauro! ¿Dónde estabas?' },
			{ text: '—Había cola —dice Mauro. El pan, a juzgar por el ruido que hace la bolsa, no es de esta semana.' },
			{ say: 'kiyo', text: 'Discípulo, eso no es una cola. Eso es una estación del año.' },
			{ if: LUC, then: [
				{ text: 'Kiyo se fija en {riolu}. Deja de sonreír. Se le acerca despacio, con las manos a la espalda, y lo mira a los ojos.' },
				{ say: 'kiyo', text: 'Este tiene el aura quieta como un lago. Pero hoy hay una piedra en el fondo. Una piedra que pesa. —Te mira a ti—. A ti te pasa lo mismo. No pregunto. En este monte, cada uno trae su piedra.' },
				{ say: 'kiyo', text: 'Lo mejor para una piedra es golpear otra. Créeme. Llevo diez años.' },
			], else: [
				{ say: 'kiyo', text: 'Traes cara de cargar algo. No pregunto. En este monte, cada uno trae su piedra. Lo mejor para una piedra es golpear otra.' },
			] },
			{ choice: [
				{ text: '«Combatamos.»', then: [
					{ battle: 'kiyo_mortero', lose: 'continue', onWin: [
						{ say: 'kiyo', text: 'Diez mil. —Se mira el puño—. Eso ha sido el golpe diez mil, ¿sabes? El tuyo. El que me has dado. El movimiento secreto era perder.' },
						{ text: 'Kiyo silba entre los dedos. De detrás de la roca sale un Pokémon pequeño, con casco de pelo y guantes enormes: un **Tyrogue**. Se pone en guardia delante de ti. Luego delante de una piedra, por si acaso.' },
						{ say: 'kiyo', text: 'Lleva conmigo desde que era así de chico. Diez años, y no ha querido evolucionar. No sabe qué clase de luchador quiere ser: el que patea, el que golpea o el que gira.' },
						{ say: 'kiyo', text: 'Yo tampoco lo supe hasta los cuarenta. Llévatelo. Que lo descubra contigo. Aquí solo va a aprender a pegarle a una roca, y eso ya lo hago yo.' },
						{ if: '!flag.b03_tyrogue', then: [
							{ set: { 'flag.b03_tyrogue': true } },
							{ pokemon: { sp: 'tyrogue', lv: 38, nature: 'serious', ability: 'guts', moves: ['fakeout', 'machpunch', 'rapidspin', 'bulkup'], happy: 160 } },
						] },
						{ text: 'Mauro, al fondo, levanta el pan como si fuera un trofeo. Nadie sabe por qué. Él tampoco.' },
					], onLose: [
						{ say: 'kiyo', text: 'Bien peleado. Vuelve cuando la piedra pese menos. O más. Las dos cosas sirven.' },
					] },
				] },
				{ text: '«Ahora no.»', then: [
					{ say: 'kiyo', text: 'Bien. La roca y yo no tenemos prisa. Llevamos diez años sin tenerla.' },
				] },
			] },
		],
		b03_kiyo_despues: [
			{ text: '*¡HU! ¡HA!* Kiyo ha empezado la cuenta desde cero. «Uno. Dos. Por si acaso había otro movimiento secreto.»' },
			{ say: 'kiyo', text: '¿Cómo va mi Tyrogue? ¿Ya ha elegido? Si patea, no me lo digas. Si golpea, tampoco. Si gira… bueno, si gira, dímelo, que eso no se lo enseñé yo.', cond: 'flag.b03_tyrogue' },
			{ text: 'Mauro, sentado en una roca, intenta morder el pan. El pan gana.' },
		],

		// =================== PUEBLO CAOBA ===================
		b03_caoba_llegada: [
			{ set: { 'flag.b03_m_aviso': true } },
			{ quest: 'b03_m5', done: true, cond: '!done.b03_m5' },
			{ quest: 'b03_m6', stage: 'caoba', cond: '!quest.b03_m6' },
			{ cutscene: { bg: { type: 'town', roofs: ['#3d2a22', '#4a3a4a', '#2b2f3a'], far: '#6a7a8a', hill: '#3a5a4a' }, start: 'dark', frames: [
				{ fx: 'light', text: 'Sales del Monte Mortero a un valle frío, entre pinos. Abajo, **Pueblo Caoba**: tejados de pizarra, humo en todas las chimeneas y un olor dulzón a caramelo quemado.' },
				{ text: 'Hace frío. El primer frío de verdad desde que llegaste a Johto. Se te mete por las mangas y se queda ahí, como si te conociera.' },
			] } },
			{ text: 'En la plaza hay más gente de la normal para un pueblo tan pequeño, y toda mira hacia el norte. Hacia el camino del **Lago de la Furia**.' },
			{ text: '{riolu} también mira al norte. Las orejas tiesas. Los apéndices de la nuca, temblando un poco. Como cuando oye un ruido que nadie más oye.', cond: LUC },
			{ say: 'pescador_caoba', text: '¡Le digo que evolucionó solo! ¡En el cubo! Lo pesqué a las seis, a las siete le brillaban los ojos, rojos, rojos, ¡y a las siete y cuarto tenía un Gyarados en un cubo de diez litros!' },
			{ say: 'pescador_caoba', text: 'El cubo ha perdido, claro. —Te enseña el asa. Solo el asa—. Y no es el primero. Llevamos tres semanas así. Magikarp que evolucionan sin pelear, sin crecer, sin nada. Y de noche, en el lago, algo rojo. Grande. Rojo como un farol.' },
			{ say: 'rotom', text: 'Bzzt… Los Magikarp evolucionan a nivel 20 y por entrenamiento. No por estar en un cubo. —Pausa—. ¿Verdad? ¿Verdad que no?' },
			{ quest: 'b03_m6', stage: 'lago' },
		],

		b03_caoba_pescador: [
			{ say: 'pescador_caoba', text: 'El lago está al norte, por la Ruta 43. Yo no subo. Desde lo del cubo, no subo. Mi mujer dice que soy un exagerado. Mi mujer no tiene un asa de cubo en el bolsillo.' },
			{ if: 'night', then: [
				{ say: 'pescador_caoba', text: '¿Lo oye? Ese rumor. El agua no tendría que sonar así de noche. Suena como si alguien la estuviera removiendo con una cuchara enorme.' },
			], else: [
				{ say: 'pescador_caoba', text: 'Dicen que el Gyarados rojo solo sale de noche. Yo no lo he visto. Lo ha visto mi cuñado. Mi cuñado ve cosas, pero esta vez lo ha visto también el cura.' },
			] },
			{ say: 'pescador_caoba', text: 'Si sube, llévese algo de Fuego no, que el agua se lo come. Algo Eléctrico. O algo con mucha paciencia.' },
		],

		b03_gym_caoba_cerrado: [
			{ text: 'La persiana del gimnasio está bajada. Hay un cartel pegado con cinta adhesiva, escrito con una caligrafía antigua y muy recta:' },
			{ text: '«Gimnasio cerrado. De viaje. Vuelvo cuando se hiele el lago. — Fredo.»' },
			{ text: 'Debajo, con otra letra: «Con lo revuelto que está el lago, ¿cuándo vuelve, señor Fredo?». Y debajo, otra vez con la letra recta: «Cuando se hiele».' },
		],

		// ----- Lucien (carta) -----
		b03_carta_lucien: [
			{ set: { 'flag.b03_carta_lucien': true } },
			{ text: 'La enfermera Joy te da un sobre arrugado, lleno de sellos de Kalos pegados de cualquier manera. En el remite, con letra de niño y mucha tinta: «LUCIEN PERROT (investigador)».' },
			{ text: 'El sobre huele a pan. A pan de panadería de verdad, del de la madre de Lucien.', cond: 'flag.b02_lucien_madre' },
			{ text: 'El sobre lleva el membrete del laboratorio del profesor Ciprés, tachado con rotulador y corregido a mano: «laboratorio de Lucien (y del profesor)».', cond: 'flag.b02_lucien_cipres' },
			{ text: 'En el sobre hay un dorsal pintado a rotulador: **#101**. «Para la próxima temporada».', cond: 'flag.b02_lucien_publico' },
			{ give: 'cartalucien' },
			{ say: 'joy_johto', text: 'Ha llegado esta mañana. El cartero dice que la carta ha dado la vuelta a medio Johto buscándote. Alguien tiene muchas ganas de que la leas.' },
			{ text: '(Puedes leerla en la mochila, en Objetos clave.)' },
			{ if: 'flag.b03_aurelio_muerto', then: [
				{ text: 'La lees de pie, en el Centro Pokémon. Llegas a la parte de «aquí todo el mundo se va y nadie vuelve» y tienes que parar un momento.' },
				{ text: '{riolu} te da un empujoncito con el hocico en la mano. Sigues leyendo.', cond: LUC },
			] },
		],

		// ----- Gaspar y el Caramelo Furia -----
		b03_gaspar_caoba: [
			{ set: { 'flag.b03_gaspar_caoba': true } },
			{ text: 'Debajo de un toldo de rayas, removiendo una olla de cobre con una cuchara de madera del tamaño de un remo, un hombre fornido con barba y delantal. **Gaspar.**' },
			{ text: 'Te ve. Deja la cuchara. No grita tu nombre, como siempre. Esta vez se limpia las manos despacio y se acerca.' },
			{ if: 'done.b02_t_gaspar', then: [
				{ say: 'gaspar', text: 'Me he enterado. Lo del ranchero de la Ruta 42. El de la leche. Me la regaló sin conocerme de nada, para unos dulces de Iris. —Se le humedece la barba—. Pueblo pequeño. Las cosas llegan antes que la gente.' },
			], else: [
				{ say: 'gaspar', text: 'Me he enterado. Lo del ranchero de la Ruta 42. Pueblo pequeño: las cosas llegan antes que la gente. Dicen que era de los que regalan más de lo que venden.' },
			] },
			{ say: 'gaspar', text: 'Siéntate. Primero comes. Luego, si quieres, hablamos. Y si no quieres, comes otra vez.' },
			{ text: 'Te pone delante un cuenco de caldo con setas y castañas. Está tan caliente que te quema la lengua, y tan bueno que te da igual.' },
			{ text: '{riolu} recibe el suyo en un plato hondo y lo vacía sin respirar.', cond: LUC },
			{ say: 'gaspar', text: '¿Mejor? Mejor. Comer bien es la mitad de la aventura. La otra mitad es tener con quién comer. Hoy la mitad la pongo yo.' },
			{ text: 'Al rato, cuando ya has dejado el cuenco limpio, Gaspar saca de debajo del mostrador una caja de cartón con letras rojas: **Caramelos Furia · Hechos en Caoba desde siempre**.' },
			{ say: 'gaspar', text: 'Ahora, una cosa que me tiene sin dormir. —Saca un caramelo, lo parte, te enseña el interior—. El Caramelo Furia. El dulce de Caoba. Lo compré en la tienda de recuerdos. Pruébalo.' },
			{ text: 'Lo pruebas. Es dulce. Es muy dulce. Es dulce como un anuncio. Y luego no es nada.' },
			{ say: 'gaspar', text: '¿Ves? No tiene furia. No tiene nada. Esto no lo ha hecho nadie que sepa hacer caramelos. Esto lo ha hecho una máquina, en otro sitio, y alguien le ha puesto una caja bonita.' },
			{ say: 'gaspar', text: 'Mira la caja por debajo. Debajo de la pegatina de «Hecho en Caoba» hay otra. Se transparenta: «Envasado en Ciudad Trigal». —Resopla—. Un pueblo entero vendiendo un dulce que no hace. ¿Quién hace eso? ¿Y para qué?' },
			{ say: 'gaspar', text: 'Bueno. Eso no es asunto de un cocinero. Lo que sí es asunto mío es que este pueblo se merece un Caramelo Furia de verdad. La abuela del panadero me ha dado la receta vieja. Me faltan dos cosas.' },
			{ say: 'gaspar', text: '**Miel** de las colmenas de la ladera, que está aquí mismo, en el pueblo. Y una **Miniseta** del Monte Mortero: tostada, da el amargor. Sin amargor, la furia no tiene de qué enfadarse.' },
			{ say: 'gaspar', text: 'Las setas de cueva saben mejor si las ha visto crecer algo con dientes. No preguntes por qué. Y si una seta te mira, déjala, que esa no es para comer.' },
			{ quest: 'b03_s_caramelo', stage: 'ingredientes' },
			{ if: 'has("honey") && has("tinymushroom")', then: [
				{ say: 'gaspar', text: '…Un momento. ¿Eso que llevas en la mochila es miel? ¿Y eso es una Miniseta? ¡Pero bueno! ¡Trae, trae!' },
				{ call: 'b03_gaspar_cocina' },
			] },
		],
		b03_gaspar_falta: [
			{ say: 'gaspar', text: '**Miel** de las colmenas de la ladera y una **Miniseta** de las galerías del Monte Mortero. Con eso, Caoba vuelve a tener caramelo. Sin eso, Caoba tiene una caja.' },
			{ if: 'has("honey")', then: [{ say: 'gaspar', text: 'La miel ya la llevas. Huele desde aquí. Huele a abeja contenta.' }], else: [{ say: 'gaspar', text: 'Las colmenas están en la ladera, aquí en el pueblo. Las abejas son simpáticas si no las miras directamente.' }] },
			{ if: 'has("tinymushroom")', then: [{ say: 'gaspar', text: 'Y esa Miniseta… pequeñita, terca, amarga. Perfecta.' }], else: [{ say: 'gaspar', text: 'Las setas crecen en las paredes húmedas de las galerías del Monte Mortero, cerca del principio. Las pálidas. Las que brillan un poco.' }] },
		],
		b03_gaspar_cocina: [
			{ if: 'has("honey") && has("tinymushroom")', then: [
				{ take: 'honey' },
				{ take: 'tinymushroom' },
			], else: [
				{ say: 'gaspar', text: '…Espera. Aquí falta algo. Sin miel y sin Miniseta no hay furia que valga. Tráemelas y lo hacemos bien.' },
				{ end: true },
			] },
			{ text: 'Gaspar tuesta la Miniseta en una sartén de hierro hasta que huele a bosque. La muele. Pone la miel al fuego, con mantequilla y azúcar moreno, y remueve, y remueve, y remueve.' },
			{ say: 'gaspar', text: 'Ahora viene lo importante. La abuela del panadero dice que el Caramelo Furia hay que hacerlo enfadado. Que si lo haces contento, sale caramelo y ya. Necesito furia.' },
			{ say: 'gaspar', text: 'Yo no sé enfadarme. Lo he intentado. Me sale pena. —Te da la cuchara—. Hazlo tú.' },
			{ choice: [
				{ text: 'Pensar en los folletos de la Fundación.', then: [
					{ text: 'Piensas en el buzón con forma de Mareep, lleno de folletos sin abrir. Remueves con tanta fuerza que la olla da media vuelta.' },
					{ say: 'gaspar', text: '¡Eso! ¡Eso es furia de la buena! ¡Furia con motivo!' },
				] },
				{ text: 'Pensar en el hombre del ramo de lirios.', cond: 'flag.b03_aurelio_muerto', then: [
					{ text: 'Piensas en la sonrisa amable del hombre del ramo. En el destornillador que ya traía. Remueves sin darte cuenta de que estás apretando los dientes.' },
					{ say: 'gaspar', text: 'Uf. Eso no es furia. Eso es rencor. El rencor da un caramelo más oscuro. —Lo huele—. Bueno. También sirve.' },
				] },
				{ text: 'Dejar que {riolu} remueva.', cond: LUC, then: [
					{ text: '{riolu} agarra la cuchara con las dos patas, mira la olla muy serio y suelta un gruñido de aura tan concentrado que el caramelo empieza a burbujear solo.' },
					{ say: 'gaspar', text: '…Nunca había visto un caramelo asustado. Me lo apunto.' },
				] },
				{ text: 'Gritarle al caramelo.', then: [
					{ text: 'Le gritas al caramelo. Medio pueblo se gira. Un señor mayor aplaude, sin saber muy bien por qué.' },
					{ say: 'gaspar', text: '¡Así! ¡Que se entere todo Caoba! Eso es un caramelo con carácter.' },
				] },
			] },
			{ text: 'Gaspar vierte la mezcla en una bandeja de mármol, la estira, la corta en barritas con un cuchillo enorme y espera. Espera mucho. Espera mirándolas, como si fueran a escaparse.' },
			{ text: 'Muerdes una. Cruje. Primero es dulce, luego amarga, y luego te sube un calor por el pecho que no sabes de dónde sale. Te dan ganas de correr. O de abrazar a alguien. O de las dos cosas.' },
			{ say: 'gaspar', text: '¿Ves? Eso es un Caramelo Furia. Furia, no rabia. La furia es lo que te levanta de la silla cuando ya no te quedan ganas. —Te guiña un ojo—. Por eso lo comían aquí antes de cruzar el monte.' },
			{ text: 'Se acerca un niño a mirar. Luego dos. Luego la abuela del panadero, que prueba una barrita, cierra los ojos y no dice nada durante un rato muy largo.' },
			{ give: 'ragecandybar', n: 4 },
			{ give: 'ppup' },
			{ say: 'gaspar', text: 'Para el camino. Y esto otro, de parte de la abuela: dice que era de su marido, que también cocinaba enfadado. No sé qué es, pero hace que los movimientos aguanten más. Úsalo bien.' },
			{ quest: 'b03_s_caramelo', done: true },
			{ say: 'gaspar', text: 'Me quedo unos días. Voy a enseñarles a hacerlos. A los del pueblo, no a los de la tienda. —Baja la voz—. Los de la tienda no me han dejado pasar a la trastienda. Les he pedido ver su cocina y me han dicho que no tienen cocina. Una tienda de caramelos sin cocina. Ahí lo dejo.' },
		],
		b03_gaspar_despues: [
			{ say: 'gaspar', text: '¡{jugador}! Ya tengo a seis vecinos haciendo caramelos. Cuatro lo hacen bien. Dos lo hacen con pena y les salen blandos. Estamos trabajando en ello.' },
			{ if: 'flag.b03_rancho_jugador', then: [
				{ say: 'gaspar', text: 'Oye, me han dicho que ahora tienes un rancho. Con Miltank. —Se le iluminan los ojos—. Algún día iré con una olla. Pero no hoy. Hoy, caramelos.' },
			] },
			{ say: 'gaspar', text: 'Comer bien es la mitad de la aventura. La otra mitad, de momento, es convencer a esta gente de que la miel no se mete en el microondas.' },
		],
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		dibujorancho: { name: 'El rancho al atardecer', pocket: 'key', art: 'rancho_atardecer',
			desc: 'Un dibujo con lápices de colores, con muy mala mano y mucho cariño: el rancho Prado al atardecer, visto desde el prado. El establo rojo, torcido; el pozo; las Mareep con una lucecita encima. Y en el porche, la mecedora. Vacía. Don Aurelio no se dibujó: «uno no se ve desde fuera», decía.' },
		llaverancho: { name: 'Llave del rancho Prado', pocket: 'key',
			desc: 'Una llave de hierro grande, oxidada en los dientes, atada a un cencerro diminuto de latón con «PRADO» grabado a punta de navaja. Abre la cancela, el establo y la casa. «Las tres puertas que importan».' },
		cartalucien: { name: 'Carta de Lucien', pocket: 'key', desc: 'Un sobre arrugado, lleno de sellos de Kalos pegados de cualquier manera. Remite: «LUCIEN PERROT (investigador)».',
			read: '¡Hola, {jugador}!\n\nSoy Lucien. Lucien Perrot. El de la gorra. (Ya no llevo la gorra grande. Me la han escondido.)\n\nTe escribo con horas, como prometí:\n\n· **2:17** — la Puerta zumba. Como siempre.\n· **2:17 del martes** — la Puerta NO zumba. Nada. Silencio. Primera vez desde la inauguración.\n· **2:40 del martes** — pasa una furgoneta sin luces por detrás de la Plaza. Sin luces. ¿Quién conduce sin luces?\n· **Miércoles** — en el parque ya no está el Pokémon raro de las orejas largas que vivía debajo del banco. Le dejaba galletas. Ahora nadie se las come.\n\nNo sé qué quiere decir. Seguro que nada. Pero lo he apuntado, porque los investigadores apuntan.\n\n¿Cómo es Johto? ¿Hay Fisuras pequeñitas? ¿Has visto alguna leyenda? Si ves una, no la toques. O sí, pero hazle una foto antes.\n\nMi madre dice que te diga que comas. El profesor dice que te diga que duermas. Yo te digo que vuelvas. Aquí todo el mundo se va y nadie vuelve, y eso no está bien.\n\nTu amigo (y casi investigador),\n**Lucien**\n\n*P. D.: El dibujo de abajo eres tú con {riolu}. Me ha salido grande la cabeza. La tuya, no la de {riolu}.*' },
	},

	// =====================================================================
	// MISIONES PEQUEÑAS
	// =====================================================================
	quests: {
		b03_s_caramelo: { name: 'Un caramelo con furia', type: 'side', est: 20, stages: {
			ingredientes: 'Gaspar quiere hacer en **Pueblo Caoba** un Caramelo Furia de verdad. Le faltan **Miel** (colmenas de la ladera, en Caoba) y una **Miniseta** (galerías del **Monte Mortero**).',
			hecha: 'Caoba vuelve a tener Caramelos Furia hechos en Caoba. De verdad, esta vez.',
		} },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		huerto_prado: {
			name: 'Huerto del rancho', icon: '🥕', hours: 22, picks: [1, 3],
			text: 'Adela riega el huerto a primera hora, antes de la consulta. «Agarra lo que quieras. Las zanahorias torcidas, que las derechas son de Borla. Eso no ha cambiado».',
			wait: 'El huerto está recién regado. Adela dice que vuelvas otro día.',
			table: [
				{ id: 'oranberry', w: 24, n: [1, 3] }, { id: 'sitrusberry', w: 14, n: [1, 2] }, { id: 'cheriberry', w: 12, n: [1, 2] },
				{ id: 'moomoomilk', w: 14, n: [1, 1] }, { id: 'leppaberry', w: 10, n: [1, 1] }, { id: 'lumberry', w: 3, n: [1, 1] },
			],
		},
		setas_mortero: {
			name: 'Setas de la galería', icon: '🍄', hours: 20, picks: [1, 2],
			text: 'Arrancas con cuidado las setas pálidas de la pared húmeda. Brillan un poco en la mano y luego se apagan.',
			wait: 'Solo quedan setas diminutas, que todavía no han terminado de crecer. Mejor dejarlas.',
			table: [
				{ id: 'tinymushroom', w: 40, n: [1, 2] }, { id: 'bigmushroom', w: 10, n: [1, 1] }, { id: 'balmmushroom', w: 1, n: [1, 1] },
				{ id: 'chestoberry', w: 10, n: [1, 2] },
			],
		},
		vetas_mortero: {
			name: 'Vetas en la roca', icon: '⛏️', hours: 24, picks: [1, 2],
			text: 'Rascas las vetas brillantes de la pared. Algunas piedras se sueltan solas, como si quisieran irse.',
			wait: 'La veta está rascada hasta el fondo. Volverá a asomar algo, con el tiempo.',
			table: [
				{ id: 'hardstone', w: 20, n: [1, 1] }, { id: 'stardust', w: 20, n: [1, 2] }, { id: 'everstone', w: 10, n: [1, 1] },
				{ id: 'thunderstone', w: 4, n: [1, 1] }, { id: 'starpiece', w: 4, n: [1, 1] }, { id: 'nugget', w: 3, n: [1, 1] },
			],
		},
		colmenas_caoba: {
			name: 'Colmenas de la ladera', icon: '🍯', hours: 20, picks: [1, 2],
			text: 'Las colmenas de madera zumban al sol, entre pinos. Un Combee te mira, decide que no eres un problema y te deja tomar un poco de lo que sobra.',
			wait: 'Los Combee están ocupados. Te miran como diciendo: «Hoy no».',
			table: [
				{ id: 'honey', w: 40, n: [1, 2] }, { id: 'pinapberry', w: 12, n: [1, 2] }, { id: 'sitrusberry', w: 10, n: [1, 1] },
				{ id: 'leppaberry', w: 8, n: [1, 1] },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		monte_mortero_kiyo: {
			name: 'El Rey del Kárate', npc: 'kiyo', trainer: 'kiyo_mortero', type: 'Fighting', rec: 47,
			cond: 'visited("monte_mortero")',
			info: [
				{ text: 'En el corazón del **Monte Mortero**, un karateka golpea la misma roca desde hace diez años. Opcional.' },
				{ cond: 'flag.b03_kiyo_visto', text: '**Kiyo**, el Rey del Kárate: 4 Pokémon de tipo **Lucha**, niveles 45 y 46.' },
				{ cond: 'flag.b03_kiyo_visto', text: 'Los tipos **Volador**, **Psíquico** y **Hada** le hacen mucho daño. Ojo con los que golpean primero.' },
				{ cond: 'beat("kiyo_mortero")', text: 'Su **Hitmontop** te baja el Ataque nada más salir (Intimidación). Su **Machamp** nunca falla. ✔ Vencido.' },
			],
		},
	},
};
