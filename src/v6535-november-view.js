/* v6.5.35 — November 2569: independent read-only monthly view.
   October's existing 31-day panels remain untouched. */
const SHIFT_NOV_DAYS=30;
let shiftNovSelectedDay=1,shiftNovWeekStart=1,shiftMonthDisplay='10';
function shiftNovEscape(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function shiftNovRole(person,day){return NOVEMBER_2026_DUTY_POSITIONS[person]?.[day-1]||'H';}
function shiftNovType(role){return role==='H'?'O':role[0];}
function shiftNovIssues(day){
 const found=NOVEMBER_2026_DUTY_POSITIONS.map(row=>row[day-1]).filter(x=>x!=='H');
 const repeated=[...new Set(found.filter((role,i)=>found.indexOf(role)!==i))];
 const missing=['D1','D2','N1','N2'].filter(role=>!found.includes(role));
 return {repeated,missing};
}
function shiftNovDateTitle(day){return day+' พฤศจิกายน 2569';}
function shiftNovRenderGrid(){
 const host=document.querySelector('#shiftNovemberView .shift-nov-scroll');
 if(!host||!Array.isArray(staff)||staff.length!==10)return;
 const days=Array.from({length:SHIFT_NOV_DAYS},(_,i)=>i+1);
 const heads=days.map(day=>{
  const date=new Date(2026,10,day),isWeekend=[0,6].includes(date.getDay());
  const weekday=date.toLocaleDateString('th-TH',{weekday:'short'}).replace('.','');
  return '<th scope="col" class="shift-nov-day-head'+(isWeekend?' weekend':'')+'" data-shift-nov-date="'+day+'"><button type="button" data-shift-nov-date="'+day+'" title="'+shiftNovDateTitle(day)+'"><small>'+weekday+'</small><b>'+day+'</b></button></th>';
 }).join('');
 const rows=staff.map((person,i)=>'<tr><th class="shift-nov-name" scope="row" title="'+shiftNovEscape(person.name)+'">'+shiftNovEscape(person.name)+'</th>'+
  days.map(day=>{
   const role=shiftNovRole(i,day),flag=day===30&&role==='N1';
   const name=shiftNovEscape(person.name),desc=role==='H'?'หยุด':role+' ตำแหน่งเวร';
   return '<td class="shift-nov-slot '+shiftNovType(role)+(flag?' discrepancy':'')+'" data-shift-nov-date="'+day+'"><button type="button" data-shift-nov-person="'+i+'" data-shift-nov-date="'+day+'" title="'+name+' • '+day+' พ.ย. • '+desc+'" aria-label="'+name+' วันที่ '+day+' พฤศจิกายน 2569 '+desc+'">'+role+'</button></td>';
  }).join('')+'</tr>').join('');
 const tally=days.map(day=>{const roles=NOVEMBER_2026_DUTY_POSITIONS.map(row=>row[day-1]);return '<td>' +roles.filter(x=>x[0]==='D').length+'/'+roles.filter(x=>x[0]==='N').length+'</td>'}).join('');
 host.innerHTML='<table class="shift-nov-table" aria-label="ตารางเวรพฤศจิกายน 2569 ทุกคน 30 วัน"><thead><tr><th class="shift-nov-name" scope="col">ชื่อพนักงาน</th>'+heads+'</tr></thead><tbody>'+rows+'</tbody><tfoot><tr><th class="shift-nov-name" scope="row">D/N ต่อวัน</th>'+tally+'</tr></tfoot></table>';
 shiftNovMarkDay();
}
function shiftNovMarkDay(){
 const host=document.getElementById('shiftNovemberView');
 if(!host)return;
 host.querySelectorAll('.shift-nov-selected').forEach(el=>el.classList.remove('shift-nov-selected'));
 host.querySelectorAll('[data-shift-nov-date="'+shiftNovSelectedDay+'"]').forEach(el=>el.classList.add('shift-nov-selected'));
}
function shiftNovWeekMarkup(){
 const dates=Array.from({length:7},(_,i)=>shiftNovWeekStart+i).filter(day=>day<=SHIFT_NOV_DAYS);
 const header=dates.map(day=>'<span class="shift-nov-week-date'+(day===shiftNovSelectedDay?' active':'')+'">'+day+'</span>').join('');
 const rows=staff.map((person,i)=>'<div class="shift-nov-week-row"><span title="'+shiftNovEscape(person.name)+'">'+shiftNovEscape(person.name)+'</span>'+
 dates.map(day=>{const role=shiftNovRole(i,day);return '<button type="button" data-shift-nov-person="'+i+'" data-shift-nov-date="'+day+'" class="shift-nov-mini '+shiftNovType(role)+'" aria-label="'+shiftNovEscape(person.name)+' '+day+' พฤศจิกายน '+role+'">'+role+'</button>';}).join('')+'</div>').join('');
 return '<div class="shift-nov-week-title"><b>ตารางเวร 7 วัน</b><span><button type="button" data-shift-nov-step="-7"'+(shiftNovWeekStart===1?' disabled':'')+'>‹ ก่อนหน้า</button><small>'+shiftNovWeekStart+'–'+dates[dates.length-1]+' พ.ย.</small><button type="button" data-shift-nov-step="7"'+(shiftNovWeekStart>=24?' disabled':'')+'>ถัดไป ›</button></span></div>'+
 '<div class="shift-nov-week-row shift-nov-week-head"><span>พนักงาน</span>'+header+'</div>'+rows;
}
function shiftNovRenderDetails(personIndex=null){
 const panel=document.getElementById('shiftNovemberView');
 if(!panel)return;
 const d=shiftNovSelectedDay;
 const roles=NOVEMBER_2026_DUTY_POSITIONS.map((r,i)=>({i,role:r[d-1],name:staff[i].name}));
 const dayWorkers=roles.filter(x=>x.role.startsWith('D')),nightWorkers=roles.filter(x=>x.role.startsWith('N')),off=roles.filter(x=>x.role==='H');
 const issue=shiftNovIssues(d);
 const alert=issue.repeated.length||issue.missing.length;
 const warning=alert?'<p class="shift-nov-alert" role="alert">ภาพต้นฉบับวันที่ '+d+' พ.ย. มี '+(issue.repeated.length?'ตำแหน่ง '+issue.repeated.join(', ')+' ซ้ำ':'')+(issue.repeated.length&&issue.missing.length?' และ ':'')+(issue.missing.length?'ไม่พบ '+issue.missing.join(', '):'')+' • แสดงตามภาพโดยไม่แก้ไขอัตโนมัติ</p>':'';
 const renderList=(entries,title,kind)=>'<section class="shift-nov-crew '+kind+'"><h4>'+title+' <small>'+entries.length+' คน</small></h4><div>'+entries.map(x=>'<button type="button" class="shift-nov-crew-person'+(x.i===personIndex?' highlighted':'')+'" data-shift-nov-person="'+x.i+'" data-shift-nov-date="'+d+'"><b>'+x.role+'</b><span>'+shiftNovEscape(x.name)+'</span></button>').join('')+'</div></section>';
 panel.querySelector('.shift-nov-summary').innerHTML='<div class="shift-nov-selected-date"><button data-shift-nov-adjacent="-1"'+(d===1?' disabled':'')+'>‹</button><div><b>'+d+' พฤศจิกายน 2569</b><small>รายชื่อพนักงานและตำแหน่งเวรจริงในวันนี้</small></div><button data-shift-nov-adjacent="1"'+(d===30?' disabled':'')+'>›</button></div>'+
 warning+'<div class="shift-nov-crews">'+renderList(dayWorkers,'DAY • D1–D4','D')+renderList(nightWorkers,'NIGHT • N1–N2','N')+renderList(off,'H • วันหยุด','O')+'</div>';
 panel.querySelector('.shift-nov-week').innerHTML=shiftNovWeekMarkup();
 shiftNovMarkDay();
}
function shiftNovSetDay(day,personIndex=null){
 if(!Number.isInteger(day)||day<1||day>SHIFT_NOV_DAYS)return;
 shiftNovSelectedDay=day;
 if(day<shiftNovWeekStart||day>=shiftNovWeekStart+7)shiftNovWeekStart=Math.floor((day-1)/7)*7+1;
 shiftNovRenderDetails(personIndex);
}
function shiftNovChangeMonth(month){
 if(month!=='10'&&month!=='11')return;
 shiftMonthDisplay=month;
 const panel=document.querySelector('#monthView .month-panel');
 if(panel)panel.dataset.shiftMonth=month;
 document.querySelectorAll('#shiftMonthTabs [data-shift-month]').forEach(button=>{
  const active=button.dataset.shiftMonth===month;
  button.setAttribute('aria-selected',String(active));
  button.classList.toggle('active',active);
 });
 const nov=document.getElementById('shiftNovemberView');
 if(nov)nov.hidden=month!=='11';
 try{localStorage.setItem('shift-month-view-2026',month)}catch{}
 if(month==='11'){shiftNovMarkDay();shiftNovRenderDetails();}
}
function shiftNovInit(){
 const panel=document.querySelector('#monthView .month-panel');
 if(!panel||typeof NOVEMBER_2026_DUTY_POSITIONS==='undefined'||!Array.isArray(staff))return;
 if(staff.length!==NOVEMBER_2026_DUTY_POSITIONS.length)return;
 if(document.getElementById('shiftMonthTabs'))return;
 const tabs=document.createElement('div');tabs.id='shiftMonthTabs';tabs.className='shift-month-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','เลือกเดือนของตารางเวร');
 tabs.innerHTML='<button type="button" role="tab" data-shift-month="10" aria-controls="heatmapTable">ตุลาคม 2569</button><button type="button" role="tab" data-shift-month="11" aria-controls="shiftNovemberView">พฤศจิกายน 2569</button>';
 panel.prepend(tabs);
 const view=document.createElement('section');view.id='shiftNovemberView';view.className='shift-november-panel';view.hidden=true;
 view.innerHTML='<div class="shift-nov-title"><div><div class="eyebrow">MONTHLY HEATMAP • NOVEMBER 2026</div><h2>ตารางเวรทั้งทีม • พฤศจิกายน 2569</h2><p>10 พนักงาน • 30 วัน • D1–D4 / N1–N2 / H (หยุด)</p></div><span class="shift-nov-tag">ข้อมูลจากภาพตารางเวร</span></div>'+
 '<p class="shift-nov-source-warning">หมายเหตุข้อมูลต้นฉบับ: วันที่ 30 พ.ย. ระบุ N1 ซ้ำสองคนและไม่พบ N2 — แสดงตามภาพ โปรดยืนยันก่อนใช้จัดงานจริง</p>'+
 '<div class="shift-nov-week" aria-label="ตัวอย่างตารางเวร 7 วันบนมือถือ"></div>'+
 '<p class="shift-nov-scroll-help">เลื่อนตารางในแนวนอนเพื่อดูวันที่ 1–30 ทั้งเดือน • แตะช่องเพื่อดูว่าใครรับตำแหน่งใด</p>'+
 '<div class="shift-nov-scroll" role="region" tabindex="0" aria-label="ตารางเวรพฤศจิกายน เลื่อนแนวนอนได้"></div>'+
 '<div class="shift-nov-summary" aria-live="polite"></div>';
 panel.appendChild(view);
 shiftNovRenderGrid();
 let preferred='10';try{preferred=localStorage.getItem('shift-month-view-2026')||((new Date().getFullYear()===2026&&new Date().getMonth()===10)?'11':'10')}catch{}
 shiftNovChangeMonth(preferred==='11'?'11':'10');
 panel.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||!panel.contains(button))return;
  if(button.hasAttribute('data-shift-month')){shiftNovChangeMonth(button.dataset.shiftMonth);return;}
  if(shiftMonthDisplay!=='11')return;
  if(button.hasAttribute('data-shift-nov-step')){shiftNovWeekStart=Math.min(24,Math.max(1,shiftNovWeekStart+Number(button.dataset.shiftNovStep)));shiftNovRenderDetails();return;}
  if(button.hasAttribute('data-shift-nov-adjacent')){shiftNovSetDay(shiftNovSelectedDay+Number(button.dataset.shiftNovAdjacent));return;}
  if(button.hasAttribute('data-shift-nov-date')){
   const person=button.hasAttribute('data-shift-nov-person')?Number(button.dataset.shiftNovPerson):null;
   shiftNovSetDay(Number(button.dataset.shiftNovDate),person);
  }
 });
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shiftNovInit,{once:true});
 else shiftNovInit();
}
