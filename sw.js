// Service Worker for Likya Yolu PWA
// Version 2.0

const CACHE_NAME = 'likya-guvenlik-v2.0';
const OFFLINE_URL = '/index.html';

// Files to cache for offline use
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Removing old cache', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Chrome extensions
    if (event.request.url.startsWith('chrome-extension://')) return;

    // Handle API requests differently
    if (event.request.url.includes('openweathermap.org')) {
        // Network first for weather API
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return new Response(JSON.stringify({
                        main: { temp: 22, humidity: 65, pressure: 1013 },
                        wind: { speed: 4.2 }
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }

    // Cache first strategy for other requests
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response; // Return cached version
            }

            return fetch(event.request).then((response) => {
                // Don't cache if not successful
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});

// Background sync for future enhancements
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-emergency') {
        console.log('[SW] Syncing emergency data');
        // Future: sync emergency data when back online
    }
});

// Push notification support for future
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Likya Yolu güvenlik bildirimi',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('Likya Güvenlik', options)
    );
});