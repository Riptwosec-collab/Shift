import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const css=read('src/v6522-matrix-layout.css');
test('mobile matrix fits its content, excluding hidden desktop snapshot',()=>{
 for(const key of ['height:fit-content','grid-auto-rows:max-content','display:none!important','#v6517MobileMatrix','overflow-x:auto!important'])assert.ok(css.includes(key),key);
});
test('full names in overview and mobile preview; schedule stays unchanged',()=>{
 const legacy=read('src/legacy-baseline.html'),mobile=read('src/v6517-neon-dashboard.js');
 assert.ok(legacy.includes('title="'+String.fromCharCode(36)+'{p.name}"'));
 assert.ok(mobile.includes('v6517Esc(person.name)'));
 assert.ok(legacy.includes('statusAt(pi,day)')&&mobile.includes('statusAt(i,day)'));
});
test('working red border, rest green border, selected date cyan',()=>{
 for(const key of ['.matrix-cell.D','.matrix-cell.N','.matrix-cell.O','td.shift.D','td.shift.N','td.shift.O','button.D','button.N','button.O','#ff4d68','#25e3a4','#54eaff'])assert.ok(css.includes(key),key);
});
test('daily summary scrolls within its own content, not sticky',()=>{
 assert.ok(read('src/styles.css').includes('.sticky-daily{position:static;top:auto'));
 assert.ok(css.includes('position:static!important;top:auto!important'));
});
test('release embeds source patch and rotates PWA cache',()=>{
 const html=read('index.html');
 assert.ok(html.includes(css));
 assert.ok(html.includes('v6522-matrix-layout-style'));
 assert.ok(html.includes('v6517Esc(person.name)'));
 assert.ok(read('scripts/build.mjs').includes('v6522Css'));
 assert.ok(read('sw.js').includes('shift-shell-v6.5.20-r7'));
});
