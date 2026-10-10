/* v6.5.26 — replaces ONLY the Overview's legacy 31-day matrix with today + 7 days.
   Full Month screen remains backed by the unchanged 31-day heatmap. */
function shiftOverview8Window(now=new Date()){
 const actual=now.getFullYear()===2026&&now.getMonth()===9;
 const first=actual?now.getDate():Math.max(1,Math.min(31,Number(selectedDay)||1));
 const slots=Array.from({length:8},(_,index)=>{
  const date=new Date(2026,9,first+index);
  return {date,day:date.getDate(),available:date.getFullYear()===2026&&date.getMonth()===9};
 });
 return {first,slots,actual};
}
const shiftLegacyOverviewMatrix=renderOverviewMatrix;
renderOverviewMatrix=function shiftRenderEightDayMatrix(){
 const host=document.getElementById('overviewMonthMatrix');
 if(!host||!Array.isArray(staff))return;
 const {first,slots,actual}=shiftOverview8Window();
 const english=typeof v6517Language==='function'&&v6517Language()==='en',locale=english?'en-US':'th-TH';
 const rangeEnd=slots[7].date,fullYear=english?'2026':'2569';
 const endMonth=rangeEnd.getMonth()===9?(english?'Oct':'ต.ค.'):(english?'Nov':'พ.ย.');
 const textRange=english?`Oct ${first} – ${rangeEnd.getDate()} ${endMonth} ${fullYear}`:`${first} ต.ค. – ${rangeEnd.getDate()} ${endMonth} ${fullYear}`;
 const context=host.closest('.month-snapshot');
 if(context){
  const heading=context.querySelector('.timeline-head');
  if(heading){
   const eyebrow=heading.querySelector('.eyebrow'),title=heading.querySelector('.section-title');
   if(eyebrow)eyebrow.textContent='8-DAY MATRIX / OVERVIEW';
   if(title)title.textContent=english?'Today + next 7 days':'วันนี้และ 7 วันถัดไป';
   let period=heading.querySelector('.shift-eight-period');
   if(!period){period=document.createElement('div');period.className='shift-eight-period';title?.parentElement?.appendChild(period);}
   if(period)period.textContent=textRange;
  }
 }
 const key=`${first}/${english?'en':'th'}`;
 if(host.dataset.shiftEightKey!==key||host.dataset.shiftEightReady!=='1'){
  const daysHeader=slots.map((slot,index)=>{
   const wd=slot.date.toLocaleDateString(locale,{weekday:'short'}).replace('.','');
   return slot.available?
    `<button type="button" class="matrix-day-head${index===0&&actual?' today':''}${selectedDay===slot.day?' selected':''}" data-shift-eight-day="${slot.day}" data-day="${slot.day}" aria-label="${slot.day} ${english?'October':'ตุลาคม'}"><small>${wd}</small><b>${slot.day}</b></button>`:
    `<span class="matrix-day-head shift-eight-unavailable" aria-label="${english?'No roster available':'ยังไม่มีข้อมูลเวร'}"><small>${wd}</small><b>${slot.day}</b></span>`;
  }).join('');
  const rows=staff.map((p,pi)=>`<div class="matrix-row"><div class="matrix-name" title="${v6517Esc(p.name)}">${v6517Esc(p.name)}</div>${slots.map(slot=>{
   if(!slot.available)return `<span class="shift-eight-empty" aria-label="${english?'Future month roster unavailable':'ยังไม่มีตารางเวรเดือนถัดไป'}">–</span>`;
   const code=statusAt(pi,slot.day);
   return `<button type="button" class="matrix-cell ${code}${selectedDay===slot.day?' selected':''}" data-i="${pi}" data-day="${slot.day}" aria-label="${v6517Esc(p.name)} ${slot.day} ${v6517Esc(label(code))}" title="${v6517Esc(p.name)} • ${slot.day} • ${code==='O'?'OFF':code}">${code==='O'?'OFF':code}</button>`;
  }).join('')}</div>`).join('');
  host.innerHTML=`<div class="matrix-row matrix-header shift-eight-header"><div class="matrix-name">${english?'Employee':'ชื่อพนักงาน'}</div>${daysHeader}</div>${rows}`;
  host.classList.add('shift-eight-matrix');
  host.dataset.shiftEightKey=key;
  host.dataset.shiftEightReady='1';
  if(host.dataset.shiftEightBound!=='1'){
   host.addEventListener('click',e=>{
    const control=e.target.closest?.('[data-shift-eight-day]');
    if(control&&host.contains(control)){setSelectedDay(Number(control.dataset.shiftEightDay),false);return;}
    const cell=e.target.closest?.('.matrix-cell[data-i][data-day]');
    if(cell&&host.contains(cell)&&host.dataset.matrixHandlerBound!=='1')
     openCellModal(Number(cell.dataset.i),Number(cell.dataset.day));
   });
   host.dataset.shiftEightBound='1';
  }
  host.dataset.shiftEightSelected=String(selectedDay);
 }else if(host.dataset.shiftEightSelected!==String(selectedDay)){
  host.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));
  host.querySelectorAll('[data-day="'+selectedDay+'"]').forEach(el=>el.classList.add('selected'));
  host.dataset.shiftEightSelected=String(selectedDay);
 }
 if(context){
  let footer=context.querySelector('.shift-eight-footer');
  if(!footer){
   footer=document.createElement('div');
   footer.className='shift-eight-footer';
   footer.innerHTML='<div class="shift-eight-legend"><span class="D"><i></i>DAY • D</span><span class="N"><i></i>NIGHT • N</span><span class="O"><i></i>OFF • พัก</span></div><button type="button" class="shift-eight-full">ดูเต็ม • ตารางรายเดือน <b aria-hidden="true">→</b></button>';
   footer.querySelector('button').addEventListener('click',()=>showView('month'));
   context.appendChild(footer);
  }
  const open=footer.querySelector('button');
  if(open){
   open.firstChild.textContent=english?'View full month ':'ดูเต็ม • ตารางรายเดือน ';
  }
  let note=context.querySelector('.shift-eight-outside');
  const missing=slots.some(s=>!s.available);
  if(missing){
   if(!note){note=document.createElement('p');note.className='shift-eight-outside';context.appendChild(note);}
   note.textContent=english?'November roster has not been loaded.':'วันที่เดือน พ.ย. ยังไม่มีข้อมูลตารางเวร';
  }else if(note)note.remove();
 }
};
if(typeof document!=='undefined'){
 if(document.getElementById('overviewMonthMatrix'))renderOverviewMatrix();
 document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&document.getElementById('overviewView')?.classList.contains('active'))
   renderOverviewMatrix();
 });
}
