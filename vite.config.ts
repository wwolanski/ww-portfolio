import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { createMdxPlugin } from './src/content/mdx/mdxPlugin.ts';

export default defineConfig({
  plugins: [
    createMdxPlugin(),
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
});
