import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/shift-v88-theme.css', import.meta.url), 'utf8');
const build = readFileSync(new URL('../scripts/build.mjs', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const palette = (theme) => {
  const declaration = new RegExp(
    'html\\[data-shift780="ready"\\]\\[data-shift-theme="' + theme + '"\\]\\{([^}]+)\\}'
  ).exec(css)?.[1];
  assert.ok(declaration, 'Missing scoped ' + theme + ' palette');
  const tokens = {};
  for (const [, name, value] of declaration.matchAll(/(--[a-z0-9-]+):\s*(#[a-fA-F0-9]{6})\s*;/g)) tokens[name] = value;
  return tokens;
};

const brightness = (hex) => {
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = rgb.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
};
const contrast = (a, b) => {
  const x = brightness(a), y = brightness(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

test('primary/secondary and interactive text meets WCAG AA contrast in both themes', () => {
  for (const theme of ['light', 'dark']) {
    const t = palette(theme);
    const pairs = [
      ['--sh87-fg', '--sh87-panel'],
      ['--sh87-fg', '--sh87-card'],
      ['--sh87-muted', '--sh87-panel'],
      ['--sh87-muted', '--sh87-card'],
      ['--sh87-accent-fg', '--sh87-accent'],
    ];
    for (const [fg, bg] of pairs) {
      assert.ok(t[fg] && t[bg], `Missing ${theme} tokens ${fg}, ${bg}`);
      const ratio = contrast(t[fg], t[bg]);
      assert.ok(ratio >= 4.5, `${theme} ${fg}/${bg}: ${ratio.toFixed(2)} < 4.5`);
    }
  }
});

test('Network 2.0 overrides tiny illegible legacy text and allows responsive wrapping', () => {
  for (const selector of [
    '#v64NetworkDetails .v64-network-summary b',
    '#v64NetworkDetails .v64-network-summary small',
    '#v64NetworkDetails .v64-relation-strip b',
    '#v64NetworkDetails .v64-relation-strip span',
    '#v64NetworkDetails .v64-relation-strip strong',
  ]) assert.ok(css.includes(selector), 'Missing contrast repair for ' + selector);
  assert.match(css, /grid-template-columns:repeat\(auto-fit/);
  assert.match(css, /overflow-wrap:anywhere!important/);
});

test('contrast repair is present now and persisted through subsequent builds', () => {
  assert.match(build, /const shiftV88Css=fs\.readFileSync/);
  assert.match(build, /shift-v88-contrast-style/);
  assert.match(html, /<style id="shift-v88-contrast-style">/);
  assert.match(html, /Specific screenshot regression: Network 2\.0/);
});

const themeRuntime = readFileSync(new URL('../src/v810-theme.js', import.meta.url), 'utf8');

test('deep midnight navy is the default while explicit light mode remains available', () => {
  const dark = palette('dark');
  assert.equal(dark['--sh87-shell'], '#080F1D');
  assert.equal(dark['--sh87-panel'], '#0D192B');
  assert.equal(dark['--sh87-card'], '#142238');
  assert.match(themeRuntime, /catch\{return 'dark'\}/);
  assert.ok(themeRuntime.includes("getItem(SHIFT81_THEME_KEY)==='light'"));
  assert.ok(build.includes("let t='dark'"));
  assert.ok(html.includes("let t='dark'"));
});

test('muted day/night/off cells and selected dates stay readable after old CSS cascade', () => {
  assert.match(css, /SHIFT V9\.1 — restrained duty palette/);
  for (const status of ['--shift9-duty-day', '--shift9-duty-night', '--shift9-duty-off']) {
    assert.ok(css.includes(status), 'Missing '+status);
  }
  for (const selector of [
    '#shift740FullMonth .s740-calendar-day.is-selected',
    '#shift740FullMonth .s740-duty.s740-D',
    '#shiftNovemberView .shift72-duty-pill.tone-N',
    '#monthView .heatmap td.shift.O',
  ]) assert.ok(css.includes(selector), 'Missing status surface '+selector);
});

test('responsive layouts keep long labels and matrices from overlapping', () => {
  assert.match(css, /\.shift78-section-grid/);
  assert.match(css, /overflow-wrap:anywhere!important/);
  assert.match(css, /\.s740-matrix-viewport/);
  assert.match(css, /\.v64-workload-balance/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.ok(css.includes('.end770-hero-mark'));
});
