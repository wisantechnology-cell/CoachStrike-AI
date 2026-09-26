import { Drill } from '../types';

export const DRILLS_DATABASE: Drill[] = [
  {
    id: 'drill-1',
    title: 'Control Orientado + Pase Filtrado en Zonas Reducidas',
    category: 'Técnica',
    difficulty: 'Intermedio',
    durationMinutes: 20,
    sets: '4 series',
    reps: '8 repeticiones por perfil',
    equipmentNeeded: ['4 conos', '2 balones', '1 estaca/maniquí'],
    description: 'Mejora la velocidad de reacción y la precisión al recibir bajo presión simulada y buscar el pase gol.',
    steps: [
      'Ponte a 5 metros del pasador situado frente a la estaca.',
      'Solicita el balón con un movimiento de engaño (finta hacia la izquierda).',
      'Realiza un control orientado con el interior del pie derecho cruzando por detrás del maniquí.',
      'Sin acelerar de más, filtra un pase raso entre las dos picas a un compañero que ataca el espacio.'
    ],
    proTip: 'Asegúrate de mirar por encima del hombro (escaneo visual) antes de recibir el balón.',
    targetPositions: ['MPO', 'MC', 'EXT', 'DC'],
    diagramType: 'pass-cone'
  },
  {
    id: 'drill-2',
    title: 'Circuito Slalom de Agilidad + Disparo Tras Encarar en 1v1',
    category: 'Finalización',
    difficulty: 'Avanzado',
    durationMinutes: 25,
    sets: '5 series',
    reps: '6 repeticiones por lado',
    equipmentNeeded: ['6 picas verticales', '1 portería', '4 balones'],
    description: 'Desarrolla el regate seco, la aceleración corta y la templanza en la definición ajustada al palo.',
    steps: [
      'Arranca a máxima velocidad sorteando 4 picas en zigzag sin tocar los conitos.',
      'Al salir del último cono, recibe el pase en diagonal enviando el balón hacia tu perfil hábil.',
      'Realiza una finta de disparo o bicicleta frente al defensor fijado.',
      'Define con el interior al palo largo antes de que la línea defensiva recupere posición.'
    ],
    proTip: 'Arma la pierna rápido; el portero no debe anticipar el momento exacto del impacto.',
    targetPositions: ['EXT', 'DC', 'MPO'],
    diagramType: 'shooting-box'
  },
  {
    id: 'drill-3',
    title: 'Transición Defensiva: Presión Tras Pérdida en Cuadrado de 4v2',
    category: 'Táctica',
    difficulty: 'Avanzado',
    durationMinutes: 30,
    sets: '3 bloques de 8 mins',
    reps: 'Rotación continua',
    equipmentNeeded: ['4 conos delimitadores', '1 peto de color', '1 balón'],
    description: 'Automatiza el chip mental de asfixiar al rival en los primeros 5 segundos tras perder la posesión.',
    steps: [
      'Delimita un espacio de 12x12 metros con 4 atacantes exteriores y 2 defensores interiores.',
      'Si pierdes el pase como atacante, te conviertes inmediatamente en el primer presionador.',
      'El compañero más cercano debe cerrar la vía de pase diagonal mientras el presionador achica espacio.',
      'Gana el punto si recuperas el balón antes de los 4 toques del rival.'
    ],
    proTip: 'La presión no es correr sin sentido: es orientar al rival hacia la línea de banda o su pierna mala.',
    targetPositions: ['MCD', 'MC', 'LAT', 'DEC'],
    diagramType: 'pressing-square'
  },
  {
    id: 'drill-4',
    title: 'Sprint de Recorrido + Centro Preciso desde la Banda',
    category: 'Físico',
    difficulty: 'Intermedio',
    durationMinutes: 20,
    sets: '4 series',
    reps: '6 centros por banda',
    equipmentNeeded: ['Conos de salida', 'Balones en el vértice', '2 rematadores'],
    description: 'Especial para laterales y extremos que necesitan mantener precisión técnica tras un esfuerzo aeróbico intenso.',
    steps: [
      'Realiza un sprint de 20 metros desde el centro del campo hasta la línea de banda.',
      'Pisa el balón o recibe el pase al espacio sin reducir la marcha.',
      'Orienta el cuerpo en 45 grados y ejecuta un centro tenso entre el punto de penalti y el área pequeña.',
      'Vuelve a máxima velocidad a tu posición inicial trotando de espaldas.'
    ],
    proTip: 'Si el centro va a media altura y con rosca hacia afuera, es casi imposible de despejar para el central.',
    targetPositions: ['LAT', 'EXT'],
    diagramType: 'dribble-slalom'
  },
  {
    id: 'drill-5',
    title: 'Anticipación y Duelo Aéreo con Salida de Balón Limpia',
    category: 'Visión',
    difficulty: 'Avanzado',
    durationMinutes: 25,
    sets: '5 series',
    reps: '8 duelos ganados',
    equipmentNeeded: ['Balón medicinal de 2kg', 'Balón de fútbol', '1 atacante alto'],
    description: 'Perfecciona el salto en suspensión, el despeje orientado hacia zonas libres de peligro.',
    steps: [
      'Inicia de espaldas al delantero rival.',
      'A la señal sonora del entrenador, gira, calcula la trayectoria del balón aéreo y salta atacando la pelota.',
      'Despeja con la frente orientando la pelota hacia una de las bandas (no al centro).',
      'Cae sobre ambas piernas y da dos pasos al frente para achicar el espacio del rival.'
    ],
    proTip: 'Utiliza los brazos para proteger tu espacio de salto sin cometer falta.',
    targetPositions: ['DEC', 'MCD', 'POR'],
    diagramType: 'pass-cone'
  }
];
