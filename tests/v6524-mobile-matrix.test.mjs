import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
test('D, N and OFF use distinct red, blue and green borders in every roster matrix',()=>{
 const css=read('src/v6524-mobile-matrix.css');
 assert.match(css,/--shift-day-solid:#ff426a/);
 assert.match(css,/--shift-night-solid:#258dff/);
 assert.match(css,/--shift-off-solid:#08dfa4/);
 for(const key of ['.roster-card.day','.roster-card.night','.roster-card.off',
                  '.matrix-cell.D','.matrix-cell.N','.matrix-cell.O',
                  '.heatmap td.shift.D','.heatmap td.shift.N','.heatmap td.shift.O',
                  '.v6517-mobile-row button.D','.v6517-mobile-row button.N','.v6517-mobile-row button.O'])
  assert.ok(css.includes(key),key);
 assert.ok(css.includes('button.D.selected')&&css.includes('button.N.selected')&&css.includes('button.O.selected'));
});
test('mobile homepage shows today plus seven days and opens the full month',()=>{
 const js=read('src/v6517-neon-dashboard.js');
 const css=read('src/v6524-mobile-matrix.css');
 assert.match(js,/isOctober\?now\.getDate\(\):selectedDay/);
 assert.match(js,/Math\.min\(31,anchor\+7\)/);
 assert.ok(js.includes('data-v660-full-month'));
 assert.ok(js.includes("showView('month')"));
 assert.ok(js.includes('v660-matrix-grid'));
 assert.ok(css.includes('repeat(var(--v660-preview-days),minmax(0,1fr))'));
 assert.ok(js.includes('statusAt(i,day)'));
});
test('monthly full employee name never gets forced onto a second line',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html'),css=read('src/v6524-mobile-matrix.css');
 assert.ok(!build.includes('<br>$1'));
 assert.ok(!html.includes('<br>$1'));
 assert.ok(css.includes('white-space:nowrap!important'));
 assert.ok(css.includes('min-width:max-content!important'));
 assert.ok(css.includes('width:max-content!important'));
 assert.ok(css.includes('#monthView .heatmap'));
});
test('built HTML ships final responsive override; PWA cache revision forces fresh shell',()=>{
 const html=read('index.html'),css=read('src/v6524-mobile-matrix.css');
 assert.ok(html.includes(css));
 assert.ok(html.includes('v6524-mobile-matrix-style'));
 assert.ok(html.includes('8-DAY SHIFT PREVIEW'));
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r10'"));
});
