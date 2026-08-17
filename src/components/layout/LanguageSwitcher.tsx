import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router';

import { getLocalizedPath, type Locale } from '../../routing/locale';
import type { Messages } from '../../content/messages';

type LanguageSwitcherProps = {
  readonly locale: Locale;
  readonly messages: Messages;
};

const languageOptions = [
  { locale: 'pl', icon: 'circle-flags:pl', labelKey: 'polish' },
  { locale: 'en', icon: 'circle-flags:gb', labelKey: 'english' },
] as const satisfies readonly { locale: Locale; icon: string; labelKey: 'polish' | 'english' }[];

export function LanguageSwitcher({ locale, messages }: LanguageSwitcherProps) {
  const location = useLocation();

  return (
    <div className="language-switcher" aria-label={messages.language.label}>
      {languageOptions.map((option) => {
        const isCurrent = option.locale === locale;
        const label = messages.language[option.labelKey];

        return (
          <Link
            key={option.locale}
            className={isCurrent ? 'language-switcher__option is-current' : 'language-switcher__option'}
            to={`${getLocalizedPath(option.locale, location.pathname)}${location.search}${location.hash}`}
            aria-label={isCurrent ? `${label} — ${messages.language.label}` : messages.language.switchTo(label)}
            aria-current={isCurrent ? 'page' : undefined}
          >
            <Icon icon={option.icon} width="22" height="22" aria-hidden="true" />
            <span>{option.locale.toUpperCase()}</span>
          </Link>
        );
      })}
    </div>
  );
}
