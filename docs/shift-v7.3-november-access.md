# Shift V7.3 — November visibility and direct access fix

## Root cause
The legacy shell initializes to October. Its month switcher also reads the persisted key shift-month-view-2026, so an October preference stored in a prior visit can override the November 2026 default, making the graphical November board difficult to find despite a successful Cloudflare Workers Build.

## Fix
- On November 2026 dates in Bangkok time, the app opens the **November Graphic Duty Board directly**, regardless of stale stored month selection.
- A dedicated November 2026 shortcut appears in desktop navigation, the mobile bottom navigation and the header so it remains discoverable from any screen.
- Explicit URL navigation: use ?month=11 to open the November board, or ?month=10 for October. ?view=overview keeps the Overview visible while preselecting November for later navigation.
- The existing October 2026 schedule and all role-source datasets remain unchanged. The original November worksheet remains available via the view toggle, but the graphic view is the default.
- Uses in-memory DOM navigation; no reload loops, external libraries, paid APIs or images.

## Validation
- CI build and test suite must pass.
- November 12 with saved October selection must show graphic November on initial load.
- Both desktop and mobile shortcuts must open month 11 in graphic mode.
- In November month view, switching to October and back must be reversible.
- Test PWA on a real browser (desktop/mobile) and confirm the site is using the worker that reports Cloudflare Builds success.
