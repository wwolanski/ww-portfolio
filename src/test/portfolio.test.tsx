import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '../features/theme/ThemeProvider';
import { App } from '../app/App';
import { getSiteContent } from '../content/siteContent';
import { BlogPage } from '../pages/blog/BlogPage';
import { HomePage } from '../pages/home/HomePage';

function renderPage(page: React.ReactNode) {
  return render(
    <MemoryRouter>
      <ThemeProvider>{page}</ThemeProvider>
    </MemoryRouter>,
  );
}

const englishSite = getSiteContent('en');

describe('portfolio navigation', () => {
  it('exposes all main sections as accessible links', () => {
    renderPage(<HomePage site={englishSite} />);

    expect(screen.getByRole('heading', { name: /wojciech wolanski/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open about page/i })).toHaveAttribute('href', '/en/about');
    expect(screen.getByRole('link', { name: /open projects page/i })).toHaveAttribute('href', '/en/projects');
    expect(screen.getByRole('link', { name: /open skills page/i })).toHaveAttribute('href', '/en/skills');
    expect(screen.getByRole('link', { name: /open blog page/i })).toHaveAttribute('href', '/en/blog');
  });

  it('switches theme and persists the preference', async () => {
    const user = userEvent.setup();
    renderPage(<HomePage site={englishSite} />);

    await user.click(screen.getByRole('button', { name: /switch to light theme/i }));

    expect(document.documentElement).not.toHaveClass('dark');
    expect(window.localStorage.getItem('ww-portfolio-theme')).toBe('light');
  });
});

describe('blog filtering', () => {
  it('filters articles without duplicating derived state', async () => {
    const user = userEvent.setup();
    renderPage(<BlogPage site={englishSite} />);

    await user.click(screen.getByRole('button', { name: 'AI' }));

    expect(screen.getByRole('heading', { name: /rag pipelines, explained/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /practical guide to docker/i })).not.toBeInTheDocument();
  });
});

describe('localized routing', () => {
  it('keeps the current page when switching languages', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/en/projects']}>
        <ThemeProvider><App /></ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /built to make/i })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /switch language to polish/i }));

    expect(screen.getByRole('heading', { name: /zbudowane, by/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /zmień język na angielski/i })).toHaveAttribute('href', '/en/projects');
  });
});
