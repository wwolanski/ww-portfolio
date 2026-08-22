import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useOutlet } from 'react-router';

import { getNavigationItem, type PageSlug } from '../../content/navigation';
import type { SiteContent } from '../../content/siteContent';
import { InlineCopy } from '../ui/InlineCopy';
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
  readonly showHero?: boolean;
  readonly routeKey?: string;
  readonly children: ReactNode;
};

type DetailSnapshot = {
  readonly routeKey: string;
  readonly site: SiteContent;
  readonly page: PageSlug;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly intro: ReactNode;
  readonly showHero: boolean;
  readonly children: ReactNode;
};

type DetailMainLayerProps = {
  readonly snapshot: DetailSnapshot;
  readonly variant: 'incoming' | 'outgoing' | 'static';
};

type VisualPanelLayerProps = {
  readonly snapshot: DetailSnapshot;
  readonly variant: 'incoming' | 'outgoing' | 'static';
};

const ROUTE_CROSSFADE_MS = 360;

export function DetailPageRoute({ site }: { readonly site: SiteContent }) {
  const location = useLocation();
  const outlet = useOutlet();
  const page = getDetailPage(location.pathname);
  const meta = getDetailPageMeta(site, page, location.search);

  return (
    <DetailPageLayout
      site={site}
      page={page}
      eyebrow={meta.eyebrow}
      title={meta.title}
      intro={meta.intro}
      showHero={meta.showHero}
      routeKey={`${site.locale}:${location.pathname}`}
      children={outlet}
    />
  );
}

export function DetailPageLayout({
  site,
  page,
  eyebrow,
  title,
  intro,
  showHero = true,
  routeKey = `${site.locale}:${page}`,
  children,
}: DetailPageLayoutProps) {
  const item = getNavigationItem(site.navigation, page);
  const snapshot = useMemo<DetailSnapshot>(() => ({
    routeKey,
    site,
    page,
    eyebrow,
    title,
    intro,
    showHero,
    children,
  }), [children, eyebrow, intro, page, routeKey, showHero, site, title]);
  const previousSnapshotRef = useRef<DetailSnapshot | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const [outgoingSnapshot, setOutgoingSnapshot] = useState<DetailSnapshot | null>(null);

  useLayoutEffect(() => {
    const previousSnapshot = previousSnapshotRef.current;

    if (previousSnapshot && previousSnapshot.routeKey !== snapshot.routeKey) {
      setOutgoingSnapshot(previousSnapshot);

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }

      transitionTimerRef.current = window.setTimeout(() => {
        setOutgoingSnapshot(null);
        transitionTimerRef.current = null;
      }, ROUTE_CROSSFADE_MS);
    }

    previousSnapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }
  }, []);

  return (
    <div className={`detail-page detail-page--${page} route-enter`} style={{ '--page-accent': item.accent } as CSSProperties}>
      <aside className="visual-panel" data-page={page} aria-label={site.messages.common.artwork(item.label)}>
        {outgoingSnapshot ? (
          <VisualPanelLayer key={`outgoing-${outgoingSnapshot.routeKey}`} snapshot={outgoingSnapshot} variant="outgoing" />
        ) : null}
        <VisualPanelLayer
          key={`incoming-${snapshot.routeKey}`}
          snapshot={snapshot}
          variant={outgoingSnapshot ? 'incoming' : 'static'}
        />
      </aside>

      <div className="detail-content">
        <SiteNav site={site} compact />
        <main id="main-content" className={showHero ? undefined : 'detail-main--document'}>
          <div className="detail-main__route-stack">
            {outgoingSnapshot ? (
              <DetailMainLayer key={`outgoing-${outgoingSnapshot.routeKey}`} snapshot={outgoingSnapshot} variant="outgoing" />
            ) : null}
            <DetailMainLayer
              key={`incoming-${snapshot.routeKey}`}
              snapshot={snapshot}
              variant={outgoingSnapshot ? 'incoming' : 'static'}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function DetailMainLayer({ snapshot, variant }: DetailMainLayerProps) {
  const item = getNavigationItem(snapshot.site.navigation, snapshot.page);

  return (
    <div
      className={`detail-main__route-layer detail-main__route-layer--${variant} detail-page--${snapshot.page}${snapshot.showHero ? '' : ' detail-main--document'}`}
      data-page={snapshot.page}
      style={{ '--page-accent': item.accent } as CSSProperties}
      aria-hidden={variant === 'outgoing' ? true : undefined}
    >
      {snapshot.showHero ? (
        <header className="page-hero">
          <p className="page-eyebrow"><InlineCopy copy={snapshot.eyebrow} /></p>
          <h1>{snapshot.title}</h1>
          <p className="page-intro">{snapshot.intro}</p>
        </header>
      ) : null}
      {snapshot.children}
    </div>
  );
}

function VisualPanelLayer({ snapshot, variant }: VisualPanelLayerProps) {
  const item = getNavigationItem(snapshot.site.navigation, snapshot.page);
  const visual = getVisualMeta(snapshot.page, snapshot.site.locale);

  return (
    <div
      className={`visual-panel__route-layer visual-panel__route-layer--${variant}`}
      data-page={snapshot.page}
      style={{ '--page-accent': item.accent } as CSSProperties}
      aria-hidden={variant === 'outgoing' ? true : undefined}
    >
      <div className="visual-panel__grid" aria-hidden="true" />
      {visual.image ? <img src={visual.image} alt="" width="768" height="768" /> : <BlogVisual />}
      <Link to={`/${snapshot.site.locale}`} className="back-link" tabIndex={variant === 'outgoing' ? -1 : undefined}>
        <ArrowLeft aria-hidden="true" /> {snapshot.site.messages.common.backHome}
      </Link>
      <div className="visual-panel__caption" aria-hidden="true">
        <div>
          <small>{visual.kicker}</small>
          <strong>{visual.title}</strong>
        </div>
        <b>{visual.index}</b>
      </div>
      <span className="panel-index">/{item.slug}</span>
    </div>
  );
}

function getDetailPage(pathname: string): PageSlug {
  const pageSegment = pathname.replace(/\/+$/, '').split('/').at(-1);

  return pageSegment === 'projects' || pageSegment === 'skills' || pageSegment === 'blog'
    ? pageSegment
    : 'about';
}

function getDetailPageMeta(site: SiteContent, page: PageSlug, search: string) {
  switch (page) {
    case 'about': {
      const content = site.portfolio.about;
      return {
        eyebrow: content.hero.eyebrow,
        title: <DetailPageTitle lines={content.hero.title} />,
        intro: <InlineCopy copy={content.hero.lead} />,
        showHero: true,
      };
    }
    case 'projects': {
      const content = site.portfolio.projects;
      return {
        eyebrow: content.hero.eyebrow,
        title: <DetailPageTitle lines={content.hero.title} />,
        intro: <InlineCopy copy={content.hero.lead} />,
        showHero: true,
      };
    }
    case 'skills':
      return { eyebrow: '', title: null, intro: null, showHero: false };
    case 'blog': {
      const content = site.portfolio.blog;
      const [titleLineOne, titleLineTwo] = content.title;

      return {
        eyebrow: content.eyebrow,
        title: <><InlineCopy copy={titleLineOne ?? ''} /><br /><InlineCopy copy={titleLineTwo ?? ''} /></>,
        intro: <InlineCopy copy={content.intro} />,
        showHero: !new URLSearchParams(search).get('article'),
      };
    }
  }
}

function DetailPageTitle({ lines }: { readonly lines: readonly string[] }): ReactNode {
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}><InlineCopy copy={line} />{index < lines.length - 1 && <br />}</span>)}</>;
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
      <div className="blog-visual-card-stack">
        <div className="blog-visual-card">
          <div className="blog-visual-card__heading">ARCHITECTURE</div>
          <div className="blog-visual-card__status">new note</div>
          <div className="blog-visual-card__lines"><i /><i /><i /></div>
          <div className="blog-visual-card__metric">08 MIN</div>
        </div>
        <div className="blog-visual-card">
          <div className="blog-visual-card__heading">AI WORKFLOW</div>
          <div className="blog-visual-card__status">field note</div>
          <div className="blog-visual-card__lines"><i /><i /><i /></div>
          <div className="blog-visual-card__metric">09 MIN</div>
        </div>
        <div className="blog-visual-card">
          <div className="blog-visual-card__heading">SYSTEMS</div>
          <div className="blog-visual-card__status">in progress</div>
          <div className="blog-visual-card__lines"><i /><i /><i /></div>
          <div className="blog-visual-card__metric">06 MIN</div>
        </div>
      </div>
    </div>
  );
}
