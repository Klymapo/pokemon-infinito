# Recomendaciones · 2026-10-06

> Solo propuestas. No implementar automáticamente.

## Técnica
1. **Gate de publicación:** candidato → auditoría completa → `main`. La regla de “no publicar si falla” debería ser técnica, no solo procedimental.
2. **Migraciones de saves:** cuando avance `SAVE_VERSION`, mantener migraciones v1→v2→v3 y fixtures de partidas históricas.
3. **UI incremental:** cuando vuelva a tocarse `screens.js`, extraer dominios (Equipo/PC, Diario, Tienda, Mapa, Colección) sin una refactorización masiva.
4. **Bug nuevo = prueba nueva:** conservar la filosofía de convertir cada fallo real en una regresión imposible.
5. **Caché offline medible:** medir crecimiento antes de optimizar y definir presupuesto si el uso real lo exige.
6. **Perfil de juego:** registrar señales no sensibles (exploración, secundarias, captura, variedad del equipo, objetos ocultos) para reacciones narrativas pequeñas, nunca para castigar o ajustar dificultad a escondidas.

## Principios creativos
- Las sorpresas deben poder reconstruirse retrospectivamente.
- Los NPC importantes deben vivir y cambiar fuera de cámara.
- Las mecánicas Pokémon pueden funcionar como lenguaje narrativo.
- Los guiños deben inspirar estructuras, no copiar personajes ni escenas.
- Alternar explicaciones humanas, sistémicas y Pokémon para que los misterios no terminen siempre igual.

## Historias originales

### La ciudad donde todos recuerdan algo distinto
Un pueblo conserva versiones incompatibles de un incidente antiguo. Ningún testigo posee toda la verdad.
**Sistemas:** Diario de Rotom con Hecho / Fuente / Evidencia / Contradicción; horarios, objetos legibles, reputación y decisiones.
**Fortaleza:** investigar se vuelve gameplay; el jugador puede formular una hipótesis antes de la revelación.
**Variantes:** causa humana, efecto Pokémon conocido o combinación. Saber la verdad no obliga a restaurar recuerdos.
**Riesgos:** no introducir la pista decisiva al final ni explicar toda contradicción con la misma causa.

### La Liga de los Siete Oficios
Una ciudad sustituyó el gimnasio tradicional por siete maestros de profesiones distintas. Hay que convencer a cuatro; ganar un combate es solo una vía.
**Sistemas:** retos, reputación, misiones, combate temático, objetos y expedientes.
**Fortaleza:** variedad y siete NPC recurrentes.
**Variantes:** cambiar profesiones por región; algunas soluciones sin combate pueden ser más difíciles.
**Riesgos:** siete arcos obligatorios frenarían el ritmo; mejor cuatro necesarios y tres opcionales.

### El Pokémon que no quiere evolucionar
Cumple los requisitos de evolución, pero se niega. Lo que parece un problema mecánico revela una razón emocional vinculada a su entrenador.
**Sistemas:** amistad, evolución, conversaciones, objetos con historia y reencuentros.
**Fortaleza:** convierte una regla Pokémon en conflicto emocional.
**Variantes:** la evolución puede ocurrir bloques después como cierre natural.
**Riesgos:** evitar melodrama explicativo y no presentar evolucionar como ser “mejor”.

## Historias personalizadas para Mario

### Duelo entre detective y adversario
Inspiración estructural: Sherlock Holmes frente a un adversario tipo Jack the Ripper, reinterpretado de forma original. Un investigador sigue casos cuyas pistas parecen responder a sus deducciones anteriores: el rival compite contra su método.
**Sistemas:** Expediente, Diario, pistas, horarios, testimonios y equipos Pokémon como evidencia.
**Encaje:** deducción, giro fundamentado y rivalidad intelectual.
**Riesgos:** el adversario no debe ser omnisciente; cada ventaja necesita mecanismo comprobable. El jugador debe poder superar al detective.

### El Juego de los Doce
Doce entrenadores de élite con especialidades estratégicas marcadas entran a una competición cerrada. Tras cada ronda alguien queda fuera, pero el resultado no explica por sí solo la selección: la organización evalúa otra cosa.
**Sistemas:** rankings, expedientes, combates, alianzas, reputación e información parcial.
**Encaje:** competición, clasificación, especialización, traiciones con fundamento y misterio.
**Riesgos:** no convertir a once participantes en relleno ni cambiar reglas arbitrariamente para fabricar giros.

### La Casa de las Siete Puertas
Ocho viajeros recuerdan haber entrado juntos a una mansión/mazmorra con siete puertas. El registro de entrada dice siete. Todos tienen pruebas de pertenecer al grupo.
**Sistemas:** exploración, objetos, Diario, horarios, campamento e inventario.
**Encaje:** misterio cerrado + mazmorra + relaciones de grupo.
**Riesgos:** Ditto, Zoroark o ilusión pueden ser sospechas, no una solución automática. La respuesta real debe poder deducirse.

### El Último Campeón
Una región abolió su Liga después del último Campeón. Ocho antiguas insignias quedaron repartidas entre familias y facciones con relatos contradictorios. Restaurarla puede ser tan problemático como dejarla atrás.
**Sistemas:** reputación de facciones, decisiones, medallas y mundo persistente.
**Encaje:** organizaciones, legado, exploración y conflicto institucional sin respuesta perfecta.
**Riesgos:** evitar discursos largos; mostrar ideas mediante consecuencias y personajes.

### El Torneo de los Villanos
Exmiembros de organizaciones criminales participan en una competición clandestina con la promesa de dinero y una identidad nueva. El jugador investiga el evento y uno de los participantes intenta descubrir quién lo financia.
**Sistemas:** combate, reputación, expedientes, identidades, alianzas y reencuentros.
**Encaje:** personajes moralmente ambiguos, investigación, competición y redención con consecuencias.
**Riesgos:** una motivación triste no equivale a absolución; distinguir desertores, oportunistas, coaccionados y participantes aún peligrosos.

## Tres propuestas nuevas

### El rival que estudia tus combates
Un rival recurrente conserva un expediente de tácticas que realmente te vio usar. Si repites patrones, prepara respuestas plausibles. Puedes romper su predicción cambiando de estilo.

### La misión que fracasa bien
Una secundaria donde fallar no reinicia ni bloquea: abre una variante del hilo. El mundo recuerda desempeño, no solo elecciones de diálogo.

### El museo de tu propia partida
Un lugar recurrente acumula postales, réplicas, titulares, trofeos y pequeñas descripciones de decisiones. No como checklist, sino como autobiografía visual apoyada en el álbum.

## Prioridad sugerida
1. Proteger publicación y saves.
2. Añadir perfil de estilo de juego de forma no invasiva.
3. Probar una historia corta donde una mecánica Pokémon sea el núcleo narrativo.
4. Reservar grandes arcos de misterio/competición para cuando Expediente y decisiones tengan suficiente profundidad.
