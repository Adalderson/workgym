// Work Gym service worker. Pages (index.html) are network-first so updates show up on the next
// online launch without renaming the cache; everything else is stale-while-revalidate. Works offline.
const CACHE = 'workgym-v2';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('workgym-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if (isPage) {
    // Network first (bypassing the HTTP cache), fall back to the cached app when offline.
    e.respondWith(
      fetch(url.href, { cache: 'no-cache', credentials: 'same-origin' })
        .then(res => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
          return res;
        })
        .catch(() => caches.open(CACHE).then(c => c.match('./index.html').then(r => r || c.match('./'))))
    );
    return;
  }
  // Stale-while-revalidate for icons/manifest/etc.
  e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res && res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
