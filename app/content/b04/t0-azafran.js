// Bloque 4 · Tramo 0: «El tren de las 23:05».
// Billete en la Pokédex → andén de Trigal → Tren Magnético (la Gira a bordo, la pasajera del termo, Rhi opcional)
// → parada en el túnel junto a la subestación de la Puerta de Kanto (primera interferencia del Diario)
// → Ciudad Azafrán: recepción en la Torre Lemnis Kanto (Sera o un directivo; Ansel), Silph cerrada,
// la Puerta de Kanto (segunda interferencia), Sabrina y el eco, Handsome y Lebrun, el Dojo de Kiyo, Adela
// → rumbo norte, a la Ruta 5 (T1).

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = 'inParty("riolu") || inParty("lucario")';
const TRATO_ROTO = 'flag.b01_trato_sera && !flag.b02_frag_sera';
const SERA_TU = 'flag.b01_trato_sera && flag.b02_frag_sera';
const COPITO_TUYA = 'flag.b01_mareep_copito'; // la rescató el jugador en Kalos: se llama Copito; si no, es Nieve
const MAREEP_AQUI = 'flag.b03_copito_contigo && (inParty("mareep") || inParty("flaaffy") || inParty("ampharos"))';
const RANCHO_NINGUNO = '!flag.b03_rancho_sobrina && !flag.b03_rancho_jugador && !flag.b03_rancho_lemnis';
const LLEGADA = 'flag.b04_azafran_llegada';
const T0_OK = 'flag.b04_recepcion && flag.b04_sabrina_eco && flag.b04_puerta_azafran && flag.b04_lebrun_azafran';
const EN_TREN = 'flag.b04_inicio_hecho && !flag.b04_tren_hecho';

export default {
	// =====================================================================
	// LUGARES
	// =====================================================================
	locations: {
		// =================== EL TREN ===================
		tren_magnetico: {
			name: 'Tren Magnético Trigal–Azafrán', short: 'Tren Magnético', parent: 'estacion_magnetica', kind: 'building',
			bg: { type: 'indoor', wall: '#e9e8e0', floor: '#3b4a6a' },
			desc: 'Un vagón blanco, largo y silencioso, con asientos azules de dos en dos y ventanillas que van del suelo al techo. No hay traqueteo: el tren **flota** a dos dedos de la vía y solo se oye un zumbido grave, como el de una nevera enorme y feliz.\n\nPor la ventanilla, de noche, Johto pasa a toda velocidad: luces de pueblos, el reflejo de un río, montañas negras.\n\nEn los asientos de delante viaja medio programa de la Gira. Al fondo, el **vagón restaurante**.',
			mapNote: 'Rhi (combate opcional) · vagón restaurante · botiquín de la Gira',
			onEnter: [{ script: 'b04_tren_arranca', cond: '!flag.b04_tren_arranca', once: true }],
			spots: [
				{ label: 'Botiquín de la Gira', sub: 'Una enfermera con su Chansey revisa a los equipos', icon: '🩺', action: { center: true } },
				{ label: 'Rhi', sub: 'Da toques a una Poké Ball en el pasillo', icon: '⚽', cond: '!beat("rhi_5")', new: '!flag.b04_rhi_tren', talk: [{ script: 'b04_rhi_tren' }] },
				{ label: 'Rhi', sub: 'Pegada a la ventanilla, con los cascos puestos', icon: '⚽', cond: 'beat("rhi_5")', talk: [{ script: 'b04_rhi_despues' }] },
				{ label: 'Bastien', sub: 'Lee unos papeles con el ceño fruncido', icon: '🐸', new: '!flag.b04_bastien_tren', talk: [{ cond: 'flag.b04_bastien_tren', script: 'b04_bastien_tren_2' }, { script: 'b04_bastien_tren' }] },
				{ label: 'Alexia', sub: 'Escribe a toda velocidad en una libreta', icon: '📸', new: '!flag.b04_alexia_tren', talk: [{ cond: 'flag.b04_alexia_tren', script: 'b04_alexia_tren_2' }, { script: 'b04_alexia_tren' }] },
				{ label: 'Vagón restaurante: una pasajera con un termo', sub: 'Mira fijamente su taza de té', icon: '🫖', cond: '!flag.b04_magda_tren', new: 'true', talk: [{ script: 'b04_magda_tren' }] },
				{ label: 'Una maleta verde en el portaequipajes', sub: 'Nadie la mira. Nadie la toca', icon: '🧳', talk: [{ script: 'b04_maleta' }] },
				{ label: 'Aspirante: un chico con un Ursaring dormido', sub: 'Ocupa dos asientos y medio', icon: '⚔️', action: { trainer: 'tren_dario' } },
				{ label: 'Aspirante: una chica de Kalos', sub: 'Se lima las uñas con la mirada fija en ti', icon: '⚔️', action: { trainer: 'tren_mireille' } },
				{ label: 'Mirar por la ventanilla', icon: '🪟', talk: [{ script: 'b04_ventanilla' }] },
				{ label: 'Seguir el viaje', sub: 'Siguiente parada: Ciudad Azafrán', icon: '🚆', new: 'true', talk: [{ script: 'b04_tunel' }] },
			],
		},

		// =================== CIUDAD AZAFRÁN ===================
		azafran: {
			name: 'Ciudad Azafrán', short: 'Azafrán', region: 'kanto', kind: 'city', map: { x: 50, y: 52 },
			bg: { type: 'city', roofs: ['#c4a43a', '#8a8f9e', '#e9e3d0'], far: '#9aa4ae' },
			desc: 'El corazón de Kanto: avenidas anchas, tranvías, oficinas y gente que camina deprisa con un café en la mano. Las calles se cruzan en cuadrícula perfecta, como si alguien las hubiera dibujado con regla.\n\nEn el centro, dos torres de cristal casi pegadas: la vieja **Silph S.A.**, con su logo rojo, y a su lado, más alta y más nueva, la **Torre Lemnis Kanto**, azul y plata. Una pasarela de cristal las une a media altura.\n\nAl norte, la ciudad se abre hacia la **Ruta 5**. Al este, hacia la **Ruta 8**.',
			descNight: 'De noche, Azafrán no se apaga: se enciende de otra forma. Las oficinas dejan las luces puestas, los anuncios zumban y la lemniscata de la Torre Lemnis gira despacio en lo alto, azul y plata, como un faro que no avisa de nada.',
			descs: [{ cond: 'flag.b04_t0_hecho', text: 'Azafrán, deprisa como siempre. Ya sabes dónde está todo: el Centro Pokémon de la esquina, el Dojo con su cartel enorme, la Puerta junto al parque, el gimnasio con la persiana a medio bajar.\n\nLas dos torres siguen ahí, pegadas, unidas por su pasarela de cristal. La de Lemnis brilla más. Siempre brilla más.' }],
			mapNote: 'Torre Lemnis Kanto · Silph S.A. (cerrada) · Puerta Lemnis · Dojo Kárate · Gimnasio (en pausa)',
			onEnter: [
				{ script: 'b04_azafran_llegada', cond: '!' + LLEGADA, once: true },
				{ script: 'b04_adela_mensaje', cond: 'flag.b04_recepcion && !flag.b04_adela_msg', once: true },
			],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda de Azafrán', action: { shop: 'tienda_azafran' } },
				{ label: 'Estación del Tren Magnético', sub: 'Trenes a Ciudad Trigal (Johto)', icon: '🚆', action: { go: 'estacion_azafran' } },
				{ label: 'Torre Lemnis Kanto', sub: 'Recepción de la Gira', icon: '🏢', new: LLEGADA + ' && !flag.b04_recepcion', action: { go: 'torre_lemnis_kanto' } },
				{ label: 'Silph S.A.', sub: 'El logo rojo de siempre. Las puertas, cerradas', icon: '🏬', action: { go: 'silph' } },
				{ label: 'Puerta Lemnis de Kanto', sub: 'Junto al parque, al oeste', icon: '♾️', new: LLEGADA + ' && !flag.b04_puerta_azafran', action: { go: 'puerta_azafran' } },
				{ label: 'Gimnasio de Azafrán', sub: 'La persiana está a medio bajar', icon: '🔮', new: 'flag.b04_recepcion && !flag.b04_sabrina_eco', action: { go: 'gym_azafran' } },
				{ label: 'Dojo Kárate', sub: 'Se oyen golpes y gritos de «¡HU!»', icon: '🥋', action: { go: 'dojo_karate' } },
				{ label: 'Jardines y solares', sub: 'Entre los bloques de oficinas hay más verde del que parece', icon: '🌿', action: { explore: 'grass' } },
				{ label: 'Un solar vallado', sub: 'Entre dos edificios, lleno de maleza y cosas', icon: '🧺', action: { gather: 'solar_azafran' } },
				{ label: 'Psíquica: una chica que mira una cuchara', sub: 'En un banco de la plaza', icon: '⚔️', action: { trainer: 'az_sayaka' } },
				{ label: 'Domador: un señor con látigo de juguete', sub: 'Pasea a un Tauros por la acera. Con correa', icon: '⚔️', action: { trainer: 'az_goro' } },
				{ label: 'Una casa con la puerta abierta', sub: 'Alguien repite todo lo que dicen los de la calle', icon: '🏠', talk: [{ script: 'b04_copiona' }] },
				{ label: 'Rumbo al norte', sub: 'La Ruta 5 empieza al final de la avenida', icon: '🧭', cond: T0_OK + ' && !flag.b04_t0_hecho', new: 'true', talk: [{ script: 'b04_t0_fin' }] },
			],
			rumors: [
				{ text: 'Silph S.A. lleva tres semanas cerrada «por auditoría interna». Los empleados entran por la puerta de atrás y no hablan con nadie. Ni entre ellos.' },
				{ text: 'La Torre Lemnis Kanto se construyó en once meses. Los de la obra dicen que nunca vieron los planos enteros: a cada cuadrilla le daban una hoja.' },
				{ text: 'Hace años, el Dojo Kárate era el gimnasio oficial de Azafrán. Luego llegó Sabrina y les ganó a todos sin tocarlos. El cartel del Dojo sigue diciendo «Gimnasio». Nadie se atreve a quitarlo.' },
				{ text: 'La líder del gimnasio, Sabrina, no ha querido entrar en el Programa de Intercambio. Dicen que vio algo que no le gustó. Dicen que no ha dicho el qué.' },
				{ cond: LLEGADA, text: 'El Tren Magnético de anoche llegó tarde. Otra vez. Dicen que se paró en el túnel de la frontera. Dicen que en ese túnel no hay nada donde pararse.' },
				{ text: 'Al norte, por la Ruta 5, está **Ciudad Celeste**. Su líder, Misty, tiene fama de no perder casi nunca. Y de acordarse de todos los que le ganaron.' },
			],
			encounters: {
				grass: [
					{ sp: 'pidgeotto', lv: [44, 46], w: 30 },
					{ sp: 'persian', lv: [44, 47], w: 25 },
					{ sp: 'gloom', lv: [45, 47], w: 15 },
					{ sp: 'weepinbell', lv: [45, 47], w: 15 },
					{ sp: 'growlithe', lv: [44, 46], w: 8 },
					{ sp: 'vulpix', lv: [44, 46], w: 6, time: 'day' },
					{ sp: 'hypno', lv: [46, 48], w: 10, time: 'night' },
					{ sp: 'mrmime', lv: [46, 48], w: 3 },
					{ sp: 'heliolisk', lv: [46, 48], w: 5, displaced: true },
					{ sp: 'flaaffy', lv: [45, 47], w: 5, displaced: true },
				],
			},
		},

		// ---------- Estación de Azafrán ----------
		estacion_azafran: {
			name: 'Estación del Tren Magnético de Azafrán', short: 'Estación de Azafrán', parent: 'azafran', kind: 'building',
			bg: { type: 'indoor', wall: '#cfd6e2', floor: '#4a4f6a' },
			desc: 'La gemela de la estación de Trigal: el mismo andén limpísimo, el mismo tren blanco flotando a dos dedos de la vía, la misma placa en la pared: «Proyecto conjunto de Silph S.A. y patrocinadores».\n\nUn panel de llegadas parpadea sobre las taquillas. Huele a café de máquina y a ozono.',
			mapNote: 'Tren a Trigal (Johto) · objetos perdidos',
			onEnter: [{ script: 'b04_tren_salto', cond: EN_TREN, once: false }],
			spots: [
				{ label: '🚆 Tren a Trigal', sub: 'Tren Magnético Azafrán–Trigal', icon: '🚆', cond: 'flag.b04_inicio_hecho', action: { go: 'estacion_magnetica' } },
				{ label: 'El panel de llegadas', icon: '🕰️', talk: [{ script: 'b04_panel_azafran' }] },
				{ label: 'Rhi', sub: 'Sentada en su mochila, al final del andén', icon: '⚽', cond: 'flag.b04_tren_hecho && !beat("rhi_5") && !flag.b04_t0_hecho', talk: [{ script: 'b04_rhi_estacion' }] },
				{ label: 'Objetos perdidos', sub: 'Una ventanilla con una campanita y nadie detrás', icon: '🧳', action: { gather: 'perdidos_azafran' } },
			],
		},

		// ---------- Torre Lemnis Kanto ----------
		torre_lemnis_kanto: {
			name: 'Torre Lemnis Kanto', parent: 'azafran', kind: 'building',
			bg: { type: 'indoor', wall: '#1f2e4f', floor: '#cfd6e2' },
			desc: 'Un vestíbulo de tres pisos de alto, todo cristal, mármol blanco y acero cepillado. En el suelo, una lemniscata enorme de mosaico azul y plata; la gente la rodea sin pisarla, sin que nadie se lo haya pedido.\n\nAl fondo, los ascensores. A la derecha, un ventanal da a la fachada de **Silph S.A.**, tan cerca que podrías leer los papeles de sus mesas. Arriba, la **pasarela** de cristal cruza de un edificio al otro.',
			descs: [{ cond: 'flag.b04_recepcion', text: 'El vestíbulo, sin la Gira, parece más grande y más frío. Han quitado el escenario y las sillas. Solo queda la lemniscata del suelo, que nadie pisa, y los ascensores, que suben a plantas que no tienen botón.\n\nPor el ventanal se ve Silph S.A. Hay luz en la planta once. Siempre hay luz en la planta once.' }],
			mapNote: 'Recepción de la Gira · Lemnis Kanto',
			onEnter: [{ script: 'b04_recepcion', cond: '!flag.b04_recepcion', once: true }],
			spots: [
				{ label: 'Serafina Lemnis', sub: 'Habla por teléfono sin mover los labios', icon: '♾️', cond: 'flag.b04_recepcion && !(' + TRATO_ROTO + ')', talk: [{ script: 'b04_sera_despues' }] },
				{ label: 'El directivo de Lemnis Kanto', sub: 'Ensaya sonrisas delante del ventanal', icon: '👔', cond: 'flag.b04_recepcion && ' + TRATO_ROTO, talk: [{ script: 'b04_directivo_despues' }] },
				{ label: 'Alexia', sub: 'Fotografía la lemniscata del suelo desde todos los ángulos', icon: '📸', cond: 'flag.b04_recepcion', talk: [{ script: 'b04_alexia_torre' }] },
				{ label: 'Mostrador de recepción', sub: 'Un recepcionista con una sonrisa de catálogo', icon: '🛎️', talk: [{ script: 'b04_recepcionista' }] },
				{ label: 'Los ascensores', icon: '🛗', talk: [{ script: 'b04_ascensores' }] },
				{ label: 'El ventanal que da a Silph', icon: '🪟', talk: [{ script: 'b04_ventanal' }] },
			],
		},

		// ---------- Silph S.A. (cerrada; T2 la abre) ----------
		silph: {
			name: 'Silph S.A.', parent: 'azafran', kind: 'building',
			bg: { type: 'indoor', wall: '#e9e8e0', floor: '#8a3a2a' },
			desc: 'El vestíbulo de Silph S.A. es más viejo que el de al lado y se nota: moqueta roja gastada en el camino de la puerta al mostrador, plantas de plástico, un retrato del presidente con veinte años menos.\n\nLos tornos de acceso están apagados. Detrás, un **guardia** con cara de llevar tres semanas diciendo lo mismo.',
			mapNote: 'Cerrada al público (auditoría interna)',
			spots: [
				{ label: 'El guardia de los tornos', sub: 'Tiene un cartel en la mano. Lo levanta antes de que hables', icon: '🚧', talk: [{ script: 'b04_silph_guardia' }] },
				{ label: 'El directorio de plantas', icon: '📋', talk: [{ script: 'b04_silph_directorio' }] },
			],
		},

		// ---------- Puerta Lemnis de Kanto ----------
		puerta_azafran: {
			name: 'Puerta Lemnis de Kanto', parent: 'azafran', kind: 'building',
			bg: { type: 'plaza', landmark: 'gate' },
			desc: 'El arco de la Puerta de Kanto se levanta en un parque pequeño, entre olmos podados en forma de cubo: dos columnas de metal plateado unidas por una **lemniscata** que zumba. Al otro lado, borrosas como a través del agua, se turnan la plaza de la Torre Prisma de Luminalia y el andén de una Puerta de Johto.\n\nUn técnico de Lemnis con una tablet atiende una mesa plegable con un cartel: «Gira Interregional · registro de viajeros».',
			descs: [{ cond: 'flag.b04_puerta_azafran', text: 'La lemniscata de la Puerta de Kanto zumba, azul y plata. Al otro lado se adivina Luminalia; luego, Trigal; luego, otra vez Luminalia, como un canal de televisión que nadie se decide a dejar quieto.\n\nTu Pokédex ya está registrada. Puedes cruzar cuando quieras.' }],
			mapNote: 'Viaje a Kalos (Luminalia) y a Johto (Trigal)',
			onEnter: [{ script: 'b04_puerta_eco', cond: '!flag.b04_puerta_eco', once: true }],
			spots: [
				{ label: 'Cruzar a Kalos (Luminalia)', sub: 'Puerta Lemnis', icon: '🌀', cond: 'flag.b04_puerta_azafran', action: { go: 'luminalia_plaza' } },
				{ label: 'Cruzar a Johto (Trigal)', sub: 'Puerta Lemnis', icon: '🌀', cond: 'flag.b04_puerta_azafran', action: { go: 'puerta_trigal' } },
				{ label: 'Registro de viajeros', sub: 'Un técnico de Lemnis con una tablet', icon: '💻', new: '!flag.b04_puerta_azafran', talk: [{ cond: 'flag.b04_puerta_azafran', script: 'b04_puerta_tecnico_2' }, { cond: 'flag.b04_recepcion', script: 'b04_puerta_registro_check' }, { script: 'b04_puerta_registro' }] },
				{ label: 'Dos hombres recién llegados de Kalos', sub: 'Uno lleva bigote postizo. El otro, de verdad', icon: '🕵️', cond: 'flag.b04_recepcion && !flag.b04_lebrun_azafran', new: 'true', talk: [{ script: 'b04_lebrun_azafran' }] },
				{ label: 'Handsome', sub: 'Se ha quitado el bigote. Lo guarda en el bolsillo, por si acaso', icon: '🕵️', cond: 'flag.b04_lebrun_azafran && !flag.b04_ysolde_plan', talk: [{ script: 'b04_handsome_despues' }] },
			],
		},

		// ---------- Dojo Kárate ----------
		dojo_karate: {
			name: 'Dojo Kárate', parent: 'azafran', kind: 'gym',
			bg: { type: 'gym', wall: '#8a5a3a', floor: '#d8c49a' },
			desc: 'Un tatami enorme, vigas de madera oscura y un olor a sudor viejo y a cera nueva. Sobre la puerta, un cartel de madera tallada: «**GIMNASIO** DOJO KÁRATE». Alguien ha clavado debajo, más pequeño: «(no oficial)».\n\nLos cinturones negros entrenan por parejas. *¡HU! ¡HA!* Al fondo, delante de una pila de tablas, un hombre descalzo mira las tablas como si le debieran dinero.',
			mapNote: 'Kiyo · entrenamiento (nivel recomendado 51)',
			spots: [
				{ label: 'Kiyo', sub: 'Delante de una pila de tablas', icon: '🥋', new: '!flag.b04_kiyo_dojo', talk: [{ cond: 'flag.b04_kiyo_dojo', script: 'b04_kiyo_despues' }, { script: 'b04_kiyo_dojo' }] },
				{ label: 'Entrenar en el tatami', sub: 'Entrenamiento (nivel recomendado 51)', icon: '🥋', action: { training: { cap: 51, prize: { wins: 3, script: 'p7_premio_dojo' }, trainers: ['dojo_az_1', 'dojo_az_2', 'dojo_az_3', 'dojo_az_4'], wild: [{ sp: 'machoke', lv: [47, 50] }, { sp: 'primeape', lv: [47, 50] }, { sp: 'hitmontop', lv: [48, 50] }], npc: 'kiyo', closed: 'Kiyo mira a tu equipo de arriba abajo y deja de contar. «Ya está. Ya no necesitan pegarle a mis tablas. Ahora tienen que pegarle a algo que les devuelva el golpe. Al norte hay una líder que lo hace muy bien».' } } },
				{ label: 'Cinturón negro: Hideki', sub: 'Hace flexiones con un dedo. Con el otro te saluda', icon: '⚔️', action: { trainer: 'dojo_az_1' } },
				{ label: 'Cinturón negro: Asami', sub: 'Lleva vendas en las manos y una sonrisa peligrosa', icon: '⚔️', action: { trainer: 'dojo_az_2' } },
				{ label: 'El cartel de la puerta', icon: '🪵', talk: [{ script: 'b04_dojo_cartel' }] },
			],
		},

		// ---------- Gimnasio de Azafrán (en pausa) ----------
		gym_azafran: {
			name: 'Gimnasio de Azafrán', parent: 'azafran', kind: 'gym',
			bg: { type: 'gym', wall: '#2a2440', floor: '#6a4a8a' },
			desc: 'A oscuras. El suelo está lleno de **baldosas de teletransporte**, apagadas, como charcos secos. Las paredes no tienen ventanas.\n\nEn el centro de la sala, en una silla de respaldo alto, una mujer de pelo negro muy largo está sentada con los ojos cerrados. Alrededor de ella flotan tres cucharas. Ninguna se cae.\n\nUn cartel junto a la puerta: «Gimnasio **en pausa** por el Programa de Intercambio. La líder no da medallas. La líder sí da consejos. A veces».',
			mapNote: 'Sabrina (sin medalla en esta temporada)',
			spots: [
				{ label: 'Sabrina', sub: 'Las cucharas giran despacio a su alrededor', icon: '🔮', new: '!flag.b04_sabrina_eco', talk: [{ cond: 'flag.b04_sabrina_eco', script: 'b04_sabrina_despues' }, { cond: 'flag.b04_recepcion', script: 'b04_sabrina_check' }, { script: 'b04_sabrina' }] },
				{ label: 'Las baldosas apagadas', icon: '🌀', talk: [{ script: 'b04_baldosas' }] },
			],
		},
	},

	// =====================================================================
	// PARCHES A LUGARES DE BLOQUES ANTERIORES
	// =====================================================================
	patches: {
		estacion_magnetica: {
			spots: [{ label: '🚆 Subir al Tren Magnético', sub: 'La Gira ya está a bordo', icon: '🎫', cond: EN_TREN, new: EN_TREN, action: { go: 'tren_magnetico' } }],
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Rival opcional -----
		rhi_5: { name: 'Rhi', cls: 'Rival', npc: 'rhi', ai: 3, iv: 27, reward: 3000,
			team: [
				{ sp: 'falinks', lv: 44, moves: ['closecombat', 'megahorn', 'rockslide', 'ironhead'], ability: 'battlearmor', nature: 'adamant', iv: 26 },
				{ sp: 'sirfetchd', lv: 45, moves: ['leafblade', 'brutalswing', 'closecombat', 'knockoff'], ability: 'steadfast', item: 'leek', nature: 'adamant', iv: 27 },
				{ sp: 'toxtricity', lv: 45, moves: ['overdrive', 'sludgebomb', 'hypervoice', 'voltswitch'], ability: 'punkrock', nature: 'modest', iv: 27 },
				{ sp: 'corviknight', lv: 46, moves: ['bravebird', 'ironhead', 'bodypress', 'payback'], ability: 'mirrorarmor', nature: 'impish', iv: 27 },
				{ sp: 'cinderace', lv: 48, moves: ['pyroball', 'bounce', 'uturn', 'zenheadbutt'], ability: 'blaze', item: 'oranberry', nature: 'jolly', iv: 29 },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Partido amistoso en el pasillo! El que pierda paga los sándwiches. ¡Cinderace sale al final, como las estrellas!',
			win: '…Bueno. Bueno. Tres puntos para ti. Pero que conste que había un bache.',
			lose: '¡GOLAZO! ¡A doscientos cuarenta por hora! ¡Eso no lo ha hecho nadie nunca! …Creo.' },

		// ----- Aspirantes de la Gira en el tren -----
		tren_dario: { name: 'Darío', cls: 'Aspirante', ai: 2, reward: 1880,
			team: [
				{ sp: 'quagsire', lv: 46, moves: ['earthquake', 'waterfall', 'yawn', 'toxic'] },
				{ sp: 'xatu', lv: 46, moves: ['psychic', 'airslash', 'futuresight', 'confuseray'] },
				{ sp: 'ursaring', lv: 47, moves: ['slash', 'crunch', 'playrough', 'rest'] },
			],
			intro: 'Siete medallas y me toca el asiento del pasillo. ¿Tú sabes lo que es eso? Combate. Por el asiento de la ventana.',
			win: 'Quédate con la ventana. Yo me quedo con el Ursaring. Que ronca, pero es mío.',
			look: { hair: 'curly', hairColor: '#3a2a1e', outfit: '#6a9a5a', outfit2: '#e9e3d0', skin: 3, eyesStyle: 'sleepy', mouth: 'flat' } },
		tren_mireille: { name: 'Mireille', cls: 'Aspirante', ai: 2, reward: 1880,
			team: [
				{ sp: 'florges', lv: 46, moves: ['moonblast', 'petalblizzard', 'grassknot', 'synthesis'] },
				{ sp: 'dragalge', lv: 48, moves: ['sludgebomb', 'dragonpulse', 'scald', 'toxic'] },
				{ sp: 'pyroar', lv: 47, moves: ['flamethrower', 'hypervoice', 'darkpulse', 'nobleroar'] },
			],
			intro: 'En Kalos los trenes tienen moqueta. Aquí, no. Necesito pegarle a algo. ¿Te importa?',
			win: 'Bueno. Al menos los asientos son cómodos. Para no tener moqueta.',
			look: { hair: 'bob', hairColor: '#e9d36a', outfit: '#e98aa8', outfit2: '#2b2b38', skin: 0, eyesStyle: 'sharp', mouth: 'flat' } },

		// ----- Calles de Azafrán -----
		az_sayaka: { name: 'Sayaka', cls: 'Psíquica', ai: 2, reward: 1960,
			team: [
				{ sp: 'mrmime', lv: 47, moves: ['psychic', 'dazzlinggleam', 'reflect', 'lightscreen'] },
				{ sp: 'hypno', lv: 47, moves: ['psychic', 'hypnosis', 'dreameater', 'nastyplot'] },
				{ sp: 'alakazam', lv: 49, moves: ['psychic', 'shadowball', 'focusblast', 'calmmind'] },
			],
			intro: 'Llevo tres años intentando doblar esta cuchara. Hoy ha temblado. Creo que ha sido por ti. Combatamos, a ver si tiembla más.',
			win: 'No ha temblado. Ha sido el tranvía. Siempre es el tranvía.',
			look: { hair: 'long', hairColor: '#2a2440', outfit: '#8a2a4a', outfit2: '#e9e3d0', skin: 0, eyesStyle: 'sleepy', mouth: 'flat' } },
		az_goro: { name: 'Goro', cls: 'Domador', npc: 'domador', ai: 2, reward: 1960,
			team: [
				{ sp: 'arbok', lv: 47, moves: ['gunkshot', 'crunch', 'glare', 'earthquake'] },
				{ sp: 'tauros', lv: 47, moves: ['takedown', 'zenheadbutt', 'earthquake', 'rockslide'] },
				{ sp: 'arcanine', lv: 49, moves: ['flareblitz', 'extremespeed', 'crunch', 'wildcharge'] },
			],
			intro: 'En el circo me decían que un Tauros no se puede pasear por la ciudad. Pues aquí estamos. Con correa y con multa. ¡Al ataque!',
			win: 'La multa, encima, la tengo que pagar yo. El Tauros no tiene bolsillos.' },

		// ----- Dojo Kárate (entrenamiento, tope 51) -----
		dojo_az_1: { name: 'Hideki', cls: 'Cinturón Negro', ai: 2, reward: 1920,
			team: [
				{ sp: 'machoke', lv: 48, moves: ['dynamicpunch', 'knockoff', 'rockslide', 'poisonjab'] },
				{ sp: 'hitmonlee', lv: 48, moves: ['highjumpkick', 'blazekick', 'knockoff', 'rockslide'] },
			],
			intro: '¡El maestro ha vuelto! ¡Diez años esperándolo! Bueno, yo llevo dos. Pero los otros me lo han contado. ¡HU!',
			win: 'Diez flexiones por perder. Con un dedo. ¡HA!',
			look: { hair: 'short', hairColor: '#2b2b38', outfit: '#e9e8e0', outfit2: '#2b2b38', skin: 2, acc: 'bandana', eyesStyle: 'sharp', mouth: 'grin' } },
		dojo_az_2: { name: 'Asami', cls: 'Cinturón Negro', ai: 3, reward: 1960,
			team: [
				{ sp: 'poliwrath', lv: 48, moves: ['waterfall', 'brickbreak', 'icepunch', 'hypnosis'] },
				{ sp: 'primeape', lv: 49, moves: ['crosschop', 'uturn', 'stoneedge', 'stompingtantrum'] },
			],
			intro: 'Aquí le pegamos a las tablas. Tú pareces una tabla con buena actitud. Vamos allá.',
			win: 'Bueno, no eres una tabla. Las tablas no ganan.',
			look: { hair: 'ponytail', hairColor: '#4a2a1a', outfit: '#e9e8e0', outfit2: '#2b2b38', skin: 3, acc: 'bandana', eyesStyle: 'sharp', mouth: 'smile' } },
		dojo_az_3: { name: 'Kenta', cls: 'Karateka', ai: 2, reward: 1960,
			team: [
				{ sp: 'hitmonchan', lv: 49, moves: ['drainpunch', 'firepunch', 'icepunch', 'thunderpunch'] },
				{ sp: 'hariyama', lv: 49, moves: ['closecombat', 'heavyslam', 'knockoff', 'fakeout'] },
			],
			intro: 'El maestro dice que el movimiento secreto es perder. Yo pienso perder muchísimo para aprenderlo bien. Empezando ahora. ¡HU!',
			win: '¡Ya lo noto! ¿Lo notas tú? Creo que estoy cerca.',
			look: { hair: 'spiky', hairColor: '#2b2b38', outfit: '#e9e8e0', outfit2: '#8a3a2a', skin: 1, eyesStyle: 'happy', mouth: 'open' } },
		dojo_az_4: { name: 'Yumi', cls: 'Cinturón Negro', ai: 3, reward: 2000,
			team: [
				{ sp: 'medicham', lv: 49, moves: ['highjumpkick', 'zenheadbutt', 'icepunch', 'thunderpunch'] },
				{ sp: 'machamp', lv: 50, moves: ['dynamicpunch', 'knockoff', 'stoneedge', 'poisonjab'] },
			],
			intro: 'Diez años aquí sin maestro. Entrenando solas. Ahora vuelve y lo primero que hace es pedir pan. Necesito desahogarme.',
			win: 'Mejor. Mucho mejor. Gracias. ¿Tienes pan?',
			look: { hair: 'bun', hairColor: '#1a1a1a', outfit: '#e9e8e0', outfit2: '#2b2b38', skin: 2, acc: 'bandana', eyesStyle: 'sharp', mouth: 'flat' } },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== INICIO ===================
		b04_inicio: [
			{ if: 'flag.b04_inicio_hecho', then: [{ end: true }] },
			{ set: { 'flag.b04_inicio_hecho': true } },
			{ quest: 'b04_m1', stage: 'tren' },
			{ say: 'rotom', text: '¡Bzzt! Billete de la Gira Interregional, a tu nombre. **Tren Magnético Trigal–Azafrán**, salida de las 23:05. Vagón 3, asiento 12A. ¡Ventanilla! He hecho trampas con el sistema. Es broma. No es broma.' },
			{ text: 'Haces lo que se hace antes de un viaje largo: recoges, cuentas Poké Balls que ya habías contado, miras a tu alrededor como si Johto fuera a cambiar de sitio en cuanto te des la vuelta.' },
			{ text: 'Y, sin saber muy bien cómo, ya estás en el andén de la estación de Ciudad Trigal. El panel de salidas dice **23:05 · AZAFRÁN**. Debajo, el mismo letrero escrito a mano de siempre: «Retraso probable».' },
			{ go: 'estacion_magnetica', silent: true },
			{ text: 'El andén está lleno de mochilas, Poké Balls y gente nerviosa con siete medallas en la chaqueta. Una pancarta azul y plata cuelga del techo: «**¡La Gira continúa en Kanto!** · Un mundo. Una liga.»' },
			{ say: 'rhi', text: '¡{jugador}! ¡Aquí! —Rhi agita un brazo desde la otra punta del andén, con la chaqueta del 9 atada a la cintura—. ¡Siete medallas, tú y yo! ¡La octava es la que cuenta! ¡Nos vemos dentro!' },
			{ text: 'Un poco más allá, **Bastien** pelea con una maleta que no cierra. Te saluda con la cabeza, porque las dos manos las tiene ocupadas en la maleta.' },
			{ text: 'Y en la escalera, con la cámara colgada del cuello, **Alexia** hace fotos del panel de salidas. Te ve, levanta un pulgar y vuelve a fotografiar el letrero de «Retraso probable». Le parece, está claro, un titular.' },
			{ choice: [
				{ text: 'Subir al tren', then: [{ go: 'tren_magnetico' }] },
				{ text: 'Todavía no (preparar el equipo en Trigal)', then: [
					{ say: 'rotom', text: '¡Va! El tren sale cuando subamos nosotros. Bueno, no. Pero la Gira ha reservado el vagón 3 entero, así que nos esperan. Dicen. Más o menos.' },
				] },
			] },
		],
		b04_tren_arranca: [
			{ set: { 'flag.b04_tren_arranca': true } },
			{ text: 'Las puertas se cierran con un suspiro. Un silbido largo, muy suave. Y el andén empieza a moverse… no: eres tú. El tren se eleva dos dedos sobre la vía y arranca sin un solo traqueteo.' },
			{ say: 'rotom', text: '¡Flotamos! ¡De verdad flotamos! Doscientos cuarenta kilómetros por hora y no se mueve ni el agua de los vasos. ¡Bzzt! Esto es lo mejor que me ha pasado desde que me pusieron en una Pokédex.' },
			{ text: '{riolu} se sienta en el asiento de la ventanilla, el tuyo, y pega la cara al cristal. Las luces de Trigal se van quedando atrás. Las orejas le tiemblan un poco con el zumbido del tren, como si lo oyera de una forma en que tú no lo oyes.', cond: LUC },
			{ text: 'Copito sale de su Poké Ball sin que la llames, se sube a tus rodillas y se queda mirando el tendido eléctrico de la ventanilla. Le chisporrotea la lana. A ella le encanta.', cond: MAREEP_AQUI + ' && ' + COPITO_TUYA },
			{ text: 'Nieve sale de su Poké Ball sin que la llames, se sube a tus rodillas y se queda mirando el tendido eléctrico de la ventanilla. Le chisporrotea la lana. A ella le encanta.', cond: MAREEP_AQUI + ' && !' + COPITO_TUYA },
		],

		// =================== EN EL TREN ===================
		b04_rhi_tren: [
			{ set: { 'flag.b04_rhi_tren': true } },
			{ text: 'Rhi da toques a una Poké Ball en el pasillo, con el empeine, la rodilla, el empeine otra vez. Una señora mayor la mira con terror cada vez que la Poké Ball pasa cerca de su café.' },
			{ say: 'rhi', text: '¡Por fin! Llevo media hora sin nadie con quien hablar. Darío ronca y la de Kalos solo habla de moqueta.' },
			{ say: 'rhi', text: 'Siete medallas. La octava es en Celeste, ¿lo sabías? La líder es de Agua. Mi Cinderace odia el agua. Yo odio el agua. Vamos a ganarle igual. Por cabezotas.' },
			{ if: 'beat("rhi_4")', then: [
				{ say: 'rhi', text: 'Y no se me ha olvidado lo de Olivo. —Te señala con la Poké Ball—. Me debes la revancha. Bueno, te la debo yo. Bueno, la quiero yo. Ahora.' },
			], else: [
				{ say: 'rhi', text: 'Y hace demasiado que no jugamos un partido de verdad. Tú y yo. Aquí. Ahora.' },
			] },
			{ say: 'rhi', text: 'El pasillo mide cuarenta metros. Es casi un campo de fútbol sala. ¿Jugamos?' },
			{ call: 'b04_rhi_reto' },
		],
		b04_rhi_estacion: [
			{ text: 'Rhi está sentada en su mochila al final del andén, comiéndose un sándwich triangular del tren con cara de odiarlo.' },
			{ say: 'rhi', text: 'No me he ido. Te estaba esperando. No te lo creas mucho: también estaba esperando a que bajase el precio de los helados de la estación. No ha bajado.' },
			{ say: 'rhi', text: '¿Qué? ¿Jugamos el partido que dejamos a medias en el tren o te vas a Celeste sin calentar?' },
			{ call: 'b04_rhi_reto' },
		],
		b04_rhi_reto: [
			{ choice: [
				{ text: '«Juguemos.»', then: [
					{ say: 'rhi', text: '¡Eso! Pero ve antes al botiquín, o al Centro, o a donde sea. No pienso ganarle a un equipo cansado. No cuenta. Es como meter un gol con la portería vacía.' },
					{ choice: [
						{ text: 'Dejar que curen a tu equipo primero', then: [
							{ heal: 'La enfermera de la Gira (o el Centro Pokémon, en la estación) revisa a tu equipo. Rhi espera dando saltitos para calentar.' },
							{ call: 'b04_rhi_combate' },
						] },
						{ text: '«Estamos bien así.»', then: [{ call: 'b04_rhi_combate' }] },
					] },
				] },
				{ text: '«Ahora no.»', then: [
					{ say: 'rhi', text: 'Ok. Pero que sepas que el balón sigue aquí. Y yo también. No me voy a ninguna parte. Bueno, a Kanto. Pero tú también.' },
				] },
			] },
		],
		b04_rhi_combate: [
			{ battle: 'rhi_5', lose: 'continue',
				onWin: [
					{ af: { rhi: 5 } },
					{ say: 'rhi', text: '…Uf. —Se deja caer en un asiento, despeinada—. Ok. Limpio. Sin trampas. Me has ganado limpio a doscientos cuarenta por hora. Eso no me lo había hecho nadie.' },
					{ say: 'rhi', text: '¿Sabes qué? Mi padre va a ver la Copa por la tele. Me lo dijo ayer. Dice que se ha comprado una tele nueva para verla. Con el dinero del finiquito. —Se queda callada un segundo—. Así que más vale que lleguemos los dos. Que, si llego yo sola, no tiene gracia ganar.' },
					{ text: 'Te tira un sándwich triangular del vagón restaurante. Es de atún. Ha perdido, así que paga. Las reglas son las reglas.' },
					{ give: 'sitrusberry', n: 2 },
				],
				onLose: [
					{ say: 'rhi', text: '¡Toma! ¡Te he ganado en un tren! ¡Esto lo cuento en Galar! …Pero no se lo digas a nadie, que en Galar no hay trenes que floten y no me van a creer.' },
					{ say: 'rhi', text: 'Venga, la revancha cuando quieras. Que me sabe mejor si me cuesta.' },
					{ heal: 'Rhi silba y llama a la enfermera de la Gira, que se lleva a tu equipo al botiquín con cara de «otra vez fútbol en el pasillo». Vuelven como nuevos.' },
				],
			},
		],
		b04_rhi_despues: [
			{ text: 'Rhi tiene los cascos puestos y la frente pegada a la ventanilla. Cuando te ve, se quita un auricular.' },
			{ say: 'rhi', text: 'Escucho los partidos de Galar de este año. Mi equipo de siempre va último. Sin mí. —Sonríe de lado—. Normal.' },
		],

		b04_bastien_tren: [
			{ set: { 'flag.b04_bastien_tren': true } },
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ text: 'Bastien va en el vagón de primera, en un asiento de cuero con un reposacabezas que lleva bordada la lemniscata. Tiene delante un fajo de papeles grapados y el ceño muy fruncido.' },
				{ say: 'bastien', text: '¡{jugador}! Siéntate, siéntate. El asiento de al lado también es «cortesía del patrocinador». Todo es cortesía del patrocinador. Hasta el agua. Hasta el ceño fruncido, creo.' },
				{ say: 'bastien', text: 'Me han mandado un anexo nuevo del contrato. Cuarenta páginas. Lo estoy leyendo con la regla, línea a línea, como me enseñó mi padre a leer las cosas que no quieres firmar.' },
			] },
			{ if: 'flag.b01_bastien_rompe', then: [
				{ text: 'Bastien va en segunda, en el último asiento, con la cazadora de pana remendada por los dos codos y un bocadillo envuelto en papel de periódico. Tiene unos papeles en las rodillas y el ceño muy fruncido.' },
				{ say: 'bastien', text: '¡{jugador}! El billete me lo ha pagado la Gira. Es lo único que me paga la Gira. Lemnis dice que un participante sin patrocinador «no es una prioridad». Pero aquí estoy. No prioritario y con bocadillo.' },
				{ say: 'bastien', text: 'Estos papeles son de los abogados de Lemnis. Todavía. Una demanda tiene muchas páginas. Las leo con la regla, línea a línea. Por deporte.' },
			] },
			{ if: 'flag.b01_bastien_silencio', then: [
				{ text: 'Bastien va en primera, en un asiento de cuero, con la chaqueta de Lemnis abrochada hasta arriba. En la pared del vagón hay un cartel de la Gira con su cara sonriendo. El Bastien de verdad no sonríe. Tiene unos papeles grapados delante y el ceño muy fruncido.' },
				{ say: 'bastien', text: 'Hola, {jugador}. —Mira el cartel, luego a ti—. Sí. Ese soy yo. Me hicieron repetir la sonrisa catorce veces. Dicen que la primera parecía «de rehén».' },
				{ say: 'bastien', text: 'Me han mandado un anexo del contrato. Cuarenta páginas. Lo leo con la regla, línea a línea. Es lo único que todavía hago a mi manera.' },
			] },
			{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe && !flag.b01_bastien_silencio', then: [
				{ text: 'Bastien va dos filas por delante, con unos papeles grapados en las rodillas y el ceño muy fruncido.' },
				{ say: 'bastien', text: '¡{jugador}! Perdona, estaba leyendo. Papeles del patrocinador. Los leo con la regla, línea a línea, como me enseñó mi padre a leer las cosas que no quieres firmar.' },
			] },
			{ text: 'En la solapa, la insignia de hojalata del Froakie sin logo. La toca sin darse cuenta, como quien toca un amuleto.', cond: 'flag.b02_noa_trigal' },
			{ say: 'bastien', text: 'Greninja va dormido en su Poké Ball. Odia los trenes. Dice, a su manera, que el agua de debajo de un puente es más honrada. —Se encoge de hombros—. Creo que se refiere a los ríos.' },
		],
		b04_bastien_tren_2: [
			{ say: 'bastien', text: 'Página treinta y uno. Cláusula catorce. —Pasa la regla por una línea—. Aquí pone «disponibilidad». Disponibilidad ¿para qué? No lo dice. Es lo malo de las palabras que no dicen para qué.' },
			{ say: 'bastien', text: 'No me hagas caso. Cuando llegue a la cuarenta te lo cuento todo. Con dibujos.' },
		],

		b04_alexia_tren: [
			{ set: { 'flag.b04_alexia_tren': true } },
			{ text: 'Alexia escribe en una libreta de reportera, a una velocidad que no es humana. Ha puesto la cámara en el asiento de al lado, con el cinturón de seguridad abrochado.' },
			{ say: 'alexia', text: '¡{jugador}! Crónica del viaje para el especial de la Gira. Siéntate. Te estoy poniendo un apodo. A todos los del vagón les pongo uno. Mira.' },
			{ text: 'Te enseña la página: «**El de Verde** (ronca, Ursaring). **La de Rosa** (moqueta). **La Delantera** (balón, peligro). **Pana** (contrato). **La del Termo** (vagón restaurante; no sonríe; mide cosas)».' },
			{ say: 'alexia', text: 'Y tú eres **Mariquita**. Por la suerte que tienes con los transportes. Una Puerta te mandó a un bosque tres días. Te pusiste delante de un Gyarados rojo. A ver qué te hace este tren.' },
			{ if: 'flag.b01_prensa_verdad', then: [
				{ say: 'alexia', text: 'Mi productora quiere que te pregunte qué esperas de Kanto. Yo quiero preguntarte qué esperas que haya en Kanto. Que no es lo mismo. No contestes ninguna de las dos.' },
			] },
			{ if: 'flag.b01_prensa_lemnis', then: [
				{ say: 'alexia', text: 'Lemnis me ha pasado una lista de «preguntas sugeridas» para ti. Doce. Todas empiezan por «¿Qué tal…?». La he usado para envolver un sándwich.' },
			] },
			{ if: '!flag.b01_prensa_verdad && !flag.b01_prensa_lemnis', then: [
				{ say: 'alexia', text: 'Sigues sin querer salir en la radio, ¿no? Me parece bien. Te pongo en la crónica igual, pero de espaldas. Mariquita, de espaldas. Misteriosa.' },
			] },
		],
		b04_alexia_tren_2: [
			{ say: 'alexia', text: 'La del Termo lleva una hora mirando su taza de té sin beber. Eso no es normal. Eso es una noticia. O un hobby. Todavía no lo sé.' },
		],

		b04_magda_tren: [
			{ if: 'flag.b04_magda_tren', then: [{ end: true }] },
			{ set: { 'flag.b04_magda_tren': true } },
			{ text: 'En el vagón restaurante, junto a la ventanilla, hay una mujer de cuarenta y tantos años. Pelo gris acero, cortísimo. Abrigo largo gris abotonado hasta el cuello. Delante tiene un termo abierto, una taza de té y una libreta de hojas cuadriculadas.' },
			{ text: 'No bebe. Mira la superficie del té como quien mira un electrocardiograma.' },
			{ say: 'magda', as: 'Pasajera', text: 'Siéntese, si quiere. Pero no apoye el codo en la mesa. Estoy midiendo.' },
			{ choice: [
				{ text: '«¿Qué mide?»', then: [
					{ say: 'magda', as: 'Pasajera', text: 'La vibración. A doscientos cuarenta kilómetros por hora, este tren debería dejar el té liso como un espejo. Mire.' },
					{ text: 'Te asomas a la taza. En la superficie del té tiemblan unas ondas finísimas, en círculos, del centro hacia fuera. Muy despacio.' },
					{ say: 'magda', as: 'Pasajera', text: 'Cero coma tres milímetros. Algo tira del tendido un poco más de lo previsto. —Lo apunta—. Un poco. No es grave. Es interesante.' },
				] },
				{ text: '«¿Se le ha enfriado el té?»', then: [
					{ say: 'magda', as: 'Pasajera', text: 'No. El termo mantiene la temperatura doce horas. El té no es para beber. Bueno, después sí. Ahora es un instrumento.' },
				] },
				{ text: 'Sentarte en silencio', then: [
					{ text: 'Te sientas. Ella no dice nada durante un buen rato. Luego asiente, una vez, como si el silencio también fuera un dato y le hubiera salido bien.' },
				] },
			] },
			{ if: LUC, then: [
				{ text: '{riolu} se sienta a tu lado y la mira. Ella lo mira a él. Con interés, pero no del que pone la gente con los Lucario. Con otro.' },
				{ say: 'magda', as: 'Pasajera', text: 'Un Lucario en reposo consume menos energía que una bombilla de cuarenta vatios. Un Lucario atento, bastante más. —Lo apunta en una esquina de la libreta—. El suyo está atento.' },
				{ text: '{riolu} no le quita los ojos de encima. No gruñe. Solo mira. Como se mira algo que no se entiende del todo.' },
			] },
			{ text: 'Rhi pasa por el pasillo con su Poké Ball y casi le tira la taza. La mujer la sujeta sin mirar, con dos dedos.' },
			{ say: 'rhi', text: '¡Perdón! Qué mala suerte, ¿eh? Este tren es gafe, va siempre con retraso.' },
			{ say: 'magda', as: 'Pasajera', text: 'La mala suerte es solo estadística mal leída, señorita. Este tren no va con retraso. Va a la hora a la que tiene que ir. Los horarios son los que se equivocan.' },
			{ text: 'Rhi se queda un segundo con la boca abierta y se va sin contestar, lo cual, en Rhi, es un récord.' },
			{ choice: [
				{ text: '«¿Cómo se llama?»', then: [
					{ say: 'magda', as: 'Pasajera', text: 'Como pone en mi billete. —Da un golpecito a la libreta—. Y el billete lo llevo yo.' },
				] },
				{ text: '«¿Trabaja en trenes?»', then: [
					{ say: 'magda', as: 'Pasajera', text: 'Trabajo en que las cosas lleguen. Antes eran puentes. Un puente es un tren muy quieto.' },
				] },
				{ text: '«Que tenga buen viaje.»', then: [
					{ say: 'magda', as: 'Pasajera', text: 'Igualmente. —Por primera vez, casi sonríe—. Agárrese a algo en el túnel.' },
				] },
			] },
		],

		b04_maleta: [
			{ text: 'Una maleta verde, rígida, con ruedas, en el portaequipajes de encima de la fila 7. No tiene etiqueta. No tiene candado. No tiene dueño.' },
			{ text: 'Desde que subiste, todo el vagón ha preguntado de quién es. Nadie lo sabe. El revisor ha pasado tres veces, la ha mirado, ha mirado su lista y ha seguido de largo con cara de no querer saberlo.' },
			{ if: '!flag.b04_maleta', then: [
				{ set: { 'flag.b04_maleta': true } },
				{ say: 'rotom', text: '¡Bzzt! He escaneado la maleta. Resultado: «maleta». Es todo lo que sé. Es muy discreta. Me cae bien.' },
				{ text: '{riolu} la olfatea y se aparta. No con miedo: con aburrimiento. Debe de estar llena de calcetines.', cond: LUC },
			], else: [
				{ text: 'Sigue ahí. Sin dueño. Con mucha dignidad.' },
			] },
		],
		b04_ventanilla: [
			{ if: '!flag.b04_tren_hecho', then: [
				{ text: 'Por la ventanilla pasa Johto a oscuras: luces sueltas de granjas, un río plateado, el perfil negro de las montañas del este. Luego, de golpe, solo roca. Están entrando en las montañas que separan Johto de Kanto.' },
				{ text: 'En el cristal ves tu reflejo, el de {riolu} y, detrás, los de los aspirantes de la Gira, todos con la misma cara: siete medallas y ganas de que sea mañana.', cond: LUC },
			] },
		],

		// =================== EL TÚNEL ===================
		b04_tunel: [
			{ if: 'flag.b04_tren_hecho', then: [{ end: true }] },
			{ if: '!flag.b04_magda_tren', then: [
				{ set: { 'flag.b04_magda_tren': true } },
				{ text: 'Una mujer con un abrigo largo gris y el pelo gris acero muy corto se sienta en el asiento de enfrente. Trae un termo, una taza de té y una libreta cuadriculada. Deja la taza en la mesita plegable y se queda mirándola, sin beber.' },
				{ say: 'magda', as: 'Pasajera', text: 'No le importa, ¿verdad? En el vagón restaurante hay una niña que da patadas a la mesa. Arruina las mediciones. —Ni te mira—. Agárrese a algo en el túnel.' },
			] },
			{ text: 'El tren entra en un túnel. Largo. Muy largo. La roca pasa pegada a las ventanillas, a toda velocidad, gris, gris, gris.' },
			{ text: 'Y entonces, sin avisar, el zumbido grave del tren cambia de nota. Baja. Baja más. El tren frena, muy suave, tan suave que la gente tarda en darse cuenta… y se para.' },
			{ text: '*«Estimados viajeros: realizamos una breve parada técnica por una incidencia de calibración. Disculpen las molestias. Un mundo. Una liga.»*' },
			{ text: 'Las luces del vagón parpadean. Una vez. Dos. Y se apagan.' },
			{ if: LUC, then: [
				{ cutscene: { bg: { type: 'cave', dark: true, crystals: '#7fb0e0' }, start: 'dark', frames: [
					{ shake: 1, cam: 'still', text: 'Oscuridad total. Alguien grita. Un bebé empieza a llorar dos filas más allá. Un Pokémon gruñe en su Poké Ball.' },
					{ actors: [{ mon: '{riolu}', key: 'rio', at: 'center', enter: 'fade' }], fx: ['glow', 'ripple'], text: 'Y entonces se enciende una luz azul. {riolu} está de pie en el pasillo, con los ojos cerrados y las palmas abiertas. El aura le sale del pecho, tranquila, como el agua de una fuente.' },
					{ fx: ['light', 'aura'], text: 'Llena el vagón entero. Las caras de los pasajeros se vuelven azules, asombradas. El bebé deja de llorar y alarga la mano hacia la luz, como si se pudiera agarrar.' },
					{ actors: [{ key: 'rio', emote: 'sweat' }], text: '—¡Un Lucario linterna! —grita un niño. Su madre le manda callar. Luego se queda mirando también.' },
				] } },
				{ happy: { who: 'riolu', n: 10 } },
			], else: [
				{ text: 'Se encienden las luces de emergencia, rojas, en el suelo del pasillo. La gente se ríe un poco, nerviosa, como se ríe la gente en los ascensores.' },
			] },
			{ text: 'Por la ventanilla ves que el túnel se ensancha en una caverna enorme. Y en la caverna hay un edificio.' },
			{ text: 'Hormigón gris, sin ventanas salvo una hilera de rendijas iluminadas. Cables gruesos como troncos de árbol salen de él y suben por la roca hacia el techo. En la puerta, una lemniscata pequeña, azul y plata. Un cartel: «**Subestación PL-K · Puerta de Kanto** · Prohibido el paso».' },
			{ text: 'Zumba. Lo notas en los dientes, más que en los oídos.' },
			{ text: '{riolu} gira la cabeza hacia el edificio sin abrir los ojos. Las orejas, de punta. El aura le tiembla un instante, como la llama de una vela cuando se abre una puerta, y luego vuelve a estar quieta.', cond: LUC },
			{ say: 'rhi', text: '¿Esto qué es, el descanso? ¿Nos van a sacar naranjas?' },
			{ text: 'Alexia ya está pegada a la ventanilla con la cámara. *Clic. Clic.* Fuera, en la caverna, un guardia con la lemniscata en la gorra levanta una linterna hacia el tren, la mueve de un lado a otro, despacio: «no». Alexia baja la cámara. La sube otra vez cuando el guardia se da la vuelta.' },
			{ text: 'Bastien, en su asiento, aprovecha la luz para pasar otra página del contrato. No pierde el tiempo ni a oscuras.', cond: LUC },
			{ text: 'La mujer del termo mira su reloj. Mira la taza: la superficie del té está completamente lisa. Saca un bolígrafo y escribe en una servilleta de papel, deprisa, en columnas muy rectas.' },
			{ say: 'magda', as: 'Pasajera', text: 'Cuatro minutos. —Para sí misma, casi con cariño—. Mejor de lo previsto.' },
			{ text: 'Se levanta, cierra el termo, se abrocha el último botón del abrigo y se va hacia el fondo del tren, hacia los vagones de cola, sin prisa. Como quien conoce el camino.' },
			{ say: 'rotom', text: '¡Bzzt! Ya que estamos parados, aprovecho para escribir el Diario. ¡Un tren parado en un túnel es el sitio perfecto! Hay ambiente. Hay misterio. Hay sándwiches.' },
			{ diary: 'Hoy mi entrenador{|a|e} y yo tomamos el Tren Magnético a Kanto. ¡Flota! De verdad flota, como un balón que nunca toca el suelo (eso es mío, pero a Rhi le gustaría). Hay un vagón restaurante con sándwiches triangulares y una maleta verde que no es de nadie.\n\nAhora mismo estamos parados en un túnel larguísimo. Por la ventanilla se ve un edificio con muchas lucecitas y un zumbido que se nota en los dientes. Es la subestación de la …bzzt… sincronizando… sincronizando… …sincronizando… …conexión restablecida.\n\n¡Perdón! ¿Dónde estaba? ¡Ah, sí! ¡El tren! Se apagaron las luces y {riolu} iluminó el vagón entero, y un niño lo llamó «Lucario linterna». ¡Mañana, Kanto!', cond: 'flag.b01_diario && (' + LUC + ')' },
			{ diary: 'Hoy mi entrenador{|a|e} y yo tomamos el Tren Magnético a Kanto. ¡Flota! De verdad flota, como un balón que nunca toca el suelo (eso es mío, pero a Rhi le gustaría). Hay un vagón restaurante con sándwiches triangulares y una maleta verde que no es de nadie.\n\nAhora mismo estamos parados en un túnel larguísimo. Por la ventanilla se ve un edificio con muchas lucecitas y un zumbido que se nota en los dientes. Es la subestación de la …bzzt… sincronizando… sincronizando… …sincronizando… …conexión restablecida.\n\n¡Perdón! ¿Dónde estaba? ¡Ah, sí! ¡El tren! Se apagaron las luces y la gente se rio un poco, como en los ascensores. ¡Mañana, Kanto!', cond: 'flag.b01_diario && !(' + LUC + ')' },
			{ text: 'Las luces vuelven de golpe, blancas, y todo el vagón parpadea a la vez. El zumbido del tren sube de nota. Un empujón suavísimo en la espalda: están otra vez en marcha.' },
			{ text: '{riolu} abre los ojos y se sienta, como si no hubiera pasado nada. Un señor de la fila de atrás le ofrece medio sándwich. {riolu} lo acepta. Ha trabajado.', cond: LUC },
			{ text: 'El asiento de la mujer del termo sigue vacío. Sobre la mesita plegable se ha quedado la servilleta de papel.' },
			{ cutscene: { bg: { type: 'indoor', wall: '#e9e8e0', floor: '#3b4a6a' }, start: 'dark', frames: [
				{ cam: 'push', item: 'servilletam', fx: 'light', text: 'Una servilleta del vagón restaurante, con el logo del Tren Magnético en una esquina. Está llena de números en columnas tan rectas que parecen impresas.' },
				{ fx: 'heartbeat', color: '#1f4a9a', actors: [{ key: '_c', size: 'l' }], text: 'Abajo, una frase subrayada. Y una firma de una sola letra, pequeña y recta, como quien firma por costumbre: **M.**' },
			] } },
			{ give: 'servilletam' },
			{ say: 'rotom', text: '¡Bzzt! ¿«M.»? Hay muchísima gente que empieza por M. Muchísima. Mareep. Misty. Mamá. Magikarp, aunque los Magikarp no firman. —Pausa—. Lo guardo, por si vuelve a por ella.' },
			{ text: 'No vuelve. La buscas con la mirada por el pasillo, en el vagón restaurante, en la cola del baño. No está en ningún sitio. En un tren que no para.' },
			{ text: 'Una hora más tarde, el túnel se acaba y Kanto aparece por la ventanilla de golpe: un mar de luces, avenidas rectas, torres de cristal. **Ciudad Azafrán**, de madrugada.' },
			{ set: { 'flag.b04_tren_hecho': true } },
			{ go: 'azafran' },
		],
		b04_tren_salto: [
			{ text: 'Antes de bajar a Azafrán, alguien tiene que tomar el tren.' },
			{ say: 'rotom', text: '¡Bzzt! Nuestro billete es del de las 23:05, el de la Gira. ¡Está a punto de salir de Trigal! Vamos, vamos, que nos guardan sitio.' },
			{ go: 'tren_magnetico' },
		],
		b04_panel_azafran: [
			{ text: 'El panel de llegadas parpadea en ámbar sobre las taquillas.' },
			{ text: '**TRIGAL 23:05 · VÍA 1 · LLEGADA: CON RETRASO**' },
			{ text: 'Nada más. Ni la hora a la que llegó, ni cuánto retraso. «Con retraso», y punto. Debajo, en letra pequeña: «Lamentamos las molestias. Un mundo. Una liga».', cond: 'flag.b04_tren_hecho' },
			{ if: 'flag.b04_tren_hecho && !flag.b04_panel_visto', then: [{ set: { 'flag.b04_panel_visto': true } }] },
		],

		// =================== LLEGADA A AZAFRÁN ===================
		b04_azafran_llegada: [
			{ set: { 'flag.b04_azafran_llegada': true } },
			{ quest: 'b04_m1', stage: 'azafran' },
			{ text: 'Sales de la estación a una avenida enorme. Azafrán a esas horas debería estar dormida y no lo está: los tranvías pasan vacíos con las luces encendidas, una cafetería sube la persiana, un señor con traje pasea a un Persian que parece más importante que él.' },
			{ text: 'Duermes cuatro horas en un sillón del Centro Pokémon de la esquina, con {riolu} hecho un ovillo a tus pies. Cuando abres los ojos, la ciudad ya va deprisa.', cond: LUC },
			{ text: 'Duermes cuatro horas en un sillón del Centro Pokémon de la esquina. Cuando abres los ojos, la ciudad ya va deprisa.', cond: '!(' + LUC + ')' },
			{ text: 'En el centro, por encima de todos los tejados, dos torres de cristal casi pegadas. La de **Silph S.A.**, con su logo rojo de toda la vida. Y a su lado, más alta, más nueva, la **Torre Lemnis Kanto**, con la lemniscata girando en lo alto.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Bienvenid{o|a|e} a Ciudad Azafrán! Capital económica de Kanto, sede de Silph S.A., tierra natal del Tren Magnético y de un gimnasio que da miedo. ¡Lo pone en la guía!' },
			{ say: 'rotom', text: 'Y tenemos un mensaje de la Gira: «Recepción de bienvenida en la **Torre Lemnis Kanto**. Asistencia obligatoria. Habrá canapés». Lo de los canapés lo pone en negrita.' },
		],

		// =================== RECEPCIÓN EN LA TORRE LEMNIS ===================
		b04_recepcion: [
			{ set: { 'flag.b04_recepcion': true } },
			{ text: 'El vestíbulo de la Torre Lemnis Kanto está lleno. Los aspirantes de la Gira, con sus siete medallas en la chaqueta, hacen corro alrededor de una lemniscata de mosaico que nadie pisa. Camareros con bandejas de canapés diminutos. Un cuarteto de cuerda toca algo que suena caro.' },
			{ text: 'Alexia dispara la cámara desde una columna. Rhi se ha llenado una servilleta de canapés y se los come de dos en dos. Bastien, en una esquina, no come nada.' },
			{ if: TRATO_ROTO, then: [
				{ text: 'Sube al pequeño escenario un hombre de unos cincuenta años, traje azul brillante, dientes muy blancos y una tarjeta de notas en cada mano. Da tres golpecitos al micrófono. Suena como un trueno.' },
				{ say: 'directivo_lemnis', text: '¡Bienvenidos, bienvenidos a Kanto! Soy el director de Relaciones Institucionales de Lemnis Kanto y es un honor, un honor de verdad, un honor muy grande, darles la bienvenida a… —mira la tarjeta— …a Kanto.' },
				{ say: 'directivo_lemnis', text: 'Siete medallas. ¡Siete! Les falta una para clasificarse para la Copa Infinita, y la octava les espera en el **Gimnasio de Ciudad Celeste**, al norte, por la Ruta 5. Su líder es **Misty**. ¡Agua! Que no se les olvide el paraguas. —Pausa para risas. No hay risas—. Bien.' },
				{ say: 'directivo_lemnis', text: 'La **Puerta Lemnis de Kanto** está a su disposición: regístrense en el parque y crucen a Kalos o a Johto cuando quieran. **Silph S.A.**, nuestra querida vecina, está cerrada por una auditoría rutinaria: les rogamos que no lo intenten. Y el gimnasio de Azafrán está, ejem, en pausa. Respetamos todas las decisiones. Todas.' },
				{ text: 'Levantas la vista. En el entresuelo, apoyada en la barandilla de cristal, hay una figura con traje azul medianoche y guantes blancos. **Serafina Lemnis**. No ha bajado al escenario. No va a bajar.' },
				{ text: 'Se miran un segundo. Ella inclina la cabeza, exactamente un centímetro. «Buenas tardes», dicen sus labios, sin sonido. Y se va hacia los ascensores sin volverse.' },
				{ text: 'Por costumbre, tocas el Holomisor de Serafina en tu bolsillo. Sigue en gris: «Canal cerrado por el titular».', cond: 'has("holomisorsera")' },
			], else: [
				{ text: 'Sube al pequeño escenario una mujer joven con traje azul medianoche, melena negra recta, guantes blancos y un broche de lemniscata plateada. No toca el micrófono. No le hace falta: el vestíbulo se calla solo.' },
				{ say: 'sera', text: 'Bienvenidos a Kanto. —Hace una pausa medida, de las que se ensayan—. Siete medallas. Eso los convierte en la mitad de la Gira que sigue en pie. La otra mitad está en casa. Les recomiendo no unirse a ella.' },
				{ say: 'sera', text: 'La octava medalla se gana en el **Gimnasio de Ciudad Celeste**, al norte, por la Ruta 5. Su líder es **Misty**, tipo Agua. Quien la consiga quedará clasificado para la **Copa Infinita** de esta temporada.' },
				{ say: 'sera', text: 'La **Puerta Lemnis de Kanto** está a su disposición: regístrense en el parque. **Silph S.A.**, nuestra vecina, permanece cerrada por una auditoría interna; les ruego que no lo intenten. Y la líder del gimnasio de Azafrán ha preferido no participar en el Programa de Intercambio. Lemnis respeta su decisión. —Una pausa mínima—. Lemnis respeta todas las decisiones.' },
				{ say: 'sera', text: 'Disfruten de los canapés. Los ha elegido alguien con muy buen gusto. Yo.' },
				{ text: 'Baja del escenario. La gente se aparta a su paso sin darse cuenta de que se aparta. Viene hacia ti.' },
				{ if: SERA_TU, then: [
					{ say: 'sera', text: 'Has llegado. Tarde, pero has llegado. —Te tutea sin pestañear, delante de todo el mundo, y un par de directivos se giran a mirar—. No es un reproche. Es una observación. Las observaciones se las hago a quien me importa que llegue.' },
					{ af: { sera: 1 } },
				] },
				{ if: 'flag.b02_frag_sera && !flag.b01_trato_sera', then: [
					{ say: 'sera', text: '{jugador}. Su colaboración en Ciudad Iris consta en su expediente. Favorablemente. —Pausa—. No tiene usted muchas cosas en su expediente que consten favorablemente. Cuide esta.' },
				] },
				{ if: 'flag.b02_frag_handsome', then: [
					{ say: 'sera', text: '{jugador}. —Te mira de arriba abajo, sin prisa—. He oído que la Policía Internacional ha extraviado una pieza de propiedad de Lemnis. Mientras la custodiaba. —Una pausa muy medida—. Qué descuido tan… oportuno.' },
				] },
				{ if: 'flag.b02_frag_melia', then: [
					{ say: 'sera', text: '{jugador}. En Iris permitió que se destruyera algo que no era suyo. Le dije que lo apuntaba. —Se ajusta un guante—. Sigue apuntado. Con buena letra.' },
				] },
				{ if: '!flag.b02_frag_sera && !flag.b02_frag_handsome && !flag.b02_frag_melia', then: [
					{ say: 'sera', text: '{jugador}. Veo que ha llegado con todos sus Pokémon y sin ningún escándalo. Para usted, eso es casi un logro.' },
				] },
				{ say: 'sera', text: 'Y no he olvidado lo de Crómlech. Una semana de titulares. Lemnis tampoco lo ha olvidado. Lemnis tiene muy buena memoria. Yo, mejor.', cond: 'flag.b01_delatar' },
				{ choice: [
					{ text: '«Buenas tardes, señorita Lemnis.»', then: [
						{ say: 'sera', text: 'Buenas tardes. —Algo en sus ojos se relaja medio milímetro—. Cuánto se agradecen los modales en una sala llena de gente con la boca llena de canapés.' },
						{ af: { sera: 1 } },
					] },
					{ text: '«¿Qué está auditando Lemnis en Silph?»', then: [
						{ say: 'sera', text: 'Lo que se audita siempre. Lo que falta. —Te sostiene la mirada—. Una pregunta directa. Algún día habrá una respuesta directa. Hoy no.' },
					] },
					{ text: '«Bonito edificio.»', then: [
						{ say: 'sera', text: 'Treinta plantas. Veintinueve sobran. La única que importa es la que tiene el despacho de quien decide. —Mira hacia arriba—. Y no tiene botón en el ascensor.' },
					] },
				] },
				{ text: 'Le suena el teléfono. Lo mira, contesta sin decir una palabra y se aleja hacia los ascensores sin despedirse. Es su forma de despedirse.' },
			] },
			// ----- Ansel: «de visita técnica» -----
			{ text: 'Cuando vas a por un canapé, alguien te toca el hombro con mucha suavidad.' },
			{ text: 'Un señor mayor, de cárdigan gris, gafas de media luna y corbata azul. Tiene un vaso de agua en una mano y, en la otra, como siempre, un caramelo.' },
			{ say: 'ansel', text: '¡{jugador}! Qué casualidad tan bonita. Estoy en Kanto de visita técnica: cables, cajas, gente seria que dice «calibración» muy despacio. Nada que dé para conversación. Y de pronto, ¡mira quién está en los canapés!' },
			{ say: 'ansel', text: 'Siete medallas. ¡Siete! Cuando te conocí en Luminalia no sabías ni dónde estaba el Centro Pokémon. Y {riolu}… —se inclina hacia él, con las manos en las rodillas— …mírate. Un Lucario hecho y derecho. Con ese pecho. Con esa cara de saber cosas.', cond: LUC },
			{ say: 'ansel', text: 'Siete medallas. ¡Siete! Cuando te conocí en Luminalia no sabías ni dónde estaba el Centro Pokémon. Mírate ahora.', cond: '!(' + LUC + ')' },
			{ say: 'ansel', text: 'Me han dicho que el tren llegó tarde. Los trenes y yo tenemos eso en común: siempre llegamos, pero a nuestra hora. —Se ríe, bajito—. Toma. Para el viaje que te queda.' },
			{ text: 'Te pone en la mano un caramelo de menta envuelto en papel azul, retorcido por las dos puntas.' },
			{ text: 'Le ofrece otro a {riolu}. {riolu} lo huele, despacio, y no lo agarra. Ansel se encoge de hombros, divertido, y se lo guarda.', cond: LUC },
			{ say: 'ansel', text: 'Hay a quien no le gusta la menta. No pasa nada. —Te da una palmadita en el brazo—. Cuídate mucho, ¿eh? Kanto es grande. Y muy viejo. Las cosas viejas guardan sorpresas.' },
			{ text: 'Y se pierde entre la gente, saludando a unos y a otros, con su vaso de agua, hacia los ascensores.' },
			{ quest: 'b04_m1', done: true },
			{ quest: 'b04_q_azafran', stage: 'recados' },
			{ say: 'rotom', text: '¡Bzzt! Apunto los pendientes: registrarnos en la **Puerta**, ver qué pasa con ese **gimnasio en pausa**… y Handsome me ha mandado un mensaje con catorce exclamaciones: «¡¡Estoy en Azafrán!! ¡¡En la Puerta!! ¡¡De incógnito!!». Así, en mayúsculas. De incógnito.' },
			{ call: 'b04_t0_check' },
		],
		b04_sera_despues: [
			{ if: SERA_TU, then: [
				{ say: 'sera', text: 'Estoy ocupada. —Tapa el teléfono con la mano—. Pero no tanto. ¿Qué necesitas?' },
				{ say: 'sera', text: 'Si vas a Celeste, Misty no tolera que la hagan esperar. Yo tampoco. Es lo único que tenemos en común. Bueno, eso y que ninguna de las dos pierde a menudo.' },
			], else: [
				{ say: 'sera', text: '{jugador}. —Tapa el teléfono con la mano, sin colgar—. Celeste está al norte. La Puerta, al oeste. Los canapés, en la basura: alguien ha dejado entrar a la delantera de Galar a la mesa del bufé.' },
			] },
		],
		b04_directivo_despues: [
			{ say: 'directivo_lemnis', text: '¡Ah! ¡El participante número…! —Mira la tarjeta. Mira otra tarjeta—. ¡El participante! ¿Qué tal la recepción? ¿Le gustó el cuarteto? Lo he elegido yo. Bueno, me lo eligieron. Pero yo lo aprobé.' },
			{ say: 'directivo_lemnis', text: 'La señorita Lemnis me ha dicho que le dé recuerdos. —Se lo piensa—. No, espere. Me ha dicho que no le dé nada. Perdone. Es que son muy parecidas las dos frases.' },
		],
		b04_alexia_torre: [
			{ say: 'alexia', text: 'La lemniscata del suelo. Nadie la pisa. ¿Te has fijado? Nadie les ha dicho que no la pisen. Simplemente, no la pisan. —Hace otra foto—. Eso es lo más interesante que ha pasado en esta recepción.' },
			{ say: 'alexia', text: 'Bueno, eso y que un guardia muy amable me ha pedido que borre las fotos del túnel. Muy amable. Muy insistente. Le he dicho que sí. —Te guiña un ojo—. Las mentiras pequeñas son de buena educación.' },
		],
		b04_recepcionista: [
			{ text: 'El recepcionista tiene una sonrisa de catálogo y un pinganillo en la oreja.' },
			{ text: '—Bienvenid{o|a|e} a Lemnis Kanto. El vestíbulo está abierto al público. Las plantas de la dos a la treinta son solo para personal autorizado. La pasarela a Silph S.A. está cerrada por la auditoría. Los baños, al fondo a la izquierda. —Sonríe más—. ¿En qué más puedo ayudarle?' },
			{ text: 'Le preguntas qué hay en la planta treinta. Sigue sonriendo exactamente igual. Te das cuenta de que no va a contestar, y de que no va a dejar de sonreír hasta que te vayas.' },
		],
		b04_ascensores: [
			{ text: 'Seis ascensores de acero cepillado. Al lado de cada uno, un panel con botones del 1 al 29. No hay botón para la planta 30.' },
			{ text: 'Uno de los ascensores sube solo, sin nadie dentro que tú hayas visto entrar. El número de encima de la puerta va cambiando: 12, 18, 24, 29… y se apaga.' },
		],
		b04_ventanal: [
			{ text: 'El ventanal da a la fachada de Silph S.A., tan cerca que ves sus oficinas como en una maqueta: mesas vacías, sillas de oficina, un póster de seguridad laboral con un Machoke levantando cajas con la espalda recta.' },
			{ text: 'Arriba, la pasarela de cristal cruza de un edificio a otro. Hay alguien en ella: una silueta con bata blanca que se para a mitad de camino, mira hacia abajo, hacia el vestíbulo… y sigue andando hacia Silph.' },
			{ text: 'En lo alto de la fachada de Silph, en una cornisa, se posa un pájaro gris. Se queda mirando el ventanal. Luego levanta el vuelo hacia los tejados.', cond: 'flag.b03_vencejo_pluma' },
		],

		// =================== SILPH (cerrada) ===================
		b04_silph_guardia: [
			{ text: 'El guardia levanta el cartel antes de que abras la boca: «CERRADO AL PÚBLICO POR AUDITORÍA INTERNA».' },
			{ say: 'guardia_silph', text: 'Sí, sé que es usted de la Gira. No, no hay visitas. Sí, el Tren Magnético lo hicimos nosotros. No, la Poké Ball también. Bueno, la Master Ball. Bueno, eso sí. —Suspira—. Tres semanas así.' },
			{ say: 'guardia_silph', text: 'La auditoría es «rutinaria». Eso pone en el correo. Llevan tres semanas subiendo cajas a la planta once. Las cajas rutinarias pesan muchísimo.' },
		],
		b04_silph_directorio: [
			{ text: 'Un directorio de latón con las plantas del edificio, letras blancas sobre fondo negro.' },
			{ text: '**Planta 1:** Vestíbulo. **2–4:** Administración. **5–7:** Poké Balls. **8–9:** Transporte (Tren Magnético). **10:** Laboratorio. **11:** —. **12–15:** Desarrollo. **Ático:** Presidencia.' },
			{ text: 'Donde debería poner el nombre de la planta 11 hay un hueco. Las letras están arrancadas. Quedan las marcas del pegamento, en forma de palabras que ya no se leen.' },
		],

		// =================== LA PUERTA DE KANTO ===================
		b04_puerta_eco: [
			{ set: { 'flag.b04_puerta_eco': true } },
			{ text: 'Al entrar en el parque, la lemniscata de la Puerta está zumbando, y {riolu} se detiene un paso por detrás de ti, las orejas de punta.', cond: LUC },
			{ say: 'rotom', text: '¡Bzzt! ¡La Puerta Lemnis de Kanto! Te hago de guía: la tercera Puerta de la red, después de la de Luminalia y la de Trigal. Inaugurada hace…' },
			{ text: 'La pantalla de la Pokédex se queda en gris. Sin ojos. Sin chispas. Sin nada.' },
			{ text: 'Un segundo.' },
			{ text: 'Dos.' },
			{ say: 'rotom', text: '…hace doce días, con una tarta de tres pisos con forma de lemniscata que se cayó. ¡Lo pone en la guía! —Los ojos le vuelven a la pantalla, redondos y contentos—. ¿Qué? ¿Por qué me miras así?' },
			{ choice: [
				{ text: '«Te has quedado en blanco.»', then: [
					{ say: 'rotom', text: '¿Yo? ¡Qué va! Los Rotom no nos quedamos en blanco. Nos quedamos… pensando muy rápido. Desde fuera parece lo mismo, pero no.' },
				] },
				{ text: '«Nada.»', then: [
					{ say: 'rotom', text: '¡Pues nada! Como iba diciendo: la tarta se cayó, pero dicen que estaba buenísima igual. Las tartas aguantan mucho.' },
				] },
				{ text: '«Qué raro.»', then: [
					{ say: 'rotom', text: '¿El qué? ¿Lo de la tarta? Sí, es rarísimo hacer una tarta con forma de lemniscata. ¡No tiene por dónde cortarla!' },
				] },
			] },
			{ text: '{riolu} ladea la cabeza y mira la Pokédex un momento. Luego mira la Puerta. Luego, otra vez, nada.', cond: LUC },
		],
		b04_puerta_registro: [
			{ text: 'El técnico de Lemnis tiene una tablet, una mesa plegable y la sonrisa de alguien a quien le pagan por sonreír a todas horas.' },
			{ text: '—¡Hola, hola! ¿De la Gira? Pase la Pokédex por aquí, por favor. Es un segundo.' },
			{ text: 'Acerca la tablet a tu Pokédex. Un pitido.' },
			{ text: '—Ah. Mire qué bien: ya estaba usted registrad{o|a|e}. Los de la Gira vienen pre-registrados. —Pasa el dedo por la pantalla—. Comodísimo. Lemnis piensa en todo.' },
			{ say: 'rotom', text: '¡Bzzt! ¿Ves? Ya éramos famosos aquí antes de llegar. Eso es lo bonito de Lemnis: siempre te está esperando alguien.' },
			{ set: { 'flag.b04_puerta_azafran': true } },
			{ text: '—Ya puede cruzar a Kalos o a Johto cuando quiera. Luminalia, Trigal y vuelta. Un mundo. Una liga. —Y vuelve a mirar su tablet.' },
			{ toast: '🌀 La Puerta de Kanto ya lleva a Luminalia y a Trigal' },
		],
		b04_puerta_registro_check: [
			{ call: 'b04_puerta_registro' },
			{ call: 'b04_t0_check' },
		],
		b04_puerta_tecnico_2: [
			{ text: '—Todo en orden. Puede cruzar cuando quiera. —El técnico no levanta la vista de la tablet—. Si nota un mareíto al pasar, es normal. Si nota dos, también. Si nota tres, eso ya no lo sé.' },
		],

		// =================== HANDSOME Y LEBRUN ===================
		b04_lebrun_azafran: [
			{ set: { 'flag.b04_lebrun_azafran': true } },
			{ text: 'La lemniscata zumba más fuerte y por el arco salen dos hombres, recién llegados de Kalos.' },
			{ text: 'Uno lleva gafas de sol, un bigote postizo enorme, gorra de la Gira y un periódico de Azafrán abierto al revés. El otro, traje gris, bigote canoso de verdad y una carpeta bajo el brazo.' },
			{ say: 'handsome', as: 'Turista de Kanto', text: '¡Ah! ¡Buenos días! Soy un turista. De aquí. De Kanto. Leo el periódico. —Lo gira al derecho—. Leo el periódico.' },
			{ if: 'flag.b01_lebrun_conocido', then: [
				{ say: 'lebrun', text: 'Handsome. Está usted de incógnito delante de una cámara de seguridad, con la acreditación de la Policía Internacional colgada del cuello. —No te mira—. {jugador}. Inspector Lebrun. Ya nos conocemos.' },
			], else: [
				{ say: 'lebrun', text: 'Handsome. Está usted de incógnito delante de una cámara de seguridad, con la acreditación de la Policía Internacional colgada del cuello. —Te mira por primera vez—. Inspector Lebrun. El superior de este turista.' },
				{ set: { 'flag.b01_lebrun_conocido': true } },
			] },
			{ text: 'Handsome se quita el bigote. Lo mira con pena. Lo guarda en el bolsillo de la gabardina, por si acaso.' },
			{ say: 'handsome', text: '¡{jugador}! Handsome está muy contento de verte. El inspector ha venido a Kanto en visita de coordinación, y Handsome ha venido a… coordinarse. Con el inspector.' },
			{ say: 'lebrun', text: 'Visita de coordinación con la policía de Kanto. Una mañana de reuniones y café malo. —Abre la carpeta sin prisa—. Ya que está aquí, actualizo su expediente de trayecto. Es un minuto.' },
			{ say: 'lebrun', text: 'Tren Magnético Trigal–Azafrán. Salida: 23:05, puntual. Parada no programada en el kilómetro doscientos doce, junto a la subestación de la frontera: cuatro minutos. Llegada a Azafrán: 01:14. Setenta y seis minutos de retraso.' },
			{ say: 'lebrun', text: '—Levanta la vista—. Ha dormido usted poco. Se le nota en los ojos. Duerma más. Es un consejo, no un dato.' },
			{ text: 'Silencio. Un Pidgey se posa en la Puerta, se lo piensa mejor y se va.' },
			{ say: 'handsome', text: '¿Kilómetro doscientos doce? —Se ríe, demasiado fuerte—. ¡Jefe! ¿Cómo sabe eso? Handsome ni siquiera sabía que había un túnel.' },
			{ say: 'lebrun', text: 'Leo, Handsome. Debería probarlo. Es como mirar, pero con las cosas quietas.' },
			{ text: 'Handsome vuelve a reírse, esta vez solo, y se calla. Se rasca la nuca. Mira la Puerta, el parque, a ti. Te sonríe con la cara de quien no sabe qué hacer con las manos.' },
			{ choice: [
				{ text: '«El panel de la estación solo decía "con retraso".»', then: [
					{ set: { 'flag.b04_lebrun_panel': true } },
					{ say: 'lebrun', text: 'Entonces el panel debería leer más. —Apunta algo en la carpeta. No sabes qué—. Gracias por el dato.' },
					{ text: 'Handsome te mira. Luego mira a Lebrun. Luego se pone a mirar el bigote postizo dentro del bolsillo, como si allí hubiera algo muy interesante.' },
				] },
				{ text: '«¿Me está vigilando?»', then: [
					{ say: 'lebrun', text: 'Le estoy protegiendo. Desde fuera se parecen mucho. —Cierra la carpeta—. Desde dentro, también.' },
				] },
				{ text: 'No decir nada', then: [
					{ say: 'lebrun', text: 'Bien. —Asiente, satisfecho—. El silencio es la forma más barata de colaborar.' },
				] },
			] },
			{ if: 'flag.b02_frag_handsome', then: [
				{ say: 'handsome', text: 'Jefe… ya que estamos todos. —Baja la voz—. La pieza de Kalos. La de Iris. ¿Ha aparecido?' },
				{ say: 'lebrun', text: 'Sigue extraviada, Handsome. Por eso se llama así. Cuando aparezca, se llamará de otra forma.' },
			] },
			{ say: 'lebrun', text: 'Me esperan. —Mira el reloj—. Handsome, a las doce en el hotel. Con corbata. Sin bigote.' },
			{ text: 'Se va calle abajo, hacia el centro, hacia las torres de cristal, con la carpeta bajo el brazo y el paso de quien cobra por horas. En la barandilla de la Puerta, donde ha apoyado la carpeta, se ha quedado un caramelo de menta envuelto en papel azul.' },
			{ text: 'Handsome lo toma. Lo mira. Se lo guarda en el mismo bolsillo que el bigote.' },
			{ say: 'handsome', text: 'Lebrun es así. Lo sabe todo porque lo lee todo. Cuando Handsome era un novato, él le enseñó a leer un expediente al revés, de la última hoja a la primera. «Lo importante siempre está al final, Handsome. Pero se entiende desde el principio».' },
			{ say: 'handsome', text: 'Handsome le debe su carrera. —Se queda callado—. Y una corbata. Una vez me prestó una corbata.' },
			{ quest: 'b04_t_lebrun', stage: 'sospecha' },
			{ intel: { npc: 'lebrun', text: 'En la Puerta de Azafrán sabía la hora exacta a la que llegó tu tren (01:14), los minutos de retraso (76) y dónde se paró: en el kilómetro 212, junto a la subestación. El panel de la estación solo decía «con retraso».' } },
			{ call: 'b04_handsome_registro' },
			{ call: 'b04_t0_check' },
		],
		b04_handsome_registro: [
			{ if: 'has("registroondas")', then: [
				{ say: 'handsome', text: 'Y ahora, lo importante. —Se pone serio de golpe, como se pone él: todo de una vez—. ¿Sigues teniendo las hojas de Caoba? ¿El registro de la señal?' },
				{ text: 'Se las enseñas. Columnas de números, una frecuencia, una firma: «M.». Handsome las mira mucho rato, moviendo los labios.' },
				{ say: 'handsome', text: 'Handsome se las mandó en copia al laboratorio de la Policía. No las entienden. Dicen que es «un idioma de máquinas que no es de ninguna máquina». —Te las devuelve—. Pero Handsome conoce a alguien que conoce a alguien.' },
			], else: [
				{ say: 'handsome', text: 'Y ahora, lo importante. —Se pone serio de golpe, como se pone él: todo de una vez—. La señal de Caoba. Handsome la ha mandado al laboratorio de la Policía. No la entienden. Dicen que es «un idioma de máquinas que no es de ninguna máquina». Pero Handsome conoce a alguien que conoce a alguien.' },
			] },
			{ say: 'handsome', text: 'Al norte de Ciudad Celeste, al final de un puente, vive un hombre que lee señales como otros leen el periódico. Al derecho. —Se lo piensa—. Cómo se llamaba… Es un nombre corto. Como un recibo.' },
			{ say: 'handsome', text: 'Tú vas a Celeste de todas formas, a por tu octava medalla. Pregunta allí. Handsome se queda en Azafrán con el inspector. A coordinarse.' },
		],
		b04_handsome_despues: [
			{ say: 'handsome', text: 'Handsome está esperando al inspector. A las doce. Con corbata. —Se toca el cuello: no lleva corbata—. Handsome tiene tiempo.' },
			{ say: 'handsome', text: 'La señal, {jugador}. Al norte de Celeste. Un hombre con un nombre corto. Pregunta en Celeste. Handsome confía en ti. Handsome confía en casi todo el mundo, la verdad. Es un problema.' },
		],

		// =================== SABRINA ===================
		b04_sabrina: [
			{ set: { 'flag.b04_sabrina_eco': true } },
			{ text: 'La mujer de la silla abre los ojos antes de que llegues. Son de un rosa oscuro, casi rojo. Las cucharas dejan de girar y se quedan quietas en el aire.' },
			{ say: 'sabrina', text: 'Te esperaba ayer.' },
			{ say: 'sabrina', text: 'Mis visiones no tienen en cuenta los retrasos de los trenes. Es un defecto que tienen.' },
			{ say: 'sabrina', text: 'Soy Sabrina. Este es mi gimnasio. Está en pausa. —Lo dice como quien dice que está lloviendo—. El Intercambio quería mandarme a otra región y traer aquí un gimnasio «de exhibición», con patrocinador. Dije que no. Ellos dijeron que entonces nadie. Así que nadie.' },
			{ if: LUC, then: [
				{ text: '{riolu} da un paso adelante. Cierra los ojos. Sabrina, muy despacio, también.' },
				{ cutscene: { bg: { type: 'gym', wall: '#2a2440', floor: '#6a4a8a' }, start: 'dark', frames: [
					{ actors: [{ id: 'sabrina', at: 0.78, enter: 'none', dim: true }, { mon: '{riolu}', key: 'rio', at: 0.3, enter: 'left' }], fx: ['glow', 'ripple'], text: 'El aura de {riolu} se enciende, azul, y se extiende por el suelo como agua. Desde la silla, otra cosa sale a su encuentro: una presión, rosa, invisible, que hace temblar el aire como el calor sobre el asfalto.' },
					{ tint: '#d86aa8', fx: 'aura', color: '#ff8ad0', on: false, actors: [{ key: 'sabrina', dim: false }], text: 'Se tocan en mitad de la sala. Las tres cucharas se ponen a girar a la vez, en el mismo sentido, despacio, como las agujas de un reloj que alguien acaba de poner en hora.' },
					{ tint: 'none', fx: 'light', text: 'Las baldosas de teletransporte se encienden un instante, todas, por primera vez en meses. Y se apagan.' },
				] } },
				{ say: 'sabrina', text: 'Tu Lucario me está leyendo. Con educación: llama antes de entrar. —Abre los ojos—. Me cae bien. Casi nadie llama.' },
				{ happy: { who: 'riolu', n: 5 } },
			] },
			{ text: 'Sabrina se levanta. Es más alta de lo que parecía sentada. Se acerca a ti y mira, no a ti, sino a la Pokédex que llevas en la mano. Mucho rato.' },
			{ say: 'sabrina', text: 'Tu máquina tiene eco.' },
			{ say: 'sabrina', text: 'Como una habitación con alguien más dentro.' },
			{ say: 'rotom', text: '¡Es el altavoz! ¡Bzzt! Lo tengo un poco flojo desde Johto. Se me cayó en un pozo. Bueno, se me cayó al lado de un pozo. Pero hizo eco igual.' },
			{ text: 'Sabrina mira la Pokédex un segundo más.' },
			{ say: 'sabrina', text: '…Será eso.' },
			{ choice: [
				{ text: '«¿Qué quiere decir?»', then: [
					{ say: 'sabrina', text: 'Quiero decir lo que he dicho. Las cosas que veo no vienen con instrucciones. Si vinieran, no las vería: las leería.' },
				] },
				{ text: '«Qué raro.»', then: [
					{ say: 'sabrina', text: 'Sí. —Una pausa—. Casi todo lo es, si lo miras el tiempo suficiente.' },
				] },
				{ text: '«Rotom tiene razón. El altavoz suena fatal.»', then: [
					{ say: 'rotom', text: '¡Eh!' },
					{ say: 'sabrina', text: 'Entonces cámbialo. —Vuelve a su silla—. O no. A veces una habitación con eco es solo una habitación grande.' },
				] },
			] },
			{ say: 'sabrina', text: 'No puedo darte una medalla. Te doy lo que iría junto a ella. Para que no digas que Azafrán no te dio nada.' },
			{ text: 'Una de las cucharas flota hasta ti y deja caer en tu mano un disco de MT, de color rosa.' },
			{ give: 'mt_psiquico' },
			{ say: 'sabrina', text: 'Ahora vete. Tengo que ver un par de cosas que todavía no han pasado. Y tú tienes que ir a que pasen.' },
			{ intel: { npc: 'sabrina', text: 'Líder del gimnasio de Azafrán (Psíquico), en pausa: se negó a entrar en el Programa de Intercambio. Te esperaba «ayer». Dijo que tu Pokédex «tiene eco, como una habitación con alguien más dentro». Rotom dice que es el altavoz.' } },
		],
		// La comprobación del tramo solo tiene sentido tras la recepción: antes, la misión de Azafrán no existe y el sitio
		// salía en Novedades como «misión nueva» sin serlo (revisión de lógica, 2026-10-10).
		b04_sabrina_check: [
			{ call: 'b04_sabrina' },
			{ call: 'b04_t0_check' },
		],
		b04_sabrina_despues: [
			{ text: 'Sabrina tiene los ojos cerrados. Las cucharas giran.' },
			{ say: 'sabrina', text: 'Vuelve cuando el gimnasio no esté en pausa. Lo sabré antes que tú. —Sin abrir los ojos—. Celeste está al norte. Misty no es paciente. Yo tampoco, pero lo disimulo mejor.' },
		],
		b04_baldosas: [
			{ text: 'Las baldosas de teletransporte, apagadas, son como charcos secos de cristal. Pisas una. No pasa nada. Pisas otra. Tampoco.' },
			{ text: 'Desde la silla, sin abrir los ojos, Sabrina dice: «Esa no». No sabes cuál. No vuelves a pisar ninguna.' },
		],

		// =================== DOJO KÁRATE: KIYO ===================
		b04_kiyo_dojo: [
			{ set: { 'flag.b04_kiyo_dojo': true } },
			{ text: 'El hombre de delante de las tablas se gira. Kimono blanco, descalzo, cinta en la frente.' },
			{ if: 'beat("kiyo_mortero")', then: [
				{ say: 'kiyo', text: '¡TÚ! ¡El golpe diez mil! —Te señala con el puño—. ¡Discípulos, este es el que me enseñó el movimiento secreto! ¡Perder! ¡Saludad!' },
				{ text: 'Los cinturones negros te hacen una reverencia muy seria. Uno no sabe muy bien por qué, pero la hace más que nadie.' },
			] },
			{ if: 'flag.b03_kiyo_visto && !beat("kiyo_mortero")', then: [
				{ say: 'kiyo', text: '¡Tú! ¡Del Monte Mortero! El que no quiso combatir. Bien. Bien. La roca y yo nos acordamos de ti con cariño.' },
			] },
			{ if: '!flag.b03_kiyo_visto', then: [
				{ say: 'kiyo', text: 'Bienvenid{o|a|e} al Dojo Kárate. Soy **Kiyo**, el Rey del Kárate. Me lo llamo yo, en realidad, pero se ha extendido.' },
			] },
			{ say: 'kiyo', text: 'Diez años en el Monte Mortero, golpeando una roca para encontrar el movimiento secreto. Y resulta que el movimiento secreto era perder. ¿Y sabes qué me dijo perder? «Vuelve a casa, Kiyo». Así que he vuelto. Este es mi dojo. Era. Es. Ahora otra vez es.' },
			{ say: 'kiyo', text: '¿Y Mauro? Se quedó en Johto. Salió a por pan hace dos semanas. Me escribió una postal. Ponía «hay cola».', cond: 'flag.b03_kiyo_visto' },
			{ say: 'kiyo', text: '¿Cómo va mi Tyrogue? ¿Ya ha elegido qué clase de luchador quiere ser? No me lo digas. Sí. No. Dímelo luego.', cond: 'flag.b03_tyrogue' },
			{ if: LUC, then: [
				{ text: 'Kiyo se fija en {riolu}. Deja de sonreír. Se acerca despacio, con las manos a la espalda, y lo mira a los ojos.' },
				{ say: 'kiyo', text: 'La otra vez tenía una piedra en el fondo del lago. Ahora el lago está más hondo.', cond: 'flag.b03_kiyo_visto' },
					{ say: 'kiyo', text: 'Hondo y quieto, como un lago sin viento. —Se gira hacia la pila de tablas—. Diez tablas. Mis discípulos rompen cuatro, cinco. Yo, ocho, en un día bueno. ¿Me harías el honor?' },
				{ cutscene: { bg: { type: 'gym', wall: '#8a5a3a', floor: '#d8c49a' }, start: 'dark', frames: [
					{ actors: [{ id: 'kiyo', at: 0.8, enter: 'none', dim: true }, { mon: '{riolu}', key: 'rio', at: 0.4, enter: 'left' }], cam: 'still', text: '{riolu} se coloca delante de la pila. Diez tablas de madera de roble, una encima de otra, sobre dos bloques de hormigón. Todo el dojo se calla.' },
					{ cam: 'push', fx: 'glow', text: 'Cierra los ojos. El aura se le recoge en la palma, pequeña, densa, azul casi blanca, como una estrella del tamaño de una canica.' },
					{ shake: 3, fx: ['impact', 'speedlines'], text: 'La palma baja. *CRAC.* Una tabla. Dos. Cinco. Ocho. Nueve…' },
					{ actors: [{ key: 'kiyo', dim: false, emote: '!' }], on: 'rio', fx: 'zoom', text: '…y se para. La palma, quieta, a un pelo de la décima tabla. No la toca. La décima tabla tiembla, entera, y se queda donde está.' },
				] } },
				{ text: 'Silencio. Un cinturón negro deja caer su toalla.' },
				{ say: 'kiyo', text: 'No ha roto la décima. —Se arrodilla junto a la pila, la toca con un dedo—. No ha roto la décima porque no ha querido. —Te mira, con los ojos brillantes—. Diez años para aprender a perder. Y este sabe ya cuándo no ganar.' },
				{ happy: { who: 'riolu', n: 10 } },
			], else: [
				{ say: 'kiyo', text: 'Traes cara de llevar prisa. En este dojo la prisa se quita a golpes. Contra las tablas. O contra mis discípulos. Elige.' },
			] },
			{ if: '!flag.b04_kiyo_cinturon', then: [
				{ set: { 'flag.b04_kiyo_cinturon': true } },
				{ say: 'kiyo', text: 'Toma. Mi primer cinturón negro. Lo tenía colgado en el Monte Mortero, en un clavo, al lado de la roca. Allí ya no me hace falta.' },
				{ give: 'blackbelt' },
				{ say: 'kiyo', text: 'Si tu equipo necesita endurecerse antes de Celeste, el tatami es tuyo. Mis discípulos llevan diez años entrenando solos. Tienen muchas ganas de pegarle a alguien que no sea yo.' },
			] },
		],
		b04_kiyo_despues: [
			{ text: '*¡HU! ¡HA!* Kiyo golpea las tablas que quedan. Rompe siete. Mira la octava con rencor.' },
			{ say: 'kiyo', text: 'Siete. Mañana, ocho. Pasado, nueve. Y la décima… la décima no la rompo. Ahora sé que no hay que romperlo todo.' },
			{ say: 'kiyo', text: 'Mauro me ha mandado otra postal. «Ya casi». No sé si habla del pan o de la vida.', cond: 'flag.b03_kiyo_visto' },
		],
		b04_dojo_cartel: [
			{ text: 'El cartel de madera tallada de encima de la puerta dice «**GIMNASIO** DOJO KÁRATE». Es antiguo, de cuando el Dojo era el gimnasio oficial de Azafrán, antes de que llegara Sabrina y les ganara a todos sin tocarlos.' },
			{ text: 'Debajo, alguien ha clavado un letrero mucho más pequeño, de cartón: «(no oficial)». Debajo del cartón, otro, con otra letra: «(todavía)».' },
		],

		// =================== LA COPIONA ===================
		b04_copiona: [
			{ text: 'Una casa con la puerta abierta. Dentro, una chica joven sentada en el suelo, con un Poké Muñeco en las rodillas, repite en voz alta todo lo que oye por la ventana.' },
			{ text: '—«¡Llego tarde, llego tarde!» —dice, con la voz exacta de un oficinista que pasa corriendo por la acera—. «Un mundo. Una liga.» —con la voz exacta de un anuncio—.' },
			{ say: 'rotom', text: '¡Bzzt! Hola, buenos días.' },
			{ text: '—«¡Bzzt! Hola, buenos días.» —dice ella. Con tu Rotom. Exacto. Perfecto. Hasta el chisporroteo.' },
			{ say: 'rotom', text: '…Eso ha sido inquietante.' },
			{ text: '—«…Eso ha sido inquietante.» —Sonríe—. Perdón. Es mi forma de saludar. Copio voces. Todo el barrio me conoce: soy la Copiona. Tu Rotom tiene una voz facilísima. Muy alegre. Las voces alegres son las más fáciles de copiar.', cond: '!flag.b04_copiona' },
			{ text: '—Ah, eres tú otra vez. Hola. «Hola». —Se ríe de sí misma y vuelve a la ventana.', cond: 'flag.b04_copiona' },
			{ set: { 'flag.b04_copiona': true } },
		],

		// =================== ADELA ===================
		b04_adela_mensaje: [
			{ set: { 'flag.b04_adela_msg': true } },
			{ if: 'flag.b03_rancho_sobrina', then: [
				{ text: 'Al pasar por delante del Centro Pokémon, la enfermera Joy te llama desde la puerta: hay correo a tu nombre. Un sobre de papel de estraza, con sellos de Johto pegados torcidos y un remite con letra grande: «A. Prado · Ruta 42».' },
				{ text: 'Dentro, una carta. Corta. Y, pegado con celo al dorso, un mechón de lana de Mareep amarilla.' },
				{ give: 'cartaadela' },
				{ say: 'rotom', text: '¡Bzzt! «La primera sigue en la lata». ¿Qué lata? —Pausa—. Ah. Ya. Bueno. No pregunto.' },
			] },
			{ if: 'flag.b03_rancho_jugador', then: [
				{ text: 'Rotom vibra. Una foto, desde un número de Johto, sin texto. Luego, otra vez: la misma foto, con texto. Adela no sabe muy bien cómo funcionan los mensajes.' },
				{ give: 'fotoadela' },
				{ text: 'En la mochila, la Llave del rancho Prado tintinea contra algo, sola. Como si alguien acabara de abrir la cancela allá lejos.', cond: 'has("llaverancho")' },
				{ text: 'Copito se asoma de su Poké Ball, mira la foto en la pantalla de la Pokédex y suelta una chispita. Reconoce el establo.', cond: MAREEP_AQUI + ' && ' + COPITO_TUYA },
				{ text: 'Nieve se asoma de su Poké Ball, mira la foto en la pantalla de la Pokédex y suelta una chispita. Reconoce el establo.', cond: MAREEP_AQUI + ' && !' + COPITO_TUYA },
			] },
			{ if: 'flag.b03_rancho_lemnis', then: [
				{ text: 'Rotom vibra. Un mensaje de un número de Johto. Es martes.' },
				{ give: 'mensajemartes' },
				{ say: 'rotom', text: '…Bzzt. ¿Le contestamos? —Pausa—. Le dice que no conteste si no sabes. Yo no sé. ¿Tú sabes?' },
				{ choice: [
					{ text: 'Contestar: «Guarda un poco de lana. Por si acaso.»', then: [
						{ set: { 'flag.b04_adela_lana': true } },
						{ text: 'La respuesta llega enseguida: «Ok. En la lata de las galletas. Ahí no mira nadie».' },
					] },
					{ text: 'Contestar: «Seguro que es normal.»', then: [
						{ text: 'La respuesta tarda mucho. «Ok». Solo eso. Una palabra. Con punto.' },
					] },
					{ text: 'No contestar', then: [
						{ text: 'Guardas la Pokédex. El mensaje se queda ahí, con la marca de «leído».' },
					] },
				] },
			] },
			{ if: RANCHO_NINGUNO, then: [
				{ text: 'Rotom vibra. Un mensaje corto, de un número de Johto.' },
				{ say: 'sobrina', as: 'Adela (mensaje)', text: '«Sigo en el rancho. No hay prisa. Bueno, alguna. Cuando vuelvas por Johto, pásate y hablamos de lo que hay que hablar. Las Mareep te mandan recuerdos. No es verdad, pero quedaba bonito. —A.»' },
			] },
		],

		// =================== CIERRE DEL TRAMO ===================
		b04_t0_check: [
			{ if: T0_OK + ' && !flag.b04_t0_hecho', then: [{ call: 'b04_t0_fin' }] },
		],
		b04_t0_fin: [
			{ if: 'flag.b04_t0_hecho', then: [{ end: true }] },
			{ text: 'Más tarde, en la avenida que lleva al norte, la ciudad se va haciendo más baja: primero torres, luego bloques, luego casas con jardín. Al final, un arco de piedra con un letrero: «**Ruta 5** · Ciudad Celeste».' },
			{ say: 'rotom', text: '¡Bzzt! Resumen del día: un tren que flota, un túnel con un edificio dentro, canapés, una líder que ve el futuro y dice que tengo eco, un inspector que lee y un señor con bigote de quita y pon. —Pausa—. ¡Kanto es genial!' },
			{ say: 'rotom', text: 'Y ahora: **Ciudad Celeste**. La octava medalla. Y un señor con un nombre corto que lee señales. ¡Al norte!' },
			{ text: '{riolu} ya está en el arco, esperándote, mirando hacia el norte con las orejas de punta. No mira hacia Celeste. Mira más allá. Hacia algo que todavía no ves.', cond: LUC },
			{ set: { 'flag.b04_t0_hecho': true } },
			{ quest: 'b04_m1', done: true },
			{ quest: 'b04_q_azafran', done: true },
			{ quest: 'b04_m2', stage: 'ruta5' },
			{ diary: 'Hoy mi entrenador{|a|e} y yo conocimos Ciudad Azafrán. ¡Es enorme! Todas las calles son rectas, como si las hubiera dibujado alguien con regla. Hay dos torres de cristal pegadas, una con un logo rojo y otra con el nuestro, que gira.\n\nEn la recepción de la Gira hubo canapés (Rhi se comió once; los conté). Luego fuimos a la Puerta, que es igualita que la de Luminalia pero con árboles cuadrados. ¡Y conocimos a Sabrina! Es muy seria y dice que ve cosas que todavía no han pasado. Me dijo que tengo eco. ¡Es el altavoz! Se me aflojó en Johto.\n\nMañana vamos al norte, a Ciudad Celeste. Dicen que su líder es de tipo Agua. ¡Espero que no me moje!', cond: 'flag.b01_diario' },
		],
	},

	// =====================================================================
	// NPCs genéricos de este tramo
	// =====================================================================
	npcs: {
		directivo_lemnis: { name: 'Directivo de Lemnis Kanto', generic: true, look: { hair: 'short', hairColor: '#4a3a2a', outfit: '#3b5bb5', outfit2: '#e9e8e0', skin: 1, eyesStyle: 'happy', mouth: 'grin', acc: 'tie lemnis' } },
	},

	// =====================================================================
	// MISIONES PEQUEÑAS DEL TRAMO
	// =====================================================================
	quests: {
		b04_q_azafran: { name: 'Primer día en Azafrán', type: 'main', est: 90,
			stages: {
				recados: 'Antes de seguir hacia el norte, termina lo que tienes pendiente en **Ciudad Azafrán**.',
				hecha: 'Ya conoces Azafrán. Y Azafrán, por lo visto, ya te conocía a ti.',
			},
			parts: { title: 'Pendientes en Azafrán', items: [
				{ label: 'La recepción de la Gira', where: 'torre_lemnis_kanto', done: 'flag.b04_recepcion', hint: 'En la **Torre Lemnis Kanto**, en el centro de la ciudad.' },
				{ label: 'Registrarte en la Puerta de Kanto', where: 'puerta_azafran', done: 'flag.b04_puerta_azafran', hint: 'El técnico de la mesa plegable, en el parque de la **Puerta Lemnis**.' },
				{ label: 'Encontrar a Handsome', where: 'puerta_azafran', done: 'flag.b04_lebrun_azafran', hint: 'Dijo que estaba en la Puerta. De incógnito.' },
				{ label: 'El gimnasio en pausa', where: 'gym_azafran', done: 'flag.b04_sabrina_eco', hint: 'La persiana del **Gimnasio de Azafrán** está a medio bajar. Dentro hay alguien.' },
			] },
		},
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		cartaadela: { name: 'Carta de Adela', pocket: 'key', desc: 'Un sobre de papel de estraza con sellos de Johto pegados torcidos. Remite: «A. Prado · Ruta 42». Lleva un mechón de lana de Mareep pegado con celo.',
			read: '**{jugador}:**\n\nEsta es la segunda. La primera sigue en la lata de las galletas. Era muy larga y decía cosas que no hace falta poner en un papel.\n\nEl rancho, bien. Tengo cuatro Miltank de clientas fijas, un Tauros que me odia y un Ponyta con una pezuña que no le gusta a nadie, a él el que menos. Cobro poco. Me pagan en huevos, a veces. Tengo muchos huevos.\n\nLas Mareep, bien. Se van al establo solas al atardecer, en orden, como él les enseñó. Borla se ha comido un calcetín. No era mío.\n\nLa mecedora sigue en el porche. Ayer me senté. Un minuto. Me levanté enseguida. No sé por qué te cuento esto.\n\nCome caliente. Duerme. Si ves Mareep en Kanto, salúdalas de mi parte. Son primas.\n\n**A.**\n\n*P. D.: El mechón es de Copito. O de Nieve. Las confundo. No se lo digas.*' },
		fotoadela: { name: 'Foto del rancho Prado', pocket: 'key', desc: 'Una foto un poco torcida, hecha con el teléfono de Adela y recibida en la Pokédex. Rotom la ha guardado en la carpeta «Casa».',
			read: 'El rancho Prado al atardecer, visto desde la cancela. El establo rojo con el tejado nuevo. El pozo. El rebaño, todo en fila hacia el establo, con las lucecitas amarillas encendidas.\n\nEn primer plano, desenfocado, el morro de Borla, que se está comiendo el cartel de «Rancho Prado» por la esquina.\n\nEl texto, en el segundo mensaje:\n\n*«Informe mensual: tejado arreglado. Pienso pagado. Borla 1, cartel 0. La mecedora, en su sitio. Tu llave abre también el cobertizo, que se me olvidó decírtelo. —A.»*' },
		mensajemartes: { name: 'Mensaje de un martes', pocket: 'key', desc: 'Un mensaje de Adela Prado, recibido en la Pokédex un martes. Rotom lo ha marcado como «importante» sin que se lo pidas.',
			read: '*«Hoy han vuelto los de la Fundación. Martes, como siempre. Muy amables. Han traído el pienso de las bolsas azules.*\n\n*Esta vez han pesado a las Mareep. A todas. Una por una. Han apuntado algo en una tablet y se han llevado pelo de Borla en un sobre. Dicen que es para un estudio de bienestar.*\n\n*Las Mareep ya no se dan chispazos cuando se rozan. Antes lo hacían siempre. Mi tío decía que era su forma de darse los buenos días.*\n\n*¿Eso es normal? No contestes si no sabes. Yo tampoco sé.*\n\n*—A.»*' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		solar_azafran: {
			name: 'Solar vallado', icon: '🧺', hours: 20, picks: [1, 3],
			text: 'Te cuelas por un hueco de la valla. Entre la maleza hay setas, cristales, cachivaches y, una vez, un Rattata que te mira con cara de inquilino.',
			wait: 'El solar está como lo dejaste. Habrá que darle tiempo a la maleza (y a la gente que tira cosas por encima de la valla).',
			table: [
				{ id: 'tinymushroom', w: 18, n: [1, 2] }, { id: 'stardust', w: 14, n: [1, 2] }, { id: 'bigmushroom', w: 10, n: [1, 1] },
				{ id: 'pearl', w: 10, n: [1, 1] }, { id: 'ether', w: 8, n: [1, 1] }, { id: 'starpiece', w: 4, n: [1, 1] },
				{ id: 'twistedspoon', w: 3, n: [1, 1] }, { id: 'nugget', w: 2, n: [1, 1] },
			],
		},
		perdidos_azafran: {
			name: 'Objetos perdidos de la estación', icon: '🧳', hours: 24, picks: [1, 2],
			text: 'Tocas la campanita. Un revisor jubilado asoma la cabeza, te mira, decide que tienes cara de buena persona y te deja rebuscar en la caja de lo que nadie ha reclamado «en un plazo razonable». Al fondo, enorme, sin etiqueta, ves una maleta verde. No la tocas. Por respeto.',
			wait: 'El revisor jubilado niega con la cabeza. «Hoy no ha perdido nada nadie. Vuelva mañana, que la gente es muy despistada».',
			table: [
				{ id: 'sodapop', w: 16, n: [1, 2] }, { id: 'lemonade', w: 14, n: [1, 2] }, { id: 'hyperpotion', w: 12, n: [1, 1] },
				{ id: 'greatball', w: 12, n: [1, 3] }, { id: 'pokedoll', w: 8, n: [1, 1] }, { id: 'revive', w: 8, n: [1, 1] },
				{ id: 'escaperope', w: 6, n: [1, 1] }, { id: 'luckyegg', w: 1, n: [1, 1], cond: 'flag.b04_t0_hecho' },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		rival_rhi_b4: {
			name: 'Rival: Rhi (Tren Magnético)', npc: 'rhi', trainer: 'rhi_5', type: 'Fire', rec: 50,
			cond: 'visited("tren_magnetico")',
			info: [
				{ text: 'Rhi quiere jugar un «partido amistoso» en el pasillo del tren. Opcional, pero ella no lo ve así.' },
				{ cond: 'flag.b04_rhi_tren', text: 'Cinco Pokémon, hasta el nivel 50. Su estrella, **Cinderace** (Fuego), sale la última.' },
				{ cond: 'flag.b04_rhi_tren', text: 'Lleva **Lucha**, **Eléctrico**, **Veneno**, **Volador**, **Acero** y **Fuego**. El **Psíquico** le viene mal a más de uno.' },
				{ cond: 'beat("rhi_5")', text: '✔ Le ganaste a doscientos cuarenta kilómetros por hora.' },
			],
		},
		dojo_azafran: {
			name: 'Dojo Kárate de Azafrán', npc: 'kiyo', type: 'Fighting', rec: 51,
			cond: 'visited("dojo_karate")',
			info: [
				{ text: 'Zona de entrenamiento hasta el nivel **51**. Kiyo ha vuelto a casa y sus cinturones negros tienen muchas ganas de pegarle a alguien.' },
				{ text: 'Todos usan tipo **Lucha**. **Psíquico**, **Volador** y **Hada** les hacen mucho daño.' },
				{ cond: 'flag.b04_kiyo_cinturon', text: 'Kiyo te dio su primer Cinturón Negro.' },
			],
		},
	},
};
