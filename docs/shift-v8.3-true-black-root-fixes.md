# Shift V8.3 — Screenshot-driven true-black and contrast repair

## Confirmed root causes from user screenshots
1. A legacy inline CSS rule in `src/legacy-baseline.html` set `.row-name` and `.row-meta` backgrounds to `#071525` on cream roster cards and drew a pseudo-element stripe across every `.person-row`.
2. `src/v6516-liquid-glass.css` and `src/v6517-neon-dashboard.css` both included `.insight-item` in forced dark-blue background groups. V8.2 rendered dark text over those blue insight rows.
3. Dark mode `#11141B` charcoal/navy shell did not meet the requested true black.

## Implemented
- Remove the original navy text backgrounds and row stripe from legacy source, not only the final override.
- Remove `.insight-item` from two legacy dark-background group selectors so old components no longer force it navy.
- Apply explicit matched background and foreground to roster rows, names, subtitles, D/N/O status chips, insights panels/rows/icons/counts, person pickers.
- Maintain responsive minmax grid, wrapping Thai names and smaller status badge so names cannot be hidden at mobile widths.
- Dark mode page background is **#000000**, panels **#090909**, raised cards **#141414**, secondary **#1F1F1F**, main text **#F7F7F7**, supporting text **#C5C5C5**; no dark navy card fills.
- Keep coral editorial highlights, lime day, cobalt night, blush off as carefully controlled semantic colors.
- Update initial theme-color in both preflight and runtime toggle to pure black. This persists through localStorage without modifying roster data.

## Required signoff
- CI: build comparison + complete regression suite.
- Verify Cloudflare Workers Builds check on latest main SHA.
- Actual rendered browser visuals on mobile and desktop are not yet certified; maintain accurate status.
