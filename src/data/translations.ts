export type Language = 'es' | 'en' | 'pt';

export interface Translations {
  // Navigation
  navBrand: string;
  navTest: string;
  navTactics: string;
  navDrills: string;
  navChat: string;
  navHistory: string;
  navGlossary: string;
  navSettings: string;
  navAcademy: string;
  navPlans: string;
  startEvaluation: string;

  // Hero
  heroTag: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroSubtitle: string;
  btnStartTest: string;
  btnExploreDrills: string;
  heroStat1Val: string;
  heroStat1Lbl: string;
  heroStat2Val: string;
  heroStat2Lbl: string;
  heroStat3Val: string;
  heroStat3Lbl: string;
  heroFeature1Title: string;
  heroFeature1Desc: string;
  heroFeature2Title: string;
  heroFeature2Desc: string;
  heroFeature3Title: string;
  heroFeature3Desc: string;

  // Questionnaire
  stepLabel: string;
  ofLabel: string;
  prevQuestion: string;
  nextQuestion: string;
  finishTest: string;
  namePromptTitle: string;
  namePromptSub: string;
  nameLabel: string;
  footLabel: string;
  footRight: string;
  footLeft: string;
  footBoth: string;

  // Evaluation Result
  resultHeaderTag: string;
  resultTitle: string;
  resultSubtitle: string;
  matchScore: string;
  radarTitle: string;
  proComparisonTitle: string;
  proComparisonSub: string;
  keyStrengths: string;
  areasToImprove: string;
  tacticalDutiesTitle: string;
  tacticalOverviewTitle: string;
  recommendedDrillsTitle: string;
  btnSaveReport: string;
  btnSaved: string;
  btnRepeatTest: string;
  btnAskCoachAboutReport: string;

  // Tactical Board
  tacticsTag: string;
  tacticsTitle: string;
  tacticsSubtitle: string;
  clickPlayerInstruction: string;
  dutyCardTitle: string;
  roleLabel: string;

  // Drills
  drillsTag: string;
  drillsTitle: string;
  drillsSubtitle: string;
  searchDrillPlaceholder: string;
  allCategories: string;
  durationMins: string;
  viewProSteps: string;

  // Coach Chat
  coachTitle: string;
  coachStatus: string;
  coachWelcomeWithProfile: string;
  coachWelcomeDefault: string;
  inputPlaceholder: string;
  quickQueries: string;
  analyzingTactics: string;

  // Saved Profiles
  historyTag: string;
  historyTitle: string;
  historySubtitle: string;
  newEvaluation: string;
  noSavedProfilesTitle: string;
  noSavedProfilesSub: string;
  viewFullReport: string;

  // Glossary
  glossaryTitle: string;
  glossarySubtitle: string;
  searchGlossaryPlaceholder: string;
  glossaryExample: string;
  glossaryImportance: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  languageSectionTitle: string;
  themeSectionTitle: string;
  accentSectionTitle: string;
  resetDefaults: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    navBrand: 'COACHSTRIKE AI',
    navTest: 'Evaluación ADN',
    navTactics: 'Pizarra Táctica',
    navDrills: 'Biblioteca Ejercicios',
    navChat: 'Coach AI UEFA',
    navHistory: 'Fichas & Análisis',
    navGlossary: 'Glosario Táctico',
    navSettings: 'Ajustes',
    navAcademy: 'Academia',
    navPlans: 'Planes',
    startEvaluation: 'Hacer Test',

    heroTag: 'UEFA PRO METHODOLOGY & AI SCOUTING',
    heroTitle1: 'Descubre Tu',
    heroTitleHighlight: 'ADN Futbolístico',
    heroTitle2: 'e Identidad Táctica',
    heroSubtitle: 'Sistema inteligente de análisis táctico que evalúa tus capacidades físicas, visión espacial, técnica y liderazgo para asignarte tu posición profesional ideal y compararte con jugadores de elite.',
    btnStartTest: 'Iniciar Test de ADN Táctico',
    btnExploreDrills: 'Explorar Ejercicios Pro',
    heroStat1Val: '98.4%',
    heroStat1Lbl: 'Precisión Scouting',
    heroStat2Val: '+15',
    heroStat2Lbl: 'Atributos Medidos',
    heroStat3Val: 'UEFA Pro',
    heroStat3Lbl: 'Algoritmo Táctico',
    heroFeature1Title: 'Análisis Multidimensional',
    heroFeature1Desc: 'Evaluamos toma de decisiones bajo presión, perfilación corporal y lectura de juego.',
    heroFeature2Title: 'Radar de Habilidades Elite',
    heroFeature2Desc: 'Genera una gráfica completa comparativa contra estándares del fútbol europeo.',
    heroFeature3Title: 'Asistente Táctico AI 24/7',
    heroFeature3Desc: 'Resuelve tus dudas sobre formaciones, bloques defensivos y movimientos sin balón.',

    stepLabel: 'PREGUNTA',
    ofLabel: 'DE',
    prevQuestion: 'Anterior',
    nextQuestion: 'Siguiente',
    finishTest: 'Generar Ficha Scouting',
    namePromptTitle: '¡Bienvenido al Test de ADN Futbolístico!',
    namePromptSub: 'Para personalizar tu informe scouting y recomendaciones del Coach AI, ingresa tus datos básicos:',
    nameLabel: 'Tu Nombre / Nombre de Jugador:',
    footLabel: 'Pie Dominante:',
    footRight: 'Diestro',
    footLeft: 'Zurdo',
    footBoth: 'Ambidestro',

    resultHeaderTag: 'INFORME SCOUTING OFICIAL',
    resultTitle: 'Resultado de Evaluación de ADN',
    resultSubtitle: 'Análisis detallado de aptitudes, perfil táctico y comparación con estrellas profesionales.',
    matchScore: 'Compatibilidad Táctica',
    radarTitle: 'Perfil de Atributos del Jugador',
    proComparisonTitle: 'Comparativa con Estrella Profesional',
    proComparisonSub: 'Tu estilo de juego muestra una alta afinidad biomecánica y táctica.',
    keyStrengths: 'Fortalezas Clave',
    areasToImprove: 'Áreas de Mejora Prioritarias',
    tacticalDutiesTitle: 'Zonas de Influencia y Tareas en el Campo',
    tacticalOverviewTitle: 'Análisis Táctico Detallado del Director Técnico',
    recommendedDrillsTitle: 'Plan de Entrenamiento Recomendado',
    btnSaveReport: 'Guardar Ficha Scouting',
    btnSaved: 'Guardado en Mis Informes',
    btnRepeatTest: 'Repetir Evaluación',
    btnAskCoachAboutReport: 'Consultar al Coach AI sobre este Informe',

    tacticsTag: 'SIMULADOR DE FORMACIONES Y ROLES',
    tacticsTitle: 'Pizarra Táctica Interactiva',
    tacticsSubtitle: 'Inspecciona las responsabilidades defensivas y ofensivas de cada posición según el esquema táctico.',
    clickPlayerInstruction: 'Haz clic en un jugador para inspeccionar sus tareas tácticas',
    dutyCardTitle: 'Ficha del Puesto Táctico',
    roleLabel: 'Rol',

    drillsTag: 'PLAYBOOK TÁCTICO & METODOLOGÍA',
    drillsTitle: 'Biblioteca de Ejercicios',
    drillsSubtitle: 'Rutinas diseñadas para perfeccionar técnica, velocidad de reacción y toma de decisiones en el terreno de juego.',
    searchDrillPlaceholder: 'Buscar ejercicio o cualidad...',
    allCategories: 'Todas',
    durationMins: 'MINS',
    viewProSteps: 'Ver Pasos & Consejos Pro',

    coachTitle: 'CoachStrike Tactical AI',
    coachStatus: 'DIRECTOR TÉCNICO UEFA PRO',
    coachWelcomeWithProfile: '¡Hola {name}! He revisado tu informe de {position}. ¿En qué aspecto técnico o táctico quieres profundizar hoy? Puedo darte consejos sobre cómo superar un bloque bajo, mejorar tu pierna débil o posicionamiento.',
    coachWelcomeDefault: '¡Hola crack! Soy CoachStrike AI, tu Asistente y Director Técnico Táctico. Hazme cualquier consulta sobre táctica de fútbol, posiciones, formaciones o rutinas de entrenamiento.',
    inputPlaceholder: 'Pregunta al Coach sobre tácticas, ejercicios o formaciones...',
    quickQueries: 'Consultas rápidas:',
    analyzingTactics: 'Analizando jugada e hilando estrategia...',

    historyTag: 'HISTORIAL DE EVALUACIONES',
    historyTitle: 'Mis Perfiles Guardados',
    historySubtitle: 'Revisa tus informes anteriores o compara tu evolución táctica a lo largo de la temporada.',
    newEvaluation: 'Nueva Evaluación',
    noSavedProfilesTitle: 'Aún no has guardado ninguna evaluación',
    noSavedProfilesSub: 'Completa el test de ADN de jugador para descubrir tu posición ideal y guardar tu ficha scouting.',
    viewFullReport: 'Ver Informe Completo',

    glossaryTitle: 'Glosario Táctico de Fútbol',
    glossarySubtitle: 'Diccionario completo de términos técnicos, movimientos y estrategias para entender el fútbol moderno.',
    searchGlossaryPlaceholder: 'Buscar concepto (ej: Bloque bajo, Carrilero, Box-to-Box)...',
    glossaryExample: 'Ejemplo Práctico',
    glossaryImportance: 'Importancia Táctica',

    settingsTitle: 'Configuración & Personalización',
    settingsSubtitle: 'Personaliza el idioma de la aplicación, el tema visual de fondo y el color neón de acento.',
    languageSectionTitle: 'Idioma de la Aplicación',
    themeSectionTitle: 'Tema de Fondo',
    accentSectionTitle: 'Color Neón de Acento (Resaltados y Botones)',
    resetDefaults: 'Restaurar Valores por Defecto',
    close: 'Cerrar'
  },
  en: {
    navBrand: 'COACHSTRIKE AI',
    navTest: 'DNA Assessment',
    navTactics: 'Tactical Board',
    navDrills: 'Drills Library',
    navChat: 'UEFA AI Coach',
    navHistory: 'Saved & Analysis',
    navGlossary: 'Tactical Glossary',
    navSettings: 'Settings',
    navAcademy: 'Academy',
    navPlans: 'Plans',
    startEvaluation: 'Take Test',

    heroTag: 'UEFA PRO METHODOLOGY & AI SCOUTING',
    heroTitle1: 'Discover Your',
    heroTitleHighlight: 'Football DNA',
    heroTitle2: '& Tactical Identity',
    heroSubtitle: 'Smart tactical analysis system that evaluates physical traits, spatial awareness, technique, and leadership to assign your ideal professional position and compare you with pro players.',
    btnStartTest: 'Start Tactical DNA Test',
    btnExploreDrills: 'Explore Pro Drills',
    heroStat1Val: '98.4%',
    heroStat1Lbl: 'Scouting Accuracy',
    heroStat2Val: '+15',
    heroStat2Lbl: 'Measured Attributes',
    heroStat3Val: 'UEFA Pro',
    heroStat3Lbl: 'Tactical Engine',
    heroFeature1Title: 'Multidimensional Analysis',
    heroFeature1Desc: 'We evaluate decision-making under pressure, body orientation, and game reading.',
    heroFeature2Title: 'Elite Skills Radar',
    heroFeature2Desc: 'Generates a full radar chart comparing your profile with top European football standards.',
    heroFeature3Title: '24/7 AI Tactical Assistant',
    heroFeature3Desc: 'Answers all your questions regarding formations, defensive blocks, and off-the-ball runs.',

    stepLabel: 'QUESTION',
    ofLabel: 'OF',
    prevQuestion: 'Previous',
    nextQuestion: 'Next',
    finishTest: 'Generate Scouting Card',
    namePromptTitle: 'Welcome to Football DNA Assessment!',
    namePromptSub: 'Enter your basic details to customize your scouting report and AI Coach recommendations:',
    nameLabel: 'Your Name / Player Name:',
    footLabel: 'Preferred Foot:',
    footRight: 'Right-footed',
    footLeft: 'Left-footed',
    footBoth: 'Ambidextrous',

    resultHeaderTag: 'OFFICIAL SCOUTING REPORT',
    resultTitle: 'DNA Evaluation Results',
    resultSubtitle: 'In-depth analysis of skills, tactical profile, and pro player comparison.',
    matchScore: 'Tactical Affinity',
    radarTitle: 'Player Attribute Profile',
    proComparisonTitle: 'Pro Player Comparison',
    proComparisonSub: 'Your playing style shows high biomechanical and tactical similarity.',
    keyStrengths: 'Key Strengths',
    areasToImprove: 'Priority Areas for Growth',
    tacticalDutiesTitle: 'Zones of Influence & Pitch Duties',
    tacticalOverviewTitle: 'In-Depth Head Coach Analysis',
    recommendedDrillsTitle: 'Recommended Training Program',
    btnSaveReport: 'Save Scouting Report',
    btnSaved: 'Saved in My Reports',
    btnRepeatTest: 'Retake Evaluation',
    btnAskCoachAboutReport: 'Ask AI Coach About This Report',

    tacticsTag: 'FORMATION & ROLE SIMULATOR',
    tacticsTitle: 'Interactive Tactical Board',
    tacticsSubtitle: 'Inspect defensive and offensive duties for every position across formations.',
    clickPlayerInstruction: 'Click any player token to inspect tactical duties',
    dutyCardTitle: 'Tactical Position File',
    roleLabel: 'Role',

    drillsTag: 'TACTICAL PLAYBOOK & METHODOLOGY',
    drillsTitle: 'Drills Library',
    drillsSubtitle: 'Workouts designed to sharpen technique, reaction speed, and pitch decision-making.',
    searchDrillPlaceholder: 'Search drill or quality...',
    allCategories: 'All',
    durationMins: 'MINS',
    viewProSteps: 'View Steps & Pro Tips',

    coachTitle: 'CoachStrike Tactical AI',
    coachStatus: 'UEFA PRO HEAD COACH',
    coachWelcomeWithProfile: 'Hello {name}! I reviewed your {position} report. What tactical or technical aspect would you like to work on today? I can guide you through breaking low blocks, weak foot drills, or positioning.',
    coachWelcomeDefault: 'Welcome star! I am CoachStrike AI, your Tactical Head Coach. Ask me anything about football tactics, formations, positioning, or drill routines.',
    inputPlaceholder: 'Ask the Coach about tactics, drills, or formations...',
    quickQueries: 'Quick queries:',
    analyzingTactics: 'Analyzing tactical play and generating strategy...',

    historyTag: 'ASSESSMENT HISTORY',
    historyTitle: 'My Saved Profiles',
    historySubtitle: 'Review past scouting reports or track your tactical growth over the season.',
    newEvaluation: 'New Assessment',
    noSavedProfilesTitle: 'No saved evaluations yet',
    noSavedProfilesSub: 'Complete the player DNA test to discover your ideal position and save your scouting card.',
    viewFullReport: 'View Full Report',

    glossaryTitle: 'Football Tactical Glossary',
    glossarySubtitle: 'Comprehensive dictionary of tactical terms, player movements, and modern football strategies.',
    searchGlossaryPlaceholder: 'Search concept (e.g. Low block, Wing-back, Box-to-Box)...',
    glossaryExample: 'Practical Example',
    glossaryImportance: 'Tactical Importance',

    settingsTitle: 'Settings & Customization',
    settingsSubtitle: 'Customize application language, dark background theme, and accent color.',
    languageSectionTitle: 'Application Language',
    themeSectionTitle: 'Background Theme',
    accentSectionTitle: 'Accent Neon Color (Highlights & Buttons)',
    resetDefaults: 'Reset to Defaults',
    close: 'Close'
  },
  pt: {
    navBrand: 'COACHSTRIKE AI',
    navTest: 'Avaliação de ADN',
    navTactics: 'Prancheta Tática',
    navDrills: 'Biblioteca de Exercícios',
    navChat: 'Treinador AI UEFA',
    navHistory: 'Fichas & Análise',
    navGlossary: 'Glossário Tático',
    navSettings: 'Configurações',
    navAcademy: 'Academia',
    navPlans: 'Planos',
    startEvaluation: 'Fazer Teste',

    heroTag: 'UEFA PRO METHODOLOGY & AI SCOUTING',
    heroTitle1: 'Descubra o Seu',
    heroTitleHighlight: 'ADN do Futebol',
    heroTitle2: 'e Identidade Tática',
    heroSubtitle: 'Sistema inteligente de análise tática que avalia capacidade física, visão espacial, técnica e liderança para definir a sua posição profissional ideal e compará-lo a jogadores de elite.',
    btnStartTest: 'Iniciar Teste de ADN Tático',
    btnExploreDrills: 'Explorar Exercícios Pro',
    heroStat1Val: '98.4%',
    heroStat1Lbl: 'Precisão Scouting',
    heroStat2Val: '+15',
    heroStat2Lbl: 'Atributos Avaliados',
    heroStat3Val: 'UEFA Pro',
    heroStat3Lbl: 'Algoritmo Tático',
    heroFeature1Title: 'Análise Multidimensional',
    heroFeature1Desc: 'Avaliamos tomada de decisão sob pressão, perfilamento corporal e leitura de jogo.',
    heroFeature2Title: 'Radar de Habilidades Elite',
    heroFeature2Desc: 'Gera um gráfico comparativo completo com os padrões do futebol europeu.',
    heroFeature3Title: 'Assistente Tático AI 24/7',
    heroFeature3Desc: 'Tire dúvidas sobre formações, blocos defensivos e movimentações sem bola.',

    stepLabel: 'PERGUNTA',
    ofLabel: 'DE',
    prevQuestion: 'Anterior',
    nextQuestion: 'Próxima',
    finishTest: 'Gerar Ficha de Scouting',
    namePromptTitle: 'Bem-vindo ao Teste de ADN do Futebol!',
    namePromptSub: 'Insira os seus dados básicos para personalizar o seu relatório de scouting e recomendações:',
    nameLabel: 'Seu Nome / Nome de Jogador:',
    footLabel: 'Pé Preferencial:',
    footRight: 'Destro',
    footLeft: 'Canhoto',
    footBoth: 'Ambidestro',

    resultHeaderTag: 'RELATÓRIO OFICIAL DE SCOUTING',
    resultTitle: 'Resultado da Avaliação de ADN',
    resultSubtitle: 'Análise detalhada de aptidões, perfil tático e comparação com estrelas profissionais.',
    matchScore: 'Compatibilidade Tática',
    radarTitle: 'Perfil de Atributos do Jogador',
    proComparisonTitle: 'Comparação com Jogador Profissional',
    proComparisonSub: 'O seu estilo de jogo apresenta elevada afinidade biomecânica e tática.',
    keyStrengths: 'Principais Pontos Fortes',
    areasToImprove: 'Áreas de Melhoria Prioritárias',
    tacticalDutiesTitle: 'Zonas de Influência e Funções em Campo',
    tacticalOverviewTitle: 'Análise Tática Detalhada do Treinador',
    recommendedDrillsTitle: 'Plano de Treino Recomendado',
    btnSaveReport: 'Guardar Relatório',
    btnSaved: 'Guardado em Meus Relatórios',
    btnRepeatTest: 'Repetir Avaliação',
    btnAskCoachAboutReport: 'Consultar Treinador AI sobre este Relatório',

    tacticsTag: 'SIMULADOR DE FORMAÇÕES E FUNÇÕES',
    tacticsTitle: 'Prancheta Tática Interativa',
    tacticsSubtitle: 'Inspecione as responsabilidades defensivas e ofensivas de cada posição no esquema tático.',
    clickPlayerInstruction: 'Clique num jogador para inspecionar as suas tarefas táticas',
    dutyCardTitle: 'Ficha da Posição Tática',
    roleLabel: 'Função',

    drillsTag: 'PLAYBOOK TÁTICO E METODOLOGIA',
    drillsTitle: 'Biblioteca de Exercícios',
    drillsSubtitle: 'Rotinas criadas para aperfeiçoar técnica, velocidade de reação e tomada de decisão.',
    searchDrillPlaceholder: 'Buscar exercício ou qualidade...',
    allCategories: 'Todas',
    durationMins: 'MINS',
    viewProSteps: 'Ver Passos e Dicas Pro',

    coachTitle: 'CoachStrike Tactical AI',
    coachStatus: 'TREINADOR UEFA PRO',
    coachWelcomeWithProfile: 'Olá {name}! Revisei o seu relatório de {position}. Em que aspeto técnico ou tático gostaria de aprofundar hoje? Posso dar dicas sobre como superar um bloco baixo, melhorar o pé fraco ou posicionamento.',
    coachWelcomeDefault: 'Olá craque! Sou o CoachStrike AI, o seu Treinador Tático. Faça qualquer pergunta sobre tática de futebol, posições, formações ou rotinas de treino.',
    inputPlaceholder: 'Pergunte ao Treinador sobre táticas, exercícios ou formações...',
    quickQueries: 'Consultas rápidas:',
    analyzingTactics: 'A analisar a jogada e a desenhar a estratégia...',

    historyTag: 'HISTÓRICO DE AVALIAÇÕES',
    historyTitle: 'Meus Relatórios Guardados',
    historySubtitle: 'Reveja relatórios anteriores ou acompanhe a sua evolução tática ao longo da época.',
    newEvaluation: 'Nova Avaliação',
    noSavedProfilesTitle: 'Ainda não guardou nenhuma avaliação',
    noSavedProfilesSub: 'Conclua o teste de ADN de jogador para descobrir a sua posição ideal e guardar a sua ficha.',
    viewFullReport: 'Ver Relatório Completo',

    glossaryTitle: 'Glossário Tático de Futebol',
    glossarySubtitle: 'Dicionário completo de termos técnicos, movimentações e estratégias do futebol moderno.',
    searchGlossaryPlaceholder: 'Buscar conceito (ex: Bloco baixo, Ala, Box-to-Box)...',
    glossaryExample: 'Exemplo Prático',
    glossaryImportance: 'Importância Tática',

    settingsTitle: 'Configurações e Personalização',
    settingsSubtitle: 'Personalize o idioma da aplicação, o tema visual de fundo e a cor de destaque.',
    languageSectionTitle: 'Idioma da Aplicação',
    themeSectionTitle: 'Tema de Fundo',
    accentSectionTitle: 'Cor de Destaque Neón (Texto e Botões)',
    resetDefaults: 'Restaurar Padrões',
    close: 'Fechar'
  }
};
