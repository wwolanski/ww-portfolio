import { ArrowDownRight } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { LanguageSwitcher } from '../../components/layout/LanguageSwitcher';
import { InlineCopy } from '../../components/ui/InlineCopy';
import type { SiteContent } from '../../content/siteContent';
import { getLocalizedPath } from '../../routing/locale';
import { ThemeToggle } from '../../features/theme/ThemeToggle';

type HomePageProps = { readonly site: SiteContent };

export function HomePage({ site }: HomePageProps) {
  const { locale, messages, home, navigation } = site;
  const location = useLocation();

  return (
    <main key={location.pathname} id="main-content" className="home-page route-enter">
      <div className="home-shell">
        <div className="home-intro">
          <header className="home-header">
            <p className="home-kicker"><InlineCopy copy={home.kicker} /></p>
            <div className="home-header-actions">
              <LanguageSwitcher locale={locale} messages={messages} />
              <ThemeToggle messages={messages} />
            </div>
          </header>

          <div className="home-title-wrap">
            <h1 className="home-title" aria-label="Wojciech Wolanski">
              <span className="home-title__line">Wojciech</span>
              <span className="home-title__line home-title__line--last">Wolanski</span>
            </h1>
          </div>
        </div>

        <section className="home-grid" aria-label={home.portfolioSections}>
          {navigation.map((item, index) => (
            <article
              key={item.slug}
              className="home-card"
              data-card={item.slug}
              style={{ '--card-accent': item.accent } as React.CSSProperties}
            >
              <Link className="home-card__link" to={getLocalizedPath(locale, item.href)} aria-label={messages.actions.openPage(item.label)}>
                <span className="home-card__number">0{index + 1}</span>
                <span className="home-card__media">
                  <img src={item.image} alt="" width="724" height="2172" />
                  <span className="home-card__title" aria-hidden="true">
                    <span className="home-card__title-text">{item.label}</span>
                  </span>
                  <span className="home-card__open">
                    {messages.actions.open} <ArrowDownRight aria-hidden="true" />
                  </span>
                </span>
              </Link>
              <p><InlineCopy copy={item.description} /></p>
            </article>
          ))}
        </section>

        <footer className="home-footer">
          <span><InlineCopy copy={`${home.basedIn} · ${home.workingWorldwide}`} /></span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </main>
  );
}
