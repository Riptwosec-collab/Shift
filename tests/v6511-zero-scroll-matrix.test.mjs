import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.11-zero-scroll-matrix';

test('v6.5.11 Matrix Board v2 replaces the dense day-cell matrix with three compact month boards',()=>{
  const js=fs.readFileSync('src/v6511-overrides.js','utf8');
  for(const marker of ['v6511RenderBoardMonth','v6511RenderBoardYearEnd','v6511-board','v6511-month-board','v6511-day-head','v6511-engineer-row','v6511-track','v6511-duty-bar']) assert.ok(js.includes(marker),`missing ${marker}`);
  assert.match(js,/\[10,11,12\]\.map\(month=>v6511RenderBoardMonth\(month,now\)\)/);
  assert.match(js,/function\s+v652Matrix\s*\(now\)\{return v6511RenderBoardYearEnd\(now\)\}/);
});

test('v6.5.11 Matrix Board v2 renders continuous schedule bars instead of one OC button per day',()=>{
  const js=fs.readFileSync('src/v6511-overrides.js','utf8');
  assert.match(js,/ONCALL_SCHEDULE\.filter\(row=>row\.month===month&&row\.name===name\)/);
  assert.match(js,/grid-column:\$\{row\.start\}\/\$\{row\.end\+1\}/);
  assert.match(js,/data-v659-day=\"\$\{row\.start\}\"/);
  assert.match(js,/\$\{row\.start\}–\$\{row\.end\}/);
  assert.doesNotMatch(js,/v652-matrix-cell/);
});

test('v6.5.11 Matrix Board v2 fits all three months and four engineers without desktop internal scroll',()=>{
  const css=fs.readFileSync('src/v6511-ui.css','utf8');
  assert.match(css,/@media\s*\(min-width:901px\)/);
  for(const marker of ['.v6511-board','.v6511-month-board','.v6511-board-grid','.v6511-day-head','.v6511-engineer-row','.v6511-engineer-name','.v6511-track','.v6511-duty-bar','.v6511-today-line']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/\.v6511-board\{[\s\S]*grid-template-rows\s*:\s*repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css,/\.v6511-board\{[\s\S]*overflow\s*:\s*hidden/);
  assert.match(css,/\.v6511-month-board\{[\s\S]*overflow\s*:\s*hidden/);
  assert.match(css,/\.v6511-track\{[\s\S]*overflow\s*:\s*hidden/);
  assert.doesNotMatch(css,/\.v6511-month-board\{[\s\S]*overflow-y\s*:\s*auto/);
});

test('v6.5.11 Matrix Board v2 preserves command-center styling and mobile horizontal fallback',()=>{
  const css=fs.readFileSync('src/v6511-ui.css','utf8');
  for(const marker of ['linear-gradient','radial-gradient','box-shadow','backdrop-filter','--v6511-cyan','--v6511-violet','data-v65-mode="HIGH"','data-v65-mode="BALANCED"','data-v65-mode="ECO"','prefers-reduced-motion']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/@media\s*\(max-width:900px\)[\s\S]*\.v6511-board-scroll[\s\S]*overflow-x\s*:\s*auto/);
});

test('v6.5.11 Matrix Board v2 keeps month/day and engineer interactions through existing v659 contracts',()=>{
  const js=fs.readFileSync('src/v6511-overrides.js','utf8');
  for(const marker of ['data-v659-month','data-v659-day','data-v659-engineer','v655-focused-row','v655-live','v655-next','v655-selected-day']) assert.ok(js.includes(marker),`missing ${marker}`);
});

test('v6.5.11 Matrix Board layer remains shipped in v6.5.12',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  for(const marker of ['v6511-ui.css','v6511-overrides.js','v6511-ui-style','data-app-version="6.5.12"','data-loader-version="6.5.12"','built v6.5.12']) assert.ok(build.includes(marker),`build missing ${marker}`);
  assert.ok(workflow.includes(branch),'missing v6.5.11 branch trigger');
  assert.ok(workflow.includes('tests/v6511-*.test.mjs'),'missing v6.5.11 release gate');
});
