/* v6.5.31 • Show each person's dates for D, N, OFF in the original roster.
   This is presentation-only and does not create new shift types or edit data. */
function shiftDateSet(person,code){
 return [...person.s].flatMap((shift,index)=>shift===code?[index+1]:[]).join(', ')||'—';
}
function shiftShowTeamDates(){
 const month=document.querySelector('#monthView .month-panel');
 if(!month||!Array.isArray(staff)||staff.length===0)return;
 let host=document.getElementById('shiftTeamDates');
 if(!host){
  host=document.createElement('section');
  host.id='shiftTeamDates';host.className='shift-team-days';
  host.setAttribute('aria-label','ทำงานกะ D N OFF วันที่ไหน');
  month.appendChild(host);
 }
 if(host.dataset.rosterSize===String(staff.length)&&host.firstElementChild)return;
 const line=(person,code,text)=>'<div class="shift-team-line '+code+'"><b>'+text+'</b><span>'+shiftDateSet(person,code)+'</span></div>';
 host.innerHTML='<h3>พนักงานทุกคน • D / N / OFF วันที่ไหน</h3>'+
  '<p>หมายเลขวันที่ในเดือนตุลาคม 2569 • อ้างอิงตารางเวรจริง</p>'+
  '<div class="shift-team-days-list">'+staff.map(p=>'<article class="shift-team-person">'+
  '<strong>'+v6515Escape(p.name)+'</strong>'+
  line(p,'D','D • กลางวัน')+line(p,'N','N • กลางคืน')+line(p,'O','OFF • หยุด')+
  '</article>').join('')+'</div>';
 host.dataset.rosterSize=String(staff.length);
}
function shiftClarifyMonthCells(){
 const table=document.getElementById('heatmapTable');
 if(!table||!Array.isArray(staff))return;
 table.querySelectorAll('tbody tr').forEach((row,i)=>{
  if(!staff[i])return;
  row.querySelectorAll('td.shift').forEach((cell,j)=>{
   const day=j+1,code=statusAt(i,day),labelText=code==='D'?'D เวรกลางวัน':code==='N'?'N เวรกลางคืน':'OFF หยุด';
   cell.textContent=code==='O'?'OFF':code;
   cell.setAttribute('title',staff[i].name+' • '+day+' ต.ค. • '+labelText);
   cell.setAttribute('aria-label',staff[i].name+' วันที่ '+day+' ตุลาคม 2569 • '+labelText);
  });
 });
}
function shiftClarifyRows(){
 const roots=document.querySelectorAll('#overviewView .roster-card .person-row,#dailyView .roster-card .person-row');
 roots.forEach(row=>{
  const code=row.classList.contains('shift-D')?'D':row.classList.contains('shift-N')?'N':'O';
  const badge=row.querySelector('.status-badge');
  const detail=row.querySelector('.row-meta');
  const mark=(code==='O'?'OFF':code)+' • '+selectedDay;
  if(badge)badge.textContent=mark;
  if(detail){
   const line=selectedDay+' ต.ค. • '+(code==='D'?'D เวรกลางวัน':code==='N'?'N เวรกลางคืน':'OFF พัก');
   if(!detail.textContent.includes(line))detail.textContent=line+' • '+detail.textContent.replace(/^\d+ ต.ค. • (?:D เวรกลางวัน|N เวรกลางคืน|OFF พัก) • /,'');
  }
  row.setAttribute('title',(row.querySelector('.row-name')?.textContent||'')+' • '+selectedDay+' ต.ค. • '+mark);
 });
}
function shiftClarifyMobileMonth(){
 const host=document.getElementById('v6515MobileMonth');
 if(!host)return;
 host.querySelectorAll('.v6515-shift-group').forEach(group=>{
  const code=group.classList.contains('day')?'D':group.classList.contains('night')?'N':'O';
  group.querySelectorAll('.v6515-person').forEach(node=>{
   const status=(code==='O'?'OFF':code)+' • '+selectedDay;
   let pill=node.querySelector('.shift-roster-date');
   if(!pill){pill=document.createElement('b');pill.className='shift-roster-date '+code;node.appendChild(pill)}
   pill.textContent=status;
   node.title=node.textContent.trim()+' • '+selectedDay+' ต.ค.';
  });
 });
}
function shiftClarifyPreview(){
 document.querySelectorAll('#overviewView .v6517-mobile-row button.O').forEach(button=>{
  if(!button.textContent.trim())button.textContent='OFF';
 });
}
if(typeof document!=='undefined'){
 const shiftBeforeHeatmap=renderHeatmap;
 renderHeatmap=function(){const result=shiftBeforeHeatmap.apply(this,arguments);shiftClarifyMonthCells();shiftShowTeamDates();return result;};
 const shiftBeforeRoster=renderRosterRows;
 renderRosterRows=function(){const result=shiftBeforeRoster.apply(this,arguments);shiftClarifyRows();return result;};
 const shiftBeforeMobileMonth=v6515RenderMobileMonth;
 v6515RenderMobileMonth=function(){const result=shiftBeforeMobileMonth.apply(this,arguments);shiftClarifyMobileMonth();return result;};
 const shiftBeforeDashboard=v6517Render;
 v6517Render=function(){const result=shiftBeforeDashboard.apply(this,arguments);shiftClarifyPreview();return result;};
 const shiftBeforeShowView=window.showView;
 if(typeof shiftBeforeShowView==='function')window.showView=function(){
  const result=shiftBeforeShowView.apply(this,arguments);
  if(arguments[0]==='month'){shiftShowTeamDates();shiftClarifyMobileMonth();shiftClarifyMonthCells()}
  return result;
 };
 const init=()=>{shiftShowTeamDates();shiftClarifyMonthCells();shiftClarifyRows();shiftClarifyMobileMonth();shiftClarifyPreview()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
}
