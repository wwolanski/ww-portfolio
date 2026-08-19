import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { remarkGithubAlerts } from './remarkGithubAlerts.ts';

export function createMdxPlugin() {
  return {
    enforce: 'pre' as const,
    ...mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        remarkGfm,
        [remarkFrontmatter, ['yaml']],
        remarkMdxFrontmatter,
        remarkGithubAlerts,
      ],
    }),
  };
}
