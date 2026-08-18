import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import { getNavigationItem, type PageSlug } from '../../content/navigation';
import type { SiteContent } from '../../content/siteContent';
import { SiteNav } from './SiteNav';

import aboutImage from '../../../img/detail-about.webp';
import projectsImage from '../../../img/detail-projects.webp';
import skillsImage from '../../../img/detail-skills.webp';

type DetailPageLayoutProps = {
  readonly site: SiteContent;
  readonly page: PageSlug;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly intro: ReactNode;
  readonly children: ReactNode;
};

export function DetailPageLayout({ site, page, eyebrow, title, intro, children }: DetailPageLayoutProps) {
  const item = getNavigationItem(site.navigation, page);
  const visual = getVisualMeta(page, site.locale);

  return (
    <div className="detail-page" style={{ '--page-accent': item.accent } as React.CSSProperties}>
      <aside className="visual-panel" data-page={page} aria-label={site.messages.common.artwork(item.label)}>
        <div className="visual-panel__grid" aria-hidden="true" />
        {visual.image ? <img src={visual.image} alt="" width="768" height="768" /> : <BlogVisual />}
        <Link to={`/${site.locale}`} className="back-link">
          <ArrowLeft aria-hidden="true" /> {site.messages.common.backHome}
        </Link>
        <div className="visual-panel__caption" aria-hidden="true">
          <div>
            <small>{visual.kicker}</small>
            <strong>{visual.title}</strong>
          </div>
          <b>{visual.index}</b>
        </div>
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
      </div>
    </div>
  );
}

type VisualMeta = {
  readonly image: string | undefined;
  readonly kicker: string;
  readonly title: string;
  readonly index: string;
};

function getVisualMeta(page: PageSlug, locale: SiteContent['locale']): VisualMeta {
  const copy = locale === 'pl'
    ? {
        about: { kicker: 'software · product · AI', title: 'Problem → system' },
        projects: { kicker: 'projekty i eksperymenty', title: 'Build → verify' },
        skills: { kicker: 'narzędzia i praktyki', title: 'Tools → decisions' },
        blog: { kicker: 'notatki i idee', title: 'Think → share' },
      }
    : {
        about: { kicker: 'software · product · AI', title: 'Problem → system' },
        projects: { kicker: 'projects and experiments', title: 'Build → verify' },
        skills: { kicker: 'tools and practices', title: 'Tools → decisions' },
        blog: { kicker: 'notes and ideas', title: 'Think → share' },
      };
  const images: Partial<Record<PageSlug, string>> = {
    about: aboutImage,
    projects: projectsImage,
    skills: skillsImage,
  };
  const indexes: Record<PageSlug, string> = { about: '01', projects: '02', skills: '03', blog: '04' };

  return { ...copy[page], image: images[page], index: indexes[page] };
}

function BlogVisual() {
  return (
    <div className="visual-panel__blog-shapes">
      <div className="project-visual-stack">
        <div className="pv-card">
          <div className="pv-head">ARCHITECTURE</div>
          <div className="pv-status">new note</div>
          <div className="pv-lines"><i /><i /><i /></div>
          <div className="pv-metric">08 MIN</div>
        </div>
        <div className="pv-card">
          <div className="pv-head">AI WORKFLOW</div>
          <div className="pv-status">field note</div>
          <div className="pv-lines"><i /><i /><i /></div>
          <div className="pv-metric">09 MIN</div>
        </div>
        <div className="pv-card">
          <div className="pv-head">SYSTEMS</div>
          <div className="pv-status">in progress</div>
          <div className="pv-lines"><i /><i /><i /></div>
          <div className="pv-metric">06 MIN</div>
        </div>
      </div>
    </div>
  );
}
