import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('desktop month matrix fills its parent instead of fixed max-content blank space',()=>{
 const c=read('src/v6525-polish.css');
 assert.match(c,/#monthView \.heatmap\{width:100%!important;min-width:1180px!important/);
 assert.ok(c.includes('table-layout:fixed!important'));
});
test('mobile preview shows 8 dates with honest unavailable next-month state',()=>{
 const j=read('src/v6525-polish.js');
 for(const s of ['length:8','statusAt(i,x.day)','shift-no-data','data-v660-full-month'])assert.ok(j.includes(s),s);
});
test('monthly mobile supports paging actual employee shifts',()=>{
 const j=read('src/v6525-polish.js'),c=read('src/v6525-polish.css');
 for(const s of ['weekMarkup','data-shift-week-step','data-shift-week-person','openCellModal(person,day)','statusAt(i,day)'])assert.ok(j.includes(s),s);
 for(const s of ['.shift-week-scroll','.shift-week-name','.shift-week-cell.D','.shift-week-cell.N','.shift-week-cell.O'])assert.ok(c.includes(s),s);
});
test('tracked index and PWA match source build',()=>{
 const b=read('scripts/build.mjs'),h=read('index.html'),c=read('src/v6525-polish.css'),j=read('src/v6525-polish.js');
 assert.ok(b.includes('v6525-polish.css')&&b.includes('v6525-polish.js'));
 assert.ok(h.includes(c)&&h.includes(j));
 assert.ok(read('sw.js').includes('shift-shell-v6.5.20-r10'));
});
