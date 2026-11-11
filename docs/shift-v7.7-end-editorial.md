# Shift V7.7 — Expressive Editorial Rebuild
## Reference and what was verifiable
Official source: https://madebyend.com/ (Thailand, Phuket, creative studio).
Publicly accessible indexed page copy emphasizes oversized scalable typography,
shapes that communicate rather than decorate, strong hero composition, purposeful
motion and mobile friendliness.

**Limits**: no website screenshot, CSS extraction, video, timing capture or exact
reference palette was available. The palette below is original **art direction
informed by those principles**, NOT a pixel match or claim about Made by END's
exact colors. Do not copy their brand assets, name treatment, text, artwork or code.

## Original Shift palette (not sampled from the reference)
- Ink #1B1A20, Cream #F7F2E8, Paper White #FFFEFA
- Coral Orange #FF6946 — primary action, editorial hero and selected date
- Lime #D6F36A — D1/D2/D3/D4 daytime work
- Cobalt #5264E8 — N1/N2 nighttime work
- Blush #FFC4D4 — H/off
- Yellow #FFE17C — source warnings where appropriate

## Structural changes
- Delete V7.6 Spectrum palette and V7.5 cold high-saturation color contract
  from their shared final stylesheet, rather than appending yet another global theme.
- Preserve dark app shell for readability, use bright cream header and colored
  Editorial Overview module.
- Overview top: oversized Thai typographic composition, original round 30/31-day
  marker, coral background, structural month controls; still full-month 30/31.
- Calendar: warm paper canvas, dark text and highlighted day; week separation
  remains accessible.
- Team matrix: D lime/N cobalt/H blush, sticky names, all 610 cells preserved.
- November board: warm command header, paper cards, six positions, chart recolored
  to lime/cobalt and light-background scrollable source matrix.
- All other views retain core existing layouts, data and navigation but inherit a
  warmer dark-shell / coral-accent control system.
- Hover transitions must settle on pointer exit; no indefinite animation, no
  external fonts/images or added runtime dependencies.

## Performance and accessibility
- Preserve optimized in-place day selection for Overview and November.
- Do not change source rosters or local saved changes. Nov30 N1×2 and missing N2
  remains a visible source warning.
- CSS reduced-motion mode disables transitions and animation.
- Keyboard focus on light/dark surfaces is visible. UI remains operable at
  320, 375, 390, 768, 1024 and 1440px (browser verification is still required).

## Verification
1. npm run build; generated index must match tracked index.
2. npm test: functionality, source correctness, regressions.
3. Verify live browser HTML is V7.7 and screenshot manually before visual signoff.
4. Cloudflare Workers Builds must succeed on exact release commit.
