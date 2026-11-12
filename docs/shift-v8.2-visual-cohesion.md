# Shift V8.2 — Full Site Visual QA Source Pass

## Source audit
- Multiple legacy styles use different body/cell semantics and contradictory widths (1%, 198px, 250px and 272px) for staff names. Unified in the last loaded theme stylesheet.
- Previous V7.9 CSS rendered the bottom mobile navigation on desktop, and some micro labels fell to 5.5–8px.
- Legacy week/preview matrix used D red and O green despite new D lime, N cobalt, O blush semantics. Unified.
- Separate page labels, workload rows, October/November matrices, oncall names, card headings and search typography carried outdated dark/neon assumptions.
- Fixes are scoped to the loaded V8.1 sheet. No new JS or CSS import, no new visual preset. The user-selected light/dark theme remains functional.

## Layout and typography contract
- Desktop bottom mobile navigation hidden above 860px; visible and horizontal-scrollable at 860px and below.
- Header at 861–1250px uses two rows to avoid squeezing five navigation tabs and right-side actions into one row.
- Fluid page gutters, predictable card radius, readable 11px minimum secondary labels, and balanced title line heights, including Thai font metrics.
- Explicit sticky name column widths for standard month, October full-month and November worksheet; names wrap rather than truncate or overlap.
- Mobile at 320/375/520/860px: no document-level table overflow; table scroll remains internal. KPI and Oncall cards stack proportionally.
- Reuse D lime, N cobalt, H/O pink and coral interactive states consistently in preview, week and all month sheets.

## Verification limitations
- Verify `npm run build`, `npm test`, GitHub CI and Cloudflare Workers builds on final SHA. Existing tests continue validating 610 total duty entries and known Nov30 irregularity.
- CSS and unit tests cannot guarantee rendered screenshots, text wrapping or device-specific viewport behavior. Real browser QA at 320, 375, 768, 1024 and 1440px remains necessary before final signoff.
