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

export function getOncallForDate(date){
  if(!(date instanceof Date)||Number.isNaN(date.getTime())||date.getFullYear()!==2026)return null;
  const month=date.getMonth()+1,day=date.getDate();
  return ONCALL_SCHEDULE.find(row=>row.month===month&&day>=row.start&&day<=row.end)||null;
}

export function getNextOncall(date=new Date()){
  const stamp=new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime();
  return ONCALL_SCHEDULE.map(row=>({...row,date:new Date(2026,row.month-1,row.start)})).find(row=>row.date.getTime()>stamp)||null;
}

export function oncallByMonth(month){return ONCALL_SCHEDULE.filter(row=>row.month===Number(month))}
