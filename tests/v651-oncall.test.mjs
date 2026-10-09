import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const expected=[
  {month:10,start:1,end:7,name:'ป้อ'},
  {month:10,start:8,end:14,name:'เอิร์ท'},
  {month:10,start:15,end:21,name:'ตั้ม'},
  {month:10,start:22,end:28,name:'แอม'},
  {month:10,start:29,end:31,name:'ป้อ'},
  {month:11,start:1,end:4,name:'ป้อ'},
  {month:11,start:5,end:11,name:'เอิร์ท'},
  {month:11,start:12,end:18,name:'ตั้ม'},
  {month:11,start:19,end:25,name:'แอม'},
  {month:11,start:26,end:30,name:'ป้อ'},
  {month:12,start:1,end:2,name:'ป้อ'},
  {month:12,start:3,end:9,name:'เอิร์ท'},
  {month:12,start:10,end:16,name:'ตั้ม'},
  {month:12,start:17,end:23,name:'แอม'},
  {month:12,start:24,end:30,name:'ป้อ'}
];

test('oncall schedule matches the approved Oct-Dec 2026 rotation',async()=>{
  const mod=await import('../src/oncall.js');
  assert.deepEqual(mod.ONCALL_SCHEDULE,expected);
  assert.equal(mod.getOncallForDate(new Date(2026,9,1))?.name,'ป้อ');
  assert.equal(mod.getOncallForDate(new Date(2026,9,14))?.name,'เอิร์ท');
  assert.equal(mod.getOncallForDate(new Date(2026,10,25))?.name,'แอม');
  assert.equal(mod.getOncallForDate(new Date(2026,11,30))?.name,'ป้อ');
  assert.equal(mod.getOncallForDate(new Date(2026,11,31)),null);
});

test('v6.5.1 foundation suppresses Daily Operations and remains in v6.5.19 build',()=>{
  const v651=fs.readFileSync('src/v651-engine.js','utf8');
  const css=fs.readFileSync('src/v651-oncall.css','utf8');
  const i18n=fs.readFileSync('src/i18n-copy.js','utf8');
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  assert.match(v651,/function suppressV64DailyOps/);
  assert.match(v651,/document\.getElementById\('v64DailyOps'\)\?\.remove\(\)/);
  assert.match(v651,/ensureV64DailyOps=suppressV64DailyOps/);
  assert.match(v651,/data-view=["']oncall["']/);
  assert.match(v651,/oncallView/);
  assert.match(v651,/Engineer Oncall/);
  assert.match(css,/\.v651-oncall-table/);
  assert.match(i18n,/oncall:'Engineer Oncall'/);
  assert.match(build,/v651-engine\.js/);
  assert.match(build,/v651-oncall\.css/);
  assert.match(build,/data-app-version=\"6\.5\.19\"/);
});
