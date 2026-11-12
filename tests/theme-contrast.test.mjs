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
  for (const [, name, value] of declaration.matchAll(/(--[a-z0-9-]+):\\s*(#[a-fA-F0-9]{6})\\s*;/g)) tokens[name] = value;
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
  assert.match(css, /grid-template-columns:repeat\\(auto-fit/);
  assert.match(css, /overflow-wrap:anywhere!important/);
});

test('contrast repair is present now and persisted through subsequent builds', () => {
  assert.match(build, /const shiftV88Css=fs\\.readFileSync/);
  assert.match(build, /shift-v88-contrast-style/);
  assert.match(html, /<style id="shift-v88-contrast-style">/);
  assert.match(html, /Specific screenshot regression: Network 2\\.0/);
});
