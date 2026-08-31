import {
  ArrowLeft, ArrowRight, Blocks, Box, Check, Code2, Compass, Copy, Database, GitBranch,
  GitBranchPlus, Layers3, Link2, ListTree, Maximize2, Navigation, Network, Wrench, type LucideIcon, X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { FooterCta } from '../../components/ui/ClosingSections';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { TechTag } from '../../components/ui/TechTag';
import type { SiteContent } from '../../content/siteContent';
import type { SolutionBoundaryContent } from '../../content/types';

type SkillsPageProps = { readonly site: SiteContent };

const layerIcons = [ListTree, Blocks, Network, Database] as const;
const principleIcons = [GitBranchPlus, Maximize2, Link2, Copy] as const;

export function SkillsPage({ site }: SkillsPageProps) {
  return (
    <DetailPageLayout site={site} page="skills" eyebrow="" title={null} intro={null} showHero={false}>
      <SkillsPageContent site={site} />
    </DetailPageLayout>
  );
}

export function SkillsPageContent({ site }: SkillsPageProps) {
  const content = site.portfolio.skills.boundary;
  const stack = site.portfolio.skills.stack;
  const [activePairIndex, setActivePairIndex] = useState<number | null>(null);
  const pairCount = Math.min(content.layers.length, content.principles.length);

  return (
    <>
      <section className="solution-boundary" aria-labelledby="solution-boundary-title">
        <div className="solution-boundary__hero">
          <header className="solution-boundary__intro">
            <p className="page-eyebrow">{content.eyebrow}</p>
            <h1 id="solution-boundary-title" aria-label={content.title.join(' ')}>
              {content.title.map((line) => <span key={line}>{line}{' '}</span>)}
            </h1>
            <span className="solution-boundary__accent" aria-hidden="true" />
            <p>{content.lead}</p>
          </header>
          <div className="solution-boundary__diagram">
            <DecisionDiagram content={content.decision} />
          </div>
        </div>

        <section className="solution-boundary__thinking" aria-labelledby="layers-heading">
          <MiniHeading id="layers-heading">{content.layersHeading}</MiniHeading>
          <div
            className="solution-boundary__thinking-grid"
            onMouseLeave={() => setActivePairIndex(null)}
            onBlur={(event) => {
              const nextTarget = event.relatedTarget;

              if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                setActivePairIndex(null);
              }
            }}
          >
            <div className="solution-boundary__layers">
              {content.layers.slice(0, pairCount).map((layer, index) => (
                <Layer
                  key={layer.title}
                  index={index}
                  icon={layerIcons[index] ?? Box}
                  isActive={activePairIndex === index}
                  isMuted={activePairIndex !== null && activePairIndex !== index}
                  onActivate={() => setActivePairIndex(index)}
                  {...layer}
                />
              ))}
            </div>
            <div className="solution-boundary__principles">
              {content.principles.slice(0, pairCount).map((principle, index) => (
                <Principle
                  key={principle.title}
                  index={index}
                  icon={principleIcons[index] ?? Compass}
                  isActive={activePairIndex === index}
                  isMuted={activePairIndex !== null && activePairIndex !== index}
                  onActivate={() => setActivePairIndex(index)}
                  {...principle}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="solution-boundary__practice" aria-labelledby="practice-heading">
          <MiniHeading id="practice-heading">{content.practiceHeading}</MiniHeading>
          <div className="solution-boundary__practice-grid">
            {content.examples.map((example, index) => (
              <Link
                aria-label={example.title}
                className="solution-boundary__example"
                to={`/${site.locale}/projects${index === 0 ? '?caseStudy=gpt_img_2-spritesheet-processor' : '?caseStudy=repoatlas'}`}
                key={example.title}
              >
                <span className="solution-boundary__example-icon" aria-hidden="true">
                  {index === 0 ? <Code2 /> : <GitBranch />}
                </span>
                <span><strong>{example.title}</strong><small>{example.label}</small></span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
            <aside className="solution-boundary__music-note">
              <span aria-hidden="true"><MusicGlyph /></span>
              <p>{content.musicNote}</p>
            </aside>
          </div>
        </section>

      </section>

      <section className="content-section">
        <SectionHeading index="01" title={stack.heading} text={stack.intro} />
        <div className="skills-tools">
          {stack.bands.map((band) => (
            <div className="skills-tools__group" key={band.title}>
              <strong>{band.title}</strong>
              <div>{band.tools.map((tool) => <TechTag key={tool} name={tool} variant="badge" />)}</div>
            </div>
          ))}
        </div>
      </section>

      <FooterCta site={site} content={site.portfolio.skills.cta} />
    </>
  );
}

function DecisionDiagram({ content }: { readonly content: SolutionBoundaryContent['decision'] }) {
  return (
    <div className="boundary-decision" aria-label={content.question}>
      <header className="boundary-decision__current">
        <Box aria-hidden="true" />
        <span><strong>{content.currentTitle}</strong><small>{content.currentText}</small></span>
      </header>
      <div className="boundary-decision__down" aria-hidden="true"><ConnectorArrow /></div>
      <div className="boundary-decision__question-row">
        <BranchLabel tone="yes" label={content.yes} />
        <strong className="boundary-decision__question">{content.question}</strong>
        <BranchLabel tone="no" label={content.no} />
      </div>
      <MobileBranchConnectors yes={content.yes} no={content.no} />
      <div className="boundary-decision__grid">
        <DecisionPath tone="yes" icon={Wrench} {...content.stay} />
        <div className="boundary-decision__core">
          <ConnectorArrow className="boundary-decision__core-down" />
          <ArrowRight className="boundary-decision__core-arrow boundary-decision__core-arrow--left" aria-hidden="true" />
          <Navigation className="boundary-decision__core-icon" aria-hidden="true" />
          <span>{content.center}</span>
          <ArrowLeft className="boundary-decision__core-arrow boundary-decision__core-arrow--right" aria-hidden="true" />
        </div>
        <DecisionPath tone="no" icon={Layers3} {...content.rise} />
      </div>
    </div>
  );
}

function MobileBranchConnectors({ yes, no }: { readonly yes: string; readonly no: string }) {
  return (
    <div className="boundary-mobile-connectors" aria-hidden="true">
      <svg viewBox="0 0 100 19" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="mobile-arrow-yes" viewBox="0 0 4 4" refX="3.4" refY="2" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0 0 4 2 0 4Z" className="boundary-mobile-connectors__yes-fill" />
          </marker>
          <marker id="mobile-arrow-no" viewBox="0 0 4 4" refX="3.4" refY="2" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0 0 4 2 0 4Z" className="boundary-mobile-connectors__no-fill" />
          </marker>
        </defs>
        <path className="boundary-mobile-connectors__yes-line" d="M44 0 24.25 18" markerEnd="url(#mobile-arrow-yes)" />
        <path className="boundary-mobile-connectors__no-line" d="M56 0 75.75 18" markerEnd="url(#mobile-arrow-no)" />
      </svg>
      <span className="boundary-mobile-connectors__node boundary-mobile-connectors__node--yes">
        <b>{yes}</b><Check />
      </span>
      <span className="boundary-mobile-connectors__node boundary-mobile-connectors__node--no">
        <b>{no}</b><X />
      </span>
    </div>
  );
}

function BranchLabel({ tone, label }: { readonly tone: 'yes' | 'no'; readonly label: string }) {
  const StatusIcon = tone === 'yes' ? Check : X;
  return (
    <div className={`boundary-branch boundary-branch--${tone}`}>
      <span className="boundary-branch__label">{label}</span>
      <StatusIcon className="boundary-branch__status" aria-hidden="true" />
      <ConnectorArrow className="boundary-branch__arrow" />
    </div>
  );
}

type DecisionPathProps = SolutionBoundaryContent['decision']['stay'] & {
  readonly icon: LucideIcon;
  readonly tone: 'yes' | 'no';
};

function DecisionPath({ title, text, meta, icon: Icon, tone }: DecisionPathProps) {
  return (
    <div className={`boundary-path boundary-path--${tone}`}>
      <article>
        <h2><Icon aria-hidden="true" />{title}</h2>
        <p>{text}</p><small>{meta}</small>
      </article>
    </div>
  );
}

function MiniHeading({ id, children }: { readonly id: string; readonly children: string }) {
  return <h2 className="solution-boundary__mini-heading" id={id}>{children}<ArrowRight aria-hidden="true" /></h2>;
}

type PairHighlightProps = {
  readonly isActive: boolean;
  readonly isMuted: boolean;
  readonly onActivate: () => void;
};

type LayerProps = PairHighlightProps & {
  readonly index: number;
  readonly title: string;
  readonly text: string;
  readonly icon: LucideIcon;
};

function Layer({ index, title, text, icon: Icon, isActive, isMuted, onActivate }: LayerProps) {
  return (
    <button
      type="button"
      className={`solution-boundary__layer solution-boundary__layer--${index + 1}${isActive ? ' is-active' : ''}${isMuted ? ' is-muted' : ''}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <span className="solution-boundary__layer-icon"><Icon aria-hidden="true" /></span>
      <b>{String(index + 1).padStart(2, '0')}</b>
      <span><strong>{title}</strong><small>{text}</small></span>
    </button>
  );
}

type PrincipleProps = PairHighlightProps & {
  readonly index: number;
  readonly title: string;
  readonly text: string;
  readonly icon: LucideIcon;
};

function Principle({ index, title, text, icon: Icon, isActive, isMuted, onActivate }: PrincipleProps) {
  return (
    <article
      className={`solution-boundary__principle solution-boundary__principle--${index + 1}${isActive ? ' is-active' : ''}${isMuted ? ' is-muted' : ''}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      tabIndex={0}
    >
      <b>{String(index + 1).padStart(2, '0')}</b>
      <span className="solution-boundary__principle-icon"><Icon aria-hidden="true" /></span>
      <h3>{title}</h3><p>{text}</p>
    </article>
  );
}

function MusicGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}

function ConnectorArrow({ className = '' }: { readonly className?: string }) {
  return (
    <svg className={`boundary-connector-arrow ${className}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 0v13M2.5 7.5 8 13l5.5-5.5" />
    </svg>
  );
}
