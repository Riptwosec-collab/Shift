// v6.5.5 Engineer Oncall — individual Today/Next + per-person matrix, layered on v6.5.4 command-deck hooks.
const V652_MONTHS={th:{10:'ตุลาคม',11:'พฤศจิกายน',12:'ธันวาคม'},en:{10:'October',11:'November',12:'December'}};
const V652_WEEK={th:['อา','จ','อ','พ','พฤ','ศ','ส'],en:['Su','Mo','Tu','We','Th','Fr','Sa']};
let v652Mode='overview';
let v652Month=(()=>{const m=new Date().getMonth()+1;return [10,11,12].includes(m)?m:10})();
let v655SelectedDay=null;
let v655FocusedEngineer=null;

function v652Locale(){return typeof v65I18n!=='undefined'?v65I18n.getLocale():(document.documentElement.dataset.locale||'th')}
function v652Text(key){const copy={
  th:{overview:'ภาพรวม',matrix:'Matrix',timeline:'Timeline',current:'ON-CALL วันนี้',next:'เวรถัดไป',today:'วันนี้',engineer:'Engineer',days:'วัน',unassigned:'ยังไม่กำหนด',monthSchedule:'ตารางประจำเดือน',rotation:'รอบ On-call',period:'ช่วงวันที่',status:'สถานะ',active:'ACTIVE ONCALL',scheduled:'SCHEDULED',total:'รวมวัน On-call',hint:'ดูคนเข้าเวรวันนี้ คนถัดไป และตารางรายบุคคลทั้งเดือน',dutyGrid:'ENGINEER DUTY GRID',matrixTitle:'Oncall Matrix',matrixSub:'ตารางรายบุคคล แถวเป็น Engineer คอลัมน์เป็นวันที่',timelineTitle:'Oncall Timeline',timelineSub:'ลำดับการส่งต่อเวรตลอดทั้งเดือน',selected:'เดือนที่เลือก',coverage:'ครอบคลุม',handoffFlow:'HANDOFF FLOW',people:'ทีม Engineer',focus:'โฟกัส',selectedDay:'รายละเอียดวันที่เลือก',assigned:'ผู้เข้าเวร',handoff:'ส่งต่อให้',tapDate:'เลือกวันที่จากตารางเพื่อดูรายละเอียด',live:'กำลังเข้าเวร',nextState:'คนถัดไป',scheduledState:'ตามตาราง'},
  en:{overview:'Overview',matrix:'Matrix',timeline:'Timeline',current:'ON-CALL TODAY',next:'NEXT HANDOFF',today:'Today',engineer:'Engineer',days:'days',unassigned:'Unassigned',monthSchedule:'Monthly Schedule',rotation:'On-call Rotation',period:'Period',status:'Status',active:'ACTIVE ONCALL',scheduled:'SCHEDULED',total:'Total On-call Days',hint:'See who is on call now, who is next, and each engineer across the month',dutyGrid:'ENGINEER DUTY GRID',matrixTitle:'Oncall Matrix',matrixSub:'Per-person grid with engineers as rows and dates as columns',timelineTitle:'Oncall Timeline',timelineSub:'Handoff sequence across the selected month',selected:'Selected month',coverage:'Coverage',handoffFlow:'HANDOFF FLOW',people:'Engineer Team',focus:'Focus',selectedDay:'Selected Day Detail',assigned:'Assigned',handoff:'Handoff to',tapDate:'Select a date in the matrix to inspect detail',live:'Live now',nextState:'Next',scheduledState:'Scheduled'}};return copy[v652Locale()]?.[key]??copy.th[key]??key}
function v652MonthName(month){return V652_MONTHS[v652Locale()]?.[month]||String(month)}
function v652Year(){return v652Locale()==='th'?'2569':'2026'}
function v652Range(row){return `${row.start}–${row.end} ${v652MonthName(row.month)} ${v652Year()}`}
function v652Esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function v652PersonClass(name){return {'ป้อ':'pao','เอิร์ท':'earth','ตั้ม':'tum','แอม':'am'}[name]||'none'}
function v652IsToday(month,day,now=new Date()){return now.getFullYear()===2026&&now.getMonth()+1===month&&now.getDate()===day}
function v652ActiveRow(row,now=new Date()){return now.getFullYear()===2026&&now.getMonth()+1===row.month&&now.getDate()>=row.start&&now.getDate()<=row.end}
function v655DayCount(month){return new Date(2026,Number(month),0).getDate()}
function v655InitialSelectedDay(month,now=new Date()){
  const model=getOncallMonthMatrix(month);
  if(now.getFullYear()===2026&&now.getMonth()+1===Number(month)&&[10,11,12].includes(Number(month)))return Math.min(now.getDate(),model.daysInMonth);
  return model.days.find(item=>item.assignments.length>0)?.day||1;
}
function v655SelectDay(day){const next=Number(day);if(Number.isInteger(next)&&next>=1&&next<=v655DayCount(v652Month)){v655SelectedDay=next;renderV652Oncall()}}
function v655FocusEngineer(name){v655FocusedEngineer=ONCALL_ENGINEERS.includes(name)?(v655FocusedEngineer===name?null:name):null;renderV652Oncall()}

function setV652Mode(mode){v652Mode=['overview','matrix','timeline'].includes(mode)?mode:'overview';renderV652Oncall()}
function setV652Month(month){const m=Number(month);if([10,11,12].includes(m)){v652Month=m;v655SelectedDay=v655InitialSelectedDay(m,new Date());v655FocusedEngineer=null;renderV652Oncall()}}

function v652Tabs(){return `<div class="v652-control-deck"><div class="v652-view-tabs" role="tablist" aria-label="Engineer Oncall view"><button type="button" data-oncall-mode="overview" class="${v652Mode==='overview'?'active':''}"><b>◫</b><span>${v652Text('overview')}</span></button><button type="button" data-oncall-mode="matrix" class="${v652Mode==='matrix'?'active':''}"><b>▦</b><span>${v652Text('matrix')}</span></button><button type="button" data-oncall-mode="timeline" class="${v652Mode==='timeline'?'active':''}"><b>↦</b><span>${v652Text('timeline')}</span></button></div><div class="v653-deck-status"><small>${v652Text('selected')}</small><b>${v652MonthName(v652Month)} ${v652Year()}</b><span>${v652Text('coverage')} • ${v652Month===12?'30/31':'100%'}</span></div><div class="v652-month-switch" role="group" aria-label="Oncall month">${[10,11,12].map(m=>`<button type="button" data-oncall-month="${m}" class="${m===v652Month?'active':''}">${v652MonthName(m)}</button>`).join('')}</div></div>`}

function v655PersonMini(row,state){
  const cls=v652PersonClass(row.name),stateText=state==='live'?v652Text('live'):state==='next'?v652Text('nextState'):v652Text('scheduledState');
  return `<article class="v655-person-mini person-${cls} ${state}" aria-label="${v652Esc(`${row.name} ${stateText} ${v652Range(row)}`)}"><span class="v655-person-avatar">${v652Esc(row.name.slice(0,1))}</span><span><small>${stateText}</small><strong>${v652Esc(row.name)}</strong><em>${v652Range(row)}</em></span></article>`;
}

function v655RenderTodayNext(now){
  const current=getOncallAssignmentsForDate(now),next=getNextOncallAssignments(now);
  const currentList=current.length?current.map(row=>v655PersonMini(row,'live')).join(''):`<div class="v655-empty-person">${v652Text('unassigned')}</div>`;
  const nextList=next.length?next.map(row=>v655PersonMini(row,'next')).join(''):`<div class="v655-empty-person">${v652Text('unassigned')}</div>`;
  return `<section class="v652-hero v655-oncall-hero"><div class="v655-hero-copy"><div class="v652-kicker">${v652Text('dutyGrid')} • v6.5.5</div><h2>Engineer Oncall</h2><p>${v652Text('hint')}</p></div><div class="v655-now-columns"><article class="v655-now-panel live"><header><span>●</span><div><small>${v652Text('today')}</small><strong>${v652Text('current')}</strong></div></header><div class="v655-today-list">${currentList}</div></article><article class="v655-now-panel next"><header><span>↦</span><div><small>${v652Text('handoffFlow')}</small><strong>${v652Text('next')}</strong></div></header><div class="v655-next-list">${nextList}</div></article></div></section>`;
}

function v655RenderEngineerStrip(now){
  const model=getOncallMonthMatrix(v652Month),currentNames=new Set(getOncallAssignmentsForDate(now).map(row=>row.name)),nextNames=new Set(getNextOncallAssignments(now).map(row=>row.name));
  const cards=model.engineers.map(name=>{const cls=v652PersonClass(name),focused=v655FocusedEngineer===name,state=currentNames.has(name)?'live':nextNames.has(name)?'next':'scheduled';return `<button type="button" tabindex="0" data-v655-engineer="${v652Esc(name)}" class="v655-engineer-card person-${cls} ${focused?'focused':''} ${state}" aria-pressed="${focused?'true':'false'}" aria-label="${v652Esc(`${v652Text('focus')} ${name}`)}"><span class="v655-engineer-avatar">${v652Esc(name.slice(0,1))}</span><span class="v655-engineer-meta"><small>${state==='live'?v652Text('live'):state==='next'?v652Text('nextState'):v652Text('scheduledState')}</small><strong>${v652Esc(name)}</strong><em>${model.totals[name]} ${v652Text('days')}</em></span><b>${model.totals[name]}</b></button>`}).join('');
  return `<section class="v655-engineer-strip-wrap"><div class="v652-section-head"><div><div class="eyebrow">${v652Text('people')}</div><div class="section-title">${v652Text('engineer')}</div></div></div><div class="v655-engineer-strip">${cards}</div></section>`;
}

function v655RenderMatrix(now,{compact=false}={}){
  const model=getOncallMonthMatrix(v652Month),week=V652_WEEK[v652Locale()],currentNames=new Set(getOncallAssignmentsForDate(now).map(row=>row.name)),nextNames=new Set(getNextOncallAssignments(now).map(row=>row.name));
  const headers=model.days.map(item=>{const dow=week[new Date(2026,v652Month-1,item.day).getDay()],today=v652IsToday(v652Month,item.day,now),selected=item.day===v655SelectedDay;return `<button type="button" data-v655-day="${item.day}" class="v652-matrix-day ${today?'today':''} ${selected?'v655-selected-day':''}" aria-pressed="${selected?'true':'false'}" aria-label="${v652Esc(`${item.day} ${v652MonthName(v652Month)} ${v652Year()}`)}"><small>${dow}</small><b>${item.day}</b></button>`}).join('');
  const rows=model.engineers.map(name=>{
    const person=v652PersonClass(name),focused=v655FocusedEngineer===name;
    const cells=model.days.map(item=>{const assignment=item.assignments.find(row=>row.name===name),active=Boolean(assignment),today=v652IsToday(v652Month,item.day,now),selected=item.day===v655SelectedDay,live=active&&currentNames.has(name)&&today,next=active&&nextNames.has(name),label=active?`${name} • OC • ${item.day} ${v652MonthName(v652Month)} • ${assignment.start}-${assignment.end}`:`${name} • ${item.day} ${v652MonthName(v652Month)} • ${v652Text('unassigned')}`;return `<button type="button" data-v655-cell="${v652Esc(name)}" data-v655-day="${item.day}" class="v652-matrix-cell ${active?'active person-'+person:''} ${today?'today':''} ${selected?'v655-selected-day':''} ${focused?'v655-focused-row':''} ${live?'v655-live':''} ${next?'v655-next':''} ${!active?'v655-unassigned':''}" title="${v652Esc(label)}" aria-label="${v652Esc(label)}">${active?'<b>OC</b>':'<span>·</span>'}</button>`}).join('');
    return `<button type="button" tabindex="0" data-v655-engineer="${v652Esc(name)}" class="v652-matrix-name person-${person} ${focused?'v655-focused-row':''}" aria-pressed="${focused?'true':'false'}" aria-label="${v652Esc(`${v652Text('focus')} ${name}`)}"><i>${v652Esc(name.slice(0,1))}</i><b>${v652Esc(name)}</b><small>${model.totals[name]} ${v652Text('days')}</small></button>${cells}`;
  }).join('');
  return `<section class="hud-panel trace v652-matrix-panel v655-matrix-panel ${compact?'compact':''}"><div class="v652-section-head"><div><div class="eyebrow">${v652Text('dutyGrid')} • ${v652MonthName(v652Month).toUpperCase()}</div><div class="section-title">${v652Text('matrixTitle')}</div><p>${v652Text('matrixSub')}</p></div><span>${model.daysInMonth} ${v652Text('days')}</span></div><div class="v652-matrix-scroll v655-matrix-scroll"><div id="v652MatrixGrid" class="v652-matrix v655-matrix" style="--v652-days:${model.daysInMonth}"><div class="v652-matrix-corner"><b>${v652Text('engineer')}</b><small>${v652MonthName(v652Month)} ${v652Year()}</small></div>${headers}${rows}</div></div><div class="v652-matrix-legend">${model.engineers.map(name=>`<span class="person-${v652PersonClass(name)}"><i></i>${v652Esc(name)} <b>${model.totals[name]}</b></span>`).join('')}${model.unassigned?`<span class="unassigned"><i></i>${v652Text('unassigned')} <b>${model.unassigned}</b></span>`:''}</div></section>`;
}

function v655RenderSelectedDay(now){
  const model=getOncallMonthMatrix(v652Month),day=v655SelectedDay??v655InitialSelectedDay(v652Month,now),item=model.days[day-1],assignments=item?.assignments||[],selectedDate=new Date(2026,v652Month-1,day),next=getNextOncallAssignments(selectedDate);
  const assigned=assignments.length?assignments.map(row=>`<article class="v655-detail-person person-${v652PersonClass(row.name)}"><span>${v652Esc(row.name.slice(0,1))}</span><div><small>${v652Text('assigned')}</small><strong>${v652Esc(row.name)}</strong><em>${v652Range(row)}</em></div></article>`).join(''):`<div class="v655-detail-empty"><b>—</b><span>${v652Text('unassigned')}</span></div>`;
  const handoff=next.length?next.map(row=>`<span class="v655-handoff-chip person-${v652PersonClass(row.name)}"><i>${v652Esc(row.name.slice(0,1))}</i><b>${v652Esc(row.name)}</b><em>${v652Range(row)}</em></span>`).join(''):`<span class="v655-handoff-chip empty">${v652Text('unassigned')}</span>`;
  return `<section class="hud-panel trace v655-selected-day-detail"><div class="v652-section-head"><div><div class="eyebrow">${v652Text('selectedDay')}</div><div class="section-title">${day} ${v652MonthName(v652Month)} ${v652Year()}</div><p>${v652Text('tapDate')}</p></div><span class="${v652IsToday(v652Month,day,now)?'today':''}">${v652IsToday(v652Month,day,now)?v652Text('today'):''}</span></div><div class="v655-detail-grid"><div class="v655-detail-assigned">${assigned}</div><div class="v655-detail-handoff"><small>${v652Text('handoff')}</small>${handoff}</div></div></section>`;
}

function v652Overview(now){return `${v655RenderTodayNext(now)}${v655RenderEngineerStrip(now)}${v655RenderMatrix(now,{compact:true})}${v655RenderSelectedDay(now)}`}
function v652Matrix(now){return `${v655RenderMatrix(now,{compact:false})}${v655RenderSelectedDay(now)}`}

function v652Timeline(now){
  const model=getOncallMonthMatrix(v652Month),rows=oncallByMonth(v652Month);
  const segments=rows.map(row=>`<button type="button" class="v652-timeline-segment person-${v652PersonClass(row.name)} ${v652ActiveRow(row,now)?'active':''}" style="grid-column:${row.start}/${row.end+1}" title="${v652Esc(v652Range(row))}"><b>${v652Esc(row.name)}</b><span>${row.start}–${row.end}</span></button>`).join('');
  const cards=rows.map((row,index)=>`<div class="v652-handoff ${v652ActiveRow(row,now)?'active':''}"><span class="v652-step">${String(index+1).padStart(2,'0')}</span><span class="v652-person-chip person-${v652PersonClass(row.name)}"><i>${v652Esc(row.name.slice(0,1))}</i>${v652Esc(row.name)}</span><span>${v652Range(row)}</span>${index<rows.length-1?'<b>→</b>':''}</div>`).join('');
  return `<section class="hud-panel trace v652-timeline-panel"><div class="v652-section-head"><div><div class="eyebrow">${v652MonthName(v652Month).toUpperCase()} ${v652Year()} • ${v652Text('handoffFlow')}</div><div class="section-title">${v652Text('timelineTitle')}</div><p>${v652Text('timelineSub')}</p></div></div><div id="v652Timeline" class="v652-timeline"><div class="v652-timeline-scale" style="--v652-days:${model.daysInMonth}">${model.days.map(item=>`<span class="${v652IsToday(v652Month,item.day,now)?'today':''}">${item.day}</span>`).join('')}</div><div class="v652-timeline-track" style="--v652-days:${model.daysInMonth}">${segments}</div></div><div class="v652-handoff-list">${cards}</div></section>`;
}

function v655BindInteractions(host){
  host.querySelectorAll('[data-v655-engineer]').forEach(button=>button.addEventListener('click',event=>{if(event.currentTarget.dataset.v655Cell)return;v655FocusEngineer(event.currentTarget.dataset.v655Engineer)}));
  host.querySelectorAll('[data-v655-day]:not([data-v655-cell])').forEach(button=>button.addEventListener('click',()=>v655SelectDay(button.dataset.v655Day)));
  host.querySelectorAll('[data-v655-cell]').forEach(button=>button.addEventListener('click',()=>{v655SelectedDay=Number(button.dataset.v655Day);v655FocusedEngineer=button.dataset.v655Cell;renderV652Oncall()}));
}

function renderV652Oncall(){
  const host=document.getElementById('oncallView');if(!host)return;
  const now=new Date();
  if(v655SelectedDay===null)v655SelectedDay=v655InitialSelectedDay(v652Month,now);
  const content=v652Mode==='matrix'?v652Matrix(now):v652Mode==='timeline'?v652Timeline(now):v652Overview(now);
  host.innerHTML=`<div class="v652-oncall v653-oncall-surface v654-oncall-surface v655-oncall-surface">${v652Tabs()}<div class="v652-pane" data-pane="${v652Mode}">${content}</div></div>`;
  host.querySelectorAll('[data-oncall-mode]').forEach(button=>button.addEventListener('click',()=>setV652Mode(button.dataset.oncallMode)));
  host.querySelectorAll('[data-oncall-month]').forEach(button=>button.addEventListener('click',()=>setV652Month(button.dataset.oncallMonth)));
  v655BindInteractions(host);
}

function installV652Bridge(){const prior=window.showView;if(typeof prior!=='function'||prior.__v652)return;const wrapped=function(name){const out=prior.apply(this,arguments);if(name==='oncall')queueMicrotask(renderV652Oncall);return out};wrapped.__v652=true;window.showView=wrapped}
function initV652(){if(typeof mountV651Navigation==='function')mountV651Navigation();if(typeof mountV651View==='function')mountV651View();installV652Bridge();renderV652Oncall();document.addEventListener('v65:localechange',renderV652Oncall);document.documentElement.dataset.appVersion='6.5.5'}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV652,{once:true});else initV652()}
export {renderV652Oncall,setV652Mode,setV652Month,initV652};
