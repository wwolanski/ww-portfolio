import antonLatin from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';
import antonLatinExt from '@fontsource/anton/files/anton-latin-ext-400-normal.woff2?url';
import bebasNeueLatin from '@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2?url';
import bebasNeueLatinExt from '@fontsource/bebas-neue/files/bebas-neue-latin-ext-400-normal.woff2?url';
import dmSansLatin from '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2?url';
import dmSansLatinExt from '@fontsource-variable/dm-sans/files/dm-sans-latin-ext-wght-normal.woff2?url';
import montserratLatin from '@fontsource/montserrat/files/montserrat-latin-800-normal.woff2?url';
import robotoCondensedLatin from '@fontsource/roboto-condensed/files/roboto-condensed-latin-400-normal.woff2?url';
import robotoCondensedLatinExt from '@fontsource/roboto-condensed/files/roboto-condensed-latin-ext-400-normal.woff2?url';

const homePathPattern = /^\/(?:pl|en)?\/?$/;
const detailHeroPathPattern = /^\/(pl|en)\/(?:about|projects|blog)\/?$/;

const latinFontUrls = [
  bebasNeueLatin,
  dmSansLatin,
  montserratLatin,
  robotoCondensedLatin,
] as const;

const polishExtensionFontUrls = [
  bebasNeueLatinExt,
  dmSansLatinExt,
  robotoCondensedLatinExt,
] as const;

export function preloadHomeFonts(pathname = window.location.pathname) {
  if (!homePathPattern.test(pathname)) {
    return;
  }

  const fontUrls = pathname === '/en' || pathname === '/en/'
    ? latinFontUrls
    : [...latinFontUrls, ...polishExtensionFontUrls];

  appendFontPreloads(fontUrls);
}

export function preloadDetailHeroFonts(pathname = window.location.pathname) {
  const match = detailHeroPathPattern.exec(pathname);

  if (!match) {
    return;
  }

  appendFontPreloads(match[1] === 'pl' ? [antonLatin, antonLatinExt] : [antonLatin]);
}

function appendFontPreloads(fontUrls: readonly string[]) {
  const existingUrls = new Set(
    Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[data-font-preload]'))
      .map((link) => link.href),
  );

  for (const href of fontUrls) {
    if (existingUrls.has(new URL(href, document.baseURI).href)) {
      continue;
    }

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'font';
    preload.type = 'font/woff2';
    preload.crossOrigin = 'anonymous';
    preload.href = href;
    preload.dataset.fontPreload = '';
    document.head.append(preload);
  }
}
