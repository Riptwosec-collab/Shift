// Shift v6.5.11 — zero-scroll Matrix visual layer only.
function v6511StampVersion(){
  if(typeof document!=='undefined')document.documentElement.dataset.appVersion='6.5.11';
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v6511StampVersion,{once:true});
  else v6511StampVersion();
}
