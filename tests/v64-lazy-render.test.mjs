import test from 'node:test';
import assert from 'node:assert/strict';
import { createLazyViewRegistry } from '../src/view-registry.js';

test('startup mounts overview only and unopened views do zero render work',()=>{
  const calls={overview:0,daily:0,person:0,month:0,analytics:0};
  const registry=createLazyViewRegistry();
  for(const name of Object.keys(calls)) registry.register(name,()=>{calls[name]++},()=>{calls[name]++});
  registry.start('overview');
  assert.deepEqual(calls,{overview:1,daily:0,person:0,month:0,analytics:0});
  assert.equal(registry.isMounted('daily'),false);
  registry.show('daily');
  assert.equal(calls.daily,1);
  assert.equal(registry.isMounted('daily'),true);
  registry.show('daily');
  assert.equal(calls.daily,2,'revisit updates but never remounts');
});

test('dependent updates touch mounted views only',()=>{
  const touched=[];
  const registry=createLazyViewRegistry();
  registry.register('overview',()=>{},()=>touched.push('overview'));
  registry.register('daily',()=>{},()=>touched.push('daily'));
  registry.register('analytics',()=>{},()=>touched.push('analytics'));
  registry.start('overview');
  registry.updateMounted(['overview','daily','analytics']);
  assert.deepEqual(touched,['overview']);
  registry.show('analytics');
  touched.length=0;
  registry.updateMounted(['overview','daily','analytics']);
  assert.deepEqual(touched,['overview','analytics']);
});
