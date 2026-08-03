import { Check, Terminal } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { skillGroups } from '../../content/portfolio';

export function SkillsPage() {
  return (
    <DetailPageLayout
      page="skills"
      eyebrow="Toolkit · 03"
      title={<>Wide range.<br />Sharp judgment.</>}
      intro="Technology is a means, not the destination. I choose tools for their fit, understand their trade-offs, and combine them into systems teams can confidently own."
    >
      <section className="content-section">
        <SectionHeading index="01" title="Capabilities" text="A T-shaped toolkit with product engineering at its core." />
        <div className="skills-grid">
          {skillGroups.map((group) => (
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
        <SectionHeading index="02" title="Beyond the stack" />
        <div className="engineering-card">
          <Terminal aria-hidden="true" />
          <div>
            <h3>Engineering is more than syntax.</h3>
            <p>I bring discovery, system design, accessibility, testing, security thinking, observability, and clear technical communication into the same workflow.</p>
          </div>
        </div>
        <div className="strength-list" aria-label="Engineering strengths">
          {['Product discovery', 'Technical leadership', 'System design', 'Performance', 'Accessibility', 'Mentoring'].map((item, index) => (
            <span key={item}><small>0{index + 1}</small>{item}</span>
          ))}
        </div>
      </section>
    </DetailPageLayout>
  );
}
