// Bloque 1 · Tramo 3: Paso de Rhyhorn → Cueva Brillante → Relieve → Crómlech → Yantra (clímax del Acto I).
export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// ---------------- Ruta 9 ----------------
		ruta9: {
			name: 'Ruta 9 · Paso de Rhyhorn', short: 'Ruta 9', region: 'kalos', kind: 'route', map: { x: 3, y: 88 },
			bg: { type: 'route', ground: '#c9a46a', hill: '#9c7448', far: '#e2c79a' },
			desc: 'Un cañón de roca rojiza con agujas de piedra afiladas como dientes. Aquí no se camina: **se cabalga**. Las huellas de los Rhyhorn llevan siglos marcadas en el suelo, una encima de otra.\n\nAl fondo, en la pared del cañón, se abre la boca de la **Cueva Brillante**.',
			links: ['petroglifo', 'cueva_brillante'],
			onEnter: [{ script: 'b01_r9_entrada', cond: '!quest.b01_m5', once: true }],
			rumors: [
				{ text: 'Los jinetes de Petroglifo dicen que un Rhyhorn nunca olvida un camino. Ni una ofensa.' },
				{ text: 'Un excursionista jura que ha visto un Larvitar en el cañón. En Kalos. Nadie le cree.' },
			],
			route: {
				from: 'petroglifo', to: 'cueva_brillante', length: 6, terrain: 'rocks', rate: 0.2,
				tramos: {
					1: [
						{ text: 'Un campo de rocas puntiagudas corta el paso de pared a pared. A pie es imposible. Un Rhyhorn las pisaría como si fueran hierba.', cond: '!flag.mount_rhyhorn' },
						{ text: 'Tu Rhyhorn cruza el campo de rocas puntiagudas sin inmutarse. Resopla, como si le hicieran cosquillas.', cond: 'flag.mount_rhyhorn' },
						{ block: { cond: 'flag.mount_rhyhorn', msg: 'Las rocas son como cuchillas. A pie no hay forma de cruzar. *Hace falta una montura que sepa pisar piedra: un Rhyhorn.*', dir: 1 } },
					],
					2: [{ trainer: 'jinete_r9_1' }],
					3: [{ text: 'El viento silba entre las agujas de piedra. En las paredes hay dibujos antiguos de Rhyhorn con jinetes encima, pintados con ocre.' }, { item: 'stardust', hidden: true }],
					4: [{ trainer: 'jinete_r9_2' }],
					5: [{ trainer: 'exc_r9', optional: true, label: 'Mira el cañón con unos prismáticos' }, { item: 'revive' }],
					6: [{ text: 'La boca de la Cueva Brillante respira aire frío. Desde dentro llega un resplandor azulado, como si alguien hubiera dejado una luz encendida.' }],
				},
				encounters: {
					rocks: [
						{ sp: 'sandile', lv: [15, 17], w: 35 },
						{ sp: 'hippopotas', lv: [15, 17], w: 35 },
						{ sp: 'helioptile', lv: [15, 17], w: 20, time: 'day' },
						{ sp: 'dwebble', lv: [15, 17], w: 15 },
						{ sp: 'rhyhorn', lv: [16, 18], w: 10 },
						{ sp: 'woobat', lv: [15, 17], w: 15, time: 'night' },
						{ sp: 'larvitar', lv: 16, w: 3, displaced: true },
					],
				},
			},
		},

		// ---------------- Cueva Brillante ----------------
		cueva_brillante: {
			name: 'Cueva Brillante', region: 'kalos', kind: 'cave', map: { x: 5, y: 76 },
			bg: { type: 'cave', crystals: '#8fe6ff' },
			desc: 'Una cueva enorme con las paredes cuajadas de **cristales** que brillan solos, sin luz que los toque. Los geólogos dicen que es por la energía que guardan. Los niños de Relieve dicen que es porque la cueva está contenta.',
			descs: [{ cond: 'flag.b01_cueva_flare_hecha', text: 'Los cristales siguen brillando… salvo en la galería del fondo, donde los arrancaron de cuajo. Allí quedan huecos negros en la pared, como dientes que faltan.' }],
			links: ['ruta9', 'relieve'],
			onEnter: [{ script: 'b01_cueva_entrada', once: true }],
			rumors: [
				{ text: 'Hay Cubone en la cueva. Dicen que algunos llevan huesos que no son de su madre. Mejor no preguntar de quién.' },
				{ cond: 'flag.b01_cueva_flare_hecha', text: 'Desde que se fueron los de rojo, los cristales del fondo ya no brillan. Los geólogos están desconcertados. Los niños de Relieve dicen que la cueva está triste.' },
			],
			route: {
				from: 'ruta9', to: 'relieve', length: 10, terrain: 'cave', rate: 0.22,
				tramos: {
					0: [{ text: 'La luz de los cristales tiñe todo de azul. Tus pasos suenan raros aquí dentro, como si la cueva los repitiera un poco más tarde.' }],
					1: [{ trainer: 'mont_cueva' }],
					2: [{ text: 'Un Cubone te observa desde una repisa, abrazado a su hueso. Cuando lo miras, se da la vuelta.' }, { item: 'thickclub', hidden: true }],
					3: [{ talk: [{ cond: 'beat("tobias_cueva")', script: 'b01_tobias_despues' }, { script: 'b01_tobias_cueva' }], label: 'Un hombre que habla con una cámara invisible', sub: 'Y un Persian que te juzga', icon: '🎬', new: '!beat("tobias_cueva")' }],
					4: [{ trainer: 'cientifica_cueva', optional: true, label: 'Mide los cristales con un aparato que pita' }],
					5: [{ text: 'Las paredes zumban. Muy bajito, en el límite del oído. Cuanto más avanzas, más claro lo oyes: no es la cueva. Son motores.' }, { item: 'superpotion' }],
					6: [
						{ script: 'b01_cueva_flare', once: false, mark: true, cond: '!flag.b01_cueva_flare_hecha' },
						{ block: { cond: 'flag.b01_cueva_flare_hecha', msg: 'Hay gente de rojo al fondo de la galería. No vas a pasar sin que te vean.', dir: 1 } },
						{ text: 'La galería del fondo. Huecos negros donde antes había cristales, cables abandonados y una caja de cartón aplastada que nadie se molestó en llevarse.', cond: 'flag.b01_cueva_flare_hecha' },
					],
					7: [{ text: 'Restos de cinta adhesiva en las rocas. Huellas de botas caras. El que estuvo aquí no esperaba tener que esconderse.' }, { item: 'nugget', hidden: true }],
					8: [{ trainer: 'mont_cueva_2', optional: true, label: 'Descansa sentado sobre una mochila enorme' }],
					9: [{ script: 'b01_fosil', mark: true }],
					10: [{ text: 'Al final del túnel, luz de verdad. Huele a pan y a piedra caliente: **Ciudad Relieve** está justo encima.' }],
				},
				encounters: {
					cave: [
						{ sp: 'machop', lv: [16, 18], w: 40 },
						{ sp: 'woobat', lv: [16, 18], w: 30 },
						{ sp: 'cubone', lv: [16, 17], w: 25 },
						{ sp: 'rhyhorn', lv: 18, w: 10 },
						{ sp: 'onix', lv: 18, w: 10 },
						{ sp: 'solrock', lv: 18, w: 10, time: 'day' },
						{ sp: 'lunatone', lv: 18, w: 10, time: 'night' },
						{ sp: 'mawile', lv: [16, 17], w: 8 },
						{ sp: 'ferroseed', lv: [16, 18], w: 8 },
						{ sp: 'kangaskhan', lv: 19, w: 4 },
					],
				},
			},
		},

		// ---------------- Ciudad Relieve ----------------
		relieve: {
			name: 'Ciudad Relieve', short: 'Relieve', region: 'kalos', kind: 'city', map: { x: 8, y: 64 },
			bg: { type: 'city', roofs: ['#c97a4a', '#e0b070', '#8a5a3a'], hill: '#b08a5a' },
			desc: 'Una ciudad en cuesta, de casas color arena apoyadas unas en otras como si se ayudaran a subir. Algunas calles tienen barandilla. Arriba del todo, el **gimnasio**: una pared de escalada de treinta metros.\n\nEn la plaza, un cartel del Circuito: «Líder de intercambio: **Blanca** (Johto). El líder titular, Lino, está de intercambio en Kanto».',
			links: ['cueva_brillante', 'ruta10'],
			mapNote: 'Gimnasio: Blanca (Normal)',
			onEnter: [
				{ script: 'b01_llegada_relieve', once: true },
				{ script: 'b01_rhi_2', cond: 'beat("blanca_g2") && !flag.b01_rhi_2_hecho', once: false },
			],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Piedras y Fósiles de Relieve', sub: 'Piedras evolutivas y minerales', icon: '💎', action: { shop: 'tienda_piedras' } },
				{ label: 'Gimnasio de Relieve', sub: 'Una pared de escalada de treinta metros', icon: '🧗', action: { go: 'gym_relieve' }, new: '!beat("blanca_g2")' },
				{ label: 'Muro de Escalada', sub: 'Entrenamiento (nivel recomendado 23)', icon: '🥋', action: { training: { cap: 23, trainers: ['muro_relieve_1', 'muro_relieve_2'], wild: [{ sp: 'dwebble', lv: [18, 20] }, { sp: 'binacle', lv: [18, 20] }], coach: 'Monitora del Muro', closed: 'Tu equipo ya trepa como una cabra. Aquí no vas a aprender nada más. Ve a por la medalla.' } } },
				{ label: 'Una chica pelirroja colgada del muro', sub: 'Y un chico dormido en el suelo', icon: '⚽', cond: '!beat("blanca_g2")', new: '!flag.b01_rhi_relieve', talk: [{ cond: '!flag.b01_rhi_relieve', script: 'b01_rhi_relieve_1' }, { script: 'b01_rhi_relieve_2' }] },
				{ label: 'Nate, en las escaleras del gimnasio', sub: 'Dormido. O casi', icon: '💤', cond: 'flag.b01_rhi_2_hecho', talk: [{ script: 'b01_nate_relieve' }] },
				{ label: 'Alexia, la periodista', sub: 'Fotografía el muro', icon: '📷', new: '!flag.b01_alexia_relieve', talk: [{ cond: '!flag.b01_alexia_relieve', script: 'b01_alexia_relieve' }, { script: 'b01_alexia_relieve_2' }] },
				{ label: 'Tablón de anuncios', sub: 'Junto a la puerta del Centro', icon: '📌', new: '!flag.b01_cartel_hector', talk: [{ script: 'b01_cartel_hector' }] },
				{ label: 'Un niño con una gorra de Lino', sub: 'Mira el gimnasio con el ceño fruncido', icon: '🧢', new: '!quest.b01_s_lino || (quest.b01_s_lino == "fan" && beat("blanca_g2"))', doneIf: 'done.b01_s_lino', talk: [
					{ cond: 'done.b01_s_lino', script: 'b01_lino_3' },
					{ cond: 'quest.b01_s_lino == "fan" && beat("blanca_g2")', script: 'b01_lino_2' },
					{ script: 'b01_lino_1' },
				] },
			],
			rumors: [
				{ text: 'La líder de intercambio llora cuando gana. Y cuando pierde. Dicen que su Miltank ya ni se inmuta.' },
				{ text: 'Lino construyó el muro del gimnasio con sus propias manos. Bueno, con las de sus Tyrunt.' },
				{ cond: 'flag.b01_cueva_flare_hecha', text: 'Esta semana han subido camiones por la cuesta, de noche, sin logotipo. Iban hacia el norte, hacia Crómlech.' },
			],
		},
		gym_relieve: {
			name: 'Gimnasio de Relieve', parent: 'relieve', kind: 'gym', bg: { type: 'gym', wall: '#c9a46a', floor: '#8a5a3a' },
			desc: 'El Gimnasio de Relieve es una **pared de escalada** de treinta metros, con presas de colores y entrenadores esperando en las repisas. Lino lo diseñó así. Blanca no.\n\nArriba del todo, una chica de coletas rosas grita algo sobre su falda.',
			descs: [{ cond: 'beat("blanca_g2")', text: 'La pared de escalada, ahora con una escalera de mano apoyada en un lado. Blanca la mandó poner «para las bajadas emocionales».' }],
			spots: [
				{ label: 'Escaladora Capucine', sub: 'Primera repisa', action: { trainer: 'gym_relieve_1' } },
				{ label: 'Vaquero Toño', sub: 'Segunda repisa', action: { trainer: 'gym_relieve_2' } },
				{ label: 'Animadora Paloma', sub: 'Tercera repisa', action: { trainer: 'gym_relieve_3' } },
				{ label: 'Blanca, en lo alto del muro', sub: 'Líder de intercambio · tipo Normal', icon: '🎀', cond: 'beat("gym_relieve_1") && beat("gym_relieve_2") && beat("gym_relieve_3")', new: '!beat("blanca_g2")', talk: [{ cond: 'beat("blanca_g2")', script: 'b01_blanca_despues' }, { cond: 'maxLv >= 25', script: 'b01_blanca_reto_fuerte' }, { script: 'b01_blanca_reto' }] },
				{ label: 'Blanca, en lo alto del muro', sub: 'Demasiado arriba para hablar', icon: '🎀', cond: '!(beat("gym_relieve_1") && beat("gym_relieve_2") && beat("gym_relieve_3"))', talk: [{ script: 'b01_blanca_espera' }] },
			],
		},

		// ---------------- Ruta 10 ----------------
		ruta10: {
			name: 'Ruta 10 · Camino Menhires', short: 'Ruta 10', region: 'kalos', kind: 'route', map: { x: 11, y: 52 },
			bg: { type: 'ruins', ground: '#9cb86a', far: '#c9cfd6', flowers: '#f2d04a' },
			desc: 'Un camino recto entre dos hileras de **menhires**, piedras grises más altas que una casa, plantadas aquí hace miles de años por alguien que no dejó instrucciones. Entre ellas crecen flores amarillas.\n\nNadie sabe para qué sirven. Todo el mundo baja la voz al pasar.',
			links: ['relieve', 'cromlech'],
			enterCond: 'badges >= 2',
			blockedMsg: 'Una barrera de la Liga corta el Camino Menhires. Un cartel: «Tramo de nivel alto. Paso reservado a participantes del Circuito con **dos medallas**». Debajo, a mano: «Sí, la de Relieve cuenta. No, el muro de entrenamiento no cuenta».',
			onEnter: [{ script: 'b01_r10_entrada', cond: '!quest.b01_m7', once: true }],
			rumors: [
				{ text: 'Los Sigilyph vuelan en círculo alrededor de los menhires. Siempre. O eso era antes.' },
				{ text: 'Hay un oficinista que hace flexiones entre los menhires y grita «¡Transformación!». Es inofensivo. Creemos.' },
				{ text: 'Dicen que ha aparecido un Hawlucha de cristal, rosa y brillante, como un vitral roto.' },
			],
			route: {
				from: 'relieve', to: 'cromlech', length: 9, terrain: 'grass', rate: 0.22,
				tramos: {
					1: [{ trainer: 'r10_1' }],
					2: [{ text: 'Uno de los menhires tiene una grieta reciente, de arriba abajo. En el suelo, a su lado, hay flores secas que alguien dejó como ofrenda.' }, { item: 'dawnstone', hidden: true }],
					3: [
						{ script: 'b01_hector_1', mark: true },
						{ talk: [{ cond: 'quest.b01_t_hector == "skitty"', script: 'b01_hector_skitty' }, { script: 'b01_hector_generico' }], label: 'Héctor y su Hawlucha', sub: '¿Superhéroe? ¿Oficinista? Ambas cosas', icon: '🦸', cond: 'flag.b01_hector_1', new: 'quest.b01_t_hector == "skitty"' },
					],
					4: [{ trainer: 'r10_2' }],
					5: [{ script: 'b01_r10_tera', mark: true }, { item: 'superpotion' }],
					6: [{ trainer: 'r10_3', optional: true, label: 'Acaricia a un Eevee dormido junto a un menhir' }],
					7: [{ script: 'b01_az_1', mark: true }],
					8: [{ trainer: 'r10_4' }, { item: 'ppup', hidden: true }],
					9: [{ text: 'Las hileras de menhires se cierran en un círculo. Dentro del círculo hay un pueblo. Y al norte del pueblo, focos encendidos a plena luz del día.' }],
				},
				encounters: {
					grass: [
						{ sp: 'golett', lv: [20, 22], w: 30 },
						{ sp: 'sigilyph', lv: [20, 22], w: 20 },
						{ sp: 'hawlucha', lv: [20, 22], w: 15 },
						{ sp: 'snubbull', lv: [21, 23], w: 15 },
						{ sp: 'electrike', lv: [21, 22], w: 10 },
						{ sp: 'emolga', lv: [20, 22], w: 8 },
						{ sp: 'houndour', lv: [21, 23], w: 12, time: 'night' },
						{ sp: 'nosepass', lv: 21, w: 6 },
						{ sp: 'eevee', lv: 22, w: 5 },
						{ sp: 'fidough', lv: [20, 22], w: 5, displaced: true },
						{ sp: 'hawlucha', lv: 24, w: 3, gimmick: 'tera', tera: 'Fairy' },
					],
				},
			},
		},

		// ---------------- Pueblo Crómlech ----------------
		cromlech: {
			name: 'Pueblo Crómlech', short: 'Crómlech', region: 'kalos', kind: 'town', map: { x: 14, y: 41 },
			bg: { type: 'ruins', fog: true, roofs: ['#5a5f6e', '#6e6a62', '#4a4f5a'], ground: '#8a9a6a' },
			desc: 'Un pueblo pequeño encerrado en un círculo de **menhires** grises, más viejos que cualquier nombre. Casas bajas de piedra, tejados de pizarra, un silencio que pesa.\n\nAl norte, donde antes había un prado, ahora hay vallas, focos y un cartel enorme: **«Proyecto de Conservación Arqueológica Lemnis»**.',
			descNight: 'De noche, los menhires parecen más altos. Desde la excavación del norte llega un zumbido grave y constante, que se te mete en los dientes. Lo has oído antes. En Luminalia.',
			descs: [{ cond: 'flag.b01_cromlech_hecha && flag.b01_delatar', text: 'Un pueblo pequeño entre menhires… lleno de periodistas. Hay furgonetas de televisión aparcadas junto a las vallas de Lemnis, y los vecinos se asoman a las ventanas como si el circo hubiera llegado al pueblo.' }],
			links: ['ruta10', 'ruta11'],
			mapNote: 'Excavación de Lemnis',
			onEnter: [{ script: 'b01_llegada_cromlech', once: true }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Una investigadora frente al menhir mayor', sub: 'Sombrero enorme, libreta más grande', icon: '📓', new: '!flag.b01_irene_1', talk: [{ cond: '!flag.b01_irene_1', script: 'b01_irene_1' }, { script: 'b01_irene_2' }] },
				{ label: 'Un turista muy sospechoso', sub: 'Sombrero de paja, cámara… y gabardina', icon: '📸', new: '!flag.b01_handsome_cromlech', talk: [
					{ cond: 'flag.b01_cromlech_hecha', script: 'b01_handsome_cromlech_despues' },
					{ cond: 'flag.b01_handsome_cromlech', script: 'b01_handsome_cromlech_espera' },
					{ script: 'b01_handsome_cromlech_1' },
				] },
				{ label: 'Excavación de Lemnis', sub: 'Vallas, focos y guardias', icon: '🚧', action: { go: 'excavacion' }, new: 'flag.b01_handsome_cromlech && !flag.b01_cromlech_hecha' },
				{ label: 'Una anciana sentada junto a un menhir', icon: '👵', talk: [{ script: 'b01_anciana_cromlech' }] },
			],
			rumors: [
				{ text: 'Lemnis compró todos los terrenos del norte hace tres meses. Pagó el doble de lo que valían. Nadie paga el doble por un prado.' },
				{ text: 'Por la Ruta 10 aparecen Pokémon que no son de Kalos. Más que en ningún otro sitio. Como si algo los atrajera hacia aquí.' },
				{ cond: 'flag.b01_cromlech_hecha', text: 'La otra noche brillaron todos los menhires a la vez. La última vez que pasó eso, salió una flor gigante de la tierra.' },
			],
		},
		excavacion: {
			name: 'Excavación de Lemnis', parent: 'cromlech', kind: 'area', bg: { type: 'ruins', fissure: true },
			desc: 'Vallas metálicas de tres metros, focos encendidos de día y de noche, y un cartel con la lemniscata: **«Proyecto de Conservación Arqueológica Lemnis. Prohibido el paso»**.\n\nDetrás de la valla, los menhires del norte están cubiertos con lonas, como muebles en una casa cerrada.',
			descs: [{ cond: 'flag.b01_cromlech_hecha', text: 'La valla tiene un remiendo nuevo en el lado oeste, mal cosido. Los guardias miran a todo el mundo como si fuera el culpable. Tú lo eres.' }],
			spots: [
				{ label: 'Guardia de Lemnis', icon: '🛡️', talk: [{ script: 'b01_guardia_excavacion' }] },
				{ label: 'Entrar esta noche con Handsome', sub: 'Cuando tengas a tu equipo listo', icon: '🌙', cond: 'flag.b01_handsome_cromlech && !flag.b01_cromlech_hecha', new: 'true', script: 'b01_cromlech_noche' },
				{ label: 'Mirar con la Lente de Aura', icon: '🔍', cond: 'has("lenteaura")', talk: [{ script: 'b01_excavacion_lente' }] },
				{ label: 'Un científico con un termo de café', sub: 'Sentado en una caja, junto a la valla', icon: '☕', cond: 'flag.b01_cromlech_hecha', new: '!flag.b01_xero_cafe', talk: [{ cond: '!flag.b01_xero_cafe', script: 'b01_xero_cafe' }, { script: 'b01_xero_cafe_2' }] },
			],
		},

		// ---------------- Ruta 11 ----------------
		ruta11: {
			name: 'Ruta 11 · Senda Reflejos', short: 'Ruta 11', region: 'kalos', kind: 'route', map: { x: 23, y: 34 },
			bg: { type: 'route', ground: '#8fb46a', hill: '#7a9a5a', far: '#b9d4e6' },
			desc: 'Un sendero de montaña con olor a pino y, de vez en cuando, a mar. Desde los claros se ve, muy lejos, una torre de piedra sobre un islote: la **Torre Maestra**.',
			links: ['cromlech', 'cueva_reflejos'],
			enterCond: 'flag.b01_cromlech_hecha',
			blockedMsg: 'En la salida del pueblo, un turista con sombrero de paja y —inexplicablemente— gabardina te corta el paso. «¡Psst! Todavía no te vayas. Esta noche te necesito. Búscame junto a la fuente.»',
			rumors: [
				{ text: 'Los karatekas de Yantra suben a entrenar a esta ruta porque desde aquí se ve la Torre. Dicen que da fuerzas.' },
				{ text: 'Un Dedenne de esta ruta capta emisoras de radio con los bigotes. Desde las Fisuras, también capta las de Galar.' },
			],
			route: {
				from: 'cromlech', to: 'cueva_reflejos', length: 7, terrain: 'grass', rate: 0.22,
				tramos: {
					1: [{ trainer: 'r11_1' }],
					2: [{ script: 'b01_lila_ruta11', mark: true }],
					3: [
						{ text: 'Lila camina a tu lado, contándole cosas a su Eevee en voz baja, como a un hermano pequeño. De vez en cuando te mira para ver si la estás escuchando.', cond: 'flag.b01_lila_r11 && !visited("yantra")' },
						{ text: 'Un claro entre pinos. Desde aquí se ve la Torre Maestra, diminuta, sobre el mar.', cond: '!flag.b01_lila_r11 || visited("yantra")' },
						{ item: 'hyperpotion', hidden: true },
					],
					4: [{ script: 'b01_r11_pareja' }, { trainer: 'r11_2' }, { trainer: 'r11_3' }],
					5: [{ script: 'b01_lila_despedida_r11', mark: true }, { item: 'blackbelt' }],
					6: [{ trainer: 'r11_4', optional: true, label: 'Lleva unos auriculares enormes y un Dedenne en el hombro' }],
					7: [{ text: 'El sendero baja hacia una boca de roca pulida que devuelve tu reflejo, un poco deformado: la **Cueva Reflejos**.' }],
				},
				encounters: {
					grass: [
						{ sp: 'hariyama', lv: [23, 25], w: 30 },
						{ sp: 'staravia', lv: [23, 25], w: 30 },
						{ sp: 'sawk', lv: [23, 25], w: 15 },
						{ sp: 'throh', lv: [23, 25], w: 15 },
						{ sp: 'chingling', lv: [22, 24], w: 12 },
						{ sp: 'stunky', lv: [22, 24], w: 15, time: 'night' },
						{ sp: 'nidorino', lv: 23, w: 8 },
						{ sp: 'nidorina', lv: 23, w: 8 },
						{ sp: 'dedenne', lv: [22, 24], w: 5 },
					],
				},
			},
		},

		// ---------------- Cueva Reflejos ----------------
		cueva_reflejos: {
			name: 'Cueva Reflejos', region: 'kalos', kind: 'cave', map: { x: 32, y: 29 },
			bg: { type: 'cave', crystals: '#e8f4ff', dark: true },
			desc: 'Las paredes de esta cueva son **espejos naturales**: roca pulida por el agua durante milenios. Tu reflejo te sigue por todas partes, multiplicado, a veces con un segundo de retraso.\n\nMás adentro, la luz se acaba.',
			links: ['ruta11', 'yantra'],
			rumors: [
				{ text: 'Dicen que en los espejos del fondo se ve lo que uno va a ser. Una señora de Yantra se vio con nietos. No tenía hijos. Ahora tiene tres.' },
				{ text: 'Hay un Sableye que roba linternas. Si se la lleva, no corras detrás. Es lo que quiere.' },
			],
			route: {
				from: 'ruta11', to: 'yantra', length: 8, terrain: 'cave', rate: 0.22,
				tramos: {
					0: [{ text: 'Cien versiones de ti entran a la vez en la cueva. Ninguna parece muy segura.' }],
					1: [{ trainer: 'cr_1' }],
					2: [{ text: 'Tus reflejos te rodean. Ves a cien {riolu} caminando a tu lado. Uno de ellos, muy al fondo, no camina al mismo ritmo que los demás.' }, { item: 'starpiece', hidden: true }],
					3: [
						{ text: 'Más adelante, la cueva se traga la luz. Los espejos se apagan uno a uno, como si alguien cerrara puertas.', cond: '!has("farollana") && !has("linternapi")' },
						{ text: 'Enciendes la luz. Los espejos la multiplican hasta el fondo, como un pasillo de estrellas.', cond: 'has("farollana") || has("linternapi")' },
						{ block: { cond: 'has("farollana") || has("linternapi")', msg: 'Está demasiado oscuro. No ves tu mano, ni tus reflejos, ni el suelo. Necesitarás una luz… Don Aurelio hablaba de un farol. *(Junto a la entrada de la oscuridad hay alguien sentado.)*', dir: 1 } },
						{ talk: [{ script: 'b01_guarda_reflejos' }], label: 'La guarda de la cueva', sub: 'Una señora haciendo punto junto a un farol', icon: '🏮', cond: '!has("farollana") && !has("linternapi")', new: 'true' },
					],
					4: [{ trainer: 'cr_2' }],
					5: [{ text: 'Gotas de agua caen del techo. En cada una, por un instante, se refleja tu luz.' }, { item: 'rarecandy', hidden: true }],
					6: [{ script: 'b01_espejo', mark: true }],
					7: [{ trainer: 'cr_3', optional: true, label: 'Pica cristales con un martillito' }, { item: 'revive' }],
					8: [{ text: 'Al fondo, una luz que no es de espejo: es el sol. Huele a sal. Se oyen gaviotas.' }],
				},
				encounters: {
					cave: [
						{ sp: 'mrmime', lv: [24, 25], w: 30 },
						{ sp: 'solosis', lv: [24, 25], w: 25 },
						{ sp: 'roggenrola', lv: [23, 25], w: 25 },
						{ sp: 'woobat', lv: [23, 25], w: 25 },
						{ sp: 'chingling', lv: [23, 25], w: 15 },
						{ sp: 'wobbuffet', lv: 25, w: 12 },
						{ sp: 'carbink', lv: 25, w: 10 },
						{ sp: 'sableye', lv: 25, w: 8, time: 'night' },
					],
				},
			},
		},

		// ---------------- Ciudad Yantra ----------------
		yantra: {
			name: 'Ciudad Yantra', short: 'Yantra', region: 'kalos', kind: 'city', map: { x: 42, y: 24 },
			bg: { type: 'coast', roofs: ['#3b5bb5', '#e9e3d0', '#c4473a'] },
			desc: 'Una ciudad costera de calles empinadas que bajan hasta una playa dorada. Con la marea baja, un camino de arena une la playa con un islote de roca. Sobre él se alza la **Torre Maestra**, y en lo más alto, la estatua de un Lucario con el puño en alto.\n\nAquí empezó la Megaevolución. La gente de Yantra lo sabe, y se nota en cómo camina.',
			descNight: 'De noche, la Torre Maestra es una sombra contra las estrellas. En lo alto arde una llama. Las farolas del muelle se reflejan en el agua, temblando.',
			links: ['cueva_reflejos'],
			mapNote: 'Gimnasio: Corelia (Lucha) · Torre Maestra',
			onEnter: [{ script: 'b01_llegada_yantra', once: true }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Torre Maestra', sub: 'Al otro lado del camino de la marea', icon: '🗼', action: { go: 'torre_maestra' }, new: 'quest.b01_t_lila == "prueba" || (beat("corelia_g3") && !flag.b01_torre_hecha)' },
				{ label: 'Gimnasio de Yantra', sub: 'Se oyen ruedas y gritos de «¡a tope!»', icon: '🛼', action: { go: 'gym_yantra' }, new: '!beat("corelia_g3")' },
				{ label: 'Playa de la Torre', sub: 'Entrenamiento (nivel recomendado 31)', icon: '🥋', action: { training: { cap: 31, trainers: ['playa_yantra_1', 'playa_yantra_2'], wild: [{ sp: 'tentacool', lv: [26, 28] }, { sp: 'luvdisc', lv: [26, 28] }], coach: 'Karateka de la playa', closed: '¡Ya estás a tope! Aquí solo perderías el tiempo. Ve a la Torre.' } } },
				{ label: 'Niños jugando en la plaza', icon: '🧒', talk: [{ script: 'b01_ninos_yantra' }] },
				{ label: 'Un pescador en el muelle', icon: '🎣', talk: [{ script: 'b01_pescador_yantra' }] },
			],
			rumors: [
				{ text: 'La líder patina por los tejados. Literalmente. El ayuntamiento ya ha dejado de multarla.' },
				{ text: 'Cuentan que la estatua de la Torre se movió una vez, hace cientos de años, la noche en que un Lucario y su entrenador encontraron el vínculo.' },
				{ cond: 'flag.b01_fin', text: 'Todo el mundo habla de la Gira Interregional. Dicen que la Puerta de Luminalia se encendió sola. Dicen muchas cosas.' },
			],
		},
		torre_maestra: {
			name: 'Torre Maestra', parent: 'yantra', kind: 'building', bg: { type: 'tower' },
			desc: 'Piedra gris gastada por el mar, con relieves de Lucario en todas las paredes. En el centro de la sala principal hay un **pebetero de bronce**. Una escalera de caracol sube y sube hasta la azotea, donde espera la estatua.',
			descs: [{ cond: 'flag.b01_torre_hecha', text: 'La Torre Maestra, en silencio. En el pebetero arde la llama de siempre. Cuando pasas, los aprendices te saludan con una inclinación de cabeza. Ya no eres una visita.' }],
			spots: [
				{ label: 'Cornelio', sub: 'Gurú de la Megaevolución', icon: '🧘', talk: [{ script: 'b01_cornelio' }] },
				{ label: 'Acompañar a Lila a la Prueba de la Llama', sub: 'Te lo pidió casi sin mirarte', icon: '🔥', cond: 'quest.b01_t_lila == "prueba"', new: 'true', script: 'b01_lila_llama' },
				{ label: 'La Prueba de la Torre', sub: 'Cornelio te espera en la azotea', icon: '✨', cond: 'beat("corelia_g3") && !flag.b01_torre_hecha', new: 'true', talk: [
					{ cond: '!done.b01_t_lila', script: 'b01_torre_espera_lila' },
					{ cond: '!inParty("riolu") && !inParty("lucario") && (owns("riolu") || owns("lucario"))', script: 'b01_torre_sin_riolu' },
					{ script: 'b01_torre_prueba' },
				] },
				{ label: 'Lila', sub: 'Le está contando algo a su Eevee', icon: '🌿', cond: 'done.b01_t_lila', talk: [{ script: 'b01_lila_torre' }] },
				{ label: 'Estatua del Lucario', icon: '🗿', talk: [{ script: 'b01_estatua' }] },
			],
		},
		gym_yantra: {
			name: 'Gimnasio de Yantra', parent: 'yantra', kind: 'gym', bg: { type: 'gym', wall: '#3b5bb5', floor: '#e9e3d0' },
			desc: 'El Gimnasio de Yantra es una **pista de patinaje** en forma de ocho: rampas, barandillas y entrenadores de tipo Lucha sobre ruedas. Para llegar hasta Corelia hay que cruzar la pista entera.\n\nTe prestan unos patines. Te prestan también un casco. Por algo será.',
			spots: [
				{ label: 'Patinadora Elsa', sub: 'Primera rampa', action: { trainer: 'gym_yantra_1' } },
				{ label: 'Cinturón Negro Hugues', sub: 'La curva del ocho', action: { trainer: 'gym_yantra_2' } },
				{ label: 'Luchadora Ninon', sub: 'Última barandilla', action: { trainer: 'gym_yantra_3' } },
				{ label: 'Corelia', sub: 'Líder · tipo Lucha', icon: '🛼', cond: 'beat("gym_yantra_1") && beat("gym_yantra_2") && beat("gym_yantra_3")', new: '!beat("corelia_g3")', talk: [{ cond: 'beat("corelia_g3")', script: 'b01_corelia_despues' }, { cond: 'maxLv >= 34', script: 'b01_corelia_reto_tope' }, { script: 'b01_corelia_reto' }] },
				{ label: 'Corelia', sub: 'Pasa patinando a toda velocidad', icon: '🛼', cond: '!(beat("gym_yantra_1") && beat("gym_yantra_2") && beat("gym_yantra_3"))', talk: [{ script: 'b01_corelia_espera' }] },
			],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Ruta 9 -----
		jinete_r9_1: { name: 'Solange', cls: 'Jinete', ai: 2, team: [{ sp: 'rhyhorn', lv: 18 }, { sp: 'hippopotas', lv: 17 }],
			intro: '¡Eh, jinete! En el Paso hay una regla: quien se cruza, saluda. Y aquí saludamos así.', win: 'Buen trote. Mi Rhyhorn dice que el tuyo pisa demasiado fuerte. Viniendo de él, es un piropo.' },
		jinete_r9_2: { name: 'Basile', cls: 'Jinete', ai: 2, team: [{ sp: 'sandile', lv: 17 }, { sp: 'rhyhorn', lv: 19 }],
			intro: 'Desde lo de las Fisuras, los Rhyhorn están nerviosos. Huelen cosas que no son de aquí. ¿Tú hueles raro?', win: 'No, tú hueles normal. Es tu Riolu el que huele a otra parte.' },
		exc_r9: { name: 'Armel', cls: 'Excursionista', ai: 2, team: [{ sp: 'dwebble', lv: 17 }, { sp: 'helioptile', lv: 18 }],
			intro: 'Llevo tres días buscando un Larvitar que vi en este cañón. ¡Un Larvitar! ¡En Kalos! Nadie me cree.', win: 'Si lo ves, atrápalo. O no. Pero dime que existía.' },

		// ----- Cueva Brillante -----
		mont_cueva: { name: 'Aubin', cls: 'Montañero', ai: 2, team: [{ sp: 'machop', lv: 18 }, { sp: 'onix', lv: 18 }],
			intro: 'Cuidado dónde pisas: esta semana se han hundido tres galerías. Y no fue la cueva. Alguien está cavando.', win: 'Si sigues hacia el fondo, ojo. Hay gente vestida de rojo. Y no son bomberos.' },
		cientifica_cueva: { name: 'Hélène', cls: 'Científica', ai: 2, team: [{ sp: 'lunatone', lv: 18 }, { sp: 'mawile', lv: 18 }],
			intro: '¿Sabes cuánto brillaban estos cristales hace un mes? Un treinta por ciento más. Alguien se está llevando la luz.', win: 'Treinta por ciento. Que alguien lo escriba en algún sitio, por favor.' },
		mont_cueva_2: { name: 'Roland', cls: 'Montañero', ai: 2, team: [{ sp: 'cubone', lv: 18 }, { sp: 'rhyhorn', lv: 19 }],
			intro: 'Mi Cubone encontró un hueso en esta cueva y no lo suelta. No le pregunto de quién era. Él tampoco me lo cuenta.', win: 'Relieve está ahí arriba. Si vas al gimnasio, lleva guantes. La pared raspa.' },
		recluta_flare_c1: { name: 'Recluta', cls: 'Team Flare', npc: 'recluta_flare', ai: 2, team: [{ sp: 'houndour', lv: 17 }, { sp: 'croagunk', lv: 18 }],
			intro: 'Esta es una zona de belleza restringida. Tú, con esa ropa, no cumples los requisitos.', win: '¡Mi traje! ¡Me has arrugado el traje! ¿Sabes lo que cuesta planchar esto en una cueva?' },
		recluta_flare_c2: { name: 'Recluta', cls: 'Team Flare', npc: 'recluta_flare', ai: 2, team: [{ sp: 'litleo', lv: 18 }, { sp: 'scraggy', lv: 17 }],
			intro: 'El mundo nuevo será bello. Y tú no saldrás en la foto.', win: 'Vale. Tú sí sales en la foto. Pero borrosa.' },
		bastien_2: { name: 'Bastien', cls: 'Rival', npc: 'bastien', ai: 3, iv: 24,
			team: [
				{ sp: 'frogadier', lv: 19, moves: ['waterpulse', 'quickattack', 'smackdown', 'smokescreen'], ability: 'torrent' },
				{ sp: 'fletchinder', lv: 18, moves: ['flamecharge', 'peck', 'quickattack', 'ember'], ability: 'flamebody' },
				{ sp: 'litleo', lv: 17, moves: ['ember', 'headbutt', 'workup', 'nobleroar'], ability: 'rivalry' },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: 'Diez minutos. Solo quiero diez minutos sin pensar en cláusulas. ¡Frogadier, vamos!',
			win: 'Gracias. De verdad. Hacía días que no pensaba en nada durante diez minutos.',
			lose: 'Lo siento. Necesitaba ganar algo hoy. Aunque fuera esto.' },
		tobias_cueva: { name: 'Tobías', cls: 'Jefe de piso', npc: 'tobias', ai: 3, iv: 22,
			team: [
				{ sp: 'spoink', lv: 18, moves: ['psybeam', 'confuseray', 'magiccoat', 'zenheadbutt'] },
				{ sp: 'woobat', lv: 18, moves: ['aircutter', 'attract', 'confusion', 'imprison'] },
				{ sp: 'persian', lv: 20, moves: ['fakeout', 'bite', 'payday', 'taunt'], ability: 'technician', item: 'silkscarf' },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Música dramática, por favor! …Bueno, imagínensela. ¡EL JEFE DE PISO HA APARECIDO!',
			win: '¡Y el jefe de piso cae! ¡Patrocinadores, eso es lo que yo llamo un giro de guion!',
			lose: '¡El jefe de piso sigue en pie! ¡No cambien de canal!' },

		// ----- Gimnasio de Relieve -----
		gym_relieve_1: { name: 'Capucine', cls: 'Escaladora', ai: 3, team: [{ sp: 'aipom', lv: 19 }, { sp: 'furret', lv: 20 }],
			intro: 'Blanca nos trajo de Johto y Lino nos dejó la pared. ¡Ahora somos un gimnasio bilingüe!', win: '¡Sigue subiendo! ¡No mires abajo! …Vale, mira: mi Aipom se está llevando tu gorra.' },
		gym_relieve_2: { name: 'Toño', cls: 'Vaquero', ai: 3, team: [{ sp: 'tauros', lv: 20 }, { sp: 'stantler', lv: 20 }],
			intro: 'En el rancho de Blanca, los Tauros suben cuestas así todos los días. Bueno, cuestas más planas. Bastante más planas.', win: '¡Yija! …Perdón. En Kalos no se dice «yija», ¿verdad?' },
		gym_relieve_3: { name: 'Paloma', cls: 'Animadora', ai: 3, team: [{ sp: 'girafarig', lv: 20 }, { sp: 'dunsparce', lv: 21 }],
			intro: '¡Dame una B! ¡Dame una L! ¡Dame… oye, no me estás dando nada!', win: '¡Uy! Blanca va a llorar. Siempre llora. Súbele pañuelos.' },
		blanca_g2: { name: 'Blanca', cls: 'Líder', npc: 'blanca', ai: 4, iv: 28, reward: 2400,
			team: [
				{ sp: 'clefairy', lv: 21, moves: ['disarmingvoice', 'attract', 'defensecurl', 'gravity'], ability: 'cutecharm', item: 'oranberry', nature: 'bold' },
				{ sp: 'furfrou', lv: 22, moves: ['headbutt', 'bite', 'sandattack', 'babydolleyes'], ability: 'furcoat', item: 'silkscarf', nature: 'adamant' },
				{ sp: 'miltank', lv: 23, moves: ['rollout', 'milkdrink', 'attract', 'stomp'], ability: 'thickfat', item: 'sitrusberry', nature: 'impish' },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Miltank, a rodar! ¡Rueda, rueda, rueda!',
			win: '¿Q-qué? ¿Ya está? ¿Ya se ha acabado?',
			lose: '¡Gané! ¡Gané! ¡Waaah, qué emoción, voy a llorar! …Ya estoy llorando.' },

		// ----- Relieve: Muro de Escalada (entrenamiento) -----
		muro_relieve_1: { name: 'Fanny', cls: 'Escaladora', ai: 2, team: [{ sp: 'machop', lv: 20 }, { sp: 'onix', lv: 19 }],
			intro: 'Tres presas más y bajamos a por un pain au chocolat. Pero primero, combate.', win: 'Buen agarre. Se nota en cómo das órdenes.' },
		muro_relieve_2: { name: 'Timéo', cls: 'Escalador', ai: 2, team: [{ sp: 'diggersby', lv: 20 }, { sp: 'binacle', lv: 19 }],
			intro: 'Entreno aquí porque en el gimnasio me caigo. Aquí también me caigo, pero menos alto.', win: 'Mañana más. Siempre mañana más.' },

		// ----- Relieve: rival -----
		rhi_2: { name: 'Rhi', cls: 'Rival', npc: 'rhi', ai: 3, iv: 25,
			team: [
				{ sp: 'farfetchdgalar', lv: 21, moves: ['rocksmash', 'brutalswing', 'furycutter', 'detect'], ability: 'steadfast', item: 'leek' },
				{ sp: 'corvisquire', lv: 21, moves: ['pluck', 'furyattack', 'scaryface', 'taunt'], ability: 'keeneye' },
				{ sp: 'raboot', lv: 22, moves: ['doublekick', 'flamecharge', 'quickattack', 'headbutt'], ability: 'blaze', item: 'charcoal' },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Saque de centro! ¡Raboot, a la delantera!',
			win: '¡Fuera de juego! …No, no hay fuera de juego. Ganaste. Ganaste limpio.',
			lose: '¡GOLAZO! ¡Toma ya! ¡Eso es un golazo por la escuadra!' },

		// ----- Ruta 10 -----
		r10_1: { name: 'Clarisse', cls: 'Pokéfan', ai: 2, team: [{ sp: 'snubbull', lv: 22 }, { sp: 'electrike', lv: 21 }],
			intro: '¿Los menhires? De noche zumban. Mi Snubbull les ladra. Nunca había ladrado a una piedra.', win: 'Si te quedas a dormir en Crómlech, ponte tapones.' },
		r10_2: { name: 'Yvette', cls: 'Ornitóloga', ai: 2, team: [{ sp: 'sigilyph', lv: 23 }, { sp: 'hawlucha', lv: 22 }],
			intro: 'Los Sigilyph siempre vuelan en círculo alrededor de los menhires. Desde hace un mes, vuelan en línea recta. Hacia el norte. Como si huyeran.', win: 'Huyen de Crómlech. Llevo un mes diciéndolo. Nadie me pregunta.' },
		r10_3: { name: 'Solène', cls: 'Chica Moderna', ai: 2, team: [{ sp: 'eevee', lv: 23 }, { sp: 'emolga', lv: 22 }],
			intro: 'A mi Eevee lo encontré dormido junto a un menhir. Dicen que si un Pokémon duerme junto a una de estas piedras, sueña lo que la piedra recuerda. Anoche lloró.', win: 'Él tampoco me quiso contar qué soñó.' },
		r10_4: { name: 'Félix', cls: 'Montañero', ai: 2, team: [{ sp: 'golett', lv: 23 }, { sp: 'nosepass', lv: 24 }],
			intro: 'A este Golett lo encontré dormido en un menhir. Tiene en el pecho una runa que no sale en ningún libro. Ni en los de la biblioteca de Sinnoh, y eso que pregunté.', win: 'Si ves en Crómlech a una investigadora bajita con sombrero, no le digas bajita. Hazme caso.' },
		hector_r10: { name: 'Héctor', cls: 'Héroe enmascarado', npc: 'hector', ai: 2, iv: 20,
			team: [
				{ sp: 'machop', lv: 21 },
				{ sp: 'hawlucha', lv: 23, moves: ['brickbreak', 'wingattack', 'encore', 'honeclaws'], ability: 'limber' },
			],
			intro: '¡En nombre de la justicia… y de mi Hawlucha, que se aburre!',
			win: '¡Derrotado con honor! ¡Así caen los héroes en el capítulo tres, para levantarse en el cuatro!',
			lose: '¡La justicia ha vencido! …La justicia era yo, ¿verdad? Sí. Vale. ¡Bien!' },

		// ----- Crómlech -----
		sera_1: { name: 'Serafina Lemnis', cls: 'Heredera', npc: 'sera', ai: 5, iv: 31, reward: 3000, bg: 'ruins',
			team: [
				{ sp: 'pawniard', lv: 25, moves: ['metalclaw', 'assurance', 'torment', 'scaryface'], ability: 'defiant', item: 'blackglasses', nature: 'adamant' },
				{ sp: 'kirlia', lv: 26, moves: ['psybeam', 'drainingkiss', 'calmmind', 'magicalleaf'], ability: 'trace', item: 'eviolite', nature: 'modest' },
			],
			intro: 'Pawniard. Con cuidado: es una demostración, no una pelea de taberna.',
			win: 'Bien. Muy bien.',
			lose: 'Era de esperar.' },

		// ----- Ruta 11 -----
		r11_1: { name: 'Sacha', cls: 'Karateka', ai: 2, team: [{ sp: 'throh', lv: 24 }, { sp: 'sawk', lv: 24 }],
			intro: 'Entreno en esta ruta porque desde aquí se ve la Torre Maestra. Cuando estoy cansado, la miro. Sigo cansado, pero con vistas.', win: '¿Vas a la Torre? Saluda a la estatua de mi parte. Es la única que nunca me ha ganado.' },
		r11_2: { name: 'Maëlle', cls: 'Luchadora', ai: 2, team: [{ sp: 'hariyama', lv: 24 }, { sp: 'staravia', lv: 24 }],
			intro: '¡Eh, la aprendiz de la Torre! ¿Traes público? ¡Mejor! Mi hermano y yo vamos de dos en dos.', win: 'Ahora va mi hermano. Él pega más fuerte. Yo pego más bonito.' },
		r11_3: { name: 'Gabin', cls: 'Luchador', ai: 2, team: [{ sp: 'nidorino', lv: 24 }, { sp: 'sawk', lv: 25 }],
			intro: 'Mi hermana dice que yo pego más fuerte. Es verdad. Lo que no dice es que también pego peor.', win: 'Vale. A la playa. A entrenar. Otra vez. Con ella.' },
		r11_4: { name: 'Nadia', cls: 'Técnica de radio', ai: 2, team: [{ sp: 'dedenne', lv: 25 }, { sp: 'chingling', lv: 24 }],
			intro: 'Mi Dedenne capta la radio con los bigotes. Desde las Fisuras, a veces capta emisoras de Galar. Ayer me enteré del resultado de un partido.', win: 'Ganó el equipo de casa, por cierto. Dos a uno. Con un gol de un tal Nueve.' },

		// ----- Cueva Reflejos -----
		cr_1: { name: 'Pascal', cls: 'Mimo', ai: 2, team: [{ sp: 'mrmime', lv: 25 }],
			intro: '(El mimo no dice nada. Hace como que abre una puerta invisible. Luego como que te reta. Luego como que te gana.)', win: '(El mimo hace como que llora. Y lo hace muy bien.)' },
		cr_2: { name: 'Séverine', cls: 'Psíquica', ai: 2, team: [{ sp: 'solosis', lv: 25 }, { sp: 'wobbuffet', lv: 25 }],
			intro: 'En los espejos de esta cueva se ve lo que vas a ser. Yo me vi con canas. Gracias, cueva.', win: 'Mira bien a tu compañero en los espejos del fondo. Hazme caso.' },
		cr_3: { name: 'Rosalie', cls: 'Montañera', ai: 2, team: [{ sp: 'roggenrola', lv: 25 }, { sp: 'carbink', lv: 26 }],
			intro: 'Este cristal vale una fortuna en Luminalia. Lemnis paga el doble que nadie. ¿Para qué querrá tanto cristal una empresa de puertas?', win: 'Bah. Se lo vendo igual. El alquiler no se paga con preguntas.' },

		// ----- Gimnasio de Yantra -----
		gym_yantra_1: { name: 'Elsa', cls: 'Patinadora', ai: 3, team: [{ sp: 'mankey', lv: 26 }, { sp: 'meditite', lv: 27 }],
			intro: '¡Ruedas y puños! Es lo que Corelia llama «lucha sobre ruedas». Nadie más lo llama así.', win: '¿Cómo se frena? ¡Yo tampoco lo sé!' },
		gym_yantra_2: { name: 'Hugues', cls: 'Cinturón Negro', ai: 3, team: [{ sp: 'pancham', lv: 27 }, { sp: 'timburr', lv: 27 }],
			intro: 'Corelia nos entrena a las seis de la mañana. En patines. En la playa. En la arena no se puede patinar. Lo sabemos.', win: '¡Ya sé por qué nos entrena en la arena! …No. No lo sé.' },
		gym_yantra_3: { name: 'Ninon', cls: 'Luchadora', ai: 3, team: [{ sp: 'scraggy', lv: 27 }, { sp: 'hitmonchan', lv: 28 }],
			intro: 'Dicen que la estatua de la Torre se mueve cuando nadie la mira. Así que yo la miro todo el rato. Por si acaso.', win: '…Tú también la has mirado, ¿a que sí?' },
		corelia_g3: { name: 'Corelia', cls: 'Líder', npc: 'corelia', ai: 4, iv: 28, reward: 3200,
			team: [
				{ sp: 'mienfoo', lv: 29, moves: ['fakeout', 'forcepalm', 'uturn', 'detect'], ability: 'regenerator', item: 'expertbelt', nature: 'jolly' },
				{ sp: 'machoke', lv: 30, moves: ['crosschop', 'bulkup', 'rockslide', 'knockoff'], ability: 'guts', item: 'muscleband', nature: 'adamant' },
				{ sp: 'hawlucha', lv: 31, moves: ['flyingpress', 'aerialace', 'highjumpkick', 'roost'], ability: 'unburden', item: 'sitrusberry', nature: 'jolly' },
				{ sp: 'lucario', lv: 32, moves: ['forcepalm', 'metalclaw', 'bonerush', 'extremespeed'], ability: 'justified', item: 'blackbelt', nature: 'adamant' },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Vamos a hacer RUIDO! ¡A TOPE!',
			win: '¡Uaaah! ¡Qué combate! ¡Me tiemblan las ruedas!',
			lose: '¡Así se hace, Lucario! ¡Vuelve cuando quieras, que la pista no se cierra nunca!' },
		corelia_torre: { name: 'Corelia', cls: 'Heredera de la Megaevolución', npc: 'corelia', ai: 5, iv: 31, reward: 4000, gimmick: 'mega', ace: 'lucario', bg: 'tower',
			team: [
				{ sp: 'lucario', lv: 34, moves: ['aurasphere', 'flashcannon', 'bonerush', 'extremespeed'], ability: 'justified', item: 'lucarionite', nature: 'hasty' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: '¡Lucario! ¡Respondamos al vínculo! ¡MEGAEVOLUCIÓN!',
			win: 'Eso… eso no ha sido un combate. Ha sido una conversación.',
			lose: 'Lo has visto, ¿verdad? Tu compañero no se ha rendido ni un segundo.' },

		// ----- Yantra: Playa de la Torre (entrenamiento) -----
		playa_yantra_1: { name: 'Agathe', cls: 'Karateka', ai: 2, team: [{ sp: 'machoke', lv: 28 }, { sp: 'throh', lv: 27 }],
			intro: '¡Cien flexiones en la arena y luego combate! …Bueno, primero el combate.', win: 'Vale. Cien flexiones. Para mí.' },
		playa_yantra_2: { name: 'Yanis', cls: 'Cinturón Negro', ai: 2, team: [{ sp: 'hariyama', lv: 28 }, { sp: 'mienfoo', lv: 28 }],
			intro: 'Las olas son el mejor sparring: nunca se cansan y nunca se ofenden.', win: 'Tú tampoco te cansas. ¿Te ofendes?' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== Ruta 9 ===================
		b01_r9_entrada: [
			{ quest: 'b01_m5', stage: 'paso' },
		],

		// =================== Cueva Brillante ===================
		b01_cueva_entrada: [
			{ quest: 'b01_m5', stage: 'cueva' },
			{ text: 'Nada más entrar, {riolu} se detiene. Levanta los apéndices de la cabeza y se queda mirando hacia el fondo de la cueva, muy quieto.' },
			{ say: 'rotom', text: '¡Bzzt! Aquí dentro hay mucho ruido de energía. Los cristales emiten, ¡eso es normal! Pero al fondo hay algo más. Algo que zumba… como la Puerta.' },
		],

		// ---- Tobías, jefe de piso ----
		b01_tobias_cueva: [
			{ text: 'Un hombre con chaqueta verde y amarilla habla a una cámara que no existe, iluminado por los cristales. A su lado, un Persian enorme con un collar de pedrería bosteza con desprecio.' },
			{ if: '!quest.b01_t_tobias', then: [
				{ say: 'tobias', as: 'Hombre de la chaqueta', text: '¡Hola, hola, patrocinadores! ¡Episodio cuarenta y ocho! ¡La mazmorra de esta temporada: la Cueva Brillante! Soy Tobías, y ella es Duquesa, la verdadera estrella del programa.' },
				{ text: 'Duquesa te mira de arriba abajo. Luego mira a {riolu}. Luego mira hacia otro lado, como si los dos fueran una decepción personal.' },
			], else: [
				{ say: 'tobias', text: '¡{jugador}! ¡Mi invitad{o|a|e} favorit{o|a|e} de la costa! ¡Patrocinadores, miren quién ha vuelto! ¡Los índices de audiencia acaban de subir un cuatro por ciento!' },
				{ text: 'Duquesa, el Persian, te dedica una mirada que dice claramente: «otra vez tú».' },
			] },
			{ say: 'tobias', text: 'Escucha, que tengo exclusiva: ¡giro de guion! La producción me ha comunicado que esta temporada… ¡el jefe de piso de la mazmorra SOY YO!' },
			{ say: 'tobias', text: '¿Quién es la producción? Yo. ¿Quién me lo ha comunicado? También yo. Es un equipo pequeño. Muy unido.' },
			{ say: 'tobias', text: 'Ah, y otra exclusiva, gratis: al fondo de esta cueva hay un piso secreto. Gente de rojo, gafas de sol, mucha producción y poco guion. Yo de ti iría con cuidado. Yo de mí ya he decidido no ir.' },
			{ choice: [
				{ text: 'Aceptar el reto del jefe de piso.', then: [
					{ battle: 'tobias_cueva', onWin: [
						{ say: 'tobias', text: '¡Patrocinadores, gracias por las Pociones! Las vamos a necesitar todas.' },
						{ text: 'Tobías rebusca en su mochila y saca una caja de cartón con una pegatina dibujada a mano que dice «BOTÍN DE BRONCE».' },
						{ say: 'tobias', text: '¡Recompensa por vencer al jefe de piso! Es tradición. Bueno, es tradición desde hoy.' },
						{ give: 'fullheal', n: 2 }, { give: 'escaperope' },
						{ text: 'Duquesa se acerca a {riolu}, lo olfatea con aire de catadora de vinos… y le da un golpecito con la cola en la cabeza. Luego vuelve con Tobías como si nada.' },
						{ say: 'tobias', text: '¡Le caes bien! Eso es lo que hace cuando alguien le cae bien. Cuando alguien le cae mal también lo hace, pero más fuerte.' },
						{ quest: 'b01_t_tobias', done: true },
						{ intel: { npc: 'tobias', text: 'Narra su vida como un reality show. Su Persian, Duquesa, es la verdadera jefa. Le gustan las «mazmorras».' } },
					] },
				] },
				{ text: '«Ahora no, Tobías.»', then: [
					{ say: 'tobias', text: '¡Suspense! ¡Me encanta! ¡El jefe de piso esperará aquí! …Literalmente. No sé volver.' },
				] },
			] },
		],
		b01_tobias_despues: [
			{ say: 'tobias', text: '¡Episodio cuarenta y ocho: completado! El cuarenta y nueve será en otra mazmorra. Todavía no sé cuál. Los patrocinadores votarán. Bueno, votaré yo.' },
			{ text: 'Duquesa está dormida encima de la mochila de Tobías. Él no se atreve a moverla.' },
		],

		// ---- Escena principal: el Team Flare ----
		b01_cueva_flare: [
			{ text: 'El túnel se abre a una galería enorme. Los cristales de aquí no brillan: **parpadean**. Como si les faltara el aire.' },
			{ text: 'Hay focos, cables y una cinta transportadora improvisada. Una docena de personas con trajes rojos de diseño y gafas de sol —gafas de sol, dentro de una cueva— arrancan cristales de la pared y los meten en cajas acolchadas.' },
			{ say: 'rotom', text: '¡Bzzt! Esos uniformes están en mi base de datos. **Team Flare**. Disuelto hace años, después de lo de… ¡bzzt! Error. Por lo visto, no tan disuelto.' },
			{ if: '!flag.b01_bastien_cueva_visto', then: [
				{ text: 'Alguien te agarra del brazo y tira de ti detrás de una estalagmita.' },
				{ say: 'bastien', text: '¡Shh! Soy yo. Bastien. Perdona, perdona, no quería asustarte.' },
				{ if: 'flag.b01_bastien_ruta5', then: [{ say: 'bastien', text: 'Después de lo de la Ruta 5, pensé que no me ibas a volver a dirigir la palabra. Me alegro de equivocarme. Creo.' }] },
				{ say: 'bastien', text: 'Lemnis me mandó aquí. «Vigila la cueva para la Liga», me dijeron. Que había «actividad irregular». No me dijeron que la actividad irregular llevaba gafas de sol.' },
				{ say: 'bastien', text: 'Llevo una hora escondido. Froakie… Frogadier, perdón, evolucionó la semana pasada y todavía no me acostumbro… Frogadier quiere saltarles encima. Yo quería esperar a alguien. No sé a quién. A ti, supongo.' },
				{ set: { 'flag.b01_bastien_cueva_visto': true } },
				{ quest: 'b01_t_bastien', stage: 'cueva', silent: true },
				{ text: 'Uno de los reclutas se gira. Te ve. Se baja las gafas de sol un centímetro, lo justo para mirarte por encima.' },
			], else: [
				{ text: 'Bastien sigue detrás de la estalagmita. Te hace un gesto con la cabeza: «otra vez». Los reclutas siguen ahí.' },
			] },
			{ if: '!beat("recluta_flare_c1")', then: [{ battle: 'recluta_flare_c1' }] },
			{ text: 'Mientras tanto, Frogadier sale disparado de detrás de la roca y se encarga de un tercer recluta, que acaba en el suelo con la cara llena de espuma.' },
			{ say: 'recluta_flare', text: '¡Eh! ¡Que me manchas el traje! ¡Es de temporada!' },
			{ if: '!beat("recluta_flare_c2")', then: [{ battle: 'recluta_flare_c2' }] },
			{ text: 'Los reclutas se apartan. Entre ellos camina una mujer de pelo rosa cortado a cuchilla, con un visor rojo sobre los ojos y una bata de laboratorio encima del traje. No corre. No le hace falta.' },
			{ say: 'melia', as: 'Mujer del visor', text: 'Basta. No malgasten energía en niños. La energía es lo único que no nos sobra.' },
			{ say: 'rotom', text: '¡Bzzt! **Melia**. Administradora del Team Flare. Orden de busca y captura… ¡bzzt! …archivada. Qué raro. ¿Quién archiva una orden así?' },
			{ say: 'melia', text: 'Hace años, un hombre quiso un mundo bello solo para unos pocos. Se equivocó en eso. Solo en eso.' },
			{ say: 'melia', text: 'La belleza del mundo nuevo… esta vez será para todos. Nuestros benefactores lo entienden.' },
			{ choice: [
				{ text: '«¿Qué benefactores?»', then: [
					{ say: 'melia', text: 'Los que pagan las cajas, criatura. ¿Creías que el buen gusto era gratis?' },
				] },
				{ text: '«Ese mundo bello casi destruye Kalos.»', then: [
					{ say: 'melia', text: '«Casi». Esa es la palabra favorita de los que nunca se atreven a terminar nada.' },
				] },
				{ text: 'Sostenerle la mirada sin decir nada.', then: [
					{ text: 'Melia te sostiene la mirada también. Detrás del visor no se le ve parpadear.' },
				] },
			] },
			{ text: 'Melia mira a {riolu} un segundo de más.' },
			{ say: 'melia', text: 'Ese Pokémon no es de Kalos. Lo noto en cómo te protege. Las Fisuras traen cosas… interesantes.' },
			{ say: 'melia', text: 'Recojan. Nos vamos.' },
			{ text: 'Los reclutas cargan las cajas a toda prisa. A uno se le resbala la última. Cae, se abre la tapa, y por el suelo ruedan cristales que todavía parpadean.' },
			{ text: 'En el costado de la caja hay una pegatina blanca puesta a toda prisa: «MATERIAL DE CONSTRUCCIÓN». Por debajo, donde la pegatina no llega a tapar, asoma un logotipo impreso. Un ocho tumbado. Azul y plata.' },
			{ text: '**La lemniscata de Lemnis.**' },
			{ text: 'El recluta cierra la caja de una patada, la levanta y sale corriendo detrás de los demás. En diez segundos, la galería está vacía. Solo quedan los huecos en la pared. Y el zumbido.' },
			{ text: 'Bastien no se ha movido. Sigue mirando el sitio donde estaba la caja.' },
			{ say: 'bastien', text: '¿Lo viste? Dime que no lo viste.' },
			{ say: 'bastien', text: 'Era el logo. Nuestro logo. *Su* logo. Lo llevo en la chaqueta, {jugador}. Lo llevo en la chaqueta.' },
			{ text: 'Se toca el broche de lemniscata de la solapa como si quemara.' },
			{ say: 'bastien', text: 'Tengo que contarlo. A la Liga, a la policía, a quien sea. Pero… —saca el móvil y abre un documento larguísimo— cláusula catorce: «El patrocinado se abstendrá de divulgar información relativa a operaciones de la empresa». Y una multa.' },
			{ say: 'bastien', text: 'No te voy a decir la cifra. Mis padres podrían pagarla. Y luego me lo recordarían en cada cena hasta que me muriera. Y después, en el funeral.' },
			{ say: 'bastien', text: 'Pero no es el dinero. Si hablo, Lemnis me quita el patrocinio, la plaza en el Circuito, todo. Y si no hablo… —mira los huecos de la pared— no sé qué soy si no hablo.' },
			{ say: 'bastien', text: '¿Qué hago, {jugador}?' },
			{ prompt: '¿Qué le dices a Bastien?', choice: [
				{ text: '«Yo lo denuncio. Tú no estabas aquí.»', then: [
					{ set: { 'flag.b01_bastien_cubierto': true } }, { rep: { policia: 2 } },
					{ say: 'bastien', text: '¿Tú? ¿Y si te piden pruebas? ¿Y si Lemnis va a por ti?' },
					{ text: 'Le dices que tú no tienes contrato. Que a ti no te pueden quitar nada que no te hayan dado.' },
					{ say: 'bastien', text: '…' },
					{ say: 'bastien', text: 'Te debo una. No: te debo muchas. Voy a empezar a apuntarlas. Tengo una libreta para eso. Bueno, la tendré.' },
					{ intel: { npc: 'bastien', text: 'Vio el logo de Lemnis en las cajas del Team Flare. Lo cubriste: diste la cara por él. Te debe una.' } },
				] },
				{ text: '«Si no lo dices tú, no vale nada.»', then: [
					{ set: { 'flag.b01_bastien_rompe': true } },
					{ text: 'Bastien se queda callado mucho rato. Tanto que el zumbido de la cueva parece subir de volumen.' },
					{ say: 'bastien', text: 'Tienes razón. Odio que tengas razón.' },
					{ text: 'Se quita el broche de la solapa. Lo mira. Lo guarda en el bolsillo, no lo tira. Todavía no.' },
					{ say: 'bastien', text: 'Si lo dice alguien de fuera, es un rumor. Si lo dice alguien de dentro, es una noticia. Mañana llamo a la Liga. Con mi nombre.' },
					{ say: 'bastien', text: 'Mi padre va a… da igual. Da igual lo que haga mi padre. —Le tiembla la voz—. Gracias. Creo. Pregúntamelo dentro de un mes.' },
					{ intel: { npc: 'bastien', text: 'Vio el logo de Lemnis en las cajas del Team Flare. Le dijiste que lo contara él. Va a romper su contrato.' } },
				] },
				{ text: '«No vimos nada. Mejor no meternos.»', then: [
					{ set: { 'flag.b01_bastien_silencio': true } }, { rep: { lemnis: 3, policia: -3 } },
					{ text: 'Por un momento, en la cara de Bastien hay alivio. Solo un momento.' },
					{ say: 'bastien', text: 'Sí. Sí, claro. No vimos nada. Una caja. Las cajas son cajas.' },
					{ text: 'Se coloca bien el broche. Se lo coloca dos veces, aunque ya estaba recto.' },
					{ say: 'bastien', text: 'Es lo más sensato. —No te mira—. Es lo más sensato, ¿verdad?' },
					{ intel: { npc: 'bastien', text: 'Vio el logo de Lemnis en las cajas del Team Flare. Quedaron en no decir nada.' } },
				] },
			] },
			{ quest: 'b01_t_bastien', stage: 'hecha', done: true },
			{ intel: { npc: 'melia', text: 'Admin del Team Flare. Extrae cristales de la Cueva Brillante. Habla de «benefactores» que pagan las cajas. Las cajas llevaban el logo de Lemnis.' } },
			{ if: 'flag.b01_bastien_silencio', then: [
				{ say: 'bastien', text: 'Oye. Combatamos. Así por lo menos hoy hago algo bien.' },
			], else: [
				{ say: 'bastien', text: 'Oye… ¿combatimos? No por nada. Para quitarnos esto de encima. Necesito pensar en otra cosa durante diez minutos.' },
			] },
			{ choice: [
				{ text: '«Venga. Diez minutos.»', then: [
					{ battle: 'bastien_2', lose: 'continue',
						onWin: [{ say: 'bastien', text: 'Frogadier, lo has hecho genial. Yo no tanto. Pero tú sí.' }],
						onLose: [{ heal: 'Bastien te pasa un par de Pociones sin decir nada. Tu equipo se recupera.' }] },
				] },
				{ text: '«Otro día, Bastien.»', then: [
					{ say: 'bastien', text: 'Vale. Otro día. —Intenta sonreír. Casi lo consigue—. Hay muchos días.' },
				] },
			] },
			{ text: 'Bastien se va por un túnel lateral, hacia la Ruta 9. Antes de doblar la esquina, se da la vuelta como si fuera a decir algo más. No lo dice.' },
			{ set: { 'flag.b01_cueva_flare_hecha': true } },
			{ quest: 'b01_m5', done: true },
			{ diary: 'Hoy mi entrenador{|a|e} y yo entramos en la Cueva Brillante. ¡Los cristales brillan solos! Al fondo había unos trajes rojos muy raros, con gafas de sol dentro de una cueva (¿cómo ven algo?). También nos encontramos a Bastien. Al final se fue sin despedirse. ¡Mañana, Ciudad Relieve y la segunda medalla!', cond: 'flag.b01_diario' },
		],

		// ---- El fósil ----
		b01_fosil: [
			{ text: 'Cerca de la salida, alguien te llama a gritos desde atrás. Un hombre de bata blanca, gafas empañadas y pelo blanco rizado viene corriendo, sin aliento, con una caja térmica en los brazos.' },
			{ if: 'flag.b01_lazare_1', then: [
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Por fin! ¡Te alcancé! Uf… Soy yo, Lazare, el de Petroglifo. Hoy no es martes, pero he corrido como si fuera socorrista.' },
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Después de que te fueras, pensé: los de rojo van a la Cueva Brillante, y en la Cueva Brillante hay fósiles. Así que entré de madrugada por la galería de los geólogos, la que no sale en los mapas.' },
			], else: [
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Eh! ¡Tú, {el|la|le} del Riolu! ¡Espera! Uf… Lazare. Doctor Lazare, del Laboratorio de Fósiles de Petroglifo. Paleontólogo, restaurador y socorrista los martes. No pasaste por mi laboratorio, así que he venido yo.' },
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Unos tipos de rojo andaban preguntando por fósiles, y en la Cueva Brillante hay fósiles. Así que entré de madrugada por la galería de los geólogos, la que no sale en los mapas.' },
			] },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Encontré dos: un **Fósil Mandíbula** y un **Fósil Aleta**. Los de rojo habían pasado a un metro. Ni los miraron. Buscaban cristales. Gente sin sensibilidad.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Me los llevé al laboratorio y los reviví esta mañana, antes de que alguien con gafas de sol cambiara de opinión. Rápido. Demasiado rápido para mi gusto. Pero aquí están.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Un fósil revivido necesita un entrenador, no una vitrina. Y tú tienes cara de no vendérselo a nadie. Elige uno. Solo uno: el otro se queda conmigo, que yo también me encariño.' },
			{ quest: 'b01_s_fosil', stage: 'elegir', silent: true },
			{ prompt: '¿Qué fósil eliges?', choice: [
				{ text: '**Tyrunt** (Fósil Mandíbula): Roca y Dragón. Muerde primero; pregunta después.', then: [
					{ pokemon: { sp: 'tyrunt', lv: 20, level: 20, happy: 90 } },
					{ text: 'Tyrunt te muerde la manga. Con cariño. Con bastante cariño. Con demasiado cariño.' },
				] },
				{ text: '**Amaura** (Fósil Aleta): Roca y Hielo. Tranquila, antigua; canta cuando nieva.', then: [
					{ pokemon: { sp: 'amaura', lv: 20, level: 20, happy: 90 } },
					{ text: 'Amaura te mira con unos ojos enormes y tranquilos. Sus velas brillan un poco, como la aurora de un cielo que ya no existe.' },
				] },
			] },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Cuídalo! Tiene unos cuantos millones de años de atraso en noticias. Explícale lo de las Fisuras con calma. A mí todavía no me ha quedado claro.' },
			{ set: { 'flag.b01_fosil': true } },
			{ quest: 'b01_s_fosil', done: true },
		],

		// =================== Ciudad Relieve ===================
		b01_llegada_relieve: [
			{ text: 'Ciudad Relieve huele a piedra caliente y a pan recién hecho. Las calles suben tanto que algunas tienen barandilla, y los vecinos te saludan sin aliento.' },
			{ text: 'Desde lo alto llega un grito agudo, larguísimo, y luego un aplauso. Alguien acaba de perder en el gimnasio. O de ganar. Con ese grito es difícil saberlo.' },
			{ quest: 'b01_m6', stage: 'reto' },
		],

		// ---- Rhi y Nate (antes del gimnasio) ----
		b01_rhi_relieve_1: [
			{ text: 'En el Muro de Escalada, una chica pelirroja sube a pulso, sin cuerda, maldiciendo a cada agarre. Abajo, tumbado en una colchoneta, un chico de pelo blanco duerme con la boca abierta.' },
			{ say: 'rhi', text: '¡Tú! —Se deja caer los dos últimos metros y aterriza de pie—. Ni una palabra. NI UNA.' },
			{ if: 'beat("rhi_1")', then: [{ say: 'rhi', text: '…Vale, una. Sí, me ganaste en Novarte. Ya lo sé. Lo tengo apuntado.' }] },
			{ say: 'rhi', text: 'Perdí contra Blanca. Contra BLANCA. Que lloró cuando ganó. ¿Quién llora cuando gana?' },
			{ say: 'nate', as: 'Chico dormido', text: 'Tú lloras cuando ganas.' },
			{ text: 'No ha abierto los ojos.' },
			{ say: 'rhi', text: '¡Eso es diferente! ¡Yo lloro de rabia productiva!' },
			{ say: 'rhi', text: 'Este es Nate. Mi compañero de equipo desde los ocho años. El mejor jugador que he visto en mi vida. Y el más vago del hemisferio norte.' },
			{ say: 'nate', text: 'Qué flojera presentarse. Hola.' },
			{ set: { 'flag.b01_rhi_relieve': true } },
			{ quest: 'b01_t_rhi', stage: 'relieve' },
			{ choice: [
				{ text: '«¿Qué pasó con Blanca?»', then: [
					{ af: { rhi: 1 } },
					{ call: 'b01_rhi_miltank' },
				] },
				{ text: '«¿Quieres que te ayude a entrenar?»', then: [
					{ af: { rhi: -1 } },
					{ say: 'rhi', text: '¿Ayudarme? ¿Tengo cara de necesitar ayuda? ¡Yo soy la delantera! ¡La delantera no necesita…!' },
					{ say: 'nate', text: 'Miltank. Rodar. Batido. Atracción. Ya está, ya lo dije. ¿Me puedo dormir?' },
					{ say: 'rhi', text: '¡NATE!' },
					{ say: 'nate', text: 'Si Atracción no le hace nada a una hembra, que lleve una hembra. Fin. —Se da la vuelta en la colchoneta.' },
					{ set: { 'flag.b01_rhi_conto_miltank': true } },
				] },
				{ text: '«Suerte con la revancha.»', then: [
					{ say: 'rhi', text: '¿Suerte? En el fútbol no existe la suerte. Existe el gol. Y el que no lo mete, se va a la banca.' },
					{ say: 'rhi', text: 'Tú ve a por tu medalla. Y cuando salgas, búscame. Que no he terminado contigo.' },
				] },
			] },
		],
		b01_rhi_miltank: [
			{ say: 'rhi', text: 'Su Miltank. Empieza con **Rodar**, y cada vuelta pega más fuerte. Cuando por fin la tienes casi, se bebe un **Batido** y vuelve a estar como nueva. ¡Como nueva!' },
			{ say: 'rhi', text: 'Y luego **Atracción**. Mi Raboot se quedó mirándola como un idiota. Mi Raboot es macho. Y bobo.' },
			{ say: 'nate', text: 'Si llevas una hembra, Atracción no le hace nada.' },
			{ say: 'rhi', text: '¡Eso iba a decir yo!' },
			{ say: 'nate', text: 'Ya. Pero tardabas.' },
			{ set: { 'flag.b01_rhi_conto_miltank': true } },
			{ intel: { npc: 'rhi', text: 'Perdió contra Blanca en Relieve. Dice que su Miltank usa Rodar, Batido y Atracción.' } },
		],
		b01_rhi_relieve_2: [
			{ if: '!flag.b01_rhi_conto_miltank', then: [
				{ say: 'rhi', text: 'Sigo entrenando. ¿Qué quieres?' },
				{ call: 'b01_rhi_miltank' },
			], else: [
				{ say: 'rhi', text: 'Sigo entrenando. Tú ve a por tu medalla. Y cuando salgas, búscame. Que no he terminado contigo.' },
				{ say: 'nate', text: 'Zzz… Rodar… zzz…' },
			] },
		],

		// ---- Rhi (rival 2): al salir del gimnasio ----
		b01_rhi_2: [
			{ set: { 'flag.b01_rhi_2_hecho': true } },
			{ text: 'Al bajar del gimnasio, alguien te corta el paso en la cuesta. Pelo rojo, chaqueta de fútbol con el 9 a la espalda, los brazos cruzados.' },
			{ if: '!flag.b01_rhi_relieve', then: [
				{ text: 'Detrás de ella, sentado en un escalón, un chico de pelo blanco bosteza como si llevara despierto desde la Edad Media.' },
				{ say: 'rhi', text: 'Este es Nate. Mi compañero. No le hagas caso; si le haces caso, se duerme.' },
			] },
			{ say: 'rhi', text: 'Ganaste. Claro que ganaste. Se te nota en la cara.' },
			{ say: 'rhi', text: 'Yo entro ahora a por mi revancha. Pero antes necesito calentar. Y tú eres el mejor calentamiento de esta ciudad. Es un cumplido. Más o menos.' },
			{ say: 'nate', text: 'Qué flojera. Rhi, ya, vámonos.' },
			{ say: 'rhi', text: 'No.' },
			{ choice: [
				{ text: '«Dame cinco minutos en el Centro. Vengo de pelear.»', then: [
					{ say: 'rhi', text: '¿Cinco minutos? ¡En cinco minutos se remonta un partido entero! …Vale. Ve. Que luego no digas que te gané con ventaja.' },
					{ heal: 'Bajas al Centro Pokémon. La enfermera te devuelve el equipo como nuevo. Cuando sales, Rhi sigue en la cuesta, dando toques a una Poké Ball como si fuera un balón.' },
				] },
				{ text: '«Así como estoy. Vamos.»', then: [
					{ say: 'rhi', text: '¿Con el equipo a medias? Eso no es valentía, es salir a jugar con un solo tenis.' },
					{ heal: 'Rhi te lanza un puñado de Superpociones sin mirar y espera, dando toques con el pie, a que cures a todo tu equipo. «Si te gano, quiero que sea limpio.»' },
				] },
			] },
			{ battle: 'rhi_2', lose: 'continue',
				onWin: [
					{ af: { rhi: 6 } },
					{ text: 'Rhi se queda mirando a su Raboot, que respira hondo en el suelo. Lo recoge. Aprieta la Poké Ball. Luego te mira a ti.' },
					{ say: 'rhi', text: '…{jugador}.' },
					{ text: 'Es la primera vez que dice tu nombre. Lo dice como si le costara. Y como si lo fuera a recordar.' },
					{ say: 'rhi', text: 'Ya está. Ya te lo has ganado. No te acostumbres.' },
					{ quest: 'b01_t_rhi', done: true },
				],
				onLose: [
					{ af: { rhi: 1 } },
					{ say: 'rhi', text: 'Eh. No pongas esa cara. Jugaste bien. Pero la delantera soy yo.' },
					{ heal: 'Rhi te lanza una Superpoción sin mirar. «Que no se diga que gano con ventaja.»' },
					{ quest: 'b01_t_rhi', stage: 'revancha' },
				] },
			{ say: 'nate', text: 'Tu {riolu} tiene buen toque.' },
			{ say: 'rhi', text: '¿Qué? ¿Desde cuándo tú comentas algo?' },
			{ say: 'nate', text: 'Desde que hay algo que comentar.' },
			{ text: 'Rhi abre la boca. La cierra. Por primera vez desde que la conoces, no tiene respuesta. Se da la vuelta y sube la cuesta hacia el gimnasio, a zancadas. Nate la sigue, arrastrando los pies.' },
			{ if: 'quest.b01_s_fennekin == "buscar" || quest.b01_s_fennekin == "pistas"', then: [
				{ text: 'A mitad de la cuesta, Rhi se da la vuelta.' },
				{ say: 'rhi', text: '¡Ah! Se me olvidaba. ¿Sabes el zorrito que se escapó en la inauguración? El Fennekin. Lo encontré yo, en el Bosque de Novarte, rodeado de bichos. Se lo devolví al profe de Luminalia. Me dio las gracias cuatro veces.' },
				{ say: 'rhi', text: 'Me lo quería dar. Le dije que no: yo ya tengo delantero. Si tú lo quieres, pídeselo. Pero que conste que el rescate fue mío. Gol mío.' },
				{ set: { 'flag.b01_fennekin_libre': true, 'flag.b01_fennekin_rhi': true, 'flag.b01_lucien_chespin': true } },
				{ quest: 'b01_s_fennekin', done: true },
			] },
			{ intel: { npc: 'rhi', text: 'Su compañero, Nate, casi no habla. Cuando habla, Rhi se calla.' } },
			{ intel: { npc: 'nate', text: 'Compañero de equipo de Rhi desde los ocho años. Genio. Vago. Dijo que tu Riolu «tiene buen toque».' } },
		],
		b01_nate_relieve: [
			{ say: 'nate', text: 'Ganó. Blanca lloró. Rhi lloró. Yo me dormí en la grada. Fue un buen día.' },
			{ say: 'nate', text: 'Rhi dice que la próxima vez te gana. Lo dice de todo el mundo. Contigo lo dice más bajito. Eso es nuevo.' },
		],

		// ---- Gimnasio de Relieve ----
		b01_blanca_espera: [
			{ text: 'Desde lo alto del muro llega una voz: «¡Primero sube! ¡Con los entrenadores! ¡Es la regla de Lino, no la mía! ¡Yo habría puesto un ascensor!».' },
		],
		b01_blanca_reto_fuerte: [
			{ say: 'blanca', text: '¡Eh, eh, eh! ¿Y ese equipo? ¡Has estado entrenando a escondidas! ¡Eso no es justo! …Vale, sí es justo. Pero me fastidia.' },
			{ call: 'b01_blanca_reto' },
		],
		b01_blanca_reto: [
			{ text: 'Llegas arriba. Te tiemblan los brazos. Blanca te espera sentada en una repisa, con los pies colgando y un batido en la mano.' },
			{ say: 'blanca', text: '¡Por fin alguien que sube sin quejarse! Bueno, te he oído quejarte. Pero bajito.' },
			{ say: 'blanca', text: '¡Soy Blanca! ¡De Ciudad Trigal, en Johto! Estoy aquí de intercambio y te digo una cosa: ¿quién diseña un gimnasio donde hay que ESCALAR? ¡Con falda! ¡Lino, te odio un poquito!' },
			{ say: 'blanca', text: 'Pero ¿sabes qué? Me encanta Kalos. Los macarons, la ropa, los Furfrou… ¡Y aquí todo el mundo me trata como a una líder de verdad! —Pausa—. Que lo soy, ¿eh? Soy una líder de verdad.' },
			{ if: 'flag.b01_rhi_conto_miltank', then: [{ say: 'blanca', text: 'Ah, ¿eres amig{o|a|e} de la pelirroja? ¿La que gritó «fuera de juego» cuando perdió? ¡Qué chica tan intensa! Me cae genial.' }] },
			{ say: 'blanca', text: '¡Venga, que mi Miltank tiene ganas de rodar!' },
			{ battle: 'blanca_g2', onWin: [
				{ say: 'blanca', text: '…' },
				{ say: 'blanca', text: '¡Waaah! ¡No es justo! ¡No es justooo!' },
				{ text: 'Blanca llora. Llora con todo el cuerpo. Su Miltank le da palmaditas en la espalda con una pezuña, con la paciencia de quien ha hecho esto muchas, muchas veces.' },
				{ choice: [
					{ text: '«¿Estás bien?»', then: [{ say: 'blanca', text: '¡Estoy FATAL! …Ya se me pasa. Dame un segundo. —Se suena la nariz con estruendo—. Ya.' }] },
					{ text: 'Esperar en silencio.', then: [{ text: 'Esperas. Exactamente cuarenta segundos después, Blanca deja de llorar, como quien cierra un grifo.' }] },
				] },
				{ say: 'blanca', text: 'Vale. Ya. Toma. ¡Te la has ganado! ¡Aunque no es justo!' },
				{ badge: 'medalla_encanto' },
				{ cap: 33 },
				{ give: 'mt_fachada' },
				{ say: 'blanca', text: 'Es la **MT Imagen**: si a tu Pokémon lo envenenan, lo paralizan o lo queman, pega el doble. Como yo cuando me enfado.' },
				{ say: 'blanca', text: 'Y la **Medalla Encanto** vale en todo el Circuito. ¡En todas las regiones! Si algún día vas a Johto, enséñasela a mi mamá. Le va a hacer muchísima ilusión.' },
				{ quest: 'b01_m6', done: true },
				{ say: 'blanca', text: 'Ah, por cierto: la pelirroja te está esperando abajo. Tiene cara de revancha. Yo de ti bajaría por la escalera, no por la cuerda.' },
			] },
		],
		b01_blanca_despues: [
			{ say: 'blanca', text: '¡Ya no lloro! …Casi. ¿Quieres un batido? Son de Miltank. No preguntes de cuál.' },
			{ if: 'flag.b01_rhi_2_hecho', then: [{ say: 'blanca', text: 'La pelirroja me ganó la revancha. ¡Lloramos las dos! Fue precioso. Le he dicho que me escriba desde Galar.' }] },
		],

		// ---- Alexia ----
		b01_alexia_relieve: [
			{ say: 'alexia', text: '¡{jugador}! Qué casualidad. Bueno, no tanta: sigo a todos los novatos del Circuito. Es mi trabajo. Lo de fotografiarlos es el de mi hermana, pero ella está en Kanto, así que hago las dos cosas. Mal.' },
			{ if: 'flag.b01_prensa_verdad', then: [{ say: 'alexia', text: 'Lo que me contaste de la grieta salió en portada. Lemnis llamó al periódico tres veces. Mi editor está encantado. Y un poco asustado.' }] },
			{ if: 'flag.b01_prensa_lemnis', then: [{ say: 'alexia', text: 'Tu frase sobre «el fallo técnico» salió en la página doce. Lemnis la compartió en todas sus redes. Felicidades. Supongo.' }] },
			{ say: 'alexia', text: 'Te cuento algo, de periodista a… lo que seas tú. Lemnis compró hace tres meses todos los terrenos alrededor de **Pueblo Crómlech**. Todos. Dicen que es un proyecto de «conservación arqueológica».' },
			{ say: 'alexia', text: 'Nadie compra un pueblo entero para conservarlo. Si pasas por allí y ves algo, llámame. A cualquier hora. Duermo con el teléfono en la mano. Mi Helioptile también.' },
			{ set: { 'flag.b01_alexia_relieve': true } },
			{ intel: { npc: 'alexia', text: 'Lemnis compró hace tres meses los terrenos alrededor de Pueblo Crómlech. «Conservación arqueológica». Te pidió que la llames si ves algo.' } },
		],
		b01_alexia_relieve_2: [
			{ if: 'flag.b01_delatar', then: [
				{ say: 'alexia', text: 'Lo de Crómlech es lo más gordo que he publicado nunca. Lemnis me ha mandado tres abogados y una cesta de frutas. No sé qué me da más miedo.' },
			], else: [
				{ if: 'flag.b01_cromlech_hecha', then: [
					{ say: 'alexia', text: 'Vienes de Crómlech, ¿verdad? Lo noto en la cara. No te voy a preguntar. Pero si un día quieres contármelo, aquí estoy.' },
				], else: [
					{ say: 'alexia', text: 'Crómlech, {jugador}. Al norte, por la Ruta 10. Si ves algo, llámame.' },
				] },
			] },
		],

		// ---- Cartel de Héctor ----
		b01_cartel_hector: [
			{ text: 'Entre anuncios de clases de escalada y un Skiddo perdido hay una hoja escrita a mano, con rotuladores de colores y el dibujo de una máscara de luchador:' },
			{ text: '«**SE BUSCA COMPAÑERO DE ENTRENAMIENTO HEROICO.** Requisitos: valor, sentido de la justicia, ganas de gritar. Preguntar por HÉCTOR en la Ruta 10, junto a los menhires. Horario: de lunes a viernes, después de las seis. Fines de semana, todo el día».' },
			{ text: 'Debajo, en letra más pequeña: «No es una secta».' },
			{ set: { 'flag.b01_cartel_hector': true } },
		],

		// ---- Misión pequeña: el niño fan de Lino ----
		b01_lino_1: [
			{ say: 'nino_relieve', text: 'Lino es el mejor líder del mundo. Construyó el muro con sus manos. Bueno, con sus Tyrunt. Y ahora está en Kanto y nos han puesto a una que llora.' },
			{ say: 'nino_relieve', text: 'Blanca no es una líder de verdad. Una líder de verdad no llora.' },
			{ choice: [
				{ text: '«Ya veremos.»', then: [{ say: 'nino_relieve', text: 'Ve, ve. Ya verás cómo llora. Luego vuelve y me lo cuentas.' }] },
				{ text: '«Llorar no tiene nada de malo.»', then: [{ say: 'nino_relieve', text: 'Eso lo dicen los mayores para que no te sientas mal cuando lloras. Yo no lloro. Desde hace una semana.' }] },
			] },
			{ quest: 'b01_s_lino', stage: 'fan' },
		],
		b01_lino_2: [
			{ say: 'nino_relieve', text: '¿Le ganaste? ¿Y lloró? —Asiente, satisfecho, antes de que contestes—. Lo sabía.' },
			{ choice: [
				{ text: '«Lloró. Y luego me dio la medalla y me deseó suerte.»', then: [
					{ say: 'nino_relieve', text: '…¿Te deseó suerte?' },
					{ say: 'nino_relieve', text: 'Lino nunca deseaba suerte. Lino casi no hablaba. Solo decía «sube» y «otra vez».' },
					{ text: 'Mira hacia lo alto del muro un buen rato.' },
					{ say: 'nino_relieve', text: 'A lo mejor se puede llorar y ser líder. A lo mejor.' },
					{ rep: { kalos: 2 } },
				] },
				{ text: '«Sí. Lloró muchísimo.»', then: [
					{ say: 'nino_relieve', text: '¡JA! ¡Lo sabía! ¡No es una líder de verd…!' },
					{ text: 'Desde lo alto del muro, a treinta metros, llega una voz: «¡TE HE OÍDO!».' },
					{ say: 'nino_relieve', text: '…Bueno. Igual un poquito sí es líder. Tiene muy buen oído.' },
				] },
			] },
			{ say: 'nino_relieve', text: 'Toma. Es mi Piedra Dura de la suerte. Era para Lino, para cuando volviera. Ya le buscaré otra.' },
			{ give: 'hardstone' },
			{ quest: 'b01_s_lino', done: true },
		],
		b01_lino_3: [
			{ say: 'nino_relieve', text: 'Hoy Blanca me ha dejado subir hasta la segunda repisa. Se ha puesto a llorar de la emoción. Yo no. Bueno, un poco. Pero de la altura.' },
		],

		// =================== Ruta 10 ===================
		b01_r10_entrada: [
			{ quest: 'b01_m7', stage: 'ruta10' },
		],

		// ---- Héctor ----
		b01_hector_1: [
			{ text: 'En un claro entre menhires, un hombre con traje de oficina, corbata roja y maletín hace flexiones. Un Hawlucha se las cuenta en voz alta: «¡Haw! ¡Haw! ¡Haw!».' },
			{ text: 'Te ve. Se levanta de un salto. Se le cae el maletín. Lo recoge con dignidad.' },
			{ say: 'hector', as: 'Oficinista', text: '¡Alto ahí, viajer{o|a|e}! ¿Vienes por el cartel? ¡Dime que vienes por el cartel!' },
			{ if: 'flag.b01_cartel_hector', then: [
				{ choice: [
					{ text: '«Vengo por el cartel.»', then: [{ say: 'hector', as: 'Oficinista', text: '¡LO SABÍA! ¡Nadie viene nunca por el cartel! ¡Eres la primera persona! ¡Hawlucha, apúntalo!' }] },
					{ text: '«¿No es una secta?»', then: [{ say: 'hector', as: 'Oficinista', text: '¡No es una secta! Lo puse en el cartel precisamente para que nadie pensara que es una secta. ¿Por qué todo el mundo piensa que es una secta?' }] },
				] },
			], else: [
				{ say: 'hector', as: 'Oficinista', text: '¿No has visto el cartel? ¿En el Centro de Relieve? ¿Con dibujos? Bueno. No pasa nada. Los héroes no necesitan publicidad. Pero ayuda.' },
			] },
			{ say: 'hector', text: 'Héctor Batista. De día, auxiliar administrativo en una aseguradora de Relieve. De noche y fines de semana… —saca del maletín una máscara de luchador hecha a mano, verde y roja, con lentejuelas— …¡el héroe que Kalos necesita!' },
			{ say: 'hector', text: '¡TRANSFORMACIÓN!' },
			{ text: 'Se pone la máscara. Tarda un poco, porque se le engancha en las gafas. Se quita las gafas. Se pone la máscara. Ahora no ve nada.' },
			{ say: 'hector', text: 'Mi inspiración es **Esprit**, el héroe enmascarado de Luminalia. ¿Lo conoces? ¿La conoces? Nadie sabe quién es. Salvó la ciudad del Team Flare hace años y desapareció sin pedir nada. ¡Un verdadero héroe no necesita que le den las gracias!' },
			{ say: 'hector', text: 'Pero un héroe necesita entrenar. ¡Combate conmigo, en nombre de la justicia!' },
			{ battle: 'hector_r10', lose: 'continue', onLose: [{ heal: 'Héctor saca del maletín un botiquín con pegatinas de estrellas y cura a tu equipo. «¡Un héroe siempre lleva botiquín!»' }] },
			{ text: 'Un maullido agudo, desde arriba. En lo alto del menhir más alto, a cinco metros del suelo, un Skitty los mira con los ojos como platos.' },
			{ say: 'hector', text: 'Ah. Ella. Lleva ahí desde ayer. Es de una niña de Crómlech. ¡He intentado rescatarla catorce veces! Pero cada vez que subo, ella sube más. ¡Y ya no queda más menhir!' },
			{ say: 'hector', text: '¿Me ayudarías? Un héroe sabe pedir ayuda. Lo leí en un cómic. En la página final, que es donde ponen las cosas importantes.' },
			{ set: { 'flag.b01_hector_1': true } },
			{ quest: 'b01_t_hector', stage: 'skitty' },
			{ intel: { npc: 'hector', text: 'Oficinista de Relieve y héroe enmascarado «en sus ratos libres». Fan de Esprit. Su compañero es un Hawlucha.' } },
		],
		b01_hector_skitty: [
			{ text: 'El Skitty sigue arriba. Cada vez que Héctor da un paso hacia el menhir, el Skitty se encoge y bufa. Héctor da un paso atrás. El Skitty se relaja. Héctor da un paso adelante. El Skitty bufa.' },
			{ prompt: '¿Cómo bajamos al Skitty?', choice: [
				{ text: '«Héctor, quítate la máscara.»', then: [
					{ say: 'hector', text: '¿Q-qué? ¡Un héroe nunca revela su…! —Te mira. Mira al Skitty—. …Oh.' },
					{ text: 'Héctor se quita la máscara, despacio. Debajo hay un hombre normal: gafas, ojeras de oficina y cara de buena persona. Se acerca al menhir y habla bajito: «Hola. Perdona. Ya sé que daba miedo».' },
					{ text: 'El Skitty duda. Baja un saliente. Luego otro. Y salta a sus brazos.' },
					{ say: 'hector', text: '…No era yo. Le daba miedo el traje.' },
					{ text: 'Se queda mirando la máscara que tiene en la mano.' },
					{ say: 'hector', text: 'Ser héroe no es el traje. —Lo dice despacio, como si probara la frase—. Lo voy a apuntar. Lo voy a apuntar en algún sitio donde lo vea todas las mañanas.' },
					{ rep: { kalos: 2 } },
				] },
				{ text: '«Que {riolu} suba a por ella.»', then: [
					{ text: '{riolu} trepa el menhir en tres saltos. El Skitty lo mira… y se deja coger, sin un bufido. {riolu} baja con ella en brazos, sin prisa.' },
					{ happy: { who: 'riolu', n: 5 } },
					{ say: 'hector', text: '¡Increíble! ¡Tu compañero es un héroe de verdad!' },
					{ text: 'Héctor aplaude. Luego deja de aplaudir.' },
					{ say: 'hector', text: '…Catorce veces lo intenté yo. Y él, una.' },
					{ say: 'hector', text: 'Bueno. Un héroe también sabe aplaudir a otro héroe. —Vuelve a aplaudir, más fuerte—. ¡Eso también lo voy a apuntar!' },
				] },
				{ text: '«¡Hawlucha, al rescate!»', then: [
					{ text: 'El Hawlucha de Héctor sale volando con una pose espectacular, se gira en el aire y abre las alas. El Skitty grita, salta del menhir… y aterriza en la cara de Héctor.' },
					{ say: 'hector', text: '¡Rescate completado! …Con daños colaterales. Sobre todo faciales.' },
					{ text: 'El Skitty se le ha quedado enganchado a la máscara. Ronronea.' },
					{ say: 'hector', text: 'A veces el plan sale mal y sale bien a la vez. Eso no lo dicen en los cómics. Ni en la página final.' },
				] },
			] },
			{ say: 'hector', text: 'Toma, por la ayuda. Es mi movimiento final. Bueno, el de Hawlucha. Él no lo usa nunca, porque siempre le pegan antes de terminar de concentrarse.' },
			{ give: 'mt_puñocerteza' },
			{ say: 'hector', text: 'Voy a llevar a esta pequeña a Crómlech. ¡Y algún día iré a Luminalia a conocer a Esprit en persona! ¿Crees que firma autógrafos?' },
			{ set: { 'flag.b01_hector_hecho': true } },
			{ quest: 'b01_t_hector', done: true },
		],
		b01_hector_generico: [
			{ say: 'hector', text: '¡{jugador}! ¡Hawlucha y yo seguimos entrenando! Hoy, cien flexiones. Bueno, cuarenta. Pero heroicas.' },
			{ say: 'hector', text: 'Algún día iré a Luminalia a conocer a Esprit. Le voy a pedir un autógrafo. Y un consejo. Y otro autógrafo, para mi madre.' },
		],

		// ---- Anomalía: Hawlucha teracristalizado ----
		b01_r10_tera: [
			{ text: 'Algo brilla entre dos menhires, como un vitral roto al sol. Te acercas.' },
			{ text: 'Es un Hawlucha. Pero está cubierto de **cristal rosa**, con facetas que reflejan la luz en todas direcciones, y sobre la cabeza lleva una corona de cristal que no tendría que estar ahí.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Eso es una **teracristalización**! ¡Eso solo pasa en Paldea! ¡No debería ser posible fuera de Paldea! ¡Bzzt! ¡Recalculando! ¡Recalculando!' },
			{ text: 'El Hawlucha de cristal te ve. Abre las alas. Se lanza.' },
			{ wild: { sp: 'hawlucha', lv: 24, gimmick: 'tera', tera: 'Fairy' },
				onWin: [{ text: 'El cristal se agrieta y se deshace en polvo rosa. El Hawlucha, de nuevo normal, sacude la cabeza confundido y se va volando hacia el norte.' }],
				onCatch: [{ say: 'rotom', text: '¡Bzzt! Registrado. Pero mis datos dicen que ya no está teracristalizado. El cristal se fue… ¿adónde se fue?' }],
				onRun: [{ text: 'Te alejas. El Hawlucha de cristal no te sigue: se queda mirando hacia el norte, hacia Crómlech, como si algo lo llamara.' }],
				onLose: [{ heal: 'Te despiertas junto a un menhir con tu equipo recuperado y una Floette posada en tu hombro. Cuando la miras, sale volando.' }] },
			{ set: { 'flag.b01_r10_tera': true } },
		],

		// ---- A.Z. ----
		b01_az_1: [
			{ text: 'El viento se para de golpe.' },
			{ text: 'Entre dos menhires hay un hombre sentado en el suelo. Aun sentado, es más alto que tú de pie. Tiene el pelo blanco, larguísimo, y en la cara una tristeza tan vieja que ya parece parte de los huesos.' },
			{ text: 'En su hombro descansa una Floette. Su flor no se parece a la de ninguna otra: es roja, casi negra, y no se marchita. Te da la impresión de que lleva mucho tiempo sin marchitarse.' },
			{ text: '{riolu} da un paso al frente. No en guardia: con curiosidad. Como si reconociera algo.' },
			{ say: 'az', text: 'Ese pequeño tiene un aura limpia. Hacía mucho que no veía una así.' },
			{ say: 'az', text: 'Cuídalo.' },
			{ choice: [
				{ text: '«¿Quién es usted?»', then: [
					{ say: 'az', text: 'Alguien que esperó demasiado. —Acaricia a la Floette con un dedo enorme—. Y que ya no espera nada.' },
				] },
				{ text: '«¿Conoce bien Crómlech?»', then: [
					{ say: 'az', text: 'Conocí Crómlech cuando todavía no tenía nombre. Cuando estas piedras eran tumbas recién cerradas.' },
				] },
				{ text: 'Quedarte en silencio a su lado.', then: [
					{ text: 'Os quedáis los dos en silencio. La Floette baja de su hombro, se posa un segundo sobre la cabeza de {riolu} y vuelve. El hombre sonríe. Parece que hacía mucho que no lo hacía.' },
					{ happy: { who: 'riolu', n: 5 } },
				] },
			] },
			{ text: 'El hombre mira hacia el norte, hacia donde se ven los focos de Crómlech.' },
			{ say: 'az', text: 'Están despertando algo que debería dormir.' },
			{ say: 'az', text: 'Toda energía infinita se cobra en vidas. Siempre.' },
			{ text: 'Se levanta. Tarda un rato: hay mucho hombre que levantar. Y se aleja hacia el oeste, sin prisa, entre los menhires, hasta que lo pierdes de vista.' },
			{ say: 'rotom', text: '¡Bzzt! No… no está en mi base de datos. ¡Debería estar en mi base de datos! ¡Mide casi tres metros!' },
			{ set: { 'flag.b01_az_1': true } },
			{ quest: 'b01_t_az', stage: 'visto' },
		],

		// =================== Pueblo Crómlech ===================
		b01_llegada_cromlech: [
			{ set: { 'flag.b01_m_aviso': true } },
			{ quest: 'b01_m7', stage: 'cromlech' },
			{ text: 'Al cruzar el círculo de menhires, {riolu} se detiene en seco. Se lleva una pata al pecho, como si le doliera algo que no está en su cuerpo.' },
			{ say: 'rotom', text: '¡Bzzt! Lectura de energía rara. Más fuerte que en la Ruta 4. Mucho más fuerte. Viene del norte.' },
			{ text: 'Los vecinos te miran pasar desde detrás de las cortinas. Nadie sale a saludar.' },
		],

		// ---- Irene ----
		b01_irene_1: [
			{ text: 'Frente al menhir más grande del pueblo, una mujer muy bajita, con dos trenzas azul oscuro y un sombrero de ala anchísima, copia símbolos en una libreta. Asoman otras cuatro libretas de los bolsillos de su abrigo. Está de puntillas.' },
			{ say: 'irene', as: 'Investigadora', text: 'No toques la piedra. No, no me refería a ti. Me refería a tu Pokémon. Bueno, también a ti.' },
			{ text: '{riolu} no le hace caso. Ni a ella ni a ti. Se ha quedado mirando el menhir, muy quieto. Las marcas talladas en la piedra se iluminan, muy débilmente, con un azul que reconoces: el de su aura.' },
			{ say: 'irene', as: 'Investigadora', text: '…Oh. Oh, no. Oh, *sí*. ¿Estás viendo esto? Está **leyendo**. No, leyendo no: resonando. La escritura de los Guardianes del Aura no se lee con los ojos, se lee con el… con el… —Se calla de golpe y se coloca el sombrero—. Perdón. Me emociono.' },
			{ say: 'irene', text: 'Dra. Irene Solberg. Lingüista y arqueóloga de la Biblioteca de Ciudad Canal, en Sinnoh. Ahora mismo, consultora de la Policía Internacional. Estudio estas inscripciones. O lo intento: Lemnis no me deja acercarme a las del norte.' },
			{ choice: [
				{ text: '«¿Qué dice la inscripción?»', then: [
					{ af: { irene: 3 } },
					{ text: 'A Irene se le iluminan los ojos. Abre una libreta. Luego otra. Luego las dos a la vez.' },
					{ say: 'irene', text: 'Nadie lo sabe del todo. Es una escritura de hace tres mil años, anterior a la guerra de Kalos. Las runas van en pares opuestos: dar y tomar, nacer y… algo que no tiene traducción. Hay palabras que no sobreviven al viaje entre idiomas.' },
					{ say: 'irene', text: 'Traducir siempre es traicionar un poco. Pero creo que esto es un aviso. Un aviso muy largo, escrito por alguien que tenía mucho miedo de que lo olvidáramos.' },
				] },
				{ text: '«¿Y qué hace una lingüista trabajando para la policía?»', then: [
					{ af: { irene: 1 } },
					{ say: 'irene', text: 'Lo que mejor sé hacer: leer lo que otros no saben leer. Handsome me llamó. Bueno, me llamó tres veces. A la cuarta contesté.' },
				] },
				{ text: '«¿No eres un poco joven para ser doctora?»', then: [
					{ af: { irene: -2 } },
					{ text: 'Te mira desde abajo, con una calma peligrosa.' },
					{ say: 'irene', text: 'Tengo veintisiete años y un doctorado. Y una paciencia limitada. Que acabas de gastar.' },
				] },
			] },
			{ say: 'irene', text: 'Escucha. Tu compañero percibe algo que mis instrumentos no perciben. Y eso, para una científica, es insoportable. Así que vamos a colaborar. Toma.' },
			{ give: 'lenteaura' },
			{ say: 'irene', text: 'Es una **Lente de Aura**: cristal tallado con una técnica antigua de Sinnoh. Si miras a través de ella con él cerca, verás los restos de las Fisuras. Costuras en el aire. Úsala con la **Guía de zona**.' },
			{ say: 'irene', text: 'Y apunta lo que veas. Con fecha. Con hora. Por favor, con hora. Nadie apunta nunca la hora.' },
			{ say: 'irene', text: 'Ah, y si alguna vez consigues ver qué hay al norte, detrás de las vallas… cuéntamelo. A mí no me dejan ni mirar.' },
			{ set: { 'flag.b01_irene_1': true } },
			{ intel: { npc: 'irene', text: 'Lingüista y arqueóloga de Sinnoh, consultora de la Policía Internacional. Estudia los menhires de Crómlech. Dice que {riolu} «resuena» con las runas. Te dio la Lente de Aura.' } },
		],
		b01_irene_2: [
			{ if: 'flag.b01_cromlech_hecha', then: [
				{ say: 'irene', text: 'Anoche los menhires del norte brillaron. Todos a la vez. Lo vi desde la ventana de la posada y lo apunté. Con hora: las dos y diecisiete.' },
				{ say: 'irene', text: '¿Tú… sabes algo de eso?' },
				{ choice: [
					{ text: '«Pregúntale a Handsome.»', then: [{ say: 'irene', text: 'Eso significa que sí. Vale. Lo respeto. Lo detesto, pero lo respeto.' }] },
					{ text: '«Vi una máquina. Muy antigua. Debajo de los menhires.»', then: [
						{ af: { irene: 2 } },
						{ text: 'Irene deja de escribir. Se le cae el lápiz. No lo recoge.' },
						{ say: 'irene', text: 'Entonces el aviso de la piedra no era una metáfora. —Lo dice muy bajo—. Gracias por decírmelo. A la mayoría de la gente no se le ocurre que yo también necesito saber cosas.' },
					] },
				] },
			], else: [
				{ say: 'irene', text: 'Las runas del menhir de la plaza hablan de un rey. Un rey que no supo despedirse de alguien. Repiten esa idea tres veces, en tres formas distintas. Como quien no se lo cree.' },
				{ if: 'flag.b01_az_1', then: [
					{ choice: [
						{ text: '«En la Ruta 10 vi a un hombre enorme con una Floette.»', then: [
							{ say: 'irene', text: '¿Una Floette de flor oscura? —Te agarra de la manga sin darse cuenta—. ¿Muy alto? ¿Muy triste? …No. No puede ser. Eso son tres mil años. Nadie vive tres mil años.' },
							{ text: 'Te suelta. Apunta algo. Apunta la hora.' },
						] },
						{ text: 'No decir nada.', then: [{ say: 'irene', text: 'En fin. Las piedras tienen tiempo. Yo, no tanto.' }] },
					] },
				] },
			] },
		],

		// ---- Handsome, turista ----
		b01_handsome_cromlech_1: [
			{ text: 'Junto a la fuente del pueblo, un hombre con sombrero de paja, camisa de flores, cámara al cuello y —inexplicablemente— su gabardina de siempre encima de todo, fotografía un menhir. Con flash. A mediodía.' },
			{ say: 'handsome', as: 'Turista', text: '¡Oh, qué piedra tan bonita! ¡Soy un turista! ¡Un turista normal al que le gustan mucho las piedras!' },
			{ say: 'handsome', as: 'Turista', text: '…Ah, eres tú. —Baja la cámara—. Soy Handsome. No digas mi nombre en voz alta.' },
			{ choice: [
				{ text: '«Handsome, se te ve la gabardina.»', then: [{ say: 'handsome', text: 'La gabardina es parte del disfraz. Los turistas también pasan frío.' }] },
				{ text: '«Buen disfraz.»', then: [{ say: 'handsome', text: '¿Verdad? Matière dice que parezco «un tío en una boda». No sé qué significa, pero creo que es bueno.' }] },
			] },
			{ say: 'handsome', text: 'Escucha. Lemnis dice que esto es «conservación». Pero de día no hay ni un solo arqueólogo, y de noche entran camiones. Camiones grandes. Que salen más pesados de lo que entraron.' },
			{ say: 'handsome', text: 'Handsome va a entrar esta noche. Y quiero que vengas. Tu compañero ve cosas que yo no veo. Y yo veo cosas que tú no ves. Por ejemplo: guardias.' },
			{ if: 'flag.b01_irene_1', then: [{ say: 'handsome', text: 'Ya conociste a la doctora Solberg. Es brillante. Y da un poco de miedo. Las dos cosas a la vez, como un buen café.' }], else: [{ say: 'handsome', text: 'Por cierto, en el pueblo hay una consultora nuestra, la doctora Solberg. Estudia los menhires. Habla con ella. Pero no le digas que es bajita. Nunca.' }] },
			{ say: 'handsome', text: 'Cuando estés list{o|a|e}, búscame junto a la valla de la excavación. Prepara a tu equipo. Handsome tiene un mal presentimiento, y los presentimientos de Handsome aciertan el sesenta por ciento de las veces. Lo calculó Matière.' },
			{ set: { 'flag.b01_handsome_cromlech': true } },
		],
		b01_handsome_cromlech_espera: [
			{ say: 'handsome', as: 'Turista', text: '¡Qué piedra tan bonita! …Te espero junto a la valla de la excavación cuando estés list{o|a|e}. Cura a tu equipo antes. Handsome insiste.' },
		],
		b01_handsome_cromlech_despues: [
			{ say: 'handsome', text: 'Handsome sigue aquí, escribiendo el informe. Lleva once páginas. Seis son dibujos.' },
			{ if: 'flag.b01_delatar', then: [{ say: 'handsome', text: 'Los periodistas no me dejan en paz. Uno me ha preguntado si soy un turista. Le he dicho que sí. Por fin funciona el disfraz.' }] },
			{ if: 'flag.b01_handsome', then: [{ say: 'handsome', text: 'Lo de anoche queda entre tú y yo. Handsome no olvida a quien sabe guardar un secreto.' }] },
			{ if: 'flag.b01_trato_sera', then: [{ say: 'handsome', text: '…Hmm. Ve a Yantra, {jugador}. Handsome tiene trabajo. Mucho trabajo.' }] },
			{ say: 'handsome', text: 'La Torre Maestra está al este, pasando la Ruta 11 y la Cueva Reflejos. Ve. Allí te esperan.' },
		],

		// ---- Anciana ----
		b01_anciana_cromlech: [
			{ if: '!flag.b01_cromlech_hecha', then: [
				{ say: 'anciana_cromlech', text: 'Mi abuela decía que estas piedras son tumbas. Que hace tres mil años hubo una guerra, y un rey construyó una máquina para devolverle la vida a su Pokémon. Y luego la usó para acabar la guerra.' },
				{ say: 'anciana_cromlech', text: 'Y la guerra se acabó. Y todo lo demás también.' },
				{ say: 'anciana_cromlech', text: 'Desde que vinieron los de Lemnis, las piedras zumban de noche. Mi Espurr no duerme. Yo tampoco. Pero yo ya no dormía antes.' },
			], else: [
				{ say: 'anciana_cromlech', text: 'Anoche brillaron. Todas las piedras a la vez.' },
				{ say: 'anciana_cromlech', text: 'La última vez que brillaron así fue la noche en que aquel hombre de la melena roja hizo salir una flor gigante de la tierra. Yo estaba aquí. Lo vi desde esta misma piedra.' },
				{ say: 'anciana_cromlech', text: 'Los jóvenes creen que las cosas terminan. Las cosas no terminan. Se quedan dormidas.' },
			] },
		],

		// ---- Excavación ----
		b01_guardia_excavacion: [
			{ if: '!flag.b01_cromlech_hecha', then: [
				{ say: 'guardia_lemnis', text: 'Propiedad privada. Proyecto de conservación arqueológica. No hay nada que ver.' },
				{ if: 'rep.lemnis >= 5', then: [{ say: 'guardia_lemnis', text: '…Usted es {el|la|le} de la inauguración. La empresa le tiene en buena estima. Aun así: no hay nada que ver.' }] },
				{ if: 'flag.b01_prensa_verdad', then: [{ say: 'guardia_lemnis', text: '…Le conozco. Usted le habló de «grietas» a la prensa. Circule.' }] },
				{ if: 'rep.lemnis <= -5 && !flag.b01_prensa_verdad', then: [{ say: 'guardia_lemnis', text: '…Le conozco. Tenemos su foto en la garita. Circule.' }] },
			], else: [
				{ if: 'flag.b01_trato_sera', then: [
					{ say: 'guardia_lemnis', text: '…Buenos días. —Se cuadra un poco al verte. Alguien le ha dado instrucciones sobre ti.' },
				], else: [
					{ say: 'guardia_lemnis', text: 'Alguien entró anoche. Rompió la lona del lado oeste. Si sabe usted quién fue, la empresa ofrece una recompensa.' },
					{ text: 'Te mira fijamente. Tú miras la lona.' },
				] },
			] },
		],
		b01_xero_cafe: [
			{ text: 'Junto a la valla, sentado en una caja de transporte, Xero bebe café de un termo. Tiene ojeras de tres días y el visor subido en la frente.' },
			{ say: 'xero', text: '¡Ah! La visita nocturna. ¡Bwahaha! Tranquilidad: no le he contado a nadie que te vi. Bueno, se lo conté a la señorita Lemnis. Pero ella ya lo sabía. Ella siempre lo sabe todo antes.' },
			{ if: 'flag.b01_delatar', then: [{ say: 'xero', text: 'Lo de los periódicos ha sido… vigorizante. Mis jefes están histéricos. Yo, encantado: cuando la gente se pone histérica, nadie revisa mi presupuesto.' }] },
			{ say: 'xero', text: '¿Un consejo de un viejo genio incomprendido? Las máquinas no son buenas ni malas. Son hambrientas. Lo difícil es saber qué comen.' },
			{ say: 'xero', text: 'Y dale recuerdos a… —Se calla. Da un sorbo largo al café—. A nadie. Olvídalo. ¡Bwahaha!' },
			{ set: { 'flag.b01_xero_cafe': true } },
		],
		b01_xero_cafe_2: [
			{ say: 'xero', text: 'Doce por ciento. Sigo en el doce por ciento. ¡Bwahaha! …No es gracioso. Me río por costumbre.' },
		],
		b01_excavacion_lente: [
			{ text: 'Miras la excavación a través de la Lente de Aura, con {riolu} a tu lado.' },
			{ if: '!flag.b01_cromlech_hecha', then: [
				{ text: 'Sobre las lonas que cubren los menhires del norte, el aire está lleno de costuras violetas. No una, como en la Puerta de Luminalia. Decenas. Cosidas unas sobre otras, como un remiendo que alguien ha tenido que rehacer muchas veces.' },
			], else: [
				{ text: 'Las costuras violetas siguen ahí. Pero ahora todas tiran en la misma dirección, hacia el centro del cráter. Hacia el hueco con forma de flor.' },
			] },
			{ text: '{riolu} aparta la mirada antes que tú.' },
		],

		// ---- LA NOCHE DE CRÓMLECH ----
		b01_cromlech_noche: [
			{ prompt: 'Es una escena larga, con un combate difícil. ¿Entras ahora?', choice: [
				{ text: 'Sí. Esta noche.', then: [] },
				{ text: 'Todavía no.', then: [{ end: true }] },
			] },
			{ text: '**Esa noche.**' },
			{ text: 'No sale la luna. Los focos de la excavación sí: cuatro torres de luz blanca que barren el prado. Handsome los cronometra con un reloj de bolsillo, agazapado detrás de un menhir.' },
			{ say: 'handsome', text: 'Treinta y un segundos. No treinta. Treinta y uno. Ese segundo es nuestro.' },
			{ say: 'handsome', text: 'El plan: yo distraigo a los guardias de la puerta principal. Tú entras por el lado oeste, donde la lona está suelta. Miras. Te fijas en todo. Sales. Nadie te ve.' },
			{ choice: [
				{ text: '«¿Cómo vas a distraerlos?»', then: [{ text: 'Handsome se pone el sombrero de paja.' }, { say: 'handsome', text: 'Soy un turista perdido. Un turista perdido muy, muy pesado.' }] },
				{ text: '«¿Y si me ven?»', then: [{ say: 'handsome', text: 'Entonces eres {un|una|une} turista perdid{o|a|e}. {Un|Una|Une} turista perdid{o|a|e} muy, muy pesad{o|a|e}. Es un buen plan. Sirve para todo.' }] },
			] },
			{ text: 'Handsome se aleja hacia la entrada. A los diez segundos lo oyes: «¡Disculpen! ¡Buenas noches! ¿Esto es el museo? ¿Hay tienda de recuerdos? ¿Venden imanes de nevera?».' },
			{ text: 'Los focos giran. Uno. Dos. Treinta y un segundos. Te cuelas por debajo de la lona.' },
			{ text: 'Dentro, el prado ya no es un prado. Es un agujero: un cráter de veinte metros de ancho, con andamios y escaleras metálicas que bajan en espiral alrededor de los menhires. Y los menhires siguen hacia abajo. Y siguen. No eran piedras sueltas: eran **la punta** de algo enterrado.' },
			{ text: '{riolu} se pega a tu pierna. Tiembla. No es miedo; es otra cosa. Su aura parpadea, como una vela junto a una ventana abierta.' },
			{ say: 'rotom', text: '¡Bzzt! Lectura de energía… negativa. ¿Negativa? No sabía que la energía pudiera ser negativa. Es como si algo… tirara hacia dentro.' },
			{ text: 'Bajas. Abajo del todo, bajo una carpa y una maraña de cables, hay una **máquina**.' },
			{ text: 'O lo que queda de una. Placas de un metal verdoso que no reconoces, pulido como si lo hubieran forjado ayer, aunque tiene la pátina de tres mil años. Engranajes del tamaño de una puerta. Y en el centro, un hueco con forma de flor. Vacío.' },
			{ text: 'Alguien ha conectado todo eso a generadores modernos con cables de colores. Alguien ha pegado etiquetas de inventario en cada pieza: «FRAG-0147», «FRAG-0148», «FRAG-0149»…' },
			{ text: 'En una pantalla, letras verdes: **NODO 01 · KALOS · CALIBRACIÓN: 12 %**.' },
			{ text: 'Delante de otra pantalla, de espaldas a ti, un hombre con bata y gafas de visor rojo teclea a toda velocidad. Habla solo.' },
			{ say: 'xero', as: 'Científico', text: '…coeficiente de transferencia al doce por ciento. Doce. ¡Doce! Hace tres mil años esta preciosidad devolvió la vida a un ser vivo con el cien por cien, y yo no paso del doce. ¡Bwahaha! No es un fracaso: es un margen de mejora…' },
			{ text: 'Se gira. Te ve. No se asusta. Se sube el visor a la frente y te observa con el interés de quien acaba de encontrar un insecto raro.' },
			{ say: 'xero', as: 'Científico', text: 'Oh. Un visitante. Llegas tarde para la visita guiada y pronto para la inauguración.' },
			{ say: 'xero', text: 'Xero. Contratista de I+D, en libertad condicional, con permiso firmado para trabajar aquí. Todo legal. Todo en regla. ¿Ves? Me lo sé de memoria.' },
			{ say: 'rotom', text: '¡Bzzt! Xero. Ex científico del Team Flare. Diseñó el traje de… ¡bzzt! Datos restringidos.' },
			{ say: 'xero', text: '¿Sabes qué es esto? Claro que no. Nadie lo sabe. Bueno, *uno* sí, pero lleva tres mil años sin querer hablar del tema. ¡Bwahaha!' },
			{ text: 'Unos pasos bajan por la escalera metálica. Tacones. Sin prisa.' },
			{ say: 'sera', text: 'Doctor Xero. Váyase a dormir.' },
			{ say: 'xero', text: 'Pero si estoy en mitad de…' },
			{ say: 'sera', text: 'Váyase. A dormir.' },
			{ text: 'Xero recoge su tableta, refunfuña algo sobre «la gente de las finanzas» y sube la escalera. Al pasar a tu lado, te guiña un ojo. No sabes por qué.' },
			{ text: 'Serafina Lemnis baja los últimos escalones. Traje azul medianoche, guantes blancos. A las dos de la mañana, en el fondo de un agujero, sigue impecable.' },
			{ say: 'sera', text: 'Buenas noches, {jugador}.' },
			{ text: 'No te pregunta cómo sabe tu nombre. No hace falta.' },
			{ say: 'sera', text: 'Su amigo el turista está en la puerta principal, preguntando si vendemos imanes. Mis guardias le están enseñando el catálogo. Despacio.' },
			{ say: 'sera', text: 'Siéntese, si quiere. Hay una caja. No es cómoda, pero está limpia.' },
			{ choice: [
				{ text: '«¿Qué es esta máquina?»', then: [
					{ say: 'sera', text: 'Es historia. Historia peligrosa. Y la historia peligrosa no se deja enterrada: se desentierra con cuidado, por gente seria, antes de que la desentierre gente que no lo es.' },
				] },
				{ text: '«Esto no es conservación.»', then: [
					{ say: 'sera', text: 'Lo es. Conservamos esto lejos de quien quiera usarlo. ¿Preferiría que lo encontrara el Team Flare? Ya lo intentaron una vez. Habrá leído usted cómo acabó.' },
				] },
				{ text: 'Quedarte de pie, en silencio.', then: [
					{ af: { sera: 1 } },
					{ text: 'Te observa un momento.' },
					{ say: 'sera', text: 'Prefiere estar de pie. Bien. Yo también.' },
				] },
			] },
			{ if: 'flag.b01_prensa_verdad', then: [
				{ say: 'sera', text: 'Usted dijo la verdad a la prensa la noche de la inauguración. Fue imprudente. Y honesto. Eso lo valoro.' },
				{ af: { sera: 2 } },
			] },
			{ if: 'flag.b01_prensa_lemnis', then: [
				{ say: 'sera', text: 'Usted le dijo a la prensa que Lemnis lo tenía todo controlado. No se lo pedí. No se lo voy a agradecer. Pero lo recuerdo.' },
			] },
			{ if: 'flag.b01_bastien_rompe', then: [{ say: 'sera', text: 'Por cierto: el señor Lacroix rompió su contrato esta semana. Cláusula catorce. En su declaración le mencionaba a usted. Dos veces.' }] },
			{ if: 'flag.b01_bastien_cubierto', then: [{ say: 'sera', text: 'Por cierto: alguien presentó ante la Liga una denuncia sobre la Cueva Brillante. Con nombre y apellidos. El suyo. Valiente. Y poco práctico.' }] },
			{ if: 'flag.b01_bastien_silencio', then: [{ say: 'sera', text: 'Por cierto: el señor Lacroix nos asegura que en la Cueva Brillante no vio nada. Nada de nada. Lo dijo dos veces, sin que nadie se lo preguntara.' }] },
			{ say: 'sera', text: 'Pero antes de hablar, permítame una formalidad. Usted ha entrado sin permiso en una propiedad privada. Podría llamar a la policía local. Prefiero algo más… civilizado.' },
			{ text: 'Se ajusta los guantes. Despacio, dedo a dedo.' },
			{ say: 'sera', text: 'Los modales —tira del guante izquierdo— hacen —tira del derecho— a la persona.' },
			{ say: 'sera', text: 'Una demostración. Nada personal. Quiero saber con quién estoy hablando.' },
			{ battle: 'sera_1', lose: 'continue',
				onWin: [
					{ af: { sera: 3 } },
					{ text: 'Serafina recoge a su Kirlia sin mirarla, con un gesto exacto. Por primera vez, te mira de verdad.' },
					{ say: 'sera', text: 'Ahora ya sé con quién hablo.' },
				],
				onLose: [
					{ text: 'No lo dice con desprecio. Lo dice como quien apunta un dato.' },
					{ heal: 'Serafina hace un gesto con dos dedos. Un guardia baja con un maletín de Pociones y atiende a tu equipo sin decir palabra.' },
					{ say: 'sera', text: 'No me mire así. Negociar con alguien herido es de mala educación.' },
				] },
			{ quest: 'b01_t_sera', stage: 'trato' },
			{ quest: 'b01_m7', stage: 'decision' },
			{ say: 'sera', text: 'Le seré franca, porque la franqueza ahorra tiempo, y el tiempo es lo único que no se puede comprar.' },
			{ say: 'sera', text: 'Esto es conservación. Sacamos estos restos para que nadie los use. Usted puede contarlo y causar pánico, o puede trabajar con nosotros y asegurarse de que se haga bien.' },
			{ say: 'sera', text: 'Piense en lo que pasaría si mañana esto saliera en portada. Cien curiosos con palas. Diez con malas intenciones. Uno que sepa lo que hace. Basta con uno.' },
			{ say: 'sera', text: 'Le doy mi palabra. Y yo cumplo mi palabra.' },
			{ text: 'Detrás de ella, la máquina zumba. {riolu} gruñe muy bajito, sin apartar la vista del hueco con forma de flor.' },
			{ text: 'Piensas en Alexia, que duerme con el teléfono en la mano.', cond: 'flag.b01_alexia_relieve' },
			{ text: 'Piensas en Handsome, en la puerta, mirando un catálogo de imanes para darte tiempo.' },
			{ text: 'Piensas en «FRAG-0149». En cuántos fragmentos más habrá. En para qué los querrá alguien.' },
			{ prompt: '¿Qué haces con lo que has visto?', choice: [
				{ text: '«Mañana lo sabrá todo Kalos.» (Contárselo a Alexia y que lo publique.)', then: [
					{ set: { 'flag.b01_delatar': true } },
					{ rep: { lemnis: -10, policia: 3 } }, { af: { sera: -5 } },
					{ text: 'Por primera vez, algo se mueve en la cara de Serafina. Muy poco. Como una grieta finísima en un vaso.' },
					{ say: 'sera', text: 'Entiendo. Entonces mañana será un día muy largo para los dos.' },
					{ say: 'sera', text: 'Un consejo gratuito, {jugador}: cuando la gente tiene miedo, no busca la verdad. Busca a alguien a quien seguir. Asegúrese de que no le sigan a usted. No le va a gustar.' },
				] },
				{ text: '«Esto se lo cuento a quien tengo que contárselo.» (Solo a Handsome.)', then: [
					{ set: { 'flag.b01_handsome': true } },
					{ rep: { policia: 5 } }, { af: { sera: 2 } },
					{ say: 'sera', text: 'Al turista de los imanes. —Una pausa—. Discreto. No es lo que esperaba.' },
					{ text: 'No dice si eso le gusta. Pero tampoco lo dice como si no le gustara.' },
				] },
				{ text: '«Acepto. Pero quiero ver lo que hacen.» (Aceptar el trato de Serafina.)', then: [
					{ set: { 'flag.b01_trato_sera': true } },
					{ rep: { lemnis: 8, policia: -5 } }, { af: { sera: 6 } },
					{ say: 'sera', text: 'Sabía que era usted una persona razonable.' },
					{ text: 'Saca del bolsillo interior de la chaqueta un dispositivo plateado, plano, con una lemniscata grabada.' },
					{ say: 'sera', text: 'Un contacto directo. Conmigo, no con la empresa. Hay una diferencia, y le pido que la recuerde.' },
					{ give: 'holomisorsera' },
					{ say: 'sera', text: 'Y esto, para gastos. No es un soborno. Los sobornos son bastante más caros.' },
					{ money: 5000 },
					{ say: 'sera', text: 'Bienvenid{o|a|e}, {jugador}. Le avisaré cuando le necesite.' },
				] },
			] },
			{ quest: 'b01_t_sera', done: true },
			{ intel: { npc: 'sera', text: 'Dirige la excavación de Crómlech. Te ofreció un trato: «trabajar con nosotros». Pawniard y Kirlia. Dice que cumple su palabra.' } },
			{ intel: { npc: 'xero', text: 'Trabaja para Lemnis en la excavación de Crómlech, «con permiso firmado». Habló de un «coeficiente de transferencia» del doce por ciento.' } },
			{ say: 'sera', text: 'Buenas noches. Cierre la lona al salir, por favor. Entra frío.' },
			{ text: 'Serafina sube la escalera. Sus pasos se alejan. La carpa se queda en silencio, salvo por el zumbido.' },
			{ text: 'Ya te ibas cuando {riolu} se gira de golpe hacia lo alto del cráter.' },
			{ text: 'Arriba, en el borde, recortada contra la luz de un foco, hay una silueta. Pelo rosa cortado a cuchilla. Un visor rojo. La mujer de la Cueva Brillante.' },
			{ text: 'No te mira a ti. Mira la máquina. La mira como se mira un altar.' },
			{ say: 'melia', text: '…Esta vez será para todos, señor. Se lo prometo.' },
			{ text: 'El foco gira. Treinta y un segundos. Cuando vuelve, en el borde ya no hay nadie.' },
			{ intel: { npc: 'melia', text: 'Estaba en Crómlech esa noche, mirando la máquina desde el borde del cráter. Serafina no la vio.' } },
			{ text: 'Sales por la lona. Handsome te espera detrás de un menhir, con tres imanes de nevera en la mano y cara de haber sufrido mucho.' },
			{ say: 'handsome', text: 'Tres imanes. Me han vendido tres imanes. Uno tiene forma de Lemnis. ¿Y bien?' },
			{ if: 'flag.b01_delatar', then: [
				{ text: 'Le cuentas lo que viste. Y lo que vas a hacer.' },
				{ say: 'handsome', text: '¿A la prensa? —Se queda callado un buen rato—. Handsome no puede hacer eso. Handsome necesita pruebas, papeles, jueces. Tú no.' },
				{ say: 'handsome', text: 'Va a ser un escándalo enorme. Lemnis lo va a negar. Pero la gente lo sabrá. Eso vale algo. —Suspira—. Mucho, espero.' },
				{ text: 'Ya fuera del círculo de menhires, con las manos todavía temblando, marcas el número de Alexia. Contesta al primer tono.' },
				{ say: 'alexia', text: '¿{jugador}? ¿Qué hora es…? Da igual. Cuéntamelo todo. Despacio. Estoy grabando.' },
			] },
			{ if: 'flag.b01_handsome', then: [
				{ text: 'Se lo cuentas todo. La máquina, las etiquetas, el «Nodo 01», Xero, Serafina, el zumbido. La mujer del borde.' },
				{ say: 'handsome', text: 'Xero… —Aprieta la mandíbula—. Yo firmé su libertad condicional. Le di mi palabra a un juez de que se portaría bien.' },
				{ say: 'handsome', text: 'Bien. Esto queda entre tú y yo. Si Lemnis no sabe que lo sabemos, Lemnis no se esconde. Handsome va a tirar de este hilo. Despacito.' },
			] },
			{ if: 'flag.b01_trato_sera', then: [
				{ say: 'handsome', text: '¿{jugador}?' },
				{ text: 'No le cuentas nada. Handsome mira el bulto del Holomisor en tu bolsillo. No dice nada durante un rato largo.' },
				{ say: 'handsome', text: 'Hmm. Handsome no pregunta. Handsome confía. —Se cala el sombrero de paja—. Pero Handsome tiene buena memoria.' },
			] },
			{ if: 'rep.policia >= 10 && !has("linternapi")', then: [
				{ say: 'handsome', text: 'Toma. Para la **Cueva Reflejos**, al este. Dicen que está oscura como el bolsillo de un Croagunk. Es una linterna de la Policía Internacional. Devuélvemela… bueno, quédatela. Tengo cuatro.' },
				{ give: 'linternapi' },
			] },
			{ say: 'handsome', text: 'Ve a Yantra. La Torre Maestra te espera. Y Handsome tiene que escribir un informe. Uno muy largo. Con dibujos.' },
			{ text: 'Al cruzar el círculo de menhires, de vuelta al pueblo, te parece ver a alguien muy alto sentado sobre una piedra, con una flor oscura en el hombro. Cuando vuelves a mirar, solo hay piedra.' },
			{ set: { 'flag.b01_cromlech_hecha': true } },
			{ quest: 'b01_m7', done: true },
			{ quest: 'b01_m8', stage: 'yantra' },
			{ diary: 'Hoy fuimos con Handsome a ver las piedras de Crómlech de noche. ¡Handsome iba disfrazado de turista! (No engañaba a nadie, pero no se lo digas.) Allí vimos a la señorita Lemnis, la del discurso. Fue muy educada con nosotros. Luego volvimos a dormir. {riolu} tardó mucho en dormirse. Yo no duermo, ¡pero hice como que sí para hacerle compañía!' },
			{ save: true },
		],

		// =================== Ruta 11 ===================
		b01_lila_ruta11: [
			{ text: 'Alguien viene corriendo por el sendero desde el este. Pelo blanco plateado, un mechón verde menta, túnica color crema. Un Eevee corre a su lado, la adelanta, vuelve, y la adelanta otra vez.' },
			{ say: 'lila', text: '¡{jugador}! ¡E-espera! ¡Para! Uf… uf… perdona. Vine corriendo. Desde Yantra. No es tan lejos. Bueno, sí es lejos.' },
			{ say: 'lila', text: '¿Te acuerdas de mí? Lila. De la inauguración. La de la Baya Aranja. La que hablaba con desconocidos y luego se arrepentía.' },
			{ choice: [
				{ text: '«Claro que me acuerdo.»', then: [{ af: { lila: 2 } }, { say: 'lila', text: '¿S-sí? —Se le ponen las orejas rojas—. Ah. Bien. Eso está bien.' }] },
				{ text: '«¿La de las orejas rojas?»', then: [{ af: { lila: 1 } }, { say: 'lila', text: '¡No están rojas! …Ahora sí. Por tu culpa.' }] },
				{ text: '«Mmm… ¿la de la Torre?»', then: [{ say: 'lila', text: 'L-la de la Torre, sí. Bueno. Es más de lo que recuerda la mayoría.' }] },
			] },
			{ if: 'inParty("lucario")', then: [
				{ text: 'Lila se queda mirando a {riolu} con la boca abierta.' },
				{ say: 'lila', text: '¿Es… es él? ¡Ha evolucionado! ¡Es enorme! Bueno, enorme no. Es más alto que yo. Bueno, eso no es difícil.' },
				{ text: '{riolu} se agacha un poco y le da un toquecito en la frente con el puño. Lila se ríe por la nariz y luego se tapa la boca.' },
			], else: [
				{ text: 'Lila se agacha frente a {riolu}. Le mira el hombro, donde tenía la herida la noche de la Fisura. Ya no queda ni cicatriz.' },
				{ say: 'lila', text: 'Estás bien. Estás muy bien. Has crecido. ¿Te acuerdas de mí, pequeño?' },
				{ text: '{riolu} le da un toquecito en la frente con el puño. Lila se ríe por la nariz y luego se tapa la boca.' },
			] },
			{ happy: { who: 'riolu', n: 3 } },
			{ say: 'lila', text: 'C-Corelia me mandó a buscarte. Dice que «{el|la|le} del Riolu de Isla Hierro» tiene que pasar por la Torre, que el abuelo Cornelio quiere conocerte. Y que si me pierdo por el camino, que no me preocupe, que ya me encontrarán. Eso último no sé si era broma.' },
			{ say: 'lila', text: 'Te acompaño un trecho. Si… si no te molesta. Eevee quiere. Eevee siempre quiere.' },
			{ set: { 'flag.b01_lila_r11': true } },
			{ quest: 'b01_t_lila', stage: 'yantra' },
			{ text: 'Durante un rato, ninguno de los dos dice nada. Lila carraspea tres veces antes de hablar.' },
			{ say: 'lila', text: 'E-esto… ¿quieres preguntarme algo? Por el camino. Para no ir callados. Bueno, callados también está bien.' },
			{ choice: [
				{ text: '«Háblame de Corelia.»', then: [
					{ say: 'lila', text: 'Corelia es… ¡a tope! Siempre dice «a tope». Patina por toda la ciudad. Su gimnasio es una pista. Y su Hawlucha… e-eso no te lo debería contar.' },
					{ text: 'Lo piensa. Mira a Eevee. Eevee la mira a ella.' },
					{ say: 'lila', text: 'Bueno. Su **Hawlucha** ataca desde arriba, desde el techo, desde donde no lo esperas. Y a casi todo su equipo le hacen mucho daño los ataques **voladores**, **psíquicos** y de tipo **hada**. Ya está. Lo he dicho. Si te pregunta, lo adivinaste tú sol{o|a|e}.' },
					{ set: { 'flag.b01_lila_conto_corelia': true } },
					{ intel: { npc: 'corelia', text: 'Según Lila, su Hawlucha ataca desde arriba. Volador, Psíquico y Hada hacen daño a casi todo su equipo.' } },
				] },
				{ text: '«Háblame de ti.»', then: [
					{ af: { lila: 2 } },
					{ say: 'lila', text: '¿De mí? N-no hay mucho. Vivo en la Torre desde siempre. Cornelio me encontró allí cuando era un bebé, en la escalinata, envuelta en una tela. Todavía la guardo. Tiene un bordado de hilo azul y plata: un lazo que da vueltas y nunca se acaba.' },
					{ say: 'lila', text: 'Soy aprendiz. Quiero ser **Guardiana de la Ceremonia**: la que entrega las Piedras Activadoras a los entrenadores. Para eso hay que pasar una prueba. La **Prueba de la Llama**.' },
					{ say: 'lila', text: 'Siempre la suspendo. —Lo dice muy rápido, para que duela menos—. Pero bueno. Eso es otra historia.' },
				] },
			] },
		],
		b01_r11_pareja: [
			{ say: 'lila', text: '¡Ah! Son Maëlle y Gabin. Entrenan en la playa de la Torre. Siempre retan de dos en dos, uno detrás del otro. N-no te preocupes, yo te sujeto la mochila.' },
		],
		b01_lila_despedida_r11: [
			{ if: '!visited("yantra")', then: [
				{ text: 'Lila se detiene donde el sendero baja hacia la Cueva Reflejos.' },
				{ say: 'lila', text: 'Aquí… aquí me vuelvo. Yo voy por la playa, por el camino de la marea. No me gusta la Cueva Reflejos. Los espejos me miran raro. Bueno, los espejos no miran. Pero me miran raro.' },
				{ if: '!has("farollana") && !has("linternapi")', then: [
					{ say: 'lila', text: 'Ah, y dentro está muy oscuro. Muy, muy oscuro. ¿Tienes luz? …¿No? Hay una guarda en la cueva, la señora Hortense. Dile que vas de mi parte. Bueno, mejor no. La última vez se me cayó su farol en un charco.' },
				] },
				{ say: 'lila', text: 'Te espero en Yantra. ¡En la entrada! En la de la ciudad, no en la de la cueva. Eevee, despídete.' },
				{ text: 'Eevee te da un golpecito con la cola en la pierna y sale corriendo detrás de Lila, que ya baja por la ladera hacia el mar, agitando la mano sin mirar atrás.' },
			] },
		],

		// =================== Cueva Reflejos ===================
		b01_guarda_reflejos: [
			{ text: 'Junto a la pared, sentada en una silla plegable, una señora mayor con chaleco reflectante hace punto a la luz de un farol de aceite.' },
			{ say: 'guarda_reflejos', text: '¿Vas a entrar a oscuras? ¿Sin luz? ¿Tú sol{o|a|e}? Ni hablar. Ahí dentro hay un Sableye que roba linternas. Y a veces personas.' },
			{ say: 'guarda_reflejos', text: 'Mi farol no te lo puedo dejar: es el único que tengo, y la última vez que lo presté acabó en un charco. Pero…' },
			{ text: 'Rebusca debajo de la silla y saca una linterna negra, pesada, con una placa metálica: **Policía Internacional**.' },
			{ say: 'guarda_reflejos', text: 'Un señor con gabardina me dejó esto hace dos días. Dijo: «Si viene alguien con una Tarjeta de Colaborador, désela. Pero antes hágale la pregunta de seguridad».' },
			{ say: 'guarda_reflejos', text: 'A ver esa tarjeta.' },
			{ text: 'Le enseñas la Tarjeta de Colaborador. La mira muy de cerca, con las gafas en la punta de la nariz.' },
			{ say: 'guarda_reflejos', text: 'Tres faltas de ortografía. Es auténtica. Ahora, la pregunta: «¿Cuál es la comida favorita del agente?».' },
			{ prompt: '¿Cuál es la comida favorita de Handsome?', choice: [
				{ text: 'La cocina de Matière.', then: [{ say: 'guarda_reflejos', text: '¡Correcto! Aquí pone: «La cocina de Matière, aunque sea terrible». Lo de terrible lo ha subrayado dos veces.' }] },
				{ text: 'Los macarons del Café Soleil.', then: [{ say: 'guarda_reflejos', text: 'Incorrecto. Pero bah: la tarjeta tiene las faltas y tú tienes cara de buena persona. Llévatela.' }] },
				{ text: 'Lo que coma un turista.', then: [{ text: 'La guarda se ríe tanto que se le escapa un punto del jersey.' }, { say: 'guarda_reflejos', text: 'La respuesta era otra. Pero esa es mejor.' }] },
			] },
			{ give: 'linternapi' },
			{ say: 'guarda_reflejos', text: 'Y si ves al Sableye, no lo mires a los ojos. Le gustan las cosas que brillan. Y tus ojos brillan.' },
		],
		b01_espejo: [
			{ quest: 'b01_s_espejo', stage: 'cueva' },
			{ text: 'En un recodo, la cueva se abre en una sala redonda. En el centro hay un espejo natural enorme, del suelo al techo, liso como agua quieta. Tu luz rebota en él y lo llena todo de un azul suave.' },
			{ text: '{riolu} se separa de ti. Camina hasta el espejo. Se queda mirándose.' },
			{ if: 'inParty("riolu")', then: [
				{ text: 'Al principio, el reflejo es solo eso: un Riolu pequeño, con el pelo un poco revuelto. {riolu} levanta una pata. El reflejo también.' },
				{ text: 'Y detrás del reflejo, donde debería estar la pared de la cueva, hay **otra silueta**. Más alta. Patas largas, una púa en el pecho, los apéndices de la cabeza caídos como una melena. Un Lucario. Quieto. Mirándolo.' },
				{ text: '{riolu} no se asusta. Ladea la cabeza. La silueta ladea la cabeza.' },
			], else: [
				{ text: 'En el espejo, {riolu} se ve a sí mismo: alto, sereno. Y detrás, otra silueta que brilla con un aura distinta. Más grande. Con franjas oscuras en las patas, como llamas, y los apéndices de la cabeza erguidos como una corona.' },
				{ text: 'Un Lucario que todavía no es.' },
			] },
			{ text: '{riolu} se gira hacia ti, como para comprobar que tú también lo has visto.' },
			{ choice: [
				{ text: '«Lo vi.»', then: [{ text: 'Asiente, muy serio. Vuelve a mirar el espejo. Cuando la silueta se desvanece, no parece triste. Parece que tiene una cita.' }] },
				{ text: 'Ponerte a su lado frente al espejo.', then: [{ text: 'Te pones a su lado. En el espejo, la silueta se coloca detrás de tu reflejo, a la altura de tu hombro. Como si siempre hubiera estado ahí.' }] },
				{ text: 'No decir nada.', then: [{ text: 'No dices nada. {riolu} mira el espejo un rato largo. Luego vuelve a tu lado y te da un toquecito en la rodilla con el puño.' }] },
			] },
			{ say: 'rotom', text: '¡Bzzt! Yo no he visto nada. ¿Había algo? Mis sensores dicen que solo había uno. ¡Bzzt! A lo mejor tengo el objetivo sucio.' },
			{ happy: { who: 'riolu', n: 15 } },
			{ quest: 'b01_s_espejo', done: true },
		],

		// =================== Ciudad Yantra ===================
		b01_llegada_yantra: [
			{ text: 'Ciudad Yantra huele a sal y a pan con mantequilla. Las gaviotas gritan. Alguien pasa patinando a toda velocidad por la calle principal, en zigzag entre la gente, y desaparece calle abajo.' },
			{ say: 'lila', text: '¡{jugador}! ¡Aquí! ¡Llegaste! ¿Te miraron raro los espejos? A mí siempre me miran raro.' },
			{ if: 'done.b01_s_espejo', then: [
				{ text: 'Miras a {riolu}. {riolu} te mira a ti. Ninguno de los dos dice nada.' },
				{ say: 'lila', text: '…¿Pasó algo? Tienen cara de haber visto algo.' },
			] },
			{ say: 'lila', text: 'Vamos. La Torre está ahí mismo, y la marea está baja: se puede cruzar. El abuelo Cornelio te espera. Bueno, el abuelo Cornelio espera a todo el mundo. Es su afición.' },
			{ go: 'torre_maestra' },
			{ text: 'El camino de arena cruza el agua hasta el islote. De cerca, la Torre Maestra es más grande de lo que parecía: piedra gris gastada por el mar, con relieves de Lucario en todas las paredes. Dentro, en el centro de la sala, hay un pebetero de bronce.' },
			{ text: 'Junto a él, un anciano calvo de barba blanca y bigote enorme hace estiramientos. Muy despacio. Con mucha concentración.' },
			{ say: 'cornelio', as: 'Anciano', text: '¡Ah! ¡Visita! Un momento, que estoy en la postura del Lucario dormido. —Se queda quieto—. Ya. Ya está. Es una postura muy corta.' },
			{ say: 'cornelio', text: 'Cornelio. Guardián de la Torre Maestra, estudioso de la Megaevolución y abuelo de la líder de esta ciudad, que ahora mismo debe de estar patinando por algún tejado.' },
			{ text: 'Un zumbido de ruedas. Una chica rubia con coleta, casco y patines entra derrapando en la sala, da una vuelta completa al pebetero y frena a un palmo de tu nariz.' },
			{ say: 'corelia', text: '¡Hola, hola, HOLA! ¡Tú eres {el|la|le} del Riolu de Isla Hierro! ¡Lila no ha parado de hablar de ti!' },
			{ say: 'lila', text: '¡No es verdad! …He hablado un poco.' },
			{ say: 'corelia', text: 'Corelia, líder del Gimnasio de Yantra, tipo Lucha. ¡Y heredera de la Megaevolución! ¡A tope!' },
			{ text: 'Corelia se agacha delante de {riolu}, con las manos en las rodillas.' },
			{ say: 'corelia', text: '¡Mira qué aura! ¡Abuelo, mira qué aura!' },
			{ say: 'cornelio', text: 'La estoy viendo, cielo. Soy viejo, no ciego.' },
			{ say: 'cornelio', text: 'En esta torre, los Lucario y los humanos llevan siglos entendiéndose. Aquí nació la Megaevolución: un vínculo tan fuerte entre un Pokémon y su entrenador que transforma a los dos. Bueno, al Pokémon. El entrenador se queda igual, pero más contento.' },
			{ say: 'cornelio', text: 'No se la damos a cualquiera. Primero, la medalla de mi nieta. Luego, la **Prueba de la Torre**. Y entonces, si el vínculo es de verdad… ya veremos.' },
			{ say: 'corelia', text: '¡Te espero en el gimnasio! ¡Trae a todo tu equipo! ¡Y ropa cómoda! ¡Y un casco!' },
			{ text: 'Sale patinando por donde ha venido. Se oye un golpe fuera, y luego un «¡estoy bien!».' },
			{ text: 'Lila se te acerca. Habla tan bajito que casi no la oyes.' },
			{ say: 'lila', text: 'Y… e-esto… cuando puedas… yo tengo una prueba. La **Prueba de la Llama**. ¿Me acompañarías? No tienes que hacer nada. Solo… estar. O no estar. Lo que tú quieras.' },
			{ quest: 'b01_m8', stage: 'gimnasio' },
			{ quest: 'b01_t_lila', stage: 'prueba' },
		],
		b01_ninos_yantra: [
			{ text: 'Tres niños juegan en la plaza. Uno sostiene una piedra de playa contra la muñeca y apunta a su Makuhita.' },
			{ say: null, text: '«¡Makuhita! ¡Respondamos al vínculo! ¡MEGAEVOLUCIÓN!»' },
			{ text: 'Makuhita se rasca la barriga.' },
			{ say: null, text: '«…Es que la piedra es de mentira. Pero algún día.»' },
			{ if: 'flag.b01_torre_hecha', then: [
				{ text: 'Uno de los niños ve el brazalete en tu muñeca. Se le abre la boca. Les da codazos a los otros dos. Los tres se quedan mirándote como si fueras un cometa.' },
			] },
		],
		b01_pescador_yantra: [
			{ say: 'pescador_yantra', text: 'La marea baja dos veces al día y deja el camino a la Torre al descubierto. Así ha sido siempre. Mi abuelo ponía el reloj en hora con la marea.' },
			{ say: 'pescador_yantra', text: 'Desde lo de las Fisuras, la marea hace lo que le da la gana. El martes subió tres veces. El mar no hace eso. Nunca ha hecho eso.' },
			{ if: 'flag.b01_fin', then: [{ say: 'pescador_yantra', text: '¿Y ahora una gira a Johto, por la Puerta? Ten cuidado ahí dentro. Si el mar se ha vuelto loco por esas puertas, imagínate lo que hay dentro de ellas.' }] },
		],

		// ---- Torre: Cornelio, estatua ----
		b01_cornelio: [
			{ if: 'flag.b01_torre_hecha', then: [
				{ say: 'cornelio', text: 'La Torre seguirá aquí cuando vuelvas. Lleva tres mil años esperando a gente como tú; puede esperar un poco más.' },
				{ say: 'cornelio', text: 'Y cuida esa piedra. La tallé con mucho cariño y un poco de artritis.' },
			], else: [
				{ if: '!beat("corelia_g3")', then: [
					{ say: 'cornelio', text: 'Primero, la medalla de mi nieta. Corelia pega fuerte, pero se distrae con cualquier cosa que brille. No se lo digas.' },
				], else: [
					{ say: 'cornelio', text: '¡La medalla! Bien, bien. Cuando estés list{o|a|e}, sube a la azotea. La Prueba de la Torre no se prepara: se vive. Pero cura a tu equipo antes, que vivir también cansa.' },
				] },
				{ if: 'quest.b01_t_lila == "prueba"', then: [
					{ say: 'cornelio', text: 'Ah, y Lila tiene su prueba pendiente. La ha suspendido seis veces. No porque no pueda, sino porque cree que no puede. Que no es lo mismo, aunque se parezca mucho.' },
				] },
			] },
		],
		b01_estatua: [
			{ text: 'En lo alto de la escalera de caracol, a través de una ventana, se ve la estatua: un Lucario de piedra con el puño en alto, rodeado por un aura tallada en la roca que parece moverse con el viento.' },
			{ if: 'inParty("riolu") || inParty("lucario")', then: [{ text: '{riolu} la mira un buen rato. Luego levanta el puño, imitándola. Lo baja enseguida, como si le diera vergüenza que lo vieras.' }] },
			{ if: 'flag.b01_torre_hecha', then: [{ text: 'Desde que bajaste de la azotea, te parece que la estatua mira un poco más hacia el lado de la ciudad. Seguro que son imaginaciones tuyas.' }] },
		],

		// ---- Prueba de la Llama (Lila) ----
		b01_lila_llama: [
			{ text: 'Es de noche. La Torre está vacía. Cornelio ha apagado el pebetero para la prueba; solo queda el olor a ceniza tibia y la luz de la luna entrando por las ventanas.' },
			{ say: 'lila', text: 'Gracias por venir. De verdad. Es que… siempre la suspendo. Cinco veces. Bueno, seis. La sexta no cuenta: me dio hipo.' },
			{ say: 'lila', text: 'El pebetero no se enciende con fuego. En el fondo tiene un trozo de Piedra Activadora, como las de las pulseras. Si Eevee y yo estamos tranquilas, tranquilas de verdad, la piedra se enciende sola.' },
			{ say: 'lila', text: 'Y yo nunca estoy tranquila. Cuando sé que alguien me mira, se me olvida respirar.' },
			{ say: 'lila', text: 'Por eso te iba a pedir… que no me mires. ¿Puede ser? Que estés. Pero que no me mires.' },
			{ text: 'Lila se arrodilla frente al pebetero. Eevee se sienta a su lado, muy derecho. Ella pone las dos manos en el borde de bronce. Le tiemblan.' },
			{ text: 'Pasa un minuto. La piedra del fondo sigue apagada. Lila respira muy rápido, muy corto.' },
			{ say: 'lila', text: 'E-esto… perdón. Perdón, ya empiezo. Ya.' },
			{ prompt: '¿Qué haces?', choice: [
				{ text: 'Sentarte cerca, mirando el pebetero y no a ella. «Aquí estoy. No me voy.»', then: [
					{ af: { lila: 8 } },
					{ set: { 'flag.b01_lila_llama': true } },
					{ text: 'Te sientas en el suelo, a medio metro. Miras el pebetero, como te pidió. No a ella.' },
					{ text: 'Oyes cómo su respiración se va haciendo más lenta. Más. Más todavía. Eevee bosteza.' },
					{ text: 'En el fondo del pebetero aparece un punto de luz. Pequeño, como una brasa. Crece. Y de pronto la llama sube, azul y blanca, hasta el techo, y la sala entera se ilumina.' },
					{ text: 'Lila no grita. No dice nada. Solo te das cuenta, un rato después, de que te está sujetando la manga. No sabes desde cuándo. Ella tampoco.' },
					{ say: 'lila', text: '…Ah. —Se mira la mano. Te suelta como si quemara—. P-perdón. Eso no era parte de la prueba.' },
					{ say: 'lila', text: 'La encendí. —Lo dice muy bajito, como si en voz alta pudiera apagarse—. La encendí, {jugador}.' },
				] },
				{ text: 'Darle consejos: «Respira en cuatro tiempos. Concéntrate en las manos».', then: [
					{ af: { lila: 3 } },
					{ text: 'Lila asiente. Respira en cuatro tiempos. Se concentra en las manos. Lo hace exactamente como le dices, con la seriedad de una alumna aplicada.' },
					{ text: 'La piedra parpadea. Una vez. Dos. Y se apaga.' },
					{ say: 'lila', text: 'G-gracias… aunque no era eso.' },
					{ text: 'Se queda mirando el pebetero apagado. Luego sonríe. Una sonrisa pequeña y, para tu sorpresa, tranquila.' },
					{ say: 'lila', text: 'Parpadeó. En seis intentos nunca había parpadeado. Ni una vez. —Se le ponen las orejas rojas—. La próxima vez. La próxima vez, sí.' },
				] },
				{ text: 'Hacer lo que te pidió: salir y esperarla fuera.', then: [
					{ af: { lila: 5 } },
					{ set: { 'flag.b01_lila_llama': true } },
					{ text: 'Asientes y sales. Te sientas en la escalinata de la Torre, de espaldas a la puerta, mirando el mar. La marea empieza a subir.' },
					{ text: 'Pasan cinco minutos. Diez. De pronto, por las rendijas de la puerta sale una luz azul y blanca que pinta la arena.' },
					{ text: 'La puerta se abre de golpe. Lila sale corriendo, con Eevee en brazos y los ojos brillantes.' },
					{ say: 'lila', text: '¡La encendí! ¡La encendí, {jugador}! ¡Sola! ¡Bueno, con Eevee! ¡Pero sin que nadie mirara!' },
					{ text: 'Se para. Recupera el aliento.' },
					{ say: 'lila', text: 'Te quedaste fuera. Como te pedí. Nadie hace nunca lo que le pido. Siempre creen que necesito que me ayuden. Gracias.' },
				] },
			] },
			{ say: 'lila', text: 'Toma. Es… es una tontería.' },
			{ text: 'Te pone en la mano un amuleto pequeño de bronce, con una llama grabada. Está gastado en los bordes, de tanto tocarlo.' },
			{ give: 'amuletotorre' },
			{ say: 'lila', text: 'Es un **Amuleto de la Torre**. Los aprendices lo hacemos el primer año. El mío lo tengo desde hace… mucho. Quiero que lo tengas tú. Por si alguna vez necesitas estar tranquil{o|a|e} y no sabes cómo.' },
			{ if: 'flag.b01_lila_llama', then: [
				{ say: 'lila', text: 'El abuelo dice que una aprendiz que enciende la llama ya puede entregar Piedras Activadoras. Algún día. Cuando él lo diga.' },
				{ say: 'lila', text: 'Nunca había pensado en a quién le daría la primera. —Se calla. Mira a Eevee—. Bueno. Ya es tarde. Buenas noches, {jugador}.' },
			], else: [
				{ say: 'lila', text: 'Gracias por venir. Aunque no saliera. Es la primera vez que no salgo de aquí llorando. Eso también cuenta, ¿no? —Lo piensa—. Sí. Eso cuenta.' },
			] },
			{ quest: 'b01_t_lila', done: true },
		],
		b01_lila_torre: [
			{ if: 'flag.b01_fin', then: [
				{ say: 'lila', text: 'Corelia se va de intercambio dentro de poco, y dice que me lleva con ella. ¡Yo! ¡De viaje! Eevee ya ha hecho la maleta. Bueno, se ha metido dentro de la maleta.' },
				{ say: 'lila', text: 'A lo mejor nos vemos por ahí, {jugador}. En Johto, o donde sea. El mundo es grande. Pero no tanto.' },
			], else: [
				{ if: 'flag.b01_lila_llama', then: [
					{ say: 'lila', text: 'Desde que encendí la llama, Eevee duerme mejor. Y yo también. Bueno, yo no. Yo me paso la noche pensando que la encendí.' },
				], else: [
					{ say: 'lila', text: 'Sigo practicando. Ayer la piedra parpadeó tres veces. ¡Tres! Eevee lo celebró tirándose al agua.' },
				] },
			] },
		],

		// ---- Gimnasio de Yantra ----
		b01_corelia_espera: [
			{ text: 'Corelia pasa a toda velocidad por la pista, salta una barandilla, gira en el aire y aterriza delante de ti.' },
			{ say: 'corelia', text: '¡Primero, la pista! ¡Los tres de la pista! ¡Si no, no vale! ¡A tope!' },
			{ text: 'Y se va.' },
		],
		b01_corelia_reto_tope: [
			{ say: 'corelia', text: '¡Uoh! ¡Ese equipo viene a tope de verdad! ¡Así me gusta! ¡Hoy no me voy a contener nada! Bueno, nunca me contengo. ¡Pero hoy menos!' },
			{ call: 'b01_corelia_reto' },
		],
		b01_corelia_reto: [
			{ text: 'Al final del ocho, en el centro de la pista, Corelia te espera con las manos en las caderas.' },
			{ say: 'corelia', text: '¡LLEGASTE! ¡Y de pie! La mitad se cae en la segunda rampa. La otra mitad, en la primera.' },
			{ say: 'corelia', text: 'Te voy a ser sincera: hoy no hay Megaevolución. Aquí, en el gimnasio, lucho como cualquier líder. La Mega es para la Torre. Para quien se la gana.' },
			{ say: 'corelia', text: 'Mi abuelo dice que la fuerza sin vínculo es solo ruido. ¡Yo digo que el ruido también mola!' },
			{ battle: 'corelia_g3', onWin: [
				{ say: 'corelia', text: 'Eso… ¡eso ha sido vínculo! ¡Lo he notado en las rodillas! ¡Abuelo, lo he notado en las rodillas!' },
				{ badge: 'medalla_lucha' },
				{ cap: 35 },
				{ say: 'corelia', text: 'La **Medalla Lucha**. Con esta llevas tres medallas del Circuito, ¿no? ¡Tres! ¡A tope!' },
				{ say: 'corelia', text: 'Y ahora… la Torre. Mi abuelo te espera arriba. Yo también voy. No me lo pierdo por nada del mundo.' },
				{ quest: 'b01_m8', stage: 'torre' },
				{ if: '!done.b01_t_lila', then: [
					{ say: 'corelia', text: 'Ah, y Lila me dijo que la vas a acompañar en su prueba. No le falles, ¿eh? Esa chica tiene más fuerza de la que cree. ¡Más que yo! ¡Y yo tengo MUCHA!' },
				] },
				{ text: 'Corelia te agarra de la muñeca y te lleva patinando, cuesta abajo, hasta el camino de la marea. No te suelta hasta la puerta de la Torre.' },
				{ heal: 'En la entrada de la Torre, un aprendiz atiende a tu equipo sin preguntar. «Órdenes del abuelo», dice.' },
				{ go: 'torre_maestra' },
			] },
		],
		b01_corelia_despues: [
			{ say: 'corelia', text: '¡Revancha cuando quieras! Bueno, cuando quieras no: mañana a las seis tengo entrenamiento en la arena. Pero después, ¡cuando quieras!' },
		],

		// ---- LA PRUEBA DE LA TORRE ----
		b01_torre_espera_lila: [
			{ say: 'cornelio', text: 'Paciencia. La Torre no se va a ningún sitio: lleva aquí tres mil años. Pero Lila tiene una prueba pendiente, y me ha dicho que la vas a acompañar.' },
			{ say: 'cornelio', text: 'Primero, la llama. Luego, la Torre. El orden importa. Casi siempre.' },
		],
		b01_torre_sin_riolu: [
			{ say: 'cornelio', text: 'La prueba es de vínculo. ¿Y tu compañero? ¿El pequeño de Isla Hierro? Tráelo contigo. Sin él no hay nada que probar.' },
		],
		b01_torre_prueba: [
			{ text: 'Al atardecer, Cornelio te lleva escaleras arriba. Muchas escaleras. Corelia sube patinando por la barandilla, lo cual no debería ser posible. Lila sube detrás, en silencio, con Eevee en brazos.' },
			{ text: 'Arriba del todo, en la azotea de la Torre, la estatua de piedra de un Lucario se recorta contra el cielo naranja. El viento del mar sopla tan fuerte que tienes que apoyarte en la baranda.' },
			{ if: 'flag.b01_lila_llama', then: [
				{ text: 'Junto a la estatua arde un pebetero pequeño. Cornelio ha subido en una lámpara la llama que encendió Lila. Lila la mira, y se le ponen las orejas rojas.' },
			], else: [
				{ text: 'Junto a la estatua arde un pebetero pequeño con la llama antigua de la Torre, la que Cornelio mantiene encendida desde hace cuarenta años.' },
			] },
			{ say: 'cornelio', text: 'Mucha gente cree que la Megaevolución es poder. Una piedra, una pulsera, ¡pum!, y tu Pokémon se vuelve más fuerte.' },
			{ say: 'cornelio', text: 'No es poder. Es **vínculo**. La piedra solo escucha. Si lo que oye entre un entrenador y su Pokémon es de verdad, responde. Si no, es un pisapapeles muy bonito.' },
			{ say: 'cornelio', text: 'Así que no te voy a pedir que ganes. Te voy a pedir que me lo muestres. Ponte frente a la estatua, con tu compañero.' },
			{ text: 'Te pones frente a la estatua. {riolu} se pone a tu lado.' },
			{ say: 'cornelio', text: 'Ahora cierra los ojos. Y acuérdate.' },
			{ text: 'Cierras los ojos.' },
			{ text: 'Te acuerdas de la plaza de Luminalia. De la grieta violeta. De algo pequeño y azul que cayó delante de ti, herido, y que se levantó cuando no debería haber podido, para ponerse entre aquel Houndour y tú.' },
			{ text: 'Te acuerdas de la Ruta 4. Del Lechonk asustado, del agente de Lemnis, y de un brillo azul en sus patas que ninguno de los dos esperaba.', cond: 'flag.b01_palmeo' },
			{ text: 'Te acuerdas del Bosque de Novarte, y de un Fennekin que no se fiaba de nadie. {riolu} lo esperó. Tenía paciencia con los que llegaban asustados.', cond: 'flag.b01_fennekin_unido' },
			{ text: 'Te acuerdas del fondo de la Cueva Brillante, y de cómo se puso delante de ti cuando aquella mujer del visor lo miró un segundo de más.', cond: 'flag.b01_cueva_flare_hecha' },
			{ text: 'Te acuerdas de Crómlech. De su aura parpadeando junto a la máquina, como una vela. Y de que, aun así, no se apartó de tu pierna.', cond: 'flag.b01_cromlech_hecha' },
			{ text: 'Te acuerdas de la Cueva Reflejos. De una silueta en el espejo.', cond: 'done.b01_s_espejo' },
			{ text: 'Y de todos los días de en medio. Los Centros Pokémon a medianoche. Las rutas con lluvia. Las derrotas, que fueron de los dos. Las victorias, que también.' },
			{ text: 'Notas algo en la mano. Calor. Abres los ojos.' },
			{ text: '{riolu} te está sujetando la mano con la pata. Lo hace sin mirarte, mirando la estatua, como si fuera lo más normal del mundo.' },
			{ if: 'inParty("riolu")', then: [
				{ text: 'Y entonces su aura se enciende.' },
				{ text: 'No como en la Ruta 4, un brillo en las patas. Esto es otra cosa: una llama azul que le sube por los brazos, por el pecho, por los apéndices de la cabeza, hasta que no puedes mirarlo de frente. Pero no le sueltas la mano.' },
				{ say: 'lila', text: '¡Ah…!' },
				{ say: 'cornelio', text: 'No lo detengas. Ya lo ha decidido él.' },
				{ happy: { who: 'riolu', n: 255 } },
				{ forceEvolve: { who: 'riolu', to: 'lucario' } },
				{ set: { 'flag.b01_evo_torre': true } },
				{ text: 'Cuando la luz se apaga, {riolu} ya no te llega a la cintura. Te llega al hombro. Te mira desde una altura nueva, con los mismos ojos de siempre.' },
				{ text: '{riolu} se mira las patas. Luego te mira a ti. Luego, muy despacio, te da un toquecito en la frente con el puño. Como siempre. Solo que ahora tiene que agacharse un poco.' },
			], else: [
				{ text: 'El aura de {riolu} se enciende. No necesita cambiar de forma: eso ya pasó, en algún punto del camino. Lo que arde ahora es otra cosa. Más tranquila. Más honda.' },
				{ text: 'Un aura que no se parece a la de ningún Lucario que hayas visto. Porque, de algún modo, se parece un poco a la tuya.' },
				{ happy: { who: 'riolu', n: 50 } },
			] },
			{ say: 'corelia', text: '…Vale. Vale, no estoy llorando. Es el viento. Aquí arriba hay mucho viento. ¡Viento a tope!' },
			{ say: 'cornelio', text: 'Vínculo. De verdad. —Se acaricia el bigote—. Pero la piedra necesita oírlo en combate. Así es la tradición: dos compañeros de aura, frente a frente. Corelia.' },
			{ text: 'Corelia deja de bromear. Se quita el casco. Se sube la manga izquierda: en la muñeca lleva un guante con una piedra engastada que brilla con todos los colores a la vez.' },
			{ say: 'corelia', text: 'Ahora sí. Ahora va en serio.' },
			{ text: 'Su Lucario sale de la Poké Ball y se planta frente a {riolu}. Se miran. Se reconocen. Los dos inclinan la cabeza a la vez, un saludo antiguo, y se ponen en guardia.' },
			{ say: 'cornelio', text: 'Gane quien gane, lo que importa es lo que vea en sus ojos. Adelante.' },
			{ battle: 'corelia_torre', lose: 'continue',
				onWin: [
					{ say: 'corelia', text: '¡Increíble! ¡Le has ganado a una Megaevolución sin Megaevolución! ¡Abuelo! ¡¿Lo has visto?!' },
					{ say: 'cornelio', text: 'Lo he visto, cielo. Lo ha visto toda la costa.' },
				],
				onLose: [
					{ text: 'Cornelio te pone una mano en el hombro.' },
					{ say: 'cornelio', text: 'Lo que importa es que no te rendiste. Y él tampoco. Lo vi en sus ojos hasta el último golpe.' },
					{ say: 'corelia', text: '¡Eso! ¡Perder contra una Mega es de lo más normal! ¡Yo perdí contra el abuelo once años seguidos!' },
				] },
			{ heal: true, silent: true },
			{ say: 'cornelio', text: 'Y ahora, lo que viniste a buscar.' },
			{ text: 'Cornelio saca de la túnica una cajita de madera. Dentro hay un brazalete de plata, sencillo, con una piedra redonda engastada: un remolino de colores que se mueve aunque la piedra esté quieta.' },
			{ say: 'cornelio', text: 'Una **Piedra Activadora**. La he tallado yo, esta mañana, con estas manos viejas. Los antiguos la llamaban «la llave».' },
			{ say: 'cornelio', text: 'En la Torre, al brazalete lo llamamos **Megapulsera**. En las tiendas lo venden como **Mega-Aro**. Pero este no lo vas a encontrar en ninguna tienda.' },
			{ give: 'megaring' },
			{ say: 'corelia', text: '¡Y esto, de mi parte!' },
			{ text: 'Corelia te pone en la mano una esfera del tamaño de una canica, con una doble hélice negra y azul dentro.' },
			{ say: 'corelia', text: 'La **Lucarita**. La piedra que le habla a tu Lucario. El abuelo le dio una al mío cuando yo era pequeña. Bueno, más pequeña. Bueno, da igual, ¡ES TUYA!' },
			{ give: 'lucarionite' },
			{ unlock: 'mega' },
			{ text: '{riolu} mira la Lucarita en tu mano. Luego la Piedra Activadora en tu muñeca. Las dos brillan a la vez, un instante, como si se saludaran.' },
			{ say: 'cornelio', text: 'Que la lleve él. Y en el próximo combate, cuando los dos lo sientan… toca la piedra. Una vez por combate. No más. El vínculo es enorme, pero no es infinito. Nada que valga la pena lo es.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Megaevolución desbloqueada! Equípale la **Lucarita** a tu Lucario desde la Mochila. En combate verás un botón nuevo: «Megaevolución». ¡Solo una vez por combate!' },
			{ text: 'Antes de bajar, Cornelio le pone a {riolu} una mano en la cabeza y le dice algo al oído, en un idioma que no entiendes. {riolu} cierra los ojos. Entre sus patas se forma una esfera de luz azul, densa, temblorosa, que se deshace en chispas.' },
			{ say: 'cornelio', text: '**Esfera Aural**. El movimiento de los Lucario de esta Torre. Ya la llevaba dentro. Solo le faltaba alguien a quien proteger con ella.' },
			{ learn: { who: 'riolu', move: 'aurasphere' } },
			{ if: 'flag.b01_lila_llama', then: [
				{ say: 'lila', text: '{jugador}… eso ha sido lo más bonito que he visto en mi vida. Y anoche encendí una llama. Así que fíjate.' },
					{ text: 'Te das cuenta de que lo ha dicho de un tirón. Sin tropezar en ninguna palabra. Ella no se ha dado cuenta.' },
			], else: [
				{ say: 'lila', text: '{jugador}… e-eso ha sido lo más bonito que he visto en mi vida. Cuando sea Guardiana, quiero que todas las ceremonias sean así.' },
			] },
			{ set: { 'flag.b01_torre_hecha': true } },
			{ call: 'b01_final' },
		],

		// =================== FINAL DEL ACTO I ===================
		b01_final: [
			{ go: 'yantra', silent: true },
			{ text: '**Esa noche.**' },
			{ text: 'El muelle de Yantra está vacío. Las farolas se reflejan en el agua, temblando. Te sientas en el borde, con las piernas colgando, y {riolu} se sienta a tu lado.' },
			{ text: 'Ahora ocupa más sitio. Todavía no se ha acostumbrado. Tú tampoco.', cond: 'flag.b01_evo_torre' },
			{ text: 'Tu Pokédex vibra. Es la línea de la Tarjeta de Colaborador.' },
			{ say: 'handsome', as: 'Handsome (llamada)', text: '{jugador}. ¿Estás sol{o|a|e}? Bien. Escucha.' },
			{ say: 'handsome', as: 'Handsome (llamada)', text: 'La Puerta de Luminalia se ha encendido. **Sola.** Hace veinte minutos. Sin técnicos, sin ceremonia, sin nadie. Se encendió, zumbó un minuto y se apagó.' },
			{ say: 'handsome', as: 'Handsome (llamada)', text: 'Lemnis dice que fue «una prueba programada». No la había programado nadie. Lo sé porque me colé en su calendario. Bueno, se coló Matière. Yo le sujetaba la linterna.' },
			{ if: 'flag.b01_delatar', then: [{ say: 'handsome', as: 'Handsome (llamada)', text: 'Y lo de Crómlech está en todas las portadas. Lemnis lo desmiente cada hora, en punto. Alguien está muy nervioso, {jugador}. Y la gente nerviosa comete errores.' }] },
			{ if: 'flag.b01_handsome', then: [{ say: 'handsome', as: 'Handsome (llamada)', text: 'Lo de Crómlech sigue entre tú y yo. Handsome está tirando del hilo. Despacito. Pero el hilo es largo, {jugador}. Muy largo.' }] },
			{ if: 'flag.b01_trato_sera', then: [{ say: 'handsome', as: 'Handsome (llamada)', text: 'Y… {jugador}. Sé que hablaste con la señorita Lemnis en Crómlech. No te pregunto qué te dio. Solo te digo una cosa: quien te da algo sin pedirte nada a cambio, ya te lo está pidiendo.' }] },
			{ say: 'handsome', as: 'Handsome (llamada)', text: 'Voy para Luminalia. Mañana hablamos. Duerme, si puedes.' },
			{ text: 'Cuelga. Casi al mismo tiempo, todas las pantallas de Yantra se encienden a la vez: la del Centro Pokémon, la de la cafetería del puerto, la del móvil de un pescador que dormitaba en el muelle. Hasta tu Pokédex.' },
			{ text: 'En todas aparece la misma cara. Melena negra y recta. Ojos grises. Guantes blancos.' },
			{ say: 'sera', text: 'Buenas noches, Kalos.' },
			{ say: 'sera', text: 'Hace unos minutos, la Puerta de Luminalia completó con éxito su primera prueba de estabilidad. Las Fisuras de estas semanas fueron el precio del aprendizaje. Hemos aprendido.' },
			{ if: 'flag.b01_delatar', then: [{ say: 'sera', text: 'Esta semana, algunas voces han querido sembrar miedo sobre nuestro trabajo en Kalos. Lo entiendo. El miedo es humano. Pero el miedo no construye puertas.' }] },
			{ say: 'sera', text: 'Por eso me complace anunciar la **Primera Gira Interregional del Circuito Infinito**. Los novatos que hayan conseguido tres medallas en Kalos cruzarán la Puerta Lemnis. Su destino: **Johto**. Allí les esperan sus próximos gimnasios.' },
			{ say: 'sera', text: 'La lista de participantes se publica ahora. Felicidades a todos.' },
			{ say: 'sera', text: 'Un mundo. Una liga.' },
			{ text: 'La pantalla muestra una lista larguísima. Nombres de toda Kalos, de Galar, de todas partes.' },
			{ text: '…**Rhiannon Hargreave** (Galar). **Nate Ashby** (Galar). No sabes cuándo consiguió Nate tres medallas. Sospechas que él tampoco…' },
			{ text: '…**Bastien Lacroix** (Kalos) — *patrocinado por Lemnis*…', cond: '!flag.b01_bastien_rompe' },
			{ text: '…**Bastien Lacroix** (Kalos). Junto a su nombre ya no pone «patrocinado por Lemnis». Solo su nombre…', cond: 'flag.b01_bastien_rompe' },
			{ text: 'Y, casi al final: **{jugador}** (Kalos).' },
			{ text: 'Tu nombre. En todas las pantallas de Kalos.' },
			{ text: 'El Holomisor de Serafina vibra en tu bolsillo. Un solo mensaje: «Nos vemos al otro lado. —S.»', cond: 'flag.b01_trato_sera && has("holomisorsera")' },
			{ text: 'Te giras hacia {riolu}. Pero él no mira las pantallas.' },
			{ text: 'Mira hacia el sur, por encima de los tejados, hacia donde, muy lejos, queda Luminalia. Tiene los apéndices de la cabeza levantados, rígidos. El aura le tiembla en las patas, igual que el primer día en la plaza, justo antes de que el aire se rasgara.' },
			{ text: 'Le pones una mano en el hombro. No se relaja. Pero tampoco se aparta.' },
			{ say: 'rotom', text: '¡Bzzt! ¡{jugador}! ¡Vamos a Johto! ¡Por la Puerta! ¡Voy a escribirlo ahora mismo!' },
			{ diary: 'Hoy {riolu} evolucionó en lo alto de la Torre Maestra. ¡Ahora es altísimo! Y nos regalaron una piedra que brilla de todos los colores. Esta noche, la señorita Lemnis salió en todas las pantallas: ¡vamos a viajar por la Puerta, a Johto! Mi entrenador{|a|e} está en la lista. Estoy emocionado. ¡Bzzt! El doctor Moreau dice que es el futuro.', cond: 'flag.b01_evo_torre' },
			{ diary: 'Hoy {riolu} y mi entrenador{|a|e} subieron a lo alto de la Torre Maestra, ¡y nos regalaron una piedra que brilla de todos los colores! Esta noche, la señorita Lemnis salió en todas las pantallas: ¡vamos a viajar por la Puerta, a Johto! Mi entrenador{|a|e} está en la lista. Estoy emocionado. ¡Bzzt! El doctor Moreau dice que es el futuro.', cond: '!flag.b01_evo_torre' },
			{ set: { 'flag.b01_fin': true } },
			{ quest: 'b01_m8', done: true },
			{ save: true },
			{ text: '**Fin del Acto I.**' },
			{ text: '*El Acto II se está escribiendo…*' },
		],
	},

	// =====================================================================
	// NPCs GENÉRICOS DEL TRAMO
	// =====================================================================
	npcs: {
		guarda_reflejos: { name: 'Guarda de la cueva', generic: true, look: { hair: 'bun', hairColor: '#cfd6e2', outfit: '#f2b33d', outfit2: '#4a4f6a', skin: 2, acc: 'glasses', eyesStyle: 'happy', mouth: 'smile' } },
		nino_relieve: { name: 'Niño de Relieve', generic: true, look: { hair: 'cap', hairColor: '#5a3a26', outfit: '#3f8a4f', outfit2: '#d8a85a', skin: 2, mouth: 'flat', eyes: '#6b4a2b' } },
		anciana_cromlech: { name: 'Anciana de Crómlech', generic: true, look: { hair: 'bun', hairColor: '#e9e8e0', outfit: '#4a4f6a', outfit2: '#8a7a5a', skin: 1, eyesStyle: 'sleepy', mouth: 'flat' } },
		pescador_yantra: { name: 'Pescador', generic: true, look: { hair: 'cap', hairColor: '#8a8a8a', outfit: '#3b5bb5', outfit2: '#e9e3d0', skin: 3, acc: 'beard', eyesStyle: 'sleepy', mouth: 'smile' } },
	},

	// =====================================================================
	// MISIONES NUEVAS (pequeñas)
	// =====================================================================
	quests: {
		b01_s_lino: { name: 'El muro de Lino', type: 'side', est: 10, stages: {
			fan: 'Un niño de Relieve dice que Blanca «no es una líder de verdad». Gana la Medalla Encanto y vuelve a hablar con él.',
			hecha: 'El niño de Relieve cambió de opinión. Un poco.',
		} },
	},
};
