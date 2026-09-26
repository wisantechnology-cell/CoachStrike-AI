import { PositionCategory } from '../types';

export interface EffectiveDribble {
  id: string;
  name: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | 'Élite';
  efficacyScore: number; // e.g. 94%
  zone: string; // e.g. "Banda exterior y pico del área"
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
  category: 'Escaneo Visual' | 'Gesto Técnico' | 'Decisión Táctica' | 'Manejo de la Pausa' | 'Comportamiento en Pérdida' | 'Físico / Postura' | 'Mentalidad';
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

export const POSITION_ANALYSIS_DATA: Record<PositionCategory, PositionDeepAnalysis> = {
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
      },
      {
        id: 'fake-pass-turn',
        name: 'Amago de Pase y Pisada (Fake Pass & Roll)',
        difficulty: 'Intermedio',
        efficacyScore: 89,
        zone: 'Tres cuartos de campo',
        tagline: 'Armar la pierna vendiendo un pase a banda y pisar el balón hacia adentro con la suela.',
        whyEffective: 'El mediocentro defensivo rival suele estirar la pierna para cortar tu pase anunciado. Al pisar el balón en el último instante, su propio esfuerzo defensivo te abre un carril despejado hacia la portería.',
        stepByStep: [
          'Levanta la mirada y fija al extremo para que el defensor crea que vas a soltar la pelota.',
          'Arma la pierna de pase con fuerza aparente.',
          'En lugar de golpear, coloca la suela sobre el balón y arrástralo hacia tu perfil opuesto.',
          'Da el pase real hacia el delantero que ataca el espacio que quedó desguarnecido.'
        ],
        whenToUse: 'Para descolocar a pivotes con buen sentido táctico que marcan las líneas de pase.',
        mistakesToAvoid: 'Mirar al balón mientras haces el amago; el engaño se vende con la mirada y los hombros.',
        proMaster: 'Kevin De Bruyne / Mesut Özil / David Silva',
        keySkillRequired: 'Lenguaje corporal creíble y control de suela'
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
          },
          {
            habitTitle: 'La pausa para que el delantero entre en juego',
            category: 'Manejo de la Pausa',
            whatToCopy: 'Pisar el balón un segundo entero para congelar a la defensa rival hasta que el delantero inicie su carrera sin caer en fuera de juego.',
            howToPractice: 'Practicar pases al hueco midiendo el timing con el silbato de un entrenador.'
          }
        ]
      },
      {
        id: 'debruyne-inspire',
        name: 'Kevin De Bruyne',
        club: 'Manchester City',
        nationality: 'Bélgica',
        roleTitle: 'Creador Vertical y Francotirador de Pases Decisivos',
        avatarUrl: 'https://images.unsplash.com/photo-1543351611-72475171ee53?auto=format&fit=crop&w=400&q=80',
        quote: 'Si ves el espacio, el balón tiene que ir allí con la fuerza y comba exactas.',
        signatureMove: 'Centro tenso con rosca al segundo palo desde el semicírculo central',
        tacticalSuperpower: 'Precisión quirúrgica en pases de media y larga distancia en plena carrera.',
        copyGuide: [
          {
            habitTitle: 'Conducción agresiva atacando el espacio libre',
            category: 'Decisión Táctica',
            whatToCopy: 'Cuando haya espacio por delante, no devolver el pase fácil; conducir con zancada potente para obligar a un central a salir de su cueva.',
            howToPractice: 'Transiciones de 3v2 a toda velocidad cronometradas en menos de 6 segundos desde el medio campo.'
          },
          {
            habitTitle: 'Golpeo tenso con comba por delante de los centrales',
            category: 'Gesto Técnico',
            whatToCopy: 'Envolver el balón con el empeine interior para que pase justo entre el portero y la última línea de defensas.',
            howToPractice: 'Centros con portero rival activo tratando de colocar el balón en el pasillo de la incertidumbre (entre el punto de penalti y el área pequeña).'
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
        whyEffective: 'En tu zona perder el balón es casi gol rival. Este regate no busca humillar al rival, sino garantizar al 100% que la pelota queda a salvo mientras giras hacia tu lateral libre.',
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
      },
      {
        id: 'falso-pase-central',
        name: 'Amago de Retorno y Ruptura Vertical',
        difficulty: 'Intermedio',
        efficacyScore: 90,
        zone: 'Zona de gestación (propio campo)',
        tagline: 'Amagar con devolver el balón a tu central y salir conduciendo hacia el espacio que el delantero abandonó.',
        whyEffective: 'Los delanteros rivales saltan a presionar al pivote esperando que este descargue atrás hacia el central. Con un leve amago corporal el delantero sigue de largo y te deja 15 metros libres para avanzar.',
        stepByStep: [
          'Orienta tu cuerpo de vuelta hacia tu portería como si fueras a jugar fácil atrás.',
          'Arma el pie de pase hacia el central.',
          'A medio camino, desliza el balón hacia adelante con un toque sutil del empeine.',
          'Acelera dos zancadas para conectar con el interior o extremo desmarcado.'
        ],
        whenToUse: 'Cuando el equipo contrario está en bloque medio y el delantero presiona con saltos descoordinados.',
        mistakesToAvoid: 'Tardar demasiado en tomar la decisión y quedar atrapado con un 2v1 rival.',
        proMaster: 'Sergio Busquets / Rodri Hernández / Joshua Kimmich',
        keySkillRequired: 'Sangre fría y pausa bajo presión'
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
            howToPractice: 'Grábate en un partido y revisa si en cada salida de balón eres una línea de pase visible o si te tapas detrás del rival.'
          },
          {
            habitTitle: 'Pase con la tensión perfecta al pie dominante del compañero',
            category: 'Gesto Técnico',
            whatToCopy: 'No dar pases flotados o lentos que comprometan al receptor; pasar con fuerza a ras de césped para acelerar la circulación.',
            howToPractice: 'Series de 50 pases de 20 metros con un compañero buscando que el balón no bote ni una sola vez en el trayecto.'
          },
          {
            habitTitle: 'Freno táctico sin cometer falta',
            category: 'Comportamiento en Pérdida',
            whatToCopy: 'Temporizar la carrera del contragolpe rival cerrando el carril central para dar tiempo a que tus compañeros replieguen.',
            howToPractice: '1v1 en transición defensiva donde tu objetivo no es quitar la pelota, sino retrasar su avance 5 segundos.'
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
  MC: {
    positionCode: 'MC',
    title: 'Mediocentro Mixto / Box-to-Box',
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
      },
      {
        id: 'v-pull-mc',
        name: 'Pisada y Salida en V (V-Pull)',
        difficulty: 'Avanzado',
        efficacyScore: 89,
        zone: 'Centro del campo bajo presión lateral',
        tagline: 'Traer la pelota con la suela hacia atrás y empujar con el interior o exterior en ángulo de 45°.',
        whyEffective: 'Hace que el rival que viene en carrera lateral pase de largo y te permite cambiar de frente de juego con comodidad.',
        stepByStep: [
          'Conduce hacia la presión rival simulando que te has quedado sin salida.',
          'Pisa la pelota con la suela de tu pie dominante y arrástrala hacia tu cadera de apoyo.',
          'Con el empeine del mismo pie golpea hacia el otro lado en forma de letra V.',
          'Acelera hacia el espacio recién creado.'
        ],
        whenToUse: 'Cuando te enciman dos rivales por la misma banda.',
        mistakesToAvoid: 'Arrastrar el balón demasiado despacio permitiendo que el rival recupere la posición.',
        proMaster: 'Luka Modrić / Jude Bellingham',
        keySkillRequired: 'Sensibilidad plantar y agilidad de tobillo'
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
          },
          {
            habitTitle: 'Conducción con el torso erguido para ver todo el campo',
            category: 'Físico / Postura',
            whatToCopy: 'Correr con el balón sin mirar constantemente al suelo; mantener la vista al frente para elegir el pase adecuado.',
            howToPractice: 'Conducción en eslalon con conos mientras sostienes la mirada en una pantalla o compañero que cambia de color.'
          }
        ]
      },
      {
        id: 'valverde-inspire',
        name: 'Federico Valverde',
        club: 'Real Madrid',
        nationality: 'Uruguay',
        roleTitle: 'El Halcón de Despliegue Infinito & Cañón Lejano',
        avatarUrl: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=400&q=80',
        quote: 'El talento sin pulmones no sirve de nada en el fútbol de máxima exigencia.',
        signatureMove: 'Sprint de 40 metros con golpeo con empeine total a la escuadra',
        tacticalSuperpower: 'Sprint defensivo de repliegue que desbarata contragolpes casi sentenciados.',
        copyGuide: [
          {
            habitTitle: 'El sprint de repliegue con orgullo competitivo',
            category: 'Comportamiento en Pérdida',
            whatToCopy: 'Correr hacia atrás a la misma velocidad que corres hacia adelante cuando tu equipo pierde la pelota.',
            howToPractice: 'Series de lanzamientos de ataque con transición inmediata de repliegue a defender tu área en menos de 8 segundos.'
          },
          {
            habitTitle: 'Disparo seco con empeine total sin dar pistas',
            category: 'Gesto Técnico',
            whatToCopy: 'Armar el pie con rapidez y golpear el centro del balón con el empeine duro para que salga como un proyectil sin rotación.',
            howToPractice: 'Golpeos desde 25 metros tras pase raso hacia atrás; enfócate en bloquear el tobillo al impactar.'
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
      },
      {
        id: 'giro-apoyo-cadera',
        name: 'Giro de Espaldas con Apoyo de Cadera (Turn & Roll)',
        difficulty: 'Avanzado',
        efficacyScore: 91,
        zone: 'Borde del área grande de espaldas a portería',
        tagline: 'Fijar al central con la espalda, sentir hacia dónde carga su peso y girar por el lado ciego.',
        whyEffective: 'El central que te encima fuerte queda vendido si utilizas su propio peso de apoyo para pivotar sobre él como una puerta giratoria.',
        stepByStep: [
          'Recibe de espaldas usando tu espalda y glúteos para mantener alejado al central.',
          'Siente con tu cuerpo si el central carga su peso a tu izquierda o derecha.',
          'Gira con el empeine exterior hacia el lado donde el central tiene menos apoyo.',
          'Dispara en el primer paso tras completar el giro de 180°.'
        ],
        whenToUse: 'En pases frontales cuando el central está pegado sin darte espacio para controlar de cara.',
        mistakesToAvoid: 'Dejar que el central te anticipe tocando el balón antes de que lo asegures con tu cuerpo.',
        proMaster: 'Karim Benzema / Romelu Lukaku / Luis Suárez',
        keySkillRequired: 'Fuerza de tronco y juego de espaldas'
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
          },
          {
            habitTitle: 'Remate al primer toque sin dudar ni un segundo',
            category: 'Gesto Técnico',
            whatToCopy: 'No acomodarse el balón dentro del área; rematar con lo que haga falta (empeine, puntera, cabeza) en el primer contacto.',
            howToPractice: 'Rondas de remates rápidos con centros imprevisibles desde ambos costados sin control previo permitido.'
          }
        ]
      },
      {
        id: 'mbappe-inspire',
        name: 'Kylian Mbappé',
        club: 'Real Madrid',
        nationality: 'Francia',
        roleTitle: 'Velocidad Letal & Definición al Palo Corto/Largo',
        avatarUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
        quote: 'El espacio está ahí para quien tenga la convicción y la velocidad de reclamarlo.',
        signatureMove: 'Paso largo en diagonal, mirada al segundo palo y definición rasa al palo corto',
        tacticalSuperpower: 'Aceleración en diagonal partiendo desde el límite exacto del fuera de juego.',
        copyGuide: [
          {
            habitTitle: 'Alinear la carrera con el hombro del último defensa',
            category: 'Decisión Táctica',
            whatToCopy: 'No estar en posición adelantada; correr en paralelo a la línea de fuera de juego y romper en cuanto el pasador levanta la cabeza.',
            howToPractice: 'Trabajo de timing con banderas de fuera de juego y pasador que varía el momento del golpeo.'
          },
          {
            habitTitle: 'Apertura de pie para definir con el interior o empeine cruzado',
            category: 'Gesto Técnico',
            whatToCopy: 'Engañar al portero con la cadera: abrir el cuerpo como si fueras a cruzarla y meter el tiro al palo corto con sutileza.',
            howToPractice: '1v1 mano a mano contra el portero practicando definir a ambos lados de la red.'
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
  LAT: {
    positionCode: 'LAT',
    title: 'Lateral / Carrilero Moderno',
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
        whyEffective: 'El extremo rival suele presionar de frente con el cuerpo volcado. Un toque largo al espacio libre aprovecha que tú ya estás orientado hacia adelante y él debe girar 180° para perseguirte.',
        stepByStep: [
          'Espera a que el extremo rival acuda a apretarte con entusiasmo.',
          'Con el exterior de tu bota empuja la pelota 8 a 12 metros por delante pegado a la línea.',
          'Pasa por el lado opuesto del rival o por fuera del campo si es necesario.',
          'Conecta con el centro al área antes de que llegue el central a la cobertura.'
        ],
        whenToUse: 'En salidas de banda cuando el extremo rival viene lanzado sin freno.',
        mistakesToAvoid: 'Tocar el balón hacia el centro del campo donde puede interceptarlo el mediocentro rival.',
        proMaster: 'Alphonso Davies / Achraf Hakimi / Kyle Walker',
        keySkillRequired: 'Velocidad punta y timing de contacto'
      },
      {
        id: 'freno-recorte-interior-lat',
        name: 'Freno en Seco y Recorte hacia el Interior',
        difficulty: 'Intermedio',
        efficacyScore: 90,
        zone: 'Último tercio pegado al banderín de córner',
        tagline: 'Frenar la carrera en seco con el empeine interior para dejar pasar al lateral/extremo en carrera.',
        whyEffective: 'El defensor que te persigue por banda va a máxima velocidad intentando tapar el centro a la carrera. Si frenas de golpe, pasará de largo y te dejará espacio para asociarte con tu mediocentro o centrar con tu pierna hábil.',
        stepByStep: [
          'Inicia un sprint potente por la banda como si fueras a centrar de primeras.',
          'Planta el pie de apoyo firmemente en el césped.',
          'Con el interior del pie ejecutor corta el balón hacia tu espalda o hacia adentro.',
          'Levanta la cabeza con calma y busca el pase retrasado al punto de penalti.'
        ],
        whenToUse: 'Cuando el rival te gana la posición en carrera para tapar la línea de fondo.',
        mistakesToAvoid: 'Frenar sin clavar bien los tacos (resbalar) o recortar hacia donde viene un segundo defensor.',
        proMaster: 'Dani Carvajal / Trent Alexander-Arnold / Andrew Robertson',
        keySkillRequired: 'Equilibrio de frenada y templanza visual'
      }
    ],
    proInspirations: [
      {
        id: 'hakimi-inspire',
        name: 'Achraf Hakimi',
        club: 'Paris Saint-Germain',
        nationality: 'Marruecos',
        roleTitle: 'El Carrilero Flecha de Recorrido Infatigable',
        avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
        quote: 'El carril es tuyo: debes conquistarlo con el corazón y con las piernas en cada jugada.',
        signatureMove: 'Conducción en diagonal con el exterior y centro tenso raso al punto de penalti',
        tacticalSuperpower: 'Capacidad de sprintar en el minuto 90 a la misma velocidad que en el minuto 1.',
        copyGuide: [
          {
            habitTitle: 'El desdoblamiento exterior (Overlap) en el momento justo',
            category: 'Decisión Táctica',
            whatToCopy: 'Iniciar la carrera por detrás de tu extremo en cuanto este fija la atención del lateral rival.',
            howToPractice: 'Trabajo de 2v1 en banda coordinando la señal visual con tu extremo para pasar a máxima velocidad.'
          },
          {
            habitTitle: 'Perfilación defensiva de costado en el 1v1',
            category: 'Físico / Postura',
            whatToCopy: 'Nunca esperar al extremo rival con los pies en línea recta; colocarse de lado orientándolo hacia la línea de banda o su pierna débil.',
            howToPractice: 'Práctica de aguantar 1v1 defensivo sin meter el pie hasta que el extremo dé un toque largo.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Centros en carrera tras sprint de 30 metros a máxima intensidad.',
      'Duelos 1v1 defensivos orientando al atacante hacia la banda.',
      'Trabajo de diagonales defensivas para cubrir la espalda de los centrales.'
    ]
  },
  DEC: {
    positionCode: 'DEC',
    title: 'Defensa Central / Mariscal de Área',
    subtitle: 'Solidez defensiva, liderazgo de la línea y salida limpia de balón',
    tacticalProfile: 'El central de hoy en día es el primer atacante y el último bastión defensivo. Debe dominar el juego aéreo, tener la velocidad para defender con 40 metros a sus espaldas y la templanza para romper líneas con pases tensos.',
    coreMission: 'Neutralizar las acometidas rivales, liderar la basculación defensiva y organizar la salida limpia de juego.',
    physicalDemand: 'Dominio del juego aéreo, potencia en el choque, aceleración en giros y resistencia mental.',
    effectiveDribbles: [
      {
        id: 'recorte-despeje-dec',
        name: 'Recorte Defensivo con Amago de Despeje (Fake Clearance)',
        difficulty: 'Básico',
        efficacyScore: 95,
        zone: 'Borde de área propia bajo presión alta',
        tagline: 'Amagar un pelotazo largo con el empeine y enganchar con el interior hacia tu portero o lateral.',
        whyEffective: 'El delantero rival corre desesperado a tapar tu despeje largo. Con el amago salta con las piernas abiertas o se barre, dejándote una salida limpia y tranquila sin regalar el balón.',
        stepByStep: [
          'Arma la pierna de golpeo exagerando el movimiento como si fueras a reventar el balón al medio campo.',
          'El delantero cerrará los ojos o estirará la pierna para tapar el impacto.',
          'Pasa suavemente tu pie por encima o frena la pelota con el interior hacia el lado contrario.',
          'Entrega el balón raso y con calma a tu lateral desmarcado.'
        ],
        whenToUse: 'Cuando el delantero rival va a bloquear tu pase largo y no tienes un compañero fácil de frente.',
        mistakesToAvoid: 'Hacerlo dentro de tu propia área pequeña si el portero está descolocado.',
        proMaster: 'Virgil van Dijk / Sergio Ramos / Ronald Araújo',
        keySkillRequired: 'Sangre fría y convencimiento corporal'
      },
      {
        id: 'conduccion-fijadora-dec',
        name: 'Paso Adelante y Conducción Fijadora',
        difficulty: 'Intermedio',
        efficacyScore: 91,
        zone: 'Primer tercio hacia el medio campo',
        tagline: 'Conducir con decisión 10 metros hacia adelante para obligar a un mediocentro rival a salir de su posición.',
        whyEffective: 'Si no te presionan, ganas metros gratis. En cuanto un mediocampista rival salta a frenarte, automáticamente deja libre a tu mediapunta a su espalda.',
        stepByStep: [
          'Si los delanteros rivales están cerrando las bandas, avanza por el pasillo central.',
          'Conduce a velocidad media con la cabeza levantada observando la segunda línea rival.',
          'En el segundo en que el mediocampista rival se mueva hacia ti, filtra el balón a su espalda.',
          'Retrocede dos pasos para quedar listo para la cobertura en caso de pérdida.'
        ],
        whenToUse: 'Contra bloques bajos o medios donde el rival te concede la posesión de los primeros 30 metros.',
        mistakesToAvoid: 'Conducir demasiado lento o seguir avanzando cuando ya te han cerrado el espacio de pase.',
        proMaster: 'Virgil van Dijk / Antonio Rüdiger / David Alaba',
        keySkillRequired: 'Visión de juego y pase tenso a ras de césped'
      }
    ],
    proInspirations: [
      {
        id: 'vandijk-inspire',
        name: 'Virgil van Dijk',
        club: 'Liverpool FC',
        nationality: 'Países Bajos',
        roleTitle: 'El Mariscal Tranquilo & Amo de los Duelos Aéreos',
        avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
        quote: 'El gran defensa no necesita tirarse al suelo; impone su presencia y lee la jugada antes.',
        signatureMove: 'Temporización 1v1 guiando al atacante hacia la banda sin tirarse nunca al suelo',
        tacticalSuperpower: 'Gana el 82% de todos los duelos aéreos y terrestres mediante lectura de trayectoria.',
        copyGuide: [
          {
            habitTitle: 'Temporizar en lugar de precipitarse a meter el pie',
            category: 'Decisión Táctica',
            whatToCopy: 'Retroceder perfilado con pasos cortos sin tirarse al suelo, obligando al delantero a tomar una decisión apresurada.',
            howToPractice: 'Práctica de 1v1 donde tienes prohibido tirarte al césped; tu único objetivo es que el delantero no pueda rematar a puerta.'
          },
          {
            habitTitle: 'Pase en diagonal de 40 metros al pecho del extremo opuesto',
            category: 'Gesto Técnico',
            whatToCopy: 'Golpear el balón con el empeine exterior con trayectoria descendente para cambiar el frente de ataque en un segundo.',
            howToPractice: 'Series de pases largos a zonas diana marcadas con conos en el córner contrario.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Despejes aéreos dirigidos hacia las bandas en lugar de hacia el centro.',
      'Temporización y perfilación corporal en contragolpes de 2v2.',
      'Pases verticales rasos entre líneas que rompen la primera presión rival.'
    ]
  },
  POR: {
    positionCode: 'POR',
    title: 'Portero / Guardameta Líbero',
    subtitle: 'Bajo los tres palos, dominio aéreo y primer organizador con los pies',
    tacticalProfile: 'El guardameta moderno es un jugador de campo con guantes: debe dominar el área de penalti, anticipar balones a la espalda de los centrales como líbero y tener precisión con ambos pies para el juego asociativo.',
    coreMission: 'Evitar goles, transmitir seguridad y actuar como líbero en balones largos a la espalda de la defensa.',
    physicalDemand: 'Reflejos felinos, potencia explosiva de piernas para saltos laterales y flexibilidad articular.',
    effectiveDribbles: [
      {
        id: 'amago-pase-portero',
        name: 'Amago de Despeje y Pase Corto al Central',
        difficulty: 'Intermedio',
        efficacyScore: 92,
        zone: 'Área propia ante presión de delanteros',
        tagline: 'Fingir el despeje largo para congelar al delantero y filtrar el pase raso seguro.',
        whyEffective: 'Desactiva la trampa de presión rival y permite al equipo salir jugando desde el fondo con superioridad numérica.',
        stepByStep: [
          'Arma la pierna como si fueras a despejar en largo hacia el campo rival.',
          'Pisa o recorta el balón 30 cm hacia tu pierna de apoyo.',
          'Entrega de primeras al central abierto que tiene tiempo y espacio.'
        ],
        whenToUse: 'Bajo presión alta de los delanteros rivales.',
        mistakesToAvoid: 'Hacer el recorte en dirección a la propia portería.',
        proMaster: 'Marc-André ter Stegen / Manuel Neuer / Ederson',
        keySkillRequired: 'Paciencia y seguridad con el balón en los pies'
      }
    ],
    proInspirations: [
      {
        id: 'terstegen-inspire',
        name: 'Marc-André ter Stegen',
        club: 'FC Barcelona',
        nationality: 'Alemania',
        roleTitle: 'El Muro de Reflejos & Juego de Pies Milimétrico',
        avatarUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80',
        quote: 'Un buen portero transmite tanta calma que hace que el equipo juegue sin miedo.',
        signatureMove: 'Parada en cruz estilo balonmano para tapar tiros a bocajarro',
        tacticalSuperpower: 'Salida de balón con ambos pies como si fuera un mediocentro más.',
        copyGuide: [
          {
            habitTitle: 'La postura en cruz (bloqueo balonmano)',
            category: 'Físico / Postura',
            whatToCopy: 'Bajar una rodilla al suelo y abrir los brazos en 1v1 para tapar el máximo arco posible ante el delantero.',
            howToPractice: 'Ejercicios de reacción corta en remates dentro del área pequeña.'
          }
        ]
      }
    ],
    recommendedTrainingFocus: [
      'Juego con los pies bajo presión de dos atacantes.',
      'Salidas en balones aéreos al área pequeña con puños decididos.',
      'Reflejos en disparos desviados a quemarropa.'
    ]
  }
};
