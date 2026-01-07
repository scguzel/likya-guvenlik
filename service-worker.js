// service-worker.js
const CACHE_NAME = 'likya-yolu-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Önbelleğe alınacak dosyalar
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/offline.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - önbelleğe al
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker yükleniyor...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Dosyalar önbelleğe alınıyor...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - eski önbellekleri temizle
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker aktifleştiriliyor...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eski önbellek siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network First, Cache Fallback stratejisi
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API istekleri için özel yönetim
  if (request.url.includes('api.openweathermap.org')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // API yanıtını önbelleğe al (30 dakika)
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Offline ise önbellekten döndür
          return caches.match(request);
        })
    );
    return;
  }

  // GPX dosyaları için
  if (request.url.includes('.gpx')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Diğer istekler için Cache First stratejisi
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Önbellekte var, onu döndür
          return cachedResponse;
        }
        
        // Önbellekte yok, internetten al
        return fetch(request)
          .then((response) => {
            // Geçerli yanıt değilse veya ağ isteği değilse önbelleğe alma
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch(() => {
            // Tamamen offline - offline sayfasını göster
            if (request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Background Sync (gelecekteki güncellemeler için)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-weather') {
    event.waitUntil(
      // Hava durumu verilerini güncelle
      console.log('🔄 Arka planda hava durumu güncelleniyor...')
    );
  }
});

// Push notification desteği (opsiyonel)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Likya Yolu güvenlik uyarısı',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'likya-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Likya Yolu', options)
  );
});