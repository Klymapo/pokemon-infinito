// Bloque 2 · Tramo 2: «Tres días tarde».
// Ruta 34 → Ciudad Trigal (pabellón de la Gira, Centro Comercial, Torre Radio, Floristería, Estación del Tren Magnético,
// Gimnasio en obras, Puerta Lemnis de Johto) → Ruta 35 → Parque Nacional.
// Arco principal (todo en Trigal): pabellón → Serafina → Rhi (combate y carta) → Bastien → Noa → Kaori → la noche con Handsome
// → Regadera Ardilla → cierre (b02_trigal_hecho). El resto es opcional pero se marca con «!».

// ---------- Condiciones reutilizadas ----------
const RL = '(inParty("riolu") || inParty("lucario"))';
const LLEGADA = 'flag.b02_trigal_llegada';
const GIRA = 'flag.b02_pabellon';
const SIN_CROMLECH = '!flag.b01_delatar && !flag.b01_handsome && !flag.b01_trato_sera';
const HANDSOME_LISTO = 'flag.b02_rhi_combate_hecho && flag.b02_bastien_combate_hecho';
const CIERRE_LISTO = 'flag.b02_pabellon && flag.b02_sera_trigal && flag.b02_rhi_carta && flag.b02_bastien_combate_hecho && flag.b02_noa_trigal && flag.b02_kaori_trigal && flag.b02_handsome_noche && flag.b02_regadera';

// ---------- Recolección ----------
const BONGURIS = [
	{ id: 'pinkapricorn', w: 16, n: [1, 1] }, { id: 'redapricorn', w: 14, n: [1, 2] }, { id: 'blueapricorn', w: 14, n: [1, 2] },
	{ id: 'yellowapricorn', w: 14, n: [1, 2] }, { id: 'greenapricorn', w: 14, n: [1, 2] }, { id: 'whiteapricorn', w: 8, n: [1, 1] },
	{ id: 'blackapricorn', w: 8, n: [1, 1] },
];

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== RUTA 34 ===================
		ruta34: {
			name: 'Ruta 34', short: 'Ruta 34', region: 'johto', kind: 'route', map: { x: 22, y: 72 },
			bg: { type: 'route', flowers: '#f2b33d' },
			desc: 'Un camino ancho y llano que sube desde el Encinar hacia el norte. Al fondo ya se ven las antenas de **Ciudad Trigal**, y de noche su resplandor naranja tapa las estrellas.\n\nEn las cunetas hay confeti pisoteado y vasos de cartón con el logo de la Gira. Aquí hubo fiesta. Hace tres días.',
			links: ['encinar', 'trigal'],
			mapNote: 'Guardería Pokémon',
			rumors: [
				{ text: 'La pareja de la Guardería no da abasto: les han dejado huevos que nadie sabe de qué son.' },
				{ text: 'Dicen que el Tren Magnético de las 23:05 lleva mala suerte. Siempre llega tarde. Siempre con los mismos pasajeros.' },
				{ cond: '!flag.b02_trigal_llegada', text: 'En Trigal hay una carpa enorme con banderas de todas las regiones. La Gira lleva tres días allí.' },
			],
			route: {
				from: 'encinar', to: 'trigal', length: 8, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [{ text: 'La niebla del Encinar se queda a tu espalda, como una puerta que se cierra sola. Delante, el cielo de Johto. Normal. Con su hora de siempre.' }],
					1: [
						{ script: 'b02_r34_entrada', once: true, mark: true },
						{ trainer: 'r34_ivan' },
						{ item: 'superrepel' },
					],
					2: [
						{ text: 'Un cartel de madera, recién pintado: «**Primera Gira Interregional** · Bienvenidos a Johto · Un mundo. Una liga.» Alguien ha tachado «Un mundo» con rotulador y ha escrito encima «Un atasco».' },
						{ trainer: 'r34_marisol', optional: true, label: 'Una pokéfan con un Granbull en brazos. Te mira con curiosidad' },
						{ spot: { action: { gather: 'bonguri_johto' } }, label: 'Árbol de Bonguri', icon: '🌳', sub: 'Un árbol bajo, de frutos redondos y duros' },
					],
					3: [
						{ talk: [{ cond: '!flag.b02_guarderia', script: 'b02_guarderia' }, { script: 'b02_guarderia_despues' }], label: 'Guardería Pokémon', sub: 'Una casita con un corral lleno de Pokémon', icon: '🏡', new: '!flag.b02_guarderia' },
						{ text: 'En el corral de la Guardería, un Wooloo pasta entre un Sentret y un Tauros. Nadie le ha preguntado de dónde viene. Él tampoco lo cuenta.' },
					],
					4: [
						{ terrain: 'water' },
						{ text: 'El camino bordea una cala pequeña. En el muelle, un pescador se queja de que los Krabby «hablan raro» desde hace un mes.' },
						{ trainer: 'r34_oscar' },
						{ item: 'pearl', hidden: true },
					],
					5: [
						{ trainer: 'r34_ramiro', optional: true, label: 'Un policía con un Arcanine, apuntando matrículas en una libreta' },
						{ item: 'hyperpotion' },
					],
					6: [
						{ text: 'Una valla publicitaria gigante: los novatos de la Gira, sonriendo, delante de la Puerta Lemnis de Trigal. Los cuentas sin querer. Falta uno. Faltas tú.' },
						{ trainer: 'r34_celia' },
					],
					7: [
						{ item: 'honey', hidden: true },
						{ text: 'Unas colmenas silvestres en un tronco hueco. Los Combee zumban, ocupados. Huele a miel y a pan recién hecho: Trigal está cerca.' },
					],
					8: [{ text: 'Las primeras calles de **Ciudad Trigal**. Bocinas, música de tres tiendas distintas a la vez y una pantalla que anuncia, en bucle, «¡La Gira ya está aquí!». Ya. Hace tres días.' }],
				},
				encounters: {
					grass: [
						{ sp: 'drowzee', lv: [31, 33], w: 24 },
						{ sp: 'hypno', lv: [33, 35], w: 8, time: 'night' },
						{ sp: 'raticate', lv: [31, 34], w: 18 },
						{ sp: 'kirlia', lv: [31, 33], w: 10 },
						{ sp: 'loudred', lv: [31, 33], w: 10 },
						{ sp: 'linoone', lv: [32, 34], w: 10 },
						{ sp: 'bibarel', lv: [32, 34], w: 10 },
						{ sp: 'kadabra', lv: [32, 33], w: 4 },
						{ sp: 'ditto', lv: [32, 33], w: 3 },
						{ sp: 'tandemaus', lv: [31, 33], w: 6, displaced: true },
						{ sp: 'nickit', lv: [31, 33], w: 5, displaced: true, time: 'night' },
					],
					water: [
						{ sp: 'tentacool', lv: [30, 33], w: 40 },
						{ sp: 'tentacruel', lv: [33, 35], w: 10 },
						{ sp: 'floatzel', lv: [32, 34], w: 15 },
						{ sp: 'krabby', lv: [30, 32], w: 25 },
						{ sp: 'kingler', lv: [33, 35], w: 5 },
					],
				},
			},
		},

		// =================== CIUDAD TRIGAL ===================
		trigal: {
			name: 'Ciudad Trigal', short: 'Trigal', region: 'johto', kind: 'city', map: { x: 22, y: 56 },
			bg: { type: 'city', roofs: ['#c4473a', '#f2b33d', '#3b5bb5', '#e9e3d0'] },
			desc: 'La ciudad más grande de Johto. Calles que no se acaban, la **Torre Radio** con su antena roja, el **Centro Comercial** de seis plantas y la estación del **Tren Magnético**, que pita cada diez minutos.\n\nEn la plaza, una carpa enorme con banderas de todas las regiones: el **pabellón de la Gira**. Y, detrás de unas vallas azules y plateadas, el arco de la **Puerta Lemnis de Johto**.',
			descNight: 'De noche, Trigal no duerme: cambia de turno. Las pantallas de la Gira iluminan la plaza en azul y plata, y la antena de la Torre Radio parpadea en rojo, siempre al mismo ritmo.',
			descs: [
				{ cond: 'flag.b02_trigal_hecho', text: 'Trigal sigue a lo suyo: bocinas, música, el pitido del Tren Magnético. La carpa de la Gira empieza a desmontarse; la siguiente parada es **Ciudad Iris**.\n\nDetrás de las vallas, la **Puerta Lemnis** vuelve a estar encendida.' },
			],
			links: ['ruta34', 'ruta35'],
			mapNote: 'Pabellón de la Gira · Centro Comercial · Torre Radio · Puerta Lemnis',
			onEnter: [
				{ script: 'b02_trigal_llegada', cond: '!flag.b02_trigal_llegada', once: true },
				{ script: 'b02_trigal_cierre', cond: CIERRE_LISTO + ' && !flag.b02_trigal_hecho' },
			],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Pabellón de la Gira', sub: 'La carpa de las banderas', icon: '🎪', action: { go: 'pabellon_gira' }, new: '!flag.b02_pabellon || (!flag.b02_sera_trigal && flag.b02_pabellon)' },
				{ label: 'Centro Comercial', sub: 'Seis plantas y una azotea', icon: '🏬', action: { go: 'cc_trigal' }, new: GIRA + ' && !flag.b02_kaori_trigal' },
				{ label: 'Torre Radio', sub: 'Antena roja, emisión 24 horas', icon: '📻', action: { go: 'torre_radio' } },
				{ label: 'Floristería', sub: 'Macetas hasta en la acera', icon: '💐', action: { go: 'floristeria_trigal' }, new: GIRA + ' && !flag.b02_regadera' },
				{ label: 'Estación del Tren Magnético', sub: 'Pita cada diez minutos', icon: '🚄', action: { go: 'estacion_magnetica' }, new: 'quest.b02_t_renata == "testigo"' },
				{ label: 'Gimnasio de Trigal', sub: 'En obras', icon: '🚧', cond: '!flag.b03_ruinas_hecho', action: { go: 'gym_trigal' }, new: GIRA + ' && !flag.b02_lila_trigal' },
				{ label: 'Puerta Lemnis de Johto', sub: 'Detrás de las vallas azules', icon: '♾️', action: { go: 'puerta_trigal' } },

				// --- Arco principal en la plaza ---
				{ label: 'Rhi', sub: 'Te ha visto. Viene hacia aquí a zancadas', icon: '⚽', cond: GIRA + ' && !flag.b02_rhi_combate_hecho', new: 'true', talk: [{ script: 'b02_rhi_trigal' }] },
				{ label: 'Revancha con Rhi', sub: 'Sigue en la plaza, dando toques a una Poké Ball', icon: '⚽', cond: 'flag.b02_rhi_combate_hecho && !beat("rhi_3")', talk: [{ script: 'b02_rhi_revancha' }] },
				{ label: 'Rhi, sola en un banco', sub: 'Tiene un sobre en la mano', icon: '✉️', cond: 'flag.b02_rhi_combate_hecho && !flag.b02_rhi_carta', new: 'true', talk: [{ script: 'b02_rhi_carta' }] },
				{ label: 'Bastien', sub: 'Con una libreta en la mano', icon: '📒', cond: GIRA + ' && flag.b01_bastien_cubierto && !flag.b02_bastien_combate_hecho', new: 'true', talk: [{ script: 'b02_bastien_trigal' }] },
				{ label: 'Bastien', sub: 'Con una chaqueta vieja, sentado en una fuente', icon: '🧥', cond: GIRA + ' && flag.b01_bastien_rompe && !flag.b02_bastien_combate_hecho', new: 'true', talk: [{ script: 'b02_bastien_trigal' }] },
				{ label: 'Un cartel gigante de Bastien', sub: 'Sonríe. Debajo, el Bastien de verdad no', icon: '🪧', cond: GIRA + ' && !flag.b01_bastien_cubierto && !flag.b01_bastien_rompe && !flag.b02_bastien_combate_hecho', new: 'true', talk: [{ script: 'b02_bastien_trigal' }] },
				{ label: 'Revancha con Bastien', sub: 'Te espera junto a la fuente', icon: '💧', cond: 'flag.b02_bastien_combate_hecho && !beat("bastien_3")', talk: [{ script: 'b02_bastien_revancha' }] },
				{ label: 'Noa', sub: 'Te hace una seña desde detrás de la Torre Radio', icon: '📋', cond: 'flag.b02_bastien_combate_hecho && !flag.b02_noa_trigal', new: 'true', talk: [{ script: 'b02_noa_trigal' }] },
				{ label: 'Un vendedor de globos', sub: 'Bigote postizo. Gabardina. Globos de Lucario', icon: '🎈', cond: HANDSOME_LISTO + ' && !flag.b02_handsome_cita', new: 'true', talk: [{ script: 'b02_handsome_cita' }] },
				{ label: 'Detrás de la Torre Radio', sub: 'Handsome te citó allí. De noche', icon: '🌙', cond: 'flag.b02_handsome_cita && !flag.b02_handsome_noche', new: 'true', talk: [
					{ cond: 'night', script: 'b02_handsome_noche' },
					{ script: 'b02_handsome_esperar' },
				] },
				{ label: 'Una capucha gris en el tejado', sub: 'En lo alto del Centro Comercial, junto al Miltank hinchable', icon: '🪶', cond: GIRA + ' && !flag.b02_ysolde_trigal', new: '!flag.b02_ysolde_trigal', talk: [{ script: 'b02_ysolde_trigal' }] },
				{ label: 'Rotom vibra', sub: 'Llamada entrante: «Renata (NO COLGAR)»', icon: '📞', cond: GIRA + ' && !quest.b02_t_renata', new: 'true', talk: [{ script: 'b02_renata_llamada' }] },
				{ label: 'Rotom vibra', sub: 'Llamada entrante: «Agencia de Detectives»', icon: '📞', cond: 'flag.b02_sera_trigal && !quest.b02_t_agencia', new: 'true', talk: [{ script: 'b02_agencia_llamada' }] },
				{ label: 'Caso de la Agencia', sub: 'El Miltank que se fue en tren', icon: '🗂️', cond: 'quest.b02_t_agencia == "caso"', new: 'true', talk: [{ script: 'b02_agencia_caso' }] },
				{ label: 'Rotom: ¿qué me queda?', sub: 'Repasa lo pendiente en Trigal', icon: '📱', cond: LLEGADA + ' && !flag.b02_trigal_hecho', talk: [{ script: 'b02_trigal_pendiente' }] },
				{ label: 'Ponerse en marcha', sub: 'La Gira sale hacia Ciudad Iris', icon: '🧭', cond: CIERRE_LISTO + ' && !flag.b02_trigal_hecho', new: 'true', talk: [{ script: 'b02_trigal_cierre' }] },
			],
			rumors: [
				{ text: 'La Torre Radio emite toda la noche. A las 2:17, dicen, se cuela un pitido que no es de ninguna emisora.' },
				{ text: 'En la Floristería regalan una regadera muy rara a quien les cae bien. Tiene forma de Squirtle. Aquí le llaman «ardilla», no preguntes.' },
				{ cond: 'flag.b02_pabellon', text: 'En la bolsa de regalo de la Gira hay unos caramelos azules. A los Pokémon les encantan. A algunos, demasiado.' },
				{ cond: 'flag.b02_lila_trigal', text: 'La chica del pelo blanco que prepara el gimnasio echó a un Rocket ella sola. Los obreros no hablan de otra cosa.' },
			],
		},

		// ---------- Pabellón de la Gira ----------
		pabellon_gira: {
			name: 'Pabellón de la Gira', parent: 'trigal', kind: 'building',
			bg: { type: 'indoor', wall: '#1f2e4f', floor: '#cfd6e2' },
			desc: 'Una carpa inmensa con suelo de moqueta azul, focos, un photocall con la lemniscata y mesas de acreditación. En las pantallas, la ceremonia de llegada de hace tres días, en bucle: confeti, aplausos, los novatos saliendo de la Puerta de uno en uno.\n\nTú no sales en el vídeo.',
			descs: [{ cond: 'flag.b02_pabellon', text: 'La carpa de la Gira. Huele a moqueta nueva y a café de máquina. En las pantallas sigue el vídeo de la llegada, en bucle. Ahora, en la última imagen, alguien ha añadido tu cara en una esquina. Mal.' }],
			mapNote: 'Acreditación · Serafina Lemnis',
			spots: [
				{ label: 'Mesa de acreditación', sub: 'Un organizador con auriculares', icon: '🎫', talk: [{ cond: '!flag.b02_pabellon', script: 'b02_pabellon' }, { script: 'b02_pabellon_despues' }], new: '!flag.b02_pabellon' },
				{ label: 'La anfitriona', sub: 'Traje azul medianoche, guantes blancos', icon: '🧤', cond: 'flag.b02_pabellon', new: '!flag.b02_sera_trigal', talk: [{ cond: '!flag.b02_sera_trigal', script: 'b02_sera_trigal' }, { script: 'b02_sera_despues' }] },
				{ label: 'Un inspector junto al photocall', sub: 'Traje gris, carpeta gorda', icon: '🗂️', cond: 'flag.b02_pabellon && !flag.b02_lebrun_trigal', new: 'true', talk: [{ script: 'b02_lebrun_trigal' }] },
				{ label: 'Mirar el photocall', sub: 'La foto oficial de la Gira', icon: '📸', cond: 'flag.b02_pabellon', talk: [{ script: 'b02_photocall' }] },
			],
		},

		// ---------- Centro Comercial ----------
		cc_trigal: {
			name: 'Centro Comercial de Trigal', parent: 'trigal', kind: 'building',
			bg: { type: 'indoor', wall: '#e9e3d0', floor: '#c4473a' },
			desc: 'Seis plantas de escaleras mecánicas, hilo musical y gente con bolsas. En la planta baja, una herboristería que huele a raíces; en la tercera, un patio de comidas; en la azotea, un **Miltank hinchable** de diez metros, regalo de la Gira, y un área de combates.\n\nUn cartel: «Prohibido combatir en las escaleras mecánicas. Sí, otra vez.»',
			mapNote: 'Tienda (MT) · Azotea: entrenamiento (nivel 38)',
			spots: [
				{ label: 'Tiendas del Centro Comercial', icon: '🛍️', action: { shop: 'centro_comercial_trigal' } },
				{ label: 'Herboristería de la planta baja', sub: 'Alguien discute con el dependiente sobre setas', icon: '🌿', cond: GIRA, new: '!flag.b02_kaori_trigal', talk: [{ cond: '!flag.b02_kaori_trigal', script: 'b02_kaori_trigal' }, { script: 'b02_kaori_despues' }] },
				{ label: 'Patio de comidas', sub: 'Una olla enorme entre los puestos de fideos', icon: '🍲', cond: GIRA, new: '!flag.b02_gaspar_trigal', talk: [{ cond: '!flag.b02_gaspar_trigal', script: 'b02_gaspar_trigal' }, { script: 'b02_gaspar_despues' }] },
				{ label: 'Azotea', sub: 'Zona de entrenamiento (nivel recomendado 38)', icon: '🥋', action: { training: {
					cap: 38, trainers: ['azotea_1', 'azotea_2', 'azotea_3'], coach: 'Encargado de la azotea',
					wild: [{ sp: 'pidgeotto', lv: [33, 35] }, { sp: 'raticate', lv: [33, 35] }, { sp: 'magnemite', lv: [33, 35] }],
					closed: 'El encargado de la azotea te mira el equipo y niega con la cabeza. «Aquí ya no sacas nada. Bueno, sacas una foto con el Miltank hinchable. Eso siempre.»',
				} } },
			],
		},

		// ---------- Torre Radio ----------
		torre_radio: {
			name: 'Torre Radio de Trigal', parent: 'trigal', kind: 'building',
			bg: { type: 'tower' },
			desc: 'Un vestíbulo lleno de discos de oro, carteles de programas y un mostrador con una recepcionista que sonríe con los auriculares puestos. Al fondo, un estudio con un piloto rojo: **EN EL AIRE**.\n\nEn la pared, una pizarra: «Hoy en *Noches de Johto*: la Gira, en directo. ¡Llama y cuéntanos!».',
			mapNote: 'Alexia · Estudio',
			spots: [
				{ label: 'Alexia', sub: 'En la puerta del estudio, con su cámara', icon: '📷', cond: GIRA, new: '!flag.b02_alexia_trigal', talk: [{ cond: '!flag.b02_alexia_trigal', script: 'b02_alexia_trigal' }, { script: 'b02_alexia_despues' }] },
				{ label: 'La recepcionista', sub: 'Sonríe. Con los auriculares puestos', icon: '🎧', talk: [{ script: 'b02_recepcion_radio' }] },
			],
		},

		// ---------- Floristería ----------
		floristeria_trigal: {
			name: 'Floristería de Trigal', parent: 'trigal', kind: 'building',
			bg: { type: 'indoor', wall: '#e9f0d8', floor: '#8a7a5a' },
			desc: 'Un local estrecho donde las macetas llegan hasta el techo. Huele a tierra mojada. Dos hermanas atienden detrás del mostrador: la mayor riega, la pequeña habla.\n\nEn una estantería, una regadera de hojalata con forma de Squirtle. Tiene una etiqueta: «NO SE VENDE».',
			mapNote: 'Regadera Ardilla',
			spots: [
				{ label: 'Las floristas', sub: 'La pequeña ya te está saludando', icon: '💐', new: '!flag.b02_regadera', talk: [
					{ cond: '!flag.b02_regadera && !' + GIRA, script: 'b02_floristeria_pronto' },
					{ cond: '!flag.b02_regadera', script: 'b02_floristeria' },
					{ script: 'b02_floristeria_despues' },
				] },
				{ label: 'Macetas del escaparate', icon: '🪴', action: { gather: 'macetas_trigal' } },
			],
		},

		// ---------- Estación del Tren Magnético ----------
		estacion_magnetica: {
			name: 'Estación del Tren Magnético', parent: 'trigal', kind: 'building',
			bg: { type: 'indoor', wall: '#cfd6e2', floor: '#4a4f6a' },
			desc: 'Un andén limpísimo y un tren blanco que flota a dos dedos de la vía. Un panel anuncia salidas a Ciudad Azafrán. La del 23:05 lleva un letrero pequeño debajo, escrito a mano: «Retraso probable».\n\nEn la pared, una placa: «Inaugurada hace doce años. Proyecto conjunto de Silph S.A. y patrocinadores».',
			mapNote: 'Tren Magnético (a Kanto, cerrado)',
			spots: [
				{ label: 'El panel de salidas', icon: '🕰️', talk: [{ script: 'b02_estacion_panel' }] },
				{ label: 'Una revisora con un Magnemite', sub: 'Pica billetes con mucha energía', icon: '🎫', cond: 'quest.b02_t_renata == "testigo"', talk: [{ script: 'b02_renata_revisora' }] },
				{ label: 'Un mecánico mayor', sub: 'Engrasa una rueda. Su Magneton zumba a su lado', icon: '🔧', cond: 'quest.b02_t_renata == "testigo"', talk: [{ script: 'b02_renata_mecanico' }] },
				{ label: 'Un señor con un transistor', sub: 'Escucha la Torre Radio en un banco', icon: '📻', cond: 'quest.b02_t_renata == "testigo"', talk: [{ script: 'b02_renata_jubilado' }] },
				{ label: 'Llamar a Renata', sub: 'Ya sabes quién es el testigo', icon: '🎙️', cond: 'quest.b02_t_renata == "testigo"', new: 'flag.b02_renata_pista', talk: [{ script: 'b02_renata_elegir' }] },
			],
		},

		// ---------- Gimnasio en obras ----------
		gym_trigal: {
			name: 'Gimnasio de Trigal (en obras)', parent: 'trigal', kind: 'gym',
			bg: { type: 'gym' },
			desc: 'Andamios, sacos de cemento y un cartel enorme: «**Próximamente · Gimnasio de intercambio del Circuito Infinito**». El suelo de combate todavía no tiene líneas. Solo un círculo pintado con tiza y una cinta de la Torre Maestra atada a un andamio.\n\nAquí combatía Blanca. Ahora Blanca está en Kalos. Y quien venga, viene de Kalos.',
			descs: [{ cond: 'flag.b02_lila_trigal && !flag.b03_ruinas_hecho', text: 'Los obreros ya han pintado las líneas del campo. En una esquina, sobre un saco de cemento, alguien ha dejado una flor blanca y una nota con letra redonda: «Para Corelia, de parte de su aprendiz. Todo listo (casi)».' }],
			mapNote: 'Líder: aún no (en obras)',
			spots: [
				{ label: 'Lila', sub: 'Mide el campo con una cinta métrica', icon: '🌸', cond: GIRA + ' && !flag.b02_lila_trigal', new: 'true', talk: [{ script: 'b02_lila_trigal' }] },
				{ label: 'Lila', sub: 'Pinta las líneas del campo', icon: '🌸', cond: 'flag.b02_lila_trigal && !flag.b03_ruinas_hecho', talk: [{ script: 'b02_lila_despues' }] },
				{ label: 'Retar al líder', sub: 'No hay líder. Hay andamios', icon: '🚧', cond: '!flag.b03_ruinas_hecho', talk: [{ script: 'b02_gym_trigal_cerrado' }] },
			],
		},

		// ---------- Puerta Lemnis de Johto ----------
		puerta_trigal: {
			name: 'Puerta Lemnis de Trigal', parent: 'trigal', kind: 'building',
			bg: { type: 'plaza', landmark: 'gate' },
			desc: 'El arco de la Puerta de Johto, idéntico al de Luminalia: dos columnas de metal plateado unidas por una lemniscata. Está **apagado**. Unos técnicos de Lemnis lo rodean con pantallas portátiles.\n\nUn cartel: «Servicio suspendido temporalmente por ajustes de calibración. Disculpen las molestias. Un mundo. Una liga.»',
			descs: [{ cond: 'flag.b02_puerta_trigal', text: 'El arco de la Puerta de Johto **zumba** otra vez. La lemniscata brilla en azul y plata, y al otro lado, borrosa como a través del agua, se adivina la plaza de la Torre Prisma de Luminalia.\n\nUn técnico de Lemnis, con una tablet, comprueba los billetes. Sonríe mucho.' }],
			mapNote: 'Viaje a Kalos (Luminalia)',
			spots: [
				{ label: 'Cruzar a Kalos', sub: '{riolu} no se separa de ti ni un paso', icon: '♾️', cond: 'flag.b02_puerta_trigal', action: { go: 'luminalia_plaza' } },
				{ label: 'Un técnico de Lemnis', sub: 'Mira una pantalla con cara de no entenderla', icon: '💻', talk: [{ cond: 'flag.b02_puerta_trigal', script: 'b02_puerta_tecnico_abierta' }, { script: 'b02_puerta_tecnico' }] },
			],
		},

		// =================== RUTA 35 ===================
		ruta35: {
			name: 'Ruta 35', short: 'Ruta 35', region: 'johto', kind: 'route', map: { x: 22, y: 42 },
			bg: { type: 'route', flowers: '#e9e3d0' },
			desc: 'Al norte de Trigal, la ciudad se acaba de golpe y empieza la hierba alta. Un estanque, una caseta de vigilancia y, al fondo, las verjas verdes del **Parque Nacional**.\n\nLos Noctowl de esta ruta son famosos por ulular a la misma hora todas las noches. Últimamente, no ululan.',
			links: ['trigal', 'parque_nacional'],
			enterCond: LLEGADA,
			blockedMsg: 'Un guardia de la caseta te para: «¿De la Gira? Primero preséntese en el pabellón de Trigal, que nos han llamado tres veces preguntando por usted».',
			rumors: [
				{ text: 'En el Parque Nacional hacen un Concurso de Captura de Bichos. El premio, dicen, es una piedra que hace florecer cosas.' },
				{ text: 'Hay un árbol de Bonguri junto al estanque. Los de Azalea pagarían bien por un Bonguri Rosa.' },
			],
			route: {
				from: 'trigal', to: 'parque_nacional', length: 7, terrain: 'grass', rate: 0.22,
				tramos: {
					1: [
						{ text: 'Una caseta de vigilancia. El guardia lee el periódico: «LA GIRA, UN ÉXITO: 23 NOVATOS LLEGAN A JOHTO SIN INCIDENCIAS». Sin incidencias.' },
						{ trainer: 'r35_jacinto' },
					],
					2: [
						{ spot: { action: { gather: 'bonguri_johto' } }, label: 'Árbol de Bonguri del estanque', icon: '🌳', sub: 'Frutos de siete colores' },
						{ item: 'pinkapricorn', hidden: true },
						{ text: 'Un estanque quieto. Un Psyduck flota boca arriba, con cara de dolor de cabeza. Como siempre.' },
					],
					3: [
						{ trainer: 'r35_hilda' },
						{ item: 'fullheal' },
					],
					4: [
						{ trainer: 'r35_leandro', optional: true, label: 'Un supernecio con unos auriculares enormes. Apunta frecuencias en una libreta' },
						{ text: 'Un poste de la Torre Radio zumba bajito. Si pegas la oreja, entre la estática, se oye una música de feria muy lejana.' },
					],
					5: [
						{ item: 'ppup', hidden: true },
						{ text: 'Un Noctowl dormido en una rama, de día, con un ojo abierto. Te sigue con él hasta que te vas.' },
					],
					6: [
						{ trainer: 'r35_fausto' },
						{ item: 'ultraball' },
					],
					7: [{ text: 'Las verjas verdes del **Parque Nacional**, abiertas. Se oye una fuente, grillos y a alguien que grita «¡ese es mío!» detrás de un seto.' }],
				},
				encounters: {
					grass: [
						{ sp: 'nidorino', lv: [31, 33], w: 14 },
						{ sp: 'nidorina', lv: [31, 33], w: 14 },
						{ sp: 'yanma', lv: [31, 33], w: 16 },
						{ sp: 'loudred', lv: [31, 33], w: 8 },
						{ sp: 'drowzee', lv: [31, 33], w: 10 },
						{ sp: 'linoone', lv: [32, 34], w: 10 },
						{ sp: 'bibarel', lv: [32, 34], w: 8 },
						{ sp: 'pidgeotto', lv: [32, 34], w: 8, time: 'day' },
						{ sp: 'noctowl', lv: [33, 35], w: 12, time: 'night' },
						{ sp: 'kadabra', lv: [32, 33], w: 3 },
						{ sp: 'ditto', lv: [32, 33], w: 3 },
						{ sp: 'skwovet', lv: [31, 33], w: 7, displaced: true },
						{ sp: 'fidough', lv: [31, 33], w: 5, displaced: true },
					],
				},
			},
		},

		// =================== PARQUE NACIONAL ===================
		parque_nacional: {
			name: 'Parque Nacional', short: 'Parque', region: 'johto', kind: 'area', map: { x: 28, y: 32 },
			bg: { type: 'forest', flowers: '#f2b33d' },
			desc: 'Un parque enorme de césped cortado, setos, bancos y una fuente redonda en el centro. Familias de picnic, gente leyendo y, entre la hierba alta de los bordes, más bichos de los que nadie querría contar.\n\nUna caseta de madera anuncia: «**Concurso de Captura de Bichos** · Inscripciones aquí».',
			links: ['ruta35', 'ruta36'],
			mapNote: 'Concurso de Captura de Bichos',
			rumors: [
				{ text: 'Este año en el concurso han salido bichos que el juez no sabe puntuar. «Fuera de reglamento», dice. Y los mira mucho.' },
				{ text: 'Por el este se sale a las Rutas 36 y 37. Dicen que un árbol bloquea el camino. Un árbol que se mueve.' },
			],
			spots: [
				{ label: 'Explorar la hierba alta', sub: 'Algo zumba entre los tallos', icon: '🌾', action: { explore: 'grass' } },
				{ label: 'Concurso de Captura de Bichos', sub: 'El juez, con su silbato', icon: '🐛', new: '!flag.b02_concurso_hecho', talk: [{ script: 'b02_concurso' }] },
				{ label: 'Entrenador: Cazabichos Rubén', icon: '🦗', action: { trainer: 'pq_ruben' } },
				{ label: 'Entrenadora: Chica Moderna Lorena', icon: '🌻', action: { trainer: 'pq_lorena' } },
				{ label: 'Un chico guay junto a la fuente', sub: 'Hace flexiones. Su Heracross también', icon: '💪', action: { trainer: 'pq_adrian' } },
				{ label: 'Banco junto a la fuente', sub: 'Alguien se ha dejado algo', icon: '🪑', talk: [{ cond: '!flag.b02_banco_parque', script: 'b02_banco_parque' }, { script: 'b02_banco_parque_vacio' }] },
				{ label: 'Colmena en un roble', icon: '🍯', action: { gather: 'colmena_parque' } },
			],
			encounters: {
				grass: [
					{ sp: 'butterfree', lv: [31, 33], w: 14 },
					{ sp: 'beedrill', lv: [31, 33], w: 14 },
					{ sp: 'venonat', lv: [31, 33], w: 12 },
					{ sp: 'parasect', lv: [32, 34], w: 8 },
					{ sp: 'sunkern', lv: [31, 32], w: 10, time: 'day' },
					{ sp: 'kricketune', lv: [32, 34], w: 10, time: 'night' },
					{ sp: 'volbeat', lv: [32, 34], w: 6, time: 'night' },
					{ sp: 'illumise', lv: [32, 34], w: 6, time: 'night' },
					{ sp: 'combee', lv: [31, 33], w: 8 },
					{ sp: 'pidgeotto', lv: [32, 34], w: 8 },
					{ sp: 'scyther', lv: [33, 35], w: 3 },
					{ sp: 'pinsir', lv: [33, 35], w: 3 },
					{ sp: 'nymble', lv: [31, 33], w: 5, displaced: true },
					{ sp: 'dottler', lv: [32, 34], w: 4, displaced: true },
				],
			},
		},
	},

	// =====================================================================
	// PARCHES (lugares del B1)
	// =====================================================================
	patches: {
		luminalia_plaza: {
			spots: [
				{ label: 'Cruzar a Johto (Trigal)', sub: '{riolu} te agarra de la mano antes de que se lo pidas', icon: '♾️', cond: 'flag.b02_puerta_trigal', action: { go: 'puerta_trigal' } },
			],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Ruta 34 -----
		r34_ivan: { name: 'Iván', cls: 'Entrenador Guay', ai: 2,
			team: [{ sp: 'kirlia', lv: 33 }, { sp: 'floatzel', lv: 34 }],
			intro: 'La Gira llegó hace tres días y tiraron confeti hasta en el río. Mi Floatzel todavía escupe purpurina. ¡Combate!',
			win: 'Purpurina por todas partes. Hasta en la derrota.',
			look: { hair: 'spiky', hairColor: '#2b2b38', outfit: '#3b5bb5', outfit2: '#e9e3d0', skin: 2, mouth: 'grin' } },
		r34_marisol: { name: 'Marisol', cls: 'Pokéfan', ai: 2,
			team: [{ sp: 'granbull', lv: 34, moves: ['crunch', 'playrough', 'firefang', 'roar'] }, { sp: 'wigglytuff', lv: 33 }],
			intro: 'Dicen que a uno de la Gira se lo tragó la Puerta. ¡Ojalá me tragara a mí! Llevo tres semanas queriendo ir a Kalos.',
			win: 'Si te encuentras al que se tragó la Puerta, dile que me guarde sitio.',
			look: { hair: 'curly', hairColor: '#e98aa8', outfit: '#f2b33d', outfit2: '#e9e3d0', skin: 1, acc: 'bow', mouth: 'smile' } },
		r34_oscar: { name: 'Óscar', cls: 'Pescador', ai: 2,
			team: [{ sp: 'kingler', lv: 34 }, { sp: 'tentacruel', lv: 34 }],
			intro: 'La Guardería tiene la mitad de los huevos sin saber de qué son. Del otro lado de la Puerta, dicen. ¡A mí que me pesquen eso!',
			win: 'Ni pesco ni gano. Hoy no es mi día. Ni mi mes.',
			look: { hair: 'cap', hairColor: '#5a3a26', outfit: '#3f8a4f', outfit2: '#d8a85a', skin: 3, acc: 'beard', mouth: 'flat' } },
		r34_ramiro: { name: 'Rogelio', cls: 'Policía', ai: 2,
			team: [{ sp: 'arcanine', lv: 35 }, { sp: 'electabuzz', lv: 34, moves: ['thunderpunch', 'lowkick', 'swift', 'screech'] }],
			intro: 'Patrullo esta ruta desde que los Rocket «volvieron». Volvieron debiendo dinero a medio Azalea, eso sí. ¿Documentación? Bah, combate.',
			win: 'En orden. Puede circular. Y si ve a alguien de negro con una R, no le preste nada.',
			look: { hair: 'cap', hairColor: '#2b2b38', outfit: '#1f2e4f', outfit2: '#f2b33d', skin: 2, acc: 'mustache', eyesStyle: 'sharp', mouth: 'flat' } },
		r34_celia: { name: 'Celia', cls: 'Chica Moderna', ai: 2,
			team: [{ sp: 'stantler', lv: 35 }, { sp: 'miltank', lv: 36, moves: ['stomp', 'rollout', 'milkdrink', 'bodyslam'] }],
			intro: 'Mi prima trabaja en el Tren Magnético. Dice que el de las 23:05 tiene mala suerte: se ha averiado seis veces este mes, siempre con los mismos cinco pasajeros dentro. ¿A que da yuyu?',
			win: 'Mi prima dice que uno de los cinco lleva un maletín y no se lo quita ni para dormir. Yo no pregunto.',
			look: { hair: 'ponytail', hairColor: '#d8a85a', outfit: '#e85a6a', outfit2: '#ffffff', skin: 0, acc: 'flower', mouth: 'smile' } },

		// ----- Ruta 35 -----
		r35_jacinto: { name: 'Jacinto', cls: 'Cazabichos', ai: 2,
			team: [{ sp: 'yanma', lv: 33, moves: ['wingattack', 'quickattack', 'ancientpower', 'uproar'] }, { sp: 'ledian', lv: 34 }],
			intro: '¡Este año en el concurso del parque salen bichos que no vienen en ningún libro! ¡Yo los quiero todos! Empezando por los tuyos.',
			win: 'Vale. Los tuyos no. Los del libro tampoco. Me quedan los raros.',
			look: { hair: 'cap', hairColor: '#8a5a2f', outfit: '#5aa36b', outfit2: '#f2b33d', skin: 1, mouth: 'open' } },
		r35_hilda: { name: 'Hilda', cls: 'Pokéfan', ai: 2,
			team: [{ sp: 'girafarig', lv: 35, moves: ['psybeam', 'crunch', 'stomp', 'agility'] }, { sp: 'dunsparce', lv: 34, moves: ['drillrun', 'glare', 'ancientpower', 'roost'] }],
			intro: 'En la Gira regalaban caramelos. Mi Dunsparce se comió uno y estuvo dos días mirándome fijo. Sin parpadear. Muy cariñoso. Demasiado.',
			win: 'Ya parpadea. Creo. Lo vigilo de noche.',
			look: { hair: 'bun', hairColor: '#cfd6e2', outfit: '#8c6cd0', outfit2: '#e9e3d0', skin: 2, acc: 'glasses', mouth: 'smile' } },
		r35_leandro: { name: 'Lisandro', cls: 'Supernecio', ai: 2,
			team: [{ sp: 'magneton', lv: 35, moves: ['spark', 'flashcannon', 'thunderwave', 'triattack'] }, { sp: 'electrode', lv: 34 }],
			intro: 'Cada noche, a las 2:17, sale un pitido en la frecuencia de la Torre Radio que no es de ninguna emisora. Lo tengo grabado cuarenta veces. ¿Quieres oírlo? Primero, combate.',
			win: 'Treinta y nueve veces es a las 2:17. Una fue a las 2:16. Esa me quita el sueño.',
			look: { hair: 'curly', hairColor: '#5a3a26', outfit: '#e9e3d0', outfit2: '#3b5bb5', skin: 1, acc: 'glasses headphones', mouth: 'open' } },
		r35_fausto: { name: 'Fausto', cls: 'Ornitólogo', ai: 2,
			team: [{ sp: 'pidgeot', lv: 35 }, { sp: 'noctowl', lv: 35, moves: ['airslash', 'hypnosis', 'extrasensory', 'reflect'] }],
			intro: 'Los Noctowl de esta ruta llevan tres noches sin ulular. Como si alguien les hubiera parado el reloj. Un Noctowl sin reloj es un Noctowl perdido.',
			win: 'Si oyes ulular esta noche, avísame. Aunque sea mentira.',
			look: { hair: 'short', hairColor: '#8a8a8a', outfit: '#8a7a5a', outfit2: '#3f8a4f', skin: 2, acc: 'hat', mouth: 'flat' } },

		// ----- Parque Nacional -----
		pq_ruben: { name: 'Rubén', cls: 'Cazabichos', ai: 2,
			team: [{ sp: 'scyther', lv: 35, moves: ['xscissor', 'wingattack', 'quickattack', 'slash'] }, { sp: 'beedrill', lv: 34, moves: ['poisonjab', 'fellstinger', 'pinmissile', 'agility'] }],
			intro: 'Gané el concurso tres años seguidos. Este año un bicho morado con patas de saltamontes me dio una patada y me robó la red. ¡No lo pienso superar!',
			win: 'Tampoco esto lo pienso superar.',
			look: { hair: 'cap', hairColor: '#2b2b38', outfit: '#f2b33d', outfit2: '#5aa36b', skin: 3, mouth: 'grin' } },
		pq_lorena: { name: 'Lorena', cls: 'Chica Moderna', ai: 2,
			team: [{ sp: 'sunflora', lv: 35, moves: ['razorleaf', 'petaldance', 'sunnyday', 'bulletseed'] }, { sp: 'butterfree', lv: 34, moves: ['psybeam', 'airslash', 'sleeppowder', 'bugbuzz'] }],
			intro: 'Vengo a leer al parque y siempre acabo combatiendo. Es como ir a la biblioteca y acabar en un concierto.',
			win: 'Vuelvo a mi libro. Va de una chica que viaja por puertas mágicas. Muy realista.',
			look: { hair: 'long', hairColor: '#7a4fb0', outfit: '#f2b33d', outfit2: '#ffffff', skin: 0, acc: 'flower', mouth: 'smile' } },
		pq_adrian: { name: 'Adrián', cls: 'Entrenador Guay', ai: 2,
			team: [{ sp: 'heracross', lv: 36, moves: ['hornattack', 'brickbreak', 'pinmissile', 'bulkup'] }, { sp: 'hitmontop', lv: 35, moves: ['triplekick', 'rapidspin', 'suckerpunch', 'quickattack'] }],
			intro: 'Cien flexiones al día. Heracross hace doscientas. Hoy hacemos combate y luego flexiones. O al revés.',
			win: 'Vale. Hoy flexiones dobles. Las tuyas también, si quieres.',
			look: { hair: 'short', hairColor: '#d8a85a', outfit: '#c4473a', outfit2: '#2b2b38', skin: 4, acc: 'bandana', mouth: 'grin' } },

		// ----- Azotea del Centro Comercial (entrenamiento) -----
		azotea_1: { name: 'Baltasar', cls: 'Malabarista', ai: 2,
			team: [{ sp: 'kadabra', lv: 35 }, { sp: 'electrode', lv: 34 }],
			intro: '¡Tres Poké Balls en el aire! ¡Cuatro! ¡Cin… ¡Ay! Bueno, combate con las que han caído.',
			win: 'Se me cae todo. Las bolas, el combate, la dignidad.' },
		azotea_2: { name: 'Maribel', cls: 'Camarera', ai: 2,
			team: [{ sp: 'miltank', lv: 35 }, { sp: 'furret', lv: 34 }],
			intro: 'Me escapo del patio de comidas diez minutos. Si me llaman, estoy en el baño. ¡Venga, que se enfría la sopa!',
			win: 'Vuelvo a la sopa. La sopa no me gana nunca.' },
		azotea_3: { name: 'Jaime', cls: 'Karateka', ai: 2,
			team: [{ sp: 'machoke', lv: 36 }, { sp: 'hitmontop', lv: 35 }],
			intro: 'Entreno junto al Miltank hinchable. Si me caigo, caigo en blandito. Es una filosofía.',
			win: 'Hoy caigo en blandito. Mañana, también.' },

		// ----- Trigal: recluta del gimnasio en obras -----
		recluta_trigal: { name: 'Recluta', cls: 'Team Rocket', npc: 'recluta_rocket', ai: 2,
			team: [{ sp: 'golbat', lv: 35, moves: ['bite', 'confuseray', 'poisonfang', 'airslash'] }, { sp: 'raticate', lv: 35, moves: ['superfang', 'crunch', 'hyperfang', 'suckerpunch'] }],
			intro: '¿Y tú quién eres? ¡El jefe dice que un gimnasio vacío es un almacén con buena ventilación! ¡Fuera!',
			win: 'Vale, vale. No es buen almacén. Hay demasiada gente que pega fuerte.' },

		// ----- Rivales -----
		rhi_3: { name: 'Rhi', cls: 'Rival', npc: 'rhi', ai: 3, iv: 25, reward: 2400,
			team: [
				{ sp: 'sirfetchd', lv: 34, moves: ['leafblade', 'brutalswing', 'detect', 'rocksmash'], ability: 'steadfast', item: 'leek', nature: 'adamant', iv: 25 },
				{ sp: 'corvisquire', lv: 35, moves: ['drillpeck', 'scaryface', 'payback', 'swagger'], ability: 'keeneye', nature: 'impish', iv: 25 },
				{ sp: 'toxtricity', lv: 34, moves: ['shockwave', 'poisonjab', 'venoshock', 'nobleroar'], ability: 'plus', nature: 'modest', iv: 25 },
				{ sp: 'cinderace', lv: 37, moves: ['flamecharge', 'doublekick', 'zenheadbutt', 'quickattack'], ability: 'blaze', item: 'oranberry', nature: 'jolly', iv: 26 },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Saque de centro! ¡Tres días calentando en la banda, {jugador}! ¡Cinderace, a la delantera!',
			win: 'Fuera de juego… No. No hay fuera de juego. Otra vez limpio. Otra vez tú.',
			lose: '¡GOLAZO! ¡Por la escuadra! ¡Eso te pasa por llegar tarde al partido!' },
		bastien_3: { name: 'Bastien', cls: 'Rival', npc: 'bastien', ai: 3, iv: 25, reward: 2400,
			team: [
				{ sp: 'talonflame', lv: 35, moves: ['aerialace', 'flamecharge', 'steelwing', 'roost'], ability: 'flamebody', nature: 'jolly', iv: 25 },
				{ sp: 'pyroar', lv: 35, moves: ['incinerate', 'echoedvoice', 'darkpulse', 'nobleroar'], ability: 'unnerve', nature: 'modest', iv: 25 },
				{ sp: 'doublade', lv: 35, moves: ['ironhead', 'nightslash', 'shadowsneak', 'swordsdance'], ability: 'noguard', nature: 'adamant', iv: 25 },
				{ sp: 'greninja', lv: 38, moves: ['waterpulse', 'nightslash', 'aerialace', 'extrasensory'], ability: 'torrent', item: 'sitrusberry', nature: 'hasty', iv: 28 },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: 'Esto no viene en ninguna cláusula. ¡Greninja, al final! ¡Talonflame, abre tú!',
			win: 'Ya está. Ya no te debo un combate. Solo todo lo demás.',
			lose: 'Lo siento. No, no lo siento. Me hacía falta.' },
	},

	// =====================================================================
	// NPCS (genéricos y el testigo)
	// =====================================================================
	npcs: {
		guarderia_abuelo: { name: 'Abuelo de la Guardería', generic: true, look: { hair: 'bald', hairColor: '#cfd6e2', outfit: '#8a7a5a', outfit2: '#e9e3d0', skin: 2, acc: 'glasses mustache', eyesStyle: 'sleepy', mouth: 'smile' } },
		florista: { name: 'Florista', generic: true, look: { hair: 'braids', hairColor: '#8a5a2f', outfit: '#5aa36b', outfit2: '#f3e6c4', skin: 1, acc: 'flower freckles', eyesStyle: 'happy', mouth: 'open' } },
		juez_bichos: { name: 'Juez del concurso', generic: true, look: { hair: 'cap', hairColor: '#5a3a26', outfit: '#3f8a4f', outfit2: '#f2b33d', skin: 3, acc: 'mustache', mouth: 'flat' } },
		revisora: { name: 'Revisora', generic: true, look: { hair: 'bun', hairColor: '#2b2b38', outfit: '#1f2e4f', outfit2: '#e9e3d0', skin: 1, acc: 'hat', mouth: 'smile' } },
		jubilado_radio: { name: 'Señor del transistor', generic: true, look: { hair: 'short', hairColor: '#e9e8e0', outfit: '#8a7a5a', outfit2: '#4a4f6a', skin: 2, acc: 'glasses', eyesStyle: 'sleepy', mouth: 'flat' } },
		tecnico_lemnis: { name: 'Técnico de Lemnis', generic: true, look: { hair: 'short', hairColor: '#3a3a4a', outfit: '#1f2e4f', outfit2: '#cfd6e2', skin: 1, acc: 'lemnis glasses', mouth: 'smile' } },
		damaso: { name: 'Dámaso Ferrán', title: 'Mecánico jefe del Tren Magnético', look: { hair: 'short', hairColor: '#cfd6e2', outfit: '#3b5bb5', outfit2: '#8a7a5a', skin: 2, acc: 'beard beanie', hatColor: '#c4733a', eyesStyle: 'tired', mouth: 'flat', bg: '#4a4f6a', head: 'square', age: 'old', brows: 'thick', nose: 'hook', collar: 'overalls', strap: '#5a6a8a', build: 'broad' } },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		cartaabogados: { name: 'Carta de los abogados de Lemnis', pocket: 'key', desc: 'Un sobre grueso, azul y plata, con el sello de «Lemnis · Departamento Jurídico». Lleva tres días esperándote en el pabellón. Pesa más de lo que debería pesar un papel.',
			read: '**Lemnis Holding · Departamento Jurídico**\nRef.: LJ/KAL/0441-B · «Incidente de la Cueva Brillante»\n\nEstimad{o|a|e} {jugador}:\n\nNos dirigimos a usted en relación con las declaraciones que efectuó ante la Policía Internacional sobre «cajas», «logotipos» y «trajes rojos» (en adelante, «las Manifestaciones»).\n\n**1.** Lemnis Holding no fabrica, distribuye ni almacena cajas. Lemnis Holding *contrata* a empresas que almacenan cajas. La diferencia es sustancial.\n\n**2.** Se le recuerda que el logotipo de Lemnis es una marca registrada. Su uso en Manifestaciones, dibujos, gestos con las manos o silbidos queda sujeto a autorización previa.\n\n**3.** Se le recuerda, asimismo, que la palabra «infinito» no es propiedad de Lemnis Holding. Todavía.\n\n**4.** Le invitamos cordialmente a rectificar. Le invitamos, con menos cordialidad, a no hacerlo en público.\n\n**5.** Esta carta no constituye una amenaza. Si la ha percibido como tal, le rogamos que lo comunique por escrito a este departamento, que la archivará.\n\nReciba un cordial saludo,\n\n*Departamento Jurídico* · «Un mundo. Una liga.»\n\nP. D.: Le deseamos una feliz estancia en Johto, donde sabemos que se encuentra.' },
		folletogira: { name: 'Folleto de la Gira', pocket: 'key', desc: 'Un folleto satinado, azul y plata. Huele a imprenta y, un poco, a caramelo.',
			read: '**PRIMERA GIRA INTERREGIONAL · JOHTO**\n*Un mundo. Una liga.*\n\n**Día 1:** Llegada por la Puerta Lemnis de Trigal. Ceremonia y photocall.\n**Día 2:** Visita a la Torre Radio. Entrevista en *Noches de Johto*.\n**Día 3:** Jornada libre. Exhibición en el Centro Comercial.\n**Día 4 en adelante:** Ciudad Iris y el Teatro de Danza. Ruta libre por Johto.\n\n**En tu bolsa de bienvenida:** acreditación, este folleto y unos deliciosos **Caramelos Lazo**, cortesía de Lemnis. ¡Estrechan el vínculo con tu Pokémon al instante!\n\n*Letra pequeña, muy pequeña:* «Producto en fase de evaluación. Lemnis Holding agradece su colaboración en la recogida de datos de bienestar. No apto para Pokémon de tipo Planta, Bicho o Hada en periodo de muda.»' },
		fotogira: { name: 'Foto oficial de la Gira', pocket: 'key', art: 'foto_gira', desc: 'La foto de grupo de los 23 novatos de la Gira delante de la Puerta de Trigal, hace tres días. Tú no estabas. Alguien de Lemnis te ha añadido después, en una esquina. Se nota. Mucho.' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		bonguri_johto: {
			name: 'Árbol de Bonguri', icon: '🌳', hours: 20, picks: [1, 2],
			text: 'Tiras de una rama. Caen unos frutos redondos y duros como nueces. En Azalea saben qué hacer con ellos.',
			wait: 'El árbol está pelado. Los Bonguri tardan en volver a salir.',
			table: [...BONGURIS, { id: 'oranberry', w: 10, n: [1, 2] }],
		},
		macetas_trigal: {
			name: 'Macetas del escaparate', icon: '🪴', hours: 20, picks: [1, 2],
			text: 'La florista pequeña te deja rebuscar entre las macetas «que ya no se venden». Siempre sale algo.',
			wait: '«Mañana más, que hoy ya has rebuscado», dice la florista pequeña.',
			table: [
				{ id: 'growthmulch', w: 16, n: [1, 2] }, { id: 'dampmulch', w: 16, n: [1, 2] }, { id: 'stablemulch', w: 12, n: [1, 2] },
				{ id: 'miracleseed', w: 4, n: [1, 1] }, { id: 'absorbbulb', w: 6, n: [1, 1] }, { id: 'nanabberry', w: 12, n: [1, 2] },
				{ id: 'pinapberry', w: 12, n: [1, 2] }, { id: 'leafstone', w: 2, n: [1, 1] },
			],
		},
		colmena_parque: {
			name: 'Colmena en un roble', icon: '🍯', hours: 22, picks: [1, 2],
			text: 'Los Combee están de mal humor, pero distraídos con las flores. Metes la mano rápido.',
			wait: 'Los Combee te miran. Todos. Mejor otro día.',
			table: [{ id: 'honey', w: 30, n: [1, 1] }, { id: 'silverpowder', w: 6, n: [1, 1] }, { id: 'sitrusberry', w: 16, n: [1, 1] }, { id: 'pechaberry', w: 16, n: [1, 2] }, { id: 'leppaberry', w: 10, n: [1, 1] }],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		gira_trigal: {
			name: 'La Gira en Trigal', npc: 'sera', type: 'Normal', rec: 37,
			cond: 'flag.b02_trigal_llegada',
			info: [
				{ text: 'Ponte al día con la Gira en **Ciudad Trigal**. Rotom lleva la cuenta de lo pendiente.' },
				{ cond: 'flag.b02_pabellon', text: 'Tienes la acreditación. Te faltan algunas conversaciones.' },
				{ cond: 'flag.b02_trigal_hecho', text: '✔ La Gira sale hacia **Ciudad Iris**.' },
			],
		},
		azotea_trigal: {
			name: 'Azotea del Centro Comercial', type: 'Normal', rec: 36,
			cond: 'visited("cc_trigal")',
			info: [
				{ text: 'Zona de entrenamiento con tope de **nivel 38**. Entrenadores de nivel 34 a 36 que repiten.' },
				{ text: 'Se cierra cuando tu equipo ya llega al tope.' },
			],
		},
		concurso_bichos: {
			name: 'Concurso de Captura de Bichos', npc: 'juez_bichos', type: 'Bug', rec: 34,
			cond: 'visited("parque_nacional")',
			info: [
				{ text: 'Elige una zona del Parque y captura un Pokémon de tipo Bicho. El juez puntúa la especie.' },
				{ cond: 'visited("parque_nacional")', text: 'Los más valiosos suelen esconderse en la hierba más alta. Y pegan fuerte.' },
				{ cond: 'flag.b02_concurso_hecho', text: '✔ Ya tienes premio. Puedes volver a participar por diversión.' },
			],
		},
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== RUTA 34 ===================
		b02_r34_entrada: [
			{ text: 'El Rotom sale del bolsillo, da dos vueltas sobre tu cabeza y se para en seco.' },
			{ say: 'rotom', text: '¡Bzzt! Hora puesta en hora. Fecha puesta en fecha. Y… ¿tres días? Aquí dice que han pasado tres días desde la ceremonia. Yo cuento una noche. ¡Una! A lo mejor estoy roto. ¿Estoy roto? No contestes.' },
			{ text: '{riolu} no dice nada. Mira hacia atrás, hacia la niebla del Encinar, un rato largo. Luego echa a andar a tu lado.', cond: RL },
			{ say: 'rotom', text: 'La Gira estaba en Trigal. Está. Estará. ¡Vamos, que llegamos tarde! Bueno. Más tarde.' },
		],
		b02_guarderia: [
			{ set: { 'flag.b02_guarderia': true } },
			{ text: 'Un abuelo con gafas sale de la Guardería con una cesta llena de huevos. Uno tiembla. Otro está frío como el hielo. Otro brilla un poco, de color violeta.' },
			{ say: 'guarderia_abuelo', text: '¡Buenas! ¿Vienes a dejar a alguien? Mejor no, que estamos a tope. Mi mujer dice que en cuarenta años nunca habíamos tenido tanto trabajo.' },
			{ say: 'guarderia_abuelo', text: 'Desde lo de las Puertas nos traen Pokémon que no sabemos de dónde son. Y ponen huevos. Y de los huevos salen cosas que no vienen en mi libro. Mira esto: este huevo hace *tic, tac*. Un huevo. Haciendo *tic, tac*.' },
			{ say: 'guarderia_abuelo', text: 'La semana pasada vino un señor muy amable de traje azul y plata. Quería comprarnos «los huevos que salgan raros». Para estudiarlos. Le dije que aquí los huevos no se venden, se cuidan. Me dejó su tarjeta igualmente.' },
			{ text: 'Te enseña la tarjeta. «Lemnis · Programa de Bienestar Interregional». Detrás, un código escrito a mano: **N-02**.' },
			{ say: 'rotom', text: '¡Bzzt! N-02. Ese código ya lo he visto. En unas etiquetas, en Kalos. Sigue sin estar en mi base de datos. Lo apunto otra vez.' },
			{ say: 'guarderia_abuelo', text: 'Si pasas por aquí con algún Pokémon raro, cuéntamelo. Me gusta aprender. A mi edad ya no hay tantas cosas nuevas. Bueno: ahora hay demasiadas.' },
			{ rep: { johto: 1 } },
		],
		b02_guarderia_despues: [
			{ say: 'guarderia_abuelo', text: 'El huevo del *tic, tac* sigue haciendo *tic, tac*. Le he puesto al lado un reloj de verdad, por si se siente solo. Ahora van a la vez. Me da un poco de miedo.' },
		],

		// =================== LLEGADA A TRIGAL ===================
		b02_trigal_llegada: [
			{ set: { 'flag.b02_trigal_llegada': true } },
			{ quest: 'b02_m4', stage: 'trigal' },
			{ text: 'Trigal te recibe como recibe a todo el mundo: sin mirarte. Tráfico, pantallas, un Tren Magnético que pasa silbando por encima de las cabezas.' },
			{ text: 'En todas las pantallas, la misma imagen: veintitrés novatos saliendo por la Puerta Lemnis, saludando, entre confeti. «**¡La Gira ya está aquí!**» Debajo, la fecha. Hace tres días.' },
			{ say: 'rotom', text: '¡Bzzt! Ahí está Rhi. Y Bastien. Y esa chica de la bufanda que lloraba en la cola de Luminalia. Y… tú no. Tú no estás. Qué raro. Bueno, no tan raro: no estabas.' },
			{ text: '{riolu} se pega a tu pierna. Tanta gente, tanto ruido. Te mira, como preguntando si esto es normal.', cond: RL },
			{ say: 'rotom', text: 'El pabellón de la Gira está en la plaza. ¡La carpa de las banderas! Deberíamos presentarnos. Seguro que están preocupadísimos.' },
		],

		// =================== PABELLÓN DE LA GIRA ===================
		b02_pabellon: [
			{ set: { 'flag.b02_pabellon': true } },
			{ text: 'En la mesa de acreditación, un organizador joven con auriculares y la lemniscata en la solapa teclea a toda velocidad. Levanta la vista. Te reconoce al instante.' },
			{ say: 'empleado_gira', text: '¡Ah, {el|la|le} del Encinar! Por fin. Le estábamos esperando.' },
			{ text: 'Lo dice con la misma sonrisa con la que diría «buenos días». Teclea algo. Una impresora escupe una acreditación con tu foto.' },
			{ choice: [
				{ text: '«¿Cómo sabes que vengo del Encinar?»', then: [
					{ say: 'empleado_gira', text: '¿Mmm? Lo pone aquí. —Señala la pantalla, que no te deja ver—. «Incidencia de trayecto: Encinar». Lo tenemos todo registrado. Para eso estamos.' },
						{ text: 'Nadie en Azalea te pidió el nombre. Nadie te vio salir del bosque, salvo una vecina con una escoba.', cond: 'flag.b02_furgoneta_escondido' },
					{ say: 'empleado_gira', text: 'Bueno, lo de los tres días no. Eso sale en blanco. Será un fallo del sistema. ¡Los sistemas! —Se ríe. Solo él.' },
				] },
				{ text: '«He estado tres días perdido. ¿No me buscaba nadie?»', then: [
					{ say: 'empleado_gira', text: '¡Claro que sí! Teníamos una incidencia abierta. Prioridad media. Bueno, baja. Pero abierta.' },
					{ say: 'empleado_gira', text: 'Y luego, esta mañana, el sistema nos ha dicho «Encinar», y aquí está usted. ¿Ve? Todo funciona.' },
				] },
				{ text: 'No decir nada. Coger la acreditación.', then: [
					{ say: 'empleado_gira', text: 'Muy bien. Eficiente. Me gusta. —Te guiña un ojo—. No como el de Galar, que ha pedido cuatro acreditaciones porque las pierde jugando al fútbol.' },
				] },
			] },
			{ say: 'empleado_gira', text: 'Y esto es suyo: la bolsa de bienvenida. Con todo lo que se perdió. Bueno, lo que cabe en una bolsa.' },
			{ cutscene: { bg: { type: 'indoor', wall: '#1f2e4f', floor: '#cfd6e2' }, frames: [
				{ text: 'Una bolsa de tela azul y plata, con la lemniscata bordada. Dentro: una acreditación con cordón, un folleto satinado y una cajita.' },
				{ item: 'folletogira', text: 'El folleto de la Gira. Día 1, día 2, día 3. Todo lo que hicieron sin ti, con fotos.' },
				{ item: 'caramelolazo', fx: 'glow', text: 'En la cajita, tres caramelos envueltos en papel azul y plata. Brillan un poco bajo los focos. Huelen dulce. Demasiado dulce.' },
				{ item: 'fotogira', text: 'Y una foto de grupo, impresa en papel grueso. Veintitrés novatos delante de la Puerta de Trigal. Y, en una esquina, tú. Recortad{o|a|e}. Pegad{o|a|e}. Con la luz del otro lado.' },
			] } },
			{ give: 'folletogira' },
			{ give: 'caramelolazo', n: 3 },
			{ give: 'fotogira' },
			{ if: RL, then: [
				{ text: 'En cuanto abres la cajita, {riolu} gruñe. Un gruñido bajo, de pecho, que no le habías oído desde la Ruta 5. Tiene el pelo del cuello erizado. No aparta los ojos de los caramelos.' },
			], else: [
				{ text: 'En cuanto abres la cajita, tu equipo se revuelve dentro de las Poké Balls. Una tiembla.' },
			] },
			{ say: 'rotom', text: '¡Bzzt! Eh… mejor no, ¿sí? Mejor no se los des. No sé por qué. Mis sensores no dicen nada. Pero mejor no, ¿sí?' },
			{ say: 'empleado_gira', text: 'Ah, a algunos les pasa al principio. Luego se acostumbran. ¡Estrechan el vínculo al instante! Lo pone en la caja.' },
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ say: 'empleado_gira', text: '¡Ah! Y esto también es para usted. Llegó por mensajero hace tres días. Del departamento jurídico. —Te da un sobre gordo con el sello azul y plata—. Lo he guardado yo personalmente. No lo he leído. Bueno, el principio.' },
				{ cutscene: { bg: { type: 'indoor', wall: '#1f2e4f', floor: '#cfd6e2' }, frames: [
					{ item: 'cartaabogados', text: 'Un sobre grueso, azul y plata. «Lemnis Holding · Departamento Jurídico». Tu nombre, escrito a máquina. Sin errores. Ni uno.' },
					{ fx: 'zoom', text: 'Al darle la vuelta, en el remite, una dirección de Kalos. Y, debajo, en letra más pequeña: «Copia: Trigal, Johto». Lo enviaron aquí antes de que nadie supiera que vendrías aquí.' },
				] } },
				{ give: 'cartaabogados' },
			] },
			{ say: 'empleado_gira', text: 'La anfitriona quiere verle. Está ahí, junto al escenario. Y el resto de novatos andan por la ciudad. ¡Bienvenid{o|a|e} a la Gira, por fin!' },
			{ quest: 'b02_m4', stage: 'gira' },
			{ quest: 'b02_t_rhi', stage: 'trigal' },
			{ quest: 'b02_t_bastien', stage: 'trigal' },
			{ diary: '¡Hoy por fin llegamos a Ciudad Trigal! Íbamos un poquito tarde, pero en la Gira nos estaban esperando y nos lo tenían todo preparado: acreditación, folleto y una bolsa de regalo con caramelos azules. Trigal es enorme y hace mucho ruido. ¡Me encanta! ¡Bzzt!', cond: 'flag.b01_diario' },
		],
		b02_pabellon_despues: [
			{ say: 'empleado_gira', text: '¿Todo bien? Si necesita otra acreditación, pídamela. Al de Galar ya le he hecho cuatro.' },
			{ if: 'has("caramelolazo")', then: [{ say: 'empleado_gira', text: '¿Y los caramelos? ¿Ya los ha probado su {riolu}? A los Lucario les encantan, según el estudio. Bueno, según el folleto.' }] },
		],
		b02_photocall: [
			{ text: 'El photocall es una pared azul con la lemniscata repetida cientos de veces. En el centro, ampliada, la foto oficial de la Gira: veintitrés novatos sonrientes delante de la Puerta.' },
			{ text: 'En la esquina derecha estás tú. O alguien que se te parece. Te han recortado de la foto de tu acreditación y pegado encima de un seto. Tienes la cabeza un poco grande. La luz te viene de la izquierda; a todos los demás, de la derecha.' },
			{ if: RL, then: [{ text: 'A {riolu} no lo han puesto. Él mira la foto, luego te mira a ti, y suelta un resoplido que suena exactamente a una risa.' }] },
			{ say: 'rotom', text: '¡Bzzt! Sales guapísim{o|a|e}. Bueno. Sales. Que ya es algo.' },
		],

		// =================== SERAFINA, ANFITRIONA ===================
		b02_sera_trigal: [
			{ set: { 'flag.b02_sera_trigal': true } },
			{ text: 'Junto al escenario, Serafina Lemnis atiende a tres personas a la vez sin mirar a ninguna. Traje azul medianoche, guantes blancos. Cuando te ve, despide a los tres con un gesto y te espera.' },
			{ say: 'sera', text: '{jugador}. Bienvenid{o|a|e} a Johto. Con tres días de retraso, que en nuestro sector es casi puntualidad.' },
			{ if: 'flag.b01_trato_sera', then: [
				{ text: 'Mira alrededor. Nadie escucha. Baja la voz, solo un poco.' },
				{ say: 'sera', text: '¿Estás bien?' },
				{ text: 'Lo ha dicho de tú. Se da cuenta un segundo después. No lo corrige.' },
				{ say: 'sera', text: 'Tres días sin una sola señal. Ni del Holomisor ni de tu Rotom. El sistema te dio por… —Se detiene—. No importa lo que diga el sistema. Estás aquí.' },
				{ choice: [
					{ text: '«Estoy bien. ¿Y tú? Pareces cansada.»', then: [
						{ af: { sera: 2 } },
						{ say: 'sera', text: 'Organizar una Gira con veintitrés novatos y una Puerta que pierde a uno es… educativo. —Casi sonríe—. Gracias por preguntar. Nadie lo hace.' },
					] },
					{ text: '«Alguien desvió la Puerta. No fue un fallo.»', then: [
						{ af: { sera: 1 } },
						{ say: 'sera', text: 'Eso es una acusación seria. —Una pausa—. Y es exactamente lo que yo pensaría. No lo digas en voz alta aquí. Las carpas tienen las paredes muy finas.' },
					] },
				] },
				{ say: 'sera', text: 'Y ya que estás aquí: el encargo. Lo que se llevaron de la Central de Kalos.' },
				{ say: 'sera', text: 'Tengo una pista. Está en Johto. Llegó antes que nosotros, por una ruta que no es la nuestra. Y va hacia el norte. **Ciudad Iris**, si mis fuentes no se equivocan. No suelen.' },
				{ say: 'sera', text: 'No te pido que lo recuperes a la fuerza. Te pido que me digas quién lo tiene. Antes de que lo sepa mi madre. —Se ajusta un guante—. Por razones que prefiero no explicar.' },
				{ quest: 'b02_t_sera', stage: 'fragmento' },
				{ intel: { npc: 'sera', text: 'En privado, en Trigal, te habló de tú. El fragmento robado de la Central de Kalos está en Johto y va hacia Ciudad Iris. Quiere saber quién lo tiene «antes de que lo sepa su madre».' } },
			] },
			{ if: 'flag.b01_delatar', then: [
				{ say: 'sera', text: 'Por cierto. Leí la entrevista de Alexia. La de Crómlech. Tres páginas. Muy bien escrita. Usted sale muy valiente en ella.' },
				{ say: 'sera', text: 'Nuestras acciones bajaron un nueve por ciento aquella semana. Recuperamos un once la siguiente. La gente tiene miedo, y el miedo compra seguridad. —Sonríe, impecable—. Debería cobrarle comisión.' },
				{ af: { sera: -1 } },
			] },
			{ if: '!flag.b01_trato_sera', then: [
				{ say: 'sera', text: 'Le diré algo, por cortesía, ya que la Gira es mi responsabilidad y usted forma parte de ella. Aunque tarde.' },
				{ say: 'sera', text: 'Algo que se robó en Kalos ha cruzado una frontera que no debería existir. Una que no pasa por ninguna de nuestras Puertas. Si oye hablar de un trozo de metal que zumba, haga como yo: no lo toque y no lo compre.' },
				{ if: 'flag.b01_handsome', then: [{ say: 'sera', text: 'Seguro que su amigo el de los disfraces ya lo sabe. Dele recuerdos. Y dígale que el bigote postizo se le despega por la izquierda.' }] },
				{ if: SIN_CROMLECH, then: [{ say: 'sera', text: 'No me mire así. No es una amenaza. Si fuera una amenaza, la habría redactado el departamento jurídico.' }] },
				{ quest: 'b02_t_sera', stage: 'anfitriona' },
				{ intel: { npc: 'sera', text: 'Anfitriona de la Gira en Johto. Te avisó de que algo robado en Kalos «ha cruzado una frontera que no debería existir», sin pasar por las Puertas.' } },
			] },
			{ say: 'sera', text: 'Disfrute de Trigal. Es ruidosa, vulgar y encantadora. Como todas las ciudades que funcionan.' },
		],
		b02_sera_despues: [
			{ if: 'flag.b01_trato_sera', then: [
				{ text: 'En voz alta:' },
					{ say: 'sera', text: '{jugador}, la Gira sale hacia Iris en cuanto estén todos. —En voz baja—: Iris. Al norte. No lo olvides.' },
			], else: [
				{ say: 'sera', text: 'La Gira sale hacia Ciudad Iris en cuanto estén todos. Usted incluid{o|a|e}. Esta vez, si es posible, por el camino previsto.' },
			] },
		],

		// =================== LEBRUN ===================
		b02_lebrun_trigal: [
			{ set: { 'flag.b02_lebrun_trigal': true } },
			{ text: 'Junto al photocall, un hombre de traje gris y bigote canoso hojea una carpeta con la paciencia de quien cobra por horas.' },
			{ if: 'flag.b01_lebrun_conocido', then: [
				{ say: 'lebrun', text: '{jugador}. Inspector Lebrun. Ya nos conocemos. Siéntese, si encuentra silla. En esta carpa no hay sillas: hay pufs.' },
			], else: [
				{ say: 'lebrun', text: 'Inspector Lebrun, Policía Internacional. El superior de Handsome. Usted es su colaborador. No se levante. Bueno, ya está de pie. No se siente.' },
				{ set: { 'flag.b01_lebrun_conocido': true } },
			] },
			{ say: 'lebrun', text: 'Expediente de trayecto. —Lee sin mirarte—. Salida: Puerta de Luminalia, ceremonia de la Gira. Llegada: Santuario del Encinar, Johto. Tiempo transcurrido: tres días, cuatro horas.' },
			{ say: 'lebrun', text: 'Registros durante ese tiempo: ninguno. Ni Centro Pokémon, ni compras, ni Rotom conectado a la red. Tres días en el Encinar sin registros.' },
			{ say: 'lebrun', text: 'Es un dato. No una acusación. Los datos me gustan porque no tienen opinión.' },
			{ choice: [
				{ text: '«¿Cómo sabe a qué hora llegué al Encinar?»', then: [
					{ say: 'lebrun', text: 'Es mi trabajo saber esas cosas. —Pasa una página—. Y el suyo, no hacer esas preguntas. Cada uno a lo suyo.' },
				] },
				{ text: '«No recuerdo esos tres días.»', then: [
					{ say: 'lebrun', text: 'Mmm. —Lo apunta—. «No recuerda». Eso también es un dato. Uno bastante cómodo, si me permite.' },
				] },
				{ text: '«¿Por qué no está buscando al que desvió la Puerta?»', then: [
					{ say: 'lebrun', text: '«Desvió». Qué verbo tan interesante. Yo lo tengo como «incidencia técnica». —Cierra la carpeta—. Cuando tenga un verbo mejor, lo cambio.' },
				] },
			] },
			{ text: 'Al irse, deja algo sobre el puf: un caramelo de menta envuelto en papel azul.' },
			{ intel: { npc: 'lebrun', text: 'En Trigal tenía tu «expediente de trayecto»: sabía la hora exacta de tu llegada al Encinar y que pasaste «tres días sin registros». Lo llama «incidencia técnica», no desvío.' } },
		],

		// =================== RHI ===================
		b02_rhi_trigal: [
			{ text: 'Pelo rojo, chaqueta con el 9, zancadas de delantera que ha visto un hueco. Rhi cruza la plaza en línea recta, apartando gente, y se te planta delante. Respira fuerte.' },
			{ say: 'rhi', text: '¿TRES DÍAS?' },
			{ text: 'Detrás de ella, a su ritmo, llega Nate, con las manos en los bolsillos y cara de no haber dormido. O de haber dormido demasiado.' },
			{ say: 'rhi', text: 'Tres días, {jugador}. La ceremonia, el photocall, la entrevista de la radio, la exhibición. ¡Todo! Y tú, ¿dónde? ¿De vacaciones en un bosque?' },
			{ say: 'rhi', text: 'No es que me importe. Que conste. Me daba igual. Solo que el partido no es lo mismo si falta el rival. Es una cuestión deportiva.' },
			{ say: 'nate', text: 'Qué flojera… Se pasó tres noches en la Torre Radio pidiendo que te buscaran. Por la radio. Con su nombre.' },
			{ say: 'rhi', text: '¡NATE!' },
			{ say: 'nate', text: '«Si alguien ve a {un|una|une} novat{o|a|e} con un {riolu} con cara de perdido, que llame a la Torre». La pusieron tres veces. Una a las cuatro de la mañana.' },
			{ say: 'rhi', text: '¡Era por la Gira! ¡Por el buen nombre de los novatos! —Está roja hasta las orejas—. Y porque me debes un partido. Eso.' },
			{ choice: [
				{ text: '«Gracias por buscarme, Rhi.»', then: [
					{ af: { rhi: 1 } },
					{ say: 'rhi', text: 'No te he buscado. Te he… localizado. Es distinto. Es táctico.' },
				] },
				{ text: '«¿A las cuatro de la mañana? ¿En serio?»', then: [
					{ af: { rhi: 2 } },
					{ say: 'rhi', text: 'A las cuatro de la mañana es cuando la gente escucha la radio de verdad. Lo sabe todo el mundo. —Te da un puñetazo flojo en el hombro—. Cállate.' },
				] },
			] },
			{ if: 'flag.b01_fennekin_rhi', then: [
				{ say: 'rhi', text: 'Y para que lo sepas: yo ya rescaté a un zorrito perdido en Kalos. No pensaba rescatar a nadie más este año. Contigo hago una excepción. Pero cuenta doble.' },
			] },
			{ say: 'rhi', text: 'Bueno. Basta de charla. Tres días calentando en la banda. Ahora, partido.' },
			{ choice: [
				{ text: '«Dame un momento en el Centro Pokémon.»', then: [
					{ say: 'rhi', text: '¿Otra vez? ¡Siempre igual! …Ve. Que luego no digas que te gané con ventaja.' },
					{ heal: 'Pasas por el Centro Pokémon. Cuando sales, Rhi da toques a una Poké Ball con el empeine, y Nate duerme sentado en un bolardo.' },
				] },
				{ text: '«Así como estoy. Vamos.»', then: [
					{ say: 'rhi', text: '¿Con el equipo a medias? Ni hablar. —Te lanza un puñado de Superpociones sin mirar—. Quiero ganarte enter{o|a|e}.' },
					{ heal: 'Curas a tu equipo con las Superpociones de Rhi. Ella espera dando toques con el pie, contando en voz baja.' },
				] },
			] },
			{ set: { 'flag.b02_rhi_combate_hecho': true } },
			{ battle: 'rhi_3', lose: 'continue',
				onWin: [
					{ af: { rhi: 6 } },
					{ text: 'Cinderace cae de rodillas. Rhi lo recoge. Aprieta la Poké Ball. Durante un segundo no dice nada; luego le brillan los ojos, pero no de pena.' },
					{ say: 'rhi', text: 'Otra vez. Me has vuelto a ganar. ¿Sabes lo que eso significa? Que todavía no he llegado. Que hay más. —Sonríe, enorme—. ¡Me encanta!' },
				],
				onLose: [
					{ af: { rhi: 1 } },
					{ say: 'rhi', text: '¡Golazo! ¡Toma! —Se para—. Eh. No pongas esa cara. Vuelve cuando quieras. Esta vez no me escondo.' },
					{ heal: true },
				] },
			{ say: 'nate', text: 'Tu {riolu} ha crecido. Tiene mejor toque que en Kalos.' },
			{ say: 'rhi', text: '¿Y yo? ¿Yo no he crecido?' },
			{ say: 'nate', text: 'Tú gritas más.' },
			{ quest: 'b02_t_rhi', stage: 'carta' },
			{ intel: { npc: 'rhi', text: 'Llegó a tiempo a Johto. Según Nate, pasó tres noches en la Torre Radio pidiendo por antena que te buscaran. Su Raboot ya es Cinderace, y su Rookidee, Corvisquire.' } },
		],
		b02_rhi_revancha: [
			{ say: 'rhi', text: '¿Vienes a por la revancha? ¡Así me gusta! Cura a los tuyos, que no gano con ventaja.' },
			{ heal: 'Rhi te pasa una bolsa de Superpociones. «Devuélvemela llena.»' },
			{ battle: 'rhi_3', lose: 'continue',
				onWin: [{ af: { rhi: 4 } }, { say: 'rhi', text: '¡Remontada! Tuya, no mía. Bueno. Algún día será mía.' }],
				onLose: [{ say: 'rhi', text: 'Dos a cero. Vuelve cuando quieras. De verdad. Me aburro.' }, { heal: true }] },
		],
		b02_rhi_carta: [
			{ set: { 'flag.b02_rhi_carta': true } },
			{ text: 'Rhi está sentada en un banco de la plaza, sola. Nate no está. Tiene un sobre en las manos, con sellos de Galar. Le da vueltas. Lo abre. Lo cierra. Lo vuelve a abrir.' },
			{ text: 'Cuando te ve, lo esconde detrás de la espalda. Demasiado tarde. Lo sabe.' },
			{ say: 'rhi', text: 'No es nada. Es de mi padre. Llegó al pabellón. Con matasellos de hace una semana: la mandó antes de que yo cruzara.' },
			{ text: 'Saca la carta. La lee otra vez, en silencio. Y durante un segundo, solo uno, se le cae la cara. Como un portero que ve el balón entrar y no ha tenido tiempo ni de moverse.' },
			{ say: 'rhi', text: 'Dice que está orgulloso.' },
			{ text: 'Silencio. El Tren Magnético pasa por encima de la plaza. Nadie mira.' },
			{ say: 'rhi', text: 'Mi padre nunca dice eso. Nunca. Ni cuando gané la liga juvenil. Ni cuando me cortaron del Desafío y me puse a entrenar sola. Él fue entrenador, ¿sabes? Bueno. Casi. Y dice que «orgullo» es una palabra para el final del partido.' },
			{ say: 'rhi', text: 'Algo pasa.' },
			{ prompt: 'Rhi mira la carta. No te mira a ti.', choice: [
				{ text: '«Lo siento mucho, Rhi. ¿Estás bien?»', then: [
					{ af: { rhi: -2 } },
					{ say: 'rhi', text: 'No me hagas eso. No me pongas voz de enfermería. —Se seca la cara con la manga, rápido—. Estoy bien. Estoy perfectamente.' },
				] },
				{ text: '«Pues llámale. Pregúntale a la cara.»', then: [
					{ af: { rhi: 3 } },
					{ say: 'rhi', text: '…A la cara. —Se ríe, corto—. Sí. Eso haría una delantera. No esperar el rebote. Ir a por él.' },
					{ say: 'rhi', text: 'Le llamaré. Cuando gane algo. O mañana. Mañana.' },
				] },
				{ text: 'Sentarte a su lado sin decir nada.', then: [
					{ af: { rhi: 3 } },
					{ text: 'Te sientas. No dices nada. Ella tampoco. Al cabo de un rato, Rhi apoya el hombro contra el tuyo, apenas, como quien se apoya en un poste. Luego se levanta de golpe.' },
				] },
			] },
			{ text: 'Rhi dobla la carta en cuatro y la guarda en el bolsillo interior de la chaqueta. El que está junto al 9.' },
			{ say: 'rhi', text: 'Si le cuentas esto a Nate, te hago un placaje. Un placaje de verdad. De los que se pitan.' },
			{ say: 'rhi', text: '…Gracias. Por no ser idiota.' },
			{ quest: 'b02_t_rhi', done: true },
			{ intel: { npc: 'rhi', text: 'Su padre, ex entrenador, le escribió que está «orgulloso». Ella dice que nunca lo dice. «Algo pasa.»' } },
		],

		// =================== BASTIEN ===================
		b02_bastien_trigal: [
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ text: 'Bastien está sentado en el borde de la fuente, con su chaqueta de Lemnis impecable y una libreta pequeña de tapas de cuero. Al verte, se levanta tan rápido que casi se cae al agua.' },
				{ say: 'bastien', text: '¡{jugador}! ¡Estás viv{o|a|e}! Estás… vale. Vale. —Respira—. Me dijeron «incidencia de trayecto». Yo creí que eso era una forma educada de decir «se lo comió la Puerta».' },
				{ say: 'bastien', text: '¿Te ha llegado la carta? ¿La de los abogados? —Haces un gesto—. Ya. A mí me llegó una igual, pero en mi carta salías tú. En la tuya salgo yo, ¿no? No, espera. No salgo. Me cubriste tan bien que no salgo ni en la carta.' },
				{ text: 'Abre la libreta. En la primera página, con letra de colegio caro, pone: «**Le debo a {jugador}:**». Y debajo, una sola raya. Un 1.' },
				{ say: 'bastien', text: 'Te debo: 1. Una grande. Dije que lo apuntaría y lo he apuntado. Es lo único que he hecho bien este mes, aparte de evolucionar a Greninja. Bueno, eso lo hizo él.' },
				{ say: 'bastien', text: 'Quiero pagártela. No sé cómo. Mi padre paga las deudas con cheques. Yo no tengo chequera. Tengo un combate.' },
			] },
			{ if: 'flag.b01_bastien_rompe', then: [
				{ text: 'Bastien está sentado en el borde de la fuente. No lleva la chaqueta de Lemnis: lleva una cazadora vieja de pana, con un codo remendado. La mochila, de su época de colegio. Le queda pequeña.' },
				{ say: 'bastien', text: '¡{jugador}! Mira quién ha salido del bosque. —Sonríe, de verdad—. Yo también he salido de un bosque, ¿sabes? Uno de abogados.' },
				{ say: 'bastien', text: 'Lemnis me ha demandado. Incumplimiento de la cláusula catorce, daños a la imagen de marca y algo de «uso indebido de una chaqueta». La chaqueta era suya. La devolví planchada.' },
				{ say: 'bastien', text: 'Sin patrocinio, sin dietas, sin hotel. Duermo en el Centro Pokémon, como en los viejos tiempos. Bueno, yo no tenía viejos tiempos así: en mi casa había mayordomo.' },
				{ say: 'bastien', text: 'Mi padre dice que vuelva, que lo arregla «con una llamada». No quiero que lo arregle. Por una vez quiero que algo se rompa y que lo haya roto yo.' },
				{ say: 'bastien', text: 'Y estoy en la Gira. Me inscribí con mis medallas, no con su logo. Lo pone en mi acreditación: «Independiente». La palabra más bonita que he leído en mi vida.' },
			] },
			{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe', then: [
				{ text: 'En la fachada del pabellón cuelga un cartel de cuatro metros: Bastien, sonriente, con la chaqueta de Lemnis y Greninja a su lado. «**El futuro tiene patrocinador.**»' },
				{ text: 'Debajo del cartel, sentado en un escalón, está el Bastien de verdad. Con la misma chaqueta. Sin la sonrisa. Mira el móvil sin desbloquearlo.' },
				{ say: 'bastien', text: 'Ah. Hola, {jugador}. Te dieron por perdid{o|a|e}. Me alegro de que no. —Lo dice mirando al suelo—. Me alegro.' },
				{ say: 'bastien', text: 'Ese soy yo. El del cartel. Me hicieron cien fotos hasta que salió una en la que sonreía bien. Dice el fotógrafo que la buena fue la noventa y ocho.' },
				{ say: 'bastien', text: 'Me han subido el patrocinio. Dicen que soy «un ejemplo de discreción». —Se ríe, sin ganas—. Es lo mejor que han dicho de mí nunca. Y lo peor.' },
				{ text: 'Durante toda la conversación, no te mira a los ojos ni una vez.' },
			] },
			{ say: 'bastien', text: 'Combate. Tú y yo. Lo necesito. Pero antes cura a los tuyos. No quiero ganar con trampa. Ya tengo bastantes trampas en el contrato.' },
			{ heal: 'Bastien te acompaña al Centro Pokémon. Mientras la enfermera atiende a tu equipo, él mira el escaparate sin ver nada.' },
			{ set: { 'flag.b02_bastien_combate_hecho': true } },
			{ battle: 'bastien_3', lose: 'continue',
				onWin: [{ text: 'Greninja se deshace en agua y vuelve a la Poké Ball. Bastien se queda mirando el sitio donde estaba.' }],
				onLose: [{ text: 'Greninja aterriza a su lado, en silencio. Bastien le pone la mano en la cabeza.' }, { heal: true }] },
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ say: 'bastien', text: 'Esto no salda la deuda. Ni un poco. —Saca un sobre del bolsillo—. Toma. No es un soborno. Mi padre dice que los sobornos son bastante más caros.' },
				{ choice: [
					{ text: 'Aceptarlo.', then: [
						{ money: 3000 },
						{ say: 'bastien', text: 'Bien. —Abre la libreta y escribe, muy serio—. «Le debo a {jugador}: 1». Debajo: «Pagado: tres mil». Y debajo: «Sigue debiendo: 1». Las cuentas son las cuentas.' },
					] },
					{ text: '«Guárdatelo. No me debes nada.»', then: [
						{ say: 'bastien', text: 'Eso es exactamente lo que diría alguien a quien le debo algo. —Escribe en la libreta—. «Le debo a {jugador}: 1. No acepta pagos.» Ahora te debo más. Enhorabuena.' },
						{ rep: { johto: 1 } },
					] },
				] },
				{ say: 'bastien', text: 'Si los abogados vuelven a escribirte, llámame. Mi familia tiene abogados más caros que los suyos. Por fin les voy a dar un uso.' },
				{ intel: { npc: 'bastien', text: 'Lleva una libreta de deudas: «Le debo a {jugador}: 1». Te ofreció pagar con dinero y con los abogados de su familia.' } },
			] },
			{ if: 'flag.b01_bastien_rompe', then: [
				{ say: 'bastien', text: 'Me ha sentado mejor que tres días de sopa del Centro Pokémon. —Se estira, y la cazadora le cruje—. No me mires así. Estoy bien. Estoy mejor que bien. Soy pobre por primera vez y me sienta de maravilla.' },
				{ choice: [
					{ text: '«Te invito a comer. Sin cláusulas.»', then: [
						{ say: 'bastien', text: '…Sin cláusulas. —Lo piensa—. Acepto, pero con una condición: lo apunto como préstamo. Algún día te invito yo. A un sitio con manteles.' },
						{ rep: { johto: 1 } },
					] },
					{ text: '«Estoy orgullos{o|a|e} de ti.»', then: [
						{ say: 'bastien', text: 'No digas eso, que me pongo a llorar en una fuente pública y salgo en las noticias. Otra vez.' },
					] },
				] },
				{ intel: { npc: 'bastien', text: 'Lemnis lo ha demandado por romper el contrato. Viaja sin patrocinio ni dinero, inscrito como «Independiente». Su padre quiere arreglarlo; él no le deja.' } },
			] },
			{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe', then: [
				{ text: 'Bastien abre la boca, como si fuera a decir algo. Algo de la Cueva Brillante. Lo ves en cómo se le tensa la mandíbula.' },
				{ say: 'bastien', text: 'Buen combate. —Se pone de pie—. Tengo una sesión de fotos a las cinco. Hay que sonreír.' },
				{ text: 'Se va hacia el pabellón. Pasa por debajo de su propio cartel sin levantar la vista.' },
				{ intel: { npc: 'bastien', text: 'Sale en los carteles de la Gira («El futuro tiene patrocinador»). Le han subido el patrocinio por «discreción». En persona está apagado y evita mirarte.' } },
			] },
			{ quest: 'b02_t_bastien', done: true },
		],
		b02_bastien_revancha: [
			{ say: 'bastien', text: '¿Otra? Vale. Pero esta vez cura a los tuyos tú, que yo ya tengo bastante con lo mío.' },
			{ heal: true },
			{ battle: 'bastien_3', lose: 'continue',
				onWin: [{ say: 'bastien', text: 'Lo apunto. En la libreta. En la columna de cosas que no me pesan.' }],
				onLose: [{ say: 'bastien', text: 'Vuelve cuando quieras. Me sienta bien.' }, { heal: true }] },
		],

		// =================== NOA ===================
		b02_noa_trigal: [
			{ set: { 'flag.b02_noa_trigal': true } },
			{ quest: 'b02_t_noa', stage: 'johto' },
			{ text: 'Detrás de la Torre Radio hay un patio de servicio con cubos de basura, un aparato de aire acondicionado que gotea y Noa Lambert, sentada en una caja, con la chaqueta de Lemnis del revés para que no se vea el logo.' },
			{ say: 'noa', text: 'Aquí no hay cámaras. Lo he comprobado. Tres veces. Bueno, cuatro. La cuarta solo para ver si me estaba volviendo loca. Creo que no.' },
			{ say: 'noa', text: 'Me alegro de que estés bien. De verdad. Cuando dijeron «incidencia», pensé… da igual lo que pensé.' },
			{ say: 'noa', text: 'Tengo que contarte una cosa. Antes de que me arrepienta.' },
			{ text: 'Saca un papel doblado muchas veces. Una impresión de pantalla, en blanco y negro, con columnas de horas y matrículas.' },
			{ say: 'noa', text: 'Lo de las etiquetas ya lo viste en Luminalia. N-02, N-02, N-02. Pensé: vale, será un almacén. Un centro en otra región. Algo aburrido con un nombre feo.' },
			{ say: 'noa', text: 'Así que miré el registro de transportes. Las furgonetas que salen del centro de procesamiento. Adónde van. Lo saqué del sistema antes de venir. No debería tenerlo. No deberías verlo.' },
			{ text: 'Recorres la columna de destinos con el dedo. Ni puertos, ni aeropuertos, ni ninguna región. Todas las filas dicen lo mismo.' },
			{ text: '«**Puerta Lemnis · Luminalia · acceso de servicio**.»' },
			{ text: 'Y en la columna de la hora: 2:10, 2:12, 2:15. Siempre de madrugada. Siempre cuando la Puerta está «apagada por mantenimiento».' },
			{ say: 'noa', text: 'Ninguno vuelve a su región, {jugador}. Ni uno. Desde que abrió el centro. Los meten por la Puerta, de noche, con la Puerta apagada. Y salen en un sitio que se llama N-02 y que no está en ningún mapa.' },
			{ say: 'noa', text: 'Una Puerta solo lleva a otra Puerta. Eso nos lo enseñaron el primer día, en la formación. Así que N-02 es una Puerta. O algo que funciona como una. Y no sale en ningún folleto.' },
			{ say: 'noa', text: 'Les he llevado cuarenta y tres Pokémon. Con mis propias manos. Les decía «te vas a casa». —Le tiembla la voz—. Les decía «te vas a casa».' },
			{ if: 'flag.b02_guarderia', then: [
				{ text: 'Le cuentas lo de la tarjeta del abuelo de la Guardería. El código escrito a mano detrás.' },
				{ say: 'noa', text: '¿En una guardería? ¿Están comprando huevos? —Se queda blanca—. Huevos. Dios mío.' },
			] },
			{ if: 'flag.b02_cetoddle_noa', then: [
				{ text: 'Noa se agacha y abre una bolsa de deporte que tenía a los pies. Dentro, entre bolsas de hielo, un Pokémon pequeño y redondo, de pelaje blanco, levanta la cabeza. Te reconoce.' },
				{ say: 'noa', text: 'Lo traje escondido. No podía dejarlo en mi piso. Si alguien de la empresa lo encuentra, lo devuelven al centro. Y del centro… ya sabes adónde.' },
				{ say: 'noa', text: 'Ya sé que la otra vez me dijiste que no. Y lo entiendo. Pero te lo vuelvo a pedir. Contigo estará a salvo. Conmigo, ya no estoy segura de que nadie lo esté.' },
				{ prompt: 'El Cetoddle te mira desde la bolsa, entre el hielo.', choice: [
					{ text: 'Aceptar al Cetoddle.', then: [
						{ pokemon: { sp: 'cetoddle', lv: 30, nature: 'adamant', ability: 'thickfat', moves: ['powdersnow', 'icefang', 'iceshard', 'takedown'], happy: 120 } },
						{ set: { 'flag.b02_cetoddle': true } },
						{ give: 'cartanoa' },
						{ say: 'noa', text: 'Gracias. —Te da también un sobre—. Lo escribí por si decías que sí. Si hubieras dicho que no, lo habría quemado. Bueno, tirado. No tengo mechero.' },
					] },
					{ text: '«Ahora no puedo. Pero no lo devuelvas. Prométemelo.»', then: [
						{ say: 'noa', text: 'Te lo prometo. —Cierra la bolsa con cuidado—. Lo cuidaré yo. Como pueda. Como he cuidado a los otros. —Se calla—. Mejor que a los otros.' },
					] },
				] },
			] },
			{ if: 'flag.b02_cetoddle', then: [
				{ say: 'noa', text: '¿Y Escarcha? Bueno, como lo llames. ¿Come bien? ¿Tiene calor? Johto es más húmedo que Kalos. Si suspira mucho, ponle una bolsa de hielo cerca. Le encanta. Bueno, le encantaba. Ya no sé lo que le encanta. Lo sabes tú.', cond: '!flag.b02_cetoddle_noa' },
			] },
			{ text: 'Por el patio de servicio pasa alguien con prisa, buscando un atajo. Bastien. Se para en seco al veros.' },
			{ say: 'noa', text: '¡Bastien! Ven. Ven un momento. —Rebusca en el bolsillo y saca algo pequeño—. Toma. Es para ti.' },
			{ if: 'flag.b01_bastien_rompe', then: [
				{ text: 'Es una insignia de hojalata, de las de mercadillo: un Froakie sonriente. Sin lemniscata. Sin logo de nada.' },
				{ say: 'noa', text: 'Como ya no llevas la chaqueta… pensé que te faltaría algo en la solapa. Por si acaso.' },
				{ say: 'bastien', text: 'Noa… Tú todavía trabajas para ellos. No deberías ni saludarme.' },
				{ say: 'noa', text: 'Ya. —Sonríe—. Por si acaso.' },
			] },
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ text: 'Es una insignia de hojalata, de las de mercadillo: un Froakie sonriente. Sin lemniscata. Sin logo de nada.' },
				{ say: 'noa', text: 'Para que la lleves debajo de la otra. La del logo. Que se vea solo si te quitas la chaqueta. Por si acaso.' },
				{ say: 'bastien', text: '¿Por si acaso qué?' },
				{ say: 'noa', text: 'Por si acaso. —No le da más explicación. Bastien se la guarda en el bolsillo de dentro, junto a la libreta.' },
			] },
			{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe', then: [
				{ text: 'Es una insignia de hojalata, de las de mercadillo: un Froakie sonriente. Sin lemniscata. Sin logo de nada.' },
				{ say: 'noa', text: 'En los carteles sales muy guapo. Pero ese no eres tú. Este sí. Por si acaso se te olvida.' },
				{ text: 'Bastien la mira mucho rato. Luego la toma, sin decir nada, y la aprieta en el puño. Se va sin despedirse. Pero se la lleva.' },
			] },
			{ say: 'noa', text: 'Si me pasa algo… no, nada. No me va a pasar nada. Soy de recursos humanos, básicamente. A los de recursos humanos no nos pasa nada.' },
			{ quest: 'b02_t_noa', stage: 'abierto' },
			{ intel: { npc: 'noa', text: 'Te enseñó el registro de transportes del centro de procesamiento de Luminalia: ningún desplazado vuelve a su región. Las furgonetas van de madrugada a la Puerta de Luminalia «apagada por mantenimiento», y de ahí a «N-02», que no está en ningún mapa. Está muy asustada. Le regaló a Bastien una insignia de hojalata sin logo, «por si acaso».' } },
		],

		// =================== LA NOCHE CON HANDSOME ===================
		b02_handsome_cita: [
			{ set: { 'flag.b02_handsome_cita': true } },
			{ text: 'Un vendedor de globos con gabardina, gafas de sol, sombrero y un bigote postizo enorme, de color castaño, que no combina con nada. Vende globos con forma de Lucario. Ninguno se ha vendido.' },
			{ say: 'handsome', as: 'Vendedor de globos', text: '¡Globos! ¡Globos de Lucario! ¿Le apetece uno, joven? —Baja la voz, mucho—. {jugador}. No mires. Mira los globos.' },
			{ text: 'Miras los globos. El bigote se le despega por la izquierda.' },
			{ say: 'handsome', as: 'Vendedor de globos', text: 'Handsome… quiero decir, este humilde vendedor, tiene algo que enseñarte. Algo que no puede enseñarse de día, ni en una plaza, ni con tanta gente mirando globos.' },
			{ say: 'handsome', as: 'Vendedor de globos', text: 'Mañana, cuando sea de noche. Hoy no: hoy me siguen. Detrás de la Torre Radio, donde están los cubos. Ven sol{o|a|e}. Bueno, con {riolu}. {riolu} no cuenta.' },
			{ text: 'Te pone un globo en la mano. En la cuerda hay atado un papelito: «Mañana. 23:00». Luego se aleja silbando, muy despacio, como hacen los vendedores de globos en las películas.' },
			{ text: 'El globo, por cierto, pierde aire. Cuando llegas a la esquina, es un Lucario muy triste.' },
		],
		b02_handsome_esperar: [
			{ text: 'Todavía es de día. El patio de detrás de la Torre Radio está lleno de repartidores, cajas y un técnico fumando a escondidas. Handsome dijo «mañana, de noche».' },
			{ choice: [
				{ text: 'Hacer tiempo hasta la noche de la cita.', then: [
					{ text: 'Decides hacer tiempo hasta la noche de la cita.' },
					{ call: 'b02_handsome_noche' },
				] },
				{ text: 'Volver más tarde.', then: [{ text: 'Mejor volver cuando sea de noche de verdad.' }] },
			] },
		],
		b02_handsome_noche: [
			{ set: { 'flag.b02_handsome_noche': true } },
			{ text: 'Pasas el día siguiente paseando por Trigal. En un puesto de la plaza te comes unos dulces de castaña, todavía calientes. Ves pasar el Tren Magnético más veces de las que puedes contar.' },
			{ text: 'A las once de la noche, detrás de la Torre Radio, el patio de servicio está a oscuras. Solo la antena, arriba, parpadea en rojo: encendido, apagado, encendido. Abajo, entre los cubos, alguien enciende una linterna pequeña y la tapa con la mano.' },
			{ text: 'Es Handsome. Sin bigote, sin sombrero, sin globos. Solo la gabardina. Tiene la cara cansada de quien lleva varias noches durmiendo poco.' },
			{ say: 'handsome', text: 'Has venido. Bien. —Mira a los lados—. No se lo he contado a nadie. Ni a Lebrun. Ni a la central. Esto lo sabemos Matière, tú y yo. Y ahora {riolu}.' },
			{ text: 'Saca de la gabardina una carpeta de plástico. Dentro, hojas impresas con letra pequeñísima, columnas de números y sellos de Lemnis por todas partes.' },
			{ say: 'handsome', text: 'Es el registro de la Puerta de Luminalia. La noche de la ceremonia. Cada salto, cada coordenada, cada milisegundo. Matière lo consiguió. No me preguntes cómo. —Una pausa—. Bueno: con un uniforme de limpieza y mucha paciencia.' },
			{ text: 'Pasa las hojas despacio. Veintidós saltos iguales: «Luminalia → Trigal. Estado: OK». Y luego el tuyo.' },
			{ cutscene: { bg: { type: 'plaza', landmark: 'gate' }, start: 'dark', frames: [
				{ text: '«Salto 23 · Destino programado: Trigal.»' },
				{ fx: 'zoom', text: '«Corrección manual a T+0,4 s. Destino modificado: Encinar (coordenadas de santuario).»' },
				{ fx: 'shake', text: '«Autorización: código **Ω-0-0-0**. Operador: —.»' },
				{ fx: 'dark', text: 'El campo de «operador» está vacío. No borrado: vacío. Como si nunca hubiera habido nadie.' },
			] } },
			{ say: 'handsome', text: 'No fue un fallo, {jugador}. Tu salto no se estropeó. Alguien lo desvió. A mano. Cuatro décimas de segundo después de que cruzaras.' },
			{ say: 'handsome', text: 'Con un código de autorización que no existe. Matière lo ha comprobado contra todos los registros de Lemnis que tenemos. Contra los de la Liga. Contra los de la Policía. Nada. Nadie tiene ese código. Y alguien lo usó.' },
			{ choice: [
				{ text: '«¿Quién querría mandarme a un bosque?»', then: [
					{ say: 'handsome', text: 'Esa es la pregunta. Handsome lleva tres noches haciéndosela.' },
				] },
				{ text: '«¿Y los tres días? ¿Dónde estuve?»', then: [
					{ say: 'handsome', text: 'El registro tampoco lo dice. Llegas al Encinar a T más cero coma cuatro. Y luego… nada. Tres días de nada. Como si el registro hubiera parpadeado.' },
				] },
				{ text: 'No decir nada.', then: [
					{ text: 'No dices nada. Handsome tampoco. La antena de la Torre parpadea tres veces más.' },
				] },
			] },
			{ say: 'handsome', text: 'Alguien quería que cayeras en ese bosque. O quería ver qué pasaba si caías.' },
			{ if: RL, then: [{ text: 'A tu lado, {riolu} ha cerrado los ojos. Las orejas, muy quietas. El aura le brilla un poco, azul, como cuando busca algo que no se ve. Luego abre los ojos y te mira. No sabe qué ha buscado. Tú tampoco.' }] },
			{ say: 'handsome', text: 'Escucha. A partir de ahora, Handsome no sabe dónde estás. Oficialmente. Si te pregunta alguien, aunque sea de la Policía, aunque sea alguien que te cae bien, tú solo estás de Gira.' },
			{ if: 'flag.b01_trato_sera', then: [
				{ say: 'handsome', text: 'Y tu amiga del Holomisor… No te digo que no te fíes. Te digo que no le enseñes esto. Por ahora.' },
			] },
			{ if: 'flag.b01_delatar', then: [
				{ say: 'handsome', text: 'Después de lo de Crómlech, eres la persona más famosa de Lemnis que no trabaja en Lemnis. Eso protege. Y también pinta una diana.' },
			] },
			{ say: 'handsome', text: 'Handsome se queda en Trigal unos días más, vendiendo globos. Nadie compra globos. Es el disfraz perfecto.' },
			{ text: 'Guarda la carpeta, apaga la linterna y se va por la esquina del patio. Durante un rato oyes sus pasos. Luego, solo la antena, arriba, encendiéndose y apagándose.' },
			{ intel: { npc: 'handsome', text: 'En el registro de la Puerta que consiguió Matière: tu salto se desvió a mano, 0,4 s después de cruzar, con un código de autorización «Ω-0-0-0» que no existe en ningún registro. El campo de operador está vacío. No se lo ha contado a nadie, ni a Lebrun.' } },
			{ intel: { npc: 'matiere', text: 'Consiguió el registro de la Puerta de Luminalia de la noche de la ceremonia (con un uniforme de limpieza).' } },
			{ diary: 'Hoy, sin novedades. Paseamos por Trigal y comimos algo dulce. ¡Bzzt!', cond: 'flag.b01_diario' },
		],

		// =================== YSOLDE ===================
		b02_ysolde_trigal: [
			{ set: { 'flag.b02_ysolde_trigal': true } },
			{ quest: 'b01_t_vencejos', done: true, cond: 'quest.b01_t_vencejos' },
			{ quest: 'b02_t_vencejos', stage: 'tejado' },
			{ text: 'En lo alto del Centro Comercial, a seis plantas de la acera, una figura con capucha gris está sentada en la cabeza del Miltank hinchable de la Gira. Con las piernas cruzadas. Como quien se sienta en un banco.' },
			{ text: 'Subes por la escalera de servicio. Cuando llegas a la azotea, ella ya te está mirando.' },
			{ say: 'ysolde', text: 'Mira quién te mira, {jugador}. Te lo dije en Crómlech. ¿Lo has hecho?', cond: 'flag.b01_enc_ysolde_3' },
			{ say: 'ysolde', as: 'Encapuchada', text: 'No te asustes. Llevo un tiempo mirándote desde arriba. Me llamo Ysolde. Y tú deberías aprender a mirar quién te mira.', cond: '!flag.b01_enc_ysolde_3' },
			{ text: 'Señala con la barbilla. En el tejado de enfrente, una cámara de seguridad nueva, con una pegatina azul y plata. En el siguiente, otra. Y otra en la antena de la Torre Radio. Todas apuntan a la plaza. Todas, ahora mismo, a ti.' },
			{ say: 'ysolde', text: 'Las pusieron hace tres días. La mañana en que no llegaste. —Se encoge de hombros—. Para la Gira, dicen. Para la seguridad de los novatos.' },
			{ say: 'ysolde', text: 'Los Vencejos tenemos un nido en Johto. Viejo. Más viejo que esta ciudad. Desde ahí vigilábamos a alguien de Lemnis mucho antes de que existiera el logo. Antes de que nadie dijera «Lemnis».' },
			{ choice: [
				{ text: '«¿A quién?»', then: [
					{ say: 'ysolde', text: 'Eso es de rango Vencejo. Yo soy Ala. —Una sonrisa breve—. Pluma, Ala, Vencejo, Cumbre. Si quieres saber lo de arriba, hay que subir.' },
				] },
				{ text: '«¿Cuánto antes?»', then: [
					{ say: 'ysolde', text: 'Lo bastante para que el que lo vigilaba entonces ya no pueda subir escaleras. Y el que lo vigila ahora, tampoco. Los relevos, en los Vencejos, duran mucho.' },
				] },
				{ text: '«¿Y por qué me lo cuentas a mí?»', then: [
					{ say: 'ysolde', text: 'Porque alguien te ha movido como una ficha, y las fichas que se dan cuenta dejan de ser fichas. Eso nos interesa.' },
				] },
			] },
			{ text: 'Abajo, en la plaza, un guardia de Lemnis levanta la vista hacia la azotea. Ysolde se pone de pie sobre la cabeza del Miltank.' },
			{ say: 'ysolde', text: 'Hora de irse. El camión de la lavandería del Centro Pokémon pasa por la calle de atrás a las seis menos diez. Y son las seis menos diez.' },
			{ text: 'Se deja caer de espaldas. Seis plantas. Un segundo después, abajo, un ruido blando, una lluvia de sábanas blancas volando por la calzada y un repartidor que grita «¡¿OTRA VEZ?!».' },
			{ text: 'Cuando te asomas, en la cabeza del Miltank hinchable solo queda una pluma gris, clavada como una flecha. El Miltank pierde un poco de aire por el agujero. Pone cara de pena.' },
			{ say: 'rotom', text: '¡Bzzt! Ha caído en un camión de sábanas. ¡Sábanas! Si llega a pasar el de los Bonguris… Eso era una idea malísima. …Ha salido bien otra vez. Dejo de apostar.' },
			{ if: '!has("plumagris")', then: [{ give: 'plumagris' }] },
			{ quest: 'b02_t_vencejos', stage: 'abierto' },
			{ intel: { npc: 'ysolde', text: 'En Trigal, desde la azotea: Lemnis puso cámaras en los tejados de la plaza la mañana en que no llegaste. Los Vencejos tienen un nido viejo en Johto y vigilaban a «alguien de Lemnis» antes de que existiera el logo. Rangos: Pluma, Ala, Vencejo, Cumbre (ella es Ala).' } },
		],

		// =================== LILA ===================
		b02_lila_trigal: [
			{ set: { 'flag.b02_lila_trigal': true } },
			{ quest: 'b02_t_lila', stage: 'trigal' },
			{ text: 'Entre los andamios, una chica de pelo blanco con un mechón verde mide el suelo de combate con una cinta métrica. Eevee sujeta el otro extremo con los dientes, muy serio.' },
			{ say: 'lila', text: '¿{jugador}? ¡{jugador}! —Suelta la cinta. Eevee sale disparado hacia atrás arrastrándola—. ¡Estás aquí! E-esto… quiero decir: hola. Hola.' },
			{ if: 'flag.b01_lila_llama', then: [
				{ say: 'lila', text: 'Corelia me ha mandado delante para preparar el gimnasio. A mí sola. Dice que desde que encendí la llama de la Torre no le hace falta vigilarme. —Se pone roja—. Yo creo que sí le hace falta. Pero me ha mandado igual.' },
			], else: [
				{ say: 'lila', text: 'Corelia me ha mandado delante para preparar el gimnasio. A mí sola. No sé por qué. Yo todavía no he encendido la llama. Pero dice que esto también es una prueba. Que cada cosa es una prueba.' },
			] },
			{ say: 'lila', text: 'Va a ser el gimnasio de intercambio de Corelia en Johto. Cuando venga. Las líneas del campo las pinto yo. Bueno, Eevee me ayuda. Bueno, Eevee se tumba encima de la pintura.' },
			{ text: 'Un ruido metálico en la entrada. Alguien ha dado una patada a un saco de cemento. Un hombre de negro, con una R roja en el pecho y la gorra calada.' },
			{ say: 'recluta_rocket', text: 'Vaya, vaya. Un gimnasio vacío, sin líder, en el centro de Trigal. ¿Saben lo que es esto? Un almacén. Con muy buena ventilación.' },
			{ say: 'recluta_rocket', text: 'Tú, la de las flores. Recoge tu cinta métrica y vete. Aquí van a ir unas cajas. Órdenes de arriba.' },
			{ text: 'Lila se queda quieta. Las orejas se le ponen rojas. Eevee se coloca delante de ella, con el pelo erizado. Por la puerta asoma un segundo recluta, más grande, con un Golbat al hombro.' },
			{ prompt: 'Lila respira hondo. Te mira un segundo.', choice: [
				{ text: 'Ponerte delante de ella. «Yo me encargo, Lila.»', then: [
					{ af: { lila: -5 } },
					{ say: 'lila', text: 'No. —Lo dice bajito, pero firme. Te pone la mano en el brazo y te aparta, despacio—. No, {jugador}. Este es mío. Este gimnasio es mío. Hasta que llegue Corelia, es mío.' },
					{ text: 'No hay temblor en su voz. Solo un poco de dolor, el de que hayas pensado que no podía.' },
					{ set: { 'flag.b02_lila_protegida': true } },
				] },
				{ text: 'Quedarte a su lado. «Tú puedes. Yo me encargo del otro.»', then: [
					{ af: { lila: 6 } },
					{ say: 'lila', text: '…Vale. Vale. —Respira—. Tú el grande. Yo el de la cinta métrica. Es justo: me ha insultado la cinta métrica.' },
				] },
				{ text: 'Cruzarte de brazos y apoyarte en un andamio.', then: [
					{ af: { lila: 3 } },
					{ text: 'Lila ve que no te mueves. Que no vas a quitarle esto. Algo se le asienta en los hombros.' },
					{ say: 'lila', text: 'Gracias por no ayudarme. —Se da cuenta de cómo ha sonado—. ¡Quiero decir…! Ya sabes lo que quiero decir.' },
				] },
			] },
			{ text: 'El recluta grande se gira hacia ti. «Tú, {el|la|le} de la Gira. Contigo me entretengo yo.»' },
			{ battle: 'recluta_trigal', lose: 'continue',
				onWin: [{ text: 'El recluta grande recoge a sus Pokémon y retrocede hasta la puerta, sin dejar de mirarte.' }],
				onLose: [{ text: 'El recluta grande se ríe, pero no se acerca. Mira a Lila. Está ocupado mirando a Lila.' }, { heal: true }] },
			{ text: 'Mientras tanto, en el centro del círculo de tiza, Lila y el otro recluta se miran. El recluta saca un Koffing. Lila no saca nada. Ya está todo fuera: Eevee, delante de ella.' },
			{ say: 'lila', text: 'Eevee. Como en la Torre. Despacio. Tranquilas. —Se le quiebra la voz. La recompone—. Tranquilas de verdad.' },
			{ text: 'El Koffing escupe una nube de humo. Eevee la atraviesa sin parpadear. Un placaje. Otro. Lila da las órdenes cada vez más bajito, cada vez más claras, como quien deja de tener miedo a mitad de una frase.' },
			{ text: 'Al último golpe, el pelaje de Eevee se enciende. Un brillo **rosa**, suave, que le recorre las orejas y la cola como una cinta de luz. Lila contiene el aliento. Tú también.' },
			{ text: 'Y el brillo se apaga. Despacio. Como una vela que alguien decide no apagar todavía. Eevee sigue siendo Eevee. Pero se gira hacia Lila, y la mira como si supiera algo que ella aún no sabe.' },
			{ text: 'El Koffing está en el suelo. El recluta lo recoge, mira a Lila, mira a Eevee, y sale corriendo sin decir nada. El grande lo sigue.' },
			{ say: 'lila', text: '…' },
			{ say: 'lila', text: '¿Lo has visto? ¿Lo de Eevee? ¿Ese brillo? —Se arrodilla y lo abraza—. ¿Qué ha sido eso? ¿Estás bien? ¿Estás bien tú? ¿Estoy bien yo?' },
			{ if: 'flag.b02_lila_protegida', then: [
				{ say: 'lila', text: 'Y tú… Ya sé que querías ayudar. Lo sé. Pero no me quites estas, ¿vale? Las pocas que tengo. —Te sonríe, un poco triste—. Las necesito para creérmelo.' },
			], else: [
				{ say: 'lila', text: 'Lo he hecho yo. Sola. Bueno, con Eevee. Bueno, contigo ahí. —Se ríe, temblando—. Corelia no se lo va a creer. Yo no me lo creo.' },
			] },
			{ rep: { johto: 2 } },
			{ quest: 'b02_t_lila', stage: 'hecha', done: true },
			{ intel: { npc: 'lila', text: 'Prepara el gimnasio de intercambio de Trigal para Corelia. Echó sola a un recluta Rocket que quería usarlo de almacén. Su Eevee brilló en rosa un instante y se apagó.' } },
		],
		b02_lila_despues: [
			{ say: 'lila', text: 'Estoy pintando las líneas. Rectas. Bueno, casi rectas. Eevee ha dejado huellas en la de la izquierda y no pienso borrarlas.' },
			{ say: 'lila', text: 'A veces, cuando está muy tranquila, le vuelve un poco el brillo rosa. En la punta de las orejas. Creo que está esperando algo. No sé qué. Yo también estoy esperando algo.' },
		],
		b02_gym_trigal_cerrado: [
			{ text: 'No hay líder. Hay andamios, sacos de cemento y un obrero comiéndose un bocadillo en lo que será la grada.' },
			{ text: 'Un cartel: «**Gimnasio de intercambio del Circuito Infinito** · Apertura: próximamente. Líder: por confirmar (de Kalos)».' },
		],

		// =================== RENATA (Casos Fríos) ===================
		b02_renata_llamada: [
			{ quest: 'b02_t_renata', stage: 'llamada' },
			{ say: 'renata', as: 'Renata (llamada)', text: '¡Testigo! ¡Estás viv{o|a|e}! Bueno, lo suponía. Si no, habría sido un episodio buenísimo, pero muy triste. Cool, cool, cool. Escucha, que hablo rápido y la llamada interregional cuesta un riñón.' },
			{ say: 'renata', as: 'Renata (llamada)', text: '«El ingeniero que no volvió a casa». Hace doce años. Mi ingeniero trabajaba en Johto antes de desaparecer. Y tú estás en Trigal. ¿Ves por dónde voy? Voy por ahí.' },
			{ say: 'renata', as: 'Renata (llamada)', text: 'Necesito un testigo. Alguien que trabajara con él. Tengo una grabación vieja, de una fiesta de empresa: mi ingeniero brindando con un compañero. No se le ve la cara al compañero. Pero se oyen cosas.' },
			{ say: 'renata', as: 'Renata (llamada)', text: 'Pistas, toma nota: uno, el compañero tendrá ahora unos sesenta años. Dos, trabajaba con trenes: brinda «por las vías que flotan». Tres, de fondo se oye un zumbido metálico en tres notas. Siempre tres. *Bzz, bzz, bzz*. Como si fueran tres cosas zumbando a la vez.' },
			{ say: 'renata', as: 'Renata (llamada)', text: 'Nota para el episodio: el testigo sigue en Trigal. Lo sé. Lo sé con el estómago. Mi estómago acierta un sesenta por ciento de las veces, que para un estómago es muchísimo.' },
			{ say: 'renata', as: 'Renata (llamada)', text: 'Búscalo en la **estación del Tren Magnético**. Cuando lo tengas, llámame. ¡No cuelgues tú primero! …Vale, cuelgo yo.' },
			{ quest: 'b02_t_renata', stage: 'testigo' },
		],
		b02_renata_revisora: [
			{ say: 'revisora', text: '¡Billetes, billetes! Ah, no, que usted no viaja. ¿Busca a alguien? Llevo aquí desde los dieciocho. Treinta y dos años picando billetes. ¿Le parecen muchos? A mí también.' },
			{ text: 'A su lado flota un Magnemite. Uno solo. Zumba en una sola nota: *bzzz*.' },
			{ say: 'revisora', text: '¿Ingenieros? Aquí había un montón cuando se inauguró la línea. Ahora solo queda el jefe de mecánicos. Ese lleva aquí desde antes que las vías.' },
			{ set: { 'flag.b02_renata_pista': true } },
		],
		b02_renata_mecanico: [
			{ text: 'Un hombre mayor, de barba blanca y mono azul manchado de grasa, engrasa una rueda del tren con una paciencia infinita. A su lado flota un **Magneton**: tres Magnemite unidos que zumban a la vez, cada uno en una nota. *Bzz, bzz, bzz*.' },
			{ say: 'damaso', as: 'Mecánico', text: '¿Mmm? No vendo billetes. Arreglo lo que los billetes rompen.' },
			{ say: 'damaso', as: 'Mecánico', text: 'Llevo en esta estación desde que era un descampado. Doce años. Antes, en otra cosa. Las vías que flotan no son mi primer tren.' },
			{ text: 'El Magneton gira sus tres ojos hacia ti. *Bzz, bzz, bzz*.' },
			{ set: { 'flag.b02_renata_pista': true } },
		],
		b02_renata_jubilado: [
			{ say: 'jubilado_radio', text: '¿Eh? Estoy escuchando la radio, joven. *Noches de Johto*. Hoy hablan de la Gira. Esa chica de Galar que pedía por antena que buscaran a {un|una|une} novat{o|a|e}. Qué cosa más bonita.' },
			{ say: 'jubilado_radio', text: '¿Trenes? No, no, yo era panadero. Treinta años haciendo pan. Ahora escucho la radio. Es lo mismo, pero sin harina.' },
			{ set: { 'flag.b02_renata_pista': true } },
		],
		b02_renata_elegir: [
			{ say: 'renata', as: 'Renata (llamada)', text: '¿Ya? ¿Lo tienes? ¡Dime que lo tienes! ¿Quién es?' },
			{ prompt: '¿Quién es el compañero del ingeniero?', choice: [
				{ text: 'La revisora del Magnemite.', then: [
					{ set: { 'vars.renata_fallos': '+1' } },
					{ say: 'renata', as: 'Renata (llamada)', text: 'Mmm. ¿Un Magnemite? Uno zumba en una nota. Mi grabación tiene tres. Y lleva treinta y dos años picando billetes, no construyendo vías. No cuadra. Prueba otra vez. ¡Sin presión! Hay presión.' },
				] },
				{ text: 'El mecánico mayor del Magneton.', then: [
					{ call: 'b02_renata_testigo' },
				] },
				{ text: 'El señor del transistor.', then: [
					{ set: { 'vars.renata_fallos': '+1' } },
					{ say: 'renata', as: 'Renata (llamada)', text: '¿Un panadero? A ver, los panaderos son gente maravillosa, pero no brindan «por las vías que flotan». Brindan por la masa madre. Otra vez.' },
				] },
				{ text: '«Todavía no lo sé.»', then: [
					{ say: 'renata', as: 'Renata (llamada)', text: 'Vale. Habla con la gente de la estación. Escucha los zumbidos. Los zumbidos no mienten. La gente sí.' },
				] },
			] },
		],
		b02_renata_testigo: [
			{ say: 'renata', as: 'Renata (llamada)', text: '¡El Magneton! ¡Tres Magnemite, tres notas! ¡Claro! ¡Cool, cool, cool, cool! Ponme con él. Ponme en altavoz. Ya.' },
			{ if: 'vars.renata_fallos == 0', then: [
				{ af: { renata: 5 } },
				{ say: 'renata', as: 'Renata (llamada)', text: 'A la primera. A la primera, testigo. Eso es mejor que mi estómago. Me fastidia. Me encanta.' },
			], else: [
				{ af: { renata: 2 } },
				{ say: 'renata', as: 'Renata (llamada)', text: 'Nos ha costado, pero ya está. Nota para el episodio: el testigo acierta cuando se calla y escucha. Como yo. Nunca.' },
			] },
			{ text: 'Te acercas al mecánico con el Rotom en altavoz. Él deja la aceitera en el suelo y se limpia las manos en un trapo, muy despacio, como si supiera de qué va esto desde hace doce años.' },
			{ say: 'damaso', text: 'Dámaso Ferrán. Mecánico jefe. —Mira el Rotom—. ¿Grabando? Grabe. Ya me da igual.' },
			{ say: 'renata', as: 'Renata (llamada)', text: 'Señor Ferrán, ¿usted trabajó con Matías Olmedo hace doce años?' },
			{ text: 'El Magneton deja de zumbar. Las tres notas a la vez.' },
			{ say: 'damaso', text: 'Matías. —Se sienta en un cajón de herramientas—. Sí. Trabajamos juntos dos años. Él diseñaba, yo montaba. Él decía que yo tenía manos de cirujano. Yo le decía que él tenía cabeza de tren: siempre iba más rápido que las vías.' },
			{ say: 'damaso', text: 'No era el Tren Magnético. El tren era la tapadera, el dinero para que la gente no preguntara. Lo de verdad estaba en el sótano de la estación. Él lo llamaba «el primer prototipo». Un arco. Dos columnas. Una cosa que zumbaba como mi Magneton pero mil veces más grande.' },
			{ say: 'damaso', text: 'Un prototipo de Puerta, señorita. Doce años antes de que nadie dijera «Puerta» en la tele.' },
			{ say: 'renata', as: 'Renata (llamada)', text: '…Nota para el episodio. No. Nada de notas. Siga, por favor.' },
			{ say: 'damaso', text: 'Un martes dejó de venir. Así, sin más. Un lunes estaba, con su termo de café y sus planos, y el martes ya no. Ni una llamada. Ni una nota. Matías dejaba notas hasta para decir que se había acabado el azúcar.' },
			{ say: 'damaso', text: 'El miércoles vino gente a vaciar su taquilla. Gente con traje. Azul y plata. Muy educados. Se llevaron los planos, el termo, una foto de su hija que tenía pegada en la puerta. Todo. Me dieron las gracias por mi colaboración. Yo no había colaborado en nada.' },
			{ say: 'damaso', text: 'Al mes cerraron el sótano. Lo tapiaron. Ahora hay un cuarto de contadores. —Mira hacia el suelo del andén—. Doce años arreglando trenes encima de esa pared.' },
			{ choice: [
				{ text: '«¿Por qué no lo contó nunca?»', then: [{ say: 'damaso', text: 'Porque nadie preguntó. Y porque tenía una hipoteca, un Magneton que come tornillos y miedo. Por ese orden, al principio. Luego, el miedo subió al primer puesto.' }] },
				{ text: '«Gracias por contarlo ahora.»', then: [{ say: 'damaso', text: 'No me dé las gracias. Me lo tenía que haber quitado de encima hace años. Pesa más que una rueda, esto.' }] },
			] },
			{ say: 'renata', as: 'Renata (llamada)', text: 'Señor Ferrán. Gracias. De verdad. —Por primera vez, no habla rápido—. Le prometo que no saldrá su nombre si no quiere.' },
			{ say: 'damaso', text: 'Ponga mi nombre. A mi edad, prefiero que me encuentren a que me busquen.' },
			{ say: 'renata', as: 'Renata (llamada)', text: 'Testigo. {jugador}. Te debo una. Y una pregunta nueva: ¿quién hereda un prototipo que nadie sabe que existe? …No me contestes. Es retórica. Es para el episodio. Cool. Cool, cool.' },
			{ quest: 'b02_t_renata', stage: 'hecha', done: true },
			{ give: 'ppup' },
			{ intel: { npc: 'renata', text: 'Su caso: el ingeniero Matías Olmedo trabajaba hace doce años en «el primer prototipo de Puerta», en el sótano de la estación del Tren Magnético de Trigal. Dejó de ir un martes. Su taquilla la vaciaron «gente con traje azul y plata». El sótano está tapiado.' } },
			{ intel: { npc: 'damaso', text: 'Mecánico jefe del Tren Magnético de Trigal. Montaba lo que diseñaba Matías Olmedo. Testigo de Renata. Su Magneton zumba en tres notas.' } },
		],

		// =================== CASO DE LA AGENCIA ===================
		b02_agencia_llamada: [
			{ quest: 'b01_t_agencia', done: true, cond: 'quest.b01_t_agencia' },
			{ quest: 'b02_t_agencia', stage: 'caso' },
			{ say: 'matiere', as: 'Matière (llamada)', text: '¡{jugador}! Handsome me ha dicho que estabas bien. Bueno, me ha dicho «Handsome confirma la integridad del colaborador». Lo traduzco: estabas bien.' },
			{ say: 'matiere', as: 'Matière (llamada)', text: 'Tengo un caso para ti. Pequeño. Ridículo, si te soy sincera. Nos lo ha mandado el Centro Comercial de Trigal, que tiene contrato con la Agencia desde que alguien les robó un ascensor. Sí, entero. Otra historia.' },
			{ say: 'matiere', as: 'Matière (llamada)', text: 'Anoche desapareció del escaparate de la sexta planta el **Poké Muñeco gigante de Miltank**, edición limitada de la Gira. Metro y medio de peluche. Tres sospechosos. Y una montaña de datos.' },
			{ say: 'matiere', as: 'Matière (llamada)', text: 'Te paso las tablas al Rotom. Busca la que no cuadra. Los datos no se equivocan, ¿vale? Solo hay que leerlos con calma.' },
			{ call: 'b02_agencia_caso' },
		],
		b02_agencia_caso: [
			{ text: '**CASO: EL MILTANK QUE SE FUE EN TREN** · Rotom proyecta tres tablas.' },
			{ text: '**Tabla 1 · Alarma del escaparate (planta 6)**\n`22:41` Alarma DESACTIVADA (mantenimiento)\n`22:45` Alarma ACTIVADA\n`07:00` Escaparate vacío (aviso de limpieza)' },
			{ text: '**Tabla 2 · Tornos de la planta 6 (tarjetas de empleado)**\n`0412` Sr. Pardo (vigilante) · ENTRA `22:58`\n`0977` Inés (dependienta) · SALE `21:05`\n`0331` Gonzalo (repartidor) · ENTRA `22:40` · SALE `22:46`' },
			{ text: '**Tabla 3 · Otras fuentes**\nTorre Radio, invitados en directo de *Noches de Johto*: Inés · `21:30`–`23:30`\nTren Magnético, billete Trigal → Azafrán (23:05): Gonzalo · equipaje: «1 bulto voluminoso, blando»' },
			{ text: '**Declaraciones**\n· Sr. Pardo: «Subí a hacer la ronda a las once. El escaparate ya estaba vacío, no me fijé.»\n· Inés: «Me fui a las nueve. Estuve en la radio toda la noche, me oyó media ciudad.»\n· Gonzalo: «Esa noche no subí a la sexta. Terminé el reparto y me fui directo a la estación.»' },
			{ prompt: '¿Qué dato contradice una declaración?', choice: [
				{ text: 'El Sr. Pardo entró a las 22:58, después de que volviera la alarma.', then: [
					{ say: 'matiere', as: 'Matière (llamada)', text: 'Es verdad que entró a las 22:58. Pero eso coincide con lo que dice: subió a las once y ya no estaba. No contradice nada. Mira otra vez.' },
				] },
				{ text: 'Inés salió a las 21:05, mucho antes de la hora del robo.', then: [
					{ say: 'matiere', as: 'Matière (llamada)', text: 'Coincide con lo que dice. Y la radio la tiene en directo hasta las 23:30: imposible estar en dos sitios. Bueno, salvo para Handsome, que dice que una vez lo consiguió. Otra.' },
				] },
				{ text: 'Gonzalo dice que no subió, pero su tarjeta entró a las 22:40 y salió a las 22:46.', then: [
					{ call: 'b02_agencia_resuelto' },
				] },
				{ text: 'El tren de las 23:05 siempre llega tarde.', then: [
					{ say: 'matiere', as: 'Matière (llamada)', text: '¿El de la mala suerte? Sí, lo sé. Pero que el tren tenga mala suerte no prueba nada de nadie. Bueno, prueba que el maquinista necesita unas vacaciones. Céntrate.' },
				] },
			] },
		],
		b02_agencia_resuelto: [
			{ say: 'matiere', as: 'Matière (llamada)', text: '¡Eso es! Gonzalo dice que no subió a la sexta. Pero su tarjeta entra a las 22:40, justo antes de que se apague la alarma, y sale a las 22:46, justo después de que vuelva. Seis minutos. Y luego, un billete de tren con un «bulto voluminoso, blando».' },
			{ say: 'matiere', as: 'Matière (llamada)', text: 'Lo he llamado. Ha confesado en dos frases. ¿Sabes para qué lo quería? Para su hija. Vive en Azafrán y adora a Blanca. No le llegaba el sueldo para la edición limitada.' },
			{ say: 'matiere', as: 'Matière (llamada)', text: 'El Centro Comercial no va a denunciar. Le van a descontar el Miltank del sueldo, a plazos, y la niña se lo queda. A veces los casos acaban bien. No muchas. Pero a veces.' },
			{ if: '!flag.b02_agencia_premio', then: [
				{ set: { 'flag.b02_agencia_premio': true } },
				{ say: 'matiere', as: 'Matière (llamada)', text: 'El Centro Comercial te manda un regalo. Y yo, un abrazo. El abrazo no se puede mandar por el Rotom. Lo apunto para cuando vuelvas a Luminalia.' },
				{ give: 'ppup' }, { rep: { policia: 2, johto: 1 } },
			] },
			{ quest: 'b02_t_agencia', stage: 'resuelto' },
			{ say: 'matiere', as: 'Matière (llamada)', text: 'Y {jugador}… Handsome está ahí, ¿verdad? Disfrazado de algo absurdo. Dile que coma. Que se olvida. Que le he hecho un táper y lo tiene en mi nevera, en Kalos, muriéndose de pena.' },
		],

		// =================== KAORI (cameo) ===================
		b02_kaori_trigal: [
			{ set: { 'flag.b02_kaori_trigal': true } },
			{ quest: 'b02_t_kaori', stage: 'trigal' },
			{ text: 'En la herboristería de la planta baja, una chica con delantal de boticaria sobre un kimono sencillo examina una seta seca a contraluz. Pelo negro recogido con un pasador de hoja. Pecas. Ojos entrecerrados, como si todo le aburriera un poco. El brazo izquierdo, vendado hasta el codo.' },
			{ say: 'kaori', as: 'Boticaria', text: 'Esta no es una Seta Aroma. Es una Seta Aroma pintada. —Se la devuelve al dependiente—. Si la vende, que sea como pintura.' },
			{ say: 'kaori', as: 'Boticaria', text: 'Quiero raíz de Bellsprout seca, polvo de Vileplume y algo que pique. Lo que más pique que tenga.' },
			{ text: 'El dependiente le trae un frasquito. Ella se moja la punta del dedo, se lo pasa por el vendaje del brazo izquierdo, espera tres segundos y asiente.' },
			{ say: 'kaori', as: 'Boticaria', text: 'Bien. Pica. Me lo llevo.' },
			{ text: 'Al girarse para pagar, ve tu bolsa de la Gira. Ve la cajita. Ve el papel azul y plata asomando. Y por primera vez, los ojos se le abren del todo.' },
			{ text: 'Mira los Caramelos Lazo como quien mira una serpiente en un cesto de fruta. Sin miedo. Con mucha atención.' },
			{ say: 'kaori', as: 'Boticaria', text: 'Eso no es un caramelo.' },
			{ text: 'No dice nada más. Espera, con la cabeza un poco ladeada.' },
			{ if: 'has("caramelolazo")', then: [
				{ prompt: 'La boticaria no aparta la vista de la cajita.', choice: [
					{ text: 'Darle un Caramelo Lazo.', then: [
						{ take: 'caramelolazo' },
						{ set: { 'flag.b02_kaori_caramelo': true, 'flag.b02_kaori_caramelo_trigal': true } },
						{ af: { kaori: 6 } },
						{ text: 'Lo toma con dos dedos, por el envoltorio, sin tocar el caramelo. Lo huele. Lo mira contra la luz del escaparate. Lo guarda en una bolsita de papel encerado, que dobla tres veces.' },
						{ say: 'kaori', text: 'Kaori. Boticaria del Teatro de Danza de Iris. —Lo dice como quien lee una etiqueta—. Gracias. Esto es más interesante que todo lo que vende esta tienda.' },
						{ say: 'kaori', text: 'No le des los otros a tu Pokémon. Todavía no sé por qué. Cuando lo sepa, quizá te lo diga. Si me acuerdo de ti.' },
					] },
					{ text: '«¿Qué quieres decir con que no es un caramelo?»', then: [
						{ af: { kaori: 1 } },
						{ say: 'kaori', text: 'Quiero decir lo que he dicho. —Se ajusta el vendaje—. Kaori. Boticaria, en Iris. Si un día te pica la curiosidad, búscame. A mí me pica todo el rato.' },
					] },
					{ text: 'Guardar la cajita en la mochila.', then: [
						{ say: 'kaori', text: 'Mmm. Prudente. O tacañ{o|a|e}. Las dos cosas son útiles. —Recoge sus frascos—. Kaori. Iris. Por si acaso.' },
					] },
				] },
			], else: [
				{ say: 'kaori', text: 'Ya no los tienes. Mejor. —Recoge sus frascos—. Kaori. Boticaria, en Iris. Por si acaso.' },
			] },
			{ text: 'Sale de la tienda con sus frascos. En la puerta se rasca el brazo vendado, distraída, y sonríe un poco. A nada. O a algo que solo ve ella.' },
			{ intel: { npc: 'kaori', text: 'Boticaria del Teatro de Danza de Iris. Prueba venenos en su brazo izquierdo vendado. Al ver los Caramelos Lazo dijo: «Eso no es un caramelo».' } },
		],
		b02_kaori_despues: [
			{ text: 'El dependiente de la herboristería todavía está mirando la seta pintada.' },
			{ say: 'rotom', text: '¡Bzzt! La boticaria se fue hacia el norte. A Iris, dijo. Los caramelos… mejor no, ¿sí? Ya lo dije antes. Lo digo otra vez.' },
		],

		// =================== GASPAR ===================
		b02_gaspar_trigal: [
			{ set: { 'flag.b02_gaspar_trigal': true } },
			{ text: 'Entre los puestos de fideos del patio de comidas, alguien ha montado un hornillo con una olla de cobre enorme. Huele a castaña asada y a caldo. Un hombre corpulento con pañuelo en la cabeza prueba algo con una cuchara de madera.' },
			{ say: 'gaspar', as: 'Chef', text: '¡Tú tienes cara de venir de lejos y de no haber comido! Siéntate. Gaspar Rocafort, cocinero ambulante.', cond: '!flag.b01_gaspar_1' },
			{ say: 'gaspar', text: '¡{jugador}! ¡De Kalos a Johto!', cond: 'flag.b01_gaspar_1' },
			{ text: 'Te sirve un cuenco sin preguntar.' },
			{ say: 'gaspar', text: 'Prueba. Caldo de castaña y setas del Encinar. Las setas las ha elegido una boticaria muy seria que pasó por aquí abajo. Ni se te ocurra preguntarme por la cola de Slowpoke: en Azalea te echan del pueblo.' },
			{ say: 'gaspar', text: 'Voy a **Ciudad Iris**. Allí hacen los mejores dulces de Johto, para las Chicas Kimono y para el templo. Quiero hacer mi propia versión para el recetario. Una versión con valentía.' },
			{ say: 'gaspar', text: 'Me faltan tres cosas. **Miel**: en Johto los Combee la hacen más oscura. **Un Bonguri Rosa**: en Azalea lo usan para Poké Balls; yo, para almíbar. Y **Leche Mu-mu**, de la buena, de rancho. Dicen que al este de Iris hay un rancho con Miltank.' },
			{ say: 'gaspar', text: 'Tráemelos a Iris y te invito a algo que no se olvida. Comer bien es la mitad de la aventura. La otra mitad es llegar a la mesa.' },
			{ quest: 'b02_t_gaspar', stage: 'ingredientes' },
			{ intel: { npc: 'gaspar', text: 'Va a Ciudad Iris a hacer dulces para su recetario de Johto. Le faltan: Miel, un Bonguri Rosa y Leche Mu-mu.' } },
		],
		b02_gaspar_despues: [
			{ say: 'gaspar', text: 'Miel, Bonguri Rosa y Leche Mu-mu. Te espero en Iris. Si encuentras algo raro por el camino, tráelo también. No prometo cocinarlo. Prometo mirarlo con respeto.' },
			{ if: 'has("caramelolazo")', then: [{ say: 'gaspar', text: '¿Eso son los caramelos de la Gira? Déjame oler. —Huele. Frunce el ceño—. Huele a dulce sin alma. Como un pastel de escaparate. No los cocinaría ni en una mazmorra.' }] },
		],

		// =================== ALEXIA (Torre Radio) ===================
		b02_alexia_trigal: [
			{ set: { 'flag.b02_alexia_trigal': true } },
			{ text: 'Alexia está en la puerta del estudio, con la cámara colgada y una acreditación de prensa de la Gira en el cuello. Te ve y sonríe como quien encuentra un titular.' },
			{ say: 'alexia', text: '¡{jugador}! {El|La|Le} novat{o|a|e} perdid{o|a|e}. Bueno, «novat{o|a|e} con incidencia de trayecto», según el comunicado. Me encanta esa frase. La voy a usar en mi boda.' },
			{ if: 'flag.b01_prensa_verdad', then: [
				{ say: 'alexia', text: 'Después de lo que dijiste en Luminalia, la productora de *Noches de Johto* me ha pedido que te entreviste en directo. Lemnis ha pedido que no. Así que vamos a hacerlo grabado. A veces hay que elegir las batallas.' },
				{ say: 'alexia', text: 'Una pregunta: ¿la Puerta falló o te mandaron al Encinar? No contestes ahora. Piénsalo. Yo ya lo he pensado.' },
			] },
			{ if: 'flag.b01_prensa_lemnis', then: [
				{ say: 'alexia', text: 'Lemnis me ha dado tu nombre como «voz de confianza» de la Gira. Les gustó lo que dijiste en Luminalia. «Lemnis lo tiene controlado». —Te mira por encima de la cámara—. ¿Sigue teniéndolo controlado?' },
				{ say: 'alexia', text: 'No te lo pregunto como periodista. Bueno, sí. Pero también como persona que te vio salir de un bosque con tres días menos.' },
			] },
			{ if: '!flag.b01_prensa_verdad && !flag.b01_prensa_lemnis', then: [
				{ say: 'alexia', text: 'En Luminalia no quisiste decir nada. Lo respeto: la gente que se calla suele saber cosas. ¿Hoy te apetece hablar? Es solo la radio. Solo nos escucha medio Johto.' },
			] },
			{ prompt: 'Alexia levanta la grabadora.', choice: [
				{ text: '«La Gira está genial. Tres días tarde, pero genial.»', then: [
					{ rep: { lemnis: 1 } },
					{ say: 'alexia', text: 'Diplomático. —Lo apunta—. «La Gira está genial». Lo pondremos con música alegre.' },
				] },
				{ text: '«No sé qué pasó en esos tres días. Y nadie me lo explica.»', then: [
					{ rep: { lemnis: -2, policia: 1 } },
					{ say: 'alexia', text: '…Eso no lo va a dejar emitir nadie. —Apaga la grabadora—. Pero me lo guardo. Gracias por decirlo.' },
				] },
				{ text: '«Prefiero hablar de mi Lucario.»', then: [
					{ say: 'alexia', text: '¡Ah! Lo más seguro y lo más bonito. —Le hace una foto a {riolu}—. Va a ser la foto más compartida de la semana. Te lo prometo.' },
					{ happy: { who: 'riolu', n: 5 } },
				] },
			] },
			{ say: 'alexia', text: 'Por cierto: mi hermana dice que me mandes recuerdos. Violeta. Va a estar de intercambio en Kanto. Siempre se lleva los mejores gimnasios.' },
			{ intel: { npc: 'alexia', text: 'Cubre la Gira en la Torre Radio de Trigal. Te entrevistó para *Noches de Johto*. Su hermana Violeta irá de intercambio a Kanto.' } },
		],
		b02_alexia_despues: [
			{ say: 'alexia', text: 'Esta noche emiten tu entrevista. Si oyes un pitido raro a las 2:17, no es la emisora. Llevamos semanas intentando quitarlo. No hay manera.' },
		],
		b02_recepcion_radio: [
			{ text: 'La recepcionista te sonríe. Habla sin quitarse los auriculares.' },
			{ say: 'joy_johto', as: 'Recepcionista', text: '¡Bienvenid{o|a|e} a la Torre Radio! Hoy en *Noches de Johto*, la Gira. Y mañana, la Gira. Y pasado, adivine.' },
			{ if: 'flag.b02_rhi_combate_hecho', then: [{ say: 'joy_johto', as: 'Recepcionista', text: 'Ah, ¿es usted por quien preguntaba la chica pelirroja? ¡Tres noches seguidas! Le dejamos dormir en el sofá del estudio. Roncaba como un Snorlax. Muy dulce.' }] },
		],

		// =================== FLORISTERÍA ===================
		b02_floristeria_pronto: [
			{ say: 'florista', text: '¡Hola, hola! ¿Eres de la Gira? Tienes cara de la Gira. Primero preséntate en el pabellón, que si no, mi hermana dice que no cuentas como de la Gira. Ella es muy de normas.' },
		],
		b02_floristeria: [
			{ set: { 'flag.b02_regadera': true } },
			{ say: 'florista', text: '¡Hola, hola! ¡Tú eres {el|la|le} del Encinar! Bueno, eso dice la radio. ¿Es verdad que allí los relojes se paran? Mi hermana dice que son tonterías. Mi hermana no cree ni en el horóscopo.' },
			{ text: 'La hermana mayor, al fondo, riega un helecho y no se gira.' },
			{ say: 'florista', text: 'Oye, ¿vas a ir al norte, a Iris? Por las Rutas 36 y 37 hay un árbol rarísimo en mitad del camino. No deja pasar a nadie. Y lo más raro: cuando no miras, se mueve.' },
			{ say: 'florista', text: 'Mi hermana dice que un árbol que se mueve no es un árbol. Que es otra cosa. Y que a esa otra cosa no le gusta el agua. —Baja la voz—. Mi hermana dice cosas muy raras para no creer en el horóscopo.' },
			{ text: 'La hermana mayor deja la regadera de hojalata sobre el mostrador. La de la etiqueta «NO SE VENDE». Tiene forma de Squirtle, con el caño saliendo de la boca.' },
			{ say: 'florista', as: 'Hermana mayor', text: 'No se vende. Se presta. Devuélvela cuando el árbol se aparte.' },
			{ cutscene: { bg: { type: 'indoor', wall: '#e9f0d8', floor: '#8a7a5a' }, frames: [
				{ item: 'regaderaardilla', text: 'Una regadera de hojalata verde y azul, con forma de Squirtle. El asa es la cola. Alguien le ha pintado los ojos a mano, un poco bizcos.' },
				{ fx: 'glow', text: 'La hermana mayor la llena hasta arriba en la pila. Pesa. El agua hace un ruidito dentro, como una risa.' },
				{ fx: 'light', text: 'Al tomarla, un chorrito se escapa por la boca del Squirtle y moja las macetas del mostrador. Todas las flores se estiran a la vez hacia la luz.' },
			] } },
			{ give: 'regaderaardilla' },
			{ say: 'florista', text: '¡La **Regadera Ardilla**! Aquí le decimos así porque mi abuelo decía «ardilla» en vez de «Squirtle». Nadie sabe por qué. Mi abuelo tampoco.' },
			{ say: 'florista', text: 'Con eso, el árbol de la ruta se aparta. O se enfada. Una de dos. ¡Suerte!' },
			{ intel: { npc: 'rotom', text: 'La Regadera Ardilla de la Floristería de Trigal sirve para el «árbol que se mueve» de las Rutas 36 y 37.' } },
		],
		b02_floristeria_despues: [
			{ say: 'florista', text: '¿Qué tal la regadera? No la uses con cactus. Ni con mi hermana.' },
			{ say: 'florista', as: 'Hermana mayor', text: '…' },
		],

		// =================== PUERTA DE TRIGAL ===================
		b02_puerta_tecnico: [
			{ say: 'tecnico_lemnis', text: 'Servicio suspendido, lo siento. Ajustes de calibración. Desde el día de la ceremonia, la Puerta de Johto tiene un… pequeño desfase. Nada grave. Cuatro décimas de segundo.' },
			{ say: 'tecnico_lemnis', text: 'Bueno, en una Puerta, cuatro décimas de segundo son como cuatro kilómetros. Pero en cuanto lo ajustemos, la reabrimos. ¡Un mundo! Una liga.' },
		],
		b02_puerta_tecnico_abierta: [
			{ say: 'tecnico_lemnis', text: '¡Reabierta! Justo cuando la necesitaba usted. Qué casualidad. —Sonríe mucho—. Luminalia, ida y vuelta, cuando quiera. Para los inscritos en la Gira, gratis.' },
			{ say: 'tecnico_lemnis', text: 'Si nota un pequeño tirón al cruzar, es normal. Si nota uno grande… también, según el manual. El manual es muy optimista.' },
		],
		b02_estacion_panel: [
			{ text: 'El panel de salidas. Destino: Ciudad Azafrán (Kanto). Todas las salidas pone «SUSPENDIDO · AJUSTES DE RED». Todas menos una.' },
			{ text: '**23:05 · Azafrán · RETRASO PROBABLE.** Siempre ese. Siempre retrasado. Siempre con salida.' },
			{ text: 'Una pegatina pequeña en una esquina del panel, casi tapada: un logo azul y plata y la frase «Patrocinador original del proyecto».' },
		],

		// =================== QUÉ QUEDA (Rotom) ===================
		b02_trigal_pendiente: [
			{ say: 'rotom', text: '¡Bzzt! Repaso. Lo pendiente en Trigal:' },
			{ text: '· Presentarte en el **pabellón de la Gira**.', cond: '!flag.b02_pabellon' },
			{ text: '· Hablar con la **anfitriona** de la Gira (en el pabellón).', cond: 'flag.b02_pabellon && !flag.b02_sera_trigal' },
			{ text: '· **Rhi** te está buscando por la plaza.', cond: 'flag.b02_pabellon && !flag.b02_rhi_combate_hecho' },
			{ text: '· Rhi tiene una carta. Está sola en un banco de la plaza.', cond: 'flag.b02_rhi_combate_hecho && !flag.b02_rhi_carta' },
			{ text: '· **Bastien** anda por la plaza.', cond: 'flag.b02_pabellon && !flag.b02_bastien_combate_hecho' },
			{ text: '· **Noa** quiere hablar contigo detrás de la Torre Radio.', cond: 'flag.b02_bastien_combate_hecho && !flag.b02_noa_trigal' },
			{ text: '· En la **herboristería del Centro Comercial** hay alguien interesante.', cond: 'flag.b02_pabellon && !flag.b02_kaori_trigal' },
			{ text: '· En la **Floristería** tienen algo para el camino a Iris.', cond: 'flag.b02_pabellon && !flag.b02_regadera' },
			{ text: '· Hay un vendedor de globos rarísimo en la plaza.', cond: HANDSOME_LISTO + ' && !flag.b02_handsome_cita' },
			{ text: '· Alguien te ha citado de noche detrás de la Torre Radio.', cond: 'flag.b02_handsome_cita && !flag.b02_handsome_noche' },
			{ text: '· Falta poco para que alguien te cite. Habla con todo el mundo.', cond: 'flag.b02_pabellon && !(' + HANDSOME_LISTO + ')' },
			{ if: CIERRE_LISTO, then: [{ say: 'rotom', text: '¡Nada! ¡No queda nada! La Gira sale hacia Iris. Ponte en marcha cuando quieras.' }] },
			{ say: 'rotom', text: 'Y si te sobra tiempo: el gimnasio en obras, la Torre Radio, la azotea del Centro Comercial… Trigal tiene de todo. ¡Hasta un Miltank hinchable!', cond: '!(' + CIERRE_LISTO + ')' },
		],

		// =================== CIERRE DE TRIGAL ===================
		b02_trigal_cierre: [
			{ set: { 'flag.b02_puerta_trigal': true, 'flag.b02_trigal_hecho': true } },
			{ text: 'Por la mañana, las pantallas de la plaza cambian de mensaje: «**La Gira continúa · Próxima parada: Ciudad Iris**». Los técnicos empiezan a desmontar la carpa.' },
			{ text: 'Detrás de las vallas azules, la Puerta Lemnis de Johto se enciende con un zumbido grave. La lemniscata brilla en azul y plata. Al otro lado, borrosa, la plaza de Luminalia.' },
			{ say: 'rotom', text: '¡Bzzt! ¡La han reabierto! Ya podemos volver a Kalos cuando queramos. ¡Ida y vuelta! Bueno… ojalá esta vez sea ida y vuelta de verdad.' },
			{ if: RL, then: [{ text: '{riolu} mira la Puerta encendida y se acerca un paso a ti. Sin gruñir. Solo cerca. Muy cerca.' }] },
			{ if: 'flag.b02_rhi_carta', then: [{ text: 'En la plaza, Rhi te ve y levanta el puño, sin decir nada. Tiene la mano en el bolsillo de la chaqueta. El de la carta.' }] },
			{ if: 'flag.b01_trato_sera', then: [{ text: 'El Holomisor vibra. Un solo mensaje: «Iris. Norte. —S.»', cond: 'has("holomisorsera")' }] },
			{ say: 'rotom', text: 'Al norte, por la Ruta 35 y el Parque Nacional, se va a las Rutas 36 y 37. ¡Y luego Iris! Y un árbol que se mueve. Y una regadera con cara de Squirtle. Johto es rarísimo. ¡Me encanta!' },
			{ quest: 'b02_m4', done: true },
			{ quest: 'b02_m5', stage: 'rutas' },
			{ diary: 'Hoy nos despedimos de Trigal. Rhi está más contenta, nos han prestado una regadera con forma de Squirtle y la Puerta de Johto ya funciona otra vez. Mañana, ¡Ciudad Iris! ¡Bzzt!', cond: 'flag.b01_diario && !flag.b02_lila_trigal' },
			{ diary: 'Hoy nos despedimos de Trigal. Rhi está más contenta, Lila pinta un gimnasio y nos han prestado una regadera con forma de Squirtle. La Puerta de Johto ya funciona otra vez. Mañana, ¡Ciudad Iris! ¡Bzzt!', cond: 'flag.b01_diario && flag.b02_lila_trigal' },
			{ save: true },
		],

		// =================== PARQUE NACIONAL ===================
		b02_concurso: [
			{ say: 'juez_bichos', text: '¡Concurso de Captura de Bichos! Una captura por participante. Te presto la red y el silbato. El Pokémon, lo pones tú. Bueno, lo capturas tú.' },
			{ say: 'juez_bichos', text: 'Puntúo la especie: los más grandes, los más fuertes, los más raros. Elige zona. Y no me traigas un Caterpie, que este año ya llevo cuarenta.' },
			{ prompt: '¿Dónde buscas?', choice: [
				{ text: 'La hierba alta del oeste (dicen que pega fuerte).', then: [
					{ wild: { sp: 'scyther', lv: 33 }, canRun: true, lose: 'continue', onCatch: [{ set: { 'vars.concurso': 3 } }, { call: 'b02_concurso_juez' }], onWin: [{ say: 'juez_bichos', text: 'Lo has debilitado. Eso es un combate, no una captura. Vuelve a intentarlo cuando quieras.' }], onRun: [{ say: 'juez_bichos', text: 'Huir también es una estrategia. Mala, pero estrategia.' }] },
				] },
				{ text: 'Junto a la fuente (hay mucho revoloteo).', then: [
					{ wild: { sp: 'butterfree', lv: 32 }, canRun: true, lose: 'continue', onCatch: [{ set: { 'vars.concurso': 2 } }, { call: 'b02_concurso_juez' }], onWin: [{ say: 'juez_bichos', text: 'Lo has debilitado. Eso no puntúa. Otra vez será.' }], onRun: [{ say: 'juez_bichos', text: 'Se ha ido volando. Normal. Vuela.' }] },
				] },
				{ text: 'Bajo los robles (algo se mueve en la sombra).', then: [
					{ wild: { sp: 'venonat', lv: 31 }, canRun: true, lose: 'continue', onCatch: [{ set: { 'vars.concurso': 1 } }, { call: 'b02_concurso_juez' }], onWin: [{ say: 'juez_bichos', text: 'Debilitado. Sin captura no hay puntos.' }], onRun: [{ say: 'juez_bichos', text: 'Se ha metido bajo un roble. Sabio.' }] },
				] },
				{ text: 'Ahora no.', then: [{ say: 'juez_bichos', text: 'El concurso dura todo el día. Bueno, todos los días. Este año no paramos.' }] },
			] },
		],
		b02_concurso_juez: [
			{ if: 'vars.concurso >= 3', then: [{ say: 'juez_bichos', text: '¡Un Scyther! ¡Cuchillas, alas, mala leche! Eso es puntuación máxima. ¡Primer puesto!' }] },
			{ if: 'vars.concurso == 2', then: [{ say: 'juez_bichos', text: 'Un Butterfree. Elegante. Bien de alas. Buena puntuación. Segundo puesto, como mínimo.' }] },
			{ if: 'vars.concurso <= 1', then: [{ say: 'juez_bichos', text: 'Un Venonat. Peludito. Ojos grandes. Puntuación… honesta. Tercer puesto, por simpatía.' }] },
			{ if: '!flag.b02_concurso_hecho', then: [
				{ set: { 'flag.b02_concurso_hecho': true } },
				{ if: 'vars.concurso >= 3', then: [{ say: 'juez_bichos', text: 'El premio de primer puesto: ¡una Piedra Solar! Hace florecer lo que tiene que florecer.' }, { give: 'sunstone' }] },
				{ if: 'vars.concurso == 2', then: [{ say: 'juez_bichos', text: 'Segundo puesto: una Piedra Eterna. Para los que no quieren cambiar. Respeto.' }, { give: 'everstone' }] },
				{ if: 'vars.concurso <= 1', then: [{ say: 'juez_bichos', text: 'Tercer puesto: una Baya Zidra. No es mucho, pero está riquísima.' }, { give: 'sitrusberry' }] },
			], else: [
				{ say: 'juez_bichos', text: 'Ya tienes premio de este año, así que esta vez es por la gloria. La gloria no pesa, pero ocupa mucho.' },
			] },
			{ say: 'juez_bichos', text: 'Este año, por cierto, se me escapó uno morado con patas de saltamontes que no viene en el reglamento. Pegaba patadas. Si lo ves, no lo puntúo, pero me lo enseñas.' },
		],
		b02_banco_parque: [
			{ set: { 'flag.b02_banco_parque': true } },
			{ text: 'En el banco junto a la fuente alguien ha dejado un periódico de Trigal doblado y, debajo, una bolsita de la Gira. Vacía. Solo queda un envoltorio azul y plata, arrugado.' },
			{ text: 'Al lado del banco, un Furret duerme hecho una rosca. No se despierta ni cuando te sientas. Respira muy despacio. Demasiado.' },
			{ text: 'En el periódico, una noticia pequeña, abajo: «**Aumentan las consultas en los Centros Pokémon de Johto por "somnolencia leve"** · Los expertos lo atribuyen al cambio de estación».' },
			{ if: RL, then: [{ text: '{riolu} olfatea el envoltorio y se aparta, con el hocico arrugado.' }] },
			{ give: 'revive', silent: true },
			{ text: 'Debajo del periódico hay también un Revivir. Te lo quedas. Al Furret le dejas el periódico de manta.' },
		],
		b02_banco_parque_vacio: [
			{ text: 'El banco está vacío. El Furret se ha ido. Esperas que por su propio pie.' },
		],
	},
};
