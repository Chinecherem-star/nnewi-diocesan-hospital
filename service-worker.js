const CACHE_NAME = 'ndh-otolo-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo-hospital.png',
  './logo-diocese.png',
  './courtyard-night.jpg',
  './director-okafor.jpg',
  './director-clinical-umeoranefo.jpg',
  './staff-onyia.jpg',
  './staff-udeze.jpg',
  './staff-afamefuna.jpg',
  './matron-gynae.jpg',
  './theatre.jpg',
  './building-gopd.jpg',
  './emergency-entrance.jpg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
