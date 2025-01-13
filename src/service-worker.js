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

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification('Geofence Alert', {
      body: data.message,
      icon: '/favicon.png',
      badge: '/favicon.png',
      vibrate: [200, 100, 200],
      tag: 'geofence-alert',
      renotify: true,
      requireInteraction: true,
      silent: false
    })
  );
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
    const position = await getCurrentPosition();
    const geofences = await getStoredGeofences();
    const insideGeofences = checkGeofenceIntersections(position, geofences);

    if (insideGeofences.length > 0) {
      // Ensure notification is shown even if the app is in the background
      await self.registration.showNotification('Geofence Alert', {
        body: `You are inside: ${insideGeofences.join(', ')}`,
        icon: '/favicon.png',
        badge: '/favicon.png',
        vibrate: [200, 100, 200],
        tag: 'geofence-alert',
        renotify: true,
        requireInteraction: true, // Keep notification until user interacts
        silent: false, // Ensure sound plays
        actions: [
          {
            action: 'view',
            title: 'View Map'
          }
        ]
      });

      // Also try using the Push API as a fallback
      try {
        const pushSubscription = await self.registration.pushManager.getSubscription();
        if (pushSubscription) {
          await pushSubscription.send(JSON.stringify({
            message: `You are inside: ${insideGeofences.join(', ')}`
          }));
        }
      } catch (error) {
        console.warn('Push notification failed:', error);
      }
    }

    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'GEOFENCE_UPDATE',
        insideGeofences
      });
    });
  } catch (error) {
    console.error('Error checking geofences:', error);
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Focus on existing window if available
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is available, open a new one
      return clients.openWindow(self.registration.scope);
    })
  );
});

// Helper function to get current position
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
}

// Helper function to get stored geofences
async function getStoredGeofences() {
  // Implement your geofence storage retrieval logic here
  return [];
}

// Helper function to check geofence intersections
function checkGeofenceIntersections(position, geofences) {
  // Implement your intersection checking logic here
  return [];
}
