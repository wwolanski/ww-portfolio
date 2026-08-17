import type { Locale } from '../routing/locale';

import enUi from './locales/en/ui.json';
import plUi from './locales/pl/ui.json';

type RawMessages = {
  readonly language: {
    readonly label: string;
    readonly polish: string;
    readonly english: string;
    readonly switchTo: string;
  };
  readonly theme: {
    readonly switchToLight: string;
    readonly switchToDark: string;
  };
  readonly common: {
    readonly skipToContent: string;
    readonly primaryNavigation: string;
    readonly home: string;
    readonly backHome: string;
    readonly artwork: string;
    readonly projectDetails: string;
  };
  readonly actions: {
    readonly openPage: string;
    readonly open: string;
  };
  readonly blog: {
    readonly filterArticles: string;
    readonly all: string;
    readonly readArticle: string;
    readonly newsletterEyebrow: string;
    readonly newsletterTitle: string;
    readonly workEmail: string;
    readonly emailPlaceholder: string;
    readonly subscribe: string;
    readonly readTime: string;
  };
};

export type Messages = {
  readonly language: {
    readonly label: string;
    readonly polish: string;
    readonly english: string;
    readonly switchTo: (language: string) => string;
  };
  readonly theme: {
    readonly switchToLight: string;
    readonly switchToDark: string;
  };
  readonly common: {
    readonly skipToContent: string;
    readonly primaryNavigation: string;
    readonly home: string;
    readonly backHome: string;
    readonly artwork: (label: string) => string;
    readonly projectDetails: (title: string) => string;
  };
  readonly actions: {
    readonly openPage: (label: string) => string;
    readonly open: string;
  };
  readonly blog: {
    readonly filterArticles: string;
    readonly all: string;
    readonly readArticle: (title: string) => string;
    readonly newsletterEyebrow: string;
    readonly newsletterTitle: string;
    readonly workEmail: string;
    readonly emailPlaceholder: string;
    readonly subscribe: string;
    readonly readTime: (time: string) => string;
  };
};

const rawMessages = {
  en: enUi,
  pl: plUi,
} satisfies Record<Locale, RawMessages>;

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

function createMessages(copy: RawMessages): Messages {
  return {
    language: {
      label: copy.language.label,
      polish: copy.language.polish,
      english: copy.language.english,
      switchTo: (language) => interpolate(copy.language.switchTo, { language }),
    },
    theme: copy.theme,
    common: {
      skipToContent: copy.common.skipToContent,
      primaryNavigation: copy.common.primaryNavigation,
      home: copy.common.home,
      backHome: copy.common.backHome,
      artwork: (label) => interpolate(copy.common.artwork, { label }),
      projectDetails: (title) => interpolate(copy.common.projectDetails, { title }),
    },
    actions: {
      openPage: (label) => interpolate(copy.actions.openPage, { label }),
      open: copy.actions.open,
    },
    blog: {
      filterArticles: copy.blog.filterArticles,
      all: copy.blog.all,
      readArticle: (title) => interpolate(copy.blog.readArticle, { title }),
      newsletterEyebrow: copy.blog.newsletterEyebrow,
      newsletterTitle: copy.blog.newsletterTitle,
      workEmail: copy.blog.workEmail,
      emailPlaceholder: copy.blog.emailPlaceholder,
      subscribe: copy.blog.subscribe,
      readTime: (time) => interpolate(copy.blog.readTime, { time }),
    },
  };
}

export const messages = {
  en: createMessages(rawMessages.en),
  pl: createMessages(rawMessages.pl),
} satisfies Record<Locale, Messages>;
