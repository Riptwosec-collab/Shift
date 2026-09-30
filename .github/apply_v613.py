from pathlib import Path
import re

p=Path('index.html')
s=p.read_text(encoding='utf-8')

unsafe="new MutationObserver(normalizeOff).observe(document.body,{subtree:true,childList:true,characterData:true});"
if unsafe not in s:
    raise SystemExit('unsafe observer pattern not found')
if 'data-loader-version="6.1.2"' not in s:
    raise SystemExit('expected v6.1.2 loader not found')

old_norm="const normalizeOff=()=>{document.querySelectorAll('.month-cell.off .code,.pattern-day.O b,.heatmap td.shift.O').forEach(el=>{const t=el.textContent.trim();if(t==='—'||t==='O')el.textContent='OFF'});const f=document.querySelector('.footer');if(f)f.textContent=f.textContent.replace('O = OFF','OFF = วันหยุด')};"
new_norm="const normalizeOff=()=>{document.querySelectorAll('.month-cell.off .code,.pattern-day.O b,.heatmap td.shift.O,.matrix-cell.O').forEach(el=>{const t=el.textContent.trim();if(t==='—'||t==='O')el.textContent='OFF'});const f=document.querySelector('.footer');if(f&&f.textContent.includes('O = OFF'))f.textContent=f.textContent.replace('O = OFF','OFF = วันหยุด')};"
if old_norm not in s:
    raise SystemExit('normalizeOff source changed unexpectedly')
s=s.replace(old_norm,new_norm,1)

safe="const offObserver=new MutationObserver(()=>{offObserver.disconnect();normalizeOff();offObserver.observe(document.body,{subtree:true,childList:true})});offObserver.observe(document.body,{subtree:true,childList:true});"
s=s.replace(unsafe,safe,1)

def replace_tag(src,tag,idv,repl):
    a=src.find(f'<{tag} id="{idv}"')
    if a<0: raise SystemExit(f'{idv} not found')
    b=src.find(f'</{tag}>',a)
    if b<0: raise SystemExit(f'{idv} closing tag not found')
    b+=len(f'</{tag}>')
    return src[:a]+repl+src[b:]

def replace_div(src,idv,repl):
    a=src.find(f'<div id="{idv}"')
    if a<0: raise SystemExit(f'{idv} not found')
    depth=0
    end=None
    for m in re.finditer(r'<div\b[^>]*>|</div>',src[a:],re.I):
        t=m.group(0).lower()
        depth += 1 if t.startswith('<div') else -1
        if depth==0:
            end=a+m.end(); break
    if end is None: raise SystemExit('bootOverlay unbalanced')
    return src[:a]+repl+src[end:]

css='''<style id="v613-loader-style">
#bootOverlay{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 20% 10%,rgba(56,232,255,.12),transparent 28%),radial-gradient(circle at 82% 18%,rgba(119,91,255,.11),transparent 30%),linear-gradient(180deg,#020710,#06111f 66%,#040b14);color:#eefbff;font-family:"Leelawadee UI","Segoe UI",Tahoma,system-ui,sans-serif;transition:opacity .18s ease,visibility .18s ease;overflow:hidden}
#bootOverlay::before{content:"";position:absolute;inset:0;opacity:.28;background-image:linear-gradient(30deg,rgba(56,232,255,.11) 1px,transparent 1px),linear-gradient(150deg,rgba(56,232,255,.11) 1px,transparent 1px);background-size:64px 112px;mask-image:radial-gradient(circle at center,#000,transparent 82%)}#bootOverlay.out{opacity:0;visibility:hidden;pointer-events:none}
.boot613-shell{position:relative;width:min(760px,94vw);border:1px solid rgba(56,232,255,.2);border-radius:28px;background:linear-gradient(180deg,rgba(9,22,39,.9),rgba(4,13,24,.9));box-shadow:0 28px 90px rgba(0,0,0,.55),inset 0 1px rgba(255,255,255,.05);backdrop-filter:blur(18px);padding:24px;overflow:hidden}.boot613-top{display:flex;align-items:center;gap:14px;margin-bottom:18px}.boot613-logo{width:58px;height:58px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(56,232,255,.18),rgba(39,139,255,.12),rgba(119,91,255,.17));border:1px solid rgba(56,232,255,.24);box-shadow:0 0 34px rgba(56,232,255,.12)}.boot613-logo::before{content:"";width:28px;height:28px;clip-path:polygon(50% 0,100% 86%,71% 86%,50% 50%,29% 86%,0 86%);background:linear-gradient(180deg,#71f4ff,#278bff)}.boot613-title small{display:block;color:#7599b6;font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:800}.boot613-title h2{margin:3px 0;font-size:clamp(22px,3vw,34px)}.boot613-title p{margin:0;color:#9ab9d0;font-size:13px}.boot613-live{margin-left:auto;border:1px solid rgba(34,230,168,.28);background:rgba(34,230,168,.05);border-radius:999px;padding:9px 12px;color:#98f6d6;font-size:11px;font-weight:800;white-space:nowrap}.boot613-main{display:grid;grid-template-columns:260px 1fr;gap:18px;align-items:center}.boot613-radar{height:260px;display:grid;place-items:center;border:1px solid rgba(56,232,255,.13);border-radius:24px;background:radial-gradient(circle,rgba(56,232,255,.08),rgba(8,20,35,.34) 45%,rgba(3,12,22,.72))}.boot613-orbit{position:relative;width:170px;height:170px;border-radius:50%;border:1px solid rgba(56,232,255,.18);box-shadow:0 0 60px rgba(56,232,255,.08),inset 0 0 35px rgba(39,139,255,.04)}.boot613-arc{position:absolute;border-radius:50%;border:3px solid transparent;inset:18px;animation:b613spin .72s linear infinite}.boot613-arc.a{border-top-color:#38e8ff;border-right-color:#278bff}.boot613-arc.b{inset:34px;border-width:2px;border-top-color:#775bff;border-left-color:#775bff;animation-duration:1s;animation-direction:reverse}.boot613-arc.c{inset:49px;border-width:2px;border-bottom-color:#ffb43a;border-right-color:#ffb43a;animation-duration:1.25s}.boot613-core{position:absolute;inset:66px;border-radius:50%;background:radial-gradient(circle,#dffcff 0 8%,#38e8ff 10%,rgba(56,232,255,.13) 45%,transparent 70%);box-shadow:0 0 28px rgba(56,232,255,.28);animation:b613pulse .75s ease-in-out infinite alternate}.boot613-info{display:grid;gap:12px}.boot613-card{padding:15px 16px;border:1px solid rgba(56,232,255,.14);border-radius:18px;background:rgba(8,20,35,.7)}.boot613-card-head{display:flex;justify-content:space-between;gap:10px;margin-bottom:10px}.boot613-card-head span{font-size:12px;color:#88a8c0}.boot613-progress{height:12px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.05)}.boot613-progress i{display:block;height:100%;width:8%;border-radius:inherit;background:linear-gradient(90deg,#38e8ff,#278bff,#775bff);transition:width .14s ease}.boot613-readout{display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px}.boot613-pct{font-size:30px;font-weight:900}.boot613-phase{color:#7f9db5;font-size:11px;text-align:right}.boot613-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.boot613-mini{padding:10px;border:1px solid rgba(255,255,255,.055);border-radius:14px;background:rgba(255,255,255,.018)}.boot613-mini span{display:block;color:#6e8aa2;font-size:9px;letter-spacing:.1em;text-transform:uppercase}.boot613-mini b{display:block;margin-top:4px;font-size:14px}.boot613-mini:nth-child(1) b{color:#38e8ff}.boot613-mini:nth-child(2) b{color:#9b7cff}.boot613-mini:nth-child(3) b{color:#ffbf4a}.boot613-scan{height:8px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.035)}.boot613-scan i{display:block;width:34%;height:100%;background:linear-gradient(90deg,transparent,#38e8ff,transparent);animation:b613scan .75s ease-in-out infinite}@keyframes b613spin{to{transform:rotate(360deg)}}@keyframes b613pulse{to{transform:scale(1.13);opacity:.78}}@keyframes b613scan{from{transform:translateX(-120%)}to{transform:translateX(320%)}}@media(max-width:720px){.boot613-shell{padding:18px}.boot613-main{grid-template-columns:1fr}.boot613-radar{height:210px}.boot613-orbit{width:150px;height:150px}.boot613-live{display:none}.boot613-grid{grid-template-columns:1fr 1fr}.boot613-mini:last-child{grid-column:1/-1}}
</style>'''

html='''<div id="bootOverlay" data-loader-version="6.1.3" aria-label="Loading Shift Command Center"><div class="boot613-shell"><div class="boot613-top"><div class="boot613-logo"></div><div class="boot613-title"><small>Boot Sequence</small><h2>Loading Shift Command Center</h2><p>กำลังเชื่อมต่อ Shift Matrix และ Command UI…</p></div><div class="boot613-live">● LIVE BOOT</div></div><div class="boot613-main"><div class="boot613-radar"><div class="boot613-orbit"><i class="boot613-arc a"></i><i class="boot613-arc b"></i><i class="boot613-arc c"></i><i class="boot613-core"></i></div></div><div class="boot613-info"><div class="boot613-card"><div class="boot613-card-head"><b id="boot613Phase">Initializing Core Systems</b><span id="boot613Status">Starting…</span></div><div class="boot613-progress"><i id="boot613Bar"></i></div><div class="boot613-readout"><div class="boot613-pct" id="boot613Pct">8%</div><div class="boot613-phase" id="boot613Meta">phase 1 / 4<br>Secure startup</div></div></div><div class="boot613-grid"><div class="boot613-mini"><span>Module</span><b>Command UI</b></div><div class="boot613-mini"><span>Matrix</span><b>October 2569</b></div><div class="boot613-mini"><span>Status</span><b id="boot613State">BOOTING</b></div></div><div class="boot613-scan"><i></i></div></div></div></div></div>'''

js='''<script id="v613-loader-runtime">(()=>{const o=document.getElementById('bootOverlay');if(!o)return;const b=document.getElementById('boot613Bar'),p=document.getElementById('boot613Pct'),ph=document.getElementById('boot613Phase'),st=document.getElementById('boot613Status'),m=document.getElementById('boot613Meta'),state=document.getElementById('boot613State');const ps=[['Initializing Core Systems','Starting…','phase 1 / 4<br>Secure startup'],['Verifying Shift Matrix','Checking schedule…','phase 2 / 4<br>Data verify'],['Linking Command Grid','Connecting widgets…','phase 3 / 4<br>Nexus link'],['Rendering Interface','Ready to enter','phase 4 / 4<br>Final render']];const t0=performance.now(),MIN=760,HARD=1450;let done=false,raf=0;const paint=()=>{if(done)return;const e=performance.now()-t0,x=Math.min(96,8+e/HARD*100),i=x<28?0:x<56?1:x<82?2:3;b.style.width=x+'%';p.textContent=Math.round(x)+'%';ph.textContent=ps[i][0];st.textContent=ps[i][1];m.innerHTML=ps[i][2];raf=requestAnimationFrame(paint)};const exit=()=>{if(done)return;done=true;cancelAnimationFrame(raf);b.style.width='100%';p.textContent='100%';state.textContent='READY';setTimeout(()=>{o.classList.add('out');setTimeout(()=>o.remove(),190)},Math.max(0,MIN-(performance.now()-t0)))};requestAnimationFrame(paint);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',exit,{once:true});else setTimeout(exit,40);setTimeout(exit,HARD)})();</script>'''

s=replace_tag(s,'style','v612-loader-style',css)
s=replace_div(s,'bootOverlay',html)
s=replace_tag(s,'script','v612-loader-runtime',js)
p.write_text(s,encoding='utf-8')

# verification
s=p.read_text(encoding='utf-8')
checks={
 'unsafe observer removed': unsafe not in s,
 'safe observer present':'offObserver.disconnect();normalizeOff();offObserver.observe(document.body,{subtree:true,childList:true})' in s,
 'footer guarded':"f&&f.textContent.includes('O = OFF')" in s,
 'v6.1.3 loader':'data-loader-version="6.1.3"' in s,
 'hard exit':'HARD=1450' in s,
 'direct dashboard':'id="overviewView"' in s,
 'no document.write':'document.write(html)' not in s,
 'no runtime decompression':'DecompressionStream' not in s,
}
bad=[k for k,v in checks.items() if not v]
print(checks)
if bad: raise SystemExit('verification failed: '+', '.join(bad))
