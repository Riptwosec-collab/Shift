/* Shift v6.5.18 — Rebalance the existing live views; no duplicated schedule data. */
function v6518InitBalancedLayout(){
 const root=document.documentElement;
 if(root.dataset.v6518Layout==='ready')return;
 const view=document.getElementById('overviewView');
 if(!view)return;
 const hero=view.querySelector(':scope > .hero-grid');
 if(!document.getElementById('v6517Dashboard')&&typeof v6517Init==='function')v6517Init();
 const deck=document.getElementById('v6517Dashboard');
 const timeline=view.querySelector(':scope > .timeline-panel');
 const rosters=view.querySelector(':scope > .overview-main');
 const network=view.querySelector(':scope > .lower-grid');
 const kpis=deck?.querySelector(':scope > .v6517-kpis');
 const bottom=deck?.querySelector(':scope > .v6517-bottom-grid');
 const matrix=deck?.querySelector('#v6517MatrixTarget');
 // The original hero and metrics retain their IDs in the DOM for the old renderers.
 // Only their duplicate visual block is hidden after the new layout is committed.
 if(!deck||!timeline||!rosters||!network||!kpis||!bottom||!matrix||!hero)return;
 deck.insertBefore(timeline,kpis);
 deck.insertBefore(rosters,bottom);
 deck.appendChild(network);
 root.dataset.v6518Layout='ready';
 root.dataset.appVersion='6.5.20';
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v6518InitBalancedLayout,{once:true});
 else v6518InitBalancedLayout();
}
