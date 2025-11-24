import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type ThemeMode = 'dark' | 'light' | 'high-contrast' | 'custom';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  customColors: {
    primary: string;
    background: string;
    accent: string;
  };
  setCustomColors: (colors: { primary: string; background: string; accent: string }) => void;
  applyTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  dark: {
    primary: '142 76% 36%',
    background: '240 10% 3.9%',
    card: '240 10% 8%',
    foreground: '0 0% 98%',
  },
  light: {
    primary: '142 76% 36%',
    background: '0 0% 100%',
    card: '0 0% 96%',
    foreground: '240 10% 3.9%',
  },
  'high-contrast': {
    primary: '142 100% 45%',
    background: '0 0% 0%',
    card: '0 0% 10%',
    foreground: '0 0% 100%',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [customColors, setCustomColors] = useState({
    primary: '#22c55e',
    background: '#0a0a0a',
    accent: '#8b5cf6',
  });

  useEffect(() => {
    loadTheme();
  }, [user]);

  const loadTheme = async () => {
    // Load from localStorage first
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColors = localStorage.getItem('custom-colors');

    if (savedTheme) {
      setThemeMode(savedTheme);
      applyThemeToDOM(savedTheme);
    }

    if (savedColors) {
      const colors = JSON.parse(savedColors);
      setCustomColors(colors);
      if (savedTheme === 'custom') {
        applyCustomColors(colors);
      }
    }

    // Load from database if user is logged in
    if (user) {
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        const mode = (data.theme_mode || 'dark') as ThemeMode;
        setThemeMode(mode);
        localStorage.setItem('theme-mode', mode);
        applyThemeToDOM(mode);

        if (data.primary_color && data.background_color && data.accent_color) {
          const colors = {
            primary: data.primary_color,
            background: data.background_color,
            accent: data.accent_color,
          };
          setCustomColors(colors);
          localStorage.setItem('custom-colors', JSON.stringify(colors));
          if (mode === 'custom') {
            applyCustomColors(colors);
          }
        }
      }
    }
  };

  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const applyCustomColors = (colors: { primary: string; background: string; accent: string }) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHSL(colors.primary));
    root.style.setProperty('--background', hexToHSL(colors.background));
    root.style.setProperty('--accent', hexToHSL(colors.accent));
  };

  const applyThemeToDOM = (mode: ThemeMode) => {
    const root = document.documentElement;
    
    if (mode === 'custom') {
      return; // Custom colors handled separately
    }

    const theme = themes[mode as keyof typeof themes];
    if (theme) {
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--background', theme.background);
      root.style.setProperty('--card', theme.card);
      root.style.setProperty('--foreground', theme.foreground);
    }
  };

  const applyTheme = async () => {
    localStorage.setItem('theme-mode', themeMode);
    
    if (themeMode === 'custom') {
      localStorage.setItem('custom-colors', JSON.stringify(customColors));
      applyCustomColors(customColors);
    } else {
      applyThemeToDOM(themeMode);
    }

    if (user) {
      const settings: any = {
        user_id: user.id,
        theme_mode: themeMode,
      };

      if (themeMode === 'custom') {
        settings.primary_color = customColors.primary;
        settings.background_color = customColors.background;
        settings.accent_color = customColors.accent;
      }

      await supabase.from('user_settings').upsert(settings);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        customColors,
        setCustomColors,
        applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
