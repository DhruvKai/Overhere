/* Overhere service worker: makes the app installable and usable offline.
   Network first (revalidating the browser cache), so a new deploy shows up on the next load;
   the cached copy is only used when the network fails. Other sites (Supabase, fonts, photos) are not touched. */
const V='overhere-v1';
const CORE=['./','index.html','demo.html','config.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(V).then(c=>c.put(r,copy))}
    return res;
  }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('demo.html').then(d=>d||Response.error()):Response.error()))));
});
