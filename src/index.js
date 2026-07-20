import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './css/App.css';
import App from './App';

const container = document.getElementById('root');

if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}