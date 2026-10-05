import { Drill } from '../types';
import { Language } from './translations';

export interface LocalizedDrill extends Drill {
  titleByLang?: Record<Language, string>;
  descriptionByLang?: Record<Language, string>;
  stepsByLang?: Record<Language, string[]>;
  proTipByLang?: Record<Language, string>;
  categoryByLang?: Record<Language, string>;
  difficultyByLang?: Record<Language, string>;
}

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

const DRILL_TRANSLATIONS: Record<string, Record<Language, {
  title: string;
  category: string;
  difficulty: string;
  description: string;
  steps: string[];
  proTip: string;
}>> = {
  'drill-1': {
    es: {
      title: 'Control Orientado + Pase Filtrado en Zonas Reducidas',
      category: 'Técnica',
      difficulty: 'Intermedio',
      description: 'Mejora la velocidad de reacción y la precisión al recibir bajo presión simulada y buscar el pase gol.',
      steps: [
        'Ponte a 5 metros del pasador situado frente a la estaca.',
        'Solicita el balón con un movimiento de engaño (finta hacia la izquierda).',
        'Realiza un control orientado con el interior del pie derecho cruzando por detrás del maniquí.',
        'Sin acelerar de más, filtra un pase raso entre las dos picas a un compañero que ataca el espacio.'
      ],
      proTip: 'Asegúrate de mirar por encima del hombro (escaneo visual) antes de recibir el balón.'
    },
    en: {
      title: 'Directional First Touch + Through Ball in Tight Spaces',
      category: 'Technique',
      difficulty: 'Intermediate',
      description: 'Improves reaction speed, composure, and precision when receiving under simulated pressure to deliver the key pass.',
      steps: [
        'Position yourself 5 meters from the passer in front of the dummy mannequin.',
        'Call for the ball with a decoy body feint (drop shoulder to the left).',
        'Execute a directional control with the inside of your right foot sweeping behind the mannequin.',
        'Deliver a crisp ground through-ball between two cones to a teammate attacking open space.'
      ],
      proTip: 'Always perform shoulder checks (visual scanning) before receiving the ball.'
    },
    pt: {
      title: 'Controlo Orientado + Passe a Desmarcar em Espaços Reduzidos',
      category: 'Técnica',
      difficulty: 'Intermédio',
      description: 'Melhora a velocidade de reação e a precisão na receção sob pressão simulada para criar passes de golo.',
      steps: [
        'Coloca-te a 5 metros do passador posicionado em frente ao manequim.',
        'Pede a bola com uma finta de corpo (deslocamento para a esquerda).',
        'Executa um controlo orientado com a parte interior do pé direito contornando o manequim.',
        'Filtra um passe rasteiro entre os dois cones para o colega que ataca o espaço livre.'
      ],
      proTip: 'Garante que olhas por cima do ombro (varredura visual) antes de receber a bola.'
    }
  },
  'drill-2': {
    es: {
      title: 'Circuito Slalom de Agilidad + Disparo Tras Encarar en 1v1',
      category: 'Finalización',
      difficulty: 'Avanzado',
      description: 'Desarrolla el regate seco, la aceleración corta y la templanza en la definición ajustada al palo.',
      steps: [
        'Arranca a máxima velocidad sorteando 4 picas en zigzag sin tocar los conitos.',
        'Al salir del último cono, recibe el pase en diagonal enviando el balón hacia tu perfil hábil.',
        'Realiza una finta de disparo o bicicleta frente al defensor fijado.',
        'Define con el interior al palo largo antes de que la línea defensiva recupere posición.'
      ],
      proTip: 'Arma la pierna rápido; el portero no debe anticipar el momento exacto del impacto.'
    },
    en: {
      title: 'Slalom Agility Course + 1v1 Take-On and Clinical Finish',
      category: 'Finishing',
      difficulty: 'Advanced',
      description: 'Develops explosive change of pace, sharp dribbling, and composure when finishing into the far corner.',
      steps: [
        'Sprint through 4 slalom poles at top speed without touching markers.',
        'Coming out of the final cone, receive a diagonal pass pushing the ball onto your dominant foot.',
        'Execute a shot fake or stepover against the fixed defender.',
        'Curl the ball with the inside of your foot into the far post before defenders recover.'
      ],
      proTip: 'Snap your shooting leg quickly; never let the goalkeeper anticipate the release moment.'
    },
    pt: {
      title: 'Circuito Slalom de Agilidade + Finalização 1v1 Após Drible',
      category: 'Finalização',
      difficulty: 'Avançado',
      description: 'Desenvolve o drible curto, aceleração explosiva e frieza no remate colocado ao poste mais distante.',
      steps: [
        'Arranca à velocidade máxima contornando 4 estacas em ziguezague.',
        'À saída do último cone, recebe o passe em diagonal orientando para o pé dominante.',
        'Executa uma simulação de remate ou pedalada perante o defesa fixado.',
        'Finaliza com o interior do pé colocado ao poste mais distante antes da recuperação adversária.'
      ],
      proTip: 'Arma o remate rapidamente; o guarda-redes não deve antecipar o instante do impacto.'
    }
  },
  'drill-3': {
    es: {
      title: 'Transición Defensiva: Presión Tras Pérdida en Cuadrado de 4v2',
      category: 'Táctica',
      difficulty: 'Avanzado',
      description: 'Automatiza el chip mental de asfixiar al rival en los primeros 5 segundos tras perder la posesión.',
      steps: [
        'Delimita un espacio de 12x12 metros con 4 atacantes exteriores y 2 defensores interiores.',
        'Si pierdes el pase como atacante, te conviertes inmediatamente en el primer presionador.',
        'El compañero más cercano debe cerrar la vía de pase diagonal mientras el presionador achica espacio.',
        'Gana el punto si recuperas el balón antes de los 4 toques del rival.'
      ],
      proTip: 'La presión no es correr sin sentido: es orientar al rival hacia la línea de banda o su pierna mala.'
    },
    en: {
      title: 'Defensive Transition: 4v2 Counter-Pressing Box',
      category: 'Tactics',
      difficulty: 'Advanced',
      description: 'Builds muscle memory to suffocate the opponent within the first 5 seconds of losing possession (Gegenpressing).',
      steps: [
        'Set up a 12x12 meter square with 4 outside attackers and 2 inside pressing defenders.',
        'If you lose the ball as an attacker, immediately become the primary aggressive presser.',
        'The nearest teammate must cut off the diagonal passing lane while you squeeze the carrier.',
        'Score a point if you win back the ball in under 4 touches.'
      ],
      proTip: 'Pressing is not aimless sprinting: funnel the ball carrier toward the touchline or their weak foot.'
    },
    pt: {
      title: 'Transição Defensiva: Pressão Pós-Perda em Quadrado de 4v2',
      category: 'Tática',
      difficulty: 'Avançado',
      description: 'Automatiza a reação mental imediata para asfixiar o adversário nos primeiros 5 segundos após perder a bola.',
      steps: [
        'Delimita um espaço de 12x12 metros com 4 atacantes exteriores e 2 defesas interiores.',
        'Se perderes a bola como atacante, converte-te imediatamente no primeiro pressionador.',
        'O colega mais próximo fecha a linha de passe diagonal enquanto o primeiro pressionador encurta o espaço.',
        'Ganha o ponto se recuperares a bola antes dos 4 toques do adversário.'
      ],
      proTip: 'Pressionar não é correr sem critério: orienta o adversário para a linha lateral ou para o seu pé fraco.'
    }
  },
  'drill-4': {
    es: {
      title: 'Sprint de Recorrido + Centro Preciso desde la Banda',
      category: 'Físico',
      difficulty: 'Intermedio',
      description: 'Especial para laterales y extremos que necesitan mantener precisión técnica tras un esfuerzo aeróbico intenso.',
      steps: [
        'Realiza un sprint de 20 metros desde el centro del campo hasta la línea de banda.',
        'Pisa el balón o recibe el pase al espacio sin reducir la marcha.',
        'Orienta el cuerpo en 45 grados y ejecuta un centro tenso entre el punto de penalti y el área pequeña.',
        'Vuelve a máxima velocidad a tu posición inicial trotando de espaldas.'
      ],
      proTip: 'Si el centro va a media altura y con rosca hacia afuera, es casi imposible de despejar para el central.'
    },
    en: {
      title: 'Full-Back Overlap Sprint + Whipped Cross into the Box',
      category: 'Physical',
      difficulty: 'Intermediate',
      description: 'Designed for fullbacks and wingers who must deliver pinpoint crosses after high-intensity aerobic sprints.',
      steps: [
        'Sprint 20 meters from central midfield towards the touchline.',
        'Control or take the ball in stride without breaking running momentum.',
        'Shape your body at 45 degrees and whip a driven cross between the penalty spot and six-yard box.',
        'Recover backwards at speed to your defensive station.'
      ],
      proTip: 'Whipped out-swinging crosses at mid-height are nearly impossible for center-backs to clear cleanly.'
    },
    pt: {
      title: 'Sprint de Apoio + Cruzamento Tenso da Linha Lateral',
      category: 'Físico',
      difficulty: 'Intermédio',
      description: 'Especial para laterais e extremos que necessitam de manter a precisão técnica após esforço aeróbico intenso.',
      steps: [
        'Executa um sprint de 20 metros do meio-campo até à linha lateral.',
        'Recebe a bola no espaço em progressão sem abrandar o ritmo.',
        'Orienta o corpo a 45 graus e cruza com força entre a marca de penálti e a pequena área.',
        'Recupera a posição a trote rápido de costas.'
      ],
      proTip: 'Cruzamentos com efeito para fora a meia altura são quase impossíveis de cortar para os defesas centrais.'
    }
  },
  'drill-5': {
    es: {
      title: 'Anticipación y Duelo Aéreo con Salida de Balón Limpia',
      category: 'Visión',
      difficulty: 'Avanzado',
      description: 'Perfecciona el salto en suspensión, el despeje orientado hacia zonas libres de peligro.',
      steps: [
        'Inicia de espaldas al delantero rival.',
        'A la señal sonora del entrenador, gira, calcula la trayectoria del balón aéreo y salta atacando la pelota.',
        'Despeja con la frente orientando la pelota hacia una de las bandas (no al centro).',
        'Cae sobre ambas piernas y da dos pasos al frente para achicar el espacio del rival.'
      ],
      proTip: 'Utiliza los brazos para proteger tu espacio de salto sin cometer falta.'
    },
    en: {
      title: 'Aerial Duel Dominance & Clean Build-up Clearance',
      category: 'Vision',
      difficulty: 'Advanced',
      description: 'Perfects vertical jump timing, aggressive aerial anticipation, and directed clearances away from danger.',
      steps: [
        'Start with your back to the opposing striker.',
        'On coach cue, turn, track the aerial trajectory, and attack the highest point of the ball.',
        'Head the ball firmly towards the touchlines rather than central danger zones.',
        'Land on both feet and immediately step up two yards to squeeze team depth.'
      ],
      proTip: 'Use your forearms to claim your jumping space cleanly without committing fouls.'
    },
    pt: {
      title: 'Antecipação e Duelo Aéreo com Saída de Bola Limpa',
      category: 'Visão',
      difficulty: 'Avançado',
      description: 'Aperfeiçoa o salto em suspensão, o corte orientado e a impulsão para anular avançados altos.',
      steps: [
        'Começa de costas para o avançado adversário.',
        'Ao sinal do treinador, roda, calcula a trajetória aérea e ataca a bola no ponto mais alto.',
        'Corta de cabeça orientando a bola para os corredores laterais (nunca para o centro).',
        'Aterra equilibrado e sobe dois metros imediatamente para encurtar a profundidade adversária.'
      ],
      proTip: 'Utiliza os braços para proteger o teu raio de salto sem cometer falta.'
    }
  }
};

/**
 * Returns localized drills based on current user language.
 */
export function getLocalizedDrills(lang: Language = 'es'): Drill[] {
  return DRILLS_DATABASE.map((d) => {
    const tr = DRILL_TRANSLATIONS[d.id]?.[lang] || DRILL_TRANSLATIONS[d.id]?.es;
    if (!tr) return d;
    return {
      ...d,
      title: tr.title,
      category: tr.category as any,
      difficulty: tr.difficulty as any,
      description: tr.description,
      steps: tr.steps,
      proTip: tr.proTip
    };
  });
}
