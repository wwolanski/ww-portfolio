import { afterEach, describe, expect, it } from 'vitest';

import { preloadVisualPanelImages, visualPanelImages } from '../components/layout/preloadVisualPanelImages';

function getVisualPanelPreloads() {
  return document.head.querySelectorAll<HTMLLinkElement>('link[data-visual-panel-preload]');
}

afterEach(() => {
  getVisualPanelPreloads().forEach((link) => link.remove());
});

describe('visual panel image preloads', () => {
  it('preloads all raster panel images immediately', () => {
    preloadVisualPanelImages();

    const preloads = Array.from(getVisualPanelPreloads());
    expect(preloads).toHaveLength(Object.values(visualPanelImages).length);
    expect(preloads.every((link) => link.rel === 'preload' && link.as === 'image')).toBe(true);
  });

  it('does not add duplicate preloads', () => {
    preloadVisualPanelImages();
    preloadVisualPanelImages();

    expect(getVisualPanelPreloads()).toHaveLength(Object.values(visualPanelImages).length);
  });
});
