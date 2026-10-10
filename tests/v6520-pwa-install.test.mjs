import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('PWA install button remains visible on mobile even when browser does not emit a native prompt',()=>{
  const js=read('src/v6513-pwa.js');
  assert.match(js,/button\.hidden\s*=\s*isStandalone\(\)/);
  assert.doesNotMatch(js,/button\.hidden\s*=\s*!isIOS/);
  assert.ok(js.includes("button.textContent='＋ ติดตั้ง'"));
  assert.match(js,/pendingInstall/);
  assert.match(js,/beforeinstallprompt/);
  assert.match(js,/appinstalled/);
});

test('iOS Safari, other browsers and Android offer platform-appropriate manual installation help',()=>{
  const js=read('src/v6513-pwa.js');
  for(const marker of ['Add to Home Screen','เพิ่มไปยังหน้าจอโฮม','Safari','Chrome','iPhone','Android','เปิดในเบราว์เซอร์','display-mode: standalone'])assert.ok(js.includes(marker),marker);
  assert.ok(js.includes('maxTouchPoints'));
  assert.ok(js.includes('showHelp'));
  assert.ok(js.includes('aria-label'));
  assert.ok(js.includes('role'));
});

test('PWA help includes diagnostics and handles blocked or missing installation capabilities',()=>{
  const js=read('src/v6513-pwa.js');
  for(const marker of ['serviceWorker','register','manifest.webmanifest','isSecureContext','serviceWorker.ready','try','catch','location.protocol','shift-pwa-help'])assert.ok(js.includes(marker),marker);
  assert.match(js,/register\(['"]\.\/sw\.js['"]/);
  assert.match(js,/button\.addEventListener\(['"]click['"]/);
});

test('mobile PWA install affordance is readable and not covered by navigation',()=>{
  const css=read('src/v6520-install-ui.css');
  for(const x of ['.shift-pwa-install','.shift-pwa-help','#mobileNav','safe-area-inset-bottom','z-index','position:fixed','min-height:44px'])assert.ok(css.includes(x),x);
  assert.match(css,/@media\s*\(max-width:\s*860px\)/);
  assert.match(css,/@media\s*\(max-width:\s*600px\)/);
  assert.match(css,/@media\s*\(display-mode:\s*standalone\)/);
  assert.match(css,/prefers-reduced-motion/);
});

test('failed ancillary assets cannot prevent worker install and cache version increments',()=>{
  const sw=read('sw.js');
  assert.ok(sw.includes('shift-shell-v6.5.20'));
  assert.ok(sw.includes('Promise.allSettled'));
  assert.ok(sw.includes("fetchShell(cache)"));
  assert.ok(sw.includes("APP_ROOT"));
  assert.doesNotMatch(sw,/await cache\.addAll\(SHELL_ASSETS\)/);
  for(const resource of ['manifest.webmanifest','shift-192.png','shift-512.png'])assert.ok(sw.includes(resource));
  assert.ok(sw.includes('networkFirst'));
});

test('manifest and HTML advertise app identity, icons and install support',()=>{
  const manifest=JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.scope,'./');
  assert.equal(manifest.start_url,'./');
  assert.ok(manifest.icons.some(x=>x.sizes==='192x192'));
  assert.ok(manifest.icons.some(x=>x.sizes==='512x512'));
  const html=read('index.html');
  for(const marker of ['rel="manifest"','apple-touch-icon','apple-mobile-web-app-capable','mobile-web-app-capable'])assert.ok(html.includes(marker),marker);
});

test('v6.5.20 source build, tracked artifact, deploy allowlist and CI are synchronized',()=>{
  const b=read('scripts/build.mjs'),h=read('index.html'),ignore=read('.assetsignore'),wf=read('.github/workflows/v65-ci.yml');
  for(const marker of ['v6520-install-ui.css','v6520-install-ui-style','built v6.5.20','data-app-version="6.5.20"','data-loader-version="6.5.20"'])assert.ok(b.includes(marker),marker);
  assert.match(h,/data-app-version="6\.5\.20"/);
  assert.ok(h.includes('v6520-install-ui-style'));
  for(const f of ['!manifest.webmanifest','!sw.js','!icons/shift-192.png','!icons/shift-512.png'])assert.ok(ignore.includes(f),f);
  assert.ok(wf.includes('work/v6.5.20-mobile-pwa-install-repair'));
  assert.ok(wf.includes('tests/v6520-*.test.mjs'));
});
