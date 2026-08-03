import { ArrowDown, Code2, Compass, Layers3 } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';

const principles = [
  { icon: Compass, title: 'Start with why', text: 'I reduce ambiguity before writing code, so the solution serves a real need.' },
  { icon: Layers3, title: 'Design for change', text: 'Clear boundaries and simple abstractions keep products adaptable as they grow.' },
  { icon: Code2, title: 'Own the outcome', text: 'From product decisions to production metrics, I stay close to the whole system.' },
] as const;

export function AboutPage() {
  return (
    <DetailPageLayout
      page="about"
      eyebrow="About · 01"
      title={<>I build software<br />with intent.</>}
      intro="Full-stack developer focused on products that feel effortless to use and remain a pleasure to maintain. I connect thoughtful interfaces, reliable systems, and practical AI."
    >
      <section className="content-section about-story">
        <SectionHeading index="01" title="The short story" />
        <div className="story-copy">
          <p className="lead-copy">I’m Wojciech — an engineer who likes turning complicated problems into calm, useful products.</p>
          <p>My work lives where product thinking meets engineering discipline. I care about the small interaction a user notices and the quiet architectural decision that keeps a system healthy years later.</p>
          <p>I collaborate closely, explain trade-offs clearly, and ship in deliberate increments. The goal is not clever code. It is software that earns trust.</p>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading index="02" title="How I work" text="Three principles guide every engagement." />
        <div className="principles-grid">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <article key={title}>
              <span className="principle-number">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section now-block">
        <div>
          <span className="status-dot" /> Available for select projects
        </div>
        <h2>Currently exploring human-centered AI products and dependable developer platforms.</h2>
        <a href="mailto:hello@wollanski.dev">Download résumé <ArrowDown aria-hidden="true" /></a>
      </section>
    </DetailPageLayout>
  );
}
