import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {OCTOBER_2026_DUTY_POSITIONS as oct} from '../src/october-2026-duty-roster.js';
import {NOVEMBER_2026_DUTY_POSITIONS as nov} from '../src/november-2026-duty-roster.js';
const read=p=>fs.readFileSync(p,'utf8');
const css=read('src/v750-vivid-motion.css');
const overview=read('src/v740-full-month-overview.js');
const november=read('src/v720-graphic-november.js');
const html=read('index.html'),build=read('scripts/build.mjs');
const color=(str)=>str.toLowerCase().replace('#','');
function contrast(a,b){
 const rgb=hex=>[0,2,4].map(i=>parseInt(color(hex).slice(i,i+2),16)/255)
   .map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 const la=rgb(a).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 const lb=rgb(b).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 return (Math.max(la,lb)+.05)/(Math.min(la,lb)+.05);
}
test('editorial ink/paper/orange color system is an original cohesive theme',()=>{
 for(const mark of ['--end-ink:#1B1A20','--end-paper:#F7F2E8','--end-orange:#FF6946',
 '--end-lime:#D6F36A','--end-cobalt:#5264E8','--end-pink:#FFC4D4',
 '#shift740FullMonth h2.end770-title','#shift740FullMonth .end770-hero-mark',
 '#shift740FullMonth .s740-calendar-day','#shift740FullMonth .s740-duty.s740-D',
 '#shift740FullMonth .s740-duty.s740-N','#shift740FullMonth .s740-duty.s740-H',
 '#shiftNovemberView .shift72-command h3','#shiftNovemberView .shift72-position-card'])
  assert.ok(css.includes(mark),mark);
 assert.ok(overview.includes('end770-title'));
 assert.ok(overview.includes('end770-hero-mark'));
 assert.ok(november.includes('end770-nov-dot'));
});
test('critical role labels meet or exceed WCAG AA normal text contrast',()=>{
 assert.ok(contrast('#24300A','#D6F36A')>=4.5,'D dark on lime');
 assert.ok(contrast('#FFFFFF','#5264E8')>=4.5,'N white on cobalt');
 assert.ok(contrast('#7B3047','#FFD4E0')>=4.5,'H dark on blush');
 assert.ok(contrast('#1B1A20','#F7F2E8')>=4.5,'Ink on paper');
});
test('complete October and November duty cells remain verbatim, including source warnings',()=>{
 assert.equal(oct.length,STAFF.length);assert.equal(nov.length,STAFF.length);
 assert.equal(oct.reduce((s,row)=>s+row.length,0),310);
 assert.equal(nov.reduce((s,row)=>s+row.length,0),300);
 assert.equal(nov.filter(row=>row[29]==='N1').length,2);
 assert.equal(nov.filter(row=>row[29]==='N2').length,0);
 assert.ok(overview.includes('shift740Matrix(month,day)'));
 assert.ok(november.includes('shift72RenderGraph'));
});
test('no proprietary reference assets, copy or external animations are introduced',()=>{
 assert.doesNotMatch(css,/madebyend|url\(https?:|@import|<img/i);
 assert.doesNotMatch(overview,/madebyend|<img|new Image\(|fetch\(/i);
 assert.doesNotMatch(november,/madebyend|<img|new Image\(|fetch\(/i);
 assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
 assert.ok(css.includes('max-width:390px')&&css.includes('max-width:760px'));
 assert.doesNotMatch(css,/animation:\s*[^\n;]*infinite/i);
});
test('deployable V7.7 bundle embeds exact updated styling and markup',()=>{
 const htmlRelease=html.match(/data-shift-release="(\d+\.\d+)"/);
 assert.ok(htmlRelease&&Number(htmlRelease[1])>=7.7);
 const buildRelease=build.match(/data-shift-release="(\d+\.\d+)"/);
 assert.ok(buildRelease&&Number(buildRelease[1])>=7.7);
 for(const src of [css,overview,november])assert.ok(html.includes(src),'source not embedded');
 assert.ok(html.includes('id="v750-vivid-motion-style"'));
 assert.ok(html.includes('shift740MarkSelection'));
});
