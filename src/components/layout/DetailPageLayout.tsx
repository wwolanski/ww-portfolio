import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import { getNavigationItem, type PageSlug } from '../../content/navigation';
import type { SiteContent } from '../../content/siteContent';
import { SiteNav } from './SiteNav';

type DetailPageLayoutProps = {
  readonly site: SiteContent;
  readonly page: PageSlug;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly intro: string;
  readonly children: ReactNode;
};

export function DetailPageLayout({ site, page, eyebrow, title, intro, children }: DetailPageLayoutProps) {
  const item = getNavigationItem(site.navigation, page);

  return (
    <div className="detail-page" style={{ '--page-accent': item.accent } as React.CSSProperties}>
      <aside className="visual-panel" data-page={page} aria-label={site.messages.common.artwork(item.label)}>
        <img src={item.image} alt="" width="724" height="2172" />
        <Link to={`/${site.locale}`} className="back-link">
          <ArrowLeft aria-hidden="true" /> {site.messages.common.backHome}
        </Link>
        <span className="panel-index">/{item.slug}</span>
      </aside>

      <div className="detail-content">
        <SiteNav site={site} compact />
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
            <span>{site.messages.common.footerQuestion}</span>
            <strong>{site.messages.common.footerTitle}</strong>
          </div>
          <a href="mailto:hello@wollanski.dev">
            {site.messages.common.startConversation} <ArrowUpRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>
  );
}
