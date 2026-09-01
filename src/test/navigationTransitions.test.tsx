import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../app/App';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { getSiteContent } from '../content/siteContent';
import { ThemeProvider } from '../features/theme/ThemeProvider';

const polishSite = getSiteContent('pl');

function NavigationFixture() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <output data-testid="location">{location.pathname}</output>
      <button type="button" onClick={() => { void navigate('/pl'); }}>
        Open home
      </button>
    </>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('navigation transitions', () => {
  it('keeps scroll and route layers unchanged when switching locale', async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const { container } = render(
      <MemoryRouter initialEntries={['/pl/projects']}>
        <ThemeProvider><App /></ThemeProvider>
      </MemoryRouter>,
    );
    const detailPage = container.querySelector('.detail-page');
    const siteNav = container.querySelector('.site-nav');
    scrollTo.mockClear();

    await user.click(screen.getByRole('link', {
      name: polishSite.messages.language.switchTo(polishSite.messages.language.english),
    }));

    expect(container.querySelector('.language-switcher__option[href="/pl/projects"]')).toBeInTheDocument();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(container.querySelector('.detail-page')).toBe(detailPage);
    expect(container.querySelector('.site-nav')).toBe(siteNav);
    expect(container.querySelectorAll('.visual-panel__route-layer')).toHaveLength(1);
    expect(container.querySelectorAll('.detail-main__route-layer')).toHaveLength(1);
  });

  it('scrolls immediately when navigating to the static home route', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    render(
      <MemoryRouter initialEntries={['/pl/projects']}>
        <NavigationFixture />
      </MemoryRouter>,
    );
    scrollTo.mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Open home' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/pl');
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });

  it('scrolls between the exiting and entering detail layers', async () => {
    const user = userEvent.setup();
    let incomingLayerWasMountedAtScroll = false;
    const { container } = render(
      <MemoryRouter initialEntries={['/pl/about']}>
        <ThemeProvider><App /></ThemeProvider>
      </MemoryRouter>,
    );
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {
      incomingLayerWasMountedAtScroll = Boolean(container.querySelector('.detail-main__route-layer[data-page="projects"]'));
    });

    const projectsLink = container.querySelector<HTMLAnchorElement>('a[href="/pl/projects"]');

    if (!projectsLink) {
      throw new Error('Projects navigation link is missing.');
    }

    await user.click(projectsLink);

    expect(scrollTo).not.toHaveBeenCalled();
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' }));
    expect(incomingLayerWasMountedAtScroll).toBe(false);
  });
});
