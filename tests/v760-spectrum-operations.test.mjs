import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {OCTOBER_2026_DUTY_POSITIONS as october} from '../src/october-2026-duty-roster.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';

const read=path=>fs.readFileSync(path,'utf8');
const css=read('src/v750-vivid-motion.css');
const overview=read('src/v740-full-month-overview.js');
const novemberJs=read('src/v720-graphic-november.js');

test('V7.6 establishes four vivid signal accents consistently',()=>{
 const accent={
  CYAN:'#00deff',DAY:'#b7ff43',NIGHT:'#b27aff',OFF:'#ff7394'
 };
 for(const color of Object.values(accent))assert.ok(css.toLowerCase().includes(color),color);
 for(const marker of ['--spectrum-cyan:','--spectrum-lime:','--spectrum-violet:','--spectrum-coral:',
  '.command-bar::before','#shift740FullMonth::before',
  '#shift740FullMonth .s740-calendar-day',
  '#shift740FullMonth .s740-duty.s740-D',
  '#shift740FullMonth .s740-duty.s740-N',
  '#shift740FullMonth .s740-duty.s740-H',
  '#shiftNovemberView .shift72-duty-pill.tone-D',
  '#shiftNovemberView .shift72-duty-pill.tone-N',
  '#shiftNovemberView .shift72-duty-pill.tone-H']){
   assert.ok(css.includes(marker),marker);
  }
 assert.match(css,/height:4px;pointer-events:none/);
 assert.doesNotMatch(css,/url\(https?:|<img\b/i);
});
test('V7.6 retains a complete month on Overview, without images',()=>{
 for(const [month,n] of [[10,31],[11,30]]){
  const src=month===10?october:november;
  assert.equal(src.length,STAFF.length);
  for(const row of src)assert.equal(row.length,n);
 }
 assert.match(overview,/shift740Calendar\(month,day\)/);
 assert.match(overview,/shift740Matrix\(month,day\)/);
 assert.match(read('src/v740-full-month-overview.css'),/grid-template-columns:repeat\(7/);
});
test('November D/N chart uses the same vivid palette as the schedule matrix',()=>{
 for(const color of ['#B7FF43','#B27AFF'])assert.ok(novemberJs.includes(color),color);
 assert.ok(novemberJs.includes('shift72TrendMarkup'));
 assert.ok(novemberJs.includes('shift72UpdateDayFast()'));
 assert.ok(novemberJs.includes('shift72CrewMarkup()'));
 assert.equal(november.filter(row=>row[29]==='N1').length,2);
 assert.equal(november.filter(row=>row[29]==='N2').length,0);
});
test('vivid theme favors bounded microinteraction and reduced-motion support',()=>{
 assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
 assert.ok(css.includes('transition:transform .15s'));
 assert.ok(css.includes('backdrop-filter:none!important'));
 assert.ok(css.includes('animation:none!important'));
 assert.doesNotMatch(css, /animation:\s*[^\n;]*infinite(?!\s*!important)/);
});
test('V7.6 is embedded into the deployable PWA, keeping immutable duty sources',()=>{
 const build=read('scripts/build.mjs');
 const html=read('index.html');
 assert.ok(build.includes('v750-vivid-motion.css'));
 assert.match(build,/data-shift-release="7\.6"/);
 assert.match(html,/data-shift-release="7\.6"/);
 assert.ok(html.includes(css));
 assert.ok(html.includes(novemberJs));
 assert.ok(html.includes(read('src/v740-full-month-overview.css')));
 assert.ok(html.includes(read('src/v740-full-month-overview.js')));
 assert.ok(html.includes(read('src/november-2026-duty-roster.js').replace(/^export\s+/gm,'')));
});
