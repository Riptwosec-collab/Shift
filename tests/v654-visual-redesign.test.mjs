import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('v6.5.4 adds a dedicated global cyber background with performance fallbacks',()=>{
  const css=fs.readFileSync('src/v654-ui.css','utf8');
  for(const marker of ['--v654-grid','--v654-cyan','body::before','body::after','.app::before','data-v65-mode="HIGH"','data-v65-mode="BALANCED"','data-v65-mode="ECO"','prefers-reduced-motion']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/radial-gradient/);
  assert.match(css,/linear-gradient/);
  assert.match(css,/@keyframes v654/);
});

test('Engineer Oncall receives the v6.5.4 command-deck redesign',()=>{
  const engine=fs.readFileSync('src/v652-engine.js','utf8');
  const css=fs.readFileSync('src/v654-ui.css','utf8');
  assert.match(engine,/v654-oncall-surface/);
  assert.match(engine,/v6\.5\.4/);
  for(const marker of ['.v654-oncall-surface .v652-control-deck','.v654-oncall-surface .v652-hero','.v654-oncall-surface .v652-stat-grid','.v654-oncall-surface .v652-overview-table','.v654-oncall-surface .v652-matrix-panel','.v654-oncall-surface .v652-timeline-panel']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(css,/clip-path/);
  assert.match(css,/backdrop-filter/);
});

test('v6.5.4 redesign remains shipped in v6.5.8 without changing schedule data',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const html=fs.readFileSync('index.html','utf8');
  assert.match(build,/v654-ui\.css/);
  assert.match(build,/v654-ui-style/);
  assert.match(build,/data-app-version=\"6\.5\.8\"/);
  assert.match(html,/data-app-version="6\.5\.8"/);
  assert.match(html,/id="v654-ui-style"/);
  assert.ok(html.includes('OOOOODDDDOODDDDOOOODDOOOONNNNNN'));
  assert.ok(html.includes('นาย นลิทัศน์ นากรณ์'));
});
