import { ArrowUpRight } from 'lucide-react';
import { Link, NavLink } from 'react-router';

import type { SiteContent } from '../../content/siteContent';
import { getLocalizedPath } from '../../routing/locale';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '../../features/theme/ThemeToggle';

type SiteNavProps = {
  readonly site: SiteContent;
  readonly compact?: boolean;
};

export function SiteNav({ site, compact = false }: SiteNavProps) {
  const { locale, messages, navigation } = site;

  return (
    <header className={compact ? 'site-nav site-nav--compact' : 'site-nav'}>
      <Link className="site-mark" to={`/${locale}`} aria-label={messages.common.home}>
        WW<span>.</span>
      </Link>

      <nav className="site-links" aria-label={messages.common.primaryNavigation}>
        {navigation.map((item) => (
          <NavLink key={item.slug} to={getLocalizedPath(locale, item.href)}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="site-actions">
        {!compact && (
          <a className="availability" href="mailto:hello@wollanski.dev">
            Let’s talk <ArrowUpRight aria-hidden="true" />
          </a>
        )}
        <LanguageSwitcher locale={locale} messages={messages} />
        <ThemeToggle messages={messages} />
      </div>
    </header>
  );
}
