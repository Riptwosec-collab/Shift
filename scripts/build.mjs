import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const strip=s=>s.replace(/^import .*?;\s*$/gm,'').replace(/\bexport\s+(?=(const|let|var|function|class)\b)/g,'').replace(/^export\s*\{[^}]*\};?\s*$/gm,'');
const addCss=fs.readFileSync(path.join(root,'src','legacy-ui.css'),'utf8');
const modules=['data.js','cache.js','state.js','view-registry.js','performance.js','daily-model.js','risk.js','network-model.js','analytics-model.js','command-palette.js','mobile.js','legacy-overview.js','v64-engine.js'];
const addJs=modules.map(f=>`// ${f}\n${strip(fs.readFileSync(path.join(root,'src',f),'utf8'))}`).join('\n');
let html=fs.readFileSync(path.join(root,'src','legacy-baseline.html'),'utf8');
html=html.replace('<html lang="th">','<html lang="th" data-app-version="6.4" data-v64-mode="BALANCED">');
html=html.replace(/<style id="v621-performance-patch">[\s\S]*?<\/style>/i,'');
html=html.replace(/let offTimer=0;const offObserver=new MutationObserver\([\s\S]*?offObserver\.observe\(document\.body,\{subtree:true,childList:true\}\);/,'');
html=html.replace('data-loader-version="6.2.1"','data-loader-version="6.4"');
html=html.replace('MIN=1150,HARD=1850','MIN=3000,HARD=3600');
html=html.replace('</head>',`<style id="v64-additive-style">\n${addCss}\n</style>\n</head>`);
html=html.replace('</body>',`<script id="v64-engine-base">(()=>{\n${addJs}\n})();</script>\n</body>`);
fs.writeFileSync('index.html',html);
const dist=path.join(root,'dist');fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});fs.writeFileSync(path.join(dist,'index.html'),html);
console.log(`built v6.4 legacy index.html ${Buffer.byteLength(html)} bytes`);
