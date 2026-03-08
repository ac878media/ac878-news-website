'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register minimal SW for PWA installability
      // This SW only caches icons — NEVER caches HTML, RSC, or API data
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('SW registered for PWA support');
        // Force update if there's a new version
        reg.update();
      }).catch((err) => {
        console.log('SW registration failed:', err);
      });
    }
  }, []);

  return null;
}
