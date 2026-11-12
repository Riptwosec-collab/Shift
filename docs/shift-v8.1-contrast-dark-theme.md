# Shift V8.1 — Contrast QA, legible names and Dark Theme

## Repairs from source audit
- Prior V6.5.19 rendered \`#monthView .heatmap .v6519-full-name\` in
  pale white on a cream V8 table. Explicit per-theme foreground fixes it.
- Sticky staff columns in the October and November matrices retained
  dark strip shadows and old navy colors. Replaced with a soft border and
  theme-aware solid background; disabled overlapping decorative pseudo elements.
- Editorial em text previously had 1px black outlines; remove outlines,
  strokes and underlines instead of running a bar through Thai glyphs.
- Light-only controls (month tabs, search, overview metric cards) now share
  semantic colors, text contrast and active-state styling.

## Dark Mode
- Default light, dark opt-in; accessible header toggle and preserved
  preference in \`localStorage['shift.theme']\`.
- Minimal head preflight applies saved preference before the CSS paints.
- TH/EN label refresh and keyboard access, \`aria-pressed\`, mobile compact icon.
- Deep charcoal shell and slate surfaces, white text and readable labels,
  while keeping coral editorial headers and unchanged D/N/H/O assignments.
- All six views, both complete-month tables, search, modals, controls and
  sticky name cells are themed. No network calls, libraries or data mutation.

## QA
- \`npm run build\` produces a byte-identical tracked \`index.html\`.
- \`npm test\` checks current palette, persistence and original duty data.
- PWA cache bumped to r20 to discard stale shell.
- GitHub CI and Cloudflare Builds should be checked for exact SHA.
- Still requires browser screenshot and keyboard QA on desktop / mobile;
  source tests cannot certify rendered pixel contrast or name overlap.
