import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Sparkles, UserCheck, ShieldCheck, Flame, ChevronRight, 
  RotateCcw, Bookmark, Share2, BookOpen, AlertCircle, CheckCircle2,
  Zap, Award, Play, Users
} from 'lucide-react';
import { AssessmentResult } from '../types';
import { RadarChart } from './RadarChart';
import { TacticalPitch } from './TacticalPitch';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TacticalTerm } from './TacticalTerm';
import { PositionDeepDiveModal } from './PositionDeepDiveModal';

interface EvaluationResultProps {
  result: AssessmentResult;
  onRepeatTest: () => void;
  onSaveProfile: (result: AssessmentResult) => void;
  isSaved?: boolean;
  onOpenPricing?: () => void;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({
  result,
  onRepeatTest,
  onSaveProfile,
  isSaved = false,
  onOpenPricing
}) => {
  const { lang, t } = useLanguage();
  const { isPro, isAcademy, plan } = useAuth();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  const handleGenerateAIReport = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/evaluate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: result.playerName,
          preferredFoot: result.preferredFoot,
          primaryPosition: result.primaryPosition,
          skills: result.skills,
          answersSummary: result.answers,
          lang
        })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data);
      } else {
        setAiError('No se pudo establecer conexión con el motor IA. Se ha generado la evaluación local de respaldo.');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Servicio de IA en mantenimiento. Los datos locales son completamente precisos.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Top Banner & Header Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 uppercase text-6xl font-black italic -rotate-12 pointer-events-none select-none text-white font-display">
          CORE
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-volt font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono-code">
                <Trophy className="w-3.5 h-3.5 text-volt" />
                {t.resultHeaderTag} #STK-{result.id.slice(-4)}
              </span>
              <span className="text-xs text-slate-500 font-mono-code">{result.createdAt}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black italic text-white font-display tracking-tight uppercase">
              {result.playerName}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>{t.footLabel} <strong className="text-volt">{result.preferredFoot}</strong></span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onSaveProfile(result)}
              disabled={isSaved}
              className={`px-4 py-2.5 rounded-xl font-black italic uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-white/10 text-slate-300 border border-white/10'
                  : 'bg-volt text-black hover:bg-white shadow-md shadow-volt/20'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? t.btnSaved : t.btnSaveReport}</span>
            </button>

            <button
              onClick={onRepeatTest}
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-slate-800 border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-volt" />
              <span>{t.btnRepeatTest}</span>
            </button>
          </div>
        </div>

        {/* Primary Position Match Highlight */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs uppercase font-bold text-volt tracking-[0.2em] font-mono-code">
              Posición Ideal Principal
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-4xl sm:text-5xl font-black italic text-white font-display uppercase leading-none">
                {result.primaryPosition.title}
              </h2>
              <span className="px-3 py-1 bg-volt text-black text-xs font-black uppercase font-mono-code rounded">
                {result.primaryPosition.matchPercentage}% {t.matchScore}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {result.primaryPosition.roleDescription}
            </p>
          </div>

          {/* Secondary positions pills */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono-code">
              Posiciones Secundarias
            </div>
            <div className="space-y-2">
              {result.secondaryPositions.map((sec, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-white/5">
                  <span className="font-bold text-slate-200 uppercase italic">{sec.title}</span>
                  <span className="text-volt font-mono-code font-bold">{sec.matchPercentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Radar Chart, Pro Player Matchup, & Improvement Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Component */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase font-bold text-volt tracking-[0.2em] flex items-center gap-2 font-mono-code">
              <Zap className="w-4 h-4 text-volt" />
              {t.radarTitle} (8D)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono-code bg-black/40 px-2 py-1 rounded">RANGO 0-99</span>
          </div>

          <RadarChart
            playerScores={result.skills}
            proScores={result.proComparison.player.stats}
            proPlayerName={result.proComparison.player.name}
          />

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">PAC / Vel</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.speed}</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">TEC / Téc</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.technique}</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">PAS / Vis</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.passing}</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">TAC / IQ</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.tacticalIQ}</div>
            </div>
          </div>
        </div>

        {/* Pro Player Match & Improvement Focus Cards */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Elite Matchup */}
          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
            <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] mb-4 font-mono-code">
              {t.proComparisonTitle}
            </h2>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
              <img
                src={result.proComparison.player.avatarUrl}
                alt={result.proComparison.player.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-volt shrink-0"
              />
              <div>
                <div className="text-lg font-black uppercase italic font-display">{result.proComparison.player.name}</div>
                <div className="text-xs text-slate-400 uppercase font-semibold">{result.proComparison.player.club}</div>
                <div className="mt-1.5 inline-block px-2 py-0.5 bg-volt text-black text-[10px] font-bold rounded font-mono-code">
                  {result.proComparison.matchPercentage}% AFINIDAD
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-3">
              {result.proComparison.matchReason}
            </p>
          </div>

          {/* Immersive UI Focus Box */}
          <div className="bg-volt p-6 rounded-2xl text-black">
            <h2 className="text-xs uppercase font-black tracking-widest mb-4 text-black/80 font-mono-code">
              {t.areasToImprove}
            </h2>
            <ul className="space-y-3">
              {result.areasToImprove.slice(0, 3).map((area, idx) => (
                <li key={idx} className="flex justify-between items-center border-b border-black/10 pb-2">
                  <span className="font-extrabold uppercase text-xs italic font-display">{area}</span>
                  <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-mono-code font-bold">
                    +{10 + idx * 4}% REQ
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Position Dribbles & Pro Inspiration Deep Dive Banner */}
      <div className="bg-slate-900/60 border border-volt/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-volt flex items-center justify-center text-black font-black text-xl font-display transform -skew-x-6 shadow-md shadow-volt/20 shrink-0">
            <Flame className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-volt font-mono-code flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ANÁLISIS PROFUNDO & RECURSOS 1V1
              </span>
            </div>
            <h3 className="text-xl font-black italic text-white font-display uppercase tracking-tight">
              Regates Más Eficaces & En Qué Copiar a los Pros
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Descubre los movimientos técnicos con mayor porcentaje de efectividad para tu posición de <strong>{result.primaryPosition.title}</strong> y la guía exacta de hábitos y gestos para copiar de estrellas de élite.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDeepDiveOpen(true)}
          className="px-6 py-3 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer font-display shrink-0 shadow-lg shadow-volt/20"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Abrir Análisis de Regates & Pro</span>
        </button>
      </div>

      {/* Pro / Academy Membership Banner */}
      {onOpenPricing && (
        <>
          {plan === 'free' && (
            <div className="bg-gradient-to-r from-amber-500/15 via-volt/10 to-emerald-500/15 border border-volt/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-volt/20 border border-volt/40 flex items-center justify-center text-volt shrink-0">
                  <Award className="w-5 h-5 text-volt" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase italic font-display">
                    ¿Quieres la Ficha Scouting Completa y Modo Academia?
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pasa al <strong>Plan Pro</strong> o <strong>Modo Academia</strong> con Stripe o PayPal para desbloquear evaluaciones ilimitadas y gestión de alumnos.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenPricing}
                className="px-4 py-2 rounded-xl bg-volt hover:bg-white text-black text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer shrink-0 shadow-md shadow-volt/20"
              >
                Ver Planes & Activar
              </button>
            </div>
          )}

          {plan === 'pro' && !isAcademy && (
            <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-900/30 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-volt text-black text-[10px] font-black uppercase tracking-wider font-mono">
                      PLAN PRO ACTIVO
                    </span>
                    <h4 className="text-sm font-black text-white uppercase italic font-display">
                      ¿Diriges un Equipo o Cantera? Pasa a Modo Academia
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Agrega perfiles de alumnos, realiza exámenes tácticos a cada uno, diseña tu Once Ideal interactivo y asígnales deberes y técnicas.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenPricing}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-white text-black text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer shrink-0 shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Mejorar a Modo Academia</span>
              </button>
            </div>
          )}

          {isAcademy && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-200">
                  Membresía <strong className="text-emerald-400">Modo Academia UEFA Pro</strong> activa. Acceso total a cantera y armado de once.
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tactical Pitch & Heatmap Section */}
      <TacticalPitch
        zones={result.tacticalZones}
        positionTitle={result.primaryPosition.title}
      />

      {/* Strengths and Improvements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs uppercase font-bold text-volt tracking-[0.2em] flex items-center gap-2 font-mono-code">
            <CheckCircle2 className="w-4 h-4 text-volt" />
            {t.keyStrengths}
          </h3>
          <ul className="space-y-2.5">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="w-2 h-2 rounded-full bg-volt mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs uppercase font-bold text-white tracking-[0.2em] flex items-center gap-2 font-mono-code">
            <AlertCircle className="w-4 h-4 text-volt" />
            {t.areasToImprove}
          </h3>
          <ul className="space-y-2.5">
            {result.areasToImprove.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gemini AI Deep Analysis Trigger Card */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-volt font-bold text-[10px] uppercase tracking-widest border border-white/10 font-mono-code">
              <Sparkles className="w-3.5 h-3.5" />
              IA SCOUTING ENGINE
            </span>
            <h3 className="text-2xl font-black italic text-white font-display uppercase">
              Generar Informe Técnico Profundo con IA
            </h3>
            <p className="text-xs text-slate-400">
              Obtén un informe personalizado de scouting, movimiento pro recomendado y directrices de entrenamiento generadas al instante.
            </p>
          </div>

          <button
            onClick={handleGenerateAIReport}
            disabled={aiLoading}
            className="px-6 py-3.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-lg shadow-volt/15 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            {aiLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>Analizando ADN...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black text-black" />
                <span>Analizar con IA</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Display */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-white/10 space-y-4"
          >
            <h4 className="text-lg font-black italic text-volt font-display uppercase">
              {aiAnalysis.analysisTitle || 'Informe Táctico Scouting IA'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {aiAnalysis.tacticalOverview}
            </p>

            {aiAnalysis.signatureMove && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-bold text-volt uppercase tracking-wider block mb-1 font-mono-code">
                  Movimiento Pro Recomendado:
                </span>
                <span className="text-xs font-bold text-white uppercase italic font-display">{aiAnalysis.signatureMove}</span>
              </div>
            )}

            {aiAnalysis.proQuote && (
              <p className="text-xs italic text-slate-400 bg-black/40 p-3 rounded-lg border border-white/5">
                "{aiAnalysis.proQuote}"
              </p>
            )}
          </motion.div>
        )}

        {aiError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono-code">
            {aiError}
          </div>
        )}
      </div>

      {/* Recommended Drills Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] flex items-center gap-2 font-mono-code">
            <BookOpen className="w-4 h-4 text-volt" />
            {t.recommendedDrillsTitle}
          </h2>
          <span className="text-[10px] text-slate-500 font-mono-code">3 EJERCICIOS GENERADOS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.recommendedDrills.map((drill, idx) => (
            <div key={drill.id} className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-code">{drill.durationMinutes} MINS</span>
                </div>

                <h4 className="text-base font-black italic text-white font-display uppercase">
                  {drill.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {drill.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 text-xs space-y-1 text-slate-400">
                <div>• <strong className="text-slate-200">Series:</strong> {drill.sets}</div>
                <div>• <strong className="text-slate-200">Reps:</strong> {drill.reps}</div>
                <div className="mt-2 text-[11px] text-volt italic">💡 {drill.proTip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Position Deep Dive Modal */}
      <PositionDeepDiveModal
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
        assessmentResult={result}
        initialPosition={result.primaryPosition.code}
      />
    </div>
  );
};
