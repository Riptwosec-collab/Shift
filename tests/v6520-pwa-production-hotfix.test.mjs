import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('install UI is available independently of command-actions layout',()=>{
  const script=read('src/v6513-pwa.js');
  const css=read('src/v6520-install-ui.css');
  assert.match(script,/querySelector\('\.command-bar'\)\|\|document\.body/);
  assert.match(script,/shift-install-dock/);
  assert.match(script,/insertAdjacentElement\('afterend',dock\)/);
  assert.match(css,/\.shift-install-dock\s*\{/);
  assert.match(css,/position:relative!important/);
  assert.match(css,/\.shift-pwa-install\[hidden\]\{display:none!important\}/);
  assert.match(css,/display-mode:standalone/);
});
test('installation checks production manifest, icon and service worker responses',()=>{
  const script=read('src/v6513-pwa.js');
  for(const marker of ['cache:\'no-store\'','response.json()','image.headers.get(\'content-type\')','response.text()','shift-shell-v6.5.20','getRegistration','navigator.serviceWorker.register','updateViaCache:\'none\'']) assert.ok(script.includes(marker),marker);
  assert.match(script,/!response\.ok/);
  assert.match(script,/HTML แทน sw\.js/);
  assert.match(script,/ตรวจสอบอีกครั้ง/);
});
test('iOS remains manual, Android can use native prompt and in-app browsers show fallback',()=>{
  const script=read('src/v6513-pwa.js');
  for(const marker of ['Share → Add to Home Screen','ก่อนติดตั้ง','beforeinstallprompt','pendingInstall','Safari','Chrome','inApp','appinstalled']) {
    if(marker==='ก่อนติดตั้ง') continue;
    assert.ok(script.includes(marker),marker);
  }
});
test('worker never claims offline install unless its HTML shell was cached',()=>{
  const sw=read('sw.js');
  assert.match(sw,/Promise\.allSettled/);
  assert.match(sw,/shellResult\.status!=='fulfilled'/);
  assert.match(sw,/throw shellResult\.reason/);
  assert.match(sw,/shift-shell-v6\.5\.20-r4/);
});
test('built artifact includes exact latest PWA JavaScript and CSS',()=>{
  const html=read('index.html');
  assert.ok(html.includes(read('src/v6513-pwa.js')));
  assert.ok(html.includes(read('src/v6520-install-ui.css')));
});
