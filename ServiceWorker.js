const cacheName = "DefaultCompany-Mini 5-0.1.0";
const contentToCache = [
    "Build/Mini5_WEB_Play.loader.js",
    "Build/Mini5_WEB_Play.framework.js",
    "Build/Mini5_WEB_Play.data",
    "Build/Mini5_WEB_Play.wasm",
    "TemplateData/style.css"

];

self.addEventListener('fetch', function (e) {
  e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { 
          return response; 
      }

      // Fetch the resource from the network
      response = await fetch(e.request);

      // Handle `.gz` files if necessary
      const url = e.request.url;
      if (url.endsWith('.gz')) {
          response = new Response(response.body, {
              headers: { 
                  'Content-Type': getContentType(url),
                  'Content-Encoding': 'gzip'
              }
          });
      }

      // Cache the fetched resource
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
  })());
});

// Utility function to determine content type
function getContentType(url) {
  if (url.endsWith('.wasm.gz')) return 'application/wasm';
  if (url.endsWith('.js.gz')) return 'application/javascript';
  if (url.endsWith('.data.gz')) return 'application/octet-stream';
  if (url.endsWith('.css.gz')) return 'text/css';
  return 'text/plain';
}
