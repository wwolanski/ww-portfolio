import { ArrowUpRight } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { SiteContent } from '../../content/siteContent';

type ProjectsPageProps = { readonly site: SiteContent };

export function ProjectsPage({ site }: ProjectsPageProps) {
  const { projects: content } = site.portfolio;
  const [titleLineOne, titleLineTwo] = content.title;

  return (
    <DetailPageLayout
      site={site}
      page="projects"
      eyebrow={content.eyebrow}
      title={<>{titleLineOne}<br />{titleLineTwo}</>}
      intro={content.intro}
    >
      <section className="content-section projects-section">
        <SectionHeading index="01" title={content.sectionHeading} text={content.sectionIntro} />
        <div className="project-list">
          {content.projects.map((project, index) => (
            <article key={project.title} className="project-row">
              <div className="project-meta">
                <span>0{index + 1}</span>
                <span>{project.category}</span>
              </div>
              <div className="project-body">
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  <a href={project.href} target="_blank" rel="noreferrer" aria-label={site.messages.projects.github(project.title)}>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
                <p>{project.summary}</p>
                <ul aria-label={site.messages.projects.technologies(project.title)}>
                  {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                <strong>{project.metric}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section project-note">
        <p>{content.noteLead}</p>
        <span>{content.noteText}</span>
      </section>
    </DetailPageLayout>
  );
}
