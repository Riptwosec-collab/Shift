import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('D / N / OFF / COVER floating bar is no longer created or rendered',()=>{
 const js=read('src/v64-engine.js'),bridge=read('src/v651-engine.js'),html=read('index.html');
 assert.ok(!bridge.includes("sticky.className='v64-sticky-daily'"));
 assert.ok(bridge.includes("document.getElementById('v64StickyDaily')?.remove()"));
 assert.ok(!html.includes("sticky.className='v64-sticky-daily'"));
 assert.ok(!js.includes("sticky.className='v64-sticky-daily'"));
 assert.ok(!js.includes("sticky.innerHTML="));
 assert.ok(js.includes("document.getElementById('v64StickyDaily')?.remove()"));
 assert.ok(!html.includes("sticky.className='v64-sticky-daily'"));
 assert.ok(!html.includes("sticky.innerHTML="));
});
test('all legacy bar elements are hidden as defensive fallback on cached phones',()=>{
 const css=read('src/legacy-ui.css'),html=read('index.html');
 assert.ok(css.includes('#v64StickyDaily,.v64-sticky-daily{display:none!important'));
 assert.ok(html.includes(css));
});
test('other daily metrics and fixed bottom navigation are unchanged',()=>{
 const js=read('src/v64-engine.js'),mobile=read('src/v6515-ui.css');
 for(const text of ['renderV64Daily','model.counts.D','model.counts.N','model.counts.OFF','model.coverage'])assert.ok(js.includes(text),text);
 assert.ok(mobile.includes('#mobileNav')&&mobile.includes('position:fixed!important'));
});
test('PWA cache revision updates old installed shell',()=>{
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r11'"));
});
