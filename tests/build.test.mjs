import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('production index is standalone v6.5.13 legacy shell',()=>{
  const s=fs.readFileSync('index.html','utf8');
  assert.match(s,/<!doctype html>/i);
  assert.match(s,/data-app-version="6\.5\.13"/);
  for(const marker of ['command-bar','hero-stage','cyber-scene','overviewNetwork','overviewMonthMatrix','insights-panel']) assert.ok(s.includes(marker),`missing ${marker}`);
  assert.doesNotMatch(s,/<script\s+src=/i);
  assert.doesNotMatch(s,/<link[^>]+rel=["']stylesheet/i);
  assert.doesNotMatch(s,/document\.write\(/);
  assert.doesNotMatch(s,/DecompressionStream/);
  assert.match(s,/นาย นลิทัศน์ นากรณ์/);
  const scripts=[...s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
  assert.ok(scripts.length>=1);
  for(const code of scripts) assert.doesNotThrow(()=>new vm.Script(code));
});
