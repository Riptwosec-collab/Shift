export const DAYS_IN_MONTH = 31;
export const STAFF = Object.freeze([
{name:"นาย นลิทัศน์ นากรณ์",s:"OOOOODDDDOODDDDOOOODDOOOONNNNNN"},
{name:"นายกิตติ ยอดนนท์",s:"DDOODDDOOOODDOODDOOOONNNNNOODDO"},
{name:"นายครีมคนัย ศิริมาศย์",s:"OODDDDOODDDOODDOODDOODDDDDOOOOO"},
{name:"นายสถิตย์ พันธ์แดง",s:"OODDDOODDDDDOOODDDDOOOOOOODDDDO"},
{name:"นายวัชระ ภูเกิด",s:"NNNNOOOONNNOOOOONNNNNOOOODDDOOD"},
{name:"นายพัชร สันต์พิสิ",s:"OOOONNNNOOONNNNOOODDDDOOODDOODD"},
{name:"นายเสถียร มาสา",s:"DDOOONNNNOOONNNNOOODDDOOODDDOON"},
{name:"นายอิศเรศ เวียงอินทร์",s:"NNNNNOOOONNNOOONNNNOOOODDOODDOO"},
{name:"นายกฤติศ โพธิ์ไทรย์",s:"DDOOOODDDOODODDOOOONNNNNNOOODDO"},
{name:"นายกิตติศักดิ์ วัชรรังสิมันต์",s:"DDOODDDDOOOOODDOOODDDDDOOONNNNO"}
]);
export function statusAt(personIndex, day){ return STAFF[personIndex]?.s?.[day-1] ?? null; }
export function formatStatus(code){ return code==='O'?'OFF':code; }
export function dateMeta(day){ const d=new Date(2026,9,day); return {day,date:d,weekday:d.toLocaleDateString('th-TH',{weekday:'long'}),thai:d.toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'})}; }
