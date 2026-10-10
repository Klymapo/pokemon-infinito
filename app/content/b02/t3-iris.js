// Bloque 2 · Tramo 3: «Ecos bajo la torre».
// Rutas 36 y 37 (Sudowoodo) → Ciudad Iris (Teatro de Danza, Kaori, Gimnasio de Morti, Torre Quemada y su sótano:
// Atenea y Melia, la gran decisión del fragmento) → Ruta 42 → rancho de Don Aurelio → final del bloque.

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = 'inParty("riolu") || inParty("lucario")';
const CHISPITA_FUERA = 'flag.b01_mareep_lemnis && !flag.b01_mareep_jaula';
const TRATO = 'flag.b01_trato_sera';
// Ingredientes de los dulces de Iris (los que pide Gaspar en Trigal, T2): Miel, Bonguri Rosa y Leche Mu-mu.
const GASPAR_TODO = 'has("honey") && has("pinkapricorn") && has("moomoomilk")';
// La investigación del Teatro: las tres pistas, o los Caramelos Lazo + la caja.
const PISTAS_OK = '(flag.b02_pista_kimono && flag.b02_pista_almacen && flag.b02_pista_caja) || (flag.b02_kaori_caramelo && flag.b02_pista_caja)';
const SOTANO_OK = 'quest.b02_m5 == "torre" || quest.b02_m5 == "decision" || flag.b02_torre_hecha';
const RECLUTAS_OK = 'beat("rocket_torre_1") && beat("rocket_torre_2") && beat("rocket_torre_3")';
// El final necesita la medalla de Morti, el arco de la Torre y la visita al rancho.
const FINAL_OK = 'beat("morti_g5") && flag.b02_torre_hecha && flag.b02_rancho_hecho && !flag.b02_fin';

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== RUTAS 36 Y 37 ===================
		ruta36: {
			name: 'Rutas 36 y 37', short: 'Rutas 36-37', region: 'johto', kind: 'route', map: { x: 40, y: 28 },
			bg: { type: 'route', flowers: '#e0703a', far: '#c98a5a' },
			desc: 'El camino sale del Parque Nacional hacia el este y luego tuerce al norte, entre arces que empiezan a ponerse rojos. Al fondo, por encima de los árboles, dos torres: una **negra y rota**, otra **alta y dorada**.\n\nLos carteles de la Gira cuelgan de los postes: «Próxima parada: **Ciudad Iris**. Tradición y vanguardia, de la mano de Lemnis».',
			descNight: 'De noche, la Ruta 37 huele a leña. Los Hoothoot ululan desde los arces y, entre las raíces, algo de ojos rojos te sigue a distancia. Muchos ojos rojos.',
			links: ['parque_nacional', 'iris'],
			enterCond: 'flag.b02_trigal_hecho',
			blockedMsg: 'Un guardabosques del Parque Nacional te corta el paso: «Las Rutas 36 y 37 están cerradas para los de la Gira hasta que la organización dé la salida desde Trigal. Normas de Lemnis. A mí no me mires».',
			mapNote: 'Un árbol en mitad del camino · una MT',
			onEnter: [{ script: 'b02_r36_entrada', cond: '!flag.b02_r36_entrada', once: true }],
			rumors: [
				{ text: 'Hay un árbol en la Ruta 36 que no estaba ahí la semana pasada. Y que cuando llueve se esconde.' },
				{ text: 'De noche, en la Ruta 37 salen Murkrow y Houndour. Dicen que la líder… perdón, el líder de Iris les tiene manía. O ellos a él.' },
				{ cond: '!flag.b02_sudowoodo', text: 'Para mover un árbol que no es un árbol, échale agua. Eso dice la florista de Trigal. Y la florista de Trigal nunca se equivoca.' },
			],
			route: {
				from: 'parque_nacional', to: 'iris', length: 10, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [{ text: 'El último arco del Parque Nacional queda atrás. Delante, hierba alta, arces jóvenes y un cartel torcido: «Ruta 36».' }],
					1: [
						{ trainer: 'r36_leandro' },
						{ text: 'Un dron con el logo de Lemnis zumba a tres metros del suelo, grabando la hierba. Un Pidgeotto lo persigue con muy malas intenciones.' },
					],
					2: [
						{ item: 'honey' },
						{ spot: { action: { gather: 'bonguri_r36' } }, label: 'Árbol de Bonguri', icon: '🌰' },
						{ text: 'Un árbol bajo, cargado de frutos redondos de colores. Una niña de Iris te explica, sin que se lo pidas, que con los Bonguris se hacen Poké Balls. Que su abuelo hacía. Que ya no.' },
					],
					3: [
						{ trainer: 'r36_estela' },
						{ item: 'ultraball', hidden: true },
					],
					4: [
						{ text: 'Un árbol solitario, en mitad del camino. Tronco marrón, ramas verdes en forma de bolas. No hay manera de rodearlo: a un lado el barranco, al otro un seto espeso.' },
						{ talk: [{ script: 'b02_sudowoodo' }], label: 'El árbol del camino', sub: 'Tiembla un poco. Sin viento', icon: '🌳', cond: '!flag.b02_sudowoodo', new: '!flag.b02_sudowoodo' },
						{ block: { cond: 'flag.b02_sudowoodo', msg: 'Un árbol extraño bloquea el camino. Cuando te acercas, juraría que se aparta un poco. Hacia el otro lado. Para seguir bloqueándolo.', dir: 1, script: 'b02_sudowoodo' } },
					],
					5: [
						{ terrain: 'path' },
						{ text: 'Un cruce de caminos. Un cartel de madera: «← Ruta 36 · Ruta 37 ↑ · Ciudad Iris». Alguien ha pegado encima una pegatina de la Gira. Alguien más la ha arrancado a medias.' },
						{ trainer: 'r37_ignacio', optional: true, label: 'Sentado en el cartel, mirando hacia Iris' },
					],
					6: [
						{ talk: [{ cond: '!flag.b02_mt_pulso', script: 'b02_r37_mt' }, { script: 'b02_r37_mt_despues' }], label: 'Un chico con un Houndour', sub: 'Le está dando de comer a la sombra de un arce', icon: '🐕', new: '!flag.b02_mt_pulso' },
						{ item: 'moomoomilk', hidden: true },
						{ text: 'Tres árboles de Bonguri en fila, como en las fotos antiguas de la Ruta 37. Uno está seco. Los otros dos dan fruta por los tres.' },
					],
					7: [
						{ trainer: 'r37_camila' },
						{ text: 'Las hojas de los arces ya son rojas del todo. Crujen al pisar. Por el camino bajan dos Chicas Kimono con sombrillas, muy deprisa, sin hablar. Una lleva una cesta tapada.' },
					],
					8: [
						{ item: 'pinkapricorn' },
						{ spot: { action: { gather: 'hojas_iris' } }, label: 'Alfombra de hojas rojas', icon: '🍁' },
						{ text: 'Un carro de mercancías volcado en la cuneta, sin conductor. Cajas de té de Iris y sacos de Bonguris por todas partes. Uno rosa ha rodado hasta tus pies.' },
					],
					9: [
						{ trainer: 'r37_ramiro', optional: true, label: 'Hace estiramientos mirando a las torres' },
						{ item: 'duskball', hidden: true },
					],
					10: [{ text: 'Los arces se abren y aparece **Ciudad Iris**: tejados curvos de madera oscura, faroles de papel, calles de piedra y, al norte, las dos torres. La negra todavía huele a quemado. Ciento cincuenta años después.' }],
				},
				encounters: {
					grass: [
						{ sp: 'pidgeotto', lv: [32, 35], w: 26 },
						{ sp: 'nidorino', lv: [32, 34], w: 12 },
						{ sp: 'luxio', lv: [32, 35], w: 16 },
						{ sp: 'growlithe', lv: [33, 35], w: 9 },
						{ sp: 'stantler', lv: [34, 36], w: 3 },
						{ sp: 'noctowl', lv: [33, 36], w: 22, time: 'night' },
						{ sp: 'murkrow', lv: [32, 35], w: 12, time: 'night' },
						{ sp: 'houndour', lv: [32, 35], w: 10, time: 'night' },
						{ sp: 'skwovet', lv: [32, 34], w: 6, displaced: true },
						{ sp: 'nickit', lv: [32, 34], w: 5, displaced: true },
					],
				},
			},
		},

		// =================== CIUDAD IRIS ===================
		iris: {
			name: 'Ciudad Iris', short: 'Iris', region: 'johto', kind: 'city', map: { x: 50, y: 14 },
			bg: { type: 'town', roofs: ['#5a2f24', '#7a3a2a', '#3d2a22'], far: '#c97a4a', hill: '#b0502f' },
			desc: 'La ciudad más antigua de Johto. Casas de **madera oscura** con tejados curvos, faroles de papel, calles de piedra que suben y bajan sin avisar y arces de **hojas rojas** en cada esquina. Aquí nadie corre.\n\nAl noroeste, la **Torre Quemada**: negra, rota, con el tejado hundido. Al noreste, la **Torre Campana**: nueve pisos dorados, cerrada a cal y canto. Entre las dos, el **Teatro de Danza**, con sus farolillos apagados.',
			descNight: 'De noche, Iris se ilumina con faroles de papel rojo. El viento baja de la Torre Quemada y trae olor a ceniza vieja.\n\nEn lo alto de la Torre Campana, de vez en cuando, brilla algo dorado. Todo el mundo dice que son los faroles. Nadie mira mucho rato.',
			descs: [{ cond: 'flag.b02_torre_hecha', text: 'Iris sigue igual que hace un siglo y medio, y a la vez no. Los farolillos del **Teatro de Danza** vuelven a estar encendidos, aunque solo la mitad. En la **Torre Quemada**, la policía ha puesto un cordón que nadie respeta.\n\nAl noreste, la **Torre Campana**, dorada y cerrada. Como siempre.' }],
			links: ['ruta36', 'ruta42'],
			mapNote: 'Gimnasio: Morti (Fantasma) · Teatro de Danza · Torre Quemada',
			onEnter: [
				{ script: 'b02_llegada_iris', cond: '!flag.b02_m_aviso', once: true },
				{ script: 'b02_fin', cond: FINAL_OK, once: true },
			],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda de Iris', sub: 'Bonguris, inciensos y amuletos', icon: '🏮', action: { shop: 'tienda_iris' } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Teatro de Danza', sub: 'Los farolillos están apagados', icon: '🎎', action: { go: 'teatro_danza' }, new: '!flag.b02_kaori_iris_1 || (quest.b02_t_kaori == "muestra" && has("muestralab"))' },
				{ label: 'Gimnasio de Iris', sub: 'Una casa de madera sin ventanas', icon: '👻', action: { go: 'gym_iris' }, new: '!beat("morti_g5")' },
				{ label: 'Torre Quemada', sub: 'Negra, rota, con olor a ceniza', icon: '🏚️', action: { go: 'torre_quemada' }, new: '(quest.b02_m5 == "torre" || quest.b02_m5 == "decision") && !flag.b02_torre_hecha' },
				{ label: 'Patio de la Torre Quemada', sub: 'Entrenamiento (nivel recomendado 40)', icon: '🥋', action: { go: 'patio_torre' } },
				{ label: 'Torre Campana', sub: 'Cerrada. Solo se ve desde fuera', icon: '🔔', talk: [{ cond: 'flag.b02_fin', script: 'b02_campana_despues' }, { script: 'b02_campana' }] },
				{ label: 'Gaspar, en un puesto de dulces', sub: 'Ha secuestrado una cocina ambulante', icon: '👨‍🍳', new: '!done.b02_t_gaspar && (quest.b02_t_gaspar == "iris" || (' + GASPAR_TODO + ') || !quest.b02_t_gaspar)', doneIf: 'done.b02_t_gaspar', talk: [
					{ cond: 'done.b02_t_gaspar', script: 'b02_gaspar_final' },
					{ cond: 'quest.b02_t_gaspar == "iris" || (quest.b02_t_gaspar == "ingredientes" && (' + GASPAR_TODO + '))', script: 'b02_gaspar_cocina' },
					{ cond: 'quest.b02_t_gaspar == "ingredientes"', script: 'b02_gaspar_falta' },
					{ script: 'b02_gaspar_intro' },
				] },
				{ label: 'Alguien en el tejado de la casa de té', sub: 'Una capucha gris contra el cielo', icon: '🪶', cond: 'flag.b02_torre_hecha && !flag.b02_ysolde_iris', new: 'true', talk: [{ script: 'b02_ysolde_iris' }] },
				{ label: 'Una Chica Kimono barriendo hojas', sub: 'Delante del teatro', icon: '🧹', talk: [{ cond: 'flag.b02_torre_hecha', script: 'b02_kimono_calle_2' }, { script: 'b02_kimono_calle' }] },
				{ label: 'La noche en Iris', sub: 'Algo te dice que hoy no vas a dormir pronto', icon: '🌙', cond: FINAL_OK, new: 'true', script: 'b02_fin' },
			],
			rumors: [
				{ text: 'La Torre Quemada ardió hace ciento cincuenta años. Dicen que esa noche tres Pokémon salieron corriendo de las llamas y que un cuarto, uno de plumas de fuego, se los llevó al norte.' },
				{ text: 'Al Gimnasio de Iris se entra a ciegas. El suelo está, pero no se ve. Morti dice que es para «aprender a confiar». Los aprendices dicen que es para reírse.' },
				{ text: 'Las Chicas Kimono no han bailado esta semana. Es la primera vez en sesenta años que se suspende la Danza de Otoño.' },
				{ cond: 'quest.b02_m5 == "torre"', text: 'Por la noche, en la Torre Quemada, se oye maquinaria. Los sabios dicen que son los fantasmas. Los fantasmas no usan generador.' },
				{ cond: 'flag.b02_torre_hecha', text: 'Han sacado del sótano de la Torre Quemada jaulas y jaulas. Las llevan a la Policía. O a Lemnis. Depende de a quién le preguntes.' },
			],
		},

		// ---------- Teatro de Danza ----------
		teatro_danza: {
			name: 'Teatro de Danza', parent: 'iris', kind: 'building',
			bg: { type: 'indoor', wall: '#7a2a2a', floor: '#c9a46a' },
			desc: 'Un escenario de madera pulida con cinco cojines rojos en fila, uno para cada Chica Kimono. Al fondo, un biombo pintado con arces. Sobre el escenario cuelga un estandarte nuevo, azul y plata: «**Lemnis** patrocina a las estrellas de Johto».\n\nHuele a incienso y, por debajo, a algo más dulce. Demasiado dulce.',
			descs: [
				{ cond: 'flag.b02_torre_hecha', text: 'El escenario de madera, con sus cinco cojines rojos. Alguien ha descolgado el estandarte de Lemnis y lo ha doblado en un rincón, muy bien doblado, como se doblan las cosas que no se quieren volver a ver.\n\nLas Eevee duermen la siesta. De verdad: con la tripa al aire.' },
				{ cond: 'quest.b02_t_kaori == "muestra"', text: 'El escenario de madera, con sus cinco cojines rojos. Las Eevee ya levantan la cabeza cuando alguien entra. No mucho. Pero la levantan.\n\nDesde la botica del fondo llega un olor a hierbas hervidas y un tarareo monótono.' },
			],
			mapNote: 'Kaori, la boticaria',
			onEnter: [{ script: 'b02_teatro_llegada', cond: '!flag.b02_kaori_iris_1', once: true }],
			spots: [
				{ label: 'Kaori, en la botica del fondo', sub: 'Delantal, kimono y un brazo vendado', icon: '🧪', new: '(quest.b02_t_kaori == "iris" && ((' + PISTAS_OK + ') || (has("caramelolazo") && !flag.b02_kaori_caramelo))) || (quest.b02_t_kaori == "muestra" && has("muestralab"))', talk: [
					{ cond: 'quest.b02_t_kaori == "abierto" || done.b02_t_kaori', script: 'b02_kaori_generico' },
					{ cond: 'quest.b02_t_kaori == "muestra" && has("muestralab")', script: 'b02_kaori_entrega' },
					{ cond: 'quest.b02_t_kaori == "muestra"', script: 'b02_kaori_espera' },
					{ cond: PISTAS_OK, script: 'b02_kaori_deduce' },
					{ cond: 'has("caramelolazo") && !flag.b02_kaori_caramelo', script: 'b02_kaori_caramelos' },
					{ script: 'b02_kaori_investiga' },
				] },
				{ label: 'Las Chicas Kimono', sub: 'Sentadas en los cojines, cada una con su Eevee', icon: '🎎', new: 'quest.b02_t_kaori == "iris" && !flag.b02_pista_kimono', doneIf: 'flag.b02_pista_kimono', talk: [{ cond: '!flag.b02_pista_kimono', script: 'b02_pista_kimono' }, { cond: 'flag.b02_torre_hecha', script: 'b02_kimono_despues' }, { script: 'b02_kimono_generico' }] },
				{ label: 'El almacén del teatro', sub: 'Detrás del biombo', icon: '📦', new: 'quest.b02_t_kaori == "iris" && !flag.b02_pista_almacen', doneIf: 'flag.b02_pista_almacen', talk: [{ cond: '!flag.b02_pista_almacen', script: 'b02_pista_almacen' }, { script: 'b02_almacen_generico' }] },
				{ label: 'El camerino de las estrellas', sub: 'Tiene una estrella de papel plateado en la puerta', icon: '⭐', new: 'quest.b02_t_kaori == "iris" && !flag.b02_pista_caja', doneIf: 'flag.b02_pista_caja', talk: [{ cond: '!flag.b02_pista_caja', script: 'b02_pista_caja' }, { script: 'b02_camerino_generico' }] },
				{ label: 'Los Eevee', sub: 'Acurrucados en los cojines', icon: '🦊', talk: [{ cond: 'flag.b02_torre_hecha', script: 'b02_eevee_3' }, { cond: 'quest.b02_t_kaori == "muestra"', script: 'b02_eevee_2' }, { script: 'b02_eevee_1' }] },
				{ label: 'Programa de mano', sub: 'Un montón junto a la puerta', icon: '📜', cond: '!has("programateatro")', talk: [{ script: 'b02_programa' }] },
			],
		},

		// ---------- Gimnasio de Iris ----------
		gym_iris: {
			name: 'Gimnasio de Iris', parent: 'iris', kind: 'gym',
			bg: { type: 'gym', wall: '#2a2438', floor: '#1a1626' },
			desc: 'Oscuridad. Absoluta. Das un paso y el suelo está ahí. Das otro y también. Das un tercero y no hay nada, y una mano huesuda te agarra del cuello de la camiseta y te devuelve al sitio.\n\n«El camino está —dice una voz—. Pero no se ve. Como casi todo lo que importa.»',
			descs: [{ cond: 'beat("morti_g5")', text: 'La misma oscuridad de siempre, pero ahora alguien ha pintado en el suelo invisible unas huellitas fosforescentes. Morti dice que no fue él. Los aprendices dicen que fue un Gengar. El Gengar sonríe.' }],
			mapNote: 'Líder: Morti (Fantasma)',
			onEnter: [{ script: 'b02_gym_iris_suelo', cond: '!flag.b02_gym_iris_suelo', once: true }],
			spots: [
				{ label: 'Médium Rosana', sub: 'Primer tramo del suelo invisible', action: { trainer: 'gym_iris_1' } },
				{ label: 'Sabio Benito', sub: 'Segundo tramo, al borde del vacío', action: { trainer: 'gym_iris_2' } },
				{ label: 'Morti, al fondo', sub: 'Líder de Iris · tipo Fantasma', icon: '👻', cond: 'beat("gym_iris_1") && beat("gym_iris_2")', new: '!beat("morti_g5")', talk: [{ cond: 'beat("morti_g5")', script: 'b02_morti_despues' }, { script: 'b02_morti_reto' }] },
				{ label: 'Una silueta al fondo', sub: 'Demasiado lejos. Y el suelo, demasiado invisible', icon: '👻', cond: '!(beat("gym_iris_1") && beat("gym_iris_2"))', talk: [{ script: 'b02_morti_espera' }] },
				{ label: 'Un aprendiz con una linterna apagada', sub: 'En la entrada', icon: '🔦', cond: '!flag.b02_mt_pulso', new: 'true', talk: [{ script: 'b02_gym_aprendiz_mt' }] },
			],
		},

		// ---------- Patio de la Torre Quemada (entrenamiento) ----------
		patio_torre: {
			name: 'Patio de la Torre Quemada', parent: 'iris', kind: 'area',
			bg: { type: 'ruins', fog: true, ground: '#6a5a4a', far: '#3d2a22' },
			desc: 'Un patio de piedra al pie de la Torre Quemada, con linternas de piedra cubiertas de musgo. Los médiums y los sabios de Iris entrenan aquí al atardecer, entre las sombras de la torre.\n\nUn letrero de madera: «Se ruega no despertar a los que duermen. Ni a los vivos ni a los otros».',
			mapNote: 'Entrenamiento (nivel 40)',
			spots: [
				{ label: 'Entrenar con los médiums y los sabios', sub: 'Entrenamiento (nivel recomendado 40)', icon: '🥋', action: { training: { cap: 40, prize: { wins: 3, script: 'p7_premio_patio_quemada' }, trainers: ['patio_torre_1', 'patio_torre_2', 'patio_torre_3'], wild: [{ sp: 'haunter', lv: [36, 38] }, { sp: 'misdreavus', lv: [36, 38] }, { sp: 'noctowl', lv: [36, 37] }], coach: 'Sabio del patio', closed: 'El sabio te mira de arriba abajo. «Tu equipo ya no tiene nada que aprender de nuestras sombras. Ve a buscar las tuyas.»' } } },
				{ label: 'Un médium que habla solo', sub: 'Agita un dado de veinte caras', icon: '🎲', talk: [{ script: 'b02_medium_dados' }] },
			],
		},

		// ---------- Torre Quemada ----------
		torre_quemada: {
			name: 'Torre Quemada', parent: 'iris', kind: 'cave',
			bg: { type: 'tower', fog: true, wall: '#2a2220', floor: '#3d2e26' },
			desc: 'Por dentro, la torre es un esqueleto: vigas negras, escaleras que no llevan a ninguna parte, el cielo asomando por el tejado hundido. Las cenizas de hace ciento cincuenta años crujen bajo los pies.\n\nEn el centro, un **agujero** enorme en el suelo, por donde se ve el sótano. Alguien ha puesto una escalera de mano. Nueva.',
			descs: [{ cond: 'flag.b02_torre_hecha', text: 'Las vigas negras, el cielo por el tejado hundido. La escalera de mano sigue en el agujero, pero ahora hay un cordón policial alrededor. Y una Chica Kimono que deja una flor en el borde cada mañana.' }],
			mapNote: 'Sótano · Huellas en la ceniza',
			spots: [
				{ label: 'Explorar entre las vigas', sub: 'Algo se mueve en la ceniza', icon: '🔥', action: { explore: 'cave' } },
				{ label: 'Bajar al sótano', sub: 'Por la escalera de mano', icon: '🪜', cond: SOTANO_OK, new: '(quest.b02_m5 == "torre" || quest.b02_m5 == "decision") && !flag.b02_torre_hecha', action: { go: 'torre_quemada_sotano' } },
				{ label: 'El agujero del suelo', sub: 'Un sabio lo vigila', icon: '🕳️', cond: '!(' + SOTANO_OK + ')', talk: [{ script: 'b02_torre_sabio' }] },
				{ label: 'Huellas en la ceniza', sub: 'Grandes. Y no son de nadie que viva aquí', icon: '🐾', talk: [{ cond: '!flag.b02_torre_eco', script: 'b02_torre_eco' }, { script: 'b02_torre_eco_2' }], new: '!flag.b02_torre_eco' },
				{ label: 'Runas en una viga quemada', sub: 'Talladas. Medio borradas por el fuego', icon: '🔣', talk: [{ cond: '!flag.b02_irene_iris', script: 'b02_irene_runas' }, { script: 'b02_runas_despues' }], new: '!flag.b02_irene_iris && (' + LUC + ')' },
			],
			encounters: {
				cave: [
					{ sp: 'raticate', lv: [33, 36], w: 24 },
					{ sp: 'weezing', lv: [35, 36], w: 16 },
					{ sp: 'golbat', lv: [33, 36], w: 14 },
					{ sp: 'meditite', lv: [33, 35], w: 12 },
					{ sp: 'spinda', lv: [34, 35], w: 8 },
					{ sp: 'magmar', lv: [35, 37], w: 4 },
					{ sp: 'haunter', lv: [34, 37], w: 14, time: 'night' },
					{ sp: 'misdreavus', lv: [34, 36], w: 8, time: 'night' },
					{ sp: 'litwick', lv: [33, 35], w: 6, displaced: true },
				],
			},
		},

		// ---------- Sótano de la Torre Quemada ----------
		torre_quemada_sotano: {
			name: 'Sótano de la Torre Quemada', parent: 'torre_quemada', kind: 'cave',
			bg: { type: 'lab', wall: '#2a2220', floor: '#2b2b38', crystals: '#7fd6e0' },
			desc: 'El sótano de la torre ya no es un sótano: es un **laboratorio improvisado**. Cables por el suelo, un generador que ronronea, mesas de campaña con morteros, balanzas y sacos de azúcar. En una cinta transportadora de juguete avanzan, uno a uno, **Caramelos Lazo** envueltos en azul y plata.\n\nAl fondo, en la penumbra, una pared de **jaulas**.',
			descs: [{ cond: 'flag.b02_torre_hecha', text: 'El laboratorio está a medio desmontar. Las jaulas, abiertas y vacías. En el suelo, entre cables, alguien ha dejado una pegatina rota: «Destino: por asignar».' }],
			enterCond: SOTANO_OK,
			blockedMsg: 'Un sabio se planta delante del agujero: «Ahí abajo no hay nada. Y nadie baja».',
			mapNote: 'Laboratorio · Team Rocket',
			onEnter: [{ script: 'b02_sotano_llegada', cond: '!flag.b02_sotano_visto', once: true }],
			spots: [
				{ label: 'Recluta junto al generador', sub: 'Lleva guantes de cocina', action: { trainer: 'rocket_torre_1' } },
				{ label: 'Recluta en la cinta de caramelos', sub: 'Cuenta en voz baja', action: { trainer: 'rocket_torre_2' } },
				{ label: 'Recluta delante de las jaulas', sub: 'No te deja pasar', action: { trainer: 'rocket_torre_3' } },
				{ label: 'Respirar hondo', sub: 'Antes de seguir', icon: '💨', cond: '!flag.b02_torre_hecha', talk: [{ script: 'b02_sotano_respirar' }] },
				{ label: 'Una mujer de pelo rojo y una de pelo rosa', sub: 'Discuten al fondo, junto a las cajas', icon: '🚀', cond: RECLUTAS_OK + ' && !flag.b02_torre_hecha', new: 'true', talk: [{ script: 'b02_atenea' }] },
				{ label: 'Voces al fondo del laboratorio', sub: 'Tres reclutas te cortan el paso', icon: '🚀', cond: '!(' + RECLUTAS_OK + ') && !flag.b02_torre_hecha', talk: [{ script: 'b02_sotano_voces' }] },
				{ label: 'Las jaulas vacías', icon: '🔓', cond: 'flag.b02_torre_hecha', talk: [{ script: 'b02_jaulas_vacias' }] },
			],
		},

		// =================== RUTA 42 ===================
		ruta42: {
			name: 'Ruta 42', short: 'Ruta 42', region: 'johto', kind: 'route', map: { x: 66, y: 16 },
			bg: { type: 'route', flowers: '#f2d04a', far: '#8a9ab0', hill: '#6a8a5a' },
			desc: 'Al este de Iris, el camino bordea las faldas del **Monte Mortero** y un lago redondo y quieto. Huele a hierba mojada y, cada vez más, a oveja. A Mareep, para ser exactos.\n\nUn cartel pintado a mano: «Rancho Prado · Lana, leche y paciencia · 3 km».',
			links: ['iris', 'rancho_aurelio'],
			mapNote: 'Monte Mortero · lago · rancho de Don Aurelio',
			onEnter: [{ script: 'b02_r42_entrada', cond: '!flag.b02_r42_entrada', once: true }],
			rumors: [
				{ text: 'Dentro del Monte Mortero hay un karateka que lleva diez años entrenando solo. Dice que ya casi.' },
				{ text: 'Los Mareep del rancho de la Ruta 42 se escapan a pastar al lago. Don Aurelio los llama con un silbato. Vuelven todos. Menos cuando no quieren.' },
				{ cond: '!flag.b02_rancho_hecho', text: 'Don Aurelio volvió de Kalos con el rebaño entero y una historia que nadie se cree. Ahora habla de Kalos como si fuera un pueblo de al lado.' },
			],
			route: {
				from: 'iris', to: 'rancho_aurelio', length: 8, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [{ text: 'Las últimas casas de Iris quedan atrás. El camino baja hacia un valle verde. A lo lejos, la boca oscura del **Monte Mortero**.' }],
					1: [{ trainer: 'r42_rosaura' }],
					2: [
						{ terrain: 'water' },
						{ text: 'El lago. El agua está tan quieta que refleja las dos torres de Iris, al revés. Un pescador te saluda con la caña.' },
						{ trainer: 'r42_ernesto' },
						{ spot: { action: { gather: 'orilla_lago42' } }, label: 'Orilla del lago', icon: '🐚' },
					],
					3: [
						{ terrain: 'water' },
						{ item: 'pearl', hidden: true },
						{ text: 'En la orilla, un Wooloo empapado mira el agua con cara de no entender nada. No es de aquí. Ni de ningún sitio cercano.' },
					],
					4: [
						{ terrain: 'rocks' },
						{ text: 'La entrada del **Monte Mortero**. Del interior sale un eco rítmico: alguien golpeando una piedra con el puño. Hu. Ha. Hu. Ha. Lleva así un rato. Lleva así, dicen, diez años.' },
						{ trainer: 'r42_mauro', optional: true, label: 'Sale de la cueva sacudiéndose el polvo' },
						{ item: 'hyperpotion' },
					],
					5: [
						{ text: 'Una valla de madera, recién pintada. Detrás, un prado con mechones de lana enganchados en los cardos. Huele a ozono.' },
						{ item: 'revive', hidden: true },
					],
					6: [{ trainer: 'r42_lidia', optional: true, label: 'Te observa desde una roca con prismáticos' }],
					7: [{ text: 'Un buzón con forma de Mareep. Le falta una oreja. Dentro hay tres cartas de propaganda de Lemnis y un folleto: «¿Ha pensado en el futuro de su rancho? Programa Raíces de Johto». El buzón lo tiene todo. Sin abrir.' }],
					8: [{ text: 'Una cancela de madera con un cencerro. Al fondo, un establo rojo, una casa con porche y un mar de lana blanca que se mueve.' }],
				},
				encounters: {
					grass: [
						{ sp: 'fearow', lv: [33, 36], w: 22 },
						{ sp: 'flaaffy', lv: [33, 35], w: 16 },
						{ sp: 'primeape', lv: [34, 36], w: 12 },
						{ sp: 'loudred', lv: [33, 35], w: 10 },
						{ sp: 'linoone', lv: [33, 36], w: 12 },
						{ sp: 'bibarel', lv: [33, 36], w: 10 },
						{ sp: 'golbat', lv: [34, 37], w: 16, time: 'night' },
						{ sp: 'heracross', lv: [35, 37], w: 3 },
						{ sp: 'wooloo', lv: [33, 35], w: 6, displaced: true },
					],
					water: [
						{ sp: 'goldeen', lv: [33, 35], w: 40 },
						{ sp: 'seaking', lv: [35, 37], w: 20 },
						{ sp: 'floatzel', lv: [34, 36], w: 15 },
						{ sp: 'wooloo', lv: [33, 34], w: 4, displaced: true },
					],
				},
			},
		},

		// =================== RANCHO DE DON AURELIO ===================
		rancho_aurelio: {
			name: 'Rancho de Don Aurelio', short: 'Rancho Prado', region: 'johto', kind: 'area', map: { x: 74, y: 26 },
			bg: { type: 'ranch', ground: '#8ab86a', far: '#8a9ab0' },
			desc: 'Un establo rojo, una casa de madera con porche y mecedora, un pozo, un huerto y un prado enorme lleno de **Mareep** que chisporrotean al rozarse. Cuando sopla el viento, el rancho entero hace *chss*.\n\nEn el porche, un cartel de madera tallada: «Rancho Prado. Desde siempre. Hasta que haga falta».',
			descs: [{ cond: 'flag.b02_rancho_hecho', text: 'El rancho de Don Aurelio, con su establo rojo y su prado de lana. La mecedora del porche se mueve sola con el viento. En la ventana de la cocina hay una luz encendida.\n\nCopito te ve llegar desde el otro lado del prado y se pone a balar como si no te hubiera visto en un año.' }],
			links: ['ruta42'],
			mapNote: 'Don Aurelio y su rebaño',
			onEnter: [{ script: 'b02_rancho_llegada', cond: '!flag.b02_rancho_llegada', once: true }],
			spots: [
				{ label: 'Don Aurelio, en el porche', sub: 'En su mecedora', icon: '🤠', new: '!flag.b02_rancho_hecho', talk: [{ cond: 'flag.b02_rancho_hecho', script: 'b02_aurelio_despues' }, { script: 'b02_aurelio_visita' }] },
				{ label: 'El rebaño', sub: 'Un mar de lana que bala', icon: '🐑', talk: [{ script: 'b02_rebano' }] },
				{ label: 'Copito', sub: 'Una Mareep con un lazo azul en el cencerro', icon: '🎀', talk: [{ script: 'b02_copito' }] },
				{ label: 'Huerto del rancho', icon: '🥕', action: { gather: 'huerto_rancho' } },
			],
			rumors: [
				{ text: 'Don Aurelio dice que su Ampharos alumbra mejor que el faro de Olivo. El farero de Olivo no lo ha desmentido.' },
			],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Rutas 36 y 37 -----
		r36_leandro: { name: 'Tadeo', cls: 'Ornitólogo', ai: 2, team: [{ sp: 'pidgeotto', lv: 35 }, { sp: 'noctowl', lv: 36 }],
			intro: 'Desde que pasa la Gira, los Pidgeotto vuelan bajo. Hay demasiados drones de Lemnis grabando el cielo. Mi Noctowl ya ha derribado dos. Sin querer. Casi.', win: 'Si ves un dron, salúdalo. Así tendrán una foto bonita de alguien que no se deja grabar.' },
		r36_estela: { name: 'Estela', cls: 'Pokéfan', ai: 2, team: [{ sp: 'azumarill', lv: 36 }, { sp: 'granbull', lv: 36 }],
			intro: '¿Has visto el árbol de ahí delante? Lleva tres semanas sin moverse. Ayer lloró resina. Los árboles no lloran. ¡Combate, que estoy nerviosa!', win: 'Mi Azumarill dice que el árbol tiene cara. Yo no he querido mirar.' },
		r37_ignacio: { name: 'Ignacio', cls: 'Montañero', ai: 2, team: [{ sp: 'graveler', lv: 36 }, { sp: 'machoke', lv: 37 }],
			intro: 'Los Rocket han vuelto. Lo sé porque mi primo era uno. Ahora dice que «está con la familia» y no me cuenta más. Mi primo no tiene familia. Bueno: me tiene a mí.', win: 'Si lo ves, se llama Toni. Es bajito, con orejas de soplillo. Dile que su madre le ha guardado arroz.' },
		r37_camila: { name: 'Camila', cls: 'Criadora', ai: 2, team: [{ sp: 'ledian', lv: 36 }, { sp: 'flaaffy', lv: 37 }],
			intro: 'Venía a Iris a ver la Danza de Otoño de las Eevee. Dicen que este año no bailan. Que no tienen ganas. ¿Desde cuándo un Eevee no tiene ganas de nada?', win: 'Mi Flaaffy también está raro desde que le di uno de esos caramelos de la Gira. Duerme mucho. Seguro que es el otoño. Seguro.' },
		r37_ramiro: { name: 'Clemente', cls: 'Montañero', ai: 2, team: [{ sp: 'graveler', lv: 37 }, { sp: 'ursaring', lv: 38 }],
			intro: 'Vengo de Kanto en tren. ¿La Puerta? Ni loco. Un amigo cruzó y salió con tres horas menos en el reloj. No tres horas de viaje: tres horas MENOS.', win: 'Tres horas. Dice que se le hizo un segundo. Desde entonces lleva dos relojes.' },

		// ----- Gimnasio de Iris -----
		gym_iris_1: { name: 'Rosana', cls: 'Médium', ai: 3, team: [{ sp: 'misdreavus', lv: 36 }, { sp: 'haunter', lv: 36 }],
			intro: 'Mi abuela me decía: «Si no ves el suelo, mira a tu Pokémon. Él siempre sabe dónde pisa». ¡Mi Haunter flota, así que no me sirve de nada!', win: 'Tu compañero no ha mirado al suelo ni una vez. Ha mirado a través. Qué miedo. Qué bonito.' },
		gym_iris_2: { name: 'Benito', cls: 'Sabio', ai: 3, team: [{ sp: 'noctowl', lv: 36 }, { sp: 'banette', lv: 37 }],
			intro: 'Llevo cuarenta años meditando en la Torre Campana. Desde que la cerraron, medito aquí. Medito peor. Hay mucho fantasma maleducado.', win: 'Morti te espera. Él ve cosas. No le preguntes cuáles: te las dirá igual.' },
		morti_g5: { name: 'Morti', cls: 'Líder', npc: 'morti', ai: 4, iv: 29, reward: 2400, bg: 'gym',
			team: [
				{ sp: 'dusclops', lv: 37, moves: ['shadowpunch', 'confuseray', 'painsplit', 'icepunch'], ability: 'pressure', item: 'sitrusberry', nature: 'impish' },
				{ sp: 'drifblim', lv: 37, moves: ['hex', 'airslash', 'thunderbolt', 'thunderwave'], ability: 'unburden', item: 'oranberry', nature: 'modest' },
				{ sp: 'mismagius', lv: 38, moves: ['shadowball', 'dazzlinggleam', 'psybeam', 'nastyplot'], ability: 'levitate', item: 'spelltag', nature: 'calm' },
				{ sp: 'gengar', lv: 39, moves: ['shadowball', 'sludgebomb', 'thunderbolt', 'hex'], ability: 'cursedbody', item: 'blacksludge', nature: 'timid' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'El suelo está. Tus Pokémon están. Ahora veamos si tú estás.',
			win: 'Ah. Ya lo veo. No es que no tengas miedo. Es que tu compañero lo tiene por ti, y lo convierte en otra cosa.',
			lose: 'No te preocupes. Lo que no se ve hoy, se ve mañana. Casi siempre.' },

		// ----- Patio de la Torre (entrenamiento, repetibles) -----
		patio_torre_1: { name: 'Hortensia', cls: 'Médium', ai: 2, team: [{ sp: 'haunter', lv: 36 }, { sp: 'misdreavus', lv: 37 }],
			intro: 'Las sombras de la torre se mueven solas al atardecer. Yo solo las acompaño. Y a veces les gano.', win: 'Vuelve mañana. Las sombras de mañana son más largas.' },
		patio_torre_2: { name: 'Isidro', cls: 'Sabio', ai: 2, team: [{ sp: 'noctowl', lv: 37 }, { sp: 'xatu', lv: 37 }],
			intro: 'Un sabio no lucha por ganar. Lucha por entender. Pero si gano, también está bien.', win: 'He entendido algo. No sé qué. Volveré a pelear hasta saberlo.' },
		patio_torre_3: { name: 'Valentín', cls: 'Médium', ai: 2, team: [{ sp: 'drifblim', lv: 37 }, { sp: 'banette', lv: 38 }],
			intro: '«Un entrenador misterioso entra en el patio. Tira iniciativa.» …Perdona, es que narro. Siempre narro. ¡Combate!', win: '«El médium cae. Sus fantasmas lo miran con lástima.» Muy bien narrado, ¿verdad? Gracias.' },

		// ----- Sótano de la Torre Quemada -----
		rocket_torre_1: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket', ai: 2, team: [{ sp: 'weezing', lv: 36 }, { sp: 'raticate', lv: 37 }],
			intro: '¡Eh, eh, eh! ¡Que esto es una cocina! ¿Tienes carné de manipulador de alimentos? Ya me parecía.', win: 'Ya, ya. Yo solo remuevo el azúcar. Remover azúcar no es delito. ¿O sí? Dímelo, que me interesa.' },
		rocket_torre_2: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket_f', ai: 2, team: [{ sp: 'golbat', lv: 37 }, { sp: 'arbok', lv: 37 }],
			intro: 'Tres mil caramelos más y pagamos la deuda de la abuela de Toni. ¿Sabes lo que es eso? Es una abuela que vuelve a dormir tranquila.', win: 'La familia primero. Siempre. Aunque la familia sea una pandilla de idiotas con uniforme.' },
		rocket_torre_3: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket', ai: 2, team: [{ sp: 'muk', lv: 38 }, { sp: 'houndoom', lv: 38 }],
			intro: 'Cuando Giovanni se fue, nadie vino a buscarnos. Ni la Liga ni nadie. A mí me encontró Atenea en un muelle. No pienso dejar que pases.', win: 'Ve. Pero no le hagas daño. A ella no. Es lo único que tenemos.' },
		atenea_1: { name: 'Atenea', cls: 'Admin Rocket', npc: 'atenea', ai: 5, iv: 29, reward: 3300,
			team: [
				{ sp: 'arbok', lv: 38, moves: ['poisonjab', 'crunch', 'earthquake', 'glare'], ability: 'intimidate', item: 'poisonbarb', nature: 'adamant' },
				{ sp: 'vileplume', lv: 38, moves: ['gigadrain', 'sludgebomb', 'moonblast', 'stunspore'], ability: 'effectspore', item: 'blacksludge', nature: 'bold' },
				{ sp: 'houndoom', lv: 39, moves: ['firefang', 'crunch', 'suckerpunch', 'willowisp'], ability: 'flashfire', item: 'oranberry', nature: 'jolly' },
				{ sp: 'honchkrow', lv: 41, moves: ['nightslash', 'wingattack', 'suckerpunch', 'haze'], ability: 'insomnia', item: 'sitrusberry', nature: 'adamant' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'Qué detalle. Bajar tú solit{o|a|e} a la cocina. Te enseñaré cómo tratamos aquí a los que se cuelan sin invitación.',
			win: '…Vaya. La familia de alguien está bien criada. Lástima que no sea la mía.',
			lose: 'Sube y cuéntaselo a quien quieras. Nadie va a creer que unos caramelos son peligrosos. Ese es el truco.' },

		// ----- Ruta 42 -----
		r42_rosaura: { name: 'Rosaura', cls: 'Ranchera', ai: 2, team: [{ sp: 'tauros', lv: 37 }, { sp: 'flaaffy', lv: 37 }],
			intro: '¿Va al rancho de Don Aurelio? Salúdelo de mi parte. Y dígale que vaya al médico, que a mí no me hace caso. Pero antes, ¡combate de vecinos!', win: 'Buen pulso. Don Aurelio dice que la gente se conoce por cómo trata a los animales. Usted los trata como a familia.' },
		r42_ernesto: { name: 'Ernesto', cls: 'Pescador', ai: 2, team: [{ sp: 'seaking', lv: 37 }, { sp: 'quagsire', lv: 36 }],
			intro: 'Desde que encendieron la Puerta de Trigal, el lago amanece con burbujas que huelen a mar. Este lago no tiene mar. ¡Nunca ha tenido mar!', win: 'Ayer pesqué un Wooloo. Un Wooloo. En un lago. Ya no sé qué estoy haciendo con mi vida.' },
		r42_mauro: { name: 'Mauro', cls: 'Karateka', ai: 2, team: [{ sp: 'primeape', lv: 38 }, { sp: 'machoke', lv: 38 }],
			intro: 'Llevo diez años entrenando dentro del Monte Mortero con el Rey del Kárate. Hoy he salido a por pan. Ya que estoy, ¡combate!', win: 'El Rey dice que la fuerza está dentro. Yo creo que está en el pan. Hoy tengo dudas.' },
		r42_lidia: { name: 'Lidia', cls: 'Excursionista', ai: 2, team: [{ sp: 'golbat', lv: 38 }, { sp: 'ursaring', lv: 39 }],
			intro: 'Los Rocket que pasan por aquí no roban. Compran. Pagan en efectivo y dan las gracias. Eso me da más miedo que si robaran.', win: 'Si un Rocket te dice «gracias», revisa la cartera. No porque te la haya quitado: porque te ha metido algo.' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== RUTAS 36 Y 37 ===================
		b02_r36_entrada: [
			{ set: { 'flag.b02_r36_entrada': true } },
			{ quest: 'b02_m5', stage: 'iris' },
			{ text: 'El camino sale del Parque Nacional entre arces que empiezan a enrojecer. Por encima de los árboles, muy lejos, asoman dos torres.' },
			{ say: 'rotom', text: '¡Bzzt! Las torres de **Ciudad Iris**. La negra es la Torre Quemada y la dorada es la Torre Campana. Según mi guía, «la ciudad donde el pasado nunca termina de pasar». Qué guía tan dramática.' },
			{ text: '{riolu} se queda mirando la torre negra un buen rato, con las orejas tiesas. Luego sigue andando, pero no deja de mirarla.', cond: LUC },
		],
		b02_sudowoodo: [
			{ if: 'flag.b02_sudowoodo', then: [{ text: 'El camino está libre.' }, { end: true }] },
			{ text: 'Te acercas al árbol. De cerca, el tronco tiene una textura rara, como de piedra. Y las ramas… las ramas tiemblan. No hace viento.' },
			{ text: '{riolu} gruñe bajito y le da un toquecito con el dedo. El árbol, muy despacio, se aparta dos centímetros.', cond: LUC },
			{ say: 'rotom', text: '¡Bzzt! Análisis: no es un árbol. Repito: NO es un árbol. Es un **Sudowoodo**. Tipo Roca. Se hace pasar por árbol porque… bueno, porque le gusta. Cada uno tiene sus aficiones.' },
			{ if: 'has("regaderaardilla")', then: [
				{ text: 'Sacas la **Regadera Ardilla**. El Sudowoodo abre un ojo. Lo cierra muy fuerte, como un niño que finge dormir.' },
				{ text: 'Riegas. Una vez. Dos.' },
				{ text: 'A la tercera, el «árbol» pega un salto, sacude las ramas como quien se seca las manos y te mira con una ofensa profundísima.' },
			], else: [
				{ text: 'No llevas nada para regarlo. Te quedas mirando al «árbol». El «árbol» te mira a ti.' },
				{ text: '{riolu} pierde la paciencia, le pone la palma en el tronco y suelta un chispazo de aura. El «árbol» pega un salto y sacude las ramas, indignadísimo.', cond: LUC },
				{ text: 'Al final le das una patada al tronco. Te duele más a ti. Pero el «árbol» pega un salto, indignadísimo.', cond: '!(' + LUC + ')' },
			] },
			{ say: 'rotom', text: '¡Bzzt! ¡Se ha enfadado! ¡Viene!' },
			{ wild: { sp: 'sudowoodo', lv: 36, moves: ['rockslide', 'suckerpunch', 'lowkick', 'mimic'], ability: 'rockhead' },
				onCatch: [{ text: '¡El Sudowoodo se ha unido a tu equipo! Se coloca en la mochila con los brazos en cruz, haciendo de árbol. Rotom decide no decirle nada.' }, { set: { 'flag.b02_sudowoodo': true, 'flag.b02_sudowoodo_atrapado': true } }],
				onWin: [{ text: 'El Sudowoodo se rinde. Se sacude las hojas, te hace una reverencia rara, muy digna, y se aleja hacia el Parque Nacional para hacer de árbol en otra parte.' }, { set: { 'flag.b02_sudowoodo': true } }],
				onRun: [{ text: 'Te apartas. El Sudowoodo, satisfecho de haberte asustado, se va trotando hacia el bosque, se planta junto a dos arces y se queda quieto. Hace de árbol bastante bien. Bastante.' }, { set: { 'flag.b02_sudowoodo': true } }],
				onLose: [{ text: 'El Sudowoodo te deja hech{o|a|e} polvo, se sacude las ramas y se marcha muy digno hacia el bosque. El camino, al menos, queda libre.' }, { set: { 'flag.b02_sudowoodo': true } }] },
			{ set: { 'flag.b02_sudowoodo': true } },
			{ text: 'El camino hacia la Ruta 37 queda libre.' },
		],
		b02_r37_mt: [
			{ set: { 'flag.b02_mt_pulso': true } },
			{ text: 'Un chico de unos diez años le da trocitos de pan a un Houndour enorme que se los come con muchísima educación.' },
			{ say: 'nino_houndour', text: '¿Vas a Iris? ¿Al gimnasio? Mi hermano fue el año pasado. Volvió llorando. Dice que los fantasmas de Morti le hacían cosquillas. Desde dentro.' },
			{ say: 'nino_houndour', text: 'Mi Houndour no les tiene miedo. Los muerde y ya. Bueno, no los muerde: les hace esto.' },
			{ text: 'El Houndour abre la boca y suelta una onda oscura, horrible, que hace temblar las hojas de los arces. Un Noctowl cae de una rama, ofendido.' },
			{ say: 'nino_houndour', text: '¡Se llama Pulso Umbrío! Mi hermano me dio la MT para que no llorara yo también. Pero yo no voy a ir a ese gimnasio ni loco. Toma, quédatela. Tu Pokémon tiene cara de valiente.' },
			{ give: 'mt_pulsoumbrio' },
			{ say: 'rotom', text: '¡Bzzt! **Pulso Umbrío**, tipo Siniestro. A los Fantasma les sienta fatal. Y, según mis datos, Lucario puede aprenderlo. Solo lo digo. Por decir.', cond: 'inParty("lucario")' },
			{ say: 'rotom', text: '¡Bzzt! **Pulso Umbrío**, tipo Siniestro. A los Fantasma les sienta fatal. Si {riolu} evoluciona, podrá aprenderlo. Solo lo digo.', cond: 'inParty("riolu")' },
		],
		b02_r37_mt_despues: [
			{ say: 'nino_houndour', text: '¿Ya has ido al gimnasio? Si lloras, no pasa nada. Mi hermano dice que llorar en Iris no cuenta, porque aquí todo es antiguo.' },
		],
		b02_r42_entrada: [
			{ set: { 'flag.b02_r42_entrada': true } },
			{ quest: 'b02_t_aurelio', stage: 'rancho', cond: '!flag.b02_rancho_hecho' },
			{ text: 'El camino baja hacia un valle verde. Huele a hierba y a algo más, cálido y familiar: a lana.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Detecto Mareep! Muchos Mareep. Un porcentaje de Mareep por metro cuadrado francamente alto.' },
		],

		// =================== LLEGADA A IRIS ===================
		b02_llegada_iris: [
			{ set: { 'flag.b02_m_aviso': true } },
			{ quest: 'b02_m5', stage: 'iris' },
			{ quest: 'b02_m6', stage: 'reto' },
			{ cutscene: { weather: 'leaves', bg: { type: 'town', roofs: ['#5a2f24', '#7a3a2a', '#3d2a22'], far: '#c97a4a' }, start: 'dark', frames: [
				{ big: true, text: 'Ciudad Iris', sub: 'Johto', hold: 2400, cam: 'still' },
				{ cam: 'pull', fx: 'light', text: 'Ciudad Iris aparece entre los arces: tejados curvos de madera oscura, faroles de papel y hojas rojas que caen despacio, como si tuvieran todo el tiempo del mundo.' },
				{ cam: 'pan-up', text: 'Al norte, dos torres. Una negra, rota, quemada hace ciento cincuenta años y nunca reconstruida. Otra dorada, de nueve pisos, con las puertas cerradas.' },
				{ color: '#ffd24a', cam: 'push', fx: 'glow', text: 'Por un segundo, en lo alto de la torre dorada, algo brilla. Luego, nada.' },
			] } },
			{ text: 'En la calle principal, la gente camina despacio. Nadie lleva prisa. Bueno: casi nadie. Dos Chicas Kimono pasan casi corriendo con sus sombrillas, hacia un edificio de madera con farolillos apagados: el **Teatro de Danza**.' },
			{ say: 'senora_te', text: '¿De la Gira? Bienvenid{o|a|e}. Llegas en mala semana. Las Chicas Kimono han suspendido la Danza de Otoño. Por primera vez en sesenta años. Dicen que sus Eevee están enfermos.' },
			{ say: 'senora_te', text: 'Enfermos no. —Baja la voz—. Tristes. Como apagados. Mi nieta dice que es una maldición de la torre. Yo digo que es el otoño. La boticaria del teatro dice que somos idiotas las dos.' },
			{ text: '«Apagados.» Te acuerdas del Encinar. De los Pokémon desplazados que no huían, que no luchaban, que te miraban sin mirarte.' },
			{ text: '{riolu} también se acuerda. Se le ha erizado el pelaje del lomo.', cond: LUC },
			{ say: 'rotom', text: '¡Bzzt! Recordatorio: el Gimnasio de Iris es del Circuito. Líder: **Morti**, tipo Fantasma. Y la Gira tiene parada aquí tres días. Tres días. Sin desvíos, por favor.' },
			{ quest: 'b02_t_aurelio', stage: 'invitacion', cond: '!quest.b02_t_aurelio' },
			{ if: 'quest.b02_t_aurelio == "invitacion"', then: [
				{ text: 'En el Centro Pokémon te espera una postal. Tiene un Mareep dibujado a lápiz, con muy mala mano y mucho cariño.' },
				{ text: '«Muchach{o|a|e}: si pasa por Iris, el rancho está a un paseo por la Ruta 42, al este. Hay leche, hay lana y hay un Ampharos que quiere conocerle. Venga cuando pueda. Pero venga. — A. Prado.»' },
			] },
		],
		b02_kimono_calle: [
			{ say: 'chica_kimono', text: 'Bienvenid{o|a|e} a Iris. Perdone que no le sonría: es que esta semana no me sale.' },
			{ say: 'chica_kimono', text: 'Mi Eevee lleva cinco días sin querer bailar. Antes bailaba hasta dormida. Si quiere ayudar, la boticaria está en el teatro. Es… especial. No la mire mucho el brazo.' },
		],
		b02_kimono_calle_2: [
			{ say: 'chica_kimono', text: 'Esta mañana mi Eevee me ha robado una horquilla. ¡Me ha ROBADO una horquilla! —Se le escapa una risa—. Perdone. Es que hacía días que no hacía una trastada.' },
		],
		b02_campana: [
			{ text: 'La Torre Campana se alza dorada, nueve pisos de tejados curvos, más alta que nada en Johto. La puerta, de madera lacada, está cerrada con una cadena gruesa y un candado nuevo.' },
			{ text: 'Un cartel: «Cerrada por orden del Consejo de Sabios. Solo se abre para quien lleva la señal». Debajo, en letra más pequeña: «No, la pegatina de la Gira no es la señal».' },
			{ say: 'sabio', text: 'La torre espera a alguien. No a ti. Todavía no. Puede que nunca. No te lo tomes como algo personal: espera desde hace siglos y no le ha abierto a casi nadie.' },
			{ text: '{riolu} levanta la vista hacia el último piso. Allí arriba, por un instante, el aire tiembla. Como encima de una hoguera.', cond: LUC },
		],
		b02_campana_despues: [
			{ text: 'La Torre Campana, dorada y cerrada. El candado sigue en su sitio.' },
			{ text: 'En el escalón de la entrada hay una pluma. Pequeña, rojiza, con el borde dorado. Cuando intentas tomarla, una ráfaga de viento se la lleva hacia arriba. Muy arriba.' },
		],

		// =================== TEATRO DE DANZA · KAORI ===================
		b02_teatro_llegada: [
			{ set: { 'flag.b02_kaori_iris_1': true } },
			{ quest: 'b02_m5', stage: 'teatro' },
			{ quest: 'b02_t_kaori', stage: 'iris' },
			{ text: 'Dentro del teatro hace frío. Cinco Chicas Kimono están sentadas en el escenario, cada una en su cojín rojo, con un **Eevee** en el regazo.' },
			{ text: 'Los Eevee no se mueven. Tienen los ojos abiertos, pero sin brillo, como canicas mojadas. Uno respira tan despacio que tienes que mirarlo un rato para estar segur{o|a|e}.' },
			{ text: 'Es la misma mirada. La de los desplazados del Encinar. No hay duda.' },
			{ text: '{riolu} da un paso hacia ellos y se detiene en seco. Se lleva la pata al pecho, como si le doliera algo que no es suyo.', cond: LUC },
			{ text: 'Desde una puerta al fondo, detrás del biombo, sale una voz monótona.' },
			{ say: 'kaori', as: 'Voz del fondo', text: 'No hables. Treinta segundos.' },
			{ text: 'En la botica del fondo, entre frascos, morteros y manojos de hierbas secas, una mujer joven con delantal sobre un kimono sencillo mira fijamente un reloj de arena. Tiene el brazo izquierdo vendado hasta el codo. Sobre la venda, una gota de algo verde.' },
			{ if: 'flag.b02_kaori_trigal', then: [{ text: 'La reconoces: es la mujer del pasador de hoja. La de Trigal. La que miró tu Caramelo Lazo y dijo: «Eso no es un caramelo».' }] },
			{ choice: [
				{ text: 'Esperar en silencio a que termine.', then: [
					{ af: { kaori: 2 } },
					{ text: 'Esperas. Ella no aparta la vista del reloj. A los doce segundos frunce el ceño. A los veinte, la mano le tiembla un poco. A los treinta, suspira.' },
					{ say: 'kaori', text: 'Hormigueo a los doce. Entumecimiento a los veinte. Nada más. Qué decepción. —Te mira por primera vez—. Has esperado. Casi nadie espera.' },
				] },
				{ text: '«¿Eso que tienes en el brazo es veneno?»', then: [
					{ af: { kaori: 1 } },
					{ say: 'kaori', text: 'Extracto de Gloom. Rebajado. —No aparta la vista del reloj—. Me has hecho perder la cuenta. Pero has preguntado lo correcto, así que te perdono a medias.' },
				] },
				{ text: '«¿Estás bien? Deberías ver a un médico.»', then: [
					{ af: { kaori: -1 } },
					{ say: 'kaori', text: 'Soy lo más parecido a un médico que hay en este edificio. —Pausa—. Y me has hecho perder la cuenta. Tendré que repetirlo. Gracias.' },
				] },
			] },
			{ say: 'kaori', text: 'Kaori. Boticaria del teatro. Curo torceduras, insolaciones, resfriados y egos heridos. Lo último no se me da bien.' },
			{ if: 'flag.b02_kaori_trigal', then: [{ say: 'kaori', text: 'Te recuerdo. Trigal. Llevabas un caramelo de esos en la mano. —Te mira las manos ahora, como buscándolo—. Sigue sin ser un caramelo.' }] },
			{ say: 'kaori', text: 'Supongo que vienes por los Eevee. Todo el mundo viene por los Eevee. Me dicen «maldición», me dicen «el otoño», me dicen «la torre». Ninguno me dice nada útil.' },
			{ choice: [
				{ text: '«He visto antes esa mirada. En el Encinar.»', then: [
					{ af: { kaori: 2 } },
					{ say: 'kaori', text: '…¿Dónde? —Por primera vez, la voz le cambia un poco. Un poco nada más—. Cuéntamelo. Todo. Despacio. No, rápido. No: a la velocidad a la que se cuentan las cosas exactas.' },
					{ text: 'Le cuentas lo de los desplazados apagados del Encinar. Ella apunta en una libreta con letra diminuta, sin levantar la vista.' },
					{ say: 'kaori', text: 'Entonces no es de aquí. Es algo que viaja. O alguien. Interesante. Odio lo interesante: siempre me quita el sueño.' },
				] },
				{ text: '«¿Y si de verdad es una maldición?»', then: [
					{ af: { kaori: -2 } },
					{ say: 'kaori', text: 'Las maldiciones no dejan residuo. Esto deja residuo. —Te mira como a un frasco mal etiquetado—. Vuelve a decir «maldición» delante de mí y te doy a probar lo del brazo.' },
				] },
				{ text: '«¿Cómo puedo ayudar?»', then: [
					{ say: 'kaori', text: 'Con los ojos. Y con la boca cerrada. Mira cosas. Dime lo que veas. No lo que creas que ves.' },
				] },
			] },
			{ say: 'kaori', text: 'No es una enfermedad. Las enfermedades tienen prisa. Esto es paciente. Esto es alguien que sabe lo que hace.' },
			{ say: 'kaori', text: 'Habla con las chicas. Mira el almacén. Mira el camerino nuevo, ese con la estrellita plateada que puso el patrocinador. Lo que encuentres, me lo traes. —Vuelve al reloj de arena—. Y si encuentras algo venenoso, no lo toques. Tráemelo entero.' },
			{ if: 'has("caramelolazo")', then: [{ text: 'En la mochila, el **Caramelo Lazo** de la Gira cruje cuando te mueves. {riolu} lo olfatea a través de la tela y enseña los dientes.', cond: LUC }, { text: 'En la mochila, el **Caramelo Lazo** de la Gira cruje cuando te mueves.', cond: '!(' + LUC + ')' }] },
		],
		b02_kaori_investiga: [
			{ say: 'kaori', text: '¿Algo? —No levanta la vista del mortero—. Las chicas, el almacén, el camerino. Tráeme hechos. Los hechos no se ofenden.' },
			{ if: 'flag.b02_pista_kimono', then: [{ say: 'kaori', text: 'Ya sé que las estrellas comieron otra cosa. Me falta saber qué.' }] },
			{ if: 'flag.b02_pista_almacen', then: [{ say: 'kaori', text: 'Polvo azul en el almacén. Bien. Polvo azul sin origen no me sirve.' }] },
			{ if: 'has("caramelolazo") && !flag.b02_kaori_caramelo', then: [{ say: 'kaori', text: '…Y llevas en la mochila algo que huele demasiado dulce. Lo noto desde aquí.' }] },
		],
		b02_kaori_caramelos: [
			{ say: 'kaori', text: 'Huele. —Se gira despacio hacia tu mochila, como un Arbok hacia un ratón—. Llevas uno de esos caramelos de la Gira. Lo noto desde que entraste. Dámelo.' },
			{ choice: [
				{ text: 'Darle tus Caramelos Lazo.', then: [
					{ set: { 'flag.b02_kaori_caramelo': true } },
					{ af: { kaori: 6 } },
					{ take: 'caramelolazo', cond: 'has("caramelolazo")' },
					{ take: 'caramelolazo', cond: 'has("caramelolazo")' },
					{ take: 'caramelolazo', cond: 'has("caramelolazo")' },
					{ take: 'caramelolazo', cond: 'has("caramelolazo")' },
					{ take: 'caramelolazo', cond: 'has("caramelolazo")' },
					{ text: 'Le das la bolsita entera. Kaori la agarra con dos dedos, como quien agarra una araña, y la abre sobre un plato de porcelana.' },
					{ text: 'Desenvuelve un caramelo. Lo parte con un cuchillito. Lo huele. Lo raspa. Pone las raspaduras bajo una lupa enorme con montura de latón.' },
					{ text: 'Se queda quieta. Muy quieta.' },
					{ say: 'kaori', text: 'Oh. Esto es… precioso. Mortal, pero precioso.' },
					{ text: 'Bajo la lupa, entre los cristalitos de azúcar, brilla un polvo fino, azul pálido. Brilla solo. Sin luz.' },
					{ say: 'kaori', text: 'Esto no es azúcar. Es mineral. Molido muy fino, para que el cuerpo lo absorba. —Mira la lupa, mira el caramelo, mira la lupa—. Me faltan dos cosas: de dónde viene y quién lo reparte.' },
					{ text: '{riolu} se aparta del plato y estornuda con desprecio. Kaori lo mira con algo parecido al respeto.', cond: LUC },
					{ say: 'kaori', text: 'Tu Pokémon tiene mejor criterio que la mitad de esta ciudad.', cond: LUC },
					{ say: 'kaori', text: 'Y si no lo has comido tú… ni se lo has dado a nadie… —Te mira—. Bien. No eres idiota. Eso me ahorra trabajo.' },
				] },
				{ text: '«No. Es un regalo de la Gira.»', then: [
					{ af: { kaori: -1 } },
					{ say: 'kaori', text: 'Un regalo. —Lo dice como si fuera el nombre de una enfermedad—. Muy bien. Sigue buscando a pie, entonces. Tardarás más. Ellos tienen tiempo. —Señala a los Eevee—. Creo.' },
				] },
			] },
		],
		b02_pista_kimono: [
			{ set: { 'flag.b02_pista_kimono': true } },
			{ text: 'Te sientas en el borde del escenario con las Chicas Kimono. Hablan bajito, por turnos, como si se hubieran puesto de acuerdo para no llorar a la vez.' },
			{ say: 'chica_kimono', as: 'Chica Kimono mayor', text: 'Primero fue Momiji, la Eevee de Sakura. Luego la mía. Luego todas. En una semana. Primero dejaron de bailar. Luego dejaron de comer. Ahora solo… están.' },
			{ say: 'chica_kimono', as: 'Chica Kimono pequeña', text: 'Las de las otras compañías están bien. Solo nosotras. Las «estrellas». —Lo dice con rabia—. Así nos llamó el señor del patrocinio.' },
			{ choice: [
				{ text: '«¿Comieron algo distinto esa semana?»', then: [
					{ say: 'chica_kimono', as: 'Chica Kimono mayor', text: '…Sí. Un premio. Una caja de dulces especiales para las estrellas, de parte de la fundación del patrocinador. Nosotras no los probamos. Eran «solo para Pokémon». Para «estrechar el vínculo».' },
				] },
				{ text: '«¿Alguien dice que es una maldición?»', then: [
					{ say: 'chica_kimono', as: 'Chica Kimono pequeña', text: 'Los sabios. Dicen que la Torre Quemada está despierta. Que se oyen ruidos por las noches. —Baja la voz—. Ruidos de máquina. Los fantasmas no tienen máquinas, ¿no?' },
					{ say: 'chica_kimono', as: 'Chica Kimono mayor', text: 'Y una caja de dulces. Una caja especial para las estrellas, de parte de la fundación del patrocinador. Kaori no nos dejó tirarla.' },
				] },
			] },
			{ say: 'chica_kimono', as: 'Chica Kimono mayor', text: 'Los caramelos que sobraron siguen en el camerino nuevo. El de la estrella. Y Kaori dice que en el almacén hay algo raro, pero no nos deja entrar.' },
			{ text: 'Una de las Eevee levanta la vista hacia {riolu}. Solo un segundo. Luego vuelve a bajar la cabeza.', cond: LUC },
		],
		b02_pista_almacen: [
			{ set: { 'flag.b02_pista_almacen': true } },
			{ text: 'Detrás del biombo, el almacén: abanicos, sombrillas, cajas de kimonos, maquillaje, un baúl de tambores. Todo ordenado. Todo menos una cosa.' },
			{ text: 'En el suelo, junto a la puerta trasera, hay un rastro de polvo fino. Azul pálido. Brilla un poco en la penumbra, sin luz que lo haga brillar.' },
			{ text: 'Lo conoces. Lo has visto antes, a mucha distancia de aquí: en las paredes de la **Cueva Brillante**, en Kalos. Los cristales que Melia y el Team Flare arrancaban de la roca.' },
			{ text: 'Los que, según ella, «no se cansaban».', cond: 'flag.b01_enc_melia_1' },
			{ text: '{riolu} acerca el hocico al polvo y retrocede de golpe, con un gruñido sordo. El pelaje del lomo, de punta.', cond: LUC },
			{ say: 'rotom', text: '¡Bzzt! Firma espectral compatible con… los cristales de la Cueva Brillante. Compatible al 91 %. Qué casualidad tan grande. A mí no me gustan las casualidades grandes.' },
			{ text: 'El rastro sale por la puerta trasera, hacia un callejón. En el barro del callejón, huellas de ruedas pequeñas. Como de carretilla. Van hacia el noroeste. Hacia la Torre Quemada.' },
		],
		b02_pista_caja: [
			{ set: { 'flag.b02_pista_caja': true } },
			{ text: 'El camerino nuevo huele a pintura fresca. Hay un espejo con bombillas, un ramo de flores de plástico y, sobre el tocador, una caja de cartón azul y plata, abierta.' },
			{ text: 'Dentro quedan una docena de **Caramelos Lazo**. En la tapa, una tarjeta impresa: «Para nuestras estrellas, con cariño. Fundación **Raíces de Johto**, en colaboración con Lemnis».' },
			{ text: 'Le das la vuelta a la caja. En la base hay una etiqueta de envío, medio arrancada: «Remite: Taller R.J. · **Torre Quemada, acceso posterior** · Iris». Y debajo, en otra etiqueta más vieja, pegada encima de algo: «Destino: por asignar».' },
			{ text: '«Destino: por asignar.» Las mismas palabras. Las de las jaulas de Lemnis en la Ruta 5 de Kalos.' },
			{ say: 'rotom', text: '¡Bzzt! «Fundación Raíces de Johto». Busco… Sin página web. Sin dirección. Sin teléfono. Solo un número de cuenta. Es la fundación más tímida que he visto nunca.' },
			{ intel: { npc: 'kaori', text: 'Los Caramelos Lazo de las «estrellas» del teatro los regaló la Fundación Raíces de Johto, «en colaboración con Lemnis». Remite: un taller en la Torre Quemada.' } },
		],
		b02_kaori_deduce: [
			{ say: 'kaori', text: 'Dime.' },
			{ if: 'flag.b02_pista_kimono', then: [{ text: 'Le cuentas lo de las Chicas Kimono: la caja de dulces solo para las «estrellas».' }] },
			{ if: 'flag.b02_pista_almacen', then: [{ text: 'Le cuentas lo del almacén: el polvo azul, las huellas hacia la torre.' }] },
			{ text: 'Le enseñas la tarjeta de la caja: «Fundación Raíces de Johto, en colaboración con Lemnis». Y la etiqueta: «Torre Quemada, acceso posterior».' },
			{ if: '!flag.b02_kaori_caramelo', then: [
				{ text: 'Kaori toma un caramelo de la caja del camerino que le traes, lo parte, lo raspa y lo pone bajo su lupa de latón. Se queda muy quieta.' },
				{ say: 'kaori', text: 'Oh. Esto es… precioso. Mortal, pero precioso.' },
				{ text: 'Bajo la lupa, entre el azúcar, brilla un polvo azul pálido. Brilla solo.' },
			] },
			{ if: 'flag.b02_kaori_caramelo_trigal', then: [{ say: 'kaori', text: 'El caramelo que me diste en Trigal lo abrí por el camino, en una posada. Polvo azul, entre el azúcar. Brilla solo. —Pausa—. Oh. Era… precioso. Mortal, pero precioso. Lo dije en voz alta. Un señor se cambió de mesa.' }] },
			{ say: 'kaori', text: 'Muy bien. Juntemos.' },
			{ say: 'kaori', text: 'Un mineral azul, molido fino. Mezclado con azúcar para que un Pokémon se lo coma con gusto. Y un envoltorio que promete «estrechar el vínculo».' },
			{ say: 'kaori', text: 'No estrecha nada. Le quita algo al Pokémon. No sé el qué. Las ganas, el brillo, lo que lo hace bailar. Y no se queda en el caramelo. Se va. A algún sitio.' },
			{ choice: [
				{ text: '«Ese polvo es de los cristales de la Cueva Brillante, en Kalos.»', then: [
					{ af: { kaori: 3 } },
					{ say: 'kaori', text: '¿Kalos? —Te mira de verdad, por primera vez—. Entonces alguien trae piedras de otra región, las muele en una torre quemada y se las da a los Pokémon de las bailarinas. Con una tarjeta de felicitación.' },
					{ say: 'kaori', text: 'Es lo más elaborado que he visto nunca. Me ofende un poco. Y me encanta un poco.' },
				] },
				{ text: '«¿Puedes curarlos?»', then: [
					{ say: 'kaori', text: 'Curar, no. Todavía. Puedo frenarlo. Darles algo para que el cuerpo deje de soltar lo que sea que suelta.' },
				] },
			] },
			{ text: 'Kaori ya está moviéndose. Saca frascos de una estantería sin mirar, como quien toma sus propias manos: raíz de algo, polvo de algo, una baya Meloc machacada, un líquido amarillo que huele a tormenta.' },
			{ text: 'Mezcla. Hierve. Prueba una gota en la venda del brazo. Espera diez segundos. Asiente.' },
			{ cutscene: { bg: { type: 'indoor', wall: '#7a2a2a', floor: '#c9a46a' }, start: 'dark', frames: [
				{ actors: [{ id: 'kaori', at: 'left' }, { mon: 'eevee', at: 0.68, size: 's', enter: 'fade' }], text: 'Kaori se arrodilla en el escenario, delante de los cinco cojines, con un cuenco humeante. Moja la punta de un pincel y la acerca al hocico de la primera Eevee.' },
				{ actors: [{ key: 'eevee', do: 'nod' }], cam: 'push', text: 'La Eevee no se mueve. Luego, muy despacio, saca la lengua. Una vez.' },
				{ on: 'eevee', fx: ['glow', 'sparkle'], text: 'En sus ojos aparece una chispa. Pequeña. Pero aparece.' },
				{ actors: [{ key: 'kaori', dim: true }, { key: 'eevee', do: 'bob' }], text: 'La Chica Kimono pequeña se tapa la boca con las dos manos.' },
			] } },
			{ say: 'kaori', text: 'Antídoto parcial. Las sostiene. No las cura. —Se levanta y se sacude el kimono—. Tardará. Me encanta.' },
			{ say: 'kaori', text: 'Para hacer uno de verdad necesito el origen. Polvo sin pisar, sin mezclar. Del sitio donde lo muelen.' },
			{ say: 'kaori', text: 'La Torre Quemada. «Acceso posterior». —Te mira el brazo, luego la cara—. No voy a ir yo. No me gustan las escaleras ni la gente armada. Tú pareces de los que no saben decir que no. Úsalo.' },
			{ choice: [
				{ text: '«Te traeré una muestra.»', then: [
					{ af: { kaori: 2 } },
					{ say: 'kaori', text: 'Bien. Entera. Sin tocarla con los dedos. Y sin probarla. —Pausa—. Eso es cosa mía.' },
				] },
				{ text: '«¿Y si es peligroso?»', then: [
					{ say: 'kaori', text: 'Lo es. Por eso vas tú y no las chicas. —Pausa—. Lleva a tu Pokémon delante. Ve lo que tú no ves. Se le nota.' },
				] },
			] },
			{ quest: 'b02_t_kaori', stage: 'muestra' },
			{ quest: 'b02_m5', stage: 'torre' },
			{ intel: { npc: 'kaori', text: 'Boticaria del Teatro de Danza. Prueba venenos en su brazo izquierdo. Ha frenado lo de los Eevee con un antídoto parcial. Necesita una muestra del polvo azul de la Torre Quemada para un antídoto completo.' } },
			{ af: { kaori: 3 } },
		],
		b02_kaori_espera: [
			{ say: 'kaori', text: 'La muestra. Torre Quemada. Sótano. —Remueve algo en un cazo sin mirarte—. Las Eevee aguantan. No tanto como yo querría.' },
		],
		b02_kaori_entrega: [
			{ take: 'muestralab' },
			{ text: 'Le das el frasquito del sótano. Kaori lo sostiene con las dos manos, despacio, como quien sostiene un pájaro herido. Lo levanta a la luz. El polvo azul brilla dentro, solo, sin luz.' },
			{ say: 'kaori', text: 'Sin mezclar. Sin pisar. Perfecto. —Y por primera vez, muy poco, sonríe. Casi no se nota. Se nota—. Ahora sí puedo trabajar.' },
			{ say: 'kaori', text: 'No es un antídoto para esto. Es para lo que sea que hay detrás. Lo que les quita las ganas de vivir. Porque esto no es lo único, ¿verdad? Lo del Encinar. Lo de aquí. Habrá más.' },
			{ text: 'No contestas. No hace falta. Ella asiente.' },
			{ say: 'kaori', text: 'Tardará. Meses. Años, quizá. —Guarda el frasco en una caja forrada de terciopelo, como una joya—. Me encanta.' },
			{ text: 'Luego se queda mirándote un rato. Demasiado rato. Con los ojos entrecerrados, como quien lee la etiqueta de un frasco muy pequeño.' },
			{ say: 'kaori', text: 'Has bajado a un sótano lleno de gente armada por unas Eevee que no son tuyas. Para traerme polvo. —Pausa—. Es lo menos sensato que he visto esta semana. Y esta semana me bebí un extracto de Gloom.' },
			{ choice: [
				{ text: '«¿Eso es un cumplido?»', then: [
					{ af: { kaori: 2 } },
					{ say: 'kaori', text: 'Es un diagnóstico. —Se gira hacia los frascos—. Los cumplidos no se me dan bien. Los diagnósticos, sí.' },
				] },
				{ text: '«Lo haría otra vez.»', then: [
					{ af: { kaori: 1 } },
					{ say: 'kaori', text: 'Lo sé. Ese es el problema. —No se gira—. Uno de ellos.' },
				] },
				{ text: '«Las Eevee se lo merecían.»', then: [
					{ af: { kaori: 2 } },
					{ say: 'kaori', text: 'Sí. —Pausa larga—. Y tú no has dicho «yo». Interesante.' },
				] },
			] },
			{ text: 'Kaori abre un cajón, saca algo envuelto en papel de arroz y te lo pone en la mano sin mirarte.' },
			{ say: 'kaori', text: 'Para ti. No es veneno. Lo he comprobado. Dos veces. —Pausa—. En mí.' },
			{ give: 'lumberry' },
			{ text: 'Debajo de la venda del brazo izquierdo, en la piel que asoma, hay dos manchitas nuevas, rojas. Recientes. No dices nada. Ella tampoco.' },
			{ af: { kaori: 6 } },
			{ quest: 'b02_t_kaori', stage: 'abierto' },
			{ set: { 'flag.b02_kaori_muestra': true } },
		],
		b02_kaori_generico: [
			{ if: 'flag.b02_kaori_muestra', then: [
				{ say: 'kaori', text: 'No me interrumpas. —Está mirando el frasco azul bajo la lupa—. …Bueno. Treinta segundos. Ya. Hola.' },
				{ say: 'kaori', text: 'El polvo cambia con la luna. No me preguntes cómo lo sé. Te lo diré igual: he dormido aquí cuatro noches.' },
			], else: [
				{ say: 'kaori', text: 'La muestra sigue siendo cosa tuya. Las Eevee siguen siendo cosa mía. Así está bien repartido.' },
			] },
		],
		b02_eevee_1: [
			{ text: 'Los cinco Eevee, acurrucados, con los ojos abiertos y vacíos. Les acercas la mano. Ninguno la huele.' },
			{ text: '{riolu} se sienta a su lado, muy cerca, sin tocarlos. Como haciendo compañía.', cond: LUC },
		],
		b02_eevee_2: [
			{ text: 'Los Eevee siguen en sus cojines, pero ahora, cuando te acercas, uno mueve una oreja. Otro mueve la cola. Una vez. Muy despacio. Es poco. Las Chicas Kimono lo celebran como si fuera un baile entero.' },
		],
		b02_eevee_3: [
			{ text: 'Una Eevee te ve llegar, baja del cojín de un salto torpe y viene a olerte los zapatos. Luego vuelve corriendo. A medio camino se acuerda de que está cansada y se sienta. Pero ha corrido.' },
			{ text: '{riolu} le aguanta la mirada un segundo y luego se tumba en el suelo, panza arriba. La Eevee, muy seria, se le sube encima.', cond: LUC },
		],
		b02_kimono_generico: [
			{ say: 'chica_kimono', text: 'Kaori dice que no nos preocupemos. Lo dice con la misma cara con la que dice que va a llover. Nunca sé si es bueno.' },
		],
		b02_kimono_despues: [
			{ say: 'chica_kimono', as: 'Chica Kimono mayor', text: 'El año que viene bailaremos. Me lo ha prometido Momiji. Bueno, me ha mordido el dedo. Que en Eevee es lo mismo.' },
			{ say: 'chica_kimono', as: 'Chica Kimono pequeña', text: 'El señor del patrocinio vino ayer a traer «una caja nueva». Kaori le tiró un cazo. Lleno.' },
		],
		b02_almacen_generico: [
			{ text: 'El almacén. Alguien ha barrido el polvo azul. Alguien que sabía lo que barría: hay un frasco con una etiqueta de letra diminuta, «NO TOCAR. K.».' },
		],
		b02_camerino_generico: [
			{ text: 'El camerino de las estrellas. La estrella plateada de la puerta tiene ahora un tachón encima, a rotulador. Debajo, alguien ha escrito «enfermería».' },
		],
		b02_programa: [
			{ give: 'programateatro' },
			{ text: 'Tomas un programa de mano. Lo lees por encima: la Danza de Otoño, las cinco bailarinas, las cinco Eevee. Y, abajo del todo, un logotipo azul y plata.' },
		],

		// =================== GIMNASIO DE IRIS · MORTI ===================
		b02_gym_iris_suelo: [
			{ set: { 'flag.b02_gym_iris_suelo': true } },
			{ text: 'Cruzas la puerta y la oscuridad te traga. No ves tus propias manos. No ves el suelo. Solo, muy al fondo, una vela.' },
			{ say: 'rotom', text: '¡Bzzt! Activo la linterna… La linterna dice que está activada. La oscuridad dice que no.' },
			{ choice: [
				{ text: 'Avanzar con cuidado, tanteando con el pie.', then: [
					{ text: 'Tanteas. El suelo está. Tanteas otra vez. Está. Tanteas una tercera vez y no está, y una mano huesuda te agarra del cuello y te devuelve al sitio.' },
					{ say: 'voz_fondo', as: 'Voz en la oscuridad', text: 'Por ahí no. Por ahí está el sótano de los aprendices. Tienen colchonetas, pero se quejan.' },
				] },
				{ text: 'Dejar que {riolu} vaya delante.', cond: LUC, then: [
					{ happy: { who: 'riolu', n: 3 } },
					{ text: '{riolu} cierra los ojos. Las orejas le vibran. Da un paso, otro, un saltito a la izquierda, otro a la derecha. Tú pisas donde pisa. El suelo siempre está.' },
					{ say: 'voz_fondo', as: 'Voz en la oscuridad', text: '…Vaya. Ese no mira el suelo. Mira lo que hay debajo. Interesante.' },
				] },
				{ text: 'Quedarte quiet{o|a|e} y esperar.', then: [
					{ text: 'Esperas. Poco a poco, los ojos se acostumbran. No ves el suelo, pero ves las huellas que han dejado otros en el polvo: un camino zigzagueante hacia la vela.' },
				] },
			] },
		],
		b02_gym_aprendiz_mt: [
			{ set: { 'flag.b02_mt_pulso': true } },
			{ say: 'aprendiz_iris', text: '¿Vienes a por Morti? Te voy a dar un consejo, aunque no deberíamos: a los fantasmas les dan miedo las cosas oscuras. Las de verdad. No los fantasmas.' },
			{ say: 'aprendiz_iris', text: 'Toma. Me la regalaron en el Centro Comercial de Trigal y yo solo tengo un Gastly. Y le tengo cariño.' },
			{ give: 'mt_pulsoumbrio' },
			{ say: 'rotom', text: '¡Bzzt! **Pulso Umbrío**, tipo Siniestro. Y Lucario lo puede aprender. Lo digo por nada. Por todo.' },
		],
		b02_morti_espera: [
			{ text: 'Al fondo, junto a la vela, una silueta de pie, con una cinta en la frente. No se mueve. Entre tú y él, oscuridad y dos entrenadores que te esperan en el camino invisible.' },
			{ say: 'morti', text: 'Te veo. Tú todavía no me ves. Ven por el camino. El camino también te ve.' },
		],
		b02_morti_reto: [
			{ text: 'Llegas a la vela. Detrás hay un joven pálido, rubio, con una cinta morada en la frente y una bufanda morada. Te mira como si ya te conociera de algo. Como si te hubiera visto llegar hace días.' },
			{ say: 'morti', text: 'Morti. Líder de Iris. —No te tiende la mano. Se queda mirando un punto por encima de tu hombro—. Traes cosas contigo. No en la mochila.' },
			{ say: 'morti', text: 'Has estado donde el tiempo se dobla. En un bosque. Hace poco. Todavía lo llevas pegado en la ropa, como el olor a humo.' },
			{ choice: [
				{ text: '«El Encinar. Perdí tres días.»', then: [{ say: 'morti', text: 'No los perdiste. Se los quedó alguien. —Pausa—. Perdona. A veces digo cosas que no entiendo. Mi abuelo decía que es lo más honesto que se puede hacer.' }] },
				{ text: '«¿Cómo lo sabes?»', then: [{ say: 'morti', text: 'Mis fantasmas lo notan. Les gusta. Las cosas que se doblan son su sitio favorito para esconderse.' }] },
				{ text: 'No decir nada.', then: [{ say: 'morti', text: 'Bien. El silencio también es una respuesta. La mejor, casi siempre.' }] },
			] },
			{ if: 'flag.b02_torre_hecha', then: [
				{ say: 'morti', text: 'Y has bajado a la torre. Lo noto. El llanto se ha callado. Gracias. Llevaba días sin dormir.' },
			], else: [
				{ say: 'morti', text: 'Otra cosa. —La vela tiembla—. Algo bajo la Torre Quemada lleva días llorando. No es un fantasma. Los fantasmas lloran de otra manera.' },
			] },
			{ say: 'morti', text: 'Mi familia lleva generaciones esperando a que la Torre Campana se abra. Yo entreno para ver lo que otros no ven. Hoy quiero ver lo que tú no me enseñas.' },
			{ battle: 'morti_g5', onWin: [
				{ say: 'morti', text: '…Ya está. Ya lo he visto.' },
				{ text: 'Su Gengar, debilitado, se le sube a los hombros y te sonríe por encima de su cabeza. Morti no parece darse cuenta. O sí, y le da igual.' },
				{ say: 'morti', text: 'Tu compañero no tiene miedo a lo que no ve. Lo siente. Eso no se entrena. Eso se tiene, o te elige.' },
				{ say: 'morti', text: 'La **Medalla Niebla**. Para quien ve a través.' },
				{ badge: 'medalla_niebla' },
				{ cap: 42 },
				{ quest: 'b02_m6', done: true },
				{ toast: 'Tope de nivel: 42' },
				{ say: 'morti', text: 'Y esto. Mi Dusclops dice que te lo dé. No sé para qué. Él sí.' },
				{ give: 'reapercloth' },
				{ say: 'rotom', text: '¡Bzzt! **Tela Terrible**. Hace evolucionar a cierto Pokémon fantasma si la lleva al intercambiarse. Nosotros no intercambiamos. Pero queda bonita en la mochila.' },
				{ intel: { npc: 'morti', text: 'Líder de Iris (Fantasma). Ve cosas. Notó que estuviste «donde el tiempo se dobla» y que algo bajo la Torre Quemada «lloraba». Su familia espera desde hace generaciones a que se abra la Torre Campana.' } },
				{ if: '!flag.b02_torre_hecha', then: [{ say: 'morti', text: 'Ahora ve a la torre. Ya. Lo que llora no puede esperar a que yo tenga razón.' }] },
			] },
		],
		b02_morti_despues: [
			{ say: 'morti', text: 'Esta mañana he visto algo en lo alto de la Torre Campana. Plumas. No se lo he dicho a nadie. Ahora te lo he dicho a ti. Qué raro. Ya está dicho.' },
			{ if: 'flag.b02_fin', then: [{ say: 'morti', text: 'Te vas. Lo noto. Volverás. Eso también lo noto, pero no te lo voy a decir para que no te confíes.' }] },
		],

		// =================== PATIO / MÉDIUM ===================
		b02_medium_dados: [
			{ text: 'Un médium joven, con túnica y unas gafas redondas, agita un dado de veinte caras dentro de un cuenco de cerámica.' },
			{ say: 'medium', as: 'Médium Valentín', text: '«Un entrenador se acerca al médium. El médium lo mira con sus ojos que ven más allá.» …Perdona, es que narro. Desde pequeño. Mi madre dice que es un don. Mi padre dice que es un problema.' },
			{ say: 'medium', as: 'Médium Valentín', text: 'Voy a tirar para ver qué te depara el destino. —Tira. El dado rueda, rueda, rueda…— ¡Veinte natural! ¡Crítico! Te espera algo enorme. O muy pequeño. El dado no es muy concreto.' },
			{ choice: [
				{ text: '«¿Y si sale un uno?»', then: [{ say: 'medium', as: 'Médium Valentín', text: 'Si sale un uno, me rompo el tobillo bajando las escaleras de la torre. Me ha pasado dos veces. El dado no miente.' }] },
				{ text: '«¿Tú qué ves, de verdad?»', then: [
					{ say: 'medium', as: 'Médium Valentín', text: '…De verdad, de verdad, veo que la torre lleva días con luz en el sótano. —Deja el dado—. Pero eso no lo ve un médium. Eso lo ve cualquiera que pase de noche. Nadie pasa de noche.' },
				] },
			] },
			{ say: 'medium', as: 'Médium Valentín', text: 'Bueno. Has llegado hasta aquí, el médium te mira, los fantasmas contienen la respiración… ¿Cómo quieres hacerlo?' },
		],

		// =================== TORRE QUEMADA ===================
		b02_torre_sabio: [
			{ say: 'sabio', text: 'Ahí abajo no hay nada. —Se pone delante del agujero—. Bueno: hay escombros. Y ceniza. Y un generador que no es de nadie. Pero nada.' },
			{ say: 'sabio', text: 'Vete. Vuelve cuando tengas un motivo. Los curiosos sin motivo se caen por los agujeros. Los que tienen motivo, también, pero con más dignidad.' },
		],
		b02_torre_eco: [
			{ set: { 'flag.b02_torre_eco': true } },
			{ text: 'En un rincón de la planta baja, donde la ceniza es más gruesa, hay huellas. Grandes. Cuatro patas. Tres rastros distintos que salen del centro de la torre y se separan, cada uno hacia una grieta del muro.' },
			{ text: 'La ceniza dentro de las huellas está fundida, como vidrio negro. Hace ciento cincuenta años que nadie las pisa. Y siguen calientes.' },
			{ text: 'Por el tejado hundido entra una ráfaga de viento. Viene del norte. Fría, limpia, con olor a agua de lluvia. Las hojas rojas se levantan del suelo en un remolino, giran tres veces alrededor de las huellas y caen.' },
			{ text: '{riolu} se queda inmóvil, con las orejas apuntando al norte. Durante un segundo, en su mirada hay algo muy antiguo. Luego parpadea y vuelve a ser {riolu}.', cond: LUC },
			{ say: 'rotom', text: '¡Bzzt! Registro… nada. Ningún Pokémon en la zona. Solo viento. —Pausa—. Viento muy educado.' },
		],
		b02_torre_eco_2: [
			{ text: 'Las huellas siguen en la ceniza, fundidas y tibias. El viento del norte no ha vuelto. Pero tienes la sensación de que sabe que estás aquí.' },
		],
		b02_irene_runas: [
			{ set: { 'flag.b02_irene_iris': true } },
			{ text: 'En una viga caída hay una hilera de símbolos tallados: formas que parecen ojos, manos y letras deformes. Medio borrados por el fuego.' },
			{ if: LUC, then: [
				{ text: '{riolu} se acerca, apoya la palma sobre la talla y cierra los ojos. Uno a uno, los surcos se encienden de azul, de izquierda a derecha, como alguien que lee con el dedo.' },
				{ text: 'Se apagan todos menos uno. El último. Brilla un poco más que los demás, y {riolu} aparta la mano de golpe, como si quemara.' },
			], else: [
				{ text: 'Rotom los fotografía desde tres ángulos. No entiendes nada. Rotom tampoco.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! ¡Llamada entrante por holomisor! «Dra. Irene Solberg». Ha visto mi foto en la red de la Policía Internacional. Contesta, que suena impaciente. Las llamadas también suenan.' },
			{ say: 'irene', text: '{jugador}. —Detrás de ella, estanterías y un flexo; es de noche en Sinnoh—. Esas runas. ¿Dónde estás? No, ya lo sé: la foto tiene geolocalización. Torre Quemada, Iris. Johto. Escritura de la familia de las Ruinas Alfa.' },
			{ say: 'irene', text: 'Son Unown. Bueno, no Unown: son lo que los Unown copiaron. O lo que copió a los Unown. Hay un debate. Yo tengo razón en el debate, pero eso no viene al caso.' },
			{ if: LUC, then: [
				{ say: 'irene', text: '¿Tu compañero las ha encendido? ¿Todas? —Se acerca tanto a la cámara que solo se le ve un ojo—. ¿Cuál ha brillado más? ¿La última? Enséñamela.' },
				{ text: 'Rotom enfoca la última runa.' },
				{ say: 'irene', text: '…«Tomar».' },
				{ say: 'irene', text: 'Como en la Torre Maestra de Yantra. Allí estaban raspadas. Alguien las borró a propósito, hace siglos. Aquí no las rasparon. —Silencio—. Aquí las quemaron. Con la torre entera.' },
			], else: [
				{ say: 'irene', text: 'La última. Amplía la última. —Rotom amplía—. …«Tomar». Como en la Torre Maestra. Allí las rasparon. Aquí, al parecer, prefirieron quemar la torre entera.' },
			] },
			{ choice: [
				{ text: '«¿Alguien quemó la torre para borrar una palabra?»', then: [
					{ af: { irene: 2 } },
					{ say: 'irene', text: 'Es una hipótesis. Una hipótesis terrible, preciosa y sin fuentes. —Se le iluminan los ojos—. Es lo más emocionante que me ha pasado en meses, y eso que el mes pasado encontré un palimpsesto en una caja de zapatos, que es… —Se detiene en seco—. Perdona. Me emociono.' },
				] },
				{ text: '«Tomar… ¿qué?»', then: [
					{ af: { irene: 3 } },
					{ say: 'irene', text: 'Esa es la pregunta. Siempre es esa. En la gramática de estas runas, «tomar» va siempre con un complemento. Aquí el complemento está… —Entorna los ojos— …quemado. Claro. Qué oportuno. Qué fastidio. Qué maravilla.' },
				] },
				{ text: '«Irene, son las tres de la mañana en Sinnoh.»', then: [
					{ af: { irene: 1 } },
					{ say: 'irene', text: 'Las tres y cuarto. Y estoy perfectamente. —Bosteza—. Eso ha sido un bostezo científico. Para oxigenar.' },
				] },
			] },
			{ say: 'irene', text: 'Pídele a Rotom que me mande todo lo que haya en esa viga. Todo. Y {jugador}… no dejes que nadie más vea cómo las lee tu compañero. No sé por qué te lo digo. Sí lo sé. No te lo voy a explicar por holomisor.' },
			{ text: 'Cuelga. Rotom envía las fotos. Luego, sin que nadie se lo pida, las borra de su memoria interna. Dice que «por espacio».' },
		],
		b02_runas_despues: [
			{ text: 'La viga quemada, con sus runas. La última, «tomar», todavía tiene un leve tono azul en el fondo del surco, como una brasa que no termina de apagarse.' },
		],

		// =================== SÓTANO · ATENEA · MELIA ===================
		b02_sotano_llegada: [
			{ set: { 'flag.b02_sotano_visto': true } },
			{ text: 'Bajas por la escalera de mano. Abajo hace calor. Huele a azúcar quemado, a ozono y, por debajo de todo, a miedo. El miedo tiene olor. {riolu} lo sabe antes que tú.' },
			{ text: 'Un laboratorio improvisado. Morteros eléctricos. Sacos de azúcar. Una cinta transportadora que escupe Caramelos Lazo, uno detrás de otro, envueltos en azul y plata. Y cajas: cajas y cajas con la etiqueta «Fundación Raíces de Johto».' },
			{ text: 'Al fondo, en la penumbra, una pared de jaulas. Dentro hay Pokémon. No se mueven.' },
			{ if: LUC, then: [
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#7fd6e0' }, start: 'dark', frames: [
					{ actors: [{ mon: '{riolu}', key: 'rio', at: 'center', enter: 'left' }], cam: 'still', text: '{riolu} se detiene al pie de la escalera. Cierra los ojos.' },
					{ cam: 'push', fx: 'glow', text: 'Las orejas se le levantan. Los apéndices de detrás de la cabeza empiezan a vibrar, y a su alrededor se enciende un halo azul, débil, como una llama de gas.' },
					{ weather: 'sparks', text: 'Lo ves a través de él. Por un instante, lo ves todo: las jaulas, y dentro de cada jaula, una lucecita. Pequeñas. Muy pequeñas. Parpadeando.' },
					{ fx: 'shake', text: 'Y de cada lucecita sale un hilo fino, casi invisible, que cruza el sótano y se pierde en los sacos de polvo azul.' },
					{ weather: 'none', actors: [{ key: 'rio', do: 'step', emote: 'anger' }], text: '{riolu} abre los ojos. Gruñe. No es miedo. Es otra cosa.' },
				] } },
				{ happy: { who: 'riolu', n: 5 } },
			] },
			{ say: 'rotom', text: '¡Bzzt! Cuento… once Pokémon en las jaulas. Constantes vitales: bajas. Muy bajas. Etiquetas en las jaulas: «Destino: por asignar». —Pausa—. No me gustan estas etiquetas. Nunca me han gustado.' },
			{ text: 'Tres reclutas del Team Rocket se interponen entre tú y el fondo. Detrás de ellos, oyes dos voces de mujer. Discuten.' },
		],
		b02_sotano_voces: [
			{ text: 'Al fondo, detrás de los reclutas, dos voces de mujer. Una suave y cortante. Otra fría como un cristal.' },
			{ say: 'voz_fondo', as: 'Voz fría', text: 'Le he traído lo que pidió. No pienso dejarlo en una cocina.' },
			{ say: 'voz_fondo', as: 'Voz suave', text: 'Es un sótano, querida. Las cocinas tienen ventanas.' },
		],
		b02_sotano_respirar: [
			{ text: 'Te sientas en un saco de azúcar. Respiras. {riolu} se sienta a tu lado, con la espalda pegada a tu brazo.' },
			{ heal: 'Tu equipo recupera el aliento. Los ojos de {riolu} brillan en la penumbra.' },
		],
		b02_atenea: [
			{ text: 'Al fondo del laboratorio, junto a una pila de cajas, dos mujeres discuten frente a frente, con un maletín metálico en una mesa entre las dos.' },
			{ text: 'Una lleva un uniforme blanco con una **R** roja en el pecho y una melena roja larguísima.' },
			{ text: 'La otra lleva un abrigo largo, gafas de sol en un sótano y el pelo rosa cortado a cuchilla. Es **Melia**. La de la Cueva Brillante. La de Crómlech.' },
			{ say: 'melia', text: 'Me dijeron que el comprador era serio. Que entendía lo que vendo. —Pone una mano enguantada sobre el maletín—. Esto no se deja junto a unos caramelos.' },
			{ say: 'atenea', text: 'Y a mí me dijeron que la vendedora sería discreta. Qué semana de decepciones. —Te ve. Sonríe—. Y además tenemos visita. Qué detalle. Pasa, pasa. Atenea, del Team Rocket, para servirte. ¿Has venido a por un caramelo?' },
			{ text: 'Melia se gira. Se baja las gafas un centímetro. Te reconoce.' },
			{ say: 'melia', text: 'Tú. Siempre tú. Siempre donde no debes. —Mira a {riolu}—. Y tu Pokémon de otra parte. Tiene la luz muy alta. Demasiado alta para este sitio.', cond: LUC },
			{ say: 'melia', text: 'Tú. Siempre tú. Siempre donde no debes.', cond: '!(' + LUC + ')' },
			{ choice: [
				{ text: 'Antes de nada, ocuparte de tu equipo.', then: [
					{ text: 'Das un paso atrás y revisas a tu equipo un segundo. Atenea suspira, como quien espera a que alguien se ate los zapatos.' },
					{ heal: true },
				] },
				{ text: '«Esos caramelos están enfermando a los Pokémon de Iris.»', then: [
					{ say: 'atenea', text: 'Esos caramelos están pagando el alquiler de veinte familias. Cada uno elige qué número le importa más.' },
					{ text: 'Mientras habla, {riolu} se coloca delante de ti. Te da tiempo a revisar a tu equipo.', cond: LUC },
					{ heal: true },
				] },
			] },
			{ say: 'atenea', text: 'Mira. Cuando Giovanni desapareció, la Liga detuvo a los jefes y dejó a los demás en la calle. Chicos de diecisiete años con una R en la camiseta y ningún sitio adonde ir. Nadie vino a buscarlos. Nadie.' },
			{ say: 'atenea', text: 'Yo sí. Uno por uno. Deudas, abogados, madres que no querían saber nada. La familia cuesta dinero, ¿sabes? Y alguien nos ofreció dinero.' },
			{ say: 'atenea', text: 'Así que no. No vas a romperme la cocina. —Saca una Poké Ball—. Honchkrow, enséñale a este pajarito cómo vuelan los de casa.' },
			{ battle: 'atenea_1', onWin: [
				{ call: 'b02_atenea_despues' },
			] },
		],
		b02_atenea_despues: [
			{ text: 'El Honchkrow de Atenea cae sobre una pila de cajas, que se derrumban. Los Caramelos Lazo se esparcen por el suelo como canicas azules.' },
			{ say: 'atenea', text: '…Vaya. —Recoge a su Honchkrow sin prisa y se arregla el pelo—. No está mal. Nada mal.' },
			{ text: 'Una de las cajas se ha abierto al caer. Dentro no hay caramelos: hay **sacos de polvo azul**, brillando solos en la penumbra. Cada saco lleva una etiqueta impresa: «Fundación Raíces de Johto · Material de origen · Kalos».' },
			{ text: 'Melia se queda mirando los sacos. No se mueve. Ni siquiera parece respirar.' },
			{ say: 'melia', text: '…Eso es mío.' },
			{ say: 'atenea', text: '¿Perdón?' },
			{ say: 'melia', text: 'Esos cristales los arranqué yo. En la Cueva Brillante. Con mis propias manos y las de mi gente. Para la belleza del mundo nuevo. —Le tiembla la voz. Solo un poco—. No para… caramelos.' },
			{ say: 'atenea', text: 'Ah. —Atenea sonríe despacio, con algo que casi es lástima—. No te lo dijeron. Claro que no te lo dijeron.' },
			{ say: 'atenea', text: 'Nuestro amigo común es muy generoso, querida. A ti te paga por sacar las piedras. A mí me paga por molerlas. Y a la fundación esa le paga por regalarlas. Todo sale de la misma cuenta. Siempre ha salido de la misma cuenta.' },
			{ say: 'melia', text: 'Mientes.' },
			{ say: 'atenea', text: 'Mira las etiquetas. Mira las cajas. Mira el azul. —Se encoge de hombros—. Tú le llamas «benefactor». Yo le llamo «cliente». Él nos llama a las dos «proveedores». Lo pone en las facturas.' },
			{ text: 'Melia toma uno de los sacos. Lee la etiqueta. Le da la vuelta. En la base hay otra etiqueta, más pequeña, con un símbolo que conoces muy bien: una lemniscata. ∞. Azul y plata.' },
			{ say: 'melia', text: '…«La belleza será para todos». Eso me dijeron. Para todos.' },
			{ text: 'Durante un segundo no parece Melia, la admin fría del Team Flare. Parece alguien que ha llegado tarde a una estación y ve el tren alejarse.' },
			{ say: 'atenea', text: 'Bueno. Esto ha sido muy instructivo. —Silba. Los tres reclutas aparecen detrás de ella—. Chicos, nos vamos. Dejen la cocina. Agarren solo lo suyo. La familia primero.' },
			{ choice: [
				{ text: '«No te vas a ir sin más.»', then: [
					{ say: 'atenea', text: 'Claro que sí. Tú tienes once Pokémon en jaulas que no aguantarán ni una hora más ahí dentro. Yo tengo una puerta trasera. Elige.' },
				] },
				{ text: 'Mirar las jaulas.', then: [
					{ say: 'atenea', text: 'Exacto. Mira las jaulas. Nosotros no las llenamos, ¿sabes? Llegan así. Apagados. Nos pagan por guardarlas. No preguntamos. —Pausa—. Ahora pregúntate tú quién las manda.' },
				] },
			] },
			{ say: 'atenea', text: 'Una cosa, pequeñ{o|a|e} entrometid{o|a|e}. —Se detiene en la puerta trasera—. El tipo de la gabardina que viene escaleras abajo. Dile que la próxima vez se compre un disfraz que no sea de sabio. Los sabios no corren.' },
			{ text: 'Y se va. Los reclutas la siguen. El último, el más joven, se vuelve y te hace un gesto con la cabeza. Casi una disculpa.' },
			{ intel: { npc: 'atenea', text: 'Admin del Team Rocket. Fabricaba Caramelos Lazo en el sótano de la Torre Quemada para la «Fundación Raíces de Johto». Motivo: pagar las deudas de los reclutas abandonados tras la disolución («la familia»). Dice que Lemnis les paga a ella y a Melia: «Todo sale de la misma cuenta».' } },
			{ intel: { npc: 'melia', text: 'Llevó a Johto un objeto robado de la Central de Kalos para vendérselo a «otro cliente del benefactor». Descubrió que los cristales que extraía en la Cueva Brillante acababan en caramelos. Su devoción se ha roto un poco.' } },
			{ call: 'b02_jaulas' },
		],
		b02_jaulas: [
			{ text: 'Las jaulas. Once. Cada una con un candado electrónico y una lucecita roja.' },
			{ if: LUC, then: [
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#7fd6e0' }, start: 'dark', frames: [
					{ actors: [{ mon: '{riolu}', key: 'rio', at: 'center', enter: 'left' }], text: '{riolu} camina hasta la pared de jaulas, despacio, y se detiene en el centro.' },
					{ cam: 'push', fx: 'glow', text: 'Abre los brazos. El halo azul vuelve a encenderse, más fuerte que antes, más fuerte que nunca. Le sube por los brazos como fuego frío.' },
					{ weather: 'sparks', shake: 1, fx: 'flash', text: 'Los once candados chisporrotean a la vez. Las lucecitas rojas se apagan.' },
					{ weather: 'none', fx: ['light', 'ripple'], text: 'Las puertas se abren solas. Y el aura de {riolu} no se apaga: se extiende, despacio, hacia dentro de cada jaula, como una manta.' },
					{ actors: [{ key: 'rio', at: 0.17, size: 's' }, { mon: 'skitty', at: 0.42, size: 's', enter: 'pop' }, { mon: 'wooper', at: 0.65, size: 's', enter: 'pop' }, { mon: 'pichu', at: 0.86, size: 's', enter: 'pop', do: 'hop' }], cam: 'pull', text: 'Una Skitty levanta la cabeza. Un Wooper abre los ojos. Un Pichu estornuda. No es mucho. Pero vuelven a estar aquí.' },
				] } },
				{ happy: { who: 'riolu', n: 10 } },
				{ text: '{riolu} se tambalea. Le pones una mano en el hombro y se apoya en ti, jadeando, con una sonrisa muy rara en la cara. Una sonrisa de Lucario.' },
			], else: [
				{ text: 'Buscas el panel de los candados. Rotom lo hackea en cuatro intentos («¡bzzt! la contraseña era "familia"; qué gente tan previsible»). Las puertas se abren. Dentro, los Pokémon levantan la cabeza, muy despacio.' },
			] },
			{ text: 'En la mesa del fondo, entre morteros, queda un frasco de cristal sellado lleno de polvo azul. Sin mezclar. Sin pisar. Como lo quería Kaori.' },
			{ cutscene: { bg: { type: 'lab' }, start: 'dark', frames: [
				{ cam: 'push', item: 'muestralab', fx: 'glow', text: 'Lo levantas con cuidado, sin tocar la tapa con los dedos. Dentro, el polvo brilla solo. Late. Muy despacio. Al mismo ritmo, te parece, que las lucecitas que {riolu} vio en las jaulas.' },
			] } },
			{ give: 'muestralab' },
			{ call: 'b02_fragmento' },
		],
		b02_fragmento: [
			{ text: 'Melia sigue de pie junto a la mesa. Ha abierto el maletín metálico. Dentro, sobre espuma negra, hay un trozo de metal oscuro, del tamaño de una mano, con vetas que brillan en azul y plata.' },
			{ say: 'rotom', text: '¡Bzzt! Ese objeto coincide con la descripción del robo en la **Central de Kalos**. «Componente de red, sin identificar». Lo buscan la Policía Internacional, Lemnis y, según mi agenda, media Kalos.' },
			{ say: 'melia', text: 'Lo saqué de la Central. Para él. Iba a ser mi regalo. Mi prueba de que el Team Flare seguía siendo útil. —Lo mira como quien mira una carta de amor que nunca debió escribir—. Y él tenía a otro comprador esperando. Para lo mismo. Al mismo precio, seguramente.' },
			{ text: '{riolu} se acerca al maletín. Las vetas azules del metal se encienden un poco más, como si lo reconocieran. {riolu} enseña los dientes. El metal late. Al mismo ritmo que el polvo. Que las jaulas.', cond: LUC },
			{ text: 'Melia cierra el maletín de golpe. Luego, para tu sorpresa, te lo tiende.' },
			{ say: 'melia', text: 'Tómalo. No quiero tocarlo más. Todo lo que he tocado para él estaba sucio y no me di cuenta.' },
			{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#7fd6e0' }, start: 'dark', frames: [
				{ cam: 'still', text: 'Abres el maletín. Sacas el fragmento con las dos manos.' },
				{ color: '#7fd6e0', cam: 'push', item: 'fragmentored', fx: 'glow', text: 'Está tibio. Pesa más de lo que parece. Las vetas azules y plateadas se encienden bajo tus dedos, como venas.' },
				{ shake: 1, fx: ['shake', 'ripple'], text: 'Si lo acercas al oído, zumba. Muy bajito. Como una colmena muy lejos. Como algo que respira.' },
				{ fx: 'heartbeat', color: '#1f6a8a', cam: 'still', text: 'Por un segundo, juras que el zumbido dice tu nombre. Luego solo zumba.' },
			] } },
			{ give: 'fragmentored' },
			{ quest: 'b02_t_sera', stage: 'fragmento' },
			{ quest: 'b02_m5', stage: 'decision' },
			{ say: 'melia', text: 'Ahora escúchame. Esa pieza es parte de algo más grande. Una red. No sé de qué, no del todo. Sé que sin ella le falta un trozo. —Te mira—. Destrúyela. Déjame destruirla. Es lo único limpio que puedo hacer ya.' },
			{ text: 'Pasos en la escalera de mano. Alguien baja, muy deprisa, tropieza en el último peldaño y cae de culo sobre un saco de azúcar.' },
			{ say: 'handsome', as: 'Sabio sospechosamente grande', text: '¡Alto! ¡Soy un sabio! ¡Un sabio normal de la torre que ha bajado a… meditar! ¡Meditar fuertemente!' },
			{ text: 'Lleva una túnica de sabio dos tallas pequeña sobre una gabardina. Se le ve la gabardina. Se le ve todo.' },
			{ say: 'handsome', text: '…Ah. Eres tú. —Se quita la capucha—. Handsome sigue el rastro de esos caramelos desde Trigal. Handsome llega tarde. Handsome casi siempre llega tarde, pero llega.' },
			{ if: 'flag.b01_handsome', then: [{ say: 'handsome', text: 'En Crómlech confiaste en mí. Solo en mí. No se me ha olvidado.' }] },
			{ if: 'flag.b01_delatar', then: [{ say: 'handsome', text: 'Desde lo de Crómlech, tu cara sale en todos los periódicos de Kalos. La mía no. Prefiero la mía.' }] },
			{ text: 'Ve el fragmento en tus manos. Ve a Melia. Se pone muy serio. Muy, muy serio.' },
			{ say: 'handsome', text: 'Eso es la pieza de la Central. —Se levanta despacio, sin quitarle los ojos a Melia—. {jugador}. Esa pieza es la primera prueba física que tenemos. La primera. Con ella, alguien en la Policía Internacional tendrá que escucharme.' },
			{ say: 'melia', text: 'Con ella, alguien en la Policía Internacional se la devolverá a quien la fabricó. —Su voz es puro hielo—. Las órdenes se archivan solas, inspector. Pregúnteselo a su jefe.' },
			{ say: 'handsome', text: 'No soy inspector. Soy Handsome. —Pausa—. Y mi jefe no archiva nada que yo no le dé.' },
			{ say: 'rotom', text: '¡Bzzt! Llamada entrante…' },
			{ if: 'has("holomisorsera")', then: [
				{ text: 'No es Rotom. Es el **Holomisor** que te dio Serafina. Vibra en tu bolsillo con un zumbido discreto, caro.' },
			], else: [
				{ say: 'rotom', text: '…«Organización de la Gira · Línea privada». ¿Línea privada? Yo no tengo líneas privadas. Bueno, ahora sí.' },
			] },
			{ if: TRATO, then: [
				{ say: 'sera', text: '{jugador}. —Serafina, en un despacho blanco, sin un pelo fuera de sitio—. Mis sistemas registran el componente a menos de un metro de usted. Le encargué que lo encontrara. Lo ha encontrado. Excelente trabajo.' },
				{ say: 'sera', text: 'Ahora le pido que cumpla su parte. Tráigamelo. Lemnis lo custodiará donde debe estar. Teníamos un trato.' },
			], else: [
				{ say: 'sera', text: '{jugador}. —Serafina, en un despacho blanco, sin un pelo fuera de sitio—. No nos conocemos tanto como para que le llame, así que seré breve. Lleva usted en las manos una propiedad de Lemnis robada en Kalos.' },
				{ say: 'sera', text: 'Devuélvamela. No le pediré explicaciones sobre cómo la ha conseguido. Ni dónde. Ni con quién. Le doy mi palabra, que vale bastante.' },
			] },
			{ say: 'melia', text: 'Lemnis. Claro. —Ríe, sin ganas—. La señorita de los guantes blancos. «Custodiar». Igual que custodiaba mis cristales.' },
			{ text: 'Tres voces. Un fragmento tibio que zumba en tus manos. {riolu} te mira, esperando.', cond: LUC },
			{ text: 'Tres voces. Un fragmento tibio que zumba en tus manos.', cond: '!(' + LUC + ')' },
			{ choice: [
				{ text: 'Dárselo a Handsome. Es una prueba.', then: [{ call: 'b02_frag_handsome' }] },
				{ text: 'Devolvérselo a Serafina. Es de Lemnis.', then: [{ call: 'b02_frag_sera' }] },
				{ text: 'Dejar que Melia lo destruya.', then: [{ call: 'b02_frag_melia' }] },
			], prompt: '¿Qué haces con el fragmento?' },
			{ call: 'b02_torre_cierre' },
		],
		b02_frag_handsome: [
			{ set: { 'flag.b02_frag_handsome': true } },
			{ rep: { policia: 5, lemnis: -5 } },
			{ take: 'fragmentored' },
			{ text: 'Le das el fragmento a Handsome. Él lo toma con las dos manos, como si fuera de cristal, y lo envuelve en un pañuelo de cuadros.' },
			{ say: 'handsome', text: 'Gracias. —Lo dice bajito. Muy en serio—. Handsome no se va a olvidar de esto.' },
			{ say: 'handsome', text: 'Lo llevaré a Kalos en persona. Al inspector Lebrun. Él lo custodiará en el depósito de pruebas hasta que tengamos lo suficiente para ir a por ellos. Es un hombre muy cuidadoso, Lebrun. Siempre sabe dónde está todo.' },
			{ if: TRATO, then: [
				{ say: 'sera', text: '…Entiendo. —Una pausa larguísima—. Teníamos un trato, {jugador}. Lo recordaré. Usted también debería recordarlo.' },
			], else: [
				{ say: 'sera', text: 'Entiendo. —Ni una sola arruga en la voz—. La Policía Internacional. Qué decisión tan… previsible. Buenas noches.' },
			] },
			{ text: 'La llamada se corta.' },
			{ say: 'melia', text: 'Su jefe. —Mira a Handsome con algo parecido a la pena—. Ojalá sea tan cuidadoso como usted cree.' },
			{ say: 'handsome', text: 'Lo es. —Pero Handsome tarda un segundo de más en decirlo.' },
		],
		b02_frag_sera: [
			{ set: { 'flag.b02_frag_sera': true } },
			{ rep: { lemnis: 5, policia: -3 } },
			{ af: { sera: 5 } },
			{ af: { sera: 3 }, cond: TRATO },
			{ take: 'fragmentored' },
			{ text: '«Se lo devolveré a Lemnis.» Lo dices en voz alta.' },
			{ if: TRATO, then: [
				{ say: 'sera', text: '…' },
				{ say: 'sera', text: 'Cumplió. —Algo cambia en su voz; muy poco, pero cambia—. Lo recordaré.' },
				{ say: 'sera', text: 'Un equipo de seguridad llegará a la torre en diez minutos. Entrégueselo a ellos, en mano. No a nadie más. —Pausa—. Y {jugador}… gracias. Tú cumples lo que dices. Hay muy poca gente que lo haga.' },
				{ text: 'Te ha tuteado. No sabes si se ha dado cuenta. Sospechas que sí.' },
			], else: [
				{ say: 'sera', text: '…¿De verdad? —Por primera vez desde que la conoces, Serafina parece sorprendida. Dura medio segundo—. Muy bien. Un equipo de seguridad llegará en diez minutos.' },
				{ say: 'sera', text: 'No esperaba esto de usted. Lemnis tiene ahora una deuda con usted, {jugador}. Yo tengo una deuda con usted. —Apunta algo en una libreta, fuera de cámara—. Las deudas, yo las pago. Buenas noches.' },
			] },
			{ text: 'Diez minutos después, dos agentes de traje azul bajan por la escalera, recogen el fragmento con guantes, lo meten en una caja con el logo de la lemniscata y se van sin decir nada. Ni siquiera miran las jaulas.' },
			{ say: 'handsome', text: '…{jugador}. —Handsome no grita. Es peor—. Handsome entiende que tienes tus motivos. Handsome no los comparte. Handsome se va a tomar un té. Solo.' },
			{ say: 'melia', text: 'Le has devuelto su juguete al niño que lo rompió todo. —Se pone las gafas de sol—. Espero que te paguen bien. A mí también me pagaban bien.' },
		],
		b02_frag_melia: [
			{ set: { 'flag.b02_frag_melia': true } },
			{ rep: { flare: 10, policia: -2 } },
			{ take: 'fragmentored' },
			{ text: 'Le tiendes el fragmento a Melia. Ella lo mira. Te mira. Por primera vez desde que la conoces, no sabe qué decir.' },
			{ say: 'handsome', text: '¡{jugador}, no! ¡Es la única prueba que…!' },
			{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#7fd6e0' }, start: 'dark', frames: [
				{ actors: [{ id: 'melia', at: 'left' }, { mon: 'houndoom', at: 0.74, enter: 'pop', flip: true }], text: 'Melia deja el fragmento sobre la mesa de acero. Saca una Poké Ball del abrigo. Su Houndoom aparece con un gruñido que hace temblar las jaulas vacías.' },
				{ fx: 'sparkle', color: '#7fd6e0', cam: 'push', item: 'fragmentored', text: 'Las vetas azules del metal se encienden, rápidas, como si el fragmento supiera lo que va a pasar.' },
				{ weather: 'embers', color: '#ffb060', fx: ['flash', 'impact'], text: '«Lanzallamas.» A quemarropa. El metal se pone blanco.' },
				{ shake: 3, fx: 'shake', text: 'El fragmento se parte en tres. El zumbido se convierte en un chirrido, agudo, insoportable, que dura un segundo…' },
				{ weather: 'none', cam: 'still', actors: [{ key: 'houndoom', remove: true, exit: 'fade' }, { key: 'melia', dim: true }, { key: '_c', dim: true }], fx: 'dark', text: '…y se apaga. Las vetas se vuelven grises. El metal ya no está tibio.' },
			] } },
			{ give: 'fragmentoroto' },
			{ say: 'melia', text: 'Ya está.' },
			{ text: 'Se queda mirando los trozos un rato. Luego se gira hacia ti.' },
			{ say: 'melia', text: 'Te debo una. No me gusta deber cosas. Pero te debo una. —Escribe algo en una tarjeta negra y te la mete en el bolsillo de la chaqueta sin preguntar—. Si algún día necesitas saber qué hace el Team Flare, o qué le hacen al Team Flare… llama. Una vez.' },
			{ say: 'handsome', text: 'Era la primera prueba. La PRIMERA. —Se sienta en un saco de azúcar, con la cara entre las manos—. Handsome no está enfadado. Handsome está… profundamente enfadado.' },
			{ if: TRATO, then: [
				{ say: 'sera', text: '…Ha permitido que destruyan propiedad de Lemnis. Teníamos un trato, {jugador}. —Silencio—. Ya no lo tenemos. Buenas noches.' },
			], else: [
				{ say: 'sera', text: 'Interesante. —Una pausa muy medida—. Muy interesante. Lo apunto. Buenas noches.' },
			] },
			{ text: 'La llamada se corta.' },
		],
		b02_torre_cierre: [
			{ quest: 'b02_t_sera', stage: 'hecha', done: true },
			{ set: { 'flag.b02_torre_hecha': true } },
			{ if: 'flag.b02_frag_melia', then: [
				{ text: 'Melia se marcha por la puerta trasera, la misma que usó Atenea. Antes de salir, se detiene un segundo frente a los sacos de polvo azul. No dice nada. Les da una patada.' },
			], else: [
				{ text: 'Melia se marcha por la puerta trasera, sin despedirse. Antes de salir, se detiene un segundo frente a los sacos de polvo azul.' },
				{ say: 'melia', text: 'Dile a tu amiga la del teatro que el polvo no se cansa porque no es suyo el cansancio. Es de otros. Se lo quita a otros.' },
			] },
			{ text: 'Handsome se queda contigo. Ayuda a sacar a los once Pokémon de las jaulas, uno a uno, envueltos en tu chaqueta y en su túnica de sabio. Pesan muy poco.' },
			{ if: 'flag.b02_frag_handsome', then: [
				{ say: 'handsome', text: 'Buen trabajo, compañer{o|a|e}. Muy buen trabajo. —Te da una palmada en la espalda que casi te tira—. Los llevaremos al Centro Pokémon. Y luego, Handsome invita a fideos.' },
			], else: [
				{ say: 'handsome', text: 'No estoy de acuerdo con lo que has hecho. —Carga en brazos al Wooper, con muchísimo cuidado—. Pero estos once están fuera. Eso también cuenta. Handsome lo apunta en la columna de lo que cuenta.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! Llevamos once Pokémon al Centro. La enfermera Joy dice que se recuperarán. Despacio. Muy despacio. Pero que se recuperarán.' },
			{ quest: 'b02_m5', done: true },
			{ diary: 'Hoy mi entrenador{|a|e} y yo ayudamos a una boticaria muy seria, Kaori, con las Eevee del Teatro de Danza de Iris. Kaori dice que tardarán en ponerse bien, y que le encanta. No sé si le encanta que tarden o le encanta curar. Creo que las dos cosas.\n\nTambién visitamos la Torre Quemada. Está muy quemada (ji). Sopla un viento del norte muy educado y huele a lluvia. {riolu} estuvo muy valiente y muy cansado. Volvimos al Centro con un montón de amigos nuevos y dormimos todos juntos.\n\nIris es una ciudad preciosa. Aquí nadie tiene prisa. ¡Ojalá todos los días fueran así!', cond: 'flag.b01_diario' },
		],
		b02_jaulas_vacias: [
			{ text: 'Las jaulas, abiertas y vacías. En el suelo, una etiqueta rota: «Destino: por asignar».' },
			{ text: '{riolu} la pisa al pasar. Sin querer. O queriendo.', cond: LUC },
		],

		// =================== YSOLDE ===================
		b02_ysolde_iris: [
			{ set: { 'flag.b02_ysolde_iris': true } },
			{ quest: 'b02_t_vencejos', stage: 'abierto' },
			{ text: 'Sentada en el borde del tejado de la casa de té, con las piernas colgando y la capucha gris puesta, hay alguien que ya conoces. **Ysolde.** Un Fletchinder de plumas grises dormita en su hombro.' },
			{ say: 'ysolde', text: 'Sube. —No es una pregunta—. Por la escalera de los barriles. La de la izquierda no. La de la izquierda es para turistas.' },
			{ text: 'Subes. Desde el tejado se ve toda Iris: los faroles, los arces, el teatro con los farolillos encendidos. La Torre Quemada, negra contra el cielo, con el cordón policial alrededor.' },
			{ say: 'ysolde', text: 'Lo de abajo, bien hecho. Desde aquí se veía el humo del generador. Y la puerta trasera. Una pelirroja salió por ella con tres chicos. Corriendo hacia el sur. Les dejé ir. No eran mi encargo.' },
			{ say: 'ysolde', text: 'Un dato, ya que estás aquí. —Mira la torre—. El registro más viejo que tenemos los Vencejos en Johto es de esta ciudad. De la noche del incendio. Hace ciento cincuenta años.' },
			{ say: 'ysolde', text: 'Lo escribió un Ala, como yo. Una sola línea: «Esta noche alguien quiso algo que no se acaba. La torre ardió para que no lo consiguiera».' },
			{ choice: [
				{ text: '«¿Quién quería qué?»', then: [{ say: 'ysolde', text: 'Si lo supiéramos, no seguiríamos subidos a los tejados. —Se pone de pie—. Los Vencejos no vigilamos a una empresa. Vigilamos una idea. Las empresas pasan. La idea vuelve.' }] },
				{ text: '«La palabra de las runas era "tomar".»', cond: 'flag.b02_irene_iris', then: [{ say: 'ysolde', text: '…Eso no lo sabíamos. —Te mira con algo nuevo. Respeto, quizá—. Desde abajo también se ve. A veces mejor. Lo apunto.' }] },
			] },
			{ say: 'ysolde', text: 'Me voy. El carro de flores pasa a las seis y diez. —Se asoma al borde—. Hoy es de crisantemos. Huelen fatal. Pero son blanditos.' },
			{ text: 'Salta. Un segundo después, abajo, oyes un *flump*, un grito del florista y una disculpa muy educada. Cuando te asomas, solo queda una pluma gris sobre las flores.' },
		],

		// =================== GASPAR ===================
		b02_gaspar_intro: [
			{ text: 'En una esquina de la plaza, junto a un arce enorme, hay una cocina ambulante con un toldo de rayas. Delante, removiendo una olla con una cuchara de madera del tamaño de un remo, un hombre fornido con barba y delantal. **Gaspar.**' },
			{ say: 'gaspar', text: '¡Pero bueno! ¡Mira quién está aquí! ¡{jugador}! ¿Has comido? No contestes. No has comido. Se te nota en la cara y en el Pokémon.' },
			{ say: 'gaspar', text: 'Estoy con los dulces de Iris. Los de verdad, los de las abuelas: pastelitos con forma de hoja de arce, rellenos de crema, con almíbar por encima. Pero me faltan cosas.' },
			{ say: 'gaspar', text: '**Miel**, un **Bonguri Rosa** y **Leche Mu-mu**. Las rutas de por aquí están llenas de sitios donde la gente se deja cosas. Y al este, en la Ruta 42, dicen que hay un rancho. Tráemelas y comerás como un rey. Como un rey que tiene hambre.' },
			{ quest: 'b02_t_gaspar', stage: 'ingredientes' },
		],
		b02_gaspar_falta: [
			{ say: 'gaspar', text: '¿Qué tal va esa búsqueda? **Miel**, **Bonguri Rosa** y **Leche Mu-mu**. La crema sin leche es tristeza. La hoja de arce sin miel es papel. Y el almíbar sin Bonguri… es agua con ilusiones.' },
			{ if: 'has("honey")', then: [{ say: 'gaspar', text: 'La miel ya la llevas. Huele desde aquí. Bien.' }] },
			{ if: 'has("pinkapricorn")', then: [{ say: 'gaspar', text: 'Y ese Bonguri Rosa… Mira qué color. Parece que se ha puesto colorado de saber que va a ser postre.' }] },
			{ if: 'has("moomoomilk")', then: [{ say: 'gaspar', text: 'La leche también. Mírala, qué blanquita.' }], else: [{ say: 'gaspar', text: 'Para la leche, el rancho de la Ruta 42. Dicen que el ranchero es un señor que regala más de lo que vende.' }] },
		],
		b02_gaspar_cocina: [
			{ say: 'gaspar', text: '¡Eso es! ¡Eso es lo que necesitaba! ¡Trae, trae!' },
			{ take: 'honey', cond: 'has("honey")' },
			{ take: 'pinkapricorn', cond: 'has("pinkapricorn")' },
			{ take: 'moomoomilk', cond: 'has("moomoomilk")' },
			{ quest: 'b02_t_gaspar', stage: 'iris' },
			{ text: 'Gaspar se pone a trabajar. Bate la leche hasta que hace crema. Mezcla la miel con harina de castaña. Pela el Bonguri Rosa, lo hierve con azúcar y lo convierte en un almíbar del color del atardecer. Rellena unos moldes de hierro con forma de hoja de arce y los mete en el fuego.' },
			{ text: 'Huele a castaña, a miel, a otoño. Media plaza se ha parado a mirar. Dos Chicas Kimono se acercan con disimulo. Un sabio finge meditar a tres metros.' },
			{ say: 'gaspar', text: 'Prueba. Con valentía. Un dulce sin valentía es solo azúcar.' },
			{ text: 'Muerdes. La masa cruje por fuera, la crema está tibia por dentro, y el almíbar rosa llega al final, despacio, ácido y dulce a la vez, como una buena noticia que no te esperabas.' },
			{ text: '{riolu} se come el suyo en dos bocados y luego se queda mirando la bandeja con una intensidad que Gaspar interpreta, correctamente, como una petición formal.', cond: LUC },
			{ say: 'gaspar', text: '¿Ves? Comer bien es la mitad de la aventura. La otra mitad es tener con quién comer.' },
			{ say: 'gaspar', text: 'Te he preparado una caja para el camino. Ábrela cuando tu equipo esté cansado, o triste, o las dos cosas. Funciona. Siempre funciona.' },
			{ give: 'menujohto' },
			{ quest: 'b02_t_gaspar', done: true },
			{ say: 'gaspar', text: 'Y ahora te cuento un secreto: he oído que en Alola hay un cocinero que asa cosas dentro de la tierra. Bajo un volcán. Con hojas. —Se le iluminan los ojos—. Algún día tengo que ver eso. Y ganarle.' },
		],
		b02_gaspar_final: [
			{ say: 'gaspar', text: '¡{jugador}! ¿Ya te comiste el menú? No me lo digas. Si no te lo has comido, me ofendo. Si te lo has comido, me alegro. Mejor no saberlo.' },
			{ say: 'gaspar', text: 'Estoy aprendiendo a hacer «poké». Es de Alola. Pescado crudo con arroz y fruta. Mi estómago está en contra. Mi corazón, a favor.' },
		],

		// =================== RANCHO DE DON AURELIO ===================
		b02_rancho_llegada: [
			{ set: { 'flag.b02_rancho_llegada': true } },
			{ quest: 'b02_t_aurelio', stage: 'rancho' },
			{ text: 'Abres la cancela. El cencerro suena. Y el prado entero se gira a mirarte: cuarenta, cincuenta Mareep levantan la cabeza a la vez, con un *chss* de electricidad estática que te pone el pelo de punta.' },
			{ text: 'Una de ellas, con un lazo azul en el cencerro, sale disparada hacia ti balando como loca. **Copito.** Te reconoce. Se te sube a los pies y chisporrotea de alegría.', cond: 'done.b01_t_mareep' },
			{ text: 'Una de ellas, con un lazo azul en el cencerro, se acerca a olisquearte. **Copito.** La última vez que la viste estaba perdida entre los arbustos de Kalos. Alguien la trajo de vuelta.', cond: '!done.b01_t_mareep' },
			{ text: 'En el porche, en una mecedora, un anciano con sombrero de ala ancha y bigote blanco se pone de pie. Despacio. Apoyándose en el brazo de la mecedora.' },
			{ say: 'aurelio', text: '¡Muchach{o|a|e}! ¡Ha venido! ¡Ya decía yo que esa Mareep no se ponía así por un cartero!' },
			{ text: 'Baja los escalones del porche. A mitad de camino le da un golpe de tos, seco, que le dobla un poco. Se recupera enseguida, se aclara la garganta y te estrecha la mano con las dos suyas, fuertes, ásperas.' },
			{ say: 'aurelio', text: 'El polvo del heno. Esta época es mala. —Se ríe—. Bienvenid{o|a|e} al Rancho Prado. Pase, pase. Ya se lo enseño yo todo.' },
		],
		b02_aurelio_visita: [
			{ set: { 'flag.b02_rancho_hecho': true } },
			{ say: 'aurelio', text: 'Mire, mire. Esto es el rancho. Lo hizo mi abuelo con sus manos, y mi padre le puso el establo, y yo… yo le puse el cartel. Algo es algo.' },
			{ text: 'Te enseña el establo, el pozo, el huerto de zanahorias torcidas. Te presenta a cada Mareep por su nombre. Son cincuenta y tres. Se sabe los cincuenta y tres.' },
			{ text: 'Las que volvieron de Kalos contigo están juntas, en un rincón del prado: Copito, Borla, Nube, Algodón… y se acercan a ti en fila, como si te hubieran estado esperando.', cond: 'done.b01_t_mareep' },
			{ text: 'Las que se perdieron en Kalos están juntas, en un rincón del prado: Copito, Borla, Nube, Algodón… Don Aurelio volvió a por ellas él solo, con el silbato y mucha paciencia.', cond: '!done.b01_t_mareep' },
			{ if: 'flag.b01_candela_unida', then: [
				{ text: 'Cuando sacas a Candela de su Poké Ball, el rebaño entero se queda quieto. Luego, todas a la vez, empiezan a balar. Candela trota hacia ellas, frota la cabeza con Copito y las dos se iluminan, *chss*, como dos bombillas.', cond: 'inParty("mareep") || inParty("flaaffy") || inParty("ampharos")' },
				{ say: 'aurelio', text: '¡Mírela! ¡Se acuerdan! ¡Claro que se acuerdan! Una Mareep no olvida a nadie que le haya dado de comer. Ni a nadie que la haya querido. —Se le humedecen los ojos—. Ay, no me haga caso.', cond: 'inParty("mareep") || inParty("flaaffy") || inParty("ampharos")' },
				{ say: 'aurelio', text: '¿Y Candela? ¿No la trae? Bueno, la próxima vez. Las demás la echan de menos. Yo también. Un poquito.', cond: '!(inParty("mareep") || inParty("flaaffy") || inParty("ampharos"))' },
			], else: [
				{ text: 'Detrás de ellas, más pegada al establo, hay una Mareep que brilla. No mucho: una lucecita tenue, constante, en la punta de la cola. **Candela.** La que le tenía miedo a la oscuridad.' },
				{ say: 'aurelio', text: 'Candela ya no tiene miedo. Desde que usted la encontró en aquella cueva, brilla porque le da la gana. De día también. Las demás la siguen como a un farolillo.' },
			] },
			{ if: CHISPITA_FUERA, then: [
				{ text: 'Don Aurelio mira el rebaño. Cuenta con los dedos. Lo hace sin darse cuenta, como quien se toca un diente que le falta.' },
				{ say: 'aurelio', text: '…Y Chispita no. —Pausa—. Escribí a Lemnis. Tres veces. Me contestaron con un folleto. «Programa Raíces de Johto». Un folleto, muchach{o|a|e}. Por una Mareep.' },
				{ say: 'aurelio', text: 'Pero bueno. Los Mareep siempre vuelven. Siempre. Eso lo sabe todo el mundo en la Ruta 42.' },
			], else: [
				{ text: 'Y la última de la fila, la más pequeña, con un cencerro que pone «Chispita», se te mete entre las piernas y te da una descarga cariñosa que te hace saltar.' },
				{ say: 'aurelio', text: '¡Chispita! ¡Déjele, condenada! —Se ríe—. Desde que volvió no se separa de mí ni para dormir. Duerme en el porche, en mi sombrero. Me lo deja lleno de chispas.' },
			] },
			{ text: 'Por la tarde, el rebaño se dispersa por el prado y hay que recogerlo antes de que anochezca. Don Aurelio toma el silbato, sopla… y le da otro golpe de tos que le corta el silbido a la mitad.' },
			{ choice: [
				{ text: '«Déjeme, yo los recojo.»', then: [
					{ text: 'Tomas el silbato. Silbas. No pasa nada. Silbas más fuerte. Cincuenta y tres Mareep te miran con educación y siguen comiendo.' },
					{ text: '{riolu} suspira, se pone delante del rebaño y suelta un ladrido de aura. Cincuenta y tres Mareep trotan hacia el establo en perfecto orden.', cond: LUC },
					{ say: 'aurelio', text: '¡Ja! ¡Eso no lo hacía ni mi padre! —Se sienta en la cerca a mirar, todavía con la mano en el pecho—. Ya no estoy para estos trotes, muchach{o|a|e}. Antes los recogía yo solo, corriendo. Ahora los miro y ya me canso.' },
				] },
				{ text: 'Esperar a que se le pase la tos.', then: [
					{ text: 'Esperas. Don Aurelio se apoya en la cerca, respira hondo un par de veces y vuelve a soplar el silbato. Esta vez sale entero. El rebaño trota hacia el establo, sin prisa, como quien vuelve a casa.' },
					{ say: 'aurelio', text: 'Gracias por esperar. —Te guiña un ojo—. Ya no estoy para estos trotes, pero todavía soy capaz de silbar. Si me lo quitan, ¿qué me queda?' },
				] },
			] },
			{ if: 'quest.b02_t_gaspar == "ingredientes" && !has("moomoomilk")', then: [{ say: 'aurelio', text: '¿Leche Mu-mu para un cocinero de Iris? ¡Ja! Tengo dos Miltank que dan más de lo que bebo. Tome, llévesela. Y dígale a ese señor que si sus dulces no llevan valentía, que no vuelva.' }, { give: 'moomoomilk' }] },
			{ text: 'Cuando el sol se pone, se sientan en el porche. Él en la mecedora, tú en el escalón. Leche Mu-mu caliente en tazas desconchadas. Copito se duerme en tus pies. {riolu}, en el escalón de al lado, con la cabeza en tu rodilla.' },
			{ text: 'Los Mareep, en el establo, se iluminan uno a uno conforme oscurece. El rancho entero parece un pueblo de noche, visto desde una montaña.' },
			{ say: 'aurelio', text: 'Mi mujer decía que esto era lo mejor del día. Ella se sentaba ahí, donde está usted. Hace ya once años. —Le da un sorbo a la leche—. Las cosas buenas se quedan en los sitios. Por eso uno no se va de los sitios.' },
			{ text: 'Se queda callado un rato. Mirando el prado.' },
			{ say: 'aurelio', text: 'Oiga, muchach{o|a|e}. Una pregunta tonta. —No te mira—. ¿Usted sabe quién cuida de un rancho cuando el ranchero ya no puede?' },
			{ choice: [
				{ text: '«Usted puede todavía.»', then: [
					{ say: 'aurelio', text: 'Claro que puedo. Claro. —Se ríe, pero la risa le dura poco—. Era por preguntar. Uno a mi edad pregunta cosas. Es como hacer la lista de la compra: nunca sabes si vas a comprar, pero la haces.' },
				] },
				{ text: '«¿Tiene familia?»', then: [
					{ say: 'aurelio', text: 'Una sobrina, en Trigal. Trabaja en una oficina con aire acondicionado. Le dan alergia los Mareep. —Se encoge de hombros—. Y los de traje azul, que vienen con folletos. A esos no les doy ni los buenos días.' },
				] },
				{ text: 'Quedarte en silencio.', then: [
					{ text: 'No dices nada. Él tampoco. El silencio está bien. A veces el silencio es la respuesta más honrada.' },
					{ say: 'aurelio', text: '…Bueno. Ya se verá. Las cosas se ven solas, cuando llega el día.' },
				] },
			] },
			{ text: 'Don Aurelio se levanta, entra en la casa y vuelve con un cuaderno de tapas de cartón, gastado, atado con un cordel.' },
			{ say: 'aurelio', text: 'Tome. El cuaderno del rancho. Los nombres de todas, quién es hija de quién, cuándo se esquilan, qué comen cuando se ponen malas. Tengo otro. —Pausa—. Bueno, no tengo otro. Pero me lo sé de memoria.' },
			{ give: 'cuadernoaurelio' },
			{ say: 'aurelio', text: 'Es por si acaso. Por si alguna vez alguien le pregunta a usted. Usted ya sabe dónde está el rancho.' },
			{ text: 'Silba de nuevo, bajito, hacia el establo. De la oscuridad sale una luz. Grande. Amarilla. Una luz que se acerca andando, con pasos pesados y tranquilos.' },
			{ if: CHISPITA_FUERA, then: [
				{ text: 'No es el Ampharos. Es una Mareep diminuta, de la camada de primavera, que trota detrás de su madre. Su lana no es blanca: es **rosa**, rosa pálido, como el algodón de azúcar de las ferias. Brilla un poco más que las demás.' },
				{ say: 'aurelio', text: 'Mire. Nació el mes que me fui a Kalos. La crió mi vecina mientras yo no estaba. Es rosa. Rosa. En setenta años de rancho no he visto una igual.' },
				{ say: 'aurelio', text: 'Quiero que se la lleve. —Levanta una mano antes de que digas nada—. Chispita no está. Y no me gusta un rebaño con un hueco. Esta no la sustituye, que nadie sustituye a nadie. Pero que viaje con usted. Que vea mundo. Que, si un día se cruza con Chispita, le diga que aquí se la espera.' },
				{ say: 'aurelio', text: 'Por si acaso. Usted ya me entiende.' },
				{ pokemon: { sp: 'mareep', lv: 18, shiny: true, nature: 'timid', ability: 'static', happy: 180 } },
				{ set: { 'flag.b02_mareep_rosa': true } },
			], else: [
				{ text: 'Es un **Ampharos**. Alto, amarillo, con la cola rematada en una esfera roja que alumbra como un faro. Se planta delante del porche y te mira, muy serio, de arriba abajo.' },
				{ say: 'aurelio', text: 'Le presento a Faro. Lleva conmigo veinte años. Alumbra mejor que el faro de Olivo, y no lo digo yo, lo dice el farero. Cuando las Mareep se perdían de noche, él las traía de vuelta. A todas.' },
				{ say: 'aurelio', text: 'Quiero que se lo lleve. —Levanta una mano antes de que digas nada—. No me diga que no. Ya lo he hablado con él. Él quiere ver mundo. Y yo… yo ya no voy a enseñárselo.' },
				{ say: 'aurelio', text: 'Por si acaso. Por si alguna vez se pierde usted en una cueva, o en un bosque raro, o en una de esas puertas suyas. Que tenga una luz. Que alguien le traiga de vuelta.' },
				{ pokemon: { sp: 'ampharos', lv: 38, nick: 'Faro', nature: 'modest', ability: 'static', moves: ['thunderbolt', 'powergem', 'dragonpulse', 'cottonguard'], happy: 200 } },
				{ set: { 'flag.b02_ampharos': true } },
				{ text: 'El Ampharos le pone la mano en el hombro a Don Aurelio. Un segundo. Luego viene contigo y se coloca a tu lado, mirando el camino.' },
			] },
			{ say: 'aurelio', text: 'Bueno. Bueno, bueno. —Se suena con un pañuelo de cuadros, muy fuerte—. Es el polvo del heno. Ya le digo que esta época es mala.' },
			{ quest: 'b01_t_mareep', done: true },
			{ quest: 'b02_t_aurelio', stage: 'hecha', done: true },
			{ diary: 'Hoy mi entrenador{|a|e} y yo pasamos la tarde en el rancho de Don Aurelio, en la Ruta 42. ¡Tiene cincuenta y tres Mareep y se sabe el nombre de todas! Copito nos reconoció enseguida y se nos subió a los pies.\n\nDon Aurelio tose un poquito (dice que es el polvo del heno). Nos enseñó el establo, el huerto y el porche, y bebimos leche caliente mientras se encendían los Mareep uno a uno. Parecía un pueblo de noche visto desde una montaña. Es lo más bonito que he visto en Johto.\n\nNos ha regalado su cuaderno. Dice que es por si acaso. ¡Qué señor tan previsor!', cond: 'flag.b01_diario' },
			{ say: 'aurelio', text: 'Ande, váyase antes de que se haga de noche del todo. Iris le espera. Y vuelva. Que aquí siempre hay leche.' },
		],
		b02_aurelio_despues: [
			{ say: 'aurelio', text: '¡Muchach{o|a|e}! ¿Otra vez por aquí? Siéntese, siéntese. Hay leche.' },
			{ text: 'Se sienta en la mecedora. Tose un poco. Te sonríe como si no hubiera tosido.', cond: '!flag.b02_fin' },
			{ if: 'flag.b02_ampharos', then: [{ say: 'aurelio', text: '¿Y Faro? ¿Se porta bien? ¿Alumbra? Claro que alumbra. Es lo único que sabe hacer, y lo hace mejor que nadie.' }] },
			{ if: 'flag.b02_mareep_rosa', then: [{ say: 'aurelio', text: '¿Y la rosita? ¿Come bien? Ay, no me haga caso. Los rancheros somos así.' }] },
			{ say: 'aurelio', text: 'Las cosas buenas se quedan en los sitios, ¿se acuerda? Pues usted ya es una cosa buena de este sitio. Le guste o no.' },
		],
		b02_rebano: [
			{ text: 'El rebaño pasta en el prado. Cuando pasas cerca, las Mareep se apartan sin dejar de comer y, al rozarse, sueltan chispitas. Huele a hierba y a tormenta.' },
			{ text: '{riolu} se tumba en mitad del prado. En dos minutos tiene tres Mareep dormidas encima. No se mueve. No piensa moverse.', cond: LUC },
		],
		b02_copito: [
			{ text: 'Copito te ve y viene trotando. Lleva un lazo azul nuevo en el cencerro, mal atado, con mucho cariño.' },
			{ text: 'Te frota la cabeza contra la pierna, *chss*, y luego se sienta a tu lado, muy pegada, mirando hacia el porche. Hacia la mecedora.' },
		],

		// =================== FINAL DEL BLOQUE ===================
		b02_fin: [
			{ if: 'flag.b02_fin', then: [{ end: true }] },
			{ text: 'Esa noche, en Iris, no puedes dormir.' },
			{ text: 'Sales del Centro Pokémon. La ciudad está en silencio. Los faroles de papel rojo se mecen con el viento y las hojas de los arces caen despacio sobre las calles de piedra.' },
			{ text: 'El Teatro de Danza tiene la mitad de los farolillos encendidos. Desde dentro llega, muy bajito, el sonido de una flauta. Alguien ensaya. Y unas patitas que siguen el ritmo. Mal. Pero lo siguen.' },
			{ if: 'flag.b02_kaori_muestra', then: [{ text: 'En la ventana de la botica hay luz. Una silueta con el pelo recogido inclinada sobre una lupa. No levanta la vista. No esperabas que la levantara.' }] },
			{ if: 'flag.b02_frag_handsome', then: [
				{ text: 'El holomisor vibra. Un mensaje de Handsome: «Ya en Kalos. Entregado a Lebrun en mano. Lo ha guardado él mismo, muy cuidadoso. Gracias otra vez. H.». Y, debajo: «P.D.: Lebrun te manda saludos. Dice que Iris en otoño es preciosa».' },
			] },
			{ if: 'flag.b02_frag_sera', then: [
				{ text: 'Rotom vibra. Un mensaje sin remitente, con una lemniscata plateada como firma: «Recibido. Intacto. Gracias. — S.». Nada más. Lo relees tres veces, buscando algo más. No hay nada más.', cond: TRATO },
				{ text: 'Rotom vibra. Un mensaje de la «Organización de la Gira»: «La señorita Lemnis le agradece su colaboración y le comunica que ha sido inscrito en el programa de beneficios VIP de la Gira». Debajo, en otro color, como añadido a mano: «Le debo una. S. L.».', cond: '!(' + TRATO + ')' },
			] },
			{ if: 'flag.b02_frag_melia', then: [
				{ text: 'En el bolsillo de la chaqueta todavía está la tarjeta negra de Melia. Por detrás, en tinta plateada, un número de teléfono y tres palabras: «Una vez. Úsala».' },
				{ text: 'En la mochila, los tres trozos grises del fragmento ya no zumban. Ya no están tibios. Pesan como piedras normales. Eso, de algún modo, es peor.' },
			] },
			{ text: 'Rotom vuelve a vibrar. Esta vez es Rhi: «¿Ya tienes la quinta? Yo sí. Desde ayer. Te llevo un día de ventaja, novat{o|a|e}. Bueno, {jugador}. Bueno, novat{o|a|e}. Ya veré».' },
			{ text: 'Y otra vez. Una notificación de la Gira, para todos los inscritos.' },
			{ say: 'rotom', text: '¡Bzzt! «Aviso a los participantes: esta noche, a las 2:17, la **Puerta Lemnis de Trigal** ha registrado un salto sin pasajeros. Nadie la ha cruzado. Les rogamos que no se acerquen a ella hasta nuevo aviso. Es un simple desajuste de calibración».' },
			{ say: 'rotom', text: '…«Un simple desajuste de calibración». Eso ya lo había oído. Lo tengo en la memoria. En la de Luminalia.' },
			{ text: 'Caminas sin rumbo hasta que las calles se acaban, al pie de la Torre Campana. Dorada, cerrada, altísima. La cadena del candado brilla bajo la luna.' },
			{ cutscene: { time: 'noche', bg: { type: 'town', roofs: ['#5a2f24', '#7a3a2a', '#3d2a22'], far: '#2a2438' }, start: 'dark', frames: [
				{ actors: [{ mon: '{riolu}', key: 'rio', at: 0.3, enter: 'left' }], cam: 'pan-up', text: '{riolu} se detiene a tu lado. Mira hacia arriba. Hacia el último piso de la torre.' },
				{ on: false, color: '#ffb040', cam: 'pan-up', fx: 'glow', text: 'Allí arriba, en lo más alto, se enciende una luz. No es un farol. Es dorada y roja, y se mueve, como un fuego con alas que respirara despacio.' },
				{ cam: 'still', text: 'La luz se queda quieta. Te mira. Los mira. Lo sabes sin saber cómo.' },
				{ fx: ['light', 'aura'], text: '{riolu} levanta una pata. Despacio. Con la palma abierta hacia la torre. A su alrededor se enciende el halo azul, tranquilo, como una respuesta.' },
				{ fx: 'glow', on: false, color: '#ffb040', text: 'La luz dorada parpadea una vez. Como si devolviera el saludo.' },
				{ cam: 'pan-down', fx: 'dark', text: 'Y se apaga. Cae una pluma. Pequeña, rojiza, con el borde dorado. El viento del norte se la lleva antes de que toque el suelo.' },
			] } },
			{ text: '{riolu} baja la pata. Te mira. Por primera vez en todo el viaje, no parece que esté protegiéndote. Parece que está esperando a ver qué haces tú.' },
			{ text: 'Vuelven al Centro Pokémon despacio. Las hojas rojas crujen. A lo lejos, hacia el suroeste, hacia Trigal, el cielo tiene un brillo violeta muy débil. Puede que sea la ciudad. Puede que no.' },
			{ set: { 'flag.b02_fin': true } },
			{ diary: 'Hoy mi entrenador{|a|e} y yo dimos un paseo nocturno por Iris. ¡Qué ciudad tan bonita de noche! Los faroles son rojos, las hojas son rojas y hasta el cielo, por un ratito, se puso rojo y dorado encima de la Torre Campana. Debía de ser una fiesta.\n\n{riolu} saludó a la torre. ¡Qué educado! Yo también saludé, pero no tengo manos, así que parpadeé la pantalla.\n\nHa sido un viaje largo por Johto, con un bosque raro, un pozo lleno de Slowpoke, caramelos, un rancho precioso y amigos nuevos. Estoy muy orgulloso de mi entrenador{|a|e}. Mañana será otro día. ¡Seguro que es un día estupendo!', cond: 'flag.b01_diario' },
			{ save: true },
			{ text: '**Fin del Acto II (primera parte).**' },
			{ text: '*La historia continúa…*' },
		],
	},

	// =====================================================================
	// NPCs genéricos de este tramo
	// =====================================================================
	npcs: {
		nino_houndour: { name: 'Niño del Houndour', generic: true, look: { hair: 'spiky', hairColor: '#3a2a1e', outfit: '#c4473a', outfit2: '#2b2b38', skin: 2, eyesStyle: 'happy', mouth: 'grin' } },
		senora_te: { name: 'Señora del puesto de té', generic: true, look: { hair: 'bun', hairColor: '#cfd6e2', outfit: '#7a3a2a', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'sleepy', mouth: 'smile' } },
		voz_fondo: { name: 'Voz', generic: true, look: { hair: 'bald', hairColor: '#111118', outfit: '#111118', outfit2: '#1a1626', skin: '#1a1626', eyesStyle: 'sleepy', mouth: 'flat', bg: '#0e0c16' } },
		aprendiz_iris: { name: 'Aprendiz del gimnasio', generic: true, look: { hair: 'short', hairColor: '#1c1a2a', outfit: '#4a4f6a', outfit2: '#8c6cd0', skin: 0, eyesStyle: 'normal', mouth: 'open' } },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		programateatro: { name: 'Programa del Teatro de Danza', pocket: 'key', desc: 'Un programa de mano de papel de arroz, con un arce pintado en la portada. En la contraportada, un logotipo azul y plata.',
			read: '**Teatro de Danza de Iris · Danza de Otoño**\n\nSesenta años de tradición. Cinco bailarinas. Cinco Eevee. Un solo baile, «la hoja que no quiere caer», que se representa la primera semana de otoño desde que el teatro se reconstruyó tras el gran incendio.\n\n*Las bailarinas: Sakura y Momiji · Tsubaki y Kiku · Ume y Hana · Ayame y Sora · Yuri y Kaze.*\n\nAbajo, en letra más pequeña: «Este año, por primera vez, la Danza de Otoño cuenta con el patrocinio de **Lemnis** y de la **Fundación Raíces de Johto**, que obsequiarán a nuestras estrellas con un regalo muy especial».\n\nAlguien ha tachado «estrellas» con lápiz y ha escrito encima, con letra diminuta y muy recta: «pacientes».' },
		muestralab: { name: 'Muestra del sótano', pocket: 'key', desc: 'Un frasco de cristal sellado, del tamaño de un pulgar, lleno de un polvo azul pálido que brilla solo en la oscuridad. Si lo miras mucho rato, parece latir. Kaori la quiere entera.' },
		fragmentoroto: { name: 'Fragmento destruido', pocket: 'key', desc: 'Tres trozos de metal oscuro, con las vetas grises y apagadas. Están fríos. Ya no zumban.',
			read: 'Los tres trozos del fragmento de la red, envueltos en un pañuelo. Las vetas que antes brillaban en azul y plata son ahora grises, como ceniza.\n\nEn la cara interna de uno de los trozos, donde el metal se partió, se ve un grabado diminuto que antes estaba escondido: una lemniscata, y al lado, un código.\n\n**N-02.**' },
		cuadernoaurelio: { name: 'Cuaderno del rancho', pocket: 'key', desc: 'Un cuaderno de tapas de cartón, gastado, atado con un cordel. Huele a heno y a leche. La letra es grande, redonda y temblorosa.',
			read: '**RANCHO PRADO — Libro de las ovejas** (que son Mareep, pero mi abuelo decía ovejas)\n\nCopito — hija de Nieve y de Trueno. Le gusta que le rasquen detrás de la oreja izquierda. La derecha no.\nBorla — glotona. Si falta zanahoria, mirar a Borla.\nNube — duerme mucho. No está mala. Es así.\nCandela — le da miedo la oscuridad. (Tachado: *le daba*.)\nAlgodón — la más lista. Abre la cancela con el hocico.\nChispita — la más chica. Asustadiza. Si se pierde, buscar donde haya ruido de gente feliz.\n\n*Esquilar en primavera. Nunca con tormenta. Si se ponen malas: miel tibia, leche, paciencia. Si no mejoran: más paciencia.*\n\n*Faro — Ampharos. Veinte años. Mejor que el faro de Olivo. Se lo he dicho al farero. No le ha gustado.*\n\nEn la última página, con otra tinta, más reciente:\n\n*Comprar jarabe para la tos. Llamar a la sobrina. (No llamar a los del folleto.)*\n\nY debajo, solo una palabra, escrita y vuelta a escribir encima varias veces, como quien no se decide:\n\n*¿Quién?*' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		bonguri_r36: {
			name: 'Árbol de Bonguri', icon: '🌰', hours: 20, picks: [1, 3],
			text: 'Sacudes el árbol con cuidado. Caen unos cuantos Bonguris, redondos y duros, de colores.',
			wait: 'El árbol todavía no ha dado Bonguris nuevos. Los que quedan están verdes.',
			table: [
				{ id: 'redapricorn', w: 16, n: [1, 2] }, { id: 'blueapricorn', w: 16, n: [1, 2] }, { id: 'yellowapricorn', w: 16, n: [1, 2] },
				{ id: 'greenapricorn', w: 14, n: [1, 2] }, { id: 'pinkapricorn', w: 14, n: [1, 2] }, { id: 'whiteapricorn', w: 10, n: [1, 1] },
				{ id: 'blackapricorn', w: 8, n: [1, 1] }, { id: 'sitrusberry', w: 6, n: [1, 1] },
			],
		},
		hojas_iris: {
			name: 'Alfombra de hojas rojas', icon: '🍁', hours: 18, picks: [1, 2],
			text: 'Remueves la alfombra de hojas rojas de los arces. Debajo, entre la tierra húmeda, hay cosas que el otoño ha ido guardando.',
			wait: 'Las hojas nuevas todavía no han caído. Los arces se toman su tiempo.',
			table: [
				{ id: 'tinymushroom', w: 24, n: [1, 2] }, { id: 'healpowder', w: 18, n: [1, 2] }, { id: 'energyroot', w: 14, n: [1, 1] },
				{ id: 'revivalherb', w: 6, n: [1, 1] }, { id: 'bigmushroom', w: 8, n: [1, 1] }, { id: 'persimberry', w: 14, n: [1, 2] },
				{ id: 'silverleaf', w: 4, n: [1, 1] }, { id: 'goldleaf', w: 2, n: [1, 1] },
			],
		},
		orilla_lago42: {
			name: 'Orilla del lago', icon: '🐚', hours: 18, picks: [1, 3],
			text: 'Rebuscas entre los juncos de la orilla. El lago ha dejado cosas en el barro. Algunas no deberían estar en un lago.',
			wait: 'El agua está quieta. Hoy el lago no tiene nada que contar.',
			table: [
				{ id: 'pearl', w: 26, n: [1, 2] }, { id: 'heartscale', w: 18, n: [1, 1] }, { id: 'stardust', w: 12, n: [1, 1] },
				{ id: 'shoalsalt', w: 10, n: [1, 2] }, { id: 'bigpearl', w: 6, n: [1, 1] }, { id: 'mysticwater', w: 3, n: [1, 1] },
				{ id: 'oranberry', w: 20, n: [1, 3] },
			],
		},
		huerto_rancho: {
			name: 'Huerto del rancho', icon: '🥕', hours: 22, picks: [1, 3],
			text: 'Don Aurelio te deja tomar lo que quieras del huerto. «Pero las zanahorias torcidas, que las derechas son para Borla».',
			wait: 'El huerto está recién regado. Don Aurelio dice que vuelvas otro día.',
			table: [
				{ id: 'oranberry', w: 24, n: [1, 3] }, { id: 'sitrusberry', w: 14, n: [1, 2] }, { id: 'cheriberry', w: 14, n: [1, 2] },
				{ id: 'moomoomilk', w: 10, n: [1, 1], cond: 'done.b02_t_gaspar || quest.b02_t_gaspar == "ingredientes"' }, { id: 'leppaberry', w: 10, n: [1, 1] },
				{ id: 'lumberry', w: 3, n: [1, 1] },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		sudowoodo_r36: {
			name: 'El árbol de la Ruta 36', type: 'Rock', rec: 36,
			cond: 'visited("ruta36")',
			info: [
				{ text: 'Un árbol extraño bloquea el camino entre la Ruta 36 y la Ruta 37.' },
				{ cond: 'has("regaderaardilla")', text: 'Quizá no le guste el agua. A los árboles de verdad, sí.' },
				{ cond: 'flag.b02_sudowoodo', text: 'Era un **Sudowoodo** (tipo Roca), nivel 36. El camino está libre.' },
				{ cond: 'flag.b02_sudowoodo_atrapado', text: '✔ Ahora viaja contigo. Sigue haciendo de árbol en la mochila.' },
			],
		},
		jefe_atenea: {
			name: 'Bajo la Torre Quemada', npc: 'recluta_rocket_f', trainer: 'atenea_1', type: 'Poison', rec: 41,
			cond: 'quest.b02_m5 == "torre" || quest.b02_m5 == "decision" || flag.b02_torre_hecha',
			info: [
				{ text: 'Las pistas del Teatro llevan al **sótano de la Torre Quemada**.' },
				{ cond: 'flag.b02_sotano_visto', text: 'Un laboratorio del **Team Rocket**. Tres reclutas, y al fondo, alguien que manda.' },
				{ cond: 'flag.b02_sotano_visto', text: 'Dicen que sus Pokémon son de tipo **Veneno** y **Siniestro**. Los ataques de tipo **Psíquico** y **Tierra** les sientan mal.' },
				{ cond: 'beat("atenea_1")', text: '**Atenea**: 4 Pokémon, niveles 38 a 41. Su **Honchkrow** pega primero y fuerte. ✔ Vencida.' },
				{ cond: 'flag.b02_sotano_visto && !beat("atenea_1")', text: 'En el sótano puedes **respirar hondo** y recuperar fuerzas antes del combate.' },
			],
		},
	},
};
