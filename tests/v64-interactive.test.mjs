import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('legacy timeline analytics points and month cells converge on shared selected day',()=>{
  const code=fs.readFileSync('src/v64-interactive.js','utf8');
  assert.ok(code.includes('circle.activity-point[data-day]'));
  assert.ok(code.includes('setSelectedDay(day'));
  assert.ok(code.includes('openCellModal'));
  assert.ok(code.includes('v64State.setSelectedDay'));
  const baseline=fs.readFileSync('src/legacy-baseline.html','utf8');
  assert.ok(baseline.includes("$$('.date-node').forEach(b=>b.onclick=()=>setSelectedDay(+b.dataset.day))"),'legacy timeline must keep its original shared-day event binding');
});
