// Self-destructing service worker
// Unregisters itself and clears all caches to fix navigation issues
// caused by stale RSC (React Server Component) data being cached

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clear all caches
      caches.keys().then((cacheNames) =>
        Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      ),
      // Unregister this service worker
      self.registration.unregister(),
      // Take control of all clients
      self.clients.claim(),
    ]).then(() => {
      // Reload all open tabs to get fresh content
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      });
    })
  );
});
