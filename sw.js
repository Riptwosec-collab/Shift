/* Shift v6.5.16 — fast installable shell, same-origin only, background refresh. */
const CACHE_NAME='shift-shell-v6.5.16';
const SHELL_ASSETS=['./index.html','./manifest.webmanifest','./icons/shift-192.png','./icons/shift-512.png','./icons/shift-maskable-512.png'];
const APP_PATHS=new Set(SHELL_ASSETS.map(path=>new URL(path,self.registration.scope).pathname));
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_ASSETS);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const key of await caches.keys()){
      if(key.startsWith('shift-shell-')&&key!==CACHE_NAME)await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
/* networkFirst is deliberately stale-while-revalidate for the static HTML shell:
   returning the cached page immediately prevents a repeat PWA launch from waiting on cellular RTT. */
async function networkFirst(request,event){
  const cache=await caches.open(CACHE_NAME);
  const shellURL=new URL('./index.html',self.registration.scope);
  const cached=await cache.match(shellURL)||await cache.match('./');
  const refresh=fetch(request,{cache:'no-cache'}).then(async response=>{
    if(response.ok&&response.type==='basic'){
      await cache.put(shellURL,response.clone());
    }
    return response;
  });
  if(cached){
    event.waitUntil(refresh.catch(()=>null));
    return cached;
  }
  try{return await refresh}
  catch{
    const fallback=await cache.match(shellURL)||await cache.match('./');
    if(fallback)return fallback;
    return new Response('Shift is offline. Reconnect and retry.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
}
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.includes('/api/'))return;
  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,event));
    return;
  }
  if(!APP_PATHS.has(url.pathname))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(request);
    if(cached)return cached;
    const response=await fetch(request);
    if(response.ok)await cache.put(request,response.clone());
    return response;
  })());
});
