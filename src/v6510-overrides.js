// Shift v6.5.10 — compact Matrix visual layer only.
// Keep Overview, Matrix renderers, schedule data, interactions and timeline logic unchanged.
function v6510StampVersion(){
  if(typeof document!=='undefined')document.documentElement.dataset.appVersion='6.5.10';
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v6510StampVersion,{once:true});
  else v6510StampVersion();
}
