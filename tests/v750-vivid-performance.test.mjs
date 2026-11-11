import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {NOVEMBER_2026_DUTY_POSITIONS as november} from '../src/november-2026-duty-roster.js';
import {OCTOBER_2026_DUTY_POSITIONS as october} from '../src/october-2026-duty-roster.js';

const read=p=>fs.readFileSync(p,'utf8');
const globalCss=read('src/v750-vivid-motion.css');
const monthCss=read('src/v740-full-month-overview.css');
const monthJs=read('src/v740-full-month-overview.js');
const novemberJs=read('src/v720-graphic-november.js');

test('V7.5 visual stylesheet remains cohesive without external imagery',()=>{
 for(const marker of ['--end-ink:#1B1A20','--end-paper:#F7F2E8','--end-orange:#FF6946',
  '--end-lime:#D6F36A','--end-cobalt:#5264E8','--end-pink:#FFC4D4',
  '.command-bar','.nav-tabs','#overviewView','.roster-card).day',
  '#shiftNovemberView .shift72-duty-pill.tone-D']){
  assert.ok(globalCss.includes(marker),marker);
 }
 assert.match(monthCss,/--s740-day:#36e7ae/); // historical fallback, overridden by the final theme
 assert.ok(globalCss.includes('html[data-shift750="ready"] #shift740FullMonth'));
 assert.doesNotMatch(globalCss,/<img|url\(https?:/i);
});
test('V7.5 safely removes always-running effects and avoids expensive panel blur',()=>{
 assert.ok(globalCss.includes('backdrop-filter:none!important'));
 assert.ok(globalCss.includes('.view.active'));
 assert.ok(globalCss.includes('animation:none!important'));
 assert.ok(globalCss.includes('prefers-reduced-motion:reduce'));
 assert.ok(globalCss.includes('@media(max-width:760px)'));
 assert.ok(monthJs.includes("document.documentElement.dataset.shift750='ready'"));
});
test('Full-month Overview selection only updates previous/current columns, not 610 cells',()=>{
 const start=monthJs.indexOf('function shift740MarkSelection(');
 const end=monthJs.indexOf('function shift740Render()',start);
 const selection=monthJs.slice(start,end);
 assert.ok(selection.includes('for(const day of [previous,current])'));
 assert.ok(selection.includes("host.dataset.s740ActiveDay"));
 assert.ok(selection.includes("shift740Crew(shift740Model"));
 assert.doesNotMatch(selection,/querySelectorAll\('\[data-s740-day\]'\)/);
 assert.doesNotMatch(selection,/host\.innerHTML\s*=/);
 assert.ok(monthJs.includes('shift740DayMeta(month,d,today)'));
 assert.ok(monthJs.includes("if(!reduce&&typeof detail.animate==='function')"));
});
test('November day changes do not recreate the entire 300-cell graphic matrix',()=>{
 assert.ok(novemberJs.includes('function shift72UpdateDayFast()'));
 const fast=novemberJs.split('function shift72UpdateDayFast()')[1].split('function shift72SelectDay(')[0];
 assert.ok(fast.includes('.shift72-overview-card'));
 assert.ok(fast.includes('.shift72-crew-section'));
 assert.ok(fast.includes('.shift72-date-chip'));
 assert.ok(fast.includes('.shift72-duty-cell'));
 assert.ok(fast.includes('.shift72-trend-svg'));
 assert.doesNotMatch(fast,/host\.innerHTML\s*=/);
 assert.ok(novemberJs.includes('shift72UpdateDayFast();'));
});
test('V7.5 retains immutable October and November sources with complete daily codes',()=>{
 assert.equal(october.length,STAFF.length);
 assert.equal(november.length,STAFF.length);
 assert.equal(october.reduce((total,row)=>total+row.length,0),310);
 assert.equal(november.reduce((total,row)=>total+row.length,0),300);
 assert.equal(november.filter(row=>row[29]==='N1').length,2);
 assert.equal(november.filter(row=>row[29]==='N2').length,0);
});
test('Standalone build includes V7.5, UI CSS and faster in-place view code',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html');
 assert.match(build,/v750-vivid-motion\.css/);
 assert.match(html,/id="v750-vivid-motion-style"/);
 const release=html.match(/data-shift-release="(\d+\.\d+)"/);
 assert.ok(release&&Number(release[1])>=7.5,'v7.5 performance contract must remain present');
 for(const source of [globalCss,monthCss,monthJs,novemberJs])assert.ok(html.includes(source));
 assert.ok(read('src/v6536-november-sheet.js').includes('shiftNovRenderGrid=shiftNovRenderReferenceSheet'));
});
