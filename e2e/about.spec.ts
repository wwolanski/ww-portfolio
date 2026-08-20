import { expect, test } from '@playwright/test';

test.describe('about page layout', () => {
  test('keeps the intro and timeline sections aligned', async ({ page }) => {
    await page.goto('/pl/about');

    const introSection = page.locator('.about-section--intro');
    const timelineSection = page.locator('.about-section--timeline');
    const timeline = timelineSection.locator('.timeline-enhanced');

    await expect(page.getByRole('heading', { name: /Cześć.*Wojciech/i })).toBeVisible();
    await expect(introSection).toBeVisible();
    await expect(timelineSection).toBeVisible();

    const timelineBox = await timeline.boundingBox();
    const timelineSectionBox = await timelineSection.boundingBox();

    if (!timelineBox || !timelineSectionBox) {
      throw new Error('Could not measure the timeline layout.');
    }

    expect(timelineBox.x - timelineSectionBox.x).toBeLessThan(60);

    await expect(introSection).toHaveScreenshot('about-intro.png', {
      animations: 'disabled',
    });
    await expect(timelineSection).toHaveScreenshot('about-timeline.png', {
      animations: 'disabled',
    });
  });
});
