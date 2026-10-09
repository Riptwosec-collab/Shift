import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(path,'utf8');
test('fast loader is not held for three seconds and oncall is lazy on startup',()=>{
 const b=read('scripts/build.mjs'),html=read('index.html'),first=read('src/v651-engine.js'),second=read('src/v652-engine.js');
 assert.doesNotMatch(b,/TARGET=3000,HARD=3600/);
 assert.match(b,/TARGET=\d{2,3},HARD=\d{3,4}/);
 assert.doesNotMatch(html,/TARGET=3000,HARD=3600/);
 assert.doesNotMatch(first,/insertBefore\(view,footer\|\|null\);renderV651Oncall\(\)/);
 assert.doesNotMatch(first,/if\(name==='oncall'\)renderV651Oncall\(\)/);
 assert.doesNotMatch(second,/installV652Bridge\(\);renderV652Oncall\(\);/);
});
test('mobile PWA bottom navigation is full-bleed and viewport anchored',()=>{
 const css=read('src/v6515-ui.css');
 for(const marker of ['#mobileNav','bottom:0!important','left:0!important','right:0!important','position:fixed!important','safe-area-inset-bottom','min-height:48px','100dvh']) assert.ok(css.includes(marker),marker);
 assert.match(css,/@media\s*\(max-width:860px\)/);
 assert.match(css,/@media\s*\(display-mode:standalone\)/);
});
test('month and oncall render native mobile content rather than desktop scroll table',()=>{
 const js=read('src/v6515-mobile.js'),css=read('src/v6515-ui.css');
 for(const marker of ['v6515MobileMonth','v6515MobileOncall','v6515OncallCard','v6515MonthDay','v652Matrix','v652Overview','v652Timeline','ONCALL_SCHEDULE','staff','selectedDay'])assert.ok(js.includes(marker),marker);
 for(const marker of ['#monthView .table-wrap','#v6515MobileMonth','.v6515-oncall','.v6515-month-days','grid-template-columns:repeat(7,minmax(0,1fr))'])assert.ok(css.includes(marker),marker);
 assert.match(css,/html\[data-v6515-native-month="1"\][\s\S]*display:none!important/);
});
test('oncall range model preserves source segments and per-engineer order',async()=>{
 const {v6515OncallRanges,v6515TodayForLegacy}=await import('../src/v6515-mobile.js');
 const schedule=[{month:10,name:'ป้อ',start:1,end:7},{month:10,name:'เอิร์ท',start:8,end:14},{month:11,name:'ป้อ',start:1,end:4}];
 assert.deepEqual(v6515OncallRanges(schedule,10).map(x=>[x.name,x.start,x.end]),[['ป้อ',1,7],['เอิร์ท',8,14]]);
 assert.equal(v6515OncallRanges(schedule,12).length,0);
 assert.equal(v6515TodayForLegacy(new Date(2026,9,9,22,0)),9);
 assert.equal(v6515TodayForLegacy(new Date(2026,10,9)),null);
});
test('PWA resumes on focus and updates at midnight, without global polling loops',()=>{
 const js=read('src/v6515-mobile.js'),scheduler=read('src/v6514-mobile.js');
 for(const k of ['visibilitychange','pageshow','document.hidden','v6515LocalDateKey','setSelectedDay','addEventListener'])assert.ok(js.includes(k),k);
 for(const k of ['setTimeout','visibilitychange','pageshow','renderV652Oncall'])assert.ok(scheduler.includes(k),k);
 assert.doesNotMatch(js,/setInterval\s*\(/);
});
test('new release is wired to CSS JS cache and GitHub CI',()=>{
 const b=read('scripts/build.mjs'),h=read('index.html'),sw=read('sw.js'),wf=read('.github/workflows/v65-ci.yml');
 for(const k of ['v6515-ui.css','v6515-mobile.js','v6515-ui-style','data-app-version="6.5.19"','data-loader-version="6.5.19"','built v6.5.19'])assert.ok(b.includes(k),k);
 assert.match(h,/data-app-version="6\.5\.19"/);
 assert.ok(sw.includes('shift-shell-v6.5.19'));
 assert.ok(wf.includes('work/v6.5.15-pwa-mobile-native-performance'));
 assert.ok(wf.includes('tests/v6515-*.test.mjs'));
});
