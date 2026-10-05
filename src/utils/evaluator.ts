import { AssessmentResult, PositionCategory, SkillScores, TacticalZone } from '../types';
import { getLocalizedQuestions } from '../data/questions';
import { PRO_PLAYERS } from '../data/proPlayers';
import { DRILLS_DATABASE, getLocalizedDrills } from '../data/drills';
import { Language } from '../data/translations';

interface PositionTextMeta {
  title: string;
  subtitle: string;
  desc: string;
}

const POSITION_METADATA_BY_LANG: Record<Language, Record<PositionCategory, PositionTextMeta>> = {
  en: {
    EXT: {
      title: 'Inverted Winger / Wide Threat',
      subtitle: 'Flank dagger cutting inside towards goal',
      desc: 'You stand out for sudden change of pace, 1v1 take-on ability, and destabilizing defensive blocks in the final third. Your game combines acceleration and audacity.'
    },
    MPO: {
      title: 'Attacking Midfielder / Creative Interior',
      subtitle: 'Tactical playmaker between the lines',
      desc: 'You possess elite pitch vision and the agility to turn in compact spaces. Threading through balls and linking midfield with attack are your signature hallmarks.'
    },
    MC: {
      title: 'Box-to-Box Central Midfielder',
      subtitle: 'Relentless all-pitch engine with late runs',
      desc: 'Your athletic engine and tactical reading allow you to dominate both halves. You provide defensive balance, dictate tempo, and arrive dangerously in the box.'
    },
    MCD: {
      title: 'Defensive Anchor / Deep-Lying Pivot',
      subtitle: 'Tactical balance and backline shield',
      desc: 'You are the linchpin holding team structure together. You anticipate opposition attacks, secure the first phase of build-up, and maintain defensive discipline.'
    },
    LAT: {
      title: 'Dynamic Wing-Back / Overlapping Fullback',
      subtitle: 'Tireless flank runner with end-to-end drive',
      desc: 'Your sprint stamina and crossing ability make you master of the touchline. You provide offensive width with dangerous deliveries while recovering quickly.'
    },
    DC: {
      title: 'Clinical Center Forward / Poacher',
      subtitle: 'Box predator and ruthless finisher',
      desc: 'You thrive on goals, attacking crosses, and explosive runs behind center-backs. You excel in clinical 1-touch finishing, anticipation, and box movement.'
    },
    DEC: {
      title: 'Commanding Center Back',
      subtitle: 'Defensive wall and defensive leader',
      desc: 'You impose authority in individual duels and aerial battles. You marshal the defensive line with vocal leadership and provide clean ball progression.'
    },
    POR: {
      title: 'Modern Sweeper-Keeper',
      subtitle: 'Final barrier and first attacker',
      desc: 'Lightning reflexes between the posts, commanding aerial presence, and composed footwork to initiate build-up play from the back.'
    }
  },
  es: {
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
  },
  pt: {
    EXT: {
      title: 'Extremo Invertido / Desequilibrador',
      subtitle: 'Punhal na ala com diagonal para a baliza',
      desc: 'Destaca-se pela mudança de velocidade, qualidade no 1v1 e capacidade de desequilibrar no último terço. O seu jogo alia aceleração e audácia.'
    },
    MPO: {
      title: 'Médio Ofensivo / Criador de Jogo',
      subtitle: 'Cérebro tático entrelinhas',
      desc: 'Possui uma visão de jogo apurada e facilidade em rodar em espaços curtos. Passes de rutura e ligar o meio-campo ao ataque são as suas maiores forças.'
    },
    MC: {
      title: 'Médio Centro Box-to-Box',
      subtitle: 'Motor todo-o-terreno com chegada à área',
      desc: 'O seu vigor físico e leitura tática permitem-lhe cobrir todo o campo. Traz equilíbrio defensivo, distribui com critério e surge com perigo na segunda vaga.'
    },
    MCD: {
      title: 'Médio Defensivo / Trinco Posicional',
      subtitle: 'Âncora tática e equilíbrio da equipa',
      desc: 'É a bússola que sustenta a estrutura da equipa. Antecipa transições adversárias, garante a primeira saída de bola e mantém a ordem defensiva.'
    },
    LAT: {
      title: 'Lateral Ofensivo / Ala de Corredor',
      subtitle: 'Ala incansável de vaivém constante',
      desc: 'A sua velocidade e resistência tornam-no dono do corredor. Confere profundidade ofensiva com cruzamentos tensos e consistência nas transições defensivas.'
    },
    DC: {
      title: 'Ponta de Lança Matador / Finalizador',
      subtitle: 'Predador de área e homem-golo',
      desc: 'Vive do golo e de desmarcações rápidas nas costas dos centrais. Destaca-se pelo instinto de área, remate a 1 toque e frieza no momento da finalização.'
    },
    DEC: {
      title: 'Defesa Central Imponente',
      subtitle: 'Muralha defensiva e líder de setor',
      desc: 'Impõe autoridade nos duelos individuais e no jogo aéreo. Lidera a linha recuada com comunicação ativa e assegura uma primeira fase de construção limpa.'
    },
    POR: {
      title: 'Guarda-Redes Moderno',
      subtitle: 'Última barreira e primeiro construtor',
      desc: 'Reflexos rápidos entre os postes, autoridade no jogo aéreo e excelente jogo de pés para construir desde trás com serenidade.'
    }
  }
};

const SKILL_NAMES_BY_LANG: Record<Language, Record<keyof SkillScores, string>> = {
  en: {
    speed: 'Pace & Explosive Burst',
    technique: 'Technique & Ball Mastery',
    finishing: 'Finishing & Shot Precision',
    passing: 'Passing & Tactical Vision',
    defending: 'Interceptions & Tackling',
    physical: 'Athleticism & Stamina',
    tacticalIQ: 'Tactical IQ & Game Reading',
    mental: 'Mental Drive & Leadership'
  },
  es: {
    speed: 'Velocidad y Explosividad',
    technique: 'Técnica y Control de Balón',
    finishing: 'Remate y Definición',
    passing: 'Pase y Visión de Juego',
    defending: 'Recuperación y Marcaje',
    physical: 'Físico y Resistencia',
    tacticalIQ: 'Inteligencia y Lectura Táctica',
    mental: 'Carácter y Liderazgo Mental'
  },
  pt: {
    speed: 'Velocidade e Aceleração',
    technique: 'Técnica e Domínio de Bola',
    finishing: 'Finalização e Remate',
    passing: 'Passe e Visão Tática',
    defending: 'Desarme e Interceção',
    physical: 'Físico e Resistência',
    tacticalIQ: 'Inteligência e Leitura de Jogo',
    mental: 'Caráter e Liderança'
  }
};

export function calculateAssessment(
  playerName: string,
  preferredFoot: 'Diestro' | 'Zurdo' | 'Ambidestro' | 'Right-footed' | 'Left-footed' | 'Ambidextrous' | 'Destro' | 'Canhoto',
  answers: Record<number, string>,
  lang: Language = 'en'
): AssessmentResult {
  const currentLang = lang || 'en';
  const questions = getLocalizedQuestions(currentLang);

  // Base scores starting at 52
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
  questions.forEach((q) => {
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
  if (preferredFoot === 'Ambidestro' || preferredFoot === 'Ambidextrous') {
    scores.technique = Math.min(99, scores.technique + 6);
    scores.passing = Math.min(99, scores.passing + 5);
  }

  // Determine top position
  const sortedPositions = Object.entries(positionCount)
    .sort((a, b) => b[1] - a[1]) as [PositionCategory, number][];

  const primaryCode = sortedPositions[0][0] || 'MC';
  const positionMetadata = POSITION_METADATA_BY_LANG[currentLang] || POSITION_METADATA_BY_LANG.en;
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
    let diff = 0;
    Object.keys(scores).forEach((k) => {
      const key = k as keyof SkillScores;
      diff += Math.abs(scores[key] - player.stats[key]);
    });
    if (player.positionCategory === primaryCode) {
      diff -= 15;
    }
    if (diff < bestDifference) {
      bestDifference = diff;
      bestPlayerMatch = player;
    }
  });

  const proMatchPercentage = Math.min(97, Math.max(76, Math.round(98 - bestDifference * 0.22)));
  const tacticalZones = getLocalizedTacticalZones(primaryCode, currentLang);

  const sortedSkills = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]) as [keyof SkillScores, number][];

  const skillNameMap = SKILL_NAMES_BY_LANG[currentLang] || SKILL_NAMES_BY_LANG.en;

  let strengths: string[] = [];
  let areasToImprove: string[] = [];
  let matchReason = '';

  if (currentLang === 'en') {
    strengths = [
      `Outstanding ${skillNameMap[sortedSkills[0][0]]} (${sortedSkills[0][1]}/99).`,
      `High proficiency in ${skillNameMap[sortedSkills[1][0]]} (${sortedSkills[1][1]}/99).`,
      `Strong decision-making profile tailored for ${primaryMeta.title.split('/')[0]}.`
    ];
    const lowestSkills = sortedSkills.slice(-2);
    areasToImprove = [
      `Enhance ${skillNameMap[lowestSkills[0][0]]} (${lowestSkills[0][1]}/99) for all-around dominance.`,
      `Refine ${skillNameMap[lowestSkills[1][0]]} (${lowestSkills[1][1]}/99) with targeted repetitions.`,
      `Sharpen pre-reception 360° shoulder scanning.`
    ];
    matchReason = `Your playing style shares ${proMatchPercentage}% biological and tactical similarity with ${bestPlayerMatch.name}. You stand out for your combination of ${skillNameMap[sortedSkills[0][0]].toLowerCase()} and ${skillNameMap[sortedSkills[1][0]].toLowerCase()}.`;
  } else if (currentLang === 'pt') {
    strengths = [
      `Excelente ${skillNameMap[sortedSkills[0][0]]} (${sortedSkills[0][1]}/99).`,
      `Elevada capacidade em ${skillNameMap[sortedSkills[1][0]]} (${sortedSkills[1][1]}/99).`,
      `Perfil sólido de tomada de decisão para ${primaryMeta.title.split('/')[0]}.`
    ];
    const lowestSkills = sortedSkills.slice(-2);
    areasToImprove = [
      `Potenciar ${skillNameMap[lowestSkills[0][0]]} (${lowestSkills[0][1]}/99) para maior versatilidade.`,
      `Reforçar ${skillNameMap[lowestSkills[1][0]]} (${lowestSkills[1][1]}/99) com treinos específicos.`,
      `Aperfeiçoar o rastreio visual 360° antes da receção da bola.`
    ];
    matchReason = `O seu estilo de jogo partilha ${proMatchPercentage}% de afinidade com ${bestPlayerMatch.name}. Destaca-se pela combinação de ${skillNameMap[sortedSkills[0][0]].toLowerCase()} e ${skillNameMap[sortedSkills[1][0]].toLowerCase()}.`;
  } else {
    strengths = [
      `Excelente ${skillNameMap[sortedSkills[0][0]]} (${sortedSkills[0][1]}/99).`,
      `Alta capacidad en ${skillNameMap[sortedSkills[1][0]]} (${sortedSkills[1][1]}/99).`,
      `Fuerte perfil para la toma de decisiones como ${primaryMeta.title.split('/')[0]}.`
    ];
    const lowestSkills = sortedSkills.slice(-2);
    areasToImprove = [
      `Potenciar ${skillNameMap[lowestSkills[0][0]]} (${lowestSkills[0][1]}/99) para ser más completo.`,
      `Reforzar ${skillNameMap[lowestSkills[1][0]]} (${lowestSkills[1][1]}/99) con repeticiones específicas.`,
      `Sincronización en el escaneo periférico antes de recibir el balón.`
    ];
    matchReason = `Tu estilo de juego comparte un ${proMatchPercentage}% de afinidad biológica y técnica con ${bestPlayerMatch.name}. Destacas por tu combinación de ${skillNameMap[sortedSkills[0][0]].toLowerCase()} y ${skillNameMap[sortedSkills[1][0]].toLowerCase()}.`;
  }

  const localizedPool = getLocalizedDrills(currentLang);
  const recommendedDrills = localizedPool.filter(
    (d) => d.targetPositions.includes(primaryCode) || d.targetPositions.includes(secondaryPositions[0]?.code)
  ).slice(0, 3);

  if (recommendedDrills.length < 3) {
    recommendedDrills.push(...localizedPool.slice(0, 3 - recommendedDrills.length));
  }

  const defaultPlayerName = currentLang === 'en' ? 'Strike AI Player' : currentLang === 'pt' ? 'Jogador Strike AI' : 'Jugador CoachStrike';

  return {
    id: `eval-${Date.now()}`,
    createdAt: new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : currentLang === 'pt' ? 'pt-BR' : 'es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    playerName: playerName || defaultPlayerName,
    preferredFoot: preferredFoot as any,
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
      matchReason
    },
    tacticalZones,
    strengths,
    areasToImprove,
    recommendedDrills
  };
}

function getLocalizedTacticalZones(pos: PositionCategory, lang: Language): TacticalZone[] {
  if (lang === 'en') {
    switch (pos) {
      case 'EXT':
        return [
          { pitchX: 78, pitchY: 20, radius: 22, label: 'Primary 1v1 Flank Channel', roleDescription: 'Receiving wide to feet to engage fullback in 1v1 and attack byline.' },
          { pitchX: 82, pitchY: 45, radius: 18, label: 'Half-Space Cut & Strike Zone', roleDescription: 'Inverted diagonal runs aiming for far-corner strike or cutback pass.' }
        ];
      case 'MPO':
        return [
          { pitchX: 68, pitchY: 50, radius: 25, label: 'Playmaker Pocket (Between Lines)', roleDescription: 'Receiving behind opposition pivot to slip clinical through-balls.' },
          { pitchX: 75, pitchY: 35, radius: 16, label: 'Final-Third Assist Hub', roleDescription: 'Rapid 1-2 wall passes with center forward and long-range shooting.' }
        ];
      case 'MC':
        return [
          { pitchX: 52, pitchY: 50, radius: 28, label: 'Central Engine Room', roleDescription: 'Tempo control, short combinations and end-to-end box presence.' },
          { pitchX: 72, pitchY: 50, radius: 18, label: 'Second-Wave Arrival Zone', roleDescription: 'Late arrivals onto edge-of-box cutbacks and loose clearance balls.' }
        ];
      case 'MCD':
        return [
          { pitchX: 38, pitchY: 50, radius: 26, label: 'Defensive Anchor & Distribution Hub', roleDescription: 'Lateral covering, breaking line-penetrating passes and initiating build-up.' },
          { pitchX: 28, pitchY: 50, radius: 20, label: 'Fullback Cover Zone', roleDescription: 'Providing defensive coverage when fullbacks push forward into attack.' }
        ];
      case 'LAT':
        return [
          { pitchX: 55, pitchY: 85, radius: 25, label: 'Touchline Flank Corridor', roleDescription: 'Deep overlapping runs providing width and whipping crosses into the box.' },
          { pitchX: 30, pitchY: 80, radius: 20, label: 'Defensive Recovery Channel', roleDescription: 'Closing the wide corridor against opposition counter-attacks.' }
        ];
      case 'DC':
        return [
          { pitchX: 88, pitchY: 50, radius: 22, label: 'Penalty Box & 6-Yard Poaching Hub', roleDescription: 'Pinning center-backs, darting to the near post and 1-touch finishing.' },
          { pitchX: 78, pitchY: 50, radius: 18, label: 'Link-Up & Hold-Up Zone', roleDescription: 'Back-to-goal hold-up play setting up incoming midfielders.' }
        ];
      case 'DEC':
        return [
          { pitchX: 20, pitchY: 50, radius: 28, label: 'Backline Shield & Duel Zone', roleDescription: 'Dominating high balls, aerial clearances and composed first pass.' },
          { pitchX: 12, pitchY: 50, radius: 18, label: 'Goal Protection Last Line', roleDescription: 'Final barrier executing goal-saving blocks and emergency tackles.' }
        ];
      default:
        return [
          { pitchX: 10, pitchY: 50, radius: 25, label: '6-Yard Box & Goal Area', roleDescription: 'Commanding aerial crosses, shot-stopping and starting play from deep.' }
        ];
    }
  }

  if (lang === 'pt') {
    switch (pos) {
      case 'EXT':
        return [
          { pitchX: 78, pitchY: 20, radius: 22, label: 'Zona Principal de Drible e Ala', roleDescription: 'Receção aberta na linha para encarar no 1v1 e ganhar linha de fundo.' },
          { pitchX: 82, pitchY: 45, radius: 18, label: 'Diagonal Interior e Remate', roleDescription: 'Corte para dentro a pé trocado à procura do remate ou passe atrasado.' }
        ];
      case 'MPO':
        return [
          { pitchX: 68, pitchY: 50, radius: 25, label: 'Zona de Criador (Entrelinhas)', roleDescription: 'Receção nas costas do trinco adversário para assistir com precisão.' },
          { pitchX: 75, pitchY: 35, radius: 16, label: 'Canal de Assistência', roleDescription: 'Tabelas rápidas com o avançado e remate de média distância.' }
        ];
      case 'MC':
        return [
          { pitchX: 52, pitchY: 50, radius: 28, label: 'Eixo Central do Meio-Campo', roleDescription: 'Construção do jogo, passe curto e chegada contínua às duas áreas.' },
          { pitchX: 72, pitchY: 50, radius: 18, label: 'Chegada da 2ª Vaga', roleDescription: 'Aproveitamento de ressaltos à entrada da grande área.' }
        ];
      case 'MCD':
        return [
          { pitchX: 38, pitchY: 50, radius: 26, label: 'Âncora Defensiva e Primeira Saída', roleDescription: 'Coberturas, interceção de passes interiores e distribuição fluida.' },
          { pitchX: 28, pitchY: 50, radius: 20, label: 'Zona de Cobertura ao Lateral', roleDescription: 'Apoio defensivo quando os laterais sobem no terreno.' }
        ];
      case 'LAT':
        return [
          { pitchX: 55, pitchY: 85, radius: 25, label: 'Corredor Lateral Direito/Esquerdo', roleDescription: 'Projeção ofensiva contínua para dar largura e cruzar para a área.' },
          { pitchX: 30, pitchY: 80, radius: 20, label: 'Zona de Recuperação', roleDescription: 'Fecho do corredor nas transições defensivas rápidas.' }
        ];
      case 'DC':
        return [
          { pitchX: 88, pitchY: 50, radius: 22, label: 'Grande Área e Marca de Penálti', roleDescription: 'Fixar os centrais, atacar o primeiro poste e finalizar a um toque.' },
          { pitchX: 78, pitchY: 50, radius: 18, label: 'Zona de Apoio e Pivô', roleDescription: 'Segurar de costas para servir os médios que chegam de trás.' }
        ];
      case 'DEC':
        return [
          { pitchX: 20, pitchY: 50, radius: 28, label: 'Zona de Corte e Marcação', roleDescription: 'Domínio do jogo aéreo, interceções e saída de bola limpa.' },
          { pitchX: 12, pitchY: 50, radius: 18, label: 'Proteção da Baliza', roleDescription: 'Última muralha defensiva em corte de emergência.' }
        ];
      default:
        return [
          { pitchX: 10, pitchY: 50, radius: 25, label: 'Pequena Área', roleDescription: 'Controlo do espaço aéreo, saídas aos pés e liderança defensiva.' }
        ];
    }
  }

  // Spanish default
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
