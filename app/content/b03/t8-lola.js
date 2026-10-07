// Publicación 6 · «Fiado no» (hilo b02_t_lola), 2.ª aparición: Pueblo Caoba.
// Lola llega a Caoba con su carrito, junto al Centro Pokémon. Sale para quien está en Caoba durante el B3 (antes de la
// guarida) y para quien vuelve después (done.b03_m6): el guion tiene dos versiones.
//  · Antes de la guarida: Tacho no duerme y tiembla «tres veces y para» (la señal del lago); Lola dice que la tienda de
//    recuerdos «tiene más sótano que tienda», con escalera detrás del mostrador.
//  · Después: reacciona a la decisión sobre los Rocket con lo que «dice el pueblo» (policía / libres / quemar) y se le
//    escapa algo; sabe que Lance pudo bajar «por la escalera de detrás del mostrador».
// En las dos: la «R» raspada en el forro de la chamarra y la pista del dinero nuevo (gorras nuevas, billetes nuevos)
// sin nombrar a Lemnis. Si la aparición fue antes de la decisión, la reacción a la decisión llega en Lavanda (b04).
// Requiere flag.lola_1 (aparición 1 en Trigal). Activa flag.lola_2 (y lola_caoba_despues si ya había decisión).

const LUC = '(inParty("riolu") || inParty("lucario"))';
const POLICIA = 'flag.b03_rocket_policia';
const LIBRES = 'flag.b03_rocket_libres';
const QUEMAR = 'flag.b03_rocket_quemar';

export default {
	items: {
		lola_servilleta: { name: 'Servilleta de Lola', pocket: 'key', cost: 0,
			desc: 'Una servilleta de papel doblada en cuatro, con una mancha de chile en una esquina y la letra apretada de Lola.',
			read: '*DÓNDE SE COME BIEN EN KANTO (según Lola)*\n\n*· Azafrán: el puesto de fideos de detrás de la estación. Pide «los de la casa». No preguntes qué lleva la casa.*\n\n*· Celeste: nada que valga la pena. Llévate tus bollos.*\n\n*· Ruta 8: hay un paso subterráneo que sale a Azafrán sin dar la vuelta. Si sigue abierto. Antes lo estaba.*\n\n*· Lavanda: ahí no se va a comer. Por estas fechas, ahí estoy yo.*\n\n*Si te pierdes, pregunta por los bollos. Todo el mundo sabe dónde están los bollos.*\n\n— L.' },
	},

	extraSpots: {
		caoba: [
			{ label: 'El carrito de los bollos', sub: 'Una vaporera humea junto al Centro Pokémon. Debajo, un Raticate canoso', icon: '🥟',
				cond: 'flag.lola_1 && !flag.lola_2',
				new: 'true',
				talk: [{ script: 'lola_caoba' }] },
		],
	},

	scripts: {
		lola_caoba: [
			{ text: 'Junto a la puerta del Centro Pokémon, un carrito de madera con ruedas de bicicleta y una vaporera de bambú que echa humo como una chimenea más del pueblo. El letrero sigue igual: «BOLLOS DE LOLA · Al vapor · Fiado no».' },
			{ say: 'lola', text: '¡Mira nomás! —Te señala con las pinzas—. {El|La|Le} de los bollos de la Torre Radio. Te dije que me venía pa\'l lago. Aquí el frío es de verdad y los turistas tienen hambre de verdad. Negocio redondo.' },

			{ if: 'done.b03_m6', then: [
				// ===== Después de la guarida =====
				{ set: { 'flag.lola_caoba_despues': true } },
				{ text: 'Debajo del carrito, sobre el mismo costal de harina, Tacho ronca. Ronca fuerte, con la panza al aire y las cuatro patas encogidas.' },
				{ say: 'lola', text: 'Míralo. La primera noche aquí no pegó ojo: se la pasó con las orejas pegadas, temblando, mirando pa\'l norte. Y desde que se calmó lo del lago, duerme como piedra. —Lo tapa con un trapo—. No sé qué tiene este pueblo. Este pueblo y mi rata.' },
				{ say: 'rotom', text: '¡Bzzt! La máquina de la guarida zumbaba tres veces y pausa. Tres veces y pausa. —Pausa—. Seguro que es casualidad. Las ratas oyen muchas cosas.' },
				{ say: 'lola', text: 'Ya me contaron todo, ¿eh? En este pueblo las noticias corren más que los Rapidash. Lo de la tienda de recuerdos. Lo de abajo.' },
				{ if: POLICIA, then: [
					{ say: 'lola', text: 'Los sacaron a todos por la calle mayor, en fila, sin esposas. Catorce chamacos. Y el del traje blanco al final, con las manos atrás, sin que se le moviera un pelo.' },
					{ say: 'lola', text: 'Les di bollos por la ventanilla de la patrulla. A todos. Al del traje también. No me dio las gracias. —Pausa—. Nunca las da.' },
					{ text: 'Lola se queda callada un segundo de más.' },
					{ say: 'lola', text: 'Tiene cara de no darlas, digo. Hay caras así.' },
				] },
				{ if: LIBRES, then: [
					{ say: 'lola', text: 'Anoche vinieron cuatro chamacos con cara de no haber comido en una semana. Sin gorra. Se les notaba dónde había estado la gorra, en el pelo aplastado, pero sin gorra.' },
					{ say: 'lola', text: 'Les di de comer. Uno con orejas de soplillo se iba a la Ruta 37, con su mamá. Le di seis pa\'l camino. —Se encoge de hombros—. Esos chamacos de la fam… de esa pandilla, no tienen la culpa de todo. De algo sí. De todo no.' },
				] },
				{ if: QUEMAR, then: [
					{ say: 'lola', text: 'Dicen que el del traje blanco se escapó. Que salió por una puerta de atrás antes de que llegara nadie, y que abajo olía a humo y a limón.' },
					{ text: 'A Lola se le escapa media sonrisa. Se le borra enseguida.' },
					{ say: 'lola', text: 'Ese siempre supo por dónde irse. —Pausa—. Eso dicen. Que tiene cara de saber irse.' },
				] },
				{ say: 'lola', text: '¿Y es cierto que el de la capa tiró la puerta de abajo de un Hiperrayo? —Chasquea la lengua—. Qué desperdicio de Hiperrayo. Con bajar por la escalera de detrás del mostrador llegaba hasta la máquina sin despeinarse.' },
				{ choice: [
					{ text: '«¿Qué escalera?»', then: [
						{ say: 'lola', text: 'La de… ¿no hay una? —Se pone a acomodar bollos que no necesitan acomodo—. Todas las tiendas viejas de Caoba tienen escalera al sótano. Por los inviernos. Pa\' guardar papas.' },
					] },
					{ text: '«¿Cómo sabes que abajo había una máquina?»', then: [
						{ say: 'lola', text: 'Lo dice todo el pueblo. —Demasiado rápido—. Una máquina, una antena, el lago revuelto. Hasta el pescador del cubo lo sabe, y ese no sabe ni qué día es.' },
					] },
				] },
				{ say: 'rotom', text: '¡Bzzt! En mi plano de la guarida no sale ninguna escalera detrás del mostrador. Claro que en mi plano tampoco salía la guarida.' },
			], else: [
				// ===== Antes de la guarida =====
				{ text: 'Debajo del carrito, sobre el mismo costal de harina, Tacho está despierto. Tiene las orejas pegadas al cráneo y mira hacia el norte, hacia el lago, sin parpadear.' },
				{ text: 'De pronto se encoge. Una vez, dos, tres. Para. Al rato, otra vez: una, dos, tres. Y para.' },
				{ say: 'lola', text: 'Así lleva desde que llegamos. No pega ojo. Tiembla y mira pa\'l norte. —Le echa un trapo encima, con cuidado—. No sé qué tiene este pueblo. Este pueblo y mi rata.' },
				{ say: 'rotom', text: '¡Bzzt! Tres y pausa. Tres y pausa. —Pausa—. Las ratas oyen muchas cosas que los Rotom no oímos. Eso dice mi base de datos. Y no me gusta.' },
				{ text: 'Lola mira hacia la calle mayor, hacia el letrero de la tienda de recuerdos, que parpadea aunque es de día.' },
				{ say: 'lola', text: 'Esa tienda tiene más sótano que tienda. Como todas las viejas de aquí: escalera detrás del mostrador, pa\' guardar papas en invierno. —Pausa—. Digo yo. Eso dicen.' },
				{ choice: [
					{ text: '«¿Tú cómo lo sabes?»', then: [
						{ say: 'lola', text: 'Lo sabe todo el pueblo. —Demasiado rápido—. Hasta el pescador del cubo lo sabe, y ese no sabe ni qué día es.' },
					] },
					{ text: '«¿Qué hay en ese sótano?»', then: [
						{ say: 'lola', text: 'Papas. —Te sostiene la mirada—. Y Caramelos Furia, que ya no saben como antes. Lo demás no es asunto de una que vende bollos.' },
					] },
				] },
				{ say: 'rotom', text: '¡Bzzt! En el plano del pueblo no sale ningún sótano. Claro que los planos de los pueblos nunca enseñan los sótanos. Por eso son sótanos.' },
			] },

			// --- La chamarra (las dos versiones) ---
			{ text: 'Empieza a caer aguanieve. Lola, sin pensarlo, se quita la chamarra negra y se la echa encima a Tacho.' },
			{ text: 'La chamarra cae del revés sobre el costal. Por dentro, el forro tiene, a la altura del pecho, un rectángulo de tela más oscura donde alguien descosió algo hace mucho tiempo. Y luego, por si acaso, lo raspó con una navaja hasta dejarlo en hilos.' },
			{ text: 'Todavía se adivinan los agujeritos de las puntadas. Una curva arriba. Una pata que baja en diagonal. Podría ser una R. Podría ser cualquier cosa.' },
			{ say: 'lola', text: '¿Qué tanto le ves? —Le da la vuelta a la chamarra de un tirón—. Es una chamarra. Vieja. Como yo. Como Tacho. Aquí todo es viejo menos los bollos.' },

			// --- La pista del dinero nuevo (sin nombrar a quién) ---
			{ if: 'done.b03_m6', then: [
				{ say: 'lola', text: 'Lo que no me cuadra… —baja la voz y se acerca, con las pinzas todavía en la mano— …son las gorras. Vi las que dejaron tiradas detrás de la tienda. Nuevecitas. Tela buena, costura doble. Las de antes eran de tela de mantel; se descosían si las mirabas feo.' },
			], else: [
				{ say: 'lola', text: 'Lo que no me cuadra… —baja la voz y se acerca, con las pinzas todavía en la mano— …son los chamacos de gorra que bajan de la Ruta 43 a comprarme. Gorras nuevecitas. Tela buena, costura doble. Las de antes eran de tela de mantel; se descosían si las mirabas feo.' },
			] },
			{ choice: [
				{ text: '«¿Las de antes?»', then: [
					{ say: 'lola', text: 'Las de las fotos. Salían en todos los periódicos, hace años. Una se fija. —Sigue, más deprisa—. El caso es que esas son nuevas.' },
				] },
				{ text: 'Dejarla seguir.', then: [
					{ text: 'No dices nada. Lola mira hacia la tienda de recuerdos con los ojos entrecerrados, como quien hace cuentas.' },
				] },
			] },
			{ say: 'lola', text: 'Y me pagaban los bollos con billetes nuevos. De esos que todavía se pegan unos con otros, que huelen a banco. —Niega con la cabeza—. Alguien con mucha lana les estaba pagando. Y no era ninguno de los de aquí: los de aquí cuentan las monedas.' },
			{ say: 'rotom', text: '¡Bzzt! Gorras nuevas. Billetes nuevos. Lo apunto en «cosas que no cuadran». La lista ya es larga.' },

			// --- Regalos y siguiente parada ---
			{ say: 'lola', text: 'Bueno, ya. Que se me enfría el aire. —Te mete dos bollos en la mochila—. Pa\'l lago. O pa\' donde vayas.' },
			{ give: 'lola_bollo', n: 2 },
			{ say: 'lola', text: 'Luego te vas pa\' Kanto con la Gira, ¿no? Todo el mundo se va pa\' Kanto. —Agarra una servilleta, saca un lápiz de detrás de la oreja y escribe deprisa, apretando—. Toma. Dónde se come bien allá. Y dónde no.' },
			{ give: 'lola_servilleta' },
			{ say: 'lola', text: 'Yo, por estas fechas, me voy a Lavanda. Todos los años. —No te mira—. No a vender. A otra cosa. Si pasas por ahí, saluda. Si no, no pasa nada. Fiado no, pero saludar es gratis.' },
			{ if: LUC, then: [
				{ text: 'Tacho saca la cabeza de debajo de la chamarra, olfatea a {riolu} y vuelve a esconderla. {riolu} se queda mirando la chamarra un rato largo. Luego te mira a ti.' },
			] },
			{ set: { 'flag.lola_2': true } },
			{ quest: 'b02_t_lola', stage: 'lavanda' },
			{ intel: { npc: 'lola', text: 'En Pueblo Caoba, con su carrito. Sabe de una escalera detrás del mostrador de la tienda de recuerdos («pa\' guardar papas»). Le llamó la atención que los chamacos de gorra trajeran gorras nuevas y billetes nuevos: «alguien con mucha lana les estaba pagando». Tacho no dormía mientras sonaba la señal del lago. Cada año, por estas fechas, va a Pueblo Lavanda.' } },
		],
	},
};
