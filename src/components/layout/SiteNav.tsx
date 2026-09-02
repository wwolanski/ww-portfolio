import { useEffect, useState, type CSSProperties } from 'react';
import { Dialog } from 'radix-ui';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';

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
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const activeNavigationItem = navigation.find((item) => location.pathname === getLocalizedPath(locale, item.href));

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 760px)');
    const closeOnDesktop = () => {
      if (!mediaQuery.matches) {
        setIsOpen(false);
      }
    };

    closeOnDesktop();
    mediaQuery.addEventListener('change', closeOnDesktop);

    return () => {
      mediaQuery.removeEventListener('change', closeOnDesktop);
    };
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <header className={compact ? 'site-nav site-nav--compact' : 'site-nav'}>
        <div className="site-nav__inner">
          <Link className="site-mark" to={`/${locale}`} aria-label={messages.common.home}>
            W<span>W</span>.
          </Link>

          <Dialog.Trigger asChild>
            <button
              type="button"
              className="site-nav__menu-trigger"
              aria-label={isOpen ? messages.common.closeNavigation : messages.common.openNavigation}
            >
              <span className="site-nav__menu-wordmark" aria-hidden="true">
                W<span>W</span>.
              </span>
              {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </Dialog.Trigger>

          <nav className="site-links" aria-label={messages.common.primaryNavigation}>
            {navigation.map((item) => (
              <NavLink
                key={item.slug}
                to={getLocalizedPath(locale, item.href)}
                className={({ isActive }) => isActive ? 'site-links__link site-links__link--active' : 'site-links__link'}
              >
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
        </div>

        <Dialog.Portal>
          <div className="site-nav__portal">
            <Dialog.Overlay className="site-nav__scrim" />
            <Dialog.Content
              className="site-nav__drawer"
              style={{ '--drawer-accent': activeNavigationItem?.accent ?? '#08c8e8' } as CSSProperties}
            >
              <div className="site-nav__drawer-header">
                <Dialog.Title className="site-nav__drawer-title">
                  {messages.common.primaryNavigation}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" className="site-nav__drawer-close" aria-label={messages.common.closeNavigation}>
                    <X aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
              <nav className="site-nav__drawer-links" aria-label={messages.common.primaryNavigation}>
                {navigation.map((item) => {
                  return (
                    <Dialog.Close asChild key={item.slug}>
                      <NavLink
                        to={getLocalizedPath(locale, item.href)}
                        className="site-nav__drawer-link"
                      >
                        <span className="site-nav__drawer-link-label">{item.label}</span>
                      </NavLink>
                    </Dialog.Close>
                  );
                })}
              </nav>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </header>
    </Dialog.Root>
  );
}
