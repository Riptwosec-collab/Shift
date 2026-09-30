from pathlib import Path
import re, base64, gzip

path = Path('index.html')
src = path.read_text(encoding='utf-8')

payload_m = re.search(r"const payloadB64 = '([^']+)';", src)
patch_m = re.search(r"const V61_PATCH_B64 = '([^']+)';", src)
if not payload_m or not patch_m:
    raise SystemExit('Expected v6.1 loader payload/patch was not found')
if 'document.write(html)' not in src:
    raise SystemExit('Expected fragile document.write loader was not found')

dashboard = gzip.decompress(base64.b64decode(payload_m.group(1))).decode('utf-8')
patch_html = base64.b64decode(patch_m.group(1)).decode('utf-8')

if 'id="v61-status-patch"' not in patch_html or 'id="v61-runtime-patch"' not in patch_html:
    raise SystemExit('v6.1 runtime patch markers missing')
if '</body>' not in dashboard or '</head>' not in dashboard:
    raise SystemExit('Dashboard HTML structure is invalid')

loader_css = r'''
<style id="v612-loader-style">
#bootOverlay{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:radial-gradient(circle at 38% 30%,rgba(56,232,255,.12),transparent 28%),radial-gradient(circle at 72% 62%,rgba(119,91,255,.13),transparent 32%),#020710;color:#eefbff;font-family:"Leelawadee UI","Segoe UI",Tahoma,system-ui,sans-serif;transition:opacity .22s ease,visibility .22s ease;overflow:hidden}
#bootOverlay::before{content:"";position:absolute;inset:0;opacity:.30;background-image:linear-gradient(30deg,rgba(56,232,255,.11) 1px,transparent 1px),linear-gradient(150deg,rgba(56,232,255,.11) 1px,transparent 1px);background-size:64px 112px;mask-image:radial-gradient(circle at center,#000,transparent 78%)}
#bootOverlay.out{opacity:0;visibility:hidden;pointer-events:none}
.boot-v612{position:relative;width:min(420px,78vw);display:grid;place-items:center;gap:20px;text-align:center}
.boot-v612-ring{width:164px;height:164px;border-radius:50%;position:relative;border:1px solid rgba(56,232,255,.18);box-shadow:0 0 70px rgba(56,232,255,.09),inset 0 0 40px rgba(39,139,255,.05)}
.boot-v612-ring::before,.boot-v612-ring::after{content:"";position:absolute;border-radius:50%;inset:16px;border:3px solid transparent;border-top-color:#38e8ff;border-right-color:#278bff;filter:drop-shadow(0 0 10px rgba(56,232,255,.42));animation:v612spin .72s linear infinite}
.boot-v612-ring::after{inset:34px;border-width:2px;border-top-color:#ffb43a;border-right-color:transparent;border-bottom-color:#775bff;animation-duration:1.05s;animation-direction:reverse}
.boot-v612-core{position:absolute;inset:58px;border-radius:50%;background:radial-gradient(circle,#dffcff 0 8%,#38e8ff 10%,rgba(56,232,255,.12) 42%,transparent 68%);box-shadow:0 0 30px rgba(56,232,255,.32);animation:v612pulse .9s ease-in-out infinite alternate}
.boot-v612 h2{margin:0;font-size:clamp(20px,3vw,30px);letter-spacing:-.03em}
.boot-v612 p{margin:0;color:#8eabc1;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.boot-v612-bar{width:min(310px,68vw);height:5px;border-radius:999px;background:rgba(255,255,255,.06);overflow:hidden;border:1px solid rgba(255,255,255,.05)}
.boot-v612-bar i{display:block;width:38%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#38e8ff,#278bff,#775bff);box-shadow:0 0 18px rgba(56,232,255,.36);animation:v612bar .72s ease-in-out infinite}
@keyframes v612spin{to{transform:rotate(360deg)}}
@keyframes v612pulse{to{transform:scale(1.12);opacity:.76}}
@keyframes v612bar{0%{transform:translateX(-110%)}100%{transform:translateX(290%)}}
@media (prefers-reduced-motion:reduce){.boot-v612-ring::before,.boot-v612-ring::after,.boot-v612-core,.boot-v612-bar i{animation-duration:.01ms!important;animation-iteration-count:1!important}}
</style>
'''

loader_html = r'''
<div id="bootOverlay" data-loader-version="6.1.2" aria-live="polite" aria-label="Loading Shift Command Center">
  <div class="boot-v612">
    <div class="boot-v612-ring"><div class="boot-v612-core"></div></div>
    <div><h2>Shift Command Center</h2><p>Syncing shift matrix</p></div>
    <div class="boot-v612-bar"><i></i></div>
  </div>
</div>
'''

loader_js = r'''
<script id="v612-loader-runtime">
(() => {
  const overlay = document.getElementById('bootOverlay');
  if (!overlay) return;
  const started = performance.now();
  const MIN_VISIBLE_MS = 620;
  const HARD_EXIT_MS = 1600;
  let exiting = false;
  const exit = () => {
    if (exiting) return;
    exiting = true;
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));
    setTimeout(() => {
      overlay.classList.add('out');
      setTimeout(() => overlay.remove(), 240);
    }, wait);
  };
  if (document.readyState === 'complete') exit();
  else window.addEventListener('load', exit, {once:true});
  setTimeout(exit, HARD_EXIT_MS);
})();
</script>
'''

dashboard = dashboard.replace('</head>', loader_css + '\n</head>', 1)
dashboard = re.sub(r'(<body[^>]*>)', r'\1\n' + loader_html, dashboard, count=1, flags=re.I)
dashboard = dashboard.replace('</body>', patch_html + '\n' + loader_js + '\n</body>', 1)

checks = {
    'direct dashboard': 'id="overviewView"' in dashboard,
    'v6.1 patch preserved': 'id="v61-runtime-patch"' in dashboard,
    'v6.1.2 overlay present': 'data-loader-version="6.1.2"' in dashboard,
    'hard exit present': 'HARD_EXIT_MS = 1600' in dashboard,
    'document.write removed': 'document.write(html)' not in dashboard,
    'runtime gzip removed': 'DecompressionStream' not in dashboard,
    'payload wrapper removed': 'const payloadB64' not in dashboard,
}
bad = [k for k,v in checks.items() if not v]
print(checks)
if bad:
    raise SystemExit('Verification failed: ' + ', '.join(bad))

path.write_text(dashboard, encoding='utf-8')
