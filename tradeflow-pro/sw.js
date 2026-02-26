const CACHE='tfp-v2';
const SHELL=['./','./index.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('deepseek.com')||e.request.url.includes('fonts.google')){e.respondWith(fetch(e.request).catch(()=>new Response('',{status:503})));return;}
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok&&e.request.method==='GET'){const cl=r.clone();caches.open(CACHE).then(ch=>ch.put(e.request,cl));}return r;})));
});
