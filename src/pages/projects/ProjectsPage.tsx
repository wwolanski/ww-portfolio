import { ArrowUpRight } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { projects } from '../../content/portfolio';

export function ProjectsPage() {
  return (
    <DetailPageLayout
      page="projects"
      eyebrow="Selected work · 02"
      title={<>Built to make<br />a difference.</>}
      intro="A selection of products shaped from first sketch to production. Each one balances user needs, technical constraints, and measurable outcomes."
    >
      <section className="content-section projects-section">
        <SectionHeading index="01" title="Featured projects" text="Full-stack work across product, platform, and applied AI." />
        <div className="project-list">
          {projects.map((project, index) => (
            <article key={project.title} className="project-row">
              <div className="project-meta">
                <span>0{index + 1}</span>
                <span>{project.category}</span>
              </div>
              <div className="project-body">
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  <a href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
                <p>{project.summary}</p>
                <ul aria-label={`${project.title} technologies`}>
                  {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                <strong>{project.metric}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section project-note">
        <p>Good software is a sequence of good decisions.</p>
        <span>Every case study can be discussed in detail during an interview — including constraints, rejected approaches, and lessons learned.</span>
      </section>
    </DetailPageLayout>
  );
}
