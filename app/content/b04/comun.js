// Bloque 4 — elementos comunes: medalla, objetos, tiendas, retos, enganche de inicio, viajes y aviso de ritmo.
const INICIO = 'flag.b03_fin && !flag.b04_inicio_hecho';
// Revisión de lógica de misiones (2026-10-10): los hilos de personajes se cierran al terminar su parte (la siguiente
// parte es otra misión). Las partidas que ya estaban en esa etapa final se cierran solas al entrar en cualquier ciudad
// o pueblo (onEnter sin `once`; `visited(...)` evita que cuente como «sitio donde avanzar» en lugares sin pisar).
const HILOS_PARADOS = 'quest.b01_t_rhi == "revancha" || quest.b01_t_agencia == "resuelto" || quest.b01_t_az == "visto" || quest.b01_t_ambar == "abierto" || quest.b01_t_cabina == "abierto" || quest.b01_t_vencejos == "abierto" || quest.b02_t_noa == "abierto" || quest.b02_t_ambar == "abierto" || quest.b02_t_cabina == "abierto" || quest.b02_t_vencejos == "abierto" || quest.b02_t_kaori == "abierto" || quest.b02_t_az == "visto" || quest.b02_t_agencia == "resuelto" || quest.b03_t_noa == "abierto" || quest.b03_t_ambar == "abierto" || quest.b03_t_vencejos == "abierto" || quest.b03_t_kaori == "abierto" || quest.b04_t_noa == "abierto" || quest.b04_t_kaori == "abierto" || quest.b04_t_renata == "abierto"';
const CIERRE = { script: 'logica_cierre_hilos', once: false };
export default {
	badges: {
		medalla_cascada: { name: 'Medalla Cascada', type: 'Water', desc: 'Circuito Infinito · Ciudad Celeste (Misty). La octava.' },
	},
	items: {
		sintonizadorbill: { name: 'Sintonizador de Bill', pocket: 'key', desc: 'Una radio de bolsillo color crema con una antena plegable y una ruedecita. Bill la ajustó a la frecuencia de la señal de Caoba: cuando la tienes cerca, pita. Cuanto más cerca, más pita.' },
		tarjetallave: { name: 'Tarjeta Llave', pocket: 'key', desc: 'Una tarjeta magnética gris con el logo de Silph S.A. Abre puertas que no tienen número.' },
		informefuentel: { name: 'Informe «Fuente: L.»', pocket: 'key', desc: 'Unas hojas grapadas sacadas del archivo de Silph. Cada línea es una hora y un lugar. Firmadas con una sola letra.', read: "**INFORME DE SEGUIMIENTO · SUJETO: COLABORADOR ESPECIAL (RIOLU/LUCARIO)**\nDestino: Infraestructura · copia a Dirección (Ω)\n\n- Luminalia, llegada: **06:42**. Fuente: L.\n- Agencia de Detectives, salida: 11:15. Fuente: L.\n- Relieve, Cueva Brillante: entrada aprox. 16:00, salida 19:40. Fuente: L.\n- Encinar (Johto), aparición tras el salto 23: hora corregida por Fuente: L.\n- Trigal, noche con el agente H.: «sin incidencias reseñables». Fuente: L.\n- Tren Magnético Trigal–Azafrán: llegada prevista **ayer**, real **hoy**. Fuente: L.\n\n*Nota al margen, a mano:* «L. pide que no se le mencione en las actas. L. pide lo mismo de siempre».\n\nGrapado a la última hoja: un caramelo de menta envuelto en papel azul." },
		expedienteolmedo: { name: 'Expediente de Matías Olmedo', pocket: 'key', desc: 'Una carpeta de personal de Silph S.A., con la esquina mordida por algún Rattata de archivo.', read: "**SILPH S.A. · EXPEDIENTE DE PERSONAL**\nNombre: **Matías Olmedo Rivas**. Puesto: ingeniero jefe, División Transporte.\nProyecto: ARCO (prototipo 1, subestación del Tren Magnético, Trigal).\n\nEvaluación: «Brillante. Hace demasiadas preguntas».\n\nÚltima anotación: **Baja voluntaria**. Tachado. Encima, con otra letra: **Trasladado a: Proyecto Arco II · Teselia**. Autoriza: un sello pequeño, dibujado a mano, con un ocho tumbado.\n\nGrapada atrás, una foto de carné: un hombre de unos cuarenta años con gafas torcidas y cara de no haber dormido. Detrás, a lápiz: *«Para D., por si preguntan»*." },
		fotoexpediente: { name: 'Foto de carné', pocket: 'key', desc: 'Lo único que quedaba en una carpeta vacía del archivo de Silph.', read: "Una foto de carné pegada con celo al fondo de una carpeta vacía: un hombre de unos cuarenta años con gafas torcidas y cara de no haber dormido.\n\nEn la carpeta, una etiqueta: **OLMEDO RIVAS, M.** Y una nota adhesiva amarilla: *«Contenido retirado por razones de patrimonio. No reabrir»*.\n\nDetrás de la foto, a lápiz: *«Para D., por si preguntan»*." },
		servilletam: { name: 'Servilleta del tren', pocket: 'key', desc: 'Una servilleta de papel del vagón restaurante del Tren Magnético, llena de números en columnas muy rectas.', read: "Columnas de cifras con unidades: *kV, Hz, s*. Una flecha que baja. Una suma con el resultado subrayado: **«3,1 %»**. Debajo, una frase escrita con la misma letra recta y pequeña:\n\n*«Pérdida aceptable. Mejora con la escala.»*\n\nY firmada, como quien firma por costumbre: **M.**" },
		diariofuji: { name: 'Hoja del diario de Fuji', pocket: 'key', desc: 'Una hoja muy vieja, amarilla y blanda de tanto doblarla, con letra temblorosa.', read: "*Hace muchos años, yo también creí que se podía dar más de lo que se tiene.*\n\n*Ayudé a hacer a un Pokémon más fuerte que ninguno. Le quitamos todo lo que era para darle todo lo que nosotros queríamos que fuera. Se despertó enfadado. Tenía razón.*\n\n*Ahora cuido de los que se cansan. Es lo único que sé hacer para pagar aquello.*\n\n*Si alguien viene a preguntarme por un cansancio que no se cura con dormir, le diré la verdad: no se cura. Se acompaña. Y se deja de causar.*\n\n— F." },
		notasmagda: { name: 'Libreta milimetrada', pocket: 'key', desc: 'Una libreta de tapas grises con todas las páginas cuadriculadas. La letra es recta, pequeña, sin un solo tachón.', read: "**NODO 03 · KANTO · CUEVA CELESTE**\n\nFuente principal: *estable, de gran capacidad, no catalogada en registros públicos*. Rendimiento en prueba: 31 %. Proyección a escala: 74 %.\n\nIncidencias: la fuente se resiste. Muy inteligente. Se ha adaptado a tres frecuencias distintas. Proponer frecuencia variable.\n\nCoste humano: cero. Coste en fauna local: *aceptable*. Coste en la fuente: *no medible con nuestros instrumentos*.\n\n*Nota personal:* De niña, en mi barrio, se iba la luz tres noches por semana. Mi madre hacía los deberes conmigo a la luz de un Chinchou. Nadie debería tener que estudiar a la luz de un Chinchou. La eficiencia es una forma de bondad.\n\n— M. I." },
		fotopuente: { name: 'Foto «Ocho»', pocket: 'key', art: 'puente_pepita', desc: 'La foto que hizo Rotom en el Puente Pepita al atardecer, el día de la octava medalla. Rotom dice que es la foto de «una persona clasificada».' },
		fotocueva: { name: 'Foto «Aura»', pocket: 'key', art: 'cueva_celeste_aura', desc: 'La Cueva Celeste por dentro, iluminada por un aura azul. Rotom no recuerda haberla hecho, pero está en la galería.' },
		mt_escaldar: { name: 'MT Escaldar', pocket: 'machines', tm: 'scald', desc: 'Agua hirviendo contra el objetivo. Puede causar quemaduras. Regalo de Misty.' },
		mt_psiquico: { name: 'MT Psíquico', pocket: 'machines', tm: 'psychic', desc: 'Una potente fuerza telequinética. Puede bajar la Defensa Especial del objetivo.' },
		mt_foco_resplandor: { name: 'MT Cañón Resplandor', pocket: 'machines', tm: 'flashcannon', desc: 'Concentra toda la luz del cuerpo y la dispara. Puede bajar la Defensa Especial.' },
		mt_onda_voltio: { name: 'MT Voltiocambio', pocket: 'machines', tm: 'voltswitch', desc: 'Ataca y vuelve a su Poké Ball para dar paso a otro Pokémon.' },
	},
	shops: {
		tienda_azafran: { name: 'Tienda de Azafrán', items: ['pokeball', 'greatball', 'ultraball', 'timerball', 'quickball', 'hyperpotion', 'maxpotion', 'revive', 'fullheal', 'maxrepel', 'ether', { id: 'mt_onda_voltio', price: 10000 }, { id: 'linkingcord', cond: 'flag.regalo_cordon' }] },
		tienda_celeste: { name: 'Tienda de Celeste', items: ['pokeball', 'greatball', 'ultraball', 'diveball', 'netball', 'hyperpotion', 'maxpotion', 'revive', 'fullheal', 'maxrepel', 'freshwater', 'sodapop', 'lemonade', { id: 'linkingcord', cond: 'flag.regalo_cordon' }] },
		tienda_lavanda: { name: 'Tienda de Lavanda', items: ['ultraball', 'duskball', 'hyperpotion', 'maxpotion', 'revive', 'fullheal', 'maxrepel', 'healball', { id: 'maxrevive', cond: 'flag.b04_atenea_vencida' }, { id: 'linkingcord', cond: 'flag.regalo_cordon' }] },
	},
	challenges: {
		gym_celeste: {
			name: 'Gimnasio de Ciudad Celeste', npc: 'misty', trainer: 'misty_g8', type: 'Water', rec: 53,
			cond: 'visited("celeste")',
			info: [
				{ text: 'Líder: **Misty**, tipo **Agua**. Dicen que no le gusta perder. Dicen que casi nunca pierde.' },
				{ cond: 'visited("gym_celeste")', text: '5 Pokémon, niveles 49 a 53. Su favorito es el último en salir.' },
				{ cond: 'visited("gym_celeste")', text: 'Los tipos **Eléctrico** y **Planta** le hacen mucho daño. En la Ruta 5 y en las Rutas 24 y 25 hay Pokémon Planta.' },
				{ cond: 'beat("misty_g8")', text: '✔ Medalla Cascada conseguida. Ocho medallas: clasificad{o|a|e} para la Copa Infinita.' },
			],
		},
		jefe_atenea_b4: {
			name: 'Los archivos de Silph', trainer: 'atenea_2', type: 'Poison', rec: 53,
			cond: 'quest.b04_m4 == "dentro" || done.b04_m4',
			info: [
				{ text: 'Alguien vigila los archivos de Silph S.A. por las noches. No lleva uniforme de Silph.' },
				{ cond: 'flag.b04_atenea_vista', text: '**Atenea**, del Team Rocket. Cinco Pokémon, hasta el nivel 53. Tipos **Veneno** y **Siniestro**.' },
				{ cond: 'flag.b04_atenea_vista', text: 'El **Acero** no se envenena. La **Lucha** y la **Tierra** le vienen bien.' },
				{ cond: 'beat("atenea_2")', text: '✔ Vencida. Los archivos son tuyos.' },
			],
		},
		jefe_magda: {
			name: 'El fondo de la Cueva Celeste', trainer: 'magda_1', type: 'Steel', rec: 53,
			cond: 'quest.b04_m5 == "nodo" || quest.b04_m5 == "decision" || done.b04_m5',
			info: [
				{ text: 'La señal de Caoba acaba en el fondo de la Cueva Celeste. Alguien la mantiene encendida.' },
				{ cond: 'flag.b04_magda_nombre', text: 'Se llama **Magda Ivers**. Firma con una sola letra.' },
				{ cond: 'flag.b04_magda_vista', text: 'Cinco Pokémon, hasta el nivel 53. Tipos **Acero**, **Eléctrico** y **Normal**. **Fuego**, **Tierra** y **Lucha** le hacen daño.' },
				{ cond: 'beat("magda_1")', text: '✔ La señal está cortada.' },
			],
		},
	},
	scripts: {
		logica_cierre_hilos: [
			{ quest: 'b01_t_rhi', done: true, silent: true, cond: 'quest.b01_t_rhi == "revancha"' },
			{ quest: 'b01_t_agencia', done: true, silent: true, cond: 'quest.b01_t_agencia == "resuelto"' },
			{ quest: 'b01_t_az', done: true, silent: true, cond: 'quest.b01_t_az == "visto"' },
			{ quest: 'b01_t_ambar', done: true, silent: true, cond: 'quest.b01_t_ambar == "abierto"' },
			{ quest: 'b01_t_cabina', done: true, silent: true, cond: 'quest.b01_t_cabina == "abierto"' },
			{ quest: 'b01_t_vencejos', done: true, silent: true, cond: 'quest.b01_t_vencejos == "abierto"' },
			{ quest: 'b02_t_noa', done: true, silent: true, cond: 'quest.b02_t_noa == "abierto"' },
			{ quest: 'b02_t_ambar', done: true, silent: true, cond: 'quest.b02_t_ambar == "abierto"' },
			{ quest: 'b02_t_cabina', done: true, silent: true, cond: 'quest.b02_t_cabina == "abierto"' },
			{ quest: 'b02_t_vencejos', done: true, silent: true, cond: 'quest.b02_t_vencejos == "abierto"' },
			{ quest: 'b02_t_kaori', done: true, silent: true, cond: 'quest.b02_t_kaori == "abierto"' },
			{ quest: 'b02_t_az', done: true, silent: true, cond: 'quest.b02_t_az == "visto"' },
			{ quest: 'b02_t_agencia', done: true, silent: true, cond: 'quest.b02_t_agencia == "resuelto"' },
			{ quest: 'b03_t_noa', done: true, silent: true, cond: 'quest.b03_t_noa == "abierto"' },
			{ quest: 'b03_t_ambar', done: true, silent: true, cond: 'quest.b03_t_ambar == "abierto"' },
			{ quest: 'b03_t_vencejos', done: true, silent: true, cond: 'quest.b03_t_vencejos == "abierto"' },
			{ quest: 'b03_t_kaori', done: true, silent: true, cond: 'quest.b03_t_kaori == "abierto"' },
			{ quest: 'b04_t_noa', done: true, silent: true, cond: 'quest.b04_t_noa == "abierto"' },
			{ quest: 'b04_t_kaori', done: true, silent: true, cond: 'quest.b04_t_kaori == "abierto"' },
			{ quest: 'b04_t_renata', done: true, silent: true, cond: 'quest.b04_t_renata == "abierto"' },
		],
	},
	patches: {
		// Enganche del inicio: el jugador termina el B3 en el Lago de la Furia
		lago_furia: {
			spots: [{ label: '🚆 Un billete de tren en la Pokédex', sub: 'La Gira continúa en Kanto', icon: '🎫', cond: INICIO, new: INICIO, script: 'b04_inicio' }],
		},
		caoba: {
			onEnter: [{ ...CIERRE, cond: 'visited("caoba") && (' + HILOS_PARADOS + ')' }],
			spots: [{ label: '🚆 Un billete de tren en la Pokédex', sub: 'La Gira continúa en Kanto', icon: '🎫', cond: INICIO, new: INICIO, script: 'b04_inicio' }],
		},
		estacion_magnetica: {
			spots: [
				{ label: '🚆 Tren Magnético a Kanto', sub: 'Billete gratis para la Gira', icon: '🎫', cond: INICIO, new: INICIO, script: 'b04_inicio' },
				{ label: '🚆 Tren a Azafrán', sub: 'Tren Magnético Trigal–Azafrán', icon: '🚆', cond: 'flag.b04_tren_hecho', action: { go: 'estacion_azafran' } },
			],
		},
		// Viajes por Puerta (se abren cuando T0 activa b04_puerta_azafran)
		luminalia_plaza: {
			spots: [{ label: 'Cruzar a Kanto (Azafrán)', sub: 'Puerta Lemnis', icon: '🌀', cond: 'flag.b04_puerta_azafran', action: { go: 'puerta_azafran' } }],
		},
		puerta_trigal: {
			spots: [{ label: 'Cruzar a Kanto (Azafrán)', sub: 'Puerta Lemnis', icon: '🌀', cond: 'flag.b04_puerta_azafran', action: { go: 'puerta_azafran' } }],
		},
		// Cierre de hilos parados (ver HILOS_PARADOS arriba)
		luminalia: { onEnter: [{ ...CIERRE, cond: 'visited("luminalia") && (' + HILOS_PARADOS + ')' }] },
		trigal: { onEnter: [{ ...CIERRE, cond: 'visited("trigal") && (' + HILOS_PARADOS + ')' }] },
		novarte: { onEnter: [{ ...CIERRE, cond: 'visited("novarte") && (' + HILOS_PARADOS + ')' }] },
		acuarela: { onEnter: [{ ...CIERRE, cond: 'visited("acuarela") && (' + HILOS_PARADOS + ')' }] },
		boceto: { onEnter: [{ ...CIERRE, cond: 'visited("boceto") && (' + HILOS_PARADOS + ')' }] },
		vanitas: { onEnter: [{ ...CIERRE, cond: 'visited("vanitas") && (' + HILOS_PARADOS + ')' }] },
		petroglifo: { onEnter: [{ ...CIERRE, cond: 'visited("petroglifo") && (' + HILOS_PARADOS + ')' }] },
		relieve: { onEnter: [{ ...CIERRE, cond: 'visited("relieve") && (' + HILOS_PARADOS + ')' }] },
		cromlech: { onEnter: [{ ...CIERRE, cond: 'visited("cromlech") && (' + HILOS_PARADOS + ')' }] },
		yantra: { onEnter: [{ ...CIERRE, cond: 'visited("yantra") && (' + HILOS_PARADOS + ')' }] },
		azalea: { onEnter: [{ ...CIERRE, cond: 'visited("azalea") && (' + HILOS_PARADOS + ')' }] },
		iris: { onEnter: [{ ...CIERRE, cond: 'visited("iris") && (' + HILOS_PARADOS + ')' }] },
		malva: { onEnter: [{ ...CIERRE, cond: 'visited("malva") && (' + HILOS_PARADOS + ')' }] },
		olivo: { onEnter: [{ ...CIERRE, cond: 'visited("olivo") && (' + HILOS_PARADOS + ')' }] },
		azafran: { onEnter: [{ ...CIERRE, cond: 'visited("azafran") && (' + HILOS_PARADOS + ')' }] },
		celeste: { onEnter: [{ ...CIERRE, cond: 'visited("celeste") && (' + HILOS_PARADOS + ')' }] },
		lavanda: { onEnter: [{ ...CIERRE, cond: 'visited("lavanda") && (' + HILOS_PARADOS + ')' }] },
	},
	milestones: [{ flag: 'b04_m_aviso', hoursLeft: 3 }],
};
