import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('Shift PRO header displays the new T picture rather than the old SVG',()=>{
 const html=read('index.html'),base=read('src/legacy-baseline.html'),style=read('src/v6530-brand-icon.css');
 for(const document of [html,base]){assert.ok(document.includes('shift-brand-icon'));assert.ok(document.includes('shift-tt-source.png'))}
 assert.ok(style.includes('.brand-mark svg{display:none!important}'));
 assert.ok(html.includes(style));
});
test('PWA manifest icon sizes, safe-area maskable, apple icon and favicon are integrated',()=>{
 const manifest=JSON.parse(read('manifest.webmanifest')),worker=read('sw.js'),html=read('index.html');
 assert.ok(manifest.icons.some(x=>x.sizes==='192x192'));
 assert.ok(manifest.icons.some(x=>x.sizes==='512x512'&&x.purpose==='maskable'));
 assert.ok(html.includes('shift-180.png'));
 assert.ok(html.includes('shift-tt-source.png'));
 for(const name of ['shift-192.png','shift-512.png','shift-maskable-512.png','shift-180.png'])assert.ok(worker.includes(name),name);
});
test('dependency-free generator runs before building index and produces images from source',()=>{
 const source=fs.readFileSync('icons/shift-tt-source.png');
 assert.equal(source.toString('hex',0,8),'89504e470d0a1a0a');
 assert.equal(source.readUInt32BE(16),128);
 assert.equal(source.readUInt32BE(20),128);
 const generator=read('scripts/generate-brand-icons.mjs'),build=read('scripts/build.mjs'),ignore=read('.assetsignore');
 assert.ok(build.includes("import './generate-brand-icons.mjs'"));
 assert.ok(generator.includes('zlib.inflateSync'));
 assert.ok(generator.includes('zlib.deflateSync'));
 assert.ok(generator.includes('maskable?0.79:1'));
 assert.ok(ignore.includes('!icons/shift-tt-source.png'));
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r14'"));
});
