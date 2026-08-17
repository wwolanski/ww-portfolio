import aboutImage from '../../img/1.png';
import projectsImage from '../../img/2.png';
import skillsImage from '../../img/3.png';
import blogImage from '../../img/4.png';

import type { HomeContent } from './types';

export type PageSlug = 'about' | 'projects' | 'skills' | 'blog';

type NavigationMeta = {
  readonly slug: PageSlug;
  readonly image: string;
  readonly accent: string;
};

export type NavigationItem = NavigationMeta & {
  readonly label: string;
  readonly href: `/${PageSlug}`;
  readonly description: string;
};

const navigationMeta = [
  { slug: 'about', image: aboutImage, accent: '#28a19a' },
  { slug: 'projects', image: projectsImage, accent: '#f4a51c' },
  { slug: 'skills', image: skillsImage, accent: '#f04418' },
  { slug: 'blog', image: blogImage, accent: '#13b6d0' },
] as const satisfies readonly NavigationMeta[];

export function getNavigationItems(cards: HomeContent['cards']): readonly NavigationItem[] {
  return navigationMeta.map((item) => ({
    ...item,
    label: cards[item.slug].label,
    href: `/${item.slug}`,
    description: cards[item.slug].description,
  }));
}

export function getNavigationItem(items: readonly NavigationItem[], slug: PageSlug): NavigationItem {
  const item = items.find((entry) => entry.slug === slug);

  if (!item) {
    throw new Error(`Unknown navigation item: ${slug}`);
  }

  return item;
}
