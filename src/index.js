import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/App.css';
import './css/fallback.css';
import App from './App';
const container = document.getElementById('root');
const hasStaticFallback = container && container.querySelector('.static-fallback');

if (container && container.hasChildNodes() && !hasStaticFallback) {
  ReactDOM.hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  if (container) {
    container.innerHTML = '';
  }
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}