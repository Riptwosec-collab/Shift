/* Shift v6.5.15 — mobile-native Month and Oncall views, no roster data mutation. */
export function v6515OncallRanges(schedule,month){
  if(!Array.isArray(schedule))return [];
  return schedule.filter(row=>row&&Number(row.month)===Number(month))
    .map(row=>({month:Number(row.month),name:String(row.name),start:Number(row.start),end:Number(row.end)}))
    .sort((a,b)=>a.start-b.start||a.end-b.end);
}
export function v6515TodayForLegacy(date=new Date()){
  return date instanceof Date&&!Number.isNaN(date.getTime())&&date.getFullYear()===2026&&date.getMonth()===9?date.getDate():null;
}
export function v6515LocalDateKey(date=new Date()){
  return date instanceof Date&&!Number.isNaN(date.getTime())?
    [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'):'';
}
function v6515Escape(value){
  return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function v6515IsMobile(){return typeof window!=='undefined'&&!!window.matchMedia?.('(max-width:860px)').matches}
function v6515OncallCard(month,now){
  const ranges=v6515OncallRanges(ONCALL_SCHEDULE,month);
  const names=typeof ONCALL_ENGINEERS!=='undefined'?ONCALL_ENGINEERS:[];
  const active=now.getFullYear()===2026&&now.getMonth()+1===month;
  const nextRows=getNextOncallAssignments(now);
  const locale=typeof v652Locale==='function'?v652Locale():'th';
  const title=typeof v652MonthName==='function'?v652MonthName(month):String(month);
  const chosen=Number(v652Month)===month?Number(v655SelectedDay):0;
  const selectedMonth=Number(v652Month)===month;
  const cards=ranges.map(row=>{
    const live=active&&now.getDate()>=row.start&&now.getDate()<=row.end;
    const next=nextRows.some(r=>r.month===month&&r.start===row.start&&r.end===row.end&&r.name===row.name);
    const selected=selectedMonth&&chosen>=row.start&&chosen<=row.end;
    const state=live?(locale==='th'?'กำลังเข้าเวร':'ON CALL'):next?(locale==='th'?'เวรถัดไป':'NEXT'):(locale==='th'?'ตามตาราง':'SCHEDULED');
    return `<button type="button" class="v6515-oncall-row ${live?'live':''} ${next?'next':''} ${selected?'selected':''}" data-v659-month="${month}" data-v659-day="${row.start}" aria-label="${v6515Escape(row.name)} ${row.start}-${row.end} ${v6515Escape(title)}"><span><b>${v6515Escape(row.name)}</b><small>${state}</small></span><em>${row.start}–${row.end}</em></button>`;
  }).join('');
  const covered=new Set(ranges.map(r=>r.name));
  const idle=names.filter(name=>!covered.has(name)).map(name=>`<div class="v6515-oncall-row"><span><b>${v6515Escape(name)}</b><small>${locale==='th'?'ไม่มีเวรเดือนนี้':'No duty this month'}</small></span><em>—</em></div>`).join('');
  return `<section class="v6515-oncall-month ${active?'current':''}" data-v6515-month="${month}"><header class="v6515-oncall-title"><strong>${v6515Escape(title)} 2026</strong><small>${ranges.length} ${locale==='th'?'ช่วงเวร':'rotations'}</small></header><div class="v6515-oncall-rows">${cards}${idle}</div></section>`;
}
function v6515MobileOncall(now,{single=false}={}){
  const months=single?[Number(v652Month)]:[10,11,12];
  const locale=typeof v652Locale==='function'?v652Locale():'th';
  const current=getOncallAssignmentsForDate(now);
  const next=getNextOncallAssignments(now);
  const nameText=rows=>rows.length?rows.map(r=>v6515Escape(r.name)).join(', '):'—';
  const status=`<div class="v6515-now"><span>${locale==='th'?'วันนี้':'Today'}: ${nameText(current)}</span><span>${locale==='th'?'เวรถัดไป':'Next'}: ${nameText(next)}</span></div>`;
  return `<div class="v6515-oncall v6515-mobile-oncall">${status}${months.map(m=>v6515OncallCard(m,now)).join('')}</div>`;
}
function v6515MonthDay(day){
  const date=new Date(2026,9,day);
  const locale=typeof v652Locale==='function'?v652Locale():'th';
  const weekday=(locale==='th'?['อา','จ','อ','พ','พฤ','ศ','ส']:['Su','Mo','Tu','We','Th','Fr','Sa'])[date.getDay()];
  const selected=Number(selectedDay)===day;
  const today=v6515TodayForLegacy()===day;
  const dayCount=crew(day,'D').length,nightCount=crew(day,'N').length,count=dayCount+nightCount;
  return `<button type="button" data-v6515-day="${day}" class="${selected?'active':''} ${today?'today':''}" aria-pressed="${selected?'true':'false'}" aria-label="${day} ${locale==='th'?'ตุลาคม':'October'} ${count} ${locale==='th'?'คนเข้าเวร':'working'}"><small>${weekday}</small><b>${day}</b><span class="v6516-counts"><em class="day">D${dayCount}</em><em class="night">N${nightCount}</em></span></button>`;
}
function v6515RenderMobileMonth(){
  if(!v6515IsMobile())return;
  const view=document.getElementById('monthView');
  const panel=view?.querySelector('.month-panel');
  if(!panel||typeof crew!=='function'||typeof staff==='undefined'||typeof selectedDay==='undefined')return;
  let host=document.getElementById('v6515MobileMonth');
  if(!host){host=document.createElement('section');host.id='v6515MobileMonth';host.className='v6515-mobile-month';panel.appendChild(host)}
  const locale=typeof v652Locale==='function'?v652Locale():'th';
  const th=locale==='th',day=Number(selectedDay);
  const groups=[['D',th?'กะกลางวัน':'Day shift','day'],['N',th?'กะกลางคืน':'Night shift','night'],['O',th?'วันหยุด':'Off','off']];
  const members=groups.map(([code,title,cls])=>{
    const names=crew(day,code);
    const chips=names.map(item=>`<span class="v6515-person">${v6515Escape(item.p.name)}</span>`).join('');
    return `<section class="v6515-shift-group ${cls}"><div class="v6515-shift-head"><b>${title}</b><span>${names.length} ${th?'คน':'people'}</span></div><div class="v6515-people">${chips||'—'}</div></section>`;
  }).join('');
  host.innerHTML=`<div class="v6515-month-title"><strong>${th?'ตุลาคม':'October'} 2026</strong><small>${th?'เลือกวันที่เพื่อดูผู้เข้าเวร':'Choose a day to see the roster'}</small></div><div class="v6515-month-days">${Array.from({length:31},(_,i)=>v6515MonthDay(i+1)).join('')}</div><div class="v6515-month-detail"><div class="v6515-month-title"><strong>${day} ${th?'ตุลาคม':'October'}</strong><small>${th?'ตารางเวรจริง':'Roster'}</small></div>${members}</div>`;
  document.documentElement.dataset.v6515NativeMonth='1';
}
function v6515Init(){
  if(document.documentElement.dataset.v6515Ready==='1')return;
  document.documentElement.dataset.v6515Ready='1';
  document.documentElement.dataset.appVersion='6.5.15';
  const prevShow=window.showView;
  if(typeof prevShow==='function'){
    window.showView=function(name){
      const result=prevShow.apply(this,arguments);
      if(name==='month')v6515RenderMobileMonth();
      return result;
    };
  }
  const prevSet=window.setSelectedDay;
  if(typeof prevSet==='function'){
    window.setSelectedDay=function(day){
      const result=prevSet.apply(this,arguments);
      if(document.getElementById('monthView')?.classList.contains('active'))v6515RenderMobileMonth();
      return result;
    };
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-v6515-day]');
    if(!button)return;
    const day=Number(button.dataset.v6515Day);
    if(Number.isInteger(day)&&day>=1&&day<=31){
      if(typeof window.setSelectedDay==='function')window.setSelectedDay(day,false);
      else{selectedDay=day;v6515RenderMobileMonth()}
    }
  });
  const refresh=()=>{
    if(document.hidden)return;
    if(document.getElementById('monthView')?.classList.contains('active'))v6515RenderMobileMonth();
  };
  document.addEventListener('visibilitychange',refresh);
  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
  window.addEventListener('resize',()=>{
    if(v6515IsMobile()&&document.getElementById('monthView')?.classList.contains('active'))v6515RenderMobileMonth();
  },{passive:true});
  if(document.getElementById('monthView')?.classList.contains('active'))v6515RenderMobileMonth();
}
if(typeof document!=='undefined'){
  // Desktop retains the exact legacy renderers; mobile receives compact native cards.
  const v6515DesktopMatrix=v652Matrix;
  const v6515DesktopOverview=v652Overview;
  const v6515DesktopTimeline=v652Timeline;
  v652Matrix=function(now){
    if(!v6515IsMobile())return v6515DesktopMatrix(now);
    return v6515MobileOncall(now)+v655RenderSelectedDay(now);
  };
  v652Overview=function(now){
    if(!v6515IsMobile())return v6515DesktopOverview(now);
    return v6515MobileOncall(now,{single:true})+v655RenderSelectedDay(now);
  };
  v652Timeline=function(now){
    if(!v6515IsMobile())return v6515DesktopTimeline(now);
    return v6515MobileOncall(now,{single:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v6515Init,{once:true});
  else v6515Init();
}
