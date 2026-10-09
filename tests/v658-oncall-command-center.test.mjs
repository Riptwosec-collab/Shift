import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.8-oncall-command-center';

test('v6.5.8 overview keeps only the centered Current + Next handoff matrix',()=>{
  assert.ok(fs.existsSync('src/v658-overrides.js'),'missing src/v658-overrides.js');
  const js=fs.readFileSync('src/v658-overrides.js','utf8');
  assert.match(js,/function\s+v652Overview\s*\(now\)/);
  assert.match(js,/v657RenderOverviewPairMatrix\(now\)/);
  assert.match(js,/v658-overview-center/);
  assert.doesNotMatch(js,/v655RenderTodayNext\(now\)/);
  assert.doesNotMatch(js,/v655RenderEngineerStrip\(now\)/);
  assert.doesNotMatch(js,/v655RenderSelectedDay\(now\)/);
  assert.match(js,/dataset\.appVersion='6\.5\.8'/);
});

test('v6.5.8 command-center layer centers Overview and upgrades Matrix states',()=>{
  assert.ok(fs.existsSync('src/v658-ui.css'),'missing src/v658-ui.css');
  const css=fs.readFileSync('src/v658-ui.css','utf8');
  for(const token of ['--v658-bg','--v658-panel','--v658-cyan','--v658-blue','--v658-violet','--v658-line','--v658-glow']) assert.ok(css.includes(token),`missing ${token}`);
  for(const marker of ['.v658-overview-center','.v657-overview-matrix','.v655-matrix-panel','.v652-matrix-day','.v652-matrix-name','.v652-matrix-cell','.v652-matrix-cell.v655-live','.v652-matrix-cell.v655-next','.v652-matrix-cell.v655-selected-day']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/max-width\s*:/);
  assert.match(css,/margin-inline\s*:\s*auto/);
  assert.match(css,/sticky/);
});

test('v6.5.8 command-center layer upgrades Oncall Timeline and performance fallbacks',()=>{
  const css=fs.readFileSync('src/v658-ui.css','utf8');
  for(const marker of ['.v652-timeline-panel','.v652-timeline-track','.v652-timeline-segment','.v652-timeline-segment.active','.v652-timeline-scale .today','.v652-handoff','.v652-handoff.active','data-v65-mode="HIGH"','data-v65-mode="BALANCED"','data-v65-mode="ECO"','prefers-reduced-motion']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/@keyframes\s+v658/);
  assert.match(css,/linear-gradient/);
  assert.match(css,/radial-gradient/);
});

test('v6.5.8 layer remains shipped in v6.5.17',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  for(const marker of ['v658-ui.css','v658-overrides.js','v658-ui-style','data-app-version="6.5.17"','data-loader-version="6.5.17"','built v6.5.17']) assert.ok(build.includes(marker),`build missing ${marker}`);
  assert.ok(workflow.includes(branch),'missing v6.5.8 branch trigger');
  assert.ok(workflow.includes('tests/v658-*.test.mjs'),'missing v6.5.8 release gate');
});
