import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.9-year-end-matrix';

test('v6.5.9 Overview renders one complete selected month only',()=>{
  assert.ok(fs.existsSync('src/v659-overrides.js'),'missing src/v659-overrides.js');
  const js=fs.readFileSync('src/v659-overrides.js','utf8');
  assert.match(js,/function\s+v659RenderOverviewMonth\s*\(now\)/);
  assert.match(js,/const selectedModel=getOncallMonthMatrix\(v652Month\)/);
  assert.match(js,/v659RenderMonthMatrix\(v652Month,now,\{overview:true,model:selectedModel\}\)/);
  assert.match(js,/v659-overview-month/);
  assert.match(js,/function v652Overview\(now\)\{return v659RenderOverviewMonth\(now\)\}/);
});

test('v6.5.9 Matrix renders October November December in stacked year-end order',()=>{
  const js=fs.readFileSync('src/v659-overrides.js','utf8');
  for(const marker of ['const V659_MONTHS=[10,11,12]','v659RenderYearEndMatrix','v659RenderMonthMatrix','v659-year-end-matrix','v659-month-panel','data-v659-month="${month}"']) assert.ok(js.includes(marker),`missing ${marker}`);
  assert.match(js,/const panels=\[10,11,12\]\.map\(month=>v659RenderMonthMatrix\(month,now\)\)/);
  assert.match(js,/function\s+v652Matrix\s*\(now\)\{return `\$\{v659RenderYearEndMatrix\(now\)\}\$\{v655RenderSelectedDay\(now\)\}`\}/);
});

test('v6.5.9 year-end matrix styling preserves command-center and mobile behavior',()=>{
  assert.ok(fs.existsSync('src/v659-ui.css'),'missing src/v659-ui.css');
  const css=fs.readFileSync('src/v659-ui.css','utf8');
  for(const marker of ['.v659-overview-month','.v659-year-end-matrix','.v659-month-panel','.v659-month-panel[data-v659-month="10"]','.v659-month-panel[data-v659-month="11"]','.v659-month-panel[data-v659-month="12"]','.v659-month-divider','overflow-x:auto','position:sticky','data-v65-mode="HIGH"','data-v65-mode="BALANCED"','data-v65-mode="ECO"','prefers-reduced-motion']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/linear-gradient/);assert.match(css,/radial-gradient/);
});

test('v6.5.9 layer remains shipped in v6.5.11',()=>{const build=fs.readFileSync('scripts/build.mjs','utf8');const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');for(const marker of ['v659-ui.css','v659-overrides.js','v659-ui-style','data-app-version="6.5.11"','data-loader-version="6.5.11"','built v6.5.11'])assert.ok(build.includes(marker),`build missing ${marker}`);assert.ok(workflow.includes(branch),'missing v6.5.9 branch trigger');assert.ok(workflow.includes('tests/v659-*.test.mjs'),'missing v6.5.9 release gate')});
