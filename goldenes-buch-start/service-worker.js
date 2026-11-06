/* V3.20 Geräteausgabe: Programmdateien offline bereithalten; keine Lebensdaten zwischenspeichern. */
const CACHE_NAME = 'goldenes-buch-v320-startklar-20261106d';
const STATIC = [
  './', './index.html', './berechtigung.js', './access-v2.js',
  './cover-v2.js', './cover-runtime-v2.js',
  './cover-werkstatt.html', './cover-werkstatt.js',
  './gesamt-sicherung.html', './gesamt-sicherung.js',
  './installation.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png'
];
const ALLOWED = new Set(STATIC.map(p => new URL(p, self.registration.scope).pathname));
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    /* Eine einzelne fehlende Ressource darf die gesamte Installation nicht verhindern. */
    await Promise.all(STATIC.map(async file => {
      try { await cache.add(new Request(new URL(file, self.registration.scope), {cache:'reload'})); }
      catch (_) { /* Wird bei einem späteren Online-Aufruf erneut geladen. */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('goldenes-buch-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !ALLOWED.has(url.pathname)) return;
  /* Keine dynamischen /api/ Antworten, keine Buchbilder und keine persönlichen Inhalte im SW-Cache. */
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      const cache = await caches.open(CACHE_NAME);
      const result = await cache.match(request, {ignoreSearch: true});
      if (result) return result;
      if (request.mode === 'navigate') {
        const fallback = await cache.match(new URL('./index.html', self.registration.scope));
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});
