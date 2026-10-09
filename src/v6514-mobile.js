/* v6.5.14 — fast mobile navigation and live-local-day rollover. */
export function v6514TodayForLegacy(date=new Date()){
  if(!(date instanceof Date)||Number.isNaN(date.getTime()))return null;
  return date.getFullYear()===2026&&date.getMonth()===9?date.getDate():null;
}
export function v6514LocalDateKey(date=new Date()){
  if(!(date instanceof Date)||Number.isNaN(date.getTime()))return '';
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}
function initV6514Mobile(){
  const root=document.documentElement;
  if(root.dataset.v6514Ready==='1')return;
  root.dataset.v6514Ready='1';
  root.dataset.appVersion='6.5.14';

  // Paint the newly selected view before expensive legacy render hooks execute.
  const nav=document.getElementById('mobileNav');
  if(nav&&nav.dataset.v6514NavBound!=='1'){
    nav.dataset.v6514NavBound='1';
    let navToken=0;
    nav.addEventListener('click',event=>{
      if(!window.matchMedia('(max-width:860px)').matches)return;
      const target=event.target;
      const button=target?.closest?.('button[data-view]');
      if(!button||!nav.contains(button)||typeof window.showView!=='function')return;
      const name=button.dataset.view;
      const panel=document.getElementById(name+'View');
      if(!panel)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if(panel.classList.contains('active')){window.scrollTo(0,0);return}
      const token=++navToken;
      document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el===panel));
      document.querySelectorAll('.nav-btn,#mobileNav button').forEach(el=>{
        const active=el.dataset.view===name;
        el.classList.toggle('active',active);
        if(active)el.setAttribute('aria-current','page');
        else el.removeAttribute('aria-current');
      });
      window.scrollTo(0,0);
      requestAnimationFrame(()=>setTimeout(()=>{
        if(token!==navToken)return;
        window.showView(name);
        window.scrollTo(0,0);
      },0));
    },{capture:true});
  }

  let activeLocalDate=v6514LocalDateKey();
  let midnightTimer=0;
  const refreshForNewDay=()=>{
    if(document.hidden)return;
    const now=new Date(),dateKey=v6514LocalDateKey(now);
    if(!dateKey||dateKey===activeLocalDate)return;
    activeLocalDate=dateKey;
    const today=v6514TodayForLegacy(now);
    // The legacy roster dataset is October 2026 only: do not show any other month as October.
    if(today!==null&&typeof setSelectedDay==='function'){
      setSelectedDay(today,false);
    }
    if(typeof syncTodayTomorrowButtons==='function')syncTodayTomorrowButtons();
    const activeOncall=document.getElementById('oncallView')?.classList.contains('active');
    if([10,11,12].includes(now.getMonth()+1)&&now.getFullYear()===2026){
      if(typeof v652Month!=='undefined')v652Month=now.getMonth()+1;
      if(typeof v655SelectedDay!=='undefined')v655SelectedDay=now.getDate();
      if(activeOncall&&typeof renderV652Oncall==='function')renderV652Oncall();
    }else if(activeOncall&&typeof renderV652Oncall==='function'){
      renderV652Oncall();
    }
  };
  const scheduleMidnight=()=>{
    clearTimeout(midnightTimer);
    const now=new Date();
    const next=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
    midnightTimer=setTimeout(()=>{
      refreshForNewDay();
      scheduleMidnight();
    },Math.max(1000,next.getTime()-now.getTime()+120));
  };
  const checkAndSchedule=()=>{refreshForNewDay();scheduleMidnight()};
  window.addEventListener('focus',checkAndSchedule);
  window.addEventListener('pageshow',checkAndSchedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkAndSchedule()});
  scheduleMidnight();
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV6514Mobile,{once:true});
  else initV6514Mobile();
}
