import { createContext } from 'react';

import type { Theme } from './theme';

export type ThemeContextValue = {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
