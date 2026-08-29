import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';

import { BlogPage } from '../pages/blog/BlogPage';
import { getBlogArticles, parseBlogFrontmatter } from '../content/mdx/blogIndex';
import { getSiteContent } from '../content/siteContent';
import { ThemeProvider } from '../features/theme/ThemeProvider';

function LocationProbe() {
  const location = useLocation();

  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

function renderBlog(site: ReturnType<typeof getSiteContent>, initialEntries = [`/${site.locale}/blog`]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <LocationProbe />
        <BlogPage site={site} />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('MDX blog', () => {
  it('indexes the three Polish documents and normalizes their metadata', async () => {
    const articles = await getBlogArticles();

    expect(articles).toHaveLength(3);
    expect(articles.map((article) => article.date)).toEqual(['2026-07-18', '2026-06-04', '2026-05-21']);
    expect(articles[0]).toMatchObject({
      date: '2026-07-18',
      readTime: '8 min',
    });
    expect(articles[0]?.title).toBeTruthy();
    expect(articles[0]?.tags.length).toBeGreaterThan(0);
  });

  it('accepts missing, empty, and null descriptions', () => {
    const base = {
      title: 'Wpis bez opisu',
      tags: ['Testy'],
      date: '2026-01-01',
      readTime: '1 min',
    };

    expect(parseBlogFrontmatter(base, 'missing-description')?.description).toBeUndefined();
    expect(parseBlogFrontmatter({ ...base, description: '  ' }, 'empty-description')?.description).toBeUndefined();
    expect(parseBlogFrontmatter({ ...base, description: null }, 'null-description')?.description).toBeUndefined();
  });

  it('builds tag filters with related article counts', async () => {
    const user = userEvent.setup();
    const articles = await getBlogArticles();
    const selectedTag = articles[0]?.tags[0];
    const matchingArticles = articles.filter((article) => article.tags.includes(selectedTag ?? ''));
    renderBlog(getSiteContent('pl'));

    expect(await screen.findByRole('button', { name: `Wszystkie (${articles.length})` })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: `${selectedTag} (${matchingArticles.length})` })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Najnowsze teksty' })).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: `${selectedTag} (${matchingArticles.length})` }));

    for (const article of matchingArticles) {
      expect(screen.getByRole('heading', { name: article.title })).toBeInTheDocument();
    }
    for (const article of articles.filter((article) => !matchingArticles.includes(article))) {
      expect(screen.queryByRole('heading', { name: article.title })).not.toBeInTheDocument();
    }
  });

  it('replaces the list with a full-page document and returns without a modal', async () => {
    const user = userEvent.setup();
    const article = (await getBlogArticles())[0];
    const { container } = renderBlog(getSiteContent('pl'));

    expect(article).toBeDefined();
    if (!article) {
      return;
    }

    const articleLink = await screen.findByRole('link', { name: article.title });

    expect(articleLink).toHaveAttribute('href', `/pl/blog?article=${article.slug}`);
    expect(screen.queryByRole('button', { name: `Przeczytaj: ${article.title}` })).not.toBeInTheDocument();

    await user.click(articleLink);

    expect(screen.getByTestId('location')).toHaveTextContent(`/pl/blog?article=${article.slug}`);
    expect(await screen.findByRole('heading', { name: article.title, level: 1 })).toBeInTheDocument();
    expect(container.querySelector('.detail-main--document')).toBeInTheDocument();
    expect(container.querySelector('.detail-main--document .page-hero')).toBeNull();
    expect(container.querySelector('.mdx-content-layout--page')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Najnowsze teksty' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Powrót' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Powrót' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/pl/blog');
    expect(await screen.findByRole('button', { name: `Wszystkie (${(await getBlogArticles()).length})` })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Najnowsze teksty' })).not.toBeInTheDocument();
  });

  it('keeps the UI localized while loading Polish source content on the English route', async () => {
    const user = userEvent.setup();
    renderBlog(getSiteContent('en'), ['/en/blog?article=pipeline-rag']);

    expect(await screen.findByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Pipeline’y RAG bez tajemnic', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'RAG to więcej niż wyszukiwanie', level: 2 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('group', { name: 'Filter articles by tag' })).toBeInTheDocument();
  });
});
