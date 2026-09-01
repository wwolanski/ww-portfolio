import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion, useIsPresent, type MotionStyle } from 'motion/react';
import { Link, useLocation, useOutlet } from 'react-router';

import { getNavigationItem, type PageSlug } from '../../content/navigation';
import { getPathWithoutLocale } from '../../routing/locale';
import type { SiteContent } from '../../content/siteContent';
import type { VisualPanelCard } from '../../content/types';
import { InlineCopy } from '../ui/InlineCopy';
import { SiteNav } from './SiteNav';
import { scrollToTop } from './scrollToTop';
import { areCriticalFontsReady, loadCriticalFonts } from '../../styles/criticalFonts';

import aboutImage from '../../../img/detail-about.webp';
import projectsImage from '../../../img/detail-projects.webp';
import skillsImage from '../../../img/detail-skills.webp';

const routeTransition = {
  duration: 0.25,
  ease: [0.2, 0.8, 0.2, 1] as const,
};

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

type DetailPageRouteProps = {
  readonly site: SiteContent;
};

export function DetailPageRoute({ site }: DetailPageRouteProps) {
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
      routeKey={getPathWithoutLocale(location.pathname)}
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
  routeKey = page,
  children,
}: DetailPageLayoutProps) {
  const item = getNavigationItem(site.navigation, page);
  const criticalFontsReady = useCriticalFontsReady();

  return (
    <div className={`detail-page detail-page--${page}`} style={{ '--page-accent': item.accent } as CSSProperties}>
      <aside className="visual-panel" data-page={page} aria-label={site.messages.common.artwork(item.label)}>
        <AnimatePresence mode="wait">
          <VisualPanelLayer key={routeKey} site={site} page={page} />
        </AnimatePresence>
      </aside>

      <div className={`detail-content${criticalFontsReady ? '' : ' detail-content--fonts-pending'}`}>
        <SiteNav site={site} compact />
        <main id="main-content" className={showHero ? undefined : 'detail-main--document'}>
          <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
            {criticalFontsReady ? (
              <DetailMainLayer
                key={routeKey}
                site={site}
                page={page}
                eyebrow={eyebrow}
                title={title}
                intro={intro}
                showHero={showHero}
                children={children}
              />
            ) : null}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function useCriticalFontsReady() {
  const [ready, setReady] = useState(areCriticalFontsReady);

  useEffect(() => {
    if (ready) {
      return undefined;
    }

    let isMounted = true;
    void loadCriticalFonts().then(() => {
      if (isMounted) {
        setReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [ready]);

  return ready;
}

type DetailMainLayerProps = {
  readonly site: SiteContent;
  readonly page: PageSlug;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly intro: ReactNode;
  readonly showHero: boolean;
  readonly children: ReactNode;
};

function DetailMainLayer({ site, page, eyebrow, title, intro, showHero, children }: DetailMainLayerProps) {
  const isPresent = useIsPresent();
  const item = getNavigationItem(site.navigation, page);

  return (
    <motion.div
      className={`detail-main__route-layer detail-page--${page}${showHero ? '' : ' detail-main--document'}`}
      data-page={page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={routeTransition}
      style={{ '--page-accent': item.accent, pointerEvents: isPresent ? 'auto' : 'none' } as MotionStyle}
      aria-hidden={isPresent ? undefined : true}
    >
      {showHero ? (
        <header className="page-hero">
          <p className="page-eyebrow"><InlineCopy copy={eyebrow} /></p>
          <h1>{title}</h1>
          <p className="page-intro">{intro}</p>
        </header>
      ) : null}
      {children}
    </motion.div>
  );
}

type VisualPanelLayerProps = {
  readonly site: SiteContent;
  readonly page: PageSlug;
};

function VisualPanelLayer({ site, page }: VisualPanelLayerProps) {
  const isPresent = useIsPresent();
  const item = getNavigationItem(site.navigation, page);
  const visual = getVisualMeta(site, page);

  return (
    <motion.div
      className="visual-panel__route-layer"
      data-page={page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={routeTransition}
      style={{ '--page-accent': item.accent, pointerEvents: isPresent ? 'auto' : 'none' } as MotionStyle}
      aria-hidden={isPresent ? undefined : true}
    >
      <div className="visual-panel__grid" aria-hidden="true" />
      {visual.image ? <img src={visual.image} alt="" width="768" height="768" /> : <BlogVisual cards={site.portfolio.blog.visualPanel.cards} />}
      <Link to={`/${site.locale}`} className="back-link" tabIndex={isPresent ? undefined : -1}>
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
    </motion.div>
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

function getVisualMeta(site: SiteContent, page: PageSlug): VisualMeta {
  const images: Partial<Record<PageSlug, string>> = {
    about: aboutImage,
    projects: projectsImage,
    skills: skillsImage,
  };
  const indexes: Record<PageSlug, string> = { about: '01', projects: '02', skills: '03', blog: '04' };

  return { ...site.portfolio[page].visualPanel, image: images[page], index: indexes[page] };
}

function BlogVisual({ cards }: { readonly cards: readonly VisualPanelCard[] }) {
  return (
    <div className="visual-panel__blog-shapes">
      <div className="blog-visual-card-stack">
        {cards.map((card, index) => (
          <div className="blog-visual-card" key={index}>
            <div className="blog-visual-card__heading">{card.heading}</div>
            <div className="blog-visual-card__status">{card.status}</div>
            <div className="blog-visual-card__lines"><i /><i /><i /></div>
            <div className="blog-visual-card__metric">{card.metric}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
