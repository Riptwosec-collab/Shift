import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>fs.readFileSync(p,'utf8');
const css=load('src/v870-theme-foundation.css'),html=load('index.html'),build=load('scripts/build.mjs');
test('V8.7 has a light ivory-blue shell and navy dark shell',()=>{
 for(const x of ['--sh87-shell:#EFF4FA','--sh87-shell:#071425',
 '--sh87-panel:#FFFFFF','--sh87-panel:#0D2036',
 '--sh87-accent:#2E66E5','--sh87-accent:#4F8CFF',
 'color-scheme:light!important','color-scheme:dark!important'])assert.ok(css.includes(x),x);
 assert.ok(html.includes(css));
 assert.ok(build.includes("const v870Css=fs.readFileSync"));
});
test('V8.7 header keeps navigation and actions on separate rows',()=>{
 for(const x of ['grid-column:1/-1!important;grid-row:2!important',
 'grid-column:2!important;grid-row:1!important',
 'grid-column:1!important;grid-row:3!important',
 'overflow-x:auto!important;overflow-y:hidden!important',
 '.shift731-header-btn','display:none!important'])assert.ok(css.includes(x),x);
});
test('V8.7 loader theme matches runtime and initial browser meta',()=>{
 for(const x of ['#bootOverlay','--sh87-boot-shell:#EFF4FA',
 '--sh87-boot-shell:#071425','.boot613-shell'])assert.ok(css.includes(x),x);
 assert.ok(build.includes("t==='dark'?'#071425':'#EFF4FA'"));
 assert.ok(load('src/v810-theme.js').includes("mode==='dark'?'#071425':'#EFF4FA'"));
 let depth=0;for(const c of css){if(c==='{')depth++;else if(c==='}')depth--;assert.ok(depth>=0)}
 assert.equal(depth,0);
});
