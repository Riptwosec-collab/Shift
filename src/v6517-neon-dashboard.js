/* Shift v6.5.17 – reference neon dashboard. All figures are derived from the existing roster. */
function v6517Esc(value){
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function v6517Language(){return document.documentElement.lang==='en'?'en':'th'}
function v6517Stats(day){
 const d=crew(day,'D').length,n=crew(day,'N').length,o=crew(day,'O').length;
 return {total:staff.length,day:d,night:n,off:o,working:d+n,coverage:staff.length?Math.round((d+n)/staff.length*100):0};
}
function v6517Chart(selected){
 const series={D:[],N:[],O:[]},max=staff.length||1;
 for(let d=1;d<=31;d++){
   const stat=v6517Stats(d);
   for(const [code,value] of [['D',stat.day],['N',stat.night],['O',stat.off]]){
     series[code].push([12+(d-1)*15.6,130-value/max*106]);
   }
 }
 const poly=key=>series[key].map(x=>x.map(v=>v.toFixed(1)).join(',')).join(' ');
 const x=12+(selected-1)*15.6;
 return `<svg role="img" aria-label="จำนวนพนักงานเวรกลางวัน กลางคืน และหยุด ตลอดเดือนตุลาคม 2569" viewBox="0 0 500 165" preserveAspectRatio="none">
 <title>Shift schedule trends based on October 2026 roster</title>
 <line x1="12" y1="25" x2="486" y2="25" class="v6517-grid-line"/>
 <line x1="12" y1="78" x2="486" y2="78" class="v6517-grid-line"/>
 <line x1="12" y1="130" x2="486" y2="130" class="v6517-grid-line"/>
 <line x1="${x.toFixed(1)}" y1="12" x2="${x.toFixed(1)}" y2="136" class="v6517-trend-selected"/>
 <polyline class="v6517-trend-line green" points="${poly('D')}"/>
 <polyline class="v6517-trend-line blue" points="${poly('N')}"/>
 <polyline class="v6517-trend-line red" points="${poly('O')}"/>
 <g font-size="11" fill="#a5c6df"><text x="12" y="154">1 ต.ค.</text><text x="220" y="154">15</text><text x="462" y="154">31</text></g>
 </svg>`;
}
function v6517Oncall(){
 const now=new Date(),english=v6517Language()==='en';
 const current=typeof getOncallAssignmentsForDate==='function'?getOncallAssignmentsForDate(now):[];
 const next=typeof getNextOncallAssignments==='function'?getNextOncallAssignments(now):[];
 const lines=[];
 for(const row of current.slice(0,3)){
  lines.push(`<div class="v6517-oncall-item"><i class="v6517-dot green"></i><div><b>${v6517Esc(row.name)}</b><small>${english?'On call now':'กำลังเข้าเวร Oncall'} • ${row.start}–${row.end}</small></div></div>`);
 }
 for(const row of next.slice(0,3-lines.length)){
  lines.push(`<div class="v6517-oncall-item"><i class="v6517-dot violet"></i><div><b>${v6517Esc(row.name)}</b><small>${english?'Next assignment':'เวรถัดไป'} • ${row.start}–${row.end}</small></div></div>`);
 }
 return lines.join('')||`<div class="v6517-oncall-item">${english?'No on-call assignment for the current date':'ไม่มีข้อมูลผู้เข้าเวร Oncall สำหรับวันนี้'}</div>`;
}
function v6517MobilePreview(selectedDay){
 const start=Math.floor((selectedDay-1)/14)*14+1,end=Math.min(31,start+13);
 const days=Array.from({length:end-start+1},(_,i)=>start+i);
 const header=`<div class="v6517-mobile-row"><span class="v6517-mobile-name">ทีม / วัน</span>${days.map(day=>`<button type="button" data-v6517-day="${day}" class="${selectedDay===day?'selected':''}" aria-label="วันที่ ${day}">${day}</button>`).join('')}</div>`;
 const rows=staff.map((person,i)=>`<div class="v6517-mobile-row"><span class="v6517-mobile-name" title="${v6517Esc(person.name)}">${v6517Esc(person.name)}</span>${days.map(day=>{
   const code=statusAt(i,day);
   return `<button type="button" class="${code} ${selectedDay===day?'selected':''}" data-v6517-day="${day}" data-v6517-person="${i}" aria-label="${v6517Esc(person.name)} วันที่ ${day} ${v6517Esc(label(code))}"></button>`;
 }).join('')}</div>`).join('');
 return header+rows;
}
function v6517Render(){
 const root=document.getElementById('v6517Dashboard');
 if(!root)return;
 const lang=v6517Language(),en=lang==='en';
 const day=Math.max(1,Math.min(31,Number(selectedDay)||1)),stat=v6517Stats(day);
 const pct=code=>stat.total?Math.round(stat[code]/stat.total*100):0;
 const current=v6517Stats(day),prev=v6517Stats(Math.max(1,day-1));
 const date=document.getElementById('v6517Date'),today=new Date(),isOctober=today.getFullYear()===2026&&today.getMonth()===9;
 if(date)date.textContent=en?`Oct ${day}, 2026`:`${day} ตุลาคม 2569`;
 const todayButton=root.querySelector('[data-v6517-action="today"]');
 if(todayButton){todayButton.disabled=!isOctober;todayButton.title=isOctober?(en?'Jump to today':'ไปวันนี้'):(en?'The loaded roster is October 2026':'ข้อมูลตารางนี้เป็นเดือนตุลาคม 2569')}
 const numbers={total:stat.total,working:stat.working,day:stat.day,night:stat.night,off:stat.off};
 root.querySelectorAll('[data-v6517-count]').forEach(node=>{
  const name=node.getAttribute('data-v6517-count');
  node.textContent=String(numbers[name]??'—');
 });
 const ring=root.querySelector('#v6517Donut');
 if(ring){
  ring.style.setProperty('--p1',pct('day')+'%');
  ring.style.setProperty('--p2',(pct('day')+pct('night'))+'%');
 }
 const labels={day:en?'Day':'กลางวัน',night:en?'Night':'กลางคืน',off:en?'Off':'หยุด'};
 const legend=root.querySelector('#v6517Legend');
 if(legend)legend.innerHTML=[['day','green'],['night','blue'],['off','red']].map(([name,color])=>
 `<div class="v6517-legend-row"><span><i class="v6517-dot ${color}"></i>${labels[name]}</span><b>${stat[name]} • ${pct(name)}%</b></div>`).join('');
 const ratio=root.querySelector('#v6517Percent');
 if(ratio)ratio.textContent=stat.coverage+'%';
 const trend=root.querySelector('#v6517Trend');
 if(trend)trend.innerHTML=v6517Chart(day);
 const oncall=root.querySelector('#v6517Oncall');
 if(oncall)oncall.innerHTML=v6517Oncall();
 const cards=root.querySelector('#v6517Notes');
 if(cards){
  const change=stat.working-prev.working;
  const entries=[
   [en?'Selected roster date':'วันที่เลือก',en?`October ${day}, 2026`:`${day} ต.ค. 2569`,'blue'],
   [en?'Working vs previous day':'เข้าเวรเทียบวันก่อน',day===1?'—':(change>0?'+':'')+change+' '+(en?'people':'คน'),'green'],
   [en?'Roster coverage':'สัดส่วนผู้เข้าเวร',stat.coverage+'%','violet']
  ];
  cards.innerHTML=entries.map(([title,value,color])=>
   `<div class="v6517-note"><span><i class="v6517-dot ${color}"></i>${title}</span><b>${v6517Esc(value)}</b></div>`).join('');
 }
 const preview=root.querySelector('#v6517MobileMatrix');
 if(preview)preview.innerHTML=v6517MobilePreview(day);
}
function v6517Init(){
 const view=document.getElementById('overviewView');
 if(!view||document.getElementById('v6517Dashboard')||typeof crew!=='function'||!Array.isArray(staff))return;
 document.documentElement.dataset.appVersion='6.5.17';
 const brand=document.querySelector('.brand-copy h1');
 if(brand){brand.innerHTML='SHIFT <em>PRO</em>';brand.setAttribute('aria-label','Shift Pro Command Center')}
 const subtitle=document.querySelector('.brand-copy p');
 if(subtitle)subtitle.textContent='WORKFORCE SCHEDULING';
 const deck=document.createElement('div');
 deck.id='v6517Dashboard';
 deck.className='v6517-dashboard';
 deck.innerHTML=`
  <section class="v6517-banner v6517-glass" aria-label="Dashboard header">
   <div><h2>SHIFT <span>PRO</span> <small style="font-size:.48em;color:#a8daff">• DASHBOARD</small></h2>
    <p>ตารางเวรและกำลังคนจากข้อมูลจริง • ตุลาคม 2569</p></div>
   <div class="v6517-actions">
    <button type="button" data-v6517-action="previous" aria-label="วันก่อนหน้า">‹</button>
    <span class="v6517-date" id="v6517Date"></span>
    <button type="button" data-v6517-action="next" aria-label="วันถัดไป">›</button>
    <button type="button" data-v6517-action="today" aria-label="ไปวันนี้">วันนี้</button>
   </div>
  </section>
  <div class="v6517-kpis" id="v6517Kpis">
   <section class="v6517-kpi v6517-glass"><span class="v6517-kpi-icon" aria-hidden="true">♙</span><div class="v6517-kpi-copy"><span class="v6517-kpi-label">พนักงานทั้งหมด</span><b class="v6517-kpi-value" data-v6517-count="total">—</b><small class="v6517-kpi-note">จากข้อมูลตารางจริง</small></div></section>
   <section class="v6517-kpi v6517-glass v6517-kpi--green"><span class="v6517-kpi-icon" aria-hidden="true">✓</span><div class="v6517-kpi-copy"><span class="v6517-kpi-label">เข้าเวรวันนี้ที่เลือก</span><b class="v6517-kpi-value" data-v6517-count="working">—</b><small class="v6517-kpi-note">กะกลางวัน + กลางคืน</small></div></section>
   <section class="v6517-kpi v6517-glass v6517-kpi--blue"><span class="v6517-kpi-icon" aria-hidden="true">☀</span><div class="v6517-kpi-copy"><span class="v6517-kpi-label">เวรกลางวัน</span><b class="v6517-kpi-value" data-v6517-count="day">—</b><small class="v6517-kpi-note">DAY • D</small></div></section>
   <section class="v6517-kpi v6517-glass v6517-kpi--violet"><span class="v6517-kpi-icon" aria-hidden="true">☾</span><div class="v6517-kpi-copy"><span class="v6517-kpi-label">เวรกลางคืน</span><b class="v6517-kpi-value" data-v6517-count="night">—</b><small class="v6517-kpi-note">NIGHT • N</small></div></section>
   <section class="v6517-kpi v6517-glass v6517-kpi--red"><span class="v6517-kpi-icon" aria-hidden="true">×</span><div class="v6517-kpi-copy"><span class="v6517-kpi-label">วันหยุด</span><b class="v6517-kpi-value" data-v6517-count="off">—</b><small class="v6517-kpi-note">OFF • O</small></div></section>
  </div>
  <div class="v6517-main-grid">
   <section class="v6517-matrix v6517-glass" aria-label="Monthly shift matrix">
    <div id="v6517MatrixTarget"></div>
    <div class="v6517-mobile-matrix" id="v6517MobileMatrix" aria-label="ตัวอย่างตารางเวรบนมือถือ"></div>
   </section>
   <div class="v6517-side-grid">
    <section class="v6517-ratio-panel v6517-glass"><header class="v6517-panel-header"><strong>◉ กำลังคนวันที่เลือก</strong></header>
     <div class="v6517-donut-wrap"><div class="v6517-donut" id="v6517Donut"><span class="v6517-donut-center"><span id="v6517Percent">0%</span><small>เข้าเวร</small></span></div><div class="v6517-legend" id="v6517Legend"></div></div>
    </section>
    <section class="v6517-shifts-panel v6517-glass"><header class="v6517-panel-header"><strong>◷ สรุปกะงาน</strong></header>
     <div class="v6517-shifts">
      <div class="v6517-shift v6517-shift--day"><span>☀ DAY</span><b data-v6517-count="day">0</b></div>
      <div class="v6517-shift v6517-shift--night"><span>☾ NIGHT</span><b data-v6517-count="night">0</b></div>
      <div class="v6517-shift v6517-shift--off"><span>◌ OFF</span><b data-v6517-count="off">0</b></div>
     </div>
    </section>
   </div>
  </div>
  <div class="v6517-bottom-grid">
   <section class="v6517-oncall-panel v6517-glass"><header class="v6517-panel-header"><strong>⌁ Engineer Oncall</strong><span class="v6517-caption">ตามตารางที่มีข้อมูล</span></header><div class="v6517-oncall-list" id="v6517Oncall"></div></section>
   <section class="v6517-trend-panel v6517-glass"><header class="v6517-panel-header"><strong>≋ แนวโน้มกำลังคน 31 วัน</strong><span class="v6517-caption"><i class="v6517-dot green"></i>Day <i class="v6517-dot blue"></i>Night <i class="v6517-dot red"></i>Off</span></header><div class="v6517-trend" id="v6517Trend"></div></section>
   <section class="v6517-insights-panel v6517-glass"><header class="v6517-panel-header"><strong>◷ สรุปจากตารางเวร</strong><span class="v6517-caption">ข้อมูลจริง</span></header><div class="v6517-notes" id="v6517Notes"></div></section>
  </div>`;
 view.insertBefore(deck,view.firstElementChild);
 const matrix=document.getElementById('overviewMonthMatrix');
 if(!matrix)return;
 const snapshot=view.querySelector('.lower-grid .month-snapshot');
 if(snapshot)deck.querySelector('#v6517MatrixTarget')?.appendChild(snapshot);
 let scheduled=false;
 const render=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;v6517Render()})};
 if(typeof window.renderOverview==='function'){
  const old=window.renderOverview;
  window.renderOverview=function(){const result=old.apply(this,arguments);render();return result};
 }
 deck.addEventListener('click',event=>{
  const button=event.target.closest?.('button');
  if(!button||!deck.contains(button))return;
  const action=button.dataset.v6517Action;
  if(action==='previous'&&selectedDay>1)setSelectedDay(selectedDay-1,false);
  if(action==='next'&&selectedDay<31)setSelectedDay(selectedDay+1,false);
  if(action==='today'){
    const now=new Date();if(now.getFullYear()===2026&&now.getMonth()===9)setSelectedDay(now.getDate(),false);
  }
  if(button.hasAttribute('data-v6517-day')){
   const person=button.hasAttribute('data-v6517-person')?Number(button.dataset.v6517Person):null;
   const day=Number(button.dataset.v6517Day);
   if(Number.isInteger(day)&&day>=1&&day<=31){
    if(person!==null&&typeof openCellModal==='function')openCellModal(person,day);
    else setSelectedDay(day,false);
   }
  }
 });
 document.addEventListener('click',event=>{if(event.target.closest?.('.v65-language button'))requestAnimationFrame(render)},true);
 window.addEventListener('pageshow',render);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
 render();
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v6517Init,{once:true});
 else v6517Init();
}
