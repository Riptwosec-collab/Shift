# Shift V7.5 — Vivid Depth and Performance Rebuild

## User feedback and design correction
The previous Precision Slate theme was too desaturated and layered the original neon UI underneath a quiet gray dashboard. Some transitions updated hundreds of cells unnecessarily, the November graphic rebuilt the entire matrix after every selected-day change, and older CSS layers kept applying blur and continuous effects.

V7.5 emphasizes meaningful content, **not an additional decorative image or 3D effect**.

## Color and hierarchy
- Page: deep blue-black #06111F; panels: rich navy #0C2339; active/navigation accents: cyan #4FDBFF.
- D roles: vivid mint #3CE9AE. N roles: periwinkle #899EFF. Off: amber #FFC17D.
- Main text #F3FBFF. Secondary text is lighter than the former muted gray.
- Consistent contrast, borders, active indicators, card surfaces and interaction semantics across Overview, Daily, Person, Analytics, November graphic sheet and the main nav.
- Original October and November source rosters and original November sheet are untouched.

## Performance remediation
- Overview uses a single Bangkok date calculation for each calendar/matrix render, rather than 60+ repeated Intl formatters.
- Day selection touches **only the previous and current roster columns**, not all 300/310 cells.
- The selected-day detail changes with a short 170 ms transform/opacity animation only; it respects reduced-motion.
- November's graphic board leaves its 300-cell matrix mounted on date changes. Only the four metric values, six crew cards, selected-date styles and SVG trend marker are updated. Full render still occurs when switching full-month/7-day mode or crossing a mobile week boundary.
- Full-page entrance animation is disabled. Background/ambient continuous animation and blur filters are disabled in normal operation. CSS transitions cover color, border and small selected UI only.
- No new runtime dependency, network request or WebGL scene.

## Release QA
1. npm run build + npm test, and ensure the tracked HTML exactly matches the generated artifact.
2. Desktop Chrome/Edge and Mobile Chrome/Safari: select dates quickly in both Overview and November graphic page. The scroll state and matrix must persist.
3. Open October (31 days) and November (30 days); verify 610 source codes in total. November 30 remains two N1 and no N2.
4. Test 320/375/390/768/1024/1440 widths; horizontal scrolling must be contained within schedule matrices.
5. Test reduced motion and Lite Mode; focus visible remains.
6. Confirm Cloudflare Workers Builds for the exact last commit and inspect live browser screenshots. CI alone does not prove the visual quality or frame pacing.
