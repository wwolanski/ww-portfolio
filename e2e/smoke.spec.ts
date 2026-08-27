import { expect, test, type Page } from '@playwright/test';

const homeHeading = 'Wojciech Wolanski';

async function openPolishHome(page: Page) {
  await page.goto('/pl');
  await expect(page).toHaveURL(/\/pl\/?$/);
  await expect(page.getByRole('heading', { name: homeHeading })).toBeVisible();
}

test.describe('portfolio smoke', () => {
  test('opens the Polish home page and renders the main navigation entry point', async ({ page }) => {
    await openPolishHome(page);

    await expect(page.getByRole('link', { name: 'Otwórz stronę: Blog' }))
      .toHaveAttribute('href', '/pl/blog');
  });

  test('keeps the full navigation until mobile and opens the WW drawer horizontally', async ({ page }) => {
    await page.goto('/pl/projects');

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(page.locator('.site-links')).toBeVisible();
    await expect(page.locator('.site-nav__menu-trigger')).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });
    const trigger = page.getByRole('button', { name: 'Otwórz nawigację' });
    const wordmark = page.locator('.site-nav__menu-wordmark');
    const menuIcon = trigger.locator('svg');

    await expect(trigger).toBeVisible();
    await expect(page.locator('.site-mark')).toBeHidden();

    const wordmarkBox = await wordmark.boundingBox();
    const menuIconBox = await menuIcon.boundingBox();

    if (!wordmarkBox || !menuIconBox) {
      throw new Error('The mobile WW menu trigger is missing its wordmark or icon.');
    }

    expect(menuIconBox.x).toBeGreaterThan(wordmarkBox.x + wordmarkBox.width);
    expect(Math.abs(menuIconBox.y - wordmarkBox.y)).toBeLessThan(4);

    await trigger.click();

    await expect(page.locator('.site-nav__portal')).toHaveCSS('z-index', '1000');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('.site-nav__drawer-link-icon')).toHaveCount(4);
    await expect(page.locator('.site-nav__drawer-link-description')).toHaveCount(4);
  });
});
