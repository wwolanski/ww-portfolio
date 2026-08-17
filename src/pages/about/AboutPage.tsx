import type { ReactNode } from 'react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { FooterCta, Statement } from '../../components/ui/ClosingSections';
import { InlineCopy } from '../../components/ui/InlineCopy';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { SiteContent } from '../../content/siteContent';

type AboutPageProps = { readonly site: SiteContent };

export function AboutPage({ site }: AboutPageProps) {
  const { about } = site.portfolio;

  return (
    <DetailPageLayout
      site={site}
      page="about"
      eyebrow={about.hero.eyebrow}
      title={<PageTitle lines={about.hero.title} />}
      intro={<InlineCopy copy={about.hero.lead} />}
    >
      {about.hero.tags.length > 0 && (
        <div className="prototype-hero-meta">
          {about.hero.tags.map((tag) => <span key={tag} className={tag === about.hero.accentTag ? 'prototype-tag is-accent' : 'prototype-tag'}>{tag}</span>)}
        </div>
      )}

      <section className="content-section prototype-section">
        <SectionHeading index="01" title={about.story.heading} text={about.story.intro} />
        <div className="prototype-about-grid">
          <div><h3>{about.story.lead}</h3></div>
          <div>
            {about.story.paragraphs.map((paragraph, index) => <p key={`${paragraph.before}-${index}`}><InlineCopy copy={paragraph} /></p>)}
            <p className="prototype-micro">{about.story.micro}</p>
          </div>
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="02" title={about.principles.heading} text={about.principles.intro} />
        <div className="principles-grid prototype-principles-grid">
          {about.principles.items.map((principle, index) => (
            <article key={principle.title}>
              <span className="principle-number">0{index + 1}</span>
              <div className="prototype-principle-icon">{principle.icon}</div>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="03" title={about.workflow.heading} text={about.workflow.intro} />
        <div className="prototype-flow">
          {about.workflow.steps.map((step) => (
            <div className="prototype-flow-step" key={step.index}>
              <b>{step.index}</b><strong>{step.title}</strong><span>{step.text}</span>
            </div>
          ))}
        </div>
        <div className="prototype-process-case">
          <div className="prototype-process-head">
            <div className="prototype-process-label">{about.workflow.example.label}</div>
            <div><h3>{about.workflow.example.title}</h3><p>{about.workflow.example.text}</p></div>
          </div>
          <div className="prototype-process-grid">
            {about.workflow.example.steps.map((step) => (
              <div className="prototype-process-step" key={step.index}>
                <b>{step.index}</b><strong>{step.title}</strong><span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="04" title={about.timeline.heading} text={about.timeline.intro} />
        <div className="prototype-timeline">
          {about.timeline.items.map((item) => (
            <article className="prototype-timeline-item" key={item.date}>
              <span className="prototype-date">{item.date}</span><h3>{item.title}</h3><p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Statement content={about.statement} />
      <FooterCta site={site} content={about.cta} />
    </DetailPageLayout>
  );
}

function PageTitle({ lines }: { readonly lines: readonly string[] }): ReactNode {
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < lines.length - 1 && <br />}</span>)}</>;
}
