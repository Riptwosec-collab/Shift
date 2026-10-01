import test from 'node:test';
import assert from 'node:assert/strict';
import { STAFF } from '../src/data.js';
import { createScheduleCache } from '../src/cache.js';
import { analyticsModel } from '../src/analytics-model.js';

const cache=createScheduleCache(STAFF);

test('workload balance exposes complete per-person metrics',()=>{
  const model=analyticsModel(cache);
  assert.equal(model.people.length,10);
  for(const p of model.people){
    assert.equal(p.D+p.N+p.OFF,31);
    assert.equal(p.working,p.D+p.N);
    assert.equal(p.nightPct,p.working?Math.round(p.N/p.working*100):0);
    assert.equal(typeof p.deltaFromAvg,'number');
    assert.ok(p.longestWorkStreak>=0);
    assert.ok(p.longestNightStreak>=0);
  }
});

test('team workload summary keeps busiest and least staffed days',()=>{
  const model=analyticsModel(cache);
  assert.equal(model.team.busiest.working,Math.max(...model.daily.map(x=>x.working)));
  assert.equal(model.team.least.working,Math.min(...model.daily.map(x=>x.working)));
  assert.ok(model.team.avgWork>0);
  assert.ok(model.team.avgN>=0);
});
