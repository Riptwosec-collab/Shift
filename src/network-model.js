export function pairRelation(center,other,cache){
  const row=cache.pairStats.find(x=>(x.a===center&&x.b===other)||(x.a===other&&x.b===center));
  if(!row)return {a:center,b:other,other,sameD:0,sameN:0,sameShift:0,handoff:0,raw:0,strength:0};
  return {...row,other};
}

export function networkModel(center,cache,limit=6){
  const relations=cache.pairStats
    .filter(x=>x.a===center||x.b===center)
    .map(x=>({...x,other:x.a===center?x.b:x.a}))
    .sort((a,b)=>b.strength-a.strength||b.sameShift-a.sameShift||a.other-b.other);
  return {center,nodes:relations.slice(0,Math.max(0,limit)),relations,top:relations[0]||null};
}
