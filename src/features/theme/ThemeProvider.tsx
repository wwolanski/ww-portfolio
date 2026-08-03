import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { getInitialTheme, THEME_STORAGE_KEY, type Theme } from './theme';
import { ThemeContext } from './ThemeContext';

type ThemeProviderProps = { readonly children: ReactNode };

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) }),
    [theme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
