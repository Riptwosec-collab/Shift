import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../src/shift-v10-design-system.css',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../src/v810-theme.js',import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');

function palette(theme){
  const header='html[data-shift780="ready"][data-shift-theme="'+theme+'"]';
  const start=css.indexOf(header+' {');
  assert.notEqual(start,-1,'Missing '+theme+' palette');
  const body=css.slice(start,css.indexOf('}',start));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*(#[0-9A-Fa-f]{6})\s*;/g)].map(m=>[m[1],m[2]]));
}
function luminance(hex){
  const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  const [r,g,b]=channels.map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);
  return 0.2126*r+0.7152*g+0.0722*b;
}
function contrast(foreground,background){
  const a=luminance(foreground),b=luminance(background);
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}
test('accessible foreground/background color pairs in both modes',()=>{
  for(const mode of ['dark','light']){
    const p=palette(mode);
    for(const [foreground,background] of [
      ['--sh87-fg','--sh87-panel'],['--sh87-fg','--sh87-card'],
      ['--sh87-muted','--sh87-panel'],['--sh87-muted','--sh87-card'],
      ['--sh87-accent-fg','--sh87-accent'],
      ['--shift10-day-text','--shift10-day-bg'],
      ['--shift10-night-text','--shift10-night-bg'],
      ['--shift10-off-text','--shift10-off-bg']
    ]){
      assert.ok(p[foreground]&&p[background],mode+' '+foreground+'/'+background+' missing');
      const actual=contrast(p[foreground],p[background]);
      assert.ok(actual>=4.5,mode+' '+foreground+'/'+background+' = '+actual.toFixed(2));
    }
  }
});
test('black-lime is the default and explicit light theme survives reload',()=>{
  const dark=palette('dark');
  assert.equal(dark['--sh87-shell'],'#050508');
  assert.equal(dark['--sh87-panel'],'#0E1219');
  assert.equal(dark['--sh87-card'],'#111820');
  assert.match(runtime,/catch\{return 'dark'\}/);
  assert.ok(runtime.includes("getItem(SHIFT81_THEME_KEY)==='light'"));
  assert.ok(build.includes("let t='dark'"));
  assert.ok(index.includes("let t='dark'"));
});
test('single final canonical CSS is wired to build and current HTML',()=>{
  assert.match(build,/src','shift-v10-design-system\.css/);
  assert.match(build,/shift-v10-professional-style/);
  assert.match(index,/<style id="shift-v10-professional-style">/);
  assert.ok(!build.includes('shift-v88-theme.css'));
  assert.ok(!index.includes('shift-v88-contrast-style'));
});
test('legacy 6px text and crowded cards are replaced with readable responsive layouts',()=>{
  for(const selector of [
    '#v64NetworkDetails .v64-network-summary b',
    '#v64NetworkDetails .v64-network-summary small',
    '#v64NetworkDetails .v64-relation-strip b',
    '#v64NetworkDetails .v64-relation-strip span',
    '#v64NetworkDetails .v64-relation-strip strong',
    '.shift78-section-copy h2','.s740-matrix-viewport'
  ])assert.ok(css.includes(selector),'Missing '+selector);
  assert.match(css,/grid-template-columns:repeat\(auto-fit/);
  assert.match(css,/overflow-wrap:anywhere!important/);
  assert.match(css,/@media\(max-width:680px\)/);
  assert.match(css,/prefers-reduced-motion/);
});
test('theme explicitly covers all 8 operational view families',()=>{
  for(const id of [
    'overviewView','dailyView','personView','monthView','analyticsView',
    'oncallView','shiftNovemberView','shift740FullMonth'
  ])assert.ok(css.includes('#'+id),'Missing '+id);
});

test('MEK CONTROL black-lime palette uses reference accent and high contrast',()=>{
 const dark=palette('dark');
 assert.equal(dark['--sh87-accent'],'#C8FF47');
 assert.equal(dark['--sh87-fg'],'#F2F5F8');
 assert.equal(dark['--sh87-shell'],'#050508');
 const light=palette('light');
 assert.equal(light['--sh87-accent'],'#C8FF47');
 assert.ok(contrast(dark['--sh87-accent-fg'],dark['--sh87-accent'])>=4.5);
});
test('desktop rail and mobile nav preserve existing view handlers',()=>{
 assert.match(css,/@media\(min-width:1181px\)/);
 assert.match(css,/\.command-bar \.nav-tabs \.nav-btn/);
 assert.match(css,/--shift11-sidebar-width:208px/);
 assert.match(css,/@media\(max-width:860px\)/);
 assert.match(css,/#mobileNav button\.active/);
 assert.ok(!build.includes('MEK-CONTRO-10'));
});
test('reference lime is restricted to active controls; roster codes retain distinct shades',()=>{
 const dark=palette('dark');
 assert.notEqual(dark['--shift10-day-bg'],dark['--shift10-night-bg']);
 assert.notEqual(dark['--shift10-night-bg'],dark['--shift10-off-bg']);
 assert.notEqual(dark['--shift10-day-bg'],dark['--sh87-accent']);
 assert.ok(css.includes('.shift72-duty-pill.tone-D'));
 assert.ok(css.includes('.s740-duty.s740-N'));
 assert.ok(css.includes('.s740-duty.s740-H'));
});
