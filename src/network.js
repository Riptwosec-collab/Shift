export const normalizeStrength=(raw,max)=>max?Math.round(raw/max*100):0;
export function networkModel(center,cache,limit=6){const rel=cache.pairStats.filter(x=>x.a===center||x.b===center).map(x=>({...x,other:x.a===center?x.b:x.a})).sort((a,b)=>b.strength-a.strength);return {center,nodes:rel.slice(0,limit),relations:rel,top:rel[0]||null}}
