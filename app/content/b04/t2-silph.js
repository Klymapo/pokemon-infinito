// Bloque 4 · Tramo 2: «Operación Tejado» (~3 h).
// (1) Operación Tejado: pluma gris en Azafrán → azoteas y fachada de la Torre Lemnis Kanto (Ysolde, puntos de
//     observación, guardias, el contacto según la decisión Rocket del B3) → salto de fe a un toldo de fruta →
//     planta 11 de Silph (archivos: la tabla de horas, el calendario de «M.», el expediente de Matías Olmedo,
//     Xero en su laboratorio) → Atenea → el Presidente de Silph → la azotea de Silph. Final: la Cueva se abre.
// (2) Rama lateral: Ruta 8 → Pueblo Lavanda (Señor Fuji y Kaori, Torre Radio) → sótano de la vieja Torre Pokémon
//     (Gadd y el Gastly de Vánitas, Tobías y su «especial de fantasmas»).

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = '(inParty("riolu") || inParty("lucario"))';
const PLUMA = '(flag.b03_vencejo_pluma || flag.b04_vencejo_pluma)';
const QUEMAR = 'flag.b03_rocket_quemar';
const POLICIA = 'flag.b03_rocket_policia';
const LIBRES = 'flag.b03_rocket_libres';
const ROCKET_NINGUNA = '!flag.b03_rocket_quemar && !flag.b03_rocket_policia && !flag.b03_rocket_libres';
const OBS_OK = 'flag.b04_obs_cornisa && flag.b04_obs_antena && flag.b04_obs_deposito';
const ENTRADA_OK = 'flag.b04_entrada_lista';
const DOCS_OK = 'flag.b04_fuente_l && flag.b04_magda_nombre && flag.b04_expediente_visto';
const EN_OPERACION = 'quest.b04_m4 == "dentro"';
const RENATA_PUBLICA = 'flag.b03_renata_publica';

export default {
	// =====================================================================
	// LUGARES NUEVOS
	// =====================================================================
	locations: {
		// =================== LAS AZOTEAS ===================
		azotea_lemnis: {
			name: 'Azoteas de Azafrán', short: 'Azoteas', parent: 'azafran', kind: 'area',
			bg: { type: 'city', roofs: ['#8a8f9e', '#5a626e', '#c4a43a'], far: '#1f2e4f' },
			desc: 'Por encima de las avenidas, Azafrán es otra ciudad: depósitos de agua, antenas, chimeneas de ventilación, tendederos que nadie usa y cornisas por las que solo pasan los Pidgeotto.\n\nEnfrente, la fachada de la **Torre Lemnis Kanto** sube recta como una regla, con andamios de limpieza colgados de cables. Pegada a ella, más baja y más vieja, **Silph S.A.** En la planta once hay luz. Siempre hay luz en la planta once.',
			descNight: 'De noche, desde arriba, Azafrán parece un tablero de circuitos: líneas de luz que se cruzan en ángulo recto. La lemniscata de la Torre Lemnis gira en lo alto, azul y plata, y barre los tejados cada pocos segundos como un faro.\n\nCuando pasa la luz, te agachas. Cuando se va, sigues.',
			descs: [
				{ cond: 'flag.b04_silph_hecho', text: 'Las azoteas de Azafrán, en calma. Los andamios de limpieza de la Torre Lemnis cuelgan quietos. En la antena más alta, una pluma gris se mueve con el viento.\n\nAbajo, delante de Silph S.A., todavía hay una furgoneta de la policía aparcada en doble fila.' },
			],
			mapNote: 'Operación Tejado · puntos de observación · el salto',
			onEnter: [{ script: 'b04_azotea_llegada', cond: '!flag.b04_azotea_llegada', once: true }],
			spots: [
				{ label: 'Ysolde', sub: 'Sentada en el borde, con las piernas colgando sobre el vacío', icon: '🪶', cond: '!flag.b04_silph_hecho', talk: [{ cond: 'flag.b04_salto', script: 'b04_ysolde_vuelta' }, { script: 'b04_ysolde_azotea' }] },
				{ label: 'Punto de observación: la cornisa norte', sub: 'Desde ahí se ve la pasarela de cristal', icon: '👁️', cond: '!flag.b04_salto', new: '!flag.b04_obs_cornisa', doneIf: 'flag.b04_obs_cornisa', talk: [{ cond: 'flag.b04_obs_cornisa', script: 'b04_obs_repetir' }, { script: 'b04_obs_cornisa' }] },
				{ label: 'Punto de observación: la antena', sub: 'La más alta del tejado. Se mueve un poco', icon: '📡', cond: '!flag.b04_salto && beat("tejado_vigilante")', new: '!flag.b04_obs_antena', doneIf: 'flag.b04_obs_antena', talk: [{ cond: 'flag.b04_obs_antena', script: 'b04_obs_repetir' }, { script: 'b04_obs_antena' }] },
				{ label: 'Punto de observación: el depósito de agua', sub: 'Sobre el callejón entre las dos torres', icon: '🛢️', cond: '!flag.b04_salto', new: '!flag.b04_obs_deposito', doneIf: 'flag.b04_obs_deposito', talk: [{ cond: 'flag.b04_obs_deposito', script: 'b04_obs_repetir' }, { script: 'b04_obs_deposito' }] },
				{ label: 'Vigilante de Lemnis en el andamio', sub: 'Hace la ronda con una linterna. Te corta el paso a la antena', icon: '⚔️', cond: '!flag.b04_salto', action: { trainer: 'tejado_vigilante' } },
				{ label: 'Técnica de Lemnis en la plataforma de limpieza', sub: 'Cuelga de dos cables, dos pisos más abajo. No te ha visto. Todavía', icon: '⚔️', cond: '!flag.b04_salto', action: { trainer: 'tejado_tecnica' } },
				// El contacto (según lo que pasó con los Rocket en Caoba)
				{ label: 'Un hombre de traje blanco en la azotea de al lado', sub: 'Las manos a la espalda. Te estaba esperando', icon: '🤍', cond: QUEMAR + ' && flag.b04_azotea_llegada && !flag.b04_entrada_lista', new: 'true', talk: [{ script: 'b04_atlas_tarjeta' }] },
				{ label: 'Un limpiacristales muy sospechoso', sub: 'Sube por el andamio. Lleva bigote. Y gabardina', icon: '🧽', cond: POLICIA + ' && flag.b04_azotea_llegada && !flag.b04_entrada_lista', new: 'true', talk: [{ script: 'b04_handsome_declaracion' }] },
				{ label: 'Desplegar la carta de Toni', sub: 'El dibujo del conducto, a la luz de la lemniscata', icon: '✉️', cond: LIBRES + ' && flag.b04_azotea_llegada && !flag.b04_entrada_lista', new: 'true', talk: [{ script: 'b04_toni_conducto' }] },
				// El salto
				{ label: 'El borde del tejado', sub: 'Abajo, en el callejón, el toldo a rayas de un puesto de fruta', icon: '🍊', cond: '!flag.b04_salto && ' + OBS_OK + ' && ' + ENTRADA_OK + ' && beat("tejado_vigilante")', new: 'true', talk: [{ script: 'b04_salto' }] },
				{ label: 'Volver a la puerta de servicio de Silph', sub: 'Por la escalera de incendios, esta vez', icon: '🚪', cond: 'flag.b04_salto && ' + EN_OPERACION, talk: [{ script: 'b04_volver_archivo' }] },
				{ label: 'Mirar la ciudad desde arriba', icon: '🌃', cond: 'flag.b04_silph_hecho', talk: [{ script: 'b04_azotea_despues' }] },
			],
			rumors: [
				{ text: 'Los limpiacristales de la Torre Lemnis cobran el triple que los de cualquier otro edificio de Azafrán. Firman un papel antes de subir. No pueden contar qué ven por las ventanas.' },
				{ text: 'Desde hace un mes, los Pidgeotto de Azafrán no se posan en la antena más alta de la ciudad. Hay algo gris posado allí. Los Pidgeotto lo respetan.' },
			],
		},

		// =================== PLANTA 11 DE SILPH ===================
		archivo_silph: {
			name: 'Silph S.A. · Planta 11', short: 'Planta 11', parent: 'silph', kind: 'building',
			bg: { type: 'indoor', wall: '#cfd6e2', floor: '#4a4f6a' },
			desc: 'La planta que no tiene nombre en el directorio. Moqueta gris, fluorescentes que zumban, y pasillos de archivadores metálicos que llegan hasta el techo, en filas, como un cementerio muy ordenado.\n\nLas cajas de la «auditoría» están apiladas por todas partes: «Lemnis · Infraestructura · No abrir». Al fondo, una puerta sin número, una sala de reuniones con un corcho en la pared y un laboratorio con la luz encendida.\n\nPor las ventanas, a tres metros, la fachada de la Torre Lemnis. Tan cerca que casi podrías tocarla.',
			descs: [
				{ cond: 'flag.b04_silph_hecho', text: 'La planta once, con todas las luces encendidas. Hay policías de Kanto con guantes metiendo cajas de Lemnis en bolsas de pruebas, y un señor de Silph con corbata que les va diciendo «esa también, esa también» con una voz muy pequeña.\n\nLos archivadores siguen ahí, en filas. Ya no parecen un cementerio. Parecen solo archivadores.' },
			],
			mapNote: 'Archivos · Infraestructura · laboratorio provisional',
			onEnter: [{ script: 'b04_archivo_llegada', cond: '!flag.b04_archivo_llegada', once: true }],
			spots: [
				{ label: 'Recluta de guardia en el pasillo', sub: 'Uniforme negro sin R. Bosteza delante de los archivadores', icon: '⚔️', cond: '!flag.b04_silph_hecho', action: { trainer: 'silph_recluta_1' } },
				{ label: 'Los archivadores de seguimiento', sub: 'Carpetas con una letra en el lomo', icon: '🗄️', cond: 'beat("silph_recluta_1") && !flag.b04_silph_hecho', new: '!flag.b04_fuente_l', doneIf: 'flag.b04_fuente_l', talk: [{ cond: 'flag.b04_fuente_l', script: 'b04_archivadores_despues' }, { script: 'b04_deduccion' }] },
				{ label: 'La sala de reuniones', sub: 'Un corcho lleno de papeles clavados con chinchetas', icon: '📌', cond: 'beat("silph_recluta_1") && !flag.b04_silph_hecho', new: '!flag.b04_magda_nombre', doneIf: 'flag.b04_magda_nombre', talk: [{ cond: 'flag.b04_magda_nombre', script: 'b04_calendario_despues' }, { script: 'b04_calendario' }] },
				{ label: 'Expedientes de personal', sub: 'Un armario viejo de Silph, de los de antes de Lemnis', icon: '📁', cond: 'beat("silph_recluta_1") && !flag.b04_silph_hecho', new: '!flag.b04_expediente_visto', doneIf: 'flag.b04_expediente_visto', talk: [{ cond: 'flag.b04_expediente_visto', script: 'b04_expediente_despues' }, { script: 'b04_expediente' }] },
				{ label: 'Laboratorio provisional', sub: 'Se oye una risa. Sola. A estas horas', icon: '🧪', cond: 'beat("silph_recluta_1") && !flag.b04_silph_hecho', new: '!flag.b04_xero_silph', talk: [{ cond: 'flag.b04_xero_silph', script: 'b04_xero_despues' }, { script: 'b04_xero_silph' }] },
				{ label: 'Recluta en la fotocopiadora', sub: 'Fotocopia su propia cara. Por aburrimiento', icon: '⚔️', cond: 'beat("silph_recluta_1") && !flag.b04_silph_hecho', action: { trainer: 'silph_recluta_2' } },
				{ label: 'La salida de servicio', sub: 'Tienes lo que venías a buscar. Ahora, salir', icon: '🚪', cond: DOCS_OK + ' && !flag.b04_atenea_vista', new: 'true', talk: [{ script: 'b04_atenea' }] },
				{ label: 'Atenea, en la salida de servicio', sub: 'Se lima las uñas. Te espera', icon: '🌹', cond: 'flag.b04_atenea_vista && !beat("atenea_2")', new: 'true', talk: [{ script: 'b04_atenea_revancha' }] },
				{ label: 'Los archivadores, abiertos', icon: '🗄️', cond: 'flag.b04_silph_hecho', talk: [{ script: 'b04_archivo_despues' }] },
			],
		},

		// =================== RUTA 8 ===================
		k_ruta8: {
			name: 'Ruta 8', short: 'Ruta 8', region: 'kanto', kind: 'route', map: { x: 68, y: 52 },
			bg: { type: 'route', flowers: '#b08ad8', hill: '#8aa86a', far: '#9aa4c4' },
			desc: 'Al este de Azafrán, la ciudad se deshace en naves, talleres de motos y solares, y luego en un camino de grava entre setos bajos y prados con flores moradas. Huele a gasolina al principio y a lavanda al final.\n\nAl fondo, sobre una colina, una torre de radio con una luz roja que parpadea: **Pueblo Lavanda**.',
			descNight: 'De noche, la Ruta 8 es muy oscura. Solo se ve la luz roja de la torre de radio de Lavanda, al este, parpadeando despacio, y a veces los faros de una moto que pasa demasiado deprisa. Los setos susurran. Seguramente es el viento.',
			links: ['azafran', 'lavanda'],
			enterCond: 'flag.b04_t0_hecho',
			blockedMsg: 'En la salida este de Azafrán hay una valla de obra con un cartel: «Gira Interregional: rogamos a los participantes que no abandonen la ciudad hasta completar su registro». Debajo, a boli: «ni para ir a por lavanda».',
			mapNote: 'Motoristas · prados de lavanda · camino a Lavanda',
			rumors: [
				{ text: 'Los motoristas de la Ruta 8 dicen que hace un mes pasó por aquí una caravana de furgonetas blancas sin logo, de madrugada, hacia el norte. Dicen que ni frenaron en las curvas.' },
				{ text: 'En Lavanda hay un señor muy mayor que cuida de los Pokémon que nadie quiere. Dicen que hace muchos años fue científico. Dicen que no le gusta que se lo recuerden.' },
				{ text: 'Debajo de la Torre Radio de Lavanda sigue la vieja Torre Pokémon. La tapiaron cuando construyeron la antena. Los de la radio dicen que, de noche, en las frecuencias vacías, se oye a alguien quejarse del ruido.' },
			],
			route: {
				from: 'azafran', to: 'lavanda', length: 7, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [{ text: 'Sales por la puerta este de Azafrán. Las torres se quedan atrás. El asfalto se vuelve grava, y la grava, polvo morado de lavanda pisada.' }],
					1: [
						{ trainer: 'r8_ramon' },
						{ text: 'Un taller de motos con la persiana a medio subir. Dentro suena la radio: «…Radio Lavanda, la voz del este. Esta noche, a las doce, lo que se oye cuando no suena nada…».' },
					],
					2: [
						{ item: 'hyperpotion' },
						{ text: 'Un prado de lavanda a los dos lados del camino. Los Combee zumban de flor en flor, borrachos de olor. Un Vulpix duerme hecho un ovillo entre las matas, con la cola por encima del hocico.' },
					],
					3: [
						{ trainer: 'r8_celia' },
						{ spot: { action: { gather: 'piedras_r8' } }, label: 'Un montón de piedras junto al camino', icon: '🪨', sub: 'Las han apartado los de la obra' },
					],
					4: [
						{ text: 'Una caseta de piedra con un letrero oxidado: «Paso subterráneo · Azafrán Oeste». La puerta está cerrada con una cadena nueva. En la cadena, una etiqueta azul y plata.' },
						{ trainer: 'r8_fausto', optional: true, label: 'Un chico con gafas de culo de botella mira una antena de mano' },
						{ item: 'maxether', hidden: true },
					],
					5: [
						{ text: 'El camino sube por una colina suave. Desde arriba se ve Lavanda entera: casas bajas de tejados morados, un cementerio pequeño con flores frescas y, en medio, la torre de radio, más alta que todo lo demás.' },
						{ item: 'revive', hidden: true },
					],
					6: [
						{ trainer: 'r8_marisol' },
						{ item: 'ultraball', n: 2 },
					],
					7: [{ text: 'Un arco de madera pintado de morado: «**Pueblo Lavanda** · Donde descansan los que quisimos». Debajo, más pequeño: «Se ruega silencio después de las diez».' }],
				},
				encounters: {
					grass: [
						{ sp: 'pidgeotto', lv: [47, 49], w: 20 },
						{ sp: 'persian', lv: [48, 50], w: 16 },
						{ sp: 'arbok', lv: [48, 50], w: 12 },
						{ sp: 'sandslash', lv: [48, 50], w: 12 },
						{ sp: 'growlithe', lv: [47, 49], w: 10 },
						{ sp: 'vulpix', lv: [47, 49], w: 10 },
						{ sp: 'golbat', lv: [48, 50], w: 10, time: 'night' },
						{ sp: 'ninetales', lv: [50, 52], w: 3 },
						{ sp: 'sandslashalola', lv: [48, 50], w: 4, displaced: true },
						{ sp: 'mudsdale', lv: [49, 51], w: 3, displaced: true },
					],
				},
			},
		},

		// =================== PUEBLO LAVANDA ===================
		lavanda: {
			name: 'Pueblo Lavanda', short: 'Lavanda', region: 'kanto', kind: 'town', map: { x: 84, y: 52 },
			bg: { type: 'town', roofs: ['#8a6ab8', '#6a4a8a', '#e9e3d0', '#b08ad8'], far: '#9aa4c4', fog: true },
			desc: 'Un pueblo pequeño y callado, de casas bajas con tejados morados y macetas de lavanda en todas las ventanas. La gente habla bajito sin que nadie se lo pida.\n\nEn el centro se levanta la **Torre Radio**, alta y metálica, con su luz roja en la punta. Antes, en ese mismo sitio, estaba la vieja **Torre Pokémon**. Al lado, una casa de madera con un cartel escrito a mano: «Casa Pokémon. Llame flojito».',
			descNight: 'De noche, Lavanda huele más a lavanda y suena menos que nunca. La luz roja de la Torre Radio parpadea sobre los tejados morados. En el pequeño cementerio del final de la calle, alguien ha dejado velas encendidas. Siempre hay velas encendidas.',
			links: ['k_ruta8'],
			mapNote: 'Casa Pokémon (Señor Fuji) · Torre Radio · el sótano de la vieja torre',
			onEnter: [{ script: 'b04_lavanda_llegada', cond: '!flag.b04_lavanda_llegada', once: true }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda de Lavanda', action: { shop: 'tienda_lavanda' } },
				{ label: 'Casa Pokémon', sub: '«Llame flojito»', icon: '🏠', action: { go: 'casa_fuji' }, new: 'flag.b04_lavanda_llegada && !flag.b04_fuji_1' },
				{ label: 'Torre Radio', sub: 'Radio Lavanda · la voz del este', icon: '📻', action: { go: 'torre_radio_lavanda' }, new: 'flag.b04_lavanda_llegada && !visited("torre_radio_lavanda")' },
				{ label: 'El cementerio pequeño', sub: 'Lápidas diminutas con nombres de Pokémon', icon: '🕯️', talk: [{ script: 'b04_cementerio' }] },
				{ label: 'Campo de lavanda', sub: 'Detrás de las casas, hasta donde llega la vista', icon: '💜', action: { gather: 'campo_lavanda' } },
				{ label: 'Una vecina regando las macetas', sub: 'Riega la misma maceta tres veces', icon: '🪴', talk: [{ script: 'b04_vecina_lavanda' }] },
			],
			rumors: [
				{ text: 'Cuando derribaron la vieja Torre Pokémon para poner la antena, trasladaron las tumbas a la Casa de Almas. Dicen que no todos los que descansaban allí quisieron mudarse.' },
				{ text: 'El Señor Fuji lleva cuarenta años cuidando de Pokémon abandonados. Nunca cobra. Nunca habla de lo que hacía antes. En su casa hay una foto boca abajo que no deja que nadie le dé la vuelta.' },
				{ cond: 'flag.b04_lavanda_llegada', text: 'Hay un chico que grita mucho delante de la Torre Radio con un trípode y un Persian. Dice que graba «el especial del año». El Persian parece aburrirse muchísimo.' },
				{ cond: 'flag.b04_kaori_paso', text: 'La Ponyta de la Casa Pokémon ha vuelto a tener una llamita en la crin. Pequeña. Dicen que se la devolvió una chica con vendas en el brazo que no sonríe nunca.' },
			],
		},

		// ---------- Casa Pokémon del Señor Fuji ----------
		casa_fuji: {
			name: 'Casa Pokémon', parent: 'lavanda', kind: 'building',
			bg: { type: 'indoor', wall: '#d8c49a', floor: '#8a6a4a' },
			desc: 'Una casa de madera vieja que cruje con cariño. Huele a té, a lavanda y a manta de lana. Por todas partes hay Pokémon dormidos: un Psyduck en una cesta, dos Nidoran sobre un cojín, un Cubone con su hueso abrazado.\n\nEn una estantería, entre frascos, hay una foto boca abajo.',
			descs: [
				{ cond: 'flag.b04_kaori_paso', text: 'La Casa Pokémon, con su olor a té y a lavanda. En la alfombra, junto a la estufa, la Ponyta dormita con una llamita pequeña en la crin, del tamaño de una vela de cumpleaños. Cada vez que respira, la llamita sube un poco.\n\nEn la estantería, la foto sigue boca abajo.' },
			],
			mapNote: 'Señor Fuji · Kaori',
			spots: [
				{ label: 'Kaori y el Señor Fuji', sub: 'Toman té junto a la estufa. Una Ponyta sin fuego duerme entre los dos', icon: '🫖', new: '!flag.b04_fuji_1', cond: '!flag.b04_fuji_1', talk: [{ script: 'b04_fuji_1' }] },
				{ label: 'Kaori', sub: 'Machaca algo en un mortero, con cara de estar muy contenta. Por dentro', icon: '🧪', cond: 'flag.b04_fuji_1 && !flag.b04_kaori_paso', new: 'has("cenizatorre")', talk: [{ cond: 'has("cenizatorre")', script: 'b04_kaori_antidoto' }, { script: 'b04_kaori_espera' }] },
				{ label: 'Kaori', sub: 'Toma notas junto a la Ponyta. No levanta la vista', icon: '🧪', cond: 'flag.b04_kaori_paso', talk: [{ script: 'b04_kaori_despues' }] },
				{ label: 'Señor Fuji', sub: 'Remueve el té sin beberlo', icon: '👴', cond: 'flag.b04_fuji_1', talk: [{ script: 'b04_fuji_despues' }] },
				{ label: 'La foto boca abajo', icon: '🖼️', talk: [{ script: 'b04_foto_fuji' }] },
			],
		},

		// ---------- Torre Radio de Lavanda ----------
		torre_radio_lavanda: {
			name: 'Torre Radio de Lavanda', short: 'Torre Radio', parent: 'lavanda', kind: 'building',
			bg: { type: 'indoor', wall: '#6a4a8a', floor: '#3b3448' },
			desc: 'Un vestíbulo pequeño y moderno, con fotos firmadas de locutores en las paredes y un cartel luminoso de «EN EL AIRE» encima de una puerta. Huele a moqueta nueva… y, por debajo, a incienso viejo.\n\nEn una esquina, una placa de bronce. Al lado, una puerta de hierro pintada de gris, con un cartel: «Sótano · Solo personal autorizado (y nadie quiere estar autorizado)».',
			mapNote: 'Radio Lavanda · bajada al sótano de la vieja torre',
			spots: [
				{ label: 'La locutora de guardia', sub: 'Con los cascos puestos, se toma una infusión', icon: '🎙️', talk: [{ script: 'b04_locutora' }] },
				{ label: 'La placa de bronce', icon: '🪦', talk: [{ script: 'b04_placa_torre' }] },
				{ label: 'Tobías y Duquesa', sub: 'Montan un trípode delante de la puerta del sótano', icon: '🎬', cond: '!flag.b04_tobias_1', new: 'true', talk: [{ script: 'b04_tobias_1' }] },
				{ label: 'Bajar al sótano', sub: 'La puerta de hierro gris', icon: '🕯️', action: { go: 'sotano_torre' } },
			],
		},

		// ---------- Sótano de la vieja Torre Pokémon ----------
		sotano_torre: {
			name: 'Sótano de la vieja Torre Pokémon', short: 'Sótano de la torre', parent: 'lavanda', kind: 'cave',
			bg: { type: 'cave', dark: true, fog: true, crystals: '#b08ad8' },
			desc: 'Debajo de la Torre Radio sigue lo que quedó de la vieja Torre Pokémon: pasillos estrechos de piedra, nichos vacíos con flores secas, escaleras que bajan donde no debería haber nada y velas que alguien enciende y nadie ve encender.\n\nEl aire está frío y huele a incienso. De vez en cuando, algo se ríe. Bajito. Detrás de ti.',
			descs: [
				{ cond: 'flag.b04_sotano_hondo', text: 'Abajo del todo, la vieja torre se abre en una sala redonda con un incensario de bronce en el centro, que humea desde hace cuarenta años sin que nadie lo rellene. Las paredes tienen nichos con nombres tallados: «Bigotes». «Señora Peluche». «Rayo, el más valiente».\n\nPor el techo pasa, muy amortiguado, el ruido de la radio de arriba. Los que están aquí abajo parecen tenerle mucha manía.' },
			],
			mapNote: 'Fantasmas · el Prof. Gadd · Tobías (opcional)',
			onEnter: [{ script: 'b04_sotano_llegada', cond: '!flag.b04_sotano_llegada', once: true }],
			spots: [
				{ label: 'Recorrer los pasillos', sub: 'Algo se mueve entre los nichos', icon: '👻', action: { explore: 'cave' } },
				{ label: 'Médium: una señora con un velo', sub: 'Habla con alguien que tú no ves', icon: '⚔️', action: { trainer: 'sotano_medium_1' } },
				{ label: 'La escalera que baja', sub: 'Más frío. Más incienso. Más risas', icon: '⬇️', cond: 'beat("sotano_medium_1") && !flag.b04_sotano_hondo', new: 'true', talk: [{ script: 'b04_sotano_bajar' }] },
				{ label: 'Un ruido de aspiradora', sub: 'Viene de los nichos del fondo', icon: '🌀', cond: 'flag.b04_sotano_hondo && !flag.b04_gadd_lavanda', new: 'true', talk: [{ script: 'b04_gadd_lavanda' }] },
				{ label: 'Prof. Gadd', sub: 'Toma notas sentado en un escalón', icon: '🌀', cond: 'flag.b04_gadd_lavanda', talk: [{ script: 'b04_gadd_despues' }] },
				{ label: 'Médium: un chico que no parpadea', sub: 'Sentado frente a un nicho vacío', icon: '⚔️', cond: 'flag.b04_sotano_hondo', action: { trainer: 'sotano_medium_2' } },
				{ label: 'El incensario de bronce', sub: 'Humea solo, desde hace cuarenta años', icon: '🪔', cond: 'flag.b04_sotano_hondo', new: 'flag.b04_kaori_encargo && !has("cenizatorre") && !flag.b04_kaori_paso', talk: [{ script: 'b04_incensario' }] },
				{ label: 'Tobías, en directo', sub: 'Narra a la cámara con la voz temblorosa. Duquesa bosteza', icon: '🎬', cond: 'flag.b04_sotano_hondo && flag.b04_tobias_1 && !flag.b04_tobias_final', new: 'true', talk: [{ script: 'b04_tobias_final' }] },
				{ label: 'Tobías', sub: 'Revisa la grabación. Duquesa duerme sobre el trípode', icon: '🎬', cond: 'flag.b04_tobias_final', talk: [{ cond: '!beat("tobias_3")', script: 'b04_tobias_revancha' }, { script: 'b04_tobias_despues' }] },
			],
			encounters: {
				cave: [
					{ sp: 'haunter', lv: [48, 50], w: 30 },
					{ sp: 'gastly', lv: [47, 49], w: 24 },
					{ sp: 'cubone', lv: [47, 49], w: 14 },
					{ sp: 'marowak', lv: [50, 52], w: 8 },
					{ sp: 'golbat', lv: [48, 50], w: 10 },
					{ sp: 'misdreavus', lv: [48, 50], w: 6, time: 'night' },
					{ sp: 'gengar', lv: [51, 52], w: 3 },
					{ sp: 'dusclops', lv: [49, 51], w: 4, displaced: true },
					{ sp: 'marowakalola', lv: [49, 51], w: 3, displaced: true },
				],
			},
		},
	},

	// =====================================================================
	// PARCHES (lugares de otros tramos del B4)
	// =====================================================================
	patches: {
		azafran: {
			spots: [
				{ label: 'Una pluma gris en lo más alto', sub: 'Clavada en la antena de un edificio de oficinas, frente a la Torre Lemnis', icon: '🪶', cond: 'quest.b04_m4 == "tejado"', new: 'quest.b04_m4 == "tejado"', talk: [{ script: 'b04_tejado_inicio' }] },
				{ label: 'Subir a las azoteas', sub: 'Por la escalera de incendios del edificio de oficinas', icon: '🏙️', cond: 'flag.b04_tejado_inicio', action: { go: 'azotea_lemnis' } },
				{ label: 'Ruta 8', sub: 'Al este, hacia Pueblo Lavanda', icon: '🧭', cond: 'flag.b04_t0_hecho && !visited("k_ruta8")', new: 'flag.b04_t0_hecho && !visited("k_ruta8") && flag.b04_silph_hecho', action: { go: 'k_ruta8' } },
			],
			rumors: [
				{ cond: 'flag.b04_silph_hecho', text: 'Anoche saltó la alarma de Silph S.A. por primera vez en veinte años. Dicen que la pulsó el propio presidente, en pijama. Dicen que la policía de Kanto se llevó cuarenta cajas. Lemnis dice que eran «papeles de una auditoría rutinaria».' },
			],
		},
		silph: {
			descs: [
				{ cond: 'flag.b04_silph_hecho', text: 'El vestíbulo de Silph S.A., con los tornos encendidos por primera vez en semanas. Hay policías de Kanto entrando y saliendo con cajas. El guardia de siempre ya no lleva el cartel: lo ha dejado en el suelo, boca abajo, y sonríe a todo el mundo con cara de no haber dormido.\n\nEn el directorio, alguien ha pegado un papel en el hueco de la planta 11: «**11:** Archivo (otra vez nuestro)».' },
			],
			spots: [
				{ label: 'Ascensor a la planta 11', sub: 'El botón del 11 ya funciona', icon: '🛗', cond: 'flag.b04_silph_hecho', action: { go: 'archivo_silph' } },
				{ label: 'El Presidente de Silph', sub: 'Firma papeles en el mostrador, con la policía', icon: '👔', cond: 'flag.b04_silph_hecho', talk: [{ script: 'b04_presidente_despues' }] },
			],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Azoteas -----
		tejado_vigilante: { name: 'Gerardo', cls: 'Vigilante de Lemnis', npc: 'guardia_lemnis', ai: 3,
			team: [
				{ sp: 'skarmory', lv: 50, moves: ['drillpeck', 'steelwing', 'spikes', 'roost'] },
				{ sp: 'magneton', lv: 51, moves: ['thunderbolt', 'flashcannon', 'triattack', 'thunderwave'] },
			],
			intro: '¿Quién anda ahí? ¡Esto es la azotea! ¡Aquí no sube nadie! Bueno, yo. Pero a mí me pagan. ¿A ti te pagan? Ya me parecía.',
			win: 'Llevo seis meses haciendo la ronda por los andamios. Nunca había visto a nadie aquí arriba. Salvo una pluma. Siempre hay una pluma.' },
		tejado_tecnica: { name: 'Ofelia', cls: 'Técnica de Lemnis', npc: 'tecnico_lemnis', ai: 3,
			team: [
				{ sp: 'electrode', lv: 50, moves: ['thunderbolt', 'voltswitch', 'foulplay', 'explosion'] },
				{ sp: 'magnezone', lv: 51, moves: ['thunderbolt', 'flashcannon', 'bodypress', 'mirrorcoat'] },
				{ sp: 'jolteon', lv: 51, moves: ['thunderbolt', 'shadowball', 'pinmissile', 'thunderwave'] },
			],
			intro: '¡Ay! ¡Me has asustado! Estoy colgada de dos cables a ochenta metros del suelo, revisando una antena que no sale en los planos. Lo último que necesito es un susto. Lo penúltimo, un combate.',
			win: 'La antena manda algo hacia el norte, por debajo de la tierra. Lo pone en mi orden de trabajo. Yo solo aprieto tornillos. Los tornillos no preguntan.' },

		// ----- Planta 11 -----
		silph_recluta_1: { name: 'Recluta', cls: 'Seguridad privada', npc: 'recluta_rocket', ai: 3,
			team: [
				{ sp: 'crobat', lv: 51, moves: ['crosspoison', 'bite', 'uturn', 'confuseray'] },
				{ sp: 'houndoom', lv: 52, moves: ['crunch', 'flamethrower', 'suckerpunch', 'sludgebomb'] },
				{ sp: 'raticate', lv: 51, moves: ['crunch', 'superfang', 'suckerpunch', 'uturn'] },
			],
			intro: 'Alto. Seguridad privada. —Se señala el pecho, donde antes había una R y ahora hay un parche gris—. Me han quitado la letra, pero no las ganas. ¿Te han invitado? No. Pues ya está.',
			win: 'Antes cobraba en caramelos. Ahora cobro en nómina, con seguro médico y todo. No sé qué es peor. Pasa, pasa.' },
		silph_recluta_2: { name: 'Recluta', cls: 'Seguridad privada', npc: 'recluta_rocket_f', ai: 3,
			team: [
				{ sp: 'arbok', lv: 52, moves: ['gunkshot', 'crunch', 'coil', 'earthquake'] },
				{ sp: 'weezing', lv: 52, moves: ['sludgebomb', 'flamethrower', 'thunderbolt', 'willowisp'] },
				{ sp: 'mightyena', lv: 53, moves: ['crunch', 'playrough', 'suckerpunch', 'firefang'] },
			],
			intro: '¡Eh! ¡Que estoy en mi descanso! Quince minutos para fotocopiarme la cara. Es lo único divertido de este trabajo. ¿Sabes lo que es vigilar papeles toda la noche? Ahora lo sabrás.',
			win: 'Atenea dice que este contrato es «un trabajo de verdad». Un trabajo de verdad es aburridísimo. Nadie me avisó.' },

		// ----- Atenea (jefa de trama) -----
		atenea_2: { name: 'Atenea', cls: 'Admin Rocket', npc: 'atenea', ai: 5, iv: 29, reward: 4300,
			team: [
				{ sp: 'arbok', lv: 50, moves: ['gunkshot', 'crunch', 'earthquake', 'glare'], ability: 'intimidate', item: 'poisonbarb', nature: 'adamant' },
				{ sp: 'vileplume', lv: 51, moves: ['gigadrain', 'sludgebomb', 'moonblast', 'sleeppowder'], ability: 'effectspore', item: 'blacksludge', nature: 'bold' },
				{ sp: 'weezing', lv: 51, moves: ['sludgebomb', 'flamethrower', 'willowisp', 'clearsmog'], ability: 'levitate', item: 'blacksludge', nature: 'bold' },
				{ sp: 'muk', lv: 52, moves: ['gunkshot', 'knockoff', 'icepunch', 'poisonjab'], ability: 'stench', item: 'leftovers', nature: 'adamant' },
				{ sp: 'honchkrow', lv: 53, moves: ['nightslash', 'bravebird', 'suckerpunch', 'heatwave'], ability: 'superluck', item: 'scopelens', nature: 'naive' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'Cinco de los míos contra los tuyos. Como en Iris, pero con mejor iluminación. ¿Empezamos, pajarito?',
			win: '…Otra vez. —Se arregla el pelo—. La familia de alguien sigue muy bien criada.',
			lose: 'Siéntate. Respira. Los papeles no se van a mover de tu mochila: yo no robo a los que pierden. Tengo principios. Pocos, pero tengo.' },

		// ----- Ruta 8 -----
		r8_ramon: { name: 'Ramón', cls: 'Motorista', ai: 2,
			team: [
				{ sp: 'weezing', lv: 49, moves: ['sludgebomb', 'flamethrower', 'darkpulse', 'willowisp'] },
				{ sp: 'arcanine', lv: 50, moves: ['flareblitz', 'extremespeed', 'crunch', 'wildcharge'] },
			],
			intro: 'Treinta años haciendo esta carretera en moto y nunca me habían adelantado unas furgonetas blancas. Sin logo. De madrugada. Necesito desquitarme con alguien.',
			win: 'Me has adelantado tú también. Esta semana voy fatal.',
			look: { hair: 'short', hairColor: '#2b2b38', outfit: '#2b2b38', outfit2: '#c4473a', skin: 2, eyesStyle: 'sharp', mouth: 'grin', acc: 'bandana beard' } },
		r8_celia: { name: 'Celia', cls: 'Jugadora', ai: 2,
			team: [
				{ sp: 'ninetales', lv: 50, moves: ['flamethrower', 'extrasensory', 'nastyplot', 'willowisp'] },
				{ sp: 'persian', lv: 50, moves: ['fakeout', 'knockoff', 'playrough', 'uturn'] },
				{ sp: 'clefable', lv: 50, moves: ['moonblast', 'flamethrower', 'softboiled', 'thunderwave'] },
			],
			intro: 'Apuesto a que te gano. Apuesto a que no. Apuesto a las dos cosas, así nunca pierdo. ¡Combate!',
			win: 'He perdido una apuesta y ganado otra. Estoy exactamente igual que antes. Es mi sistema.',
			look: { hair: 'bob', hairColor: '#c4473a', outfit: '#2b2b38', outfit2: '#e9d36a', skin: 1, eyesStyle: 'happy', mouth: 'grin' } },
		r8_fausto: { name: 'Fausto', cls: 'Supernecio', ai: 2,
			team: [
				{ sp: 'magneton', lv: 50, moves: ['thunderbolt', 'flashcannon', 'triattack', 'thunderwave'] },
				{ sp: 'electrode', lv: 50, moves: ['thunderbolt', 'voltswitch', 'foulplay', 'screech'] },
				{ sp: 'raichu', lv: 51, moves: ['thunderbolt', 'surf', 'grassknot', 'nastyplot'] },
			],
			intro: 'Esta antena de mano capta una frecuencia que no está en ninguna lista. Viene de Azafrán y se va hacia el norte. ¡Si me ganas, te dejo escucharla! Si no, también, porque no hay nada que oír. Solo un zumbido.',
			win: 'El zumbido es igual que el de mi nevera. Pero mi nevera no está en Azafrán. Lo he comprobado.',
			look: { hair: 'short', hairColor: '#4a3a2a', outfit: '#e9e3d0', outfit2: '#3b5bb5', skin: 1, eyesStyle: 'normal', mouth: 'open', acc: 'glasses' } },
		r8_marisol: { name: 'Marisol', cls: 'Excursionista', ai: 3,
			team: [
				{ sp: 'sandslash', lv: 50, moves: ['earthquake', 'stoneedge', 'knockoff', 'swordsdance'] },
				{ sp: 'golem', lv: 51, moves: ['earthquake', 'stoneedge', 'heavyslam', 'suckerpunch'] },
				{ sp: 'rhydon', lv: 52, moves: ['earthquake', 'stoneedge', 'megahorn', 'hammerarm'] },
			],
			intro: 'Vengo de la montaña del norte, donde la Cueva. Han cerrado la mitad de los senderos «por estudio geológico». Yo soy geóloga. Nadie me ha pedido que estudie nada. Combate, que me enfada.',
			win: 'Las piedras no mienten. La gente que pone vallas, a veces. Suerte en Lavanda.',
			look: { hair: 'ponytail', hairColor: '#6b4a2b', outfit: '#8a6a3a', outfit2: '#3f6a3a', skin: 2, eyesStyle: 'sharp', mouth: 'flat', acc: 'hat' } },

		// ----- Sótano de la vieja torre -----
		sotano_medium_1: { name: 'Doña Amparo', cls: 'Médium', npc: 'medium_kanto', ai: 2,
			team: [
				{ sp: 'haunter', lv: 50, moves: ['shadowball', 'sludgebomb', 'hypnosis', 'dazzlinggleam'] },
				{ sp: 'mismagius', lv: 51, moves: ['shadowball', 'dazzlinggleam', 'thunderbolt', 'mysticalfire'] },
			],
			intro: 'Shhh. Me dicen que hagas menos ruido. Me dicen que los de arriba ya hacen bastante con la radio. Me dicen que combatas en silencio. No sé cómo se hace eso, pero ellos insisten.',
			win: 'Dicen que ganas con mucho ruido. Dicen que no les importa, que al menos no es la radio.' },
		sotano_medium_2: { name: 'Lucio', cls: 'Médium', npc: 'medium_kanto', ai: 2,
			team: [
				{ sp: 'marowak', lv: 51, moves: ['bonemerang', 'stoneedge', 'firepunch', 'thunderpunch'] },
				{ sp: 'gengar', lv: 52, moves: ['shadowball', 'sludgebomb', 'focusblast', 'thunderbolt'] },
			],
			intro: 'Este nicho es de un Rapidash que se llamaba Relámpago. Vengo a contarle las carreras de los domingos. Hoy no ha habido carreras. Así que te lo cuento a ti con un combate.',
			win: 'Relámpago dice que corres bien. Bueno, no dice nada. Pero el incienso se ha movido hacia ti.' },

		// ----- Tobías (opcional) -----
		tobias_3: { name: 'Tobías', cls: '«Jefe de piso»', npc: 'tobias', ai: 3, iv: 25, reward: 3100,
			team: [
				{ sp: 'swoobat', lv: 49, moves: ['airslash', 'psychic', 'heatwave', 'roost'], ability: 'unaware', item: 'sharpbeak', nature: 'timid' },
				{ sp: 'grumpig', lv: 50, moves: ['psychic', 'powergem', 'shadowball', 'thunderwave'], ability: 'thickfat', item: 'sitrusberry', nature: 'modest' },
				{ sp: 'drifblim', lv: 50, moves: ['shadowball', 'hex', 'willowisp', 'airslash'], ability: 'unburden', item: 'spelltag', nature: 'modest' },
				{ sp: 'persian', lv: 52, moves: ['fakeout', 'knockoff', 'playrough', 'uturn'], ability: 'technician', item: 'silkscarf', nature: 'jolly' },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: '¡Música de órgano! ¡Niebla! ¡Que alguien apague una vela para que dé miedo! ¡EL JEFE DE PISO DEL ESPECIAL DE FANTASMAS HA APARECIDO! …No me mires así, Duquesa.',
			win: '¡Patrocinadores, gracias por las Pociones! ¡Las he gastado todas! ¡Y he gritado tres veces! ¡Récord personal!',
			lose: '¡Victoria! ¡Duquesa, hemos ganado en una cripta! …Duquesa está dormida encima de una lápida. Se lo cuento luego. Con gráficos.' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =====================================================================
		// OPERACIÓN TEJADO
		// =====================================================================
		b04_tejado_inicio: [
			{ if: 'flag.b04_tejado_inicio', then: [{ go: 'azotea_lemnis' }, { end: true }] },
			{ set: { 'flag.b04_tejado_inicio': true } },
			{ text: 'Vuelves a Azafrán por la Ruta 5. La ciudad va deprisa, como siempre, y nadie mira hacia arriba. Nadie, salvo tú.' },
			{ text: 'En lo alto de un edificio de oficinas, justo enfrente de la Torre Lemnis, hay una antena. Y en la punta de la antena, clavada, moviéndose con el viento, una pluma gris.' },
			{ if: LIBRES, then: [
				{ text: 'Antes de subir, la enfermera Joy te llama desde la puerta del Centro Pokémon: hay correo a tu nombre. Un sobre arrugado, con sellos de Johto y una letra grande y torcida, de alguien que aprieta mucho el boli.' },
				{ text: 'Remite: «T. · Ruta 37 · (casa de mi madre)».' },
				{ give: 'cartatoni' },
				{ say: 'rotom', text: '¡Bzzt! ¿Toni? ¿El de las orejas? ¡Nos ha escrito! Nadie nos escribe cartas de papel. Huele a arroz con leche. —Pausa—. Hay un dibujo dentro. Muy mal hecho. Precioso.' },
			] },
			{ text: 'Esperas a que anochezca. Cuando la lemniscata de la Torre Lemnis empieza a girar en lo alto, azul y plata, encuentras la escalera de incendios del edificio de oficinas. Está abierta. Alguien ha engrasado la cancela para que no chirríe.' },
			{ text: '{riolu} sube delante de ti, de dos en dos peldaños, sin hacer ruido. Como si lo hubiera hecho toda la vida.', cond: LUC },
			{ go: 'azotea_lemnis' },
		],
		b04_azotea_llegada: [
			{ set: { 'flag.b04_azotea_llegada': true } },
			{ text: 'La azotea es un bosque de antenas y chimeneas de ventilación. El viento sopla fuerte aquí arriba y huele a lluvia que no llega. Abajo, muy abajo, los tranvías parecen de juguete.' },
			{ text: 'Sentada en el borde, con las piernas colgando sobre el vacío, como quien se sienta en un muelle, está Ysolde. No se gira.' },
			{ say: 'ysolde', text: 'Cuatro minutos desde la calle. —Mira la lemniscata que gira enfrente—. Bien. La luz de esa cosa barre los tejados cada once segundos. Cuando pase, quieto. Cuando se vaya, te mueves.' },
			{ if: PLUMA, then: [
				{ say: 'ysolde', text: 'Pluma. —Te tiende algo sin mirarte: una capucha gris, de tela fina, doblada en cuatro—. Para que no se te vea la cara desde las cámaras. No es un uniforme. Es sentido común con capucha.' },
			], else: [
				{ say: 'ysolde', text: 'Has venido. —Te tiende algo sin mirarte: una capucha gris, de tela fina, doblada en cuatro—. No eres de los nuestros, pero tu cara sale en demasiadas cámaras. Póntela. No es un uniforme. Es sentido común con capucha.' },
			] },
			{ text: 'Te la pones. Te queda grande. Ysolde no dice nada, pero por cómo tuerce la boca, le parece bien que te quede grande.' },
			{ say: 'ysolde', text: 'El plan. Primero, mirar. Hay tres sitios en este tejado desde los que se ve todo lo que hay que ver: la cornisa norte, la antena y el depósito de agua. Los llamamos **puntos de observación**. Sube a los tres. Mira. Acuérdate.' },
			{ say: 'ysolde', text: 'Segundo, la puerta. A los archivos de Silph se llega por la planta once. Desde aquí se baja al callejón de atrás, donde está la entrada de servicio. Y desde ahí, depende de a quién le debas favores.' },
			{ if: QUEMAR, then: [
				{ say: 'ysolde', text: 'Y tú le debes un favor a alguien con traje blanco. —Señala con la barbilla la azotea de al lado—. Lleva ahí una hora. Quieto. Con las manos a la espalda. O es una estatua o es para ti.' },
			] },
			{ if: POLICIA, then: [
				{ say: 'ysolde', text: 'Y tú tienes un amigo policía que lleva veinte minutos intentando subir por el andamio de limpieza de la Torre Lemnis. Con gabardina. Lo vamos a dejar llegar. Por respeto.' },
			] },
			{ if: LIBRES, then: [
				{ say: 'ysolde', text: 'Y te ha llegado una carta. —No dice cómo lo sabe. Tú no preguntas—. Las cartas de papel, en esta ciudad, solo las escribe la gente que no tiene nada que perder. Léela aquí arriba. Con la luz de la lemniscata se ve mejor.' },
			] },
			{ if: ROCKET_NINGUNA, then: [
				{ say: 'ysolde', text: 'Y tú no le debes favores a nadie útil. —Lo dice sin malicia—. No pasa nada. Las puertas que no se abren con favores se abren con otra cosa.' },
				{ text: 'Se sube un poco la manga izquierda. Algo metálico brilla un instante y vuelve a esconderse. La espada que viaja en su brazo, el Honedge, abre un ojo. Lo cierra.' },
				{ set: { 'flag.b04_entrada_lista': true } },
			] },
			{ say: 'ysolde', text: 'Tercero: no se hiere a nadie. Ni a los guardias. Ni a los que te caigan mal. Si alguien te reta, se combate y se sigue. Los Vencejos no dejan huella. Dejan plumas.' },
			{ quest: 'b04_m4', stage: 'dentro' },
			{ quest: 'b04_q_tejado', stage: 'mirar' },
			{ say: 'rotom', text: '¡Bzzt! ¡Operación Tejado en marcha! He puesto el brillo de la pantalla al mínimo. Al mínimo mínimo. —Pausa—. Ahora no veo nada. Lo subo un poquito.' },
		],
		b04_ysolde_azotea: [
			{ if: '!' + OBS_OK, then: [
				{ say: 'ysolde', text: 'Los tres puntos de observación. La cornisa, la antena, el depósito. —Sin girarse—. Desde abajo se mira. Desde arriba se ve. No es lo mismo.' },
			] },
			{ if: OBS_OK + ' && !' + ENTRADA_OK, then: [
				{ say: 'ysolde', text: 'Ya has visto lo que hay que ver. Falta la puerta. Alguien te espera para eso. No le hagas esperar más: los que esperan mucho se ponen nerviosos, y los nerviosos hacen ruido.' },
			] },
			{ if: OBS_OK + ' && ' + ENTRADA_OK + ' && !beat("tejado_vigilante")', then: [
				{ say: 'ysolde', text: 'El vigilante del andamio. Hasta que no se vaya a contarle a su jefe que ha perdido, no podemos bajar.' },
			] },
			{ if: OBS_OK + ' && ' + ENTRADA_OK + ' && beat("tejado_vigilante")', then: [
				{ say: 'ysolde', text: 'Todo listo. El borde del tejado. Abajo hay un toldo. —Te mira por primera vez—. ¿A qué esperas? ¿A que te empuje? No empujo a nadie. Es una norma. Pero me cuesta.' },
			] },
		],
		b04_ysolde_vuelta: [
			{ say: 'ysolde', text: 'Has vuelto a subir. —Sigue sentada en el borde—. Los archivos están abajo, no aquí. Aquí solo estoy yo. Y el viento.' },
			{ if: 'flag.b04_fuente_l', then: [
				{ say: 'ysolde', text: 'Ya tienes las hojas. Bien. No las leas aquí arriba. Con este viento, se te vuela la prueba y la encuentra un Pidgeotto. Los Pidgeotto no testifican.' },
			] },
		],

		// ----- Puntos de observación -----
		b04_obs_cornisa: [
			{ set: { 'flag.b04_obs_cornisa': true } },
			{ text: 'Avanzas por la cornisa norte, de lado, con la espalda pegada a la pared. Al final hay un saliente de piedra, justo enfrente de la pasarela de cristal que une la Torre Lemnis con Silph.' },
			{ text: 'Te agachas. La luz de la lemniscata pasa por encima, azul, y sigue. Miras.' },
			{ text: 'Por la pasarela cruzan dos guardias, uno detrás de otro, con linternas. Uniformes negros, gorra negra. En el pecho, donde antes debía de haber una letra, un parche gris cosido a mano. Llegan a Silph, dan la vuelta y vuelven a la Torre. Cuentas: **seis minutos** de ida y vuelta.' },
			{ if: LUC, then: [
				{ cutscene: { time: 'noche', bg: { type: 'city', roofs: ['#8a8f9e', '#5a626e'], far: '#1f2e4f' }, start: 'dark', frames: [
					{ actors: [{ mon: '{riolu}', key: 'rio', at: 0.3, size: 's', enter: 'left' }], cam: 'still', text: '{riolu} se agacha a tu lado. Cierra los ojos. Los apéndices de detrás de las orejas se levantan, despacio.' },
					{ weather: 'sparks', cam: 'push', fx: ['glow', 'ripple'], text: 'Y de pronto, a través de las paredes de cristal, ves lo que ve él: siluetas de luz. Azules, rojas, amarillas. Personas. Pokémon. Un guardia sentado en una silla, en la planta once, con la cabeza caída de sueño. Otro, de pie junto a una fotocopiadora.' },
					{ fx: 'heartbeat', color: '#d8c84a', cam: 'pan-right', text: 'Y en una sala del fondo, una silueta sola, inclinada sobre una mesa. Brilla de un color raro. Inquieto. Como una bombilla que zumba.' },
				] } },
				{ text: 'Cuando {riolu} abre los ojos, las siluetas se apagan. Pero te acuerdas de dónde estaba cada una.' },
				{ happy: { who: 'riolu', n: 3 } },
			], else: [
				{ text: 'En la planta once de Silph, a través de las ventanas, ves a un guardia dormido en una silla y a otro junto a una fotocopiadora. Al fondo, en un cuarto con la luz encendida, alguien se mueve deprisa entre aparatos.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! Mapa actualizado. —Muy bajito—. Seis minutos de ronda. Dos guardias dentro. Uno dormido. Lo apunto todo en letra pequeña para que no se oiga.' },
			{ call: 'b04_obs_check' },
		],
		b04_obs_antena: [
			{ set: { 'flag.b04_obs_antena': true } },
			{ text: 'Trepas por la escalerilla de la antena. Se mueve con el viento. Tú también. Arriba del todo, agarrad{o|a|e} con las dos manos, la ciudad se abre entera debajo de ti.' },
			{ text: 'Desde aquí ves la fachada de la Torre Lemnis, planta por planta. Casi todas a oscuras. En la planta veinticuatro, una sola ventana encendida.' },
			{ text: 'Dentro, una mujer de pelo gris acero, muy corto, con un abrigo largo gris, está sentada delante de una taza de té. No bebe. Mira la superficie del té. Escribe algo en una libreta cuadriculada. Vuelve a mirar el té.' },
			{ if: 'flag.b04_magda_tren', then: [
				{ say: 'rotom', text: '¡Bzzt! —Lo más bajito que ha hablado nunca—. ¡La del Termo! La del tren. La de la servilleta. ¡Está ahí! Midiendo el té. Otra vez.' },
			], else: [
				{ say: 'rotom', text: '¡Bzzt! —Muy bajito—. Una señora mirando una taza de té a medianoche. En una torre de treinta plantas. Eso es o muy triste o muy importante.' },
			] },
			{ text: 'La mujer deja el bolígrafo. Levanta la vista hacia la ventana. Durante un segundo parece que te mira a ti, aunque es imposible: estás a oscuras, en lo alto de una antena, al otro lado de la calle.' },
			{ text: 'Baja la persiana. Despacio. Hasta abajo.' },
			{ text: 'Desde la antena también se ve la azotea de Silph: una caseta de ascensor, un helipuerto pintado que nadie usa y, entre las dos torres, el hueco de tres metros del que hablaba Ysolde. Abajo del todo, un callejón.' },
			{ call: 'b04_obs_check' },
		],
		b04_obs_deposito: [
			{ set: { 'flag.b04_obs_deposito': true } },
			{ text: 'El depósito de agua es un barril enorme de madera sobre cuatro patas de hierro. Subes por detrás. Arriba hay un charco de lluvia vieja y, en el centro, clavada en la madera, una pluma gris.' },
			{ text: 'Desde aquí se ve el callejón de detrás de Silph. Contenedores, cajas de reparto, una puerta metálica con un cartel: «Entrada de servicio · Personal de Silph». Junto a la puerta, una cámara de seguridad que gira despacio.' },
			{ text: 'Y justo debajo, pegado a la pared del callejón, el puesto de un frutero que ya ha cerrado: cajas de naranjas, manzanas y Bayas Zreza apiladas bajo un **toldo a rayas** naranjas y blancas, tenso como un tambor.' },
			{ text: 'Por el callejón pasa un guardia con linterna. Mira los contenedores. Mira la puerta. No mira hacia arriba. Nadie mira nunca hacia arriba.' },
			{ say: 'ysolde', text: 'Desde el otro lado del tejado, sin levantar la voz, pero se oye igual: «La cámara gira cada cuarenta segundos. El toldo aguanta ciento veinte kilos. Lo he probado. Dos veces».' },
			{ say: 'rotom', text: '¡Bzzt! ¿Cómo que lo ha probado? —Pausa—. No quiero saberlo. Sí quiero. No.' },
			{ call: 'b04_obs_check' },
		],
		b04_obs_check: [
			{ if: OBS_OK + ' && !flag.b04_obs_todas', then: [
				{ set: { 'flag.b04_obs_todas': true } },
				{ text: 'Te sientas un segundo detrás de una chimenea. Cierras los ojos y lo repasas: la ronda de seis minutos, los guardias de la planta once, la ventana de la planta veinticuatro, la cámara que gira, el toldo naranja.' },
				{ text: 'Desde arriba, la ciudad tiene un orden que desde la calle no se ve. Como un tablero. Como si alguien lo hubiera dibujado.' },
				{ quest: 'b04_q_tejado', stage: 'bajar' },
				{ say: 'rotom', text: '¡Bzzt! Ya lo hemos visto todo. Bueno, todo lo que se ve. Ysolde dice que lo importante es lo que no se ve. Yo eso no lo puedo apuntar.' },
			] },
		],
		b04_obs_repetir: [
			{ text: 'Vuelves a mirar. La ronda de los guardias, la luz que barre los tejados, el callejón. Todo sigue igual. Todo sigue en su sitio, como un reloj.' },
		],

		// ----- El contacto (según la decisión Rocket del B3) -----
		b04_atlas_tarjeta: [
			{ if: 'flag.b04_entrada_lista', then: [{ end: true }] },
			{ text: 'Saltas el murete que separa las dos azoteas. Un metro de hueco. No mires abajo. Miras abajo.' },
			{ text: 'El hombre del traje blanco no se gira. Pelo azul peinado hacia atrás. Las manos a la espalda. Mira la Torre Lemnis como miraba la máquina de Caoba: como quien mira una chimenea.' },
			{ say: 'atlas', text: 'Una hora esperando. Sabía que subirías: en Caoba también entraste por donde nadie entra. —Se gira—. Los que van por los tejados siempre acaban pasando por aquí. Solo hay que tener paciencia. Yo tengo mucha.' },
			{ say: 'atlas', text: 'Te dije que te debía una. Y yo pago lo que debo. —Saca algo del bolsillo interior de la chaqueta—. Cuando la fundación nos pagaba, la familia también limpiaba. Oficinas, de noche. Esta torre. Esa de al lado. Me quedé una cosa. Por costumbre.' },
			{ cutscene: { time: 'noche', bg: { type: 'city', roofs: ['#8a8f9e', '#5a626e'], far: '#1f2e4f' }, start: 'dark', frames: [
				{ actors: [{ id: 'atlas', at: 'left', dim: true }], on: '_c', fx: 'light', item: 'tarjetallave', text: 'Una tarjeta magnética gris, con el logo rojo de Silph S.A. en una esquina. Gastada en los bordes, de tanto pasar por lectores que no la querían dejar entrar.' },
				{ actors: [{ key: '_c', do: 'turn' }], cam: 'push', text: 'Por detrás, una banda negra y, escrito a rotulador con letra pequeña, un número que alguien ha tachado. Debajo, otro número. Tachado también. Debajo: «11».' },
				{ color: '#6f9bff', fx: 'glow', text: 'La luz de la lemniscata pasa por encima de ustedes. La tarjeta brilla un instante, gris y roja. Luego, otra vez, oscuridad.' },
			] } },
			{ give: 'tarjetallave' },
			{ set: { 'flag.b04_entrada_lista': true, 'flag.b04_atlas_pagado': true } },
			{ say: 'atlas', text: 'Abre la puerta sin número de la planta once. Lo sé porque la abrí yo, una noche, por curiosidad. Dentro había cajas con un ocho tumbado. Cerré y no volví. —Pausa—. La curiosidad es para la gente que tiene dónde caerse muerta.' },
			{ choice: [
				{ text: '«¿Qué ha sido de los chicos?»', then: [
					{ say: 'atlas', text: 'Repartidos. Uno en un taller. Dos en el puerto de Carmín. Toni vende arroz con leche en la Ruta 37, con su madre. Dice que gana más que conmigo. Es verdad. —Casi sonríe—. La familia ya no me necesita. Era lo que quería. No sé por qué me sienta tan mal.' },
				] },
				{ text: '«Ahora estamos en paz.»', then: [
					{ say: 'atlas', text: 'En paz. —Lo repite despacio, como una palabra en otro idioma—. Hace mucho que no estaba en paz con nadie. Se me hace raro. Como un traje nuevo.' },
				] },
				{ text: '«Atenea trabaja para Lemnis.»', then: [
					{ say: 'atlas', text: 'Atenea trabaja para quien le pague el alquiler a los suyos. Como yo. —Mira la planta once—. Si te la encuentras ahí dentro, no le digas que te he dado esto. Por ti no. Por ella. Le dolería más a ella.' },
				] },
			] },
			{ text: 'Atlas se da la vuelta, salta el murete al otro lado como quien baja un escalón y se pierde entre las chimeneas de ventilación. No mira atrás. Es de los que no miran atrás.' },
			{ intel: { npc: 'atlas', text: 'Te esperaba en una azotea de Azafrán. Pagó su deuda con una Tarjeta Llave de Silph que se quedó cuando la «familia» limpiaba la torre de noche: abre la puerta sin número de la planta once.' } },
		],
		b04_handsome_declaracion: [
			{ if: 'flag.b04_entrada_lista', then: [{ end: true }] },
			{ text: 'Por el andamio de limpieza de la Torre Lemnis sube, muy despacio, un limpiacristales. Lleva gabardina. Lleva sombrero. Lleva un bigote postizo enorme y una escobilla de goma que no ha usado nunca.' },
			{ text: 'La plataforma del andamio llega a la altura de la azotea con un chirrido. El limpiacristales se agarra a la barandilla con las dos manos y no se suelta.' },
			{ say: 'handsome', as: 'Limpiacristales', text: '¡Buenas noches! Soy un limpiacristales. De noche. Limpio cristales de noche, que se ven mejor las manchas. —Mira hacia abajo. Se pone verde—. Handsome no mira hacia abajo. Handsome nunca mira hacia abajo.' },
			{ text: 'Se quita el bigote. Se lo guarda en el bolsillo. Sigue sin soltar la barandilla.' },
			{ say: 'handsome', text: '{jugador}. Handsome ha venido a traerte algo. Atlas, el de Caoba, lleva semanas sin decir una palabra en el interrogatorio. Una sola: tu nombre. Ayer dijo otra cosa. Dijo: «Que se lo den a {jugador}. A nadie más».' },
			{ text: 'Te da una hoja doblada en cuatro, con sellos de la policía de Johto y una firma con una A grande.' },
			{ give: 'declaracionatlas' },
			{ say: 'handsome', text: '«Planta once. La puerta sin número. El guardia de la puerta va a por café a las tres y diez. Tarda nueve minutos, porque la máquina de la planta once está rota y baja a la diez». —Lo recita de memoria—. Handsome no sabe qué hay en la planta once. Handsome no quiere saberlo todavía. Quiere que lo sepas tú.' },
			{ choice: [
				{ text: '«¿Lo sabe el inspector Lebrun?»', then: [
					{ say: 'handsome', text: 'No. —Se queda callado más de la cuenta—. Handsome no se lo ha dicho. No sabe por qué. Será porque Atlas dijo «a nadie más». Handsome respeta las últimas voluntades. Aunque Atlas no se esté muriendo. Es un decir.' },
					{ set: { 'flag.b04_handsome_calla': true } },
				] },
				{ text: '«Gracias, Handsome.»', then: [
					{ say: 'handsome', text: 'No me las des. —Se le escapa el «me» en vez de «Handsome» y no se da cuenta—. Bueno, dámelas. Pero cuando estemos los dos abajo. Con los pies en el suelo. En un suelo muy plano.' },
				] },
				{ text: '«¿Te ayudo a bajar?»', then: [
					{ say: 'handsome', text: 'Handsome bajará solo. Con dignidad. —La plataforma del andamio pega un tirón. Handsome grita, muy agudo—. Con dignidad y despacio.' },
				] },
			] },
			{ text: 'La plataforma vuelve a bajar con su chirrido, muy despacio. Ves desaparecer el sombrero de Handsome por el borde de la azotea. Oyes, durante un buen rato, un «ay, ay, ay» cada vez más lejano.' },
			{ say: 'ysolde', text: 'Desde el otro lado del tejado: «Tu amigo el policía es la persona más valiente que conozco. Y la que peor sube andamios. Las dos cosas a la vez. No sabía que se podía».' },
			{ set: { 'flag.b04_entrada_lista': true, 'flag.b04_atlas_declaracion': true } },
			{ intel: { npc: 'handsome', text: 'Subió a la azotea disfrazado de limpiacristales para traerte la declaración de Atlas: «Planta once, la puerta sin número; el guardia va a por café a las 3:10 y tarda nueve minutos». No se lo ha contado a Lebrun.' } },
		],
		b04_toni_conducto: [
			{ if: 'flag.b04_entrada_lista', then: [{ end: true }] },
			{ text: 'Te sientas detrás de una chimenea y abres la carta de Toni. Dentro, además de la carta, hay un dibujo hecho con boli en una hoja de cuaderno: un edificio visto de lado, con flechas, monigotes y una línea que sube haciendo zigzag.' },
			{ text: 'Lo pones a contraluz con la lemniscata. Arriba, una flecha con letras mayúsculas: «AQUÍ LIMPIABA LA MAYOR». En la planta once, una cruz: «ARCHIVO. HUELE A PAPEL Y A MIEDO». Y la línea en zigzag, desde el callejón hasta la cruz: «CONDUCTO DE VENTILACIÓN. CABE UNA PERSONA. YO QUEPO (APRETANDO)».' },
			{ say: 'rotom', text: '¡Bzzt! Es el peor plano que he visto nunca. —Pausa—. Y es perfecto. Pone dónde está todo. Hasta pone «aquí hay un chicle pegado, no tocar».' },
			{ say: 'ysolde', text: 'Se acerca, mira el dibujo por encima de tu hombro y asiente una vez. «Un conducto. Los mejores planos los dibuja siempre la gente que limpia. Nadie se fija en ellos. Ellos se fijan en todo».' },
			{ set: { 'flag.b04_entrada_lista': true, 'flag.b04_toni_plano': true } },
			{ intel: { npc: 'recluta_rocket_b3', text: 'Toni te escribió desde la casa de su madre, en la Ruta 37. Te mandó un dibujo del conducto de ventilación de Silph: la «familia» limpiaba allí de noche.' } },
		],

		// ----- El salto de fe -----
		b04_salto: [
			{ if: 'flag.b04_salto', then: [{ end: true }] },
			{ text: 'El borde del tejado. Abajo, muy abajo, el callejón. Y en el callejón, pequeñito, el toldo a rayas del puesto de fruta.' },
			{ say: 'ysolde', text: 'La cámara acaba de girar. Tienes cuarenta segundos. —Se pone a tu lado—. No mires el suelo. Mira el toldo. El suelo no te importa. El toldo es lo único que existe.' },
			{ text: '{riolu} se asoma al borde. Te mira. Tiene la cara exacta de alguien que ya sabe cómo acaba esto. Y que va a saltar igual.', cond: LUC },
			{ prompt: 'El borde. El vacío. El toldo naranja.', choice: [
				{ text: 'Saltar.', then: [] },
				{ text: 'Respirar hondo… y saltar.', then: [] },
			] },
			{ cutscene: { time: 'noche', bg: { type: 'city', roofs: ['#8a8f9e', '#5a626e', '#c4a43a'], far: '#1f2e4f' }, start: 'light', frames: [
				{ cam: 'pan-down', fx: ['zoom', 'speedlines'], text: 'Abres los brazos. Das un paso al vacío. Y caes.' },
				{ fx: 'speedlines', cam: 'pan-down', actors: [{ mon: 'pidgeotto', at: 0.8, size: 's', enter: 'down', emote: 'zzz' }], text: 'El viento te tira de la capucha. Las ventanas pasan a toda velocidad: una oficina vacía, una planta de plástico, un póster de un Machoke levantando cajas con la espalda recta. Un Pidgeotto que duerme en una cornisa abre un ojo y lo vuelve a cerrar.' },
				{ shake: 3, actors: [{ key: 'pidgeotto', remove: true, exit: 'up' }], on: false, fx: 'impact', text: '*¡FLUMP!*\n\nEl toldo te recibe como un tambor. Rebotas. El toldo cede. Y aterrizas, de espaldas, en una montaña de naranjas.' },
				{ fx: 'flash', text: 'Las naranjas salen rodando en todas direcciones por el callejón. Una, dos, cuarenta. Una manzana te cae en la frente desde lo alto de la pila, con mucha puntería.' },
				{ actors: [{ id: 'ysolde', at: 'right', enter: 'drop' }], text: 'Ysolde aterriza al lado. Sin ruido. En la única caja vacía. Se arregla la capucha.' },
			] } },
			{ text: '{riolu} aterriza un segundo después, de pie, en la caja de las Bayas Zreza, sin aplastar ni una. Se sacude. Te mira, tumbad{o|a|e} entre las naranjas. Si un Lucario pudiera reírse con los ojos, sería así.', cond: LUC },
			{ set: { 'flag.b04_salto': true } },
			{ text: 'Recoges las naranjas a toda prisa y las vuelves a apilar, más o menos. Dejas unas monedas debajo de la caja de las manzanas. Por las naranjas. Y por el toldo, que ahora tiene forma de ti.' },
			{ money: -500 },
			{ if: '!' + PLUMA, then: [
				{ set: { 'flag.b04_vencejo_pluma': true } },
				{ say: 'ysolde', text: 'Te mira desde la caja vacía. Algo se le mueve en la cara. Casi parece una sonrisa. «Ahora sí. Pluma. Bienvenid{o|a|e}. Te asigno el resto de la operación».' },
				{ say: 'rotom', text: '¡Bzzt! ¡Nos han ascendido en un callejón! ¡Entre naranjas! No me lo imaginaba así, pero me gusta.' },
			], else: [
				{ say: 'ysolde', text: 'Un toldo, ciento veinte kilos, cuarenta naranjas. —Lo dice muy seria—. Entra en lo previsto. Más o menos.' },
				{ say: 'rotom', text: '¡Bzzt! Altura: once pisos. Naranjas: cuarenta y tres. Daños personales: una manzana en la frente. ¡Ha salido bien! Siempre sale bien. Sigo sin entender cómo.' },
			] },
			{ text: 'La cámara de seguridad vuelve a girar hacia el callejón. Ve un puesto de fruta un poco desordenado. Nada más.' },
			{ call: 'b04_entrar' },
		],
		b04_entrar: [
			{ if: QUEMAR, then: [
				{ text: 'La puerta de servicio. Pasas la Tarjeta Llave de Atlas por el lector. Una lucecita roja. Un segundo eterno. Verde. *Clac.*' },
				{ text: 'Montacargas. Botones del 1 al 15. El 11 tiene un trozo de cinta aislante encima. Lo despegas. Lo pulsas. El montacargas sube con un quejido de cables viejos.' },
				{ text: 'En la planta once, al final del pasillo, una puerta sin número. Pasas la tarjeta. Verde otra vez. Detrás, oscuridad y olor a papel.' },
			] },
			{ if: POLICIA, then: [
				{ text: 'La puerta de servicio está abierta: un repartidor la ha dejado calzada con una caja para fumar fuera. Subes por la escalera, once pisos, contando los escalones para no pensar.' },
				{ text: 'En la planta once, al final del pasillo, una puerta sin número. Delante, una silla vacía y una taza de café también vacía. Miras la hora: las tres y diez. Desde el hueco de la escalera oyes pasos que bajan a la diez, y una voz que se queja de la máquina rota.' },
				{ text: 'Nueve minutos. Atlas no se equivocaba. La puerta no tiene cerradura: solo tenía al guardia.' },
			] },
			{ if: LIBRES, then: [
				{ text: 'Junto a la puerta de servicio, detrás de un contenedor, una rejilla de ventilación. Exactamente donde la dibujó Toni. Al lado, a la altura de la rodilla, un chicle pegado. «No tocar». No lo tocas.' },
				{ text: 'Quitas la rejilla y te metes. El conducto es de chapa, estrecho, y sube haciendo zigzag. Avanzas a gatas, con la linterna de la Pokédex en la boca. Huele a polvo y, muy al fondo, a arroz con leche. Alguien dejó aquí la merienda hace mucho.' },
				{ text: '{riolu} va delante, con el aura encendida muy bajito, como una lamparita de noche. En cada esquina se para y espera a que llegues.', cond: LUC },
				{ text: 'Once pisos de zigzag después, una rejilla da a una sala oscura que huele a papel. A papel y a miedo, como ponía en el dibujo.' },
			] },
			{ if: ROCKET_NINGUNA, then: [
				{ text: 'La puerta de servicio tiene una cerradura electrónica, una cámara y un cartel que dice «Alarma conectada». Ysolde la mira como quien mira un crucigrama fácil.' },
				{ text: 'Se sube la manga izquierda. El Honedge sale de su brazo sin hacer ruido: una espada de hoja fina, con un ojo en la empuñadura. Mira la cerradura. Mira a Ysolde. Ysolde asiente.' },
				{ cutscene: { time: 'noche', bg: { type: 'city', roofs: ['#5a626e'], far: '#1f2e4f' }, start: 'dark', frames: [
					{ actors: [{ id: 'ysolde', at: 'left', dim: true }, { mon: 'honedge', at: 0.68, size: 's', enter: 'pop' }], fx: ['flash', 'slash'], text: 'Un destello. Un ruido muy pequeño, como el de unas tijeras cortando un hilo.' },
					{ actors: [{ key: 'honedge', do: 'nod' }], cam: 'push', text: 'La cerradura sigue en su sitio. La lucecita sigue en verde. Pero el pestillo, por dentro, está partido en dos, limpio como una rebanada de pan.' },
				] } },
				{ say: 'ysolde', text: 'Las puertas que no se abren con favores. —El Honedge vuelve a su manga—. Sube. Planta once. Yo vigilo la escalera.' },
			] },
			{ quest: 'b04_q_tejado', done: true },
			{ go: 'archivo_silph' },
		],
		b04_volver_archivo: [
			{ text: 'Bajas por la escalera de incendios hasta el callejón. El puesto de fruta sigue ahí, con el toldo un poco hundido. Entras otra vez por donde entraste la primera vez.' },
			{ go: 'archivo_silph' },
		],

		// ----- Planta 11 -----
		b04_archivo_llegada: [
			{ set: { 'flag.b04_archivo_llegada': true } },
			{ text: 'La planta once. Fluorescentes que zumban. Pasillos de archivadores metálicos hasta el techo, en filas. Cajas apiladas por todas partes con la misma pegatina: «Lemnis · Infraestructura · No abrir».' },
			{ text: 'Ysolde aparece a tu lado sin que la hayas oído llegar. Se pega a la pared y habla en un susurro.' },
			{ say: 'ysolde', text: 'Busca tres cosas. Las hojas firmadas con una sola letra: están en los archivadores de seguimiento. Lo que conecta Caoba con esta ciudad: estará en la sala de reuniones, porque a la gente que manda le gusta clavar cosas en corchos. Y lo que quieras tú. Siempre hay algo que uno busca para sí.' },
			{ if: '!quest.b04_t_renata', then: [
				{ say: 'rotom', text: '¡Bzzt! —Muy bajito—. Oye. Silph. Silph es la empresa del ingeniero de Renata. El del despacho tapiado de Trigal. ¿Cómo se llamaba? Matías. Matías Olmedo. —Pausa—. Aquí debe de haber expedientes de personal. De los de antes.' },
				{ quest: 'b04_t_renata', stage: 'archivo' },
			] },
			{ quest: 'b04_q_archivo', stage: 'buscar' },
			{ text: 'Al fondo del pasillo, sentado en una silla de oficina junto a los archivadores, un guardia de uniforme negro bosteza tan fuerte que se le oye crujir la mandíbula.' },
		],
		b04_deduccion: [
			{ if: 'flag.b04_fuente_l', then: [{ end: true }] },
			{ text: 'Los archivadores de seguimiento. Cajones metálicos con etiquetas de una sola letra: **C.**, **K.**, **R.**, **T.**, **L.** Abres el primero. Carpetas, fichas, fotos borrosas tomadas desde lejos. Tu cara, en casi todas.' },
			{ say: 'rotom', text: '…Bzzt. Somos nosotros. En la Puerta de Luminalia. En Relieve. En un tren. —Muy bajito—. Hay muchísimas fotos. Nunca nos habían hecho tantas fotos. No me gusta nada.' },
			{ text: 'Encima de todo, una hoja de resumen, grapada, con una tabla. Alguien la ha usado para comprobar de dónde sale cada dato. «Hoja de procedencia · Sujeto: Colaborador Especial».' },
			{ text: '**1.** Llegada a Luminalia, 06:42 · Fuente **C.** · Origen: cámara 4 de la Puerta de Luminalia.\n**2.** Billete del Tren Magnético, 23:05, vagón 3, asiento 12A · Fuente **T.** · Origen: reservas de la Gira.\n**3.** Recepción de la Gira, asistió, 41 minutos · Fuente **R.** · Origen: lista de invitados.\n**4.** Tren: parada en el km 212, 4 minutos; llegada a Azafrán 01:14; 76 minutos de retraso · Fuente **L.** · Origen: panel de llegadas de la estación de Azafrán.\n**5.** Puerta de Kanto: Pokédex registrada · Fuente **K.** · Origen: tablet del registro de viajeros.' },
			{ say: 'ysolde', text: 'Desde la esquina, sin girarse: «Cuatro de esas líneas son verdad. Una miente sobre de dónde sale. La que miente es la que buscamos. La gente honrada no necesita inventarse el origen de nada».' },
			{ prompt: '¿Qué línea no puede ser verdad?', choice: [
				{ text: 'La 1: la cámara de Luminalia.', then: [{ call: 'b04_deduccion_fallo1' }] },
				{ text: 'La 2: las reservas de la Gira.', then: [{ call: 'b04_deduccion_fallo1' }] },
				{ text: 'La 3: la lista de invitados.', then: [{ call: 'b04_deduccion_fallo1' }] },
				{ text: 'La 4: el panel de la estación.', then: [{ set: { 'flag.b04_deduccion_primera': true } }, { call: 'b04_deduccion_ok' }] },
				{ text: 'La 5: el registro de la Puerta.', then: [{ call: 'b04_deduccion_fallo1' }] },
			] },
		],
		b04_deduccion_fallo1: [
			{ say: 'ysolde', text: 'No. Eso pudo saberlo cualquiera que estuviera allí con una cámara o una lista. —Señala la tabla con un dedo, sin tocarla—. Fíjate en los orígenes, no en los datos. ¿Cuál de esos sitios has visto tú con tus propios ojos?' },
			{ if: 'flag.b04_panel_visto || flag.b04_lebrun_panel', then: [
				{ text: 'Te acuerdas del panel de llegadas de la estación de Azafrán, parpadeando en ámbar sobre las taquillas: «TRIGAL 23:05 · VÍA 1 · LLEGADA: CON RETRASO». Nada más.' },
			], else: [
				{ say: 'rotom', text: '¡Bzzt! —Bajito—. Yo me acuerdo de una cosa. El panel de la estación de Azafrán, cuando llegamos. Lo miré mientras bajábamos. Ponía «con retraso». Y ya. Ni la hora. Ni cuánto.' },
			] },
			{ prompt: 'Otra vez. ¿Qué línea no puede ser verdad?', choice: [
				{ text: 'La 4: el panel de la estación.', then: [{ call: 'b04_deduccion_ok' }] },
				{ text: 'Otra (no lo veo).', then: [
					{ say: 'ysolde', text: 'La cuatro. —Sin impaciencia—. El panel decía «con retraso». No decía kilómetros ni minutos. Quien escribió esa línea sabía mucho más de lo que había en el panel. Y quiso que pareciera que no.' },
					{ call: 'b04_deduccion_ok' },
				] },
			] },
		],
		b04_deduccion_ok: [
			{ if: 'flag.b04_deduccion_primera', then: [
				{ say: 'ysolde', text: 'La cuatro. —Te mira de reojo—. A la primera. Bien. Los que miran desde arriba ven las mentiras porque ven de dónde vienen las cosas.' },
			], else: [
				{ say: 'ysolde', text: 'La cuatro. El panel solo decía «con retraso». Lo demás no lo sabía ningún panel.' },
			] },
			{ text: 'Kilómetro doscientos doce. Cuatro minutos. Las 01:14. Setenta y seis minutos de retraso.' },
			{ text: 'Esas cifras ya las has oído. Las mismas, en el mismo orden, con la misma voz tranquila de quien lee un parte. En un parque, junto a una Puerta, una mañana sin dormir.' },
			{ text: 'Abres el cajón de la **L.** Dentro hay una sola carpeta, muy fina. Y, en el fondo del cajón, rodando sueltos, un puñado de caramelos de menta. Envueltos en papel azul. Retorcidos por las dos puntas.' },
			{ cutscene: { bg: { type: 'indoor', wall: '#cfd6e2', floor: '#4a4f6a' }, start: 'dark', frames: [
				{ cam: 'push', fx: 'light', item: 'informefuentel', text: 'Unas hojas grapadas. «Informe de seguimiento». Cada línea, una hora y un lugar. Luminalia, 06:42. La Agencia. Relieve. El Encinar. Trigal. El tren.' },
				{ fx: 'heartbeat', color: '#1f2e4f', actors: [{ key: '_c', size: 'l' }], cam: 'still', text: 'Y al final de cada línea, la misma firma. Una sola letra, a máquina: **Fuente: L.**' },
				{ color: '#1f2e4f', fx: ['zoom', 'heartbeat'], text: 'Grapado a la última hoja, un caramelo de menta envuelto en papel azul.' },
			] } },
			{ give: 'informefuentel' },
			{ set: { 'flag.b04_fuente_l': true } },
			{ quest: 'b04_t_lebrun', stage: 'prueba' },
			{ say: 'rotom', text: '…Bzzt. «Fuente: L.» —Pausa larga. La pantalla parpadea—. Hay muchísima gente que empieza por L. Muchísima. Lila. Lino. Lucien. Lucario. —Pausa—. Lucario no. Lucario está aquí.' },
			{ text: 'No dices nada. Guardas las hojas en el bolsillo de dentro de la chaqueta, donde se guardan las cosas que pesan más de lo que pesan.' },
			{ if: LUC, then: [
				{ text: '{riolu} agarra uno de los caramelos del cajón. Lo huele, despacio, como olió el de Ansel en la recepción. Y lo deja caer otra vez en el fondo del cajón, con cuidado, como quien devuelve algo que no es suyo.' },
			] },
			{ say: 'ysolde', text: 'En toda empresa hay quien firma y hay quien decide. —Muy bajito—. Y luego está el que lo cuenta todo. A ese no lo ve nunca nadie, porque está siempre en la habitación.' },
			{ intel: { npc: 'ysolde', text: 'En la planta 11 de Silph te ayudó a encontrar la línea que mentía en la hoja de procedencia: «Fuente: L.» decía haber sacado del panel de la estación datos que el panel no daba.' } },
			{ call: 'b04_archivo_check' },
		],
		b04_archivadores_despues: [
			{ text: 'Los archivadores de seguimiento. Las fotos borrosas. El cajón de la **L.**, vacío salvo por los caramelos de menta en papel azul. Nadie se ha comido ninguno.' },
		],
		b04_calendario: [
			{ if: 'flag.b04_magda_nombre', then: [{ end: true }] },
			{ text: 'La sala de reuniones. Una mesa larga, doce sillas, un proyector apagado. Y en la pared, un corcho enorme lleno de papeles clavados con chinchetas de colores, todas alineadas, todas a la misma distancia.' },
			{ text: 'En el centro, un calendario de pared, de los grandes, con cuadrícula milimetrada. En la cabecera: «**CALENDARIO DE ARRANQUE · RED DE PRUEBAS DE KANTO · NODO 03**».' },
			{ text: 'Las casillas están rellenas con una letra recta y pequeña, sin un solo tachón:\n\n«Caoba: prueba de frecuencia de arranque (sujetos 1–12). Resultado: válido. Error de calibración en sujeto 9, corregido».\n«Tendido Trigal–Azafrán: medición en túnel, km 212. Parada de 4 min. **La hago yo**».\n«Repetidor de Azafrán: operativo».\n«Celeste: fuente F-03 estable. Rendimiento en prueba: 31 %».\n«Próximo hito: arranque a escala».' },
			{ text: 'Y abajo, en la esquina, la firma. Una sola letra: **M.** Y debajo de la inicial, más pequeño, como quien no puede evitar ser exacta: «Magda Ivers · Jefa de Infraestructura · Lemnis Kanto».' },
			{ if: 'has("servilletam")', then: [
				{ text: 'Sacas la servilleta del tren. La pones al lado del calendario. Las mismas columnas rectas. La misma M, pequeña, como quien firma por costumbre. La misma letra.' },
				{ say: 'rotom', text: '¡Bzzt! ¡Es ella! ¡La del Termo! ¡La de la ventana de la planta veinticuatro! —Bajito otra vez—. «La hago yo». La parada del túnel la hizo ella. Por eso miraba el té. Estaba midiendo su propia parada.' },
			], else: [
				{ say: 'rotom', text: '¡Bzzt! «M.» ¡La «M.» de las hojas de Caoba! Ya tiene nombre. Magda Ivers. —Pausa—. Suena a alguien que no se equivoca nunca. Eso da más miedo que un nombre feo.' },
			] },
			{ if: 'flag.b04_obs_antena', then: [
				{ text: 'Una mujer de pelo gris acero, delante de una taza de té, en una ventana de la planta veinticuatro. Bajando la persiana despacio, hasta abajo.' },
			] },
			{ text: '«Nodo 03». «Celeste». Bill tenía razón: la señal pasa por Azafrán y baja a la Cueva Celeste. Ahora ya sabes también quién la mantiene encendida.' },
			{ set: { 'flag.b04_magda_nombre': true } },
			{ intel: { npc: 'magda', text: '«M.» es Magda Ivers, jefa de Infraestructura de Lemnis Kanto. Firma el calendario de arranque de la red de pruebas de Kanto: la prueba de Caoba, la parada del tren en el km 212 («la hago yo»), el repetidor de Azafrán y una «fuente F-03» en Celeste: el Nodo 03.' } },
			{ call: 'b04_archivo_check' },
		],
		b04_calendario_despues: [
			{ text: 'El calendario del Nodo 03, en su corcho, con sus chinchetas alineadas. «La hago yo». La letra no tiembla en ninguna casilla.' },
		],
		b04_expediente: [
			{ if: 'flag.b04_expediente_visto', then: [{ end: true }] },
			{ set: { 'flag.b04_expediente_visto': true } },
			{ text: 'Un armario de madera, viejo, con la pintura levantada. Tiene una placa de latón: «Silph S.A. · Personal · 1º». Es lo único de esta planta que no lleva pegatinas de Lemnis.' },
			{ text: 'Los cajones van por orden alfabético. Ñ. O. **OLMEDO RIVAS, M.**' },
			{ if: RENATA_PUBLICA, then: [
				{ text: 'La carpeta está. Pero pesa como una hoja. La abres: vacía. Solo una nota adhesiva amarilla, pegada por dentro: «Contenido retirado por razones de patrimonio. No reabrir».' },
				{ text: 'La fecha de la nota es de la semana pasada. Del día siguiente al episodio de Renata.' },
				{ text: 'Al fondo de la carpeta, pegada con celo, se les ha olvidado una cosa: una foto de carné. Un hombre de unos cuarenta años, con gafas torcidas y cara de no haber dormido.' },
				{ give: 'fotoexpediente' },
				{ say: 'rotom', text: '…Bzzt. Lemnis llegó antes. —Muy bajito—. Escucharon el pódcast. Claro que lo escucharon. Lo escucha todo el mundo. Bueno, un cuarto de mundo.' },
			], else: [
				{ text: 'La carpeta está. Gruesa, con la esquina mordida por algún Rattata de archivo. Nadie la ha tocado en doce años: tiene polvo hasta en las grapas.' },
				{ cutscene: { bg: { type: 'indoor', wall: '#cfd6e2', floor: '#4a4f6a' }, start: 'dark', frames: [
					{ cam: 'push', fx: 'light', item: 'expedienteolmedo', text: '«Silph S.A. · Expediente de personal. Matías Olmedo Rivas. Ingeniero jefe, División Transporte. Proyecto ARCO».' },
					{ actors: [{ key: '_c', size: 'l' }], text: '«Última anotación: Baja voluntaria». Tachado. Encima, con otra letra: «**Trasladado a: Proyecto Arco II · Teselia**». Autoriza: un sello pequeño, dibujado a mano, con un ocho tumbado.' },
					{ actors: [{ key: '_c', do: 'turn' }], fx: 'zoom', text: 'Grapada atrás, una foto de carné. Gafas torcidas. Cara de no haber dormido. Y por detrás, a lápiz: «Para D., por si preguntan».' },
				] } },
				{ give: 'expedienteolmedo' },
				{ say: 'rotom', text: '¡Bzzt! ¡Trasladado! No desapareció: lo trasladaron. ¡A Teselia! —Pausa—. «Para D.». D. de Dámaso. Lo guardó para Dámaso.', cond: 'flag.b03_renata_espera' },
				{ say: 'rotom', text: '¡Bzzt! «Trasladado a Teselia». No es una baja. Es un traslado. Con un ocho tumbado como firma. —Pausa—. Esto se lo tenemos que contar a Renata. Ahora mismo. Bueno, cuando salgamos.', cond: '!flag.b03_renata_espera' },
			] },
			{ quest: 'b04_t_renata', stage: 'archivo', cond: '!quest.b04_t_renata' },
			{ call: 'b04_renata_llamada' },
			{ call: 'b04_archivo_check' },
		],
		b04_renata_llamada: [
			{ text: 'La Pokédex vibra en tu bolsillo. Vibra. Y vibra. Alguien que no sabe que estás a oscuras en una planta que no existe. En la pantalla: **Renata**.' },
			{ choice: [
				{ text: 'Contestar en un susurro.', then: [] },
				{ text: 'Meterte dentro del armario y contestar.', then: [{ text: 'Te metes en el hueco del armario, entre dos cajones. Huele a papel viejo y a naftalina. Es el sitio más absurdo en el que has contestado nunca una llamada.' }] },
			] },
			{ say: 'renata', text: '¿{jugador}? ¿Por qué susurras? ¿Estás en el cine? ¿En una biblioteca? ¿En un sitio donde no deberías estar? —Pausa—. Es la tercera. Es siempre la tercera. Cool, cool, cool. Susurro yo también.' },
			{ if: RENATA_PUBLICA, then: [
				{ text: 'Le cuentas lo de la carpeta vacía. La nota amarilla. La fecha.' },
				{ say: 'renata', text: '…El día después del episodio. —No dice nada durante un rato largo. Para Renata, larguísimo—. Fui yo. Lo emití y fueron a por la carpeta. Llegaron antes que nosotros porque yo les dije adónde ir. Con efectos de sonido.' },
				{ choice: [
					{ text: '«Tú no lo sabías. Y queda la foto.»', then: [
						{ af: { renata: 2 } },
						{ say: 'renata', text: 'Queda la foto. —Se le oye respirar—. «Para D., por si preguntan». Ya. Ya. Una foto es una cara. Una cara es una persona. Una persona no se archiva en una nota amarilla. Gracias. Eso lo pongo en el episodio. Sin decir que lo dijiste tú.' },
					] },
					{ text: '«Lemnis siempre llega antes. La próxima vez, no.»', then: [
						{ af: { renata: 1 } },
						{ say: 'renata', text: 'La próxima vez, no. —Lo repite como quien apunta una regla nueva en la pizarra—. Nota para el episodio: dejar de contarle al malo dónde están las pruebas. Parece obvio. No lo era.' },
					] },
				] },
			], else: [
				{ text: 'Le lees el expediente en voz baja. «Trasladado a: Proyecto Arco II · Teselia». El sello del ocho tumbado. «Para D., por si preguntan».' },
				{ say: 'renata', text: '…Teselia. —Silencio. Luego, una voz que no le habías oído nunca: bajita, sin chistes—. Trasladado. No desaparecido. Trasladado. A mi casa. Lo tenía en mi casa y lo buscaba en la de todos los demás.' },
				{ if: 'flag.b03_renata_espera', then: [
					{ say: 'renata', text: 'Y no lo emití. Me dijiste que esperara y esperé, y por eso la carpeta seguía ahí. Me fastidia muchísimo que tuvieras razón. Me encanta. Lo pongo en el episodio. Sin decir que la tenías tú.' },
					{ af: { renata: 3 } },
				], else: [
					{ say: 'renata', text: 'Y tú lo has encontrado en un armario. En Kanto. A medianoche. Susurrando. —Se le oye sonreír—. Si esto no es el mejor cold open de la historia del pódcast, no sé lo que es.' },
					{ af: { renata: 2 } },
				] },
			] },
			{ say: 'renata', text: 'Escucha. El próximo episodio no se graba aquí. Se graba lejos. Donde lo trasladaron. Cuando la Gira llegue a Teselia, búscame. Te debo un café. Y una disculpa. Y un capítulo entero.' },
			{ say: 'renata', text: 'Y sal de donde estés. Ya. Nota para el episodio: el testigo cuelga antes de que lo pillen.' },
			{ text: 'Cuelga. La pantalla se queda en negro. El fluorescente del pasillo zumba.' },
			{ quest: 'b04_t_renata', stage: 'abierto' },
			{ intel: { npc: 'renata', text: 'Te llamó mientras estabas en la planta 11 de Silph. El expediente de Matías Olmedo dice «Trasladado a: Proyecto Arco II · Teselia» (si la carpeta seguía allí) o fue retirado «por razones de patrimonio» (si se emitió el episodio). El próximo episodio se graba en Teselia.' } },
		],
		b04_expediente_despues: [
			{ text: 'El armario viejo de Silph. El cajón de la O, abierto. La carpeta de Matías Olmedo ya no te dice nada más de lo que te ha dicho.' },
		],
		b04_xero_silph: [
			{ set: { 'flag.b04_xero_silph': true } },
			{ text: 'El laboratorio provisional es un antiguo almacén lleno de mesas plegables, cables, osciloscopios y tazas de café a medio beber. En una pizarra, fórmulas que se cruzan con otras fórmulas. En el centro, una caja de metal con una antena que zumba.' },
			{ text: 'Inclinado sobre la caja, con gafas de soldador, bata blanca y el pelo naranja de punta, hay un hombre que se ríe solo mientras aprieta un tornillo.' },
			{ say: 'xero', text: '…cuarenta y uno, cuarenta y dos… ¡Bwahaha! —Se gira de golpe—. Oh. Un visitante. A las tres de la mañana. En una planta que no existe. —Se sube las gafas—. Qué falta de educación tan prometedora.' },
			{ if: 'flag.b01_xero_cafe || flag.b01_cromlech_hecha', then: [
				{ say: 'xero', text: 'Te conozco. Crómlech. La valla. La visita nocturna. —Te señala con el destornillador—. Tienes la costumbre de aparecer en los sitios donde trabajo de noche. Empiezo a sospechar que no es casualidad. ¡Bwahaha!' },
			], else: [
				{ say: 'xero', text: 'Xero. Contratista de I+D, en libertad condicional, con permiso firmado para estar aquí. Todo legal. Todo en regla. Me lo sé de memoria. ¿Y tú? ¿Tienes permiso firmado? No. Ya me parecía.' },
			] },
			{ say: 'xero', text: 'Me habrás visto en la pasarela de cristal. Cruzo doce veces al día, de la Torre a Silph y de Silph a la Torre. Me pagan por cruzar. Y por esto. —Le da una palmada a la caja que zumba—. Un repetidor. Recoge una señal que viene de muy lejos y la manda hacia abajo. Hacia el norte. No me preguntes qué dice la señal. No lo sé. Bueno, lo sé. Pero no me pagan por saberlo.' },
			{ if: LUC, then: [
				{ text: '{riolu} se acerca a la caja. Las orejas le tiemblan con el zumbido. Le gruñe. Bajito.' },
				{ say: 'xero', text: 'A tu Lucario no le gusta mi repetidor. —Lo mira con interés de científico—. Tiene buen oído. A mí tampoco me gusta. Pero yo no tengo orejas tan sensibles. Ni tantos principios.' },
			] },
			{ text: 'Ysolde está en la puerta del laboratorio, con una mano dentro de la manga izquierda. Xero la ve. Ella lo ve. Ninguno de los dos dice nada.' },
			{ say: 'xero', text: 'No voy a llamar a nadie. —Vuelve a su tornillo—. Si llamo, vienen los de seguridad. Si vienen los de seguridad, me hacen preguntas. Si me hacen preguntas, pierdo la cuenta de los tornillos. Y llevaba cuarenta y dos.' },
			{ text: 'Se queda un momento callado. El destornillador quieto. Luego, sin girarse, en otro tono:' },
			{ say: 'xero', text: '¿La has visto? A la jefa de la Agencia. En Luminalia. Matière. —Lo dice muy deprisa, como quien se quita una tirita—. ¿Come bien? Antes no comía. Antes comía lo que cocinaba ella misma, y eso no es comer, eso es un acto de fe. Y el policía ese se lo terminaba todo y decía que estaba rico. Eso no ayuda.' },
			{ choice: [
				{ text: '«Está bien. Cuida de todo el mundo.»', then: [
					{ say: 'xero', text: 'Claro que cuida de todo el mundo. Siempre ha cuidado de todo el mundo. Hasta de mí, una vez, cuando no me lo merecía. —Aprieta el tornillo más de la cuenta—. Bueno. Me alegro. Por la ciencia.' },
					{ set: { 'flag.b04_xero_matiere': true } },
				] },
				{ text: '«Pregúntaselo tú.»', then: [
					{ say: 'xero', text: '¡Bwahaha! ¿Yo? ¿Llamarla? ¿Con qué cara? Con esta no. —Se toca las gafas—. Esta cara ya la vio una vez en un sitio en el que no debería haber estado. No hace falta que la vea en otro.' },
				] },
				{ text: '«¿Por qué no lo dejas? Todo esto.»', then: [
					{ say: 'xero', text: 'Porque es lo único que sé hacer, y lo hago muy bien. —Señala la pizarra—. Las máquinas no son buenas ni malas. Son hambrientas. Yo solo les pongo la mesa. —Pausa—. Lo que se comen no lo elijo yo. Me lo repito todas las noches. Algunas noches funciona.' },
				] },
			] },
			{ say: 'xero', text: 'Y ahora vete, que me desconcentras. Cuarenta y tres. —Se ríe, solo—. ¡Bwahaha! …No es gracioso. Me río por costumbre.' },
			{ intel: { npc: 'xero', text: 'En un laboratorio provisional de la planta 11 de Silph: monta para Lemnis un repetidor que recoge una señal lejana y la manda «hacia abajo, hacia el norte». Cruza la pasarela entre la Torre Lemnis y Silph doce veces al día. No dio la alarma. Preguntó por Matière: si come bien.' } },
		],
		b04_xero_despues: [
			{ say: 'xero', text: 'Cuarenta y siete. Cuarenta y ocho. —No se gira—. Sigues aquí. Es la segunda vez que me interrumpes. A la tercera, te pongo a apretar tornillos. Pagan fatal.' },
		],
		b04_archivo_check: [
			{ if: DOCS_OK + ' && !flag.b04_docs_todos', then: [
				{ set: { 'flag.b04_docs_todos': true } },
				{ quest: 'b04_q_archivo', stage: 'salir' },
				{ say: 'ysolde', text: 'Desde la esquina del pasillo, en un susurro: «Ya está. Las tres cosas. La salida de servicio, al fondo. Y no corras: los que corren dentro de un edificio siempre parecen culpables. Aunque lo sean».' },
			] },
		],

		// ----- Atenea -----
		b04_atenea: [
			{ if: 'flag.b04_atenea_vista', then: [{ call: 'b04_atenea_revancha' }, { end: true }] },
			{ set: { 'flag.b04_atenea_vista': true } },
			{ text: 'La salida de servicio está al final del pasillo, detrás de la última fila de archivadores. Una puerta metálica con una barra antipánico y un cartel verde de «Salida».' },
			{ text: 'Delante de la puerta hay una silla de oficina. Y en la silla, con las piernas cruzadas, limándose las uñas con una lima de color rojo, una mujer de melena roja y uniforme blanco. Sin R. Con un parche gris.' },
			{ say: 'atenea', text: 'Hola, pajarito. —No levanta la vista de las uñas—. Llevas cuarenta minutos dando vueltas por mi planta. Te he dejado. Quería ver qué tomabas. Así sé qué decirle a mi cliente que has tomado.' },
			{ text: 'Miras a tu alrededor. Ysolde no está. Hace un segundo estaba en la esquina. Ahora en la esquina solo hay una pluma gris en el suelo.' },
			{ say: 'rotom', text: '¡Bzzt! —Muy bajito—. Se ha ido. Típico. Los Vencejos no dejan huella. Dejan plumas. Y te dejan a ti.' },
			{ if: 'beat("atenea_1")', then: [
				{ say: 'atenea', text: 'Iris. La cocina de la Torre Quemada. Me rompiste los caramelos y me tiraste las cajas. —Se mira una uña al trasluz—. Me pasé dos semanas oliendo a azúcar quemado. No te guardo rencor. Te guardo la cuenta.' },
			], else: [
				{ say: 'atenea', text: 'Nos conocemos de oídas. Tú, de Iris. Yo, de tus informes. Tienes muchos informes, ¿sabes? Más que yo. Y yo soy la mala.' },
			] },
			{ choice: [
				{ text: '«¿Rocket trabaja ahora de seguridad para Lemnis?»', then: [
					{ say: 'atenea', text: 'Seguridad privada. Con contrato, nómina y seguro médico. —Se toca el parche gris—. Nos quitaron la R y nos dieron un parche. Después de Caoba no quedaba nadie que pagara los alquileres de los míos. Lemnis sí. Lemnis siempre paga.' },
				] },
				{ text: '«Apártate.»', then: [
					{ say: 'atenea', text: 'Qué directo. —Sonríe—. Me gusta la gente directa. Se cae más deprisa.' },
				] },
			] },
			{ if: QUEMAR, then: [
				{ say: 'atenea', text: 'Por cierto. —Señala tu bolsillo con la lima—. Esa tarjeta gris con la que has abierto mi puerta sin número. Tiene un arañazo en la esquina. Se lo hizo Atlas con un abrelatas, una Navidad. —Pausa—. Así que Atlas paga sus deudas. Siempre las ha pagado. A mí también me debía una. Se ve que tú ibas antes en la cola.' },
			] },
			{ if: POLICIA, then: [
				{ say: 'atenea', text: 'Atlas está en una celda de Caoba por tu culpa. Catorce chicos más, también. —Lo dice sin levantar la voz—. Les llevan bocadillos, me dicen. Un policía con bigote postizo. Eso no lo arregla. Pero lo apunto.' },
			] },
			{ if: LIBRES, then: [
				{ say: 'atenea', text: 'Dejaste ir a los chicos de Atlas. A Toni, a la Mayor, a todos. —Por primera vez deja la lima quieta—. Toni me escribió. Vende arroz con leche en la Ruta 37. Con su madre. —Pausa—. No sé si darte las gracias o retarte. Haré las dos cosas. En ese orden no.' },
			] },
			{ if: ROCKET_NINGUNA, then: [
				{ say: 'atenea', text: 'Lo de Caoba se quedó a medias. Atlas, los chicos, la máquina. Nadie sabe muy bien qué pasó. Yo tampoco. —Se encoge de hombros—. Pero aquí estamos. La familia siempre acaba aquí: en la puerta de alguien, cobrando por no dejar pasar.' },
			] },
			{ say: 'atenea', text: 'Bueno. Lo que llevas en la mochila no sale de esta planta. Es mi trabajo. Lo hago bien. —Se levanta. Guarda la lima. Saca una Poké Ball—. Pero no me gusta ganarle a un equipo cansado. Me deja mal sabor de boca. Como el azúcar quemado.' },
			{ choice: [
				{ text: 'Revisar a tu equipo antes de nada.', then: [
					{ heal: 'Te arrodillas junto a la fuente de agua del pasillo y das de beber a tu equipo, uno por uno, con calma. Atenea espera con los brazos cruzados, como quien espera a que alguien se ate los zapatos.' },
				] },
				{ text: '«Estamos listos.»', then: [
					{ heal: 'Atenea chasquea los dedos. Uno de sus reclutas aparece con un botiquín y, sin decir nada, cura a tu equipo. «Cosas de familia», dice Atenea. «Aquí no se le pega a nadie que no esté entero».' },
				] },
			] },
			{ text: '{riolu} se coloca delante de ti. El aura se le enciende, azul, firme, como una vela que no se apaga con el viento. Atenea lo mira. Algo se le mueve en la cara.', cond: LUC },
			{ say: 'atenea', text: 'Ese Lucario. —Muy bajito—. En Iris también se puso delante. Los míos no se ponen delante de nadie. Se esconden detrás de mí. —Saca la Poké Ball—. Honchkrow, sal al final. Que se lo gane.', cond: LUC },
			{ call: 'b04_atenea_combate' },
		],
		b04_atenea_revancha: [
			{ if: 'beat("atenea_2")', then: [{ end: true }] },
			{ say: 'atenea', text: '¿Otra vez? —Deja la lima en la silla—. Bien. Me gusta la gente que vuelve. Tiene algo de familia.' },
			{ heal: 'Atenea chasquea los dedos. Su recluta del botiquín vuelve a curar a tu equipo, sin decir nada. Ya ni te mira: es su tercer turno de noche esta semana.' },
			{ call: 'b04_atenea_combate' },
		],
		b04_atenea_combate: [
			{ battle: 'atenea_2', lose: 'continue',
				onWin: [{ call: 'b04_atenea_despues' }],
				onLose: [
					{ set: { 'flag.b04_atenea_perdio': true } },
					{ say: 'atenea', text: '…Vaya. —Recoge a su Honchkrow sin prisa—. Esta vez sí. —Te mira desde arriba—. No te voy a quitar la mochila. Tengo principios. Pocos, pero tengo. Respira. Cúrate. Vuelve. La puerta sigue siendo mía.' },
					{ heal: 'Te arrastras hasta la fuente del pasillo y dejas que tu equipo beba y descanse. Atenea vuelve a su silla y a su lima. No te quita el ojo de encima. Tampoco tiene prisa.' },
				],
			},
		],
		b04_atenea_despues: [
			{ text: 'El Honchkrow de Atenea cae contra la barra antipánico de la salida. La alarma no salta. Atenea lo recoge sin prisa, se arregla el pelo y se queda un momento mirando la Poké Ball.' },
			{ say: 'atenea', text: '…Otra vez. —Se sienta en la silla, despacio—. Bien. Ya está. No voy a llamar a nadie. Si llamo, viene mi cliente. Y mi cliente no pregunta por qué pierdes: pregunta por qué no has ganado. Es distinto.' },
			{ if: LUC, then: [
				{ say: 'atenea', text: 'Ese Lucario no se ha movido de delante de ti en todo el combate. Ni una vez. —Lo mira mucho rato—. Si alguna vez te sobra, no me lo traigas. Le haría daño a mi gente ver lo que es un Pokémon que no tiene miedo.' },
				{ happy: { who: 'riolu', n: 5 } },
			] },
			{ cap: 55 },
			{ set: { 'flag.b04_atenea_vencida': true } },
			{ say: 'atenea', text: 'Toma. Venía con el contrato. «Material de Silph para el personal de seguridad». —Te tira un disco de MT, gris y brillante—. A los míos no les sirve. Mis niños no brillan. El tuyo, sí.' },
			{ give: 'mt_foco_resplandor' },
			{ choice: [
				{ text: '«Lemnis los dejará tirados. Como a Atlas.»', then: [
					{ set: { 'flag.b04_atenea_aviso': true } },
					{ say: 'atenea', text: 'Ya lo sé, pajarito. —Se levanta—. Todo el mundo deja tirada a la familia. Por eso hay que cobrar por adelantado. —Pausa—. Pero gracias por decirlo. Casi nadie lo dice en voz alta.' },
				] },
				{ text: '«Vete. Antes de que llegue nadie.»', then: [
					{ say: 'atenea', text: '¿Me estás dejando ir? —Levanta una ceja—. Qué detalle. No te lo voy a agradecer. Me lo apunto en la cuenta. En la columna buena, para que conste.' },
				] },
				{ text: 'No decir nada.', then: [
					{ say: 'atenea', text: 'El silencio. —Asiente—. Eso sí que lo entiendo. En casa también callábamos mucho.' },
				] },
			] },
			{ text: 'Silba. Sus dos reclutas aparecen de detrás de los archivadores, uno con el botiquín y otra con una fotocopia de su propia cara en la mano. Atenea abre la salida de servicio con la cadera.' },
			{ say: 'atenea', text: 'Chicos, nos vamos. Dejen la planta. Tomen solo lo suyo. La familia primero. —Desde la puerta, sin girarse—: Y tú, pajarito: vuela alto. Los que vuelan bajo acaban limpiando oficinas de noche.' },
			{ text: 'La puerta se cierra detrás de ellos. Silencio. Los fluorescentes zumban.' },
			{ intel: { npc: 'atenea', text: 'El Team Rocket trabaja ahora como «seguridad privada» de Lemnis, con contrato y un parche gris en lugar de la R: después de Caoba nadie más pagaba los alquileres de los suyos. Vigilaba la planta 11 de Silph. La venciste y se fue con sus reclutas. Te dio la MT Cañón Resplandor.' } },
			{ call: 'b04_presidente' },
		],

		// ----- El Presidente de Silph -----
		b04_presidente: [
			{ text: 'Entonces se encienden todas las luces de la planta a la vez. Clac, clac, clac, fila por fila, hasta el fondo.' },
			{ text: 'En la puerta del ascensor hay un hombre mayor, grande, con bata de cuadros encima del pantalón del traje y zapatillas de andar por casa. Lleva una corbata roja anudada encima de la bata, como si se la hubiera puesto por costumbre al oír ruido. Es la cara del retrato del vestíbulo, con veinte años más.' },
			{ say: 'presidente_silph', text: 'Buenas noches. —Mira las cajas de Lemnis. Mira los archivadores abiertos. Te mira a ti, con tu capucha gris y la mochila llena—. Vivo en el ático. Me ha despertado un Honchkrow chocando contra una puerta. No es algo que pase todas las noches. Aunque aquí ya pasan muchas cosas que no pasaban.' },
			{ say: 'presidente_silph', text: 'Esta era mi planta. El archivo. Aquí guardábamos todo lo que hicimos en cuarenta años: la Poké Ball, el Tren Magnético, la Master Ball. Hace un año les vendí la planta once. «Una participación minoritaria», dijeron. «Silenciosa».' },
			{ say: 'presidente_silph', text: 'Luego vino la auditoría. Luego las cajas. Luego el botón del ascensor dejó de funcionar. —Se mira las zapatillas—. Llevo tres semanas sin poder bajar a mi propia planta. Y no he dicho nada. Ni a la prensa, ni a la junta, ni a mi mujer. Me da vergüenza. Es mi empresa y me da vergüenza.' },
			{ choice: [
				{ text: '«Todavía puede decir algo.»', then: [
					{ set: { 'flag.b04_presidente_habla': true } },
					{ rep: { policia: 2 } },
					{ say: 'presidente_silph', text: '¿Usted cree? —Te mira como un niño al que le han dicho que todavía le dejan salir al recreo—. Tengo setenta y un años. Hace mucho que nadie me dice que todavía puedo algo.' },
				] },
				{ text: '«Usted les abrió la puerta.»', then: [
					{ say: 'presidente_silph', text: 'Sí. —No lo discute—. Se la abrí yo. Con una firma. Las firmas pesan muy poco cuando se ponen. Y muchísimo después.' },
				] },
				{ text: 'No decir nada.', then: [
					{ say: 'presidente_silph', text: 'No hace falta que diga nada. —Suspira—. Ya me lo digo yo todas las noches. Con las mismas palabras.' },
				] },
			] },
			{ text: 'El presidente se acerca a la pared, junto al ascensor. Hay una caja roja con una tapa de cristal y un botón dentro: «**ALARMA GENERAL** · Solo en caso de emergencia».' },
			{ say: 'presidente_silph', text: 'Este botón lo mandé poner yo, hace veinte años. Nunca lo he pulsado. Nunca ha hecho falta. —Rompe el cristal con el codo, con más fuerza de la que esperabas—. Hoy es la primera cosa que decido en un año.' },
			{ cutscene: { time: 'noche', bg: { type: 'indoor', wall: '#cfd6e2', floor: '#4a4f6a' }, start: 'light', frames: [
				{ actors: [{ id: 'presidente_silph', at: 'left' }], tint: '#c4473a', color: '#ff6a5a', fx: ['flash', 'quake'], text: 'La alarma de Silph S.A. suena por primera vez en veinte años. Un timbre largo, viejo, que hace temblar los cristales de los archivadores.' },
				{ cam: 'pan-up', fx: ['shake', 'heartbeat'], text: 'Por las ventanas, en la Torre Lemnis, se encienden las luces planta por planta, de abajo arriba, como una cremallera.' },
				{ fx: 'heartbeat', cam: 'pan-down', actors: [{ key: 'presidente_silph', dim: true }], text: 'Abajo, en la avenida, las primeras sirenas. Policía de Kanto. Y detrás, de todas las calles, furgonetas blancas con una lemniscata en la puerta, que llegan a toda velocidad.' },
			] } },
			{ say: 'presidente_silph', text: 'Váyase. Por el ascensor, hasta arriba del todo. A la azotea. —Pulsa el botón del ático—. Cuando lleguen, les diré que estaba solo. Y que he encontrado cosas en mi archivo que no son mías. Y que quiero que se las lleven a una comisaría. A una de verdad.' },
			{ text: 'Las puertas del ascensor se cierran. Lo último que ves es al presidente de Silph S.A., en bata y zapatillas, colocándose bien la corbata delante de las cajas de Lemnis, como quien se prepara para una foto.' },
			{ intel: { npc: 'presidente_silph', text: 'Presidente de Silph S.A. Vendió a Lemnis la planta 11 («una participación minoritaria, silenciosa») y llevaba tres semanas sin poder bajar a su propio archivo. Le daba vergüenza contarlo. Pulsó la alarma general de Silph por primera vez en veinte años para que la policía de Kanto se llevara las cajas.' } },
			{ call: 'b04_silph_fin' },
		],
		b04_presidente_despues: [
			{ say: 'presidente_silph', text: '¡Ah, es usted! —Te reconoce aunque no lleves capucha—. No, no diga nada. Yo tampoco he visto a nadie. Estaba solo. Lo he firmado en tres declaraciones. —Baja la voz—. Me han devuelto el botón del ascensor. El once. Lo he pulsado nueve veces esta mañana. Por gusto.' },
			{ if: 'flag.b04_presidente_habla', then: [
				{ say: 'presidente_silph', text: 'Mañana hablo con la prensa. Me tiemblan las manos solo de pensarlo. —Se las mira—. Pero me tiemblan de otra forma que antes. No sé explicarlo.' },
			] },
		],

		// ----- La azotea de Silph: final de la operación -----
		b04_silph_fin: [
			{ if: 'flag.b04_silph_hecho', then: [{ end: true }] },
			{ text: 'La azotea de Silph S.A. Un helipuerto pintado que nadie usa, la caseta del ascensor y el viento de la madrugada. Abajo, la avenida es un río de luces azules y rojas.' },
			{ text: 'Sentada en el borde del helipuerto, con las piernas colgando sobre el vacío, como si no se hubiera movido de ahí en toda la noche, está Ysolde.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Tú! ¡Te fuiste! ¡Nos dejaste solos con Atenea! ¡Con su lima!' },
			{ say: 'ysolde', text: 'Los dejé con quien tenían que estar. —Ni se gira—. Si me quedo, Atenea me reconoce. Si me reconoce, sabe que hay Vencejos en Azafrán. Y entonces los tejados se acaban. Para mí y para ti.' },
			{ cutscene: { time: 'noche', bg: { type: 'city', roofs: ['#8a8f9e', '#5a626e', '#c4a43a'], far: '#1f2e4f' }, start: 'dark', frames: [
				{ actors: [{ id: 'ysolde', at: 'right', enter: 'none' }], cam: 'pan-down', text: 'Se sientan los dos en el borde del helipuerto. Abajo, la policía de Kanto entra en Silph con cajas vacías. Sale con cajas llenas.' },
				{ on: false, color: '#6f9bff', cam: 'pan-right', fx: 'glow', text: 'Las furgonetas de Lemnis siguen llegando. De todas las calles. Hasta de la carretera del norte, la que viene de Celeste, con las luces de emergencia puestas y sin frenar en los cruces.' },
				{ actors: [{ key: 'ysolde', dim: true }], cam: 'pan-up', text: 'Enfrente, en la Torre Lemnis, la planta veinticuatro está a oscuras. La persiana, bajada hasta abajo.' },
			] } },
			{ text: '{riolu} se sienta en el borde a tu lado, con las piernas colgando como las de ustedes. El aura le brilla muy tenue, al ritmo de la respiración. Mira hacia el norte. No hacia las furgonetas. Más allá.', cond: LUC },
			{ say: 'ysolde', text: 'Mira las furgonetas. Vienen todas. Hasta las del norte. —Señala con la barbilla—. Esta noche, en esta ciudad, nadie vigila nada que no sea este edificio.' },
			{ say: 'ysolde', text: 'Y la letra del calendario decía «Celeste». Tu amigo el del Cabo decía «la Cueva». —Por fin te mira—. Yo no te digo nada. Yo solo miro desde arriba. Pero desde arriba, ahora mismo, la valla de la Cueva Celeste está muy sola.' },
			{ if: 'flag.b03_vencejo_pluma', then: [
				{ say: 'ysolde', text: 'Pluma desde Olivo. Una operación con nombre, un salto, tres papeles y ni un solo herido. —Se pone de pie en el borde, sin agarrarse a nada—. Una Pluma que vuelve con las alas enteras se llama de otra forma.' },
			], else: [
				{ say: 'ysolde', text: 'Pluma desde esta noche. Una operación con nombre, un salto, tres papeles y ni un solo herido. —Se pone de pie en el borde, sin agarrarse a nada—. Una Pluma que vuelve con las alas enteras se llama de otra forma.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! ¿Cómo? ¿Cómo se llama? ¿Ala? ¿Nos ascienden? ¿Hay tarta?' },
			{ say: 'ysolde', text: 'Eso lo decide la Cumbre. No yo. —Casi sonríe—. Pero te lo he dicho para que lo sepas. Para que lo pienses cuando estés en un sitio muy oscuro y no veas el suelo.' },
			{ choice: [
				{ text: '«Gracias, Ysolde.»', then: [
					{ say: 'ysolde', text: 'No me las des. Dáselas al toldo. —Pausa—. Y al frutero. Le has dejado quinientos por cuarenta naranjas. Le has pagado el toldo dos veces. Eso también lo he visto.' },
				] },
				{ text: '«¿Quién es la Cumbre?»', then: [
					{ say: 'ysolde', text: 'Alguien que lleva vigilando a los que quieren una energía que no se acaba desde mucho antes de que existiera esa torre. —Mira la lemniscata que gira enfrente—. Mucho antes. Más de lo que te creerías.' },
				] },
				{ text: '«La próxima vez, avísame antes de desaparecer.»', then: [
					{ say: 'ysolde', text: 'Si te aviso, no es desaparecer. Es irse. —Se sube la capucha—. Irse lo hace cualquiera.' },
				] },
			] },
			{ text: 'Se da la vuelta, da dos pasos por el borde del helipuerto y salta. No hacia la calle: hacia la Torre Lemnis, al andamio de limpieza, tres metros más allá. Lo agarra con una mano. Se balancea una vez. Y desaparece por encima, hacia la lemniscata que gira.' },
			{ text: 'En el borde del helipuerto, donde estaba sentada, ha dejado una pluma gris. Con tu inicial dibujada a lápiz en el cañón.' },
			{ set: { 'flag.b04_silph_hecho': true } },
			{ quest: 'b04_q_archivo', done: true },
			{ quest: 'b04_t_vencejos', stage: 'hecha', done: true },
			{ quest: 'b04_m4', done: true },
			{ quest: 'b04_m5', stage: 'cueva' },
			{ intel: { npc: 'ysolde', text: 'Al terminar la Operación Tejado, en la azotea de Silph: «Una Pluma que vuelve con las alas enteras se llama de otra forma». El ascenso lo decide la Cumbre. Te avisó de que esa noche la valla de la Cueva Celeste estaría «muy sola».' } },
			{ diary: 'Hoy mi entrenador{|a|e} y yo subimos a los tejados de Azafrán. ¡De noche! Todo se veía como un tablero de luces. Ysolde nos dio una capucha gris y saltamos desde un tejado a un toldo de naranjas. ¡Cuarenta y tres naranjas! Las conté mientras rodaban.\n\nLuego estuvimos en una oficina muy vieja llena de papeles aburridos. Muchísimos papeles. Había una señora muy elegante con una lima de uñas y un Honchkrow, y combatimos, y nadie de nuestro equipo se echó atrás.\n\nAl final sonó una alarma (¡no fuimos nosotros! fue el señor de la bata) y nos sentamos en el tejado a ver las luces de la policía. Ysolde dice que lo importante es lo que no se ve. Yo lo he visto todo y no sé qué es lo importante. ¡Mañana se lo pregunto!', cond: 'flag.b01_diario' },
			{ say: 'rotom', text: '¡Bzzt! Resumen: una azotea, un salto, cuarenta y tres naranjas, tres papeles, una señora con lima y un presidente en bata. —Pausa—. Y la Cueva Celeste, sin guardias. Al norte, por la Ruta 5. Cuando quieras. Bueno, cuanto antes.' },
			{ go: 'azafran' },
		],
		b04_azotea_despues: [
			{ text: 'Desde arriba, Azafrán sigue siendo un tablero de luces. La lemniscata de la Torre Lemnis gira y barre los tejados cada once segundos. Ya no te agachas cuando pasa.' },
			{ text: 'En la antena más alta, la pluma gris se mueve con el viento. Hacia el norte.' },
		],
		b04_archivo_despues: [
			{ text: 'Los archivadores de la planta once, abiertos de par en par. La policía de Kanto se lo ha llevado todo lo que tenía una lemniscata. Han dejado lo de Silph: cuarenta años de planos, patentes y cartas de agradecimiento de entrenadores de todo el mundo.' },
			{ text: 'En el cajón de la **L.**, alguien de la policía se ha dejado una cosa al hacer el inventario: un caramelo de menta envuelto en papel azul. No lo tocas.' },
		],

		// =====================================================================
		// RUTA 8 Y PUEBLO LAVANDA
		// =====================================================================
		b04_lavanda_llegada: [
			{ set: { 'flag.b04_lavanda_llegada': true } },
			{ text: 'Pueblo Lavanda huele a lavanda antes de que lo veas. Luego lo ves: casas bajas de tejados morados, macetas en todas las ventanas y gente que habla bajito sin que nadie se lo pida.' },
			{ text: 'En el centro, la Torre Radio, alta y metálica, con su luz roja parpadeando. Al lado, una casa de madera con un cartel: «Casa Pokémon. Llame flojito».' },
			{ text: '{riolu} se para en la entrada del pueblo y mira la Torre Radio un buen rato. No con miedo. Con respeto. Como quien entra en un sitio donde hay gente durmiendo.', cond: LUC },
			{ text: 'La Pokédex vibra. Un mensaje, muy corto, sin saludo.' },
			{ say: 'kaori', as: 'Kaori (mensaje)', text: 'Estoy en Lavanda. En la Casa Pokémon. He venido a ver a alguien que sabe de cansancios que no se curan durmiendo. Si estás en Kanto, ven. No es una invitación. Es información.' },
			{ quest: 'b03_t_kaori', done: true, cond: 'quest.b03_t_kaori && !done.b03_t_kaori' },
			{ quest: 'b04_t_kaori', stage: 'lavanda' },
			{ text: 'Delante de la Torre Radio, un chico con una chaqueta verde y amarilla grita a una cámara montada en un trípode. A sus pies, un Persian enorme con un collar de pedrería bosteza enseñando todos los colmillos.' },
			{ quest: 'b04_t_show', stage: 'lavanda' },
			{ say: 'rotom', text: '¡Bzzt! Pueblo Lavanda. Población: poca. Pokémon por habitante: muchísimos. Fantasmas por metro cuadrado: no lo pone en la guía. Mejor. No quiero saberlo.' },
		],
		b04_cementerio: [
			{ text: 'Un cementerio pequeño, al final de la calle, con lápidas diminutas de piedra blanca. Nombres de Pokémon tallados con cariño: «Bigotes, que cazaba moscas». «Pompón, el más tragón». «Señora Peluche, que nunca mordió a nadie (salvo al cartero)».' },
			{ text: 'Hay flores frescas en casi todas. Y velas encendidas, aunque no hay nadie.' },
			{ if: LUC, then: [
				{ text: '{riolu} se detiene delante de una lápida sin nombre, con una sola flor seca. La mira mucho rato. Luego toma una flor de lavanda del borde del camino y la deja al lado de la seca.' },
			] },
			{ if: '!flag.b04_cementerio', then: [
				{ set: { 'flag.b04_cementerio': true } },
				{ text: 'En la entrada hay un buzón de madera con una ranura y un cartel: «Para los que no pudieron despedirse». Dentro se oye el roce de muchas cartas.' },
			] },
		],
		b04_vecina_lavanda: [
			{ text: 'Una señora mayor riega una maceta de lavanda. La misma. Por tercera vez.' },
			{ say: 'vecino_kanto', as: 'Vecina', text: 'Es que se me olvida que ya la he regado. A mi edad, lo que no se olvida son las cosas de hace cincuenta años. Las de hace cinco minutos se van solas.' },
			{ say: 'vecino_kanto', as: 'Vecina', text: 'Cuando yo era niña, la Torre Pokémon tenía siete pisos y olía a incienso hasta la estación. Ahora huele a antena. —Señala la Torre Radio—. Pero los de abajo siguen ahí. Se les oye por la radio a las doce. Se quejan del ruido. Con razón.' },
			{ if: 'flag.b04_fuji_1', then: [
				{ say: 'vecino_kanto', as: 'Vecina', text: '¿Ha estado en casa del Señor Fuji? Ese hombre es un santo. Bueno, un santo con una foto boca abajo. Todos tenemos una foto boca abajo. La suya pesa más.' },
			] },
		],

		// ----- Casa Pokémon: Fuji y Kaori -----
		b04_fuji_1: [
			{ if: 'flag.b04_fuji_1', then: [{ end: true }] },
			{ set: { 'flag.b04_fuji_1': true } },
			{ text: 'Junto a la estufa, en dos sillas de mimbre, un anciano muy delgado, de bigote blanco y chaqueta de punto morada, y una chica con delantal de boticaria sobre un kimono sencillo, con el pelo recogido con un pasador de hoja y vendas en el brazo izquierdo.' },
			{ text: 'Entre los dos, sobre una alfombra, duerme una Ponyta. Tiene la crin blanca, sin una sola llama. Respira despacio. Muy despacio. Como una vela que sigue ahí sin fuego.' },
			{ say: 'kaori', text: 'Has venido. —No se levanta. No sonríe—. Bien. Siéntate. No toques los frascos de la izquierda. Ni los de la derecha. Siéntate en el suelo.' },
			{ say: 'fuji', text: 'Bienvenid{o|a|e}, bienvenid{o|a|e}. —Su voz es muy suave, como si tuviera miedo de despertar a alguien—. Soy Fuji. Esta es mi casa, y la de todos estos. —Señala a los Pokémon dormidos con la mano abierta—. ¿Té? Es de lavanda. Aquí todo es de lavanda. Hasta los pensamientos, a veces.' },
			{ if: LUC, then: [
				{ text: 'El Señor Fuji se fija en {riolu}. Se le quedan los ojos quietos detrás de las gafas. Mucho rato.' },
				{ say: 'fuji', text: 'Qué aura tan tranquila. —Muy bajito—. Hace muchos años conocí a otro que tenía mucho poder. Muchísimo. Pero no estaba tranquilo nunca. Le faltaba lo que tiene este. —Te mira a ti—. Alguien.' },
			] },
			{ say: 'kaori', text: 'Al grano. —Saca un frasco de su maleta: polvo azul, brillando solo en la penumbra—. Caramelo Lazo. Lo que enfermaba a los Pokémon del teatro de Iris. Lo que tenían los Magikarp del lago. Lo que tiene ella.' },
			{ text: 'Señala a la Ponyta con la barbilla.' },
			{ say: 'fuji', text: 'Me la trajeron hace una semana desde el norte, de un rancho junto a la carretera de Celeste. Comía un pienso nuevo, de regalo. Se le apagó la crin en tres días. No está enferma. Está… gastada. Como si alguien le hubiera cobrado algo que no debía.' },
			{ say: 'kaori', text: 'Mi antídoto lo retrasa. No lo para. Le he descrito los síntomas al Señor Fuji y me ha dicho una cosa que no está en ningún libro de botica.' },
			{ say: 'fuji', text: '…Lo he visto antes. —Deja la taza en el plato. Le tiembla un poco la mano—. Hace muchos años. No en una Ponyta. En algo mucho más grande.' },
			{ say: 'fuji', text: 'Ayudé a hacer a un Pokémon. Muy fuerte. El más fuerte. Le quitamos todo lo que era para darle todo lo que nosotros queríamos que fuera. —Mira la foto boca abajo de la estantería—. A ese le quitaron todo y le dieron demasiado. Lo que tiene esta Ponyta es lo mismo, pero al revés: solo le quitan.' },
			{ say: 'fuji', text: 'Y se cansa así, desde dentro. No hay medicina que devuelva lo que se ha cobrado. Pero hay cosas que ayudan a que no se vaya del todo.' },
			{ choice: [
				{ text: '«¿Qué cosas?»', then: [
					{ say: 'fuji', text: 'En la vieja torre, la que está debajo de la radio, había un incensario. Los monjes lo encendían para los Pokémon que velaban allí. Decían que el humo hacía que los que se iban se quedaran un poquito más. Para despedirse.' },
				] },
				{ text: '«¿Qué Pokémon era ese? El más fuerte.»', then: [
					{ say: 'fuji', text: 'Uno que se despertó enfadado. —No te mira—. Tenía razón. Hay preguntas que un viejo no puede contestar delante de una Ponyta dormida. Perdóname.' },
					{ say: 'fuji', text: 'Pero sí te digo esto: en la vieja torre, la de debajo de la radio, había un incensario. Los monjes lo encendían para los Pokémon que velaban allí. Decían que el humo hacía que los que se iban se quedaran un poquito más.' },
				] },
			] },
			{ say: 'kaori', text: 'El incienso de la torre lleva resina de tejo. —Por primera vez desde que la conoces, le brillan los ojos—. Tejo. Oh. Eso es… precioso. Una pizca mata a un Tauros. Una mota de polvo despierta a un corazón cansado. Es exactamente lo que le falta a mi fórmula. Venenoso, pero precioso.' },
			{ say: 'kaori', text: 'El incensario sigue encendido ahí abajo, según dice él. Cuarenta años. Sin que nadie lo rellene. Eso no es posible. Me encanta.' },
			{ say: 'kaori', text: 'Yo no bajo. Hay fantasmas. Los fantasmas no son venenosos: no me interesan. —Pausa—. Tráeme ceniza del incensario. Un poco. Con un pañuelo. No la respires. Bueno, respírala un poco. Para saber cómo huele. Y luego me lo cuentas.' },
			{ set: { 'flag.b04_kaori_encargo': true } },
			{ quest: 'b04_q_ceniza', stage: 'bajar' },
			{ intel: { npc: 'fuji', text: 'Cuida de Pokémon abandonados y «gastados» en la Casa Pokémon de Lavanda. Hace muchos años ayudó a crear un Pokémon «muy fuerte»: «le quitaron todo y le dieron demasiado». Reconoció en la Ponyta sin llama el patrón del Caramelo Lazo: «lo mismo, pero al revés: solo le quitan».' } },
			{ intel: { npc: 'kaori', text: 'En Lavanda, con el Señor Fuji. Su antídoto retrasa el cansancio del Caramelo Lazo, pero no lo para. Necesita resina de tejo: está en la ceniza del incensario de la vieja Torre Pokémon, bajo la Torre Radio.' } },
		],
		b04_kaori_espera: [
			{ say: 'kaori', text: 'Ceniza del incensario. Del sótano de la torre. —Sin levantar la vista del mortero—. No te lo repito más. Bueno, sí. Te lo repito. Ceniza. Sótano. Tejo.' },
			{ text: 'La Ponyta respira despacio en la alfombra. Kaori le pone dos dedos en el cuello cada pocos minutos, sin mirar, y apunta algo en una libreta.' },
		],
		b04_incensario: [
			{ text: 'En el centro de la sala redonda, sobre una peana de piedra, un incensario de bronce verde de puro viejo. Humea. Un hilo de humo gris, fino, que sube recto hasta el techo y allí se deshace.' },
			{ text: 'Huele a lavanda. A madera. Y a algo más, amargo, que se te queda en el fondo de la garganta.' },
			{ if: 'flag.b04_kaori_encargo && !has("cenizatorre") && !flag.b04_kaori_paso', then: [
				{ text: 'Sacas un pañuelo. Te acercas. El humo se tuerce hacia ti, despacio, como si te mirara.' },
				{ if: LUC, then: [
					{ text: '{riolu} se pone a tu lado y cierra los ojos. El aura se le enciende, muy bajito. El humo se endereza. Se queda quieto. Esperando.' },
				] },
				{ cutscene: { weather: 'smoke', bg: { type: 'cave', dark: true, fog: true, crystals: '#b08ad8' }, start: 'dark', frames: [
					{ cam: 'push', text: 'Recoges un poco de ceniza del borde del incensario. Está tibia. Se mete en los pliegues del pañuelo como harina gris.' },
					{ color: '#b08ad8', cam: 'still', fx: 'glow', item: 'cenizatorre', text: 'Por un momento, en el humo, te parece ver formas. Una cola. Unas orejas. Un hocico. Muchas. Se acercan al pañuelo, lo huelen… y se apartan, tranquilas, como quien da permiso.' },
					{ actors: [{ key: '_c', dim: true }], cam: 'pan-up', text: 'El humo vuelve a subir recto. El incensario sigue encendido. No le falta nada.' },
				] } },
				{ give: 'cenizatorre' },
				{ say: 'rotom', text: '¡Bzzt! …Me ha dado un escalofrío en el circuito. —Pausa—. Los Rotom no tenemos escalofríos. Me lo he inventado. Pero ha sido muy real.' },
			], else: [
				{ text: 'Te quedas un rato mirando el humo. Sube recto, sin prisa, como si tuviera todo el tiempo del mundo. Seguramente lo tiene.' },
			] },
		],
		b04_kaori_antidoto: [
			{ if: 'flag.b04_kaori_paso || !has("cenizatorre")', then: [{ end: true }] },
			{ text: 'Le das el pañuelo a Kaori. Lo abre encima de la mesa, muy despacio. Se inclina. Huele. Cierra los ojos.' },
			{ say: 'kaori', text: 'Oh. —Muy bajito—. Oh. Tejo, lavanda, cedro y algo que no conozco. Cuarenta años de humo. Esto es… precioso. Horrible, pero precioso.' },
			{ take: 'cenizatorre' },
			{ text: 'Mezcla una pizca de ceniza en el mortero con su antídoto, un líquido verdoso que huele a hierba cortada. Remueve. Cuenta en voz baja. Echa tres gotas más. Prueba una gota en la venda de su propio brazo y espera. Asiente.' },
			{ say: 'fuji', text: 'Kaori, hija, no hace falta que lo pruebes en ti cada vez.' },
			{ say: 'kaori', text: 'Sí hace falta. Si no lo pruebo yo, no sé qué siente ella. —No levanta la vista—. Y ella no me lo puede contar.' },
			{ cutscene: { bg: { type: 'indoor', wall: '#d8c49a', floor: '#8a6a4a' }, start: 'dark', frames: [
				{ actors: [{ id: 'kaori', at: 'left' }, { mon: 'ponyta', at: 0.7, enter: 'none', dim: true }], text: 'Kaori se arrodilla junto a la Ponyta. Le abre la boca con dos dedos, con un cuidado que no le habías visto nunca, y le pone tres gotas en la lengua.' },
				{ cam: 'still', text: 'Nada. Un segundo. Dos. La Ponyta respira despacio, igual que antes. Kaori no se mueve.' },
				{ color: '#ffb060', actors: [{ key: 'ponyta', dim: false }], cam: 'push', fx: 'glow', text: 'Y en la punta de la crin blanca aparece una chispa. Pequeña. Naranja. Del tamaño de la llama de una vela de cumpleaños.' },
				{ color: '#ffb060', actors: [{ key: 'kaori', emote: '...' }], on: 'ponyta', fx: ['light', 'sparkle'], text: 'La chispa no crece. Pero tampoco se apaga. Se queda ahí, temblando, cada vez que la Ponyta respira.' },
			] } },
			{ set: { 'flag.b04_kaori_paso': true, 'flag.b04_fuji_hecho': true } },
			{ af: { kaori: 6 } },
			{ say: 'kaori', text: 'Estable. —Lo apunta. La letra le sale un poco torcida—. No curada. Estable. No va a ir a peor. Tampoco a mejor. Todavía.' },
			{ say: 'kaori', text: 'Es un paso. Uno. Pequeño. —Te mira por fin—. No me felicites. Si me felicitas, me pongo contenta, y si me pongo contenta, me equivoco en las proporciones.' },
			{ choice: [
				{ text: 'No felicitarla. Quedarte a su lado mirando la llamita.', then: [
					{ af: { kaori: 2 } },
					{ text: 'Se quedan los dos sentados en el suelo, mirando la llamita de la Ponyta. Kaori no dice nada en un buen rato. Luego, sin mirarte, te empuja un vaso de té con la punta de los dedos.' },
					{ say: 'kaori', text: 'Es de lavanda. No lleva nada raro. Lo he comprobado. —Pausa—. Dos veces.' },
				] },
				{ text: '«Felicidades.»', then: [
					{ af: { kaori: 1 } },
					{ say: 'kaori', text: 'Te he dicho que no. —Se le escapa algo que podría ser una sonrisa, si Kaori sonriera—. Ahora tendré que repetir las cuentas. Por tu culpa. Gracias.' },
				] },
				{ text: '«¿Qué le falta para curarla?»', then: [
					{ af: { kaori: 1 } },
					{ say: 'kaori', text: 'Saber de dónde sale lo que le quitan. Y adónde va. —Mira el polvo azul del frasco—. El cansancio no desaparece, ¿sabes? Va a alguna parte. Alguien se lo está quedando. Cuando sepa quién, sabré cómo.' },
				] },
			] },
			{ say: 'fuji', text: 'Toma. —El Señor Fuji te pone en la mano una hoja vieja, amarilla, blanda de tanto doblarla—. La escribí hace muchos años y nunca se la he enseñado a nadie. Me parece que tú tienes que leerla. No sé por qué. Los viejos sabemos cosas sin saber por qué.' },
			{ give: 'diariofuji' },
			{ say: 'fuji', text: 'Si un día encuentras a alguien muy cansado, muy fuerte y muy enfadado… —Se calla. Vuelve a tomar la taza—. No le tengas miedo. Lo que tiene no es rabia. Es cansancio. Desde fuera se parecen mucho.' },
			{ quest: 'b04_q_ceniza', done: true },
			{ quest: 'b04_t_kaori', stage: 'abierto' },
			{ intel: { npc: 'kaori', text: 'Con la ceniza del incensario de la vieja torre (resina de tejo), su antídoto da un paso: la Ponyta de la Casa Pokémon recuperó una llamita. Estable, no curada. «El cansancio no desaparece. Va a alguna parte. Alguien se lo está quedando».' } },
			{ diary: 'Hoy mi entrenador{|a|e} y yo fuimos a Pueblo Lavanda, que huele a lavanda (¡de verdad!). Visitamos al Señor Fuji, un abuelito muy amable que cuida de muchísimos Pokémon, y a Kaori, que es boticaria y no sonríe nunca, pero hoy casi.\n\nHabía una Ponyta muy cansada, sin fuego en la crin. Bajamos a un sótano lleno de fantasmas a por ceniza de incienso, y Kaori hizo una medicina, ¡y a la Ponyta le salió una llamita! Pequeñita. Como de vela de cumpleaños.\n\nEl Señor Fuji nos dio una hoja de su diario. No la he leído. Me ha parecido de mala educación. ¡Eso se lo dejo a mi entrenador{|a|e}!', cond: 'flag.b01_diario' },
		],
		b04_kaori_despues: [
			{ say: 'kaori', text: 'Sigue estable. —Le toma el pulso a la Ponyta con dos dedos—. Lo apunto cada hora. Llevo diecinueve horas. No necesito dormir. Bueno, sí. Pero no quiero.' },
			{ if: 'af.kaori >= 20', then: [
				{ say: 'kaori', text: 'Si encuentras algo raro en Kanto, tráemelo. Una seta, una resina, un polvo que brille. —Pausa—. O no traigas nada. Ven igual. A veces se piensa mejor con alguien callado al lado.' },
			], else: [
				{ say: 'kaori', text: 'Si encuentras algo raro en Kanto, tráemelo. Una seta, una resina, un polvo que brille. Lo que sea. Menos fantasmas.' },
			] },
		],
		b04_fuji_despues: [
			{ if: 'flag.b04_kaori_paso', then: [
				{ say: 'fuji', text: 'Mírala. —La Ponyta respira con su llamita en la crin—. Cuarenta años cuidando a los que se cansan, y nunca había visto volver una llama. Esa chica tiene manos de boticaria y corazón de… —busca la palabra— …de boticaria también. Las dos cosas a la vez. No es fácil.' },
			], else: [
				{ say: 'fuji', text: 'La ceniza del incensario. Abajo, en la vieja torre. —Remueve el té—. No tengas miedo de los de allí. Los fantasmas no le hacen daño a quien va a por algo para otro. Solo se quejan del ruido.' },
			] },
			{ say: 'fuji', text: '¿Otro té? Es de lavanda. —Sonríe un poco—. Ya lo sé. Ya lo has probado. Pero los viejos ofrecemos té como otros dan los buenos días.' },
		],
		b04_foto_fuji: [
			{ text: 'Una foto en un marco de madera, boca abajo en la estantería, entre frascos de té. Tiene polvo en el dorso. Nadie la ha movido en mucho tiempo.' },
			{ if: 'flag.b04_fuji_1', then: [
				{ text: 'Alargas la mano. Desde su silla, el Señor Fuji te mira. No dice nada. No hace falta.' },
				{ text: 'Retiras la mano. La foto se queda como estaba.' },
			], else: [
				{ text: 'No la tocas. Hay cosas que se dejan como están porque alguien las ha dejado así.' },
			] },
		],

		// ----- Torre Radio -----
		b04_locutora: [
			{ text: 'La locutora de guardia tiene los cascos puestos y una infusión humeante. Cuando te ve, se quita un auricular.' },
			{ say: 'vecino_kanto', as: 'Locutora', text: 'Bienvenid{o|a|e} a Radio Lavanda, la voz del este. Esta noche tengo el programa de las doce: «Lo que se oye cuando no suena nada». Pongo las frecuencias vacías y la gente llama para contar qué oye.' },
			{ say: 'vecino_kanto', as: 'Locutora', text: 'Normalmente oyen quejas. «Bájenle a la música». «Dejen de pisar». «Qué pesados con la antena». —Sonríe—. Desde hace un mes oyen otra cosa: un zumbido grave, que viene del oeste. De Azafrán. Y los de las quejas se quejan del zumbido. Hasta los muertos tienen vecinos molestos.' },
		],
		b04_placa_torre: [
			{ text: 'Una placa de bronce, pulida de tanto tocarla:' },
			{ text: '«Aquí se levantó durante más de un siglo la **Torre Pokémon** de Lavanda. Sus moradores fueron trasladados con todo respeto a la Casa de Almas. A los que prefirieron quedarse, les pedimos disculpas por la antena».' },
			{ text: 'Debajo, alguien ha pegado un pósit amarillo: «No aceptan las disculpas».' },
		],

		// ----- Sótano de la vieja torre -----
		b04_sotano_llegada: [
			{ set: { 'flag.b04_sotano_llegada': true } },
			{ text: 'La puerta de hierro gris chirría. Detrás, una escalera de piedra que baja en espiral. El aire se enfría a cada escalón. Huele a incienso. A incienso y a humedad.' },
			{ text: 'Abajo, pasillos estrechos con nichos en las paredes. En algunos, flores secas. En otros, velas encendidas. Nadie a la vista. Algo se ríe, muy bajito, detrás de ti.' },
			{ text: '{riolu} va delante, con el aura encendida como una linterna. Los fantasmas se apartan de la luz… y luego la siguen, a una distancia prudente, por curiosidad.', cond: LUC },
			{ say: 'rotom', text: '¡Bzzt! Temperatura: baja. Humedad: alta. Presencias: muchas. —Pausa—. No me hagas caso. Estoy midiendo por los nervios.' },
		],
		b04_sotano_bajar: [
			{ set: { 'flag.b04_sotano_hondo': true } },
			{ text: 'La escalera baja más de lo que debería. Un piso. Dos. Los nichos cambian: ya no son de piedra lisa, sino tallada a mano, con nombres. «Bigotes». «Señora Peluche». «Rayo, el más valiente».' },
			{ text: 'Al final, una sala redonda. En el centro, sobre una peana, un incensario de bronce que humea solo. Por el techo llega, muy amortiguado, la música de la radio de arriba.' },
			{ text: 'Una voz que no es de nadie dice, muy cerca de tu oreja: «…otra vez los de arriba con la musiquita…». Otra, desde el fondo: «…y ahora encima el zumbido ese…». Una tercera: «…en mis tiempos, los vivos tenían la decencia de hacer menos ruido…».' },
			{ say: 'rotom', text: '…Bzzt. ¿Lo has oído? Dime que lo has oído. No, no me lo digas.' },
			{ text: 'Y desde el fondo de la sala, entre los nichos, llega un ruido nuevo. Un rugido de aspiradora. Y una voz de señor mayor muy emocionado: «¡Quieto! ¡Quieto, que es por la ciencia!».' },
		],
		b04_gadd_lavanda: [
			{ set: { 'flag.b04_gadd_lavanda': true } },
			{ text: 'Entre los nichos, un señor bajito con bata, gafas redondas y una mochila con un tubo enorme persigue a un Gastly. El tubo ruge. El Gastly se ríe. El señor también.' },
			{ if: 'flag.b01_enc_gadd_1', then: [
				{ say: 'gadd', text: '¡Quieto! ¡Quieto! —El Gastly le atraviesa la cabeza—. ¡Uy! ¡Hola, hola! ¡Tú! ¡Del castillo de Vánitas! ¿Te acuerdas de este? ¿El del acento? ¡Es él! ¡El mismo! ¡Lo he seguido desde Kalos!' },
			], else: [
				{ say: 'gadd', text: '¡Quieto! ¡Quieto! —El Gastly le atraviesa la cabeza—. ¡Uy! Hola, hola. Ernesto Gadd, inventor y cazafantasmas. Y eso que se escapa es un dato. Un dato que me ha hecho cruzar dos regiones.' },
				{ say: 'gadd', text: 'Lo encontré en un castillo de Kalos, en Vánitas. Un Gastly con acento de Lavanda, perdido por una de esas grietas. ¡Un fantasma desplazado! Lo he seguido hasta aquí. Creo que ha vuelto a casa solo. Los fantasmas se orientan fatal, pero tienen buena memoria.' },
			] },
			{ say: 'gadd', text: 'Mira, mira cómo se mueve. Ya no tiembla como en Kalos. Aquí está tranquilo. Aquí está en su sitio. —Se le empañan las gafas—. Llevo un año persiguiéndolo para devolverlo a casa y resulta que ya ha vuelto él solo. Qué ridículo. Qué precioso.' },
			{ text: 'El Gastly da una vuelta alrededor de la cabeza de Gadd, le saca la lengua y se mete en un nicho con el nombre «Rayo, el más valiente». Asoma un ojo. Se ríe. Desaparece.' },
			{ text: 'En la mochila de Gadd, dentro de la aspiradora, algo se mueve: una lucecita naranja con dos ojitos. Un Rotom, metido en el motor. Mira la Pokédex.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Primo! ¡Un primo en una aspiradora! —Pausa—. ¿Te tratan bien? Parpadea dos veces si te tratan bien.' },
			{ text: 'El Rotom de la aspiradora parpadea dos veces. Luego se esconde dentro del motor.' },
			{ choice: [
				{ text: '«¿Lo vas a aspirar?»', then: [
					{ say: 'gadd', text: '¿Aspirarlo? ¿Para qué? ¡Ya está en casa! Mi aspiradora tiene modo «suave» para devolverlos, no para quitárselos a nadie. —Apaga el tubo—. Dato cerrado. Origen: Lavanda. Destino: Lavanda. Distancia recorrida: dos regiones. Motivo: una grieta. Hora: ¡apunta la hora, que nadie apunta la hora!' },
					{ set: { 'flag.b04_gastly_casa': true } },
				] },
				{ text: '«¿Por qué se quejan tanto los fantasmas?»', then: [
					{ say: 'gadd', text: '¡Porque tienen razón! —Se ríe—. Fíjate: cien años en una torre tranquila, y de pronto, una antena. Luego, la música. Y desde hace un mes, un zumbido que viene del oeste y no les deja descansar. Ni muertos te dejan en paz los de Azafrán.' },
					{ say: 'gadd', text: 'Los vivos se quejan de los fantasmas. Los fantasmas se quejan de los vivos. Yo apunto las dos cosas. Es lo más justo.' },
				] },
			] },
			{ if: 'flag.b04_kaori_encargo && !flag.b04_kaori_paso', then: [
				{ say: 'gadd', text: '¿El incensario? ¡Ah, sí! Lleva cuarenta años encendido sin que nadie lo rellene. Lo he medido. Mi aspiradora dice que el humo «pesa más de lo que debería». No sé qué significa. Me encanta no saber qué significa.' },
			] },
			{ intel: { npc: 'gadd', text: 'En el sótano de la vieja Torre Pokémon de Lavanda. El Gastly desplazado que perseguía desde el castillo de Vánitas ha vuelto a casa él solo. Los fantasmas de la torre se quejan de la antena, de la música y de «un zumbido que viene del oeste» desde hace un mes.' } },
		],
		b04_gadd_despues: [
			{ say: 'gadd', text: '¡Hola, hola! Estoy apuntando las quejas de los de aquí abajo. Llevo ciento doce. «La música». «La antena». «El zumbido». «El chico ese que grita a una cámara». —Mira hacia Tobías—. Esa última es reciente.' },
		],

		// ----- Tobías -----
		b04_tobias_1: [
			{ set: { 'flag.b04_tobias_1': true } },
			{ if: 'flag.b03_tobias_1 || done.b01_t_tobias || flag.b01_enc_tobias_1', then: [
				{ say: 'tobias', text: '¡Patrocinadores, bienvenidos al episodio cincuenta y ocho! ¡El ESPECIAL DE FANTASMAS! ¡Y tenemos… a nuestr{o|a|e} invitad{o|a|e} recurrente! ¡{jugador}! ¡Audiencia, aplaudid! —Mira el móvil—. Treinta y dos en directo. Una es mi madre. Las otras treinta y una, no sé. Puede que fantasmas.' },
			], else: [
				{ say: 'tobias', text: '¡Patrocinadores, bienvenidos al episodio cincuenta y ocho! ¡El ESPECIAL DE FANTASMAS! Soy Tobías, y ella es Duquesa, la verdadera estrella… ¡Un momento! ¡{Un|Una|Une} aventurer{o|a|e} salvaje aparece! Tobías Quiroga, encantado. ¿Te gustan los fantasmas? A mí no. Por eso es un especial.' },
			] },
			{ text: 'A sus pies, sobre su cojín de terciopelo morado, Duquesa bosteza enseñando todos los colmillos. Lleva un collar nuevo: una calabacita de plástico. Lo mira todo con el desprecio de siempre.' },
			{ say: 'tobias', text: 'El patrocinador, Pociones Patito, nos ha pedido un «especial de miedo». Así que vamos a bajar al sótano de la vieja Torre Pokémon. ¡En directo! ¡Sin cortes! ¡Con niebla de verdad! —Baja la voz—. Bueno, la niebla es de verdad. No la he traído yo. Eso es lo que me preocupa.' },
			{ say: 'tobias', text: 'Duquesa no tiene miedo. Duquesa no ha tenido miedo nunca de nada. Yo tengo miedo por los dos. Es un reparto justo. —A ti—: ¿Bajas? Abajo nos vemos. En el piso de abajo del todo. Para el gran final. Si sobrevivo.' },
			{ intel: { npc: 'tobias', text: 'Graba «el especial de fantasmas» de su programa (episodio 58) en el sótano de la vieja Torre Pokémon de Lavanda. Le dan miedo los fantasmas. A Duquesa, no.' } },
		],
		b04_tobias_final: [
			{ set: { 'flag.b04_tobias_final': true } },
			{ text: 'En una esquina de la sala redonda, Tobías narra a la cámara con la linterna debajo de la barbilla. Le tiembla la voz. Duquesa está tumbada encima de una lápida, lamiéndose una pata.' },
			{ say: 'tobias', text: '…y aquí, audiencia, en la sala más honda de la torre, donde nadie se atreve a… —Un Haunter le asoma por detrás del hombro y le sopla en la nuca—. ¡AAAAAAH! —Se da la vuelta—. ¡No hay nadie! ¡No hay nadie! Seguimos.' },
			{ text: 'El Haunter se acerca a Duquesa. Le pone una cara horrible: lengua fuera, ojos enormes, manos de garra. Duquesa lo mira. Bosteza. Le da un zarpazo distraído que lo atraviesa sin tocarlo, y se vuelve a lamer la pata.' },
			{ text: 'El Haunter se queda muy quieto. Luego se va flotando hacia un nicho, despacio, con la dignidad de quien ha perdido.' },
			{ say: 'tobias', text: '¡HA ASUSTADO A UN FANTASMA! ¡Audiencia, lo han visto! ¡Duquesa ha asustado a un fantasma! —Se le saltan las lágrimas—. Esta es la mejor temporada de la historia del programa.' },
			{ if: LUC, then: [
				{ text: 'Duquesa baja de la lápida, se acerca a {riolu} y se frota contra su pierna. Una vez. Sin mirarlo. Luego vuelve a su lápida como si no hubiera pasado nada.' },
				{ say: 'tobias', text: '…¿Qué ha sido eso? Duquesa no hace eso. Duquesa no hace eso ni conmigo. —Te mira, muy serio—. Tu Lucario tiene algo. No sé qué es. Pero lo quiero para el programa.' },
			] },
			{ say: 'tobias', text: 'Y ahora… ¡el gran final! —Se gira a la cámara—. Ya lo conocen. Es la tradición. Resulta que el VERDADERO jefe final del especial de fantasmas… ¡SOY YO! Tercera temporada seguida. Eso ya no es una tradición, es una franquicia.' },
			{ quest: 'b04_t_show', stage: 'hecha', done: true },
			{ call: 'b04_tobias_reto' },
		],
		b04_tobias_revancha: [
			{ say: 'tobias', text: '¡Seguimos en directo! Bueno, en diferido. Bueno, estoy editando. ¿Hacemos el combate del final? Sin combate, el episodio se queda cojo. Y los episodios cojos no los ve ni mi madre.' },
			{ call: 'b04_tobias_reto' },
		],
		b04_tobias_reto: [
			{ choice: [
				{ text: '«Venga, jefe de piso. Al lío.»', then: [
					{ heal: 'Tobías le reparte a tu equipo un puñado de Pociones Patito antes de empezar. «Para que sea justo. Y porque el patrocinador me ha mandado ciento cuarenta». Tu equipo se recupera del todo.' },
					{ battle: 'tobias_3', lose: 'continue',
						onWin: [
							{ say: 'tobias', text: '¡Y el jefe de piso cae! ¡Tres temporadas! ¡Tres! ¡Esto ya es una saga!' },
							{ text: 'Saca una caja de cartón con una pegatina dibujada a mano: «BOTÍN DE ORO». Debajo, más pequeño: «(de verdad esta vez)».' },
							{ give: 'maxrevive' }, { give: 'hyperpotion', n: 2 },
							{ text: 'Desde los nichos, muy bajito, alguien aplaude. Varias manos que no se ven. Tobías se queda blanco.' },
							{ say: 'tobias', text: '…¿Eso ha sido el público? ¿Tengo público aquí abajo? —Traga saliva—. Gracias. Gracias por venir. Por favor, no me sigan a casa.' },
						],
						onLose: [
							{ say: 'tobias', text: '¡GANAMOS! ¡En una cripta! ¡Duquesa, mira! …Duquesa ya está dormida encima de una lápida. Se lo cuento luego. Con gráficos. —A ti, bajito—: Vuelve cuando quieras. El jefe de piso no se mueve de aquí. No puede: le da miedo subir solo.' },
						],
					},
				] },
				{ text: '«Hoy no. Termina el episodio sin mí.»', then: [
					{ say: 'tobias', text: 'Sin combate final. —Se lo piensa—. Bueno. Lo vendo como «final abierto». Los finales abiertos están de moda. Pero si cambias de idea, estaré aquí. Editando. Con miedo.' },
				] },
			] },
		],
		b04_tobias_despues: [
			{ say: 'tobias', text: 'Estoy editando el especial. Tengo cuarenta minutos de mí gritando y tres segundos de Duquesa asustando a un fantasma. Adivina qué va a ser la miniatura.' },
			{ text: 'Duquesa duerme encima del trípode. De vez en cuando abre un ojo, mira los nichos y los nichos se quedan muy callados.' },
		],
	},

	// =====================================================================
	// MISIONES PEQUEÑAS DEL TRAMO
	// =====================================================================
	quests: {
		b04_q_tejado: { name: 'Desde arriba', type: 'main', est: 30,
			stages: {
				mirar: 'Sube a los tres **puntos de observación** de las azoteas de Azafrán y busca la forma de entrar en Silph.',
				bajar: 'Ya lo has visto todo. Encuentra tu forma de entrar y baja al callejón de detrás de Silph.',
				hecha: 'Bajaste. Por el camino rápido.',
			},
			parts: { title: 'Antes de bajar', items: [
				{ label: 'Punto de observación: la cornisa norte', where: 'azotea_lemnis', done: 'flag.b04_obs_cornisa', hint: 'Desde la cornisa norte se ve la pasarela de cristal entre las dos torres.' },
				{ label: 'Punto de observación: la antena', where: 'azotea_lemnis', done: 'flag.b04_obs_antena', hint: 'Un vigilante de Lemnis hace la ronda junto a la antena. Habrá que quitarlo de en medio.' },
				{ label: 'Punto de observación: el depósito de agua', where: 'azotea_lemnis', done: 'flag.b04_obs_deposito', hint: 'El depósito de agua da al callejón de detrás de Silph.' },
				{ label: 'La forma de entrar', where: 'azotea_lemnis', done: 'flag.b04_entrada_lista', hint: [
					{ cond: 'flag.b03_rocket_quemar', text: 'Alguien con traje blanco te espera en la azotea de al lado.' },
					{ cond: 'flag.b03_rocket_policia', text: 'Alguien sube por el andamio de limpieza de la Torre Lemnis. Muy despacio.' },
					{ cond: 'flag.b03_rocket_libres', text: 'Te ha llegado una carta. Léela en la azotea.' },
					{ text: 'Ysolde se encarga.' },
				] },
			] },
		},
		b04_q_archivo: { name: 'Lo que hay en la planta 11', type: 'main', est: 45,
			stages: {
				buscar: 'Busca en la planta 11 de Silph lo que Ysolde dijo que había.',
				salir: 'Ya lo tienes todo. Sal por la salida de servicio.',
				hecha: 'Saliste por arriba. Con todo.',
			},
			parts: { title: 'Tres cosas', items: [
				{ label: 'Las hojas firmadas con una sola letra', where: 'archivo_silph', done: 'flag.b04_fuente_l', hint: 'En los archivadores de seguimiento, detrás del guardia del pasillo.' },
				{ label: 'Lo que une Caoba con Azafrán', where: 'archivo_silph', done: 'flag.b04_magda_nombre', hint: 'A la gente que manda le gusta clavar cosas en corchos. La sala de reuniones.' },
				{ label: 'Lo que buscas tú', where: 'archivo_silph', done: 'flag.b04_expediente_visto', hint: 'Un armario viejo de Silph, de antes de Lemnis. Expedientes de personal.' },
			] },
		},
		b04_q_ceniza: { name: 'Lo que se queda un poco más', type: 'side', est: 30,
			stages: {
				bajar: 'Trae a Kaori ceniza del **incensario** del sótano de la vieja Torre Pokémon, bajo la Torre Radio de Lavanda.',
				hecha: 'La Ponyta de la Casa Pokémon tiene otra vez una llamita. Pequeña. Estable.',
			},
		},
	},

	// =====================================================================
	// OBJETOS NUEVOS
	// =====================================================================
	items: {
		cartatoni: { name: 'Carta de Toni', pocket: 'key', desc: 'Un sobre arrugado con sellos de Johto, escrito con una letra grande y torcida. Huele un poco a arroz con leche. Dentro hay un dibujo.',
			read: '**Hola. Soy Toni. El de las orejas.**\n\nMe ha dicho la Mayor que te escriba porque sales en la tele, en lo de la Gira, y vas a Azafrán. Yo no sé escribir cartas. Esta es la primera. Perdón por la letra. Perdón por la mancha. Es de arroz con leche.\n\nMi madre y yo vendemos arroz con leche en la Ruta 37. Con canela. Ganamos más que con Atlas. No se lo digas.\n\nLa Mayor dice que te cuente una cosa. Cuando nos pagaba la fundación, la familia también limpiaba oficinas de noche en Azafrán. En Silph. La Mayor fregaba la planta once y dice que allí hay algo raro, porque nadie limpia la planta once, solo ella, y le hacían firmar un papel.\n\nTe he hecho un dibujo. Por el conducto de ventilación se sube desde el callejón hasta la planta once. Yo quepo. Apretando. Tú seguro que cabes.\n\nGracias por dejarnos ir. Mi madre dice que eres buena persona. Yo creo que también.\n\n**Toni**\n\n*P. D.: Al lado de la rejilla hay un chicle pegado. Es mío. No lo toques. Es un recuerdo.*' },
		declaracionatlas: { name: 'Declaración de Atlas', pocket: 'key', desc: 'Una hoja doblada en cuatro, con sellos de la policía de Johto. Al pie, una firma con una A muy grande.',
			read: '**POLICÍA DE JOHTO · CAOBA · DECLARACIÓN VOLUNTARIA**\nDeclarante: el detenido que se identifica como «Atlas».\n\n*Transcripción literal, a petición del declarante:*\n\n«Que se lo den a quien cortó la máquina. A nadie más.\n\nSilph, Azafrán. Planta once. La puerta sin número. No tiene cerradura: tiene un guardia. El guardia va a por café a las tres y diez porque la máquina de la once está rota y baja a la diez. Tarda nueve minutos. Siempre nueve.\n\nLo sé porque la familia limpiaba allí. No pregunten más. No voy a contestar más.\n\nY díganle que no estamos en paz. Que la deuda era mía, no suya.»\n\n*El declarante se niega a firmar con su nombre completo. Firma con una A.*' },
		cenizatorre: { name: 'Ceniza del incensario', pocket: 'key', desc: 'Un pañuelo doblado con un puñado de ceniza gris y tibia del incensario de la vieja Torre Pokémon. Huele a lavanda, a madera y a algo amargo. Para Kaori.' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		piedras_r8: {
			name: 'Piedras junto al camino', icon: '🪨', hours: 20, picks: [1, 2],
			text: 'Rebuscas en el montón de piedras que apartaron los de la obra. Casi todas son piedras. Algunas, no.',
			wait: 'Solo quedan piedras. Piedras normales. Habrá que esperar a que los de la obra aparten más.',
			table: [
				{ id: 'hardstone', w: 18, n: [1, 1] }, { id: 'everstone', w: 12, n: [1, 1] }, { id: 'firestone', w: 8, n: [1, 1] },
				{ id: 'thunderstone', w: 8, n: [1, 1] }, { id: 'waterstone', w: 8, n: [1, 1] }, { id: 'leafstone', w: 8, n: [1, 1] },
				{ id: 'moonstone', w: 4, n: [1, 1] }, { id: 'nugget', w: 2, n: [1, 1] },
			],
		},
		campo_lavanda: {
			name: 'Campo de lavanda', icon: '💜', hours: 18, picks: [1, 3],
			text: 'Caminas entre las matas de lavanda. Los Combee te ignoran. Entre las flores hay bayas, miel y, a veces, cosas que alguien dejó caer hace mucho.',
			wait: 'Las matas están recién cortadas. El campo necesita un día para volver a oler como debe.',
			table: [
				{ id: 'honey', w: 16, n: [1, 2] }, { id: 'pechaberry', w: 14, n: [1, 2] }, { id: 'chestoberry', w: 12, n: [1, 2] },
				{ id: 'tinymushroom', w: 10, n: [1, 2] }, { id: 'lumberry', w: 5, n: [1, 1] }, { id: 'cleansetag', w: 4, n: [1, 1] },
				{ id: 'spelltag', w: 3, n: [1, 1] }, { id: 'reapercloth', w: 1, n: [1, 1], cond: 'flag.b04_kaori_paso' },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		operacion_tejado: {
			name: 'Operación Tejado', type: 'Steel', rec: 52,
			cond: 'flag.b04_tejado_inicio',
			info: [
				{ text: 'Las azoteas de Azafrán y la planta 11 de Silph. Vigilantes de Lemnis y «seguridad privada», niveles 50 a 53.' },
				{ text: 'En los tejados, **Acero** y **Eléctrico**: el **Fuego** y la **Tierra** van bien. Dentro de Silph, **Veneno** y **Siniestro**: la **Lucha** y la **Tierra**.' },
				{ cond: 'flag.b04_obs_todas', text: 'Puntos de observación: los tres. Ronda de seis minutos, cámara cada cuarenta segundos, un toldo naranja.' },
				{ cond: 'flag.b04_silph_hecho', text: '✔ Operación terminada. Ni un solo herido.' },
			],
		},
		ruta8_lavanda: {
			name: 'Ruta 8 y Pueblo Lavanda', type: 'Ground', rec: 51,
			cond: 'visited("k_ruta8")',
			info: [
				{ text: 'Al este de Azafrán. Motoristas, jugadores y una geóloga enfadada, niveles 49 a 52.' },
				{ text: 'En la hierba hay Pokémon **Fuego**, **Veneno** y **Tierra**. De noche salen Golbat.' },
				{ cond: 'visited("lavanda")', text: 'En Pueblo Lavanda: Centro Pokémon, tienda y la Casa Pokémon del Señor Fuji.' },
			],
		},
		sotano_torre_reto: {
			name: 'Sótano de la vieja Torre Pokémon', type: 'Ghost', rec: 52,
			cond: 'visited("sotano_torre")',
			info: [
				{ text: 'Debajo de la Torre Radio de Lavanda. Fantasmas salvajes de nivel 47 a 52 y médiums que hablan con alguien que no ves.' },
				{ text: 'El **Siniestro** y el **Fantasma** les hacen daño. Los ataques **Normal** y **Lucha** no tocan a los fantasmas.' },
				{ cond: 'flag.b04_sotano_hondo', text: 'Abajo del todo hay un incensario que nunca se apaga.' },
			],
		},
		rival_tobias_b4: {
			name: 'Tobías: el especial de fantasmas', npc: 'tobias', trainer: 'tobias_3', type: 'Normal', rec: 52,
			cond: 'flag.b04_tobias_final',
			info: [
				{ text: 'El «jefe de piso» de la temporada tres. Opcional. Antes de empezar, cura a tu equipo con Pociones Patito.' },
				{ text: 'Cuatro Pokémon, hasta el nivel 52. Su estrella, **Persian**, sale la última. Su **Drifblim** no soporta el **Siniestro**.' },
				{ cond: 'beat("tobias_3")', text: '✔ Vencido. Botín de oro. De verdad esta vez.' },
			],
		},
	},
};
