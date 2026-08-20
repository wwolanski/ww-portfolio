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
import workflowProblemIcon from '../../../img/icons/workflow-problem.svg';
import workflowResearchIcon from '../../../img/icons/workflow-research.svg';
import workflowSystemIcon from '../../../img/icons/workflow-system.svg';

import './AboutPage.css';

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
      <div className="about-page">
        <section className="content-section prototype-section about-section about-section--timeline">
          <SectionHeading index="01" title={about.timeline.heading} text={about.timeline.intro} />
          <div className="prototype-timeline timeline-enhanced">
            {about.timeline.items.map((item, index) => (
              <article className="prototype-timeline-item timeline-item-enhanced" key={item.date}>
                <div className="timeline-thumb"><img src={getIndexedAsset(timelineImages, index)} alt="" loading="lazy" /></div>
                <div className="timeline-copy"><span className="prototype-date"><InlineCopy copy={item.date} /></span><h3><InlineCopy copy={item.title} /></h3><p><InlineCopy copy={item.text} /></p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section prototype-section about-section about-section--workflow">
          <SectionHeading index="03" title={about.workflow.heading} text={about.workflow.intro} />
          <div className="ai-workflow-shell">
            <div className="ai-workflow">
              {about.workflow.steps.map((step, index) => (
                <article className="ai-step" key={step.index}>
                  <div className="ai-orb"><img src={getIndexedAsset(workflowIcons, index)} alt="" /></div>
                  <b>{step.index}</b>
                  <h3><InlineCopy copy={step.title} /></h3>
                  <p><InlineCopy copy={step.text} /></p>
                </article>
              ))}
            </div>
          </div>
          <div className="prototype-process-case process-case-with-media">
            <div className="prototype-process-head">
              <div className="prototype-process-label">{about.workflow.example.label}</div>
              <div><h3><InlineCopy copy={about.workflow.example.title} /></h3><p><InlineCopy copy={about.workflow.example.text} /></p></div>
            </div>
            <div className="process-visual" aria-hidden="true">
              <img src={aboutProcessImage} alt="" loading="lazy" />
              <div className="process-visual-label">Wizualny szkic kierunku portfolio</div>
            </div>
            <div className="prototype-process-grid">
              {about.workflow.example.steps.map((step) => (
                <div className="prototype-process-step" key={step.index}>
                  <b>{step.index}</b><strong><InlineCopy copy={step.title} /></strong><span><InlineCopy copy={step.text} /></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Statement content={about.statement} />
        <FooterCta site={site} content={about.cta} />
      </div>
    </DetailPageLayout>
  );
}

function PageTitle({ lines }: { readonly lines: readonly string[] }): ReactNode {
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}><InlineCopy copy={line} />{index < lines.length - 1 && <br />}</span>)}</>;
}

const workflowIcons = [
  workflowProblemIcon,
  workflowResearchIcon,
  workflowSystemIcon,
  workflowImplementationIcon,
  workflowFeedbackIcon,
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
