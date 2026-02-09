import { useState, useEffect, useCallback } from 'react';
import { settingsService, AppTheme } from '../services/settings.service';

export function useTheme() {
  const [theme, setThemeState] = useState<AppTheme>(settingsService.getTheme());

  const applyTheme = useCallback((targetTheme: AppTheme) => {
    const isDark = targetTheme === 'dark';
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }, []);

  const setTheme = (newTheme: AppTheme) => {
    settingsService.setTheme(newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return { theme, setTheme };
}
