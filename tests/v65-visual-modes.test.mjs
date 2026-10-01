import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {VISUAL_PROFILES,visualProfile,createPerformanceController} from '../src/performance.js';

const flags=['ambient','scan','parallax','networkMotion','glass','richHover','continuousMotion'];

test('HIGH BALANCED ECO expose materially different cost profiles',()=>{
  assert.deepEqual(Object.keys(VISUAL_PROFILES),['HIGH','BALANCED','ECO']);
  for(const flag of flags) assert.equal(VISUAL_PROFILES.HIGH[flag],true,`HIGH ${flag}`);
  assert.equal(VISUAL_PROFILES.BALANCED.ambient,false);
  assert.equal(VISUAL_PROFILES.BALANCED.scan,false);
  assert.equal(VISUAL_PROFILES.BALANCED.parallax,false);
  assert.equal(VISUAL_PROFILES.BALANCED.networkMotion,false);
  assert.equal(VISUAL_PROFILES.BALANCED.glass,true);
  assert.equal(VISUAL_PROFILES.BALANCED.richHover,false);
  assert.equal(VISUAL_PROFILES.BALANCED.continuousMotion,true);
  for(const flag of flags) assert.equal(VISUAL_PROFILES.ECO[flag],false,`ECO ${flag}`);
  assert.deepEqual(visualProfile('bad'),VISUAL_PROFILES.BALANCED);
});

test('controller stays in-memory and only updates visual root state',()=>{
  const root={dataset:{}};
  const controller=createPerformanceController(root);
  assert.equal(controller.getVisualMode(),'BALANCED');
  controller.setVisualMode('HIGH');assert.equal(root.dataset.visual,'high');
  controller.setVisualMode('ECO');assert.equal(root.dataset.visual,'eco');
  const source=fs.readFileSync('src/performance.js','utf8');
  assert.doesNotMatch(source,/localStorage|sessionStorage/);
});

test('v6.5 CSS makes balanced visibly calm, eco static and honors reduced motion',()=>{
  const css=fs.readFileSync('src/v65-ui.css','utf8');
  for(const mode of ['HIGH','BALANCED','ECO']) assert.ok(css.includes(`[data-v64-mode="${mode}"]`),`missing ${mode} rules`);
  assert.match(css,/data-v64-mode="BALANCED"[\s\S]*?\.ambient[\s\S]*?animation\s*:\s*none/);
  assert.match(css,/data-v64-mode="BALANCED"[\s\S]*?\.scan-beam[\s\S]*?animation\s*:\s*none/);
  assert.match(css,/data-v64-mode="ECO"[\s\S]*?animation\s*:\s*none\s*!important/);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  for(const selector of ['.cyber-scene','.roster-card','.insights-panel','.network-host','.month-snapshot']) assert.ok(css.includes(selector));
});
