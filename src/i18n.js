import {I18N} from './i18n-copy.js';
export {I18N};
export const SUPPORTED_LOCALES=Object.freeze(['th','en']);
export const normalizeLocale=value=>SUPPORTED_LOCALES.includes(String(value||'').toLowerCase())?String(value).toLowerCase():'th';
const getPath=(obj,path)=>String(path).split('.').reduce((v,k)=>v&&v[k],obj);
const interpolate=(s,values={})=>String(s).replace(/\{(\w+)\}/g,(_,k)=>values[k]??`{${k}}`);
export function createI18nController({dictionary=I18N,storage=typeof localStorage!=='undefined'?localStorage:null,root=typeof document!=='undefined'?document.documentElement:null,storageKey='shift.locale'}={}){
  let locale='th';const listeners=new Set();
  try{locale=normalizeLocale(storage?.getItem(storageKey))}catch{locale='th'}
  const apply=()=>{if(root){root.lang=locale;root.dataset.locale=locale}};apply();
  const t=(key,values={},forced=locale)=>interpolate(getPath(dictionary[normalizeLocale(forced)],key)??key,values);
  const formatDate=(day,forced=locale)=>normalizeLocale(forced)==='en'?`${Number(day)} October 2026`:`${Number(day)} ตุลาคม 2569`;
  const formatStatus=code=>code==='O'?'OFF':code;
  const formatRisk=(risk,forced=locale)=>{const l=normalizeLocale(forced),v=risk?.values||{};switch(risk?.code){case'LOW STAFFING':return l==='en'?`${v.working} people on duty`:`เข้าเวร ${v.working} คน`;case'LOW NIGHT COVERAGE':return l==='en'?`N shift ${v.night} people`:`เวร N ${v.night} คน`;case'D/N IMBALANCE':return `D ${v.day} / N ${v.night}`;case'HIGH OFF COUNT':return l==='en'?`OFF ${v.off} people`:`OFF ${v.off} คน`;case'WORK STREAK':return l==='en'?`${v.name} ${v.days}-day work streak`:`${v.name} ${v.days} วัน`;case'NIGHT STREAK':return l==='en'?`${v.name} N ${v.nights} nights`:`${v.name} N ${v.nights} คืน`;default:return risk?.text||''}};
  return {getLocale:()=>locale,setLocale(value){locale=normalizeLocale(value);try{storage?.setItem(storageKey,locale)}catch{}apply();for(const fn of listeners)fn(locale);return locale},t,formatDate,formatStatus,formatRisk,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}};
}
