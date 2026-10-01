import test from 'node:test';
import assert from 'node:assert/strict';
import { STAFF } from '../src/data.js';
import { createScheduleCache } from '../src/cache.js';
import { dailyModel, compareAdjacentDay, shiftTransitions, currentWorkStreakAt, currentNightStreakAt } from '../src/daily-model.js';
import { evaluateDayRisk, RISK_THRESHOLDS } from '../src/risk.js';

const cache=createScheduleCache(STAFF);

test('daily model exposes roster comparison transitions and streaks',()=>{
  const model=dailyModel(9,cache,STAFF);
  assert.equal(model.counts.D+model.counts.N+model.counts.OFF,10);
  assert.equal(model.coverage,60);
  assert.ok(model.comparison.previous);
  assert.ok(model.comparison.next);
  assert.ok(Array.isArray(model.transitions));
  for(const row of model.working) {
    assert.ok(row.workStreak>=1);
    assert.ok(row.nightStreak>=0);
  }
});

test('day boundaries never wrap outside October',()=>{
  assert.equal(compareAdjacentDay(1,cache).previous,null);
  assert.equal(compareAdjacentDay(31,cache).next,null);
  assert.deepEqual(shiftTransitions(31,STAFF),[]);
  assert.equal(currentWorkStreakAt(0,1,STAFF)>=0,true);
  assert.equal(currentNightStreakAt(0,31,STAFF)>=0,true);
});

test('staffing risk uses the approved centralized thresholds',()=>{
  assert.deepEqual(RISK_THRESHOLDS,{LOW_STAFFING:6,LOW_NIGHT_COVERAGE:2,CONSECUTIVE_WORK:3,LONG_NIGHT_STREAK:3,D_N_IMBALANCE:3,HIGH_OFF_COUNT:5});
  const risks=evaluateDayRisk(9,cache,STAFF);
  assert.ok(Array.isArray(risks));
  assert.ok(risks.every(r=>['critical','warning','info'].includes(r.level)));
});
