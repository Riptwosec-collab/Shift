import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAFF} from '../src/data.js';
import {createScheduleCache} from '../src/cache.js';
import {evaluateDayRisk} from '../src/risk.js';
import {parseCommandQuery} from '../src/command-palette.js';
import {createI18nController} from '../src/i18n.js';

const cache=createScheduleCache(STAFF);
const i18n=createI18nController({storage:null,root:{dataset:{}}});

test('risk records expose structured values for bilingual presentation',()=>{
  const day=3,risks=evaluateDayRisk(day,cache,STAFF);
  assert.ok(risks.length>0);
  for(const risk of risks) assert.ok(risk.values&&typeof risk.values==='object',`missing values for ${risk.code}`);
  const low=risks.find(x=>x.code==='LOW STAFFING');
  if(low){assert.equal(low.values.working,cache.dayStats[day].working);assert.match(i18n.formatRisk(low,'en'),/staff on duty/)}
  const named=risks.find(x=>x.code==='WORK STREAK'||x.code==='NIGHT STREAK');
  if(named) assert.ok(STAFF.some(p=>i18n.formatRisk(named,'en').includes(p.name)));
});

test('command palette accepts locale-aware presentation without changing person names',()=>{
  const en=parseCommandQuery('9',{locale:'en',t:(k,v)=>i18n.t(k,v,'en'),formatDate:d=>i18n.formatDate(d,'en')});
  assert.equal(en[0].label,'9 October 2026');
  const th=parseCommandQuery('9',{locale:'th',t:(k,v)=>i18n.t(k,v,'th'),formatDate:d=>i18n.formatDate(d,'th')});
  assert.equal(th[0].label,'9 ตุลาคม 2569');
  const person=parseCommandQuery('นลิทัศน์',{locale:'en',t:(k,v)=>i18n.t(k,v,'en')}).find(x=>x.type==='person');
  assert.equal(person.label,STAFF[0].name);
});

test('v6.4 presentation exposes a locale refresh hook and translated surface markers',()=>{
  const code=fs.readFileSync('src/v64-engine.js','utf8');
  assert.ok(code.includes('function refreshV64LocalizedSurfaces'));
  assert.ok(code.includes('v65I18n'));
  for(const marker of ['daily.adjacent','daily.noTransitions','network.top','analytics.title','palette.empty']) assert.ok(code.includes(marker),`missing translation key ${marker}`);
  assert.doesNotMatch(code,/STAFF\s*=|\.s\s*=/,'localization layer must not mutate schedule data');
});
