import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.7-overview-dual-matrix-graphics';

test('v6.5.7 overview renders current and next people plus a focused mini matrix',()=>{
  assert.ok(fs.existsSync('src/v657-overrides.js'),'missing src/v657-overrides.js');
  const source=fs.readFileSync('src/v657-overrides.js','utf8');
  for(const marker of [
    'v657RenderOverviewPairMatrix','v657OverviewPairPeople','v657-overview-matrix','v657-pair-row',
    'v657-handoff-line','data-v657-state="live"','data-v657-state="next"',
    'getOncallAssignmentsForDate(now)','getNextOncallAssignments(now)','getOncallMonthMatrix(v652Month)',
    'v655RenderTodayNext(now)','v657RenderOverviewPairMatrix(now)'
  ]) assert.ok(source.includes(marker),`missing ${marker}`);
  assert.match(source,/function v652Overview\(now\)[\s\S]*v655RenderTodayNext\(now\)[\s\S]*v657RenderOverviewPairMatrix\(now\)/);
});

test('v6.5.7 full Matrix tab remains the complete engineer grid',()=>{
  const engine=fs.readFileSync('src/v652-engine.js','utf8');
  assert.match(engine,/function v655RenderMatrix/);
  assert.match(engine,/model\.engineers\.map\(name=>/);
  assert.match(engine,/data-oncall-mode="matrix"/);
});

test('v6.5.7 visual layer reduces palette and adds command-center graphics',()=>{
  assert.ok(fs.existsSync('src/v657-ui.css'),'missing src/v657-ui.css');
  const css=fs.readFileSync('src/v657-ui.css','utf8');
  for(const marker of [
    '--v657-graphite','--v657-navy','--v657-cyan','--v657-blue','--v657-violet','--v657-grid',
    '.v657-overview-matrix','.v657-pair-row','.v657-handoff-line','.v657-data-scan',
    'linear-gradient','radial-gradient','repeating-linear-gradient','clip-path','@keyframes v657Scan',
    'data-v65-mode="HIGH"','data-v65-mode="BALANCED"','data-v65-mode="ECO"','prefers-reduced-motion'
  ]) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.doesNotMatch(css,/--v657-(pink|green|amber|red)/);
});

test('v6.5.7 layer remains shipped in v6.5.14',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  for(const marker of ['v657-ui.css','v657-ui-style','v657-overrides.js','data-app-version="6.5.14"','data-loader-version="6.5.14"','built v6.5.14']) assert.ok(build.includes(marker),`build missing ${marker}`);
  assert.ok(workflow.includes(branch));
  assert.ok(workflow.includes('tests/v657-*.test.mjs'));
});
