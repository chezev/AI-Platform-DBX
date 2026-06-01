# MODE 1 — SDS Audit

Goal: produce a concise punch list of SDS violations grouped by category, with
exact node IDs and fixes, so design can correct before handoff.

## Step 1 — Orient

1. `get_screenshot(fileKey, nodeId)` — visual overview only.
2. `get_design_context(fileKey, nodeId)` — full node tree with token bindings.
   If response is huge, the MCP saves to a file; grep/jq it instead of
   re-fetching.
3. `get_variable_defs(fileKey, nodeId)` — list of tokens used; cross-check
   against `SDS-Reference.md`.

If the frame has too many sub-nodes, decompose it: call `get_design_context`
on individual sections (header, sidebar, main, modal) and parse child IDs
from the sparse tree.

## Step 2 — Parse violations programmatically

Use Python/jq against the saved design context to surface:

```python
import re, json
content = open('/tmp/figma_output.txt').read()
hex_vals = re.findall(r'#[0-9a-fA-F]{6}', content)
tokens   = re.findall(r'var\(--[^,)]+', content)
fonts    = re.findall(r'"fontFamily":\s*"([^"]+)"', content)
spacings = re.findall(r'"(?:x|y|width|height|padding[A-Z]*|gap)"\s*:\s*([\d.]+)', content)
off_grid = [s for s in spacings if float(s) % 4 != 0 and float(s) > 0]
sub_px   = [s for s in spacings if '.' in s]
```

For component-level provenance, inspect each node's `mainComponent.fileKey`
and `boundVariables` directly from the JSON.

## Step 3 — 10-Category checklist

For each category record: **node ID · layer name · found · expected · fix**.
Use `SDS-Reference.md` as the lookup for correct tokens, mixins, and
component node-ids.

### CT — Colour & Tokens
- Every fill/stroke/background bound to a `--sds-*` token (programmatic
  `boundVariables` check, not visual).
- No raw hex even if the hex matches SDS. No legacy namespaces. No AI
  gradient. No `#000000`.
- Page background uses `bg-neutralGrey-light2`.
- Feedback colours match SDS feedback token exactly.
- **Approved `rgba()` values (never flag):** `rgba(32,32,32,0.12)` (right-panel
  shadow), `rgba(32,32,32,0.16)` (dropdown list shadow),
  `rgba(32,32,32,0.48)` (`bg-overlay-blanket`). Any other raw `rgba()` is a
  CT violation.
- **`border-secondary-discabled`** — known Figma typo in SDS itself (should be
  "disabled"). **Never flag.** Do not "fix" it in designs.
- **`border-feedback-successHigh`** and **`border-feedback-warningHigh`** —
  engineering-only tokens; absent from Figma token set. If seen inside a Figma
  variable definition, flag 🟡 as undocumented.
- **`bg-secondary-lighter`** — Figma-only; no engineering equivalent. Flag 🟡
  if this token appears in production CSS.
- **Gap token fallbacks must match their values.** `var(--sds-gap-8,0px)` is
  wrong; must be `var(--sds-gap-8,8px)`. Flag 🔵 for each mismatch.

### TY — Typography
- **Darwin Sans on every text node — non-negotiable.** Programmatic check: for
  every text node, `fontFamily` must resolve to `Darwin Sans` (separator
  variants `DarwinSans` / `Darwin_Sans` / `Darwin Sans` are equivalent — never
  flag). Any other family (Segoe UI, Inter, system, Arial, Roboto, etc.) is
  🟠 TY. Run this even when the visual rendering looks correct — fallback
  fonts mask the defect at the file level.
- No raw `font-size` / `font-weight` / `line-height`. All text bound to
  composite tokens (`title-m-bold`, `body-s-book`, etc.).
- Allowed weights only: **300 Book**, **500 Medium**, **700 Bold / Extra
  Bold**. Flag Light, Regular, SemiBold, Heavy, Black.
- Naming variants `ExtraBold` / `Extra_Bold` / `Extra Bold` / `_Bold` are
  acceptable if the underlying weight is one of the four valid ones.
- Tokens `body-xs-*` and weight `regular` do not exist — flag.
- **Canonical composite token sizes (common ones — flag deviations):**

  | Token | Size | Line-height | Weight |
  |---|---|---|---|
  | `body-m-medium` | 14px | **18px** | 500 |
  | `body-m-book` | 14px | 18px | 300 |
  | `body-s-medium` | 12px | 16px | 500 |
  | `body-s-book` | 12px | 16px | 300 |
  | `title-xxs-bold` | 16px | 20px | 700 |
  | `title-xxs-medium` | 16px | 20px | 500 |
  | `caption-medium` | 10px | 14px | 500 |

  If a Figma file's `sds-body-m-medium-line-height` variable resolves to 16px
  (instead of 18px), that is a token misconfiguration in the file — flag 🟡
  CT and note the correct value.

### SG — Spacing & Grid
- All `x` / `y` / `width` / `height` / `padding` / `gap` are multiples of
  **4px**. Border widths 1px and 2px are exempt.
- **Sub-pixel positioning is always a violation** (`172.640625`,
  `871.9921875`). Flag even if Figma itself produced the value.
- `Spacing/6` and `Spacing/10` are valid **only when used via token
  reference** — raw `6`, `10`, `11`, `17`, `18`, `27`, `30`, `35`, `59`, `63`,
  `65`, `97` are off-grid.

### PL — Page Layout & Grid System
- Grid column count matches the breakpoint: Small=4, Medium=8, Large/XL=12.
- Content area x-offset matches `72px nav + 32px margin = 104px` at 1366.
- Header height per `SDS-Reference.md` (engineering canonical = 56px; Figma
  doc says 60 — flag the doc mismatch when seen).
- All layouts must include at least one flexible pane — two fixed-width
  panes is a violation.

### AL — Alignment & Layout
- Sticky / frozen columns implemented correctly.
- Padding symmetric unless asymmetry is intentional (1366 right-margin
  exception aside).
- Horizontal scroll enabled where tables overflow.
- Hidden elements use `*ngIf` / `[hidden]` binding — not `display: none`
  hard-coded in CSS.

### CO — Components
- Every interactive element is an SDS library instance — zero custom
  rebuilds. Verify via `mainComponent.fileKey`.
- **Named-but-detached check (🔴 always).** Any layer whose name matches an
  SDS component pattern (`Button/*`, `Badge/*`, `Input/*`, `Dropdown/*`,
  `Sds*`, `Avatar/*`, `Modal/*`, `Toast/*`, `Tooltip/*`, `Tag/*`, `Chip/*`,
  `Toggle/*`, `Checkbox/*`, `Radio/*`, `Stepper/*`, etc.) must have
  `mainComponent.fileKey === 'EIr5CEfAzgj6zaOS1aDuWV'`. A layer named like
  SDS but not bound to the SDS library is a deliberate-looking fake — flag
  🔴 with the message "Detached/renamed rebuild of <component>". This is
  separate from generic detached-component detection because it catches
  designers who reuse SDS names on custom rebuilds.
- Avatars use the SDS Avatar Base (`node-id=6673-135192`); never raw `<img>`.
  **Avatar sizes:** xs=16px, s=24px, m=32px, l=40px, xl=48px, xxl=72px+.
  AvatarPile: same size within group (mixing = 🟡), `-2px` overlap, max 4–5
  before overflow pill (`bg-neutralGrey-default`), fallback gradient
  `linear-gradient(135deg, #0183ff 0%, #0052c5 100%)` — never solid grey.
- Buttons: correct variant (primary / secondary / tertiary / inverse);
  primary is **charcoal** (`bg-primary-active` `#202020`), never blue;
  small radius `Radius/2`, default `Radius/4`.
- Disabled state uses disabled tokens, never opacity reduction.
- **No disabled primary CTAs.** SDS form pattern = always-active CTA +
  Error Framework alert (`node-id=8075-14378`) on submit attempt. Greyed-out
  primary is a defect.
- Search input is pill-shaped (`Radius/999`, 40px height).
- Badge vs Status Tag vs Alert used correctly: Badge = categorisation /
  numeric counts, Status Tag = workflow state only (Draft, Approved,
  Pending), Alert = informational callouts.
- **Badge typography:** Standard badge → `body-s-book` (12px / 300 / 16px).
  Count Badge **only** → `caption-medium` (10px / 500 / 14px). Using
  `body-m-medium` or `caption-medium` on standard badges is a TY violation.
- **Badge geometry:** `min-height: 24px`, `border-radius: 24px` (pill),
  `padding: 0 8px`, `gap: 4px`.
- Badge content: Title Case (AP Style), max 20 chars, no truncation, no
  wrapping, nouns only, no leading zeros.
- **Status Tag full spec** (`node-id=6673-105429`): `bg-neutralGrey-light1`
  background, `border-left: 3px solid border-neutralBlue-active`, `border-radius:
  0 2px 2px 0`, `padding: 8px 12px`, `body-s-book`, `text-neutral-ghost`.
  Valid states: Draft / Approved / Pending / Rejected / In Review. Any
  green-tinted Status Tag (`bg-feedback-successLow` + `border-feedback-successhigh`)
  is an undocumented variant — flag 🟠 CO unless designer confirms SDS support.
- Segmented control: active segment must be charcoal, `width: fit-content`,
  state chained across `:active`/`:focus`/`:focus-visible`.
- Icons are SDS SVGs — no PNGs. Tab active indicators must be CSS borders
  (`height: 2px; background: var(--sds-themebg-active)`), not raster images.
- **Dropdown open-state geometry** (Mode 2 check): trigger `border-radius:
  4px 4px 0 0`; list `border-radius: 0 0 8px 8px`; list `border-top: none`;
  list `top: 100%` (zero gap); list `box-shadow: 0 8px 8px rgba(32,32,32,0.16)`.
  Check icon on selected option uses `text-neutralBlue-active` (#0183ff);
  hidden on all other rows.
- Darwinbox-specific SDS components to always verify: AI Button, Approve
  Reject Buttons, People Search, Leave Types, Edited Date, Status Tag.

### GR — Grammar & Copy
Read `gr-rules.md` for the full GR rule set before running this check.

### IL — Illustrations

**Figma file:** `nzlGKGavvvsxTPw53tb2UA`

- Every illustration must be a live `SdsIllustration` instance (`mainComponent.fileKey === 'nzlGKGavvvsxTPw53tb2UA'`). Never a flat SVG, raster export, or custom rebuild.
- `--themeillustration/*` tokens are **illustration-internal** — never flag an `SdsIllustration` for using them. Never reference them in feature fills or SCSS.
- `type` must be one of the 11 catalog values below — flag 🟠 CO for any custom type string.
- `size` must be `Small` / `Medium` / `Large` — no raw pixel override.
- No `<img>` or flat SVG used in place of an SDS illustration — flag 🔴 CO.
- Match the semantic context: Success ≠ Celebration ≠ No Data — wrong `type` for the UI state is 🟠 CO.

**Illustration catalog**

| `type` prop | Variants | Semantic use |
|---|---|---|
| `Success` | 2 | Task / action completed ✅ |
| `SDS - Celebrations` | 2 | Milestone reached 🎉 |
| `SDS No Data` | 3 | Empty / unpopulated state ⛔️ |
| `SDS - User Error` | 2 | Input / user mistake 🛑 |
| `SDS - System Error` | 3 | Technical / unexpected failure 🚫 |
| `SDS - No Access` | 5 | Restricted / unauthorized ⚠️ |
| `SDS - Announcement` | 4 | Informational broadcast |
| `SDS - Get Started` | 2 | Onboarding / first use |
| `SDS - Work Life Balance` | 3 | Work-life balance themed content |
| `SDS - Goals` | 2 | Goals / achievements |
| `Search` | 1 | Empty search results |

**Size selection**

| Prop | px | Use |
|---|---|---|
| `Small` | 150px | Inline / contextual (sidebar hint, card well) |
| `Medium` | 250px | Panel / section empty state |
| `Large` | 350px | Full-page empty / error state |

### DR — Design Readiness (Cursor / Dev-Mode / AI code-gen compatibility)

Scalable rules — apply to every frame, group, and component slot. The
intent: a Cursor / Figma Dev-Mode / AI codegen tool should be able to walk
the design tree and produce sensible code without human translation.

**Layer & group naming (🟡 default, escalate to 🟠 if pervasive)**
- No default Figma names anywhere: `Frame 1`, `Group 23`, `Rectangle 4`,
  `Component 1`, `Ellipse 2`, `Vector`, `Slice`, `Auto layout`. Flag every
  occurrence.
- Every container has a semantic name describing its role: `header`,
  `sidebar`, `content`, `field-group / personal-info`, `action-bar`,
  `metric-card`. PascalCase / kebab-case / snake_case all acceptable —
  separator style is never flagged, default names are.
- Component instance slot names match the SDS prop name (`label`, `icon-left`,
  `helper-text`, `trailing`, etc.) — generic slot names like `text`,
  `frame`, `icon` on a known SDS slot are 🟡.

**Grouping integrity**
- Related elements are grouped into one frame — never floating siblings
  on the page canvas. Field + label + helper text must live in one frame
  named for the field (`field/<name>`), not three loose siblings.
- One frame = one responsibility. A frame mixing unrelated children
  (e.g. a card body + a floating modal trigger) is 🟡 — split.
- Modals, overlays, tooltips are on their own top-level frame, not nested
  inside the screen they overlay. Use a clear `overlay-*` prefix.

**Auto-layout (Cursor / Dev-Mode prerequisite)**
- Use Figma auto-layout for every frame whose children flow in a row or
  column. Absolute positioning of siblings inside a logical row/column is
  🟡 — Cursor cannot infer flex / grid intent from x/y coordinates.
- Auto-layout `gap` must use SDS spacing values (multiples of 4, or `gap-6`
  / `gap-10` via token reference). Raw `gap: 7` is an SG violation, not DR.
- Constraints (`left`, `right`, `top`, `bottom`, `stretch`) explicitly set
  on direct children of resizable frames — `Mixed` / default constraints
  on a responsive frame is 🟡.

**Component & variant exposure**
- Every reusable element exposed as an SDS instance — not a flattened
  copy. Even a single-use button must be an SDS Button instance, never a
  rectangle + text + icon group.
- Where the SDS component has variants, the correct variant prop must be
  selected (`type=Primary` vs `Secondary`, `size=Default` vs `Small`).
  Default-variant-on-everything pattern is 🟡 (designer didn't choose).
- All interactive states the build needs (hover, focus, disabled, loading,
  empty, error) are explicitly placed on the page or in a state-row frame
  — not just implied.

**Asset & token readiness**
- All icons are SDS SVG instances (per CO). Raster icons / flattened
  vectors that lose token bindings are 🟠 DR.
- Images use real placeholders with explicit dimensions, not solid-fill
  rectangles named `Image`.
- All text bindings, fills, strokes, and effects bound to tokens (per CT
  & TY) — DR re-flags any node where `boundVariables` is null because
  Cursor / Dev-Mode reads tokens, not raw values.

### DH — Dev Handoff Readiness
- All 9 categories above pass with 0 🔴 / 🟠.
- All component variants defined; all states documented (default, hover,
  active, focus, disabled, loading, empty).
- Loading / skeleton state exists for async zones. Empty state designed,
  not a blank area.
- Asset names follow convention — no `Frame 123`, `Group 4` (DR re-check).
- Export formats confirmed (SVG / WebP).
- Figma specs are locked — no open comments or unresolved threads.
- Angular `@Input()` / `@Output()` annotated where component is real.

## Step 4 — Report

Save as `<ScreenName>_SDS_Audit.md` next to the design folder.

**Style rules — always apply:**
- No prose paragraphs. Tables and bullets only.
- Each violation: Found / Expected / Fix table — nothing else.
- No filler ("This is a violation because…", "It is important to note…").
- All descriptions ≤ 15 words. Shorter = better.

```markdown
# SDS Audit — <Screen Name>
**File:** `<fileKey>` · **Node:** `<nodeId>` · **Date:** <YYYY-MM-DD>
**URL:** <Figma URL>
**Verdict:** ❌ Block handoff  /  ⚠️ Fix before sign-off  /  ✅ Pass

## Score

| Category | 🔴 | 🟠 | 🟡 | 🔵 |
|---|---|---|---|---|
| CT — Colour & Token | — | — | — | — |
| TY — Typography | — | — | — | — |
| SG — Spacing & Grid | — | — | — | — |
| PL — Page Layout | — | — | — | — |
| AL — Alignment | — | — | — | — |
| CO — Components | — | — | — | — |
| GR — Grammar & Copy | — | — | — | — |
| IL — Illustrations | — | — | — | — |
| DR — Design Readiness | — | — | — | — |
| DH — Dev Handoff | — | — | — | — |
| **Total** | — | — | — | — |

## Violations

### [V001] 🔴 · CT · Save Button uses raw hex
| | |
|---|---|
| **Node** | `123-456` — Save Button |
| **Found** | `#0183ff` raw fill, no `boundVariables` |
| **Expected** | `bg-primary-active` (charcoal `#202020`) |
| **Fix** | Bind fill to `--sds-bg-primary-active` |

[repeat per violation — no prose between items]

## What's Good
- N nodes correctly bound to SDS tokens.
- N SDS component instances with live library links.

## Fix Queue
| 🔴 Now | 🟠 Before review | 🟡 Next pass | 🔵 Cleanup |
|---|---|---|---|
| V001 — fix | V010 — fix | V020 — fix | V030 — fix |

## 🆕 New Patterns Found
(Patterns not yet covered by SDS-Reference.md — propose additions.)
```

After the report, suggest additions to `SDS-Reference.md` for any pattern
seen 2+ times across audits.
