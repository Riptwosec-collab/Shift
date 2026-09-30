import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('visual modes provide distinct HIGH BALANCED and ECO profiles',()=>{
  const css=fs.readFileSync('src/styles.css','utf8');
  const tpl=fs.readFileSync('src/template.html','utf8');
  assert.match(css,/html\[data-visual="high"\]/);
  assert.match(css,/html\[data-visual="balanced"\]/);
  assert.match(css,/html\[data-visual="eco"\]/);
  assert.match(css,/@keyframes highAmbientDrift/);
  assert.match(css,/@keyframes highRadarSweep/);
  assert.match(css,/html\[data-visual="high"\][\s\S]*\.network-edges line[\s\S]*animation:/);
  assert.match(css,/html\[data-visual="balanced"\][\s\S]*\.ambient[\s\S]*animation:none/);
  assert.match(css,/html\[data-visual="eco"\][\s\S]*animation:none!important/);
  assert.match(tpl,/data-app-version="6\.3\.4"/);
});
