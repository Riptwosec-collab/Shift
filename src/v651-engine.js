// v6.5.1 Engineer Oncall: additive tab + approved rotation, preserving the legacy shell.
const V651_MONTHS={
  th:{10:'ตุลาคม',11:'พฤศจิกายน',12:'ธันวาคม'},
  en:{10:'October',11:'November',12:'December'}
};

function v651Locale(){return typeof v65I18n!=='undefined'?v65I18n.getLocale():(document.documentElement.dataset.locale||'th')}
function v651Text(key){
  const locale=v651Locale();
  const copy={
    th:{title:'Engineer Oncall',sub:'ตารางเวร Engineer On-call • ตุลาคม–ธันวาคม 2569',current:'ON-CALL วันนี้',next:'ส่งต่อเวรถัดไป',none:'ไม่มี Engineer On-call วันนี้',schedule:'ตาราง Engineer Oncall',scheduleSub:'ON-CALL ROTATION • 2569',month:'เดือน',engineer:'Engineer',period:'ช่วงวันที่',status:'สถานะ',active:'ACTIVE ONCALL',scheduled:'SCHEDULED',handoff:'เริ่มเวรถัดไป'},
    en:{title:'Engineer Oncall',sub:'Engineer on-call rotation • October–December 2026',current:'ON-CALL TODAY',next:'NEXT HANDOFF',none:'No Engineer On-call today',schedule:'Engineer Oncall Schedule',scheduleSub:'ON-CALL ROTATION • 2026',month:'Month',engineer:'Engineer',period:'Period',status:'Status',active:'ACTIVE ONCALL',scheduled:'SCHEDULED',handoff:'Next rotation starts'}
  };
  return copy[locale]?.[key]??copy.th[key]??key;
}
function v651Month(month){return V651_MONTHS[v651Locale()]?.[month]||String(month)}
function v651Range(row){const year=v651Locale()==='th'?'2569':'2026';return `${row.start}–${row.end} ${v651Month(row.month)} ${year}`}
function v651DateLabel(row){if(!row)return '—';const year=v651Locale()==='th'?'2569':'2026';return `${row.start} ${v651Month(row.month)} ${year}`}
function v651IsActive(row,now=new Date()){return now.getFullYear()===2026&&now.getMonth()+1===row.month&&now.getDate()>=row.start&&now.getDate()<=row.end}
function v651Escape(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

function suppressV64DailyOps(){
  const view=document.getElementById('dailyView');
  if(!view)return null;
  document.getElementById('v64DailyOps')?.remove();
  // Keep legacy floating summary absent on every render and navigation.
  document.getElementById('v64StickyDaily')?.remove();
  return null;
}
if(typeof ensureV64DailyOps==='function')ensureV64DailyOps=suppressV64DailyOps;

function renderV651Oncall(){
  const host=document.getElementById('oncallView');if(!host)return;
  const now=new Date(),current=getOncallForDate(now),next=getNextOncall(now);
  const monthCards=[10,11,12].map(month=>{
    const rows=oncallByMonth(month);
    return `<section class="hud-panel trace v651-month-card"><div class="v651-month-head"><b>${v651Month(month)} <span>${v651Locale()==='th'?'2569':'2026'}</span></b><span>${rows.length} ROTATIONS</span></div><div class="v651-rotation">${rows.map(row=>`<div class="v651-slot ${v651IsActive(row,now)?'active':''}"><span class="v651-person"><i class="v651-avatar">${v651Escape(row.name.slice(0,1))}</i><b>${v651Escape(row.name)}</b></span><span>${v651Range(row)}</span></div>`).join('')}</div></section>`
  }).join('');
  const tableRows=ONCALL_SCHEDULE.map(row=>`<tr class="${v651IsActive(row,now)?'active':''}"><td>${v651Month(row.month)}</td><td class="who">${v651Escape(row.name)}</td><td>${v651Range(row)}</td><td><span class="status">${v651IsActive(row,now)?v651Text('active'):v651Text('scheduled')}</span></td></tr>`).join('');
  host.innerHTML=`<div class="v651-oncall"><section class="v651-oncall-hero"><div class="v651-oncall-copy"><div class="v651-oncall-kicker">ENGINEER DUTY GRID • v6.5.1</div><h2 class="v651-oncall-title">${v651Text('title')}</h2><div class="v651-oncall-sub">${v651Text('sub')}</div></div><div class="v651-oncall-current"><div class="v651-current-card"><span class="v651-oncall-label">${v651Text('current')}</span><strong class="v651-oncall-name">${current?v651Escape(current.name):v651Text('none')}${current?'<em class="v651-live-badge">LIVE</em>':''}</strong><span class="v651-oncall-range">${current?v651Range(current):'—'}</span></div><div class="v651-next-card"><span class="v651-oncall-label">${v651Text('next')}</span><strong class="v651-oncall-name">${next?v651Escape(next.name):'—'}</strong><span class="v651-oncall-range">${next?`${v651Text('handoff')} • ${v651DateLabel(next)}`:'—'}</span></div></div></section><div class="v651-month-grid">${monthCards}</div><section class="hud-panel trace v651-table-panel"><div class="v651-table-head"><div><div class="eyebrow">${v651Text('scheduleSub')}</div><div class="section-title">${v651Text('schedule')}</div></div><span class="muted">15 ROTATIONS</span></div><div class="v651-oncall-table-wrap"><table class="v651-oncall-table"><thead><tr><th>${v651Text('month')}</th><th>${v651Text('engineer')}</th><th>${v651Text('period')}</th><th>${v651Text('status')}</th></tr></thead><tbody>${tableRows}</tbody></table></div></section></div>`;
}

function mountV651Navigation(){
  const desktop=document.querySelector('.nav-tabs');
  if(desktop&&!desktop.querySelector('[data-view="oncall"]')){
    const button=document.createElement('button');button.className='nav-btn';button.dataset.view='oncall';button.setAttribute('aria-label','Engineer Oncall');button.innerHTML='<b>⌁ Engineer</b><span>Oncall</span>';button.onclick=()=>window.showView('oncall');desktop.appendChild(button);
  }
  const mobile=document.getElementById('mobileNav')||document.querySelector('.mobile-nav');
  if(mobile&&!mobile.querySelector('[data-view="oncall"]')){
    const button=document.createElement('button');button.type='button';button.dataset.view='oncall';button.innerHTML='<b>⌁</b><span>Oncall</span>';button.setAttribute('aria-label','Engineer Oncall');button.onclick=()=>window.showView('oncall');mobile.appendChild(button);
  }
}
function mountV651View(){
  if(document.getElementById('oncallView'))return;
  const view=document.createElement('section');view.className='view';view.id='oncallView';view.setAttribute('aria-label','Engineer Oncall');
  const footer=document.querySelector('.footer');(footer?.parentElement||document.querySelector('.app')||document.body).insertBefore(view,footer||null);
}
function installV651ViewBridge(){
  const prior=window.showView;if(typeof prior!=='function'||prior.__v651)return;
  const wrapped=function(name){const result=prior.apply(this,arguments);if(name==='daily')queueMicrotask(suppressV64DailyOps);return result};wrapped.__v651=true;window.showView=wrapped;
}
function initV651(){mountV651Navigation();mountV651View();installV651ViewBridge();suppressV64DailyOps();document.addEventListener('v65:localechange',()=>{mountV651Navigation();renderV651Oncall();suppressV64DailyOps()});document.documentElement.dataset.appVersion='6.5.1'}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV651,{once:true});else initV651()}
export {mountV651Navigation,mountV651View,renderV651Oncall,suppressV64DailyOps,initV651};
