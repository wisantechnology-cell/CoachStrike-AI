import { Language } from './translations';

export interface AcademyDashboardTranslations {
  // Banner & Top Status
  bannerBadge: string;
  previewBadge: string;
  bannerTitle: string;
  bannerSubtitle: string;
  syncing: string;
  cloudActive: string;
  localMode: string;
  unlockBtn: string;
  eliteBadge: string;
  basicBadge: string;
  upgradeElite: string;
  slotsQuota: string;
  registered: string;

  // Stats Grid
  statRoster: string;
  statExams: string;
  statAffinity: string;
  statTasks: string;
  maxSuffix: string;

  // Subtabs
  tabRoster: string;
  tabClasses: string;
  tabLineup: string;
  tabTasks: string;
  tabTactics: string;
  btnAddStudent: string;
  limitReached: string;
  expandElite: string;

  // Classroom
  classroomBadge: string;
  classroomTitle: string;
  classroomSubtitle: string;
  roleLabel: string;
  roleTeacher: string;
  roleStudent: string;
  plusBadge: string;
  plusPriceTag: string;
  plusTitle: string;
  plusSubtitle: string;
  plusActive: string;
  plusBtn: string;
  createClassTitle: string;
  classNameLabel: string;
  classNamePlaceholder: string;
  classCatLabel: string;
  generateClassBtn: string;
  activeClassesTitle: string;
  studentsCount: string;
  classCodeLabel: string;
  copyLinkBtn: string;

  // Roster Student Card
  yearsOld: string;
  coachReport: string;
  btnEvaluate: string;
  btnAssign: string;
  btnDelete: string;

  // Lineup Builder
  lineupTag: string;
  lineupTitle: string;
  lineupSubtitle: string;
  autoAlignBtn: string;
  pitchScheme: string;
  pitchInstruction: string;
  attackDirection: string;
  vacantSlot: string;
  startersCount: string;
  tacticalIQLbl: string;
  techniqueLbl: string;
  teamADNLbl: string;
  dutyCardTitle: string;
  slotPosLabel: string;
  mainDutiesLabel: string;
  keyConceptLabel: string;
  assignedStarterLabel: string;
  footLabel: string;
  doExamBtn: string;
  unassignBtn: string;
  vacantSlotTitle: string;
  vacantSlotDesc: string;
  candidatesTitle: string;
  affinityBadge: string;

  // Tasks Subtab
  tasksTitle: string;
  tasksSubtitle: string;
  taskStudentLabel: string;
  taskDueLabel: string;
  taskCompleted: string;
  taskPending: string;

  // Tactical Whiteboard
  whiteboardTitle: string;
  whiteboardSubtitle: string;
  redChips: string;
  blueChips: string;

  // Modals
  addStudentTitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  categoryLabel: string;
  dorsalLabel: string;
  preferredFootLabel: string;
  tentativePosLabel: string;
  coachNotesLabel: string;
  coachNotesPlaceholder: string;
  registerBtn: string;
  assignTaskTitle: string;
  forLabel: string;
  taskNameLabel: string;
  taskNamePlaceholder: string;
  taskAreaLabel: string;
  dueDateLabel: string;
  instructionsLabel: string;
  instructionsPlaceholder: string;
  assignBtn: string;

  // Attendance
  tabAttendance: string;
  attendanceTitle: string;
  attendanceSubtitle: string;
  btnTakeAttendance: string;
  btnAttendanceHistory: string;
  attendancePresent: string;
  attendanceLate: string;
  attendanceAbsent: string;
  markAllPresent: string;
  attendanceRate: string;
  attendanceDate: string;
  attendanceStatusLbl: string;
  attendanceSessionLabel: string;
  attendanceSessionPlaceholder: string;
  saveAttendanceBtn: string;
  filterAllCategories: string;
}

export const ACADEMY_TRANSLATIONS: Record<Language, AcademyDashboardTranslations> = {
  es: {
    bannerBadge: 'MODO ACADEMIA UEFA PRO',
    previewBadge: 'Vista Previa / Modo Demo',
    bannerTitle: 'Cantera & Plantilla de Entrenadores',
    bannerSubtitle: 'Gestiona los perfiles de tus futbolistas, realiza exámenes de ADN táctico, sugiere técnicas personalizadas y diseña tu Once Ideal en pizarra interactiva.',
    syncing: 'Sincronizando Firestore...',
    cloudActive: 'Firestore Cloud Activo',
    localMode: 'Modo Local (Inicia sesión para sincronizar)',
    unlockBtn: 'Desbloquear Academia (3 Días de Prueba)',
    eliteBadge: 'Academia Élite (200 Alumnos)',
    basicBadge: 'Academia Básico (30 Alumnos)',
    upgradeElite: 'Subir a Élite',
    slotsQuota: 'Cupos:',
    registered: 'Registrados',

    statRoster: 'Plantilla / Límite',
    statExams: 'Exámenes Realizados',
    statAffinity: 'Afinidad Promedio',
    statTasks: 'Tareas Asignadas',
    maxSuffix: 'máx',

    tabRoster: 'Plantilla & Alumnos',
    tabClasses: 'Clases & Cuentas (Classroom)',
    tabLineup: 'Armador de Once Ideal',
    tabTasks: 'Deberes Técnicos',
    tabTactics: 'Pizarra Táctica',
    tabAttendance: 'Control de Asistencia',
    btnAddStudent: 'Añadir Alumno',
    limitReached: 'Límite Alcanzado',
    expandElite: 'Ampliar a Élite (200 Alumnos)',

    classroomBadge: 'Sistema de Cuentas Institucionales & Profesor',
    classroomTitle: 'Gestión de Clases Estilo Classroom & Roles',
    classroomSubtitle: 'Separa tu cuenta de Maestro (Director Técnico) de las cuentas institucionales de tus alumnos, genera códigos de invitación y asigna accesos Pro.',
    roleLabel: 'Rol Actual:',
    roleTeacher: '👨‍🏫 Cuenta de Maestro',
    roleStudent: '🎓 Alumno Institucional',
    plusBadge: 'Plus Elite Membresía Pro',
    plusPriceTag: '($40 USD / mes por cada 20 alumnos)',
    plusTitle: 'Amplía Membresías Pro para tus Alumnos',
    plusSubtitle: 'Cada plus añade +20 alumnos con beneficios de membresía Pro ilimitada.',
    plusActive: 'Plus Activos:',
    plusBtn: 'Comprar Pack +20 Alumnos Pro ($40/mes)',
    createClassTitle: 'Crear Nueva Clase (Classroom)',
    classNameLabel: 'Nombre de la Clase / Equipo',
    classNamePlaceholder: 'Ej. Sub-16 Táctica Ofensiva',
    classCatLabel: 'Categoría',
    generateClassBtn: 'Generar Clase & Código de Invitación',
    activeClassesTitle: 'Clases Activas e Invitaciones de Alumnos',
    studentsCount: 'Alumnos',
    classCodeLabel: 'Código de Clase:',
    copyLinkBtn: 'Copiar Enlace',

    yearsOld: 'años',
    coachReport: 'Informe del Míster:',
    btnEvaluate: 'Evaluar Alumno',
    btnAssign: 'Asignar Técnica',
    btnDelete: 'Eliminar Alumno',

    lineupTag: 'Cantera Strike • Pizarra Táctica',
    lineupTitle: 'Once Ideal & Composición Táctica',
    lineupSubtitle: 'Distribución posicional con curvatura real idéntica a la pizarra táctica interactiva. Selecciona cualquier dorsal para inspeccionar sus deberes.',
    autoAlignBtn: 'Auto-Alinear ADN',
    pitchScheme: 'Esquema',
    pitchInstruction: 'Toca cualquier ficha para ver sus obligaciones tácticas',
    attackDirection: 'Ataque',
    vacantSlot: '(Vacante)',
    startersCount: 'Titulares',
    tacticalIQLbl: 'IQ Táctico',
    techniqueLbl: 'Técnica',
    teamADNLbl: 'ADN Colectivo',
    dutyCardTitle: 'Ficha Técnica & Deberes',
    slotPosLabel: 'Puesto:',
    mainDutiesLabel: 'Obligaciones Tácticas Principales:',
    keyConceptLabel: '💡 Concepto Clave del Puesto:',
    assignedStarterLabel: 'Titular Asignado',
    footLabel: 'Pie',
    doExamBtn: 'Hacer Test ADN',
    unassignBtn: 'Vaciar',
    vacantSlotTitle: 'Puesto Actualmente Vacante',
    vacantSlotDesc: 'Selecciona a un alumno abajo para colocarlo de titular.',
    candidatesTitle: 'Candidatos de Cantera',
    affinityBadge: 'Afinidad',

    tasksTitle: 'Tareas & Deberes Técnicos Asignados',
    tasksSubtitle: 'Monitorea el progreso de los ejercicios que encomendaste a tus alumnos',
    taskStudentLabel: 'Alumno:',
    taskDueLabel: 'Vence:',
    taskCompleted: 'Completado',
    taskPending: 'Pendiente',

    whiteboardTitle: 'Pizarra Táctica & Estrategia de Cantera',
    whiteboardSubtitle: 'Coloca círculos rojos o azules con sus números dorsales, arrastra las fichas para posicionar a tus jugadores y traza planes de juego con flechas de pase y desmarques.',
    redChips: '🔴 Fichas Rojas',
    blueChips: '🔵 Fichas Azules',

    addStudentTitle: 'Añadir Nuevo Alumno',
    fullNameLabel: 'Nombre Completo',
    fullNamePlaceholder: 'Ej. Martín Odegaard',
    categoryLabel: 'Categoría',
    dorsalLabel: 'Dorsal',
    preferredFootLabel: 'Pie Dominante',
    tentativePosLabel: 'Posición Tentativa',
    coachNotesLabel: 'Notas del Entrenador',
    coachNotesPlaceholder: 'Observaciones iniciales de velocidad, técnica o actitud...',
    registerBtn: 'Registrar en Plantilla',
    assignTaskTitle: 'Sugerir Técnica o Deber',
    forLabel: 'Para:',
    taskNameLabel: 'Nombre del Ejercicio o Regate',
    taskNamePlaceholder: 'Ej. Amago y salida con pierna débil',
    taskAreaLabel: 'Área Táctica',
    dueDateLabel: 'Fecha de Entrega / Revisión',
    instructionsLabel: 'Instrucciones Detalladas',
    instructionsPlaceholder: 'Ej. Practicar 20 repeticiones contra pared o con compañero, orientando el cuerpo a 45 grados antes de recibir...',
    assignBtn: 'Asignar al Alumno',

    // Attendance
    attendanceTitle: 'Control y Registro de Asistencia a Clases',
    attendanceSubtitle: 'Registra si cada alumno asistió, llegó tarde o faltó a la sesión técnica de hoy.',
    btnTakeAttendance: 'Registrar Asistencia',
    btnAttendanceHistory: 'Historial',
    attendancePresent: 'Asistió',
    attendanceLate: 'Tarde',
    attendanceAbsent: 'Faltó',
    markAllPresent: 'Marcar Todos Asistieron ✅',
    attendanceRate: 'Asistencia:',
    attendanceDate: 'Fecha de la Clase:',
    attendanceStatusLbl: 'Estado de Asistencia',
    attendanceSessionLabel: 'Tema de la Sesión (Opcional):',
    attendanceSessionPlaceholder: 'Ej. Táctica de desmarques y rondos 4v2',
    saveAttendanceBtn: 'Guardar Registro de Asistencia',
    filterAllCategories: 'Todas las Categorías'
  },
  en: {
    bannerBadge: 'UEFA PRO ACADEMY MODE',
    previewBadge: 'Preview / Demo Mode',
    bannerTitle: 'Squad & Coach Academy Roster',
    bannerSubtitle: 'Manage player profiles, conduct tactical DNA tests, assign customized drills, and construct your Starting XI on the interactive whiteboard.',
    syncing: 'Syncing Firestore...',
    cloudActive: 'Firestore Cloud Active',
    localMode: 'Local Mode (Sign in to sync)',
    unlockBtn: 'Unlock Academy (3-Day Free Trial)',
    eliteBadge: 'Academy Elite (200 Players)',
    basicBadge: 'Academy Basic (30 Players)',
    upgradeElite: 'Upgrade to Elite',
    slotsQuota: 'Slots:',
    registered: 'Registered',

    statRoster: 'Roster / Limit',
    statExams: 'Exams Completed',
    statAffinity: 'Average Affinity',
    statTasks: 'Assigned Tasks',
    maxSuffix: 'max',

    tabRoster: 'Roster & Players',
    tabClasses: 'Classes & Accounts (Classroom)',
    tabLineup: 'Starting XI Builder',
    tabTasks: 'Technical Tasks',
    tabTactics: 'Tactical Board',
    tabAttendance: 'Attendance Register',
    btnAddStudent: 'Add Player',
    limitReached: 'Limit Reached',
    expandElite: 'Upgrade to Elite (200 Players)',

    classroomBadge: 'Institutional Accounts & Head Coach System',
    classroomTitle: 'Classroom-Style Class & Role Management',
    classroomSubtitle: 'Separate your Head Coach account from student accounts, generate invitation codes, and grant Pro tier benefits.',
    roleLabel: 'Current Role:',
    roleTeacher: '👨‍🏫 Head Coach Account',
    roleStudent: '🎓 Institutional Player',
    plusBadge: 'Plus Elite Pro Membership',
    plusPriceTag: '($40 USD / mo per 20 players)',
    plusTitle: 'Expand Pro Memberships for Your Players',
    plusSubtitle: 'Each plus pack adds +20 players with unlimited Pro tier benefits.',
    plusActive: 'Active Packs:',
    plusBtn: 'Buy +20 Pro Players Pack ($40/mo)',
    createClassTitle: 'Create New Class (Classroom)',
    classNameLabel: 'Class / Team Name',
    classNamePlaceholder: 'e.g. U-16 Offensive Tactics',
    classCatLabel: 'Age Category',
    generateClassBtn: 'Generate Class & Invite Code',
    activeClassesTitle: 'Active Classes & Student Invitations',
    studentsCount: 'Players',
    classCodeLabel: 'Class Code:',
    copyLinkBtn: 'Copy Link',

    yearsOld: 'yrs',
    coachReport: 'Coach Scouting Note:',
    btnEvaluate: 'Assess Player',
    btnAssign: 'Assign Drill',
    btnDelete: 'Remove Player',

    lineupTag: 'Strike Academy • Tactical Board',
    lineupTitle: 'Starting XI & Tactical Setup',
    lineupSubtitle: 'Positional curvature identical to the interactive tactical whiteboard. Select any player token to inspect their tactical responsibilities.',
    autoAlignBtn: 'Auto-Align DNA',
    pitchScheme: 'System',
    pitchInstruction: 'Click any player token to inspect tactical duties',
    attackDirection: 'Attack',
    vacantSlot: '(Vacant)',
    startersCount: 'Starters',
    tacticalIQLbl: 'Tactical IQ',
    techniqueLbl: 'Technique',
    teamADNLbl: 'Squad DNA',
    dutyCardTitle: 'Technical Profile & Duties',
    slotPosLabel: 'Position:',
    mainDutiesLabel: 'Key Tactical Responsibilities:',
    keyConceptLabel: '💡 Key Positional Concept:',
    assignedStarterLabel: 'Assigned Starter',
    footLabel: 'Foot',
    doExamBtn: 'Take DNA Test',
    unassignBtn: 'Clear Slot',
    vacantSlotTitle: 'Slot Currently Vacant',
    vacantSlotDesc: 'Select a squad player below to place them in the Starting XI.',
    candidatesTitle: 'Squad Candidates',
    affinityBadge: 'Affinity',

    tasksTitle: 'Assigned Technical Tasks & Homework',
    tasksSubtitle: 'Track and monitor the progress of technical drills and habits assigned to your players',
    taskStudentLabel: 'Player:',
    taskDueLabel: 'Due:',
    taskCompleted: 'Completed',
    taskPending: 'Pending',

    whiteboardTitle: 'Tactical Whiteboard & Academy Strategy',
    whiteboardSubtitle: 'Place red or blue tokens with squad numbers, drag players into formations, and draw tactical passing lines and runs.',
    redChips: '🔴 Red Tokens',
    blueChips: '🔵 Blue Tokens',

    addStudentTitle: 'Add New Player',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. Martin Odegaard',
    categoryLabel: 'Age Category',
    dorsalLabel: 'Squad Number',
    preferredFootLabel: 'Preferred Foot',
    tentativePosLabel: 'Target Position',
    coachNotesLabel: 'Coach Notes',
    coachNotesPlaceholder: 'Initial notes on speed, technique, or attitude...',
    registerBtn: 'Register to Squad',
    assignTaskTitle: 'Assign Drill or Task',
    forLabel: 'For:',
    taskNameLabel: 'Drill or Dribble Name',
    taskNamePlaceholder: 'e.g. Body feint & weak-foot delivery',
    taskAreaLabel: 'Tactical Area',
    dueDateLabel: 'Due / Review Date',
    instructionsLabel: 'Detailed Instructions',
    instructionsPlaceholder: 'e.g. Practice 20 reps against a wall, opening body shape at 45 degrees before receiving...',
    assignBtn: 'Assign to Player',

    // Attendance
    attendanceTitle: 'Class Attendance & Training Check-In',
    attendanceSubtitle: 'Register whether each player attended, was late, or absent for today\'s session.',
    btnTakeAttendance: 'Register Attendance',
    btnAttendanceHistory: 'History',
    attendancePresent: 'Attended',
    attendanceLate: 'Late',
    attendanceAbsent: 'Absent',
    markAllPresent: 'Mark All Present ✅',
    attendanceRate: 'Attendance:',
    attendanceDate: 'Session Date:',
    attendanceStatusLbl: 'Attendance Status',
    attendanceSessionLabel: 'Session Topic (Optional):',
    attendanceSessionPlaceholder: 'e.g. Half-space rotation & 4v2 rondos',
    saveAttendanceBtn: 'Save Attendance Register',
    filterAllCategories: 'All Categories'
  },
  pt: {
    bannerBadge: 'MODO ACADEMIA UEFA PRO',
    previewBadge: 'Prévia / Modo Demo',
    bannerTitle: 'Plantel & Academia de Treinadores',
    bannerSubtitle: 'Gira os perfis dos seus atletas, execute testes de ADN tático, atribua exercícios personalizados e monte o seu Onze Ideal.',
    syncing: 'A sincronizar Firestore...',
    cloudActive: 'Firestore Cloud Ativo',
    localMode: 'Modo Local (Inicie sessão para sincronizar)',
    unlockBtn: 'Desbloquear Academia (3 Dias Grátis)',
    eliteBadge: 'Academia Élite (200 Alunos)',
    basicBadge: 'Academia Básico (30 Alunos)',
    upgradeElite: 'Subir para Élite',
    slotsQuota: 'Vagas:',
    registered: 'Registados',

    statRoster: 'Plantel / Limite',
    statExams: 'Exames Realizados',
    statAffinity: 'Afinidade Média',
    statTasks: 'Tarefas Atribuídas',
    maxSuffix: 'máx',

    tabRoster: 'Plantel & Alunos',
    tabClasses: 'Turmas & Contas (Classroom)',
    tabLineup: 'Montador de Onze Ideal',
    tabTasks: 'Tarefas Técnicas',
    tabTactics: 'Quadro Tático',
    tabAttendance: 'Registo de Presenças',
    btnAddStudent: 'Adicionar Aluno',
    limitReached: 'Limite Atingido',
    expandElite: 'Subir para Élite (200 Alunos)',

    classroomBadge: 'Sistema de Contas Institucionais & Treinador',
    classroomTitle: 'Gestão de Turmas Estilo Classroom & Perfis',
    classroomSubtitle: 'Separe a sua conta de Treinador das contas dos seus alunos, gere códigos de convite e atribua acessos Pro.',
    roleLabel: 'Perfil Atual:',
    roleTeacher: '👨‍🏫 Conta de Treinador',
    roleStudent: '🎓 Aluno Institucional',
    plusBadge: 'Plus Elite Subscrição Pro',
    plusPriceTag: '($40 USD / mês por cada 20 alunos)',
    plusTitle: 'Amplie Subscrições Pro para os seus Alunos',
    plusSubtitle: 'Cada plus adiciona +20 alunos com benefícios Pro ilimitados.',
    plusActive: 'Plus Ativos:',
    plusBtn: 'Comprar Pack +20 Alunos Pro ($40/mês)',
    createClassTitle: 'Criar Nova Turma (Classroom)',
    classNameLabel: 'Nome da Turma / Equipa',
    classNamePlaceholder: 'Ex. Sub-16 Tática Ofensiva',
    classCatLabel: 'Escalão',
    generateClassBtn: 'Gerar Turma & Código de Convite',
    activeClassesTitle: 'Turmas Ativas e Convites',
    studentsCount: 'Alunos',
    classCodeLabel: 'Código de Turma:',
    copyLinkBtn: 'Copiar Link',

    yearsOld: 'anos',
    coachReport: 'Relatório do Treinador:',
    btnEvaluate: 'Avaliar Aluno',
    btnAssign: 'Atribuir Exercício',
    btnDelete: 'Remover Aluno',

    lineupTag: 'Academia Strike • Quadro Tático',
    lineupTitle: 'Onze Ideal & Composição Tática',
    lineupSubtitle: 'Distribuição posicional idêntica ao quadro tático. Selecione qualquer número para inspecionar deveres.',
    autoAlignBtn: 'Auto-Alinhar ADN',
    pitchScheme: 'Esquema',
    pitchInstruction: 'Toque em qualquer camisola para ver as funções táticas',
    attackDirection: 'Ataque',
    vacantSlot: '(Vago)',
    startersCount: 'Titulares',
    tacticalIQLbl: 'IQ Tático',
    techniqueLbl: 'Técnica',
    teamADNLbl: 'ADN Coletivo',
    dutyCardTitle: 'Ficha Técnica & Deveres',
    slotPosLabel: 'Posição:',
    mainDutiesLabel: 'Principais Deveres Táticos:',
    keyConceptLabel: '💡 Conceito Chave da Posição:',
    assignedStarterLabel: 'Titular Atribuído',
    footLabel: 'Pé',
    doExamBtn: 'Fazer Teste ADN',
    unassignBtn: 'Desocupar',
    vacantSlotTitle: 'Posição Atualmente Vaga',
    vacantSlotDesc: 'Selecione um aluno abaixo para colocar no Onze.',
    candidatesTitle: 'Candidatos do Plantel',
    affinityBadge: 'Afinidade',

    tasksTitle: 'Tarefas & Exercícios Técnicos Atribuídos',
    tasksSubtitle: 'Acompanhe a evolução dos trabalhos recomendados aos seus jogadores',
    taskStudentLabel: 'Aluno:',
    taskDueLabel: 'Entrega:',
    taskCompleted: 'Concluído',
    taskPending: 'Pendente',

    whiteboardTitle: 'Quadro Tático & Estratégia de Academia',
    whiteboardSubtitle: 'Coloque fichas vermelhas ou azuis com números, arraste atletas e trace linhas de passe.',
    redChips: '🔴 Fichas Vermelhas',
    blueChips: '🔵 Fichas Azuis',

    addStudentTitle: 'Adicionar Novo Aluno',
    fullNameLabel: 'Nome Completo',
    fullNamePlaceholder: 'Ex. Martin Odegaard',
    categoryLabel: 'Escalão',
    dorsalLabel: 'Número da Camisola',
    preferredFootLabel: 'Pé Preferencial',
    tentativePosLabel: 'Posição Alvo',
    coachNotesLabel: 'Notas do Treinador',
    coachNotesPlaceholder: 'Observações de velocidade, técnica ou atitude...',
    registerBtn: 'Registar no Plantel',
    assignTaskTitle: 'Sugerir Exercício ou Tarefa',
    forLabel: 'Para:',
    taskNameLabel: 'Nome do Exercício ou Drible',
    taskNamePlaceholder: 'Ex. Finta de corpo e saída a pé fraco',
    taskAreaLabel: 'Área Tática',
    dueDateLabel: 'Data de Revisão',
    instructionsLabel: 'Instruções Detalhadas',
    instructionsPlaceholder: 'Ex. Praticar 20 repetições na parede, perfilando o corpo a 45 graus...',
    assignBtn: 'Atribuir ao Aluno',

    // Attendance
    attendanceTitle: 'Controlo e Registo de Presenças nas Aulas',
    attendanceSubtitle: 'Registe se cada atleta compareceu, chegou atrasado ou faltou à sessão técnica.',
    btnTakeAttendance: 'Registar Presenças',
    btnAttendanceHistory: 'Histórico',
    attendancePresent: 'Compareceu',
    attendanceLate: 'Atrasado',
    attendanceAbsent: 'Faltou',
    markAllPresent: 'Marcar Todos Presentes ✅',
    attendanceRate: 'Presença:',
    attendanceDate: 'Data do Treino:',
    attendanceStatusLbl: 'Estado da Presença',
    attendanceSessionLabel: 'Tema da Sessão (Opcional):',
    attendanceSessionPlaceholder: 'Ex. Desmarcação entrelinhas e rondos 4x2',
    saveAttendanceBtn: 'Guardar Registo de Presenças',
    filterAllCategories: 'Todos os Escalões'
  }
};
