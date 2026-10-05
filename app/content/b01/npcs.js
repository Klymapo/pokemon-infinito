// NPCs del Bloque 1. Los canon usan sprite de Showdown (con retrato procedural de respaldo).
export default {
	// ---------- Sistema ----------
	rotom: { name: 'Rotom', title: 'Rotom-Dex', generic: true, look: { hair: 'spiky', hairColor: '#e07a3a', skin: '#f6f0e6', eyes: '#4c7cf0', outfit: '#e07a3a', outfit2: '#4c7cf0', eyesStyle: 'happy', mouth: 'grin', bg: '#e07a3a' } },
	joy: { name: 'Enfermera Joy', generic: true, look: { hair: 'long', hairColor: '#e98aa8', outfit: '#f3e6e8', outfit2: '#e85a6a', eyes: '#3a5fc4', skin: 0, acc: 'bow' } },
	empleado_liga: { name: 'Empleado de la Liga', generic: true, look: { hair: 'short', hairColor: '#2b2b38', outfit: '#3b5bb5', outfit2: '#f2b33d', skin: 2, acc: 'tie' } },
	guardia_lemnis: { name: 'Guardia de Lemnis', generic: true, look: { hair: 'cap', hairColor: '#2b2b38', outfit: '#1f2e4f', outfit2: '#cfd6e2', skin: 3, eyesStyle: 'sharp', mouth: 'flat', acc: 'lemnis' } },
	agente_lemnis: { name: 'Agente de Lemnis', generic: true, look: { hair: 'short', hairColor: '#5a3a26', outfit: '#1f2e4f', outfit2: '#cfd6e2', skin: 1, eyesStyle: 'sharp', mouth: 'flat', acc: 'lemnis glasses' } },
	recluta_flare: { name: 'Recluta Flare', generic: true, sprite: 'teamflaregrunt', look: { hair: 'bob', hairColor: '#e07a3a', outfit: '#c4473a', outfit2: '#2b2b38', skin: 1, acc: 'glasses', mouth: 'flat' } },

	// ---------- Canon ----------
	cipres: { name: 'Prof. Ciprés', title: 'Profesor de Kalos', sprite: 'sycamore', look: { hair: 'curly', hairColor: '#2b2b38', outfit: '#e9e3d0', outfit2: '#3b5bb5', skin: 1, eyes: '#3a5fc4', mouth: 'smile', acc: 'beard' } },
	handsome: { name: 'Handsome', title: 'Policía Internacional', sprite: 'looker', look: { hair: 'short', hairColor: '#2b2b38', outfit: '#8a7a5a', outfit2: '#e9e3d0', skin: 2, eyes: '#2b2b38', eyesStyle: 'sharp', mouth: 'flat' } },
	matiere: { name: 'Matière', title: 'Jefa de la Agencia de Detectives', sprite: 'emma', look: { hair: 'long', hairColor: '#e07a3a', outfit: '#3b5bb5', outfit2: '#f3e6c4', skin: 1, eyes: '#5aa36b', mouth: 'smile' } },
	xero: { name: 'Xero', title: 'Científico', sprite: 'xerosic', look: { hair: 'spiky', hairColor: '#e07a3a', outfit: '#c4473a', outfit2: '#2b2b38', skin: 1, acc: 'goggles', eyesStyle: 'sharp', mouth: 'grin' } },
	alexia: { name: 'Alexia', title: 'Periodista', sprite: 'alexa', look: { hair: 'ponytail', hairColor: '#d8a85a', outfit: '#5aa36b', outfit2: '#f3e6c4', skin: 1, eyes: '#3f8a4f', mouth: 'smile' } },
	brock: { name: 'Brock', title: 'Líder de intercambio (Roca)', sprite: 'brock', look: { hair: 'spiky', hairColor: '#5a3a26', outfit: '#d8a85a', outfit2: '#3f8a4f', skin: 3, eyesStyle: 'sleepy', mouth: 'grin' } },
	blanca: { name: 'Blanca', title: 'Líder de intercambio (Normal)', sprite: 'whitney', look: { hair: 'ponytail', hairColor: '#e98aa8', outfit: '#f3e6e8', outfit2: '#e98aa8', skin: 0, eyes: '#c4473a', mouth: 'open' } },
	corelia: { name: 'Corelia', title: 'Líder de Ciudad Yantra (Lucha)', sprite: 'korrina', look: { hair: 'ponytail', hairColor: '#e9dcc0', outfit: '#3b5bb5', outfit2: '#f2b33d', skin: 1, eyes: '#3a5fc4', mouth: 'grin', acc: 'cap' } },
	cornelio: { name: 'Cornelio', title: 'Gurú de la Megaevolución', sprite: 'gurkinn', look: { hair: 'bald', hairColor: '#cfd6e2', outfit: '#3b5bb5', outfit2: '#e9e3d0', skin: 2, acc: 'beard mustache', eyesStyle: 'happy', mouth: 'smile' } },
	az: { name: 'Hombre enorme', title: '???', sprite: 'az', look: { hair: 'long', hairColor: '#cfd6e2', outfit: '#4a4f6a', outfit2: '#8c6cd0', skin: 2, eyesStyle: 'sleepy', mouth: 'flat', acc: 'beard' } },
	melia: { name: 'Melia', title: 'Admin del Team Flare', sprite: 'mable', look: { hair: 'bob', hairColor: '#d06aa6', outfit: '#c4473a', outfit2: '#2b2b38', skin: 0, acc: 'goggles', eyesStyle: 'sharp', mouth: 'flat' } },
	jinete_boceto: { name: 'Campeona retirada', title: 'Ex campeona de carreras de Rhyhorn', look: { hair: 'tied', hairColor: '#8a5a2f', outfit: '#c4473a', outfit2: '#e9e3d0', skin: 1, eyes: '#6b4a2b', mouth: 'grin' } },

	// ---------- Candidatas ----------
	lila: { name: 'Lila', title: 'Aprendiz de la Torre Maestra', look: { hair: 'bob', hairColor: '#e9e8e0', streak: '#7fd6b0', eyes: '#3f8a4f', outfit: '#e9dcb6', outfit2: '#5aa36b', skin: 0, mouth: 'smile' } },
	rhi: { name: 'Rhi', title: 'Novata del Circuito (Galar)', look: { hair: 'ponytail', hairColor: '#c4473a', eyes: '#3f8a4f', outfit: '#3b5bb5', outfit2: '#f3e6c4', skin: 0, acc: 'scar', eyesStyle: 'sharp', mouth: 'grin' } },
	sera: { name: 'Serafina Lemnis', title: 'Heredera de Lemnis', look: { hair: 'bob', hairColor: '#1c1a2a', eyes: '#8a94a8', outfit: '#1f2e4f', outfit2: '#cfd6e2', skin: 0, eyesStyle: 'sharp', mouth: 'flat', acc: 'lemnis' } },
	renata: { name: 'Renata', title: 'Pódcast «Casos Fríos de Teselia»', look: { hair: 'curly', hairColor: '#6b4a2b', eyes: '#6b4a2b', outfit: '#d8a85a', outfit2: '#2b2b38', skin: 2, acc: 'roundglasses headphones', mouth: 'grin' } },
	irene: { name: 'Dra. Irene Solberg', title: 'Lingüista y arqueóloga', look: { hair: 'braids', hairColor: '#2c3e7a', eyes: '#3a5fc4', outfit: '#2a3c66', outfit2: '#d8a85a', skin: 0, acc: 'hat glasses', mouth: 'flat' } },

	// ---------- Lemnis ----------
	ansel: { name: 'Dr. Ansel Moreau', title: 'Director de Investigación de Lemnis', look: { hair: 'short', hairColor: '#cfd6e2', outfit: '#8a7a5a', outfit2: '#e9e3d0', skin: 1, acc: 'roundglasses mustache tie', tie: '#3b5bb5', eyesStyle: 'happy', mouth: 'smile' } },
	rouxel: { name: 'Fabien Rouxel', title: 'Director de Lemnis Kalos', look: { hair: 'short', hairColor: '#d8a85a', outfit: '#1f2e4f', outfit2: '#ffffff', skin: 1, eyes: '#3a5fc4', mouth: 'grin', acc: 'lemnis tie', tie: '#c4473a' } },
	noa: { name: 'Noa Lambert', title: 'Cazatalentos de Lemnis', look: { hair: 'bun', hairColor: '#5a3a26', outfit: '#3b5bb5', outfit2: '#cfd6e2', skin: 3, eyes: '#6b4a2b', mouth: 'smile', acc: 'lemnis' } },
	bastien: { name: 'Bastien', title: 'Novato patrocinado por Lemnis', look: { hair: 'short', hairColor: '#e9dcc0', outfit: '#3b5bb5', outfit2: '#ffffff', skin: 0, eyes: '#3a5fc4', mouth: 'smile', acc: 'lemnis' } },

	// ---------- Recurrentes originales ----------
	gaspar: { name: 'Gaspar', title: 'Chef ambulante', look: { hair: 'bald', hairColor: '#8a5a2f', outfit: '#ffffff', outfit2: '#c4473a', skin: 2, acc: 'beard bandana', eyesStyle: 'sleepy', mouth: 'smile' } },
	hector: { name: 'Héctor', title: 'Héroe enmascarado (en sus ratos libres)', look: { hair: 'short', hairColor: '#2b2b38', outfit: '#4a4f6a', outfit2: '#ffffff', skin: 3, acc: 'mask tie', tie: '#c4473a', mouth: 'grin' } },
	tobias: { name: 'Tobías', title: '«Estrella» de su propio show', look: { hair: 'spiky', hairColor: '#5a3a26', outfit: '#3f9d58', outfit2: '#f2b33d', skin: 2, mouth: 'grin', eyes: '#6b4a2b' } },
	aurelio: { name: 'Don Aurelio', title: 'Ranchero de Mareep (Johto)', look: { hair: 'cap', hairColor: '#cfd6e2', outfit: '#8a5a2f', outfit2: '#d8a85a', skin: 3, acc: 'mustache', eyesStyle: 'happy', mouth: 'smile' } },
	philippe: { name: 'Philippe', title: 'Agente inmobiliario y mago aficionado', look: { hair: 'short', hairColor: '#8a5a2f', outfit: '#5aa36b', outfit2: '#ffffff', skin: 1, mouth: 'grin', acc: 'tie', tie: '#f2b33d' } },
	nate: { name: 'Nate', title: 'Compañero de Rhi', look: { hair: 'spiky', hairColor: '#e9e8e0', outfit: '#3b5bb5', outfit2: '#f3e6c4', skin: 0, eyesStyle: 'sleepy', mouth: 'flat' } },
	lucien: { name: 'Lucien', title: 'Niño fan de las Puertas', look: { hair: 'cap', hairColor: '#5a3a26', outfit: '#f2b33d', outfit2: '#3b5bb5', skin: 1, mouth: 'open', eyes: '#6b4a2b' } },
	remedios: { name: 'Abuela Remedios', title: 'Familia Ortega', look: { hair: 'bun', hairColor: '#cfd6e2', outfit: '#8c6cd0', outfit2: '#f2b33d', skin: 3, eyesStyle: 'happy', mouth: 'smile', acc: 'flower' } },
	conde: { name: 'Conde Vladimiro', title: 'Señor del Castillo Caduco', look: { hair: 'short', hairColor: '#1c1a2a', outfit: '#2b2b38', outfit2: '#c4473a', skin: '#e9e3e8', eyes: '#c4473a', eyesStyle: 'sharp', mouth: 'grin' } },
	gadd: { name: 'Prof. Gadd', title: 'Inventor y cazafantasmas', look: { hair: 'bald', hairColor: '#cfd6e2', outfit: '#e9e3d0', outfit2: '#3f9d58', skin: 1, acc: 'roundglasses', mouth: 'open' } },
	simon: { name: 'Simón', title: 'Pódcast «Casos Fríos», el escéptico', look: { hair: 'short', hairColor: '#2b2b38', outfit: '#4a4f6a', outfit2: '#f2b33d', skin: 3, acc: 'headphones', mouth: 'flat' } },
	lebrun: { name: 'Inspector Lebrun', title: 'Policía Internacional · Kalos', look: { hair: 'short', hairColor: '#8a8a8a', outfit: '#2b2b38', outfit2: '#ffffff', skin: 1, eyesStyle: 'sharp', mouth: 'flat', acc: 'mustache tie' } },
	cientifico_fosiles: { name: 'Dr. Lazare', title: 'Laboratorio de Fósiles de Petroglifo', look: { hair: 'curly', hairColor: '#cfd6e2', outfit: '#ffffff', outfit2: '#3b5bb5', skin: 2, acc: 'glasses', mouth: 'open' } },
};
