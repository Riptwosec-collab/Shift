import {I18N,SUPPORTED_LOCALES} from './i18n-copy.js';

export function normalizeLocale(value){
  const v=String(value||'').toLowerCase();
  return SUPPORTED_LOCALES.includes(v)?v:'th';
}

function readPath(obj,path){return String(path).split('.').reduce((node,key)=>node&&Object.prototype.hasOwnProperty.call(node,key)?node[key]:undefined,obj)}
function interpolate(text,values={}){return String(text).replace(/\{([^}]+)\}/g,(_,key)=>values[key]??`{${key}}`)}

export function createI18nController({dictionary=I18N,storage=typeof localStorage!=='undefined'?localStorage:null,root=typeof document!=='undefined'?document.documentElement:null,storageKey='shift.locale'}={}){
  const listeners=new Set();
  let stored=null;
  try{stored=storage?.getItem?.(storageKey)}catch{}
  let locale=normalizeLocale(stored);
  const syncRoot=()=>{if(!root)return;root.lang=locale;root.dataset??={};root.dataset.locale=locale};
  syncRoot();
  const api={
    getLocale:()=>locale,
    setLocale(value){
      const next=normalizeLocale(value);
      if(next===locale){syncRoot();return locale}
      locale=next;syncRoot();
      try{storage?.setItem?.(storageKey,locale)}catch{}
      for(const fn of listeners)fn(locale);
      return locale;
    },
    t(key,values={},localeOverride){
      const lang=normalizeLocale(localeOverride||locale);
      const text=readPath(dictionary[lang],key)??readPath(dictionary.th,key)??key;
      return interpolate(text,values);
    },
    formatDate(day,localeOverride){
      const lang=normalizeLocale(localeOverride||locale),n=Math.max(1,Math.min(31,Number(day)||1));
      return lang==='en'?`${n} October 2026`:`${n} ตุลาคม 2569`;
    },
    formatStatus(code,localeOverride){
      const lang=normalizeLocale(localeOverride||locale);
      if(code==='D')return lang==='en'?'Day Shift':'เวรกลางวัน';
      if(code==='N')return lang==='en'?'Night Shift':'เวรกลางคืน';
      if(code==='O'||code==='OFF')return lang==='en'?'Off Duty':'พัก / ไม่เข้าทำงาน';
      return String(code??'');
    },
    formatRisk(risk,localeOverride){
      if(!risk)return '';
      const map={
        'LOW STAFFING':'risk.lowStaffing','LOW NIGHT COVERAGE':'risk.lowNight','D/N IMBALANCE':'risk.imbalance',
        'HIGH OFF COUNT':'risk.highOff','WORK STREAK':'risk.workStreak','NIGHT STREAK':'risk.nightStreak'
      };
      const key=map[risk.code];
      return key?api.t(key,risk.values||{},localeOverride):(risk.text||String(risk.code||''));
    },
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
  };
  return api;
}
