import type { MDXContent } from 'mdx/types.js';

import type { Locale } from '../../routing/locale';

export type ContentType = 'project' | 'blog';

export type ContentRequest = {
  readonly type: ContentType;
  readonly slug: string;
  readonly locale: Locale;
};

export type ContentAssetScope = ContentRequest;

export type ContentDocument = {
  readonly Component: MDXContent;
  readonly frontmatter: Readonly<Record<string, unknown>>;
};

type ContentModule = {
  readonly default: MDXContent;
  readonly frontmatter?: Readonly<Record<string, unknown>>;
};

const contentModules = import.meta.glob<ContentModule>('/src/content/locales/**/*.mdx');

function getContentPath({ type, slug, locale }: ContentRequest): string {
  const directory = type === 'project' ? 'projects' : 'blog';

  return `/src/content/locales/${locale}/${directory}/${slug}/${locale}.mdx`;
}

export async function loadContent(request: ContentRequest): Promise<ContentDocument | null> {
  const contentPath = getContentPath(request);
  const loadModule = contentModules[contentPath];

  if (!loadModule) {
    return null;
  }

  const module = await loadModule();

  return {
    Component: module.default,
    frontmatter: module.frontmatter ?? {},
  };
}
