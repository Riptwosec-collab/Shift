/* Shift v6.5.20 PWA install hotfix — inspect actual production resources, not just file names. */
function initV6513PWA(){
  const root=document.documentElement;
  if(root.dataset.v6513PwaReady==='1')return;
  const host=document.querySelector('.command-actions')||document.querySelector('.command-bar')||document.body;
  root.dataset.v6513PwaReady='1';
  root.dataset.appVersion='6.5.20';
  const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)')?.matches||window.navigator.standalone===true;
  const ua=navigator.userAgent||'';
  const isIOS=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const isAndroid=/Android/i.test(ua);
  const inApp=/(FBAN|FBAV|Instagram|Line\/|MicroMessenger|TikTok|Snapchat)/i.test(ua);
  const iosSafari=isIOS&&/Safari/i.test(ua)&&!/(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua)&&!inApp;
  const secure=()=>window.isSecureContext===true||location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
  let pendingInstall=null;
  let helpBox=null;
  const button=document.createElement('button');
  button.type='button';
  button.className='sys-btn shift-pwa-install';
  button.textContent='＋ ติดตั้ง';
  button.setAttribute('aria-label','ติดตั้ง Shift เป็นแอป / Install Shift');
  button.setAttribute('title','ติดตั้ง Shift ลงหน้าจอโฮม');
  button.hidden=isStandalone();
  host.appendChild(button);

  const closeHelp=()=>{
    if(!helpBox)return;
    helpBox.remove();helpBox=null;
    button.focus({preventScroll:true});
  };
  const diagnosticLines=async()=>{
    const states=[];
    states.push(secure()?'HTTPS: ผ่าน':'HTTPS: ไม่ผ่าน — ต้องใช้ HTTPS');
    try{
      const response=await fetch('./manifest.webmanifest',{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const manifest=await response.json();
      if(!manifest?.name||!manifest?.start_url||!manifest?.icons?.length)throw new Error('Manifest ไม่มีข้อมูลสำคัญ');
      states.push('Manifest: ผ่าน');
      const primary=manifest.icons.find(icon=>icon.sizes?.includes('192x192'))||manifest.icons[0];
      const iconURL=new URL(primary.src,new URL('./manifest.webmanifest',location.href));
      const image=await fetch(iconURL,{cache:'no-store'});
      if(!image.ok||!image.headers.get('content-type')?.toLowerCase().startsWith('image/')){
        throw new Error('Icon '+image.status+' / '+(image.headers.get('content-type')||'ไม่มี MIME type'));
      }
      states.push('Icon: ผ่าน');
    }catch(error){
      states.push('Manifest/Icon: ไม่ผ่าน — '+(error?.message||'ตรวจสอบการ Deploy'));
    }
    try{
      const response=await fetch('./sw.js',{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const worker=await response.text();
      if(!worker.includes('shift-shell-v6.5.20'))throw new Error('ไฟล์ sw.js ยังไม่ใช่ v6.5.20');
      if(/^\s*<!doctype html|^\s*<html/i.test(worker))throw new Error('เซิร์ฟเวอร์ส่ง HTML แทน sw.js');
      states.push('ไฟล์ sw.js: ผ่าน (v6.5.20)');
    }catch(error){
      states.push('ไฟล์ sw.js: ไม่ผ่าน — '+(error?.message||'ตรวจสอบการ Deploy'));
    }
    if('serviceWorker' in navigator){
      try{
        const registration=await navigator.serviceWorker.getRegistration('./');
        states.push(registration?.active?'Service Worker: พร้อมใช้งาน':'Service Worker: ยังไม่ Active — ลองโหลดหน้านี้อีกครั้ง');
      }catch{states.push('Service Worker: ตรวจสอบไม่สำเร็จ')}
    }else states.push('Service Worker: เบราว์เซอร์นี้ไม่รองรับ');
    if(inApp)states.push('เบราว์เซอร์ในแอป: กรุณาเปิดลิงก์ใน Safari หรือ Chrome');
    if(isIOS)states.push('iPhone: ต้องกด Share → Add to Home Screen เอง (ไม่มี native install prompt)');
    return states;
  };
  const diagnosis=async(node)=>{
    if(!node?.isConnected)return;
    node.textContent='กำลังตรวจสอบไฟล์จริงบนเว็บไซต์…';
    const states=await diagnosticLines();
    if(node.isConnected)node.textContent=states.join('\n');
  };
  const showHelp=()=>{
    if(isStandalone())return;
    if(helpBox){closeHelp();return}
    const tip=document.createElement('section');
    tip.id='shift-pwa-help';
    tip.className='shift-pwa-help';
    tip.setAttribute('role','dialog');
    tip.setAttribute('aria-label','วิธีติดตั้ง Shift บนมือถือ');
    const close=document.createElement('button');
    close.type='button';close.className='shift-pwa-help-close';
    close.textContent='×';close.setAttribute('aria-label','ปิดคำแนะนำ');
    const title=document.createElement('strong');
    title.textContent='ติดตั้ง Shift ลงหน้าจอโฮม';
    const description=document.createElement('p');
    const instructions=document.createElement('ol');
    let steps=[];
    if(isIOS){
      description.textContent=iosSafari?'สำหรับ iPhone/iPad ผ่าน Safari':'สำหรับ iPhone/iPad ให้เปิดเว็บไซต์ใน Safari ก่อน';
      if(!iosSafari)steps.push('เปิดในเบราว์เซอร์ Safari (ไม่ใช่เบราว์เซอร์ใน LINE, Facebook หรือ Instagram)');
      steps.push('แตะปุ่มแชร์ Share (สี่เหลี่ยมมีลูกศรขึ้น) ใน Safari');
      steps.push('เลื่อนเมนูและเลือก เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)');
      steps.push('ถ้ามีตัวเลือก เปิดเป็นเว็บแอป ให้เปิดไว้ แล้วแตะ เพิ่ม (Add)');
    }else if(isAndroid){
      description.textContent='สำหรับ Android ผ่าน Chrome หรือเบราว์เซอร์ที่รองรับ';
      if(inApp)steps.push('เลือก เปิดในเบราว์เซอร์ Chrome จากเมนูของ LINE หรือแอปที่เปิดลิงก์');
      steps.push('แตะเมนู ⋮ ของ Chrome');
      steps.push('เลือก ติดตั้งแอป (Install app) หรือ เพิ่มไปยังหน้าจอหลัก (Add to Home screen)');
      steps.push('แตะ ติดตั้ง หรือ เพิ่ม เพื่อยืนยัน');
    }else{
      description.textContent='เปิดเว็บไซต์ผ่าน Safari บน iPhone หรือ Chrome บน Android';
      steps=['บน iPhone เปิดใน Safari แล้วกด Share → Add to Home Screen','บน Android เปิดใน Chrome แล้วกดเมนู ⋮ → Install app หรือ Add to Home screen'];
    }
    if(!secure())steps.unshift('ต้องเปิดเว็บด้วย HTTPS ก่อนจึงจะติดตั้ง PWA ได้');
    for(const instruction of steps){
      const li=document.createElement('li');li.textContent=instruction;instructions.appendChild(li);
    }
    const status=document.createElement('p');
    status.className='shift-pwa-diagnostics';
    status.setAttribute('aria-live','polite');
    status.textContent='กำลังตรวจสอบ HTTPS, Manifest และ Service Worker…';
    const retry=document.createElement('button');
    retry.type='button';retry.className='shift-pwa-retry';
    retry.textContent='ตรวจสอบอีกครั้ง';
    retry.addEventListener('click',()=>{void diagnosis(status)});
    const heading=document.createElement('div');
    heading.className='shift-pwa-help-heading';heading.append(title,close);
    tip.append(heading,description,instructions,status,retry);
    document.body.appendChild(tip);
    helpBox=tip;
    close.addEventListener('click',closeHelp);
    tip.addEventListener('keydown',event=>{if(event.key==='Escape')closeHelp()});
    close.focus({preventScroll:true});
    void diagnosis(status);
  };
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    pendingInstall=event;
    button.hidden=isStandalone();
  });
  window.addEventListener('appinstalled',()=>{
    pendingInstall=null;button.hidden=true;
    if(helpBox){helpBox.remove();helpBox=null}
  });
  window.addEventListener('pageshow',()=>{button.hidden=isStandalone()});
  button.addEventListener('click',async()=>{
    if(isStandalone()){button.hidden=true;return}
    if(pendingInstall){
      const prompt=pendingInstall;
      pendingInstall=null;
      try{
        await prompt.prompt();
        const outcome=await prompt.userChoice;
        if(outcome?.outcome!=='accepted')showHelp();
      }catch{showHelp()}
      return;
    }
    showHelp();
  });
  const canRegister=('serviceWorker' in navigator)&&secure();
  if(canRegister){
    const register=()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'})
        .then(registration=>{
          void registration.update().catch(()=>{});
          void navigator.serviceWorker.ready.catch(()=>{});
        })
        .catch(()=>{ /* install help reports registration failures */ });
    };
    // Register without waiting for all photos, fonts and other network requests to finish.
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',register,{once:true});
    else register();
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV6513PWA,{once:true});
else initV6513PWA();
