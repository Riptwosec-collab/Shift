export function analyticsModel(cache){
  const people=cache.personStats.map(p=>({...p,deltaFromAvg:+(p.working-cache.teamStats.avgWork).toFixed(1)}));
  const daily=cache.dayStats.slice(1);
  const team={...cache.teamStats,highestWork:Math.max(...people.map(p=>p.working)),lowestWork:Math.min(...people.map(p=>p.working))};
  return {people,daily,team};
}
