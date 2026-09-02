import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MdxContent } from '../components/content/MdxContent';
import { ProjectCaseStudy } from '../components/content/ProjectCaseStudy';
import { getContentImages } from '../content/mdx/imageAssets';
import * as contentLoader from '../content/mdx/loader';
import { loadContent } from '../content/mdx/loader';
import OrderHubFixture from '../content/locales/pl/projects/orderhub-pos-wms/pl.mdx';
import { getProjectLogo } from '../content/projectLogos';
import { getSiteContent } from '../content/siteContent';
import { ProjectsPageContent } from '../pages/projects/ProjectsPage';
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
const projects = polishSite.portfolio.projects.selected.projects;
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

function getProjectRow(container: HTMLElement, slug: string): HTMLElement {
  const row = container.querySelector<HTMLElement>(`[data-project-slug="${slug}"]`);

  if (!row) {
    throw new Error(`Project row ${slug} is missing.`);
  }

  return row;
}

function getProjectContentButton(container: HTMLElement, slug: string): HTMLButtonElement {
  const button = getProjectRow(container, slug).querySelector<HTMLButtonElement>('.project-content-button');

  if (!button) {
    throw new Error(`Project content button ${slug} is missing.`);
  }

  return button;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('project content system', () => {
  it('resolves the OrderHub logo through the slug-bound logo directory', () => {
    expect(getProjectLogo('orderhub-pos-wms')).toMatch(/\/img\/logos\/ohub\//);
    expect(getProjectLogo('bank-statement-converter')).toMatch(/\/img\/logos\/bank-statement-converter\//);
  });

  it('renders the discontinued project as a regular list row with actions for every project', () => {
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);
    const projectsWithExternalLink = projects.filter((project) => project.externalLink);
    const projectsWithGallery = projects.filter((project) => !project.externalLink);

    expect(container.querySelectorAll('.project-row')).toHaveLength(projects.length);
    expect(container.querySelectorAll('.project-logo')).toHaveLength(projects.length);
    expect(container.querySelector('[data-project-slug="orderhub-pos-wms"] .project-meta .project-logo img')).toBeInTheDocument();
    expect(container.querySelector('[data-project-slug="orderhub-pos-wms"] .project-body .project-logo')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.project-title-row .project-content-button')).toHaveLength(projects.length);
    expect(container.querySelectorAll('.project-body > .project-content-button')).toHaveLength(0);
    expect(container.querySelectorAll('.project-resource-action')).toHaveLength(projects.length);
    expect(container.querySelectorAll('[data-project-action="external"]')).toHaveLength(projectsWithExternalLink.length);
    expect(container.querySelectorAll('[data-project-action="gallery"]')).toHaveLength(projectsWithGallery.length);

    for (const project of projectsWithExternalLink) {
      const externalLink = getProjectRow(container, project.slug).querySelector<HTMLAnchorElement>('[data-project-action="external"]');

      expect(externalLink).toHaveAttribute('href', project.externalLink?.href);
    }
  });

  it('renders every project tag from the JSON configuration', () => {
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);

    for (const project of projects) {
      const row = getProjectRow(container, project.slug);

      expect(Array.from(row.querySelectorAll<HTMLElement>('[data-project-tag]')).map((badge) => badge.dataset.projectTag))
        .toEqual(project.tags);
    }

    expect(container.querySelectorAll('.project-badge')).toHaveLength(projects.flatMap((project) => project.tags).length);
  });

  it('opens a project gallery directly from the list and restores focus on close', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);
    const row = getProjectRow(container, 'bank-statement-converter');
    const trigger = row.querySelector<HTMLButtonElement>('[data-project-action="gallery"]');

    if (!trigger) {
      throw new Error('Project gallery trigger is missing.');
    }

    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: polishSite.messages.content.imageGallery.label });
    expect(within(dialog).getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: polishSite.messages.content.imageGallery.close })).toHaveFocus();
    expect(document.documentElement).toHaveClass('is-scroll-locked');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog', { name: polishSite.messages.content.imageGallery.label })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(document.documentElement).not.toHaveClass('is-scroll-locked');
  });

  it('opens the Sprite case study, renders MDX content, and restores focus on close', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);

    const trigger = getProjectContentButton(container, spriteProject.slug);
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(await within(dialog).findByRole('heading', { level: 1 })).toHaveTextContent(/\S/);
    expect(screen.getByRole('button', { name: polishSite.messages.projectContent.close })).toHaveFocus();
    const tableOfContents = await screen.findByRole('navigation', { name: polishSite.messages.content.tableOfContents });
    const tableOfContentsToggle = screen.getByRole('button', { name: polishSite.messages.content.openTableOfContents });
    await user.click(tableOfContentsToggle);
    expect(tableOfContentsToggle).toHaveAttribute('aria-expanded', 'true');
    expect(tableOfContents).toHaveClass('mdx-toc--open');
    const tocLinks = within(tableOfContents).getAllByRole('link');
    const firstTocLink = tocLinks[0];
    const secondTocLink = tocLinks[1];
    const firstHeadingId = firstTocLink?.getAttribute('href')?.slice(1);
    const firstHeading = firstHeadingId ? document.getElementById(firstHeadingId) : null;

    if (!firstTocLink || !secondTocLink || !(firstHeading instanceof HTMLElement)) {
      throw new Error('The generated table of contents is missing heading targets.');
    }

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
    Object.defineProperty(firstHeading, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 300 }),
    });
    await user.click(firstTocLink);
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ behavior: 'smooth', top: 312 }));
    expect(firstTocLink).toHaveAttribute('aria-current', 'location');

    const tocTargets = tocLinks
      .map((link) => link.getAttribute('href')?.slice(1))
      .map((id) => (id ? document.getElementById(id) : null))
      .filter((heading): heading is HTMLElement => heading instanceof HTMLElement);

    tocTargets.forEach((heading, index) => {
      const top = index === 0 ? -120 : index === 1 ? 160 : 320;
      Object.defineProperty(heading, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({ top }),
      });
    });

    modalBody.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(secondTocLink).toHaveAttribute('aria-current', 'location');
    });

    expect(spriteImages.length).toBeGreaterThan(0);
    const gallery = await screen.findByRole('region', { name: polishSite.messages.content.imageGallery.label });
    expect(gallery).toBeInTheDocument();
    expect(gallery.querySelector('.mdx-image-gallery__expand')).toBeInTheDocument();
    expect(screen.getByText(`1/${spriteImages.length}`)).toBeInTheDocument();
    const previousImageButton = screen.queryByRole('button', { name: polishSite.messages.content.imageGallery.previous });
    const nextImageButton = screen.queryByRole('button', { name: polishSite.messages.content.imageGallery.next });
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

  it('opens the image lightbox from the case study gallery, navigates it, and restores focus on close', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);

    await user.click(getProjectContentButton(container, spriteProject.slug));
    const gallery = await screen.findByRole('region', { name: polishSite.messages.content.imageGallery.label });
    const expandButton = gallery.querySelector<HTMLButtonElement>('.mdx-image-gallery__expand');

    if (!expandButton) {
      throw new Error('Gallery expand button is missing.');
    }

    await user.click(expandButton);

    const lightbox = await screen.findByRole('dialog', { name: polishSite.messages.content.imageGallery.label });
    const overlay = lightbox.closest('.image-lightbox');

    if (!(overlay instanceof HTMLElement)) {
      throw new Error('Image lightbox overlay is missing.');
    }

    expect(lightbox.querySelector('img')).toBeInTheDocument();
    expect(within(overlay).getByRole('button', { name: polishSite.messages.content.imageGallery.close })).toHaveFocus();
    expect(document.documentElement).toHaveClass('is-scroll-locked');

    if (spriteImages.length > 1) {
      await user.click(within(overlay).getByRole('button', { name: polishSite.messages.content.imageGallery.next }));
      expect(lightbox.querySelector('img')).toBeInTheDocument();
      expect(within(lightbox).getByText(`2/${spriteImages.length}`)).toBeInTheDocument();

      await user.keyboard('{ArrowLeft}');
      expect(within(lightbox).getByText(`1/${spriteImages.length}`)).toBeInTheDocument();

      await user.keyboard('{ArrowRight}');
      expect(within(lightbox).getByText(`2/${spriteImages.length}`)).toBeInTheDocument();
    }

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog', { name: polishSite.messages.content.imageGallery.label })).not.toBeInTheDocument());
    expect(expandButton).toHaveFocus();
    expect(document.documentElement).toHaveClass('is-scroll-locked');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.documentElement).not.toHaveClass('is-scroll-locked');
  });

  it('opens a single OrderHub article image in the shared lightbox preview', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(
      <MdxContent
        document={{ Component: OrderHubFixture, frontmatter: { title: 'OrderHub' } }}
        messages={polishSite.messages}
        scope={{ type: 'project', slug: 'orderhub-pos-wms', locale: 'pl' }}
      />,
    );

    const trigger = container.querySelector<HTMLButtonElement>('.mdx-image-preview');

    if (!trigger) {
      throw new Error('Single image preview trigger is missing.');
    }

    expect(trigger.querySelector('img')).toBeInTheDocument();

    expect(trigger).toHaveClass('mdx-image-preview');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');

    await user.click(trigger);

    const lightbox = await screen.findByRole('dialog', { name: polishSite.messages.content.imageGallery.label });
    const overlay = lightbox.closest('.image-lightbox');

    if (!(overlay instanceof HTMLElement)) {
      throw new Error('Image lightbox overlay is missing.');
    }

    expect(lightbox.querySelector('img')).toBeInTheDocument();
    expect(within(overlay).queryByRole('button', { name: polishSite.messages.content.imageGallery.previous })).not.toBeInTheDocument();
    expect(within(overlay).queryByRole('button', { name: polishSite.messages.content.imageGallery.next })).not.toBeInTheDocument();
    expect(within(overlay).getByRole('button', { name: polishSite.messages.content.imageGallery.close })).toHaveFocus();
    expect(document.documentElement).toHaveClass('is-scroll-locked');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog', { name: polishSite.messages.content.imageGallery.label })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(document.documentElement).not.toHaveClass('is-scroll-locked');
    expect(container.querySelector('.mdx-image-preview')).toBeInTheDocument();
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
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);

    await user.click(getProjectContentButton(container, spriteProject.slug));
    const toggle = await screen.findByRole('button', { name: polishSite.messages.content.openTableOfContents });
    const article = document.querySelector<HTMLElement>('.project-modal .mdx-content');
    const scrollViewport = document.querySelector<HTMLElement>('.project-modal__body');

    if (!article || !scrollViewport) {
      throw new Error('Mobile project content shell is missing.');
    }

    await user.click(toggle);

    await waitFor(() => {
      expect(scrollViewport).toHaveClass('is-toc-open');
      expect(article).toHaveAttribute('inert');
      expect(screen.getByRole('navigation', { name: polishSite.messages.content.tableOfContents })).toHaveClass('mdx-toc--open');
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(scrollViewport).not.toHaveClass('is-toc-open');
      expect(article).not.toHaveAttribute('inert');
      expect(toggle).toHaveFocus();
    });
  });

  it('opens the Bank Statement Converter case study from its MDX document', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);

    await user.click(getProjectContentButton(container, 'bank-statement-converter'));

    const dialog = await screen.findByRole('dialog');

    await waitFor(() => expect(dialog.querySelector('.mdx-content')).toBeInTheDocument());
    expect(await within(dialog).findByRole('heading', { level: 1 })).toHaveTextContent(/\S/);
  });

  it('opens the requested case study from the URL query parameter', async () => {
    render(
      <MemoryRouter initialEntries={['/pl/projects?caseStudy=gpt_img_2-spritesheet-processor']}>
        <ThemeProvider><ProjectsPageContent site={polishSite} /></ThemeProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('closes the modal when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<ProjectsPageContent site={polishSite} />);

    await user.click(getProjectContentButton(container, 'bank-statement-converter'));
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

    const { container } = renderPage(
      <ProjectCaseStudy
        project={spriteProject}
        locale="en"
        messages={englishSite.messages}
        onViewPolish={onViewPolish}
      />,
    );

    const localeState = container.querySelector('.content-document-state--locale');
    const localeAction = container.querySelector<HTMLButtonElement>('.content-document-state__action');

    expect(localeState).toBeInTheDocument();
    expect(localeState?.querySelector('p')).toHaveTextContent(/\S/);
    expect(localeAction?.querySelector(':scope > span:last-child')).toHaveTextContent(/\S/);
    expect(localeAction).toBeInTheDocument();
    if (!localeAction) {
      return;
    }

    await user.click(localeAction);
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

    expect(await screen.findByRole('alert')).toHaveTextContent(polishSite.messages.projectContent.error);
    loadContentSpy.mockRestore();
  });

  it('keeps legacy case-study heading levels in the correct TOC branches', async () => {
    renderPage(
      <MdxContent
        document={{ Component: OrderHubFixture, frontmatter: { title: 'OrderHub' } }}
        messages={polishSite.messages}
      />,
    );

    const tableOfContents = await screen.findByRole('navigation', { name: polishSite.messages.content.tableOfContents });
    const article = document.querySelector<HTMLElement>('.mdx-content');

    if (!article) {
      throw new Error('Rendered MDX article is missing.');
    }

    const allHeadings = Array.from(article.querySelectorAll<HTMLHeadingElement>('h1, h2, h3'));
    const contentHeadings = allHeadings[0]?.tagName === 'H1' ? allHeadings.slice(1) : allHeadings;
    const tocLinks = within(tableOfContents).getAllByRole('link');
    const tocTargets = tocLinks.map((link) => link.getAttribute('href'));

    expect(contentHeadings.length).toBeGreaterThan(0);
    expect(tocTargets).toEqual(contentHeadings.map((heading) => `#${heading.id}`));
    expect(tableOfContents.querySelector('.mdx-toc__nested-list')).toBeInTheDocument();

    for (const item of tableOfContents.querySelectorAll<HTMLElement>('.mdx-toc__item')) {
      const targetId = item.querySelector<HTMLAnchorElement>('.mdx-toc__link')?.getAttribute('href')?.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;

      expect(target).toBeInstanceOf(HTMLHeadingElement);
      if (target) {
        expect(item).toHaveClass(`mdx-toc__item--level-${target.tagName.slice(1)}`);
      }
    }
  });
});
