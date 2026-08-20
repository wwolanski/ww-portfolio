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
  readonly projectContent: {
    readonly caseStudy: string;
    readonly openCaseStudy: string;
    readonly close: string;
    readonly loading: string;
    readonly preparation: string;
    readonly error: string;
    readonly onlyPolish: string;
    readonly viewPolish: string;
  };
  readonly content: {
    readonly tableOfContents: string;
    readonly openTableOfContents: string;
    readonly closeTableOfContents: string;
    readonly imageGallery: {
      readonly label: string;
      readonly previous: string;
      readonly next: string;
      readonly image: string;
      readonly empty: string;
    };
  };
  readonly actions: {
    readonly openPage: string;
    readonly open: string;
  };
  readonly blog: {
    readonly filterArticles: string;
    readonly all: string;
    readonly readArticle: string;
    readonly articleTags: string;
    readonly backToBlog: string;
    readonly loadingIndex: string;
    readonly errorIndex: string;
    readonly loadingArticle: string;
    readonly missingArticle: string;
    readonly errorArticle: string;
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
  readonly projectContent: {
    readonly caseStudy: string;
    readonly openCaseStudy: (title: string) => string;
    readonly close: string;
    readonly loading: string;
    readonly preparation: string;
    readonly error: string;
    readonly onlyPolish: string;
    readonly viewPolish: string;
  };
  readonly content: {
    readonly tableOfContents: string;
    readonly openTableOfContents: string;
    readonly closeTableOfContents: string;
    readonly imageGallery: {
      readonly label: string;
      readonly previous: string;
      readonly next: string;
      readonly image: (index: number) => string;
      readonly empty: string;
    };
  };
  readonly actions: {
    readonly openPage: (label: string) => string;
    readonly open: string;
  };
  readonly blog: {
    readonly filterArticles: string;
    readonly all: string;
    readonly readArticle: (title: string) => string;
    readonly articleTags: string;
    readonly backToBlog: string;
    readonly loadingIndex: string;
    readonly errorIndex: string;
    readonly loadingArticle: string;
    readonly missingArticle: string;
    readonly errorArticle: string;
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
    projectContent: {
      caseStudy: copy.projectContent.caseStudy,
      openCaseStudy: (title) => interpolate(copy.projectContent.openCaseStudy, { title }),
      close: copy.projectContent.close,
      loading: copy.projectContent.loading,
      preparation: copy.projectContent.preparation,
      error: copy.projectContent.error,
      onlyPolish: copy.projectContent.onlyPolish,
      viewPolish: copy.projectContent.viewPolish,
    },
    content: {
      tableOfContents: copy.content.tableOfContents,
      openTableOfContents: copy.content.openTableOfContents,
      closeTableOfContents: copy.content.closeTableOfContents,
      imageGallery: {
        label: copy.content.imageGallery.label,
        previous: copy.content.imageGallery.previous,
        next: copy.content.imageGallery.next,
        image: (index) => interpolate(copy.content.imageGallery.image, { index: String(index) }),
        empty: copy.content.imageGallery.empty,
      },
    },
    actions: {
      openPage: (label) => interpolate(copy.actions.openPage, { label }),
      open: copy.actions.open,
    },
    blog: {
      filterArticles: copy.blog.filterArticles,
      all: copy.blog.all,
      readArticle: (title) => interpolate(copy.blog.readArticle, { title }),
      articleTags: copy.blog.articleTags,
      backToBlog: copy.blog.backToBlog,
      loadingIndex: copy.blog.loadingIndex,
      errorIndex: copy.blog.errorIndex,
      loadingArticle: copy.blog.loadingArticle,
      missingArticle: copy.blog.missingArticle,
      errorArticle: copy.blog.errorArticle,
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
