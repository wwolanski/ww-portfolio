import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { App } from '../app/App';
import { getSiteContent } from '../content/siteContent';
import { BlogPage } from '../pages/blog/BlogPage';
import { HomePage } from '../pages/home/HomePage';
import { ThemeProvider } from '../features/theme/ThemeProvider';

function renderPage(page: React.ReactNode) {
  return render(
    <MemoryRouter>
      <ThemeProvider>{page}</ThemeProvider>
    </MemoryRouter>
  );
}

const englishSite = getSiteContent('en');

describe('existing portfolio shell', () => {
  it('keeps all home sections and their original links', () => {
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

describe('existing blog page', () => {
  it('keeps article filtering available', async () => {
    const user = userEvent.setup();
    renderPage(<BlogPage site={englishSite} />);

    await user.click(screen.getByRole('button', { name: 'AI' }));

    expect(screen.getByRole('heading', { name: /rag pipelines, explained/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /practical guide to docker/i })).not.toBeInTheDocument();
  });
});

describe('localized detail pages', () => {
  it('keeps the current page when switching languages', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/pl/projects']}>
        <ThemeProvider><App /></ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /projekty,które cośsprawdzają/i })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /zmień język na angielski/i }));

    expect(screen.getByRole('link', { name: /switch language to polish/i })).toHaveAttribute('href', '/pl/projects');
  });
});
