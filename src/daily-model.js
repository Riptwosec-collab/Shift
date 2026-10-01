import { formatStatus } from './data.js';
import { currentWorkStreak, currentNightStreak } from './cache.js';

export const currentWorkStreakAt=(personIndex,day,staff)=>currentWorkStreak(staff,personIndex,day);
export const currentNightStreakAt=(personIndex,day,staff)=>currentNightStreak(staff,personIndex,day);

export function compareAdjacentDay(day,cache){
  const cur=cache.dayStats[day];
  const diff=x=>x?{D:x.D-cur.D,N:x.N-cur.N,OFF:x.OFF-cur.OFF,working:x.working-cur.working,coverage:x.coverage-cur.coverage}:null;
  return {previous:day>1?diff(cache.dayStats[day-1]):null,next:day<31?diff(cache.dayStats[day+1]):null};
}

export function shiftTransitions(day,staff){
  if(day>=31)return [];
  return staff.map((p,i)=>({i,name:p.name,from:formatStatus(p.s[day-1]),to:formatStatus(p.s[day])})).filter(x=>x.from!==x.to);
}

export function dailyModel(day,cache,staff){
  const lists={D:[],N:[],OFF:[]};
  const working=[];
  staff.forEach((p,i)=>{
    const raw=p.s[day-1],status=formatStatus(raw);
    const row={i,name:p.name,status,workStreak:currentWorkStreakAt(i,day,staff),nightStreak:currentNightStreakAt(i,day,staff)};
    lists[status].push(row);
    if(raw!=='O')working.push(row);
  });
  const counts=cache.dayStats[day];
  return {...lists,working,counts,coverage:counts.coverage,comparison:compareAdjacentDay(day,cache),transitions:shiftTransitions(day,staff)};
}
