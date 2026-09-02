import { ChevronDown } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

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

type AboutPageProps = { readonly site: SiteContent };

export function AboutPageContent({ site }: AboutPageProps) {
  const { messages } = site;
  const { about } = site.portfolio;
  const [isProcessExpanded, setIsProcessExpanded] = useState(false);
  const [processGridHeight, setProcessGridHeight] = useState(0);
  const processGridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const processGrid = processGridRef.current;

    if (!processGrid) {
      return;
    }

    const updateProcessGridHeight = () => {
      if (processGrid.scrollHeight > 0) {
        setProcessGridHeight(processGrid.scrollHeight);
      }
    };

    updateProcessGridHeight();
    window.addEventListener('resize', updateProcessGridHeight);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateProcessGridHeight);

    resizeObserver?.observe(processGrid);

    return () => {
      window.removeEventListener('resize', updateProcessGridHeight);
      resizeObserver?.disconnect();
    };
  }, []);

  const processGridStyle = processGridHeight > 0
    ? { '--process-grid-height': `${processGridHeight}px` } as CSSProperties
    : undefined;
  const processToggleLabel = isProcessExpanded
    ? messages.content.collapseProcess
    : messages.content.expandProcess;

  return (
    <div className="about-page">
        <section className="content-section about-section about-section--timeline">
          <SectionHeading index="01" title={about.timeline.heading} text={about.timeline.intro} />
          <div className="about-timeline">
            {about.timeline.items.map((item, index) => (
              <article className="about-timeline__item" key={item.date}>
                <div className="about-timeline__thumb"><img src={getIndexedAsset(timelineImages, index)} alt="" loading="lazy" /></div>
                <div className="about-timeline__copy"><span className="about-timeline__date"><InlineCopy copy={item.date} /></span><h3><InlineCopy copy={item.title} /></h3><p><InlineCopy copy={item.text} /></p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section about-section about-section--workflow">
          <SectionHeading index="02" title={about.workflow.heading} text={about.workflow.intro} />
          <div className="about-workflow">
            <div className="about-workflow__steps">
              {about.workflow.steps.map((step, index) => (
                <article className="about-workflow__step" key={step.index}>
                  <div className="about-workflow__orb"><img src={getIndexedAsset(workflowIcons, index)} alt="" /></div>
                  <b>{step.index}</b>
                  <h3><InlineCopy copy={step.title} /></h3>
                  <p><InlineCopy copy={step.text} /></p>
                </article>
              ))}
            </div>
          </div>
          <div className="about-process">
            <div className="about-process__head">
              <div className="about-process__label">{about.workflow.example.label}</div>
              <div><h3><InlineCopy copy={about.workflow.example.title} /></h3><p><InlineCopy copy={about.workflow.example.text} /></p></div>
            </div>
            <div className="about-process__visual" aria-hidden="true">
              <img src={aboutProcessImage} alt="" loading="lazy" />
              <div className="about-process__visual-label">
                {site.locale === 'pl' ? 'Wizualny szkic kierunku portfolio' : ''}
              </div>
            </div>
            <div className={`about-process__grid-reveal${isProcessExpanded ? ' is-expanded' : ''}`}>
              <div
                ref={processGridRef}
                id="about-process-steps"
                className="about-process__grid-viewport"
                aria-hidden={!isProcessExpanded}
                style={processGridStyle}
              >
                <div className="about-process__grid">
                  {about.workflow.example.steps.map((step) => (
                    <div className="about-process__step" key={step.index}>
                      <b>{step.index}</b><strong><InlineCopy copy={step.title} /></strong><span><InlineCopy copy={step.text} /></span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="about-process__toggle"
                aria-expanded={isProcessExpanded}
                aria-controls="about-process-steps"
                aria-label={processToggleLabel}
                onClick={() => setIsProcessExpanded((expanded) => !expanded)}
              >
                <ChevronDown aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <Statement content={about.statement} />
        <FooterCta site={site} content={about.cta} />
    </div>
  );
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
