// Publicación 8 · Minijuegos para conseguir objetos (pedido de Mario: «Las diferentes mecánicas para obtener objetos:
// incluye más. Me gustó lo de deslizar la piedra para los fósiles»). Formato: docs/MINIJUEGOS.md.
//
// · 13 puntos diarios (`gather` con `game`): al recoger se elige entre jugar (sale más, y lo raro) o recoger rápido.
//   Kalos: cantera vieja de Petroglifo y Cueva Brillante (excavar), espigón de la Ruta 8 (pescar), Alameda de la Ruta 6
//   (cosechar), arcón del Conde (cerradura). Johto: Encinar y Ruinas Alfa (rastreo con el aura), huerto de Kurt (cosechar),
//   remanso del Lago de la Furia (pescar), buzón de los Vencejos (cerradura). Kanto: consigna de la estación de Azafrán
//   (cerradura), Puente Pepita (pescar), Cueva Celeste (excavar).
// · 5 de una sola vez, con escena y premio propio (se pueden reintentar si sales o pierdes):
//   el bloque de Lazare (excavar → fósil), el roble del Parque Nacional (cosechar → Megapiedra), los espejos de la
//   Cueva Reflejos (rastreo → Megapiedra), el arcón de los aprendices de la Torre Maestra (cerradura → MT y nota)
//   y la botella del Lago de la Furia (pescar → carta y MT).
//
// Nada depende de ramas. El rastreo pide a Riolu o Lucario en el equipo; sin él, el punto lo dice y no se pierde nada.
// Cada punto diario activa `flag.rec_<id>` la primera vez que se recoge (lo hace el motor): por eso su `new`.

const AURA = '(inParty("lucario") || inParty("riolu"))';
const HERA = '(inParty("heracross"))';

export default {
	// =====================================================================
	// PERSONAJES (solo genéricos: las voces con nombre son de personajes ya publicados)
	// =====================================================================
	npcs: {
		p8_guarda_parque: { name: 'Guarda del Parque Nacional', generic: true, look: { hair: 'cap', hairColor: '#5a4a32', eyes: '#3a5a2a', outfit: '#4a7a3a', outfit2: '#e9e3d0', skin: 2, eyesStyle: 'happy', mouth: 'smile', acc: 'beard' } },
		p8_taquillero: { name: 'Encargado de la consigna', generic: true, look: { hair: 'sidepart', hairColor: '#2b2b38', eyes: '#3a3a4a', outfit: '#3b5a8a', outfit2: '#e9c43a', skin: 1, eyesStyle: 'sleepy', mouth: 'flat', acc: 'glasses' } },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		p8_mt_abocajarro: { name: 'MT A Bocajarro', pocket: 'machines', tm: 'closecombat', desc: 'Lucha abierta, sin guardia. Pega muy fuerte, pero baja la Defensa y la Defensa Especial de quien lo usa.' },
		p8_mt_hidroariete: { name: 'MT Hidroariete', pocket: 'machines', tm: 'liquidation', desc: 'Embiste con toda la fuerza del agua. Puede bajar la Defensa del objetivo.' },
		p8_nota_petra: {
			name: 'Nota pegada a un bloque', pocket: 'key', desc: 'Una hoja de libreta de campo, con cinta de embalar y una mancha de café. Letra de Petra.',
			read: 'Lazare:\n\nTe dejo el bloque 14 de la cantera vieja. Lo saqué antes de irme y ya no me da tiempo. NO lo abras tú. Lo digo con cariño: la última vez usaste el martillo grande y tuvimos «muestra en polvo».\n\nTampoco lo iba a abrir yo. Me conozco. El día que lo saqué me caí dentro de la misma zanja dos veces, y la segunda vez ya estaba avisada.\n\nDentro hay algo redondo y muy duro. Sonó «toc» y no «tac». Los que suenan «toc» son los buenos.\n\nBusca a alguien con pulso. Primera regla: el pico, antes que el martillo. Segunda regla: si la pared cruje, se para. Tercera regla: no hay tercera, se me cayó el cuaderno a la zanja.\n\nPetra\n\nP. D.: Pala manda saludos. Bueno, manda tierra. Va en el sobre.',
		},
		p8_nota_cornelio: {
			name: 'Nota del arcón', pocket: 'key', desc: 'Un papel doblado en cuatro que estaba dentro del arcón de los aprendices de la Torre Maestra. La tinta es vieja; la letra, de Cornelio.',
			read: 'A quien lo haya abierto:\n\nSi estás leyendo esto, tienes memoria. Felicidades. Es lo segundo más importante.\n\nLo primero es acercarse.\n\nDe joven yo peleaba de lejos. Me parecía más listo. Mi maestra me dejó perder así un año entero, y luego me dijo: «De lejos no te pegan, pero tampoco te conocen».\n\nEl disco que hay aquí enseña a pelear sin guardia. Duele. A los dos. No se lo enseñes a un compañero al que no le hayas preguntado antes si quiere.\n\nY cierra el arcón al salir, que entra polvo.\n\nC.\n\n(Añadido debajo, con otra tinta, mucho más nueva: «Si eres mi nieta y lo has abierto a patadas: no cuenta. Otra vez».)',
		},
		p8_carta_botella: {
			name: 'Carta de la botella', pocket: 'key', desc: 'Una carta que pasó treinta años en una botella de gaseosa, en el fondo del Lago de la Furia. El lacre aguantó.',
			read: 'Hermano:\n\nNo te la voy a mandar. Por eso la escribo.\n\nDijiste que el lago era un charco y que yo me iba por miedo. Las dos cosas son verdad. También es verdad que tú te quedas en el mar por lo mismo, y a ti nadie te lo dijo.\n\nHoy saqué una carpa del tamaño de un zapato. La devolví. Me miró como miras tú cuando pierdes a las cartas.\n\nSi algún día el lago se queda quieto del todo, voy a verte. Si no, ven tú. Hay sitio en el cajón.\n\nNo se lo digas a mamá, pero la sopa te sale mejor que a ella.\n\nE.',
		},
		p8_tarjeta_conde: {
			name: 'Tarjeta del Conde', pocket: 'key', desc: 'Una tarjeta de visita negra con letras plateadas. Estaba dentro del arcón del vestíbulo del Castillo Caduco. Huele a cera y a algo que no sabes nombrar.',
			read: 'Estimad{o|a|e} visitante:\n\nSi tiene esta tarjeta en la mano, ha abierto mi arcón. Enhorabuena. Casi nadie lo intenta: la gente ve un candado y supone un «no».\n\nUn candado es un «todavía no».\n\nLo relleno cada noche. No pregunte a qué hora; no duermo cuando duerme usted. Cambio las runas con cada luna, por deporte. Llevo una racha larga. No diré cuánto.\n\nVuelva cuando guste. Me aburre ganar siempre.\n\nV. de C.\n\nP. D.: Lo que encuentre dentro es suyo. Los objetos, como las personas, solo están de paso.',
		},
	},

	// =====================================================================
	// PUNTOS DIARIOS (cada uno con su minijuego)
	// =====================================================================
	gather: {
		// ---------- Kalos ----------
		p8_cantera: {
			name: 'Frente viejo de la cantera', icon: '⛏️', hours: 20, picks: [1, 2], game: { type: 'dig', level: 2, theme: 'cantera' },
			ask: 'El frente viejo de la cantera, el que queda por fuera de la verja: una pared de roca a rayas, como un pastel. Alguien dejó un pico, un martillo y un cartel pintado a mano: «PROHIBIDO CAERSE (va por mí)».',
			text: 'La pared de la cantera suelta lo suyo.',
			wait: 'Hoy la pared ya dio lo que tenía. En el cartel alguien añadió con lápiz: «Mañana más. La roca no tiene prisa».',
			table: [
				{ id: 'hardstone', w: 14 }, { id: 'everstone', w: 8 }, { id: 'stardust', w: 16, n: [1, 2] }, { id: 'softsand', w: 6 },
				{ id: 'redshard', w: 8 }, { id: 'blueshard', w: 8 }, { id: 'yellowshard', w: 8 }, { id: 'greenshard', w: 8 },
				{ id: 'firestone', w: 3 }, { id: 'waterstone', w: 3 }, { id: 'thunderstone', w: 3 }, { id: 'leafstone', w: 3 },
				{ id: 'rarebone', w: 5, rare: true }, { id: 'sunstone', w: 3, rare: true }, { id: 'moonstone', w: 3, rare: true }, { id: 'nugget', w: 2, rare: true },
			],
		},
		p8_pared_brillante: {
			name: 'Pared que brilla', icon: '💎', hours: 22, picks: [1, 2], game: { type: 'dig', level: 3, theme: 'cueva' },
			ask: 'Aquí la pared de la cueva brilla por dentro, como si alguien hubiera dejado una linterna encendida detrás de la roca. Hay marcas de garras a media altura: no eres {el primero|la primera|le primere} que rasca aquí.',
			text: 'La roca blanda se deshace y deja ver lo que guardaba.',
			wait: 'La pared está apagada. Los cristales tardan un día en volver a asomar.',
			table: [
				{ id: 'stardust', w: 18, n: [1, 2] }, { id: 'starpiece', w: 6 }, { id: 'lightclay', w: 6 }, { id: 'pearl', w: 8 }, { id: 'icyrock', w: 4 }, { id: 'floatstone', w: 4 },
				{ id: 'shinystone', w: 3, rare: true }, { id: 'dawnstone', w: 3, rare: true }, { id: 'duskstone', w: 3, rare: true }, { id: 'cometshard', w: 1, rare: true },
			],
		},
		p8_espigon: {
			name: 'Espigón de la muralla', icon: '🎣', hours: 18, picks: [1, 2],
			game: { type: 'fish', level: 2, theme: 'mar', wildChance: 0.25, wild: [{ sp: 'clauncher', lv: [14, 17], w: 4 }, { sp: 'skrelp', lv: [14, 17], w: 4 }, { sp: 'staryu', lv: [14, 16], w: 3 }] },
			ask: 'Un espigón de piedra se mete en el mar desde la muralla. En la punta hay una caña de préstamo, atada con una cadena, y una tablilla: «Úsela y déjela. Si pica algo grande, la culpa es suya».',
			text: 'El mar, a los pies de la muralla, siempre trae algo.',
			wait: 'El agua está revuelta y no pica nada. La marea de mañana traerá más.',
			table: [
				{ id: 'pearl', w: 16, n: [1, 2] }, { id: 'heartscale', w: 10 }, { id: 'shoalshell', w: 8, n: [1, 2] }, { id: 'shoalsalt', w: 8, n: [1, 2] }, { id: 'bigpearl', w: 5 }, { id: 'mysticwater', w: 3 },
				{ id: 'prismscale', w: 2, rare: true }, { id: 'deepseatooth', w: 2, rare: true }, { id: 'deepseascale', w: 2, rare: true }, { id: 'pearlstring', w: 1, rare: true },
			],
		},
		p8_alameda: {
			name: 'El árbol torcido de la Alameda', icon: '🌳', hours: 20, picks: [2, 3], game: { type: 'catch', level: 2, theme: 'otono' },
			ask: 'De todos los árboles podados de la Alameda, solo uno crece como le da la gana: torcido, enorme y cargado. Los jardineros del Palacio lo rodean con la carretilla sin mirarlo. Debajo hay una cesta con un papel: «Lo que caiga al suelo es de los Furfrou».',
			text: 'El árbol torcido suelta su carga.',
			wait: 'Solo quedan hojas. Los jardineros dicen que mañana vuelve a estar cargado, «y nadie sabe cómo».',
			table: [
				{ id: 'sitrusberry', w: 14, n: [1, 2] }, { id: 'leppaberry', w: 10, n: [1, 2] }, { id: 'lumberry', w: 8 }, { id: 'pomegberry', w: 5, n: [1, 2] }, { id: 'kelpsyberry', w: 5, n: [1, 2] },
				{ id: 'liechiberry', w: 2, rare: true }, { id: 'salacberry', w: 2, rare: true }, { id: 'petayaberry', w: 2, rare: true },
			],
		},
		p8_arcon_conde: {
			name: 'El arcón del vestíbulo', icon: '🗝️', hours: 22, picks: [1, 2], game: { type: 'lock', level: 3, theme: 'cofre' },
			ask: 'En el vestíbulo del castillo hay un arcón con tres cerrojos y seis runas que se encienden solas cuando te acercas. Sobre la tapa, una tarjeta negra: «Sírvase. Si puede».',
			text: 'El arcón cruje al abrirse. Dentro huele a cera.',
			wait: 'El arcón está vacío y las runas, apagadas. En el fondo hay una tarjeta: «Vuelva mañana. Yo vuelvo siempre».',
			table: [
				{ id: 'duskball', w: 12, n: [2, 3] }, { id: 'spelltag', w: 8 }, { id: 'cleansetag', w: 8 }, { id: 'stardust', w: 10, n: [1, 2] }, { id: 'blackglasses', w: 5 },
				{ id: 'reapercloth', w: 3, rare: true }, { id: 'duskstone', w: 3, rare: true }, { id: 'relicsilver', w: 3, rare: true }, { id: 'rarecandy', w: 1, rare: true },
			],
		},
		// ---------- Johto ----------
		p8_rastro_encinar: {
			name: 'Claro de las raíces', icon: '🌀', hours: 20, picks: [1, 2], game: { type: 'aura', level: 2, theme: 'campo', hint: '{riolu} cierra los ojos. Toca el claro: te dirá si lo que busca está lejos o cerca.' },
			ask: 'Un claro donde las raíces de los robles se cruzan como dedos. {riolu} se detiene en seco y ladea la cabeza: debajo de la hojarasca hay algo. Varias cosas.',
			text: 'El bosque guarda sus cosas bajo las hojas.',
			wait: '{riolu} olfatea el claro y niega con la cabeza. Hoy ya no queda nada escondido.',
			table: [
				{ id: 'tinymushroom', w: 14, n: [1, 2] }, { id: 'bigmushroom', w: 8 }, { id: 'honey', w: 8 }, { id: 'miracleseed', w: 5 }, { id: 'leafstone', w: 3 },
				{ id: 'balmmushroom', w: 3, rare: true }, { id: 'bigroot', w: 3, rare: true }, { id: 'sunstone', w: 2, rare: true },
			],
		},
		p8_huerto_kurt: {
			name: 'El Bonguri viejo de Kurt', icon: '🌰', hours: 20, picks: [2, 3], game: { type: 'catch', level: 2, theme: 'huerto' },
			ask: 'Detrás de la casa de Kurt hay un Bonguri más viejo que el pueblo. Del tronco cuelga una tabla, con letra de cincel: «Sacudir, no trepar. Los que caen al suelo se magullan y no sirven. Usa la cesta. —K.».',
			text: 'El Bonguri viejo deja caer lo que tiene maduro.',
			wait: 'Solo quedan Bonguris verdes. En la tabla alguien grabó, más pequeño: «Paciencia. —K.».',
			table: [
				{ id: 'redapricorn', w: 14, n: [1, 2] }, { id: 'blueapricorn', w: 14, n: [1, 2] }, { id: 'yellowapricorn', w: 14, n: [1, 2] }, { id: 'greenapricorn', w: 14, n: [1, 2] }, { id: 'pinkapricorn', w: 12, n: [1, 2] },
				{ id: 'whiteapricorn', w: 6, n: [1, 2], rare: true }, { id: 'blackapricorn', w: 6, n: [1, 2], rare: true },
			],
		},
		p8_remanso_furia: {
			name: 'El remanso hondo', icon: '🎣', hours: 20, picks: [1, 2],
			game: { type: 'fish', level: 3, theme: 'lago', wildChance: 0.3, wild: [{ sp: 'magikarp', lv: [40, 44], w: 6 }, { sp: 'gyarados', lv: [43, 45], w: 1 }] },
			ask: 'Donde los pinos llegan hasta el agua, el lago se pone oscuro y quieto. Hay un cajón de fruta para sentarse y una caña apoyada en una horquilla. En el cajón, a navaja: «Si no pica, también es pescar».',
			text: 'El remanso suelta el anzuelo con algo más que agua.',
			wait: 'El remanso está quieto del todo. Hoy ya no pica nada.',
			table: [
				{ id: 'pearl', w: 12, n: [1, 2] }, { id: 'heartscale', w: 12 }, { id: 'bigpearl', w: 6 }, { id: 'mysticwater', w: 4 },
				{ id: 'dragonscale', w: 3, rare: true }, { id: 'prismscale', w: 2, rare: true }, { id: 'kingsrock', w: 2, rare: true },
			],
		},
		p8_rastro_alfa: {
			name: 'Explanada sin excavar', icon: '🌀', hours: 22, picks: [1, 2], game: { type: 'aura', level: 3, theme: 'ruina', hint: 'Las losas son todas iguales para los ojos. Toca una: {riolu} te dirá si hay algo cerca.' },
			ask: 'Más allá de las cintas de la excavación hay una explanada de losas que nadie ha levantado. {riolu} apoya una pata en el suelo y se le eriza el pelo del lomo: aquí abajo hay cosas muy viejas.',
			text: 'Entre las losas aparece lo que llevaba siglos esperando.',
			wait: '{riolu} recorre la explanada y vuelve sin señalar nada. Por hoy, las losas ya no esconden más.',
			table: [
				{ id: 'reliccopper', w: 12 }, { id: 'stardust', w: 10, n: [1, 2] }, { id: 'hardstone', w: 6 }, { id: 'everstone', w: 5 }, { id: 'relicsilver', w: 6 },
				{ id: 'rarebone', w: 4, rare: true }, { id: 'relicgold', w: 3, rare: true }, { id: 'relicvase', w: 1, rare: true },
			],
		},
		p8_buzon_vencejos: {
			name: 'El buzón del palomar', icon: '🗝️', hours: 22, picks: [1, 2], game: { type: 'lock', level: 3, theme: 'caja' },
			ask: 'En el palomar hay una caja de hierro atornillada a una viga, con una pluma gris pintada en la tapa y un cierre de runas. Una nota sin firma: «Lo que hay dentro es para quien sube. Las runas cambian. Tú, no».',
			text: 'La caja se abre con un clic muy bajo, como todo aquí arriba.',
			wait: 'La caja está vacía. En el fondo, una pluma gris y tres palabras: «Mañana. Mira arriba».',
			table: [
				{ id: 'healthwing', w: 8, n: [2, 4] }, { id: 'musclewing', w: 8, n: [2, 4] }, { id: 'swiftwing', w: 8, n: [2, 4] }, { id: 'sharpbeak', w: 6 }, { id: 'quickclaw', w: 5 }, { id: 'widelens', w: 4 },
				{ id: 'scopelens', w: 3, rare: true }, { id: 'razorclaw', w: 2, rare: true }, { id: 'ppup', w: 2, rare: true },
			],
		},
		// ---------- Kanto ----------
		p8_consigna: {
			name: 'Consigna automática', icon: '🗝️', hours: 20, picks: [1, 2], game: { type: 'lock', level: 2, theme: 'caja' },
			ask: 'Una pared de taquillas de Silph con cierre de luces. En la pantalla: «CONSIGNA CADUCADA · El contenido pasa a quien acierte la clave del día». Debajo, con rotulador: «Sí, es legal. Lo pregunté. —El encargado».',
			text: 'La taquilla se abre con un pitido de enhorabuena bastante desganado.',
			wait: 'Todas las taquillas caducadas de hoy están vacías. La pantalla dice: «Vuelva mañana. La gente olvida cosas todos los días».',
			table: [
				{ id: 'ether', w: 8 }, { id: 'elixir', w: 5 }, { id: 'revive', w: 8 }, { id: 'maxrepel', w: 6, n: [1, 2] }, { id: 'expcandym', w: 8, n: [1, 2] }, { id: 'fullheal', w: 6, n: [1, 2] },
				{ id: 'expcandyl', w: 3, rare: true }, { id: 'protein', w: 2, rare: true }, { id: 'carbos', w: 2, rare: true }, { id: 'bottlecap', w: 1, rare: true },
			],
		},
		p8_puente_pepita: {
			name: 'Bajo el Puente Pepita', icon: '🎣', hours: 20, picks: [1, 2],
			game: { type: 'fish', level: 3, theme: 'rio', wildChance: 0.25, wild: [{ sp: 'goldeen', lv: [40, 44], w: 5 }, { sp: 'poliwag', lv: [40, 44], w: 4 }, { sp: 'seaking', lv: [44, 46], w: 1 }] },
			ask: 'Bajo el puente, el río hace un remolino lento. Dicen que el puente se llama así por lo que la gente deja caer desde arriba cuando pierde un combate y se le va el pulso. Alguien dejó una caña clavada en la orilla.',
			text: 'El remolino devuelve lo que otros perdieron.',
			wait: 'El remolino gira vacío. Hoy nadie ha perdido nada más en el puente.',
			table: [
				{ id: 'pearl', w: 14, n: [1, 2] }, { id: 'heartscale', w: 10 }, { id: 'mysticwater', w: 4 }, { id: 'stardust', w: 8, n: [1, 2] }, { id: 'bigpearl', w: 5 },
				{ id: 'nugget', w: 4, rare: true }, { id: 'kingsrock', w: 2, rare: true }, { id: 'bignugget', w: 1, rare: true },
			],
		},
		p8_pared_celeste: {
			name: 'Veta azul de la cueva', icon: '💎', hours: 24, picks: [1, 2], game: { type: 'dig', level: 4, theme: 'cueva' },
			ask: 'Una veta azulada cruza la pared de lado a lado. La roca es dura y está agrietada: aquí hay que picar con cabeza, porque la pared no aguanta muchos golpes.',
			text: 'La veta azul cede, poco a poco.',
			wait: 'La veta está picada hasta donde es prudente. Mejor dejarla asentarse hasta mañana.',
			table: [
				{ id: 'stardust', w: 12, n: [1, 2] }, { id: 'starpiece', w: 8 }, { id: 'hardstone', w: 6 }, { id: 'moonstone', w: 4 },
				{ id: 'blueshard', w: 6 }, { id: 'redshard', w: 6 }, { id: 'yellowshard', w: 6 }, { id: 'greenshard', w: 6 },
				{ id: 'dawnstone', w: 3, rare: true }, { id: 'duskstone', w: 3, rare: true }, { id: 'shinystone', w: 3, rare: true }, { id: 'cometshard', w: 2, rare: true }, { id: 'ppup', w: 1, rare: true },
			],
		},
	},

	// =====================================================================
	// DÓNDE ESTÁ CADA COSA
	// =====================================================================
	// Kanto (lugares del B4)
	extraSpots: {
		estacion_azafran: [
			{ label: 'Consigna automática', sub: 'Taquillas caducadas · clave del día', icon: '🗝️', new: '!flag.rec_p8_consigna', action: { gather: 'p8_consigna' } },
			{ label: 'El encargado de la consigna', sub: 'Mira las taquillas como quien mira llover', icon: '💬', new: '!flag.p8_taquillero', talk: [{ script: 'p8_taquillero' }] },
		],
	},
	// Kalos, Johto y las rutas de Kanto (lugares de bloques anteriores y tramos de ruta)
	patches: {
		// ---------- Kalos ----------
		petroglifo: { spots: [
			{ label: 'Frente viejo de la cantera', sub: 'Pico, martillo y un cartel pintado a mano', icon: '⛏️', new: '!flag.rec_p8_cantera', action: { gather: 'p8_cantera' } },
		] },
		lab_fosiles: { spots: [
			{ label: 'Un bloque de roca en la mesa de Lazare', sub: 'Nadie se atreve a abrirlo', icon: '🪨', cond: 'flag.b01_fin', new: '!flag.p8_bloque_hecho', doneIf: 'flag.p8_bloque_hecho', talk: [
				{ cond: '!flag.p8_bloque_hecho', script: 'p8_lazare_bloque' },
				{ script: 'p8_lazare_despues' },
			] },
		] },
		cueva_brillante: { route: { tramos: { 6: [
			{ spot: { action: { gather: 'p8_pared_brillante' } }, label: 'Pared que brilla por dentro', sub: 'Hay marcas de garras', icon: '💎', new: '!flag.rec_p8_pared_brillante' },
		] } } },
		ruta8: { route: { tramos: { 4: [
			{ spot: { action: { gather: 'p8_espigon' } }, label: 'Espigón de la muralla', sub: 'Una caña de préstamo, con cadena', icon: '🎣', new: '!flag.rec_p8_espigon' },
		] } } },
		ruta6: { route: { tramos: { 5: [
			{ spot: { action: { gather: 'p8_alameda' } }, label: 'El árbol torcido de la Alameda', sub: 'El único que nadie poda', icon: '🌳', new: '!flag.rec_p8_alameda' },
		] } } },
		castillo_caduco: { spots: [
			{ label: 'El arcón del vestíbulo', sub: 'Tres cerrojos y una tarjeta: «Sírvase. Si puede»', icon: '🗝️', new: '!flag.rec_p8_arcon_conde', action: { gather: 'p8_arcon_conde' } },
			{ label: 'Una tarjeta negra dentro del arcón', sub: 'Letras plateadas', icon: '✉️', cond: 'flag.rec_p8_arcon_conde && !has("p8_tarjeta_conde")', new: 'true', talk: [{ script: 'p8_tarjeta_conde' }] },
		] },
		cueva_reflejos: { route: { tramos: { 6: [
			{ talk: [{ cond: AURA, script: 'p8_absol_reflejos' }, { script: 'p8_reflejos_sin_aura' }], label: 'Un espejo que no te devuelve el reflejo', sub: 'Algo blanco se mueve dentro', icon: '🪞', cond: 'flag.b01_fin && !flag.p8_absolita', new: '!flag.p8_absolita' },
		] } } },
		torre_maestra: { spots: [
			{ label: 'El arcón de los aprendices', sub: 'Runas en la tapa. Y polvo', icon: '🗝️', cond: 'flag.b01_torre_hecha', new: '!flag.p8_arcon_cornelio', doneIf: 'flag.p8_arcon_cornelio', talk: [
				{ cond: '!flag.p8_arcon_cornelio', script: 'p8_cornelio_arcon' },
				{ script: 'p8_cornelio_despues' },
			] },
		] },
		// ---------- Johto ----------
		encinar: { route: { tramos: { 6: [
			{ spot: { action: { gather: 'p8_rastro_encinar' } }, label: 'Claro de las raíces', sub: 'Tu compañero nota algo bajo las hojas', icon: '🌀', cond: AURA, new: '!flag.rec_p8_rastro_encinar' },
			{ talk: [{ script: 'p8_sin_aura' }], label: 'Claro de las raíces', sub: 'Hojarasca. Mucha', icon: '🍂', cond: '!' + AURA },
		] } } },
		azalea: { spots: [
			{ label: 'El Bonguri viejo de Kurt', sub: '«Sacudir, no trepar. —K.»', icon: '🌰', cond: 'flag.b02_llegada_azalea', new: '!flag.rec_p8_huerto_kurt', action: { gather: 'p8_huerto_kurt' } },
		] },
		parque_nacional: { spots: [
			{ label: 'Un Heracross dándole topes a un roble', sub: 'Lleva así tres días', icon: '🌳', cond: 'flag.b02_fin', new: '!flag.p8_heracronita', doneIf: 'flag.p8_heracronita', talk: [
				{ cond: '!flag.p8_heracronita', script: 'p8_roble_heracross' },
				{ script: 'p8_roble_despues' },
			] },
		] },
		lago_furia: { spots: [
			{ label: 'El remanso hondo', sub: 'Un cajón, una caña y una frase a navaja', icon: '🎣', cond: 'flag.b03_fin', new: '!flag.rec_p8_remanso_furia', action: { gather: 'p8_remanso_furia' } },
			{ label: 'Evaristo, mirando el remanso', sub: 'Hoy no pesca. Mira un punto del agua', icon: '🎣', cond: 'flag.b03_fin && flag.p7_evaristo_1', new: '!flag.p8_botella', doneIf: 'flag.p8_botella', talk: [
				{ cond: '!flag.p8_botella', script: 'p8_evaristo_botella' },
				{ script: 'p8_evaristo_botella_despues' },
			] },
		] },
		ruinas_alfa: { spots: [
			{ label: 'Explanada sin excavar', sub: 'A tu compañero se le eriza el lomo', icon: '🌀', cond: AURA, new: '!flag.rec_p8_rastro_alfa', action: { gather: 'p8_rastro_alfa' } },
			{ label: 'Explanada sin excavar', sub: 'Losas y más losas', icon: '🧱', cond: '!' + AURA, talk: [{ script: 'p8_sin_aura' }] },
		] },
		sede_vencejos: { spots: [
			{ label: 'El buzón del palomar', sub: 'Una caja de hierro con una pluma pintada', icon: '🗝️', new: '!flag.rec_p8_buzon_vencejos', action: { gather: 'p8_buzon_vencejos' } },
		] },
		// ---------- Kanto (rutas) ----------
		ruta24: { route: { tramos: { 3: [
			{ spot: { action: { gather: 'p8_puente_pepita' } }, label: 'Bajo el Puente Pepita', sub: 'Un remolino lento y una caña clavada', icon: '🎣', new: '!flag.rec_p8_puente_pepita' },
		] } } },
		cueva_celeste: { route: { tramos: { 5: [
			{ spot: { action: { gather: 'p8_pared_celeste' } }, label: 'Veta azul en la pared', sub: 'Roca dura y agrietada', icon: '💎', new: '!flag.rec_p8_pared_celeste' },
		] } } },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// Rastreo sin Riolu ni Lucario en el equipo: el sitio se nota, pero no se puede trabajar
		p8_sin_aura: [
			'Te agachas y apartas lo que hay por encima. Nada. Y aun así tienes la sensación de que aquí debajo hay algo, como cuando sabes que alguien te mira.',
			{ text: 'Tus ojos no bastan para esto. **{riolu}** lo encontraría en un momento: vuelve con él en el equipo.' },
		],

		// ---------- Azafrán: el encargado de la consigna (voz del punto diario) ----------
		p8_taquillero: [
			{ set: { 'flag.p8_taquillero': true } },
			{ say: 'p8_taquillero', text: 'Consigna automática de Silph. Guarda usted la maleta, se va de viaje, vuelve… o no vuelve. Si no vuelve en treinta días, la taquilla caduca.' },
			{ say: 'p8_taquillero', text: 'Antes lo subastábamos. Mucho papeleo. Ahora la máquina pone una clave de luces y el que la repite se lleva lo que haya. Es más rápido y nadie me grita.' },
			{ say: 'p8_taquillero', text: 'Un consejo, que es gratis: no mire las luces. Escúchelas. Cada una pita distinto. Yo me las sé todas y no abro ninguna, porque soy el encargado. Qué vida.' },
			{ say: 'p8_taquillero', text: 'Ah, y si tiene prisa, hay un botón de «abrir la primera que salga». Da menos. Pero la prisa siempre da menos.' },
		],

		// ---------- Castillo Caduco: la tarjeta del arcón (objeto para leer) ----------
		p8_tarjeta_conde: [
			'En el fondo del arcón, debajo de todo, hay una tarjeta negra con letras plateadas. No estaba ahí hace un momento. O sí estaba y no la viste.',
			{ give: 'p8_tarjeta_conde' },
			{ read: 'p8_tarjeta_conde' },
		],

		// ---------- Laboratorio de Fósiles: el bloque de Lazare (excavar → fósil) ----------
		p8_lazare_bloque: [
			{ if: '!flag.p8_bloque_visto', then: [
				{ set: { 'flag.p8_bloque_visto': true } },
				'En la mesa de trabajo hay un bloque de roca del tamaño de una sandía, envuelto en plástico de burbujas. El Dr. Lazare da vueltas a su alrededor con las manos a la espalda, como si el bloque pudiera morder.',
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Ah, eres tú! Llegas en buen momento. O en malo. Mira: esto me lo dejó Petra antes de irse, de la cantera vieja. Con una nota.' },
				{ give: 'p8_nota_petra' },
				{ read: 'p8_nota_petra' },
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '«Muestra en polvo». Fue una vez. ¡Una! …Dos. Pero la segunda no cuenta, el bloque ya venía agrietado.' },
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'El caso es que tiene razón. Yo no tengo pulso; tengo entusiasmo, que es peor. Y tú tienes manos de entrenador{|a|e}: sabes cuándo apretar y cuándo no.' },
			], else: [
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'El bloque sigue ahí. Yo sigo sin tocarlo, y no sabes lo que me cuesta. ¿Lo intentas?' },
			] },
			{ choice: [
				{ text: 'Abrir el bloque', then: [
					{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'El pico, antes que el martillo. Si la roca cruje, para. Y yo me voy a sentar allá, lejos, encima de mis manos.' },
					{ minigame: {
						type: 'dig', id: 'p8_bloque_lazare', title: 'El bloque 14', level: 3, theme: 'cantera',
						hint: 'Hay algo redondo y muy duro dentro. Destápalo entero antes de que el bloque se parta.',
						guaranteed: ['skullfossil'], picks: 2, lootTitle: 'Dentro del bloque',
						loot: [{ id: 'rarebone', w: 4 }, { id: 'hardstone', w: 6 }, { id: 'stardust', w: 6 }, { id: 'everstone', w: 3 }, { id: 'sunstone', w: 1, rare: true }],
						consolation: 'hardstone',
					},
					onWin: [
						{ set: { 'flag.p8_bloque_hecho': true } },
						{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Entero! ¡ENTERO! Mira esa cúpula. Mira el grosor. Esto es un cráneo, y no uno cualquiera: con esto se rompían rocas a cabezazos hace cien millones de años.' },
						{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Petra va a llorar. Luego se va a tropezar con algo. Luego va a llorar otra vez. Se lo voy a contar por carta, para no estar cerca.' },
						{ if: 'owns("cranidos") || owns("rampardos")', then: [
							{ if: 'has("skullfossil")', then: [{ take: 'skullfossil' }] },
							{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Aunque veo que tú ya conoces a uno de estos en persona. Entonces, si me dejas, este se queda en la vitrina, con tu nombre en la placa. Y tú te llevas algo del cajón bueno.' },
							{ give: 'rarecandy', n: 2 },
						], else: [
							{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Dámelo. No, no me lo des, llévalo tú hasta el Restaurador, que a mí me tiemblan las manos. Ahí. Eso. Ahora apártate un paso.' },
							{ if: 'has("skullfossil")', then: [{ take: 'skullfossil' }] },
							'El Restaurador zumba, se pone a vibrar y suelta un «clonc» que hace saltar una tapa. Cuando el vapor se va, hay algo pequeño y gris en la bandeja, con la cabeza azul y muy dura. Lo primero que hace es darle un cabezazo a la máquina.',
							{ pokemon: { sp: 'cranidos', lv: 28 } },
							{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Un **Cranidos**. Acaba de abollar el Restaurador y es lo más bonito que me ha pasado este mes. Cuídalo. Y no lo dejes cerca de nada que te importe.' },
						] },
					],
					onLose: [
						{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Quieto, quieto! Se desprendió una esquina, nada más. Lo de dentro sigue entero: lo oí hacer «toc». Lo vuelvo a envolver y tú respiras. Cuando quieras, otra vez.' },
					],
					onQuit: [
						{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Bien hecho. Parar a tiempo es la mitad de la paleontología. La otra mitad es volver mañana.' },
					] },
				] },
				{ text: 'Ahora no', then: [
					{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Lleva cien millones de años esperando. Puede esperar a que te tomes un café. Yo, no sé.' },
				] },
			] },
		],
		p8_lazare_despues: [
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Guardé la roca del bloque 14 en la vitrina, con una placa: «Abierto por alguien con pulso». Petra pidió por holomisor que debajo pusiera «por fin». Lo puse.' },
		],

		// ---------- Parque Nacional: el roble del Heracross (cosechar → Megapiedra) ----------
		p8_roble_heracross: [
			{ if: '!flag.p8_roble_visto', then: [
				{ set: { 'flag.p8_roble_visto': true } },
				'TOC. Un Heracross salvaje toma carrera, baja el cuerno y embiste un roble enorme. Caen cuatro hojas. El Heracross se sacude, retrocede y vuelve a tomar carrera. TOC.',
				{ say: 'p8_guarda_parque', text: 'Tres días lleva. Ni come. Le dejo miel al pie del árbol y ni la mira.' },
				{ say: 'p8_guarda_parque', text: 'Hay algo allá arriba, entre las ramas gordas. Brilla cuando le da el sol de la tarde. Hace años un muchacho venía aquí con su Heracross, todas las semanas. Un día dejó de venir. El Heracross, no.' },
				{ say: 'p8_guarda_parque', text: 'Yo no puedo trepar, que soy el guarda y doy mal ejemplo. Pero sacudirlo… El reglamento no dice nada de sacudir.' },
			], else: [
				{ say: 'p8_guarda_parque', text: 'Sigue igual. TOC, TOC, TOC. Ya hasta duermo con el ruido. ¿Le echas una mano?' },
			] },
			{ if: HERA, then: ['Tu Heracross se queda mirando al otro. Luego mira el árbol. Luego te mira a ti, y resopla por la nariz.'] },
			{ choice: [
				{ text: 'Sacudir el roble', then: [
					{ say: 'p8_guarda_parque', text: 'Toma la cesta de la miel. Y ojo: ese roble tiene piñas del año pasado y bellotas pochas. Lo que brilla va a caer lo último, como todo lo bueno.' },
					{ minigame: {
						type: 'catch', id: 'p8_roble', title: 'El roble del Heracross', level: 3, theme: 'bosque',
						hint: 'Desliza de lado sobre la copa para sacudir. Lo que brilla solo cae en tu cesta si la llenas bien.',
						guaranteed: ['heracronite'], picks: 3, lootTitle: 'Lo que cayó del roble',
						loot: [{ id: 'honey', w: 8 }, { id: 'sitrusberry', w: 6, n: [1, 2] }, { id: 'lumberry', w: 4 }, { id: 'silverpowder', w: 2, rare: true }],
						consolation: 'honey',
					},
					onWin: [
						{ set: { 'flag.p8_heracronita': true } },
						'Lo último que cae no es una bellota. Es una canica del tamaño de una nuez, con una espiral naranja y azul dentro. Aterriza en la cesta sin hacer ruido.',
						'El Heracross deja de embestir. Se acerca despacio, la huele y cierra los ojos un momento. Después empuja la cesta hacia ti con el cuerno, muy serio, como quien entrega algo que no es suyo.',
						{ say: 'p8_guarda_parque', text: 'Mira nada más. Tres días para bajarla y te la da. …No, espera. Para eso la quería bajar. Para que no se quedara ahí sola.' },
						{ if: HERA, then: [
							'Tu Heracross choca el cuerno con el del salvaje, una sola vez, flojito. El otro se da la vuelta, se sube al roble y, por primera vez en tres días, se pone a comer savia.',
						], else: [
							'El Heracross se da la vuelta, se sube al roble y, por primera vez en tres días, se pone a comer savia.',
						] },
						{ say: 'p8_guarda_parque', text: 'Eso es una **Heracrossita**. Con la pulsera y la piedra, un Heracross saca un cuerno que da miedo. Úsala con uno que te quiera, que así es como funciona.' },
					],
					onLose: [
						{ say: 'p8_guarda_parque', text: 'Casi. Se quedó enganchada en la rama de abajo, la veo desde aquí. Descansa los brazos y dale otra vez cuando quieras; el Heracross te la sostiene. Literal.' },
					],
					onQuit: [
						{ say: 'p8_guarda_parque', text: 'Sin prisa. El roble no se va. Él tampoco.' },
					] },
				] },
				{ text: 'Mejor luego', then: ['TOC. El Heracross ni te mira. Tiene trabajo.'] },
			] },
		],
		p8_roble_despues: [
			'El Heracross del roble está panza arriba en una rama, con la cara llena de savia. Cuando pasas por debajo, levanta el cuerno a modo de saludo y sigue comiendo.',
			{ say: 'p8_guarda_parque', text: 'Ha engordado. Le sigo dejando miel, por si acaso. Ahora sí se la come.' },
		],

		// ---------- Cueva Reflejos: el espejo sin reflejo (rastreo → Megapiedra) ----------
		p8_reflejos_sin_aura: [
			'Uno de los espejos de roca no te devuelve el reflejo. Dentro se mueve algo blanco, despacio, como si caminara por el otro lado de la pared.',
			{ text: 'Parpadeas y ya no está. Tus ojos no dan para más: aquí hace falta alguien que vea sin mirar. **{riolu}**, por ejemplo.' },
		],
		p8_absol_reflejos: [
			{ if: '!flag.p8_reflejos_visto', then: [
				{ set: { 'flag.p8_reflejos_visto': true } },
				'Uno de los espejos de roca no te devuelve el reflejo. En su lugar hay una silueta blanca, de cuatro patas, con un cuerno en forma de hoz. No te mira a ti: mira hacia el suelo de la galería.',
				'{riolu} se pone delante de ti sin gruñir. Tiene los apéndices de la cabeza levantados y los ojos cerrados. No está en guardia. Está escuchando.',
				'La silueta baja el cuerno, toca el suelo dentro del espejo… y el espejo se queda vacío. Solo roca pulida.',
			], else: [
				'El espejo sigue vacío. {riolu} vuelve a cerrar los ojos en el mismo sitio de antes.',
			] },
			{ choice: [
				{ text: 'Dejar que {riolu} busque', then: [
					{ minigame: {
						type: 'aura', id: 'p8_reflejos', title: 'Lo que señaló el reflejo', level: 3, theme: 'cueva',
						hint: 'Los espejos engañan a los ojos, no al aura. Toca el suelo: {riolu} te dirá si está lejos o cerca.',
						guaranteed: ['absolite'], picks: 2, lootTitle: 'Bajo el suelo de la galería',
						loot: [{ id: 'stardust', w: 8 }, { id: 'lightclay', w: 4 }, { id: 'starpiece', w: 3 }, { id: 'shinystone', w: 1, rare: true }],
						consolation: 'stardust',
					},
					onWin: [
						{ set: { 'flag.p8_absolita': true } },
						'{riolu} aparta una lasca de roca con la pata. Debajo, en un hueco con forma de cuenco, hay una canica blanca con una espiral oscura. Está fría, y aun así parece recién dejada.',
						'En el espejo, la silueta blanca vuelve un instante. Inclina la cabeza, primero hacia {riolu} y luego hacia ti, y se va andando hacia el fondo, donde el espejo ya no alcanza.',
						{ text: 'Es una **Absolita**. Dicen que los Absol bajan de la montaña para avisar, y que casi nadie les hace caso. Este solo quería dejar algo en buenas manos.' },
						{ happy: { who: 'riolu', n: 10 } },
					],
					onLose: [
						'{riolu} abre los ojos y sacude la cabeza, cansado. Hay demasiados reflejos; el rastro se le ha ido. Le rascas detrás de las orejas. Lo que sea sigue ahí abajo: puede volver a intentarlo.',
					],
					onQuit: ['{riolu} te mira, mira el suelo y se sienta. Cuando quieras.'] },
				] },
				{ text: 'Ahora no', then: ['{riolu} tarda en apartarse del espejo. Mira hacia atrás dos veces.'] },
			] },
		],

		// ---------- Torre Maestra: el arcón de los aprendices (cerradura → MT y nota) ----------
		p8_cornelio_arcon: [
			{ if: '!flag.p8_arcon_visto', then: [
				{ set: { 'flag.p8_arcon_visto': true } },
				'Detrás del pebetero, casi escondido, hay un arcón de madera oscura con seis runas grabadas en la tapa. Tiene tanto polvo que has dejado la huella de la mano.',
				{ say: 'cornelio', text: '¡Ah! Lo encontraste. Treinta años lleva ahí. Es el arcón de los aprendices: el que lo abre se queda lo de dentro.' },
				{ say: 'cornelio', text: 'No hay llave. Las runas se encienden en un orden y tú lo repites. Cada cerrojo, una runa más. No es fuerza, no es aura. Es poner atención, que es lo más difícil de enseñar.' },
				{ say: 'cornelio', text: 'Mi nieta lo intentó a los nueve años. A la tercera runa se aburrió y le dio una patada. El arcón ganó. No se lo recuerdes.' },
			], else: [
				{ say: 'cornelio', text: 'El arcón no se ha movido. Yo tampoco. ¿Otra vez?' },
			] },
			{ choice: [
				{ text: 'Intentar abrirlo', then: [
					{ say: 'cornelio', text: 'Si te pierdes, pide verlas otra vez. No es trampa. Trampa es fingir que te acuerdas.' },
					{ minigame: {
						type: 'lock', id: 'p8_arcon_torre', title: 'El arcón de los aprendices', level: 3, theme: 'cofre',
						hint: 'Mira el orden en que se encienden las runas y repítelo. Puedes pedir verlo otra vez.',
						guaranteed: ['p8_mt_abocajarro'], picks: 1, lootTitle: 'Dentro del arcón',
						loot: [{ id: 'blackbelt', w: 3 }, { id: 'expertbelt', w: 2 }, { id: 'muscleband', w: 2 }],
						consolation: 'stardust',
					},
					onWin: [
						{ set: { 'flag.p8_arcon_cornelio': true } },
						'Debajo del disco hay un papel doblado en cuatro.',
						{ give: 'p8_nota_cornelio' },
						{ read: 'p8_nota_cornelio' },
						{ say: 'cornelio', text: '…Se me había olvidado que escribí eso. Qué joven era. Qué letra tan fea. Lo de abajo, no: eso lo añadí hace poco y lo sostengo.' },
						{ say: 'cornelio', text: 'El disco es **A Bocajarro**. Pelear sin guardia. Enséñaselo a quien confíe en ti lo bastante para acercarse tanto. Se me ocurre uno, con orejas azules.' },
					],
					onLose: [
						{ say: 'cornelio', text: '¡Clac! Se trabó. No pasa nada: en un rato se destraba solo, lo hice yo y soy muy considerado. Respira, mira la llama un momento y vuelve.' },
					],
					onQuit: [
						{ say: 'cornelio', text: 'También se aprende dejando algo a medias. Aquí sigue.' },
					] },
				] },
				{ text: 'Otro día', then: [{ say: 'cornelio', text: 'Otro día, entonces. Lleva treinta años cerrado. No le corre prisa a nadie.' }] },
			] },
		],
		p8_cornelio_despues: [
			'El arcón está abierto y limpio. Alguien le ha pasado un trapo y ha dejado dentro un papel nuevo, doblado en cuatro, que no es para ti.',
			{ say: 'cornelio', text: 'Para el siguiente. Siempre hay un siguiente. Esa es la gracia de una torre.' },
		],

		// ---------- Lago de la Furia: la botella de Evaristo (pescar → carta y MT) ----------
		p8_evaristo_botella: [
			{ if: '!flag.p8_botella_vista', then: [
				{ set: { 'flag.p8_botella_vista': true } },
				{ say: 'p7_evaristo', text: 'Ahí. Donde el agua se pone negra. ¿Lo ves? No, claro. Yo tampoco. Pero sé que está.' },
				{ say: 'p7_evaristo', text: 'Hace treinta años tiré una botella en ese remanso. Con una cosa dentro que no me atreví a mandar. El lago estaba bravo y se la tragó. Ahora está quieto, y a veces, con el sol bajo, brilla un vidrio en el fondo.' },
				{ say: 'p7_evaristo', text: 'La he enganchado dos veces. Las dos se me soltó. Ya no tengo el pulso para aguantar el sedal en su sitio: o lo aprieto de más o lo suelto de más. Como todo.' },
				{ say: 'p7_evaristo', text: 'Tú tienes las manos nuevas. Toma mi caña. Cuando pique, que va a picar raro, no es pez, no jales como loc{o|a|e}. Tensión justa. Ni mucha ni poca.' },
			], else: [
				{ say: 'p7_evaristo', text: 'Sigue ahí abajo. La vi brillar hace rato. ¿Le das otra vez?' },
			] },
			{ choice: [
				{ text: 'Tomar la caña', then: [
					{ minigame: {
						type: 'fish', id: 'p8_botella', title: 'El vidrio del remanso', level: 3, theme: 'lago',
						hint: 'Espera el «!» y toca. Luego mantén pulsado para recoger y suelta para aflojar: la aguja, en lo verde.',
						guaranteed: ['p8_carta_botella'], picks: 1, lootTitle: 'Del fondo del remanso',
						loot: [{ id: 'heartscale', w: 5 }, { id: 'bigpearl', w: 3 }, { id: 'mysticwater', w: 2 }],
						consolation: 'pearl',
					},
					onWin: [
						{ set: { 'flag.p8_botella': true } },
						'Lo que sale del agua no colea. Es una botella de gaseosa, verde de limo, con el cuello sellado con lacre rojo. Evaristo la toma con las dos manos, como se toma a un recién nacido.',
						{ say: 'p7_evaristo', text: '…Aguantó el lacre. Treinta años. Las cosas mal hechas duran una barbaridad.' },
						{ say: 'p7_evaristo', text: 'Ábrela tú. Yo ya sé lo que dice. Lo que no sé es si todavía me da vergüenza.' },
						{ read: 'p8_carta_botella' },
						{ say: 'p7_evaristo', text: '…Sí. Todavía me da.' },
						{ say: 'p7_evaristo', text: 'Quédatela. Si la guardo yo, la vuelvo a tirar. Y si pasas por el puerto de Olivo y ves al de la barba… No. No le digas nada. Voy a ir yo. El lago ya está quieto; me quedé sin pretexto.' },
						{ say: 'p7_evaristo', text: 'Toma. Esto lo saqué del mar el último verano que pasé allá, con él. Es lo mejor que tengo y a mí no me sirve: yo ya no embisto nada.' },
						{ give: 'p8_mt_hidroariete' },
					],
					onLose: [
						{ say: 'p7_evaristo', text: 'Se soltó. Igual que a mí. No pongas esa cara: lleva treinta años ahí, no se va a ir hoy. Siéntate, deja que el agua se calme y lo intentas otra vez.' },
					],
					onQuit: [
						{ say: 'p7_evaristo', text: 'Sin prisa. Yo tardé treinta años en pedirlo.' },
					] },
				] },
				{ text: 'Ahora no', then: [{ say: 'p7_evaristo', text: 'Cuando quieras. El cajón es para dos.' }] },
			] },
		],
		p8_evaristo_botella_despues: [
			{ say: 'p7_evaristo', text: 'Compré el boleto a Olivo. Está en el cajón, debajo de los anzuelos. Todavía no lo he usado. Pero lo compré, que ya es más que en treinta años.' },
		],
	},
};
