import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const css=read('src/v870-theme-foundation.css'),legacy=read('src/v750-vivid-motion.css');
const html=read('index.html'),qa=read('scripts/visual-qa.mjs');
test('V8.9.2 removes orange cap and hero circle at the source',()=>{
 assert.match(legacy,/\.command-bar::before\{content:none;display:none\}/);
 assert.match(legacy,/\.s740-top::after\{content:none;display:none\}/);
 assert.ok(css.includes('.command-bar::before'));
 assert.ok(css.includes('.s740-top::after'));
 assert.ok(qa.includes('unwanted-decorative-overlay'));
 assert.ok(html.includes(legacy));assert.ok(html.includes(css));
});
test('V8.9.2 light and dark search and command controls both have legible surfaces',()=>{
 for(const t of ['.search-row .smart-search input','background:var(--sh87-panel)!important',
 '.search-row .fullscreen-label','color:var(--sh87-fg)!important',
 '.search-row .smart-search input::placeholder','min-height:43px!important'])
  assert.ok(css.includes(t),t);
});
