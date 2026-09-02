import { afterEach, describe, expect, it } from 'vitest';

import { preloadDetailHeroFonts, preloadHomeFonts } from '../styles/preloadHomeFonts';

function getFontPreloads() {
  return document.head.querySelectorAll('link[data-font-preload]');
}

afterEach(() => {
  getFontPreloads().forEach((link) => link.remove());
});

describe('home font preloads', () => {
  it('preloads the Latin and Polish extension fonts on the Polish home page', () => {
    preloadHomeFonts('/pl');

    expect(getFontPreloads()).toHaveLength(7);
  });

  it('preloads only Latin fonts on the English home page', () => {
    preloadHomeFonts('/en');

    expect(getFontPreloads()).toHaveLength(4);
  });

  it('skips detail routes and duplicate home preloads', () => {
    preloadHomeFonts('/pl/projects');
    expect(getFontPreloads()).toHaveLength(0);

    preloadHomeFonts('/pl');
    preloadHomeFonts('/pl');
    expect(getFontPreloads()).toHaveLength(7);
  });

  it('preloads both Anton subsets for Polish detail-page heroes', () => {
    preloadDetailHeroFonts('/pl/about');

    expect(getFontPreloads()).toHaveLength(2);
  });

  it('preloads only the Latin Anton subset for English detail-page heroes', () => {
    preloadDetailHeroFonts('/en/projects');

    expect(getFontPreloads()).toHaveLength(1);
  });
});
