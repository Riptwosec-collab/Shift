import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const branch='work/v6.5.10-compact-three-month-matrix';

test('v6.5.10 keeps the year-end Matrix to three compact month panels in one desktop viewport',()=>{
  assert.ok(fs.existsSync('src/v6510-ui.css'),'missing src/v6510-ui.css');
  const css=fs.readFileSync('src/v6510-ui.css','utf8');
  for(const marker of [
    '.v659-year-end-matrix','grid-template-rows:repeat(3,minmax(0,1fr))','100dvh',
    '.v659-year-end-matrix .v659-month-panel','.v659-year-end-matrix .v652-matrix-day',
    '.v659-year-end-matrix .v652-matrix-cell','.v659-year-end-matrix .v652-matrix-name',
    '.v659-year-end-matrix .v659-month-divider','.v659-year-end-matrix .v652-matrix-legend'
  ]) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/\.v659-year-end-matrix \.v652-matrix-day\{[^}]*min-height:\s*(?:2[0-9]|3[0-2])px/s);
  assert.match(css,/\.v659-year-end-matrix \.v652-matrix-cell\{[^}]*min-height:\s*(?:2[0-9]|3[0-2])px/s);
  assert.match(css,/\.v659-year-end-matrix \.v659-month-divider\{[^}]*display:\s*none/s);
  assert.match(css,/\.v659-year-end-matrix \.v652-matrix-legend\{[^}]*display:\s*none/s);
});

test('v6.5.10 preserves futuristic Matrix styling and restores natural flow on smaller screens',()=>{
  const css=fs.readFileSync('src/v6510-ui.css','utf8');
  for(const marker of ['linear-gradient','radial-gradient','box-shadow','backdrop-filter','@media (max-width:900px)','height:auto','overflow-x:auto','prefers-reduced-motion']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/\.v659-year-end-matrix \.v652-matrix\{[^}]*grid-template-columns:\s*(?:11[0-9]|12[0-9])px repeat\(var\(--v652-days\),minmax\((?:2[6-9]|3[0-2])px,1fr\)\)/s);
});

test('v6.5.10 runtime layer stamps the current app version without changing schedule logic',()=>{
  assert.ok(fs.existsSync('src/v6510-overrides.js'),'missing src/v6510-overrides.js');
  const js=fs.readFileSync('src/v6510-overrides.js','utf8');
  assert.match(js,/dataset\.appVersion='6\.5\.10'/);
  assert.doesNotMatch(js,/ONCALL_SCHEDULE\s*=/);
  assert.doesNotMatch(js,/function\s+v652Overview/);
  assert.doesNotMatch(js,/function\s+v652Matrix/);
});

test('v6.5.10 layer remains shipped in v6.5.14',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const workflow=fs.readFileSync('.github/workflows/v65-ci.yml','utf8');
  for(const marker of ['v6510-ui.css','v6510-overrides.js','v6510-ui-style','data-app-version="6.5.14"','data-loader-version="6.5.14"','built v6.5.14']) assert.ok(build.includes(marker),`build missing ${marker}`);
  assert.ok(workflow.includes(branch),'missing v6.5.10 branch trigger');
  assert.ok(workflow.includes('tests/v6510-*.test.mjs'),'missing v6.5.10 release gate');
});
