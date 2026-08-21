import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './app/App';
import { ThemeProvider } from './features/theme/ThemeProvider';
import './styles/index.css';

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
