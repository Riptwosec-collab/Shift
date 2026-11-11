import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {OCTOBER_2026_DUTY_POSITIONS as october} from '../src/october-2026-duty-roster.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';

const read=path=>fs.readFileSync(path,'utf8');
const src=read('src/v740-full-month-overview.js');
const css=read('src/v740-full-month-overview.css');
const fixture={readyState:'loading',documentElement:{lang:'th'},addEventListener(){}};
const api=new Function('staff','OCTOBER_2026_DUTY_POSITIONS','NOVEMBER_2026_DUTY_POSITIONS','document',src+
 '\nreturn {model:shift740Model,stats:shift740MonthStats,calendar:shift740Calendar,matrix:shift740Matrix,markup:shift740Markup,days:shift740Days};')(
 STAFF,october,november,fixture);

test('Overview renders complete October 31 days and November 30 days, not only eight dates',()=>{
 assert.equal(api.days(10),31);
 assert.equal(api.days(11),30);
 for(const [month,days] of [[10,31],[11,30]]){
  const cal=api.calendar(month,1);
  const matrix=api.matrix(month,1);
  assert.equal((cal.match(/class="s740-calendar-day/g)||[]).length,days);
  assert.equal((matrix.match(/data-s740-person="/g)||[]).length,days*STAFF.length);
  assert.equal((matrix.match(/class="s740-matrix-date/g)||[]).length,days);
  assert.match(cal,new RegExp('data-s740-day="'+days+'"'));
  assert.match(matrix,new RegExp('data-s740-col="'+days+'"'));
  assert.ok(matrix.includes('s740-matrix-viewport'));
 }
});
test('Every full-month position is sourced from the original 10×31 and 10×30 assignments',()=>{
 for(const [month,original] of [[10,october],[11,november]]){
  for(let day=1;day<=api.days(month);day++){
   const d=api.model(month,day);
   assert.equal(d.records.length,STAFF.length);
   assert.equal(d.counts.D+d.counts.N+d.counts.H,STAFF.length);
   d.records.forEach((r,i)=>assert.equal(r.code,original[i][day-1],month+'/'+day+'/'+i));
  }
 }
});
test('November 30 source N1 double assignment and absent N2 are presented as an alert',()=>{
 const d=api.model(11,30);
 assert.equal(d.posts.find(x=>x.code==='N1').people.length,2);
 assert.equal(d.posts.find(x=>x.code==='N2').people.length,0);
 assert.ok(d.anomalies.some(x=>x.code==='N1'&&x.count===2));
 assert.ok(d.anomalies.some(x=>x.code==='N2'&&x.count===0));
 assert.match(api.markup(11,30),/ต้องตรวจสอบ/);
 assert.throws(()=>api.model(11,31),RangeError);
 assert.throws(()=>api.model(10,32),RangeError);
});
test('Full month overview uses data-derived stats and preserves both months',()=>{
 const nov=api.stats(11),oct=api.stats(10);
 assert.deepEqual(nov,{D:102,N:60,H:138,days:30});
 assert.equal(oct.D+oct.N+oct.H,310);
 assert.equal(api.model(11,11).counts.D,4);
 assert.equal(api.model(11,11).counts.N,2);
 assert.equal(api.model(11,11).counts.H,4);
});
test('Source and built PWA match while existing 8-day preview remains reversible',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html');
 assert.ok(build.includes("'v740-full-month-overview.js'"));
 assert.ok(build.includes("v740-full-month-overview.css"));
 assert.ok(html.includes(src)&&html.includes(css));
 const release=html.match(/data-shift-release="(\d+\.\d+)"/);
 assert.ok(release&&Number(release[1])>=7.4,'Full Month Overview requires release 7.4+');
 assert.match(html,/data-app-version="6\.5\.20"/);
 assert.ok(html.includes('v6526-overview-eight.js'));
 assert.ok(html.includes('shift740AddVisualLab'));
 assert.doesNotMatch(src,/\bfetch\(|XMLHttpRequest|new Image\(/);
});
test('Graphic month UI uses accessible live CSS layout, not a static picture',()=>{
 for(const mark of ['aria-pressed','aria-label','scope="row"','data-s740-month','data-s740-day',
  's740-calendar-grid','s740-matrix-viewport','shift740OpenDetail','shift740MarkSelection'])
  assert.ok(src.includes(mark),mark);
 for(const mark of ['grid-template-columns:repeat(7','position:sticky','max-width:760px','max-width:370px',
  'prefers-reduced-motion','#overviewView .v6517-main-grid>.v6517-matrix'])
  assert.ok(css.includes(mark),mark);
 assert.doesNotMatch(src,/<img\b|<canvas|background-image:\s*url\(/);
});
