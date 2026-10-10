import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script=fs.readFileSync('sw.js','utf8');
const ORIGIN='https://shift.example.test';
const ROOT=ORIGIN+'/';
function response(body,contentType='text/html; charset=utf-8',opts={}){
 const reply=new Response(body,{status:opts.status||200,headers:{'content-type':contentType,...opts.headers}});
 Object.defineProperty(reply,'url',{value:opts.url===undefined?ROOT:opts.url});
 Object.defineProperty(reply,'redirected',{value:!!opts.redirected});
 return reply;
}
function worker({online=true,badCrossOrigin=false}={}){
 const listeners={},store=new Map(),requests=[];
 const self={registration:{scope:ROOT},location:{origin:ORIGIN},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(type,cb)=>{listeners[type]=cb}};
 const caches={open:async()=>({
   match:async key=>store.get(new URL(typeof key==='string'?key:key.url,ROOT).href)?.clone(),
   put:async(key,value)=>store.set(new URL(typeof key==='string'?key:key.url,ROOT).href,value.clone()),
   delete:async key=>store.delete(new URL(typeof key==='string'?key:key.url,ROOT).href)
 }),keys:async()=>['shift-shell-v6.5.20-r10','shift-shell-v6.5.20-r11'],delete:async()=>true};
 const fetch=async (input,options)=>{
   const url=new URL(typeof input==='string'?input:input.url,ROOT);
   requests.push({url:url.href,options});
   if(!online)throw new Error('Offline');
   if(url.pathname.endsWith('.webmanifest'))return response('{"name":"Shift"}','application/manifest+json',{url:url.href});
   if(url.pathname.includes('/icons/'))return response('PNG','image/png',{url:url.href});
   if(badCrossOrigin)return response('login','text/html',{redirected:true,url:'https://evil.test/login'});
   return response('<html><h1>Shift</h1></html>','text/html',{redirected:true,url:ROOT+'index.html',headers:{location:'/index.html','content-length':'99'}});
 };
 const context={self,caches,fetch,Response,Headers,URL,Promise,Set,Error};
 vm.runInNewContext(script,context,{filename:'sw.js'});
 const run=async (type,request={})=>{
   let responded,pending=[];
   const event={request,waitUntil:p=>pending.push(p),respondWith:p=>responded=p};
   listeners[type](event);
   const result=responded&&await responded;
   await Promise.allSettled(pending);
   return result;
 };
 return {run,store,requests,setOnline:v=>online=v};
}
test('precaches canonical / and removes redirect metadata',async()=>{
 const w=worker();await w.run('install');
 assert.equal(w.requests[0].url,ROOT);
 assert.equal(w.store.has(ROOT),true);
 const cached=w.store.get(ROOT);
 assert.equal(cached.redirected,false);
 assert.equal(cached.headers.has('location'),false);
 assert.equal(cached.headers.has('content-length'),false);
 assert.match(await cached.text(),/Shift/);
});
test('Safari navigation receives safe response and stays available offline',async()=>{
 const w=worker();await w.run('install');
 const nav={url:ROOT,method:'GET',mode:'navigate'};
 let out=await w.run('fetch',nav);
 assert.equal(out.redirected,false);
 assert.match(await out.text(),/Shift/);
 w.setOnline(false);
 out=await w.run('fetch',nav);
 assert.equal(out.redirected,false);
 assert.equal(out.status,200);
 assert.match(await out.text(),/Shift/);
});
test('first live visit without precache is also redirect-free',async()=>{
 const w=worker();const out=await w.run('fetch',{url:ROOT+'index.html',method:'GET',mode:'navigate'});
 assert.equal(out.redirected,false);
 assert.equal(out.status,200);
 assert.ok(w.store.has(ROOT));
});
test('cross-origin redirect cannot poison shell cache',async()=>{
 const w=worker({badCrossOrigin:true});
 const out=await w.run('fetch',{url:ROOT,method:'GET',mode:'navigate'});
 assert.equal(out.status,503);
 assert.equal(out.redirected,false);
 assert.equal(w.store.has(ROOT),false);
});
test('API calls never intercepted',async()=>{
 const w=worker();
 const result=await w.run('fetch',{url:ROOT+'api/private',method:'GET',mode:'navigate'});
 assert.equal(result,undefined);
});
