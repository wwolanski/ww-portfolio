import {
  ArrowDown, ArrowLeft, ArrowRight, Box, Check, Code2, Compass, Database, Flag, GitBranch,
  Layers3, Navigation, Network, Puzzle, TrendingUp, Wrench, X, type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import type { SiteContent } from '../../content/siteContent';
import type { SolutionBoundaryContent } from '../../content/types';

import './SkillsPage.css';

type SkillsPageProps = { readonly site: SiteContent };

const layerIcons = [Wrench, Check, Network, Database, Box] as const;
const principleIcons = [Puzzle, Layers3, Flag, TrendingUp] as const;

export function SkillsPage({ site }: SkillsPageProps) {
  const content = site.portfolio.skills.boundary;

  return (
    <DetailPageLayout site={site} page="skills" eyebrow="" title={null} intro={null} showHero={false}>
      <section className="solution-boundary" aria-labelledby="solution-boundary-title">
        <div className="solution-boundary__hero">
          <header className="solution-boundary__intro">
            <p className="solution-boundary__eyebrow">{content.eyebrow}</p>
            <h1 id="solution-boundary-title" aria-label={content.title.join(' ')}>
              {content.title.map((line) => <span key={line}>{line}{' '}</span>)}
            </h1>
            <span className="solution-boundary__accent" aria-hidden="true" />
            <p>{content.lead}</p>
          </header>
          <DecisionDiagram content={content.decision} />
        </div>

        <section className="solution-boundary__thinking" aria-labelledby="layers-heading">
          <MiniHeading id="layers-heading">{content.layersHeading}</MiniHeading>
          <div className="solution-boundary__thinking-grid">
            <div className="solution-boundary__layers">
              {content.layers.map((layer, index) => (
                <Layer key={layer.title} index={index} icon={layerIcons[index] ?? Box} {...layer} />
              ))}
            </div>
            <div className="solution-boundary__principles">
              {content.principles.map((principle, index) => (
                <Principle key={principle.title} index={index} icon={principleIcons[index] ?? Compass} {...principle} />
              ))}
            </div>
          </div>
        </section>

        <section className="solution-boundary__practice" aria-labelledby="practice-heading">
          <MiniHeading id="practice-heading">{content.practiceHeading}</MiniHeading>
          <div className="solution-boundary__practice-grid">
            {content.examples.map((example, index) => (
              <Link aria-label={example.title} className="solution-boundary__example" to={`/${site.locale}/projects${index === 1 ? '?caseStudy=repoatlas' : ''}`} key={example.title}>
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

        <BoundaryQuote content={content} />
      </section>
    </DetailPageLayout>
  );
}

function DecisionDiagram({ content }: { readonly content: SolutionBoundaryContent['decision'] }) {
  return (
    <div className="boundary-decision" aria-label={content.question}>
      <header className="boundary-decision__current">
        <Box aria-hidden="true" />
        <span><strong>{content.currentTitle}</strong><small>{content.currentText}</small></span>
      </header>
      <div className="boundary-decision__down" aria-hidden="true"><ArrowDown /></div>
      <div className="boundary-decision__question-row">
        <BranchLabel tone="yes" label={content.yes} />
        <strong className="boundary-decision__question">{content.question}</strong>
        <BranchLabel tone="no" label={content.no} />
      </div>
      <div className="boundary-decision__grid">
        <DecisionPath tone="yes" icon={Wrench} {...content.stay} />
        <div className="boundary-decision__core">
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

function BranchLabel({ tone, label }: { readonly tone: 'yes' | 'no'; readonly label: string }) {
  const StatusIcon = tone === 'yes' ? Check : X;
  return (
    <div className={`boundary-branch boundary-branch--${tone}`}>
      <span>{label}<StatusIcon className="boundary-branch__status" aria-hidden="true" /></span>
      <ArrowDown className="boundary-branch__arrow" aria-hidden="true" />
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

function Layer({ index, title, text, icon: Icon }: { readonly index: number; readonly title: string; readonly text: string; readonly icon: LucideIcon }) {
  return (
    <article className={`solution-boundary__layer solution-boundary__layer--${index + 1}`}>
      <span className="solution-boundary__layer-icon"><Icon aria-hidden="true" /></span>
      <b>{String(index + 1).padStart(2, '0')}</b>
      <span><strong>{title}</strong><small>{text}</small></span>
    </article>
  );
}

function Principle({ index, title, text, icon: Icon }: { readonly index: number; readonly title: string; readonly text: string; readonly icon: LucideIcon }) {
  return (
    <article className={`solution-boundary__principle solution-boundary__principle--${index + 1}`}>
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

function BoundaryQuote({ content }: { readonly content: SolutionBoundaryContent }) {
  const [before, after] = content.quote.split(content.quoteAccent);
  return (
    <blockquote className="solution-boundary__quote">
      <span aria-hidden="true">“</span>
      <p>{before}<strong>{content.quoteAccent}</strong>{after}</p>
      <i aria-hidden="true" />
    </blockquote>
  );
}
