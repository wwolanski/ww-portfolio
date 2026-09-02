import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';

import { App } from '../app/App';
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
        <App />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('MDX blog', () => {
  it('indexes the available Polish documents and normalizes their metadata', async () => {
    const articles = await getBlogArticles();
    const dates = articles.map((article) => article.date);

    expect(articles.length).toBeGreaterThan(0);
    expect(dates).toEqual([...dates].sort((left, right) => right.localeCompare(left)));
    expect(articles[0]?.readTime).toBeTruthy();
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
    const site = getSiteContent('pl');
    const { container } = renderBlog(site);

    expect(await screen.findByRole('button', { name: `${site.messages.blog.all} (${articles.length})` })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: `${selectedTag} (${matchingArticles.length})` })).toBeInTheDocument();
    expect(container.querySelector('.blog-article-list')).toBeInTheDocument();
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
    const site = getSiteContent('pl');
    const { container } = renderBlog(site);

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
    expect(screen.getByRole('button', { name: site.messages.blog.backToBlog })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: site.messages.blog.backToBlog }));

    expect(screen.getByTestId('location')).toHaveTextContent('/pl/blog');
    expect(await screen.findByRole('button', { name: `${site.messages.blog.all} (${(await getBlogArticles()).length})` })).toBeInTheDocument();
    expect(container.querySelector('.blog-article-list')).toBeInTheDocument();
  });

  it('renders Polish posts with English UI on the English route', async () => {
    const articles = await getBlogArticles();
    const site = getSiteContent('en');
    const { container } = renderBlog(site);

    expect(await screen.findByRole('button', { name: `${site.messages.blog.all} (${articles.length})` })).toBeInTheDocument();
    expect(container.querySelectorAll('.blog-article-list article')).toHaveLength(articles.length);
    expect(container.querySelector('.blog-filter-row')).toHaveAttribute('aria-label', site.messages.blog.filterArticles);
    expect(screen.getByRole('heading', { name: articles[0]!.title })).toBeInTheDocument();
  });

  it('loads a Polish post while keeping the English article UI', async () => {
    const article = (await getBlogArticles())[0];
    const site = getSiteContent('en');

    expect(article).toBeDefined();
    if (!article) {
      return;
    }

    renderBlog(site, [`/en/blog?article=${article.slug}`]);

    expect(await screen.findByRole('heading', { name: article.title, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: site.messages.blog.backToBlog })).toBeInTheDocument();
  });
});
