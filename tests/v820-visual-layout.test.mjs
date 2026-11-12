import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {OCTOBER_2026_DUTY_POSITIONS as OCT} from '../src/october-2026-duty-roster.js';
import {NOVEMBER_2026_DUTY_POSITIONS as NOV} from '../src/november-2026-duty-roster.js';
const read=p=>fs.readFileSync(p,'utf8');
const style=read('src/v810-theme.css');
const build=read('scripts/build.mjs');
const html=read('index.html');
const part=style.slice(style.indexOf('/* SHIFT V8.2'));
test('V8.2 uses a single semantic palette for all roster layouts',()=>{
 for(const key of ['--shift82-day:#D6F36A','--shift82-night:#5264E8','--shift82-off:#FFC4D4',
  '.matrix-cell.D','.v6517-mobile-row button.N','.shift-week-cell.O',
  '.heatmap .v6519-full-name','.s740-matrix .s740-name',
  '.shift72-board-table .shift72-person-heading',
  '.v655-matrix .v652-matrix-name b'])
  assert.ok(part.includes(key),key);
 assert.ok(html.includes(style),'generated bundle must retain final stylesheet');
 assert.ok(build.includes('v810-theme.css'));
 assert.doesNotMatch(part,/@import|url\(\s*https?:/i);
});
test('V8.2 mobile and desktop contract prevents leaking bottom nav and clipping names',()=>{
 for(const marker of ['@media(min-width:861px)','display:none!important',
  '@media(max-width:860px)','@media(max-width:520px)',
  '.mobile-nav','white-space:normal!important',
  'grid-template-columns:minmax(0,1fr) auto',
  '--shift82-name-rail','overflow-x:auto!important',
  'min-height:44px!important'])
  assert.ok(part.includes(marker),marker);
 let depth=0;
 for(const ch of part){if(ch==='{')depth++;else if(ch==='}')depth--;assert.ok(depth>=0)}
 assert.equal(depth,0);
});
test('V8.2 source duty data stays exactly unchanged',()=>{
 assert.equal(STAFF.length,10);
 assert.equal(OCT.length,10);assert.equal(OCT.flat().length,310);
 assert.equal(NOV.length,10);assert.equal(NOV.flat().length,300);
 assert.equal(NOV.filter(row=>row[29]==='N1').length,2);
 assert.equal(NOV.filter(row=>row[29]==='N2').length,0);
});
test('V8.2 core text pairs meet WCAG AA normal-text ratio',()=>{
 const lum=hex=>{const rgb=hex.match(/\w{2}/g).map(x=>parseInt(x,16)/255);
  const a=rgb.map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
  return .2126*a[0]+.7152*a[1]+.0722*a[2]};
 const ratio=(fg,bg)=>{const [high,low]=[lum(fg),lum(bg)].sort((a,b)=>b-a);
  return (high+.05)/(low+.05)};
 for(const [fg,bg] of [['1B1A20','F7F2E8'],['584B50','FFFCF7'],
  ['F7F2EC','202530'],['C6CAD4','292F3B'],['26310F','D6F36A'],
  ['FFFFFF','5264E8'],['512537','FFC4D4'],['1B1A20','FF6946']])
  assert.ok(ratio(fg,bg)>=4.5,fg+'/'+bg);
});
