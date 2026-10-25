/* v6.5.32: Explicit duty positions, never inferred from coarse D/N/O data. */
const shiftPositions=['D1','D2','D3','D4','N1','N2'],shiftPositionKey='shift-positions-oct-2026-image-verified-v2';
let shiftAssignments={},shiftEditDay=1;
function shiftSanitizeRoles(obj){
 const result={};
 if(!obj||typeof obj!=='object'||Array.isArray(obj))return result;
 Object.entries(obj).forEach(([key,assign])=>{
  const day=Number(key),used=new Set(),row={};
  if(!Number.isInteger(day)||day<1||day>31||!assign||typeof assign!=='object')return;
  shiftPositions.forEach(role=>{
   const name=assign[role],i=staff.findIndex(p=>p.name===name);
   if(typeof name==='string'&&i>=0&&!used.has(name)&&statusAt(i,day)===role[0]){row[role]=name;used.add(name)}
  });
  if(Object.keys(row).length)result[day]=row;
 });
 return result;
}
function shiftLoadRoles(){
 try{shiftAssignments=shiftSanitizeRoles(JSON.parse(localStorage.getItem(shiftPositionKey)||'{}'))}catch{shiftAssignments={}}
}
function shiftSaveRoles(){
 try{localStorage.setItem(shiftPositionKey,JSON.stringify(shiftAssignments));return true}catch{return false}
}
function shiftAssignRole(day,role,name){
 day=Number(day);
 if(!Number.isInteger(day)||day<1||day>31||!shiftPositions.includes(role))return false;
 const i=staff.findIndex(p=>p.name===name);
 if(name&&(i<0||statusAt(i,day)!==role[0]))return false;
 const row={...(shiftAssignments[day]||{})};
 for(const k of shiftPositions)if(k===role||row[k]===name&&name)delete row[k];
 if(name)row[role]=name;
 if(Object.keys(row).length)shiftAssignments[day]=row;else delete shiftAssignments[day];
 shiftSaveRoles();return true;
}
/* Build the globally verified October slots first. Local changes are optional overrides,
   never guessed positions. A changed slot releases the former occupant without duplicates. */
function shiftRolesForDay(day){
 const roles={};
 if(!Number.isInteger(Number(day))||Number(day)<1||Number(day)>31)return roles;
 const base=typeof OCTOBER_2026_DUTY_POSITIONS!=='undefined'?OCTOBER_2026_DUTY_POSITIONS:[];
 if(base.length===staff.length)for(let i=0;i<staff.length;i++){
  const role=base[i]?.[day-1];
  if(shiftPositions.includes(role)&&statusAt(i,day)===role[0]&&!roles[role])roles[role]=staff[i].name;
 }
 const overrides=shiftAssignments[day]||{};
 for(const role of shiftPositions){
  const name=overrides[role],i=staff.findIndex(p=>p.name===name);
  if(typeof name!=='string'||i<0||statusAt(i,day)!==role[0])continue;
  for(const key of Object.keys(roles))if(key===role||roles[key]===name)delete roles[key];
  roles[role]=name;
 }
 return roles;
}
function shiftRoleOf(i,day){
 const c=statusAt(i,day);
 if(c==='O')return 'OFF';
 const roles=shiftRolesForDay(day),name=staff[i]?.name;
 return shiftPositions.find(r=>r[0]===c&&roles[r]===name)||c+'?';
}
function shiftRoleExplain(i,day){
 const role=shiftRoleOf(i,day);
 return staff[i].name+' • '+day+' ต.ค. 2569 • '+role+(role.endsWith('?')?' (ยังไม่กำหนดตำแหน่ง)':'');
}
function shiftRoleRenderAll(){
 if(!Array.isArray(staff))return;
 const decorate=(el,i,day)=>{
  if(!staff[i]||day<1||day>31)return;
  const role=shiftRoleOf(i,day);
  el.textContent=role;el.title=shiftRoleExplain(i,day);
  el.setAttribute('aria-label',el.title);
  el.classList.toggle('shift-role-unset',role.endsWith('?'));
 };
 document.querySelectorAll('#heatmapTable tbody tr').forEach((row,i)=>row.querySelectorAll('td.shift').forEach((td,j)=>decorate(td,i,j+1)));
 document.querySelectorAll('#overviewMonthMatrix .matrix-cell[data-i][data-day]').forEach(el=>decorate(el,+el.dataset.i,+el.dataset.day));
 document.querySelectorAll('#v6517MobileMatrix [data-v6517-person][data-v6517-day]').forEach(el=>decorate(el,+el.dataset.v6517Person,+el.dataset.v6517Day));
 document.querySelectorAll('#v6515MobileMonth .shift-week-cell[data-shift-week-person][data-shift-week-date]').forEach(el=>decorate(el,+el.dataset.shiftWeekPerson,+el.dataset.shiftWeekDate));
 document.querySelectorAll('#overviewView .roster-card .person-row[data-person],#dailyView .roster-card .person-row[data-person]').forEach(el=>{
  const i=+el.dataset.person,d=+selectedDay;
  if(!staff[i])return;
  const role=shiftRoleOf(i,d),badge=el.querySelector('.status-badge'),info=el.querySelector('.row-meta');
  if(badge)badge.textContent=role+' • '+d;
  if(info)info.textContent=role+' • '+info.textContent.replace(/^(?:D[1-4?]|N[1-2?]|OFF) • /,'');
  el.title=shiftRoleExplain(i,d);
 });
 document.querySelectorAll('#v6515MobileMonth .v6515-shift-group .v6515-person').forEach(el=>{
  const name=el.firstChild?.textContent?.trim(),i=staff.findIndex(p=>p.name===name);
  if(i<0)return;
  let badge=el.querySelector('.shift-roster-date');
  if(!badge){badge=document.createElement('b');el.appendChild(badge)}
  badge.className='shift-roster-date '+statusAt(i,selectedDay);
  badge.textContent=shiftRoleOf(i,selectedDay)+' • '+selectedDay;
  el.title=shiftRoleExplain(i,selectedDay);
 });
 document.querySelectorAll('#shiftTeamDates .shift-team-person').forEach((el,i)=>{
  if(!staff[i])return;
  let footer=el.querySelector('.shift-post-summary');
  if(!footer){footer=document.createElement('div');footer.className='shift-post-summary';el.appendChild(footer)}
  const dates=Array.from({length:31},(_,k)=>{const role=shiftRoleOf(i,k+1);return role!=='OFF'&&!role.endsWith('?')?(k+1)+' '+role:null}).filter(Boolean);
  footer.textContent=dates.length?'ตำแหน่งที่ยืนยัน: '+dates.join(' • '):'ยังไม่กำหนดตำแหน่งย่อย';
 });
 const legend=document.querySelector('#v6515MobileMonth .shift-week-footer small');
 if(legend)legend.textContent='D1–D4 / N1–N2 • ? = ยังไม่ระบุ';
 const note=document.getElementById('shiftRoleStatus');
 if(note){
  const working=staff.filter((p,i)=>statusAt(i,selectedDay)!=='O');
  const current=shiftRolesForDay(selectedDay);
  const assigned=working.filter(p=>shiftPositions.some(r=>current[r]===p.name)).length;
  note.textContent='ตำแหน่งเวร '+selectedDay+' ต.ค. • กำหนดแล้ว '+assigned+'/'+working.length+
   ' คน • ตำแหน่งจากตารางจริง ต.ค. 2569 • Duty UI v6.5.34';
 }
}
function shiftRoleMount(){
 const panel=document.querySelector('#monthView .month-panel');
 if(!panel)return;
 if(!document.getElementById('shiftRoleEditor')){
  const section=document.createElement('section');
  section.id='shiftRoleEditor';section.hidden=true;section.className='shift-post-editor';
  const header=panel.querySelector('.month-head');
  if(header)header.after(section);else panel.prepend(section);
 }
 if(!document.getElementById('shiftRoleStatus')){
  const note=document.createElement('div');
  note.id='shiftRoleStatus';note.className='shift-post-status';note.setAttribute('role','status');
  note.textContent='ตำแหน่ง D1–D4 / N1–N2 จากภาพตาราง ต.ค. 2569';
  const head=panel.querySelector('.month-head');
  if(head)head.after(note);else panel.prepend(note);
 }
 [[panel.querySelector('.month-head'),'กำหนด D1–D4 / N1–N2'],
  [document.querySelector('#v6517Dashboard .v6517-actions'),'ตำแหน่ง D1–N2'],
  [document.querySelector('#dailyView .daily-header'),'กำหนดตำแหน่งเวร']].forEach(([host,label])=>{
   if(!host||host.querySelector('[data-role-open]'))return;
   const b=document.createElement('button');b.type='button';b.className='shift-post-open';
   b.dataset.roleOpen='1';b.textContent=label;host.appendChild(b);
  });
}
function shiftRoleDrawEditor(){
 const host=document.getElementById('shiftRoleEditor');if(!host)return;
 const day=shiftEditDay,current=shiftRolesForDay(day);
 const opts=Array.from({length:31},(_,i)=>'<option value="'+(i+1)+'"'+(i+1===day?' selected':'')+'>'+(i+1)+' ต.ค. 2569</option>').join('');
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const slots=shiftPositions.map(role=>{
  const names=staff.filter((p,i)=>statusAt(i,day)===role[0]);
  const choices='<option value="">— ยังไม่ระบุ —</option>'+names.map(p=>'<option value="'+esc(p.name)+'"'+(current[role]===p.name?' selected':'')+'>'+esc(p.name)+'</option>').join('');
  return '<label class="shift-post-slot '+role[0]+'"><b>'+role+'</b><select data-role-slot="'+role+'">'+choices+'</select></label>';
 }).join('');
 host.innerHTML='<div class="shift-post-head"><div><h3>ใครทำ D1–D4 / N1–N2 วันไหน</h3><p>ลงตำแหน่งจากตารางจริงเดือนตุลาคมแล้ว • แก้เฉพาะกรณีมีใบงานยืนยันการเปลี่ยนเวร</p></div><button type="button" data-role-close aria-label="ปิด">×</button></div>'+
 '<div class="shift-post-date"><button type="button" data-role-step="-1"'+(day===1?' disabled':'')+'>‹</button><label>วันที่ <select data-role-day>'+opts+'</select></label><button type="button" data-role-step="1"'+(day===31?' disabled':'')+'>›</button></div>'+
 '<div class="shift-post-slots">'+slots+'</div>'+
 '<p class="shift-post-result" role="status">กำหนดแล้ว '+Object.keys(current).length+' / '+staff.filter((p,i)=>statusAt(i,day)!=='O').length+' ตำแหน่ง • ไม่อนุญาตให้หนึ่งคนรับสองตำแหน่งในวันเดียวกัน</p>'+
 '<div class="shift-post-actions"><button type="button" data-role-copy>คัดลอก JSON</button><button type="button" data-role-import-toggle>นำเข้า JSON</button></div>'+
 '<div class="shift-post-import" hidden><textarea data-role-json rows="4" placeholder="วาง JSON ของตำแหน่ง D1–N2"></textarea><button type="button" data-role-import>ตรวจสอบและนำเข้า</button></div>'+
 '<p class="shift-post-local">ข้อมูลต้นฉบับ ต.ค. 2569 ใช้ร่วมกันทุกเครื่อง • การแก้ไขเฉพาะเครื่องนี้ใช้ JSON สำรอง/นำเข้า</p>';
}
function shiftRoleOpenEditor(){
 if(!document.getElementById('monthView')?.classList.contains('active'))window.showView?.('month');
 shiftRoleMount();
 shiftEditDay=Math.max(1,Math.min(31,Number(selectedDay)||1));
 shiftRoleDrawEditor();
 const editor=document.getElementById('shiftRoleEditor');
 if(editor){editor.hidden=false;editor.scrollIntoView?.({behavior:'smooth',block:'start'})}
}
function shiftRoleInit(){
 document.documentElement.dataset.shiftPositionsUi='v6.5.34';
 shiftLoadRoles();
 const hook=(fn,decorator)=>{
  const previous=window[fn];
  if(typeof previous!=='function')return;
  window[fn]=function(){const result=previous.apply(this,arguments);decorator();return result};
 };
 // Classic script function bindings may be global lexical, so rebind identifiers as well.
 const oldHeat=renderHeatmap;renderHeatmap=function(){const r=oldHeat.apply(this,arguments);shiftRoleRenderAll();return r};
 const oldMatrix=renderOverviewMatrix;renderOverviewMatrix=function(){const r=oldMatrix.apply(this,arguments);shiftRoleRenderAll();return r};
 const oldRows=renderRosterRows;renderRosterRows=function(){const r=oldRows.apply(this,arguments);shiftRoleRenderAll();return r};
 const oldMobile=v6515RenderMobileMonth;v6515RenderMobileMonth=function(){const r=oldMobile.apply(this,arguments);shiftRoleRenderAll();return r};
 const oldDashboard=v6517Render;v6517Render=function(){const r=oldDashboard.apply(this,arguments);shiftRoleMount();shiftRoleRenderAll();return r};
 const oldView=window.showView;
 if(typeof oldView==='function')window.showView=function(){const r=oldView.apply(this,arguments);shiftRoleMount();shiftRoleRenderAll();return r};
 const oldModal=openCellModal;openCellModal=function(index,day){
  const r=oldModal.apply(this,arguments);
  const meta=document.querySelector('#modalContent .modal-meta');
  if(meta&&staff[index]){const badge=document.createElement('div');badge.className='shift-modal-post';badge.textContent='ตำแหน่งวันที่ '+day+': '+shiftRoleOf(index,day);meta.appendChild(badge)}
  return r;
 };
 document.addEventListener('click',async e=>{
  const b=e.target.closest?.('[data-role-open],[data-role-close],[data-role-step],[data-role-copy],[data-role-import-toggle],[data-role-import]');
  if(!b)return;
  const host=document.getElementById('shiftRoleEditor');
  if(b.hasAttribute('data-role-open')){shiftRoleOpenEditor();return}
  if(b.hasAttribute('data-role-close')){host.hidden=true;return}
  if(b.hasAttribute('data-role-step')){shiftEditDay=Math.max(1,Math.min(31,shiftEditDay+Number(b.dataset.roleStep)));shiftRoleDrawEditor();return}
  if(b.hasAttribute('data-role-copy')){
   const verifiedAll=Object.fromEntries(Array.from({length:31},(_,i)=>[i+1,shiftRolesForDay(i+1)]));
   const json=JSON.stringify(verifiedAll,null,2);
   try{await navigator.clipboard.writeText(json);host.querySelector('.shift-post-result').textContent='คัดลอก JSON แล้ว'}
   catch{host.querySelector('.shift-post-import').hidden=false;host.querySelector('[data-role-json]').value=json;host.querySelector('.shift-post-result').textContent='คัดลอกอัตโนมัติไม่ได้ • คัดลอกข้อความจากช่อง JSON'}
   return;
  }
  if(b.hasAttribute('data-role-import-toggle')){const box=host.querySelector('.shift-post-import');box.hidden=!box.hidden;return}
  if(b.hasAttribute('data-role-import')){
   try{
    const raw=JSON.parse(host.querySelector('[data-role-json]').value);
    shiftAssignments=shiftSanitizeRoles(raw);shiftSaveRoles();shiftRoleDrawEditor();shiftRoleRenderAll();
    host.querySelector('.shift-post-result').textContent='นำเข้าแล้ว • ใช้เฉพาะตำแหน่งที่ตรงกับกะ D/N จริง';
   }catch{host.querySelector('.shift-post-result').textContent='JSON ไม่ถูกต้อง • ไม่มีข้อมูลถูกเปลี่ยน'}
  }
 });
 document.addEventListener('change',e=>{
  const slot=e.target.closest?.('#shiftRoleEditor [data-role-slot]');
  if(slot){
   const ok=shiftAssignRole(shiftEditDay,slot.dataset.roleSlot,slot.value);
   shiftRoleDrawEditor();shiftRoleRenderAll();
   if(!ok)document.querySelector('#shiftRoleEditor .shift-post-result').textContent='ตำแหน่งไม่ตรงกับกะ D/N ของพนักงาน';
   return;
  }
  const day=e.target.closest?.('#shiftRoleEditor [data-role-day]');
  if(day){shiftEditDay=Number(day.value);shiftRoleDrawEditor()}
 });
 shiftRoleMount();shiftRoleRenderAll();
 window.addEventListener('pageshow',()=>{shiftRoleMount();shiftRoleRenderAll()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){shiftRoleMount();shiftRoleRenderAll()}});
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shiftRoleInit,{once:true});
 else shiftRoleInit();
}
