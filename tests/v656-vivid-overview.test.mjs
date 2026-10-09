import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('v6.5.6 Engineer Oncall overview keeps only current and next people',()=>{
  const js=fs.readFileSync('src/v656-overrides.js','utf8');
  assert.match(js,/function\s+v652Overview\s*\(now\)/);
  assert.match(js,/v655RenderTodayNext\(now\)/);
  assert.doesNotMatch(js,/v655RenderEngineerStrip\(now\)/);
  assert.doesNotMatch(js,/v655RenderMatrix\(now/);
  assert.doesNotMatch(js,/v655RenderSelectedDay\(now\)/);
});

test('v6.5.6 vivid layer raises global contrast and preserves performance modes',()=>{
  const css=fs.readFileSync('src/v656-ui.css','utf8');
  for(const marker of ['--v656-cyan','--v656-violet','--v656-pink','--v656-green','--v656-amber','data-v65-mode="HIGH"','data-v65-mode="BALANCED"','data-v65-mode="ECO"','prefers-reduced-motion']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/\.v655-now-panel\.live/);
  assert.match(css,/\.v655-now-panel\.next/);
  assert.match(css,/\.nav-btn\.active/);
  assert.match(css,/linear-gradient/);
  assert.match(css,/radial-gradient/);
});

test('v6.5.6 vivid layer remains shipped in v6.5.15',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  assert.match(build,/v656-ui\.css/);
  assert.match(build,/v656-overrides\.js/);
  assert.match(build,/v656-ui-style/);
  assert.match(build,/data-app-version=\"6\.5\.15\"/);
  assert.match(build,/data-loader-version=\"6\.5\.15\"/);
});
