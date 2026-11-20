/* Shift V12 — December 2569 schedule, faithfully using uploaded cell data.
   This module is presentation-only; existing Oct/Nov source data remains untouched. */
const SHIFT_DEC_WEEKDAYS=['Su','Mo','Tu','We','Th','Fr','Sa'];
const SHIFT_DEC_POSTS=['D1','D2','D3','D4','N1','N2'];
let shiftDecSelectedDay=1;
let shiftDecFocusPerson=null;
const shiftDecEsc=x=>String(x??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
const shiftDecRoster=()=>DECEMBER_2026_DUTY_POSITIONS;
function shiftDecToday(){
 const p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const today={};for(const item of p)if(['year','month','day'].includes(item.type))today[item.type]=Number(item.value);
 return today.year===2026&&today.month===12?today.day:null;
}
function shiftDecHighlight(person,day){
 const tags=DECEMBER_2026_SOURCE_HIGHLIGHTS[person];
 if(tags.red.includes(day))return 'source-red';
 if(tags.yellow.includes(day))return 'source-yellow';
 return '';
}
function shiftDecCounts(day){
 const roles=shiftDecRoster().map((row,index)=>({index,code:row[day-1],name:staff[index]?.name||'—'}));
 return {
  roles,
  day:roles.filter(r=>r.code.startsWith('D')),
  night:roles.filter(r=>r.code.startsWith('N')),
  off:roles.filter(r=>r.code==='H'),
  unspecified:roles.filter(r=>r.code==='N')
 };
}
function shiftDecTable(){
 const dates=Array.from({length:31},(_,i)=>i+1);
 const weekend=day=>[0,6].includes(new Date(2026,11,day).getDay());
 const heads=dates.map(day=>
  '<th class="shift-dec-day'+(weekend(day)?' weekend':'')+'" data-shiftdec-day="'+day+'" scope="col">'+
  '<button type="button" data-shiftdec-day="'+day+'" aria-pressed="'+(day===shiftDecSelectedDay)+'" aria-label="เลือกวันที่ '+day+' ธันวาคม 2569">'+
  '<small>'+SHIFT_DEC_WEEKDAYS[new Date(2026,11,day).getDay()]+'</small><b>'+day+'</b></button></th>'
 ).join('');
 const cells=shiftDecRoster().map((row,index)=>{
  const person=staff[index]?.name||'—';
  const name=shiftDecEsc(person);
  const duty=row.map((code,i)=>{
   const day=i+1;
   const tone=code==='H'?'H':code[0];
   const special=shiftDecHighlight(index,day);
   const explanation=code==='N'?'N (ต้นฉบับไม่ได้ระบุ N1/N2)':code==='H'?'H (หยุด)':code+' (ตำแหน่งเวร)';
   return '<td class="shift-dec-cell '+tone+(special?' '+special:'')+(day===shiftDecSelectedDay?' is-selected':'')+
    '" data-shiftdec-day="'+day+'"><button type="button" data-shiftdec-person="'+index+'" data-shiftdec-day="'+day+'"'+
    ' title="'+shiftDecEsc(person+' • '+day+' ธันวาคม 2569 • '+explanation)+'"'+
    ' aria-label="'+shiftDecEsc(person+' วันที่ '+day+' ธันวาคม 2569 '+explanation)+'">'+code+'</button></td>';
  }).join('');
  return '<tr><th class="shift-dec-name" scope="row" title="'+name+'"><span>'+name+'</span></th>'+duty+'</tr>';
 }).join('');
 const totals=(kind)=>dates.map(day=>{
  const data=shiftDecCounts(day),n=kind==='D'?data.day.length:kind==='N'?data.night.length:data.off.length;
  return '<td class="shift-dec-total" data-shiftdec-day="'+day+'">'+n+'</td>';
 }).join('');
 return '<div class="shift-dec-scroll-help">เลื่อนในกรอบเพื่อดูวันที่ 1–31 • เลือกช่องเพื่อดูตำแหน่งเวรและรายชื่อ • H = หยุด</div>'+
 '<div class="shift-dec-scroll" role="region" tabindex="0" aria-label="ตารางเวรธันวาคม 2569 เลื่อนแนวนอนได้">'+
 '<table class="shift-dec-table" aria-label="ตารางเวรเดือนธันวาคม 2569 จำนวน 10 คน 31 วัน">'+
 '<thead><tr><th class="shift-dec-name" scope="col">ชื่อพนักงาน</th>'+heads+'</tr></thead>'+
 '<tbody>'+cells+'</tbody>'+
 '<tfoot><tr><th class="shift-dec-name" scope="row">DAY • รวมคน</th>'+totals('D')+'</tr>'+
 '<tr><th class="shift-dec-name" scope="row">NIGHT • รวมคน</th>'+totals('N')+'</tr>'+
 '<tr><th class="shift-dec-name" scope="row">H • รวมคน</th>'+totals('H')+'</tr></tfoot></table></div>';
}
function shiftDecDetails(){
 const host=document.querySelector('#shiftDecemberView .shift-dec-summary');
 if(!host)return;
 const day=shiftDecSelectedDay,m=shiftDecCounts(day);
 const positions=SHIFT_DEC_POSTS.map(post=>({code:post,people:m.roles.filter(r=>r.code===post)}));
 const repeated=positions.filter(x=>x.people.length>1);
 const unknown=m.unspecified.length>0;
 const warnings=[];
 if(unknown)warnings.push('มี N ที่ต้นฉบับไม่ได้ระบุหมายเลขกะ: '+m.unspecified.map(p=>p.name).join(', '));
 if(repeated.length)warnings.push('ตำแหน่งซ้ำ: '+repeated.map(p=>p.code).join(', '));
 // Missing positions may mean reduced coverage on a public holiday; show without inventing workers.
 const missing=positions.filter(p=>p.people.length===0);
 if(missing.length)warnings.push('ไม่มีผู้รับตำแหน่ง '+missing.map(p=>p.code).join(', ')+' ในภาพ');
 const roster=positions.map(p=>
  '<div class="shift-dec-post '+p.code[0]+'"><b>'+p.code+'</b>'+
  '<span>'+(p.people.length?p.people.map(x=>'<button type="button" class="shift-dec-post-person'+(x.index===shiftDecFocusPerson?' highlighted':'')+'" data-shiftdec-person="'+x.index+'" data-shiftdec-day="'+day+'">'+shiftDecEsc(x.name)+'</button>').join(' / '):'— ไม่ปรากฏในภาพ')+'</span></div>'
 ).join('');
 const other=unknown?'<div class="shift-dec-post unresolved"><b>N?</b><span>'+m.unspecified.map(p=>shiftDecEsc(p.name)).join(' / ')+'</span></div>':'';
 const off='<div class="shift-dec-rest"><b>H • หยุด '+m.off.length+' คน</b><span>'+m.off.map(p=>shiftDecEsc(p.name)).join(' • ')+'</span></div>';
 const notice=warnings.length?'<p class="shift-dec-warning">'+warnings.map(shiftDecEsc).join(' • ')+'<br><small>แสดงค่าตามภาพ ไม่กำหนดกะที่ไม่ได้ระบุเอง</small></p>':'';
 host.innerHTML='<div class="shift-dec-details-top"><div><span>SELECTED DATE / TEAM COVERAGE</span><h3>'+day+' ธันวาคม 2569</h3></div>'+
 '<div class="shift-dec-day-controls"><button type="button" data-shiftdec-adjacent="-1"'+(day===1?' disabled':'')+'>‹ ก่อนหน้า</button>'+
 '<button type="button" data-shiftdec-adjacent="1"'+(day===31?' disabled':'')+'>ถัดไป ›</button></div></div>'+
 '<div class="shift-dec-kpis"><div><span>DAY</span><strong>'+m.day.length+'</strong><small>ตำแหน่งกลางวัน</small></div>'+
 '<div><span>NIGHT</span><strong>'+m.night.length+'</strong><small>รวม N ไม่ระบุเลข</small></div>'+
 '<div><span>HOLIDAY</span><strong>'+m.off.length+'</strong><small>หยุด H</small></div></div>'+
 notice+'<div class="shift-dec-posts">'+roster+other+'</div>'+off;
}
function shiftDecMarkDay(){
 const view=document.getElementById('shiftDecemberView');
 if(!view)return;
 view.querySelectorAll('.shift-dec-table [data-shiftdec-day]').forEach(node=>{
  const selected=Number(node.dataset.shiftdecDay)===shiftDecSelectedDay;
  node.classList.toggle('is-selected',selected);
  if(node.matches('button'))node.setAttribute('aria-pressed',String(selected));
 });
 shiftDecDetails();
}
function shiftDecRevealDay(){
 const scroll=document.querySelector('#shiftDecemberView .shift-dec-scroll');
 const btn=scroll?.querySelector('thead button[data-shiftdec-day="'+shiftDecSelectedDay+'"]');
 if(!scroll||!btn)return;
 const rect=scroll.getBoundingClientRect(),dayRect=btn.getBoundingClientRect();
 const pinned=scroll.querySelector('tbody th.shift-dec-name')?.getBoundingClientRect().width||0;
 if(dayRect.left<rect.left+pinned+6)scroll.scrollLeft-=rect.left+pinned+6-dayRect.left;
 else if(dayRect.right>rect.right-8)scroll.scrollLeft+=dayRect.right-(rect.right-8);
}
function shiftDecSetDay(value,personIndex=null){
 const day=Number(value);
 if(!Number.isInteger(day)||day<1||day>31)return;
 shiftDecSelectedDay=day;
 shiftDecFocusPerson=personIndex;
 shiftDecMarkDay();
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(shiftDecRevealDay);
}
function shiftDecRefresh(){
 const view=document.getElementById('shiftDecemberView');
 if(!view)return;
 if(!view.querySelector('.shift-dec-table')){
  const grid=view.querySelector('.shift-dec-main');
  if(grid)grid.innerHTML=shiftDecTable();
 }
 shiftDecMarkDay();
}
function shiftDecMarkNavigation(){
 const shown=document.querySelector('#monthView .month-panel')?.dataset.shiftMonth==='12'&&
  document.getElementById('monthView')?.classList.contains('active');
 document.querySelectorAll('[data-shiftdec-open]').forEach(button=>{
  button.classList.toggle('shift731-active',Boolean(shown));
  button.setAttribute('aria-current',shown?'page':'false');
 });
}
function shiftDecInsertNavigation(){
 const nav=document.querySelector('.command-bar .nav-tabs');
 if(nav&&!nav.querySelector('[data-shiftdec-open]')){
  const btn=document.createElement('button');btn.type='button';
  btn.className='nav-btn shift-dec-navigation';btn.setAttribute('data-shiftdec-open','');
  btn.setAttribute('aria-label','เปิดตารางเวรธันวาคม 2569');
  btn.innerHTML='<b>▦ ธันวาคม</b><span>December 2026</span>';nav.appendChild(btn);
 }
 const mobile=document.getElementById('mobileNav');
 if(mobile&&!mobile.querySelector('[data-shiftdec-open]')){
  const btn=document.createElement('button');btn.type='button';
  btn.className='shift-dec-mobile-btn';btn.setAttribute('data-shiftdec-open','');
  btn.setAttribute('aria-label','เปิดตารางเวรธันวาคม 2569');
  btn.innerHTML='<b>▦</b>ธ.ค.';
  const november=mobile.querySelector('[data-shift731-open-nov]');
  const month=mobile.querySelector('[data-view="month"]');
  if(november)november.after(btn);
  else if(month)month.after(btn);
  else mobile.appendChild(btn);
 }
}
function shiftDecInit(){
 const panel=document.querySelector('#monthView .month-panel');
 if(!panel||document.getElementById('shiftDecemberView'))return;
 if(!Array.isArray(staff)||staff.length!==10||typeof DECEMBER_2026_DUTY_POSITIONS==='undefined'||
  DECEMBER_2026_DUTY_POSITIONS.length!==10||DECEMBER_2026_DUTY_POSITIONS.some(row=>row.length!==31))return;
 const tabs=document.getElementById('shiftMonthTabs');
 if(!tabs&&typeof shiftNovInit==='function')shiftNovInit();
 const control=document.getElementById('shiftMonthTabs');
 if(control&&!control.querySelector('[data-shift-month="12"]')){
  const tab=document.createElement('button');tab.type='button';tab.setAttribute('role','tab');
  tab.dataset.shiftMonth='12';tab.setAttribute('aria-controls','shiftDecemberView');
  tab.textContent='ธันวาคม 2569';control.appendChild(tab);
 }
 const view=document.createElement('section');
 view.id='shiftDecemberView';view.className='shift-december-panel';view.hidden=true;
 view.innerHTML='<div class="shift-dec-title"><div><span class="shift-dec-kicker">TEAM ROSTER / DECEMBER 2026</span>'+
 '<h2>ตารางเวรทั้งทีม • ธันวาคม 2569</h2>'+
 '<p>10 พนักงาน • 31 วัน • D1–D4 / N1–N2 / H • ตามภาพต้นฉบับ</p></div>'+
 '<button class="shift-dec-today" type="button" data-shiftdec-action="today">วันนี้</button></div>'+
 '<div class="shift-dec-source-note">ตามภาพต้นฉบับ: วันที่ 1, 6 และ 7 มีรหัส N ไม่ระบุหมายเลขกะ; สีเหลือง/แดงของช่อง H เป็นไฮไลต์จากภาพ ไม่ได้ตีความเป็นประเภทลา</div>'+
 '<div class="shift-dec-main"></div><section class="shift-dec-summary" aria-live="polite"></section>';
 panel.appendChild(view);
 const today=shiftDecToday();
 shiftDecSelectedDay=today||1;
 shiftDecRefresh();
 shiftDecInsertNavigation();
 view.addEventListener('click',event=>{
  const btn=event.target.closest('button');
  if(!btn||!view.contains(btn))return;
  if(btn.dataset.shiftdecAction==='today'){shiftDecSetDay(shiftDecToday()||1);return;}
  if(btn.hasAttribute('data-shiftdec-adjacent')){
   shiftDecSetDay(shiftDecSelectedDay+Number(btn.dataset.shiftdecAdjacent));return;
  }
  if(btn.hasAttribute('data-shiftdec-day')){
   shiftDecSetDay(Number(btn.dataset.shiftdecDay),btn.hasAttribute('data-shiftdec-person')?Number(btn.dataset.shiftdecPerson):null);
  }
 });
 document.addEventListener('click',event=>{
  const direct=event.target.closest?.('[data-shiftdec-open]');
  if(direct){
   event.preventDefault();
   if(typeof shift731Open==='function')shift731Open('12',{navigate:true,graphic:false});
   else{if(typeof showView==='function')showView('month');shiftNovChangeMonth('12');}
   queueMicrotask(shiftDecMarkNavigation);
  }else if(event.target.closest?.('[data-view],[data-shift-month],[data-shift731-open-nov]')){
   queueMicrotask(shiftDecMarkNavigation);
  }
 });
 if(panel.dataset.shiftMonth==='12')shiftNovChangeMonth('12');
 shiftDecMarkNavigation();
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shiftDecInit,{once:true});
 else shiftDecInit();
}
