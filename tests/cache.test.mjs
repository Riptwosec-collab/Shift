import test from 'node:test';import assert from 'node:assert/strict';
import {STAFF} from '../src/data.js';import {createScheduleCache,currentWorkStreak,currentNightStreak} from '../src/cache.js';
const c=createScheduleCache(STAFF);
test('daily counts total ten and coverage is correct',()=>{for(let d=1;d<=31;d++){const x=c.dayStats[d];assert.equal(x.D+x.N+x.OFF,10);assert.equal(x.working,x.D+x.N);assert.equal(x.coverage,Math.round(x.working/10*100));}});
test('person totals and streaks are valid',()=>{for(let i=0;i<10;i++){const x=c.personStats[i];assert.equal(x.D+x.N+x.OFF,31);assert.ok(currentWorkStreak(STAFF,i,31)>=0);assert.ok(currentNightStreak(STAFF,i,31)>=0);}});
