// Bloque 1 · Tramo 1: hacia Novarte (Ruta 4, Ciudad Novarte y su gimnasio, Ruta 3, Bosque de Novarte,
// Ruta 2, Pueblo Acuarela, Ruta 1 y Pueblo Boceto).

// Desplazados que cuentan para «Fotos de lo imposible» (ninguno es de Kalos).
const FOTOS = "(seen('lechonk')?1:0)+(seen('shinx')?1:0)+(seen('tarountula')?1:0)+(seen('fidough')?1:0)+(seen('rookidee')?1:0)+(seen('wooloo')?1:0)+(seen('mareep')?1:0)+(seen('larvitar')?1:0)";

export default {
	locations: {
		// =================== RUTA 4 ===================
		ruta4: {
			name: 'Ruta 4', short: 'Ruta 4', region: 'kalos', kind: 'route', map: { x: 55, y: 82 },
			bg: { type: 'route', flowers: '#f2b33d' },
			desc: '**Senda del Parterre.** Un paseo de jardines a la francesa: setos recortados, fuentes de piedra y parterres de flores amarillas y rojas hasta donde alcanza la vista. Al sur, Ciudad Novarte.',
			descNight: 'De noche, las fuentes de la **Senda del Parterre** suenan más fuerte. Las flores se cierran. Algo pequeño y verde se mueve entre los setos.',
			links: ['luminalia', 'novarte'],
			mapNote: 'Flabébé, Combee y Ralts (raro)',
			rumors: [
				{ text: 'Los jardineros dicen que el **Jardín Prohibido** del fondo de la senda es más grande por dentro que por fuera. Nadie les cree.' },
				{ text: 'Hay un panal de Combee en los setos. De noche, los Combee duermen como troncos.' },
				{ cond: 'flag.b01_palmeo', text: 'Desde lo del agente de Lemnis, en la senda ya no hay restos violetas en el aire. Al menos, ninguno que se vea.' },
			],
			route: {
				from: 'luminalia', to: 'novarte', length: 8, terrain: 'flowers', rate: 0.22,
				tramos: {
					1: [{ trainer: 'r4_florista' }, { item: 'potion' }],
					2: [{ text: 'Una fuente con tres Flabébé de piedra. Alguien les ha puesto una flor de verdad a cada una.' }, { trainer: 'r4_aromaterapeuta', optional: true, label: 'Huele las flores con los ojos cerrados' }],
					3: [{ trainer: 'r4_joven' }, { item: 'oranberry', hidden: true }],
					4: [{ script: 'b01_r4_rastro', once: true, mark: true }],
					5: [
						{ text: 'Los setos zumban. Literalmente: hay un **panal de Combee** encajado entre las ramas.' },
						{ talk: [{ script: 'b01_r4_panal' }], label: 'Un panal en el seto', icon: '🍯', new: '!flag.b01_panal_miel' },
						{ trainer: 'r4_fan', optional: true, label: 'Un chico con un álbum de cromos te señala' },
					],
					6: [
						{ trainer: 'r4_patinadora' }, { item: 'pokeball', n: 2 },
						{ talk: [{ script: 'b01_r4_furfrou' }], label: 'Un seto que gime', sub: 'Algo blanco se esconde dentro', icon: '🐩', cond: 'quest.b01_s_furfrou == "buscar" && !flag.b01_furfrou_hallado', new: 'true' },
					],
					7: [
						{ text: 'Una verja de hierro entreabierta. Un cartel oxidado: «JARDÍN PRIVADO. NO PISAR. SÍ, TÚ».' },
						{ talk: [{ script: 'b01_r4_jardin' }], label: 'Entrar al Jardín Prohibido', icon: '🌿', new: '!flag.b01_jardin_mt' },
						{ item: 'superpotion', hidden: true },
					],
					8: [{ text: 'Los parterres terminan en una avenida de tilos. Al fondo asoman los tejados de **Ciudad Novarte** y el tejado de cristal de su gimnasio.' }],
				},
				encounters: {
					flowers: [
						{ sp: 'flabebe', lv: [4, 7], w: 40 },
						{ sp: 'fletchling', lv: [4, 6], w: 25 },
						{ sp: 'combee', lv: [5, 7], w: 15 },
						{ sp: 'skitty', lv: [5, 7], w: 10 },
						{ sp: 'ledyba', lv: [4, 6], w: 10 },
						{ sp: 'budew', lv: [6, 7], w: 6 },
						{ sp: 'ralts', lv: 7, w: 4, time: 'day' },
						{ sp: 'ralts', lv: [7, 8], w: 8, time: 'night' },
						{ sp: 'lechonk', lv: [4, 6], w: 8, displaced: true },
						{ sp: 'shinx', lv: 5, w: 5, displaced: true },
					],
				},
			},
		},

		// =================== CIUDAD NOVARTE ===================
		novarte: {
			name: 'Ciudad Novarte', short: 'Novarte', region: 'kalos', kind: 'city', map: { x: 55, y: 94 },
			bg: { type: 'city', roofs: ['#c4473a', '#d8a85a', '#3f8a4f'] },
			desc: 'Una ciudad pequeña de calles empedradas, balcones con geranios y una plaza con una **fuente** en el centro. El **gimnasio** tiene un tejado de cristal en forma de tela de araña.\n\nUn cartel nuevo, todavía con olor a pintura, cuelga de la puerta: **«Líder de intercambio: Brock (Kanto)»**.',
			descNight: 'Novarte de noche: farolas amarillas, la fuente iluminada desde abajo y un olor a guiso que sale de la ventana del gimnasio. Alguien está cocinando a estas horas.',
			links: ['ruta4', 'ruta3'],
			mapNote: 'Gimnasio: Brock (Roca)',
			onEnter: [{ script: 'b01_llegada_novarte' }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Gimnasio de Novarte', sub: 'Brock, tipo Roca', icon: '🏟️', action: { go: 'gym_novarte' }, new: '!badge("medalla_roca")' },
				{ label: 'Patio del Gimnasio', sub: 'Zona de entrenamiento (nivel 13)', icon: '🥋', action: { training: {
					cap: 13, npc: 'aprendiz_brock',
					trainers: ['patio_karateka', 'patio_excursionista', 'patio_luchadora'],
					wild: [{ sp: 'roggenrola', lv: [9, 11] }, { sp: 'geodude', lv: [9, 11] }, { sp: 'machop', lv: [9, 11] }, { sp: 'nosepass', lv: [10, 12] }],
					closed: 'El aprendiz te mira de arriba abajo. «Tu equipo ya está para la pared. Si sigues aquí, Brock me regaña por hacerte perder el tiempo. Y Brock regaña con comida. Sin postre.»',
				} } },
				{ label: 'Rhi', sub: 'Chuta piedrecitas contra la fuente', icon: '⚽', cond: 'flag.b01_rhi_novarte && !flag.b01_rhi_novarte_fin', talk: [
					{ cond: 'badges >= 1', script: 'b01_rhi_fuente_medalla' },
					{ cond: '!beat("rhi_1")', script: 'b01_rhi_fuente_reto' },
					{ script: 'b01_rhi_fuente' },
				] },
				{ label: 'Alexia', sub: 'Revisa fotos en su cámara', icon: '📷', cond: 'quest.b01_s_fotos == "registrar" || done.b01_s_fotos', new: 'quest.b01_s_fotos == "registrar" && ' + FOTOS + ' >= 5', talk: [
					{ cond: 'done.b01_s_fotos', script: 'b01_alexia_fotos_despues' },
					{ script: 'b01_alexia_fotos' },
				] },
				{ label: 'Peluquería «Le Caniche»', sub: 'Un cartel: «Cerrado por disgusto»', icon: '✂️', new: '!quest.b01_s_furfrou || (quest.b01_s_furfrou == "buscar" && flag.b01_furfrou_hallado)', talk: [
					{ cond: 'done.b01_s_furfrou', script: 'b01_peluquera_despues' },
					{ cond: 'flag.b01_furfrou_hallado', script: 'b01_peluquera_vuelta' },
					{ cond: 'quest.b01_s_furfrou == "buscar"', script: 'b01_peluquera_recordar' },
					{ script: 'b01_peluquera_1' },
				] },
				{ label: 'Un señor en un balcón', sub: 'Riega geranios que ya están regados', icon: '🌼', talk: [
					{ cond: 'flag.b01_balcon_flabebe', script: 'b01_balcon_despues' },
					{ cond: 'inParty("flabebe")', script: 'b01_balcon_flabebe' },
					{ script: 'b01_balcon_1' },
				] },
			],
			rumors: [
				{ text: 'Brock hace la mejor comida de la ciudad. Pero no le pidas que hable de chicas: ahora se ríe de sí mismo.' },
				{ text: 'La líder de siempre, Violeta, está de intercambio en Ciudad Plateada, en Kanto. Dicen que allí tampoco hay bichos suficientes para su gusto.' },
				{ cond: 'flag.b01_rhi_conto_onix', text: 'Una chica de Galar salió del gimnasio gritando «¡fuera de juego!». Brock le mandó un táper de estofado al Centro Pokémon.' },
			],
		},
		gym_novarte: {
			name: 'Gimnasio de Novarte', parent: 'novarte', kind: 'gym', bg: { type: 'gym', wall: '#8a7a5a', floor: '#6b4a2b' },
			desc: 'Dentro ya no hay telarañas: hay una **pared de escalada** de tres pisos, hecha con rocas traídas de Kanto. Arriba del todo, una plataforma. Y en la plataforma, un hombre con delantal sobre la ropa de líder.\n\nUn cartel en la entrada: **«Líder de intercambio: Brock (Kanto). La líder titular, Violeta, está de intercambio en Ciudad Plateada (Kanto)»**. Debajo, a mano: *«Las galletas de la mesa son para todos. Sí, para ti también.»*',
			spots: [
				{ label: 'Excursionista de la pared', sub: 'Primer tramo de escalada', icon: '🧗', action: { trainer: 'gym_novarte_1' }, doneIf: 'beat("gym_novarte_1")' },
				{ label: 'Montañero de la pared', sub: 'Segundo tramo de escalada', icon: '🧗', action: { trainer: 'gym_novarte_2' }, doneIf: 'beat("gym_novarte_2")' },
				{ label: 'Brock, en lo alto de la pared', sub: 'Primero hay que subir', icon: '🪨', cond: '!(beat("gym_novarte_1") && beat("gym_novarte_2"))', talk: [{ script: 'b01_brock_arriba' }] },
				{ label: 'Brock', sub: 'Líder de intercambio', icon: '🪨', cond: 'beat("gym_novarte_1") && beat("gym_novarte_2")', new: '!beat("brock_g1") || !flag.b01_brock_comida', talk: [
					{ cond: 'beat("brock_g1") && !flag.b01_brock_comida', script: 'b01_brock_comida' },
					{ cond: 'beat("brock_g1")', script: 'b01_brock_generico' },
					{ script: 'b01_brock_reto' },
				] },
				{ label: 'Mesa de las galletas', icon: '🍪', talk: [{ script: 'b01_gym_galletas' }] },
			],
		},

		// =================== RUTA 3 ===================
		ruta3: {
			name: 'Ruta 3', short: 'Ruta 3', region: 'kalos', kind: 'route', map: { x: 55, y: 103 },
			bg: { type: 'route', ground: '#9bbf5a' },
			desc: 'Un camino de tierra entre campos de cultivo y un riachuelo. Al sur se ve la línea oscura del **Bosque de Novarte**.',
			links: ['novarte', 'bosque_novarte'],
			mapNote: 'Pikachu y Dunsparce (raros)',
			rumors: [
				{ text: 'Unos granjeros juran haber visto un perrito que huele a pan recién hecho. Ninguno de los libros de Kalos lo menciona.' },
			],
			route: {
				from: 'novarte', to: 'bosque_novarte', length: 6, terrain: 'grass', rate: 0.2,
				tramos: {
					1: [{ trainer: 'r3_cazabichos' }],
					2: [{ text: 'Un espantapájaros con una gorra del Circuito Infinito. Alguien le ha escrito en el pecho: «#1». Los Fletchling no le hacen ni caso.' }, { item: 'pokeball' }],
					3: [{ trainer: 'r3_joven' }],
					4: [{ trainer: 'r3_cientifico', optional: true, label: 'Hace cálculos en una libreta, muy serio' }, { item: 'antidote', hidden: true }],
					5: [{ text: 'El riachuelo se ensancha. En la orilla, unas huellas pequeñas y redondas, como de alguien que amasa pan con las patas.' }, { item: 'xdefense' }],
					6: [{ text: 'Los árboles se cierran sobre el camino. Huele a musgo. El **Bosque de Novarte** empieza aquí.' }],
				},
				encounters: {
					grass: [
						{ sp: 'bunnelby', lv: [5, 7], w: 30 },
						{ sp: 'bidoof', lv: [5, 7], w: 30 },
						{ sp: 'fletchling', lv: [5, 7], w: 20 },
						{ sp: 'pidgey', lv: [6, 7], w: 15, time: 'day' },
						{ sp: 'burmy', lv: 7, w: 10 },
						{ sp: 'azurill', lv: 7, w: 10 },
						{ sp: 'dunsparce', lv: 7, w: 5 },
						{ sp: 'pikachu', lv: [6, 7], w: 5 },
						{ sp: 'fidough', lv: [6, 7], w: 6, displaced: true },
					],
				},
			},
		},

		// =================== BOSQUE DE NOVARTE ===================
		bosque_novarte: {
			name: 'Bosque de Novarte', short: 'Bosque', region: 'kalos', kind: 'forest', map: { x: 55, y: 111 },
			bg: { type: 'forest' },
			desc: 'Un bosque de hayas viejas con la luz cayendo a franjas. Los caminos son de tierra blanda y hay troncos huecos por todas partes. Se oye zumbar a los bichos, muchos bichos.',
			descNight: 'De noche el Bosque de Novarte no da miedo. Da **mucho** miedo. Hay ojitos brillando entre las raíces, y algunos tienen demasiadas patas.',
			links: ['ruta3', 'ruta2'],
			mapNote: 'Pikachu, Pansage, Pansear, Panpour',
			rumors: [
				{ cond: '!done.b01_s_fennekin && quest.b01_s_fennekin != "volver"', text: 'Desde la inauguración, un zorrito que echa chispas anda por el bosque. Los Spewpa no lo dejan en paz.' },
				{ text: 'De noche salen unas arañas que no son de Kalos. Pican poco, pero miran mucho.' },
				{ cond: 'quest.b01_t_gaspar == "ingredientes" && !has("tinymushroom")', text: 'Las setas pequeñas del bosque crecen al pie de los troncos podridos, donde no llega el sol.' },
			],
			route: {
				from: 'ruta3', to: 'ruta2', length: 9, terrain: 'forest', rate: 0.24,
				tramos: {
					1: [{ item: 'potion' }],
					2: [{ script: 'b01_bosque_huellas', once: true, cond: 'quest.b01_s_fennekin == "buscar" || quest.b01_s_fennekin == "pistas"' }, { text: 'Un claro con un tocón enorme en el centro. Alguien ha tallado en él: «L ♥ su gorra».' }],
					3: [{ trainer: 'bq_cazabichos_1' }, { item: 'oranberry', hidden: true }],
					4: [{ trainer: 'bq_exploradora', optional: true, label: 'Gira un mapa en todas direcciones' }],
					5: [{ script: 'b01_bosque_lucien', once: true, cond: 'quest.b01_s_fennekin == "buscar" || quest.b01_s_fennekin == "pistas"' }],
					6: [{ trainer: 'bq_cazabichos_2' }, { text: 'Huele a tierra mojada y a seta. Al pie de un tronco podrido crecen cosas pequeñas y blancas.' }, { item: 'tinymushroom', hidden: true }],
					7: [{ script: 'b01_bosque_humo', once: true, cond: 'quest.b01_s_fennekin == "buscar" || quest.b01_s_fennekin == "pistas"' }, { item: 'pokeball' }],
					8: [{ script: 'b01_bosque_fennekin', once: true, mark: true, cond: 'quest.b01_s_fennekin == "buscar" || quest.b01_s_fennekin == "pistas"' }],
					9: [{ text: 'La luz se abre. Más allá de los últimos árboles, un camino ancho baja hacia un río: la **Ruta 2**.' }],
				},
				encounters: {
					forest: [
						{ sp: 'scatterbug', lv: [4, 6], w: 30 },
						{ sp: 'caterpie', lv: [4, 6], w: 20 },
						{ sp: 'weedle', lv: [4, 6], w: 20 },
						{ sp: 'fletchling', lv: [5, 7], w: 15 },
						{ sp: 'pansage', lv: 6, w: 7 },
						{ sp: 'pansear', lv: 6, w: 7 },
						{ sp: 'panpour', lv: 6, w: 7 },
						{ sp: 'pikachu', lv: [5, 7], w: 8 },
						{ sp: 'kakuna', lv: 7, w: 3 },
						{ sp: 'tarountula', lv: [5, 7], w: 4, displaced: true, time: 'day' },
						{ sp: 'tarountula', lv: [6, 8], w: 12, displaced: true, time: 'night' },
					],
				},
			},
		},

		// =================== RUTA 2 ===================
		ruta2: {
			name: 'Ruta 2', short: 'Ruta 2', region: 'kalos', kind: 'route', map: { x: 55, y: 119 },
			bg: { type: 'route' },
			desc: 'Un sendero ancho que baja del bosque hacia el valle. Hierba alta, vallas de madera y, a lo lejos, el molino de **Pueblo Acuarela**.',
			links: ['bosque_novarte', 'acuarela'],
			mapNote: 'Pidgey, Zigzagoon (de noche)',
			route: {
				from: 'bosque_novarte', to: 'acuarela', length: 6, terrain: 'grass', rate: 0.2,
				tramos: {
					1: [{ item: 'potion' }],
					2: [{ trainer: 'r2_excursionista' }],
					3: [{ text: 'Un poste con flechas: «Bosque de Novarte ↑ · Pueblo Acuarela ↓ · Galar → 3.000 km (por la Puerta: 3 segundos)». La última flecha es de pegatina.' }, { item: 'repel', hidden: true }],
					4: [{ trainer: 'r2_colegiala', optional: true, label: 'Ensaya una pose de victoria' }],
					5: [{ trainer: 'r2_joven' }, { item: 'pokeball' }],
					6: [{ text: 'El sendero cruza un arroyo por unas piedras planas. Al otro lado, el molino de Acuarela gira despacio.' }],
				},
				encounters: {
					grass: [
						{ sp: 'bunnelby', lv: [4, 6], w: 30 },
						{ sp: 'fletchling', lv: [4, 6], w: 25 },
						{ sp: 'scatterbug', lv: [4, 6], w: 25 },
						{ sp: 'pidgey', lv: [5, 6], w: 20, time: 'day' },
						{ sp: 'zigzagoon', lv: [5, 6], w: 20, time: 'night' },
						{ sp: 'weedle', lv: 5, w: 8 },
						{ sp: 'caterpie', lv: 5, w: 8 },
						{ sp: 'rookidee', lv: [5, 7], w: 6, displaced: true },
					],
				},
			},
		},

		// =================== PUEBLO ACUARELA ===================
		acuarela: {
			name: 'Pueblo Acuarela', short: 'Acuarela', region: 'kalos', kind: 'town', map: { x: 55, y: 125 },
			bg: { type: 'town', roofs: ['#e9dcc0', '#8fb3d9', '#e98aa8'] },
			desc: 'Un pueblo pequeño a orillas de un río, con un **puente de piedra**, un molino y una terraza con sombrillas a rayas. Huele a pan y a pintura fresca. Medio pueblo pinta; la otra mitad posa.',
			descNight: 'El río de Acuarela refleja las farolas del puente. En la terraza ya han recogido las sombrillas, pero el camarero sigue sirviendo a quien llegue cansado.',
			links: ['ruta2', 'ruta1'],
			spots: [
				{ label: 'Terraza del Puente', sub: 'Sentarse a descansar', icon: '☕', talk: [{ script: 'b01_acuarela_terraza' }] },
				{ label: 'Una pintora en el puente', sub: 'Pinta el río sin mirarlo', icon: '🎨', new: '!flag.b01_pintora', talk: [
					{ cond: 'flag.b01_pintora', script: 'b01_pintora_despues' },
					{ script: 'b01_pintora_1' },
				] },
			],
			rumors: [
				{ text: 'En Acuarela dicen que el río tiene más colores que nombres para ellos.' },
				{ text: 'Al sur, en Pueblo Boceto, vive una campeona de carreras de Rhyhorn. Retirada. Más o menos.' },
			],
		},

		// =================== RUTA 1 ===================
		ruta1: {
			name: 'Ruta 1', short: 'Ruta 1', region: 'kalos', kind: 'route', map: { x: 55, y: 131 },
			bg: { type: 'route', ground: '#b9c97a' },
			desc: 'Un camino corto y tranquilo entre muros de piedra y huertos. Las huellas en el barro son enormes y de tres dedos: por aquí pasan Rhyhorn a diario.',
			links: ['acuarela', 'boceto'],
			route: {
				from: 'acuarela', to: 'boceto', length: 6, terrain: 'grass', rate: 0.12,
				tramos: {
					1: [{ item: 'oranberry', hidden: true }],
					2: [{ trainer: 'r1_aprendiz' }],
					3: [{ trainer: 'r1_pintor', optional: true, label: 'Dibuja un Rhyhorn que no se mueve' }, { text: 'Un muro de piedra tiene un agujero con la forma exacta de un cuerno. Nadie lo ha arreglado. Parece que lo enseñan con orgullo.' }],
					4: [{ item: 'potion' }],
					5: [{ trainer: 'r1_vecina' }],
					6: [{ text: 'Un arco de madera con letras pintadas: **«Pueblo Boceto»**. Debajo, más pequeño: «Velocidad máxima para Rhyhorn: la que el Rhyhorn quiera».' }, { item: 'xspeed', hidden: true }],
				},
				encounters: {
					grass: [
						{ sp: 'fletchling', lv: [5, 7], w: 30 },
						{ sp: 'bunnelby', lv: [5, 7], w: 30 },
						{ sp: 'scatterbug', lv: [5, 6], w: 20 },
						{ sp: 'pidgey', lv: [5, 7], w: 15, time: 'day' },
						{ sp: 'zigzagoon', lv: [5, 7], w: 15, time: 'night' },
						{ sp: 'lechonk', lv: [6, 7], w: 4, displaced: true },
					],
				},
			},
		},

		// =================== PUEBLO BOCETO ===================
		boceto: {
			name: 'Pueblo Boceto', short: 'Boceto', region: 'kalos', kind: 'town', map: { x: 55, y: 137 },
			bg: { type: 'town', roofs: ['#c4473a', '#e9dcc0', '#8a5a2f'] },
			desc: 'El pueblo más al sur de Kalos: cuatro calles, un pozo, casas con establo y una **pista de carreras de Rhyhorn** marcada con piedras pintadas. Todo el mundo saluda. Los Rhyhorn también, a su manera: con un resoplido.',
			links: ['ruta1'],
			mapNote: 'Montura: Rhyhorn',
			spots: [
				{ label: 'Casa con establo', sub: 'Una mujer cepilla a un Rhyhorn enorme', icon: '🦏', new: '!quest.b01_s_rhyhorn || (quest.b01_s_rhyhorn == "reto" && beat("jinete_alumno_1") && beat("jinete_alumno_2"))', talk: [
					{ cond: 'done.b01_s_rhyhorn', script: 'b01_campeona_despues' },
					{ cond: 'quest.b01_s_rhyhorn == "reto" && beat("jinete_alumno_1") && beat("jinete_alumno_2")', script: 'b01_campeona_carrera' },
					{ cond: 'quest.b01_s_rhyhorn == "reto"', script: 'b01_campeona_recordar' },
					{ script: 'b01_campeona_1' },
				] },
				{ label: 'Pista: alumna de la campeona', sub: 'Calienta en la línea de salida', icon: '🏁', cond: 'quest.b01_s_rhyhorn == "reto" || done.b01_s_rhyhorn', action: { trainer: 'jinete_alumno_1' }, doneIf: 'beat("jinete_alumno_1")' },
				{ label: 'Pista: alumno de la campeona', sub: 'Le ajusta la silla a su Rhyhorn', icon: '🏁', cond: 'quest.b01_s_rhyhorn == "reto" || done.b01_s_rhyhorn', action: { trainer: 'jinete_alumno_2' }, doneIf: 'beat("jinete_alumno_2")' },
				{ label: 'El pozo del pueblo', icon: '🪣', talk: [{ script: 'b01_boceto_pozo' }] },
			],
			rumors: [
				{ text: 'Dicen que en el **Paso de Rhyhorn**, al oeste, las rocas solo se apartan para un jinete.' },
				{ text: 'La campeona retirada tiene a su peque en la tele. Nunca lo dice. Pero tiene la tele siempre encendida.' },
			],
		},
	},

	// =================== ENTRENADORES ===================
	trainers: {
		// ----- Ruta 4 -----
		r4_florista: { name: 'Margot', cls: 'Florista', ai: 1, sprite: 'aromalady', team: [{ sp: 'flabebe', lv: 5 }],
			intro: 'Desde la grieta, en los parterres brotan flores que no conozco. Mis Flabébé no las tocan. Yo tampoco.', win: 'Vale, vale… Ya puedes pisar el césped. Pero solo un poquito.' },
		r4_aromaterapeuta: { name: 'Céleste', cls: 'Aromaterapeuta', ai: 2, sprite: 'aromalady', team: [{ sp: 'budew', lv: 7 }, { sp: 'combee', lv: 6 }],
			intro: 'Lavanda, rosa… y algo como una pila quemada. Este parterre huele así desde la inauguración. ¿Tú también lo hueles?', win: 'Tu Riolu huele a tormenta. Es un cumplido. Creo.' },
		r4_joven: { name: 'Théo', cls: 'Joven', ai: 1, sprite: 'youngster', team: [{ sp: 'fletchling', lv: 6 }, { sp: 'bunnelby', lv: 6 }],
			intro: '¡Me inscribí en el Circuito Infinito! Ocho medallas, Copa, otra temporada, otra más… Mi madre dice que es una forma muy cara de no hacer los deberes.', win: 'Bueno. La temporada es larga. Infinita, de hecho.' },
		r4_fan: { name: 'Lucas', cls: 'Fan del Circuito', ai: 2, sprite: 'schoolkid', team: [{ sp: 'skitty', lv: 9 }],
			intro: '¡Tengo los cromos de los cien novatos! Tú eres {el|la|le} #73. Tu cromo no vale nada. Todavía.', win: '…Voy a guardar tu cromo en la funda buena.' },
		r4_patinadora: { name: 'Inès', cls: 'Patinadora', ai: 2, sprite: 'rollerskater', team: [{ sp: 'skitty', lv: 8 }, { sp: 'ledyba', lv: 7 }],
			intro: 'Patino por aquí cada mañana. Desde lo de la Puerta, los Fletchling vuelan bajito. Como si algo allá arriba les diera miedo.', win: '¡Qué frenada! Así no se patina, pero así se gana.' },
		agente_lemnis_r4: { name: 'de campo', cls: 'Agente', ai: 2, npc: 'agente_lemnis', reward: 400,
			team: [{ sp: 'pawniard', lv: 8, moves: ['scratch', 'leer', 'furycutter', 'metalclaw'] }, { sp: 'klefki', lv: 7 }],
			intro: 'Interferir en un protocolo de recogida es una infracción de nivel dos. Lo pone en el folleto.', win: 'Esto… esto va a quedar en mi informe. En la parte mala del informe.', lose: 'Lo que pensaba. Apártese.' },

		// ----- Novarte: Rhi -----
		rhi_1: { name: 'Rhi', cls: 'Novata', ai: 3, npc: 'rhi', reward: 900,
			team: [
				{ sp: 'scorbunny', lv: 9, moves: ['ember', 'quickattack', 'tackle', 'growl'], ability: 'blaze', nature: 'jolly' },
				{ sp: 'rookidee', lv: 8, moves: ['peck', 'leer', 'powertrip', 'honeclaws'], ability: 'keeneye', nature: 'adamant' },
			],
			intro: '¡Saque de centro! ¡Y no me hagas la estatua!', win: '¡¿Qué?! ¡Eso era… eso era…! …No. Eso era gol. Gol tuyo.', lose: '¡GOLAZO! ¡Así se hace, Scorbunny! ¡Eso es lo que necesitaba!' },

		// ----- Gimnasio de Novarte -----
		gym_novarte_1: { name: 'Gilles', cls: 'Excursionista', ai: 3, sprite: 'hiker', reward: 400,
			team: [{ sp: 'geodude', lv: 10 }, { sp: 'nosepass', lv: 10 }],
			intro: 'Brock nos trae galletas cada mañana. Galletas con el líder, lo llama. Por esas galletas no te dejo pasar.', win: 'Sube, sube. Y coge una galleta al pasar. Es la norma.' },
		gym_novarte_2: { name: 'Bernard', cls: 'Montañero', ai: 3, sprite: 'backpacker', reward: 440,
			team: [{ sp: 'roggenrola', lv: 11 }, { sp: 'onix', lv: 10 }],
			intro: 'Estas rocas vinieron de Kanto en barco. Pesan como un remordimiento. Y tú vas a tener que escalarlas.', win: 'Arriba está Brock. Si te ofrece comida, acepta. Si te ofrece consejo, acepta dos veces.' },
		brock_g1: { name: 'Brock', cls: 'Líder', npc: 'brock', ai: 4, reward: 1400,
			team: [
				{ sp: 'roggenrola', lv: 12, moves: ['tackle', 'rocktomb', 'irondefense', 'sandattack'], ability: 'sturdy', item: 'oranberry', nature: 'impish', iv: 27 },
				{ sp: 'geodude', lv: 13, moves: ['rocktomb', 'rollout', 'defensecurl', 'bulldoze'], ability: 'rockhead', item: 'hardstone', nature: 'adamant', iv: 27 },
				{ sp: 'onix', lv: 14, moves: ['rocktomb', 'bind', 'smackdown', 'sandstorm'], ability: 'sturdy', item: 'oranberry', nature: 'careful', iv: 28 },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: 'Una roca no gana por ser dura. Gana porque no se mueve hasta que tiene que moverse. ¡Vamos allá!',
			win: '¡Ja! Me has partido como un huevo para tortilla. Y mira que soy duro de pelar.',
			lose: 'Buen intento. Vuelve cuando quieras. La pared no se va a mover. Bueno, nada aquí se mueve. Es un gimnasio de roca.' },

		// ----- Patio del Gimnasio (repetibles) -----
		patio_karateka: { name: 'Aymeric', cls: 'Karateka', ai: 2, sprite: 'blackbelt', reward: 200, team: [{ sp: 'machop', lv: 11 }],
			intro: 'Dicen que si combates cien veces en este patio aparece un jefe secreto. Yo llevo noventa y nueve.', win: 'Noventa y nueve. Otra vez. Mañana sí.' },
		patio_excursionista: { name: 'Odile', cls: 'Excursionista', ai: 2, sprite: 'hiker', reward: 200, team: [{ sp: 'roggenrola', lv: 9 }, { sp: 'geodude', lv: 10 }],
			intro: 'Aquí calentamos antes de la pared. Tú calientas, yo te enfrío.', win: 'Vale. Ya estás caliente. Muy caliente.' },
		patio_luchadora: { name: 'Salomé', cls: 'Luchadora', ai: 2, sprite: 'battlegirl', reward: 220, team: [{ sp: 'meditite', lv: 11 }, { sp: 'nosepass', lv: 10 }],
			intro: 'Brock dice que una roca se rompe por el punto débil. Yo busco el tuyo.', win: 'Lo encontré. Era yo.' },

		// ----- Ruta 3 -----
		r3_cazabichos: { name: 'Nils', cls: 'Cazabichos', ai: 1, sprite: 'bugcatcher', team: [{ sp: 'burmy', lv: 8 }, { sp: 'scatterbug', lv: 9 }],
			intro: 'Desde la grieta encuentro bichos que no salen en ningún libro. ¡Ayer vi una araña con cara de pocos amigos! ¡Me encantó!', win: 'Mis bichos pierden, pero mi colección gana.' },
		r3_joven: { name: 'Noé', cls: 'Joven', ai: 1, sprite: 'youngster', team: [{ sp: 'bidoof', lv: 9 }, { sp: 'pikachu', lv: 9 }],
			intro: 'Mi abuelo dice que el Circuito es una moda. También lo decía de la tele. Y del pan de molde.', win: 'Mi abuelo va a decir que perder también es una moda.' },
		r3_cientifico: { name: 'Anatole', cls: 'Joven Científico', ai: 2, sprite: 'scientist', team: [{ sp: 'azurill', lv: 9 }, { sp: 'dunsparce', lv: 10 }],
			intro: 'Según mis cálculos, tengo un diez mil millones por ciento de probabilidades de ganar. Los cálculos son míos, así que no se discuten.', win: 'Hmm. Un error de redondeo. Un error de redondeo enorme.' },

		// ----- Bosque de Novarte -----
		bq_cazabichos_1: { name: 'Corentin', cls: 'Cazabichos', ai: 1, sprite: 'bugcatcher', team: [{ sp: 'weedle', lv: 8 }, { sp: 'kakuna', lv: 9 }],
			intro: 'Los Spewpa del bosque andan como locos estos días. Algo los tiene nerviosos. ¿Será el zorro que echa chispas?', win: '¡Mis Weedle! Bueno, mi Weedle y mi Kakuna. El Kakuna ni se enteró.' },
		bq_exploradora: { name: 'Apolline', cls: 'Exploradora', ai: 2, sprite: 'picnicker', team: [{ sp: 'pansage', lv: 9 }, { sp: 'pansear', lv: 9 }],
			intro: 'Tengo un mapa del bosque. Lo dibujé yo. Está mal. Por eso combato: para olvidar que estoy perdida.', win: 'Perdida y derrotada. Hoy es mi día.' },
		bq_cazabichos_2: { name: 'Mathis', cls: 'Cazabichos', ai: 2, sprite: 'bugcatcher', team: [{ sp: 'tarountula', lv: 9 }, { sp: 'scatterbug', lv: 9 }],
			intro: 'Esta Tarountula salió de una grieta siendo la más débil del bosque. Ahora caza todo lo que se mueve y sube de nivel cada día. A veces me mira raro. Me cae genial.', win: 'Hoy no subió de nivel. Mañana se vengará. Lo sé.' },

		// ----- Ruta 2 -----
		r2_excursionista: { name: 'Fabrice', cls: 'Excursionista', ai: 1, sprite: 'hiker', team: [{ sp: 'bunnelby', lv: 9 }, { sp: 'zigzagoon', lv: 8 }],
			intro: 'Tres días caminando para ver el Bosque de Novarte. Ahora dicen que hay arañas que no son de aquí. Me dicen muchas cosas.', win: 'Tres días para esto. Bueno. El paisaje compensa.' },
		r2_colegiala: { name: 'Zoé', cls: 'Colegiala', ai: 2, sprite: 'schoolkidf', team: [{ sp: 'pidgey', lv: 9 }, { sp: 'fletchling', lv: 9 }],
			intro: 'Esto va a ser legen… espera… ¡dario! Lo dice mi hermano mayor. No sé de dónde lo saca.', win: 'Esto ha sido… norm… espera… al.' },
		r2_joven: { name: 'Romain', cls: 'Joven', ai: 1, sprite: 'youngster', team: [{ sp: 'scatterbug', lv: 9 }, { sp: 'caterpie', lv: 8 }, { sp: 'weedle', lv: 8 }],
			intro: 'Mi primo monta Puertas Lemnis. Dice que el año que viene iremos de excursión a Alola. Por la tarde. ¡Y volvemos a cenar!', win: 'Mi primo dice que en Alola no pierde nadie. Mi primo dice muchas cosas.' },

		// ----- Ruta 1 -----
		r1_aprendiz: { name: 'Quentin', cls: 'Aprendiz de jinete', ai: 2, sprite: 'cowgirl', team: [{ sp: 'rhyhorn', lv: 10 }],
			intro: '¡La campeona dice que no estoy listo para la pista! Así que entreno aquí. Contra ti. Es lo mismo, ¿no?', win: 'No es lo mismo. Vale. Ya lo pillo.' },
		r1_pintor: { name: 'Loïc', cls: 'Pintor', ai: 1, sprite: 'artist', team: [{ sp: 'flabebe', lv: 10 }, { sp: 'ledyba', lv: 9 }],
			intro: 'Vengo de Acuarela. Allí todos pintamos; aquí todos montan. Yo no sé montar, así que pinto Rhyhorn quietos.', win: 'Hasta los Rhyhorn quietos se me mueven. Tendré que pintarte a ti.' },
		r1_vecina: { name: 'Josette', cls: 'Vecina de Boceto', ai: 2, sprite: 'lady', team: [{ sp: 'skitty', lv: 10 }, { sp: 'fletchling', lv: 10 }],
			intro: 'En Boceto hay más Rhyhorn que vecinos. Y los Rhyhorn tienen mejores modales.', win: 'Ve a ver a la campeona. Y no te pongas detrás de su Rhyhorn.' },

		// ----- Pueblo Boceto: alumnos de la campeona -----
		jinete_alumno_1: { name: 'Mylène', cls: 'Jinete', ai: 3, reward: 600,
			look: { hair: 'ponytail', hairColor: '#8a5a2f', outfit: '#c4473a', outfit2: '#e9e3d0', skin: 2, acc: 'goggles', eyesStyle: 'sharp', mouth: 'grin' },
			team: [{ sp: 'rhyhorn', lv: 11 }, { sp: 'skiddo', lv: 10 }],
			intro: 'La campeona dice que la pista se gana en la curva, no en la recta. Veamos tu curva.', win: '¡Uf! Me has adelantado por dentro. Eso no se hace. Eso se aplaude.' },
		jinete_alumno_2: { name: 'Gaëtan', cls: 'Jinete', ai: 3, reward: 650,
			look: { hair: 'short', hairColor: '#2b2b38', outfit: '#3b5bb5', outfit2: '#e9e3d0', skin: 4, acc: 'goggles', mouth: 'flat' },
			team: [{ sp: 'rhyhorn', lv: 12 }],
			intro: 'Mi Rhyhorn y yo llevamos tres años juntos. Él no sabe frenar. Yo tampoco. Funcionamos.', win: '…Él tampoco sabe perder. Dale un minuto.' },
	},

	// =================== GUIONES ===================
	scripts: {
		// ---------- Ruta 4: el rastro de la Fisura ----------
		b01_r4_rastro: [
			{ text: 'A mitad de la senda, {riolu} se para en seco.' },
			{ text: 'Se le eriza el pelo de la nuca. Mira fijamente un punto vacío sobre un parterre de flores amarillas y gruñe, muy bajito.' },
			{ say: 'rotom', text: '¡Bzzt! Lectura de energía rara. Muy rara. Rara de «esto no sale en mis manuales».' },
			{ text: 'Al principio no ves nada. Luego, entrecerrando los ojos, sí: una línea finísima en el aire, violeta, como un pelo pegado en una foto. **Un resto de grieta.**' },
			{ text: 'Debajo, entre las flores, algo tiembla. Un **Lechonk**, sucio de polen, con las orejas pegadas a la cabeza. No es de Kalos. Y lo sabe.' },
			{ choice: [
				{ text: 'Agacharte despacio y hablarle bajito.', then: [{ happy: { who: 'riolu', n: 5 } }, { text: 'El Lechonk olfatea tu mano. Tiembla un poco menos. Un poco.' }] },
				{ text: 'Dejar que {riolu} se acerque.', then: [{ happy: { who: 'riolu', n: 10 } }, { text: '{riolu} se sienta a su lado sin tocarlo. Su aura brilla un instante, muy suave. El Lechonk se apoya contra él como contra una pared caliente.' }] },
				{ text: 'No moverte. Ya está bastante asustado.', then: [{ text: 'Te quedas quiet{o|a|e}. El Lechonk te mira, tú lo miras. Durante un rato, nadie hace nada. Es casi agradable.' }] },
			] },
			{ text: 'Pasos sobre la grava. Un hombre con uniforme azul y plata, gafas y una mochila con antena. En la mano lleva un aparato con forma de linterna gorda y una lemniscata grabada en el mango.' },
			{ say: 'agente_lemnis', text: 'Ah, perfecto. Un desplazado de clase C. Porcino, origen Paldea. Apártese, por favor: protocolo de recogida.' },
			{ say: 'agente_lemnis', text: 'No se preocupe. Es mercancía… Un ejemplar, quiero decir. Lo devolvemos a su región. Eso pone el folleto.' },
			{ choice: [
				{ text: 'Apartarte. Él sabrá lo que hace.', then: [
					{ rep: { lemnis: 2 } }, { set: { 'flag.b01_lechonk_lemnis': true } },
					{ say: 'agente_lemnis', text: 'Gracias por su colaboración. Lemnis lo agradece.' },
					{ text: 'El agente apunta el aparato. Un haz de luz blanca envuelve al Lechonk, que chilla una sola vez y se encoge hasta desaparecer dentro de una cápsula transparente.' },
					{ call: 'b01_r4_despertar' },
				] },
				{ text: 'Plantarte delante del Lechonk.', then: [
					{ say: 'agente_lemnis', text: '¿En serio? Mire que esto va a quedar en mi informe.' },
					{ battle: 'agente_lemnis_r4', lose: 'continue',
						onWin: [{ rep: { lemnis: -3, policia: 2 } }, { set: { 'flag.b01_agente_vencido': true } }, { text: 'El agente se ajusta las gafas. Le tiembla un poco el dedo sobre el aparato.' }, { say: 'agente_lemnis', text: 'Protocolo es protocolo. Con o sin su permiso.' }],
						onLose: [{ heal: true, silent: true }, { text: '{riolu} se levanta tambaleándose. El agente ni os mira: ya está apuntando el aparato.' }] },
					{ text: 'El agente apunta el aparato hacia el Lechonk, que se ha escondido detrás de tus piernas. El aparato empieza a zumbar.' },
					{ call: 'b01_r4_despertar' },
				] },
			] },
			{ say: 'rotom', text: '¡Bzzt! La lectura rara ha desaparecido del todo. El rastro se pierde aquí. Lo siento, {jugador}.' },
			{ say: 'rotom', text: 'Pero oye… ese aparato. Cuando zumbó, la grieta… ¿no te pareció que **tiraba** de ella?' },
			{ set: { 'flag.b01_r4_rastro': true } },
			{ quest: 'b01_m2', stage: 'gimnasio' },
			{ say: 'rotom', text: 'Mientras tanto… ¡Ciudad Novarte está aquí al lado! ¡Y tiene gimnasio! ¡Medalla! ¡Medalla!' },
		],
		b01_r4_despertar: [
			{ text: 'El zumbido cambia de tono. Se vuelve agudo. Lo conoces: es **el mismo zumbido de la Puerta** la noche de la inauguración.' },
			{ text: 'La línea violeta del aire responde. Se ensancha, se retuerce, como si algo la estuviera estirando desde dentro del aparato. Y entonces escupe un latigazo de luz morada.' },
			{ text: 'Directo hacia ti.' },
			{ text: '{riolu} salta. Por segunda vez en su vida se pone entre tú y algo que no entiende. Por segunda vez no lo duda.' },
			{ text: 'Una luz azul le sube por los brazos y se le concentra en la palma de la mano. Golpea el latigazo en el aire con un **¡PAM!** seco, como una palmada en una catedral.' },
			{ text: 'La luz morada se deshace en chispas. La línea del aire se cierra con un chasquido. Silencio. Solo se oyen las fuentes.' },
			{ if: 'flag.b01_lechonk_lemnis', then: [
				{ text: 'El agente está pálido. Mira la cápsula, mira el aire, mira a {riolu}. Guarda el aparato como si quemara.' },
				{ say: 'agente_lemnis', text: 'Eso… eso no está en el folleto.' },
				{ text: 'Se marcha a paso rápido hacia Luminalia con la cápsula bajo el brazo. Dentro, el Lechonk te mira hasta que deja de verte.' },
			], else: [
				{ text: 'El aparato del agente echa humo. Una chispa, otra, y la luz del mango se apaga del todo.' },
				{ say: 'agente_lemnis', text: '¡Un equipo de contención de cuarenta mil…! ¡Esto lo paga… alguien! ¡Lo paga alguien!' },
				{ text: 'Mira a {riolu}. Da un paso atrás. Luego otro. Luego se va corriendo hacia Luminalia, con la mochila dando botes.' },
				{ text: 'El Lechonk asoma la cabeza por detrás de tus piernas. Te mira. Mira a {riolu}. Resopla.' },
				{ choice: [
					{ text: 'Intentar atraparlo con cuidado.', then: [
						{ wild: { sp: 'lechonk', lv: 6 },
							onCatch: [{ set: { 'flag.b01_lechonk_atrapado': true } }, { text: 'El Lechonk se acomoda dentro de la Poké Ball sin protestar. Después de una cápsula de Lemnis, una Poké Ball debe de parecerle un hotel.' }],
							onWin: [{ text: 'El Lechonk se sacude, te mira ofendido y se va trotando entre las flores. Por lo menos se va libre.' }],
							onRun: [{ text: 'Os separáis. El Lechonk se pierde trotando entre los parterres. Libre.' }],
							onLose: [{ heal: true, silent: true }, { text: 'El Lechonk aprovecha y se escabulle entre las flores. Libre, eso sí.' }] },
					] },
					{ text: 'Dejarlo ir libre.', then: [{ text: 'Le haces un gesto con la mano. El Lechonk duda, olfatea a {riolu} una última vez y se va trotando entre los parterres. Se para a comer una flor. Se va.' }] },
				] },
			] },
			{ text: '{riolu} se mira la mano. Todavía le brilla. Te mira a ti, muy serio, como preguntando si eso ha sido cosa suya.' },
			{ learn: { who: 'riolu', move: 'forcepalm', force: true } },
			{ happy: { who: 'riolu', n: 20 } },
			{ set: { 'flag.b01_palmeo': true } },
			{ say: 'rotom', text: '¡Bzzt! ¡Eso fue **Palmeo**! ¡{riolu} lo ha aprendido solo! ¡En plena ruta! ¡Esto lo tengo que contar! ¿A quién se lo cuento? ¡A ti! ¡Ya te lo he contado!' },
		],
		b01_r4_panal: [
			{ if: 'flag.b01_panal_miel', then: [{ text: 'El panal sigue en su sitio. Los Combee te vigilan con sus seis ojos. Tres cada uno. Mejor no abusar.' }, { end: true }] },
			{ text: 'Un panal dorado, del tamaño de un melón, encajado entre las ramas del seto. Gotea **miel**. Huele a gloria.' },
			{ if: 'night', then: [
				{ text: 'Es de noche. Los Combee duermen apelotonados, con un zumbido suave, como un ronquido de tres voces.' },
				{ text: 'Metes la mano con mucho cuidado y sacas un trozo de panal. Nadie se despierta. {riolu} te mira como si acabaras de robar un banco.' },
				{ give: 'honey' }, { set: { 'flag.b01_panal_miel': true } },
				{ if: 'quest.b01_t_gaspar == "ingredientes"', then: [{ say: 'rotom', text: '¡Bzzt! ¡Miel! ¡Uno de los ingredientes de Gaspar! Uno menos.' }] },
				{ end: true },
			] },
			{ text: 'Los Combee están despiertos y trabajando. Zumban en formación. Te han visto.' },
			{ choice: [
				{ text: 'Sacudir el seto y coger la miel.', then: [
					{ text: 'Sacudes el seto. Error. Un Combee sale disparado con cara de pocos amigos. Bueno, con tres caras de pocos amigos.' },
					{ wild: { sp: 'combee', lv: 8 }, lose: 'continue',
						onWin: [{ text: 'Mientras el Combee se recupera, coges un trozo de panal y te alejas a paso ligero.' }, { give: 'honey' }, { set: { 'flag.b01_panal_miel': true } }],
						onCatch: [{ text: 'Con su guardián dentro de tu Poké Ball, el resto de la colmena decide que no merece la pena. Coges un trozo de panal.' }, { give: 'honey' }, { set: { 'flag.b01_panal_miel': true } }],
						onRun: [{ text: 'Sales corriendo. Los Combee te persiguen tres setos. Sin miel.' }],
						onLose: [{ heal: true, silent: true }, { text: 'Los Combee te echan de su seto. Sin miel, y con una picadura en la oreja.' }] },
					{ if: 'flag.b01_panal_miel && quest.b01_t_gaspar == "ingredientes"', then: [{ say: 'rotom', text: '¡Bzzt! ¡Miel para Gaspar! Con sabor a victoria. Y a picadura.' }] },
				] },
				{ text: 'Volver de noche, cuando duerman.', then: [{ say: 'rotom', text: '¡Bzzt! Plan sigiloso. Me gusta. Apunto: «volver de noche al seto de la miel».' }] },
			] },
		],
		b01_r4_jardin: [
			{ if: 'flag.b01_jardin_mt', then: [{ text: 'El Jardín Prohibido sigue igual: setos perfectos, un banco de piedra y la sensación de que dentro cabe más de lo que debería. No queda nada que llevarse. Bueno, la paz.' }, { end: true }] },
			{ text: 'Empujas la verja. Chirría como si protestara.' },
			{ text: 'Dentro hay un laberinto de setos. Desde fuera parecía un jardincito. Desde dentro… es más grande. Mucho más grande. No tiene sentido. Lo recorres igual.' },
			{ text: 'En el centro, un banco de piedra y una estatua de un Talonflame con las alas abiertas. Sobre el pedestal, alguien ha dejado una caja metálica con una nota: «Para quien llegue hasta aquí sin pisar el césped».' },
			{ text: 'Miras tus zapatos. Miras el césped. Decides que la nota no habla de ti.' },
			{ give: 'mt_airecortante' },
			{ set: { 'flag.b01_jardin_mt': true } },
			{ say: 'rotom', text: '¡Bzzt! **Aire Afilado**. A los Fletchling les encanta. Y a sus entrenadores también. Bueno, a los que no pisan el césped.' },
		],
		b01_r4_furfrou: [
			{ text: 'Dentro del seto hay un Furfrou blanco. Bueno, medio blanco: tiene la mitad del cuerpo esquilada al ras y la otra mitad con un tupé enorme. Parece dos perros mal pegados.' },
			{ text: 'Al verte, hunde la cabeza entre las patas. Está muerto de vergüenza.' },
			{ choice: [
				{ text: '«Oye, ese corte es… atrevido. Me gusta.»', then: [{ text: 'El Furfrou levanta una oreja. Solo una. Te mira con desconfianza, pero se le mueve la cola.' }] },
				{ text: 'Taparle la parte esquilada con hojas del seto.', then: [{ text: 'Le pones hojas encima con mucho cuidado. Ahora parece un seto con patas. El Furfrou se mira y, sorprendentemente, parece satisfecho.' }] },
				{ text: 'Dejar que {riolu} se acerque.', then: [{ happy: { who: 'riolu', n: 3 } }, { text: '{riolu} se sienta delante del Furfrou y no se ríe. Ni un poquito. El Furfrou lo agradece con un lametón que lo deja despeinado a él también.' }] },
			] },
			{ text: 'El Furfrou sale del seto y se te pega a los talones. Parece que está dispuesto a volver a casa. Siempre que nadie lo mire.' },
			{ set: { 'flag.b01_furfrou_hallado': true } },
			{ toast: 'Lleva al Furfrou a la peluquería de Novarte.' },
		],

		// ---------- Novarte: llegada y Rhi ----------
		b01_llegada_novarte: [
			{ quest: 'b01_m3', stage: 'reto' },
			{ text: 'Ciudad Novarte huele a geranios y a pan. En la plaza, una fuente; detrás, el gimnasio con su tejado de cristal.' },
			{ text: 'La puerta del gimnasio se abre de golpe. Rebota contra la pared. Sale una chica pelirroja, chaqueta de fútbol galarés, número 9.' },
			{ say: 'rhi', text: '¡FUERA DE JUEGO! ¡Eso era fuera de juego! ¡Ese Onix no cae! ¡Le di de lleno! ¡Le di DOS veces! ¡Y nada!' },
			{ say: 'rhi', text: '«Robustez», dice el líder, todo sonriente. Como si fuera un mérito. ¡Un Onix que aguanta un golpe que lo debería tumbar y se queda con un hilito de vida! ¡Y luego Tumba Rocas, y tus Pokémon corren como si llevaran botas de barro!' },
			{ set: { 'flag.b01_rhi_conto_onix': true } },
			{ text: 'Te ve. Se para. Entrecierra los ojos.' },
			{ say: 'rhi', text: '¡Tú! {El|La|Le} de la plaza. {El|La|Le} que no tiene pinta de delanter{o|a|e}.' },
			{ if: 'flag.b01_palmeo', then: [{ say: 'rhi', text: '…Y ese Riolu tiene otra cara. Más… algo. ¿Qué le has hecho?' }] },
			{ say: 'rhi', text: 'Mira, hoy necesito ganarle a alguien. Necesito. Y tú estás aquí, de pie, en medio. Eso es un penal sin portero.' },
			{ set: { 'flag.b01_rhi_novarte': true } },
			{ choice: [
				{ text: '«Acepto. Pero luego no llores.»', then: [{ af: { rhi: 1 } }, { say: 'rhi', text: '¡JA! ¡Eso! ¡Así se habla!' }, { call: 'b01_rhi_combate' }] },
				{ text: '«Vale. Pero sin gritar.»', then: [{ say: 'rhi', text: 'No prometo nada. Yo grito. Es mi forma de respirar.' }, { call: 'b01_rhi_combate' }] },
				{ text: '«Hoy no.»', then: [
					{ af: { rhi: -2 } },
					{ say: 'rhi', text: 'Cobarde.' },
					{ text: 'Lo dice sin gritar. Que es peor.' },
					{ say: 'rhi', text: 'Estaré en la fuente. Chutando piedras. Si te vuelve la sangre al cuerpo, ya sabes dónde.' },
				] },
			] },
			{ say: 'rotom', text: '¡Bzzt! Consejo de Rotom: en el **Patio del Gimnasio** se puede entrenar antes de la pared. Y en la **Guía de Retos** está lo que sabemos de Brock. ¡Ahora sabemos lo del Onix!' },
		],
		b01_rhi_combate: [
			{ battle: 'rhi_1', lose: 'continue',
				onWin: [
					{ af: { rhi: 5 } }, { set: { 'flag.b01_rhi_vencida_1': true } },
					{ say: 'rhi', text: '…' },
					{ say: 'rhi', text: 'Vale. Vale, vale, vale. Eso ha sido un golazo. Tuyo. Lo reconozco. Que conste que lo reconozco porque es verdad, no porque me caigas bien.' },
					{ say: 'rhi', text: 'Novat{o|a|e}. —Lo dice distinto. Como si la palabra pesara un poco más—. No está mal, novat{o|a|e}.' },
				],
				onLose: [
					{ af: { rhi: 1 } }, { heal: true, silent: true },
					{ say: 'rhi', text: '¡GOOOL! ¡Eso necesitaba! ¡Gracias! …Al menos lo intentaste. Bueno, no mucho.' },
					{ say: 'rhi', text: 'Mira, que se te ha quedado cara de poste. Un consejo gratis: contra ese Onix, pega fuerte y pega dos veces. Yo pegué fuerte una.' },
				] },
			{ intel: { npc: 'rhi', text: 'Novata de Galar, dorsal 9. En Novarte usó a Scorbunny (Fuego) y Rookidee (Volador, con Afilagarras y Chulería). Ataca primero y pregunta después.' } },
			{ say: 'rhi', text: 'Me voy al patio. Mañana ese Onix se come un golazo. Por la escuadra.' },
		],
		b01_rhi_fuente_reto: [
			{ say: 'rhi', text: '¿Qué? ¿Ya te ha vuelto la sangre al cuerpo? ¿O vienes a mirar cómo chuto piedras?' },
			{ choice: [
				{ text: '«Vengo a por ese partido.»', then: [{ say: 'rhi', text: '¡Por fin! ¡Saca tú, que soy generosa!' }, { call: 'b01_rhi_combate' }] },
				{ text: '«Solo pasaba.»', then: [{ say: 'rhi', text: 'Pues pasa. Pasar se te da bien.' }] },
			] },
		],
		b01_rhi_fuente: [
			{ say: 'rhi', text: '¿Qué miras? Ve a por tu medalla. Yo voy a por la mía. Quien llegue segund{o|a|e} invita a la cena. Y no pienso invitar.' },
			{ if: 'flag.b01_rhi_vencida_1', then: [{ say: 'rhi', text: 'Y no te creas que me olvido del partido. Lo tengo apuntado. En la libreta de revanchas. Tiene muchas páginas.' }] },
		],
		b01_rhi_fuente_medalla: [
			{ say: 'rhi', text: '¿La Medalla Roca? ¿TÚ? ¿Antes que yo?' },
			{ text: 'Se queda callada un segundo. Luego te da un puñetazo en el hombro. Flojo. Para ser Rhi.' },
			{ say: 'rhi', text: 'Bien. Bien hecho. Me fastidia muchísimo, pero bien hecho. ¿Ves? Soy capaz de decirlo.' },
			{ say: 'rhi', text: 'Yo me la llevo mañana. Y luego a por la siguiente, y la siguiente, y en la Copa nos vemos. Tú en la portería. Yo con el balón.' },
			{ af: { rhi: 1 } },
			{ set: { 'flag.b01_rhi_novarte_fin': true } },
			{ text: 'Rhi coge su bolsa, chuta una última piedra a la fuente (entra limpia por el chorro del centro) y se va hacia el gimnasio sin mirar atrás.' },
		],

		// ---------- Gimnasio de Novarte ----------
		b01_brock_arriba: [
			{ text: 'Brock se asoma desde lo alto de la pared y te saluda con un cucharón.' },
			{ say: 'brock', text: '¡Hola! ¡Primero la pared! Las rocas no se saltan. Bueno, sí se saltan, pero eso es trampa y luego me toca a mí bajar a buscarte.' },
			{ say: 'brock', text: 'Hay dos tramos. Dos entrenadores. Cuando llegues arriba, te espero con el combate. Y con estofado, si te portas bien.' },
		],
		b01_brock_reto: [
			{ if: '!flag.b01_brock_conocido', then: [
				{ text: 'Llegas a la plataforma sin aliento. Brock deja el cucharón en un hornillo portátil, se limpia las manos en el delantal y te tiende una.' },
				{ say: 'brock', text: '¡Bienvenid{o|a|e} arriba! Soy Brock, de Ciudad Plateada, en Kanto. Líder de intercambio y, según mis entrenadores, el mejor cocinero de Novarte. Lo segundo cuesta más que lo primero.' },
				{ say: 'brock', text: 'Hace años me arrodillaba delante de cada chica guapa que veía. Ahora me arrodillo para atarme las botas. Es lo que tiene madurar: las rodillas se quejan más que el corazón.' },
				{ say: 'brock', text: 'Mi Croagunk se quedó en Kanto. Desde entonces nadie me da un Puya Nociva en el costado cuando me pongo tonto. Lo echo de menos. Raro, ¿no?' },
				{ set: { 'flag.b01_brock_conocido': true } },
			] },
			{ if: 'flag.b01_rhi_vencida_1', then: [{ say: 'brock', text: 'Me han dicho que le ganaste a la chica de Galar. Tiene mucho fuego. Le falta saber cuándo no usarlo.' }] },
			{ say: 'brock', text: '¿Lista la mochila? ¿Curado el equipo? Esto es la Liga, no una merienda. La merienda es después.' },
			{ choice: [
				{ text: '«Cuando quieras.»', then: [
					{ battle: 'brock_g1', onWin: [{ call: 'b01_brock_victoria' }] },
				] },
				{ text: '«Dame un momento.»', then: [{ say: 'brock', text: 'Claro. Las rocas tienen paciencia. Yo también. Bueno, el estofado no tanto.' }] },
			] },
		],
		b01_brock_victoria: [
			{ say: 'brock', text: '¡Eso es! La firmeza de una roca no sirve de nada si no sabes cuándo moverte. Tú lo sabías. Y tu equipo también.' },
			{ if: 'inParty("riolu")', then: [{ say: 'brock', text: 'Y ese Riolu… pega como si supiera dónde está el punto débil antes de mirarlo. Cuídalo. Los que ven así no abundan.' }] },
			{ say: 'brock', text: 'Toma. Te la has ganado: la **Medalla Roca** del Circuito Infinito.' },
			{ badge: 'medalla_roca' },
			{ cap: 24 },
			{ say: 'brock', text: 'Y esta MT. **Tumba Rocas**: daña y frena al rival. Es la que te ha amargado la tarde, así que ya sabes lo bien que funciona.' },
			{ give: 'mt_tumbarocas' },
			{ quest: 'b01_m3', done: true },
			{ say: 'brock', text: 'Me queda poco en Kalos, ¿sabes? El Intercambio dura una temporada. Luego vuelvo a Kanto… Y en Teselia me han ofrecido un gimnasio. Algún día. Si el gimnasio tiene cocina.' },
			{ say: 'brock', text: 'Ahora baja, que la pared también se baja. Y vuelve luego, que te guardo un plato.' },
			{ go: 'novarte' },
			{ call: 'b01_alexia_novarte' },
			{ call: 'b01_handsome_medalla' },
			{ save: true },
		],
		b01_brock_comida: [
			{ text: 'Brock destapa una olla. Sale una nube de vapor que huele a romero, a cebolla dulce y a algo de Kanto que no sabes nombrar.' },
			{ say: 'brock', text: '**Estofado de Plateada**, versión Kalos. Allí lo hago con setas de Monte Moon; aquí con las del Bosque de Novarte. Las de aquí son más finas. No se lo digas a mi madre.' },
			{ text: 'Tus Pokémon salen solos de sus Poké Balls. Brock les sirve primero a ellos. Siempre primero a ellos.' },
			{ happy: { who: 'party0', n: 5 } }, { happy: { who: 'party1', n: 5 } }, { happy: { who: 'party2', n: 5 } },
			{ happy: { who: 'party3', n: 5 } }, { happy: { who: 'party4', n: 5 } }, { happy: { who: 'party5', n: 5 } },
			{ say: 'brock', text: 'Alexia dice que cocino mejor que su hermana. Violeta dice que fotografía mejor que yo. Las dos tienen razón y ninguna quiere oírlo.' },
			{ say: 'brock', text: 'Un consejo de criador, ya que estamos: un Pokémon que come bien, combate bien. Y uno que come contigo, combate **por** ti.' },
			{ set: { 'flag.b01_brock_comida': true } },
		],
		b01_brock_generico: [
			{ say: 'brock', text: '¡Hola de nuevo! ¿Hambre? Siempre hay algo en el fuego. Hoy, crepes de Baya Aranja. Están raras. Están buenísimas.' },
			{ if: 'badges >= 2', then: [{ say: 'brock', text: '¿Ya llevas más medallas? ¡Así me gusta! Cuando vuelva a Kanto, presumiré de que te di la primera.' }] },
		],
		b01_gym_galletas: [
			{ text: 'Una mesa plegable con un mantel de cuadros y una bandeja de galletas de mantequilla. Un cartelito: «Galletas con el líder. Una por persona. Brock lo sabe».' },
			{ if: 'flag.b01_galleta', then: [{ text: 'Ya cogiste una. Brock lo sabe. Desde arriba, te guiña un ojo.' }], else: [
				{ text: 'Coges una. Está calentita. Sabe a domingo.' },
				{ heal: 'Te sientes con fuerzas renovadas. Tu equipo también: se han comido las migas.' },
				{ set: { 'flag.b01_galleta': true } },
			] },
		],

		// ---------- Tras la medalla: Alexia y Handsome ----------
		b01_alexia_novarte: [
			{ text: 'Al salir del gimnasio, alguien te espera junto a la fuente con la cámara en alto. Clic.' },
			{ say: 'alexia', text: '¡Primera medalla! Esta foto va a la portada. Bueno, a la página siete. La portada es para Lemnis. Siempre es para Lemnis.' },
			{ if: 'flag.b01_prensa_verdad', then: [{ say: 'alexia', text: 'Por cierto: tu declaración del otro día me consiguió tres cartas de abogados de Lemnis. Las tengo enmarcadas, al lado de las de mi casero.' }] },
			{ if: 'flag.b01_prensa_lemnis', then: [{ say: 'alexia', text: 'Sigo sin creerme lo del «fallo técnico». Pero bueno, tú lo viste de cerca y yo no. Eso me dice mi parte educada.' }] },
			{ say: 'alexia', text: 'Violeta es mi hermana, ¿sabes? La líder de siempre. Me pidió que vigilara que Brock no le quemara el gimnasio. De momento solo ha quemado una tortilla. Y se disculpó con la tortilla.' },
			{ say: 'alexia', text: 'Te propongo un encargo. Desde la inauguración aparecen Pokémon de otras regiones por toda Kalos. Lemnis dice que son «casos aislados». Yo quiero pruebas. Fotos.' },
			{ say: 'alexia', text: 'Registra en tu Pokédex al menos **cinco especies desplazadas** distintas. Que no sean de Kalos. Vuelve aquí y las publico. Con tu nombre en los créditos, si quieres.' },
			{ quest: 'b01_s_fotos', stage: 'registrar' },
			{ say: 'rotom', text: '¡Bzzt! ¡Fotos! ¡Me encanta salir en las fotos! Ah, que las fotos las hago yo. También me encanta.' },
		],
		b01_alexia_fotos: [
			{ if: FOTOS + ' >= 5', then: [
				{ text: 'Alexia conecta tu Pokédex a su cámara. Pasa las imágenes una a una. Cada vez se ríe menos y escribe más.' },
				{ say: 'alexia', text: 'Esto… esto es una exclusiva. Cinco especies que no tienen nada que hacer en Kalos. Con hora, lugar y cara de susto.' },
				{ say: 'alexia', text: 'Lemnis va a decir que son montajes. Que digan. Las fotos no mienten.' },
				{ say: 'rotom', text: '¡Bzzt! Y los datos tampoco. Los datos no mienten; se equivocan los que los leen.', cond: 'flag.b01_diario' },
				{ say: 'alexia', text: 'Ja. Hablas como un profesor de estadística. Me la apunto para el titular.', cond: 'flag.b01_diario' },
				{ say: 'rotom', text: '¡Bzzt! ¡Y las hice yo! ¡Con mi mejor ángulo!', cond: '!flag.b01_diario' },
				{ say: 'alexia', text: 'Toma. Es una **Moneda Amuleto**. Me la regaló Violeta cuando empecé en el periódico: con ella, ganas más dinero en cada combate. Yo ya no combato. Tú sí.' },
				{ give: 'amuletcoin' },
				{ rep: { kalos: 3, lemnis: -2 } },
				{ quest: 'b01_s_fotos', done: true },
				{ intel: { npc: 'alexia', text: 'Hermana de Violeta, la líder titular de Novarte. Publicó tus fotos de Pokémon desplazados en el *Diario de Luminalia*, contra la versión oficial de Lemnis.' } },
				{ diary: 'Hoy Alexia publicó nuestras fotos de los Pokémon perdidos. ¡Salgo en los créditos! Bueno, sale mi entrenador{|a|e}, pero las hice yo. Ojalá el doctor Moreau las vea: le encantan los datos. ¡Bzzt! Hoy estoy muy orgulloso.', cond: 'flag.b01_diario' },
				{ end: true },
			] },
			{ say: 'alexia', text: '¿Cómo va el reportaje? A ver esas fotos.' },
			{ text: 'Alexia repasa tu Pokédex:' },
			{ text: '✔ **Lechonk** (Paldea)', cond: "seen('lechonk')" },
			{ text: '✔ **Shinx** (Sinnoh)', cond: "seen('shinx')" },
			{ text: '✔ **Tarountula** (Paldea)', cond: "seen('tarountula')" },
			{ text: '✔ **Fidough** (Paldea)', cond: "seen('fidough')" },
			{ text: '✔ **Rookidee** (Galar)', cond: "seen('rookidee')" },
			{ text: '✔ **Wooloo** (Galar)', cond: "seen('wooloo')" },
			{ text: '✔ **Mareep** (Johto)', cond: "seen('mareep')" },
			{ text: '✔ **Larvitar** (Johto)', cond: "seen('larvitar')" },
			{ say: 'alexia', text: 'Me hacen falta **cinco** especies distintas. Te doy pistas de periodista: en la Ruta 4, entre las flores; en la Ruta 3, algo que huele a pan; de noche, en el Bosque de Novarte, algo con muchas patas; en la Ruta 2, un pájaro de Galar.' },
			{ say: 'alexia', text: 'Y dicen que más al oeste, detrás de las vallas de la Ruta 5, hay ovejas que no son de aquí. Cuando Lemnis las quite, claro.', cond: '!flag.b01_ruta5_abierta' },
			{ say: 'alexia', text: 'Y dicen que por la Ruta 5 pastan ovejas que no son de aquí. Y más al oeste, vete tú a saber.', cond: 'flag.b01_ruta5_abierta' },
		],
		b01_alexia_fotos_despues: [
			{ say: 'alexia', text: 'El artículo de las fotos ha dado muchísimo que hablar. Lemnis ha mandado un comunicado de cuatro páginas para decir que no pasa nada. Cuatro páginas para «nada».' },
			{ say: 'alexia', text: 'Sigue con los ojos abiertos, {jugador}. Y la Pokédex también.' },
		],
		b01_handsome_medalla: [
			{ text: 'Tu Pokédex vibra en el bolsillo.' },
			{ say: 'rotom', text: '¡Bzzt! Llamada entrante de… **HANDSOME**. Tiene foto de perfil con bigote falso. ¿Lo cojo? ¡Lo cojo!' },
			{ say: 'handsome', text: '{jugador}. ¡Una medalla! Handsome lo celebra. Por dentro. Estoy en un sitio donde no se puede celebrar por fuera.' },
			{ if: 'flag.b01_agente_vencido', then: [{ say: 'handsome', text: 'Me han dicho que te plantaste delante de un agente de Lemnis en la Ruta 4. Y que le ganaste. Handsome está orgulloso. Y preocupado. Orgullocupado.' }] },
			{ if: 'flag.b01_lechonk_lemnis', then: [{ say: 'handsome', text: 'Lo del agente de la Ruta 4… Ese Lechonk que se llevaron. He preguntado en Paldea. No ha llegado. Ni ese ni ninguno.' }] },
			{ if: '!flag.b01_agente_vencido && !flag.b01_lechonk_lemnis', then: [{ say: 'handsome', text: 'Me han contado lo de la Ruta 4. Un agente de Lemnis, un aparato que echaba humo y un Riolu que brillaba. Handsome quiere todos los detalles. En persona.' }] },
			{ say: 'handsome', text: 'Lemnis está «recogiendo» Pokémon de la Fisura por media Kalos. Algo no cuadra. Ven a la **Agencia de Detectives**, en Luminalia. Matière tiene algo para ti. Y yo tengo… hambre, pero eso es otro tema.' },
			{ say: 'handsome', text: 'Ah, y no le digas a nadie que te he llamado. Sobre todo a mi jefa. …Que es Matière. Que se va a enterar igual. Olvídalo.' },
			{ quest: 'b01_m2', stage: 'agencia' },
		],

		// ---------- Novarte: peluquería (Furfrou) ----------
		b01_peluquera_1: [
			{ text: 'La peluquería tiene la persiana a medio bajar. Dentro, una señora mayor con gafas en la punta de la nariz se abanica con un peine.' },
			{ say: 'peluquera_novarte', text: '¡Ay! ¿Cliente? No, no, hoy no corto. Hoy no corto nada. Ni el pan.' },
			{ say: 'peluquera_novarte', text: 'Mi sobrino quiso aprender el oficio con mi Furfrou. «Tía, déjame a mí, que he visto un vídeo». ¡Un vídeo! Le hizo medio corte Señorita y medio corte… no sé ni qué. **Corte Desastre.**' },
			{ say: 'peluquera_novarte', text: 'El pobre se vio en el escaparate y salió corriendo hacia la **Ruta 4**. Le da vergüenza. Y le entiendo. Cuarenta años cortando pelo y nunca había visto nada igual.' },
			{ choice: [
				{ text: '«Yo lo busco.»', then: [{ say: 'peluquera_novarte', text: '¿De verdad? ¡Ay, qué cielo! Búscalo entre los setos, que se esconde donde no le vean. Y por lo que más quieras: no te rías.' }, { quest: 'b01_s_furfrou', stage: 'buscar' }] },
				{ text: '«Ahora no puedo.»', then: [{ say: 'peluquera_novarte', text: 'Nadie puede. Nadie puede nunca. Yo me quedo aquí, abanicándome.' }] },
			] },
		],
		b01_peluquera_recordar: [
			{ say: 'peluquera_novarte', text: '¿Nada? Está en la Ruta 4, seguro. En los setos. Es blanco… bueno, medio blanco. Lo reconocerás. Lo reconocería un ciego.' },
		],
		b01_peluquera_vuelta: [
			{ text: 'El Furfrou entra en la peluquería detrás de ti, con la cabeza baja. La señora suelta el abanico.' },
			{ say: 'peluquera_novarte', text: '¡MI NIÑO! ¡Mi niño precioso! ¡Ven aquí! No, no te escondas. Nadie se va a reír. —Te mira por encima de las gafas—. ¿Verdad?' },
			{ text: 'Coge las tijeras. Clic, clic, clic. Diez minutos de silencio absoluto. Cuando termina, el Furfrou tiene un **Corte Corazón** impecable. Se mira en el espejo. Se mira otra vez. Se pone a dar saltitos.' },
			{ say: 'peluquera_novarte', text: 'Así. Así se corta. Ni vídeos ni nada. Toma, por traérmelo. Era de mi marido; decía que daba suerte. A mí me da pena venderla.' },
			{ give: 'nugget' },
			{ say: 'peluquera_novarte', text: 'Y si alguna vez tienes un Furfrou, tráemelo. A ti te corto gratis. A mi sobrino, nunca más.' },
			{ rep: { kalos: 2 } },
			{ quest: 'b01_s_furfrou', done: true },
		],
		b01_peluquera_despues: [
			{ say: 'peluquera_novarte', text: '¡Hola, cielo! Mi Furfrou ya no se esconde. Ahora se pone en el escaparate. Todo el día. Es un presumido. Ha salido a mí.' },
		],

		// ---------- Novarte: el señor del balcón ----------
		b01_balcon_1: [
			{ text: 'Un señor mayor riega unos geranios que ya chorrean agua. Te ve y deja la regadera.' },
			{ say: 'senor_balcon', text: 'Mi mujer cultivaba flores para las Flabébé de la Ruta 4. Venían cada primavera a este balcón, cada una a su flor. Desde que ella no está, no ha vuelto ninguna.' },
			{ say: 'senor_balcon', text: 'Yo sigo regando. Por si acaso. Las flores no tienen la culpa.' },
			{ say: 'senor_balcon', text: 'Si algún día tienes una Flabébé… ¿me la enseñarías? Solo un momento. Sé que es una tontería.' },
		],
		b01_balcon_flabebe: [
			{ text: 'Tu Flabébé sale de la Poké Ball, mira el balcón y, sin que nadie se lo pida, vuela hasta el geranio más rojo. Se queda ahí, flotando, con su flor junto a la flor.' },
			{ say: 'senor_balcon', text: 'Ah. Ahí era donde se ponía siempre la de mi mujer. En la roja.' },
			{ text: 'El señor no dice nada más durante un rato largo. Luego se quita las gafas y se las limpia con la camisa, aunque no les hace falta.' },
			{ say: 'senor_balcon', text: 'Gracias. Toma. Ella las guardaba para los Pokémon cansados que pasaban por la calle. Ahora es tuya.' },
			{ give: 'sitrusberry' },
			{ set: { 'flag.b01_balcon_flabebe': true } },
			{ rep: { kalos: 1 } },
		],
		b01_balcon_despues: [
			{ say: 'senor_balcon', text: '¿Sabes qué? Esta mañana vino una Flabébé salvaje. A la roja. Solo un momento. Pero vino.' },
		],

		// ---------- Bosque de Novarte: el zorrito perdido ----------
		b01_bosque_huellas: [
			{ text: 'En el barro del camino hay huellas pequeñas, de cuatro dedos. Y alrededor de cada huella, la hierba está **chamuscada**, como si alguien hubiera pisado con los pies en llamas.' },
			{ text: '{riolu} olfatea una. Estornuda. Huele a ceniza.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Huellas de Fennekin! Comparadas con mi base de datos… ¡97 % de coincidencia! El otro 3 % es barro.' },
			{ quest: 'b01_s_fennekin', stage: 'pistas' },
		],
		b01_bosque_lucien: [
			{ text: 'Una voz de niño grita desde lo alto de un tocón.' },
			{ if: 'flag.b01_lucien_1', then: [
				{ say: 'lucien', text: '¡{jugador}! ¡{jugador}! ¡Soy yo, Lucien! ¡El de la valla de la Puerta! ¡Ayúdame, es una emergencia!' },
			], else: [
				{ say: 'lucien', text: '¡Oye! ¡Tú! ¡Tú eres {el|la|le} de la Puerta, {el|la|le} del Riolu! ¡Te vi en la tele! Me llamo Lucien. ¿Y tú? …¡{jugador}! Vale, {jugador}: ¡ayúdame, es una emergencia!' },
				{ set: { 'flag.b01_lucien_1': true } },
			] },
			{ say: 'lucien', text: 'He venido de excursión con el cole y se me ha volado la gorra. ¡Mi gorra de la suerte! ¡La que tiene una Puerta Lemnis bordada! Está ahí arriba. Y la profe está contando cabezas y si no vuelvo con gorra me va a contar dos veces.' },
			{ text: 'La gorra cuelga de una rama alta, como un nido amarillo.' },
			{ choice: [
				{ text: 'Trepar al árbol.', then: [{ text: 'Trepas. Te raspas una rodilla, te clavas una ramita en un sitio que no vas a contar y llegas arriba. La gorra es tuya. Bueno, de Lucien.' }] },
				{ text: 'Pedirle a {riolu} que salte.', then: [{ happy: { who: 'riolu', n: 3 } }, { text: '{riolu} mide la distancia, toma impulso en el tocón y salta. Agarra la gorra al vuelo y aterriza delante de Lucien con una pose que nadie le ha enseñado.' }, { say: 'lucien', text: '¡HALA! ¡Es como en las películas! ¡Otra vez! ¡Hazlo otra vez!' }] },
				{ text: 'Sacudir el árbol.', then: [{ text: 'Sacudes el árbol. Cae la gorra. Cae también un Scatterbug, justo encima de tu cabeza. Te mira. Lo miras. Se va.' }] },
			] },
			{ text: 'Lucien coge la gorra. Se queda quieto. La toca otra vez.' },
			{ say: 'lucien', text: 'Está… calentita. Y tiene pelos naranjas. Y huele a… ¿a chimenea?' },
			{ say: 'lucien', text: '¡Un zorrito de fuego ha dormido en mi gorra! ¡Lo vi antes, pasó corriendo echando chispas, hacia donde zumban los bichos! ¡Es la mejor gorra del mundo ahora! ¡No pienso lavarla nunca!' },
			{ say: 'lucien', text: 'Iba muy asustado. ¿Lo vas a buscar? ¡Búscalo! Y si lo encuentras, dile que mi gorra está a su disposición.' },
			{ set: { 'flag.b01_lucien_gorra': true } },
			{ text: 'Una voz de adulta grita «¡LUCIEN PERROT!» a lo lejos. Lucien sale corriendo con la gorra puesta del revés.' },
		],
		b01_bosque_humo: [
			{ text: 'Un olor a quemado. No a incendio: a cerilla recién apagada. A algo pequeño que tiene miedo y echa chispas sin querer.' },
			{ text: '{riolu} levanta las orejas. Más adelante, el zumbido de los bichos sube de volumen. Muchos bichos. Enfadados.' },
			{ say: 'rotom', text: '¡Bzzt! Temperatura ambiente: subiendo. Nivel de bichos: subiendo. Mi nivel de valentía: bajando. Pero te sigo, ¿eh?' },
		],
		b01_bosque_fennekin: [
			{ text: 'Un chillido agudo, como una tetera.' },
			{ text: 'Al fondo de un claro, contra un tronco hueco, hay un **Fennekin**. Tiene las orejas echando humo y la cola erizada. Delante, tres Spewpa le cierran el paso. No atacan: lo empujan, rodando, una y otra vez, contra el tronco. Como si quisieran echarlo de su bosque.' },
			{ text: 'El Fennekin intenta lanzar fuego. Le sale una chispa. Una sola. Está agotado.' },
			{ text: 'Uno de los Spewpa se gira hacia ti.' },
			{ wild: { sp: 'spewpa', lv: 8, noCatch: true }, canRun: false, lose: 'continue',
				onWin: [{ text: 'El Spewpa rueda hacia atrás. Los otros dos se miran, lo miran a él, te miran a ti… y se van rodando entre los helechos.' }],
				onLose: [{ heal: true, silent: true }, { text: 'Tu equipo cae. Pero al verte en el suelo, el Fennekin saca fuerzas de algún sitio y suelta unas **Ascuas** de verdad. Los Spewpa salen rodando como piedras cuesta abajo.' }] },
			{ text: 'Silencio. Solo el crujido del humo.' },
			{ text: 'El Fennekin te mira. Tiene una oreja chamuscada y polvo en el hocico. Da un paso hacia ti. Se para. Desconfía. Ha cruzado medio Kalos huyendo de un sitio lleno de luces y gritos, y tú hueles a ese sitio.' },
			{ prompt: '¿Qué haces?', choice: [
				{ text: 'Ofrecerle algo de comer.', then: [
					{ if: 'has("oranberry")', then: [
						{ take: 'oranberry' },
						{ text: 'Te agachas y le dejas una Baya Aranja en el suelo, a medio camino. Te apartas.' },
					], else: [
						{ text: 'Rebuscas en la mochila. Solo tienes medio bocadillo de la terraza de Luminalia. Lo dejas en el suelo, a medio camino. Te apartas.' },
					] },
					{ text: 'El Fennekin se acerca, olfatea, come. Y luego, sin pedir permiso, se sube a tu regazo y se hace una bola. Está ardiendo. Literalmente. Te aguantas.' },
					{ pokemon: { sp: 'fennekin', lv: 8, nature: 'modest', ability: 'blaze', happy: 120 } },
					{ set: { 'flag.b01_fennekin_unido': true } },
				] },
				{ text: 'Dejar que {riolu} se acerque.', then: [
					{ text: '{riolu} camina hasta el Fennekin despacio, sin mirarlo a los ojos. Se sienta a su lado. Su aura se enciende, azul y tranquila.' },
					{ text: 'El Fennekin lo huele. Luego apoya la cabeza en su hombro. Los dos huyeron de la misma plaza, la misma noche de luces y gritos. Quizá se reconocen.' },
					{ happy: { who: 'riolu', n: 20 } },
					{ pokemon: { sp: 'fennekin', lv: 8, nature: 'modest', ability: 'blaze', happy: 140 } },
					{ set: { 'flag.b01_fennekin_unido': true } },
				] },
				{ text: 'Dejarlo ir. Que vuelva con el profesor.', then: [
					{ text: 'No te acercas. Le señalas el camino del norte, hacia Luminalia. El Fennekin te mira largo rato.' },
					{ text: 'Luego se da la vuelta y echa a trotar. A mitad del claro se para, te mira por encima del hombro… y sigue.' },
					{ say: 'rotom', text: '¡Bzzt! Mando su ubicación a los guardabosques de Kalos. Lo llevarán al laboratorio. Has hecho lo que te ha parecido mejor para él. Eso también cuenta.' },
					{ set: { 'flag.b01_fennekin_libre': true } },
				] },
			] },
			{ quest: 'b01_s_fennekin', stage: 'volver' },
			{ say: 'rotom', text: '¡Bzzt! Habría que contárselo al **profesor Ciprés**. En Luminalia. ¡Se va a poner contentísimo!' },
			{ diary: 'Hoy encontramos al Fennekin del profesor en el bosque. Estaba rodeado de Spewpa y muy asustado, pero ya está a salvo. {riolu} fue muy valiente. Yo fui un poco valiente. ¡Bzzt! El bosque olía a chimenea.', cond: 'flag.b01_diario' },
		],

		// ---------- Pueblo Acuarela ----------
		b01_acuarela_terraza: [
			{ text: 'Te sientas en la terraza del puente. Un camarero con delantal de rayas te trae, sin preguntar, un vaso de limonada y un cuenco de agua para cada uno de tus Pokémon.' },
			{ text: '«Aquí no hay Centro Pokémon», dice. «Pero hay sombra, limonada y nadie con prisa. Para la mayoría de las cosas, es lo mismo».' },
			{ heal: 'Tu equipo descansa a la sombra de las sombrillas. Cuando os levantáis, estáis como nuevos.' },
			{ if: 'flag.b01_fennekin_unido && !flag.b01_terraza_fennekin', then: [
				{ text: 'Fennekin se queda mirando el río. Luego estornuda una chispa que cae al agua y hace «fsss». Lo hace otra vez. Y otra. Ha descubierto un juego.' },
				{ set: { 'flag.b01_terraza_fennekin': true } },
			] },
		],
		b01_pintora_1: [
			{ text: 'Una mujer joven con el pelo recogido con un pincel pinta el río sentada en el pretil del puente. No mira el río. Te mira a ti.' },
			{ say: 'pintora_acuarela', text: 'No te muevas. Bueno, muévete, pero no mucho. Tú no: tu Riolu.' },
			{ text: 'Moja el pincel. Traza tres líneas sin levantar la mano. Luego una mancha de azul.' },
			{ say: 'pintora_acuarela', text: 'Mi maestra decía que dibujar es una forma de magia: si trazas bien la línea, lo que pintas se mueve. Yo nunca le creí. Hasta hoy, quizá.' },
			{ text: 'Te enseña la acuarela. Eres tú, en el puente, con {riolu} a tus pies. Está muy bien hecho. Pero alrededor de {riolu} hay un halo azul, como una llama fría.' },
			{ say: 'pintora_acuarela', text: 'No sé por qué lo he pintado azul. No lo veo. Pero la mano me ha dicho que estaba ahí. ¿A ti te pasa? ¿Que sabes cosas antes de verlas?' },
			{ choice: [
				{ text: '«A veces. Con él.»', then: [{ happy: { who: 'riolu', n: 5 } }, { say: 'pintora_acuarela', text: 'Entonces está bien pintado.' }] },
				{ text: '«Será la luz del río.»', then: [{ say: 'pintora_acuarela', text: 'Será. La luz del río tiene la culpa de casi todo en este pueblo.' }] },
				{ text: '«Es un aura. Riolu la tiene.»', then: [{ say: 'pintora_acuarela', text: '¿Un aura? Qué palabra tan bonita para algo que no se ve. Me la quedo. La palabra, digo. El cuadro es tuyo.' }] },
			] },
			{ give: 'acuarelariolu' },
			{ set: { 'flag.b01_pintora': true } },
		],
		b01_pintora_despues: [
			{ say: 'pintora_acuarela', text: 'Ahora pinto a todo el que pasa con su Pokémon. Ninguno me sale azul. Solo el tuyo. Me tiene intrigadísima.' },
		],

		// ---------- Pueblo Boceto: la carrera de Rhyhorn ----------
		b01_campeona_1: [
			{ text: 'En la puerta de una casa con establo, una mujer con coleta y botas de montar cepilla a un Rhyhorn enorme. El Rhyhorn ronronea. No sabías que los Rhyhorn ronronearan.' },
			{ say: 'jinete_boceto', text: '¿Vienes a mirar o a montar? Si es a mirar, apártate de detrás. Este cocea.' },
			{ say: 'jinete_boceto', text: 'Fui campeona de carreras de Rhyhorn. Doce temporadas seguidas. Me retiré cuando mi peque se fue de viaje con una mochila más grande que su espalda. Ahora es quien manda en la Liga de Kalos. Y yo me aburro.' },
			{ say: 'jinete_boceto', text: '¿Tú también vas por el Circuito? Se te nota. Tienes cara de ir a todas partes a pie. Eso tiene arreglo.' },
			{ say: 'jinete_boceto', text: 'Te propongo algo: vence a mis dos alumnos en la pista. Si aguantas eso, corres conmigo. Y si corres bien, te presto un Rhyhorn. Para siempre o hasta que me lo devuelvas, que viene a ser lo mismo.' },
			{ choice: [
				{ text: '«Trato hecho.»', then: [{ say: 'jinete_boceto', text: 'Así me gusta. Sin pensarlo. Lo de pensar ya vendrá con la primera caída.' }, { quest: 'b01_s_rhyhorn', stage: 'reto' }] },
				{ text: '«¿Es peligroso?»', then: [{ say: 'jinete_boceto', text: 'Mucho. Por eso es divertido. —Se ríe—. Tranquil{o|a|e}: el Rhyhorn sabe lo que hace. Tú no, pero él sí. Ve a la pista cuando quieras.' }, { quest: 'b01_s_rhyhorn', stage: 'reto' }] },
			] },
		],
		b01_campeona_recordar: [
			{ say: 'jinete_boceto', text: 'Mis alumnos te esperan en la pista. Dos. Si les ganas a los dos, ven. Si te ganan, ven también: te curo el orgullo con un vaso de leche Mu-mu.' },
		],
		b01_campeona_carrera: [
			{ say: 'jinete_boceto', text: '¿Les ganaste a los dos? ¡Bien! Mylène va a estar una semana sin hablarme. Lo agradezco.' },
			{ say: 'jinete_boceto', text: 'Ahora lo importante. Sube. No, por ahí no. Por el lado de la oreja buena. Eso. Agárrate a la silla, no al cuerno. Al cuerno solo se agarran los novatos y los muertos.' },
			{ text: 'El Rhyhorn arranca. No es como montar a caballo. Es como montar un terremoto con buena actitud.' },
			{ set: { 'vars.b01_carrera': 0 } },
			{ prompt: 'La salida', choice: [
				{ text: 'Inclinarte hacia delante, como te dijo.', then: [{ set: { 'vars.b01_carrera': '+1' } }, { text: 'Te pegas a la silla. El Rhyhorn nota tu peso y acelera. ¡Sales con medio cuerpo de ventaja!' }] },
				{ text: 'Hablarle al Rhyhorn al oído.', then: [{ set: { 'vars.b01_carrera': '+1' } }, { text: '«Vamos, grandullón». El Rhyhorn resopla, divertido, y sale como si lo hubieran llamado por su nombre.' }] },
				{ text: 'Gritar.', then: [{ text: 'Gritas. El Rhyhorn también. Salís los dos gritando. No ganas ventaja, pero ganas en estilo.' }] },
			] },
			{ text: 'La pista gira hacia unas rocas grandes. La campeona va a tu lado, sin manos, con una brizna de hierba en la boca.' },
			{ prompt: 'La curva de las rocas', choice: [
				{ text: 'Atajar por entre las rocas.', then: [{ set: { 'vars.b01_carrera': '+1' } }, { text: 'El Rhyhorn baja la cabeza y atraviesa una roca en lugar de rodearla. ¡CRAC! Ahora entiendes lo del Paso de Rhyhorn.' }] },
				{ text: 'Abrirte y tomar la curva por fuera.', then: [{ text: 'Curva limpia, segura y lenta. La campeona te adelanta saludando con el sombrero.' }] },
			] },
			{ text: 'Última recta. El pueblo entero ha salido a mirar. Alguien toca una cacerola. La campeona te mira de reojo y sonríe.' },
			{ say: 'jinete_boceto', text: 'Muy bien, jinete. ¿Cómo quieres hacerlo?' },
			{ prompt: 'La recta final', choice: [
				{ text: 'Todo o nada. Soltar las riendas.', then: [{ set: { 'vars.b01_carrera': '+1' } }, { text: 'Sueltas las riendas. El Rhyhorn entiende el mensaje: ahora manda él. Y él quiere ganar.' }] },
				{ text: 'Ir con calma y llegar entero.', then: [{ text: 'Mantienes el ritmo. Llegas. Entero. Con dignidad. Y con el pelo hecho un nido.' }] },
				{ text: 'Mirar a la campeona y reírte.', then: [{ set: { 'vars.b01_carrera': '+1' } }, { text: 'Te ríes. Ella también. Ninguna de las dos cosas sirve para correr, pero el Rhyhorn se contagia y da un último acelerón.' }] },
			] },
			{ if: 'vars.b01_carrera >= 3', then: [
				{ text: 'Cruzáis la meta. Por un cuerno. Tu cuerno. Bueno, el de tu Rhyhorn.' },
				{ say: 'jinete_boceto', text: '¡JA! ¡Me has ganado! ¡A mí! ¡En mi pista! Hacía años que no me pasaba. La última fue… bueno. Mi peque. Antes de irse.' },
			], else: [
				{ text: 'Cruzáis la meta. Ella primero, por una cabeza. Tú, justo detrás, con el corazón en la garganta.' },
				{ say: 'jinete_boceto', text: '¡Casi! Casi, casi. Y para ser tu primera vez, «casi» es muchísimo. Mi peque tardó un verano en llegar a «casi».' },
			] },
			{ say: 'jinete_boceto', text: 'Bueno. Trato es trato. Este Rhyhorn es tuyo. Bueno, mío, pero va contigo. Se llama… no tiene nombre. Ponle el que quieras. No te va a hacer caso igual.' },
			{ set: { 'flag.mount_rhyhorn': true, 'vars.mount': 'rhyhorn' } },
			{ toast: '🦏 Montura desbloqueada: Rhyhorn' },
			{ say: 'jinete_boceto', text: 'Lo que tienes que saber: en las **rutas**, a lomos de Rhyhorn avanzas el doble y te cruzas con menos Pokémon salvajes. Y en el **Paso de Rhyhorn**, al oeste, las rocas se apartan para él. Para nadie más.' },
			{ say: 'jinete_boceto', text: 'Si un día te apetece ir a pie, que a veces apetece, lo desactivas en **Ajustes** («Usar montura»). Él no se ofende. Bueno, un poco. Se le pasa con una manzana.' },
			{ quest: 'b01_s_rhyhorn', done: true },
			{ rep: { kalos: 2 } },
			{ diary: '¡Hoy aprendimos a montar en Rhyhorn! Bueno, mi entrenador{|a|e} aprendió. Yo iba en el bolsillo, dando botes. Todo temblaba. ¡Bzzt! Creo que tengo los circuitos del revés. Pero ha sido el mejor día. Bueno, el segundo mejor.', cond: 'flag.b01_diario' },
		],
		b01_campeona_despues: [
			{ say: 'jinete_boceto', text: '¿Qué tal el Rhyhorn? ¿Come bien? ¿Te tira? Si te tira, es que le caes bien. Si no te tira, es que le caes muy bien.' },
			{ if: 'badges >= 1', then: [{ say: 'jinete_boceto', text: 'Ya llevas medallas, ¿eh? Mi peque empezó igual. Algún día os cruzaréis. No le digas que me has ganado. O sí. Dímelo a mí cuando le pongas la cara.' }] },
			{ heal: 'La campeona te sirve un vaso de leche Mu-mu y deja que tu equipo descanse en el establo. Salís como nuevos.' },
		],
		b01_boceto_pozo: [
			{ text: 'Un pozo de piedra con un cubo atado a una cuerda. Alguien ha grabado en el borde, con letra de niño: «Aquí empezó todo. Vuelve pronto».' },
			{ text: 'No sabes quién lo escribió. Pero en Boceto todo el mundo sabe quién se fue de aquí hace años y ahora sale en la tele.' },
			{ if: 'flag.mount_rhyhorn', then: [{ text: 'Tu Rhyhorn bebe del cubo con mucho ruido. Lo deja seco. Te mira como si fuera culpa tuya.' }] },
		],
	},

	npcs: {
		peluquera_novarte: { name: 'Peluquera jubilada', generic: true, look: { hair: 'bun', hairColor: '#cfd6e2', outfit: '#e98aa8', outfit2: '#ffffff', skin: 1, acc: 'glasses', mouth: 'open', eyes: '#6b4a2b' } },
		senor_balcon: { name: 'Señor del balcón', generic: true, look: { hair: 'short', hairColor: '#cfd6e2', outfit: '#8a7a5a', outfit2: '#e9e3d0', skin: 2, acc: 'glasses mustache', eyesStyle: 'sleepy', mouth: 'smile' } },
		aprendiz_brock: { name: 'Aprendiz del gimnasio', generic: true, look: { hair: 'spiky', hairColor: '#5a3a26', outfit: '#d8a85a', outfit2: '#3f8a4f', skin: 3, acc: 'bandana', mouth: 'grin' } },
		pintora_acuarela: { name: 'Pintora del puente', generic: true, look: { hair: 'bun', hairColor: '#2b2b38', outfit: '#8fb3d9', outfit2: '#f3e6c4', skin: 1, eyes: '#3f8a4f', mouth: 'smile', acc: 'freckles' } },
	},

	items: {
		acuarelariolu: { name: 'Acuarela de Riolu', pocket: 'key', art: 'acuarela_riolu', desc: 'Un cuadro pequeño pintado en el puente de Pueblo Acuarela. Tú y tu Riolu. Alrededor de Riolu, un halo azul que la pintora no sabe por qué pintó.' },
	},
};
