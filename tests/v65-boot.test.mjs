import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const production=()=>fs.readFileSync('index.html','utf8');
const loader=()=>fs.readFileSync('src/loader.js','utf8');
const css=()=>fs.readFileSync('src/v65-ui.css','utf8');

test('production boot uses compositor progress and explicit boot flag',()=>{
  const html=production();
  assert.ok(html.includes('data-v65-booting="1"'));
  assert.ok(html.includes('TARGET=3000,HARD=3600'));
  assert.match(html,/style\.transform\s*=\s*`scaleX\(/);
  assert.doesNotMatch(html,/\.style\.width\s*=/);
  assert.doesNotMatch(html,/document\.write\(|DecompressionStream/);
});

test('boot release waits two animation frames before enabling heavy effects',()=>{
  const html=production();
  assert.ok(html.includes('requestAnimationFrame(()=>requestAnimationFrame('));
  assert.ok(html.includes("delete document.documentElement.dataset.v65Booting"));
});

test('source loader keeps three second target and transform progress',()=>{
  const s=loader();
  assert.match(s,/LOADER_TARGET_MS=3000/);
  assert.match(s,/LOADER_HARD_EXIT_MS=3600/);
  assert.match(s,/style\.transform=`scaleX\(/);
  assert.doesNotMatch(s,/style\.width=/);
});

test('booting CSS suspends heavy decorative work without hiding structure',()=>{
  const s=css();
  assert.ok(s.includes('html[data-v65-booting="1"]'));
  for(const marker of ['.ambient','.scan-beam','.cyber-scene::after','.network-line','.city-svg']) assert.ok(s.includes(marker));
  assert.match(s,/data-v65-booting="1"[\s\S]*animation\s*:\s*none\s*!important/);
  assert.doesNotMatch(s,/data-v65-booting="1"[^}]*display\s*:\s*none/);
});
