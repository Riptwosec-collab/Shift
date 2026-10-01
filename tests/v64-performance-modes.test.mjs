import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createAppState } from '../src/state.js';
import { createScheduleCache } from '../src/cache.js';
import { STAFF } from '../src/data.js';

test('v6.4 state defaults and clamps without persistence',()=>{
  const state=createAppState();
  assert.equal(state.activeView,'overview');
  assert.equal(state.selectedDay,1);
  assert.equal(state.selectedPerson,0);
  assert.equal(state.visualMode,'BALANCED');
  state.setSelectedDay(99); assert.equal(state.selectedDay,31);
  state.setSelectedDay(-4); assert.equal(state.selectedDay,1);
  state.setSelectedPerson(99); assert.equal(state.selectedPerson,9);
  state.setActiveView('analytics'); assert.equal(state.activeView,'analytics');
});

test('visual modes preserve legacy structures while changing only cost profile',()=>{
  const css=fs.readFileSync('src/legacy-ui.css','utf8');
  for(const mode of ['HIGH','BALANCED','ECO']) assert.ok(css.includes(`[data-v64-mode="${mode}"]`),`missing ${mode}`);
  for(const marker of ['.cyber-scene','.roster-card','.insights-panel','.network-host','.month-snapshot']) assert.ok(css.includes(marker),`missing structural rule ${marker}`);
  assert.doesNotMatch(css,/data-v64-mode="(?:BALANCED|ECO)"[^}]*\}[^]*?(?:\.cyber-scene|\.roster-card|\.insights-panel|\.network-host|\.month-snapshot)[^{]*\{[^}]*display\s*:\s*none/i);
  const before=JSON.stringify(createScheduleCache(STAFF));
  const after=JSON.stringify(createScheduleCache(STAFF));
  assert.equal(after,before);
});
