import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '../features/theme/ThemeProvider';
import { BlogPage } from '../pages/blog/BlogPage';
import { HomePage } from '../pages/home/HomePage';

function renderPage(page: React.ReactNode) {
  return render(
    <MemoryRouter>
      <ThemeProvider>{page}</ThemeProvider>
    </MemoryRouter>,
  );
}

describe('portfolio navigation', () => {
  it('exposes all main sections as accessible links', () => {
    renderPage(<HomePage />);

    expect(screen.getByRole('heading', { name: /wojciech wolanski/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open about page/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /open projects page/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /open skills page/i })).toHaveAttribute('href', '/skills');
    expect(screen.getByRole('link', { name: /open blog page/i })).toHaveAttribute('href', '/blog');
  });

  it('switches theme and persists the preference', async () => {
    const user = userEvent.setup();
    renderPage(<HomePage />);

    await user.click(screen.getByRole('button', { name: /switch to light theme/i }));

    expect(document.documentElement).not.toHaveClass('dark');
    expect(window.localStorage.getItem('ww-portfolio-theme')).toBe('light');
  });
});

describe('blog filtering', () => {
  it('filters articles without duplicating derived state', async () => {
    const user = userEvent.setup();
    renderPage(<BlogPage />);

    await user.click(screen.getByRole('button', { name: 'AI' }));

    expect(screen.getByRole('heading', { name: /rag pipelines, explained/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /practical guide to docker/i })).not.toBeInTheDocument();
  });
});
