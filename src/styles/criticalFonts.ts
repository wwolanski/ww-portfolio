import antonLatin from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';
import antonLatinExt from '@fontsource/anton/files/anton-latin-ext-400-normal.woff2?url';
import bebasNeueLatin from '@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2?url';
import bebasNeueLatinExt from '@fontsource/bebas-neue/files/bebas-neue-latin-ext-400-normal.woff2?url';
import dmSansLatin400 from '@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2?url';
import dmSansLatin500 from '@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2?url';
import dmSansLatin600 from '@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff2?url';
import dmSansLatin700 from '@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2?url';
import dmSansLatinExt400 from '@fontsource/dm-sans/files/dm-sans-latin-ext-400-normal.woff2?url';
import dmSansLatinExt500 from '@fontsource/dm-sans/files/dm-sans-latin-ext-500-normal.woff2?url';
import dmSansLatinExt600 from '@fontsource/dm-sans/files/dm-sans-latin-ext-600-normal.woff2?url';
import dmSansLatinExt700 from '@fontsource/dm-sans/files/dm-sans-latin-ext-700-normal.woff2?url';
import montserratLatin from '@fontsource/montserrat/files/montserrat-latin-800-normal.woff2?url';
import montserratLatinExt from '@fontsource/montserrat/files/montserrat-latin-ext-800-normal.woff2?url';
import robotoCondensedLatin from '@fontsource/roboto-condensed/files/roboto-condensed-latin-400-normal.woff2?url';
import robotoCondensedLatinExt from '@fontsource/roboto-condensed/files/roboto-condensed-latin-ext-400-normal.woff2?url';

type FontLoadRequest = readonly [font: string, sample: string];

const fontSample = 'Aaąćęłńóśźż';

const criticalFontRequests: readonly FontLoadRequest[] = [
  ['400 1rem Anton', fontSample],
  ['400 1rem "Bebas Neue"', fontSample],
  ['400 1rem "DM Sans"', fontSample],
  ['500 1rem "DM Sans"', fontSample],
  ['600 1rem "DM Sans"', 'O MNIE PROJEKTY UMIEJĘTNOŚCI BLOG'],
  ['700 1rem "DM Sans"', fontSample],
  ['800 1rem Montserrat', fontSample],
  ['400 1rem "Roboto Condensed"', fontSample],
];

const criticalFontPreloadUrls = [
  antonLatin,
  antonLatinExt,
  bebasNeueLatin,
  bebasNeueLatinExt,
  dmSansLatin400,
  dmSansLatin500,
  dmSansLatin600,
  dmSansLatin700,
  dmSansLatinExt400,
  dmSansLatinExt500,
  dmSansLatinExt600,
  dmSansLatinExt700,
  montserratLatin,
  montserratLatinExt,
  robotoCondensedLatin,
  robotoCondensedLatinExt,
];

let criticalFontsPromise: Promise<void> | undefined;
let criticalFontsAreReady = false;
let criticalFontsArePreloaded = false;

function hasFontLoadingApi() {
  return typeof document !== 'undefined' && typeof document.fonts?.load === 'function';
}

export function preloadCriticalFonts() {
  if (typeof document === 'undefined' || criticalFontsArePreloaded) {
    return;
  }

  criticalFontsArePreloaded = true;

  for (const href of criticalFontPreloadUrls) {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'font';
    preload.type = 'font/woff2';
    preload.crossOrigin = 'anonymous';
    const preloadUrl = new URL(href, document.baseURI);
    preloadUrl.search = '';
    preloadUrl.hash = '';
    preload.href = preloadUrl.href;
    document.head.append(preload);
  }
}

export function areCriticalFontsReady() {
  return criticalFontsAreReady || !hasFontLoadingApi();
}

export function loadCriticalFonts() {
  if (areCriticalFontsReady()) {
    return Promise.resolve();
  }

  criticalFontsPromise ??= Promise.all(
    criticalFontRequests.map(([font, sample]) => document.fonts.load(font, sample)),
  ).then(
    () => undefined,
    () => undefined,
  ).then(() => {
    criticalFontsAreReady = true;
  });

  return criticalFontsPromise;
}
