import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(path,'utf8');
test('mobile full names remain on one line and auto-size without ellipsis',()=>{
 const css=read('src/v6522-matrix-layout.css'),js=read('src/v6517-neon-dashboard.js');
 assert.ok(css.includes('white-space:nowrap!important'));
 assert.ok(css.includes('grid-template-columns:var(--shift-matrix-name-width,190px)'));
 assert.ok(css.includes('text-overflow:clip!important'));
 assert.ok(js.includes("name.scrollWidth+4"));
 assert.ok(js.includes("preview.style.setProperty('--shift-matrix-name-width'"));
 assert.ok(js.includes('v6517Esc(person.name)'));
});
test('overview desktop builds roster cells once and switches selected date without innerHTML rewrite',()=>{
 const html=read('src/legacy-baseline.html');
 const start=html.indexOf('function renderOverviewMatrix()'),end=html.indexOf('function shiftDeltaText(',start);
 const functionText=html.slice(start,end);
 assert.ok(functionText.includes("host.dataset.matrixReady!=='1'"));
 assert.ok(functionText.includes("host.dataset.matrixSelected===String(selectedDay)"));
 assert.ok(functionText.includes('classList.remove'));
 assert.ok(functionText.includes('classList.add'));
 assert.ok(functionText.includes("host.addEventListener('click'"));
 assert.ok(functionText.includes('statusAt(pi,day)'));
 assert.equal((functionText.match(/host.innerHTML=/g)||[]).length,1);
});
test('mobile changes selected day without recreating full preview inside its 14-day window',()=>{
 const js=read('src/v6517-neon-dashboard.js');
 assert.ok(js.includes("preview.dataset.matrixSection!==section"));
 assert.ok(js.includes("preview.dataset.matrixDay!==String(day)"));
 assert.ok(js.includes("preview.querySelectorAll('.selected')"));
 assert.equal((js.match(/preview.innerHTML=v6517MobilePreview\(day\)/g)||[]).length,1);
});
test('trend SVG does not get repainted on every day change',()=>{
 const js=read('src/v6517-neon-dashboard.js');
 assert.ok(js.includes("trend.querySelector('.v6517-trend-selected')"));
 assert.ok(js.includes("selectedLine.setAttribute('x1',x)"));
 assert.ok(js.includes("selectedLine.setAttribute('x2',x)"));
 assert.ok(js.includes("if(oncall.innerHTML!==markup)"));
});
test('tracked bundle and offline cache contain updated optimization',()=>{
 const html=read('index.html'),css=read('src/v6522-matrix-layout.css');
 assert.ok(html.includes(css));
 assert.ok(html.includes("name.scrollWidth+4"));
 assert.ok(html.includes("host.dataset.matrixReady!=='1'"));
 assert.ok(read('sw.js').includes('shift-shell-v6.5.20-r8'));
});
