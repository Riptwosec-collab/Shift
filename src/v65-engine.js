import {createI18nController} from './i18n.js';

const V65_VIEWS=Object.freeze(['overview','daily','person','month','analytics']);
const V65_LITERAL_PAIRS=Object.freeze([
  ['ภาพรวม','Overview'],['รายวัน','Daily'],['รายบุคคล','Person'],['รายเดือน','Month'],['ข้อมูล','Analytics'],
  ['เวรกลางวัน','Day Shift'],['เวรกลางคืน','Night Shift'],['วันหยุด','Off Duty'],['พัก / ไม่เข้าทำงาน','Off Duty'],
  ['เทียบวันข้างเคียง','Adjacent Days'],['การเปลี่ยนเวร','Shift Transitions'],['สัญญาณประจำวัน','Daily Signals'],
  ['ความสัมพันธ์ของทีม','Team Network'],['สมดุลภาระงานของทีม','Team Workload Balance'],['สมดุลเวรทั้งทีม','Team Shift Balance'],
  ['พนักงาน','Employee'],['วันก่อน','Previous Day'],['วันถัดไป','Next Day'],['ไม่มี','None'],
  ['ไม่มีการเปลี่ยนสถานะ','No status changes'],['ไม่พบสัญญาณเสี่ยง','No staffing risk signals'],
  ['ตารางเวร','Shift Schedule'],['วันทำงาน','Work Days']
]);

let v65I18n=null;
const v65Wrapped=new Set();

function v65Root(){return typeof document!=='undefined'?document:null}
function v65Locale(){return v65I18n?.getLocale?.()||'th'}
function v65SetText(node,text){if(node&&typeof text==='string'&&node.textContent!==text)node.textContent=text}
function v65NavKey(view){return `nav.${view}`}

function v65TranslateLiteral(text,locale){
  const raw=String(text??''),trimmed=raw.trim();
  if(!trimmed)return raw;
  for(const [th,en] of V65_LITERAL_PAIRS){
    const from=locale==='en'?th:en,to=locale==='en'?en:th;
    if(trimmed===from)return raw.replace(trimmed,to);
  }
  if(locale==='en'){
    return raw
      .replace(/(\d+)\s*วัน/g,'$1 days')
      .replace(/(\d+)\s*คืน/g,'$1 nights')
      .replace(/(\d+)\s*คน/g,'$1 staff');
  }
  return raw
    .replace(/(\d+)\s*days?\b/gi,'$1 วัน')
    .replace(/(\d+)\s*nights?\b/gi,'$1 คืน')
    .replace(/(\d+)\s*staff\b/gi,'$1 คน');
}

function v65TranslateTree(root,locale=v65Locale()){
  if(!root||typeof document==='undefined'||typeof document.createTreeWalker!=='function')return;
  const filter=typeof NodeFilter!=='undefined'?NodeFilter.SHOW_TEXT:4;
  const walker=document.createTreeWalker(root,filter);
  const nodes=[];let node;
  while((node=walker.nextNode()))nodes.push(node);
  for(const textNode of nodes){
    const parent=textNode.parentElement;
    if(!parent||parent.closest?.('script,style,[data-v65-no-translate]'))continue;
    if(parent.closest?.('.person-name,[data-person-name]'))continue;
    const next=v65TranslateLiteral(textNode.nodeValue,locale);
    if(next!==textNode.nodeValue)textNode.nodeValue=next;
  }
}

export function mountV65LanguageControl(doc=v65Root(),i18n=v65I18n){
  const actions=doc?.querySelector?.('.command-actions');
  if(!actions)return null;
  let control=actions.querySelector('.v65-language');
  if(control)return control;
  control=doc.createElement('div');
  control.className='v65-language';
  control.setAttribute('role','group');
  control.setAttribute('aria-label',i18n?.t?.('accessibility.language')||'Language');
  control.innerHTML='<button type="button" data-locale="th" aria-pressed="false">TH</button><span aria-hidden="true">|</span><button type="button" data-locale="en" aria-pressed="false">EN</button>';
  control.addEventListener('click',event=>{
    const button=event.target.closest?.('button[data-locale]');
    if(button)i18n?.setLocale?.(button.dataset.locale);
  });
  const quality=actions.querySelector('.v64-quality');
  actions.insertBefore(control,quality||actions.firstChild);
  return control;
}

export function enhanceV65ModeControl(doc=v65Root(),i18n=v65I18n){
  const control=doc?.querySelector?.('.v64-quality');
  if(!control)return null;
  control.setAttribute('role','group');
  const sync=()=>{
    control.setAttribute('aria-label',i18n?.t?.('accessibility.performance')||'Performance mode');
    control.querySelectorAll('button[data-mode]').forEach(button=>{
      const mode=button.dataset.mode||'BALANCED',active=button.classList.contains('active');
      button.setAttribute('aria-pressed',String(active));
      button.setAttribute('aria-label',`${i18n?.t?.(`modes.${mode.toLowerCase()}`)||mode} — ${i18n?.t?.('accessibility.performance')||'Performance mode'}`);
    });
  };
  sync();
  if(control.dataset.v65A11yBound!=='1'){
    control.dataset.v65A11yBound='1';
    control.addEventListener('click',()=>queueMicrotask(sync));
  }
  return control;
}

export function translateLegacyStatic(root=v65Root(),i18n=v65I18n){
  if(!root||!i18n)return;
  const locale=i18n.getLocale();
  root.documentElement?.setAttribute?.('lang',locale);
  root.documentElement?.setAttribute?.('data-locale',locale);

  root.querySelectorAll?.('.nav-btn[data-view],.mobile-nav [data-view]').forEach(button=>{
    const view=button.dataset.view;
    if(!V65_VIEWS.includes(view))return;
    const label=i18n.t(v65NavKey(view));
    const target=button.querySelector?.('b')||button.querySelector?.('.nav-label')||button;
    v65SetText(target,label);
    button.setAttribute?.('aria-label',label);
  });

  root.querySelectorAll?.('[data-v65-i18n]').forEach(node=>v65SetText(node,i18n.t(node.dataset.v65I18n)));
  root.querySelectorAll?.('[data-v65-i18n-title]').forEach(node=>node.setAttribute('title',i18n.t(node.dataset.v65I18nTitle)));

  const control=root.querySelector?.('.v65-language');
  if(control){
    control.setAttribute('aria-label',i18n.t('accessibility.language'));
    control.querySelectorAll('button[data-locale]').forEach(button=>{
      const active=button.dataset.locale===locale;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
      button.setAttribute('aria-label',`${button.textContent} — ${i18n.t('accessibility.language')}`);
    });
  }
  enhanceV65ModeControl(root,i18n);

  const search=root.querySelector?.('.smart-search input');
  if(search)search.placeholder=locale==='en'?'Search date, employee, or shift':'ค้นหา วันที่ พนักงาน หรือเวร';
  const palette=root.querySelector?.('#v64PaletteInput');
  if(palette)palette.placeholder=i18n.t('palette.placeholder');
}

export function translateLegacyView(viewName,root=v65Root()){
  if(!V65_VIEWS.includes(viewName)||!root)return false;
  const view=root.getElementById?.(`${viewName}View`);
  if(!view)return false;
  v65TranslateTree(view,v65Locale());
  return true;
}

function v65WrapRenderer(name,view){
  const original=globalThis[name];
  if(typeof original!=='function'||v65Wrapped.has(name))return;
  v65Wrapped.add(name);
  globalThis[name]=function(...args){
    const result=original.apply(this,args);
    queueMicrotask(()=>translateLegacyView(view));
    return result;
  };
}

function installV65RenderAdapters(){
  v65WrapRenderer('renderOverview','overview');
  v65WrapRenderer('renderDaily','daily');
  v65WrapRenderer('renderPerson','person');
  v65WrapRenderer('renderHeatmap','month');
  v65WrapRenderer('renderAnalytics','analytics');
}

export function refreshV65Locale(){
  const root=v65Root();
  if(!root||!v65I18n)return;
  translateLegacyStatic(root,v65I18n);
  for(const view of V65_VIEWS){
    const node=root.getElementById?.(`${view}View`);
    if(node&&(node.classList?.contains('active')||node.childElementCount>0))translateLegacyView(view,root);
  }
  globalThis.refreshV64LocalizedSurfaces?.();
}

export function initV65({storage=typeof localStorage!=='undefined'?localStorage:null,root=typeof document!=='undefined'?document.documentElement:null}={}){
  if(!root||typeof document==='undefined')return null;
  v65I18n=createI18nController({storage,root,storageKey:'shift.locale'});
  globalThis.v65I18n=v65I18n;
  mountV65LanguageControl(document,v65I18n);
  enhanceV65ModeControl(document,v65I18n);
  installV65RenderAdapters();
  v65I18n.subscribe(()=>refreshV65Locale());
  refreshV65Locale();
  root.dataset.v65Ready='1';
  return v65I18n;
}

if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>initV65(),{once:true});
  else initV65();
}
