import { useCallback, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { FooterCta, Statement } from '../../components/ui/ClosingSections';
import { InlineCopy } from '../../components/ui/InlineCopy';
import { ProjectModal } from '../../components/ui/ProjectModal';
import { ProjectBadge } from '../../components/ui/ProjectBadge';
import { getProjectLogo } from '../../content/projectLogos';
import type { Project } from '../../content/types';
import type { SiteContent } from '../../content/siteContent';
import { getLocalizedPath } from '../../routing/locale';

type ProjectsPageProps = { readonly site: SiteContent };

export function ProjectsPage({ site }: ProjectsPageProps) {
  const { projects: content } = site.portfolio;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const activeProjectSlug = searchParams.get('caseStudy');
  const activeProject = content.selected.projects.find((project) => project.slug === activeProjectSlug) ?? null;

  const openProject = useCallback((project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('caseStudy', project.slug);
      return next;
    });
  }, [setSearchParams]);

  const closeProject = useCallback(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('caseStudy');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const viewPolishVersion = useCallback((slug: string) => {
    void navigate(`${getLocalizedPath('pl', '/projects')}?caseStudy=${encodeURIComponent(slug)}`);
  }, [navigate]);

  return (
    <DetailPageLayout
      site={site}
      page="projects"
      eyebrow={content.hero.eyebrow}
      title={<PageTitle lines={content.hero.title} />}
      intro={<InlineCopy copy={content.hero.lead} />}
    >
      <section className="content-section">
        <div className="project-list">
          {content.selected.projects.map((project) => <ProjectRow key={project.slug} project={project} site={site} onOpen={openProject} />)}
        </div>
      </section>

      <Statement content={content.statement} />
      <FooterCta site={site} content={content.cta} />
      {activeProject && (
        <ProjectModal
          project={activeProject}
          locale={site.locale}
          messages={site.messages}
          triggerRef={triggerRef}
          onClose={closeProject}
          onViewPolish={() => viewPolishVersion(activeProject.caseStudySlug ?? activeProject.slug)}
        />
      )}
    </DetailPageLayout>
  );
}

type ProjectRowProps = {
  readonly project: Project;
  readonly site: SiteContent;
  readonly onOpen: (project: Project, trigger: HTMLButtonElement) => void;
};

function ProjectRow({ project, site, onOpen }: ProjectRowProps) {
  const contentLabel = site.messages.projectContent.caseStudy;
  const contentAriaLabel = site.messages.projectContent.openCaseStudy(project.title);
  const logo = getProjectLogo(project.slug);

  return (
    <article className="project-row" data-project-slug={project.slug}>
      <div className="project-meta">
        <span>{project.index}</span>
        <span>{project.category}</span>
        <div className="project-tags">
          {project.tags.map((tag) => <ProjectBadge key={tag} tag={tag} />)}
        </div>
        <ProjectLogo project={project} src={logo} />
      </div>
      <div className="project-body">
        <div className="project-title-row">
          <h3><InlineCopy copy={project.title} /></h3>
          <button
            type="button"
            className="project-content-button"
            aria-label={contentAriaLabel}
            onClick={(event) => onOpen(project, event.currentTarget)}
          >
            <span>{contentLabel}</span>
            <ArrowUpRight aria-hidden="true" />
          </button>
        </div>
        <p><InlineCopy copy={project.description} /></p>
        <ul>{project.facts.map((fact) => <li key={fact} className="tag-chip"><InlineCopy copy={fact} /></li>)}</ul>
        <strong><InlineCopy copy={project.outcome} /></strong>
        <div className="project-details" id={project.anchor}>
          {project.details.map((detail) => <div key={detail.label}><b><InlineCopy copy={detail.label} /></b><span><InlineCopy copy={detail.text} /></span></div>)}
        </div>
      </div>
    </article>
  );
}

type ProjectLogoProps = {
  readonly project: Project;
  readonly src: string | null;
};

function ProjectLogo({ project, src }: ProjectLogoProps) {
  return (
    <div
      className={`project-logo${src ? '' : ' project-logo--placeholder'}`}
      role="img"
      aria-label={`Project logo: ${project.title}`}
    >
      {src ? (
        <img src={src} alt="" loading="lazy" decoding="async" />
      ) : (
        <>
          <span className="project-logo__mark" aria-hidden="true">{getProjectMonogram(project.title)}</span>
          <small aria-hidden="true">logo</small>
        </>
      )}
    </div>
  );
}

function getProjectMonogram(title: string): string {
  return title
    .split(/[\s/-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

function PageTitle({ lines }: { readonly lines: readonly string[] }) {
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}><InlineCopy copy={line} />{index < lines.length - 1 && <br />}</span>)}</>;
}
