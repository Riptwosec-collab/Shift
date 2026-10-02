import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('timeline scale receives the same day grid contract as the timeline track',()=>{
  const engine=fs.readFileSync('src/v652-engine.js','utf8');
  assert.match(engine,/class=\"v652-timeline-scale\"\s+style=\"--v652-days:\$\{model\.daysInMonth\}\"/);
  assert.match(engine,/class=\"v652-timeline-track\"\s+style=\"--v652-days:\$\{model\.daysInMonth\}\"/);
});

test('loader progress owns the full track and visibly settles at 100 percent',()=>{
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  assert.match(build,/b\.style\.width='100%'/);
  assert.match(build,/b\.style\.transform='scaleX\(0\)'/);
  assert.match(build,/b\.style\.transform='scaleX\(1\)'/);
  assert.match(build,/p\.textContent='100%'/);
  assert.match(build,/COMPLETE_HOLD=/);
  assert.match(build,/data-app-version=\"6\.5\.11\"/);
  assert.match(build,/data-loader-version=\"6\.5\.11\"/);
});

test('v6.5.3 futuristic oncall polish remains layered under v6.5.4 without changing schedule data',()=>{
  const css=fs.readFileSync('src/v653-oncall.css','utf8');
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const schedule=fs.readFileSync('src/oncall.js','utf8');
  for(const marker of ['.v653-oncall-surface','.v653-oncall-surface .v652-control-deck','.v653-oncall-surface .v652-matrix-panel','.v653-oncall-surface .v652-timeline-panel','.v653-oncall-surface .v652-timeline-track']) assert.ok(css.includes(marker),`missing ${marker}`);
  assert.match(build,/v653-oncall\.css/);
  assert.ok(schedule.includes("{month:10,start:1,end:7,name:'ป้อ'}"));
  assert.ok(schedule.includes("{month:12,start:24,end:30,name:'ป้อ'}"));
});
