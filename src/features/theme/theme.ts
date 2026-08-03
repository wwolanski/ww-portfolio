export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'ww-portfolio-theme';

export function getInitialTheme(): Theme {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
}
