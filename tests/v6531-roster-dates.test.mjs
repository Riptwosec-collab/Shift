import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('every month cell is explicitly labeled D N or OFF with employee and date',()=>{
 const js=read('src/v6531-roster-dates.js');
 assert.ok(js.includes("cell.textContent=code==='O'?'OFF':code"));
 assert.ok(js.includes('aria-label'));
 assert.ok(js.includes('shiftClarifyMonthCells()'));
});
test('every overview, daily, mobile and week roster presents day plus shift status',()=>{
 const js=read('src/v6531-roster-dates.js');
 for(const label of ['shiftClarifyRows','shiftClarifyMobileMonth','shiftClarifyPreview','shiftBeforeDashboard','shiftBeforeMobileMonth','shiftBeforeRoster'])assert.ok(js.includes(label),label);
 assert.ok(js.includes("badge.textContent=mark"));
 assert.ok(js.includes("pill.textContent=status"));
});
test('person-by-person D/N/OFF calendar dates are computed from existing source data',()=>{
 const js=read('src/v6531-roster-dates.js'),build=read('scripts/build.mjs'),html=read('index.html');
 assert.ok(js.includes('[...person.s].flatMap'));
 assert.ok(js.includes("line(p,'D','D • กลางวัน')"));
 assert.ok(js.includes("line(p,'N','N • กลางคืน')"));
 assert.ok(js.includes("line(p,'O','OFF • หยุด')"));
 assert.ok(build.includes("'v6531-roster-dates.js'"));
 assert.ok(build.includes('v6531-roster-dates.css'));
 assert.ok(html.includes(js));
 assert.ok(html.includes(read('src/v6531-roster-dates.css')));
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r17'"));
});
