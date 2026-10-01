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

test('v6.5.5 plan uses the approved feature branch',()=>{
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  assert.ok(workflow.includes(branch));
});
