// Bloque 2 · Tramo 1: «Donde los relojes se paran».
// Santuario del Encinar → Encinar → Pueblo Azalea (Kurt, Pozo Slowpoke, Gimnasio de Antón) → la niebla.
// Empieza donde el T0 deja al jugador: { go: 'santuario_encinar' }.

// Condiciones reutilizadas (cadenas planas).
const LUCARIO = 'inParty("riolu") || inParty("lucario")';
const BONGURI = 'has("redapricorn") || has("blueapricorn") || has("yellowapricorn") || has("greenapricorn") || has("pinkapricorn") || has("whiteapricorn") || has("blackapricorn")';
const NIEBLA_LISTA = 'badge("medalla_colmena") && flag.b02_pozo_hecho';

// Tablas de recolección
const BAYAS_ENCINAR = [
	{ id: 'oranberry', w: 24, n: [1, 3] }, { id: 'sitrusberry', w: 10, n: [1, 1] }, { id: 'pechaberry', w: 12, n: [1, 2] },
	{ id: 'cheriberry', w: 10, n: [1, 2] }, { id: 'chestoberry', w: 10, n: [1, 2] }, { id: 'persimberry', w: 8, n: [1, 2] },
	{ id: 'leppaberry', w: 8, n: [1, 1] }, { id: 'lumberry', w: 2, n: [1, 1] },
];

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== SANTUARIO DEL ENCINAR ===================
		santuario_encinar: {
			name: 'Santuario del Encinar', short: 'Santuario', region: 'johto', kind: 'forest', map: { x: 14, y: 88 },
			bg: { type: 'forest', fog: true, ground: '#2f4a32', far: '#1f3324' },
			desc: 'Un claro redondo en el corazón del **Encinar**, rodeado de encinas tan viejas que se tocan por arriba. En el centro, sobre una piedra plana, hay un **altar de madera** pequeño, del tamaño de una casita de pájaros, con el tejado cubierto de musgo.\n\nLa luz no es de día ni de noche. Es verde, quieta, como la del fondo de un estanque. Aquí no se oye ni un insecto.',
			descs: [
				{ cond: 'flag.b02_encinar_libre', text: 'El claro del **altar de madera**. La luz ya es casi normal: verde, sí, pero de bosque, no de estanque. Los relojes vuelven a hacer tictac.\n\nEl campamento de Petra ha crecido: ahora tiene un tendedero, tres agujeros perfectamente cuadrados y un cartel que dice «MIDIENDO. NO PISAR. (PALA, TÚ SÍ PUEDES)».' },
				{ cond: 'flag.b02_celebi_visto', text: 'El claro del **altar de madera**. Desde que pasó el destello verde, la luz parece un poco menos quieta. Solo un poco.\n\nPetra ha montado un campamento junto a las raíces: una tienda torcida, dos cubos y una libreta abierta que el viento no se atreve a pasar.' },
			],
			links: ['encinar'],
			mapNote: 'Altar de madera · Campamento de Petra',
			onEnter: [{ script: 'b02_llegada', cond: '!flag.b02_llegada', once: true }],
			spots: [
				{ label: 'Pokémon tumbados entre los helechos', sub: 'No huyen. No se mueven.', icon: '🌿', cond: 'flag.b02_llegada && !flag.b02_apagados', new: '!flag.b02_apagados', talk: [{ script: 'b02_apagados' }] },
				{ label: 'Gritos detrás de las raíces', sub: '«¡Pala! ¡PALA! ¡No, el cubo no!»', icon: '🦴', cond: 'flag.b02_apagados && !flag.b02_petra_1', new: '!flag.b02_petra_1', talk: [{ script: 'b02_petra_1' }] },
				{ label: 'Un destello verde entre los árboles', sub: 'Ahí. No: ahí.', icon: '✨', cond: 'flag.b02_petra_1 && !flag.b02_celebi_visto', new: '!flag.b02_celebi_visto', talk: [{ script: 'b02_celebi' }] },
				{ label: 'El altar de madera', sub: 'Pequeño, viejo, cubierto de musgo', icon: '⛩️', talk: [{ cond: 'flag.b02_celebi_visto', script: 'b02_altar_despues' }, { script: 'b02_altar' }] },
				{ label: 'Campamento de Petra', sub: 'Una tienda torcida y dos cubos', icon: '⛺', cond: 'flag.b02_celebi_visto', talk: [{ cond: 'flag.b02_encinar_libre', script: 'b02_petra_despues' }, { script: 'b02_petra_generico' }] },
				{ label: 'El Pachirisu dormido', sub: '{riolu} vuelve a mirarlo cada vez', icon: '💤', cond: 'flag.b02_apagados', talk: [{ script: 'b02_pachirisu_generico' }] },
				{ label: 'Adentrarse entre los helechos', sub: 'Algo se mueve en la penumbra', icon: '🌲', cond: 'flag.b02_apagados', action: { explore: 'forest' } },
			],
			encounters: {
				forest: [
					{ sp: 'gloom', lv: [27, 29], w: 30 },
					{ sp: 'parasect', lv: [27, 29], w: 20 },
					{ sp: 'butterfree', lv: [27, 29], w: 15, time: 'day' },
					{ sp: 'noctowl', lv: [28, 29], w: 20, time: 'night' },
					{ sp: 'spoink', lv: [27, 28], w: 15 },
					{ sp: 'fidough', lv: [27, 28], w: 8, displaced: true },
				],
			},
			rumors: [
				{ text: 'Los de Azalea dicen que en el Encinar vive el guardián del bosque, y que quien lo ve pierde la cuenta de los días.' },
				{ cond: 'flag.b02_celebi_visto', text: 'Petra jura que el ámbar late más deprisa al atardecer. Ulises jura que aquí no hay atardecer. Los dos tienen razón, más o menos.' },
			],
		},

		// =================== ENCINAR (ruta de bosque) ===================
		encinar: {
			name: 'Encinar', short: 'Encinar', region: 'johto', kind: 'route', map: { x: 22, y: 86 },
			bg: { type: 'forest', fog: true, ground: '#34502f' },
			desc: 'Un bosque de encinas y helechos tan espeso que a mediodía parece el atardecer. El sendero serpentea entre raíces gordas como brazos.\n\nPor un lado, entre los troncos, asoman tejados y huele a humo de carbón: **Pueblo Azalea**. Por el otro, el bosque se pierde hacia el norte, hacia la **Ruta 34**.',
			descs: [
				{ cond: '!flag.b02_encinar_libre && flag.b02_celebi_visto', text: 'Un bosque de encinas y helechos tan espeso que a mediodía parece el atardecer. El sendero serpentea entre raíces gordas como brazos.\n\nPor un lado, entre los troncos, asoman tejados y huele a humo de carbón: **Pueblo Azalea**. Por el otro, hacia el norte, una niebla blanca se queda quieta entre los árboles, como si esperara algo.' },
			],
			links: ['azalea', 'ruta34'],
			enterCond: 'flag.b02_celebi_visto',
			blockedMsg: 'Sigues el sendero que sale del claro. Cien pasos después, estás otra vez delante del altar de madera. El bosque no te deja salir. Todavía.',
			mapNote: 'Santuario · árboles de Bonguri · niebla al norte',
			rumors: [
				{ text: 'El aprendiz del carbonero de Azalea ha vuelto a perder a su Farfetch’d. Dicen que esta vez el pájaro no quiere volver.' },
				{ text: 'En las encinas de la entrada hay un árbol de Bonguris. Kurt, el de las Poké Balls, los recoge desde hace cincuenta años.' },
				{ cond: '!flag.b02_encinar_libre', text: 'Hacia la Ruta 34 hay una niebla que no se levanta ni con viento. Quien entra sale por el mismo árbol por el que entró.' },
				{ cond: 'flag.b02_encinar_libre', text: 'La niebla del norte se ha ido. Los leñadores de Azalea dicen que fue «un perro azul con pinchos». Nadie les cree.' },
			],
			route: {
				from: 'azalea', to: 'ruta34', length: 9, terrain: 'forest', rate: 0.22,
				tramos: {
					0: [{ text: 'El borde del bosque. Entre los troncos se ven tejados bajos y una columna de humo de carbón. Huele a madera quemada y a pueblo.' }],
					1: [
						{ trainer: 'encinar_ramiro' },
						{ text: 'Un tocón enorme con un cartel clavado: «Bienvenido al Encinar. Respete al guardián del bosque. Y no le pregunte la hora».' },
						{ item: 'superpotion' },
					],
					2: [
						{ trainer: 'encinar_amparo', optional: true, label: 'Hace un pícnic sobre una raíz. Te ofrece un bocadillo. Luego, un combate.' },
						{ spot: { action: { gather: 'arbol_bonguri' } }, label: 'Árbol de Bonguris', icon: '🌰' },
						{ text: 'Un árbol bajo, de hojas redondas, con frutos duros de colores colgando de las ramas. Bonguris.' },
					],
					3: [
						{ talk: [
							{ cond: 'quest.b02_s_farfetchd == "buscar"', script: 'b02_farfetchd_hallado' },
							{ cond: 'quest.b02_s_farfetchd == "volver"', script: 'b02_farfetchd_espera' },
							{ cond: 'done.b02_s_farfetchd', script: 'b02_farfetchd_vacio' },
							{ script: 'b02_farfetchd_antes' },
						], label: 'Un Farfetch’d con un puerro', sub: 'No te deja acercarte a unos helechos', icon: '🦆', cond: '!done.b02_s_farfetchd', new: 'quest.b02_s_farfetchd == "buscar"' },
						{ text: 'Un claro pequeño. Alguien ha cortado leña aquí hace poco: virutas frescas, un hacha clavada en un tronco y nadie que la vigile.' },
					],
					4: [
						{ trainer: 'encinar_eusebio' },
						{ spot: { action: { gather: 'setas_encinar' } }, label: 'Corro de setas del Encinar', icon: '🍄' },
						{ text: 'Al pie de las encinas crecen setas de sombrero ancho. Huelen a tierra mojada y a algo dulce.' },
						{ item: 'revive', hidden: true },
					],
					5: [
						{ branch: { label: 'Volver al claro del altar', sub: 'Un sendero estrecho entre helechos', go: 'santuario_encinar' } },
						{ text: 'Un sendero estrecho se abre entre los helechos, hacia el corazón del bosque. Por ahí está el claro del altar. Curioso: entras por aquí, pero al salir siempre apareces junto a Azalea.' },
					],
					6: [
						{ script: 'b02_encinar_tera', once: true, mark: true },
						{ trainer: 'encinar_nieves', optional: true, label: 'Una campista sentada en su mochila, mirando un mapa al revés.' },
						{ item: 'ether' },
						{ text: 'Aquí los árboles crecen torcidos, todos hacia el mismo lado. Hacia el norte. Como si algo tirara de ellos.' },
					],
					7: [
						{ talk: [
							{ cond: 'flag.b02_encinar_libre', script: 'b02_cabina_vacia' },
							{ script: 'b02_cabina_generico' },
						], label: 'Una cabina azul entre dos encinas', sub: 'Encajada. Muy encajada.', icon: '🟦', cond: 'flag.b02_celebi_visto && !flag.b02_encinar_libre' },
						{ text: 'El aire está espeso y dulzón, como si alguien hubiera derramado miel. Los pasos suenan un poco después de darlos.' },
						{ item: 'elixir', hidden: true },
					],
					8: [
						{ block: { cond: 'flag.b02_encinar_libre', msg: 'Una niebla blanca y quieta cierra el sendero. Entras, caminas un rato… y sales por el mismo árbol, con la misma marca de garra en la corteza. El bosque no te deja pasar.', dir: 1, script: 'b02_niebla' } },
						{ text: 'Una niebla blanca, quieta, a la altura del pecho. No se mueve con el viento. Sobre una encina, alguien ha marcado una cruz con tiza. Y otra. Y otra. Todas en el mismo árbol.', cond: '!flag.b02_encinar_libre' },
						{ text: 'Donde estaba la niebla, ahora solo hay bosque. En la encina de las cruces de tiza, alguien ha añadido una más, pequeñita, con forma de garra.', cond: 'flag.b02_encinar_libre' },
					],
					9: [{ text: 'Los árboles se abren poco a poco. Al norte, un camino de tierra baja hacia praderas abiertas: la **Ruta 34**. Huele a ciudad a lo lejos.' }],
				},
				encounters: {
					forest: [
						{ sp: 'gloom', lv: [27, 30], w: 20 },
						{ sp: 'parasect', lv: [28, 30], w: 14 },
						{ sp: 'butterfree', lv: [28, 30], w: 14, time: 'day' },
						{ sp: 'beedrill', lv: [28, 30], w: 14, time: 'day' },
						{ sp: 'spoink', lv: [27, 29], w: 10 },
						{ sp: 'golbat', lv: [29, 31], w: 14, time: 'night' },
						{ sp: 'noctowl', lv: [29, 31], w: 14, time: 'night' },
						{ sp: 'carnivine', lv: [29, 31], w: 4 },
						{ sp: 'fidough', lv: [27, 29], w: 6, displaced: true },
						{ sp: 'phantump', lv: [28, 30], w: 5, displaced: true, time: 'night' },
					],
				},
			},
		},

		// =================== PUEBLO AZALEA ===================
		azalea: {
			name: 'Pueblo Azalea', short: 'Azalea', region: 'johto', kind: 'town', map: { x: 34, y: 96 },
			bg: { type: 'town', roofs: ['#6a4a3a', '#7a5a46', '#4f3a2e'], ground: '#5a7a4a' },
			desc: 'Un pueblo pequeño de casas de madera oscura y tejados de teja, pegado al Encinar. Del horno del carbonero sale humo todo el día.\n\nPor todas partes hay **Slowpoke**: en la plaza, en los escalones, en mitad de la calle. Nadie los aparta. Aquí se espera a que se muevan. A veces se espera mucho.',
			descs: [
				{ cond: 'flag.b02_kurt_1 && !flag.b02_pozo_hecho', text: 'Un pueblo pequeño de casas de madera oscura y tejados de teja, pegado al Encinar. Del horno del carbonero sale humo todo el día.\n\nFaltan Slowpoke. Se nota: hay huecos en la plaza con la forma exacta de un Slowpoke tumbado. Los vecinos miran hacia el **Pozo** y bajan la voz.' },
				{ cond: 'flag.b02_pozo_hecho', text: 'Un pueblo pequeño de casas de madera oscura y tejados de teja, pegado al Encinar. Del horno del carbonero sale humo todo el día.\n\nLos Slowpoke han vuelto a sus sitios: en la plaza, en los escalones, en mitad de la calle. Uno de ellos lleva una bufanda que le ha tejido alguien a toda prisa. Bosteza.' },
			],
			descNight: 'De noche, el horno del carbonero sigue encendido y tiñe de naranja las casas de madera. Los Slowpoke duermen donde les pilló el sueño: en la plaza, en los escalones, en mitad de la calle.\n\nDel Encinar llega un silencio espeso, de bosque viejo. Solo se oye, de vez en cuando, a Kurt tallando madera.',
			links: ['encinar'],
			mapNote: 'Gimnasio: Antón (Bicho) · Kurt · Pozo Slowpoke',
			onEnter: [
				{ script: 'b02_llegada_azalea', cond: '!flag.b02_llegada_azalea', once: true },
				{ script: 'b02_furgoneta', cond: 'flag.b02_kurt_1 && !flag.b02_furgoneta', once: true },
			],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Casa de Kurt', sub: 'Se oye tallar madera', icon: '🌰', action: { go: 'casa_kurt' }, new: '!flag.b02_kurt_1 || (flag.b02_pozo_hecho && !flag.b02_kurt_gracias)' },
				{ label: 'Pozo Slowpoke', sub: 'Una boca de piedra con escalera de mano', icon: '🕳️', action: { go: 'pozo_slowpoke' }, new: 'flag.b02_kurt_1 && !flag.b02_pozo_hecho' },
				{ label: 'Gimnasio de Azalea', sub: 'Un invernadero lleno de ramas', icon: '🐛', action: { go: 'gym_azalea' }, new: 'flag.b02_pozo_hecho && !beat("anton_g4")' },
				{ label: 'El aprendiz del carbonero', sub: 'Mira hacia el bosque, con la gorra en la mano', icon: '🔥', talk: [
					{ cond: 'quest.b02_s_farfetchd == "volver"', script: 'b02_farfetchd_entrega' },
					{ cond: 'done.b02_s_farfetchd', script: 'b02_aprendiz_despues' },
					{ cond: 'quest.b02_s_farfetchd == "buscar"', script: 'b02_aprendiz_recordar' },
					{ script: 'b02_aprendiz_1' },
				], new: '!quest.b02_s_farfetchd || quest.b02_s_farfetchd == "volver"' },
				{ label: 'El anciano del pozo', sub: 'Sentado en un banco, contando Slowpoke', icon: '👴', talk: [
					{ cond: 'flag.b02_pozo_hecho', script: 'b02_anciano_despues' },
					{ script: 'b02_anciano_1' },
				] },
				{ label: 'Un niño junto a la fuente', sub: 'Muy serio para su edad', icon: '🧒', talk: [{ script: 'b02_nino_azalea' }] },
				{ label: 'Huerto de Bonguris', sub: 'Entrenamiento (nivel recomendado 35)', icon: '🥋', cond: 'flag.b02_llegada_azalea', action: { training: { cap: 35, prize: { wins: 3, script: 'p7_premio_huerto' }, trainers: ['ent_azalea_1', 'ent_azalea_2', 'ent_azalea_3'], wild: [{ sp: 'ledian', lv: [30, 32] }, { sp: 'ariados', lv: [30, 32] }, { sp: 'skiploom', lv: [30, 31] }], coach: 'Cuidadora del huerto', closed: 'Tu equipo ya está hecho a los bichos. Aquí no vas a aprender nada nuevo. El gimnasio, en cambio…' } } },
				{ label: 'Árbol de Bonguris', sub: 'Detrás de la casa de Kurt', icon: '🌰', action: { gather: 'arbol_bonguri' } },
			],
			rumors: [
				{ text: 'Kurt hace Poké Balls con Bonguris. Si le llevas uno, gruñe. Si le llevas dos, gruñe más. Pero te las hace.' },
				{ text: 'Cuando un Slowpoke bosteza, llueve. Eso dicen aquí. Por eso en Azalea llueve tanto.' },
				{ cond: 'flag.b02_kurt_1 && !flag.b02_pozo_hecho', text: 'Por la noche se oyen camiones junto al pozo. Y ruido de cajas. Y alguien que dice «cuidado, que es frágil».' },
				{ cond: 'flag.b02_pozo_hecho', text: 'Antón ha puesto un cartel en el gimnasio: «Los bichos están nerviosos. No es culpa de ustedes. Tampoco suya».' },
			],
		},
		casa_kurt: {
			name: 'Casa de Kurt', parent: 'azalea', kind: 'building',
			bg: { type: 'indoor', wall: '#6a4a3a', floor: '#c9a66b' },
			desc: 'Un taller que también es casa, o una casa que también es taller. Hay Bonguris por todas partes: en cestas, en estantes, en un cuenco sobre la mesa. Huele a madera, a barniz y a té verde.\n\nEn la pared, una foto antigua: un hombre joven con gafas y bigote, sosteniendo una Poké Ball de madera como quien sostiene un recién nacido.',
			descs: [
				{ cond: 'flag.b02_kurt_1 && !flag.b02_pozo_hecho', text: 'El taller de Kurt, vacío. En la mesa hay un Bonguri a medio tallar y una nota escrita deprisa: «He ido al pozo. Vuelvo enseguida. NO TOQUÉIS NADA». Debajo, más pequeño: «Eso va por ti, Slowpoke».\n\nUn Slowpoke, sentado en una silla, te mira sin entender nada.' },
			],
			spots: [
				{ label: 'Kurt', sub: 'Artesano de Poké Balls', icon: '🧓', cond: '!flag.b02_kurt_1 || flag.b02_pozo_hecho', talk: [
					{ cond: '!flag.b02_kurt_1', script: 'b02_kurt_1' },
					{ cond: '!flag.b02_kurt_gracias', script: 'b02_kurt_gracias' },
					{ cond: BONGURI, script: 'b02_kurt_bonguri' },
					{ script: 'b02_kurt_generico' },
				], new: '!flag.b02_kurt_1 || !flag.b02_kurt_gracias' },
				{ label: 'La foto de la pared', icon: '🖼️', talk: [{ script: 'b02_kurt_foto' }] },
			],
		},
		pozo_slowpoke: {
			name: 'Pozo Slowpoke', parent: 'azalea', kind: 'cave',
			bg: { type: 'cave', dark: true, crystals: '#6ab0d0' },
			desc: 'Una escalera de mano baja a una cueva húmeda y fresca, con charcas de agua clara y el techo goteando. Huele a musgo y a Slowpoke mojado.\n\nAbajo hay luces que no deberían estar: focos de obra, cables, y una pila de **cajas de madera** con agujeros para respirar.',
			descs: [
				{ cond: 'flag.b02_pozo_hecho', text: 'Una escalera de mano baja a una cueva húmeda y fresca, con charcas de agua clara y el techo goteando.\n\nLos focos y las cajas ya no están. Solo quedan marcas en el barro y, en un rincón, una etiqueta mojada que nadie ha querido recoger. Los Slowpoke han vuelto a sus charcas. Uno de ellos ronca.' },
			],
			enterCond: 'flag.b02_kurt_1',
			blockedMsg: 'La boca del pozo está cerrada con una cuerda y un cartel torcido: «OBRAS. PROHIBIDO EL PASO. GRACIAS». Ni Azalea ni el pozo tienen obras desde hace cien años. Quizá Kurt sepa algo.',
			mapNote: 'Cajas · Team Rocket',
			spots: [
				{ label: 'Bajar por la escalera de mano', sub: 'Abajo se oyen voces', icon: '🪜', cond: '!flag.b02_pozo_entrada', new: 'true', talk: [{ script: 'b02_pozo_entrada' }] },
				{ label: 'Recluta de guardia', sub: 'Junto a los focos', cond: 'flag.b02_pozo_entrada', action: { trainer: 'recluta_pozo_1' } },
				{ label: 'Las cajas apiladas', sub: 'Algo se mueve dentro', icon: '📦', cond: 'beat("recluta_pozo_1")', new: '!flag.b02_pozo_cajas', talk: [{ cond: 'flag.b02_pozo_cajas', script: 'b02_pozo_cajas_generico' }, { script: 'b02_pozo_cajas' }] },
				{ label: 'Recluta junto a las cajas', sub: 'Cuenta Slowpoke en una libreta', cond: 'beat("recluta_pozo_1")', action: { trainer: 'recluta_pozo_2' } },
				{ label: 'Recluta en el pasadizo', sub: 'Bloquea el paso hacia el fondo', cond: 'beat("recluta_pozo_1")', action: { trainer: 'recluta_pozo_3' } },
				{ label: 'Recluta sentada en un barril', sub: 'Lima una ganzúa. Te mira de reojo', cond: 'beat("recluta_pozo_2")', action: { trainer: 'recluta_pozo_4' } },
				{ label: 'Kurt, sentado en una caja', sub: 'Descansar y curar al equipo', icon: '🧓', cond: 'flag.b02_pozo_entrada && !flag.b02_pozo_hecho', talk: [{ script: 'b02_kurt_pozo' }] },
				{ label: 'El fondo del pozo', sub: 'Alguien da órdenes a gritos', icon: '🚀', cond: 'beat("recluta_pozo_2") && beat("recluta_pozo_3") && !flag.b02_pozo_hecho', new: 'true', talk: [{ script: 'b02_proton' }] },
				{ label: 'Los Slowpoke del pozo', sub: 'Han vuelto a sus charcas', icon: '🦛', cond: 'flag.b02_pozo_hecho', talk: [{ script: 'b02_pozo_slowpoke' }] },
				{ label: 'Orilla de la charca grande', sub: 'El agua deja cosas en las piedras', icon: '💧', action: { gather: 'orilla_pozo' } },
				{ label: 'Explorar las galerías', sub: 'Goteos y ecos', icon: '🦇', action: { explore: 'cave' } },
			],
			encounters: {
				cave: [
					{ sp: 'zubat', lv: [29, 31], w: 25 },
					{ sp: 'golbat', lv: [31, 32], w: 14 },
					{ sp: 'slowpoke', lv: [29, 31], w: 20 },
					{ sp: 'bronzor', lv: [29, 31], w: 10 },
					{ sp: 'makuhita', lv: [29, 31], w: 10 },
					{ sp: 'chingling', lv: [29, 30], w: 8, time: 'night' },
					{ sp: 'absol', lv: [31, 32], w: 4 },
				],
			},
			rumors: [
				{ text: 'Dicen que un Slowpoke que se queda dormido con la cola en la charca del fondo despierta un día con una corona. Nadie lo ha visto. Pero lo dicen.' },
				{ cond: 'flag.b02_pozo_hecho', text: 'Al fondo, junto a la charca grande, alguien ha encontrado una Roca del Rey. O eso dice el anciano. Él dice muchas cosas.' },
			],
		},
		gym_azalea: {
			name: 'Gimnasio de Azalea', parent: 'azalea', kind: 'gym',
			bg: { type: 'gym', wall: '#3f8a4f', floor: '#c9a66b' },
			desc: 'Un invernadero alto lleno de ramas, troncos huecos y redes. Entre las hojas zumban Pokémon bicho de todos los tamaños. El suelo está cubierto de virutas que huelen a resina.\n\nDe lado a lado del pasillo cuelga una **cortina de telarañas** brillantes. Al otro lado, un chico de pelo violeta mira algo con una lupa.',
			enterCond: 'flag.b02_pozo_hecho',
			blockedMsg: 'La puerta del gimnasio está cerrada. Un cartel escrito con letra muy redonda: «Cerrado un ratito. He ido a buscar Slowpoke perdidos. Los bichos están bien atendidos. —Antón». Debajo, un dibujo de un Caterpie saludando.',
			mapNote: 'Líder: Antón (Bicho)',
			spots: [
				{ label: 'La cortina de telarañas', sub: 'Brilla. Vibra un poco.', icon: '🕸️', cond: '!flag.b02_gym_red', new: 'true', talk: [{ script: 'b02_gym_red' }] },
				{ label: 'Cazabichos Fermín', sub: 'Entre los troncos huecos', cond: 'flag.b02_gym_red', action: { trainer: 'gym_azalea_1' } },
				{ label: 'Entomóloga Rocío', sub: 'Junto a las colmenas de cristal', cond: 'flag.b02_gym_red', action: { trainer: 'gym_azalea_2' } },
				{ label: 'Antón', sub: 'Líder · tipo Bicho', icon: '🐛', cond: 'beat("gym_azalea_1") && beat("gym_azalea_2")', new: '!beat("anton_g4")', talk: [{ cond: 'beat("anton_g4")', script: 'b02_anton_despues' }, { script: 'b02_anton_reto' }] },
				{ label: 'Antón', sub: 'Observa algo con una lupa', icon: '🐛', cond: '!(beat("gym_azalea_1") && beat("gym_azalea_2"))', talk: [{ script: 'b02_anton_espera' }] },
			],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Encinar -----
		encinar_ramiro: { name: 'Leandro', cls: 'Cazabichos', ai: 2, team: [{ sp: 'beedrill', lv: 29 }, { sp: 'butterfree', lv: 29 }],
			intro: '¡Quieto! Llevo una semana buscando un Pokémon verde que vuela como una hoja. ¿Tú lo has visto? ¡Combate! Así me concentro.', win: 'Si lo ves, no lo persigas. Yo lo perseguí y aparecí dos días después en el mismo sitio.' },
		encinar_amparo: { name: 'Amparo', cls: 'Dominguera', ai: 2, team: [{ sp: 'gloom', lv: 30 }, { sp: 'noctowl', lv: 30 }],
			intro: 'Vengo todos los domingos a merendar al Encinar. Este domingo dura ya bastante. ¿Hoy qué día es?', win: 'Toma, un bocadillo. Está fresco. Lo hice esta mañana. O la de antes.' },
		encinar_eusebio: { name: 'Eusebio', cls: 'Ornitólogo', ai: 2, team: [{ sp: 'noctowl', lv: 30 }, { sp: 'farfetchd', lv: 31 }],
			intro: 'Los Noctowl del Encinar giran la cabeza todos a la vez, hacia el norte. Llevo tres noches apuntándolo. A ver qué opina el tuyo.', win: 'Los del pueblo dicen que el norte del bosque se ha quedado atascado. Como un cajón. Yo soy ornitólogo, no carpintero.' },
		encinar_nieves: { name: 'Nieves', cls: 'Campista', ai: 2, team: [{ sp: 'parasect', lv: 30 }, { sp: 'spoink', lv: 31 }],
			intro: 'No estoy perdida. Estoy explorando con mucha intensidad. ¿Combatimos? Así parece que hago algo.', win: 'Bueno, sí, estoy perdida. ¿Azalea está hacia allá? ¿O hacia allá? ¿O es esto Azalea?' },

		// ----- Pozo Slowpoke -----
		recluta_pozo_1: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket', ai: 2, team: [{ sp: 'raticate', lv: 31 }, { sp: 'golbat', lv: 32 }],
			intro: '¡Alto! Esto es una obra. Con casco imaginario. Aquí abajo no hay nada que ver. Sobre todo, no hay Slowpoke.', win: 'Bueno, sí hay Slowpoke. Pero son para una buena causa. La nuestra.' },
		recluta_pozo_2: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket_f', ai: 3, team: [{ sp: 'arbok', lv: 32 }, { sp: 'koffing', lv: 32 }, { sp: 'houndoom', lv: 33 }],
			intro: 'Soy la Tercera. Tercera en cerraduras, en códigos y en llegar a tiempo. En esta familia todos tenemos una especialidad. La mía es que no pases.', win: 'Al Primero no le va a gustar esto. Al Primero nunca le gusta nada. Por eso es el Primero.' },
		recluta_pozo_3: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket', ai: 3, team: [{ sp: 'grimer', lv: 32 }, { sp: 'hypno', lv: 33 }],
			intro: 'Cuando el jefe se fue, nos quedamos sin sueldo, sin uniforme y sin casa. Me lo quedé todo yo, menos lo primero. ¡Hypno, que duerma!', win: 'Dicen que si cumplimos este encargo, vuelve la familia. Toda. Hasta el primo que se fue a Hoenn.' },
		recluta_pozo_4: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket_f', ai: 3, team: [{ sp: 'murkrow', lv: 33 }, { sp: 'arbok', lv: 34 }],
			intro: 'Yo soy la Mayor. La que cuida de los demás. Y ahora mismo, cuidar de los demás es que tú no llegues al fondo.', win: 'Los pequeños de la familia comieron caliente esta semana gracias a esas cajas. Piénsalo cuando las abras.' },
		proton_1: { name: 'Protón', cls: 'Admin Rocket', npc: 'proton', ai: 5, iv: 28, reward: 2900, bg: 'cave',
			team: [
				{ sp: 'golbat', lv: 33, moves: ['airslash', 'poisonfang', 'supersonic', 'bite'], ability: 'innerfocus', nature: 'jolly', iv: 27 },
				{ sp: 'grimer', lv: 33, moves: ['poisonjab', 'rocktomb', 'icepunch', 'disable'], ability: 'stickyhold', item: 'blacksludge', nature: 'adamant', iv: 27 },
				{ sp: 'skuntank', lv: 35, moves: ['crunch', 'poisonjab', 'suckerpunch', 'toxic'], ability: 'aftermath', nature: 'adamant', iv: 26 },
				{ sp: 'weezing', lv: 36, moves: ['sludgebomb', 'darkpulse', 'willowisp', 'clearsmog'], ability: 'levitate', item: 'sitrusberry', nature: 'bold', iv: 27 },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: 'Te voy a enseñar lo que es un Rocket de verdad. No como esos llorones de ahí detrás.',
			win: '¿Esto? ¿Contra un novato? …Ríete. Ríete ahora, que luego no te va a hacer gracia.',
			lose: 'Así se hace. Sin dudar. Sin mirar atrás. Apúntenlo, inútiles.' },

		// ----- Gimnasio de Azalea -----
		gym_azalea_1: { name: 'Fermín', cls: 'Cazabichos', ai: 3, team: [{ sp: 'scyther', lv: 33 }, { sp: 'ledian', lv: 33 }],
			intro: 'Antón dice que los bichos están raros desde hace unas semanas. Que los del bosque no quieren salir de los troncos. ¿Tú también lo has notado?', win: 'Mi Scyther ha cortado un hilo de la red sin querer. Antón lo va a saber. Antón lo sabe todo.' },
		gym_azalea_2: { name: 'Rocío', cls: 'Entomóloga', ai: 3, team: [{ sp: 'venomoth', lv: 33 }, { sp: 'pinsir', lv: 34 }],
			intro: 'Un Pinsir levanta cien veces su peso. Yo levanto mi café a duras penas. Cada uno tiene su especialidad.', win: 'Pasa, pasa. Y si Antón empieza a hablar de alas, siéntate. Va para largo.' },
		anton_g4: { name: 'Antón', cls: 'Líder', npc: 'anton', ai: 4, iv: 29, reward: 2200, bg: 'gym',
			team: [
				{ sp: 'ariados', lv: 33, moves: ['poisonjab', 'suckerpunch', 'shadowsneak', 'bugbite'], ability: 'sniper', item: 'focussash', nature: 'adamant', iv: 27 },
				{ sp: 'heracross', lv: 34, moves: ['brickbreak', 'pinmissile', 'rocktomb', 'aerialace'], ability: 'guts', item: 'sitrusberry', nature: 'jolly', iv: 28 },
				{ sp: 'yanmega', lv: 35, moves: ['airslash', 'bugbuzz', 'ancientpower', 'quickattack'], ability: 'tintedlens', item: 'silverpowder', nature: 'modest', iv: 29 },
				{ sp: 'scizor', lv: 36, moves: ['bulletpunch', 'bugbite', 'aerialace', 'swordsdance'], ability: 'technician', item: 'metalcoat', nature: 'adamant', iv: 31 },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: '¡Datos, ciencia y alas! Llevo semanas observando a mis bichos. Hoy toca observarte a ti.',
			win: 'Fascinante. De verdad: fascinante. Tengo que apuntarlo todo antes de que se me olvide.',
			lose: 'Interesante. Te ha faltado cubrir el flanco aéreo. Lo digo con cariño, ¿eh? Es mi especialidad.' },

		// ----- Azalea: Huerto de Bonguris (entrenamiento) -----
		ent_azalea_1: { name: 'Concha', cls: 'Jardinera', ai: 2, team: [{ sp: 'bellossom', lv: 31 }, { sp: 'sunflora', lv: 30 }],
			intro: 'Riego los Bonguris de Kurt a cambio de una Ball al mes. Y de que no me grite. Lo segundo no siempre se cumple.', win: 'Vuelve cuando quieras. Las flores no se cansan de combatir. Yo un poco.' },
		ent_azalea_2: { name: 'Joaquín', cls: 'Cazabichos', ai: 2, team: [{ sp: 'ledian', lv: 31 }, { sp: 'ariados', lv: 32 }],
			intro: 'Entreno aquí antes de retar a Antón. Llevo así dos años. Algún día me atreveré.', win: 'Ya está. Mañana voy. O pasado. Pasado seguro.' },
		ent_azalea_3: { name: 'Teodoro', cls: 'Campista', ai: 2, team: [{ sp: 'parasect', lv: 32 }, { sp: 'skiploom', lv: 33 }],
			intro: 'Me perdí en el Encinar y salí aquí. Hace un mes. Me ha gustado y me he quedado.', win: 'Si vas al bosque, lleva un reloj. No te servirá de nada, pero da compañía.' },
	},

	// =====================================================================
	// MISIONES (solo las pequeñas de este tramo)
	// =====================================================================
	quests: {
		b02_s_farfetchd: { name: 'El pájaro que no quería volver', type: 'side', est: 20, stages: {
			buscar: 'El aprendiz del carbonero de Azalea ha perdido a su **Farfetch’d** en el **Encinar**. Búscalo.',
			volver: 'El Farfetch’d no estaba perdido. Vuelve con el **aprendiz** a Azalea… con compañía.',
			hecha: 'El Farfetch’d volvió a casa. Y no volvió solo.',
		} },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		paginapetra: { name: 'Hoja de la libreta de Petra', pocket: 'key', desc: 'Una hoja arrancada de una libreta de campo, con barro en una esquina y una huella de Diggersby en la otra.',
			read: '**Encinar (Johto). Día 1. ¿O 2? ¿O 6?**\n\n— El reloj de pulsera marca las 16:40. El del móvil, las 16:40. El de Pala (no tiene reloj, pero tiene hambre a su hora) dice que han pasado dos comidas. Las 16:40.\n\n— Capas del suelo junto al altar: ORDENADAS. Por fin algo en orden. Lo más antiguo abajo, lo más nuevo arriba. Primera regla.\n\n— Excepto en un sitio. Una franja de tierra de un palmo, entre dos capas normales, que no es de ninguna época. No tiene polen. No tiene nada. Como si ahí no hubiera pasado el tiempo.\n\n— Me he caído en el agujero tres veces. Dato irrelevante. Lo apunto igual.\n\n— He visto un destello verde. Pala también. Pala no miente.\n\nAl margen, con otra tinta: *Si el tiempo se para en algún sitio, ¿dónde se queda lo que no pasa?*' },
		bocetosantuario: { name: 'Boceto del Santuario', pocket: 'key', art: 'santuario_encinar', desc: 'Un dibujo a lápiz y acuarela que Petra hizo del Santuario del Encinar, con el altar de madera, las encinas enormes y unas hojas que caen hacia arriba. Abajo pone: «Para que no se te olvide que fue verdad».' },
		albaranraices: { name: 'Albarán de la Fundación', pocket: 'key', desc: 'Una hoja de reparto plastificada, arrancada de una caja del Pozo Slowpoke. Está mojada, pero se lee.',
			read: '**FUNDACIÓN RAÍCES DE JOHTO**\n*«Devolviendo a cada Pokémon a su lugar»*\n\nAlbarán de recogida n.º 0412 · Origen: Pueblo Azalea (pozo)\nContenido: 12 u. *Slowpoke* (sanos, dormidos, pesados)\nManipulación: no agitar. No despertar. No hace falta, no se despiertan.\n\nDestino: **por asignar**\nPago al transportista: 40 % a la entrega, 60 % a la asignación.\n\nAbajo, a mano, otra letra: *Con esto saldamos lo del mes pasado. Que no vuelvan a preguntar por los chicos de Ciudad Trigal. Ya sabemos dónde están. — P.*\n\nEn el margen, una pegatina pequeña de código de barras. Debajo del código, cuatro caracteres: **N-02**.' },
		mt_tijerax: { name: 'MT Tijera X', pocket: 'machines', tm: 'xscissor', desc: 'Corta al objetivo cruzando las guadañas o las garras como si fueran unas tijeras.' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		arbol_bonguri: {
			name: 'Árbol de Bonguris', icon: '🌰', hours: 20, picks: [1, 2],
			text: 'Sacudes las ramas bajas. Caen unos frutos duros y redondos que rebotan en las raíces.',
			wait: 'Solo quedan Bonguris verdes, duros como piedras. Habrá que esperar.',
			table: [
				{ id: 'redapricorn', w: 16, n: [1, 1] }, { id: 'blueapricorn', w: 16, n: [1, 1] }, { id: 'yellowapricorn', w: 16, n: [1, 1] },
				{ id: 'greenapricorn', w: 16, n: [1, 1] }, { id: 'pinkapricorn', w: 14, n: [1, 1] }, { id: 'whiteapricorn', w: 12, n: [1, 1] },
				{ id: 'blackapricorn', w: 10, n: [1, 1] },
			],
		},
		setas_encinar: {
			name: 'Corro de setas del Encinar', icon: '🍄', hours: 22, picks: [1, 2],
			text: 'Al pie de una encina vieja crece un corro de setas. Algunas tienen el sombrero brillante, como si llevaran rocío que no se seca.',
			wait: 'Solo quedan los tallos. El bosque es lento, pero vuelve.',
			table: [
				{ id: 'bigmushroom', w: 28, n: [1, 1] }, { id: 'healpowder', w: 18, n: [1, 2] }, { id: 'energypowder', w: 18, n: [1, 2] },
				{ id: 'energyroot', w: 12, n: [1, 1] }, { id: 'balmmushroom', w: 6, n: [1, 1] }, { id: 'revivalherb', w: 4, n: [1, 1] },
				...BAYAS_ENCINAR.map(e => ({ ...e, w: Math.ceil(e.w / 3) })),
			],
		},
		orilla_pozo: {
			name: 'Orilla de la charca grande', icon: '💧', hours: 24, picks: [1, 2],
			text: 'Entre las piedras de la orilla, el agua del pozo ha ido dejando cosas. Un Slowpoke te mira rebuscar sin moverse.',
			wait: 'La charca no ha traído nada nuevo. El Slowpoke sigue mirándote.',
			table: [
				{ id: 'pearl', w: 30, n: [1, 2] }, { id: 'stardust', w: 20, n: [1, 1] }, { id: 'heartscale', w: 12, n: [1, 1] },
				{ id: 'bigpearl', w: 8, n: [1, 1] }, { id: 'freshwater', w: 18, n: [1, 2] }, { id: 'kingsrock', w: 3, n: [1, 1], cond: 'flag.b02_pozo_hecho' },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		jefe_proton: {
			name: 'Pozo Slowpoke: el Team Rocket', npc: 'recluta_rocket', trainer: 'proton_1', type: 'Poison', rec: 36,
			cond: 'flag.b02_kurt_1',
			info: [
				{ text: 'Alguien está sacando a los Slowpoke del **Pozo** de Azalea en cajas. Kurt dice que son «otra vez los de negro».' },
				{ cond: 'flag.b02_pozo_entrada', text: 'Es el **Team Rocket**. Sus reclutas usan Pokémon de tipo **Veneno** y **Siniestro**. Alguien da órdenes desde el fondo.' },
					{ cond: 'flag.b02_pozo_hecho', text: 'Los dirigía un admin: **Protón**.' },
				{ cond: 'beat("recluta_pozo_2") || beat("recluta_pozo_3")', text: '4 Pokémon, hasta nivel 36. Los ataques de tipo **Psíquico** y **Tierra** le van bien. Un tipo **Acero** no teme al veneno… pero ojo con el fuego.' },
				{ cond: 'beat("proton_1")', text: '✔ Los Slowpoke han vuelto a casa.' },
			],
		},
	},

	// =====================================================================
	// NPCs genéricos de este tramo
	// =====================================================================
	npcs: {
		aprendiz_carbon: { name: 'Aprendiz del carbonero', generic: true, look: { hair: 'cap', hairColor: '#3a2a1e', outfit: '#4a4a4a', outfit2: '#c9a66b', skin: 2, eyesStyle: 'normal', mouth: 'open', acc: 'freckles' } },
		anciano_pozo: { name: 'Anciano del pozo', generic: true, look: { hair: 'bald', hairColor: '#e9e8e0', outfit: '#6a4a3a', outfit2: '#e9e3d0', skin: 3, eyesStyle: 'sleepy', mouth: 'smile', acc: 'beard' } },
		nino_azalea: { name: 'Niño de Azalea', generic: true, look: { hair: 'short', hairColor: '#2a1e16', outfit: '#3b5bb5', outfit2: '#f2b33d', skin: 2, eyesStyle: 'sharp', mouth: 'flat' } },
		vecina_azalea: { name: 'Vecina de Azalea', generic: true, look: { hair: 'bun', hairColor: '#5a3a26', outfit: '#c4473a', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'happy', mouth: 'open' } },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// ================= 1. LLEGADA AL SANTUARIO =================
		b02_llegada: [
			{ set: { 'flag.b02_llegada': true } },
			{ quest: 'b02_m2', stage: 'santuario', cond: '!quest.b02_m2' },
			{ cutscene: { bg: { type: 'forest', fog: true }, start: 'dark', frames: [
				{ cam: 'still', text: 'Tictac.' },
				{ cam: 'still', text: 'Tictac.' },
				{ cam: 'still', text: 'Tic…' },
				{ cam: 'pan-up', weather: 'leaves', fx: 'light', text: 'Abres los ojos. Hojas. Muchas hojas, muy arriba, y entre ellas una luz verde que no es de día ni de noche.' },
				{ cam: 'pull', fx: 'glow', text: 'Estás tumbad{o|a|e} sobre musgo, en un claro rodeado de árboles enormes. No hay plaza. No hay Puerta. No hay nadie.' },
			] } },
			{ text: 'Lo último que recuerdas es la luz de la Puerta Lemnis tragándoselo todo. Y una sacudida, como cuando un ascensor se para entre dos pisos.' },
			{ text: 'Algo te toca el hombro. Una pata azul, con un pincho blanco en el dorso. {riolu} está de pie a tu lado, con las orejas tiesas y el pelo erizado, mirando hacia los árboles. No hacia ti: hacia fuera. Está montando guardia.', cond: LUCARIO },
			{ text: 'Cuando ve que te mueves, baja la guardia medio segundo, solo para tocarte la frente con la pata, como quien comprueba que algo sigue entero. Luego vuelve a mirar los árboles.', cond: LUCARIO },
			{ text: 'Cuentas a tu equipo. Están todos. Cansados, despeinados, pero están todos.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Uy! ¡Uy, uy! Me he mareado. ¿Los Rotom se marean? …¡Ya! ¡Hola! ¿Dónde estamos? Espera, que lo miro. ¡Lo sé todo! Bueno, casi. Bueno…' },
			{ say: 'rotom', text: 'Ubicación: **Johto**. ¡Johto! ¡La Gira iba a Johto! ¡Hemos llegado! …Pero esto no es Ciudad Trigal. Esto es… un bosque. El **Encinar**, dice el mapa. ¡Bzzt! El mapa también dice «¿?». Nunca había visto al mapa decir «¿?».' },
			{ text: 'En el centro del claro, sobre una piedra plana, hay un **altar de madera** pequeño, del tamaño de una casita de pájaros. Alguien le ha dejado delante un Bonguri y una flor seca.' },
			{ say: 'rotom', text: 'Hora local: las 16:40. ¡Bzzt! Ya lo apunto. Las 16:40.' },
			{ text: 'Esperas. Respiras. Te levantas. Le das una vuelta al claro.' },
			{ say: 'rotom', text: 'Hora local: las 16:40. …Qué raro. Hora local: las… 16:40. ¡Bzzt! ¡Mi reloj no anda! ¡Mi reloj siempre anda! ¡Es lo único que hago sin pensar!' },
			{ say: 'rotom', text: 'A ver, a ver. Si el reloj no anda, el tiempo no pasa. Y si el tiempo no pasa, ¡no llegamos tarde a nada! ¡Esto es buenísimo! …¿Verdad? ¿Es buenísimo?' },
			{ text: 'Una hoja se suelta de una rama, muy arriba. Cae despacio. Demasiado despacio. A media altura se queda quieta en el aire un segundo, como si lo pensara. Luego sigue cayendo.' },
			{ text: '{riolu} gruñe muy bajito. No a la hoja. Al bosque entero.', cond: LUCARIO },
			{ choice: [
				{ text: '«Tranquilo, {riolu}. Estamos juntos. Eso es lo importante.»', cond: LUCARIO, then: [
					{ text: '{riolu} no deja de vigilar, pero se acerca un paso, hasta que su hombro toca el tuyo. Se queda así.' },
					{ happy: { who: 'riolu', n: 5 } },
				] },
				{ text: '«Rotom, ¿puedes llamar a alguien?»', then: [
					{ say: 'rotom', text: '¡Claro! Llamando a… ¡Bzzt! Sin cobertura. Llamando otra vez… Sin cobertura. ¿Sabías que en este claro no hay ni una sola antena? Ni una. Ni un bit. Ni medio bit.' },
				] },
				{ text: 'Mirar el altar de cerca.', then: [
					{ text: 'De cerca, el altar es todavía más pequeño y más viejo. La madera está gastada como una piedra de río. Alguien la ha cuidado durante mucho, mucho tiempo.' },
					{ text: 'De una rama, justo encima, cuelga de una cadenita un reloj de bolsillo. Está parado. Marca las 16:40.' },
				] },
			] },
			{ say: 'rotom', text: 'Plan de Rotom: ¡salir del bosque! Buscar un pueblo. Buscar un Centro Pokémon. Buscar a la Gira. Y buscar a alguien que me explique por qué los relojes de Johto son tan vagos.' },
		],

		// ================= 2. LOS DESPLAZADOS APAGADOS =================
		b02_apagados: [
			{ set: { 'flag.b02_apagados': true } },
			{ text: 'Entre los helechos, al borde del claro, hay dos Pokémon tumbados. No duermen. Tienen los ojos abiertos.' },
			{ text: 'Uno es un **Fidough**: un perrito de masa de pan, de Paldea. Debería ser regordete y blandito. Está hundido, como una masa que no ha subido.' },
			{ text: 'El otro es un **Pachirisu**, de Sinnoh. Pequeño, blanco y azul. Las mejillas, que deberían chisporrotear, están apagadas.' },
			{ text: 'Los dos te miran cuando te acercas. No huyen. No gruñen. No hacen nada. Y en los ojos no tienen ese brillo que tienen todos los Pokémon, ese puntito de luz. Es como mirar una ventana de noche.' },
			{ say: 'rotom', text: 'Bzzt… Fidough, Paldea. Pachirisu, Sinnoh. Ninguno es de aquí. Constantes… bajas. Muy bajas. No están heridos. No están enfermos. Están… ¿cómo se dice? Están **apagados**.' },
			{ say: 'rotom', text: 'Eso no es un dato. Eso es una palabra que me he inventado. No me gusta inventarme palabras.' },
			{ text: 'Junto a los helechos crece un arbusto de **Bayas Aranja**. Tomas una.' },
			{ choice: [
				{ text: 'Dársela al Fidough.', then: [{ set: { 'flag.b02_apagados_fidough': true } }] },
				{ text: 'Dársela al Pachirisu.', then: [{ set: { 'flag.b02_apagados_pachirisu': true } }] },
			] },
			{ if: 'flag.b02_apagados_pachirisu', then: [
				{ text: 'Le acercas la baya al Pachirisu. La huele. Abre la boca, muy despacio… y no muerde. No le quedan fuerzas ni para eso.' },
				{ text: 'Tomas otra baya y se la das al Fidough. Este sí: mordisquea, despacio, y la masa de su cuerpo sube un poquito, como un bizcocho en el horno.' },
			], else: [
				{ text: 'Le acercas la baya al Fidough. La huele, la lame y la mordisquea, despacio. La masa de su cuerpo sube un poquito, como un bizcocho en el horno.' },
				{ text: 'Tomas otra baya para el Pachirisu. La huele. Abre la boca, muy despacio… y no muerde. No le quedan fuerzas ni para eso.' },
			] },
			{ text: 'El Fidough se levanta. Las patas le tiemblan, pero se levanta. Te lame la mano una vez, con una lengua tibia que huele a levadura, y se mete despacito entre los helechos.' },
			{ text: 'El Pachirisu cierra los ojos. Se le acompasa la respiración. Se ha quedado dormido.' },
			{ text: 'Esperas a que se despierte. No se despierta. Respira, lento, muy lento. Pero no se despierta.' },
			{ text: '{riolu} se agacha junto al Pachirisu. Le pone la palma encima, sin tocarlo, y cierra los ojos. Un brillo azul, débil, le baja por el brazo… y se apaga enseguida, como una cerilla en el viento.', cond: LUCARIO },
			{ text: '{riolu} abre los ojos. No se levanta. Se sienta junto al Pachirisu, con la espalda contra una raíz, y se queda allí. Vigilándolo. Como si alguien tuviera que hacerlo.', cond: LUCARIO },
			{ say: 'rotom', text: '…' },
			{ say: 'rotom', text: 'Bzzt. Lo dejo registrado. Pachirisu. Dormido. Respirando. Lo escribo dos veces, por si acaso. Respirando.' },
			{ text: 'Al cabo de un rato, {riolu} se levanta y vuelve a tu lado. Antes de irse, le pone al Pachirisu una hoja grande encima, como una manta.', cond: LUCARIO },
		],
		b02_pachirisu_generico: [
			{ if: 'flag.b02_encinar_libre', then: [
				{ text: 'El Pachirisu sigue dormido, en una madriguera de hojas que Pala le ha cavado a medida. Petra le ha puesto un letrero de cartón: «NO MOLESTAR. SOÑANDO».' },
				{ text: 'Respira un poco más deprisa que el primer día. Un poco. Petra lo apunta todo en la libreta.' },
			], else: [
				{ text: 'El Pachirisu sigue dormido bajo la hoja grande. Respira. Lento, muy lento.' },
			] },
			{ text: '{riolu} se agacha a su lado un momento, como cada vez. Luego vuelve contigo.', cond: LUCARIO },
		],

		// ================= 4. PETRA =================
		b02_petra_1: [
			{ set: { 'flag.b02_petra_1': true } },
			{ text: 'Detrás de unas raíces enormes se oye un golpe, un chapoteo de barro y una voz que conoces.', cond: 'flag.b01_enc_petra_1' },
			{ text: 'Detrás de unas raíces enormes se oye un golpe, un chapoteo de barro y una voz de mujer muy alterada.', cond: '!flag.b01_enc_petra_1' },
			{ say: 'petra', as: 'Voz en un agujero', text: '¡Pala! ¡PALA! ¡No, el cubo no! ¡El cubo es lo único que tengo ordenado!' },
			{ text: 'Al rodear las raíces encuentras un agujero perfectamente cuadrado. Dentro, una mujer con gafas de protección en la frente y barro hasta las orejas. Fuera, un Diggersby sujeta un cubo con las dos orejas, muy digno.' },
			{ if: 'flag.b01_enc_petra_1', then: [
				{ say: 'petra', text: '¿{jugador}? ¡{jugador}! ¡Eres tú! ¿Eres tú? Dime algo que solo sepas tú, por si eres un efecto del bosque.' },
				{ choice: [
					{ text: '«Te has roto la misma muñeca dos veces.»', then: [{ say: 'petra', text: '¡Eres tú! Nadie más se acuerda de eso. Ni mi madre. Mi madre cree que fueron tres.' }] },
					{ text: '«Excava Pala. Tú te caes.»', then: [{ say: 'petra', text: '¡Es nuestro sistema! ¡Eres tú! Pala, es {jugador}. Pala, salúdale. Pala, sácame del agujero y luego saluda.' }] },
				] },
			], else: [
				{ say: 'petra', as: 'Mujer del agujero', text: '¡Hola! ¡Una persona! ¿Eres real? Perdona, es que llevo aquí un tiempo y ya no sé si las cosas son reales o son raíces con mucha personalidad.' },
				{ say: 'petra', text: 'Petra Brossard, paleontóloga de campo. «De campo» quiere decir que me paso el día en el suelo. Hoy, literalmente, debajo.' },
			] },
			{ text: 'Pala la saca del agujero tirando de una oreja. Petra aterriza en el musgo, resbala, se agarra a una rama, la rama se rompe, y se queda sentada. El cubo, en las orejas de Pala, ni se ha movido.' },
			{ say: 'petra', text: 'Gracias, Pala. Estoy bien. Todo está bien. No se ha roto nada importante. Solo la rama. Y un poco mi dignidad, pero eso se regenera.' },
			{ say: 'petra', text: '¿Cuánto llevo aquí? Buena pregunta. Dos días. O una semana. Depende del reloj que mires. Mi reloj dice que dos horas. Mi estómago dice que una semana. Pala dice que dos comidas, y Pala nunca se equivoca con las comidas.' },
			{ say: 'petra', text: 'Vine buscando **el bosque donde los relojes se paran**. Y lo he encontrado. Es este. Felicidades a mí. El problema es que ahora no sé salir.' },
			{ if: 'has("ambarsinregistro")', then: [
				{ say: 'petra', text: 'Oye… ¿lo sigues teniendo? El ámbar. Dime que lo sigues teniendo. No me lo enseñes, que se me cae. Solo dímelo.' },
				{ text: 'Lo sacas del bolsillo. Está tibio, como siempre. El brillo azul de dentro late despacio, tranquilo, como un corazón dormido.' },
				{ say: 'petra', text: 'Ahí está. —Se le escapa una sonrisa enorme—. Sabía que estaba en buenas manos. En las mías ya habría rodado hasta Hoenn.' },
			], else: [
				{ say: 'petra', text: 'Mira. —Saca de un cubo algo envuelto en un pañuelo y lo destapa con un cuidado que no ha tenido con nada más—. Mi ámbar. Lo encontré en los acantilados de Kalos. Está tibio. El ámbar no está tibio nunca. Y dentro hay un brillo azul que… late.' },
				{ text: 'Al intentar enseñártelo mejor, Petra tropieza con su propio cubo. El ámbar sale volando. Lo atrapas al vuelo, a un palmo del barro.' },
				{ say: 'petra', text: '…Quédatelo. Por favor. En mis manos esto no dura ni dos días, y tú tienes buenos reflejos. Y un Pokémon que no se cae.' },
				{ give: 'ambarsinregistro', cond: '!has("ambarsinregistro")' },
			] },
			{ say: 'petra', text: 'Te enseño una cosa. Las capas de tierra de aquí están en orden. Lo antiguo abajo, lo nuevo arriba. Primera regla. ¡Por fin algo en orden en este viaje!' },
			{ say: 'petra', text: 'Menos una franja. Un palmo de tierra, entre dos capas normales, que no es de ninguna época. No tiene polen. No tiene semillas. No tiene nada. Como si por ahí no hubiera pasado el tiempo.' },
			{ text: 'Se calla. Mira el agujero. Luego te mira a ti. No dice nada durante un rato largo, que en Petra es muchísimo.' },
			{ say: 'petra', text: 'Toma, te copio la página. Si me pasa algo, que alguien sepa lo que he visto. —Arranca la hoja. Se le cae la libreta en el agujero. Pala baja, la recoge y la sube sin que nadie se lo pida—. Gracias, Pala.' },
			{ give: 'paginapetra' },
			{ if: '!done.b01_t_ambar && quest.b01_t_ambar', then: [{ quest: 'b01_t_ambar', done: true }] },
			{ quest: 'b02_t_ambar', stage: 'encinar' },
			{ cond: 'flag.b01_enc_petra_1', intel: { npc: 'petra', text: 'Está en el Encinar desde hace «dos días o una semana, según el reloj». Encontró por fin «el bosque donde los relojes se paran». Junto al altar hay una franja de tierra «de ninguna época».' } },
			{ cond: '!flag.b01_enc_petra_1', intel: { npc: 'petra', text: 'Petra Brossard, paleontóloga de campo muy torpe, con un Diggersby llamado Pala. Te dio un ámbar tibio que late. En el Encinar encontró una franja de tierra «de ninguna época», como si por ahí no hubiera pasado el tiempo.' } },
		],
		b02_petra_generico: [
			{ text: 'Petra mide algo con una regla, sentada en el borde de un agujero. Pala vigila que no se caiga. Se cae igual.' },
			{ say: 'petra', text: '¡{jugador}! Novedades: ninguna. Bueno, una: he encontrado otra franja de tierra «sin tiempo», pero esta vez es porque se me cayó el bocadillo encima. Falsa alarma. Muy rica, eso sí.' },
			{ if: 'has("ambarsinregistro")', then: [{ say: 'petra', text: '¿El ámbar sigue latiendo? Si late más deprisa, avísame. Si late más despacio, también. Si deja de latir… no me avises. Ven a buscarme. En persona.' }] },
		],
		b02_petra_despues: [
			{ say: 'petra', text: '¡{jugador}! Mira, mira: el reloj de pulsera marca las 11:15. Y luego las 11:16. ¡Y luego las 11:17! ¡Es precioso! Nunca me había emocionado tanto con un reloj.' },
			{ say: 'petra', text: 'Pala y yo nos quedamos un tiempo. Hay que medir cómo se desatasca un bosque. Nadie lo ha medido nunca. Voy a ser la primera. Y voy a caerme muchas veces. Las dos cosas, a la vez.' },
		],

		// ================= 3 + 5. CELEBI, EL ÁMBAR Y ULISES =================
		b02_celebi: [
			{ text: 'Petra se queda quieta de golpe, con la regla en el aire.' },
			{ say: 'petra', text: 'Ahí. No mires. No, mira. Ahí.' },
			{ text: 'Entre dos encinas, a la altura de los ojos, hay un destello verde. Pequeño. Se mueve como una hoja que no sabe que tiene que caer.' },
			{ if: 'has("ambarsinregistro")', then: [
				{ text: 'En tu bolsillo, el ámbar se calienta de golpe. Lo sacas: el brillo azul de dentro late deprisa. Tic-tac-tic-tac, como un corazón asustado. O emocionado. No sabrías decir cuál.' },
				{ say: 'petra', text: '…Late. Está latiendo como nunca. Pala, apunta. Pala, no sabes escribir. Apunto yo. —Lo apunta. No se le cae nada. Es la primera vez que la ves escribir sin que se le caiga nada.' },
				{ quest: 'b02_t_ambar', stage: 'late' },
			] },
			{ cutscene: { weather: 'leaves', bg: { type: 'forest', fog: true }, frames: [
				{ color: '#8ff0a0', cam: 'push', fx: ['glow', 'sparkle'], text: 'El destello verde se acerca, entre los troncos. Una forma pequeña, como un brote con alas, que no llegas a ver del todo.' },
				{ tint: '#3aa86a', color: '#8ff0a0', fx: ['zoom', 'ripple'], text: 'Y el bosque entero se dobla. Solo un instante. Las hojas que caían empiezan a subir, despacio, de vuelta a sus ramas.' },
				{ weather: 'none', cam: 'still', fx: 'shake', text: 'Una gota de agua se te queda delante de la cara, quieta, brillando. El ruido de tu propia respiración te llega un segundo tarde.' },
				{ weather: 'leaves', tint: 'none', shake: 2, fx: 'flash', text: 'Y luego todo vuelve a caer a la vez. Las hojas. La gota. El ruido.' },
			] } },
			{ text: 'El destello está ahora en el altar de madera, sobre el tejadito de musgo. Te mira. O eso parece. Tiembla como tiembla algo pequeño que ha corrido mucho.' },
			{ text: '{riolu} da un paso al frente, con el pelo erizado y las patas en guardia. Los apéndices de la cabeza se le levantan solos.', cond: LUCARIO },
			{ text: 'Entonces cierra los ojos. Lo está mirando con el aura. Y algo cambia: el pelo se le alisa, las patas se le relajan, los hombros le bajan. Abre los ojos despacio. Ya no está en guardia.', cond: LUCARIO },
			{ text: '{riolu} levanta una pata, con la palma abierta, hacia el destello. Como quien saluda a alguien que tiene miedo. Como saludaste tú a {riolu}, en una plaza de Luminalia, hace ya mucho.', cond: LUCARIO },
			{ text: 'El destello se queda quieto un momento. Luego da una vuelta alrededor del altar, una sola, y se mete entre los árboles. El verde se va apagando entre los troncos, hasta que no queda nada.' },
			{ text: 'Y en ese preciso instante, entre los helechos, alguien sale corriendo detrás del destello. Un abrigo granate. Unos rizos. Una bufanda de rayas tan larga que todavía está saliendo del bosque cuando él ya ha llegado.' },
			{ if: 'flag.b01_viajero_conocido', then: [
				{ say: 'viajero', text: '¿Lo han visto? ¡Lo han visto! ¡{jugador}! ¡Qué alegría! ¿Para ti ha pasado mucho? Para mí, un rato. Un rato largo. Un rato largo y pegajoso. ¿Es martes?' },
			], else: [
				{ say: 'viajero', as: 'Hombre de la bufanda', text: '¿Lo han visto? ¡Lo han visto! ¡Hola! ¡Tú! ¡{jugador}! No me conoces. Yo a ti sí. Bueno, te conoceré. Ulises. No es mi nombre, pero me queda bien. ¿Es martes?' },
				{ set: { 'flag.b01_viajero_conocido': true } },
			] },
			{ say: 'viajero', text: 'Tengo la cabina atascada ahí atrás, entre dos encinas. No arranca. El tiempo aquí está pegajoso. Como miel. Como miel que alguien ha dejado al sol. Das un paso y el paso se te queda pegado un ratito.' },
			{ say: 'petra', text: '¿Perdona? ¿Quién eres? ¿De dónde has salido? ¿Eso es una bufanda o un estrato textil?' },
			{ say: 'viajero', text: '¡Las dos cosas!', cond: 'has("ambarsinregistro")' },
			{ text: 'Ve el ámbar en tu mano y se queda callado. Del todo. Ulises callado da un poco de miedo.', cond: 'has("ambarsinregistro")' },
			{ say: 'viajero', text: '¡Las dos cosas!', cond: '!has("ambarsinregistro")' },
			{ text: 'Mira a Petra, luego el altar, luego a ti, y se queda callado. Del todo. Ulises callado da un poco de miedo.', cond: '!has("ambarsinregistro")' },
			{ if: 'has("ambarsinregistro")', then: [
				{ say: 'viajero', text: 'Eso que tienes. Lo he visto antes. En Kalos, en una playa. Y lo veré antes de antes, en un sitio que todavía no existe. —Lo mira a contraluz y se gira hacia Petra—. Es tuyo, ¿verdad?' },
				{ say: 'petra', text: '¿Cómo sabes que es mío?' },
				{ say: 'viajero', text: 'Porque tiene barro en la misma esquina que tus rodillas.' },
			] },
			{ say: 'petra', text: 'Escucha: yo estudio capas. El tiempo va por capas. Lo antiguo abajo, lo nuevo arriba. Se mide, se data, se apunta. Esa es la primera regla.' },
			{ say: 'viajero', text: 'El tiempo no tiene capas. Tiene nudos. Es una bola enredada de cosas que hacen tictac, y alguien está tirando de un hilo.' },
			{ say: 'petra', text: '¡Las capas se pueden medir! ¿Tus nudos se pueden medir?' },
			{ say: 'viajero', text: 'Con paciencia. Y un bocadillo. Sobre todo el bocadillo.' },
			{ say: 'petra', text: '…Tengo bocadillos.' },
			{ say: 'viajero', text: '…Entonces igual sí se pueden medir.' },
			{ say: 'rotom', text: '¡Bzzt! Perdón. Perdón por interrumpir. Es que he terminado de analizar el destello verde. Bueno. Lo que me ha dado tiempo, porque mi reloj sigue sin andar.' },
			{ say: 'rotom', text: 'Tipo Psíquico y Planta. Muy pequeño. Muy antiguo. Mis datos dicen que es… ¿Ce…? ¿Celebi? El guardián del bosque. El que viaja por el tiempo.' },
			{ say: 'rotom', text: 'Mis datos dicen también que es una leyenda, que casi nadie lo ha visto nunca, y que no debería estar asustado. Las leyendas no se asustan. ¿Verdad? Bzzt… Lo registro con un signo de interrogación. Celebi(?).' },
			{ text: 'Ulises mira hacia donde se fue el destello. Por primera vez desde que lo conoces, no sonríe.' },
			{ say: 'viajero', text: 'Lo pequeñito que late a destiempo pasó por aquí. Hace poco. O dentro de poco. Celebi le tiene miedo. O le tiene pena. Con los que cuidan del tiempo nunca se sabe cuál de las dos.' },
			{ say: 'viajero', text: '…No he dicho nada. Bueno, sí he dicho. Pero era otro yo. Uno más serio y más aburrido. ¡Me voy a ver si el tiempo está menos pegajoso por allí! ¡No toquen mi cabina! ¡Bueno, tóquenla si quieren, total, no arranca!' },
			{ text: 'Y se mete entre los árboles a pie, con la bufanda arrastrando hojas detrás.' },
			{ say: 'petra', text: '…¿Quién era ese?' },
			{ choice: [
				{ text: '«Ni idea. Aparece, pregunta qué día es y se va.»', then: [{ say: 'petra', text: 'Ah. Como mi director de tesis. Pero con mejor bufanda.' }] },
				{ text: '«Alguien que sabe más de lo que dice.»', then: [{ say: 'petra', text: 'Eso es lo que más me fastidia de la gente. Bueno, eso y que no les gusten los fósiles.' }] },
			] },
			{ text: 'Donde estaba el destello, entre dos encinas, el aire está un poco más claro. Se ve un sendero que antes no estaba. O que estaba y no lo veías.' },
			{ text: '{riolu} lo mira, olfatea el aire y te mira a ti. Es por ahí.', cond: LUCARIO },
			{ say: 'petra', text: 'Yo me quedo. Tengo mucho que medir. Y Ulises ha dicho que no toquemos su cabina, así que voy a tocarla. Por ciencia. Ve tú: si sigues ese sendero, sales cerca de un pueblo. Azalea. Huele a carbón y a Slowpoke. Inconfundible.' },
			{ set: { 'flag.b02_celebi_visto': true } },
			{ if: '!done.b01_t_cabina && quest.b01_t_cabina', then: [{ quest: 'b01_t_cabina', done: true }] },
			{ quest: 'b02_t_cabina', stage: 'atascada' },
			{ quest: 'b02_m2', stage: 'azalea' },
			{ intel: { npc: 'viajero', text: 'En el Encinar: su cabina se ha atascado («el tiempo aquí está pegajoso, como miel»). Reconoció el ámbar de Petra. Dijo que «lo pequeñito que late a destiempo» pasó por el bosque, y que Celebi «le tiene miedo, o le tiene pena».' } },
			{ text: 'Sigues el sendero. Cien pasos. Doscientos. Los árboles se aclaran, el aire se vuelve normal, y de pronto te llega un olor a humo de carbón.' },
			{ go: 'encinar' },
		],
		b02_altar: [
			{ text: 'El altar de madera es del tamaño de una casita de pájaros, con un tejado a dos aguas cubierto de musgo. La madera está gastada como una piedra de río.' },
			{ text: 'Delante hay un Bonguri, una flor seca y, de una rama justo encima, un reloj de bolsillo colgado de una cadenita. Está parado. Marca las 16:40.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Igual que yo! ¡Qué casualidad! …No me gustan las casualidades. Las casualidades son datos que no entiendo.' },
		],
		b02_altar_despues: [
			{ text: 'El altar de madera, con su tejado de musgo. Alguien ha dejado un Bonguri nuevo delante. Petra jura que no ha sido ella.' },
			{ if: 'flag.b02_encinar_libre', then: [
				{ text: 'El reloj de bolsillo que cuelga de la rama hace tictac. Muy bajito, como si le diera vergüenza. Marca una hora cualquiera. Una hora normal.' },
			], else: [
				{ text: 'El reloj de bolsillo sigue parado. Las 16:40. Pero, si lo miras mucho rato, la aguja de los segundos tiembla. Como si quisiera.' },
			] },
			{ text: '{riolu} junta las palmas delante del altar, un segundo, y vuelve a tu lado. Nadie le ha enseñado a hacerlo.', cond: LUCARIO },
		],

		// ================= Desplazado teracristalizado (pista visible) =================
		b02_encinar_tera: [
			{ text: 'Entre los árboles torcidos brilla algo. No es verde. Es un brillo de cristal, de colores, como cuando el sol atraviesa una lámpara de araña.' },
			{ text: 'Es un **Toedscool**, un hongo saltarín de Paldea. Pero lo que lleva en la cabeza no es su sombrero de siempre: es una corona de cristal facetado, morada y negra, que suelta destellos fríos.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Teracristalización! ¡Otra vez! ¡En Kalos ya vimos una, y ahora en Johto! ¡Eso solo pasa en Paldea! ¡Mis datos dicen que solo pasa en Paldea! ¡Mis datos están MUY enfadados!', cond: 'flag.b01_r10_tera' },
			{ say: 'rotom', text: '¡Bzzt! ¡Eso es una **teracristalización**! ¡Eso solo pasa en Paldea! ¡Mis datos dicen que solo pasa en Paldea! ¡Mis datos están MUY enfadados!', cond: '!flag.b01_r10_tera' },
			{ text: 'El Toedscool salta hacia ti. No está apagado como los del claro. Al contrario: brilla de más, como una bombilla a punto de fundirse.' },
			{ wild: { sp: 'toedscool', lv: 30, gimmick: 'tera', tera: 'Poison' },
				onWin: [{ text: 'El cristal se rompe en mil destellos que se apagan antes de tocar el suelo. El Toedscool se aleja dando saltitos, con su sombrero de siempre. Parece aliviado.' }],
				onCatch: [{ say: 'rotom', text: '¡Bzzt! Registrado. Y el cristal se ha ido. ¿Adónde se va el cristal? Nadie me lo explica nunca.' }],
				onRun: [{ text: 'Te alejas entre los árboles. El brillo de cristal se queda atrás, saltando solo.' }] },
			{ set: { 'flag.b02_encinar_tera': true } },
		],

		// ================= 6. EL FARFETCH'D Y EL LEÑADOR =================
		b02_aprendiz_1: [
			{ say: 'aprendiz_carbon', text: '¡Eh! ¿Vienes del Encinar? ¿Has visto un Farfetch’d? Así de alto, con un puerro, cara de pocos amigos. Es del jefe. Bueno, del carbonero. Bueno, es mío, porque yo lo saco a pasear.' },
			{ say: 'aprendiz_carbon', text: 'Lo llevo al bosque a cortar leña. Él corta con el puerro, yo recojo. Siempre vuelve. Pero esta vez se fue hacia los helechos, me miró… y no volvió. Llevo dos días llamándolo.' },
			{ say: 'aprendiz_carbon', text: 'Si el jefe se entera, me quedo sin aprendizaje. Y sin carbón. Y sin cena. Por favor.' },
			{ quest: 'b02_s_farfetchd', stage: 'buscar' },
		],
		b02_aprendiz_recordar: [
			{ say: 'aprendiz_carbon', text: 'Lo vi por última vez en el claro de los leñadores, donde está el hacha clavada. Está en el Encinar, no muy lejos de aquí. ¿Lo has visto? ¿Estaba bien? ¿Estaba enfadado? Siempre está un poco enfadado.' },
		],
		b02_farfetchd_antes: [
			{ text: 'En el claro de los leñadores hay un Farfetch’d plantado delante de unos helechos, con el puerro en alto como una espada. Cuando te acercas, abre las alas y suelta un graznido que no deja lugar a dudas.' },
			{ text: 'No piensa moverse. Tampoco te ataca. Solo vigila.' },
		],
		b02_farfetchd_hallado: [
			{ text: 'En el claro de los leñadores, plantado delante de unos helechos, hay un Farfetch’d con el puerro en alto como una espada. Lleva un pañuelo atado al cuello con un nombre bordado: «Carboncillo».' },
			{ text: 'Te acercas. Abre las alas y grazna. No te deja dar un paso más.' },
			{ if: LUCARIO, then: [
				{ text: '{riolu} se adelanta. Cierra los ojos un segundo, con los apéndices de la cabeza levantados. Luego se agacha muy despacio, hasta quedar a la altura del Farfetch’d, y abre las palmas. No hay amenaza en él.' },
				{ text: 'El Farfetch’d lo mira. Baja el puerro un poco. Solo un poco. {riolu} te mira y señala los helechos con la cabeza. Detrás del pájaro hay alguien.' },
				{ happy: { who: 'riolu', n: 5 } },
			], else: [
				{ text: 'Te agachas despacio, con las manos abiertas. Esperas. El Farfetch’d te mira mucho rato. Al final baja el puerro un poco. Solo un poco.' },
			] },
			{ text: 'Entre los helechos, enroscado en el hueco de una raíz, hay un **Morelull**: un hongo pequeñito, de Alola, de esos que brillan en la oscuridad con una luz azul y suave.' },
			{ text: 'Este no brilla. Tiene los ojos abiertos, sin ese puntito de luz. Como los del claro. Apagado.' },
			{ say: 'rotom', text: 'Bzzt… Morelull. Alola. No es de aquí. Constantes bajas. Igual que el Pachirisu. Igual que el Fidough. Ya van tres. Tres no es una casualidad, ¿verdad? Tres es… una tendencia.' },
			{ text: 'El Farfetch’d no estaba perdido. Estaba de guardia. Lleva dos días aquí, sin comer, cuidando de un Pokémon que no conoce de nada, para que nada se lo lleve.' },
			{ text: 'Cuando acercas la mano al Morelull, el Farfetch’d se tensa. Luego te deja. El Morelull pesa casi nada. Está frío.' },
			{ prompt: '¿Qué haces con el Morelull?', choice: [
				{ text: 'Llevarlo a Azalea, con el Farfetch’d.', then: [
					{ text: 'Lo tomas con cuidado, como quien lleva un huevo. El Farfetch’d se pone a tu lado, con el puerro al hombro, sin quitarle los ojos de encima.' },
				] },
				{ text: 'Darle primero una baya, como al Fidough.', then: [
					{ text: 'Le acercas una Baya Aranja del arbusto más cercano. El Morelull la huele. No come. Pero, por un segundo, la punta de su sombrero se enciende, muy débil, como una luciérnaga que se despierta. Luego se apaga.' },
					{ text: 'Es poco. Pero es algo. El Farfetch’d grazna bajito, como si lo hubiera visto también.' },
					{ set: { 'flag.b02_morelull_baya': true } },
				] },
			] },
			{ quest: 'b02_s_farfetchd', stage: 'volver' },
		],
		b02_farfetchd_espera: [
			{ text: 'El hueco de la raíz está vacío. Solo quedan unas plumas marrones y la marca de un puerro clavado en la tierra. Carboncillo y el Morelull vienen contigo. Hay que volver a Azalea.' },
		],
		b02_farfetchd_vacio: [
			{ text: 'El claro de los leñadores, con el hacha clavada en el tronco. Ya no hay nadie de guardia.' },
		],
		b02_farfetchd_entrega: [
			{ say: 'aprendiz_carbon', text: '¡CARBONCILLO! —Corre, tropieza, se levanta, corre otra vez—. ¡Estás vivo! ¡Estás aquí! ¡Estás enfadado! ¡Estás bien!' },
			{ text: 'El Farfetch’d se deja abrazar con cara de estar soportando una gran injusticia. Luego le da un golpecito en la cabeza con el puerro. Es su forma de decir «yo también».' },
			{ text: 'El aprendiz ve el Morelull que llevas en las manos. Deja de sonreír.' },
			{ say: 'aprendiz_carbon', text: '¿Y ese? ¿Qué le pasa? Está… ¿Está apagado?' },
			{ text: 'Le cuentas lo del claro. Que Carboncillo no se perdió. Que se quedó de guardia.' },
			{ say: 'aprendiz_carbon', text: '…Siempre dice el jefe que este pájaro tiene más corazón que cabeza. Yo pensaba que era un insulto.' },
			{ say: 'aprendiz_carbon', text: 'Déjamelo. En el horno del carbón hace calor día y noche. Lo pongo en una caja con musgo, cerca del fuego, y Carboncillo le hace compañía. Ya se le ve dispuesto.' },
			{ text: 'Carboncillo se ha sentado junto al Morelull, con el puerro sobre las rodillas, como un guardia en su garita.' },
			{ if: 'flag.b02_morelull_baya', then: [
				{ text: 'Al dejarlo en las manos del aprendiz, la punta del sombrero del Morelull vuelve a encenderse. Un segundo. Azul y suave.' },
				{ say: 'aprendiz_carbon', text: '¡Lo he visto! ¡Ha brillado! ¡Jefe! ¡JEFE! ¡Ha brillado!' },
			] },
			{ say: 'aprendiz_carbon', text: 'Toma. Del horno de la carbonería, el mejor carbón de Johto. Dicen que hace que los ataques de fuego quemen más. A mí me quema los dedos, que también tiene mérito.' },
			{ give: 'charcoal' },
			{ money: 1500 },
			{ rep: { johto: 3 } },
			{ quest: 'b02_s_farfetchd', done: true },
		],
		b02_aprendiz_despues: [
			{ if: 'flag.b02_encinar_libre', then: [
				{ say: 'aprendiz_carbon', text: 'El Morelull ya brilla un poquito por las noches. Un poquito. Como una vela vieja. Carboncillo no se separa de él. El jefe dice que le estamos convirtiendo la carbonería en un hospital. Pero lo dice sonriendo.' },
			], else: [
				{ say: 'aprendiz_carbon', text: 'El Morelull sigue en su caja con musgo, junto al horno. No brilla, pero come un poquito. Carboncillo duerme de pie a su lado. El jefe ha dejado de preguntar.' },
			] },
		],

		// ================= 7. PUEBLO AZALEA =================
		b02_llegada_azalea: [
			{ set: { 'flag.b02_llegada_azalea': true } },
			{ text: 'Sales del bosque a una calle de tierra entre casas de madera oscura. Del horno del carbonero sube una columna de humo. En mitad de la calle, tumbado al sol, un Slowpoke te mira sin ninguna prisa.' },
			{ text: 'Una vecina barre la puerta de su casa. Cuando te ve, se le cae la escoba.' },
			{ say: 'vecina_azalea', text: '¡Ay, criatura! ¿Sales del Encinar? ¿Así, a pie? ¿Con esa cara? ¿Te has perdido?' },
			{ choice: [
				{ text: '«Un poco. Venía con la Gira Interregional.»', then: [] },
				{ text: '«¿Qué día es hoy?»', then: [{ say: 'vecina_azalea', text: 'Ay, Dios. Otro. Siéntate, que te traigo agua.' }] },
			] },
			{ say: 'vecina_azalea', text: '¿La Gira? ¿La de los novatos extranjeros? Pero si esa llegó a Ciudad Trigal hace tres días. Salió en la tele. Fuegos artificiales, discursos, una chica muy elegante con un sombrero…' },
			{ say: 'vecina_azalea', text: 'Bueno, tres días. Hoy hace tres días, ¿no? El martes. Sí. Hace tres días.' },
			{ say: 'rotom', text: '¡Bzzt! ¿Tres días? ¡Imposible! ¡Mi reloj dice que la ceremonia fue anoche! ¡Anoche! Mira, mira: —Su pantalla muestra la fecha. Parpadea. Cambia. Parpadea otra vez—. …Ah. Ya. Ahora dice que fue hace tres días. Se acaba de actualizar. Hola, reloj. Bienvenido de vuelta.' },
			{ text: 'Tres días. Lo piensas despacio. Te dormiste en la Puerta, despertaste en el claro, buscaste la salida y has salido. Para ti ha sido una tarde. Puede que una noche.' },
			{ text: 'Para el resto del mundo han pasado tres días. Y nadie sabe dónde has estado.' },
			{ text: '{riolu} te pone la pata en el brazo. No dice nada. Pero está ahí.', cond: LUCARIO },
			{ say: 'vecina_azalea', text: 'Pasa por el **Centro Pokémon**, que tienes cara de no haber comido en una semana. Y luego vete a ver a **Kurt**, el de las Poké Balls. Él sabe del Encinar más que nadie. Gruñe mucho, pero no muerde.' },
			{ quest: 'b02_m3', stage: 'reto' },
			{ rep: { johto: 1 } },
			{ diary: '¡Hoy dormimos en un bosque precioso! Se llama el Encinar y tiene un altar de madera chiquitito, una paleontóloga muy simpática que se cae mucho y un Pokémon verde que brillaba entre los árboles. ¡Creo que era Celebi! (Lo apunto con interrogación). Luego salimos a un pueblo lleno de Slowpoke. Mi reloj se había quedado dormido, pero ya se ha despertado. ¡Bzzt! Johto huele a carbón y a té.', cond: 'flag.b01_diario' },
		],
		b02_furgoneta: [
			{ set: { 'flag.b02_furgoneta': true } },
			{ text: 'Al salir a la calle, una furgoneta blanca está aparcando en la plaza, entre dos Slowpoke que no se apartan. En el lateral, una lemniscata azul y plata. Debajo: «**Gira Interregional · Asistencia al participante**».' },
			{ text: 'Bajan dos personas con chaleco azul. Una lleva una tableta. La otra, una foto. Se acercan a la vecina de la escoba.' },
			{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'Buenas tardes, señora. Estamos buscando a un novato de la Gira. Viaja con un Lucario. Se extravió en el traslado. ¿Lo ha visto por aquí?' },
			{ text: 'Desde donde estás, ves la foto. Eres tú. Es la foto de tu inscripción en el Circuito.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Nos buscan! ¡Qué bonito! ¿Cómo sabían que estábamos en Azalea, si ni nosotros lo sabíamos hace una hora?' },
			{ prompt: 'La vecina todavía no te ha señalado. Los de Lemnis miran hacia el otro lado.', choice: [
				{ text: 'Acercarte: «Soy yo».', then: [
					{ set: { 'flag.b02_furgoneta_presentado': true } },
					{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: '¡Ah! ¡Es usted! Qué alivio. —Toca la tableta—. Localizad{o|a|e}. Muy bien. Nos dijeron que estaría por aquí.' },
					{ choice: [
						{ text: '«¿Quién se lo dijo?»', then: [{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'Eh… El sistema. Lo pone aquí. —Te enseña la tableta. Solo pone «AZALEA» en letras grandes—. ¿Ve? El sistema.' }] },
						{ text: '«¿Dónde ha estado todo el mundo estos tres días?»', then: [{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'En Trigal. Esperándole. Bueno, esperar, esperar… La Gira ha seguido su programa. Pero le guardamos el sitio. Más o menos.' }] },
					] },
					{ if: 'flag.b01_trato_sera', then: [
						{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'La señorita Serafina ha preguntado por usted. Personalmente. Dos veces. Eso no lo hace con nadie.' },
					] },
					{ if: 'flag.b01_delatar', then: [
						{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'Y quiero que sepa que, a pesar de… sus declaraciones públicas en Crómlech, la empresa se preocupa por su bienestar. Lo pone en esta tarjeta. —Te la da. Es verdad: lo pone.' },
					] },
					{ if: 'flag.b01_handsome', then: [
						{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'Nos consta que tiene usted amigos en la Policía Internacional. Qué bien. Todo el mundo necesita amigos. Sobre todo cuando se pierde.' },
					] },
					{ if: '!flag.b01_trato_sera && !flag.b01_delatar && !flag.b01_handsome', then: [
						{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'La Gira no pierde a nadie. Lo pone en el folleto. Y usted no está perdid{o|a|e}: está en Azalea. Así que todo en orden.' },
					] },
					{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'Le llevaríamos a Trigal, pero la furgoneta no pasa por el Encinar. Dicen que hay niebla. Y la carretera de la costa está en obras. Tendrá que ir a pie. Le esperamos allí. Sin prisa. Bueno, con un poco de prisa.' },
					{ rep: { lemnis: 2 } },
				] },
				{ text: 'Esconderte detrás de un Slowpoke.', then: [
					{ set: { 'flag.b02_furgoneta_escondido': true } },
					{ text: 'Te agachas detrás del Slowpoke más grande de la plaza. No se mueve. No se entera. Es el escondite perfecto.' },
					{ text: 'La vecina mira hacia tu Slowpoke, te ve, y… se encoge de hombros.' },
					{ say: 'vecina_azalea', text: 'Un novato con un Lucario… No, hijo. Aquí solo hay Slowpoke. Y el que se esconde detrás de ese no cuenta.' },
					{ text: 'Uno de los asistentes saca el teléfono y se aleja unos pasos. Le oyes a medias.' },
					{ say: 'agente_lemnis', as: 'Asistente de la Gira', text: 'No, aquí no está… Sí, ya sé que dijeron que estaría aquí. Sí. Sí, señor. Esperaremos un poco más.' },
					{ text: 'Esperan. Toman un té en la plaza. Al cabo de una hora se suben a la furgoneta y se van por la carretera de la costa.' },
					{ say: 'rotom', text: '¡Bzzt! ¿Por qué nos hemos escondido? ¡Eran de la Gira! ¡Nos buscaban! ¡Es lo más bonito que nos ha pasado hoy! …Ya. Ya. Me callo. Pero que conste que no lo entiendo.' },
					{ rep: { lemnis: -1 } },
				] },
			] },
		],
		b02_anciano_1: [
			{ say: 'anciano_pozo', text: 'Trece. Catorce. Quince… —Te mira—. Ah, hola. Cuento Slowpoke. Llevo cuarenta años contándolos. Por las mañanas son ochenta y seis. Por las tardes, ochenta y seis.' },
			{ if: 'flag.b02_kurt_1', then: [
				{ say: 'anciano_pozo', text: 'Hoy son setenta y cuatro. Faltan doce. Faltan doce, y uno es el mío. Domingo. Llega tarde a todo. Pero nunca había llegado tan tarde.' },
				{ say: 'anciano_pozo', text: 'Kurt ha ido al pozo a gritarles. Kurt les grita a todos. A veces funciona.' },
			], else: [
				{ say: 'anciano_pozo', text: 'Hoy… a ver… setenta y cuatro. Tengo que haber contado mal. Doce Slowpoke no se van solos. Doce Slowpoke no hacen nada solos. Ni juntos.' },
			] },
		],
		b02_anciano_despues: [
			{ say: 'anciano_pozo', text: 'Ochenta y seis. Ochenta y seis por la mañana y ochenta y seis por la tarde. Como debe ser.' },
			{ text: 'A su lado, un Slowpoke con una bufanda de lana te mira. Bosteza. Tarda en terminar de bostezar casi un minuto.' },
			{ say: 'anciano_pozo', text: 'Domingo te ha tomado cariño. Se nota porque te ha mirado. No mira a casi nadie.' },
		],
		b02_nino_azalea: [
			{ say: 'nino_azalea', text: 'Ayer era mañana.' },
			{ choice: [
				{ text: '«¿Cómo que ayer era mañana?»', then: [
					{ say: 'nino_azalea', text: 'Ayer fui al Encinar a buscar Bonguris y me acordaba de cosas que todavía no habían pasado. Que mi madre se iba a cortar el pelo. Que se iba a caer la valla del huerto. Hoy mi madre se ha cortado el pelo y la valla se ha caído.' },
					{ say: 'nino_azalea', text: 'Mi madre dice que es casualidad. Pero yo me acuerdo de mañana. Y mañana tú vas a ir al pozo.' },
				] },
				{ text: '«Ya. A mí me han desaparecido tres días.»', then: [
					{ say: 'nino_azalea', text: '¿Ves? Alguien se los ha llevado. Seguro que los tiene el bosque. El bosque se queda con las cosas. Con los días también.' },
				] },
			] },
		],

		// ================= 8. KURT =================
		b02_kurt_1: [
			{ set: { 'flag.b02_kurt_1': true } },
			{ text: 'Un anciano bajito, con gafas redondas y un bigote blanco que le tapa la boca, talla un Bonguri con una navaja. No levanta la vista.' },
			{ say: 'kurt', text: 'Si vienes por una Ball, no tengo. Si vienes por un Bonguri, no vendo. Si vienes por un autógrafo, vete.' },
			{ choice: [
				{ text: '«Vengo del Encinar. Del claro del altar.»', then: [
					{ text: 'Kurt deja de tallar. Te mira por encima de las gafas, de arriba abajo, muy despacio.' },
					{ say: 'kurt', text: 'Del santuario. ¿Y has salido? Hmpf. Hay quien entra y sale. Hay quien entra y sale una semana después. Y hay quien sale antes de haber entrado. A mi abuelo le pasó. Nunca se lo perdonó al bosque.' },
					{ say: 'kurt', text: 'El altar lo cuida el pueblo desde hace más años de los que tengo yo. Es del guardián del bosque. Si lo has visto, no lo cuentes en voz alta. No le gusta que se hable de él como si fuera un Bidoof cualquiera.' },
				] },
				{ text: '«¿Usted hace Poké Balls con Bonguris?»', then: [
					{ say: 'kurt', text: 'Hago Poké Balls con Bonguris desde antes de que tus padres supieran andar. Las de fábrica son de plástico. Las mías respiran. —Golpea la mesa—. Respiran, te digo.' },
				] },
			] },
			{ say: 'kurt', text: 'Los Bonguris crecen en árboles del Encinar y aquí, detrás de mi casa. Tráeme uno y te hago una Ball. Una por Bonguri. Ni una más. Y no me pidas prisa: la prisa se nota en la madera.' },
			{ text: 'Por la ventana se ve el pozo del pueblo. Kurt lo mira. Aprieta la navaja.' },
			{ say: 'kurt', text: 'Pero hoy no tallo. Hoy no. Faltan doce Slowpoke en el pueblo, y anoche había un camión junto al pozo. Y hombres de negro. Con una R en el pecho.' },
			{ say: 'kurt', text: 'Otra vez los de negro. Hace años bajaron al pozo a cortarles la cola a los Slowpoke para venderla. Los echamos. Dijeron que se habían disuelto. Ja. Las manchas de aceite tampoco se disuelven.' },
			{ say: 'kurt', text: 'Voy a bajar a decirles cuatro cosas. Tú quédate aquí, que eres de fuera y no tienes la culpa.' },
			{ text: 'Se levanta, toma un bastón que claramente no usa nunca y sale por la puerta. Por la ventana lo ves cruzar la plaza hacia el pozo, a paso de desfile.' },
			{ say: 'rotom', text: '¡Bzzt! «Quédate aquí», ha dicho. Lo apunto como sugerencia. No como orden. ¿Verdad que es una sugerencia?' },
			{ quest: 'b02_m2', stage: 'pozo' },
			{ intel: { npc: 'kurt', text: 'Artesano de Poké Balls de Azalea. Gruñón. Hace una Ball por cada Bonguri que le lleves. Los de negro con una R han vuelto al Pozo Slowpoke: faltan doce Slowpoke en el pueblo.' } },
		],
		b02_kurt_gracias: [
			{ set: { 'flag.b02_kurt_gracias': true } },
			{ text: 'Kurt está otra vez en su mesa, con un cojín en la silla y cara de dolor de espalda que no piensa admitir.' },
			{ say: 'kurt', text: 'Hmpf. Tú. {El|La|Le} de fuera. —Se aclara la garganta. Mucho rato—. El pueblo te debe una. Yo te debo… media. La otra media es de tu Pokémon azul.' },
			{ say: 'kurt', text: 'Toma. La hice anoche, con un Bonguri rojo del árbol de mi abuelo. Una **Nivel Ball**. Funciona mejor cuanto más fuerte es tu Pokémon frente al salvaje. No la pierdas. No la regales. No la uses con un Caterpie.' },
			{ give: 'levelball' },
			{ say: 'kurt', text: 'Y ya sabes: tráeme Bonguris y te hago más. Una por Bonguri. Ni una más.' },
		],
		b02_kurt_bonguri: [
			{ say: 'kurt', text: 'Bonguris. A ver qué traes. —Los mira uno por uno, los huele, los golpea con un nudillo—. Hmpf. Pasables. Elige uno.' },
			{ prompt: '¿Qué Bonguri le das a Kurt?', choice: [
				{ text: 'Bonguri Rojo → Nivel Ball', cond: 'has("redapricorn")', then: [{ take: 'redapricorn', n: 1 }, { give: 'levelball' }] },
				{ text: 'Bonguri Azul → Cebo Ball', cond: 'has("blueapricorn")', then: [{ take: 'blueapricorn', n: 1 }, { give: 'lureball' }] },
				{ text: 'Bonguri Amarillo → Luna Ball', cond: 'has("yellowapricorn")', then: [{ take: 'yellowapricorn', n: 1 }, { give: 'moonball' }] },
				{ text: 'Bonguri Verde → Amigo Ball', cond: 'has("greenapricorn")', then: [{ take: 'greenapricorn', n: 1 }, { give: 'friendball' }] },
				{ text: 'Bonguri Rosa → Amor Ball', cond: 'has("pinkapricorn")', then: [{ take: 'pinkapricorn', n: 1 }, { give: 'loveball' }] },
				{ text: 'Bonguri Blanco → Rapid Ball', cond: 'has("whiteapricorn")', then: [{ take: 'whiteapricorn', n: 1 }, { give: 'fastball' }] },
				{ text: 'Bonguri Negro → Peso Ball', cond: 'has("blackapricorn")', then: [{ take: 'blackapricorn', n: 1 }, { give: 'heavyball' }] },
				{ text: 'Mejor otro día.', then: [{ say: 'kurt', text: 'Hmpf. Mejor. Así no me haces trabajar.' }, { end: true }] },
			] },
			{ text: 'Kurt talla, lija, barniza y sopla. No te deja mirar. Cuando termina, te pone la Ball en la mano y te cierra los dedos encima.' },
			{ say: 'kurt', text: 'Respira. ¿Lo notas? Respira.' },
		],
		b02_kurt_generico: [
			{ if: 'flag.b02_encinar_libre', then: [
				{ say: 'kurt', text: 'Dicen que la niebla del norte se ha ido. Mi abuelo decía que esa niebla la pone el guardián cuando tiene miedo. Que la quita cuando se le pasa. Hmpf. Ojalá se le haya pasado.' },
			], else: [
				{ say: 'kurt', text: 'Sin Bonguris no hay Balls. Los árboles están en el Encinar y detrás de esta casa. No me mires así: sacudir un árbol no es tan difícil.' },
			] },
		],
		b02_kurt_foto: [
			{ text: 'Un Kurt joven, con todo el pelo y el mismo bigote, sostiene una Poké Ball de madera. Detrás de él, borroso, se ve el Encinar. Y, entre los árboles, una mancha verde que podría ser un defecto de la foto.' },
			{ text: 'Debajo, a lápiz: «Mi primera Ball. El guardián vino a mirar».' },
		],

		// ================= 9. POZO SLOWPOKE =================
		b02_pozo_entrada: [
			{ set: { 'flag.b02_pozo_entrada': true } },
			{ text: 'Bajas por la escalera de mano. Los peldaños están mojados y uno está roto, recién roto.' },
			{ text: 'Abajo, sentado en una caja de madera, con una mano en los riñones y la otra en el bastón, está Kurt.' },
			{ say: 'kurt', text: '…No digas nada. El peldaño estaba mal. Llevo cincuenta años bajando por esa escalera y el peldaño estaba mal. —Intenta levantarse. No se levanta—. La espalda. Se me ha ido la espalda.' },
			{ say: 'kurt', text: 'Ya que estás aquí… mira al fondo. Mira lo que han hecho.' },
			{ text: 'La cueva del pozo, que debería ser fresca y tranquila, está llena de focos de obra, cables y una pila de **cajas de madera** con agujeros. De dentro de las cajas salen bostezos. Muy lentos.' },
			{ text: 'Por todas partes hay gente de negro con una **R** roja en el pecho. Unos cargan cajas. Otros discuten con una libreta. Ninguno lleva uniforme nuevo: todos están remendados, desteñidos, con la R cosida a mano.' },
			{ if: 'flag.b01_bastien_ruta5', then: [
				{ text: 'Las cajas tienen una etiqueta pegada. Desde aquí no la lees. Pero la forma te suena. Rectangular, blanca, con letras negras. Como las de las jaulas de la Ruta 5, en Kalos.' },
			] },
			{ say: 'kurt', text: 'Ve tú. Yo no puedo. Pero si te cansas, vuelve aquí. Tengo una bolsa de hierbas y mucha mala leche: con eso se cura cualquiera.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Team Rocket! ¡Mis registros dicen que se disolvió hace años! ¡Mis registros dicen muchas cosas últimamente que no son verdad! Voy a tener que revisar mis registros.' },
		],
		b02_kurt_pozo: [
			{ say: 'kurt', text: 'Siéntate. Respira. Bebe. No hables. —Saca una bolsa de hierbas que huele a menta y a regaliz y la pasa por encima de tu equipo como quien pasa un incensario—. Ya está. Hierbas de Azalea. Mejor que cualquier máquina.' },
			{ heal: true },
			{ say: 'kurt', text: 'Y si ves al de pelo verde, al que manda, no le hagas caso. Habla mucho. Los que hablan mucho tienen miedo.' },
		],
		b02_pozo_cajas: [
			{ set: { 'flag.b02_pozo_cajas': true } },
			{ text: 'Te acercas a las cajas. Por los agujeros asoman hocicos rosas. Un Slowpoke te mira desde dentro con la misma calma de siempre, como si estar en una caja fuera solo otra forma de estar tumbado.' },
			{ text: 'Cada caja lleva una etiqueta rectangular, blanca, con letras negras:' },
			{ text: '«**FUNDACIÓN RAÍCES DE JOHTO** · *Devolviendo a cada Pokémon a su lugar* · Destino: **por asignar**».' },
			{ if: 'flag.b01_bastien_ruta5', then: [
				{ text: '«Destino: por asignar». Lo has leído antes. En las jaulas de la Ruta 5, en Kalos, con un Wooloo dentro, y un Skwovet, y algo pequeño que temblaba bajo una manta.' },
				{ text: '{riolu} también lo ha visto. Tiene el pelo erizado desde la nuca hasta la cola.', cond: LUCARIO },
			] },
			{ text: 'Una de las cajas tiene pegado, además, un albarán plastificado. Lo arrancas.' },
			{ give: 'albaranraices' },
			{ say: 'rotom', text: '¿Fundación Raíces de Johto? Bzzt… Buscando… Organización benéfica. Registrada hace ocho meses. Sede: un apartado de correos en Ciudad Trigal. Patronos: «confidencial». Presupuesto: «confidencial». Qué fundación tan tímida.' },
		],
		b02_pozo_cajas_generico: [
			{ text: 'Las cajas siguen apiladas. Desde dentro, alguien bosteza. Tarda un minuto entero.' },
		],
		b02_proton: [
			{ text: 'Al fondo del pozo, junto a la charca grande, un hombre de pelo verde y sonrisa fina da órdenes a gritos. Lleva el uniforme más nuevo de todos: el único sin remiendos.' },
			{ say: 'proton', as: 'Hombre del pelo verde', text: '¡Más rápido! ¡Son Slowpoke, no son de cristal! Bueno, son de cristal, pero no se rompen. ¿O sí? Me da igual. ¡Más rápido!' },
			{ text: 'Uno de los reclutas tropieza con una caja. El Slowpoke de dentro rueda, despacio, sin quejarse.' },
			{ say: 'proton', as: 'Hombre del pelo verde', text: 'Si se te cae otra, la próxima caja la llenas tú. —El recluta agacha la cabeza—. Eso. Agacha la cabeza. Es lo que mejor hacen todos ustedes.' },
			{ text: 'Te ve. Sonríe más. No es una sonrisa bonita.' },
			{ say: 'proton', text: 'Vaya, vaya. Una visita. Protón, admin del Team Rocket. El más cruel de todos, dicen. No me gusta presumir. Me gusta que lo digan.' },
			{ intel: { npc: 'proton', text: 'El Team Rocket ha vuelto al Pozo Slowpoke de Azalea. Esta vez no cortan colas: meten a los Slowpoke en cajas de madera. Sus uniformes son viejos y remendados.' } },
			{ say: 'proton', text: '¿Vienes a por los Slowpoke? Qué tierno. Son mercancía. Doce unidades. Pagadas por adelantado. —Golpea una caja con el pie—. Y la mercancía no se devuelve.' },
			{ choice: [
				{ text: '«¿Quién les paga?»', then: [
					{ say: 'proton', text: 'Una fundación muy buena. Muy generosa. Nos deja el dinero en un apartado de correos y no hace preguntas. Ojalá todo el mundo fuera así.' },
				] },
				{ text: '«¿Para qué quieren a doce Slowpoke?»', then: [
					{ say: 'proton', text: 'Yo no los quiero para nada. Huelen a charca y no hacen nada. Los quiere el que paga. Y el que paga, manda. Eso lo aprendí del jefe.' },
				] },
				{ text: '«Los reclutas te tienen miedo.»', then: [
					{ say: 'proton', text: 'Claro. Es lo único que funciona. El cariño no paga deudas.' },
				] },
			] },
			{ text: 'Mira a sus reclutas, que cargan cajas con los uniformes remendados. Por un segundo, solo un segundo, la sonrisa se le va.' },
			{ say: 'proton', text: '¿Sabes cuántos se quedaron tirados cuando el jefe se fue? Doscientos doce. Sin sueldo. Sin casa. Con la R tatuada, cosida, metida en el currículum. Yo me sé los nombres. Los doscientos doce.' },
			{ say: 'proton', text: 'Cada caja paga una deuda. Cada deuda devuelve a uno a casa. La familia vuelve a estar junta. —La sonrisa vuelve, más fina—. Y si para eso hay que meter a un pueblo entero en cajas, lo meto. Y a ti detrás.' },
			{ text: 'Patea la caja más cercana. Se abre. El Slowpoke de dentro rueda hacia la charca, demasiado despacio para apartarse, justo hacia donde el Weezing de Protón empieza a soltar gas.' },
			{ if: LUCARIO, then: [
				{ text: 'Antes de que puedas abrir la boca, {riolu} ya no está a tu lado.' },
				{ text: 'Está delante del Slowpoke. Con las palmas juntas. Una esfera de luz azul le crece entre las manos, tan intensa que las charcas del pozo se iluminan desde dentro y el techo se llena de reflejos.' },
				{ text: 'La lanza. No al Weezing: a la nube. La Esfera Aural atraviesa el gas y lo parte en dos, como una cortina, y el Slowpoke queda en medio, en un pasillo de aire limpio, mirando a {riolu} con la misma cara de siempre.' },
				{ text: '{riolu} se gira hacia Protón. No gruñe. No hace falta. Su aura brilla alrededor de todo su cuerpo, firme, como una llama que no tiembla.' },
				{ say: 'proton', text: '…Interesante bicho. A ese sí que le pondría una etiqueta.' },
				{ happy: { who: 'riolu', n: 10 } },
			], else: [
				{ text: 'Te lanzas a por el Slowpoke y lo apartas de la nube justo a tiempo. Pesa una barbaridad. Te mira con cara de agradecimiento. O de sueño. Es difícil distinguirlo.' },
			] },
			{ battle: 'proton_1', onWin: [
				{ say: 'proton', text: 'Bah. Doce Slowpoke. Doce deudas. Ya encontraré otras doce. Siempre hay otro pueblo y otra fundación con ganas de pagar.' },
				{ say: 'proton', text: '¡Recojan! ¡Nos vamos! ¡Las cajas no, inútiles, las cajas se quedan! ¡Si no hay mercancía, no hay entrega, y si no hay entrega, no hay cajas que valgan!' },
				{ text: 'Los reclutas recogen focos y cables a toda prisa. La que se llamaba a sí misma «la Tercera» pasa a tu lado y, sin mirarte, abre de una patada la cerradura de una caja que tenía un candado de más.' },
				{ say: 'recluta_rocket_f', as: 'La Tercera', text: 'Esa estaba mal cerrada. Lo digo por si alguien pregunta.' },
				{ text: 'Protón sube el último por la escalera de mano. Al pasar junto a Kurt, que sigue sentado con la espalda hecha polvo, se para.' },
				{ say: 'proton', text: 'Abuelo.' },
				{ say: 'kurt', text: 'Mocoso.' },
				{ text: 'Protón desaparece por la boca del pozo. Kurt escupe hacia la escalera. Falla por mucho.' },
				{ set: { 'flag.b02_pozo_hecho': true } },
				{ call: 'b02_pozo_rescate' },
			] },
		],
		b02_pozo_rescate: [
			{ text: 'Abres las cajas una a una. Los Slowpoke salen despacio. Muy despacio. Algunos ni salen: se quedan dentro, cómodos, y hay que sacarlos tirando con cuidado.' },
			{ text: 'Doce Slowpoke. Doce. Los cuentas dos veces.' },
			{ text: 'Uno de ellos, el más grande, lleva un collar de lana con un nombre bordado: «Domingo». Te sigue. No muy deprisa, pero te sigue.' },
			{ text: 'Cuando subes por la escalera de mano, con Kurt apoyado en tu hombro, quejándose a cada peldaño, Domingo sube detrás. Nadie sabe cómo. Los Slowpoke no suben escaleras.' },
			{ text: 'Arriba, en la plaza, medio pueblo está esperando. El anciano del banco cuenta en voz alta: «…diez, once, doce». Se le quiebra la voz en el doce.' },
			{ say: 'anciano_pozo', text: '¡Domingo! ¡DOMINGO! —Domingo lo mira. Bosteza. Tarda en terminar de bostezar casi un minuto—. Llegas tarde. Llegas tardísimo. Ven aquí.' },
			{ text: 'Domingo no va. Se sienta a tu lado y apoya la cabeza en tu pierna. Pesa como un saco de cemento caliente.' },
			{ say: 'anciano_pozo', text: '…Vaya. Te ha elegido. Un rato, nada más, no te ilusiones. Domingo elige a alguien cada diez años. Luego se le olvida.' },
			{ if: 'flag.b02_furgoneta', then: [
				{ text: 'Junto a la boca del pozo, en el barro, hay marcas de neumáticos recientes. Las de un camión grande, que ya se fue. Y otras más finas, de furgoneta, que llegan hasta el borde y dan la vuelta. Nadie del pueblo tiene coche.' },
			] },
			{ text: 'Entre la gente aparece corriendo un chico de pelo violeta, con una red de cazar bichos en una mano y una lupa en la otra. Se para delante de ti, sin aliento.' },
			{ say: 'anton', text: '¡Has sido tú! ¡Me lo han contado por el camino! Perdona, soy Antón, el líder del gimnasio. Estaba buscando Slowpoke en el bosque. En el bosque no había ninguno. Ahora entiendo por qué.' },
			{ say: 'anton', text: 'Gracias. De verdad. Abro el gimnasio ahora mismo. Bueno, en cuanto encuentre las llaves. Están en algún bolsillo. Tengo muchos bolsillos.' },
			{ say: 'anton', text: 'Una cosa, ya que estamos: ¿has pasado por el norte del Encinar? Mis bichos no quieren acercarse. Hay una niebla que no se levanta, y los Spinarak dejan de tejer cuando están cerca. Nunca había visto a un Spinarak dejar de tejer.' },
			{ rep: { johto: 5 } },
			{ quest: 'b02_m2', stage: 'niebla' },
			{ intel: { npc: 'proton', text: 'Protón, admin del Team Rocket. Cruel con los Slowpoke y con sus propios reclutas. Dice que «cada caja paga una deuda» y que se sabe los nombres de los doscientos doce reclutas que quedaron tirados tras la disolución. Les paga la «Fundación Raíces de Johto».' } },
			{ intel: { npc: 'anton', text: 'Líder de Azalea (Bicho). Investigador entusiasta y despistado. Dice que sus bichos no quieren acercarse a la niebla del norte del Encinar.' } },
			{ diary: 'Hoy rescatamos a doce Slowpoke del pozo de Azalea. ¡Doce! Los contamos dos veces. Había unos señores de negro con una R que los metían en cajas, pero {riolu} les dio una lección con una esfera azul preciosa. El señor Kurt se hizo daño en la espalda y aun así gritó muchísimo. Un Slowpoke que se llama Domingo nos ha elegido. Pesa un montón. ¡Bzzt! Johto me gusta.', cond: 'flag.b01_diario' },
			{ go: 'azalea' },
		],
		b02_pozo_slowpoke: [
			{ text: 'Los Slowpoke han vuelto a sus charcas. Uno mete la cola en el agua, muy despacio, como si pescara. No pesca nada. No parece importarle.' },
			{ text: 'En un rincón queda una etiqueta mojada, pegada a una piedra: «Destino: por asignar». Nadie ha querido tocarla.' },
		],

		// ================= 10. GIMNASIO DE AZALEA =================
		b02_gym_red: [
			{ set: { 'flag.b02_gym_red': true } },
			{ text: 'De lado a lado del pasillo cuelga una cortina de telarañas. Cientos de hilos plateados, cruzados en todas direcciones. En el centro, una Spinarak del tamaño de un puño te mira con sus ojos pintados en la espalda.' },
			{ say: 'anton', text: '¡Hola! ¡Bienvenid{o|a|e}! No toques los hilos, que se enfada. Esa es Hebra. Nació aquí, en el gimnasio. Empezó siendo la más pequeña de su puesta y ahora es la que manda en toda la red. Va subiendo. Poco a poco. Como todo el mundo.' },
			{ say: 'anton', text: 'La regla del gimnasio: solo puedes pasar por el hilo que vibra. Hebra hace vibrar uno, uno solo, y cambia cada vez. Si tocas otro… bueno, te quedas pegad{o|a|e} un rato. A mí me pasó la semana pasada. Tres horas.' },
			{ text: 'Miras la red. Todos los hilos tiemblan un poco con el aire del invernadero. Todos parecen vibrar. Ninguno parece vibrar.' },
			{ if: LUCARIO, then: [
				{ text: '{riolu} se pone a tu lado y cierra los ojos. Los apéndices de su cabeza se levantan. Durante un momento no pasa nada.' },
				{ text: 'Luego levanta una pata y señala un hilo, uno solo, a la izquierda, casi en el suelo. Lo tocas. Vibra bajo tus dedos como una cuerda de guitarra. Los demás hilos se apartan, despacio, y se abre un pasillo en la red.' },
				{ say: 'anton', text: '¡Oh! ¡OH! ¡Lo ha sentido! ¡Ha sentido la vibración! ¡Los Lucario perciben el aura, pero no sabía que también…! Tengo que apuntar esto. ¿Me prestas a tu Lucario una semana? Es broma. No es broma. Un poco broma.' },
			], else: [
				{ text: 'Te agachas y miras la red a contraluz, muy de cerca. Uno de los hilos, a la izquierda, casi en el suelo, tiembla a un ritmo distinto. Lo tocas. Vibra bajo tus dedos. Los demás se apartan y se abre un pasillo en la red.' },
				{ say: 'anton', text: '¡Muy bien! ¡Paciencia y observación! Eso es lo primero que hay que tener con los bichos. Lo segundo, guantes.' },
			] },
			{ text: 'Al otro lado de la red te esperan los entrenadores del gimnasio. Y al fondo, junto a unos troncos huecos, Antón ha vuelto a su lupa.' },
		],
		b02_anton_espera: [
			{ say: 'anton', text: '¿Sabías que un Scyther puede cortar una hoja cayendo sin que la hoja se entere? Yo tampoco me lo creía. Lo vi. Bueno, no lo vi: fue muy rápido. Pero la hoja estaba cortada.' },
			{ say: 'anton', text: 'Primero, mis dos entrenadores. Es la norma. No la puse yo, pero me gusta: así llegas con los datos frescos.' },
		],
		b02_anton_reto: [
			{ text: 'Antón guarda la lupa en uno de sus muchos bolsillos. Tarda en encontrar el bolsillo.' },
			{ say: 'anton', text: '¡Has llegado! Hebra te dejó pasar, Fermín y Rocío también. Eso quiere decir que tienes buen ojo. O buen equipo. O las dos cosas. Me encantan las dos cosas.' },
			{ say: 'anton', text: 'Te cuento algo antes de empezar, porque si no se me olvida. Llevo semanas observando a los bichos del Encinar. Algo les pasa. Los Spinarak tejen redes más pequeñas. Los Ledyba no salen de los troncos. Los Pineco se cierran y no se abren.' },
			{ if: 'flag.b02_apagados', then: [
				{ text: 'Le cuentas lo del claro. El Fidough, el Pachirisu. Los ojos sin brillo.' },
				{ say: 'anton', text: '…Apagados. —Se le borra la sonrisa—. Sí. Esa es la palabra. Hace diez días encontré un Spewpa de Kalos en un tronco. Igual. Con los ojos abiertos y sin nada dentro. Lo tengo en el invernadero de atrás, al calor.' },
				{ say: 'anton', text: 'Los bichos lo notan antes que nadie. Son pequeños, y lo pequeño nota antes lo que falta. Si a ellos les falta algo… a lo mejor luego nos falta a todos.' },
			] },
			{ say: 'anton', text: 'Pero bueno. ¡Datos, ciencia y alas! Llevo toda la semana deseando un combate que me haga pensar. ¡Vamos allá!' },
			{ battle: 'anton_g4', onWin: [
				{ say: 'anton', text: 'Fascinante. Has leído a mis bichos como un libro. Un libro con muchas patas.' },
				{ badge: 'medalla_colmena' },
				{ cap: 40 },
				{ say: 'anton', text: 'La **Medalla Colmena**. Con esta llevas cuatro del Circuito. Cuatro. ¡Como las alas de un Yanmega! Bueno, un Yanmega tiene cuatro alas y dos más pequeñas. Pero cuatro es un buen número.' },
				{ say: 'anton', text: 'Y toma esto también: **MT Tijera X**. Cruzar las garras como unas tijeras. Mi Scizor la aprendió mirando cortar a un sastre de Trigal. Te lo juro. Tengo fotos.' },
				{ give: 'mt_tijerax' },
				{ quest: 'b02_m3', done: true },
				{ if: '!flag.b02_encinar_libre', then: [
					{ say: 'anton', text: 'Y, oye: si vas hacia Trigal, tendrás que cruzar el norte del Encinar. La niebla. Mis bichos no entran. Pero tu Lucario… tu Lucario ha visto un hilo que yo no veía. A lo mejor también ve un camino.' },
				] },
				{ heal: 'Antón saca de un bolsillo un frasco de néctar de Combee y lo reparte entre tu equipo. «Del invernadero de atrás», dice. «No preguntes la receta: tiene bichos». Tu equipo se recupera.' },
				{ intel: { npc: 'anton', text: 'Encontró hace diez días un Spewpa de Kalos «apagado», igual que los desplazados del claro. Dice que los bichos notan antes que nadie «lo que falta».' } },
			] },
		],
		b02_anton_despues: [
			{ say: 'anton', text: 'El Spewpa del invernadero ha comido hoy un poquito de hoja. Un poquito. Lo he apuntado con letras grandes.' },
			{ if: 'flag.b02_encinar_libre', then: [
				{ say: 'anton', text: 'Y desde que se fue la niebla, los Spinarak vuelven a tejer redes grandes. Hebra ha hecho una con forma de… no sé. De garra. Como si quisiera dar las gracias a alguien.' },
			] },
		],

		// ================= 12. LA NIEBLA =================
		b02_niebla: [
			{ if: NIEBLA_LISTA, then: [{ call: 'b02_niebla_escena' }], else: [
				{ text: 'Entras en la niebla. Caminas un rato largo, recto, sin desviarte. Y sales… por el mismo árbol, con la misma marca de tiza en la corteza.' },
				{ if: 'flag.b02_celebi_visto && !flag.b02_pozo_hecho', then: [
					{ say: 'rotom', text: '¡Bzzt! Otra vez el mismo árbol. Mis mapas dicen que esto es imposible. Mis mapas dicen que mejor volvamos a Azalea, que allí por lo menos el árbol cambia.' },
				] },
				{ if: 'flag.b02_pozo_hecho && !badge("medalla_colmena")', then: [
					{ text: '{riolu} se queda mirando la niebla con los ojos entornados, como quien intenta leer algo escrito muy pequeño. Todavía no lo consigue.', cond: LUCARIO },
					{ say: 'rotom', text: '¡Bzzt! Antón dijo que sus bichos no entran aquí. Y tú todavía no tienes su medalla. No digo que tenga que ver. Digo que yo, en tu lugar, iría al gimnasio. Por si acaso.' },
				] },
			] },
		],
		b02_niebla_escena: [
			{ text: 'La niebla te llega al pecho. Blanca, quieta, espesa como leche. Por mucho que camines, al final siempre aparece la misma encina con las mismas cruces de tiza.' },
			{ say: 'petra', text: '¡Espera! ¡Espérame! ¡{jugador}! —Llega corriendo por el sendero, con un cubo en cada mano y Pala detrás. Tropieza con una raíz. No se cae. Se sorprende tanto de no caerse que se cae—. …Ya estoy. Hola.' },
			{ say: 'petra', text: 'Me han dicho en el pueblo que vas hacia Trigal. Y que la niebla no deja pasar. Llevo dos días midiéndola. Bueno, dos días, o lo que sea. He traído datos. Los datos dicen: «no se puede».' },
			{ text: 'Por detrás de las encinas aparece una bufanda de rayas. Luego, mucho después, su dueño, con una taza de té en la mano.' },
			{ say: 'viajero', text: '¡Hola, hola! ¿Es martes? Da igual. He oído la palabra «datos» y he venido a llevar la contraria. La niebla sí se puede cruzar. Lo que pasa es que no por donde miran.' },
			{ say: 'petra', text: '¿Y por dónde hay que mirar, a ver?' },
			{ say: 'viajero', text: 'Por donde no hay. Esta niebla no esconde un sitio. Esconde un momento. El camino está, pero está un poquito antes, o un poquito después. Hace falta alguien que vea cosas que no están en el ahora.' },
			{ text: 'Petra y Ulises se giran a la vez. Hacia {riolu}.' },
			{ if: LUCARIO, then: [
				{ text: '{riolu} ya está mirando la niebla. Lleva un rato mirándola. Los apéndices de su cabeza se han levantado solos.' },
				{ text: 'Da un paso. Otro. Se detiene en el borde de la niebla, cierra los ojos y junta las palmas delante del pecho, como hizo delante del altar.' },
			], else: [
				{ text: 'Tu compañero da un paso hacia la niebla. Se detiene en el borde, cierra los ojos y junta las palmas delante del pecho.' },
			] },
			{ cutscene: { weather: 'fog', bg: { type: 'forest', fog: true }, start: 'dark', frames: [
				{ cam: 'still', text: 'Silencio. Ni pájaros. Ni viento. Ni tictac.' },
				{ fx: ['glow', 'ripple'], mon: '{riolu}', text: 'Una luz azul empieza a brillar entre sus palmas. No es una Esfera Aural. Es más suave. Más ancha. Se extiende como el agua cuando tiras una piedra.' },
				{ cam: 'pan-left', fx: 'light', text: 'Y en la niebla, donde toca la luz, aparece un camino. No delante: un poco a la izquierda, un poco torcido, como si alguien lo hubiera dejado ahí hace mucho y luego lo hubiera olvidado.' },
				{ weather: 'leaves', fx: 'zoom', text: 'Huellas en el barro. Pequeñas, de tres dedos, de algo que caminaba deprisa. Y, sobre ellas, unas hojas verdes que no caen: flotan, señalando el camino, una detrás de otra.' },
				{ weather: 'none', cam: 'pull', fx: 'flash', clear: true, text: 'La niebla se abre como una cortina. Detrás hay bosque. Bosque normal. Y, al fondo, la luz de la tarde sobre una pradera.' },
			] } },
			{ text: 'La niebla se retira entre los árboles, despacio, sin prisa, como quien se aparta para dejar pasar. En la encina de las cruces, {riolu} pasa la garra por la corteza y deja una marca pequeña. Su firma.' },
			{ set: { 'flag.b02_encinar_libre': true } },
			{ say: 'rotom', text: '¡Bzzt! ¡Camino detectado! ¡Y mi reloj…! Mi reloj marca las 11:15. Las 11:16. ¡Las 11:16! ¡Anda! ¡Anda solo! ¡Nunca me había alegrado tanto de que pasara un minuto!' },
			{ say: 'petra', text: 'Pala. Pala, apunta. Pala, no sabes escribir. —Saca la libreta. Se le cae. Pala la atrapa al vuelo—. Gracias, Pala. «11:16. El tiempo vuelve a pasar. Causa: un Lucario muy educado».' },
			{ text: 'Ulises mira las huellas pequeñas de tres dedos en el barro del camino. Se agacha. Las toca con la punta de los dedos.' },
			{ say: 'viajero', text: 'Lo que se esconde mucho tiempo acaba olvidando cómo salir. Alguien tiene que ir a buscarlo. Y no gritarle.' },
			{ say: 'viajero', text: '…Eso ha sido serio, ¿verdad? Perdón. Se me escapa. ¡Ya está, ya pasó!' },
			{ text: 'Desde el otro lado de los árboles llega un ruido: un acordeón enorme que respira hondo, una vez, dos, y se atraganta.' },
			{ say: 'viajero', text: '¡Mi cabina! ¡Ha arrancado! ¡Bueno, ha tosido! ¡Toser es arrancar con dudas!' },
			{ say: 'petra', text: 'Oye. Espera. Antes de irte. —Ulises se para—. ¿El ámbar? ¿Sabes lo que es? Dímelo. Una vez. Sin nudos.' },
			{ text: 'Ulises abre la boca. La cierra. Mira el ámbar, o el bolsillo donde lo guardas. Por primera vez parece que va a contestar algo de verdad.' },
			{ say: 'viajero', text: 'Es un recuerdo. De algo que todavía no ha pasado. Guárdalo bien. Que no lo vea nadie con…' },
			{ say: 'petra', text: '…¿Con corbata?' },
			{ say: 'viajero', text: '¡Exacto! ¿Cómo lo sabes? ¡Da igual! ¡Adiós! ¡Hasta antes! ¡Quiero decir, hasta luego!' },
			{ text: 'Echa a correr entre los árboles. La bufanda se queda enganchada en una rama. Vuelve, la desengancha, te guiña un ojo y se va otra vez.' },
			{ text: 'Al rato, el acordeón respira hondo una vez más, larga, satisfecha, y se va apagando. Donde estaba la cabina, entre dos encinas, queda un cuadrado de musgo aplastado. Y una taza de té, todavía caliente.' },
			{ say: 'petra', text: '…Se ha dejado la taza. —La toma. No se le cae—. Me la quedo. Como prueba. Ni idea de qué, pero como prueba.' },
			{ say: 'petra', text: 'Yo me quedo en el Encinar un tiempo. Hay que medir cómo se desatasca un bosque. Nadie lo ha medido nunca. Y alguien tiene que cuidar del Pachirisu. Pala ya le está haciendo una madriguera.' },
			{ say: 'petra', text: 'Toma. Para ti. Lo hice anoche, mientras esperaba. O hace tres noches. Da igual.' },
			{ cutscene: { bg: { type: 'forest' }, frames: [
				{ actors: [{ id: 'petra', at: 'left' }], on: '_c', item: 'bocetosantuario', text: 'Petra te da una hoja de libreta doblada en cuatro. La desdoblas.' },
				{ actors: [{ key: 'petra', dim: true }, { key: '_c', size: 'l' }], fx: 'glow', text: 'Es el Santuario. El altar de madera con su tejado de musgo, las encinas enormes, el reloj de bolsillo colgando de la rama. Lápiz y un poco de acuarela verde.' },
				{ fx: 'light', text: 'Y en el aire, sobre el altar, unas hojas que caen hacia arriba. Abajo, con letra torcida: «Para que no se te olvide que fue verdad».' },
			] } },
			{ give: 'bocetosantuario' },
			{ say: 'petra', text: 'No soy muy buena dibujando. Pero las capas de tierra me salen muy bien. Fíjate en las capas. Esas sí son verdad.' },
			{ choice: [
				{ text: '«Cuídate, Petra. Y no te caigas mucho.»', then: [{ say: 'petra', text: 'Me caeré lo justo. Lo justo para encontrar algo. Siempre encuentro cosas cuando me caigo. Es mi método científico.' }] },
				{ text: '«¿Volveremos a vernos?»', then: [{ say: 'petra', text: 'Claro. Tú tienes mi ámbar. Y yo tengo… —mira la taza— …la taza de un hombre raro. Tenemos que comparar datos.' }] },
			] },
			{ text: 'Petra se vuelve por el sendero, hacia el claro, con un cubo en cada mano y la taza en el bolsillo del chaleco. Se cae una vez antes de perderse de vista. Pala la levanta sin mirar.' },
			{ quest: 'b02_t_ambar', stage: 'abierto', done: true },
			{ quest: 'b02_t_cabina', stage: 'abierto', done: true },
			{ quest: 'b02_m2', done: true },
			{ quest: 'b02_m4', stage: 'ruta34' },
			{ rep: { johto: 2 } },
			{ intel: { npc: 'petra', text: 'Se queda en el Encinar «midiendo cómo se desatasca un bosque» y cuidando del Pachirisu apagado. Se quedó la taza de té de Ulises «como prueba».' } },
			{ intel: { npc: 'viajero', text: 'Dijo que el ámbar «es un recuerdo de algo que todavía no ha pasado». En el camino de la niebla había huellas pequeñas de tres dedos. «Lo que se esconde mucho tiempo acaba olvidando cómo salir».' } },
			{ diary: 'Hoy {riolu} abrió un camino en la niebla. ¡Con luz azul! Petra lo apuntó en su libreta: «causa: un Lucario muy educado». Me encanta esa frase. El señor de la bufanda se fue en su cabina azul y se dejó una taza. Y mi reloj vuelve a andar. Tic, tac. ¡Qué sonido tan bonito! Mañana, Ciudad Trigal. ¡Vamos un poquito tarde, pero vamos! ¡Bzzt!', cond: 'flag.b01_diario' },
		],
		b02_cabina_generico: [
			{ text: 'Una cabina de madera azul, con un farolillo encima y ventanitas en la puerta, encajada entre dos encinas como si alguien la hubiera metido a presión.' },
			{ text: 'Está cerrada. Por debajo de la puerta sale un hilo de vapor que huele a té. Dentro, algo hace tictac. Muy despacio. Más despacio que cualquier reloj.' },
			{ text: 'Pegada en la puerta hay una nota: «VUELVO ENSEGUIDA (O ANTES). NO EMPUJAR. YA HE EMPUJADO YO. — U.».' },
		],
		b02_cabina_vacia: [
			{ text: 'Entre dos encinas, un cuadrado de musgo aplastado. Ni cabina ni nota. Solo un hilo de bufanda enganchado en la corteza.' },
		],
	},
};
