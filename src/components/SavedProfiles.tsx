import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Trophy, 
  Trash2, 
  Eye, 
  Calendar, 
  Cloud, 
  LogIn, 
  CheckCircle,
  Sparkles,
  Flame,
  UserCheck,
  ChevronRight,
  Zap,
  Target,
  BookOpen
} from 'lucide-react';
import { AssessmentResult, PositionCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { POSITION_ANALYSIS_DATA } from '../data/positionAnalysisData';
import { PositionDeepDiveModal } from './PositionDeepDiveModal';

interface SavedProfilesProps {
  savedProfiles: AssessmentResult[];
  onSelectProfile: (profile: AssessmentResult) => void;
  onDeleteProfile: (id: string) => void;
  onNewTest: () => void;
  onAskCoach?: (prompt: string) => void;
}

export const SavedProfiles: React.FC<SavedProfilesProps> = ({
  savedProfiles,
  onSelectProfile,
  onDeleteProfile,
  onNewTest,
  onAskCoach
}) => {
  const { t } = useLanguage();
  const { user, login } = useAuth();
  
  // State for Deep Dive modal
  const [selectedProfileForDeepDive, setSelectedProfileForDeepDive] = useState<AssessmentResult | null>(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profiles' | 'academy'>('profiles');
  const [selectedAcademyPosition, setSelectedAcademyPosition] = useState<PositionCategory>('EXT');

  const handleOpenDeepDive = (prof: AssessmentResult) => {
    setSelectedProfileForDeepDive(prof);
    setIsDeepDiveOpen(true);
  };

  const handleOpenAcademyPosition = (posCode: PositionCategory) => {
    setSelectedProfileForDeepDive(null);
    setSelectedAcademyPosition(posCode);
    setIsDeepDiveOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Cloud Sync Status Card */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Base de Datos Firebase Firestore
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle className="w-2.5 h-2.5" />
                ACTIVO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {user
                ? `Conectado como ${user.displayName || user.email}. Tus evaluaciones y análisis de posición se guardan en la nube.`
                : 'Inicia sesión con Google para sincronizar y respaldar permanentemente tus fichas de jugador en Firebase.'}
            </p>
          </div>
        </div>

        {!user && (
          <button
            onClick={login}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-volt" />
            <span>Conectar con Google</span>
          </button>
        )}
      </div>

      {/* Main Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-black/60 text-volt font-bold text-[10px] border border-white/10 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono-code">
              <History className="w-3.5 h-3.5 text-volt" />
              {t.historyTag}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black italic text-white font-display uppercase tracking-tight">
            Fichas Guardadas & Análisis
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inspecciona todas las posiciones evaluadas, analiza los regates más eficaces para cada puesto y descubre en qué jugadores profesionales inspirarte para copiar sus patrones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewTest}
            className="px-5 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-md shadow-volt/20 flex items-center gap-2 transition-all cursor-pointer font-display"
          >
            <Zap className="w-4 h-4 text-black" />
            <span>{t.newEvaluation}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveSubTab('profiles')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase italic tracking-wider flex items-center gap-2 transition-all cursor-pointer font-display ${
            activeSubTab === 'profiles'
              ? 'bg-volt text-black shadow-md shadow-volt/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Mis Evaluaciones ({savedProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('academy')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase italic tracking-wider flex items-center gap-2 transition-all cursor-pointer font-display ${
            activeSubTab === 'academy'
              ? 'bg-volt text-black shadow-md shadow-volt/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explorador de Regates & Inspiración Pro</span>
        </button>
      </div>

      {/* VIEW 1: MIS EVALUACIONES */}
      {activeSubTab === 'profiles' && (
        <>
          {savedProfiles.length === 0 ? (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-12 text-center space-y-5">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto stroke-[1.5]" />
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic text-white font-display uppercase">
                  {t.noSavedProfilesTitle}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Aún no tienes posiciones guardadas. Realiza tu primer test de ADN o explora la academia de regates para cualquier puesto.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onNewTest}
                  className="px-6 py-3 rounded-xl bg-volt text-black font-black uppercase italic text-xs tracking-widest shadow-lg shadow-volt/20 transition-all cursor-pointer font-display"
                >
                  {t.startEvaluation}
                </button>
                <button
                  onClick={() => setActiveSubTab('academy')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black uppercase italic text-xs tracking-widest transition-all cursor-pointer font-display"
                >
                  Explorar Regates por Posición
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedProfiles.map((prof) => {
                const posCode = prof.primaryPosition.code;
                const posData = POSITION_ANALYSIS_DATA[posCode] || POSITION_ANALYSIS_DATA.EXT;
                const topDribbles = posData.effectiveDribbles.slice(0, 3);
                const mainInspiration = posData.proInspirations[0];

                return (
                  <motion.div
                    key={prof.id}
                    whileHover={{ y: -3 }}
                    className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top Date & Match Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono-code flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-volt" />
                          {prof.createdAt}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                          {prof.primaryPosition.matchPercentage}% MATCH
                        </span>
                      </div>

                      {/* Player Name and Primary Position */}
                      <div>
                        <h3 className="text-2xl font-black italic text-white font-display uppercase tracking-tight">
                          {prof.playerName}
                        </h3>
                        <div className="text-xs text-volt font-black uppercase italic font-display mt-0.5">
                          {prof.primaryPosition.title} ({prof.preferredFoot})
                        </div>
                      </div>

                      {/* Regates Más Eficaces Preview */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-volt uppercase tracking-wider flex items-center gap-1.5 font-mono-code text-[11px]">
                            <Flame className="w-3.5 h-3.5 text-volt" />
                            Regates Eficaces en esta posición:
                          </span>
                          <span className="text-[10px] font-mono-code text-slate-400">
                            {posData.effectiveDribbles.length} tácticas
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {topDribbles.map((dribble) => (
                            <span
                              key={dribble.id}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300"
                            >
                              {dribble.name} ({dribble.efficacyScore}%)
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pro Inspiration Preview */}
                      {mainInspiration && (
                        <div className="p-3.5 rounded-xl bg-amber-400/5 border border-amber-400/20 flex items-center gap-3">
                          <img
                            src={mainInspiration.avatarUrl}
                            alt={mainInspiration.name}
                            className="w-11 h-11 rounded-xl object-cover border border-amber-400/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] text-amber-400 font-bold uppercase font-mono-code">
                              Inspiración Pro a Estudiar:
                            </div>
                            <div className="text-xs font-bold text-white truncate">
                              {mainInspiration.name} ({mainInspiration.club})
                            </div>
                            <div className="text-[11px] text-slate-300 line-clamp-1">
                              En qué copiarlo: {mainInspiration.copyGuide[0]?.habitTitle}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDeepDive(prof)}
                        className="flex-1 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer font-display shadow-md shadow-volt/20"
                      >
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Análisis Profundo</span>
                      </button>

                      <button
                        onClick={() => onSelectProfile(prof)}
                        title="Ver Informe Scouting Completo"
                        className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 font-bold text-xs uppercase flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteProfile(prof.id)}
                        title="Eliminar Ficha"
                        className="p-2.5 rounded-xl bg-black/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: ACADEMIA DE POSICIONES & REGATES EXPLORADOR */}
      {activeSubTab === 'academy' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-volt font-bold text-xs uppercase tracking-wider font-mono-code">
              <Sparkles className="w-4 h-4 text-volt" />
              Catálogo Táctico por Posición
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic text-white font-display uppercase tracking-tight">
              Regates Más Eficaces e Inspiración Pro en Todas las Posiciones
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Selecciona cualquier demarcación táctica para acceder al análisis en profundidad: descubre los regates con mayor tasa de éxito en el fútbol profesional y qué pautas exactas copiar de los mejores futbolistas del planeta.
            </p>

            {/* Position Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {(Object.keys(POSITION_ANALYSIS_DATA) as PositionCategory[]).map((code) => {
                const item = POSITION_ANALYSIS_DATA[code];
                return (
                  <motion.div
                    key={code}
                    whileHover={{ y: -3 }}
                    onClick={() => handleOpenAcademyPosition(code)}
                    className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-volt/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-volt/10 border border-volt/30 flex items-center justify-center text-volt font-black text-xs font-mono-code group-hover:bg-volt group-hover:text-black transition-colors">
                          {code}
                        </span>
                        <span className="text-[10px] font-mono-code text-slate-400">
                          {item.effectiveDribbles.length} regates
                        </span>
                      </div>

                      <h4 className="text-base font-black italic text-white font-display uppercase group-hover:text-volt transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-volt font-bold font-display">
                      <span>Ver Análisis & Regates</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Position Deep Dive Modal */}
      <PositionDeepDiveModal
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
        assessmentResult={selectedProfileForDeepDive}
        initialPosition={selectedProfileForDeepDive?.primaryPosition?.code || selectedAcademyPosition}
        onAskCoach={onAskCoach}
        savedProfiles={savedProfiles}
        onSelectProfile={(prof) => setSelectedProfileForDeepDive(prof)}
      />
    </div>
  );
};
