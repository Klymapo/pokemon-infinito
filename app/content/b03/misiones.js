// Misiones del Bloque 3 (las grandes). Los tramos las avanzan con sus etapas exactas.
export default {
	// ⭐ Principales
	b03_m1: { name: 'Palabras de piedra', type: 'main', est: 150, stages: {
		malva: 'La Dra. Solberg te espera en **Ciudad Malva**, al este de las Rutas 36 y 37.',
		ruinas: 'Acompaña a Irene a las **Ruinas Alfa**, junto a la **Ruta 32**.',
		camara: 'Hay una cámara sellada en las Ruinas Alfa. {riolu} quiere entrar.',
		hecha: 'Ya sabes qué hay en las Ruinas Alfa. Y qué quiere decir una etiqueta.',
	} },
	b03_m2: { name: 'La gira continúa', type: 'main', est: 200, stages: {
		trigal: 'El gimnasio de intercambio de **Ciudad Trigal** por fin abre. Vuelve a Trigal.',
		olivo: 'Sigue por las **Rutas 38 y 39** hasta **Ciudad Olivo**.',
		faro: 'Algo le pasa a la luz del **Faro de Olivo**.',
		hecha: 'La luz del Faro vuelve a brillar. Más o menos.',
	} },
	b03_m3: { name: 'Sexta medalla', type: 'main', est: 45, stages: {
		reto: 'Vence a la líder de intercambio del **Gimnasio de Ciudad Trigal**.',
		hecha: 'Conseguiste la Medalla Planicie.',
	} },
	b03_m4: { name: 'Séptima medalla', type: 'main', est: 45, stages: {
		reto: 'Vence a **Yasmina** en el Gimnasio de Ciudad Olivo.',
		hecha: 'Conseguiste la Medalla Mineral.',
	} },
	b03_m5: { name: 'El rancho de la Ruta 42', type: 'main', est: 90, stages: {
		rancho: 'Vuelve al **rancho de Don Aurelio**, en la Ruta 42.',
		decision: 'Alguien tiene que decidir qué pasa con el rancho.',
		hecha: 'El rebaño ya tiene quien lo cuide.',
	} },
	b03_m6: { name: 'Las aguas revueltas', type: 'main', est: 180, stages: {
		caoba: 'Cruza el **Monte Mortero** hasta **Pueblo Caoba**.',
		lago: 'Dicen que en el **Lago de la Furia**, al norte de Caoba, pasa algo raro.',
		guarida: 'La señal sale de algún sitio de **Pueblo Caoba**.',
		decision: 'Tienes a los últimos de «la familia» delante. Decide.',
		hecha: 'El agua del lago se calmó. La señal se apagó. Por ahora.',
	} },

	// 🧵 Hilos
	b03_t_lila: { name: 'La primera llave (III)', type: 'thread', stages: {
		trigal: 'Lila ayuda a Corelia en el gimnasio de intercambio de **Ciudad Trigal**.',
		hecha: 'Lila y su compañera ya no son las mismas. Para bien.',
	} },
	b03_t_rhi: { name: 'La delantera (III)', type: 'thread', stages: {
		llamada: 'Rhi ha llamado a casa. No te ha contado qué le dijeron.',
		hecha: 'Rhi te contó algo que no le cuenta a nadie. Otra vez.',
	} },
	b03_t_bastien: { name: 'Letra pequeña (III)', type: 'thread', stages: {
		olivo: 'Bastien está en **Ciudad Olivo** con su libreta.',
		hecha: 'Bastien tachó una línea de su libreta.',
	} },
	b03_t_noa: { name: 'Las jaulas (III)', type: 'thread', stages: {
		datos: 'Noa quiere pasarte algo. Lejos de cualquier cámara.',
		abierto: 'Noa sigue mirando etiquetas. Ahora sabe qué significan.',
	} },
	b03_t_renata: { name: 'Casos Fríos: el sótano', type: 'thread', stages: {
		sotano: 'Renata quiere bajar al sótano tapiado de la **estación del Tren Magnético** de Trigal.',
		hecha: 'Renata tiene el episodio de su vida. Falta decidir cuándo se emite.',
	} },
	b03_t_ambar: { name: 'El ámbar sin registro (III)', type: 'thread', stages: {
		ruinas: 'Petra ha llegado a las **Ruinas Alfa**.',
		abierto: 'El ámbar late cerca de lo que es muy viejo. O muy nuevo.',
	} },
	b03_t_vencejos: { name: 'Plumas en el tejado (III)', type: 'thread', stages: {
		sede: 'Ysolde te ha invitado a un sitio desde el que se ve todo **Ciudad Olivo**.',
		abierto: 'Ya sabes dónde se reúnen los Vencejos. No todos lo saben.',
	} },
	b03_t_kaori: { name: 'Dulce veneno (II)', type: 'thread', stages: {
		olivo: 'Kaori va camino de **Ciudad Olivo** con un antídoto a medio hacer.',
		muestra: 'Kaori necesita una muestra de lo que agita el **Lago de la Furia**.',
		abierto: 'El antídoto mejora. Kaori no duerme. Dice que no lo necesita.',
	} },
	b03_t_tobias: { name: 'El show debe continuar (II)', type: 'thread', stages: {
		torre: 'Tobías y Duquesa graban un episodio en la **Torre Bellsprout** de Ciudad Malva.',
		hecha: 'Sobreviviste a otro episodio del show de Tobías.',
	} },

	// 🧵 Hilo nuevo
	b03_t_ondas: { name: 'Las ondas', type: 'thread', stages: {
		senal: 'Alguien diseñó la señal de Caoba. Firmaba solo con una inicial.',
		abierto: 'Los datos de la señal iban a algún sitio fuera de Johto.',
	} },
};
