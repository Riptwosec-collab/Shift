# Shift V7.2 — Graphic November Duty Board

## Why the UI looked unchanged
Earlier v7 changes were additive and the November screen continued to render the pixel-matched spreadsheet from v6.5.36. This release deliberately changes the **default** November presentation to a graphic dashboard. The original sheet is retained behind a view toggle. The production URL also must actually receive a Cloudflare deployment; GitHub CI success does not prove that.

## Implementation

- \`src/v720-graphic-november.js\` — builds the Graphic Duty Board dynamically from \`NOVEMBER_2026_DUTY_POSITIONS\`.
- \`src/v720-graphic-november.css\` — dashboard graphics, SVG charts, animated cards, responsive matrix, and view switch.
- Default November view: **กราฟิกบอร์ด**.
- Alternate view: **ตารางต้นฉบับ**, which reuses the existing spreadsheet element without remapping or mutating it.
- Overview also gains a prominent November graphic-board entry so the visual upgrade can be found immediately.
- The October view and existing legacy cards are preserved. CSS applies a stronger glass/typography treatment to the global shell.

## Graphic features

1. Dark November 2026 masthead and date navigation.
2. Four derived KPI cards: D / N / H counts and exact single-occupancy positions.
3. Six position cards D1–D4 and N1–N2 with full staff names.
4. Actual per-person role matrix (10 × 30) with sticky names, weekend tint, position-specific badges and keyboard-accessible date and cell controls.
5. Seven-day mobile matrix (seven dates × ten people) with reversible week controls and optional full-month horizontal scrolling.
6. An inline 30-day SVG D/N crew density chart. No screenshot, stock image, static bitmap, canvas, WebGL or paid API.
7. A stacked workload chart per person showing working and off proportions.
8. November 30 source anomaly, two N1 and no N2, is shown without correction.
9. Explicit motion reduction, Lite mode integration, keyboard focus and horizontal-scroll containment.

## Verification

- \`npm run build && npm test\` should complete and \`git diff --exit-code -- index.html\` must be clean.
- Test November 11: 4 day / 2 night / 4 off.
- Test November 30: duplicate N1 and missing N2.
- Verify all 300 positions in full-month mode, and 70 in seven-day mode.
- Verify 320px, 375px, 390px, 768px, 1024px, and 1440px layouts in browser.
- Confirm Cloudflare actually serves a page containing \`shift72Graphic\` and the new styles. If absent, fix Cloudflare deployment/source-branch settings and invalidate old PWA cache only if needed.
