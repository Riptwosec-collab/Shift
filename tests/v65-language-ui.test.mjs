import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const code=()=>fs.readFileSync('src/v65-engine.js','utf8');

test('v6.5 exposes one in-place TH EN language control',()=>{
  const s=code();
  for(const fn of ['mountV65LanguageControl','translateLegacyStatic','translateLegacyView','refreshV65Locale','initV65']) assert.ok(s.includes(`function ${fn}`)||s.includes(`export function ${fn}`),`missing ${fn}`);
  assert.ok(s.includes("document.querySelector('.command-actions')"));
  assert.ok(s.includes("data-locale=\"th\""));
  assert.ok(s.includes("data-locale=\"en\""));
  assert.doesNotMatch(s,/location\.reload|window\.location\.reload/);
  assert.doesNotMatch(s,/new MutationObserver/);
});

test('legacy localization covers all five views without duplicating hosts',()=>{
  const s=code();
  for(const view of ['overview','daily','person','month','analytics']) assert.ok(s.includes(`'${view}'`),`missing translator ${view}`);
  assert.ok(s.includes('refreshV64LocalizedSurfaces'));
  const legacy=fs.readFileSync('src/legacy-baseline.html','utf8');
  for(const id of ['overviewView','dailyView','personView','monthView','analyticsView']){
    const count=(legacy.match(new RegExp(`id=["']${id}["']`,'g'))||[]).length;
    assert.equal(count,1,`${id} must remain unique`);
  }
});

test('locale adapter contains no schedule or selection mutation paths',()=>{
  const s=code();
  assert.doesNotMatch(s,/\.setSelectedDay\(|\.setSelectedPerson\(|\.setVisualMode\(/);
  assert.doesNotMatch(s,/STAFF\s*=|\.s\s*=/);
  assert.ok(s.includes('shift.locale'));
});
