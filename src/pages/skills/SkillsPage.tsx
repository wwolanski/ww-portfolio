import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { FooterCta, Statement } from '../../components/ui/ClosingSections';
import { InlineCopy } from '../../components/ui/InlineCopy';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { SiteContent } from '../../content/siteContent';

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
      <section className="content-section prototype-section">
        <SectionHeading index="01" title={content.competencies.heading} text={content.competencies.intro} />
        <div className="skills-grid prototype-skills-grid">
          {content.competencies.items.map((competency) => (
            <article key={competency.title}>
              <header><span>{competency.index}</span><h3>{competency.title}</h3></header>
              <ul>{competency.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="02" title={content.stack.heading} text={content.stack.intro} />
        <div className="prototype-tool-bands">
          {content.stack.bands.map((band) => <div className="prototype-tool-band" key={band.title}><strong>{band.title}</strong><div>{band.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div>)}
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="03" title={content.architecture.heading} text={content.architecture.intro} />
        <div className="engineering-card prototype-engineering-card">
          <div className="prototype-wide-icon">⌁</div>
          <div>
            <h3>{content.architecture.title}</h3>
            {content.architecture.paragraphs.map((paragraph, index) => <p key={`${paragraph.before}-${index}`}><InlineCopy copy={paragraph} /></p>)}
            <div className="prototype-mini-row">{content.architecture.points.map((point, index) => <span key={point}><b>0{index + 1}</b>{point}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="content-section prototype-section">
        <SectionHeading index="04" title={content.verification.heading} text={content.verification.intro} />
        <div className="prototype-fit-grid">
          {content.verification.cards.map((card) => <div className={card.highlighted ? 'prototype-fit-card is-good' : 'prototype-fit-card'} key={card.title}><h3>{card.title}</h3><p>{card.text}</p></div>)}
        </div>
      </section>

      <Statement content={content.statement} />
      <FooterCta site={site} content={content.cta} />
    </DetailPageLayout>
  );
}

function PageTitle({ lines }: { readonly lines: readonly string[] }) {
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < lines.length - 1 && <br />}</span>)}</>;
}
