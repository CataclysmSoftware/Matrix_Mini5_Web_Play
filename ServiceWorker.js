const cacheName = "DefaultCompany-Mini 5-0.1.0";
const contentToCache = [
    "Build/Mini5_WEB_24-12-02_12-02.loader.js",
    "Build/Mini5_WEB_24-12-02_12-02.framework.js",
    "Build/Mini5_WEB_24-12-02_12-02.data",
    "Build/Mini5_WEB_24-12-02_12-02.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
