// Bloque 2 — elementos comunes: medallas, objetos propios, tiendas, retos, enganche de inicio y aviso de ritmo.
export default {
	badges: {
		medalla_colmena: { name: 'Medalla Colmena', type: 'Bug', desc: 'Circuito Infinito · Pueblo Azalea (Antón).' },
		medalla_niebla: { name: 'Medalla Niebla', type: 'Ghost', desc: 'Circuito Infinito · Ciudad Iris (Morti).' },
	},
	items: {
		regaderaardilla: { name: 'Regadera Ardilla', pocket: 'key', desc: 'Una regadera con forma de Squirtle (que en Johto todos llaman «ardilla»). Al que no es planta, le sienta fatal.' },
		fragmentored: { name: 'Fragmento de la red', pocket: 'key', desc: 'Un trozo de metal oscuro con vetas que brillan en azul y plata. Está tibio. Zumba, muy bajito, si lo acercas al oído.' },
		caramelolazo: { name: 'Caramelo Lazo', pocket: 'key', desc: 'Regalo de la Gira, «patrocinado por Lemnis». Promete «estrechar el vínculo al instante». Envoltorio azul y plata. Huele demasiado dulce.' },
		menujohto: { name: 'Menú de Johto', pocket: 'medicine', cost: 0, desc: 'Los dulces de Iris de Gaspar. Al compartirlos, la amistad de todo tu equipo aumenta.', use: 'usar_menu_johto' },
		cartanoa: { name: 'Carta de Noa', pocket: 'key', desc: 'Una carta escrita a mano, con la letra redonda de Noa Lambert.', read: 'Si estás leyendo esto, es que lo has aceptado. Gracias.\n\nSe llama como tú quieras, pero yo le decía «Escarcha». No le gusta el calor. No le gustan las jaulas. A mí tampoco, ya.\n\nEn su etiqueta ponía «Destino: por asignar». He buscado en el sistema adónde van los que tienen esa etiqueta. Solo sale un código: N-02. No sé qué es N-02. No hay ninguna región que se llame así.\n\nCuídalo. Y si alguien te pregunta, yo no te he dado nada.\n\n— N.' },
		recetapanmuerto: { name: 'Receta del pan de muerto', pocket: 'key', desc: 'Una hoja doblada en cuatro, con manchas de mantequilla y letra temblorosa.', read: '**Pan de muerto de la abuela Remedios**\n\nHarina, mantequilla, huevo, azúcar, levadura, ralladura de naranja y un chorrito de agua de azahar. Las cantidades «a ojo, mijo, como todo lo importante».\n\nSe amasa con paciencia. Los huesitos se ponen encima en cruz, y la bolita en medio es la lágrima.\n\nAbajo, con otra tinta: *Acuérdate de lo que le gustaba, y ponlo en algún sitio. Así se queda.*' },
		mt_pulsoumbrio: { name: 'MT Pulso Umbrío', pocket: 'machines', tm: 'darkpulse', desc: 'Una onda horrible y oscura. Puede hacer retroceder al objetivo.' },
		mt_ida_vuelta: { name: 'MT Ida y Vuelta', pocket: 'machines', tm: 'uturn', desc: 'Ataca y vuelve rápidamente para dar paso a otro Pokémon del equipo.' },
		mt_bola_sombra: { name: 'MT Bola Sombra', pocket: 'machines', tm: 'shadowball', desc: 'Lanza una masa oscura. Puede bajar la Defensa Especial del objetivo.' },
	},
	shops: {
		centro_comercial_trigal: { name: 'Centro Comercial de Trigal', items: [
			'pokeball', 'greatball', 'ultraball', 'superpotion', 'hyperpotion', 'revive', 'fullheal', 'escaperope', 'superrepel', 'maxrepel',
			'xattack', 'xdefense', 'xspatk', 'xspdef', 'xspeed', 'pokedoll', 'sweetheart',
			{ id: 'mt_ida_vuelta', price: 10000 }, { id: 'luxuryball', cond: 'badges >= 4' }, { id: 'maxpotion', cond: 'badges >= 5' },
		] },
		tienda_iris: { name: 'Tienda de Iris', items: [
			'pokeball', 'greatball', 'ultraball', 'hyperpotion', 'revive', 'fullheal', 'duskball', 'spelltag', 'cleansetag',
			{ id: 'mt_bola_sombra', price: 10000, cond: 'badges >= 5' },
		] },
	},
	challenges: {
		gym_azalea: {
			name: 'Gimnasio de Pueblo Azalea', npc: 'anton', trainer: 'anton_g4', type: 'Bug', rec: 36,
			cond: 'flag.b02_puerta_cruzada',
			info: [
				{ text: 'Líder: **Antón**, tipo **Bicho**. Investigador de Pokémon bicho.' },
				{ cond: 'visited("azalea")', text: '4 Pokémon, niveles 33 a 36.' },
				{ cond: 'visited("gym_azalea")', text: 'Los tipos **Fuego**, **Volador** y **Roca** le van muy bien. Un Pokémon de tipo Acero aguanta casi todo lo suyo.' },
				{ cond: 'beat("anton_g4")', text: '✔ Medalla Colmena conseguida.' },
			],
		},
		gym_iris: {
			name: 'Gimnasio de Ciudad Iris', npc: 'morti', trainer: 'morti_g5', type: 'Ghost', rec: 39,
			cond: 'flag.b02_trigal_hecho',
			info: [
				{ text: 'Líder: **Morti**, tipo **Fantasma**. Dicen que ve cosas que nadie más ve.' },
				{ cond: 'visited("iris")', text: '4 Pokémon, niveles 36 a 39.' },
				{ cond: 'visited("gym_iris")', text: 'Los ataques de tipo **Lucha** y **Normal** no le hacen nada. **Siniestro** y **Fantasma** le hacen mucho daño. Un **Acero** aguanta bien todo lo que no sea Fantasma.' },
				{ cond: 'beat("morti_g5")', text: '✔ Medalla Niebla conseguida.' },
			],
		},
		revanchas_kalos: {
			name: 'Revanchas del Circuito (Kalos)', npc: 'brock', type: 'Normal', rec: 37,
			cond: 'flag.b02_inicio_hecho',
			info: [
				{ text: 'Nueva temporada: los líderes que ya venciste aceptan una **revancha** opcional, una vez. Mismo gimnasio, equipo nuevo.' },
				{ text: '**Brock** (Novarte), **Blanca** (Relieve) y **Corelia** (Yantra). Niveles 35 a 38.' },
				{ cond: 'beat("brock_r2")', text: '✔ Revancha de Brock ganada.' },
				{ cond: 'beat("blanca_r2")', text: '✔ Revancha de Blanca ganada.' },
				{ cond: 'beat("corelia_r2")', text: '✔ Revancha de Corelia ganada.' },
			],
		},
		rival_rhi_johto: {
			name: 'Rival: Rhi (Johto)', npc: 'rhi', trainer: 'rhi_3', type: 'Fire', rec: 37,
			cond: 'flag.b02_trigal_llegada',
			info: [
				{ text: 'Llegó a Johto a tiempo. Tiene ganas de recordártelo.' },
				{ cond: 'beat("rhi_3")', text: 'Ya la venciste en Johto. Se lo ha tomado como algo personal. Como todo.' },
			],
		},
		rival_bastien_johto: {
			name: 'Rival: Bastien (Johto)', npc: 'bastien', trainer: 'bastien_3', type: 'Water', rec: 38,
			cond: 'flag.b02_trigal_llegada',
			info: [
				{ text: 'Bastien está en la Gira.' },
				{ cond: 'beat("bastien_3")', text: 'Ya lo venciste en Johto.' },
			],
		},
	},
	scripts: {
		usar_menu_johto: [
			{ text: 'Abres el Menú de Johto de Gaspar. Huele a castaña asada, a miel y a té verde.' },
			{ happy: { who: 'party0', n: 10 } }, { happy: { who: 'party1', n: 10 } }, { happy: { who: 'party2', n: 10 } },
			{ happy: { who: 'party3', n: 10 } }, { happy: { who: 'party4', n: 10 } }, { happy: { who: 'party5', n: 10 } },
			{ text: 'Tu equipo come despacio, como si quisiera que durara. Se nota que se han acercado un poco más.' },
		],
	},
	// Enganche del inicio: el jugador termina el B1 en Yantra
	patches: {
		yantra: {
			spots: [
				{ label: '📣 La Gira Interregional', sub: 'Rotom no para de vibrar', icon: '📣', cond: 'flag.b01_fin && !flag.b02_inicio_hecho', new: 'flag.b01_fin && !flag.b02_inicio_hecho', script: 'b02_inicio' },
			],
			onEnter: [{ script: 'b02_inicio', cond: 'flag.b01_fin && !flag.b02_inicio_hecho', once: true }],
		},
		luminalia: {
			onEnter: [{ script: 'b02_inicio', cond: 'flag.b01_fin && !flag.b02_inicio_hecho', once: true }],
		},
	},
	milestones: [{ flag: 'b02_m_aviso', hoursLeft: 3 }],
};
