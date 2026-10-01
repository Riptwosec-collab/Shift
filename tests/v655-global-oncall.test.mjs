import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.5-global-neon-oncall';

test('v6.5.5 model returns every overlapping assignment for one date',async()=>{
  const mod=await import('../src/oncall.js');
  assert.equal(typeof mod.findOncallAssignments,'function');
  const schedule=[
    {month:10,start:1,end:3,name:'Alpha'},
    {month:10,start:2,end:4,name:'Beta'},
  ];
  assert.deepEqual(mod.findOncallAssignments(schedule,new Date(2026,9,2)).map(row=>row.name),['Alpha','Beta']);
});

test('v6.5.5 model exposes current and grouped next assignments',async()=>{
  const mod=await import('../src/oncall.js');
  assert.equal(typeof mod.getOncallAssignmentsForDate,'function');
  assert.equal(typeof mod.getNextOncallAssignments,'function');
  assert.deepEqual(mod.getOncallAssignmentsForDate(new Date(2026,9,2)).map(row=>row.name),['ป้อ']);
  const next=mod.getNextOncallAssignments(new Date(2026,9,2));
  assert.deepEqual(next.map(row=>row.name),['เอิร์ท']);
  assert.ok(next.every(row=>row.month===10&&row.start===8));
});

test('v6.5.5 matrix adds assignments while retaining v6.5.2 compatibility fields',async()=>{
  const mod=await import('../src/oncall.js');
  const october=mod.getOncallMonthMatrix(10);
  assert.ok(Array.isArray(october.days[0].assignments));
  assert.deepEqual(october.days[0].assignments.map(row=>row.name),['ป้อ']);
  assert.equal(october.days[0].name,'ป้อ');
  const december=mod.getOncallMonthMatrix(12);
  assert.ok(Array.isArray(december.days[30].assignments));
  assert.equal(december.days[30].assignments.length,0);
  assert.equal(december.days[30].name,null);
});

test('v6.5.5 Engineer Oncall exposes individual Today Next strip matrix and selected-day states',()=>{
  const engine=fs.readFileSync('src/v652-engine.js','utf8');
  for(const marker of [
    'data-oncall-mode="overview"','data-oncall-mode="matrix"','data-oncall-mode="timeline"',
    'v655SelectedDay','v655FocusedEngineer','v655InitialSelectedDay','v655SelectDay','v655FocusEngineer',
    'v655RenderTodayNext','v655RenderEngineerStrip','v655RenderMatrix','v655RenderSelectedDay',
    'v655-today-list','v655-next-list','data-v655-engineer','data-v655-day','data-v655-cell','v655-selected-day-detail',
    'getOncallAssignmentsForDate','getNextOncallAssignments','aria-label','tabindex'
  ]) assert.ok(engine.includes(marker),`missing ${marker}`);
  assert.match(engine,/dataset\.appVersion='6\.5\.5'/);
  assert.match(engine,/v654-oncall-surface/);
});

test('v6.5.5 selection contract handles current month, first scheduled day, locale rerender and unassigned dates',()=>{
  const engine=fs.readFileSync('src/v652-engine.js','utf8');
  assert.match(engine,/now\.getFullYear\(\)===2026/);
  assert.match(engine,/find\(item=>item\.assignments\.length>0\)/);
  assert.match(engine,/document\.addEventListener\('v65:localechange',renderV652Oncall\)/);
  assert.match(engine,/v655FocusedEngineer=null/);
  assert.match(engine,/unassigned|Unassigned/);
});

test('v6.5.5 plan uses the approved feature branch',()=>{
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  assert.ok(workflow.includes(branch));
});
