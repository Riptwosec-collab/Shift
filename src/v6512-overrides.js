// Shift v6.5.12 — Matrix typography clarity visual layer only.
function v6512StampVersion(){
  if(typeof document!=='undefined')document.documentElement.dataset.appVersion='6.5.12';
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v6512StampVersion,{once:true});
  else v6512StampVersion();
}
