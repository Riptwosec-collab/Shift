import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('overview desktop replaces the 31-day legacy matrix with exactly 8 dates based on the real day',()=>{
 const js=read('src/v6526-overview-eight.js');
 for(const item of ['renderOverviewMatrix=function','shiftOverview8Window','length:8','now.getDate()','statusAt(pi,slot.day)','host.innerHTML','shift-eight-matrix'])assert.ok(js.includes(item),item);
 assert.match(js,/date\.getFullYear\(\)===2026&&date\.getMonth\(\)===9/);
 assert.ok(!js.includes('dates.map((_,i)=>'));
});
test('overview matrix fills its card and has a real full-month button',()=>{
 const css=read('src/v6526-overview-eight.css'),js=read('src/v6526-overview-eight.js');
 assert.ok(css.includes('repeat(8,minmax(0,1fr))'));
 assert.ok(css.includes('min-width:0!important'));
 assert.ok(css.includes('overflow:hidden!important'));
 assert.ok(js.includes("showView('month')"));
 assert.ok(js.includes('shift-eight-footer')&&js.includes('shift-eight-period'));
});
test('monthly 31-day heatmap and mobile preview remain separate',()=>{
 const legacy=read('src/legacy-baseline.html');
 const newJS=read('src/v6526-overview-eight.js');
 assert.ok(legacy.includes('function renderHeatmap()'));
 assert.ok(legacy.includes('dates.map((_,i)=>'));
 assert.ok(newJS.includes("document.getElementById('overviewMonthMatrix')"));
 assert.ok(!newJS.includes("document.getElementById('heatmapTable')"));
});
test('build and PWA cache carry the new override',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html');
 const css=read('src/v6526-overview-eight.css'),js=read('src/v6526-overview-eight.js');
 for(const x of ['v6526-overview-eight.css','v6526-overview-eight.js','v6526-overview-eight-style'])assert.ok(build.includes(x),x);
 assert.ok(html.includes(css)&&html.includes(js));
 assert.ok(read('sw.js').includes('shift-shell-v6.5.20-r11'));
});
