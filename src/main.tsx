import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './app/App';
import { ThemeProvider } from './features/theme/ThemeProvider';
import { preloadDetailHeroFonts, preloadHomeFonts } from './styles/preloadHomeFonts';
import './styles/index.css';

preloadHomeFonts();
preloadDetailHeroFonts();

const root = document.querySelector<HTMLDivElement>('#root');

if (!root) {
  throw new Error('Root element was not found.');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
