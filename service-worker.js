const CACHE_NAME = 'ndh-otolo-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/logo-hospital.png',
  './assets/logo-diocese.png',
  './assets/courtyard-night.jpg',
  './assets/director-okafor.jpg',
  './assets/director-clinical-umeoranefo.jpg',
  './assets/staff-onyia.jpg',
  './assets/staff-udeze.jpg',
  './assets/staff-afamefuna.jpg',
  './assets/matron-gynae.jpg',
  './assets/theatre.jpg',
  './assets/building-gopd.jpg',
  './assets/emergency-entrance.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png'
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
