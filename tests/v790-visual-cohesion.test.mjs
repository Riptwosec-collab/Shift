import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {OCTOBER_2026_DUTY_POSITIONS as oct} from '../src/october-2026-duty-roster.js';
import {NOVEMBER_2026_DUTY_POSITIONS as nov} from '../src/november-2026-duty-roster.js';

const read=p=>fs.readFileSync(p,'utf8');
const js=read('src/v780-editorial-cohesion.js'),css=read('src/v780-editorial-cohesion.css'),html=read('index.html');
function doc(locale){return {readyState:'loading',documentElement:{lang:locale,dataset:{locale}},addEventListener(){},
 createElement(tag){return {tag,className:'',dataset:{},setAttribute(k,v){this[k]=v},innerHTML:''}}};}

test('V7.9 uses one editorial layout with the established brand/role palette',()=>{
 for(const marker of ['--shift78-paper:#F7F2E8','--shift78-ink:#1B1A20',
  '--shift78-coral:#FF6946','--shift78-lime:#D6F36A','--shift78-cobalt:#5264E8',
  '--shift78-pink:#FFC4D4','--shift78-banner:#F7F2E8',
  '.shift78-section-hero::before','.shift78-section-copy h2',
  '#shift740FullMonth','#shiftNovemberView .shift72-duty-pill',
  '.mobile-nav::-webkit-scrollbar'])
  assert.ok(css.includes(marker),marker);
 for(const key of ['daily','person','month','analytics','oncall'])
  assert.ok(css.includes('.shift78-section-hero--'+key),key);
 assert.doesNotMatch(css,/@import|url\(https?:/i);
});
test('TH/EN titles switch correctly without duplicating page headers',()=>{
 const th=new Function('document',js+'\nreturn {meta:SHIFT78_PAGE_META,make:shift78MakeHeader};')(doc('th'));
 const en=new Function('document',js+'\nreturn {meta:SHIFT78_PAGE_META,make:shift78MakeHeader};')(doc('en'));
 assert.equal(th.meta.length,5);
 assert.deepEqual(th.meta.map(x=>x.id),['dailyView','personView','monthView','analyticsView','oncallView']);
 for(let i=0;i<5;i++){
  const a=th.make(th.meta[i]),b=en.make(en.meta[i]);
  assert.equal(a.dataset.shift78Locale,'th');
  assert.equal(b.dataset.shift78Locale,'en');
  assert.notEqual(a.innerHTML,b.innerHTML);
  assert.equal(a.dataset.shift78For,th.meta[i].id);
  assert.match(b.innerHTML,/<h2>[\s\S]*<\/h2>/);
 }
 assert.match(js,/existing\.dataset\.shift78Locale===shift78Locale\(\)/);
 assert.match(js,/existing\.replaceWith\(head\)/);
 assert.match(js,/renderV652Oncall=wrapped/);
});
test('October and November navigation no longer display a misleading month badge',()=>{
 const api=new Function('document',js+'\nreturn {meta:SHIFT78_PAGE_META,make:shift78MakeHeader};')(doc('th'));
 const month=api.meta.find(x=>x.id==='monthView');
 assert.equal(month.stamp,'02');assert.equal(month.stampLabel,'MONTHS');
 assert.match(api.make(month).innerHTML,/02/);
});
test('consistent page typography, navigation, accessibility and mobile scroll',()=>{
 for(const marker of ['#dailyView .person-row','#personView .person-pick',
  '#monthView .heatmap','#analyticsView .analytics-card',
  '(.v652-matrix-day,.v652-matrix-name,.v652-matrix-cell)','#shift740FullMonth .s740-top',
  '#shiftNovemberView .shift72-graphic','.command-actions .v65-language',
  '.nav-tabs .nav-btn','max-width:860px','max-width:520px',
  'prefers-reduced-motion:reduce','focus-visible','overscroll-behavior-x:contain'])
  assert.ok(css.includes(marker),marker);
 let braces=0;for(const x of css){if(x==='{')braces++;if(x==='}')braces--;assert.ok(braces>=0)}
 assert.equal(braces,0);
});
test('unchanged original staff and both months retain 610 explicit duty entries',()=>{
 assert.equal(STAFF.length,10);assert.equal(oct.length,10);assert.equal(nov.length,10);
 assert.equal(oct.flat().length,310);assert.equal(nov.flat().length,300);
 assert.equal(nov.filter(row=>row[29]==='N1').length,2);
 assert.equal(nov.filter(row=>row[29]==='N2').length,0);
 assert.ok(read('src/v740-full-month-overview.js').includes('shift740Matrix(month,day)'));
 assert.ok(read('src/v720-graphic-november.js').includes('shift72UpdateDayFast()'));
});
test('built PWA includes the V7.9 stylesheet and bilingual source exactly',()=>{
 const build=read('scripts/build.mjs');
 assert.match(html,/data-shift-release="7\.9"/);
 assert.match(build,/data-shift-release="7\.9"/);
 assert.ok(html.includes(js)&&html.includes(css));
 assert.ok(build.includes('v780-editorial-cohesion.js')&&build.includes('v780-editorial-cohesion.css'));
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r19'"));
});
