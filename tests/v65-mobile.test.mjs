import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=()=>fs.readFileSync('src/v65-ui.css','utf8');
const engine=()=>fs.readFileSync('src/v65-engine.js','utf8');

test('mobile bilingual controls preserve safe area and practical tap targets',()=>{
  const s=css();
  assert.ok(s.includes('safe-area-inset-bottom')||s.includes('var(--v64-safe-bottom)'));
  assert.match(s,/@media\(max-width:860px\)[\s\S]*\.v65-language button[\s\S]*min-height\s*:\s*(40|4[1-9])px/);
  assert.match(s,/@media\(max-width:860px\)[\s\S]*\.v64-quality button[\s\S]*min-height\s*:\s*(40|4[1-9])px/);
  assert.match(s,/@media\(max-width:860px\)[\s\S]*\.mobile-nav button[\s\S]*min-height\s*:\s*(40|4[1-9])px/);
});

test('English mobile labels can wrap instead of clipping',()=>{
  const s=css();
  assert.ok(s.includes('html[data-locale="en"] .mobile-nav button'));
  assert.match(s,/html\[data-locale="en"\] \.mobile-nav button[\s\S]*white-space\s*:\s*normal/);
  assert.match(s,/text-overflow\s*:\s*clip/);
});

test('language and mode controls expose localized ARIA and pressed state',()=>{
  const s=engine();
  assert.ok(s.includes('function enhanceV65ModeControl'));
  assert.ok(s.includes("accessibility.language"));
  assert.ok(s.includes("accessibility.performance"));
  assert.ok(s.includes("aria-pressed"));
  assert.ok(s.includes("aria-label"));
  assert.doesNotMatch(s,/location\.reload/);
});

test('reduced motion and eco rules do not remove structural content',()=>{
  const s=css();
  assert.ok(s.includes('@media(prefers-reduced-motion:reduce)'));
  for(const selector of ['.cyber-scene','.roster-card','.insights-panel','.network-host','.month-snapshot']){
    assert.ok(s.includes(selector));
  }
});
