import aboutImage from '../../img/1.png';
import projectsImage from '../../img/2.png';
import skillsImage from '../../img/3.png';
import blogImage from '../../img/4.png';

export type PageSlug = 'about' | 'projects' | 'skills' | 'blog';

export type NavigationItem = {
  readonly slug: PageSlug;
  readonly label: string;
  readonly href: `/${PageSlug}`;
  readonly image: string;
  readonly description: string;
  readonly accent: string;
};

export const navigationItems = [
  {
    slug: 'about',
    label: 'About',
    href: '/about',
    image: aboutImage,
    description: 'Who I am, what I build, and how I think about software.',
    accent: '#28a19a',
  },
  {
    slug: 'projects',
    label: 'Projects',
    href: '/projects',
    image: projectsImage,
    description: 'Selected web, backend, and AI projects with real impact.',
    accent: '#f4a51c',
  },
  {
    slug: 'skills',
    label: 'Skills',
    href: '/skills',
    image: skillsImage,
    description: 'Technologies, tools, and problem-solving strengths I use every day.',
    accent: '#f04418',
  },
  {
    slug: 'blog',
    label: 'Blog',
    href: '/blog',
    image: blogImage,
    description: 'Notes, tutorials, and insights on development, architecture, and AI.',
    accent: '#13b6d0',
  },
] satisfies readonly NavigationItem[];

export function getNavigationItem(slug: PageSlug): NavigationItem {
  const item = navigationItems.find((entry) => entry.slug === slug);

  if (!item) {
    throw new Error(`Unknown navigation item: ${slug}`);
  }

  return item;
}
