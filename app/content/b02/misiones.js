// Misiones del Bloque 2 (las grandes). Los tramos las avanzan con sus etapas exactas.
// Los hilos del B1 que siguen abiertos se cierran al retomarlos y continúan aquí con un id b02_.
export default {
	// ⭐ Principales
	b02_m1: { name: 'Un mundo. Una liga.', type: 'main', est: 120, stages: {
		inicio: 'Vuelve a **Luminalia**. Handsome te espera en la **Agencia de Detectives**.',
		preparativos: 'La ceremonia de la Gira es en la **Plaza de la Torre Prisma**. Despídete de quien quieras antes de cruzar.',
		hecha: 'Cruzaste la Puerta. No te dejó donde debía.',
	} },
	b02_m2: { name: 'Donde los relojes se paran', type: 'main', est: 120, stages: {
		santuario: 'Despertaste en un bosque de Johto que no sale en la Gira. Sal del **Encinar**.',
		azalea: 'Llega a **Pueblo Azalea** y averigua dónde estás… y cuándo.',
		pozo: 'Algo pasa en el **Pozo Slowpoke** de Azalea.',
		niebla: 'Una niebla extraña cierra el **Encinar** hacia la **Ruta 34**. Quizá {riolu} pueda abrir paso.',
		hecha: 'La niebla del Encinar se apartó. El tiempo, más o menos, también.',
	} },
	b02_m3: { name: 'Cuarta medalla', type: 'main', est: 40, stages: {
		reto: 'Vence a **Antón** en el Gimnasio de Pueblo Azalea.',
		hecha: 'Conseguiste la Medalla Colmena.',
	} },
	b02_m4: { name: 'Tres días tarde', type: 'main', est: 150, stages: {
		ruta34: 'Sigue la **Ruta 34** hasta **Ciudad Trigal**, donde te espera la Gira.',
		trigal: 'Preséntate en el **pabellón de la Gira**, en Ciudad Trigal.',
		gira: 'La Gira sigue sin ti… o contigo. Ponte al día en **Ciudad Trigal**.',
		hecha: 'Ya eres parte de la Gira. Siguiente parada: **Ciudad Iris**.',
	} },
	b02_m5: { name: 'Ecos bajo la torre', type: 'main', est: 180, stages: {
		rutas: 'Sigue por la **Ruta 35** y el **Parque Nacional** hacia las **Rutas 36 y 37**, camino de **Ciudad Iris**.',
		iris: 'Llega a **Ciudad Iris**.',
		teatro: 'Algo enferma a los Pokémon del **Teatro de Danza** de Iris.',
		torre: 'La pista lleva al sótano de la **Torre Quemada**.',
		decision: 'Tienes el fragmento en la mano. Decide qué hacer con él.',
		hecha: 'Bajo la Torre Quemada, los caramelos dejaron de fabricarse. Y alguien descubrió que no era el único cliente de su benefactor.',
	} },
	b02_m6: { name: 'Quinta medalla', type: 'main', est: 45, stages: {
		reto: 'Vence a **Morti** en el Gimnasio de Ciudad Iris.',
		hecha: 'Conseguiste la Medalla Niebla.',
	} },

	// 🧵 Hilos (continúan los del B1 y abren uno nuevo)
	b02_t_lila: { name: 'La primera llave (II)', type: 'thread', stages: {
		ceremonia: 'Lila representa a la Torre Maestra en la ceremonia de la Gira.',
		trigal: 'Lila llegó a **Ciudad Trigal** antes que Corelia, para preparar el gimnasio de intercambio.',
		hecha: 'Lila se defendió sola. Ni ella se lo cree.',
	} },
	b02_t_rhi: { name: 'La delantera (II)', type: 'thread', stages: {
		trigal: 'Rhi llegó a Johto a tiempo. Tú no. Te está buscando en **Ciudad Trigal**.',
		carta: 'A Rhi le llegó una carta. No quiere hablar de ella. Mucho.',
		hecha: 'Rhi te enseñó algo que no le enseña a nadie.',
	} },
	b02_t_sera: { name: 'La heredera (II)', type: 'thread', stages: {
		encargo: 'Serafina te hizo un **encargo** por el Holomisor: recuperar algo que robaron de la **Central de Kalos**.',
		anfitriona: 'Serafina es la anfitriona de la Gira en Johto.',
		fragmento: 'El objeto robado de la Central está en Johto. Serafina quiere saber quién lo tiene.',
		hecha: 'Serafina sabe lo que hiciste con el fragmento.',
	} },
	b02_t_bastien: { name: 'Letra pequeña (II)', type: 'thread', stages: {
		trigal: 'Bastien está en la Gira. Lo que pasó en la Cueva Brillante le sigue pesando.',
		hecha: 'Bastien y tú pusisteis las cuentas al día. Más o menos.',
	} },
	b02_t_noa: { name: 'Las jaulas', type: 'thread', stages: {
		centro: 'Noa Lambert quiere enseñarte algo del **centro de procesamiento** de Lemnis, en Luminalia.',
		johto: 'Noa también está en la Gira. Quiere hablar contigo en **Ciudad Trigal**, lejos de las cámaras.',
		abierto: 'Noa sigue mirando las etiquetas. Cada vez le gustan menos.',
	} },
	b02_t_aurelio: { name: 'El rancho de la Ruta 42', type: 'thread', stages: {
		invitacion: 'Don Aurelio te invitó a su rancho de la **Ruta 42**, al este de **Ciudad Iris**.',
		rancho: 'Visita el **rancho de Don Aurelio**.',
		hecha: 'Pasaste una tarde en el rancho de Don Aurelio.',
	} },
	b02_t_gaspar: { name: 'El recetario de Johto', type: 'thread', stages: {
		ingredientes: 'Gaspar quiere hacer los dulces de **Ciudad Iris**. Le faltan ingredientes de las rutas de Johto.',
		iris: 'Lleva los ingredientes a **Gaspar**, en Ciudad Iris.',
		hecha: 'Probaste el Menú de Johto. Gaspar ya piensa en la siguiente región.',
	} },
	b02_t_hector: { name: '¡Transformación! (II)', type: 'thread', stages: {
		agencia: 'Héctor quiere entrar en la **Agencia de Detectives** de Luminalia. Le falta valor. Y una excusa.',
		hecha: 'Héctor conoció a Matière. Sigue sin creerse que fuera Esprit. O sí.',
	} },
	b02_t_az: { name: 'La flor eterna (II)', type: 'thread', stages: {
		puerta: 'El hombre enorme de la Floette está junto a la Puerta Lemnis de Luminalia.',
		visto: 'El hombre de la Floette te advirtió de nuevo. Esta vez sobre la Puerta.',
	} },
	b02_t_agencia: { name: 'Casos de la Agencia (II)', type: 'thread', stages: {
		caso: 'Matière tiene un caso nuevo para ti, por holomisor, desde **Ciudad Trigal**.',
		resuelto: 'Resolviste el caso de Trigal. Matière archiva el expediente con una sonrisa.',
	} },
	b02_t_renata: { name: 'Casos Fríos: el testigo', type: 'thread', stages: {
		llamada: 'Renata necesita un testigo en **Ciudad Trigal** para «El ingeniero que no volvió a casa».',
		testigo: 'Encuentra al testigo de Renata en Ciudad Trigal.',
		hecha: 'Renata tiene una voz nueva para su episodio. Y una pregunta nueva.',
	} },
	b02_t_ambar: { name: 'El ámbar sin registro (II)', type: 'thread', stages: {
		encinar: 'Petra está en el **Encinar**, buscando «el bosque donde los relojes se paran». Lo ha encontrado. Más o menos.',
		late: 'El ámbar late cuando el destello verde del bosque anda cerca.',
		abierto: 'Petra sabe un poco más de su ámbar. Lo justo para tener más preguntas.',
	} },
	b02_t_cabina: { name: 'La cabina azul (II)', type: 'thread', stages: {
		atascada: 'La cabina azul se ha quedado atascada en el **Encinar**.',
		abierto: 'Ulises sigue buscando «algo pequeñito que late a destiempo». Cree que está más cerca.',
	} },
	b02_t_vencejos: { name: 'Plumas en el tejado (II)', type: 'thread', stages: {
		tejado: 'Alguien con capucha te observa desde los tejados de **Ciudad Trigal**.',
		abierto: 'Ysolde dice que los Vencejos vigilaban a alguien de Lemnis desde antes de que existiera Lemnis.',
	} },

	// 🧵 Hilo nuevo
	b02_t_kaori: { name: 'Dulce veneno', type: 'thread', stages: {
		trigal: 'Una boticaria de Johto miraba los caramelos de la Gira como quien mira una serpiente.',
		iris: 'Kaori, la boticaria del **Teatro de Danza** de Ciudad Iris, necesita ayuda con los Pokémon enfermos.',
		muestra: 'Kaori necesita una muestra del origen del «veneno».',
		abierto: 'Kaori trabaja en un antídoto. Dice que tardará. Dice que le encanta.',
	} },
};
