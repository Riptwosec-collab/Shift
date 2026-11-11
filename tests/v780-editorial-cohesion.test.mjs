import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {OCTOBER_2026_DUTY_POSITIONS as october} from '../src/october-2026-duty-roster.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';

const read=path=>fs.readFileSync(path,'utf8');
const js=read('src/v780-editorial-cohesion.js'),css=read('src/v780-editorial-cohesion.css');

test('all five product pages receive distinct original editorial section headings',()=>{
 const document={readyState:'loading',addEventListener(){}};
 const meta=new Function('document',js+'\nreturn SHIFT78_PAGE_META;')(document);
 assert.deepEqual(meta.map(x=>x.id),['dailyView','personView','monthView','analyticsView','oncallView']);
 assert.equal(new Set(meta.map(x=>x.number)).size,5);
 assert.equal(new Set(meta.map(x=>x.key)).size,5);
 assert.ok(meta.every(x=>x.title.includes('<span>')&&x.title.includes('<em>')&&x.sub.length>25));
});
test('the heading is readable semantic HTML, not a decorative raster',()=>{
 const document={
  readyState:'loading',addEventListener(){},
  createElement(tag){return {tag,className:'',dataset:{},setAttribute(k,v){this[k]=v},innerHTML:''}}
 };
 const {make,meta}=new Function('document',js+'\nreturn {make:shift78MakeHeader,meta:SHIFT78_PAGE_META};')(document);
 for(const spec of meta){
  const node=make(spec);
  assert.equal(node.tag,'header');
  assert.equal(node.dataset.shift78For,spec.id);
  assert.match(node.innerHTML,/<h2>[\s\S]*<\/h2>/);
  assert.ok(node.innerHTML.includes('aria-hidden="true"'));
  assert.ok(node.className.includes('shift78-section-hero--'+spec.key));
 }
});
test('the system palette has accessible dark and paper text contrast',()=>{
 const luminance=h=>{
  const values=[0,2,4].map(i=>parseInt(h.slice(i+1,i+3),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
  return values.reduce((sum,v,i)=>sum+[.2126,.7152,.0722][i]*v,0);
 };
 const ratio=(a,b)=>{const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (x+.05)/(y+.05)};
 assert.ok(ratio('#1B1A20','#F7F2E8')>=7);
 assert.ok(ratio('#1B1A20','#D6F36A')>=7);
 assert.ok(ratio('#FFFFFF','#5264E8')>=4.5);
 for(const hex of ['#FF6946','#D6F36A','#5264E8','#FFC4D4'])assert.ok(css.includes(hex));
});
test('surface coverage: daily, person, monthly, analytics, oncall, modal and mobile',()=>{
 for(const target of ['#dailyView','#personView','#monthView','#analyticsView','#oncallView',
  '.modal-card','.drawer-panel','.person-pick','.heatmap','.analytics-card','.v652-matrix',
  '.mobile-nav','.shift78-section-hero','max-width:860px','max-width:520px']){
  assert.ok(css.includes(target),'missing '+target);
 }
 assert.ok(js.includes('renderV652Oncall=wrapped'),'oncall rebuilt view has retained header');
 assert.ok(js.includes("document.documentElement.dataset.shift780='ready'"));
});
test('no new third-party assets or endless animations; keyboard and reduction honored',()=>{
 assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|location\.reload\(|window\.open\(/i);
 assert.doesNotMatch(js,/madebyend|<img\b|<canvas/i);
 assert.doesNotMatch(css,/url\(https?:|@import|animation:[^\n;]*infinite/i);
 assert.match(css,/focus-visible/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/@keyframes shift78-arrive/);
 assert.ok(css.includes('.shift78-section-hero:hover .shift78-section-art'));
});
test('all original October and November duty assignments are unchanged',()=>{
 assert.equal(STAFF.length,10);
 assert.equal(october.length,10);assert.equal(november.length,10);
 assert.equal(october.reduce((sum,row)=>sum+row.length,0),310);
 assert.equal(november.reduce((sum,row)=>sum+row.length,0),300);
 assert.equal(november.filter(row=>row[29]==='N1').length,2);
 assert.equal(november.filter(row=>row[29]==='N2').length,0);
});
test('release can be built as a fresh PWA without stale cache-name regression',()=>{
 const html=read('index.html'),build=read('scripts/build.mjs'),sw=read('sw.js');
 assert.ok(html.includes(js)&&html.includes(css));
 assert.ok(build.includes("'v780-editorial-cohesion.js'"));
 assert.ok(build.includes('v780-editorial-cohesion.css'));
 const release=html.match(/data-shift-release="(\d+\.\d+)"/);
 assert.ok(release&&Number(release[1])>=7.8,"Editorial system requires V7.8 or newer");
 assert.ok(sw.includes("CACHE_NAME='shift-shell-v6.5.20-r19'"));
 assert.ok(sw.includes('networkFirst'));
});
