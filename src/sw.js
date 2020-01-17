const staticCacheName = 'versao1';

this.addEventListener('install', event=>{
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
        .then (cache => {
            return cache.addAll([
                './manifest.json',
                './app/home/home.component.html',
            ])
        })
    )
})

this.addEventListener('activate', event=>{
    event.waitUntil(
        caches.keys().then(cacheName => {
            return Promise.all(
                cacheName.filter(cacheName => cacheName.startsWith(staticCacheName))
                .filter(cacheName => cacheName != staticCacheName)
                .map(cacheName => caches.delete(cacheName))
            )
        })
    )
})

this.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then (response => {
            return response || fetch (event.request)
        })
        .catch(()=>{
            return caches.match('./app/home/home.component.html')
        })
    )
})