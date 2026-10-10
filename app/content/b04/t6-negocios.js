// Publicación 7 · Pieza B: Negocios (administración de recursos) y el arreglo del rancho.
// Tres negocios en zonas que el jugador ya pisó (formato en docs/CONTENIDO.md §13, motor en app/js/negocios.js):
//   p7_rancho      Rancho Prado (Johto, Ruta 42) · mixto: lana (dinero), leche y botiquín de la consulta (objetos)
//   p7_castillo    Castillo Caduco (Kalos, Vánitas) · sobre todo dinero; la bodega da objetos de PP
//   p7_excavacion  La cantera vieja de Petroglifo (Kalos) · objetos raros: piedras evolutivas y objetos equipables
//
// Ramas del rancho (decisión del B3):
//   b03_rancho_jugador → el negocio aparece gratis (es suyo) con el 60 %.
//   b03_rancho_sobrina → entra pagando en una escena con Adela (p7_rancho_trato): 45 % (hasta 70 %). Es la rama de Mario, «no es limosna, es sociedad».
//   b03_rancho_lemnis  → NO hay negocio. Escena corta (p7_rancho_lemnis). El rebaño es de la Fundación: no se toca aquí.
//
// Los encargados que no son el socio se ganan con una escena (flags p7_rosaura, p7_mayor, p7_hector, p7_simon, p7_tobias).
// Los imprevistos no pueden leer quién es el encargado elegido: hablan los que ya trabajan allí (cond con su flag).

const R = 'p7_rancho', CAS = 'p7_castillo', EXC = 'p7_excavacion';
const SOCIO_R = 'partner("p7_rancho")', SOCIO_C = 'partner("p7_castillo")', SOCIO_E = 'partner("p7_excavacion")';
const JUG = 'flag.b03_rancho_jugador', SOB = 'flag.b03_rancho_sobrina', LEM = 'flag.b03_rancho_lemnis';
// Copito sigue en el rancho salvo que el jugador se la llevara (solo pasa en la rama «jugador», y solo si la rescató en el B1; si no, se llevó a Nieve).
const COPITO_EN_RANCHO = '!(flag.b03_copito_contigo && flag.b01_mareep_copito)';
// La primera carta de Adela: la segunda (B4, `cartaadela`) dice que «la primera sigue en la lata», así que no se entrega antes de que llegue esa.
const LATA_PENDIENTE = SOCIO_R + ' && ' + SOB + ' && flag.b04_adela_msg && !flag.p7_cartalata_dada';
const LUC = '(inParty("riolu") || inParty("lucario"))';
const LANA_EN_CASA = '(works("mareep") || works("flaaffy") || works("ampharos"))';
const ENTRADA_SOBRINA = 20000;
const AVISO = '(' + JUG + ' || ' + SOB + ') && !flag.p7_adela_aviso && !' + SOCIO_R;
const SPOT_AVISO = { label: 'Mensaje de Adela', sub: 'Un número de la Ruta 42', icon: '📱', cond: AVISO, new: 'true', talk: [{ script: 'p7_adela_aviso' }] };
const CAS_COND = 'flag.b01_fin && visited("castillo_caduco")';
const EXC_COND = 'flag.b01_fin && visited("petroglifo")';

export default {
	// =====================================================================
	// NPCs
	// =====================================================================
	npcs: {
		// La ranchera vecina de la Ruta 42 (entrenadora `r42_rosaura` del B2; dejó flores en la cancela en el B3)
		p7_rosaura: { name: 'Rosaura', title: 'Ranchera de la Ruta 42', look: { hair: 'ponytail', hairColor: '#3a2a1e', outfit: '#c4473a', outfit2: '#d8a85a', skin: 4, eyes: '#3a2a1e', eyesStyle: 'happy', mouth: 'grin', acc: 'hat', head: 'square', brows: 'thick', nose: 'button', collar: 'vest' } },
		// «La Mayor» de la familia Rocket (Pozo Slowpoke en el B2, guarida de Caoba en el B3), ya sin uniforme
		p7_mayor: { name: 'La Mayor', title: 'La que cuida de los demás', look: { hair: 'bun', hairColor: '#c4473a', streak: '#cfd6e2', outfit: '#6b7a5a', outfit2: '#e9e3d0', skin: 0, eyesStyle: 'sharp', mouth: 'flat', head: 'long', brows: 'straight', nose: 'l', collar: 'shirt' } },
	},

	// =====================================================================
	// OBJETOS (solo de lectura)
	// =====================================================================
	items: {
		p7_avisohacienda: { name: 'Aviso de Patrimonio', pocket: 'key', desc: 'Una carta con membrete oficial dirigida al Castillo Caduco. El Conde la sujeta con dos dedos, como si oliera.',
			read: '**REGISTRO DE PATRIMONIO HISTÓRICO DE KALOS**\n*Negociado de Castillos, Torres y Asimilados*\n\nA la atención del **Sr. Vladimiro de Caduco** (o, en su defecto, de sus herederos):\n\nRevisados nuestros archivos, consta que el **Castillo Caduco** adeuda la Tasa de Conservación correspondiente a los últimos ejercicios. No podemos precisar cuántos: el expediente empieza en un tomo encuadernado en piel que nadie de esta oficina se atreve a abrir.\n\nLe recordamos que un inmueble histórico **abierto al público** queda exento de la mitad de la tasa. Para acreditarlo bastan una taquilla, un horario y un visitante que salga por su propio pie.\n\nAprovechamos para rogarle que actualice su fecha de nacimiento. La que figura en la ficha tiene que ser una errata.\n\nAtentamente,\n**Negociado de Castillos**\n\n*P. D.: El funcionario que le llevó el aviso anterior ya ha vuelto al trabajo. Dice que cenó muy bien y que no recuerda nada más.*' },
		p7_cartalata: { name: 'La primera carta de Adela', pocket: 'key', desc: 'Dos hojas de cuaderno dobladas en cuatro. Estuvieron en la lata de las galletas, con las escrituras y el jarabe de la tos. Nunca llevaron sello.',
			read: '**{jugador}:**\n\nTe escribo la misma noche. Tú ya te has ido por la senda del monte y yo estoy en la cocina con el cuaderno de mi tío delante. No lo entiendo. Tiene una columna que se llama «ya veremos».\n\nHoy me dijiste que el rancho fuera mío y yo dije que sí. Dije que sí porque me lo pedías tú, porque él llevaba un día muerto y porque en ese porche no se podía decir otra cosa. No porque supiera.\n\nNo sé llevar un rancho. Sé curar. Sé cuándo una oveja tiene fiebre antes de tocarla. No sé cuánto pienso cabe en un invierno ni a quién se le vende la lana. Él lo sabía todo de memoria y no lo apuntó en ningún sitio.\n\nTengo miedo de ser la Prado que lo pierde. Tres generaciones, y luego yo, con una calculadora.\n\nNo te lo voy a mandar. Si te lo mando, vuelves, y no es justo: tú tienes tu camino. Yo me apaño.\n\n*(Más abajo, con otro bolígrafo, de otro día:)*\n\nNo me apaño.\n\n**A.**' },
		p7_becadenegada: { name: 'Solicitud de beca (denegada)', pocket: 'key', desc: 'Tres hojas grapadas con un sello rojo encima. La primera tiene una mancha de barro con forma de mano.',
			read: '**SOLICITUD DE FINANCIACIÓN · TRABAJO DE CAMPO**\n\n**Solicitante:** Petra Brossard, paleontóloga.\n**Lugar:** la cantera vieja de Petroglifo, detrás del Laboratorio de Fósiles.\n**Aval:** Dr. Lazare («firmo porque si no, no se va»).\n\n**Qué quiere hacer:** abrir tres zanjas en una cantera que lleva cuarenta años cerrada. Arriba hay minerales que nadie ha catalogado. Abajo, no lo sé. Por eso quiero bajar.\n\n**Presupuesto:** un toldo, cribas, luces y cascos. Muchos cascos.\n\n**Experiencia previa:** me he caído en once yacimientos de tres regiones. Conozco el subsuelo mejor que nadie de mi promoción, porque he pasado más tiempo dentro.\n\n**Riesgos:** yo.\n\n*(Sello rojo, torcido:)* **DENEGADA.** *«El comité valora el entusiasmo de la solicitante. El comité recuerda también que la última subvención se gastó en vendas.»*\n\n*(A lápiz, con otra letra, pequeña y recta:)* «El comité no ha pisado una cantera en su vida. La solicitud era buena. —L.»' },
	},

	// =====================================================================
	// PARCHES A LUGARES YA PUBLICADOS
	// =====================================================================
	patches: {
		// ---------- Rancho Prado ----------
		rancho_aurelio: { spots: [
			{ label: 'Las cuentas del rancho', sub: 'Un cuaderno de tapas de hule, en la mesa de la cocina', icon: '📒', cond: JUG + ' || ' + SOCIO_R, new: '!' + SOCIO_R, action: { venture: R } },
			{ label: 'Adela y un montón de facturas', sub: 'Las ordena por tamaño. No ayuda', icon: '🧾', cond: SOB + ' && !' + SOCIO_R, new: '!flag.p7_rancho_oferta', talk: [{ script: 'p7_rancho_trato' }] },
			{ label: 'Adela y la lata de las galletas', sub: 'La ha bajado de la alacena', icon: '✉️', cond: LATA_PENDIENTE, new: 'true', talk: [{ script: 'p7_adela_lata' }] },
			{ label: 'Hablar de dinero con Adela', sub: 'Mira de reojo la placa azul', icon: '💬', cond: LEM + ' && !flag.p7_rancho_lemnis', new: 'true', talk: [{ script: 'p7_rancho_lemnis' }] },
			{ label: 'Una ranchera apoyada en la cancela', sub: 'Con un Tauros que mira la esquiladora', icon: '🤠', cond: SOCIO_R + ' && flag.p7_r_esquiladora && !flag.p7_rosaura', new: 'true', talk: [{ script: 'p7_rosaura_llega' }] },
			{ label: 'Una mujer con una maleta de cartón', sub: 'Espera fuera de la cerca. No entra', icon: '🧳', cond: SOCIO_R + ' && flag.b03_rocket_libres && !flag.p7_mayor', new: 'true', talk: [{ script: 'p7_mayor_llega' }] },
			{ label: 'La gente del rancho', sub: 'Siempre hay alguien haciendo algo', icon: '🧑‍🌾', cond: 'flag.p7_rosaura || flag.p7_mayor', talk: [{ script: 'p7_rancho_gente' }] },
			{ label: 'Quien se quedó en casa', sub: 'Hay una luz amarilla que antes no estaba', icon: '🏡', cond: SOCIO_R + ' && ' + LANA_EN_CASA, new: '!flag.p7_rancho_casa', talk: [{ script: 'p7_rancho_casa' }] },
		] },
		// Aviso de Adela en los sitios donde puede estar el jugador (no interrumpe: es un botón)
		lago_furia: { spots: [SPOT_AVISO] },
		caoba: { spots: [SPOT_AVISO] },
		iris: { spots: [SPOT_AVISO] },
		trigal: { spots: [SPOT_AVISO] },
		olivo: { spots: [SPOT_AVISO] },

		// ---------- Castillo Caduco ----------
		castillo_caduco: { spots: [
			{ label: 'El Conde y un sobre con membrete', sub: 'Lo sujeta con dos dedos, lejos de la nariz', icon: '✉️', cond: CAS_COND + ' && !' + SOCIO_C, new: '!flag.p7_c_propuesta', talk: [{ script: 'p7_castillo_propuesta' }] },
			{ label: 'El libro de visitas', sub: 'En un atril, junto a la puerta', icon: '📖', cond: SOCIO_C, action: { venture: CAS } },
			{ label: 'Un oficinista con un maletín', sub: 'Lee el cartel de la taquilla por cuarta vez', icon: '💼', cond: SOCIO_C + ' && flag.p7_c_taquilla && !flag.p7_hector', new: 'true', talk: [{ script: 'p7_hector_llega' }] },
			{ label: 'La taquilla', sub: 'Alguien ha puesto el horario con regla', icon: '🎟️', cond: 'flag.p7_hector || flag.p7_simon', talk: [{ script: 'p7_castillo_gente' }] },
		] },
		vanitas: { spots: [
			{ label: 'El escéptico, con un folleto en la mano', sub: 'Lo ha subrayado entero. En rojo', icon: '🎧', cond: SOCIO_C + ' && flag.p7_c_folletos && !flag.p7_simon', new: 'true', talk: [{ script: 'p7_simon_llega' }] },
		] },

		// ---------- La cantera vieja de Petroglifo ----------
		lab_fosiles: { spots: [
			{ label: 'El Dr. Lazare y unos papeles grapados', sub: 'Los ha leído tantas veces que se los sabe', icon: '📎', cond: EXC_COND + ' && !' + SOCIO_E, new: '!flag.p7_e_propuesta', talk: [{ script: 'p7_exc_propuesta' }] },
			{ label: 'La cantera vieja', sub: 'Por la puerta de atrás del laboratorio', icon: '⛏️', cond: SOCIO_E, action: { venture: EXC } },
			{ label: 'Un hombre que le habla a una cámara', sub: 'Una Persian lo mira con desprecio profesional', icon: '🎥', cond: SOCIO_E + ' && flag.p7_e_toldo && !flag.p7_tobias', new: 'true', talk: [{ script: 'p7_tobias_llega' }] },
			{ label: 'La zanja tres', sub: 'Con escalera. Por si acaso', icon: '🪜', cond: SOCIO_E + ' && flag.p7_e_galeria', talk: [{ script: 'p7_exc_zanja' }] },
		] },
	},
	extraSpots: {
		azafran: [SPOT_AVISO],
	},

	// =====================================================================
	// NEGOCIOS
	// =====================================================================
	ventures: {
		// -----------------------------------------------------------------
		// 1 · RANCHO PRADO (mixto)
		// -----------------------------------------------------------------
		p7_rancho: {
			name: 'Rancho Prado', icon: '🐑', loc: 'rancho_aurelio', partner: 'sobrina',
			cond: JUG + ' || flag.p7_rancho_trato',
			blurb: 'Cincuenta y tantas Mareep, un establo rojo y un cuaderno de cuentas que nadie quiere abrir.',
			buy: { cost: 0, text: '«El rancho es tuyo. Las cuentas, también. Siéntate, que esto no se lee de pie.»', script: 'p7_rancho_entrada' },
			share: [{ cond: JUG, pct: 60 }, { pct: 45 }],
			upkeep: 900, store: 3,
			lines: {
				lana: { name: 'Lana', icon: '🧶', desc: 'Se esquila, se lava y se vende en Iris y en Trigal. Es lo que paga el pienso.', money: 2800 },
				leche: { name: 'Leche y establo', icon: '🥛', desc: 'Las Miltank del establo dan Leche Mu-mu; lo que sobra se hace queso y se vende. «Aquí siempre va a haber leche».', money: 500, items: [{ id: 'moomoomilk', perDay: 2 }] },
				consulta: { name: 'Botiquín de la consulta', icon: '🩺', desc: 'Lo que Adela prepara para sus pacientes: reconstituyentes, vitaminas del ganado y, de vez en cuando, uno de los caramelos que su tío traía de Caoba.', locked: true,
					items: [{ id: 'fullrestore', perDay: 0.3 }, { id: 'maxrevive', perDay: 0.15 }, { id: 'hpup', perDay: 0.04 }, { id: 'protein', perDay: 0.04 }, { id: 'iron', perDay: 0.04 }, { id: 'calcium', perDay: 0.04 }, { id: 'zinc', perDay: 0.04 }, { id: 'carbos', perDay: 0.04 }, { id: 'rarecandy', perDay: 0.03 }] },
			},
			upgrades: [
				{ id: 'tejado', name: 'El tejado del establo', cost: 7000, set: { 'flag.p7_r_tejado': true }, store: 1, mult: { all: 1.2 },
					desc: 'Gotea justo encima de donde duerme Borla, y Borla se lo toma como algo personal. Tejas nuevas: todo rinde más y cabe un día más de producción.' },
				{ id: 'esquiladora', name: 'Una esquiladora que no dé calambre', cost: 20000, set: { 'flag.p7_r_esquiladora': true }, mult: { lana: 1.5 },
					desc: 'La de Don Aurelio era de manivela y tenía su misma edad. Una eléctrica, con el mango aislado, que las Mareep se cargan solas. Mucha más lana.' },
				{ id: 'pozo', name: 'La bomba del pozo', cost: 9500, mult: { all: 1.18 }, upkeep: -200,
					desc: 'El pozo es del abuelo de Don Aurelio. Agua hay; lo que falta es subirla sin dejarse la espalda. Adela ha pintado en el brocal, con brocha gorda: «ESTE NO ES DE NADIE MÁS». Menos gasto y todo rinde más.' },
				{ id: 'ordeno', name: 'Sala de ordeño', cost: 11000, mult: { leche: 1.8 }, slots: 1,
					desc: 'Cuatro plazas, suelo que se puede fregar y una radio, porque las Miltank dan más con música. Casi el doble de leche y sitio para un Pokémon más trabajando.' },
				{ id: 'letrero', name: 'Letrero nuevo y puesto en la cancela', cost: 26000, mult: { lana: 1.35 }, script: 'p7_r_up_letrero',
					desc: 'Vender la lana en la puerta, sin intermediarios. Hace falta un letrero que se lea desde la Ruta 42 y que Borla no alcance.' },
				{ id: 'consulta', name: 'La consulta de Adela', cost: 42000, unlock: 'consulta', script: 'p7_r_up_consulta',
					desc: 'El granero viejo, con camilla, nevera y una puerta que cierra. Abre una línea nueva: el botiquín de la consulta.' },
				// Ampliar tu parte · rama «el rancho es tuyo»
				{ id: 'deudas', name: 'Saldar las deudas de Don Aurelio', cost: 16000, share: 10, hidden: '!' + JUG, script: 'p7_r_up_deudas',
					desc: 'El pienso de dos inviernos y un préstamo que nadie de la familia sabía que existía. Sin intereses que pagar, tu parte sube 10 puntos.' },
				{ id: 'escritura', name: 'Poner los papeles en regla', cost: 30000, share: 15, need: ['deudas'], hidden: '!' + JUG,
					desc: 'Notaría de Iris, tres sellos y una tarde entera. El rancho deja de estar «a nombre de un señor que ya no está». Tu parte sube 15 puntos más.' },
				// Ampliar tu parte · rama «el rancho es de Adela»
				{ id: 'socio2', name: 'Segunda aportación', cost: 10000, share: 10, hidden: JUG, script: 'p7_r_up_socio',
					desc: 'Adela lo apunta en el cuaderno con la misma letra con la que receta: grande y sin adornos. Tu parte sube 10 puntos.' },
				{ id: 'socio3', name: 'A medias', cost: 24000, share: 15, need: ['socio2'], hidden: JUG,
					desc: '«A medias es a medias: mitad de la lana y mitad de los disgustos». Luego hace la cuenta y te apunta más de la mitad. Tu parte sube 15 puntos más.' },
			],
			jobs: { slots: 2, types: ['Electric', 'Normal'], favs: { mareep: 0.06, flaaffy: 0.06, ampharos: 0.06, miltank: 0.06, tauros: 0.03, wooloo: 0.03, dubwool: 0.03 },
				text: 'Pastorear, dar luz al establo de noche o, simplemente, estar. Los de la línea de Mareep no vienen a trabajar: vuelven a casa.' },
			managers: [
				{ npc: 'sobrina', desc: 'Lo cuida entre consulta y consulta. Sabe curar ovejas mejor que contarlas, y lo dice ella.', mult: { leche: 1.1 } },
				{ npc: 'p7_rosaura', cond: 'flag.p7_rosaura', wage: 300, mult: { lana: 1.25, consulta: 1.15 },
					desc: 'La vecina. Treinta años esquilando. Con ella al frente sale más lana, y Adela vuelve a su consulta.' },
				{ npc: 'p7_mayor', cond: 'flag.p7_mayor', wage: 250, mult: { leche: 1.3, consulta: 1.15 },
					desc: 'Sabe que todo el mundo coma caliente, también el establo. Más leche, y Adela vuelve a su consulta.' },
			],
			eventRate: 0.7,
			events: [
				{ id: 'gotera', name: 'Gotera', w: 3, npc: 'sobrina', cond: '!flag.p7_r_tejado',
					text: 'Informe. Ha llovido. El tejado del establo tiene una gotera nueva, y cae justo en la oreja de Borla. Borla lleva toda la mañana mirándome como si la hubiera puesto yo.',
					options: [
						{ text: 'Pagar un parche', cost: 2500, result: 'Sube un chico de Caoba con brea y una escalera. Borla lo vigila desde abajo. No se fía.', effect: { boost: { mult: { all: 1.15 }, days: 3, label: 'Establo seco' } } },
						{ text: '«Ponle un cubo.»', result: 'Adela pone un cubo. Borla se bebe el cubo. La gotera sigue.', effect: { boost: { mult: { all: 0.9 }, days: 2, label: 'Gotera' } } },
					] },
				{ id: 'borla', name: 'Borla ha comido algo', w: 3, npc: 'sobrina',
					text: 'Informe. Borla se ha comido la factura del pienso. Entera. Con la grapa. Está perfectamente; la que está mal soy yo, que ya no sé cuánto debemos.',
					options: [
						{ text: 'Reírte', result: '«Ríete, ríete». Al rato te llega una foto: Borla, con cara de no haber hecho nada en su vida. Las demás Mareep, detrás, encantadas.', effect: { happy: 8 } },
						{ text: 'Mandar un saco de zanahorias derechas', cost: 800, result: 'Las derechas son de Borla. Eso no ha cambiado. Con la tripa llena deja en paz el papeleo y el rebaño entero anda de mejor humor.', effect: { boost: { mult: { lana: 1.15 }, days: 3, label: 'Borla contenta' }, happy: 5 } },
					] },
				{ id: 'muumuu', name: 'Favor de la Granja MuuMuu', w: 2, npc: 'sobrina', cond: 'flag.b03_muumuu_hecho',
					text: 'Ha llamado la granjera de la MuuMuu. Canela ya come, y come por tres. Se han quedado cortos de heno y preguntan si les prestamos veinte fardos. Dice que paga en leche. Y en cariño. Más en leche.',
					options: [
						{ text: 'Mandar los fardos', result: 'El remolque de la MuuMuu se lleva el heno y vuelve con una caja de botellas. Y una nota: «Aurelio habría mandado el doble. Pero él no sabía contar».', effect: { items: [{ id: 'moomoomilk', n: 4 }], boost: { mult: { lana: 0.95 }, days: 1, label: 'Heno justo' } } },
						{ text: 'Mandar el doble y pagar el porte', cost: 1800, result: 'Cuarenta fardos. La granjera llama otra vez, llorando un poco, para decir que Canela se ha puesto de pie ella sola a recibirlos.', effect: { items: [{ id: 'moomoomilk', n: 9 }], happy: 5 } },
						{ text: '«Este mes no podemos.»', result: 'Adela se lo dice. La granjera lo entiende. Las granjas se entienden.' },
					] },
				{ id: 'kalos', name: 'Carta de Kalos', w: 2, npc: 'sobrina', once: true,
					text: 'Ha llegado una carta de Kalos. A nombre de mi tío. Todavía llegan. —Pausa—. Es de una tejedora de Pueblo Vánitas: le compró un vellón cuando estuvo allá con el rebaño perdido y dice que es «la única lana que guarda la luz». Quiere más.',
					options: [
						{ text: 'Mandarle un fardo', cost: 3000, result: 'Adela ata el fardo con nudo de cirujana y mete dentro una nota: «Él ya no está. La lana, sí». A las tres semanas llega un giro de Kalos, y una bufanda. Brilla un poco en la oscuridad.', effect: { money: 9500 } },
						{ text: 'Mandarle una muestra y la tarifa', result: 'La tejedora enseña la muestra en el mercado de Vánitas. Empiezan a llegar pedidos pequeños, de uno en uno.', effect: { boost: { mult: { lana: 1.2 }, days: 4, label: 'Pedidos de Kalos' } } },
						{ text: 'Guardar la carta', result: 'Adela la mete en la lata de las galletas, con las otras.' },
					] },
				{ id: 'azul', name: 'Una visita de azul', w: 1, npc: 'sobrina',
					text: 'Ha vuelto el del ramo. Sin ramo. Coche azul, corbata gris. Se ha quedado en la cancela y ha preguntado si «la situación del rancho ha cambiado». Le he dicho que sí: que ahora tiene quién lo pague.',
					options: [
						{ text: '«Que no pase de la cancela.»', result: 'No pasa. Adela se queda mirándolo con la horca en la mano hasta que el coche da la vuelta. «Yo no he dicho nada. La horca la tenía de antes».' },
						{ text: 'Poner un cartel de «Propiedad privada»', cost: 600, result: 'Cartel de chapa, letras rojas. Adela añade debajo, a rotulador: «Los folletos, al cubo del pienso». Unos días sin visitas.', effect: { boost: { mult: { all: 1.05 }, days: 5, label: 'Sin visitas' } } },
					] },
				{ id: 'tormenta', name: 'Noche de tormenta', w: 2, npc: 'sobrina',
					text: 'Viene tormenta. Las Mareep ya lo saben: llevan una hora pegadas unas a otras y chisporroteando. Si duermen fuera, mañana la lana saldrá cargada y vale más. Si duermen fuera, yo no duermo.',
					options: [
						{ text: 'Que duerman dentro', result: 'Adela las mete una a una. Tarda dos horas. Por la mañana están secas, descansadas y de buen humor.', effect: { happy: 6 } },
						{ text: 'Pagar a dos chicos de la ruta para velarlas fuera', cost: 1500, result: 'Dos chicos, dos linternas y un termo. Al amanecer, el prado entero brilla. La lana de hoy chasquea al tocarla.', effect: { boost: { mult: { lana: 1.4 }, days: 2, label: 'Lana cargada' } } },
					] },
				{ id: 'esquila', name: 'Día de esquila', w: 2, npc: 'sobrina',
					text: 'Toca esquilar. Quien tiene parte en la lana, tiene parte en las tijeras. Yo no digo nada. Yo solo lo recuerdo.',
					options: [
						{ text: '«Voy en cuanto pueda. Empiecen sin mí.»', result: 'Empiezan sin ti. Te guardan a Borla, que es la difícil. «Así aprendes».', effect: { boost: { mult: { lana: 1.15 }, days: 2, label: 'Esquila' } } },
						{ text: 'Pagar dos jornaleros', cost: 2200, result: 'Dos días de tijera y lana por todas partes. Adela manda una foto del montón. No se ve el establo detrás.', effect: { boost: { mult: { lana: 1.5 }, days: 2, label: 'Esquila grande' } } },
					] },
				{ id: 'rosaura_tauros', name: 'El Tauros de la vecina', w: 2, npc: 'p7_rosaura', cond: 'flag.p7_rosaura',
					text: 'Tengo que decirle una cosa y no se me ría. Mi Tauros ha saltado su cerca. Está en su prado, plantado delante de una Miltank, sin hacer nada. Lleva así desde el desayuno. Yo creo que le está recitando algo.',
					options: [
						{ text: 'Dejarlo estar', result: 'El Tauros se queda tres días. No rompe nada. Las Miltank, halagadas, dan leche como nunca. Rosaura dice que te va a cobrar la manutención. No lo hace.', effect: { boost: { mult: { leche: 1.3 }, days: 3, label: 'Establo halagado' } } },
						{ text: 'Subir la cerca un palmo', cost: 2800, result: 'Cerca nueva, un palmo más alta. El Tauros la mira. Calcula. Se resigna. El rebaño pasta más tranquilo sin un enamorado mirando.', effect: { boost: { mult: { all: 1.1 }, days: 5, label: 'Cerca nueva' } } },
					] },
				{ id: 'mayor_arroz', name: 'Una olla en la cancela', w: 2, npc: 'p7_mayor', cond: 'flag.p7_mayor',
					text: 'Ha venido Toni desde la Ruta 37, con su madre y una olla así de grande. Arroz con leche. Con leche de aquí. Con canela por encima. Dice que si puede venderlo en la cancela los domingos.',
					options: [
						{ text: '«Que venda. Y que guarde un plato.»', result: 'Los domingos hay cola en la cancela. Toni cobra, su madre sirve y la Mayor vigila que nadie se quede sin plato. A ti te guardan dos.', effect: { boost: { mult: { leche: 1.25 }, days: 3, label: 'Domingo de arroz' } } },
						{ text: 'Comprarle la olla entera para el rancho', cost: 1200, result: 'Comen todos: Adela, la Mayor, los jornaleros y, a escondidas, Borla. Hacía mucho que en ese porche no se oía tanta cuchara.', effect: { happy: 15 } },
					] },
			],
		},

		// -----------------------------------------------------------------
		// 2 · CASTILLO CADUCO (sobre todo dinero)
		// -----------------------------------------------------------------
		p7_castillo: {
			name: 'Castillo Caduco', icon: '🏰', loc: 'vanitas', partner: 'conde',
			cond: CAS_COND,
			blurb: 'Un castillo con niebla propia, demasiados retratos y ninguna taquilla. Todavía.',
			buy: { cost: 20000, text: '«Un Caduco no pide dinero. Un Caduco permite que se le ayude. Es distinto. Es mucho más caro.»', script: 'p7_castillo_entrada' },
			share: [{ pct: 30 }],
			upkeep: 700, store: 3,
			lines: {
				visitas: { name: 'Visitas guiadas', icon: '🕯️', desc: 'El vestíbulo, los retratos y el ala sur. De noche se cobra el doble y nadie protesta.', money: 3400 },
				recuerdos: { name: 'Tienda de recuerdos', icon: '🦇', desc: 'Postales de un señor pálido en distintas épocas y cosas que los visitantes juran que no han comprado.', money: 1200, items: [{ id: 'duskball', perDay: 0.6 }, { id: 'spelltag', perDay: 0.08 }] },
				bodega: { name: 'La bodega', icon: '🍷', desc: 'Botellas sin etiqueta. El Conde dice que es jarabe de bayas. Quita el cansancio de golpe.', locked: true,
					items: [{ id: 'berryjuice', perDay: 1.5 }, { id: 'maxelixir', perDay: 0.2 }, { id: 'ppup', perDay: 0.06 }] },
			},
			upgrades: [
				{ id: 'velas', name: 'Velas que alguien enciende', cost: 4500, mult: { all: 1.2 },
					desc: 'Las del vestíbulo se encienden solas, pero las de los pasillos no, y los visitantes se dan con las armaduras. Trescientas velas y un señor con una pértiga.' },
				{ id: 'taquilla', name: 'Una taquilla. Con horario', cost: 12000, mult: { visitas: 1.5 }, set: { 'flag.p7_c_taquilla': true },
					desc: 'Hasta ahora, el Conde cobraba «lo que el visitante considerase justo, después de conocerme». Nadie consideraba nada. Una garita, un rollo de entradas y un cartel.' },
				{ id: 'alanorte', name: 'Abrir el ala norte', cost: 14000, mult: { all: 1.1 }, slots: 1, store: 1,
					desc: 'Cerrada desde que un Gastly le robó la sábana a otro. Hay que apuntalar una escalera y poner flechas en los pasillos. Más recorrido, un día más de caja y sitio para un Pokémon más.' },
				{ id: 'folletos', name: 'Folletos: «El castillo que no envejece»', cost: 12000, mult: { visitas: 1.3 }, set: { 'flag.p7_c_folletos': true }, script: 'p7_c_up_folletos',
					desc: 'Diez mil folletos repartidos de Luminalia a Relieve. El Conde ha exigido revisar su foto. Ha elegido una de hace mucho. Es igual que la de ahora.' },
				{ id: 'bodega', name: 'Abrir la bodega', cost: 30000, unlock: 'bodega', script: 'p7_c_up_bodega',
					desc: 'Limpiar tres siglos de telarañas y hacer inventario de lo que hay ahí abajo. Abre una línea nueva: la bodega.' },
				{ id: 'misterio', name: 'Noches de misterio', cost: 22000, mult: { all: 1.25 },
					desc: 'Cena, un robo fingido y tres sospechosos, todos los sábados del año. El Conde insiste en ser siempre uno de ellos. Suele ser el culpable.' },
				{ id: 'tasa', name: 'Pagar la tasa atrasada', cost: 20000, share: 10, set: { 'flag.p7_c_tasa': true }, script: 'p7_c_up_tasa',
					desc: 'Lo que el castillo debe al Registro de Patrimonio. Sin inspectores en la puerta, el Conde te cede 10 puntos más de la caja.' },
				{ id: 'tejados', name: 'Tejados de pizarra nuevos', cost: 26000, share: 10, need: ['tasa'],
					desc: 'El castillo se llama Caduco por algo. Con los tejados arreglados, el Conde te cede 10 puntos más. «Tómelos. A mí el dinero me dura demasiado».' },
			],
			jobs: { slots: 2, types: ['Ghost', 'Dark'], favs: { gastly: 0.05, haunter: 0.05, gengar: 0.05, litwick: 0.05, lampent: 0.05, chandelure: 0.05, misdreavus: 0.03, mismagius: 0.03, zubat: 0.03, golbat: 0.03, crobat: 0.03 },
				text: 'Asustar con educación, sostener velas, flotar detrás de los visitantes. El Conde les da conversación toda la noche.' },
			managers: [
				{ npc: 'conde', desc: 'Encantador y pésimo para los negocios: a quien le cae bien, no le cobra. Vende muy bien las postales en las que sale él.', mult: { recuerdos: 1.25 } },
				{ npc: 'hector', cond: 'flag.p7_hector', wage: 450, mult: { visitas: 1.3 },
					desc: 'De lunes a viernes lleva la taquilla con rigor de aseguradora. Los sábados hace de héroe en el patio. Nadie se cuela.' },
				{ npc: 'simon', cond: 'flag.p7_simon', wage: 300, mult: { all: 1.12 },
					desc: 'La «visita escéptica»: explica que nada de lo que estás viendo existe. La gente sale más asustada que con la normal.' },
			],
			eventRate: 0.7,
			events: [
				{ id: 'perdido', name: 'Visitante extraviado', w: 3, npc: 'conde',
					text: 'Tengo que comunicarle una pequeña incidencia. Un caballero de Relieve entró el martes con la visita de las once. La visita salió. Él, no. Lo oigo por el ala norte. Está bien. Canta.',
					options: [
						{ text: 'Mandar a buscarlo', result: 'Lo encuentran en la biblioteca, feliz. Dice que es el mejor juego de escape de su vida y que volverá con sus cuñados.', effect: { boost: { mult: { visitas: 1.2 }, days: 2, label: 'Boca a boca' } } },
						{ text: 'Poner flechas en todos los pasillos', cost: 2500, result: 'Flechas fosforescentes. El Conde las encuentra «de una vulgaridad exquisita». Nadie más se pierde, salvo quien quiere.', effect: { boost: { mult: { all: 1.15 }, days: 5, label: 'Pasillos señalizados' } } },
					] },
				{ id: 'inspector', name: 'Un inspector', w: 2, npc: 'conde', cond: '!flag.p7_c_tasa',
					text: 'Ha venido un joven del Registro de Patrimonio, con una carpeta. Quiere ver los libros. Le he enseñado los de la biblioteca. No eran esos.',
					options: [
						{ text: 'Pagar la multa y que se vaya', cost: 5000, result: 'El inspector cobra, sella y se va con luz de día, que es lo que quería desde el principio.', effect: { boost: { mult: { all: 1.15 }, days: 5, label: 'Sin inspecciones' } } },
						{ text: '«Invítelo a cenar.»', result: 'El inspector cena. Dicen que muy bien. A la mañana siguiente precinta dos salas «por si acaso» y no recuerda por qué.', effect: { boost: { mult: { all: 0.88 }, days: 2, label: 'Salas precintadas' } } },
					] },
				{ id: 'sabanas', name: 'Los del ala norte', w: 3, npc: 'conde',
					text: 'Mis Gastly se niegan a asustar. Alegan que las sábanas son de cuando mi abuelo, que era yo, y que con este género no se puede trabajar. Han dejado una nota. Está escrita en vaho.',
					options: [
						{ text: 'Comprar sábanas nuevas', cost: 1800, result: 'Hilo de Novarte, blanco roto. Esa noche hay tres desmayos y una pedida de mano. El Conde lo considera un éxito.', effect: { boost: { mult: { all: 1.2 }, days: 3, label: 'Sustos de calidad' }, happy: 8 } },
						{ text: '«Que asusten con lo que hay.»', result: 'Asustan con lo que hay. Sin ganas. Una niña le pregunta a un Gastly si está triste. El Gastly dice que un poco.', effect: { boost: { mult: { visitas: 0.85 }, days: 2, label: 'Sustos sin ganas' } } },
					] },
				{ id: 'boda', name: 'Una boda', w: 2, npc: 'conde',
					text: 'Una pareja de Luminalia desea casarse aquí. A medianoche. Con niebla. Preguntan si la niebla va incluida. Les he dicho que la niebla es de la casa, como yo.',
					options: [
						{ text: 'Aceptar y poner las flores', cost: 2500, result: 'Crisantemos, velas y niebla hasta la rodilla. La novia llora. El novio llora. Un Litwick, de la emoción, se apaga.', effect: { money: 9000 } },
						{ text: 'Aceptar, pero que oficie el Conde', result: 'El Conde oficia. Tarda tres horas, porque cita de memoria todas las bodas que ha visto. Pagan menos; vuelven todos los aniversarios.', effect: { money: 3500, happy: 5 } },
					] },
				{ id: 'retrato', name: 'El retrato que guiña', w: 2, npc: 'conde',
					text: 'Una señora jura que el retrato del pasillo, el de la gorguera, le ha guiñado un ojo. Quiere comprarlo. Le he explicado que no vendo a la familia. Insiste.',
					options: [
						{ text: 'Venderle una copia', result: 'Una copia buena, con su marco. La señora se la lleva encantada. Escribe a la semana: la copia también guiña.', effect: { money: 2800 } },
						{ text: 'Encargar postales del retrato', cost: 2000, result: 'Quinientas postales. Desde ciertos ángulos, guiñan. La imprenta dice que no ha hecho nada especial.', effect: { boost: { mult: { recuerdos: 1.6 }, days: 4, label: 'La postal que guiña' } } },
						{ text: '«La familia no se vende.»', result: 'El Conde se lo comunica con una reverencia. El retrato, dicen, sonríe.' },
					] },
				{ id: 'poliza', name: 'La póliza', w: 2, npc: 'hector', cond: 'flag.p7_hector',
					text: '¡{jugador}! He pedido presupuesto de seguro a seis compañías. Cinco se han reído. La sexta era la mía, y también. ¡Pero he redactado yo una póliza! Cubre caídas, sustos y «fenómenos de origen indeterminado».',
					options: [
						{ text: 'Firmar la póliza de Héctor', cost: 3200, result: 'Catorce páginas, cuatro anexos y un dibujo de Hawlucha en la portada. Ahora los grupos de colegio pueden venir. Vienen.', effect: { boost: { mult: { visitas: 1.25 }, days: 6, label: 'Excursiones escolares' } } },
						{ text: '«Que la firme el Conde.»', result: 'El Conde firma. En «fecha de nacimiento» escribe algo, lo tacha y pone «la que convenga». Héctor lo apunta. No sabe dónde.' },
					] },
				{ id: 'tarta', name: 'La reseña del escéptico', w: 2, npc: 'simon', cond: 'flag.p7_simon',
					text: 'Nota para el episodio: he revisado el folleto. Pone «al final del recorrido hay tarta». He hecho el recorrido once veces. La tarta es mentira. Lo voy a decir en antena, salvo que haya tarta.',
					options: [
						{ text: 'Que haya tarta', cost: 1500, result: 'Hay tarta. De moras, muy roja. Simón la analiza, la prueba y emite: «Castillo sin fantasmas, con tarta. Cuatro estrellas». Es su mejor nota en nueve años.', effect: { boost: { mult: { all: 1.2 }, days: 4, label: 'Cuatro estrellas' } } },
						{ text: '«Dilo en antena.»', result: 'Lo dice. La mitad de los oyentes viene a comprobar si es verdad que no hay tarta. No la hay. Se van satisfechos de tener razón.', effect: { boost: { mult: { visitas: 1.15 }, days: 2, label: 'Polémica' } } },
					] },
			],
		},

		// -----------------------------------------------------------------
		// 3 · LA CANTERA VIEJA DE PETROGLIFO (objetos raros)
		// -----------------------------------------------------------------
		p7_excavacion: {
			name: 'La cantera vieja', icon: '⛏️', loc: 'petroglifo', partner: 'cientifico_fosiles',
			cond: EXC_COND,
			blurb: 'Tres zanjas detrás del Laboratorio de Fósiles y una beca que alguien denegó.',
			buy: { cost: 12000, text: '«No es una inversión. Las inversiones dan dinero. Esto da piedras. Algunas, preciosas.»', script: 'p7_exc_entrada' },
			share: [{ pct: 40 }],
			upkeep: 500, store: 4,
			lines: {
				criba: { name: 'Criba', icon: '🪨', desc: 'Lo que sale del cedazo y no le interesa a la ciencia: se limpia y se vende al Museo de Luminalia y a los turistas del acuario.', money: 1800, items: [{ id: 'stardust', perDay: 0.1 }] },
				minerales: { name: 'Vetas', icon: '💎', desc: 'La capa de arriba de la cantera. Piedras que hacen evolucionar a ciertos Pokémon; salen muy de vez en cuando.',
					items: [{ id: 'sunstone', perDay: 0.03 }, { id: 'duskstone', perDay: 0.03 }, { id: 'dawnstone', perDay: 0.03 }, { id: 'shinystone', perDay: 0.03 }, { id: 'icestone', perDay: 0.03 }, { id: 'hardstone', perDay: 0.1 }] },
				hondo: { name: 'La galería honda', icon: '🦴', desc: 'Lo que hay debajo. Huesos viejos, cantos pulidos por algo que no era agua y objetos que un Pokémon puede llevar encima.', locked: true,
					items: [{ id: 'rarebone', perDay: 0.15 }, { id: 'eviolite', perDay: 0.03 }, { id: 'rockyhelmet', perDay: 0.03 }, { id: 'razorfang', perDay: 0.025 }, { id: 'ovalstone', perDay: 0.03 }, { id: 'leftovers', perDay: 0.025 }] },
			},
			upgrades: [
				{ id: 'cascos', name: 'Cascos. Muchos cascos', cost: 1500, mult: { all: 1.08 }, script: 'p7_e_up_cascos',
					desc: 'Era la partida más larga del presupuesto de Petra. Uno por persona, uno para Pala cuando vuelva y cuatro de repuesto «por estadística».' },
				{ id: 'toldo', name: 'Un toldo sobre las zanjas', cost: 3000, mult: { all: 1.15 }, set: { 'flag.p7_e_toldo': true },
					desc: 'En Petroglifo llueve de lado. Con un toldo, la tierra no se vuelve sopa y se trabaja también por la tarde.' },
				{ id: 'cribas', name: 'Cribas de tres mallas', cost: 9000, mult: { criba: 1.5 },
					desc: 'La que había era un colador de cocina. El Dr. Lazare jura que era provisional. Lleva su nombre grabado.' },
				{ id: 'luces', name: 'Generador y focos', cost: 5000, store: 2, slots: 1,
					desc: 'Para no dejar las zanjas a oscuras ni los hallazgos a la intemperie. Caben dos días más de producción y hay sitio para un Pokémon más.' },
				{ id: 'martillo', name: 'Martillo de aire', cost: 16000, mult: { minerales: 1.5 },
					desc: 'Para la roca dura de arriba, donde están las vetas. Hace un ruido espantoso. El acuario ha mandado una queja firmada por un Wailmer.' },
				{ id: 'galeria', name: 'Apuntalar la galería honda', cost: 26000, unlock: 'hondo', set: { 'flag.p7_e_galeria': true }, script: 'p7_e_up_galeria',
					desc: 'La zanja tres da a un hueco que baja. Hacen falta vigas, una escalera de verdad y alguien que diga que sí. Abre una línea nueva: la galería honda.' },
				{ id: 'beca', name: 'La Beca Brossard', cost: 8000, share: 10, script: 'p7_e_up_beca',
					desc: 'Pagar tú lo que el comité no quiso. A cambio, el laboratorio te cede 10 puntos más de lo que salga.' },
				{ id: 'catedra', name: 'Un ayudante para el laboratorio', cost: 9000, share: 10, need: ['beca'],
					desc: 'Alguien que catalogue mientras el Dr. Lazare restaura (y, los martes, mientras hace de socorrista). Otros 10 puntos para ti.' },
			],
			jobs: { slots: 2, types: ['Ground', 'Rock', 'Steel'], favs: { bunnelby: 0.06, diggersby: 0.06, drilbur: 0.06, excadrill: 0.06, sandshrew: 0.03, sandslash: 0.03, onix: 0.03, steelix: 0.03, rhyhorn: 0.03 },
				text: 'Cavar, apartar piedra y oler vetas. Los que nacieron para hacer túneles no entienden que esto se llame trabajo.' },
			managers: [
				{ npc: 'cientifico_fosiles', name: 'Dr. Lazare', desc: 'Dice que no a todo y luego resulta que sí. No se le escapa un hueso. Los martes no está: es socorrista.', mult: { hondo: 1.2 } },
				{ npc: 'tobias', cond: 'flag.p7_tobias', wage: 350, mult: { criba: 1.5 },
					desc: 'Lo retransmite todo. Los patrocinadores pagan por salir en la carretilla. Duquesa supervisa desde una silla plegable y no aprueba nada.' },
			],
			eventRate: 0.7,
			events: [
				{ id: 'croquis', name: 'Un croquis de Petra', w: 3, npc: 'petra',
					text: '(Mensaje, con una foto de una servilleta dibujada.) ¡{jugador}! He visto las fotos de la zanja dos. Están cavando hacia donde no es. Mira el croquis. La mancha de arriba es café, no una veta. La de abajo sí es una veta. Creo.',
					options: [
						{ text: 'Seguir el croquis', result: 'Giran la zanja treinta grados. A media tarde aparece la veta. La mancha de café, por cierto, también estaba: es una piedra con forma de mancha de café.', effect: { boost: { mult: { minerales: 1.3 }, days: 2, label: 'Croquis de Petra' } } },
						{ text: 'Seguirlo y mandarle un teléfono resistente al agua', cost: 1500, result: 'Ahora manda croquis todos los días. Desde barcos, desde agujeros, una vez desde dentro de un cubo. Casi todos sirven.', effect: { boost: { mult: { all: 1.15 }, days: 5, label: 'Dirección a distancia' } } },
					] },
				{ id: 'lluvia', name: 'Agua en la zanja', w: 2, npc: 'cientifico_fosiles', cond: '!flag.p7_e_toldo',
					text: 'Ha llovido de lado. La zanja uno es una piscina. Lo digo con conocimiento: soy socorrista.',
					options: [
						{ text: 'Alquilar una bomba', cost: 2000, result: 'Dos horas de bomba y la zanja queda limpia. El agua, al irse, deja algo brillando en el fondo.', effect: { items: [{ id: 'stardust', n: 1 }], boost: { mult: { all: 1.1 }, days: 2, label: 'Zanja lavada' } } },
						{ text: 'Esperar a que se seque', result: 'Se seca. Tarda. Lazare aprovecha para dar una clase de natación a los peones. No la habían pedido.', effect: { boost: { mult: { all: 0.85 }, days: 2, label: 'Barro' } } },
					] },
				{ id: 'martes', name: 'Es martes', w: 2, npc: 'cientifico_fosiles',
					text: 'Mañana es martes. Los martes soy socorrista del puerto. Llevo veinte años sin faltar y no voy a empezar ahora por una cantera, por muy mía que sea. Que es tuya.',
					options: [
						{ text: 'Que la cantera cierre los martes', result: 'Cierra. El miércoles está todo donde se dejó, salvo una pala, que aparece en el acuario. Nadie pregunta.', effect: { boost: { mult: { all: 0.9 }, days: 1, label: 'Martes' } } },
						{ text: 'Pagar al chico del acuario para que vigile', cost: 900, result: 'El chico vigila con una seriedad tremenda y un silbato. No pasa nadie. Él cree que es gracias al silbato.', effect: { boost: { mult: { all: 1.1 }, days: 2, label: 'Martes con vigilante' } } },
					] },
				{ id: 'museo', name: 'El museo pregunta', w: 2, npc: 'cientifico_fosiles',
					text: 'Ha escrito el Museo de Luminalia. Quieren la pieza que salió el jueves para la vitrina de la entrada. Es una piedra corriente. Se lo he dicho. Dicen que es fotogénica.',
					options: [
						{ text: 'Prestarla con un cartel de la cantera', result: 'La piedra corriente sale en la portada del boletín del museo. Los domingos hay cola en el cedazo para «encontrar una igual».', effect: { boost: { mult: { criba: 1.35 }, days: 4, label: 'Piedra famosa' } } },
						{ text: 'Vendérsela', result: 'El museo paga por una piedra corriente lo que no pagó nunca por un fósil. Lazare tarda un día entero en volver a hablar.', effect: { money: 5200 } },
					] },
				{ id: 'tumba', name: 'Un hueso grande', w: 1, npc: 'cientifico_fosiles', once: true,
					text: 'Hemos sacado un hueso enorme. Me he emocionado. Luego lo he medido. Es de un Tauros. De hace cuarenta años, no cuarenta millones. Tiene al lado un cencerro y una botella de sidra. A este lo enterró alguien que lo quería.',
					options: [
						{ text: 'Volver a enterrarlo, con una placa', cost: 1000, result: 'Una losa pequeña: «Aquí descansa un buen Tauros». El pueblo se entera. Una anciana viene a decir cómo se llamaba y deja otra botella de sidra.', effect: { happy: 12, boost: { mult: { all: 1.1 }, days: 3, label: 'El pueblo ayuda' } } },
						{ text: 'Dejarlo donde estaba y cavar al lado', result: 'Lo tapan con cuidado y abren la zanja dos metros más allá. Lazare se queda un rato con el cencerro en la mano.' },
					] },
				{ id: 'patito', name: 'Patrocinio', w: 2, npc: 'tobias', cond: 'flag.p7_tobias',
					text: '¡Patrocinadores, atención! Los de las pociones quieren su logo en la carretilla. EN LA CARRETILLA. Es el sitio con más minutos de pantalla después de Duquesa. ¿Qué hago? ¿Qué hacemos? ¡Suspense!',
					options: [
						{ text: '«Que lo pinten.»', result: 'Carretilla amarilla con un patito. Pagan en pociones, como siempre. Muchas.', effect: { items: [{ id: 'hyperpotion', n: 4 }] } },
						{ text: 'Invitarlos a comer y negociar en serio', cost: 1200, result: 'Tobías negocia fatal. Duquesa se sienta encima del contrato y mira fijamente al representante hasta que sube la cifra. Dos veces.', effect: { money: 6500 } },
					] },
				{ id: 'duquesa', name: 'Duquesa no se mueve', w: 2, npc: 'tobias', cond: 'flag.p7_tobias',
					text: 'Problema técnico. Duquesa se ha tumbado encima del hallazgo de hoy. No sabemos qué es, porque está debajo. Lleva tres horas. Parpadea despacio. Es su forma de decir «oblíguenme».',
					options: [
						{ text: 'Esperar', result: 'Se levanta al anochecer, por decisión propia, como si la idea hubiera sido suya. Debajo había un hueso. Está tibio, de tanto tenerla encima.', effect: { items: [{ id: 'rarebone', n: 1 }], boost: { mult: { all: 0.92 }, days: 1, label: 'Tarde perdida' } } },
						{ text: 'Sobornarla con atún del bueno', cost: 600, result: 'Atún del puerto, en plato de loza. Duquesa lo considera. Acepta. Debajo había un hueso y, debajo del hueso, otra cosa.', effect: { items: [{ id: 'rarebone', n: 1 }, { id: 'hardstone', n: 1 }] } },
					] },
			],
		},
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== RANCHO ===================
		p7_adela_aviso: [
			{ set: { 'flag.p7_adela_aviso': true } },
			{ text: 'Rotom vibra. Un mensaje de un número de la Ruta 42. Luego, el mismo mensaje otra vez. Adela sigue sin llevarse bien con el teléfono.' },
			{ if: JUG, then: [
				{ say: 'sobrina', as: 'Adela (mensaje)', text: '«Informe. Las Mareep, bien. El tejado, mal. He encontrado el cuaderno de cuentas de mi tío. Hay que hablar de dinero. No es nada malo. Bueno, depende de lo que entiendas por malo. —A.»' },
				{ say: 'sobrina', as: 'Adela (mensaje)', text: '«Eres {el|la|le} dueñ{o|a|e}. Te toca mirarlo. Te he puesto en el cuaderno, para que lo veas desde donde estés. Si vienes, hay café. —A.»' },
				{ say: 'rotom', text: '¡Bzzt! Me ha mandado las cuentas del rancho. ¡Ya las tengo! Te las guardo en **Negocios**. Hay una columna que se llama «ya veremos». Es la más larga.' },
			], else: [
				{ say: 'sobrina', as: 'Adela (mensaje)', text: '«No te escribo para pedirte nada. Te escribo porque dije que escribiría. Las Mareep, bien. Borla, gorda. Las cuentas, regular. He vendido el carro. —A.»' },
				{ say: 'sobrina', as: 'Adela (mensaje)', text: '«Si vuelves por Johto, pasa por la Ruta 42. No por las cuentas. Bueno. Un poco por las cuentas. Hay una cosa que quiero preguntarte y por aquí no sé. —A.»' },
				{ say: 'rotom', text: '¡Bzzt! Ha escrito «no te pido nada» dos veces. Cuando alguien lo escribe dos veces… No, yo no opino. Yo solo cuento palabras.' },
			] },
		],

		// Entrada en la rama «el rancho es tuyo» (buy.script)
		p7_rancho_entrada: [
			{ text: 'La cocina del rancho. Sobre la mesa, un cuaderno de tapas de hule negro, hinchado de papeles metidos entre las hojas. En la primera página, con letra de Don Aurelio: «CUENTAS. No mirar con hambre».' },
			{ say: 'sobrina', text: 'Lo llevaba así. Lo que entra, a la izquierda. Lo que sale, a la derecha. Lo que no sabía dónde poner, en el medio. El medio es casi todo.' },
			{ say: 'sobrina', text: 'Te resumo: la lana da. La leche da. El pienso se lo come casi todo, y lo que no se come el pienso se lo come el tejado. Con dinero, este rancho rinde. Sin dinero, aguanta. Mi tío llevaba veinte años en «aguanta».' },
			{ say: 'sobrina', text: 'Y otra cosa. No pongas esa cara, que ya sé que se me notó. No me hizo gracia quedarme, no. No es por el rancho. Es que yo sé curar ovejas, no contarlas.' },
			{ choice: [
				{ text: '«Dime qué hace falta y lo pago.»', then: [
					{ say: 'sobrina', text: 'Así no. Así es como se arruina la gente buena. —Empuja el cuaderno hacia ti—. Tú miras, tú decides qué se arregla primero y cuánto esfuerzo va a cada cosa. Yo te digo si es una tontería. ¿Estamos?' },
				] },
				{ text: '«¿Y si lo lleva otra persona?»', then: [
					{ say: 'sobrina', text: '…¿Otra persona? —Se queda quieta. No está ofendida. Está haciendo cuentas—. Si aparece alguien que sepa y que quiera a estas bestias, me haces un favor. Tengo una consulta al otro lado del monte que se me está muriendo de risa.' },
					{ say: 'sobrina', text: 'Pero que lo merezca. A mi tío no le valía cualquiera. A mí tampoco.' },
				] },
			] },
			{ say: 'sobrina', text: 'De lo que salga limpio, seis partes para ti y cuatro para quien se levanta a las cinco. Si pagas lo que debía mi tío, hablamos de más. Lo he escrito aquí. Con tinta. Para que no se lo coma Borla.' },
			{ text: 'Fuera, en el prado, una Mareep levanta la cabeza hacia la ventana de la cocina, como si hubiera oído su nombre.' },
			{ say: 'sobrina', text: 'Ah. Y lo de tus Pokémon de lana. —Señala la ventana con la barbilla—. Que me escribió mi tío que te dio a Faro. Si alguno quiere pasar aquí una temporada, sitio hay. No es dejarlo arrumbado. Es mandarlo a casa. Tú verás.', cond: 'flag.b02_ampharos' },
			{ say: 'sobrina', text: 'Ah. Y si llevas algún Pokémon de lana, o alguno que eche de menos el campo: aquí hay sitio. No es dejarlo arrumbado. Es darle una casa a temporadas. Tú verás.', cond: '!flag.b02_ampharos' },
			{ diary: 'Hoy hemos mirado las cuentas del rancho Prado con Adela. Yo sumo muy rápido, pero el cuaderno de Don Aurelio tiene una columna que se llama «ya veremos» y esa no sé sumarla.\n\nAhora el rancho sale en mi pantalla de Negocios. Si se llena el almacén, aviso. ¡Bzzt! Borla intentó comerse una esquina de mi funda. No lo consiguió. Casi.', cond: 'flag.b01_diario' },
			{ intel: { npc: 'sobrina', text: 'Lleva el día a día del rancho Prado y te rinde cuentas en el cuaderno de hule de su tío. Dice que sabe curar ovejas, no contarlas: si aparece alguien que lo merezca, volvería a su consulta.' } },
		],

		// Entrada en la rama «el rancho es de Adela»: aquí se paga
		p7_rancho_trato: [
			{ if: SOCIO_R, then: [{ venture: R }, { end: true }] },
			{ if: 'flag.p7_rancho_oferta', then: [
				{ say: 'sobrina', text: 'Sigue igual. Justo. Y la oferta sigue en pie, que yo no retiro lo que me costó tanto decir: **₽20 000**, cuarenta y cinco partes de cada cien, y un papel.' },
			], else: [
				{ text: 'Adela está en la mesa de la cocina con el cuaderno de tapas de hule, una calculadora y un montón de facturas ordenadas por tamaño. Cuando entras, pone el brazo encima, como quien tapa un examen.' },
				{ say: 'sobrina', text: 'No mires. …Bueno. Mira. Total, se me nota en la cara.' },
				{ say: 'sobrina', text: 'Vendí el carro. Pagué el pienso. El pienso se acabó, porque las ovejas tienen esa costumbre. Me levanto a las cinco para ellas, paso consulta hasta las ocho de la tarde y de noche hago números. Los números no salen. Los hago otra vez. Tampoco.' },
				{ text: 'Aparta el brazo. En el cuaderno, debajo de la letra de Don Aurelio, está la suya: grande, recta, de receta. Hay muchas cosas tachadas.' },
				{ say: 'sobrina', text: 'Aquel día me dijiste que fuera mío y yo dije que sí. No puse buena cara, ya lo sé. No era por ti. Era que ya sabía esto. —Da un golpecito en el cuaderno—. Me viene grande. Ya está. Ya lo he dicho. Llevo semanas sin decírselo ni a Borla.' },
				{ say: 'sobrina', text: 'Sé curarlas. Sé cuál tiene fiebre antes de tocarla. Lo que no sé es cuánta lana hay que vender para llegar a marzo. Mi tío lo sabía de memoria y no lo apuntó en ningún sitio. Y nunca le pidió ayuda a nadie. Mira cómo le fue: meses tosiendo en esa mecedora y jurando que era el polvo del heno.' },
				{ set: { 'flag.p7_rancho_oferta': true } },
				{ prompt: 'Adela mira las facturas. No a ti.', choice: [
					{ text: '«Déjame pagarlo. El tejado, el pienso, todo.»', then: [
						{ say: 'sobrina', text: 'No. —Rápido, sin levantar la voz—. Regalado, no. Mi tío no aceptó ni los folletos. Si agarro tu dinero así, mañana te doy las gracias y pasado no te puedo mirar. Yo sé cómo soy.' },
						{ say: 'sobrina', text: 'Pero… —Respira por la nariz, como le enseñó a respirar a todo el mundo—. Hay otra manera. La llevo pensando desde que vendí el carro, y no sabía cómo se pedía.' },
					] },
					{ text: '«No tienes que poder sola.»', then: [
						{ text: 'Adela abre la boca para contestar algo seco. No le sale. Se queda mirando la ventana, donde el rebaño pasta muy junto.' },
						{ say: 'sobrina', text: '…Eso no me lo ha dicho nadie. En mi familia eso no se dice. Se aguanta y luego se pone en la lápida. —Se frota la cara—. Bueno. Pues entonces te lo pido. Atiende, que solo lo voy a pedir una vez.' },
					] },
					{ text: 'Sentarte enfrente y abrir el cuaderno', then: [
						{ text: 'Te sientas. Giras el cuaderno hacia ti. Lees la columna de «ya veremos» sin decir nada. Adela te deja leer. Es la primera vez que no lo tapa.' },
						{ say: 'sobrina', text: 'Nadie más lo ha visto. —Baja la voz—. Si lo vas a leer, léelo como alguien a quien le importa cómo acaba. Porque te lo voy a pedir. Y solo lo voy a pedir una vez.' },
					] },
				] },
				{ say: 'sobrina', text: 'Entra conmigo. De soci{o|a|e}. Con un papel, con una parte y con derecho a decirme que lo estoy haciendo mal. Eso no es limosna. Eso es sociedad. A un socio no se le dan las gracias: se le rinden cuentas.' },
				{ say: 'sobrina', text: 'Tú pones **₽20 000**. Con eso pago lo que debo y queda para empezar por el tejado. De lo que salga limpio, cuarenta y cinco partes de cada cien son tuyas. Si más adelante pones más, sube, hasta pasar de la mitad. No me importa mandar menos. Me importa que ellas coman.' },
				{ say: 'sobrina', text: 'El apellido del cartel no se toca. La mecedora, tampoco. Todo lo demás se habla. ¿Estamos?' },
			] },
			{ prompt: '¿Entras de soci{o|a|e} en el rancho Prado? (₽20 000)', choice: [
				{ text: 'Poner los ₽20 000', cond: 'money >= ' + ENTRADA_SOBRINA, then: [
					{ money: -ENTRADA_SOBRINA },
					{ set: { 'flag.p7_rancho_trato': true } },
					{ venture: R, join: true },
					{ text: 'Adela cuenta los billetes dos veces. Luego abre el cuaderno por una página limpia y escribe, con letra grande: «SOCI{O|A|E}S». Debajo, tu nombre. Debajo, el suyo. Tacha el suyo y lo pone encima. «Por orden de antigüedad».' },
					{ say: 'sobrina', text: 'Ya está. Ahora, si esto se hunde, nos hundimos l{o|a|e}s dos. —Se le escapa media sonrisa—. Es la primera vez desde el entierro que una frase así me deja dormir.' },
					{ if: 'flag.b04_adela_msg', then: [
						{ text: 'Se levanta. Va a la alacena. Baja la lata de las galletas, la abre y saca dos hojas de cuaderno dobladas en cuatro.' },
						{ say: 'sobrina', text: 'La primera. La que no mandé. Decía cosas que no hacía falta poner en un papel. —Te la da sin mirarte—. Ahora ya las sabes, así que da igual. Léela luego. Delante de mí, no.' },
						{ set: { 'flag.p7_cartalata_dada': true } },
						{ give: 'p7_cartalata' },
					], else: [
						{ say: 'sobrina', text: 'Y la carta que te escribí y no mandé sigue en la lata de las galletas. Esa te la doy otro día. Hoy ya he dicho bastante.' },
					] },
					{ say: 'sobrina', text: 'Y otra cosa, ya que estoy pidiendo. Si un día aparece alguien que lleve el día a día mejor que yo, lo apuntas en el cuaderno y yo me vuelvo a la consulta tan contenta. No me ofendo. Pero que lo merezca. A mi tío no le servía cualquiera. A mí tampoco.' },
					{ say: 'sobrina', text: 'Y si alguno de tus Pokémon quiere pasar aquí una temporada, sitio hay. Los de lana no vienen a trabajar: vuelven a casa. Faro sabe dónde está cada cosa mejor que yo.', cond: 'flag.b02_ampharos' },
					{ say: 'sobrina', text: 'Y si alguno de tus Pokémon quiere pasar aquí una temporada, sitio hay. Los de lana no vienen a trabajar: vuelven a casa.', cond: '!flag.b02_ampharos' },
					{ text: 'Sales al porche. Detrás de ti, por la ventana de la cocina, ves a Adela cerrar el cuaderno, quedarse un momento con la mano encima y, por primera vez desde que la conoces, dejar caer los hombros.' },
					{ diary: 'Hoy mi entrenador{|a|e} y Adela han firmado un papel en la mesa de la cocina del rancho Prado. Ahora son soci{o|a|e}s. Ella no quería regalos; quería que alguien mirara las cuentas con ella.\n\nEl rancho ya sale en mi pantalla de Negocios. ¡Bzzt! Borla intentó comerse el contrato. Adela lo había plastificado.', cond: 'flag.b01_diario' },
					{ intel: { npc: 'sobrina', text: 'Reconoció que el rancho le venía grande y te pidió entrar con ella: no un regalo, un contrato. Lleva el día a día; si aparece alguien que lo merezca, volvería a su consulta.' } },
					{ venture: R },
				] },
				{ text: 'No me alcanza ahora mismo', cond: 'money < ' + ENTRADA_SOBRINA, then: [
					{ say: 'sobrina', text: 'Pues cuando te alcance. El rancho lleva aquí tres generaciones; aguanta una semana más. —Recoge las facturas—. Y no me mires con pena, que lo difícil ya lo he hecho: lo he dicho en voz alta.' },
				] },
				{ text: '«Déjame pensarlo.»', then: [
					{ say: 'sobrina', text: 'Piénsalo. Yo sigo aquí. No me voy a ningún sitio: tengo cincuenta y tantas razones con lana.' },
				] },
			] },
		],

		// La primera carta, cuando ya llegó la segunda (B4)
		p7_adela_lata: [
			{ set: { 'flag.p7_cartalata_dada': true } },
			{ text: 'Adela te ve entrar y, antes de saludar, va a la alacena. Baja la lata de las galletas y la deja en la mesa de la cocina, encima del cuaderno.' },
			{ say: 'sobrina', text: 'Te llegó la segunda, ¿no? La del mechón. Ahí ponía que la primera seguía en la lata. —Saca dos hojas de cuaderno dobladas en cuatro—. Pues ya no sigue.' },
			{ say: 'sobrina', text: 'La escribí la misma noche. Decía cosas que no hacía falta poner en un papel. —Te la da sin mirarte—. Ahora ya las sabes, así que da igual. Léela luego. Delante de mí, no. ¿Estamos?' },
			{ give: 'p7_cartalata' },
			{ intel: { npc: 'sobrina', text: 'Te dio la primera carta, la que escribió la noche de la decisión y nunca mandó. Estaba en la lata de las galletas.' } },
		],

		// Rama «el rancho es de la Fundación»: no hay negocio
		p7_rancho_lemnis: [
			{ set: { 'flag.p7_rancho_lemnis': true } },
			{ text: 'Le dices a Adela que tienes dinero. Que podrías pagar el pienso, el tejado, lo que haga falta. Ella te escucha hasta el final, mirando la placa azul de la cerca.' },
			{ say: 'sobrina', text: 'No puedo. —Sin enfado—. Firmé. Tres hojas y una inicial. El pienso lo ponen ellos. El tejado lo pusieron ellos. Cualquier dinero que entre aquí tiene que pasar por su cuaderno, no por el mío.' },
			{ say: 'sobrina', text: 'Y los martes miran las cuentas. Todas. Si aparece un billete que no es suyo, preguntan de quién es. Son muy amables preguntando.' },
			{ text: 'Se queda callada. En el prado, el rebaño pasta en fila, sin un balido.' },
			{ say: 'sobrina', text: 'Guárdalo. El dinero. —Baja la voz, aunque no hay nadie—. Los contratos se acaban. Este también. Y el día que se acabe, alguien va a tener que comprar todo lo que ahora regalan. Ese día sí te voy a llamar. Y no voy a decir que no pido nada.' },
			{ say: 'sobrina', text: 'La lata de las galletas sigue en su sitio. Ahí no mira nadie.', cond: 'flag.b04_adela_lana' },
			{ text: 'No hay cuaderno de cuentas sobre la mesa de la cocina. Hay una carpeta azul. Adela la ha puesto debajo del frutero.' },
		],

		// ---- Escenas de mejoras ----
		p7_r_up_letrero: [
			{ text: 'El letrero nuevo llega en un camión de Trigal: madera de encina, letras blancas. «RANCHO PRADO · Lana y leche · Desde antes de que usted naciera».' },
			{ say: 'sobrina', text: 'Lo de «desde antes de que usted naciera» lo puse yo. Mi tío lo decía en todas las ferias. A todo el mundo. También a un señor de noventa años.' },
			{ text: 'Adela lo clava dos palmos más alto que el viejo. Borla se acerca, estira el cuello, calcula. No llega. Te mira. Sabe que has sido tú.' },
			{ say: 'sobrina', text: 'El viejo no lo tiro. —Lo lleva al porche y lo apoya junto a la mecedora, con la esquina mordida hacia la pared—. Ese lo talló él. Ese se queda donde se ve desde el asiento.' },
		],
		p7_r_up_consulta: [
			{ text: 'El granero viejo huele a pintura. Hay una camilla de acero, una nevera que zumba, un armario con llave y, colgada de un clavo, la placa de latón: «A. Prado · Veterinaria». Debajo, a rotulador: «Urgencias, gritar fuerte».' },
			{ text: 'Adela está en la puerta. No entra. Lo mira todo desde el umbral, con las manos en los bolsillos de la bata.' },
			{ say: 'sobrina', text: 'Cinco años pasando consulta en la parte de atrás de un carro. Y en cocinas. Una vez, encima de una lavadora. —Entra. Toca la camilla con un dedo—. Esto tiene ruedas. Y freno.' },
			{ choice: [
				{ text: '«Era lo que hacía falta, ¿no?»', then: [{ say: 'sobrina', text: 'Era lo que yo quería. Que no es lo mismo, y tú lo sabías. —Se le quiebra algo; lo arregla enseguida—. No me mires. Estoy comprobando el freno.' }] },
				{ text: 'No decir nada', then: [{ text: 'Adela abre la nevera. La cierra. La vuelve a abrir. Es la persona más contenta que has visto nunca delante de una nevera vacía.' }] },
			] },
			{ say: 'sobrina', text: 'Lo que prepare aquí y me sobre, es del rancho: reconstituyentes, las vitaminas del ganado, lo que haya. Y si un día lo lleva otra persona y yo puedo estar aquí dentro más horas, saldrá más. Ahí lo dejo.' },
			{ say: 'sobrina', text: 'Mi tío volvía de Caoba con caramelos del médico para las Mareep. No se los podía dar. Se los daba igual. —Abre un cajón; ya hay una bolsa—. Yo los voy a recetar. Con medida. De vez en cuando caerá alguno.' },
		],
		p7_r_up_deudas: [
			{ text: 'Adela vacía la lata de las galletas encima de la mesa: escrituras, un jarabe para la tos casi entero, cartas atadas con cordel. Y, al fondo, un fajo de recibos con una goma.' },
			{ say: 'sobrina', text: 'El pienso de dos inviernos. Eso lo sabía. Y esto. —Un papel doblado en ocho—. Un préstamo de la cooperativa de Iris. De hace seis años. ¿Sabes para qué?' },
			{ text: 'Lo desdobla. En el concepto, con la letra de Don Aurelio: «Estudios de la niña. Que no se entere».' },
			{ say: 'sobrina', text: '…La niña tenía veintiocho años. —Se sienta—. Me pagó el último curso de veterinaria. A mí me dijo que era una beca. Una beca «del gobierno». Y luego iba por las ferias diciendo que yo trabajaba en una oficina.' },
			{ text: 'No dice nada durante un rato. Dobla el papel por los mismos dobleces, con mucho cuidado, y lo mete en el bolsillo de la camisa. No en la lata.' },
			{ say: 'sobrina', text: 'Págalo. Eso sí te lo acepto sin discutir, porque ya no es suyo ni mío: es del rancho. —Se limpia la cara con el antebrazo—. Y te subo la parte. No protestes. Si él pudo mentirme seis años, yo puedo apuntarte diez puntos.' },
		],
		p7_r_up_socio: [
			{ text: 'Adela abre el cuaderno por la página de «SOCI{O|A|E}S», tacha un número y escribe otro al lado. Sopla la tinta.' },
			{ say: 'sobrina', text: 'Apuntado. —Te lo enseña—. A este paso vas a mandar más que yo. No me importa. Con que no mandes sobre la mecedora, lo demás lo hablamos.' },
		],

		// ---- Alguien que lo merezca ----
		p7_rosaura_llega: [
			{ set: { 'flag.p7_rosaura': true } },
			{ text: 'Una mujer con sombrero de paja y botas de montar está apoyada en la cancela. A su lado, un Tauros enorme mira la esquiladora nueva como quien mira un coche caro.' },
			{ say: 'p7_rosaura', text: 'Buenas tardes. Rosaura. Del rancho de más abajo. Usted y yo ya tuvimos un combate de vecinos, ¿se acuerda? Tiene buen pulso.', cond: 'beat("r42_rosaura")' },
			{ say: 'p7_rosaura', text: 'Buenas tardes. Rosaura. Del rancho de más abajo, el de los Tauros. Usted no me conoce. Yo a usted sí: Aurelio no hablaba de otra cosa.', cond: '!beat("r42_rosaura")' },
			{ say: 'p7_rosaura', text: 'He oído la máquina desde mi casa. Eléctrica. ¿Y quién la maneja? —Mira hacia el establo. Se oye a Adela discutir con una oveja—. Ya. La doctora. La doctora es una eminencia, pero esquila como quien pone una inyección: rápido y pidiendo perdón.' },
			{ text: 'Adela sale del establo con lana hasta en las cejas.' },
			{ say: 'sobrina', text: 'Te he oído, Rosaura.' },
			{ say: 'p7_rosaura', text: 'Hablaba alto para eso, hija.' },
			{ say: 'p7_rosaura', text: 'Vengo a decir una cosa y me voy. Treinta años fui vecina de Aurelio. Treinta años discutiendo por la cerca, por el agua y por cuál de los dos tenía el mejor semental. Él no tenía semental. Discutía igual.' },
			{ say: 'p7_rosaura', text: 'El invierno que se me murió el marido, me esquiló él las mías. Las ciento y pico. Sin decir nada. Se presentó con la manivela y un bocadillo. —Se ajusta el sombrero—. Eso se debe. Y yo pago lo que debo.' },
			{ say: 'p7_rosaura', text: 'Mis hijos ya llevan lo mío. Yo tengo las mañanas libres y las manos buenas. Si quieren, les llevo yo el día a día de este rancho. Cobro poco. Mando mucho. Y a la doctora la quiero aquí, pero donde sirve: en su consulta, no detrás de una oveja con unas tijeras.' },
			{ text: 'Miras a Adela. Adela mira la esquiladora. Luego se mira las manos, llenas de cortes pequeños.' },
			{ say: 'sobrina', text: '…Mi tío decía que eras la persona más terca de la Ruta 42. —Pausa—. Lo decía con envidia. —Se quita la lana de las cejas—. Por mí, sí. Dios, sí. Tengo once avisos sin atender y un Ponyta con una pezuña que me odia.' },
			{ say: 'sobrina', text: 'Pero decide {el|la|le} del cuaderno. —Te señala—. Tú apuntas quién lleva esto. Si es ella, yo soy la veterinaria del rancho y nada más. No es un despido. Es lo mejor que me han ofrecido desde que heredé cincuenta ovejas.', cond: JUG },
			{ say: 'sobrina', text: 'Lo decidimos entre l{o|a|e}s dos, que para eso somos soci{o|a|e}s. —Te mira—. Si la apuntas a ella en el cuaderno, yo soy la veterinaria del rancho y nada más. No es un paso atrás. Es lo mejor que me han ofrecido desde que heredé cincuenta ovejas.', cond: '!(' + JUG + ')' },
			{ say: 'p7_rosaura', text: 'Pues ya lo saben. Yo estoy aquí por las mañanas, me apunten o no: alguien tiene que enseñarle a esa máquina quién manda. —Al Tauros—. Tú no. Tú, a casa.' },
			{ toast: 'Rosaura puede llevar el Rancho Prado. Elígelo en la ficha del negocio.' },
			{ intel: { npc: 'p7_rosaura', text: 'Ranchera de la Ruta 42, vecina de Don Aurelio durante treinta años. Él le esquiló el rebaño el invierno que enviudó. Se ofrece a llevar el día a día del rancho Prado: «yo pago lo que debo».' } },
		],
		p7_mayor_llega: [
			{ text: 'Fuera de la cerca, a diez pasos de la cancela, hay una mujer alta con el pelo rojo recogido, una chaqueta de punto y una maleta de cartón atada con cuerda. No lleva gorra. La reconoces igual.' },
			{ text: 'Es la Mayor. La que repartía bocadillos debajo de la tienda de recuerdos de Caoba.' },
			{ say: 'p7_mayor', text: 'No entro si no me dicen que entre. —Deja la maleta en el suelo—. Es una costumbre nueva. La estoy practicando.' },
			{ say: 'p7_mayor', text: 'A los pequeños ya los tengo colocados. Toni, con su madre. La Tercera, donde le pagan por abrir cosas que sí son suyas. Lupe, donde no tiene que hablar con nadie. —Cuenta con los dedos—. Me faltaba una. La una soy yo.' },
			{ say: 'p7_mayor', text: 'No sé hacer muchas cosas que se puedan poner en un papel. Sé que catorce personas coman caliente con dinero para nueve. Sé quién no ha dormido solo con verle andar. Y sé levantarme antes que nadie. Me han dicho que en un rancho eso sirve.' },
			{ text: 'Adela ha salido al porche. Tiene los brazos cruzados y la cara de cuando examina a un animal que cojea.' },
			{ say: 'sobrina', text: '¿De dónde sales tú?' },
			{ say: 'p7_mayor', text: 'De un sótano. Con una R en la gorra. Ya no tengo ni el sótano ni la gorra. —No aparta la mirada—. Se lo digo ahora para que no se entere usted después por otra persona.' },
			{ text: 'Silencio. Una Mareep pequeña se ha acercado a la cerca y mete el morro entre las tablas. La Mayor, sin dejar de mirar a Adela, baja la mano. La Mareep se la huele. Luego apoya la cabeza entera.' },
			{ text: '{riolu} mira a la Mayor un momento largo, con las orejas hacia delante. Luego se sienta. Para {riolu}, es una opinión.', cond: LUC },
			{ prompt: 'Adela te mira a ti.', choice: [
				{ text: '«Yo la conozco. Cuidaba de todos ahí abajo.»', then: [
					{ say: 'p7_mayor', text: 'De todos menos de uno, que no se dejaba. —Casi sonríe—. Gracias. No tenías por qué.' },
				] },
				{ text: '«Que pruebe una semana.»', then: [
					{ say: 'p7_mayor', text: 'Una semana me sobra. A los tres días ya sabré cómo se llama cada una. —Mira el rebaño—. Son cincuenta y tantas. He tenido familias más grandes.' },
				] },
				{ text: 'Abrir la cancela', then: [
					{ text: 'Abres la cancela. La Mayor mira el hueco. Recoge la maleta. Entra despacio, como quien entra en una iglesia.' },
				] },
			] },
			{ set: { 'flag.p7_mayor': true } },
			{ say: 'sobrina', text: 'El cuarto de encima del establo. Tiene estufa. El café es a las cinco y media. —Descruza los brazos—. Y si me llevas tú el día a día, yo vuelvo a mi consulta, que tengo once avisos sin atender. No te lo digo para que te asustes. Te lo digo para que sepas que me haces un favor.' },
			{ say: 'p7_mayor', text: 'No me asusto. —Ya está mirando el tejado, el pozo, el cubo del pienso—. ¿Quién es la que se lo come todo?' },
			{ say: 'sobrina', text: 'Borla.' },
			{ say: 'p7_mayor', text: 'Siempre hay una. —A ti, más bajo—. Tengo nombre. De antes. Lo estoy guardando para cuando me lo gane otra vez. Hasta entonces, llámame como me conoces.' },
			{ text: 'Esa tarde, alguien clava un cartón encima de la puerta del establo. A rotulador, con letras grandes: «CREE». Está torcido. Lo enderezas. Al rato vuelve a estar torcido.' },
			{ toast: 'La Mayor puede llevar el Rancho Prado. Elígela en la ficha del negocio.' },
			{ intel: { npc: 'p7_mayor', text: 'La Mayor de «la familia» de Caoba. Colocó a los demás antes que a ella. Ahora vive en el cuarto de encima del establo del rancho Prado. Guarda su nombre «para cuando se lo gane otra vez».' } },
		],
		p7_rancho_gente: [
			{ if: 'flag.p7_rosaura', then: [
				{ say: 'p7_rosaura', text: 'Buenos días nos dé Dios, que ya son las diez y usted acaba de llegar. —Guiña un ojo—. La lana, bien. La máquina ya me obedece. La doctora ha sonreído dos veces esta semana; lo llevo apuntado.', cond: 'day' },
				{ say: 'p7_rosaura', text: '¿A estas horas? Las ovejas duermen, y yo debería. He venido a mirar una que tose. No es nada. Tose igual que Aurelio cuando quería que le hicieran caso.', cond: 'night' },
			] },
			{ if: 'flag.p7_mayor', then: [
				{ say: 'p7_mayor', text: 'Cincuenta y tres. Me las sé. —Las señala sin mirar—. Esa no come si la miran. Esa come lo de las demás. Y esa de ahí está triste los martes, no sé por qué. Lo estoy averiguando.' },
				{ say: 'p7_mayor', text: 'Toni viene los domingos. Trae arroz. Se sienta en el escalón del porche y no en la mecedora: se lo dije una vez y no ha hecho falta repetirlo.' },
			] },
			{ say: 'sobrina', text: '—Desde la puerta del establo, con una jeringa en la boca—. ¡Que no me entretengan a la gente, que aquí se trabaja! …Hola. Luego te cuento. Hay café.' },
		],

		// ---- Los que se quedaron a vivir en el rancho ----
		p7_rancho_casa: [
			{ if: 'works("ampharos") && night', then: [
				{ text: 'Es de noche y el establo tiene luz. No es una bombilla: es más amarilla, más quieta, y respira.' },
				{ text: 'Dentro, tu Ampharos está de pie en mitad del pasillo, con la cola en alto y la perla encendida. Alrededor, en la paja, duermen las Mareep, amontonadas unas sobre otras como ropa recién lavada. Ninguna tiene la lana erizada. Ninguna tiene miedo.' },
				{ say: 'sobrina', text: '—En voz baja, apoyada en el marco—. Mi tío decía que Faro alumbraba mejor que el de Olivo. Yo no sé cuál de los tuyos es este: de lejos, un Ampharos es un Ampharos. Alumbra igual.' },
				{ say: 'sobrina', text: 'Desde que está, no he vuelto a dejar la luz del porche encendida. No hace falta. Se ve desde la Ruta 42. —Pausa—. El otro día pasó un camionero y me preguntó si habíamos puesto un faro. Le dije que sí.' },
				{ text: 'Tu Ampharos te ve. No se mueve del sitio, para no despertar a nadie. Sube la luz un punto, solo un momento, y la vuelve a bajar. Te ha saludado.' },
			], else: [
				{ if: 'works("ampharos")', then: [
					{ text: 'Tu Ampharos está en el prado, sentado como se sientan los Ampharos: muy derecho, con las manos sobre la barriga. Tiene una Mareep dormida contra cada costado y otra que le mordisquea la cola sin ningún respeto.' },
					{ say: 'sobrina', text: 'De día no hace nada. Se sienta ahí y las demás se le arriman. Mi tío hacía lo mismo y lo llamaba trabajar. —Se encoge de hombros—. Ven de noche. De noche se gana el pienso.' },
				], else: [
					{ text: 'En el porche, la mecedora se mueve. No es el viento.' },
					{ text: 'Hay una bola de lana en el asiento, con el cencerro colgando por un lado. Abre un ojo cuando te oye en los escalones. Te reconoce. Lo cierra otra vez, muy despacio, que es lo que hace alguien que por fin está donde quería estar.' },
					{ say: 'sobrina', text: 'Se sube sola. Yo no le he enseñado. A las seis baja, da una vuelta al rebaño como si pasara lista y se vuelve a subir.', cond: '!(' + COPITO_EN_RANCHO + ')' },
					{ say: 'sobrina', text: 'Se sube sola. Yo no le he enseñado. A las seis baja, da una vuelta al rebaño como si pasara lista y se vuelve a subir. Copito la sigue hasta el escalón y ahí se queda.', cond: COPITO_EN_RANCHO + ' && !(' + JUG + ' && !flag.b03_copito_contigo)' },
					{ say: 'sobrina', text: 'Se sube sola. Yo no le he enseñado. A las seis baja, da una vuelta al rebaño como si pasara lista y se vuelve a subir. Copito le deja medio asiento. No le hace gracia. Se lo deja igual.', cond: JUG + ' && !flag.b03_copito_contigo' },
					{ say: 'sobrina', text: 'Aquí ninguna tiene que ser más grande de lo que es. Si quiere crecer, que crezca. Si no quiere, la mecedora le viene a la medida. —Le rasca detrás de la oreja izquierda—. Mi tío decía que la que no quiere crecer es que espera algo. Yo creo que era esto.' },
				] },
			] },
			{ if: '!flag.p7_rancho_casa', then: [
				{ set: { 'flag.p7_rancho_casa': true } },
				{ say: 'sobrina', text: 'Toma. Estaba en el clavo de la puerta del establo. Era el suyo, el de cuando llegó; le puse uno nuevo. —Te da un cencerro pequeño de latón, gastado por el borde—. Para que te lo lleves tú. Así suena en dos sitios.' },
				{ give: 'soothebell' },
				{ text: 'Lo agitas. Suena claro, muy bajito. En el prado, sin levantar la cabeza, tres Mareep contestan.' },
			] },
			{ text: 'No lo has dejado aquí. Ha vuelto. Se nota la diferencia.' },
		],

		// =================== CASTILLO CADUCO ===================
		p7_castillo_propuesta: [
			{ if: SOCIO_C, then: [{ venture: CAS }, { end: true }] },
			{ if: 'flag.p7_c_propuesta', then: [
				{ say: 'conde', text: 'El sobre sigue ahí. Lo he puesto debajo de un pisapapeles. El pisapapeles es un cráneo. No pregunte de quién; es de adorno. Seguramente.' },
				{ venture: CAS },
				{ end: true },
			] },
			{ set: { 'flag.p7_c_propuesta': true } },
			{ text: 'El Conde está junto a la chimenea con un sobre en la mano. Lo sujeta con dos dedos, lejos de la cara, como si fuera un ajo.' },
			{ say: 'conde', text: 'Ah. Mi visita favorita. Llega en buen momento. O en malo. He recibido correspondencia. De los vivos. De los vivos con ventanilla.' },
			{ give: 'p7_avisohacienda' },
			{ read: 'p7_avisohacienda' },
			{ say: 'conde', text: '«Abierto al público». —Lo repite despacio, con asco y con curiosidad—. En esta casa no entra el público desde un baile de máscaras del que prefiero no hablar. Duró demasiado.' },
			{ say: 'conde', text: 'Pero el castillo se cae. Se llama Caduco y hace honor al apellido. El tejado, los candelabros, el ala norte… Tengo tiempo de sobra. Lo que no tengo, me temo, es eso otro. Lo de los papelitos de colores.' },
			{ choice: [
				{ text: '«¿Dinero?»', then: [{ say: 'conde', text: '¡Chist! No lo diga tan alto, que los retratos se escandalizan. Sí. Eso. Lo tuve. Varias veces. Siempre acaba pasando de moda.' }] },
				{ text: '«La gente pagaría por ver esto.»', then: [{ say: 'conde', text: '¿Por verme a mí? —Se arregla la capa—. Qué idea tan vulgar. Qué idea tan halagadora. Siga.' }] },
			] },
			{ say: 'conde', text: 'Le propongo lo siguiente. Usted pone el capital. Yo pongo el castillo, la niebla, los fantasmas y mi presencia, que no tiene precio y por tanto no pienso cobrarla. De cada cien monedas, treinta para usted. Si me arregla ciertas cosas, más.' },
			{ say: 'conde', text: 'Un Caduco no pide dinero. Un Caduco permite que se le ayude. Es distinto. Es mucho más caro.' },
			{ venture: CAS },
		],
		p7_castillo_entrada: [
			{ text: 'El Conde saca de un cajón un libro enorme, encuadernado en piel oscura, y sopla el polvo. El polvo forma una nube que tarda en decidirse a caer.' },
			{ say: 'conde', text: 'El libro de visitas. La última firma es de… —Entorna los ojos—. Bueno. De alguien con muy buena letra y peluca empolvada. Firme usted debajo. Será {el|la|le} primer{o|a|e} en mucho tiempo.' },
			{ text: 'Firmas. La tinta se seca al instante. En el pasillo, algo cuchichea con mucho entusiasmo.' },
			{ say: 'conde', text: '¿Los oye? Están encantados. Llevan años asustándose entre ellos y ya se saben todos los trucos. —Baja la voz—. No les diga que van a cobrar entrada por verlos. Se pondrían insoportables.' },
			{ say: 'conde', text: 'Una sola condición. Si algún Pokémon suyo, de los de noche, quiere pasar aquí una temporada, será mi invitado. Le daré conversación. Mucha. No pienso callarme.' },
			{ intel: { npc: 'conde', text: 'Le llegó un aviso del Registro de Patrimonio: el Castillo Caduco debe tasas desde hace «varios ejercicios» y paga la mitad si abre al público. Ahora pones tú el capital. «Un Caduco permite que se le ayude».' } },
		],
		p7_c_up_folletos: [
			{ text: 'Llegan diez cajas de folletos. En la portada, el Conde, de pie en la escalinata, envuelto en la capa. Debajo: «CASTILLO CADUCO. El castillo que no envejece. Su dueño, tampoco. Al final del recorrido hay tarta».' },
			{ say: 'conde', text: 'La foto es de hace un tiempo. No diré cuánto. El fotógrafo era un muchacho muy prometedor; tenía un cajón de madera con un trapo negro.' },
			{ say: 'conde', text: 'Lo de la tarta no lo he escrito yo. Tampoco lo he quitado. Me pareció una promesa elegante.' },
			{ text: 'Abajo, en el pueblo, junto al pozo, un hombre con auriculares ya tiene uno en la mano. Ha sacado un bolígrafo rojo.' },
		],
		p7_c_up_bodega: [
			{ text: 'La puerta de la bodega necesita tres llaves y un empujón. Abajo hace frío de verdad. Hay estantes hasta donde llega la vela, y en los estantes, botellas sin etiqueta, tumbadas, con un dedo de polvo.' },
			{ say: 'conde', text: 'Mi reserva. Jarabe de bayas del huerto, receta de la casa. —Descorcha una; el líquido es rojo oscuro, espeso—. No ponga esa cara. Es de bayas. Mire: semillas.' },
			{ text: 'Hay semillas.' },
			{ say: 'conde', text: 'Un sorbo y un Pokémon agotado recuerda todo lo que sabía hacer. Las del fondo son más viejas y hacen más. Yo las tomo para el insomnio. No funciona, pero me entretienen.' },
			{ text: 'En el dintel, por dentro, alguien grabó hace mucho una fecha. Los dos primeros números están raspados con cuidado. Hace poco.', cond: 'flag.b01_simon_1' },
			{ say: 'conde', text: 'Venderemos las jóvenes. Las del fondo no. Las del fondo y yo tenemos historia.' },
		],
		p7_c_up_tasa: [
			{ set: { 'flag.p7_c_tasa': true } },
			{ text: 'El Conde cuenta el dinero, lo mete en un sobre y lo lacra con un sello que tiene un murciélago. Luego se lo piensa, rompe el lacre y lo cierra con saliva, como todo el mundo.' },
			{ say: 'conde', text: 'Lo llevará la cartera del pueblo. El último funcionario que vino en persona se quedó a cenar, y luego dicen cosas.' },
			{ say: 'conde', text: 'Es extraño. Llevo… muchos años sin deberle nada a nadie. Y ahora le debo a usted. —Te mira con los ojos rojos, sin la sonrisa—. Me doy cuenta de que lo prefiero. Deber algo es tener a alguien. Los de mi edad lo olvidamos.' },
			{ say: 'conde', text: 'Diez monedas más de cada cien. No discuta. Discutir con un Caduco puede durar siglos, y usted no dispone de ellos. Seguramente.' },
		],
		p7_hector_llega: [
			{ text: 'Delante de la taquilla hay un hombre con traje gris, maletín y un Hawlucha subido al hombro. Lee el cartel de horarios moviendo los labios. Lleva la máscara verde y roja colgada del cuello, como unas gafas.' },
			{ say: 'hector', text: '¡{jugador}! ¡Qué casualidad! No es casualidad. Vi el folleto en el Centro de Relieve. Bueno, vi el cartel. Bueno, vi a un señor que hablaba del cartel. ¡He pedido vacaciones!', cond: 'flag.b01_hector_1' },
			{ say: 'hector', text: '¡Buenas tardes! Héctor Batista. De día, auxiliar administrativo en una aseguradora de Relieve. De noche y fines de semana… bueno. Eso luego. ¡He pedido vacaciones para venir!', cond: '!flag.b01_hector_1' },
			{ say: 'hector', text: 'Me han dado un día. He venido a asegurar el castillo. Nadie me lo ha pedido. Pero he hecho los cálculos en el tren: escaleras sin barandilla, velas, armaduras con hacha, un propietario de edad indeterminada… ¡Esto es un siniestro con torreones!' },
			{ text: 'El Conde aparece detrás de él sin hacer ruido. Héctor no grita. Hawlucha, sí.' },
			{ say: 'conde', text: '¿Quién es este caballero que cuenta mis escalones?' },
			{ say: 'hector', text: 'Doscientos catorce. Y el ciento doce está suelto. —Traga saliva—. Señor Conde. Soy un gran admirador de… de su inmueble.' },
			{ say: 'conde', text: 'Sabe cuánto vale cada cosa. Lo noto. Es un olor muy concreto. —Lo rodea despacio—. Y lleva un antifaz. Aquí apreciamos a la gente que entiende de disfraces.' },
			{ say: 'hector', text: 'No es un disfraz. Es… —Te mira. Se mira la mano; tiene algo apuntado en la palma—. Ser héroe no es el traje. Lo sé. Pero los sábados, en el patio, para los niños de las visitas… podría hacer una demostración. Con Hawlucha. Sin daños. ¡Tengo la póliza redactada!' },
			{ choice: [
				{ text: '«El castillo necesita a alguien que sepa de números.»', then: [{ say: 'hector', text: '¿Números? ¡Soy buenísimo con los números! Es lo único en lo que soy bueno sin máscara. —Se le ilumina la cara—. ¡Hawlucha, apúntalo!' }] },
				{ text: '«El castillo necesita un héroe en el patio.»', then: [{ say: 'hector', text: '¿De verdad? ¿Con cartel? ¿«Los sábados, a las doce»? —Se le humedecen los ojos—. Lo voy a hacer tan bien que nadie va a necesitar ser rescatado. Bueno. Alguien. Uno. Por la demostración.' }] },
			] },
			{ set: { 'flag.p7_hector': true } },
			{ say: 'hector', text: 'Pido una excedencia. Me la dan seguro: mi jefe lleva tres años intentando que me tome una. De lunes a viernes, taquilla y cuentas. Los sábados… —se pone la máscara— ¡TRANSFORMACIÓN!' },
			{ say: 'conde', text: 'Encantador. Ruidoso, pero encantador. Póngale una habitación en el ala sur. La que no tiene inquilino. Casi nunca.' },
			{ toast: 'Héctor puede llevar el Castillo Caduco. Elígelo en la ficha del negocio.' },
			{ intel: { npc: 'hector', text: 'Ha pedido una excedencia en la aseguradora para llevar la taquilla del Castillo Caduco. Los sábados hace una demostración de héroe en el patio, con póliza propia.' } },
		],
		p7_simon_llega: [
			{ text: 'Simón está sentado en el brocal del pozo con un folleto del castillo lleno de anotaciones en rojo. Ha subrayado «que no envejece». Ha subrayado «tampoco». Ha rodeado «tarta» tres veces.' },
			{ say: 'simon', text: 'Tú. Tú estás detrás de esto. No me lo niegues: tengo fuentes. La cartera. —Agita el folleto—. «El castillo que no envejece». ¡Publicidad de un fenómeno inexistente! Me mandaron aquí a desmentirlo y ahora lo reparten en los Centros Pokémon.' },
			{ say: 'simon', text: 'Dije que me volvía a Teselia. No me he vuelto. Cada vez que hago la maleta, el Conde me invita a cenar, digo que no, y perder el tren después de decir que no me parece una derrota.' },
			{ choice: [
				{ text: '«Pues desmiéntelo desde dentro.»', then: [
					{ say: 'simon', text: '¿Desde dentro? —Se queda con el bolígrafo en el aire—. ¿Una visita guiada… escéptica? ¿Yo delante, explicando que el frío del pasillo es una corriente, que el cuchicheo son cañerías y que el retrato no te mira, que es la perspectiva?' },
				] },
				{ text: '«¿Tienes miedo de entrar?»', then: [
					{ say: 'simon', text: 'Yo no tengo miedo. Yo tengo método. El método dice que no se entra en casa de un sujeto de estudio que te ofrece una copa de algo rojo. —Pausa—. Aunque con un grupo de turistas delante. Con testigos. Y cobrando…' },
				] },
			] },
			{ say: 'simon', text: 'Nota para el episodio: «El escéptico se infiltra». No. «El escéptico cobra por decir la verdad». Mejor. —Se guarda el folleto—. Acepto. Con dos condiciones. No ceno. Y si en seis meses no encuentro una explicación racional para ese hombre, lo diré en antena.' },
			{ text: 'Desde lo alto de la loma, en la única ventana encendida del castillo, alguien levanta una copa hacia ustedes.' },
			{ say: 'simon', text: '…No me ha podido oír desde ahí. Es imposible. Es acústicamente imposible. —Lo apunta. Lo tacha. Lo vuelve a apuntar—. Lo dejo como «indeterminado».' },
			{ set: { 'flag.p7_simon': true } },
			{ toast: 'Simón puede llevar el Castillo Caduco. Elígelo en la ficha del negocio.' },
			{ intel: { npc: 'simon', text: 'No se volvió a Teselia. Ahora hace la «visita escéptica» del Castillo Caduco: explica que nada de lo que ves existe. Sigue sin aceptar la cena del Conde.' } },
		],
		p7_castillo_gente: [
			{ if: 'flag.p7_hector', then: [
				{ say: 'hector', text: '¡Caja cuadrada! ¡Al centavo! Bueno, sobraban dos monedas antiguas que no sé de quién son. El Conde dice que suyas, «de cuando valían». Las he apuntado en «indeterminado». Me lo enseñó Simón.', cond: 'flag.p7_simon' },
				{ say: 'hector', text: '¡Caja cuadrada! ¡Al centavo! Y el sábado vinieron cuarenta niños a la demostración. Uno me preguntó si era de verdad. Le dije que el traje no. Lo demás, estoy en ello.', cond: '!flag.p7_simon' },
			] },
			{ if: 'flag.p7_simon', then: [
				{ say: 'simon', text: 'Once visitas esta semana. He explicado racionalmente cuarenta y tres fenómenos. Me quedan dos. El retrato de la gorguera y el propio Conde. —Baja la voz—. Anoche acepté el postre. Solo el postre. No se lo digas a Renata.' },
			] },
		],

		// =================== LA CANTERA VIEJA ===================
		p7_exc_propuesta: [
			{ if: SOCIO_E, then: [{ venture: EXC }, { end: true }] },
			{ if: 'flag.p7_e_propuesta', then: [
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'La cantera sigue ahí. Lleva cuarenta años ahí. No tiene prisa. Yo, un poco.' },
				{ venture: EXC },
				{ end: true },
			] },
			{ set: { 'flag.p7_e_propuesta': true } },
			{ text: 'El Dr. Lazare tiene tres hojas grapadas en la mano. Las lee. Resopla. Las deja en la mesa. Las vuelve a agarrar.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Tú! Mira esto. No, espera, que te lo doy. Léelo y dime si el mundo tiene arreglo.' },
			{ give: 'p7_becadenegada' },
			{ read: 'p7_becadenegada' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Denegada. A Brossard. Mi alumna. La que se cae. —Se quita las gafas, las limpia en la bata, que está más sucia que las gafas—. Se cae, sí. Pero nunca se ha caído encima de nada que no mereciera la pena mirar.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'La cantera está aquí detrás, a cien pasos de mi puerta. Cerrada desde que yo era estudiante. Y ella tiene razón: arriba hay vetas que nadie ha tocado. Piedras de las que hacen evolucionar a un Pokémon con solo acercárselas. Abajo… abajo no lo sé. Me molesta muchísimo no saberlo.' },
			{ text: 'Sobre la mesa, un holomisor viejo se enciende solo. Aparece media cara, muy de cerca, llena de pecas. Luego se aleja demasiado. Luego se cae el holomisor.' },
			{ say: 'petra', as: 'Petra (holomisor)', text: '¿Se oye? ¿Lazare? ¿Estás enseñándole la solicitud a alguien? ¡No se la enseñes a nadie, que tiene una mancha! —Te ve—. ¡{jugador}! ¡Hola! Ya se la has enseñado. Bueno. La mancha es barro. Casi seguro.' },
			{ say: 'petra', as: 'Petra (holomisor)', text: 'Yo ando lejos, midiendo otra cosa, y voy a tardar. Pero la cantera no necesita que yo esté: necesita un toldo, cribas, luces y cascos. Yo mando croquis. Lazare dice que no a todos y luego los sigue.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'No los sigo. Los compruebo.' },
			{ say: 'petra', as: 'Petra (holomisor)', text: 'Es diez mil millones por ciento seguro que ahí abajo hay algo. Lo he medido. Una vez. Desde lejos. —Se oye un golpe—. Estoy bien. Era una silla.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Resumo, que ella no sabe. El laboratorio no tiene un centavo. El comité, tampoco, o eso dice. Si tú pones el dinero para empezar, lo que salga y no sea ciencia, se vende: cuarenta partes de cada cien para ti. Y de lo que sí sea ciencia, te llevas lo que un entrenador puede usar. Yo me quedo los huesos. Me gustan los huesos.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'No es una inversión. Las inversiones dan dinero. Esto da piedras. Algunas, preciosas.' },
			{ venture: EXC },
		],
		p7_exc_entrada: [
			{ text: 'Lazare te lleva por la puerta de atrás del laboratorio, entre cajas de cartón con etiquetas de hace treinta años. Fuera, tras una valla oxidada, la cantera: tres escalones de roca gris, zarzas y un cartel caído que pone «PELIGRO» boca abajo.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Ahí la tienes. Zanja uno, zanja dos y zanja tres. La tres es la que da al hueco. A la tres no se acerca nadie sin escalera. Lo he puesto por escrito, y con mayúsculas, que es como entiende Brossard.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Si tienes algún Pokémon de los que cavan, tráelo. Aquí va a ser feliz. Y si es de los que huelen la piedra, más.' },
			{ text: 'El holomisor de Lazare, en el bolsillo de su bata, vibra tres veces seguidas. Él no lo mira.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Es ella. Ya ha mandado tres croquis. Todavía no hemos clavado una pala. —Se le escapa media sonrisa; la esconde—. Voy a comprobarlos.' },
			{ intel: { npc: 'petra', text: 'Le denegaron la beca para excavar la cantera vieja de Petroglifo. Lazare escribió a lápiz en la solicitud: «era buena». La cantera se abre con tu dinero; Petra la dirige a distancia, con croquis en servilletas.' } },
		],
		p7_e_up_cascos: [
			{ text: 'Llega una caja con catorce cascos amarillos. Lazare los reparte. Deja uno aparte, en un clavo junto a la puerta, con un trozo de cinta adhesiva que pone «BROSSARD». Al lado cuelga otro, con dos agujeros recortados arriba para las orejas.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'El de las orejas es para Pala. Lo he recortado yo. No se lo digas a ella: va a pensar que me importa.' },
		],
		p7_e_up_galeria: [
			{ text: 'Tardan cuatro días en bajar las vigas. Al quinto, la zanja tres tiene una escalera de hierro atornillada a la roca, una barandilla y un foco. Abajo, el hueco se abre en una galería baja, de paredes lisas, que se pierde hacia el mar.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Esto no lo hizo el agua. El agua no hace las esquinas tan redondas. Esto lo hizo algo que pasaba por aquí muchas veces, durante mucho tiempo, rozando. —Pasa la mano por la pared—. Algo grande. Con paciencia.' },
			{ say: 'petra', as: 'Petra (holomisor)', text: '¡¿Han bajado?! ¡¿Sin mí?! ¡Enfoca! ¡Más abajo! ¡Eso! ¡ESO! —La imagen tiembla—. Una madriguera. Es una madriguera fósil. De algo que excavaba y ya no está. ¡Lazare, te lo dije! ¡Te lo dije desde un barco!' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Me lo dijo desde un barco. —Lo admite como quien paga una multa—. En el suelo hay de todo: huesos de lo que comía, piedras que traía de fuera, cosas pulidas de tanto llevarlas encima. Con cuidado, se puede sacar.' },
			{ say: 'petra', as: 'Petra (holomisor)', text: 'La primera regla: no te caigas al agujero. Para eso está la escalera. ¡Hay escalera! Es la excavación más segura en la que he estado. Y no estoy.' },
		],
		p7_e_up_beca: [
			{ text: 'Lazare pasa el dinero a un sobre del laboratorio y escribe encima, con su letra pequeña y recta: «Beca Brossard de Trabajo de Campo. Primera convocatoria. Adjudicada».' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'El comité soy yo. He deliberado. Ha sido unánime.' },
			{ text: 'Llama por el holomisor. Petra tarda en contestar; cuando contesta, se le ve solo la frente.' },
			{ say: 'petra', as: 'Petra (holomisor)', text: '¿Una beca? ¿Con mi nombre? ¿Mía? —Silencio. En Petra, el silencio es muchísimo—. No estoy llorando. Es que aquí hay mucha sal en el aire.' },
			{ say: 'petra', as: 'Petra (holomisor)', text: 'La voy a gastar bien. En vendas no. Bueno. En pocas.' },
		],
		p7_tobias_llega: [
			{ text: 'Junto a la valla de la cantera hay un hombre con chaqueta verde que le habla a un teléfono sujeto a un palo. A sus pies, sentada en una silla plegable que evidentemente es suya, una Persian lo mira todo con los ojos entornados.' },
			{ say: 'tobias', text: '…y por eso, patrocinadores, hoy NO hay mazmorra. Hoy hay algo mejor. ¡Una mazmorra que todavía no existe! ¡La estamos viendo nacer! ¡Miren ese toldo! ¡Qué toldo!' },
			{ say: 'tobias', text: '¡Un momento! ¡{jugador}! ¡{jugador} de la Cueva Brillante! ¡Audiencia, se lo dije: donde hay un agujero interesante, aparece! —Tapa el micrófono—. ¿Esto es tuyo? Dime que es tuyo. Necesito un permiso y el señor de la bata me ha dicho que «el patrimonio no se graba».', cond: 'done.b01_t_tobias || flag.b01_enc_tobias_1 || flag.b03_tobias_1' },
			{ say: 'tobias', text: '¡Un momento! ¡{Un|Una|Une} aventurer{o|a|e}! Tobías Quiroga, encantado; ella es Duquesa, la verdadera estrella. —Tapa el micrófono—. ¿Esto es tuyo? Dime que es tuyo. Necesito un permiso y el señor de la bata me ha dicho que «el patrimonio no se graba».', cond: '!(done.b01_t_tobias || flag.b01_enc_tobias_1 || flag.b03_tobias_1)' },
			{ text: 'Lazare asoma por la puerta de atrás del laboratorio con una criba en la mano.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'He dicho que no. Dos veces. La Persian me ha mirado y he dicho que no una tercera, por si acaso.' },
			{ say: 'tobias', text: 'Doctor, escuche mi propuesta. Usted cava. Yo narro. «¡Y la criba sube… y en la criba hay… UNA PIEDRA!». La gente paga por eso. Yo pagaría por eso. Tengo un patrocinador que paga en pociones y otro que quiere poner su logo en una carretilla.' },
			{ choice: [
				{ text: '«Lazare, la criba la paga quien la ve.»', then: [
					{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '…¿Pagan por ver cribar? —Mira la criba. Mira a Tobías—. Llevo veinte años haciéndolo gratis. Nadie me lo había dicho.' },
				] },
				{ text: '«Que grabe, pero que no toque nada.»', then: [
					{ say: 'tobias', text: '¡No toco nada! ¡Soy un profesional! Duquesa tampoco toca nada. Duquesa no toca: se sienta encima. Es distinto.' },
				] },
			] },
			{ text: 'Duquesa se levanta, cruza la valla sin mirar a nadie, elige el montón de arena más limpio de la cantera y se tumba encima. Lazare abre la boca. Duquesa lo mira. Lazare cierra la boca.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Sí. De acuerdo. Sí. —A ti, en voz baja—. No sé qué acaba de pasar. Normalmente tardo más en decir que sí.' },
			{ set: { 'flag.p7_tobias': true } },
			{ say: 'tobias', text: '¡TEMPORADA NUEVA, PATROCINADORES! «La mazmorra que se excava sola». Bueno, sola no. Con gente. ¡Pero el título es mejor así!' },
			{ toast: 'Tobías puede llevar la cantera. Elígelo en la ficha del negocio.' },
			{ intel: { npc: 'tobias', text: 'Retransmite la excavación de la cantera vieja de Petroglifo: «La mazmorra que se excava sola». Duquesa supervisa desde una silla plegable.' } },
		],
		p7_exc_zanja: [
			{ text: 'La zanja tres, con su escalera de hierro. Abajo, el foco alumbra la galería de paredes lisas. Huele a tierra fría y a mar.' },
			{ text: 'En el primer peldaño, alguien ha pegado una cinta adhesiva: «PRIMERA REGLA». En el segundo, otro: «¿VES? HAY ESCALERA». La letra es de Lazare. No lo reconocerá nunca.' },
			{ say: 'tobias', text: '—Desde arriba, susurrando a la cámara—. …y ahí baja. Sin cuerda. Sin miedo. Con una escalera homologada. ¡Qué tensión, patrocinadores!', cond: 'flag.p7_tobias' },
		],
	},
};
