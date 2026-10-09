import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('install button has own in-flow dock and never floats over mobile bottom navigation',()=>{
  const js=read('src/v6513-pwa.js'),css=read('src/v6520-install-ui.css');
  assert.match(js,/header\.insertAdjacentElement\('afterend',dock\)/);
  assert.match(js,/dock\.appendChild\(button\)/);
  assert.match(js,/dock\.hidden=isStandalone\(\)/);
  assert.match(js,/dock\.hidden=true/);
  assert.match(css,/\.shift-install-dock\s*\{/);
  assert.match(css,/\.shift-install-dock \.shift-pwa-install\s*\{[\s\S]*?position:relative!important/);
  assert.doesNotMatch(css,/\.shift-pwa-install\s*\{\s*display:inline-flex!important;position:fixed!important/);
});
test('tablet nav has six equal columns including Engineer Oncall',()=>{
  const css=read('src/v6520-install-ui.css');
  assert.match(css,/@media \(min-width:861px\) and \(max-width:1200px\)/);
  assert.match(css,/grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
  assert.match(css,/\.nav-tabs button\s*\{[\s\S]*?min-width:0!important/);
});
test('mobile header separates brand and controls into independent rows',()=>{
  const css=read('src/v6520-install-ui.css');
  assert.match(css,/\.command-bar \.brand\s*\{[\s\S]*?grid-row:1!important/);
  assert.match(css,/\.command-bar \.command-actions\s*\{[\s\S]*?grid-row:2!important/);
  assert.match(css,/\.command-actions \.v64-quality/);
  assert.match(css,/\.command-actions \.v65-language/);
  assert.match(css,/flex-wrap:wrap!important/);
  assert.match(css,/@media \(max-width:380px\)/);
});
test('touch animations are accessible, ECO-safe, and do not introduce continuous work',()=>{
  const js=read('src/v6513-pwa.js'),css=read('src/v6520-install-ui.css');
  assert.match(js,/pointerdown/);
  assert.match(js,/event\.pointerType==='mouse'/);
  assert.match(js,/root\.dataset\.v65Mode==='ECO'/);
  assert.match(js,/prefers-reduced-motion: reduce/);
  assert.match(js,/target\.animate\(/);
  assert.match(css,/shiftMobilePageIn/);
  assert.match(css,/shiftMobileCardIn/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/data-v65-mode="ECO"/);
  assert.doesNotMatch(css,/animation:[^;\n]*infinite/);
});
test('tracked build carries latest in-flow install UI and navigation enhancements',()=>{
  const html=read('index.html');
  assert.ok(html.includes(read('src/v6513-pwa.js')));
  assert.ok(html.includes(read('src/v6520-install-ui.css')));
  assert.match(read('sw.js'),/shift-shell-v6\.5\.20-r5/);
});
