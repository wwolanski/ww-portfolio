import { ArrowUpRight } from 'lucide-react';
import { Link, NavLink } from 'react-router';

import { navigationItems } from '../../content/navigation';
import { ThemeToggle } from '../../features/theme/ThemeToggle';

type SiteNavProps = { readonly compact?: boolean };

export function SiteNav({ compact = false }: SiteNavProps) {
  return (
    <header className={compact ? 'site-nav site-nav--compact' : 'site-nav'}>
      <Link className="site-mark" to="/" aria-label="Wojciech Wolanski — home">
        WW<span>.</span>
      </Link>

      <nav className="site-links" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <NavLink key={item.slug} to={item.href}>
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
        <ThemeToggle />
      </div>
    </header>
  );
}
