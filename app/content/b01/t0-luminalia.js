// Bloque 1 · Tramo 0: Ciudad Luminalia (prólogo y centro de operaciones del bloque).
export default {
	locations: {
		luminalia: {
			name: 'Ciudad Luminalia', short: 'Luminalia', region: 'kalos', kind: 'city', map: { x: 55, y: 70 },
			bg: { type: 'city', landmark: 'prism' },
			desc: 'La capital de Kalos: bulevares en círculo, cafés con toldos y la **Torre Prisma** en el centro, como una aguja de luz.\n\nDesde la inauguración, la plaza está vallada. La gente habla en voz baja de «la grieta».',
			descs: [{ cond: '!flag.b01_handsome_recluta', text: 'La capital de Kalos. Hoy todo gira alrededor de la Torre Prisma.' }],
			descNight: 'De noche, los bulevares se encienden en círculos, uno dentro de otro, como los anillos de un tronco. Los cafés apilan las sillas bajo los toldos y la **Torre Prisma** brilla sola en el centro, más blanca que nunca.\n\nEn la plaza vallada, los guardias cambian de turno sin hablar. Siempre hay alguien parado en la acera, mirando la punta de la torre.',
			links: ['ruta4', 'ruta5'],
			mapNote: 'Torre Prisma · Lab. del Prof. Ciprés · Bulevar Sur (Centro Pokémon, tiendas)',
			spots: [
				{ label: 'Plaza de la Torre Prisma', sub: 'La Puerta Lemnis', icon: '🗼', action: { go: 'luminalia_plaza' } },
				{ label: 'Bulevar Sur', sub: 'Centro Pokémon, tiendas, Liga', icon: '🏙️', action: { go: 'luminalia_sur' } },
				{ label: 'Laboratorio del Prof. Ciprés', icon: '🔬', action: { go: 'lab_cipres' }, new: 'quest.b01_s_fennekin == "volver"' },
				{ label: 'Agencia de Detectives', icon: '🕵️', action: { go: 'agencia' }, cond: 'flag.b01_handsome_recluta', new: 'quest.b01_m2 == "agencia" || (flag.b01_macaron_resuelto && !flag.b01_agencia_macaron_premio)' },
				{ label: 'Café Soleil', sub: 'Terraza con vistas a la Torre', icon: '☕', action: { go: 'cafe_soleil' }, new: 'quest.b01_t_agencia == "macaron" || quest.b01_s_philippe == "volver"' },
				{ label: 'Oficinas de Lemnis Kalos', icon: '♾️', action: { go: 'lemnis_kalos' }, cond: 'badges >= 1', new: 'quest.b01_m2 == "lemnis"' },
			],
			rumors: [
				{ text: 'Desde la inauguración, hay quien jura ver luces violetas sobre la Torre Prisma de madrugada.' },
				{ cond: 'badges >= 1', text: 'Lemnis paga bien a quien le lleve Pokémon «extraviados». Demasiado bien, dicen algunos.' },
			],
		},
		luminalia_plaza: {
			name: 'Plaza de la Torre Prisma', parent: 'luminalia', kind: 'area', bg: { type: 'plaza', landmark: 'gate', fissure: false },
			desc: 'El arco plateado de la **Puerta Lemnis** brilla en el centro de la plaza, rodeado de vallas y guardias. Tiene la forma de un ∞ tumbado.',
			descs: [{ cond: '!flag.b01_m1_lab', text: 'Focos, música, cámaras. Cien novatos del Circuito Infinito esperan junto al escenario. Sobre él, un arco plateado con forma de ∞: la **Puerta Lemnis**.' }],
			spots: [
				{ label: 'Mirar la Puerta', icon: '♾️', talk: [{ cond: 'flag.b01_handsome_recluta', script: 'b01_mirar_puerta' }, { script: 'b01_mirar_puerta' }] },
				{ label: 'Guardia de Lemnis', icon: '🛡️', talk: [{ script: 'b01_guardia_plaza' }] },
				{ label: 'Lucien', sub: 'Un niño pegado a la valla', icon: '🧒', cond: 'flag.b01_handsome_recluta', talk: [{ cond: 'flag.b01_lucien_chespin', script: 'b01_lucien_2' }, { cond: 'flag.b01_lucien_1', script: 'b01_lucien_3' }, { script: 'b01_lucien_1' }] },
			],
		},
		luminalia_sur: {
			name: 'Bulevar Sur', parent: 'luminalia', kind: 'area', bg: { type: 'city', seed: 'sur' },
			desc: 'Tiendas, cafés y el **Centro Pokémon** más grande de Kalos. Al fondo, la salida hacia la **Ruta 4**.',
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Boutique de Luminalia', sub: 'Objetos de combate y Balls especiales', icon: '🛍️', action: { shop: 'boutique_luminalia' } },
				{ label: 'Puesto del Circuito Infinito', icon: '🏆', talk: [{ script: 'b01_empleado_liga' }] },
			],
		},
		lab_cipres: {
			name: 'Laboratorio del Prof. Ciprés', parent: 'luminalia', kind: 'building', bg: { type: 'lab' },
			desc: 'Estanterías hasta el techo, máquinas que pitan y un ventanal que da a la Torre Prisma. Huele a café recién hecho.',
			spots: [
				{ label: 'Hablar con el Prof. Ciprés', icon: '🔬', talk: [
					{ cond: 'quest.b01_s_fennekin == "volver"', script: 'b01_cipres_fennekin' },
					{ cond: 'flag.b01_fennekin_libre && !flag.b01_fennekin_pedido && !owns("fennekin") && !owns("braixen") && !owns("delphox")', script: 'b01_cipres_pedir_fennekin' },
					{ cond: 'badges >= 3', script: 'b01_cipres_mega' },
					{ script: 'b01_cipres_generico' },
				] },
			],
		},
		agencia: {
			name: 'Agencia de Detectives', parent: 'luminalia', kind: 'building', bg: { type: 'indoor', wall: '#c9b48a', floor: '#6b4a2b' },
			desc: 'Una oficina pequeña en un callejón del Bulevar Norte. Un escritorio enorme, un perchero con siete disfraces y una placa: **«Agencia de Detectives — Jefa: Matière»**.',
			spots: [
				{ label: 'Hablar con Handsome y Matière', icon: '🕵️', talk: [
					{ cond: 'badges >= 1 && !flag.b01_agencia_1', script: 'b01_agencia_1' },
					{ cond: 'flag.b01_macaron_resuelto && !flag.b01_agencia_macaron_premio', script: 'b01_agencia_premio' },
					{ cond: 'quest.b01_t_agencia == "macaron"', script: 'b01_agencia_recordar' },
					{ script: 'b01_agencia_generico' },
				] },
			],
		},
		cafe_soleil: {
			name: 'Café Soleil', parent: 'luminalia', kind: 'building', bg: { type: 'indoor', wall: '#f3d9b0', floor: '#a8714a' },
			desc: 'Terraza con mesas redondas, macarons de todos los colores y una vista directa a la Torre Prisma. La dueña presume de tener «el mejor café de Kalos». Nadie se atreve a contradecirla.',
			spots: [
				{ label: 'Investigar el robo del macaron', icon: '🔍', cond: 'quest.b01_t_agencia == "macaron"', talk: [{ script: 'b01_caso_macaron' }] },
				{ label: 'La periodista del pódcast', sub: 'Habla sola delante de un micrófono', icon: '🎙️', cond: 'flag.b01_macaron_resuelto && !flag.b01_renata_1', talk: [{ script: 'b01_renata_1' }] },
				{ label: 'Un chef que critica un macaron', icon: '👨‍🍳', cond: 'badges >= 1 && !(quest.b01_t_gaspar == "ruta7" || done.b01_t_gaspar)', talk: [
					{ cond: '!flag.b01_gaspar_1', script: 'b01_gaspar_1' },
					{ script: 'b01_gaspar_cafe' },
				] },
				{ label: 'Philippe, agente inmobiliario', sub: 'Hace trucos de cartas a quien se deja', icon: '🃏', cond: 'badges >= 1', talk: [
					{ cond: 'quest.b01_s_philippe == "volver"', script: 'b01_philippe_vuelta' },
					{ cond: '!flag.b01_philippe_1', script: 'b01_philippe_1' },
					{ script: 'b01_philippe_generico' },
				] },
			],
		},
		lemnis_kalos: {
			name: 'Oficinas de Lemnis Kalos', parent: 'luminalia', kind: 'building', bg: { type: 'indoor', wall: '#dfe7f2', floor: '#8a94a8' },
			desc: 'Cristal, acero y un logotipo enorme de **lemniscata** azul y plata en el vestíbulo. Todo huele a nuevo. Todo el mundo sonríe un poco demasiado.',
			spots: [
				{ label: 'Recepción', icon: '♾️', talk: [
					{ cond: '!flag.b01_diario', script: 'b01_lemnis_visita' },
					{ script: 'b01_lemnis_recepcion' },
				] },
			],
		},
	},

	trainers: {
		agente_lemnis_plaza: { name: 'Agente', cls: 'Seguridad Lemnis', ai: 2, npc: 'guardia_lemnis', team: [{ sp: 'pawniard', lv: 9 }], intro: '¡Atrás!', win: '…' },
	},

	scripts: {
		// =================== PRÓLOGO ===================
		b01_inicio: [
			{ go: 'luminalia_plaza', silent: true },
			{ quest: 'b01_m1', stage: 'inicio', silent: true },
			{ text: 'Ciudad Luminalia, Kalos. Ocho de la noche.' },
			{ text: 'La Plaza de la Torre Prisma está llena hasta los bordes. Focos, drones con cámara, banderines de todas las regiones. Cien novatos con un dorsal del **Circuito Infinito** esperan junto al escenario.' },
			{ text: 'El tuyo dice **#73**. Todavía no tienes ni un solo Pokémon.' },
			{ text: 'Sobre el escenario hay un arco plateado con forma de ∞ tumbado, del tamaño de un edificio de tres pisos: la **Puerta Lemnis**.' },
			{ say: 'lila', as: '¿?', text: 'E-esto… ¿tú también eres novat{o|a|e}? Perdona, es que estoy nerviosa y cuando estoy nerviosa hablo con desconocidos. Y luego me arrepiento.' },
			{ say: 'lila', as: '¿?', text: 'Me llamo Lila. Yo no compito: vengo de la Torre Maestra, de Ciudad Yantra. Me mandaron a… representar. Que es una forma elegante de decir «quedarse de pie y no tirar nada».' },
			{ choice: [
				{ text: '«Yo soy {jugador}. Tranquila, lo estás haciendo bien.»', then: [{ af: { lila: 3 } }, { say: 'lila', text: '¿S-sí? ¡Gracias! Nadie me había dicho eso hoy. Bueno, nadie me había dicho nada hoy.' }] },
				{ text: '«¿Representar a una torre? ¿Y la torre no podía venir sola?»', then: [{ af: { lila: 1 } }, { say: 'lila', text: '…¡Ja! P-perdón. Me reí por la nariz. Eso no se hace en público.' }] },
				{ text: '«Shh. Ya empieza.»', then: [{ say: 'lila', text: 'Ah. Sí. Claro. Perdón.' }] },
			] },
			{ set: { 'flag.b01_lila_conocida': true } },
			{ quest: 'b01_t_lila', stage: 'conocida', silent: true },
			{ text: 'Alguien te pisa al pasar. Fuerte. Una chica pelirroja con una chaqueta de equipo de fútbol galarés, número 9, se abre paso hasta la primera fila.' },
			{ say: 'rhi', as: 'Chica pelirroja', text: '¿Qué? Estabas en medio. —Te mira de arriba abajo—. Tú no tienes pinta de delanter{o|a|e}.' },
			{ choice: [
				{ text: '«¿Y tú tienes pinta de qué? ¿De árbitro?»', then: [{ af: { rhi: 3 } }, { say: 'rhi', as: 'Chica pelirroja', text: '¡Ja! Bueno. Al menos tienes boca. Rhi. De Galar. Acuérdate del nombre, porque lo vas a ver arriba de la tabla.' }] },
				{ text: '«Perdón por existir.»', then: [{ af: { rhi: -1 } }, { say: 'rhi', as: 'Chica pelirroja', text: 'Eso. Pide perdón. —Se da la vuelta, y luego, por encima del hombro—: Rhi. De Galar. Apréndetelo, que lo vas a oír mucho.' }] },
				{ text: 'No decir nada y sostenerle la mirada.', then: [{ af: { rhi: 2 } }, { say: 'rhi', as: 'Chica pelirroja', text: '…Va. Rhi. De Galar. Ya nos veremos en el campo.' }] },
			] },
			{ set: { 'flag.b01_rhi_conocida': true } },
			{ quest: 'b01_t_rhi', stage: 'conocida', silent: true },
			{ text: 'Las luces bajan. Una mujer joven sube al escenario: traje azul medianoche, guantes blancos, un broche de lemniscata en la solapa. No sonríe. No le hace falta.' },
			{ say: 'sera', text: 'Buenas noches, Kalos. Me llamo Serafina Lemnis.' },
			{ say: 'sera', text: 'Durante siglos, cada región ha estado sola. Sola ante sus crisis, sola ante sus catástrofes, sola ante sus legendarios. Esta noche eso termina.' },
			{ say: 'sera', text: 'Esta Puerta conectará Kalos con Kanto, Johto, Galar, Paldea… con todas. Y el Circuito Infinito será la primera liga de un mundo unido.' },
			{ say: 'sera', text: 'Un mundo. Una liga.' },
			{ choice: [
				{ text: 'Aplaudir.', then: [{ af: { sera: 1 } }, { text: 'Aplaudes. Desde el escenario, por un segundo, sus ojos grises se cruzan con los tuyos. Luego sigue con el discurso como si nada.' }] },
				{ text: 'No aplaudir.', then: [{ text: 'Te quedas con los brazos cruzados. Toda la plaza aplaude. Lila aplaude por ella y por ti, muy fuerte y muy rápido.' }] },
			] },
			{ set: { 'flag.b01_sera_vista': true } },
			{ quest: 'b01_t_sera', stage: 'discurso', silent: true },
			{ say: 'cipres', text: '¡Y ahora, lo que estabais esperando! Soy el profesor Ciprés y estos tres pequeños van a elegir hoy a sus entrenadores: ¡Chespin, Fennekin y Froakie!' },
			{ text: 'Tres Poké Balls brillan sobre un atril. Detrás del profesor, la Puerta empieza a zumbar. Un zumbido grave, que se te mete en los dientes.' },
			{ text: 'Luego, el zumbido cambia de tono. Se vuelve agudo. Las luces de la Torre Prisma parpadean. Una, dos veces. Y se apagan.' },
			{ text: 'En mitad del arco, el aire **se rasga**. Una grieta violeta, como una herida en el cielo.' },
			{ say: 'lila', text: '¿Q-qué es eso? ¿Es parte del espectáculo? Dime que es parte del espectáculo.' },
			{ text: 'De la grieta cae un **Rookidee** que no es de Kalos. Luego un **Lechonk**. Luego un **Shinx**, que sale disparado entre las piernas de la gente. La plaza grita.' },
			{ text: 'Y luego cae algo pequeño y azul, justo delante de ti. Golpea el suelo y no se mueve. Un **Riolu**. Tiene una herida en el hombro y el pelo chamuscado.' },
			{ text: 'Un Houndour salido de la grieta, con los ojos en blanco por el miedo, los ve. Gruñe. Se lanza contra ti.' },
			{ text: 'Riolu se levanta. No sabes cómo: no debería poder. Se planta entre el Houndour y tú, con los brazos en alto.' },
			{ text: 'Un brillo azul le recorre los brazos. Te mira un segundo por encima del hombro. Es como si te conociera.' },
			{ pokemon: { sp: 'riolu', lv: 5, nature: 'jolly', ability: 'innerfocus', ivs: { hp: 31, atk: 31, def: 20, spa: 20, spd: 25, spe: 31 }, moves: ['quickattack', 'endure', 'feint'], happy: 90, uidVar: 'riolu_uid', metAt: 'luminalia_plaza' }, silent: true },
			{ text: '**Riolu está luchando a tu lado.**' },
			{ wild: { sp: 'houndour', lv: 4, noCatch: true }, canRun: false, lose: 'continue',
				onWin: [{ text: 'El Houndour retrocede, gime y se pierde corriendo entre la multitud.' }],
				onLose: [{ text: 'Riolu cae. El Houndour duda un instante… y algo lo asusta más que ustedes: se pierde corriendo entre la multitud.' }] },
			{ heal: true, silent: true },
			{ text: 'Riolu se tambalea. Tiene la respiración agitada y no te quita los ojos de encima.' },
			{ say: 'lila', text: '¡E-espera, no lo muevas! Tengo… tengo una Baya Aranja. Siempre llevo una. Sujétalo, que no muerda.' },
			{ choice: [
				{ text: 'Sujetar a Riolu con cuidado.', then: [{ af: { lila: 3 } }, { happy: { who: 'riolu', n: 10 } }, { text: 'Riolu se tensa cuando lo tocas… y luego se deja. Lila le da la baya a pedacitos. Le tiemblan las manos, pero no se detiene.' }, { say: 'lila', text: 'Ya está. Ya está, pequeño. N-no pasa nada.' }] },
				{ text: 'Dejar que Lila lo haga sola.', then: [{ af: { lila: 1 } }, { text: 'Lila se arrodilla. Le tiemblan las manos, pero consigue que Riolu coma la baya.' }] },
			] },
			{ text: 'En el caos, el atril del profesor se ha volcado. Tres Poké Balls ruedan por el suelo y se abren.' },
			{ text: 'Un **Fennekin** sale disparado hacia el sur, envuelto en chispas de miedo. Un chico rubio de chaqueta blanca se lanza y atrapa al vuelo la Ball de **Froakie**. El profesor abraza la de **Chespin** contra el pecho.' },
			{ say: 'bastien', as: 'Chico rubio', text: '¡La tengo! ¡La tengo! …Ay. Creo que acabo de elegir inicial sin querer.' },
			{ set: { 'flag.b01_bastien_conocido': true } },
			{ text: 'Un hombre con gabardina, sombrero de reportero y un bigote que no parece suyo se agacha junto a ti. Mira a Riolu. Luego a la grieta, que se cierra con un chasquido.' },
			{ say: 'handsome', as: 'Reportero sospechoso', text: 'Interesante… Ese Riolu no es de aquí. Y te ha elegido a ti.' },
			{ say: 'handsome', as: 'Reportero sospechoso', text: 'Hmm. Handsome no cree en las casualidades. —Se le despega el bigote por un lado. Se lo vuelve a pegar—. Es decir. Este humilde periodista no cree en las casualidades. ¿Quién es Handsome? Ni idea.' },
			{ text: 'Unos guardias con uniforme azul y plata despejan la plaza. Un hombre de sonrisa perfecta da instrucciones por un megáfono: «¡Calma! ¡Un simple desajuste de calibración! ¡Todo está bajo control!»' },
			{ text: 'En el escenario, Serafina Lemnis habla por un auricular. No ha levantado la voz ni una sola vez.' },
			{ say: 'cipres', text: '¡Tú! Sí, tú, el del Riolu. Ven conmigo al laboratorio. Ese pequeño necesita que lo vean, y tú también, con esa cara.' },
			{ quest: 'b01_m1', stage: 'lab', silent: true },
			{ set: { 'flag.b01_m1_lab': true } },
			{ go: 'lab_cipres' },
			{ call: 'b01_lab' },
		],

		b01_lab: [
			{ text: 'El laboratorio del profesor Ciprés huele a café y a ozono. Una máquina escanea a Riolu con una luz verde mientras el profesor lee números en una pantalla.' },
			{ say: 'cipres', text: 'Esto es… fascinante. Y preocupante. Fascinante y preocupante. Mi combinación favorita.' },
			{ say: 'cipres', text: 'Por la composición del pelaje y el polvo de hierro que tiene en las patas, este Riolu viene de **Isla Hierro**, en Sinnoh. Al otro lado del mundo. Hace una hora estaba allí.' },
			{ say: 'cipres', text: 'Los Riolu de Isla Hierro son muy especiales: perciben el **aura**, las emociones y las intenciones de los seres vivos. Y no se acercan a cualquiera.' },
			{ say: 'cipres', text: 'Lo normal sería devolverlo a Sinnoh. Pero mira cómo te sigue con los ojos. No lo vas a separar de ti ni aunque quieras.' },
			{ say: 'cipres', text: 'Así que… ¿te lo quedas? Como entrenador{|a|e} del Circuito, quiero decir. Prometo no contárselo a la burocracia de Sinnoh.' },
			{ choice: [
				{ text: '«Me lo quedo. Es mi compañero.»', then: [{ happy: { who: 'riolu', n: 15 } }, { text: 'Riolu da un paso hacia ti. Luego otro. Luego se sienta a tus pies como si siempre hubiera estado ahí.' }] },
				{ text: '«Si él quiere, sí.»', then: [{ happy: { who: 'riolu', n: 20 } }, { text: 'Riolu te mira. Cierra los ojos un momento y su aura brilla, muy suave. Luego te da un toquecito en la rodilla con el puño. Eso es un sí.' }] },
			] },
			{ nickname: 'riolu' },
			{ say: 'cipres', text: 'Bien. Y como todo entrenador necesita una Pokédex… ¡aquí tienes! Viene con un **Rotom** dentro. Te ayudará a registrar lo que veas.' },
			{ give: 'pokeball', n: 5 },
			{ say: 'rotom', text: '¡Bzzt! ¡Hola, hola! Soy tu Rotom-Dex. Registro Pokémon, hago mapas y doy avisos. ¡Me alegra conocerte, {jugador}!' },
			{ say: 'cipres', text: 'Una cosa más. El **Fennekin** que huyó estaba asustadísimo. Lo vieron bajando por la **Ruta 4**, hacia Ciudad Novarte. Si lo ves… Fennekin no se deja atrapar por cualquiera, pero es muy listo. Sabrá en quién confiar.' },
			{ quest: 'b01_s_fennekin', stage: 'buscar' },
			{ text: 'Llaman a la puerta. Una mujer con cámara al hombro y libreta en la mano asoma la cabeza.' },
			{ say: 'alexia', text: 'Profesor, ¿puedo? Alexia, del *Diario de Luminalia*. —Te mira—. Y tú eres quien estaba delante de la grieta. ¿Tienes un minuto?' },
			{ say: 'alexia', text: 'Lemnis dice que fue «un desajuste de calibración». Tú lo viste de cerca. ¿Qué fue lo que pasó?' },
			{ choice: [
				{ text: '«Se abrió una grieta en el aire. Salieron Pokémon de otras regiones. No fue ningún desajuste.»', then: [
					{ set: { 'flag.b01_prensa_verdad': true } }, { rep: { lemnis: -5, policia: 3 } },
					{ say: 'alexia', text: 'Eso es exactamente lo que quería oír. Y exactamente lo que nadie quiere que publique. —Sonríe—. Lo publicaré.' },
				] },
				{ text: '«No lo sé. Fue todo muy rápido.»', then: [
					{ set: { 'flag.b01_prensa_neutral': true } },
					{ say: 'alexia', text: 'Es una respuesta honesta. Aburrida, pero honesta. Gracias.' },
				] },
				{ text: '«Un fallo técnico. Lemnis lo tiene controlado.»', then: [
					{ set: { 'flag.b01_prensa_lemnis': true } }, { rep: { lemnis: 5, policia: -2 } },
					{ say: 'alexia', text: '…Ya. Eso mismo dijo el señor del megáfono. Palabra por palabra. —Cierra la libreta despacio—. Gracias.' },
				] },
			] },
			{ say: 'alexia', text: 'Toma, por las molestias. Y por si vuelves a ponerte delante de grietas.' },
			{ give: 'potion', n: 3 },
			{ quest: 'b01_m1', done: true },
			{ go: 'luminalia_sur' },
			{ call: 'b01_recluta' },
		],

		b01_recluta: [
			{ text: 'Al salir del laboratorio, alguien te espera apoyado en una farola. El «reportero» de antes. Ya no lleva bigote.' },
			{ say: 'handsome', text: 'Hmm. No hace falta disimular más. Me llamo **Handsome**. Policía Internacional.' },
			{ say: 'handsome', text: 'Lemnis dice que lo de esta noche fue un fallo. Handsome tiene un olfato para los fallos, y esto no huele a fallo. Huele a algo que alguien no quiere que veamos.' },
			{ say: 'handsome', text: 'Vi a tu Riolu cuando la grieta se cerró. **Se giró hacia la Puerta un segundo antes del chasquido.** Antes que nadie. Antes que las máquinas de Lemnis. Percibe estas cosas. Las Fisuras, voy a llamarlas así.' },
			{ say: 'handsome', text: 'Te propongo algo: compite en el Circuito, viaja, gana medallas… y de paso, sé mis ojos. **Colaborador Especial** de la Policía Internacional. Yo te cubro los gastos. Dentro de lo razonable. Handsome no es rico.' },
			{ choice: [
				{ text: '«Cuenta conmigo.»', then: [{ rep: { policia: 3 } }, { say: 'handsome', text: '¡Así me gusta! Handsome tenía un buen presentimiento contigo.' }] },
				{ text: '«¿Y qué gano yo?»', then: [{ rep: { policia: 1 } }, { say: 'handsome', text: 'Directo al grano. Respeto eso. Toma: un adelanto para Poké Balls. No se lo cuentes a mi jefa.' }, { money: 1000 }] },
				{ text: '«No sé si quiero meterme en esto.»', then: [
					{ say: 'handsome', text: 'Ya estás metid{o|a|e}. Tienes un Riolu de Isla Hierro que salió de una grieta en el cielo. Lemnis va a querer saber dónde está. Mejor que lo sepa también alguien de tu lado.' },
					{ say: 'handsome', text: '…Y además ya imprimí la tarjeta. Con tu nombre. Mal escrito, pero con tu nombre.' },
				] },
			] },
			{ give: 'tarjetapi' },
			{ say: 'handsome', text: 'Si necesitas algo, la **Agencia de Detectives** está en el Bulevar Norte. La dirige mi jefa, Matière. Bueno, técnicamente yo le dejé la agencia. Ella dice que «técnicamente» no existe.' },
			{ say: 'handsome', text: 'Primer encargo: el rastro de la Fisura. Tu Riolu lo notará. Ve por la **Ruta 4**, hacia Novarte. Si ves algo raro, apúntalo. Si ves a Lemnis haciendo algo raro, apúntalo dos veces.' },
			{ set: { 'flag.b01_handsome_recluta': true } },
			{ quest: 'b01_m2', stage: 'ruta4' },
			{ cap: 15 },
			{ text: 'Handsome se cala el sombrero y desaparece entre la gente. Se le cae un guante. Vuelve a por él. Desaparece otra vez.' },
			{ say: 'rotom', text: '¡Bzzt! Consejo de Rotom: en el **Puesto del Circuito** te explican cómo funcionan las medallas. ¡Y en el Centro Pokémon curan gratis!' },
			{ save: true },
		],

		// =================== Plaza ===================
		b01_mirar_puerta: [
			{ if: '!flag.b01_handsome_recluta', then: [{ text: 'La Puerta está apagada. Solo zumba de vez en cuando, muy bajito.' }], else: [
				{ text: 'La Puerta Lemnis está apagada, rodeada de vallas. Unos técnicos con monos azules toman medidas sin mirar a nadie.' },
				{ if: 'inParty("riolu") || inParty("lucario")', then: [{ text: '{riolu} se pega a tus piernas y gruñe muy bajito hacia el arco. No le gusta ese sitio.' }] },
				{ if: 'has("lenteaura")', then: [{ text: 'Miras con la Lente de Aura. En el centro del arco hay una cicatriz violeta en el aire, como una costura mal hecha. Todavía está ahí.' }] },
			] },
		],
		b01_guardia_plaza: [
			{ say: 'guardia_lemnis', text: 'Circule, por favor. Zona de mantenimiento. No hay nada que ver.' },
			{ if: 'flag.b01_prensa_lemnis', then: [{ say: 'guardia_lemnis', text: '…Ah, usted. L{o|a|e} vi en las noticias. «Lemnis lo tiene controlado». Gracias por mantener la calma. La empresa lo agradece.' }] },
			{ if: 'flag.b01_prensa_verdad', then: [{ say: 'guardia_lemnis', text: '…Usted es quien le habló de «grietas» a la prensa. Circule. Ahora.' }] },
		],
		b01_lucien_1: [
			{ say: 'lucien', text: '¡Oye! ¿Tú estabas en la inauguración? ¿Viste la grieta de cerca? ¿Era violeta-violeta o violeta-morada? ¡En la tele no se veía bien!' },
			{ say: 'lucien', text: 'Yo me llamo Lucien. ¡De mayor voy a viajar por todas las Puertas! Kanto, Galar, Alola… ¡A todas! Bueno, primero tengo que tener un Pokémon. Mi mamá dice que cuando tenga doce. Tengo doce. Ella dice que «doce de verdad».' },
			{ say: 'lucien', text: '¿Y tú cómo te llamas? …¡{jugador}! Me lo apunto. Cuando seas famos{o|a|e}, diré que te conocí en la valla.' },
			{ set: { 'flag.b01_lucien_1': true } },
		],
		b01_lucien_3: [
			{ if: 'flag.b01_lucien_gorra', then: [
				{ say: 'lucien', text: '¡{jugador}! ¡Mira mi gorra! Sigue oliendo a chimenea. Mi madre quiere lavarla. No la dejo. Es una prueba científica.' },
			], else: [
				{ say: 'lucien', text: '¡{jugador}! Hoy he contado los técnicos de la Puerta: once. Ayer eran nueve. Eso quiere decir algo. No sé qué, pero algo.' },
			] },
		],
		b01_lucien_2: [
			{ say: 'lucien', text: '¡Eh! ¡Eh! ¡Mira, mira! ¡El profesor Ciprés me dio a **Chespin**! Dice que se quedó sin entrenador después del lío de la Puerta. ¡Ahora es mío! ¡Bueno, somos compañeros! ¡Él dice que no es de nadie!' },
			{ say: 'lucien', text: 'Cuando abran la Puerta otra vez, Chespin y yo vamos a ser los primeros en cruzar. ¡Ya verás!' },
		],

		// =================== Bulevar Sur ===================
		b01_empleado_liga: [
			{ say: 'empleado_liga', text: '¡Bienvenid{o|a|e} al Circuito Infinito! ¿Necesitas que te explique cómo funciona?' },
			{ choice: [
				{ text: 'Sí, explícame.', then: [
					{ say: 'empleado_liga', text: 'El Circuito se juega por **Temporadas**. En cada temporada necesitas **8 medallas de Circuito**, ganadas en gimnasios de cualquier región, para entrar en la **Copa Infinita**.' },
					{ say: 'empleado_liga', text: 'Y gracias al **Programa de Intercambio**, los líderes rotan entre regiones. ¡Por eso ahora mismo en Ciudad Novarte está **Brock**, de Kanto! El gimnasio más cercano.' },
					{ say: 'empleado_liga', text: 'Consejo: en tu **Guía de Retos** (menú «Más») verás lo que sabes de cada líder. Y si hablas con la gente antes de entrar al gimnasio, sabrás más.' },
					{ set: { 'flag.b01_sabe_circuito': true } },
				] },
				{ text: 'No, gracias.', then: [{ say: 'empleado_liga', text: '¡Mucha suerte! ¡Un mundo, una liga!' }] },
			] },
			{ if: 'badges == 1', then: [
				{ say: 'empleado_liga', text: '¡Ya tienes tu primera medalla! ¡Genial! El siguiente gimnasio del Circuito en Kalos está en **Ciudad Relieve**, en la costa oeste.' },
				{ say: 'empleado_liga', text: 'Se llega por la Ruta 5… cuando Lemnis quite las vallas. Dicen que es cuestión de días.', cond: '!flag.b01_ruta5_abierta' },
				{ say: 'empleado_liga', text: 'Se va por la Ruta 5, hacia el oeste, y luego siguiendo la costa. Es un buen paseo. Lleva Pociones.', cond: 'flag.b01_ruta5_abierta' },
			] },
			{ if: 'badges >= 2', then: [{ say: 'empleado_liga', text: '¡Dos medallas o más! El siguiente gimnasio es el de **Ciudad Yantra**, al norte. Con tres medallas, dicen que viene una sorpresa. A mí no me cuentan nada.' }] },
		],

		// =================== Laboratorio ===================
		b01_cipres_generico: [
			{ say: 'cipres', text: 'Estoy estudiando los datos de la Fisura. Por cierto, ¿has notado algo raro en tu Riolu? Más energía, brillos azules, ganas repentinas de meditar…' },
			{ if: 'flag.b01_palmeo', then: [{ say: 'cipres', text: '¿Aprendió **Palmeo** él solo, en plena ruta? Hmm. Los Riolu de Isla Hierro despiertan su aura cuando se sienten responsables de alguien. Te ha adoptado, {jugador}.' }] },
			{ say: 'cipres', text: 'Un consejo de profesor: hablar con la gente es la mitad de una investigación. La otra mitad es el café.' },
		],
		b01_cipres_fennekin: [
			{ if: 'flag.b01_fennekin_unido', then: [
				{ say: 'cipres', text: '¡Fennekin! ¡Está bien! Y… se queda contigo, ¿eh? Lo veo en cómo te mira.' },
				{ say: 'cipres', text: 'Es suyo, entrenador{|a|e}. Fennekin eligió, y yo no le llevo la contraria a un zorro de fuego. Toma, para que les vaya bien.' },
			], else: [
				{ say: 'cipres', text: '¿Lo dejaste ir libre? Hmm. Hiciste lo que te pareció mejor para él, y eso dice mucho de ti.' },
				{ say: 'cipres', text: 'Los guardabosques lo trajeron hace un rato. Está aquí, en el laboratorio, mucho más tranquilo. Si algún día quieres llevártelo, pídemelo.' },
			] },
			{ give: 'pokeball', n: 5 }, { give: 'sitrusberry' },
			{ say: 'cipres', text: 'Ah, y Chespin ya tiene entrenador: un niño muy… enérgico que no se iba de la valla de la Puerta. Lucien. Ya lo conocerás, si no lo conoces ya. Es imposible no conocerlo.' },
			{ set: { 'flag.b01_lucien_chespin': true } },
			{ quest: 'b01_s_fennekin', done: true },
		],
		b01_cipres_pedir_fennekin: [
			{ say: 'cipres', text: 'Lo trajo tu amiga de Galar, la pelirroja. Me explicó el rescate con una pizarra y tácticas de fútbol. No entendí nada, pero fue precioso.', cond: 'flag.b01_fennekin_rhi' },
			{ say: 'cipres', text: 'Fennekin se pasa el día mirando por la ventana. Creo que espera a alguien. Creo que te espera a ti. ¿Te lo llevas?' },
			{ choice: [
				{ text: 'Llevarme a Fennekin.', then: [{ pokemon: { sp: 'fennekin', lv: 10, nature: 'modest', ability: 'blaze', happy: 120 } }, { set: { 'flag.b01_fennekin_pedido': true, 'flag.b01_fennekin_unido': true } }] },
				{ text: 'Todavía no.', then: [{ say: 'cipres', text: 'Aquí estará. Comiendo de más.' }] },
			] },
		],
		b01_cipres_mega: [
			{ if: 'has("megaring")', then: [
				{ say: 'cipres', text: '¡Tres medallas! Y esa pulsera… ¿la Megaevolución? ¿En la Torre Maestra? Mi especialidad. Cuéntamelo TODO. Con detalles. Con gráficas, si es posible.' },
			], else: [
				{ say: 'cipres', text: '¡Tres medallas! Si ya has vencido a Corelia, sube a la Torre Maestra. Cornelio no le enseña la Megaevolución a cualquiera… pero a ti y a ese Riolu, sospecho que sí.' },
			] },
		],

		// =================== Agencia ===================
		b01_agencia_1: [
			{ text: 'Una mujer joven de pelo naranja levanta la vista de un montón de papeles. Handsome está de pie a su lado, intentando parecer imprescindible.' },
			{ say: 'matiere', text: 'Tú eres {jugador}. Handsome no ha parado de hablar de ti. Y de tu Riolu. Sobre todo de tu Riolu. Soy Matière, la jefa de esto.' },
			{ say: 'handsome', text: 'Técnicamente…' },
			{ say: 'matiere', text: '«Técnicamente» no existe, Handsome. Siéntate.' },
			{ say: 'matiere', text: 'Bueno. Al grano. Desde la inauguración, Lemnis «recoge» Pokémon desplazados por toda Kalos. Dicen que los devuelven a sus regiones. Pero no hay ni un solo registro de que alguno haya vuelto.' },
			{ say: 'handsome', text: 'Mis contactos en Johto y Galar dicen lo mismo: no ha llegado nada. Ni un Wooloo. Ni un Mareep.' },
			{ say: 'matiere', text: 'Lemnis te ha invitado a sus oficinas. A ti. Quieren conocer a «la cara de la inauguración». —Pone los ojos en blanco—. Ve. Sonríe. Y fíjate en todo.', cond: '!flag.b01_diario' },
			{ say: 'matiere', text: 'Y por lo que veo, ya has pasado por sus oficinas. Rouxel lleva dos días presumiendo de ti en la radio. —Pone los ojos en blanco—. Bien. Sigue mirando. Sobre todo en la Ruta 5.', cond: 'flag.b01_diario' },
			{ say: 'handsome', text: 'Y una cosa más: Matière también tiene casos más… mundanos. La agencia tiene que pagar el alquiler.' },
			{ say: 'matiere', text: 'Ahí lo tienes: alguien robó el macaron especial de la dueña del **Café Soleil**. Tres sospechosos. La dueña está fuera de sí. Es un caso perfecto para empezar. Y la dueña paga en macarons.' },
			{ set: { 'flag.b01_agencia_1': true } },
			{ quest: 'b01_m2', stage: 'lemnis', cond: '!flag.b01_diario' },
			{ quest: 'b01_t_agencia', stage: 'macaron' },
		],
		b01_agencia_recordar: [
			{ say: 'matiere', text: 'El caso del macaron sigue abierto. Ve al **Café Soleil**, habla con los sospechosos y busca la contradicción. Siempre hay una.' },
		],
		b01_agencia_premio: [
			{ say: 'matiere', text: '¡La dueña del café está encantadísima! Dice que eres «un genio con la mirada de un halcón». Exagera. Pero solo un poco.' },
			{ say: 'handsome', text: 'Handsome lo supo desde el primer momento.' },
			{ say: 'matiere', text: 'Handsome sospechaba del Furfrou de la mesa cuatro.' },
			{ say: 'handsome', text: '…Era un Furfrou muy sospechoso.' },
			{ give: 'rarecandy' }, { rep: { policia: 2 } },
			{ set: { 'flag.b01_agencia_macaron_premio': true } },
			{ quest: 'b01_t_agencia', stage: 'resuelto' },
			{ say: 'matiere', text: 'Habrá más casos. Siempre los hay. Pásate de vez en cuando.' },
		],
		b01_agencia_generico: [
			{ if: '!flag.b01_agencia_1', then: [
				{ say: 'matiere', text: 'Hola. Handsome me habló de ti. Ahora mismo no hay nada que hacer aquí: ve a por tu primera medalla y vuelve. Para entonces tendremos trabajo. Siempre hay trabajo.' },
			], else: [
				{ say: 'matiere', text: 'Sin novedades por aquí. Handsome está «investigando». Es decir: se está probando sombreros.' },
				{ if: 'flag.b01_handsome', then: [{ say: 'handsome', text: 'Lo de Crómlech queda entre nosotros, {jugador}. Handsome no olvida a quien sabe guardar un secreto.' }] },
				{ if: 'flag.b01_delatar', then: [{ say: 'matiere', text: 'Alexia publicó lo de Crómlech. Lemnis está furiosa. Handsome está encantado. Yo estoy… cansada.' }] },
				{ if: 'flag.b01_trato_sera', then: [{ say: 'handsome', text: '…Hmm. Sé lo del trato con la señorita Lemnis, {jugador}. No digo nada. Pero Handsome tiene buena memoria.' }] },
			] },
		],

		// =================== Café Soleil: caso del macaron ===================
		b01_caso_macaron: [
			{ text: 'La dueña del café, Madame Colette, te recibe con los ojos llorosos y un pañuelo de encaje.' },
			{ say: null, text: '«¡Mi macaron de rosa y Baya Frambu! ¡El de la vitrina! ¡Lo preparo una vez al año para el aniversario del café! Esta mañana estaba ahí. A mediodía, ¡pff! Desaparecido. Solo tres personas pasaron por detrás del mostrador.»' },
			{ text: 'Hablas con los tres sospechosos.' },
			{ text: '**Pierre, el camarero:** «Yo estuve toda la mañana en la terraza. Ni me acerqué a la vitrina. Pregunte a los clientes.» Tiene la camisa blanca impecable.' },
			{ text: '**Mireille, la repostera:** «Yo hice el macaron, ¿por qué iba a robarlo? Además, a mediodía estaba en la cocina, sacando las tartas del horno. Mire, todavía tengo las manos llenas de harina.»' },
			{ text: '**Hugo, el repartidor:** «Dejé las cajas de leche por la puerta de atrás y me fui. No vi ningún macaron. No me gustan los dulces. De verdad, no me gustan.» Huele mucho a perfume de rosas.' },
			{ text: 'Miras la vitrina. En el cristal, a la altura del macaron, hay una huella pequeña con restos de algo rosa. En el suelo, junto a la puerta de atrás, unas migas rosas.' },
			{ prompt: '¿Quién se llevó el macaron?', choice: [
				{ text: 'Pierre, el camarero.', then: [{ call: 'b01_macaron_mal' }] },
				{ text: 'Mireille, la repostera.', then: [{ call: 'b01_macaron_mal' }] },
				{ text: 'Hugo, el repartidor.', then: [{ call: 'b01_macaron_hugo' }] },
			] },
		],
		b01_macaron_mal: [
			{ text: 'Lo dices en voz alta. El acusado te mira ofendido. Madame Colette también.' },
			{ text: 'Algo no encaja. Repasas lo que te dijeron… ¿Quién dijo algo que nadie le había preguntado? ¿Y quién huele a rosas?' },
			{ choice: [
				{ text: 'Volver a pensarlo.', then: [{ call: 'b01_caso_macaron' }] },
				{ text: 'Dejarlo para luego.', then: [] },
			] },
		],
		b01_macaron_hugo: [
			{ text: '«Hugo», dices. «Dijo que no le gustan los dulces dos veces, aunque nadie se lo preguntó. Y huele a rosas: el macaron era de rosa. Las migas están en la puerta de atrás… por donde dejó las cajas.»' },
			{ text: 'Hugo se pone pálido. Luego rojo. Luego rosa, curiosamente a juego con el macaron.' },
			{ say: null, text: '«¡Ya! ¡Ya! ¡Me lo comí! ¡Es que olía tan bien! ¡Llevo seis años repartiendo leche aquí y nunca me han dado ni uno! ¡Ni UNO!»' },
			{ text: 'Madame Colette se lo piensa un momento. Luego le da un macaron. Uno normal. Hugo llora un poco.' },
			{ text: 'Mireille te guiña un ojo. Pierre aplaude despacio desde la terraza.' },
			{ set: { 'flag.b01_macaron_resuelto': true } },
			{ toast: 'Caso resuelto. Vuelve a la Agencia.' },
		],
		b01_renata_1: [
			{ text: 'Una chica de rizos castaños y gafas redondas habla sola delante de un micrófono, en la mesa del fondo. Al verte, se le iluminan los ojos.' },
			{ say: 'renata', as: 'Chica del micrófono', text: '¡Tú! Tú eres quien vio la Fisura de cerca. Y quien acaba de resolver lo del macaron delante de todo el café. Nota para el episodio: el testigo parece más joven de lo que esperaba. Cool, cool, cool.' },
			{ say: 'renata', text: 'Renata Castellanos. Hago un pódcast: **«Casos Fríos de Teselia»**. Bueno, hoy es «Casos Calientes de Kalos», especial de viaje. ¿Me das una declaración? Diez segundos. Cinco. Una palabra.' },
			{ choice: [
				{ text: '«Una palabra: macaron.»', then: [{ af: { renata: 3 } }, { say: 'renata', text: '¡Ja! Perfecta. Eso va al principio del episodio. Eres buen material, ¿lo sabías?' }] },
				{ text: '«Lemnis está ocultando algo.»', then: [{ af: { renata: 2 } }, { rep: { lemnis: -1 } }, { say: 'renata', text: '…Eso ya lo sé. Por eso estoy en Kalos. Pero gracias por decirlo en voz alta. Me hacía falta una segunda voz.' }] },
				{ text: '«Sin comentarios.»', then: [{ say: 'renata', text: '«Sin comentarios», la frase favorita de los culpables y de los aburridos. Y no pareces aburrid{o|a|e}.' }] },
			] },
			{ say: 'renata', text: 'Te cuento por qué estoy aquí, gratis, porque me caes bien: sigo un caso viejo. Muy viejo. Empieza mucho antes de esa Puerta. Y no, no te voy a contar más. Los buenos episodios se cuentan en dos partes.' },
			{ say: 'renata', text: 'Toma mi tarjeta. Si Lemnis te da miedo, llámame. Si no te da miedo, llámame también, para saber por qué.' },
			{ say: 'renata', text: 'Ah, y si te cruzas con mi productor, Simón, dile que no he gastado todo el presupuesto en macarons. Es mentira. Pero díselo.' },
			{ set: { 'flag.b01_renata_1': true } },
			{ intel: { npc: 'renata', text: 'Pódcaster de Teselia. Sigue un caso viejo, de antes de la Puerta, que no quiso contar. Te dio su tarjeta.' } },
		],

		// =================== Café Soleil: Gaspar y Philippe ===================
		b01_gaspar_1: [
			{ text: 'Un hombre corpulento con pañuelo en la cabeza y delantal blanco mira un macaron a contraluz. Lo muerde. Mastica despacio. Suspira.' },
			{ say: 'gaspar', as: 'Chef', text: 'Técnicamente perfecto. Le falta valentía.' },
			{ say: 'gaspar', text: 'Gaspar Rocafort. Cocino por el camino. Cocino con lo que el camino me da. Comer bien es la mitad de la aventura, ¿no crees?' },
			{ say: 'gaspar', text: 'Una vez cociné algo en una mazmorra de Teselia que… bueno. Nadie se atreve a preguntar qué era. Tú tampoco preguntes.' },
			{ say: 'gaspar', text: 'Estoy preparando un **Menú de Kalos** para mi recetario. Me faltan tres cosas: **Miel** de los Combee de la Ruta 4, una **Miniseta** de algún bosque y una **Baya Meloc**. Si me las traes, te invito. Estaré por la **Ruta 7**, junto al río. Allí se cocina mejor.' },
			{ set: { 'flag.b01_gaspar_1': true, 'flag.b01_gaspar_cafe': true } },
			{ quest: 'b01_t_gaspar', stage: 'ingredientes' },
		],
		b01_gaspar_cafe: [
			{ say: 'gaspar', text: 'Aquí el café es bueno, pero me voy a la Ruta 7 a cocinar. Búscame junto al río.' },
		],
		b01_philippe_1: [
			{ say: 'philippe', text: '¡Hola, hola! ¿Te gustan los pisos con vistas? ¿Y la magia? ¡Mira! Elige una carta. Cualquiera. No me la enseñes.' },
			{ text: 'Eliges una carta. El tres de Poké Balls. Philippe cierra los ojos, se concentra… y se le cae otra carta de la manga.' },
			{ say: 'philippe', text: '¡El as de Corazones! ¿No? Bueno. Esa no era. Un clásico. La magia es así: a veces la magia eres tú.' },
			{ say: 'philippe', text: 'Philippe Dumont, agente inmobiliario. Lo de la magia es un hobby. El problema es que mi **baraja de la suerte**, la buena, me la robó un Pancham en la **Ruta 5** mientras enseñaba un chalet. ¡En pleno cierre de venta! Si la encuentras, te deberé una. O un piso. Un piso pequeño. Una plaza de garaje.' },
			{ set: { 'flag.b01_philippe_1': true } },
			{ quest: 'b01_s_philippe', stage: 'buscar' },
		],
		b01_philippe_vuelta: [
			{ take: 'barajasuerte' },
			{ say: 'philippe', text: '¡MI BARAJA! ¡Con su olor a Pancham y todo! ¡Gracias, gracias, gracias! Mira, mira, elige una carta…' },
			{ text: 'Eliges una. Philippe adivina… la equivocada. Otra vez. Pero esta vez se ríe tan fuerte que acabas riéndote tú también.' },
			{ say: 'philippe', text: '¿Ves? La magia eres tú. Phil-osofía pura. Toma: una **Bola de Humo**, para salir de los sitios igual que yo salgo de las reuniones con el banco.' },
			{ give: 'smokeball' }, { money: 1500 },
			{ say: 'philippe', text: 'Y si algún día necesitas casa en Luminalia… ya sabes a quién llamar. Tengo un estudio con vistas a la Torre. Bueno, vistas a la pared que tiene vistas a la Torre.' },
			{ quest: 'b01_s_philippe', done: true },
		],
		b01_philippe_generico: [
			{ say: 'philippe', text: '¿Otra carta? ¿No? ¿Seguro? Esta vez lo adivino. Esta vez sí.' },
		],

		// =================== Lemnis: el Módulo Diario ===================
		b01_lemnis_visita: [
			{ text: 'La recepcionista sonríe al verte. Sonríe mucho. Te pide que esperes.' },
			{ text: 'Al rato aparece el hombre del megáfono de la inauguración: traje impecable, corbata roja y unos dientes que podrían usarse como espejo.' },
			{ say: 'rouxel', text: '¡{jugador}! ¡La cara de la inauguración! Fabien Rouxel, director de Lemnis Kalos. Qué placer. Qué placer de verdad.' },
			{ if: 'flag.b01_prensa_verdad', then: [{ say: 'rouxel', text: 'Leí tus declaraciones en el *Diario de Luminalia*. Muy… sinceras. Nos encanta la sinceridad. Hablemos de cómo canalizarla.' }] },
			{ if: 'flag.b01_prensa_lemnis', then: [{ say: 'rouxel', text: 'Y gracias por tus palabras a la prensa. «Lemnis lo tiene controlado». Lo hemos enmarcado. Literalmente: está en mi despacho.' }] },
			{ say: 'rouxel', text: 'Pasemos a la sala de reuniones. Ah, una formalidad: dentro **no se permiten dispositivos de grabación**. Tu Pokédex se queda aquí, en recepción. Política de la empresa.' },
			{ say: 'rotom', text: '¡Bzzt! ¿Me dejan solo? ¡Qué aburrido! Bueno. Te espero. Contaré las baldosas.' },
			{ text: 'La sala de reuniones tiene una mesa de cristal y una vista enorme de la Torre Prisma. Hay un hombre mayor esperando: cárdigan, gafas de media luna y una corbata azul con un nudo un poco torcido. Te ofrece un caramelo de menta.' },
			{ say: 'ansel', text: 'Ansel Moreau. Dirijo el departamento de Investigación. No te asustes por el título: la mitad del tiempo dirijo hojas de cálculo.' },
			{ say: 'ansel', text: 'Tu Riolu me fascina. Un Riolu de Isla Hierro que cruzó una Fisura y eligió a un humano en menos de un minuto. Si fuera un dato, sería el dato más interesante del año.' },
			{ say: 'rouxel', text: 'Queremos que seas embajador{|a|e} del Circuito. Tu cara en los carteles. Un patrocinio generoso. Lemnis cuida de los suyos.' },
			{ choice: [
				{ text: '«Me lo pensaré.»', then: [{ say: 'rouxel', text: '¡Claro, claro! Las mejores decisiones se piensan. Y luego se firman.' }] },
				{ text: '«No me interesa ser la cara de nadie.»', then: [{ rep: { lemnis: -2 } }, { say: 'rouxel', text: '…Por supuesto. —La sonrisa no se mueve, pero algo detrás de ella sí.' }] },
				{ text: '«¿Adónde llevan a los Pokémon desplazados?»', then: [
					{ rep: { lemnis: -2, policia: 2 } },
					{ say: 'rouxel', text: 'A casa, por supuesto. A sus regiones. Es un proceso delicado.' },
					{ say: 'ansel', text: 'Muy delicado. Cruzar una Puerta tiene un coste energético que todavía estamos aprendiendo a calcular. Pero llegaremos. Los datos no mienten; se equivocan los que los leen.' },
					{ set: { 'flag.b01_ansel_frase': true } },
				] },
			] },
			{ if: '!flag.b01_ansel_frase', then: [{ say: 'ansel', text: 'Ten paciencia con nosotros. Esto es nuevo para todos. Y como digo siempre: los datos no mienten; se equivocan los que los leen.' }] },
			{ set: { 'flag.b01_ansel_frase': true } },
			{ text: 'De vuelta en recepción, Rotom te recibe dando vueltas de alegría. El doctor Moreau te acompaña hasta la puerta.' },
			{ say: 'ansel', text: 'Un momento. ¿Esa Pokédex lleva un Rotom de serie? ¡Qué maravilla! ¿Sabes? Mi equipo ha desarrollado un pequeño módulo para estos aparatos: un **Diario de Viaje**. El Rotom escribe lo que vivís juntos, para que no se te olvide nada.' },
			{ say: 'rotom', text: '¡Bzzt! ¿Un diario? ¿Para mí? ¿Puedo escribir cosas? ¿Cosas bonitas? ¡Quiero! ¡Quiero, quiero, quiero!' },
			{ choice: [
				{ text: '«Si Rotom quiere, adelante.»', then: [] },
				{ text: '«Prefiero que no.»', then: [
					{ say: 'rotom', text: '¡Bzzt! ¡Porfa! ¡Porfa, porfa! ¡Nunca he tenido un diario! ¡Prometo escribir con buena letra!' },
					{ text: 'Rotom pone la cara más triste que puede poner una Pokédex. Acabas cediendo.' },
				] },
			] },
			{ text: 'El doctor Moreau conecta un cable diminuto, teclea algo y le da a Rotom una palmadita en la carcasa, como a un nieto.' },
			{ say: 'ansel', text: 'Listo. Que lo disfrutes, pequeño. Y tú, {jugador}… buen viaje.' },
			{ set: { 'flag.b01_diario': true } },
			{ quest: 'b01_m2', stage: 'ruta5' },
			{ set: { 'flag.b01_ruta5_abierta': true } },
			{ say: 'rotom', text: '¡Bzzt! ¡Ya tengo diario! Lo verás en el **Diario**, en la pestaña «Diario de Rotom». ¡Voy a escribir mi primera entrada AHORA MISMO!' },
			{ diary: 'Hoy mi entrenador{|a|e} y yo fuimos a las oficinas de Lemnis. Yo me quedé en recepción (¡qué aburrido! Conté doscientas doce baldosas), y {jugador} estuvo un buen rato en una sala con el señor Rouxel y con el doctor Moreau, el de la corbata azul de siempre. El doctor dijo algo que me gustó mucho: «Los datos no mienten; se equivocan los que los leen». Creo que vamos a ser buenos amigos. ¡Ah! Y me regaló este diario. ¡Es el mejor día de mi vida!' },
			{ say: 'rotom', text: '¡Bzzt! Por cierto, ya puedes ir por la **Ruta 5**, al oeste de la ciudad. ¡Lemnis ha quitado las vallas!' },
		],
		b01_lemnis_recepcion: [
			{ say: null, text: 'La recepcionista sonríe: «El señor Rouxel está reunido. El doctor Moreau ha vuelto a la sede central. ¿Le dejo un mensaje? ¿No? ¡Que tenga un día maravilloso!»' },
		],
	},
};
