// Shift v6.5.11 — Matrix Board v2 zero-scroll year-end renderer.
function v6511RenderBoardMonth(month,now){
  const model=getOncallMonthMatrix(month);
  const week=V652_WEEK[v652Locale()];
  const currentNames=new Set(getOncallAssignmentsForDate(now).map(row=>row.name));
  const nextRows=getNextOncallAssignments(now);
  const selectedMonth=Number(month)===Number(v652Month);
  const selectedDay=selectedMonth?Number(v655SelectedDay):0;
  const todayInMonth=now.getFullYear()===2026&&now.getMonth()+1===month;
  const coverage=model.daysInMonth-model.unassigned;
  const headers=model.days.map(item=>{
    const dow=week[new Date(2026,month-1,item.day).getDay()];
    const today=todayInMonth&&now.getDate()===item.day;
    const selected=selectedMonth&&selectedDay===item.day;
    return `<button type="button" data-v659-month="${month}" data-v659-day="${item.day}" class="v6511-day ${today?'today':''} ${selected?'v655-selected-day':''}" aria-pressed="${selected?'true':'false'}" aria-label="${v652Esc(`${item.day} ${v652MonthName(month)} ${v652Year()}`)}"><small>${dow}</small><b>${item.day}</b></button>`;
  }).join('');
  const rows=model.engineers.map(name=>{
    const person=v652PersonClass(name);
    const focused=v655FocusedEngineer===name;
    const scheduleRows=ONCALL_SCHEDULE.filter(row=>row.month===month&&row.name===name);
    const bars=scheduleRows.map(row=>{
      const live=currentNames.has(name)&&todayInMonth&&now.getDate()>=row.start&&now.getDate()<=row.end;
      const next=nextRows.some(nextRow=>nextRow.name===name&&nextRow.month===month&&nextRow.start===row.start&&nextRow.end===row.end);
      const selected=selectedMonth&&selectedDay>=row.start&&selectedDay<=row.end;
      const label=`${name} • OC • ${row.start}–${row.end} ${v652MonthName(month)}`;
      return `<button type="button" data-v659-month="${month}" data-v659-day="${row.start}" class="v6511-duty-bar person-${person} ${live?'v655-live':''} ${next?'v655-next':''} ${selected?'v655-selected-day':''} ${focused?'v655-focused-row':''}" style="grid-column:${row.start}/${row.end+1}" title="${v652Esc(label)}" aria-label="${v652Esc(label)}"><b>OC</b><span>${row.start}–${row.end}</span></button>`;
    }).join('');
    return `<div class="v6511-engineer-row person-${person} ${focused?'v655-focused-row':''}"><button type="button" data-v659-engineer="${v652Esc(name)}" class="v6511-engineer-name" aria-pressed="${focused?'true':'false'}" aria-label="${v652Esc(`${v652Text('focus')} ${name}`)}"><i>${v652Esc(name.slice(0,1))}</i><span><b>${v652Esc(name)}</b><small>${model.totals[name]} ${v652Text('days')}</small></span></button><div class="v6511-track" style="--v6511-days:${model.daysInMonth}">${bars}</div></div>`;
  }).join('');
  const todayPct=todayInMonth?(((now.getDate()-.5)/model.daysInMonth)*100).toFixed(4):null;
  const selectedCopy=selectedMonth&&selectedDay?`${v652Locale()==='th'?'เลือก':'SELECTED'} ${selectedDay}`:'';
  return `<section class="hud-panel trace v6511-month-board" data-v659-month="${month}" style="--v6511-days:${model.daysInMonth}"><header class="v6511-month-head"><div><span>${String(month).padStart(2,'0')} / 2026</span><b>${v652MonthName(month)} ${v652Year()}</b></div><div class="v6511-month-status"><span>${coverage}/${model.daysInMonth}</span>${selectedCopy?`<em>${selectedCopy}</em>`:''}</div></header><div class="v6511-board-scroll"><div class="v6511-board-grid"><div class="v6511-corner"><b>${v652Text('engineer')}</b><small>YEAR-END</small></div><div class="v6511-day-head" style="--v6511-days:${model.daysInMonth}">${headers}</div>${rows}${todayPct!==null?`<div class="v6511-timeline-overlay" aria-hidden="true"><i class="v6511-today-line" style="left:${todayPct}%"></i></div>`:''}</div></div></section>`;
}

function v6511RenderBoardYearEnd(now){
  return `<div class="v6511-board">${[10,11,12].map(month=>v6511RenderBoardMonth(month,now)).join('')}</div>`;
}

function v652Matrix(now){return v6511RenderBoardYearEnd(now)}

function v6511StampVersion(){
  if(typeof document!=='undefined')document.documentElement.dataset.appVersion='6.5.11';
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v6511StampVersion,{once:true});
  else v6511StampVersion();
}
