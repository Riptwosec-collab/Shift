import test from 'node:test';
import assert from 'node:assert/strict';
import {I18N,normalizeLocale,createI18nController} from '../src/i18n.js';

function memoryStorage(initial={}){const m=new Map(Object.entries(initial));return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),dump:()=>Object.fromEntries(m)}}
function root(){return {lang:'',dataset:{}}}

test('fresh locale defaults to Thai and formats Buddhist year',()=>{const c=createI18nController({dictionary:I18N,storage:memoryStorage(),root:root()});assert.equal(c.getLocale(),'th');assert.equal(c.formatDate(9,'th'),'9 ตุลาคม 2569');assert.equal(c.formatDate(9,'en'),'9 October 2026')});
test('stored English restores while invalid locale falls back to Thai',()=>{assert.equal(createI18nController({dictionary:I18N,storage:memoryStorage({'shift.locale':'en'}),root:root()}).getLocale(),'en');assert.equal(normalizeLocale('xx'),'th')});
test('storage failures never block locale startup',()=>{const bad={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};assert.doesNotThrow(()=>createI18nController({dictionary:I18N,storage:bad,root:root()}).setLocale('en'))});
test('translation interpolates values and missing keys are deterministic',()=>{const c=createI18nController({dictionary:I18N,storage:memoryStorage(),root:root()});assert.equal(c.t('daily.workStreak',{count:5}),'ทำงานต่อเนื่อง 5 วัน');assert.equal(c.t('missing.key'),'missing.key')});
