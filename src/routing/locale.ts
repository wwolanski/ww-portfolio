export const locales = ['pl', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string | undefined): value is Locale {
  return value === 'pl' || value === 'en';
}

export function getLocalizedPath(locale: Locale, pathname: string): string {
  const withoutLocale = pathname.replace(/^\/(?:pl|en)(?=\/|$)/, '') || '/';
  return withoutLocale === '/' ? `/${locale}` : `/${locale}${withoutLocale}`;
}
