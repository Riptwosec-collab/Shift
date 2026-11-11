/* Shift v6.5.36 — faithful November 2569 reference-sheet presentation.
   All duty cells are read from NOVEMBER_2026_DUTY_POSITIONS.
   The additional H after Nov 30 is a source-layout column, NOT November 31.
   Per-person counts and totals are derived, never copied from a stale worksheet formula. */
const SHIFT_NOV_SHEET_NICKNAMES=Object.freeze(['นุ๊ก','พี่ยาว','ครีม','ทิชา','คิว','นิว','เต้ย','เมฆ','แคปหมู','คี']);
const SHIFT_NOV_SHEET_WORK_HOURS=10.5;
const SHIFT_NOV_SHEET_COMPANY_DAYS=22;
const SHIFT_NOV_SHEET_COMPANY_HOURS=176;
const SHIFT_NOV_SHEET_WEEKDAYS=Object.freeze(['Su','Mo','Tu','We','Th','Fr','Sa']);
function shiftNovSheetCount(personIndex){
 const days=NOVEMBER_2026_DUTY_POSITIONS[personIndex];
 const day=days.filter(p=>p[0]==='D').length;
 const night=days.filter(p=>p[0]==='N').length;
 const holiday=days.filter(p=>p==='H').length;
 const working=day+night;
 return {day,night,holiday,working,restReference:holiday+1,hours:working*SHIFT_NOV_SHEET_WORK_HOURS};
}
function shiftNovSheetTotals(){
 const people=NOVEMBER_2026_DUTY_POSITIONS.map((_,i)=>shiftNovSheetCount(i));
 return people.reduce((sum,p)=>{
  for(const key of ['day','night','holiday','working','restReference','hours'])sum[key]+=p[key];
  return sum;
 },{day:0,night:0,holiday:0,working:0,restReference:0,hours:0});
}
function shiftNovSheetColumnMeta(){
 const dates=Array.from({length:30},(_,i)=>{
  const day=i+1,date=new Date(2026,10,day);
  const weekend=date.getDay()===0||date.getDay()===6;
  return {day,weekend,weekday:SHIFT_NOV_SHEET_WEEKDAYS[date.getDay()]};
 });
 return dates;
}
function shiftNovSheetMetric(value,tone,extra=''){
 return '<td class="shift-nov-sheet-metric '+tone+' '+extra+'">'+value+'</td>';
}
function shiftNovRenderReferenceSheet(){
 const host=document.querySelector('#shiftNovemberView .shift-nov-scroll');
 if(!host||!Array.isArray(staff)||staff.length!==10||NOVEMBER_2026_DUTY_POSITIONS.length!==10)return;
 const dates=shiftNovSheetColumnMeta();
 const summaryLabels=[
  ['กลางวัน','D','day'],['กลางคืน','N','night'],['แทน','T','replace'],
  ['S','S','special'],['ลา','ลา','leave'],['หยุด','H','holiday']
 ];
 const headWeekdays=dates.map(x=>'<th class="shift-nov-sheet-weekday '+(x.weekend?'weekend':'weekday')+'" scope="col" data-shift-nov-date="'+x.day+'">'+x.weekday+'</th>').join('');
 const headDates=dates.map(x=>'<th class="shift-nov-sheet-date '+(x.weekend?'weekend':'weekday')+'" scope="col"><button type="button" data-shift-nov-date="'+x.day+'" aria-label="เลือกวันที่ '+x.day+' พฤศจิกายน 2569">'+x.day+'</button></th>').join('');
 const staffRows=staff.map((person,i)=>{
  const values=shiftNovSheetCount(i);
  const nick=SHIFT_NOV_SHEET_NICKNAMES[i]||'—';
  const cells=dates.map(({day})=>{
   const code=NOVEMBER_2026_DUTY_POSITIONS[i][day-1];
   const tone=code==='H'?'H':code[0];
   const anomaly=day===30&&code==='N1';
   const name=shiftNovEscape(person.name);
   const title=name+' • '+day+' พ.ย. 2569 • '+(code==='H'?'หยุด':code)+(anomaly?' • ตำแหน่ง N1 ซ้ำในภาพต้นฉบับ':'');
   return '<td class="shift-nov-sheet-duty '+tone+(anomaly?' discrepancy':'')+'" data-shift-nov-date="'+day+'">'+
    '<button type="button" data-shift-nov-person="'+i+'" data-shift-nov-date="'+day+'" title="'+title+'" aria-label="'+title+'">'+code+'</button></td>';
  }).join('');
  return '<tr class="shift-nov-sheet-person shift-nov-sheet-row-'+i+'">'+
   '<th class="shift-nov-name shift-nov-sheet-name" scope="row" title="'+shiftNovEscape(person.name)+'">'+shiftNovEscape(person.name)+'</th>'+cells+
   '<td class="shift-nov-sheet-duty H shift-nov-sheet-phantom" title="ช่อง H เสริมตามแบบตาราง ไม่ใช่วันที่ 31">H</td>'+
   shiftNovSheetMetric(values.day,'D')+shiftNovSheetMetric(values.night,'N')+
   shiftNovSheetMetric(0,'T')+shiftNovSheetMetric(0,'S')+
   shiftNovSheetMetric(0,'leave')+shiftNovSheetMetric(values.restReference,'holiday')+
   shiftNovSheetMetric(values.working,'workdays')+shiftNovSheetMetric(values.hours,'hours')+
   shiftNovSheetMetric(SHIFT_NOV_SHEET_COMPANY_DAYS,'companydays')+
   shiftNovSheetMetric(SHIFT_NOV_SHEET_COMPANY_HOURS,'companyhours')+
   '<td class="shift-nov-sheet-nickname">'+shiftNovEscape(nick)+'</td></tr>';
 }).join('');
 const totals=shiftNovSheetTotals();
 const dayCount=dates.map(({day})=>
  '<td class="shift-nov-sheet-daily D">'+NOVEMBER_2026_DUTY_POSITIONS.filter(row=>row[day-1]?.[0]==='D').length+'</td>').join('');
 const nightCount=dates.map(({day})=>
  '<td class="shift-nov-sheet-daily N">'+NOVEMBER_2026_DUTY_POSITIONS.filter(row=>row[day-1]?.[0]==='N').length+'</td>').join('');
 const metricHead=summaryLabels.map(([label,code,key])=>'<th scope="col" class="shift-nov-sheet-summary-head '+key+'">'+label+'</th>').join('');
 const metricCode=summaryLabels.map(([label,code,key])=>'<th scope="col" class="shift-nov-sheet-summary-code '+key+'">'+code+'</th>').join('');
 const totalMetrics=[
  shiftNovSheetMetric(totals.day,'D'),
  shiftNovSheetMetric(totals.night,'N'),
  shiftNovSheetMetric(0,'T'),shiftNovSheetMetric(0,'S'),
  shiftNovSheetMetric(0,'leave'),shiftNovSheetMetric(totals.restReference,'holiday'),
  shiftNovSheetMetric(totals.working,'workdays'),
  shiftNovSheetMetric(totals.hours,'hours'),
  shiftNovSheetMetric('—','companydays'),
  shiftNovSheetMetric(SHIFT_NOV_SHEET_COMPANY_HOURS*staff.length,'companyhours'),
  '<td class="shift-nov-sheet-nickname"></td>'
 ].join('');
 const emptyTotals='<td colspan="11" class="shift-nov-sheet-totalblank"></td>';
 host.innerHTML='<table class="shift-nov-table shift-nov-reference-sheet" aria-label="ตารางเวรพฤศจิกายน 2569 ตามแบบอ้างอิง มีรหัสรายวันและสรุปต่อคน">'+
  '<colgroup><col class="shift-nov-col-name">'+dates.map(()=>'<col class="shift-nov-col-day">').join('')+
  '<col class="shift-nov-col-day">'+summaryLabels.map(()=>'<col class="shift-nov-col-summary">').join('')+
  '<col class="shift-nov-col-workdays"><col class="shift-nov-col-hours"><col class="shift-nov-col-companydays"><col class="shift-nov-col-companyhours"><col class="shift-nov-col-nickname"></colgroup>'+
  '<thead><tr class="shift-nov-sheet-title-row">'+
   '<th colspan="32" class="shift-nov-sheet-title">พฤศจิกายน 2569</th>'+
   '<th colspan="6" class="shift-nov-sheet-title shift-nov-sheet-metric-title">จำนวนวันทำงานและวันหยุด</th>'+
   '<th rowspan="3" class="shift-nov-sheet-tall workdays">วันทำงานครบ <small>(วัน)</small></th>'+
   '<th rowspan="3" class="shift-nov-sheet-tall hours">ชั่วโมงการทำงาน <small>(ชั่วโมง)</small></th>'+
   '<th rowspan="3" class="shift-nov-sheet-tall companydays">วันทำงานบริษัท <small>(วัน)</small></th>'+
   '<th rowspan="3" class="shift-nov-sheet-tall companyhours">ชั่วโมงการทำงานบริษัท <small>(ชั่วโมง)</small></th>'+
   '<th rowspan="3" class="shift-nov-sheet-tall nickname">ชื่อเล่น</th></tr>'+
   '<tr class="shift-nov-sheet-weekday-row"><th rowspan="2" class="shift-nov-name shift-nov-sheet-name-header">ชื่อพนักงาน</th>'+
    headWeekdays+'<th class="shift-nov-sheet-phantom-head">H</th>'+metricHead+'</tr>'+
   '<tr class="shift-nov-sheet-date-row">'+headDates+'<th class="shift-nov-sheet-phantom-head">H</th>'+metricCode+'</tr></thead>'+
   '<tbody>'+staffRows+'</tbody>'+
   '<tfoot><tr class="shift-nov-sheet-totalrow D"><th class="shift-nov-name">D</th>'+dayCount+
    '<td class="shift-nov-sheet-daily H">0</td>'+totalMetrics+'</tr>'+
    '<tr class="shift-nov-sheet-totalrow N"><th class="shift-nov-name">N</th>'+nightCount+
    '<td class="shift-nov-sheet-daily N">0</td>'+emptyTotals+'</tr></tfoot></table>';
 let footer=document.querySelector('#shiftNovemberView .shift-nov-sheet-legend');
 if(!footer){
  footer=document.createElement('div');
  footer.className='shift-nov-sheet-legend';
  host.after(footer);
 }
 footer.innerHTML='<span><b class="D">D</b> 8:30–20:30 น.</span>'+
  '<span><b class="N">N</b> 20:30–8:30 น.</span>'+
  '<span><b class="H">H</b> วันหยุด</span>'+
  '<small>ช่อง H ต่อจากวันที่ 30 เป็นช่องอ้างอิงเพิ่มเติมในภาพ ไม่ใช่วันที่ 31 • สรุปนับจากตารางรายคน'+
  ' • ชั่วโมงเวรตามแบบอ้างอิง: 10.5 ชม./วัน</small>';
 shiftNovMarkDay();
}
shiftNovRenderGrid=shiftNovRenderReferenceSheet;
