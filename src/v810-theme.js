/* Shift V8.1 — persistent accessible light / dark switch.
   Only DOM/theme preferences; never touches roster, dates, navigation or data. */
const SHIFT81_THEME_KEY='shift.theme';
function shift81StoredTheme(){
 try{return localStorage.getItem(SHIFT81_THEME_KEY)==='light'?'light':'dark'}catch{return 'dark'}
}
function shift81ThemeLocale(){
 return document.documentElement.dataset.locale==='en'||document.documentElement.lang==='en'?'en':'th';
}
function shift81SyncThemeButton(){
 const button=document.querySelector('[data-shift-theme-toggle]');
 if(!button)return;
 const dark=document.documentElement.dataset.shiftTheme==='dark';
 const en=shift81ThemeLocale()==='en';
 const icon=button.querySelector('.shift81-theme-icon');
 const label=button.querySelector('.shift81-theme-label');
 if(icon)icon.textContent=dark?'☾':'☀';
 if(label)label.textContent=en?(dark?'Dark':'Light'):(dark?'กรมท่าเข้ม':'สว่าง');
 button.setAttribute('aria-pressed',String(dark));
 button.setAttribute('aria-label',en?(dark?'Dark theme active; switch to light':'Light theme active; switch to dark'):(dark?'กำลังใช้ธีมน้ำเงินเข้ม กดเพื่อเปลี่ยนเป็นธีมสว่าง':'กำลังใช้ธีมสว่าง กดเพื่อเปลี่ยนเป็นธีมน้ำเงินเข้ม'));
 button.title=button.getAttribute('aria-label');
}
function shift81SetTheme(value,persist=true){
 const mode=value==='dark'?'dark':'light';
 document.documentElement.dataset.shiftTheme=mode;
 const meta=document.querySelector('meta[name="theme-color"]');
 if(meta)meta.setAttribute('content',mode==='dark'?'#090F1B':'#E8ECF1');
 if(persist){try{localStorage.setItem(SHIFT81_THEME_KEY,mode)}catch{}}
 shift81SyncThemeButton();
 return mode;
}
function shift81InitTheme(){
 const actions=document.querySelector('.command-actions');
 if(!actions)return;
 let button=actions.querySelector('[data-shift-theme-toggle]');
 if(!button){
  button=document.createElement('button');
  button.type='button';
  button.className='shift81-theme-toggle';
  button.dataset.shiftThemeToggle='true';
  button.innerHTML='<span class="shift81-theme-icon" aria-hidden="true">☾</span><span class="shift81-theme-label">กรมท่าเข้ม</span>';
  button.addEventListener('click',()=>{
   const next=document.documentElement.dataset.shiftTheme==='dark'?'light':'dark';
   shift81SetTheme(next);
  });
  const language=actions.querySelector('.v65-language');
  if(language)actions.insertBefore(button,language);
  else actions.appendChild(button);
 }
 shift81SetTheme(shift81StoredTheme(),false);
 document.addEventListener('v65:localechange',shift81SyncThemeButton);
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shift81InitTheme,{once:true});
 else shift81InitTheme();
}
