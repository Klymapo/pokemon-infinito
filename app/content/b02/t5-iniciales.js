// Parte nueva (Publicación 6) · «Los tres de Primavera» (I): iniciales de Johto.
// Ramiro Alcalde, becario del Profesor Elm, perdió tres iniciales la noche del temblor (la misma noche de la Puerta).
// B2: presentación, Chikorita (Azalea) y Cyndaquil (Torre Quemada, con puzle). B3 (b03/t5-iniciales.js): Totodile (Olivo) y el cierre.
// Las tres partes se pueden hacer en cualquier orden; la primera que se toque presenta a Ramiro y a Elm.

// ---------- Condiciones reutilizadas ----------
const LUC = '(inParty("riolu") || inParty("lucario"))';
const FUEGO = '(inParty("delphox") || inParty("braixen") || inParty("fennekin") || inParty("pyroar") || inParty("litleo") || inParty("fletchinder") || inParty("talonflame") || inParty("houndoom") || inParty("houndour") || inParty("growlithe") || inParty("arcanine") || inParty("magmar") || inParty("ponyta") || inParty("rapidash") || inParty("charmeleon") || inParty("charizard") || inParty("fuecoco") || inParty("crocalor") || inParty("cinderace"))';
const TRES = 'flag.b02_ini_chikorita && flag.b02_ini_cyndaquil && flag.b03_ini_totodile';
// Al cerrar una parte: si ya están los tres, la misión pasa a «llamada» (el cierre lo hace Ramiro en b03/t5-iniciales.js).
const SI_TRES = { if: TRES, then: [
	{ say: 'becario_elm', text: '¿Eso… eso es…? Chikorita, Cyndaquil, Totodile. Los tres. ¡LOS TRES! Perdón, perdón, perdón, es que tengo que sentarme. Y llamar al profe. Primero sentarme. Dame un minuto, ahorita lo llamo.' },
	{ quest: 'b02_s_iniciales', stage: 'llamada' },
] };

export default {
	npcs: {
		// Canon: el Profesor Elm (Pueblo Primavera). Solo sale por holomisor. Pelo revuelto castaño, gafas redondas, bata con manchas de café.
		elm: { name: 'Profesor Elm', title: 'Investigador de Pueblo Primavera', look: { hair: 'wild', hairColor: '#7a5434', eyes: '#3f5a3a', eyesStyle: 'happy', brows: 'soft', mouth: 'open', nose: 'l', head: 'round', skin: 1, collar: 'coat', outfit: '#ecebe2', outfit2: '#5a8a5a', acc: 'roundglasses', bg: '#2f4a3a' } },
		// OC: Ramiro Alcalde (24), becario de Elm. Brief: casco de bici siempre puesto · chaleco reflectante amarillo · cara de susto perpetuo.
		becario_elm: { name: 'Ramiro Alcalde', title: 'Becario del Profesor Elm', look: { hair: 'curly', hairColor: '#2a1e16', eyes: '#5a3a26', eyesStyle: 'wide', brows: 'sad', mouth: 'teeth', nose: 'button', head: 'long', build: 'narrow', skin: 3, collar: 'vest', outfit: '#d4dc3a', outfit2: '#3b5bb5', acc: 'helmet' } },
	},

	// =====================================================================
	// MISIÓN
	// =====================================================================
	quests: {
		b02_s_iniciales: { name: 'Los tres de Primavera', type: 'side', est: 90,
			stages: {
				buscar: 'Ayuda a **Ramiro**, el becario del **Profesor Elm**, a encontrar los tres iniciales que se le escaparon la noche del temblor. La lista dice dónde buscar cada uno.',
				llamada: 'Ya están los tres. **Ramiro** quiere llamar al **Profesor Elm** contigo delante. Búscalo en Azalea, Iris o el Puerto de Olivo.',
				hecha: 'Chikorita, Cyndaquil y Totodile viajan contigo. El Profesor Elm dice que los eligieron ellos.',
			},
			parts: { title: 'Los tres iniciales', items: [
				{ label: 'Chikorita', where: 'azalea', done: 'flag.b02_ini_chikorita', got: 'flag.b02_ini_chiko_pista',
					hint: 'Ramiro le perdió el rastro cerca de **Pueblo Azalea**. Habla con él en el pueblo.',
					gotHint: 'Alguien en Azalea cuenta un Slowpoke de más. Mira bien a **los Slowpoke de la plaza**.' },
				{ label: 'Cyndaquil', where: 'torre_quemada', done: 'flag.b02_ini_cyndaquil', got: 'flag.b02_ini_cynda_pista',
					hint: [
						{ cond: 'flag.b02_torre_hecha', text: 'Ramiro pregunta por «una chispa» en **Ciudad Iris**. Habla con él allí.' },
						{ text: 'Ramiro cree que huyó al norte, hacia **Ciudad Iris**. Allí lo buscará cuando pueda.' },
					],
					gotHint: 'Está detrás de unas **vigas caídas** de la Torre Quemada. Hay que abrirse paso.' },
				{ label: 'Totodile', where: 'puerto_olivo', done: 'flag.b03_ini_totodile', got: 'flag.b03_ini_toto_pista',
					hint: [
						{ cond: 'flag.b03_faro_hecho', text: 'Ramiro está en el **Puerto de Olivo**: los marineros se quejan de algo que muerde.' },
						{ cond: 'visited("olivo")', text: 'Ramiro llegará a **Ciudad Olivo** cuando el puerto vuelva a su ritmo de siempre.' },
						{ text: 'Se tiró al agua en la **Ruta 34** y siguió la costa hacia el oeste, hacia el mar abierto. Ramiro lo buscará puerto por puerto.' },
					],
					gotHint: 'Una **barca vieja** del Puerto de Olivo tiene la amarra llena de mordiscos.' },
			] },
		},
	},

	items: {
		b02_ini_posits: { name: 'Pósits de Ramiro', pocket: 'key', desc: 'Un taco de notas adhesivas amarillas, numeradas a mano. Algunas tienen dibujitos. Una tiene una mancha de té.',
			read: '**Pósit 1:** Chikorita. Le gusta el sol. Huele a té de hojas. NO le gusta que la carguen.\n\n**Pósit 2:** Cyndaquil. Tímido. Si se asusta, la espalda se le prende. Si se pone triste, se le apaga. (¿Y si las dos? Preguntar al profe.)\n\n**Pósit 3:** Totodile. Muerde. Muerde TODO. Ya me mordió el casco, la mochila y el pósit 3 (este es el pósit 3 bis).\n\n**Pósit 14:** No llorar delante del profe.\n\n**Pósit 15:** Bueno, un poquito sí.\n\n**Pósit 22:** Azalea: hay veintitrés Slowpoke. Toda la vida hubo veintidós. (Dato del señor del banco.)\n\n**Pósit 23:** Gracias, {jugador}. (Esto lo escribí para dártelo. Perdón por la letra.)' },
	},

	// =====================================================================
	// SPOTS (lugares del mismo bloque)
	// =====================================================================
	extraSpots: {
		azalea: [
			{ label: 'Un chico con una bici llena de pósits', sub: 'Se agacha junto a cada Slowpoke. Uno por uno', icon: '🚲',
				cond: 'flag.b02_pozo_hecho && !flag.b02_ini_chikorita', new: '!flag.b02_ini_chiko_pista',
				talk: [{ cond: '!flag.b02_ini_chiko_pista', script: 'b02_ini_azalea' }, { script: 'b02_ini_azalea_espera' }] },
			{ label: 'Los Slowpoke de la plaza', sub: 'Uno de ellos huele a hojas recién cortadas', icon: '🌿',
				cond: 'flag.b02_ini_chiko_pista && !flag.b02_ini_chikorita', new: 'true',
				talk: [{ script: 'b02_ini_chikorita' }] },
		],
		iris: [
			{ label: 'Un chico con casco de bici', sub: 'Pregunta a los sabios por «una chispa»', icon: '🚲',
				cond: 'flag.b02_torre_hecha && !flag.b02_ini_cyndaquil', new: '!flag.b02_ini_cynda_pista',
				talk: [{ cond: '!flag.b02_ini_cynda_pista', script: 'b02_ini_iris' }, { script: 'b02_ini_iris_espera' }] },
		],
		torre_quemada: [
			{ label: 'Vigas caídas en un rincón', sub: 'Detrás, algo respira. Muy bajito', icon: '🪵',
				cond: 'flag.b02_ini_cynda_pista && !flag.b02_ini_cyndaquil', new: 'true',
				talk: [{ script: 'b02_ini_torre' }] },
		],
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// ---------- Presentación (la llama la primera parte que se toque, aquí o en el B3) ----------
		b02_ini_presentacion: [
			{ set: { 'flag.b02_ini_conocido': true } },
			{ say: 'becario_elm', text: 'Perdón, perdón, perdón. No te quiero quitar el tiempo. Me llamo Ramiro. Ramiro Alcalde. Soy becario del **Profesor Elm**, el de Pueblo Primavera. Bueno, becario… Hago de todo. Sobre todo, perder cosas.' },
			{ text: 'Ramiro saca un taco de pósits amarillos del bolsillo del chaleco. Están numerados. Algunos tienen dibujitos.' },
			{ say: 'becario_elm', text: 'Según el pósit número uno… la noche que llegó la Gira, el profe me mandó a Trigal en bici con tres Poké Balls. Tres iniciales para la bienvenida: un **Chikorita**, un **Cyndaquil** y un **Totodile**. Ya tenían novato asignado y todo.' },
			{ say: 'becario_elm', text: 'Iba por la Ruta 34, de madrugada. Y de repente todo… tembló. Pero no tembló el suelo. Tembló el aire. Mi reloj se puso en blanco. Y las tres Poké Balls se abrieron solas en la canasta de la bici.' },
			{ say: 'becario_elm', text: 'Chikorita se fue hacia el Encinar. Cyndaquil, hacia el norte, como una chispita. Totodile se tiró al agua. Y yo me quedé ahí, con tres Poké Balls vacías y la bici tirada en la cuneta.' },
			{ if: 'flag.b01_diario', then: [
				{ say: 'rotom', text: '¡Bzzt! ¿El aire tembló? ¿De madrugada? Mi reloj también se quedó en blanco esa noche. ¡Qué coincidencia! Las coincidencias me encantan. Bueno, esta no tanto.' },
			] },
			{ say: 'becario_elm', text: 'El profe quiere hablar con cualquiera que me ayude. Dice que «para que no me ponga nervioso». Yo no estoy nervioso. —Se le caen tres pósits—. Perdón. Ahorita lo llamo.' },
			{ text: 'Ramiro marca en un holomisor viejo, con la pantalla rajada. Al tercer intento contesta un hombre con el pelo revuelto, gafas redondas y una bata con una mancha de café en la solapa.' },
			{ say: 'elm', text: '¡Ramiro! ¿Hay noticias? ¿Los tienes? Dime que los tienes. No, no me lo digas, que me da algo. —Te ve—. ¡Ah! Hola. ¿Y tú quién eres?' },
			{ choice: [
				{ text: '«{jugador}. Vengo con la Gira Interregional.»', then: [
					{ say: 'elm', text: '¡De la Gira! ¡Maravilloso! Novat{o|a|e} de verdad, de los que viajan. Mi mujer quería apuntarse, ¿sabes? Le dije que somos demasiado mayores. Me ha retirado la palabra dos días.' },
				] },
				{ text: '«Alguien que pasaba por aquí y le vio cara de apuro.»', then: [
					{ say: 'elm', text: '¡Ja! Esa cara la pone desde que lo conozco. Es su cara de trabajo. Ramiro es el mejor becario que he tenido, pero no se lo digas, que se pone rojo.' },
					{ say: 'becario_elm', text: 'Profe, estoy aquí. Lo oigo.' },
				] },
			] },
			{ say: 'elm', text: 'Mira, te cuento lo que yo sé, que no es mucho. Esa misma noche, en el laboratorio, las incubadoras dieron un salto. Todos los huevos se giraron a la vez hacia el mismo lado. Hacia el suroeste. Hacia el Encinar.' },
			{ say: 'elm', text: '¡Fascinante! Bueno, aterrador. Fascinante y aterrador. Llevo veinte años estudiando huevos y nunca había visto a uno girarse por voluntad propia. Lo tengo todo grabado. Mi hijo dice que parecen girasoles.' },
			{ say: 'elm', text: 'Los tres iniciales estarán asustados, y un Pokémon asustado no vuelve con el primero que lo llama. Vuelve con quien le da confianza. Ramiro les da… mucho amor. Mucho. Demasiado de golpe.' },
			{ say: 'becario_elm', text: 'Es que me preocupo.' },
			{ say: 'elm', text: '¿Les echarías una mano? Yo no puedo moverme de aquí: tengo cuarenta huevos que ya no saben hacia dónde mirar. Ramiro te irá avisando. Ramiro, apunta su número. ¡En un pósit no, en el holomisor!' },
			{ text: 'La llamada se corta con un pitido. Ramiro ya está escribiendo tu nombre en un pósit. Lo pega en el manillar de la bici, junto a otros diez.' },
			{ quest: 'b02_s_iniciales', stage: 'buscar' },
		],

		// ---------- Chikorita (Pueblo Azalea) ----------
		b02_ini_azalea: [
			{ if: '!flag.b02_ini_conocido', then: [
				{ text: 'Un chico con casco de bici y chaleco amarillo reflectante va de Slowpoke en Slowpoke por la plaza. Se agacha, mira debajo, pide perdón al Slowpoke y pasa al siguiente. Lleva una bici apoyada en la fuente, con el manillar forrado de pósits.' },
				{ text: 'Te ve. Se endereza tan rápido que se le cae el casco hacia la nariz.' },
				{ call: 'b02_ini_presentacion' },
			], else: [
				{ text: 'Ramiro va de Slowpoke en Slowpoke por la plaza, pidiéndoles perdón uno por uno. Cuando te ve, se le ilumina la cara.' },
				{ say: 'becario_elm', text: '¡{jugador}! Perdón, perdón, perdón, que no te había visto. Estoy con Chikorita. Según el pósit número uno, se metió al Encinar esa noche. Y del Encinar a Azalea hay un paso.' },
			] },
			{ say: 'becario_elm', text: 'El rastro de Chikorita acaba aquí, en Azalea. Huele a hojas, a té verde, y aquí todo huele a té verde. He mirado en el Encinar, en el pozo, en el huerto de Bonguris, debajo de cada Slowpoke…' },
			{ text: 'En el banco de la plaza, el anciano que cuenta Slowpoke levanta un dedo sin mirarte.' },
			{ say: 'anciano_pozo', text: 'Veintitrés.' },
			{ say: 'becario_elm', text: '¿Perdón?' },
			{ say: 'anciano_pozo', text: 'Slowpoke. En la plaza. Hoy hay veintitrés. Toda la vida hubo veintidós. —Se encoge de hombros—. Lo digo por si a alguien le sirve. A mí no.' },
			{ text: 'Ramiro y tú se miran. Luego miran la plaza. Veintitrés bultos rosas tumbados al sol, con la boca abierta. Uno de ellos, en la esquina del fondo, no es exactamente rosa.' },
			{ say: 'becario_elm', text: 'No. No puede ser. Llevo tres días pasando por delante. —Se lleva las manos al casco—. ¡Pósit veintidós! ¡Rápido! Ve tú, que a mí ya me conoce y sale corriendo.' },
			{ set: { 'flag.b02_ini_chiko_pista': true } },
		],
		b02_ini_azalea_espera: [
			{ say: 'becario_elm', text: 'El de la esquina. El que no es rosa. Despacio, por favor. Aquí todo va despacio. Yo no sé ir despacio, por eso no lo intento.' },
		],
		b02_ini_chikorita: [
			{ text: 'En la esquina de la plaza, entre dos Slowpoke dormidos, hay un bulto verde claro tumbado igual que ellos: panza al sol, patas estiradas, boca abierta. Tiene una hoja enorme en la cabeza, caída sobre los ojos como un sombrero.' },
			{ text: 'Es un **Chikorita**. Y está convencido de que es un Slowpoke.' },
			{ text: 'Cuando el Slowpoke de la izquierda bosteza, el Chikorita bosteza. Cuando el de la derecha se rasca, el Chikorita se rasca. Lo hace un poco tarde, como quien copia los pasos de un baile que no se sabe.' },
			{ prompt: '¿Cómo te acercas?', choice: [
				{ text: 'A la manera de Azalea: sentarte y esperar.', then: [
					{ text: 'Te sientas en el suelo, a dos pasos. No dices nada. El sol calienta. Un Slowpoke bosteza. Otro. El Chikorita también.' },
					{ text: 'Pasa un rato largo. Tan largo que Ramiro, desde la fuente, se sienta también, y luego se tumba, y luego se le cierran los ojos.' },
					{ text: 'Al final, el Chikorita abre un ojo. Te mira. Se levanta, se sacude, viene hasta ti caminando muy despacio, como ha aprendido aquí, y te apoya la hoja de la cabeza en la rodilla.' },
					{ text: 'Huele a té recién hecho.' },
				] },
				{ text: 'Llamarlo por su nombre: «¡Chikorita!».', then: [
					{ text: 'El Chikorita da un salto en el sitio. Sale corriendo, tropieza con la cola de un Slowpoke, rueda, se levanta y se esconde detrás de… ti. Detrás de tus piernas. Temblando.' },
					{ text: 'El Slowpoke de la cola tarda unos cinco segundos en darse cuenta de que lo han pisado. Gira la cabeza. Te mira. Pone cara de «¿eh?». Se vuelve a dormir.' },
					{ text: 'El Chikorita asoma la cabeza entre tus tobillos. No se va. Te ha elegido como escondite, y un escondite es casi lo mismo que una casa.' },
				] },
				{ cond: LUC, text: 'Que {riolu} se tumbe al sol como un Slowpoke más.', then: [
					{ text: '{riolu} te mira. Mira a los Slowpoke. Te vuelve a mirar, con una dignidad muy herida.' },
					{ text: 'Luego, muy despacio, se tumba en la plaza, con la panza al sol y los brazos estirados. Cierra los ojos. Abre la boca. Un poco. Lo justo.' },
					{ text: 'El Chikorita levanta la hoja de la cabeza. Mira a {riolu}. Se arrastra hacia él como hacen aquí, sin prisa, y se acurruca contra su costado, en la parte que calienta el sol.' },
					{ text: '{riolu} no se mueve en un buen rato. Cuando por fin se levanta, lleva al Chikorita pegado como una mochila, y una cara de «ni una palabra» que no le habías visto nunca.' },
					{ happy: { who: 'riolu', n: 10 } },
				] },
			] },
			{ text: 'Ramiro llega corriendo, con el casco torcido. Cuando el Chikorita lo ve, suelta un aroma dulce, muy fuerte, y se esconde detrás de ti otra vez.' },
			{ say: 'becario_elm', text: 'Ya. Ya, ya, ya. Perdón. Es que te quiero mucho y se me nota. —Se agacha a tu lado, sin acercarse más—. ¿Ves? Así no. Así sí. Contigo sí.' },
			{ text: 'Ramiro marca en el holomisor. El Profesor Elm contesta con la boca llena de algo.' },
			{ say: 'elm', text: '¿Mmf? ¡Ramiro! ¿Y bien? —Traga—. ¡Ah! ¡Ahí está! ¡Mírala qué bien se ve! Tiene buen color. Ha tomado el sol. —Se acerca tanto a la cámara que solo se le ven las gafas—. ¿Y por qué se esconde detrás de {jugador}?' },
			{ say: 'becario_elm', text: 'Porque no se quiere venir conmigo, profe. Lo tengo en el pósit.' },
			{ say: 'elm', text: 'Hmm. Hmm, hmm. Un Pokémon que se asusta y elige a quién arrimarse… Eso no se discute, Ramiro. Eso se anota.' },
			{ say: 'elm', text: '{jugador}, ¿te importaría quedártela? De momento. Mientras aparecen los otros dos. Los papeles los arreglo yo; al novato que la tenía asignada le busco otra de la nidada de primavera. Mi mujer dice que siempre arreglo los papeles tarde. Pero los arreglo.' },
			{ say: 'elm', text: 'Lleva una **Semilla Milagro** en la Poké Ball, de la bienvenida. Que la use, que le sienta bien.' },
			{ pokemon: { sp: 'chikorita', lv: 15, gender: 'F', nature: 'bold', ability: 'overgrow', happy: 160, item: 'miracleseed', moves: ['razorleaf', 'synthesis', 'poisonpowder', 'ancientpower'], ivs: { hp: 31, atk: 20, def: 31, spa: 26, spd: 31, spe: 22 } } },
			{ say: 'becario_elm', text: 'Toma. —Arranca media libreta de pósits y te la da—. Es todo lo que sé de los tres. Lo pasé a limpio. Bueno, a limpio para mí.' },
			{ give: 'b02_ini_posits' },
			{ set: { 'flag.b02_ini_chikorita': true } },
			{ diary: '¡Hoy contamos Slowpoke en Azalea! Veintitrés. Uno era verde y olía a té de hojas: ¡era un Chikorita que se creía Slowpoke! Ahora viaja con nosotros. Ramiro, el chico de los papelitos amarillos, llamó a un profesor que contesta con la boca llena. ¡Bzzt! Lo apunto: en Johto los profesores comen a todas horas.', cond: 'flag.b01_diario' },
			{ if: '!flag.b02_ini_cyndaquil', then: [
				{ say: 'becario_elm', text: 'Uno menos. Quedan dos. Según el pósit número dos, Cyndaquil se fue hacia el norte, hacia **Ciudad Iris**. Iré para allá en cuanto la bici deje de hacer ese ruido. ¿Oyes el ruido? Yo sí. Siempre.' },
			] },
			SI_TRES,
		],

		// ---------- Cyndaquil (Ciudad Iris y Torre Quemada) ----------
		b02_ini_iris: [
			{ if: '!flag.b02_ini_conocido', then: [
				{ text: 'Un chico con casco de bici persigue a un sabio por la calle de piedra, con un taco de pósits en la mano. El sabio camina más deprisa. El chico, también.' },
				{ text: 'Al verte, el chico frena en seco, choca contigo y se le cae el casco hacia la nariz.' },
				{ call: 'b02_ini_presentacion' },
			], else: [
				{ text: 'Ramiro persigue a un sabio por la calle de piedra, con un taco de pósits en la mano. Al verte, frena tan en seco que la bici sigue sola un par de metros.' },
				{ say: 'becario_elm', text: '¡{jugador}! Perdón, perdón, perdón. Llegué ayer. O antier. En Iris no sé qué día es, aquí todo parece de hace cien años.' },
			] },
			{ say: 'becario_elm', text: 'Cyndaquil está aquí. Lo sé. Los sabios dicen que de noche ven «una chispa» que va y viene entre las vigas de la **Torre Quemada**. Que se enciende y se apaga. Como si le costara.' },
			{ say: 'sabio', text: 'Una chispa que entra en la torre que ardió. —Se acaricia la barba—. Hace ciento cincuenta años, tres salieron corriendo de las llamas. Ahora uno entra corriendo buscándolas. Las cosas vuelven, joven. Siempre vuelven al revés.' },
			{ say: 'becario_elm', text: 'Pósit número dos: si un Cyndaquil se asusta, la espalda se le prende. Si se pone triste, se le apaga. —Traga saliva—. Lleva días ahí dentro. Y la ceniza de esa torre está fría desde hace siglo y medio.' },
			{ say: 'becario_elm', text: 'Yo intenté entrar. Hay un rincón con vigas caídas, y detrás se oye algo. Pero empujé una viga y se me cayó otra encima. Bueno, al lado. Bueno, cerca. ¿Me acompañas? Bueno, ¿vas tú y yo te espero aquí? Es que me tiemblan las piernas. Perdón.' },
			{ set: { 'flag.b02_ini_cynda_pista': true } },
		],
		b02_ini_iris_espera: [
			{ say: 'becario_elm', text: 'Las vigas caídas están en un rincón de la **Torre Quemada**. Si empujas la que no es, se cae la otra. Lo sé por experiencia. Tengo el chichón en un pósit.' },
		],
		b02_ini_torre: [
			{ text: 'En un rincón de la torre, varias vigas negras se han desplomado unas sobre otras, cerrando un hueco junto a la pared. La ceniza del suelo tiene huellas diminutas, de cuatro dedos, que entran y no salen.' },
			{ if: LUC, then: [
				{ text: '{riolu} se detiene. Cierra los ojos, con los apéndices de la cabeza levantados. Luego apoya la palma en una viga y la deja ahí, quieta.' },
				{ text: 'Lo notas tú también, a través de él: un latido pequeño, rápido, detrás de la madera. Y frío. Un latido que tiene frío.' },
				{ happy: { who: 'riolu', n: 5 } },
			], else: [
				{ text: 'Pegas la oreja a una viga. Detrás, algo respira muy deprisa. Muy bajito.' },
			] },
			{ text: 'Hay que mover las vigas sin que se venga abajo todo lo demás. Hay una losa suelta en el suelo: si cargas algo encima, puede que se abra el paso del fondo.' },
			{ puzzle: {
				id: 'b02_ini_vigas', title: 'Las vigas de la torre', theme: 'ruina',
				hint: 'Empuja la viga suelta hasta la losa del suelo. Con peso encima, el paso del fondo se abre.',
				grid: [
					'#######',
					'#P..*.#',
					'#.R...#',
					'#.....#',
					'##S##D#',
					'#*...G#',
					'#######',
				],
			},
			onSolve: [{ call: 'b02_ini_cyndaquil' }],
			onQuit: [
				{ text: 'Te apartas de las vigas, con las manos negras de ceniza. Detrás, el latido sigue ahí. Puedes volver a intentarlo cuando quieras.' },
			] },
		],
		b02_ini_cyndaquil: [
			{ text: 'La losa cede con un crujido y la última viga se desliza hacia un lado. Detrás hay un hueco pequeño contra la pared, donde la ceniza forma un nido redondo.' },
			{ text: 'En el centro, hecho una bola, hay un **Cyndaquil**. Tiene los ojos cerrados y la espalda apagada: donde debería haber llamas solo hay cuatro puntitos grises, como de cerilla gastada. Tiembla.' },
			{ text: 'Vino a la torre que más ardió de Johto buscando fuego. Y aquí ya no queda ni una brasa.' },
			{ prompt: '¿Cómo le das calor?', choice: [
				{ cond: 'has("charcoal")', text: 'Ponerle al lado el Carbón de la carbonería de Azalea.', then: [
					{ text: 'Sacas el Carbón y lo dejas junto a él, en la ceniza. No arde, pero guarda el calor del horno de Azalea, que no se apaga ni de noche.' },
					{ text: 'El Cyndaquil abre un ojo. Se arrima al Carbón. Lo huele. En su espalda, uno de los cuatro puntitos se pone naranja. Luego otro.' },
					{ text: 'Cuando recoges el Carbón, el Cyndaquil lo sigue con la nariz. Y luego te sigue a ti.' },
				] },
				{ cond: FUEGO, text: 'Que tu Pokémon de fuego le preste una llama.', then: [
					{ text: 'Tu Pokémon de fuego se agacha junto al nido y sopla, despacio, una llama muy pequeña, del tamaño de una vela de cumpleaños.' },
					{ text: 'El Cyndaquil la mira como quien ve a alguien de su familia después de mucho tiempo. Acerca la espalda. Los cuatro puntitos se encienden uno detrás de otro: pof, pof, pof, pof.' },
				] },
				{ cond: LUC, text: 'Que {riolu} le ponga las palmas encima.', then: [
					{ text: '{riolu} se arrodilla en la ceniza y pone las dos palmas sobre el lomo del Cyndaquil, sin apretar. Entre sus manos aparece un brillo azul, suave, como el de una estufa vista desde lejos.' },
					{ text: 'No es fuego. Es otra cosa. Pero el Cyndaquil deja de temblar. Al rato, en su espalda, una llamita naranja se asoma entre los dedos de {riolu}, tímida, como preguntando si ya puede salir.' },
					{ happy: { who: 'riolu', n: 5 } },
				] },
				{ text: 'Meterlo dentro de tu chaqueta, contra el pecho.', then: [
					{ text: 'Lo levantas con cuidado. Pesa casi nada y está frío como una piedra de río. Lo metes dentro de la chaqueta, contra el pecho, y cruzas los brazos.' },
					{ text: 'Esperas. Cuentas hasta cien. A los ochenta y tantos, notas un calorcito contra las costillas. Luego, un olor a chamusquina.' },
					{ text: 'Cuando abres la chaqueta, el Cyndaquil te mira con la espalda encendida. Y tu camiseta tiene cuatro agujeritos redondos. Te los vas a quedar de recuerdo.' },
				] },
			] },
			{ text: 'Por la escalera de la torre sube Ramiro, a gatas, con el casco en la mano para que no se le caiga. Al ver la espalda encendida, se tapa la boca con las dos manos.' },
			{ say: 'becario_elm', text: 'Está prendido. Está prendido. Perdón, perdón, perdón, no voy a llorar. —Llora un poco—. Pósit catorce: no llorar delante del profe. El profe no está. Cuenta.' },
			{ text: 'Ramiro marca en el holomisor. Esta vez el Profesor Elm contesta al primer tono, con tres huevos en brazos.' },
			{ say: 'elm', text: '¡Ramiro! —Ve al Cyndaquil—. ¡AH! ¡Ahí está! ¡Y encendido! ¡Mira qué espalda! Espera, que dejo esto… —Se oye un golpe, muy suave, de algo que rueda—. No pasa nada, es de los resistentes.' },
			{ say: 'elm', text: 'Los Cyndaquil, cuando se asustan, encienden la espalda. Cuando se rinden, la apagan. Este estaba a punto de rendirse, {jugador}. Y tú le has dado una razón para no hacerlo.' },
			{ text: 'El Cyndaquil se ha subido a tu zapato. No piensa bajarse.' },
			{ say: 'elm', text: 'Hmm. Hmm, hmm. Ramiro, ¿tú ves lo que yo veo?' },
			{ say: 'becario_elm', text: 'Que no se va a venir conmigo. Ya lo puse en un pósit desde que subí la escalera.' },
			{ say: 'elm', text: 'Pues ya está. Quédatelo tú, {jugador}. Yo arreglo los papeles. Mi mujer dice que si sigo regalando iniciales me van a quitar el laboratorio. Le he dicho que no se regalan: se presentan. Y este ya se ha presentado.' },
			{ say: 'elm', text: 'En su Poké Ball va un **Carbón** de la bienvenida. Para que no se le vuelva a apagar.' },
			{ pokemon: { sp: 'cyndaquil', lv: 13, gender: 'M', nature: 'timid', ability: 'blaze', happy: 160, item: 'charcoal', moves: ['ember', 'quickattack', 'smokescreen', 'extrasensory'], ivs: { hp: 24, atk: 20, def: 22, spa: 31, spd: 26, spe: 31 } } },
			{ set: { 'flag.b02_ini_cyndaquil': true } },
			{ if: '!flag.b03_ini_totodile', then: [
				{ say: 'becario_elm', text: 'Dos. Queda uno. Totodile. Pósit número tres: muerde. —Se señala el casco, que tiene una media luna de dientes en el borde—. Se fue nadando. Si sigue la costa hacia el oeste, acabará en algún puerto. Yo lo buscaré en todos. Uno por uno. Como los Slowpoke.' },
			] },
			SI_TRES,
		],
	},
};
