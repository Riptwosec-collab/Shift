# Shift V6.6 to V7.1: Visual Experience implementation

## Design principle

This is an additive presentation layer over the Shift October and November 2026 duty data. It does **not** alter the source-of-truth position arrays, their read-only reference tables, or October's optional local duty overrides.

Source files: src/v700-experience.css and src/v700-experience.js. Build assembly: scripts/build.mjs embeds the CSS after the November sheet stylesheet and appends the JavaScript after the November sheet module. The checked-in index.html is generated and must match a fresh build.

| Version | Scope | Behavior |
| --- | --- | --- |
| V6.6 | Visual Foundation | Midnight Navy / cyan tokens, editorial spacing, typography, unified panel depth, navigation focus states |
| V6.7 | Cinematic Overview | Ambient aurora, horizon grid, subtle metric sheen; text and original artwork are preserved |
| V6.8 | Interactive Matrix | November D/N/H emphasis chips, keyboard/hover column and row highlighting, no dataset mutation |
| V6.9 | Motion System | Microinteraction, view fade/translate, focus-visible controls, hover affordances |
| V7.0 | Duty Orbit | CSS 3D depth ring, six explicit D1–D4/N1–N2 positions, selected-day details and actual-data seven-day trend |
| V7.1 | Mobile and Performance | Responsive cards/dial, Lite/Full quality toggle, reduced-motion support, offscreen pausing, no WebGL/dependency |

## Data contract and behavior

- October has 31 days, November 30. Orbit changes month/day independently of the legacy October Overview calendar; its header always states which historical month is being shown.
- On 2026 October/November Bangkok local dates, the Orbit defaults to that month/day. Outside this dataset, it opens November 1 with explicit 2026 labeling rather than presenting past data as live.
- Selecting a role shows all matching full names, including duplicates. The "view roster" button opens the original month screen and synchronizes November's day selection.
- **November 30 source discrepancy is preserved:** N1 appears twice and N2 is absent. The Orbit warns about both and does not fabricate the missing assignment.
- For October only, user-maintained validated slot overrides (where present) are read with the existing shiftRolesForDay resolver. The source arrays are never rewritten.
- Filter chips emphasize matching cells only; other cells remain in the DOM. The original November worksheet colors, totals, rows, and columns are retained.
- The seven-day trend uses source data and SVG paths rather than a network charting library.

## Motion/performance guardrails

- Animated CSS aurora and orbital ring, not heavy WebGL/Spline. No external API calls.
- User preference is persisted as shift-v7-motion-quality with values auto, lite, or full.
- Auto picks lite on narrow screens, reduced-motion OS preferences, data saver, or low-memory devices; explicit full never overrides OS reduced-motion.
- IntersectionObserver pauses decorative movement when hero/orbit is offscreen.
- Focus and touch interactions do not rely on hover. No sticky/floating overlays are added to the user's schedule sheet.

## Release review checklist

1. Run npm run build and npm test. Commit index.html if build changes it.
2. Desktop 1440/1280/1024: nav readable; Orbit fits; no background animation over text.
3. Mobile 390/375/320: no horizontal page overflow; Orbit rings, posts, month selector usable; spreadsheet scrolls in its own container.
4. Select Nov 11: verify four D, two N, four H; click D1/N1; open month and confirm same date/assignment.
5. Select Nov 30: confirm two N1 names, blank N2, visible warning; original worksheet unchanged.
6. Toggle D/N/H emphasis and hover/focus cells: labels readable and no duplicated staff.
7. Verify reduced-motion, Lite Mode, keyboard order, Safari PWA.
8. Confirm Cloudflare deployment and inspect production URL. GitHub commit/build alone is not proof of deployment.

## Rollback

Remove v700-experience.js and v700-experience.css from scripts/build.mjs, run build and deploy. No source roster data migration is required.

## CI wiring

The new .github/workflows/shift-main-ci.yml runs Node 24 build, artifact diff, and tests on main pushes. Cloudflare remains the sole automatic production deployer; the existing manual deploy fallback is not triggered by CI.
