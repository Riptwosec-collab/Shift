export function mountLegacyOverview(root,snapshot,cache,actions={}){
  if(typeof globalThis.renderOverview==='function') globalThis.renderOverview();
  bindLegacyOverviewActions(root,actions);
  return true;
}

export function updateLegacyOverview(root,snapshot,cache){
  if(typeof globalThis.renderOverview==='function') globalThis.renderOverview();
  return true;
}

function bindLegacyOverviewActions(root,actions){
  if(!root||root.dataset?.v64OverviewBound==='1') return;
  root.dataset.v64OverviewBound='1';
  root.addEventListener('click',event=>{
    const day=event.target.closest?.('[data-day]');
    if(day&&actions.onDay) actions.onDay(Number(day.dataset.day));
    const person=event.target.closest?.('[data-person]');
    if(person&&actions.onPerson) actions.onPerson(Number(person.dataset.person));
  });
}
