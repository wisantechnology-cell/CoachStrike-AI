import { AssessmentResult, PositionCategory, SkillScores, TacticalZone } from '../types';
import { FOOTBALL_QUESTIONS } from '../data/questions';
import { PRO_PLAYERS } from '../data/proPlayers';
import { DRILLS_DATABASE } from '../data/drills';

export function calculateAssessment(
  playerName: string,
  preferredFoot: 'Diestro' | 'Zurdo' | 'Ambidestro',
  answers: Record<number, string>
): AssessmentResult {
  // Base scores starting at 50
  const scores: SkillScores = {
    speed: 52,
    technique: 55,
    finishing: 50,
    passing: 54,
    defending: 50,
    physical: 52,
    tacticalIQ: 56,
    mental: 55
  };

  const positionCount: Record<PositionCategory, number> = {
    POR: 0,
    DEC: 0,
    LAT: 0,
    MCD: 0,
    MC: 0,
    MPO: 0,
    EXT: 0,
    DC: 0
  };

  // Accumulate weights from selected options
  FOOTBALL_QUESTIONS.forEach((q) => {
    const selectedOptionId = answers[q.id];
    if (!selectedOptionId) return;

    const option = q.options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    // Add weights
    Object.entries(option.weights).forEach(([key, val]) => {
      if (val) {
        const scoreKey = key as keyof SkillScores;
        scores[scoreKey] = Math.min(99, scores[scoreKey] + Math.round(val * 0.85));
      }
    });

    // Add position affinities
    option.positionAffinity.forEach((pos) => {
      positionCount[pos] = (positionCount[pos] || 0) + 1;
    });
  });

  // Foot bonus
  if (preferredFoot === 'Ambidestro') {
    scores.technique = Math.min(99, scores.technique + 6);
    scores.passing = Math.min(99, scores.passing + 5);
  }

  // Determine top position
  const sortedPositions = Object.entries(positionCount)
    .sort((a, b) => b[1] - a[1]) as [PositionCategory, number][];

  const primaryCode = sortedPositions[0][0] || 'MC';

  const positionMetadata: Record<PositionCategory, { title: string; subtitle: string; desc: string }> = {
    EXT: {
      title: 'Extremo Invertido / Desbordador',
      subtitle: 'Puñal en banda con diagonal hacia el gol',
      desc: 'Destacas por tu cambio de ritmo, habilidad en el 1v1 y capacidad para generar desequilibrio en el tercio final. Tu juego combina aceleración y audacia para encarar y finalizar.'
    },
    MPO: {
      title: 'Mediapunta / Interior Creador',
      subtitle: 'Cerebro táctico y brújula entre líneas',
      desc: 'Posees una visión de juego privilegiada y capacidad de girar en espacios reducidos. Filtrar pases decisivos y conectar la medular con el ataque son tus sellos de identidad.'
    },
    MC: {
      title: 'Centrocampista Box-to-Box',
      subtitle: 'Motor todoterreno con llegada',
      desc: 'Tu desplegado físico y lectura de juego te permiten abarcar todo el campo. Aportas equilibrio en defensa, distribuyes con criterio y llegas con peligro desde segunda línea.'
    },
    MCD: {
      title: 'Mediocentro Posicional / Pivote',
      subtitle: 'Ancla táctica y escudero del equipo',
      desc: 'Eres la brújula que sostiene la estructura del equipo. Anticipas los ataques rivales, aseguras la primera salida de balón y mantienes el orden defensivo sin fisuras.'
    },
    LAT: {
      title: 'Lateral de Recorrido / Carrilero',
      subtitle: 'Banda incansable con ida y vuelta',
      desc: 'Tu potencia de sprint y resistencia te convierten en el dueño de la banda. Aportas profundidad ofensiva con centros peligrosos y solidez en el repliegue.'
    },
    DC: {
      title: 'Delantero Centro Mapeador / Poacher',
      subtitle: 'Depredador del área y rematador',
      desc: 'Vives del gol y del desmarque explosivo a la espalda de los centrales. Destacas por tu intuición, capacidad de remate al primer toque y sangre fría en la definición.'
    },
    DEC: {
      title: 'Defensa Central Imponente',
      subtitle: 'Muro defensivo y mariscal de campo',
      desc: 'Impones autoridad en los duelos individuales y juego aéreo. Lideras la línea defensiva con comunicación constante y aseguras una salida limpia de balón.'
    },
    POR: {
      title: 'Guardameta Moderno',
      subtitle: 'Último cerrojo y primer atacante',
      desc: 'Reflejos felinos bajo palos, dominio de las salidas por alto y juego con los pies para iniciar el juego desde el fondo con total templanza.'
    }
  };

  const primaryMeta = positionMetadata[primaryCode];
  const maxHits = Math.max(1, sortedPositions[0][1]);
  const primaryMatch = Math.min(98, Math.max(78, Math.round(82 + (maxHits * 1.5))));

  // Secondary positions
  const secondaryPositions = sortedPositions.slice(1, 3).map(([code, hits]) => ({
    code,
    title: positionMetadata[code].title.split('/')[0].trim(),
    matchPercentage: Math.min(primaryMatch - 2, Math.max(68, Math.round(72 + (hits * 1.8))))
  }));

  // Match Pro Player
  let bestPlayerMatch = PRO_PLAYERS[0];
  let bestDifference = Infinity;

  PRO_PLAYERS.forEach((player) => {
    // calculate average distance between player stats and pro stats
    let diff = 0;
    Object.keys(scores).forEach((k) => {
      const key = k as keyof SkillScores;
      diff += Math.abs(scores[key] - player.stats[key]);
    });
    // Give bonus if same category
    if (player.positionCategory === primaryCode) {
      diff -= 15;
    }
    if (diff < bestDifference) {
      bestDifference = diff;
      bestPlayerMatch = player;
    }
  });

  const proMatchPercentage = Math.min(97, Math.max(76, Math.round(98 - bestDifference * 0.22)));

  // Generate tactical zones on pitch based on position
  const tacticalZones = getTacticalZonesForPosition(primaryCode);

  // Compute strengths & areas to improve
  const sortedSkills = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]) as [keyof SkillScores, number][];

  const skillNameMap: Record<keyof SkillScores, string> = {
    speed: 'Velocidad y Explosividad',
    technique: 'Técnica y Control de Balón',
    finishing: 'Remate y Definición',
    passing: 'Pase y Visión de Juego',
    defending: 'Recuperación y Marcaje',
    physical: 'Físico y Resistencia',
    tacticalIQ: 'Inteligencia y Lectura Táctica',
    mental: 'Carácter y Liderazgo Mental'
  };

  const strengths = [
    `Excelente ${skillNameMap[sortedSkills[0][0]]} (${sortedSkills[0][1]}/99).`,
    `Alta capacidad en ${skillNameMap[sortedSkills[1][0]]} (${sortedSkills[1][1]}/99).`,
    `Fuerte perfil para la toma de decisiones como ${primaryMeta.title.split('/')[0]}.`
  ];

  const lowestSkills = sortedSkills.slice(-2);
  const areasToImprove = [
    `Potenciar ${skillNameMap[lowestSkills[0][0]]} (${lowestSkills[0][1]}/99) para ser más completo.`,
    `Reforzar ${skillNameMap[lowestSkills[1][0]]} (${lowestSkills[1][1]}/99) con repeticiones específicas.`,
    `Sincronización en el escaneo periférico antes de recibir el balón.`
  ];

  // Recommended drills matching target position
  const recommendedDrills = DRILLS_DATABASE.filter(
    (d) => d.targetPositions.includes(primaryCode) || d.targetPositions.includes(secondaryPositions[0]?.code)
  ).slice(0, 3);

  if (recommendedDrills.length < 3) {
    recommendedDrills.push(...DRILLS_DATABASE.slice(0, 3 - recommendedDrills.length));
  }

  return {
    id: `eval-${Date.now()}`,
    createdAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    playerName: playerName || 'Jugador CoachStrike',
    preferredFoot,
    answers,
    primaryPosition: {
      code: primaryCode,
      title: primaryMeta.title,
      subtitle: primaryMeta.subtitle,
      roleDescription: primaryMeta.desc,
      matchPercentage: primaryMatch
    },
    secondaryPositions,
    skills: scores,
    proComparison: {
      player: bestPlayerMatch,
      matchPercentage: proMatchPercentage,
      matchReason: `Tu estilo de juego comparte un ${proMatchPercentage}% de afinidad biológica y técnica con ${bestPlayerMatch.name}. Destacas por tu combinación de ${skillNameMap[sortedSkills[0][0]].toLowerCase()} y ${skillNameMap[sortedSkills[1][0]].toLowerCase()}.`
    },
    tacticalZones,
    strengths,
    areasToImprove,
    recommendedDrills
  };
}

function getTacticalZonesForPosition(pos: PositionCategory): TacticalZone[] {
  switch (pos) {
    case 'EXT':
      return [
        { pitchX: 78, pitchY: 20, radius: 22, label: 'Zona Principal de Desborde', roleDescription: 'Recibo abierto al pie para encarar en 1v1 y ganar línea de fondo.' },
        { pitchX: 82, pitchY: 45, radius: 18, label: 'Zona de Remate/Diagonal', roleDescription: 'Corte interior a pierna cambiada buscando el disparo a puerta o pase atrás.' }
      ];
    case 'MPO':
      return [
        { pitchX: 68, pitchY: 50, radius: 25, label: 'Zona de Mediapunta (Entre Líneas)', roleDescription: 'Recepción a la espalda del pivote rival para filtrar el último pase.' },
        { pitchX: 75, pitchY: 35, radius: 16, label: 'Cárter de Asistencia', roleDescription: 'Asociación rápida para paredes con el delantero o disparo lejano.' }
      ];
    case 'MC':
      return [
        { pitchX: 52, pitchY: 50, radius: 28, label: 'Medular Total', roleDescription: 'Construcción del juego, asociación corta y despliegue hacia ambas áreas.' },
        { pitchX: 72, pitchY: 50, radius: 18, label: 'Llegada desde 2ª Línea', roleDescription: 'Aprovechamiento de los balones divididos al borde del área.' }
      ];
    case 'MCD':
      return [
        { pitchX: 38, pitchY: 50, radius: 26, label: 'Eje Defensivo & Salida', roleDescription: 'Basculación de apoyo, corte de pases filtrados e inicio de la jugada.' },
        { pitchX: 28, pitchY: 50, radius: 20, label: 'Zona de Cobertura', roleDescription: 'Auxilio constante a la espalda de los laterales cuando suben.' }
      ];
    case 'LAT':
      return [
        { pitchX: 55, pitchY: 85, radius: 25, label: 'Carril Lateral Derecha/Izquierda', roleDescription: 'Proyección en profundidad para ofrecer amplitud y lanzar centros.' },
        { pitchX: 30, pitchY: 80, radius: 20, label: 'Zona de Repliegue', roleDescription: 'Cierre del carril en contraataque rival.' }
      ];
    case 'DC':
      return [
        { pitchX: 88, pitchY: 50, radius: 22, label: 'Área Chica & Punto de Penalti', roleDescription: 'Fijar a los centrales, atacar el centro al primer palo y remate.' },
        { pitchX: 78, pitchY: 50, radius: 18, label: 'Zona de Apoyo Rápido', roleDescription: 'Descarga de espaldas para la llegada de los centrocampistas.' }
      ];
    case 'DEC':
      return [
        { pitchX: 20, pitchY: 50, radius: 28, label: 'Zona de Cierre & Marcaje', roleDescription: 'Dominio de los balones colgados, intercepción y salida de balón.' },
        { pitchX: 12, pitchY: 50, radius: 18, label: 'Protección de la Portería', roleDescription: 'Último muro defensivo en situación de emergencia.' }
      ];
    default:
      return [
        { pitchX: 10, pitchY: 50, radius: 25, label: 'Área Pequeña', roleDescription: 'Manejo del espacio aéreo, bloqueos y achiques mano a mano.' }
      ];
  }
}
