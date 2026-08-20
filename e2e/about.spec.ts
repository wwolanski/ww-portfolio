import { expect, test } from '@playwright/test';

test.describe('about page layout', () => {
  test('keeps the timeline section aligned', async ({ page }) => {
    await page.goto('/pl/about');

    const timelineSection = page.locator('.about-section--timeline');
    const timeline = timelineSection.locator('.timeline-enhanced');

    await expect(page.getByRole('heading', { name: /Cześć.*Wojciech/i })).toBeVisible();
    await expect(timelineSection).toBeVisible();
    await expect(page.locator('.page-intro br')).toHaveCount(0);

    const timelineBox = await timeline.boundingBox();
    const timelineSectionBox = await timelineSection.boundingBox();

    if (!timelineBox || !timelineSectionBox) {
      throw new Error('Could not measure the timeline layout.');
    }

    expect(timelineBox.x - timelineSectionBox.x).toBeLessThan(60);

    const heroBox = await page.locator('.page-hero').boundingBox();
    const leadBox = await page.locator('.page-intro').boundingBox();
    const headingBox = await page.locator('.about-section--timeline .section-heading').boundingBox();

    if (!heroBox || !leadBox || !headingBox) {
      throw new Error('Could not measure hero-to-section spacing.');
    }

    const heroBottom = heroBox.y + heroBox.height;
    const leadBottom = leadBox.y + leadBox.height;
    const leadToSeparator = heroBottom - leadBottom;
    const separatorToSection = headingBox.y - heroBottom;
    expect(Math.abs(leadToSeparator - separatorToSection)).toBeLessThan(2);

    await expect(timelineSection).toHaveScreenshot('about-timeline.png', {
      animations: 'disabled',
    });
  });
});
