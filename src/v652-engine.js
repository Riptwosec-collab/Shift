// v6.5.2 Engineer Oncall — Overview / Matrix / Timeline upgrade.
const V652_MONTHS={th:{10:'ตุลาคม',11:'พฤศจิกายน',12:'ธันวาคม'},en:{10:'October',11:'November',12:'December'}};
const V652_WEEK={th:['อา','จ','อ','พ','พฤ','ศ','ส'],en:['Su','Mo','Tu','We','Th','Fr','Sa']};
let v652Mode='overview';
let v652Month=(()=>{const m=new Date().getMonth()+1;return [10,11,12].includes(m)?m:10})();

function v652Locale(){return typeof v65I18n!=='undefined'?v65I18n.getLocale():(document.documentElement.dataset.locale||'th')}
function v652Text(key){const copy={
  th:{overview:'ภาพรวม',matrix:'Matrix',timeline:'Timeline',current:'ON-CALL วันนี้',next:'เวรถัดไป',today:'วันนี้',engineer:'Engineer',days:'วัน',unassigned:'ยังไม่กำหนด',monthSchedule:'ตารางประจำเดือน',rotation:'รอบ On-call',period:'ช่วงวันที่',status:'สถานะ',active:'ACTIVE ONCALL',scheduled:'SCHEDULED',total:'รวมวัน On-call',hint:'เลือกมุมมองและเดือนเพื่อดูเวร Engineer แบบละเอียด',dutyGrid:'ENGINEER DUTY GRID',matrixTitle:'Oncall Matrix',matrixSub:'มองวันและผู้รับผิดชอบได้ในตารางเดียว',timelineTitle:'Oncall Timeline',timelineSub:'ลำดับการส่งต่อเวรตลอดทั้งเดือน'},
  en:{overview:'Overview',matrix:'Matrix',timeline:'Timeline',current:'ON-CALL TODAY',next:'NEXT HANDOFF',today:'Today',engineer:'Engineer',days:'days',unassigned:'Unassigned',monthSchedule:'Monthly Schedule',rotation:'On-call Rotation',period:'Period',status:'Status',active:'ACTIVE ONCALL',scheduled:'SCHEDULED',total:'Total On-call Days',hint:'Switch view and month to inspect Engineer on-call coverage',dutyGrid:'ENGINEER DUTY GRID',matrixTitle:'Oncall Matrix',matrixSub:'See dates and duty ownership in one grid',timelineTitle:'Oncall Timeline',timelineSub:'Handoff sequence across the selected month'}};return copy[v652Locale()]?.[key]??copy.th[key]??key}
function v652MonthName(month){return V652_MONTHS[v652Locale()]?.[month]||String(month)}
function v652Year(){return v652Locale()==='th'?'2569':'2026'}
function v652Range(row){return `${row.start}–${row.end} ${v652MonthName(row.month)} ${v652Year()}`}
function v652Esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]))}
function v652PersonClass(name){return {'ป้อ':'pao','เอิร์ท':'earth','ตั้ม':'tum','แอม':'am'}[name]||'none'}
function v652IsToday(month,day,now=new Date()){return now.getFullYear()===2026&&now.getMonth()+1===month&&now.getDate()===day}
function v652ActiveRow(row,now=new Date()){return now.getFullYear()===2026&&now.getMonth()+1===row.month&&now.getDate()>=row.start&&now.getDate()<=row.end}

function setV652Mode(mode){v652Mode=['overview','matrix','timeline'].includes(mode)?mode:'overview';renderV652Oncall()}
function setV652Month(month){const m=Number(month);if([10,11,12].includes(m)){v652Month=m;renderV652Oncall()}}

function v652Tabs(){return `<div class="v652-control-deck"><div class="v652-view-tabs" role="tablist" aria-label="Engineer Oncall view"><button type="button" data-oncall-mode="overview" class="${v652Mode==='overview'?'active':''}"><b>◫</b><span>${v652Text('overview')}</span></button><button type="button" data-oncall-mode="matrix" class="${v652Mode==='matrix'?'active':''}"><b>▦</b><span>${v652Text('matrix')}</span></button><button type="button" data-oncall-mode="timeline" class="${v652Mode==='timeline'?'active':''}"><b>↦</b><span>${v652Text('timeline')}</span></button></div><div class="v652-month-switch" role="group" aria-label="Oncall month">${[10,11,12].map(m=>`<button type="button" data-oncall-month="${m}" class="${m===v652Month?'active':''}">${v652MonthName(m)}</button>`).join('')}</div></div>`}

function v652Overview(now){
  const current=getOncallForDate(now),next=getNextOncall(now),matrix=getOncallMonthMatrix(v652Month),rows=oncallByMonth(v652Month);
  const stats=matrix.engineers.map(name=>`<div class="v652-stat person-${v652PersonClass(name)}"><span class="v652-stat-orb">${v652Esc(name.slice(0,1))}</span><span><small>${v652Text('total')}</small><b>${v652Esc(name)}</b></span><strong>${matrix.totals[name]}<em>${v652Text('days')}</em></strong></div>`).join('');
  const table=rows.map(row=>`<tr class="${v652ActiveRow(row,now)?'active':''}"><td><span class="v652-person-chip person-${v652PersonClass(row.name)}"><i>${v652Esc(row.name.slice(0,1))}</i>${v652Esc(row.name)}</span></td><td>${v652Range(row)}</td><td><span class="v652-status ${v652ActiveRow(row,now)?'live':''}">${v652ActiveRow(row,now)?v652Text('active'):v652Text('scheduled')}</span></td></tr>`).join('');
  return `<section class="v652-hero"><div><div class="v652-kicker">${v652Text('dutyGrid')} • v6.5.2</div><h2>Engineer Oncall</h2><p>${v652Text('hint')}</p></div><div class="v652-now-grid"><article class="v652-now-card live"><small>${v652Text('current')}</small><strong>${current?v652Esc(current.name):v652Text('unassigned')}</strong><span>${current?v652Range(current):'—'}</span><em>● LIVE</em></article><article class="v652-now-card"><small>${v652Text('next')}</small><strong>${next?v652Esc(next.name):'—'}</strong><span>${next?v652Range(next):'—'}</span><em>↦ HANDOFF</em></article></div></section><div class="v652-stat-grid">${stats}</div><section class="hud-panel trace v652-overview-table"><div class="v652-section-head"><div><div class="eyebrow">${v652MonthName(v652Month).toUpperCase()} ${v652Year()}</div><div class="section-title">${v652Text('monthSchedule')}</div></div><span>${rows.length} ${v652Text('rotation')}</span></div><div class="v652-table-wrap"><table><thead><tr><th>${v652Text('engineer')}</th><th>${v652Text('period')}</th><th>${v652Text('status')}</th></tr></thead><tbody>${table}</tbody></table></div></section>`;
}

function v652Matrix(now){
  const model=getOncallMonthMatrix(v652Month),week=V652_WEEK[v652Locale()];
  const headers=model.days.map(item=>{const dow=week[new Date(2026,v652Month-1,item.day).getDay()];return `<div class="v652-matrix-day ${v652IsToday(v652Month,item.day,now)?'today':''}"><small>${dow}</small><b>${item.day}</b></div>`}).join('');
  const rows=model.engineers.map(name=>`<div class="v652-matrix-name person-${v652PersonClass(name)}"><i>${v652Esc(name.slice(0,1))}</i><b>${v652Esc(name)}</b><small>${model.totals[name]} ${v652Text('days')}</small></div>${model.days.map(item=>{const active=item.name===name,today=v652IsToday(v652Month,item.day,now),label=active?`${name} • ${item.day} ${v652MonthName(v652Month)} • ${item.start}-${item.end}`:`${name} • ${item.day} ${v652MonthName(v652Month)}`;return `<div class="v652-matrix-cell ${active?'active person-'+v652PersonClass(name):''} ${today?'today':''}" title="${v652Esc(label)}" aria-label="${v652Esc(label)}">${active?'<b>OC</b>':'<span>·</span>'}</div>`}).join('')}`).join('');
  return `<section class="hud-panel trace v652-matrix-panel"><div class="v652-section-head"><div><div class="eyebrow">${v652Text('dutyGrid')} • ${v652MonthName(v652Month).toUpperCase()}</div><div class="section-title">${v652Text('matrixTitle')}</div><p>${v652Text('matrixSub')}</p></div><span>${model.daysInMonth} ${v652Text('days')}</span></div><div class="v652-matrix-scroll"><div id="v652MatrixGrid" class="v652-matrix" style="--v652-days:${model.daysInMonth}"><div class="v652-matrix-corner"><b>${v652Text('engineer')}</b><small>${v652MonthName(v652Month)} ${v652Year()}</small></div>${headers}${rows}</div></div><div class="v652-matrix-legend">${model.engineers.map(name=>`<span class="person-${v652PersonClass(name)}"><i></i>${v652Esc(name)} <b>${model.totals[name]}</b></span>`).join('')}${model.unassigned?`<span class="unassigned"><i></i>${v652Text('unassigned')} <b>${model.unassigned}</b></span>`:''}</div></section>`;
}

function v652Timeline(now){
  const model=getOncallMonthMatrix(v652Month),rows=oncallByMonth(v652Month);
  const segments=rows.map(row=>`<button type="button" class="v652-timeline-segment person-${v652PersonClass(row.name)} ${v652ActiveRow(row,now)?'active':''}" style="grid-column:${row.start}/${row.end+1}" title="${v652Esc(v652Range(row))}"><b>${v652Esc(row.name)}</b><span>${row.start}–${row.end}</span></button>`).join('');
  const cards=rows.map((row,index)=>`<div class="v652-handoff ${v652ActiveRow(row,now)?'active':''}"><span class="v652-step">${String(index+1).padStart(2,'0')}</span><span class="v652-person-chip person-${v652PersonClass(row.name)}"><i>${v652Esc(row.name.slice(0,1))}</i>${v652Esc(row.name)}</span><span>${v652Range(row)}</span>${index<rows.length-1?'<b>→</b>':''}</div>`).join('');
  return `<section class="hud-panel trace v652-timeline-panel"><div class="v652-section-head"><div><div class="eyebrow">${v652MonthName(v652Month).toUpperCase()} ${v652Year()}</div><div class="section-title">${v652Text('timelineTitle')}</div><p>${v652Text('timelineSub')}</p></div></div><div id="v652Timeline" class="v652-timeline"><div class="v652-timeline-scale">${model.days.map(item=>`<span class="${v652IsToday(v652Month,item.day,now)?'today':''}">${item.day}</span>`).join('')}</div><div class="v652-timeline-track" style="--v652-days:${model.daysInMonth}">${segments}</div></div><div class="v652-handoff-list">${cards}</div></section>`;
}

function renderV652Oncall(){
  const host=document.getElementById('oncallView');if(!host)return;
  const now=new Date();
  const content=v652Mode==='matrix'?v652Matrix(now):v652Mode==='timeline'?v652Timeline(now):v652Overview(now);
  host.innerHTML=`<div class="v652-oncall">${v652Tabs()}<div class="v652-pane" data-pane="${v652Mode}">${content}</div></div>`;
  host.querySelectorAll('[data-oncall-mode]').forEach(button=>button.addEventListener('click',()=>setV652Mode(button.dataset.oncallMode)));
  host.querySelectorAll('[data-oncall-month]').forEach(button=>button.addEventListener('click',()=>setV652Month(button.dataset.oncallMonth)));
}

function installV652Bridge(){const prior=window.showView;if(typeof prior!=='function'||prior.__v652)return;const wrapped=function(name){const out=prior.apply(this,arguments);if(name==='oncall')queueMicrotask(renderV652Oncall);return out};wrapped.__v652=true;window.showView=wrapped}
function initV652(){if(typeof mountV651Navigation==='function')mountV651Navigation();if(typeof mountV651View==='function')mountV651View();installV652Bridge();renderV652Oncall();document.addEventListener('v65:localechange',renderV652Oncall);document.documentElement.dataset.appVersion='6.5.2'}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV652,{once:true});else initV652()}
export {renderV652Oncall,setV652Mode,setV652Month,initV652};
