import antonLatin from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';
import antonLatinExt from '@fontsource/anton/files/anton-latin-ext-400-normal.woff2?url';

const detailHeroPathPattern = /^\/(pl|en)\/(?:about|projects|blog)\/?$/;

export function preloadDetailHeroFonts(pathname = window.location.pathname) {
  const match = detailHeroPathPattern.exec(getAppPathname(pathname));

  if (!match) {
    return;
  }

  appendFontPreloads(match[1] === 'pl' ? [antonLatin, antonLatinExt] : [antonLatin]);
}

function getAppPathname(pathname: string): string {
  const basePath = import.meta.env.BASE_URL;

  if (basePath === '/') {
    return pathname;
  }

  const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

  if (pathname !== normalizedBasePath && !pathname.startsWith(`${normalizedBasePath}/`)) {
    return pathname;
  }

  return pathname.slice(normalizedBasePath.length) || '/';
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
