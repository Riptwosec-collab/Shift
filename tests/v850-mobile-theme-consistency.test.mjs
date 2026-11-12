import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const css=read('src/v810-theme.css');
const neon=read('src/v6517-neon-dashboard.css');
const html=read('index.html');
test('V8.5 restores PWA, bottom navigation, date rail and Oncall to semantic light/dark',()=>{
 for(const key of ['body .shift-install-dock','body #mobileNav',
  '.daily-timeline .date-node','.v655-now-panel',
  '.v655-engineer-card','--sh84-card','color:#1B1A20!important'])
  assert.ok(css.includes(key),key);
 assert.ok(!neon.includes('.hud-panel::after,/* V8.4'));
 assert.ok(html.includes(css));
 assert.ok(html.includes(neon));
 assert.ok(css.includes('background:#FF7959!important'));
 let depth=0;for(const c of css){if(c==='{')depth++;else if(c==='}')depth--;assert.ok(depth>=0)}
 assert.equal(depth,0);
});
