import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import { getNavigationItem, type PageSlug } from '../../content/navigation';
import { SiteNav } from './SiteNav';

type DetailPageLayoutProps = {
  readonly page: PageSlug;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly intro: string;
  readonly children: ReactNode;
};

export function DetailPageLayout({ page, eyebrow, title, intro, children }: DetailPageLayoutProps) {
  const item = getNavigationItem(page);

  return (
    <div className="detail-page" style={{ '--page-accent': item.accent } as React.CSSProperties}>
      <aside className="visual-panel" data-page={page} aria-label={`${item.label} artwork`}>
        <img src={item.image} alt="" width="724" height="2172" />
        <Link to="/" className="back-link">
          <ArrowLeft aria-hidden="true" /> Home
        </Link>
        <span className="panel-index">/{item.slug}</span>
      </aside>

      <div className="detail-content">
        <SiteNav compact />
        <main id="main-content">
          <header className="page-hero">
            <p className="page-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="page-intro">{intro}</p>
          </header>
          {children}
        </main>

        <footer className="detail-footer">
          <div>
            <span>Have an interesting problem?</span>
            <strong>Let’s build something useful.</strong>
          </div>
          <a href="mailto:hello@wollanski.dev">
            Start a conversation <ArrowUpRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>
  );
}
