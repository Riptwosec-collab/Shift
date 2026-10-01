// Shift v6.5.7 — Current/Next overview mini matrix + command-center graphics.
function v657OverviewPairPeople(now){
  const current=getOncallAssignmentsForDate(now);
  const next=getNextOncallAssignments(now);
  const seen=new Set();
  const pair=[];
  for(const row of current){if(!seen.has(row.name)){seen.add(row.name);pair.push({name:row.name,state:'live',assignment:row})}}
  for(const row of next){if(!seen.has(row.name)){seen.add(row.name);pair.push({name:row.name,state:'next',assignment:row})}}
  return pair;
}

function v657PairStateLabel(state){
  return state==='live'?(v652Locale()==='th'?'กำลังเข้าเวร':'ON CALL NOW'):(v652Locale()==='th'?'รับช่วงถัดไป':'NEXT HANDOFF');
}

function v657RenderOverviewPairMatrix(now){
  const model=getOncallMonthMatrix(v652Month);
  const pair=v657OverviewPairPeople(now);
  const week=V652_WEEK[v652Locale()];
  const headers=model.days.map(item=>{
    const dow=week[new Date(2026,v652Month-1,item.day).getDay()];
    const today=v652IsToday(v652Month,item.day,now);
    return `<span class="v657-mini-day ${today?'today':''}" aria-label="${v652Esc(`${item.day} ${v652MonthName(v652Month)} ${v652Year()}`)}"><small>${dow}</small><b>${item.day}</b></span>`;
  }).join('');
  const rows=pair.map(person=>{
    const stateAttr=person.state==='live'?'data-v657-state="live"':'data-v657-state="next"';
    const handoffDay=person.state==='next'&&person.assignment.month===v652Month?person.assignment.start:null;
    const cells=model.days.map(item=>{
      const active=item.assignments.some(row=>row.name===person.name);
      const today=v652IsToday(v652Month,item.day,now);
      const handoff=handoffDay===item.day;
      return `<span class="v657-mini-cell ${active?'active':''} ${today?'today':''} ${handoff?'handoff':''}" title="${v652Esc(`${person.name} • ${item.day} ${v652MonthName(v652Month)}${active?' • OC':''}`)}">${active?'<b>OC</b>':'<i></i>'}</span>`;
    }).join('');
    return `<div class="v657-pair-row" ${stateAttr}><div class="v657-pair-person person-${v652PersonClass(person.name)}"><span>${v652Esc(person.name.slice(0,1))}</span><div><small>${v657PairStateLabel(person.state)}</small><strong>${v652Esc(person.name)}</strong><em>${v652Range(person.assignment)}</em></div></div>${cells}</div>`;
  }).join('');
  const empty=pair.length?rows:`<div class="v657-pair-empty">${v652Text('unassigned')}</div>`;
  return `<section class="v657-overview-matrix hud-panel trace"><i class="v657-data-scan" aria-hidden="true"></i><div class="v657-matrix-head"><div><span class="eyebrow">LIVE HANDOFF MATRIX</span><h3>${v652Locale()==='th'?'Matrix คนปัจจุบัน + คนถัดไป':'Current + Next Matrix'}</h3><p>${v652Locale()==='th'?'แสดงเฉพาะคนที่กำลัง On-call และคนที่จะรับช่วงต่อ':'Only the active engineer and the next handoff are shown here'}</p></div><div class="v657-handoff-line" aria-hidden="true"><span>NOW</span><i></i><b>HANDOFF</b><i></i><span>NEXT</span></div></div><div class="v657-mini-scroll"><div class="v657-mini-grid" style="--v657-days:${model.daysInMonth}"><div class="v657-mini-corner"><b>${v652Text('engineer')}</b><small>${v652MonthName(v652Month)} ${v652Year()}</small></div>${headers}${empty}</div></div></section>`;
}

function v652Overview(now){
  return `<div class="v657-overview-stack">${v655RenderTodayNext(now)}${v657RenderOverviewPairMatrix(now)}</div>`;
}

function v657StampVersion(){document.documentElement.dataset.appVersion='6.5.7'}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v657StampVersion,{once:true});
  else v657StampVersion();
}
