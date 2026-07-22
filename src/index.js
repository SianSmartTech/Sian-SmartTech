import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './css/App.css';
import App from './App';
const container = document.getElementById('root');
if (container && container.hasChildNodes()) {
  try {
    hydrateRoot(
      container,
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Hydration error, falling back to client render:', error);
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} else if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}