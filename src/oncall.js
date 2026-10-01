export const ONCALL_SCHEDULE=Object.freeze([
  {month:10,start:1,end:7,name:'ป้อ'},
  {month:10,start:8,end:14,name:'เอิร์ท'},
  {month:10,start:15,end:21,name:'ตั้ม'},
  {month:10,start:22,end:28,name:'แอม'},
  {month:10,start:29,end:31,name:'ป้อ'},
  {month:11,start:1,end:4,name:'ป้อ'},
  {month:11,start:5,end:11,name:'เอิร์ท'},
  {month:11,start:12,end:18,name:'ตั้ม'},
  {month:11,start:19,end:25,name:'แอม'},
  {month:11,start:26,end:30,name:'ป้อ'},
  {month:12,start:1,end:2,name:'ป้อ'},
  {month:12,start:3,end:9,name:'เอิร์ท'},
  {month:12,start:10,end:16,name:'ตั้ม'},
  {month:12,start:17,end:23,name:'แอม'},
  {month:12,start:24,end:30,name:'ป้อ'}
]);

export const ONCALL_ENGINEERS=Object.freeze(['ป้อ','เอิร์ท','ตั้ม','แอม']);

function validOncallDate(date){return date instanceof Date&&!Number.isNaN(date.getTime())&&date.getFullYear()===2026}

export function findOncallAssignments(schedule,date){
  if(!Array.isArray(schedule)||!validOncallDate(date))return [];
  const month=date.getMonth()+1,day=date.getDate();
  return schedule.filter(row=>row&&row.month===month&&day>=row.start&&day<=row.end);
}

export function getOncallAssignmentsForDate(date){return findOncallAssignments(ONCALL_SCHEDULE,date)}

export function getOncallForDate(date){return getOncallAssignmentsForDate(date)[0]||null}

export function getNextOncallAssignments(date=new Date()){
  if(!(date instanceof Date)||Number.isNaN(date.getTime()))return [];
  const stamp=new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime();
  const future=ONCALL_SCHEDULE.map(row=>({...row,date:new Date(2026,row.month-1,row.start)})).filter(row=>row.date.getTime()>stamp);
  if(!future.length)return [];
  const nextStamp=Math.min(...future.map(row=>row.date.getTime()));
  return future.filter(row=>row.date.getTime()===nextStamp).map(({date:rowDate,...row})=>row);
}

export function getNextOncall(date=new Date()){return getNextOncallAssignments(date)[0]||null}

export function oncallByMonth(month){return ONCALL_SCHEDULE.filter(row=>row.month===Number(month))}

export function getOncallMonthMatrix(month){
  const m=Number(month),daysInMonth=new Date(2026,m,0).getDate(),rows=oncallByMonth(m);
  const days=Array.from({length:daysInMonth},(_,index)=>{
    const day=index+1,assignments=rows.filter(item=>day>=item.start&&day<=item.end),row=assignments[0]||null;
    return {day,assignments,name:row?.name||null,start:row?.start??null,end:row?.end??null};
  });
  const totals=Object.fromEntries(ONCALL_ENGINEERS.map(name=>[name,days.reduce((total,item)=>total+Number(item.assignments.some(row=>row.name===name)),0)]));
  return {month:m,daysInMonth,engineers:[...ONCALL_ENGINEERS],days,totals,unassigned:days.filter(item=>item.assignments.length===0).length};
}
