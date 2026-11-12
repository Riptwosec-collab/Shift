import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync('src/v810-theme.css','utf8');
const html=fs.readFileSync('index.html','utf8');
test('V8.6 month oncall cards no longer inherit old navy fill',()=>{
 for(const marker of ['#oncallView .v6515-oncall .v6515-oncall-month',
  '#oncallView .v6515-oncall-row',
  'background:var(--sh84-panel)!important',
  'color:var(--sh84-fg)!important',
  'grid-auto-columns:96px!important',
  'white-space:normal!important']){
  assert.ok(css.includes(marker),marker);
 }
 assert.ok(html.includes(css));
});
