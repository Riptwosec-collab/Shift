// v6.4 additive engine: preserve legacy visual shell and add behavior only.
// Keyboard contract: Ctrl+K / Cmd+K, ArrowDown, ArrowUp, Enter, Escape.

const v64State=createAppState();
const v64Cache=createScheduleCache(STAFF);
const v64Views=createLazyViewRegistry();
const v64Mounted=new Set(['overview']);
let v64PaletteIndex=0;
let v64PaletteItems=[];

function v64El(id){return document.getElementById(id)}
function v64Esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function v64StatusClass(code){return code==='D'?'d':code==='N'?'n':'o'}
function v64StatusLabel(code){return code==='O'?'OFF':code}
function v64ClampDay(day){return Math.max(1,Math.min(31,Number(day)||1))}

function setVisualMode(mode){
  const next=['HIGH','BALANCED','ECO'].includes(mode)?mode:'BALANCED';
  v64State.setVisualMode(next);
  document.documentElement.dataset.v64Mode=next;
  document.querySelectorAll('.v64-quality button').forEach(button=>button.classList.toggle('active',button.dataset.mode===next));
  return next;
}

function mountV64Quality(){
  const actions=document.querySelector('.command-actions');
  if(!actions||actions.querySelector('.v64-quality'))return;
  const control=document.createElement('div');
  control.className='v64-quality';
  control.setAttribute('aria-label','Visual performance mode');
  control.innerHTML=['HIGH','BALANCED','ECO'].map(mode=>`<button type="button" data-mode="${mode}" title="${mode}">${mode[0]}</button>`).join('');
  control.addEventListener('click',event=>{const button=event.target.closest('button[data-mode]');if(button)setVisualMode(button.dataset.mode)});
  actions.insertBefore(control,actions.firstChild);
  setVisualMode('BALANCED');
}

function ensureV64DailyOps(){
  const view=v64El('dailyView');
  if(!view)return null;
  let block=v64El('v64DailyOps');
  if(!block){
    block=document.createElement('section');
    block.id='v64DailyOps';
    block.className='hud-panel trace v64-daily-ops';
    block.innerHTML='<div class="timeline-head"><div><div class="eyebrow">DAILY INTELLIGENCE • v6.4</div><div class="section-title">ภาพรวมปฏิบัติการรายวัน</div></div><span class="v64-risk-badge" id="v64DailyRiskBadge">STABLE</span></div><div class="v64-op-grid"><section><div class="eyebrow">ADJACENT DAYS</div><div id="v64DayCompare" class="v64-compare"></div></section><section><div class="eyebrow">SHIFT TRANSITIONS</div><div id="v64Transitions" class="v64-transition-list"></div></section><section><div class="eyebrow">STAFFING RISK</div><div id="v64RiskList" class="v64-risk-list"></div></section><section><div class="eyebrow">CURRENT STREAKS</div><div id="v64StreakList" class="v64-streak-list"></div></section></div>';
    view.appendChild(block);
  }
  /* The redundant floating D/N/OFF/COVER quick bar was removed (v6.5.29). */
  document.getElementById('v64StickyDaily')?.remove();
  return block;
}

function v64Delta(value,suffix=''){
  if(value===null||value===undefined)return 'N/A';
  if(value===0)return `— 0${suffix}`;
  return `${value>0?'▲ +':'▼ '}${value}${suffix}`;
}

function renderV64Daily(){
  ensureV64DailyOps();
  const model=dailyModel(selectedDay,v64Cache,STAFF);
  const risks=evaluateDayRisk(selectedDay,v64Cache,STAFF);
  const compare=v64El('v64DayCompare');
  if(compare){
    const card=(title,data)=>`<div class="v64-compare-card"><b>${title}</b>${data?`<span>D ${v64Delta(data.D)}</span><span>N ${v64Delta(data.N)}</span><span>OFF ${v64Delta(data.OFF)}</span><span>WORK ${v64Delta(data.working)}</span><span>COVER ${v64Delta(data.coverage,'%')}</span>`:'<span class="muted">N/A</span>'}</div>`;
    compare.innerHTML=card('← วันก่อน',model.comparison.previous)+card('วันถัดไป →',model.comparison.next);
  }
  const transitions=v64El('v64Transitions');
  if(transitions)transitions.innerHTML=model.transitions.length?model.transitions.map(row=>`<button type="button" class="v64-transition" data-person="${row.i}"><b>${v64Esc(row.name)}</b><span>${v64StatusLabel(row.from)} → ${v64StatusLabel(row.to)}</span></button>`).join(''):'<div class="v64-empty">ไม่มีการเปลี่ยนสถานะไปวันถัดไป</div>';
  const riskList=v64El('v64RiskList');
  if(riskList)riskList.innerHTML=risks.length?risks.slice(0,8).map(r=>`<div class="v64-risk ${r.level}"><b>${v64Esc(r.code)}</b><span>${v64Esc(r.text)}</span></div>`).join(''):'<div class="v64-risk ok"><b>STABLE</b><span>ไม่พบสัญญาณเสี่ยงตาม threshold</span></div>';
  const badge=v64El('v64DailyRiskBadge');
  if(badge){const critical=risks.some(x=>x.level==='critical'),warning=risks.some(x=>x.level==='warning');badge.className=`v64-risk-badge ${critical?'critical':warning?'warning':'ok'}`;badge.textContent=critical?'CRITICAL':warning?'WATCH':'STABLE'}
  const streaks=v64El('v64StreakList');
  if(streaks)streaks.innerHTML=model.working.map(row=>`<button type="button" class="v64-streak" data-person="${row.i}"><b>${v64Esc(row.name)}</b><span>WORK ${row.workStreak} วัน${row.nightStreak?` • NIGHT ${row.nightStreak} คืน`:''}</span></button>`).join('');
}

function ensureV64NetworkDetails(){
  const host=v64El('overviewNetwork');
  if(!host)return null;
  const panel=host.closest('.network-panel')||host.parentElement;
  let details=v64El('v64NetworkDetails');
  if(!details){details=document.createElement('div');details.id='v64NetworkDetails';details.className='v64-network-details';panel.appendChild(details)}
  return details;
}

function renderV64Network(center=(selectedRosterPerson??selectedPerson??0)){
  const details=ensureV64NetworkDetails();
  if(!details)return;
  const limit=innerWidth<=640?4:innerWidth<=1050?5:6;
  const model=networkModel(center,v64Cache,limit);
  const top=model.top;
  details.innerHTML=`<div class="v64-network-summary"><span><b>NETWORK 2.0</b><small>${v64Esc(STAFF[center]?.name||'—')}</small></span><span><small>TOP TEAMMATE</small><b>${top?v64Esc(STAFF[top.other].name):'—'}</b></span><span><small>STRENGTH</small><b>${top?top.strength:0}%</b></span></div><div class="v64-relation-strip">${model.relations.map(rel=>`<button type="button" data-network-person="${rel.other}" title="Same Shift ${rel.sameShift} • D ${rel.sameD} • N ${rel.sameN} • Handoff ${rel.handoff} • Strength ${rel.strength}%"><b>${v64Esc(STAFF[rel.other].name)}</b><span>SAME ${rel.sameShift} · D ${rel.sameD} · N ${rel.sameN} · H ${rel.handoff}</span><strong>${rel.strength}%</strong></button>`).join('')}</div>`;
  details.querySelectorAll('[data-network-person]').forEach(button=>button.addEventListener('click',()=>{
    const index=Number(button.dataset.networkPerson);
    selectedPerson=index;selectedRosterPerson=index;v64State.setSelectedPerson(index);
    if(typeof renderNetwork==='function')renderNetwork(index,'overviewNetwork');
    renderV64Network(index);
  }));
}

function ensureV64Workload(){
  const view=v64El('analyticsView');
  if(!view)return null;
  let block=v64El('v64WorkloadBalance');
  if(!block){block=document.createElement('section');block.id='v64WorkloadBalance';block.className='hud-panel trace v64-workload-balance';view.appendChild(block)}
  return block;
}

function renderV64Workload(){
  const block=ensureV64Workload();if(!block)return;
  const model=analyticsModel(v64Cache);
  block.innerHTML=`<div class="timeline-head"><div><div class="eyebrow">WORKLOAD BALANCE • v6.4</div><div class="section-title">สมดุลภาระงานของทีม</div></div><div class="v64-team-kpis"><span>AVG WORK <b>${model.team.avgWork}</b></span><span>AVG N <b>${model.team.avgN}</b></span><span>HIGH <b>${model.team.highestWork}</b></span><span>LOW <b>${model.team.lowestWork}</b></span></div></div><div class="v64-workload-head"><span>พนักงาน</span><span>D</span><span>N</span><span>OFF</span><span>WORK</span><span>N%</span><span>WORK STREAK</span><span>N STREAK</span><span>Δ AVG</span></div><div class="v64-workload-rows">${model.people.map((p,i)=>`<button type="button" class="v64-workload-row" data-person="${i}"><b>${v64Esc(p.name)}</b><span class="d">${p.D}</span><span class="n">${p.N}</span><span class="o">${p.OFF}</span><span>${p.working}</span><span>${p.nightPct}%</span><span>${p.longestWorkStreak}</span><span>${p.longestNightStreak}</span><strong>${p.deltaFromAvg>0?'+':''}${p.deltaFromAvg}</strong></button>`).join('')}</div>`;
  block.querySelectorAll('[data-person]').forEach(button=>button.addEventListener('click',()=>{selectedPerson=Number(button.dataset.person);v64State.setSelectedPerson(selectedPerson);showView('person')}));
}

function enhanceV64ActivityChart(){
  const chart=v64El('activityChart');if(!chart)return;
  const points=[...chart.querySelectorAll('circle')];
  points.forEach((point,index)=>{const day=index+1;if(day>31)return;point.dataset.day=day;point.style.cursor='pointer';point.onclick=()=>setSelectedDay(day)});
}

function renderV64InsightAlerts(){
  const list=v64El('overviewInsightList');if(!list)return;
  const risks=evaluateDayRisk(selectedDay,v64Cache,STAFF);
  list.innerHTML=risks.length?risks.slice(0,6).map(r=>`<div class="insight-item"><span class="insight-icon">${r.level==='critical'?'!':r.level==='warning'?'△':'i'}</span><span><b>${v64Esc(r.code)}</b><span>${v64Esc(r.text)}</span></span><span class="insight-value">${r.level.toUpperCase()}</span></div>`).join(''):'<div class="insight-item"><span class="insight-icon">✓</span><span><b>STABLE</b><span>ไม่พบ Staffing Risk ในวันที่เลือก</span></span><span class="insight-value">OK</span></div>';
}

function ensureV64Palette(){
  let overlay=v64El('v64Palette');if(overlay)return overlay;
  overlay=document.createElement('div');
  overlay.id='v64Palette';overlay.className='v64-palette';overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML='<div class="v64-palette-box" role="dialog" aria-modal="true" aria-label="Command Palette"><div class="v64-palette-head"><span>⌘</span><input id="v64PaletteInput" autocomplete="off" placeholder="ค้นหา วันที่ / ชื่อ / night / off / analytics"><kbd>ESC</kbd></div><div id="v64PaletteResults" class="v64-palette-results"></div><div class="v64-palette-foot"><span>↑↓ เลือก</span><span>ENTER เปิด</span><span>Ctrl+K / ⌘K</span></div></div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeV64Palette()});
  const input=v64El('v64PaletteInput');
  input.addEventListener('input',()=>renderV64Palette(input.value));
  input.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'){event.preventDefault();if(v64PaletteItems.length){v64PaletteIndex=(v64PaletteIndex+1)%v64PaletteItems.length;paintV64PaletteSelection()}}
    if(event.key==='ArrowUp'){event.preventDefault();if(v64PaletteItems.length){v64PaletteIndex=(v64PaletteIndex-1+v64PaletteItems.length)%v64PaletteItems.length;paintV64PaletteSelection()}}
    if(event.key==='Enter'){event.preventDefault();const item=v64PaletteItems[v64PaletteIndex];if(item)applyV64Palette(item)}
    if(event.key==='Escape'){event.preventDefault();closeV64Palette()}
  });
  return overlay;
}

function openV64Palette(seed=''){
  const overlay=ensureV64Palette();overlay.classList.add('show');overlay.setAttribute('aria-hidden','false');
  const input=v64El('v64PaletteInput');input.value=seed;renderV64Palette(seed);setTimeout(()=>input.focus(),0);
}
function closeV64Palette(){const overlay=v64El('v64Palette');if(!overlay)return;overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true');v64PaletteItems=[];v64PaletteIndex=0}
function renderV64Palette(query){
  v64PaletteItems=parseCommandQuery(query);v64PaletteIndex=0;
  const box=v64El('v64PaletteResults');if(!box)return;
  box.innerHTML=v64PaletteItems.length?v64PaletteItems.map((item,index)=>`<button type="button" data-k="${index}"><span>${v64Esc(item.label)}</span><small>${v64Esc(item.type)}</small></button>`).join(''):'<div class="v64-palette-empty">พิมพ์วันที่ ชื่อพนักงาน หรือชื่อหน้า</div>';
  box.querySelectorAll('[data-k]').forEach(button=>button.addEventListener('click',()=>applyV64Palette(v64PaletteItems[Number(button.dataset.k)])));
  paintV64PaletteSelection();
}
function paintV64PaletteSelection(){document.querySelectorAll('#v64PaletteResults [data-k]').forEach((button,index)=>button.classList.toggle('active',index===v64PaletteIndex))}
function applyV64Palette(item){
  if(!item)return;
  if(item.type==='day'){showView('daily');setSelectedDay(item.day)}
  else if(item.type==='person'){selectedPerson=item.i;selectedRosterPerson=item.i;v64State.setSelectedPerson(item.i);showView('person')}
  else if(item.type==='view'){showView(item.view);if(item.label==='team')setTimeout(()=>v64El('overviewNetwork')?.scrollIntoView({behavior:'smooth',block:'center'}),50)}
  else if(item.type==='status'){showView('daily');setTimeout(()=>v64El(item.code==='D'?'dayPeople':item.code==='N'?'nightPeople':'offPeople')?.scrollIntoView({behavior:'smooth',block:'center'}),50)}
  closeV64Palette();
}

function bindV64Interactions(){
  document.addEventListener('keydown',event=>{
    const editable=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
    if((event.ctrlKey||event.metaKey)&&String(event.key).toLowerCase()==='k'){event.preventDefault();event.stopImmediatePropagation();openV64Palette();return}
    if(event.key==='/'&&!editable){event.preventDefault();event.stopImmediatePropagation();openV64Palette();return}
    if(event.key==='Escape'&&v64El('v64Palette')?.classList.contains('show')){event.preventDefault();closeV64Palette()}
  },true);
  const daily=v64El('dailyView');
  if(daily&&typeof window.setupSwipe!=='function')setupMobileSwipe(daily,delta=>setSelectedDay(v64ClampDay(selectedDay+delta)));
  document.addEventListener('click',event=>{
    const person=event.target.closest?.('#v64DailyOps [data-person]');
    if(person){selectedPerson=Number(person.dataset.person);v64State.setSelectedPerson(selectedPerson);if(typeof openSideDrawer==='function')openSideDrawer(selectedPerson,selectedDay)}
  });
  for(const host of [v64El('overviewMonthMatrix'),v64El('heatmapTable')]){
    host?.addEventListener('click',event=>{const cell=event.target.closest?.('[data-day]');if(cell)v64State.setSelectedDay(v64ClampDay(cell.dataset.day))});
  }
}

function updateV64Mounted(){
  if(v64Mounted.has('daily'))renderV64Daily();
  if(v64Mounted.has('analytics')){renderV64Workload();enhanceV64ActivityChart()}
  renderV64Network(selectedRosterPerson??selectedPerson??0);
}

function installV64Wrappers(){
  const legacyShowView=window.showView;
  if(typeof legacyShowView==='function')window.showView=function(name){v64State.setActiveView(name);v64Mounted.add(name);legacyShowView(name);if(name==='daily')renderV64Daily();if(name==='analytics'){renderV64Workload();enhanceV64ActivityChart()}if(name==='overview')renderV64Network(selectedRosterPerson??selectedPerson??0)};

  window.setSelectedDay=function(day,scroll=true){
    selectedDay=v64ClampDay(day);v64State.setSelectedDay(selectedDay);
    if(activeView==='overview'&&typeof renderOverview==='function')renderOverview();
    if(v64Mounted.has('daily')&&typeof renderDaily==='function')renderDaily();
    if(v64Mounted.has('month')&&typeof renderHeatmap==='function')renderHeatmap();
    if(v64Mounted.has('analytics')&&typeof renderAnalytics==='function')renderAnalytics();
    if(typeof syncTodayTomorrowButtons==='function')syncTodayTomorrowButtons();
    updateV64Mounted();
    if(scroll&&activeView==='overview')document.querySelector(`.date-node[data-day="${selectedDay}"]`)?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    return selectedDay;
  };

  const legacyRenderNetwork=window.renderNetwork;
  if(typeof legacyRenderNetwork==='function')window.renderNetwork=function(center,target){const result=legacyRenderNetwork(center,target);if(target==='overviewNetwork')queueMicrotask(()=>renderV64Network(center));return result};

  const legacyRenderAnalytics=window.renderAnalytics;
  if(typeof legacyRenderAnalytics==='function')window.renderAnalytics=function(){const result=legacyRenderAnalytics();queueMicrotask(()=>{renderV64Workload();enhanceV64ActivityChart()});return result};

  const legacyInsightMode=window.setInsightMode;
  if(typeof legacyInsightMode==='function')window.setInsightMode=function(mode){legacyInsightMode(mode);if(mode==='alerts')renderV64InsightAlerts();else if(typeof renderOverviewInsights==='function')renderOverviewInsights()};
}

function initV64(){
  mountV64Quality();ensureV64DailyOps();ensureV64NetworkDetails();ensureV64Palette();
  installV64Wrappers();bindV64Interactions();renderV64Network(selectedRosterPerson??selectedPerson??0);
  document.documentElement.dataset.v64Ready='1';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV64,{once:true});else initV64();
