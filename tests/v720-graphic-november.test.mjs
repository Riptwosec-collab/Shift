import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';
const src=fs.readFileSync('src/v720-graphic-november.js','utf8');
const css=fs.readFileSync('src/v720-graphic-november.css','utf8');
function system(day=11,span='month'){
 const doc={readyState:'loading',addEventListener(){},getElementById(){return null}};
 const callbacks=new Function('staff','NOVEMBER_2026_DUTY_POSITIONS','SHIFT_NOV_SHEET_NICKNAMES',
 'document','shiftV7BangkokToday','shiftNovSelectedDay',
 src+'\nshift72Span='+JSON.stringify(span)+';shift72Week=shift72WeekFor(shiftNovSelectedDay);'+
 '\nreturn {day:shift72DayModel,totals:shift72Totals,days:shift72PeriodDays,'+
 'matrix:shift72MatrixMarkup,graph:shift72GraphicMarkup,crew:shift72CrewMarkup,trend:shift72TrendMarkup};');
 return callbacks(STAFF,november,['นุ๊ก','พี่ยาว','ครีม','ทิชา','คิว','นิว','เต้ย','เมฆ','แคปหมู','คี'],
 doc,()=>({year:2026,month:11,day}),day);
}
test('graphic board renders all 300 source cells, no screenshots or pictures',()=>{
 const app=system(11);
 const board=app.matrix();
 assert.equal((board.match(/class="shift72-duty-pill/g)||[]).length,300);
 assert.equal((board.match(/class="shift72-person-heading" scope="row"/g)||[]).length,10);
 assert.ok(board.includes('D1'));
 assert.ok(board.includes('N2'));
 assert.ok(board.includes('tone-H'));
 assert.ok(board.includes('data-shift72-day="11"'));
 assert.doesNotMatch(app.graph(),/<img|<canvas|background-image:\s*url\(/i);
 assert.ok(app.graph().includes('shift72-trend-svg'));
 assert.ok(app.graph().includes('shift72-position-grid'));
});
test('November 11 counts and per-person source code remain exact',()=>{
 const app=system(11);
 const snapshot=app.day(11);
 assert.deepEqual(snapshot.counts,{D:4,N:2,H:4});
 assert.equal(snapshot.posts.length,6);
 assert.equal(snapshot.people.length,10);
 for(const [i,p] of snapshot.people.entries())assert.equal(p.code,november[i][10]);
 const totals=app.totals();
 assert.deepEqual(totals,{D:102,N:60,H:138});
});
test('November 30 preserves duplicate N1 and missing N2, with visible warning',()=>{
 const app=system(30);
 const model=app.day(30);
 assert.deepEqual(model.duplicate,['N1']);
 assert.ok(model.missing.includes('N2'));
 assert.equal(model.posts.find(p=>p.code==='N1').people.length,2);
 assert.equal(model.posts.find(p=>p.code==='N2').people.length,0);
 assert.match(app.graph(),/ข้อมูลต้นฉบับ/);
 assert.match(app.crew(),/ตรวจสอบ/);
 assert.throws(()=>app.day(31),RangeError);
});
test('mobile seven-day mode shows only selected week while preserving exact roles',()=>{
 const app=system(11,'week');
 assert.deepEqual(app.days(),[8,9,10,11,12,13,14]);
 assert.equal((app.matrix().match(/class="shift72-duty-pill/g)||[]).length,70);
 const last=system(30,'week');
 assert.deepEqual(last.days(),[24,25,26,27,28,29,30]);
});
test('original spreadsheet remains available as an optional view',()=>{
 const html=fs.readFileSync('index.html','utf8');
 const build=fs.readFileSync('scripts/build.mjs','utf8');
 assert.ok(build.includes('v720-graphic-november.js'));
 assert.ok(build.includes('v720-graphic-november.css'));
 assert.ok(html.includes(src));
 assert.ok(html.includes(css));
 assert.ok(html.includes('shiftNovRenderGrid=shiftNovRenderReferenceSheet'));
 assert.ok(src.includes('data-shift72-mode="sheet"'));
 assert.ok(src.includes('data-shift72-mode="graphic"'));
 assert.ok(css.includes('#shiftNovemberView[data-shift72-mode="sheet"] #shift72Graphic'));
 assert.ok(src.includes('shift72MountOverviewEntry'));
});
test('responsive, accessible and motion-safe graphical view',()=>{
 for(const key of ['aria-label','aria-pressed','role="region"','data-shift72-person','data-shift72-day'])
  assert.ok(src.includes(key),key);
 for(const key of ['@media(max-width:760px)','@media(max-width:360px)','prefers-reduced-motion','data-shift-effects="lite"','.shift72-board-viewport'])
  assert.ok(css.includes(key),key);
 assert.doesNotMatch(src,/fetch\(|XMLHttpRequest|new Image\(|setInterval\(|<img\b/i);
 assert.ok(src.includes('NOVEMBER_2026_DUTY_POSITIONS'));
});