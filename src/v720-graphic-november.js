/* Shift V7.2 — graphical November roster, built from live in-memory duty data.
   Additive only. Retain the original spreadsheet and all legacy event handlers. */
const SHIFT_72_WEEK_STARTS=[1,8,15,22,24];
const SHIFT_72_ROLES=['D1','D2','D3','D4','N1','N2'];
const SHIFT_72_WEEKDAYS=['อา','จ','อ','พ','พฤ','ศ','ส'];
let shift72Mode='graphic';
let shift72Span='month';
let shift72Week=1;
let shift72FocusPerson=null;
let shift72DisplayFilter='ALL';
let shift72LastWidth=null;
const shift72Escape=value=>String(value??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const shift72Rows=()=>NOVEMBER_2026_DUTY_POSITIONS;
const shift72Name=i=>SHIFT_NOV_SHEET_NICKNAMES[i]||staff[i]?.name?.replace(/^นาย\s*/,'').split(' ')[0]||'—';
function shift72DayModel(day){
 if(!Number.isInteger(day)||day<1||day>30)throw new RangeError('November 2026 duty day out of range');
 const people=shift72Rows().map((row,i)=>({index:i,code:row[day-1],name:staff[i].name,nick:shift72Name(i)}));
 const counts={D:people.filter(p=>p.code[0]==='D').length,
  N:people.filter(p=>p.code[0]==='N').length,
  H:people.filter(p=>p.code==='H').length};
 const posts=SHIFT_72_ROLES.map(code=>({code,people:people.filter(p=>p.code===code)}));
 const duplicate=posts.filter(p=>p.people.length>1).map(p=>p.code);
 const missing=posts.filter(p=>p.people.length===0).map(p=>p.code);
 return {day,people,counts,posts,duplicate,missing};
}
function shift72Totals(){
 return shift72Rows().reduce((acc,row)=>{
  row.forEach(code=>{acc[code[0]]=(acc[code[0]]||0)+1;});
  return acc;
 },{D:0,N:0,H:0});
}
function shift72WeekFor(day){
 return day>=24?24:Math.floor((day-1)/7)*7+1;
}
function shift72PeriodDays(){
 return shift72Span==='month'?Array.from({length:30},(_,i)=>i+1):
  Array.from({length:7},(_,i)=>shift72Week+i).filter(day=>day<=30);
}
function shift72DateChip(day){
 const weekday=SHIFT_72_WEEKDAYS[new Date(2026,10,day).getDay()];
 const highlight=day===shiftNovSelectedDay;
 return '<button type="button" class="shift72-date-chip'+(highlight?' is-active':'')+'" data-shift72-day="'+day+
  '" aria-pressed="'+String(highlight)+'" aria-label="'+day+' พฤศจิกายน 2569"><span>'+weekday+'</span><b>'+day+'</b></button>';
}
function shift72TrendMarkup(){
 const points=Array.from({length:30},(_,i)=>shift72DayModel(i+1));
 const scale=x=>20+(x-1)*(680/29);
 const y=(value,index)=>index===0?94-value*13:141-value*13;
 const path=kind=>points.map((p,i)=>(i?'L':'M')+scale(p.day).toFixed(1)+','+y(p.counts[kind],kind==='D'?0:1).toFixed(1)).join(' ');
 const area=kind=>path(kind)+' L700,155 L20,155 Z';
 return '<svg class="shift72-trend-svg" viewBox="0 0 720 165" preserveAspectRatio="none" role="img" aria-label="กราฟจำนวนคนเข้าเวรกลางวันและกลางคืนทุกวันในพฤศจิกายน">'+
 '<defs><linearGradient id="shift72TrendDayFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#36e2b5" stop-opacity=".22"/><stop offset="1" stop-color="#36e2b5" stop-opacity="0"/></linearGradient>'+
 '<linearGradient id="shift72TrendNightFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#6a9fff" stop-opacity=".19"/><stop offset="1" stop-color="#6a9fff" stop-opacity="0"/></linearGradient></defs>'+
 '<path d="M20 40 H700 M20 78 H700 M20 116 H700 M20 154 H700" stroke="#5caad3" stroke-opacity=".13" fill="none"/>'+
 '<path d="'+area('D')+'" fill="url(#shift72TrendDayFill)"/><path d="'+area('N')+'" fill="url(#shift72TrendNightFill)"/>'+
 '<path d="'+path('D')+'" fill="none" stroke="#42e2b8" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'+
 '<path d="'+path('N')+'" fill="none" stroke="#7aaaff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'+
 points.filter(p=>p.day===shiftNovSelectedDay).map(p=>
 '<circle cx="'+scale(p.day)+'" cy="'+y(p.counts.D,0)+'" r="5" fill="#3fe5ba" stroke="#091c2b" stroke-width="3"/>'+
 '<circle cx="'+scale(p.day)+'" cy="'+y(p.counts.N,1)+'" r="5" fill="#7baaff" stroke="#091c2b" stroke-width="3"/>').join('')+
 '</svg>';
}
function shift72SummaryMarkup(){
 const model=shift72DayModel(shiftNovSelectedDay),today=shiftV7BangkokToday();
 const isToday=today.year===2026&&today.month===11&&today.day===model.day;
 const anomalous=model.duplicate.length||model.missing.some(x=>x==='N1'||x==='N2');
 const status=anomalous?'รอการตรวจสอบข้อมูลต้นฉบับ':isToday?'วันที่ปัจจุบัน':'ข้อมูลตารางเวรที่บันทึกไว้';
 return '<div class="shift72-command">'+
 '<div class="shift72-command-copy"><div class="shift72-eyebrow">NOVEMBER 2026 <span>•</span> TEAM OPERATIONS</div>'+
 '<h3>กราฟิกตารางเวร <em>พฤศจิกายน 2569</em></h3>'+
 '<p>เลือกวันหรือช่องเวรเพื่อดูชื่อและตำแหน่งจริง · กราฟิกทั้งหมดสร้างจากข้อมูล ไม่ใช่ภาพ</p></div>'+
 '<div class="shift72-control-group"><button type="button" data-shift72-action="prev" aria-label="วันก่อนหน้า"'+(model.day===1?' disabled':'')+'>‹</button>'+
 '<strong class="shift72-current-day">'+String(model.day).padStart(2,'0')+' <span>NOV</span></strong>'+
 '<button type="button" data-shift72-action="next" aria-label="วันถัดไป"'+(model.day===30?' disabled':'')+'>›</button>'+
 '<button type="button" data-shift72-action="today" class="shift72-today">วันนี้</button></div></div>'+
 '<div class="shift72-overview-cards">'+
 '<div class="shift72-overview-card shift72-d"><div><span>DAY CREW</span><b>เวรกลางวัน</b></div><strong>'+model.counts.D+'<small>/ 10</small></strong><div class="shift72-mini-bar"><i style="width:'+model.counts.D*10+'%"></i></div></div>'+
 '<div class="shift72-overview-card shift72-n"><div><span>NIGHT CREW</span><b>เวรกลางคืน</b></div><strong>'+model.counts.N+'<small>/ 10</small></strong><div class="shift72-mini-bar"><i style="width:'+model.counts.N*10+'%"></i></div></div>'+
 '<div class="shift72-overview-card shift72-h"><div><span>REST CREW</span><b>วันหยุด</b></div><strong>'+model.counts.H+'<small>/ 10</small></strong><div class="shift72-mini-bar"><i style="width:'+model.counts.H*10+'%"></i></div></div>'+
 '<div class="shift72-overview-card shift72-coverage"><div><span>POSITIONS</span><b>ตำแหน่งเวร</b></div><strong>'+model.posts.filter(x=>x.people.length===1).length+'<small>/ 6</small></strong><div class="shift72-mini-bar"><i style="width:'+model.posts.filter(x=>x.people.length===1).length/6*100+'%"></i></div></div>'+
 '</div>'+
 '<div class="shift72-status-line" data-warning="'+String(Boolean(anomalous))+'"><span class="shift72-status-led"></span><span>'+
 shift72Escape(status)+(anomalous?' • '+shift72Escape(model.duplicate.concat(model.missing).join(' / ')):'')+'</span></div>';
}
function shift72CrewMarkup(){
 const model=shift72DayModel(shiftNovSelectedDay);
 const cards=model.posts.map((post,i)=>{
  const empty=post.people.length===0,warning=empty||post.people.length>1;
  const role=post.code;
  const members=post.people.map(p=>'<span title="'+shift72Escape(p.name)+'">'+shift72Escape(p.name)+'</span>').join('')||'<span>ยังไม่พบผู้รับตำแหน่ง</span>';
  return '<article class="shift72-position-card '+(role[0]==='D'?'shift72-d':'shift72-n')+(warning?' has-warning':'')+'" style="--shift72-index:'+i+'">'+
  '<div class="shift72-position-top"><span class="shift72-position-code">'+role+'</span><span class="shift72-position-indicator">'+(warning?'ตรวจสอบ':role[0]==='D'?'DAY':'NIGHT')+'</span></div>'+
  '<div class="shift72-position-names">'+members+'</div>'+
  '<div class="shift72-position-footer"><span>'+(post.people.length>1?'ข้อมูลซ้ำ '+post.people.length+' คน':empty?'ไม่มีผู้รับตำแหน่ง':'ผู้รับผิดชอบ '+post.people.length+' คน')+'</span>'+
  '<span aria-hidden="true">'+(role[0]==='D'?'08:30–20:30':'20:30–08:30')+'</span></div></article>';
 }).join('');
 return '<section class="shift72-crew-section"><div class="shift72-section-heading"><div><span class="shift72-eyebrow">DUTY ASSIGNMENTS</span>'+
 '<h4>ตำแหน่งเวรวันที่ '+model.day+' พฤศจิกายน</h4></div><span>DAY D1–D4 <i>•</i> NIGHT N1–N2</span></div>'+
 '<div class="shift72-position-grid">'+cards+'</div></section>';
}
function shift72MatrixMarkup(){
 const days=shift72PeriodDays();
 const heading=days.map(day=>{
  const dow=SHIFT_72_WEEKDAYS[new Date(2026,10,day).getDay()];
  const isWeekend=[0,6].includes(new Date(2026,10,day).getDay());
  return '<th scope="col" class="shift72-date-heading'+(isWeekend?' is-weekend':'')+(day===shiftNovSelectedDay?' is-selected':'')+'">'+shift72DateChip(day)+'</th>';
 }).join('');
 const rows=staff.map((person,index)=>{
  const label=shift72Name(index),isSelected=index===shift72FocusPerson;
  const daysMarkup=days.map(day=>{
   const code=shift72Rows()[index][day-1],isSelectedDay=day===shiftNovSelectedDay;
   const tone=code==='H'?'H':code[0],warning=day===30&&code==='N1';
   const accessible=person.name+' • '+day+' พฤศจิกายน 2569 • '+(code==='H'?'หยุด':code);
   return '<td class="shift72-duty-cell'+(isSelectedDay?' is-today':'')+'" data-shift72-column="'+day+'">'+
   '<button type="button" class="shift72-duty-pill tone-'+tone+(warning?' is-warning':'')+'" data-shift72-person="'+index+'" data-shift72-day="'+day+
   '" aria-pressed="'+String(isSelectedDay&&isSelected)+'" title="'+shift72Escape(accessible)+'" aria-label="'+shift72Escape(accessible)+'">'+code+'</button></td>';
  }).join('');
  return '<tr'+(isSelected?' class="is-person-selected"':'')+'><th class="shift72-person-heading" scope="row"><span class="shift72-avatar">'+
   String(index+1).padStart(2,'0')+'</span><span class="shift72-person-copy"><b>'+shift72Escape(label)+'</b><small>'+shift72Escape(person.name.replace(/^นาย\s*/,''))+'</small></span></th>'+
   daysMarkup+'</tr>';
 }).join('');
 return '<div class="shift72-board-viewport" id="shift72MatrixViewport" tabindex="0" role="region" aria-label="กราฟิกตารางเวรพฤศจิกายน เลื่อนแนวนอนได้">'+
 '<table class="shift72-board-table" style="--shift72-columns:'+days.length+'" aria-label="ตารางตำแหน่งเวร 10 คน เดือนพฤศจิกายน 2569">'+
 '<thead><tr><th class="shift72-person-heading shift72-heading-top" scope="col">พนักงาน / EMPLOYEE</th>'+heading+'</tr></thead>'+
 '<tbody>'+rows+'</tbody></table></div>';
}
function shift72BoardMarkup(){
 const days=shift72PeriodDays();
 const starts=SHIFT_72_WEEK_STARTS;
 const weekIndex=starts.indexOf(shift72Week);
 const prev=weekIndex<=0,next=weekIndex>=starts.length-1;
 return '<section class="shift72-board-section"><div class="shift72-section-heading"><div><span class="shift72-eyebrow">INTERACTIVE CREW MATRIX</span>'+
 '<h4>ตารางเวรทั้งทีม <span>10 คน · 30 วัน</span></h4></div>'+
 '<div class="shift72-board-legend"><span class="shift72-legend-day"><i></i>Day</span><span class="shift72-legend-night"><i></i>Night</span>'+
 '<span class="shift72-legend-off"><i></i>Off</span></div></div>'+
 '<div class="shift72-board-toolbar"><div class="shift72-board-actions">'+
 '<button type="button" data-shift72-action="month" aria-pressed="'+String(shift72Span==='month')+'">30 วัน</button>'+
 '<button type="button" data-shift72-action="week" aria-pressed="'+String(shift72Span==='week')+'">7 วัน</button>'+
 '</div><div class="shift72-week-actions"'+(shift72Span==='month'?' hidden':'')+'>'+
 '<button type="button" data-shift72-action="week-prev"'+(prev?' disabled':'')+'>‹ สัปดาห์ก่อน</button>'+
 '<span>'+days[0]+'–'+days[days.length-1]+' พ.ย.</span>'+
 '<button type="button" data-shift72-action="week-next"'+(next?' disabled':'')+'>สัปดาห์ถัดไป ›</button>'+
 '</div><span class="shift72-scroll-hint">เลื่อนในบอร์ดเพื่อดูทุกวัน <span aria-hidden="true">⇆</span></span></div>'+
 shift72MatrixMarkup()+'</section>';
}
function shift72WorkloadMarkup(){
 const rows=shift72Rows().map((days,i)=>{
  const dayCount=days.filter(x=>x[0]==='D').length;
  const nightCount=days.filter(x=>x[0]==='N').length;
  const offCount=30-dayCount-nightCount;
  return '<div class="shift72-workload-row"><div class="shift72-workload-name" title="'+shift72Escape(staff[i].name)+'">'+shift72Escape(shift72Name(i))+'</div>'+
  '<div class="shift72-workload-bar" role="img" aria-label="'+shift72Escape(staff[i].name)+' กลางวัน '+dayCount+' กลางคืน '+nightCount+' หยุด '+offCount+' วัน">'+
  '<i class="shift72-bar-day" style="width:'+(dayCount/30*100)+'%"></i><i class="shift72-bar-night" style="width:'+(nightCount/30*100)+'%"></i>'+
  '<i class="shift72-bar-off" style="width:'+(offCount/30*100)+'%"></i></div>'+
  '<span class="shift72-workload-total">'+(dayCount+nightCount)+'<small>เวร</small></span></div>';
 }).join('');
 return '<section class="shift72-analytics-section"><div class="shift72-analytics-chart"><div class="shift72-section-heading">'+
 '<div><span class="shift72-eyebrow">SHIFT PULSE / 30 DAYS</span><h4>กราฟความหนาแน่นของเวร</h4></div>'+
 '<div class="shift72-graph-legend"><span>● DAY</span><span>● NIGHT</span></div></div>'+
 shift72TrendMarkup()+'<div class="shift72-chart-axis"><span>01 NOV</span><span>15 NOV</span><span>30 NOV</span></div></div>'+
 '<div class="shift72-analytics-workload"><div class="shift72-section-heading"><div><span class="shift72-eyebrow">TEAM WORKLOAD</span>'+
 '<h4>สัดส่วนเวรทั้งเดือน</h4></div><small>DAY / NIGHT / OFF</small></div>'+
 '<div class="shift72-workload-list">'+rows+'</div></div></section>';
}
function shift72GraphicMarkup(){
 return '<div class="shift72-graphic"><div class="shift72-ambient" aria-hidden="true"></div>'+
 shift72SummaryMarkup()+
 '<div class="shift72-graphic-main">'+shift72CrewMarkup()+shift72BoardMarkup()+shift72WorkloadMarkup()+'</div>'+
 '<footer class="shift72-graphic-footer">แหล่งข้อมูล: ตารางเวรพฤศจิกายน 2569 • ทุกช่องใช้ข้อมูลจริง D1–D4 / N1–N2 / H • พบข้อสงสัยวันที่ 30 พ.ย. โปรดตรวจสอบข้อมูลต้นฉบับ</footer></div>';
}
function shift72ApplyMode(){
 const view=document.getElementById('shiftNovemberView');
 if(!view)return;
 view.dataset.shift72Mode=shift72Mode;
 view.querySelectorAll('[data-shift72-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shift72Mode===shift72Mode)));
}
function shift72RenderGraph(options={}){
 const host=document.getElementById('shift72Graphic');
 if(!host||!Array.isArray(staff)||staff.length!==10)return;
 const currentWeek=shift72WeekFor(shiftNovSelectedDay);
 if(shift72Span==='week'&&(shiftNovSelectedDay<shift72Week||shiftNovSelectedDay>shift72Week+6))shift72Week=currentWeek;
 const oldScroll=host.querySelector('#shift72MatrixViewport')?.scrollLeft||0;
 host.innerHTML=shift72GraphicMarkup();
 if(options.preserveScroll&&shift72Span==='month'){
  const target=host.querySelector('#shift72MatrixViewport');if(target)target.scrollLeft=oldScroll;
 }else if(shift72Span==='month'){
  // Center the selected day without scrolling the full page or hiding the employee column.
  const viewport=host.querySelector('#shift72MatrixViewport');
  const head=viewport?.querySelector('.shift72-date-heading.is-selected');
  if(viewport&&head&&viewport.clientWidth){
   const labelWidth=Math.min(210,viewport.clientWidth*.45);
   viewport.scrollLeft=Math.max(0,head.offsetLeft-labelWidth-60);
  }
 }
}
/* Fast path: keep all 300 source cells and the scroll position mounted.
   Only change the selected date, crew summary and six position cards. */
function shift72UpdateDayFast(){
 const host=document.getElementById('shift72Graphic');
 if(!host||!host.querySelector('.shift72-board-table')){shift72RenderGraph();return;}
 const selected=shiftNovSelectedDay;
 if(shift72Span==='week'&&(selected<shift72Week||selected>shift72Week+6)){
  shift72Week=shift72WeekFor(selected);
  shift72RenderGraph();return;
 }
 const snapshot=shift72DayModel(selected);
 const date=host.querySelector('.shift72-current-day');
 if(date)date.innerHTML=String(selected).padStart(2,'0')+' <span>NOV</span>';
 const prev=host.querySelector('[data-shift72-action="prev"]');
 const next=host.querySelector('[data-shift72-action="next"]');
 if(prev)prev.disabled=selected===1;
 if(next)next.disabled=selected===30;
 const coverage=snapshot.posts.filter(p=>p.people.length===1).length;
 const values=[snapshot.counts.D,snapshot.counts.N,snapshot.counts.H,coverage];
 host.querySelectorAll('.shift72-overview-card').forEach((card,index)=>{
  const strong=card.querySelector('strong');
  if(strong&&strong.firstChild)strong.firstChild.textContent=String(values[index]);
  const bar=card.querySelector('.shift72-mini-bar i');
  if(bar)bar.style.width=(index===3?coverage/6*100:values[index]*10)+'%';
 });
 const status=host.querySelector('.shift72-status-line');
 if(status){
  const anomalous=snapshot.duplicate.length||snapshot.missing.some(code=>code==='N1'||code==='N2');
  status.dataset.warning=String(Boolean(anomalous));
  const text=status.querySelector('span:last-child');
  if(text)text.textContent=(anomalous?'รอการตรวจสอบข้อมูลต้นฉบับ':'ข้อมูลตารางเวรที่บันทึกไว้')+
   (anomalous?' • '+snapshot.duplicate.concat(snapshot.missing).join(' / '):'');
 }
 const currentCrew=host.querySelector('.shift72-crew-section');
 if(currentCrew){
  const template=document.createElement('template');
  template.innerHTML=shift72CrewMarkup();
  const nextCrew=template.content.firstElementChild;
  if(nextCrew)currentCrew.replaceWith(nextCrew);
 }
 host.querySelectorAll('.shift72-date-chip').forEach(button=>{
  const active=Number(button.dataset.shift72Day)===selected;
  button.classList.toggle('is-active',active);
  button.setAttribute('aria-pressed',String(active));
 });
 host.querySelectorAll('.shift72-date-heading').forEach(cell=>{
  cell.classList.toggle('is-selected',Number(cell.querySelector('[data-shift72-day]')?.dataset.shift72Day)===selected);
 });
 host.querySelectorAll('.shift72-duty-cell.is-today').forEach(cell=>cell.classList.remove('is-today'));
 host.querySelectorAll('.shift72-duty-cell[data-shift72-column="'+selected+'"]').forEach(cell=>cell.classList.add('is-today'));
 host.querySelectorAll('.shift72-duty-pill[aria-pressed="true"]').forEach(button=>button.setAttribute('aria-pressed','false'));
 if(Number.isInteger(shift72FocusPerson)){
  const pressed=host.querySelector('[data-shift72-person="'+shift72FocusPerson+'"][data-shift72-day="'+selected+'"]');
  if(pressed)pressed.setAttribute('aria-pressed','true');
 }
 host.querySelectorAll('.shift72-board-table tbody tr.is-person-selected').forEach(row=>row.classList.remove('is-person-selected'));
 if(Number.isInteger(shift72FocusPerson)){
  const row=host.querySelector('.shift72-board-table tbody tr:nth-child('+(shift72FocusPerson+1)+')');
  if(row)row.classList.add('is-person-selected');
 }
 const currentTrend=host.querySelector('.shift72-trend-svg');
 if(currentTrend)currentTrend.outerHTML=shift72TrendMarkup();
}
function shift72SelectDay(day,person=null){
 if(!Number.isInteger(day)||day<1||day>30)return;
 shift72FocusPerson=Number.isInteger(person)?person:null;
 shiftNovSetDay(day,shift72FocusPerson);
}
function shift72SetWeek(step){
 const i=SHIFT_72_WEEK_STARTS.indexOf(shift72Week);
 const index=Math.max(0,Math.min(4,Math.max(0,i)+(step>0?1:-1)));
 shift72Week=SHIFT_72_WEEK_STARTS[index];
 if(shiftNovSelectedDay<shift72Week||shiftNovSelectedDay>shift72Week+6)shift72SelectDay(shift72Week);
 else shift72RenderGraph();
}
function shift72HandleClick(event){
 const button=event.target.closest('button');
 if(!button)return;
 const view=document.getElementById('shiftNovemberView');
 if(!view?.contains(button))return;
 if(button.hasAttribute('data-shift72-mode')){
  shift72Mode=button.dataset.shift72Mode==='sheet'?'sheet':'graphic';shift72ApplyMode();return;
 }
 if(shift72Mode!=='graphic')return;
 if(button.hasAttribute('data-shift72-person')){
  shift72SelectDay(Number(button.dataset.shift72Day),Number(button.dataset.shift72Person));return;
 }
 if(button.hasAttribute('data-shift72-day')){
  shift72SelectDay(Number(button.dataset.shift72Day));return;
 }
 const action=button.dataset.shift72Action;
 if(action==='prev')shift72SelectDay(Math.max(1,shiftNovSelectedDay-1));
 else if(action==='next')shift72SelectDay(Math.min(30,shiftNovSelectedDay+1));
 else if(action==='today'){
  const today=shiftV7BangkokToday();
  shift72SelectDay(today.year===2026&&today.month===11?today.day:1);
 }else if(action==='month'||action==='week'){
  shift72Span=action;shift72Week=shift72WeekFor(shiftNovSelectedDay);shift72RenderGraph();
 }else if(action==='week-prev'||action==='week-next')shift72SetWeek(action==='week-next'?1:-1);
}
function shift72VisibleNov(){
 const panel=document.querySelector('#monthView .month-panel');
 return panel?.dataset.shiftMonth==='11';
}
function shift72MountOverviewEntry(){
 const overview=document.getElementById('overviewView');
 if(!overview||document.getElementById('shift72OverviewEntry'))return;
 const now=shiftV7BangkokToday();
 const day=now.year===2026&&now.month===11?now.day:1;
 const model=shift72DayModel(day);
 const entry=document.createElement('section');
 entry.id='shift72OverviewEntry';entry.className='shift72-feature-entry';
 entry.innerHTML='<div><span class="shift72-feature-name">SHIFT V7.2 • GRAPHIC DUTY SYSTEM</span>'+
 '<h2>November Crew Matrix / ตารางเวรกราฟิก</h2>'+
 '<p>'+day+' พฤศจิกายน 2569 · กลางวัน '+model.counts.D+' คน · กลางคืน '+model.counts.N+
 ' คน · หยุด '+model.counts.H+' คน · เลือกดูรหัส D1–D4 / N1–N2 ได้ทุกวัน</p></div>'+
 '<button type="button" class="shift72-feature-cta">เปิด Graphic Duty Board ↗</button>';
 const hero=overview.querySelector('.hero-grid');
 if(hero)hero.before(entry);else overview.prepend(entry);
 entry.querySelector('button').addEventListener('click',()=>{
  if(typeof showView==='function')showView('month');
  if(typeof shiftNovChangeMonth==='function')shiftNovChangeMonth('11');
  shift72Mode='graphic';shift72ApplyMode();shift72SelectDay(day);
 });
}
function shift72Init(){
 const view=document.getElementById('shiftNovemberView');
 if(!view||document.getElementById('shift72Graphic')||!Array.isArray(staff))return;
 const controls=document.createElement('div');
 controls.className='shift72-view-switch';controls.setAttribute('role','group');
 controls.setAttribute('aria-label','เลือกรูปแบบตารางเวรพฤศจิกายน');
 controls.innerHTML='<div><span class="shift72-switch-label">VIEW MODE</span><strong>เลือกวิธีดูตารางเวร</strong></div>'+
 '<div class="shift72-switch-buttons"><button type="button" data-shift72-mode="graphic" aria-pressed="true">'+
 '<span aria-hidden="true">▦</span> กราฟิกบอร์ด</button>'+
 '<button type="button" data-shift72-mode="sheet" aria-pressed="false"><span aria-hidden="true">▤</span> ตารางต้นฉบับ</button></div>';
 const mount=document.createElement('div');mount.id='shift72Graphic';mount.className='shift72-graphic-host';
 const firstContent=view.querySelector('.shift-nov-week');
 if(firstContent){firstContent.before(controls);controls.after(mount);}
 else{view.append(controls,mount);}
 shift72Span=typeof matchMedia==='function'&&matchMedia('(max-width: 760px)').matches?'week':'month';
 shift72Week=shift72WeekFor(shiftNovSelectedDay);
 view.dataset.shift72Mode='graphic';
 view.addEventListener('click',shift72HandleClick);
 shift72RenderGraph();
 shift72ApplyMode();
 shift72MountOverviewEntry();
 // Keep graphic board in sync with original November controls and the Duty Orbit.
 const originalSetDay=shiftNovSetDay;
 shiftNovSetDay=function(day,person){
  const result=originalSetDay(day,person);
  if(Number.isInteger(day)&&day>=1&&day<=30){
   if(Number.isInteger(person))shift72FocusPerson=person;
   shift72UpdateDayFast();
  }
  return result;
 };
 // Changing tabs only affects visibility. The source spreadsheet remains intact.
 if(typeof matchMedia==='function'){
  const media=matchMedia('(max-width: 760px)');
  const onViewport=()=>{
   const narrow=media.matches;
   if(shift72LastWidth===narrow)return;
   shift72LastWidth=narrow;
   shift72Span=narrow?'week':'month';
   shift72Week=shift72WeekFor(shiftNovSelectedDay);
   shift72RenderGraph();
  };
  if(typeof media.addEventListener==='function')media.addEventListener('change',onViewport);
 }
 document.documentElement.dataset.shift72='ready';
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shift72Init,{once:true});
 else shift72Init();
}