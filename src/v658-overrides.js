// Shift v6.5.8 — centered Overview focus; Matrix/Timeline behavior remains owned by v6.5.5.
function v652Overview(now){
  return `<div class="v658-overview-center">${v657RenderOverviewPairMatrix(now)}</div>`;
}

function v658StampVersion(){document.documentElement.dataset.appVersion='6.5.8'}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v658StampVersion,{once:true});
  else v658StampVersion();
}
