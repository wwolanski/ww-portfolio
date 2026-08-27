import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { ContentDocumentView } from '../../components/content/ContentDocumentView';
import { DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { InlineCopy } from '../../components/ui/InlineCopy';
import { getBlogArticles, type BlogArticle } from '../../content/mdx/blogIndex';
import type { SiteContent } from '../../content/siteContent';

type BlogPageProps = { readonly site: SiteContent };

type TagFilter = {
  readonly tag: string | null;
  readonly count: number;
};

export function BlogPage({ site }: BlogPageProps) {
  const { blog: content } = site.portfolio;
  const [searchParams] = useSearchParams();
  const [titleLineOne, titleLineTwo] = content.title;

  return (
    <DetailPageLayout
      site={site}
      page="blog"
      eyebrow={content.eyebrow}
      title={<><InlineCopy copy={titleLineOne ?? ''} /><br /><InlineCopy copy={titleLineTwo ?? ''} /></>}
      intro={<InlineCopy copy={content.intro} />}
      showHero={!searchParams.get('article')}
    >
      <BlogPageContent site={site} />
    </DetailPageLayout>
  );
}

export function BlogPageContent({ site }: BlogPageProps) {
  const [articles, setArticles] = useState<readonly BlogArticle[] | null>(null);
  const [articleIndexError, setArticleIndexError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    void getBlogArticles()
      .then((nextArticles) => {
        if (isActive) {
          setArticles(nextArticles);
        }
      })
      .catch(() => {
        if (isActive) {
          setArticleIndexError(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const activeArticleSlug = searchParams.get('article');
  const activeArticle = articles?.find((article) => article.slug === activeArticleSlug) ?? null;
  const tagFilters = articles ? buildTagFilters(articles) : [];
  const visibleArticles = articles && activeTag
    ? articles.filter((article) => article.tags.includes(activeTag))
    : articles ?? [];
  function openArticle(article: BlogArticle) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('article', article.slug);
      return next;
    });
  }

  function closeArticle() {
    setActiveTag(null);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('article');
      return next;
    }, { replace: true });
  }

  return (
    <>
      {articles === null ? (
        <BlogIndexState message={articleIndexError ? site.messages.blog.errorIndex : site.messages.blog.loadingIndex} isError={articleIndexError} />
      ) : activeArticle ? (
        <BlogArticleView article={activeArticle} site={site} onBack={closeArticle} />
      ) : (
        <BlogIndex
          site={site}
          tagFilters={tagFilters}
          activeTag={activeTag}
          visibleArticles={visibleArticles}
          onSelectTag={setActiveTag}
          onOpenArticle={openArticle}
        />
      )}
    </>
  );
}

type BlogIndexStateProps = {
  readonly message: string;
  readonly isError: boolean;
};

function BlogIndexState({ message, isError }: BlogIndexStateProps) {
  return (
    <section className={`content-document-state${isError ? ' content-document-state--error' : ''}`} role={isError ? 'alert' : 'status'} aria-live="polite">
      <p>{message}</p>
    </section>
  );
}

type BlogIndexProps = {
  readonly site: SiteContent;
  readonly tagFilters: readonly TagFilter[];
  readonly activeTag: string | null;
  readonly visibleArticles: readonly BlogArticle[];
  readonly onSelectTag: (tag: string | null) => void;
  readonly onOpenArticle: (article: BlogArticle) => void;
};

function BlogIndex({
  site,
  tagFilters,
  activeTag,
  visibleArticles,
  onSelectTag,
  onOpenArticle,
}: BlogIndexProps) {
  return (
    <>
      <div className="blog-filter-row blog-filter-row--hero" role="group" aria-label={site.messages.blog.filterArticles}>
        {tagFilters.map((filter) => {
          const isActive = activeTag === filter.tag;
          const label = filter.tag ?? site.messages.blog.all;

          return (
            <button
              key={filter.tag ?? 'all'}
              type="button"
              className={`tag-chip tag-chip--interactive${isActive ? ' tag-chip--active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onSelectTag(filter.tag)}
            >
              {label} ({filter.count})
            </button>
          );
        })}
      </div>
      <section className="content-section blog-section">
        <div className="blog-article-list" aria-live="polite">
          {visibleArticles.map((article, index) => (
            <article key={article.slug}>
              <div className="blog-article-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="blog-article-body">
                <div className="blog-article-meta">
                  <span>{article.tags.join(' · ')}</span>
                  <span>{formatArticleDate(article.date, site.locale)}</span>
                  <span><Clock3 aria-hidden="true" /> {site.messages.blog.readTime(article.readTime)}</span>
                </div>
                <h3><InlineCopy copy={article.title} /></h3>
                {article.description ? <p><InlineCopy copy={article.description} /></p> : null}
              </div>
              <button
                type="button"
                aria-label={site.messages.blog.readArticle(article.title)}
                onClick={() => onOpenArticle(article)}
              >
                <ArrowUpRight aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}

type BlogArticleViewProps = {
  readonly article: BlogArticle;
  readonly site: SiteContent;
  readonly onBack: () => void;
};

function BlogArticleView({ article, site, onBack }: BlogArticleViewProps) {
  return (
    <ContentDocumentView
      key={article.slug}
      request={{ type: 'blog', slug: article.slug, locale: 'pl' }}
      messages={site.messages}
      loadingMessage={site.messages.blog.loadingArticle}
      missingMessage={site.messages.blog.missingArticle}
      errorMessage={site.messages.blog.errorArticle}
      variant="page"
      topActions={(
        <button
          type="button"
          className="blog-article__back-link"
          onClick={onBack}
          aria-label={site.messages.blog.backToBlog}
        >
          <ArrowLeft aria-hidden="true" />
          <span>{site.messages.blog.backToBlog}</span>
        </button>
      )}
      header={<BlogArticleHeader article={article} site={site} />}
    />
  );
}

type BlogArticleHeaderProps = {
  readonly article: BlogArticle;
  readonly site: SiteContent;
};

function BlogArticleHeader({ article, site }: BlogArticleHeaderProps) {
  return (
    <header className="blog-article-header">
      <div className="blog-article-header__meta">
        <span>{formatArticleDate(article.date, site.locale)}</span>
        <span>{site.messages.blog.readTime(article.readTime)}</span>
      </div>
      <h1><InlineCopy copy={article.title} /></h1>
      {article.description ? <p><InlineCopy copy={article.description} /></p> : null}
      <ul className="blog-article-header__tags" aria-label={site.messages.blog.articleTags}>
        {article.tags.map((tag) => <li key={tag} className="tag-chip">{tag}</li>)}
      </ul>
    </header>
  );
}

function buildTagFilters(articles: readonly BlogArticle[]): readonly TagFilter[] {
  const counts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [
    { tag: null, count: articles.length },
    ...Array.from(counts, ([tag, count]) => ({ tag, count })),
  ];
}

function formatArticleDate(value: string, locale: SiteContent['locale']): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
