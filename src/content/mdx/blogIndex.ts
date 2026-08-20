import { listContent } from './loader';

export type BlogFrontmatter = {
  readonly title: string;
  readonly tags: readonly string[];
  readonly date: string;
  readonly description?: string;
  readonly readTime: string;
};

export type BlogArticle = BlogFrontmatter & {
  readonly slug: string;
};

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function isIsoDate(value: string): boolean {
  const match = isoDatePattern.exec(value);

  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  return parsed.getUTCFullYear() === Number(year)
    && parsed.getUTCMonth() === Number(month) - 1
    && parsed.getUTCDate() === Number(day);
}

function normalizeTags(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim()))]
    .filter(Boolean);
}

export function parseBlogFrontmatter(frontmatter: Readonly<Record<string, unknown>>, slug: string): BlogArticle | null {
  const { title, date, description, readTime } = frontmatter;
  const hasValidDescription = description === undefined
    || description === null
    || typeof description === 'string';

  if (
    typeof title !== 'string'
    || typeof date !== 'string'
    || typeof readTime !== 'string'
    || !hasValidDescription
    || !title.trim()
    || !readTime.trim()
    || !isIsoDate(date)
  ) {
    return null;
  }

  const normalizedDescription = typeof description === 'string' ? description.trim() : undefined;

  return {
    slug,
    title: title.trim(),
    tags: normalizeTags(frontmatter.tags),
    date,
    readTime: readTime.trim(),
    ...(normalizedDescription ? { description: normalizedDescription } : {}),
  };
}

let blogArticlesPromise: Promise<readonly BlogArticle[]> | undefined;

export function getBlogArticles(): Promise<readonly BlogArticle[]> {
  blogArticlesPromise ??= listContent({ type: 'blog', locale: 'pl' }).then((entries) => entries
    .map(({ slug, frontmatter }) => parseBlogFrontmatter(frontmatter, slug))
    .filter((article): article is BlogArticle => article !== null)
    .sort((left, right) => right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug)));

  return blogArticlesPromise;
}
