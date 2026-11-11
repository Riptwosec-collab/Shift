/* SHIFT V7.8 — Editorial cohesion across existing Shift views.
 * New presentation only; no roster, saved-preference or navigation data changes.
 * Uses native DOM, no dependencies and no continuous motion observers.
 */
const SHIFT78_PAGE_META=Object.freeze([
 {id:'dailyView',key:'daily',number:'01 / DAY',kicker:'DAILY OPERATIONS',title:'<span>วันต่อวัน.</span><em>คนต่อคน.</em>',sub:'ดูว่าใครอยู่เวร D1–D4 และ N1–N2 ในวันที่เลือก พร้อมเปิดรายละเอียดรายชื่อได้',stamp:'D/N',stampLabel:'CREW'},
 {id:'personView',key:'person',number:'02 / PEOPLE',kicker:'PERSONNEL / TEAM',title:'<span>ทุกคน</span><em>มีจังหวะ.</em>',sub:'ดูตารางรายบุคคล วันทำงาน วันหยุด และรายละเอียดเวรของคนในทีม',stamp:'10',stampLabel:'PEOPLE'},
 {id:'monthView',key:'month',number:'03 / MONTH',kicker:'FULL ROSTER / 2026',title:'<span>ทุกเวร.</span><em>ทุกวัน.</em>',sub:'ตารางเวรทั้งทีม เดือนตุลาคม 31 วัน และพฤศจิกายน 30 วัน พร้อมข้อมูล D1–D4 / N1–N2',stamp:'02',stampLabel:'MONTHS'},
 {id:'analyticsView',key:'analytics',number:'04 / DATA',kicker:'WORKLOAD / INSIGHTS',title:'<span>เห็นภาพ.</span><em>เข้าใจเวร.</em>',sub:'เปรียบเทียบภาระงาน สัดส่วนวันและคืน และแนวโน้มการจัดเวรจากข้อมูลจริง',stamp:'↗',stampLabel:'TRENDS'},
 {id:'oncallView',key:'oncall',number:'05 / ONCALL',kicker:'ENGINEER / COVERAGE',title:'<span>คนพร้อม.</span><em>งานพร้อม.</em>',sub:'ดูเวรวิศวกร ช่วงเวลารับผิดชอบ และสถานะการสับเปลี่ยนเวร',stamp:'◎',stampLabel:'ONCALL'}
]);
const SHIFT78_PAGE_EN=Object.freeze({
 daily:{title:'<span>Every day.</span><em>Every person.</em>',sub:'See who covers D1–D4 and N1–N2 on the selected date and explore each assignment.'},
 person:{title:'<span>One team.</span><em>Many rhythms.</em>',sub:'Explore individual duties, working days, time off and team responsibilities.'},
 month:{title:'<span>Every shift.</span><em>Every day.</em>',sub:'Complete 2026 team schedules for October (31 days) and November (30 days).'},
 analytics:{title:'<span>See the work.</span><em>Know the pattern.</em>',sub:'Compare workload, day and night coverage, and scheduling trends from the original roster.'},
 oncall:{title:'<span>People ready.</span><em>Systems ready.</em>',sub:'Explore engineer coverage, duty periods and handoff responsibilities.'}
});
function shift78Locale(){
 return document.documentElement?.dataset?.locale==='en'||document.documentElement?.lang==='en'?'en':'th';
}
function shift78MakeHeader(spec){
 const heading=document.createElement('header');
 const locale=shift78Locale(),translated=locale==='en'?SHIFT78_PAGE_EN[spec.key]:null;
 const title=translated?.title||spec.title,sub=translated?.sub||spec.sub;
 heading.dataset.shift78Locale=locale;
 heading.className='shift78-section-hero shift78-section-hero--'+spec.key;
 heading.dataset.shift78For=spec.id;
 heading.setAttribute('aria-label',locale==='en'?'Page header '+spec.key:'หัวข้อหน้าจอ '+spec.key);
 heading.innerHTML='<div class="shift78-section-meta"><span class="shift78-section-index">'+spec.number+
 '</span><span class="shift78-section-kicker">'+spec.kicker+'</span></div>'+
 '<div class="shift78-section-grid"><div class="shift78-section-copy"><h2>'+title+'</h2><p>'+sub+'</p></div>'+
 '<div class="shift78-section-art" aria-hidden="true"><span class="shift78-stamp">'+spec.stamp+
 '</span><span class="shift78-stamp-label">'+spec.stampLabel+'</span><i class="shift78-art-ring"></i>'+
 '<i class="shift78-art-spark"></i></div></div>';
 return heading;
}
function shift78MountHeaders(){
 for(const spec of SHIFT78_PAGE_META){
  const view=document.getElementById(spec.id);
  if(!view)continue;
  const existing=view.querySelector('.shift78-section-hero');
  if(existing&&existing.dataset.shift78Locale===shift78Locale())continue;
  const head=shift78MakeHeader(spec);
  if(existing)existing.replaceWith(head);
  else view.insertBefore(head,view.firstChild);
 }
}
function shift78Init(){
 if(document.documentElement.dataset.shift780==='ready')return;
 const root=document.getElementById('overviewView');
 if(!root)return;
 shift78MountHeaders();
 const footer=document.querySelector('.footer');
 if(footer){
  footer.textContent='SHIFT / TEAM. TIME. TOGETHER.  •  D = DAY  /  N = NIGHT  /  H / O = OFF  •  ข้อมูลตารางเวรต้นฉบับ';
  footer.setAttribute('aria-label','คำอธิบายรหัสเวรและข้อมูลตารางต้นฉบับ');
 }
 document.documentElement.dataset.shift780='ready';
 // Oncall reconstructs its whole view on day/month/person changes.
 // Restore its editorial header immediately after each native render, without changing data.
 if(typeof renderV652Oncall==='function'&&!renderV652Oncall.__shift78){
  const previous=renderV652Oncall;
  const wrapped=function(){
   const result=previous.apply(this,arguments);
   shift78MountHeaders();
   return result;
  };
  wrapped.__shift78=true;
  renderV652Oncall=wrapped;
 }
 document.addEventListener('v65:localechange',()=>queueMicrotask(shift78MountHeaders));
 // Engineer Oncall can be mounted by earlier modules during app startup.
 // A single lightweight delegated click handles late-added views without polling.
 document.addEventListener('click',event=>{
  const trigger=event.target.closest?.('[data-view="oncall"],[data-shift78-open-oncall]');
  if(trigger)queueMicrotask(shift78MountHeaders);
 },{passive:true});
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shift78Init,{once:true});
 else shift78Init();
}
