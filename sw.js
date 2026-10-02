const C = 'memo-v3';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json'])));
  self.skipWaiting();
});
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request))
  );
});
