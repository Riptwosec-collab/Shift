import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(path,'utf8');

test('v6.5.17 uses a genuinely pitch-black, no-image canvas and restrained liquid glass',()=>{
  const css=read('src/v6516-liquid-glass.css');
  for(const marker of ['#000000','background:#000','backdrop-filter:blur','--glass','prefers-reduced-motion','prefers-reduced-transparency','color-scheme:dark'])assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/body::before[\s\S]*?display:none\s*!important/);
  assert.match(css,/\.ambient[\s\S]*?display:none\s*!important/);
  assert.match(css,/@media\s*\(max-width:\s*860px\)/);
  assert.match(css,/@media\s*\(display-mode:\s*standalone\)/);
});
test('liquid glass covers ALL navigation, stats, calendar, chart and oncall surfaces with strong contrast',()=>{
  const css=read('src/v6516-liquid-glass.css');
  for(const selector of ['.command-bar','.nav-tabs','.nav-btn','.mobile-nav','#mobileNav','.hud-panel','.roster-card','.metric-card','.analytics-card','.heatmap','.matrix-cell','.mini-matrix','.v6515-month-days','.v6515-person','.v6515-oncall-row','.v6511-duty-bar','.v652-view-tabs','.v652-month-switch','.v6515-shift-group','.filter-btn','.range-btn'])assert.ok(css.includes(selector),`missing ${selector}`);
  for(const color of ['#ff667e','#5c9eff','#46edb1','#50eaff','#b59dff'])assert.ok(css.includes(color),`missing palette ${color}`);
  assert.match(css,/transform:\s*translateY/);
  assert.match(css,/transition:[^;]*transform/);
});
test('desktop matrix stays zero scroll and mobile calendar keeps 7 native columns',()=>{
  const css=read('src/v6516-liquid-glass.css');
  assert.match(css,/\.v6511-board-scroll[\s\S]*overflow:hidden/);
  assert.match(css,/\.v6515-month-days[\s\S]*repeat\(7,minmax\(0,1fr\)\)/);
});
test('service worker returns cached navigation immediately and revalidates in background, without caching API responses',()=>{
  const sw=read('sw.js');
  for(const k of ['shift-shell-v6.5.17','networkFirst','event.waitUntil','caches.open','request.mode','navigate','cache.match','fetch(request)'])assert.ok(sw.includes(k),`missing ${k}`);
  assert.match(sw,/if\(cached\)[\s\S]*return cached/);
  assert.match(sw,/url\.origin!==self\.location\.origin/);
  assert.match(sw,/request\.method!=='GET'/);
  assert.match(sw,/\/api\//);
});
test('language translation avoids traversing detached or hidden views for routine nav renders',()=>{
  const engine=read('src/v65-engine.js');
  assert.ok(engine.includes('v65TranslateTree'));
  assert.match(engine,/refreshV65DynamicSurfaces/);
  assert.match(engine,/classList\.contains\('active'\)/);
  assert.doesNotMatch(engine,/\|\|v64Mounted\?\.has\?\.\(view\)/);
});
test('v6.5.17 build CI and shipped artifact are in sync',()=>{
  const build=read('scripts/build.mjs'),html=read('index.html'),workflow=read('.github/workflows/v65-ci.yml');
  for(const x of ['v6516-liquid-glass.css','v6516-liquid-glass-style','data-app-version="6.5.17"','data-loader-version="6.5.17"','built v6.5.17'])assert.ok(build.includes(x),`missing ${x}`);
  assert.match(html,/data-app-version="6\.5\.17"/);
  assert.match(html,/id="v6516-liquid-glass-style"/);
  assert.ok(workflow.includes('work/v6.5.16-trueblack-liquidglass-fast-pwa'));
  assert.ok(workflow.includes('tests/v6516-*.test.mjs'));
});
