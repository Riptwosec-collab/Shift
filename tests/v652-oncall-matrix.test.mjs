import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const names=['ป้อ','เอิร์ท','ตั้ม','แอม'];

test('oncall matrix exposes one owner per covered date and month metadata',async()=>{
  const mod=await import('../src/oncall.js');
  assert.equal(typeof mod.getOncallMonthMatrix,'function');
  const october=mod.getOncallMonthMatrix(10);
  assert.equal(october.month,10);
  assert.equal(october.daysInMonth,31);
  assert.deepEqual(october.engineers,names);
  assert.equal(october.days.length,31);
  assert.equal(october.days[0].name,'ป้อ');
  assert.deepEqual(october.days[0].assignments.map(row=>row.name),['ป้อ']);
  assert.equal(october.days[7].name,'เอิร์ท');
  assert.equal(october.days[14].name,'ตั้ม');
  assert.equal(october.days[21].name,'แอม');
  assert.equal(october.days[28].name,'ป้อ');
  assert.equal(october.days.filter(day=>day.name).length,31);
  const december=mod.getOncallMonthMatrix(12);
  assert.equal(december.daysInMonth,31);
  assert.equal(december.days[30].name,null);
  assert.deepEqual(december.days[30].assignments,[]);
});

test('v6.5.2 Engineer Oncall foundation remains in v6.5.17 with Overview Matrix Timeline and month controls',()=>{
  const engine=fs.readFileSync('src/v652-engine.js','utf8');
  const css=fs.readFileSync('src/v652-oncall.css','utf8');
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  for(const marker of ['v652-view-tabs','data-oncall-mode="overview"','data-oncall-mode="matrix"','data-oncall-mode="timeline"','v652-month-switch','v652MatrixGrid','v652Timeline']) assert.ok(engine.includes(marker),`missing ${marker}`);
  for(const marker of ['.v652-matrix','.v652-matrix-cell','.v652-matrix-cell.active','.v652-timeline-track','.v652-view-tabs']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(engine,/Today|วันนี้/);
  assert.match(engine,/ACTIVE ONCALL/);
  assert.match(engine,/aria-label/);
  assert.match(build,/v652-engine\.js/);
  assert.match(build,/v652-oncall\.css/);
  assert.match(build,/data-app-version=\"6\.5\.17\"/);
});

test('v6.5.2 keeps the approved oncall source rotation immutable',()=>{
  const oncall=fs.readFileSync('src/oncall.js','utf8');
  for(const name of names) assert.ok(oncall.includes(`name:'${name}'`));
  assert.ok(oncall.includes("{month:10,start:1,end:7,name:'ป้อ'}"));
  assert.ok(oncall.includes("{month:12,start:24,end:30,name:'ป้อ'}"));
});
