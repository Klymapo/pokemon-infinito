// Parte nueva (Publicación 6) · «Los tres de Primavera» (II): Totodile en el Puerto de Olivo y el cierre de la misión.
// La misión, los NPCs (elm, becario_elm) y la presentación (b02_ini_presentacion) están en b02/t5-iniciales.js.
// El cierre (b03_ini_cierre) sale donde se encontró al último: Puerto de Olivo, Azalea o Iris.

// ---------- Condiciones reutilizadas ----------
const LUC = '(inParty("riolu") || inParty("lucario"))';
const TRES = 'flag.b02_ini_chikorita && flag.b02_ini_cyndaquil && flag.b03_ini_totodile';
const CIERRE = TRES + ' && !done.b02_s_iniciales';
const SPOT_CIERRE = { label: 'Ramiro, marcando en el holomisor', sub: 'Te hace señas para que te acerques', icon: '📞', cond: CIERRE, new: 'true', talk: [{ script: 'b03_ini_cierre' }] };

export default {
	npcs: {
		pescadora_olivo: { name: 'Pescadora', generic: true, look: { hair: 'bun', hairColor: '#cfd6e2', eyes: '#4a5a6a', eyesStyle: 'narrow', brows: 'thick', mouth: 'smirk', head: 'square', skin: 4, collar: 'scarf', scarfColor: '#c4473a', outfit: '#3b5bb5', outfit2: '#e9e3d0', age: 'old' } },
	},

	// =====================================================================
	// ENTRENADOR (combate opcional y amistoso, tras el cierre)
	// =====================================================================
	trainers: {
		b03_ini_ramiro: { name: 'Ramiro', cls: 'Becario', npc: 'becario_elm', ai: 3, iv: 24, reward: 2600,
			team: [
				{ sp: 'furret', lv: 42, ability: 'frisk', nature: 'jolly', moves: ['bodyslam', 'suckerpunch', 'knockoff', 'coil'] },
				{ sp: 'noctowl', lv: 43, ability: 'insomnia', nature: 'modest', moves: ['airslash', 'extrasensory', 'moonblast', 'roost'] },
				{ sp: 'quagsire', lv: 44, ability: 'unaware', nature: 'relaxed', item: 'sitrusberry', moves: ['earthquake', 'aquatail', 'yawn', 'amnesia'] },
			],
			items: [{ id: 'superpotion', n: 1 }],
			intro: '¡Perdón por adelantado! Pósit cuarenta: «No pedir perdón en combate». Ya empezamos mal.',
			win: 'Perdí. Pero no se me cayó el casco. Eso es nuevo. Lo apunto.',
			lose: '¿Gané? ¿Yo? Perdón. O sea, no perdón. ¡Bien! ¡Bien, Don Calma!',
		},
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		b03_ini_cartaelm: { name: 'Carta del Profesor Elm', pocket: 'key', desc: 'Una carta en papel del Laboratorio de Pueblo Primavera, con un cerco de taza de café en una esquina y la letra apretada de alguien que escribe más deprisa de lo que piensa.',
			read: 'Querid{o|a|e} {jugador}:\n\nTe escribo a mano porque mi mujer dice que las cosas importantes no se mandan por holomisor. Tiene razón. Casi siempre la tiene.\n\nLos papeles de Chikorita, Cyndaquil y Totodile ya están en regla: son tuyos. A los novatos que los tenían asignados les tocó la nidada de primavera, que nació antes de tiempo. Esa misma noche, por cierto. Sigo sin entenderlo, y eso es lo más bonito que me ha pasado en veinte años.\n\nTres cosas, de alguien que se ha pasado la vida mirando huevos:\n\n**Chikorita** necesita sol y que no la carguen sin preguntar.\n**Cyndaquil** necesita que alguien se dé cuenta cuando se le apaga la espalda.\n**Totodile** necesita algo que morder. Que no sea Ramiro.\n\nY tú necesitas paciencia: son pequeños y tu equipo es grande. Ya crecerán. Todo lo que nace a destiempo acaba encontrando su hora.\n\nUn abrazo,\n**Prof. Elm**\n\nP.D.: Ramiro habla de ti como de un superhéroe. No le digas que te lo he contado.\nP.P.D.: Mi hijo quiere saber si {riolu} firma autógrafos.' },
	},

	// =====================================================================
	// SPOTS
	// =====================================================================
	extraSpots: {
		puerto_olivo: [
			{ label: 'Un chico con el casco mordido', sub: 'Discute con una red de pesca. Va perdiendo', icon: '🚲',
				cond: 'flag.b03_faro_hecho && !flag.b03_ini_totodile', new: '!flag.b03_ini_toto_pista',
				talk: [{ cond: '!flag.b03_ini_toto_pista', script: 'b03_ini_puerto' }, { script: 'b03_ini_puerto_espera' }] },
			{ label: 'Una barca vieja en el muelle uno', sub: 'La amarra está llena de mordiscos', icon: '⛵',
				cond: 'flag.b03_ini_toto_pista && !flag.b03_ini_totodile', new: 'true',
				talk: [{ script: 'b03_ini_totodile' }] },
			{ label: 'La pescadora de la barca vieja', sub: 'Remienda una red al sol', icon: '🎣',
				cond: 'flag.b03_ini_totodile',
				talk: [{ script: 'b03_ini_pescadora' }] },
			SPOT_CIERRE,
			{ label: 'Ramiro, con la bici apoyada en un bolardo', sub: 'Repasa sus pósits. Te mira de reojo', icon: '🚲',
				cond: 'done.b02_s_iniciales', new: '!beat("b03_ini_ramiro") && !flag.b03_ini_reto_visto',
				talk: [{ cond: 'beat("b03_ini_ramiro")', script: 'b03_ini_ramiro_despues' }, { script: 'b03_ini_reto' }] },
		],
	},

	// Si el último inicial se encontró en el B2 (Azalea o Iris), Ramiro hace la llamada allí.
	patches: {
		azalea: { spots: [SPOT_CIERRE] },
		iris: { spots: [SPOT_CIERRE] },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// ---------- Totodile (Puerto de Olivo) ----------
		b03_ini_puerto: [
			{ if: '!flag.b02_ini_conocido', then: [
				{ text: 'En el muelle, un chico con casco de bici y chaleco reflectante tira de una red de pesca. La red tira de él. Gana la red.' },
				{ text: 'Cuando por fin se suelta, cae sentado delante de ti. En el borde del casco tiene una media luna perfecta de dientes.' },
				{ call: 'b02_ini_presentacion' },
				{ say: 'becario_elm', text: 'Y el que me mordió el casco es el tercero. El que se tiró al agua. Totodile.' },
			], else: [
				{ text: 'Ramiro tira de una red de pesca en el muelle. La red tira de él. Gana la red. Cuando por fin se suelta, cae sentado delante de ti.' },
				{ say: 'becario_elm', text: '¡{jugador}! Perdón, perdón, perdón. Estaba… pescando. No. Estaba buscando. Lo que pasa es que aquí todo tiene red.' },
			] },
			{ say: 'becario_elm', text: 'Totodile está en Olivo. Seguro. Lo dicen los marineros: «el bicho azul que muerde». Le ha mordido las botas al contramaestre, la pipa a un capitán y el ancla a un barco. El ancla. De hierro.' },
			{ text: 'Un marinero que pasa con una caja de sardinas se para a escuchar.' },
			{ say: 'marinero', text: '¿El cocodrilito? Vive en la barca de la señora del muelle uno, la de la pañoleta roja. Ella le da sardinas y él no deja que nadie se acerque a la barca. A nadie. Ni al cobrador. Eso se lo agradecemos.' },
			{ say: 'becario_elm', text: 'Fui ayer. Me acerqué a la barca. —Se señala el casco—. Pósit tres bis. El tres original se lo comió.' },
			{ set: { 'flag.b03_ini_toto_pista': true } },
		],
		b03_ini_puerto_espera: [
			{ say: 'becario_elm', text: 'La barca vieja del **muelle uno**. La de la pañoleta roja. Yo voy detrás de ti. Bastante detrás. Con el casco puesto.' },
		],
		b03_ini_totodile: [
			{ text: 'Al final del muelle uno hay una barca de pesca vieja, pintada de azul y blanco, con el nombre medio borrado en la proa. La amarra que la sujeta al muelle está llena de mordiscos, como una mazorca.' },
			{ text: 'En la popa, sentada en un cubo boca abajo, una señora mayor con una pañoleta roja remienda una red. A sus pies, sobre un montón de cuerda, hay un **Totodile**. Mordisquea una sardina con los ojos entrecerrados.' },
			{ text: 'Das un paso hacia la barca. El Totodile abre un ojo. Das otro. Abre la boca. Entera. Tiene muchos dientes para lo pequeño que es.' },
			{ say: 'pescadora_olivo', text: 'Yo que tú no subía, joven. A mí no me muerde porque le doy de comer. A los demás, sí. Es su barca, dice él. Llegó nadando hace semanas, se subió por la cadena del ancla y aquí se quedó.' },
			{ say: 'pescadora_olivo', text: 'De noche duerme en la proa, mirando hacia el este. Como si esperara a alguien que viene de allá.' },
			{ prompt: '¿Cómo te acercas?', choice: [
				{ cond: LUC, text: 'Dejar que {riolu} suba primero.', then: [
					{ text: '{riolu} salta a la barca sin hacer ruido. El Totodile se lanza a por él con la boca abierta y le cierra los dientes en el brazo.' },
					{ text: '*Clanc.*' },
					{ text: '{riolu} no se mueve. Ni un pelo. Se queda mirando al Totodile, tranquilo, con el aura encendida en los ojos, como diciendo «¿ya?».' },
					{ text: 'El Totodile suelta. Se lleva las patas a la boca. Le hormiguean los dientes. Mira a {riolu} con un respeto nuevo, enorme, y de pronto se pone a bailar: un pasito a un lado, otro al otro, la cola de un lado a otro. El baile de los Totodile cuando algo les parece lo mejor del mundo.' },
					{ say: 'pescadora_olivo', text: 'Ándale. Nunca le había visto bailar.' },
					{ happy: { who: 'riolu', n: 10 } },
				] },
				{ text: 'Ofrecerle algo que morder.', then: [
					{ text: 'Buscas algo en los bolsillos. Ramiro, a tu espalda, te pasa algo sin que se lo pidas: su taco de pósits entero.' },
					{ say: 'becario_elm', text: 'Toma. Son mis pósits de repuesto. Bueno, son todos. Ya no los necesito. —Pausa—. Creo.' },
					{ text: 'Lanzas el taco. El Totodile lo atrapa al vuelo y lo deshace a mordiscos en diez segundos, con una cara de felicidad absoluta. Llueven pósits amarillos sobre la barca.' },
					{ text: 'Cuando termina, se sacude, te mira como quien mira a quien le ha dado el mejor regalo de su vida y se pone a bailar: un pasito a un lado, otro al otro, la cola de un lado a otro.' },
					{ say: 'becario_elm', text: 'Pósit… No me queda ningún pósit. Me lo apunto en la mano.' },
				] },
				{ text: 'Pedirle a la pescadora que te ayude.', then: [
					{ text: 'La señora deja la red. Silba, corto y bajito. El Totodile se le sube al regazo de un salto, como un perro.' },
					{ say: 'pescadora_olivo', text: 'Mira, chiquito. El mar no es casa de nadie. Casa es quien te da de comer y te rasca la panza. —Le rasca la panza—. Y esta barca ya está vieja, y yo también. Esta gente te anda buscando desde lejos.' },
					{ text: 'Te pone al Totodile en los brazos. Pesa más de lo que parece. Te muerde la manga, sin apretar. Luego otra vez. Es su forma de decir que se queda.' },
				] },
			] },
			{ text: 'Ramiro se acerca por el muelle, muy despacio, con el casco puesto y las manos en alto. El Totodile lo ve y le enseña los dientes. Ramiro se para en seco.' },
			{ say: 'becario_elm', text: 'Ya sé. Ya sé. Yo tampoco me caigo bien a veces. Perdón.' },
			{ text: 'Ramiro marca en el holomisor desde una distancia prudente. El Profesor Elm contesta con un huevo pegado a la mejilla, como quien escucha una caracola.' },
			{ say: 'elm', text: '¡Shh! Que este ya casi… —Ve la pantalla—. ¡Ramiro! ¿Es…? ¡Es él! ¡Mírale los dientes! Están perfectos. Muerde porque le están saliendo los de adulto, ¿sabes? Le pica la boca. Muerde para que deje de picar.' },
			{ say: 'elm', text: 'Y mira hacia el este de noche, dice la señora. Hacia Primavera. Se acordaba del camino. Solo que le salió más largo, porque fue por el agua.' },
			{ say: 'pescadora_olivo', text: 'Lléveselo, joven. Pero dele sardinas, que se las sabe pedir.' },
			{ say: 'elm', text: '{jugador}, ya sabes lo que te voy a decir.' },
			{ say: 'becario_elm', text: 'Que se lo quede. Ya lo puse en un pósit. —Mira la mano—. Bueno, en la mano.' },
			{ say: 'elm', text: 'Exacto. Mi mujer dice que ya ni pregunto. En su Poké Ball hay un **Agua Mística** de la bienvenida. Y un poquito de arena de Primavera, que se le metió sin querer. No se la quites.' },
			{ pokemon: { sp: 'totodile', lv: 17, gender: 'M', nature: 'adamant', ability: 'torrent', happy: 160, item: 'mysticwater', moves: ['watergun', 'bite', 'scaryface', 'aquajet'], ivs: { hp: 28, atk: 31, def: 26, spa: 20, spd: 24, spe: 31 } } },
			{ set: { 'flag.b03_ini_totodile': true } },
			{ if: TRES, then: [
				{ call: 'b03_ini_cierre' },
			], else: [
				{ say: 'becario_elm', text: '¡Uno menos! Perdón, que me emociono. Falta poco: la lista de la misión dice dónde está lo que queda. Yo voy detrás de ti. Bastante detrás.' },
			] },
		],
		b03_ini_pescadora: [
			{ say: 'pescadora_olivo', text: 'Sin el cocodrilito, la barca está muy callada. Ni el cobrador se acerca ya, por si acaso. —Sonríe—. Cuando pasen por aquí, me lo traen. Le tengo guardada una sardina. Le tengo guardadas muchas.' },
			{ if: 'inParty("totodile") || inParty("croconaw") || inParty("feraligatr")', then: [
				{ text: 'Tu Pokémon salta a la barca, le muerde la manga a la señora sin apretar y vuelve a tu lado. Ella se ríe y se seca los ojos con la pañoleta.' },
			] },
		],

		// ---------- Cierre: la llamada a Elm ----------
		b03_ini_cierre: [
			{ text: 'Ramiro se sienta en el suelo con las piernas cruzadas y el holomisor en las dos manos, como si fuera a romperse. Respira hondo tres veces. Marca.' },
			{ text: 'Al otro lado, el Profesor Elm contesta sin gafas, con la bata al revés y un huevo en cada bolsillo. Detrás de él, una mujer saluda con la mano y un niño salta para salir en la pantalla.' },
			{ say: 'becario_elm', text: 'Profe. Ya están. Los tres. Chikorita, Cyndaquil y Totodile. Con {jugador}. Bien. Sanos. Uno muerde. —Se le quiebra la voz—. Perdón. Perdón, perdón, perdón.' },
			{ say: 'elm', text: 'Ramiro. —Se pone las gafas, que llevaba en la cabeza—. Ramiro, deja de pedir perdón. Los perdiste en una noche en que hasta los relojes se volvieron locos. Y luego te recorriste la región en bici, puerto por puerto y Slowpoke por Slowpoke, hasta encontrarlos. Eso no se perdona. Eso se agradece.' },
			{ text: 'Ramiro no contesta. Se tapa la cara con el casco.' },
			{ say: 'elm', text: '{jugador}. Los iniciales no se reparten, ¿sabes? Se presentan. Uno los pone delante, y ellos eligen. Estos tres te eligieron cada uno a su manera: uno se tumbó a tu lado, otro se dejó encender y otro te mordió con cariño. Que es como muerden los Totodile cuando quieren.' },
			{ say: 'elm', text: 'Así que son tuyos. Del todo. Los papeles ya están. Los arreglé tarde, como siempre, pero están.' },
			{ if: LUC, then: [
				{ say: 'elm', text: 'Y dile a {riolu} que he visto cómo los mira. Como un hermano mayor que no lo quiere admitir. Lo voy a poner en mi próximo artículo. Sin nombres.' },
			] },
			{ say: 'elm', text: 'Ramiro lleva una carta mía para ti. A mano: mi mujer insiste. Y algo para que crezcan rápido, que tu equipo les saca muchos niveles y no quiero que se acomplejen.' },
			{ give: 'b03_ini_cartaelm' },
			{ give: 'luckyegg' },
			{ say: 'elm', text: 'Un **Huevo Suerte**. No es un huevo. Bueno, no de los míos. El que lo lleve equipado gana más experiencia en cada combate. Es lo más parecido que tengo a acelerar el tiempo. Y eso, créeme, no se debe hacer con nada más.' },
			{ say: 'elm', text: 'Ramiro, vuelve a casa cuando quieras. Despacio. En bici. Sin pósits.' },
			{ say: 'becario_elm', text: 'Sin pósits no sé volver, profe.' },
			{ say: 'elm', text: 'Ya lo sé. Era una broma. ¡Mi mujer dice que no se me dan! Adiós, {jugador}. ¡Que crezcan bonitos!' },
			{ text: 'La llamada se corta. Ramiro se queda un rato mirando la pantalla apagada. Luego se levanta, se sacude el pantalón y te tiende la mano. Está temblando. Pero menos.' },
			{ say: 'becario_elm', text: 'Gracias. De verdad. Pósit número… no sé cuál toca ya. Da igual. Gracias.' },
			{ rep: { johto: 2 } },
			{ quest: 'b02_s_iniciales', done: true },
		],

		// ---------- Ramiro: combate amistoso opcional (después del cierre) ----------
		b03_ini_reto: [
			{ set: { 'flag.b03_ini_reto_visto': true } },
			{ say: 'becario_elm', text: 'Oye… {jugador}. Perdón. Es que el profe dice que tengo que practicar «decisiones bajo presión». Y yo pensé: ¿qué hay más bajo presión que un combate contra quien encontró a los tres?' },
			{ say: 'becario_elm', text: 'Te presento a Don Calma. —Saca una Poké Ball. Dentro hay un Quagsire que te mira sin ninguna expresión—. Es mi Quagsire. Nada le preocupa. Lo tengo para compensar.' },
			{ prompt: '¿Combates con Ramiro?', choice: [
				{ text: '«Va. Pero antes cura a mi equipo.»', then: [
					{ say: 'becario_elm', text: '¡Claro! Perdón, perdón, perdón, tendría que haberlo ofrecido yo. Tengo pociones del laboratorio. Muchas. El profe me hace llevar muchas.' },
					{ heal: true },
					{ text: 'Ramiro le rocía pociones a todo tu equipo con una eficacia sorprendente. Es lo único que hace sin que le tiemblen las manos.' },
					{ battle: 'b03_ini_ramiro', lose: 'continue', onWin: [{ call: 'b03_ini_ramiro_gana' }], onLose: [
						{ say: 'becario_elm', text: '¿Gané? —Mira a Don Calma. Don Calma no ha cambiado la cara en todo el combate—. Bueno. Ganó él. Yo solo grité.' },
						{ say: 'becario_elm', text: 'Cuando quieras la revancha, aquí estoy. Bueno, aquí o en cualquier puerto. Ya me sé todos.' },
					] },
				] },
				{ text: '«Primero paso por el Centro Pokémon.»', then: [
					{ say: 'becario_elm', text: 'Sí, sí, sí. Ve. Yo te espero aquí. Repasando. Tengo pósits nuevos. —Se los enseña: están en blanco—. Bueno, los voy a escribir.' },
				] },
				{ text: '«Ahora no.»', then: [
					{ say: 'becario_elm', text: 'Claro. Perdón. Otro día. Yo voy a estar por aquí: el profe me ha dado vacaciones. Bueno, me ha dicho que «vaya despacio». Es lo mismo.' },
				] },
			] },
		],
		b03_ini_ramiro_gana: [
			{ say: 'becario_elm', text: 'Perdí. Pero no me caí de la bici en todo el combate. ¡Y no pedí perdón ni una vez! —Pausa—. Ah, no. Pedí perdón al principio. Bueno.' },
			{ say: 'becario_elm', text: 'Toma. El profe me dijo que si perdía te diera esto. Y si ganaba, también. El profe siempre prepara las dos cosas.' },
			{ give: 'sitrusberry', n: 3 },
		],
		b03_ini_ramiro_despues: [
			{ if: 'inParty("chikorita") || inParty("bayleef") || inParty("meganium") || inParty("cyndaquil") || inParty("quilava") || inParty("typhlosion") || inParty("totodile") || inParty("croconaw") || inParty("feraligatr")', then: [
				{ say: 'becario_elm', text: '¡Los traes contigo! —Se agacha, sin acercarse demasiado. Ha aprendido—. Hola. Hola. Perdón por la noche aquella. Ya no se me abren las Poké Balls: ahora las llevo con cinta.' },
			], else: [
				{ say: 'becario_elm', text: 'El profe dice que los iniciales crecen mejor si viajan. Yo le digo que yo también he viajado mucho y no he crecido nada. Me dijo que eso no es verdad. Lo puse en un pósit. Lo tengo en la cartera.' },
			] },
			{ say: 'becario_elm', text: 'Don Calma te manda saludos. Bueno, no ha dicho nada. Pero tiene cara de mandar saludos. Siempre tiene la misma cara.' },
		],
	},
};
