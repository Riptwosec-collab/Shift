import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync('src/v870-theme-foundation.css','utf8');
const html=fs.readFileSync('index.html','utf8');
test('V8.9 day-count sticker has ink on lime, and November hero uses theme foreground',()=>{
 for(const t of ['#shift740FullMonth .end770-hero-mark :is(b,small)',
  '-webkit-text-fill-color:#162A37!important',
  '.s740-top :is(','-webkit-text-fill-color:#F1F7FF!important',
  '-webkit-text-fill-color:#15283F!important',
  '.s740-months button[aria-pressed="true"]']){
  assert.ok(css.includes(t),t);
 }
 assert.ok(html.includes(css));
});
test('V8.9 header language/performance selected states share nav accent',()=>{
 assert.ok(css.includes('.v65-language button.active'));
 assert.ok(css.includes('.v64-quality button.active'));
 assert.ok(css.includes('background:var(--sh87-accent)!important'));
 let depth=0;for(const c of css){if(c==='{')depth++;else if(c==='}')depth--;assert.ok(depth>=0);}
 assert.equal(depth,0);
});
