import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

import {
  defaultLocale,
  getLocalizedPath,
  getLocaleFromPathname,
  getPathWithoutLocale,
  locales,
  type Locale,
} from '../../routing/locale';

const documentCopy: Record<Locale, {
  readonly title: string;
  readonly description: string;
  readonly socialDescription: string;
}> = {
  pl: {
    title: 'Wojciech Wolanski — programista full-stack',
    description: 'Portfolio Wojciecha Wolanskiego — programisty full-stack tworzącego przemyślane produkty webowe, frontendowe, backendowe i AI.',
    socialDescription: 'Wybrane projekty, teksty techniczne i narzędzia, które za nimi stoją.',
  },
  en: {
    title: 'Wojciech Wolanski — Full-stack developer',
    description: 'Portfolio of Wojciech Wolanski — full-stack software developer building thoughtful web, frontend, backend and AI products.',
    socialDescription: 'Selected work, technical writing and the tools behind it.',
  },
};

const alternateLocales = [
  ...locales.map((locale) => ({ locale, hreflang: locale })),
  { locale: defaultLocale, hreflang: 'x-default' },
] as const;

function getAppPathname(pathname: string): string {
  const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '');

  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    return pathname.slice(basePath.length) || '/';
  }

  return pathname || '/';
}

function updateAlternateLinks(pathname: string) {
  document.head.querySelectorAll('link[data-locale-alternate]').forEach((link) => link.remove());

  const routePath = getPathWithoutLocale(getAppPathname(pathname));
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);

  alternateLocales.forEach(({ locale, hreflang }) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = new URL(getLocalizedPath(locale, routePath).slice(1), baseUrl).href;
    link.dataset.localeAlternate = 'true';
    document.head.append(link);
  });
}

function updateMetaContent(selector: string, content: string) {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

export function DocumentLanguage() {
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  const copy = documentCopy[locale];

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.title;
    updateMetaContent('meta[name="description"]', copy.description);
    updateMetaContent('meta[property="og:title"]', copy.title);
    updateMetaContent('meta[property="og:description"]', copy.socialDescription);
    updateAlternateLinks(pathname);
  }, [copy, locale, pathname]);

  return null;
}
