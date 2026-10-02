import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.11-zero-scroll-matrix';

test('v6.5.11 desktop Matrix removes internal scrolling and fits all month rows',()=>{
  assert.ok(fs.existsSync('src/v6511-ui.css'),'missing src/v6511-ui.css');
  const css=fs.readFileSync('src/v6511-ui.css','utf8');
  assert.match(css,/@media\s*\(min-width:901px\)/);
  for(const marker of ['.v659-year-end-matrix','.v659-month-panel','.v659-matrix-scroll','.v652-matrix','.v652-matrix-name','.v652-matrix-cell']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/\.v659-matrix-scroll[\s\S]*overflow\s*:\s*visible\s*!important/);
  assert.match(css,/\.v652-matrix[\s\S]*min-width\s*:\s*0\s*!important/);
  assert.match(css,/\.v652-matrix[\s\S]*width\s*:\s*100%\s*!important/);
  assert.match(css,/grid-template-columns\s*:\s*96px\s+repeat\(var\(--v652-days\),minmax\(0,1fr\)\)/);
  assert.match(css,/grid-template-rows\s*:\s*auto\s+auto\s+auto/);
});

test('v6.5.11 keeps four engineer rows compact enough to remain visible in each month panel',()=>{
  const css=fs.readFileSync('src/v6511-ui.css','utf8');
  assert.match(css,/\.v652-matrix-name[\s\S]*min-height\s*:\s*18px\s*!important/);
  assert.match(css,/\.v652-matrix-cell[\s\S]*min-height\s*:\s*18px\s*!important/);
  assert.match(css,/\.v652-matrix-day[\s\S]*min-height\s*:\s*18px\s*!important/);
  assert.match(css,/\.v652-matrix-cell b[\s\S]*font-size\s*:\s*5px/);
});

test('v6.5.11 preserves scroll fallback below desktop breakpoint',()=>{
  const css=fs.readFileSync('src/v6511-ui.css','utf8');
  assert.match(css,/@media\s*\(max-width:900px\)[\s\S]*\.v659-matrix-scroll[\s\S]*overflow-x\s*:\s*auto/);
});

test('v6.5.11 build and CI ship the zero-scroll layer',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  for(const marker of ['v6511-ui.css','v6511-overrides.js','v6511-ui-style','data-app-version="6.5.11"','data-loader-version="6.5.11"','built v6.5.11']) assert.ok(build.includes(marker),`build missing ${marker}`);
  assert.ok(workflow.includes(branch),'missing v6.5.11 branch trigger');
  assert.ok(workflow.includes('tests/v6511-*.test.mjs'),'missing v6.5.11 release gate');
});
