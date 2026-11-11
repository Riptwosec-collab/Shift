# SHIFT / SPECTRUM OPERATIONS — V7.6

## Visual direction
A vivid, distinctive operational UI (not generic glassmorphism, purple-blue AI cards or stock illustrations).

- **Ink** \`#050911\`: ultra-dark background with very faint fixed engineering grid.
- **Signal Cyan** \`#00DEFF\`: selected date, active navigation, month controls, focus.
- **Acid Lime** \`#B7FF43\`: D1–D4, daytime duty, active work.
- **Ultraviolet** \`#B27AFF\`: N1–N2, night duty.
- **Hot Coral** \`#FF7394\`: H, time off.
- **Signal Amber** \`#FFC857\`: source anomalies and verification warnings.
- **Porcelain** \`#F9FCFF\`: dominant text. Muted \`#B7CCDF\` still has high contrast.

## Composition
1. Hard-edged instrument panels with 3px/4px segmented four-color signal rails.
2. Large editorial month heading and precise numeric date modules.
3. Month calendar **30/31 days**, every day clickable. Each cell contains D/N headcount and a compact three-color workload stripe.
4. Team matrix maintains full 10 × 30/31 data, sticky names, and role-level pill color encoding.
5. November main graphic: day/night cards, workload charts, color-matched live SVG chart.
6. Main header and mobile navigation carry a saturated cyan active control; the dedicated November shortcut uses Lime.
7. No raster images, canvas layer, continuous running gradients, blur-heavy surfaces, or WebGL. Small CSS hover transitions and selection-only animated details respect reduced-motion.

## Source truth and performance
The base staff rosters remain unchanged: October 310 cells, November 300 cells. November 30 duplicate N1 / missing N2 is not hidden or fabricated. Date selection updates only affected columns, not the whole matrix.

## Validation
CI build and tests must pass and tracked \`index.html\` must match \`npm run build\`. Manual browser QA at 320/375/390/768/1024/1440 px is still required to assert aesthetic fidelity and smoothness. Cloudflare Workers Builds success should be linked to the exact V7.6 commit before claiming live availability.
