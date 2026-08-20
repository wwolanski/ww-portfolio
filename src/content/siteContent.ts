import type { Locale } from '../routing/locale';
import { getNavigationItems, type NavigationItem } from './navigation';
import { messages, type Messages } from './messages';
import { isProjectTag } from './projectTags';
import enAbout from './locales/en/about.json';
import enBlog from './locales/en/blog.json';
import enHome from './locales/en/home.json';
import enProjects from './locales/en/projects.json';
import enSkills from './locales/en/skills.json';
import plAbout from './locales/pl/about.json';
import plBlog from './locales/pl/blog.json';
import plHome from './locales/pl/home.json';
import plProjects from './locales/pl/projects.json';
import plSkills from './locales/pl/skills.json';
import type { HomeContent, PortfolioContent, Project, ProjectsContent } from './types';

export type SiteContent = {
  readonly locale: Locale;
  readonly messages: Messages;
  readonly home: HomeContent;
  readonly navigation: readonly NavigationItem[];
  readonly portfolio: PortfolioContent;
};

const homeContent = {
  en: enHome,
  pl: plHome,
} satisfies Record<Locale, HomeContent>;

type RawProject = Omit<Project, 'tags'> & {
  readonly tags: readonly string[];
};

type RawProjectsContent = Omit<ProjectsContent, 'selected'> & {
  readonly selected: Omit<ProjectsContent['selected'], 'projects'> & {
    readonly projects: readonly RawProject[];
  };
};

function normalizeProjectsContent(content: RawProjectsContent): ProjectsContent {
  const projects: readonly Project[] = content.selected.projects.map(({ tags, ...project }) => ({
    ...project,
    tags: tags.filter(isProjectTag),
  }));

  return {
    ...content,
    selected: {
      ...content.selected,
      projects,
    },
  };
}

const portfolioContent = {
  en: {
    about: enAbout,
    projects: normalizeProjectsContent(enProjects),
    skills: enSkills,
    blog: enBlog,
  },
  pl: {
    about: plAbout,
    projects: normalizeProjectsContent(plProjects),
    skills: plSkills,
    blog: plBlog,
  },
} satisfies Record<Locale, PortfolioContent>;

export function getSiteContent(locale: Locale): SiteContent {
  const localizedMessages = messages[locale];
  const localizedHome = homeContent[locale];

  return {
    locale,
    messages: localizedMessages,
    home: localizedHome,
    navigation: getNavigationItems(localizedHome.cards),
    portfolio: portfolioContent[locale],
  };
}
