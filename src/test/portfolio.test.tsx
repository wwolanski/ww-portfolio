import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { App } from '../app/App';
import { getTechTagDefinition } from '../content/techTags';
import { getSiteContent } from '../content/siteContent';
import { getBlogArticles } from '../content/mdx/blogIndex';
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

const polishSite = getSiteContent('pl');

describe('existing portfolio shell', () => {
  it('keeps all home sections and their original links', () => {
    const { container } = renderPage(<HomePage site={polishSite} />);

    expect(container.querySelector('.home-title')).toBeInTheDocument();

    for (const item of polishSite.navigation) {
      const link = container.querySelector<HTMLAnchorElement>(`[data-card="${item.slug}"] .home-card__link`);

      expect(link).toHaveAttribute('href', `/${polishSite.locale}${item.href}`);
      expect(link).toHaveAttribute('aria-label', polishSite.messages.actions.openPage(item.label));
    }
  });

  it('switches theme and persists the preference', async () => {
    const user = userEvent.setup();
    renderPage(<HomePage site={polishSite} />);

    await user.click(screen.getByRole('button', { name: polishSite.messages.theme.switchToLight }));

    expect(document.documentElement).not.toHaveClass('dark');
    expect(window.localStorage.getItem('ww-portfolio-theme')).toBe('light');
  });
});

describe('blog page', () => {
  it('keeps article filtering available while using Polish MDX content', async () => {
    const user = userEvent.setup();
    const articles = await getBlogArticles();
    const selectedTag = articles[0]?.tags[0];
    const matchingArticles = articles.filter((article) => article.tags.includes(selectedTag ?? ''));
    renderPage(<BlogPage site={polishSite} />);

    expect(selectedTag).toBeDefined();
    await user.click(await screen.findByRole('button', { name: `${selectedTag} (${matchingArticles.length})` }));

    for (const article of matchingArticles) {
      expect(screen.getByRole('heading', { name: article.title })).toBeInTheDocument();
    }
  });
});

describe('localized detail pages', () => {
  it('keeps the current page when switching languages', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <MemoryRouter initialEntries={['/pl/projects']}>
        <ThemeProvider><App /></ThemeProvider>
      </MemoryRouter>,
    );

    expect(container.querySelector('.detail-page--projects')).toBeInTheDocument();
    await user.click(screen.getByRole('link', {
      name: polishSite.messages.language.switchTo(polishSite.messages.language.english),
    }));

    expect(document.querySelector('.language-switcher__option[href="/pl/projects"]')).toBeInTheDocument();
  });
});

describe('localized visual panel content', () => {
  it.each(['pl', 'en'] as const)('renders the %s about-panel copy from localized content', (locale) => {
    const site = getSiteContent(locale);
    const { container } = render(
      <MemoryRouter initialEntries={[`/${locale}/about`]}>
        <ThemeProvider><App /></ThemeProvider>
      </MemoryRouter>,
    );
    const visualPanel = site.portfolio.about.visualPanel;

    expect(container.querySelector('.visual-panel__caption small')).toHaveTextContent(visualPanel.kicker);
    expect(container.querySelector('.visual-panel__caption strong')).toHaveTextContent(visualPanel.title);
  });

  it('renders the English blog-panel cards from localized content', () => {
    const site = getSiteContent('en');
    const { container } = render(
      <MemoryRouter initialEntries={['/en/blog']}>
        <ThemeProvider><App /></ThemeProvider>
      </MemoryRouter>,
    );
    const cards = site.portfolio.blog.visualPanel.cards;
    const renderedCards = container.querySelectorAll('.visual-panel__blog-shapes .blog-visual-card');

    expect(renderedCards).toHaveLength(cards.length);
    cards.forEach((card, index) => {
      expect(renderedCards[index]).toHaveTextContent(card.heading);
      expect(renderedCards[index]).toHaveTextContent(card.status);
      expect(renderedCards[index]).toHaveTextContent(card.metric);
    });
  });
});

describe('v7 detail visuals', () => {
  it('renders the illustrated about workflow and timeline', () => {
    const { container } = renderPage(<AboutPage site={polishSite} />);

    expect(container.querySelector('.visual-panel[data-page="about"]')).toBeInTheDocument();
    expect(container.querySelector('.about-workflow__steps')).toBeInTheDocument();
    expect(container.querySelectorAll('.about-workflow__orb img')).toHaveLength(5);
    const sectionHeadings = Array.from(container.querySelectorAll('.about-page > .about-section .section-heading h2'));
    const sectionIndexes = Array.from(container.querySelectorAll('.about-page > .about-section .section-heading > span'));

    expect(sectionHeadings).toHaveLength(2);
    expect(sectionHeadings.every((heading) => Boolean(heading.textContent?.trim()))).toBe(true);
    expect(sectionIndexes).toHaveLength(2);
    expect(sectionIndexes.every((index) => /^\d{2}$/.test(index.textContent ?? ''))).toBe(true);
    expect(container.querySelector('.about-process__visual img')).toBeInTheDocument();
    expect(container.querySelectorAll('.about-timeline__thumb img')).toHaveLength(4);
  });

  it('renders inline Markdown in prose content outside the hero lead', () => {
    const { container } = renderPage(<AboutPage site={polishSite} />);
    const workflowIntro = container.querySelector<HTMLElement>('.about-section--workflow .section-heading p');

    if (!workflowIntro) {
      throw new Error('Workflow intro is missing.');
    }

    expect(workflowIntro.querySelector('strong')).toBeInTheDocument();
    expect(workflowIntro.textContent).not.toContain('**');
  });

  it('renders localized RepoAtlas links to the case study', () => {
    const about = renderPage(<AboutPage site={polishSite} />);
    const aboutLink = about.container.querySelector<HTMLAnchorElement>('a[href="/pl/projects?caseStudy=repoatlas"]');

    expect(aboutLink).toBeInTheDocument();
    if (!aboutLink) {
      return;
    }
    expect(aboutLink.querySelectorAll('.content-link__icon')).toHaveLength(1);
    about.unmount();

    const skills = renderPage(<SkillsPage site={polishSite} />);
    const skillsLink = skills.container.querySelector<HTMLAnchorElement>('a[href="/pl/projects?caseStudy=repoatlas"]');

    expect(skillsLink).toBeInTheDocument();
    if (!skillsLink) {
      return;
    }
    expect(skillsLink.querySelectorAll('svg')).toHaveLength(2);
  });

  it('links the GPT IMG-2 example to its case study', () => {
    const { container } = renderPage(<SkillsPage site={polishSite} />);
    const projectLink = container.querySelector<HTMLAnchorElement>(
      'a[href="/pl/projects?caseStudy=gpt_img_2-spritesheet-processor"]',
    );

    expect(projectLink).toBeInTheDocument();
  });

  it('reveals the complete example process on demand', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<AboutPage site={polishSite} />);
    const reveal = container.querySelector('.about-process__grid-reveal');
    const viewport = container.querySelector('.about-process__grid-viewport');
    const toggle = screen.getByRole('button', { name: polishSite.messages.content.expandProcess });

    expect(reveal).not.toHaveClass('is-expanded');
    expect(viewport).toHaveAttribute('aria-hidden', 'true');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(reveal).toHaveClass('is-expanded');
    expect(viewport).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByRole('button', { name: polishSite.messages.content.collapseProcess })).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the custom skills boundary section and blog card rail', () => {
    const { container, unmount } = renderPage(<SkillsPage site={polishSite} />);

    expect(container.querySelector('.solution-boundary')).toBeInTheDocument();
    expect(container.querySelector('.solution-boundary h1')).toHaveTextContent(/\S/);
    expect(container.querySelector('.solution-boundary .page-eyebrow')).toHaveTextContent(/\S/);
    expect(container.querySelectorAll('.solution-boundary__layer')).toHaveLength(4);
    expect(container.querySelectorAll('.solution-boundary__principle')).toHaveLength(4);

    unmount();
    const blog = renderPage(<BlogPage site={polishSite} />);
    expect(blog.container.querySelector('.visual-panel[data-page="blog"]')).toBeInTheDocument();
    expect(blog.container.querySelectorAll('.visual-panel__blog-shapes .blog-visual-card')).toHaveLength(3);
  });

  it('synchronizes hover highlighting between boundary layers and principles', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<SkillsPage site={polishSite} />);
    const layers = container.querySelectorAll<HTMLElement>('.solution-boundary__layer');
    const principles = container.querySelectorAll<HTMLElement>('.solution-boundary__principle');
    const secondPrinciple = principles[1];
    const thirdLayer = layers[2];

    if (!secondPrinciple || !thirdLayer) {
      throw new Error('Expected four boundary pairs.');
    }

    await user.hover(secondPrinciple);

    layers.forEach((layer, index) => {
      expect(layer).toHaveClass(index === 1 ? 'is-active' : 'is-muted');
    });
    principles.forEach((principle, index) => {
      expect(principle).toHaveClass(index === 1 ? 'is-active' : 'is-muted');
    });

    await user.hover(thirdLayer);

    expect(layers[2]).toHaveClass('is-active');
    expect(principles[2]).toHaveClass('is-active');
    expect(layers[1]).toHaveClass('is-muted');
    expect(principles[1]).toHaveClass('is-muted');

    await user.click(thirdLayer);
    await user.unhover(thirdLayer);

    expect(container.querySelectorAll('.solution-boundary__layer.is-active')).toHaveLength(0);
    expect(container.querySelectorAll('.solution-boundary__principle.is-muted')).toHaveLength(0);
  });

  it('renders the technologies section directly after the solution boundary', () => {
    const { container } = renderPage(<SkillsPage site={polishSite} />);
    const stack = polishSite.portfolio.skills.stack;
    const stackTools = stack.bands.flatMap((band) => band.tools);
    const sections = Array.from(container.querySelectorAll('.detail-main__route-layer > section'));
    const boundaryIndex = sections.findIndex((section) => section.classList.contains('solution-boundary'));
    const technologyIndex = sections.findIndex((section) => section.querySelector('.skills-tools'));

    expect(container.querySelector('.skills-tools')).toBeInTheDocument();
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
    expect(skills.container.querySelector('.footer-cta__link[href="/pl/projects"]')).toBeInTheDocument();
    skills.unmount();

    const projects = renderPage(<ProjectsPage site={polishSite} />);
    expect(projects.container.querySelector('.statement')).not.toBeInTheDocument();
  });

  it('keeps every technology content entry linked to a registered tag', () => {
    const stack = polishSite.portfolio.skills.stack;
    const stackTools = stack.bands.flatMap((band) => band.tools);
    expect(stack.bands.length).toBeGreaterThan(0);
    expect(stack.bands.every((band) => band.title.trim().length > 0 && band.tools.length > 0)).toBe(true);
    expect(new Set(stackTools).size).toBe(stackTools.length);
    expect(stackTools.every((tool) => getTechTagDefinition(tool))).toBe(true);
    expect(getTechTagDefinition('__missing_technology__')).toBeUndefined();
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
