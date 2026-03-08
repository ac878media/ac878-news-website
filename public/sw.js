// Minimal service worker for PWA installability
// ONLY caches static assets (icons, fonts) — NEVER caches HTML, RSC, or API responses
// This prevents the navigation issues caused by stale RSC data caching

const CACHE_NAME = 'ac878-static-v1';
const STATIC_ASSETS = [
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // NEVER intercept navigation, RSC, or API requests
  if (
    event.request.mode === 'navigate' ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    event.request.headers.get('RSC') ||
    event.request.headers.get('Next-Router-State-Tree')
  ) {
    return; // Let the browser handle these normally
  }
  
  // Only serve static assets from cache
  if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
