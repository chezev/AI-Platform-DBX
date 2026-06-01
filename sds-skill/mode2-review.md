# MODE 2 — UI Review

Goal: compare a live staging/production page against its Figma source of
truth and return a concise diff report engineering can fix.

## Step 1 — Capture Figma ground truth

1. `get_screenshot(fileKey, nodeId)` — design visual.
2. `get_design_context(fileKey, nodeId)` — extract frame dimensions, named
   text positions, and component names present (for structural reference, not
   exact copy matching).
3. **Pixel-level measurements** (mandatory before visual diff). Parse the
   design context and record:

| Element | Record |
|---|---|
| Global header | Height (px) |
| Left nav rail | Width — must be 72px |
| Content area | x offset from left, y offset from top |
| Page breadcrumb bar | Height |
| KPI / summary card | Width, height, inner padding |
| Table container | Outer padding |
| Table header row | Height |
| Table data rows | Height (consistency across rows) |
| Avatar in rows | Width × height — must match an SDS size token |
| Right panel | x offset, width, gap from content |
| Right panel internal | Padding |
| Filter / segmented tabs | Height, gap between tabs |
| Buttons | Height |

Flag immediately if Figma itself has sub-pixel values (e.g.
`width=871.9921875`) — these are existing SG violations in the design,
separate from build issues.

## Step 2 — Open staging and match the viewport

```
mcp__Claude_in_Chrome__navigate(stagingURL)
mcp__Claude_in_Chrome__resize_window(width: <figma-w>, height: <figma-h>)
```

If staging requires auth, ask the user once:
> "Login required for `<host>` — share credentials or open the page in your
> browser and confirm when you're past the wall."

Use `form_input` to fill credentials or `javascript_tool` to inject a
session cookie / localStorage token. Never bypass auth. Never store
credentials. If access is blocked, write `"Staging access blocked — review
skipped"` in the report and stop.

**Pause animations before any screenshot:**
```js
document.querySelectorAll('*').forEach(el => {
  el.style.transition = 'none';
  el.style.animation  = 'none';
});
```

For long pages, capture in scroll sections labelled `top` / `mid` / `bottom`.

## Step 3 — Visual diff, zone-by-zone

Scan order: **Zone 1 → Zone 2 (gate) → Zone 3 → 4 → 5 → … top → bottom,
left → right.** Do not skip zones.

**Zone 2 gate (left nav).** If the left nav rail is absent in staging, log
🔴 Critical immediately AND annotate every subsequent spacing finding:
*"Left offset measurements are relative to no-nav layout — will shift once
nav is implemented."* Still scan the rest of the zones.

Per zone, compare against the Step 1 measurements and answer:
1. Does the layout structure match? (elements present, nothing missing/extra)
2. Do spacing and gaps match the extracted measurements?
3. Does typography (size, weight, color) look right?
4. Do colors match?
5. Do component sizes match (avatar px, row height px, button height px)?

| Axis | Figma source | Live source | Fail if… |
|---|---|---|---|
| Layout | Figma frame x/y/w/h | `getBoundingClientRect()` via `javascript_tool` | Off by >2px or wrong column count |
| Spacing | Figma `padding-*` / `gap-*` token | Computed `padding` / `gap` | Not a 4px multiple, or doesn't match token |
| Color | Figma `bg-*` / `border-*` token | Computed `background-color` / `border-color` | Raw hex (not `var(--sds-*)`), or wrong hex |
| Typography | Figma composite text token | Computed `font-family` / `size` / `weight` / `line-height` | Not Darwin Sans, weight outside 300/500/700, or doesn't match token |
| Component | SDS library instance | DOM class / structure | Custom rebuild instead of SDS component |
| Icons | SDS SVG | DOM `<img>` / `<svg>` | PNG raster, or custom SVG path |
| States | Hover / focus / disabled per Figma | Trigger via JS `.dispatchEvent(...)` | State missing or visually wrong |

**Pixel severity (spacing only):**
- Element completely absent → 🔴 Critical regardless of size.
- Element present but wrong size by ≥ 1 SDS size step (32px vs 40px avatar) → 🟠 High.
- Diff ≥ 8px → 🟠 High.
- Diff = 4px → 🟡 Medium.
- Diff 1–3px → 🔵 Low.

## Step 4 — Drop into code when needed

If a defect's root cause isn't obvious, read computed styles directly:

```js
mcp__Claude_in_Chrome__javascript_tool({
  code: `
    const el = document.querySelector('<selector>');
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor, color: cs.color, font: cs.font,
      padding: cs.padding, gap: cs.gap, border: cs.border,
      class: el.className, html: el.outerHTML.slice(0, 200),
    };
  `
})
```

Call out **nomenclature mismatches** explicitly: e.g. Figma uses
`bg-secondary-lighter` but engineering exposes only `bg-secondary-light`; or
Figma names a component `OTP Card` while the Angular file is
`otp-login.component`. These are not bugs but they slow handoff.

## Step 5 — Copy & grammar on the live page only

Extract live text via `get_page_text()`. Read `gr-rules.md` for the full GR
rule set. Check spelling, grammar, leftover placeholders, truncated labels,
inconsistent number/date formatting. **Do NOT compare wording against Figma
copy** — UX writers may have updated copy between design and build. Only the
live page's text quality is assessed.

## Step 6 — State & responsive (if requested)

Test dropdown-open, hover, mobile, empty state only if in scope. Compare
each state screenshot against the corresponding Figma frame/variant.

## Step 7 — Report

Save as `<ScreenName>_UI_Review_<YYYY-MM-DD>.md`.

```markdown
# UI Review — <Screen Name>
**Figma:** `<fileKey>` / `<nodeId>` · **Live:** `<url>` · **Viewport:** `<w×h>`
**Date:** <YYYY-MM-DD>
**Verdict:** ❌ Block release  /  ⚠️ Fix before sign-off  /  ✅ Pass

## Score
| Zone | 🔴 | 🟠 | 🟡 | 🔵 |
|---|---|---|---|---|
| Z1 — Header | — | — | — | — |
| Z2 — Left nav (gate) | — | — | — | — |
| Z3 — Content | — | — | — | — |
| … | — | — | — | — |
| **Total** | — | — | — | — |

## Findings

### [F001] 🔴 · Z3 · Primary CTA wrong colour
| | |
|---|---|
| **Region** | Primary CTA in content area |
| **Figma expects** | `bg-primary-active` (#202020 charcoal) |
| **Live shows** | `#0183ff` raw |
| **Fix** | Bind to `--sds-bg-primary-active` |

[repeat per finding — tables only]

## What's Good
- Header height matches design (56px).
- Avatar sizes match SDS `size.m` (32px).

## Nomenclature mismatches
| Figma | Code | Suggested fix |
|---|---|---|
| `bg-secondary-lighter` | `--sds-bg-secondary-light` | Rename Figma to `light` |

## Grammar (live copy)
- "Recieve OTP" → "Receive OTP" (typo).
- "Click on submit" → "Submit" (action verb).

## Sign-off checklist
- [ ] All 🔴 fixed
- [ ] All 🟠 fixed
- [ ] Nomenclature mismatches logged
- [ ] Re-run UI Review
```

---

## Edge cases

- **Dynamic content differs from Figma placeholders** (names, avatars,
  dates) — expected, do NOT flag. Flag only if the *structure* or *style*
  of the rendered data differs.
- **Staging has debug UI / admin banners** — note under "Environment noise,
  not a dev issue."
- **Font not loading (fallback rendering)** — text looks thinner/wider than
  Figma. Flag 🟠 High under TY with note: *"Likely font loading issue —
  check network."*
- **Animations running during screenshot** — re-capture after pause.
- **Auth failed** — write `"Staging access blocked"` and stop.
