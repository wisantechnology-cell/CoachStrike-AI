import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeBackground = 'obsidian' | 'turf' | 'cyber' | 'slate';
export type AccentColor = 'volt' | 'cyan' | 'emerald' | 'orange' | 'magenta' | 'purple';

export interface AccentConfig {
  id: AccentColor;
  name: string;
  hex: string;
  rgb: string;
  hoverHex: string;
  shadowRgb: string;
}

export const ACCENT_PALETTE: Record<AccentColor, AccentConfig> = {
  volt: {
    id: 'volt',
    name: 'Amarillo Neón (Volt)',
    hex: '#ccff00',
    rgb: '204, 255, 0',
    hoverHex: '#e5ff66',
    shadowRgb: '204, 255, 0'
  },
  cyan: {
    id: 'cyan',
    name: 'Azul Neón (Electric Cyan)',
    hex: '#00f0ff',
    rgb: '0, 240, 255',
    hoverHex: '#66f5ff',
    shadowRgb: '0, 240, 255'
  },
  emerald: {
    id: 'emerald',
    name: 'Verde Esmeralda (Field Emerald)',
    hex: '#10b981',
    rgb: '16, 185, 129',
    hoverHex: '#34d399',
    shadowRgb: '16, 185, 129'
  },
  orange: {
    id: 'orange',
    name: 'Naranja Fuego (Flame Orange)',
    hex: '#ff6b00',
    rgb: '255, 107, 0',
    hoverHex: '#ff8533',
    shadowRgb: '255, 107, 0'
  },
  magenta: {
    id: 'magenta',
    name: 'Rosa Neón (Hyper Magenta)',
    hex: '#f43f5e',
    rgb: '244, 63, 94',
    hoverHex: '#fb7185',
    shadowRgb: '244, 63, 94'
  },
  purple: {
    id: 'purple',
    name: 'Púrpura Táctico (Tactical Violet)',
    hex: '#a855f7',
    rgb: '168, 85, 247',
    hoverHex: '#c084fc',
    shadowRgb: '168, 85, 247'
  }
};

export const THEME_BACKGROUNDS: Record<ThemeBackground, { id: ThemeBackground; name: string; bgClass: string; hex: string }> = {
  obsidian: {
    id: 'obsidian',
    name: 'Negro Noche (Obsidian)',
    bgClass: 'bg-[#05070a]',
    hex: '#05070a'
  },
  turf: {
    id: 'turf',
    name: 'Verde Césped Táctico (Tactical Turf)',
    bgClass: 'bg-[#021a0f]',
    hex: '#021a0f'
  },
  cyber: {
    id: 'cyber',
    name: 'Azul Noche Ciber (Cyber Night)',
    bgClass: 'bg-[#080a15]',
    hex: '#080a15'
  },
  slate: {
    id: 'slate',
    name: 'Gris Pizarra (Classic Slate)',
    bgClass: 'bg-[#0f172a]',
    hex: '#0f172a'
  }
};

interface ThemeContextType {
  themeBg: ThemeBackground;
  setThemeBg: (bg: ThemeBackground) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentConfig: AccentConfig;
  resetDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeBg, setThemeBgState] = useState<ThemeBackground>(() => {
    try {
      const saved = localStorage.getItem('coachstrike_theme_bg') as ThemeBackground;
      if (saved && THEME_BACKGROUNDS[saved]) return saved;
    } catch (e) { console.error(e); }
    return 'obsidian';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('coachstrike_accent') as AccentColor;
      if (saved && ACCENT_PALETTE[saved]) return saved;
    } catch (e) { console.error(e); }
    return 'volt';
  });

  const accentConfig = ACCENT_PALETTE[accent] || ACCENT_PALETTE.volt;

  // Apply CSS variables to :root whenever theme or accent changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', accentConfig.hex);
    root.style.setProperty('--accent-rgb', accentConfig.rgb);
    root.style.setProperty('--accent-hover', accentConfig.hoverHex);
    root.style.setProperty('--accent-shadow', accentConfig.shadowRgb);

    const bgHex = THEME_BACKGROUNDS[themeBg]?.hex || '#05070a';
    root.style.setProperty('--app-bg', bgHex);

    try {
      localStorage.setItem('coachstrike_theme_bg', themeBg);
      localStorage.setItem('coachstrike_accent', accent);
    } catch (e) {
      console.error(e);
    }
  }, [themeBg, accent, accentConfig]);

  const setThemeBg = (bg: ThemeBackground) => setThemeBgState(bg);
  const setAccent = (acc: AccentColor) => setAccentState(acc);
  const resetDefaults = () => {
    setThemeBgState('obsidian');
    setAccentState('volt');
  };

  return (
    <ThemeContext.Provider value={{ themeBg, setThemeBg, accent, setAccent, accentConfig, resetDefaults }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
