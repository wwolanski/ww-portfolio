import { useState } from 'react';
import { ArrowUpRight, Clock3 } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { SiteContent } from '../../content/siteContent';

type BlogPageProps = { readonly site: SiteContent };

export function BlogPage({ site }: BlogPageProps) {
  const { blog: content } = site.portfolio;
  const [titleLineOne, titleLineTwo] = content.title;
  const categories = [site.messages.blog.all, ...new Set(content.articles.map((article) => article.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const visibleArticles = content.articles.filter((article) => activeCategory === categories[0] || article.category === activeCategory);

  return (
    <DetailPageLayout
      site={site}
      page="blog"
      eyebrow={content.eyebrow}
      title={<>{titleLineOne}<br />{titleLineTwo}</>}
      intro={content.intro}
    >
      <section className="content-section blog-section">
        <SectionHeading index="01" title={content.sectionHeading} text={content.sectionIntro} />
        <div className="filter-row" role="group" aria-label={site.messages.blog.filterArticles}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? 'active' : ''}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="article-list" aria-live="polite">
          {visibleArticles.map((article, index) => (
            <article key={article.title}>
              <div className="article-index">0{index + 1}</div>
              <div className="article-body">
                <div className="article-meta">
                  <span>{article.category}</span>
                  <span>{article.date}</span>
                  <span><Clock3 aria-hidden="true" /> {site.messages.blog.readTime(article.readTime)}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </div>
              <button type="button" aria-label={site.messages.blog.readArticle(article.title)}>
                <ArrowUpRight aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="newsletter">
        <span>{site.messages.blog.newsletterEyebrow}</span>
        <h2>{site.messages.blog.newsletterTitle}</h2>
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email">{site.messages.blog.workEmail}</label>
          <input id="newsletter-email" type="email" placeholder={site.messages.blog.emailPlaceholder} required />
          <button type="submit">{site.messages.blog.subscribe} <ArrowUpRight aria-hidden="true" /></button>
        </form>
      </aside>
    </DetailPageLayout>
  );
}
