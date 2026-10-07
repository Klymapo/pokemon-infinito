// Publicación 6 · «Fiado no» (hilo b02_t_lola), 3.ª aparición: Pueblo Lavanda.
// Lola va cada año a Lavanda a poner flores en la lápida sin nombre del cementerio pequeño (la de la flor seca que
// {riolu} vio en b04_cementerio). La vieja Torre Pokémon ya no existe: ahora es una Torre Radio. El Señor Fuji pasa a
// encender las velas y la reconoce sin decir de qué: «¿Otra vez este año?» / «Todos los años».
// Escena seria (biblia §0): el humor de Lola vuelve solo al final y fuera del cementerio. No confiesa nada.
// Requiere flag.lola_2 (Caoba) y haber llegado a Lavanda. Activa flag.lola_3 y la etapa «espera».

const LUC = '(inParty("riolu") || inParty("lucario"))';

export default {
	items: {
		lola_postal: { name: 'Postal vieja de Lavanda', pocket: 'key', cost: 0,
			desc: 'Una postal con las esquinas blandas. Por delante, la vieja Torre Pokémon de Lavanda, con sus siete pisos, en colores de hace muchos años. Por detrás, letra apretada. Nunca tuvo sello.',
			read: '*Ma:*\n\n*Lavanda es bonita, huele a flores todo el día. Ya tengo trabajo. Es de uniforme, imagínese. No le puedo contar más, pero el mes que entra le mando dinero, ahora sí.*\n\n*No se preocupe por mí. Aquí nos cuidamos entre todos. Somos como una*\n\n*(la frase se queda a medias; alguien tachó la última palabra hasta romper el cartón)*\n\n*Le mando un beso.*\n\n— L.' },
		lola_mt_triturar: { name: 'MT Triturar', pocket: 'machines', tm: 'crunch', desc: 'Muerde con unos colmillos afilados. Puede bajar la Defensa del objetivo. Regalo de Lola: «la de Tacho, que ya no muerde a nadie».' },
	},

	extraSpots: {
		lavanda: [
			{ label: 'Una mujer en el cementerio pequeño', sub: 'Cambia unas flores secas por otras nuevas. Un Raticate canoso la espera sentado', icon: '💐',
				cond: 'flag.lola_2 && flag.b04_lavanda_llegada && !flag.lola_3', new: 'true',
				talk: [{ script: 'lola_lavanda' }] },
			{ label: 'Lola y su carrito', sub: 'Junto al Centro Pokémon. Hoy la vaporera está apagada', icon: '🥟',
				cond: 'flag.lola_3',
				talk: [{ script: 'lola_lavanda_despues' }] },
		],
	},

	scripts: {
		lola_lavanda: [
			{ text: 'Al fondo del cementerio pequeño, entre las lápidas diminutas de piedra blanca, hay una mujer de rodillas. Moño apretado, mechón gris, chamarra negra. Sin mandil.' },
			{ text: 'Está delante de la lápida sin nombre. Quita una flor seca, muy despacio, como si pudiera hacerle daño, y pone en su sitio un ramito de flores blancas, pequeñas, atadas con cordel de panadería.' },
			{ if: 'flag.b04_cementerio', then: [
				{ text: 'Donde estaba la flor seca había otra, de lavanda, marchita ya: la que dejó {riolu} la otra vez. Lola la mira mucho rato. No la quita.' },
			] },
			{ text: 'Tacho está sentado a su lado, muy derecho, sin moverse. No duerme. Es la primera vez que lo ves despierto tanto rato sin temblar.' },
			{ text: 'Lola te oye llegar. No se gira.' },
			{ say: 'lola', text: 'Tú. —Seco—. ¿Me sigues o qué?' },
			{ choice: [
				{ text: '«Me dijiste que saludara.»', then: [
					{ say: 'lola', text: '…Te dije, sí. —Se limpia las manos en el pantalón—. Pues ya saludaste.' },
				] },
				{ text: 'Quedarte en silencio a su lado.', then: [
					{ text: 'Te quedas de pie a su lado, sin decir nada. Lola tampoco dice nada. Al rato, sin mirarte, se hace a un lado para dejarte sitio en la tierra.' },
				] },
			] },
			{ if: LUC, then: [
				{ text: '{riolu} se acerca a la lápida y se sienta junto a Tacho. Los dos miran la piedra. El aura de {riolu} se enciende muy bajito, azul, quieta, como una vela que nadie ha encendido.' },
				{ say: 'lola', text: '—Muy bajito—. Ese ya vino antes, ¿verdad? Se le nota. Los que vienen a sitios así se sientan de otra manera.' },
			] },
			{ choice: [
				{ text: '«¿Quién era?»', then: [
					{ say: 'lola', text: 'Alguien que no tenía que estar aquí tan pronto. —Recoloca una flor que no hacía falta recolocar—. Eso es todo lo que sé decir. Lo demás no sé cómo se dice.' },
				] },
				{ text: '«¿Vienes todos los años?»', then: [
					{ say: 'lola', text: 'Todos. Desde antes de que hubiera antena. —Señala la Torre Radio con la barbilla, sin mirarla—. Antes aquí había otra torre. De piedra, vieja, con velas en cada escalón. Una subía y ya no se oía la calle.' },
					{ say: 'lola', text: 'Y ahora, encima, es una torre de radio. —Se ríe sin ganas, por la nariz—. Hasta aquí me persiguen.' },
				] },
			] },
			{ text: 'Por el camino del cementerio viene un anciano muy delgado, de bigote blanco y chaqueta de punto morada, con una caja de velas bajo el brazo. Camina despacio. Enciende una vela en cada lápida, sin saltarse ninguna.' },
			{ text: 'Cuando llega a la lápida sin nombre, se detiene. Mira a Lola. Ella se levanta, se sacude las rodillas y se queda muy derecha, como Tacho.' },
			{ say: 'fuji', text: '¿Otra vez este año?' },
			{ say: 'lola', text: 'Todos los años.' },
			{ text: 'El Señor Fuji asiente. Saca una vela, la enciende con mucho cuidado y la pone junto a las flores blancas. Se queda un momento con la mano en la piedra.' },
			{ say: 'lola', text: '—Con la voz más pequeña que le has oído nunca—. ¿Y el del hueso, Señor Fuji? ¿Sigue…?' },
			{ say: 'fuji', text: 'Ya es Marowak. Hace mucho. Vive detrás de los campos de lavanda, con los suyos. Los domingos viene a tomar té, aunque el té no le gusta. —Pausa—. Está bien, hija. Está muy bien.' },
			{ say: 'lola', text: 'Bueno. —Se le quiebra algo y lo vuelve a juntar enseguida—. Bueno.' },
			{ say: 'fuji', text: 'No tienes que venir todos los años.' },
			{ say: 'lola', text: 'Sí tengo.' },
			{ text: 'El Señor Fuji no discute. Te mira un momento a ti, con la misma cara tranquila de siempre, y sigue su camino de lápida en lápida, encendiendo velas.' },
			{ if: 'flag.b04_fuji_1', then: [
				{ say: 'fuji', text: '—Al pasar a tu lado, muy bajito—. El té sigue caliente en casa, cuando quieras. Para los dos.' },
			] },
			{ text: 'Lola se queda un rato más de pie. Luego silba bajito, y Tacho se levanta despacio, con las patas tiesas de viejo, y la sigue hacia la salida.' },

			// --- Fuera del cementerio ---
			{ text: 'En la puerta del cementerio, junto al buzón de madera de «Para los que no pudieron despedirse», Lola se para. Mira la ranura. No mete nada.' },
			// Si en Caoba la viste antes de la guarida, aquí reacciona a lo que pasó (lo leyó en el periódico).
			{ if: '!flag.lola_caoba_despues && flag.b03_rocket_policia', then: [
				{ say: 'lola', text: 'Salió en el periódico lo de Caoba. Lo de debajo de la tienda de recuerdos. Que se llevaron a catorce chamacos, y al del traje blanco con las manos atrás. —Pausa—. Les darán de comer, ¿no? En la cárcel dan de comer. Mal, pero dan.' },
			] },
			{ if: '!flag.lola_caoba_despues && flag.b03_rocket_libres', then: [
				{ say: 'lola', text: 'Me escribió un chamaco de Caoba, uno de orejas de soplillo que me compraba bollos. Que lo soltaron. Que ahora vende arroz con leche en la Ruta 37, con su mamá. —Casi sonríe—. Que se le pega. Pues que aprenda. A mí también se me pegaba todo al principio.' },
			] },
			{ if: '!flag.lola_caoba_despues && flag.b03_rocket_quemar', then: [
				{ say: 'lola', text: 'Salió en el periódico lo de Caoba. Que el del traje blanco se escapó por una puerta de atrás antes de que llegara nadie. —Se le escapa media sonrisa; se le borra—. Ese siempre supo por dónde irse. —Pausa—. Eso dicen. Que tiene cara.' },
			] },
			{ if: 'flag.b04_presidente_habla', then: [
				{ say: 'lola', text: '¿Viste el periódico? Lo de Silph. Que había gente de seguridad con parches grises en la manga. —Resopla—. Parches grises. Como si un parche tapara algo. Lo que se tapa con un parche se sigue viendo por debajo. Pregúntale a cualquier chamarra vieja.' },
			] },
			{ if: 'flag.b04_atenea_vencida', then: [
				{ say: 'lola', text: 'Y que la jefa de esos era una pelirroja con un Arbok. —Se queda callada—. Esa de joven ya daba miedo. —Pausa—. En las fotos, digo. Salía en todas.' },
			] },
			{ say: 'lola', text: 'Toma. —Saca del bolsillo de la chamarra una postal vieja, con las esquinas blandas—. Me la encontré el otro día en el forro. Nunca la mandé. Se me pasó el momento.' },
			{ say: 'lola', text: 'Hay cosas que, si no las mandas a tiempo, ya no sirven pa\' nada. Más que pa\' guardarlas. Guárdala tú. Yo ya me la sé de memoria.' },
			{ give: 'lola_postal' },
			{ say: 'lola', text: 'Y esto. —Un disco gris, con un mordisco pintado a mano en la funda—. Era de Tacho. Ya no muerde a nadie, ¿verdad, viejito? Que lo use alguien que todavía tenga dientes.' },
			{ give: 'lola_mt_triturar' },
			{ text: 'Tacho, al oír su nombre, mueve la cola una vez. Una sola. Parece de acuerdo.' },
			{ say: 'lola', text: 'Ya. Ya está. —Se pone otra vez la cara de vender bollos—. Mañana enciendo la vaporera. Aquí la gente compra poco, pero compra bonito: te dan las gracias con la boca llena.' },
			{ say: 'lola', text: 'Y un día de estos, si te portas, te doy la receta de verdad. La que no está en la servilleta ni en la hoja. —Te mira, por fin, de frente—. Un día de estos. No hoy.' },
			{ set: { 'flag.lola_3': true } },
			{ quest: 'b02_t_lola', stage: 'espera' },
			{ intel: { npc: 'lola', text: 'Cada año, «desde antes de que hubiera antena», pone flores en la lápida sin nombre del cementerio pequeño de Lavanda, donde estaba la vieja Torre Pokémon. El Señor Fuji la reconoce: «¿Otra vez este año?» / «Todos los años». Le preguntó por «el del hueso». Te dio una postal que nunca envió («Es de uniforme, imagínese») y la MT Triturar de Tacho.' } },
			{ diary: 'Hoy, en Pueblo Lavanda, volvimos a ver a Lola, la de los bollos. Estaba en el cementerio pequeño poniendo flores blancas en una piedra sin nombre. No sé de quién es esa piedra. Lola no lo dijo.\n\nEl Señor Fuji pasó encendiendo velas y se saludaron. Los humanos tienen muchas formas de decir hola. Esa no me la sé.\n\nLola nos regaló una postal muy vieja y una MT de Tacho. Tacho movió la cola. Una vez. Creo que es su forma de decir hola.', cond: 'flag.b01_diario' },
		],
		lola_lavanda_despues: [
			{ if: 'night', then: [
				{ text: 'La vaporera está apagada y tapada con una manta. Lola está sentada en un banco junto al carrito, mirando las velas del cementerio, al final de la calle. Tacho duerme con la cabeza en su zapato.' },
				{ say: 'lola', text: 'De noche no vendo. De noche miro. —No se gira—. Siéntate si quieres. Sin hablar, eso sí.' },
			], else: [
				{ text: 'La vaporera echa humo otra vez. Una vecina mayor se lleva tres bollos y paga con monedas contadas de una en una. Lola no le cobra el tercero.' },
				{ say: 'lola', text: '¿Y tú qué? ¿Otra vez con hambre? —Te pasa medio bollo partido con la mano—. Este no cuenta. Fiado no, pero esto no es fiado: es regalado. Es distinto.' },
			] },
			{ text: 'Tacho duerme. Esta vez no tiembla.' },
		],
	},
};
