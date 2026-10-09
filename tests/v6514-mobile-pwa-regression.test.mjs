import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');

test('v6.5.14 mobile bottom bar touches viewport edge and consumes safe inset inside',()=>{
  const css=read('src/v6514-ui.css');
  assert.match(css,/\.mobile-nav\s*\{[^}]*position:\s*fixed\s*!important/);
  assert.match(css,/\.mobile-nav\s*\{[^}]*bottom:\s*0\s*!important/);
  assert.match(css,/\.mobile-nav\s*\{[^}]*left:\s*0\s*!important/);
  assert.match(css,/\.mobile-nav\s*\{[^}]*right:\s*0\s*!important/);
  assert.match(css,/\.mobile-nav\s*\{[^}]*padding-bottom:\s*calc\([^}]*safe-area-inset-bottom/);
  assert.match(css,/@media\s*\(display-mode:\s*standalone\)/);
  assert.match(css,/\.mobile-nav\s+button\s*\{[^}]*min-height:\s*44px/);
});

test('v6.5.14 mobile has native layouts and safe table overflow across every view',()=>{
  const css=read('src/v6514-ui.css');
  for(const name of ['#overviewView','#dailyView','#personView','#monthView','#analyticsView','#oncallView','.v652-view-tabs','.v6511-board-scroll','.v652-timeline','.month-panel','.analytics-main','.person-layout','.hero-grid','.command-bar','.mobile-nav'])
    assert.ok(css.includes(name),`missing ${name}`);
  assert.match(css,/@media\s*\(max-width:\s*860px\)/);
  assert.match(css,/@media\s*\(max-width:\s*600px\)/);
  assert.match(css,/overflow-x:\s*auto/);
  assert.match(css,/minmax\(0,\s*1fr\)/);
  assert.match(css,/prefers-reduced-motion/);
});

test('date helper follows local October 2026, never mislabels dates outside fixed source month',async()=>{
  const {v6514TodayForLegacy,v6514LocalDateKey}=await import('../src/v6514-mobile.js');
  assert.equal(v6514TodayForLegacy(new Date(2026,9,9,23,59)),9);
  assert.equal(v6514TodayForLegacy(new Date(2026,9,10,0,0)),10);
  assert.equal(v6514TodayForLegacy(new Date(2026,10,1)),null);
  assert.equal(v6514TodayForLegacy(new Date(2027,9,9)),null);
  assert.notEqual(v6514LocalDateKey(new Date(2026,9,9,23,59)),v6514LocalDateKey(new Date(2026,9,10,0,0)));
});

test('mobile nav paints selected view before expensive rendering and avoids repeated handlers',()=>{
  const js=read('src/v6514-mobile.js');
  for(const phrase of ['capture','requestAnimationFrame','window.showView','stopImmediatePropagation','dataset.view','window.scrollTo','aria-current'])assert.ok(js.includes(phrase),`missing ${phrase}`);
  assert.match(js,/document\.getElementById\('mobileNav'\)/);
  assert.match(js,/setTimeout\(/);
  assert.match(js,/matchMedia\(/);
  assert.match(js,/v6514NavBound/);
});

test('live day rolls at local midnight and resumes on focus/pageshow/visibilitychange',()=>{
  const js=read('src/v6514-mobile.js');
  for(const phrase of ['visibilitychange','pageshow','focus','setTimeout','clearTimeout','v6514LocalDateKey','setSelectedDay','renderV652Oncall','syncTodayTomorrowButtons'])assert.ok(js.includes(phrase),`missing ${phrase}`);
  assert.match(js,/\[10,11,12\]/);
  assert.match(js,/document\.hidden/);
  assert.doesNotMatch(js,/ONCALL_SCHEDULE\s*=/);
});

test('v6.5.14 build uses day-aware default and ships refreshed PWA cache version',()=>{
  const build=read('scripts/build.mjs'),html=read('index.html'),sw=read('sw.js');
  assert.ok(build.includes('v6514-ui.css'));
  assert.ok(build.includes('v6514-mobile.js'));
  assert.ok(build.includes('v6514-ui-style'));
  assert.ok(build.includes('built v6.5.16'));
  assert.ok(build.includes('data-app-version="6.5.16"'));
  assert.ok(build.includes('data-loader-version="6.5.16"'));
  assert.ok(build.includes('let selectedDay=1,selectedPerson=0'));
  assert.match(html,/data-app-version="6\.5\.16"/);
  assert.match(html,/id="v6514-ui-style"/);
  assert.ok(sw.includes('shift-shell-v6.5.16'));
});

test('v6.5.14 CI runs targeted mobile and date checks with read-only permissions',()=>{
  const workflow=read('.github/workflows/v65-ci.yml');
  assert.ok(workflow.includes('work/v6.5.14-mobile-pwa-daily-fast-nav'));
  assert.ok(workflow.includes('tests/v6514-*.test.mjs'));
  assert.doesNotMatch(workflow,/permissions:\s*contents:\s*write/);
});
