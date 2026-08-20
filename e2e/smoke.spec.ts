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

  test('matches the Polish home page visual baseline', async ({ page }) => {
    await openPolishHome(page);

    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
