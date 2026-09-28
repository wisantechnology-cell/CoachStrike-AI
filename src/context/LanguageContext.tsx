import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations, Translations } from '../data/translations';
import { detectLanguage } from '../utils/languageDetector';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  detectAndSetLanguage: (text: string) => boolean;
  t: Translations;
  interpolate: (template: string, params: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('coachstrike_lang') as Language;
      if (saved && (saved === 'es' || saved === 'en' || saved === 'pt')) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    // Default language is English as requested
    return 'en';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('coachstrike_lang', newLang);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const detectAndSetLanguage = useCallback((text: string): boolean => {
    const detected = detectLanguage(text);
    if (detected && detected !== lang) {
      setLang(detected);
      return true;
    }
    return false;
  }, [lang, setLang]);

  // Global listener: whenever user types in any input or textarea across the app, auto-detect language
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleInputEvent = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) {
        return;
      }
      
      // Ignore password, number, or email inputs
      if (target.type === 'password' || target.type === 'number' || target.type === 'email') {
        return;
      }

      const val = target.value;
      if (!val || val.trim().length < 2) return;

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        detectAndSetLanguage(val);
      }, 300);
    };

    document.addEventListener('input', handleInputEvent, { passive: true });
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      document.removeEventListener('input', handleInputEvent);
    };
  }, [detectAndSetLanguage]);

  const interpolate = (template: string, params: Record<string, string>) => {
    return template.replace(/\{(\w+)\}/g, (_, key) => params[key] || '');
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, detectAndSetLanguage, t, interpolate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

