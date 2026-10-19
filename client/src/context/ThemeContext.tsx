// client/src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'neon-lime' | 'brushed-silver' | 'editorial-milk';

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  bgAnimation: boolean;
  setBgAnimation: (enabled: boolean) => void;
  toggleTheme: () => void;
  toggleBgAnimation: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('vacabbro_theme');
      if (saved === 'editorial-milk' || saved === 'neon-lime' || saved === 'brushed-silver') {
        return saved;
      }
      if (saved === 'cyber-violet') {
        // Smoothly migrate retired purple theme to editorial milk
        return 'editorial-milk';
      }
    } catch {}
    return 'editorial-milk';
  });

  const [bgAnimation, setBgAnimationState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vacabbro_bg_animation');
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {}
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('vacabbro_theme', theme);
    } catch {}

    if (theme === 'editorial-milk') {
      document.documentElement.setAttribute('data-theme', 'editorial');
      document.body.setAttribute('data-theme', 'editorial');
    } else if (theme === 'brushed-silver') {
      document.documentElement.setAttribute('data-theme', 'silver');
      document.body.setAttribute('data-theme', 'silver');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.removeAttribute('data-theme');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('vacabbro_bg_animation', String(bgAnimation));
    } catch {}
  }, [bgAnimation]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const setBgAnimation = (enabled: boolean) => {
    setBgAnimationState(enabled);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'neon-lime' ? 'editorial-milk' : 'neon-lime'));
  };

  const toggleBgAnimation = () => {
    setBgAnimationState((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        bgAnimation,
        setBgAnimation,
        toggleTheme,
        toggleBgAnimation,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
