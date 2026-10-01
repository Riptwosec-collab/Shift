import test from 'node:test';
import assert from 'node:assert/strict';
import {I18N,SUPPORTED_LOCALES} from '../src/i18n-copy.js';
import {normalizeLocale,createI18nController} from '../src/i18n.js';

function memoryStorage(initial={}){
  const map=new Map(Object.entries(initial));
  return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),dump:()=>Object.fromEntries(map)};
}

test('fresh client defaults to Thai and supports th/en only',()=>{
  assert.deepEqual(SUPPORTED_LOCALES,['th','en']);
  assert.equal(normalizeLocale('TH'),'th');
  assert.equal(normalizeLocale('en'),'en');
  assert.equal(normalizeLocale('jp'),'th');
  const root={lang:'',dataset:{}};
  const i18n=createI18nController({storage:memoryStorage(),root});
  assert.equal(i18n.getLocale(),'th');
  assert.equal(root.lang,'th');
  assert.equal(root.dataset.locale,'th');
});

test('stored English is restored and invalid storage falls back to Thai',()=>{
  assert.equal(createI18nController({storage:memoryStorage({'shift.locale':'en'}),root:{dataset:{}}}).getLocale(),'en');
  assert.equal(createI18nController({storage:memoryStorage({'shift.locale':'xx'}),root:{dataset:{}}}).getLocale(),'th');
});

test('storage errors never block locale controller',()=>{
  const bad={getItem(){throw new Error('blocked')},setItem(){throw new Error('blocked')}};
  const root={dataset:{}};
  assert.doesNotThrow(()=>createI18nController({storage:bad,root}));
  const i18n=createI18nController({storage:bad,root});
  assert.doesNotThrow(()=>i18n.setLocale('en'));
  assert.equal(i18n.getLocale(),'en');
});

test('dates, interpolation and missing-key fallback are deterministic',()=>{
  const i18n=createI18nController({storage:memoryStorage(),root:{dataset:{}}});
  assert.equal(i18n.formatDate(9,'th'),'9 ตุลาคม 2569');
  assert.equal(i18n.formatDate(9,'en'),'9 October 2026');
  assert.equal(i18n.t('network.sameShift',{count:3}),'ร่วมกะ 3 คน');
  assert.equal(i18n.t('missing.key'),'missing.key');
  assert.ok(I18N.th.nav.overview);
  assert.ok(I18N.en.nav.overview);
});
