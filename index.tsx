
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Register Service Worker for PWA support
if ('serviceWorker' in navigator && (import.meta.env.PROD)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((err) => {
        console.error('ServiceWorker registration failed: ', err);
      });
  });
} else if ('serviceWorker' in navigator) {
  // In development, we can still register it to test offline features if desired
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered in development mode: ', registration.scope);
      })
      .catch((err) => {
        console.warn('ServiceWorker dev registration failed: ', err);
      });
  });
}
