// Bloque 1 — elementos comunes: medallas, tiendas, objetos propios, retos, eventos por fecha.
export default {
	badges: {
		medalla_roca: { name: 'Medalla Roca', type: 'Rock', desc: 'Circuito Infinito · Ciudad Novarte (Brock, de intercambio).' },
		medalla_encanto: { name: 'Medalla Encanto', type: 'Normal', desc: 'Circuito Infinito · Ciudad Relieve (Blanca, de intercambio).' },
		medalla_lucha: { name: 'Medalla Lucha', type: 'Fighting', desc: 'Circuito Infinito · Ciudad Yantra (Corelia).' },
	},
	items: {
		tarjetapi: { name: 'Tarjeta de Colaborador', pocket: 'key', desc: 'Te acredita como Colaborador Especial de la Policía Internacional. Handsome la firmó con tres faltas de ortografía.' },
		farollana: { name: 'Farol de Lana', pocket: 'key', desc: 'Un farol que se carga con la electricidad estática de la lana de Mareep. Ilumina las cuevas más oscuras.' },
		lenteaura: { name: 'Lente de Aura', pocket: 'key', desc: 'Una lente de cristal tallado. Con Riolu cerca, deja ver los restos de las Fisuras.' },
		amuletotorre: { name: 'Amuleto de la Torre', pocket: 'key', desc: 'Un pequeño amuleto con la llama de la Torre Maestra grabada. Te lo dio Lila.' },
		barajasuerte: { name: 'Baraja de la Suerte', pocket: 'key', desc: 'La baraja «mágica» de Philippe. Le faltan tres cartas y le sobra una.' },
		linternapi: { name: 'Linterna de Policía', pocket: 'key', desc: 'Préstamo de Handsome. Ilumina las cuevas oscuras.' },
		holomisorsera: { name: 'Holomisor de Serafina', pocket: 'key', desc: 'Un contacto directo con Serafina Lemnis. Elegante, pesado y frío al tacto.' },
		cempasuchil: { name: 'Flor de Cempasúchil', pocket: 'misc', cost: 0, desc: 'Flor naranja de pétalos intensos. Su aroma guía a quienes vuelven a casa.' },
		calabazaoro: { name: 'Calabaza de Oro', pocket: 'key', desc: 'El trofeo del Gran Atraco de Halloween del Castillo Caduco.' },
		menukalos: { name: 'Menú de Kalos', pocket: 'medicine', cost: 0, desc: 'Un plato de Gaspar. Al compartirlo, la amistad de todo tu equipo aumenta.', use: 'usar_menu_kalos' },
		mt_tumbarocas: { name: 'MT Tumba Rocas', pocket: 'machines', tm: 'rocktomb', desc: 'Lanza rocas que bajan la Velocidad del objetivo.' },
		mt_fachada: { name: 'MT Imagen', pocket: 'machines', tm: 'facade', desc: 'Su potencia se duplica si el usuario está envenenado, paralizado o quemado.' },
		mt_puñocerteza: { name: 'MT Puño Certero', pocket: 'machines', tm: 'focuspunch', desc: 'Un puñetazo devastador que falla si el usuario recibe un golpe antes.' },
		mt_airecortante: { name: 'MT Aire Afilado', pocket: 'machines', tm: 'aircutter', desc: 'Ráfagas cortantes. Alta probabilidad de golpe crítico.' },
	},
	shops: {
		tienda_1: { name: 'Tienda Pokémon', items: ['pokeball', 'potion', 'antidote', 'paralyzeheal', 'awakening', 'burnheal', 'repel', 'escaperope', { id: 'greatball', cond: 'badges >= 1' }, { id: 'superpotion', cond: 'badges >= 1' }, { id: 'iceheal', cond: 'badges >= 1' }, { id: 'revive', cond: 'badges >= 2' }, { id: 'hyperpotion', cond: 'badges >= 3' }, { id: 'ultraball', cond: 'badges >= 3' }, { id: 'superrepel', cond: 'badges >= 2' }, { id: 'linkingcord', cond: 'flag.regalo_cordon' }] },
		boutique_luminalia: { name: 'Boutique de Luminalia', items: ['xattack', 'xdefense', 'xspatk', 'xspdef', 'xspeed', 'xaccuracy', 'direhit', 'guardspec', 'lumiosegalette', 'pokedoll', { id: 'nestball', cond: 'badges >= 1' }, { id: 'netball', cond: 'badges >= 1' }, { id: 'timerball', cond: 'badges >= 2' }, { id: 'duskball', cond: 'badges >= 2' }, { id: 'quickball', cond: 'badges >= 2' }] },
		herbolario: { name: 'Herbolario de Vánitas', items: ['healpowder', 'energypowder', 'energyroot', 'revivalherb', 'oranberry', 'pechaberry', 'cheriberry', 'rawstberry'] },
		tienda_piedras: { name: 'Piedras y Fósiles de Relieve', items: ['firestone', 'waterstone', 'thunderstone', 'leafstone', 'moonstone', 'everstone', 'hardstone', 'softsand', { id: 'linkingcord', cond: 'flag.regalo_cordon' }] },
	},
	challenges: {
		gym_novarte: {
			name: 'Gimnasio de Ciudad Novarte', npc: 'brock', trainer: 'brock_g1', type: 'Rock', rec: 14,
			cond: 'flag.b01_handsome_recluta',
			info: [
				{ text: 'Líder de intercambio: **Brock** (Kanto), tipo **Roca**.' },
				{ cond: 'visited("novarte")', text: '3 Pokémon, niveles 12 a 14.' },
				{ cond: 'flag.b01_rhi_conto_onix', text: 'Rhi perdió por culpa de su **Onix**: «aguanta un golpe que lo debería tumbar» (Robustez).' },
				{ cond: 'beat("gym_novarte_1") || beat("gym_novarte_2")', text: 'Sus Pokémon usan **Tumba Rocas**: baja tu Velocidad. Los ataques de tipo Lucha, Acero, Agua o Planta le van muy bien.' },
				{ cond: 'beat("brock_g1")', text: '✔ Medalla Roca conseguida.' },
			],
		},
		gym_relieve: {
			name: 'Gimnasio de Ciudad Relieve', npc: 'blanca', trainer: 'blanca_g2', type: 'Normal', rec: 23,
			cond: 'badges >= 1',
			info: [
				{ text: 'Líder de intercambio: **Blanca** (Johto), tipo **Normal**.' },
				{ cond: 'visited("relieve")', text: '3 Pokémon, niveles 21 a 23.' },
				{ cond: 'visited("relieve")', text: 'En toda Johto se habla de su **Miltank** y de su **Rodar**: cada vuelta pega más fuerte que la anterior.' },
				{ cond: 'flag.b01_rhi_conto_miltank', text: 'Rhi dice que Miltank se cura con **Batido** y que **Atracción** la dejó sin moverse. Una Pokémon hembra (o uno sin género) es inmune.' },
				{ cond: 'beat("blanca_g2")', text: '✔ Medalla Encanto conseguida.' },
			],
		},
		gym_yantra: {
			name: 'Gimnasio de Ciudad Yantra', npc: 'corelia', trainer: 'corelia_g3', type: 'Fighting', rec: 31,
			cond: 'badges >= 2',
			info: [
				{ text: 'Líder: **Corelia**, tipo **Lucha**. Heredera de la Megaevolución.' },
				{ cond: 'visited("yantra")', text: '4 Pokémon, niveles 29 a 32. Su as es un **Lucario**.' },
				{ cond: 'flag.b01_lila_conto_corelia', text: 'Lila dice que su **Hawlucha** ataca desde el aire: los tipos Volador, Psíquico y Hada le hacen daño a casi todo su equipo.' },
				{ cond: 'beat("corelia_g3")', text: '✔ Medalla Lucha conseguida.' },
			],
		},
		rival_rhi: {
			name: 'Rival: Rhi', npc: 'rhi', cond: 'flag.b01_rhi_conocida',
			info: [
				{ text: 'Novata de Galar. Quiere ser «la delantera» del Circuito.' },
				{ cond: 'flag.b01_rhi_vencida_1 || beat("rhi_1")', text: 'Su compañero de siempre es **Scorbunny**: rápido, tipo Fuego.' },
				{ cond: 'beat("rhi_2")', text: 'Último equipo: Raboot, Corvisquire, Farfetch\'d de Galar.' },
			],
		},
		rival_bastien: {
			name: 'Rival: Bastien', npc: 'bastien', cond: 'flag.b01_bastien_ruta5',
			info: [
				{ text: 'Novato de Luminalia patrocinado por Lemnis. Se quedó con **Froakie**.' },
				{ cond: 'beat("bastien_1")', text: 'Usa Froakie y Fletchling. Rápidos, pero frágiles.' },
				{ cond: 'beat("bastien_2")', text: 'Último equipo: Frogadier, Fletchinder, Litleo.' },
			],
		},
	},
	scripts: {
		usar_menu_kalos: [
			{ text: 'Abres el Menú de Kalos de Gaspar. Huele a mantequilla, a hierbas y a algo que no sabes nombrar.' },
			{ happy: { who: 'party0', n: 10 } }, { happy: { who: 'party1', n: 10 } }, { happy: { who: 'party2', n: 10 } },
			{ happy: { who: 'party3', n: 10 } }, { happy: { who: 'party4', n: 10 } }, { happy: { who: 'party5', n: 10 } },
			{ text: 'Tu equipo come con ganas. Se nota que os habéis acercado un poco más.' },
		],
	},
	milestones: [{ flag: 'b01_m_aviso', hoursLeft: 3 }],
};
