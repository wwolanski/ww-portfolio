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
import { ProjectsPage } from '../pages/projects/ProjectsPage';
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

describe('blog page', () => {
  it('keeps article filtering available while using Polish MDX content', async () => {
    const user = userEvent.setup();
    renderPage(<BlogPage site={englishSite} />);

    await user.click(await screen.findByRole('button', { name: 'AI (1)' }));

    expect(screen.getByRole('heading', { name: /pipeline’y rag bez tajemnic/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /praktyczny przewodnik po dockerze/i })).not.toBeInTheDocument();
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

    expect(screen.getByRole('heading', { name: /projekty\s*w\s*praktyce\./i })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /zmień język na angielski/i }));

    expect(screen.getByRole('link', { name: /switch language to polish/i })).toHaveAttribute('href', '/pl/projects');
  });
});

describe('v7 detail visuals', () => {
  it('renders the illustrated about workflow and timeline', () => {
    const { container } = renderPage(<AboutPage site={polishSite} />);

    expect(container.querySelector('.visual-panel[data-page="about"]')).toBeInTheDocument();
    expect(container.querySelector('.about-workflow__steps')).toBeInTheDocument();
    expect(container.querySelectorAll('.about-workflow__orb img')).toHaveLength(5);
    expect(Array.from(container.querySelectorAll('.about-page > .about-section .section-heading h2')).map((heading) => heading.textContent?.trim())).toEqual([
      'Droga do software',
      'Workflow w praktyce',
    ]);
    expect(container.querySelector('.about-process__visual img')).toBeInTheDocument();
    expect(container.querySelectorAll('.about-timeline__thumb img')).toHaveLength(4);
  });

  it('renders inline Markdown in prose content outside the hero lead', () => {
    const { container } = renderPage(<AboutPage site={polishSite} />);
    const workflowIntro = container.querySelector<HTMLElement>('.about-section--workflow .section-heading p');

    if (!workflowIntro) {
      throw new Error('Workflow intro is missing.');
    }

    expect(workflowIntro.querySelector('strong')).toHaveTextContent('Nie wymyślam koła na nowo, jeśli nie muszę.');
    expect(workflowIntro.textContent).not.toContain('**');
  });

  it('renders localized RepoAtlas links to the case study', () => {
    const about = renderPage(<AboutPage site={polishSite} />);
    const aboutLink = screen.getByRole('link', { name: 'RepoAtlas' });

    expect(aboutLink).toHaveAttribute('href', '/pl/projects?caseStudy=repoatlas');
    expect(aboutLink.querySelectorAll('.content-link__icon')).toHaveLength(1);
    about.unmount();

    renderPage(<SkillsPage site={polishSite} />);
    const skillsLink = screen.getByRole('link', { name: 'RepoAtlas' });

    expect(skillsLink).toHaveAttribute('href', '/pl/projects?caseStudy=repoatlas');
    expect(skillsLink.querySelectorAll('svg')).toHaveLength(2);
  });

  it('reveals the complete example process on demand', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<AboutPage site={polishSite} />);
    const reveal = container.querySelector('.about-process__grid-reveal');
    const viewport = container.querySelector('.about-process__grid-viewport');
    const toggle = screen.getByRole('button', { name: 'Pokaż pełny proces' });

    expect(reveal).not.toHaveClass('is-expanded');
    expect(viewport).toHaveAttribute('aria-hidden', 'true');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(reveal).toHaveClass('is-expanded');
    expect(viewport).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByRole('button', { name: 'Zwiń etapy procesu' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the custom skills boundary section and blog card rail', () => {
    const { container, unmount } = renderPage(<SkillsPage site={polishSite} />);

    expect(container.querySelector('.solution-boundary')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Rozpoznawanie granic rozwiązania' })).toBeInTheDocument();
    expect(container.querySelector('.solution-boundary .page-eyebrow')).toHaveTextContent('Umiejętności · 03');
    expect(container.querySelectorAll('.solution-boundary__layer')).toHaveLength(5);
    expect(container.querySelectorAll('.solution-boundary__principle')).toHaveLength(4);

    unmount();
    const blog = renderPage(<BlogPage site={polishSite} />);
    expect(blog.container.querySelector('.visual-panel[data-page="blog"]')).toBeInTheDocument();
    expect(blog.container.querySelectorAll('.visual-panel__blog-shapes .blog-visual-card')).toHaveLength(3);
  });

  it('renders the technologies section directly after the solution boundary', () => {
    const { container } = renderPage(<SkillsPage site={polishSite} />);
    const stack = polishSite.portfolio.skills.stack;
    const stackTools = stack.bands.flatMap((band) => band.tools);
    const sections = Array.from(container.querySelectorAll('main > section'));
    const boundaryIndex = sections.findIndex((section) => section.classList.contains('solution-boundary'));
    const technologyIndex = sections.findIndex((section) => section.querySelector('.skills-tools'));

    expect(screen.getByRole('heading', { name: 'Technologie, z którymi pracuję' })).toBeInTheDocument();
    expect(technologyIndex).toBe(boundaryIndex + 1);
    expect(container.querySelectorAll('.skills-tools__group')).toHaveLength(stack.bands.length);
    expect(container.querySelectorAll('.tech-tag--badge')).toHaveLength(stackTools.length);
  });

  it('keeps the statement only on about and ends other detail pages with their CTA', () => {
    const about = renderPage(<AboutPage site={polishSite} />);
    expect(about.container.querySelector('.statement')).toBeInTheDocument();
    about.unmount();

    const skills = renderPage(<SkillsPage site={polishSite} />);
    expect(skills.container.querySelector('.statement')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projekty ↗' })).toHaveAttribute('href', '/pl/projects');
    skills.unmount();

    const projects = renderPage(<ProjectsPage site={polishSite} />);
    expect(projects.container.querySelector('.statement')).not.toBeInTheDocument();
  });

  it('registers every technology in the retained technologies content', () => {
    const stack = polishSite.portfolio.skills.stack;
    const stackTools = stack.bands.flatMap((band) => band.tools);
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
