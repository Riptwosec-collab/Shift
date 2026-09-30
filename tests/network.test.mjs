import test from 'node:test';import assert from 'node:assert/strict';import {STAFF} from '../src/data.js';import {createScheduleCache} from '../src/cache.js';import {networkModel,normalizeStrength} from '../src/network.js';
test('zero overlap strength is safe',()=>assert.equal(normalizeStrength(0,0),0));
test('network model ranks teammates and limits visible nodes',()=>{const c=createScheduleCache(STAFF);const m=networkModel(0,c,6);assert.equal(m.center,0);assert.ok(m.nodes.length<=6);assert.ok(m.relations.length===9);for(const x of m.relations){assert.ok(x.strength>=0&&x.strength<=100);}});
