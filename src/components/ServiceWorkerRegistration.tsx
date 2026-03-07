'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('New service worker available');
          });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker updated, reloading page');
        window.location.reload();
      });
    }
  }, []);

  return null; // This component doesn't render anything
}