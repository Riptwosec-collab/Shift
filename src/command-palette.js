import {STAFF} from './data.js';
const paletteViews=['overview','daily','person','month','analytics','team'];

export function parseCommandQuery(q,options={}){
  q=String(q||'').trim().toLowerCase();
  if(!q)return [];
  const out=[],locale=options.locale||'th',t=typeof options.t==='function'?options.t:null,formatDate=typeof options.formatDate==='function'?options.formatDate:null;
  const n=parseInt(q,10);
  if(n>=1&&n<=31)out.push({type:'day',day:n,label:formatDate?formatDate(n):(locale==='en'?`${n} October 2026`:`วันที่ ${n} ตุลาคม`)});
  for(const v of paletteViews){
    if(v.includes(q)||q.includes(v)){
      const view=v==='team'?'overview':v;
      const key=v==='team'?'network.title':`nav.${v}`;
      out.push({type:'view',view,source:v,label:t?t(key,{},locale):v});
    }
  }
  const status=q==='d'||q.includes('day')||q.includes('กลางวัน')?'D':q==='n'||q.includes('night')||q.includes('กลางคืน')?'N':q.includes('off')?'O':null;
  if(status)out.push({type:'status',code:status,label:status==='O'?'OFF':status});
  STAFF.forEach((p,i)=>{if(p.name.toLowerCase().includes(q))out.push({type:'person',i,label:p.name})});
  return out;
}

export function shouldOpenPalette(e){if(['INPUT','TEXTAREA','SELECT'].includes(e.targetTag)||e.contentEditable)return false;return e.key==='/'||((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='k')}
