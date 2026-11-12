import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync('src/legacy-baseline.html','utf8');
const built=fs.readFileSync('index.html','utf8');
test('Selected date horizontally scrolls its own rail without page jump',()=>{
 for(const s of [source,built]){
  assert.doesNotMatch(s,/n\.scrollIntoView\(\{behavior:'smooth',inline:'center',block:'nearest'\}\)/);
  assert.ok(s.includes('rail.scrollLeft+=a.left-b.left-(rail.clientWidth-n.clientWidth)/2'));
  assert.ok(s.split('rail.scrollLeft+=a.left-b.left-(rail.clientWidth-n.clientWidth)/2').length===3);
 }
});
