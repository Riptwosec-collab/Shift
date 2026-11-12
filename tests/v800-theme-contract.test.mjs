import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync('src/v780-editorial-cohesion.css','utf8');
const html=fs.readFileSync('index.html','utf8');
const base=fs.readFileSync('src/legacy-baseline.html','utf8');
test('V8 theme contract is the same in source and built PWA',()=>{
 for(const key of ['--shift80-paper:#F7F2E8','--shift80-shell:#171820',
  '--shift80-day:#D6F36A','--shift80-night:#5264E8',
  '--shift80-off:#FFC4D4','--shift80-action:#FF6946',
  'color-scheme:light','--shift80-text-subtle',
  '#overviewView .v6517-kpi','#shift740FullMonth .s740-duty.s740-D',
  '#shiftNovemberView .shift72-duty-pill.tone-N',
  '#oncallView .v655-matrix .v652-matrix-cell.active'])
  assert.ok(css.includes(key),key);
 assert.ok(html.includes(css),'standalone generated HTML must include the exact current CSS');
 assert.ok(html.includes('<meta name="theme-color" content="#171820">'));
 assert.ok(base.includes('<meta name="theme-color" content="#171820">'));
 assert.ok(html.includes('Shift — ตารางเวรทีม | Team Schedule'));
});
test('V8 palette preserves role distinctions and contrast',()=>{
 for(const match of ['D','#26310F','N','#FFFFFF','H','#512537'])
  assert.ok(css.includes(match));
 assert.doesNotMatch(css.slice(css.indexOf('/* SHIFT V8.0')),/url\(|@import|animation:\s*[^n]/i);
 let depth=0;for(const c of css){if(c==='{')depth++;if(c==='}')depth--;assert.ok(depth>=0)}
 assert.equal(depth,0);
});
