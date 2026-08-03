import { ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router';

import { navigationItems } from '../../content/navigation';
import { ThemeToggle } from '../../features/theme/ThemeToggle';

export function HomePage() {
  return (
    <main id="main-content" className="home-page">
      <div className="home-shell">
        <div className="home-intro">
          <header className="home-header">
            <p className="home-kicker">Full-stack software developer</p>
            <ThemeToggle />
          </header>

          <div className="home-title-wrap">
            <h1 className="home-title" aria-label="Wojciech Wolanski">
              <span className="home-title__line">Wojciech</span>
              <span className="home-title__line home-title__line--last">Wolanski</span>
            </h1>
          </div>
        </div>

        <section className="home-grid" aria-label="Portfolio sections">
          {navigationItems.map((item, index) => (
            <article key={item.slug} className="home-card" style={{ '--card-accent': item.accent } as React.CSSProperties}>
              <Link className="home-card__link" to={item.href} aria-label={`Open ${item.label} page`}>
                <span className="home-card__number">0{index + 1}</span>
                <span className="home-card__media">
                  <img src={item.image} alt="" width="683" height="2048" />
                  <span className="home-card__open">
                    Open <ArrowDownRight aria-hidden="true" />
                  </span>
                </span>
              </Link>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <footer className="home-footer">
          <span>Based in Poland · Working worldwide</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </main>
  );
}
