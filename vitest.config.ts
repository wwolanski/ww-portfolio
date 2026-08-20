import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { createMdxPlugin } from './src/content/mdx/mdxPlugin.ts';

export default defineConfig({
  plugins: [createMdxPlugin(), react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['e2e/**'],
  },
});
