import React from 'react';
import { X, Settings, Check, RefreshCw, Palette, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { 
  useTheme, 
  ACCENT_PALETTE, 
  DISPLAY_ACCENTS, 
  THEME_BACKGROUNDS, 
  AccentColor, 
  ThemeBackground,
  getLocalizedAccentLabel,
  getLocalizedThemeName
} from '../context/ThemeContext';
import { Language } from '../data/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { lang, setLang, t } = useLanguage();
  const { themeBg, setThemeBg, accent, setAccent, resetDefaults } = useTheme();

  if (!isOpen) return null;

  const languagesList: { id: Language; flag: string; label: string }[] = [
    { id: 'en', flag: '🇺🇸', label: 'English' },
    { id: 'es', flag: '🇪🇸', label: 'Español' },
    { id: 'pt', flag: '🇧🇷', label: 'Português' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-left"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-volt flex items-center justify-center text-black font-black shadow-md shadow-volt/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic text-white font-display uppercase tracking-wider">
                {t.settingsTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.settingsSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Language */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-volt font-bold text-xs uppercase tracking-wider font-mono-code">
            <Globe className="w-4 h-4 text-volt" />
            <span>{t.languageSectionTitle}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {languagesList.map((item) => {
              const isSelected = lang === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setLang(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-volt text-black border-volt shadow-md shadow-volt/20'
                      : 'bg-black/40 text-slate-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-lg">{item.flag}</span>
                  <span>{item.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-black shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Accent Neons (Letter/Highlight/Button Colors) */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-volt font-bold text-xs uppercase tracking-wider font-mono-code">
            <Sparkles className="w-4 h-4 text-volt" />
            <span>{t.accentSectionTitle}</span>
          </div>
          <p className="text-xs text-slate-400">
            {t.accentSubtitle}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DISPLAY_ACCENTS.map((accKey) => {
              const acc = ACCENT_PALETTE[accKey];
              const localizedAcc = getLocalizedAccentLabel(accKey, lang);
              const isSelected = accent === accKey || (accKey === 'blue' && accent === 'cyan') || (accKey === 'lime' && accent === 'emerald') || (accKey === 'red' && accent === 'magenta');
              return (
                <button
                  key={accKey}
                  onClick={() => setAccent(accKey)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black border-2 border-white text-white shadow-lg'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                      style={{ backgroundColor: acc.hex }}
                    />
                    <span className="text-xs font-bold truncate">{localizedAcc.shortLabel || localizedAcc.name}</span>
                  </div>
                  {isSelected && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: acc.hex }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Background Theme */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-volt font-bold text-xs uppercase tracking-wider font-mono-code">
            <Palette className="w-4 h-4 text-volt" />
            <span>{t.themeSectionTitle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(THEME_BACKGROUNDS) as ThemeBackground[]).map((bgKey) => {
              const bg = THEME_BACKGROUNDS[bgKey];
              const localizedThemeName = getLocalizedThemeName(bgKey, lang);
              const isSelected = themeBg === bgKey;
              return (
                <button
                  key={bgKey}
                  onClick={() => setThemeBg(bgKey)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black border-2 border-volt text-white shadow-md shadow-volt/10'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-lg border border-white/20 shrink-0"
                      style={{ backgroundColor: bg.hex }}
                    />
                    <span>{localizedThemeName}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-volt shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          <button
            onClick={resetDefaults}
            className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.resetDefaults}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-volt text-black font-black uppercase italic text-xs tracking-wider hover:bg-white transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
