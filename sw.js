/* Shift PWA — Safari-safe offline shell (v6.5.20-r9).
   Never deliver a redirected Response from a service worker. */
const CACHE_NAME='shift-shell-v6.5.20-r10';
const APP_ROOT=new URL('./',self.registration.scope).href;
const SHELL_ASSETS=['./manifest.webmanifest','./icons/shift-192.png','./icons/shift-512.png','./icons/shift-maskable-512.png'];
const APP_PATHS=new Set(SHELL_ASSETS.map(path=>new URL(path,self.registration.scope).pathname));

function validResponse(response,kind){
  if(!response||!response.ok||!['basic','default'].includes(response.type))return false;
  // Never package a cross-origin authentication, error, or redirect destination as the app.
  if(response.url){
    try{if(new URL(response.url).origin!==self.location.origin)return false}
    catch{return false}
  }
  const mime=(response.headers.get('content-type')||'').toLowerCase();
  if(kind==='html')return mime.includes('text/html');
  if(kind==='manifest')return mime.includes('json');
  if(kind==='image')return mime.startsWith('image/');
  return false;
}
function withoutRedirect(response){
  // Construct a fresh response: Response.redirected is now false and Response.url is empty.
  // WebKit rejects even a cached successful response when the original fetch was redirected.
  const headers=new Headers(response.headers);
  for(const header of ['location','content-length','content-encoding','transfer-encoding','connection','set-cookie'])headers.delete(header);
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
async function safeFetch(input,kind){
  const response=await fetch(input,{cache:'no-cache',redirect:'follow'});
  if(!validResponse(response,kind))throw new Error('Unsafe or unexpected PWA '+kind+' response');
  return withoutRedirect(response);
}
async function fetchShell(cache){
  // Cloudflare may redirect /index.html -> /. Always precache the canonical scope root.
  const shell=await safeFetch(APP_ROOT,'html');
  await cache.put(APP_ROOT,shell.clone());
  return shell;
}
async function fetchAsset(cache,path){
  const url=new URL(path,self.registration.scope).href;
  const type=path.endsWith('.webmanifest')?'manifest':'image';
  const response=await safeFetch(url,type);
  await cache.put(url,response);
}
async function cachedShell(cache){
  const cached=await cache.match(APP_ROOT);
  if(!cached)return null;
  if(!validResponse(cached,'html')){await cache.delete(APP_ROOT);return null}
  if(cached.redirected||cached.headers.has('location')){
    const clean=withoutRedirect(cached);
    await cache.put(APP_ROOT,clean.clone());
    return clean;
  }
  return cached;
}
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const [shellResult]=await Promise.allSettled([
      fetchShell(cache),
      ...SHELL_ASSETS.map(path=>fetchAsset(cache,path))
    ]);
    // An uncached HTML shell must never be advertised as an offline install.
    if(shellResult.status!=='fulfilled')throw shellResult.reason;
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const name of await caches.keys()){
      if(name.startsWith('shift-shell-')&&name!==CACHE_NAME)await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
/* Cached-first navigation, background revalidation. Always strip redirect metadata. */
async function networkFirst(request,event){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cachedShell(cache);
  const refresh=safeFetch(request,'html').then(async response=>{
    await cache.put(APP_ROOT,response.clone());
    return response;
  });
  if(cached){
    event.waitUntil(refresh.catch(()=>null));
    return cached;
  }
  try{return await refresh}
  catch{
    const fallback=await cachedShell(cache);
    if(fallback)return fallback;
    return new Response('<!doctype html><html lang="th"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shift is offline</title><body style="background:#030913;color:#e6f4ff;font:16px system-ui;padding:32px"><h1>ยังเปิด Shift ไม่ได้</h1><p>กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่</p><a href="./" style="color:#65d9ff">ลองอีกครั้ง</a></body></html>',{
      status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}
    });
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
    const cached=await cache.match(url.href);
    if(cached&&validResponse(cached,url.pathname.endsWith('.webmanifest')?'manifest':'image')&&!cached.redirected)return cached;
    const type=url.pathname.endsWith('.webmanifest')?'manifest':'image';
    const response=await safeFetch(request,type);
    await cache.put(url.href,response.clone());
    return response;
  })());
});
