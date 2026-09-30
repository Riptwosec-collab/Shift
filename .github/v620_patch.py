from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

old='W=host.clientWidth||420,H=host.clientHeight||270,cx=W/2,cy=H/2,r=Math.min(W,H)*.34;'
new='W=host.clientWidth||420,H=host.clientHeight||270,cx=W/2,cy=H*.46,r=Math.min(W*.31,H*.30);'
if old in s:
    s=s.replace(old,new,1)
elif new not in s:
    raise SystemExit('renderNetwork geometry source changed unexpectedly')

s=s.replace('data-loader-version="6.1.3"','data-loader-version="6.2.0"',1)

css=r'''<style id="v62-visual-patch">
body{background:radial-gradient(circle at 12% 8%,rgba(16,111,157,.22),transparent 26%),radial-gradient(circle at 86% 16%,rgba(83,58,181,.20),transparent 30%),radial-gradient(circle at 52% 82%,rgba(17,102,184,.14),transparent 34%),linear-gradient(180deg,#010711 0%,#04111f 46%,#061426 100%)!important;background-attachment:fixed}
body::before{opacity:.52!important;background-image:linear-gradient(30deg,rgba(56,232,255,.045) 1px,transparent 1px),linear-gradient(150deg,rgba(56,232,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(86,108,255,.025) 1px,transparent 1px)!important;background-size:72px 126px,72px 126px,48px 48px!important;mask-image:radial-gradient(ellipse at 50% 38%,#000 0 34%,rgba(0,0,0,.8) 58%,transparent 92%)!important}
body::after{content:""!important;position:fixed!important;inset:-22%!important;z-index:-4!important;pointer-events:none!important;opacity:.34!important;mix-blend-mode:screen!important;background:conic-gradient(from 180deg at 50% 50%,transparent 0 17%,rgba(56,232,255,.045) 21%,transparent 26% 52%,rgba(119,91,255,.04) 57%,transparent 63%),repeating-linear-gradient(0deg,transparent 0 4px,rgba(255,255,255,.008) 4px 5px)!important;animation:v62-space-drift 38s linear infinite!important}
@keyframes v62-space-drift{to{transform:rotate(360deg) scale(1.02)}}
.ambient{filter:blur(125px)!important;opacity:.17!important}.ambient.a{background:#0b79d0!important}.ambient.b{background:#6038d5!important}.ambient.c{background:#20d7ff!important;opacity:.10!important}
.hud-panel{background:linear-gradient(180deg,rgba(6,20,36,.88),rgba(3,12,24,.82))!important;border-color:rgba(68,211,255,.17)!important;box-shadow:0 22px 75px rgba(0,0,0,.48),inset 0 1px rgba(255,255,255,.035),0 0 34px rgba(34,127,255,.035)!important}
.lower-grid{align-items:start!important}.network-panel{height:auto!important;min-height:360px!important;overflow:hidden!important}
.network-panel .network-host{height:248px!important;margin-top:8px!important;overflow:hidden!important;contain:layout paint;background:radial-gradient(ellipse at 50% 78%,rgba(33,118,255,.28),transparent 27%),radial-gradient(circle at 50% 47%,rgba(56,232,255,.10),transparent 38%),linear-gradient(rgba(56,232,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(56,232,255,.035) 1px,transparent 1px),linear-gradient(180deg,rgba(4,18,32,.96),rgba(2,10,20,.98))!important;background-size:auto,auto,24px 24px,24px 24px,auto!important;border-color:rgba(56,232,255,.12)!important;box-shadow:inset 0 0 50px rgba(39,139,255,.05)}
#networkViz.network-host{height:300px!important;min-height:300px!important}.network-panel .network-host::before{inset:24% 29%!important;border-color:rgba(56,232,255,.16)!important;box-shadow:0 0 26px rgba(56,232,255,.05)}
.network-panel .network-host::after{left:25%!important;right:25%!important;bottom:9%!important;height:31%!important;border-color:rgba(56,232,255,.36)!important;box-shadow:0 0 30px rgba(39,139,255,.23),inset 0 0 30px rgba(56,232,255,.09)!important}
.network-core{width:140px!important}.network-node{width:112px!important}.network-core .core-shell{width:66px!important;height:66px!important}.network-node .core-shell{width:42px!important;height:42px!important}
.network-label{max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;margin-left:auto!important;margin-right:auto!important;line-height:1.25!important}.network-node:hover::after{white-space:normal!important;min-width:150px!important;max-width:220px!important;line-height:1.45!important}.network-summary{position:relative;z-index:3}
#bootOverlay{background:radial-gradient(circle at 18% 8%,rgba(56,232,255,.14),transparent 27%),radial-gradient(circle at 84% 15%,rgba(119,91,255,.14),transparent 31%),radial-gradient(circle at 50% 84%,rgba(39,139,255,.13),transparent 34%),linear-gradient(180deg,#010711 0%,#04111f 62%,#020914 100%)!important}
#bootOverlay::before{opacity:.34!important;background-image:linear-gradient(30deg,rgba(56,232,255,.12) 1px,transparent 1px),linear-gradient(150deg,rgba(56,232,255,.12) 1px,transparent 1px)!important;background-size:72px 126px!important;mask-image:radial-gradient(circle at center,#000 0 45%,transparent 88%)!important}
#bootOverlay::after{content:"";position:absolute;inset:-32%;pointer-events:none;background:conic-gradient(from 0deg,transparent 0 18%,rgba(56,232,255,.055) 23%,transparent 29% 55%,rgba(119,91,255,.045) 61%,transparent 67%);animation:v62-loader-space 22s linear infinite}@keyframes v62-loader-space{to{transform:rotate(360deg)}}
.boot613-shell{width:min(840px,94vw)!important;padding:26px!important;border-color:rgba(56,232,255,.24)!important;background:linear-gradient(180deg,rgba(8,24,42,.92),rgba(3,12,24,.91))!important;box-shadow:0 32px 110px rgba(0,0,0,.62),inset 0 1px rgba(255,255,255,.06),0 0 54px rgba(39,139,255,.07)!important}
.boot613-radar{height:286px!important;background:radial-gradient(circle at center,rgba(56,232,255,.11),transparent 22%),radial-gradient(circle at center,transparent 0 28%,rgba(56,232,255,.055) 29%,transparent 30% 42%,rgba(119,91,255,.05) 43%,transparent 44%),linear-gradient(180deg,rgba(5,19,34,.94),rgba(2,10,20,.9))!important;border-color:rgba(56,232,255,.17)!important;box-shadow:inset 0 0 68px rgba(39,139,255,.07),0 0 32px rgba(56,232,255,.045)!important}
.boot613-radar::before{content:"";position:absolute;width:222px;height:222px;border-radius:50%;border:1px dashed rgba(56,232,255,.13);box-shadow:0 0 46px rgba(56,232,255,.07);animation:b613spin 13s linear infinite reverse}.boot613-radar::after{content:"";position:absolute;width:1px;height:78%;left:50%;top:11%;background:linear-gradient(transparent,rgba(56,232,255,.68),transparent);box-shadow:0 0 18px rgba(56,232,255,.35);transform-origin:50% 50%;animation:v62-radar-sweep 2.7s linear infinite;opacity:.46}@keyframes v62-radar-sweep{to{transform:rotate(360deg)}}
.boot613-orbit{width:192px!important;height:192px!important;border-color:rgba(56,232,255,.22)!important;box-shadow:0 0 70px rgba(56,232,255,.11),inset 0 0 44px rgba(39,139,255,.05)!important;z-index:2}.boot613-arc.a{border-top-color:#38e8ff!important;border-right-color:#278bff!important;filter:drop-shadow(0 0 10px rgba(56,232,255,.45))}.boot613-arc.b{border-top-color:#775bff!important;border-left-color:#775bff!important;filter:drop-shadow(0 0 9px rgba(119,91,255,.42))}.boot613-arc.c{border-bottom-color:#ffb43a!important;border-right-color:#ffb43a!important;filter:drop-shadow(0 0 9px rgba(255,180,58,.38))}
.boot613-core{inset:73px!important;background:radial-gradient(circle,#f1fdff 0 8%,#38e8ff 11%,rgba(56,232,255,.17) 41%,rgba(39,139,255,.06) 60%,transparent 72%)!important;box-shadow:0 0 38px rgba(56,232,255,.42)!important}.boot613-card{border-color:rgba(56,232,255,.18)!important;background:linear-gradient(180deg,rgba(9,25,43,.82),rgba(5,16,29,.76))!important}.boot613-progress{height:14px!important;background:rgba(255,255,255,.04)!important}.boot613-progress i{background:linear-gradient(90deg,#38e8ff 0%,#278bff 42%,#775bff 72%,#ffb43a 100%)!important;box-shadow:0 0 22px rgba(56,232,255,.38)!important}
@media(max-width:1280px){.network-panel{min-height:350px!important}.network-panel .network-host{height:240px!important}}@media(max-width:780px){.network-panel{min-height:330px!important}.network-panel .network-host{height:220px!important}.network-core{width:126px!important}.network-node{width:96px!important}.boot613-shell{padding:18px!important}.boot613-radar{height:220px!important}.boot613-orbit{width:158px!important;height:158px!important}.boot613-radar::before{width:185px;height:185px}.boot613-core{inset:59px!important}}
@media(prefers-reduced-motion:reduce){body::after,#bootOverlay::after,.boot613-radar::before,.boot613-radar::after{animation-duration:.01ms!important;animation-iteration-count:1!important}}
</style>'''

if 'id="v62-visual-patch"' not in s:
    if '</head>' not in s:
        raise SystemExit('missing </head>')
    s=s.replace('</head>',css+'\n</head>',1)

p.write_text(s,encoding='utf-8')
