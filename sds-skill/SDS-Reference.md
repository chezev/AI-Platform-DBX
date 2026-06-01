# Sapien Design System — Complete Reference
**SDS Figma file:** `EIr5CEfAzgj6zaOS1aDuWV`
**Last updated:** 2026-04-28

---

## Table of Contents
1. [Typography](#typography)
2. [Color Tokens — Background](#color-tokens--background)
3. [Color Tokens — Border](#color-tokens--border)
4. [Color Tokens — Text & Icon](#color-tokens--text--icon)
5. [Spacing & Grid](#spacing--grid)
6. [Page Layout](#page-layout)
7. [Border Radius](#border-radius)
8. [Components — Full Catalog](#components--full-catalog)
9. [Component Specs](#component-specs)
10. [Engineering Implementation Notes](#engineering-implementation-notes)
11. [SCSS Mixin Catalog](#scss-mixin-catalog)
12. [Alert — Variant Figma References](#alert--variant-figma-references)
13. [Banned / Legacy Tokens](#banned--legacy-tokens)
14. [Audit Rules Quick Reference](#audit-rules-quick-reference)
15. [Design ↔ Engineering Token Discrepancies](#design--engineering-token-discrepancies)

---

## Typography

### Font Family
- **Primary:** Darwin Sans (all weights)
- **Fallback (compatibility only):** Segoe UI — designs must specify Darwin Sans
- Format equivalences — all identical, never flag: `DarwinSans:Medium` = `Darwin_Sans:Medium` = `Darwin Sans Medium`

### Valid Darwin Sans Weights

| Weight name | CSS weight | Figma token |
|---|---|---|
| Book | 300 | `font-weight-book` |
| Medium | 500 | `font-weight-medium` |
| Bold | 700 | `font-weight-bold` |
| Extra Bold | 700 | `font-weight-bold` |

**Invalid weights (flag immediately):** Light, Regular, SemiBold, Heavy, Black

Naming variants of valid weights are **never** flagged: `ExtraBold`, `Extra_Bold`, `Extra Bold`, `_Bold` — if the underlying weight is Book / Medium / Bold / Extra Bold, it is acceptable.

### Font Size Primitives

| Token | Value |
|---|---|
| `font-size-10` | 10px |
| `font-size-12` | 12px |
| `font-size-14` | 14px |
| `font-size-16` | 16px |
| `font-size-20` | 20px |
| `font-size-24` | 24px |
| `font-size-32` | 32px |
| `font-size-40` | 40px |

### Line Height Primitives

| Token | Value |
|---|---|
| `font-line-height-14` | 14px |
| `font-line-height-16` | 16px |
| `font-line-height-18` | 18px |
| `font-line-height-20` | 20px |
| `font-line-height-24` | 24px |
| `font-line-height-28` | 28px |
| `font-line-height-32` | 32px |
| `font-line-height-40` | 40px |
| `font-line-height-48` | 48px |

### Composite Text Style Tokens

#### Title Scale
| Token | Size | Line Height | Weight | Use case |
|---|---|---|---|---|
| `title-l-bold` | 40px | 48px | Extra Bold | Primary page headings, main banners |
| `title-l-medium` | 40px | 48px | Medium | Large medium-weight headings |
| `title-m-bold` | 32px | 40px | Extra Bold | Section headers, prominent module titles |
| `title-m-medium` | 32px | 40px | Medium | Section headers (regular weight) |
| `title-s-bold` | 24px | 32px | Extra Bold | Subsection headers, sub-module titles |
| `title-s-medium` | 24px | 32px | Medium | Subsection headers (regular weight) |
| `title-xs-bold` | 20px | 24px | Extra Bold | Form section headings, contextual info blocks |
| `title-xs-medium` | 20px | 24px | Medium | Smaller info group labels |
| `title-xxs-bold` | 16px | 20px | Extra Bold | Compact labels, tight UI heading weight |
| `title-xxs-medium` | 16px | 20px | Medium | Compact labels (regular weight) |

#### Body Scale
| Token | Size | Line Height | Weight | Notes |
|---|---|---|---|---|
| `body-l-bold` | 16px | 20px | Extra Bold | |
| `body-l-medium` | 16px | 20px | Medium | |
| `body-l-book` | 16px | 24px | Book | Reading-heavy sections, paragraphs |
| `body-l-book-upper-case` | 16px | 20px | Book | Uppercase transform |
| `body-m-bold` | 14px | 18px | Extra Bold | |
| `body-m-medium` | 14px | 18px | Medium | Supporting text, summaries, notifications |
| `body-m-book` | 14px | 18px | Book | Standard instructions |
| `body-m-book-upper-case` | 14px | 18px | Book | Uppercase transform |
| `body-m-book-underline` | 14px | 18px | Book | Underline decoration |
| `body-s-bold` | 12px | 16px | Extra Bold | |
| `body-s-medium` | 12px | 16px | Medium | Captions, disclaimers, metadata |
| `body-s-book` | 12px | 16px | Book | |
| `body-s-book-upper-case` | 12px | 16px | Book | Uppercase transform |
| `body-s-book-link` | 12px | 16px | Book | Underline decoration |

#### Caption Scale
| Token | Size | Line Height | Weight | Use case |
|---|---|---|---|---|
| `caption-bold` | 10px | 14px | Extra Bold | Timestamps, secondary metadata, footnotes |
| `caption-medium` | 10px | 14px | Medium | Not for main content or headings |

### Token Format Equivalences
Separator style (`-`, `/`, `:`) is **never** a violation. All identical:
- `caption-medium` = `caption/medium` = `caption:medium`
- `title-xs-medium` = `title/xs/medium` = `title:xs:medium`
- `body-m-bold` = `body/m/bold` = `body:m:bold`

### Non-Existent Type Tokens — Flag These
- `body-xs-*` — does not exist (smallest body = `body-s-*`)
- Any token with weight `regular` — use `book` instead
- Any token with weight `semibold`, `heavy`, or `light`

---

## Color Tokens — Background

### Primary
| Token | Hex |
|---|---|
| `bg-primary-disabled` | `#e9e9e9` |
| `bg-primary-default` | `#d2d2d2` |
| `bg-primary-hover` | `#4d4d4d` |
| `bg-primary-active` | `#202020` |
| `bg-primary-readOnly` | `#797979` |
| `bg-primary-ripple` | `#131313` |
| `bg-primary-full` | `#131313` |
| `bg-primary-negative` | `#ffffff` |

### Secondary
| Token | Hex |
|---|---|
| `bg-secondary-disabled` | `#d0ebff` |
| `bg-secondary-disabledHover` | `#d0ebff` |
| `bg-secondary-lighter` | `#d0ebff` |
| `bg-secondary-default` | `#aed7ff` |
| `bg-secondary-active` | `#0183ff` |
| `bg-secondary-activeHover` | `#0052c5` |

### Neutral Grey
| Token | Hex | Note |
|---|---|---|
| `bg-neutralGrey-light1` | `#fbfbfb` | |
| `bg-neutralGrey-light2` | `#f6f6f6` | Page backgrounds |
| `bg-neutralGrey-light3` | `#f2f2f2` | |
| `bg-neutralGrey-light4` | `#e9e9e9` | |
| `bg-neutralGrey-light8` | `#4d4d4d` | |
| `bg-neutralGrey-default` | `#d2d2d2` | |
| `bg-neutralGrey-hover` | `#e9e9e9` | |
| `bg-neutralGrey-pressed` | `#d2d2d2` | |
| `bg-neutralGrey-disabled` | `#e9e9e9` | |
| `bg-neutralGrey-readOnly` | `#797979` | |

### Neutral Blue
| Token | Hex |
|---|---|
| `bg-neutralBlue-light1` | `#f5faff` |
| `bg-neutralBlue-default` | `#d9efff` |
| `bg-neutralBlue-hover` | `#aed7ff` |
| `bg-neutralBlue-pressed` | `#8bc1ff` |
| `bg-neutralBlue-active` | `#0183ff` |
| `bg-neutralBlue-activeHover` | `#006ae2` |
| `bg-neutralBlue-activePressed` | `#0052c5` |
| `bg-neutralBlue-disabled` | `#aed7ff` |
| `bg-neutralBlue-disabledHover` | `#d0ebff` |

### Neutral White
| Token | Hex |
|---|---|
| `bg-neutralWhite-default` | `#ffffff` |

### Neutral Charcoal
| Token | Hex |
|---|---|
| `bg-neutralCharcoal-default` | `#202020` |
| `bg-neutralCharcoal-hover` | `#4d4d4d` |
| `bg-neutralCharcoal-pressed` | `#131313` |

### Overlay
| Token | Value |
|---|---|
| `bg-overlay-blanket` | `rgba(32,32,32,0.48)` |

### Feedback
| Token | Hex |
|---|---|
| `bg-feedback-successHigh` | `#00a251` |
| `bg-feedback-successMid` | `#99dab9` |
| `bg-feedback-successLow` | `#e5f6ee` |
| `bg-feedback-errorHigh` | `#ff2323` |
| `bg-feedback-errorMid` | `#ffa7a7` |
| `bg-feedback-errorLow` | `#ffe9e9` |
| `bg-feedback-warningHigh` | `#ffad0d` |
| `bg-feedback-warningMid` | `#ffdf9e` |
| `bg-feedback-warningLow` | `#fff7e5` |
| `bg-feedback-infoHigh` | `#0183ff` |
| `bg-feedback-infoMid` | `#8bc1ff` |
| `bg-feedback-infoLow` | `#d0ebff` |

---

## Color Tokens — Border

### Primary
| Token | Hex |
|---|---|
| `border-primary-lighter` | `#f6f6f6` |
| `border-primary-subtle` | `#e9e9e9` |
| `border-primary-disabled` | `#e9e9e9` |
| `border-primary-default` | `#a6a6a6` |
| `border-primary-readOnly` | `#797979` |
| `border-primary-full` | `#202020` |
| `border-primary-negative` | `#ffffff` |

### Secondary
| Token | Hex | Note |
|---|---|---|
| `border-secondary-lighter` | `#aed7ff` | |
| `border-secondary-default` | `#8bc1ff` | |
| `border-secondary-hover` | `#61acff` | |
| `border-secondary-pressed` | `#d0ebff` | |
| `border-secondary-discabled` | `#d0ebff` | Typo in Figma — "discabled" |
| `border-secondary-active` | `#0183ff` | |
| `border-secondary-activeHover` | `#0052c5` | |

### Neutral Grey
| Token | Hex |
|---|---|
| `border-neutralGrey-light1` | `#f6f6f6` |
| `border-neutralGrey-light2` | `#e9e9e9` |
| `border-neutralGrey-light3` | `#d2d2d2` |
| `border-neutralGrey-full` | `#202020` |
| `border-neutralGrey-default` | `#a6a6a6` |
| `border-neutralGrey-hover` | `#797979` |
| `border-neutralGrey-readOnly` | `#797979` |

### Neutral Blue
| Token | Hex |
|---|---|
| `border-neutralBlue-default` | `#99cdff` |
| `border-neutralBlue-hover` | `#61acff` |
| `border-neutralBlue-pressed` | `#aed7ff` |
| `border-neutralBlue-active` | `#0183ff` |
| `border-neutralBlue-activeHover` | `#0052c5` |
| `border-neutralBlue-disabled` | `#d0ebff` |

### Neutral White
| Token | Hex |
|---|---|
| `border-neutralWhite-default` | `#ffffff` |

### Feedback
| Token | Hex |
|---|---|
| `border-feedback-successMid` | `#99dab9` |
| `border-feedback-successLow` | `#e5f6ee` |
| `border-feedback-errorHigh` | `#ff2323` |
| `border-feedback-errorMid` | `#ffa7a7` |
| `border-feedback-errorLow` | `#ffe9e9` |
| `border-feedback-warningMid` | `#ffdf9e` |
| `border-feedback-warningLow` | `#fff7e5` |
| `border-feedback-infoHigh` | `#0183ff` |
| `border-feedback-infoMid` | `#8bc1ff` |
| `border-feedback-infoLow` | `#d0ebff` |

---

## Color Tokens — Text & Icon

Text and icon tokens follow the same namespace pattern: `text-*` and `icon-*`. All fills must use semantic alias tokens — never raw hex. Key semantic groups:

| Namespace | Use |
|---|---|
| `text-neutral-*` | Standard text: label, body, disabled, negative, readOnly |
| `text-feedback-*` | Error, warning, success, info states |
| `text-primary-*` | Primary brand text |
| `icon-neutral-*` | Standard icons: default, disabled, negative |
| `icon-feedback-*` | State icons |

**Rule:** Any text node using a raw hex fill (no `text/*` token binding) is a violation, even if the hex visually matches an SDS color.

---

## Spacing & Grid

### 4px Grid Rule
- All `x`, `y`, `width`, `height`, `padding`, `gap` values must be **multiples of 4**
- **Border widths exempt:** 1px and 2px borders are allowed
- **Sub-pixel = always a violation:** fractional positions like `x=172.640625` — no exceptions
- `Spacing/6` (6px) and `Spacing/10` (10px) exist in SDS — valid **only when used via token reference**, not as raw values

### Off-Grid Values to Flag
6, 10 (raw), 11, 17, 18, 27, 30, 35, 59, 63, 65, 97px — flag if raw, not token-bound

### On-Grid Values (safe)
4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48px and multiples of 4

---

## Page Layout

### Breakpoints

| Name | Range | Canvas size | Target devices |
|---|---|---|---|
| Small | 0–720px | 375px (iOS) | Smartphones |
| Medium | 721–1024px | 768px | Tablets |
| Large | 1025–1440px | 1366px | Desktops |
| Extra Large | 1441px+ | 1440px+ | Large monitors |

### Grid Specs

| Breakpoint | Columns | Gutter | Margin |
|---|---|---|---|
| Small (≤720px) | 4 | 16px | 16px |
| Medium (721–1024px) | 8 | 16px | 24px |
| Large (1025–1366px) | 12 | 16px | 104px offset left-aligned |
| Extra Large (1441px+) | 12 | 16px | 24px+ |

### Page Structure (desktop 1366px)
| Zone | Size |
|---|---|
| Header | 60px height, full width |
| Left Navigation | 72px wide, collapsed state |
| Content area x-offset | 104px from left (72px nav + 32px margin) |
| Right margin at 1366px | 30px — asymmetric with left 32px, **intentional** |

### Column Layouts (Large / 1366px)
- Full-width: 12 columns
- Two-pane: 6+6, 9+3, 3+9, 7+3
- Three-pane: 2+7+3
- All layouts must include **at least one flexible pane** — two fixed-width panes is a violation

---

## Border Radius

| Token | Value | Use |
|---|---|---|
| `Radius/2` / `border-radius-2` | 2px | Small buttons only |
| `Radius/4` / `border-radius-4` | 4px | Default/Medium buttons, inputs, dropdowns |
| `border-radius-8` | 8px | Dropdown list bottom corners when open |
| `Radius/999` / `border-radius-full` | 999px (pill) | Badges, search input |
| `cornerRadius.24` / `border-radius-24` | 24px | Badge border radius |

---

## Components — Full Catalog

**SDS file key:** `EIr5CEfAzgj6zaOS1aDuWV`
All component instances must have `mainComponent.fileKey === 'EIr5CEfAzgj6zaOS1aDuWV'`

### Foundations
| Component | node-id | Figma |
|---|---|---|
| Colours | `6659-2` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6659-2) |
| Typography | `6673-7263` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-7263) |
| Radius, Spacing, Shadows | `6673-12402` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-12402) |
| Page Layout | `24971-41438` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=24971-41438) |
| Page Background | `6673-45117` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-45117) |
| Themes | `14919-209480` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=14919-209480) |
| Tree View | `9220-40869` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=9220-40869) |

### Form Components
| Component | node-id | Figma | Key specs |
|---|---|---|---|
| Text Field | `6673-122481` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-122481) | Height: 32px default, 40px large |
| Text Area | `7796-4378` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=7796-4378) | |
| Checkbox | `6673-119569` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-119569) | |
| Radio | `6673-118222` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-118222) | |
| Toggle | `6673-121156` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-121156) | |
| Slider | `6673-142790` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-142790) | |
| Segmented Control | `6673-93780` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-93780) | Height: 32px |
| Time & Date Picker | `6673-133139` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-133139) | |
| Rich Text Editor | `8015-3169` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8015-3169) | |
| Notification | `6673-136547` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-136547) | |
| Document Viewer | `26561-22015` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=26561-22015) | |
| Pill | `6673-45126` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-45126) | |

### Interactive / Action Components
| Component | node-id | Figma | Key specs |
|---|---|---|---|
| Buttons | `6673-111632` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-111632) | Default: 4px radius; Small: 2px radius |
| Approve Reject Buttons | `35719-102560` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=35719-102560) | |
| Dropdown | `6673-124174` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-124174) | |
| Filter | `39768-24423` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=39768-24423) | |
| Contextual Menu | `7654-9190` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=7654-9190) | |
| Scroll Bar | `22826-66250` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=22826-66250) | |
| Blanket | `6673-103979` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-103979) | |
| Avatar | `6673-135192` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-135192) | |
| Carousel | `14919-45983` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=14919-45983) | |
| Divider | `6673-101945` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-101945) | |

### Feedback Components
| Component | node-id | Figma | Key specs |
|---|---|---|---|
| Badge | `6673-55779` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-55779) | Pill shape, `Radius/999`; see Badge spec below |
| Toast | `6673-141520` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-141520) | |
| Alerts | `6673-139259` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-139259) | |
| Status Tag | `6673-105429` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-105429) | Left-border-only style |
| Tooltip | `6673-99568` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-99568) | |
| Progress Bar / Circle | `6673-106906` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-106906) | |
| Loader | `6673-139258` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-139258) | |
| Error Framework | `8075-14378` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8075-14378) | |

### Navigation Components
| Component | node-id | Figma | Key specs |
|---|---|---|---|
| Global Header | `14919-151837` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=14919-151837) | 60px height |
| Global Search | `16424-23138` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=16424-23138) | Pill shape, 40px height |
| Breadcrumb | `6673-116087` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-116087) | |
| Stepper | `6673-142791` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-142791) | |
| Pagination | `27598-8536` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=27598-8536) | |
| Table | `26561-286370` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=26561-286370) | |

### Layout Components
| Component | node-id | Figma | Key specs |
|---|---|---|---|
| Modal | `7727-16658` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=7727-16658) | |
| Panel - Right | `6673-138474` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-138474) | |
| Bottom Sheet | `23665-50719` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=23665-50719) | |
| Accordion | `14862-34761` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=14862-34761) | |
| Popover | `8970-12959` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8970-12959) | |
| Page Header | `31375-9093` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=31375-9093) | |
| Content | `26561-277553` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=26561-277553) | |
| Timeline | `8718-11985` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8718-11985) | |
| Comment | `26560-3899` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=26560-3899) | |
| Label | `26630-3657` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=26630-3657) | |

### Data Input / Survey Components
| Component | node-id | Figma |
|---|---|---|
| NPS | `8175-21601` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8175-21601) |
| Rating | `8064-16930` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8064-16930) |
| Rank Order | `8316-31987` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8316-31987) |
| Scale Mapping | `6673-69410` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=6673-69410) |
| Preset Dropdown | `11691-6092` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=11691-6092) |
| Signature | `8175-16219` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8175-16219) |
| System Attributes (Array) | `11354-31699` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=11354-31699) |
| Chat Edit | `10287-37538` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=10287-37538) |
| Consent | `8333-116852` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=8333-116852) |
| Forms Layout Guidelines | `9645-45359` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=9645-45359) |

### ⚠️ Unidentified Node IDs
These node IDs need to be opened in Figma to determine what component they represent:

| node-id | Figma |
|---|---|
| `26070-26907` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=26070-26907) |
| `40499-9490` | [Open](https://www.figma.com/design/EIr5CEfAzgj6zaOS1aDuWV/Sapien-Design-System?node-id=40499-9490) |

---

## Component Specs

### Badge
| Attribute | Standard Badge | Count Badge |
|---|---|---|
| display | `inline-flex; align-items: center; justify-content: center` | `inline-flex; align-items: center; justify-content: center` |
| height | `size.24` (24px) — use `min-height: 24px` in CSS | `size.14` (14px) |
| min-width | `size.24` | `size.14` |
| border-radius | `cornerRadius.24` (24px) — pill | `cornerRadius.24` |
| padding H | `padding.8` (0 8px) | `padding.4` |
| gap | `gap.4` | `gap.2` |
| typography | **`body.s.book`** (12px / 300 / 16px lh) | **`caption.medium`** (10px / 500 / 14px lh) — COUNT ONLY |
| fill (neutral) | `bg.neutralGrey.light3` | `bg.feedback.errorHigh` |
| fill (info) | `bg.neutralBlue.default` | — |
| fill (success) | `bg.feedback.successLow` | — |
| fill (error) | `bg.feedback.errorLow` | — |
| fill (disabled) | `bg.neutralGrey.disabled` | — |
| text color | `text.neutral.label` | `text.neutral.negative` |
| border | `icon.neutral.default` | `border.primary.negative` |

> **SCSS implementation:**
> ```scss
> display: inline-flex;
> align-items: center;
> justify-content: center;
> min-height: 24px;
> padding: 0 var(--sds-padding-8);
> border-radius: var(--sds-border-radius-24); // 24px pill
> @include sds.sds-body-s-book; // NOT body-m-medium, NOT caption-medium
> ```
> `caption.medium` is **exclusively** for Count Badge (the small numeric dot). All other badge variants use `body.s.book`.

**Flap Badge:** uses `gl_colors.pop.yellow.500` directly — approved exception (no semantic alias exists for this yellow).

**Badge content rules:**
- Title Case (AP Style) — prepositions lowercase ("On Leave", "Out of Office")
- Max 20 characters — longer is 🟡 Medium violation
- No truncation, no wrapping — always single-line
- Nouns/noun phrases only — no verb phrases ("Full Time" not "Works Full Time")
- No leading zeros ("9" not "09")

**Badge vs Status Tag:**
- Badge → categorisation labels, skill tags, job types, numeric counts
- Status Tag → workflow states ONLY (Draft, Approved, Pending) — `node-id=6673-105429`
- **Alert** → informational/contextual callouts (formula explanations, hints, warnings)

### Avatar
| Size token | Pixels | Use case |
|---|---|---|
| `size.xs` | 16px | Dense tables |
| `size.s` | 24px | Inline mentions |
| `size.m` | 32px | Standard cards/lists |
| `size.l` | 40px | Profile sections |
| `size.xl` | 48px | Page headers |
| `size.xxl` | 72px+ | Profile pages |

**Avatar group (AvatarPile):**
- Overlap: `-2px` between adjacent avatars
- All avatars in the same group must be the same size — mixing sizes is 🟡 Medium
- Overflow: grey pill (`bg.neutralGrey.default`) at 4–5 visible max
- Fallback (no image): gradient `linear-gradient(135deg, #0183ff 0%, #0052c5 100%)` with white initials — never solid grey

### Buttons
- Default/Medium → `Radius/4` (4px)
- Small → `Radius/2` (2px)
- Tertiary → transparent fill (NOT white)
- Disabled → explicit tokens (`bg/primary/disabled` + `text/neutral/disabled`), never opacity reduction
- AI Button → must be SDS AI Button component, not custom button with AI icon
- **Primary CTA color is always charcoal** (`bg-primary-active` = `#202020`), never blue

#### ⛔ No Disabled Primary CTAs
SDS does **not** use disabled primary buttons in forms. Instead:
1. Keep the primary CTA always active (charcoal).
2. On click with invalid form state, show the **Error Framework** (`node-id=8075-14378`) alert at the top of the form.
3. Auto-clear the error alert on any subsequent input change.

This pattern is intentional — it removes the UX ambiguity of a greyed-out button and replaces it with explicit, actionable error messaging.

### Segmented Control (`node-id=6673-93780`)
| Attribute | Value |
|---|---|
| height | 32px |
| border-radius | `border-radius-4` (4px) — outer group |
| width | **`fit-content`** — never stretch to full width |
| active segment bg | `bg-primary-active` (charcoal `#202020`) — **NOT blue** |
| active segment text | `bg-neutralWhite-default` (#ffffff) |
| inactive segment bg | `bg-neutralWhite-default` |
| inactive segment text | `text-neutral-label` |
| typography | `body.m.medium` (14px / 500) |
| padding | `0 padding-12` per segment |
| separator | 1px `border-primary-default` between segments |

> **Critical:** The active segment must be charcoal. Any blue-tinted active state (e.g., from browser `outline` or `-webkit-tap-highlight-color`) is a defect.
>
> **SCSS:**
> ```scss
> .toggle-group {
>   display: flex;
>   width: fit-content; // REQUIRED — prevents full-width stretch
>   height: 32px;
>   border: 1px solid var(--sds-border-primary-default);
>   border-radius: var(--sds-border-radius-4);
>   overflow: hidden;
> }
> .toggle-option {
>   outline: none;
>   -webkit-tap-highlight-color: transparent;
>   &.is-active {
>     background: var(--sds-bg-primary-active);
>     color: var(--sds-bg-neutralWhite-default);
>   }
> }
> ```

### Dropdown (`node-id=6673-124174`)
#### Geometry — Closed state
- Trigger: `height: 32px`, `border: 1px solid border-primary-default`, `border-radius: border-radius-4`
- Focus/open indicator: `border-color: border-neutralBlue-active`, `box-shadow: 0 0 0 1px border-neutralBlue-active`

#### Geometry — Open state
| Part | CSS |
|---|---|
| Trigger | `border-radius: 4px 4px 0 0` (top corners only) |
| Trigger border | `border-color: border-neutralBlue-active`; `box-shadow: 0 0 0 1px border-neutralBlue-active` |
| List `top` | `top: 100%` — flush, zero gap |
| List `border-top` | `none` — prevents visible double border with trigger |
| List `border-radius` | `0 0 8px 8px` — bottom corners only |
| List `box-shadow` | `0 8px 8px rgba(32,32,32,0.16)` |
| List `border` | `1px solid border-neutralBlue-active` (sides + bottom) |

#### Selected option
- Selected option row: `display: flex; align-items: center; justify-content: space-between; gap: gap-8`
- Check icon: shown only on selected row, color `text-neutralBlue-active` (blue `#0183ff`)
- Check icon hidden on non-selected rows (`display: none`)

### Alert (`node-id=6673-139259`)
SDS Alert is a full-border informational/feedback box. Use it for contextual callouts, formula notes, form-level errors, etc.

#### Structure
```html
<div class="alert" role="note">
  <svg class="alert-icon" width="16" height="16" aria-hidden="true"><!-- icon SVG --></svg>
  <p class="alert-body">
    <strong>Label:</strong> Description text.
  </p>
</div>
```

#### Variants (Figma `node-id=21380-22965`)
All variants use feedback-Low (background) + feedback-Mid (border) token pairs. Body text and chrome are identical across variants — only background and border-color change.

| Variant | Background | Border | Mixin | Icon |
|---|---|---|---|---|
| Info | `bg-feedback-infoLow` (`#d0ebff`) | `border-feedback-infoMid` (`#8bc1ff`) | `sds-alert-info` | Blue circle "i" |
| Warning | `bg-feedback-warningLow` (`#fff7e5`) | `border-feedback-warningMid` (`#ffdf9e`) | `sds-alert-warning` | Amber triangle "!" |
| Success | `bg-feedback-successLow` (`#e5f6ee`) | `border-feedback-successMid` (`#99dab9`) | `sds-alert-success` | Green circle "✓" |
| Error | `bg-feedback-errorLow` (`#ffe9e9`) | `border-feedback-errorMid` (`#ffa7a7`) | `sds-alert-error` | Red circle "×" |
| Neutral | `border-neutralGrey-light2` (`#e9e9e9`) | `border-neutralGrey-light2` (`#e9e9e9`) | `sds-alert-neutral` | Grey "i" |

> Earlier drafts of this doc paired Alert Info with `bg-neutralBlue-default` (#d9efff) and Error with `border-feedback-errorHigh` (#ff2323). Both are wrong — the Figma SDS Alert component uses the feedback-Low / feedback-Mid pairing above.

#### Common CSS (all variants — `sds-alert-base`)
```scss
display: flex;
align-items: flex-start;
gap: var(--sds-gap-8);
padding: var(--sds-padding-12);
border: 1px solid;            // color set by variant mixin
border-radius: var(--sds-border-radius-4);
@include sds-body-s-book;     // 12px / Book
color: var(--sds-text-neutral-body);
margin: 0;
```

Variant mixins (`sds-alert-info`, `-warning`, `-success`, `-error`, `-neutral`) each `@include sds-alert-base` and override only `background` + `border-color`.

> **Do NOT use Status Tag (`node-id=6673-105429`) for informational callouts.** Status Tag is left-border-only style exclusively for workflow state labels (Draft / Approved / Pending).

### Error Framework (`node-id=8075-14378`)
The SDS Error Framework is shown at the **top of a panel or form** when the user tries to submit with invalid data. It replaces the disabled-CTA pattern.

#### Structure
```html
<div class="error-alert" role="alert" aria-live="assertive">
  <svg class="error-alert-icon" ...><!-- red × icon --></svg>
  <div class="error-alert-body">
    <p class="error-alert-title">N errors need fixing to proceed.</p>
    <ul class="error-alert-list">
      <li>Error description 1</li>
      <li>Error description 2</li>
    </ul>
    <!-- "Show More" only when > 3 errors -->
    <button class="error-alert-show-more">Show 2 more</button>
  </div>
  <button class="error-alert-close" aria-label="Dismiss errors"><!-- × --></button>
</div>
```

#### Behaviour
- Alert appears on submit-attempt with invalid fields (never on page load)
- Auto-dismisses on any input change (`tick()` called on every form event)
- List collapses to 3 items; "Show N more" expands all
- Dismiss (×) button hides the alert manually
- Uses same CSS as Alert error variant (see above)

#### Title format
- 1 error: `"1 error needs fixing to proceed."`
- N errors: `"N errors need fixing to proceed."`

### Status Tag (`node-id=6673-105429`)
Left-border-only style. **Workflow states only** — not for informational callouts.

```scss
background:    var(--sds-bg-neutralGrey-light1);
border-left:   3px solid var(--sds-border-neutralBlue-active);
border-radius: 0 var(--sds-border-radius-2) var(--sds-border-radius-2) 0;
padding:       var(--sds-padding-8) var(--sds-padding-12);
@include sds-body-s-book;
color: var(--sds-text-neutral-ghost);
```

Valid uses: Draft, Approved, Pending, Rejected, In Review.
**Not valid for:** formula explanations, hints, help text, section descriptions — use Alert instead.

### Form Field Labels
Form field labels use **`body.s.book`** (12px / weight 300 / 16px line-height). NOT `body.m.medium`.

```scss
@mixin sds-label {
  @include sds-body-s-book; // 12px Book
  color: var(--sds-text-neutral-label);
}
```

Required field asterisk: `color: var(--sds-text-feedback-error)` appended as ` *`.

### Helper Text & Error Text
Field helper text and field-level error messages share typography (`body.s.book`) and differ only in color:

| Variant | Mixin | Color |
|---|---|---|
| Helper | `sds-helper-text` | `text-neutral-ghost` |
| Error | `sds-error-text` | `text-feedback-error` |

### Section Label (panel sub-headers)
Use for uppercase mini-headers inside right-panels (e.g., "FIELD MAPPING", "FORMULA").

```scss
@mixin sds-section-label {
  @include sds-body-s-medium;          // 12px Medium
  color:          var(--sds-text-neutral-ghost);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

### Form Field Wrapper
Standard wrapper for label + control + helper/error stack:

```scss
@mixin sds-form-field {
  display:        flex;
  flex-direction: column;
  gap:            var(--sds-gap-4);
}
```

### Form Controls (Input / Select)

#### Input — Default (32px)
```scss
@mixin sds-input-base {
  height:        32px;
  padding:       0 var(--sds-padding-8);
  border:        1px solid var(--sds-border-primary-default);
  border-radius: var(--sds-border-radius-4);
  background:    var(--sds-bg-neutralWhite-default);
  color:         var(--sds-text-neutral-body);
  @include sds-body-m-book;            // 14px Book

  &:hover:not(:disabled):not(.is-invalid)  { border-color: var(--sds-border-neutralGrey-hover); }
  &:focus:not(.is-invalid) {
    border-color: var(--sds-border-neutralBlue-active);
    box-shadow:   0 0 0 1px var(--sds-border-neutralBlue-active);
  }
  &.is-invalid { border-color: var(--sds-border-feedback-errorHigh); }
  &:disabled {
    background:   var(--sds-bg-primary-disabled);
    border-color: var(--sds-border-primary-disabled);
    color:        var(--sds-text-neutral-disabled);
  }
  &::placeholder { color: var(--sds-text-neutral-ghost); }
}
```

#### Input — Large (40px)
`@include sds-input-large` — same as base but `height: 40px`.

#### Select (Native `<select>` styled)
`@include sds-select-base` — extends `sds-input-base` with chevron SVG background, `padding-right: 28px`, `appearance: none`.

> The chevron is an inline SVG data URI (`#4D4D4D`); on focus, the trigger gets the same blue border + `box-shadow` as a focused input.

### Buttons (mixins)

#### Primary
```scss
@mixin sds-btn-primary {
  height:        32px;
  padding:       0 var(--sds-padding-16);
  border:        none;
  border-radius: var(--sds-border-radius-4);
  background:    var(--sds-bg-primary-active);   // charcoal
  color:         var(--sds-bg-neutralWhite-default);
  @include sds-body-m-medium;
  &:hover:not(:disabled) { background: var(--sds-bg-primary-hover); }
  &:disabled {
    background: var(--sds-bg-primary-disabled);
    color:      var(--sds-text-neutral-disabled);
  }
}
```

#### Secondary
```scss
@mixin sds-btn-secondary {
  height:        32px;
  padding:       0 var(--sds-padding-16);
  border:        1px solid var(--sds-border-primary-default);
  border-radius: var(--sds-border-radius-4);
  background:    var(--sds-bg-neutralWhite-default);
  color:         var(--sds-text-neutral-label);
  @include sds-body-m-medium;
  &:hover:not(:disabled) {
    background:   var(--sds-bg-neutralGrey-hover);
    border-color: var(--sds-border-neutralGrey-hover);
  }
}
```

> Per the **No Disabled CTAs** rule, the `:disabled` block on the primary mixin should rarely be triggered in production — keep the CTA active and use the Error Framework for invalid form state.

### Tooltip (`node-id=6673-99568`)
Charcoal-bg dark tooltip used as a hover/focus hint on info icons or other compact triggers.

| Attribute | Value |
|---|---|
| position | `absolute`, `bottom: calc(100% + gap-8)` (above trigger) |
| transform | `translateX(-50%)` (centered horizontally) |
| background | `bg-primary-active` (#202020) |
| color | `bg-neutralWhite-default` (#ffffff) |
| typography | `body.s.book` (12px / 300) |
| padding | `padding-8 padding-12` (8px 12px) |
| border-radius | `border-radius-4` |
| max-width | 240px |
| min-width | 160px |
| z-index | 400 |
| opacity transition | `0.15s ease` |
| `pointer-events` | `none` (tooltip itself is non-interactive) |

#### Trigger pattern
- Wrap the trigger + tooltip in `position: relative` (`sds-tooltip-wrapper` mixin)
- Use `aria-describedby` on the trigger pointing to the tooltip's `id`
- Use `role="tooltip"` on the tooltip element
- Toggle visibility via `opacity: 0 → 1` on hover/focus (not `display`) so the transition can run

#### Info icon trigger
The companion `sds-info-icon` mixin provides the standard info-icon styling (`color: icon-neutral-default`, hover `icon-neutral-hover`).

### Panel — Right (`node-id=6673-138474`)
Slide-in right panel used for forms, configuration, or detail views.

```scss
@mixin sds-panel-right {
  position:   fixed;
  top:        0;
  right:      0;
  height:     100vh;
  width:      480px;          // standard SDS right-panel width
  max-width:  100vw;
  background: var(--sds-bg-neutralWhite-default);
  box-shadow: -4px 0 24px rgba(32, 32, 32, 0.12);
  display:    flex;
  flex-direction: column;
  z-index:    1000;
}
```

### Divider
```scss
@mixin sds-divider-h {
  border:     none;
  border-top: 1px solid var(--sds-border-neutralGrey-light2);
  margin:     var(--sds-margin-0);
}
```

### Search Input
- Shape: `Radius/999` (pill)
- Height: 40px

---

## Engineering Implementation Notes

### `_sds-tokens.scss` Mixin Additions (session 2026-04-28)
The following mixins were **added** to `src/styles/_sds-tokens.scss` and are available for all Angular components:

| Mixin | Usage |
|---|---|
| `@include sds.sds-alert-base` | Shared chrome (layout, padding, radius, body text). Variant mixins all extend this. |
| `@include sds.sds-alert-info` | Info callout — `bg-feedback-infoLow` + `border-feedback-infoMid` |
| `@include sds.sds-alert-warning` | Warning callout — `bg-feedback-warningLow` + `border-feedback-warningMid` |
| `@include sds.sds-alert-success` | Success callout — `bg-feedback-successLow` + `border-feedback-successMid` |
| `@include sds.sds-alert-error` | Error callout — `bg-feedback-errorLow` + `border-feedback-errorMid` |
| `@include sds.sds-alert-neutral` | Neutral callout — `border-neutralGrey-light2` (#e9e9e9) for both bg and border |
| `sds-toggle-group` | Now includes `width: fit-content` |
| `sds-toggle-option` | Now includes `outline: none; -webkit-tap-highlight-color: transparent` |

Any component needing an informational callout must use `sds-alert-info` — **not** `sds-status-tag-info`.

### Segmented Control — Specificity Override Required
Even though `sds-toggle-option` sets `&.is-active { background: var(--sds-bg-primary-active) }`, browser button `:active`, `:focus`, `:focus-visible`, and `-webkit-tap-highlight-color` can override it in Chromium. Components that render segmented controls must **re-declare the active state at component scope, chained across pseudo-classes**:

```scss
// In the component's .scss file — not just relying on the mixin:
.your-toggle-option {
  @include sds.sds-toggle-option;

  // Chain pseudo-classes to defeat browser default specificity
  &.is-active,
  &.is-active:active,
  &.is-active:focus,
  &.is-active:focus-visible {
    background: var(--sds-bg-primary-active);
    color:      var(--sds-bg-neutralWhite-default);
  }
}
```

Reference implementation: `src/app/reports-builder/calculated-fields/components/shared/time-operand/time-operand.component.scss`.

The reason chaining is required: when a `<button>` is the active segment, clicking it triggers `:active` which the browser styles with its UA stylesheet at higher specificity than a plain class selector. Without the chain, the active segment briefly flashes blue/grey on click.

### Custom Dropdown Overlay Pattern
The SDS custom dropdown is a JavaScript overlay over a native `<select>`. The `upgradeSelects(root)` function wraps each `<select>` with:
- A trigger `div.sds-dropdown-trigger` (shows current value + chevron)
- A list `ul.sds-dropdown-list` (positioned absolutely, hidden by default)
- Keyboard and click handlers that sync selected state back to the underlying `<select`

All the dropdown geometry rules (trigger open `border-radius: 4px 4px 0 0`, list `0 0 8px 8px`, `border-top: none`, `top: 100%`) apply to this overlay — NOT to the native `<select>` element itself.

### ⏳ Dev Pickup — Error Framework in Angular
The Error Framework (no-disabled-CTA pattern) was implemented in `calculated-fields-preview.html` but **has NOT yet been added to the Angular component**. The following needs to be implemented in `src/app/reports-builder/calculated-fields/`:

1. Error alert markup at the top of the panel body (see Error Framework spec above)
2. `getValidationErrors(): string[]` — collects field-level validation errors into human-readable strings
3. `showErrorAlert(errors: string[])` — renders title, list (collapsed to 3, "Show N more" button), dismiss ×
4. `onSave()` — checks `getValidationErrors()` before proceeding; shows alert if non-empty
5. Input change handler that clears the alert (`closeErrorAlert()`) on any form value change

### ⏳ Dev Pickup — Dropdown Geometry Mixin
The dropdown overlay geometry (`sds-dropdown-trigger`, `sds-dropdown-trigger.is-open`, `sds-dropdown-list`, `sds-dropdown-option`, `sds-dropdown-option.is-selected`) is currently inlined in `calculated-fields-preview.html` `<style>`. **It should be extracted into `_sds-tokens.scss` as mixins** (`sds-dropdown-trigger`, `sds-dropdown-list`, `sds-dropdown-option`) so every Angular component using `upgradeSelects()` shares the same geometry.

Required CSS rules (verbatim):
```scss
@mixin sds-dropdown-list {
  position:      absolute;
  top:           100%;                // flush — zero gap
  left:          0;
  right:         0;
  border:        1px solid var(--sds-border-neutralBlue-active);
  border-top:    none;                // prevent double border with trigger
  border-radius: 0 0 var(--sds-border-radius-8) var(--sds-border-radius-8);
  background:    var(--sds-bg-neutralWhite-default);
  box-shadow:    0 8px 8px rgba(32, 32, 32, 0.16);
  max-height:    240px;
  overflow-y:    auto;
  z-index:       500;
}
```

### ⏳ Dev Pickup — Custom Status / Custom Color Tokens in Figma
The `bg-customStatus-*` (45 tokens) and `border-customStatus-*` namespaces are fully implemented in engineering JSON but not documented in the Figma reference. Designs that use custom status palettes (e.g., for HR workflow tags) currently have no Figma source-of-truth.

### Override Patterns — Cheat Sheet
A consolidated list of every override pattern discovered in this project so future authors don't rediscover them:

| Pattern | Why | Where applied |
|---|---|---|
| Re-declare `&.is-active` chained with `:active`/`:focus`/`:focus-visible` | Browser button UA stylesheet beats class-only specificity | Segmented control component scope |
| `outline: none; -webkit-tap-highlight-color: transparent` on `<button>` | Removes blue focus ring + grey tap flash | `sds-toggle-option` mixin |
| Dropdown list `border-top: none` + `top: 100%` | Avoids double-border seam between trigger and list | Dropdown overlay CSS |
| `width: fit-content` on flex toggle group | Prevents segmented control from stretching to fill parent | `sds-toggle-group` mixin |
| Replace `sds-status-tag-info` with `sds-alert-info` | Status Tag is workflow-state-only, not informational | All formula notes / contextual callouts |
| Always-active primary CTA + Error Framework | Replaces disabled-CTA pattern | Form panels (Goals, Calculated Fields, etc.) |

---

## SCSS Mixin Catalog

Source file: `src/styles/_sds-tokens.scss`. All mixins are imported via `@use 'src/styles/sds-tokens' as sds;` and called as `@include sds.<mixin-name>`.

### Typography
| Mixin | Resolves to |
|---|---|
| `sds-body-m-medium` | 14px / 500 / 18px |
| `sds-body-m-book` | 14px / 300 / 18px |
| `sds-body-s-medium` | 12px / 500 / 16px |
| `sds-body-s-book` | 12px / 300 / 16px |
| `sds-title-xxs-bold` | 16px / 700 / 20px |
| `sds-title-xxs-medium` | 16px / 500 / 20px |
| `sds-caption-medium` | 10px / 500 / 14px (Count Badge only) |

### Form & Field
| Mixin | Use |
|---|---|
| `sds-form-field` | Wrapper: column flex, gap-4 |
| `sds-label` | Field label (body-s-book, neutral-label) |
| `sds-label-required::after` | Adds " *" with error color |
| `sds-helper-text` | Helper text below field |
| `sds-error-text` | Field-level error text |
| `sds-section-label` | Uppercase mini-header inside panels |
| `sds-input-base` | 32px input |
| `sds-input-large` | 40px input |
| `sds-select-base` | 32px select with chevron |

### Buttons
| Mixin | Use |
|---|---|
| `sds-btn-primary` | Charcoal CTA |
| `sds-btn-secondary` | Outlined secondary |

### Toggle / Segmented Control
| Mixin | Use |
|---|---|
| `sds-toggle-group` | Outer container (`width: fit-content`, 32px tall) |
| `sds-toggle-option` | Inner segment button (with override-friendly `outline: none`) |

### Feedback
| Mixin | Use |
|---|---|
| `sds-alert-base` | Shared chrome for all alert variants (do not use directly — call a variant) |
| `sds-alert-info` | Info callout — `bg-feedback-infoLow` + `border-feedback-infoMid` |
| `sds-alert-warning` | Warning callout — `bg-feedback-warningLow` + `border-feedback-warningMid` |
| `sds-alert-success` | Success callout — `bg-feedback-successLow` + `border-feedback-successMid` |
| `sds-alert-error` | Error callout — `bg-feedback-errorLow` + `border-feedback-errorMid` |
| `sds-alert-neutral` | Neutral callout — `border-neutralGrey-light2` (#e9e9e9) for both bg and border |
| `sds-status-tag-info` | Workflow state tag (left-border-only) — DO NOT use for info content |

### Tooltip / Info Icon
| Mixin | Use |
|---|---|
| `sds-tooltip-wrapper` | `position: relative` wrapper for trigger + tooltip |
| `sds-tooltip` | The dark tooltip itself (charcoal bg, 240px max-width) |
| `sds-info-icon` | Standard info-icon styling for tooltip triggers |

### Layout
| Mixin | Use |
|---|---|
| `sds-divider-h` | Horizontal hairline divider |
| `sds-panel-right` | Slide-in right panel (480px wide) |

### Font faces
`@font-face` declarations for **DarwinSans** (Book/300, Medium/500, Bold/700) load from `src/assets/fonts/DarwinSans-{Book,Medium,Bold}.otf` — already declared in `_sds-tokens.scss`.

---

## Alert — Variant Figma References

For pixel-precise variant inspection, drill into these specific Figma node IDs (from parent `6673-139259`):

| Variant | Node ID | Notes |
|---|---|---|
| Info / Small | `22888-45529` | Compact info alert |
| Info / Medium | `22888-45495` | Standard info alert |

> Avoid `get_metadata` on the parent Alert node (`6673-139259`) — the response exceeds 145k characters. Use child node IDs above for focused screenshots, or use `jq` against a saved metadata dump.

---

## Banned / Legacy Tokens

These namespaces are from the legacy DB Component Library 2024 — any usage is an automatic violation:

| Namespace | Example | Status |
|---|---|---|
| `--greyscale/*` | `--greyscale/text/body` | ❌ Banned |
| `--colours/cobaltblue/*` | `--colours/cobaltblue/500` | ❌ Banned |
| `--colours/gunmetal/*` | `--colours/gunmetal/300` | ❌ Banned |
| `--themeillustration/*` | `--themeillustration/primary` | ❌ Banned |

**`gl_colors/*` primitives** — NOT banned, but must only appear as the *resolved value* of an alias token. Using `gl_colors-brand-charcoal-500` directly on a component fill is a violation.

**Exceptions (approved direct primitive use):**
- Flap Badge Primary variant → `gl_colors.pop.yellow.500` (no semantic alias exists)
- Avatar gradient → `linear-gradient(135deg, #0183ff 0%, #0052c5 100%)` (hardcoded, approved)
- AI gradient → `linear-gradient(90deg, #2c00a0, #7440f0, #ae79ff)` — ❌ NOT an SDS token, flag it

**`#000000`** → never use; use `bg-neutralCharcoal-default` or `bg-primary-full` instead

---

## Audit Rules Quick Reference

### Provenance checks (programmatic — always required)
| Check | Signal | Severity |
|---|---|---|
| Fill with null `boundVariables` | Manual hex entry | 🔴 Critical |
| Text with null `textStyleId` | Raw typography | 🟠 High |
| Component where `mainComponent.fileKey !== 'EIr5CEfAzgj6zaOS1aDuWV'` | Custom rebuild | 🔴 Critical |
| Fractional x/y position (e.g. `172.640625`) | Sub-pixel | 🔴 Critical |
| Local PNG/raster icon | Not SVG from SDS | 🟠 High |

### Token format separator equivalence — never flag
`--sds-bg-neutralBlue-light1` = `--sds/bg/neutralBlue/light1` = `sds:bg:neutralBlue:light1`

All `-`, `/`, `:` separator variations of the same token name are identical.

### Severity scale
| Level | Meaning | Action |
|---|---|---|
| 🔴 Critical | Breaks compliance, user-facing impact | Fix before any review |
| 🟠 High | Clearly wrong, must fix before sign-off | Fix before design review |
| 🟡 Medium | Noticeable on inspection | Fix in next pass |
| 🔵 Low | Cosmetic, minor | Fix in cleanup |

---

## Design ↔ Engineering Token Discrepancies

**Source of truth:** Engineering JSON files (`tokens-meta.json`, `themes-meta.json`, `sds-icons.meta.json`, `sds-illustrations.meta.json`)
**Last audited:** 2026-04-28

**Legend:**
- 🔄 **Update in Figma** — token exists in both but Figma name must change to match engineering
- 📋 **Dev to update** — token/component defined in Figma design but absent from engineering JSON (engineer adds it)
- ➕ **Add to Figma** — engineering has this token; Figma reference doc does not document it

---

### Typography

| Figma token | Engineering token | Action | Notes |
|---|---|---|---|
| `font-line-height-*` (all 9) | `--sds-line-height-*` | 🔄 Update in Figma | Drop the `font-` prefix — rename to `line-height-*` |
| `font-line-height-18` | *(absent)* | 📋 Dev to update | Engineering has no `line-height-18` primitive |
| `body-l-book-upper-case` | `body-l-book-uppercase` | 🔄 Update in Figma | Remove hyphen between "upper" and "case" |
| `body-m-book-upper-case` | `body-m-book-uppercase` | 🔄 Update in Figma | Same hyphen fix |
| `body-s-book-upper-case` | `body-s-book-uppercase` | 🔄 Update in Figma | Same hyphen fix |
| `body-s-book-link` | *(absent)* | 📋 Dev to update | Engineering has `body-s-underline` (without "book-") instead |
| `font-weight-light` (marked invalid) | `--sds-font-weight-light` | 📋 Dev to update | Engineering exposes this token; Figma flags Light as banned — align policy |
| *(absent)* | `--sds-font-size-8` | ➕ Add to Figma | Engineering has an 8px size primitive |
| *(absent)* | `--sds-font-size-48` | ➕ Add to Figma | Engineering has a 48px size primitive |
| *(absent)* | `--sds-line-height-12` | ➕ Add to Figma | Engineering has a 12px line-height primitive |
| *(absent)* | `body-s-uppercase`, `body-s-underline` | ➕ Add to Figma | Two body-s variants in engineering with no Figma counterpart |
| *(absent)* | `caption` (base, no weight) | ➕ Add to Figma | Engineering exposes a base `caption` token; Figma only documents `caption-bold` and `caption-medium` |
| *(absent)* | `title-l`, `title-m`, `title-s`, `title-xs` (base) | ➕ Add to Figma | Engineering exposes base variants (font-size + line-height only, no weight) for each title scale |

---

### Color Tokens — Background

| Figma token | Engineering token | Action | Notes |
|---|---|---|---|
| `bg-secondary-lighter` | *(absent)* | 📋 Dev to update | No `bg-secondary-lighter` exists in engineering |
| *(absent)* | `bg-primary-lightest`, `bg-primary-light`, `bg-primary-lighter`, `bg-primary-subtle` | ➕ Add to Figma | 4 primary bg tokens undocumented in Figma |
| *(absent)* | `bg-secondary-hover`, `bg-secondary-ripple`, `bg-secondary-pressed`, `bg-secondary-readOnly`, `bg-secondary-negative` | ➕ Add to Figma | 5 secondary bg tokens undocumented |
| *(absent)* | `bg-neutralGrey-light5`, `light6`, `light7` | ➕ Add to Figma | Figma skips from light4 to light8; engineering has light5–7 |
| *(absent)* | `bg-neutralGrey-hover2`, `bg-neutralGrey-disabled2` | ➕ Add to Figma | Additional grey state variants |
| *(absent)* | `bg-neutralWhite-light1` – `light5`, `hover`, `pressed` | ➕ Add to Figma | Figma documents only `bg-neutralWhite-default` |
| *(absent)* | `bg-overlay-transparent` | ➕ Add to Figma | Figma only documents `bg-overlay-blanket` |
| *(absent)* | `bg-feedback-successLowHover`, `successDisabled`, `errorLowHover`, `errorDisabled`, `warningLowHover`, `warningDisabled`, `infoLowHover`, `infoDisabled` | ➕ Add to Figma | 8 feedback hover/disabled bg states undocumented |
| *(absent)* | `bg-customStatus-*` (45 tokens) | ➕ Add to Figma | Full custom-status palette (blue/turquoise/lime/yellow/orange/vermillion/pink/purple/red/green × Low/LowHover/Mid/High/Deep) entirely absent |
| *(absent)* | `bg-custom-purple`, `bg-custom-purpleDark` | ➕ Add to Figma | Two custom bg tokens undocumented |

---

### Color Tokens — Border

| Figma token | Engineering token | Action | Notes |
|---|---|---|---|
| `border-secondary-lighter` | `border-secondary-light` | 🔄 Update in Figma | Figma adds extra "r" — correct name is `light` not `lighter` |
| `border-secondary-discabled` | `border-secondary-disabled` | 🔄 Update in Figma | Fix typo "discabled" → "disabled" |
| *(absent)* | `border-primary-light` | ➕ Add to Figma | One extra light variant undocumented |
| *(absent)* | `border-neutralGrey-light4`, `pressed`, `active`, `activeHover`, `disabled`, `disabledHover` | ➕ Add to Figma | 6 neutralGrey border tokens undocumented |
| *(absent)* | `border-neutralBlue-light1`, `light2` | ➕ Add to Figma | 2 light variants undocumented |
| *(absent)* | `border-neutralWhite-light1` – `light5`, `hover`, `pressed`, `active` | ➕ Add to Figma | Figma documents only `border-neutralWhite-default` |
| *(absent)* | `border-feedback-successHigh`, `border-feedback-warningHigh` | ➕ Add to Figma | High-severity feedback border variants missing |
| *(absent)* | `border-customStatus-*` (multiple) | ➕ Add to Figma | Custom-status border tokens entirely absent |
| *(absent)* | `border-gradientSearch-hoverBlue`, `hoverPink`, `activeBlue`, `activePink` | ➕ Add to Figma | Gradient search border tokens absent |

---

### Color Tokens — Text & Icon

| Figma token | Engineering token | Action | Notes |
|---|---|---|---|
| `text-primary-*` | *(absent)* | 📋 Dev to update | Figma documents a `text-primary-*` namespace; engineering has no such group |
| `text-feedback-warning` | *(absent)* | 📋 Dev to update | Engineering `text-feedback-*` only has: `negative`, `success`, `error` — no `warning` |
| `text-feedback-info` | *(absent)* | 📋 Dev to update | Same — no `info` in engineering |
| *(absent)* | `text-link-default`, `hover`, `disabled` | ➕ Add to Figma | `text-link-*` namespace not documented in Figma |
| *(absent)* | `text-linkSubtle-default`, `hover`, `disabled` | ➕ Add to Figma | `text-linkSubtle-*` namespace not documented in Figma |
| `icon-neutral-*` (default, disabled, negative only) | `icon-neutral-subtle`, `lighter`, `hover`, `pressed`, `selected` + 3 more | ➕ Add to Figma | Figma docs only 3 of 8 icon-neutral variants |
| *(absent)* | `icon-neutralGrey-*` (8 tokens) | ➕ Add to Figma | Entire `icon-neutralGrey-*` namespace absent |
| *(absent)* | `icon-neutralBlue-default` | ➕ Add to Figma | Not documented |
| *(absent)* | `icon-neutralWhite-light1` – `light4` | ➕ Add to Figma | Not documented |
| *(absent)* | `icon-feedback-active`, `hover`, `activeDisabled`, `activeHover`, `activePressed`, `error`, `success`, `info`, `warning`, `rating` | ➕ Add to Figma | Figma says "state icons" but lists no individual tokens; 10 exist in engineering |

---

### Spacing, Sizing & Radius

| Figma token | Engineering token | Action | Notes |
|---|---|---|---|
| `Radius/2`, `Radius/4` | `border-radius-2`, `border-radius-4` | 🔄 Update in Figma | Rename from `Radius/N` to `border-radius-N` |
| `Radius/999` | `border-radius-full` | 🔄 Update in Figma | Rename to `border-radius-full` |
| `cornerRadius.24` | `border-radius-24` | 🔄 Update in Figma | Rename from dot-notation to `border-radius-24` |
| `Spacing/N` (inline refs) | `gap-N`, `padding-N`, `margin-N` | 🔄 Update in Figma | Figma uses `Spacing/N` notation; engineering uses separate `gap-*`, `padding-*`, `margin-*` namespaces |
| *(absent)* | `border-radius-0`, `6`, `12`, `16`, `20`, `36`, `full` | ➕ Add to Figma | 7 radius tokens undocumented |
| *(absent)* | `border-radius-8` | ➕ Add to Figma | **Confirmed in `src/styles/global.scss`** — used for dropdown list bottom corners when open |
| *(absent)* | `border-radius-24` | ➕ Add to Figma | **Confirmed in `src/styles/global.scss`** — used for badge pill shape |
| *(absent)* | `gap-0` – `gap-48` (23 tokens) | ➕ Add to Figma | Full gap token set absent from doc |
| *(absent)* | `padding-0` – `padding-40` (27 tokens) | ➕ Add to Figma | Full padding token set absent from doc |
| *(absent)* | `margin-0` – `margin-40` + `margin-auto` (28 tokens) | ➕ Add to Figma | Full margin token set absent from doc |
| *(absent)* | `size-2` – `size-120` (21 tokens) | ➕ Add to Figma | Full size (glSize) token set absent from doc |
| *(absent)* | `border-weight-small/default/medium/thick/large/xLarger` | ➕ Add to Figma | Semantic border-weight tokens absent from doc |

---

### SCSS Mixin Additions (2026-04-28)

| Figma component | Engineering mixin | Action | Notes |
|---|---|---|---|
| Alert (`21380-22965`) | `sds-alert-base` | ✅ Added to `_sds-tokens.scss` | Shared chrome (layout, padding, radius, body text) — variant mixins extend this |
| Alert Info (`21380-22965`) | `sds-alert-info` | ✅ Added | `bg-feedback-infoLow` (#d0ebff) + `border-feedback-infoMid` (#8bc1ff) — use instead of `sds-status-tag-info` |
| Alert Warning (`21380-22965`) | `sds-alert-warning` | ✅ Added | `bg-feedback-warningLow` (#fff7e5) + `border-feedback-warningMid` (#ffdf9e) |
| Alert Success (`21380-22965`) | `sds-alert-success` | ✅ Added | `bg-feedback-successLow` (#e5f6ee) + `border-feedback-successMid` (#99dab9) |
| Alert Error (`21380-22965`) | `sds-alert-error` | ✅ Added | `bg-feedback-errorLow` (#ffe9e9) + `border-feedback-errorMid` (#ffa7a7) — use for Error Framework |
| Alert Neutral (`21380-22965`) | `sds-alert-neutral` | ✅ Added | `border-neutralGrey-light2` (#e9e9e9) for both background and border |
| Segmented Control (`6673-93780`) | `sds-toggle-group` | ✅ Updated — `width: fit-content` added | Prevents unwanted full-width stretch |
| Segmented Control (`6673-93780`) | `sds-toggle-option` | ✅ Updated — `outline: none; -webkit-tap-highlight-color: transparent` added | Prevents browser blue focus ring on buttons |

#### Token additions to `global.scss` (2026-04-28)
The following CSS custom properties were missing from `src/styles/global.scss` and were added so the alert variant mixins resolve correctly:

| Token | Value | Used by |
|---|---|---|
| `--sds-bg-feedback-infoLow` | `#d0ebff` | `sds-alert-info` |
| `--sds-bg-feedback-warningLow` | `#fff7e5` | `sds-alert-warning` |
| `--sds-border-feedback-infoMid` | `#8bc1ff` | `sds-alert-info` |
| `--sds-border-feedback-warningMid` | `#ffdf9e` | `sds-alert-warning` |
| `--sds-border-feedback-successMid` | `#99dab9` | `sds-alert-success` |
| `--sds-border-feedback-errorMid` | `#ffa7a7` | `sds-alert-error`, `.error-alert` |

---

### Shadows, Elevation & Variables

| Figma token | Engineering token | Action | Notes |
|---|---|---|---|
| *(absent)* | `elevation-level1/2/3/theme` (x, y, blur, spread, color each) | ➕ Add to Figma | Shadow/elevation token set entirely absent from doc |
| *(absent)* | `text-transform-uppercase/lowercase/capitalize` | ➕ Add to Figma | `tt` namespace absent |
| *(absent)* | `text-decoration-underline/line-through` | ➕ Add to Figma | `td` namespace absent |
| Header height = 60px (Page Layout) | `globalHeaderHeight` = **56px** | 🔄 Update in Figma | Engineering token value is 56px; Figma doc says 60px — update Figma to 56px |
| *(absent)* | `leftNavigationCollapsedWidth` = 72px | ➕ Add to Figma | Already documented as prose; add as formal token reference |
| *(absent)* | `leftNavigationPermiterWidth` = 32px | ➕ Add to Figma | Note: engineering has typo "Perimeter" → should be "Perimeter" |

---

### Themes

| Figma | Engineering | Action | Notes |
|---|---|---|---|
| *(no theme token list)* | 32 `theme-*` tokens (bg, border, icon, boxShadow, illustration) | ➕ Add to Figma | Full themeColors token set absent from doc |
| 8 theme names match | darwin-blue, coral-red, crimson-red, spring-green, bloom-violet, amber-blue, aqua-teal | ✅ Match | — |
| "charcoal" (assumed) | `charcol` | 📋 Dev to update | Engineering has typo "charcol"; design Figma likely spells it correctly — engineering should fix the theme name |

---

### Icons & Illustrations

| Figma | Engineering | Action | Notes |
|---|---|---|---|
| *(no icon documentation)* | ~200 icons with `default`/`fill` variants in `sds-icons.meta.json` | ➕ Add to Figma | Entire icon catalog absent from reference doc |
| *(no illustration documentation)* | 29 illustrations (announcement×4, celebrations×2, get-started×2, goals×2, no-access×5, no-data×3, search, success×2, system-error×3, user-error×2, work-life-balance×3) | ➕ Add to Figma | Entire illustration catalog absent from reference doc |
