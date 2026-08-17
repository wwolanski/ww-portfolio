import { Check, Terminal } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { SiteContent } from '../../content/siteContent';

type SkillsPageProps = { readonly site: SiteContent };

export function SkillsPage({ site }: SkillsPageProps) {
  const { skills: content } = site.portfolio;
  const [titleLineOne, titleLineTwo] = content.title;

  return (
    <DetailPageLayout
      site={site}
      page="skills"
      eyebrow={content.eyebrow}
      title={<>{titleLineOne}<br />{titleLineTwo}</>}
      intro={content.intro}
    >
      <section className="content-section">
        <SectionHeading index="01" title={content.sectionHeading} text={content.sectionIntro} />
        <div className="skills-grid">
          {content.groups.map((group) => (
            <article key={group.title}>
              <header>
                <span>{group.index}</span>
                <h3>{group.title}</h3>
              </header>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}><Check aria-hidden="true" /> {skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section engineering-section">
        <SectionHeading index="02" title={content.beyondStackHeading} />
        <div className="engineering-card">
          <Terminal aria-hidden="true" />
          <div>
            <h3>{content.beyondStackTitle}</h3>
            <p>{content.beyondStackText}</p>
          </div>
        </div>
        <div className="strength-list" aria-label={site.messages.skills.engineeringStrengths}>
          {content.strengths.map((item, index) => (
            <span key={item}><small>0{index + 1}</small>{item}</span>
          ))}
        </div>
      </section>
    </DetailPageLayout>
  );
}
