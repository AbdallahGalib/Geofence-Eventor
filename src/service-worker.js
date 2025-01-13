// Service worker for PWA
const CACHE_NAME = 'geofence-pwa-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback for HTML requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return null;
        });
    })
  );
});

// Background sync for geofence updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'geofence-sync') {
    event.waitUntil(syncGeofenceData());
  }
});

// Periodic background sync for geofence checks
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'geofence-periodic-sync') {
    event.waitUntil(checkGeofences());
  }
});

async function syncGeofenceData() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE'
      });
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function checkGeofences() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CHECK_GEOFENCES'
      });
    });
  } catch (error) {
    console.error('Geofence check failed:', error);
  }
}
