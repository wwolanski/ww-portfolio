import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { createMdxPlugin } from './src/content/mdx/mdxPlugin.ts';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ww-portfolio';
const base = process.env.GITHUB_PAGES === 'true' ? `/${repositoryName}/` : '/';

export default defineConfig({
  base,
  plugins: [
    createMdxPlugin(),
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
});
