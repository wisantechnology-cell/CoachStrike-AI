import { PositionCategory } from '../types';
import { Language } from './translations';

export interface EffectiveDribble {
  id: string;
  name: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | 'Élite' | 'Basic' | 'Intermediate' | 'Advanced' | 'Elite';
  efficacyScore: number; // e.g. 94%
  zone: string;
  tagline: string;
  whyEffective: string;
  stepByStep: string[];
  whenToUse: string;
  mistakesToAvoid: string;
  proMaster: string;
  keySkillRequired: string;
}

export interface ProInspirationCopyGuide {
  habitTitle: string;
  category: 'Escaneo Visual' | 'Gesto Técnico' | 'Decisión Táctica' | 'Manejo de la Pausa' | 'Comportamiento en Pérdida' | 'Físico / Postura' | 'Mentalidad' | 'Visual Scanning' | 'Technical Gesture' | 'Tactical Decision' | 'Tempo & Pause' | 'Post-Loss Reaction' | 'Physical & Posture' | 'Mindset';
  whatToCopy: string;
  howToPractice: string;
}

export interface ProInspirationPlayer {
  id: string;
  name: string;
  club: string;
  nationality: string;
  roleTitle: string;
  avatarUrl: string;
  quote: string;
  signatureMove: string;
  tacticalSuperpower: string;
  copyGuide: ProInspirationCopyGuide[];
}

export interface PositionDeepAnalysis {
  positionCode: PositionCategory;
  title: string;
  subtitle: string;
  tacticalProfile: string;
  coreMission: string;
  physicalDemand: string;
  effectiveDribbles: EffectiveDribble[];
  proInspirations: ProInspirationPlayer[];
  recommendedTrainingFocus: string[];
}

export const POSITION_ANALYSIS_DATA_ES: Record<PositionCategory, PositionDeepAnalysis> = {
  EXT: {
    positionCode: 'EXT',
    title: 'Extremo / Extremo Invertido',
    subtitle: 'Desequilibrio por banda, 1v1 y generación de peligro hacia el área',
    tacticalProfile: 'El extremo moderno no solo desborda por fuera; tiene la misión de fijar al lateral, romper en diagonal hacia el intervalo entre central y lateral rival, y culminar jugadas con asistencia o disparo al palo largo.',
    coreMission: 'Generar ventajas numéricas y posicionales mediante el regate en velocidad y centros o diagonales venenosas.',
    physicalDemand: 'Alta explosividad, sprints repetidos de 15-30 metros, cambios de aceleración (0-100 km/h) y agilidad de caderas.',
    effectiveDribbles: [
      {
        id: 'croqueta-ext',
        name: 'La Croqueta Eléctrica',
        difficulty: 'Intermedio',
        efficacyScore: 94,
        zone: 'Pico del área y pasillo interior',
        tagline: 'Cambio de peso instantáneo de un pie a otro para sobrepasar la pierna extendida del defensa.',
        whyEffective: 'Cuando el lateral o central rival intenta anticipar o meter la pierna en carrera, la croqueta traslada la pelota lateralmente fuera de su alcance sin frenar tu avance hacia la portería.',
        stepByStep: [
          'Encara al rival en diagonal reduciendo ligeramente la velocidad para que plante los tacos.',
          'Con el interior de tu pie dominante empuja suavemente el balón hacia el interior de tu otro pie.',
          'Con el interior del segundo pie golpea hacia adelante en un solo tiempo continuo.',
          'Acelera con el torso bajo para evitar que el defensa use sus brazos para desestabilizarte.'
        ],
        whenToUse: 'En el pico del área grande cuando el defensor acude a tapar el centro o el tiro exterior.',
        mistakesToAvoid: 'Dar dos toques lentos; debe ser un movimiento fluido "tac-tac" en menos de medio segundo.',
        proMaster: 'Andrés Iniesta / Pedri / Eden Hazard',
        keySkillRequired: 'Coordinación bipedal y timing de entrada rival'
      },
      {
        id: 'tijera-salida',
        name: 'Doble Tijera + Cambio de Ritmo',
        difficulty: 'Avanzado',
        efficacyScore: 91,
        zone: 'Línea de banda y 1v1 exterior',
        tagline: 'Finta de piernas envolviendo el balón para paralizar las rodillas del rival y salir en velocidad.',
        whyEffective: 'Obliga al lateral rival a balancear su peso hacia el lado falso. Al bloquear sus apoyos, no puede reaccionar a tu aceleración explosiva hacia la línea de fondo.',
        stepByStep: [
          'Conduce a velocidad media hacia el hombro exterior del defensa.',
          'Pasa tu pie derecho por delante del balón de dentro hacia fuera sin tocarlo, flexionando la rodilla.',
          'Inmediatamente realiza el mismo gesto con el pie izquierdo mientras bajas el centro de gravedad.',
          'Golpea con el exterior del pie dominante hacia el espacio libre y arranca a máxima potencia.'
        ],
        whenToUse: 'En campo abierto cuando el lateral rival te espera perfilado tapando la línea.',
        mistakesToAvoid: 'Hacer las tijeras demasiado lejos del defensor o mirando únicamente al suelo.',
        proMaster: 'Cristiano Ronaldo / Vinícius Jr. / Neymar Jr.',
        keySkillRequired: 'Flexibilidad de cadera y potencia explosiva en los primeros 3 pasos'
      },
      {
        id: 'amago-recorte-chop',
        name: 'Ronaldo Chop / Recorte en Salto',
        difficulty: 'Intermedio',
        efficacyScore: 88,
        zone: 'Diagonal hacia la frontal del área',
        tagline: 'Corte seco por detrás de la pierna de apoyo cambiando bruscamente la trayectoria 90°.',
        whyEffective: 'El lateral suele correr a toda velocidad para tapar tu centro. El chop frena tu avance en seco y te coloca en el carril central con la portería de cara y el defensor pasado de largo.',
        stepByStep: [
          'Inicia un sprint en diagonal como si fueras a rematar o centrar con potencia.',
          'Arma la pierna de golpeo exagerando el movimiento para vender el engaño.',
          'Da un pequeño salto con el pie de apoyo hacia adelante.',
          'Impacta el balón por detrás de tu pierna de apoyo con el interior del pie ejecutor hacia dentro.'
        ],
        whenToUse: 'Cuando el rival te persigue en carrera paralela y quieres generar espacio para disparar.',
        mistakesToAvoid: 'Golpear tu propio talón de apoyo o recortar demasiado abierto hacia un segundo rival.',
        proMaster: 'Cristiano Ronaldo / Marcus Rashford / Raphinha',
        keySkillRequired: 'Equilibrio dinámico y frenada en seco'
      },
      {
        id: 'body-feint-salida',
        name: 'Finta de Hombro sin Balón (Body Feint)',
        difficulty: 'Básico',
        efficacyScore: 92,
        zone: 'Último tercio y duelos de 1v1 estáticos',
        tagline: 'Bajar el hombro simulando salida a un lado sin tocar la pelota y arrancar por el opuesto.',
        whyEffective: 'Es el regate más eficiente del fútbol: gasta mínima energía, no expone el balón y utiliza la propia inercia del rival en su contra.',
        stepByStep: [
          'Conduce lentamente hacia el defensor fijando la mirada en su cintura.',
          'Deja caer bruscamente el hombro izquierdo flexionando la rodilla de ese lado como si arrancaras.',
          'En cuanto el defensor incline su torso para tapar ese carril, impulsa tu cuerpo hacia la derecha.',
          'Toca el balón con el empeine exterior del otro pie hacia el espacio libre generado.'
        ],
        whenToUse: 'En recepciones en banda cuando el lateral viene lanzado a encimarte.',
        mistakesToAvoid: 'Mover solo la cabeza en lugar de inclinar todo el tronco y el centro de gravedad.',
        proMaster: 'Lionel Messi / Bukayo Saka / Riyad Mahrez',
        keySkillRequired: 'Lectura de los apoyos del rival y cambio de ritmo repentino'
      }
    ],
    proInspirations: [
      {
        id: 'vini-inspire',
        name: 'Vinícius Jr.',
        club: 'Real Madrid',
        nationality: 'Brasil',
        roleTitle: 'Extremo Puro de Desborde y Desequilibrio Continuo',
        avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
        quote: 'La clave es no rendirte nunca: si fallas el primer regate, encaras el segundo con más ganas.',
        signatureMove: 'Pisa de suela con la izquierda + autopase exterior con la derecha en aceleración',
        tacticalSuperpower: 'Insistencia psicológica: desgasta al lateral con 10 a 15 encaradas por partido hasta romperlo.',
        copyGuide: [
          {
            habitTitle: 'Insistencia en el 1v1 sin miedo al error',
            category: 'Mentalidad',
            whatToCopy: 'No esconderse tras perder un balón; pedir inmediatamente el siguiente y volver a encarar al lateral cuando esté cansado.',
            howToPractice: 'En entrenamientos reducidos, ponte como regla obligatoria encarar al defensor en menos de 3 toques cada vez que recibas en banda.'
          },
          {
            habitTitle: 'Arrancada con cambio de marcha (0 a 100)',
            category: 'Físico / Postura',
            whatToCopy: 'Caminar con el balón para hipnotizar al rival y de repente meter un sprint devastador de 5 metros.',
            howToPractice: 'Series de multisaltos pliométricos seguidos de sprints de 10 metros con arranque desde posición estática.'
          },
          {
            habitTitle: 'Diagonal al espacio entre central y lateral',
            category: 'Decisión Táctica',
            whatToCopy: 'No quedarse pegado a la cal todo el tiempo; cuando el mediocentro mira de frente, tirar la diagonal a la espalda de la línea defensiva.',
            howToPractice: 'Practicar desmarques en arco para no quedar en fuera de juego mientras observas la cadera del último defensor.'
          }
        ]
      },
      {
        id: 'saka-inspire',
        name: 'Bukayo Saka',
        club: 'Arsenal FC',
        nationality: 'Inglaterra',
        roleTitle: 'Extremo Invertido Asociativo y Decisivo',
        avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
        quote: 'La simplicidad ejecutada a máxima velocidad es la técnica más difícil de frenar.',
        signatureMove: 'Conducción zurda hacia dentro con cuerpo perfilado y pase diagonal al segundo palo',
        tacticalSuperpower: 'Uso de la fuerza del tren inferior para aguantar la carga del defensa mientras conduce.',
        copyGuide: [
          {
            habitTitle: 'Uso del brazo y tren inferior como escudo',
            category: 'Físico / Postura',
            whatToCopy: 'Separar el brazo no dominante a la altura del pecho del defensor para impedir que meta el pie o te desplace.',
            howToPractice: 'Ejercicios de 1v1 en pasillo estrecho con contacto físico permitido; aprende a conducir protegiendo con el cuerpo.'
          },
          {
            habitTitle: 'La pausa antes de dar el pase clave',
            category: 'Manejo de la Pausa',
            whatToCopy: 'No precipitar el centro al llegar a línea de fondo; dar un toque extra con la cabeza levantada para encontrar al compañero libre.',
            howToPractice: 'Drill de llegada a línea de fondo con 3 opciones de pase identificadas por colores que el entrenador te canta al instante.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Drills de 1v1 con defensas que van variando su distancia de acoso.',
      'Centros tensos a la carrera con ambas piernas tras recorte seco.',
      'Remate al segundo palo con rosca interior tras encarar hacia adentro.'
    ]
  },
  MPO: {
    positionCode: 'MPO',
    title: 'Mediapunta / Creador de Juego',
    subtitle: 'Dominio entre líneas, último pase y orientación corporal en 360°',
    tacticalProfile: 'El mediapunta moderno habita la zona más congestionada del campo: el espacio entre la línea de mediocentros y defensas rivales. Requiere máxima velocidad mental para recibir de espaldas, girar en una baldosa y habilitar a los delanteros.',
    coreMission: 'Transformar la posesión en ocasiones claras de gol encontrando pases filtrados que rompan el bloque rival.',
    physicalDemand: 'Agilidad neuromuscular, equilibrio para girar bajo presión intensa y aceleración corta de 3 a 5 metros.',
    effectiveDribbles: [
      {
        id: 'giro-360-exterior',
        name: 'Giro de 180° con el Exterior / Outside Hook',
        difficulty: 'Intermedio',
        efficacyScore: 95,
        zone: 'Espacio entre líneas (Zona 14)',
        tagline: 'Enganche con el exterior del pie alejando la pelota del central que acude a la espalda.',
        whyEffective: 'Cuando recibes de espaldas a portería, el central rival va a buscar el contacto físico. Girar con el exterior en un solo toque aprovecha su propia inercia hacia adelante para dejarlo clavado a tu espalda.',
        stepByStep: [
          'Antes de recibir, escanea por encima del hombro para saber por qué lado viene la presión.',
          'Amaga con el cuerpo como si fueras a descargar de cara hacia tu mediocentro.',
          'Justo antes de que el balón llegue, engancha con los tres dedos exteriores hacia tu lado libre.',
          'Gira las caderas 180° y acelera dos pasos para encarar a la línea defensiva.'
        ],
        whenToUse: 'En pases verticales desde tus centrales o pivote cuando tienes un defensor pegado a la marca.',
        mistakesToAvoid: 'Recibir estático sin comprobar si el defensor ya está anticipando la jugada.',
        proMaster: 'Luka Modrić / Pedri / Zinedine Zidane',
        keySkillRequired: 'Escaneo visual previo y sensibilidad en el exterior del pie'
      },
      {
        id: 'croqueta-espacio-reducido',
        name: 'Croqueta de Bolsillo (Tight Croqueta)',
        difficulty: 'Avanzado',
        efficacyScore: 92,
        zone: 'Frontal del área y aglomeración central',
        tagline: 'Desplazamiento ultracorto de balón entre ambos pies en menos de 30 centímetros de espacio.',
        whyEffective: 'En la frontal del área los defensores no se tiran al suelo por temor al penalti o falta; meten el pie con precaución. La croqueta de bolsillo te abre una ventana limpia de disparo o pase.',
        stepByStep: [
          'Mantén el balón muy pegado a la puntera de tus botas.',
          'Haz un toque de apenas 15 cm con el empeine interior hacia tu otro pie.',
          'Sin separar el balón, acarícialo hacia adelante con el otro interior.',
          'Dispara o filtra el balón en el paso inmediatamente posterior.'
        ],
        whenToUse: 'Cuando tienes dos rivales tapando la línea de pase directo al delantero.',
        mistakesToAvoid: 'Dar un toque demasiado largo que permita la salida del portero o el cruce del otro central.',
        proMaster: 'Pedri / Andrés Iniesta / Bernardo Silva',
        keySkillRequired: 'Tacto milimétrico y pies ágiles'
      }
    ],
    proInspirations: [
      {
        id: 'pedri-inspire',
        name: 'Pedri González',
        club: 'FC Barcelona',
        nationality: 'España',
        roleTitle: 'Mago de los Espacios Reducidos & Giros en 360°',
        avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
        quote: 'Jugar rápido no es correr como loco; es pensar dos jugadas antes de que te llegue el balón.',
        signatureMove: 'Recepción orientada girando sobre el eje del central rival en una baldosa',
        tacticalSuperpower: 'Visión periférica total: sabe dónde están los 21 jugadores antes de tocar el esférico.',
        copyGuide: [
          {
            habitTitle: 'El escaneo de cuello constante (4 a 6 miradas)',
            category: 'Escaneo Visual',
            whatToCopy: 'Girar la cabeza hacia ambos lados cada 2 segundos antes de recibir para crear un mapa mental exacto de los rivales y compañeros.',
            howToPractice: 'Pide a un compañero que se coloque a tu espalda y levante dedos con la mano; debes cantar el número antes de controlar el balón.'
          },
          {
            habitTitle: 'El control orientado que elimina rivales',
            category: 'Gesto Técnico',
            whatToCopy: 'Nunca controlar el balón hacia donde vino; el primer toque debe salir hacia el espacio vacío o superar al mediocentro que viene a apretar.',
            howToPractice: 'Rondos de 4v2 con la regla de orientar el control obligatoriamente fuera del cono de visión del defensor.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Rondos de alta presión en 3x3 y 4x4 en espacios de 15x15 metros.',
      'Juegos de posición con apoyos de espaldas y giros obligatorios.',
      'Pases filtrados con muñecos fijos simulando líneas defensivas compactas.'
    ]
  },
  MC: {
    positionCode: 'MC',
    title: 'Centrocampista Box-to-Box / Mixto',
    subtitle: 'Dominio de las dos áreas, despliegue físico y llegada por sorpresa',
    tacticalProfile: 'El mediocentro todoterreno es el motor del equipo. Rompe líneas mediante conducciones poderosas, colabora en la recuperación en campo propio y llega como un puñal a rematar centros en el área rival.',
    coreMission: 'Conectar defensa con ataque con transiciones veloces y aportar goles desde segunda línea.',
    physicalDemand: 'Capacidad aeróbica y anaeróbica brutal, fuerza para ganar choques y resistencia a la fatiga.',
    effectiveDribbles: [
      {
        id: 'control-ruptura-mc',
        name: 'Control Orientado con Ruptura (First Touch Drive)',
        difficulty: 'Intermedio',
        efficacyScore: 93,
        zone: 'Transición en mitad de cancha',
        tagline: 'Controlar hacia el espacio en velocidad superando la línea de mediocampistas rivales en un solo toque.',
        whyEffective: 'Ahorra el tiempo de tener que controlar y luego arrancar. El primer toque es a la vez regate y lanzamiento de contragolpe.',
        stepByStep: [
          'Pide el balón perfilando el cuerpo a 45° en dirección al ataque.',
          'Impacta la pelota con el empeine exterior hacia adelante en tu carrera.',
          'Aprovecha tu inercia para ganar 2 metros de ventaja sobre el marcador.',
          'Continúa conduciendo con la cabeza arriba para decidir si tirar o pasar.'
        ],
        whenToUse: 'En transiciones rápidas tras recuperación de balón.',
        mistakesToAvoid: 'Tocar el balón demasiado largo y regalárselo al central rival.',
        proMaster: 'Jude Bellingham / Federico Valverde / Steven Gerrard',
        keySkillRequired: 'Zancada potente y control en carrera'
      }
    ],
    proInspirations: [
      {
        id: 'bellingham-inspire',
        name: 'Jude Bellingham',
        club: 'Real Madrid',
        nationality: 'Inglaterra',
        roleTitle: 'El Box-to-Box Total con Alma de Delantero',
        avatarUrl: 'https://images.unsplash.com/photo-1543351611-72475171ee53?auto=format&fit=crop&w=400&q=80',
        quote: 'Si estás en el campo, tienes que influir en las dos áreas; no hay excusas para no llegar.',
        signatureMove: 'Llegada silenciosa al punto de penalti atacando el balón que nadie espera',
        tacticalSuperpower: 'Lectura del segundo palo y potencia en el remate de primeras en carrera.',
        copyGuide: [
          {
            habitTitle: 'Llegada desde segunda línea sin que te detecten',
            category: 'Decisión Táctica',
            whatToCopy: 'No meterte en el área antes de tiempo; quedarte en el borde del área y acelerar justo cuando el extremo lanza el centro.',
            howToPractice: 'Practicar centros laterales donde arrancas desde 20 metros fuera del área para rematar al llegar.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Circuitos de resistencia intermitente de alta intensidad (HIIT con balón).',
      'Definición de primeras tras llegada desde la frontal del área.',
      'Duelos aéreos y coberturas a los laterales cuando suben al ataque.'
    ]
  },
  MCD: {
    positionCode: 'MCD',
    title: 'Mediocentro Defensivo / Pivote Posicional',
    subtitle: 'Equilibrio estructural, primer pase de salida y protección del bloque',
    tacticalProfile: 'El pivote posicional es el cerebro defensivo y el compás organizador del equipo. No corre detrás del balón innecesariamente; lee los movimientos del rival para cortar contragolpes y entrega siempre con ventaja.',
    coreMission: 'Ser el ancla que equilibra las transiciones, recuperar segundas jugadas y dar fluidez a la salida de balón.',
    physicalDemand: 'Resistencia aeróbica élite (11-13 km por partido), fuerza para aguantar duelos cuerpo a cuerpo y lectura táctica.',
    effectiveDribbles: [
      {
        id: 'giro-blindaje-mcd',
        name: 'Giro de Blindaje con Brazo de Protección (Shield Turn)',
        difficulty: 'Básico',
        efficacyScore: 96,
        zone: 'Círculo central y primer tercio',
        tagline: 'Interponer la cadera y el brazo entre el balón y el delantero que acosa por detrás.',
        whyEffective: 'En tu zona perder el balón es casi gol rival. Este regate garantiza al 100% que la pelota queda a salvo mientras giras hacia tu lateral libre.',
        stepByStep: [
          'Siente la presencia del delantero que te aprieta de espaldas con tu espalda.',
          'Coloca tu cuerpo de perfil y extiende el brazo correspondiente con el puño cerrado firme.',
          'Pisa la pelota con la suela de tu pie más alejado y gira sobre tu pie de apoyo.',
          'Descarga con el interior hacia el central o lateral que está perfilado de cara.'
        ],
        whenToUse: 'Bajo presión alta del rival al recibir el primer pase de salida de los centrales.',
        mistakesToAvoid: 'Agarrar la camiseta del rival (falta) o intentar salir hacia el centro si hay otro mediocampista cerrando.',
        proMaster: 'Rodri Hernández / Sergio Busquets / Casemiro',
        keySkillRequired: 'Estabilidad de tronco y uso legal del cuerpo'
      }
    ],
    proInspirations: [
      {
        id: 'rodri-inspire',
        name: 'Rodri Hernández',
        club: 'Manchester City',
        nationality: 'España',
        roleTitle: 'El Metrónomo Táctico & Balón de Oro',
        avatarUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80',
        quote: 'El mejor pivote es aquel que parece que no corre porque siempre estuvo en el lugar correcto.',
        signatureMove: 'Control orientado con el pecho o muslo que se convierte en pase vertical de seguridad',
        tacticalSuperpower: 'Lectura milimétrica de las segundas jugadas: recupera 8 de cada 10 balones divididos en el medio campo.',
        copyGuide: [
          {
            habitTitle: 'Posicionamiento como tercer vértice de pase',
            category: 'Decisión Táctica',
            whatToCopy: 'Estar siempre formando un triángulo de pase con tus dos centrales; nunca esconderte detrás del delantero rival.',
            howToPractice: 'Grábate en un partido y revisa si en cada salida de balón eres una línea de pase visible.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Rondos 5v2 en el círculo central con dos toques obligatorios.',
      'Trabajo de perfilación corporal para recibir viendo ambos costados del campo.',
      'Tiro de media distancia tras segunda jugada rechazada al borde del área.'
    ]
  },
  LAT: {
    positionCode: 'LAT',
    title: 'Lateral de Recorrido / Carrilero',
    subtitle: 'Doble función: muralla en banda y puñal ofensivo en ataque',
    tacticalProfile: 'El lateral contemporáneo es uno de los puestos más demandantes física y tácticamente. Debe anular a los extremos más rápidos del mundo y a la vez ser el generador de amplitud y centros peligrosos en ataque.',
    coreMission: 'Dominar la banda de área a área, ganar duelos 1v1 defensivos y abastecer de centros de calidad.',
    physicalDemand: 'Velocidad sostenida, capacidad de repetir esfuerzos máximos de 60 metros y repliegue veloz.',
    effectiveDribbles: [
      {
        id: 'autopase-espacio-lat',
        name: 'Auto-Pase al Espacio con Aceleración (Knock & Run)',
        difficulty: 'Básico',
        efficacyScore: 93,
        zone: 'Línea de cal en propio campo o medio campo',
        tagline: 'Tocar el balón 10 metros adelante en diagonal hacia la banda y superarlo con sprint puro.',
        whyEffective: 'El extremo rival suele presionar de frente con el cuerpo volcado. Un toque largo al espacio libre aprovecha que tú ya estás orientado hacia adelante.',
        stepByStep: [
          'Espera a que el extremo rival acuda a apretarte con entusiasmo.',
          'Con el exterior de tu bota empuja la pelota 8 a 12 metros por delante pegado a la línea.',
          'Pasa por el lado opuesto del rival o por fuera del campo si es necesario.',
          'Conecta con el centro al área antes de que llegue el central a la cobertura.'
        ],
        whenToUse: 'En salidas de banda cuando el extremo rival viene lanzado sin freno.',
        mistakesToAvoid: 'Tocar el balón hacia el centro del campo donde puede interceptarlo el mediocentro rival.',
        proMaster: 'Alphonso Davies / Achraf Hakimi / Kyle Walker',
        keySkillRequired: 'Potencia de aceleración en línea recta'
      }
    ],
    proInspirations: [
      {
        id: 'davies-inspire',
        name: 'Alphonso Davies',
        club: 'FC Bayern München',
        nationality: 'Canadá',
        roleTitle: 'El Correcaminos de Banda & Potencia Pura',
        avatarUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
        quote: 'Cuando tienes velocidad, cada balón al espacio es una oportunidad de gol.',
        signatureMove: 'Sprint de recuperación que anula el 1v1 rival cuando ya te había superado',
        tacticalSuperpower: 'Recuperación defensiva turbo: subsana cualquier desajuste táctico en 3 segundos.',
        copyGuide: [
          {
            habitTitle: 'Repliegue inmediato tras pérdida',
            category: 'Comportamiento en Pérdida',
            whatToCopy: 'No lamentar el centro fallido; girar inmediatamente y sprintar para proteger la espalda del central.',
            howToPractice: 'Sprints de ida y vuelta con centro y posterior cierre de cono defensivo.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Centros en carrera tras sprint de 30 metros.',
      'Perfilación defensiva para orientar al extremo hacia su pierna débil.',
      'Resistencia anaeróbica con repetición de carreras de banda a banda.'
    ]
  },
  DC: {
    positionCode: 'DC',
    title: 'Delantero Centro / Goleador Móvil',
    subtitle: 'Olfato de gol, desmarques de ruptura y remate letal en el área',
    tacticalProfile: 'El 9 actual es mucho más que un rematador de área: sabe jugar de espaldas para fijar centrales, caer a los costados para arrastrar marcas y atacar el primer palo con determinación asesina.',
    coreMission: 'Materializar las jugadas en gol y ser la referencia ofensiva constante del equipo.',
    physicalDemand: 'Potencia de tren inferior para duelos de choque con centrales, velocidad en 10 metros y salto vertical.',
    effectiveDribbles: [
      {
        id: 'amago-tiro-dc',
        name: 'Falso Disparo y Salida al Palo Corto',
        difficulty: 'Intermedio',
        efficacyScore: 94,
        zone: 'Dentro del área penal (12 a 16 metros)',
        tagline: 'Vender el disparo de primeras para que el central salte a bloquearlo y definir al hueco.',
        whyEffective: 'Dentro del área los centrales viven con el pánico de que el balón vaya a gol. El amago de tiro los desactiva por completo en el aire.',
        stepByStep: [
          'Arma la pierna de remate con toda la fuerza visible.',
          'En el último milisegundo, en lugar de impactar, frena el balón con suavidad.',
          'Da un paso lateral de 50 cm para superar el cuerpo del defensa que se lanzó.',
          'Define raso al poste más alejado del portero.'
        ],
        whenToUse: 'En balones sueltos o centros rasos dentro del área penal.',
        mistakesToAvoid: 'Dar un segundo toque demasiado largo que permita la salida del guardameta.',
        proMaster: 'Erling Haaland / Robert Lewandowski / Karim Benzema',
        keySkillRequired: 'Frialdad extrema y coordinación de apoyo'
      }
    ],
    proInspirations: [
      {
        id: 'haaland-inspire',
        name: 'Erling Haaland',
        club: 'Manchester City',
        nationality: 'Noruega',
        roleTitle: 'El Androide del Gol & Depredador de Espacios',
        avatarUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
        quote: 'Mi único pensamiento dentro del área es meter el balón dentro de la red cueste lo que cueste.',
        signatureMove: 'Ataque feroz al primer palo anticipando al central por milímetros',
        tacticalSuperpower: 'Desmarque de engaño: amaga al segundo palo y arranca como una bala al primero.',
        copyGuide: [
          {
            habitTitle: 'El desmarque en zigzag para despistar al central',
            category: 'Decisión Táctica',
            whatToCopy: 'Dar dos pasos hacia atrás simulando que te abres y luego sprintar a la espalda del central en su punto ciego.',
            howToPractice: 'Ejercicios de desmarque con oposición pasiva donde debes ganar la posición en menos de 3 pasos.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Remates de volea y de cabeza tras centros tensos.',
      'Definición mano a mano contra el guardameta bajo presión de persecución.',
      'Trabajo de juego de espaldas y descargas a los mediapuntas.'
    ]
  },
  DEC: {
    positionCode: 'DEC',
    title: 'Defensa Central Imponente / Mariscal',
    subtitle: 'Liderazgo defensivo, dominio aéreo y salida limpia de balón',
    tacticalProfile: 'El central contemporáneo lidera la línea con comunicación y colocación. Destaca por cortar avances en el momento justo y filtrar el primer pase superando la presión rival.',
    coreMission: 'Impedir goles, ganar duelos 1v1 y asegurar la posesión desde la primera línea de construcción.',
    physicalDemand: 'Potencia en el salto vertical, fuerza de choque corporal y velocidad de reacción en 5 metros.',
    effectiveDribbles: [
      {
        id: 'recorte-salida-dec',
        name: 'Recorte Interior de Seguridad (Step-Back Cut)',
        difficulty: 'Básico',
        efficacyScore: 92,
        zone: 'Borde de la propia área grande',
        tagline: 'Amagar el pase largo al delantero y recortar hacia el interior para conectar con el lateral libre.',
        whyEffective: 'El delantero que presiona va lanzado esperando el golpeo largo. El recorte suave te permite salir sin rifar la pelota.',
        stepByStep: [
          'Arma la pierna de golpeo como si fueras a dar un pelotazo arriba.',
          'Pasa el pie por encima del balón frenándolo con el interior hacia tu otro pie.',
          'Sal jugando raso con tu pivote o lateral descubierto.'
        ],
        whenToUse: 'Bajo presión de la primera línea de delanteros rivales.',
        mistakesToAvoid: 'Arriesgar el recorte como último hombre si hay un segundo delantero cerrando.',
        proMaster: 'Virgil van Dijk / Rúben Dias / Antonio Rüdiger',
        keySkillRequired: 'Paciencia y seguridad en el primer toque'
      }
    ],
    proInspirations: [
      {
        id: 'vandijk-inspire',
        name: 'Virgil van Dijk',
        club: 'Liverpool FC',
        nationality: 'Países Bajos',
        roleTitle: 'El Muro Infranqueable & Líder de la Zaga',
        avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
        quote: 'Defender bien es hacer que el delantero rival sienta que no tiene ninguna opción antes de intentarlo.',
        signatureMove: 'Temporización perfecta sin tirarse al suelo obligando al rival a disparar con su pierna débil',
        tacticalSuperpower: 'Aura de calma y comunicación: ordena a toda la línea defensiva con su voz.',
        copyGuide: [
          {
            habitTitle: 'Temporización defensiva sin regalar el suelo',
            category: 'Decisión Táctica',
            whatToCopy: 'No tirarse a cortar a lo loco; mantener los apoyos activos y esperar a que el atacante dé un toque largo.',
            howToPractice: 'Duelos 1v1 en retroceso donde se prohíbe ir al suelo y solo se permite robar cuando el balón esté a más de medio metro del rival.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Despejes aéreos dirigidos hacia las bandas.',
      'Pase tenso raso que supere la línea de presión de delanteros.',
      'Duelos 1v1 en campo abierto con metros a la espalda.'
    ]
  },
  POR: {
    positionCode: 'POR',
    title: 'Guardameta Moderno / Sweeper Keeper',
    subtitle: 'Seguridad bajo palos, dominio del área y primer iniciador de ataque',
    tacticalProfile: 'El portero moderno no solo ataja bajo los tres palos; juega adelantado para anticipar balones largos a la espalda de la defensa y actúa como un jugador de campo más en la salida de balón.',
    coreMission: 'Proteger la portería a cero y distribuir con precisión milimétrica.',
    physicalDemand: 'Reflejos felinos, potencia de salto lateral y coordinación óculo-manual de élite.',
    effectiveDribbles: [
      {
        id: 'amago-pase-portero',
        name: 'Falso Despeje y Pase Corto al Lateral (Keeper Feint)',
        difficulty: 'Intermedio',
        efficacyScore: 90,
        zone: 'Dentro del área chica y área penal',
        tagline: 'Fingir despeje largo para que el delantero salte a tapar y salir con pase corto al lateral.',
        whyEffective: 'El delantero salta en el aire dándote la espalda y dejando abierta la línea de pase más segura.',
        stepByStep: [
          'Arma el pie como si fueras a enviar un balón de 60 metros.',
          'Pisa suavemente la pelota en el último instante y cambia la dirección hacia el lateral libre.',
          'Entrega el pase con precisión al pie del defensor.'
        ],
        whenToUse: 'En saques de puerta o cesiones cuando el rival presiona muy alto.',
        mistakesToAvoid: 'Dudar a mitad del gesto o realizarlo demasiado cerca de la línea de gol.',
        proMaster: 'Manuel Neuer / Alisson Becker / Thibaut Courtois',
        keySkillRequired: 'Templanza bajo presión y buen golpeo con ambos pies'
      }
    ],
    proInspirations: [
      {
        id: 'alisson-inspire',
        name: 'Alisson Becker',
        club: 'Liverpool FC',
        nationality: 'Brasil',
        roleTitle: 'El Cerrojo Tranquilo & Especialista en 1v1',
        avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
        quote: 'Un gran portero no necesita hacer paradas para la foto; su colocación hace que todo parezca fácil.',
        signatureMove: 'Salida en cruz (K-Block) achicando el ángulo en mano a mano sin vencerse antes de tiempo',
        tacticalSuperpower: 'Ubicación posicional perfecta y serenidad contagiosa para toda la defensa.',
        copyGuide: [
          {
            habitTitle: 'Achique en cruz aguantando de pie hasta el final',
            category: 'Gesto Técnico',
            whatToCopy: 'No lanzarse a los pies del delantero demasiado pronto; aguantar erguido para tapar el máximo arco de portería.',
            howToPractice: 'Rondas de 1v1 mano a mano con delanteros que rematan desde 10 metros.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Blocajes aéreos en centros con oposición física.',
      'Juego de pies con pases de media y larga distancia a extremos.',
      'Reacción rápida ante remates a quemarropa en área chica.'
    ]
  }
};

export const POSITION_ANALYSIS_DATA_EN: Record<PositionCategory, PositionDeepAnalysis> = {
  EXT: {
    positionCode: 'EXT',
    title: 'Inverted Winger / Wide Attacker',
    subtitle: 'Flank 1v1 dominance, sudden burst & cut-inside goal threat',
    tacticalProfile: 'The modern winger does not just run down the outside; they pin the opposing fullback, slash diagonally into the half-space channel between center back and fullback, and finish with assists or curled far-post strikes.',
    coreMission: 'Generate numerical and positional superiority through high-speed dribbling, lethal crosses, and inverted strikes.',
    physicalDemand: 'High explosive power, repeated 15-30m sprints, 0-100 acceleration bursts, and hip mobility.',
    effectiveDribbles: [
      {
        id: 'croqueta-ext',
        name: 'The Electric Croqueta',
        difficulty: 'Intermediate',
        efficacyScore: 94,
        zone: 'Edge of the penalty box & half-space channel',
        tagline: 'Instant weight transfer from one foot to the other to bypass the defender outstretched tackle.',
        whyEffective: 'When the opposing fullback attempts to anticipate or stick a foot in while retreating, the croqueta shifts the ball laterally outside their tackle radius without killing forward momentum toward goal.',
        stepByStep: [
          'Drive toward the defender diagonally, slightly decelerating to force them to plant their studs.',
          'With the inside of your dominant foot, gently slide the ball toward the inside of your other foot.',
          'With the inside of your secondary foot, push the ball forward in one continuous tempo.',
          'Accelerate away with a low center of gravity to prevent the defender from recovering with upper-body contact.'
        ],
        whenToUse: 'At the corner of the 18-yard box when the defender steps out to block an inswinging cross or shot.',
        mistakesToAvoid: 'Taking two slow touches; it must be a crisp, fluid "tick-tack" motion completed in under half a second.',
        proMaster: 'Andrés Iniesta / Pedri / Eden Hazard',
        keySkillRequired: 'Two-footed coordination and reading opponent tackle timing'
      },
      {
        id: 'tijera-salida',
        name: 'Double Step-Over + Pace Burst',
        difficulty: 'Advanced',
        efficacyScore: 91,
        zone: 'Touchline & wide 1v1 channel',
        tagline: 'Leg scissor wrapping over the ball to freeze the defender knees and explode down the flank.',
        whyEffective: 'Forces the opposing fullback to shift their balance toward the fake side. Once their weight is locked, they cannot react to your explosive acceleration toward the byline.',
        stepByStep: [
          'Dribble at moderate speed aiming toward the defender outside shoulder.',
          'Sweep your right foot around the front of the ball inside-out without touching it, flexing your knee.',
          'Immediately repeat with the left foot while dropping your hips.',
          'Push the ball firmly with the outside of your dominant foot into open space and accelerate at max pace.'
        ],
        whenToUse: 'In open space when the fullback shows you the line while attempting to contain you.',
        mistakesToAvoid: 'Performing the step-overs too far from the defender or staring straight down at your boots.',
        proMaster: 'Cristiano Ronaldo / Vinícius Jr. / Neymar Jr.',
        keySkillRequired: 'Hip agility and explosive acceleration over the first 3 steps'
      },
      {
        id: 'amago-recorte-chop',
        name: 'Ronaldo Chop / Jump Cut',
        difficulty: 'Intermediate',
        efficacyScore: 88,
        zone: 'Diagonal run toward the edge of the 18-yard box',
        tagline: 'Sharp cut behind the supporting plant foot, abruptly redirecting trajectory 90 degrees.',
        whyEffective: 'Fullbacks sprint at full speed to block your cross. The chop acts as an instant brake, sliding you into the central lane facing goal while the defender slides past.',
        stepByStep: [
          'Sprint diagonally as if preparing to unleash a powerful shot or cross.',
          'Wind up your kicking leg with exaggerated motion to sell the fake.',
          'Execute a small hop forward onto your plant foot.',
          'Strike the ball behind your plant leg with the inside of your kicking foot directed inward.'
        ],
        whenToUse: 'When a defender is running parallel at full sprint and you want to create an immediate shooting window.',
        mistakesToAvoid: 'Striking your own plant heel or cutting too wide into a secondary covering defender.',
        proMaster: 'Cristiano Ronaldo / Marcus Rashford / Raphinha',
        keySkillRequired: 'Dynamic balance and sharp deceleration'
      },
      {
        id: 'body-feint-salida',
        name: 'Shoulder Drop Body Feint (No-Touch)',
        difficulty: 'Basic',
        efficacyScore: 92,
        zone: 'Final third & static 1v1 duels',
        tagline: 'Dropping the shoulder to feint acceleration one way without touching the ball, exploding the opposite way.',
        whyEffective: 'The most energy-efficient dribble in football: expends minimal energy, does not expose the ball, and uses the defender own momentum against them.',
        stepByStep: [
          'Dribble calmly toward the defender, keeping your eyes on their hips.',
          'Drop your left shoulder sharply while bending your left knee as if bursting that way.',
          'As soon as the defender leans to close that channel, push off firmly to your right.',
          'Touch the ball with the outside instep of your other foot into the open corridor created.'
        ],
        whenToUse: 'When receiving out wide with the defender rushing in aggressively to close down.',
        mistakesToAvoid: 'Only moving your head rather than lowering your entire torso and center of mass.',
        proMaster: 'Lionel Messi / Bukayo Saka / Riyad Mahrez',
        keySkillRequired: 'Reading defender plant foot and sudden change of pace'
      }
    ],
    proInspirations: [
      {
        id: 'vini-inspire',
        name: 'Vinícius Jr.',
        club: 'Real Madrid',
        nationality: 'Brazil',
        roleTitle: 'Relentless Take-On Specialist & Wide Threat',
        avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
        quote: 'The secret is never giving up: if you lose the first duel, take on the second with even more hunger.',
        signatureMove: 'Left-foot sole roll + right-foot outside touch into high-speed acceleration',
        tacticalSuperpower: 'Psychological persistence: takes on the fullback 10 to 15 times a match until breaking their resolve.',
        copyGuide: [
          {
            habitTitle: 'Fearless 1v1 take-ons after mistakes',
            category: 'Mindset',
            whatToCopy: 'Never hide after losing a ball; immediately demand the next pass and attack the tired fullback.',
            howToPractice: 'In small-sided drills, make it a personal rule to engage the defender in 3 touches or fewer every time you receive wide.'
          },
          {
            habitTitle: 'Explosive gear-shift takeoff (0 to 100)',
            category: 'Physical & Posture',
            whatToCopy: 'Walk with the ball to lull the defender to sleep, then suddenly explode into a devastating 5-meter sprint.',
            howToPractice: 'Plyometric jump sets followed immediately by 10-meter sprints starting from a static stance.'
          },
          {
            habitTitle: 'Diagonal dart between center back and fullback',
            category: 'Tactical Decision',
            whatToCopy: 'Do not stay glued to the touchline; when your central midfielder looks up, slice into the space behind the backline.',
            howToPractice: 'Practice curved runs on the blindside of the last defender to stay onside while targeting through-balls.'
          }
        ]
      },
      {
        id: 'saka-inspire',
        name: 'Bukayo Saka',
        club: 'Arsenal FC',
        nationality: 'England',
        roleTitle: 'Intelligent Inverted Winger & Direct Decider',
        avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
        quote: 'Simplicity executed at maximum speed is the hardest technique to stop in football.',
        signatureMove: 'Left-footed inward carry with open body angle and pinpoint far-post delivery',
        tacticalSuperpower: 'Lower-body strength to shrug off physical contact while maintaining full control of the ball.',
        copyGuide: [
          {
            habitTitle: 'Using forearm and lower body as a shield',
            category: 'Physical & Posture',
            whatToCopy: 'Extend your non-dominant arm across the defender chest to prevent them from reaching in or unbalancing you.',
            howToPractice: '1v1 drills down a narrow lane with legal upper-body contact; learn to shield while driving forward.'
          },
          {
            habitTitle: 'The pause before the decisive assist',
            category: 'Tempo & Pause',
            whatToCopy: 'Do not rush the final ball at the byline; take an extra composed touch with your head up to find the free runner.',
            howToPractice: 'Byline arrival drills with 3 pass options designated by color cones called out by the coach on the fly.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      '1v1 duel drills against defenders varying their pressing distance.',
      'Driven crosses on the sprint with both feet following sharp cuts.',
      'Curled far-post finishing after cutting inside onto your dominant foot.'
    ]
  },
  MPO: {
    positionCode: 'MPO',
    title: 'Attacking Midfielder / Number 10 Playmaker',
    subtitle: 'Between-the-lines mastery, decisive assists and 360-degree body shape',
    tacticalProfile: 'The modern #10 thrives in the most congested zone of the pitch: the pocket between opposition midfield and defensive lines. Requires elite mental processing to receive with back to goal, turn in a phone booth, and slip through-balls.',
    coreMission: 'Transform possession into clean goalscoring chances by unlocking low blocks with precision vision.',
    physicalDemand: 'Neuromuscular agility, dynamic balance under high pressure, and explosive 3-5 meter directional turns.',
    effectiveDribbles: [
      {
        id: 'giro-360-exterior',
        name: 'Outside Hook 180-Degree Turn',
        difficulty: 'Intermediate',
        efficacyScore: 95,
        zone: 'Between the lines (Zone 14)',
        tagline: 'Outside-of-the-foot hook shielding the ball away from the center back stepping up to press.',
        whyEffective: 'When receiving with your back to goal, the defender steps in looking for contact. Hooking the ball in one touch with the outside of your boot uses their forward momentum to leave them stranded behind you.',
        stepByStep: [
          'Before receiving, scan over your shoulder to identify which side the pressure is coming from.',
          'Shape your body as if about to bounce the ball first-time back to your defensive midfielder.',
          'Just as the ball arrives, hook with your outside three toes toward your open side.',
          'Rotate hips 180 degrees and take two acceleration strides to attack the backline.'
        ],
        whenToUse: 'On vertical passes from center backs or pivots with tight pressure on your back.',
        mistakesToAvoid: 'Receiving completely static without checking if the defender is already jumping the route.',
        proMaster: 'Luka Modrić / Pedri / Zinedine Zidane',
        keySkillRequired: 'Pre-reception visual scanning and delicate outside-foot touch'
      },
      {
        id: 'croqueta-espacio-reducido',
        name: 'Tight Pocket Croqueta',
        difficulty: 'Advanced',
        efficacyScore: 92,
        zone: 'Edge of the D & central congestion',
        tagline: 'Ultra-compact side-to-side ball shift between both feet in under 30 centimeters of space.',
        whyEffective: 'Around the D, defenders avoid lunging in fear of conceding free kicks or penalties. The pocket croqueta instantly opens a clean window to shoot or thread a reverse pass.',
        stepByStep: [
          'Keep the ball glued to the tips of your boots.',
          'Take a micro 15cm touch with your inside instep toward your other foot.',
          'Without separating from the ball, caress it forward with the other inside foot.',
          'Release the strike or through-pass on the very next stride.'
        ],
        whenToUse: 'When two defenders are closing the direct passing angle to your striker.',
        mistakesToAvoid: 'Taking too heavy a touch that allows the keeper to smother or the other center back to step across.',
        proMaster: 'Pedri / Andrés Iniesta / Bernardo Silva',
        keySkillRequired: 'Millimeter ball feel and agile footwork'
      }
    ],
    proInspirations: [
      {
        id: 'pedri-inspire',
        name: 'Pedri González',
        club: 'FC Barcelona',
        nationality: 'Spain',
        roleTitle: 'Tight-Space Magician & 360-Degree Pivot Master',
        avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
        quote: 'Playing fast is not sprinting mindlessly; it is thinking two moves ahead before the ball reaches your feet.',
        signatureMove: 'Directional first-touch spin pivoting around the center back in tight congestion',
        tacticalSuperpower: 'Total 360-degree peripheral awareness: knows where all 21 players are before making first contact.',
        copyGuide: [
          {
            habitTitle: 'Constant shoulder checking (4 to 6 head turns)',
            category: 'Visual Scanning',
            whatToCopy: 'Turn your head left and right every 2 seconds before receiving to build a live mental map of space.',
            howToPractice: 'Have a partner stand behind you holding up fingers; call out the number just before you touch the ball.'
          },
          {
            habitTitle: 'Elimination first touch into open space',
            category: 'Technical Gesture',
            whatToCopy: 'Never control the ball back where it came from; your first touch must escape the pressing cone of the opponent.',
            howToPractice: '4v2 rondos with the mandatory rule of orienting your first touch away from the defender vision angle.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'High-intensity 3v3 and 4v4 possession games in tight 15x15m grids.',
      'Positional games with back-to-goal receiving and mandatory turns.',
      'Threading incisive passes through mannequin defensive banks.'
    ]
  },
  MC: {
    positionCode: 'MC',
    title: 'Box-to-Box Central Midfielder',
    subtitle: 'All-pitch engine, physical dominance and late box arrivals',
    tacticalProfile: 'The box-to-box midfielder is the team relentless engine. They break lines through powerful drives, assist defensively in their own third, and arrive into the penalty box to finish second-phase balls.',
    coreMission: 'Connect defense to attack through high-tempo transitions and provide goal contributions from midfield.',
    physicalDemand: 'Elite aerobic and anaerobic capacity, upper-body strength in 50/50 duels, and stamina.',
    effectiveDribbles: [
      {
        id: 'control-ruptura-mc',
        name: 'First Touch Drive & Penetration',
        difficulty: 'Intermediate',
        efficacyScore: 93,
        zone: 'Midfield transition & half-way line',
        tagline: 'Driving into open space on the half-turn, bypassing opposition midfielders in a single touch.',
        whyEffective: 'Eliminates the time needed to stop and restart. The first touch serves as both a take-on and an immediate counter-attack launch.',
        stepByStep: [
          'Demand the ball with your body angled at 45 degrees toward the attacking third.',
          'Strike the ball with your outside instep into your running stride.',
          'Use your natural forward momentum to gain a 2-meter head start on your marker.',
          'Keep your chin up while driving forward to decide between a strike or slip pass.'
        ],
        whenToUse: 'In rapid counter-attacks immediately after winning possession.',
        mistakesToAvoid: 'Pushing the ball too far ahead and giving it straight to the opposition center back.',
        proMaster: 'Jude Bellingham / Federico Valverde / Steven Gerrard',
        keySkillRequired: 'Powerful stride and high-speed close control'
      }
    ],
    proInspirations: [
      {
        id: 'bellingham-inspire',
        name: 'Jude Bellingham',
        club: 'Real Madrid',
        nationality: 'England',
        roleTitle: 'The Complete Box-to-Box Midfielder with Striker Instincts',
        avatarUrl: 'https://images.unsplash.com/photo-1543351611-72475171ee53?auto=format&fit=crop&w=400&q=80',
        quote: 'If you are on the pitch, you must influence both penalty boxes; there are no excuses for not getting there.',
        signatureMove: 'Ghosting run into the penalty spot to attack loose balls that defenders fail to track',
        tacticalSuperpower: 'Far-post anticipation and first-time finishing technique on the full sprint.',
        copyGuide: [
          {
            habitTitle: 'Undetected late box arrivals from deep',
            category: 'Tactical Decision',
            whatToCopy: 'Do not crowd the box early; hover on the edge of the D and accelerate just as the winger delivers.',
            howToPractice: 'Crossing drills where you start 20 meters outside the 18-yard box and time your arrival to finish.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'High-intensity interval training (HIIT) circuits with ball mastery.',
      'First-time shooting drills arriving onto edge-of-box cutbacks.',
      'Aerial duels and tactical coverages when fullbacks push forward.'
    ]
  },
  MCD: {
    positionCode: 'MCD',
    title: 'Defensive Anchor / Deep-Lying Pivot',
    subtitle: 'Structural balance, first build-up pass and defensive shield',
    tacticalProfile: 'The deep-lying anchor is the defensive brain and organizational compass of the side. They do not chase the ball aimlessly; they read opposition movements to snuff out counter-attacks and distribute with composure.',
    coreMission: 'Act as the foundation balancing transitions, intercepting loose balls, and ensuring clean build-up play.',
    physicalDemand: 'Elite aerobic stamina (11-13 km/game), physical core strength in 50/50 duels, and game reading.',
    effectiveDribbles: [
      {
        id: 'giro-blindaje-mcd',
        name: 'Arm-Shield Pivot Turn (Shield Turn)',
        difficulty: 'Basic',
        efficacyScore: 96,
        zone: 'Center circle & defensive third',
        tagline: 'Placing hip and forearm between the ball and the pressing striker to protect possession.',
        whyEffective: 'In the anchor zone, losing possession is almost an instant goal. This move ensures 100% security while you rotate toward your open fullback.',
        stepByStep: [
          'Feel the striker pressing your back with your upper torso.',
          'Position your body side-on and extend your near forearm firmly with a closed fist.',
          'Roll the ball with the sole of your far foot and pivot on your plant foot.',
          'Lay off cleanly with the inside of your foot to your center back or fullback facing play.'
        ],
        whenToUse: 'Under intense high pressing when receiving the initial pass out from the backline.',
        mistakesToAvoid: 'Grabbing the opponent shirt (foul) or turning blindly into central traffic.',
        proMaster: 'Rodri Hernández / Sergio Busquets / Casemiro',
        keySkillRequired: 'Core stability and legal body positioning'
      }
    ],
    proInspirations: [
      {
        id: 'rodri-inspire',
        name: 'Rodri Hernández',
        club: 'Manchester City',
        nationality: 'Spain',
        roleTitle: 'Tactical Metronome & Ballon d Or Anchor',
        avatarUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80',
        quote: 'The best defensive midfielder is the one who seems not to run, because they were already in the right place.',
        signatureMove: 'Cushioned chest/thigh control transitioning instantly into a forward pass',
        tacticalSuperpower: 'Second-ball dominance: wins 8 out of 10 loose balls across the middle third.',
        copyGuide: [
          {
            habitTitle: 'Forming the passing triangle with center backs',
            category: 'Tactical Decision',
            whatToCopy: 'Always form an open passing triangle with your two center backs; never hide in the striker shadow.',
            howToPractice: 'Review your game footage and check if you are a clear, open passing line in every phase of build-up.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      '5v2 rondos in the center circle with mandatory 2-touch limit.',
      'Open body-shape drills to receive facing both flanks simultaneously.',
      'Edge-of-box strikes off cleared second balls.'
    ]
  },
  LAT: {
    positionCode: 'LAT',
    title: 'Dynamic Wing-Back / Overlapping Fullback',
    subtitle: 'Dual engine: flank defensive wall and overlapping attacking dagger',
    tacticalProfile: 'The modern fullback is one of the most demanding positions in world football. They must neutralize the world fastest wingers while providing width, overlapping runs, and dangerous deliveries in the final third.',
    coreMission: 'Own the touchline box-to-box, dominate 1v1 defensive duels, and supply quality crosses.',
    physicalDemand: 'Sustained sprint endurance, capacity to execute repeated 60m sprints, and rapid recovery.',
    effectiveDribbles: [
      {
        id: 'autopase-espacio-lat',
        name: 'Knock-and-Run Sprint (Knock & Run)',
        difficulty: 'Basic',
        efficacyScore: 93,
        zone: 'Touchline in own half or middle third',
        tagline: 'Pushing the ball 10 meters ahead down the line and blowing past the marker with pure pace.',
        whyEffective: 'The opposing winger presses front-on with their weight committed. A firm touch into space takes advantage of your forward posture while they must turn 180 degrees to chase.',
        stepByStep: [
          'Wait for the opposing winger to commit their weight forward.',
          'With the outside of your boot, push the ball 8 to 12 meters ahead hugging the touchline.',
          'Accelerate around the opponent on the outside.',
          'Deliver the cross into the box before the covering center back arrives.'
        ],
        whenToUse: 'In touchline build-up when the winger rushes in aggressively.',
        mistakesToAvoid: 'Pushing the ball into central midfield where the opposition anchor can cut it off.',
        proMaster: 'Alphonso Davies / Achraf Hakimi / Kyle Walker',
        keySkillRequired: 'Straight-line acceleration and timing'
      }
    ],
    proInspirations: [
      {
        id: 'davies-inspire',
        name: 'Alphonso Davies',
        club: 'FC Bayern München',
        nationality: 'Canada',
        roleTitle: 'Flank Speedster & High-Speed Recovery Machine',
        avatarUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
        quote: 'When you have speed, every open ball into space is an opportunity to score or create.',
        signatureMove: 'Turbo recovery sprint to shut down an opposition 1v1 after being beaten initially',
        tacticalSuperpower: 'High-velocity recovery: fixes any defensive tactical misalignment within 3 seconds.',
        copyGuide: [
          {
            habitTitle: 'Immediate defensive sprint on possession turnover',
            category: 'Post-Loss Reaction',
            whatToCopy: 'Never complain about an errant cross; turn immediately and sprint to cover your center back.',
            howToPractice: 'End-to-end sprint intervals with a delivery followed by a defensive recovery run.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Delivering driven crosses on the full sprint after 30-meter runs.',
      'Defensive posture angling the winger onto their weaker foot.',
      'Anaerobic endurance with repeated touchline shuttle runs.'
    ]
  },
  DC: {
    positionCode: 'DC',
    title: 'Clinical Center Forward / Poacher',
    subtitle: 'Predatory instincts, blindside runs and ruthless 1-touch finishing',
    tacticalProfile: 'The modern #9 is far more than a box target: they hold up play to pin center backs, peel wide to create space for midfielders, and attack the near post with killer determination.',
    coreMission: 'Convert chances into goals and serve as the team focal attacking reference point.',
    physicalDemand: 'Lower-body power in physical duels with center backs, 10-meter burst, and vertical jump.',
    effectiveDribbles: [
      {
        id: 'amago-tiro-dc',
        name: 'Fake Shot & Near-Post Cut',
        difficulty: 'Intermediate',
        efficacyScore: 94,
        zone: 'Inside the penalty box (12 to 16 meters)',
        tagline: 'Selling the first-time strike so the center back lunges to block, slipping into open net.',
        whyEffective: 'Inside the 18-yard box, defenders panic about conceding shots. The fake shot takes them out of play while they slide into the turf.',
        stepByStep: [
          'Wind up your kicking leg with full visible force.',
          'At the final millisecond, cushion the ball with a gentle touch instead of striking.',
          'Take a 50cm lateral stride to bypass the sliding defender body.',
          'Finish low into the far corner away from the keeper.'
        ],
        whenToUse: 'On loose balls or low cutbacks inside the penalty area.',
        mistakesToAvoid: 'Taking too heavy a second touch that allows the goalkeeper to close you down.',
        proMaster: 'Erling Haaland / Robert Lewandowski / Karim Benzema',
        keySkillRequired: 'Ice-cold composure and footwork balance'
      }
    ],
    proInspirations: [
      {
        id: 'haaland-inspire',
        name: 'Erling Haaland',
        club: 'Manchester City',
        nationality: 'Norway',
        roleTitle: 'The Goal Machine & Master of Box Movement',
        avatarUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
        quote: 'My only thought inside the box is getting the ball into the net no matter what it takes.',
        signatureMove: 'Ferocious near-post dart beating the center back to the ball by inches',
        tacticalSuperpower: 'Decoy box runs: feints toward the far post then explodes like a rocket to the near post.',
        copyGuide: [
          {
            habitTitle: 'Zig-zag blindside movement to disorient center backs',
            category: 'Tactical Decision',
            whatToCopy: 'Take two steps back into the defender blind spot before exploding across their face to finish.',
            howToPractice: 'Box movement drills with passive markers where you must gain position in under 3 strides.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Volleys and aerial headers off driven crosses.',
      '1v1 finishing against the keeper under pursuit pressure.',
      'Back-to-goal hold-up play and lay-offs for attacking midfielders.'
    ]
  },
  DEC: {
    positionCode: 'DEC',
    title: 'Commanding Center Back / Defensive General',
    subtitle: 'Defensive leadership, aerial supremacy and composed ball progression',
    tacticalProfile: 'The modern center back marshals the defensive line through communication and positioning. They excel at timing tackles and finding vertical passes that break the first line of opposition press.',
    coreMission: 'Prevent goals, dominate 1v1 duels, and initiate possession from the first phase.',
    physicalDemand: 'Vertical leap power, upper-body core strength, and 5-meter reaction burst.',
    effectiveDribbles: [
      {
        id: 'recorte-salida-dec',
        name: 'Step-Back Safety Cut (Step-Back Cut)',
        difficulty: 'Basic',
        efficacyScore: 92,
        zone: 'Edge of own penalty area',
        tagline: 'Feigning a long clearance and cutting inside to connect with the unmarked fullback.',
        whyEffective: 'The pressing striker runs at full speed anticipating a long punt. The subtle cut lets you step into space without giving away cheap possession.',
        stepByStep: [
          'Wind up your leg as if launching a 50-meter direct ball.',
          'Drag the foot over the top of the ball, cushioning it inward to your other foot.',
          'Play a crisp ground pass to your open pivot or fullback.'
        ],
        whenToUse: 'Under aggressive pressing from opposition front-line forwards.',
        mistakesToAvoid: 'Risking a cut when you are the last man and a second striker is closing in.',
        proMaster: 'Virgil van Dijk / Rúben Dias / Antonio Rüdiger',
        keySkillRequired: 'Patience and clean first-touch security'
      }
    ],
    proInspirations: [
      {
        id: 'vandijk-inspire',
        name: 'Virgil van Dijk',
        club: 'Liverpool FC',
        nationality: 'Netherlands',
        roleTitle: 'The Defensive Wall & Backline Leader',
        avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
        quote: 'Defending well is making the striker feel they have no chance before they even try.',
        signatureMove: 'Jockeying without going to ground, forcing the striker onto their weaker foot',
        tacticalSuperpower: 'Composed presence and vocal leadership: orchestrates the entire backline.',
        copyGuide: [
          {
            habitTitle: 'Patient jockeying without diving in',
            category: 'Tactical Decision',
            whatToCopy: 'Never dive in rashly; keep feet active and wait for the attacker to take a heavy touch.',
            howToPractice: 'Backwards 1v1 jockeying drills where going to ground is prohibited.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Directional aerial clearances toward the touchlines.',
      'Driven ground passes breaking the first pressing line.',
      '1v1 defending in open space with 30 meters behind you.'
    ]
  },
  POR: {
    positionCode: 'POR',
    title: 'Modern Sweeper-Keeper',
    subtitle: 'Shot-stopping authority, commanding aerial presence and first build-up attacker',
    tacticalProfile: 'The modern goalkeeper does not merely react on the goal line; they position themselves high to sweep behind the defensive line and act as an extra outfield player in build-up play.',
    coreMission: 'Keep clean sheets and distribute with pinpoint accuracy from deep.',
    physicalDemand: 'Lightning reflexes, lateral dive power, and hand-eye coordination.',
    effectiveDribbles: [
      {
        id: 'amago-pase-portero',
        name: 'Keeper Feint & Lay-Off',
        difficulty: 'Intermediate',
        efficacyScore: 90,
        zone: '6-yard box & penalty area',
        tagline: 'Feigning a long goal kick to make the striker jump, rolling the ball short to the fullback.',
        whyEffective: 'The striker jumps in the air turning their back on the play, opening the safest short passing lane.',
        stepByStep: [
          'Shape up as if launching a 60-meter punt.',
          'Gently cushion the ball at the last instant and switch angle toward the open fullback.',
          'Deliver a firm, accurate pass straight to the defender feet.'
        ],
        whenToUse: 'On goal kicks or backpasses when the opponent commits to a high press.',
        mistakesToAvoid: 'Hesitating halfway through the motion or executing it too close to the goal line.',
        proMaster: 'Manuel Neuer / Alisson Becker / Thibaut Courtois',
        keySkillRequired: 'Composure under pressure and two-footed distribution'
      }
    ],
    proInspirations: [
      {
        id: 'alisson-inspire',
        name: 'Alisson Becker',
        club: 'Liverpool FC',
        nationality: 'Brazil',
        roleTitle: 'The Composed Shot-Stopper & 1v1 Specialist',
        avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
        quote: 'A great goalkeeper does not need flashy saves; proper positioning makes everything look effortless.',
        signatureMove: 'K-Block spread closing down 1v1 angles while staying upright until the shot',
        tacticalSuperpower: 'Flawless positional angle calculation and calming presence for the defense.',
        copyGuide: [
          {
            habitTitle: 'K-Block spread staying on your feet until the trigger',
            category: 'Technical Gesture',
            whatToCopy: 'Do not dive at the striker feet too early; stay upright to cover maximum goal frame.',
            howToPractice: '1v1 close-range duel drills against strikers shooting from 10 meters.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'High-ball catches under physical pressure in traffic.',
      'Pinpoint mid and long-range distribution to wingers.',
      'Point-blank reflex reactions inside the 6-yard box.'
    ]
  }
};

export const POSITION_ANALYSIS_DATA = POSITION_ANALYSIS_DATA_ES;

export function getLocalizedPositionAnalysis(pos: PositionCategory, lang: Language): PositionDeepAnalysis {
  if (lang === 'en') {
    return POSITION_ANALYSIS_DATA_EN[pos] || POSITION_ANALYSIS_DATA_EN.EXT;
  }
  // For 'pt' and 'es', default to Spanish (or Portuguese when applicable)
  return POSITION_ANALYSIS_DATA_ES[pos] || POSITION_ANALYSIS_DATA_ES.EXT;
}
