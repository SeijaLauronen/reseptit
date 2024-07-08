const programVersion = '2024-07-08: 124';
const staticCacheName = 'recipe-static-124'; 
const dynamicCacheName = 'recipe-dynamic-124'; // Ei välttämätön

const assets = [
  '/',
  'index.html',
  'fallback.html'
];


// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};


// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('installed,caching shell assets');
      cache.addAll(assets);
    })
  );
});


// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});


// fetch event
//https://www.youtube.com/watch?v=ChXgikdQJR8&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7&index=18
//responsea ei voi käyttää/ottaa kiinni useampaan kertaan, siksi otetaan siitä kopio cachetta varten!
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          if (fetchRes.clone().status == 404) { //oma iffi
              if(evt.request.url.indexOf('.html') > -1) {
                return (caches.match('fallback.html')) //alkup
              }
          } else {
            cache.put(evt.request.url, fetchRes.clone()); //alkup
            // check cached items size
            limitCacheSize(dynamicCacheName, 25);
          }
          return fetchRes;
        })
      });
    }).catch(() => {
      if(evt.request.url.indexOf('.html') > -1){
        return caches.match('fallback.html');
      } 
    })
  );
});


self.addEventListener("message", function(event) {
  event.source.postMessage(event.data + programVersion);
});