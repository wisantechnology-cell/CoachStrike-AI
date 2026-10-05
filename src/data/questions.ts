import { Question } from '../types';
import { Language } from './translations';

export const FOOTBALL_QUESTIONS_EN: Question[] = [
  {
    id: 1,
    category: 'Technical',
    title: '1. What is your strongest technical quality when the ball is at your feet?',
    subtitle: 'Choose the action where you feel most confident during a competitive match.',
    options: [
      {
        id: '1a',
        label: '1v1 Dribbling & Take-ons',
        description: 'Beating defenders with agility, burst of speed or quick change of direction out wide/inside.',
        badge: 'Attacking',
        weights: { technique: 25, speed: 20, finishing: 10 },
        positionAffinity: ['EXT', 'MPO', 'DC']
      },
      {
        id: '1b',
        label: 'Line-breaking Passes & Pitch Vision',
        description: 'Threading passes behind defensive lines or switching the point of attack.',
        badge: 'Playmaker',
        weights: { passing: 25, tacticalIQ: 20, technique: 10 },
        positionAffinity: ['MPO', 'MC', 'MCD']
      },
      {
        id: '1c',
        label: 'Interception, Tackling & Security Pass',
        description: 'Winning the ball back and making the first secure pass to launch the build-up.',
        badge: 'Defensive',
        weights: { defending: 25, tacticalIQ: 15, physical: 10 },
        positionAffinity: ['MCD', 'DEC', 'LAT']
      },
      {
        id: '1d',
        label: 'Quick Finishing & 1-Touch Strike',
        description: 'Finding space in the penalty box to finish clinically in front of goal.',
        badge: 'Goalscorer',
        weights: { finishing: 25, speed: 10, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 2,
    category: 'Spatial',
    title: '2. Under heavy opposition press, what is your first instinctive reaction?',
    subtitle: 'Picture yourself in the 70th minute with a tight score receiving back-to-goal.',
    options: [
      {
        id: '2a',
        label: '1-Touch pass to the open teammate',
        description: 'Keep fluid ball circulation alive and avoid unnecessary physical collisions.',
        badge: 'Intelligence',
        weights: { passing: 20, tacticalIQ: 25, technique: 10 },
        positionAffinity: ['MC', 'MPO', 'MCD']
      },
      {
        id: '2b',
        label: 'Shield with your body and turn',
        description: 'Use upper-body strength and low center of gravity to hold off the marker until finding an exit.',
        badge: 'Physical',
        weights: { physical: 20, technique: 15, mental: 15 },
        positionAffinity: ['DC', 'MCD', 'DEC']
      },
      {
        id: '2c',
        label: 'Take on the pressing defender directly',
        description: 'Back your footwork and agility to beat the pressure with a skill move.',
        badge: 'Audacity',
        weights: { technique: 25, speed: 15, mental: 10 },
        positionAffinity: ['EXT', 'MPO']
      },
      {
        id: '2d',
        label: 'Play wide or execute a safe clearance',
        description: 'Prioritize preventing ball loss in high-risk zones.',
        badge: 'Security',
        weights: { defending: 20, tacticalIQ: 15, mental: 15 },
        positionAffinity: ['DEC', 'LAT', 'POR']
      }
    ]
  },
  {
    id: 3,
    category: 'Physical',
    title: '3. How would you describe your athletic and physical profile on the pitch?',
    subtitle: 'Your natural biological engine and energy distribution over 90 minutes.',
    options: [
      {
        id: '3a',
        label: 'Explosive short-distance sprint (0-20m)',
        description: 'Sharp acceleration to break the defensive line or win 50/50 duels.',
        badge: 'Explosive',
        weights: { speed: 25, technique: 10, finishing: 10 },
        positionAffinity: ['EXT', 'DC', 'LAT']
      },
      {
        id: '3b',
        label: 'Relentless Box-to-Box stamina',
        description: 'Covering 10-12 km per game contributing constantly in attack and defense.',
        badge: 'Engine',
        weights: { physical: 25, defending: 15, passing: 10 },
        positionAffinity: ['MC', 'LAT', 'MCD']
      },
      {
        id: '3c',
        label: 'Aerial power & physical duel dominance',
        description: 'Winning individual headers, protecting the ball and establishing pitch presence.',
        badge: 'Dominant',
        weights: { physical: 25, defending: 20, mental: 10 },
        positionAffinity: ['DEC', 'MCD', 'DC']
      },
      {
        id: '3d',
        label: 'Agility, balance & rapid change of direction',
        description: 'Low center of gravity allowing sharp turns in compact spaces.',
        badge: 'Agile',
        weights: { technique: 20, speed: 15, passing: 15 },
        positionAffinity: ['MPO', 'MC', 'EXT']
      }
    ]
  },
  {
    id: 4,
    category: 'Tactical',
    title: '4. In which area of the pitch do you feel most comfortable and influential?',
    subtitle: 'Your natural habitat where your reading of the game reaches 100%.',
    options: [
      {
        id: '4a',
        label: 'Hugging the touchline out wide',
        description: 'Receiving to feet or in behind, stretching the pitch to cross or cut inside.',
        badge: 'Flank',
        weights: { speed: 20, technique: 20, passing: 10 },
        positionAffinity: ['EXT', 'LAT']
      },
      {
        id: '4b',
        label: 'In the central channel dictating tempo',
        description: 'Where most passes flow, organizing teammates and directing attacks.',
        badge: 'Central Hub',
        weights: { passing: 25, tacticalIQ: 25, mental: 10 },
        positionAffinity: ['MC', 'MCD', 'MPO']
      },
      {
        id: '4c',
        label: 'Inside the opposition penalty box',
        description: 'Occupying center-backs, anticipating second balls and finishing.',
        badge: 'Box Presence',
        weights: { finishing: 25, speed: 10, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      },
      {
        id: '4d',
        label: 'In your own defensive third',
        description: 'Maintaining a structured backline, intercepting passes and protecting goal.',
        badge: 'Anchor',
        weights: { defending: 25, tacticalIQ: 20, physical: 10 },
        positionAffinity: ['DEC', 'MCD', 'POR']
      }
    ]
  },
  {
    id: 5,
    category: 'Tactical',
    title: '5. When your team loses possession, what is your first mental instruction?',
    subtitle: 'The defensive transition phase defines a modern player identity.',
    options: [
      {
        id: '5a',
        label: 'Immediate counter-pressing (Gegenpressing)',
        description: 'Hounding the ball carrier within 5 seconds to win it back close to their goal.',
        badge: 'Intense',
        weights: { defending: 20, physical: 20, tacticalIQ: 15 },
        positionAffinity: ['EXT', 'MC', 'LAT', 'DC']
      },
      {
        id: '5b',
        label: 'Drop into shape & block central passing lanes',
        description: 'Sprinting back into compact shape to close half-spaces and maintain team structure.',
        badge: 'Structure',
        weights: { tacticalIQ: 25, defending: 15, mental: 10 },
        positionAffinity: ['MCD', 'MC', 'DEC']
      },
      {
        id: '5c',
        label: 'Anticipate opposition exit pass',
        description: 'Reading passing angles to cut the ball and trigger immediate counter-attacks.',
        badge: 'Anticipation',
        weights: { tacticalIQ: 25, passing: 15, speed: 10 },
        positionAffinity: ['MCD', 'DEC', 'LAT']
      },
      {
        id: '5d',
        label: 'Stay high as an outlet for counter-attacks',
        description: 'Providing an immediate long passing option the moment your team regains possession.',
        badge: 'Run in Behind',
        weights: { speed: 20, finishing: 20, mental: 10 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 6,
    category: 'Technical',
    title: '6. In the final third (attacking 3/4), which play do you most often look for?',
    subtitle: 'Your decision-making in the decisive scoring zone.',
    options: [
      {
        id: '6a',
        label: 'Pinpoint through ball in behind',
        description: 'Putting your striker 1v1 against the goalkeeper.',
        badge: 'Assister',
        weights: { passing: 25, tacticalIQ: 20, technique: 10 },
        positionAffinity: ['MPO', 'MC', 'EXT']
      },
      {
        id: '6b',
        label: 'Mid/long-range shot on goal',
        description: 'Taking advantage of any shooting pocket to strike with power and precision.',
        badge: 'Shooter',
        weights: { finishing: 25, technique: 15, mental: 10 },
        positionAffinity: ['MPO', 'MC', 'DC', 'EXT']
      },
      {
        id: '6c',
        label: 'Individual take-on & whipped cross',
        description: 'Beating your fullback and delivering a dangerous cross to the box.',
        badge: 'Crosser',
        weights: { technique: 20, speed: 20, passing: 15 },
        positionAffinity: ['EXT', 'LAT']
      },
      {
        id: '6d',
        label: 'Diagonal run across near/back post',
        description: 'Attacking the cross with hunger to redirect the ball into the net.',
        badge: 'Finisher',
        weights: { finishing: 25, speed: 15, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 7,
    category: 'Mental',
    title: '7. What is your primary leadership style and presence within the squad?',
    subtitle: 'The intangible impact on team chemistry and locker room character.',
    options: [
      {
        id: '7a',
        label: 'Vocal organizer & tactical general',
        description: 'Constantly giving cues, organizing defensive lines and maintaining focus.',
        badge: 'Captain',
        weights: { mental: 25, tacticalIQ: 20, defending: 10 },
        positionAffinity: ['DEC', 'MCD', 'POR', 'MC']
      },
      {
        id: '7b',
        label: 'Silent leader setting the work-rate standard',
        description: 'Giving 100% on every 50/50 ball to inspire defensive intensity across the squad.',
        badge: 'Warrior',
        weights: { mental: 25, physical: 20, defending: 10 },
        positionAffinity: ['LAT', 'MC', 'MCD', 'DEC']
      },
      {
        id: '7c',
        label: 'Clutch player delivering match-winning moments',
        description: 'Stepping up in clutch minutes to resolve games with moments of individual magic.',
        badge: 'Game-Changer',
        weights: { mental: 20, technique: 20, finishing: 15 },
        positionAffinity: ['EXT', 'MPO', 'DC']
      },
      {
        id: '7d',
        label: 'Tactical unifier & trusted passing partner',
        description: 'Always offering an open passing angle, playing simple and elevating teammates.',
        badge: 'Connector',
        weights: { passing: 20, tacticalIQ: 20, mental: 15 },
        positionAffinity: ['MC', 'LAT', 'MCD']
      }
    ]
  },
  {
    id: 8,
    category: 'Physical',
    title: '8. What is your preferred foot and weak foot capability?',
    subtitle: 'Two-footed proficiency multiplies tactical options and angles.',
    options: [
      {
        id: '8a',
        label: 'Right-foot specialist',
        description: 'Deadly right foot for passing, crossing and shooting; left foot used for emergencies.',
        badge: 'Right-Footed',
        weights: { technique: 15, passing: 15 },
        positionAffinity: ['DEC', 'MC', 'LAT', 'EXT', 'DC']
      },
      {
        id: '8b',
        label: 'Natural left-foot specialist',
        description: 'Gifted left foot profile, ideal for left flank or inverted right-wing play.',
        badge: 'Left-Footed',
        weights: { technique: 18, passing: 15 },
        positionAffinity: ['LAT', 'EXT', 'MPO', 'DEC']
      },
      {
        id: '8c',
        label: 'Natural two-footed / Ambidextrous',
        description: 'Unpredictable for defenders, comfortable passing, turning and finishing on either side.',
        badge: 'Ambidextrous',
        weights: { technique: 25, passing: 20, finishing: 15 },
        positionAffinity: ['MPO', 'EXT', 'DC', 'MC']
      },
      {
        id: '8d',
        label: 'Right-footed with solid weak foot usage',
        description: 'Right-dominant with fluent passing and body-orientation on the left.',
        badge: 'Versatile Right',
        weights: { technique: 18, passing: 18 },
        positionAffinity: ['MC', 'MCD', 'LAT', 'DC']
      }
    ]
  },
  {
    id: 9,
    category: 'Mental',
    title: '9. When facing an ultra-defensive low block (park the bus), how do you contribute?',
    subtitle: 'Unlocking deep compact defenses requires specific tactical solutions.',
    options: [
      {
        id: '9a',
        label: 'Circulate ball fast from side to side',
        description: 'Patience in possession to shift their defensive block until gaps open up.',
        badge: 'Control',
        weights: { passing: 25, tacticalIQ: 20, mental: 10 },
        positionAffinity: ['MC', 'MCD', 'DEC']
      },
      {
        id: '9b',
        label: 'Engage in 1v1 take-ons to destabilize shape',
        description: 'Drawing double-teams to create numeric superiority for surrounding runners.',
        badge: 'Take-On',
        weights: { technique: 25, speed: 20, finishing: 10 },
        positionAffinity: ['EXT', 'MPO']
      },
      {
        id: '9c',
        label: 'Long-range shooting to force defense out',
        description: 'Testing the keeper from outside the 18-yard box with powerful strikes.',
        badge: 'Long Shot',
        weights: { finishing: 25, technique: 15, physical: 10 },
        positionAffinity: ['MC', 'MPO', 'DC']
      },
      {
        id: '9d',
        label: 'Attack aerial crosses in the box',
        description: 'Using physical size and timing to win aerial headers on whipped crosses.',
        badge: 'Aerial Threat',
        weights: { physical: 25, finishing: 20, mental: 10 },
        positionAffinity: ['DC', 'DEC']
      }
    ]
  },
  {
    id: 10,
    category: 'Spatial',
    title: '10. What brings you the greatest personal satisfaction in a football match?',
    subtitle: 'The intrinsic competitive reward that drives your football identity.',
    options: [
      {
        id: '10a',
        label: 'Scoring a goal or providing a clutch assist',
        description: 'Directly influencing the scoreline and celebrating with teammates.',
        badge: 'Attacking',
        weights: { finishing: 20, passing: 20, speed: 10 },
        positionAffinity: ['DC', 'EXT', 'MPO']
      },
      {
        id: '10b',
        label: 'Executing a goal-saving tackle or block',
        description: 'Preventing a certain goal and securing a clean sheet.',
        badge: 'Clean Sheet',
        weights: { defending: 25, physical: 15, tacticalIQ: 15 },
        positionAffinity: ['DEC', 'MCD', 'POR', 'LAT']
      },
      {
        id: '10c',
        label: 'Masterclass passing performance without losing a ball',
        description: 'Dictating the game with 95%+ pass accuracy and control.',
        badge: 'Maestro',
        weights: { passing: 25, tacticalIQ: 25, technique: 15 },
        positionAffinity: ['MC', 'MCD', 'MPO']
      },
      {
        id: '10d',
        label: 'Physically outworking your direct opponent for 90 minutes',
        description: 'Knowing your opponent was completely spent against your athleticism.',
        badge: 'Athlete',
        weights: { physical: 25, speed: 15, defending: 15 },
        positionAffinity: ['LAT', 'MC', 'DEC', 'DC']
      }
    ]
  }
];

export const FOOTBALL_QUESTIONS_ES: Question[] = [
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

export const FOOTBALL_QUESTIONS_PT: Question[] = [
  {
    id: 1,
    category: 'Technical',
    title: '1. Qual é a sua maior qualidade técnica com a bola nos pés?',
    subtitle: 'Escolha a ação onde se sente mais confiante durante um jogo.',
    options: [
      {
        id: '1a',
        label: 'Drible e desequilíbrio no 1v1',
        description: 'Superar o adversário com agilidade, mudança de velocidade ou drible na linha/centro.',
        badge: 'Ofensivo',
        weights: { technique: 25, speed: 20, finishing: 10 },
        positionAffinity: ['EXT', 'MPO', 'DC']
      },
      {
        id: '1b',
        label: 'Passe entrelinhas e visão de jogo',
        description: 'Desmarcar colegas nas costas da defesa ou inverter o centro do jogo.',
        badge: 'Criador',
        weights: { passing: 25, tacticalIQ: 20, technique: 10 },
        positionAffinity: ['MPO', 'MC', 'MCD']
      },
      {
        id: '1c',
        label: 'Desarme, antecipação e passe seguro',
        description: 'Recuperar a bola e fazer o primeiro passe limpo para iniciar o ataque.',
        badge: 'Defensivo',
        weights: { defending: 25, tacticalIQ: 15, physical: 10 },
        positionAffinity: ['MCD', 'DEC', 'LAT']
      },
      {
        id: '1d',
        label: 'Remate rápido e finalização a 1 toque',
        description: 'Aproveitar o espaço na grande área para finalizar com precisão.',
        badge: 'Goleador',
        weights: { finishing: 25, speed: 10, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 2,
    category: 'Spatial',
    title: '2. Sob pressão intensa do adversário, qual é a sua reação imediata?',
    subtitle: 'Imagine-se ao minuto 70 com o jogo equilibrado a receber de costas.',
    options: [
      {
        id: '2a',
        label: 'Passar de primeira ao colega livre',
        description: 'Manter a circulação rápida e evitar choque desnecessário.',
        badge: 'Inteligência',
        weights: { passing: 20, tacticalIQ: 25, technique: 10 },
        positionAffinity: ['MC', 'MPO', 'MCD']
      },
      {
        id: '2b',
        label: 'Proteger com o corpo e rodar',
        description: 'Usar o porte físico para aguentar a carga até encontrar saída.',
        badge: 'Físico',
        weights: { physical: 20, technique: 15, mental: 15 },
        positionAffinity: ['DC', 'MCD', 'DEC']
      },
      {
        id: '2c',
        label: 'Encarar o defesa diretamente',
        description: 'Confiar na habilidade para ultrapassar a marcação com um drible.',
        badge: 'Audácia',
        weights: { technique: 25, speed: 15, mental: 10 },
        positionAffinity: ['EXT', 'MPO']
      },
      {
        id: '2d',
        label: 'Jogar na ala ou corte seguro',
        description: 'Dar prioridade a não perder a bola em zona proibida.',
        badge: 'Segurança',
        weights: { defending: 20, tacticalIQ: 15, mental: 15 },
        positionAffinity: ['DEC', 'LAT', 'POR']
      }
    ]
  },
  {
    id: 3,
    category: 'Physical',
    title: '3. Como definiria o seu perfil físico e atlético dentro de campo?',
    subtitle: 'A sua capacidade de esforço e energia durante os 90 minutos.',
    options: [
      {
        id: '3a',
        label: 'Sprint explosivo em distâncias curtas (0-20m)',
        description: 'Aceleração potente para romper linhas defensivas ou ganhar bolas divididas.',
        badge: 'Explosivo',
        weights: { speed: 25, technique: 10, finishing: 10 },
        positionAffinity: ['EXT', 'DC', 'LAT']
      },
      {
        id: '3b',
        label: 'Resistência incansável de área a área (Box-to-Box)',
        description: 'Capacidade de correr 10-12 km participando nas duas fases do jogo.',
        badge: 'Motor',
        weights: { physical: 25, defending: 15, passing: 10 },
        positionAffinity: ['MC', 'LAT', 'MCD']
      },
      {
        id: '3c',
        label: 'Força nos duelos e jogo aéreo',
        description: 'Impor presença física, ganhar disputas individuais e bolas altas.',
        badge: 'Dominante',
        weights: { physical: 25, defending: 20, mental: 10 },
        positionAffinity: ['DEC', 'MCD', 'DC']
      },
      {
        id: '3d',
        label: 'Agilidade, equilíbrio e rotação rápida',
        description: 'Centro de gravidade baixo para rodar com velocidade em espaços curtos.',
        badge: 'Ágil',
        weights: { technique: 20, speed: 15, passing: 15 },
        positionAffinity: ['MPO', 'MC', 'EXT']
      }
    ]
  },
  {
    id: 4,
    category: 'Tactical',
    title: '4. Em que zona do terreno de jogo se sente mais influente e à vontade?',
    subtitle: 'O seu habitat natural onde a sua leitura tática atinge o topo.',
    options: [
      {
        id: '4a',
        label: 'Colado à linha lateral',
        description: 'Para receber nos pés ou no espaço, dar largura e cruzar.',
        badge: 'Ala',
        weights: { speed: 20, technique: 20, passing: 10 },
        positionAffinity: ['EXT', 'LAT']
      },
      {
        id: '4b',
        label: 'No corredor central a ditar o ritmo',
        description: 'Por onde passam as jogadas, a distribuir e a orientar a equipa.',
        badge: 'Eixo Central',
        weights: { passing: 25, tacticalIQ: 25, mental: 10 },
        positionAffinity: ['MC', 'MCD', 'MPO']
      },
      {
        id: '4c',
        label: 'Na grande área adversária',
        description: 'A fixar os centrais, à procura de sobras ou remates de primeira.',
        badge: 'Área',
        weights: { finishing: 25, speed: 10, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      },
      {
        id: '4d',
        label: 'No terço defensivo da própria equipa',
        description: 'A manter a linha estruturada, antecipar passes e proteger a baliza.',
        badge: 'Trinco/Defesa',
        weights: { defending: 25, tacticalIQ: 20, physical: 10 },
        positionAffinity: ['DEC', 'MCD', 'POR']
      }
    ]
  },
  {
    id: 5,
    category: 'Tactical',
    title: '5. Quando a sua equipa perde a bola, qual é a sua primeira ação mental?',
    subtitle: 'A transição defensiva define o jogador moderno de alto nível.',
    options: [
      {
        id: '5a',
        label: 'Pressão imediata pós-perda (Gegenpressing)',
        description: 'Pressionar nos primeiros 5 segundos para recuperar perto da baliza rival.',
        badge: 'Intenso',
        weights: { defending: 20, physical: 20, tacticalIQ: 15 },
        positionAffinity: ['EXT', 'MC', 'LAT', 'DC']
      },
      {
        id: '5b',
        label: 'Recuo organizado e fechar o bloco central',
        description: 'Correr para o meio-campo defensivo para fechar linhas de passe.',
        badge: 'Estrutura',
        weights: { tacticalIQ: 25, defending: 15, mental: 10 },
        positionAffinity: ['MCD', 'MC', 'DEC']
      },
      {
        id: '5c',
        label: 'Antecipar o passe de saída do adversário',
        description: 'Ler as opções do rival para intercetar e lançar o contra-ataque.',
        badge: 'Leitura',
        weights: { tacticalIQ: 25, passing: 15, speed: 10 },
        positionAffinity: ['MCD', 'DEC', 'LAT']
      },
      {
        id: '5d',
        label: 'Ficar aberto como referência de contra-ataque',
        description: 'Oferecer passe longo imediato assim que a bola for recuperada.',
        badge: 'Desmarcação',
        weights: { speed: 20, finishing: 20, mental: 10 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 6,
    category: 'Technical',
    title: '6. No último terço do campo, qual é a jogada que mais tenta?',
    subtitle: 'A sua tomada de decisão no momento decisivo de golo.',
    options: [
      {
        id: '6a',
        label: 'Passe a rasgar nas costas da defesa',
        description: 'Isolar o avançado cara a cara com o guarda-redes.',
        badge: 'Assistência',
        weights: { passing: 25, tacticalIQ: 20, technique: 10 },
        positionAffinity: ['MPO', 'MC', 'EXT']
      },
      {
        id: '6b',
        label: 'Remate de média ou longa distância',
        description: 'Aproveitar qualquer brecha para disparar com força e colocação.',
        badge: 'Rematador',
        weights: { finishing: 25, technique: 15, mental: 10 },
        positionAffinity: ['MPO', 'MC', 'DC', 'EXT']
      },
      {
        id: '6c',
        label: 'Drible individual e cruzamento tenso',
        description: 'Ultrapassar o lateral e servir o homem da área com vantagem.',
        badge: 'Cruzador',
        weights: { technique: 20, speed: 20, passing: 15 },
        positionAffinity: ['EXT', 'LAT']
      },
      {
        id: '6d',
        label: 'Desmarcação rápida ao primeiro ou segundo poste',
        description: 'Atacar o cruzamento com determinação para fazer o golo.',
        badge: 'Finalizador',
        weights: { finishing: 25, speed: 15, mental: 15 },
        positionAffinity: ['DC', 'EXT']
      }
    ]
  },
  {
    id: 7,
    category: 'Mental',
    title: '7. Qual é a sua principal postura e liderança dentro do grupo?',
    subtitle: 'O impacto intangível no caráter e espírito competitivo da equipa.',
    options: [
      {
        id: '7a',
        label: 'Líder comunicativo que organiza a equipa',
        description: 'Dar instruções constantes, corrigir marcações e exigir concentração.',
        badge: 'Capitão',
        weights: { mental: 25, tacticalIQ: 20, defending: 10 },
        positionAffinity: ['DEC', 'MCD', 'POR', 'MC']
      },
      {
        id: '7b',
        label: 'Líder silencioso que fala com a entrega',
        description: 'Dar o máximo em cada disputa para contagiar os companheiros.',
        badge: 'Guerreiro',
        weights: { mental: 25, physical: 20, defending: 10 },
        positionAffinity: ['LAT', 'MC', 'MCD', 'DEC']
      },
      {
        id: '7c',
        label: 'Jogador decisivo com rasgos de genialidade',
        description: 'Aparecer nos momentos cruciais para resolver o jogo numa jogada individual.',
        badge: 'Craque',
        weights: { mental: 20, technique: 20, finishing: 15 },
        positionAffinity: ['EXT', 'MPO', 'DC']
      },
      {
        id: '7d',
        label: 'Parceiro tático que simplifica o jogo de todos',
        description: 'Dar sempre linha de passe, jogar simples e valorizar os colegas.',
        badge: 'Conector',
        weights: { passing: 20, tacticalIQ: 20, mental: 15 },
        positionAffinity: ['MC', 'LAT', 'MCD']
      }
    ]
  },
  {
    id: 8,
    category: 'Physical',
    title: '8. Qual é o seu pé dominante e como utiliza o pé fraco?',
    subtitle: 'O domínio dos dois pés multiplica opções e linhas de passe.',
    options: [
      {
        id: '8a',
        label: 'Destro especialista',
        description: 'Pé direito letal para passe e remate; pé esquerdo apenas para segurança.',
        badge: 'Destro',
        weights: { technique: 15, passing: 15 },
        positionAffinity: ['DEC', 'MC', 'LAT', 'EXT', 'DC']
      },
      {
        id: '8b',
        label: 'Canhoto natural',
        description: 'Perfil canhoto elegante, ideal para ala esquerda ou extremo invertido.',
        badge: 'Canhoto',
        weights: { technique: 18, passing: 15 },
        positionAffinity: ['LAT', 'EXT', 'MPO', 'DEC']
      },
      {
        id: '8c',
        label: 'Ambidestro / Excelente domínio com ambos os pés',
        description: 'Imprevisível para os defesas, finaliza e sai para os dois lados.',
        badge: 'Ambidestro',
        weights: { technique: 25, passing: 20, finishing: 15 },
        positionAffinity: ['MPO', 'EXT', 'DC', 'MC']
      },
      {
        id: '8d',
        label: 'Destro com bom uso do pé não dominante',
        description: 'Direita dominante com passe e apoio fluido com a esquerda.',
        badge: 'Destro Versátil',
        weights: { technique: 18, passing: 18 },
        positionAffinity: ['MC', 'MCD', 'LAT', 'DC']
      }
    ]
  },
  {
    id: 9,
    category: 'Mental',
    title: '9. Quando o adversário se fecha em bloco baixo, como tenta desequilibrar?',
    subtitle: 'Superar defesas compactas exige soluções táticas específicas.',
    options: [
      {
        id: '9a',
        label: 'Circulo a bola rapidamente de ala a ala',
        description: 'Mover a posse com paciência até surgir o intervalo interior.',
        badge: 'Controlo',
        weights: { passing: 25, tacticalIQ: 20, mental: 10 },
        positionAffinity: ['MC', 'MCD', 'DEC']
      },
      {
        id: '9b',
        label: 'Procuro o 1v1 para desmontar a marcação',
        description: 'Atrair apoios defensivos e criar superioridade numérica.',
        badge: 'Desequilíbrio',
        weights: { technique: 25, speed: 20, finishing: 10 },
        positionAffinity: ['EXT', 'MPO']
      },
      {
        id: '9c',
        label: 'Arrisco o remate de longe para obrigar o bloco a subir',
        description: 'Tentar a sorte de fora da área com remates potentes.',
        badge: 'Remate',
        weights: { finishing: 25, technique: 15, physical: 10 },
        positionAffinity: ['MC', 'MPO', 'DC']
      },
      {
        id: '9d',
        label: 'Ataco os cruzamentos nas bolas aéreas',
        description: 'Usar a impulsão e cabeceamento nas bolas colocadas na área.',
        badge: 'Jogo Aéreo',
        weights: { physical: 25, finishing: 20, mental: 10 },
        positionAffinity: ['DC', 'DEC']
      }
    ]
  },
  {
    id: 10,
    category: 'Spatial',
    title: '10. Qual é a sua maior satisfação pessoal durante um jogo de futebol?',
    subtitle: 'A recompensa emocional que alimenta o seu espírito competitivo.',
    options: [
      {
        id: '10a',
        label: 'Marcar um golo ou fazer uma assistência decisiva',
        description: 'Decidir o resultado e festejar com a equipa.',
        badge: 'Golo',
        weights: { finishing: 20, passing: 20, speed: 10 },
        positionAffinity: ['DC', 'EXT', 'MPO']
      },
      {
        id: '10b',
        label: 'Fazer um desarme limpo ou corte decisivo',
        description: 'Evitar um golo iminente e manter a baliza a zeros.',
        badge: 'Muralha',
        weights: { defending: 25, physical: 15, tacticalIQ: 15 },
        positionAffinity: ['DEC', 'MCD', 'POR', 'LAT']
      },
      {
        id: '10c',
        label: 'Fazer uma exibição de passes quase perfeita',
        description: 'Dominar o meio-campo com mais de 90% de eficácia no passe.',
        badge: 'Maestro',
        weights: { passing: 25, tacticalIQ: 25, technique: 15 },
        positionAffinity: ['MC', 'MCD', 'MPO']
      },
      {
        id: '10d',
        label: 'Superar fisicamente o adversário direto durante os 90 minutos',
        description: 'Saber que o adversário terminou o jogo esgotado pela sua entrega.',
        badge: 'Atleta',
        weights: { physical: 25, speed: 15, defending: 15 },
        positionAffinity: ['LAT', 'MC', 'DEC', 'DC']
      }
    ]
  }
];

export function getLocalizedQuestions(lang: Language): Question[] {
  switch (lang) {
    case 'en': return FOOTBALL_QUESTIONS_EN;
    case 'pt': return FOOTBALL_QUESTIONS_PT;
    case 'es':
    default:
      return FOOTBALL_QUESTIONS_ES;
  }
}

// Backward compatibility
export const FOOTBALL_QUESTIONS = FOOTBALL_QUESTIONS_ES;
