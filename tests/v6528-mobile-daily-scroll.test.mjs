import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('D / N / OFF / COVER quick stats do not float when scrolling on phones',()=>{
 const css=read('src/legacy-ui.css');
 assert.ok(css.includes('.v64-sticky-daily{display:flex;position:static;top:auto;z-index:auto;'));
 assert.ok(!css.includes('.v64-sticky-daily{display:flex;position:sticky;top:74px;'));
 assert.match(css,/#dailyView #v64StickyDaily\.v64-sticky-daily\{position:static!important/);
 for(const marker of ['top:auto!important','bottom:auto!important','z-index:auto!important','transform:none!important'])assert.ok(css.includes(marker),marker);
 assert.ok(read('index.html').includes(css));
});
test('daily figures still use live roster data and mobile bottom nav remains fixed',()=>{
 const js=read('src/v64-engine.js'),css=read('src/v6515-ui.css');
 for(const marker of ['v64StickyDaily','model.counts.D','model.counts.N','model.counts.OFF','model.coverage'])assert.ok(js.includes(marker),marker);
 assert.ok(css.includes('#mobileNav')&&css.includes('position:fixed!important'));
});
test('iPhone offline cache revision changes to install the updated layout',()=>{
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r10'"));
});
