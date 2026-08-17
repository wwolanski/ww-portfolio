import { ArrowUpRight } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { FooterCta, Statement } from '../../components/ui/ClosingSections';
import { InlineCopy } from '../../components/ui/InlineCopy';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { Project } from '../../content/types';
import type { SiteContent } from '../../content/siteContent';

type ProjectsPageProps = { readonly site: SiteContent };

export function ProjectsPage({ site }: ProjectsPageProps) {
  const { projects: content } = site.portfolio;

  return (
    <DetailPageLayout
      site={site}
      page="projects"
      eyebrow={content.hero.eyebrow}
      title={<PageTitle lines={content.hero.title} />}
      intro={<InlineCopy copy={content.hero.lead} />}
    >
      <section className="content-section prototype-section">
        <SectionHeading index="01" title={content.selected.heading} text={content.selected.intro} />
        <div className="project-list">
          {content.selected.projects.map((project) => <ProjectRow key={project.title} project={project} site={site} />)}
        </div>
        <div className="prototype-failure-box">
          <div><span className="prototype-mini-label">{content.selected.failure.label}</span><h3>{content.selected.failure.title}</h3></div>
          <div><p>{content.selected.failure.text}</p></div>
        </div>
      </section>

      <Statement content={content.statement} />
      <FooterCta site={site} content={content.cta} />
    </DetailPageLayout>
  );
}

type ProjectRowProps = {
  readonly project: Project;
  readonly site: SiteContent;
};

function ProjectRow({ project, site }: ProjectRowProps) {
  return (
    <article className="project-row prototype-project-row">
      <div className="project-meta">
        <span>{project.index}</span>
        <span>{project.category}</span>
        <span className="prototype-status">{project.status}</span>
      </div>
      <div className="project-body">
        <div className="project-title-row">
          <h3>{project.title}</h3>
          <a href={`#${project.anchor}`} aria-label={site.messages.common.projectDetails(project.title)}><ArrowUpRight aria-hidden="true" /></a>
        </div>
        <p>{project.description}</p>
        <ul>{project.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        <strong>{project.outcome}</strong>
        <div className="prototype-project-details" id={project.anchor}>
          {project.details.map((detail) => <div key={detail.label}><b>{detail.label}</b><span>{detail.text}</span></div>)}
        </div>
      </div>
    </article>
  );
}

function PageTitle({ lines }: { readonly lines: readonly string[] }) {
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < lines.length - 1 && <br />}</span>)}</>;
}
