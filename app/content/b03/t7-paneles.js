// Bloque 3 · Parte nueva (Publicación 6): «Las cámaras de los paneles».
// Ruinas Alfa (tras abrir la cámara grande) → tres cámaras laterales con suelos de losas (puzles de rejilla, de fácil a difícil)
// → Fósil Domo, Fósil Hélix y Ámbar Viejo → el Dr. Lazare los revive en el Laboratorio de Fósiles de Petroglifo (Kalos, B1).
// Segunda vía para el fósil de Kalos que el jugador no eligió en el B1 (Tyrunt/Amaura). Petra pasa por el laboratorio
// (solo entre el final de las Ruinas y la llegada a Kanto, donde ya va en barco a Isla Canela).

// ---------- Condiciones reutilizadas (cadenas planas) ----------
const LUC = 'inParty("riolu") || inParty("lucario")';
const FOSIL_ANY = 'has("domefossil") || has("helixfossil") || has("oldamber") || has("jawfossil") || has("sailfossil")';
const TODAS = 'flag.b03_panel_domo && flag.b03_panel_espiral && flag.b03_panel_ala';
// Petra está en Kalos con Lazare después de irse de las Ruinas («a medir otra cosa») y antes del barco a Canela (B4).
const PETRA_AQUI = 'flag.b03_ruinas_hecho && !flag.b04_inicio_hecho';

export default {
	// =====================================================================
	// LUGARES (sub-área nueva de las Ruinas Alfa)
	// =====================================================================
	locations: {
		b03_panel_ladera: {
			name: 'Cámaras de la ladera', parent: 'ruinas_alfa', kind: 'area',
			bg: { type: 'ruins', ground: '#7a8a5a', far: '#6a7a8a', hill: '#8a9a6a' },
			desc: 'En la ladera oeste, lejos de las vallas y de los focos, tres **cámaras pequeñas** asoman entre la hierba como tres bocas cerradas. Cada una tiene un dibujo tallado sobre la entrada: un **caparazón**, una **espiral** y un **ala**.\n\nDentro, el suelo no es de tierra: son **losas** de piedra, sueltas, que se deslizan si las empujas.',
			descNight: 'De noche, la ladera es otra cosa. Los focos de Lemnis quedan abajo, lejos, como un pueblo ajeno. Aquí solo hay estrellas, grillos y, en la boca de las cámaras, formas negras del tamaño de una mano que giran despacio. Letras. Te esperan.',
			descs: [{ cond: TODAS, text: 'Las tres cámaras de la ladera, abiertas. El arqueólogo ha puesto una piedra plana delante de cada una, como un felpudo, y una lata de galletas con brochas al lado.\n\nLos Unown entran y salen de las tres como si fueran su casa. Lo son.' }],
			mapNote: 'Tres cámaras con losas · arqueólogo de la universidad',
			onEnter: [{ script: 'b03_panel_llegada', cond: '!flag.b03_panel_llegada', once: true }],
			spots: [
				{ label: 'El arqueólogo del pico', sub: 'Casco, brocha en la oreja, cara de pocos amigos', icon: '⛏️', talk: [
					{ cond: TODAS, script: 'b03_panel_arqueologo_fin' },
					{ script: 'b03_panel_arqueologo' },
				] },
				{ label: 'Cámara del Domo', sub: 'Un caparazón tallado sobre la entrada', icon: '🐚', cond: '!flag.b03_panel_domo', new: 'true', script: 'b03_panel_domo' },
				{ label: 'Cámara del Domo', sub: 'Abierta', icon: '🐚', cond: 'flag.b03_panel_domo', doneIf: 'true', talk: [{ script: 'b03_panel_domo_despues' }] },
				{ label: 'Cámara de la Espiral', sub: 'Una concha en espiral sobre la entrada', icon: '🌀', cond: 'flag.b03_panel_domo && !flag.b03_panel_espiral', new: 'true', script: 'b03_panel_espiral' },
				{ label: 'Cámara de la Espiral', sub: 'Abierta', icon: '🌀', cond: 'flag.b03_panel_espiral', doneIf: 'true', talk: [{ script: 'b03_panel_espiral_despues' }] },
				{ label: 'Cámara del Ala', sub: 'Un ala enorme tallada sobre la entrada', icon: '🪽', cond: 'flag.b03_panel_espiral && !flag.b03_panel_ala', new: 'true', script: 'b03_panel_ala' },
				{ label: 'Cámara del Ala', sub: 'Abierta', icon: '🪽', cond: 'flag.b03_panel_ala', doneIf: 'true', talk: [{ script: 'b03_panel_ala_despues' }] },
				{ label: 'Las otras dos cámaras', sub: 'Las losas no ceden todavía', icon: '🔒', cond: '!flag.b03_panel_domo', talk: [{ script: 'b03_panel_cerradas' }] },
				{ label: 'Escombros junto a las cámaras', sub: 'Lo que sale de las losas al moverlas', icon: '🪨', action: { gather: 'b03_panel_escombros' } },
			],
			rumors: [
				{ text: 'Las cámaras pequeñas de la ladera no salen en el plano de Lemnis. El arqueólogo dice que es lo mejor que les ha pasado en tres mil años.' },
				{ text: 'Dicen que hay una cuarta cámara, más arriba, sin losas. Solo un hueco en la pared con una forma que nadie sabe rellenar.' },
				{ cond: '!flag.b03_panel_ala', text: 'Los Unown que se fueron de la cámara grande se han mudado a la ladera. Se meten en las grietas de las losas y no salen hasta que alguien las mueve.' },
			],
		},
	},

	// Botón en las Ruinas Alfa (lugar del mismo bloque)
	extraSpots: {
		ruinas_alfa: [
			{ label: 'Las cámaras de la ladera', sub: 'Un arqueólogo con casco te hace señas con el pico', icon: '⛏️', cond: 'flag.b03_ruinas_hecho', new: '!flag.b03_panel_llegada', action: { go: 'b03_panel_ladera' } },
		],
	},

	// =====================================================================
	// PARCHES A LUGARES DE BLOQUES ANTERIORES (Laboratorio de Fósiles, B1)
	// =====================================================================
	patches: {
		lab_fosiles: {
			spots: [
				{ label: 'El Restaurador de Fósiles', sub: 'Lazare le ha quitado la taza de café de encima', icon: '🦴',
					cond: 'flag.b03_panel_lazare || quest.b03_s_paneles == "lab" || ' + FOSIL_ANY,
					new: '!flag.b03_panel_lazare || ' + FOSIL_ANY,
					talk: [
						{ cond: '!flag.b03_panel_lazare', script: 'b03_panel_lazare' },
						{ script: 'b03_panel_maquina' },
					] },
			],
		},
	},

	// =====================================================================
	// MISIONES
	// =====================================================================
	quests: {
		b03_s_paneles: { name: 'Las cámaras de los paneles', type: 'side', est: 50,
			stages: {
				camaras: 'Un arqueólogo de las **Ruinas Alfa** te enseña tres cámaras en la ladera con suelos de losas que se mueven. Ábrelas, de la más fácil a la más difícil.',
				lab: 'Las tres cámaras están abiertas. Lleva los fósiles al **Dr. Lazare**, al Laboratorio de Fósiles de **Pueblo Petroglifo** (Kalos, por la Puerta de Trigal).',
				hecha: 'Tres cámaras, tres fósiles y un Restaurador que no para.',
			},
			parts: { title: 'Las tres cámaras', items: [
				{ label: 'Cámara del Domo', where: 'b03_panel_ladera', done: 'flag.b03_panel_domo',
					hint: 'La primera de la ladera. Una losa sobre la placa abre el paso.' },
				{ label: 'Cámara de la Espiral', where: 'b03_panel_ladera', done: 'flag.b03_panel_espiral',
					hint: [{ cond: '!flag.b03_panel_domo', text: 'Sus losas no ceden hasta que abras la del Domo.' }, { text: 'El suelo está pulido: todo resbala hasta chocar.' }] },
				{ label: 'Cámara del Ala', where: 'b03_panel_ladera', done: 'flag.b03_panel_ala',
					hint: [{ cond: '!flag.b03_panel_espiral', text: 'La última. Se abre después de la de la Espiral.' }, { text: 'Dos placas y dos losas. Mira adónde resbala cada una antes de empujar.' }] },
			] },
		},
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== LA LADERA ===================
		b03_panel_llegada: [
			{ set: { 'flag.b03_panel_llegada': true } },
			{ text: 'Subes por la ladera, lejos de las vallas. El zumbido de la carpa se queda abajo. Aquí arriba solo se oyen grillos… y un golpecito. Toc. Toc. Toc.' },
			{ text: 'Un hombre mayor, con casco, chaleco lleno de bolsillos y una brocha detrás de la oreja, da golpecitos con el pico a la entrada de una cámara pequeña. No para cuando llegas.' },
			{ if: 'beat("r32_casimiro")', then: [
				{ say: 'arqueologo', as: 'Arqueólogo', text: '¡Hombre! {El|La|Le} de la Ruta 32. Perdona, de lejos todo el mundo me parece un turista. —Se sube el casco—. Me ganaste. No me ha sentado bien. Pero me desahogué, y eso me ha sentado de maravilla.' },
			], else: [
				{ say: 'arqueologo', as: 'Arqueólogo', text: '¿Otro de la Gira? Si buscas la cámara famosa, es la de abajo, la del foco. Esta no tiene foco. Esta tiene a un señor con un pico. Que soy yo.' },
			] },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Treinta años en estas ruinas. Cuarenta, si cuento los veranos de estudiante. Me echaron la semana pasada «por mi seguridad». Y aquí sigo, en la ladera. La ladera no es de nadie. Lo he comprobado. Dos veces.' },
			{ if: LUC, then: [
				{ text: 'Mira a {riolu}. Mira la cámara grande, allá abajo. Vuelve a mirar a {riolu}. Se le cambia la cara.' },
				{ say: 'arqueologo', as: 'Arqueólogo', text: '…Fuiste tú. Lo de la puerta. Lo dicen en Malva. —Escupe a un lado, con elegancia—. No te lo reprocho. Si no la abres tú, la abren ellos con una excavadora. Mejor una mano que una pala de dos toneladas.' },
			] },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Mira esto. Tres cámaras pequeñas: la del **Domo**, la de la **Espiral** y la del **Ala**. Por el dibujo de la entrada. Dentro, el suelo son losas sueltas. Si las mueves en orden, se abre un nicho al fondo. Si no, te quedas mirando piedras.' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Hace un mes estaban todas quietas, como siempre. Desde que se abrió la grande, las losas se han soltado. Y los Unown se han venido a vivir aquí arriba. Como si hubieran hecho la mudanza.' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Lemnis no las quiere. No salen en su plano. Lo que no sale en un plano, no se lo llevan. —Te pasa una brocha—. Pero yo ya no tengo rodillas para empujar losas. Tú sí. ¿Te animas?' },
			{ choice: [
				{ text: '«Me animo.»', then: [
					{ say: 'arqueologo', as: 'Arqueólogo', text: 'Así me gusta. Empieza por la del Domo: es la más amable. La del Ala es la más antipática. Como yo a tu edad.' },
				] },
				{ text: '«¿Y qué hay en los nichos?»', then: [
					{ say: 'arqueologo', as: 'Arqueólogo', text: 'Lo que dejaban los que tallaron esto. Ofrendas. Piedras que antes estuvieron vivas. —Sonríe por primera vez—. Fósiles, muchach{o|a|e}. Fósiles de verdad, no de folleto.' },
				] },
			] },
			{ quest: 'b03_s_paneles', stage: 'camaras' },
			{ intel: { npc: 'arqueologo', text: 'Arqueólogo de la universidad, expulsado de las Ruinas Alfa por Lemnis. Sigue trabajando en la ladera, en tres cámaras pequeñas (Domo, Espiral y Ala) con suelos de losas sueltas que esconden nichos con fósiles.' } },
		],
		b03_panel_cerradas: [
			{ text: 'Empujas una losa de la cámara de la Espiral. No se mueve. En la del Ala, tampoco. Es como si esperaran turno.' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Por orden. Primero el Domo. Lo pone en la puerta de cada una, en letras Unown: «después de la otra». Los de hace tres mil años eran muy suyos con las colas.' },
		],
		b03_panel_arqueologo: [
			{ text: 'El arqueólogo limpia una piedra con la brocha, muy despacio, con la lengua entre los dientes.' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'La del **Domo** es la más fácil. Empieza por ahí. Una losa encima de la placa y el paso se abre. Como una puerta de cocina.', cond: '!flag.b03_panel_domo' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'La de la **Espiral** tiene el suelo pulido. Lo que empujas resbala hasta que choca con algo. Tú también. Piensa antes de dar el paso. Es buen consejo en general.', cond: 'flag.b03_panel_domo && !flag.b03_panel_espiral' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'La del **Ala**. Dos placas, dos losas, y el suelo pulido a trozos. Yo la intenté en 1998. Salí a gatas y con una losa encima de un pie. Tómatelo con calma. Puedes salir y volver cuando quieras.', cond: 'flag.b03_panel_espiral && !flag.b03_panel_ala' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Si te atoras, sal y vuelve. Las losas vuelven a su sitio. Llevan tres mil años haciéndolo. Tienen práctica.' },
		],
		b03_panel_arqueologo_fin: [
			{ text: 'El arqueólogo está sentado en la piedra plana de la cámara del Ala, comiendo galletas de la lata de las brochas.' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Tres de tres. En treinta años, yo había abierto una. Y fue con ayuda de un Golem que me prestaron y que luego no quería irse.' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Los fósiles, al **Laboratorio de Fósiles** de Petroglifo, en Kalos. El doctor de allí es el único que conozco que los trata como a pacientes y no como a piezas de museo.', cond: '!done.b03_s_paneles' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: '¿Ya los tienes vivos? ¿Los tres? —Se le cae una galleta—. Que no se entere Lemnis. Bueno, que se entere. Que se aguante.', cond: 'done.b03_s_paneles' },
			{ say: 'arqueologo', as: 'Arqueólogo', text: 'Y la cuarta… la de arriba, la sin losas. Esa no te la pido. Esa no se abre empujando.' },
		],

		// =================== CÁMARA DEL DOMO (fácil) ===================
		b03_panel_domo: [
			{ text: 'La cámara del Domo es baja y húmeda. Huele a mar, aunque el mar está lejos. Sobre la entrada, tallado, un caparazón redondo con dos puntitos que parecen ojos.' },
			{ text: 'En la pared, una fila de letras Unown. Debajo, un relieve: gente pequeña, muchísima, escondida bajo unos caparazones enormes mientras una ola les pasa por encima.', cond: '!flag.b03_panel_domo_visto' },
			{ if: '!flag.b03_panel_domo_visto', then: [
				{ set: { 'flag.b03_panel_domo_visto': true } },
				{ if: 'flag.b03_irene_leccion', then: [
					{ text: 'Reconoces la forma de algunas letras. La E. La S. La A. Las lees despacio, como te enseñó Irene: el palo, el ojo, el pie.' },
					{ text: '**E · S · C · A · P · A**.' },
				], else: [
					{ say: 'arqueologo', as: 'Arqueólogo', text: '«Escapa». Veinte años discutiendo en la universidad si era «escapa» o «escápate». Yo digo que es un consejo. Lo tallaron los que vieron venir el agua.' },
				] },
			] },
			{ text: 'El suelo es de losas sueltas. Al fondo, una placa redonda y una reja de piedra que tapa un nicho.' },
			{ puzzle: {
				id: 'b03_panel_domo', title: 'Cámara del Domo', theme: 'ruina',
				hint: 'Una losa sobre la placa abre la reja del nicho. Empújala caminando contra ella.',
				grid: [
					'#######',
					'#P..#G#',
					'#.R.#D#',
					'#.....#',
					'#*.S..#',
					'#######',
				],
			},
			onSolve: [
				{ set: { 'flag.b03_panel_domo': true } },
				{ text: 'La losa encaja en la placa con un clac. Suena un acorde de cuatro notas que sube, como si la piedra estuviera contenta. La reja del nicho baja y se mete en el suelo.' },
				{ text: 'Dentro del nicho, sobre un cuenco de piedra lleno de arena fina, hay un caparazón partido, duro, color avellana. Pesa más de lo que parece.' },
				{ text: 'Al lado, pegado a la pared, un Unown con forma de **E** abre su único ojo. Te mira. Mira el caparazón. Se aparta, despacio, como un portero que deja pasar.' },
				{ text: '{riolu} le hace una pequeña inclinación de cabeza. El Unown gira una vez sobre sí mismo y se va volando hacia la ladera.', cond: LUC },
				{ give: 'domefossil' },
				{ say: 'arqueologo', as: 'Arqueólogo', text: '¡Un **Fósil Domo**! ¡Entero! Bueno, partido, pero entero de partido. —Se sienta en el suelo—. La primera que se abre en treinta años. Y la has abierto como quien abre un cajón. No me lo expliques. No quiero saberlo.' },
				{ call: 'b03_panel_progreso' },
			],
			onQuit: ['Sales a la luz y te sacudes el polvo. Las losas vuelven solas a su sitio con un ruido de dientes. La cámara te espera.'] },
		],
		b03_panel_domo_despues: [
			{ text: 'La cámara del Domo, abierta. El relieve de la ola y los caparazones se ve mejor ahora que entra luz. La gente pequeña no parece asustada. Parece que espera a que pase.' },
		],

		// =================== CÁMARA DE LA ESPIRAL (media) ===================
		b03_panel_espiral: [
			{ text: 'La cámara de la Espiral es más alta que la del Domo. El suelo brilla: está pulido, liso como un espejo viejo. Sobre la entrada, una concha enroscada.' },
			{ if: '!flag.b03_panel_espiral_visto', then: [
				{ set: { 'flag.b03_panel_espiral_visto': true } },
				{ text: 'Las paredes están cubiertas de letras Unown, en espiral, de fuera hacia dentro. Las de fuera son grandes y profundas. Las de dentro, cada vez más pequeñas y más flojas, como si a quien las talló se le estuviera acabando el aceite de la lámpara.' },
				{ text: 'En el centro de la espiral, ennegrecido de hollín, un hueco donde estuvo una lámpara.' },
				{ if: 'flag.b03_irene_leccion', then: [
					{ text: 'No necesitas a nadie para leerlo. Un palo con el pie a la derecha. Dos brazos con el ojo en el fondo. Una diagonal entre dos líneas.' },
					{ text: '**LUZ**. La misma palabra, cien veces, dando vueltas hacia el centro. Lo primero que escribían. Pedían luz para leer lo demás.' },
					{ text: 'Ya sabes leerlo. Ya nadie te lo puede quitar.' },
				], else: [
					{ say: 'arqueologo', as: 'Arqueólogo', text: '«Luz». Cien veces. Alguien escribió aquí, de noche, mientras se le gastaba la lámpara. Cada vez más pequeño. Para que le durara la luz hasta terminar.' },
				] },
			] },
			{ text: 'Al fondo, una placa y una reja de piedra. Y entre tú y la placa, el suelo pulido.' },
			{ puzzle: {
				id: 'b03_panel_espiral', title: 'Cámara de la Espiral', theme: 'ruina',
				hint: 'En el suelo pulido nada se detiene hasta chocar. La losa también resbala.',
				grid: [
					'########',
					'##..I.##',
					'##.#.R.#',
					'#..I...#',
					'#III...#',
					'#D...I.#',
					'#GDP..S#',
					'########',
				],
			},
			onSolve: [
				{ set: { 'flag.b03_panel_espiral': true } },
				{ text: 'La losa se para encima de la placa. Clac. Otra vez el acorde de cuatro notas, subiendo. Las rejas se hunden en el suelo, una detrás de otra.' },
				{ text: 'En el nicho, en el mismo hueco donde estuvo la lámpara, hay una concha de piedra enroscada en espiral. Gris, con vetas blancas. Si la acercas a la oreja, no suena el mar. Suena nada. Una nada muy antigua.' },
				{ text: 'Tres Unown bajan del techo y se colocan delante del nicho: **L**, **U**, **Z**. Se quedan quietos un momento, como una firma al final de una carta. Luego se van.' },
				{ give: 'helixfossil' },
				{ say: 'arqueologo', as: 'Arqueólogo', text: 'Un **Fósil Hélix**. —Lo mira sin tocarlo—. Hay gente en Kanto que les reza a estas cosas. Hay un foro entero. Yo no les rezo. Les tengo respeto, que es parecido pero sin velas.' },
				{ call: 'b03_panel_progreso' },
			],
			onQuit: ['Sales resbalando un poco, con los brazos abiertos. Las losas vuelven a su sitio. La espiral de letras sigue ahí, esperando a que vuelvas con más luz.'] },
		],
		b03_panel_espiral_despues: [
			{ text: 'La cámara de la Espiral. Con la reja abierta, la luz de fuera llega hasta el centro de las letras. Por primera vez en tres mil años, la última «LUZ», la más pequeña, tiene luz.' },
		],

		// =================== CÁMARA DEL ALA (difícil) ===================
		b03_panel_ala: [
			{ text: 'La cámara del Ala es la más grande de las tres, y la más fría. Por una grieta del techo cae un hilo de agua que se junta en dos charcos quietos. Sobre la entrada, un ala enorme, con dedos.' },
			{ if: '!flag.b03_panel_ala_visto', then: [
				{ set: { 'flag.b03_panel_ala_visto': true } },
				{ text: 'En la pared del fondo, un relieve: un Pokémon alado, con la boca llena de dientes, posado en una roca. Delante, una persona pequeña le ofrece algo en las manos juntas, como un cuenco. Agua.' },
				{ text: 'Debajo, en letras Unown: **A · G · U · A**.', cond: 'flag.b03_irene_leccion' },
				{ text: 'Y a un lado del relieve, sola, una palabra más. Tres letras.' },
				{ if: 'flag.b03_ruinas_hecho', then: [
					{ text: 'La reconoces enseguida. La viste formarse en el aire, hecha de Unown, delante de una flor tallada: **D · A · R**.' },
					{ text: 'Aquí no hay otra palabra enfrente. No hay balanza, ni máquina, ni figuras tumbadas. Solo alguien que da agua y alguien que bebe.' },
				] },
				{ text: '{riolu} mira el relieve un buen rato. No tiene los puños cerrados. Tiene las orejas tranquilas, hacia delante.', cond: LUC },
				{ say: 'arqueologo', as: 'Arqueólogo', text: 'En la grande, dicen, había dos palabras. Aquí solo hay una. —Se rasca el casco—. A mí me gusta más esta. Las cámaras pequeñas siempre dicen las cosas más claras.' },
			] },
			{ text: 'El suelo es un tablero de losas, unas sueltas y otras pulidas. Hay dos placas, arriba. Y abajo, el nicho, detrás de tres rejas.' },
			{ puzzle: {
				id: 'b03_panel_ala', title: 'Cámara del Ala', theme: 'ruina',
				hint: 'Dos placas, dos losas. Antes de empujar, mira adónde va a resbalar cada una.',
				grid: [
					'#########',
					'##S..S.I#',
					'###.#P.I#',
					'#D..II..#',
					'#GD.RR~.#',
					'#D#.I.~.#',
					'##..II..#',
					'#.~#I...#',
					'#########',
				],
			},
			onSolve: [
				{ set: { 'flag.b03_panel_ala': true } },
				{ text: 'La segunda losa se para sobre la segunda placa. Clac. Clac. El acorde de cuatro notas, esta vez más largo, rebota por toda la cámara. Las tres rejas se hunden a la vez.' },
				{ text: 'En el nicho, envuelto en un trapo que se deshace al tocarlo, hay un trozo de **ámbar** del tamaño de un puño. Amarillo, frío, con algo oscuro dentro. Muy quieto.' },
				{ if: 'has("ambarsinregistro")', then: [
					{ text: 'Por costumbre, te llevas la mano al bolsillo, donde guardas el ámbar de Petra. Está igual que siempre: tibio, con su latido azul a destiempo. No se acelera. Ni siquiera parece notar al otro.' },
					{ text: 'Este ámbar es solo viejo. El de Petra es otra cosa.' },
				] },
				{ give: 'oldamber' },
				{ say: 'arqueologo', as: 'Arqueólogo', text: 'Un **Ámbar Viejo**. En la del Ala. Claro. Tiene sentido. —Se quita el casco. Se lo vuelve a poner—. Lo que tiene ahí dentro voló sobre esta ladera antes de que hubiera ladera.' },
				{ call: 'b03_panel_progreso' },
			],
			onQuit: ['Sales con las manos llenas de polvo y la cabeza llena de losas. Las losas vuelven a su sitio con un suspiro de piedra. Mañana será otro día. O dentro de un rato.'] },
		],
		b03_panel_ala_despues: [
			{ text: 'La cámara del Ala. El hilo de agua sigue cayendo del techo. Alguien ha dejado en el charco una hoja de árbol doblada como un cuenco. No has sido tú.' },
			{ text: 'La palabra de tres letras sigue ahí, sola, junto al relieve. Nadie la ha contestado.', cond: 'flag.b03_ruinas_hecho' },
		],

		// =================== PROGRESO Y CIERRE EN LA LADERA ===================
		b03_panel_progreso: [
			{ if: TODAS, then: [
				{ text: 'Al salir, el arqueólogo te espera con un cuaderno de tapas de cartón, hinchado de humedad, atado con una goma.' },
				{ say: 'arqueologo', as: 'Arqueólogo', text: 'Las tres. Toma. Mis notas de treinta años de estas cámaras. Las iba a donar a la universidad, pero la universidad ya no tiene permiso para entrar. Tú sí entras en todas partes, por lo visto.' },
				{ give: 'b03_panel_cuaderno' },
				{ say: 'arqueologo', as: 'Arqueólogo', text: 'Y esos fósiles no son para una vitrina. Llévalos al **Laboratorio de Fósiles** de Pueblo Petroglifo, en Kalos. Por la Puerta de Trigal se llega en nada. El doctor de allí… está un poco loco. Del bueno.' },
				{ if: '!done.b03_s_paneles', then: [{ quest: 'b03_s_paneles', stage: 'lab' }] },
				{ diary: 'Hoy mi entrenador{|a|e} y yo resolvimos tres cámaras de piedra en las Ruinas Alfa. ¡Tres! Había que empujar losas encima de unas placas, y el suelo de una resbalaba tanto que casi me caigo (no tengo pies, pero casi).\n\nUn señor con casco nos dio un cuaderno que huele a galletas. Dentro de las cámaras había fósiles, y unos Unown muy educados que se apartaban para dejarnos pasar.\n\n¡Ahora, a Kalos, a que alguien los despierte! Me encantan los puzles. Creo que soy muy bueno en los puzles. Mi entrenador{|a|e} también ayudó.', cond: 'flag.b01_diario' },
			], else: [
				{ say: 'arqueologo', as: 'Arqueólogo', text: 'Una menos. —Apunta algo en su cuaderno—. La siguiente es más difícil. Lo pone en la puerta. Bueno, no lo pone. Pero se nota.' },
			] },
		],

		// =================== LABORATORIO DE FÓSILES (Kalos) ===================
		b03_panel_lazare: [
			{ set: { 'flag.b03_panel_lazare': true } },
			{ text: 'El Laboratorio de Fósiles huele a café recalentado y a piedra mojada. El Dr. Lazare está subido a una escalera, quitando el polvo a una vitrina con un plumero. Al verte, baja tan deprisa que la escalera se queda temblando.' },
			{ say: 'cientifico_fosiles', text: '¡Tú! ¡{El|La|Le} de la Cueva Brillante! ¡Bienvenid{o|a|e}! ¿Qué traes? Traes algo. Tienes cara de traer algo. Es una cara que conozco: la ponía yo a tu edad.' },
			{ text: 'Le enseñas lo que llevas.' },
			{ if: 'has("domefossil") || has("helixfossil") || has("oldamber")', then: [
				{ say: 'cientifico_fosiles', text: '…Oh. Oh, oh, oh. —Se quita las gafas, se las limpia en la bata, que está más sucia que las gafas, y se las vuelve a poner—. ¿De Johto? ¿De las Ruinas Alfa? ¿De las cámaras de los paneles? ¡Desde que era estudiante quiero ver uno de esos nichos!' },
			] },
			{ if: 'has("domefossil")', then: [
				{ say: 'cientifico_fosiles', text: 'Y un **Fósil Domo**. —Se le escapa una risa—. El último Fósil Domo que entró en este laboratorio acabó debajo de una tesis doctoral. Literalmente debajo. Se le cayó encima a la autora. La tesis, no el fósil. Bueno, las dos cosas.' },
			] },

			// ---- Petra (entre el final de las Ruinas y el barco a Kanto) ----
			{ if: PETRA_AQUI, then: [
				{ say: 'petra', as: 'Voz desde la trastienda', text: '¡Fue UNA vez! ¡Y el Fósil Domo salió ileso! ¡Lo dice el informe!' },
				{ text: 'De la trastienda sale Petra, con un cubo en cada mano y Chispas sentado en la cabeza. Detrás, Pala carga una caja de muestras con las orejas, sin esfuerzo, como quien lleva la compra.' },
				{ say: 'petra', text: '¡{jugador}! Me fui de las Ruinas a medir algo que no latiera. Y aquí estoy. Le he traído a Lazare tierra de la franja oscura de las Ruinas. La de ninguna época. Para que su máquina me diga que estoy loca, con datos.' },
				{ say: 'cientifico_fosiles', text: 'Mi máquina no dice que estés loca. Dice «SIN COINCIDENCIAS». Que, viniendo de una máquina, es lo mismo, pero con más educación.' },
				{ if: 'has("oldamber") && has("ambarsinregistro")', then: [
					{ say: 'petra', text: 'Espera. ¿Eso es un **Ámbar Viejo**? ¿Y llevas el mío? —Se le iluminan los ojos—. Lazare. Lazare. Los dos a la vez. Un ámbar normal y el mío. Para comparar. Por favor. Es la primera regla: compara.' },
					{ say: 'cientifico_fosiles', text: 'La primera regla era «no te caigas al agujero».' },
					{ say: 'petra', text: 'Esa es la cero.' },
					{ text: 'Lazare pone los dos ámbares en la bandeja del Restaurador, uno al lado del otro. La máquina zumba. La pantalla parpadea.' },
					{ cutscene: { bg: { type: 'lab' }, start: 'dark', frames: [
						{ actors: [{ id: 'cientifico_fosiles', at: 'left' }, { id: 'petra', at: 'right' }], on: false, fx: 'light', text: 'Primera línea, en verde: «MUESTRA A · ÁMBAR · COINCIDENCIA: AERODACTYL · ANTIGÜEDAD ESTIMADA: MUY ALTA».' },
						{ on: false, fx: 'glow', text: 'Segunda línea, en amarillo: «MUESTRA B · ÁMBAR · SIN COINCIDENCIAS».' },
						{ actors: [{ key: 'cientifico_fosiles', emote: '?' }, { key: 'petra', emote: '!' }], on: false, color: '#d8c84a', fx: ['shake', 'heartbeat'], text: 'Y una tercera línea, que nadie ha pedido: «MUESTRA B · ANTIGÜEDAD ESTIMADA: −3 AÑOS».' },
						{ actors: [{ key: 'cientifico_fosiles', dim: true }, { key: 'petra', dim: true }], cam: 'still', fx: 'dark', text: 'Menos tres. La pantalla se queda así un momento. Luego se apaga sola, como si le diera vergüenza.' },
					] } },
					{ say: 'cientifico_fosiles', text: '…Se ha estropeado. Le pasa cuando hay humedad. —Le da un golpecito a la máquina. No se enciende—. Hay mucha humedad hoy.' },
					{ text: 'Petra no dice nada. Mira el ámbar. Mira la pantalla apagada. Se queda callada mucho rato, que en Petra es muchísimo. Chispas le baja de la cabeza al hombro, como para hacerle compañía.' },
					{ say: 'petra', text: 'Lo apunto. —Lo apunta. Con la letra muy pequeña—. Hora y sitio. Petroglifo. Menos tres.' },
					{ say: 'petra', text: 'Dicen que en Isla Canela, en Kanto, hay un laboratorio con una máquina que lee lo que la de Lazare no lee. —Lazare resopla—. No pongas esa cara. Tú también quieres saberlo.' },
					{ say: 'cientifico_fosiles', text: 'Yo no quiero saber nada. Yo quiero que mi máquina deje de decir números negativos. —Pausa—. Mándame una postal. Con los resultados. Y con un Vulpix, si hay.' },
					{ set: { 'flag.b03_panel_ambar_menos3': true } },
					{ intel: { npc: 'petra', text: 'En el Laboratorio de Fósiles de Petroglifo, con muestras de la franja oscura de las Ruinas Alfa. La máquina de Lazare dio al ámbar una antigüedad de «−3 años» y se apagó. Petra piensa ir a Isla Canela (Kanto) a buscar una máquina mejor.' } },
				], else: [
					{ if: 'has("ambarsinregistro")', then: [
						{ say: 'petra', text: '¿Sigues teniendo mi ámbar? Sí, ¿verdad? Se te nota: tienes la mano en el bolsillo todo el rato, como yo. —Sonríe—. No me lo enseñes. Aquí hay demasiadas cosas que se pueden romper. Y yo.' },
					] },
					{ say: 'petra', text: 'Si la máquina de Lazare no lee la tierra, buscaré otra. Dicen que en **Isla Canela**, en Kanto, hay un laboratorio con una mejor. —Lazare resopla—. Lo he dicho en voz alta. Ahora tengo que ir.' },
					{ intel: { npc: 'petra', text: 'En el Laboratorio de Fósiles de Petroglifo, con muestras de la franja oscura de las Ruinas Alfa. La máquina de Lazare dice «SIN COINCIDENCIAS». Piensa ir a Isla Canela (Kanto) a buscar una máquina mejor.' } },
				] },
				{ say: 'petra', text: 'Bueno. ¡A revivir cosas! Esta es la parte bonita. Yo no toco nada. Pala, sujétame las manos.' },
				{ text: 'Pala le sujeta las manos. Con las orejas. Petra parece aliviada.' },
			] },
			{ if: 'flag.b04_inicio_hecho && flag.b03_ruinas_hecho', then: [
				{ say: 'cientifico_fosiles', text: 'Petra estuvo aquí hace poco, por cierto. Con un Pachirisu en la cabeza y un saco de tierra de Johto. Mi máquina le dijo «SIN COINCIDENCIAS» y se fue a Kanto a buscar una que le dijera otra cosa. —Resopla—. Hará bien. Las máquinas también se equivocan. Las mías, poco.' },
			] },

			// ---- La segunda vía del fósil de Kalos (Tyrunt / Amaura) ----
			{ call: 'b03_panel_kalos', cond: '!flag.b03_panel_kalos' },

			{ say: 'cientifico_fosiles', text: 'Bueno. ¡Al Restaurador! Cien por cien de éxito. Noventa y ocho. Redondeo hacia arriba, ya sabes. Por optimismo.' },
			{ intel: { npc: 'cientifico_fosiles', text: 'Revive en su Restaurador los fósiles de las cámaras de las Ruinas Alfa: Fósil Domo (Kabuto), Fósil Hélix (Omanyte), Ámbar Viejo (Aerodactyl), y también los de Kalos (Fósil Mandíbula y Fósil Aleta). Uno por visita: la máquina tiene que enfriarse.' } },
			{ call: 'b03_panel_maquina' },
		],

		b03_panel_kalos: [
			{ set: { 'flag.b03_panel_kalos': true } },
			// Eligió Tyrunt en el B1: ahora, Amaura
			{ if: 'caught("tyrunt") && !caught("amaura")', then: [
				{ say: 'cientifico_fosiles', text: 'Ah, y antes de que se me olvide, que a mi edad es antes de que termine la frase. —Abre un cajón con una etiqueta escrita a mano: «Para cuando vuelva»—. ¿Te acuerdas de la Cueva Brillante? ¿De los dos fósiles? Elegiste a Tyrunt. Muy bien elegido. Muerde, pero con cariño.' },
				{ say: 'cientifico_fosiles', text: 'La otra, la Amaura, se quedó conmigo. Y conmigo sigue: duerme en la trastienda, encima del radiador. A esa no te la doy. Me he encariñado. Lo avisé.' },
				{ say: 'cientifico_fosiles', text: 'Pero cuando los de rojo se fueron de la cueva, volví a la galería de los geólogos. La tierra se había asentado. Y asomaba otro. Más pequeño. —Saca algo envuelto en un trapo—. Otro **Fósil Aleta**. Lo guardé para ti. Me daba pena que te quedaras con la duda.' },
				{ give: 'sailfossil' },
				{ text: 'Es una piedra plana con la forma de una vela, fría al tacto. Si la miras de lado, con la luz de la ventana, parece que tiene los colores de una aurora muy lejos.' },
			] },
			// Eligió Amaura en el B1: ahora, Tyrunt
			{ if: 'caught("amaura") && !caught("tyrunt")', then: [
				{ say: 'cientifico_fosiles', text: 'Ah, y antes de que se me olvide, que a mi edad es antes de que termine la frase. —Abre un cajón con una etiqueta escrita a mano: «Para cuando vuelva»—. ¿Te acuerdas de la Cueva Brillante? ¿De los dos fósiles? Elegiste a Amaura. Muy bien elegida. Canta cuando nieva.' },
				{ say: 'cientifico_fosiles', text: 'El otro, el Tyrunt, se quedó conmigo. Y conmigo sigue: duerme en la trastienda, mordiendo una pata de la mesa. A ese no te lo doy. Me he encariñado. Y la mesa, también.' },
				{ say: 'cientifico_fosiles', text: 'Pero cuando los de rojo se fueron de la cueva, volví a la galería de los geólogos. La tierra se había asentado. Y asomaba otro. Más pequeño. —Saca algo envuelto en un trapo—. Otro **Fósil Mandíbula**. Lo guardé para ti. Me daba pena que te quedaras con la duda.' },
				{ give: 'jawfossil' },
				{ text: 'Es un trozo de mandíbula con tres dientes como cuchillos de piedra. Tiene marcas de mordiscos. De otros dientes. Mejor no preguntar.' },
			] },
			// No tiene ninguno de los dos (no pasó por la elección del B1 o los dejó): elige uno ahora
			{ if: '!caught("tyrunt") && !caught("amaura")', then: [
				{ say: 'cientifico_fosiles', text: 'Ah, y otra cosa. Volví a la galería de los geólogos de la Cueva Brillante, la que no sale en los mapas. La tierra se había asentado y asomaban dos fósiles pequeños. Uno es para ti. Solo uno: el otro tiene nombre ya. Se lo puse yo.' },
				{ prompt: '¿Qué fósil eliges?', choice: [
					{ text: '**Fósil Mandíbula**: Roca y Dragón. Muerde primero; pregunta después.', then: [{ give: 'jawfossil' }] },
					{ text: '**Fósil Aleta**: Roca y Hielo. Tranquila, antigua; canta cuando nieva.', then: [{ give: 'sailfossil' }] },
				] },
			] },
			// Ya tiene los dos: nada que darle
			{ if: 'caught("tyrunt") && caught("amaura")', then: [
				{ say: 'cientifico_fosiles', text: 'Te iba a dar un fósil de la Cueva Brillante que guardaba en un cajón… pero ya tienes a Tyrunt y a Amaura en la Pokédex. —Cierra el cajón—. Se queda aquí. Para el próximo que entre con cara de traer algo.' },
			] },
		],

		b03_panel_maquina: [
			{ if: '!(' + FOSIL_ANY + ')', then: [
				{ say: 'cientifico_fosiles', text: 'Sin fósil no hay milagro. Bueno, sí hay: el café. Pero ese no es para ti.' },
				{ say: 'cientifico_fosiles', text: 'Si encuentras más, ya sabes dónde estoy. Aquí. Menos los martes. Los martes, en el puerto.' },
			], else: [
				{ text: 'El Restaurador de Fósiles ronronea. Lazare se frota las manos, se pone unas gafas de soldador encima de las gafas normales y te mira por encima de las dos.' },
				{ prompt: '¿Qué fósil le das al Dr. Lazare?', choice: [
					{ text: 'Fósil Domo', cond: 'has("domefossil")', then: [{ take: 'domefossil' }, { call: 'b03_panel_kabuto' }] },
					{ text: 'Fósil Hélix', cond: 'has("helixfossil")', then: [{ take: 'helixfossil' }, { call: 'b03_panel_omanyte' }] },
					{ text: 'Ámbar Viejo', cond: 'has("oldamber")', then: [{ take: 'oldamber' }, { call: 'b03_panel_aerodactyl' }] },
					{ text: 'Fósil Mandíbula', cond: 'has("jawfossil")', then: [{ take: 'jawfossil' }, { call: 'b03_panel_tyrunt' }] },
					{ text: 'Fósil Aleta', cond: 'has("sailfossil")', then: [{ take: 'sailfossil' }, { call: 'b03_panel_amaura' }] },
					{ text: 'Ahora no.', then: [
						{ say: 'cientifico_fosiles', text: 'Muy bien. Los fósiles no tienen prisa. Llevan millones de años esperando. Pueden esperar a que te decidas. Yo no tanto: ya tengo una edad.' },
					] },
				] },
			] },
			{ if: TODAS + ' && !done.b03_s_paneles', then: [{ call: 'b03_panel_cierre' }] },
		],

		b03_panel_kabuto: [
			{ cutscene: { weather: 'sparks', bg: { type: 'lab' }, start: 'dark', frames: [
				{ actors: [{ id: 'cientifico_fosiles', at: 'left' }], cam: 'push', fx: 'light', text: 'Lazare mete el Fósil Domo en la cápsula. La máquina se ilumina por dentro, azul, y empieza a zumbar como un refrigerador muy viejo.' },
				{ fx: 'glow', text: 'El caparazón se vuelve transparente. Debajo, algo se mueve. Patitas. Muchas.' },
				{ weather: 'none', actors: [{ key: 'cientifico_fosiles', emote: 'heart' }, { key: '_c', do: 'bob' }], mon: 'kabuto', fx: 'flash', text: 'La tapa se abre con un siseo. Sobre la bandeja, un **Kabuto** parpadea con sus dos ojitos rojos y se esconde bajo el caparazón. Luego asoma. Luego se esconde otra vez.' },
			] } },
			{ say: 'cientifico_fosiles', text: 'Hola, pequeño. Llevas trescientos millones de años escondido. Puedes salir. Fuera ya no hay ola.' },
			{ pokemon: { sp: 'kabuto', lv: 25, happy: 70 } },
			{ say: 'petra', text: '¡Hola! ¡Hola, hola! —Pala le aprieta las manos un poco más fuerte—. No lo toco. No lo toco. Pero hola.', cond: PETRA_AQUI },
		],
		b03_panel_omanyte: [
			{ cutscene: { weather: 'sparks', bg: { type: 'lab' }, start: 'dark', frames: [
				{ actors: [{ id: 'cientifico_fosiles', at: 'left' }], cam: 'push', fx: 'light', text: 'Lazare mete el Fósil Hélix en la cápsula, con la espiral hacia arriba, «que es como les gusta». La máquina se ilumina y zumba.' },
				{ fx: 'glow', text: 'La concha gira. Despacio. Una vuelta. Dos. Algo dentro se estira.' },
				{ weather: 'none', actors: [{ key: 'cientifico_fosiles', emote: '...' }, { key: '_c', do: 'nod' }], mon: 'omanyte', fx: 'flash', text: 'La tapa se abre. Un **Omanyte** sale de la concha con diez tentáculos a la vez, mira la luz del techo y se queda embobado, como quien ve una lámpara por primera vez.' },
			] } },
			{ say: 'cientifico_fosiles', text: 'Le gusta la luz. Normal. Lleva mucho tiempo a oscuras. —Apaga y enciende la lámpara de la mesa. El Omanyte sigue la luz con los ojos, fascinado—. Esto va a ser un problema.' },
			{ pokemon: { sp: 'omanyte', lv: 25, happy: 70 } },
		],
		b03_panel_aerodactyl: [
			{ cutscene: { weather: 'sparks', bg: { type: 'lab' }, start: 'dark', frames: [
				{ actors: [{ id: 'cientifico_fosiles', at: 'left' }], cam: 'push', fx: 'light', text: 'Lazare mete el Ámbar Viejo en la cápsula con las dos manos, como quien acuesta a un bebé. La máquina se ilumina, amarilla esta vez, y zumba más fuerte.' },
				{ fx: ['shake', 'quake'], text: 'Todo el laboratorio vibra. Las vitrinas tintinean. La taza de café se va sola hacia el borde de la mesa.' },
				{ weather: 'none', shake: 3, actors: [{ key: 'cientifico_fosiles', emote: '!' }, { key: '_c', size: 'l', do: 'hop' }], mon: 'aerodactyl', fx: ['flash', 'impact'], text: 'La tapa sale volando. Un **Aerodactyl** abre las alas en mitad del laboratorio, chilla con un sonido que no se ha oído en millones de años y tira la taza de café al suelo.' },
			] } },
			{ say: 'cientifico_fosiles', text: '¡Mi taza! —Mira la taza. Mira al Aerodactyl. Se le pasa enseguida—. Da igual. Era fea. Bienvenido, grandullón. Aquí no hay cielo, pero hay techo alto.' },
			{ pokemon: { sp: 'aerodactyl', lv: 25, happy: 70 } },
			{ say: 'petra', text: 'Lazare, el ala. Mírale el ala. Es igual que la del relieve de la cámara. ¡Igual! —Pala no la suelta. Hace bien.', cond: PETRA_AQUI + ' && flag.b03_panel_ala' },
		],
		b03_panel_tyrunt: [
			{ cutscene: { weather: 'sparks', bg: { type: 'lab' }, start: 'dark', frames: [
				{ actors: [{ id: 'cientifico_fosiles', at: 'left' }], cam: 'push', fx: 'light', text: 'Lazare mete el Fósil Mandíbula en la cápsula con unas pinzas muy largas. «Por si acaso», dice. La máquina se ilumina y zumba.' },
				{ weather: 'none', actors: [{ key: 'cientifico_fosiles', do: 'shake', emote: 'sweat' }, { key: '_c', do: 'hop' }], mon: 'tyrunt', fx: 'flash', text: 'La tapa se abre. Un **Tyrunt** pequeño sale de un salto, ruge con todas sus fuerzas (no mucha fuerza) y le muerde las pinzas a Lazare.' },
			] } },
			{ say: 'cientifico_fosiles', text: '¡Igualito que el otro! ¡Muerde con cariño! Con muchísimo cariño. Suelta, cariño.' },
			{ pokemon: { sp: 'tyrunt', lv: 25, happy: 70 } },
		],
		b03_panel_amaura: [
			{ cutscene: { weather: 'sparks', bg: { type: 'lab' }, start: 'dark', frames: [
				{ actors: [{ id: 'cientifico_fosiles', at: 'left' }], cam: 'push', fx: 'light', text: 'Lazare mete el Fósil Aleta en la cápsula. Baja un poco la temperatura del laboratorio, sin que nadie le diga nada: «les gusta el fresco». La máquina se ilumina y zumba.' },
				{ weather: 'none', color: '#9fe8d8', actors: [{ key: 'cientifico_fosiles', emote: '...' }], on: '_c', mon: 'amaura', fx: ['glow', 'sparkle'], text: 'La tapa se abre despacio. Una **Amaura** levanta la cabeza. Las velas del cuello se le encienden de colores, verde, rosa, azul, como una aurora de un cielo que ya no existe.' },
			] } },
			{ say: 'cientifico_fosiles', text: '…Siempre me pasa lo mismo con estas. Se me empañan las gafas. Es la humedad. —Se quita las gafas—. Es la humedad.' },
			{ pokemon: { sp: 'amaura', lv: 25, happy: 70 } },
			{ say: 'petra', text: 'No estoy llorando. Es la humedad. —Pala le ofrece una oreja como pañuelo. Petra la usa.', cond: PETRA_AQUI },
		],

		b03_panel_cierre: [
			{ say: 'cientifico_fosiles', text: 'Domo, Hélix y Ámbar. Las tres cámaras de los paneles, aquí, en mi laboratorio. —Se sienta en un taburete, de golpe, como si se le hubieran acabado las piernas—. Media vida leyendo sobre ellas. Ya me puedo jubilar. No me voy a jubilar. Pero podría.' },
			{ say: 'cientifico_fosiles', text: 'Toma. Es un **Hueso Raro**. Lo tenía en la vitrina de «cosas que no sé de quién son». Ahora no sé de quién es, pero es tuyo. Te lo has ganado.' },
			{ give: 'rarebone' },
			{ quest: 'b03_s_paneles', done: true },
			{ say: 'rotom', text: '¡Bzzt! ¡Misión cumplida! Tres cámaras, tres losas… bueno, muchas losas. Y una máquina que zumba como un refrigerador. ¡Me encanta la ciencia!' },
		],
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		b03_panel_cuaderno: { name: 'Cuaderno del arqueólogo', pocket: 'key', desc: 'Un cuaderno de tapas de cartón, hinchado de humedad y atado con una goma. Huele a tierra y a galletas.',
			read: '**CÁMARAS DE LA LADERA OESTE · RUINAS ALFA**\n*Notas de campo. Treinta años, más o menos. Más bien más.*\n\n**Cámara del Domo.** Inscripción: ESCAPA. Relieve de una crecida: gente escondida bajo caparazones. Los alumnos dicen que es un mito. Yo digo que es un aviso. Los avisos se tallan a toda prisa; esta está tallada a toda prisa.\n\n**Cámara de la Espiral.** Inscripción: LUZ, repetida hacia dentro, cada vez más pequeña. Hollín en el centro. Alguien escribió aquí hasta que se le apagó la lámpara. Me gusta pensar que terminó.\n\n**Cámara del Ala.** Inscripción: AGUA. Relieve de alguien que le da de beber a un Pokémon con alas. A un lado, una palabra sola de tres letras que no sé leer bien. Nunca la he visto en otra cámara. *(Añadido este otoño, con otra tinta: «Ya la sé leer. Me la leyó en voz alta {el|la|le} de la Gira que abrió las tres. No la escribo aquí. Hay palabras que es mejor decir que apuntar».)*\n\n**Las losas.** Se movían «en orden» según los registros antiguos. Hace un siglo dejaron de moverse. Este otoño han vuelto. No sé por qué. No me gusta no saber por qué.\n\n**La cuarta cámara**, arriba del todo. Sin losas. Solo un hueco en la pared, con forma de pluma, del tamaño de una mano abierta. Lo he medido cuarenta veces. No encaja nada. Algún día alguien traerá lo que encaja, y yo quiero estar delante.\n\n*Nota final, en mayúsculas: PATRIMONIO ES LA PACIENCIA. Y LAS RODILLAS.*' },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		b03_panel_escombros: {
			name: 'Escombros de las cámaras', icon: '🪨', hours: 20, picks: [1, 2],
			text: 'Al moverse, las losas sueltan polvo, arena y piedrecitas que llevaban siglos encajadas. Cribas un puñado con la brocha del arqueólogo.',
			wait: 'Ya has cribado todo lo que soltaron las losas. Vuelve otro día: la ladera siempre suelta algo.',
			table: [
				{ id: 'stardust', w: 30, n: [1, 2] }, { id: 'hardstone', w: 16, n: [1, 1] },
				{ id: 'moonstone', w: 3, n: [1, 1] }, { id: 'sunstone', w: 3, n: [1, 1] },
				{ id: 'waterstone', w: 3, n: [1, 1] }, { id: 'thunderstone', w: 3, n: [1, 1] },
				{ id: 'firestone', w: 3, n: [1, 1] }, { id: 'leafstone', w: 3, n: [1, 1] },
				{ id: 'icestone', w: 2, n: [1, 1] }, { id: 'dawnstone', w: 2, n: [1, 1] },
				{ id: 'duskstone', w: 2, n: [1, 1] }, { id: 'shinystone', w: 2, n: [1, 1] },
				{ id: 'rarebone', w: 5, n: [1, 1] },
				{ id: 'helixfossil', w: 1, n: [1, 1], cond: 'flag.b03_panel_espiral' },
				{ id: 'domefossil', w: 1, n: [1, 1], cond: 'flag.b03_panel_domo' },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		b03_panel_camaras: {
			name: 'Las cámaras de la ladera', type: 'Rock', rec: 41,
			cond: 'visited("b03_panel_ladera")',
			info: [
				{ text: 'Tres cámaras con suelos de **losas**: la del Domo, la de la Espiral y la del Ala. Se abren en orden, de la más fácil a la más difícil.' },
				{ text: 'Si te atoras, usa **Deshacer** o **Reiniciar**, o sal y vuelve: las losas regresan a su sitio.' },
				{ cond: 'flag.b03_panel_domo', text: '✔ Cámara del Domo abierta.' },
				{ cond: 'flag.b03_panel_espiral', text: '✔ Cámara de la Espiral abierta.' },
				{ cond: 'flag.b03_panel_ala', text: '✔ Cámara del Ala abierta.' },
				{ cond: 'flag.b03_panel_domo || flag.b03_panel_espiral || flag.b03_panel_ala', text: 'Los fósiles de los nichos se reviven en el **Laboratorio de Fósiles** de Pueblo Petroglifo (Kalos).' },
			],
		},
	},
};
