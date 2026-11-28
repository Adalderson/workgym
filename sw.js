// Work Gym service worker (v5.3.5). Pages and plan JSON are network-first so updates show up on the next
// online launch; icons/manifest are stale-while-revalidate. Works offline.
const CACHE = 'workgym-v5.3.5';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const SCOPE = new URL(self.registration ? self.registration.scope : './', self.location).pathname;
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('workgym-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
function networkFirst(req, cacheKey) {
  return fetch(req, { cache: 'no-cache' })
    .then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(cacheKey, copy)); }
      return res;
    })
    .catch(() => caches.open(CACHE).then(c => c.match(cacheKey).then(r => r || c.match('./index.html')).then(r => r || c.match('./'))));
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isApp = url.pathname === SCOPE || url.pathname === SCOPE + 'index.html';
  if (req.mode === 'navigate' || isApp) {
    // The app page (any ?plan=… query too): network first, offline -> cached app.
    // Other pages (e.g. downloads/*.html) are passed through untouched so they never replace the cached app.
    if (isApp) { e.respondWith(networkFirst(new Request(url.origin + url.pathname, { credentials: 'same-origin' }), './index.html')); return; }
    return;
  }
  if (url.pathname.startsWith(SCOPE + 'plans/') && url.pathname.endsWith('.json')) {
    // Plans: always fresh when online, cached copy when offline.
    e.respondWith(networkFirst(req, url.origin + url.pathname));
    return;
  }
  if (url.pathname.startsWith(SCOPE + 'downloads/')) return;
  // Stale-while-revalidate for icons/manifest/etc.
  e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res && res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
