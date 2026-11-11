/* Shift V7.3: make November 2026 discoverable and the actual November landing screen.
   Does not change any roster arrays, October features, or source schedule details. */
function shift731Today(){
 const values={};
 const date=new Date();
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 for(const p of parts)if(p.type==='year'||p.type==='month'||p.type==='day')values[p.type]=Number(p.value);
 return values;
}
function shift731InitialMonth(today,search='',saved='10'){
 const query=new URLSearchParams(String(search).replace(/^\?/,''));
 const explicit=query.get('month');
 if(explicit==='10'||explicit==='11')return {month:explicit,openMonth:query.get('view')!=='overview'};
 // Nov 2026 takes priority over a stale October preference stored in previous visits.
 if(today.year===2026&&today.month===11)
  return {month:'11',openMonth:query.get('view')==='month'};
 return {month:saved==='11'?'11':'10',openMonth:query.get('view')==='month'};
}
function shift731MarkNavigation(){
 const isNov=document.getElementById('monthView')?.classList.contains('active')&&
  document.querySelector('#monthView .month-panel')?.dataset.shiftMonth==='11';
 document.querySelectorAll('[data-shift731-open-nov]').forEach(el=>{
  el.classList.toggle('shift731-active',Boolean(isNov));
  el.setAttribute('aria-current',isNov?'page':'false');
 });
}
function shift731Open(month='11',{navigate=true,graphic=true}={}){
 if(month!=='10'&&month!=='11')month='11';
 if(!document.getElementById('shiftNovemberView')&&typeof shiftNovInit==='function')shiftNovInit();
 if(typeof shiftNovChangeMonth==='function')shiftNovChangeMonth(month);
 if(month==='11'&&graphic){
  if(!document.getElementById('shift72Graphic')&&typeof shift72Init==='function')shift72Init();
  if(typeof shift72Mode!=='undefined')shift72Mode='graphic';
  if(typeof shift72ApplyMode==='function')shift72ApplyMode();
 }
 if(navigate&&typeof showView==='function')showView('month');
 shift731MarkNavigation();
 return document.querySelector('#monthView .month-panel')?.dataset.shiftMonth===month;
}
function shift731InsertMenus(){
 const head=document.querySelector('.command-bar .command-actions');
 if(head&&!head.querySelector('[data-shift731-open-nov]')){
  const btn=document.createElement('button');
  btn.type='button';btn.className='shift731-header-btn';
  btn.setAttribute('data-shift731-open-nov','');
  btn.setAttribute('aria-label','เปิดกราฟิกตารางเวรเดือนพฤศจิกายน 2569');
  btn.innerHTML='<span aria-hidden="true">▦</span><strong>พฤศจิกายน 2569</strong>';
  head.prepend(btn);
 }
 const tabs=document.querySelector('.command-bar .nav-tabs');
 if(tabs&&!tabs.querySelector('[data-shift731-open-nov]')){
  const btn=document.createElement('button');
  btn.type='button';btn.className='nav-btn shift731-tab';
  btn.setAttribute('data-shift731-open-nov','');
  btn.setAttribute('aria-label','เปิดตารางเวรพฤศจิกายน 2569');
  btn.innerHTML='<b>▦ พฤศจิกายน</b><span>November 2026</span>';
  tabs.append(btn);
 }
 const mobile=document.getElementById('mobileNav');
 if(mobile&&!mobile.querySelector('[data-shift731-open-nov]')){
  const btn=document.createElement('button');
  btn.type='button';btn.className='shift731-mobile-btn';
  btn.setAttribute('data-shift731-open-nov','');
  btn.setAttribute('aria-label','ดูตารางเวรพฤศจิกายน 2569');
  btn.innerHTML='<b>▦</b>พ.ย.';
  const month=mobile.querySelector('[data-view="month"]');
  if(month)month.after(btn);else mobile.append(btn);
 }
}
function shift731Boot(){
 const overview=document.getElementById('overviewView');
 const month=document.getElementById('monthView');
 if(!overview||!month||document.documentElement.dataset.shift731==='ready')return;
 if(typeof NOVEMBER_2026_DUTY_POSITIONS==='undefined'||typeof shiftNovChangeMonth!=='function')return;
 shift731InsertMenus();
 const today=shift731Today();
 let saved='10';try{saved=localStorage.getItem('shift-month-view-2026')||'10'}catch{}
 const search=typeof location!=='undefined'?location.search:'';
 const initial=shift731InitialMonth(today,search,saved);
 // Restore November as the current month; do not let last month's localStorage override it.
 shift731Open(initial.month,{navigate:initial.openMonth,graphic:initial.month==='11'});
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-shift731-open-nov]');
  if(!button)return;
  event.preventDefault();
  shift731Open('11',{navigate:true,graphic:true});
 });
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-view],[data-shift-month]');
  if(button&&document.contains(button))queueMicrotask(shift731MarkNavigation);
 });
 document.documentElement.dataset.shift731='ready';
 document.documentElement.dataset.shiftRelease='7.3';
 const logo=document.querySelector('.command-bar .brand-copy p');
 if(logo)logo.textContent='October & November 2026 • Shift Viewer';
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shift731Boot,{once:true});
 else shift731Boot();
}