---
name: fixing-ui-issues
description: Use when fixing visual/layout/interaction UI issues in this Angular + SDS prototype (cards, tables, nav, search, spacing, dark mode, scroll). Encodes the user's recurring feedback, the SDS conventions, the verify-with-headless-Chrome workflow, and the design principles (Gestalt, Nielsen heuristics, interaction design) to apply.
---

# Fixing UI issues

How to diagnose and fix UI issues here **correctly the first time**, and how to judge "is this right?" using real design principles instead of guessing. Read this before touching SCSS/templates for a visual fix.

## 0. Operating rules (learned from this user)

- **Fix the pattern everywhere, not just the one screen.** When the user gives feedback about a pattern (e.g. "search icon on the left"), apply it to *every* instance of that pattern app-wide, and prefer a single global rule over editing each template. The user said explicitly: "when I'm giving you feedback remember it and implement it everywhere for the same patterns." See [[ui-feedback-apply-everywhere]].
- **Remember feedback across turns.** Each accepted change becomes a standing convention — don't regress it next round. Persist non-obvious ones to memory.
- **Honor exact numbers.** When the user says "12px", "24px", "half", "6px spacing" — hit that number precisely and verify it (measure with CDP). Don't approximate silently.
- **One concept = one source of truth.** Spacing/positioning that repeats belongs in a shared rule (global stylesheet or the design tokens), not copy-pasted.
- **Always verify visually before claiming done.** Build, serve, screenshot with headless Chrome, and *measure* the thing you changed. Never report "done" off the code alone.

## 1. The verify workflow (do this every visual change)

1. `npx ng build --configuration development` — confirm it compiles (ignore pre-existing NG8113 unused-import warnings).
2. Serve: `npx ng serve --port 4319` (background), wait for `/` to 200.
3. Headless Chrome over CDP for screenshots + measurement:
   - Launch: `Google Chrome --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/chrome-cdp20 --window-size=1440,900 --hide-scrollbars`.
   - Drive it with the local `ws` package (`node_modules/ws`) over the page's `webSocketDebuggerUrl`.
   - **Synthetic `input`/`focus` events do NOT reliably trip Angular's zone here.** To type into a field, use real CDP input: `Input.dispatchMouseEvent` (click to focus) then `Input.insertText`. To toggle a class, `Runtime.evaluate` is fine.
   - Measure with `getBoundingClientRect()` / `getComputedStyle()` via `Runtime.evaluate({returnByValue:true})`, and `Page.captureScreenshot` to look.
4. Toggle dark mode in tests with `document.documentElement.classList.add/remove('dark')`.
5. **Clean up**: kill `ng serve` + chrome, `rm -rf` the temp user-data-dir, screenshots, and scratch scripts.

## 2. Project conventions (SDS + this app)

- Angular standalone + signals + new control flow (`@if/@for/@switch`), `ChangeDetectionStrategy.OnPush`.
- **Style with SDS tokens**, never hard-coded values: `--sds-bg-*`, `--sds-text-*`, `--sds-border-*`, `--sds-gap-*`, `--sds-padding-*`, `--sds-border-radius-*`, `--sds-shadow-*`. Gaps exist at 4/8/12/16/20/24…; there is **no `--sds-gap-6`** — use a literal `6px` when needed.
- The shell (`shared/app-shell`) owns the chrome: topbar (`sds-app-topbar`), product nav, sub-tabs, section CTA. Edit nav in `product-nav.config.ts`.
- Icons: `app-sds-icon`. Asset (`<img>`, SDS monochrome) icons honor `--sds-icon-filter`; **Lucide fallbacks render as `<svg>` using `currentColor`** (filter does nothing — set `color`). Colorful deco `<img>` icons (`assets/icons/agents/*.svg`) are a pastel chip + dark glyph.
- Component styles are emulated-encapsulated: to react to an ancestor `html.dark`, use **`:host-context(.dark)`**, not `.dark .foo` (the latter won't match across the host boundary).

### Standing patterns already agreed (keep these)
- **Search fields: magnifier on the LEFT.** Global rule `.sds-search-field app-sds-icon { order: -1 }`. The topbar global search puts the icon first in markup.
- **Top-bar global search**: left-aligned, fixed `560px` (a fixed px width — `min(…,100%)` collapses inside an `auto` grid track).
- **Product nav**: full-height black leading block whose right edge aligns to the Darwinbox "d" mark (~50px); item padding `0 24px`; always-black, so its text/icons are literal `#ffffff` (don't bind to the white *token*, which flips in dark).
- **Agent cards**: top 16 → icon → 12 → title → 12→8 → description → 16/20 → footer. Footer (`Active/Sessions`) is **pinned to the bottom** (`margin-top:auto`) so it lands in the same place on every card; description clamps to 2 lines.
- **Dark mode is a prototype**: a shadcn-zinc palette re-mapped onto SDS tokens under `.dark` in `styles.scss` (page `#0c0c0e`, card `#18181b`, border `#27272a`, text `#fafafa/#d4d4d8`, accent `#3b82f6`). Keep deco-icon chip color; don't add grey tiles behind icons. The sessions sparkline swaps to a blue→transparent gradient variant in dark.
- **List views**: rows fully clickable; on row hover the name turns blue + underline. Pager numbers 12px; "N per page" is a select (10/20/30).
- **Scroll containment**: chrome stays fixed; only the data region scrolls. The shell is a `height:100dvh` flex column, `.shell-content` is `flex:1; min-height:0; overflow-y:auto`. A page that wants only an inner region to scroll fills `height:100%` as a flex column and puts `flex:1; min-height:0; overflow:auto` on the scroll region (table-wrap/grid), with `position:sticky; top:0` on `thead th`.
  - **GOTCHA (cost me a card-content collapse):** when a CSS **grid** is itself the constrained scroll container (`flex:1; min-height:0` + `display:grid`), `grid-auto-rows:auto` lets rows shrink to the items' *min-content*, and any flex/grid child with `overflow:hidden` (e.g. a line-clamped `<p>`) has an automatic minimum size of 0 — so cards compress to their `min-height` and the description collapses to height 0. Fix: `grid-auto-rows: max-content` (size rows to full card content) so cards grow and the grid overflows/scrolls. Verify card `<p>` height > 0 after any change to a scrolling grid.

## 3. Design principles to apply (use these to decide what "looks right")

### Gestalt (grouping = meaning)
- **Proximity**: related things sit closer than unrelated ones. Spacing *encodes* grouping — e.g. title↔description tighter (8–12px) than description↔status (16–20px). Most "feels off" spacing bugs are proximity violations.
- **Similarity**: same role ⇒ same shape/size/color (consistent button sizes, one status-pill style, one card height per row).
- **Common region / enclosure**: a shared background/border groups items — but don't add boxes that imply grouping you don't mean (the user rejected a grey tile behind icons because it read as a separate element).
- **Continuity & alignment**: align edges to invisible grid lines (search left edge ↔ first column; footer numbers ↔ baseline). Misalignment reads as error.
- **Common fate**: things that move/scroll together belong together — hence chrome stays put while only the list scrolls.
- **Figure/ground**: enough contrast to separate content from surface (critical in dark mode — glyphs and sparklines must clear the background).

### Nielsen's usability heuristics (the relevant ones)
- **Consistency & standards**: same interaction everywhere (search icon side, hover affordance, button style). This is the user's "apply everywhere" rule in heuristic form.
- **Visibility of system status**: hover/active/selected states, current page, current filter, "1–20 of 24".
- **Match the real world**: real labels, real dates, sensible icons (folder = project, etc.).
- **Recognition over recall**: keep nav/sub-tabs/headers visible (don't scroll them away).
- **Aesthetic & minimal**: remove decoration that isn't doing work (the user repeatedly strips icons: `+` on Create Agent, back-arrow, bento) — every element must earn its place.
- **Flexibility/efficiency**: power options like page-size select.
- **Error prevention**: large hit targets, whole-row click, disabled states on pager ends.

### Interaction design
- **Affordance & signifier**: if it's clickable, it must *look* clickable (row hover → blue underlined name; pointer cursor).
- **Feedback**: every interaction has an immediate visible response (hover, focus ring, selected pill).
- **Fitts's law**: bigger/closer targets are easier — make the whole row the target, not just the name.
- **Hick's law / progressive disclosure**: don't show everything at once; dropdowns/menus for secondary actions.
- **Consistent, comfortable hit/spacing**: 32px+ controls, adequate padding so a dense nav doesn't feel "tight" (the user asked for +8px nav padding).
- **Respect reading order & hierarchy**: size/weight/color should rank importance (title > description > meta).

## 4. Diagnosis checklist for a reported issue
1. Reproduce on the exact screen + mode (light/dark). Screenshot first.
2. Name the principle being violated (proximity? consistency? figure/ground? affordance?). That tells you the *real* fix, not just the symptom.
3. Find the single source of truth (token, global rule, shared component). Fix there so it propagates.
4. If it's a pattern, grep for every other instance and fix them too (or switch to a global rule).
5. Hit exact numbers; verify by measuring, not eyeballing.
6. Check the other mode (dark/light) and adjacent screens you may have affected.
7. Clean up scratch processes/files. Report with what you measured.
