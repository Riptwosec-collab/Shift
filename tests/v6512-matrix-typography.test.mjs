import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.12-matrix-typography-clarity';

test('v6.5.12 Matrix typography is larger, sharper, and higher contrast on desktop',()=>{
  assert.ok(fs.existsSync('src/v6512-ui.css'),'missing src/v6512-ui.css');
  const css=fs.readFileSync('src/v6512-ui.css','utf8');
  assert.match(css,/@media\s*\(min-width:901px\)/);
  assert.match(css,/\.v6511-month-head b[\s\S]*font-size\s*:\s*13px/);
  assert.match(css,/\.v6511-day b[\s\S]*font-size\s*:\s*8px/);
  assert.match(css,/\.v6511-engineer-name b[\s\S]*font-size\s*:\s*8px/);
  assert.match(css,/\.v6511-duty-bar b[\s\S]*font-size\s*:\s*7px/);
  assert.match(css,/\.v6511-duty-bar span[\s\S]*font-size\s*:\s*7px/);
  assert.match(css,/text-rendering\s*:\s*geometricPrecision/);
  assert.match(css,/-webkit-font-smoothing\s*:\s*antialiased/);
});

test('v6.5.12 clarity layer keeps the three-month zero-scroll desktop geometry',()=>{
  const css=fs.readFileSync('src/v6512-ui.css','utf8');
  assert.match(css,/\.v6511-board[\s\S]*overflow\s*:\s*hidden/);
  assert.match(css,/\.v6511-board-scroll[\s\S]*overflow\s*:\s*hidden/);
  assert.match(css,/\.v6511-board-grid[\s\S]*--v6511-row-h\s*:\s*23px/);
  assert.match(css,/\.v6511-duty-bar[\s\S]*height\s*:\s*17px\s*!important/);
});

test('v6.5.12 mobile keeps readable sizing and horizontal fallback',()=>{
  const css=fs.readFileSync('src/v6512-ui.css','utf8');
  assert.match(css,/@media\s*\(max-width:900px\)[\s\S]*\.v6511-board-scroll[\s\S]*overflow-x\s*:\s*auto/);
  assert.match(css,/@media\s*\(max-width:900px\)[\s\S]*\.v6511-engineer-name b[\s\S]*font-size\s*:\s*9px/);
  assert.match(css,/@media\s*\(max-width:900px\)[\s\S]*\.v6511-duty-bar b[\s\S]*font-size\s*:\s*8px/);
});

test('v6.5.12 build and CI ship the typography clarity layer',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  for(const marker of ['v6512-ui.css','v6512-overrides.js','v6512-ui-style','data-app-version="6.5.19"','data-loader-version="6.5.19"','built v6.5.19']) assert.ok(build.includes(marker),`build missing ${marker}`);
  assert.ok(workflow.includes(branch),'missing v6.5.12 branch trigger');
  assert.ok(workflow.includes('tests/v6512-*.test.mjs'),'missing v6.5.12 release gate');
});
