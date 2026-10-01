import test from 'node:test';
import assert from 'node:assert/strict';
import { STAFF } from '../src/data.js';
import { createScheduleCache } from '../src/cache.js';
import { pairRelation, networkModel } from '../src/network-model.js';

const cache=createScheduleCache(STAFF);

test('pair relation exposes same shifts handoffs and normalized strength',()=>{
  const rel=pairRelation(0,1,cache);
  assert.equal(rel.sameShift,rel.sameD+rel.sameN);
  assert.ok(rel.handoff>=0);
  assert.ok(rel.strength>=0&&rel.strength<=100);
  assert.equal(rel.other,1);
});

test('network model ranks strongest and preserves hidden relation details',()=>{
  const desktop=networkModel(0,cache,6);
  const tablet=networkModel(0,cache,5);
  const mobile=networkModel(0,cache,4);
  assert.ok(desktop.nodes.length<=6);
  assert.ok(tablet.nodes.length<=5);
  assert.ok(mobile.nodes.length<=4);
  assert.equal(desktop.relations.length,STAFF.length-1);
  for(let i=1;i<desktop.relations.length;i++) assert.ok(desktop.relations[i-1].strength>=desktop.relations[i].strength);
  assert.deepEqual(desktop.top,desktop.relations[0]);
});
