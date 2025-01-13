// PWA registration and lifecycle management
export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // Request notification permission early
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    console.warn('Notification permission not granted');
                }
            }

            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/',
            });

            // Register periodic sync with shorter interval
            // @ts-ignore
            const periodicSync = registration.periodicSync;
            if (periodicSync) {
                try {
                    await periodicSync.register('geofence-periodic-sync', {
                        minInterval: 60 * 1000 // 1 minute
                    });
                    console.log('Periodic sync registered successfully');
                } catch (error) {
                    console.warn('Periodic sync registration failed:', error);
                }
            }

            // Handle service worker updates
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }

            // Listen for service worker messages
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'CHECK_GEOFENCES') {
                    checkGeofenceLocations();
                }
            });

            return registration;
        } catch (error) {
            console.error('Service worker registration failed:', error);
            throw error;
        }
    }
    throw new Error('Service workers are not supported');
}

// Check for service worker updates
export async function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
    }
}

// Request background sync permission and register sync
export async function registerBackgroundSync(tag = 'geofence-sync') {
    if (!('serviceWorker' in navigator)) return false;
    
    try {
        const registration = await navigator.serviceWorker.ready;
        // @ts-ignore
        if (!registration.sync) {
            console.log('Background sync not supported');
            return false;
        }
        
        // @ts-ignore
        await registration.sync.register(tag);
        console.log('Background sync registered');
        return true;
    } catch (error) {
        console.error('Background sync registration failed:', error);
        return false;
    }
}

// Check geofence locations
async function checkGeofenceLocations() {
    if ('geolocation' in navigator) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            // Add your geofence checking logic here
            console.log('Checking geofences at:', position.coords);
        } catch (error) {
            console.error('Error getting location:', error);
        }
    }
}
