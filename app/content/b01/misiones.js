// Misiones del Bloque 1 (todas). Los guiones de cada tramo las avanzan.
export default {
	// ⭐ Principales
	b01_m1: { name: 'La Puerta', type: 'main', est: 35, stages: {
		inicio: 'Asiste a la inauguración de la Puerta Lemnis en la Plaza de la Torre Prisma.',
		lab: 'Acompaña al profesor Ciprés a su laboratorio.',
		hecha: 'La Puerta se abrió… a algo que no debía. Riolu te eligió.',
	} },
	b01_m2: { name: 'Colaborador especial', type: 'main', est: 60, stages: {
		ruta4: 'Handsome te pidió seguir el rastro de la Fisura por la **Ruta 4**, hacia Ciudad Novarte.',
		gimnasio: 'El rastro se perdió. Mientras tanto, gana la medalla del **Gimnasio de Ciudad Novarte** (Brock).',
		agencia: 'Handsome quiere verte en la **Agencia de Detectives** de Luminalia.',
		lemnis: 'Visita las oficinas de **Lemnis Kalos**, en Luminalia. Te esperan.',
		ruta5: 'Lemnis ha abierto la **Ruta 5**. Averigua qué hacen con los Pokémon desplazados.',
		hecha: 'Lemnis «recoge» Pokémon desplazados. Nadie sabe adónde los lleva.',
	} },
	b01_m3: { name: 'Primera medalla', type: 'main', est: 40, stages: {
		reto: 'Vence a **Brock** en el Gimnasio de Ciudad Novarte.',
		hecha: 'Conseguiste la Medalla Roca.',
	} },
	b01_m4: { name: 'Los rastros de la Fisura', type: 'main', est: 150, stages: {
		vanitas: 'Sigue hacia el oeste: **Pueblo Vánitas** y la **Ruta 7**.',
		snorlax: 'Un **Snorlax** bloquea la Ruta 7. Quizá alguien en Pueblo Vánitas sepa cómo despertarlo.',
		gruta: 'Cruza la **Gruta Tierraunida** hasta la costa.',
		petroglifo: 'Llega a **Pueblo Petroglifo**. Dicen que unos «trajes rojos» preguntan por fósiles.',
		hecha: 'Llegaste a la costa oeste de Kalos.',
	} },
	b01_m5: { name: 'Brillo en la oscuridad', type: 'main', est: 70, stages: {
		paso: 'Cruza el **Paso de Rhyhorn** (Ruta 9) hasta la **Cueva Brillante**.',
		cueva: 'Hay movimiento extraño al fondo de la **Cueva Brillante**.',
		hecha: 'El Team Flare ha vuelto… y alguien le paga.',
	} },
	b01_m6: { name: 'Segunda medalla', type: 'main', est: 50, stages: {
		reto: 'Vence a **Blanca** en el Gimnasio de Ciudad Relieve.',
		hecha: 'Conseguiste la Medalla Encanto.',
	} },
	b01_m7: { name: 'Las piedras de Crómlech', type: 'main', est: 90, stages: {
		ruta10: 'Sigue el **Camino Menhires** (Ruta 10) hasta **Pueblo Crómlech**.',
		cromlech: 'Lemnis excava en Pueblo Crómlech. Handsome quiere entrar de noche.',
		decision: 'Viste lo que hay bajo los menhires. Ahora te toca decidir qué hacer con ello.',
		hecha: 'Lo que dormía bajo Crómlech ya no duerme.',
	} },
	b01_m8: { name: 'La Torre Maestra', type: 'main', est: 100, stages: {
		yantra: 'Cruza la **Cueva Reflejos** y llega a **Ciudad Yantra**.',
		gimnasio: 'Vence a **Corelia** en el Gimnasio de Ciudad Yantra.',
		torre: 'Supera la **Prueba de la Torre Maestra**.',
		hecha: 'El vínculo con tu compañero despertó la Megaevolución.',
	} },

	// 🧵 Hilos (continúan en bloques futuros)
	b01_t_agencia: { name: 'Casos de la Agencia', type: 'thread', stages: {
		macaron: 'Matière tiene un caso para ti: **El robo del macaron** del Café Soleil (Luminalia).',
		resuelto: 'Resolviste el caso del macaron. Matière promete más casos.',
	} },
	b01_t_lila: { name: 'La primera llave', type: 'thread', stages: {
		conocida: 'Lila, aprendiz de la Torre Maestra, te ayudó con Riolu en la inauguración.',
		yantra: 'Lila te espera en **Ciudad Yantra**.',
		prueba: 'Acompaña a Lila en la **Prueba de la Llama** de la Torre Maestra.',
		hecha: 'Lila se enfrentó a la Prueba de la Llama.',
	} },
	b01_t_rhi: { name: 'La delantera', type: 'thread', stages: {
		conocida: 'Rhi, novata de Galar, te ha declarado la guerra. Más o menos.',
		relieve: 'Rhi quiere la revancha contra Blanca… y contra ti.',
		revancha: 'Rhi te ganó en Relieve y se fue a por su medalla. La próxima vez, el gol lo metes tú.',
		hecha: 'Rhi ya sabe tu nombre.',
	} },
	b01_t_sera: { name: 'La heredera', type: 'thread', stages: {
		discurso: 'Serafina Lemnis dio el discurso de la inauguración. No pestañeó cuando todo salió mal.',
		trato: 'Serafina te ofreció un trato en Pueblo Crómlech.',
		hecha: 'Ya sabes cómo juega Serafina Lemnis. Y ella sabe cómo juegas tú.',
	} },
	b01_t_bastien: { name: 'Letra pequeña', type: 'thread', stages: {
		conocido: 'Bastien, novato patrocinado por Lemnis, se quedó con Froakie.',
		ruta5: 'Bastien trabaja para Lemnis «por contrato». No parece contento.',
		cueva: 'Bastien vio algo en la Cueva Brillante que su contrato le prohíbe contar.',
		hecha: 'Tomaste una decisión sobre Bastien. Él no la olvidará.',
	} },
	b01_t_mareep: { name: 'Lana perdida', type: 'thread', stages: {
		buscar: 'Don Aurelio perdió 6 Mareep al cruzar la Fisura. Búscalos en las **Rutas 5, 7 y 8** y en la **Gruta Tierraunida**. (Usa «Buscar».)',
		volver: 'Ya tienes suficientes Mareep. Vuelve con **Don Aurelio** en la Ruta 5.',
		hecha: 'El rebaño de Don Aurelio está a salvo. Algún día te devolverá el favor en Johto.',
	} },
	b01_t_gaspar: { name: 'El recetario de Kalos', type: 'thread', stages: {
		ingredientes: 'Gaspar necesita **Miel**, una **Miniseta** y una **Baya Meloc** para su menú de Kalos.',
		ruta7: 'Gaspar está cocinando en la **Ruta 7**. Llévale los ingredientes.',
		hecha: 'Probaste el Menú de Kalos. Gaspar seguirá su recetario en otras regiones.',
	} },
	b01_t_hector: { name: '¡Transformación!', type: 'thread', stages: {
		skitty: 'Ayuda a Héctor a «rescatar» a un Skitty subido a un menhir (Ruta 10).',
		hecha: 'Héctor aprendió que ser héroe no siempre es ganar.',
	} },
	b01_t_tobias: { name: 'El show debe continuar', type: 'thread', stages: {
		cueva: 'Tobías y Duquesa van a «la mazmorra de esta temporada»: la Cueva Brillante.',
		hecha: 'Sobreviviste a un episodio del show de Tobías.',
	} },
	b01_t_az: { name: 'La flor eterna', type: 'thread', stages: {
		visto: 'Un hombre enorme con una Floette te habló en la Ruta 10. Sus palabras sonaban a advertencia.',
	} },

	// 📜 Secundarias
	b01_s_fennekin: { name: 'El zorrito perdido', type: 'side', est: 35, stages: {
		buscar: 'El Fennekin de Ciprés huyó hacia el sur. Dicen que lo vieron en el **Bosque de Novarte**.',
		pistas: 'Hay huellas chamuscadas en el Bosque de Novarte. Sigue avanzando.',
		volver: 'Cuéntale al **profesor Ciprés** (Luminalia) qué pasó con Fennekin.',
		hecha: 'Fennekin está a salvo.',
	} },
	b01_s_rhyhorn: { name: 'Carrera de Rhyhorn', type: 'side', est: 25, stages: {
		reto: 'La campeona retirada de **Pueblo Boceto** te reta a una carrera de Rhyhorn.',
		hecha: '¡Tienes montura! Rhyhorn te lleva por las rutas.',
	} },
	b01_s_fotos: { name: 'Fotos de lo imposible', type: 'side', est: 0, stages: {
		registrar: 'Alexia quiere fotos de Pokémon desplazados. Registra **5 especies desplazadas** en la Pokédex y vuelve con ella (Ciudad Novarte).',
		hecha: 'Alexia publicó tus fotos. Su artículo da que hablar.',
	} },
	b01_s_philippe: { name: 'La baraja perdida', type: 'side', est: 15, stages: {
		buscar: 'Un Pancham le robó la baraja a Philippe en la **Ruta 5**. Usa «Buscar».',
		volver: 'Devuélvele la baraja a **Philippe** (Café Soleil, Luminalia).',
		hecha: 'Philippe recuperó su baraja. Su truco sigue siendo malísimo.',
	} },
	b01_s_conde: { name: 'El insomnio del Conde', type: 'side', est: 20, stages: {
		fantasma: 'El Conde Vladimiro quiere conocer a un Pokémon de tipo **Fantasma** o **Siniestro**. Llévalo en tu equipo al Castillo Caduco.',
		hecha: 'El Conde te dio la Poké Flauta.',
	} },
	b01_s_fosil: { name: 'Voces de piedra', type: 'side', est: 15, stages: {
		elegir: 'Elige un fósil al fondo de la Cueva Brillante.',
		hecha: 'Un Pokémon prehistórico ha vuelto a la vida.',
	} },
	b01_s_furfrou: { name: 'Corte de pelo', type: 'side', est: 15, stages: {
		buscar: 'El Furfrou de una señora de Ciudad Novarte escapó a la **Ruta 4** tras un mal corte de pelo.',
		hecha: 'Furfrou volvió a casa. Con un corte nuevo.',
	} },
	b01_s_espejo: { name: 'Lo que ve el espejo', type: 'side', est: 10, stages: {
		cueva: 'En la Cueva Reflejos, Riolu se quedó mirando su reflejo…',
		hecha: 'Riolu vio en el espejo algo que todavía no es.',
	} },

	// 🎉 Eventos
	ev_halloween: { name: 'El Gran Atraco de Halloween', type: 'event', stages: {
		inicio: 'El Conde Vladimiro organiza un «atraco» en el Castillo Caduco. Alguien robó la **Calabaza de Oro**. Interroga a los sospechosos.',
		hecha: 'Resolviste el Gran Atraco de Halloween.',
	} },
	ev_muertos: { name: 'La ofrenda', type: 'event', stages: {
		flores: 'La abuela Remedios necesita **5 Flores de Cempasúchil** para su ofrenda (búscalas en las Rutas 4, 5 y 7 con «Buscar»).',
		hecha: 'La ofrenda de la familia Ortega está completa.',
	} },
};
