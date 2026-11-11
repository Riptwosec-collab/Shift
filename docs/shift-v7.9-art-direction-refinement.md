# Shift V7.9 — Full Site Art Direction Refinement

## Scope
Refine the existing V7.7–V7.8 design in V780 JS and CSS; do not
add a new theme or third-party assets.

## Visual system
- Ink #1B1A20 / Cream #F7F2E8 / Coral #FF6946 for editorial identity.
- Lime #D6F36A / Cobalt #5264E8 / Blush #FFC4D4 for role semantics.
- All secondary mastheads use the same cream canvas, typographic grid and
  restrained offset shadow, with a different accent disc and color rule.
- The Overview keeps the coral full-month hero as the brand centerpiece.
- Working titles use 14–19px and key supporting labels 11px except compact codes.
- Improved alignment of navigation, language buttons, employee rows,
  profiles, monthly calendar, analytics and oncall surface.
- Removed additional glow/blur from repeated UI elements.
- Mobile nav scrolls within its own area if more tabs than fit on 320px.

## Functionality
- TH/EN translations for page mastheads; update when language changes.
- Month page badge now reads 02 MONTHS, rather than 30 NOV DAYS on October.
- No source data or storage changes: 310 October and 300 November cells,
  with duplicate N1 / missing N2 on November 30 preserved.

## Validation limitations
- Run production build and complete regression tests, inspect checked-in
  standalone HTML, then verify Cloudflare Build for exact commit.
- Actual browser screenshots, mobile device testing and FPS are not
  proven by code/tests alone.
