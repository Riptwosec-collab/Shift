/* Shift v6.5.13 — install affordance; no schedule or application state persistence. */
function initV6513PWA(){
  const host=document.querySelector('.command-actions');
  const root=document.documentElement;
  if(!host||root.dataset.v6513PwaReady==='1')return;
  root.dataset.v6513PwaReady='1';
  root.dataset.appVersion='6.5.13';
  const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)')?.matches||window.navigator.standalone===true;
  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
  let pendingInstall=null;
  const button=document.createElement('button');
  button.type='button';
  button.className='sys-btn shift-pwa-install';
  button.textContent='＋';
  button.setAttribute('aria-label','ติดตั้ง Shift เป็นแอป / Install Shift');
  button.setAttribute('title','ติดตั้ง Shift / Install Shift');
  button.hidden=!isIOS||isStandalone();
  host.appendChild(button);
  const showHelp=()=>{
    let tip=document.getElementById('shift-pwa-help');
    if(!tip){
      tip=document.createElement('div');
      tip.id='shift-pwa-help';
      tip.className='shift-pwa-help';
      tip.setAttribute('role','status');
      tip.innerHTML='<span>บน iPhone หรือ iPad ให้กด Share แล้วเลือก Add to Home Screen / เพิ่มไปยังหน้าจอโฮม</span><button type="button" aria-label="ปิดคำแนะนำ">×</button>';
      host.after(tip);
      tip.querySelector('button')?.addEventListener('click',()=>tip.remove());
    }else{tip.remove()}
  };
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    pendingInstall=event;
    if(!isStandalone())button.hidden=false;
  });
  window.addEventListener('appinstalled',()=>{pendingInstall=null;button.hidden=true;document.getElementById('shift-pwa-help')?.remove()});
  button.addEventListener('click',async()=>{
    if(pendingInstall){
      const prompt=pendingInstall;
      pendingInstall=null;
      button.hidden=true;
      try{await prompt.prompt();await prompt.userChoice}catch{}
      return;
    }
    if(isIOS&&!isStandalone())showHelp();
  });
  const canRegister=('serviceWorker' in navigator)&&
    (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1');
  if(canRegister){
    const register=()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
    if(document.readyState==='complete')register();
    else window.addEventListener('load',register,{once:true});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV6513PWA,{once:true});
else initV6513PWA();
