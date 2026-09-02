import { useLayoutEffect } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router';

import { LanguageSwitcher } from '../../components/layout/LanguageSwitcher';
import { preloadVisualPanelImages } from '../../components/layout/preloadVisualPanelImages';
import { InlineCopy } from '../../components/ui/InlineCopy';
import type { SiteContent } from '../../content/siteContent';
import { getLocalizedPath } from '../../routing/locale';
import { ThemeToggle } from '../../features/theme/ThemeToggle';

type HomePageProps = { readonly site: SiteContent };

const skeletonDelayMs = 120;
const skeletonMinimumDurationMs = 180;

export function HomePage({ site }: HomePageProps) {
  const { locale, messages, home, navigation } = site;

  useHomeFontGate(locale, navigation.map((item) => `${item.label} ${item.description}`).join(' '));

  return (
    <main id="main-content" className="home-page">
      <HomeLoadingSkeleton />
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
              <Link
                className="home-card__link"
                to={getLocalizedPath(locale, item.href)}
                aria-label={messages.actions.openPage(item.label)}
                onClick={preloadVisualPanelImages}
              >
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
              <p className="home-card__description"><InlineCopy copy={item.description} /></p>
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

function HomeLoadingSkeleton() {
  return (
    <div className="home-loading" aria-hidden="true">
      <div className="home-shell home-loading__shell">
        <div className="home-intro">
          <div className="home-header">
            <i className="home-skeleton-block home-loading__kicker" />
            <div className="home-header-actions">
              <i className="home-skeleton-block home-loading__language" />
              <i className="home-skeleton-block home-loading__theme" />
            </div>
          </div>
          <div className="home-title-wrap home-loading__title">
            <i className="home-skeleton-block" />
            <i className="home-skeleton-block" />
          </div>
        </div>

        <div className="home-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="home-card" key={index}>
              <div className="home-card__media home-skeleton-block home-loading__card-media">
                <i className="home-skeleton-block home-loading__card-title" />
              </div>
              <div className="home-card__description home-loading__description">
                <i className="home-skeleton-block" />
                <i className="home-skeleton-block" />
              </div>
            </div>
          ))}
        </div>

        <div className="home-footer home-loading__footer">
          <i className="home-skeleton-block" />
          <i className="home-skeleton-block" />
        </div>
      </div>
    </div>
  );
}

function useHomeFontGate(locale: SiteContent['locale'], navigationCopy: string) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const fontRequests = getHomeFontRequests(locale, navigationCopy);

    if (!document.fonts || fontRequests.every(({ font, text }) => document.fonts.check(font, text))) {
      root.classList.remove('home-fonts-pending', 'home-skeleton-visible');
      return;
    }

    let cancelled = false;
    let skeletonShownAt: number | undefined;
    let revealFrame: number | undefined;
    let revealTimer: number | undefined;

    root.classList.add('home-fonts-pending');

    const skeletonTimer = window.setTimeout(() => {
      if (!cancelled) {
        skeletonShownAt = performance.now();
        root.classList.add('home-skeleton-visible');
      }
    }, skeletonDelayMs);

    void Promise.all(fontRequests.map(({ font, text }) => document.fonts.load(font, text))).finally(() => {
      if (cancelled) {
        return;
      }

      window.clearTimeout(skeletonTimer);
      const visibleFor = skeletonShownAt === undefined ? 0 : performance.now() - skeletonShownAt;
      const revealDelay = skeletonShownAt === undefined
        ? 0
        : Math.max(0, skeletonMinimumDurationMs - visibleFor);

      revealTimer = window.setTimeout(() => {
        revealFrame = window.requestAnimationFrame(() => {
          root.classList.remove('home-fonts-pending', 'home-skeleton-visible');
        });
      }, revealDelay);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(skeletonTimer);
      if (revealTimer !== undefined) window.clearTimeout(revealTimer);
      if (revealFrame !== undefined) window.cancelAnimationFrame(revealFrame);
      root.classList.remove('home-fonts-pending', 'home-skeleton-visible');
    };
  }, [locale, navigationCopy]);
}

function getHomeFontRequests(locale: SiteContent['locale'], navigationCopy: string) {
  const localeGlyphs = locale === 'pl' ? 'AaĄąĆćĘęŁłŃńÓóŚśŹźŻż' : 'Aa';

  return [
    { font: '400 1em "Home DM Sans"', text: localeGlyphs },
    { font: '700 1em "Home DM Sans"', text: localeGlyphs },
    { font: '800 1em "Home Montserrat"', text: 'Wojciech Wolanski' },
    { font: '400 1em "Home Bebas Neue"', text: navigationCopy },
    { font: '400 1em "Home Roboto Condensed"', text: navigationCopy },
  ] as const;
}
