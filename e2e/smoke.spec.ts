import { expect, test, type Page } from '@playwright/test';

async function openPolishHome(page: Page) {
  await page.goto('/pl');
  await expect(page).toHaveURL(/\/pl\/?$/);
  await expect(page.locator('.home-title')).toBeVisible();
}

test.describe('portfolio smoke', () => {
  test('opens the Polish home page and renders the main navigation entry point', async ({ page }) => {
    await openPolishHome(page);

    await expect(page.locator('.home-card__link[href="/pl/blog"]'))
      .toBeVisible();
  });

  test('keeps the full navigation until mobile and opens the title-only WW drawer horizontally', async ({ page }) => {
    await page.goto('/pl/projects');

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(page.locator('.site-links')).toBeVisible();
    await expect(page.locator('.site-nav__menu-trigger')).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });
    const trigger = page.locator('.site-nav__menu-trigger');
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
    await expect(page.locator('.site-nav__drawer-link-icon')).toHaveCount(0);
    await expect(page.locator('.site-nav__drawer-link-description')).toHaveCount(0);
    await expect(page.locator('.site-nav__drawer-link-label')).toHaveText(['O mnie', 'Projekty', 'Skills', 'Blog']);
    await expect(page.locator('.site-nav__drawer-link[aria-current="page"]')).toHaveCSS('color', 'rgb(244, 165, 28)');
  });
});
