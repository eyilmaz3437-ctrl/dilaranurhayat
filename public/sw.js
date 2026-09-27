const SHELL_CACHE = 'dnh-shell-v2';
const BOOK_CACHE = 'dnh-textbooks-v1';
const CORE = ['/', '/manifest.webmanifest', '/dnh-icon.svg?v=20260926-1'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(CORE))
      .catch(() => null)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('dnh-shell-') && name !== SHELL_CACHE)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin === self.location.origin && url.pathname.startsWith('/offline-pdf/')) {
    event.respondWith((async () => {
      const cache = await caches.open(BOOK_CACHE);
      const cacheKey = new Request(url.pathname, { method: 'GET' });
      const saved = await cache.match(cacheKey);
      if (saved) return saved;
      return fetch(request);
    })());
    return;
  }

  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(SHELL_CACHE);
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) await cache.put('/', fresh.clone());
        return fresh;
      } catch {
        return (await cache.match('/')) || Response.error();
      }
    })());
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(SHELL_CACHE);
      const saved = await cache.match(request);
      if (saved) return saved;
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) await cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return Response.error();
      }
    })());
  }
});
