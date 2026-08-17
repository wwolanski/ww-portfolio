import { ArrowDown, Code2, Compass, Layers3 } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { SiteContent } from '../../content/siteContent';

type AboutPageProps = { readonly site: SiteContent };

const principleIcons = [Compass, Layers3, Code2] as const;

export function AboutPage({ site }: AboutPageProps) {
  const { about } = site.portfolio;
  const [titleLineOne, titleLineTwo] = about.title;

  return (
    <DetailPageLayout
      site={site}
      page="about"
      eyebrow={about.eyebrow}
      title={<>{titleLineOne}<br />{titleLineTwo}</>}
      intro={about.intro}
    >
      <section className="content-section about-story">
        <SectionHeading index="01" title={about.storyHeading} />
        <div className="story-copy">
          <p className="lead-copy">{about.lead}</p>
          {about.storyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading index="02" title={about.principlesHeading} text={about.principlesIntro} />
        <div className="principles-grid">
          {about.principles.map(({ title, text }, index) => {
            const Icon = principleIcons[index] ?? Compass;

            return (
              <article key={title}>
                <span className="principle-number">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section now-block">
        <div>
          <span className="status-dot" /> {site.messages.about.available}
        </div>
        <h2>{about.nowHeading}</h2>
        <a href="mailto:hello@wollanski.dev">{site.messages.about.resume} <ArrowDown aria-hidden="true" /></a>
      </section>
    </DetailPageLayout>
  );
}
