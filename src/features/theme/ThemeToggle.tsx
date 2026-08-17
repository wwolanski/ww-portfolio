import { Moon, Sun } from 'lucide-react';

import type { Messages } from '../../content/messages';
import { useTheme } from './useTheme';

type ThemeToggleProps = { readonly messages: Messages };

export function ThemeToggle({ messages }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? messages.theme.switchToLight : messages.theme.switchToDark;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
