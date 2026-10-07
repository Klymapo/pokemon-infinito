// Bloque 4 · Tramo 1: «Ocho» (~3 h 30).
// Ruta 5 (Azafrán → Celeste) → Ciudad Celeste (Noa, tienda de bicis, la Cueva desde fuera, Gimnasio)
// → Rutas 24 y 25 (Puente Pepita, Bastien) → Casa de Bill (Sintonizador, Misty en el Cabo, zona de entrenamiento)
// → Misty (medalla 8, clasificación) → noche en Celeste (sueño de aura) → Ysolde propone la Operación Tejado.
// Final: b04_m2 hecha y b04_m4 a «tejado» (cuando Misty y Bill están hechos).

// ---------- Condiciones reutilizadas ----------
const LUC = '(inParty("riolu") || inParty("lucario"))';
const GYM_T = 'beat("gym_celeste_1") && beat("gym_celeste_2")';
const FIN_OK = 'beat("misty_g8") && flag.b04_bill_hecho && !flag.b04_t1_fin';
const BEBIDA = '(has("freshwater") || has("sodapop") || has("lemonade"))';

export default {
	// =====================================================================
	// LUGARES NUEVOS
	// =====================================================================
	locations: {
		// =================== RUTA 5 ===================
		k_ruta5: {
			name: 'Ruta 5', short: 'Ruta 5', region: 'kanto', kind: 'route', map: { x: 50, y: 38 },
			bg: { type: 'route', flowers: '#e98aa8', hill: '#7aa05a', far: '#9ab8d0' },
			desc: 'Al norte de Azafrán, el asfalto se acaba de golpe y empieza la hierba. Un camino de tierra sube entre setos bajos, casas con huerto y la vieja **Guardería**, con su valla blanca y sus Pokémon dormitando al sol.\n\nAl fondo, donde el terreno baja, brilla un río. Allí está **Ciudad Celeste**.',
			descNight: 'De noche, la Ruta 5 huele a hierba mojada. Las ventanas de la Guardería tienen la luz encendida; dentro, alguien cuenta Pokémon en voz baja para no despertarlos. Al norte, las farolas de Celeste se reflejan en el río como una fila de lunas pequeñas.',
			links: ['azafran', 'celeste'],
			enterCond: 'flag.b04_t0_hecho',
			blockedMsg: 'En la puerta norte de Azafrán, un guardia con gorra levanta la mano. «Los de la Gira tienen asuntos pendientes en la ciudad. Primero eso, luego el norte. Órdenes de arriba». Mira hacia arriba, como si «arriba» fuera un sitio concreto. Lo es.',
			mapNote: 'Guardería · camino a Celeste',
			rumors: [
				{ text: 'Antes, el guardia de la puerta norte de Azafrán no dejaba pasar a nadie sin una bebida. Ahora le han puesto una fuente. Dicen que la mira con rencor.' },
				{ text: 'En la Guardería de la Ruta 5 juran que dejaron un Ditto y les devolvieron dos huevos y una disculpa.' },
				{ text: 'Los Pidgeotto de esta ruta vuelan muy bajo desde hace un mes. Los viejos dicen que va a llover. No llueve.' },
			],
			route: {
				from: 'azafran', to: 'celeste', length: 7, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [
						{ text: 'Cruzas la puerta norte de Azafrán. Detrás quedan los rascacielos, la Torre Lemnis y ese zumbido de ciudad grande que no se nota hasta que deja de sonar.' },
						{ talk: [{ cond: '!flag.b04_guarda_bebida', script: 'b04_guarda_k5' }, { script: 'b04_guarda_k5_despues' }], label: 'El guardia de la puerta norte', sub: 'Mira una fuente nueva con mucho rencor', icon: '💂' },
					],
					1: [
						{ trainer: 'r5_rigoberto' },
						{ item: 'hyperpotion' },
					],
					2: [
						{ text: 'La **Guardería** de la Ruta 5: una casita con valla blanca y un prado detrás. Un Snorlax pequeño duerme encima de otro Snorlax más grande. Una señora riega las petunias a su alrededor sin inmutarse.' },
						{ trainer: 'r5_benjamin', optional: true, label: 'Un chico con túnica medita en mitad del camino' },
					],
					3: [
						{ script: 'b04_petra_mensaje', once: true },
						{ item: 'bigmushroom', hidden: true },
					],
					4: [
						{ trainer: 'r5_sonsoles' },
						{ spot: { action: { gather: 'setas_k5' } }, label: 'Corro de setas bajo un roble', icon: '🍄', sub: 'Huele a lluvia aunque no ha llovido' },
					],
					5: [
						{ text: 'Una caseta de piedra con una escalera que baja: la entrada a un **paso subterráneo** que cruza hasta el otro lado de Azafrán. Huele a humedad y a palomitas de hace años.' },
						{ text: 'En una farola, a la altura de los ojos, hay una pluma gris clavada. Apunta al norte.', cond: 'flag.b03_ysolde_sede' },
						{ item: 'revive', hidden: true },
					],
					6: [
						{ trainer: 'r5_leandra' },
						{ item: 'ultraball' },
					],
					7: [{ text: 'El camino baja hasta un puente de piedra. Debajo, un río ancho y transparente. Al otro lado, casas de tejado azul, un gimnasio con forma de piscina y gente en bicicleta: **Ciudad Celeste**.' }],
				},
				encounters: {
					grass: [
						{ sp: 'pidgeotto', lv: [45, 47], w: 18 },
						{ sp: 'persian', lv: [46, 48], w: 14 },
						{ sp: 'gloom', lv: [45, 47], w: 14 },
						{ sp: 'weepinbell', lv: [45, 47], w: 14 },
						{ sp: 'primeape', lv: [46, 48], w: 8 },
						{ sp: 'wigglytuff', lv: [46, 48], w: 8 },
						{ sp: 'kadabra', lv: [46, 48], w: 6 },
						{ sp: 'golbat', lv: [46, 48], w: 10, time: 'night' },
						{ sp: 'pidgeot', lv: [48, 50], w: 4 },
						{ sp: 'oricoriopompom', lv: [46, 48], w: 5, displaced: true },
						{ sp: 'toucannon', lv: [46, 48], w: 4, displaced: true },
					],
				},
			},
		},

		// =================== CIUDAD CELESTE ===================
		celeste: {
			name: 'Ciudad Celeste', short: 'Celeste', region: 'kanto', kind: 'city', map: { x: 50, y: 22 },
			bg: { type: 'city', roofs: ['#3b7ac4', '#8ab0c8', '#e9e3d0', '#2a5a9a'], far: '#8ab0c8' },
			desc: 'Una ciudad atravesada por agua: un río ancho y transparente, canales, puentes de piedra y casas de tejado azul. Todo el mundo va en bicicleta, y quien no, va a nado. Huele a río y a cloro.\n\nEl **Gimnasio** parece una piscina con techo. Al norte empieza el **Puente Pepita**. Al oeste, al otro lado del río, una ladera de roca con la boca oscura de una cueva… y una valla nueva, azul y plata.',
			descNight: 'De noche, Celeste se refleja entera en el río. Las bicicletas duermen apoyadas en las farolas. Al oeste, junto a la boca de la cueva, hay focos encendidos y un generador que ronca. Antes no había nada.',
			descs: [
				{ cond: 'beat("misty_g8") && night', text: 'De noche, Celeste se refleja entera en el río. En la puerta del Gimnasio alguien ha colgado un cartel a mano: «Hoy la líder ha perdido. Está de buen humor. No le pregunten por qué». Al oeste, los focos de la valla siguen encendidos.' },
				{ cond: 'beat("misty_g8")', text: 'Celeste, con su río, sus puentes y sus bicicletas. En la puerta del Gimnasio alguien ha pegado una foto de la líder con el pulgar hacia arriba y un texto: «Ha perdido. Está bien. Dejen de preguntar».\n\nAl oeste, la valla azul y plata de la cueva sigue ahí.' },
			],
			links: ['k_ruta5', 'ruta24'],
			mapNote: 'Gimnasio (Misty) · Puente Pepita · la Cueva',
			onEnter: [
				{ script: 'b04_celeste_llegada', cond: '!flag.b04_celeste_llegada', once: true },
				{ script: 'b04_t1_fin', cond: FIN_OK },
			],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda de Celeste', action: { shop: 'tienda_celeste' } },
				{ label: 'Gimnasio de Celeste', sub: 'Líder: Misty (Agua)', icon: '💧', action: { go: 'gym_celeste' }, new: '!beat("misty_g8") && (!visited("gym_celeste") || flag.b04_misty_cabo)' },
				{ label: 'Tienda de bicis', sub: 'Una bici de escaparate con un precio imposible', icon: '🚲', action: { go: 'bicis_celeste' }, new: '!flag.b04_rueda_visto && !flag.b04_bill_hecho' },
				{ label: 'Callejón de la tienda de bicis', sub: 'Alguien con uniforme de Lemnis espera entre neumáticos', icon: '🛞', cond: 'flag.b04_celeste_llegada && !flag.b04_noa_celeste', new: 'true', talk: [{ script: 'b04_noa_celeste' }] },
				{ label: 'La casa del agujero', sub: 'Una pared con un boquete enmarcado', icon: '🏚️', talk: [{ script: 'b04_casa_agujero' }] },
				{ label: 'Orilla oeste del río', sub: 'Una valla azul y plata delante de una cueva', icon: '🚧', cond: '!flag.b04_silph_hecho', new: '!flag.b04_cueva_vista', talk: [{ script: 'b04_cueva_fuera' }] },
				{ label: 'Pescar en el río', sub: 'El agua es tan clara que se ven los Goldeen', icon: '🎣', action: { explore: 'water' } },
				{ label: 'Rotom: ¿qué me queda?', sub: 'Repasa lo pendiente en Celeste', icon: '📱', cond: 'flag.b04_celeste_llegada && !flag.b04_t1_fin', talk: [{ script: 'b04_celeste_pendiente' }] },
				{ label: 'Pasar la noche en el Centro', sub: 'Misty y Bill, hechos. Mañana, Azafrán', icon: '🌙', cond: FIN_OK, new: 'true', talk: [{ script: 'b04_t1_fin' }] },
			],
			encounters: {
				water: [
					{ sp: 'goldeen', lv: [45, 47], w: 26 },
					{ sp: 'seaking', lv: [47, 49], w: 12 },
					{ sp: 'psyduck', lv: [45, 47], w: 16 },
					{ sp: 'golduck', lv: [47, 49], w: 8 },
					{ sp: 'poliwhirl', lv: [45, 47], w: 14 },
					{ sp: 'slowpoke', lv: [45, 47], w: 10 },
					{ sp: 'slowbro', lv: [48, 50], w: 4, time: 'night' },
				],
			},
			rumors: [
				{ text: 'La líder del gimnasio desaparece algunas tardes. Dicen que se va al Cabo, al final de la Ruta 25, a mirar el mar. Dicen que si la molestas allí, te tira al agua.' },
				{ text: 'Lemnis ha vallado la orilla oeste del río, donde la cueva. «Estudio geológico». Los pescadores de toda la vida dicen que las rocas llevan ahí quietas mil años y que nunca habían necesitado vigilancia.' },
				{ text: 'De noche, los Goldeen del río nadan contra la corriente. Todos hacia el oeste. Todos hacia la cueva.' },
				{ text: 'En la tienda de bicis hay una bici en el escaparate que cuesta un millón. Nadie la ha comprado nunca. El dueño la limpia todas las mañanas.' },
				{ cond: 'beat("misty_g8")', text: 'Dicen que alguien de la Gira le ganó a Misty sin despeinarse. Misty dice que se despeinó. Que se despeinó muchísimo.' },
			],
		},

		// ---------- Gimnasio de Celeste ----------
		gym_celeste: {
			name: 'Gimnasio de Celeste', parent: 'celeste', kind: 'gym',
			bg: { type: 'gym', wall: '#8ab0c8', floor: '#3b7ac4' },
			desc: 'Dentro, el gimnasio es una piscina enorme con plataformas flotantes que se mecen al pisarlas. El agua es tan azul que parece pintada. Huele a cloro y, muy al fondo, a crema solar.\n\nEn las gradas, unos niños con flotador gritan el nombre de su líder aunque no esté.',
			mapNote: 'Líder: Misty (Agua)',
			spots: [
				{ label: 'Entrenadora: Nadadora Lucía', icon: '🏊', action: { trainer: 'gym_celeste_1' } },
				{ label: 'Entrenador: Nadador Abel', icon: '🏊', action: { trainer: 'gym_celeste_2' } },
				{ label: 'La plataforma de la líder', sub: 'Vacía. Hay una toalla con un Starmie bordado', icon: '🧺', cond: '!flag.b04_misty_cabo', talk: [{ script: 'b04_misty_ausente' }] },
				{ label: 'Misty', sub: 'Sentada en el trampolín, con los pies en el agua', icon: '💧', cond: 'flag.b04_misty_cabo && !(' + GYM_T + ')', talk: [{ script: 'b04_misty_antes' }] },
				{ label: 'Misty', sub: 'Líder · tipo Agua', icon: '💧', cond: 'flag.b04_misty_cabo && ' + GYM_T, new: '!beat("misty_g8")', talk: [{ cond: 'beat("misty_g8")', script: 'b04_misty_despues' }, { script: 'b04_misty_reto' }] },
			],
		},

		// ---------- Tienda de bicis ----------
		bicis_celeste: {
			name: 'Tienda de bicis', parent: 'celeste', kind: 'building',
			bg: { type: 'indoor', wall: '#e9e3d0', floor: '#8a7a5a' },
			desc: 'Bicicletas colgadas del techo como murciélagos de colores. Olor a goma y a aceite. En el escaparate, sobre una tarima con terciopelo, una bicicleta plegable roja con una etiqueta: **1.000.000 ₽**.\n\nDetrás del mostrador, un señor con bigote y delantal la mira como quien mira a un hijo que no se va de casa.',
			mapNote: 'Bicicletas (caras)',
			spots: [
				{ label: 'El dueño', sub: 'Pule un timbre que ya brilla', icon: '🧔', new: '(!flag.b04_rueda_visto && !flag.b04_bill_hecho) || (flag.b04_rueda_entregada && !done.b04_s_rueda)', talk: [
					{ cond: 'flag.b04_rueda_entregada && !done.b04_s_rueda', script: 'b04_rueda_gracias' },
					{ cond: '!flag.b04_rueda_visto && !flag.b04_bill_hecho', script: 'b04_rueda_encargo' },
					{ script: 'b04_bicis_generico' },
				] },
				{ label: 'La bici del escaparate', sub: '1.000.000 ₽. Plegable. Roja', icon: '🚲', talk: [{ script: 'b04_bici_escaparate' }] },
			],
		},

		// =================== RUTAS 24 Y 25 ===================
		ruta24: {
			name: 'Rutas 24 y 25', short: 'Rutas 24-25', region: 'kanto', kind: 'route', map: { x: 64, y: 10 },
			bg: { type: 'route', flowers: '#f2c43a', hill: '#6a9a5a', far: '#8ab0c8' },
			desc: 'Al norte de Celeste, el **Puente Pepita** cruza el río: largo, de madera clara, con barandillas pintadas de amarillo. Dicen que nadie lo cruza sin combatir cinco veces. Es tradición.\n\nAl otro lado, la **Ruta 25** gira hacia el este por una costa de hierba alta y flores, hasta un cabo donde vive un inventor.',
			descNight: 'De noche, el Puente Pepita está iluminado con farolillos amarillos que se mecen con el viento. Debajo, el río suena más fuerte que de día. Al este, en el cabo, hay una casa con todas las luces encendidas. Siempre.',
			links: ['celeste', 'casa_bill'],
			mapNote: 'Puente Pepita (5 combates seguidos)',
			rumors: [
				{ text: 'En el Puente Pepita hay que ganar cinco combates seguidos. Al final, alguien te ofrece algo. Hace años era una organización de uniforme negro. Ahora es otra, con mejor corbata.' },
				{ text: 'En la casa del cabo vive Bill, el que inventó el sistema de PC. Dicen que una vez se convirtió en Pokémon. Él dice que fue «una fusión temporal». No es lo mismo, dice.' },
				{ text: 'Desde la mitad del Puente Pepita se ven los mejores atardeceres de Kanto. Los fotógrafos se pelean por la tercera farola.' },
			],
			route: {
				from: 'celeste', to: 'casa_bill', length: 9, terrain: 'grass', rate: 0.2,
				tramos: {
					0: [
						{ text: 'El arranque del **Puente Pepita**. Un cartel de madera: «5 entrenadores · 5 combates · 1 premio». Debajo, en tiza, alguien ha añadido: «y 0 descansos».' },
						{ script: 'b04_puente_entrada', once: true },
						{ talk: [
							{ cond: '!flag.b04_bastien_puente', script: 'b04_bastien_puente' },
							{ cond: '!beat("bastien_5")', script: 'b04_bastien_revancha' },
							{ script: 'b04_bastien_despues' },
						], label: 'Bastien', sub: 'Sentado en la barandilla, leyendo un contrato', icon: '📒', new: '!flag.b04_bastien_puente' },
					],
					1: [
						{ terrain: 'path' },
						{ trainer: 'pepita_1' },
						{ text: 'Las tablas del puente crujen con cada paso. Abajo, el río corre limpio. Un Goldeen salta, te mira y vuelve al agua con cara de saber algo.' },
					],
					2: [
						{ terrain: 'path' },
						{ trainer: 'pepita_2' },
						{ spot: { action: { gather: 'orilla_pepita' } }, label: 'Escalerilla a la orilla', icon: '🐚', sub: 'El río deja cosas entre las piedras' },
					],
					3: [
						{ terrain: 'path' },
						{ text: 'La tercera farola del puente. Hay marcas de trípode en la madera. Muchas. Aquí nadie reta a nadie: es el sitio de las fotos, y el puente lo respeta. Te apoyas en la barandilla y dejas que tu equipo respire.' },
						{ talk: [{ script: 'b04_foto_puente' }], label: 'La tercera farola', sub: 'Rotom quiere su foto', icon: '📸', cond: 'badge("medalla_cascada") && !has("fotopuente")', new: 'true' },
						{ item: 'pearl', hidden: true },
					],
					4: [
						{ terrain: 'path' },
						{ trainer: 'pepita_3' },
					],
					5: [
						{ terrain: 'path' },
						{ trainer: 'pepita_4' },
						{ script: 'b04_pepita_5', once: false, mark: true, cond: '!flag.b04_puente_hecho' },
					],
					6: [
						{ text: 'Fin del puente. La **Ruta 25** se abre hacia el este: hierba alta hasta la cintura, flores amarillas y el mar al fondo, muy azul.' },
						{ item: 'ultraball' },
					],
					7: [
						{ trainer: 'r25_telmo' },
						{ item: 'rarecandy', hidden: true },
					],
					8: [
						{ trainer: 'r25_nerea' },
						{ trainer: 'r25_ambrosio', optional: true, label: 'Un montañero descansa sobre su mochila' },
						{ terrain: 'flowers' },
						{ text: 'Un campo entero de flores amarillas que se doblan hacia el mar. Un Butterfree se posa en tu hombro, decide que no eres una flor y se va decepcionado.' },
					],
					9: [{ text: 'Al final de la costa, sobre el cabo, una casa blanca con una antena enorme en el tejado y un buzón con forma de Poké Ball. En la puerta, un cartel: «**BILL** · Pokémaníaco · Llamar fuerte (estoy dentro de algo)».' }],
				},
				encounters: {
					grass: [
						{ sp: 'butterfree', lv: [45, 47], w: 14 },
						{ sp: 'beedrill', lv: [45, 47], w: 14 },
						{ sp: 'pidgeotto', lv: [46, 48], w: 14 },
						{ sp: 'gloom', lv: [45, 47], w: 12 },
						{ sp: 'weepinbell', lv: [45, 47], w: 12 },
						{ sp: 'kadabra', lv: [46, 48], w: 6 },
						{ sp: 'venomoth', lv: [46, 48], w: 10, time: 'night' },
						{ sp: 'victreebel', lv: [48, 50], w: 3 },
						{ sp: 'togedemaru', lv: [46, 48], w: 6, displaced: true },
						{ sp: 'ribombee', lv: [46, 48], w: 4, displaced: true, time: 'day' },
					],
					flowers: [
						{ sp: 'butterfree', lv: [45, 47], w: 20 },
						{ sp: 'gloom', lv: [45, 47], w: 18 },
						{ sp: 'weepinbell', lv: [45, 47], w: 16 },
						{ sp: 'beedrill', lv: [45, 47], w: 12 },
						{ sp: 'vileplume', lv: [48, 50], w: 3 },
						{ sp: 'ribombee', lv: [46, 48], w: 6, displaced: true, time: 'day' },
						{ sp: 'venomoth', lv: [46, 48], w: 10, time: 'night' },
					],
				},
			},
		},

		// =================== CASA DE BILL ===================
		casa_bill: {
			name: 'Casa de Bill', short: 'Casa de Bill', region: 'kanto', kind: 'area', map: { x: 84, y: 8 },
			bg: { type: 'coast', far: '#3b7ac4' },
			desc: 'Una casa blanca en lo alto de un cabo, con una antena en el tejado que parece una flor de metal. Por fuera es un desastre: cables, cajas, una lavadora sin puerta, un Magnemite durmiendo en el canalón.\n\nPor dentro, dicen, es la casa más ordenada de Kanto.\n\nDetrás, el **Cabo**: rocas, hierba y el mar abierto.',
			descs: [{ cond: 'flag.b04_bill_hecho', text: 'La casa de Bill en el cabo. La antena del tejado gira despacio. En la ventana, Bill te saluda con un destornillador en cada mano. Un Clefairy te saluda con las dos manos vacías, por si acaso.\n\nDetrás, el **Cabo** y el mar.' }],
			links: ['ruta24'],
			mapNote: 'Bill · Cabo (entrenamiento, nivel 53)',
			rumors: [
				{ text: 'Bill tiene un Clefairy que abre la puerta. La gente le habla muy despacio, por si es Bill. No es Bill. Ya no.' },
				{ text: 'En el Cabo, al atardecer, se ven Lapras a lo lejos. O eso dice el socorrista. El socorrista dice muchas cosas.' },
			],
			spots: [
				{ label: 'Bill', sub: 'Se oyen martillazos dentro', icon: '🔧', new: '!flag.b04_bill_hecho', talk: [{ cond: '!flag.b04_bill_hecho', script: 'b04_bill' }, { script: 'b04_bill_despues' }] },
				{ label: 'PC de Bill', sub: 'El original. Tiene pegatinas', icon: '💻', action: { pc: true } },
				{ label: 'El Cabo', sub: 'Alguien grita en las rocas', icon: '🌊', cond: '!flag.b04_misty_cabo', new: 'true', talk: [{ script: 'b04_misty_cabo' }] },
				{ label: 'El Cabo', sub: 'Zona de entrenamiento (nivel recomendado 53)', icon: '🥋', cond: 'flag.b04_misty_cabo', action: { training: {
					cap: 53, trainers: ['cabo_1', 'cabo_2', 'cabo_3'], coach: 'Socorrista del Cabo',
					wild: [{ sp: 'seaking', lv: [50, 52] }, { sp: 'golduck', lv: [50, 52] }, { sp: 'kingler', lv: [50, 52] }, { sp: 'seadra', lv: [50, 52] }],
					closed: 'El socorrista te mira el equipo, se baja las gafas de sol y vuelve a subírselas. «Aquí ya no hay olas para ti. Vete a por la líder, anda, que la estás haciendo esperar».',
				} } },
				{ label: 'Pescar desde las rocas', sub: 'Mar abierto, agua fría', icon: '🎣', action: { explore: 'water' } },
				{ label: 'Flores del Cabo', icon: '🌼', action: { gather: 'flores_cabo' } },
			],
			encounters: {
				water: [
					{ sp: 'seaking', lv: [46, 48], w: 22 },
					{ sp: 'kingler', lv: [46, 48], w: 18 },
					{ sp: 'tentacruel', lv: [46, 48], w: 18 },
					{ sp: 'seadra', lv: [46, 48], w: 12 },
					{ sp: 'golduck', lv: [47, 49], w: 10 },
					{ sp: 'slowbro', lv: [47, 49], w: 8 },
					{ sp: 'lapras', lv: [48, 50], w: 3 },
				],
			},
		},
	},

	// =====================================================================
	// ENTRENADORES
	// =====================================================================
	trainers: {
		// ----- Ruta 5 -----
		r5_rigoberto: { name: 'Rigoberto', cls: 'Domador', ai: 2,
			team: [
				{ sp: 'primeape', lv: 47, moves: ['crosschop', 'uturn', 'rockslide', 'screech'] },
				{ sp: 'arcanine', lv: 48, moves: ['flamethrower', 'crunch', 'extremespeed', 'wildcharge'] },
			],
			intro: '¡Mi Arcanine saltaba por un aro de fuego! Desde que pasan los trenes magnéticos por debajo, salta, se queda dentro del aro y mira al sur. ¡A ver si un combate lo saca!',
			win: 'Ni el aro ni el combate. Mira al sur. Hacia Azafrán. Como si alguien lo llamara.',
			look: { hair: 'short', hairColor: '#4a2a1a', outfit: '#8a3a2a', outfit2: '#2b2b38', skin: 3, eyesStyle: 'sharp', mouth: 'grin', acc: 'mustache hat' } },
		r5_benjamin: { name: 'Benjamín', cls: 'Psíquico', ai: 2,
			team: [
				{ sp: 'hypno', lv: 48, moves: ['psychic', 'shadowball', 'thunderpunch', 'hypnosis'] },
				{ sp: 'mrmime', lv: 49, moves: ['psychic', 'dazzlinggleam', 'thunderbolt', 'reflect'] },
			],
			intro: 'El Gimnasio de Azafrán está en pausa. La líder nos dijo que entrenáramos «donde el ruido sea otro». Aquí el ruido es un Pidgeotto. Es muchísimo ruido.',
			win: 'Te vi ganar antes de empezar. Lo que no vi fue cómo. Eso es lo interesante.',
			look: { hair: 'long', hairColor: '#2a2440', outfit: '#6a4a8a', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'sleepy', mouth: 'flat' } },
		r5_sonsoles: { name: 'Sonsoles', cls: 'Criadora', ai: 2,
			team: [
				{ sp: 'ditto', lv: 47, moves: ['transform'] },
				{ sp: 'kangaskhan', lv: 49, moves: ['return', 'suckerpunch', 'earthquake', 'crunch'] },
			],
			intro: 'Dejé un Ditto en la Guardería para que hiciera amigos. Me lo devolvieron con dos huevos y una disculpa por escrito. ¿Combatimos? El Ditto ya sabe hacerse el tuyo.',
			win: 'La Guardería me va a mandar otra disculpa. Esta vez por ti.',
			look: { hair: 'bun', hairColor: '#8a5a2f', outfit: '#e98aa8', outfit2: '#e9e3d0', skin: 2, eyesStyle: 'happy', mouth: 'smile', acc: 'glasses' } },
		r5_leandra: { name: 'Leandra', cls: 'Ornitóloga', ai: 2,
			team: [
				{ sp: 'fearow', lv: 48, moves: ['drillpeck', 'drillrun', 'uturn', 'pursuit'] },
				{ sp: 'pidgeot', lv: 50, moves: ['hurricane', 'uturn', 'quickattack', 'roost'] },
			],
			intro: 'Los Pidgeotto de esta ruta vuelan bajo desde hace un mes. Los míos también. Será el tiempo. …No es el tiempo. ¡Combate!',
			win: 'Vuelan bajo. Hasta para perder vuelan bajo.',
			look: { hair: 'ponytail', hairColor: '#c4a06a', outfit: '#6a9a5a', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'normal', mouth: 'open', acc: 'hat' } },

		// ----- Puente Pepita -----
		pepita_1: { name: 'Rufino', cls: 'Cazabichos', ai: 2,
			team: [
				{ sp: 'butterfree', lv: 47, moves: ['bugbuzz', 'sleeppowder', 'psybeam', 'airslash'] },
				{ sp: 'beedrill', lv: 48, moves: ['poisonjab', 'xscissor', 'drillrun', 'pinmissile'] },
			],
			intro: '¡Primero de cinco! Llevo once años siendo el primero del Puente Pepita. Nadie quiere ser el primero. Al primero lo gana todo el mundo. ¡Pero con estilo!',
			win: 'Once años. Once años perdiendo con estilo. Es un récord. Creo.',
			look: { hair: 'cap', hairColor: '#4a3a2a', outfit: '#6a9a5a', outfit2: '#f2c43a', skin: 2, eyesStyle: 'happy', mouth: 'grin', capColor: '#f2c43a' } },
		pepita_2: { name: 'Elvira', cls: 'Chica', ai: 2,
			team: [
				{ sp: 'clefable', lv: 48, moves: ['moonblast', 'thunderwave', 'meteormash', 'softboiled'] },
				{ sp: 'wigglytuff', lv: 48, moves: ['hypervoice', 'dazzlinggleam', 'sing', 'fireblast'] },
			],
			intro: '¡Segunda! El puente es como una conversación: el primero saluda, la segunda pregunta. Yo pregunto: ¿cuántas medallas? ¡No me lo digas! ¡Enséñamelo!',
			win: 'Ya, muchas. Muchas medallas. Ya lo he entendido.',
			look: { hair: 'bob', hairColor: '#e0763a', outfit: '#e98aa8', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'happy', mouth: 'smile', acc: 'bow' } },
		pepita_3: { name: 'Gonzalo', cls: 'Joven', ai: 2,
			team: [
				{ sp: 'sandslash', lv: 48, moves: ['earthquake', 'slash', 'rockslide', 'poisonjab'] },
				{ sp: 'raticate', lv: 49, moves: ['hyperfang', 'crunch', 'suckerpunch', 'uturn'] },
			],
			intro: '¡Tercero! ¿Sabes que mi Raticate está en el uno por ciento de los mejores Raticate? ¡Lo dice una página! ¡Una página muy seria!',
			win: 'Igual la página no era tan seria.',
			look: { hair: 'cap', hairColor: '#2b2b38', outfit: '#3b5bb5', outfit2: '#e9e3d0', skin: 2, eyesStyle: 'normal', mouth: 'grin', capColor: '#c4473a' } },
		pepita_4: { name: 'Pilar', cls: 'Chica', ai: 2,
			team: [
				{ sp: 'pidgeot', lv: 49, moves: ['hurricane', 'uturn', 'quickattack', 'roost'] },
				{ sp: 'nidoqueen', lv: 49, moves: ['earthpower', 'sludgebomb', 'icebeam', 'superpower'] },
			],
			intro: 'Cuarta. La penúltima. El que viene detrás de mí no es del puente. Llegó hace un mes con un traje y un maletín. Gánale. Por favor. Por el puente.',
			win: 'Bien. Ahora gánale a él. Y si te ofrece algo, lee la letra pequeña.',
			look: { hair: 'braids', hairColor: '#3a2a1e', outfit: '#f2c43a', outfit2: '#3b5bb5', skin: 3, eyesStyle: 'normal', mouth: 'flat' } },
		pepita_5: { name: 'Casimiro', cls: 'Cazatalentos', ai: 3,
			team: [
				{ sp: 'persian', lv: 50, moves: ['fakeout', 'knockoff', 'uturn', 'playrough'], ability: 'technician' },
				{ sp: 'hypno', lv: 50, moves: ['psychic', 'hypnosis', 'shadowball', 'thunderpunch'] },
				{ sp: 'arbok', lv: 51, moves: ['gunkshot', 'crunch', 'glare', 'earthquake'], ability: 'intimidate' },
			],
			intro: 'Cláusula dos: «Si el talento declina, el programa demostrará sus ventajas». En combate. Es estándar.',
			win: 'Lo apunto en tu ficha: «No interesad{o|a|e}». Y debajo: «Muy interesante».',
			lose: 'Ves, esto es una ventaja del programa. Piénsatelo.',
			look: { hair: 'sidepart', hairColor: '#2b2b38', outfit: '#2b2b38', outfit2: '#cfd6e2', skin: 1, eyesStyle: 'happy', mouth: 'smile', acc: 'lemnis tie', tie: '#3b5bb5' } },

		// ----- Bastien (opcional) -----
		bastien_5: { name: 'Bastien', cls: 'Rival', npc: 'bastien', ai: 3, iv: 27, reward: 3100,
			team: [
				{ sp: 'talonflame', lv: 49, moves: ['bravebird', 'flareblitz', 'uturn', 'roost'], ability: 'flamebody', nature: 'jolly', iv: 26 },
				{ sp: 'meowstic', lv: 48, moves: ['psychic', 'shadowball', 'lightscreen', 'reflect'], ability: 'prankster', nature: 'timid', iv: 26 },
				{ sp: 'pyroar', lv: 49, moves: ['flamethrower', 'hypervoice', 'darkpulse', 'willowisp'], ability: 'unnerve', nature: 'modest', iv: 27 },
				{ sp: 'aegislash', lv: 50, moves: ['kingsshield', 'shadowball', 'flashcannon', 'sacredsword'], ability: 'stancechange', nature: 'quiet', iv: 27 },
				{ sp: 'greninja', lv: 51, moves: ['surf', 'darkpulse', 'icebeam', 'extrasensory'], ability: 'torrent', item: 'sitrusberry', nature: 'timid', iv: 28 },
			],
			items: [{ id: 'hyperpotion', n: 1 }],
			intro: 'Página nueva. Arriba pone: «Cosas que son mías». Primera línea: este combate. ¡Greninja, al final! ¡Talonflame, abre!',
			win: 'Perdido. Pero mío. Eso no lo pone en ningún contrato.',
			lose: 'Lo apunto. Gané yo. Me sienta raro. Me sienta bien.' },

		// ----- Rutas 24 y 25 -----
		r25_telmo: { name: 'Telmo', cls: 'Nadador', ai: 2,
			team: [
				{ sp: 'tentacruel', lv: 48, moves: ['scald', 'sludgebomb', 'icebeam', 'knockoff'] },
				{ sp: 'seaking', lv: 49, moves: ['waterfall', 'megahorn', 'drillrun', 'aquaring'] },
			],
			intro: '¡Nado de Celeste al Cabo todas las mañanas! Hoy la corriente tiraba hacia el oeste. ¡La corriente nunca tira hacia el oeste!',
			win: 'Mañana nado hacia el este. Por llevarle la contraria.',
			look: { hair: 'buzz', hairColor: '#2a2a2a', outfit: '#3b7ac4', outfit2: '#e9e8e0', skin: 3, eyesStyle: 'happy', mouth: 'grin', acc: 'goggles' } },
		r25_nerea: { name: 'Nerea', cls: 'Campista', ai: 2,
			team: [
				{ sp: 'sandslash', lv: 48, moves: ['earthquake', 'slash', 'rockslide', 'swordsdance'] },
				{ sp: 'nidoking', lv: 50, moves: ['earthpower', 'sludgebomb', 'icebeam', 'thunderbolt'] },
			],
			intro: 'Acampaba en la orilla del río de Celeste hasta que pusieron la valla. «Estudio geológico». Las rocas no necesitan valla. ¡Me desahogo contigo!',
			win: 'Desahogada. Gracias. Las rocas siguen sin necesitar valla.',
			look: { hair: 'ponytail', hairColor: '#6b4a2b', outfit: '#8a7a5a', outfit2: '#6a9a5a', skin: 2, eyesStyle: 'sharp', mouth: 'flat', acc: 'bandana' } },
		r25_ambrosio: { name: 'Ambrosio', cls: 'Montañero', ai: 2,
			team: [
				{ sp: 'golem', lv: 49, moves: ['earthquake', 'stoneedge', 'explosion', 'suckerpunch'] },
				{ sp: 'rhydon', lv: 50, moves: ['earthquake', 'stoneedge', 'megahorn', 'hammerarm'] },
			],
			intro: '¿Vas a casa de Bill? Dile que su PC me guarda los Geodude en una caja que se llama «Caja 1». Que ya podría ponerles nombres más bonitos. ¡Y combate!',
			win: 'Dile también que «Caja 2» tampoco es un nombre bonito.',
			look: { hair: 'short', hairColor: '#4a3a2a', outfit: '#8a5a2f', outfit2: '#e9e3d0', skin: 3, eyesStyle: 'happy', mouth: 'grin', acc: 'beard hat' } },

		// ----- Gimnasio de Celeste -----
		gym_celeste_1: { name: 'Lucía', cls: 'Nadadora', ai: 3, iv: 22, bg: 'gym',
			team: [
				{ sp: 'seaking', lv: 49, moves: ['waterfall', 'megahorn', 'drillrun', 'poisonjab'] },
				{ sp: 'dewgong', lv: 50, moves: ['icebeam', 'surf', 'aquajet', 'encore'] },
			],
			intro: 'La líder dice que el agua no perdona. Yo tampoco. Bueno, yo un poco. ¡Pero el agua no!',
			win: 'Bueno. Sí. Perdono. Pasa.',
			look: { hair: 'long', hairColor: '#e0763a', outfit: '#3b7ac4', outfit2: '#e9e8e0', skin: 1, eyesStyle: 'happy', mouth: 'smile', acc: 'goggles' } },
		gym_celeste_2: { name: 'Abel', cls: 'Nadador', ai: 3, iv: 22, bg: 'gym',
			team: [
				{ sp: 'cloyster', lv: 50, moves: ['iciclespear', 'rockblast', 'hydropump', 'spikes'] },
				{ sp: 'kingler', lv: 51, moves: ['crabhammer', 'xscissor', 'knockoff', 'superpower'] },
			],
			intro: 'Soy el último antes de la líder. Si pierdo, me tira a la piscina. Si gano, también me tira, de alegría. Hoy acabo mojado sí o sí.',
			win: '¡Al agua! —Se tira él solo antes de que nadie se lo pida.',
			look: { hair: 'buzz', hairColor: '#2a2a2a', outfit: '#3b7ac4', outfit2: '#e9e8e0', skin: 3, eyesStyle: 'sharp', mouth: 'grin', acc: 'goggles' } },

		// ----- Misty -----
		misty_g8: { name: 'Misty', cls: 'Líder', npc: 'misty', ai: 4, iv: 27, reward: 5300, bg: 'gym',
			team: [
				{ sp: 'golduck', lv: 49, moves: ['scald', 'icebeam', 'aquatail', 'disable'], ability: 'cloudnine', item: 'wiseglasses', nature: 'calm', iv: 25 },
				{ sp: 'quagsire', lv: 49, moves: ['earthquake', 'waterfall', 'yawn', 'aquatail'], ability: 'waterabsorb', item: 'softsand', nature: 'impish', iv: 26 },
				{ sp: 'lapras', lv: 49, moves: ['surf', 'iceshard', 'bodyslam', 'brine'], ability: 'waterabsorb', nature: 'modest', iv: 27 },
				{ sp: 'gyarados', lv: 49, moves: ['waterfall', 'crunch', 'earthquake', 'scaryface'], ability: 'intimidate', item: 'oranberry', nature: 'adamant', iv: 27 },
				{ sp: 'starmie', lv: 53, moves: ['surf', 'psybeam', 'rapidspin', 'lightscreen'], ability: 'naturalcure', item: 'oranberry', nature: 'timid', iv: 27 },
			],
			items: [{ id: 'superpotion', n: 2 }],
			intro: '¡Mi política con los Pokémon de agua es ir a por todas! ¡Golduck, abre tú! ¡Y no te salgas antes de tiempo!',
			win: 'Hay gente que tarda años en ganarme. Tú te lo has tomado con calma, ¿eh?',
			lose: '¡Ja! Vuelve cuando quieras. Pero no tardes años, ¿eh? Que me aburro.' },

		// ----- Cabo (zona de entrenamiento) -----
		cabo_1: { name: 'Fortunato', cls: 'Pescador', ai: 2,
			team: [
				{ sp: 'kingler', lv: 50, moves: ['crabhammer', 'xscissor', 'knockoff', 'rockslide'] },
				{ sp: 'seadra', lv: 51, moves: ['hydropump', 'dragonpulse', 'icebeam', 'flashcannon'] },
			],
			intro: 'Cuarenta años pescando en el Cabo. Nunca he pescado nada que valga la pena. Pero el sitio, ¡ay, el sitio!',
			win: 'Nada que valga la pena. Como siempre. Qué sitio, eso sí.',
			look: { hair: 'cap', hairColor: '#cfd6e2', outfit: '#3b5bb5', outfit2: '#e9e3d0', skin: 3, acc: 'beard', mouth: 'grin' } },
		cabo_2: { name: 'Itziar', cls: 'Nadadora', ai: 2,
			team: [
				{ sp: 'tentacruel', lv: 51, moves: ['scald', 'sludgebomb', 'icebeam', 'knockoff'] },
				{ sp: 'golduck', lv: 51, moves: ['hydropump', 'icebeam', 'psychic', 'calmmind'] },
			],
			intro: 'Entreno aquí porque Misty viene a mirar el mar. Si me ve nadar bien, igual me ficha. Nunca me mira. Mira el mar.',
			win: 'Igual mañana me mira. O mira el mar. Seguramente el mar.',
			look: { hair: 'ponytail', hairColor: '#2b2b38', outfit: '#c4473a', outfit2: '#e9e8e0', skin: 2, eyesStyle: 'sharp', mouth: 'smile', acc: 'goggles' } },
		cabo_3: { name: 'Gaizka', cls: 'Socorrista', ai: 2,
			team: [
				{ sp: 'slowbro', lv: 52, moves: ['scald', 'psychic', 'slackoff', 'icebeam'] },
				{ sp: 'poliwrath', lv: 52, moves: ['waterfall', 'closecombat', 'icepunch', 'earthquake'] },
			],
			intro: 'Soy el socorrista. Si te ahogas, te saco. Si pierdes, te saco igual, pero me río un poco.',
			win: 'No me río. Te has ganado que no me ría.',
			look: { hair: 'short', hairColor: '#e9c46a', outfit: '#c4473a', outfit2: '#f2c43a', skin: 3, eyesStyle: 'normal', mouth: 'grin', acc: 'glasses' } },
	},

	// =====================================================================
	// GUIONES
	// =====================================================================
	scripts: {
		// =================== RUTA 5 ===================
		b04_guarda_k5: [
			{ say: 'guarda_k5', text: 'Antes, aquí no pasaba nadie sin traerme una bebida. Era la tradición. Treinta años con la boca seca, esperando un refresco de un desconocido.' },
			{ say: 'guarda_k5', text: 'Ahora, con la Gira, Lemnis me ha puesto una fuente. —Señala una fuente de acero con la lemniscata grabada—. Agua filtrada. Gratis. Para todos. —Pausa—. La odio.' },
			{ if: BEBIDA, then: [
				{ choice: [
					{ text: 'Darle una bebida de la mochila.', then: [
						{ if: 'has("lemonade")', then: [{ take: 'lemonade' }], else: [{ if: 'has("sodapop")', then: [{ take: 'sodapop' }], else: [{ take: 'freshwater' }] }] },
						{ set: { 'flag.b04_guarda_bebida': true } },
						{ text: 'El guardia la toma con las dos manos. La mira. Se la bebe de un trago, despacio, con los ojos cerrados, como quien escucha una canción de cuando era joven.' },
						{ say: 'guarda_k5', text: 'Esto. Esto es la tradición. Un desconocido. Una bebida. Un «gracias». —Se seca una lágrima con la manga—. Toma. Lo tenía guardado para el siguiente que me trajera algo. Han pasado tres años.' },
						{ give: 'ppup' },
					] },
					{ text: 'Seguir tu camino.', then: [{ say: 'guarda_k5', text: 'Claro. Hay una fuente. ¿Para qué ibas a traerme nada? —Suspira—. Ve con cuidado.' }] },
				] },
			], else: [
				{ say: 'guarda_k5', text: 'Si un día pasas por la tienda de Celeste… venden Agua Fresca. No te pido nada. Solo lo digo.' },
			] },
		],
		b04_guarda_k5_despues: [
			{ say: 'guarda_k5', text: 'La fuente sigue ahí. Yo sigo aquí. Pero ahora, cuando la miro, me acuerdo de ti y la miro con un poco menos de rencor. Solo un poco.' },
		],
		b04_petra_mensaje: [
			{ if: 'has("ambarsinregistro")', then: [
				{ text: 'En el bolsillo, algo se calienta. Sacas el **Ámbar sin registro**. El brillo azul de dentro late. Tic-tac. Tic-tac. Más deprisa que en Johto. Como en Crómlech, cuando la tierra estaba doblada.' },
			] },
			{ text: 'La Pokédex vibra. Un mensaje de voz, con mucho viento de fondo.' },
			{ say: 'petra', as: 'Petra (mensaje)', text: '¡{jugador}! ¿Estás en Kanto? ¡Yo también! Bueno, casi. Estoy en un barco. Me he caído dentro del barco, no fuera, que es lo importante.' },
			{ say: 'petra', as: 'Petra (mensaje)', text: 'Voy a **Isla Canela**, al laboratorio de fósiles. Dicen que tienen una máquina que lee cosas que la del Dr. Lazare no lee. Lazare dice que no. Lazare dice que no a todo, y luego resulta que sí.' },
			{ say: 'petra', as: 'Petra (mensaje)', text: 'Chispas está mareado. Pala no. Pala nunca se marea. Es una de las cosas que más admiro de Pala, junto con las orejas.' },
			{ if: 'has("ambarsinregistro")', then: [
				{ say: 'petra', as: 'Petra (mensaje)', text: 'Oye, una cosa. ¿El ámbar late? Si late, apúntalo. Hora y sitio. Las capas se leen así: con hora y sitio. Es la primera regla. Bueno, la primera es «no te caigas al agujero». La segunda es esta.' },
				{ say: 'rotom', text: '¡Bzzt! Apuntado: Ruta 5, Kanto. Latido rápido. ¡Soy una libreta con patas! Bueno, sin patas.' },
			], else: [
				{ say: 'petra', as: 'Petra (mensaje)', text: '¿Sigues teniendo mi ámbar? Ah, que no. Da igual. Las cosas que pierdo siempre acaban apareciendo. En capas. Con el tiempo.' },
			] },
			{ quest: 'b03_t_ambar', done: true, cond: 'quest.b03_t_ambar && !done.b03_t_ambar' },
			{ intel: { npc: 'petra', text: 'Va en barco a Isla Canela, al laboratorio de fósiles, a buscar una máquina que lea lo que la de Lazare no lee. El ámbar late más deprisa en Kanto, como en Crómlech.' } },
		],

		// =================== LLEGADA A CELESTE ===================
		b04_celeste_llegada: [
			{ set: { 'flag.b04_celeste_llegada': true } },
			{ quest: 'b04_m2', stage: 'celeste' },
			{ quest: 'b04_m3', stage: 'reto' },
			{ text: 'Celeste suena a agua. El río bajo los puentes, los canales, una fuente en cada plaza, el chapoteo del gimnasio. Pasan bicicletas con timbre. Un Psyduck cruza el paso de cebra con las manos en la cabeza y nadie le pita.' },
			{ text: 'Por el puente grande, hacia el oeste, cruza un grupo con uniforme gris y la lemniscata en el pecho. Llevan maletines metálicos. Van hacia la orilla donde hay una valla azul y plata.' },
			{ text: 'La última del grupo lleva el pelo recogido en un moño a medio hacer. Al pasar junto a ti levanta la vista. Es **Noa Lambert**. Te ve. Mueve la cabeza, muy poco, de un lado a otro. *No.*' },
			{ say: 'rotom', text: '¡Bzzt! ¿Esa no era…?' },
			{ text: 'Le tapas el altavoz a Rotom con el pulgar. Noa sigue andando sin girarse. El grupo cruza el puente y desaparece detrás de la valla.' },
			{ quest: 'b03_t_noa', done: true, cond: 'quest.b03_t_noa && !done.b03_t_noa' },
			{ quest: 'b04_t_noa', stage: 'celeste' },
			{ say: 'rotom', text: '…Ok. Ok. No he visto nada. —Bajito—. Pero lo he visto.' },
			{ say: 'rotom', text: 'Bueno. ¡Celeste! Aquí está el gimnasio de **Misty**: tipo Agua. Si ganamos, son **ocho medallas**. ¡Ocho! Y al norte, pasado el **Puente Pepita**, vive **Bill**, el que inventó el sistema de PC. Si alguien sabe leer una señal rara, es él.' },
			{ if: 'has("registroondas")', then: [
				{ say: 'rotom', text: 'Llevamos las hojas de Caoba, las de la firma con una M. Bill seguro que les saca algo.' },
			] },
			{ text: 'La Pokédex vibra otra vez. Un mensaje de texto, sin saludo.' },
			{ say: 'bastien', as: 'Bastien (mensaje)', text: 'Estoy en Celeste. En el puente del norte. Leyendo. Si pasas, no hace falta que pares. Pero si paras, mejor.' },
			{ quest: 'b04_t_bastien', stage: 'puente' },
		],
		b04_celeste_pendiente: [
			{ say: 'rotom', text: '¡Bzzt! Lista de cosas en Celeste:' },
			{ say: 'rotom', text: '• Ganar a **Misty**. Aunque primero habría que encontrarla.', cond: '!flag.b04_misty_cabo && !beat("misty_g8")' },
			{ say: 'rotom', text: '• Misty nos espera en el gimnasio. Primero, sus dos nadadores.', cond: 'flag.b04_misty_cabo && !beat("misty_g8")' },
			{ say: 'rotom', text: '• Cruzar el **Puente Pepita**. Cinco combates seguidos. ¡Cura antes!', cond: '!flag.b04_puente_hecho' },
			{ say: 'rotom', text: '• Llevarle la señal a **Bill**, al final de las Rutas 24 y 25.', cond: '!flag.b04_bill_hecho' },
			{ say: 'rotom', text: '• Alguien te esperaba en el callejón de la tienda de bicis. Con uniforme.', cond: '!flag.b04_noa_celeste' },
			{ say: 'rotom', text: '• Bastien está en el arranque del Puente Pepita, leyendo. Dice que no hace falta parar.', cond: '!flag.b04_bastien_puente' },
			{ say: 'rotom', text: '• El dueño de la tienda de bicis tiene un paquete para Bill.', cond: '!flag.b04_rueda_visto && !flag.b04_bill_hecho' },
			{ say: 'rotom', text: '• Una foto en el Puente Pepita, al atardecer. ¡Me la prometiste! Bueno, me la prometí yo.', cond: 'badge("medalla_cascada") && !has("fotopuente")' },
			{ say: 'rotom', text: '¡Y ya está! Misty y Bill, hechos. Esta noche dormimos en el Centro, ¿sí? Me hace falta cargar.', cond: 'beat("misty_g8") && flag.b04_bill_hecho' },
		],

		// =================== NOA ===================
		b04_noa_celeste: [
			{ set: { 'flag.b04_noa_celeste': true } },
			{ text: 'El callejón de detrás de la tienda de bicis es estrecho y huele a goma. Hay neumáticos apilados hasta la altura de la cabeza. Entre dos pilas, sentada en una caja, está Noa.' },
			{ text: 'El uniforme es nuevo: gris, sin una arruga, con una insignia rectangular que dice **INVENTARIO · KANTO**. Se ha cortado el pelo. O se lo ha cortado alguien deprisa.' },
			{ say: 'noa', text: 'No me saludes. Ni ahora ni nunca, si me ves con esto puesto. Si me ves con esto, no me conoces. ¿De acuerdo? Es lo único que te pido. —Se frota los ojos—. No. No es lo único.' },
			{ say: 'noa', text: 'Me han «reasignado». A la cueva del río. A inventariar. Les pregunté: «¿Inventariar qué?». Me dijeron: «Lo que haya». Y me sonrieron. Siempre me sonríen.' },
			{ say: 'noa', text: 'La tarjeta gris ya no la tengo. Ahora tengo esta. —Te enseña una tarjeta blanca. Pone **VISITANTE**—. Trabajo allí y soy visitante. Eso también es un dato.' },
			{ if: 'flag.b03_noa_hecho', then: [
				{ say: 'noa', text: 'Lo de Olivo, lo de los envíos… Ahora sé adónde iban los de Johto. Y aquí hay otra cueva. Y otro furgón. Y otra lista que me toca firmar a mí.' },
			], else: [
				{ say: 'noa', text: 'Hace meses que veo cajas que van a sitios que no tienen nombre. Ahora el sitio tiene nombre. Es esa cueva. Y la lista la firmo yo.' },
			] },
			{ if: 'flag.b02_cetoddle', then: [
				{ say: 'noa', text: '¿Escarcha está bien? Dímelo rápido. Solo eso. Que está bien.' },
				{ text: 'Le dices que sí. Noa cierra los ojos un segundo, como quien se apoya en una pared.' },
			] },
			{ if: 'flag.b02_cetoddle_noa', then: [
				{ say: 'noa', text: 'Escarcha está en una bañera de un hostal de Celeste, con hielo. La dueña ya ni pregunta. Si me pasa algo… la llave está debajo del felpudo. Es un felpudo de Psyduck. Es horrible.' },
			] },
			{ say: 'noa', text: 'Y Bastien. A Bastien también lo han llamado. Aquí, a Celeste. «Disponibilidad para estudios». No sé qué estudian. —Se le quiebra la voz—. Me da más miedo eso que la cueva.' },
			{ text: 'Noa se levanta. Te agarra de la manga, muy fuerte, como una niña en un sitio con mucha gente.' },
			{ say: 'noa', text: 'Escúchame. Si un día no contesto… si te escribo y luego no contesto… que alguien abra las jaulas. Las que haya. Donde estén. No me esperes para hacerlo.' },
			{ choice: [
				{ text: '«Te lo prometo.»', then: [
					{ say: 'noa', text: 'Bueno. —Suelta la manga—. Bueno. Ya lo he dicho. Ya pesa menos.' },
				] },
				{ text: '«No digas eso. Vas a contestar siempre.»', then: [
					{ say: 'noa', text: 'Ojalá. —Sonríe, y es peor que si llorara—. Pero prométemelo igual. Las promesas no hacen daño si no hacen falta.' },
				] },
				{ text: '«¿Qué jaulas, Noa?»', then: [
					{ say: 'noa', text: 'Las que siempre hay al final. En todos los sitios a los que me mandan, al final, hay jaulas. No sé por qué iba a ser distinto esta vez.' },
				] },
			] },
			{ text: '{riolu} se acerca a Noa y le pone la palma en la mano, despacio. El aura le brilla un segundo, muy tenue. Noa deja de temblar. Solo un poco. Solo un momento.', cond: LUC },
			{ text: 'Desde la calle, una voz con megáfono: «¡Lambert! ¡Al furgón! ¡Ya!».' },
			{ say: 'noa', text: 'Voy. —A ti, sin mirarte—. No me has visto.' },
			{ text: 'Sale del callejón con la cabeza baja, alisándose el uniforme. Cuando pasa por delante del escaparate de las bicis, se para un segundo y mira la bici roja de un millón. Luego sigue.' },
			{ quest: 'b04_t_noa', stage: 'abierto' },
			{ intel: { npc: 'noa', text: 'La han reasignado a la Cueva Celeste para «inventariar lo que haya», con una tarjeta de VISITANTE. Sabe que a Bastien lo han llamado a Celeste «para estudios». Te pidió que, si un día no contesta, alguien abra las jaulas.' } },
		],

		// =================== CELESTE: MUNDO ===================
		b04_casa_agujero: [
			{ text: 'Una casa normal, con macetas y un felpudo. Y en la pared del costado, un boquete del tamaño de una persona, con un marco de madera dorada atornillado alrededor, como un cuadro.' },
			{ say: 'vecino_kanto', as: 'Vecino del agujero', text: '¿Te gusta? Hace muchos años, unos ladrones de uniforme negro me hicieron este agujero para robarme una MT. Lo he dejado. Es patrimonio. Viene gente a hacerse fotos.' },
			{ say: 'vecino_kanto', as: 'Vecino del agujero', text: 'El mes pasado vinieron unos de Lemnis a medirlo. Para el «estudio geológico», dijeron. Lo midieron tres veces. Luego preguntaron si conocía la cueva del río por dentro. ¿Qué tendrá que ver mi agujero con la cueva?' },
			{ if: 'flag.b03_rocket_quemar', then: [
				{ say: 'vecino_kanto', as: 'Vecino del agujero', text: 'Y la semana pasada, un señor de pelo azul, muy bien vestido, se paró aquí delante un buen rato. Miró el agujero. Se rió. No se hizo foto. Se fue hacia el sur, hacia Azafrán.' },
			] },
			{ if: 'flag.b03_rocket_libres', then: [
				{ say: 'vecino_kanto', as: 'Vecino del agujero', text: 'Ah, y alguien me dejó una nota en el buzón: «Perdón por lo del agujero. De parte de la familia». Sin firma. Yo no tengo familia en ese gremio. Que yo sepa.' },
			] },
		],
		b04_cueva_fuera: [
			{ set: { 'flag.b04_cueva_vista': true } },
			{ text: 'Cruzas el puente grande hacia el oeste. La orilla de allí es de roca gris, con musgo, y al fondo se abre la boca de una cueva: ancha, oscura, con un aire frío que sale de dentro aunque haga sol.' },
			{ text: 'Delante, una valla nueva de dos metros, azul y plata. Focos. Un generador. Dos furgones blancos. Un cartel: «**LEMNIS KANTO · ESTUDIO GEOLÓGICO** · Prohibido el paso · Gracias por su comprensión».' },
			{ say: 'guardia_lemnis', text: 'Buenas. Aquí no se puede pasar, eh. Estudio geológico. Rocas. Muy aburrido. —Sonríe mucho—. Le prometo que es aburridísimo.' },
			{ say: 'rotom', text: '¡Bzzt! Eso mismo dijo uno igual en Olivo. Con la misma sonrisa. ¿Les darán un cursillo?' },
			{ if: LUC, then: [
				{ text: '{riolu} se ha quedado muy quieto en mitad del puente. Las orejas hacia delante. Los apéndices de la cabeza levantados, temblando un poco.' },
				{ text: 'Mira la boca de la cueva como se mira una puerta cerrada detrás de la cual alguien respira. No gruñe. No se acerca. Solo mira. Y por primera vez desde que lo conoces, no da ni un paso hacia delante.' },
				{ text: 'Cuando por fin se gira hacia ti, tiene en los ojos algo que no le habías visto nunca. No es miedo. Es respeto.' },
			], else: [
				{ text: 'Del fondo de la cueva sale un aire frío que huele a piedra mojada y a algo más, algo que no sabes nombrar. Te eriza la nuca sin motivo.' },
			] },
			{ text: 'Un Goldeen asoma en el río, junto a la orilla. Nada contra la corriente, hacia la cueva. Luego otro. Luego otro.' },
		],

		// =================== TIENDA DE BICIS ===================
		b04_rueda_encargo: [
			{ set: { 'flag.b04_rueda_visto': true } },
			{ say: 'bicicletero', text: '¡Hola, hola! ¿Bici? ¿No? Ya. Nadie quiere bici. Todo el mundo va en Puerta. ¡Una Puerta no te pone las piernas así de bonitas!' },
			{ say: 'bicicletero', text: 'Oye, ¿vas al norte? ¿Por el Puente Pepita? ¿A lo mejor hasta el Cabo? Bill me encargó una pieza. Una **ruedecita**. De las buenas, de las de timbre antiguo, que giran suaves y hacen clic-clic.' },
			{ say: 'bicicletero', text: 'Yo no puedo cerrar la tienda. ¿Y si viene alguien a comprar la bici? —Señala el escaparate. Nadie viene a comprar la bici—. ¿Se la llevas?' },
			{ choice: [
				{ text: '«Claro, se la llevo.»', then: [
					{ set: { 'flag.b04_rueda_llevas': true } },
					{ quest: 'b04_s_rueda', stage: 'encargo' },
					{ text: 'Te da un paquetito envuelto en papel de periódico, atado con cinta de freno. Pesa casi nada. Hace clic-clic si lo agitas.' },
					{ say: 'bicicletero', text: '¡Gracias! Y si Bill te dice algo raro, no le hagas caso. Bill siempre dice algo raro. Es su forma de decir hola.' },
				] },
				{ text: '«Ahora no puedo.»', then: [
					{ say: 'bicicletero', text: 'Nada, nada. Ya se la llevaré yo algún día. En bici. —Mira la bici del escaparate—. En esa no.' },
					{ set: { 'flag.b04_rueda_visto': false } },
				] },
			] },
		],
		b04_rueda_gracias: [
			{ say: 'bicicletero', text: '¡Ha llegado! Bill me ha llamado. Dice que la ruedecita está ahora en un aparato «muy importante» y que gira «como un sueño». ¡Mi ruedecita! ¡En un aparato importante!' },
			{ say: 'bicicletero', text: 'Toma. Por las molestias. Y esto otro… esto es un regalo de verdad. Un vale. Para la bici.' },
			{ give: 'ppup' },
			{ give: 'valebici' },
			{ quest: 'b04_s_rueda', done: true },
			{ say: 'bicicletero', text: 'Con el vale, la bici te sale en 999.999. Es un descuento importante. Simbólico, pero importante.' },
		],
		b04_bicis_generico: [
			{ if: 'flag.b04_bill_hecho && !flag.b04_rueda_llevas && !done.b04_s_rueda', then: [
				{ say: 'bicicletero', text: 'Bill me ha llamado. Dice que ya no le hace falta la ruedecita, que se apañó con la de un Voltorb de juguete. ¡De juguete! Ese hombre no tiene respeto por las ruedas.' },
			], else: [
				{ say: 'bicicletero', text: 'La bici del escaparate lleva aquí veinte años. Ha visto pasar tres líderes de gimnasio, dos crisis, un robo y un Snorlax que se quedó dormido en la puerta una semana. Ella sigue aquí. Esperando a la persona adecuada.' },
			] },
		],
		b04_bici_escaparate: [
			{ text: 'Una bicicleta plegable roja, con cesta, timbre dorado y un sillín de cuero que nadie ha usado nunca. La etiqueta, escrita a mano con muchísimo cuidado: **1.000.000 ₽**.' },
			{ say: 'rotom', text: '¡Bzzt! Un millón. He hecho la cuenta: con lo que ganamos en un gimnasio, son… muchos gimnasios. Infinitos, casi. Como el Circuito.' },
			{ text: 'Debajo de la etiqueta hay otra más pequeña, más vieja: «Se acepta vale». Nadie sabe qué vale.', cond: '!has("valebici")' },
			{ text: 'Debajo de la etiqueta hay otra más pequeña: «Se acepta vale». Tú tienes un vale. Sigue faltando casi todo.', cond: 'has("valebici")' },
		],

		// =================== PUENTE PEPITA ===================
		b04_puente_entrada: [
			{ text: 'Junto al cartel, una señora con un chaleco amarillo que pone «VOLUNTARIA DEL PUENTE» reparte botellines de agua.' },
			{ say: 'vecino_kanto', as: 'Voluntaria del puente', text: 'Cinco combates, uno detrás de otro, sin parar. Es la tradición. Nadie cruza el Puente Pepita con medio equipo.' },
			{ prompt: '¿Curar al equipo antes de cruzar?', choice: [
				{ text: 'Sí, gracias.', then: [{ heal: 'La voluntaria te acompaña al Centro, que está a dos pasos. Cuando vuelves, tu equipo está entero y tú tienes un botellín de agua que no has pedido.' }] },
				{ text: 'Así estoy bien.', then: [{ say: 'vecino_kanto', as: 'Voluntaria del puente', text: 'Como quieras. El Centro está ahí detrás. Siempre está ahí detrás.' }] },
			] },
		],
		b04_pepita_5: [
			{ if: 'flag.b04_puente_hecho', then: [{ end: true }] },
			{ text: 'Al final del puente, apoyado en la última farola, hay un hombre con un traje gris perfecto, un maletín y una sonrisa de catálogo. Aplaude despacio. En la solapa, un pin pequeño con una lemniscata.' },
			{ say: 'cazatalentos_lemnis', text: '¡Cinco de cinco! Bueno, cuatro de cuatro y yo. ¡Enhorabuena! Casimiro, del **Programa de Talentos**. Te he visto cruzar. Tienes… cómo decirlo… *proyección*.' },
			{ say: 'cazatalentos_lemnis', text: 'Te ofrezco unirte a… algo.' },
			{ choice: [
				{ text: '«¿A qué?»', then: [
					{ say: 'cazatalentos_lemnis', text: 'A algo. Es un programa piloto. Todavía no tiene nombre. Tiene chaqueta. —Abre el maletín: dentro hay una chaqueta azul y plata, doblada con cariño—. Es muy buena chaqueta.' },
				] },
				{ text: '«¿Qué pone en la letra pequeña?»', then: [
					{ say: 'cazatalentos_lemnis', text: '¿Letra pequeña? Bueno, «pequeña»… —Saca un contrato de cuarenta páginas—. Es de tamaño normal. Para alguien con lupa.' },
				] },
				{ text: '«No, gracias.»', then: [
					{ say: 'cazatalentos_lemnis', text: '¡Me encanta! Un «no» es un «sí» que todavía no ha leído el folleto.' },
				] },
			] },
			{ if: 'has("clausulabastien")', then: [
				{ text: 'Rotom proyecta en la pantalla la foto de la cláusula de Bastien y la pone delante del contrato.' },
				{ say: 'rotom', text: '¡Bzzt! ¿Este también tiene la catorce punto tres? «Disponibilidad para estudios»?' },
				{ say: 'cazatalentos_lemnis', text: '—Se le tuerce la sonrisa un milímetro—. Todas la tienen. Es una cláusula estándar. Estándar de las nuevas.' },
			] },
			{ say: 'cazatalentos_lemnis', text: 'En mi departamento éramos dos. La otra, Lambert, era la que fichaba a los novatos de Kalos. Ahora hace inventario. Un ascenso lateral. Así que ahora el programa soy yo, y necesito cifras.' },
			{ say: 'cazatalentos_lemnis', text: 'El protocolo dice que, si el talento duda, le demuestro las ventajas del programa. En combate. Pero primero, cortesía de la casa: el programa cuida a sus talentos.' },
			{ heal: 'Casimiro saca del maletín un pulverizador con la lemniscata y cura a todo tu equipo en tres segundos, sin preguntar. Huele a menta.' },
			{ battle: 'pepita_5', onWin: [
				{ set: { 'flag.b04_puente_hecho': true } },
				{ cap: 52 },
				{ say: 'cazatalentos_lemnis', text: 'Bueno. De acuerdo. Me lo apunto. —Cierra el maletín—. No pasa nada: el programa es paciente. El programa es *muy* paciente.' },
				{ say: 'cazatalentos_lemnis', text: 'Toma. La **pepita** del puente. Es tradición. Hace años la daba otra… organización. De uniforme negro. Ahora la damos nosotros. Las tradiciones cambian de dueño, no de puente.' },
				{ give: 'nugget' },
				{ text: 'Se aleja hacia Celeste silbando, con el maletín balanceándose. Al pasar junto a la voluntaria del puente, ella le tira un botellín de agua a los pies. Él lo esquiva sin mirar.' },
				{ say: 'rotom', text: '¡Bzzt! «Las tradiciones cambian de dueño». —Pausa—. Esa frase no me ha gustado nada. Y la chaqueta tampoco. Bueno, la chaqueta un poco.' },
				{ say: 'rotom', text: '¡Pero hemos cruzado! La casa de Bill está al final de la Ruta 25. ¡Vamos!' },
				{ quest: 'b04_m2', stage: 'bill' },
			] },
		],

		// =================== BASTIEN ===================
		b04_bastien_puente: [
			{ set: { 'flag.b04_bastien_puente': true } },
			{ if: 'flag.b01_bastien_cubierto', then: [
				{ text: 'Bastien está sentado en la barandilla del puente, con la chaqueta de Lemnis impecable y un taco de folios grapados en las rodillas. Lo está leyendo con un dedo, línea por línea, como un niño que aprende a leer.' },
				{ say: 'bastien', text: '¡{jugador}! Has parado. Lo apunto. —Levanta el contrato—. ¿Sabes cuántas páginas tiene esto? Cuarenta. ¿Sabes hasta dónde había leído en dos años? Hasta la seis.' },
				{ say: 'bastien', text: 'Me han mandado a Celeste. Una carta muy amable: «En virtud de la cláusula 14.3». Así que he llegado a la catorce. No me ha gustado la catorce.' },
			] },
			{ if: 'flag.b01_bastien_rompe', then: [
				{ text: 'Bastien está sentado en la barandilla con la cazadora de pana de los codos remendados, leyendo una carta con membrete de abogados. La sujeta como si quemara.' },
				{ say: 'bastien', text: '¡{jugador}! Has parado. —Agita la carta—. Mira. Los abogados de Lemnis. Dicen que rompí el contrato, bueno. Pero que hay una cláusula que «sobrevive a la rescisión». ¿Sabías que una cláusula puede sobrevivir? Yo creía que eso solo lo hacían las cucarachas.' },
				{ say: 'bastien', text: 'Cláusula 14.3. Me citan en Celeste. Si no vengo, la demanda se duplica. Así que he venido. Con mi cazadora. Que es mía.' },
			] },
			{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe', then: [
				{ text: 'Bastien está sentado en la barandilla con la chaqueta azul y plata. Detrás de él, en la caseta del puente, un cartel enorme de Lemnis con su cara sonriendo. Él, en persona, no sonríe. Lee un contrato.' },
				{ say: 'bastien', text: '{jugador}. —Señala el cartel con la barbilla—. Ese soy yo. El de verdad está aquí, leyendo. Es menos fotogénico.' },
				{ say: 'bastien', text: 'Me han mandado a Celeste. «Cláusula 14.3». En la libreta tengo una página que se llama «Cosas que no dije». Hoy he empezado otra: «Cosas que no leí».' },
			] },
			{ text: 'Te pasa el contrato abierto por una página. Hay un párrafo subrayado tres veces, con tres bolígrafos distintos.' },
			{ text: '*«14.3. Disponibilidad para estudios. El Talento permanecerá a disposición de la Fundación para estudios de rendimiento y vínculo, en las instalaciones que se designen, durante el tiempo que se estime necesario. Instalación designada (Kanto): Celeste, emplazamiento 03.»*' },
			{ say: 'bastien', text: '«Vínculo». Quieren medir el vínculo entre Greninja y yo. Con cables, me imagino. —Se ríe sin ganas—. ¿Cómo se mide eso? ¿En metros? ¿En kilos?' },
			{ text: 'La Poké Ball de su cinturón se abre sola. Greninja sale, se planta a su lado y le pone una mano palmeada en el hombro. No dice nada. Mira el contrato con una cara que no necesita traducción.' },
			{ say: 'bastien', text: 'Greninja dice que ni de broma. Bueno, no lo dice. Pero lo dice.' },
			{ if: 'flag.b04_noa_celeste', then: [
				{ say: 'bastien', text: 'Y Noa. La he visto pasar en un furgón. Me ha mirado por la ventanilla y no me ha saludado. Noa siempre saluda. Saluda a los Pidgey.' },
			], else: [
				{ say: 'bastien', text: '¿Has visto a Noa? Me han dicho que está aquí. No me contesta. Cuando no contesta es que está cerca y no puede.' },
			] },
			{ text: 'En la solapa, por dentro, brilla la insignia de hojalata del Froakie sin logo.', cond: 'flag.b02_noa_trigal' },
			{ say: 'bastien', text: 'Hazle una foto a la cláusula. Por si un día dicen que no existe. A mí ya me han dicho muchas veces que cosas que existían no existían.' },
			{ give: 'clausulabastien' },
			{ quest: 'b04_t_bastien', done: true },
			{ intel: { npc: 'bastien', text: 'Lemnis lo ha citado en Celeste por la cláusula 14.3 de su contrato: «disponibilidad para estudios de rendimiento y vínculo» en el «emplazamiento 03» de Celeste. Quieren medir su vínculo con Greninja.' } },
			{ say: 'bastien', text: 'Bueno. —Se baja de la barandilla—. ¿Combate? En la libreta tengo una página nueva: «Cosas que son mías». Quiero que la primera línea sea esto.' },
			{ choice: [
				{ text: '«Vamos.»', then: [{ call: 'b04_bastien_combate' }] },
				{ text: '«Luego, Bastien.»', then: [{ say: 'bastien', text: 'Luego. Lo apunto como pendiente. Aquí estaré. Leyendo la quince.' }] },
			] },
		],
		b04_bastien_revancha: [
			{ say: 'bastien', text: '¿Ahora? Página abierta. Bolígrafo listo. Greninja, más.' },
			{ call: 'b04_bastien_combate' },
		],
		b04_bastien_combate: [
			{ prompt: '¿Curar al equipo antes del combate?', choice: [
				{ text: 'Sí, pasar por el Centro.', then: [{ heal: 'Bastien te acompaña al Centro. Mientras curan a tu equipo, él lee la cláusula quince. Cuando sales, la tiene tachada entera con un rotulador gordo.' }] },
				{ text: 'No hace falta.', then: [{ say: 'bastien', text: 'Insisto. Cláusula mía. La única que he escrito yo. —Te lanza una Hiperpoción—.' }, { heal: 'Curas a tu equipo con lo que te da Bastien.' }] },
			] },
			{ battle: 'bastien_5', lose: 'continue',
				onWin: [
					{ text: 'Greninja se deshace en agua y vuelve a la Poké Ball. Bastien abre la libreta por la página nueva y escribe, con letra grande.' },
					{ text: '«**Cosas que son mías.** 1. Este combate. Perdido. Mío».' },
					{ if: 'flag.b01_bastien_cubierto', then: [{ say: 'bastien', text: 'Te sigo debiendo una. Esta derrota no cuenta. Esta derrota es un regalo.' }] },
					{ if: 'flag.b01_bastien_rompe', then: [{ say: 'bastien', text: 'Los abogados no pueden demandarme por perder. Lo he comprobado. Es lo único que he leído entero.' }] },
					{ if: '!flag.b01_bastien_cubierto && !flag.b01_bastien_rompe', then: [{ say: 'bastien', text: '«Cosas que no dije», línea cuatro: «No quiero ir a esa cueva». —La tacha—. Dicha.' }] },
					{ rep: { lemnis: -1 } },
				],
				onLose: [
					{ say: 'bastien', text: 'Gané. Lo apunto. —Te ayuda a levantarte—. Me sienta raro ganarte. Vuelve cuando quieras, que me sienta mejor perder.' },
					{ heal: true },
				] },
		],
		b04_bastien_despues: [
			{ say: 'bastien', text: 'Sigo leyendo. Voy por la diecinueve. La diecinueve dice que Lemnis puede usar mi imagen «en cualquier región, presente o futura». ¿Regiones futuras? ¿Cuántas regiones piensan que va a haber?' },
			{ say: 'bastien', text: 'Si ves a Noa, dile que estoy aquí. Que no me voy a mover. Bueno, a comer sí.', cond: '!flag.b04_noa_celeste' },
			{ say: 'bastien', text: 'Noa ha vuelto a pasar en el furgón. Esta vez ha apoyado la mano en la ventanilla. Eso es casi un saludo. Lo apunto como saludo.', cond: 'flag.b04_noa_celeste' },
		],

		// =================== FOTO DEL PUENTE ===================
		b04_foto_puente: [
			{ if: '!evening', then: [
				{ text: 'Te sientas en la barandilla, junto a la tercera farola, a esperar. El río pasa. Pasan dos ciclistas, un Psyduck, un nadador que te saluda desde el agua. El sol va bajando sin prisa, como si supiera que lo están esperando.' },
			] },
			{ text: 'El cielo se pone naranja. Luego rosa. El río se vuelve de cobre. Las barandillas amarillas del puente brillan como si fueran de oro de verdad. Por algo se llama así.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Quieto! ¡Quiet{o|a|e}! ¡Así! ¡Tres, dos…!' },
			{ cutscene: { bg: { type: 'route', far: '#e98a5a', hill: '#4a5a8a', flowers: '#f2c43a' }, start: 'light', frames: [
				{ text: 'El sol se apoya en el horizonte, detrás de Celeste. Los tejados azules se vuelven morados. El agua del río lo copia todo.' },
				{ text: 'En la barandilla, una silueta con ocho medallas en la caja. A su lado, otra silueta, azul, con las orejas levantadas, mirando el mismo sol.', cond: LUC },
				{ text: 'En la barandilla, una silueta con ocho medallas en la caja, mirando el sol como quien mira una meta.', cond: '!(' + LUC + ')' },
				{ item: 'fotopuente', fx: 'flash', text: '*Clic.* En la pantalla de la Pokédex aparece la foto. Rotom le pone título sin pensárselo: **«Ocho»**.' },
			] } },
			{ give: 'fotopuente' },
			{ say: 'rotom', text: 'Es la foto de una persona clasificada. Se nota, ¿a que sí? Se nota en los hombros.' },
			{ happy: { who: 'riolu', n: 5 } },
		],

		// =================== BILL ===================
		b04_bill: [
			{ text: 'Llamas fuerte. La puerta se abre. Al otro lado hay un **Clefairy** con un delantal, que te mira con muchísima seriedad.' },
			{ choice: [
				{ text: '«…¿Bill?»', then: [
					{ text: 'El Clefairy niega con la cabeza, despacio, como quien ya ha contestado esa pregunta muchas veces.' },
				] },
				{ text: '«Hola, Clefairy. Busco a Bill.»', then: [
					{ text: 'El Clefairy asiente, satisfecho, y se aparta para dejarte pasar. Parece que no le pasa muy a menudo.' },
				] },
			] },
			{ say: 'bill', text: '¡No, no, no, ese es un Clefairy de verdad! —Un hombre con camisa azul y gafas protectoras aparece corriendo por el pasillo—. Desde lo del teletransportador, la gente le habla a todos mis Pokémon por si acaso. Una vez me convertí en Pokémon, ¡una vez!, y ya se queda para siempre en tu currículum.' },
			{ say: 'bill', text: '¡Hola-hola! Bill. Pokémaníaco. Inventor del sistema de almacenamiento de PC, a tu servicio. Pasa, pasa. No mires lo de fuera. Lo de fuera es el desorden que no me cabía dentro.' },
			{ text: 'Por dentro, la casa es otro mundo: estanterías etiquetadas, cables enrollados por colores, un banco de trabajo donde cada destornillador tiene su silueta dibujada. Lo más ordenado que has visto nunca. Más ordenado por dentro que por fuera.' },
			{ if: 'flag.b03_copito_contigo && (inParty("mareep") || inParty("flaaffy") || inParty("ampharos"))', then: [
				{ say: 'bill', text: '¡Oh! ¿Esa es tu Mareep? ¡Esa lana tiene una carga estática preciosa! Mira cómo se le pega el polvo. Bueno, no la mires mucho, que se pone tímida. Se nota que la quiere alguien.' },
			] },
			{ say: 'bill', text: 'Bueno, ¿qué te trae al Cabo? ¿Un Pokémon perdido en la caja doce? Siempre es la caja doce. No sé por qué. La caja doce es un misterio de la ingeniería.' },
			{ if: 'flag.b04_rueda_llevas', then: [
				{ text: 'Le das el paquetito de la tienda de bicis.' },
				{ say: 'bill', text: '¡MI RUEDECITA! ¡Clic-clic! ¡Qué maravilla! Justo la que necesitaba. Dale las gracias de mi parte. No, mejor no, que se emociona. Bueno, sí. Dáselas.' },
				{ set: { 'flag.b04_rueda_entregada': true, 'flag.b04_rueda_llevas': false } },
				{ quest: 'b04_s_rueda', stage: 'gracias' },
			] },
			{ if: 'has("registroondas")', then: [
				{ text: 'Le enseñas las hojas de Caoba: columnas de números, horas, «sujetos». Y la firma, con una sola letra.' },
				{ say: 'bill', text: 'A ver, a ver, a ver. —Se pone unas gafas encima de las gafas—. «Pulso de tres ciclos». «Sincronización diaria con el tendido del este»… El tendido del este es el del Tren Magnético. Pero por un tendido así solo va una portadora. Algo poquito.' },
				{ say: 'bill', text: 'La señal de verdad va montada encima. Como un Remora… como un Remoraid en un Mantine. Y fíjate en el patrón: tres, pausa, tres. —Se queda muy quieto—. Esto lo conozco.' },
			], else: [
				{ if: 'has("muestralago")', then: [
					{ text: 'No tienes las hojas de Caoba. Pero tienes el frasco del Lago de la Furia. Se lo das.' },
					{ say: 'bill', text: '¿Agua? ¿Me traes agua? —Mira el frasco a contraluz. Las motitas brillan. Las acerca a un receptor del banco de trabajo, y cuando el receptor zumba, las motitas parpadean: tres, pausa, tres—. Oh. Oh, oh, oh. Esto lo conozco.' },
				], else: [
					{ say: 'rotom', text: '¡Bzzt! ¡Yo lo grabé! En el Lago de la Furia, el pitido que salía del agua. Lo tengo en la memoria. —Rotom reproduce un zumbido: tres, pausa, tres—.' },
					{ say: 'bill', text: 'Oh. —Bill deja el destornillador—. Ponlo otra vez. …Oh, oh, oh. Esto lo conozco.' },
				] },
			] },
			{ say: 'bill', text: 'Es **mi protocolo**. El del sistema de almacenamiento. Tres paquetes, pausa, tres paquetes. Así se mandan los Pokémon de un PC a otro. Alguien está usando la red de PC de toda Kanto como autopista para mover… esto. Lo que sea esto.' },
			{ say: 'bill', text: 'Espera, que lo sigo. —Se sienta delante de una computadora enorme llena de pegatinas y teclea a una velocidad que no parece humana—. Entra desde Johto por el tendido. Llega a **Azafrán**. Pasa por un repetidor… en un edificio pegado a Silph. ¿Quién ha puesto un repetidor ahí sin pedirme permiso?' },
			{ say: 'bill', text: 'Y desde Azafrán… no va a ningún PC. Ninguno. Sube al norte y **baja**. Hacia un sitio que no tiene PC, ni tendido, ni nada. —Gira la pantalla hacia ti. Un punto rojo parpadea junto a Celeste, al otro lado del río—. **La Cueva Celeste**.' },
			{ if: 'flag.b04_cueva_vista', then: [
				{ text: 'Te acuerdas de la valla azul y plata. De los focos. Del guardia que sonreía mucho. De cómo {riolu} se quedó quieto en el puente.', cond: LUC },
				{ text: 'Te acuerdas de la valla azul y plata. De los focos. Del guardia que sonreía mucho. Del aire frío.', cond: '!(' + LUC + ')' },
			] },
			{ say: 'bill', text: 'Lemnis dice que allí hace un estudio geológico, ¿no? Yo de rocas no sé mucho. Pero sé una cosa: las rocas no piden ancho de banda.' },
			{ say: 'rotom', text: '¡Bzzt! Los datos no iban a Azafrán. *Pasaban* por Azafrán. E iban a la Cueva.' },
			{ say: 'bill', text: 'Exacto. Y ahí abajo no llega mi red. Así que necesitas algo que oiga la señal tú solit{o|a|e}. Algo de bolsillo. Dame diez minutos. Bueno, veinte. Bueno, dame una hora y no te vayas.' },
			{ text: 'Bill se encierra en el banco de trabajo. Se oyen martillazos, soldador, un «¡ay!», otro «¡ay!», y una canción tarareada que no termina nunca. El Clefairy te trae un té sin que se lo pidas.' },
			{ cutscene: { bg: { type: 'lab' }, start: 'dark', frames: [
				{ text: 'Bill vuelve con algo en las manos. Una radio de bolsillo de color crema, con una antena plegable y una rejilla redonda. Le falta algo.' },
				{ text: 'Enrosca una **ruedecita** en el costado. Clic-clic. Gira suave.', cond: 'flag.b04_rueda_entregada' },
				{ text: 'Saca de un cajón un Voltorb de juguete, le quita una rueda con un destornillador y se la enrosca a la radio en el costado. Clic-clic. «Lo siento, Voltorbito», murmura.', cond: '!flag.b04_rueda_entregada' },
				{ text: 'Gira la ruedecita. La radio sisea. Ruido blanco. Nada. Bill frunce el ceño. «Está cerca, pero no la pilla. Le falta… oído».' },
				{ text: '{riolu} se acerca al banco de trabajo. Mira la radio. Cierra los ojos. Los apéndices de la cabeza se levantan, despacio, y empiezan a brillar.', cond: LUC },
				{ fx: 'glow', text: 'El aura azul de {riolu} roza la antena. Y la radio, de golpe, **pita**. Tres veces. Pausa. Tres veces. Bill se queda con la boca abierta y el destornillador en el aire.', cond: LUC },
				{ fx: 'glow', text: 'Bill le da un golpecito a la radio con el nudillo, como a un melón. La radio, de golpe, **pita**. Tres veces. Pausa. Tres veces. «¡Ja! Siempre funciona», dice Bill. No siempre funciona.', cond: '!(' + LUC + ')' },
				{ item: 'sintonizadorbill', fx: 'light', text: 'Bill toma un rotulador y, en la rejilla del altavoz, le dibuja dos puntitos y una sonrisa. «Así sabe que es querido. Las máquinas queridas funcionan mejor. Eso no lo dice ningún manual. Lo digo yo».' },
			] } },
			{ say: 'bill', text: 'El **Sintonizador de Bill**. Primer modelo. Único modelo. Está ajustado a esa frecuencia: cuando la tengas cerca, pita. Cuanto más cerca, más pita. Ahí abajo, en la oscuridad, te dirá por dónde va el hilo.' },
			{ if: LUC, then: [
				{ say: 'bill', text: 'Y tu Lucario… —Mira a {riolu} con los ojos brillantes—. Ha sintonizado una frecuencia con el aura. ¡Con el AURA! Si alguna vez quiere un trabajo, aquí hay un banco de trabajo con su nombre.' },
				{ text: '{riolu} resopla, muy digno. Pero se queda mirando la carita dibujada en la rejilla un rato largo.' },
				{ happy: { who: 'riolu', n: 10 } },
			] },
			{ give: 'sintonizadorbill' },
			{ set: { 'flag.b04_bill_hecho': true } },
			{ say: 'bill', text: 'Una cosa más. Si alguien está usando mi red para eso… —Por primera vez deja de hablar deprisa—. Yo hice la red para que la gente pudiera llevar a sus Pokémon a todas partes. Para que nunca tuvieran que dejar a ninguno atrás. No para esto.' },
			{ say: 'bill', text: 'Si llegas al fondo de esa cueva, cuéntamelo. Lo que sea. Quiero saber qué se están llevando por mis cables.' },
			{ intel: { npc: 'bill', text: 'Descifró la señal de Caoba: usa el protocolo del sistema de PC, entra por el tendido del Tren Magnético, pasa por un repetidor en Azafrán (pegado a Silph) y baja a la Cueva Celeste. Te dio el Sintonizador de Bill para seguirla bajo tierra.' } },
			{ diary: 'Hoy mi entrenador{|a|e} y yo conocimos a Bill, ¡el que inventó los PC! Su casa es un desastre por fuera y preciosa por dentro, como un regalo mal envuelto. Tiene un Clefairy que hace té. ¡Muy buen té!\n\nBill nos regaló una radio de bolsillo de color crema. ¡Le dibujó una cara! Dice que pita cuando hay algo interesante cerca. Yo creo que ya me quiere. Le he dicho hola. No me ha contestado, pero ha pitado un poco.\n\n¡Ahora somos un equipo de tres aparatos! Bueno, de dos. Bueno, yo soy más listo. Pero la radio es más mona.', cond: 'flag.b01_diario' },
			{ if: 'beat("misty_g8")', then: [
				{ say: 'rotom', text: '¡Bzzt! Misty, hecho. Bill, hecho. ¡Volvamos a Celeste a descansar! Me hace falta cargar. Y a la radio también, seguro.' },
			], else: [
				{ if: 'flag.b04_misty_cabo', then: [
					{ say: 'bill', text: 'Por cierto, Misty ha pasado por aquí hace un rato con cara de pocos amigos. Si vas al gimnasio, llévale buenas noticias. O no le lleves ninguna. Es más seguro.' },
				], else: [
					{ say: 'bill', text: 'Por cierto, en el Cabo, detrás de casa, hay alguien gritando desde hace media hora. Creo que es Misty. Creo que grita a alguien. Ve tú, que a mí me da miedo.' },
				] },
			] },
		],
		b04_bill_despues: [
			{ if: 'flag.b04_silph_hecho', then: [
				{ say: 'bill', text: '¿Cómo va mi Sintonizador? ¿Pita? ¿Pita mucho? Dime que pita mucho. No, no me lo digas, que me preocupo.' },
			], else: [
				{ say: 'bill', text: '¡Hola-hola! He cortado el repetidor de Azafrán de mi red. Bueno, lo he intentado. Han puesto otro. Lo he cortado. Han puesto otro. Estamos así desde ayer. Es como jugar a algo con alguien muy aburrido.' },
			] },
			{ say: 'bill', text: 'Si quieres usar mi PC, adelante. Es el original. Tiene pegatinas. La caja doce sigue siendo un misterio.' },
		],

		// =================== MISTY ===================
		b04_misty_ausente: [
			{ text: 'La plataforma de la líder está vacía. Una toalla con un Starmie bordado, unas chanclas, una nota pegada al trampolín con cinta adhesiva.' },
			{ text: '«**ME HE IDO AL CABO.** Vuelvo cuando vuelva. Si eres aspirante: entrena. Si eres de la tele: no. — M.»' },
			{ say: 'vecino_kanto', as: 'Niño con flotador', text: 'Se va al Cabo cuando el agua está rara. Al final de la Ruta 25, pasado el Puente Pepita. Dice que allí piensa mejor. Mi madre dice que allí grita mejor.' },
		],
		b04_misty_cabo: [
			{ set: { 'flag.b04_misty_cabo': true } },
			{ text: 'Detrás de la casa de Bill, el cabo baja en rocas hasta el mar. En la roca más alta, con las piernas colgando sobre el agua, hay una chica de pelo naranja recogido en una coleta de lado, con una camiseta amarilla y los brazos cruzados.' },
			{ text: 'Delante de ella, un chico con un ramo de flores mustias que habla muy deprisa y muy bajito.' },
			{ say: 'misty', as: 'Chica del pelo naranja', text: '¡QUE NO ES UNA CITA! ¡Te he dicho que vinieras a ver cómo nadan los Goldeen! ¡A los Goldeen! ¡Que llevan una semana nadando raro!' },
			{ say: 'pretendiente_cabo', text: 'Ya, pero… las flores…' },
			{ say: 'misty', as: 'Chica del pelo naranja', text: '¡Las flores, para tu madre!' },
			{ text: 'El chico se va arrastrando los pies. Al pasar junto a ti, te mira con los ojos húmedos y te da el ramo sin decir nada. Lo tomas por educación. Se le caen dos pétalos.' },
			{ say: 'misty', as: 'Chica del pelo naranja', text: '¿Y tú? ¿Tú también traes flores? —Te mira de arriba abajo. Mira tu caja de medallas. Mira a tu equipo—. …No. Tú traes otra cosa.' },
			{ say: 'misty', text: 'Misty. Líder de Celeste. Y antes de que digas nada: sí, me han dicho que tienes siete medallas y un Lucario. Brock me ha escrito desde Kalos. «Si pasa por Celeste uno con un Lucario, no lo subestimes».', cond: LUC },
			{ say: 'misty', text: 'Misty. Líder de Celeste. Y antes de que digas nada: sí, me han dicho que tienes siete medallas. Brock me ha escrito desde Kalos. «Si pasa por Celeste alguien de la Gira con siete medallas, no lo subestimes».', cond: '!(' + LUC + ')' },
			{ say: 'misty', text: 'Brock nunca escribe nada sin un corazoncito al final. Ese mensaje no tenía corazoncito. Eso, en Brock, es serio.' },
			{ text: 'Una Poké Ball de su cinturón se abre sola. Sale un **Golduck**, mira alrededor, se lleva las manos a la cabeza por pura costumbre y se sienta junto a ella.' },
			{ say: 'misty', text: 'De Psyduck se salía solo de la Poké Ball. Ahora que es Golduck sigue haciéndolo, pero con más dignidad. —Le rasca la cresta—. ¿Verdad que sí, bonito?' },
			{ say: 'misty', text: 'Vengo aquí cuando algo no me cuadra con el agua. Y ahora no me cuadra nada. Los Goldeen del río nadan contra corriente de noche. Hacia el oeste. Hacia la cueva. Todos. Los Goldeen no son tontos: si nadan contra corriente, es que algo los llama.' },
			{ say: 'misty', text: 'Y Lemnis va y pone una valla. «Estudio geológico». —Resopla—. Los Goldeen no saben geología. Pero saben cuándo algo va mal.' },
			{ text: '{riolu} mira hacia el oeste, hacia donde no se ve Celeste desde aquí. Misty sigue su mirada. Se queda callada un momento.', cond: LUC },
			{ say: 'misty', text: 'Bueno. ¡Basta de agua rara! Has venido a por la medalla, ¿no? Pues te espero en el gimnasio. Primero mis dos nadadores, luego yo. Y no tardes, que tengo un carácter, y no es de los que esperan.' },
			{ text: 'Misty salta de la roca a la arena y se va hacia el puente a paso rápido. Golduck la sigue tres pasos por detrás, con las manos en la cabeza.' },
			{ say: 'rotom', text: '¡Bzzt! Me cae bien. Me da un poco de miedo. Pero me cae bien.' },
			{ intel: { npc: 'misty', text: 'Va al Cabo cuando «el agua está rara». Los Goldeen del río de Celeste nadan de noche contra corriente, hacia la cueva vallada por Lemnis. Brock le escribió desde Kalos para avisarle de que no te subestimara.' } },
		],
		b04_misty_antes: [
			{ say: 'misty', text: '¡Hola otra vez! Primero mis nadadores. Lucía no perdona y Abel acaba en el agua igual, así que con él no tengas pena.' },
			{ say: 'misty', text: 'Yo estaré aquí. Con los pies en el agua. Pensando en cómo ganarte.' },
		],
		b04_misty_reto: [
			{ text: 'Misty está de pie en la plataforma central, sobre el agua, con los brazos en jarras. Las luces del techo se reflejan en la piscina y le dibujan ondas en la cara.' },
			{ if: 'flag.b03_gyarados_atrapado && inParty("gyarados")', then: [
				{ say: 'misty', text: 'Espera. —Te señala el cinturón—. ¿Ese es…? ¿Llevas un Gyarados rojo? ¿EL Gyarados rojo? ¿El del Lago de la Furia? ¡Salió en las noticias! ¡Llevo semanas queriendo verlo!' },
				{ say: 'misty', text: 'Luego me lo enseñas. Bien enseñado. Con calma. —Se recoloca la coleta—. Primero te gano.' },
			] },
			{ if: 'flag.b03_gyarados_calmado', then: [
				{ say: 'misty', text: 'Me han contado que en Johto alguien calmó al Gyarados rojo del Lago de la Furia. Sin capturarlo. Solo calmarlo. —Te mira de reojo—. Eso tiene más mérito que capturarlo, ¿lo sabías?' },
			] },
			{ if: 'flag.b03_gyarados_huido', then: [
				{ say: 'misty', text: 'Dicen que el Gyarados rojo del Lago de la Furia se fue. Que nadie pudo con él. Bah. Los Gyarados no huyen. Se toman su tiempo. Ya volverá.' },
			] },
			{ say: 'misty', text: 'Oye. —Te mira con los ojos entornados—. Tienes cara de alguien que ha perdido contra mí alguna vez. No me acuerdo. Me pasa mucho, perdona. Gano a mucha gente.' },
			{ say: 'misty', text: 'Si me ganas, son ocho medallas. Ya sabes lo que significa. Así que no voy a ir con cuidado. Voy a ir con todo. Porque te lo mereces. Y porque me encanta ganar.' },
			{ battle: 'misty_g8', onWin: [
				{ text: 'Starmie cae sobre el agua y se queda flotando, con la joya del centro parpadeando despacio. Misty se tira a la piscina sin pensárselo, nada hasta él y lo abraza. Le habla en voz baja. La joya deja de parpadear y brilla, tranquila.' },
				{ say: 'misty', text: '…Hay gente que tarda años en ganarme, ¿sabes? Años. —Sale del agua, chorreando, y se aparta el flequillo de la cara—. Tú te lo has tomado con calma, ¿eh?' },
				{ say: 'misty', text: 'No me mires así, que no lloro. Bueno. Un poco. Es el cloro.' },
				{ if: LUC, then: [
					{ say: 'misty', text: 'Y ese Lucario… pelea como si el agua no le pesara. Como si nadara por dentro. No sé explicarlo. Brock tenía razón. Que no se entere de que lo he dicho.' },
					{ happy: { who: 'riolu', n: 10 } },
				] },
				{ say: 'misty', text: 'Toma. La **Medalla Cascada**. Brilla como el río cuando le da el sol a las doce. Me costó mucho diseñarla. Nadie me lo agradece nunca.' },
				{ badge: 'medalla_cascada' },
				{ cap: 54 },
				{ quest: 'b04_m3', done: true },
				{ say: 'misty', text: 'Y esto. **MT Escaldar**. Agua hirviendo. Quema. Como yo cuando pierdo. Úsala bien.' },
				{ give: 'mt_escaldar' },
				{ heal: 'Los nadadores del gimnasio curan a tu equipo con toallas calientes y agua con limón. Abel sigue empapado. Se le ve feliz.' },
				{ text: 'La Pokédex vibra. Rotom se ilumina entero, como un árbol de Navidad.' },
				{ say: 'rotom', text: '¡Bzzt! ¡BZZT! ¡Notificación oficial del Circuito Infinito! Leo: «**{jugador}**: con ocho medallas de la temporada en curso, quedas **clasificad{o|a|e} para la Copa Infinita**. Te comunicaremos la sede y la fecha. Un mundo. Una liga».' },
				{ set: { 'flag.b04_clasificado': true } },
				{ say: 'rotom', text: '¡Clasificad{o|a|e}! ¡Somos un equipo clasificado! ¡Voy a ponerlo en mi fondo de pantalla! ¡Y en el tuyo! ¡En todos los fondos!' },
				{ say: 'misty', text: 'Felicidades. De verdad. —Te da un golpe en el hombro que duele un poco—. Y ahora vete, que voy a llorar más y no quiero testigos.' },
				{ say: 'rotom', text: 'Hay que celebrarlo con una foto. ¡En el **Puente Pepita**, al atardecer! Dicen que es el mejor sitio de Kanto para ver ponerse el sol.' },
				{ intel: { npc: 'misty', text: 'Te dio la Medalla Cascada (la octava) y la MT Escaldar. Con ella quedaste clasificad{o|a|e} para la Copa Infinita de la temporada.' } },
				{ diary: 'Hoy mi entrenador{|a|e} ganó a Misty, la líder de Celeste. ¡Fue durísimo! Su Starmie daba vueltas como una estrella de verdad y yo casi me mareo solo de mirar.\n\nAl final Misty se tiró a la piscina con la ropa puesta para abrazar a su Starmie. Dice que no lloraba, que era el cloro. ¡Yo la creo! El cloro es muy fuerte.\n\n¡Y ocho medallas! ¡Clasificad{o|a|e} para la Copa Infinita! He puesto la notificación de fondo de pantalla. Mi entrenador{|a|e} no ha dicho nada, pero ha sonreído todo el camino de vuelta.', cond: 'flag.b01_diario' },
				{ call: 'b04_lila_llamada' },
			] },
		],
		b04_misty_despues: [
			{ say: 'misty', text: '¡Hola, clasificad{o|a|e}! —Te salpica con el pie desde el trampolín—. Ya no puedo llamarte aspirante. Qué rabia. Me gustaba llamarte aspirante.' },
			{ if: '!flag.b04_silph_hecho', then: [
				{ say: 'misty', text: 'Los Goldeen siguen nadando raro de noche. Hacia la cueva. Si te enteras de qué los llama, ven a contármelo. Y si es algo de Lemnis, ven a contármelo más deprisa.' },
			], else: [
				{ say: 'misty', text: 'Los Goldeen ya no nadan tan raro. Más o menos. Algo ha cambiado en la cueva. No sé qué has hecho, pero el río te lo agradece. Y yo también, un poco.' },
			] },
			{ if: 'flag.b03_gyarados_atrapado && inParty("gyarados")', then: [
				{ say: 'misty', text: '¿Me dejas ver al Gyarados rojo? ¡Solo un momento! —Lo miras salir de la Poké Ball. Misty se queda sin palabras. Misty. Sin palabras—. …Es precioso. Cuídamelo. Bueno, cuídatelo.' },
			] },
		],
		b04_lila_llamada: [
			{ set: { 'flag.b04_lila_llamada': true } },
			{ text: 'Al salir del gimnasio, la Pokédex vuelve a vibrar. Esta vez es una llamada. En la pantalla: **Lila**.' },
			{ say: 'lila', text: '¿{jugador}? E-esto… soy Lila. Hola. Corelia me ha dicho que llame yo, porque si llamaba ella te iba a gritar y te ibas a quedar sord{o|a|e} antes de la Copa.' },
			{ say: 'corelia', as: 'Corelia (de fondo)', text: '¡¡¡OCHO MEDALLAS!!! ¡¡¡A TOPE!!!' },
			{ say: 'lila', text: 'Eso. Lo que ha dicho. —Se oye una risa pequeña—. Ha salido la lista de clasificados. Estás. Con tu nombre. Lo he leído tres veces. Sylveon lo ha leído cuatro, creo. Bueno, ha mirado la pantalla cuatro veces.' },
			{ text: 'Se oye un roce suave contra el micrófono: las cintas de Sylveon, que quieren saludar también.' },
			{ say: 'lila', text: 'Yo… he empezado a ayudar con los aprendices pequeños de la Torre. Los que se quedan bloqueados en las pruebas. Les digo que a mí también me pasaba. Que todavía me pasa. Parece que eso les ayuda más que cualquier otra cosa.' },
			{ choice: [
				{ text: '«Se te va a dar genial. Ya se te da.»', then: [
					{ af: { lila: 2 } },
					{ say: 'lila', text: '…Gracias. —Muy bajito—. Se me ponen las orejas rojas por teléfono. No sabía que eso se podía.' },
				] },
				{ text: '«¿Y tú? ¿La llama?»', then: [
					{ af: { lila: 1 } },
					{ say: 'lila', text: 'Todavía no. Pero ya no me da miedo que no salga. Es distinto. Es como… esperar a alguien que sabes que viene.' },
				] },
				{ text: '«¿Vendrás a verme a la Copa?»', then: [
					{ af: { lila: 2 } },
					{ say: 'lila', text: '¡S-sí! Claro. En primera fila. Con Sylveon. Y con Corelia, aunque grite. Sobre todo con Corelia, que si no grita nadie, no se oye.' },
				] },
			] },
			{ say: 'lila', text: 'Bueno. Te dejo, que estarás cansad{o|a|e}. Enhorabuena, {jugador}. De verdad. Muchísimo.' },
			{ intel: { npc: 'lila', text: 'Te llamó (con Corelia gritando de fondo) al salir la lista de clasificados para la Copa Infinita. Ayuda a los aprendices pequeños de la Torre Maestra que se bloquean en las pruebas.' } },
		],

		// =================== FINAL DEL TRAMO ===================
		b04_t1_fin: [
			{ if: 'flag.b04_t1_fin', then: [{ end: true }] },
			{ set: { 'flag.b04_t1_fin': true } },
			{ text: 'Esa noche te quedas en el Centro Pokémon de Celeste. La habitación da al río. Por la ventana entra el ruido del agua y, muy lejos, al oeste, el ronquido del generador de la valla.' },
			{ if: LUC, then: [
				{ text: '{riolu} se tumba a los pies de la cama, como siempre, con la espalda contra la pared y la cara hacia la puerta. Tarda en dormirse. Cuando por fin se duerme, el aura le brilla un poco, muy tenue, al ritmo de la respiración.' },
				{ text: 'Te quedas dormid{o|a|e} mirando ese brillo. Y sueñas.' },
				{ cutscene: { bg: { type: 'coast', far: '#2a3448', ground: '#4a3a3a' }, start: 'dark', frames: [
					{ text: 'Una isla. Rocas oscuras, de color de hierro viejo, con vetas de óxido. Olas grises que rompen sin ruido. El cielo, del mismo gris que el mar.' },
					{ text: 'En lo alto de un acantilado, de espaldas, un hombre con sombrero. No se mueve. El viento le agita el abrigo, pero no el sombrero.' },
					{ fx: 'glow', text: 'A su lado, un **Lucario**. Más alto que {riolu}. Más viejo. Mira el mar con los brazos cruzados, como quien espera un barco que lleva mucho tiempo sin llegar.' },
					{ text: 'El aura del Lucario del acantilado se enciende. Azul. Igual que la de {riolu}. Exactamente igual.' },
					{ fx: 'zoom', text: 'Y entonces se gira. Despacio. No hacia ti. Hacia {riolu}, que está a tu lado en el sueño, aunque no sabías que estaba.' },
					{ text: 'Se miran. Ninguno de los dos se mueve. El hombre del sombrero no se gira.' },
					{ fx: 'dark', text: 'Una ola rompe contra el acantilado. Esta vez sí suena.' },
				] } },
				{ text: 'Te despiertas de golpe. Está oscuro. {riolu} está sentado en el borde de la cama, despierto, mirando la ventana. Tiene la respiración rápida.' },
				{ text: 'Le pones la mano en la espalda. Tarda mucho en volver a tumbarse. Cuando lo hace, se pega a ti más que de costumbre.' },
				{ happy: { who: 'riolu', n: 5 } },
			], else: [
				{ text: 'Te quedas dormid{o|a|e} con el ruido del río. Sueñas con una isla de rocas oscuras, de color de hierro viejo, y con alguien de espaldas en un acantilado. Al despertar, no recuerdas nada más. Solo el color del mar: gris.' },
			] },
			{ text: 'Por la mañana, en el alféizar de la ventana, por fuera, hay una pluma gris clavada en la madera. Apunta hacia arriba. Hacia el tejado.' },
			{ text: 'Sales por la ventana. Hay una cornisa estrecha y una escalera de servicio que sube. Arriba, en el tejado del Centro Pokémon, sentada sobre el letrero luminoso como quien se sienta en un banco, una figura con capucha gris.' },
			{ say: 'ysolde', text: 'Buenos días. Has tardado dos minutos. Has mejorado. —Señala el horizonte, hacia el sur, donde se recorta Azafrán—. Mira.' },
			{ say: 'ysolde', text: 'Desde aquí se ve la Torre Lemnis de Azafrán. Y pegado a ella, Silph. Entre los dos edificios hay tres metros de hueco y una cornisa. Desde la calle no se ve. Desde arriba, sí.' },
			{ if: 'flag.b04_bill_hecho', then: [
				{ say: 'ysolde', text: 'Tu amigo el del Cabo te ha dicho adónde va la señal. Bien. Nosotros vamos a mirar de dónde sale. Y las señales salen de despachos. Y los despachos tienen archivos.' },
			] },
			{ say: 'ysolde', text: 'En los archivos de Silph hay algo con una sola letra al pie. Lo sé porque llevo un mes en ese tejado. Lo que no sé es cómo entrar sin que nos vean. Hay tres maneras. Cuál uses depende de a quién le debas favores. —Te mira—. Tú le debes favores a gente rara.' },
			{ say: 'ysolde', text: 'La llamo **Operación Tejado**. El nombre no es bonito. La operación tampoco lo va a ser.' },
			{ set: { 'flag.b04_ysolde_plan': true } },
			{ quest: 'b03_t_vencejos', done: true, cond: 'quest.b03_t_vencejos && !done.b03_t_vencejos' },
			{ if: 'flag.b03_vencejo_pluma', then: [
				{ say: 'ysolde', text: 'Pluma. —Te pone la mano en el hombro, un segundo—. Una Pluma no elige sus misiones. Se las asignan. Te la asigno.' },
				{ say: 'rotom', text: '¡Bzzt! ¡Nos han asignado una misión! ¡Con nombre! ¡Nunca nos habían asignado nada con nombre!' },
			], else: [
				{ say: 'ysolde', text: 'No eres Pluma. Así que no puedo asignarte nada. Puedo invitarte. Pero antes… —Señala el borde del tejado. Abajo, la calle. Y, justo debajo, el toldo a rayas rojas de la tienda de bicis—. Antes puedes saltar.' },
				{ if: LUC, then: [{ text: '{riolu} mira el toldo. Te mira a ti. Tiene la cara exacta de alguien que ya sabe cómo acaba esto.' }] },
				{ prompt: 'El borde del tejado. El toldo de la tienda de bicis.', choice: [
					{ text: 'Saltar.', then: [
						{ cutscene: { bg: { type: 'city', roofs: ['#3b7ac4', '#8ab0c8', '#e9e3d0'] }, start: 'light', frames: [
							{ fx: 'zoom', text: 'Das un paso al vacío. Tres pisos. El aire de la mañana huele a río. Un Pidgeotto te mira pasar con la cara de quien ha visto cosas peores.' },
							{ fx: 'shake', text: 'Caes en el toldo de la tienda de bicis. Rebota. Rebotas. Y aterrizas, de culo, sobre una montaña de cámaras de bicicleta que el dueño tenía apiladas en la acera.' },
							{ fx: 'flash', text: 'El dueño sale corriendo con un timbre en cada mano. Te mira. Mira el toldo. Te mira otra vez. «¿Quieres una bici?», pregunta, por si acaso.' },
						] } },
						{ set: { 'flag.b04_vencejo_pluma': true } },
						{ say: 'ysolde', text: 'Desde el tejado, sin levantar la voz, pero se oye igual: «Pluma. Bienvenid{o|a|e}. Te asigno la operación».' },
						{ say: 'rotom', text: '¡Bzzt! Altura: tres pisos. Rebotes: dos. Cámaras de bicicleta aplastadas: una. ¡Ha salido bien! Esta gente siempre sale bien. No entiendo cómo.' },
					] },
					{ text: '«Hoy no. Bajo por la escalera.»', then: [
						{ say: 'ysolde', text: 'La escalera también llega abajo. Más despacio. —Ni se inmuta—. Ven igual. Te abriré una ventana. Desde fuera.' },
					] },
				] },
			] },
			{ quest: 'b04_t_vencejos', stage: 'azafran' },
			{ say: 'ysolde', text: 'Te espero en los tejados de Azafrán. Busca la pluma más alta. Y no llegues por la puerta principal: allí hay cámaras que te conocen la cara.' },
			{ text: 'Te giras un segundo para mirar Azafrán. Cuando vuelves la vista, Ysolde ya no está. El letrero luminoso del Centro parpadea, como si alguien acabara de bajarse de él.' },
			{ quest: 'b04_m2', done: true },
			{ quest: 'b04_m4', stage: 'tejado' },
			{ say: 'rotom', text: '¡Bzzt! Bueno. Resumen: tenemos ocho medallas, una radio con cara, una foto bonita (o la tendremos) y una misión con nombre. ¡Volvemos a **Azafrán** por la Ruta 5!' },
			{ intel: { npc: 'ysolde', text: 'Te propuso la Operación Tejado desde el tejado del Centro de Celeste: entrar por arriba en los archivos de Silph, pegados a la Torre Lemnis de Azafrán. Hay tres formas de entrar, según a quién le debas favores.' } },
		],
	},

	// =====================================================================
	// NPCs GENÉRICOS DE ESTE TRAMO
	// =====================================================================
	npcs: {
		guarda_k5: { name: 'Guardia de la puerta norte', generic: true, look: { hair: 'cap', hairColor: '#4a4a4a', outfit: '#3b4a6a', outfit2: '#e9e8e0', skin: 2, eyesStyle: 'sleepy', mouth: 'flat', capColor: '#3b4a6a', acc: 'mustache' } },
		bicicletero: { name: 'Dueño de la tienda de bicis', generic: true, look: { hair: 'balding', hairColor: '#6a5a4a', outfit: '#c4473a', outfit2: '#e9e3d0', skin: 1, eyesStyle: 'happy', mouth: 'grin', acc: 'mustache' } },
		cazatalentos_lemnis: { name: 'Casimiro', title: 'Programa de Talentos', generic: true, look: { hair: 'sidepart', hairColor: '#2b2b38', outfit: '#2b2b38', outfit2: '#cfd6e2', skin: 1, eyesStyle: 'happy', mouth: 'smile', acc: 'lemnis tie', tie: '#3b5bb5' } },
		pretendiente_cabo: { name: 'Chico con flores', generic: true, look: { hair: 'curly', hairColor: '#6b4a2b', outfit: '#e9e3d0', outfit2: '#3b5bb5', skin: 1, eyesStyle: 'sleepy', mouth: 'open' } },
	},

	// =====================================================================
	// OBJETOS
	// =====================================================================
	items: {
		clausulabastien: { name: 'Foto de la cláusula 14.3', pocket: 'key', desc: 'Una foto, hecha con la Pokédex, de una página del contrato de Bastien. Un párrafo subrayado tres veces con tres bolígrafos distintos.',
			read: "**CONTRATO DE PATROCINIO · PROGRAMA DE TALENTOS · LEMNIS**\n*(página 31 de 40)*\n\n**14.3. Disponibilidad para estudios.**\nEl Talento permanecerá a disposición de la Fundación para estudios de rendimiento y **vínculo** (Talento–Pokémon titular), en las instalaciones que se designen, durante el tiempo que se estime necesario.\n\nInstalación designada (Kanto): **Celeste, emplazamiento 03**.\n\n*La presente cláusula subsistirá tras la rescisión del contrato por cualquiera de las partes.*\n\n---\n\nAl margen, con letra de Bastien, en tres tintas:\n*«¿Vínculo?»*\n*«¿Cómo se mide eso?»*\n*«No.»*" },
		valebici: { name: 'Vale de la tienda de bicis', pocket: 'key', desc: 'Un vale impreso en cartulina, con un sello de la tienda de bicis de Celeste y una firma con muchas florituras.',
			read: "**TIENDA DE BICIS DE CELESTE**\n*Desde hace mucho tiempo*\n\nEste vale da derecho a un **descuento de 1 ₽** en la compra de cualquier bicicleta del establecimiento.\n\nPrecio actual de la bicicleta del escaparate: **1.000.000 ₽**.\nPrecio con vale: **999.999 ₽**.\n\nNo caduca. No es transferible. No es broma.\n\n*Gracias por llevarle la ruedecita a Bill. Gira como un sueño. Eso dice él.*\n\n— El dueño" },
	},

	// =====================================================================
	// MISIONES PEQUEÑAS
	// =====================================================================
	quests: {
		b04_s_rueda: { name: 'La ruedecita', type: 'side', est: 15, stages: {
			encargo: 'Lleva el paquete de la **tienda de bicis** de Celeste a **Bill**, al final de las Rutas 24 y 25.',
			gracias: 'Bill ya tiene su ruedecita. Vuelve a la **tienda de bicis** de Celeste a contarlo.',
			hecha: 'La ruedecita gira como un sueño. El dueño de la tienda está muy orgulloso.',
		} },
	},

	// =====================================================================
	// RECOLECCIÓN
	// =====================================================================
	gather: {
		setas_k5: {
			name: 'Corro de setas bajo un roble', icon: '🍄', hours: 20, picks: [1, 3],
			text: 'Te agachas junto al corro de setas. Algunas son de comer. Otras, de mirar. Un Paras te observa desde la raíz con la cara de quien ha llegado primero.',
			wait: 'Solo quedan setas pequeñitas y un Paras que te vigila. Mejor volver otro día.',
			table: [
				{ id: 'tinymushroom', w: 24, n: [1, 3] }, { id: 'bigmushroom', w: 12, n: [1, 1] }, { id: 'honey', w: 10, n: [1, 1] },
				{ id: 'pechaberry', w: 12, n: [1, 2] }, { id: 'leppaberry', w: 8, n: [1, 1] }, { id: 'balmmushroom', w: 3, n: [1, 1] },
			],
		},
		orilla_pepita: {
			name: 'Orilla bajo el Puente Pepita', icon: '🐚', hours: 18, picks: [1, 3],
			text: 'Bajas por la escalerilla del puente hasta la orilla. El río deja cosas entre las piedras redondas: brillos, conchas y, a veces, algo dorado.',
			wait: 'La orilla está limpia. El río todavía no ha tenido tiempo de traer nada nuevo.',
			table: [
				{ id: 'pearl', w: 18, n: [1, 2] }, { id: 'stardust', w: 16, n: [1, 2] }, { id: 'heartscale', w: 10, n: [1, 1] },
				{ id: 'bigpearl', w: 6, n: [1, 1] }, { id: 'starpiece', w: 4, n: [1, 1] }, { id: 'nugget', w: 2, n: [1, 1] },
			],
		},
		flores_cabo: {
			name: 'Flores del Cabo', icon: '🌼', hours: 20, picks: [1, 3],
			text: 'Recorres el campo de flores del Cabo. El viento del mar las dobla todas hacia el mismo lado. Entre los tallos hay bayas y miel de algún Combee que no se ve.',
			wait: 'Las flores se están recuperando del viento. Mejor dejarlas un día.',
			table: [
				{ id: 'sitrusberry', w: 16, n: [1, 2] }, { id: 'oranberry', w: 14, n: [1, 3] }, { id: 'honey', w: 12, n: [1, 1] },
				{ id: 'razzberry', w: 12, n: [1, 2] }, { id: 'lumberry', w: 4, n: [1, 1] }, { id: 'miracleseed', w: 3, n: [1, 1] },
			],
		},
	},

	// =====================================================================
	// FICHAS DE RETO
	// =====================================================================
	challenges: {
		puente_pepita: {
			name: 'El Puente Pepita', trainer: 'pepita_5', type: 'Normal', rec: 51,
			cond: 'visited("ruta24")',
			info: [
				{ text: 'Cinco entrenadores seguidos, sin parar. El Centro de Celeste está justo detrás: cura antes de cruzar.' },
				{ text: 'Al final del puente espera alguien que no es del puente. Lleva traje y maletín.' },
				{ cond: 'flag.b04_puente_hecho', text: '✔ Cruzado. Te dieron la pepita. Y una oferta que no aceptaste.' },
			],
		},
		rival_bastien_b4: {
			name: 'Bastien en el puente', npc: 'bastien', trainer: 'bastien_5', type: 'Water', rec: 51,
			cond: 'flag.b04_bastien_puente',
			info: [
				{ text: 'Bastien quiere combatir para apuntarlo en una página nueva de su libreta. Es opcional.' },
				{ text: 'Cinco Pokémon, hasta el nivel 51. Su Greninja sale el último. Su espada viviente cambia de postura: golpéala cuando ataca.' },
				{ cond: 'beat("bastien_5")', text: '✔ Apuntado en «Cosas que son mías».' },
			],
		},
	},
};
