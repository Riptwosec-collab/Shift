import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 DECEMBER_2026_DUTY_POSITIONS as schedule,
 DECEMBER_2026_DUTY_META as meta,
 DECEMBER_2026_SOURCE_HIGHLIGHTS as highlights
} from '../src/december-2026-duty-roster.js';
import {OCTOBER_2026_DUTY_POSITIONS as october} from '../src/october-2026-duty-roster.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const overview=read('../src/v740-full-month-overview.js');
const details=read('../src/v1200-december-view.js');
const navigation=read('../src/v731-november-access.js');
const month=read('../src/v6535-november-view.js');
const build=read('../scripts/build.mjs');
const html=read('../index.html');
const css=read('../src/v1200-december-view.css');
const valid=new Set(['D1','D2','D3','D4','N1','N2','N','H']);

test('December 2569 has 10 unchanged staff rows and exactly 31 source cells each',()=>{
 assert.equal(meta.year,2026);assert.equal(meta.month,12);assert.equal(meta.days,31);
 assert.equal(schedule.length,10);
 for(let i=0;i<10;i++){
  assert.equal(schedule[i].length,31,'staff row '+(i+1));
  for(let d=1;d<=31;d++)assert.ok(valid.has(schedule[i][d-1]),'row '+(i+1)+' day '+d);
  assert.ok(Object.isFrozen(schedule[i]));
 }
 assert.ok(Object.isFrozen(schedule));
 assert.equal(schedule.flat().length,310);
 assert.equal(new Date(2026,11,1).getDay(),2,'Dec 1 2026 is Tuesday');
 assert.equal(new Date(2026,11,31).getDay(),4,'Dec 31 2026 is Thursday');
 assert.equal(october.length,10);assert.equal(november.length,10);
 assert.ok(october.every(row=>row.length===31));
 assert.ok(november.every(row=>row.length===30));
});
test('unnumbered N from screenshot is preserved, not silently mapped to N1/N2',()=>{
 const unknown=schedule.flatMap((row,person)=>row.flatMap((code,index)=>code==='N'?[[person,index+1]]:[]));
 assert.deepEqual(unknown,[[1,1],[5,6],[6,7]]);
 assert.equal(schedule[0][0],'N1');assert.equal(schedule[0][1],'N2');
 assert.equal(schedule[1][0],'N');
 assert.equal(schedule[5][5],'N');assert.equal(schedule[6][6],'N');
 assert.equal(schedule[9][30],'N2');
});
test('December 31 source retains H highlights and only its actual shifts',()=>{
 const last=schedule.map(row=>row[30]);
 assert.deepEqual(last,['N1','H','H','D1','D2','H','H','H','H','N2']);
 const onDay1=schedule.map(row=>row[0]);
 assert.equal(onDay1.filter(x=>x.startsWith('D')).length,4);
 assert.equal(onDay1.filter(x=>x.startsWith('N')).length,2);
 assert.equal(onDay1.filter(x=>x==='H').length,4);
});
test('reference highlight colors are annotations only on source H cells',()=>{
 assert.equal(highlights.length,10);
 for(let i=0;i<highlights.length;i++){
  assert.ok(Object.isFrozen(highlights[i]));
  for(const kind of ['yellow','red'])
   for(const day of highlights[i][kind])
    assert.equal(schedule[i][day-1],'H',kind+' highlight at '+i+'/'+day);
 }
 assert.deepEqual(highlights[0].yellow,[4,5,6,7]);
 assert.deepEqual(highlights[2].red,[7,31]);
 assert.deepEqual(highlights[9].yellow,[6,7,8,9,10,11]);
});
test('December month is visible and selectable in overview/month pages',()=>{
 assert.ok(overview.includes('DECEMBER_2026_DUTY_POSITIONS'));
 assert.ok(overview.includes("12:'December 2026'"));
 assert.ok(overview.includes("[10,'ตุลาคม'],[11,'พฤศจิกายน'],[12,'ธันวาคม']"));
 assert.ok(month.includes('data-shift-month="12"'));
 assert.ok(navigation.includes("['10','11','12']"));
 assert.ok(details.includes("shiftDecSetDay"));
 assert.ok(details.includes("shiftDecRefresh"));
 assert.ok(details.includes("shiftDecMarkNavigation"));
 assert.ok(details.includes("DECEMBER_2026_SOURCE_HIGHLIGHTS"));
});
test('December assets are in source build and inline currently served index',()=>{
 for(const filename of ['december-2026-duty-roster.js','v1200-december-view.js','v1200-december-view.css'])
  assert.ok(build.includes(filename),'Missing build asset '+filename);
 assert.ok(html.includes('// december-2026-duty-roster.js'));
 assert.ok(html.includes('// v1200-december-view.js'));
 assert.ok(html.includes('id="v1200-december-view-style"'));
 assert.ok(html.includes('data-shift-release="12.0"'));
 assert.ok(css.includes('data-shift-month="12"'));
});
