// Bloque 3 · Tramo 1: «La luz del faro» (~3 h 30).
// Trigal (gimnasio de intercambio: Lila y Sylveon, Corelia; Renata y el sótano de la estación)
// → Rutas 38 y 39 (Granja MuuMuu) → Ciudad Olivo (Faro, Amphy, Kaori, Noa, Ysolde, Bastien, Rhi, Gimnasio de Yasmina).
// Final: tras Yasmina y Noa, b03_m2 hecha, b03_m5 a «rancho» y flag.b03_llamada_sobrina (la llamada la escribe T2).

// ---------- Condiciones reutilizadas ----------
const RL = '(inParty("riolu") || inParty("lucario"))';
const INICIO = 'flag.b03_ruinas_hecho';
const GYM_T = INICIO + ' && flag.b03_lila_hecho';
const FARO_AMIGO = 'flag.b02_ampharos && inParty("ampharos")';
const SOTANO_PISTAS = 'flag.b03_pista_taza && flag.b03_pista_calendario && flag.b03_pista_cajon';
const FIN_OK = 'beat("yasmina_g7") && flag.b03_noa_hecho && !flag.b03_llamada_sobrina';

export default {
	// =====================================================================
	// LUGARES NUEVOS
	// =====================================================================
	locations: {
		// ---------- Sótano de la estación (Trigal) ----------
		sotano_estacion: {
			name: 'Sótano de la estación', parent: 'trigal', kind: 'building',
			bg: { type: 'indoor', wall: '#4a4f6a', floor: '#2b2b38' },
			desc: 'Detrás del cuarto de contadores, al otro lado de una pared que alguien levantó con prisa, hay un pasillo estrecho que huele a polvo y a aceite viejo. Al fondo, una puerta de chapa con una placa atornillada: «**M. OLMEDO · DISEÑO**».\n\nDentro, un despacho pequeño. Un escritorio, una silla, un calendario, una taza. Todo quieto desde hace doce años.',
			descs: [{ cond: 'flag.b03_renata_deduccion', text: 'El despacho de Matías Olmedo. Ahora con la luz encendida parece más pequeño. Renata ha dejado una grabadora encima del escritorio, apagada, como quien deja una flor.' }],
			mapNote: 'Despacho de M. Olmedo',
			spots: [
				{ label: 'La taza del escritorio', sub: 'Blanca, con un dibujo hecho por un niño', icon: '☕', new: '!flag.b03_pista_taza', talk: [{ script: 'b03_pista_taza' }] },
				{ label: 'El calendario de la pared', sub: 'De hace doce años', icon: '📅', new: '!flag.b03_pista_calendario', talk: [{ script: 'b03_pista_calendario' }] },
				{ label: 'Los cajones del escritorio', sub: 'Uno no cierra del todo', icon: '🗄️', new: '!flag.b03_pista_cajon', talk: [{ cond: '!flag.b03_pista_cajon', script: 'b03_pista_cajon' }, { script: 'b03_cajon_vacio' }] },
				{ label: 'Renata', sub: 'Te mira. Espera tu teoría', icon: '🎙️', cond: SOTANO_PISTAS + ' && !flag.b03_renata_deduccion', new: 'true', talk: [{ script: 'b03_renata_deduccion' }] },
				{ label: 'Renata', sub: 'Escribe en una libreta, muy rápido', icon: '🎙️', cond: '!(' + SOTANO_PISTAS + ') && !flag.b03_renata_deduccion', talk: [{ script: 'b03_renata_sotano_espera' }] },
				{ label: 'Renata', sub: 'Guarda la grabadora', icon: '🎙️', cond: 'flag.b03_renata_deduccion', talk: [{ script: 'b03_renata_despues' }] },
			],
		},

		// =================== RUTAS 38 Y 39 ===================
		ruta38: {
			name: 'Rutas 38 y 39', short: 'Rutas 38-39', region: 'johto', kind: 'route', map: { x: 30, y: 14 },
			bg: { type: 'route', flowers: '#e9e3d0', hill: '#7a9a5a', far: '#8ab0c8' },
			desc: 'Al oeste de Iris, el camino baja entre prados con vallas blancas hacia el mar. Huele a hierba, a leche y, al final, a sal. A medio camino, un desvío lleva a la **Granja MuuMuu**.\n\nAl fondo, en un cabo, se ve la torre blanca del **Faro de Olivo**. De día parece un faro. De noche debería parecerlo más.',
			descNight: 'De noche, los prados están negros y el mar también. En el cabo, el Faro de Olivo apenas se distingue: una torre pálida, sin luz arriba. Los barcos tocan la sirena al pasar, por si acaso.',
			descs: [{ cond: 'flag.b03_faro_hecho', text: 'Al oeste de Iris, prados con vallas blancas que bajan hacia el mar. Al fondo, en el cabo, el **Faro de Olivo** vuelve a girar. Despacio. Con una luz que se ve, aunque no tanto como antes.' }],
			links: ['iris', 'olivo'],
			enterCond: 'beat("corelia_g6")',
			blockedMsg: 'En la salida oeste de Iris hay un cartel de la Gira: «**Etapa siguiente: Ciudad Trigal** (gimnasio de intercambio). Las Rutas 38 y 39 se abrirán a los participantes con seis medallas del Circuito». Debajo, un guardia que bosteza.',
			mapNote: 'Granja MuuMuu',
			rumors: [
				{ text: 'En la Granja MuuMuu hacen la mejor leche de Johto. Este mes no hay. Dicen que la Miltank que la daba está pachucha.' },
				{ text: 'La luz del Faro de Olivo lleva semanas apagándose. Primero un poco. Luego más. Ahora, casi nada.' },
				{ cond: 'flag.b03_faro_hecho', text: 'Dicen que el Faro de Olivo vuelve a dar luz. Poca. Los marineros dicen que es poca pero honrada.' },
			],
			route: {
				from: 'iris', to: 'olivo', length: 9, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [{ text: 'Las últimas tejas rojas de Iris quedan atrás. El camino baja entre arces hacia unos prados de un verde que casi duele.' }],
					1: [
						{ trainer: 'r38_ezequiel' },
						{ text: 'Un Tauros mira la valla desde el otro lado. Normalmente la embestiría. Hoy solo la mira.' },
					],
					2: [
						{ spot: { action: { gather: 'bayas_r38' } }, label: 'Arbustos de bayas junto a la valla', icon: '🫐', sub: 'Los Miltank no llegan. Tú sí' },
						{ item: 'ultraball' },
					],
					3: [
						{ trainer: 'r38_barbara' },
						{ item: 'tinymushroom', hidden: true },
					],
					4: [
						{ text: 'Un cartel de madera con una vaca pintada, muy sonriente: «**Granja MuuMuu** · Leche fresca · Por aquí →». Debajo, más pequeño, en tiza: «Este mes no hay leche. Lo sentimos».' },
						{ branch: { label: 'Ir a la Granja MuuMuu', sub: 'Un camino de tierra entre vallas blancas', go: 'granja_muumuu' } },
					],
					5: [
						{ trainer: 'r38_leocadio', optional: true, label: 'Un caballero mira el cabo con unos prismáticos y suspira' },
						{ item: 'hyperpotion' },
					],
					6: [
						{ terrain: 'path' },
						{ text: 'El camino gira hacia el sur. Ya se oye el mar. Una gaviota, o un Wingull, pasa tan bajo que te despeina.' },
						{ item: 'revive', hidden: true },
					],
					7: [{ trainer: 'r38_constanza' }],
					8: [
						{ terrain: 'sand' },
						{ trainer: 'r39_patricio' },
						{ text: 'Desde lo alto de la cuesta se ve todo: el puerto de Olivo, los barcos quietos, las casas blancas y, en el cabo, el Faro. Sin luz.' },
					],
					9: [{ text: 'Las primeras calles de **Ciudad Olivo**: empedradas, en cuesta, con olor a pescado y a pan. Las farolas del paseo están encendidas. Arriba del todo, la del Faro no.' }],
				},
				encounters: {
					grass: [
						{ sp: 'raticate', lv: [38, 40], w: 16 },
						{ sp: 'granbull', lv: [39, 41], w: 14 },
						{ sp: 'persian', lv: [39, 41], w: 12 },
						{ sp: 'magneton', lv: [39, 41], w: 10 },
						{ sp: 'luxio', lv: [38, 40], w: 12 },
						{ sp: 'plusle', lv: [38, 40], w: 8 },
						{ sp: 'minun', lv: [38, 40], w: 8 },
						{ sp: 'farfetchd', lv: [39, 41], w: 8 },
						{ sp: 'noctowl', lv: [40, 42], w: 10, time: 'night' },
						{ sp: 'miltank', lv: [40, 42], w: 5 },
						{ sp: 'tauros', lv: [41, 43], w: 3 },
						{ sp: 'dubwool', lv: [39, 41], w: 6, displaced: true },
						{ sp: 'boltund', lv: [39, 41], w: 4, displaced: true, time: 'night' },
					],
				},
			},
		},

		// ---------- Granja MuuMuu ----------
		granja_muumuu: {
			name: 'Granja MuuMuu', short: 'Granja MuuMuu', region: 'johto', kind: 'area', map: { x: 20, y: 8 },
			bg: { type: 'ranch' },
			desc: 'Un establo rojo, un silo, una casa con geranios en las ventanas y un prado lleno de Miltank que rumian mirando al horizonte. Huele a heno y a leche.\n\nEn el establo, sobre un lecho de paja limpia, una Miltank no se levanta.',
			descs: [{ cond: 'flag.b03_muumuu_hecho', text: 'La Granja MuuMuu. Las Miltank rumian en el prado. En el establo, una de ellas está de pie, aunque se apoya en la pared. Sobre la puerta, alguien ha escrito en tiza: «Hoy sí hay leche. Poca».' }],
			links: ['ruta38'],
			mapNote: 'Leche Mu-mu · Miltank enferma',
			rumors: [
				{ text: 'El matrimonio de la granja lleva cuarenta años ordeñando a mano. Dicen que la leche sabe distinta si le cantas a la Miltank. Ellos no cantan bien. Sabe igual de rica.' },
			],
			spots: [
				{ label: 'La granjera', sub: 'Sale del establo con un cubo vacío', icon: '👩‍🌾', new: '!flag.b03_muumuu_hecho', talk: [{ cond: '!flag.b03_muumuu_hecho', script: 'b03_muumuu' }, { script: 'b03_muumuu_despues' }] },
				{ label: 'Canela, la Miltank del establo', sub: 'Tumbada en la paja', icon: '🐄', talk: [{ cond: 'flag.b03_muumuu_hecho', script: 'b03_canela_despues' }, { script: 'b03_canela' }] },
				{ label: 'Puesto de la granja', sub: 'Leche Mu-mu en botellas de cristal', icon: '🥛', cond: 'flag.b03_muumuu_hecho', action: { shop: 'tienda_muumuu' } },
				{ label: 'Pajar del establo', icon: '🌾', action: { gather: 'pajar_muumuu' } },
			],
		},

		// =================== CIUDAD OLIVO ===================
		olivo: {
			name: 'Ciudad Olivo', short: 'Olivo', region: 'johto', kind: 'city', map: { x: 8, y: 24 },
			bg: { type: 'coast', roofs: ['#e9e3d0', '#3b5bb5', '#c4473a', '#e9e3d0'] },
			desc: 'Una ciudad de puerto, blanca y en cuesta, con calles que bajan todas hacia el mar. Redes secándose al sol, gaviotas, un mercado de pescado que grita desde las seis de la mañana.\n\nEn el cabo, el **Faro de Olivo**: una torre blanca altísima que se ve desde todas partes. Arriba, donde debería girar la luz, solo hay cristal oscuro.',
			descNight: 'De noche, Olivo enciende todas sus farolas, como si quisiera compensar. En el cabo, el Faro es una sombra. Los barcos entran despacio, tocando la sirena, guiándose por las luces del paseo.',
			descs: [
				{ cond: 'flag.b03_faro_hecho && night', text: 'De noche, el haz del **Faro de Olivo** barre el puerto otra vez: despacio, más débil que antes, pero barre. Cada vez que pasa por encima del mercado, alguien levanta la vista. Por costumbre. Por alivio.' },
				{ cond: 'flag.b03_faro_hecho', text: 'Olivo ha vuelto a su ruido de siempre: redes, gaviotas, el mercado. En el cabo, la luz del **Faro** gira incluso de día, débil, como quien se pone de pie para demostrar que puede.\n\nEl **Gimnasio** tiene la puerta abierta.' },
			],
			links: ['ruta38'],
			mapNote: 'Faro · Puerto · Gimnasio (Yasmina)',
			onEnter: [
				{ script: 'b03_olivo_llegada', cond: '!flag.b03_olivo_llegada', once: true },
				{ script: 'b03_t1_fin', cond: FIN_OK },
			],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda de Olivo', action: { shop: 'tienda_olivo' } },
				{ label: 'Faro de Olivo', sub: 'La torre blanca del cabo', icon: '🗼', action: { go: 'faro_olivo' }, new: '!flag.b03_yasmina_faro || (quest.b03_t_kaori == "olivo" && !flag.b03_faro_hecho)' },
				{ label: 'Tejado de la vieja aduana', sub: 'Una veleta con forma de pájaro', icon: '🪶', cond: 'flag.b03_ysolde_sede', action: { go: 'sede_vencejos' } },
				{ label: 'Puerto', sub: 'Muelles, barcos y una cabina telefónica', icon: '⚓', action: { go: 'puerto_olivo' }, new: '!flag.b03_noa_hecho && flag.b03_olivo_llegada' },
				{ label: 'Gimnasio de Olivo', sub: 'Puerta cerrada. Un cartel escrito a mano', icon: '🔒', cond: '!flag.b03_faro_hecho', talk: [{ script: 'b03_gym_olivo_cerrado' }] },
				{ label: 'Gimnasio de Olivo', sub: 'Líder: Yasmina (Acero)', icon: '⚙️', cond: 'flag.b03_faro_hecho', action: { go: 'gym_olivo' }, new: '!beat("yasmina_g7")' },
				{ label: 'Una boticaria con una maleta de frascos', sub: 'Acaba de bajar del autobús de Iris. Bosteza', icon: '🧪', cond: 'quest.b03_t_kaori == "olivo"', new: 'true', talk: [{ script: 'b03_kaori_faro' }] },
				{ label: 'Rotom: ¿qué me queda?', sub: 'Repasa lo pendiente en Olivo', icon: '📱', cond: 'flag.b03_olivo_llegada && !flag.b03_llamada_sobrina', talk: [{ script: 'b03_olivo_pendiente' }] },
				{ label: 'Salir de Olivo', sub: 'El Faro alumbra. Es hora de seguir', icon: '🧭', cond: FIN_OK, new: 'true', talk: [{ script: 'b03_t1_fin' }] },
			],
			rumors: [
				{ text: 'La líder del gimnasio no baja del Faro. Dicen que no come, que no duerme, que le habla al Ampharos toda la noche, bajito.' },
				{ text: 'De madrugada atraca un barco sin bandera en el muelle tres. Descarga cajas azules y se va antes de que amanezca. Nadie pregunta. Pagan bien el amarre.' },
				{ text: 'En el puerto hay una cabina telefónica de las de antes. Dicen que la usan los que no quieren que su Pokédex se entere de con quién hablan.' },
				{ cond: 'flag.b03_faro_hecho', text: 'Una boticaria de Iris subió al Faro con una maleta de frascos y bajó sin decir nada. Desde entonces hay luz. Los marineros la invitan a vino. Ella dice que no bebe nada que no haya analizado.' },
			],
		},

		// ---------- Faro de Olivo ----------
		faro_olivo: {
			name: 'Faro de Olivo', parent: 'olivo', kind: 'building',
			bg: { type: 'tower' },
			desc: 'Una escalera de caracol que sube y sube, con ventanucos que dan al mar. Arriba del todo, la sala de la linterna: una lente enorme de cristal tallado, quieta, y en el centro, sobre una manta, un **Ampharos** tumbado con la cola apagada.\n\nA su lado, sentada en el suelo, una chica de pelo largo le acaricia la cabeza.',
			descs: [
				{ cond: 'flag.b03_faro_hecho', text: 'La sala de la linterna. La lente gira despacio. En el centro, **Amphy** está de pie, con la cola encendida: una luz pálida, como la de una vela detrás de un papel. Pero encendida.\n\nYasmina ya no está sentada en el suelo. Hay una silla. Y una taza de té a medio beber.' },
			],
			mapNote: 'Amphy · la sala de la linterna',
			spots: [
				{ label: 'La chica del Ampharos', sub: 'Habla tan bajito que casi no se oye', icon: '🌙', new: '!flag.b03_yasmina_faro', talk: [
					{ cond: '!flag.b03_yasmina_faro', script: 'b03_yasmina_faro' },
					{ cond: 'flag.b03_faro_hecho', script: 'b03_yasmina_faro_despues' },
					{ script: 'b03_yasmina_faro_espera' },
				] },
				{ label: 'Amphy', sub: 'El Ampharos del Faro', icon: '💡', talk: [{ cond: 'flag.b03_faro_hecho', script: 'b03_amphy_despues' }, { script: 'b03_amphy' }] },
				{ label: 'La bitácora del farero', sub: 'Un cuaderno gordo sobre una mesita', icon: '📓', cond: 'flag.b03_yasmina_faro', new: '!has("bitacorafaro")', talk: [{ cond: '!has("bitacorafaro")', script: 'b03_bitacora' }, { script: 'b03_bitacora_ya' }] },
				{ label: 'Una pluma gris en la barandilla', sub: 'Clavada hacia el tejado de enfrente', icon: '🪶', cond: 'flag.b03_yasmina_faro && !flag.b03_ysolde_sede', new: 'true', talk: [{ script: 'b03_ysolde_sede' }] },
				{ label: 'Mirar el mar desde la linterna', sub: 'Se ve toda la costa', icon: '🌊', talk: [{ cond: 'flag.b03_faro_hecho && night && !has("fotofaro")', script: 'b03_faro_noche' }, { script: 'b03_faro_mirar' }] },
			],
		},

		// ---------- Sede de los Vencejos (tejado de la vieja aduana) ----------
		sede_vencejos: {
			name: 'Tejado de la vieja aduana', parent: 'olivo', kind: 'area',
			bg: { type: 'city', roofs: ['#e9e3d0', '#8a7a5a', '#4a4f6a'], far: '#3b5bb5' },
			desc: 'Un tejado de tejas viejas junto al Faro, con una veleta oxidada en forma de pájaro y un palomar abandonado. Desde aquí se ve todo Olivo: el puerto, el muelle tres, las calles en cuesta.\n\nEn las vigas del palomar hay plumas grises clavadas en fila. Muchas. Algunas, muy viejas.',
			mapNote: 'Los Vencejos',
			spots: [
				{ label: 'Ysolde', sub: 'Sentada en la veleta. Como en un banco', icon: '🪶', talk: [{ script: 'b03_ysolde_despues' }] },
				{ label: 'Las plumas del palomar', sub: 'Cada una con una fecha grabada', icon: '🕊️', talk: [{ script: 'b03_plumas_palomar' }] },
			],
		},

		// ---------- Puerto de Olivo ----------
		puerto_olivo: {
			name: 'Puerto de Olivo', parent: 'olivo', kind: 'area',
			bg: { type: 'coast' },
			desc: 'Muelles de madera, cajas de pescado, grúas y barcos que crujen. Al fondo, el muelle tres, más nuevo que los demás, con una valla azul y plata. Junto al paseo, una **cabina telefónica** roja de las de antes, con el cristal rayado.\n\nEl agua es fría y muy clara. Se ven estrellas de mar en el fondo. Algunas se mueven.',
			mapNote: 'Muelle (entrenamiento, nivel 45) · Cabina',
			encounters: {
				water: [
					{ sp: 'tentacool', lv: [38, 40], w: 30 },
					{ sp: 'tentacruel', lv: [40, 42], w: 12 },
					{ sp: 'krabby', lv: [38, 40], w: 18 },
					{ sp: 'kingler', lv: [40, 42], w: 8 },
					{ sp: 'corsola', lv: [39, 41], w: 12 },
					{ sp: 'staryu', lv: [39, 41], w: 10, time: 'night' },
					{ sp: 'starmie', lv: [41, 43], w: 4, time: 'night' },
					{ sp: 'finizen', lv: [38, 40], w: 6, displaced: true },
				],
			},
			spots: [
				{ label: 'Bajo el muelle dos', sub: 'Alguien te hace una seña desde las sombras', icon: '📋', cond: '!flag.b03_noa_hecho', new: 'true', talk: [{ script: 'b03_noa_muelle' }] },
				{ label: 'Una cabina telefónica', sub: 'Dentro, una chaqueta con el 9', icon: '☎️', cond: '!flag.b03_rhi_cabina', new: 'true', talk: [{ script: 'b03_rhi_cabina' }] },
				{ label: 'Rhi', sub: 'Sentada en un bolardo, dando toques a una Poké Ball', icon: '⚽', cond: 'flag.b03_rhi_cabina && !beat("rhi_4")', talk: [{ script: 'b03_rhi_revancha' }] },
				{ label: 'Rhi', sub: 'Mira el mar con las manos en los bolsillos', icon: '⚽', cond: 'beat("rhi_4")', talk: [{ script: 'b03_rhi_despues' }] },
				{ label: 'Bastien', sub: 'En el muelle, con su libreta de tapas de cuero', icon: '📒', new: '!flag.b03_bastien_olivo', talk: [{ cond: '!flag.b03_bastien_olivo', script: 'b03_bastien_olivo' }, { cond: '!beat("bastien_4")', script: 'b03_bastien_revancha' }, { script: 'b03_bastien_despues' }] },
				{ label: 'El muelle tres', sub: 'Valla azul y plata. Un guardia aburrido', icon: '🚧', talk: [{ script: 'b03_muelle_tres' }] },
				{ label: 'Pescar desde el muelle', sub: 'El agua está fría y muy clara', icon: '🎣', action: { explore: 'water' } },
				{ label: 'Orilla de las rocas', icon: '🐚', action: { gather: 'orilla_olivo' } },
				{ label: 'Muelle de entrenamiento', sub: 'Zona de entrenamiento (nivel recomendado 45)', icon: '🥋', action: { training: {
					cap: 45, trainers: ['olivo_muelle_1', 'olivo_muelle_2', 'olivo_muelle_3'], coach: 'Contramaestre del muelle',
					wild: [{ sp: 'tentacruel', lv: [41, 43] }, { sp: 'kingler', lv: [41, 43] }, { sp: 'pelipper', lv: [41, 43] }],
					closed: 'El contramaestre te mira el equipo, se rasca la barba y señala el horizonte. «Aquí ya no vas a aprender nada, chaval. El mar te queda pequeño. Bueno, el muelle».',
				} } },
			],
		},

		// ---------- Gimnasio de Olivo ----------
		gym_olivo: {
			name: 'Gimnasio de Olivo', parent: 'olivo', kind: 'gym',
			bg: { type: 'gym' },
			desc: 'Un gimnasio sobrio de suelo de metal pulido, tan brillante que te ves reflejad{o|a|e} al andar. Las paredes son de acero remachado, como el casco de un barco. Huele a aceite limpio y, por algún motivo, a té de jazmín.\n\nAl fondo, en una tarima, una tetera humea junto a un cojín.',
			mapNote: 'Líder: Yasmina (Acero)',
			spots: [
				{ label: 'Entrenador: Caballero Gregorio', icon: '🎩', action: { trainer: 'gym_olivo_1' } },
				{ label: 'Entrenadora: Dama Amalia', icon: '🌂', action: { trainer: 'gym_olivo_2' } },
				{ label: 'Yasmina', sub: 'Líder · tipo Acero', icon: '⚙️', cond: 'beat("gym_olivo_1") && beat("gym_olivo_2")', new: '!beat("yasmina_g7")', talk: [{ cond: 'beat("yasmina_g7")', script: 'b03_yasmina_despues' }, { script: 'b03_yasmina_reto' }] },
				{ label: 'Yasmina', sub: 'Sirve té. Te mira de reojo', icon: '🍵', cond: '!(beat("gym_olivo_1") && beat("gym_olivo_2"))', talk: [{ script: 'b03_yasmina_antes' }] },
			],
		},
	},

	// =====================================================================
	// PARCHES (lugares del B2)
	// =====================================================================
	patches: {
		trigal: {
			onEnter: [{ script: 'b03_trigal_vuelta', cond: INICIO + ' && !flag.b03_trigal_vuelta', once: true }],
			spots: [
				{ label: 'Gimnasio de Trigal', sub: 'Abierto · Líder de intercambio: Corelia', icon: '🛼', cond: INICIO, action: { go: 'gym_trigal' }, new: '!beat("corelia_g6") || (beat("corelia_g6") && !flag.b03_lila_momento)' },
			],
			rumors: [
				{ cond: INICIO, text: 'El gimnasio de intercambio por fin abre. La líder llega de Kalos en patines. Dicen que entra por la puerta sin frenar y que la puerta ya tiene una abolladura.' },
				{ cond: INICIO, text: 'Una chica de Teselia con gabardina mostaza pregunta en la estación por el «cuarto de contadores». Nadie pregunta por el cuarto de contadores.' },
			],
		},
		gym_trigal: {
			name: 'Gimnasio de Trigal',
			mapNote: 'Gimnasio de intercambio del Circuito',
			onEnter: [{ script: 'b03_lila_gym', cond: INICIO + ' && !flag.b03_lila_hecho', once: true }],
			descs: [
				{ cond: 'beat("corelia_g6")', text: 'El gimnasio de intercambio de Trigal, terminado: suelo de parqué con líneas recién pintadas (la de la izquierda tiene huellas de Eevee, y ya nadie las va a borrar), rampas de patinaje en las esquinas y una bandera de la Torre Maestra colgada del techo.\n\nEn la grada, a veces, Sylveon duerme con las cintas enrolladas en la barandilla.' },
				{ cond: INICIO, text: 'Ya no hay andamios. El suelo es de parqué, con las líneas del campo pintadas a mano (la de la izquierda tiene huellas de Eevee). En las esquinas, rampas de patinaje. Del techo cuelga una bandera de la Torre Maestra y un cartel: «**Gimnasio de intercambio · Líder: Corelia (Kalos) · ¡A TOPE!**».' },
			],
			spots: [
				{ label: 'Lila', sub: 'Alguien le grita en el centro del campo', icon: '🌸', cond: INICIO + ' && !flag.b03_lila_hecho', new: 'true', talk: [{ script: 'b03_lila_gym' }] },
				{ label: 'Entrenadora: Patinadora Valeria', icon: '🛼', cond: GYM_T, action: { trainer: 'gym_trigal_1' } },
				{ label: 'Entrenador: Cinturón Negro Marcelo', icon: '🥋', cond: GYM_T, action: { trainer: 'gym_trigal_2' } },
				{ label: 'Corelia', sub: 'Líder de intercambio · tipo Lucha', icon: '🛼', cond: GYM_T + ' && beat("gym_trigal_1") && beat("gym_trigal_2")', new: '!beat("corelia_g6")', talk: [{ cond: 'beat("corelia_g6")', script: 'b03_corelia_despues' }, { script: 'b03_corelia_reto' }] },
				{ label: 'Corelia', sub: 'Da vueltas al campo en patines', icon: '🛼', cond: GYM_T + ' && !(beat("gym_trigal_1") && beat("gym_trigal_2"))', talk: [{ script: 'b03_corelia_antes' }] },
				{ label: 'Lila, en la grada', sub: 'Sylveon le ha enrollado una cinta en la muñeca', icon: '🎀', cond: 'beat("corelia_g6") && !flag.b03_lila_momento', new: 'true', talk: [{ script: 'b03_lila_momento' }] },
				{ label: 'Lila', sub: 'Repasa las líneas del campo con Sylveon', icon: '🎀', cond: GYM_T + ' && (!beat("corelia_g6") || flag.b03_lila_momento)', talk: [{ script: 'b03_lila_despues' }] },
			],
		},
		estacion_magnetica: {
			spots: [
				{ label: 'Renata', sub: 'Gabardina mostaza. Habla con el mecánico a toda velocidad', icon: '🎙️', cond: 'quest.b03_t_renata == "sotano" && !flag.b03_sotano_abierto', new: 'true', talk: [{ script: 'b03_renata_estacion' }] },
				{ label: 'Bajar al sótano', sub: 'Detrás del cuarto de contadores', icon: '🔦', cond: 'flag.b03_sotano_abierto', action: { go: 'sotano_estacion' } },
				{ label: 'Dámaso', sub: 'Engrasa una rueda. Esta vez silba', icon: '🔧', cond: 'flag.b03_renata_deduccion', talk: [{ script: 'b03_damaso_despues' }] },
			],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Gimnasio de Trigal -----
		gym_trigal_1: { name: 'Valeria', cls: 'Patinadora', ai: 3, iv: 22, bg: 'gym',
			team: [
				{ sp: 'hitmonlee', lv: 40, moves: ['highjumpkick', 'blazekick', 'knockoff', 'fakeout'], ability: 'reckless' },
				{ sp: 'medicham', lv: 41, moves: ['highjumpkick', 'zenheadbutt', 'icepunch', 'thunderpunch'], ability: 'purepower' },
			],
			intro: '¡Corelia nos ha enseñado a frenar! Bueno, a intentarlo. ¡Si me choco contigo, cuenta como ataque!',
			win: 'Frené. Tarde, pero frené. Eso es progreso.',
			look: { hair: 'ponytail', hairColor: '#e98aa8', outfit: '#3b5bb5', outfit2: '#f2b33d', skin: 1, acc: 'cap', mouth: 'grin' } },
		gym_trigal_2: { name: 'Marcelo', cls: 'Cinturón Negro', ai: 3, iv: 22, bg: 'gym',
			team: [
				{ sp: 'hitmontop', lv: 41, moves: ['triplekick', 'suckerpunch', 'rapidspin', 'closecombat'], ability: 'intimidate' },
				{ sp: 'scrafty', lv: 42, moves: ['highjumpkick', 'crunch', 'drainpunch', 'icepunch'], ability: 'moxie' },
			],
			intro: 'Me apunté a este gimnasio porque era de Lucha. Nadie me dijo que había que llevar patines. Llevo tres semanas cayéndome con dignidad. ¡Combate!',
			win: 'Me caigo hasta perdiendo. Pero con dignidad.',
			look: { hair: 'short', hairColor: '#2b2b38', outfit: '#e9e3d0', outfit2: '#2b2b38', skin: 3, acc: 'bandana', eyesStyle: 'sharp', mouth: 'flat' } },
		corelia_g6: { name: 'Corelia', cls: 'Líder', npc: 'corelia', ai: 4, iv: 29, reward: 4400, bg: 'gym', gimmick: 'mega', ace: 'lucario',
			team: [
				{ sp: 'mienshao', lv: 39, moves: ['fakeout', 'highjumpkick', 'uturn', 'poisonjab'], ability: 'innerfocus', nature: 'jolly', iv: 28 },
				{ sp: 'hawlucha', lv: 40, moves: ['flyingpress', 'xscissor', 'roost', 'poisonjab'], ability: 'limber', item: 'sitrusberry', nature: 'jolly', iv: 28 },
				{ sp: 'pangoro', lv: 40, moves: ['crunch', 'hammerarm', 'bulletpunch', 'circlethrow'], ability: 'ironfist', item: 'blackglasses', nature: 'adamant', iv: 28 },
				{ sp: 'machamp', lv: 41, moves: ['brickbreak', 'knockoff', 'rockslide', 'icepunch'], ability: 'guts', item: 'oranberry', nature: 'adamant', iv: 29 },
				{ sp: 'lucario', lv: 43, moves: ['forcepalm', 'flashcannon', 'bonerush', 'quickattack'], ability: 'justified', item: 'lucarionite', nature: 'hardy', iv: 28 },
			],
			items: [],
			intro: '¡Gimnasio nuevo, región nueva, rival de siempre! ¡Lucario y yo llevamos semanas esperando esto! ¡Respondamos al vínculo! ¡A TOPEEE!',
			win: '¡Uaaah! ¡Me tiemblan las ruedas! ¡Y el suelo! ¡Y eso que el suelo es nuevo!',
			lose: '¡A tope hasta el final! Descansa, vuelve y vuelve a caer, que para eso están las rampas.' },

		// ----- Rutas 38 y 39 -----
		r38_ezequiel: { name: 'Ezequiel', cls: 'Ranchero', ai: 2,
			team: [{ sp: 'miltank', lv: 41, moves: ['bodyslam', 'rollout', 'milkdrink', 'zenheadbutt'] }, { sp: 'tauros', lv: 42, moves: ['zenheadbutt', 'takedown', 'rockslide', 'payback'] }],
			intro: 'Mis Tauros llevan una semana sin embestir la valla. Eso, en un Tauros, es para llamar al médico. ¡A ver si un combate los espabila!',
			win: 'Ni con un combate. Mañana llamo al médico. O a la boticaria esa de Iris, que dicen que sabe.',
			look: { hair: 'cap', hairColor: '#8a5a2f', outfit: '#8a5a2f', outfit2: '#e9e3d0', skin: 3, acc: 'mustache', mouth: 'grin' } },
		r38_barbara: { name: 'Bárbara', cls: 'Pokéfan', ai: 2,
			team: [{ sp: 'granbull', lv: 42, moves: ['playrough', 'crunch', 'firefang', 'bulkup'] }, { sp: 'clefable', lv: 42, moves: ['moonblast', 'meteormash', 'cosmicpower', 'metronome'] }],
			intro: 'Fui al Faro de Olivo a ver a Amphy y estaba a oscuras. Me volví llorando. Pero llorando con estilo. ¡Combate para animarme!',
			win: 'Ya estoy animada. Bueno, a medias. Como el Faro.',
			look: { hair: 'curly', hairColor: '#f2b33d', outfit: '#e98aa8', outfit2: '#ffffff', skin: 0, acc: 'bow', mouth: 'open' } },
		r38_leocadio: { name: 'Leocadio', cls: 'Caballero', ai: 2,
			team: [{ sp: 'persian', lv: 43, moves: ['slash', 'payback', 'feint', 'powergem'] }, { sp: 'magneton', lv: 42, moves: ['triattack', 'flashcannon', 'discharge', 'thunderwave'] }],
			intro: 'Me compré una casa en Olivo «con vistas al Faro». Ahora tengo vistas a una torre apagada. El agente era de Kalos y me hizo un truco de cartas al firmar. No le salió. Debí verlo venir.',
			win: 'Perder también tiene vistas. Feas, pero vistas.',
			look: { hair: 'short', hairColor: '#cfd6e2', outfit: '#2b2b38', outfit2: '#ffffff', skin: 1, acc: 'mustache tie', mouth: 'flat' } },
		r38_constanza: { name: 'Constanza', cls: 'Chica Moderna', ai: 2,
			team: [{ sp: 'farfetchd', lv: 42, moves: ['leafblade', 'aerialace', 'slash', 'knockoff'] }, { sp: 'plusle', lv: 41 }],
			intro: 'Trabajo de noche en el puerto. A las cuatro atraca un barco sin bandera, descarga cajas azules y se va. Mi jefe dice que no mire. Yo miro. ¡Combate!',
			win: 'Las cajas tienen un dibujito en una esquina. Como un ocho tumbado. Ya está, ya lo he dicho.',
			look: { hair: 'long', hairColor: '#2b2b38', outfit: '#f2b33d', outfit2: '#3b5bb5', skin: 2, acc: 'flower', mouth: 'smile' } },
		r39_patricio: { name: 'Patricio', cls: 'Marinero', npc: 'marinero', ai: 2,
			team: [{ sp: 'tentacruel', lv: 43, moves: ['sludgebomb', 'surf', 'bubblebeam', 'toxicspikes'] }, { sp: 'poliwrath', lv: 44, moves: ['waterfall', 'brickbreak', 'hypnosis', 'bodyslam'] }],
			intro: '¡Treinta años de marino y nunca había entrado a puerto sin la luz del Faro! Ahora entro a ojo. ¡Y a ojo también combato!',
			win: 'A ojo no se gana. Que vuelva la luz, por favor. Que vuelva.' },

		// ----- Gimnasio de Olivo -----
		gym_olivo_1: { name: 'Gregorio', cls: 'Caballero', ai: 3, iv: 22, bg: 'gym',
			team: [
				{ sp: 'magneton', lv: 43, moves: ['triattack', 'flashcannon', 'discharge', 'thunderwave'], ability: 'sturdy' },
				{ sp: 'klinklang', lv: 43, moves: ['geargrind', 'wildcharge', 'discharge', 'screech'], ability: 'clearbody' },
			],
			intro: 'La señorita Yasmina lleva semanas en el Faro y nosotros abrimos y cerramos cada día, por si acaso. Hoy, por fin, alguien llama. ¡Un honor!',
			win: 'Un honor perder. De verdad. Se lo diré a la señorita. Le gustará.',
			look: { hair: 'short', hairColor: '#8a8a8a', outfit: '#2b2b38', outfit2: '#cfd6e2', skin: 1, acc: 'tie mustache', mouth: 'flat' } },
		gym_olivo_2: { name: 'Amalia', cls: 'Dama', ai: 3, iv: 22, bg: 'gym',
			team: [
				{ sp: 'bisharp', lv: 43, moves: ['ironhead', 'nightslash', 'brickbreak', 'metalclaw'], ability: 'defiant' },
				{ sp: 'excadrill', lv: 44, moves: ['drillrun', 'ironhead', 'rockslide', 'metalclaw'], ability: 'sandrush' },
			],
			intro: 'El acero no se dobla. Se templa. Eso dice Yasmina. Ella lo dice muy bajito, pero se oye en todo el gimnasio.',
			win: 'Templad{o|a|e}. Sí. Eres de acero templado.',
			look: { hair: 'bun', hairColor: '#4a3a5a', outfit: '#e9e3d0', outfit2: '#8c6cd0', skin: 0, acc: 'flower', mouth: 'smile' } },
		yasmina_g7: { name: 'Yasmina', cls: 'Líder', npc: 'yasmina', ai: 4, iv: 29, reward: 4600, bg: 'gym',
			team: [
				{ sp: 'magnezone', lv: 42, moves: ['flashcannon', 'spark', 'triattack', 'supersonic'], ability: 'sturdy', item: 'oranberry', nature: 'modest', iv: 28 },
				{ sp: 'skarmory', lv: 41, moves: ['drillpeck', 'steelwing', 'swift', 'sandattack'], ability: 'keeneye', item: 'sharpbeak', nature: 'impish', iv: 28 },
				{ sp: 'bronzong', lv: 42, moves: ['gyroball', 'extrasensory', 'payback', 'confuseray'], ability: 'levitate', item: 'oranberry', nature: 'relaxed', iv: 28 },
				{ sp: 'scizor', lv: 42, moves: ['bulletpunch', 'xscissor', 'aerialace', 'brickbreak'], ability: 'swarm', item: 'metalcoat', nature: 'adamant', iv: 29 },
				{ sp: 'steelix', lv: 45, moves: ['ironhead', 'dig', 'rockslide', 'crunch'], ability: 'rockhead', item: 'sitrusberry', nature: 'impish', iv: 31 },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'Eh… Gracias. Por esperar. Por lo del Faro. Por todo. …Ahora, por favor, combate en serio. Mis Pokémon son de acero. No se rompen. Yo sí, a veces. Hoy no.',
			win: 'Has… has templado algo en mí también. No sé decirlo mejor. Gracias.',
			lose: 'Lo siento. De verdad. Vuelve cuando quieras. Hago té.' },

		// ----- Muelle (entrenamiento) -----
		olivo_muelle_1: { name: 'Fidel', cls: 'Pescador', ai: 2,
			team: [{ sp: 'kingler', lv: 42, moves: ['crabhammer', 'xscissor', 'stomp', 'metalclaw'] }, { sp: 'octillery', lv: 42 }],
			intro: 'Sin el Faro pescamos de día. De día pican menos. Y yo tengo más paciencia de noche. ¡Así que hoy combato!',
			win: 'Ni pican ni gano. Pero la paciencia la tengo intacta.' },
		olivo_muelle_2: { name: 'Begoña', cls: 'Nadadora', ai: 2,
			team: [{ sp: 'starmie', lv: 43, moves: ['psychic', 'surf', 'rapidspin', 'recover'] }, { sp: 'lanturn', lv: 42, moves: ['discharge', 'surf', 'confuseray', 'spark'] }],
			intro: 'Nado de punta a punta del puerto todas las mañanas. El agua está más fría que nunca. Mi Lanturn dice que es por algo que viene del norte. Mi Lanturn dice muchas cosas.',
			win: 'Al agua fría se acostumbra uno. A perder, menos.' },
		olivo_muelle_3: { name: 'Teófilo', cls: 'Marinero', npc: 'marinero', ai: 2,
			team: [{ sp: 'hariyama', lv: 43, moves: ['closecombat', 'knockoff', 'heavyslam', 'fakeout'] }, { sp: 'tentacruel', lv: 42 }],
			intro: 'En el muelle se entrena a lo bruto. Cajas, cabos y combates. ¡El que se cae al agua paga las cervezas!',
			win: 'Pago yo. Siempre pago yo. Ya ni me caigo, pero pago.' },

		// ----- Rivales (opcionales) -----
		bastien_4: { name: 'Bastien', cls: 'Rival', npc: 'bastien', ai: 3, iv: 26, reward: 2700,
			team: [
				{ sp: 'talonflame', lv: 42, moves: ['acrobatics', 'flamecharge', 'steelwing', 'roost'], ability: 'flamebody', nature: 'jolly', iv: 26 },
				{ sp: 'meowstic', lv: 41, moves: ['psychic', 'shadowball', 'lightscreen', 'fakeout'], ability: 'prankster', nature: 'timid', iv: 25 },
				{ sp: 'pyroar', lv: 42, moves: ['flamethrower', 'hypervoice', 'darkpulse', 'willowisp'], ability: 'unnerve', nature: 'modest', iv: 26 },
				{ sp: 'doublade', lv: 42, moves: ['ironhead', 'nightslash', 'shadowsneak', 'sacredsword'], ability: 'noguard', nature: 'adamant', iv: 26 },
				{ sp: 'greninja', lv: 44, moves: ['waterpulse', 'darkpulse', 'icebeam', 'extrasensory'], ability: 'torrent', item: 'sitrusberry', nature: 'timid', iv: 28 },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: 'Página nueva de la libreta. Arriba pone tu nombre. ¡Greninja, al final! ¡Talonflame, abre tú!',
			win: 'Lo apunto. Con buena letra. Esta derrota me la he ganado.',
			lose: 'No lo tacho. No tacho nada. Pero me hacía falta.' },
		rhi_4: { name: 'Rhi', cls: 'Rival', npc: 'rhi', ai: 3, iv: 26, reward: 2700,
			team: [
				{ sp: 'falinks', lv: 41, moves: ['closecombat', 'megahorn', 'rockslide', 'headbutt'], ability: 'battlearmor', nature: 'adamant', iv: 25 },
				{ sp: 'sirfetchd', lv: 42, moves: ['leafblade', 'brutalswing', 'brickbreak', 'knockoff'], ability: 'steadfast', item: 'leek', nature: 'adamant', iv: 26 },
				{ sp: 'corviknight', lv: 42, moves: ['drillpeck', 'metalclaw', 'payback', 'scaryface'], ability: 'mirrorarmor', nature: 'impish', iv: 26 },
				{ sp: 'toxtricity', lv: 41, moves: ['shockwave', 'poisonjab', 'venoshock', 'nobleroar'], ability: 'plus', nature: 'modest', iv: 26 },
				{ sp: 'cinderace', lv: 44, moves: ['flamethrower', 'zenheadbutt', 'doublekick', 'quickattack'], ability: 'blaze', item: 'sitrusberry', nature: 'jolly', iv: 28 },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Silbatazo inicial! ¡No me hables, no me preguntes, juega! ¡Cinderace, a la delantera!',
			win: 'Limpio. Otra vez limpio. …Vale. Vale. Siéntate. Te lo cuento.',
			lose: '¡Golazo! ¡Toma! Y no, no te lo cuento. Eso solo se lo cuento a quien me gana.' },
	},

	// =====================================================================
	// NPCs genéricos de este tramo
	// =====================================================================
	npcs: {
		aspirante_trigal: { name: 'Aspirante', generic: true, look: { hair: 'spiky', hairColor: '#d8a85a', outfit: '#1f2e4f', outfit2: '#cfd6e2', skin: 1, eyesStyle: 'sharp', mouth: 'grin', acc: 'lemnis' } },
		granjera_muumuu: { name: 'Granjera', generic: true, look: { hair: 'bun', hairColor: '#cfd6e2', outfit: '#c4473a', outfit2: '#e9e3d0', skin: 2, acc: 'freckles', eyesStyle: 'happy', mouth: 'smile' } },
		contramaestre: { name: 'Contramaestre', generic: true, sprite: 'sailor', look: { hair: 'cap', hairColor: '#cfd6e2', outfit: '#3b5bb5', outfit2: '#e9e3d0', skin: 3, acc: 'beard', mouth: 'flat' } },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		bitacorafaro: { name: 'Bitácora del Faro', pocket: 'key', desc: 'Un cuaderno de tapas de hule, gordo de humedad. Dentro, cuarenta años de letras distintas: la del farero viejo, grande y torcida; la de Yasmina, pequeña y redonda.',
			read: '**BITÁCORA DEL FARO DE OLIVO**\n\n*(Letra grande y torcida, tinta antigua)*\n\n12 de marzo. Mar gruesa. Amphy, toda la noche encendido. Ni un barco perdido.\n\n3 de junio. Ha venido el ranchero Prado, el de la Ruta 42, con su Ampharos. Dice que el suyo alumbra más que el nuestro. Le he invitado a subir para comparar. No ha subido. Dice que las escaleras son para jóvenes. Tiene cincuenta y dos años.\n\n*(Muchas páginas después. Letra pequeña y redonda.)*\n\nDía 1 del cuaderno nuevo. El abuelo ya no sube. Ahora subo yo. Amphy me ha mirado raro al principio. Luego se ha dormido con la cabeza en mis rodillas. Creo que me ha aceptado.\n\n*(Más reciente.)*\n\nHa venido un señor muy amable de la Fundación Raíces. Traje azul. Ha regalado un «suplemento» para Amphy, para que brille más en invierno. Se lo he dado. Le encantó.\n\nAmphy está cansado. Será el frío.\n\nAmphy no se levanta para el turno de las diez. Lo he cubierto con la lámpara de aceite.\n\nAmphy no se levanta.\n\nBarco sin bandera en el muelle tres, otra vez. 4:10. Cajas azules. No quiero pensar en eso. Ahora solo quiero pensar en Amphy.\n\nHe cerrado el gimnasio. Lo siento. Lo siento mucho. No puedo bajar.' },
		fotofaro: { name: 'Foto del Faro de noche', pocket: 'key', art: 'faro_olivo_noche', desc: 'Una foto pequeña, un poco movida, del Faro de Olivo de noche desde la sala de la linterna: el haz cruzando el puerto, los barcos encendidos abajo. Detrás, con letra redonda: «La primera noche que volvió. — Y.»' },
	},

	shops: {
		tienda_muumuu: { name: 'Puesto de la Granja MuuMuu', items: ['moomoomilk'] },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		bayas_r38: {
			name: 'Arbustos de bayas', icon: '🫐', hours: 18, picks: [1, 3],
			text: 'Entre la valla y el camino hay arbustos que nadie poda. Están cargados.',
			wait: 'Ya no queda nada maduro. Un Miltank te mira desde la valla como diciendo «te lo dije».',
			table: [
				{ id: 'oranberry', w: 20, n: [1, 2] }, { id: 'sitrusberry', w: 12, n: [1, 1] }, { id: 'pechaberry', w: 14, n: [1, 2] },
				{ id: 'rawstberry', w: 14, n: [1, 2] }, { id: 'aspearberry', w: 12, n: [1, 2] }, { id: 'leppaberry', w: 8, n: [1, 1] },
				{ id: 'lumberry', w: 3, n: [1, 1] },
			],
		},
		pajar_muumuu: {
			name: 'Pajar del establo', icon: '🌾', hours: 22, picks: [1, 2],
			text: 'La granjera te deja rebuscar en el heno. «Lo que encuentres, tuyo. Menos las gallinas.»',
			wait: '«Mañana más», dice la granjera desde el establo. «Que el heno también descansa.»',
			table: [
				{ id: 'moomoomilk', w: 10, n: [1, 1], cond: 'flag.b03_muumuu_hecho' },
				{ id: 'oranberry', w: 16, n: [1, 2] }, { id: 'chestoberry', w: 14, n: [1, 2] },
				{ id: 'tinymushroom', w: 10, n: [1, 1] }, { id: 'softsand', w: 3, n: [1, 1] },
			],
		},
		orilla_olivo: {
			name: 'Orilla de las rocas', icon: '🐚', hours: 18, picks: [1, 3],
			text: 'Entre las rocas del puerto, la marea ha dejado conchas, sal y algo que brilla.',
			wait: 'La marea todavía no ha vuelto a bajar. Mejor otro rato.',
			table: [
				{ id: 'pearl', w: 18, n: [1, 2] }, { id: 'shoalsalt', w: 16, n: [1, 2] }, { id: 'shoalshell', w: 16, n: [1, 2] },
				{ id: 'heartscale', w: 10, n: [1, 1] }, { id: 'stardust', w: 10, n: [1, 1] }, { id: 'bigpearl', w: 4, n: [1, 1] },
				{ id: 'starpiece', w: 2, n: [1, 1] },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		muelle_olivo: {
			name: 'Muelle de entrenamiento de Olivo', npc: 'contramaestre', type: 'Water', rec: 44,
			cond: 'visited("puerto_olivo")',
			info: [
				{ text: 'Zona de entrenamiento con tope de **nivel 45**. Marineros y pescadores de nivel 42 a 43 que repiten.' },
				{ text: 'Se cierra cuando tu equipo ya llega al tope.' },
			],
		},
		rival_bastien_olivo: {
			name: 'Rival: Bastien (Olivo)', npc: 'bastien', trainer: 'bastien_4', type: 'Water', rec: 45,
			cond: 'flag.b03_bastien_olivo',
			info: [
				{ text: 'Bastien está en el puerto de Olivo con su libreta. Combate opcional.' },
				{ cond: 'flag.b03_bastien_olivo', text: 'Cinco Pokémon. Su Greninja sigue cerrando el equipo.' },
				{ cond: 'beat("bastien_4")', text: '✔ Ya lo venciste en Olivo.' },
			],
		},
		rival_rhi_olivo: {
			name: 'Rival: Rhi (Olivo)', npc: 'rhi', trainer: 'rhi_4', type: 'Fire', rec: 45,
			cond: 'flag.b03_rhi_cabina',
			info: [
				{ text: 'Rhi está en el puerto de Olivo. No quiere hablar. Quiere jugar. Combate opcional.' },
				{ cond: 'flag.b03_rhi_cabina', text: 'Cinco Pokémon. Su Cinderace sigue siendo la delantera.' },
				{ cond: 'beat("rhi_4")', text: '✔ Le ganaste limpio en Olivo.' },
			],
		},
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== VUELTA A TRIGAL ===================
		b03_trigal_vuelta: [
			{ set: { 'flag.b03_trigal_vuelta': true } },
			{ quest: 'b03_m3', stage: 'reto' },
			{ text: 'Trigal, otra vez. Las mismas bocinas, el mismo Tren Magnético silbando por encima de la plaza. La carpa de la Gira ya no está; en su lugar hay un mercadillo de verduras.' },
			{ text: 'Y, donde estaban los andamios, la fachada del gimnasio luce un cartel nuevo, enorme, pintado a mano con letras que se tuercen un poco al final, como si quien las pintó se hubiera quedado sin pared: «**¡GIMNASIO DE INTERCAMBIO! · CORELIA · ¡A TOPE!**».' },
			{ say: 'rotom', text: '¡Bzzt! Gimnasio abierto. Líder de intercambio: Corelia, de Ciudad Yantra. Tipo Lucha. Nota: el cartel tiene una abolladura con forma de patín. Nota dos: la puerta también.' },
			{ text: '{riolu} levanta las orejas hacia el gimnasio. Conoce ese ruido de ruedas. Conoce a la Lucario que hay dentro.', cond: RL },
			{ text: 'Rotom vuelve a vibrar. Un mensaje. Todo en mayúsculas.' },
			{ say: 'renata', as: 'Renata (mensaje)', text: '«ESTOY EN TRIGAL. EN PERSONA. HE CRUZADO POR LA PUERTA Y ME HA COSTADO EL SUELDO DE TRES EPISODIOS. ESTACIÓN DEL TREN MAGNÉTICO. CUANDO PUEDAS. NO TARDES. TARDA LO QUE NECESITES. NO TARDES.»' },
			{ quest: 'b03_t_renata', stage: 'sotano' },
			{ if: 'flag.b02_frag_sera && flag.b01_trato_sera && has("holomisorsera")', then: [
				{ text: 'El Holomisor de Serafina vibra en tu otro bolsillo. Un solo mensaje, sin saludo:' },
				{ text: '*«En el Centro Pokémon de Trigal hay un paquete a tu nombre. Un componente devuelto merece una compensación proporcional. Esto es lo que considero proporcional. No lo abras delante de nadie. —S.»*' },
				{ text: 'Dentro: una caja azul medianoche, sin logo. Cinco Ultra Balls y un Revivir Máximo, colocados con una precisión casi ofensiva.' },
				{ give: 'ultraball', n: 5 }, { give: 'maxrevive' },
				{ af: { sera: 1 } },
			] },
			{ if: 'flag.b02_frag_sera && !flag.b01_trato_sera', then: [
				{ text: 'En el mostrador del Centro Pokémon te espera un paquete. Caja azul medianoche, sin logo. Una tarjeta con letra perfecta: *«Por su colaboración en Ciudad Iris. Lemnis no olvida a quien devuelve lo que es suyo. —S. Lemnis»*.' },
				{ text: 'Cinco Ultra Balls y un Revivir Máximo. Útil. Frío. Exacto.' },
				{ give: 'ultraball', n: 5 }, { give: 'maxrevive' },
			] },
			{ if: 'flag.b01_trato_sera && !flag.b02_frag_sera && has("holomisorsera")', then: [
				{ text: 'Por costumbre, miras el Holomisor de Serafina. No ha vuelto a vibrar desde Iris. En la pantalla, en letras grises: «Canal cerrado por el titular».' },
			] },
			{ if: 'quest.b02_t_lila && !done.b02_t_lila', then: [{ quest: 'b02_t_lila', done: true }] },
			{ quest: 'b03_t_lila', stage: 'trigal' },
		],

		// =================== LILA Y SYLVEON ===================
		b03_lila_gym: [
			{ if: 'flag.b03_lila_hecho', then: [{ end: true }] },
			{ set: { 'flag.b03_lila_hecho': true } },
			{ text: 'Dentro del gimnasio, en el centro del campo, Lila está de pie con Eevee a sus pies. Delante de ella, un chico con chaqueta azul y plata y el pelo de punta le grita a dos palmos de la cara.' },
			{ say: 'aspirante_trigal', text: '¡Que no quiero a la aprendiz! ¡Quiero a la líder! Tengo cinco medallas, un patrocinador y una sesión de fotos a las seis. No tengo tiempo para la chica de las flores.' },
			{ say: 'lila', text: 'E-esto… la líder está en la Torre Radio. Una entrevista. Vuelve en una hora. Lo siento. Mucho. Pero el reglamento dice que… que si la líder no está, el primer combate es conmigo.' },
			{ say: 'aspirante_trigal', text: '¿Contigo? ¿Con ese Eevee? —Se ríe—. Mi Scrafty se ha comido tres Caramelos Lazo esta mañana. Está que se sale. No te lo recomiendo.' },
			{ text: 'Detrás del chico, en el suelo, hay tres envoltorios arrugados. Azules y plateados. Su Scrafty da saltitos sobre las puntas de los pies, con los ojos demasiado brillantes. Demasiado.' },
			{ say: 'rotom', text: '¡Bzzt! Caramelos Lazo. Esos los he visto antes. Esos no me gustan.', cond: 'flag.b02_pabellon' },
			{ text: 'Lila te ve en la puerta. Se le iluminan los ojos. Y enseguida se le apagan un poco, como quien recuerda algo.' },
			{ if: 'flag.b02_lila_protegida', then: [
				{ say: 'lila', text: '{jugador}. —Lo dice bajito—. Esta vez no. ¿Vale? Por favor. Esta vez no.' },
				{ prompt: 'Lila te mira. El aspirante ya está sacando a su Scrafty.', choice: [
					{ text: 'Quedarte en la puerta. «Vale. Esta vez no.»', then: [
						{ af: { lila: 7 } },
						{ set: { 'flag.b03_lila_sola': true } },
						{ text: 'Te apoyas en el marco de la puerta y cruzas los brazos. Lila suelta el aire que no sabía que estaba aguantando.' },
						{ say: 'lila', text: 'Gracias. —Una sonrisa breve—. Gracias de verdad.' },
					] },
					{ text: 'Dar un paso hacia el campo.', then: [
						{ af: { lila: -3 } },
						{ text: 'Das un paso. Lila levanta la mano, sin mirarte. No tiembla.' },
						{ say: 'lila', text: 'No. —Silencio—. Ya sé que es por cariño. Lo sé. Pero no.' },
						{ text: 'Te quedas donde estás. Ella vuelve a mirar al campo.' },
					] },
				] },
			], else: [
				{ if: 'flag.b02_lila_trigal', then: [
					{ say: 'lila', text: '{jugador}. Hola. No… no hagas nada, ¿vale? Como la otra vez. Quédate ahí. Me ayuda que estés ahí.' },
				], else: [
					{ say: 'lila', text: '¿{jugador}? ¡Hola! E-esto… perdona, ahora no puedo… Quédate ahí, ¿vale? Me ayuda que estés ahí. No sé por qué. Me ayuda.' },
				] },
				{ prompt: 'El aspirante ya está sacando a su Scrafty.', choice: [
					{ text: 'Quedarte en la puerta, a la vista.', then: [
						{ af: { lila: 6 } },
						{ set: { 'flag.b03_lila_sola': true } },
						{ text: 'Te apoyas en el marco de la puerta. Lila te mira un segundo. Asiente. Ya no te vuelve a mirar.' },
					] },
					{ text: 'Gritar desde la puerta: «¡Tú puedes, Lila!»', then: [
						{ af: { lila: 4 } },
						{ set: { 'flag.b03_lila_sola': true } },
						{ text: 'Se le ponen las orejas rojas. Rojísimas. Pero endereza la espalda.' },
						{ say: 'lila', text: '¡N-no grites! …Gracias. ¡No grites!' },
					] },
				] },
			] },
			{ text: 'El Scrafty se lanza. Rápido, brusco, con una fuerza que no le cabe en el cuerpo. Eevee lo esquiva por un pelo. Otra vez. Otra.' },
			{ say: 'lila', text: 'Eevee. Despacio. —La voz le tiembla en la primera palabra. En la segunda, ya no—. Como en la Torre. Como en Trigal. Tranquilas.' },
			{ if: 'flag.b01_lila_llama', then: [
				{ text: 'Por un momento, te parece ver en la cara de Lila la misma luz que la noche en que encendió la llama de la Torre Maestra. Esa calma de quien ya sabe que puede.' },
			], else: [
				{ text: 'Lila no ha encendido todavía la llama de la Torre Maestra. Pero ahora mismo, en el centro de un campo de parqué, parece alguien que podría encender cualquier cosa.' },
			] },
			{ text: 'El Scrafty da una patada alta. Eevee no la esquiva: la aguanta. Se queda de pie, temblando, entre el Scrafty y Lila.' },
			{ say: 'lila', text: 'No tienes que protegerme. —Se arrodilla junto a Eevee, en mitad del combate—. Ya no. Estamos juntas. Es distinto.' },
			{ cutscene: { bg: { type: 'gym' }, start: 'dark', frames: [
				{ mon: 'eevee', text: 'Eevee se gira hacia Lila. La mira como la miró aquella tarde entre andamios: como si supiera algo que ella todavía no sabe.' },
				{ fx: 'glow', text: 'El brillo rosa vuelve. Primero en la punta de las orejas. Luego en la cola. Luego en todo el cuerpo, como una cinta de luz que se desenrolla despacio.' },
				{ fx: 'light', text: 'Y esta vez no se apaga.' },
				{ fx: 'flash', mon: 'sylveon', text: 'Donde estaba Eevee hay un Pokémon blanco y rosa, con un lazo en la oreja y unas cintas largas que flotan en el aire como si el aire fuera agua.' },
				{ text: 'Las cintas se estiran hacia Lila. Le rozan la mejilla. Se le enrollan, muy suave, alrededor de la muñeca.' },
			] } },
			{ set: { 'flag.b03_sylveon': true } },
			{ say: 'lila', text: '…Sylveon.' },
			{ text: 'El Scrafty ataca otra vez. Sylveon ni se mueve: abre la boca y suelta una ráfaga de luz rosa, brillante, que llena el gimnasio. El Scrafty sale rodando hasta las gradas y se queda sentado, aturdido, con los ojos ya normales. Cansados. Normales.' },
			{ text: 'El aspirante recoge a su Pokémon sin decir nada. Mira a Lila. Mira a Sylveon. Mira los envoltorios del suelo. Los recoge, también, antes de irse. Como si de pronto le diera vergüenza que alguien los viera.' },
			{ text: 'Por la puerta entra, sin frenar, una chica en patines con una coleta rubia y una gorra. Derrapa. Choca con la puerta. La puerta suena a puerta que ya ha recibido muchos choques.' },
			{ say: 'corelia', text: '¡Llego! ¡Llego tarde, pero llego! La entrevista se ha alargado porque el presentador quería que le enseñara a… —Se para—. …Lila.' },
			{ say: 'corelia', text: '¿Eso… eso es un Sylveon? ¿TU Sylveon?' },
			{ say: 'lila', text: 'E-esto… sí. Hace un minuto era Eevee. Lo siento. Quiero decir: no lo siento. Quiero decir…' },
			{ text: 'Corelia cruza el campo en tres impulsos y abraza a Lila tan fuerte que las dos se caen sobre el parqué. Sylveon las envuelve a las dos con las cintas. Nadie se levanta en un buen rato.' },
			{ say: 'corelia', text: '¡A TOPE! ¡A TOPÍSIMO! ¡El abuelo tiene que saberlo! ¡Ya! ¡Lila, llama al abuelo! ¡No, lo llamo yo! ¡No, llámalo tú, que es tuyo!' },
			{ text: 'Luego Corelia te ve. Se levanta de un salto, patina hasta ti y te pone las dos manos en los hombros.' },
			{ say: 'corelia', text: '¡{jugador}! ¡Lo has visto! ¡Claro que lo has visto, estabas ahí! —Te sacude un poco—. Bueno. Gimnasio de intercambio, abierto oficialmente. Medalla Planicie. Mis dos alumnos primero, y luego Lucario y yo. Y esta vez, en Johto, ¡sin piedad!' },
			{ if: RL, then: [
				{ text: 'Del cinturón de Corelia sale una Poké Ball que se abre sola: su Lucario. Mira a {riolu}. {riolu} lo mira a él. Ninguno de los dos dice nada. Ninguno de los dos hace falta que lo diga.' },
			] },
			{ diary: 'Hoy mi entrenador{|a|e} vio una evolución en directo. ¡La Eevee de Lila se convirtió en un Sylveon precioso, con cintas y todo! Las cintas brillaban rosas y se enrollaban en la muñeca de Lila como una pulsera.\n\nLila lloró un poquito. Corelia lloró mucho. Yo no puedo llorar, pero mi pantalla se puso rosa por solidaridad.\n\nTambién había un chico muy maleducado con un Scrafty muy nervioso. Se fue enseguida. ¡Mejor!', cond: 'flag.b01_diario' },
			{ rep: { johto: 1 } },
			{ intel: { npc: 'lila', text: 'Su Eevee evolucionó a Sylveon en el gimnasio de Trigal, defendiéndola de un aspirante cuyo Scrafty iba cargado de Caramelos Lazo. Lila combatió sola.' } },
			{ intel: { npc: 'corelia', text: 'Líder de intercambio del Gimnasio de Trigal (Lucha). Lleva a Lila como aprendiz. Ya megaevoluciona contra ti.' } },
		],
		b03_corelia_antes: [
			{ say: 'corelia', text: '¡Primero mis dos alumnos! Valeria y Marcelo. Ella frena fatal y él se cae con mucha dignidad. ¡Los dos pegan a tope!' },
			{ say: 'corelia', text: 'Y cuando acabes con ellos, aquí estaremos Lucario y yo. Calentando. Llevamos calentando desde que salimos de Kalos.' },
		],
		b03_corelia_reto: [
			{ text: 'Corelia frena delante de ti. Esta vez, a la primera. Se le nota orgullosa de haber frenado.' },
			{ say: 'corelia', text: '¡Has llegado! Valeria dice que pegas como un tren. Marcelo dice que pegas como dos. Marcelo exagera. A ver cuánto exagera.' },
			{ say: 'corelia', text: 'La última vez fue en Yantra. Tú, nervios{o|a|e}, con tu {riolu} recién salido del cascarón de la Torre. Y mira ahora.' },
			{ if: 'beat("corelia_r2")', then: [{ say: 'corelia', text: 'Y la revancha de Kalos… ¡no me la recuerdes! Bueno, sí, recuérdamela. Me la he repetido en la cabeza cien veces. Esta vez traigo cinco.' }] },
			{ say: 'corelia', text: 'Hoy Lila ha encontrado su vínculo. Yo hace años que encontré el mío. Vamos a ver qué hacen dos vínculos cuando chocan.' },
			{ battle: 'corelia_g6', onWin: [
				{ text: 'Mega-Lucario vuelve a ser Lucario, de rodillas sobre el parqué. Corelia se arrodilla a su lado y le pone la frente contra la frente. Se quedan así un momento.' },
				{ text: '{riolu} se acerca despacio. El Lucario de Corelia levanta la vista. Se dan la mano: palma con palma, como se saludan los Lucario cuando ya no tienen nada que demostrarse.', cond: RL },
				{ say: 'corelia', text: '¡Uaaah! ¡Qué combate! ¡Hasta las rampas temblaban! —Se levanta y saca algo del bolsillo de la chaqueta—. ¡Toma! ¡La **Medalla Planicie**! Es de Johto, pero la he elegido yo: una llanura, para que haya sitio para correr.' },
				{ badge: 'medalla_planicie' },
				{ cap: 46 },
				{ quest: 'b03_m3', done: true },
				{ say: 'corelia', text: 'Y esta también. **MT Puño Drenaje**. Pegas y recuperas. Como cuando te caes de los patines y te levantas con más ganas.' },
				{ give: 'mt_puno_drenaje' },
				{ say: 'corelia', text: 'La siguiente medalla te queda en Ciudad Olivo, al oeste, pasando por Iris. La líder es Yasmina. Tipo Acero. —Por primera vez, baja la voz—. Dicen que no sale del Faro desde hace semanas. Que a su Ampharos le pasa algo.' },
				{ quest: 'b03_m2', stage: 'olivo' },
				{ heal: 'Corelia saca un botiquín de la mochila y reparte Pociones entre tu equipo sin dejar de patinar en círculos. «¡Del abuelo! ¡Receta secreta! Es agua con azúcar y una Poción, pero no se lo digas».' },
				{ say: 'corelia', text: 'Ah, y… Lila está en la grada. Hoy ha hecho la cosa más valiente de su vida. Dile algo. Lo que sea. A ti te escucha distinto.' },
				{ intel: { npc: 'corelia', text: 'Te dio la Medalla Planicie y la MT Puño Drenaje en Trigal. Dice que Yasmina, la líder de Olivo, no sale del Faro: a su Ampharos le pasa algo.' } },
			] },
		],
		b03_corelia_despues: [
			{ say: 'corelia', text: '¡Seis medallas! ¡Seis! ¡Como las ruedas de dos patines y medio! …No, eso no cuadra. ¡Da igual! ¡A tope!' },
			{ if: 'flag.b03_faro_hecho', then: [{ say: 'corelia', text: 'Me han dicho que en Olivo vuelve a haber luz. Sabía que lo arreglarías. Bueno, que ayudarías a arreglarlo. Bueno, que estarías allí. ¡Eso cuenta!' }] },
		],
		b03_lila_momento: [
			{ set: { 'flag.b03_lila_momento': true } },
			{ text: 'Lila está sentada en lo alto de la grada, con las rodillas abrazadas. Sylveon duerme a su lado, con una cinta enrollada en la barandilla y otra en la muñeca de Lila. Te sientas un escalón por debajo.' },
			{ say: 'lila', text: 'Ha sido un buen combate. El tuyo. Lo he visto entero. Bueno, casi entero. Al final cerré los ojos un momento. Por Lucario. Por los dos Lucario.' },
			{ text: 'Silencio. Abajo, Corelia le explica a Marcelo cómo caerse mejor. Marcelo se cae.' },
			{ say: 'lila', text: 'E-esto… ¿Puedo decirte una cosa? Es una tontería.' },
			{ say: 'lila', text: 'Cuando era pequeña, en la Torre, me escondía en la escalera para ver los combates de Corelia. Pensaba que los valientes eran los que no tenían miedo. Y hoy… hoy he tenido muchísimo miedo. Todo el rato.' },
			{ say: 'lila', text: 'Y lo he hecho igual.' },
			{ prompt: 'Lila mira la cinta de su muñeca.', choice: [
				{ text: '«Eso es ser valiente, Lila. Exactamente eso.»', then: [
					{ af: { lila: 2 } },
					{ say: 'lila', text: '…Ya. Ya lo sé. Creo que ya lo sé. Pero me gusta que me lo digas.' },
				] },
				{ text: '«Ahora te toca a ti decírselo a la Lila de la escalera.»', then: [
					{ af: { lila: 3 } },
					{ say: 'lila', text: '—Se ríe, bajito—. Se lo diré. Se va a poner rojísima. Era muy de ponerse roja. Bueno. Soy.' },
				] },
				{ text: 'No decir nada. Quedarte a su lado.', then: [
					{ af: { lila: 2 } },
					{ text: 'No dices nada. Lila tampoco. Al cabo de un rato, la cinta de Sylveon se desenrolla de la barandilla y, muy despacio, se enrolla también en tu muñeca. Lila la ve. No dice nada. Se pone roja igual.' },
				] },
			] },
			{ if: 'flag.b02_lila_protegida && flag.b03_lila_sola', then: [
				{ say: 'lila', text: 'Y gracias por quedarte en la puerta. Sé que te costó. Se te notaba en la cara. —Sonríe—. Tienes la cara de querer ayudar todo el rato. Es bonita. Pero hoy me ha gustado más la otra.' },
			] },
			{ say: 'lila', text: 'Me quedo aquí con Corelia, ayudando en el gimnasio. Unas semanas. Luego… no sé. Ya veremos. —Acaricia a Sylveon—. Ahora somos dos para decidirlo.' },
			{ quest: 'b03_t_lila', done: true },
		],
		b03_lila_despues: [
			{ if: '!beat("corelia_g6")', then: [
				{ say: 'lila', text: 'Sylveon ha decidido que las líneas del campo están torcidas y las está repasando con las cintas. Están igual de torcidas. Pero ahora brillan.' },
				{ say: 'lila', text: 'Corelia te espera. Suerte. Bueno, no. Suerte no. Que lo hagas a tope. Eso dice ella.' },
			], else: [
				{ say: 'lila', text: 'Sylveon ha aprendido a abrir la puerta del gimnasio con las cintas. Ahora la abre para todo el mundo. Corelia dice que es el mejor portero de Johto.' },
				{ if: 'flag.b03_faro_hecho', then: [{ say: 'lila', text: 'Me han dicho que el Faro de Olivo vuelve a dar luz. ¿Fuiste tú? No me lo digas. Ya lo sé.' }] },
			] },
		],

		// =================== RENATA Y EL SÓTANO ===================
		b03_renata_estacion: [
			{ set: { 'flag.b03_sotano_abierto': true } },
			{ text: 'En el andén, una chica con gabardina mostaza, rizos imposibles y gafas redondas habla con Dámaso, el mecánico, a una velocidad que el pobre hombre no puede seguir. Lleva un micrófono en una mano y un café en la otra. Los mueve igual.' },
			{ say: 'renata', text: '¡Testigo! —Te señala con el café—. Por fin. La última vez que te vi la cara fue en Kalos. Ahora tienes cara de haber dormido tres días en un bosque. Cool, cool, cool.' },
			{ say: 'renata', text: 'Renata Castellanos, *Casos Fríos de Teselia*, en directo desde Johto. Bueno, en diferido: lo monto luego.' },
			{ if: 'done.b02_t_renata', then: [
				{ say: 'damaso', text: 'Ha llegado esta mañana. Ha pedido un café, ha pedido ver el cuarto de contadores y ha pedido que le explique otra vez lo del martes. Tres veces. —Suspira—. Es usted la culpable, ¿no? De que la conozca.' },
			], else: [
				{ say: 'renata', text: 'Te presento a mi testigo. Dámaso Ferrán. Lo encontré yo sola, al final. Por los zumbidos. Llamé a todas las estaciones de Johto preguntando por un mecánico con un Magneton. Cuarenta y una llamadas.' },
				{ say: 'damaso', text: 'Cuarenta y dos. Le colgué la primera vez.' },
				{ say: 'damaso', text: 'Trabajé con un ingeniero, Matías Olmedo, hace doce años. Aquí abajo había otra cosa, no un tren. Un arco. Un prototipo. Un martes dejó de venir. Al mes, lo tapiaron todo.' },
			] },
			{ say: 'renata', text: 'Episodio nueve. «El ingeniero que no volvió a casa». Hasta ahora tengo un testigo, una grabación de una fiesta de empresa y una pared. Hoy quiero lo que hay detrás de la pared.' },
			{ say: 'damaso', text: 'El cuarto de contadores es mío. Tengo la llave. —La saca. Pesa—. Doce años bajando a leer contadores y mirando esa pared. Nunca la toqué. Hoy, si la tocan, que sea alguien que sepa lo que hace.' },
			{ text: 'Bajáis por una escalerita de hierro. El cuarto de contadores es pequeño, con tuberías y relojes que giran. Al fondo, una pared de ladrillo más nueva que las demás. El yeso está mal alisado. Se nota que la hicieron con prisa.' },
			{ if: RL, then: [
				{ text: '{riolu} se acerca a la pared. Cierra los ojos. Las orejas se le quedan muy quietas, y el halo azul se le enciende alrededor de las manos.' },
				{ text: 'Pone la palma sobre un ladrillo. Lo empuja. Uno solo, sin fuerza. El ladrillo cede hacia dentro y cae al otro lado con un ruido sordo. Por el hueco sale aire frío y olor a papel viejo.' },
				{ say: 'renata', text: '…Nota para el episodio. No. Nota para mí: quiero un Lucario. ¿Dónde se piden los Lucario?' },
				{ happy: { who: 'riolu', n: 10 } },
			], else: [
				{ text: 'Dámaso golpea la pared con los nudillos, ladrillo a ladrillo, escuchando. Se para en uno. Su Magneton zumba en tres notas. Dámaso empuja, y el ladrillo cede hacia dentro.' },
			] },
			{ text: 'Entre los tres agrandáis el hueco. Detrás hay un pasillo estrecho y oscuro. Y al fondo, una puerta de chapa con una placa atornillada.' },
			{ text: '«**M. OLMEDO · DISEÑO**».' },
			{ say: 'damaso', text: '…Su despacho. —La voz se le rompe un poco—. Yo pensaba que se lo habían llevado todo. Que no quedaba nada.' },
			{ say: 'renata', text: 'Vale. Escuchen. Hay dos versiones. Una: a Matías Olmedo se lo llevaron, por sorpresa, un martes cualquiera. Dos: no fue por sorpresa. —Enciende una linterna—. Los despachos hablan. Mira todo. Luego me dices cuál es.' },
			{ go: 'sotano_estacion' },
		],
		b03_renata_sotano_espera: [
			{ say: 'renata', text: 'Mira la taza, el calendario y el escritorio. Todo. Los detalles son lo único que no se puede tapiar. —Escribe sin mirar la libreta—. Esa frase es buenísima. La apunto.' },
		],
		b03_pista_taza: [
			{ set: { 'flag.b03_pista_taza': true } },
			{ text: 'Una taza blanca de cerámica, con un dibujo hecho con rotulador por alguien muy pequeño: un tren flotando sobre unas rayas, y debajo, en letras gordas y torcidas, «**PAPÁ**».' },
			{ text: 'Está boca abajo, sobre un trapo doblado. Limpia. No hay restos de café dentro. Alguien la fregó, la secó y la dejó así, a escurrir.' },
			{ say: 'damaso', text: 'Matías no fregaba ni una taza. Nunca. Las dejaba en la mesa hasta que criaban vida. Le decía: «Matías, que esto parece un laboratorio». Y él: «Es que es un laboratorio».' },
			{ say: 'renata', text: 'Mmm. Una taza fregada. Por alguien que nunca fregaba. Interesante. Muy interesante. Me encanta lo interesante.' },
		],
		b03_pista_calendario: [
			{ set: { 'flag.b03_pista_calendario': true } },
			{ text: 'Un calendario de pared de una empresa de herramientas, con la foto de un Magnemite sonriente. La hoja es de hace doce años. Los días están tachados con una cruz, uno a uno, hasta un lunes.' },
			{ text: 'En ese lunes, con bolígrafo azul y letra rápida: «**Mañana NO firmar.** Hablar con D.»' },
			{ text: 'El martes está en blanco. Y todos los días después.' },
			{ say: 'damaso', text: '«D.» —Se queda mirando la letra mucho rato—. Soy yo. Tiene que ser yo. No había otro D.' },
			{ say: 'damaso', text: 'Nunca habló conmigo. El martes ya no vino.' },
			{ say: 'renata', text: 'Señor Ferrán… —Por una vez, no dice nada más.' },
		],
		b03_pista_cajon: [
			{ set: { 'flag.b03_pista_cajon': true } },
			{ text: 'Los cajones del escritorio están vacíos. Clips, una goma seca, un lápiz sin punta. Pero el de abajo no cierra del todo: algo hace tope por detrás.' },
			{ if: RL, then: [
				{ text: '{riolu} mete la pata en el hueco y tantea. Su aura se enciende un segundo, como si notara algo que no se ve. Tira. El fondo del cajón se levanta: es un doble fondo.' },
			], else: [
				{ text: 'Sacas el cajón entero. Por detrás, pegado con cinta, hay un doble fondo de cartón.' },
			] },
			{ text: 'Dentro, un tubo de cartón. Y dentro del tubo, enrollado muchas veces, un plano técnico amarillento.' },
			{ cutscene: { bg: { type: 'indoor', wall: '#4a4f6a', floor: '#2b2b38' }, start: 'dark', frames: [
				{ fx: 'light', item: 'planoprototipo', text: 'Lo desenrollas sobre el escritorio. Un arco: dos columnas unidas por arriba. Medidas, cables, anotaciones en letra rápida.' },
				{ fx: 'zoom', text: 'En la esquina inferior derecha, en el cajetín del plano, un sello pequeño: una **lemniscata**. Dibujada a mano, más tosca que la de ahora. Como el primer boceto de un logotipo.' },
				{ text: 'Y en el margen, con el mismo bolígrafo azul del calendario, subrayado dos veces: «*El arco no genera la energía. La TOMA. ¿De dónde?*»' },
				{ fx: 'dark', text: 'Renata deja de escribir. Dámaso se sienta en el suelo. Nadie dice nada durante un rato largo.' },
			] } },
			{ give: 'planoprototipo' },
			{ if: 'flag.b03_nodo02', then: [
				{ text: 'Tomar. La misma palabra que los Unown escribían en la cámara de las Ruinas Alfa. Te la guardas. No sabes todavía dónde ponerla.' },
			] },
			{ say: 'renata', text: '…Lo escondió. Esto lo escondió él. Lo escondió para que lo encontrara alguien.' },
		],
		b03_cajon_vacio: [
			{ text: 'El doble fondo del cajón, vacío. Un rectángulo más limpio en el cartón, donde estuvo el tubo durante doce años.' },
		],
		b03_renata_deduccion: [
			{ say: 'renata', text: 'Vale. Ya lo has visto todo. Teoría. —Te apunta con el micrófono—. ¿Qué le pasó a Matías Olmedo?' },
			{ prompt: '¿Qué dice el despacho?', choice: [
				{ text: '«Se lo llevaron por sorpresa. Un martes cualquiera.»', then: [
					{ set: { 'vars.b03_renata_fallos': '+1' } },
					{ say: 'renata', text: '¿Por sorpresa? ¿Con la taza fregada? ¿Con un plano escondido en un doble fondo? Nadie esconde nada por sorpresa. Otra vez. ¡Sin presión! Hay mucha presión.' },
				] },
				{ text: '«Lo sabía. Fregó la taza, escondió el plano y decidió no firmar.»', then: [
					{ call: 'b03_renata_decision' },
				] },
				{ text: '«Nunca existió. Es todo un montaje.»', then: [
					{ set: { 'vars.b03_renata_fallos': '+1' } },
					{ say: 'renata', text: 'Es un montaje con una taza que pone «PAPÁ». —Te mira por encima de las gafas—. Eso no lo pone nadie en un montaje. Otra.' },
				] },
				{ text: '«Déjame pensar un poco más.»', then: [
					{ say: 'renata', text: 'Piensa. Yo mientras pienso en voz alta, que es como pienso yo. Perdón por adelantado.' },
				] },
			] },
		],
		b03_renata_decision: [
			{ set: { 'flag.b03_renata_deduccion': true } },
			{ if: 'vars.b03_renata_fallos == 0', then: [
				{ af: { renata: 5 } },
				{ say: 'renata', text: '¡A la primera! —Se lleva las manos a la cabeza—. Me fastidia. Me fastidia muchísimo. Me encanta. Iba a decirlo yo. Lo iba a decir yo, ¿eh? Que conste en el episodio.' },
			], else: [
				{ af: { renata: 2 } },
				{ say: 'renata', text: 'Eso. Exacto. Nos ha costado, pero eso. Nota para el episodio: el testigo acierta cuando deja de buscar al malo y mira la taza.' },
			] },
			{ say: 'renata', text: 'Matías Olmedo no desapareció sin más. Matías Olmedo sabía que iba a pasar algo el martes. Iba a firmar algo y decidió no hacerlo. Quiso contárselo a Dámaso. Fregó su taza, que no había fregado nunca, como quien recoge antes de irse. Y escondió esto. —Toca el plano—. Para quien viniera después.' },
			{ say: 'damaso', text: 'Quería hablar conmigo. —Mira la taza—. Doce años pensando que se fue sin acordarse de mí.' },
			{ text: 'Renata apaga el micrófono. Se sienta en el borde del escritorio. Por primera vez desde que la conoces, habla despacio.' },
			{ say: 'renata', text: 'Tengo esto. Un despacho tapiado, un plano con un logotipo que hoy sale en todas las Puertas del mundo, y una frase en el margen que me va a quitar el sueño un año entero.' },
			{ say: 'renata', text: 'Puedo montarlo esta noche y emitirlo mañana. Medio mundo escucha *Casos Fríos*. Bueno, un cuarto de mundo. Bueno, mi madre y mucha gente más.' },
			{ say: 'renata', text: 'O puedo esperar. Seguir tirando del hilo sin que nadie sepa que tenemos el hilo. —Te mira—. Tú lo encontraste. Tú decides. Lo digo en serio. Me cuesta mucho decirlo en serio.' },
			{ prompt: '¿Qué le dices a Renata?', choice: [
				{ text: '«Emítelo. Que lo sepa todo el mundo.»', then: [
					{ set: { 'flag.b03_renata_publica': true } },
					{ af: { renata: 4 } },
					{ rep: { lemnis: -5, johto: 2 } },
					{ say: 'renata', text: '…Sí. Sí. ¡Cool, cool, cool, cool! —Se levanta de un salto—. Mañana a las nueve. «El despacho tapiado». Con el nombre de Dámaso, que me lo ha dado. Y con el tuyo, si quieres. No. Sin el tuyo. Te protejo. Soy así de buena.' },
					{ say: 'damaso', text: 'Ponga el de Matías bien grande. Que lo lean.' },
					{ text: 'Renata le hace fotos al plano, por delante y por detrás, con el móvil y con una cámara de carrete que saca de la gabardina. «Por si me hackean el móvil. Me han hackeado el móvil. Dos veces».' },
				] },
				{ text: '«Espera. Si lo sueltas ahora, borrarán el resto.»', then: [
					{ set: { 'flag.b03_renata_espera': true } },
					{ af: { renata: 2 } },
					{ say: 'renata', text: 'Uf. —Se tapa la cara con las manos—. Vale. Tienes razón. Odio que tengas razón. El mejor episodio de mi vida y me lo guardo en un cajón. Con doble fondo, eso sí.' },
					{ say: 'renata', text: 'Pero me lo guardo. Y seguimos tirando. Juntos. Bueno, tú tiras y yo narro. Es un reparto justo.' },
					{ say: 'damaso', text: 'Doce años callado. Puedo callar un poco más. Ahora sé que no estaba solo callando.' },
				] },
			] },
			{ say: 'renata', text: 'El plano quédatelo tú. Yo tengo las fotos. Y tú tienes un Lucario y la costumbre de que te pasen cosas. Estará más seguro contigo.', cond: RL },
			{ say: 'renata', text: 'El plano quédatelo tú. Yo tengo las fotos. Y tú tienes la costumbre de que te pasen cosas. Estará más seguro contigo.', cond: '!' + RL },
			{ quest: 'b03_t_renata', stage: 'hecha', done: true },
			{ intel: { npc: 'renata', text: 'Encontrasteis el despacho tapiado de Matías Olmedo bajo la estación de Trigal: taza fregada, calendario parado en un lunes («Mañana NO firmar. Hablar con D.») y un plano del prototipo de Puerta con una lemniscata dibujada a mano en el cajetín. Matías lo sabía y lo escondió.' } },
			{ intel: { npc: 'damaso', text: 'La «D.» del calendario de Matías Olmedo era él. Matías quería hablar con él el martes en que desapareció.' } },
		],
		b03_renata_despues: [
			{ if: 'flag.b03_renata_publica', then: [
				{ say: 'renata', text: 'El episodio sale mañana. Llevo tres cafés y he grabado la intro cuarenta veces. La cuarenta y una será la buena. Siempre es la cuarenta y una.' },
			], else: [
				{ say: 'renata', text: 'Episodio guardado. Bajo llave. Con doble fondo. Estoy bien. Estoy perfectamente. No me mires así, que me pongo a emitirlo.' },
			] },
			{ say: 'renata', text: '«El arco no genera la energía. La toma.» —Lo repite bajito—. ¿De dónde, Matías? ¿De dónde?' },
		],
		b03_damaso_despues: [
			{ say: 'damaso', text: 'Esta mañana he bajado a leer los contadores. Por costumbre. Y he dejado la puerta del despacho abierta. Por costumbre también, creo. Una nueva.' },
			{ text: 'Su Magneton zumba en tres notas. Por primera vez te parece que suenan afinadas.' },
		],

		// =================== GRANJA MUUMUU ===================
		b03_muumuu: [
			{ set: { 'flag.b03_muumuu_hecho': true } },
			{ text: 'Una señora mayor de pelo blanco recogido sale del establo con un cubo vacío. Lo deja en el suelo con cuidado, como si pesara mucho aunque no lleve nada.' },
			{ say: 'granjera_muumuu', text: 'Buenas, buenas. Si vienes por leche, este mes no hay. Lo siento. Canela no da. Canela no come. Canela no se levanta.' },
			{ say: 'granjera_muumuu', text: 'Cuarenta años con Miltank y nunca había visto esto. No es una enfermedad que yo conozca. Tiene los ojos abiertos, respira bien, el veterinario dice que está sana. Pero está… apagada. Como una vela que sigue ahí sin llama.' },
			{ if: 'flag.b02_apagados || flag.b02_kaori_muestra', then: [
				{ text: 'Apagada. Esa palabra ya la has oído. En el Encinar. En el Teatro de Danza de Iris.' },
			] },
			{ say: 'granjera_muumuu', text: 'Hace unas semanas vino un chico muy majo de una fundación, la de las raíces esas. Nos regaló un saco de pienso «enriquecido». Para el invierno. Yo no se lo di a todas. Solo a Canela, que es la que más trabaja.' },
			{ say: 'granjera_muumuu', text: 'Mi marido dice que no tiene nada que ver. Mi marido dice muchas cosas.' },
			{ say: 'granjera_muumuu', text: 'Aurelio, el del rancho de la Ruta 42, nos dijo que no lo usáramos. Él tiraba los folletos de esa fundación sin abrirlos. Pasó por aquí hace poco, de vuelta de no sé dónde. Tosía. Le dije que se cuidara. Me dijo que los rancheros no se cuidan, se aguantan.' },
			{ if: 'flag.b02_ampharos', then: [{ say: 'granjera_muumuu', text: '¿Y ese Ampharos? —Mira tu Poké Ball—. ¿No será Faro? ¡Es Faro! El de Aurelio. Si te lo ha dado a ti… —Se calla—. Bueno. Él sabrá por qué.', cond: 'inParty("ampharos")' }] },
			{ text: 'Te lleva al establo. Sobre un lecho de paja limpia, una Miltank grande está tumbada de lado. Abre los ojos al oírte. No levanta la cabeza.' },
			{ prompt: '¿Qué haces por Canela?', choice: [
				{ text: 'Darle una Baya Aranja.', cond: 'has("oranberry")', then: [
					{ take: 'oranberry' },
					{ text: 'Le acercas la baya al hocico. Canela la huele mucho rato. Luego, muy despacio, la coge con los labios. Mastica. Una vez. Dos.' },
				] },
				{ text: 'Darle una botella de Leche Mu-mu.', cond: 'has("moomoomilk")', then: [
					{ take: 'moomoomilk' },
					{ say: 'granjera_muumuu', text: '¿Leche nuestra? ¿Para ella? —Se ríe, con los ojos mojados—. Es como darle a una abuela su propio guiso. A ver qué dice.' },
					{ text: 'Canela bebe un sorbo. Luego otro. Mueve la cola, apenas.' },
				] },
				{ text: 'Sentarte en la paja a su lado y acariciarla.', then: [
					{ text: 'Te sientas en la paja. Le acaricias el cuello, despacio, como se acaricia a un perro viejo. Canela suelta el aire por la nariz, largo, como un suspiro.' },
				] },
			] },
			{ if: RL, then: [
				{ text: '{riolu} se arrodilla junto a Canela y le pone una pata sobre el costado. El aura se le enciende, suave. No es para curar: {riolu} no sabe curar. Es como cuando alguien te pone la mano en la espalda para que sepas que está ahí.' },
				{ text: 'Canela gira la cabeza hacia {riolu}. Y por primera vez en semanas, según dice la granjera, apoya las patas delanteras y se incorpora un poco. Solo un poco.' },
			], else: [
				{ text: 'Canela gira la cabeza hacia ti. Y apoya las patas delanteras y se incorpora un poco. Solo un poco.' },
			] },
			{ say: 'granjera_muumuu', text: '¡Huy! ¡Huy, huy! ¡Antonio! ¡ANTONIO! ¡Que se ha sentado!' },
			{ text: 'Desde la casa se oye a un señor que contesta «¿Quién?», y luego un ruido de alguien que se tropieza con una silla.' },
			{ say: 'granjera_muumuu', text: 'No está curada, lo sé. Pero se ha sentado. Hoy se ha sentado. —Te pone las dos manos en la cara, como haría una abuela—. Gracias, cielo. Toma, aunque sea esto. Las dos últimas botellas buenas que nos quedaban.' },
			{ give: 'moomoomilk', n: 2 },
			{ say: 'granjera_muumuu', text: 'Si ves a Aurelio, dile que se tome el jarabe. Y que el pienso ese lo hemos tirado. Que tenía razón. Le encanta tener razón.' },
			{ rep: { johto: 2 } },
			{ intel: { npc: 'aurelio', text: 'La granjera de la Granja MuuMuu dice que pasó por allí hace poco, de vuelta de viaje, y que tosía. Él les aconsejó no usar el pienso «enriquecido» de la Fundación Raíces.' } },
		],
		b03_muumuu_despues: [
			{ if: 'flag.b03_aurelio_muerto && !flag.b03_muumuu_aurelio', then: [
				{ set: { 'flag.b03_muumuu_aurelio': true } },
				{ say: 'granjera_muumuu', text: 'Nos enteramos de lo de Aurelio. —Se queda mirando el cubo—. Antonio fue al entierro con la corbata de las bodas. Yo no pude ir: Canela no me deja sola. Le mandé una botella de leche a la sobrina. Es lo que él habría querido. Bueno, él habría querido dos.' },
			] },
			{ say: 'granjera_muumuu', text: 'Canela ya se levanta un ratito por las mañanas. Da poca leche, pero da. La vendemos en el puesto. Cara, porque es poca. Barata, porque es para ti.' },
			{ if: 'flag.b03_faro_hecho', then: [{ say: 'granjera_muumuu', text: 'Dicen que en Olivo una boticaria joven ha puesto el Faro en marcha con no sé qué brebaje. ¿Le podrías decir que se pase? Le pagamos en leche. Y en cariño. Más en leche.' }] },
		],
		b03_canela: [
			{ text: 'Canela está tumbada en la paja, con los ojos abiertos. Te mira. Respira despacio. No se levanta.' },
		],
		b03_canela_despues: [
			{ text: 'Canela está sentada en la paja, rumiando. Al verte, mueve las orejas. Es poco. Para ella, es mucho.' },
		],

		// =================== OLIVO ===================
		b03_olivo_llegada: [
			{ set: { 'flag.b03_olivo_llegada': true } },
			{ quest: 'b03_m2', stage: 'faro' },
			{ text: 'Olivo huele a sal y a pan. Las calles bajan todas hacia el puerto, empedradas y estrechas, con ropa tendida entre balcón y balcón.' },
			{ text: 'Y en el cabo, por encima de todo, el Faro. Una torre blanca, altísima, preciosa. Arriba, donde tendría que girar la luz, solo hay cristal oscuro. Un barco entra en el puerto tocando la sirena tres veces, despacio. Por si acaso.' },
			{ say: 'rotom', text: '¡Bzzt! Ciudad Olivo. Puerto, mercado, gimnasio de tipo Acero. Y el Faro de Olivo, cuya luz, según mis datos, se ve a cuarenta kilómetros. —Pausa—. Mis datos están desactualizados.' },
			{ if: FARO_AMIGO, then: [
				{ text: 'En tu cinturón, una Poké Ball se calienta. Faro, el Ampharos de Don Aurelio, se mueve dentro como si hubiera oído su nombre. O como si hubiera visto la torre.' },
			] },
			{ text: 'Junto a la puerta del gimnasio, un cartel escrito a mano con letra pequeña y redonda: «Cerrado. Lo siento mucho. Estoy en el Faro. — Y.»' },
		],
		b03_gym_olivo_cerrado: [
			{ text: 'La puerta del gimnasio está cerrada. El cartel, escrito con letra pequeña y redonda, dice: «**Cerrado.** Lo siento mucho. Estoy en el Faro. — Y.».' },
			{ text: 'Debajo, alguien ha pegado otra nota con celo: «Señorita, cuando pueda. Sin prisa. Los del gimnasio».' },
		],
		b03_olivo_pendiente: [
			{ say: 'rotom', text: '¡Bzzt! Repaso de Olivo:' },
			{ say: 'rotom', text: '• Subir al Faro y ver qué le pasa a la luz.', cond: '!flag.b03_yasmina_faro' },
			{ say: 'rotom', text: '• La boticaria Kaori viene de camino. Esperarla en la ciudad.', cond: 'quest.b03_t_kaori == "olivo"' },
			{ say: 'rotom', text: '• Alguien te hacía señas desde debajo de un muelle del puerto.', cond: '!flag.b03_noa_hecho' },
			{ say: 'rotom', text: '• Gimnasio de Olivo: vencer a Yasmina.', cond: 'flag.b03_faro_hecho && !beat("yasmina_g7")' },
			{ say: 'rotom', text: '• (Opcional) Hay una cabina telefónica en el puerto con alguien conocido dentro.', cond: '!flag.b03_rhi_cabina' },
			{ say: 'rotom', text: '• (Opcional) Bastien está en el muelle.', cond: '!flag.b03_bastien_olivo' },
			{ say: 'rotom', text: '• (Opcional) Una pluma gris en la barandilla del Faro.', cond: 'flag.b03_yasmina_faro && !flag.b03_ysolde_sede' },
			{ say: 'rotom', text: '¡Nada más! Bueno, nada más que yo sepa. Yo sé muchas cosas. Pero no todas.', cond: FIN_OK },
		],

		// =================== EL FARO ===================
		b03_yasmina_faro: [
			{ set: { 'flag.b03_yasmina_faro': true } },
			{ text: 'Subes. Y subes. La escalera de caracol no se acaba nunca. Por los ventanucos se ve el mar, cada vez más abajo, cada vez más grande.' },
			{ text: 'Arriba, en la sala de la linterna, todo es cristal y silencio. Una lente enorme, quieta. Y en el centro, tumbado sobre una manta de cuadros, un Ampharos con la cola apagada. La esfera roja de la punta, que debería brillar como un sol pequeño, es una canica sin luz.' },
			{ text: 'A su lado, sentada en el suelo con las piernas dobladas, una chica de pelo largo, oscuro, con un lazo. Le acaricia la frente con dos dedos. No te ha oído llegar. O te ha oído y no se ha atrevido a girarse.' },
			{ say: 'yasmina', text: 'Eh… —Casi no se oye—. ¿Hola? Perdona. No… no esperaba a nadie.' },
			{ say: 'yasmina', text: 'Soy Yasmina. La… la líder. Del gimnasio. Lo siento. Lo siento mucho. Está cerrado. No puedo bajar. No puedo dejarlo solo.' },
			{ say: 'yasmina', text: 'Se llama Amphy. Lleva toda la vida aquí. Más que yo. Mi abuelo era el farero y Amphy era su luz. Ahora… ahora es la mía. Bueno. Era.' },
			{ text: 'Amphy abre un ojo. Te mira. Hace un ruido muy bajito, como un «pa» sin fuerza, y vuelve a cerrarlo.' },
			{ say: 'yasmina', text: 'Empezó hace unas semanas. Primero brillaba menos. Luego tardaba en encenderse. Luego… —Le tiembla la voz. La deja temblar—. Los médicos dicen que está sano. Que no tiene nada. Pero no tiene… ganas. Es como si se lo hubieran quitado.' },
			{ if: 'flag.b02_kaori_muestra || flag.b02_kaori_caramelo', then: [
				{ text: 'Apagado. Sin ganas. Como las Eevee del Teatro de Danza. Kaori te lo dijo: «No estrecha nada. Le quita algo al Pokémon».' },
			] },
			{ if: RL, then: [
				{ text: '{riolu} se acerca a Amphy y se agacha. El aura se le enciende, azul, y la estira hacia el Ampharos como quien tiende una mano. Amphy no responde. {riolu} se queda muy quieto. Luego te mira, con las orejas bajas.' },
			] },
			{ prompt: 'Yasmina acaricia la frente de Amphy.', choice: [
				{ text: '«¿Le diste algo raro? ¿Algún regalo?»', then: [
					{ say: 'yasmina', text: '¿Regalo? —Lo piensa—. Un… un señor muy amable de una fundación. Trajo un suplemento. Para que brillara más en invierno. —Se le van los colores—. ¿Fue eso? ¿Fui yo?' },
					{ text: 'No contestas. Ella entiende que no lo sabes. Y que tampoco dices que no.' },
				] },
				{ text: '«Conozco a alguien que entiende de esto.»', then: [
					{ say: 'yasmina', text: '¿De verdad? —Te mira por primera vez directamente. Tiene los ojos cansados de no dormir—. ¿Alguien que…? Por favor. Lo que sea. Lo que haga falta.' },
				] },
				{ text: 'Sentarte en el suelo, al otro lado de Amphy.', then: [
					{ text: 'Te sientas. Amphy está entre los dos. Yasmina no dice nada, pero al cabo de un rato deja de acariciarle la frente con dos dedos y empieza a hacerlo con la mano entera. Como si ahora pudiera.' },
				] },
			] },
			{ text: 'Rotom vibra en tu bolsillo. Una llamada. Pone «Kaori (no contestes si es una tontería)».' },
			{ say: 'kaori', as: 'Kaori (llamada)', text: 'Me han dicho que el Faro de Olivo está a oscuras. Y que el Ampharos «no tiene nada». —Pausa—. «No tiene nada» es mi diagnóstico favorito. Siempre tiene algo.' },
			{ if: 'flag.b02_kaori_muestra', then: [
				{ say: 'kaori', as: 'Kaori (llamada)', text: 'Tengo algo. Con tu muestra de la Torre Quemada. Un antídoto. A medias. Nunca lo he probado en nada tan grande. Me encanta.' },
			], else: [
				{ say: 'kaori', as: 'Kaori (llamada)', text: 'Tengo algo. Hecho con lo poco que saqué de los caramelos. Un antídoto. A medias. Nunca lo he probado en nada tan grande. Me encanta.' },
			] },
			{ say: 'kaori', as: 'Kaori (llamada)', text: 'Voy en el autobús de Iris. Llego en un rato. Que no le den nada. Ni agua con azúcar. Ni cariño en exceso. El cariño en exceso también es un dato que me estropea.' },
			{ text: 'Cuelga sin despedirse.' },
			{ say: 'yasmina', text: '¿Era… era la persona que entiende?' },
			{ say: 'yasmina', text: 'Parece muy… segura. —Se lo piensa—. Me da un poco de miedo. Pero del bueno.' },
			{ quest: 'b02_t_kaori', done: true, cond: 'quest.b02_t_kaori' },
			{ quest: 'b03_t_kaori', stage: 'olivo' },
		],
		b03_yasmina_faro_espera: [
			{ say: 'yasmina', text: 'Sigue igual. Respira. Me mira. Pero no se enciende.' },
			{ if: 'quest.b03_t_kaori == "olivo"', then: [{ say: 'yasmina', text: 'Tu amiga… la boticaria. ¿Ha llegado ya? Dicen que el autobús de Iris para junto a la plaza. Yo… yo no puedo bajar. Lo siento.' }] },
		],
		b03_yasmina_faro_despues: [
			{ say: 'yasmina', text: 'Ha comido. Un poco. Ha subido la cola él solo para el turno de las diez. —Sonríe, apenas—. No brilla como antes. Pero brilla.' },
			{ if: '!beat("yasmina_g7")', then: [{ say: 'yasmina', text: 'El gimnasio está abierto. Te… te espero allí. Bajaré. Ahora sí puedo bajar.' }] },
		],
		b03_amphy: [
			{ text: 'Amphy está tumbado sobre la manta de cuadros. La esfera roja de su cola es una canica sin luz. Al acercarte abre un ojo, te mira un momento y lo vuelve a cerrar.' },
		],
		b03_amphy_despues: [
			{ text: 'Amphy está de pie junto a la lente. La esfera de su cola brilla pálida, rosada, como una brasa que no termina de apagarse. Al verte suelta un «¡pa!» que esta vez sí suena a algo.' },
			{ if: FARO_AMIGO, then: [{ text: 'En tu cinturón, la Poké Ball de Faro se calienta. Amphy mira hacia ella y hace dos destellos cortos con la cola. Como un saludo entre faros.' }] },
		],
		b03_bitacora: [
			{ text: 'Sobre una mesita, junto a la escalera, hay un cuaderno gordo de tapas de hule. «**BITÁCORA**», pone en la portada, con letra grande y torcida.' },
			{ say: 'yasmina', text: 'Es… es la bitácora del Faro. La del abuelo, y luego la mía. Llévatela si quieres. Bueno, no. Sí. Léela. Pero devuélvemela. Bueno, quédatela un tiempo. Ya me la devolverás.' },
			{ give: 'bitacorafaro' },
		],
		b03_bitacora_ya: [
			{ text: 'En la mesita queda el hueco de la bitácora, más limpio que el resto. Ahora la tienes tú.' },
		],
		b03_faro_mirar: [
			{ if: 'flag.b03_faro_hecho', then: [
				{ text: 'Desde la sala de la linterna se ve toda la costa: el puerto, las casas blancas, el muelle tres con su valla azul. El haz de luz pasa por encima de tu cabeza, despacio, cada pocos segundos.' },
			], else: [
				{ text: 'Desde la sala de la linterna se ve toda la costa: el puerto, las casas blancas, el muelle tres con su valla azul. Abajo, un barco espera en la bocana a que alguien le diga por dónde entrar.' },
			] },
			{ text: 'Al norte, muy lejos, una línea de montañas. Detrás, dicen, hay un lago donde los Gyarados se enfadan.', cond: 'flag.b03_faro_hecho' },
		],
		b03_faro_noche: [
			{ text: 'Es de noche. La lente gira despacio y el haz, pálido pero firme, barre el puerto: los barcos, el mercado cerrado, las barcas de los pescadores que salen ahora, una detrás de otra, siguiendo la luz.' },
			{ say: 'yasmina', text: 'La primera noche que vuelve… —Saca una cámara pequeña, de las desechables—. El abuelo hacía una foto cada vez que Amphy se recuperaba de algo. Un resfriado. Una tormenta. Tengo una caja llena.' },
			{ text: 'Hace la foto. El flash ilumina a Amphy, que pone cara de modelo ofendido. Yasmina se ríe por primera vez desde que la conoces.' },
			{ say: 'yasmina', text: 'Las desechables hacen dos fotos de cada. Bueno, no. Pero yo siempre hago dos. Toma. Esta es tuya.' },
			{ cutscene: { bg: { type: 'coast' }, start: 'dark', frames: [
				{ fx: 'light', item: 'fotofaro', text: 'Una foto pequeña, un poco movida: el haz del Faro cruzando el puerto de noche, y abajo, todas las barcas encendidas.' },
				{ text: 'Detrás, con letra pequeña y redonda: «La primera noche que volvió. — Y.»' },
			] } },
			{ give: 'fotofaro' },
		],

		// =================== KAORI Y EL ANTÍDOTO ===================
		b03_kaori_faro: [
			{ text: 'En la parada del autobús de Iris, sentada sobre una maleta de madera llena de frascos que tintinean, una chica con kimono sencillo, delantal de boticaria y un pasador de hoja en el pelo bosteza sin taparse la boca.' },
			{ say: 'kaori', text: 'Tú. —No se levanta—. Bien. Me ahorras preguntar el camino. Preguntar el camino es lo peor de viajar. Lo segundo peor es el autobús.' },
			{ if: 'flag.b02_kaori_muestra', then: [
				{ say: 'kaori', text: 'Tu muestra de la Torre Quemada. La he estudiado cuatro semanas. No he dormido seis noches. Dormir está sobrevalorado. Lo he comprobado.' },
			], else: [
				{ say: 'kaori', text: 'No tengo muestra limpia. Tengo polvo de caramelo raspado con una cuchilla y mucha cabezonería. A veces basta.' },
			] },
			{ text: 'Sube contigo al Faro. No se queja de la escalera. Cuenta los escalones en voz alta, monótona, hasta el último: «trescientos doce». Arriba, mira a Amphy, mira a Yasmina, mira la manta de cuadros. Lo mira todo antes de decir nada.' },
			{ say: 'yasmina', text: 'Eh… hola. Soy Yasmina. Gracias por venir. Mucho. Lo siento por… por las escaleras.' },
			{ say: 'kaori', text: 'Kaori. —Abre la maleta—. No me des las gracias. Todavía no he hecho nada. Y lo que voy a hacer puede no funcionar.' },
			{ text: 'Se arrodilla junto a Amphy. Le mira las encías, le levanta un párpado, le huele la lana. Le pone dos dedos en el cuello y cierra los ojos, contando.' },
			{ say: 'kaori', text: 'Lo mismo que las Eevee. Peor. Más tiempo. —Se gira hacia Yasmina—. ¿Le diste algo? ¿Un suplemento? ¿Un caramelo? ¿Algo azul que oliera demasiado dulce?' },
			{ text: 'Yasmina asiente. No le salen las palabras. Kaori la mira un momento con los ojos entrecerrados. Luego hace algo que no esperabas: le pone una mano en el hombro. Torpe. Rígida. Pero se la pone.' },
			{ say: 'kaori', text: 'Te lo dio alguien que sabía lo que hacía. Tú no. Eso no es culpa. Es un dato.' },
			{ text: 'Saca un frasco pequeño, de cristal ámbar, con un líquido que parece té muy cargado. Lo agita. Dentro brilla algo, apenas.' },
			{ say: 'kaori', text: 'Necesito que se quede quieto. Si se asusta y suelta una descarga, nos fríe a los tres. Bueno, a mí no. Llevo guantes de goma. A ustedes, sí.' },
			{ prompt: 'Kaori te mira. Necesita manos.', choice: [
				{ text: 'Sujetar la cabeza de Amphy con cuidado.', then: [
					{ af: { kaori: 5 } },
					{ text: 'Le sujetas la cabeza entre las manos. Está tibio. Amphy te mira y no se resiste. Kaori asiente, una sola vez: es lo más parecido a un «bien hecho» que le vas a oír.' },
				] },
				{ text: '«Que {riolu} lo calme con el aura.»', cond: RL, then: [
					{ af: { kaori: 4 } },
					{ text: '{riolu} se arrodilla junto a Amphy y le pone las dos palmas en el pecho. El aura azul se le extiende por los brazos, tranquila, como agua templada. Amphy deja de temblar.' },
					{ say: 'kaori', text: '…Eso no viene en ningún libro. —No aparta la vista—. Tengo que escribir un libro.' },
					{ happy: { who: 'riolu', n: 15 } },
				] },
				{ text: '«Que lo sujete Yasmina. A ella la conoce.»', then: [
					{ af: { kaori: 3 } },
					{ text: 'Yasmina se arrodilla y abraza la cabeza de Amphy contra el pecho. Le habla bajito, muy bajito, algo que no oyes. Amphy cierra los ojos.' },
					{ say: 'kaori', text: 'Bien pensado. El miedo se cura mejor con alguien conocido. —Pausa—. Eso tampoco viene en ningún libro. Pero es verdad.' },
				] },
			] },
			{ text: 'Kaori le da el frasco a gotas, entre los labios. Una. Dos. Diez. Cuenta en voz baja. Luego se sienta sobre los talones y espera. Todos esperáis.' },
			{ text: 'No pasa nada.' },
			{ text: 'Sigue sin pasar nada.' },
			{ if: FARO_AMIGO, then: [
				{ text: 'La Poké Ball de Faro se abre sola. El Ampharos de Don Aurelio sale a la sala de la linterna, mira alrededor y ve a Amphy en el suelo.' },
				{ text: 'Faro se acerca despacio, con esos pasos de abuelo tranquilo que aprendió en el rancho. Se agacha. Junta su frente con la de Amphy, como dos Mareep que se reconocen en el prado. La esfera de su cola se enciende, fuerte, y la acerca a la de Amphy hasta que se tocan.' },
				{ say: 'yasmina', text: '¿Se… se conocen?' },
				{ text: 'Te acuerdas de la bitácora. «El ranchero Prado dice que su Ampharos alumbra más que el nuestro». Hace mucho, Don Aurelio subió hasta aquí. O hasta la puerta. Con Faro.' },
			] },
			{ cutscene: { bg: { type: 'tower' }, start: 'dark', frames: [
				{ mon: 'ampharos', text: 'Amphy abre los ojos.' },
				{ fx: 'glow', text: 'En la punta de su cola, dentro de la canica roja, aparece un punto de luz. Pequeño. Como una cerilla en una habitación muy grande.' },
				{ fx: 'light', text: 'El punto crece. No mucho. Lo bastante. La esfera se pone rosa, luego roja, luego naranja, temblando, como una llama que alguien protege con la mano.' },
				{ text: 'La lente enorme recoge esa luz y la multiplica. Un haz pálido, débil, sale disparado por el cristal hacia el mar.' },
				{ fx: 'zoom', text: 'Abajo, en el puerto, un barco que esperaba en la bocana toca la sirena. Una vez, larga. Luego otra. Luego, desde el muelle, alguien aplaude. Luego mucha gente.' },
			] } },
			{ set: { 'flag.b03_faro_hecho': true } },
			{ say: 'yasmina', text: '…Amphy. Amphy. —No llora. Bueno, sí. Mucho. Bajito—. Lo siento. Lo siento. Gracias. Lo siento.' },
			{ say: 'kaori', text: 'Funciona a medias. —Lo dice mirando el frasco, no a Amphy—. Lo sostiene. No le devuelve lo que le quitaron. Le da algo para que no siga perdiéndolo.' },
			{ say: 'kaori', text: 'Oh. Esto es… precioso. —Pausa—. No lo digo por el veneno. Lo digo por la luz. Es la primera vez que lo digo por algo que no mata.' },
			{ if: FARO_AMIGO, then: [{ say: 'kaori', text: 'Y tu Ampharos ha hecho más que mi frasco. No sé cómo. Lo apunto como «factor emocional». Odio apuntar «factor emocional».' }] },
			{ say: 'kaori', text: 'Para curarlo de verdad necesito entender el mecanismo. Lo que les quita la luz. Y para eso necesito ver lo contrario: algo que la dé a la fuerza.' },
			{ say: 'kaori', text: 'Al norte, pasado Caoba, hay un lago. Dicen que los Magikarp evolucionan solos. De golpe. Sin querer. Que algo los obliga. —Te mira—. Tráeme agua de ese lago. Una muestra. Sin tocarla con los dedos.' },
			{ prompt: 'Kaori espera una respuesta. No parece que vaya a esperar mucho.', choice: [
				{ text: '«Te la traigo.»', then: [
					{ af: { kaori: 2 } },
					{ say: 'kaori', text: 'Ya lo sabía. Lo he preguntado por educación. Me esfuerzo en la educación.' },
				] },
				{ text: '«¿Y tú? ¿Cuándo duermes?»', then: [
					{ af: { kaori: 2 } },
					{ say: 'kaori', text: '¿Dormir? —Te mira como a un frasco con la etiqueta mal puesta—. Cuando el Faro brille entero. O cuando me desmaye. Lo que pase antes. Apostaría por lo segundo.' },
				] },
			] },
			{ quest: 'b03_t_kaori', stage: 'muestra' },
			{ quest: 'b03_m4', stage: 'reto' },
			{ say: 'yasmina', text: 'Eh… {jugador}. El gimnasio. —Se seca la cara con la manga—. Lo abro. Mañana. No, hoy. Ahora. Quiero… quiero darte las gracias como sé: con un combate de verdad.' },
			{ diary: 'Hoy mi entrenador{|a|e} subió trescientos doce escalones. ¡Los contó una chica muy seria con un kimono! Arriba vivía un Ampharos muy cansado que se llamaba Amphy.\n\nSeguro que era el invierno. Los Ampharos también se cansan en invierno, como las personas.\n\n¡Y luego se encendió! La luz salió por la ventana y todos los barcos pitaron a la vez. Fue como una fiesta de cumpleaños, pero con barcos.\n\nYasmina lloró. Pero llorar de alegría cuenta como estar contenta. ¡Lo he buscado!', cond: 'flag.b01_diario' },
			{ rep: { johto: 3 } },
			{ intel: { npc: 'kaori', text: 'Su antídoto parcial sostuvo a Amphy, el Ampharos del Faro de Olivo, apagado por un «suplemento» de la Fundación Raíces. «Funciona a medias». Para entender el mecanismo te pide una muestra de agua del Lago de la Furia, donde algo hace evolucionar a los Magikarp a la fuerza.' } },
			{ intel: { npc: 'yasmina', text: 'Líder de Olivo (Acero). Nieta del farero. No bajaba del Faro porque Amphy, su Ampharos, estaba apagado tras tomar un «suplemento» de la Fundación Raíces.' } },
		],

		// =================== GIMNASIO DE OLIVO ===================
		b03_yasmina_antes: [
			{ say: 'yasmina', text: 'Eh… hola. Gregorio y Amalia primero, por favor. Son muy buenos. Llevan semanas abriendo el gimnasio cada mañana, por si yo volvía. —Se le ponen las mejillas rojas—. Se lo debo.' },
		],
		b03_yasmina_reto: [
			{ text: 'Yasmina deja la taza de té sobre la tarima, despacio, sin que haga ruido. Se pone de pie. Es más alta de lo que parecía sentada en el suelo del Faro.' },
			{ say: 'yasmina', text: 'El abuelo decía que el acero y la luz se parecen. Los dos aguantan. Los dos se ven desde lejos.' },
			{ say: 'yasmina', text: 'Yo… yo no aguanté. Cuando Amphy se apagó, me apagué con él. Cerré el gimnasio. Dejé de comer. Dejé de bajar.' },
			{ say: 'yasmina', text: 'Y tú subiste. —Sonríe—. Así que voy a combatir como si fuera el día más importante del año. Porque lo es.' },
			{ battle: 'yasmina_g7', onWin: [
				{ text: 'Steelix se tumba en el suelo de metal con un ruido como de campana. Yasmina se acerca, le pone la mano en la frente y le dice algo muy bajito. Steelix cierra los ojos.' },
				{ say: 'yasmina', text: 'Eres… eres muy fuerte. Y no de la manera que pensaba. —Se saca algo del bolsillo—. La **Medalla Mineral**. Es de Olivo. Brilla como el Faro cuando le da el sol.' },
				{ badge: 'medalla_mineral' },
				{ cap: 48 },
				{ quest: 'b03_m4', done: true },
				{ say: 'yasmina', text: 'Y… esto. Es un **Revestimiento Metálico**. El abuelo lo guardaba en la caja de las fotos. Hace que algunos Pokémon se vuelvan de acero cuando se intercambian. O que pegue más fuerte el acero, si lo llevan encima.' },
				{ give: 'metalcoat' },
				{ heal: 'Yasmina te sirve una taza de té de jazmín. Mientras te la bebes, sus entrenadores curan a tu equipo con un cuidado de joyeros.' },
				{ say: 'yasmina', text: 'Siete medallas. —Te mira la caja—. Ya casi. Lo que sea que te espera después… espero que tengas siempre un faro. O alguien que suba las escaleras.' },
				{ intel: { npc: 'yasmina', text: 'Te dio la Medalla Mineral y un Revestimiento Metálico que guardaba su abuelo el farero.' } },
				{ call: 'b03_t1_fin', cond: FIN_OK },
			] },
		],
		b03_yasmina_despues: [
			{ say: 'yasmina', text: 'Amphy ha bajado hoy al gimnasio. Por primera vez en semanas. Ha visto el combate de la mañana desde la grada y ha hecho «pa» cada vez que alguien acertaba. Creo que es su forma de aplaudir.' },
			{ say: 'yasmina', text: 'Sube al Faro cuando quieras. De noche es más bonito. Hago té.' },
		],

		// =================== NOA BAJO EL MUELLE ===================
		b03_noa_muelle: [
			{ set: { 'flag.b03_noa_hecho': true } },
			{ quest: 'b02_t_noa', done: true, cond: 'quest.b02_t_noa' },
			{ quest: 'b03_t_noa', stage: 'datos' },
			{ text: 'Debajo del muelle dos, entre pilotes cubiertos de algas y cangrejos que se apartan, hay un hueco seco donde los pescadores guardan redes viejas. Huele a sal y a madera podrida. Desde el paseo no se ve. Desde el agua, tampoco.' },
			{ text: 'Noa Lambert está sentada sobre una caja de pescado vacía. La chaqueta de Lemnis, del revés. El pelo, que siempre llevaba en un moño perfecto, a medio caer. Tiene ojeras de una semana.' },
			{ say: 'noa', text: 'Aquí no hay cámaras. Lo he mirado cinco veces. Las del puerto apuntan al muelle tres. Todas. Eso también es un dato, ¿no? Que todas apunten al tres.' },
			{ say: 'noa', text: 'Me han cambiado la tarjeta de acceso. Antes era azul. Ahora es gris. Las grises no abren el piso cuatro. Nadie me ha dicho por qué. Me han dicho «reorganización». Me han sonreído mucho.' },
			{ say: 'noa', text: 'Pero antes de que me la cambiaran, saqué esto.' },
			{ text: 'Te da unas hojas dobladas, impresas por las dos caras. Columnas de fechas, matrículas de barco, números de lote. En la cabecera, una lemniscata y «**Logística · Envíos N-02**».' },
			{ text: 'Cada martes y cada viernes de los últimos tres meses. Origen: el centro de procesamiento de Luminalia, por la Puerta «apagada». Escala: un barco, el *Marea Quieta*, sin bandera. Puerto de descarga: **Olivo, muelle 3**. Destino final: «N-02 · Excavación de patrimonio». Recibe: **Fundación Raíces de Johto**.' },
			{ say: 'noa', text: 'Excavación de patrimonio. —Se ríe, sin ganas—. Les meten en cajas, los suben a un barco y los llevan a una excavación. ¿Para qué quiere una excavación cuarenta Pokémon a la semana?' },
			{ if: 'flag.b03_nodo02', then: [
				{ text: 'Le cuentas lo de las Ruinas Alfa. Que N-02 no es un almacén ni una región. Que es un sitio. Un nodo. Que lo has visto.' },
				{ say: 'noa', text: '…Un nodo. —Se queda muy quieta—. Como un enchufe. Algo a lo que se conecta algo.' },
				{ say: 'noa', text: 'Y yo les llevaba los Pokémon. Con mis manos. Les decía «te vas a casa».' },
			] },
			{ text: 'Por encima del muelle pasa alguien. Pasos de bota, despacio. Noa se encoge sobre la caja y se tapa la boca con la mano. Los pasos siguen. Se pierden. Tarda mucho en volver a respirar normal.' },
			{ if: 'flag.b02_cetoddle', then: [
				{ if: 'inParty("cetoddle") || inParty("cetitan")', then: [
					{ text: 'Tu Poké Ball se mueve sola. Escarcha, o como lo llames, quiere salir. Lo dejas. Va directo a Noa y se le sube a las rodillas, frío como un cubito.' },
					{ say: 'noa', text: 'Hola. Hola, tú. Estás enorme. Estás… —Le hunde la cara en el pelaje—. El agua de aquí es fría, ¿a que sí? Te gusta. Te gusta el mar frío. No lo sabía. Ahora lo sé.' },
				], else: [
					{ say: 'noa', text: '¿Y Escarcha? ¿Está bien? ¿Tiene frío del bueno? Aquí el agua es fría, le gustaría. Tráelo algún día. Si sigo… si estoy por aquí.' },
				] },
			] },
			{ if: 'flag.b02_cetoddle_noa', then: [
				{ say: 'noa', text: 'Escarcha está en mi habitación del hostal. En la bañera, con hielo. La dueña cree que tengo un problema con el calor. Tengo un problema, sí. No es el calor.' },
			] },
			{ if: 'flag.b02_noa_trigal', then: [
				{ say: 'noa', text: '¿Has visto a Bastien? Está en el puerto. Lleva la insignia. —Casi sonríe—. Por si acaso.' },
			] },
			{ say: 'noa', text: 'Si me pasa algo… —Te mira. Esta vez no dice «nada»—. Si me pasa algo, esas hojas las tienes tú. Y quien tú quieras. No yo.' },
			{ choice: [
				{ text: '«No te va a pasar nada. No lo voy a permitir.»', then: [
					{ say: 'noa', text: 'Qué bonito. —Te aprieta la mano un segundo—. No me lo creo. Pero qué bonito.' },
				] },
				{ text: '«Deberías dejarlo. Salir de Lemnis. Ya.»', then: [
					{ say: 'noa', text: 'Si lo dejo, dejo de ver. Y si dejo de ver, nadie ve. —Se pone de pie, se recoge el pelo con un gesto rápido—. Un poco más. Solo un poco más.' },
				] },
				{ text: 'Darle tu chaqueta. Está temblando.', then: [
					{ text: 'Se la pones por los hombros. Ella no dice nada. Se la ciñe. Al cabo de un rato te la devuelve, doblada, como si la hubiera planchado con las manos.' },
					{ say: 'noa', text: 'Gracias. Hacía mucho que nadie… Da igual. Gracias.' },
				] },
			] },
			{ text: 'Noa sale por el otro lado de los pilotes, por una escalerilla que da a la playa. No mira atrás. Camina rápido, con la cabeza baja, como quien ya sabe que la siguen.' },
			{ quest: 'b03_t_noa', stage: 'abierto' },
			{ intel: { npc: 'noa', text: 'Te dio el registro de «Envíos N-02»: cada martes y viernes, desplazados del centro de Luminalia pasan por la Puerta «apagada», embarcan en el *Marea Quieta* (sin bandera), descargan en el muelle 3 de Olivo y acaban en la «excavación de patrimonio» de la Fundación Raíces. Le han cambiado la tarjeta de acceso. Está muy asustada.' } },
			{ diary: 'Hoy, en el puerto de Olivo, nos encontramos con la doctora Lambert. ¡Qué casualidad, tan lejos de Kalos! Estaba muy cansada. Debería dormir más; los del puerto madrugan muchísimo.\n\nMi entrenador{|a|e} y ella charlaron un ratito a la sombra del muelle, que hacía fresco. Luego ella se fue por la playa. ¡Le gusta pasear!\n\nEl mar de Olivo es muy frío y muy transparente. Se ven estrellas de mar en el fondo. Algunas se mueven. ¡Esas son las mejores!', cond: 'flag.b01_diario' },
			{ set: { 'flag.b03_noa_doctora': true }, cond: 'flag.b01_diario' },
			{ call: 'b03_t1_fin', cond: FIN_OK },
		],

		// =================== YSOLDE Y LOS VENCEJOS ===================
		b03_ysolde_sede: [
			{ set: { 'flag.b03_ysolde_sede': true } },
			{ quest: 'b01_t_vencejos', done: true, cond: 'quest.b01_t_vencejos' },
			{ quest: 'b02_t_vencejos', done: true, cond: 'quest.b02_t_vencejos' },
			{ quest: 'b03_t_vencejos', stage: 'sede' },
			{ text: 'En la barandilla de la sala de la linterna hay una pluma gris clavada en la madera. Apunta, como una flecha, al tejado de la casa de enfrente: una aduana vieja, con una veleta oxidada en forma de pájaro.' },
			{ text: 'Sentada en la veleta, con las piernas cruzadas, como quien se sienta en un banco, hay una figura con capucha gris.' },
			{ text: 'Bajas del Faro, cruzas la calle, subes por una escalera de incendios que alguien ha dejado convenientemente desplegada. Cuando llegas al tejado, ella ya te está mirando.' },
			{ go: 'sede_vencejos' },
			{ if: 'flag.b02_ysolde_trigal || flag.b01_enc_ysolde_3', then: [
				{ say: 'ysolde', text: 'Mira quién ha subido. Has tardado cuatro minutos. La última Pluma tardó once. Se perdió en la escalera de incendios. Hay una sola escalera de incendios.' },
			], else: [
				{ say: 'ysolde', as: 'Encapuchada', text: 'Ysolde. Ya nos hemos visto. Tú a mí, poco; yo a ti, bastante. —Una sonrisa breve—. Has tardado cuatro minutos. Está bien.' },
			] },
			{ say: 'ysolde', text: 'Bienvenid{o|a|e} al nido. El de Johto. Te dije en Trigal que era viejo. Mira las vigas.', cond: 'flag.b02_ysolde_trigal' },
			{ say: 'ysolde', text: 'Bienvenid{o|a|e} al nido. El de Johto. Es viejo. Más viejo que esta ciudad. Mira las vigas.', cond: '!flag.b02_ysolde_trigal' },
			{ text: 'En las vigas del palomar abandonado hay plumas grises clavadas en fila. Decenas. Cada una con algo grabado en el cañón: una fecha, una inicial. Las primeras están tan secas que parecen de papel.' },
			{ say: 'ysolde', text: 'Una pluma por cada Vencejo que ha subido aquí por primera vez. La más vieja tiene más años que el Faro. Desde este tejado se ve el muelle tres. Desde siempre se ha visto lo que entra por el mar.' },
			{ say: 'ysolde', text: 'Los Vencejos no vigilamos a una empresa. Vigilamos a un tipo de persona. La que quiere una energía que no se acaba. —Mira hacia el norte, hacia donde no hay nada que ver—. Siempre ha habido alguien así. Antes de Lemnis. Antes de las Puertas. Antes que todo esto.' },
			{ choice: [
				{ text: '«¿Cuánto antes?»', then: [
					{ say: 'ysolde', text: 'Eso es de rango Cumbre. Yo soy Ala. —Se encoge de hombros—. Sé que la primera pluma la clavó alguien que había visto una guerra. Y que esa guerra terminó con una flor.' },
				] },
				{ text: '«¿Y qué entra por el muelle tres?»', then: [
					{ say: 'ysolde', text: 'Cajas. Martes y viernes. El barco se llama *Marea Quieta*. Ningún mar está quieto. Por eso me fijé.' },
					{ if: 'flag.b03_noa_hecho', then: [{ say: 'ysolde', text: '…Pero eso ya lo sabes. Te he visto bajo el muelle dos. —Pausa—. Ella también tiene a alguien que la mira. No soy yo.' }] },
				] },
				{ text: '«¿Por qué me lo enseñas a mí?»', then: [
					{ say: 'ysolde', text: 'Porque las fichas que se dan cuenta dejan de ser fichas. Y tú te has dado cuenta de varias cosas.' },
				] },
			] },
			{ say: 'ysolde', text: 'Rangos. Te los digo en orden, que me los preguntan siempre: **Pluma**, **Ala**, **Vencejo**, **Cumbre**. Para ser Pluma hay que hacer una cosa. Solo una.' },
			{ text: 'Señala el borde del tejado. Abajo, muy abajo, el agua del puerto. Clara, fría, con una barca de pescadores que pasa justo en ese momento con una red tendida a popa.' },
			{ say: 'ysolde', text: 'Un salto de fe. Al agua. La barca de las cinco menos cuarto pasa con la red abierta. Siempre. —Mira su reloj—. Son las cinco menos cuarto.' },
			{ if: RL, then: [{ text: '{riolu} se asoma al borde, mira el agua, te mira a ti. Tiene la cara exacta de alguien que no piensa saltar pero que va a saltar si saltas tú.' }] },
			{ prompt: 'El borde del tejado. El agua. La red.', choice: [
				{ text: 'Saltar.', then: [
					{ cutscene: { bg: { type: 'coast' }, start: 'light', frames: [
						{ fx: 'zoom', text: 'Das un paso al vacío. El aire te silba en los oídos. Las casas blancas suben a toda velocidad. Un Wingull te mira pasar con cara de profesional ofendido.' },
						{ fx: 'shake', text: 'Caes en la red. Blanda. Llena. Llena de Magikarp.' },
						{ fx: 'flash', text: 'Cuarenta Magikarp saltan a la vez, indignados, y te llenan de escamas. El pescador de la barca no se inmuta: se limita a apuntar algo en una libreta. «Otra Pluma», murmura. «Van tres este año».' },
					] } },
					{ set: { 'flag.b03_vencejo_pluma': true } },
					{ say: 'ysolde', text: 'Desde el tejado, sin levantar la voz, pero se oye igual: «Pluma. Bienvenid{o|a|e}. La categoría más baja de la hermandad. Enhorabuena».' },
					{ say: 'rotom', text: '¡Bzzt! Altura del salto: catorce metros. Velocidad de impacto: mucha. Magikarp por metro cuadrado: demasiados. …Ha salido bien. Otra vez. Ya no sé qué pensar de esta gente.' },
					{ text: 'Cuando vuelves al tejado, chorreando, hay una pluma nueva clavada en la última viga. En el cañón, todavía fresco, alguien ha grabado tu inicial.' },
					{ intel: { npc: 'ysolde', text: 'Te nombró Pluma de los Vencejos tras el salto de fe al puerto de Olivo. El nido de Johto está en el tejado de la vieja aduana, frente al Faro y con vistas al muelle 3.' } },
				] },
				{ text: '«Hoy no. Prefiero bajar por la escalera.»', then: [
					{ say: 'ysolde', text: 'La escalera también es una opción. Más lenta. Más seca. —Ni se inmuta—. La pluma no caduca. El salto tampoco. La barca pasa todos los días a las cinco menos cuarto.' },
					{ intel: { npc: 'ysolde', text: 'Te enseñó el nido de los Vencejos en Johto, en el tejado de la vieja aduana de Olivo. Para ser Pluma hay que dar un salto de fe al puerto. No saltaste. Todavía.' } },
				] },
			] },
			{ say: 'ysolde', text: 'Un consejo de Ala, gratis: los de las cajas no son los que deciden. Son los que firman. El que decide nunca está en el muelle.' },
			{ text: 'La barca de los Magikarp se aleja. Cuando te giras, Ysolde ya no está en la veleta. Solo queda la veleta, que gira un poco, como si alguien acabara de bajarse.' },
			{ quest: 'b03_t_vencejos', stage: 'abierto' },
		],
		b03_ysolde_despues: [
			{ if: 'flag.b03_vencejo_pluma', then: [
				{ say: 'ysolde', text: 'Pluma. —Ni te mira—. Siéntate. Mira el muelle tres. No digas nada. Así se entrena una Pluma: mirando sin hablar. Lo haces fatal. Mejorarás.' },
			], else: [
				{ say: 'ysolde', text: 'La barca pasa a las cinco menos cuarto. Todos los días. Yo solo lo digo.' },
				{ choice: [
					{ text: 'Saltar ahora.', then: [
						{ text: 'Das un paso al vacío. Catorce metros. Una red. Cuarenta Magikarp indignados. El pescador apunta algo en su libreta sin levantar la vista.' },
						{ set: { 'flag.b03_vencejo_pluma': true } },
						{ say: 'ysolde', text: '«Pluma. Bienvenid{o|a|e}». —Desde arriba, sin levantar la voz—. «Has tardado. Está bien. La fe también tiene horario».' },
						{ text: 'Cuando vuelves al tejado, chorreando, hay una pluma nueva clavada en la última viga, con tu inicial.' },
					] },
					{ text: 'Hoy tampoco.', then: [{ say: 'ysolde', text: 'Hoy tampoco. Anotado. No en ningún sitio. Pero anotado.' }] },
				] },
			] },
		],
		b03_plumas_palomar: [
			{ text: 'Plumas grises en fila, clavadas en las vigas. Las de abajo son recientes; las de arriba, tan viejas que se deshacen si las miras mucho. En el cañón de cada una, una fecha y una inicial.' },
			{ text: 'La más alta, casi en el caballete del tejado, no tiene fecha. Solo un dibujo diminuto, grabado con algo muy fino: una flor de cinco pétalos.' },
			{ text: 'Al final de la última viga, una pluma nueva con tu inicial.', cond: 'flag.b03_vencejo_pluma' },
		],

		// =================== BASTIEN ===================
		b03_bastien_olivo: [
			{ set: { 'flag.b03_bastien_olivo': true } },
			{ quest: 'b03_t_bastien', stage: 'olivo' },
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ text: 'Bastien está sentado al borde del muelle, con los pies colgando sobre el agua y la chaqueta de Lemnis impecable. Escribe en su libreta de tapas de cuero. Al verte, la cierra de golpe, como si le hubieras pillado con un diario.' },
				{ say: 'bastien', text: '¡{jugador}! Justo estaba… haciendo cuentas. —Abre la libreta y te la enseña, rojo—. Mira.' },
				{ text: 'Primera página: «**Le debo a {jugador}: 1.**» Debajo, en otra tinta: «Pagado: nada que valga». Debajo, en otra: «Sigue debiendo: 1». Y en la página siguiente, una lista nueva: «**Le debo a Noa:** una insignia. Un "por si acaso". Algo que todavía no sé qué es».' },
				{ text: 'En la solapa de la chaqueta, por dentro, donde solo se ve si la abre, brilla la insignia de hojalata del Froakie sin logo.', cond: 'flag.b02_noa_trigal' },
				{ say: 'bastien', text: 'Lemnis me ha mandado a Olivo a hacer «presencia de marca» en el puerto. Que me vean. Que sonría. —Señala el muelle tres, con su valla azul y plata—. Me han dicho que no me acerque a ese muelle. Que no es fotogénico.' },
			] },
			{ if: 'flag.b01_bastien_rompe', then: [
				{ text: 'Bastien está sentado al borde del muelle, con los pies colgando sobre el agua. Lleva la misma cazadora de pana con el codo remendado. Ahora tiene el otro codo remendado también. En la solapa, bien a la vista, la insignia de hojalata de un Froakie sin logo.', cond: 'flag.b02_noa_trigal' },
				{ text: 'Bastien está sentado al borde del muelle, con los pies colgando sobre el agua. Lleva la misma cazadora de pana con el codo remendado. Ahora tiene el otro codo remendado también.', cond: '!flag.b02_noa_trigal' },
				{ say: 'bastien', text: '¡{jugador}! Mira esto. —Te enseña la libreta, muy orgulloso—. Contabilidad de un hombre libre.' },
				{ text: 'En la primera página: «**Ingresos:** combates ganados, 3. Una propina de un pescador por ayudarle con una red. **Gastos:** sopa del Centro Pokémon, gratis. Abogados de Lemnis, incalculable. **Deudas:** a mi padre, ninguna (no le dejo). A {jugador}, una comida con manteles».' },
				{ say: 'bastien', text: 'Trabajo en el puerto por las mañanas descargando cajas. Me pagan en pescado. Greninja está encantado. Yo menos. Pero es mío. Todo lo mío es mío.' },
				{ say: 'bastien', text: 'Las cajas del muelle tres no las descarga nadie del puerto. Viene gente de fuera. Con guantes. —Baja la voz—. Me lo dijeron el primer día: «Esas, ni mirarlas».' },
			] },
			{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe', then: [
				{ text: 'Bastien está de pie al final del muelle, delante de un fotógrafo de Lemnis que le pide que sonría «más natural». Lleva la chaqueta azul y plata. Sonríe más natural. Parece una foto de sí mismo.' },
				{ text: 'Cuando el fotógrafo se va, Bastien se sienta en un bolardo y se queda mirando el agua. Saca una libreta pequeña. La abre. Te ve.' },
				{ say: 'bastien', text: 'Ah. {jugador}. —Cierra la libreta. Luego, despacio, la vuelve a abrir—. ¿Sabes qué apunto aquí?' },
				{ text: 'La primera página tiene un título: «**Cosas que no dije.**» Debajo, una lista. La primera línea: «Cueva Brillante. Cajas. Logo». La segunda: «A {jugador}: que tenía razón».' },
				{ text: 'En el puño cerrado, apretada, la insignia de hojalata del Froakie sin logo. No se la ha puesto. Pero no la suelta.', cond: 'flag.b02_noa_trigal' },
				{ say: 'bastien', text: 'Ya lo he dicho. La segunda. Una menos. —No te mira—. Me quedan muchas.' },
			] },
			{ if: 'flag.b03_noa_hecho', then: [
				{ say: 'bastien', text: 'He visto a Noa esta mañana. De lejos. Iba por la playa con la cabeza baja, muy deprisa. La he llamado y no se ha girado. —Se muerde el labio—. Ella siempre se gira.' },
			], else: [
				{ say: 'bastien', text: '¿Has visto a Noa? Me dijo que venía a Olivo. Me dijo «por trabajo». Lo dijo raro. Como quien dice «por si acaso».' },
			] },
			{ say: 'bastien', text: 'Bueno. —Se levanta y se sacude los pantalones—. ¿Combate? Lo apunto en la libreta, gane o pierda. Pero cura a los tuyos antes. Quiero que cuente.' },
			{ choice: [
				{ text: '«Vamos.»', then: [{ call: 'b03_bastien_combate' }] },
				{ text: '«Ahora no, Bastien.»', then: [
					{ say: 'bastien', text: 'Vale. Lo apunto como «pendiente». Las cuentas pendientes son las que más pesan. Y las que mejor se pagan.' },
				] },
			] },
		],
		b03_bastien_revancha: [
			{ say: 'bastien', text: '¿Ahora sí? Libreta abierta, página nueva.' },
			{ call: 'b03_bastien_combate' },
		],
		b03_bastien_combate: [
			{ prompt: '¿Curar al equipo antes del combate?', choice: [
				{ text: 'Sí, pasar por el Centro primero.', then: [{ heal: 'Bastien te acompaña al Centro Pokémon. Mientras la enfermera atiende a tu equipo, él apunta algo en la libreta y lo tacha. Lo vuelve a escribir.' }] },
				{ text: 'No hace falta.', then: [{ say: 'bastien', text: '¿Seguro? —Te lanza una Hiperpoción—. Insisto. Cláusula mía, no de Lemnis.' }, { heal: 'Curas a tu equipo con lo que te da Bastien.' }] },
			] },
			{ battle: 'bastien_4', lose: 'continue',
				onWin: [
					{ text: 'Greninja se deshace en agua y vuelve a la Poké Ball. Bastien abre la libreta, escribe algo y te la enseña.' },
					{ text: '«Combate en Olivo: perdido. Bien perdido.»' },
					{ if: 'flag.b01_bastien_cubierto', then: [{ say: 'bastien', text: 'Te sigo debiendo una. No te creas que esto lo salda. Esto es aparte. Esto es un regalo. Para mí.' }] },
					{ if: 'flag.b01_bastien_rompe', then: [{ say: 'bastien', text: 'Me sienta mejor que el pescado. Y eso que hoy era lubina.' }] },
					{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe', then: [
						{ say: 'bastien', text: '«Cosas que no dije», línea tres: «Me alegro de que seas tú quien me gana». —Tacha la línea—. Dicha.' },
					] },
					{ quest: 'b03_t_bastien', done: true },
					{ intel: { npc: 'bastien', text: 'En Olivo lleva una libreta de deudas y cosas pendientes. Lemnis le ha prohibido acercarse al muelle 3. Está preocupado por Noa.' } },
				],
				onLose: [
					{ say: 'bastien', text: 'Lo apunto. Con buena letra. —Te tiende la mano para levantarte—. Vuelve cuando quieras. Me sienta bien igual.' },
					{ heal: true },
				] },
		],
		b03_bastien_despues: [
			{ if: 'flag.b01_bastien_rompe', then: [
				{ say: 'bastien', text: 'Hoy me han pagado en pulpo. Greninja no sabe qué hacer con el pulpo. El pulpo tampoco sabe qué hacer con Greninja. Están negociando.' },
			], else: [
				{ say: 'bastien', text: 'Página nueva. Esta vez arriba no pone ningún nombre. Pone «Olivo». A ver qué apunto.' },
			] },
			{ if: 'flag.b03_noa_hecho', then: [{ say: 'bastien', text: 'Si ves a Noa… dile que la insignia la llevo. Que la llevo puesta. Bueno, díselo como te salga.' }] },
		],

		// =================== RHI ===================
		b03_rhi_cabina: [
			{ set: { 'flag.b03_rhi_cabina': true } },
			{ text: 'La cabina roja del puerto tiene el cristal rayado y una pegatina de un equipo de fútbol de Galar medio arrancada. Dentro hay alguien con el pelo rojo atado alto y una chaqueta con el número 9. De espaldas. Con el auricular pegado a la oreja y la frente apoyada en el cristal.' },
			{ text: 'No quieres escuchar. Pero la puerta no cierra bien.' },
			{ say: 'rhi', text: '…No. No, papá. No me digas que estás bien. Lo dices como cuando perdíamos tres a cero y decías que el partido no había acabado.' },
			{ say: 'rhi', text: '…¿Veinte años? ¿Y te lo dicen por carta? —Silencio largo—. ¿Y Nate lo sabía? …Claro que lo sabía. Nate lo sabe todo y no dice nada. Es su superpoder. Es un superpoder horrible.' },
			{ say: 'rhi', text: '…Vale. Vale. Sí. Yo también. —Muy bajito—. Yo también, papá.' },
			{ text: 'Cuelga. Se queda quieta, con la mano en el auricular colgado, un rato. Luego empuja la puerta de la cabina con el hombro y sale. Te ve.' },
			{ text: 'Durante un segundo, solo uno, tiene la cara de un portero que acaba de ver entrar el balón. Luego la recoloca. Como quien se ata las botas.' },
			{ say: 'rhi', text: '¿Llevas mucho ahí? No contestes. No quiero saberlo.' },
			{ quest: 'b03_t_rhi', stage: 'llamada' },
			{ say: 'rhi', text: 'No me preguntes. No me mires con esa cara. No me pongas la mano en el hombro, que te muerdo.' },
			{ say: 'rhi', text: 'Lo que sí puedes hacer es jugar. Ahora. Aquí. Un partido. Me hace falta correr detrás de algo o me pongo a pegarle patadas a la cabina, y la cabina no tiene la culpa.' },
			{ choice: [
				{ text: '«Vamos. Pero curamos antes.»', then: [{ call: 'b03_rhi_combate' }] },
				{ text: '«¿Quieres hablar de ello?»', then: [
					{ af: { rhi: -1 } },
					{ say: 'rhi', text: 'No. —Te mira mal. Muy mal—. Quiero jugar. Si me ganas limpio, a lo mejor hablo. A lo mejor. Eso es lo que hay.' },
					{ choice: [
						{ text: '«Pues juguemos.»', then: [{ call: 'b03_rhi_combate' }] },
						{ text: '«Otro día, Rhi.»', then: [{ say: 'rhi', text: 'Otro día. Vale. —Se sienta en un bolardo—. Aquí estaré. Dando toques. No pienso moverme. Bueno, me moveré para comer.' }] },
					] },
				] },
				{ text: '«Otro día, Rhi.»', then: [
					{ say: 'rhi', text: 'Otro día. Vale. —Se sienta en un bolardo y saca una Poké Ball para dar toques—. Aquí estaré. No pienso moverme. Bueno, me moveré para comer.' },
				] },
			] },
		],
		b03_rhi_revancha: [
			{ say: 'rhi', text: '¿Partido? —Atrapa la Poké Ball en el aire—. Ya era hora. Llevo trescientos toques. Trescientos dos.' },
			{ call: 'b03_rhi_combate' },
		],
		b03_rhi_combate: [
			{ prompt: '¿Curar al equipo antes del combate?', choice: [
				{ text: 'Sí, pasar por el Centro.', then: [{ heal: 'Pasas por el Centro Pokémon. Cuando sales, Rhi está dando toques a una Poké Ball con el empeine. No ha fallado ni uno. Se nota que lleva rato concentrándose en no fallar.' }] },
				{ text: '«Así estoy bien.»', then: [
					{ say: 'rhi', text: 'Ni hablar. —Te lanza un puñado de Superpociones sin mirar—. Te quiero entero. Si gano, que sea a todo.' },
					{ heal: 'Curas a tu equipo con las Superpociones de Rhi.' },
				] },
			] },
			{ battle: 'rhi_4', lose: 'continue',
				onWin: [
					{ af: { rhi: 6 } },
					{ text: 'Cinderace cae de rodillas. Rhi lo recoge, lo abraza contra el pecho un segundo más de lo normal. Luego se sienta en el bolardo. Da unas palmadas en el de al lado.' },
					{ call: 'b03_rhi_cuenta' },
				],
				onLose: [
					{ af: { rhi: 1 } },
					{ say: 'rhi', text: '¡Golazo! —Lo grita, pero no lo celebra. Se queda mirando el mar—. No te lo cuento. Ya sabes las reglas. Vuelve cuando quieras ganarme limpio.' },
					{ heal: true },
				] },
		],
		b03_rhi_cuenta: [
			{ say: 'rhi', text: 'Vale. Me has ganado limpio. Las reglas son las reglas.' },
			{ say: 'rhi', text: 'Mi padre trabajaba en un estadio de Macro Cosmos. No de entrenador. Cuidaba el césped. Veinte años. Decía que un campo bien cuidado juega solo. Que él era el jugador número doce de todos los partidos.' },
			{ say: 'rhi', text: 'Le han despedido. «Reestructuración». Han cambiado de dueños. Bueno, de dueños no. Ha entrado dinero nuevo, de un socio que no sale en ningún sitio, y lo primero que han hecho es cambiar el césped por uno de plástico. Ya no hace falta nadie que lo cuide.' },
			{ say: 'rhi', text: 'La carta de «estoy orgulloso» la escribió el día que se lo dijeron. Antes de contármelo. —Se ríe, corto, sin ganas—. Me estaba diciendo adiós. A su campo. Y me lo dijo a mí porque era lo único que le quedaba por decir bien.' },
			{ text: 'Rhi se mira las manos. Los guantes sin dedos, gastados en los nudillos.' },
			{ say: 'rhi', text: 'Y yo aquí. Jugando a las medallas. A miles de kilómetros.' },
			{ prompt: 'Rhi no te mira. Mira el mar.', choice: [
				{ text: '«Él está orgulloso de que juegues. Por eso te lo escribió.»', then: [
					{ af: { rhi: 3 } },
					{ say: 'rhi', text: '…Ya. —Se le quiebra la voz en la primera letra y la endereza en la segunda—. Ya lo sé. Eso es lo peor. Que lo sé.' },
				] },
				{ text: '«Pues gana. Gana la Copa y llévasela.»', then: [
					{ af: { rhi: 3 } },
					{ say: 'rhi', text: '—Te mira de golpe. Le brillan los ojos, y no de pena—. Eso. Eso haría una delantera. —Se levanta—. Se la llevo. Y la pongo en el césped de plástico, a ver qué cara ponen.' },
				] },
				{ text: 'Apoyar el hombro contra el suyo, sin decir nada.', then: [
					{ af: { rhi: 4 } },
					{ text: 'Apoyas el hombro contra el suyo. Ella se tensa. Luego no. Se quedan así un rato, mirando cómo entran los barcos. Ninguno de los dos dice nada. No hace falta.' },
				] },
			] },
			{ say: 'rhi', text: 'Si le cuentas esto a alguien, te hago un placaje. De los que se pitan con roja directa.' },
			{ say: 'rhi', text: '…Gracias, {jugador}. Por ganarme. Hoy me hacía falta perder contra alguien que no se dejara.' },
			{ quest: 'b03_t_rhi', done: true },
			{ intel: { npc: 'rhi', text: 'Su padre cuidaba el césped de un estadio de Macro Cosmos desde hace veinte años. Lo han despedido tras una «reestructuración» con dinero de un socio que no sale en ningún sitio. La carta de «estoy orgulloso» era una despedida de su trabajo.' } },
		],
		b03_rhi_despues: [
			{ say: 'rhi', text: 'He llamado a mi padre otra vez. Le he dicho que voy a ganar la Copa. Se ha reído. Llevaba años sin oírle reírse así. Bueno. Llevaba años sin llamarle.' },
			{ say: 'rhi', text: 'Y Nate me ha mandado un mensaje: «qué flojera, pero me alegro». De Nate, eso es un abrazo.' },
		],

		// =================== MUELLE TRES ===================
		b03_muelle_tres: [
			{ text: 'El muelle tres es más nuevo que los demás: hormigón blanco, una grúa amarilla y una valla azul y plata con un cartel: «**Fundación Raíces de Johto** · Logística de patrimonio · Acceso restringido».' },
			{ text: 'Un guardia con la lemniscata en la gorra lee una revista. Levanta la vista. Sonríe mucho.' },
			{ say: 'guardia_lemnis', text: 'Buenas. Esto es privado, joven. Cajas de cerámica antigua para un museo. Muy aburrido. Se lo prometo: aburridísimo.' },
			{ if: 'flag.b03_noa_hecho', then: [
				{ text: 'Detrás de la valla, apiladas, hay cajas azules con agujeros de ventilación. La cerámica antigua no necesita respirar.' },
				{ text: '{riolu} se queda mirando las cajas. Tiene el pelo del cuello erizado. No te lo tiene que explicar.', cond: RL },
			] },
		],

		// =================== FINAL DEL TRAMO ===================
		b03_t1_fin: [
			{ if: 'flag.b03_llamada_sobrina', then: [{ end: true }] },
			{ text: 'Esa tarde, Olivo huele a pescado frito y a sal. En el cabo, el Faro gira despacio. Su luz es más débil que la de antes, pero llega a los barcos, y los barcos llegan al puerto.' },
			{ text: 'Desde el paseo marítimo ves a Yasmina asomada a la barandilla de la linterna, con Amphy a su lado. Te saluda con la mano. Amphy hace un destello corto con la cola.' },
			{ quest: 'b03_m2', done: true },
			{ quest: 'b03_m5', stage: 'rancho' },
			{ set: { 'flag.b03_llamada_sobrina': true } },
		],
	},
};
