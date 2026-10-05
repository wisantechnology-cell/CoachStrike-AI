import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Activity, 
  Award, 
  Trophy, 
  Flame, 
  FileDown, 
  Share2, 
  ArrowLeft, 
  KeyRound, 
  Lock, 
  ChevronRight,
  Zap,
  BookOpen,
  Check,
  Building2,
  ExternalLink
} from 'lucide-react';
import { AcademyStudent, AcademyTask, AttendanceRecord, ClubBrandConfig, AssessmentResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { generatePdfReport } from '../utils/pdfGenerator';
import { getLocalizedDrills } from '../data/drills';

interface PlayerPortalProps {
  students: AcademyStudent[];
  initialStudentId?: string | null;
  clubBrand?: ClubBrandConfig | null;
  onBackToAcademy?: () => void;
  onUpdateStudentTask?: (studentId: string, taskId: string, completed: boolean) => void;
}

export const PlayerPortal: React.FC<PlayerPortalProps> = ({
  students,
  initialStudentId,
  clubBrand,
  onBackToAcademy,
  onUpdateStudentTask
}) => {
  const { lang } = useLanguage();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(initialStudentId || null);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'tasks' | 'drills' | 'attendance' | 'feedback'>('overview');
  const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false);

  // Load from URL search params on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlPlayerId = params.get('player') || params.get('student') || params.get('id');
        if (urlPlayerId && students.some((s) => s.id === urlPlayerId)) {
          setSelectedStudentId(urlPlayerId);
          setIsAuthenticated(true);
        } else if (students.length > 0 && !selectedStudentId) {
          // Default to first student if none selected
          setSelectedStudentId(students[0].id);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  const t = {
    es: {
      portalBadge: 'PORTAL PRIVADO DEL CANTERANO & FAMILIA',
      subtitle: 'Seguimiento de desarrollo técnico, tareas tácticas y asistencia oficial',
      selectPlayer: 'Seleccionar Perfil de Jugador',
      enterPin: 'Acceso con PIN de Jugador',
      pinPlaceholder: 'Código PIN de 4 dígitos',
      btnLogin: 'Entrar a Mi Portal',
      tabOverview: 'Mi ADN Táctico',
      tabTasks: 'Mis Deberes',
      tabDrills: 'Ejercicios',
      tabAttendance: 'Mi Asistencia',
      tabFeedback: 'Notas del Míster',
      dominantFoot: 'Pie Dominante:',
      dorsal: 'Dorsal:',
      category: 'Categoría:',
      position: 'Posición:',
      matchRate: 'Compatibilidad Táctica:',
      tasksTitle: 'Plan de Trabajo Individual (IDP)',
      tasksSubtitle: 'Tareas y objetivos semanales asignados por el cuerpo técnico',
      noTasks: 'No tienes tareas pendientes asignadas actualmente. ¡Buen trabajo!',
      taskCompleted: '¡Completada!',
      taskPending: 'Pendiente de realizar',
      markDone: 'Marcar como Hecho',
      dueDate: 'Fecha de entrega:',
      drillsTitle: 'Ejercicios de Tecnificación Personalizados',
      drillsSubtitle: 'Práctica individual recomendada para pulir tu perfil de juego',
      attendanceTitle: 'Registro y Regularidad de Entrenamientos',
      attendanceSubtitle: 'Tu compromiso en las sesiones de entrenamiento del club',
      attendanceRate: 'Tasa de Asistencia',
      totalSessions: 'Sesiones Evaluadas',
      presentCount: 'Presente a Tiempo',
      lateCount: 'Tardanzas',
      absentCount: 'Ausencias',
      statusPresent: 'Presente',
      statusLate: 'Tardanza Justificada',
      statusAbsent: 'Ausente',
      coachNotesTitle: 'Informe & Recomendaciones del Cuerpo Técnico',
      downloadPdf: 'Descargar Mi Ficha Oficial PDF',
      copyShare: 'Copiar Enlace Mi Portal',
      copied: '¡Enlace Copiado!',
      switchStudent: 'Cambiar de Jugador',
      backToApp: 'Volver a la Academia',
      confidentialNotice: 'Acceso seguro y privado para el deportista y su familia. Datos protegidos según normativa UEFA.'
    },
    en: {
      portalBadge: 'PLAYER & FAMILY PRIVATE PORTAL',
      subtitle: 'Track tactical development, coach homework, and official attendance',
      selectPlayer: 'Select Player Profile',
      enterPin: 'Player PIN Code Access',
      pinPlaceholder: '4-digit PIN code',
      btnLogin: 'Access My Portal',
      tabOverview: 'My Tactical DNA',
      tabTasks: 'My Homework',
      tabDrills: 'Training Drills',
      tabAttendance: 'My Attendance',
      tabFeedback: 'Coach Notes',
      dominantFoot: 'Preferred Foot:',
      dorsal: 'Jersey #:',
      category: 'Squad / Category:',
      position: 'Position:',
      matchRate: 'Tactical Match:',
      tasksTitle: 'Individual Development Plan (IDP)',
      tasksSubtitle: 'Weekly objectives and drills assigned by your coaching staff',
      noTasks: 'You have no pending assignments right now. Great job!',
      taskCompleted: 'Completed!',
      taskPending: 'Pending action',
      markDone: 'Mark as Completed',
      dueDate: 'Due date:',
      drillsTitle: 'Personalized Technical Drills',
      drillsSubtitle: 'Recommended individual practice to master your playing profile',
      attendanceTitle: 'Training Attendance Record',
      attendanceSubtitle: 'Your commitment and punctuality across official sessions',
      attendanceRate: 'Attendance Rate',
      totalSessions: 'Total Sessions',
      presentCount: 'Present on Time',
      lateCount: 'Late',
      absentCount: 'Absences',
      statusPresent: 'Present',
      statusLate: 'Late Arrival',
      statusAbsent: 'Absent',
      coachNotesTitle: 'Staff Assessment & Coaching Feedback',
      downloadPdf: 'Download Official PDF Report',
      copyShare: 'Copy My Portal Link',
      copied: 'Link Copied!',
      switchStudent: 'Switch Player',
      backToApp: 'Return to Academy',
      confidentialNotice: 'Private athlete companion portal. GDPR and UEFA compliance protected.'
    },
    pt: {
      portalBadge: 'PORTAL PRIVADO DO JOGADOR & FAMÍLIA',
      subtitle: 'Acompanhamento do desenvolvimento tático, tarefas e presenças oficiais',
      selectPlayer: 'Selecionar Perfil do Jogador',
      enterPin: 'Acesso por Código PIN',
      pinPlaceholder: 'Código PIN de 4 dígitos',
      btnLogin: 'Entrar no Meu Portal',
      tabOverview: 'Meu ADN Tático',
      tabTasks: 'Minhas Tarefas',
      tabDrills: 'Exercícios',
      tabAttendance: 'Minha Assiduidade',
      tabFeedback: 'Notas do Treinador',
      dominantFoot: 'Pé Dominante:',
      dorsal: 'Camisola:',
      category: 'Escalão:',
      position: 'Posição:',
      matchRate: 'Compatibilidade Tática:',
      tasksTitle: 'Plano de Desenvolvimento Individual (PDI)',
      tasksSubtitle: 'Tarefas e objetivos semanais atribuídos pela equipa técnica',
      noTasks: 'Não tens tarefas pendentes no momento. Bom trabalho!',
      taskCompleted: 'Concluída!',
      taskPending: 'Pendente',
      markDone: 'Marcar como Concluída',
      dueDate: 'Prazo:',
      drillsTitle: 'Exercícios de Tecnificação Personalizados',
      drillsSubtitle: 'Prática individual recomendada para lapidar o teu perfil',
      attendanceTitle: 'Registo e Assiduidade aos Treinos',
      attendanceSubtitle: 'O teu compromisso nas sessões oficiais de treino',
      attendanceRate: 'Taxa de Assiduidade',
      totalSessions: 'Sessões Avaliadas',
      presentCount: 'Presente a Tempo',
      lateCount: 'Atrasos',
      absentCount: 'Faltas',
      statusPresent: 'Presente',
      statusLate: 'Atraso Justificado',
      statusAbsent: 'Ausente',
      coachNotesTitle: 'Avaliação & Recomendações da Equipa Técnica',
      downloadPdf: 'Descarregar Ficha Oficial PDF',
      copyShare: 'Copiar Link do Meu Portal',
      copied: 'Link Copiado!',
      switchStudent: 'Mudar de Jogador',
      backToApp: 'Voltar à Academia',
      confidentialNotice: 'Acesso confidencial protegido para atletas e encarregados de educação.'
    }
  }[lang] || {
    portalBadge: 'PLAYER & FAMILY PRIVATE PORTAL',
    subtitle: 'Track tactical development, coach homework, and official attendance',
    selectPlayer: 'Select Player Profile',
    enterPin: 'Player PIN Code Access',
    pinPlaceholder: '4-digit PIN code',
    btnLogin: 'Access My Portal',
    tabOverview: 'My Tactical DNA',
    tabTasks: 'My Homework',
    tabDrills: 'Training Drills',
    tabAttendance: 'My Attendance',
    tabFeedback: 'Coach Notes',
    dominantFoot: 'Preferred Foot:',
    dorsal: 'Jersey #:',
    category: 'Squad / Category:',
    position: 'Position:',
    matchRate: 'Tactical Match:',
    tasksTitle: 'Individual Development Plan (IDP)',
    tasksSubtitle: 'Weekly objectives and drills assigned by your coaching staff',
    noTasks: 'You have no pending assignments right now. Great job!',
    taskCompleted: 'Completed!',
    taskPending: 'Pending action',
    markDone: 'Mark as Completed',
    dueDate: 'Due date:',
    drillsTitle: 'Personalized Technical Drills',
    drillsSubtitle: 'Recommended individual practice to master your playing profile',
    attendanceTitle: 'Training Attendance Record',
    attendanceSubtitle: 'Your commitment and punctuality across official sessions',
    attendanceRate: 'Attendance Rate',
    totalSessions: 'Total Sessions',
    presentCount: 'Present on Time',
    lateCount: 'Late',
    absentCount: 'Absences',
    statusPresent: 'Present',
    statusLate: 'Late Arrival',
    statusAbsent: 'Absent',
    coachNotesTitle: 'Staff Assessment & Coaching Feedback',
    downloadPdf: 'Download Official PDF Report',
    copyShare: 'Copy My Portal Link',
    copied: 'Link Copied!',
    switchStudent: 'Switch Player',
    backToApp: 'Return to Academy',
    confidentialNotice: 'Private athlete companion portal. GDPR and UEFA compliance protected.'
  };

  const formatFoot = (foot?: string) => {
    if (!foot) return '--';
    const f = foot.toLowerCase();
    if (f.includes('diestro') || f.includes('right')) return lang === 'en' ? 'Right' : lang === 'pt' ? 'Destro' : 'Diestro';
    if (f.includes('zurdo') || f.includes('left')) return lang === 'en' ? 'Left' : lang === 'pt' ? 'Canhoto' : 'Zurdo';
    return lang === 'en' ? 'Both' : lang === 'pt' ? 'Ambidestro' : 'Ambidiestro';
  };

  // Calculate Attendance Stats for Student
  const attendanceList = student?.attendance || [];
  const totalSessions = attendanceList.length;
  const presentCount = attendanceList.filter((a) => a.status === 'present').length;
  const lateCount = attendanceList.filter((a) => a.status === 'late').length;
  const absentCount = attendanceList.filter((a) => a.status === 'absent').length;
  const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalSessions) * 100) : 100;

  // Localized Drills for Student
  const localizedDrills = getLocalizedDrills(lang).slice(0, 3);

  // Copy Direct Link to Clipboard
  const handleCopyPortalLink = () => {
    if (!student) return;
    try {
      const url = `${window.location.origin}${window.location.pathname}?player=${student.id}`;
      navigator.clipboard.writeText(url);
      setIsCopiedLink(true);
      setTimeout(() => setIsCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Download PDF Report for Student
  const handleDownloadPdf = () => {
    if (!student) return;
    const mockResult: AssessmentResult = {
      id: student.id,
      playerName: student.name,
      preferredFoot: student.preferredFoot,
      answers: {},
      primaryPosition: {
        code: student.primaryPosition,
        title: student.primaryPosition,
        subtitle: `${student.category} • #${student.dorsal}`,
        roleDescription: `Perfil formativo desarrollado en ${clubBrand?.clubName || 'Academia de Alto Rendimiento'}. Alto nivel de compromiso y proyección técnico-táctica.`,
        matchPercentage: student.matchPercentage || 88
      },
      secondaryPositions: [],
      skills: student.skills,
      proComparison: {
        player: {
          id: 'pro-benchmark',
          name: 'Referente Profesional Pro',
          club: clubBrand?.clubName || 'UEFA Champions League',
          nationality: 'Internacional',
          position: student.primaryPosition,
          positionCategory: student.primaryPosition,
          avatarUrl: student.avatarUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
          quote: 'El talento gana partidos, pero el trabajo en equipo y la inteligencia táctica ganan campeonatos.',
          styleDescription: 'Jugador equilibrado con alta comprensión espacial y rigor posicional.',
          keySkills: ['Juego Asociativo', 'Visión', 'Intensidad'],
          stats: student.skills
        },
        matchPercentage: student.matchPercentage || 88,
        matchReason: `Afinidad directa con el modelo táctico de ${clubBrand?.clubName || 'la Academia'}.`
      },
      tacticalZones: [],
      strengths: ['Compromiso en entrenamientos', 'Comprensión del juego', 'Disciplina táctica'],
      areasToImprove: ['Mayor velocidad en transición', 'Toma de decisiones bajo presión'],
      recommendedDrills: localizedDrills,
      aiPersonalizedNote: student.coachNotes || 'Gran progreso en las últimas sesiones. Mantener la concentración.',
      createdAt: student.lastExamDate || new Date().toISOString()
    };
    generatePdfReport(mockResult, lang, clubBrand);
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId: string, currentStatus: string) => {
    if (!student) return;
    const newStatus = currentStatus !== 'completed';
    if (onUpdateStudentTask) {
      onUpdateStudentTask(student.id, taskId, newStatus);
    }
  };

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <User className="w-12 h-12 text-volt mx-auto" />
          <h2 className="text-xl font-black italic uppercase text-white font-display">
            {t.selectPlayer}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'en' ? 'No registered players found in this academy.' : 'No hay jugadores registrados en esta academia aún.'}
          </p>
          {onBackToAcademy && (
            <button
              onClick={onBackToAcademy}
              className="w-full py-2.5 rounded-xl bg-volt text-black font-black uppercase text-xs tracking-wider"
            >
              {t.backToApp}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBackToAcademy && (
            <button
              onClick={onBackToAcademy}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title={t.backToApp}
            >
              <ArrowLeft className="w-4 h-4 text-volt" />
              <span className="hidden sm:inline">{t.backToApp}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-emerald-400">
              {t.portalBadge}
            </span>
          </div>
        </div>

        {/* Quick Player Switcher Dropdown (for Coaches/Parents with multiple players) */}
        {students.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">{t.switchStudent}:</span>
            <select
              value={student.id}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs font-bold text-volt focus:border-volt outline-none cursor-pointer font-display uppercase italic"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white font-normal">
                  {s.name} ({s.category} • #{s.dorsal})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Club & Athlete Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none select-none text-8xl font-black italic -rotate-12 text-white font-display">
          ACADEMY
        </div>

        {/* Club Brand Tag (White-Label) */}
        {clubBrand?.clubName && (
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-volt/10 border border-volt/30 flex items-center justify-center text-volt font-black font-display">
              <Building2 className="w-4 h-4 text-volt" />
            </div>
            <div>
              <span className="text-sm font-black text-white uppercase italic font-display tracking-wide block">
                {clubBrand.clubName}
              </span>
              {clubBrand.clubMotto && (
                <span className="text-[10px] text-slate-400 font-mono-code block">
                  {clubBrand.clubMotto}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-volt shadow-lg shadow-volt/20"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-black/90 border border-volt text-volt font-mono font-black text-xs">
                #{student.dorsal}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-volt/10 border border-volt/30 text-volt text-[10px] font-mono-code font-bold uppercase tracking-wider">
                  {student.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono font-bold">
                  {student.age} {lang === 'en' ? 'years old' : lang === 'pt' ? 'anos' : 'años'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  {attendanceRate}% {lang === 'en' ? 'Attendance' : lang === 'pt' ? 'Presença' : 'Asistencia'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black italic text-white uppercase font-display tracking-tight">
                {student.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>{t.position} <strong className="text-volt">{student.primaryPosition}</strong></span>
                <span>•</span>
                <span>{t.dominantFoot} <strong className="text-white">{formatFoot(student.preferredFoot)}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Download PDF & Copy Private Link */}
          <div className="flex flex-row flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider flex items-center justify-center gap-2 shadow-md shadow-volt/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <FileDown className="w-4 h-4 text-black" />
              <span>{t.downloadPdf}</span>
            </button>

            <button
              onClick={handleCopyPortalLink}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              {isCopiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-volt" />}
              <span>{isCopiedLink ? t.copied : t.copyShare}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs for Player Portal */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'overview'
                ? 'bg-volt text-black font-black shadow-md shadow-volt/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tabOverview}</span>
          </button>

          <button
            onClick={() => setActiveSection('tasks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'tasks'
                ? 'bg-volt text-black font-black shadow-md shadow-volt/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.tabTasks}</span>
            {(student.tasks || []).filter((t) => t.status !== 'completed').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-bold">
                {(student.tasks || []).filter((t) => t.status !== 'completed').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('drills')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'drills'
                ? 'bg-volt text-black font-black shadow-md shadow-volt/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.tabDrills}</span>
          </button>

          <button
            onClick={() => setActiveSection('attendance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'attendance'
                ? 'bg-volt text-black font-black shadow-md shadow-volt/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.tabAttendance}</span>
          </button>

          <button
            onClick={() => setActiveSection('feedback')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'feedback'
                ? 'bg-volt text-black font-black shadow-md shadow-volt/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.tabFeedback}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW / TACTICAL DNA */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Tactical Radar Attributes */}
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-volt block">
                  {lang === 'en' ? 'TACTICAL ATTRIBUTES RADAR' : 'RADAR DE ATRIBUTOS TÁCTICOS'}
                </span>
                <h3 className="text-xl font-black italic uppercase text-white font-display">
                  {lang === 'en' ? 'Athlete Core Performance' : 'Rendimiento Base del Deportista'}
                </h3>
              </div>
              <span className="px-3 py-1 rounded bg-volt text-black font-mono font-bold text-xs">
                {student.matchPercentage}% MATCH
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(student.skills).map(([key, val]) => {
                const labelMap: Record<string, string> = {
                  speed: lang === 'en' ? 'Speed' : lang === 'pt' ? 'Velocidade' : 'Velocidad',
                  technique: lang === 'en' ? 'Technique' : lang === 'pt' ? 'Técnica' : 'Técnica',
                  finishing: lang === 'en' ? 'Finishing' : lang === 'pt' ? 'Finalização' : 'Definición',
                  passing: lang === 'en' ? 'Passing' : lang === 'pt' ? 'Passe' : 'Pase',
                  defending: lang === 'en' ? 'Defending' : lang === 'pt' ? 'Defesa' : 'Defensa',
                  physical: lang === 'en' ? 'Physical' : lang === 'pt' ? 'Físico' : 'Físico',
                  tacticalIQ: lang === 'en' ? 'Tactical IQ' : lang === 'pt' ? 'QI Tático' : 'IQ Táctico',
                  mental: lang === 'en' ? 'Mental' : lang === 'pt' ? 'Mental' : 'Mental'
                };
                return (
                  <div key={key} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{labelMap[key] || key}</span>
                      <span className="font-mono font-black text-volt">{val}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        style={{ width: `${val}%` }}
                        className="h-full bg-volt rounded-full shadow-sm shadow-volt/40 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coach Quick Advice Banner */}
          {student.coachNotes && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-volt/10 via-emerald-500/10 to-transparent border border-volt/20 flex items-start gap-4">
              <Award className="w-6 h-6 text-volt shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-volt block mb-1">
                  {lang === 'en' ? 'COACH PRIORITY DIRECTIVE:' : 'DIRECTRIZ PRIORITARIA DEL CUERPO TÉCNICO:'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  "{student.coachNotes}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: TASKS / HOMEWORK */}
      {activeSection === 'tasks' && (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-volt block">
              {t.tasksTitle}
            </span>
            <h3 className="text-xl font-black italic uppercase text-white font-display">
              {t.tasksSubtitle}
            </h3>
          </div>

          {(!student.tasks || student.tasks.length === 0) ? (
            <div className="p-8 text-center bg-black/40 rounded-2xl border border-white/5 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-slate-300">{t.noTasks}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {student.tasks.map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          task.category === 'Técnica' ? 'bg-volt/20 text-volt border border-volt/30' :
                          task.category === 'Táctica' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                          task.category === 'Físico' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {task.category}
                        </span>
                        <span className="text-xs text-slate-500 font-mono-code">
                          {t.dueDate} {task.dueDate}
                        </span>
                      </div>
                      <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                        {task.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-volt hover:bg-white text-black font-black uppercase shadow-md shadow-volt/20'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.taskCompleted}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t.markDone}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: RECOMMENDED DRILLS */}
      {activeSection === 'drills' && (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-volt block">
              {t.drillsTitle}
            </span>
            <h3 className="text-xl font-black italic uppercase text-white font-display">
              {t.drillsSubtitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {localizedDrills.map((drill, idx) => (
              <div key={drill.id} className="bg-black/50 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-volt/30 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code">
                      {drill.durationMinutes} MINS
                    </span>
                  </div>

                  <h4 className="text-base font-black italic text-white font-display uppercase">
                    {drill.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {drill.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-xs space-y-1 text-slate-400">
                  <div>• <strong className="text-slate-200">{lang === 'en' ? 'Sets:' : lang === 'pt' ? 'Séries:' : 'Series:'}</strong> {drill.sets}</div>
                  <div>• <strong className="text-slate-200">{lang === 'en' ? 'Reps:' : lang === 'pt' ? 'Reps:' : 'Reps:'}</strong> {drill.reps}</div>
                  <div className="mt-2 text-[11px] text-volt italic">💡 {drill.proTip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: ATTENDANCE RECORD */}
      {activeSection === 'attendance' && (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-volt block">
              {t.attendanceTitle}
            </span>
            <h3 className="text-xl font-black italic uppercase text-white font-display">
              {t.attendanceSubtitle}
            </h3>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1">
                {t.attendanceRate}
              </span>
              <span className="text-3xl font-black italic font-display text-emerald-400">
                {attendanceRate}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1">
                {t.presentCount}
              </span>
              <span className="text-3xl font-black italic font-display text-white">
                {presentCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1">
                {t.lateCount}
              </span>
              <span className="text-3xl font-black italic font-display text-amber-400">
                {lateCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1">
                {t.absentCount}
              </span>
              <span className="text-3xl font-black italic font-display text-rose-400">
                {absentCount}
              </span>
            </div>
          </div>

          {/* Attendance History List */}
          <div className="space-y-2 pt-2">
            {attendanceList.length === 0 ? (
              <div className="p-6 text-center bg-black/40 rounded-2xl border border-white/5 text-xs text-slate-400">
                {lang === 'en' ? 'No attendance records recorded yet.' : 'Aún no hay registros de asistencia guardados.'}
              </div>
            ) : (
              attendanceList.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-mono-code font-bold text-white">{rec.date}</span>
                    {rec.notes && (
                      <span className="text-slate-400 italic hidden sm:inline">• "{rec.notes}"</span>
                    )}
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    rec.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    rec.status === 'late' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {rec.status === 'present' ? `✅ ${t.statusPresent}` :
                     rec.status === 'late' ? `⏱️ ${t.statusLate}` :
                     `❌ ${t.statusAbsent}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 5: COACH FEEDBACK & REPORT */}
      {activeSection === 'feedback' && (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-volt block">
              {t.coachNotesTitle}
            </span>
            <h3 className="text-xl font-black italic uppercase text-white font-display">
              {lang === 'en' ? 'Confidential Staff Evaluation' : 'Evaluación Confidencial del Cuerpo Técnico'}
            </h3>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-volt" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                {clubBrand?.directorName ? `${clubBrand.directorName} (${clubBrand.directorTitle || 'Director'})` : 'Cuerpo Técnico UEFA Pro'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {student.coachNotes || (lang === 'en' 
                ? 'Player demonstrates high tactical maturity, excellent positioning, and consistent discipline in daily sessions.' 
                : 'El jugador demuestra una gran madurez táctica, excelente colocación en repliegue y constancia en el entrenamiento diario.')}
            </p>
          </div>

          {/* Quick PDF Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-volt/10 to-transparent border border-volt/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white uppercase block">
                {lang === 'en' ? 'Official Athlete Dossier' : 'Dossier Oficial de Rendimiento'}
              </span>
              <span className="text-[11px] text-slate-400">
                {lang === 'en' ? 'Includes detailed skills, radar and tactical duties' : 'Incluye desglose de atributos, radar y funciones tácticas'}
              </span>
            </div>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider flex items-center gap-2 shadow-md shadow-volt/20 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-black" />
              <span>{t.downloadPdf}</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Security Notice */}
      <div className="text-center pt-4">
        <p className="text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.confidentialNotice}</span>
        </p>
      </div>
    </div>
  );
};
