import aboutImage from '../../../img/detail-about.webp';
import projectsImage from '../../../img/detail-projects.webp';
import skillsImage from '../../../img/detail-skills.webp';

import type { PageSlug } from '../../content/navigation';

export const visualPanelImages: Partial<Record<PageSlug, string>> = {
  about: aboutImage,
  projects: projectsImage,
  skills: skillsImage,
};

/** Start fetching every raster used by the detail-page visual panel. */
export function preloadVisualPanelImages() {
  const existingUrls = new Set(
    Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[data-visual-panel-preload]'))
      .map((link) => link.href),
  );

  for (const href of Object.values(visualPanelImages)) {
    const absoluteHref = new URL(href, document.baseURI).href;

    if (existingUrls.has(absoluteHref)) {
      continue;
    }

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = href;
    preload.dataset.visualPanelPreload = '';
    document.head.append(preload);
    existingUrls.add(absoluteHref);
  }
}
