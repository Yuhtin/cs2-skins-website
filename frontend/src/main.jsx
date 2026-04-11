import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { setLocale, resolveInitialLocale } from './lib/i18n';

// Resolve initial locale before first render so the UI starts in the right language.
await setLocale(resolveInitialLocale());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
