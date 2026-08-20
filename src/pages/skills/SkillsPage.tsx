import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { FooterCta, Statement } from '../../components/ui/ClosingSections';
import { InlineCopy } from '../../components/ui/InlineCopy';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { TechTag } from '../../components/ui/TechTag';
import type { SiteContent } from '../../content/siteContent';

import architectureImage from '../../../img/architecture-repo.webp';
import skillsDeliveryIcon from '../../../img/icons/skills-delivery.svg';
import skillsDesignIcon from '../../../img/icons/skills-design.svg';
import softCommunicationIcon from '../../../img/icons/soft-communication.svg';
import softIndependenceIcon from '../../../img/icons/soft-independence.svg';
import softLearningIcon from '../../../img/icons/soft-learning.svg';
import softResponsibilityIcon from '../../../img/icons/soft-responsibility.svg';
import softTeamworkIcon from '../../../img/icons/soft-teamwork.svg';
import workflowImplementationIcon from '../../../img/icons/workflow-implementation.svg';
import workflowProblemIcon from '../../../img/icons/workflow-problem.svg';

type SkillsPageProps = { readonly site: SiteContent };

export function SkillsPage({ site }: SkillsPageProps) {
  const { skills: content } = site.portfolio;

  return (
    <DetailPageLayout
      site={site}
      page="skills"
      eyebrow={content.hero.eyebrow}
      title={<PageTitle lines={content.hero.title} />}
      intro={<InlineCopy copy={content.hero.lead} />}
    >
      <section className="content-section skills-showcase-section">
        <div className="skills-showcase">
          <p className="topline"><InlineCopy copy={content.showcase.eyebrow} /></p>
          <h2 className="headline">{content.showcase.title.map((line, index) => <span key={line}><InlineCopy copy={line} />{index < content.showcase.title.length - 1 && <br />}</span>)}<span className="accent-dot">.</span></h2>
          <p className="intro"><InlineCopy copy={content.showcase.intro} /></p>
          <div className="skills-panel">
            <div className="skills-columns">
              {content.showcase.columns.map((column, index) => (
                <article className={`skill-column ${skillColumnColors[index] ?? 'green'}`} key={column.title}>
                  <div className="skill-orb"><img src={getIndexedAsset(showcaseIcons, index)} alt="" /></div>
                  <h3><InlineCopy copy={column.title} /></h3>
                  <ul className="skill-list">{column.skills.map((skill) => <li key={skill}><InlineCopy copy={skill} /></li>)}</ul>
                </article>
              ))}
            </div>
            <div className="soft-skills">
              <h3 className="soft-title"><InlineCopy copy={content.showcase.softTitle} /></h3>
              <div className="soft-grid">
                {content.showcase.softSkills.map((skill, index) => (
                  <div className="soft-item" key={skill}>
                    <span className="soft-icon"><img src={getIndexedAsset(softSkillIcons, index)} alt="" /></span>
                    <span><InlineCopy copy={skill} /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="02" title={content.competencies.heading} text={content.competencies.intro} />
        <div className="skills-grid prototype-skills-grid">
          {content.competencies.items.map((competency) => (
            <article key={competency.title}>
              <header><span>{competency.index}</span><h3><InlineCopy copy={competency.title} /></h3></header>
              <ul>{competency.skills.map((skill) => <li key={skill}><InlineCopy copy={skill} /></li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="03" title={content.stack.heading} text={content.stack.intro} />
        <div className="prototype-tool-bands">
          {content.stack.bands.map((band) => <div className="prototype-tool-band" key={band.title}><strong><InlineCopy copy={band.title} /></strong><div>{band.tools.map((tool) => <TechTag key={tool} name={tool} variant="badge" />)}</div></div>)}
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="04" title={content.architecture.heading} text={content.architecture.intro} />
        <div className="engineering-card prototype-engineering-card with-media">
          <div className="wide-media" aria-hidden="true"><img src={architectureImage} alt="" loading="lazy" /></div>
          <div>
            <h3><InlineCopy copy={content.architecture.title} /></h3>
            {content.architecture.paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}><InlineCopy copy={paragraph} /></p>)}
            <div className="prototype-mini-row">{content.architecture.points.map((point, index) => <span key={point}><b>0{index + 1}</b>{point}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="05" title={content.verification.heading} text={content.verification.intro} />
        <div className="prototype-fit-grid">
          {content.verification.cards.map((card) => <div className={card.highlighted ? 'prototype-fit-card is-good' : 'prototype-fit-card'} key={card.title}><h3><InlineCopy copy={card.title} /></h3><p><InlineCopy copy={card.text} /></p></div>)}
        </div>
      </section>

      <Statement content={content.statement} />
      <FooterCta site={site} content={content.cta} />
    </DetailPageLayout>
  );
}

function PageTitle({ lines }: { readonly lines: readonly string[] }) {
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}><InlineCopy copy={line} />{index < lines.length - 1 && <br />}</span>)}</>;
}

const showcaseIcons = [workflowProblemIcon, skillsDesignIcon, workflowImplementationIcon, skillsDeliveryIcon] as const;
const skillColumnColors = ['green', 'cyan', 'orange', 'purple'] as const;
const softSkillIcons = [
  softCommunicationIcon,
  softTeamworkIcon,
  softIndependenceIcon,
  softResponsibilityIcon,
  softLearningIcon,
] as const;

function getIndexedAsset(assets: readonly string[], index: number): string {
  return assets[index] ?? assets[0] ?? '';
}
