import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  BookOpen, 
  Settings, 
  History, 
  Cloud, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  Layers, 
  ShieldCheck,
  CheckCircle2,
  Users,
  CreditCard,
  Crown,
  Lock,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { GlossaryModal } from './GlossaryModal';
import { SettingsModal } from './SettingsModal';
import { PositionDeepDiveModal } from './PositionDeepDiveModal';
import { AuthModal } from './AuthModal';
import { AssessmentResult } from '../types';

export type HeaderTab = 'hero' | 'test' | 'drills' | 'tactics' | 'chat' | 'history' | 'academy' | 'portal';

interface HeaderProps {
  activeTab: HeaderTab;
  setActiveTab: (tab: HeaderTab) => void;
  savedCount: number;
  onStartTest: () => void;
  savedProfiles?: AssessmentResult[];
  onSelectProfile?: (profile: AssessmentResult) => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onStartTest,
  savedProfiles = [],
  onSelectProfile,
  onOpenPricing
}) => {
  const { lang, t } = useLanguage();
  const { user, logout, isCloudActive, plan, isPro, isAcademy } = useAuth();
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const langFlags: Record<string, string> = {
    es: '🇪🇸 ES',
    en: '🇺🇸 EN',
    pt: '🇧🇷 PT'
  };

  const getPlanBadge = () => {
    if (plan === 'academy_elite') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold flex items-center gap-1">
          <Crown className="w-2.5 h-2.5 text-amber-400" />
          {lang === 'en' ? 'ACADEMY ELITE' : lang === 'pt' ? 'ACADEMIA ELITE' : 'ACADEMIA ÉLITE'}
        </span>
      );
    }
    if (plan === 'academy' || plan === 'academy_basic') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
          <Users className="w-2.5 h-2.5 text-emerald-400" />
          {lang === 'en' ? 'ACADEMY BASIC' : 'ACADEMIA BÁSICO'}
        </span>
      );
    }
    if (plan === 'pro') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-volt/20 text-volt border border-volt/40 text-[9px] font-mono font-bold flex items-center gap-1">
          <Crown className="w-2.5 h-2.5 text-volt" />
          {lang === 'en' ? 'PRO PLAN' : lang === 'pt' ? 'PLANO PRO' : 'PLAN PRO'}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/20 text-[9px] font-mono font-bold">
        {lang === 'en' ? 'FREE' : lang === 'pt' ? 'GRÁTIS' : 'GRATIS'}
      </span>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            {/* CoachStrike Badge in Original Slanted Volt Style with separated CS */}
            <div className="h-8 sm:h-9 px-2 sm:px-2.5 bg-volt rounded-xs flex items-center justify-center transform -skew-x-12 shadow-md shadow-volt/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-black font-black text-lg sm:text-xl italic font-display leading-none select-none flex items-center gap-1 sm:gap-1.5">
                <span>C</span>
                <span>S</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tighter text-2xl uppercase italic font-display text-white">
                  COACHSTRIKE <span className="text-volt">AI</span>
                </span>
                {isCloudActive && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono-code font-bold tracking-wider">
                    <Cloud className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    FIREBASE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold uppercase tracking-widest text-slate-400">
            <button
              onClick={() => setActiveTab('hero')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'hero' ? 'text-volt border-b-2 border-volt' : 'hover:text-white'
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={onStartTest}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'test' ? 'text-volt border-b-2 border-volt' : 'hover:text-white'
              }`}
            >
              {t.navTest}
            </button>

            <button
              onClick={() => setActiveTab('drills')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'drills' ? 'text-volt border-b-2 border-volt' : 'hover:text-white'
              }`}
            >
              {t.navDrills}
            </button>

            <button
              onClick={() => setActiveTab('tactics')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'tactics' ? 'text-volt border-b-2 border-volt' : 'hover:text-white'
              }`}
            >
              {t.navTactics}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'chat' ? 'text-volt border-b-2 border-volt' : 'hover:text-white'
              }`}
            >
              {t.navChat}
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'academy' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.navAcademy}</span>
              {isAcademy ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ) : (
                <Lock className="w-3 h-3 text-slate-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'portal' ? 'text-volt border-b-2 border-volt' : 'hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Player Portal' : lang === 'pt' ? 'Portal Jogador' : 'Portal Jugador'}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history' ? 'text-volt border-b-2 border-volt' : 'hover:text-white'
              }`}
            >
              <span>{t.navHistory}</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-volt text-black font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Tools: Glossary, Settings, Pricing & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pricing / Monetization Button */}
            {onOpenPricing && (
              <button
                onClick={onOpenPricing}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-volt/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-volt/30 text-volt text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Ver planes Pro y Academia"
              >
                <Crown className="w-3.5 h-3.5 text-volt" />
                <span className="hidden sm:inline">{t.navPlans}</span>
                {getPlanBadge()}
              </button>
            )}

            {/* Glossary Button */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="px-3 py-2 rounded-xl bg-black/40 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-volt text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={t.glossaryTitle}
            >
              <BookOpen className="w-4 h-4 text-volt" />
              <span className="hidden sm:inline">{t.navGlossary}</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-2 rounded-xl bg-black/40 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-volt text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={t.settingsTitle}
            >
              <Settings className="w-4 h-4 text-volt" />
              <span className="text-[10px] font-mono-code font-bold bg-volt-10 text-volt px-1.5 py-0.5 rounded border border-volt-30">
                {langFlags[lang]}
              </span>
            </button>

            {/* Profile & Google Auth with Popover Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-2 bg-black/50 hover:bg-slate-800/80 border transition-all rounded-xl p-1 sm:pl-2.5 pr-2 cursor-pointer ${
                  isProfileMenuOpen ? 'border-volt shadow-lg shadow-volt/10' : 'border-white/10'
                }`}
                title="Opciones de perfil y posiciones guardadas"
                aria-expanded={isProfileMenuOpen}
              >
                <div className="relative">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Usuario'}
                      className="w-7 h-7 rounded-full border-2 border-volt object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-volt flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-volt" />
                    </div>
                  )}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                    user ? 'bg-emerald-500 ring-1 ring-emerald-400/50' : 'bg-slate-500'
                  }`} />
                </div>
                
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-bold text-white max-w-[90px] truncate leading-tight">
                    {user?.displayName || (lang === 'en' ? 'My Account' : lang === 'pt' ? 'Minha Conta' : 'Mi Cuenta')}
                  </span>
                  <span className="block text-[9px] font-mono-code text-slate-400 max-w-[90px] truncate leading-tight">
                    {user?.email || (lang === 'en' ? 'View profile' : lang === 'pt' ? 'Ver perfil' : 'Ver perfil')}
                  </span>
                </div>
              </button>

              {/* Interactive Profile Dropdown Popover */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-volt/30 shadow-2xl shadow-black/80 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Header */}
                  <div className="flex items-start gap-3 pb-3.5 border-b border-white/10">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Usuario'}
                        className="w-12 h-12 rounded-2xl border-2 border-volt object-cover shrink-0 shadow-md shadow-volt/20"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-volt flex items-center justify-center shrink-0">
                        <UserIcon className="w-6 h-6 text-volt" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-black text-white truncate font-display uppercase tracking-wide">
                          {user?.displayName || (lang === 'en' ? 'Strike AI Player' : lang === 'pt' ? 'Jogador Strike AI' : 'Futbolista Strike AI')}
                        </h4>
                        {user ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {lang === 'en' ? 'Connected' : lang === 'pt' ? 'Ligado' : 'Conectado'}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setIsAuthModalOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="px-2 py-0.5 rounded bg-volt text-black text-[9px] font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                          >
                            {lang === 'en' ? 'Sign In' : lang === 'pt' ? 'Entrar' : 'Acceder'}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-mono-code">
                        {user?.email || (lang === 'en' ? 'Guest session' : lang === 'pt' ? 'Sessão como convidado' : 'Sesión como invitado')}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                        <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Current plan:' : lang === 'pt' ? 'Plano atual:' : 'Plan actual:'}</span>
                        {getPlanBadge()}
                      </div>
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="py-2.5 space-y-1.5">
                    {/* View Saved Positions */}
                    <button
                      onClick={() => {
                        setActiveTab('history');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-volt/10 border border-volt/30 flex items-center justify-center text-volt group-hover:bg-volt group-hover:text-black transition-colors">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{lang === 'en' ? 'Saved Reports & Profiles' : lang === 'pt' ? 'Posições Guardadas' : 'Ver Posiciones Guardadas'}</span>
                            {savedCount > 0 && (
                              <span className="px-1.5 py-0.2 text-[9px] font-mono-code font-bold rounded bg-volt text-black">
                                {savedCount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {lang === 'en' ? 'Review scouting reports and player history' : lang === 'pt' ? 'Reveja os seus relatórios e avaliações' : 'Revisa tus fichas tácticas y evaluaciones'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-volt group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* Examine Positions in Depth (Dribbles & Pro Inspiration) */}
                    <button
                      onClick={() => {
                        setIsDeepDiveOpen(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-volt/5 hover:bg-volt/15 border border-volt/20 hover:border-volt/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-volt flex items-center justify-center text-black font-bold shadow-md shadow-volt/20">
                          <Flame className="w-4 h-4 fill-black" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-volt flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-volt" />
                            <span>{lang === 'en' ? 'In-Depth Tactical Deep Dive' : lang === 'pt' ? 'Examinar em Profundidade' : 'Examinar a Profundidad'}</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {lang === 'en' ? 'Most effective dribbles & what to copy from pros' : lang === 'pt' ? 'Fintas mais eficazes & o que copiar dos pros' : 'Regates más eficaces & en qué copiar a los pros'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-volt group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Modo Academia & Plantillas */}
                    <button
                      onClick={() => {
                        setActiveTab('academy');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
                            <span>{lang === 'en' ? 'Academy Mode & Coaches' : lang === 'pt' ? 'Modo Academia & Treinadores' : 'Modo Academia & Entrenadores'}</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {lang === 'en' ? 'Roster management, DNA tests & Starting XI' : lang === 'pt' ? 'Gestão de plantel, exames e Onze Ideal' : 'Gestión de alumnos, exámenes y Once Ideal'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Portal del Canterano y Familia */}
                    <button
                      onClick={() => {
                        setActiveTab('portal');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-volt/5 hover:bg-volt/15 border border-volt/20 hover:border-volt/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-volt/20 border border-volt/30 flex items-center justify-center text-volt font-bold">
                          <GraduationCap className="w-4 h-4 text-volt" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-volt flex items-center gap-1">
                            <span>{lang === 'en' ? 'Player & Family Portal' : lang === 'pt' ? 'Portal do Jogador & Família' : 'Portal del Jugador & Familia'}</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {lang === 'en' ? 'Personal tasks, attendance & tactical DNA' : lang === 'pt' ? 'Tarefas, presenças e ADN tático individual' : 'Deberes semanales, asistencias y ADN táctico'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-volt group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Monetization / Pricing Trigger */}
                    {onOpenPricing && (
                      <button
                        onClick={() => {
                          onOpenPricing();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-volt/10 hover:from-amber-500/20 hover:to-volt/20 border border-amber-500/20 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                              <span>{lang === 'en' ? 'Plans & Billing (Stripe / PayPal)' : lang === 'pt' ? 'Planos & Pagamentos (Stripe / PayPal)' : 'Planes & Pagos (Stripe / PayPal)'}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {lang === 'en' ? 'Unlock Pro features & Academy Mode' : lang === 'pt' ? 'Desbloqueie funcionalidades Pro e Modo Academia' : 'Desbloquea funciones Pro y Modo Academia'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* Footer / Logout / Login */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>{t.navSettings}</span>
                    </button>

                    {user ? (
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Sign Out' : lang === 'pt' ? 'Terminar Sessão' : 'Cerrar Sesión'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsProfileMenuOpen(false);
                        }}
                        className="text-xs font-bold text-volt hover:text-white bg-volt/10 hover:bg-volt/20 px-3 py-1.5 rounded-lg border border-volt/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Sign In' : lang === 'pt' ? 'Iniciar Sessão' : 'Iniciar Sesión'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Test Button */}
            <button
              onClick={onStartTest}
              className="px-3.5 py-2 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-lg shadow-volt/15 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span className="hidden sm:inline">{t.startEvaluation}</span>
              <span className="sm:hidden">Test</span>
            </button>
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="md:hidden flex items-center justify-around mt-2 pt-2 border-t border-white/10 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-1 ${activeTab === 'hero' ? 'text-volt' : ''}`}
          >
            {t.navHome}
          </button>
          <button
            onClick={onStartTest}
            className={`py-1 ${activeTab === 'test' ? 'text-volt' : ''}`}
          >
            {t.navTest}
          </button>
          <button
            onClick={() => setActiveTab('drills')}
            className={`py-1 ${activeTab === 'drills' ? 'text-volt' : ''}`}
          >
            {t.navDrills}
          </button>
          <button
            onClick={() => setActiveTab('tactics')}
            className={`py-1 ${activeTab === 'tactics' ? 'text-volt' : ''}`}
          >
            {t.navTactics}
          </button>
          <button
            onClick={() => setActiveTab('academy')}
            className={`py-1 flex items-center gap-0.5 ${activeTab === 'academy' ? 'text-emerald-400' : ''}`}
          >
            <span>{t.navAcademy}</span>
            {!isAcademy && <Lock className="w-2.5 h-2.5 text-slate-500" />}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-1 ${activeTab === 'chat' ? 'text-volt' : ''}`}
          >
            Coach
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-1 flex items-center gap-1 ${activeTab === 'history' ? 'text-volt' : ''}`}
          >
            {t.navHistory} {savedCount > 0 && `(${savedCount})`}
          </button>
        </div>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <PositionDeepDiveModal
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
        savedProfiles={savedProfiles}
        initialPosition={savedProfiles[0]?.primaryPosition?.code || 'EXT'}
        assessmentResult={savedProfiles[0] || null}
      />
    </>
  );
};
