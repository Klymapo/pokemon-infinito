// Bloque 3 — elementos comunes: medallas, objetos, tiendas, retos, enganche de inicio y aviso de ritmo.
export default {
	badges: {
		medalla_planicie: { name: 'Medalla Planicie', type: 'Fighting', desc: 'Circuito Infinito · Ciudad Trigal (Corelia, de intercambio).' },
		medalla_mineral: { name: 'Medalla Mineral', type: 'Steel', desc: 'Circuito Infinito · Ciudad Olivo (Yasmina).' },
	},
	items: {
		cartaaurelio: { name: 'Carta de Don Aurelio', pocket: 'key', desc: 'Un sobre de papel de estraza. En el remite, con letra grande y apretada: «Para cuando haga falta».', read: "«Muchach{o|a|e}:\n\nSi está leyendo esto, es que no me dio tiempo a decírselo en el porche. Ya me perdonará. Nunca he sido bueno con los tiempos: llego tarde a todo menos al ordeño.\n\nLe escribo por si acaso. Desde lo de Kalos ando cansado. El médico de Caoba dice que es la edad. Yo no le digo nada, porque la edad la tenía antes y no me cansaba así. Volví de aquella grieta morada como si me hubieran quitado unos años. No de encima: de los que me quedaban. No se lo cuente a Adela, que se preocupa y luego me pincha.\n\nEl rebaño son cincuenta y tres, más las que nazcan. Los nombres están en el cuaderno. Copito se va a poner rara: se pone rara cuando falta alguien. Rásquele detrás de la oreja izquierda. La derecha no. Borla va a comerse lo que no debe; déjela, que es su manera de estar triste. Y si de noche ve una lucecita por el prado, no es nada: son ellas, que se encienden para no perderse.\n\nA los del folleto, ni agua. Pero si un día hace falta elegir entre mi cabezonería y que ellas coman, que coman. Yo ya no como.\n\nUsted me trajo a mis niñas desde el otro lado del mundo. Eso no lo hace cualquiera. Las cosas buenas se quedan en los sitios, ya se lo dije. Usted es de las que se van, y está bien: alguien tiene que llevárselas a otros sitios.\n\nComa. Duerma. Y cuando pase por la Ruta 42, silbe. Que aunque yo no conteste, ellas sí.\n\nSu amigo,\nAurelio Prado\n\nP. D.: La mecedora no se vende. Que se siente alguien. Aunque sea Copito.»" },
		traduccionunown: { name: 'Traducción de Irene', pocket: 'key', desc: 'Una hoja de libreta con letras Unown copiadas con cuidado y, debajo, la letra pequeña y limpia de Irene.', read: "**Puerta de la cámara grande · Ruinas Alfa**\n\nAlrededor de la flor, en círculo: «Aquí descansa lo que no se puede deshacer. Que la abra quien sepa la palabra que no se escribe».\n\nLa palabra que no se escribe —la que {riolu} leyó con el aura— es **DAR**.\n\n**Mural del fondo**\nIzquierda: una flor pequeña; un rey gigante, coronado, se inclina hacia ella con las manos abiertas. Debajo: **DAR**.\nDerecha: una máquina con forma de flor. De ella salen rayos hacia personas y Pokémon tumbados. Debajo: **TOMAR**.\n\n*Nota de I. S.:* En esta escritura, «tomar» siempre lleva complemento: se toma **de** alguien. «Dar», también: se da **a** alguien. No es una prohibición. Es una balanza. La runa raspada en Yantra y la quemada en Iris eran la misma: «tomar». Alguien quiso que no se leyera.\n\nLo que la máquina toma, se lo quita a los tumbados. Lo que el rey da, lo da de sí mismo.\n\n*(Debajo, más pequeño:)* Gracias por apartarte de la piedra. — I." },
		planoprototipo: { name: 'Plano del prototipo', pocket: 'key', desc: 'Un plano técnico amarillento, doblado muchas veces. Huele a sótano.', read: "**PROYECTO ARCO · PROTOTIPO 1 · Hoja 3 de 3**\nSilph S.A. · División Transporte · Diseño: M. Olmedo\n\nDos columnas de aleación, 4,2 m. Separación entre bobinas: 3,1 m. Alimentación auxiliar: subestación del Tren Magnético (*no basta*).\n\nEn el cajetín, junto a «Aprobado por», un sello pequeño dibujado a mano: un ocho tumbado. Debajo, la firma está en blanco.\n\nAnotaciones al margen, en bolígrafo azul:\n\n*Prueba 11: el arco se abre 0,8 s. El Magnemite de pruebas no se mueve en dos días.*\n*Prueba 14: 2,1 s. Mismo efecto, más fuerte. Los patrocinadores aplauden.*\n\nY subrayado dos veces:\n\n*El arco no genera la energía. La TOMA. ¿De dónde?*\n\nEn la esquina de abajo, muy pequeño, como quien escribe para sí: *No firmar hasta saberlo.*" },
		registroondas: { name: 'Registro de la señal', pocket: 'key', desc: 'Unas hojas impresas con columnas de números y una firma con una sola letra.', read: "**PRUEBA DE CAMPO · FASE DE EXCITACIÓN · EMISOR CAOBA-1**\nEncargo y financiación: *Fundación Raíces de Johto*. Objetivo: medir la respuesta de la fauna a la frecuencia de arranque del nodo.\n\nDía 1 · 03:00 · Pulso de 3 ciclos. Lago: sin respuesta apreciable.\nDía 4 · 03:00 · Pulso de 3 ciclos ×2. Sujetos 1–3 (Magikarp): evolución espontánea en 41 s. Agresividad: alta.\nDía 9 · Sujeto 9, tras la excitación: actividad mínima. Sujeto 10, ídem. *Nota: el gasto es de una sola vez. No se recupera.*\nDía 12 · Un ejemplar de coloración anómala (rojo) responde antes que el resto. Interesante. Conservar.\nDía 19 · Sincronización diaria con el tendido del este: correcta.\n\n*Observación final:* la respuesta es proporcional a lo que el sujeto tenía guardado. Para el arranque definitivo hará falta una fuente mayor y más estable.\n\nSi algo sale mal: pinza en el cable azul. No en el rojo.\n— **M.**" },
		pinzaonda: { name: 'Pinza de ondas', pocket: 'key', desc: 'Un aparatito con forma de pinza de la ropa que corta en seco una frecuencia concreta. Lleva una pegatina: «NO TOCAR (en serio)».' },
		mt_puno_drenaje: { name: 'MT Puño Drenaje', pocket: 'machines', tm: 'drainpunch', desc: 'Un puñetazo que absorbe energía. El usuario recupera PS.' },
		mt_garra_umbria: { name: 'MT Garra Umbría', pocket: 'machines', tm: 'shadowclaw', desc: 'Garras hechas de sombra. Alta probabilidad de golpe crítico.' },
		mt_cola_ferrea: { name: 'MT Cola Férrea', pocket: 'machines', tm: 'irontail', desc: 'Golpe con una cola dura como el acero. Puede bajar la Defensa del objetivo.' },
	},
	shops: {
		tienda_olivo: { name: 'Tienda de Olivo', items: ['pokeball', 'greatball', 'ultraball', 'diveball', 'netball', 'hyperpotion', 'maxpotion', 'revive', 'fullheal', 'maxrepel', { id: 'mt_cola_ferrea', price: 10000 }, { id: 'linkingcord', cond: 'flag.regalo_cordon' }] },
		tienda_caoba: { name: 'Tienda de Caoba', items: ['ultraball', 'hyperpotion', 'maxpotion', 'revive', 'fullheal', 'ragecandybar', 'maxrepel', 'razorclaw', { id: 'mt_garra_umbria', price: 10000 }, { id: 'linkingcord', cond: 'flag.regalo_cordon' }] },
	},
	challenges: {
		gym_trigal_b3: {
			name: 'Gimnasio de Ciudad Trigal', npc: 'corelia', trainer: 'corelia_g6', type: 'Fighting', rec: 45,
			cond: 'flag.b03_ruinas_hecho',
			info: [
				{ text: 'Líder de intercambio: **Corelia** (Kalos), tipo **Lucha**.' },
				{ cond: 'visited("gym_trigal")', text: '5 Pokémon, niveles 40 a 44. Ya sabe megaevolucionar contra ti.' },
				{ cond: 'visited("gym_trigal")', text: 'Los tipos **Volador**, **Psíquico** y **Hada** le hacen mucho daño.' },
				{ cond: 'beat("corelia_g6")', text: '✔ Medalla Planicie conseguida.' },
			],
		},
		gym_olivo: {
			name: 'Gimnasio de Ciudad Olivo', npc: 'yasmina', trainer: 'yasmina_g7', type: 'Steel', rec: 47,
			cond: 'visited("olivo")',
			info: [
				{ text: 'Líder: **Yasmina**, tipo **Acero**. Dicen que no sale del Faro.' },
				{ cond: 'visited("gym_olivo")', text: '5 Pokémon, niveles 41 a 45.' },
				{ cond: 'visited("gym_olivo")', text: '**Fuego**, **Lucha** y **Tierra** le van muy bien. Su as es enorme y duro.' },
				{ cond: 'beat("yasmina_g7")', text: '✔ Medalla Mineral conseguida.' },
			],
		},
	},
	// Enganche del inicio: el jugador termina el B2 en Ciudad Iris
	patches: {
		iris: {
			spots: [
				{ label: '📨 Un mensaje de la Dra. Solberg', sub: 'Tu Pokédex no para de vibrar', icon: '📨', cond: 'flag.b02_fin && !quest.b03_m1 && !done.b03_m1', new: 'flag.b02_fin && !quest.b03_m1 && !done.b03_m1', script: 'b03_inicio' },
			],
			onEnter: [{ script: 'b03_inicio', cond: 'flag.b02_fin && !quest.b03_m1 && !done.b03_m1', once: true }],
		},
	},
	milestones: [{ flag: 'b03_m_aviso', hoursLeft: 3 }],
};
