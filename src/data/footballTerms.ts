import { Language } from './translations';

export interface FootballTermDefinition {
  id: string;
  keyTerms: string[]; // matching aliases e.g. ["bloque bajo", "low block", "bloco baixo"]
  title: Record<Language, string>;
  category: 'Táctica' | 'Posición' | 'Ataque' | 'Defensa' | 'Físico';
  shortDesc: Record<Language, string>;
  fullDesc: Record<Language, string>;
  importance: Record<Language, string>;
  example: Record<Language, string>;
}

export const footballTerms: FootballTermDefinition[] = [
  {
    id: 'bloque-bajo',
    keyTerms: ['bloque bajo', 'low block', 'bloco baixo', 'bloque-bajo', 'low-block'],
    category: 'Defensa',
    title: {
      es: 'Bloque Bajo',
      en: 'Low Block',
      pt: 'Bloco Baixo'
    },
    shortDesc: {
      es: 'Estrategia defensiva donde todo el equipo se repliega cerca de su propia área penal para cerrar espacios.',
      en: 'Defensive strategy where the entire team drops deep near their own penalty box to condense space.',
      pt: 'Estratégia defensiva em que toda a equipa recua para perto da sua grande área para fechar espaços.'
    },
    fullDesc: {
      es: 'El Bloque Bajo consiste en juntar las líneas defensivas y del mediocampo muy cerca del portero (en los últimos 25-30 metros del campo). Minimiza los espacios a la espalda de la defensa y obliga al rival a centrar o tirar de lejos.',
      en: 'The Low Block stacks defensive and midfield lines tight to the goalkeeper (within the last 25-30 meters). It denies space behind the backline and forces opponents into wide crosses or long-range shots.',
      pt: 'O Bloco Baixo consiste em aproximar as linhas defensivas e do meio-campo muito perto do guarda-redes. Minimiza os espaços nas costas da defesa e obriga o adversário a cruzar ou rematar de longe.'
    },
    importance: {
      es: 'Crucial contra equipos dominadores con atacantes veloces en carrera. Requiere máxima concentración y fortaleza en el juego aéreo.',
      en: 'Crucial against possession teams with fast runners. Demands extreme concentration and aerial dominance.',
      pt: 'Crucial contra equipas dominadoras com avançados rápidos. Exige concentração máxima e força no jogo aéreo.'
    },
    example: {
      es: 'El Atlético de Madrid del Cholo Simeone o la Selección de Marruecos en el Mundial 2022.',
      en: 'Diego Simeone’s Atlético Madrid or Morocco’s 2022 World Cup run.',
      pt: 'O Atlético de Madrid de Simeone ou a Seleção de Marrocos no Mundial 2022.'
    }
  },
  {
    id: 'carrilero',
    keyTerms: ['carrilero', 'wing-back', 'wingback', 'ala', 'carrileros'],
    category: 'Posición',
    title: {
      es: 'Carrilero / Wing-back',
      en: 'Wing-back',
      pt: 'Ala / Carrilero'
    },
    shortDesc: {
      es: 'Lateral de banda con alta exigencia física que recorre todo el carril exterior atacando y defendiendo.',
      en: 'Wide defender in 5-defender or 3-CB formations who commands the entire flank offensively and defensively.',
      pt: 'Lateral com grande capacidade física que percorre todo o corredor exterior a atacar e defender.'
    },
    fullDesc: {
      es: 'A diferencia de un lateral tradicional de línea de 4, el carrilero actúa usualmente en esquemas con 3 centrales (3-5-2 o 3-4-3). Tiene libertad absoluta para llegar a línea de fondo rival y colgar centros, pero debe replegar velozmente.',
      en: 'Unlike traditional full-backs in a back 4, wing-backs play in 3-center-back systems. They have license to storm down the flank to cross, but must recover instantly in defense.',
      pt: 'Ao contrário do lateral tradicional numa linha de 4, o ala atua em esquemas com 3 centrais (3-5-2 ou 3-4-3). Tem liberdade total para chegar à linha de fundo e cruzar.'
    },
    importance: {
      es: 'Aporta amplitud al ataque y permite sobrecargar las bandas sin desproteger el carril central.',
      en: 'Provides maximum pitch width and creates wide overloads without exposing central zones.',
      pt: 'Garante amplitude ao ataque e sobrecarrega os corredores laterais.'
    },
    example: {
      es: 'Achraf Hakimi, Alphonso Davies o Denzel Dumfries.',
      en: 'Achraf Hakimi, Alphonso Davies, or Denzel Dumfries.',
      pt: 'Achraf Hakimi, Alphonso Davies ou Denzel Dumfries.'
    }
  },
  {
    id: 'box-to-box',
    keyTerms: ['box-to-box', 'boxtobox', 'caja a caja', 'meia misto', 'mediocentro mixto'],
    category: 'Posición',
    title: {
      es: 'Mediocentro Box-to-Box',
      en: 'Box-to-Box Midfielder',
      pt: 'Meia Box-to-Box'
    },
    shortDesc: {
      es: 'Centrocampista total con resistencia física incansable que abarca de su propia área a la rival.',
      en: 'All-action central midfielder with elite stamina who operates from box to box.',
      pt: 'Médio completo com resistência incansável que atua da sua grande área à área adversária.'
    },
    fullDesc: {
      es: 'Un volante "área a área" combina robo de balón, transición limpia, llegada desde segunda línea y remate de media distancia. Es el motor físico y dinámico del equipo.',
      en: 'A box-to-box midfielder combines tackles, ball progression, late penalty-box runs, and long-range shooting. They are the dynamic engine of the team.',
      pt: 'Um médio área a área combina desarmes, condução de bola, infiltração na área e remates de fora.'
    },
    importance: {
      es: 'Conecta la defensa con el ataque e impone superioridad física en la zona de máquinas.',
      en: 'Links defense with attack and establishes physical dominance in the engine room.',
      pt: 'Conecta a defesa ao ataque e impõe ritmo no meio-campo.'
    },
    example: {
      es: 'Jude Bellingham, Federico Valverde o Steven Gerrard.',
      en: 'Jude Bellingham, Federico Valverde, or Steven Gerrard.',
      pt: 'Jude Bellingham, Federico Valverde ou Steven Gerrard.'
    }
  },
  {
    id: 'extremo-invertido',
    keyTerms: ['extremo invertido', 'inside forward', 'inverted winger', 'extremo-invertido'],
    category: 'Ataque',
    title: {
      es: 'Extremo Invertido',
      en: 'Inside Forward / Inverted Winger',
      pt: 'Extremo Invertido'
    },
    shortDesc: {
      es: 'Atacante de banda que juega a perfil cambiado para enganchar hacia el centro y rematar o filtrar pases.',
      en: 'Wide forward playing on the opposite footed flank who cuts inside to shoot or thread passes.',
      pt: 'Avançado de ala a jogar com pé trocado que flete para o centro para rematar ou cruzar.'
    },
    fullDesc: {
      es: 'Jugador diestro situado en banda izquierda (o zurdo en banda derecha). En lugar de centrar desde la línea de fondo, encara diagonalmente hacia el carril central buscando el disparo o la pared con el delantero.',
      en: 'A right-footed player starting on the left wing (or vice versa). Instead of crossing from the goal line, they drive diagonally inside toward the box to shoot or combine with the striker.',
      pt: 'Jogador destro na ala esquerda (ou canhoto na direita). Flete para dentro procurando o remate ou a tabela.'
    },
    importance: {
      es: 'Genera peligro directo de gol y libera la banda para la proyección del carrilero.',
      en: 'Creates direct goalscoring threat while clearing wide corridors for overlapping full-backs.',
      pt: 'Cria perigo direto de golo e abre espaço para a subida do lateral.'
    },
    example: {
      es: 'Mohamed Salah, Vinícius Jr., Kylian Mbappé o Arjen Robben.',
      en: 'Mohamed Salah, Vinícius Jr., Kylian Mbappé, or Arjen Robben.',
      pt: 'Mohamed Salah, Vinícius Jr., Kylian Mbappé ou Arjen Robben.'
    }
  },
  {
    id: 'tercer-hombre',
    keyTerms: ['tercer hombre', 'third man run', 'terceiro homem', 'tercer-hombre'],
    category: 'Táctica',
    title: {
      es: 'Tercer Hombre',
      en: 'Third Man Concept',
      pt: 'Terceiro Homem'
    },
    shortDesc: {
      es: 'Concepto de pase donde el jugador A atrae marcas hacia B, quien asiste a un jugador C que entra desmarcado.',
      en: 'Passing sequence where player A passes to B to draw defenders, while uncontained player C receives B’s layoff.',
      pt: 'Sequência de passe em que o jogador A toca em B para atrair marcações e B serve o jogador C desmarcado.'
    },
    fullDesc: {
      es: 'Es imposible defender al tercer hombre porque la defensa rival mira la trayectoria del balón hacia el segundo jugador. Cuando el segundo devuelve al primer toque a un tercer compañero en carrera, se rompe cualquier línea defensiva.',
      en: 'The third man is virtually indefensible because defenders orient toward the ball recipient. A quick 1-touch layoff to a third running player instantly shreds defensive lines.',
      pt: 'O terceiro homem é difícil de defender porque os defesas focam na bola. O passe ao primeiro toque desmantela a linha.'
    },
    importance: {
      es: 'Fundamental en el juego de posición para superar presiones asfixiantes.',
      en: 'Essential in positional play to bypass heavy pressure without long balls.',
      pt: 'Fundamental no jogo de posição para superar pressões altas.'
    },
    example: {
      es: 'El FC Barcelona de Pep Guardiola o el Manchester City actual.',
      en: 'Pep Guardiola’s FC Barcelona or modern Manchester City.',
      pt: 'O FC Barcelona de Guardiola ou o Manchester City.'
    }
  },
  {
    id: 'pase-filtrado',
    keyTerms: ['pase filtrado', 'through ball', 'passe filtrado', 'pases filtrados'],
    category: 'Ataque',
    title: {
      es: 'Pase Filtrado',
      en: 'Through Ball',
      pt: 'Passe Filtrado'
    },
    shortDesc: {
      es: 'Envío preciso entre dos defensores hacia la carrera de un compañero que rompe el fuera de juego.',
      en: 'Precise pass driven between defenders into open space for a sprinting teammate.',
      pt: 'Passe preciso metido entre os defesas para a desmarcação em velocidade de um colega.'
    },
    fullDesc: {
      es: 'Un pase raso con la fuerza exacta que supera la línea defensiva rival y permite al atacante quedar en mano a mano frente al guardameta.',
      en: 'A weighted ground pass that splits the opposing backline, leaving the attacker 1-v-1 with the keeper.',
      pt: 'Passe raso na medida certa que rasga a linha defensiva e isola o avançado perante o guarda-redes.'
    },
    importance: {
      es: 'Transforma una posesión horizontal en una ocasión clarísima de gol en un segundo.',
      en: 'Turns side-to-side possession into an immediate clear goal chance in one touch.',
      pt: 'Transforma a posse de bola numa oportunidade clara de golo.'
    },
    example: {
      es: 'Kevin De Bruyne, Luka Modrić o Lionel Messi.',
      en: 'Kevin De Bruyne, Luka Modrić, or Lionel Messi.',
      pt: 'Kevin De Bruyne, Luka Modrić ou Lionel Messi.'
    }
  },
  {
    id: 'presion-tras-perdida',
    keyTerms: ['presión tras pérdida', 'gegenpressing', 'pressão pós-perda', 'counterpressing'],
    category: 'Defensa',
    title: {
      es: 'Presión Tras Pérdida (Gegenpressing)',
      en: 'Counter-pressing (Gegenpressing)',
      pt: 'Pressão Pós-Perda (Gegenpressing)'
    },
    shortDesc: {
      es: 'Acoso defensivo inmediato en los primeros 5 segundos tras perder la posesión para recuperar el balón cerca del área rival.',
      en: 'Immediate group pressure within 5 seconds of losing possession to win the ball back high up.',
      pt: 'Reação defensiva imediata nos primeiros 5 segundos após perder a bola para recuperar alto.'
    },
    fullDesc: {
      es: 'En lugar de replegarse, los jugadores más cercanos asfixian al rival que acaba de recuperar el balón, aprovechando que el rival está desorganizado antes de que inicie su contraataque.',
      en: 'Instead of retreating, nearby players instantly swarm the opponent who won the ball while they are structurally vulnerable.',
      pt: 'Em vez de recuar, a equipa pressiona imediatamente o portador da bola para aproveitar a desorganização rival.'
    },
    importance: {
      es: 'Evita contras enemigas y genera las mejores ocasiones de gol cerca del arco rival.',
      en: 'Prevents opponent counterattacks and creates high-percentage chances close to goal.',
      pt: 'Evita contra-ataques e cria oportunidades perto da baliza.'
    },
    example: {
      es: 'El Liverpool de Jürgen Klopp o el Bayern Múnich.',
      en: 'Jürgen Klopp’s Liverpool or Bayern Munich.',
      pt: 'O Liverpool de Jürgen Klopp ou o Bayern Munique.'
    }
  },
  {
    id: 'transicion-ofensiva',
    keyTerms: ['transición ofensiva', 'offensive transition', 'transição ofensiva', 'counterattack', 'contraataque'],
    category: 'Ataque',
    title: {
      es: 'Transición Ofensiva',
      en: 'Offensive Transition',
      pt: 'Transição Ofensiva'
    },
    shortDesc: {
      es: 'Fase del juego que va desde el instante exacto en que se recupera el balón hasta que el rival se organiza.',
      en: 'The tactical phase immediately following ball recovery before the opponent reorganizes.',
      pt: 'Fase do jogo a partir do momento em que se recupera a bola até à organização do adversário.'
    },
    fullDesc: {
      es: 'Requiere velocidad de pensamiento y pases verticales directos aprovechando el espacio desprotegido del rival que estaba atacando.',
      en: 'Demands rapid decision-making and direct vertical passes to exploit space left by attacking opponents.',
      pt: 'Exige rapidez de pensamento e passes verticais diretos para aproveitar o espaço livre.'
    },
    importance: {
      es: 'Es el momento de mayor vulnerabilidad defensiva en el fútbol moderno.',
      en: 'It is the most structurally vulnerable moment in modern football.',
      pt: 'É o momento de maior vulnerabilidade defensiva no futebol moderno.'
    },
    example: {
      es: 'El Real Madrid en Champions League aprovechando la velocidad de Vinícius y Rodrygo.',
      en: 'Real Madrid exploiting open space with Vinícius Jr. and Rodrygo in Champions League.',
      pt: 'O Real Madrid a aproveitar a velocidade de Vinícius Jr. e Rodrygo.'
    }
  },
  {
    id: 'perfilacion-corporal',
    keyTerms: ['perfilación corporal', 'body orientation', 'perfilamento corporal', 'perfilacion'],
    category: 'Físico',
    title: {
      es: 'Perfilación Corporal',
      en: 'Body Orientation / Profiling',
      pt: 'Perfilamento Corporal'
    },
    shortDesc: {
      es: 'Postura biomecánica del cuerpo previa al control que permite ver balón, compañeros y rivales simultáneamente.',
      en: 'Biomechanical body posture before receiving that allows clear vision of ball, space, and defenders.',
      pt: 'Postura corporal antes de receber a bola que permite visão total do campo.'
    },
    fullDesc: {
      es: 'Recibir "perfilado" (con el cuerpo semiflexionado orientado hacia el campo contrario y el pie lejano listo) permite orientar el primer toque hacia adelante ahorrando hasta 2 segundos clave.',
      en: 'Receiving semi-turned towards the opposition goal using the back foot enables forward first touches, saving up to 2 key seconds.',
      pt: 'Receber orientado para a frente com o pé mais distante permite dar um primeiro toque para a frente ganhando tempo.'
    },
    importance: {
      es: 'Diferencia a un mediocampista amateur de uno profesional bajo presión.',
      en: 'Separates amateur midfielders from press-resistant professionals.',
      pt: 'Diferencia um médio amador de um profissional sob pressão.'
    },
    example: {
      es: 'Sergio Busquets, Pedri o Toni Kroos.',
      en: 'Sergio Busquets, Pedri, or Toni Kroos.',
      pt: 'Sergio Busquets, Pedri ou Toni Kroos.'
    }
  },
  {
    id: 'desmarque-de-ruptura',
    keyTerms: ['desmarque de ruptura', 'rupturing run', 'desmarque de ruptura', 'spin-behind', 'desmarque'],
    category: 'Ataque',
    title: {
      es: 'Desmarque de Ruptura',
      en: 'Behind-the-line Run (Rupturing Run)',
      pt: 'Desmarque de Ruptura'
    },
    shortDesc: {
      es: 'Carrera explosiva a máxima velocidad superando la última línea defensiva en dirección a la portería.',
      en: 'Explosive high-speed sprint penetrating beyond the final defensive line toward goal.',
      pt: 'Corrida explosiva que supera a última linha defensiva em direção à baliza.'
    },
    fullDesc: {
      es: 'A diferencia del desmarque de apoyo (venir a pedir al pie), la ruptura busca ganar la espalda del central o lateral para recibir con metros de ventaja.',
      en: 'Unlike coming short to feet, a rupturing run attacks the space behind central defenders or full-backs to receive in stride.',
      pt: 'Ao contrário de pedir a bola no pé, a ruptura ataca o espaço nas costas dos centrais.'
    },
    importance: {
      es: 'Estira la defensa rival y genera situaciones claras de gol.',
      en: 'Stretches opposition defensive lines and triggers 1v1 chances.',
      pt: 'Estica a defesa adversária e cria chances claras de golo.'
    },
    example: {
      es: 'Erling Haaland o Jamie Vardy rompiendo fueras de juego.',
      en: 'Erling Haaland or Jamie Vardy beating offside traps.',
      pt: 'Erling Haaland ou Jamie Vardy a quebrar a linha de fora de jogo.'
    }
  }
];
