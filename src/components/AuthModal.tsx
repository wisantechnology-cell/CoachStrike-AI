import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  LogIn, 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AUTH_TEXTS = {
  en: {
    title: 'Access to',
    subtitle: 'Sign in to manage memberships, player academy and tactics',
    directTab: 'Direct Coach & Club',
    googleTab: 'Google Sign-In',
    oneClickTitle: '⚡ 1-Click Instant Demo Login:',
    headCoach: 'Head Coach',
    headCoachDesc: 'Tactical Director Profile',
    academyCoach: 'Academy Coach',
    academyCoachDesc: 'Youth Academy Mode',
    orCustom: 'or enter your name and club',
    nameLabel: 'Your Name or Club',
    namePlaceholder: 'e.g. Coach Pep Guardiola / City Academy',
    emailLabel: 'Email Address (Optional)',
    roleLabel: 'Role',
    roleCoach: 'Head Coach / Tactical Director',
    rolePlayer: 'Player / Athlete',
    clubLabel: 'Club or Academy',
    clubPlaceholder: 'e.g. Thunder FC',
    submitBtn: 'Sign In to My Account',
    googleAuthTitle: 'Google Authentication',
    googleAuthDesc: 'Automatically sync your tactical assessments, training routines and history to your account.',
    googleConnecting: 'Connecting to Google...',
    googleBtn: 'Sign In with Google',
    termsNotice: 'By signing in, you agree to our terms and secure storage of tactical scouting data.'
  },
  es: {
    title: 'Acceso a',
    subtitle: 'Inicia sesión para gestionar membresías, cantera y pizarras',
    directTab: 'Acceso DT & Club',
    googleTab: 'Google Sign-In',
    oneClickTitle: '⚡ 1 Clic para Ingresar de Inmediato:',
    headCoach: 'Director Técnico',
    headCoachDesc: 'Perfil Entrenador',
    academyCoach: 'Entrenador Cantera',
    academyCoachDesc: 'Modo Academia',
    orCustom: 'o con tu nombre y club',
    nameLabel: 'Tu Nombre o Club',
    namePlaceholder: 'Ej. DT Carlos Bianchi / Club Atlético',
    emailLabel: 'Correo Electrónico (Opcional)',
    roleLabel: 'Rol',
    roleCoach: 'Director Técnico / DT',
    rolePlayer: 'Futbolista',
    clubLabel: 'Club o Academia',
    clubPlaceholder: 'Ej. Cantera Rayo',
    submitBtn: 'Ingresar a mi Cuenta',
    googleAuthTitle: 'Autenticación con Google',
    googleAuthDesc: 'Guarda automáticamente tus exámenes tácticos, planes de entrenamiento e historial en tu cuenta personal.',
    googleConnecting: 'Conectando con Google...',
    googleBtn: 'Iniciar Sesión con Google',
    termsNotice: 'Al identificarte aceptas los términos y el almacenamiento seguro de tus análisis deportivos.'
  },
  pt: {
    title: 'Acesso a',
    subtitle: 'Inicie sessão para gerir subscrições, academia e pranchetas',
    directTab: 'Acesso Treinador & Clube',
    googleTab: 'Google Sign-In',
    oneClickTitle: '⚡ 1 Clique para Entrar Imediatamente:',
    headCoach: 'Treinador Principal',
    headCoachDesc: 'Perfil de Treinador',
    academyCoach: 'Treinador Formação',
    academyCoachDesc: 'Modo Academia',
    orCustom: 'ou com o seu nome e clube',
    nameLabel: 'O Seu Nome ou Clube',
    namePlaceholder: 'Ex. Mister Jorge Jesus / Clube Atlético',
    emailLabel: 'Email (Opcional)',
    roleLabel: 'Função',
    roleCoach: 'Treinador Principal / DT',
    rolePlayer: 'Jogador de Futebol',
    clubLabel: 'Clube ou Academia',
    clubPlaceholder: 'Ex. Academia Estrela',
    submitBtn: 'Entrar na Minha Conta',
    googleAuthTitle: 'Autenticação Google',
    googleAuthDesc: 'Guarde automaticamente as suas avaliações táticas, planos de treino e histórico na sua conta pessoal.',
    googleConnecting: 'A ligar ao Google...',
    googleBtn: 'Iniciar Sessão com o Google',
    termsNotice: 'Ao autenticar-se aceita os termos e o armazenamento seguro dos seus relatórios desportivos.'
  }
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { lang } = useLanguage();
  const { login, loginAsGuestProfile, error: authError } = useAuth();
  const [activeTab, setActiveTab] = useState<'direct' | 'google'>('direct');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'coach' | 'player'>('coach');
  const [clubName, setClubName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const txt = AUTH_TEXTS[lang] || AUTH_TEXTS.en;

  if (!isOpen) return null;

  const handleQuickProfileLogin = (quickName: string, quickEmail: string, quickRole: 'coach' | 'player', quickClub: string) => {
    loginAsGuestProfile(quickName, quickEmail, quickRole, quickClub);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.warn('Google sign-in exception:', err);
      const errorStr = String(err?.code || err?.message || '');
      if (errorStr.includes('unauthorized-domain') || errorStr.includes('popup-closed') || errorStr.includes('cancelled') || errorStr.includes('blocked')) {
        setErrorMessage(lang === 'en'
          ? 'Google popup was blocked or closed. Direct coach access is activated below for instant sign in.'
          : 'La ventana de Google se cerró o tu navegador bloqueó la ventana emergente en el preview. Se activó el Acceso Directo de Entrenador para que ingreses de inmediato.');
        setActiveTab('direct');
      } else {
        setErrorMessage(lang === 'en'
          ? 'Browser popup restriction detected. Please use Direct Access below to proceed.'
          : 'Se detectó una restricción de ventana en el navegador. Usa el Acceso Directo a continuación para entrar de inmediato.');
        setActiveTab('direct');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(lang === 'en' ? 'Please enter your name or club.' : 'Por favor introduce tu nombre o el de tu club.');
      return;
    }
    const finalEmail = email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.') || 'coach'}@coachstrike.ai`;
    loginAsGuestProfile(name.trim(), finalEmail, role, clubName.trim() || 'Football Academy');
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-volt flex items-center justify-center text-black font-black">
              ⚡
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white uppercase italic font-display">
                {txt.title} <span className="text-volt">CoachStrike AI</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {txt.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Method Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('direct');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'direct'
                  ? 'bg-volt text-black shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>{txt.directTab}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('google');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'google'
                  ? 'bg-volt text-black shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{txt.googleTab}</span>
            </button>
          </div>

          {/* Error / Notice Alert */}
          {(errorMessage || authError) && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p>{errorMessage || authError}</p>
                {activeTab === 'google' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('direct')}
                    className="mt-1.5 text-volt underline font-bold cursor-pointer block"
                  >
                    👉 {txt.directTab}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'direct' ? (
            <div className="space-y-4 text-left">
              {/* 1-Click Quick Preset Access */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  {txt.oneClickTitle}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickProfileLogin('Head Coach / DT', 'head.coach@coachstrike.ai', 'coach', 'Premier Football Academy')}
                    className="p-2.5 rounded-xl bg-volt/10 hover:bg-volt/25 border border-volt/30 text-left transition-all cursor-pointer flex items-center gap-2.5 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-volt text-black flex items-center justify-center font-black shrink-0">
                      DT
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-white group-hover:text-volt block truncate">
                        {txt.headCoach}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {txt.headCoachDesc}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickProfileLogin('Youth Academy Director', 'youth.academy@coachstrike.ai', 'coach', 'Youth Development Club')}
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-left transition-all cursor-pointer flex items-center gap-2.5 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-400 text-black flex items-center justify-center font-black shrink-0">
                      ⚽
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-white group-hover:text-emerald-400 block truncate">
                        {txt.academyCoach}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {txt.academyCoachDesc}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{txt.orCustom}</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleDirectLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    {txt.nameLabel} <span className="text-volt">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={txt.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-volt"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    {txt.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="coach@footballclub.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-volt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      {txt.roleLabel}
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'coach' | 'player')}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-volt"
                    >
                      <option value="coach">{txt.roleCoach}</option>
                      <option value="player">{txt.rolePlayer}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      {txt.clubLabel}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder={txt.clubPlaceholder}
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-volt"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-volt/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{txt.submitBtn}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-volt/10 border border-volt/30 flex items-center justify-center mx-auto text-volt">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">{txt.googleAuthTitle}</h4>
                <p className="text-xs text-slate-400">
                  {txt.googleAuthDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-white/10 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    <span>{txt.googleConnecting}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{txt.googleBtn}</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              {txt.termsNotice}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
