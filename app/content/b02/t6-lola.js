// Publicación 6 · «Fiado no» (hilo b02_t_lola), 1.ª aparición: Ciudad Trigal.
// Lola Arriaga vende bollos al vapor en la plaza, de espaldas a la Torre Radio. Encargo pequeño: llevar un pedido
// a la recepción de la Torre (ella no entra nunca). Pistas que al releer encajan: evita la Torre Radio, se sabe un plano
// del edificio de hace más de veinte años (escalera de los fusibles, estudio de las puertas dobles) y su Raticate se
// asusta con los pitidos de la radio. No revela nada de su pasado.
// Flags: lola_conocida (la conoces), lola_entrega (pedido entregado), lola_1 (aparición 1 terminada).
// Las apariciones 2 (Caoba, b03/t8-lola.js) y 3 (Lavanda, b04/t4-lola.js) leen lola_1 y lola_2.

const LUC = '(inParty("riolu") || inParty("lucario"))';

export default {
	npcs: {
		// Lola Arriaga, ~44. Brief: moño apretado con mechón gris · mandil blanco sobre chamarra negra · lunar y brazos de amasar.
		lola: { name: 'Lola Arriaga', title: 'Bollos al vapor (puesto ambulante)', look: { hair: 'bun', hairColor: '#3a2a24', streak: '#b8b0a8', eyes: '#5a3a26', eyesStyle: 'narrow', brows: 'thick', mouth: 'smirk', head: 'square', build: 'broad', skin: 3, outfit: '#2b2b30', outfit2: '#efe8d6', collar: 'apron', acc: 'mole earrings', bg: '#7a5a3a' } },
	},

	quests: {
		b02_t_lola: { name: 'Fiado no', type: 'thread', est: 45, stages: {
			pedido: 'Lleva el pedido de bollos de **Lola** a la recepción de la **Torre Radio** de Trigal. Ella no puede dejar el puesto. Eso dice.',
			cobrar: 'La recepcionista de la **Torre Radio** le manda un recado a **Lola**. Vuelve a su puesto, en la plaza de Trigal.',
			caoba: 'Lola se fue de Trigal con su carrito «adonde haya turistas con frío». Búscala más adelante en **Pueblo Caoba**, cuando tu viaje te lleve hacia el este.',
			lavanda: 'Lola dijo que «por estas fechas» está en **Pueblo Lavanda**, en Kanto. Búscala cuando llegues allí.',
			espera: 'Lola sigue con su carrito en **Pueblo Lavanda**. Dice que algún día te dará la receta de verdad.',
		} },
	},

	items: {
		lola_bollo: { name: 'Bollo al vapor de Lola', pocket: 'medicine', cost: 0, use: 'lola_usar_bollo',
			desc: 'Un bollo blanco y blando, envuelto en papel de estraza, relleno de frijol dulce. Sigue tibio, no se sabe cómo. Al compartirlo fuera de combate, todo tu equipo se recupera por completo.' },
		lola_receta: { name: 'Receta de Lola', pocket: 'key', cost: 0,
			desc: 'Media hoja de cuaderno con manchas de grasa y letra apretada, de quien escribe deprisa y sin borrar.',
			read: '*BOLLOS AL VAPOR (para 12, o para 4 con hambre de verdad)*\n\n*Harina, la que haya. Levadura, poquita. Agua tibia: tibia, no caliente; caliente la mata. Una cucharada de azúcar y otra de manteca.*\n\n*Amasar diez minutos. Si te cansas a los cinco, amasa los otros cinco con coraje. Sale igual.*\n\n*Relleno: frijol dulce, cocido desde la noche anterior. Lo de «desde la noche anterior» no se negocia.*\n\n*Dejar subir hasta que doble. No mirarla. La masa no sube si la miras.*\n\n*Vapor fuerte, quince minutos. No abrir la tapa antes. Nunca. Lo que se abre antes de tiempo se baja y ya no vuelve a subir.*\n\n*Lo secreto no es la receta. Lo secreto es la paciencia, y eso no se escribe.*\n\n— L.' },
	},

	extraSpots: {
		trigal: [
			{ label: 'Un puesto de bollos al vapor', sub: 'En la esquina de la plaza, de espaldas a la Torre Radio', icon: '🥟',
				cond: 'flag.b02_pabellon && !flag.lola_1',
				new: '!flag.lola_conocida || (flag.lola_entrega && !flag.lola_1)',
				talk: [
					{ cond: '!flag.lola_conocida', script: 'lola_trigal_1' },
					{ cond: 'flag.lola_entrega', script: 'lola_trigal_2' },
					{ script: 'lola_trigal_espera' },
				] },
		],
		torre_radio: [
			{ label: 'Entregar el pedido de bollos', sub: 'La bolsa de papel de Lola. Todavía humea', icon: '🥟',
				cond: 'quest.b02_t_lola == "pedido" && !flag.lola_entrega', new: 'true',
				talk: [{ script: 'lola_entrega_radio' }] },
		],
	},

	scripts: {
		// ---------- Primera vez en el puesto ----------
		lola_trigal_1: [
			{ set: { 'flag.lola_conocida': true } },
			{ text: 'Un carrito de madera con ruedas de bicicleta, una vaporera de bambú de tres pisos y un letrero pintado a mano: «**BOLLOS DE LOLA** · Al vapor · Fiado no».' },
			{ text: 'El carrito está en la esquina de la plaza, de cara a la estación y de espaldas a la Torre Radio. Muy de espaldas. Detrás, una mujer de cuarenta y tantos, con el moño apretado y un mechón gris, mandil blanco sobre una chamarra negra y antebrazos de amasar todos los días.' },
			{ text: 'Debajo del carrito, sobre un costal de harina, duerme un Raticate enorme con el hocico canoso.' },
			{ say: 'lola', as: 'La de los bollos', text: '¿Vas a comprar o vas a mirar? Mirar es gratis, pero tapas la vaporera y se me enfría el aire.' },
			{ choice: [
				{ text: '«¿Qué tienes?»', then: [
					{ say: 'lola', as: 'La de los bollos', text: 'Bollos. Al vapor. De frijol dulce, de carne con chile y de crema. Los de crema se acaban a las diez. Son las… —mira el cielo, no el reloj— …ya se acabaron.' },
				] },
				{ text: '«Huele increíble.»', then: [
					{ say: 'lola', as: 'La de los bollos', text: 'Ya lo sé. Llevo veinte años haciéndolos. Al principio olían a quemado. Todo lo que hago al principio huele a quemado. —Se encoge de hombros—. Luego aprendo.' },
				] },
			] },
			{ say: 'lola', text: 'Lola. Lola Arriaga. Pero con Lola basta. Toma: uno de frijol. Invita la casa. Los de la Gira llegan con cara de no haber comido desde Kalos.' },
			{ text: 'El bollo está caliente y blando, y por dentro es dulce y espeso. Sin exagerar: es lo mejor que has comido en Johto.' },
			{ if: LUC, then: [
				{ text: '{riolu} se asoma por encima de tu hombro. Lola le pasa otro bollo sin mirarlo, como quien ya sabía lo que iba a pasar.' },
				{ say: 'lola', text: 'Ese tiene hambre de verdad. Se le ve en las orejas. A los que tienen hambre de verdad se les ve siempre en algo.' },
			] },
			{ text: 'En el banco de al lado, el señor del transistor, el que fue panadero treinta años, sube el volumen. «…y en *Noches de Johto* son las doce en punto». Pip. Pip. Pip. Piiiip.' },
			{ text: 'El Raticate se despierta de golpe. Pega las orejas al cráneo, enseña los dientes a nadie y se mete entero detrás del costal, temblando.' },
			{ say: 'lola', text: '¡Chuy! ¡Bájale!' },
			{ say: 'jubilado_radio', as: 'Chuy, el del transistor', text: '¡Perdón, Lola! Perdón. Se me olvida siempre.' },
			{ text: 'Lola se agacha junto al costal sin soltar el trapo. Le habla al Raticate muy bajito, con una voz que no le habías oído.' },
			{ say: 'lola', text: 'Ya, Tacho. Ya. Es la radio. Nomás es la radio. Aquí nadie te va a pedir nada.' },
			{ say: 'lola', text: '—Se levanta y vuelve a ser la de antes—. Los pitidos. No los aguanta. Es viejito y tiene sus manías. Como todos los viejitos. Como yo.' },
			{ choice: [
				{ text: '«¿Qué le pasó?»', then: [
					{ say: 'lola', text: 'Le pasó la vida. Como a todo el mundo. —Te mira de arriba abajo—. ¿Tú eres de la Gira o de la policía? Porque preguntas como de la policía.' },
				] },
				{ text: 'Agacharte y ofrecerle la mano a Tacho.', then: [
					{ text: 'Tacho saca el hocico de detrás del costal. Te huele los dedos un buen rato. Luego apoya la barbilla en tu mano, pesado, cansado, y cierra los ojos.' },
					{ say: 'lola', text: 'Mira nomás. No se deja tocar por nadie. Por nadie. —Se le ablanda algo en la cara, solo un momento—. Será que hueles a bollo.' },
				] },
			] },
			{ say: 'lola', text: 'Oye. Ya que estás. —Saca de debajo del carrito una bolsa de papel enorme, atada con cordel, que humea por los nudos—. Pedido de la Torre Radio. Treinta bollos, los de la mañana. Y yo no puedo dejar el puesto.' },
			{ choice: [
				{ text: '«Yo los llevo.»', then: [
					{ say: 'lola', text: 'Así me gusta. Gente que no pregunta.' },
				] },
				{ text: '«¿Por qué no vas tú? Está ahí mismo.»', then: [
					{ say: 'lola', text: 'Porque no. —Sin pensarlo ni medio segundo—. Porque el puesto no se cuida solo. Y porque no. Las dos razones son buenas.' },
				] },
			] },
			{ say: 'lola', text: 'Entras y le das la bolsa a la de recepción, la de los audífonos. Si no está, subes por la escalera de servicio, la que está detrás del cuarto de los fusibles, hasta la quinta. El estudio grande es el de las puertas dobles. Y no toques nada rojo.' },
			{ say: 'rotom', text: '¡Bzzt! Apuntado: recepción, fusibles, quinta planta, puertas dobles, nada rojo. —Pausa—. ¿Por qué nada rojo?' },
			{ say: 'lola', text: 'Ese aparato tuyo habla mucho. —Te pone la bolsa en los brazos—. Ándale, que se enfrían. Fríos no valen nada. Fríos son pan con remordimientos.' },
			{ quest: 'b02_t_lola', stage: 'pedido' },
		],
		lola_trigal_espera: [
			{ say: 'lola', text: '¿Todavía con la bolsa? —Señala la Torre Radio con la barbilla, sin girarse a mirarla—. Ahí. La de la antena roja. No tiene pérdida. Yo no voy, pero tú sí. Para eso tienes piernas jóvenes.' },
			{ text: 'Tacho duerme otra vez sobre el costal. Le tiembla una oreja de vez en cuando, como si escuchara algo que tú no oyes.' },
		],

		// ---------- La Torre Radio ----------
		lola_entrega_radio: [
			{ text: 'Dejas la bolsa de papel en el mostrador. La recepcionista se quita un audífono. Solo uno.' },
			{ say: 'joy_johto', as: 'Recepcionista', text: '¡Los bollos de Lola! ¡Por fin! Hoy los manda con usted. Lleva no sé cuántos años trayéndonos el desayuno y nunca, nunca ha cruzado esa puerta. Manda a niños, a turistas… Una vez mandó a un Machoke.' },
			{ text: 'Le cuentas, por si acaso, lo que te dijo Lola: la escalera de detrás del cuarto de los fusibles, la quinta planta, el estudio de las puertas dobles.' },
			{ say: 'joy_johto', as: 'Recepcionista', text: '¿La escalera de los fusibles? —Se ríe—. Esa la tapiaron en la reforma. Y el estudio de las puertas dobles ya no existe; ahora es la sala de café. Eso era antes de lo del asalto, cuando la torre era otra. Uf, hace más de veinte años. Yo ni trabajaba aquí.' },
			{ say: 'joy_johto', as: 'Recepcionista', text: '—Se queda un segundo con la sonrisa quieta—. Lola sabe cosas de esta torre que ni el director. Su madre limpiaba aquí, o algo así. Nunca me lo ha contado. Nunca cuenta nada.' },
			{ choice: [
				{ text: '«¿Por qué no entra nunca?»', then: [
					{ say: 'joy_johto', as: 'Recepcionista', text: 'Ni idea. Una vez la invitamos al programa de cocina, a hacer bollos en directo. Dijo que antes se tiraba al río. Con el carrito.' },
				] },
				{ text: '«Que aproveche.»', then: [
					{ say: 'joy_johto', as: 'Recepcionista', text: '¡Gracias! Aquí arriba se trabaja mucho mejor con algo dulce. El director dice que estos bollos han salvado más programas que los locutores.' },
				] },
			] },
			{ say: 'joy_johto', as: 'Recepcionista', text: 'Dígale que se los pago el viernes, como siempre. Y que gracias. Que siempre se lo digo y siempre hace como que no me oye.' },
			{ set: { 'flag.lola_entrega': true } },
			{ quest: 'b02_t_lola', stage: 'cobrar' },
		],

		// ---------- De vuelta en el puesto ----------
		lola_trigal_2: [
			{ say: 'lola', text: '¿Y? ¿Les gustaron? Claro que les gustaron. —No espera respuesta—. ¿Qué te dijo la de los audífonos?' },
			{ text: 'Le das el recado: el viernes, como siempre, y las gracias. Y le cuentas lo de la escalera tapiada y el estudio de las puertas dobles, que ahora es una sala de café.' },
			{ text: 'Lola deja de limpiar el mostrador. Solo un momento. Luego vuelve a frotar, más fuerte.' },
			{ say: 'lola', text: 'Ah. —Frota—. Pues sí que hace que no voy. Una se queda con los sitios como eran. Como en las fotos. Las fotos no se enteran de que las cosas cambian.' },
			{ say: 'lola', text: 'Lo del viernes, ya lo sé. Lo de las gracias… —resopla— …que se las guarde. A mí las gracias me dan comezón.' },
			{ say: 'lola', text: 'Toma. —Te mete en la mochila tres bollos envueltos en papel de estraza, sin preguntar—. Para el camino. Si a alguno de los tuyos le duele algo, se lo das y santo remedio. No sirven para pelear. Sirven para después.' },
			{ give: 'lola_bollo', n: 3 },
			{ say: 'lola', text: 'Y esto. —Arranca media hoja de un cuaderno lleno de cuentas—. La receta. No es secreta. Lo secreto es la paciencia, y eso no se escribe.' },
			{ give: 'lola_receta' },
			{ say: 'lola', text: 'Mañana me voy. Trigal en invierno no compra bollos: compra calefacción. Me voy pa\'l este, adonde haya turistas con frío. Por el lago, a lo mejor. Ahí siempre hay frío y siempre hay turistas.' },
			{ if: LUC, then: [
				{ text: 'Antes de que te vayas, Lola le pasa a {riolu} el último bollo de frijol. Tacho, desde el costal, mira a {riolu} con un ojo. {riolu} le devuelve la mirada. Ninguno de los dos se mueve. Parece que se entienden.' },
			] },
			{ set: { 'flag.lola_1': true } },
			{ quest: 'b02_t_lola', stage: 'caoba' },
			{ intel: { npc: 'lola', text: 'Vende bollos al vapor en un carrito («Fiado no»), con su Raticate viejo, Tacho, que se asusta con los pitidos de la radio. Nunca entra en la Torre Radio de Trigal, pero se sabe una escalera y un estudio que desaparecieron hace más de veinte años. Se fue hacia el este, «adonde haya turistas con frío».' } },
			{ diary: 'Hoy conocimos a Lola, que vende bollos al vapor en la plaza de Trigal. Regaña a todo el mundo, pero con cariño. ¡Nos regaló bollos! Mi entrenador{|a|e} llevó un pedido a la Torre Radio y la recepcionista se puso contentísima.\n\nLola tiene un Raticate que se llama Tacho. Le dan miedo los pitidos de la radio. Lo entiendo: a mí los pitidos tampoco me gustan nada, y eso que soy medio radio.\n\n¡Mañana probaré a oler un bollo! Los Rotom no comemos, pero oler sí podemos. Creo.', cond: 'flag.b01_diario' },
		],

		// ---------- Usar un bollo desde la mochila ----------
		lola_usar_bollo: [
			{ text: 'Desenvuelves un bollo de Lola. Todavía está tibio. No sabes cómo. Lo partes en pedazos y lo repartes entre tu equipo.' },
			{ heal: true },
			{ text: 'Tu equipo come despacio, con los ojos medio cerrados. Cuando terminan, se les ha pasado todo. Hasta las ganas de seguir caminando. Un poquito.' },
		],
	},
};
