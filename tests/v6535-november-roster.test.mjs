import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november,NOVEMBER_2026_DUTY_META as meta} from '../src/november-2026-duty-roster.js';
import {OCTOBER_2026_DUTY_POSITIONS as october} from '../src/october-2026-duty-roster.js';
const read=p=>fs.readFileSync(p,'utf8');
const roles=new Set(['H','D1','D2','D3','D4','N1','N2']);
test('November 2569 has 10 original employees and exactly 30 calendar days',()=>{
 assert.equal(meta.year,2026);assert.equal(meta.month,11);assert.equal(meta.days,30);
 assert.equal(STAFF.length,10);assert.equal(november.length,10);
 november.forEach((row,i)=>{assert.equal(row.length,30,'staff '+i);row.forEach(role=>assert.ok(roles.has(role)))});
 assert.equal(november.flat().length,300);
});
test('source positions have 29 complete days; preserve and flag the source conflict on Nov 30',()=>{
 for(let day=1;day<=30;day++){
  const positions=november.map(row=>row[day-1]).filter(role=>role!=='H');
  const duplicates=positions.filter((v,i)=>positions.indexOf(v)!==i);
  const missing=['D1','D2','N1','N2'].filter(role=>!positions.includes(role));
  for(const role of ['D1','D2'])assert.ok(positions.includes(role),'missing '+role+' on day '+day);
  assert.ok([2,4].includes(positions.filter(x=>x[0]==='D').length));
  assert.equal(positions.filter(x=>x[0]==='N').length,2);
  if(day<30){assert.deepEqual(duplicates,[]);assert.deepEqual(missing,[])}
  else {assert.deepEqual(duplicates,['N1']);assert.deepEqual(missing,['N2'])}
 }
 assert.equal(november[0][29],'N1');assert.equal(november[1][29],'N1');
 assert.equal(november.flat().filter(x=>x==='H').length,138);
 assert.equal(meta.hasUnverifiedNov30NightPosition,true);
});
test('October remains 31 days and is never overwritten by November',()=>{
 assert.equal(october.length,10);
 october.forEach(row=>assert.equal(row.length,31));
 assert.equal(october[0][0],'H');assert.equal(november[0][0],'H');
 assert.equal(october[0][5],'D1');assert.equal(november[0][5],'N2');
});
test('responsive November UI has month switcher, 30-day heatmap, seven-day mobile and daily details',()=>{
 const js=read('src/v6535-november-view.js'),css=read('src/v6535-november-view.css');
 for(const key of ['shiftNovChangeMonth','shiftNovRenderGrid','shiftNovWeekMarkup','shiftNovRenderDetails','shiftNovIssues','data-shift-month="11"','shift-nov-table','data-shift-nov-date'])assert.ok(js.includes(key),key);
 assert.ok(js.includes('SHIFT_NOV_DAYS=30'));
 assert.ok(js.includes('source-warning')||js.includes('shift-nov-source-warning'));
 assert.ok(css.includes('[data-shift-month="11"]'));
 assert.ok(css.includes('.shift-nov-week'));
});
test('generated PWA embeds the November roster, view, and upgraded cache',()=>{
 const html=read('index.html'),build=read('scripts/build.mjs');
 const roster=read('src/november-2026-duty-roster.js').replace(/^export\s+/gm,'');
 assert.ok(html.includes(roster));
 assert.ok(html.includes(read('src/v6535-november-view.js')));
 assert.ok(html.includes(read('src/v6535-november-view.css')));
 assert.ok(build.includes("'november-2026-duty-roster.js','v6535-november-view.js'"));
 assert.ok(build.includes('v6535-november-view.css'));
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r17'"));
});
