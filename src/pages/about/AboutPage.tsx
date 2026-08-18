import type { ReactNode } from 'react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { FooterCta, Statement } from '../../components/ui/ClosingSections';
import { InlineCopy } from '../../components/ui/InlineCopy';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { SiteContent } from '../../content/siteContent';

import aboutProcessImage from '../../../img/about-process.webp';
import timelineAiImage from '../../../img/timeline-ai.webp';
import timelineAudioImage from '../../../img/timeline-audio.webp';
import timelineEarlyWebImage from '../../../img/timeline-early-web.webp';
import timelineRetailImage from '../../../img/timeline-retail.webp';
import workflowFeedbackIcon from '../../../img/icons/workflow-feedback.svg';
import workflowImplementationIcon from '../../../img/icons/workflow-implementation.svg';
import workflowIterationIcon from '../../../img/icons/workflow-iteration.svg';
import workflowProblemIcon from '../../../img/icons/workflow-problem.svg';
import workflowResearchIcon from '../../../img/icons/workflow-research.svg';
import workflowSystemIcon from '../../../img/icons/workflow-system.svg';

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
        <div className="ai-workflow-shell">
          <div className="ai-workflow">
            {about.workflow.steps.map((step, index) => (
              <article className="ai-step" key={step.index}>
                <div className="ai-orb"><img src={getIndexedAsset(workflowIcons, index)} alt="" /></div>
                <b>{step.index}</b>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="prototype-process-case process-case-with-media">
          <div className="prototype-process-head">
            <div className="prototype-process-label">{about.workflow.example.label}</div>
            <div><h3>{about.workflow.example.title}</h3><p>{about.workflow.example.text}</p></div>
          </div>
          <div className="process-visual" aria-hidden="true">
            <img src={aboutProcessImage} alt="" loading="lazy" />
            <div className="process-visual-label">Wizualny szkic kierunku portfolio</div>
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
        <div className="prototype-timeline timeline-enhanced">
          {about.timeline.items.map((item, index) => (
            <article className="prototype-timeline-item timeline-item-enhanced" key={item.date}>
              <div className="timeline-thumb"><img src={getIndexedAsset(timelineImages, index)} alt="" loading="lazy" /></div>
              <div className="timeline-copy"><span className="prototype-date">{item.date}</span><h3>{item.title}</h3><p>{item.text}</p></div>
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

const workflowIcons = [
  workflowProblemIcon,
  workflowResearchIcon,
  workflowSystemIcon,
  workflowImplementationIcon,
  workflowFeedbackIcon,
  workflowIterationIcon,
] as const;

const timelineImages = [
  timelineEarlyWebImage,
  timelineAudioImage,
  timelineRetailImage,
  timelineAiImage,
] as const;

function getIndexedAsset(assets: readonly string[], index: number): string {
  return assets[index] ?? assets[0] ?? '';
}
