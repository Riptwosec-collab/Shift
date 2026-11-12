# Shift V8.0 — Whole-site Theme Cohesion

## Scope
Direct audit/refinement of the established V7.9 visual language, without
changing the duty roster, date logic, locale logic, state/storage, or routes.

## Changes
- One warm editorial system: ink shell \`#171820\`, cream \`#F7F2E8\`,
  raised paper \`#FFFCF7\`, graphite text \`#1B1A20\`, and coral \`#FF6946\`.
- Day D1–D4 uses lime \`#D6F36A\` with dark text; Night N1–N2 uses
  cobalt \`#5264E8\` with white text; off H/O uses blush \`#FFC4D4\`
  with dark berry text. Warning and selected outlines stay visible.
- Match shared Overview, Daily, Person, Month, Analytics, Oncall, overlays,
  search fields, tabs, nav, cards and full-month/November worksheets.
- Native form controls receive explicit light color scheme on cream
  surfaces (rather than inheriting the old dark mode); the shell stays dark.
- Align visual frame and shadow, keyboard focus, 44px mobile navigation and
  internally-scrollable schedule grids; respect reduced-motion.
- Align browser PWA theme-color and document title with the new system.
- Keep the prior V7.9 art direction, no external imagery, and no
  perpetual animation; do not add a competing preset or theme toggle.

## Verification
Source/built index CSS identity and semantic-color contract have dedicated
tests. GitHub CI/build and Cloudflare production must be checked for this
exact commit. Browser visual QA on 320/375/768/1440px and actual dark-shell
rendering is still required; unit tests alone do not sign off screenshots.
