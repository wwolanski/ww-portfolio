import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MdxContent } from '../components/content/MdxContent';
import { ProjectCaseStudy } from '../components/content/ProjectCaseStudy';
import { getContentImages } from '../content/mdx/imageAssets';
import * as contentLoader from '../content/mdx/loader';
import { loadContent } from '../content/mdx/loader';
import Kukla2DFixture from '../content/locales/pl/projects/kukla2d/pl.mdx';
import OrderHubFixture from '../content/locales/pl/projects/orderhub-pos-wms/pl.mdx';
import { getProjectLogo } from '../content/projectLogos';
import { getSiteContent } from '../content/siteContent';
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { ThemeProvider } from '../features/theme/ThemeProvider';

function renderPage(page: React.ReactNode) {
  return render(
    <MemoryRouter>
      <ThemeProvider>{page}</ThemeProvider>
    </MemoryRouter>,
  );
}

const polishSite = getSiteContent('pl');
const englishSite = getSiteContent('en');
const spriteProject = polishSite.portfolio.projects.selected.projects.find(
  (project) => project.slug === 'gpt_img_2-spritesheet-processor',
);

if (!spriteProject) {
  throw new Error('Sprite project fixture is missing.');
}

const spriteImages = getContentImages({
  type: 'project',
  slug: 'gpt_img_2-spritesheet-processor',
  locale: 'pl',
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('project content system', () => {
  it('resolves the OrderHub logo through the slug-bound logo directory', () => {
    expect(getProjectLogo('orderhub-pos-wms')).toMatch(/\/img\/logos\/ohub\//);
    expect(getProjectLogo('bank-statement-converter')).toMatch(/\/img\/logos\/bank-statement-converter\//);
  });

  it('renders the discontinued project as a regular list row with actions for every project', () => {
    const { container } = renderPage(<ProjectsPage site={polishSite} />);

    expect(container.querySelectorAll('.project-row')).toHaveLength(6);
    expect(container.querySelectorAll('.project-logo')).toHaveLength(6);
    expect(container.querySelector('[data-project-slug="orderhub-pos-wms"] .project-meta .project-logo img')).toBeInTheDocument();
    expect(container.querySelector('[data-project-slug="orderhub-pos-wms"] .project-body .project-logo')).not.toBeInTheDocument();
    expect(container.querySelector('.prototype-failure-box')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /otwórz case-study:/i })).toHaveLength(6);
    expect(container.querySelectorAll('.project-title-row .project-content-button')).toHaveLength(6);
    expect(container.querySelectorAll('.project-body > .project-content-button')).toHaveLength(0);
  });

  it('renders every project tag from the JSON configuration', () => {
    const { container } = renderPage(<ProjectsPage site={polishSite} />);
    const expectedTags = {
      'bank-statement-converter': ['shipped'],
      kukla2d: ['shipped', 'in-development', 'public-beta'],
      taxhelper: ['in-development'],
      repoatlas: ['in-development'],
      'orderhub-pos-wms': ['prototype-paused'],
      'gpt_img_2-spritesheet-processor': ['discontinued', 'public-beta'],
    };

    for (const [slug, tags] of Object.entries(expectedTags)) {
      const row = container.querySelector<HTMLElement>(`[data-project-slug="${slug}"]`);

      if (!row) {
        throw new Error(`Project row ${slug} is missing.`);
      }

      expect(Array.from(row.querySelectorAll<HTMLElement>('[data-project-tag]')).map((badge) => badge.dataset.projectTag))
        .toEqual(tags);
    }

    expect(container.querySelectorAll('.project-badge')).toHaveLength(9);
  });

  it('opens the Sprite case study, renders MDX content, and restores focus on close', async () => {
    const user = userEvent.setup();
    renderPage(<ProjectsPage site={polishSite} />);

    const trigger = screen.getByRole('button', { name: /otwórz case-study: sprite stabilization pipeline/i });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Sprite Stabilization Pipeline' });
    expect(dialog).toBeInTheDocument();
    expect(await within(dialog).findByRole('heading', { name: 'Sprite Stabilization Pipeline', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zamknij okno/i })).toHaveFocus();
    const tableOfContents = await screen.findByRole('navigation', { name: 'Spis treści' });
    const tableOfContentsToggle = screen.getByRole('button', { name: 'Otwórz spis treści' });
    await user.click(tableOfContentsToggle);
    expect(tableOfContentsToggle).toHaveAttribute('aria-expanded', 'true');
    expect(tableOfContents).toHaveClass('mdx-toc--open');
    const problemLink = within(tableOfContents).getByRole('link', { name: 'Problem' });
    const problemHeading = screen.getByRole('heading', { name: 'Problem' });
    const modalBody = dialog.closest('.project-modal')?.querySelector<HTMLElement>('.project-modal__body');

    if (!modalBody) {
      throw new Error('Project modal scroll viewport is missing.');
    }

    const scrollTo = vi.fn();
    Object.defineProperty(modalBody, 'scrollTop', { configurable: true, value: 100, writable: true });
    Object.defineProperty(modalBody, 'scrollTo', { configurable: true, value: scrollTo });
    Object.defineProperty(modalBody, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ height: 800, top: 64 }),
    });
    Object.defineProperty(problemHeading, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 300 }),
    });
    await user.click(problemLink);
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ behavior: 'smooth', top: 312 }));
    expect(problemLink).toHaveAttribute('aria-current', 'location');

    screen.getAllByRole('heading').forEach((heading) => {
      const top = heading.textContent === 'Problem' ? -120 : heading.textContent === 'Podejście' ? 160 : 320;
      Object.defineProperty(heading, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top }),
      });
    });

    modalBody.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(within(tableOfContents).getByRole('link', { name: 'Podejście' })).toHaveAttribute(
        'aria-current',
        'location',
      );
    });

    expect(spriteImages.length).toBeGreaterThan(0);
    const gallery = await screen.findByRole('region', { name: 'Galeria obrazów' });
    expect(gallery).toBeInTheDocument();
    expect(gallery.querySelector('.mdx-image-gallery__frame button')).not.toBeInTheDocument();
    expect(screen.getByText(`1/${spriteImages.length}`)).toBeInTheDocument();
    const previousImageButton = screen.queryByRole('button', { name: 'Poprzedni obraz' });
    const nextImageButton = screen.queryByRole('button', { name: 'Następny obraz' });
    if (spriteImages.length > 1) {
      expect(previousImageButton).toBeInTheDocument();
      expect(nextImageButton).toBeInTheDocument();
    } else {
      expect(previousImageButton).not.toBeInTheDocument();
      expect(nextImageButton).not.toBeInTheDocument();
    }
    expect(document.documentElement).toHaveClass('is-scroll-locked');
    expect(tableOfContents).toHaveClass('scrollbar-hidden');

    if (spriteImages.length > 1 && nextImageButton && previousImageButton) {
      await user.click(nextImageButton);
      expect(screen.getByText(`2/${spriteImages.length}`)).toBeInTheDocument();
      await user.click(previousImageButton);
      expect(screen.getByText(`1/${spriteImages.length}`)).toBeInTheDocument();
    }

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.documentElement).not.toHaveClass('is-scroll-locked');
    expect(trigger).toHaveFocus();
  });

  it('gives the mobile table-of-contents drawer its own scroll state and restores focus on close', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 900px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    const user = userEvent.setup();
    renderPage(<ProjectsPage site={polishSite} />);

    await user.click(screen.getByRole('button', { name: /otwórz case-study: sprite stabilization pipeline/i }));
    const toggle = await screen.findByRole('button', { name: 'Otwórz spis treści' });
    const article = await screen.findByRole('heading', { name: 'Sprite Stabilization Pipeline', level: 1 })
      .then((heading) => heading.closest('article'));
    const scrollViewport = document.querySelector<HTMLElement>('.project-modal__body');

    if (!article || !scrollViewport) {
      throw new Error('Mobile project content shell is missing.');
    }

    await user.click(toggle);

    await waitFor(() => {
      expect(scrollViewport).toHaveClass('is-toc-open');
      expect(article).toHaveAttribute('inert');
      expect(screen.getByRole('navigation', { name: 'Spis treści' })).toHaveClass('mdx-toc--open');
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(scrollViewport).not.toHaveClass('is-toc-open');
      expect(article).not.toHaveAttribute('inert');
      expect(toggle).toHaveFocus();
    });
  });

  it('shows a centered placeholder for projects without an MDX document', async () => {
    const user = userEvent.setup();
    renderPage(<ProjectsPage site={polishSite} />);

    await user.click(screen.getByRole('button', { name: /otwórz case-study: bank statement converter/i }));

    expect(await screen.findByText('Case-study jest w przygotowaniu.')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Bank Statement Converter' })).toBeInTheDocument();
  });

  it('opens the requested case study from the URL query parameter', async () => {
    render(
      <MemoryRouter initialEntries={['/pl/projects?caseStudy=gpt_img_2-spritesheet-processor']}>
        <ThemeProvider><ProjectsPage site={polishSite} /></ThemeProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('dialog', { name: 'Sprite Stabilization Pipeline' })).toBeInTheDocument();
  });

  it('closes the modal when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<ProjectsPage site={polishSite} />);

    await user.click(screen.getByRole('button', { name: /otwórz case-study: bank statement converter/i }));
    const backdrop = container.ownerDocument.body.querySelector('.project-modal');

    if (!(backdrop instanceof HTMLElement)) {
      throw new Error('Project modal backdrop is missing.');
    }

    await user.click(backdrop);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('shows the Polish-only state and exposes the locale action', async () => {
    const user = userEvent.setup();
    const onViewPolish = vi.fn();

    renderPage(
      <ProjectCaseStudy
        project={spriteProject}
        locale="en"
        messages={englishSite.messages}
        onViewPolish={onViewPolish}
      />,
    );

    expect(screen.getByText('This case-study is currently available only in Polish.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'View Polish version' }));
    expect(onViewPolish).toHaveBeenCalledOnce();
  });

  it('handles missing and failed content without crashing', async () => {
    await expect(loadContent({ type: 'project', slug: 'does-not-exist', locale: 'pl' })).resolves.toBeNull();

    const loadContentSpy = vi.spyOn(contentLoader, 'loadContent').mockRejectedValueOnce(new Error('broken module'));

    renderPage(
      <ProjectCaseStudy
        project={spriteProject}
        locale="pl"
        messages={polishSite.messages}
        onViewPolish={vi.fn()}
      />,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Nie udało się wczytać case-study.');
    loadContentSpy.mockRestore();
  });

  it('renders the complete Kukla2D MDX fixture through shared components', async () => {
    const { container } = renderPage(
      <MdxContent
        document={{ Component: Kukla2DFixture, frontmatter: { title: 'Kukla2D — fixture warstwy MDX' } }}
        messages={polishSite.messages}
      />,
    );

    expect(container.querySelector('h1')).toBeInTheDocument();
    const tableOfContents = await screen.findByRole('navigation', { name: 'Spis treści' });
    expect(within(tableOfContents).getAllByRole('link').length).toBeGreaterThan(0);
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('h3')).toBeInTheDocument();
    expect(container.querySelector('h4')).toBeInTheDocument();
    expect(container.querySelector('h5')).toBeInTheDocument();
    expect(container.querySelector('h6')).toBeInTheDocument();
    expect(container.querySelector('del')).toBeInTheDocument();
    expect(container.querySelector('blockquote')).toBeInTheDocument();
    expect(container.querySelector('hr')).toBeInTheDocument();
    expect(container.querySelector('.mdx-content ul ul')).toBeInTheDocument();
    expect(container.querySelector('.mdx-content ol ul')).toBeInTheDocument();
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelectorAll('.mdx-code-block')).toHaveLength(3);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
    expect(screen.getByText('tekst usunięty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://example.com' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByAltText('Podgląd testowego obrazu Kukla2D')).toHaveAttribute('src', '/img/main.png');

    for (const alertType of ['Note', 'Tip', 'Important', 'Warning', 'Caution']) {
      expect(screen.getByRole('complementary', { name: alertType })).toBeInTheDocument();
    }
  });

  it('keeps legacy case-study heading levels in the correct TOC branches', async () => {
    renderPage(
      <MdxContent
        document={{ Component: OrderHubFixture, frontmatter: { title: 'OrderHub' } }}
        messages={polishSite.messages}
      />,
    );

    const tableOfContents = await screen.findByRole('navigation', { name: 'Spis treści' });
    const wrongLayerLink = within(tableOfContents).getByRole('link', {
      name: 'Zacząłem od niewłaściwej warstwy',
    });
    const differentApproachLink = within(tableOfContents).getByRole('link', {
      name: 'Co zrobiłbym inaczej',
    });
    const differentApproachChildren = differentApproachLink.closest('li')?.querySelector('.mdx-toc__nested-list');

    expect(within(tableOfContents).getByRole('link', { name: 'Błędne założenia' })).toBeInTheDocument();
    expect(differentApproachChildren).toHaveTextContent('1. Najpierw zrozumieć zależności w domenie');
    expect(wrongLayerLink.closest('li')?.querySelector('.mdx-toc__nested-list')).toBeNull();
  });
});
