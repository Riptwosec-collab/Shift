import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';
const read=p=>fs.readFileSync(p,'utf8');
const expected=[
 [9,7,15,16,168],[6,10,15,16,168],[16,0,15,16,168],[4,12,15,16,168],
 [13,3,15,16,168],[12,4,15,16,168],[9,7,15,16,168],[6,10,15,16,168],
 [14,3,14,17,178.5],[13,4,14,17,178.5]
];
function createSheet(){
 const script=read('src/v6536-november-sheet.js'),host={innerHTML:'',after(node){this.legend=node}};
 const document={
  querySelector:selector=>selector==='#shiftNovemberView .shift-nov-scroll'?host:
   selector==='#shiftNovemberView .shift-nov-sheet-legend'?(host.legend||null):null,
  createElement:()=>({className:'',innerHTML:''})
 };
 const context=new Function('NOVEMBER_2026_DUTY_POSITIONS','staff','shiftNovEscape','shiftNovMarkDay','document',
  'let shiftNovRenderGrid=()=>{};\n'+script+
  '\nreturn {shiftNovSheetTotals,shiftNovSheetCount,shiftNovRenderGrid,shiftNovSheetColumnMeta};');
 const instance=context(november,STAFF,v=>String(v).replace(/&/g,'&amp;'),()=>{},document);
 instance.shiftNovRenderGrid();
 return {host,instance};
}
test('reference sheet shows exact employee totals derived from real November roles',()=>{
 const {instance}=createSheet();
 expected.forEach(([D,N,H,W,hours],i)=>{
  const actual=instance.shiftNovSheetCount(i);
  assert.deepEqual([actual.day,actual.night,actual.restReference,actual.working,actual.hours],[D,N,H,W,hours],'employee '+i);
 });
 assert.deepEqual(instance.shiftNovSheetTotals(),
  {day:102,night:60,holiday:138,working:162,restReference:148,hours:1701});
});
test('reference shows thirty calendar days, 10 extra H template cells and 2 daily total rows',()=>{
 const {host}=createSheet(),html=host.innerHTML;
 assert.equal((html.match(/class="shift-nov-sheet-person shift-nov-sheet-row-/g)||[]).length,10);
 assert.equal((html.match(/data-shift-nov-person=/g)||[]).length,300);
 assert.equal((html.match(/class="shift-nov-sheet-duty H shift-nov-sheet-phantom"/g)||[]).length,10);
 assert.equal((html.match(/shift-nov-sheet-totalrow/g)||[]).length,2);
 assert.match(html,/colspan="32"/);
 assert.match(html,/colspan="6"/);
 assert.match(html,/จำนวนวันทำงานและวันหยุด/);
 assert.match(html,/วันทำงานบริษัท/);
 assert.match(html,/ชั่วโมงการทำงานบริษัท/);
 assert.match(html,/ชื่อเล่น/);
 assert.match(html,/นุ๊ก/);
 assert.match(html,/แคปหมู/);
 assert.match(host.legend.innerHTML,/ไม่ใช่วันที่ 31/);
 assert.match(host.legend.innerHTML,/8:30–20:30/);
});
test('November 30 duplicate N1 is retained visibly and is never invented as N2',()=>{
 const {host}=createSheet();
 assert.ok(host.innerHTML.includes('ตำแหน่ง N1 ซ้ำในภาพต้นฉบับ'));
 const date30=november.map(r=>r[29]);
 assert.equal(date30.filter(code=>code==='N1').length,2);
 assert.equal(date30.filter(code=>code==='N2').length,0);
});
test('source is bundled after November view and October is not touched',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html'),css=read('src/v6536-november-sheet.css'),js=read('src/v6536-november-sheet.js');
 assert.ok(build.includes("'v6535-november-view.js','v6536-november-sheet.js'"));
 assert.ok(build.includes("v6536Css=fs.readFileSync("));
 assert.ok(html.includes(js)&&html.includes(css));
 assert.ok(css.includes('#shiftNovemberView .shift-nov-reference-sheet'));
 assert.ok(html.includes('october-2026-duty-roster.js'));
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r20'"));
});
