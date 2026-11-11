# Shift V7.4 — Precision Operations / Full Month Overview

## Root cause

The old src/v6526-overview-eight.js explicitly replaced the Overview roster with an eight-day matrix, and v6517-neon-dashboard.js independently generated an eight-day mobile preview. October's legacy image-based UI made November's schedule difficult to discover. These remain in the codebase for regression/backward compatibility, but the Overview now leads with a new 30/31-day calendar and full source-based role matrix.

## New reference direction

- When I Work: whole-month calendar, daily staffing blocks and day drilldowns.
- Float: person by date schedule, compact scrollable row matrix, variable density.
- RotaCloud and Planday: month navigation, employee scheduling filters and mobile date selection.
- Attio: premium minimal dark workspace, strong readable typography, low-noise controls.
- GSAP Flip and ExodeUI: selected-state transitions and minimal interaction feedback — no continuous attention-grabbing animation over duty data.

This release changes the key data-display surface and its visual architecture immediately. A broader makeover of all other Shift pages remains a separate design release requiring visual QA.

## What changed

1. Full-month calendar is rendered at the top of the Overview: October 1–31 and November 1–30, seven day-of-week columns, color-coded headcount proportions.
2. Full team × calendar matrix includes actual D1–D4 / N1–N2 / H for every date. 310 October cells / 300 November cells. Sticky names + date headers and horizontal scroll contained within the table.
3. Clicking a calendar date updates a side panel with day/night/off staffing and six named positions. Matrix cell click opens the existing monthly detail for that person/date.
4. A month switch and Today button are provided. Dates outside the loaded months are never presented as live.
5. Desktop: two-column calendar plus role-detail, with full matrix below. Mobile: seven-column condensed **complete month** calendar plus horizontally scrollable full team matrix.
6. Previously dominant neon cards are quieted to Precision Slate. Legacy Duty Orbit stays accessible behind a native disclosure named Visual Lab instead of filling a major portion of the Overview.
7. Existing October and November source arrays, November source warning and original November worksheet are untouched.

## Validation

- npm run build and npm test must pass with no changes to index.html after build.
- 61 calendar days and 610 roster cell assignments must be available in Overview.
- Nov 11 has D4/N2/H4; November 30 retains two N1 and no N2.
- Test at 320, 375, 390, 768, 1024, 1440 screen widths to confirm no page overflow (horizontal scrolling only inside the matrix).
- Confirm Cloudflare Workers Build and then verify browser-served HTML includes data-shift-release="7.4".
- Visual QA should confirm tabbing/scrolling and returning to October works from Overview.

## Rollback

Remove v740-full-month-overview.js and .css imports from scripts/build.mjs and rebuild. No data migration or source content changes are required.
