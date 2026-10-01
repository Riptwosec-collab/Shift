// Additive day synchronization for legacy timeline, analytics waveform, and month cells.
(function bindV64SharedDayInteractions(){
  const analytics=document.getElementById('analyticsView');
  analytics?.addEventListener('click',event=>{
    const point=event.target.closest?.('circle.activity-point[data-day]');
    if(!point)return;
    const day=Math.max(1,Math.min(31,Number(point.dataset.day)||1));
    v64State.setSelectedDay(day);
    setSelectedDay(day,false);
  });

  const legacyOpenCellModal=window.openCellModal;
  if(typeof legacyOpenCellModal==='function')window.openCellModal=function(index,day){
    const result=legacyOpenCellModal(index,day);
    day=Math.max(1,Math.min(31,Number(day)||1));
    v64State.setSelectedDay(day);
    setSelectedDay(day,false);
    return result;
  };
})();
