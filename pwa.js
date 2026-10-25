/* Progressive Web App setup. Keeping this separate from the game makes it easy to disable or extend. */
'use strict';

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .catch((error) => console.warn('PWA: service worker registration failed.', error));
  });
}
