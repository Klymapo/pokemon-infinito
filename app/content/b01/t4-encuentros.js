// Bloque 1 · Tramo 4: Encuentros. Escenas cortas que hacen reaparecer a los NPCs por Kalos
// (antes y después de cada medalla) y presentan a tres personajes nuevos con hilos abiertos.
// Todo se añade como spots condicionados en lugares ya publicados: no cambia nada de lo anterior.
// Cada escena sale una vez (flag b01_enc_*) y se marca como novedad con `new`.
export default {
	// =====================================================================
	// SPOTS NUEVOS EN LUGARES YA PUBLICADOS
	// =====================================================================
	extraSpots: {
		// ---------- Luminalia ----------
		luminalia_plaza: [
			{ label: 'Alguien en un tejado', sub: 'Una silueta con capucha mira la Puerta', icon: '🪶', cond: 'flag.b01_diario && !flag.b01_enc_ysolde_1', new: '!flag.b01_enc_ysolde_1', talk: [{ script: 'b01_enc_ysolde_1' }] },
			{ label: 'Lucien y Chespin', sub: 'Con una libreta llena de horas', icon: '📓', cond: 'flag.b01_lucien_chespin && badges >= 2 && !flag.b01_enc_lucien_1', new: '!flag.b01_enc_lucien_1', talk: [{ script: 'b01_enc_lucien_1' }] },
			{ label: 'Un ranchero frente a la Puerta', sub: 'Con el sombrero en la mano', icon: '🤠', cond: 'done.b01_t_mareep && badges >= 2 && !flag.b01_enc_aurelio_1', new: '!flag.b01_enc_aurelio_1', talk: [{ script: 'b01_enc_aurelio_1' }] },
		],
		luminalia_sur: [
			{ label: 'Un rodaje de Lemnis', sub: 'Focos, cámaras y una sonrisa enorme', icon: '🎬', cond: 'flag.b01_diario && !flag.b01_cromlech_hecha && !flag.b01_enc_rouxel_1', new: '!flag.b01_enc_rouxel_1', talk: [{ script: 'b01_enc_rouxel_1' }] },
			{ label: 'Un oficinista en el quiosco', sub: 'Pregunta por «artículos de héroe»', icon: '🦸', cond: 'done.b01_t_hector && !flag.b01_enc_hector_1', new: '!flag.b01_enc_hector_1', talk: [{ script: 'b01_enc_hector_1' }] },
		],
		agencia: [
			{ label: 'Un inspector en la puerta', sub: 'Traje gris y una carpeta muy gorda', icon: '🗂️', cond: 'flag.b01_agencia_1 && !flag.b01_enc_lebrun_1', new: '!flag.b01_enc_lebrun_1', talk: [{ script: 'b01_enc_lebrun_1' }] },
		],
		lab_cipres: [
			{ label: 'Una visita en el laboratorio', sub: 'Un señor mayor con cárdigan', icon: '🍬', cond: 'flag.b01_diario && !flag.b01_enc_ansel_1', new: '!flag.b01_enc_ansel_1', talk: [{ script: 'b01_enc_ansel_1' }] },
		],
		cafe_soleil: [
			{ label: 'Un señor con un crucigrama', sub: 'Gafas de media luna y un café con leche', icon: '✏️', cond: 'badges >= 2 && flag.b01_diario && !flag.b01_enc_ansel_2', new: '!flag.b01_enc_ansel_2', talk: [{ script: 'b01_enc_ansel_2' }] },
		],
		lemnis_kalos: [
			{ label: 'El director, al teléfono', sub: 'Se oye a través de la puerta', icon: '📞', cond: 'flag.b01_cromlech_hecha && !flag.b01_enc_rouxel_2', new: '!flag.b01_enc_rouxel_2', talk: [{ script: 'b01_enc_rouxel_2' }] },
		],

		// ---------- Novarte y Acuarela ----------
		novarte: [
			{ label: 'Philippe, con un cartel de «SE VENDE»', sub: 'Delante de una casita con jardín', icon: '🏡', cond: 'done.b01_s_philippe && !flag.b01_enc_philippe_1', new: '!flag.b01_enc_philippe_1', talk: [{ script: 'b01_enc_philippe_1' }] },
		],
		acuarela: [
			{ label: 'Una cabina azul en el prado', sub: 'Ayer no estaba ahí', icon: '🟦', cond: 'flag.b01_handsome_recluta && !flag.b01_enc_viajero_1', new: '!flag.b01_enc_viajero_1', talk: [{ script: 'b01_enc_viajero_1' }] },
		],

		// ---------- Vánitas, Cénit ----------
		vanitas: [
			{ label: 'Noa, en la puerta del Centro', sub: 'Habla por teléfono, muy seria', icon: '📋', cond: 'flag.b01_bastien_ruta5 && !flag.b01_enc_noa_1', new: '!flag.b01_enc_noa_1', talk: [{ script: 'b01_enc_noa_1' }] },
		],
		castillo_caduco: [
			{ label: 'Un ruido de aspiradora', sub: 'Viene del pasillo del ala norte', icon: '🌀', cond: 'badges >= 1 && !date("10-24", "10-31") && !flag.b01_enc_gadd_1', new: '!flag.b01_enc_gadd_1', talk: [{ script: 'b01_enc_gadd_1' }] },
		],
		palacio_cenit: [
			{ label: 'Alguien perdido en el laberinto', sub: 'Una bufanda larguísima asoma entre los setos', icon: '🧣', cond: 'badges >= 1 && !flag.b01_enc_viajero_2', new: '!flag.b01_enc_viajero_2', talk: [{ script: 'b01_enc_viajero_2' }] },
		],

		// ---------- Petroglifo ----------
		petroglifo: [
			{ label: 'Gritos en las rocas de la playa', sub: '«¡Cuidado, cuidado, CUIDADO!»', icon: '🦴', cond: '!flag.b01_enc_petra_1', new: '!flag.b01_enc_petra_1', talk: [{ script: 'b01_enc_petra_1' }] },
		],
		lab_fosiles: [
			{ label: 'Petra y el Dr. Lazare', sub: 'Discuten delante de la máquina', icon: '🔬', cond: 'flag.b01_enc_petra_1 && !flag.b01_enc_petra_2', new: '!flag.b01_enc_petra_2', talk: [{ script: 'b01_enc_petra_2' }] },
		],

		// ---------- Relieve ----------
		relieve: [
			{ label: 'Una mujer de pelo rosa en la tienda', sub: 'En «Piedras y Fósiles»', icon: '🥽', cond: 'flag.b01_cueva_flare_hecha && !flag.b01_cromlech_hecha && !flag.b01_enc_melia_1', new: '!flag.b01_enc_melia_1', talk: [{ script: 'b01_enc_melia_1' }] },
			{ label: 'El inspector de la carpeta', sub: 'Toma notas junto al Centro Pokémon', icon: '🗂️', cond: 'flag.b01_cueva_flare_hecha && !flag.b01_enc_lebrun_2', new: '!flag.b01_enc_lebrun_2', talk: [{ script: 'b01_enc_lebrun_2' }] },
			{ label: 'Una pluma clavada en una nota', sub: 'En la puerta de tu habitación del Centro', icon: '🪶', cond: 'flag.b01_cueva_flare_hecha && !flag.b01_enc_ysolde_2', new: '!flag.b01_enc_ysolde_2', talk: [{ script: 'b01_enc_ysolde_2' }] },
			{ label: 'Noa, sentada en un banco', sub: 'Mira un folleto sin leerlo', icon: '📄', cond: 'badges >= 2 && flag.b01_bastien_ruta5 && !flag.b01_enc_noa_2', new: '!flag.b01_enc_noa_2', talk: [{ script: 'b01_enc_noa_2' }] },
			{ label: 'Renata, al pie del muro', sub: 'Graba a los escaladores', icon: '🎙️', cond: 'flag.b01_renata_1 && !flag.b01_enc_renata_1', new: '!flag.b01_enc_renata_1', talk: [{ script: 'b01_enc_renata_1' }] },
		],

		// ---------- Crómlech ----------
		cromlech: [
			{ label: 'Alguien sentado en lo alto del menhir', sub: 'Las piernas colgando. La capucha puesta', icon: '🪶', cond: 'flag.b01_cromlech_hecha && !flag.b01_enc_ysolde_3', new: '!flag.b01_enc_ysolde_3', talk: [{ script: 'b01_enc_ysolde_3' }] },
			{ label: 'Una paleontóloga con un Diggersby', sub: 'Excava fuera de las vallas', icon: '⛏️', cond: 'flag.b01_enc_petra_2 && badges >= 2 && !flag.b01_enc_petra_3', new: '!flag.b01_enc_petra_3', talk: [{ script: 'b01_enc_petra_3' }] },
		],

		// ---------- Yantra ----------
		yantra: [
			{ label: 'Una cabina azul en el muelle', sub: 'Con la marea baja, en mitad de la arena', icon: '🟦', cond: 'badges >= 3 && !flag.b01_enc_viajero_3', new: '!flag.b01_enc_viajero_3', talk: [{ script: 'b01_enc_viajero_3' }] },
			{ label: 'El inspector, en el Centro Pokémon', sub: 'Te ha visto entrar', icon: '🗂️', cond: 'flag.b01_cromlech_hecha && !flag.b01_enc_lebrun_3', new: '!flag.b01_enc_lebrun_3', talk: [{ script: 'b01_enc_lebrun_3' }] },
			{ label: 'Renata entrevista a un pescador', sub: 'Micrófono en alto', icon: '🎙️', cond: 'flag.b01_renata_1 && badges >= 3 && !flag.b01_enc_renata_2', new: '!flag.b01_enc_renata_2', talk: [{ script: 'b01_enc_renata_2' }] },
			{ label: 'Una olla en el paseo marítimo', sub: 'Huele a mar y a mantequilla', icon: '🍲', cond: 'done.b01_t_gaspar && badges >= 3 && !flag.b01_enc_gaspar_1', new: '!flag.b01_enc_gaspar_1', talk: [{ script: 'b01_enc_gaspar_1' }] },
			{ label: 'Un trípode en la playa', sub: 'Y un Persian que no quiere salir', icon: '📹', cond: 'done.b01_t_tobias && badges >= 3 && !flag.b01_enc_tobias_1', new: '!flag.b01_enc_tobias_1', talk: [{ script: 'b01_enc_tobias_1' }] },
			{ label: 'Alguien dormido en la arena', sub: 'Pelo blanco, cero prisa', icon: '💤', cond: 'flag.b01_rhi_2_hecho && badges >= 3 && !flag.b01_enc_nate_1', new: '!flag.b01_enc_nate_1', talk: [{ script: 'b01_enc_nate_1' }] },
		],
		torre_maestra: [
			{ label: 'Una investigadora ante los relieves', sub: 'Sombrero de ala ancha y dos trenzas', icon: '📜', cond: 'flag.b01_irene_1 && badges >= 3 && !flag.b01_enc_irene_1', new: '!flag.b01_enc_irene_1', talk: [{ script: 'b01_enc_irene_1' }] },
			{ label: 'Una pluma gris en la estatua', sub: 'En el puño del Lucario de piedra', icon: '🪶', cond: 'flag.b01_torre_hecha && flag.b01_enc_ysolde_3 && !flag.b01_enc_ysolde_4', new: '!flag.b01_enc_ysolde_4', talk: [{ script: 'b01_enc_ysolde_4' }] },
		],
	},

	// =====================================================================
	// ENTRENADORES (solo combates opcionales)
	// =====================================================================
	trainers: {
		ysolde_duelo: { name: 'Ysolde', cls: 'Vencejo', npc: 'ysolde', ai: 3,
			team: [
				{ sp: 'fletchinder', lv: 25, moves: ['flamecharge', 'acrobatics', 'quickattack', 'peck'] },
				{ sp: 'honedge', lv: 26, ability: 'noguard', moves: ['shadowsneak', 'nightslash', 'aerialace', 'slash'] },
			],
			intro: 'Sin trucos. Sin público. Solo tú y lo que llevas dentro.',
			win: 'Bien. No miras solo hacia delante. Miras alrededor.',
			lose: 'Te has fijado en mí y no en el tejado. Error de principiante. Se corrige.' },
	},

	// =====================================================================
	// MISIONES (hilos abiertos para bloques futuros)
	// =====================================================================
	quests: {
		b01_t_ambar: { name: 'El ámbar sin registro', type: 'thread', stages: {
			hallazgo: 'Petra Brossard, una paleontóloga de campo, encontró un ámbar muy raro. Acompáñala al **Laboratorio de Fósiles** de Pueblo Petroglifo.',
			guardar: 'El ámbar no coincide con ningún registro. Petra te ha pedido que lo guardes tú: «en mis manos no dura ni dos días».',
			abierto: 'Petra sigue el rastro de su ámbar. Dice que algún día sabrá de qué época es. O de qué época *no* es.',
		} },
		b01_t_cabina: { name: 'La cabina azul', type: 'thread', stages: {
			vista: 'Una cabina azul de madera aparece y desaparece por Kalos. Su dueño, un hombre con una bufanda larguísima, siempre pregunta qué día es.',
			tarjeta: 'El viajero de la bufanda te dejó una tarjeta. No explica nada. Nunca explica nada.',
			abierto: 'El viajero dice que «ya os habéis visto». Para él, al menos.',
		} },
		b01_t_vencejos: { name: 'Plumas en el tejado', type: 'thread', stages: {
			pluma: 'Alguien con capucha vigila la Puerta Lemnis desde los tejados de Luminalia. Te dejó una pluma gris.',
			nota: 'Una nota sin firma: alguien más vio lo que pasó en la Cueva Brillante.',
			abierto: 'Ysolde y los suyos vigilan a Lemnis desde arriba. «Cuando cruces la Puerta, mira quién te mira.»',
		} },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		ambarsinregistro: { name: 'Ámbar sin registro', pocket: 'key', desc: 'Un trozo de ámbar tibio, del tamaño de un huevo de Pidgey. Dentro hay una pluma diminuta y un brillo azul que, si lo miras mucho rato, parece latir. La máquina de Petroglifo dice: «SIN COINCIDENCIAS».' },
		plumagris: { name: 'Pluma gris', pocket: 'key', desc: 'Una pluma de Fletchinder teñida de gris ceniza. Alguien la deja allí donde ha estado mirando, como quien firma sin escribir su nombre.' },
		notavencejo: { name: 'Nota sin firma', pocket: 'key', desc: 'Una nota clavada con una pluma gris en la puerta de tu habitación del Centro Pokémon de Relieve.',
			read: '«Las cajas decían MATERIAL DE CONSTRUCCIÓN. Tú viste lo que había debajo de la pegatina. Nosotros también.\n\nNo eres la única persona que mira. Pero eres la única que mira desde el suelo, y eso se nota.\n\nNo busques quién escribe esto. Mira hacia arriba de vez en cuando.»\n\nAbajo, en vez de firma, una silueta de pájaro con las alas cerradas, cayendo en picado.' },
		tarjetaviajero: { name: 'Tarjeta del viajero', pocket: 'key', desc: 'Una tarjeta de visita azul, con las esquinas gastadas. Huele a té y a tormenta.',
			read: 'Por delante, en letras plateadas: «**U.** — Reparaciones. Relojes, puertas y otras cosas que se abren donde no deben.»\n\nPor detrás, a mano, con prisa:\n\n«1. Si oyes un tictac donde no hay reloj, no lo sigas.\n2. Si lo sigues (lo seguirás), lleva un bocadillo.\n3. Lo pequeñito que late a destiempo no es malo. Tiene miedo. Como todo lo que es muy joven.\n4. Martes. Era martes. ¿Verdad?»' },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== PERSONAJE NUEVO · YSOLDE (la Encapuchada) ===================
		b01_enc_ysolde_1: [
			{ set: { 'flag.b01_enc_ysolde_1': true } },
			{ text: '{riolu} te tira de la manga y señala hacia arriba. En el tejado del edificio de enfrente, junto a una chimenea, hay alguien agachado. Capucha gris. Inmóvil. Mira a los técnicos de Lemnis que rodean la Puerta.', cond: 'inParty("riolu") || inParty("lucario")' },
			{ text: 'En el tejado del edificio de enfrente, junto a una chimenea, hay alguien agachado. Capucha gris. Inmóvil. Mira a los técnicos de Lemnis que rodean la Puerta.', cond: '!inParty("riolu") && !inParty("lucario")' },
			{ text: 'Durante un segundo, la capucha gira hacia ti. No le ves la cara. Solo sabes que te está mirando.' },
			{ text: 'Entonces se pone de pie en el borde, abre los brazos… y se deja caer. Seis pisos. De espaldas.' },
			{ text: 'Abajo pasa justo en ese momento el carro de una florista, cargado de flores de Flabébé. Un ruido blando. Una lluvia de pétalos. La florista grita.' },
			{ say: 'ysolde', as: 'Voz entre las flores', text: 'Las flores de las once y cuarto. Nunca fallan. —Una figura gris sale rodando del carro y echa a correr—. Perdón por las flores.' },
			{ text: 'Cuando llegas, en el carro solo quedan flores aplastadas y una pluma gris.' },
			{ say: 'rotom', text: '¡Bzzt! ¿Ha saltado? ¿De verdad ha saltado? Mis sensores dicen que eso es una idea malísima. Mis sensores dicen también que ha salido bien. Mis sensores están confundidos.' },
			{ give: 'plumagris', cond: '!has("plumagris")' },
			{ quest: 'b01_t_vencejos', stage: 'pluma', cond: '!quest.b01_t_vencejos' },
			{ intel: { npc: 'ysolde', text: 'Alguien con capucha gris vigilaba a los técnicos de Lemnis desde un tejado de la plaza. Saltó seis pisos sobre un carro de flores y desapareció. Dejó una pluma gris.' } },
		],
		b01_enc_ysolde_2: [
			{ set: { 'flag.b01_enc_ysolde_2': true } },
			{ text: 'En la puerta de la habitación que te han dado en el Centro Pokémon hay una nota doblada, clavada con una pluma gris. Nadie de recepción ha visto entrar a nadie. La ventana del pasillo está abierta. Es un tercer piso.' },
			{ if: 'has("plumagris")', then: [{ text: 'La pluma es igual que la del tejado de Luminalia. Teñida del mismo gris ceniza.' }], else: [{ give: 'plumagris', silent: true }, { text: 'Te guardas la pluma. Es de Fletchinder, pero alguien la ha teñido de gris ceniza.' }] },
			{ give: 'notavencejo' },
			{ text: 'La lees dos veces. Luego miras por la ventana, hacia los tejados de Relieve. En el de enfrente, un instante, una capucha gris.' },
			{ say: 'ysolde', as: 'Encapuchada', text: 'No te asomes tanto —te llega desde el tejado, en voz baja—. Desde ahí abajo se ve muy poco. Y te ven mucho.' },
			{ text: 'Cuando vuelves a mirar, el tejado está vacío.' },
			{ quest: 'b01_t_vencejos', stage: 'nota', cond: 'quest.b01_t_vencejos != "abierto"' },
			{ say: 'rotom', text: '¡Bzzt! Yo no he visto entrar a nadie. ¡Y eso que estaba encendido! Bueno. Medio encendido. Estaba ahorrando batería.' },
		],
		b01_enc_ysolde_3: [
			{ set: { 'flag.b01_enc_ysolde_3': true } },
			{ text: 'En lo alto del menhir mayor, a seis metros del suelo, alguien está sentado con las piernas colgando. Capucha gris. No sabes cómo ha subido: la piedra es lisa como un espejo.' },
			{ say: 'ysolde', as: 'Encapuchada', text: 'Treinta y un segundos entre foco y foco. Tu amigo el turista los contó bien. Yo conté treinta y dos, pero yo miraba desde aquí arriba.' },
			{ text: 'Baja del menhir de un salto, rueda al tocar el suelo y se pone de pie delante de ti como si no hubiera pasado nada. Se echa la capucha hacia atrás: una mujer joven, de ojos color miel y una cicatriz finísima en la barbilla.' },
			{ say: 'ysolde', text: 'Ysolde. Los míos nos llamamos **Vencejos**. Nunca bajamos al suelo si podemos evitarlo. Desde arriba se ve quién mueve los hilos.' },
			{ say: 'ysolde', text: 'Vigilamos a Lemnis desde antes de que tuvieran logotipo. Y a otros, antes que a ellos. Siempre hay alguien que quiere una energía que no se acaba. Siempre hay alguien que paga la cuenta.' },
			{ choice: [
				{ text: '«¿Por qué me vigiláis a mí?»', then: [{ say: 'ysolde', text: 'No te vigilamos a ti. Vigilamos a quien te vigila. Es distinto. Aunque, desde el tejado, se parece bastante.' }] },
				{ text: '«¿Sabes quién está detrás de Lemnis?»', then: [{ say: 'ysolde', text: 'En toda empresa hay quien firma y hay quien decide. Casi nunca es la misma persona. Más no te puedo decir. Más no sé. Todavía.' }] },
				{ text: '«¿Cómo saltaste del tejado sin matarte?»', then: [{ say: 'ysolde', text: 'Fe. Y un carro de flores que pasa por la plaza todos los días a las once y cuarto. Sobre todo, el carro.' }] },
			] },
			{ text: 'Al cruzarse de brazos, algo brilla un instante en su manga izquierda. Una hoja de metal, fina, con un ojo morado que te mira. Se esconde enseguida, como si le diera vergüenza.' },
			{ say: 'ysolde', text: 'Es Honedge. Viaja en mi manga. Una hoja que nadie ve es una hoja que nadie teme. Hasta que hace falta.' },
			{ prompt: 'Ysolde te mira de arriba abajo, como quien mide un salto.', choice: [
				{ text: '«¿Quieres comprobar si estoy a la altura?» (Combate)', then: [
					{ say: 'ysolde', text: 'Sí. Pero antes, cura a los tuyos. No peleo con nadie que viene cansado. Es de mala educación y, además, no enseña nada.' },
					{ heal: 'Ysolde te lanza una bolsita de hierbas. Huele a menta y a tejado mojado. Tu equipo se recupera.' },
					{ battle: 'ysolde_duelo', lose: 'continue',
						onWin: [{ set: { 'flag.b01_enc_ysolde_duelo': true } }, { say: 'ysolde', text: 'Les contaré a los míos que quien viaja con {riolu} no se asusta de lo que no ve. Les gustará. A algunos.' }],
						onLose: [{ say: 'ysolde', text: 'No pasa nada. Se aprende a mirar hacia arriba. Yo tardé años.' }, { heal: true, silent: true }] },
				] },
				{ text: '«Hoy no. Ya he tenido bastante con Crómlech.»', then: [{ say: 'ysolde', text: 'Sabia respuesta. Saber cuándo no saltar también es saltar bien.' }] },
			] },
			{ say: 'ysolde', text: 'Un consejo, ya que estamos: cuando cruces la Puerta, mira quién te mira. No a quién miras tú. A quién te mira.' },
			{ text: 'Se pone la capucha, trepa por el menhir como si tuviera escalones y, desde arriba, salta al siguiente. Y al siguiente. Cuando llega al último, ya no la ves.' },
			{ quest: 'b01_t_vencejos', stage: 'abierto' },
			{ intel: { npc: 'ysolde', text: 'Se llama Ysolde. Es de los «Vencejos», un grupo que vigila a Lemnis desde los tejados «desde antes de que tuvieran logotipo». Lleva un Honedge escondido en la manga y un Fletchinder. Te dijo: «Cuando cruces la Puerta, mira quién te mira».' } },
		],
		b01_enc_ysolde_4: [
			{ set: { 'flag.b01_enc_ysolde_4': true } },
			{ text: 'En el puño en alto del Lucario de piedra, a una altura a la que no llega ninguna escalera, alguien ha dejado una pluma gris. El viento del mar la mueve, pero no se la lleva.' },
			{ text: 'Sentada en el hombro de la estatua, con la capucha puesta, está Ysolde. Se lleva un dedo a los labios.' },
			{ say: 'ysolde', text: 'Lo vi todo desde aquí. La piedra, la luz, tu compañero. Precioso. —Mira hacia la ciudad—. Lemnis querrá medirlo. Que no lo midan.' },
			{ text: 'Se deja caer por el otro lado de la estatua, hacia el mar. No oyes ningún chapuzón.' },
			{ if: 'inParty("lucario") || inParty("riolu")', then: [{ text: '{riolu} mira la pluma. Luego mira el cielo, hacia los tejados de la ciudad. Su aura brilla un poco, como quien saluda de lejos.' }] },
			{ say: 'rotom', text: '¡Bzzt! ¿Cómo ha subido nadie hasta ahí? Pregunta retórica. Ya sé cómo. Saltando. Siempre saltando.' },
		],

		// =================== PERSONAJE NUEVO · PETRA (la paleontóloga) ===================
		b01_enc_petra_1: [
			{ set: { 'flag.b01_enc_petra_1': true } },
			{ text: 'Por las rocas talladas de la playa baja resbalando una mujer con un sombrero de explorador, unas gafas de protección torcidas y un cubo en cada mano. Detrás, un Diggersby baja tranquilamente, con las orejas cruzadas de brazos.' },
			{ say: 'petra', as: 'Mujer del cubo', text: '¡Cuidado, cuidado, CUIDADO! —Aterriza de culo en la arena. Los cubos, milagrosamente, siguen en pie—. …Vale. Está todo bien. Ningún fósil ha sufrido daños. Yo sí, pero yo me regenero.' },
			{ say: 'petra', text: 'Petra Brossard, paleontóloga de campo. «De campo» quiere decir que me paso el día en el suelo. A veces a propósito.' },
			{ say: 'petra', text: 'Y este es Pala. Mi Diggersby. Él cava, yo me caigo. Es un buen sistema. Llevamos seis años así y solo me he roto la misma muñeca dos veces.' },
			{ text: 'Petra mete la mano en uno de los cubos y saca algo envuelto en un pañuelo. Lo destapa con un cuidado que no ha tenido con nada más en toda la mañana.' },
			{ text: 'Es un trozo de **ámbar** del tamaño de un huevo. Dentro hay una pluma diminuta. Y, junto a la pluma, un brillo azul, muy pequeño, que parece moverse.' },
			{ say: 'petra', text: 'Lo saqué ayer de los acantilados de la Muralla Costera. De una capa que, según mis cálculos, es más antigua que cualquier Pokémon registrado. Lo cual es imposible. Así que mis cálculos están mal. O el ámbar está mal. O el mundo.' },
			{ say: 'petra', text: 'Tendría que llevárselo al **Dr. Lazare**, en el laboratorio. Fue mi director de tesis. Me suspendió el primer borrador porque se me cayó encima de su Fósil Domo. El Fósil Domo está bien. La tesis, no tanto.' },
			{ choice: [
				{ text: '«Te acompaño. Así no tienes que entrar sola.»', then: [{ say: 'petra', text: '¿En serio? ¡Gracias! Si me tiembla la voz, tú di «paleontología» muy fuerte. Eso me calma.' }] },
				{ text: '«¿Te has caído encima de un fósil? ¿De verdad?»', then: [{ say: 'petra', text: 'Encima de un fósil, encima de un museo de cera y una vez encima de un Rhyhorn dormido. El Rhyhorn fue el que mejor se lo tomó.' }] },
			] },
			{ quest: 'b01_t_ambar', stage: 'hallazgo' },
			{ intel: { npc: 'petra', text: 'Paleontóloga de campo, muy torpe y muy entusiasta. Su Diggersby se llama Pala. Encontró en los acantilados de la Muralla Costera un ámbar con un brillo azul dentro, en una capa «más antigua que cualquier Pokémon registrado».' } },
		],
		b01_enc_petra_2: [
			{ set: { 'flag.b01_enc_petra_2': true } },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¿Brossard? ¿Petra Brossard? ¡Fuera de mi laboratorio! …Es broma. Pasa. Pero no toques nada. Bueno, toca lo que quieras, pero despacio.' },
			{ text: 'Petra le da el ámbar con las dos manos, como quien entrega un huevo. Lazare lo mete en la máquina. La máquina zumba, pita, piensa un rato largo y escupe una tira de papel.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '«SIN COINCIDENCIAS». —Le da la vuelta al papel, por si acaso—. En veinte años, esta máquina nunca me ha dicho eso. Siempre coincide con algo. Aunque sea con un Kabuto mal hecho.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Y está tibio. El ámbar no está tibio, Petra. El ámbar no hace nada. Esa es su gracia.' },
			{ say: 'petra', text: '¿Y el brillo azul? Lo vio, ¿verdad? Dígame que lo vio. Si no lo vio, me voy a casa a tumbarme.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Lo vi. Late. Un poco a destiempo, como un reloj que se ha quedado sin pila y no se ha enterado. —Se quita las gafas—. No sé qué es. Y yo sé qué es casi todo lo que sale de una roca.' },
			{ text: 'Petra extiende la mano para recuperar el ámbar. Tropieza con el cable de la máquina. El ámbar sale volando. Lo atrapas al vuelo, a dos centímetros del suelo.' },
			{ say: 'petra', text: '…' },
			{ say: 'petra', text: 'Quédatelo tú. Por favor. En mis manos esto no dura ni dos días, y tú tienes buenos reflejos. Y un Pokémon que no se cae. Yo voy a seguir buscando la capa de donde salió. Cuando sepa algo, te encuentro.' },
			{ give: 'ambarsinregistro' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Brossard. Tu tesis era buena. El borrador. Debajo del Fósil Domo. Nunca te lo dije. —Carraspea—. Ahora fuera, que tengo trabajo.' },
			{ text: 'Petra sale del laboratorio sin decir nada. Tropieza en el escalón de la puerta. Esta vez se ríe.' },
			{ quest: 'b01_t_ambar', stage: 'guardar' },
		],
		b01_enc_petra_3: [
			{ set: { 'flag.b01_enc_petra_3': true } },
			{ text: 'Fuera de las vallas de Lemnis, en el prado, Pala el Diggersby ha cavado un agujero perfectamente cuadrado. Dentro, Petra mide algo con una regla, bocabajo, con las piernas fuera.' },
			{ say: 'petra', text: '¡{jugador}! —Intenta salir del agujero. Pala la saca de una oreja—. Gracias, Pala. Mira esto. Mira estas capas de tierra.' },
			{ say: 'petra', text: 'Las capas van por orden: lo más antiguo abajo y lo más nuevo arriba. Siempre. Es la primera regla. Me la tatuaría si no me diera miedo la aguja.' },
			{ say: 'petra', text: 'Pues aquí están desordenadas. Una capa de hace diez mil años encima de una de hace cien. Como si alguien hubiera doblado el tiempo como una sábana y lo hubiera guardado mal en el armario.' },
			{ if: 'has("ambarsinregistro")', then: [
				{ text: 'En tu bolsillo, el ámbar está más caliente que de costumbre. Cuando lo sacas, el brillo azul de dentro late deprisa. Luego, poco a poco, se calma.' },
				{ say: 'petra', text: '…Eso no lo hacía en el laboratorio. —Lo apunta. Se le cae la libreta en el agujero. Pala se la devuelve sin que nadie se lo pida—. Gracias, Pala.' },
			] },
			{ say: 'petra', text: 'Los de Lemnis no me dejan pasar de las vallas. Me han dicho que no tengo «permiso de excavación». Yo les he dicho que yo no excavo, que excava Pala. No ha colado.' },
			{ say: 'petra', text: 'Me han hablado de un bosque en Johto donde los relojes se paran. Si el tiempo está doblado en algún sitio, quiero verlo. Y si algún día vas tú… acuérdate de mí. Y del ámbar. Sobre todo del ámbar.' },
			{ quest: 'b01_t_ambar', stage: 'abierto' },
			{ intel: { npc: 'petra', text: 'En Crómlech encontró capas de tierra «desordenadas, como si alguien hubiera doblado el tiempo». Quiere ir a un bosque de Johto «donde los relojes se paran».' } },
		],

		// =================== PERSONAJE NUEVO · ULISES (el viajero de la cabina) ===================
		b01_enc_viajero_1: [
			{ set: { 'flag.b01_enc_viajero_1': true } },
			{ text: 'En mitad del prado, junto al puente, hay una cabina de madera pintada de azul, con un farolillo encima y una puerta con ventanitas. La pintora del puente jura que ayer no estaba.' },
			{ text: 'La puerta se abre de golpe. Sale una nube de vapor con olor a té y un hombre alto y despeinado, con un abrigo largo y una bufanda de rayas tan larga que todavía está saliendo de la cabina cuando él ya ha llegado hasta ti.' },
			{ if: 'flag.b01_viajero_conocido', then: [
				{ say: 'viajero', text: '¡{jugador}! ¿Ya nos conocemos? Sí, ya nos conocemos. Perdona: desde aquí dentro las cosas pasan en otro orden. ¿Hay Puertas ya? Claro que hay. Me lo dijiste tú. O me lo dirás.' },
			], else: [
				{ say: 'viajero', as: 'Hombre de la bufanda', text: '¡Hola! ¿Qué año es? No, no me lo digas. ¿Hay Puertas ya? ¿Las grandes, plateadas, con forma de ocho tumbado?' },
				{ choice: [
					{ text: '«Sí. Hace poco inauguraron la primera.»', then: [{ say: 'viajero', as: 'Hombre de la bufanda', text: '¡Ah! Ya hay Puertas. Vale. Vale, vale, vale. Entonces llego a tiempo. O tarde. Depende de por dónde lo mires, y yo lo miro por todos lados.' }] },
					{ text: '«¿Quién pregunta qué año es?»', then: [{ say: 'viajero', as: 'Hombre de la bufanda', text: 'Alguien que tiene muchos y los confunde. Es como tener demasiados calcetines: al final te pones uno de cada.' }] },
				] },
			] },
			{ text: 'Se agacha delante de {riolu} y lo mira muy de cerca, con un ojo cerrado.', cond: 'inParty("riolu") || inParty("lucario")' },
			{ say: 'viajero', text: 'Tu amigo ha cruzado una grieta. Se le nota en las orejas: todavía vibran un poco. Las grietas dejan eco. No pasa nada. Bueno, sí pasa, pero no hoy.', cond: 'inParty("riolu") || inParty("lucario")' },
			{ say: 'viajero', text: 'Me llamo… Ulises. No es mi nombre, pero me queda bien. Me paso la vida intentando volver a casa y la casa se me mueve.', cond: '!flag.b01_viajero_conocido' },
			{ text: 'De dentro de la cabina llega un tictac. Muy rápido. Demasiado rápido.' },
			{ say: 'viajero', text: '¡Uy! Me reclaman. ¡Encantado, {jugador}! —No le has dicho tu nombre—. Ah. No me lo habías dicho todavía. Bueno, me lo dirás. Me lo dijiste. Adiós.', cond: '!flag.b01_viajero_conocido' },
			{ say: 'viajero', text: '¡Uy! Me reclaman. ¡Hasta antes, {jugador}! Quiero decir, hasta luego. Eso. Luego.', cond: 'flag.b01_viajero_conocido' },
			{ text: 'Entra. La puerta se cierra. La cabina suelta un ruido largo y ronco, como alguien respirando hondo dentro de un acordeón, y se desvanece poco a poco, como un dibujo que alguien borra. En la hierba queda un cuadrado amarillo y aplastado.' },
			{ say: 'rotom', text: '¡Bzzt! ¿Qué era eso? Mis registros dicen: «cabina». Mis registros dicen: «azul». Mis registros no dicen nada más y eso me pone muy nervioso.' },
			{ quest: 'b01_t_cabina', stage: 'vista', cond: '!quest.b01_t_cabina' },
			{ cond: '!flag.b01_viajero_conocido', intel: { npc: 'viajero', text: 'Dice llamarse Ulises («no es mi nombre, pero me queda bien»). Viaja en una cabina azul de madera que aparece y desaparece. Preguntó qué año era y si ya había Puertas. Sabía tu nombre antes de que se lo dijeras.' } },
			{ set: { 'flag.b01_viajero_conocido': true } },
		],
		b01_enc_viajero_2: [
			{ set: { 'flag.b01_enc_viajero_2': true } },
			{ text: 'Entre los setos del laberinto asoma una bufanda de rayas. La sigues. Y la sigues. Y la sigues. Al final de la bufanda, sentado en un banco, está su dueño, comiéndose una manzana.' },
			{ if: '!flag.b01_viajero_conocido', then: [
				{ say: 'viajero', as: 'Hombre de la bufanda', text: '¡Hola! Tú no me conoces. Yo a ti, sí. Bueno, te conoceré. Es complicado. Ulises, encantado. ¿Qué año es? No, da igual.' },
				{ set: { 'flag.b01_viajero_conocido': true } },
				{ quest: 'b01_t_cabina', stage: 'vista', silent: true },
			], else: [
				{ say: 'viajero', text: '¡{jugador}! ¡Qué alegría! ¿Para ti ha pasado mucho? Para mí, once minutos y tres semanas. A la vez.' },
			] },
			{ say: 'viajero', text: 'Este laberinto es más grande por dentro. No, el laberinto no. Mi cabina. El laberinto es exactamente del tamaño que parece, y aun así me he perdido. Llevo aquí desde el martes. ¿Es martes?' },
			{ say: 'viajero', text: 'Escucha, que tengo poco tiempo, que es una frase muy rara en mi boca. Ahí fuera hay algo pequeñito. Muy joven. Con un corazón que hace tic y tac a destiempo. Está asustado, porque cada vez que se asusta, el tiempo se le escapa un poco.' },
			{ choice: [
				{ text: '«¿Qué es? ¿Un Pokémon?»', then: [{ say: 'viajero', text: 'Es… ¡uy, mira la hora! —No lleva reloj—. Es una pregunta excelente para otro día. Para otro año, mejor.' }] },
				{ text: '«¿Y qué quieres que haga yo?»', then: [{ say: 'viajero', text: 'Nada. Todavía. Solo que, si un día lo encuentras, no le grites. A los pequeños que tienen miedo no se les grita. Ni aunque sean enormes.' }] },
			] },
			{ say: 'viajero', text: 'Toma. Mi tarjeta. La he hecho yo. Las faltas de ortografía son de época.' },
			{ give: 'tarjetaviajero' },
			{ text: 'Se oye un tictac al otro lado del seto. Ulises da un salto, se mete la manzana en el bolsillo y echa a correr con la bufanda ondeando detrás.' },
			{ say: 'viajero', text: '¡Y gracias por lo de…! ¡Bueno, por lo que vas a hacer!' },
			{ text: 'Cuando doblas la esquina del seto, solo queda el ruido de acordeón, alejándose. Y media manzana mordida en el banco.' },
			{ quest: 'b01_t_cabina', stage: 'tarjeta', cond: 'quest.b01_t_cabina != "abierto"' },
		],
		b01_enc_viajero_3: [
			{ set: { 'flag.b01_enc_viajero_3': true } },
			{ text: 'La marea está baja. En mitad de la arena mojada, entre el muelle y la Torre, hay una cabina azul. Los pescadores la rodean con los brazos cruzados, como si fuera un pez muy grande que no saben cocinar.' },
			{ if: '!flag.b01_viajero_conocido', then: [
				{ say: 'viajero', as: 'Hombre de la bufanda', text: '¡Hola! Ulises. Viajero. Cabina. No preguntes. ¿Qué año es? No contestes.' },
				{ set: { 'flag.b01_viajero_conocido': true } },
			], else: [
				{ say: 'viajero', text: '¡{jugador}! ¡Otra vez tú! O todavía tú. Nunca sé cuál de las dos.' },
			] },
			{ say: 'viajero', text: '¿Sabes por qué la marea de Yantra hace lo que le da la gana? Porque alguien está tirando de las costuras del mundo. Despacito. Una puntada aquí, otra en Luminalia, otra entre unas piedras muy viejas…' },
			{ if: 'has("ambarsinregistro")', then: [
				{ text: 'Se calla de golpe. Mira tu bolsillo. El ámbar está tibio.' },
				{ say: 'viajero', text: 'Eso que llevas… ¿me dejas? —Lo mira a contraluz, muy serio por primera vez—. Esto es de un *antes*. Un antes de verdad, de los que no salen en los libros. Y lo de dentro…' },
				{ say: 'viajero', text: '…No. Olvida lo que iba a decir. Guárdalo. Que no lo vea nadie con corbata. Ni con bata. Ni con corbata y bata.' },
			], else: [
				{ say: 'viajero', text: 'Si alguna vez encuentras algo que esté tibio y no debería estarlo, guárdalo. Y que no lo vea nadie con corbata.' },
			] },
			{ say: 'viajero', text: 'Nos volveremos a ver. De hecho, ya nos hemos visto. Para mí. Fue precioso. Lloraste un poco. Bueno, lloré yo.' },
			{ text: 'Entra en la cabina. El ruido de acordeón. La cabina se borra. Donde estaba, la arena se queda seca un segundo, y luego la primera ola la moja.' },
			{ say: 'rotom', text: '¡Bzzt! ¿«Nadie con corbata»? Pues ya me dirás. En Lemnis llevan corbata hasta los guardias.' },
			{ quest: 'b01_t_cabina', stage: 'abierto' },
			{ intel: { npc: 'viajero', text: 'Dice que «alguien está tirando de las costuras del mundo»: la marea de Yantra, Luminalia, «unas piedras muy viejas». Te pidió que no enseñes lo que lleves «tibio» a nadie con corbata ni con bata.' } },
		],

		// =================== INSPECTOR LEBRUN ===================
		b01_enc_lebrun_1: [
			{ set: { 'flag.b01_enc_lebrun_1': true, 'flag.b01_lebrun_conocido': true } },
			{ text: 'En la puerta de la Agencia hay un hombre de traje gris, bigote canoso recortado al milímetro y una carpeta tan gorda que necesita una goma elástica para no abrirse. Handsome está delante de él, muy recto.' },
			{ say: 'lebrun', as: 'Hombre de la carpeta', text: 'Handsome. Catorce facturas de «disfraces operativos» este mes. Catorce. Una de ellas dice «bigote, rubio, para ocasiones».' },
			{ say: 'handsome', text: 'Inspector, ese bigote fue clave para la operación de…' },
			{ say: 'lebrun', as: 'Hombre de la carpeta', text: 'No me consta. —Te ve—. Ah. Y esto debe de ser el «Colaborador Especial». Con faltas de ortografía en la tarjeta, me han dicho.' },
			{ say: 'lebrun', text: 'Inspector Lebrun. Policía Internacional, delegación de Kalos. El superior de este señor. Que firma lo que él gasta.' },
			{ if: 'flag.b01_diario', then: [
				{ say: 'lebrun', text: 'Usted estuvo en las oficinas de Lemnis. Con Rouxel. Y con alguien de Investigación. Una hora y diez minutos.' },
				{ say: 'handsome', text: '…¿Cómo sabe usted eso, inspector?' },
				{ say: 'lebrun', text: 'Es mi trabajo saberlo, Handsome. Y el suyo también, en teoría.' },
			], else: [
				{ say: 'lebrun', text: 'Medalla Roca. Ciudad Novarte. Contra un líder de intercambio que, según el informe, se disculpó con una tortilla. Enhorabuena.' },
			] },
			{ say: 'lebrun', text: 'Un consejo, colaborador: los informes, por triplicado. Las sospechas, por escrito. Y las corazonadas de Handsome, en un cajón. Cerrado con llave.' },
			{ text: 'Se va. Handsome espera a que doble la esquina para soltar el aire.' },
			{ say: 'handsome', text: 'Handsome respeta mucho al inspector Lebrun. Handsome también le tiene un poco de miedo. Las dos cosas a la vez. Como con Matière.' },
			{ say: 'matiere', text: 'Te he oído.' },
			{ intel: { npc: 'lebrun', text: 'Superior de Handsome en Kalos. Burocrático y escéptico: «los informes, por triplicado». Sabía cosas de ti que nadie le había contado.' } },
		],
		b01_enc_lebrun_2: [
			{ set: { 'flag.b01_enc_lebrun_2': true } },
			{ if: '!flag.b01_lebrun_conocido', then: [
				{ text: 'Un hombre de traje gris, bigote canoso y una carpeta enorme te corta el paso junto al Centro Pokémon.' },
				{ say: 'lebrun', text: 'Inspector Lebrun, Policía Internacional. El superior de Handsome. El que firma lo que él gasta. Usted es su «Colaborador Especial».' },
				{ set: { 'flag.b01_lebrun_conocido': true } },
			], else: [
				{ say: 'lebrun', text: 'Colaborador. Otra vez usted. Kalos es grande, pero parece que no tanto.' },
			] },
			{ say: 'lebrun', text: 'Me consta que estuvo en la Cueva Brillante. Al fondo. Cuánto rato, a qué hora y con quién.' },
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ say: 'lebrun', text: 'Y me consta su denuncia ante la Liga. Ha llegado a mi mesa. Muy detallada. La he archivado para su estudio.' },
			] },
			{ prompt: '¿Qué le cuentas a Lebrun?', choice: [
				{ text: 'Contarle lo del Team Flare y lo de Melia.', then: [
					{ rep: { policia: 1 } },
					{ say: 'lebrun', text: '¿Melia? —Ni siquiera abre la carpeta—. Esa orden lleva años archivada. Caso cerrado. No pierda el tiempo con fantasmas, colaborador.' },
					{ say: 'lebrun', text: 'Unos reclutas con trajes caros robando piedras brillantes. Lo apunto como «vandalismo geológico». Por triplicado.' },
				] },
				{ text: '«Pregúntele a Handsome. Él tiene mi informe.»', then: [
					{ say: 'lebrun', text: 'Handsome tiene muchas cosas. Facturas, sobre todo. —Cierra la carpeta—. Bien. Lealtad. Lo apunto. A favor o en contra, ya veremos.' },
				] },
				{ text: '«No vi nada importante.»', then: [
					{ say: 'lebrun', text: 'Perfecto. Lo que no se ve no se archiva. Me ahorra papel.' },
				] },
			] },
			{ say: 'lebrun', text: 'Siga con sus medallas, colaborador. Es lo que mejor se le da. Lo demás, déjelo a los profesionales.' },
			{ text: 'Se aleja. Ni siquiera ha preguntado cómo se llamaba la cueva. Ya lo sabía.' },
		],
		b01_enc_lebrun_3: [
			{ set: { 'flag.b01_enc_lebrun_3': true } },
			{ if: '!flag.b01_lebrun_conocido', then: [
				{ text: 'En el vestíbulo del Centro Pokémon te espera un hombre de traje gris y bigote canoso, con una carpeta enorme sobre las rodillas.' },
				{ say: 'lebrun', text: 'Inspector Lebrun, Policía Internacional. El superior de Handsome. Usted es su colaborador. Siéntese, por favor.' },
				{ set: { 'flag.b01_lebrun_conocido': true } },
			], else: [
				{ text: 'En el vestíbulo del Centro Pokémon, el inspector Lebrun te espera sentado, con la carpeta sobre las rodillas. Como si supiera a qué hora ibas a entrar.' },
			] },
			{ say: 'lebrun', text: 'Crómlech. Usted entró en una excavación privada. De noche. Con Handsome haciendo de turista en la puerta. Muy discreto todo.' },
			{ if: 'flag.b01_delatar', then: [
				{ say: 'lebrun', text: 'Y luego se lo contó a la prensa. Media Kalos llamando a mi oficina. Lemnis llamando a mi oficina cada hora, en punto. Yo, sin poder comer.' },
				{ say: 'lebrun', text: 'La próxima vez que quiera hacer justicia, colaborador, hágala por los canales. Los canales existen por algo. Sobre todo para que no se desborden.' },
			] },
			{ if: 'flag.b01_handsome', then: [
				{ say: 'lebrun', text: 'Handsome no me ha pasado ningún informe sobre Crómlech. Ni uno. Él, que me manda informes hasta de lo que desayuna. —Te mira—. ¿Debería preocuparme?' },
				{ choice: [
					{ text: '«Pregúntele a él.»', then: [{ say: 'lebrun', text: 'Eso haré. Con calma. Tengo mucha calma. Es lo único que la Policía Internacional me paga bien.' }] },
					{ text: '«No pasó nada que merezca un informe.»', then: [{ say: 'lebrun', text: 'Entonces no hay nada que archivar. Me encanta cuando no hay nada que archivar.' }] },
				] },
			] },
			{ if: 'flag.b01_trato_sera', then: [
				{ say: 'lebrun', text: 'Veo que tiene amistades nuevas, colaborador. Amistades con holomisor. —No te pregunta nada más—. Elegante, el aparato. Muy frío al tacto, dicen.' },
			] },
			{ say: 'lebrun', text: 'Siga con sus medallas y con su compañero. Y deje las excavaciones a quien tiene permisos. Yo, por ejemplo, tengo muchos permisos.' },
			{ text: 'Se levanta y sale sin mirar atrás. Se deja en la silla un caramelo de menta, envuelto en papel azul. Cuando vuelves a mirar, la enfermera ya lo ha tirado.' },
			{ intel: { npc: 'lebrun', text: 'Te esperaba en el Centro de Yantra. Sabía que entraste en la excavación de Crómlech, de noche, y con quién.' } },
		],

		// =================== FABIEN ROUXEL ===================
		b01_enc_rouxel_1: [
			{ set: { 'flag.b01_enc_rouxel_1': true } },
			{ text: 'Medio Bulevar Sur está cortado. Focos, una grúa con cámara y una niña con un Fletchling, repitiendo por quinta vez la misma frase: «¡Gracias, Lemnis, por traer a casa a mi Pokémon!».' },
			{ say: 'rouxel', text: '¡Corten! Precioso. Más ilusión en «casa», cariño. «CA-SA». Como si fuera la palabra más bonita del mundo. Porque lo es.' },
			{ text: 'Te ve. La sonrisa se le enciende como un cartel de neón.' },
			{ say: 'rouxel', text: '¡{jugador}! ¡La cara de la inauguración! Estamos grabando el anuncio de la campaña «Volver a casa». ¿Quieres salir? Dos segundos. Una sonrisa, un pulgar arriba. Nada que tengas que firmar. Hoy.' },
			{ choice: [
				{ text: '«¿Qué Pokémon habéis traído de vuelta, exactamente?»', then: [
					{ rep: { lemnis: -1 } },
					{ say: 'rouxel', text: 'Este Fletchling, por ejemplo. —Baja la voz—. Bueno, este Fletchling es de Kalos y es de la niña desde siempre. Pero *representa* a los que volverán. La publicidad es así: va un poco por delante de la realidad.' },
				] },
				{ text: 'Hacer un pulgar arriba muy rápido y seguir andando.', then: [
					{ rep: { lemnis: 1 } },
					{ say: 'rouxel', text: '¡Perfecto! ¡Natural! ¡Fresco! ¡Eso lo montamos al final! —Te grita mientras te alejas—. ¡Ya te mandaremos los derechos de imagen! ¡Por correo! ¡Muy pequeños!' },
				] },
				{ text: '«No.»', then: [{ say: 'rouxel', text: 'No es un no. Es un «todavía no». En Lemnis hablamos con fluidez el idioma del todavía.' }] },
			] },
			{ if: 'flag.b01_prensa_verdad', then: [{ say: 'rouxel', text: 'Por cierto, lo que le dijiste a la prensa… ya está olvidado. Por nuestra parte. Lemnis no guarda rencor. Lo guarda el departamento jurídico, que es otra cosa.' }] },
			{ say: 'rouxel', text: '¡Seguimos! ¡Desde «gracias»! ¡Y alguien que me traiga un café, que me tiembla la sonrisa!' },
		],
		b01_enc_rouxel_2: [
			{ set: { 'flag.b01_enc_rouxel_2': true } },
			{ text: 'La recepcionista no está. A través de la puerta de un despacho se oye a alguien hablando por teléfono. Es la voz de Rouxel, pero sin la sonrisa.' },
			{ say: 'rouxel', as: 'Voz tras la puerta', text: '…Sí. Sí, señora. Entiendo. No, no fui yo quien autorizó la visita nocturna. No había visita. No había… sí. Sí, señora.' },
			{ if: 'flag.b01_delatar', then: [{ say: 'rouxel', as: 'Voz tras la puerta', text: '…El desmentido de las cinco ya está enviado. El de las seis está en redacción. ¿Uno cada media hora? …Sí. Claro. Sin problema. Ninguno.' }] },
			{ say: 'rouxel', as: 'Voz tras la puerta', text: '¿Un informe de responsabilidades? ¿Con mi nombre en el asunto? …No, no, me parece perfecto. Transparencia. Es nuestro valor número tres.' },
			{ text: 'Cuelga. Silencio. Luego, un ruido muy pequeño, como de alguien que apoya la frente en una mesa de cristal.' },
			{ text: 'La puerta se abre. Rouxel sale con la sonrisa ya puesta, como una corbata recién anudada. Al verte, la sonrisa se le tuerce medio segundo.' },
			{ say: 'rouxel', text: '¡{jugador}! ¡Qué sorpresa! ¿Has venido a firmar? Hoy no es buen día para firmar. Hoy es un día excelente, pero no para firmar.' },
			{ say: 'rouxel', text: 'Un consejo de amigo, ya que estamos: en esta empresa, cuando las cosas van bien, las ha hecho el de arriba. Cuando van mal, las ha hecho el de en medio. Apréndetelo. Yo lo aprendí tarde.' },
			{ intel: { npc: 'rouxel', text: 'Tras lo de Crómlech, la sede central le pidió «un informe de responsabilidades» con su nombre en el asunto. Está muy nervioso.' } },
		],

		// =================== DR. ANSEL MOREAU ===================
		b01_enc_ansel_1: [
			{ set: { 'flag.b01_enc_ansel_1': true } },
			{ text: 'El profesor Ciprés y un hombre mayor con cárdigan están inclinados sobre la misma pantalla, cada uno con su taza de café. Es el doctor Moreau, de Lemnis. Te saluda con la mano sin levantar la vista.' },
			{ say: 'ansel', text: 'Ah, {jugador}. Un momento, que el profesor y yo estamos discutiendo. Es nuestro deporte favorito. Él gana siempre en encanto y yo, en decimales.' },
			{ say: 'cipres', text: 'Ansel cree que las Fisuras siguen un patrón. Yo creo que son un caos maravilloso. Los dos tenemos razón, solo que él la tiene con gráficas.' },
			{ say: 'ansel', text: 'Un patrón precioso. Mira el mapa: se abren donde la tierra es más antigua. Como el agua, que siempre baja por el mismo sitio. Como si buscaran algo.' },
			{ choice: [
				{ text: '«¿Y eso no es peligroso?»', then: [
					{ say: 'ansel', text: 'Todo lo importante es un poco peligroso. Para salvar un bosque, a veces hay que podar alguna rama. Lo difícil es elegir cuál. —Te ofrece un caramelo de menta—. Por eso nos pagan a los viejos.' },
				] },
				{ text: '«¿Qué buscan?»', then: [
					{ say: 'ansel', text: 'Ah, eso es lo bonito de los datos: todavía no lo dicen. —Sonríe—. Algún día te lo enseñaré bien, cuando lo entienda yo.' },
				] },
			] },
			{ say: 'ansel', text: '¿Y nuestro pequeño Rotom? ¿Está contento con su diario? Los Rotom se encariñan muchísimo. A veces más que nosotros.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Contentísimo! ¡Ya tengo un montón de entradas! ¡Escribo con muy buena letra!' },
			{ say: 'ansel', text: 'No lo dudo, pequeño. No lo dudo.' },
			{ say: 'cipres', text: 'Ansel, el café se te enfría. Y a mí la paciencia. —Te guiña un ojo—. Vuelve cuando quieras, {jugador}. Aquí siempre hay ciencia y, a veces, galletas.' },
		],
		b01_enc_ansel_2: [
			{ set: { 'flag.b01_enc_ansel_2': true } },
			{ text: 'En la mesa del rincón, el doctor Moreau hace un crucigrama con un bolígrafo de Lemnis. Tiene un macaron sin tocar en el plato y un café con leche a medias.' },
			{ say: 'ansel', text: '¡{jugador}! Siéntate, siéntate. Ocho letras: «unión que no se puede romper». Llevo media hora. Me empiezo a tomar el crucigrama como algo personal.' },
			{ choice: [
				{ text: '«¿Vínculo?»', then: [{ say: 'ansel', text: 'Son siete. —Lo cuenta con el dedo—. Siete. Qué pena. Era una respuesta preciosa.' }] },
				{ text: '«¿Infinito?»', then: [{ say: 'ansel', text: '…Ocho. Encaja. —Lo escribe despacio, letra a letra—. Mira tú. Al final, la respuesta siempre era la más obvia.' }] },
				{ text: '«Ni idea. Los crucigramas no son lo mío.»', then: [{ say: 'ansel', text: 'Ni lo mío. Lo mío son los números. Las palabras se mueven demasiado.' }] },
			] },
			{ say: 'ansel', text: 'Dos medallas. ¡Dos! Y {riolu} crece a ojos vista. Se nota hasta en cómo se sienta. Los Riolu de Isla Hierro crecen cuando tienen a alguien a quien cuidar.', cond: 'badges < 3' },
			{ say: 'ansel', text: 'Tres medallas ya. ¡Tres! Y {riolu} crece a ojos vista. Se nota hasta en cómo se sienta. Los Riolu de Isla Hierro crecen cuando tienen a alguien a quien cuidar.', cond: 'badges >= 3' },
			{ say: 'ansel', cond: 'flag.b01_torre_hecha', text: 'Así que Cornelio te dejó subir a la Torre Maestra. Es un hombre sabio. Un poco romántico, para mi gusto. Él cree que el vínculo tiene un techo. Yo, que el techo está para quitarlo.' },
			{ say: 'ansel', cond: '!flag.b01_torre_hecha', text: 'Y luego, la Torre Maestra, imagino. Cornelio es un hombre sabio. Un poco romántico, para mi gusto. Él cree que el vínculo tiene un techo. Yo, que el techo está para quitarlo.' },
			{ text: 'Te pasa el macaron por encima de la mesa.' },
			{ say: 'ansel', text: 'Cómetelo tú. A mi edad, el azúcar es una inversión con muy mala rentabilidad.' },
		],

		// =================== NOA LAMBERT ===================
		b01_enc_noa_1: [
			{ set: { 'flag.b01_enc_noa_1': true } },
			{ text: 'Noa está en la puerta del Centro Pokémon, con el móvil en la oreja y una carpeta llena de etiquetas debajo del brazo. Te saluda con la mano libre y sigue hablando.' },
			{ say: 'noa', text: '…Envío KAL-0031. Un Wooloo. Destino Galar. Salió de Luminalia hace nueve días. …¿No consta? ¿Cómo que no consta? Lleva un pañuelo con su nombre: Merengue. …Vale. Vale. Gracias.' },
			{ text: 'Cuelga. Se queda mirando el móvil un momento, como si fuera a volver a sonar con otra respuesta.' },
			{ say: 'noa', text: '¡Hola! Perdona. Burocracia interregional. Es como la normal, pero en nueve idiomas. —Se ríe. Le sale un poco corta.' },
			{ if: 'flag.b01_mareep_noche', then: [{ say: 'noa', text: 'Ah, ¿sabes qué? Se nos escapó un Mareep del campamento. De noche. El guardia dice que vio una sombra con un Riolu. —Te mira. Luego mira a otro lado—. Seguro que fue un sueño. Él sueña mucho.' }] },
			{ if: 'flag.b01_noa_favor', then: [{ say: 'noa', text: 'Lo del Mareep de la marca sigue «extraviado durante el transporte». —Baja la voz—. Es el único envío del que sé seguro dónde está.' }] },
			{ say: 'noa', text: 'Seguro que es un retraso. Los envíos tardan. Galar está lejísimos. Bueno, ya no, con las Puertas. Pero los papeles sí.' },
			{ choice: [
				{ text: '«Si quieres, pregunto yo por ahí.»', then: [{ say: 'noa', text: '¿Tú? No, no, no. No hace falta. De verdad. —Pausa—. …Si te enteras de algo, me lo dices, ¿vale? Solo a mí.' }] },
				{ text: '«Seguro que llega.»', then: [{ say: 'noa', text: 'Eso. Seguro. Lemnis cuida de los suyos. —Lo dice como quien repite una contraseña.' }] },
			] },
			{ intel: { npc: 'noa', text: 'Un Wooloo llamado Merengue salió de Luminalia hacia Galar «hace nueve días». En Galar no consta. Noa empieza a preguntar.' } },
		],
		b01_enc_noa_2: [
			{ set: { 'flag.b01_enc_noa_2': true } },
			{ text: 'Noa está sentada en un banco frente al gimnasio, con un folleto de Lemnis en las manos. Lo tiene del revés. No se ha dado cuenta.' },
			{ say: 'noa', text: 'Ah. Hola, {jugador}. Enhorabuena por la medalla. Lo he visto en las noticias. Estás en todas partes. Como yo. Bueno, como el logo.' },
			{ say: 'noa', text: 'Fui al centro de procesamiento de Luminalia. Al que mandamos a todos. Quería ver a Merengue, el Wooloo. Para el informe. Y porque sí.' },
			{ say: 'noa', text: 'No me dejaron pasar de recepción. «Área restringida». A mí. Que les he llevado cuarenta y tres Pokémon. Me dieron esto. —Levanta el folleto—. «Volver a casa». Tiene fotos muy bonitas.' },
			{ if: 'flag.b01_bastien_rompe', then: [{ say: 'noa', text: 'Bastien rompió su contrato, ¿sabes? Me alegro por él. —Se tapa la boca—. No se lo digas a nadie de la empresa. Es que me alegro de verdad.' }] },
			{ if: 'flag.b01_bastien_silencio', then: [{ say: 'noa', text: 'Bastien está rarísimo. Ya no se queja del uniforme. Se lo pone sin protestar. Es lo más triste que he visto este mes, y he visto un Wooloo en una jaula.' }] },
			{ if: 'flag.b01_bastien_cubierto', then: [{ say: 'noa', text: 'Bastien me ha dicho que alguien dio la cara por él en la Cueva Brillante. No me ha dicho quién. —Te mira—. No hace falta.' }] },
			{ say: 'noa', text: 'Oye. ¿Tú sabes leer entre líneas? Porque yo creo que nunca he aprendido. Y empiezo a pensar que en esta empresa todo está escrito ahí.' },
			{ text: 'Le da la vuelta al folleto. Lo pone del derecho. Lo mira un rato largo, como si lo leyera por primera vez.' },
		],

		// =================== MELIA ===================
		b01_enc_melia_1: [
			{ set: { 'flag.b01_enc_melia_1': true } },
			{ text: 'En «Piedras y Fósiles», una mujer de pelo rosa cortado a cuchilla, sin visor y sin bata, discute en voz muy baja con el dependiente. Lleva un abrigo largo y gafas de sol. Dentro de una tienda.' },
			{ say: 'melia', as: 'Mujer de las gafas', text: 'No le pido cristales bonitos. Le pido cristales que no parpadeen. Que aguanten la luz sin cansarse. ¿Tiene o no tiene?' },
			{ say: null, text: '«Señora, yo vendo piedras. Las piedras no se cansan.» —El dependiente se seca la frente—. «Bueno, no las mías.»' },
			{ text: 'La mujer se gira. Se baja las gafas un centímetro. Es Melia. Te reconoce enseguida.' },
			{ say: 'melia', text: '{El|La|Le} de la cueva. Con tu Pokémon de otra parte. —Mira a {riolu}—. Tiene mejor aspecto que la última vez. La luz le sienta bien. A casi todo le sienta bien la luz. Por eso hay que tenerla.', cond: 'inParty("riolu") || inParty("lucario")' },
			{ say: 'melia', text: '{El|La|Le} de la cueva. —Te mira como quien mide algo—. Sigues mirando donde no debes. Es una cualidad. Mal usada, pero una cualidad.', cond: '!inParty("riolu") && !inParty("lucario")' },
			{ say: 'melia', text: 'No te molestes en llamar a nadie. Hay órdenes que se archivan solas.' },
			{ text: 'Paga una piedra cualquiera con un billete demasiado grande, no espera el cambio y sale. La campanilla de la puerta suena dos veces.' },
			{ say: 'rotom', text: '¡Bzzt! «Hay órdenes que se archivan solas». Eso no es verdad. Las órdenes las archiva alguien. Siempre hay alguien. Lo pone en mi manual.' },
		],

		// =================== PROF. GADD ===================
		b01_enc_gadd_1: [
			{ set: { 'flag.b01_enc_gadd_1': true } },
			{ text: 'En el pasillo del ala norte, un señor bajito con bata, gafas redondas y una mochila con un tubo enorme persigue a un Gastly. El tubo ruge. El Gastly se ríe. El señor también.' },
			{ say: 'gadd', text: '¡Quieto! ¡Quieto, que es por la ciencia! —El Gastly le atraviesa la cabeza—. ¡Uy! Hola, hola. Ernesto Gadd, inventor. Y eso que se escapa es un dato.', cond: '!done.ev_halloween' },
			{ say: 'gadd', text: '¡Quieto! ¡Quieto, que es por la ciencia! —El Gastly le atraviesa la cabeza—. ¡Uy! ¡{El|La|Le} detective de la calabaza! Hola, hola. Y eso que se escapa es un dato.', cond: 'done.ev_halloween' },
			{ say: 'gadd', text: 'Este Gastly no es de aquí. Los del Conde son finos, educados, un poco cursis. Este tiene acento. Huele a incienso y a lavanda. A torre vieja de Kanto. ¡Un fantasma desplazado!' },
			{ say: 'gadd', text: 'Desde lo de la grieta de Luminalia me salen fantasmas de otras regiones por todas partes. Los vivos se pierden; los fantasmas, también. Pero los fantasmas se quejan más.' },
			{ choice: [
				{ text: '«¿Qué vas a hacer con él?»', then: [{ say: 'gadd', text: '¿Hacer? Nada malo. Aspirarlo con cariño, apuntar de dónde viene y llevarlo a su casa. Por las buenas. Mi aspiradora tiene modo «suave». Lo inventé ayer.' }] },
				{ text: '«¿Puedes aspirar también una Fisura?»', then: [{ say: 'gadd', text: '¡Ja! Lo intenté. Bueno, lo pensé. Bueno, lo dibujé en una servilleta. La servilleta se quemó. Lo tomo como un no, de momento.' }] },
			] },
			{ say: 'gadd', text: 'Si encuentras fantasmas raros por ahí, apunta dónde y a qué hora. Con hora, ¡que nadie apunta la hora!' },
			{ text: 'El Gastly vuelve a asomarse por la pared, saca la lengua y desaparece. El profesor sale corriendo detrás, con el tubo rugiendo.' },
		],

		// =================== DRA. IRENE SOLBERG ===================
		b01_enc_irene_1: [
			{ set: { 'flag.b01_enc_irene_1': true } },
			{ text: 'Al pie de la escalera de caracol, una mujer bajita con sombrero de ala ancha y dos trenzas azules copia en una libreta los relieves de Lucario de la pared. Está subida a un taburete. Aun así, no llega.' },
			{ say: 'irene', text: 'Ni una palabra sobre el taburete. —No se gira—. Hola, {jugador}. Sabía que eras tú. Tu compañero hace vibrar la piedra al pasar. Literalmente. Lo he medido.' },
			{ say: 'irene', text: 'Estas runas son del mismo sistema que las de Crómlech. Misma época. Misma mano, casi. Pero aquí falta algo: todas las runas que significan «tomar» están raspadas. Alguien las borró hace siglos. A propósito.' },
			{ choice: [
				{ text: '«¿Por qué borraría alguien solo esas?»', then: [
					{ af: { irene: 2 } },
					{ say: 'irene', text: 'Esa es la pregunta correcta. —Se gira, por fin. Tiene polvo de piedra en la nariz—. Quizá para que nadie aprendiera a hacerlo. Hay cosas que solo se olvidan si alguien se esfuerza mucho en olvidarlas.' },
				] },
				{ text: '«¿Necesitas que te sujete el taburete?»', then: [
					{ af: { irene: -1 } },
					{ say: 'irene', text: '…Necesito que nadie me pregunte si necesito que me sujeten el taburete.' },
				] },
				{ text: 'Dejar que {riolu} toque la pared.', cond: 'inParty("riolu") || inParty("lucario")', then: [
					{ af: { irene: 3 } },
					{ text: '{riolu} apoya la palma en un relieve raspado. Durante un instante, el surco brilla en azul, como si la runa intentara volver a escribirse. Luego se apaga.' },
					{ say: 'irene', text: '…Lo he apuntado. Con hora. —Mira el reloj y la escribe—. Le tiembla un poco la mano—. Gracias. Eso no lo había visto nadie en trescientos años.' },
				] },
			] },
			{ say: 'irene', text: 'Me vuelvo a Sinnoh dentro de poco. La Biblioteca de Ciudad Canal me reclama. Pero te escribiré. Si encuentras más piedras que hablen, no las toques. Llámame.' },
			{ intel: { npc: 'irene', text: 'En la Torre Maestra encontró runas del mismo sistema que las de Crómlech. Todas las que significan «tomar» fueron raspadas a propósito, hace siglos.' } },
		],

		// =================== RENATA ===================
		b01_enc_renata_1: [
			{ set: { 'flag.b01_enc_renata_1': true } },
			{ say: 'renata', text: '…y aquí, queridos oyentes, una pared de cuarenta metros que la gente sube por gusto. Nota para el episodio: Relieve es una ciudad de gente que no sabe estar quieta. —Te ve—. ¡Testigo! ¡Mi testigo favorit{o|a|e}!' },
			{ say: 'renata', text: 'Te prometí la segunda parte, ¿no? Pues no. Todavía no. Pero te doy el título del episodio, gratis: «**El ingeniero que no volvió a casa**». Hace doce años. Antes de que nadie dijera «Puerta» en voz alta.' },
			{ if: 'flag.b01_simon_1', then: [
				{ say: 'renata', text: 'Por cierto, Simón dice que te conoció en Vánitas. Me ha despedido. Otra vez. Ya van ocho. Cool, cool, cool. Mañana me vuelve a contratar: nadie más lo aguanta.' },
			] },
			{ prompt: 'Renata te apunta con el micrófono.', choice: [
				{ text: '«Si es un ingeniero desaparecido, el título se queda corto. Ponle "La Puerta de atrás".»', then: [
					{ af: { renata: 3 } },
					{ say: 'renata', text: '…«La Puerta de atrás». —Se queda quieta por primera vez—. Vale. Eso es mejor que mi título. Odio cuando pasa eso. Me encanta cuando pasa eso.' },
				] },
				{ text: '«¿Y qué tiene que ver con Lemnis?»', then: [
					{ af: { renata: 1 } },
					{ say: 'renata', text: '¿Quién ha dicho Lemnis? Yo no he dicho Lemnis. Tú has dicho Lemnis. —Sonríe—. Nota para el episodio: el testigo piensa lo mismo que yo.' },
				] },
				{ text: '«Suena a un episodio muy largo.»', then: [
					{ say: 'renata', text: 'Los buenos son largos. Los malos, también, pero se notan más.' },
				] },
			] },
			{ say: 'renata', text: 'Me voy, que el escalador del fondo lleva diez minutos colgado de un solo dedo y eso es contenido.' },
		],
		b01_enc_renata_2: [
			{ set: { 'flag.b01_enc_renata_2': true } },
			{ say: 'renata', text: '…entonces, señor, ¿la marea subió tres veces el martes? ¿Tres? ¿Está seguro? ¿No serían dos y una ilusión?' },
			{ say: 'pescador_yantra', text: 'Tres. Mi abuelo ponía el reloj en hora con la marea. Yo ya no sé qué hora es. Ni qué día.' },
			{ say: 'renata', text: 'Nota para el episodio: los pescadores de Yantra han dejado de fiarse del mar. Eso es grave. Es como si un panadero dejara de fiarse de la harina.' },
			{ text: 'Te ve. Se le iluminan las gafas.' },
			{ say: 'renata', text: '¡Tú! ¿Sabes qué tienen en común la marea de Yantra, las luces de la Torre Prisma y unas piedras de Crómlech que, dicen, brillan solas de madrugada? Yo tampoco. Todavía. Pero me encanta que tengan algo en común.' },
			{ if: 'flag.b01_enc_renata_1', then: [{ say: 'renata', text: 'Y sí, el episodio del ingeniero sigue en producción. Tengo una pista nueva. No te la cuento. Te la cuento en Teselia, si algún día vienes. Que vendrás.' }] },
			{ say: 'renata', text: 'Me vuelvo pronto a casa, a Teselia. Si pasas por allí, pregunta por el pódcast. Todo el mundo lo conoce. Bueno, doce personas. Pero doce personas muy intensas.' },
		],

		// =================== SECUNDARIOS QUERIDOS ===================
		b01_enc_lucien_1: [
			{ set: { 'flag.b01_enc_lucien_1': true } },
			{ say: 'lucien', text: '¡{jugador}! ¡Mira, mira! ¡Chespin ya sabe hacer Látigo Cepa! Bueno, le sale un látigo y medio. Pero el medio también cuenta.' },
			{ say: 'lucien', text: 'Y mira mi libreta: apunto cada vez que la Puerta zumba. El martes, a las dos y diecisiete de la madrugada. El jueves, a las dos y diecisiete. Hoy, a las dos y diecisiete.' },
			{ say: 'lucien', text: 'Mi madre dice que a las dos y diecisiete de la madrugada yo debería estar dormido. Yo digo que la ciencia no duerme. Ella dice que la ciencia no tiene colegio.' },
			{ if: 'flag.b01_cromlech_hecha', then: [{ text: 'Las dos y diecisiete. Más o menos la hora a la que bajaste al cráter de Crómlech.' }] },
			{ say: 'lucien', text: 'Cuando abran la Puerta, Chespin y yo vamos a cruzar primero. Ya lo tengo todo preparado: mochila, bocadillos, y una gorra de repuesto por si a la primera se le vuelve a dormir encima un zorro de fuego.' },
		],
		b01_enc_aurelio_1: [
			{ set: { 'flag.b01_enc_aurelio_1': true } },
			{ text: 'Delante de la valla de la Puerta, un ranchero mayor sostiene el sombrero contra el pecho, como si estuviera delante de una iglesia. Es Don Aurelio.' },
			{ say: 'aurelio', text: 'Muchach{o|a|e}. Qué gusto. Aquí me tiene, mirando la puerta de mi casa. Que no es mi casa, pero es la puerta.' },
			{ say: 'aurelio', text: 'Las niñas se han quedado en el corral de la Ruta 5. Me las cuida un señor de Vánitas muy amable, que no me cobra. Yo vengo cada mañana a preguntar cuándo sale la primera Puerta para Johto. Cada mañana me dicen «pronto». Pronto es una palabra muy larga.' },
			{ if: 'flag.b01_candela_unida', then: [{ say: 'aurelio', text: '¿Y Candela? ¿Está con usted? Déjela salir un ratito, que la vea. …Ay, mírela. Ya no brilla de miedo. Brilla porque le da la gana.' }, { happy: { who: 'mareep', n: 5 } }] },
			{ if: 'flag.b01_mareep_lemnis && !flag.b01_mareep_jaula', then: [{ say: 'aurelio', text: 'A los de traje azul les pregunto también por Chispita. Me dicen que «está en proceso». Yo les digo que una Mareep no es un trámite. Se ríen. Yo no.' }] },
			{ say: 'aurelio', text: 'Dicen que esa Puerta lleva a cualquier sitio. Yo solo quiero que lleve a uno. Con eso me basta.' },
		],
		b01_enc_hector_1: [
			{ set: { 'flag.b01_enc_hector_1': true } },
			{ say: 'hector', text: '…¿Y una figura de Esprit? ¿Un póster? ¿Una taza? ¿Nada? ¿Ni una pegatina? —El quiosquero niega con la cabeza—. Vale. Gracias. Seguiré buscando.' },
			{ say: 'hector', text: '¡{jugador}! ¡Estoy en Luminalia! ¡La ciudad de Esprit! He pedido tres días de vacaciones en la aseguradora. Me han dado dos. Y medio, si hago horas extra.' },
			{ say: 'hector', text: 'La Agencia de Detectives está ahí al lado. Dicen que allí saben cosas. He pasado por delante seis veces. No he entrado ninguna. ¿Y si me dicen que Esprit no existe? ¿Y si me dicen que sí?' },
			{ choice: [
				{ text: '«Entra. Lo peor que puede pasar es que te den un caso.»', then: [{ say: 'hector', text: '¿Un caso? ¿Un caso de verdad? —Se le iluminan los ojos detrás de la máscara, que lleva puesta sin darse cuenta—. Mañana. Mañana entro. Hoy ensayo.' }] },
				{ text: '«Ser héroe no es el traje, ¿te acuerdas?»', then: [{ say: 'hector', text: '…Lo tengo apuntado en la mano. Mira. —Se le ha borrado la mitad con el sudor. Pone «Ser héroe no es el tra»—. Me acuerdo. Me acuerdo casi entero.' }] },
			] },
			{ say: 'hector', text: '¡Hawlucha, vamos! ¡A dar seis vueltas más a la manzana! ¡Por la justicia! ¡Y por los nervios!' },
		],
		b01_enc_philippe_1: [
			{ set: { 'flag.b01_enc_philippe_1': true } },
			{ say: 'philippe', text: '¡{jugador}! ¡Mi salvador{|a|e} de barajas! Mira, mira qué casita. Dos plantas, jardín, vistas al gimnasio. Bueno, vistas a la pared del gimnasio. La pared es muy bonita. Es de roca.' },
			{ say: 'philippe', text: 'Un consejo inmobiliario, gratis: no se compra una casa. Se compra un sitio al que volver. La casa viene incluida. Phil-osofía.' },
			{ say: 'philippe', text: 'Tú ahora vas de aquí para allá, ya lo sé. Pero un día querrás un sitio para tus Pokémon, tus trofeos, tus cosas. Y ese día, ¿a quién vas a llamar? A Philippe. Te guardo la ficha.' },
			{ text: 'Saca una carta de la manga para impresionarte. Sale volando, rebota en el cartel de «SE VENDE» y aterriza en un charco. Philippe la mira un rato.' },
			{ say: 'philippe', text: 'Eso también era parte del truco. Lo del charco. Es un truco de agua.' },
		],
		b01_enc_gaspar_1: [
			{ set: { 'flag.b01_enc_gaspar_1': true } },
			{ text: 'En el paseo marítimo, Gaspar remueve una olla enorme con un cucharón de madera. Huele a mar, a mantequilla y a algo que hace que te ruja el estómago.' },
			{ say: 'gaspar', text: '¡Hombre! ¡Mi proveedor{|a|e} favorit{o|a|e}! Siéntate. Sopa de Shellder. Bueno, sopa de lo que el Shellder soltó. El Shellder está bien. Se ha ido muy ofendido.' },
			{ say: 'gaspar', text: 'Me han hablado de un líder de Kanto que está en Novarte y que cocina para sus Pokémon antes que para él. Tengo que conocerlo. O ganarle. O las dos cosas. Primero conocerlo.' },
			{ say: 'gaspar', text: 'Y luego, Johto. Dicen que en Ciudad Iris hacen unos dulces que te hacen llorar. Para mi recetario. Si vas por allí, búscame. Seguramente estaré llorando delante de un pastelito.' },
			{ give: 'lumiosegalette' },
			{ say: 'gaspar', text: 'Toma, para el camino. No es mía, es de una pastelería de Luminalia. Pero le he añadido valentía.' },
		],
		b01_enc_tobias_1: [
			{ set: { 'flag.b01_enc_tobias_1': true } },
			{ say: 'tobias', text: '¡Patrocinadores, bienvenidos al episodio cuarenta y nueve! ¡El especial de playa! Duquesa y yo vamos a explorar… —se gira hacia la Poké Ball, que no se abre— …yo voy a explorar la playa. Duquesa está en contra de la arena.' },
			{ say: 'tobias', text: '¡{jugador}! ¡Invitad{o|a|e} estrella! ¿Saludas a la audiencia? Hoy hay… —mira el móvil— …ocho personas. Ha bajado un poco desde la cueva. Pero son ocho personas muy fieles. Una es mi madre.' },
			{ choice: [
				{ text: 'Saludar a la cámara.', then: [{ say: 'tobias', text: '¡Nueve personas! ¡Ha entrado alguien nuevo! …Ah, no, es mi madre otra vez desde la tablet.' }] },
				{ text: '«¿Qué tal está Duquesa?»', then: [{ text: 'La Poké Ball se abre un dedo. Sale una pata con las uñas fuera, te da un toquecito en la rodilla y vuelve a entrar.' }, { say: 'tobias', text: '¡Te ha tocado! ¡Eso es un saludo! ¡O una amenaza! ¡Con Duquesa son la misma cosa!' }] },
			] },
			{ say: 'tobias', text: 'La próxima mazmorra… todavía no lo sé. Los patrocinadores votarán. He puesto una encuesta. La he votado yo. Va ganando una torre de Johto donde todo se tambalea.' },
		],
		b01_enc_nate_1: [
			{ set: { 'flag.b01_enc_nate_1': true } },
			{ text: 'Nate está tumbado en la arena, con los brazos detrás de la cabeza. A lo lejos, Rhi hace sprints en la orilla con su Raboot, gritando cosas.' },
			{ say: 'nate', text: 'Ah. Hola.' },
			{ say: 'nate', text: 'Ella entrena. Yo la miro. Es casi lo mismo.' },
			{ choice: [
				{ text: '«¿Y cuándo entrenas tú?»', then: [{ say: 'nate', text: 'Ahora. Estoy entrenando la paciencia. Es la más difícil. Rhi no la ha desbloqueado.' }] },
				{ text: 'Tumbarte a su lado un rato.', then: [{ text: 'Os quedáis los dos mirando el cielo. Pasa una gaviota. Pasa otra. Nate no dice nada. Es un silencio sorprendentemente cómodo.' }, { say: 'nate', text: 'Tú lo entiendes.' }] },
			] },
			{ say: 'rhi', text: '¡NATE! ¡Que te estoy viendo! ¡Diez sprints! ¡AHORA!' },
			{ say: 'nate', text: 'Qué flojera. —No se mueve—. Dice que la próxima vez te gana. Lo ha dicho cuarenta veces. A mí, ninguna.' },
		],
	},
};
