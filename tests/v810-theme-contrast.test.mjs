import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const css=read('src/v810-theme.css'),js=read('src/v810-theme.js'),html=read('index.html'),build=read('scripts/build.mjs');
const v780=read('src/v780-editorial-cohesion.css');
test('V8.1 both themes use one role palette across six views plus both full-month sheets',()=>{
 for(const token of ['--sh81-day:#D6F36A','--sh81-night:#5264E8','--sh81-off:#FFC4D4',
  'data-shift-theme="dark"','#overviewView','#dailyView','#personView','#monthView',
  '#analyticsView','#oncallView','#shift740FullMonth','#shiftNovemberView',
  '.shift72-graphic-footer','.s740-post.s740-post-alert',
  '.shift81-theme-toggle','prefers-reduced-motion:reduce'])assert.ok(css.includes(token),token);
 assert.ok(html.includes(css),'generated HTML must embed final theme stylesheet');
 assert.ok(html.includes(js),'generated HTML must embed theme JS');
 assert.ok(build.includes('v810-theme.css')&&build.includes('v810-theme.js'));
 assert.ok(html.includes('id="shift81-theme-preflight"'));
 assert.ok(html.includes("localStorage.getItem('shift.theme')"));
});
test('Staff name cells and outlined titles are repaired without hiding source assignments',()=>{
 for(const marker of ['.v6519-full-name','.s740-name','.shift72-person-copy',
  '-webkit-text-stroke:0 transparent!important','text-decoration:none!important',
  'border-right:2px solid var(--sh81-border)','color:var(--sh81-ink)!important'])assert.ok(css.includes(marker),marker);
 assert.ok(v780.includes('--shift80-day:#D6F36A'));
 assert.ok(read('src/october-2026-duty-roster.js').includes('OCTOBER_2026_DUTY_POSITIONS'));
 assert.ok(read('src/november-2026-duty-roster.js').includes('NOVEMBER_2026_DUTY_POSITIONS'));
 let depth=0;for(const c of css){if(c==='{')depth++;if(c==='}')depth--;assert.ok(depth>=0)}
 assert.equal(depth,0);
});
test('Theme control persists, restores, is accessible and respects locale',()=>{
 const attrs={};
 const root={dataset:{locale:'th',shiftTheme:'light'},lang:'th'};
 const button={dataset:{},setAttribute(k,v){attrs[k]=v},getAttribute:k=>attrs[k],querySelector(s){return s.includes('icon')?this.icon:this.label},icon:{textContent:''},label:{textContent:''}};
 const meta={setAttribute(k,v){this[k]=v}};
 const store={value:'dark',getItem(){return this.value},setItem(k,v){this.value=v}};
 const document={documentElement:root,readyState:'loading',addEventListener(){},querySelector(s){if(s.includes('meta'))return meta;if(s.includes('data-shift-theme-toggle'))return button;return null}};
 const api=new Function('document','localStorage',js+';return {set:shift81SetTheme,read:shift81StoredTheme,sync:shift81SyncThemeButton}')(document,store);
 assert.equal(api.read(),'dark');
 assert.equal(api.set('dark'), 'dark');assert.equal(root.dataset.shiftTheme,'dark');
 assert.equal(attrs['aria-pressed'],'true');assert.match(attrs['aria-label'],/ธีมมืด/);
 assert.equal(meta.content,'#11141B');assert.equal(store.value,'dark');
 root.dataset.locale='en';api.sync();assert.equal(button.label.textContent,'Dark');
 assert.equal(api.set('light'),'light');assert.equal(meta.content,'#171820');assert.equal(attrs['aria-pressed'],'false');
});
test('No remote assets, no perpetual animations in theme layer',()=>{
 assert.doesNotMatch(css,/@import|url\(\s*https?:/i);
 assert.doesNotMatch(js,/\b(?:fetch|setInterval|requestAnimationFrame)\s*\(/);
});
