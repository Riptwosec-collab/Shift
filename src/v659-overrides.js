// Shift v6.5.9 — selected-month Overview + stacked Oct-Dec year-end Matrix.
const V659_MONTHS=[10,11,12];

function v659RenderMonthMatrix(month,now,{overview=false,model=null}={}){
  const monthModel=model||getOncallMonthMatrix(month);
  const week=V652_WEEK[v652Locale()];
  const currentNames=new Set(getOncallAssignmentsForDate(now).map(row=>row.name));
  const nextRows=getNextOncallAssignments(now);
  const selectedMonth=Number(month)===Number(v652Month);
  const coverage=monthModel.daysInMonth-monthModel.unassigned;
  const headers=monthModel.days.map(item=>{
    const dow=week[new Date(2026,month-1,item.day).getDay()];
    const today=v652IsToday(month,item.day,now);
    const selected=selectedMonth&&item.day===v655SelectedDay;
    return `<button type="button" data-v659-month="${month}" data-v659-day="${item.day}" class="v652-matrix-day ${today?'today':''} ${selected?'v655-selected-day':''}" aria-pressed="${selected?'true':'false'}" aria-label="${v652Esc(`${item.day} ${v652MonthName(month)} ${v652Year()}`)}"><small>${dow}</small><b>${item.day}</b></button>`;
  }).join('');
  const rows=monthModel.engineers.map(name=>{
    const person=v652PersonClass(name),focused=v655FocusedEngineer===name;
    const cells=monthModel.days.map(item=>{
      const assignment=item.assignments.find(row=>row.name===name),active=Boolean(assignment),today=v652IsToday(month,item.day,now),selected=selectedMonth&&item.day===v655SelectedDay;
      const live=active&&today&&currentNames.has(name);
      const next=active&&nextRows.some(row=>row.name===name&&row.month===month&&row.start===assignment.start&&row.end===assignment.end);
      const label=active?`${name} • OC • ${item.day} ${v652MonthName(month)} • ${assignment.start}-${assignment.end}`:`${name} • ${item.day} ${v652MonthName(month)} • ${v652Text('unassigned')}`;
      return `<button type="button" data-v659-month="${month}" data-v659-day="${item.day}" data-v659-cell="${v652Esc(name)}" class="v652-matrix-cell ${active?'active person-'+person:''} ${today?'today':''} ${selected?'v655-selected-day':''} ${focused?'v655-focused-row':''} ${live?'v655-live':''} ${next?'v655-next':''} ${!active?'v655-unassigned':''}" title="${v652Esc(label)}" aria-label="${v652Esc(label)}">${active?'<b>OC</b>':'<span>·</span>'}</button>`;
    }).join('');
    return `<button type="button" data-v659-engineer="${v652Esc(name)}" class="v652-matrix-name person-${person} ${focused?'v655-focused-row':''}" aria-pressed="${focused?'true':'false'}" aria-label="${v652Esc(`${v652Text('focus')} ${name}`)}"><i>${v652Esc(name.slice(0,1))}</i><b>${v652Esc(name)}</b><small>${monthModel.totals[name]} ${v652Text('days')}</small></button>${cells}`;
  }).join('');
  return `<section class="hud-panel trace v652-matrix-panel v655-matrix-panel v659-month-panel ${overview?'v659-overview-panel':''}" data-v659-month="${month}"><div class="v659-month-beacon"><span>${String(month).padStart(2,'0')} / 2026</span><i></i><b>${coverage}/${monthModel.daysInMonth}</b></div><div class="v652-section-head"><div><div class="eyebrow">${overview?(v652Locale()==='th'?'ภาพรวมเดือนที่เลือก':'SELECTED MONTH OVERVIEW'):(v652Locale()==='th'?'YEAR-END ONCALL MATRIX':'YEAR-END ONCALL MATRIX')}</div><div class="section-title">${v652MonthName(month)} ${v652Year()}</div><p>${v652Text('matrixSub')}</p></div><span>${monthModel.daysInMonth} ${v652Text('days')}</span></div><div class="v652-matrix-scroll v655-matrix-scroll v659-matrix-scroll"><div class="v652-matrix v655-matrix v659-matrix" style="--v652-days:${monthModel.daysInMonth}"><div class="v652-matrix-corner"><b>${v652Text('engineer')}</b><small>${v652MonthName(month)} ${v652Year()}</small></div>${headers}${rows}</div></div><div class="v652-matrix-legend">${monthModel.engineers.map(name=>`<span class="person-${v652PersonClass(name)}"><i></i>${v652Esc(name)} <b>${monthModel.totals[name]}</b></span>`).join('')}${monthModel.unassigned?`<span class="unassigned"><i></i>${v652Text('unassigned')} <b>${monthModel.unassigned}</b></span>`:''}</div></section>`;
}

function v659RenderOverviewMonth(now){
  const selectedModel=getOncallMonthMatrix(v652Month);
  return `<div class="v659-overview-month">${v659RenderMonthMatrix(v652Month,now,{overview:true,model:selectedModel})}</div>`;
}

function v659RenderYearEndMatrix(now){
  const panels=[10,11,12].map(month=>v659RenderMonthMatrix(month,now));
  return `<div class="v659-year-end-matrix">${panels.map((panel,index)=>`${index?'<div class="v659-month-divider" aria-hidden="true"><span></span><b>YEAR-END // '+String(10+index).padStart(2,'0')+'</b><span></span></div>':''}${panel}`).join('')}</div>`;
}

function v659SelectMonthDay(month,day){
  const m=Number(month),d=Number(day);
  if(!V659_MONTHS.includes(m))return;
  const model=getOncallMonthMatrix(m);
  if(!Number.isInteger(d)||d<1||d>model.daysInMonth)return;
  v652Month=m;
  v655SelectedDay=d;
  renderV652Oncall();
}

function v659FocusEngineer(name){
  if(!ONCALL_ENGINEERS.includes(name))return;
  v655FocusedEngineer=v655FocusedEngineer===name?null:name;
  renderV652Oncall();
}

function v659BindInteractions(){
  if(typeof document==='undefined'||document.documentElement.dataset.v659Bound==='1')return;
  document.documentElement.dataset.v659Bound='1';
  document.addEventListener('click',event=>{
    const day=event.target.closest?.('[data-v659-day]');
    if(day){v659SelectMonthDay(day.dataset.v659Month,day.dataset.v659Day);return}
    const engineer=event.target.closest?.('[data-v659-engineer]');
    if(engineer)v659FocusEngineer(engineer.dataset.v659Engineer);
  });
}

function v652Overview(now){return v659RenderOverviewMonth(now)}
function v652Matrix(now){return `${v659RenderYearEndMatrix(now)}${v655RenderSelectedDay(now)}`}

function v659StampVersion(){document.documentElement.dataset.appVersion='6.5.9';v659BindInteractions()}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v659StampVersion,{once:true});
  else v659StampVersion();
}
