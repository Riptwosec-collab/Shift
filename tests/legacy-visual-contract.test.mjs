import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const REQUIRED = [
  '.command-bar',
  '.hero-stage',
  '.cyber-scene',
  'roster-card day',
  'roster-card night',
  'roster-card off',
  '.insights-panel',
  'id="overviewNetwork"',
  'id="overviewMonthMatrix"',
  'id="timeline"',
  '.live-pill',
  'MONTH MATRIX'
];

test('v6.4 uses the approved legacy visual shell as its source of truth', () => {
  const html = fs.readFileSync('src/legacy-baseline.html', 'utf8');
  for (const marker of REQUIRED) {
    assert.ok(html.includes(marker), `legacy shell missing ${marker}`);
  }
  const order = [
    html.indexOf('class="command-bar"'),
    html.indexOf('class="hero-grid"'),
    html.indexOf('id="timeline"'),
    html.indexOf('class="roster-insights-grid"'),
    html.indexOf('class="lower-grid"')
  ];
  assert.ok(order.every(x => x >= 0), 'legacy overview hierarchy markers must exist');
  assert.deepEqual([...order].sort((a,b)=>a-b), order, 'legacy overview hierarchy must stay in approved order');
});

test('legacy shell keeps unique critical hosts', () => {
  const html = fs.readFileSync('src/legacy-baseline.html', 'utf8');
  for (const id of ['overviewView','dailyView','personView','monthView','analyticsView','overviewNetwork','overviewMonthMatrix']) {
    const matches = html.match(new RegExp(`id=["']${id}["']`, 'g')) || [];
    assert.equal(matches.length, 1, `${id} must appear exactly once`);
  }
});
