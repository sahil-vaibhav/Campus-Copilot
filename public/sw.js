const CACHE_NAME = 'campus-copilot-shell-v1'
const APP_SHELL = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/campus-copilot.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('campus-copilot-') && key !== CACHE_NAME).map((key) => caches.delete(key)),
    )),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Keep auth and API traffic out of Cache Storage.
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/auth/')) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        void caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy))
      }
      return response
    }).catch(async () => (await caches.match('/index.html')) ?? (await caches.match('/offline.html'))))
    return
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
      }
      return response
    })))
  }
})
