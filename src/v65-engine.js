import {I18N,createI18nController} from './i18n.js';
import {visualProfile} from './performance.js';

const v65I18n=createI18nController({dictionary:I18N});
if(typeof window!=='undefined')window.v65I18n=v65I18n;
const V65_VIEWS=['overview','daily','person','month','analytics'];
const V65_PAIRS=[
['ภาพรวม','Overview'],['รายวัน','Daily'],['รายบุคคล','Person'],['รายเดือน','Month'],['ข้อมูล','Analytics'],['หน้าหลัก','Home'],['สถิติ','Stats'],
['เวรกลางวัน','Day Shift'],['เวรกลางคืน','Night Shift'],['วันหยุด','Off Duty'],['ความสัมพันธ์ของทีม','Team Network'],['ตารางเดือน','Month Matrix'],
['ภาพรวมปฏิบัติการรายวัน','Daily Operations Intelligence'],['วันข้างเคียง','Adjacent Days'],['การเปลี่ยนเวร','Shift Transitions'],['ความเสี่ยงกำลังคน','Staffing Risk'],['เวรต่อเนื่อง','Current Streaks'],
['สมดุลภาระงานของทีม','Team Workload Balance'],['พนักงาน','Employee'],['วันก่อน','Previous day'],['วันถัดไป','Next day'],['ค่าเฉลี่ยวันทำงาน','Average work days'],['ค่าเฉลี่ยเวร N','Average N shifts'],
['เพื่อนร่วมทีมเด่น','Top teammate'],['ความสัมพันธ์','Strength'],['ไม่มีการเปลี่ยนสถานะไปวันถัดไป','No shift transition to the next day'],['ไม่พบสัญญาณเสี่ยงตาม threshold','No staffing risk signals at current thresholds'],
['ไม่พบ Staffing Risk ในวันที่เลือก','No staffing risk on selected day'],['พิมพ์วันที่ ชื่อพนักงาน หรือชื่อหน้า','Type a date, employee name, status, or view'],['เลือก','Choose'],['เปิด','Open']
];
function v65Locale(){return v65I18n.getLocale()}
function v65PairText(value,locale=v65Locale()){const s=String(value||'').trim();for(const [th,en] of V65_PAIRS)if(s===th||s===en)return locale==='en'?en:th;return null}
function v65DynamicText(value,locale=v65Locale()){
  let s=String(value||'');const exact=v65PairText(s,locale);if(exact!==null)return exact;
  const day=s.match(/^(?:วันที่\s*)?(\d{1,2})\s+ตุลาคม(?:\s+2569)?$/);if(day&&locale==='en')return `${day[1]} October 2026`;
  const enDay=s.match(/^(\d{1,2})\s+October\s+2026$/);if(enDay&&locale==='th')return `${enDay[1]} ตุลาคม 2569`;
  if(locale==='en')return s.replace(/วัน/g,'days').replace(/คืน/g,'nights').replace(/คน/g,'people').replace(/ครอบคลุม/g,'Coverage').replace(/ร่วมกะ/g,'Same shift').replace(/ส่งต่องาน/g,'Handoff');
  return s.replace(/Previous day/g,'วันก่อน').replace(/Next day/g,'วันถัดไป').replace(/Same shift/g,'ร่วมกะ').replace(/Handoff/g,'ส่งต่องาน');
}
function v65TranslateTree(root){if(!root)return;root.querySelectorAll?.('[data-i18n]').forEach(el=>{el.textContent=v65I18n.t(el.dataset.i18n)});root.querySelectorAll?.('[data-i18n-title]').forEach(el=>{el.title=v65I18n.t(el.dataset.i18nTitle)});const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){if(!node.parentElement||['SCRIPT','STYLE'].includes(node.parentElement.tagName))continue;const raw=node.nodeValue,trim=raw.trim();if(!trim)continue;const next=v65DynamicText(trim);if(next!==trim)node.nodeValue=raw.replace(trim,next)}}
function translateLegacyStatic(root=document){v65TranslateTree(root);const locale=v65Locale();document.documentElement.lang=locale;document.documentElement.dataset.locale=locale;document.querySelectorAll('.v65-language button').forEach(b=>b.classList.toggle('active',b.dataset.locale===locale));const input=document.getElementById('v64PaletteInput');if(input)input.placeholder=v65I18n.t('palette.placeholder');const oldInput=document.querySelector('.smart-search input');if(oldInput)oldInput.setAttribute('aria-label',locale==='en'?'Search shift dashboard':'ค้นหาในแดชบอร์ดเวร')}
function translateLegacyView(viewName){if(!V65_VIEWS.includes(viewName))return false;const root=document.getElementById(`${viewName}View`);if(root)v65TranslateTree(root);return !!root}
function refreshV65DynamicSurfaces(){for(const view of V65_VIEWS){const el=document.getElementById(`${view}View`);if(el&&(el.classList.contains('active')||v64Mounted?.has?.(view)))translateLegacyView(view)}const sticky=document.getElementById('v64StickyDaily');if(sticky)v65TranslateTree(sticky);const mobileNav=document.getElementById('mobileNav')||document.querySelector('.mobile-nav');if(mobileNav)v65TranslateTree(mobileNav)}
function refreshV65Locale(){translateLegacyStatic(document);refreshV65DynamicSurfaces();if(typeof refreshV64LocalizedSurfaces==='function')refreshV64LocalizedSurfaces();document.dispatchEvent(new CustomEvent('v65:localechange',{detail:{locale:v65Locale()}}))}
function mountV65LanguageControl(){const actions=document.querySelector('.command-actions');if(!actions||actions.querySelector('.v65-language'))return;const control=document.createElement('div');control.className='v65-language';control.setAttribute('aria-label',v65I18n.t('accessibility.language'));control.innerHTML='<button type="button" data-locale="th">TH</button><button type="button" data-locale="en">EN</button>';control.addEventListener('click',e=>{const b=e.target.closest('button[data-locale]');if(!b)return;v65I18n.setLocale(b.dataset.locale);refreshV65Locale()});const quality=actions.querySelector('.v64-quality');quality?.after(control)||actions.prepend(control)}
function installV65RenderHooks(){const wrap=name=>{const fn=window[name];if(typeof fn!=='function'||fn.__v65)return;const wrapped=function(...args){const result=fn.apply(this,args);queueMicrotask(()=>refreshV65DynamicSurfaces());return result};wrapped.__v65=true;window[name]=wrapped};for(const name of ['showView','setSelectedDay','renderOverview','renderDaily','renderPerson','renderHeatmap','renderAnalytics','renderNetwork'])wrap(name)}
function installV65ModeBridge(){document.documentElement.dataset.v65Mode='BALANCED';document.querySelector('.v64-quality')?.addEventListener('click',e=>{const b=e.target.closest('button[data-mode]');if(!b)return;const mode=b.dataset.mode;document.documentElement.dataset.v65Mode=mode;document.documentElement.dataset.v65Motion=visualProfile(mode).continuousMotion?'on':'off'});document.documentElement.dataset.v65Motion='on'}
function initV65(){mountV65LanguageControl();installV65ModeBridge();installV65RenderHooks();refreshV65Locale();document.documentElement.dataset.v65Ready='1'}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV65,{once:true});else initV65()}
export {mountV65LanguageControl,translateLegacyStatic,translateLegacyView,refreshV65Locale,refreshV65DynamicSurfaces,initV65};
