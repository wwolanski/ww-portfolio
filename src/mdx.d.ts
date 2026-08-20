declare module '*.mdx' {
  import type { MDXContent } from 'mdx/types.js';

  const content: MDXContent;

  export const frontmatter: Readonly<Record<string, unknown>>;
  export default content;
}
