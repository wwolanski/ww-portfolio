import { afterEach, describe, expect, it } from 'vitest';

import { preloadDetailHeroFonts } from '../styles/preloadFonts';

function getFontPreloads() {
  return document.head.querySelectorAll('link[data-font-preload]');
}

afterEach(() => {
  getFontPreloads().forEach((link) => link.remove());
});

describe('detail-page font preloads', () => {
  it('preloads both Anton subsets for Polish detail-page heroes', () => {
    preloadDetailHeroFonts('/pl/about');

    expect(getFontPreloads()).toHaveLength(2);
  });

  it('preloads only the Latin Anton subset for English detail-page heroes', () => {
    preloadDetailHeroFonts('/en/projects');

    expect(getFontPreloads()).toHaveLength(1);
  });
});
