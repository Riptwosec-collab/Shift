import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const css=read('src/v810-theme.css'),final=read('src/v870-theme-foundation.css');
const html=read('index.html');
test('V8.8 dark legacy overrides no longer force black/graphite surfaces',()=>{
 const section=css.slice(css.indexOf('/* SHIFT V8.3'));
 for(const x of ['#000000','#090909','#141414','#1F1F1F','#414141'])
   assert.ok(!section.includes(x),x+' leaked from V8.3+');
 for(const x of ['--sh81-shell:#071425','--sh81-panel:#0D2036',
 '--sh81-card:#142940','--sh81-border:#344E6B'])
   assert.ok(section.includes(x),x);
});
test('V8.8 fixes sticky header overlay and light calendar fill',()=>{
 for(const x of ['position:relative!important;top:auto!important',
 '#shiftNovemberView .shift72-graphic-main','#DFEBFF','#EAF2FF',
 '#shift740FullMonth .s740-top','#173755']){
  assert.ok(final.includes(x),x);
 }
 assert.ok(html.includes(css));assert.ok(html.includes(final));
 let depth=0;for(const c of final){if(c==='{')depth++;else if(c==='}')depth--;assert.ok(depth>=0)}
 assert.equal(depth,0);
});
