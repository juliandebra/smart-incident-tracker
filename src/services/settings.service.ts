const NOTIFICATIONS_KEY = 'push_notifications_enabled';
const THEME_KEY = 'app_theme';

export type AppTheme = 'light' | 'dark';

export const settingsService = {
  isNotificationsEnabled(): boolean {
    const value = localStorage.getItem(NOTIFICATIONS_KEY);
    return value === 'true';
  },

  setNotificationsEnabled(enabled: boolean): void {
    localStorage.setItem(NOTIFICATIONS_KEY, String(enabled));
  },

  getTheme(): AppTheme {
    return (localStorage.getItem(THEME_KEY) as AppTheme) || 'light';
  },

  setTheme(theme: AppTheme): void {
    localStorage.setItem(THEME_KEY, theme);
  }
};
