import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';
import {OCTOBER_2026_DUTY_POSITIONS as october} from '../src/october-2026-duty-roster.js';

const read=path=>fs.readFileSync(path,'utf8');
const source=read('src/v700-experience.js');
const css=read('src/v700-experience.css');
function experience(){
 const document={readyState:'loading',documentElement:{lang:'th'},addEventListener(){}};
 return new Function('staff','NOVEMBER_2026_DUTY_POSITIONS','OCTOBER_2026_DUTY_POSITIONS','document',
 source+'\nreturn {model:shiftV7Model,graph:shiftV7Graph,positions:SHIFT_V7_POSTS,dayRange:shiftV7DayRange};')(
 STAFF,november,october,document);
}
test('v7 duty orbit reads source-of-truth duty codes for both months',()=>{
 const e=experience();
 assert.deepEqual(e.positions,['D1','D2','D3','D4','N1','N2']);
 assert.equal(e.dayRange(10),31);assert.equal(e.dayRange(11),30);
 for(const month of [10,11]){
  const raw=month===10?october:november;
  for(let day=1;day<=(month===10?31:30);day++){
   const model=e.model(month,day);
   assert.equal(model.records.length,STAFF.length);
   assert.equal(model.dayCount+model.nightCount+model.offCount,STAFF.length);
   model.records.forEach((row,index)=>assert.equal(row.code,raw[index][day-1]));
  }
 }
});
test('November 30 never invents N2 when the reference contains two N1 assignments',()=>{
 const e=experience(),snapshot=e.model(11,30);
 assert.deepEqual(snapshot.duplicates,['N1']);
 assert.deepEqual(snapshot.incomplete,['N2']);
 assert.equal(snapshot.positions.find(p=>p.post==='N1').people.length,2);
 assert.equal(snapshot.positions.find(p=>p.post==='N2').people.length,0);
 assert.equal(snapshot.dayCount,4);assert.equal(snapshot.nightCount,2);assert.equal(snapshot.offCount,4);
 assert.throws(()=>e.model(11,31),RangeError);
 assert.equal(e.graph(e.model(11,11)).length,7);
});
test('build includes V6.6-V7.1 and checked-in HTML contains exact source',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html');
 assert.match(build,/v700-experience\.css/);
 assert.match(build,/v700-experience\.js/);
 assert.match(html,/id="v700-experience-style"/);
 assert.ok(html.includes(css));
 assert.ok(html.includes(source));
 assert.match(html,/shiftV7MountExperience/);
});
test('v7 is additive, motion-safe, and has no remote 3D dependency',()=>{
 for(const token of ['shiftV7MountExperience','shiftV7MountMatrixFilters','shiftV7MountMatrixHover','shiftV7MountAmbient','shiftV7OpenMonth','shiftV7ApplyQuality'])
  assert.ok(source.includes(token),token);
 for(const token of ['data-shift-v7-action="prev"','data-shift-v7-action="next"','data-shift-v7-action="today"','data-shift-v7-action="quality"','data-v7-filter','aria-pressed','IntersectionObserver'])
  assert.ok(source.includes(token),token);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css, /@media\(max-width:760px\)/);
 assert.match(css, /data-shift-effects="lite"/);
 assert.match(css, /animation-play-state:paused/);
 assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|WebGLRenderer|setInterval\(/);
});
