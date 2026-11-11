# Shift V7.8 — Editorial Cohesion (Full Site)

## Goal
Make the visual experience genuinely consistent across **Overview, Daily,
Person, Monthly, Analytics and Engineer Oncall**, not just the November schedule.
Inspired by the Made by END public creative direction, NOT their unverified
exact palette, code, typefaces, logo, image assets or animations.

## Audit
- Previous V7.7 shipped expressive Overview and November surfaces, while other
  screens still used very dark neon cards, spinning polygon logos, 8px labels,
  cold cyan/blue glows, heavy glass and miscellaneous corner radii.
- Oncall rerenders its view with innerHTML when the selected day/month/person
  changes; any added heading needs to survive these native rerenders.
- Source-data integrity is critical: 10 staff × October 31, November 30, exact
  D1–D4/N1–N2 source codes and Nov30 N1 duplication/N2 absence must persist.

## Visual system
- Paper Cream #F7F2E8, Graphite Ink #1B1A20.
- Coral #FF6946 for selected action and editorial emphasis.
- Lime #D6F36A for Day, Cobalt #5264E8 for Night, Blush #FFC4D4 for Off.
- One shared 13px radius family, uniform line weights and subdued offset
  shadows, accent top rules on distinct role panels.
- Distinct headers with native HTML: Daily (blush), Person (lime),
  Monthly (cream), Analytics (cobalt), Oncall (butter).
- The 30/31-day Overview and the full November graphic remain exactly as
  implemented in V7.7; this release closes the visual gap in other screens.

## Page-by-page changes
1. Daily: paper date controls, shift cards, lime/cobalt/blush accents, soft hover.
2. Person: accessible picker, active coral row, pink user ID, readable profile
   cards, no endlessly spinning cyber rings.
3. Monthly: same paper panel, filter pills, October heatmap and D/N/O colors;
   original November worksheet remains available, unmodified.
4. Analytics: editorial KPI cards, readable workload bars, coral/cobalt SVG lines.
5. Oncall: editorial controls, panels, sticky matrix with per-person/selected
   roles preserved; header restored after native Oncall rerenders.
6. Navigation: simplified original app logo glyph, consistent action hierarchy,
   readable footer and mobile controls.
7. Dialogs/drawers: paper surfaces, high-contrast close and focus controls.

## Motion / accessibility / performance
- Header arrives with a single 220 ms transform/opacity transition on entering
  a page; hover shape rotates only on hover and reverses on mouse leave.
- No perpetual CSS animation or expensive blur added; reduced-motion disables.
- Font size and color contrast are improved; focus-visible keyboard states.
- On mobile, content stacks. Full roster uses an internally scrollable table,
  preserving full 30/31-day overview and source assignments.

## PWA freshness
- Bump network-first Service Worker shell cache from r18 to r19. Old caches are
  discarded by the existing activate hook; offline fallback behavior remains
  unchanged. Version name is not an external deploy assertion.

## Release validation
- Generated index.html must match scripts/build.mjs output in CI.
- All existing test suites and V7.8 tests must pass.
- Cloudflare Workers Build success required for the exact commit.
- Real-browser screenshot, desktop/mobile overflow checks, reduced-motion
  interaction testing and frame pacing **are not proven by source tests**;
  visually inspect the live production domain before declaring UI signoff.
