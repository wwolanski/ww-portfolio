import { useState } from 'react';
import { ArrowUpRight, Clock3 } from 'lucide-react';

import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { articles } from '../../content/portfolio';

const categories = ['All', ...new Set(articles.map((article) => article.category))] as const;

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
  const visibleArticles = articles.filter((article) => activeCategory === 'All' || article.category === activeCategory);

  return (
    <DetailPageLayout
      page="blog"
      eyebrow="Notes & ideas · 04"
      title={<>Thinking<br />in public.</>}
      intro="Field notes on building maintainable systems, useful AI, and software teams that keep learning. Written to clarify ideas and share what works."
    >
      <section className="content-section blog-section">
        <SectionHeading index="01" title="Latest writing" text="Practical ideas for people who build digital products." />
        <div className="filter-row" role="group" aria-label="Filter articles by category">
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
                  <span><Clock3 aria-hidden="true" /> {article.readTime}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </div>
              <button type="button" aria-label={`Read ${article.title}`}>
                <ArrowUpRight aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="newsletter">
        <span>No noise. Just useful ideas.</span>
        <h2>Occasional notes for thoughtful builders.</h2>
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email">Work email</label>
          <input id="newsletter-email" type="email" placeholder="you@company.com" required />
          <button type="submit">Subscribe <ArrowUpRight aria-hidden="true" /></button>
        </form>
      </aside>
    </DetailPageLayout>
  );
}
