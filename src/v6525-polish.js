/* Shift v6.5.25 — presentation-only mobile month improvements. */
let shiftWeekStart=null;
function weekAnchor(day){return Math.floor((Math.max(1,Math.min(31,Number(day)||1))-1)/7)*7+1}
function weekMarkup(){
 const th=(typeof v652Locale==='function'?v652Locale():'th')==='th';
 const start=Number.isInteger(shiftWeekStart)?shiftWeekStart:weekAnchor(selectedDay),end=Math.min(31,start+6);
 const days=Array.from({length:7},(_,i)=>start+i),today=v6515TodayForLegacy();
 const dow=th?['อา','จ','อ','พ','พฤ','ศ','ส']:['Su','Mo','Tu','We','Th','Fr','Sa'];
 const headers=days.map(day=>day<=31?`<button class="shift-week-date ${day===today?'today':''} ${day===selectedDay?'selected':''}" data-shift-week-day="${day}" aria-label="${day} ${th?'ตุลาคม':'October'}"><small>${dow[new Date(2026,9,day).getDay()]}</small><b>${day}</b></button>`:`<span class="shift-week-empty">–</span>`).join('');
 const rows=staff.map((p,i)=>`<div class="shift-week-row"><span class="shift-week-name" title="${v6515Escape(p.name)}">${v6515Escape(p.name)}</span>${days.map(day=>{
  if(day>31)return '<span class="shift-week-empty">–</span>';
  const code=statusAt(i,day);
  return `<button class="shift-week-cell ${code} ${day===selectedDay?'selected':''}" data-shift-week-person="${i}" data-shift-week-date="${day}" aria-label="${v6515Escape(p.name)} ${day} ${code}">${code==='O'?'OFF':code}</button>`;
 }).join('')}</div>`).join('');
 return `<section class="shift-week-panel"><header class="shift-week-heading"><div><small>MONTH MATRIX / WEEK ${Math.ceil(start/7)}</small><strong>${th?'ตารางเวรรายสัปดาห์':'Weekly roster'}</strong><span>${start}–${end} ${th?'ตุลาคม 2569':'October 2026'}</span></div><nav class="shift-week-nav" aria-label="Week controls"><button data-shift-week-step="-7" ${start===1?'disabled':''} aria-label="${th?'สัปดาห์ก่อน':'Previous week'}">‹</button><button data-shift-week-step="7" ${start>=29?'disabled':''} aria-label="${th?'สัปดาห์ถัดไป':'Next week'}">›</button></nav></header><div class="shift-week-scroll"><div class="shift-week-grid"><div class="shift-week-row shift-week-head"><span class="shift-week-name">${th?'ชื่อพนักงาน':'Employee'}</span>${headers}</div>${rows}</div></div><footer class="shift-week-footer"><span class="D">D</span><span class="N">N</span><span class="O">OFF</span><small>${th?'เลื่อนแนวนอน • แตะช่องเพื่อดูรายละเอียด':'Swipe and tap a shift for details'}</small></footer></section>`;
}
function eightDayPreview(selectedDay){
 const now=new Date(),isOct=now.getFullYear()===2026&&now.getMonth()===9;
 const start=Math.max(1,Math.min(31,isOct?now.getDate():selectedDay));
 const days=Array.from({length:8},(_,i)=>{const date=new Date(2026,9,start+i);return {date,day:date.getDate(),oct:date.getMonth()===9}});
 const en=v6517Language()==='en',locale=en?'en-US':'th-TH',last=days[7].date;
 const range=en?`Oct ${start} – ${last.getDate()} ${last.getMonth()===9?'Oct':'Nov'} 2026`:`${start} ต.ค. – ${last.getDate()} ${last.getMonth()===9?'ต.ค.':'พ.ย.'} 2569`;
 const head=`<div class="v660-matrix-toolbar shift-preview-header"><span class="shift-preview-label">● ${en?'ROSTER PREVIEW':'ตารางเวรล่วงหน้า'} <em>${en?'TODAY':'วันนี้'}</em></span><strong>${en?'Today + next 7 days':'วันนี้และ 7 วันถัดไป'}</strong><small>${range}</small></div>`;
 const dates=`<div class="v6517-mobile-row v660-preview-head"><span class="v6517-mobile-name">${en?'Personnel':'ชื่อพนักงาน'}</span>${days.map((x,i)=>x.oct?`<button data-v6517-day="${x.day}" class="${i===0?'today':''}" aria-label="${x.day} ${en?'October':'ตุลาคม'}"><small>${x.date.toLocaleDateString(locale,{weekday:'short'}).replace('.','')}</small><b>${x.day}</b></button>`:`<span class="shift-nextmonth-date"><b>${x.day}</b><small>${en?'Nov':'พ.ย.'}</small></span>`).join('')}</div>`;
 const rows=staff.map((p,i)=>`<div class="v6517-mobile-row"><span class="v6517-mobile-name" title="${v6517Esc(p.name)}">${v6517Esc(p.name)}</span>${days.map((x,k)=>{
  if(!x.oct)return '<span class="shift-no-data">–</span>';
  const code=statusAt(i,x.day);
  return `<button class="${code} ${k===0?'shift-first-day':''} ${selectedDay===x.day?'selected':''}" data-v6517-day="${x.day}" data-v6517-person="${i}" aria-label="${v6517Esc(p.name)} ${x.day} ${v6517Esc(label(code))}">${code==='O'?'':code}</button>`;
 }).join('')}</div>`).join('');
 const legend=`<div class="v660-matrix-legend"><span class="d"><i></i>D ${en?'Day':'กลางวัน'}</span><span class="n"><i></i>N ${en?'Night':'กลางคืน'}</span><span class="o"><i></i>OFF ${en?'Rest':'พัก'}</span></div>`;
 const desc=days.some(d=>!d.oct)?(en?'November roster is not available yet':'ยังไม่มีข้อมูลตารางเวรของเดือน พ.ย.'):(en?'Tap a colored cell to see details':'แตะช่องสีเพื่อดูรายละเอียดเวร');
 return head+`<div class="shift-preview-grid"><div class="v660-matrix-grid" style="--v660-preview-days:8">${dates}${rows}</div><div class="shift-preview-fade"></div></div><footer class="shift-preview-footer">${legend}<p>${desc}</p><button class="v660-month-link shift-preview-full" data-v660-full-month><span>${en?'View full month':'ดูเต็ม • ตารางรายเดือน'}</span><span>→</span></button></footer>`;
}
const nativeShiftMonth=v6515RenderMobileMonth;
v6515RenderMobileMonth=function(){nativeShiftMonth();if(!v6515IsMobile())return;const root=document.getElementById('v6515MobileMonth'),calendar=root?.querySelector('.v6515-month-days');if(!calendar)return;const wrapper=document.createElement('div');wrapper.innerHTML=weekMarkup();calendar.before(wrapper.firstElementChild);const label=document.createElement('div');label.className='shift-calendar-heading';label.innerHTML=(typeof v652Locale==='function'&&v652Locale()==='en')?'<b>Full month calendar</b><small>Choose a day</small>':'<b>ปฏิทินตลอดเดือน</b><small>เลือกวันที่เพื่อดูเวร</small>';calendar.before(label)};
v6517MobilePreview=eightDayPreview;
if(typeof document!=='undefined'){document.addEventListener('click',event=>{
const b=event.target.closest?.('#v6515MobileMonth [data-shift-week-step],#v6515MobileMonth [data-shift-week-day],#v6515MobileMonth [data-shift-week-person]');if(!b)return;
if(b.hasAttribute('data-shift-week-step')){const current=Number.isInteger(shiftWeekStart)?shiftWeekStart:weekAnchor(selectedDay);shiftWeekStart=Math.max(1,Math.min(29,current+Number(b.dataset.shiftWeekStep)));v6515RenderMobileMonth();return}
if(b.hasAttribute('data-shift-week-day')){const day=Number(b.dataset.shiftWeekDay);if(day>=1&&day<=31){shiftWeekStart=weekAnchor(day);setSelectedDay(day,false)}return}
const person=Number(b.dataset.shiftWeekPerson),day=Number(b.dataset.shiftWeekDate);if(person>=0&&person<staff.length&&day>=1&&day<=31)openCellModal(person,day)
});const oldShow=window.showView;if(typeof oldShow==='function')window.showView=function(view){if(view==='month')shiftWeekStart=weekAnchor(selectedDay);return oldShow.apply(this,arguments)};
const oldSet=window.setSelectedDay;if(typeof oldSet==='function')window.setSelectedDay=function(day){if(document.getElementById('monthView')?.classList.contains('active'))shiftWeekStart=weekAnchor(day);return oldSet.apply(this,arguments)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('monthView')?.classList.contains('active'))v6515RenderMobileMonth()},{once:true});else if(document.getElementById('monthView')?.classList.contains('active'))v6515RenderMobileMonth()}