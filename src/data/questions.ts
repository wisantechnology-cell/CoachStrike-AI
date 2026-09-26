import { Question } from '../types';

export const FOOTBALL_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Technical',
    title: '1. ¿Cuál es tu mayor cualidad técnica cuando tienes el balón en los pies?',
    subtitle: 'Elige la acción donde te sientes más confiado durante un partido real.',
    options: [
      {
        id: '1a',
        label: 'Regate y desborde en 1v1',
        description: 'Superar al rival con agilidad, cambio de ritmo o cambio de dirección por banda/centro.',
        badge: 'Ofensivo',
        weights: { technique: 25, speed: 20, finishing: 10 },
        positionAffinity: ['EXT', 'MPO', 'DC']
      },
      {
        id: '1b',
        label: 'Pase entre líneas y visión de juego',
        description: 'Filtrar balones a la espalda de los defensas o cambiar la orientación del ataque.',
        badge: 'Creador',
        weights: { passing: 25, tacticalIQ: 20, technique: 10 },
        positionAffinity: ['MPO', 'MC', 'MCD']
      },
      {
        id: '1c',
        label: 'Robo, anticipación y pase de seguridad',
        description: 'Interceptar el balón rival y dar el primer pase seguro para iniciar la jugada.',
        badge: 'Defensivo',
        weights: { defending: 25, tacticalIQ: 15, physical: 10 },
        positionAffinity: ['MCD', 'DEC', 'LAT']
      },
      {
        id: '1d',
        label: 'Remate rápido y definición al primer toque',
        description: 'Buscar el espacio en el área para definir con contundencia frente a portería.',
        badge: 'Goleador',
        weights: { finishing: 25, speed: 10, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 2,
    category: 'Spatial',
    title: '2. Bajo presión intensa del rival, ¿cuál es tu primera reacción instintiva?',
    subtitle: 'Imagínate en el minuto 70 con el marcador apretado y recibiendo de espaldas.',
    options: [
      {
        id: '2a',
        label: 'Tocar de primera al compañero libre',
        description: 'Dar continuidad al juego rápido evitando el choque innecesario.',
        badge: 'Inteligencia',
        weights: { passing: 20, tacticalIQ: 25, technique: 10 },
        positionAffinity: ['MC', 'MPO', 'MCD']
      },
      {
        id: '2b',
        label: 'Proteger con el cuerpo y girar',
        description: 'Usar la fuerza corporal para aguantar la marca hasta encontrar salida.',
        badge: 'Físico',
        weights: { physical: 20, technique: 15, mental: 15 },
        positionAffinity: ['DC', 'MCD', 'DEC']
      },
      {
        id: '2c',
        label: 'Encara directamente al defensor',
        description: 'Confiar en tu habilidad para superar la presión mediante un regate.',
        badge: 'Audacia',
        weights: { technique: 25, speed: 15, mental: 10 },
        positionAffinity: ['EXT', 'MPO']
      },
      {
        id: '2d',
        label: 'Orientar hacia la banda o despeje seguro',
        description: 'Dar prioridad a no perder la posesión en zona de riesgo.',
        badge: 'Seguridad',
        weights: { defending: 20, tacticalIQ: 15, mental: 15 },
        positionAffinity: ['DEC', 'LAT', 'POR']
      }
    ]
  },
  {
    id: 3,
    category: 'Physical',
    title: '3. ¿Cómo definirías tu perfil de rendimiento físico en el terreno de juego?',
    subtitle: 'Tu capacidad biológica y distribución de esfuerzo durante 90 minutos.',
    options: [
      {
        id: '3a',
        label: 'Sprint explosivo en distancias cortas (0-20m)',
        description: 'Aceleración punzante para romper la línea defensiva o ganar el balón dividido.',
        badge: 'Explosivo',
        weights: { speed: 25, technique: 10, finishing: 10 },
        positionAffinity: ['EXT', 'DC', 'LAT']
      },
      {
        id: '3b',
        label: 'Resistencia inagotable de ida y vuelta (Box-to-Box)',
        description: 'Capaz de recorrer 10-12 km por partido participando en ataque y defensa.',
        badge: 'Motor',
        weights: { physical: 25, defending: 15, passing: 10 },
        positionAffinity: ['MC', 'LAT', 'MCD']
      },
      {
        id: '3c',
        label: 'Fuerza en la disputa física y juego aéreo',
        description: 'Ganar duelos individuales, proteger el balón e imponer presencia física.',
        badge: 'Dominante',
        weights: { physical: 25, defending: 20, mental: 10 },
        positionAffinity: ['DEC', 'MCD', 'DC']
      },
      {
        id: '3d',
        label: 'Agilidad, equilibrio y cambio de dirección rápido',
        description: 'Pivote de centro de gravedad bajo para girar rápido en espacios reducidos.',
        badge: 'Ágil',
        weights: { technique: 20, speed: 15, passing: 15 },
        positionAffinity: ['MPO', 'MC', 'EXT']
      }
    ]
  },
  {
    id: 4,
    category: 'Tactical',
    title: '4. ¿En qué zona del terreno de juego te sientes más influyente y cómodo?',
    subtitle: 'Tu hábitat natural donde tu lectura de juego alcanza el 100%.',
    options: [
      {
        id: '4a',
        label: 'Pegado a la línea de banda',
        description: 'Para recibir al pie o al espacio, abrir el campo y generar centros o diagonales.',
        badge: 'Banda',
        weights: { speed: 20, technique: 20, passing: 10 },
        positionAffinity: ['EXT', 'LAT']
      },
      {
        id: '4b',
        label: 'En el carril central gestionando el ritmo',
        description: 'Donde pasan la mayoría de balones, distribuyendo y ordenando al equipo.',
        badge: 'Eje Central',
        weights: { passing: 25, tacticalIQ: 25, mental: 10 },
        positionAffinity: ['MC', 'MCD', 'MPO']
      },
      {
        id: '4c',
        label: 'Dentro del área rival o última línea',
        description: 'Fijando a los centrales rivales, esperando el rechace o buscando el remate.',
        badge: 'Área Rival',
        weights: { finishing: 25, speed: 10, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      },
      {
        id: '4d',
        label: 'En el tercio defensivo propio',
        description: 'Manteniendo la línea estructurada, anticipando pases y protegiendo la meta.',
        badge: 'Cierre',
        weights: { defending: 25, tacticalIQ: 20, physical: 10 },
        positionAffinity: ['DEC', 'MCD', 'POR']
      }
    ]
  },
  {
    id: 5,
    category: 'Tactical',
    title: '5. Cuando tu equipo pierde el balón, ¿cuál es tu primera instrucción mental?',
    subtitle: 'La fase de transición defensiva define la identidad del jugador moderno.',
    options: [
      {
        id: '5a',
        label: 'Presión tras pérdida inmediata (Gegenpressing)',
        description: 'Morder al poseedor rival en los primeros 5 segundos para recuperar cerca del área.',
        badge: 'Intenso',
        weights: { defending: 20, physical: 20, tacticalIQ: 15 },
        positionAffinity: ['EXT', 'MC', 'LAT', 'DC']
      },
      {
        id: '5b',
        label: 'Repliegue ordenado y cerrar líneas centrales',
        description: 'Correr hacia tu propio campo para bloquear pasillos interiores y mantener estructura.',
        badge: 'Estructura',
        weights: { tacticalIQ: 25, defending: 15, mental: 10 },
        positionAffinity: ['MCD', 'MC', 'DEC']
      },
      {
        id: '5c',
        label: 'Anticipar el pase de salida del rival',
        description: 'Leer la trayectoria del pase rival para cortar y lanzar el contraataque.',
        badge: 'Lectura',
        weights: { tacticalIQ: 25, passing: 15, speed: 10 },
        positionAffinity: ['MCD', 'DEC', 'LAT']
      },
      {
        id: '5d',
        label: 'Quedarme colgado como vía de escape en contraataque',
        description: 'Ofrecer opción de pase largo inmediato en cuanto mi equipo recupere.',
        badge: 'Desmarque',
        weights: { speed: 20, finishing: 20, mental: 10 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 6,
    category: 'Technical',
    title: '6. En los metros finales (3/4 de cancha), ¿qué jugada sueles intentar?',
    subtitle: 'Tu toma de decisiones en la zona decisiva de gol.',
    options: [
      {
        id: '6a',
        label: 'Pase filtrado milimétrico a la espalda',
        description: 'Dejar a tu delantero mano a mano contra el portero.',
        badge: 'Asistador',
        weights: { passing: 25, tacticalIQ: 20, technique: 10 },
        positionAffinity: ['MPO', 'MC', 'EXT']
      },
      {
        id: '6b',
        label: 'Disparo a puerta de media/larga distancia',
        description: 'Aprovechar cualquier espacio para golpear con potencia o colocación.',
        badge: 'Cañonero',
        weights: { finishing: 25, technique: 15, mental: 10 },
        positionAffinity: ['MPO', 'MC', 'DC', 'EXT']
      },
      {
        id: '6c',
        label: 'Desborde individual y centro raso/elevado',
        description: 'Superar a tu lateral y poner el balón con ventaja para el rematador.',
        badge: 'Centrador',
        weights: { technique: 20, speed: 20, passing: 15 },
        positionAffinity: ['EXT', 'LAT']
      },
      {
        id: '6d',
        label: 'Desmarque en diagonal hacia el primer/segundo palo',
        description: 'Atacar el centro con determinación para mandar el balón a la red.',
        badge: 'Rematador',
        weights: { finishing: 25, speed: 15, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 7,
    category: 'Mental',
    title: '7. ¿Cuál es tu actitud principal y rol de liderazgo dentro del grupo?',
    subtitle: 'El impacto intangible en la química y carácter del equipo.',
    options: [
      {
        id: '7a',
        label: 'Líder vocal y ordenador del equipo',
        description: 'Dar indicaciones constantes, corregir posiciones y mantener la concentración alta.',
        badge: 'Capitán',
        weights: { mental: 25, tacticalIQ: 20, defending: 10 },
        positionAffinity: ['DEC', 'MCD', 'POR', 'MC']
      },
      {
        id: '7b',
        label: 'Líder silencioso que habla con el esfuerzo',
        description: 'Dar el 100% en cada balón para contagiar la intensidad a los demás.',
        badge: 'Guerrero',
        weights: { mental: 25, physical: 20, defending: 10 },
        positionAffinity: ['LAT', 'MC', 'MCD', 'DEC']
      },
      {
        id: '7c',
        label: 'Jugador determinante de chispazos de genio',
        description: 'Aparecer en los momentos difíciles para resolver el partido con una acción individual.',
        badge: 'Estrella',
        weights: { mental: 20, technique: 20, finishing: 15 },
        positionAffinity: ['EXT', 'MPO', 'DC']
      },
      {
        id: '7d',
        label: 'Facilitador y socio táctico de todos',
        description: 'Ofrecer siempre línea de pase, no complicarse y hacer mejor a los compañeros.',
        badge: 'Socio',
        weights: { passing: 20, tacticalIQ: 20, mental: 15 },
        positionAffinity: ['MC', 'LAT', 'MCD']
      }
    ]
  },
  {
    id: 8,
    category: 'Physical',
    title: '8. ¿Cuál es tu pie dominante y cómo manejas la pierna no hábil?',
    subtitle: 'El recurso de ambas piernas multiplica tus opciones en el terreno de juego.',
    options: [
      {
        id: '8a',
        label: 'Diestro especializado',
        description: 'Pie derecho letal para pase, centro y disparo; uso la zurda para apuros.',
        badge: 'Diestro',
        weights: { technique: 15, passing: 15 },
        positionAffinity: ['DEC', 'MC', 'LAT', 'EXT', 'DC']
      },
      {
        id: '8b',
        label: 'Zurdo talentoso',
        description: 'Perfil zurdo natural, ideal para banda izquierda o juego cambiado a pierna cambiada.',
        badge: 'Zurdo',
        weights: { technique: 18, passing: 15 },
        positionAffinity: ['LAT', 'EXT', 'MPO', 'DEC']
      },
      {
        id: '8c',
        label: 'Ambidestro natural / Excelente manejo de ambas',
        description: 'Incierto para los defensas, puedes salir o salir por cualquier perfil.',
        badge: 'Ambidestro',
        weights: { technique: 25, passing: 20, finishing: 15 },
        positionAffinity: ['MPO', 'EXT', 'DC', 'MC']
      },
      {
        id: '8d',
        label: 'Diestro con buen uso de pierna no hábil',
        description: 'Dominio claro de la derecha con capacidad de pase y apoyo fluido con la zurda.',
        badge: 'Diestro Versátil',
        weights: { technique: 18, passing: 18 },
        positionAffinity: ['MC', 'MCD', 'LAT', 'DC']
      }
    ]
  },
  {
    id: 9,
    category: 'Mental',
    title: '9. Cuando el equipo rival se encierra con un bloque bajo (autobús), ¿cómo aportas?',
    subtitle: 'Romper defensas cerradas requiere habilidades específicas.',
    options: [
      {
        id: '9a',
        label: 'Muevo el balón rápido de lado a lado para desgastar',
        description: 'Girar la posesión con paciencia hasta que aparezca el hueco interior.',
        badge: 'Control',
        weights: { passing: 25, tacticalIQ: 20, mental: 10 },
        positionAffinity: ['MC', 'MCD', 'DEC']
      },
      {
        id: '9b',
        label: 'Intento encarar en 1v1 para desbordar y desequilibrar',
        description: 'Forzar la ayuda defensiva rival para generar ventaja numérica.',
        badge: 'Desborde',
        weights: { technique: 25, speed: 20, finishing: 10 },
        positionAffinity: ['EXT', 'MPO']
      },
      {
        id: '9c',
        label: 'Disparo lejano para obligar a salir al bloque rival',
        description: 'Probar fortuna desde fuera del área con lanzamientos potentes.',
        badge: 'Disparo',
        weights: { finishing: 25, technique: 15, physical: 10 },
        positionAffinity: ['MC', 'MPO', 'DC']
      },
      {
        id: '9d',
        label: 'Ataque los centros al área disputando por alto',
        description: 'Usar el juego aéreo para rematar balones colgados al área.',
        badge: 'Aéreo',
        weights: { physical: 25, finishing: 20, mental: 10 },
        positionAffinity: ['DC', 'DEC']
      }
    ]
  },
  {
    id: 10,
    category: 'Spatial',
    title: '10. ¿Cuál es tu mayor satisfacción personal durante un encuentro de fútbol?',
    subtitle: 'La recompensa emocional que alimenta tu estilo competitivo.',
    options: [
      {
        id: '10a',
        label: 'Anotar un gol o dar una asistencia decisiva',
        description: 'Participar directamente en el marcador y desatar la alegría del equipo.',
        badge: 'Ofensiva',
        weights: { finishing: 20, passing: 20, speed: 10 },
        positionAffinity: ['DC', 'EXT', 'MPO']
      },
      {
        id: '10b',
        label: 'Realizar un robo limpio o un barrido milimétrico',
        description: 'Salvar una ocasión clara del rival y dejar la portería a cero.',
        badge: 'Muralla',
        weights: { defending: 25, physical: 15, tacticalIQ: 15 },
        positionAffinity: ['DEC', 'MCD', 'POR', 'LAT']
      },
      {
        id: '10c',
        label: 'Dar un recital de pases sin perder una sola pelota',
        description: 'Dominar la medular con un 95% de precisión de pase y dictar el ritmo.',
        badge: 'Maestro',
        weights: { passing: 25, tacticalIQ: 25, technique: 15 },
        positionAffinity: ['MC', 'MCD', 'MPO']
      },
      {
        id: '10d',
        label: 'Superar físicamente a tu marca durante todo el partido',
        description: 'Saber que tu rival directo terminó agotado por tu despliegue físico.',
        badge: 'Atleta',
        weights: { physical: 25, speed: 15, defending: 15 },
        positionAffinity: ['LAT', 'MC', 'DEC', 'DC']
      }
    ]
  }
];
