self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open('v1').then(c=>c.addAll(['/','/index.html','/offline.html','/ding.wav']))
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    fetch(e.request).catch(()=> caches.match(e.request).then(r=>r || caches.match('/offline.html')))
  );
});
