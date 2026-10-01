import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('v6.4 additive engine exposes new operations without replacing legacy shell',()=>{
  const engine=fs.readFileSync('src/v64-engine.js','utf8');
  const css=fs.readFileSync('src/legacy-ui.css','utf8');
  for(const marker of ['v64-quality','v64DailyOps','v64NetworkDetails','v64WorkloadBalance','v64Palette','v64StickyDaily']){
    assert.ok(engine.includes(marker)||css.includes(marker),`missing ${marker}`);
  }
  for(const feature of ['Ctrl+K','ArrowDown','ArrowUp','Escape','setupMobileSwipe','setVisualMode','evaluateDayRisk','analyticsModel','networkModel']){
    assert.ok(engine.includes(feature),`engine missing ${feature}`);
  }
});

test('mobile additive styles respect safe area and keep legacy navigation',()=>{
  const css=fs.readFileSync('src/legacy-ui.css','utf8');
  assert.match(css,/safe-area-inset-bottom/);
  assert.ok(css.includes('.v64-sticky-daily'));
  assert.ok(css.includes('.v64-palette'));
  const baseline=fs.readFileSync('src/legacy-baseline.html','utf8');
  assert.ok(baseline.includes('id="mobileNav"'));
});
