import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=()=>fs.readFileSync('src/v65-ui.css','utf8');

test('v6.5 uses local readable Thai and English typography',()=>{
  const s=css();
  assert.doesNotMatch(s,/@import|https?:\/\/|@font-face/i);
  assert.match(s,/--v65-text-xs\s*:\s*10px/);
  assert.match(s,/--v65-text-sm\s*:\s*(11|12)px/);
  assert.ok(s.includes('"Leelawadee UI"'));
  assert.ok(s.includes('"Noto Sans Thai"'));
  assert.ok(s.includes('Inter'));
  assert.match(s,/html\[data-locale="th"\][\s\S]*line-height\s*:\s*1\.[5-9]/);
  assert.match(s,/font-variant-numeric\s*:\s*tabular-nums/);
});

test('sharp layer strengthens lines and avoids structural hiding',()=>{
  const s=css();
  for(const marker of ['--v65-glow-tight','--v65-border-crisp','.hud-panel','.network-line','.month-cell','.date-node']) assert.ok(s.includes(marker),`missing ${marker}`);
  for(const selector of ['.cyber-scene','.roster-card','.insights-panel','.network-host','.month-snapshot']){
    const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    assert.doesNotMatch(s,new RegExp(`${escaped}[^}]*?(?:display\\s*:\\s*none|visibility\\s*:\\s*hidden)`),`${selector} must remain visible`);
  }
});

test('meaningful v6.4 details are lifted out of 6-8px range',()=>{
  const s=css();
  for(const selector of ['.v64-risk b','.v64-risk span','.v64-transition b','.v64-transition span','.v64-network-summary b','.v64-relation-strip b','.v64-workload-row span']) assert.ok(s.includes(selector),`missing readable override ${selector}`);
});
