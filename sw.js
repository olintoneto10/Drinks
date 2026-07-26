// Service worker do MeuBar: cache do app shell para funcionar offline.
// Chamadas à API da Anthropic nunca são cacheadas.

const CACHE = 'meubar-v2';
const SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/art.js',
  './js/db.js',
  './js/ai.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.hostname === 'api.anthropic.com') return;
  ev.respondWith(
    caches.match(ev.request).then(hit => hit || fetch(ev.request).then(res => {
      if (res.ok && url.origin === location.origin) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(ev.request, clone));
      }
      return res;
    }))
  );
});
