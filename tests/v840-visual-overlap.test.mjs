import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('V8.4 light mode uses browser light palette and no more text card overlays',()=>{
 const base=read('src/legacy-baseline.html'),neon=read('src/v6517-neon-dashboard.css');
 const html=read('index.html'),css=read('src/v810-theme.css');
 assert.ok(base.includes('name="color-scheme" content="light dark"'));
 assert.ok(!neon.includes('.roster-card::after,.metric-card::after,.v6517-glass::after'));
 assert.ok(css.includes('color-scheme:light!important'));
 assert.ok(css.includes('background:#000000!important'));
 assert.ok(css.includes('grid-template-columns:16px 27px minmax(0,1fr) 37px!important'));
 assert.ok(html.includes(css));
 let count=0;for(const c of css){if(c==='{')count++;if(c==='}')count--;assert.ok(count>=0)}
 assert.equal(count,0);
});
