import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');

test('PWA has a scoped installable manifest and usable icons',()=>{
  const manifest=JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.name,'Shift Command Center');
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.start_url,'./');
  assert.equal(manifest.scope,'./');
  assert.ok(manifest.icons.some(icon=>icon.sizes==='192x192'&&icon.type==='image/png'));
  assert.ok(manifest.icons.some(icon=>icon.sizes==='512x512'&&icon.type==='image/png'&&icon.purpose.includes('maskable')));
  for(const icon of manifest.icons)assert.ok(fs.existsSync(icon.src.replace(/^\.\//,'')),`missing ${icon.src}`);
});

test('service worker uses versioned same-origin caches with safe navigation offline fallback',()=>{
  const sw=read('sw.js');
  for(const marker of ['shift-shell-v6.5.18','install','activate','fetch','skipWaiting','clients.claim','request.mode','navigate','caches.open','index.html','manifest.webmanifest']) assert.ok(sw.includes(marker),`missing ${marker}`);
  assert.match(sw,/request\.method\s*!==\s*['"]GET['"]/);
  assert.match(sw,/url\.origin\s*!==\s*self\.location\.origin/);
  assert.match(sw,/networkFirst|network-first/i);
  assert.doesNotMatch(sw,/addAll\(\[[^\]]*\/api/s);
});

test('PWA entry is connected in standalone build and installation has an accessible control',()=>{
  const build=read('scripts/build.mjs');
  const shell=read('index.html');
  const js=read('src/v6513-pwa.js');
  for(const marker of ['manifest.webmanifest','apple-mobile-web-app-capable','apple-touch-icon','theme-color','v6513-ui-style','v6513-pwa.js','6.5.18']) assert.ok(build.includes(marker)||shell.includes(marker),`missing ${marker}`);
  for(const marker of ['serviceWorker','beforeinstallprompt','appinstalled','aria-label','shift-pwa-install']) assert.ok(js.includes(marker),`missing ${marker}`);
  assert.match(shell,/data-app-version="6\.5\.18"/);
  assert.match(shell,/rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(shell,/id="v6513-ui-style"/);
});

test('all five primary views and oncall subviews share responsive mobile rules',()=>{
  const css=read('src/v6513-ui.css');
  for(const selector of ['.command-bar','.nav-tabs','.mobile-nav','.search-row','#overviewView','#dailyView','#personView','#monthView','#analyticsView','.v652-oncall','.v652-view-tabs','.v6511-board-scroll','.v652-timeline','.table-wrap']) assert.ok(css.includes(selector),`missing ${selector}`);
  assert.match(css,/@media\s*\(max-width:\s*900px\)/);
  assert.match(css,/@media\s*\(max-width:\s*600px\)/);
  assert.match(css,/safe-area-inset-bottom/);
  assert.match(css,/min-height:\s*44px/);
  assert.match(css,/overflow-x:\s*auto/);
  assert.match(css,/prefers-reduced-motion/);
});

test('Cloudflare deploy ships ONLY the PWA runtime resources alongside index',()=>{
  const ignore=read('.assetsignore');
  for(const file of ['!index.html','!manifest.webmanifest','!sw.js','!icons/shift-192.png','!icons/shift-512.png','!icons/shift-maskable-512.png']) assert.ok(ignore.includes(file),`missing ${file}`);
  assert.match(ignore,/^\*$/m);
  const cloudflare=read('wrangler.jsonc');
  assert.match(cloudflare,/"directory"\s*:\s*"\.\/"/);
});

test('v6.5.13 PWA release gates and build track current version',()=>{
  const workflow=read('.github/workflows/v65-ci.yml');
  const build=read('scripts/build.mjs');
  assert.ok(workflow.includes('work/v6.5.13-pwa-responsive-all-views'));
  assert.ok(workflow.includes('tests/v6513-*.test.mjs'));
  assert.ok(build.includes('built v6.5.18'));
  assert.ok(build.includes('data-loader-version="6.5.18"'));
});
