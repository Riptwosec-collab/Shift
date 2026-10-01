import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('production loader animates for three seconds with a 3.6s safety exit',()=>{
  const html=fs.readFileSync('index.html','utf8');
  assert.ok(html.includes('id="v65-loader-runtime"'));
  assert.ok(html.includes('TARGET=3000,HARD=3600'));
  assert.ok(html.includes('elapsed>=TARGET&&domReady'));
  assert.doesNotMatch(html,/MIN=1150,HARD=1850/);
});

test('production v6.5 preserves all v6.4 additive features and legacy safety gates',()=>{
  const html=fs.readFileSync('index.html','utf8');
  for(const marker of ['data-app-version="6.5"','v64-quality','v64DailyOps','v64NetworkDetails','v64WorkloadBalance','v64Palette','v64StickyDaily','Team Network 2.0','WORKLOAD BALANCE']) assert.ok(html.includes(marker),`missing ${marker}`);
  assert.doesNotMatch(html,/new MutationObserver/);
  assert.doesNotMatch(html,/document\.write\(/);
  assert.doesNotMatch(html,/DecompressionStream/);
  assert.ok(html.includes('OOOOODDDDOODDDDOOOODDOOOONNNNNN'));
});
