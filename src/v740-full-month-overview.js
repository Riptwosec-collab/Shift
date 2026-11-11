/* Shift V7.4 — Full month workforce planner.
 * Standalone, additive presentation. Source roster data is NEVER edited.
 * Replaces the visual 8-day overview preview with an inspectable 30/31-day calendar + 10-person role matrix.
 */
const SHIFT740_WEEKDAYS=['อา','จ','อ','พ','พฤ','ศ','ส'];
const SHIFT740_POSTS=['D1','D2','D3','D4','N1','N2'];
let shift740Month=11;
let shift740Day=1;
let shift740Filter='ALL';
const shift740Esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const shift740Days=month=>month===10?31:30;
const shift740MonthText=(month,en=false)=>en?(month===10?'October 2026':'November 2026'):(month===10?'ตุลาคม 2569':'พฤศจิกายน 2569');
const shift740Source=month=>month===10?OCTOBER_2026_DUTY_POSITIONS:NOVEMBER_2026_DUTY_POSITIONS;
function shift740Today(){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const v={};for(const p of parts)if(['year','month','day'].includes(p.type))v[p.type]=Number(p.value);
 return v;
}
function shift740Model(month,day){
 if(![10,11].includes(month)||!Number.isInteger(day)||day<1||day>shift740Days(month))
  throw new RangeError('Shift V7.4: invalid period');
 const source=shift740Source(month);
 if(!Array.isArray(source)||!Array.isArray(staff)||source.length!==staff.length)
  throw new Error('Shift V7.4: roster source mismatch');
 const records=source.map((r,i)=>({index:i,name:staff[i].name,code:r[day-1]}));
 // Reuse validated October overrides when present; never invent missing positions.
 if(month===10&&typeof shiftRolesForDay==='function'){
  const assigned=shiftRolesForDay(day);
  records.forEach(person=>{
   if(person.code==='H'||person.code==='O')return;
   const role=SHIFT740_POSTS.find(p=>assigned[p]===person.name);
   if(role)person.code=role;
   else if(SHIFT740_POSTS.includes(person.code)&&assigned[person.code]&&assigned[person.code]!==person.name)
    person.code=person.code[0]+'?';
  });
 }
 const posts=SHIFT740_POSTS.map(code=>({code,people:records.filter(r=>r.code===code)}));
 const counts={D:records.filter(r=>r.code.startsWith('D')).length,
  N:records.filter(r=>r.code.startsWith('N')).length,
  H:records.filter(r=>['H','O'].includes(r.code)).length};
 const anomalies=posts.filter(p=>p.people.length!==1).map(p=>({code:p.code,count:p.people.length}));
 return {month,day,records,posts,counts,anomalies};
}
function shift740ShortName(index){
 return typeof SHIFT_NOV_SHEET_NICKNAMES!=='undefined'&&SHIFT_NOV_SHEET_NICKNAMES[index]
  ?SHIFT_NOV_SHEET_NICKNAMES[index] : (staff[index]?.name||'').replace(/^นาย\s*/,'').split(/\s+/)[0];
}
function shift740DayMeta(month,day,today=shift740Today()){
 const date=new Date(2026,month-1,day);
 return {weekDay:date.getDay(),weekend:[0,6].includes(date.getDay()),
  today:today.year===2026&&today.month===month&&today.day===day};
}
function shift740MonthStats(month){
 const source=shift740Source(month),stats={D:0,N:0,H:0,days:shift740Days(month)};
 source.forEach(row=>row.forEach(role=>{
  const bucket=['H','O'].includes(role)?'H':role[0];
  if(bucket in stats)stats[bucket]++;
 }));
 return stats;
}
function shift740MiniSummary(model){
 const out=model.counts;const total=model.records.length;
 return '<div class="s740-stat-row">'+
 [['D','DAY SHIFT','กลางวัน'],['N','NIGHT SHIFT','กลางคืน'],['H','OFF','หยุด']].map(x=>
  '<div class="s740-stat s740-'+x[0]+'"><span>'+x[1]+'</span><strong>'+out[x[0]]+
  '<small> / '+total+'</small></strong><span>'+x[2]+'</span></div>').join('')+'</div>';
}
function shift740Crew(model){
 const label=model.day+' '+shift740MonthText(model.month);
 const messages=model.anomalies.map(x=>x.code+(x.count>1?' ซ้ำ '+x.count+' คน':' ไม่มีข้อมูล'));
 return '<div class="s740-detail-head"><div><span class="s740-kicker">SELECTED DAY / CREW COVERAGE</span>'+
 '<h3>'+label+'</h3></div><div class="s740-coverage '+(messages.length?'s740-warning':'')+'">'+
 (messages.length?'ต้องตรวจสอบ: '+messages.join(' · '):'บันทึกเวรครบตามตำแหน่งหลัก')+'</div></div>'+
 shift740MiniSummary(model)+
 '<div class="s740-crew-grid">'+model.posts.map(post=>{
  const ok=post.people.length===1;
  return '<div class="s740-post s740-'+post.code[0]+(ok?'':' s740-post-alert')+'"><b>'+post.code+'</b><span>'+
   (post.people.map(p=>shift740Esc(p.name)).join(' / ')||'— ไม่มีผู้รับตำแหน่ง')+'</span></div>';
 }).join('')+'</div>';
}
function shift740Calendar(month,day){
 const total=shift740Days(month);
 const today=shift740Today();
 const dayModels=Array.from({length:total},(_,i)=>shift740Model(month,i+1));
 const leading=new Date(2026,month-1,1).getDay();
 const blank=Array.from({length:leading},()=>'<span class="s740-calendar-blank" aria-hidden="true"></span>').join('');
 const days=Array.from({length:total},(_,i)=>{
  const d=i+1,meta=shift740DayMeta(month,d,today),m=dayModels[i];
  const counts=m.counts;
  const warnings=m.anomalies.length>0;
  return '<button type="button" class="s740-calendar-day'+(meta.weekend?' is-weekend':'')+
   (meta.today?' is-today':'')+(d===day?' is-selected':'')+(warnings?' has-warning':'')+
   '" data-s740-day="'+d+'" aria-pressed="'+(d===day)+'" aria-label="'+
   d+' '+shift740MonthText(month)+' กลางวัน '+counts.D+' กลางคืน '+counts.N+' หยุด '+counts.H+'">'+
   '<span class="s740-date">'+d+'</span>'+
   '<span class="s740-cal-info"><b>D'+counts.D+'</b><b>N'+counts.N+'</b></span>'+
   '<span class="s740-cal-bar" aria-hidden="true"><i class="d" style="width:'+(counts.D*10)+'%"></i>'+
   '<i class="n" style="width:'+(counts.N*10)+'%"></i><i class="h" style="width:'+(counts.H*10)+'%"></i></span>'+
   '</button>';
 }).join('');
 return '<section class="s740-calendar-panel" aria-label="ปฏิทินเวรเต็มเดือน">'+
 '<div class="s740-panel-header"><div><span class="s740-kicker">MONTHLY OVERVIEW</span>'+
 '<h3>ปฏิทินทั้งเดือน <small>1–'+total+' '+shift740MonthText(month)+'</small></h3></div>'+
 '<div class="s740-legend"><span><i class="d"></i>D กลางวัน</span><span><i class="n"></i>N กลางคืน</span><span><i class="h"></i>H หยุด</span></div></div>'+
 '<div class="s740-calendar-grid">'+SHIFT740_WEEKDAYS.map(d=>'<div class="s740-weekday">'+d+'</div>').join('')+
 blank+days+'</div></section>';
}
function shift740Matrix(month,day){
 const source=shift740Source(month),days=shift740Days(month);
 const today=shift740Today();
 const dayModels=Array.from({length:days},(_,i)=>shift740Model(month,i+1));
 const headers=Array.from({length:days},(_,i)=>{
  const d=i+1,meta=shift740DayMeta(month,d,today);
  return '<th class="s740-matrix-date'+(meta.weekend?' weekend':'')+(d===day?' selected':'')+
   '" scope="col" data-s740-col="'+d+'"><button type="button" data-s740-day="'+d+'" aria-pressed="'+(d===day)+'">'+
   '<small>'+SHIFT740_WEEKDAYS[meta.weekDay]+'</small><b>'+d+'</b></button></th>';
 }).join('');
 const rows=source.map((row,i)=>{
  const name=staff[i].name,short=shift740ShortName(i);
  const items=Array.from({length:days},(_,j)=>{
   const d=j+1;
   const role=dayModels[j].records[i].code;
   const tone=role==='H'||role==='O'?'H':role[0],warning=role.includes('?')||(month===11&&d===30&&role==='N1');
   return '<td data-s740-col="'+d+'" class="s740-cell'+(d===day?' selected':'')+'"><button type="button" '+
    'data-s740-person="'+i+'" data-s740-day="'+d+'" class="s740-duty s740-'+tone+(warning?' warning':'')+'" '+
    'aria-label="'+shift740Esc(name+' '+d+' '+shift740MonthText(month)+' '+role)+'" '+
    'title="'+shift740Esc(name+' • '+d+' • '+role)+'">'+role+'</button></td>';
  }).join('');
  return '<tr><th scope="row" class="s740-name" title="'+shift740Esc(name)+'"><b>'+
   shift740Esc(short)+'</b><span>'+shift740Esc(name)+'</span></th>'+items+'</tr>';
 }).join('');
 return '<section class="s740-roster-panel"><div class="s740-panel-header"><div>'+
 '<span class="s740-kicker">TEAM × DAY / FULL MATRIX</span>'+
 '<h3>เวรทุกคน ทุกตำแหน่ง <small>10 คน × '+days+' วัน</small></h3></div>'+
 '<span class="s740-hint">เลื่อนตารางในกรอบ ⇆ • แตะช่องเพื่อดูรายชื่อจริง</span></div>'+
 '<div class="s740-matrix-viewport" id="shift740MatrixViewport" role="region" tabindex="0" aria-label="ตารางเวรเต็มเดือน '+shift740MonthText(month)+' เลื่อนแนวนอนได้">'+
 '<table class="s740-matrix" aria-label="ตารางเวรทุกตำแหน่งทุกวัน"><thead><tr>'+
 '<th scope="col" class="s740-name s740-corner">พนักงาน / TEAM</th>'+headers+'</tr></thead><tbody>'+rows+'</tbody></table></div></section>';
}
function shift740Markup(month,day){
 const total=shift740Days(month),en=typeof document!=='undefined'&&document.documentElement.lang==='en',stats=shift740MonthStats(month);
 return '<div class="s740-top"><div class="s740-topcopy"><span class="s740-kicker">SHIFT / WORKFORCE PLANNING</span>'+
 '<h2>Full Month <em>Schedule</em></h2>'+
 '<p>ตารางเวรทีมเต็มเดือน '+total+' วัน • รหัสตำแหน่งจริง D1–D4 / N1–N2 / H • เลือกวันที่เพื่อดูรายละเอียด</p></div>'+
 '<div class="s740-control"><div class="s740-months" role="group" aria-label="เลือกเดือนของภาพรวม">'+
 [[10,'ตุลาคม'],[11,'พฤศจิกายน']].map(([value,title])=>
 '<button type="button" data-s740-month="'+value+'" aria-pressed="'+(value===month)+'">'+title+'</button>').join('')+
 '</div><div class="s740-actions"><button type="button" data-s740-action="today">วันนี้</button>'+
 '<button type="button" class="s740-more" data-s740-action="open">เปิดหน้าตารางเวร ↗</button></div></div></div>'+
 '<div class="s740-period-bar"><strong>'+shift740MonthText(month,en)+'</strong><span>10 TEAM MEMBERS</span>'+
 '<span>'+total+' DAYS</span><span>'+stats.D+' DAY SHIFTS</span><span>'+stats.N+' NIGHT SHIFTS</span></div>'+
 '<div class="s740-layout">'+shift740Calendar(month,day)+
 '<aside class="s740-detail" id="shift740Detail">'+shift740Crew(shift740Model(month,day))+'</aside></div>'+
 shift740Matrix(month,day)+
 '<p class="s740-source-note">ข้อมูลเวรอ้างอิงตารางจริงเดือนตุลาคมและพฤศจิกายน 2569 • วันที่ 30 พ.ย. มี N1 ซ้ำและไม่มี N2 ตามต้นฉบับ (ยังไม่แก้เอง)</p>';
}
/* Update only the old/new day columns, instead of touching 300–310 roster cells per click. */
function shift740MarkSelection(scroll=false){
 const host=document.getElementById('shift740FullMonth');
 if(!host)return;
 const previous=Number(host.dataset.s740ActiveDay||0);
 const current=shift740Day;
 if(previous!==current){
  for(const day of [previous,current]){
   if(day<1)continue;
   const active=day===current;
   const calendar=host.querySelector('.s740-calendar-day[data-s740-day="'+day+'"]');
   if(calendar){
    calendar.classList.toggle('is-selected',active);
    calendar.setAttribute('aria-pressed',String(active));
   }
   const heading=host.querySelector('th.s740-matrix-date[data-s740-col="'+day+'"]');
   if(heading){
    heading.classList.toggle('selected',active);
    const button=heading.querySelector('button');
    if(button)button.setAttribute('aria-pressed',String(active));
   }
   host.querySelectorAll('td.s740-cell[data-s740-col="'+day+'"]').forEach(cell=>{
    cell.classList.toggle('selected',active);
   });
  }
  host.dataset.s740ActiveDay=String(current);
 }
 const detail=host.querySelector('#shift740Detail');
 if(detail&&detail.dataset.s740Day!==String(current)){
  detail.innerHTML=shift740Crew(shift740Model(shift740Month,current));
  detail.dataset.s740Day=String(current);
  const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce&&typeof detail.animate==='function'){
   detail.getAnimations?.().forEach(animation=>animation.cancel());
   detail.animate([{opacity:.68,transform:'translate3d(0,4px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],
    {duration:170,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
 }
 if(scroll){
  const viewport=host.querySelector('#shift740MatrixViewport');
  const cell=viewport?.querySelector('thead [data-s740-col="'+current+'"]');
  if(viewport&&cell){
   const left=Math.max(0,cell.offsetLeft-200);
   if(Math.abs(viewport.scrollLeft-left)>5)viewport.scrollLeft=left;
  }
 }
}
function shift740Render(){
 const host=document.getElementById('shift740FullMonth');
 if(!host)return;
 host.innerHTML=shift740Markup(shift740Month,shift740Day);
 host.dataset.s740ActiveDay=String(shift740Day);
 const detail=host.querySelector('#shift740Detail');
 if(detail)detail.dataset.s740Day=String(shift740Day);
 shift740MarkSelection(true);
}
function shift740SetMonth(month){
 month=Number(month);
 if(month!==10&&month!==11||month===shift740Month)return;
 shift740Month=month;
 const now=shift740Today();
 shift740Day=now.year===2026&&now.month===month?now.day:Math.min(shift740Day,shift740Days(month));
 shift740Render();
}
function shift740SetDay(day){
 day=Number(day);
 if(!Number.isInteger(day)||day<1||day>shift740Days(shift740Month)||day===shift740Day)return;
 shift740Day=day;
 shift740MarkSelection();
}
function shift740OpenDetail(personIndex=null){
 if(shift740Month===11){
  if(typeof shift731Open==='function')shift731Open('11',{navigate:true,graphic:true});
  else{showView('month');shiftNovChangeMonth('11');}
  if(typeof shiftNovSetDay==='function')shiftNovSetDay(shift740Day,personIndex);
 }else{
  if(typeof shift731Open==='function')shift731Open('10',{navigate:true,graphic:false});
  else{showView('month');shiftNovChangeMonth('10');}
  if(typeof setSelectedDay==='function')setSelectedDay(shift740Day,false);
 }
}
function shift740AddVisualLab(overview){
 const old=document.getElementById('shiftExperience');
 if(!old||old.closest('details.s740-visual-lab'))return;
 const details=document.createElement('details');
 details.className='s740-visual-lab';
 const summary=document.createElement('summary');
 summary.textContent='Visual Lab · เปิด Duty Orbit 3D';
 details.appendChild(summary);old.before(details);details.appendChild(old);
}
function shift740Mount(){
 const overview=document.getElementById('overviewView');
 if(!overview||document.getElementById('shift740FullMonth'))return;
 if(typeof OCTOBER_2026_DUTY_POSITIONS==='undefined'||typeof NOVEMBER_2026_DUTY_POSITIONS==='undefined')return;
 const now=shift740Today();
 shift740Month=now.year===2026&&[10,11].includes(now.month)?now.month:11;
 shift740Day=now.year===2026&&now.month===shift740Month?now.day:1;
 const host=document.createElement('section');
 host.id='shift740FullMonth';host.className='s740-board';
 host.setAttribute('aria-label','Full Month Schedule ดูเวรทุกคนทั้งเดือน');
 overview.insertBefore(host,overview.firstChild);
 host.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button||!host.contains(button))return;
  if(button.hasAttribute('data-s740-month')){shift740SetMonth(button.dataset.s740Month);return}
  if(button.hasAttribute('data-s740-day')){
   shift740SetDay(button.dataset.s740Day);
   if(button.hasAttribute('data-s740-person'))shift740OpenDetail(Number(button.dataset.s740Person));
   return;
  }
  if(button.dataset.s740Action==='today'){
   const date=shift740Today();
   if(date.year===2026&&[10,11].includes(date.month)){
    if(shift740Month===date.month)shift740SetDay(date.day);
    else{shift740Month=date.month;shift740Day=date.day;shift740Render();}
   }else shift740SetMonth(11);
  }
  if(button.dataset.s740Action==='open')shift740OpenDetail();
 });
 shift740Render();
 shift740AddVisualLab(overview);
 document.documentElement.dataset.shift740='ready';
 document.documentElement.dataset.shift750='ready';
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shift740Mount,{once:true});
 else shift740Mount();
}
