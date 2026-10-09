import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');

test('reference neon dashboard uses real schedule, never mock HR values',()=>{
 const js=read('src/v6517-neon-dashboard.js');
 for(const k of ['crew(', 'staff.length', 'selectedDay','getOncallAssignmentsForDate','getNextOncallAssignments','overviewMonthMatrix','month-snapshot','v6517Dashboard','v6517Kpis','v6517Trend','v6517Donut','aria-label','requestAnimationFrame'])assert.ok(js.includes(k),k);
 assert.doesNotMatch(js,/fake|demo employees|Math\.random\(|128 employees|102 employees|simulated/);
});
test('new desktop glass grid aesthetic is shared across all five views and oncall',()=>{
 const css=read('src/v6517-neon-dashboard.css');
 for(const k of ['--shift-neon-green','--shift-neon-blue','--shift-neon-red','--shift-neon-cyan','.command-bar','.hud-panel','#overviewView','#dailyView','#personView','#monthView','#analyticsView','#oncallView','.v6511-duty-bar','.heatmap','.matrix-cell','.v6515-month-days','.v6517-dashboard','.v6517-matrix','.v6517-trend'])assert.ok(css.includes(k),k);
 assert.match(css,/repeating-linear-gradient/);
 assert.match(css,/radial-gradient/);
 assert.match(css,/box-shadow/);
 assert.match(css,/backdrop-filter/);
});
test('correct status meaning: day=green, night=blue, off=red',()=>{
 const css=read('src/v6517-neon-dashboard.css');
 for(const pair of ['.matrix-cell.D','.matrix-cell.N','.matrix-cell.O','.heatmap td.shift.D','.heatmap td.shift.N','.heatmap td.shift.O'])assert.ok(css.includes(pair),pair);
 assert.match(css,/\.matrix-cell\.D[\s\S]*?#(?:00|0[0-9a-f])(?:[0-9a-f]{4})/i);
});
test('mobile bottom nav is viewport-fixed with safe-area inset INSIDE and no tiny desktop matrix',()=>{
 const css=read('src/v6517-neon-dashboard.css');
 assert.match(css,/@media\s*\(max-width:\s*860px\)/);
 assert.match(css,/@media\s*\(max-width:\s*600px\)/);
 assert.match(css,/#mobileNav[\s\S]*?bottom:\s*0\s*!important/);
 assert.match(css,/#mobileNav[\s\S]*?padding-bottom:\s*calc\([^}]*safe-area-inset-bottom/);
 assert.match(css,/\.v6517-matrix[\s\S]*?display:\s*none\s*!important/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/prefers-reduced-transparency/);
});
test('animation is GPU-bounded and quality/respect reduced motion modes',()=>{
 const css=read('src/v6517-neon-dashboard.css');
 assert.match(css,/@keyframes v6517/);
 assert.match(css,/transform:\s*translateY/);
 assert.match(css,/data-v65-mode="ECO"/);
 assert.doesNotMatch(css,/animation:\s*[^;}\n]*(?:blur|filter)/);
});
test('build, offline cache and CI gate track v6.5.20',()=>{
 const build=read('scripts/build.mjs'),sw=read('sw.js'),html=read('index.html'),workflow=read('.github/workflows/v65-ci.yml');
 for(const k of ['v6517-neon-dashboard.css','v6517-neon-dashboard.js','v6517-neon-dashboard-style','built v6.5.20','data-app-version="6.5.20"','data-loader-version="6.5.20"'])assert.ok(build.includes(k),k);
 assert.match(html,/data-app-version="6\.5\.20"/);
 assert.match(html,/id="v6517-neon-dashboard-style"/);
 assert.match(sw,/shift-shell-v6\.5\.20/);
 assert.ok(workflow.includes('work/v6.5.17-reference-neon-dashboard'));
 assert.ok(workflow.includes('tests/v6517-*.test.mjs'));
});
