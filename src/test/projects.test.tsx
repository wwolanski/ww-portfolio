import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { MdxContent } from '../components/content/MdxContent';
import { ProjectCaseStudy } from '../components/content/ProjectCaseStudy';
import { getContentImages } from '../content/mdx/imageAssets';
import * as contentLoader from '../content/mdx/loader';
import { loadContent } from '../content/mdx/loader';
import Kukla2DFixture from '../content/locales/pl/projects/kukla2d/pl.mdx';
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

describe('project content system', () => {
  it('renders the abandoned project as a regular list row with actions for every project', () => {
    const { container } = renderPage(<ProjectsPage site={polishSite} />);

    expect(container.querySelectorAll('.project-row')).toHaveLength(6);
    expect(container.querySelector('.prototype-failure-box')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /otwórz (opis projektu|case study):/i })).toHaveLength(6);
  });

  it('opens the Sprite case study, renders MDX content, and restores focus on close', async () => {
    const user = userEvent.setup();
    renderPage(<ProjectsPage site={polishSite} />);

    const trigger = screen.getByRole('button', { name: /otwórz case study: sprite stabilization pipeline/i });
    await user.click(trigger);

    expect(await screen.findByRole('dialog', { name: 'Sprite Stabilization Pipeline' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Sprite Stabilization Pipeline' })).toBeInTheDocument();
    expect(spriteImages).toHaveLength(3);
    const gallery = await screen.findByRole('region', { name: 'Galeria obrazów' });
    expect(gallery).toBeInTheDocument();
    expect(gallery.querySelector('.mdx-image-gallery__frame button')).not.toBeInTheDocument();
    expect(screen.getByText(`1/${spriteImages.length}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Poprzedni obraz' })).toBeInTheDocument();
    const nextImageButton = screen.getByRole('button', { name: 'Następny obraz' });
    expect(nextImageButton).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('button', { name: /zamknij okno/i })).toHaveFocus();

    await user.click(nextImageButton);
    expect(screen.getByText(`2/${spriteImages.length}`)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Poprzedni obraz' }));
    expect(screen.getByText(`1/${spriteImages.length}`)).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('shows a centered placeholder for projects without an MDX document', async () => {
    const user = userEvent.setup();
    renderPage(<ProjectsPage site={polishSite} />);

    await user.click(screen.getByRole('button', { name: /otwórz opis projektu: bank statement converter/i }));

    expect(await screen.findByText('Opis projektu jest w przygotowaniu.')).toBeInTheDocument();
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

    await user.click(screen.getByRole('button', { name: /otwórz opis projektu: bank statement converter/i }));
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

    expect(screen.getByText('This project description is currently available only in Polish.')).toBeInTheDocument();
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

    expect(await screen.findByRole('alert')).toHaveTextContent('Nie udało się wczytać opisu projektu.');
    loadContentSpy.mockRestore();
  });

  it('renders the complete Kukla2D MDX fixture through shared components', () => {
    const { container } = renderPage(
      <MdxContent
        document={{ Component: Kukla2DFixture, frontmatter: { title: 'Kukla2D — fixture warstwy MDX' } }}
        messages={polishSite.messages}
      />,
    );

    expect(container.querySelector('h1')).toBeInTheDocument();
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
});
