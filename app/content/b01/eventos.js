// Eventos por fecha (se repiten cada año mientras no se reescriban).
export default {
	events: [
		// ---------- Halloween ----------
		{
			id: 'halloween', name: 'El Gran Atraco de Halloween', from: '10-24', to: '10-31', cond: 'flag.b01_handsome_recluta',
			spots: {
				luminalia: [{ label: 'Cartel naranja: «Gran Atraco de Halloween»', icon: '🎃', talk: [{ script: 'ev_hw_cartel' }] }],
				castillo_caduco: [{ label: 'El Gran Atraco de Halloween', icon: '🎃', new: '!done.ev_halloween', talk: [{ cond: 'done.ev_halloween', script: 'ev_hw_despues' }, { script: 'ev_hw_atraco' }] }],
			},
			encounters: {
				ruta5: { grass: [{ sp: 'pumpkaboo', lv: [10, 13], w: 14, time: 'night' }, { sp: 'phantump', lv: [10, 13], w: 8, time: 'night' }] },
				ruta7: { grass: [{ sp: 'pumpkaboo', lv: [12, 15], w: 14, time: 'night' }, { sp: 'phantump', lv: [12, 15], w: 10, time: 'night' }, { sp: 'gastly', lv: [12, 15], w: 6, time: 'night' }] },
			},
		},
		// ---------- Día de Muertos ----------
		{
			id: 'muertos', name: 'Día de Muertos', from: '10-28', to: '11-03', cond: 'flag.b01_handsome_recluta',
			spots: {
				luminalia: [{ label: 'Ofrenda de la familia Ortega', sub: 'Velas, papel picado y flores naranjas', icon: '🕯️', new: '!quest.ev_muertos', talk: [
					{ cond: 'done.ev_muertos', script: 'ev_muertos_despues' },
					{ cond: 'quest.ev_muertos == "flores" && count("cempasuchil") >= 5', script: 'ev_muertos_entrega' },
					{ cond: 'quest.ev_muertos == "flores"', script: 'ev_muertos_recordar' },
					{ script: 'ev_muertos_inicio' },
				] }],
			},
			tramos: {
				ruta4: { 2: [{ item: 'cempasuchil', hidden: true }], 6: [{ item: 'cempasuchil', hidden: true }] },
				ruta5: { 3: [{ item: 'cempasuchil', hidden: true }], 7: [{ item: 'cempasuchil', hidden: true }] },
				ruta7: { 2: [{ item: 'cempasuchil', hidden: true }], 5: [{ item: 'cempasuchil', hidden: true }] },
				ruta3: { 2: [{ item: 'cempasuchil', hidden: true }] },
			},
			encounters: {
				ruta4: { grass: [{ sp: 'litwick', lv: [7, 9], w: 12, time: 'night' }] },
				ruta5: { grass: [{ sp: 'litwick', lv: [10, 13], w: 12, time: 'night' }] },
			},
		},
		// ---------- Cumpleaños del jugador (7 de junio) ----------
		{
			id: 'cumple', name: 'Cumpleaños', from: '06-07', to: '06-07', cond: 'flag.b01_handsome_recluta',
			spots: {
				luminalia: [{ label: '¿Una fiesta en el Centro Pokémon?', icon: '🎂', new: 'vars.cumple_year != year', talk: [{ script: 'ev_cumple' }] }],
			},
		},
	],
	scripts: {
		// ===== Halloween =====
		ev_hw_cartel: [
			{ text: 'Un cartel naranja con letras góticas: «**EL GRAN ATRACO DE HALLOWEEN**. Castillo Caduco, Pueblo Vánitas. El Conde Vladimiro invita a todos los valientes. Premio: la Calabaza de Oro. Disfraz opcional. Valor obligatorio».' },
			{ text: 'Abajo, a mano: «No se admiten devoluciones de alma».' },
		],
		ev_hw_atraco: [
			{ if: '!visited("castillo_caduco")', then: [{ text: 'Todavía no conoces este castillo… (Esta escena necesita que hayas visitado Pueblo Vánitas).' }, { end: true }] },
			{ say: 'conde', text: '¡Bienvenid{o|a|e}, bienvenid{o|a|e}! Entre libremente y deje un poco de la felicidad que trae. ¡Es la noche del **Gran Atraco**!' },
			{ say: 'conde', text: 'Las reglas son sencillas: cada año, la **Calabaza de Oro** desaparece de mi salón. Quien descubra al ladrón antes de medianoche, se la queda. Hasta el año que viene. Cuando alguien la vuelva a robar. Es tradición.' },
			{ say: 'conde', text: 'Este año tengo tres invitados. Uno de ellos la tiene. Interróguelos.' },
			{ quest: 'ev_halloween', stage: 'inicio' },
			{ say: 'gadd', text: '¡Hola, hola! Ernesto Gadd, inventor. Vine a probar mi **Aspiradora Espectral** con los Gastly del castillo. ¡Esta noche he aspirado once! Bueno, diez y un sombrero. ¿La calabaza? Ni la he visto. Estuve TODO el rato en el sótano, con la aspiradora. Pregunta a los Gastly.' },
			{ say: 'tobias', text: '¡Episodio especial de Halloween! ¡Patrocinadores, gracias por los disfraces! Yo soy inocente: llevo toda la noche grabando en el jardín con Duquesa. —Duquesa, el Persian, bufa—. Ella lo confirma. Mira qué cara de confirmar.' },
			{ say: 'conde', text: 'Y yo, naturalmente, también soy sospechoso. Es mi castillo. Es mi calabaza. Y adoro robármela. —Sonríe con unos colmillos que seguramente son postizos—. Seguramente.' },
			{ text: 'Revisas el salón. En la vitrina vacía hay polvo de calabaza y unos pelos cortos de color crema. En la alfombra, unas huellas de patas que se alejan hacia el jardín. En el sótano, la aspiradora del Prof. Gadd está apagada… y fría.' },
			{ prompt: '¿Quién tiene la Calabaza de Oro?', choice: [
				{ text: 'El Prof. Gadd.', then: [
					{ text: '«Dijo que estuvo toda la noche en el sótano con la aspiradora», dices. «Pero la aspiradora está fría. Lleva horas apagada.»' },
					{ say: 'gadd', text: '…Vale, vale. Me pillaste en la mentira… pero no por la calabaza. Estuve en la cocina. Comiendo tarta. Once trozos. Diez y un sombrero.' },
					{ text: 'Gadd mintió, pero no es el ladrón. Hay que seguir pensando.' },
					{ call: 'ev_hw_segunda' },
				] },
				{ text: 'Tobías (y Duquesa).', then: [{ call: 'ev_hw_solucion' }] },
				{ text: 'El Conde.', then: [
					{ say: 'conde', text: 'Oh, qué halagador. Pero yo no suelto pelo color crema. Ni tengo patas. Aún. —Te guiña un ojo rojo.' },
					{ call: 'ev_hw_segunda' },
				] },
			] },
		],
		ev_hw_segunda: [
			{ prompt: 'Piensa en los pelos color crema y en las huellas de patas…', choice: [
				{ text: 'Tobías (y Duquesa).', then: [{ call: 'ev_hw_solucion' }] },
				{ text: 'Rendirme por esta noche.', then: [{ say: 'conde', text: 'La noche es joven. Vuelva cuando quiera… mientras dure Halloween.' }] },
			] },
		],
		ev_hw_solucion: [
			{ text: '«Las huellas de patas van hacia el jardín, donde dice que estuvo grabando. Y los pelos color crema de la vitrina…» Miras a Duquesa. Duquesa te mira. Duquesa aparta la mirada.' },
			{ say: 'tobias', text: '¡¿Duquesa?! ¡¿Fuiste tú?! ¡En pleno directo! ¡Patrocinadores, esto no es lo que parece!' },
			{ text: 'Duquesa empuja con la pata, muy digna, la Calabaza de Oro de detrás de una maceta. No pide perdón. Duquesa nunca pide perdón.' },
			{ say: 'conde', text: '¡Magnífico! ¡Una deducción digna de este castillo! La Calabaza de Oro es suya… hasta el año que viene.' },
			{ give: 'calabazaoro' },
			{ say: 'gadd', text: '¡Y un premio extra de mi parte! Lo encontré en el sótano y no sé qué es. Bueno, sí sé qué es, pero queda más misterioso si no lo digo.' },
			{ pokemon: { sp: 'pumpkaboo', lv: 15, nature: 'impish', ability: 'pickup', happy: 120 } },
			{ give: 'rarecandy' },
			{ quest: 'ev_halloween', done: true },
			{ diary: '¡Hoy resolvimos un misterio de verdad! En el castillo del Conde, la ladrona era Duquesa, la Persian de Tobías. Yo sospechaba del Conde. Me equivoqué del todo. El Conde tiene unos colmillos rarísimos. ¡Bzzt! Feliz Halloween.', cond: 'flag.b01_diario' },
		],
		ev_hw_despues: [
			{ say: 'conde', text: 'La Calabaza de Oro le sienta bien. El año que viene, alguien se la robará a usted. Es la tradición. Duerma con un ojo abierto.' },
		],
		// ===== Día de Muertos =====
		ev_muertos_inicio: [
			{ text: 'En un rincón del Bulevar Sur, alguien ha montado un altar de tres niveles: papel picado de colores, velas, pan, fotos antiguas y un plato de dulces con forma de calavera.' },
			{ say: 'remedios', text: 'Ay, mij{o|a|e}… perdona, que no te he preguntado. ¿Cómo te llamas? {jugador}. Qué bonito nombre. Yo soy Remedios, la abuela de los Ortega. Venimos de Paldea, pero mi familia era de mucho más lejos. Esta es nuestra **ofrenda**.' },
			{ say: 'remedios', text: 'Aquí en Kalos celebran el día de todos los santos. Nosotros celebramos el **Día de Muertos**: ponemos lo que les gustaba a los que se fueron, para que vengan a visitarnos una noche. Y no es triste, ¿eh? Es una fiesta. Es recordar.' },
			{ say: 'remedios', text: 'Pero me faltan **flores de cempasúchil**, las naranjas. Su olor les enseña el camino a casa. En Kalos no se venden… pero desde lo de la Puerta han empezado a brotar en las rutas. ¿Será la grieta? Quién sabe.' },
			{ say: 'remedios', text: 'Si me traes **cinco**, te lo agradecería con el alma. Búscalas con cuidado en las **Rutas 4, 5 y 7**. A veces se esconden entre la hierba.' },
			{ quest: 'ev_muertos', stage: 'flores' },
		],
		ev_muertos_recordar: [
			{ say: 'remedios', text: '¿Ya traes alguna, {jugador}? —Cuenta con los dedos—. Necesito cinco, mij{o|a|e}. Búscalas en las Rutas 4, 5 y 7, entre la hierba. Se esconden, como los nietos cuando toca fregar.' },
		],
		ev_muertos_entrega: [
			{ take: 'cempasuchil', n: 5 },
			{ text: 'La abuela Remedios coloca las flores en la ofrenda, una a una, y hace un caminito de pétalos desde la calle hasta el altar.' },
			{ say: 'remedios', text: 'Así. Para que no se pierdan.' },
			{ say: 'remedios', text: 'Mira, te voy a confiar algo. Hace unos días, por la noche, salió un pequeño de la grieta de la Puerta. Un **Fuecoco**, de Paldea. Estaba temblando de frío, el pobrecito. Lo he cuidado yo.' },
			{ say: 'remedios', text: 'Pero yo ya estoy vieja para viajes, y él tiene ganas de mundo. Se le nota. ¿Te lo llevas? Dice mi nieta que cuando sea grande va a ser igualito a las calaveras de mi ofrenda. Imagínate.' },
			{ pokemon: { sp: 'fuecoco', lv: 10, nature: 'modest', ability: 'blaze', happy: 150 } },
			{ say: 'remedios', text: 'Cuídalo mucho. Y cuando te acuerdes de alguien que ya no está, no estés triste mucho rato. Acuérdate de lo que le gustaba, y ponlo en algún sitio. Así se queda.' },
			{ quest: 'ev_muertos', done: true },
			{ diary: 'Hoy conocimos a la abuela Remedios y su ofrenda de flores naranjas. Dice que los que se van vuelven una noche si les dejas un camino. Yo no sé si los Rotom tenemos alguien que nos visite. Pero me gustó la idea. ¡Bzzt! Y ahora tenemos un Fuecoco.', cond: 'flag.b01_diario' },
		],
		ev_muertos_despues: [
			{ say: 'remedios', text: '¿Cómo está mi Fuecoco? ¿Come bien? ¿Se abriga? Ay, no me hagas caso. Las abuelas somos así.' },
		],
		// ===== Cumpleaños =====
		ev_cumple: [
			{ if: 'vars.cumple_year == year', then: [{ say: 'joy', text: '¡Que sigas teniendo un cumpleaños precioso, {jugador}!' }, { end: true }] },
			{ say: 'joy', text: '¡Sorpresa! Rotom nos avisó de que hoy es tu cumpleaños. ¡Feliz cumpleaños, {jugador}!' },
			{ say: 'rotom', text: '¡Bzzt! ¡Feliz cumpleaños! Lo tenía apuntado desde que te inscribiste en el Circuito. Lo miré cuarenta veces esta mañana. ¡Pero me acordé yo solito!' },
			{ text: 'Todo el Centro Pokémon canta. Tus Pokémon salen de sus Poké Balls y se suman al jaleo. Alguien ha hecho un pastel con forma de Poké Ball. Está un poco torcido. Es perfecto.' },
			{ give: 'rarecandy', n: 3 }, { give: 'lavacookie' },
			{ heal: true, silent: true },
			{ set: { 'vars.cumple_year': '=year' } },
			{ diary: '¡Hoy fue el cumpleaños de mi entrenador{|a|e}! Hubo pastel, canciones y Caramelos Raros. Yo no tengo cumpleaños, pero si tuviera, querría que fuera así.', cond: 'flag.b01_diario' },
		],
	},
};
