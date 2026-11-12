/**
 * Headless visual audit of the actual standalone Shift HTML.
 * Run after: npm run build && npm install --no-save playwright && npx playwright install chromium
 * Reports computed contrast, overlapping named controls, document overflow,
 * and screenshots for light/dark at representative desktop/tablet/mobile widths.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join, extname, sep } from 'node:path';
const root=process.cwd(),out=join(root,'artifacts','visual-qa');
mkdirSync(out,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=createServer((req,res)=>{
 let decoded='/';
 try{decoded=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return}
 let file=resolve(root,'.'+decoded);
 if(decoded==='/'||!file.startsWith(root+sep)){file=resolve(root,'index.html')}
 if(!existsSync(file)){res.writeHead(404);res.end();return}
 try{res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(readFileSync(file))}
 catch(err){res.writeHead(500);res.end(String(err))}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const widths=[375,768,1440],views=['overview','daily','person','month','analytics','oncall'];
const reports=[];
function colorEvalScript(){
 const bg=parseCssColor=>{const m=parseCssColor?.match(/rgba?\(([^)]+)\)/i);if(!m)return null;const n=m[1].replaceAll(',',' ').replace('/',' ').split(/\s+/).filter(Boolean).map(Number);return [n[0],n[1],n[2],Number.isFinite(n[3])?n[3]:1]};
 const lum=rgb=>rgb.slice(0,3).map(c=>c/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
 const mix=(back,front)=>{const a=front[3];return [0,1,2].map(i=>back[i]*(1-a)+front[i]*a)};
 const contrast=(fg,bg)=>{let aa=lum(fg),bb=lum(bg);return +((Math.max(aa,bb)+.05)/(Math.min(aa,bb)+.05)).toFixed(2)};
 const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,r:r.right,b:r.bottom,w:r.width,h:r.height}};
 const selectors=['#overviewView .roster-card .person-row .row-name','#overviewView .roster-card .person-row .row-meta',
 '#overviewView .insights-panel .insight-item b','#overviewView .insights-panel .insight-value',
 '#overviewView .v6517-note b','#overviewView .v6517-note span','#overviewView .v6517-oncall-item b',
 '#dailyView .person-row .row-name','#personView .person-pick .row-name',
 '#analyticsView .analytics-card .value','#monthView .heatmap .v6519-full-name',
 '#shift740FullMonth .s740-name b','#shiftNovemberView .shift72-person-copy b',
 '#mobileNav button:not(.active)','.shift-install-dock .shift-pwa-install',
 '#dailyView .daily-timeline .date-node:not(.active) .dow',
 '#dailyView .daily-timeline .date-node:not(.active) .mini',
 '#oncallView .v655-now-panel header strong',
 '#oncallView .v655-now-panel header small',
 '#oncallView .v655-engineer-card strong',
 '#oncallView .v6515-oncall-title strong',
 '#oncallView .v6515-oncall-row b',
 '#oncallView .v6515-oncall-row small',
 '#dailyView .daily-timeline .date-node.active .mini'];
 const problems=[],samples=[];
 const rootMode=document.documentElement.dataset.shiftTheme;
 for(const selector of selectors){
  const el=[...document.querySelectorAll(selector)].find(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0});
  if(!el)continue;
  const s=getComputedStyle(el),fore=bg(s.color);
  if(!fore)continue;
  const ancestors=[];let p=el;
  while(p){ancestors.unshift(p);p=p.parentElement}
  let back=rootMode==='dark'?[0,0,0]:[255,255,255];
  for(const parent of ancestors){const b=bg(getComputedStyle(parent).backgroundColor);if(b&&b[3]>0)back=mix(back,b)}
  const ratio=contrast(fore,back);
  samples.push({selector,ratio,foreground:s.color,background:back.map(Math.round),text:el.textContent.slice(0,40)});
  if(ratio<4.5)problems.push({type:'contrast',selector,ratio,text:el.textContent.slice(0,36)});
 }
 const checks=[['#overviewView .roster-card .person-row','.row-copy','.status-badge'],
 ['#dailyView .roster-card .person-row','.row-copy','.status-badge'],
 ['#overviewView .insights-panel .insight-item',':scope > span:nth-child(2)','.insight-value']];
 for(const [outer,a,b] of checks){
  for(const el of [...document.querySelectorAll(outer)].slice(0,15)){
   const left=el.querySelector(a),right=el.querySelector(b);
   if(!left||!right)continue;
   const x=rect(left),y=rect(right);
   const overlap=Math.min(x.r,y.r)-Math.max(x.x,y.x);
   const across=Math.min(x.b,y.b)-Math.max(x.y,y.y);
   if(overlap>3&&across>3)problems.push({type:'overlap',outer,width:overlap,text:left.textContent.slice(0,40)});
  }
 }
 for(const mini of document.querySelectorAll('#dailyView.active .daily-timeline .date-node .mini')){
  if(mini.scrollWidth>mini.clientWidth+4)
   problems.push({type:'date-rail-overflow',scroll:mini.scrollWidth,client:mini.clientWidth,text:mini.textContent});
 }
 if(document.documentElement.scrollWidth>innerWidth+10)
  problems.push({type:'horizontal-overflow',px:document.documentElement.scrollWidth-innerWidth});
 return {problems,samples,bodyBackground:getComputedStyle(document.body).backgroundColor,
  htmlBackground:getComputedStyle(document.documentElement).backgroundColor,
  domWidth:document.documentElement.scrollWidth};
}
try{
 for(const theme of ['light','dark']){
  for(const width of widths){
   const context=await browser.newContext({viewport:{width,height:860},deviceScaleFactor:1,
    serviceWorkers:'block',reducedMotion:'reduce'});
   await context.addInitScript((t)=>{localStorage.setItem('shift.theme',t)},theme);
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(String(e.message)));
   await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForTimeout(1300);
   await page.addStyleTag({content:'.v613-loader,.boot-overlay,#bootOverlay{display:none!important;pointer-events:none!important}'});
   for(const view of views){
    await page.evaluate((v)=>{
     try{if(typeof showView==='function')showView(v);else{document.querySelectorAll('.view').forEach(e=>e.classList.toggle('active',e.id===v+'View'))}}catch(e){console.error(e)}
     document.documentElement.style.scrollBehavior='auto';
     document.body.style.scrollBehavior='auto';
     window.scrollTo({top:0,behavior:'instant'});
    },view);
    await page.waitForTimeout(100);
    const report=await page.evaluate(colorEvalScript);
    const name=theme+'-'+width+'-'+view;
    await page.screenshot({path:join(out,name+'.png'),fullPage:false,animations:'disabled'});
    const focus=view==='overview'?'#overviewView .insights-panel':
      view==='daily'?'#dailyView .roster-card':
      view==='oncall'?'#oncallView .v655-selected-day-detail':null;
    if(focus){const target=page.locator(focus).first();if(await target.isVisible().catch(()=>false))
     await target.screenshot({path:join(out,name+'-focus.png'),animations:'disabled'}).catch(()=>{});}
    reports.push({theme,width,view,...report,pageErrors:errors.slice(0,5)});
    console.log('VISUAL_QA '+name+' '+JSON.stringify({issues:report.problems,
      samples:report.samples.filter(x=>x.ratio<6).slice(0,6),errorCount:errors.length}));
   }
   await context.close();
  }
 }
}finally{await browser.close();await new Promise(r=>server.close(r))}
writeFileSync(join(out,'summary.json'),JSON.stringify(reports,null,2));
const failures=reports.flatMap(x=>x.problems.map(y=>({theme:x.theme,width:x.width,view:x.view,...y})));
console.log('VISUAL_QA_TOTAL '+JSON.stringify({scenarios:reports.length,issues:failures.length,failures:failures.slice(0,100)}));
if(failures.length)process.exitCode=1;
