import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(path,'utf8');

test('month heatmap full name preserves exact original roster but breaks before surname',()=>{
  const build=read('scripts/build.mjs'),html=read('index.html');
  assert.ok(build.includes('v6519-full-name'));
  assert.ok(html.includes('v6519-full-name'));
  assert.match(build,/html\.replace\([^\n]*<th class=/);
  assert.match(html,/String\(p\.name\)\.trim\(\)\.replace\(\/\\s\+\(\\S\+\)\$\//);
  assert.ok(html.includes('aria-label="${p.name}"'));
  assert.ok(read('src/legacy-baseline.html').includes('rows=staff.map((p,pi)'));
});
test('month sticky name column accommodates two clear lines on desktop',()=>{
  const css=read('src/v6519-readable-type.css');
  for(const k of ['#monthView .heatmap','.name-col','.v6519-full-name','white-space:normal','overflow-wrap','min-width:250px','line-height:1.45','position:sticky','scope']) assert.ok(css.includes(k),k);
  assert.match(css,/#monthView \.heatmap tbody th\.name-col/);
  assert.match(css,/#monthView \.heatmap thead th\.name-col/);
  assert.match(css,/#monthView \.heatmap tfoot td\.name-col/);
  assert.match(css,/#monthView \.table-wrap[^}]*overflow-x:auto/);
});
test('all data views have readable labels, names, counts and mobile typography',()=>{
  const css=read('src/v6519-readable-type.css');
  for(const k of ['#analyticsView','.analytics-card .label','.workload-row','.section-title','#personView','.people-list','.person-pick','#overviewView','.insight-item','.v6517-note','.v6517-kpi-label','.v6515-shift-group','.v6515-person']) assert.ok(css.includes(k),k);
  assert.match(css,/font-size:14px/);
  assert.match(css,/font-size:16px/);
  assert.match(css,/@media\s*\(max-width:860px\)/);
  assert.match(css,/@media\s*\(max-width:600px\)/);
  assert.match(css,/prefers-reduced-motion/);
});
test('original 31-day heatmap cells and D N O values are untouched',()=>{
  const original=read('src/legacy-baseline.html');
  const built=read('index.html');
  for(const snippet of ['dates.map((_,i)=>','statusAt(pi,i+1)','openCellModal(${pi},${i+1})']) assert.ok(original.includes(snippet)&&built.includes(snippet),snippet);
});
test('v6.5.20 build and PWA cache are aligned with read-only release CI',()=>{
  const build=read('scripts/build.mjs'),html=read('index.html'),sw=read('sw.js'),wf=read('.github/workflows/v65-ci.yml');
  for(const marker of ['v6519-readable-type.css','v6519-readable-type-style','built v6.5.20','data-app-version="6.5.20"','data-loader-version="6.5.20"']) assert.ok(build.includes(marker),marker);
  assert.match(html,/data-app-version="6\.5\.20"/);
  assert.ok(html.includes('v6519-readable-type-style'));
  assert.ok(sw.includes('shift-shell-v6.5.20'));
  assert.ok(wf.includes('work/v6.5.20-readable-data-month-names'));
  assert.ok(wf.includes('tests/v6519-*.test.mjs'));
  assert.doesNotMatch(wf,/permissions:\s*contents:\s*write/);
});
