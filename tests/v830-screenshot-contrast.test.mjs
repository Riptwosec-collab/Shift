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
test('Black-lime V12 final theme overrides historical V8 navy after it in the built cascade',()=>{
 const current=read('src/shift-v10-design-system.css');
 for(const marker of ['--sh87-shell:#050508','--sh87-panel:#0E1219',
  '--sh87-card:#111820','--sh87-fg:#F2F5F8','--sh87-muted:#AEB9C8',
  '--sh87-accent:#C8FF47','color-scheme:dark!important'])
  assert.ok(current.includes(marker),marker);
 assert.ok(js.includes("mode==='dark'?'#050508':'#E8ECE7'"));
 assert.ok(build.includes("t==='dark'?'#050508':'#E8ECE7'"));
 assert.ok(html.includes("t==='dark'?'#050508':'#E8ECE7'"));
 const lastLayer=html.indexOf('id="shift-v10-professional-style"');
 const oldLayer=html.indexOf('id="v810-theme-style"');
 assert.ok(oldLayer>0&&lastLayer>oldLayer,'V12 must be last to win cascade');
});

test('All linked style source blocks match built HTML, CSS balanced',()=>{
 for(const path of ['src/v6516-liquid-glass.css','src/v6517-neon-dashboard.css',
  'src/v810-theme.css','src/v810-theme.js']) assert.ok(html.includes(read(path)),path);
 assert.ok(html.includes('content:none;display:none'));
 let d=0;for(const c of css){if(c==='{')d++;if(c==='}')d--;assert.ok(d>=0)}
 assert.equal(d,0);
});
