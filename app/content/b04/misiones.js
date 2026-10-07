// Misiones del Bloque 4 (las grandes). Los tramos las avanzan con sus etapas exactas.
export default {
	// ⭐ Principales
	b04_m1: { name: 'Billete a Kanto', type: 'main', est: 120, stages: {
		tren: 'Toma el **Tren Magnético** de la estación de **Ciudad Trigal** hacia Kanto.',
		azafran: 'Ya estás en **Ciudad Azafrán**. La Gira te espera en la **Torre Lemnis**.',
		hecha: 'Llegaste a Kanto. Algo raro pasó en el túnel, pero llegaste.',
	} },
	b04_m2: { name: 'Rumbo al norte', type: 'main', est: 240, stages: {
		ruta5: 'Sube por la **Ruta 5** hasta **Ciudad Celeste**.',
		celeste: 'En **Ciudad Celeste** hay un gimnasio… y alguien que sabe leer señales al norte, pasado el **Puente Pepita**.',
		bill: 'Lleva el registro de la señal a **Bill**, en su casa del final de las **Rutas 24 y 25**.',
		hecha: 'Bill te dijo adónde va la señal. Y te dio con qué seguirla.',
	} },
	b04_m3: { name: 'Octava medalla', type: 'main', est: 50, stages: {
		reto: 'Vence a **Misty** en el Gimnasio de Ciudad Celeste.',
		hecha: 'Conseguiste la Medalla Cascada. Ocho medallas.',
	} },
	b04_m4: { name: 'Operación Tejado', type: 'main', est: 150, stages: {
		tejado: 'Ysolde te espera en los tejados de **Ciudad Azafrán**.',
		dentro: 'Llega a los archivos de **Silph S.A.** sin que te vean.',
		hecha: 'Saliste con lo que buscabas. Y con algo que no buscabas.',
	} },
	b04_m5: { name: 'Lo que hay bajo Celeste', type: 'main', est: 180, stages: {
		cueva: 'La señal termina en la **Cueva Celeste**, junto a Ciudad Celeste.',
		nodo: 'Sigue el hilo de luz hasta el fondo de la **Cueva Celeste**.',
		decision: 'Alguien a quien conoces está delante de ti. Decide.',
		hecha: 'La cueva está en silencio. No todo lo que había dentro sigue allí.',
	} },

	// 🧵 Hilos
	b04_t_noa: { name: 'Las jaulas (IV)', type: 'thread', stages: {
		celeste: 'Noa está en **Ciudad Celeste**, de uniforme. Te pidió que no la saludaras.',
		abierto: 'Noa te pidió algo para «si un día no contesta».',
	} },
	b04_t_vencejos: { name: 'Plumas en el tejado (IV)', type: 'thread', stages: {
		azafran: 'Ysolde tiene un plan para los tejados de **Ciudad Azafrán**.',
		hecha: 'Volviste de la operación con las alas enteras.',
	} },
	b04_t_kaori: { name: 'Dulce veneno (III)', type: 'thread', stages: {
		lavanda: 'Kaori está en **Pueblo Lavanda** buscando a alguien que sepa de cansancios raros.',
		abierto: 'El antídoto estabiliza. Todavía no cura.',
	} },
	b04_t_renata: { name: 'Casos Fríos: el traslado', type: 'thread', stages: {
		archivo: 'En los archivos de Silph podría haber algo de **Matías Olmedo**.',
		abierto: 'Renata ya sabe lo que encontraste. Dice que el próximo episodio se graba lejos.',
	} },
	b04_t_bastien: { name: 'Letra pequeña (IV)', type: 'thread', stages: {
		puente: 'Bastien está cerca del **Puente Pepita**, leyendo su contrato otra vez.',
		hecha: 'Bastien encontró una cláusula que no le gustó nada.',
	} },
	b04_t_show: { name: 'El show debe continuar (III)', type: 'thread', stages: {
		lavanda: 'Tobías prepara un especial de fantasmas en **Pueblo Lavanda**. El Prof. Gadd también anda por allí.',
		hecha: 'Sobreviviste al especial de fantasmas.',
	} },
	b04_t_lebrun: { name: 'Quien sabe a qué hora llegas', type: 'thread', stages: {
		sospecha: 'Alguien sabe siempre a qué hora llegas a los sitios. Ten los ojos abiertos en **Ciudad Azafrán**.',
		prueba: 'Tienes un informe firmado con una sola letra: **L.** Salió de los archivos de **Silph S.A.** Guárdalo bien hasta saber quién es L.',
		hecha: 'Ya sabes quién era. Y decidiste qué hacer.',
	} },

	// 🧵 Hilo nuevo
	b04_t_cueva: { name: 'Lo que vive en la cueva', type: 'thread', stages: {
		abierto: 'Algo muy poderoso y muy cansado vivía en la Cueva Celeste. Ya no está allí.',
	} },
};
