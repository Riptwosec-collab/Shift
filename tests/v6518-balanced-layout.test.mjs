import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(path,'utf8');
test('overview combines one dashboard header and timeline without a second oversized legacy hero',()=>{
 const css=read('src/v6518-balanced-layout.css'),js=read('src/v6518-balanced-layout.js');
 for(const name of ['v6517Dashboard','overviewView','overview-main','lower-grid','timeline-panel','hero-grid','v6517-bottom-grid'])assert.ok(js.includes(name),name);
 assert.match(js,/insertBefore\(timeline/);
 assert.match(js,/insertBefore\(rosters/);
 assert.match(js,/appendChild\(network/);
 assert.match(js,/dataset\.v6518Layout='ready'/);
 assert.match(css,/html\[data-v6518-layout="ready"\][^\{]*\.hero-grid\s*\{\s*display:none\s*!important/);
 assert.ok(js.includes('v6517MatrixTarget'));
});
test('responsive desktop layout avoids blank right area and fixed-height empty roster cards',()=>{
 const css=read('src/v6518-balanced-layout.css');
 for(const key of ['#overviewView .v6517-dashboard','#overviewView .v6517-banner','#overviewView .v6517-main-grid','#overviewView .v6517-kpis','#overviewView .overview-main','#overviewView .shift-columns','#overviewView .roster-card','#overviewView .insights-panel','#overviewView .lower-grid','#overviewView .network-host'])assert.ok(css.includes(key),key);
 assert.match(css,/#overviewView \.roster-card\s*\{[^}]*height:auto\s*!important/);
 assert.match(css,/#overviewView \.roster-card\s*\{[^}]*min-height:0\s*!important/);
 assert.match(css,/#overviewView \.shift-columns\s*\{[^}]*repeat\(3,minmax\(0,1fr\)\)/);
 assert.match(css,/#overviewView \.v6517-banner\s*\{[^}]*width:100%/);
});
test('all other views retain balanced widths, readable data, and tablet breakpoints',()=>{
 const css=read('src/v6518-balanced-layout.css');
 for(const k of ['#dailyView','#personView','#monthView','#analyticsView','#oncallView','.v652-view-tabs','.v6511-board-scroll','.heatmap','.table-wrap','.mobile-nav'])assert.ok(css.includes(k),k);
 for(const breakpoint of [1440,1100,860,600])assert.ok(css.includes('max-width:'+breakpoint+'px'),breakpoint);
 assert.ok(css.includes('minmax(0,1fr)'));
 assert.ok(css.includes('overflow-x:auto'));
});
test('PWA bottom bar reaches viewport bottom with Safe Area inside, reduced-motion support',()=>{
 const css=read('src/v6518-balanced-layout.css');
 assert.match(css,/#mobileNav\s*\{[^}]*position:fixed\s*!important/);
 assert.match(css,/#mobileNav\s*\{[^}]*bottom:0\s*!important/);
 assert.match(css,/#mobileNav\s*\{[^}]*padding-bottom:calc\([^}]*safe-area-inset-bottom/);
 assert.match(css,/display-mode:standalone/);
 assert.match(css,/prefers-reduced-motion/);
});
test('v6.5.20 has a single built output and CI regression checks',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html'),sw=read('sw.js'),workflow=read('.github/workflows/v65-ci.yml');
 for(const k of ['v6518-balanced-layout.css','v6518-balanced-layout.js','v6518-balanced-layout-style','data-app-version="6.5.20"','data-loader-version="6.5.20"','built v6.5.20'])assert.ok(build.includes(k),k);
 assert.match(html,/data-app-version="6\.5\.20"/);
 assert.match(html,/id="v6518-balanced-layout-style"/);
 assert.match(sw,/shift-shell-v6\.5\.20/);
 assert.ok(workflow.includes('work/v6.5.18-balanced-responsive-layout'));
 assert.ok(workflow.includes('tests/v6518-*.test.mjs'));
});
