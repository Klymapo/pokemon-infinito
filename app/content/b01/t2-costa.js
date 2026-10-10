// Bloque 1 · Tramo 2: Ruta 5 → Pueblo Vánitas (Castillo Caduco) → Ruta 6 y Palacio Cénit (opcionales)
// → Ruta 7 → Gruta Tierraunida → Ruta 8 → Pueblo Petroglifo.

// Condiciones reutilizadas (cadenas planas).
const FANTASMA_SINIESTRO = 'inParty("gastly") || inParty("haunter") || inParty("gengar") || inParty("pumpkaboo") || inParty("gourgeist") || inParty("phantump") || inParty("trevenant") || inParty("litwick") || inParty("lampent") || inParty("chandelure") || inParty("honedge") || inParty("doublade") || inParty("aegislash") || inParty("sableye") || inParty("houndour") || inParty("houndoom") || inParty("pangoro") || inParty("scraggy") || inParty("scrafty") || inParty("inkay") || inParty("malamar") || inParty("purrloin") || inParty("liepard") || inParty("stunky") || inParty("skuntank") || inParty("zorua") || inParty("zoroark") || inParty("nickit") || inParty("thievul") || inParty("murkrow") || inParty("honchkrow") || inParty("misdreavus") || inParty("mismagius") || inParty("drifloon") || inParty("drifblim") || inParty("shuppet") || inParty("banette") || inParty("duskull") || inParty("dusclops") || inParty("absol") || inParty("poochyena") || inParty("mightyena") || inParty("umbreon") || inParty("sneasel") || inParty("spiritomb") || inParty("yamask") || inParty("greavard") || inParty("maschiff") || inParty("impidimp") || inParty("sinistea")';
const LUZ = 'has("farollana") || has("linternapi")';
const MAREEP_LISTO = 'quest.b01_t_mareep == "buscar" && (vars.mareep >= 6 || (vars.mareep >= 5 && !flag.b01_mareep_jaula))';
const GASPAR_TODO = 'has("honey") && has("tinymushroom") && has("pechaberry")';

export default {
	locations: {
		// =================== RUTA 5 ===================
		ruta5: {
			name: 'Ruta 5 · Vía Repecho', short: 'Ruta 5', region: 'kalos', kind: 'route', map: { x: 43, y: 70 },
			bg: { type: 'route', flowers: '#b07ad0' },
			desc: 'Una cuesta larga que baja de Luminalia hacia el oeste, entre flores moradas y **rampas de patinaje**. Las vallas de Lemnis están apiladas en la cuneta, recién retiradas.\n\nUn cartel nuevo, azul y plata: «**Programa de Retorno Lemnis** · Zona de recogida de Pokémon extraviados».',
			links: ['luminalia', 'vanitas'],
			enterCond: 'flag.b01_ruta5_abierta',
			blockedMsg: 'Dos guardias de Lemnis cierran el paso hacia la Ruta 5: «Zona de investigación. Vuelva cuando se lo indiquen. Y sonría, que esto es Luminalia».',
			rumors: [
				{ text: 'Los patinadores de la Vía Repecho dicen que un Pancham les roba las gorras. Y ahora también las cartas.' },
				{ cond: 'flag.b01_bastien_ruta5', text: 'Por la noche, el campamento de Lemnis se queda con un solo guardia. Y ronca.' },
				{ cond: 'quest.b01_t_mareep == "buscar"', text: 'Los Mareep asustados se esconden donde haya hierba alta… o donde se oiga a alguien divertirse.' },
			],
			route: {
				from: 'luminalia', to: 'vanitas', length: 9, terrain: 'grass', rate: 0.2,
				tramos: {
					1: [
						{ text: 'Las vallas de Lemnis siguen apiladas junto al camino. Alguien ha pintado encima, con espray: «¿Y A DÓNDE?».' },
						{ item: 'ether', hidden: true },
					],
					2: [
						{ terrain: 'path' },
						{ text: 'Una pista de patinaje de cemento, con rampas y barandillas. Huele a goma quemada y a crêpes.' },
						{ trainer: 'r5_patinadora_odile' },
						{ item: 'superpotion' },
						{ script: 'b01_r5_baraja_hallada', cond: 'has("barajasuerte") && quest.b01_s_philippe != "volver" && !done.b01_s_philippe' },
					],
					3: [
						{ script: 'b01_r5_pancham', cond: 'quest.b01_s_philippe == "buscar" && !has("barajasuerte")', mark: true },
						{ text: 'Hierba alta y flores moradas. Entre los tallos, algo brilla como el canto de una carta.' },
						{ item: 'barajasuerte', hidden: true },
						{ script: 'b01_r5_baraja_hallada', cond: 'has("barajasuerte") && quest.b01_s_philippe != "volver" && !done.b01_s_philippe' },
					],
					4: [
						{ trainer: 'r5_patinador_lucas', optional: true, label: 'Hace equilibrio sobre una barandilla. Te mira de reojo.' },
						{ text: 'Mechones blancos enganchados en las ramas de un arbusto. ¿Algodón? No: huele a ozono.' },
						{ item: 'lanamareep1', hidden: true },
						{ talk: [{ script: 'b01_mareep_copito' }], label: 'Seguir el rastro de lana', sub: 'Los mechones llevan hacia un arbusto', icon: '🐑', cond: 'has("lanamareep1")', new: 'true' },
						{ script: 'b01_r5_baraja_hallada', cond: 'has("barajasuerte") && quest.b01_s_philippe != "volver" && !done.b01_s_philippe' },
					],
					5: [
						{ script: 'b01_r5_lemnis', mark: true },
						{ talk: [
							{ cond: 'night && flag.b01_mareep_lemnis && !flag.b01_mareep_jaula', script: 'b01_r5_rescate_noche' },
							{ cond: 'flag.b01_mareep_lemnis && !flag.b01_mareep_jaula', script: 'b01_r5_campamento_dia' },
							{ script: 'b01_r5_campamento' },
						], label: 'Campamento de Lemnis', sub: 'Camiones, jaulas y un toldo azul', icon: '♾️', cond: 'flag.b01_bastien_ruta5', new: 'night && flag.b01_mareep_lemnis && !flag.b01_mareep_jaula' },
					],
					6: [
						{ text: 'Un huerto con la cerca rota. Un Wooloo pasta dentro como si fuera suyo. Lo es: lleva un pañuelo con el nombre «Bizcocho».' },
						{ trainer: 'r5_criadora_margaux' },
					],
					7: [
						{ script: 'b01_aurelio_1', mark: true },
						{ talk: [
							{ cond: 'quest.b01_t_mareep == "volver"', script: 'b01_aurelio_farol' },
							{ cond: 'done.b01_t_mareep', script: 'b01_aurelio_despues' },
							{ cond: 'quest.b01_t_mareep == "buscar"', script: 'b01_aurelio_recordar' },
							{ script: 'b01_aurelio_1' },
						], label: 'Don Aurelio', sub: 'Un ranchero sentado bajo un árbol', icon: '🤠', new: 'quest.b01_t_mareep == "volver"' },
						{ text: 'Un árbol solitario con un corral improvisado de cuerda a su sombra. Dentro no hay nada. Todavía.' },
					],
					8: [
						{ terrain: 'path' },
						{ text: 'La rampa más alta de la Vía Repecho. Abajo, la gente aplaude cada vez que alguien no se rompe nada.' },
						{ trainer: 'r5_patinador_remi' },
						{ item: 'lanamareep2', hidden: true },
						{ talk: [{ script: 'b01_mareep_borla' }], label: 'Seguir el rastro de lana', sub: 'Hay un mechón en la barandilla de la rampa', icon: '🐑', cond: 'has("lanamareep2")', new: 'true' },
					],
					9: [{ text: 'La cuesta se allana. Al fondo, entre una niebla baja que no se va ni a mediodía, asoman los tejados de pizarra de **Pueblo Vánitas** y las torres de un castillo.' }],
				},
				encounters: {
					grass: [
						{ sp: 'bunnelby', lv: [9, 11], w: 30 },
						{ sp: 'furfrou', lv: [9, 11], w: 20 },
						{ sp: 'pancham', lv: [10, 12], w: 15 },
						{ sp: 'skiddo', lv: [10, 12], w: 15 },
						{ sp: 'scraggy', lv: [10, 12], w: 8 },
						{ sp: 'abra', lv: [10, 11], w: 8, time: 'night' },
						{ sp: 'plusle', lv: [10, 11], w: 4, time: 'day' },
						{ sp: 'minun', lv: [10, 11], w: 4, time: 'day' },
						{ sp: 'mareep', lv: [10, 12], w: 8, displaced: true, cond: 'quest.b01_t_mareep == "buscar"' },
						{ sp: 'wooloo', lv: [10, 12], w: 6, displaced: true },
					],
				},
			},
		},

		// =================== PUEBLO VÁNITAS ===================
		vanitas: {
			name: 'Pueblo Vánitas', short: 'Vánitas', region: 'kalos', kind: 'town', map: { x: 31, y: 70 },
			bg: { type: 'town', fog: true, roofs: ['#4a4f6a', '#5a5f7a', '#3d4256'] },
			desc: 'Un pueblo de piedra gris y tejados de pizarra, con un pozo en la plaza y relojes de sol que nadie mira. Por encima de todo, en una loma, el **Castillo Caduco**.\n\nLa gente de aquí camina despacio. Como si tuviera todo el tiempo del mundo. Como si alguien lo tuviera.',
			descNight: 'De noche, la niebla sube del río y se queda a vivir en las calles. Las farolas de gas hacen lo que pueden.\n\nEn lo alto de la loma, en el **Castillo Caduco**, hay una sola ventana encendida. Siempre la misma.',
			links: ['ruta5', 'ruta6', 'ruta7'],
			mapNote: 'Castillo Caduco · Herbolario',
			onEnter: [{ script: 'b01_llegada_vanitas', once: true }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Herbolario «La Raíz Amarga»', sub: 'Polvos, raíces y bayas', icon: '🌿', action: { shop: 'herbolario' } },
				{ label: 'La herbolaria', sub: 'Machaca algo en un mortero', icon: '🧪', talk: [{ script: 'b01_herbolaria' }] },
				{ label: 'Castillo Caduco', sub: 'En lo alto de la loma', icon: '🏰', action: { go: 'castillo_caduco' }, new: '!flag.b01_conde_1 || (quest.b01_s_conde == "fantasma" && (' + FANTASMA_SINIESTRO + '))' },
				{ label: 'Un hombre con auriculares junto al pozo', sub: 'Graba algo con cara de no creérselo', icon: '🎧', talk: [
					{ cond: 'flag.b01_simon_1 && done.b01_s_conde', script: 'b01_simon_2' },
					{ cond: 'flag.b01_simon_1', script: 'b01_simon_generico' },
					{ script: 'b01_simon_1' },
				], new: '!flag.b01_simon_1' },
			],
			rumors: [
				{ text: 'El Conde no envejece. Mi abuela lo conoció igual. Igualito. Con la misma capa.' },
				{ text: 'En el herbolario venden **Bayas Meloc**. Dicen que un cocinero de paso compró media docena.' },
				{ cond: 'quest.b01_m4 == "snorlax"', text: 'Para despertar a un Snorlax hace falta música. Y en este pueblo, el único que guarda instrumentos raros es el Conde.' },
			],
		},
		castillo_caduco: {
			name: 'Castillo Caduco', parent: 'vanitas', kind: 'building',
			bg: { type: 'castle', fog: true },
			desc: 'Un vestíbulo enorme lleno de velas que nadie ha visto encender. En las paredes, decenas de retratos de un mismo hombre pálido: con gorguera, con peluca, con traje de los años veinte, con gafas de sol. Siempre la misma cara.\n\nAlgo cuchichea en los pasillos. Cuando te giras, se calla.',
			spots: [
				{ label: 'El Conde Vladimiro', sub: 'Te espera junto a la chimenea', icon: '🧛', talk: [
					{ cond: '!flag.b01_conde_1', script: 'b01_conde_1' },
					{ cond: 'quest.b01_s_conde == "fantasma" && (' + FANTASMA_SINIESTRO + ')', script: 'b01_conde_flauta' },
					{ cond: 'quest.b01_s_conde == "fantasma"', script: 'b01_conde_recordar' },
					{ script: 'b01_conde_generico' },
				], new: '!flag.b01_conde_1 || (quest.b01_s_conde == "fantasma" && (' + FANTASMA_SINIESTRO + '))' },
				{ label: 'Bajar a los sótanos', sub: 'Algo se ríe ahí abajo', icon: '🕯️', action: { explore: 'cave' } },
				{ label: 'Mirar los retratos', icon: '🖼️', talk: [{ script: 'b01_castillo_retratos' }] },
			],
			encounters: {
				cave: [
					{ sp: 'gastly', lv: [10, 13], w: 45 },
					{ sp: 'zubat', lv: [10, 12], w: 30 },
					{ sp: 'litwick', lv: [10, 12], w: 15, time: 'night' },
					{ sp: 'litwick', lv: [10, 11], w: 5, time: 'day' },
				],
			},
		},

		// =================== RUTA 6 (opcional) ===================
		ruta6: {
			name: 'Ruta 6 · Alameda Palaciega', short: 'Ruta 6', region: 'kalos', kind: 'route', map: { x: 31, y: 61 },
			bg: { type: 'route', flowers: '#e9dcc0' },
			desc: 'Una alameda recta como una regla, entre setos recortados con forma de Furfrou. Al fondo, las verjas doradas del **Palacio Cénit**.\n\nAquí se pasea despacio y con sombrilla. Correr está mal visto. Combatir, solo si es con guantes.',
			links: ['vanitas', 'palacio_cenit'],
			rumors: [
				{ text: 'Entre los setos vive un Pokémon que parece una espada. Si lo ves, no lo mires a los ojos: no tiene ojos. Bueno, tiene uno.' },
				{ text: 'Los jardineros del palacio esconden sus herramientas bajo los setos. Y a veces, otras cosas.' },
			],
			route: {
				from: 'vanitas', to: 'palacio_cenit', length: 6, terrain: 'grass', rate: 0.2,
				tramos: {
					1: [{ text: 'Setos con forma de Furfrou en fila, cada uno con un corte distinto. Uno de ellos tiene un nido de Fletchling en la oreja.' }, { item: 'revive' }],
					2: [{ trainer: 'r6_dama_ophelie' }, { item: 'tinymushroom', hidden: true }],
					3: [{ text: 'Una estatua de un rey antiguo, muy alto, con una flor de piedra en la mano. La placa está borrada por el tiempo.' }],
					4: [{ trainer: 'r6_caballero_armand', optional: true, label: 'Te saluda con el sombrero. Luego con un Pokémon.' }, { item: 'spelltag', hidden: true }],
					5: [{ text: 'Las hojas de los setos están cortadas con una precisión inquietante. Ningún jardinero corta así. Algo con filo vive aquí.' }],
					6: [{ text: 'Las verjas del **Palacio Cénit**, doradas y abiertas de par en par. Un cartel: «Visitas de 10 a 18 h. Prohibido tocar el jardín. Prohibido mirar el jardín con mala cara».' }],
				},
				encounters: {
					grass: [
						{ sp: 'sentret', lv: [11, 13], w: 25, time: 'day' },
						{ sp: 'oddish', lv: [11, 13], w: 20 },
						{ sp: 'oddish', lv: [11, 13], w: 20, time: 'night' },
						{ sp: 'espurr', lv: [12, 14], w: 20 },
						{ sp: 'nincada', lv: [12, 13], w: 12 },
						{ sp: 'audino', lv: [12, 14], w: 8 },
						{ sp: 'honedge', lv: [12, 14], w: 5 },
						{ sp: 'kecleon', lv: [12, 14], w: 4 },
					],
				},
			},
		},
		palacio_cenit: {
			name: 'Palacio Cénit', short: 'Palacio', region: 'kalos', kind: 'area', map: { x: 31, y: 52 },
			bg: { type: 'palace' },
			desc: 'Un palacio de mármol blanco con más ventanas que días tiene el año, una fuente con forma de Gyarados y un jardín geométrico que se pierde de vista.\n\nEl dueño vive aquí. Lo sabes porque lo pone en tres carteles distintos.',
			links: ['ruta6'],
			mapNote: 'Jardines reales (opcional)',
			spots: [
				{ label: 'El dueño del palacio', sub: 'Un señor con peluca empolvada', icon: '👑', talk: [
					{ cond: 'quest.b01_s_cenit == "buscar" && flag.b01_cenit_furfrou', script: 'b01_cenit_entrega' },
					{ cond: 'quest.b01_s_cenit == "buscar"', script: 'b01_cenit_recordar' },
					{ cond: 'done.b01_s_cenit', script: 'b01_cenit_despues' },
					{ script: 'b01_cenit_1' },
				], new: '!quest.b01_s_cenit || flag.b01_cenit_furfrou && !done.b01_s_cenit' },
				{ label: 'Laberinto de setos', sub: 'El jardín real', icon: '🌳', cond: 'quest.b01_s_cenit == "buscar" && !flag.b01_cenit_furfrou', talk: [{ script: 'b01_cenit_laberinto' }] },
				{ label: 'El mayordomo', sub: 'Impecable. Inmóvil. Te mira.', icon: '🎩', talk: [{ cond: 'beat("mayordomo_cenit")', script: 'b01_mayordomo_despues' }, { script: 'b01_mayordomo' }] },
				{ label: 'Colmenas del jardín', sub: 'Zumban detrás de los rosales', icon: '🐝', cond: '!flag.b01_cenit_miel', talk: [{ script: 'b01_cenit_colmenas' }] },
				{ label: 'Fuente del Gyarados', icon: '⛲', talk: [{ script: 'b01_cenit_fuente' }] },
			],
			rumors: [
				{ text: 'El dueño del palacio dice que su familia «inventó los jardines». Los jardines no opinan.' },
				{ text: 'Hace muchos años, el palacio tenía una flauta mágica que despertaba a cualquiera. Se la prestaron a alguien. No volvió.' },
			],
		},

		// =================== RUTA 7 ===================
		ruta7: {
			name: 'Ruta 7 · Paseo de la Ribera', short: 'Ruta 7', region: 'kalos', kind: 'route', map: { x: 27, y: 80 },
			bg: { type: 'route', flowers: '#f2d13d' },
			desc: 'Un paseo junto al río, entre flores amarillas y moradas. Huele a agua dulce y a algo que se está cocinando a fuego lento.\n\nEn la orilla hay una casita con un cartel: «**Pensión Pokémon**».',
			links: ['vanitas', 'gruta_tierraunida'],
			rumors: [
				{ text: 'Un Snorlax lleva días durmiendo en mitad del paseo. Los niños le ponen flores en la barriga. No se entera.' },
				{ text: 'Por la noche, sobre el río, los Volbeat y las Illumise dibujan figuras con luz. Hay quien jura que dibujan grietas.' },
				{ cond: 'quest.b01_t_mareep == "buscar"', text: 'Un Mareep sin dueño duerme donde nadie lo pisa: entre las flores más altas.' },
			],
			route: {
				from: 'vanitas', to: 'gruta_tierraunida', length: 8, terrain: 'grass', rate: 0.2,
				tramos: {
					1: [
						{ text: 'La **Pensión Pokémon** tiene un cartel escrito a mano en la puerta: «COMPLETO. No aceptamos más huéspedes hasta nuevo aviso. Tampoco Wooloo. ESPECIALMENTE Wooloo».' },
						{ trainer: 'r7_pescador_gilles' },
					],
					2: [
						{ talk: [
							{ cond: '!flag.b01_gaspar_1', script: 'b01_gaspar_r7_intro' },
							{ cond: 'done.b01_t_gaspar', script: 'b01_gaspar_r7_despues' },
							{ cond: GASPAR_TODO, script: 'b01_gaspar_cocina' },
							{ script: 'b01_gaspar_r7_falta' },
						], label: 'Gaspar', sub: 'Cocina en la orilla, con una olla enorme', icon: '👨‍🍳', new: '!done.b01_t_gaspar && (!flag.b01_gaspar_1 || (' + GASPAR_TODO + '))' },
						{ text: 'Una olla de hierro sobre un fuego de ramas, en la orilla. El vapor huele a mantequilla, a tomillo y a algo que no sabes nombrar.' },
					],
					3: [
						{ terrain: 'flowers' },
						{ text: 'Un mar de flores amarillas. Una mujer con boina pinta el río en un caballete. A su lado, un Smeargle pinta… otra cosa.' },
						{ trainer: 'r7_pintora_fleur' },
						{ item: 'greatball', n: 2 },
					],
					4: [
						{ script: 'b01_r7_snorlax_ve', mark: true },
						{ talk: [{ cond: 'has("pokeflute")', script: 'b01_r7_snorlax_flauta' }, { script: 'b01_r7_snorlax' }], label: 'Snorlax dormido', sub: 'Ronca atravesado en el camino', icon: '💤', cond: '!flag.b01_snorlax', new: 'has("pokeflute")' },
						{ block: { cond: 'flag.b01_snorlax', msg: 'Un Snorlax enorme ronca atravesado en el paseo. Por un lado, el río. Por el otro, un talud. No hay forma de pasar.', dir: 1 } },
						{ text: 'Ronquidos como truenos lejanos. Las flores del paseo tiemblan a cada respiración.', cond: '!flag.b01_snorlax' },
						{ text: 'En el suelo, donde dormía el Snorlax, queda la forma de su cuerpo aplastada en la hierba. Y un plato vacío.', cond: 'flag.b01_snorlax' },
					],
					5: [
						{ terrain: 'flowers' },
						{ text: 'Flores amarillas hasta la rodilla. Entre los tallos crecen setas diminutas con sombrero rojo.' },
						{ item: 'tinymushroom', hidden: true },
					],
					6: [
						{ trainer: 'r7_cuidadora_annette', optional: true, label: 'Lleva un cubo de comida para Pokémon y cara de no haber dormido.' },
						{ text: 'Flores altas, casi blancas. Una de ellas, al tocarla, da calambre.' },
						{ item: 'lanamareep3', hidden: true },
						{ talk: [{ script: 'b01_mareep_nube' }], label: 'Seguir el rastro de lana', sub: 'Algo blanco duerme entre las flores', icon: '🐑', cond: 'has("lanamareep3")', new: 'true' },
					],
					7: [
						{ trainer: 'r7_excursionista_bruno' },
						{ item: 'xattack' },
					],
					8: [{ text: 'El río se mete bajo una pared de roca. A la derecha, la boca oscura de la **Gruta Tierraunida**, con vetas de cristal que brillan como venas.' }],
				},
				encounters: {
					grass: [
						{ sp: 'croagunk', lv: [13, 15], w: 30 },
						{ sp: 'ducklett', lv: [14, 15], w: 15 },
						{ sp: 'roselia', lv: [14, 15], w: 15 },
						{ sp: 'smeargle', lv: [14, 16], w: 10 },
						{ sp: 'volbeat', lv: [13, 15], w: 12, time: 'night' },
						{ sp: 'illumise', lv: [13, 15], w: 12, time: 'night' },
						{ sp: 'swirlix', lv: [14, 15], w: 6 },
						{ sp: 'spritzee', lv: [14, 15], w: 6 },
						{ sp: 'mareep', lv: [13, 15], w: 6, displaced: true, cond: 'quest.b01_t_mareep == "buscar"' },
					],
					flowers: [
						{ sp: 'flabebe', lv: [13, 15], w: 50 },
						{ sp: 'roselia', lv: [14, 15], w: 15 },
						{ sp: 'smeargle', lv: [14, 16], w: 12 },
						{ sp: 'volbeat', lv: [13, 15], w: 10, time: 'night' },
						{ sp: 'illumise', lv: [13, 15], w: 10, time: 'night' },
						{ sp: 'spritzee', lv: [14, 15], w: 8 },
						{ sp: 'swirlix', lv: [14, 15], w: 8 },
					],
				},
			},
		},

		// =================== GRUTA TIERRAUNIDA ===================
		gruta_tierraunida: {
			name: 'Gruta Tierraunida', short: 'Gruta', region: 'kalos', kind: 'cave', map: { x: 19, y: 86 },
			bg: { type: 'cave', crystals: '#7fd6e0' },
			desc: 'Un túnel natural que atraviesa la sierra hasta la costa. Las paredes tienen **vetas de cristal** que recogen la luz de fuera y la devuelven, azulada, a lo largo del pasillo principal.\n\nHay galerías laterales donde el cristal no llega. Ahí dentro, la oscuridad es completa.',
			links: ['ruta7', 'ruta8'],
			mapNote: 'Paso a la costa · Galería Honda (hace falta luz)',
			rumors: [
				{ text: 'El pasillo principal se cruza sin lámpara. La **Galería Honda**, no: ahí abajo no llega ni el cristal.' },
				{ text: 'En lo más hondo hay dibujos en la roca. Más viejos que Kalos, dicen.' },
				{ text: 'A veces se ve un Axew afilándose los colmillos en las estalactitas. Muy de vez en cuando.' },
			],
			route: {
				from: 'ruta7', to: 'ruta8', length: 7, terrain: 'cave', rate: 0.22,
				tramos: {
					1: [{ text: 'Las vetas de cristal brillan en azul pálido. Tus pasos suenan dos veces: una tuya y otra del eco.' }],
					2: [{ trainer: 'gruta_excursionista_mael' }, { item: 'escaperope' }],
					3: [
						{ text: 'Un recodo donde el cristal se apaga. En la penumbra, muy bajito, algo **chisporrotea**. Una lucecita amarilla se enciende y se apaga, como si respirara.' },
						{ item: 'lanamareep4', hidden: true },
						{ talk: [{ script: 'b01_mareep_candela' }], label: 'Seguir la lucecita', sub: 'Chisporrotea en la oscuridad', icon: '🐑', cond: 'has("lanamareep4")', new: 'true' },
					],
					4: [{ trainer: 'gruta_arqueologa_ines', optional: true, label: 'Toma notas a la luz de un frontal. Te apunta con él a la cara.' }],
					5: [
						{ text: 'A la izquierda del pasillo se abre una rampa que baja hacia una oscuridad sin fondo. Corre un aire frío que huele a piedra vieja.' },
						{ talk: [{ script: 'b01_gruta_honda' }], label: 'Bajar a la Galería Honda', sub: 'Negro como la tinta', icon: '🕳️', new: '(' + LUZ + ') && !flag.b01_gruta_honda' },
					],
					6: [{ text: 'El cristal vuelve a brillar, cada vez más fuerte. Al fondo se oye el mar.' }, { item: 'stardust', hidden: true }],
					7: [{ text: 'Luz de día. Viento salado. La gruta escupe el camino a lo alto de un acantilado.' }],
				},
				encounters: {
					cave: [
						{ sp: 'zubat', lv: [13, 15], w: 30 },
						{ sp: 'whismur', lv: [13, 15], w: 30 },
						{ sp: 'meditite', lv: [13, 15], w: 25 },
						{ sp: 'woobat', lv: [13, 15], w: 12, time: 'night' },
						{ sp: 'axew', lv: [14, 16], w: 5 },
					],
				},
			},
		},

		// =================== RUTA 8 ===================
		ruta8: {
			name: 'Ruta 8 · Muralla Costera', short: 'Ruta 8', region: 'kalos', kind: 'route', map: { x: 12, y: 93 },
			bg: { type: 'coast' },
			desc: 'Un camino al borde de los acantilados, con el mar golpeando cincuenta metros más abajo. El viento sopla tan fuerte que los Wingull vuelan hacia atrás sin darse cuenta.\n\nAl sur se ve un pueblo pequeño, de casas blancas: **Pueblo Petroglifo**.',
			links: ['gruta_tierraunida', 'petroglifo'],
			onEnter: [{ script: 'b01_r8_llegada', once: true }],
			rumors: [
				{ text: 'En las rocas del acantilado viven Binacle. Si ves una mano en una roca, no es una mano.' },
				{ text: 'De noche, unos globos morados flotan sobre la Muralla. Son Drifloon. Que no te den la mano.' },
				{ cond: 'quest.b01_t_mareep == "buscar"', text: 'Hay un Mareep atrapado en una cornisa del acantilado. Tan esponjado por el viento que parece una nube con patas.' },
			],
			route: {
				from: 'gruta_tierraunida', to: 'petroglifo', length: 7, terrain: 'grass', rate: 0.2,
				tramos: {
					1: [{ trainer: 'r8_pescador_loic' }, { text: 'Un pescador ha bajado una caña de cincuenta metros por el acantilado. No pregunta si es buena idea.' }],
					2: [
						{ terrain: 'rocks' },
						{ text: 'Rocas negras y una cornisa estrecha. El viento arrastra mechones blancos que se quedan pegados a la piedra, crepitando.' },
						{ item: 'lanamareep5', hidden: true },
						{ talk: [{ script: 'b01_mareep_algodon' }], label: 'Seguir el rastro de lana', sub: 'Hacia una cornisa del acantilado', icon: '🐑', cond: 'has("lanamareep5")', new: 'true' },
					],
					3: [{ script: 'b01_r8_tobias', mark: true }, { text: 'Un trípode con un móvil apuntando a la nada. Alguien estuvo grabando aquí.' }],
					4: [{ text: 'Un mirador con un banco y una placa: «Para quien espera un barco que no vuelve». Alguien ha dejado una concha encima.' }, { item: 'pearl' }],
					5: [{ terrain: 'rocks' }, { trainer: 'r8_karateka_thibault' }],
					6: [{ trainer: 'r8_turista_fiona', optional: true, label: 'Una chica en pijama con un Wooloo. Parece perdida. Muy perdida.' }, { item: 'superpotion', hidden: true }],
					7: [{ text: 'El camino baja en zigzag hacia las casas blancas de **Pueblo Petroglifo**. En las rocas de la orilla hay dibujos tallados: figuras, soles, un árbol con alas.' }],
				},
				encounters: {
					grass: [
						{ sp: 'wingull', lv: [14, 16], w: 25 },
						{ sp: 'spoink', lv: [14, 16], w: 25 },
						{ sp: 'inkay', lv: [15, 16], w: 20 },
						{ sp: 'mienfoo', lv: [15, 16], w: 12 },
						{ sp: 'drifloon', lv: [14, 16], w: 15, time: 'night' },
						{ sp: 'absol', lv: [15, 16], w: 6 },
						{ sp: 'bagon', lv: [15, 16], w: 2 },
					],
					rocks: [
						{ sp: 'binacle', lv: [14, 17], w: 55 },
						{ sp: 'dwebble', lv: [14, 17], w: 35 },
						{ sp: 'wingull', lv: [14, 16], w: 10 },
					],
				},
			},
		},

		// =================== PUEBLO PETROGLIFO ===================
		petroglifo: {
			name: 'Pueblo Petroglifo', short: 'Petroglifo', region: 'kalos', kind: 'town', map: { x: 6, y: 101 },
			bg: { type: 'town', roofs: ['#f3efe6', '#e9e3d0', '#5aa3c4'] },
			desc: 'Un pueblo de pescadores de casas blancas, con barcas varadas en la arena y redes secándose al sol. En las rocas de la playa hay **petroglifos**: figuras talladas hace miles de años que nadie ha sabido leer.\n\nAl norte, una senda pedregosa sube hacia el **Paso de Rhyhorn**.',
			descNight: 'De noche, la marea sube y cubre la mitad de las rocas talladas. Las barcas cabecean en la arena y las redes gotean colgadas de los postes.\n\nCon la luna y el agua moviéndose encima, los **petroglifos** que quedan fuera parecen moverse también. Los pescadores no miran hacia la playa al volver a casa.',
			links: ['ruta8'],
			mapNote: 'Laboratorio de Fósiles · Acuario',
			onEnter: [{ script: 'b01_llegada_petroglifo', once: true }],
			spots: [
				{ label: 'Centro Pokémon', action: { center: true } },
				{ label: 'PC de almacenamiento', action: { pc: true } },
				{ label: 'Tienda Pokémon', action: { shop: 'tienda_1' } },
				{ label: 'Laboratorio de Fósiles', icon: '🦴', action: { go: 'lab_fosiles' }, new: '!flag.b01_lazare_1' },
				{ label: 'Acuario de Petroglifo', icon: '🐟', action: { go: 'acuario_petroglifo' }, new: 'quest.b01_s_acuario == "fotos" && seen("inkay") && seen("binacle") && seen("wingull")' },
				{ label: 'Jinetes de Rhyhorn', sub: 'A la salida hacia el Paso de Rhyhorn', icon: '🦏', talk: [{ script: 'b01_jinetes_rhyhorn' }], new: '!flag.mount_rhyhorn' },
				{ label: 'Las rocas talladas', sub: 'Petroglifos en la playa', icon: '🪨', talk: [{ script: 'b01_petroglifos' }] },
			],
			rumors: [
				{ text: 'Unos tipos con trajes rojos de diseño y gafas de sol preguntaron por fósiles. Pagaban en efectivo. Mucho efectivo.' },
				{ text: 'Los jinetes de Rhyhorn cruzan el Paso cada mañana. Sin montura, las rocas te destrozan las botas. Y los tobillos.' },
				{ text: 'En la Cueva Brillante, al norte, las paredes brillan solas. Dicen que ahora brillan menos.' },
			],
		},
		lab_fosiles: {
			name: 'Laboratorio de Fósiles', parent: 'petroglifo', kind: 'building',
			bg: { type: 'lab' },
			desc: 'Vitrinas con huesos, ámbar y conchas fosilizadas. En el centro, una máquina enorme con forma de cápsula y una etiqueta: «**Restaurador de Fósiles** · No apoyar el café».\n\nHay una taza de café apoyada encima.',
			spots: [
				{ label: 'El científico del laboratorio', sub: 'Pelo blanco, gafas, bata con quemaduras', icon: '🔬', talk: [
					{ cond: '!flag.b01_lazare_1', script: 'b01_lazare_1' },
					{ script: 'b01_lazare_generico' },
				], new: '!flag.b01_lazare_1' },
				{ label: 'Mirar las vitrinas', icon: '🦴', talk: [{ script: 'b01_lab_vitrinas' }] },
			],
		},
		acuario_petroglifo: {
			name: 'Acuario de Petroglifo', parent: 'petroglifo', kind: 'building',
			bg: { type: 'indoor', wall: '#3b6fa8', floor: '#2a4a6b' },
			desc: 'Un acuario pequeño, de pueblo, con un túnel de cristal por el que pasan Luvdisc en parejas y un Wailmer que ocupa media pecera y no parece arrepentido.',
			spots: [
				{ label: 'La conservadora', sub: 'Pega carteles en un panel vacío', icon: '🐠', talk: [
					{ cond: 'quest.b01_s_acuario == "fotos" && seen("inkay") && seen("binacle") && seen("wingull")', script: 'b01_acuario_entrega' },
					{ cond: 'quest.b01_s_acuario == "fotos"', script: 'b01_acuario_recordar' },
					{ cond: 'done.b01_s_acuario', script: 'b01_acuario_despues' },
					{ script: 'b01_acuario_1' },
				], new: '!quest.b01_s_acuario || (quest.b01_s_acuario == "fotos" && seen("inkay") && seen("binacle") && seen("wingull"))' },
				{ label: 'El túnel de cristal', icon: '🫧', talk: [{ script: 'b01_acuario_tunel' }] },
			],
		},
	},

	// =================================================================
	trainers: {
		// ----- Ruta 5 -----
		r5_patinadora_odile: {
			name: 'Lou', cls: 'Patinadora', ai: 2,
			team: [{ sp: 'furfrou', lv: 12 }, { sp: 'bunnelby', lv: 11 }],
			intro: '¡Desde lo de la Puerta, la pista se llena de turistas de Galar que no saben frenar! ¡Tú tampoco tienes pinta de saber!',
			win: 'Bueno, frenas mejor de lo que pensaba.',
			look: { hair: 'ponytail', hairColor: '#e98aa8', outfit: '#f2b33d', outfit2: '#2b2b38', skin: 1, acc: 'headphones', mouth: 'grin' },
		},
		r5_patinador_lucas: {
			name: 'Maxime', cls: 'Patinador', ai: 2,
			team: [{ sp: 'skiddo', lv: 13 }],
			intro: 'Lemnis cerró la ruta tres semanas «para investigar». Yo creo que era para que no les rayáramos el asfalto nuevo.',
			win: 'Me caí. Del combate, no de la barandilla. Eso ya pasó antes.',
			look: { hair: 'cap', hairColor: '#2b2b38', outfit: '#3f9d58', outfit2: '#f3e6c4', skin: 4, mouth: 'grin' },
		},
		r5_criadora_margaux: {
			name: 'Margaux', cls: 'Criadora', ai: 2,
			team: [{ sp: 'wooloo', lv: 12 }, { sp: 'doduo', lv: 13 }],
			intro: 'Un Wooloo me cayó del cielo en el huerto la semana pasada. Lemnis vino a «recogerlo». Les cerré la puerta. Ahora es de la familia, ¿pasa algo?',
			win: 'Bizcocho, cariño, no llores. Lo hiciste muy bien. Rodaste muy fuerte.',
			look: { hair: 'braids', hairColor: '#8a5a2f', outfit: '#8a7a5a', outfit2: '#e9e3d0', skin: 2, acc: 'hat', mouth: 'smile' },
		},
		r5_patinador_remi: {
			name: 'Rémi', cls: 'Patinador', ai: 2,
			team: [{ sp: 'scraggy', lv: 13 }, { sp: 'pancham', lv: 14 }],
			intro: 'Llevo un mes con un truco que se llama «el Infinito». Le puse el nombre antes de lo de la Puerta. Ahora suena a anuncio. ¿Te lo enseño? En combate luce más.',
			win: 'Bueno. Al Infinito le falta un final. Lo estoy trabajando.',
			look: { hair: 'spiky', hairColor: '#d8a85a', outfit: '#c4473a', outfit2: '#2b2b38', skin: 1, acc: 'bandana', mouth: 'grin' },
		},
		bastien_1: {
			name: 'Bastien', cls: 'Novato patrocinado', npc: 'bastien', ai: 3,
			team: [
				{ sp: 'froakie', lv: 12, moves: ['watergun', 'quickattack', 'lick', 'growl'], ability: 'torrent', item: 'oranberry', nature: 'hasty', iv: 24 },
				{ sp: 'fletchling', lv: 11, moves: ['ember', 'peck', 'quickattack', 'growl'], ability: 'bigpecks', nature: 'jolly', iv: 22 },
			],
			items: [{ id: 'potion', n: 1 }],
			intro: 'Cláusula 14. Lo siento. Bueno, no lo siento: me apetecía.',
			win: 'Bueno, bueno. Lo apunto en el informe como «derrota estratégica».',
			lose: 'Gané. Qué raro se siente ganar con este uniforme puesto.',
		},

		// ----- Ruta 6 y Palacio -----
		r6_dama_ophelie: {
			name: 'Ophélie', cls: 'Dama', ai: 2,
			team: [{ sp: 'furfrou', lv: 14 }, { sp: 'flabebe', lv: 13 }],
			intro: 'Mi Furfrou ha ganado tres concursos de belleza. ¿Y el suyo? Ah. Ninguno. Se nota en el corte.',
			win: 'Qué ordinario es perder. Y qué rápido.',
			look: { hair: 'bun', hairColor: '#e9dcc0', outfit: '#e98aa8', outfit2: '#ffffff', skin: 0, acc: 'hat', eyesStyle: 'sleepy', mouth: 'flat' },
		},
		r6_caballero_armand: {
			name: 'Armand', cls: 'Caballero', ai: 2,
			team: [{ sp: 'kecleon', lv: 14 }, { sp: 'sentret', lv: 13 }],
			intro: '¿La Puerta Lemnis? Bah. Mi familia ya tuvo un portal entre regiones hace doscientos años. Se llamaba diligencia, y tardaba tres semanas.',
			win: 'En mis tiempos se perdía con más elegancia. Hoy no me ha salido.',
			look: { hair: 'short', hairColor: '#cfd6e2', outfit: '#2b2b38', outfit2: '#ffffff', skin: 1, acc: 'mustache hat tie', mouth: 'flat' },
		},
		mayordomo_cenit: {
			name: 'Gérard', cls: 'Mayordomo', ai: 3,
			team: [{ sp: 'espurr', lv: 15 }, { sp: 'audino', lv: 14 }],
			intro: 'Con su permiso.',
			win: 'Una derrota impecable. Gracias por la lección.',
			look: { hair: 'short', hairColor: '#2b2b38', outfit: '#1c1a2a', outfit2: '#ffffff', skin: 1, acc: 'tie', eyesStyle: 'sleepy', mouth: 'flat' },
		},

		// ----- Ruta 7 -----
		r7_pescador_gilles: {
			name: 'Yves', cls: 'Pescador', ai: 2,
			team: [{ sp: 'goldeen', lv: 14 }, { sp: 'psyduck', lv: 13 }],
			intro: 'Ayer pesqué un Arrokuda. Un pez de Galar, en un río de Kalos. Lo devolví al agua. No sé si al agua correcta.',
			win: 'Hoy no pican ni los combates.',
			look: { hair: 'cap', hairColor: '#5a3a26', outfit: '#5aa36b', outfit2: '#8a7a5a', skin: 3, acc: 'beard', mouth: 'flat' },
		},
		r7_pintora_fleur: {
			name: 'Fleur', cls: 'Pintora', ai: 2,
			team: [{ sp: 'spritzee', lv: 15 }, { sp: 'ducklett', lv: 14 }],
			intro: 'Mi Smeargle no combate: está pintando. Desde la Fisura pinta grietas violetas en todos los cuadros. Yo nunca le enseñé ese color.',
			win: 'Lo que se dibuja con intención, existe. Tú combates igual: con intención.',
			look: { hair: 'curly', hairColor: '#c4473a', outfit: '#3b5bb5', outfit2: '#f3e6c4', skin: 1, acc: 'hat freckles', mouth: 'smile' },
		},
		r7_cuidadora_annette: {
			name: 'Annette', cls: 'Cuidadora', ai: 2,
			team: [{ sp: 'hoppip', lv: 14 }, { sp: 'roselia', lv: 15 }],
			intro: 'En la Pensión ya no caben más. Nos traen Pokémon que nadie reclama. Ninguno es de Kalos. ¿Combatimos? Necesito cinco minutos sin oír balidos.',
			win: 'Gracias. De verdad. Ha sido lo más relajante de la semana.',
			look: { hair: 'tied', hairColor: '#6b4a2b', outfit: '#f2b33d', outfit2: '#5aa36b', skin: 2, eyesStyle: 'sleepy', mouth: 'flat' },
		},
		r7_excursionista_bruno: {
			name: 'Bruno', cls: 'Excursionista', ai: 2,
			team: [{ sp: 'roggenrola', lv: 15 }, { sp: 'croagunk', lv: 16 }],
			intro: 'La gruta se cruza bien: las vetas de cristal dan luz. Lo que no te aconsejo es bajar a la Galería Honda sin lámpara. Pero primero, ¡en guardia!',
			win: 'Fuerte. Pero en la Galería Honda la fuerza no alumbra.',
			look: { hair: 'cap', hairColor: '#8a5a2f', outfit: '#8a5a2f', outfit2: '#d8a85a', skin: 3, acc: 'beard', mouth: 'grin' },
		},

		// ----- Gruta Tierraunida -----
		gruta_excursionista_mael: {
			name: 'Maël', cls: 'Excursionista', ai: 2,
			team: [{ sp: 'whismur', lv: 15 }, { sp: 'machop', lv: 16 }],
			intro: 'Mi abuelo decía que esta gruta une la tierra con el mar… y a los que se pierden dentro. Era muy dramático, mi abuelo.',
			win: 'Mi abuelo también perdía mucho. Lo llevaba con dramatismo.',
			look: { hair: 'short', hairColor: '#2b2b38', outfit: '#3f9d58', outfit2: '#8a7a5a', skin: 4, acc: 'goggles', mouth: 'open' },
		},
		gruta_arqueologa_ines: {
			name: 'Clémence', cls: 'Arqueóloga', ai: 2,
			team: [{ sp: 'meditite', lv: 16 }, { sp: 'zubat', lv: 15 }],
			intro: 'Unos tipos con trajes rojos me preguntaron si aquí había «cristales energéticos». ¿Cristales? Aquí hay murciélagos y humedad. ¿Tú también buscas cristales?',
			win: 'Ya, ya. Tú no buscas cristales. Tú buscas pelea.',
			look: { hair: 'tied', hairColor: '#d8a85a', outfit: '#8a7a5a', outfit2: '#e9e3d0', skin: 2, acc: 'glasses hat', mouth: 'flat' },
		},

		// ----- Ruta 8 -----
		r8_pescador_loic: {
			name: 'Erwan', cls: 'Pescador', ai: 2,
			team: [{ sp: 'luvdisc', lv: 15 }, { sp: 'tentacool', lv: 16 }],
			intro: 'Desde la Fisura saco del mar cosas que no sé ni nombrar. Ayer, un Finizen. Hoy, una bota. La bota sí era de Kalos.',
			win: 'Mejor que la bota. Bastante mejor.',
			look: { hair: 'cap', hairColor: '#cfd6e2', outfit: '#3b5bb5', outfit2: '#f2b33d', skin: 2, acc: 'beard', eyesStyle: 'sleepy', mouth: 'smile' },
		},
		r8_karateka_thibault: {
			name: 'Thibault', cls: 'Karateka', ai: 2,
			team: [{ sp: 'mienfoo', lv: 16 }, { sp: 'machop', lv: 17 }],
			intro: 'Entreno en el acantilado porque el viento no te deja rendirte. Bueno, sí te deja. Pero se ríe de ti.',
			win: 'El viento se está riendo. Lo oigo.',
			look: { hair: 'bald', hairColor: '#2b2b38', outfit: '#ffffff', outfit2: '#2b2b38', skin: 4, acc: 'bandana', eyesStyle: 'sharp', mouth: 'flat' },
		},
		r8_turista_fiona: {
			name: 'Fiona', cls: 'Turista de Galar', ai: 2,
			team: [{ sp: 'wooloo', lv: 15 }, { sp: 'rookidee', lv: 16 }],
			intro: 'Me caí por una grieta en mi pueblo, en Galar, y aparecí en una playa de Kalos. Con mi Wooloo. En pijama. ¿Combate? Sí, por favor. Algo normal, por favor.',
			win: 'Gracias. Ha sido lo más normal que me ha pasado en tres semanas.',
			look: { hair: 'long', hairColor: '#e9dcc0', outfit: '#8ab4e8', outfit2: '#ffffff', skin: 0, mouth: 'open' },
		},
		tobias_1: {
			name: 'Tobías', cls: '«Estrella» del show', npc: 'tobias', ai: 3,
			team: [
				{ sp: 'meowth', lv: 17, moves: ['fakeout', 'payday', 'bite', 'growl'], ability: 'technician', nature: 'jolly', iv: 22 },
				{ sp: 'spoink', lv: 15, moves: ['psybeam', 'confusion', 'growl', 'splash'], ability: 'thickfat', nature: 'modest', iv: 20 },
			],
			items: [{ id: 'potion', n: 1 }],
			intro: '¡Patrocinadores, atentos! ¡Combate en directo! ¡Duquesa, haz lo tuyo! …¿No? ¿Hoy no sales? Bueno. ¡Que salga la doble de acción!',
			win: '¡Derrota épica! ¡Eso engancha! ¡Los números van a subir! …¿Verdad, Duquesa? …Duquesa no me habla.',
			lose: '¡VICTORIA! ¡Patrocinadores, eso ha sido por ustedes! ¡Y por Duquesa! Sobre todo por Duquesa.',
		},
	},

	// =================================================================
	scripts: {
		// =================== RUTA 5: Philippe y el Pancham ===================
		b01_r5_pancham: [
			{ text: 'Sobre una roca, un **Pancham** con una hoja en la boca está barajando cartas. Las corta, las mezcla en cascada, hace un abanico perfecto. Lo hace muchísimo mejor que Philippe.' },
			{ text: 'Al verte, lanza la baraja entera al aire, te hace una mueca y se pierde entre la hierba. Las cartas caen como confeti sobre las flores moradas.' },
			{ say: 'rotom', text: '¡Bzzt! ¡La baraja de Philippe! Ha caído entre la hierba alta. Habrá que **buscar** bien.' },
		],
		b01_r5_baraja_hallada: [
			{ text: 'Recoges las cartas una a una y las metes en su caja. En la tapa, escrito a mano: «Propiedad de Philippe Dumont. Si la encuentras, NO mires las cartas marcadas».' },
			{ text: 'Todas las cartas están marcadas.' },
			{ if: '!quest.b01_s_philippe', then: [{ say: 'rotom', text: '¡Bzzt! ¿Philippe Dumont? Creo que es el señor de los trucos de cartas del Café Soleil, en Luminalia.' }] },
			{ quest: 'b01_s_philippe', stage: 'volver' },
		],

		// =================== RUTA 5: el campamento de Lemnis ===================
		b01_r5_lemnis: [
			{ set: { 'flag.b01_bastien_ruta5': true } },
			{ quest: 'b01_t_bastien', stage: 'ruta5', silent: true },
			{ quest: 'b01_m2', done: true },
			{ quest: 'b01_m4', stage: 'vanitas' },
			{ text: 'En un ensanche del camino hay dos camiones blancos con la lemniscata azul y plata pintada en el lateral, un toldo, y una fila de **jaulas de contención**: acolchadas por dentro, con el logo bordado en el cojín.' },
			{ text: 'Dentro hay un Wooloo, un Skwovet, un Rookidee y algo pequeño que tiembla bajo una manta. En cada jaula, una etiqueta: «**Destino: por asignar**».' },
			{ text: 'Entre las jaulas también ves al Lechonk de la Ruta 4. Te reconoce. Mueve el hocico.', cond: 'flag.b01_lechonk_lemnis' },
			{ if: 'inParty("riolu") || inParty("lucario")', then: [{ text: '{riolu} se ha quedado muy quieto. El pelo de la nuca, de punta.' }] },
			{ say: 'noa', as: 'Mujer de Lemnis', text: '¡Hola! ¿Vienes de Luminalia? Perdona el lío: estamos en plena recogida. Soy Noa. Noa Lambert.' },
			{ say: 'noa', text: 'Normalmente me dedico a buscar talentos para el Circuito. Hoy hago de pastora. —Se ríe—. Lemnis está recogiendo a los Pokémon que trajo la Fisura para **devolverlos a sus regiones**. Pobrecillos, están muy lejos de casa.' },
			{ text: 'Detrás de ella, cargando una jaula con cara de no querer cargarla, hay un chico rubio con un uniforme de Lemnis que le queda una talla grande. Lo conoces: el que atrapó al vuelo la Ball de Froakie en la inauguración.' },
			{ say: 'bastien', text: 'Ah. Hola. Eres… {el|la|le} del Riolu. No mires el uniforme. Es de contrato.' },
			{ say: 'bastien', text: 'Bastien Lacroix. Lemnis me patrocina en el Circuito. Me pagan el equipo, los viajes, las Pociones… y a cambio, pues. Esto.' },
			{ say: 'noa', text: 'Bastien es mi mejor fichaje del año. Lo que pasa es que todavía no se lo cree.' },
			{ say: 'bastien', text: 'Noa, ¿le cuento lo del contrato o se lo cuentas tú?' },
			{ say: 'noa', text: '…Hay una cláusula. Los patrocinados tienen que demostrar el nivel del programa «ante testigos cualificados». Y tú tienes una medalla. Eres testigo cualificado.' },
			{ say: 'bastien', text: 'Cláusula 14. Literalmente. La 14 es la que lo dice todo: tiene subapartados hasta la letra ñ. Así que… ¿combatimos? Te prometo que no es personal. Bueno, un poco sí. Froakie tiene ganas.' },
			{ choice: [
				{ text: '«Antes deja que cure a mi equipo.»', then: [
					{ say: 'bastien', text: 'Claro, claro. Lemnis me paga las Pociones. Por una vez, que sirvan para algo bueno.' },
					{ heal: 'Bastien abre una caja de Superpociones con la lemniscata en la tapa y te pasa unas cuantas. Noa lo apunta en su libreta: «gasto de cortesía».' },
				] },
				{ text: '«Así como estoy. Vamos.»', then: [
					{ say: 'bastien', text: 'De acuerdo. Si luego pierdes, no se vale decir que fue por eso. Bueno, sí se vale. Yo lo diría.' },
				] },
			] },
			{ battle: 'bastien_1', lose: 'continue',
				onWin: [
					{ say: 'bastien', text: 'Ganaste. Me alegro, ¿sabes? Pero no se lo digas a mi contrato.' },
					{ say: 'noa', text: '¡Buen combate! Lo apunto como «el programa se enfrenta a rivales de primer nivel». Queda bien en el informe.' },
				],
				onLose: [
					{ say: 'bastien', text: 'Gané. Qué raro se siente ganar con este uniforme puesto. Como si hubiera ganado otro.' },
					{ say: 'noa', text: 'Los dos lo hicieron genial. Lo apunto como «empate técnico con ventaja». Queda bien en el informe.' },
				] },
			{ heal: true, silent: true },
			{ intel: { npc: 'bastien', text: 'Lleva uniforme de Lemnis «por contrato». La cláusula 14 le obliga a combatir ante testigos… y tiene subapartados hasta la ñ.' } },
			{ text: 'Mientras Noa rellena un formulario, te fijas en la jaula del fondo. Dentro hay un **Mareep** que no deja de mirarte. Al cuello lleva un cencerro de latón, y en la lana del lomo tiene una marca de ganadero pintada: «**R.P. · Ruta 42**».' },
			{ say: 'rotom', text: '¡Bzzt! La Ruta 42 está en **Johto**. Las marcas de ganadero solo las llevan los Pokémon que tienen dueño.' },
			{ if: 'inParty("riolu") || inParty("lucario")', then: [
				{ text: '{riolu} se planta delante de la jaula. Le recorre los brazos un brillo azul, y gruñe a los dos agentes que se acercan. No a Noa: a los agentes. Como si notara algo en ellos que tú no ves.' },
				{ say: 'agente_lemnis', text: 'Controle a su Pokémon, por favor.' },
			] },
			{ say: 'noa', text: 'Tranquilo, pequeño. Tranquilo. ¿Lo ves? Lo vamos a llevar a casa.' },
			{ say: 'bastien', text: 'Noa, ¿y a dónde es «casa», exactamente? Nunca lo pone en las etiquetas.' },
			{ say: 'noa', text: 'Al centro de procesamiento de Luminalia. Y luego, a su región.' },
			{ say: 'bastien', text: '¿Y luego?' },
			{ say: 'noa', text: '…Luego, a su región, Bastien. —Lo dice con una sonrisa. La sonrisa de alguien que nunca se ha hecho esa pregunta.' },
			{ prompt: 'El Mareep de la marca te sigue mirando.', choice: [
				{ cond: 'rep.policia >= 5', text: 'Enseñar la Tarjeta de Colaborador: «Ese Mareep es una prueba».', then: [
					{ say: 'noa', text: '«Colaborador Especial de la Policía Internacional»… firmado por Handsome. Con una falta de ortografía en «Especial». —Suspira—. Es auténtica. Nadie falsificaría algo tan mal escrito.' },
					{ say: 'noa', text: 'De acuerdo. Lo registro como «cedido a la autoridad competente». A Rouxel no le va a gustar. Pero es el procedimiento.' },
					{ text: 'Noa abre la jaula. El Mareep sale de un salto y se esconde detrás de tus piernas. Su cencerro dice: **CHISPITA**.' },
					{ rep: { lemnis: -3, policia: 2 } },
					{ set: { 'flag.b01_mareep_jaula': true, 'flag.b01_noa_tarjeta': true, 'vars.mareep': '+1' } },
				] },
				{ text: '«Tiene marca de ganadero. Tiene dueño. Devolverlo a casa es esto.»', then: [
					{ text: 'Noa mira la marca. Mira a Bastien. Bastien mira al suelo con mucha atención.' },
					{ say: 'bastien', text: 'Tiene razón, Noa.' },
					{ say: 'noa', text: '…Lo apunto como «extraviado durante el transporte». Pasa a veces. Los Mareep son muy escurridizos. —Abre la jaula—. Si alguien pregunta, no nos conocemos.' },
					{ text: 'El Mareep sale despacio, olisquea a {riolu} y se queda pegado a tus talones. Su cencerro dice: **CHISPITA**.' },
					{ rep: { lemnis: -1 } },
					{ happy: { who: 'riolu', n: 5 } },
					{ set: { 'flag.b01_mareep_jaula': true, 'flag.b01_noa_favor': true, 'vars.mareep': '+1' } },
				] },
				{ cond: 'inParty("riolu") || inParty("lucario")', text: 'Dejar que {riolu} haga lo que quiere hacer.', then: [
					{ text: 'No dices nada. Solo aflojas la mano. {riolu} da un paso al frente, apoya la palma en el cierre de la jaula y el aura le estalla en el brazo, azul y limpia. El cierre salta.' },
					{ say: 'agente_lemnis', text: '¡Eh! ¡EH! ¡Eso es propiedad de la empresa!' },
					{ say: 'bastien', text: '…Técnicamente, el cierre era propiedad de la empresa. El Mareep, no sé. —Se le escapa una risa. La disimula fatal.' },
					{ text: 'El Mareep sale corriendo y se esconde detrás de ti. Su cencerro dice: **CHISPITA**. Noa te mira como quien mira a alguien que acaba de complicarle mucho la tarde.' },
					{ rep: { lemnis: -5 } },
					{ happy: { who: 'riolu', n: 10 } },
					{ set: { 'flag.b01_mareep_jaula': true, 'flag.b01_mareep_forzado': true, 'vars.mareep': '+1' } },
				] },
				{ text: '«Si dicen que lo devuelven a casa, será verdad.»', then: [
					{ say: 'noa', text: '¡Exacto! Gracias. Necesitaba que alguien lo dijera en voz alta hoy.' },
					{ text: 'El Mareep te mira mientras cierran la lona del camión. {riolu} no te mira a ti: mira la jaula.', cond: 'inParty("riolu") || inParty("lucario")' },
					{ rep: { lemnis: 2 } },
					{ set: { 'flag.b01_mareep_lemnis': true } },
				] },
			] },
			{ say: 'noa', text: 'Bueno. Seguimos hacia Vánitas en un rato. Si ves Pokémon perdidos por la ruta, avísanos. ¡Lemnis cuida de los suyos!' },
			{ say: 'bastien', text: 'Oye, {jugador}. La próxima vez que combatamos, que sea sin uniforme. Me gustaría saber quién gana de verdad.' },
			{ intel: { npc: 'noa', text: 'Cazatalentos de Lemnis. Cree de verdad que los Pokémon desplazados vuelven a casa. No sabe decir adónde.' } },
			{ diary: 'Hoy conocimos a Noa, de Lemnis. ¡Es simpatiquísima! Ella y Bastien recogen a los Pokémon que trajo la grieta. Noa dice que los van a llevar de vuelta a sus casas. Las jaulas tienen cojines bordados, ¡con el logo y todo! Bastien y mi entrenador{|a|e} combatieron y fue emocionante. {riolu} estuvo muy serio todo el rato.' },
		],
		b01_r5_campamento: [
			{ if: 'flag.b01_mareep_lemnis && flag.b01_mareep_jaula', then: [
				{ say: 'agente_lemnis', text: 'Faltó un Mareep en el recuento de esta mañana. Si sabe algo, la empresa se lo agradecería. —Te mira un rato largo—. Mucho.' },
				{ end: true },
			] },
			{ say: 'noa', text: '¡Hola otra vez! Hoy ha sido un día tranquilo: solo dos Wooloo y un Skwovet. Los Wooloo se escapan rodando. Es imposible no reírse.' },
			{ if: 'flag.b01_noa_favor', then: [{ say: 'noa', text: '…Y no, nadie ha preguntado por ningún Mareep. —Baja la voz—. Gracias por no ponérmelo más difícil.' }] },
			{ if: 'flag.b01_mareep_forzado', then: [{ say: 'noa', text: 'Y el cierre roto ya está arreglado. Con dos candados. Por si acaso. —Mira a {riolu} de reojo.' }] },
			{ if: 'flag.b01_noa_tarjeta', then: [{ say: 'noa', text: 'Rouxel me llamó por lo del Mareep «cedido a la autoridad». Le dije que era el procedimiento. Le gustó todavía menos que el Mareep.' }] },
		],
		b01_r5_campamento_dia: [
			{ text: 'Hay agentes por todas partes, cargando y descargando jaulas. La del Mareep de la marca está al fondo, bajo el toldo, a la vista de todos.' },
			{ if: 'inParty("riolu") || inParty("lucario")', then: [{ text: '{riolu} mira la jaula. Luego te mira a ti. Luego mira el cielo, como calculando cuánto falta para que anochezca.' }] },
			{ say: 'rotom', text: '¡Bzzt! De día hay seis agentes. Estadísticamente, de noche habrá menos. Lo digo por decir. No estoy sugiriendo nada. ¡Bzzt!' },
		],
		b01_r5_rescate_noche: [
			{ text: 'De noche, el campamento es un toldo oscuro y un solo guardia que ronca sentado en una silla plegable, con la gorra sobre los ojos.' },
			{ text: 'La jaula del fondo está ahí. Dentro, el Mareep te reconoce: la lana le chisporrotea de alegría y se ilumina un poco, como una lamparita.' },
			{ prompt: '¿Lo sacas?', choice: [
				{ text: 'Abrir la jaula sin hacer ruido.', then: [
					{ text: 'El cierre cede con un clic. El guardia murmura algo en sueños («…la cláusula catorce…») y se da la vuelta.' },
					{ text: 'El Mareep sale de puntillas, si es que un Mareep puede ir de puntillas, y se pega a tus talones. Su cencerro dice: **CHISPITA**.' },
					{ rep: { lemnis: -2 } },
					{ happy: { who: 'riolu', n: 5 } },
					{ set: { 'flag.b01_mareep_jaula': true, 'flag.b01_mareep_noche': true, 'vars.mareep': '+1' } },
					{ if: 'done.b01_t_mareep', then: [{ call: 'b01_aurelio_chispita' }], else: [{ call: 'b01_mareep_check' }] },
				] },
				{ text: 'Mejor no. Todavía no.', then: [{ text: 'Te alejas despacio. El Mareep te sigue con la mirada hasta que la oscuridad los separa.' }] },
			] },
		],

		// =================== Mareep de Don Aurelio ===================
		b01_mareep_check: [
			{ toast: 'Mareep de Don Aurelio: 1 de 6', cond: 'vars.mareep == 1' },
			{ toast: 'Mareep de Don Aurelio: 2 de 6', cond: 'vars.mareep == 2' },
			{ toast: 'Mareep de Don Aurelio: 3 de 6', cond: 'vars.mareep == 3' },
			{ toast: 'Mareep de Don Aurelio: 4 de 6', cond: 'vars.mareep == 4' },
			{ toast: 'Mareep de Don Aurelio: 5 de 6', cond: 'vars.mareep == 5' },
			{ toast: 'Mareep de Don Aurelio: 6 de 6', cond: 'vars.mareep >= 6' },
			{ if: MAREEP_LISTO, then: [
				{ quest: 'b01_t_mareep', stage: 'volver' },
				{ say: 'rotom', text: '¡Bzzt! Recuento de ovejitas: ¡completo! Bueno, todo lo completo que se puede. ¡Volvamos con **Don Aurelio**, en la Ruta 5!' },
			] },
		],
		b01_mareep_copito: [
			{ take: 'lanamareep1' },
			{ text: 'Sigues los mechones enganchados en las ramas. Detrás del arbusto, hecho una bola, tiembla un **Mareep**. Al cuello lleva un cencerro con un nombre grabado: **COPITO**.' },
			{ text: 'Le enseñas la mano, despacio. {riolu} se sienta a tu lado, muy quieto, sin mirarlo a los ojos. Copito huele el aire, chisporrotea un poquito… y se te pega a los talones.' },
			{ set: { 'flag.b01_mareep_copito': true, 'vars.mareep': '+1' } },
			{ if: '!quest.b01_t_mareep', then: [{ say: 'rotom', text: '¡Bzzt! El cencerro dice «Rancho Prado · Ruta 42». ¡Eso es Johto! Alguien lo estará buscando. Nos sigue, así que… ¡ya tenemos mascota temporal!' }] },
			{ call: 'b01_mareep_check' },
		],
		b01_mareep_borla: [
			{ take: 'lanamareep2' },
			{ text: 'Debajo de la rampa grande, sentada sobre las patas traseras, una **Mareep** mira a los patinadores con la boca abierta. Cada vez que alguien hace un salto, la lana se le eriza y suelta una chispa.' },
			{ text: 'El cencerro dice **BORLA**. No quiere irse. Le gusta el espectáculo. Al final la convence {riolu}, que hace una voltereta delante de ella. Borla chisporrotea de emoción y se suma a la fila.' },
			{ say: 'rotom', text: '¡Bzzt! {riolu} acaba de inventar el pastoreo acrobático.', cond: 'inParty("riolu") || inParty("lucario")' },
			{ set: { 'flag.b01_mareep_borla': true, 'vars.mareep': '+1' } },
			{ call: 'b01_mareep_check' },
		],
		b01_mareep_nube: [
			{ take: 'lanamareep3' },
			{ text: 'Entre las flores más altas, tan blanca que parece parte del paisaje, duerme una **Mareep**. Ronca bajito. Cada ronquido es una chispita.' },
			{ text: 'El cencerro dice **NUBE**. La despiertas con cuidado. Bosteza, se estira y te sigue con la calma de quien no tenía ninguna prisa por ser rescatada.' },
			{ set: { 'flag.b01_mareep_nube': true, 'vars.mareep': '+1' } },
			{ say: 'rotom', text: '¡Bzzt! Ya somos un desfile. Un desfile que bala.', cond: 'vars.mareep >= 3' },
			{ call: 'b01_mareep_check' },
		],
		b01_mareep_candela: [
			{ take: 'lanamareep4' },
			{ text: 'Te agachas hacia la lucecita. Es una **Mareep**, acurrucada en una grieta. Está tan asustada de la oscuridad que la lana le brilla sola, como una vela: es la única luz del recodo.' },
			{ text: 'El cencerro dice **CANDELA**. Cuando {riolu} se acerca, la luz se le calma. Sale de la grieta y se queda pegada a él, alumbrándole los pies.' },
			{ set: { 'flag.b01_mareep_candela': true, 'vars.mareep': '+1' } },
			{ call: 'b01_mareep_check' },
		],
		b01_mareep_algodon: [
			{ take: 'lanamareep5' },
			{ text: 'En una cornisa del acantilado, a dos metros del vacío, hay una **Mareep** tan esponjada por la electricidad del viento que parece el doble de grande. No se atreve a moverse.' },
			{ text: 'Te tumbas en la roca, alargas el brazo y la agarras de la lana. Te da un calambre que te sube hasta los dientes. Pero la sacas.' },
			{ text: 'El cencerro dice **ALGODÓN**. Se sacude, suelta una nube de chispas y se coloca la última de la fila, como si siempre hubiera estado ahí.' },
			{ set: { 'flag.b01_mareep_algodon': true, 'vars.mareep': '+1' } },
			{ call: 'b01_mareep_check' },
		],

		// =================== Don Aurelio ===================
		b01_aurelio_1: [
			{ if: 'quest.b01_t_mareep', then: [{ call: 'b01_aurelio_recordar' }, { end: true }] },
			{ text: 'Bajo un árbol solitario, un anciano con sombrero de ala ancha y bigote blanco trenza una cuerda. A sus pies, un corral improvisado, vacío. Tiene un silbato colgado del cuello.' },
			{ say: 'aurelio', as: 'Ranchero', text: 'Buenas, muchach{o|a|e}. Perdone que no me levante. Las rodillas ya no me hacen caso, y yo a ellas tampoco.' },
			{ say: 'aurelio', text: 'Aurelio Prado, para servirle. Rancho Prado, Ruta 42, Johto. O eso era, hasta hace tres semanas.' },
			{ say: 'aurelio', text: 'Estaba yo arreando a mis Mareep al atardecer cuando se abrió el cielo. Así, como una tela que se rasga. Una luz morada. Y cuando me di cuenta, estaba aquí. En Kalos. Con el sombrero puesto, eso sí.' },
			{ say: 'aurelio', text: 'Seis Mareep venían conmigo. Al caer se me desperdigaron, asustados. Copito, Borla, Nube, Candela, Algodón… y Chispita, la más chica.' },
			{ if: 'flag.b01_mareep_jaula', then: [
				{ text: 'Chispita, la Mareep de la jaula, ve al anciano. Se queda congelada un segundo. Luego sale disparada y se le mete entre las piernas, balando y chisporroteando, y le hace saltar el sombrero.' },
				{ say: 'aurelio', text: '¡Chispita! ¡Mi niña! ¡Ay, que me electrocutas, condenada! ¡Ay, qué alegría!' },
				{ if: 'flag.b01_noa_favor || flag.b01_noa_tarjeta', then: [{ say: 'aurelio', text: '¿Estaba en una jaula de esos de traje azul? Vinieron a «recogerme» a mí también, ¿sabe? Les dije que yo no soy un Pokémon perdido. Me preguntaron si estaba seguro.' }] },
				{ if: 'flag.b01_mareep_forzado', then: [{ say: 'aurelio', text: '¿Su Riolu rompió una jaula de Lemnis? —Se ríe hasta toser—. Ese bicho tiene más agallas que muchos hombres que conozco.' }, { happy: { who: 'riolu', n: 5 } }] },
			] },
			{ if: 'flag.b01_mareep_lemnis', then: [
				{ say: 'aurelio', text: '¿No habrá visto a una Mareep chiquita, con el cencerro de «Chispita»? Es la más asustadiza. Si alguien la encerrara, se moriría de miedo.' },
				{ choice: [
					{ text: '«La tiene Lemnis. En una jaula, en el campamento de la ruta.»', then: [
						{ say: 'aurelio', text: '…¿En una jaula? —Se le aprieta la mandíbula bajo el bigote—. Esos me ofrecieron llevarme «a casa» a mí también. Les pregunté a qué casa. No supieron decirme.' },
						{ say: 'aurelio', text: 'Yo ya no estoy para pelear con nadie. Pero usted tiene buenas piernas. Y ese Riolu tiene buenos ojos. Piénselo.' },
					] },
					{ text: '«No la he visto.»', then: [{ say: 'aurelio', text: 'Ya aparecerá. Los Mareep siempre vuelven. Siempre.' }] },
				] },
			] },
			{ if: 'flag.b01_mareep_copito', then: [
				{ text: 'Copito, que te sigue desde hace un rato, reconoce el silbato. Se lanza contra Don Aurelio y le da un cabezazo cariñoso en la barriga.' },
				{ say: 'aurelio', text: '¡Copito! ¡Granuja! ¡Ya decía yo que olías a alguien conocido, muchach{o|a|e}!' },
			] },
			{ say: 'aurelio', text: 'Mire, yo con estas rodillas no llego ni a Vánitas. ¿Me haría el favor? Si ve a alguna de mis niñas, tráigamela. Llevan cencerro con su nombre. Los Mareep sin cencerro no son míos: la grieta trajo más de los que yo tenía.' },
			{ say: 'aurelio', text: 'Son miedosas: se esconden en la hierba alta y en los rincones. Tendrá que **buscar** bien. Van hacia donde sopla el viento, hacia la costa. Siempre fueron así.' },
			{ say: 'aurelio', text: 'Si me las trae, le haré un regalo. Algo que en mi rancho usábamos para las noches sin luna. Le va a hacer falta, si va hacia el oeste.' },
			{ quest: 'b01_t_mareep', stage: 'buscar' },
			{ call: 'b01_mareep_check' },
		],
		b01_aurelio_recordar: [
			{ say: 'aurelio', text: '¿Cómo va la búsqueda, muchach{o|a|e}?' },
			{ text: 'Llevas pocos Mareep. Don Aurelio los cuenta con los dedos y con el silbato.', cond: 'vars.mareep <= 2' },
			{ text: 'El corral empieza a llenarse. Don Aurelio silba bajito, contento.', cond: 'vars.mareep >= 3' },
			{ if: '!flag.b01_mareep_copito || !flag.b01_mareep_borla', then: [{ say: 'aurelio', text: 'Por esta misma ruta tiene que haber alguna todavía. Busque donde haya ramas para enganchar lana. O donde haya jaleo: a Borla le encanta el jaleo.' }] },
			{ if: '!flag.b01_mareep_nube', then: [{ say: 'aurelio', text: 'Nube es una dormilona. Si hay un sitio con flores altas y tranquilo, ahí estará. Por la ribera, digo yo.' }] },
			{ if: '!flag.b01_mareep_candela', then: [{ say: 'aurelio', text: 'Candela le tiene miedo a la oscuridad. Cuando tiene miedo, se ilumina. Si hay una cueva por ahí, búsquela por la lucecita.' }] },
			{ if: '!flag.b01_mareep_algodon', then: [{ say: 'aurelio', text: 'Algodón siempre se va hacia el mar. No sé por qué. Le gusta el viento salado. A mí me da reúma.' }] },
			{ if: 'flag.b01_mareep_lemnis && !flag.b01_mareep_jaula', then: [{ say: 'aurelio', text: 'Y Chispita… Bueno. Usted sabe dónde está. Yo no le digo nada. Pero de noche los guardias también duermen.' }] },
		],
		b01_aurelio_farol: [
			{ text: 'Los Mareep entran en el corral uno detrás de otro. Don Aurelio los va nombrando, y a cada nombre se le quiebra un poco más la voz.' },
			{ say: 'aurelio', text: 'Copito. Borla. Nube. Candela. Algodón…' },
			{ if: 'flag.b01_mareep_jaula', then: [
				{ say: 'aurelio', text: '…y Chispita. Las seis. Las seis, muchach{o|a|e}.' },
			], else: [
				{ say: 'aurelio', text: '…y Chispita, que la tienen los de traje azul. —Se queda mirando la ruta un rato—. Ya volverá. Los Mareep siempre vuelven.' },
			] },
			{ text: 'Don Aurelio se quita el sombrero, se seca los ojos con la manga y lo disimula fatal.' },
			{ say: 'aurelio', text: 'Esto es para usted. Cada una de mis niñas me ha dejado un mechón, mientras las abrazaba. Con la lana de un Mareep y un farol viejo se hace esto.' },
			{ cutscene: { bg: { type: 'ranch' }, start: 'dark', frames: [
				{ actors: [{ id: 'aurelio', at: 'left', enter: 'left' }], on: '_c', cam: 'push', item: 'farollana', text: 'Mete los mechones de lana en un farol de hojalata, lo cierra y lo frota contra la manga, una, dos, tres veces…' },
				{ actors: [{ key: 'aurelio', do: 'nod' }], on: '_c', fx: ['flash', 'sparkle'], text: '*Chss.* La lana se carga de estática. Una chispa diminuta salta dentro del farol.' },
				{ on: '_c', cam: 'pull', fx: 'light', text: 'Y el farol se enciende. Una luz amarilla, cálida, que no tiembla. La penumbra bajo el árbol se abre en círculo a su alrededor.' },
				{ actors: [{ key: 'aurelio', dim: true }, { mon: 'mareep', key: 'm1', at: 0.66, size: 's', enter: 'up', emote: '!' }, { mon: 'mareep', key: 'm2', at: 0.87, size: 's', enter: 'up', flip: true }], on: '_c', fx: 'glow', text: 'Los Mareep levantan la cabeza a la vez. Conocen esa luz.' },
			] } },
			{ give: 'farollana' },
			{ say: 'aurelio', text: 'El **Farol de Lana**. Alumbra lo que haga falta: cuevas, galerías, sótanos. En mi rancho lo usábamos para buscar a las que se perdían de noche. Ahora le toca a usted.' },
			{ quest: 'b01_t_mareep', done: true },
			{ text: 'Mientras hablan, una de las Mareep no ha vuelto al corral. **Candela** se ha sentado al lado de {riolu}, muy pegada, y no hay quien la mueva.' },
			{ say: 'aurelio', text: 'Mírela. Candela le tenía miedo a la oscuridad. Desde que la encontró usted, ya no brilla de miedo: brilla porque sí. —Se aclara la garganta—. ¿Se la quiere llevar? Ella ya ha elegido. Yo solo firmo.' },
			{ choice: [
				{ text: 'Llevarte a Candela.', then: [
					{ pokemon: { sp: 'mareep', lv: 15, level: 15, nick: 'Candela', nature: 'calm', ability: 'static', happy: 160 } },
					{ set: { 'flag.b01_candela_unida': true } },
					{ say: 'aurelio', text: 'Cuídemela. Y si algún día pasa por Johto, venga al rancho. Tengo un Ampharos que alumbra mejor que un faro. Le debo una visita, muchach{o|a|e}. Y yo pago mis deudas.' },
				] },
				{ text: '«Su sitio está con su rebaño.»', then: [
					{ say: 'aurelio', text: 'Tiene usted buen corazón. Candela también lo sabe. —Le rasca la cabeza a la Mareep—. Mire, tome esto en su lugar. Y si algún día pasa por Johto, venga al rancho. Tengo un Ampharos que alumbra mejor que un faro.' },
					{ give: 'rarecandy' },
				] },
			] },
			{ diary: 'Hoy devolvimos las ovejitas de Don Aurelio a su corral. ¡Qué contento se puso! Nos regaló un farol de lana que brilla con electricidad, calentito como una manta. Don Aurelio dice que en Johto tiene un Ampharos que alumbra como un faro. ¡Quiero verlo! ¡Bzzt!' },
		],
		b01_aurelio_despues: [
			{ say: 'aurelio', text: '¿Qué tal alumbra el farol? Frótelo de vez en cuando contra la manga, que la lana se cansa.' },
			{ if: 'flag.b01_candela_unida', then: [{ say: 'aurelio', text: '¿Y Candela? ¿Come bien? ¿Duerme con luz? Ay, no me haga caso. Los rancheros somos así.' }] },
			{ if: 'flag.b01_mareep_lemnis && !flag.b01_mareep_jaula', then: [{ say: 'aurelio', text: 'Chispita sigue con esos. Yo no le pido nada, ¿eh? Pero de noche… los guardias también duermen.' }] },
			{ say: 'aurelio', text: 'En cuanto sepa cómo volver a Johto, vuelvo. Aunque sea andando. Aunque sea por una de esas Puertas, Arceus me perdone.' },
		],
		b01_aurelio_chispita: [
			{ text: 'Llevas a Chispita hasta el corral de Don Aurelio, bajo el árbol. El anciano se despierta al oír el cencerro.' },
			{ say: 'aurelio', text: '…¿Chispita? ¿CHISPITA? ¡Ay, mi niña! ¡Ay, que me electrocutas! —Se ríe y llora a la vez—. Ya están todas. Ahora sí. Las seis.' },
			{ say: 'aurelio', text: 'No le voy a preguntar cómo la sacó. Mejor no saberlo. Tome. Era de mi padre. Para que se acuerde de un viejo agradecido.' },
			{ give: 'ppup' },
			{ set: { 'flag.b01_aurelio_seis': true } },
		],

		// =================== PUEBLO VÁNITAS ===================
		b01_llegada_vanitas: [
			{ text: 'Pueblo Vánitas te recibe con niebla, campanas lejanas y un gato negro que te mira desde un tejado como si llevara siglos esperándote. Seguramente no.' },
			{ say: 'rotom', text: '¡Bzzt! Pueblo Vánitas. Población: poca. Edad media: mucha. Castillos: uno. Fantasmas: datos insuficientes.' },
			{ if: 'quest.b01_m4 == "vanitas"', then: [{ say: 'rotom', text: 'Handsome dijo que siguiéramos el rastro hacia el oeste. Desde aquí, la **Ruta 7** baja hacia la costa. La **Ruta 6**, al norte, lleva a un palacio. ¡Un palacio!' }] },
		],
		b01_herbolaria: [
			{ text: 'Una mujer mayor, con gafas en la punta de la nariz y los dedos verdes de machacar hojas, ni levanta la vista del mortero.' },
			{ say: 'herbolaria', text: 'Polvo Curación, Raíz Energía, Hierba Revivir. Saben a demonios, pero funcionan. Como la verdad.' },
			{ say: 'herbolaria', text: 'Hace años pasó por aquí un caballero alquimista, un tal Sir Víctor, que me compró todas las raíces de la tienda. Decía que iba a hacer «una mezcla que no explota». Explotó. Me mandó una postal muy simpática desde el hospital.' },
			{ if: 'quest.b01_t_gaspar && !done.b01_t_gaspar', then: [{ say: 'herbolaria', text: '¿Bayas Meloc? Tengo. Un cocinero grandote me compró media docena hace unos días. Dijo que les faltaba valentía. A las bayas. Hay gente rara.' }] },
		],
		b01_simon_1: [
			{ text: 'Un hombre con auriculares enormes y cara de no creerse nada habla hacia una grabadora, junto al pozo.' },
			{ say: 'simon', as: 'Hombre de los auriculares', text: '…y por eso, queridos oyentes, no hay ningún conde inmortal. Hay un señor con buena genética y mucha crema hidratante. Fin del segmento.' },
			{ say: 'simon', as: 'Hombre de los auriculares', text: '¿Hm? ¿Tú qué miras? Ah, perdona. Simón. Productor de «**Casos Fríos de Teselia**». Hago la sección del escéptico. Alguien tiene que hacerla.' },
			{ say: 'simon', text: 'Me mandaron aquí a desmentir un rumor: que el Conde de este castillo no envejece. Tengo fotos de hace sesenta años. Es igual. Idéntico. Obviamente es su abuelo. O su nieto. O un señor que se parece.' },
			{ choice: [
				{ text: '«¿Y si no hay explicación racional?»', then: [{ say: 'simon', text: 'Siempre la hay. Si no la encuentras, es que no has buscado bien. O que el Conde te ha invitado a cenar y no te has atrevido a preguntar. Que es mi caso.' }] },
				{ text: '«Es su abuelo, seguro.»', then: [{ say: 'simon', text: '¡Gracias! Por fin alguien con sentido común. Lo pondré en el episodio: «Un testigo independiente confirma la teoría del abuelo».' }] },
				{ text: '«¿Por qué no se lo preguntas a él?»', then: [{ say: 'simon', text: 'Porque me ofreció una copa de algo rojo. Y yo soy escéptico, no imbécil.' }] },
			] },
			{ if: 'flag.b01_renata_1', then: [
				{ text: 'Le das el recado de Renata: que no se ha gastado todo el presupuesto en macarons.' },
				{ say: 'simon', text: '…Se lo ha gastado todo en macarons. —Se frota los ojos—. Gracias por avisar. Nota para el episodio: despedir a Renata. Otra vez. Ya van siete.' },
			] },
			{ set: { 'flag.b01_simon_1': true } },
		],
		b01_simon_generico: [
			{ say: 'simon', text: 'Sigo aquí. El Conde me ha invitado a cenar tres veces. He dicho que no tres veces. Mi récord personal de escepticismo.' },
		],
		b01_simon_2: [
			{ say: 'simon', text: '¿Has hablado con el Conde? ¿Y? ¿Te dijo su edad?' },
			{ text: 'Le cuentas que el Conde te dio una Poké Flauta «que le prestaron hace muchos años».' },
			{ say: 'simon', text: '¿«Hace muchos años»? Eso no es una cifra. Eso es una evasiva. —Apunta algo, lo tacha, lo vuelve a apuntar—. Lo dejo como «indeterminado». Indeterminado no es inmortal. Indeterminado es… indeterminado.' },
			{ say: 'simon', text: 'Me vuelvo a Teselia. Si oyes hablar de un rumor de legendarios, no se lo cuentes a Renata. Cuéntamelo a mí. Yo lo desmiento gratis.' },
		],

		// =================== CASTILLO CADUCO ===================
		b01_conde_1: [
			{ text: 'Junto a la chimenea apagada, un hombre altísimo y pálido, con capa negra forrada de rojo, se levanta de un sillón de terciopelo. Sonríe. Tiene unos colmillos espectaculares.' },
			{ say: 'conde', text: 'Bienvenid{o|a|e} a mi hogar. Entre libremente, y deje un poco de la felicidad que trae.' },
			{ say: 'conde', text: 'Vladimiro, Conde de Caduco. Señor de este castillo, de la niebla del pueblo y, desde hace tres semanas, del insomnio más espantoso de todo Kalos.' },
			{ say: 'conde', text: 'Desde que esa grieta se abrió en Luminalia, mis fantasmas no paran de cuchichear. Toda la noche. Que si el aire huele raro, que si la grieta, que si el Gastly del ala norte le ha robado la sábana al del ala sur…' },
			{ text: 'En algún lugar del pasillo, algo susurra «¡fue él!». Otra cosa susurra «¡mentira!».' },
			{ say: 'conde', text: 'Llevo… muchos años sin dormir bien. Y he llegado a una conclusión: necesito compañía. Pero no de los míos: los míos son unos chismosos.' },
			{ say: 'conde', text: 'Tráigame un Pokémon de tipo **Fantasma** o **Siniestro** que haya visto el mundo de fuera. Que tenga entrenador. Que me cuente cosas. Una noche de charla, nada más. No me lo quedo, ¡por favor! No soy un monstruo. Casi nunca.' },
			{ say: 'conde', text: 'A cambio le daré algo que me sobra. Y en este castillo me sobran muchas cosas. Tiempo, sobre todo.' },
			{ set: { 'flag.b01_conde_1': true } },
			{ quest: 'b01_s_conde', stage: 'fantasma' },
			{ if: FANTASMA_SINIESTRO, then: [
				{ say: 'conde', text: '…Un momento. Ya lo trae, ¿verdad? Lo huelo. Huele a noche y a camino. Qué delicia.' },
				{ call: 'b01_conde_flauta' },
			], else: [
				{ say: 'conde', text: 'Dicen que en mis sótanos hay Gastly. Si baja, atrapa a uno de MIS fantasmas y me lo trae a mí… —Se le iluminan los ojos rojos—. Qué descaro. Me encantaría.' },
			] },
		],
		b01_conde_recordar: [
			{ say: 'conde', text: '¿Todavía sin compañía para mí? Un Pokémon de tipo **Fantasma** o **Siniestro**, en su equipo. Los hay en mis sótanos, en la alameda del palacio y, dicen, entre la hierba de la Vía Repecho: unos pequeñajos con los pantalones caídos.' },
			{ say: 'conde', text: 'No tengo prisa. Nunca tengo prisa. Es una de las ventajas de… mi edad.' },
		],
		b01_conde_flauta: [
			{ say: 'conde', text: '¡Ah! ¡Por fin! Venga, venga, siéntese junto al fuego. No usted: él.' },
			{ text: 'El Conde y tu Pokémon se sientan frente a la chimenea, que se enciende sola. Hablan —o algo parecido— durante una hora larga. En algún momento el Conde se ríe tanto que se le cae un colmillo al suelo. Lo recoge muy rápido.' },
			{ say: 'conde', text: 'Nadie ha visto nada.' },
			{ say: 'conde', text: 'Gracias. Hacía un siglo… digo, una década… que no tenía una conversación tan buena. Su compañero tiene muy buen gusto. Y opiniones fortísimas sobre las Poké Balls.' },
			{ say: 'conde', text: 'Le prometí algo que me sobra. Aquí lo tiene: una **Poké Flauta**. Me la prestó hace muchos años el señor del Palacio Cénit, para ayudarme a dormir. No sirve para eso. Su música despierta a cualquier cosa que duerma. Incluso a un Snorlax.' },
			{ give: 'pokeflute' },
			{ quest: 'b01_s_conde', done: true },
			{ if: 'quest.b01_m4 == "snorlax"', then: [
				{ say: 'conde', text: '¿Un Snorlax en la ribera, dice? Tóquele la flauta al lado de la oreja. Y luego, por lo que más quiera, apártese.' },
			], else: [
				{ say: 'conde', text: 'Dicen que un Snorlax lleva días roncando en la **Ruta 7**. Si le molesta, ya sabe qué tocar.' },
			] },
			{ say: 'conde', text: 'Y vuelva en la víspera de Todos los Santos. Celebro una pequeña tradición. Con robo incluido. Es muy familiar.' },
			{ happy: { who: 'party0', n: 5 } },
		],
		b01_conde_generico: [
			{ say: 'conde', text: '¿Durmió bien? Yo tampoco. Pero ahora, al menos, me aburro con estilo.' },
			{ if: 'has("calabazaoro")', then: [{ say: 'conde', text: 'Veo que guarda mi Calabaza de Oro. Disfrútela. Los objetos, como las personas, solo están de paso. Salvo yo.' }] },
			{ if: 'flag.b01_snorlax', then: [{ say: 'conde', text: '¿Despertó al Snorlax? Lo oí desde aquí. Bostezó tan fuerte que se me apagaron las velas.' }] },
		],
		b01_castillo_retratos: [
			{ text: 'Retrato tras retrato, el mismo hombre: con armadura, con peluca empolvada, con un sombrero de copa en una exposición universal, con gafas de sol en un descapotable.' },
			{ text: 'En una esquina hay un retrato muy antiguo, casi negro de barniz. El Conde aparece de pie junto a un hombre gigantesco, con ropa de rey, que sostiene una flor en la mano. El hombre gigante no sonríe.' },
			{ say: 'rotom', text: '¡Bzzt! Análisis: el barniz tiene unos tres mil años. Eso es imposible. Error de lectura, seguro. Seguro.' },
		],

		// =================== PALACIO CÉNIT ===================
		b01_cenit_1: [
			{ text: 'Un señor con peluca empolvada, levita de terciopelo y una lupa colgada del cuello te recibe en la escalinata como si fueras la visita número un millón. Probablemente lo eres.' },
			{ say: 'dueno_cenit', text: '¡Bienvenid{o|a|e} al Palacio Cénit! Mi casa. Mi jardín. Lo diseñó mi tatarabuelo y lo mantengo yo. Bueno, lo mantienen catorce jardineros. Pero lo admiro yo, que es lo difícil.' },
			{ say: 'dueno_cenit', text: 'Hoy, sin embargo, es un día horrible. Horrible. Mi **Furfrou**, mi Princesa, se me ha escapado en el laberinto de setos. Con su corte Reina recién hecho. ¡Se le va a despeinar!' },
			{ say: 'dueno_cenit', text: 'Los jardineros no la encuentran. El mayordomo no la busca, porque «no está en su contrato». ¿Usted me haría el favor?' },
			{ say: 'dueno_cenit', text: 'Pistas: Princesa **odia la lavanda** y **adora las rosas**. **Nunca camina por la sombra**, por el pelo. Y lleva un **lacito rosa** en la oreja izquierda. Si la trae, le recompensaré como se merece un palacio.' },
			{ say: 'dueno_cenit', text: 'En otros tiempos le habría regalado una flauta mágica que teníamos en la familia. Pero se la presté al Conde de Caduco hace cuarenta años y nunca me la devolvió. Y el muy sinvergüenza sigue igual de joven.' },
			{ quest: 'b01_s_cenit', stage: 'buscar' },
		],
		b01_cenit_recordar: [
			{ say: 'dueno_cenit', text: '¿Princesa? ¿Nada? Recuerde: odia la lavanda, adora las rosas, nunca va por la sombra y lleva un lacito rosa en la oreja izquierda. ¡Es muy fácil! Para mí.' },
		],
		b01_cenit_laberinto: [
			{ text: 'Entras en el laberinto de setos. Los muros verdes te sacan dos cabezas. Huele a tierra mojada y a dinero.' },
			{ prompt: 'Primera bifurcación. A la izquierda, un seto florecido de **lavanda**. A la derecha, uno de **rosas** rojas.', choice: [
				{ text: 'Izquierda (lavanda).', then: [{ call: 'b01_cenit_perdido' }] },
				{ text: 'Derecha (rosas).', then: [
					{ prompt: 'Segunda bifurcación. Un sendero fresco bajo los **tilos**, a la sombra. Otro al **sol**, junto a una fuente pequeña.', choice: [
						{ text: 'El sendero de los tilos (sombra).', then: [{ call: 'b01_cenit_perdido' }] },
						{ text: 'El sendero al sol.', then: [
							{ text: 'Al final del sendero hay un templete con tres arcos. Bajo cada uno, un rastro de pelo blanco y rizado enganchado en el seto.' },
							{ prompt: '¿Por qué arco entras?', choice: [
								{ text: 'El que tiene un hilo azul enredado en el pelo.', then: [{ call: 'b01_cenit_perdido' }] },
								{ text: 'El que tiene un hilo rosa enredado en el pelo.', then: [
									{ text: 'Detrás del arco, sobre un cojín de pétalos de rosa que nadie sabe quién ha puesto, duerme al sol una **Furfrou** con corte Reina y un lacito rosa en la oreja izquierda. Está despeinadísima. Y feliz.' },
									{ text: 'Princesa abre un ojo, te mira de arriba abajo, decide que eres aceptable y se levanta con toda la dignidad de una reina. Te sigue.' },
									{ set: { 'flag.b01_cenit_furfrou': true } },
									{ toast: 'Lleva a Princesa con el dueño del palacio.' },
								] },
								{ text: 'El que no tiene ningún hilo.', then: [{ call: 'b01_cenit_perdido' }] },
							] },
						] },
					] },
				] },
			] },
		],
		b01_cenit_perdido: [
			{ text: 'Giras, giras otra vez, y acabas… en la entrada del laberinto. Un Sentret te mira desde lo alto de un seto. Juraría que se está riendo.' },
			{ text: 'Repasas lo que dijo el dueño. Lavanda, rosas, sombra, lacito…' },
		],
		b01_cenit_entrega: [
			{ text: 'Princesa sube la escalinata delante de ti, despacio, como en un desfile.' },
			{ say: 'dueno_cenit', text: '¡PRINCESA! ¡Mi reina! ¡Mi corte Reina! ¡Mírate el pelo, qué desastre! ¡Qué precioso desastre!' },
			{ say: 'dueno_cenit', text: 'Gracias, gracias. Es usted dign{o|a|e} de mi jardín. Tome: una **Maxipepita**. Y una foto conmigo. Las dos cosas valen mucho; la foto, más.' },
			{ give: 'bignugget' },
			{ say: 'rotom', text: '¡Bzzt! ¡Foto! ¡Sonrían! …El señor sale con los ojos cerrados. Otra. …Princesa sale con los ojos cerrados. Otra. ¡Bzzt! Perfecta. Bueno, aceptable.' },
			{ quest: 'b01_s_cenit', done: true },
		],
		b01_cenit_despues: [
			{ say: 'dueno_cenit', text: 'Princesa está en la peluquería. Otra vez. Usted siempre será bienvenid{o|a|e} en mi palacio. Siempre que se limpie los zapatos.' },
		],
		b01_mayordomo: [
			{ say: 'mayordomo_cenit', text: 'Buenas tardes. Gérard, mayordomo de la casa.' },
			{ say: 'mayordomo_cenit', text: '¿Quiere usted un combate conmigo?' },
			{ choice: [
				{ text: 'Sí.', then: [
					{ say: 'mayordomo_cenit', text: 'Lo sabía. Todo el mundo quiere, cuando se lo pregunto así.' },
					{ battle: 'mayordomo_cenit', lose: 'continue', onWin: [{ say: 'mayordomo_cenit', text: 'Excelente. Le traeré un té. ¿Quiere usted un té? …Lo sabía.' }, { heal: 'Gérard te sirve un té. Tu equipo descansa mientras te lo bebes.' }], onLose: [{ say: 'mayordomo_cenit', text: 'Le traeré un té. Lo necesita.' }, { heal: true, silent: true }] },
				] },
				{ text: 'No, gracias.', then: [{ say: 'mayordomo_cenit', text: 'Curioso. Casi nadie dice que no. Volveré a preguntárselo.' }] },
			] },
		],
		b01_mayordomo_despues: [
			{ say: 'mayordomo_cenit', text: '¿Quiere usted un té? Por supuesto que quiere.' },
			{ heal: 'Gérard te sirve un té perfecto. Tu equipo descansa mientras te lo bebes.' },
		],
		b01_cenit_colmenas: [
			{ text: 'Detrás de los rosales hay tres colmenas de madera pintadas de blanco, con el escudo del palacio. Los Combee entran y salen, muy ordenados, como funcionarios.' },
			{ text: 'Un jardinero con careta de apicultor te ve mirar.' },
			{ say: null, text: '«¿Miel? Llévese un tarro. Este año hay de sobra: desde lo de la Puerta, los Combee trabajan el doble. Nadie sabe por qué. Ellos tampoco».' },
			{ give: 'honey' },
			{ set: { 'flag.b01_cenit_miel': true } },
		],
		b01_cenit_fuente: [
			{ text: 'Una fuente monumental con un Gyarados de bronce escupiendo agua hacia el cielo. En el fondo brillan cientos de monedas.' },
			{ if: 'flag.b01_snorlax', then: [{ text: 'Alguien ha dejado en el borde una flor y una nota: «Para el Snorlax de la ribera. Que duermas bien, gordo». Parece la letra del Conde.' }] },
			{ say: 'rotom', text: '¡Bzzt! Si contamos las monedas del fondo, el dueño del palacio podría comprarse… otro palacio. Pequeño.' },
		],

		// =================== RUTA 7: Gaspar ===================
		b01_gaspar_r7_intro: [
			{ text: 'Un hombre corpulento con pañuelo en la cabeza y delantal blanco remueve una olla enorme en la orilla. Prueba con una cuchara de madera. Frunce el ceño. Añade una pizca de algo. Sonríe.' },
			{ say: 'gaspar', as: 'Chef', text: 'Perfecto. Ahora sí tiene valentía.' },
			{ say: 'gaspar', text: 'Gaspar Rocafort. Cocino por el camino, con lo que el camino me da. Comer bien es la mitad de la aventura.' },
			{ say: 'gaspar', text: 'Estoy preparando un **Menú de Kalos** para mi recetario. Me faltan tres cosas: **Miel**, una **Miniseta** y una **Baya Meloc**. Si me las traes, comemos juntos. Invito yo.' },
			{ set: { 'flag.b01_gaspar_1': true } },
			{ quest: 'b01_t_gaspar', stage: 'ruta7' },
			{ call: 'b01_gaspar_r7_pistas' },
		],
		b01_gaspar_r7_falta: [
			{ say: 'gaspar', text: '¡Hombre, {jugador}! Siéntate, que el fuego no muerde. Bueno, sí muerde. Pero con cariño.' },
			{ quest: 'b01_t_gaspar', stage: 'ruta7', cond: 'quest.b01_t_gaspar != "ruta7"' },
			{ if: 'has("honey") || has("tinymushroom") || has("pechaberry")', then: [{ say: 'gaspar', text: 'Veo que traes algo. Pero un menú a medias es como un combate a medias: nadie se queda contento.' }] },
			{ call: 'b01_gaspar_r7_pistas' },
			{ if: 'flag.b01_snorlax', else: [{ say: 'gaspar', text: 'Ese Snorlax de ahí delante lleva tres días roncando. Le dejé un plato al lado. Ni se inmutó. Es la primera vez que alguien rechaza mi comida. Me ha dolido.' }] },
		],
		b01_gaspar_r7_pistas: [
			{ say: 'gaspar', text: 'Me falta **Miel**. Los Combee de la Ruta 4 la hacen buena. Y dicen que en los jardines del Palacio Cénit hay colmenas.', cond: '!has("honey")' },
			{ say: 'gaspar', text: 'Me falta una **Miniseta**. Crecen a la sombra, entre la hierba húmeda. Aquí mismo, en la ribera, entre las flores amarillas. O bajo los setos de la alameda del palacio.', cond: '!has("tinymushroom")' },
			{ say: 'gaspar', text: 'Me falta una **Baya Meloc**. En el herbolario de Vánitas las venden. Les falta valentía, pero cocinadas mejoran.', cond: '!has("pechaberry")' },
		],
		b01_gaspar_cocina: [
			{ say: 'gaspar', text: '¡Miel, Miniseta y Baya Meloc! ¡Lo tienes todo! Siéntate. Siéntate y no toques nada.' },
			{ if: GASPAR_TODO, then: [
				{ take: 'honey' }, { take: 'tinymushroom' }, { take: 'pechaberry' },
			], else: [
				{ say: 'gaspar', text: '…Un momento. Aquí falta algo. Sin los tres ingredientes no hay plato. Vuelve cuando lo tengas todo, que la olla no se va a ningún lado.' },
				{ end: true },
			] },
			{ text: 'Gaspar trabaja como si bailara. La seta, a la plancha con mantequilla. La baya, reducida con un chorro de agua del río hasta que se vuelve almíbar. La miel, al final, en hilo fino, «para que se entere de que es Kalos».' },
			{ text: 'El olor atrae a medio río: tus Pokémon salen de sus Poké Balls sin que nadie los llame, un Croagunk se asoma entre las cañas y dos Ducklett aterrizan en la orilla con cara de inocentes.' },
			{ say: 'gaspar', text: 'Regla de oro de la cocina de camino: primero, dieta equilibrada. Segundo, que coma todo el grupo. Tercero, no preguntar qué hay en la olla si no quieres saberlo.' },
			{ choice: [
				{ cond: 'flag.b01_gaspar_cafe', text: '«¿Qué cocinaste en aquella mazmorra de Teselia?»', then: [
					{ say: 'gaspar', text: '…' },
					{ say: 'gaspar', text: 'Estaba bueno. Eso es todo lo que voy a decir. Estaba muy bueno.' },
				] },
				{ text: 'Comer en silencio.', then: [{ say: 'gaspar', text: 'Eso. Eso es el mejor cumplido que existe. Que nadie hable.' }] },
				{ text: '«Le falta valentía.»', then: [
					{ text: 'Gaspar se queda inmóvil con el cucharón en el aire. Te mira. Prueba el plato. Vuelve a probarlo.' },
					{ say: 'gaspar', text: '…Tienes razón. Una pizca de pimienta. —Se la echa—. ¡Ahora sí! Tú tienes paladar, {jugador}. Eso no se enseña.' },
				] },
			] },
			{ happy: { who: 'riolu', n: 10 } },
			{ say: 'gaspar', text: 'Toma, para el camino. Dos raciones del **Menú de Kalos**: cuando lo compartas con tu equipo, se van a querer un poco más. Y un **Caramelo Raro**, que me lo dieron en una mazmorra y no sé qué hacer con él.' },
			{ give: 'menukalos', n: 2 },
			{ give: 'rarecandy' },
			{ quest: 'b01_t_gaspar', done: true },
			{ say: 'gaspar', text: 'Mi recetario sigue. Kalos ya está. Me han hablado de unos dulces de Ciudad Iris, en Johto, que dicen que hacen llorar. Quiero comprobarlo. Si pasas por allí, búscame en la cocina más cercana.' },
		],
		b01_gaspar_r7_despues: [
			{ say: 'gaspar', text: 'Sigo aquí unos días más. El río me inspira. ¿Te queda Menú de Kalos? Compártelo, que es para eso. La comida que no se comparte se enfría más rápido.' },
		],

		// =================== RUTA 7: Snorlax ===================
		b01_r7_snorlax_ve: [
			{ text: 'Un muro de pelo azul oscuro y barriga color crema bloquea el paseo, entre el río y el talud. Sube. Baja. Ronca. Es un **Snorlax**, y tiene flores en la barriga que le han puesto los niños.' },
			{ say: 'rotom', text: '¡Bzzt! Peso estimado: cuatrocientos sesenta kilos. Probabilidad de moverlo empujando: cero coma cero. Probabilidad de que nos aplaste si se da la vuelta: no quiero calcularla.' },
			{ if: '!has("pokeflute")', then: [
				{ quest: 'b01_m4', stage: 'snorlax' },
				{ say: 'rotom', text: 'Para despertar a un Snorlax hace falta música. ¡Mucha música! Quizá alguien en **Pueblo Vánitas** tenga algo.' },
			] },
		],
		b01_r7_snorlax: [
			{ if: '!has("pokeflute")', then: [
				{ text: 'Le das unos golpecitos en la barriga. Rebotan. Le gritas al oído. Ronca más fuerte. {riolu} le hace cosquillas en un pie. Snorlax sonríe en sueños y sigue durmiendo.' },
				{ say: 'rotom', text: '¡Bzzt! Necesitamos música. O un terremoto. Prefiero la música.' },
				{ end: true },
			] },
			{ call: 'b01_r7_snorlax_flauta' },
		],
		b01_r7_snorlax_flauta: [
			{ text: 'Te acercas a la oreja de Snorlax y tocas la **Poké Flauta**. La melodía es suave, rara, como de otro tiempo. Los Volbeat del río se ponen a brillar al compás.' },
			{ text: 'Snorlax abre un ojo. Luego el otro. Bosteza tan fuerte que se te vuela el pelo. Se incorpora, te mira… y decide que tiene hambre. Y que tú pareces tener comida.' },
			{ wild: { sp: 'snorlax', lv: 18, moves: ['yawn', 'bite', 'lick', 'defensecurl'] }, lose: 'continue',
				onCatch: [{ text: '¡Snorlax se ha unido a tu equipo! Rotom calcula que van a necesitar una mochila más grande. Para la comida.' }, { set: { 'flag.b01_snorlax_atrapado': true } }],
				onWin: [{ text: 'Snorlax se rinde, se rasca la barriga y se aleja rodando hacia el río, donde se queda flotando boca arriba como una isla.' }],
				onRun: [{ text: 'Te apartas. Snorlax se encoge de hombros, si es que tiene hombros, y se va despacio río abajo, olisqueando el aire en busca de la olla de Gaspar.' }],
				onLose: [{ text: 'Snorlax, satisfecho de haberos aplastado un poco, bosteza, se da la vuelta y se va rodando hacia el río. El camino queda libre.' }] },
			{ set: { 'flag.b01_snorlax': true } },
			{ quest: 'b01_m4', stage: 'gruta' },
			{ diary: '¡Hoy despertamos a un Snorlax con una flauta! Era enorme, como una montaña que ronca. El Conde dice que la flauta era del señor del palacio. Yo creo que el Conde no devuelve las cosas. ¡Bzzt! El camino a la gruta ya está libre.' },
		],

		// =================== GRUTA TIERRAUNIDA ===================
		b01_gruta_honda: [
			{ if: 'flag.b01_gruta_honda', then: [
				{ text: 'Bajas otra vez a la Galería Honda. Los dibujos de la pared siguen ahí, quietos, mirando. Ya no queda nada que encontrar. Solo el eco.' },
				{ end: true },
			] },
			{ if: '!(' + LUZ + ')', then: [
				{ text: 'Das dos pasos rampa abajo y la oscuridad se vuelve absoluta. No ves tus manos. No ves a {riolu}, aunque lo notas pegado a tu pierna.' },
				{ say: 'rotom', text: '¡Bzzt! Mi pantalla no alumbra tanto. Activo modo linterna… Ah. No tengo modo linterna. Lo siento.' },
				{ say: 'rotom', text: 'Don Aurelio habló de un farol para las noches sin luna. ¡Y Handsome siempre lleva una linterna en la gabardina!', cond: 'quest.b01_t_mareep' },
				{ text: 'Subes de vuelta al pasillo principal, donde el cristal da luz.' },
				{ end: true },
			] },
			{ if: 'has("farollana")', then: [
				{ cutscene: { bg: { type: 'cave', crystals: '#7fd6e0' }, start: 'dark', frames: [
					{ cam: 'still', text: 'Negro. Tan negro que la rampa parece no tener fondo.' },
					{ cam: 'push', item: 'farollana', fx: 'glow', text: 'Sacas el Farol de Lana y lo frotas contra la manga, como hacía Don Aurelio.' },
					{ cam: 'pan-down', fx: 'light', clear: true, text: 'La luz amarilla baja por la rampa delante de ti… y la galería aparece entera.' },
				] } },
			] },
			{ text: 'Enciendes la linterna y bajas por la rampa.', cond: '!has("farollana")' },
			{ text: 'La galería se abre de repente en una cámara enorme, mucho más grande de lo que parecía desde arriba.' },
			{ say: 'rotom', text: '¡Bzzt! ¡Es más grande por dentro!' },
			{ text: 'Las paredes están cubiertas de **dibujos tallados**, muy antiguos. Figuras pequeñas con lanzas. Un árbol con alas. Un pájaro enorme con las alas abiertas sobre gente tumbada en el suelo.' },
			{ text: 'Y, en el centro, el dibujo más grande: un hombre altísimo con una flor diminuta en la mano, de pie frente a una máquina con forma de flor gigante. De la máquina salen rayos. Debajo de los rayos, decenas de Pokémon tumbados.' },
			{ if: 'inParty("riolu") || inParty("lucario")', then: [{ text: '{riolu} apoya la palma en la piedra, justo debajo de la máquina. Cierra los ojos. Cuando los abre, tiene las orejas gachas.' }] },
			{ say: 'rotom', text: '¡Bzzt! Registro las imágenes… Datos insuficientes para interpretarlas. Qué raro. Parece una advertencia.' },
			{ set: { 'flag.b01_gruta_dibujos': true } },
			{ text: 'Algo se mueve en el fondo de la cámara. Unos colmillos brillan a la luz del farol.' },
			{ wild: { sp: 'axew', lv: 17 } },
			{ text: 'Donde estaba el Axew, entre huesos de pescado y restos de piedras mordidas, hay cosas que alguien perdió hace mucho.' },
			{ give: 'dragonfang' },
			{ give: 'hpup' },
			{ set: { 'flag.b01_gruta_honda': true } },
		],

		// =================== RUTA 8 ===================
		b01_r8_llegada: [
			{ text: 'Sales de la gruta a lo alto de un acantilado. El viento te da en la cara como una bofetada salada.' },
			{ text: 'Miras atrás un momento. En la boca de la gruta, justo por donde acabas de salir, aparecen dos técnicos con mono azul y un escáner de mano. La lemniscata en la espalda. Uno señala el suelo. El otro asiente y apunta algo.' },
			{ text: 'No te han visto. O hacen como que no.' },
			{ quest: 'b01_m4', stage: 'petroglifo' },
		],
		b01_r8_tobias: [
			{ text: 'Un chico con chaqueta verde y amarilla habla con entusiasmo hacia un móvil sobre un trípode. A su lado, sentada sobre una roca como sobre un trono, una **Persian** con un collar de pedrería mira el mar con infinito desprecio.' },
			{ say: 'tobias', as: 'Chico del trípode', text: '¡Patrocinadores, gracias por las Pociones! ¡Episodio cuarenta y siete: la costa! Hoy, Duquesa y yo exploramos la temible Muralla Costera, donde…' },
			{ text: 'La Persian gira la cabeza hacia ti. Te mira de arriba abajo, muy despacio. Luego bosteza. Es el bostezo más ofensivo que has visto en tu vida.' },
			{ say: 'tobias', as: 'Chico del trípode', text: '¡Un momento! ¡Giro de guion! ¡{Un|Una|Une} aventurer{o|a|e} salvaje aparece! —Te enfoca con el móvil—. ¡Saluda a la audiencia! ¡Hay como… doce personas mirando! ¡Doce!' },
			{ say: 'tobias', text: 'Tobías Quiroga. Y ella es **Duquesa**. La verdadera estrella. Yo solo llevo la cámara y las bolsas. Y las Pociones. Y el champú de Duquesa.' },
			{ say: 'tobias', text: 'Los patrocinadores quieren acción. ¡Y la acción eres tú! ¿Combate? ¡Di que sí! Los combates suben los números.' },
			{ choice: [
				{ text: '«Primero curo a mi equipo.»', then: [
					{ say: 'tobias', text: '¡Pausa publicitaria! ¡Este momento de recuperación se lo traen nuestros patrocinadores!' },
					{ heal: 'Tobías te lanza un puñado de Pociones «cortesía de los patrocinadores». Duquesa mira cómo curas a tu equipo con cara de estar pagándolas ella.' },
				] },
				{ text: '«Así como estoy. ¡Acción!»', then: [
					{ say: 'tobias', text: '¡Sin cortes! ¡Directo y sin red! ¡Eso a la audiencia le encanta!' },
				] },
			] },
			{ battle: 'tobias_1', lose: 'continue',
				onWin: [{ say: 'tobias', text: '¡Increíble! ¡Perdimos! ¡En directo! ¡Los comentarios están ardiendo! …Un comentario. Dice «jajaja». Pero ARDE.' }],
				onLose: [{ say: 'tobias', text: '¡Victoria! ¡Duquesa, mira, ganamos! …Duquesa no mira. Duquesa nunca mira. Es parte de su encanto.' }] },
			{ heal: true, silent: true },
			{ say: 'tobias', text: 'Oye, me caes bien. Te cuento un secreto de producción: el próximo episodio es en la **Cueva Brillante**, al norte, pasado el Paso de Rhyhorn. ¡La mazmorra de esta temporada! Paredes que brillan, Pokémon fósiles… ¡los números se van a disparar!' },
			{ text: 'Duquesa te dedica una última mirada. Si los Persian pudieran escupir, lo habría hecho.' },
			{ quest: 'b01_t_tobias', stage: 'cueva' },
			{ intel: { npc: 'tobias', text: 'Narra su vida como un reality para «los patrocinadores». Duquesa, su Persian, desprecia a todo el mundo menos a él. Bueno, también a él, pero menos.' } },
		],

		// =================== PUEBLO PETROGLIFO ===================
		b01_llegada_petroglifo: [
			{ text: 'Pueblo Petroglifo huele a sal, a red mojada y a pescado frito. Las gaviotas compiten con los Wingull por los restos del muelle. Ganan los Wingull.' },
			{ quest: 'b01_m4', done: true },
			{ quest: 'b01_m5', stage: 'paso' },
			{ say: 'rotom', text: '¡Bzzt! Llegamos a la costa oeste. Siguiente parada: el **Paso de Rhyhorn**, al norte, y la **Cueva Brillante**. Dicen que unos «trajes rojos» rondan por aquí. Anoto: trajes rojos. Subrayado.' },
		],
		b01_lazare_1: [
			{ text: 'Un hombre de pelo blanco y rizado, con gafas gruesas y una bata con quemaduras en las mangas, se gira con una lupa en una mano y un hueso en la otra.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Una visita! ¡Por fin alguien que no viene a preguntar por los baños! Lazare. Doctor Lazare. Paleontólogo, restaurador de fósiles y, los martes, socorrista del puerto.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Esta máquina devuelve la vida a Pokémon que llevan millones de años convertidos en piedra. Funciona con una probabilidad de éxito del cien por cien. Bueno. Del noventa y ocho. Pero redondeo hacia arriba, por optimismo.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Qué día llevo, por cierto. Hace diez minutos se fueron dos técnicos de Lemnis. Me preguntaron si había pasado por aquí un entrenador con un Riolu.' },
			{ text: 'El doctor mira a {riolu}. Te mira a ti. Vuelve a mirar a {riolu}.', cond: 'inParty("riolu") || inParty("lucario")' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '…Les dije que no. Era verdad, en ese momento. Ahora ya no lo es. Qué cosas.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Y no son los únicos raros. La semana pasada vinieron unos tipos con **trajes rojos** de diseño y gafas de sol. Querían saber si mi máquina podía «restaurar» otra cosa. No un fósil. Un **mecanismo**. Muy antiguo. «De la época de los reyes», dijeron.' },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Les dije que yo restauro Pokémon, no tostadoras. No les hizo gracia. A mí sí.' },
			{ choice: [
				{ text: '«¿Adónde fueron los trajes rojos?»', then: [{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Al norte, hacia la **Cueva Brillante**. Allí hay fósiles de verdad: Fósil Mandíbula y Fósil Aleta. Y cristales que brillan solos. Si llegan antes que nadie… —Se encoge de hombros—. Adiós, patrimonio.' }] },
				{ text: '«¿Qué tipo de mecanismo?»', then: [{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Me enseñaron un dibujo. Una flor de metal enorme. Me recordó a los petroglifos de la playa. Y a una pesadilla que tuve de niño. No les dije ninguna de las dos cosas.' }] },
			] },
			{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: 'Si vas a la Cueva Brillante y encuentras un fósil, tráemelo. O mejor: no te muevas, que ya iré yo a buscarte. Tengo buenas piernas. Los martes, de socorrista.' },
			{ set: { 'flag.b01_lazare_1': true } },
			{ quest: 'b01_m5', stage: 'paso', silent: true, cond: '!quest.b01_m5' },
		],
		b01_lazare_generico: [
			{ cond: 'has("domefossil") || has("helixfossil") || has("oldamber") || has("jawfossil") || has("sailfossil")', say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¡Huelo a fósil desde aquí! Pase, pase: el Restaurador está encendido. Hablemos ahí.' },
			{ cond: '!(has("domefossil") || has("helixfossil") || has("oldamber") || has("jawfossil") || has("sailfossil"))', say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '¿Algún fósil? ¿No? Paciencia. Los fósiles llevan millones de años esperando. Pueden esperar a que termines tu Circuito.' },
			{ if: 'flag.b01_gruta_dibujos', then: [
				{ text: 'Le describes los dibujos de la Galería Honda: el hombre altísimo, la flor diminuta, la máquina.' },
				{ say: 'cientifico_fosiles', as: 'Dr. Lazare', text: '…¿En la Gruta Tierraunida? ¿El mismo dibujo que me enseñaron los trajes rojos? —Se quita las gafas, las limpia, se las vuelve a poner—. No me gusta. No me gusta nada. Y a mí me gustan los huesos.' },
				{ set: { 'flag.b01_lazare_dibujos': true } },
			] },
		],
		b01_lab_vitrinas: [
			{ text: 'Fósil Hélix, Fósil Domo, Ámbar Viejo… y dos huecos vacíos con etiqueta: «Fósil Mandíbula (Cueva Brillante)» y «Fósil Aleta (Cueva Brillante)». Debajo, a boli: «PENDIENTE. Que no se los lleven los de rojo».' },
		],
		b01_petroglifos: [
			{ text: 'En las rocas lisas de la playa hay figuras talladas, gastadas por el mar: soles, peces, gente con los brazos en alto. Un árbol con alas. Un pájaro enorme.' },
			{ if: 'flag.b01_gruta_dibujos', then: [{ text: 'En una roca apartada reconoces la silueta de la Galería Honda: un hombre muy alto con una flor diminuta. Aquí no hay máquina. Solo el hombre, solo, mirando al mar.' }] },
			{ if: 'inParty("riolu") || inParty("lucario")', then: [{ text: '{riolu} recorre las figuras con la punta de los dedos, como si las leyera. Se detiene en algunas. En otras, no.' }] },
			{ say: 'rotom', text: '¡Bzzt! Nadie ha conseguido descifrarlas. Dicen que hace falta alguien que lea piedras. ¿Eso existe? ¿Es un trabajo?' },
		],
		b01_jinetes_rhyhorn: [
			{ text: 'Junto a un abrevadero, tres jinetes cepillan a sus Rhyhorn. Los Rhyhorn se dejan con los ojos cerrados, como grandes perros de piedra.' },
			{ if: 'flag.mount_rhyhorn', then: [
				{ say: 'jinete_rhyhorn', text: '¡Buen Rhyhorn tienes! Se nota que lo montas con cariño. ¿Una carrera hasta el Paso? Otro día. Hoy los nuestros están de mal humor: les han cambiado el pienso.' },
				{ say: 'jinete_rhyhorn', text: 'El **Paso de Rhyhorn** empieza ahí, al norte. Rocas afiladas como cuchillos. Sin montura no se cruza. Contigo no hay problema.' },
			], else: [
				{ say: 'jinete_rhyhorn', text: '¿Vas al **Paso de Rhyhorn**? ¿A pie? —Se ríe—. Las rocas de ahí arriba te comen las botas en diez minutos. Y los tobillos en quince.' },
				{ say: 'jinete_rhyhorn', text: 'Mira, toma a Roca. Es el más tranquilo del establo. Te lo presto para el paso, y para lo que necesites mientras andes por la región. Ya me lo devolverás. O no. Roca elige con quién se queda.' },
				{ text: 'Roca, el Rhyhorn, te huele, resopla, y se agacha para que subas. Pesa como un coche y es suave como un sofá.' },
				{ set: { 'flag.mount_rhyhorn': true, 'vars.mount': 'rhyhorn' } },
				{ toast: '¡Montura Rhyhorn! Avanzas dos tramos por paso y hay menos encuentros.' },
				{ set: { 'flag.b01_rhyhorn_prestado': true } },
			] },
		],
		b01_acuario_1: [
			{ text: 'Una mujer con botas de agua y el pelo recogido con un lápiz pega etiquetas en un panel vacío titulado «**Vecinos de la Muralla**».' },
			{ say: 'conservadora', text: '¡Hola! Bienvenid{o|a|e} al acuario. Es pequeño, pero el Wailmer no lo sabe y somos felices así.' },
			{ say: 'conservadora', text: 'Estoy montando un panel sobre los Pokémon de la **Ruta 8**, pero no tengo ni una foto. Mi cámara se la comió un Inkay. Literalmente.' },
			{ say: 'conservadora', text: '¿Me ayudas? Necesito que tu Pokédex registre a tres vecinos de la Muralla: **Inkay**, **Binacle** y **Wingull**. Los Binacle viven en las rocas; los otros, entre la hierba del acantilado.' },
			{ quest: 'b01_s_acuario', stage: 'fotos' },
			{ if: 'seen("inkay") && seen("binacle") && seen("wingull")', then: [{ say: 'conservadora', text: '¿Cómo? ¿Ya los tienes registrados? ¡Déjame ver!' }, { call: 'b01_acuario_entrega' }] },
		],
		b01_acuario_recordar: [
			{ say: 'conservadora', text: 'Me faltan fotos de **Inkay**, **Binacle** y **Wingull**, de la Ruta 8. Los Binacle están en las rocas: busca en los tramos pedregosos.' },
		],
		b01_acuario_entrega: [
			{ say: 'rotom', text: '¡Bzzt! Proyectando imágenes: Inkay, Binacle, Wingull. ¡Con mi mejor ángulo!' },
			{ say: 'conservadora', text: '¡Son perfectas! Bueno, el Wingull sale de espaldas. Pero es un Wingull de espaldas con mucha personalidad.' },
			{ say: 'conservadora', text: 'Toma, por las molestias. Agua Mística: un Pokémon de tipo Agua que la lleve pega más fuerte. Y unas Red Ball, por si te enamoras de algún vecino de la Muralla.' },
			{ give: 'mysticwater' },
			{ give: 'netball', n: 3 },
			{ quest: 'b01_s_acuario', done: true },
		],
		b01_acuario_despues: [
			{ say: 'conservadora', text: 'El panel ha quedado precioso. La gente se para a mirarlo. Sobre todo al Wingull de espaldas. Es el favorito.' },
		],
		b01_acuario_tunel: [
			{ text: 'Caminas por el túnel de cristal. Sobre tu cabeza pasan Luvdisc en parejas, un banco de Finneon y el Wailmer, que se detiene encima de ti y te mira con un ojo enorme y amable.' },
			{ text: 'En una esquina de la pecera, un cartel pequeño: «Este Finneon llegó por una Fisura. Es de Sinnoh. No sabemos cómo devolverlo. De momento, es nuestro invitado».' },
		],
	},

	// =================================================================
	npcs: {
		herbolaria: { name: 'Herbolaria', generic: true, look: { hair: 'bun', hairColor: '#cfd6e2', outfit: '#5aa36b', outfit2: '#8a5a2f', skin: 2, acc: 'glasses', eyesStyle: 'sleepy', mouth: 'flat' } },
		dueno_cenit: { name: 'Dueño del palacio', generic: true, look: { hair: 'curly', hairColor: '#f3efe6', outfit: '#8c6cd0', outfit2: '#f2b33d', skin: 0, acc: 'mustache', eyesStyle: 'happy', mouth: 'open' } },
		mayordomo_cenit: { name: 'Gérard', title: 'Mayordomo del Palacio Cénit', generic: true, look: { hair: 'short', hairColor: '#2b2b38', outfit: '#1c1a2a', outfit2: '#ffffff', skin: 1, acc: 'tie', eyesStyle: 'sleepy', mouth: 'flat' } },
		jinete_rhyhorn: { name: 'Jinete de Rhyhorn', generic: true, look: { hair: 'tied', hairColor: '#5a3a26', outfit: '#c4473a', outfit2: '#8a5a2f', skin: 3, acc: 'goggles', mouth: 'grin' } },
		conservadora: { name: 'Conservadora del acuario', generic: true, look: { hair: 'tied', hairColor: '#e07a3a', outfit: '#3b6fa8', outfit2: '#f2b33d', skin: 1, acc: 'freckles', mouth: 'smile' } },
	},

	// =================================================================
	items: {
		lanamareep1: { name: 'Mechón de lana', pocket: 'key', desc: 'Lana de Mareep enganchada en una rama de la Vía Repecho. Todavía da calambre. Sigue el rastro.' },
		lanamareep2: { name: 'Mechón de lana', pocket: 'key', desc: 'Lana de Mareep pegada a la barandilla de una rampa de patinaje. Sigue el rastro.' },
		lanamareep3: { name: 'Mechón de lana', pocket: 'key', desc: 'Lana de Mareep entre flores altas de la ribera. Huele a siesta. Sigue el rastro.' },
		lanamareep4: { name: 'Mechón de lana', pocket: 'key', desc: 'Lana de Mareep que brilla un poco en la oscuridad. Sigue el rastro.' },
		lanamareep5: { name: 'Mechón de lana', pocket: 'key', desc: 'Lana de Mareep erizada por el viento del mar. Sigue el rastro.' },
	},

	// =================================================================
	quests: {
		b01_s_cenit: { name: 'Princesa en el laberinto', type: 'side', est: 15, stages: {
			buscar: 'La Furfrou del dueño del **Palacio Cénit**, Princesa, se perdió en el laberinto de setos. Odia la lavanda, adora las rosas, nunca va por la sombra y lleva un lacito rosa.',
			hecha: 'Princesa volvió a casa. Despeinada, pero feliz.',
		} },
		b01_s_acuario: { name: 'Vecinos de la Muralla', type: 'side', est: 15, stages: {
			fotos: 'La conservadora del **Acuario de Petroglifo** quiere fotos de **Inkay**, **Binacle** y **Wingull** de la Ruta 8. Regístralos en la Pokédex.',
			hecha: 'El panel «Vecinos de la Muralla» ya tiene fotos. Un Wingull sale de espaldas.',
		} },
	},
};
