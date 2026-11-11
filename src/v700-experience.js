/* Shift V6.6–V7.1 visual experience. Presentation only: never writes to roster arrays. */
const SHIFT_V7_POSTS=Object.freeze(['D1','D2','D3','D4','N1','N2']);
const SHIFT_V7_LOCATIONS=Object.freeze([[27,19],[73,19],[91,49],[73,81],[27,81],[9,49]]);
let shiftV7Month=11,shiftV7Day=1,shiftV7SelectedPost='D1',shiftV7Filter='ALL';
let shiftV7LastColumn='',shiftV7LastRow=null,shiftV7LastCells=[];
function shiftV7Escape(value){
 return String(value===undefined||value===null?'':value).replace(/[&<>"']/g,function(char){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[char];
 });
}
function shiftV7BangkokToday(){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const value={};
 for(const item of parts)if(item.type==='year'||item.type==='month'||item.type==='day')value[item.type]=Number(item.value);
 return {year:value.year,month:value.month,day:value.day};
}
function shiftV7English(){return document.documentElement.lang==='en'}
function shiftV7MonthTitle(month){
 return shiftV7English()?(month===10?'October 2026':'November 2026'):(month===10?'ตุลาคม 2569':'พฤศจิกายน 2569');
}
function shiftV7SourceRows(month){
 return month===10?OCTOBER_2026_DUTY_POSITIONS:NOVEMBER_2026_DUTY_POSITIONS;
}
function shiftV7Model(month,day){
 month=month===10?10:11;
 const max=month===10?31:30;
 if(!Number.isInteger(day)||day<1||day>max)throw new RangeError('Invalid Shift day');
 const source=shiftV7SourceRows(month);
 if(!Array.isArray(source)||!Array.isArray(staff)||source.length!==staff.length)throw new Error('Roster source/staff mismatch');
 const records=source.map(function(row,index){
  const code=row[day-1];
  return {name:staff[index].name,index:index,code:code};
 });
 // The optional October override editor is authoritative for named posts.
 if(month===10&&typeof shiftRolesForDay==='function'){
  const overrides=shiftRolesForDay(day);
  records.forEach(function(item){
   if(item.code!=='H'&&item.code!=='O'){
    const matching=SHIFT_V7_POSTS.find(function(post){return overrides[post]===item.name});
    if(matching)item.code=matching;
    else if(SHIFT_V7_POSTS.includes(item.code)&&overrides[item.code]&&overrides[item.code]!==item.name)item.code=item.code[0]+'?';
   }
  });
 }
 const positions=SHIFT_V7_POSTS.map(function(post){
  const matches=records.filter(function(item){return item.code===post});
  return {post:post,kind:post.charAt(0),people:matches,duplicate:matches.length>1,missing:matches.length===0};
 });
 const dayCount=records.filter(function(item){return item.code.charAt(0)==='D'}).length;
 const nightCount=records.filter(function(item){return item.code.charAt(0)==='N'}).length;
 const offCount=records.filter(function(item){return item.code==='H'||item.code==='O'}).length;
 const duplicates=positions.filter(function(item){return item.duplicate}).map(function(item){return item.post});
 const incomplete=positions.filter(function(item){return item.post==='N1'||item.post==='N2'}).filter(function(item){return item.missing}).map(function(item){return item.post});
 const unknown=records.filter(function(item){return item.code.endsWith('?')});
 return {month:month,day:day,max:max,positions:positions,records:records,dayCount:dayCount,nightCount:nightCount,offCount:offCount,
  duplicates:duplicates,incomplete:incomplete,unknown:unknown};
}
function shiftV7ShortName(person){
 if(!person)return '—';
 if(typeof SHIFT_NOV_SHEET_NICKNAMES!=='undefined'&&SHIFT_NOV_SHEET_NICKNAMES[person.index])return SHIFT_NOV_SHEET_NICKNAMES[person.index];
 return String(person.name).replace(/^นาย\s*/,'').split(/\s+/)[0]||person.name;
}
function shiftV7InitialDate(){
 const now=shiftV7BangkokToday();
 shiftV7Month=now.year===2026&&(now.month===10||now.month===11)?now.month:11;
 shiftV7Day=now.year===2026&&(now.month===10||now.month===11)?now.day:1;
}
function shiftV7DayRange(month){
 return month===10?31:30;
}
function shiftV7QualityLite(){
 return document.documentElement.dataset.shiftEffects==='lite';
}
function shiftV7ApplyQuality(){
 let quality='auto';
 try{quality=localStorage.getItem('shift-v7-motion-quality')||'auto'}catch{}
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const save=typeof navigator!=='undefined'&&Boolean(navigator.connection&&navigator.connection.saveData);
 const compact=typeof matchMedia==='function'&&matchMedia('(max-width: 760px)').matches;
 const lowMemory=typeof navigator!=='undefined'&&Number(navigator.deviceMemory)>0&&Number(navigator.deviceMemory)<=3;
 const lite=reduced||quality==='lite'||quality==='auto'&&(save||compact||lowMemory);
 document.documentElement.dataset.shiftEffects=lite?'lite':'full';
 const button=document.getElementById('shiftV7Quality');
 if(button){
  button.textContent=shiftV7English()?(lite?'Motion: lite':'Motion: full'):(lite?'โมชั่น: เบา':'โมชั่น: เต็ม');
  button.setAttribute('aria-pressed',String(!lite));
  button.title=shiftV7English()?'Toggle motion intensity':'สลับความเข้มของโมชั่น';
 }
}
function shiftV7SetQuality(){
 const next=shiftV7QualityLite()?'full':'lite';
 try{localStorage.setItem('shift-v7-motion-quality',next)}catch{}
 shiftV7ApplyQuality();
}
function shiftV7Graph(model){
 const first=Math.max(1,model.day-6);
 const points=[];
 for(let day=first;day<=model.day;day++){
  const rows=shiftV7SourceRows(model.month);
  points.push({
   day:day,
   D:rows.filter(function(row){return row[day-1]&&row[day-1].charAt(0)==='D'}).length,
   N:rows.filter(function(row){return row[day-1]&&row[day-1].charAt(0)==='N'}).length
  });
 }
 const peak=Math.max(4,...points.map(function(p){return Math.max(p.D,p.N)}));
 function path(kind){
  return points.map(function(p,index){
   const x=4+index*(118/Math.max(1,points.length-1));
   const y=28-(p[kind]/peak)*23;
   return (index===0?'M':'L')+x.toFixed(1)+' '+y.toFixed(1);
  }).join(' ');
 }
 return {day:path('D'),night:path('N'),length:points.length};
}
function shiftV7MountExperience(){
 const overview=document.getElementById('overviewView');
 const hero=overview&&overview.querySelector('.hero-grid');
 if(!hero||document.getElementById('shiftExperience'))return;
 const panel=document.createElement('section');
 panel.id='shiftExperience';panel.className='shift-v7-experience';
 panel.setAttribute('aria-label','Duty Orbit แสดงตำแหน่งเวรจากตารางจริง');
 const positions=SHIFT_V7_POSTS.map(function(post,index){
  const location=SHIFT_V7_LOCATIONS[index];
  return '<button class="shift-v7-post" type="button" data-v7-post="'+post+'" data-kind="'+post[0]+'" style="--x:'+location[0]+'%;--y:'+location[1]+'%" aria-pressed="false"><b>'+post+'</b><span>—</span></button>';
 }).join('');
 panel.innerHTML=
  '<div class="shift-v7-head"><div><span class="shift-v7-kicker">V7.1 • OPERATIONS EXPERIENCE</span>'+
   '<h2 class="shift-v7-heading">Duty Orbit <span aria-hidden="true">/</span> ตำแหน่งเวรทั้งทีม</h2>'+
   '<p class="shift-v7-sub">Interactive 3D • อ้างอิงตำแหน่ง D1–D4 / N1–N2 จากตารางจริง (พ.ศ. 2569)</p></div>'+
   '<div class="shift-v7-controls">'+
    '<label class="visually-hidden" for="shiftV7Month">เลือกเดือนสำหรับ Duty Orbit</label>'+
    '<select class="shift-v7-month" id="shiftV7Month" aria-label="เลือกเดือน"><option value="10">ตุลาคม 2569</option><option value="11">พฤศจิกายน 2569</option></select>'+
    '<button type="button" class="shift-v7-button" data-shift-v7-action="prev" aria-label="วันก่อนหน้า">‹</button>'+
    '<span class="shift-v7-date" id="shiftV7Date" aria-live="polite">1</span>'+
    '<button type="button" class="shift-v7-button" data-shift-v7-action="next" aria-label="วันถัดไป">›</button>'+
    '<button type="button" class="shift-v7-button" data-shift-v7-action="today">วันนี้</button>'+
   '</div></div>'+
  '<div class="shift-v7-body"><div class="shift-v7-dial" role="group" aria-label="ตำแหน่งเวรรอบวงแหวน">'+
    '<div class="shift-v7-rings" aria-hidden="true"></div>'+
    '<div class="shift-v7-core" aria-hidden="true"><span>DUTY MATRIX</span><strong id="shiftV7Core">—</strong><small id="shiftV7CoreMonth">2026</small></div>'+
    positions+'</div>'+
   '<div class="shift-v7-aside"><div class="shift-v7-stat-grid">'+
    '<div class="shift-v7-stat" data-kind="D"><span>DAY • D</span><strong id="shiftV7DayStat">—</strong></div>'+
    '<div class="shift-v7-stat" data-kind="N"><span>NIGHT • N</span><strong id="shiftV7NightStat">—</strong></div>'+
    '<div class="shift-v7-stat" data-kind="H"><span>OFF • H</span><strong id="shiftV7OffStat">—</strong></div>'+
   '</div>'+
   '<div class="shift-v7-detail" id="shiftV7Detail" aria-live="polite"></div>'+
   '<button type="button" class="shift-v7-button" data-shift-v7-action="open">ดูตารางเวรและรายละเอียดวันที่เลือก</button>'+
   '</div></div>'+
  '<div class="shift-v7-foot"><span class="shift-v7-status" id="shiftV7Status"></span>'+
   '<div class="shift-v7-trend"><span>7-DAY DUTY TREND</span>'+
    '<svg id="shiftV7Trend" viewBox="0 0 126 32" role="img" aria-label="แนวโน้มจำนวนเวรกลางวันและกลางคืนย้อนหลังไม่เกิน 7 วัน">'+
    '<path data-v7-trend="D" d="" fill="none" stroke="#51ddad" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<path data-v7-trend="N" d="" fill="none" stroke="#669fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
   '<button type="button" id="shiftV7Quality" class="shift-v7-quality" data-shift-v7-action="quality" aria-pressed="true">โมชั่น: เต็ม</button>'+
   '</div></div>';
 hero.after(panel);
 const select=panel.querySelector('#shiftV7Month');
 select.value=String(shiftV7Month);
 panel.addEventListener('change',function(event){
  if(event.target!==select)return;
  shiftV7Month=Number(select.value)===10?10:11;
  shiftV7Day=Math.min(shiftV7Day,shiftV7DayRange(shiftV7Month));
  shiftV7Render();
 });
 panel.addEventListener('click',function(event){
  const button=event.target.closest('button');
  if(!button||!panel.contains(button))return;
  if(button.hasAttribute('data-v7-post')){shiftV7SelectedPost=button.dataset.v7Post;shiftV7Render();return}
  const action=button.dataset.shiftV7Action;
  if(action==='prev'&&shiftV7Day>1){shiftV7Day--;shiftV7Render();}
  if(action==='next'&&shiftV7Day<shiftV7DayRange(shiftV7Month)){shiftV7Day++;shiftV7Render();}
  if(action==='today'){
   const today=shiftV7BangkokToday();
   if(today.year===2026&&(today.month===10||today.month===11)){
    shiftV7Month=today.month;shiftV7Day=today.day;
   }else{shiftV7Month=11;shiftV7Day=1;}
   select.value=String(shiftV7Month);shiftV7Render();
  }
  if(action==='quality')shiftV7SetQuality();
  if(action==='open')shiftV7OpenMonth();
 });
 shiftV7ApplyQuality();
 shiftV7Render();
}
function shiftV7Render(){
 const panel=document.getElementById('shiftExperience');
 if(!panel)return;
 const model=shiftV7Model(shiftV7Month,shiftV7Day);
 const shortTitle=shiftV7MonthTitle(model.month);
 const date=document.getElementById('shiftV7Date');
 if(date){date.textContent=String(model.day);date.title=shortTitle+' • '+model.day;}
 panel.querySelector('#shiftV7Month').value=String(model.month);
 panel.querySelector('[data-shift-v7-action="prev"]').disabled=model.day===1;
 panel.querySelector('[data-shift-v7-action="next"]').disabled=model.day===model.max;
 panel.querySelector('#shiftV7Core').textContent=String(model.day).padStart(2,'0');
 panel.querySelector('#shiftV7CoreMonth').textContent=model.month===10?'OCT 2026':'NOV 2026';
 panel.querySelector('#shiftV7DayStat').textContent=String(model.dayCount);
 panel.querySelector('#shiftV7NightStat').textContent=String(model.nightCount);
 panel.querySelector('#shiftV7OffStat').textContent=String(model.offCount);
 model.positions.forEach(function(item){
  const node=panel.querySelector('[data-v7-post="'+item.post+'"]');
  if(!node)return;
  node.dataset.empty=String(item.missing);
  node.dataset.alert=String(item.duplicate||item.post==='N2'&&model.incomplete.includes('N2'));
  node.setAttribute('aria-pressed',String(shiftV7SelectedPost===item.post));
  let label=item.people.length===1?shiftV7ShortName(item.people[0]):item.people.length>1?item.people.length+' คน':'—';
  node.querySelector('span').textContent=label;
  const description=item.people.map(function(person){return person.name}).join(', ')||'ยังไม่มีผู้รับตำแหน่ง';
  node.title=item.post+' • '+model.day+' '+shortTitle+' • '+description;
  node.setAttribute('aria-label',node.title);
 });
 const selected=model.positions.find(function(item){return item.post===shiftV7SelectedPost})||model.positions[0];
 const chosenNames=selected.people.map(function(person){return shiftV7Escape(person.name)}).join(' / ')||'—';
 const caption=selected.duplicate?'ตำแหน่งซ้ำในต้นฉบับ • กรุณาตรวจสอบ':selected.missing?'ไม่มีผู้รับตำแหน่งนี้ในวันที่เลือก':'ข้อมูลจากตารางเวรต้นฉบับ';
 panel.querySelector('#shiftV7Detail').innerHTML='<div class="shift-v7-detail-top"><b>'+selected.post+' • '+model.day+' '+shiftV7Escape(shortTitle)+'</b><span>POSITION DETAIL</span></div>'+
  '<div class="shift-v7-detail-name">'+chosenNames+'</div><p>'+caption+'</p>';
 const warning=model.duplicates.length||model.incomplete.length||model.unknown.length;
 let msg=warning?'ต้องตรวจสอบ: '+(model.duplicates.length?'ตำแหน่งซ้ำ '+model.duplicates.join(', ')+' • ':'')+
  (model.incomplete.length?'ไม่พบ '+model.incomplete.join(', ')+' • ':'')+
  (model.unknown.length?'ตำแหน่งยังไม่ยืนยัน '+model.unknown.length+' คน':''):'ครบตามข้อมูลเวรที่บันทึกไว้';
 const status=panel.querySelector('#shiftV7Status');
 status.textContent=model.day+' '+shortTitle+' • '+msg;
 status.dataset.warning=String(Boolean(warning));
 const trend=shiftV7Graph(model);
 panel.querySelector('[data-v7-trend="D"]').setAttribute('d',trend.day);
 panel.querySelector('[data-v7-trend="N"]').setAttribute('d',trend.night);
}
function shiftV7OpenMonth(){
 if(typeof showView==='function')showView('month');
 if(typeof shiftNovChangeMonth==='function')shiftNovChangeMonth(String(shiftV7Month));
 if(shiftV7Month===11&&typeof shiftNovSetDay==='function')shiftNovSetDay(shiftV7Day);
 if(shiftV7Month===10&&typeof setSelectedDay==='function')setSelectedDay(shiftV7Day);
}
function shiftV7MountMatrixFilters(){
 const view=document.getElementById('shiftNovemberView');
 if(!view||view.querySelector('.shift-v7-matrix-toolbar'))return;
 view.dataset.shiftV7Filter=shiftV7Filter;
 const bar=document.createElement('div');
 bar.className='shift-v7-matrix-toolbar';
 bar.innerHTML='<div class="shift-v7-matrix-title">INTERACTIVE DUTY MATRIX<small>กรองสีตำแหน่งเพื่ออ่านง่ายขึ้น • ไม่เปลี่ยนข้อมูลเวร</small></div>'+
  '<div class="shift-v7-filters" role="group" aria-label="เน้นตำแหน่งในตารางเวร">'+
  [['ALL','ทั้งหมด'],['D','กลางวัน D'],['N','กลางคืน N'],['H','หยุด H']].map(function(pair){
   return '<button type="button" class="shift-v7-filter" data-v7-filter="'+pair[0]+'" aria-pressed="'+String(pair[0]===shiftV7Filter)+'">'+pair[1]+'</button>';
  }).join('')+'</div>';
 const anchor=view.querySelector('.shift-nov-week');
 if(anchor)anchor.before(bar);else view.prepend(bar);
 view.addEventListener('click',function(event){
  const button=event.target.closest('button[data-v7-filter]');
  if(!button||!view.contains(button))return;
  shiftV7Filter=button.dataset.v7Filter;
  view.dataset.shiftV7Filter=shiftV7Filter;
  view.querySelectorAll('[data-v7-filter]').forEach(function(el){
   el.setAttribute('aria-pressed',String(el.dataset.v7Filter===shiftV7Filter));
  });
 });
}
function shiftV7ClearCellFocus(){
 shiftV7LastCells.forEach(function(cell){cell.classList.remove('shift-v7-col-active')});
 shiftV7LastCells=[];
 if(shiftV7LastRow)shiftV7LastRow.classList.remove('shift-v7-row-active');
 shiftV7LastRow=null;shiftV7LastColumn='';
}
function shiftV7FocusCell(cell){
 if(!cell)return;
 const table=cell.closest('table');
 if(!table)return;
 const november=Boolean(table.closest('#shiftNovemberView'));
 const dataDate=cell.getAttribute('data-shift-nov-date');
 const column=november?Number(dataDate):cell.cellIndex;
 if(!Number.isInteger(column)||column<1)return;
 const id=(november?'11:':'10:')+column;
 if(shiftV7LastColumn===id&&shiftV7LastRow===cell.parentElement)return;
 shiftV7ClearCellFocus();
 const rows=table.querySelectorAll('tr');
 rows.forEach(function(row){
  let active=null;
  if(november)active=row.querySelector('[data-shift-nov-date="'+column+'"]');
  else active=row.cells&&row.cells[column];
  if(active&&active.classList){active.classList.add('shift-v7-col-active');shiftV7LastCells.push(active)}
 });
 shiftV7LastColumn=id;
 shiftV7LastRow=cell.parentElement;
 shiftV7LastRow.classList.add('shift-v7-row-active');
}
function shiftV7MountMatrixHover(){
 const panel=document.getElementById('monthView');
 if(!panel)return;
 panel.addEventListener('pointerover',function(event){
  const cell=event.target.closest('#shiftNovemberView td[data-shift-nov-date],#heatmapTable td.shift');
  if(cell)shiftV7FocusCell(cell);
 });
 panel.addEventListener('focusin',function(event){
  const cell=event.target.closest('#shiftNovemberView td[data-shift-nov-date],#heatmapTable td.shift');
  if(cell)shiftV7FocusCell(cell);
 });
 panel.addEventListener('pointerleave',shiftV7ClearCellFocus);
 panel.addEventListener('focusout',function(event){
  if(!event.relatedTarget||!panel.contains(event.relatedTarget))shiftV7ClearCellFocus();
 });
}
function shiftV7MountAmbient(){
 const hero=document.getElementById('heroStage');
 if(!hero||hero.querySelector('.shift-v7-aurora'))return;
 const glow=document.createElement('div');
 glow.className='shift-v7-aurora';glow.setAttribute('aria-hidden','true');hero.prepend(glow);
 if(typeof matchMedia==='function'&&matchMedia('(hover: hover) and (pointer: fine)').matches){
  let frame=0,px=70,py=30;
  hero.addEventListener('pointermove',function(event){
   if(shiftV7QualityLite())return;
   const rect=hero.getBoundingClientRect();
   px=Math.max(0,Math.min(100,100*(event.clientX-rect.left)/Math.max(1,rect.width)));
   py=Math.max(0,Math.min(100,100*(event.clientY-rect.top)/Math.max(1,rect.height)));
   if(frame)return;
   frame=requestAnimationFrame(function(){
    frame=0;glow.style.setProperty('--shift-v7-x',px+'%');
    glow.style.setProperty('--shift-v7-y',py+'%');
   });
  },{passive:true});
 }
 if(typeof IntersectionObserver==='function'){
  const watch=new IntersectionObserver(function(entries){
   entries.forEach(function(entry){entry.target.dataset.shiftV7Visible=String(entry.isIntersecting)});
  },{threshold:0});
  watch.observe(hero);
  const orbit=document.getElementById('shiftExperience');
  if(orbit)watch.observe(orbit);
 }
}
function shiftV7Boot(){
 if(document.documentElement.dataset.shiftV7==='true')return;
 const host=document.getElementById('overviewView');
 if(!host||typeof NOVEMBER_2026_DUTY_POSITIONS==='undefined'||typeof OCTOBER_2026_DUTY_POSITIONS==='undefined')return;
 document.documentElement.dataset.shiftV7='true';
 document.documentElement.dataset.shiftExperienceVersion='7.1';
 shiftV7InitialDate();
 shiftV7MountExperience();
 shiftV7MountMatrixFilters();
 shiftV7MountMatrixHover();
 shiftV7MountAmbient();
 shiftV7ApplyQuality();
 if(typeof matchMedia==='function'){
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(typeof preference.addEventListener==='function')preference.addEventListener('change',shiftV7ApplyQuality);
 }
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shiftV7Boot,{once:true});
 else shiftV7Boot();
}