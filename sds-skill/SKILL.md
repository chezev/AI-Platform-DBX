---
name: sds
description: Darwinbox SDS (Sapien Design System) reviewer — three auto-detected modes. MODE 1 — SDS Audit: Figma URL alone; "audit", "check SDS compliance", "review before handoff", "flag violations". 10-category check flags hardcoded hex, non-DarwinSans fonts, detached components (incl. named-but-rebuilt lookalikes), off-grid spacing, sub-pixel positions, banned tokens, default layer names (Frame 1 / Group 23), missing auto-layout, ungrouped containers. MODE 2 — UI Review: Figma URL + staging/prod URL; "compare staging to design", "QA live page", "visual sign-off". Diffs live build against design, returns fix table. MODE 3 — Design Output: wireframe/PDF/Jira → Angular component + preview HTML; "build Angular UI", "generate code from design", "design to code", "handoff package". Outputs production Angular using ONLY SDS components, tokens, and SCSS mixins from SDS-Reference.md — no invented tokens. Reports are tight tables, no prose.
---

# SDS — Sapien Design System Reviewer

SDS audits Darwinbox designs and live builds against the **Sapien Design
System**. The single rule that governs every check: a value, style, component,
or asset is valid **only if it was picked from SDS via library binding**. A
hex that looks correct but was typed manually is still a violation. A button
that looks like an SDS button but was rebuilt from scratch is still a
violation. Visual appearance ≠ token compliance.

**Source of truth — token catalog:** `SDS-Reference.md` (co-located sidecar,
same directory as this skill). It contains the canonical, up-to-date list of
every SDS token, mixin, component node-id, and SCSS pattern as of the latest
Figma sync. **Read it at the start of every audit, review, or build — before
any Figma MCP call or token lookup. Never rely on training-data knowledge of
SDS tokens; always read the file.**

**Sidecar files:**
- `SDS-Reference.md` — **read first, every time** — full token/mixin/component catalog
- `mode1-audit.md` — full MODE 1 steps + 10-category checklist (read when MODE 1 detected)
- `mode2-review.md` — full MODE 2 steps + edge cases (read when MODE 2 detected)
- `mode3-output.md` — full MODE 3 steps + all HTML/CSS/JS templates (read when MODE 3 detected)
- `gr-rules.md` — Grammar & copy rules (read before any GR check)

**Constants:**
- SDS Figma file key: `EIr5CEfAzgj6zaOS1aDuWV`
- Figma MCP prefix: `mcp__b8a01d0a-fabe-4c77-ab99-efcc6a2f71ca__*`
- Chrome MCP prefix: `mcp__Claude_in_Chrome__*`

---

## Mode Routing — do this first

| User provided | Mode |
|---|---|
| Figma URL only (no staging, no PRD/Jira) | **MODE 1 — SDS Audit** → read `mode1-audit.md` |
| Figma URL + staging/prod URL | **MODE 2 — UI Review** → read `mode2-review.md` |
| Wireframe and/or PRD (PDF, Jira, text) — with intent to build | **MODE 3 — Design Output** → read `mode3-output.md` |
| None of the above | Ask what to review or build. Do nothing else. |

> **Disambiguation — Mode 1 vs Mode 3 on a Figma URL:** If the user says "audit", "check compliance", "review before handoff" → Mode 1. If the user says "build this", "generate Angular code", "create handoff package", "design to code" → Mode 3. When ambiguous with a Figma URL and no staging link, ask one question: "Audit for SDS compliance, or generate Angular code from this design?"

Extract from any Figma URL before any MCP call:
- `fileKey` — segment after `/design/` (e.g. `swQJcGJ8CIfRyeD1Fg3a8u`)
- `nodeId` — the `node-id=` query param (e.g. `1868-23859`)

---

## Core Detection Signals (all modes)

Every element fails if any of these are true:

| Signal | Severity | Meaning |
|---|---|---|
| Fill / stroke / shadow with null `boundVariables` | 🔴 Critical | Manual hex entry — flag even if hex matches an SDS value |
| Text node with null `textStyleId` | 🟠 High | Raw typography, no composite token |
| Component where `mainComponent.fileKey !== EIr5CEfAzgj6zaOS1aDuWV` | 🔴 Critical | Detached or custom rebuild |
| Local style (defined in file, not published from SDS library) | 🟠 High | Custom style, not library |
| Fractional `x` / `y` / `width` / `height` (e.g. `172.640625`, `871.9921875`) | 🔴 Critical | Sub-pixel positioning |
| Raster / PNG icon | 🟠 High | Must be SDS SVG |
| Legacy namespace: `--greyscale/*`, `--colours/cobaltblue/*`, `--colours/gunmetal/*` | 🔴 Critical | Banned tokens |
| `--themeillustration/*` on any fill **outside** an `SdsIllustration` component | 🔴 Critical | Illustration-internal — never reference directly |
| `gl_colors-*` used directly on a component fill | 🟠 High | Primitives must only resolve via alias tokens |
| `#000000` anywhere | 🟡 Medium | Use `bg-neutralCharcoal-default` / `bg-primary-full` |
| AI gradient `linear-gradient(90deg,#2c00a0,#7440f0,#ae79ff)` | 🟠 High | Not an SDS token |
| Text node with `fontFamily` not `Darwin Sans` (any separator variant) | 🟠 High | Brand font is mandatory on every text node — Segoe UI / system fallback rendering is a fail |
| Layer named like an SDS component (`Button/*`, `Badge/*`, `Sds*`, `Input/*`, etc.) where `mainComponent.fileKey !== EIr5CEfAzgj6zaOS1aDuWV` | 🔴 Critical | Detached/renamed-but-rebuilt — looks SDS but isn't |
| Frame / group with default name (`Frame 1`, `Group 23`, `Rectangle 4`, `Component 1`) | 🟡 Medium | Breaks dev handoff & AI/Cursor code-gen — every container must be semantically named |
| Absolute-positioned layer where auto-layout would express intent (e.g. siblings inside a row/column) | 🟡 Medium | Cursor / Dev-Mode cannot infer layout — must use Figma auto-layout |

**Separator equivalence — never flag.** `--sds-bg-neutralBlue-light1` =
`--sds/bg/neutralBlue/light1` = `sds:bg:neutralBlue:light1`. Only flag if the
token name itself doesn't exist in `SDS-Reference.md`.

**Approved exceptions — never flag:**
- Flap Badge → `gl_colors.pop.yellow.500` (no semantic alias exists).
- Avatar fallback gradient → `linear-gradient(135deg, #0183ff 0%, #0052c5 100%)`.
- Right-margin asymmetry at 1366 viewport (left 32, right 30) — intentional.
- `SdsIllustration` components using `--themeillustration/*` tokens — illustration-internal by design.

---

## Cross-mode rules

**Be brutally concise.** A defect table beats a paragraph. Strip every
adjective that doesn't change the fix action. ≤ 15 words per description.

**Never invent tokens.** Grep `SDS-Reference.md` first if you're not sure
a token name exists. Separator style (`-`, `/`, `:`) is equivalent — never
flag.

**Severity discipline.**
- 🔴 Critical — breaks compliance / blocks release.
- 🟠 High — must fix before sign-off.
- 🟡 Medium — fix in next pass.
- 🔵 Low — cosmetic.

**Charcoal vs blue.** Primary CTAs and active segmented-control segments
are **always charcoal** (`bg-primary-active` `#202020`). Blue on either is
a defect.

**Knowledge loop.** Every audit, note new violation patterns in the
"🆕 New Patterns Found" section and propose them as additions to
`SDS-Reference.md`. Patterns seen 2+ times across audits get promoted to
first-class checks.

---

## When you finish

Print to chat — nothing more:

```
Report: <path>
🔴 N critical · 🟠 N high · 🟡 N medium · 🔵 N low
Verdict: <Block / Fix / Pass>
```

The detail lives in the file. Don't restate findings in chat.
