import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { App } from '../app/App';
import { getTechTagDefinition } from '../content/techTags';
import { getSiteContent } from '../content/siteContent';
import { TechTag } from '../components/ui/TechTag';
import { AboutPage } from '../pages/about/AboutPage';
import { BlogPage } from '../pages/blog/BlogPage';
import { HomePage } from '../pages/home/HomePage';
import { SkillsPage } from '../pages/skills/SkillsPage';
import { ThemeProvider } from '../features/theme/ThemeProvider';

function renderPage(page: React.ReactNode) {
  return render(
    <MemoryRouter>
      <ThemeProvider>{page}</ThemeProvider>
    </MemoryRouter>
  );
}

const englishSite = getSiteContent('en');
const polishSite = getSiteContent('pl');

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

describe('v7 detail visuals', () => {
  it('renders the illustrated about workflow and timeline', () => {
    const { container } = renderPage(<AboutPage site={polishSite} />);

    expect(container.querySelector('.visual-panel[data-page="about"]')).toBeInTheDocument();
    expect(container.querySelector('.ai-workflow')).toBeInTheDocument();
    expect(container.querySelectorAll('.ai-orb img')).toHaveLength(6);
    expect(container.querySelector('.process-visual img')).toBeInTheDocument();
    expect(container.querySelectorAll('.timeline-thumb img')).toHaveLength(4);
  });

  it('renders the new skills showcase and blog card rail', () => {
    const { container, unmount } = renderPage(<SkillsPage site={polishSite} />);

    expect(container.querySelector('.skills-showcase')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Umiejętności miękkie' })).toBeInTheDocument();
    expect(container.querySelector('.wide-media img')).toBeInTheDocument();

    unmount();
    const blog = renderPage(<BlogPage site={polishSite} />);
    expect(blog.container.querySelector('.visual-panel[data-page="blog"]')).toBeInTheDocument();
    expect(blog.container.querySelectorAll('.visual-panel__blog-shapes .pv-card')).toHaveLength(3);
  });

  it('registers and renders every technology in the technologies list', () => {
    const stack = polishSite.portfolio.skills.stack;
    const stackTools = stack.bands.flatMap((band) => band.tools);
    const { container } = renderPage(<SkillsPage site={polishSite} />);

    expect(screen.getByRole('heading', { name: 'Technologie, z którymi pracuję' })).toBeInTheDocument();
    expect(stack.bands.map((band) => band.title)).toEqual([
      'Frontend',
      'UI Systems',
      'Backend & APIs',
      'Data & Search',
      'AI & Coding Agents',
      'MCP',
      'Agentic Tooling',
      'Quality & Delivery',
    ]);
    expect(stack.bands[7]?.tools).toEqual([
      'CI/CD',
      'Git',
      'GitHub',
      'Docker',
      'Vitest',
      'pytest',
      'Playwright',
      'ESLint',
      'Knip',
    ]);
    expect(stack.bands[0]?.tools).not.toContain('Zustand');
    expect(stack.bands[4]?.tools).not.toContain('Claude');
    expect(stack.bands[6]?.tools).toEqual([
      'CodeGraph',
      'RTK',
      'Google Stitch',
      'Mermaid',
      'Impeccable',
    ]);
    expect(stackTools.every((tool) => getTechTagDefinition(tool))).toBe(true);
    expect(container.querySelectorAll('.tech-tag--badge')).toHaveLength(stackTools.length);
    expect(container.querySelectorAll('[data-tech-tag="CodeGraph (local)"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-tech-tag="RTK"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-tech-tag="CI/CD"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-tech-tag="Git"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-tech-tag="GitHub"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-tech-tag="Claude"]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-tech-tag="Zustand"]')).toHaveLength(0);
    expect(getTechTagDefinition('Git')?.icon).toEqual({ kind: 'iconify', name: 'skill-icons:git' });
    expect(getTechTagDefinition('GitHub')?.icon).toEqual({ kind: 'iconify', name: 'simple-icons:github' });
    expect(getTechTagDefinition('Mermaid')?.icon).toEqual({
      kind: 'iconify',
      name: 'simple-icons:mermaid',
      color: '#ff3670',
    });
    expect(getTechTagDefinition('Claude')).toBeDefined();
    expect(getTechTagDefinition('Zustand')).toBeDefined();
    expect(getTechTagDefinition('toString')).toBeUndefined();
  });

  it('supports badge and icon-only tech tag variants', () => {
    const { container } = renderPage(
      <div>
        <TechTag name="React" variant="badge" />
        <TechTag name="React" variant="icon" />
      </div>,
    );

    expect(container.querySelector('.tech-tag--badge')).toBeInTheDocument();
    expect(container.querySelector('.tech-tag--icon')).toHaveAttribute('aria-label', 'React');
  });
});
