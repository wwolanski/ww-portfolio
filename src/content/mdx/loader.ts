import type { MDXContent } from 'mdx/types.js';

import type { Locale } from '../../routing/locale';

export type ContentType = 'project' | 'blog';

export type ContentRequest = {
  readonly type: ContentType;
  readonly slug: string;
  readonly locale: Locale;
};

export type ContentIndexRequest = Pick<ContentRequest, 'type' | 'locale'>;

export type ContentAssetScope = ContentRequest;

export type ContentDocument = {
  readonly Component: MDXContent;
  readonly frontmatter: Readonly<Record<string, unknown>>;
};

export type ContentIndexEntry = {
  readonly slug: string;
  readonly frontmatter: Readonly<Record<string, unknown>>;
};

type ContentModule = {
  readonly default: MDXContent;
  readonly frontmatter?: Readonly<Record<string, unknown>>;
};

const contentModules = import.meta.glob<ContentModule>('/src/content/locales/**/*.mdx');

function getContentDirectory(type: ContentType): string {
  return type === 'project' ? 'projects' : 'blog';
}

function getContentPath({ type, slug, locale }: ContentRequest): string {
  const directory = getContentDirectory(type);

  return `/src/content/locales/${locale}/${directory}/${slug}/${locale}.mdx`;
}

function getContentPathPrefix({ type, locale }: ContentIndexRequest): string {
  return `/src/content/locales/${locale}/${getContentDirectory(type)}/`;
}

function getSlugFromPath(path: string, request: ContentIndexRequest): string | null {
  const relativePath = path.slice(getContentPathPrefix(request).length);
  const segments = relativePath.split('/');

  if (segments.length !== 2 || segments[1] !== `${request.locale}.mdx` || !segments[0]) {
    return null;
  }

  return segments[0];
}

export async function listContent(request: ContentIndexRequest): Promise<readonly ContentIndexEntry[]> {
  const prefix = getContentPathPrefix(request);

  const entries = await Promise.all(Object.entries(contentModules)
    .filter(([path]) => path.startsWith(prefix))
    .map(async ([path, loadModule]) => {
      const slug = getSlugFromPath(path, request);

      if (!slug) {
        return null;
      }

      const module = await loadModule();

      return { slug, frontmatter: module.frontmatter ?? {} };
    }));

  return entries
    .filter((entry): entry is ContentIndexEntry => entry !== null);
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
