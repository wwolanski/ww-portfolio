import type { PageSlug } from './navigation';
import type { Locale } from '../routing/locale';

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
    readonly footerQuestion: string;
    readonly footerTitle: string;
    readonly startConversation: string;
    readonly letTalk: string;
  };
  readonly nav: Record<PageSlug, string>;
  readonly home: {
    readonly kicker: string;
    readonly portfolioSections: string;
    readonly openPage: (label: string) => string;
    readonly open: string;
    readonly basedIn: string;
    readonly workingWorldwide: string;
  };
  readonly about: {
    readonly available: string;
    readonly resume: string;
  };
  readonly projects: {
    readonly github: (title: string) => string;
    readonly technologies: (title: string) => string;
  };
  readonly skills: {
    readonly engineeringStrengths: string;
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

export const messages = {
  en: {
    language: {
      label: 'Language',
      polish: 'Polish',
      english: 'English',
      switchTo: (language: string) => `Switch language to ${language}`,
    },
    theme: {
      switchToLight: 'Switch to light theme',
      switchToDark: 'Switch to dark theme',
    },
    common: {
      skipToContent: 'Skip to content',
      primaryNavigation: 'Primary navigation',
      home: 'Wojciech Wolanski — home',
      backHome: 'Home',
      artwork: (label: string) => `${label} artwork`,
      footerQuestion: 'Have an interesting problem?',
      footerTitle: 'Let’s build something useful.',
      startConversation: 'Start a conversation',
      letTalk: 'Let’s talk',
    },
    nav: {
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      blog: 'Blog',
    },
    home: {
      kicker: 'Full-stack software developer',
      portfolioSections: 'Portfolio sections',
      openPage: (label: string) => `Open ${label} page`,
      open: 'Open',
      basedIn: 'Based in Poland',
      workingWorldwide: 'Working worldwide',
    },
    about: {
      available: 'Available for select projects',
      resume: 'Download résumé',
    },
    projects: {
      github: (title: string) => `View ${title} on GitHub`,
      technologies: (title: string) => `${title} technologies`,
    },
    skills: {
      engineeringStrengths: 'Engineering strengths',
    },
    blog: {
      filterArticles: 'Filter articles by category',
      all: 'All',
      readArticle: (title: string) => `Read ${title}`,
      newsletterEyebrow: 'No noise. Just useful ideas.',
      newsletterTitle: 'Occasional notes for thoughtful builders.',
      workEmail: 'Work email',
      emailPlaceholder: 'you@company.com',
      subscribe: 'Subscribe',
      readTime: (time: string) => `${time} read`,
    },
  },
  pl: {
    language: {
      label: 'Język',
      polish: 'Polski',
      english: 'Angielski',
      switchTo: (language: string) => `Zmień język na ${language}`,
    },
    theme: {
      switchToLight: 'Przełącz na jasny motyw',
      switchToDark: 'Przełącz na ciemny motyw',
    },
    common: {
      skipToContent: 'Przejdź do treści',
      primaryNavigation: 'Główna nawigacja',
      home: 'Wojciech Wolanski — strona główna',
      backHome: 'Strona główna',
      artwork: (label: string) => `Grafika: ${label}`,
      footerQuestion: 'Masz ciekawy problem?',
      footerTitle: 'Zbudujmy coś użytecznego.',
      startConversation: 'Rozpocznij rozmowę',
      letTalk: 'Porozmawiajmy',
    },
    nav: {
      about: 'O mnie',
      projects: 'Projekty',
      skills: 'Umiejętności',
      blog: 'Blog',
    },
    home: {
      kicker: 'Full-stack software developer',
      portfolioSections: 'Sekcje portfolio',
      openPage: (label: string) => `Otwórz stronę: ${label}`,
      open: 'Otwórz',
      basedIn: 'Mieszkam w Polsce',
      workingWorldwide: 'Pracuję globalnie',
    },
    about: {
      available: 'Dostępny dla wybranych projektów',
      resume: 'Pobierz CV',
    },
    projects: {
      github: (title: string) => `Zobacz ${title} na GitHubie`,
      technologies: (title: string) => `Technologie projektu ${title}`,
    },
    skills: {
      engineeringStrengths: 'Mocne strony inżynierskie',
    },
    blog: {
      filterArticles: 'Filtruj artykuły według kategorii',
      all: 'Wszystkie',
      readArticle: (title: string) => `Przeczytaj: ${title}`,
      newsletterEyebrow: 'Bez szumu. Tylko użyteczne idee.',
      newsletterTitle: 'Od czasu do czasu notatki dla świadomych twórców.',
      workEmail: 'Służbowy e-mail',
      emailPlaceholder: 'ty@firma.pl',
      subscribe: 'Zapisz się',
      readTime: (time: string) => `${time} czytania`,
    },
  },
} satisfies Record<Locale, Messages>;
