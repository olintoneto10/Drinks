// Service worker do MeuBar: cache do app shell para funcionar offline.
// Chamadas à API da Anthropic nunca são cacheadas.

const CACHE = 'meubar-v19';
const SHELL = [
  './',
  './index.html',
  './css/style.css',
  './css/movimento.css',
  './js/data.js',
  './js/feedback.js',
  './js/historias.js',
  './js/art.js',
  './js/db.js',
  './js/ai.js',
  './js/app.js',
  './js/retro.js',
  './js/preparo.js',
  './js/momentos.js',
  './js/retorno.js',
  './js/medidas.js',
  './js/qr.js',
  './js/cartao.js',
  './js/kit.js',
  './js/jogo.js',
  './js/boasvindas.js',
  './js/convite.js',
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

  // HTML: rede primeiro (para novas versões chegarem), cache como fallback offline
  if (ev.request.mode === 'navigate') {
    ev.respondWith(
      fetch(ev.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(ev.request, clone));
        return res;
      }).catch(() => caches.match(ev.request).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // Demais recursos: cache primeiro
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
