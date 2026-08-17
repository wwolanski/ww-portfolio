import aboutImage from '../../img/1.png';
import projectsImage from '../../img/2.png';
import skillsImage from '../../img/3.png';
import blogImage from '../../img/4.png';

import type { Locale } from '../routing/locale';
import type { Messages } from './messages';

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

const descriptions = {
  en: {
    about: 'Who I am, what I build, and how I think about software.',
    projects: 'Selected web, backend, and AI projects with real impact.',
    skills: 'Technologies, tools, and problem-solving strengths I use every day.',
    blog: 'Notes, tutorials, and insights on development, architecture, and AI.',
  },
  pl: {
    about: 'Kim jestem, co tworzę i jak myślę o oprogramowaniu.',
    projects: 'Wybrane projekty webowe, backendowe i AI z realnym wpływem.',
    skills: 'Technologie, narzędzia i sposoby rozwiązywania problemów, których używam na co dzień.',
    blog: 'Notatki, poradniki i spostrzeżenia o programowaniu, architekturze i AI.',
  },
} as const satisfies Record<Locale, Record<PageSlug, string>>;

export function getNavigationItems(messages: Messages, locale: Locale): readonly NavigationItem[] {
  return navigationMeta.map((item) => ({
    ...item,
    label: messages.nav[item.slug],
    href: `/${item.slug}`,
    description: descriptions[locale][item.slug],
  }));
}

export function getNavigationItem(items: readonly NavigationItem[], slug: PageSlug): NavigationItem {
  const item = items.find((entry) => entry.slug === slug);

  if (!item) {
    throw new Error(`Unknown navigation item: ${slug}`);
  }

  return item;
}
