const C = 'memo-v13';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  // 옛 버전 캐시 정리
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  // 캐시를 먼저 보여주고, 뒤에서 최신본을 받아 캐시 갱신 (네트워크가 느려도 바로 열림)
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request)
        .then(r => { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); return r; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
