// Publicación 7 · Pieza A: tiendas de piedras y de MT, premios de las zonas de entrenamiento,
// y «Megas y Teras a la vista» (notas de Mario del 2026-10-10).
//
// · Johto: Centro Comercial de Trigal, 4.ª planta (piedras, Casilda Peña) y 5.ª planta (MT, «Disco Técnico»).
// · Kanto: Almacenes Azulona · sucursal exprés de Azafrán (piedras con Jade Peña; expendedora de MT de Silph).
// · Premios `p7_premio_*`: uno por zona de entrenamiento (7 MT y 4 Megapiedras). Los 11 spots llevan `prize`.
// · Megas ajenas (opcionales, con curación antes): Casilda (Sableye), Evaristo (Gyarados), Ciro (Pidgeot), Dolores (Banette).
// · Salvajes teracristalizados raros en zonas con energía filtrada (Encinar, Ruta 32, Ruta 43, Ruta 5 de Kanto, Cueva Celeste).
//
// Nada de esto depende de ramas. Los combates Mega piden la Megapulsera (el enemigo solo megaevoluciona si el jugador ya puede).

const MEGA = 'has("megaring")';
const CASILDA_RETO = 'badges >= 7 && ' + MEGA + ' && !beat("p7_casilda_duelo")';
const FOX = '(owns("delphox") || owns("braixen") || owns("fennekin"))';
const GAL = '(owns("gallade") || owns("kirlia") || owns("ralts"))';

export default {
	// =====================================================================
	// PERSONAJES
	// =====================================================================
	npcs: {
		// Con nombre (3+ momentos cada uno; ver la respuesta de la pieza)
		p7_casilda: { name: 'Casilda Peña', title: 'Gemóloga · Peña e Hija', look: { hair: 'bun', hairColor: '#b9bcc6', eyes: '#3a5a4a', outfit: '#2f5a4a', outfit2: '#d8c49a', skin: 2, eyesStyle: 'sharp', mouth: 'flat', acc: 'glasses' } },
		p7_jade: { name: 'Jade Peña', title: 'Peña e Hija · sucursal de Azafrán', look: { hair: 'ponytail', hairColor: '#2b2b38', streak: '#4fb58a', eyes: '#3a5a4a', outfit: '#e9e3d0', outfit2: '#2f5a4a', skin: 2, eyesStyle: 'happy', mouth: 'grin' } },
		p7_evaristo: { name: 'Evaristo', title: 'Pescador del Lago de la Furia', look: { hair: 'cap', hairColor: '#d8d8d0', eyes: '#3b5a7a', outfit: '#5a6a4a', outfit2: '#c4a43a', skin: 3, eyesStyle: 'sleepy', mouth: 'flat', acc: 'beard' } },
		p7_ciro: { name: 'Ciro', title: 'Repartidor de los Almacenes Azulona', look: { hair: 'spiky', hairColor: '#8a4a2a', eyes: '#5a3a26', outfit: '#c4473a', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'happy', mouth: 'open', acc: 'goggles' } },
		p7_dolores: { name: 'Dolores', title: 'Médium de Lavanda', look: { hair: 'braids', hairColor: '#6a6a7a', eyes: '#6a4a8a', outfit: '#4a3a6a', outfit2: '#b08ad8', skin: 1, eyesStyle: 'sleepy', mouth: 'smile', acc: 'flower' } },
		// Genéricos
		p7_dj: { name: 'Dependiente de Disco Técnico', generic: true, look: { hair: 'curly', hairColor: '#3a2a1e', eyes: '#3a2a1e', outfit: '#2b2b38', outfit2: '#e9c43a', skin: 4, eyesStyle: 'happy', mouth: 'grin', acc: 'headphones' } },
		// Encargados de las zonas de entrenamiento que solo tenían `coach`: misma semilla que su spot, misma cara.
		p7_c_muro: { name: 'Monitora del Muro', generic: true, look: { seed: 'Muro de Escalada' } },
		p7_c_playa: { name: 'Karateka de la playa', generic: true, look: { seed: 'Playa de la Torre' } },
		p7_c_huerto: { name: 'Cuidadora del huerto', generic: true, look: { seed: 'Huerto de Bonguris' } },
		p7_c_azotea: { name: 'Encargado de la azotea', generic: true, look: { seed: 'Azotea' } },
		p7_c_patio_iris: { name: 'Sabio del patio', generic: true, look: { seed: 'Entrenar con los médiums y los sabios' } },
		p7_c_bellsprout: { name: 'Aprendiz de sabio', generic: true, look: { seed: 'Entrenar con los aprendices' } },
		p7_c_muelle: { name: 'Contramaestre del muelle', generic: true, look: { seed: 'Muelle de entrenamiento' } },
		p7_c_capataz: { name: 'Capataz de turno', generic: true, look: { seed: 'El campamento del turno de descanso' } },
		p7_c_cabo: { name: 'Socorrista del Cabo', generic: true, look: { seed: 'El Cabo' } },
	},

	// =====================================================================
	// LUGAR NUEVO (Kanto): sucursal de los Almacenes Azulona en Azafrán
	// =====================================================================
	locations: {
		p7_almacenes_azafran: {
			name: 'Almacenes Azulona · sucursal exprés', parent: 'azafran', kind: 'building',
			bg: { type: 'indoor', wall: '#e9e3d0', floor: '#3b7ac4' },
			desc: 'Un local de cuarenta metros en una esquina de Azafrán, con un rótulo que promete mucho: «**Almacenes Azulona** · todo lo de las seis plantas, en una». No es verdad, pero casi: hay un **mostrador de piedras** con una balanza de latón, una **máquina expendedora** de Silph del tamaño de un armario y, entre los dos, cajas a medio abrir con etiquetas de Ciudad Azulona.\n\nPor la puerta de atrás entra y sale un repartidor a toda prisa. En el techo, sobre una percha, hay plumas grandes de color crema.',
			mapNote: 'Piedras evolutivas · MT (expendedora)',
			spots: [
				{ label: 'Mostrador de piedras', sub: 'Peña e Hija · piedras e importación', icon: '💎', action: { shop: 'p7_piedras_azafran' } },
				{ label: 'Expendedora de MT', sub: 'Silph S.A. · «introduzca importe exacto»', icon: '💿', action: { shop: 'p7_mt_azafran' } },
				{ label: 'Jade', sub: 'Pesa piedras y habla al mismo tiempo', icon: '💬', new: '!flag.p7_jade_1 || (has("p7_sobre_casilda") && !flag.p7_jade_nota)', talk: [
					{ cond: '!flag.p7_jade_1 && has("p7_sobre_casilda") && !flag.p7_jade_nota', script: 'p7_jade_intro_sobre' },
					{ cond: '!flag.p7_jade_1', script: 'p7_jade_intro' },
					{ cond: 'has("p7_sobre_casilda") && !flag.p7_jade_nota', script: 'p7_jade_sobre' },
					{ script: 'p7_jade_generico' },
				] },
				{ label: 'El cartel de la expendedora', sub: 'Letra pequeña. Muy pequeña', icon: '🪧', talk: [{ script: 'p7_expendedora_cartel' }] },
				{ label: 'Ciro, el repartidor', sub: 'Mira el reloj. Mira la percha. Mira el reloj', icon: '📦', cond: MEGA, new: '!beat("p7_ciro_duelo") && !flag.p7_ciro_1', talk: [
					{ cond: '!beat("p7_ciro_duelo")', script: 'p7_ciro' },
					{ script: 'p7_ciro_despues' },
				] },
			],
		},
	},

	// =====================================================================
	// SPOTS EN LUGARES DEL B4
	// =====================================================================
	extraSpots: {
		azafran: [
			{ label: 'Almacenes Azulona', sub: 'Sucursal exprés: piedras evolutivas y MT', icon: '🏬', new: '!visited("p7_almacenes_azafran")', action: { go: 'p7_almacenes_azafran' } },
		],
		lavanda: [
			{ label: 'Una médium que cose en un banco', sub: 'A su lado, un muñeco de trapo la mira coser', icon: '🧵', cond: 'flag.b04_lavanda_llegada && ' + MEGA, new: '!beat("p7_dolores_duelo") && !flag.p7_dolores_1', talk: [
				{ cond: '!beat("p7_dolores_duelo")', script: 'p7_dolores' },
				{ script: 'p7_dolores_despues' },
			] },
		],
	},

	// =====================================================================
	// PARCHES A LUGARES DE BLOQUES ANTERIORES (y encuentros Tera)
	// =====================================================================
	patches: {
		cc_trigal: {
			mapNote: 'Tiendas · Piedras (4.ª planta) · MT (5.ª planta) · Azotea: entrenamiento (nivel 38)',
			spots: [
				{ label: 'Peña e Hija · Piedras', sub: '4.ª planta. Piedras evolutivas, pesadas una a una', icon: '💎', action: { shop: 'p7_piedras_trigal' } },
				{ label: 'Doña Casilda', sub: 'Detrás de una balanza de latón, con lupa', icon: '🔍',
					new: '!flag.p7_casilda_1 || (flag.b03_fin && !flag.p7_recado_dado) || (flag.p7_jade_nota && !flag.p7_recado_hecho) || (' + CASILDA_RETO + ' && !flag.p7_casilda_reto_visto)',
					talk: [
						{ cond: '!flag.p7_casilda_1 && flag.b03_fin', script: 'p7_casilda_intro_recado' },
						{ cond: '!flag.p7_casilda_1', script: 'p7_casilda_intro' },
						{ cond: 'flag.b03_fin && !flag.p7_recado_dado', script: 'p7_casilda_recado' },
						{ cond: 'flag.p7_jade_nota && !flag.p7_recado_hecho', script: 'p7_casilda_nota' },
						{ cond: CASILDA_RETO, script: 'p7_casilda_reto' },
						{ script: 'p7_casilda_generico' },
					] },
				{ label: 'Disco Técnico · MT', sub: '5.ª planta. Máquinas Técnicas en fundas de vinilo', icon: '💿', action: { shop: 'p7_mt_trigal' } },
				{ label: 'El dependiente de Disco Técnico', sub: 'Lleva auriculares. No hay música puesta', icon: '🎧', new: '!flag.p7_dj_1', talk: [
					{ cond: '!flag.p7_dj_1', script: 'p7_dj_intro' },
					{ script: 'p7_dj_generico' },
				] },
				{ label: 'Un repartidor sin aliento', sub: '4.ª planta. Trae una caja de Azulona y plumas en el pelo', icon: '📦', cond: 'beat("p7_ciro_duelo") && !flag.p7_ciro_trigal', new: 'true', talk: [{ script: 'p7_ciro_trigal' }] },
			],
		},
		lago_furia: {
			spots: [
				{ label: 'Un pescador viejo en la orilla', sub: 'No mira la caña. Mira el agua', icon: '🎣', cond: 'flag.b03_fin && ' + MEGA, new: '!beat("p7_evaristo_duelo") && !flag.p7_evaristo_1', talk: [
					{ cond: '!beat("p7_evaristo_duelo")', script: 'p7_evaristo' },
					{ script: 'p7_evaristo_despues' },
				] },
			],
		},
		// ----- Salvajes teracristalizados (raros): energía que se filtra cerca de los nodos y de las Fisuras -----
		encinar: {
			rumors: [{ cond: 'flag.b03_fin', text: 'Los carboneros dicen que en lo más cerrado del Encinar hay un árbol que camina y que de noche brilla por dentro, como un farol de cristal verde. Dicen también que no es un árbol.' }],
			route: { encounters: { forest: [{ sp: 'trevenant', lv: [44, 46], w: 3, gimmick: 'tera', tera: 'Grass', cond: 'flag.b03_fin' }] } },
		},
		ruta32: {
			rumors: [{ cond: 'flag.b03_fin', text: 'En las charcas de la Ruta 32, del lado de las Ruinas, hay un Quagsire al que le ha salido una corona de cristal rosa. Él no se ha dado cuenta. Sigue con la boca abierta.' }],
			route: { encounters: { grass: [{ sp: 'quagsire', lv: [44, 46], w: 3, gimmick: 'tera', tera: 'Fairy', cond: 'flag.b03_fin' }] } },
		},
		ruta43: {
			rumors: [{ cond: 'flag.b03_fin', text: 'Desde que se apagó la boya del lago, por la Ruta 43 anda un Girafarig que brilla por los dos lados. La cabeza de atrás brilla más. Dicen que es la que manda.' }],
			route: { encounters: { grass: [{ sp: 'girafarig', lv: [45, 47], w: 3, gimmick: 'tera', tera: 'Psychic', cond: 'flag.b03_fin' }] } },
		},
		k_ruta5: {
			rumors: [{ text: 'En la Ruta 5 hay un Primeape que ya no grita. Se queda quieto, traslúcido, con una corona de cristal morado, mirando a la gente como si se acordara de todas las veces que perdió.' }],
			route: { encounters: { grass: [{ sp: 'primeape', lv: [47, 49], w: 3, gimmick: 'tera', tera: 'Ghost' }] } },
		},
		cueva_celeste: {
			route: { encounters: { water: [{ sp: 'golduck', lv: [52, 54], w: 4, gimmick: 'tera', tera: 'Psychic' }] } },
		},
	},

	// =====================================================================
	// MISIÓN PEQUEÑA (el recado entre las dos tiendas de piedras)
	// =====================================================================
	quests: {
		p7_s_recado: { name: 'Peso neto', type: 'side', est: 10, stages: {
			llevar: 'Doña Casilda, la de las piedras del **Centro Comercial de Trigal**, te dio un sobre para su hija **Jade**, que lleva la sucursal de **Ciudad Azafrán** (Kanto). Sin prisa: «las piedras no caducan».',
			volver: 'Jade leyó el sobre y te dio una nota de vuelta. Llévasela a **Doña Casilda**, en la 4.ª planta del **Centro Comercial de Trigal**.',
			hecha: 'Llevaste el sobre a Azafrán y la respuesta a Trigal. Madre e hija siguen sin hablarse por teléfono. Se escriben. Dicen que así pesa más.',
		} },
	},

	// =====================================================================
	// ENTRENADORES (exhibiciones con Megaevolución; todas opcionales)
	// =====================================================================
	trainers: {
		p7_casilda_duelo: { name: 'Casilda', cls: 'Gemóloga', npc: 'p7_casilda', ai: 3, iv: 25, reward: 2880, bg: 'indoor', terrain: 'city', gimmick: 'mega', ace: 'sableye',
			team: [
				{ sp: 'carbink', lv: 46, moves: ['powergem', 'dazzlinggleam', 'reflect', 'ancientpower'], ability: 'clearbody', nature: 'calm' },
				{ sp: 'probopass', lv: 47, moves: ['powergem', 'flashcannon', 'earthpower', 'thunderwave'], ability: 'magnetpull', item: 'hardstone', nature: 'modest' },
				{ sp: 'sableye', lv: 48, moves: ['shadowclaw', 'powergem', 'foulplay', 'fakeout'], ability: 'keeneye', item: 'sablenite', nature: 'impish' },
			],
			intro: 'A ojo: tu equipo, veintidós quilates. Tasador, sal. Y no te comas nada hasta que yo diga.',
			win: 'Veinticuatro. Me equivoqué por dos quilates. Hacía once años que no me equivocaba.',
			lose: 'Veintidós, lo dicho. Vuelve cuando peses más. Yo no me muevo: la balanza tampoco.' },
		p7_evaristo_duelo: { name: 'Evaristo', cls: 'Pescador', npc: 'p7_evaristo', ai: 3, iv: 25, reward: 3000, bg: 'coast', terrain: 'water', gimmick: 'mega', ace: 'gyarados',
			team: [
				{ sp: 'seaking', lv: 47, moves: ['waterfall', 'megahorn', 'drillrun', 'aquaring'], ability: 'swiftswim', nature: 'adamant' },
				{ sp: 'poliwrath', lv: 48, moves: ['waterfall', 'brickbreak', 'icepunch', 'earthquake'], ability: 'waterabsorb', item: 'sitrusberry', nature: 'adamant' },
				{ sp: 'gyarados', lv: 50, moves: ['waterfall', 'crunch', 'icefang', 'earthquake'], ability: 'intimidate', item: 'gyaradosite', nature: 'adamant' },
			],
			intro: 'Treinta años esperando a que pique algo que valga la pena. Hoy has picado tú. Paciencia, arriba.',
			win: 'Pues sí que valías la pena. Paciencia, abajo. Ya está, ya está. Buen pez.',
			lose: 'Te me has escapado del anzuelo. No pasa nada. Yo sigo aquí mañana. Y pasado.' },
		p7_ciro_duelo: { name: 'Ciro', cls: 'Repartidor', npc: 'p7_ciro', ai: 3, iv: 25, reward: 3000, bg: 'city', terrain: 'city', gimmick: 'mega', ace: 'pidgeot',
			team: [
				{ sp: 'dodrio', lv: 48, moves: ['drillpeck', 'triattack', 'thrash', 'knockoff'], ability: 'earlybird', nature: 'jolly' },
				{ sp: 'fearow', lv: 48, moves: ['drillpeck', 'drillrun', 'uturn', 'facade'], ability: 'keeneye', item: 'sharpbeak', nature: 'jolly' },
				{ sp: 'pidgeot', lv: 50, moves: ['hurricane', 'heatwave', 'quickattack', 'uturn'], ability: 'keeneye', item: 'pidgeotite', nature: 'timid' },
			],
			intro: '¡Tengo once minutos! ¡Diez! ¡Albarán, plan de vuelo corto! ¡Entrega urgente a domicilio: una derrota, a tu nombre!',
			win: '¡Destinatario ausente! ¡Devuelto al remitente! …El remitente soy yo. Vaya.',
			lose: '¡Entregado! Firma aquí. Bueno, no hace falta. ¡Me voy, me voy, me voy!' },
		p7_dolores_duelo: { name: 'Dolores', cls: 'Médium', npc: 'p7_dolores', ai: 3, iv: 25, reward: 3180, bg: 'town', terrain: 'city', gimmick: 'mega', ace: 'banette',
			team: [
				{ sp: 'mismagius', lv: 51, moves: ['shadowball', 'dazzlinggleam', 'mysticalfire', 'confuseray'], ability: 'levitate', nature: 'timid' },
				{ sp: 'dusclops', lv: 51, moves: ['shadowpunch', 'icepunch', 'willowisp', 'nightshade'], ability: 'pressure', item: 'spelltag', nature: 'relaxed' },
				{ sp: 'banette', lv: 53, moves: ['shadowclaw', 'suckerpunch', 'gunkshot', 'screech'], ability: 'insomnia', item: 'banettite', nature: 'adamant' },
			],
			intro: 'Remiendo, deja la aguja. Tenemos visita. Sé amable. Bueno: sé tú, pero amable.',
			win: 'Mira, Remiendo: se te ha abierto la cremallera y no ha pasado nada malo. ¿Ves? No siempre pasa.',
			lose: 'Ya, ya. No te rías tanto, Remiendo, que se te ven las costuras.' },
	},

	// =====================================================================
	// OBJETOS: MT nuevas (tiendas y premios) y las dos notas del recado
	// =====================================================================
	items: {
		p7_sobre_casilda: { name: 'Sobre de Doña Casilda', pocket: 'key', desc: 'Un sobre de papel grueso, cerrado con una gota de lacre verde. Pesa más de lo que debería. Para Jade Peña, en Azafrán.',
			read: '*(Letra pequeña y recta, de alguien que mide los renglones con regla.)*\n\nHija:\n\nCome.\n\nNo vendas la Piedra Día por debajo de tres mil, que te conozco. No fíes. No regales bolsitas. La balanza se limpia con gamuza, no con la manga.\n\nTasador te manda un rubí. Se lo comió por el camino. La intención es lo que cuenta: va la intención en el sobre.\n\nAquí todo igual. La 4.ª planta sigue oliendo a fideos por culpa de la 3.ª. El del Miltank hinchable me saluda todos los días y todos los días le digo que no.\n\nNo hace falta que contestes.\n\n— Tu madre\n\nP. D.: Contesta.' },
		p7_nota_jade: { name: 'Nota de Jade', pocket: 'key', desc: 'Una hoja de albarán de los Almacenes Azulona, escrita por detrás a toda velocidad. Para Doña Casilda, en Trigal.',
			read: '*(Letra grande, inclinada, con tachones. Escrita de pie.)*\n\nMamá:\n\nComo. Tres veces al día. A veces cuatro.\n\nVendo la Piedra Día a tres mil. No fío. Lo de las bolsitas no te lo puedo prometer: aquí la gente se las espera.\n\nLa sucursal da números negros desde marzo. Eso no lo vas a leer porque en esa frase no hay ninguna piedra, así que te lo repito: ~~los números~~ el **ónice** de la sucursal es negro desde marzo. Negro del bueno.\n\nDile a Tasador que el rubí era de cristal. Que no se preocupe. Que la intención me llegó entera.\n\nSube un día. El tren flota. No pesa nada. Te va a dar un coraje tremendo.\n\n— J.\n\nP. D.: Te mando la nota con alguien de fiar. A ojo, veinticuatro quilates.' },
		// MT de la tienda de Trigal
		p7_mt_proteccion: { name: 'MT Protección', pocket: 'machines', tm: 'protect', desc: 'Frena todos los ataques, pero puede fallar si se usa repetidamente.' },
		p7_mt_sustituto: { name: 'MT Sustituto', pocket: 'machines', tm: 'substitute', desc: 'Utiliza parte de los PS propios para crear un sustituto que actúa como señuelo.' },
		p7_mt_danza_lluvia: { name: 'MT Danza Lluvia', pocket: 'machines', tm: 'raindance', desc: 'Genera una fuerte lluvia que refuerza los movimientos de tipo Agua durante cinco turnos y debilita los de tipo Fuego.' },
		p7_mt_dia_soleado: { name: 'MT Día Soleado', pocket: 'machines', tm: 'sunnyday', desc: 'Hace que se intensifique el efecto del sol durante cinco turnos, lo que potencia los movimientos de tipo Fuego y debilita los de tipo Agua.' },
		p7_mt_onda_trueno: { name: 'MT Onda Trueno', pocket: 'machines', tm: 'thunderwave', desc: 'Una ligera descarga que paraliza al objetivo si lo alcanza.' },
		p7_mt_toxico: { name: 'MT Tóxico', pocket: 'machines', tm: 'toxic', desc: 'Envenena gravemente al objetivo y causa un daño mayor en cada turno.' },
		p7_mt_fuego_fatuo: { name: 'MT Fuego Fatuo', pocket: 'machines', tm: 'willowisp', desc: 'Siniestra llama morada que produce quemaduras.' },
		p7_mt_pantalla_de_luz: { name: 'MT Pantalla de Luz', pocket: 'machines', tm: 'lightscreen', desc: 'Pared de luz que reduce durante cinco turnos el daño producido por los ataques especiales.' },
		p7_mt_reflejo: { name: 'MT Reflejo', pocket: 'machines', tm: 'reflect', desc: 'Pared de luz que reduce durante cinco turnos el daño producido por los ataques físicos.' },
		p7_mt_lanzallamas: { name: 'MT Lanzallamas', pocket: 'machines', tm: 'flamethrower', desc: 'Ataca con una gran ráfaga de fuego que puede causar quemaduras.' },
		p7_mt_rayo: { name: 'MT Rayo', pocket: 'machines', tm: 'thunderbolt', desc: 'Potente ataque eléctrico que puede paralizar al objetivo.' },
		p7_mt_energibola: { name: 'MT Energibola', pocket: 'machines', tm: 'energyball', desc: 'Aúna fuerzas de la naturaleza y libera su ataque. Puede disminuir la Defensa Especial del objetivo.' },
		p7_mt_bomba_lodo: { name: 'MT Bomba Lodo', pocket: 'machines', tm: 'sludgebomb', desc: 'Arroja residuos al objetivo. Puede llegar a envenenar.' },
		p7_mt_gigadrenado: { name: 'MT Gigadrenado', pocket: 'machines', tm: 'gigadrain', desc: 'Un ataque que absorbe nutrientes. Quien lo usa recupera la mitad de los PS del daño que produce.' },
		p7_mt_puno_hielo: { name: 'MT Puño Hielo', pocket: 'machines', tm: 'icepunch', desc: 'Puñetazo helado que puede llegar a congelar.' },
		p7_mt_puno_trueno: { name: 'MT Puño Trueno', pocket: 'machines', tm: 'thunderpunch', desc: 'Puñetazo eléctrico que puede paralizar al adversario.' },
		p7_mt_puno_fuego: { name: 'MT Puño Fuego', pocket: 'machines', tm: 'firepunch', desc: 'Puñetazo ardiente que puede causar quemaduras.' },
		p7_mt_demolicion: { name: 'MT Demolición', pocket: 'machines', tm: 'brickbreak', desc: 'Potente ataque que también es capaz de destruir barreras como Pantalla de Luz y Reflejo.' },
		p7_mt_excavar: { name: 'MT Excavar', pocket: 'machines', tm: 'dig', desc: 'El usuario cava durante el primer turno y ataca en el segundo.' },
		p7_mt_avalancha: { name: 'MT Avalancha', pocket: 'machines', tm: 'rockslide', desc: 'Lanza grandes pedruscos. Puede amedrentar al objetivo.' },
		p7_mt_brillo_magico: { name: 'MT Brillo Mágico', pocket: 'machines', tm: 'dazzlinggleam', desc: 'Inflige daño a los oponentes con una potente luz.' },
		p7_mt_cascada: { name: 'MT Cascada', pocket: 'machines', tm: 'waterfall', desc: 'Embiste con un gran impulso que puede llegar a amedrentar.' },
		p7_mt_garra_dragon: { name: 'MT Garra Dragón', pocket: 'machines', tm: 'dragonclaw', desc: 'Araña al objetivo con garras afiladas.' },
		p7_mt_cabeza_de_hierro: { name: 'MT Cabeza de Hierro', pocket: 'machines', tm: 'ironhead', desc: 'Ataca con su dura cabeza de hierro. Puede hacer que el objetivo se amedrente.' },
		// MT de la expendedora de Azafrán
		p7_mt_psicocarga: { name: 'MT Psicocarga', pocket: 'machines', tm: 'psyshock', desc: 'Crea una onda psíquica que causa daño físico al objetivo.' },
		p7_mt_cabezazo_zen: { name: 'MT Cabezazo Zen', pocket: 'machines', tm: 'zenheadbutt', desc: 'Concentra su energía psíquica en la cabeza para golpear. Puede hacer que el objetivo se amedrente.' },
		p7_mt_joya_de_luz: { name: 'MT Joya de Luz', pocket: 'machines', tm: 'powergem', desc: 'Ataca con un rayo de luz que centellea como si lo formaran miles de joyas.' },
		p7_mt_tajo_aereo: { name: 'MT Tajo Aéreo', pocket: 'machines', tm: 'airslash', desc: 'Ataca con un viento afilado que incluso corta el aire. También puede amedrentar al objetivo.' },
		p7_mt_puya_nociva: { name: 'MT Puya Nociva', pocket: 'machines', tm: 'poisonjab', desc: 'Pincha al objetivo con un tentáculo o brazo envenenado. Puede llegar a envenenar al objetivo.' },
		p7_mt_bomba_germen: { name: 'MT Bomba Germen', pocket: 'machines', tm: 'seedbomb', desc: 'Lanza al objetivo una descarga de semillas explosivas desde arriba.' },
		p7_mt_tierra_viva: { name: 'MT Tierra Viva', pocket: 'machines', tm: 'earthpower', desc: 'La tierra a los pies del objetivo erupciona violentamente. Puede disminuir la Defensa Especial del objetivo.' },
		p7_mt_juego_sucio: { name: 'MT Juego Sucio', pocket: 'machines', tm: 'foulplay', desc: 'El usuario emplea la fuerza del objetivo para atacarlo. Cuanto mayor es el Ataque del objetivo, más daño provoca.' },
		p7_mt_carantona: { name: 'MT Carantoña', pocket: 'machines', tm: 'playrough', desc: 'El Pokémon que lo usa le hace cucamonas al objetivo y lo ataca. Puede disminuir el Ataque del objetivo.' },
		p7_mt_terremoto: { name: 'MT Terremoto', pocket: 'machines', tm: 'earthquake', desc: 'Un terremoto que afecta a todos los Pokémon que estén a su alrededor.' },
		p7_mt_corpulencia: { name: 'MT Corpulencia', pocket: 'machines', tm: 'bulkup', desc: 'Robustece el cuerpo para subir el Ataque y la Defensa.' },
		p7_mt_danza_espada: { name: 'MT Danza Espada', pocket: 'machines', tm: 'swordsdance', desc: 'Baile frenético que aumenta mucho el Ataque.' },
		p7_mt_maquinacion: { name: 'MT Maquinación', pocket: 'machines', tm: 'nastyplot', desc: 'Estimula su cerebro pensando en cosas malas. Aumenta mucho el Ataque Especial.' },
		p7_mt_danza_dragon: { name: 'MT Danza Dragón', pocket: 'machines', tm: 'dragondance', desc: 'Danza mística que sube el Ataque y la Velocidad.' },
		p7_mt_trueno: { name: 'MT Trueno', pocket: 'machines', tm: 'thunder', desc: 'Un poderoso rayo que daña al objetivo y puede paralizarlo.' },
		p7_mt_ventisca: { name: 'MT Ventisca', pocket: 'machines', tm: 'blizzard', desc: 'Tormenta de hielo que puede llegar a congelar.' },
		p7_mt_llamarada: { name: 'MT Llamarada', pocket: 'machines', tm: 'fireblast', desc: 'Llama intensa que chamusca y puede causar quemaduras.' },
		p7_mt_hidrobomba: { name: 'MT Hidrobomba', pocket: 'machines', tm: 'hydropump', desc: 'Lanza una gran masa de agua a presión para atacar.' },
		p7_mt_onda_certera: { name: 'MT Onda Certera', pocket: 'machines', tm: 'focusblast', desc: 'Agudiza la concentración mental y libera su poder. Puede disminuir la Defensa Especial del objetivo.' },
		p7_mt_hiperrayo: { name: 'MT Hiperrayo', pocket: 'machines', tm: 'hyperbeam', desc: 'Es eficaz, pero el atacante deberá descansar en el siguiente turno.' },
		// MT de premio (no se venden)
		p7_mt_golpe_bajo: { name: 'MT Golpe Bajo', pocket: 'machines', tm: 'suckerpunch', desc: 'Permite atacar con prioridad. Falla si el objetivo no está preparando ningún ataque.' },
		p7_mt_roca_afilada: { name: 'MT Roca Afilada', pocket: 'machines', tm: 'stoneedge', desc: 'Clava piedras muy afiladas al objetivo. Suele ser crítico.' },
		p7_mt_esfera_aural: { name: 'MT Esfera Aural', pocket: 'machines', tm: 'aurasphere', desc: 'Libera, desde su interior, una inmensa descarga de aura. Es infalible.' },
		p7_mt_chupavidas: { name: 'MT Chupavidas', pocket: 'machines', tm: 'leechlife', desc: 'Restaura al usuario la mitad del daño causado al objetivo.' },
		p7_mt_vozarron: { name: 'MT Vozarrón', pocket: 'machines', tm: 'hypervoice', desc: 'Grito desgarrador que inflige daño al objetivo.' },
		p7_mt_paz_mental: { name: 'MT Paz Mental', pocket: 'machines', tm: 'calmmind', desc: 'Aumenta la concentración y calma el espíritu para subir el Ataque Especial y la Defensa Especial.' },
		p7_mt_rayo_hielo: { name: 'MT Rayo Hielo', pocket: 'machines', tm: 'icebeam', desc: 'Rayo de hielo que puede llegar a congelar.' },
		p7_mt_surf: { name: 'MT Surf', pocket: 'machines', tm: 'surf', desc: 'Inunda el terreno de combate con una ola gigante.' },
	},

	// =====================================================================
	// TIENDAS
	// =====================================================================
	shops: {
		// Johto · Centro Comercial de Trigal, 4.ª planta
		p7_piedras_trigal: { name: 'Peña e Hija · Piedras (Trigal)', items: [
			'firestone', 'waterstone', 'thunderstone', 'leafstone', 'moonstone', 'sunstone', 'shinystone', 'duskstone', 'dawnstone', 'icestone',
			'ovalstone', { id: 'blackaugurite', price: 4500 }, 'razorclaw', 'linkingcord',
		] },
		// Johto · Centro Comercial de Trigal, 5.ª planta
		p7_mt_trigal: { name: 'Disco Técnico · MT (Trigal)', items: [
			{ id: 'p7_mt_proteccion', price: 4500 }, { id: 'p7_mt_sustituto', price: 4500 }, { id: 'p7_mt_danza_lluvia', price: 4500 }, { id: 'p7_mt_dia_soleado', price: 4500 },
			{ id: 'p7_mt_onda_trueno', price: 4500 }, { id: 'p7_mt_toxico', price: 4500 }, { id: 'p7_mt_fuego_fatuo', price: 4500 }, { id: 'p7_mt_pantalla_de_luz', price: 4500 },
			{ id: 'p7_mt_reflejo', price: 4500 }, { id: 'p7_mt_lanzallamas', price: 15000 }, { id: 'p7_mt_rayo', price: 15000 }, { id: 'p7_mt_energibola', price: 15000 },
			{ id: 'p7_mt_bomba_lodo', price: 15000 }, { id: 'p7_mt_gigadrenado', price: 10000 }, { id: 'p7_mt_puno_hielo', price: 10000 }, { id: 'p7_mt_puno_trueno', price: 10000 },
			{ id: 'p7_mt_puno_fuego', price: 10000 }, { id: 'p7_mt_demolicion', price: 10000 }, { id: 'p7_mt_excavar', price: 10000 }, { id: 'p7_mt_avalancha', price: 10000 },
			{ id: 'p7_mt_brillo_magico', price: 10000 }, { id: 'p7_mt_cascada', price: 10000 }, { id: 'p7_mt_garra_dragon', price: 10000 }, { id: 'p7_mt_cabeza_de_hierro', price: 10000 },
		] },
		// Kanto · Almacenes Azulona, sucursal de Azafrán
		p7_piedras_azafran: { name: 'Peña e Hija · Piedras e importación (Azafrán)', items: [
			'firestone', 'waterstone', 'thunderstone', 'leafstone', 'moonstone', 'sunstone', 'shinystone', 'duskstone', 'dawnstone', 'icestone',
			'linkingcord', 'everstone', 'razorfang',
			{ id: 'sweetapple', cond: 'badges >= 8' }, { id: 'tartapple', cond: 'badges >= 8' }, { id: 'crackedpot', cond: 'badges >= 8' },
			{ id: 'strawberrysweet', cond: 'badges >= 8' }, { id: 'galaricacuff', cond: 'badges >= 8' }, { id: 'galaricawreath', cond: 'badges >= 8' },
		] },
		p7_mt_azafran: { name: 'Expendedora de MT de Silph (Azafrán)', items: [
			{ id: 'p7_mt_psicocarga', price: 10000 }, { id: 'p7_mt_cabezazo_zen', price: 10000 }, { id: 'p7_mt_joya_de_luz', price: 10000 }, { id: 'p7_mt_tajo_aereo', price: 10000 },
			{ id: 'p7_mt_puya_nociva', price: 10000 }, { id: 'p7_mt_bomba_germen', price: 10000 }, { id: 'p7_mt_tierra_viva', price: 15000 }, { id: 'p7_mt_juego_sucio', price: 15000 },
			{ id: 'p7_mt_carantona', price: 15000 }, { id: 'p7_mt_terremoto', price: 20000 }, { id: 'p7_mt_corpulencia', price: 24000, cond: 'badges >= 8' }, { id: 'p7_mt_danza_espada', price: 24000, cond: 'badges >= 8' },
			{ id: 'p7_mt_maquinacion', price: 24000, cond: 'badges >= 8' }, { id: 'p7_mt_danza_dragon', price: 24000, cond: 'badges >= 8' }, { id: 'p7_mt_trueno', price: 24000, cond: 'badges >= 8' }, { id: 'p7_mt_ventisca', price: 24000, cond: 'badges >= 8' },
			{ id: 'p7_mt_llamarada', price: 24000, cond: 'badges >= 8' }, { id: 'p7_mt_hidrobomba', price: 24000, cond: 'badges >= 8' }, { id: 'p7_mt_onda_certera', price: 24000, cond: 'badges >= 8' }, { id: 'p7_mt_hiperrayo', price: 30000, cond: 'badges >= 8' },
		] },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// -----------------------------------------------------------------
		// TRIGAL · Doña Casilda (piedras)
		// -----------------------------------------------------------------
		p7_casilda_intro: [
			{ set: { 'flag.p7_casilda_1': true } },
			{ text: 'En la 4.ª planta, entre una tienda de maletas y otra de fundas para Pokédex, hay un mostrador de madera oscura con una balanza de latón, una lupa con mango de hueso y un rótulo pintado a mano: «**Peña e Hija · Piedras**». La palabra «Hija» está repintada encima de otra más corta.' },
			{ text: 'Detrás, una señora de moño gris pesa una Piedra Trueno. La mira. La vuelve a pesar. Luego te mira a ti con la misma cara.' },
			{ say: 'p7_casilda', text: 'A ojo: entrenador{|a|e}, de fuera, con prisa. Ciento sesenta gramos de prisa. Aquí no se atiende con prisa. Aquí se pesa.' },
			{ say: 'p7_casilda', text: 'Casilda Peña. Cuarenta años tasando piedras. Fuego, Agua, Trueno, Hoja, Lunar, Solar, Día, Noche, Alba y Hielo. Todas a tres mil. Si alguien te pide más, te roba. Si te pide menos, es de vidrio.' },
			{ say: 'p7_casilda', text: 'También tengo Cordón Unión, Mineral Negro y alguna cosa que no es piedra pero se le parece. Lo que no tengo es rebajas. Las piedras no caducan.' },
			{ text: 'Algo se mueve debajo del mostrador. Dos ojos facetados, como diamantes mal cortados, asoman un segundo, miran tu mochila con hambre y se esconden.' },
			{ say: 'p7_casilda', text: 'Ese es Tasador. Mi Sableye. Se come lo defectuoso. No toques el mostrador con anillos puestos.' },
		],
		// Presentación + encargo en una sola visita (aparte, por lo mismo que Jade).
		p7_casilda_intro_recado: [
			{ call: 'p7_casilda_intro' },
			{ call: 'p7_casilda_recado' },
		],
		p7_casilda_recado: [
			{ set: { 'flag.p7_recado_dado': true } },
			{ say: 'p7_casilda', text: 'Una cosa. Tienes cara de ir lejos, y dicen que la Gira sigue hacia Kanto. Mi hija Jade lleva la sucursal de Ciudad Azafrán, en Kanto. Si un día pasas por allí, ¿le llevas esto? No corre prisa. Ya te dije lo que pienso de la prisa.' },
			{ prompt: 'Doña Casilda deja un sobre con lacre verde en el platillo de la balanza. La aguja se mueve más de lo normal.', choice: [
				{ text: '«Yo se lo llevo.»', then: [
					{ say: 'p7_casilda', text: 'Bien. Pesa cuarenta y un gramos. Si llega con cuarenta, lo voy a saber.' },
				] },
				{ text: '«¿Y no puede llamarla por teléfono?»', then: [
					{ say: 'p7_casilda', text: 'Por teléfono las palabras no pesan nada. Salen, se van y ya. Un sobre pesa. Cuarenta y un gramos. Llévalo.' },
				] },
			] },
			{ give: 'p7_sobre_casilda' },
			{ quest: 'p7_s_recado', stage: 'llevar' },
		],
		p7_casilda_nota: [
			{ set: { 'flag.p7_recado_hecho': true } },
			{ text: 'Doña Casilda ve la hoja de albarán antes de que la saques. Deja la lupa. Es la primera vez que la ves dejar la lupa.' },
			{ say: 'p7_casilda', text: '¿Contestó? No hacía falta que contestara. —Extiende la mano—. Dame.' },
			{ text: 'Pone la nota en la balanza antes de leerla. Luego la lee. Despacio. Dos veces. En la parte del ónice se le mueve una comisura, medio milímetro.' },
			{ say: 'p7_casilda', text: 'Tres gramos. Una hoja, tinta, tachones. Tres gramos. —La dobla y se la guarda en el bolsillo del pecho—. Es lo que más pesa que he tenido hoy en la balanza.' },
			{ say: 'p7_casilda', text: '«Negro desde marzo». Mira tú. Y come cuatro veces. —Carraspea—. A ojo: mensajer{o|a|e} de fiar. Veinticuatro quilates, dice ella. Yo digo veintitrés y medio, que alguien tiene que ser seria en esta familia.' },
			{ say: 'p7_casilda', text: 'Elige una de la vitrina. De las de arriba. Invita la casa. No se lo digas a mi hija: va a empezar a regalar bolsitas.' },
			{ prompt: 'En la repisa de arriba hay tres piedras sobre terciopelo.', choice: [
				{ text: 'La Piedra Día (brilla como si tuviera prisa)', then: [{ give: 'shinystone' }] },
				{ text: 'La Piedra Noche (se traga la luz de la vitrina)', then: [{ give: 'duskstone' }] },
				{ text: 'La Piedra Alba (un ojo verde azulado, muy quieto)', then: [{ give: 'dawnstone' }] },
			] },
			{ text: 'Debajo del mostrador, Tasador saca una mano y deja algo junto a tu pie: una canica de cristal rojo, un poco mordida. Luego se esconde, avergonzado.' },
			{ say: 'p7_casilda', text: 'Eso es de su parte. La intención, ya sabes. —Vuelve a tomar la lupa—. Un día de estos subo a ese tren. A ver cuánto no pesa.' },
			{ give: 'nugget' },
			{ quest: 'p7_s_recado', done: true },
			{ diary: 'Hoy mi entrenador{|a|e} y yo hicimos de carteros entre dos tiendas de piedras. ¡Bzzt! La señora de Trigal pesó la carta antes de leerla: tres gramos. Yo peso trescientos cinco y nadie me ha puesto nunca en una balanza. Un Sableye nos regaló una canica mordida. Es el mejor regalo mordido que nos han hecho.', cond: 'flag.b01_diario' },
		],
		p7_casilda_reto: [
			{ set: { 'flag.p7_casilda_reto_visto': true } },
			{ say: 'p7_casilda', text: 'Siete medallas, por lo menos. Y esa pulsera. —Señala tu muñeca con la lupa—. Piedra Activadora auténtica, engaste de Yantra. Eso no se vende. Eso te lo dieron.' },
			{ say: 'p7_casilda', text: 'Yo tengo otra. Me la tasó a mí la vida, que cobra más caro. Y Tasador tiene la suya: una Sableynita que encontró él solo en una veta de Hoenn. Es la única piedra que no se ha comido.' },
			{ say: 'p7_casilda', text: 'No lo saco por menos de siete medallas. Es cuestión de quilates. ¿Una exhibición? Aquí mismo. La de las maletas ya está acostumbrada.' },
			{ prompt: '¿Combate de exhibición contra Doña Casilda? (Megaevoluciona a su Sableye)', choice: [
				{ text: '«Pese a mi equipo.»', then: [
					{ text: 'Doña Casilda saca de un cajón un paño de gamuza y un frasco sin etiqueta, y repasa a tu equipo uno por uno, como quien limpia cristales buenos. Al terminar, todos brillan un poco.' },
					{ heal: 'Tu equipo está como recién tallado: PS y PP al máximo.' },
					{ battle: 'p7_casilda_duelo', lose: 'continue', onWin: [
						{ text: 'Tasador vuelve a su tamaño, se sacude el escudo de rubí que ya no tiene y te mira con sus ojos de diamante. Luego hace algo raro: te tiende la mano. Dentro hay una pepita de oro. Entera. Sin morder.' },
						{ say: 'p7_casilda', text: 'No se la ha comido. —Se quita los lentes, los limpia, se los vuelve a poner—. No lo había visto hacer eso nunca. Acéptala antes de que se arrepienta.' },
						{ give: 'nugget' },
						{ say: 'p7_casilda', text: 'La Megaevolución no hace más grande a un Pokémon. Lo talla. Le quita lo que sobra y se ve lo que había. Tú ya lo sabes. Se te nota en cómo miras a los tuyos.' },
					], onLose: [
						{ say: 'p7_casilda', text: 'Veintidós quilates. No es poco. Pero Tasador come de veintitrés para arriba. —Te pasa el paño de gamuza por el hombro, una sola vez—. Vuelve. Aquí no cerramos por derrota.' },
						{ heal: true },
					] },
				] },
				{ text: '«Hoy solo vengo a mirar piedras.»', then: [
					{ say: 'p7_casilda', text: 'Mirar es gratis. Tocar, no. Tasador y yo no nos vamos a ninguna parte.' },
				] },
			] },
		],
		p7_casilda_generico: [
			{ if: 'beat("p7_casilda_duelo")', then: [
				{ say: 'p7_casilda', text: 'A ojo: veinticuatro quilates. No me hagas repetirlo, que me cuesta. —Debajo del mostrador, Tasador te saluda con dos dedos—. Ese también te tiene tasad{o|a|e}. Alto.' },
			], else: [
				{ if: 'quest.p7_s_recado == "llevar"', then: [
					{ say: 'p7_casilda', text: '¿El sobre? Cuarenta y un gramos. Azafrán, Almacenes Azulona, mostrador de piedras. Sin prisa. Pero sin perderlo.' },
				], else: [
					{ say: 'p7_casilda', text: 'Todas a tres mil. La que brilla más no vale más: solo brilla más. Eso sirve para las piedras y para la gente.' },
				] },
			] },
			{ say: 'p7_casilda', text: 'Un consejo que no cobro: la Piedra Alba es caprichosa: a unos solo les sirve si son macho y a otros solo si son hembra. La Piedra Día y la Noche, a muy pocos, pero a esos les cambia la vida. Y el Cordón Unión hace lo que antes hacía un intercambio, sin tener que fiarte de nadie.' },
		],

		// -----------------------------------------------------------------
		// TRIGAL · Disco Técnico (MT)
		// -----------------------------------------------------------------
		p7_dj_intro: [
			{ set: { 'flag.p7_dj_1': true } },
			{ text: 'La 5.ª planta tiene una tienda nueva con las paredes forradas de cajones, como las tiendas de discos de antes. En cada funda, un disco plateado con una etiqueta escrita con rotulador: «Rayo», «Lanzallamas», «Protección». Un chico con auriculares los ordena por orden alfabético y luego los desordena por tipo.' },
			{ say: 'p7_dj', text: '¡Muy buenas, oyentes! Digo, clientes. Digo, cliente. ¡Bienvenid{o|a|e} a **Disco Técnico**, la casa de la Máquina Técnica! Aquí cada disco tiene un solo tema, pero qué tema.' },
			{ say: 'p7_dj', text: 'Te explico la programación. Una MT no se gasta: la compras una vez y suena para siempre, en todos los Pokémon que se la sepan de memoria. Por eso no te vendo dos iguales. No es que no quiera tu dinero. Es que tengo principios.' },
			{ say: 'p7_dj', text: 'Tengo los clásicos de siempre: Protección, Sustituto, Danza Lluvia, Día Soleado… Los éxitos del momento: Rayo, Lanzallamas, Energibola. Y la sección de puños, que se vende sola.' },
			{ say: 'p7_dj', text: 'Lo más pesado del catálogo, lo de reventar bocinas, no lo traigo yo: eso sale de una expendedora de Silph que hay en Ciudad Azafrán, y dicen que no suelta lo fuerte hasta que le enseñas ocho medallas. Una máquina con criterio. Me cae bien.' },
		],
		p7_dj_generico: [
			{ if: 'count("p7_mt_rayo") > 0 || count("p7_mt_lanzallamas") > 0 || count("p7_mt_energibola") > 0', then: [
				{ say: 'p7_dj', text: '¿Qué tal suena lo que te llevaste? Noventa de potencia, cien de precisión, cero rayones. Eso en mi época se llamaba un disco redondo.' },
			], else: [
				{ say: 'p7_dj', text: '¡Y seguimos en Disco Técnico! Recomendación de la semana: los puños. Hielo, Trueno y Fuego. Si tu Pokémon tiene manos, tiene repertorio.' },
			] },
			{ say: 'p7_dj', text: 'Dato para coleccionistas: los instructores de las zonas de entrenamiento guardan discos que yo no consigo ni pidiéndolos por favor. Ediciones únicas. Se los dan a quien les gana tres combates. A mí no me dejan ni entrar: dicen que hablo mucho.' },
		],

		// -----------------------------------------------------------------
		// AZAFRÁN · Almacenes Azulona (Jade, la expendedora y Ciro)
		// -----------------------------------------------------------------
		p7_jade_intro: [
			{ set: { 'flag.p7_jade_1': true } },
			{ text: 'Detrás del mostrador de piedras, una chica con una mecha verde en la coleta pesa una Piedra Agua, cobra a un cliente, firma un albarán y te saluda con la barbilla. Todo a la vez.' },
			{ say: 'p7_jade', text: '¡Hola, pasa, pasa, no te quedes en la puerta que se escapa el fresco! Jade Peña, Peña e Hija, yo soy la hija. Piedras de las diez clases, todas a tres mil, y bolsita de terciopelo de regalo. La bolsita no se la cuentes a nadie de Johto.' },
			{ say: 'p7_jade', text: 'Y esto de aquí es importación: cosas de Galar, de Alola, de sitios donde los Pokémon evolucionan con una manzana o con una tetera, te lo juro. Lo raro, raro, lo saco cuando alguien me enseña ocho medallas; el seguro me obliga.' },
			{ say: 'p7_jade', text: 'Las MT son de la expendedora, que es de Silph y no es mía, así que si se traga el dinero le reclamas a ella. Nunca se lo ha tragado. Pero mira feo.' },
			{ if: 'flag.p7_casilda_1', then: [
				{ say: 'p7_jade', text: 'Espera. Esa cara de que te han pesado. ¿Vienes de Trigal? ¿De la 4.ª planta? ¿Te dijo «a ojo»? Te dijo «a ojo». Es mi madre. Lo siento. Y de nada.' },
			], else: [
				{ say: 'p7_jade', text: 'La casa madre está en Trigal, en el Centro Comercial, 4.ª planta. La lleva mi madre. Si pasas, no le digas lo de las bolsitas. Y deja que te pese: le hace ilusión.' },
			] },
		],
		// Presentación + sobre en una sola visita. Va aparte para que Jade no salga como «misión nueva»
		// cuando aún no llevas el sobre (revisión de lógica, 2026-10-10).
		p7_jade_intro_sobre: [
			{ call: 'p7_jade_intro' },
			{ call: 'p7_jade_sobre' },
		],
		p7_jade_sobre: [
			{ set: { 'flag.p7_jade_nota': true } },
			{ text: 'Sacas el sobre del lacre verde. Jade deja de hacer cuatro cosas a la vez. Se queda haciendo una sola: mirarlo.' },
			{ say: 'p7_jade', text: '¿Te lo dio ella? ¿En mano? ¿Lo pesó? —Lo pone en la balanza—. Cuarenta y un gramos. Lo pesó.' },
			{ text: 'Lo abre con una uña. Lee de pie, moviendo los labios. En «Come» resopla. En la posdata se ríe por la nariz y se limpia un ojo con la manga. Luego limpia la balanza con la misma manga, a propósito.' },
			{ say: 'p7_jade', text: '«No hace falta que contestes. Posdata: contesta». Cuarenta años tasando y no sabe tasarse a sí misma. —Arranca una hoja del talonario de albaranes y escribe por detrás, rapidísimo, sin sentarse—.' },
			{ say: 'p7_jade', text: 'Listo. ¿Se la llevas cuando vuelvas por Trigal? Sin prisa. No, con un poquito de prisa. No se lo digas. Y toma, por el porte: esto no es de la tienda, es mío.' },
			{ give: 'p7_nota_jade' },
			{ give: 'rarecandy' },
			{ quest: 'p7_s_recado', stage: 'volver' },
		],
		p7_jade_generico: [
			{ if: 'flag.p7_recado_hecho', then: [
				{ say: 'p7_jade', text: '¡Me escribió otra vez! Dos renglones. «Recibido. Tres gramos». Y debajo, más chiquito: «Voy en primavera». ¡Va a subir al tren! Le va a dar un coraje… No pesa nada, el tren. Nada.' },
			], else: [
				{ if: 'flag.p7_jade_nota', then: [
					{ say: 'p7_jade', text: '¿Ya se la diste? ¿No? Sin prisa. Bueno. Con un poquito. Trigal, Centro Comercial, 4.ª planta, la señora de la lupa. No tiene pierde: es la única que no sonríe.' },
				], else: [
					{ say: 'p7_jade', text: 'Diez clases de piedra, todas a tres mil, bolsita de regalo. Y si no sabes cuál necesita tu Pokémon, pregúntale a tu Pokédex, que la mía dice cosas como «condiciones especiales» y se queda tan campante.' },
				] },
			] },
			{ say: 'p7_jade', text: 'Ah, y si ves entrar a Ciro corriendo, quítate de en medio. Reparte para los Almacenes entre Azulona, Azafrán y Trigal, y su Pidgeot aterriza donde cae. Ya me rompió dos vitrinas. Las dos veces pidió perdón desde el aire.' },
		],
		p7_expendedora_cartel: [
			{ text: 'Una máquina expendedora del tamaño de un armario, con el logo rojo de Silph S.A. medio despintado. Detrás del cristal, hileras de discos plateados. Algunos casilleros tienen una lucecita roja encendida.' },
			{ text: 'Un cartel plastificado, con letra muy pequeña:\n\n«**EXPENDEDORA DE MÁQUINAS TÉCNICAS · SILPH S.A.**\nUna unidad por cliente y por título. La máquina lo recuerda.\nLos títulos de **categoría superior** se dispensan únicamente a titulares de **ocho medallas** del Circuito.\nNo golpee la máquina. La máquina también lo recuerda.»' },
			{ text: 'Debajo, a bolígrafo, alguien ha añadido: «Mantenimiento: Silph, planta 5. (Planta 5 cerrada por auditoría. Si se atasca, pregunten a Jade.)»' },
		],
		p7_ciro: [
			{ set: { 'flag.p7_ciro_1': true } },
			{ text: 'La puerta de atrás se abre de golpe. Entra un chico pelirrojo con gafas de aviador en la frente, una caja bajo cada brazo y tres plumas color crema enredadas en el pelo. Deja las cajas, firma algo, mira el reloj.' },
			{ say: 'p7_ciro', text: '¡Azulona–Azafrán en catorce minutos! ¡Trece, si no hubiera semáforos! Ya sé que en el aire no hay semáforos. Yo los respeto igual.' },
			{ text: 'En la percha del techo, un Pidgeot enorme se acomoda las plumas. Lleva un arnés de cuero con un bolsillo, y en el bolsillo, una piedra redonda que brilla con dos colores.' },
			{ say: 'p7_ciro', text: '¿Eso? Una Pidgeotita. Venía en un paquete sin remitente y sin destinatario, hace dos años. Protocolo: treinta días en depósito y luego es del repartidor. Albarán la olió el día uno. Me pasé veintinueve noches sin dormir.' },
			{ say: 'p7_ciro', text: 'Oye. Esa pulsera. ¡Tú también megaevolucionas! Tengo… —mira el reloj— once minutos antes del siguiente reparto. ¿Una exhibición rápida? ¡Entrega exprés!' },
			{ prompt: '¿Combate de exhibición contra Ciro? (Megaevoluciona a su Pidgeot)', choice: [
				{ text: '«Va. Pero cura primero a mi equipo.»', then: [
					{ say: 'p7_ciro', text: '¡Servicio completo! —Saca de la mochila de reparto un botiquín con el sello de los Almacenes y rocía a tu equipo a toda velocidad, sin fallar uno—. ¡Listos! ¡Cuarenta segundos! ¡Récord de la sucursal!' },
					{ heal: 'Tu equipo ha recuperado todas sus fuerzas.' },
					{ battle: 'p7_ciro_duelo', lose: 'continue', onWin: [
						{ text: 'Albarán vuelve a su tamaño y aterriza en la percha con mucha dignidad y una vitrina de menos. Jade ni levanta la vista: apunta algo en una libreta.' },
						{ say: 'p7_ciro', text: '¡Entrega fallida! ¡La primera del año! —Se ríe, sin aliento—. ¿Sabes qué es lo mejor de megaevolucionar? Que durante un combate Albarán no tiene prisa. Es el único rato del día en que no la tenemos ninguno de los dos.' },
						{ say: 'p7_ciro', text: 'Toma, del depósito de paquetes sin dueño. Treinta días cumplidos ayer. ¡Me voy! ¡Diez minutos! ¡Nueve!' },
						{ give: 'sharpbeak' },
					], onLose: [
						{ say: 'p7_ciro', text: '¡Entregado! Perdona, es la costumbre. —Te vuelve a rociar el equipo sin que se lo pidas—. Cuando quieras la revancha, estoy aquí cada… —mira el reloj— cada rato.' },
						{ heal: true },
					] },
				] },
				{ text: '«Ahora no. Se te hace tarde.»', then: [
					{ say: 'p7_ciro', text: '¡Tienes razón! ¡Siempre se me hace tarde! ¡Es mi estado natural! Cuando quieras, aquí estoy cada once minutos.' },
				] },
			] },
		],
		p7_ciro_despues: [
			{ say: 'p7_ciro', text: '¡Tú! ¡{El|La|Le} de la entrega fallida! Albarán todavía se acuerda. Yo también: fue el mejor retraso de mi vida.' },
			{ say: 'p7_ciro', text: 'Si pasas por Trigal, mira en la 4.ª planta del Centro Comercial: llevo piedras de la hija a la madre dos veces por semana. No se hablan por teléfono, pero se mandan mercancía. Yo creo que es su forma de decirse cosas.' },
		],
		p7_ciro_trigal: [
			{ set: { 'flag.p7_ciro_trigal': true } },
			{ text: 'Junto al mostrador de Peña e Hija hay un repartidor doblado por la mitad, con las manos en las rodillas, intentando respirar. A su lado, una caja con etiqueta de Azulona. En el barandal de la escalera mecánica, un Pidgeot se arregla las plumas como si no fuera con él.' },
			{ say: 'p7_ciro', text: '¡Azafrán–Trigal… en tren… y seis plantas… por la escalera! ¡Las mecánicas… no dejan subir… con Pidgeot! —Levanta un dedo—. Un momento. Ya. Ya casi.' },
			{ say: 'p7_casilda', text: 'Cuatro minutos de retraso. Y la caja pesa doscientos gramos menos que el albarán. —Lo mira por encima de los lentes—. A ojo: se te cayó una Piedra Hoja en el tren.' },
			{ say: 'p7_ciro', text: '…En el vagón restaurante. Debajo del asiento. ¡Voy! ¡Vuelvo! ¡Catorce minutos! —Ya está corriendo—. ¡{jugador}, cuídame la caja!' },
			{ text: 'Doña Casilda mira cómo se aleja. Luego mira al Pidgeot. El Pidgeot la mira a ella. Los dos suspiran al mismo tiempo.' },
			{ say: 'p7_casilda', text: 'Es buen muchacho. Diez quilates de cabeza y veinticuatro de piernas. Mi hija lo aguanta porque nunca ha perdido un paquete más de una vez.' },
		],

		// -----------------------------------------------------------------
		// LAGO DE LA FURIA · Evaristo (Mega-Gyarados)
		// -----------------------------------------------------------------
		p7_evaristo: [
			{ set: { 'flag.p7_evaristo_1': true } },
			{ text: 'En la orilla de arena gris, sentado en un cajón de fruta, un pescador viejo sostiene una caña sin mirarla. Mira el agua. A sus pies, medio dentro del lago, duerme un Gyarados azul, enorme, con la cabeza apoyada en la arena como un perro.' },
			{ say: 'p7_evaristo', text: 'Hacía años que no veía el lago tan tranquilo. —No se gira—. Eso me da más miedo todavía. Un lago así de quieto es un lago que está pensando.' },
			{ say: 'p7_evaristo', text: 'Evaristo. Treinta años en esta orilla. Antes, otros treinta en el mar, en Olivo, con mi hermano. Me vine porque el mar tenía demasiada agua. Aquí la tengo contada.' },
			{ say: 'p7_evaristo', text: 'Este es Paciencia. Lo pesqué de Magikarp el primer día. No lo solté. Él tampoco me soltó a mí. Cuando el lago se volvió loco y todos los demás empezaron a evolucionar a la fuerza, Paciencia se quedó aquí, quieto, mirándome. Fue el único que no rugió.' },
			{ text: 'El Gyarados abre un ojo. Lleva al cuello un cordel de pescar, y en el cordel, una piedra redonda, azul y roja, pulida por los años.' },
			{ say: 'p7_evaristo', text: 'La sacamos del mar mi hermano y yo. Eran dos, iguales. Él tiene la otra. —Por fin te mira. Primero a ti, luego a tu muñeca—. Y tú llevas pulsera. Vaya. Hoy sí va a picar algo.' },
			{ prompt: '¿Combate de exhibición contra Evaristo? (Megaevoluciona a su Gyarados)', choice: [
				{ text: '«Con gusto. ¿Me deja preparar al equipo?»', then: [
					{ text: 'Evaristo destapa un termo abollado y reparte caldo de pescado caliente en la tapa, por turnos. Tu equipo bebe con desconfianza. Luego, con ganas. Paciencia mira el termo con cara de saber de qué está hecho el caldo.' },
					{ heal: 'Tu equipo ha recuperado todas sus fuerzas. Huelen un poco a pescado.' },
					{ battle: 'p7_evaristo_duelo', lose: 'continue', onWin: [
						{ text: 'Paciencia se encoge, vuelve a ser el de siempre y deja caer la cabeza en la arena con un suspiro que levanta una ola pequeña. Evaristo le rasca detrás de la aleta.' },
						{ say: 'p7_evaristo', text: 'Buen pez. Los dos. —Se quita la gorra—. ¿Sabes lo que es raro? Estos días, cuando el lago estaba mal, la piedra de Paciencia se calentaba sola. Como si algo tirara de ella desde abajo. Desde que se apagó la boya, está fría. Fría como debe.' },
						{ say: 'p7_evaristo', text: 'Toma. Agua del lago de antes de todo esto. La guardaba para un día bueno. Hoy es un día bueno.' },
						{ give: 'mysticwater' },
					], onLose: [
						{ say: 'p7_evaristo', text: 'Se soltó el pez. Pasa. —Te sirve otra tapa de caldo—. La gracia de pescar es que mañana se vuelve a echar la caña. Aquí estoy.' },
						{ heal: true },
					] },
				] },
				{ text: '«Otro día. Hoy solo quiero ver el lago.»', then: [
					{ say: 'p7_evaristo', text: 'Eso también es pescar. Siéntate si quieres. El cajón es para dos.' },
				] },
			] },
		],
		p7_evaristo_despues: [
			{ if: 'night', then: [
				{ say: 'p7_evaristo', text: 'De noche Paciencia ronca. No se lo digas: cree que es el viento.' },
			], else: [
				{ say: 'p7_evaristo', text: 'Hoy tampoco ha picado nada. Mejor. Si picara todos los días, esto sería un trabajo.' },
			] },
			{ say: 'p7_evaristo', text: 'Si pasas por el puerto de Olivo, busca al contramaestre del muelle de entrenamiento. El de la barba, el que le dice «muchacho» a todo el mundo. Es mi hermano. Dile que el lago ya está quieto. Y que sigue teniendo demasiada agua, el mar.' },
		],

		// -----------------------------------------------------------------
		// LAVANDA · Dolores (Mega-Banette)
		// -----------------------------------------------------------------
		p7_dolores: [
			{ set: { 'flag.p7_dolores_1': true } },
			{ text: 'En un banco, frente al cementerio pequeño, una mujer de trenzas grises cose un muñeco de trapo. Tiene una cesta llena: Pikachu de fieltro, Clefairy de calcetín, un Growlithe con un botón por ojo. A su lado, sentado muy derecho, hay un muñeco más: negro, con una cremallera por boca. Ese no es de trapo. Ese te está mirando.' },
			{ say: 'p7_dolores', text: 'No te asustes. Se llama Remiendo. Mira así a todo el mundo: está buscando una cara. Lleva muchos años buscándola.' },
			{ say: 'p7_dolores', text: 'Soy Dolores. Coso muñecos para las tumbas que no tienen visita. Uno por lápida, uno por año. A los Pokémon no les gusta estar solos, ni siquiera después.' },
			{ say: 'p7_dolores', text: 'A Remiendo lo tiraron. Así nacen los suyos: un juguete que alguien dejó de querer. Me lo encontré en el contenedor de la vieja Torre, cuando la derribaron. Traía esto cosido por dentro, como un corazón.' },
			{ text: 'Abre dos dedos la cremallera del Banette. Dentro, entre el relleno, brilla una piedra redonda, negra y rosa.' },
			{ say: 'p7_dolores', text: 'Cuando se abre del todo, sale lo que lleva guardado. No es bonito de ver. Pero después duerme mejor. —Te mira la muñeca—. Tú sabes abrirla también, ¿verdad? ¿Le haces el favor? Un combate. Para que se desahogue.' },
			{ prompt: '¿Combate de exhibición contra Dolores? (Megaevoluciona a su Banette)', choice: [
				{ text: '«Se lo hago. Pero deje que mi equipo se prepare.»', then: [
					{ text: 'Dolores saca de la cesta un termo de infusión de lavanda y un costurero. Mientras tu equipo bebe, les revisa las patas, las alas, las costuras que no tienen. A uno le ata un hilo morado en la muñeca, «para que vuelva».' },
					{ heal: 'Tu equipo ha recuperado todas sus fuerzas.' },
					{ battle: 'p7_dolores_duelo', lose: 'continue', onWin: [
						{ text: 'Remiendo se cierra la cremallera él solo, despacio, diente por diente. Se sienta otra vez en el banco, muy derecho. Pero ya no te mira con hambre: te mira como se mira a alguien conocido.' },
						{ say: 'p7_dolores', text: 'Gracias. Esta noche va a dormir de corrido. —Le acomoda la cabeza—. No ha encontrado la cara que busca. Pero ha encontrado una que no le tiene miedo. A veces con eso alcanza.' },
						{ say: 'p7_dolores', text: 'Toma. Lo cosí yo. No es gran cosa: papel, tinta y buena intención.' },
						{ give: 'spelltag' },
					], onLose: [
						{ say: 'p7_dolores', text: 'Remiendo, ya. Ya pasó. —Le cierra la cremallera con dos dedos—. Perdónalo. Cuando se abre no mide. Vuelve cuando quieras: le hace bien perder, y todavía no le ha tocado.' },
						{ heal: true },
					] },
				] },
				{ text: '«Ahora no puedo. Lo siento.»', then: [
					{ say: 'p7_dolores', text: 'No pasa nada. Él sabe esperar. Es lo que mejor sabe hacer.' },
				] },
			] },
		],
		p7_dolores_despues: [
			{ say: 'p7_dolores', text: 'Remiendo durmió toda la noche. Hacía años. Yo también, de paso.' },
			{ text: 'Dolores levanta el muñeco que está cosiendo. Es pequeño, azul, con dos orejas largas y un antifaz negro bordado. Le falta un brazo.', cond: 'inParty("lucario") || inParty("riolu")' },
			{ say: 'p7_dolores', text: 'Este es para un Rattata que vivió diecinueve años. Diecinueve. Ya no viene nadie a verlo. Vengo yo. Y ahora va a tener un Clefairy de calcetín.', cond: '!(inParty("lucario") || inParty("riolu"))' },
			{ say: 'p7_dolores', text: 'Este no es para ninguna tumba. Lo vi pasar el otro día y me dieron ganas. Cuando le ponga el brazo, es tuyo. Vuelve otro día: coser bien lleva su tiempo.', cond: 'inParty("lucario") || inParty("riolu")' },
		],

		// =================================================================
		// PREMIOS DE LAS ZONAS DE ENTRENAMIENTO (uno por zona; el motor los corre una sola vez)
		// =================================================================

		// ---------- Novarte · Patio del Gimnasio (Brock, Roca) ----------
		p7_premio_patio_novarte: [
			{ say: 'aprendiz_brock', text: '¡Tres! ¡Tres combates ganados en mi patio! Espera, espera, no te vayas. Brock dejó dicho una cosa para cuando alguien llegara a tres.' },
			{ say: 'aprendiz_brock', text: 'Dijo: «Al que gane tres veces sin romper nada, le das el disco del cajón de las sartenes». Está en el cajón de las sartenes porque es donde guarda lo importante. La medalla también estuvo ahí una temporada.' },
			{ give: 'p7_mt_roca_afilada' },
			{ say: 'aprendiz_brock', text: '**Roca Afilada**. Pega como una pared que se cae, y suele caer donde más duele. Brock dice que la roca no tiene prisa, pero que cuando llega, llega. Luego me dejó sin postre por repetirlo con voz de él.' },
		],

		// ---------- Relieve · Muro de Escalada (Megapiedra) ----------
		p7_premio_muro: [
			{ say: 'p7_c_muro', text: '¡Tres vías limpias! Baja, baja, que te quiero enseñar una cosa. ¿Ves el hueco de la vía naranja, arriba, a la izquierda? Ahí había una presa.' },
			{ say: 'p7_c_muro', text: 'Redonda, gris, con una espiral dentro. Nadie la agarraba bien: estaba siempre tibia y los Pokémon se quedaban mirándola en vez de trepar. El mes pasado la desatornillé. No tenía tornillo. Estaba metida en la roca desde antes de que hubiera muro.' },
			{ say: 'p7_c_muro', text: 'Se la enseñé al de los fósiles de Petroglifo. Se puso blanco. Dice que es una Megapiedra, que es de un Pokémon que lleva millones de años sin volar por aquí y que «reacciona al ámbar». Yo de eso no sé. Yo sé de nudos.' },
			{ give: 'aerodactylite' },
			{ say: 'p7_c_muro', text: 'Aquí no la quiero: me distrae a la gente. Tú trepas bien y pisas con cabeza. Si algún día tienes algo con alas de piedra, ya sabes qué colgarle. Y si no lo tienes, en Petroglifo reviven cosas. Ahí lo dejo.' },
		],

		// ---------- Yantra · Playa de la Torre (Lucha / aura) ----------
		p7_premio_playa: [
			{ say: 'p7_c_playa', text: '¡TRES! ¡Con la arena hasta las rodillas y tres seguidos! ¡Ya estás a tope de verdad! Ven. Los de la Torre me dejan guardar aquí una cosa para estos casos.' },
			{ text: 'Desentierra una caja de madera de debajo de la sombrilla. Dentro, envuelto en una cinta de karate, hay un disco plateado.' },
			{ say: 'p7_c_playa', text: 'En la Torre Maestra dicen que el golpe más fuerte no sale del puño: sale de más adentro. Yo llevo seis años pegándole al mar para entenderlo. El mar no me lo explica. Este disco, un poco sí.' },
			{ give: 'p7_mt_esfera_aural' },
			{ say: 'p7_c_playa', text: '**Esfera Aural**. No falla nunca. ¡Nunca! Porque no apuntas con los ojos. Si en tu equipo hay alguien que vea con el aura, ya sabe usarla desde antes de que tú se la enseñes.', cond: 'owns("lucario") || owns("riolu")' },
			{ say: 'p7_c_playa', text: '**Esfera Aural**. No falla nunca. ¡Nunca! Porque no apuntas con los ojos. ¡Ahora ve a pegarle a algo que no sea el mar!', cond: '!(owns("lucario") || owns("riolu"))' },
		],

		// ---------- Azalea · Huerto de Bonguris (Bicho) ----------
		p7_premio_huerto: [
			{ say: 'p7_c_huerto', text: 'Tres combates y no me has pisado ni un brote. Eso no lo hace casi nadie. Espera, que bajo de la escalera.' },
			{ say: 'p7_c_huerto', text: 'Los Bonguris tienen un secreto: los bichos no los estropean. Los cuidan. Se llevan un poquito de savia y a cambio el árbol queda limpio. Antón, el del gimnasio, dice que eso es «una relación de equilibrio». Yo digo que es saber tomar sin acabar con nada.' },
			{ give: 'p7_mt_chupavidas' },
			{ say: 'p7_c_huerto', text: '**Chupavidas**. Me la dejó Antón para quien entendiera el huerto. Tu Pokémon golpea y se queda con la mitad de lo que quita. Úsala como la usan aquí: lo justo.' },
		],

		// ---------- Trigal · Azotea del Centro Comercial (Normal) ----------
		p7_premio_azotea: [
			{ say: 'p7_c_azotea', text: '¡Tres de tres! ¡Y sin pinchar el Miltank! Eso merece premio. Y no, el premio no es la foto. La foto es aparte y también te toca.' },
			{ say: 'p7_c_azotea', text: 'Aquí arriba, para que te oigan entre el viento y la megafonía de las ofertas, hay que tener pulmones. Blanca, la líder de aquí de toda la vida, entrenaba en esta azotea de niña, ¿sabías? Gritándole a los Pidgey. Dicen que de ahí le viene el genio.' },
			{ give: 'p7_mt_vozarron' },
			{ say: 'p7_c_azotea', text: '**Vozarrón**. Lo pedí para la megafonía y me mandaron esto. Atraviesa hasta los sustitutos. No lo pruebes cerca del hinchable, por lo que más quieras. Ahora sí: ponte ahí, sonríe. ¡Miltank!' },
		],

		// ---------- Iris · Patio de la Torre Quemada (Megapiedra) ----------
		p7_premio_patio_quemada: [
			{ say: 'p7_c_patio_iris', text: 'Tres veces han peleado tus sombras con las nuestras. Tres veces se ha removido el brasero. Acércate.' },
			{ text: 'En mitad del patio hay un brasero de bronce que los sabios nunca dejan apagar. El sabio aparta las ascuas con unas tenazas. Debajo, sin una marca de hollín, hay una piedra redonda, roja y dorada.' },
			{ say: 'p7_c_patio_iris', text: 'Cuando la torre ardió, hace ciento cincuenta años, no todo se quemó. Entre las vigas quedó esto. No estaba caliente. No estaba fría. Estaba tibia, como una mano. La guardamos en el fuego porque fue lo único que el fuego respetó.' },
			{ say: 'p7_c_patio_iris', text: 'Nunca ha respondido a ningún Pokémon de Johto. Un médium dijo que esperaba a un zorro que no escupe el fuego: lo lee. Aquí no hay zorros así. Pero la piedra se ha encendido las tres veces que has combatido.' },
			{ text: 'Uno de los tuyos, dentro de su Poké Ball, se revuelve. En el brasero, las ascuas dibujan durante un segundo la forma de una rama encendida.', cond: FOX },
			{ give: 'delphoxite' },
			{ say: 'p7_c_patio_iris', text: 'Las sombras de esta torre ya no tienen nada que enseñarte. El fuego, quizá sí. Llévatela lejos de aquí: una piedra que sobrevivió a un incendio no merece pasarse la eternidad en un brasero.' },
		],

		// ---------- Malva · Patio de la Torre Bellsprout (Psíquico) ----------
		p7_premio_patio_bellsprout: [
			{ text: 'El aprendiz deja de balancearse. Del todo. Es la primera vez que lo ves quieto.' },
			{ say: 'p7_c_bellsprout', text: 'Tres combates. Te has doblado tres veces y no te has roto ninguna. El maestro dice que al que hace eso hay que darle el pilar.' },
			{ say: 'p7_c_bellsprout', text: 'No el pilar de verdad. Ese se queda: sostiene la torre. —Saca de la manga un disco plateado, con mucho cuidado—. Lo que el pilar enseña.' },
			{ give: 'p7_mt_paz_mental' },
			{ say: 'p7_c_bellsprout', text: '**Paz Mental**. El pilar de la torre se mueve con cada temblor, y por eso no se cae nunca. Quien la aprende se queda quieto un turno entero y sale de ahí más fuerte por dentro y por fuera. A mí todavía no me sale. Me balanceo.' },
		],

		// ---------- Olivo · Muelle de entrenamiento (Megapiedra) ----------
		p7_premio_muelle: [
			{ say: 'p7_c_muelle', text: 'Tres. Con viento de costado y el muelle mojado. —Se rasca la barba—. Ven acá, que te voy a dar una cosa y te voy a contar por qué, y las dos van a ser largas.' },
			{ text: 'Entra en la caseta del muelle y sale con un rollo de cartas de navegación. Las cartas no le importan: lo que busca es la piedra que las pisaba. Redonda, azul y roja, pulida como un canto de río.' },
			{ say: 'p7_c_muelle', text: 'Hace treinta años mi hermano Evaristo y yo subimos una red con dos Magikarp y dos de estas, iguales como dos gotas. Un sabio de fuera nos dijo qué eran. Mi hermano se llevó la suya a un lago, tierra adentro, porque dice que el mar tiene demasiada agua. Está loco. Lo quiero mucho.' },
			{ say: 'p7_c_muelle', text: 'La mía la iba a usar con mi Gyarados. Pero mi Gyarados se jubiló antes que yo: ahora vive en la bocana y asusta a los turistas por gusto. Así que lleva veinte años pisando papeles.' },
			{ give: 'gyaradosite' },
			{ say: 'p7_c_muelle', text: 'Una **Gyaradosita**. Para un Gyarados que todavía tenga ganas de pleito. Si no tienes uno, el mar está lleno de Magikarp con aspiraciones. Y si un día ves a mi hermano, dile que el mar sigue en su sitio. Que venga a verlo.' },
		],

		// ---------- Caoba · La trastienda (Hielo) ----------
		p7_premio_trastienda: [
			{ text: 'El dependiente te alcanza antes de que cruces la cortina. Sonríe demasiado, como siempre, pero esta vez trae algo escondido a la espalda.' },
			{ say: 'dependiente_caoba', text: '¡Tres victorias en mi trastienda! Digo, en la trastienda. Que no es mía. Bueno, sí es mía. ¡Felicidades! Hay premio. Legal. Con recibo, si lo quieres. Nadie lo quiere nunca.' },
			{ say: 'dependiente_caoba', text: 'Aquí viene todas las semanas un señor mayor, de bastón, a comprar Caramelos Furia. No se los come: dice que son para «acordarse de cuando el invierno enseñaba algo». Un día me dejó esto en el mostrador en vez de las monedas. Yo no discuto con señores de bastón.' },
			{ give: 'p7_mt_rayo_hielo' },
			{ say: 'dependiente_caoba', text: '**Rayo Hielo**. Me dijo: «Dásela a alguien que aguante el frío sin quejarse». Tú has aguantado tres combates aquí atrás sin preguntar de dónde sale la corriente de aire. Para mí, eso cuenta. Circula, circula.' },
		],

		// ---------- Azafrán · Dojo Kárate (Megapiedra) ----------
		p7_premio_dojo: [
			{ say: 'kiyo', text: '¡ALTO! ¡Todo el mundo quieto! —Los cinturones negros se quedan congelados a media patada—. ¡Tres combates en mi tatami! ¡Tres! ¡Eso pide el clavo!' },
			{ text: 'Kiyo va hasta la pared del fondo, donde cuelgan los cinturones viejos, cada uno de su clavo. Del último clavo no cuelga un cinturón: cuelga una bolsita de tela. La descuelga con las dos manos.' },
			{ say: 'kiyo', text: 'Antes de irme al monte tuve un alumno que venía de enfrente. Del gimnasio de las cucharas. Decía que la mente lo podía todo. Le dije: «Rompe esa tabla con la mente». Se quedó tres años. Su Pokémon aprendió a saludar antes de golpear. Él aprendió que el codo también piensa.' },
			{ say: 'kiyo', text: 'Cuando se fue, dejó esto en el clavo, con una nota: «Para el próximo que entienda las dos mitades». Diez años ahí colgada. ¡Diez! Ni mis discípulos ni yo somos de dos mitades. Somos de una, y bastante cuadrada.' },
			{ give: 'galladite' },
			{ say: 'kiyo', text: 'Una **Galladita**. Mente y puño en el mismo cuerpo. Y veo que alguien de los tuyos ya sabe saludar antes de golpear. ¡Bien! ¡Que salude! ¡Y que luego golpee! ¡HU!', cond: GAL },
			{ say: 'kiyo', text: 'Una **Galladita**. Mente y puño en el mismo cuerpo. Si todavía no tienes a nadie así, lo tendrás: esas cosas llegan cuando uno ya sabe perder. ¡HU!', cond: '!' + GAL },
		],

		// ---------- Cueva Celeste · El campamento del turno de descanso (Siniestro) ----------
		p7_premio_campamento: [
			{ say: 'p7_c_capataz', text: 'Tres. Tres seguidas me has ganado a la gente. —Baraja sin mirar las cartas—. Con esa racha no te siento yo a mi mesa ni loco. Pero lo que es justo es justo: el bote es tuyo.' },
			{ text: 'Levanta la lata de galletas que hace de bote. Dentro no hay dinero: hay tres botones, un vale de comedor y un disco plateado envuelto en un naipe doblado. El as de espadas.' },
			{ say: 'p7_c_capataz', text: 'En el turno de noche se aprende una sola cosa: el que espera a que el otro enseñe la mano, pierde. Aquí abajo, entre que ves venir algo y lo tienes encima, no da tiempo ni a decir «paso».' },
			{ give: 'p7_mt_golpe_bajo' },
			{ say: 'p7_c_capataz', text: '**Golpe Bajo**. Pega primero, siempre que el otro venga a pegar. Si viene a otra cosa, haces el ridículo: como en la baraja. Me lo jugó un compañero del turno anterior y no volvió por él. Y yo no te he visto. Ni tú a mí. Ni al as.' },
		],

		// ---------- Casa de Bill · El Cabo (Agua) ----------
		p7_premio_cabo: [
			{ say: 'p7_c_cabo', text: 'Tres. —Se baja las gafas de sol. Esta vez no se las vuelve a subir—. Bien. Muy bien. Ven, que esto no se da en la arena.' },
			{ text: 'Te lleva hasta la silla alta de vigilancia. Atornillada al respaldo, donde otros pondrían un flotador, hay una funda impermeable con un disco plateado.' },
			{ say: 'p7_c_cabo', text: 'Mar abierto, corrientes, rocas. Aquí o te llevas bien con la ola o la ola te lleva. La líder de Celeste viene a gritarle al mar cuando pierde. El mar no le contesta, pero ella se va más tranquila. Este disco me lo dio ella, para quien se ganara el Cabo.' },
			{ give: 'p7_mt_surf' },
			{ say: 'p7_c_cabo', text: '**Surf**. Una ola entera, para ti. No se compra en ningún lado. Trátala con respeto y no te va a fallar nunca. Y ahora sí: vete, que la estás haciendo esperar.' },
		],
	},
};
