import '@testing-library/jest-dom/vitest';

import { createElement } from 'react';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: { readonly icon?: string; readonly [key: string]: unknown }) => createElement(
    'span',
    { ...props, 'data-icon': icon },
  ),
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.className = 'dark';
});
