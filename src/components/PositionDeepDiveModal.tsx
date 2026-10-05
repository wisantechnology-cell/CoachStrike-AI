import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Trophy, 
  Dumbbell, 
  MessageSquare, 
  ChevronRight,
  UserCheck,
  Zap,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';
import { AssessmentResult, PositionCategory } from '../types';
import { getLocalizedPositionAnalysis, EffectiveDribble, ProInspirationPlayer } from '../data/positionAnalysisData';
import { useLanguage } from '../context/LanguageContext';

interface PositionDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentResult?: AssessmentResult | null;
  initialPosition?: PositionCategory;
  onAskCoach?: (prompt: string) => void;
  savedProfiles?: AssessmentResult[];
  onSelectProfile?: (profile: AssessmentResult) => void;
}

export const PositionDeepDiveModal: React.FC<PositionDeepDiveModalProps> = ({
  isOpen,
  onClose,
  assessmentResult,
  initialPosition = 'EXT',
  onAskCoach,
  savedProfiles = [],
  onSelectProfile
}) => {
  const { lang } = useLanguage();
  // Determine active position code
  const currentPosCode: PositionCategory = assessmentResult?.primaryPosition?.code || initialPosition || 'EXT';
  const [selectedPosition, setSelectedPosition] = useState<PositionCategory>(currentPosCode);
  const [activeTab, setActiveTab] = useState<'dribbles' | 'inspiration' | 'dna' | 'drills'>('dribbles');
  const [expandedDribbleId, setExpandedDribbleId] = useState<string | null>(null);

  // Sync position if assessmentResult changes
  React.useEffect(() => {
    if (assessmentResult?.primaryPosition?.code) {
      setSelectedPosition(assessmentResult.primaryPosition.code);
    } else if (initialPosition) {
      setSelectedPosition(initialPosition);
    }
  }, [assessmentResult, initialPosition]);

  if (!isOpen) return null;

  const analysis = getLocalizedPositionAnalysis(selectedPosition, lang);
  const dribbles = analysis.effectiveDribbles;
  const inspirations = analysis.proInspirations;

  // Pre-expand first dribble if none expanded
  const currentExpandedDribble = expandedDribbleId || dribbles[0]?.id;

  const positionButtons: { code: PositionCategory; label: string }[] = lang === 'en'
    ? [
        { code: 'EXT', label: 'Winger' },
        { code: 'DC', label: 'Striker' },
        { code: 'MPO', label: 'Attacking Mid' },
        { code: 'MC', label: 'Central Mid' },
        { code: 'MCD', label: 'Defensive Mid' },
        { code: 'LAT', label: 'Fullback' },
        { code: 'DEC', label: 'Center Back' },
        { code: 'POR', label: 'Goalkeeper' }
      ]
    : lang === 'pt'
    ? [
        { code: 'EXT', label: 'Extremo' },
        { code: 'DC', label: 'Avançado' },
        { code: 'MPO', label: 'Médio Ofensivo' },
        { code: 'MC', label: 'Médio Centro' },
        { code: 'MCD', label: 'Médio Defensivo' },
        { code: 'LAT', label: 'Lateral' },
        { code: 'DEC', label: 'Defesa Central' },
        { code: 'POR', label: 'Guarda-Redes' }
      ]
    : [
        { code: 'EXT', label: 'Extremo' },
        { code: 'DC', label: 'Delantero' },
        { code: 'MPO', label: 'Mediapunta' },
        { code: 'MC', label: 'Mediocentro' },
        { code: 'MCD', label: 'Pivote' },
        { code: 'LAT', label: 'Lateral' },
        { code: 'DEC', label: 'Central' },
        { code: 'POR', label: 'Portero' }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="bg-slate-900/80 border-b border-white/10 px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-volt flex items-center justify-center text-black font-black text-lg font-display transform -skew-x-6 shadow-md shadow-volt/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-volt px-2 py-0.5 rounded bg-volt/10 border border-volt/30">
                  {lang === 'en' ? 'IN-DEPTH POSITION ANALYSIS' : lang === 'pt' ? 'ANÁLISE PROFUNDA DE POSIÇÃO' : 'ANÁLISIS PROFUNDO DE POSICIÓN'}
                </span>
                {assessmentResult && (
                  <span className="text-[10px] font-mono-code text-slate-400 hidden sm:inline">
                    {lang === 'en' ? 'Player:' : lang === 'pt' ? 'Jogador:' : 'Jugador:'} <strong className="text-white font-bold">{assessmentResult.playerName}</strong>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black italic text-white font-display uppercase tracking-tight">
                {analysis.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Position Switcher & Saved Profiles Bar */}
        <div className="bg-black/50 border-b border-white/10 px-5 py-3 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Saved Profiles Quick Selector (if any) */}
          {savedProfiles.length > 0 && onSelectProfile && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                {lang === 'en' ? 'My Profiles:' : lang === 'pt' ? 'Os Meus Perfis:' : 'Mis Fichas:'}
              </span>
              <div className="flex items-center gap-1.5">
                {savedProfiles.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => {
                      onSelectProfile(prof);
                      setSelectedPosition(prof.primaryPosition.code);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      assessmentResult?.id === prof.id
                        ? 'bg-volt text-black shadow-sm shadow-volt/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>{prof.playerName}</span>
                    <span className="opacity-75 text-[10px]">({prof.primaryPosition.code})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Position Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 sm:py-0">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider hidden md:inline">
              {lang === 'en' ? 'View Position:' : lang === 'pt' ? 'Ver Posição:' : 'Ver Posición:'}
            </span>
            {positionButtons.map((pos) => (
              <button
                key={pos.code}
                onClick={() => setSelectedPosition(pos.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedPosition === pos.code
                    ? 'bg-volt text-black shadow-sm shadow-volt/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-900/40 border-b border-white/10 px-5 sm:px-8 flex items-center gap-2 sm:gap-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('dribbles')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-black uppercase italic tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'dribbles'
                ? 'text-volt border-volt'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-volt" />
            <span>{lang === 'en' ? 'Most Effective Dribbles' : lang === 'pt' ? 'Dribles Mais Eficazes' : 'Regates Más Eficaces'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-volt/10 text-volt text-[10px] font-mono-code font-bold">
              {dribbles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inspiration')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-black uppercase italic tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inspiration'
                ? 'text-volt border-volt'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Pro Inspiration: What to Emulate' : lang === 'pt' ? 'Inspiração Pro: O Que Copiar' : 'Inspiración Pro: En Qué Copiarlo'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-mono-code font-bold">
              {inspirations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dna')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-black uppercase italic tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'dna'
                ? 'text-volt border-volt'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-400" />
            <span>{lang === 'en' ? 'Tactical DNA & Role' : lang === 'pt' ? 'ADN Tático & Função' : 'ADN Táctico & Misión'}</span>
          </button>

          <button
            onClick={() => setActiveTab('drills')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-black uppercase italic tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'drills'
                ? 'text-volt border-volt'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'en' ? 'Recommended Drills' : lang === 'pt' ? 'Exercícios Recomendados' : 'Ejercicios Recomendados'}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: REGATES MÁS EFICACES */}
          {activeTab === 'dribbles' && (
            <div className="space-y-6">
              <div className="bg-volt/10 border border-volt/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-volt font-bold text-xs uppercase tracking-wider font-mono-code">
                    <Zap className="w-4 h-4 text-volt" />
                    {lang === 'en' ? `Elite Dribbling Arsenal for ${analysis.title}` : lang === 'pt' ? `Arsenal de Fintas para ${analysis.title}` : `Arsenal de Desequilibrio para ${analysis.title}`}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    {lang === 'en'
                      ? 'These are not showboating tricks; they are the high-efficiency technical resources with the highest proven success rate in pro football to break lines and generate scoring chances.'
                      : lang === 'pt'
                      ? 'Não são truques de exibição; são os recursos técnicos e fintas com maior taxa de sucesso comprovada no futebol profissional para superar linhas e criar golos.'
                      : 'Estos no son trucos de exhibición; son los recursos técnicos y regates con mayor tasa de éxito comprobada en el fútbol profesional para superar líneas, proteger posesión y generar ocasiones de gol desde este puesto.'}
                  </p>
                </div>
                {onAskCoach && (
                  <button
                    onClick={() => {
                      onClose();
                      onAskCoach(lang === 'en'
                        ? `How can I master and train the most effective dribbles for the ${analysis.title} position? Especially ${dribbles[0]?.name}`
                        : lang === 'pt'
                        ? `Como posso aperfeiçoar e treinar os dribles mais eficazes para a posição de ${analysis.title}? Em especial ${dribbles[0]?.name}`
                        : `¿Cómo puedo perfeccionar y entrenar los regates más eficaces para la posición de ${analysis.title}? En especial ${dribbles[0]?.name}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-volt text-black font-black uppercase italic text-xs tracking-wider flex items-center gap-2 shrink-0 hover:bg-white transition-all cursor-pointer font-display"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Ask AI Coach' : lang === 'pt' ? 'Perguntar ao Coach AI' : 'Consultar al Coach AI'}</span>
                  </button>
                )}
              </div>

              {/* Dribbles Grid / Accordion */}
              <div className="grid grid-cols-1 gap-4">
                {dribbles.map((dribble) => {
                  const isExpanded = currentExpandedDribble === dribble.id;
                  return (
                    <div
                      key={dribble.id}
                      className={`border rounded-2xl transition-all ${
                        isExpanded
                          ? 'bg-slate-900/90 border-volt/40 shadow-xl'
                          : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => setExpandedDribbleId(isExpanded ? null : dribble.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-volt/10 border border-volt/20 flex items-center justify-center text-volt font-black text-sm shrink-0">
                            {dribble.efficacyScore}%
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-lg font-black italic text-white font-display uppercase tracking-tight">
                                {dribble.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-white/10 text-slate-300">
                                {dribble.difficulty}
                              </span>
                              <span className="text-xs text-slate-400 font-mono-code hidden sm:inline">
                                • Zona: {dribble.zone}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {dribble.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] font-bold text-volt hidden md:inline">
                            {isExpanded ? 'Ocultar detalles' : 'Ver guía técnica'}
                          </span>
                          <ChevronRight
                            className={`w-5 h-5 text-slate-400 transition-transform ${
                              isExpanded ? 'rotate-90 text-volt' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-5 pb-6 pt-1 border-t border-white/5 space-y-5"
                          >
                            {/* Why it is effective */}
                            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                              <div className="text-xs font-bold text-volt uppercase tracking-wider flex items-center gap-1.5 font-mono-code">
                                <Target className="w-3.5 h-3.5 text-volt" />
                                {lang === 'en'
                                  ? 'Why is this the most lethal skill in this position?'
                                  : lang === 'pt'
                                  ? 'Por que é o drible mais letal nesta posição?'
                                  : '¿Por qué es el regate más letal en esta posición?'}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                                {dribble.whyEffective}
                              </p>
                            </div>

                            {/* Step by Step Execution Guide */}
                            <div className="space-y-2.5">
                              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono-code">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                {lang === 'en'
                                  ? 'Step-by-Step Technical Execution Mechanics:'
                                  : lang === 'pt'
                                  ? 'Mecânica de Execução Técnica Passo a Passo:'
                                  : 'Mecánica de Ejecución Técnica Paso a Paso:'}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {dribble.stepByStep.map((step, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3"
                                  >
                                    <span className="w-6 h-6 rounded-lg bg-volt/10 border border-volt/20 text-volt text-xs font-mono font-bold flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </span>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                      {step}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tactical Advice & Common Pitfalls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono-code">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  {lang === 'en' ? 'Optimal Moment to Execute:' : lang === 'pt' ? 'Momento Ideal para Executar:' : 'Momento Óptimo para Usarlo:'}
                                </div>
                                <p className="text-xs text-slate-300">
                                  {dribble.whenToUse}
                                </p>
                              </div>

                              <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-mono-code">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                  {lang === 'en' ? 'Common Mistake to Avoid:' : lang === 'pt' ? 'Erro Comum a Evitar:' : 'Error Común a Evitar:'}
                                </div>
                                <p className="text-xs text-slate-300">
                                  {dribble.mistakesToAvoid}
                                </p>
                              </div>
                            </div>

                            {/* Pro Master footnote */}
                            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5 flex-wrap gap-2">
                              <span>
                                {lang === 'en' ? 'World Masters of this skill:' : lang === 'pt' ? 'Mestres mundiais deste drible:' : 'Maestros mundiales de este regate:'}{' '}
                                <strong className="text-white font-bold">{dribble.proMaster}</strong>
                              </span>
                              <span className="text-[11px] font-mono-code text-volt">
                                {lang === 'en' ? 'Key attribute:' : lang === 'pt' ? 'Requisito-chave:' : 'Requisito clave:'} {dribble.keySkillRequired}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INSPIRACIÓN PRO & EN QUÉ COPIARLO */}
          {activeTab === 'inspiration' && (
            <div className="space-y-6">
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono-code">
                    <Award className="w-4 h-4 text-amber-400" />
                    {lang === 'en' ? `Professional Benchmark Study for ${analysis.title}` : lang === 'pt' ? `Estudo de Padrões Profissionais para ${analysis.title}` : `Estudio de Patrones Profesionales para ${analysis.title}`}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    {lang === 'en'
                      ? 'Learning from elite stars is about identifying micro-habits. We break down the visual scanning, technical body shapes, and tactical decisions you can apply directly to your next match.'
                      : lang === 'pt'
                      ? 'Aprender com os melhores é compreender micro-hábitos. Analisamos os hábitos visuais, gestos técnicos e decisões táticas que podes incorporar de imediato nos teus jogos.'
                      : 'Aprender de los mejores no significa imitarlos sin sentido. Desglosamos con precisión quirúrgica los hábitos visuales, gestos técnicos y decisiones tácticas que puedes incorporar de inmediato a tus propios partidos.'}
                  </p>
                </div>
              </div>

              {/* Inspiration Cards */}
              <div className="grid grid-cols-1 gap-6">
                {inspirations.map((player) => (
                  <div
                    key={player.id}
                    className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl"
                  >
                    {/* Player Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <img
                          src={player.avatarUrl}
                          alt={player.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-volt shadow-lg"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-black italic text-white font-display uppercase tracking-tight">
                              {player.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                              {player.club}
                            </span>
                          </div>
                          <p className="text-xs text-volt font-bold mt-0.5">
                            {player.roleTitle}
                          </p>
                          <p className="text-xs text-slate-400 italic mt-1">
                            "{player.quote}"
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right space-y-1">
                        <div className="text-[10px] font-mono-code text-slate-400 uppercase">
                          {lang === 'en' ? 'Signature Move:' : lang === 'pt' ? 'Movimento de Marca:' : 'Movimiento Característico:'}
                        </div>
                        <div className="text-xs font-bold text-slate-200">
                          {player.signatureMove}
                        </div>
                      </div>
                    </div>

                    {/* Tactical Superpower Highlight */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-volt shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-volt uppercase tracking-wider font-mono-code">
                          {lang === 'en' ? 'Tactical Superpower to Emulate:' : lang === 'pt' ? 'Superpoder Tático a Analisar:' : 'Superpoder Táctico a Analizar:'}
                        </span>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {player.tacticalSuperpower}
                        </p>
                      </div>
                    </div>

                    {/* What to Copy Breakdown */}
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase italic tracking-wider text-white font-display flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'en' ? 'Key Patterns to Copy (Practical Guide):' : lang === 'pt' ? 'O Que Podes Copiar (Guia Prático):' : 'En Qué Lo Puedes Copiar (Guía Práctica):'}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {player.copyGuide.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-1.5">
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono-code font-bold bg-white/10 text-slate-300 uppercase inline-block">
                                {item.category}
                              </span>
                              <h5 className="text-sm font-bold text-white">
                                {item.habitTitle}
                              </h5>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {item.whatToCopy}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-white/5">
                              <div className="text-[10px] font-bold text-volt uppercase font-mono-code">
                                {lang === 'en' ? 'How to train it:' : lang === 'pt' ? 'Como treinar:' : 'Cómo entrenarlo:'}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {item.howToPractice}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADN TÁCTICO & MISIÓN */}
          {activeTab === 'dna' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider font-mono-code">
                  <Compass className="w-4 h-4 text-sky-400" />
                  {lang === 'en' ? 'Tactical Identity & Demands of the Role' : lang === 'pt' ? 'Identidade Tática & Exigências da Função' : 'Identidad Táctica & Exigencias del Puesto'}
                </div>
                <h3 className="text-2xl font-black italic text-white font-display uppercase">
                  {analysis.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {analysis.tacticalProfile}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="text-xs font-bold text-volt uppercase font-mono-code">
                      {lang === 'en' ? 'Core On-Field Mission:' : lang === 'pt' ? 'Missão Principal no Campo:' : 'Misión Principal en el Campo:'}
                    </div>
                    <p className="text-xs text-slate-300">
                      {analysis.coreMission}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="text-xs font-bold text-sky-400 uppercase font-mono-code">
                      {lang === 'en' ? 'Physical & Physiological Demands:' : lang === 'pt' ? 'Exigência Física & Fisiológica:' : 'Exigencia Física & Fisiológica:'}
                    </div>
                    <p className="text-xs text-slate-300">
                      {analysis.physicalDemand}
                    </p>
                  </div>
                </div>
              </div>

              {assessmentResult && (
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black italic text-white font-display uppercase">
                      {lang === 'en' ? `Tactical Fit for ${assessmentResult.playerName}` : lang === 'pt' ? `Compatibilidade de ${assessmentResult.playerName}` : `Compatibilidad de ${assessmentResult.playerName}`}
                    </h4>
                    <span className="px-3 py-1 rounded bg-volt text-black font-black text-xs font-mono-code">
                      {assessmentResult.primaryPosition.matchPercentage}% MATCH
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono-code">{lang === 'en' ? 'Speed' : lang === 'pt' ? 'Velocidade' : 'Velocidad'}</div>
                      <div className="text-xl font-black text-white font-display">{assessmentResult.skills.speed}/100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono-code">{lang === 'en' ? 'Technique' : lang === 'pt' ? 'Técnica' : 'Técnica'}</div>
                      <div className="text-xl font-black text-white font-display">{assessmentResult.skills.technique}/100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono-code">{lang === 'en' ? 'Tactical IQ' : lang === 'pt' ? 'IQ Tático' : 'IQ Táctico'}</div>
                      <div className="text-xl font-black text-white font-display">{assessmentResult.skills.tacticalIQ}/100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono-code">{lang === 'en' ? 'Physical' : lang === 'pt' ? 'Físico' : 'Físico'}</div>
                      <div className="text-xl font-black text-white font-display">{assessmentResult.skills.physical}/100</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ENFOQUES DE ENTRENAMIENTO */}
          {activeTab === 'drills' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono-code">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  {lang === 'en' ? 'Training Plan to Master These Skills & Habits' : lang === 'pt' ? 'Plano de Treino para Dominar Estes Dribles e Hábitos' : 'Plan de Trabajo para Dominar estos Regates y Hábitos'}
                </div>
                <h3 className="text-xl font-black italic text-white font-display uppercase">
                  {lang === 'en' ? 'Priority Session Routines' : lang === 'pt' ? 'Rotinas Prioritárias de Treino' : 'Rutinas Prioritarias de Sesión'}
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === 'en'
                    ? 'Incorporate these specific training blocks in your upcoming sessions to automate key skills and lightning-fast decision making:'
                    : lang === 'pt'
                    ? 'Incorpora estes três blocos de treino específicos nas tuas sessões para automatizar as fintas-chave e a tomada de decisão:'
                    : 'Incorpora estos tres bloques específicos en tus próximos entrenamientos para automatizar los regates clave y la toma de decisiones:'}
                </p>

                <div className="space-y-3 pt-2">
                  {analysis.recommendedTrainingFocus.map((focus, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3.5"
                    >
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                        {focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900/80 border-t border-white/10 px-5 py-4 sm:px-8 flex items-center justify-between shrink-0 flex-wrap gap-3">
          <div className="text-xs text-slate-400">
            {lang === 'en'
              ? 'Tactical analysis methodology grounded in UEFA Pro Standards'
              : lang === 'pt'
              ? 'Metodologia de análise tática baseada nos padrões UEFA Pro'
              : 'Metodología de análisis táctico basada en estándares UEFA Pro'}
          </div>

          <div className="flex items-center gap-2">
            {onAskCoach && (
              <button
                onClick={() => {
                  onClose();
                  onAskCoach(lang === 'en'
                    ? `Let's deep dive into the ${analysis.title} position: Which pro player should I study to elevate my game, and which key dribble should I prioritize?`
                    : lang === 'pt'
                    ? `Vamos analisar a fundo a posição de ${analysis.title}: Que jogador me recomendas estudar para evoluir e qual drible devo priorizar?`
                    : `Analicemos a fondo la posición de ${analysis.title}: ¿Qué jugador me recomiendas estudiar para mejorar y qué regate debo priorizar?`);
                }}
                className="px-4 py-2 rounded-xl bg-volt/10 hover:bg-volt text-volt hover:text-black font-black uppercase italic text-xs tracking-wider border border-volt/30 flex items-center gap-2 transition-all cursor-pointer font-display"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Chat with AI Coach' : lang === 'pt' ? 'Falar com o Coach AI' : 'Hablar con Coach AI'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Close' : lang === 'pt' ? 'Fechar' : 'Cerrar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
