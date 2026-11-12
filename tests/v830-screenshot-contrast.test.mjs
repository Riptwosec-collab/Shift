import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const baseline=read('src/legacy-baseline.html');
const glass=read('src/v6516-liquid-glass.css');
const neon=read('src/v6517-neon-dashboard.css');
const css=read('src/v810-theme.css');
const html=read('index.html');
const js=read('src/v810-theme.js');
const build=read('scripts/build.mjs');

test('Legacy roster names no longer paint black bands or render pseudo stripe',()=>{
 assert.doesNotMatch(baseline,/\.row-name\{[^}]*background:#071525/);
 assert.doesNotMatch(baseline,/\.row-meta\{[^}]*background:#071525/);
 assert.doesNotMatch(baseline,/\.person-row::before\{[^}]*height:8px/);
 assert.match(baseline,/\.person-row::before\{content:none;display:none\}/);
 for(const marker of ['.person-row::before','.person-row::after','.row-copy',
  'background:transparent!important','-webkit-text-stroke:0 transparent!important',
  '.person-row.shift-D .status-badge','.person-row.shift-N .status-badge',
  '.person-row.shift-O .status-badge'])
   assert.ok(css.includes(marker),marker);
});
test('Insight rows no longer inherit mismatched neon gradient and black text',()=>{
 const glassRule=glass.match(/\/\* Clear, non-translucent text[\s\S]*?\}/)?.[0]||'';
 const neonRule=neon.match(/\.v652-person-chip,[\s\S]*?\}/)?.[0]||'';
 assert.ok(glassRule&&!glassRule.includes('.insight-item'));
 assert.ok(neonRule&&!neonRule.includes('.insight-item'));
 for(const marker of ['.insights-panel .insight-item','background:var(--sh81-card)!important',
  '.insights-panel .insight-item b','.insights-panel .insight-value',
  'color:var(--sh81-ink)!important'])
  assert.ok(css.includes(marker),marker);
});
test('Dark mode is truly black and uses neutral graphite stepped surfaces',()=>{
 const section=css.slice(css.indexOf('/* SHIFT V8.3'));
 for(const marker of ['--sh81-shell:#000000','--sh81-panel:#090909',
  '--sh81-card:#141414','--sh81-soft:#1F1F1F','--sh81-ink:#F7F7F7',
  '--sh81-muted:#C5C5C5','background:#000000!important'])
  assert.ok(section.includes(marker),marker);
 assert.ok(js.includes("mode==='dark'?'#000000':'#171820'"));
 assert.ok(build.includes("t==='dark'?'#000000':'#171820'"));
 assert.ok(html.includes("t==='dark'?'#000000':'#171820'"));
});
test('All linked style source blocks match built HTML, CSS balanced',()=>{
 for(const path of ['src/v6516-liquid-glass.css','src/v6517-neon-dashboard.css',
  'src/v810-theme.css','src/v810-theme.js']) assert.ok(html.includes(read(path)),path);
 assert.ok(html.includes('content:none;display:none'));
 let d=0;for(const c of css){if(c==='{')d++;if(c==='}')d--;assert.ok(d>=0)}
 assert.equal(d,0);
});
