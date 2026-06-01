---
name: ui-ux-governance
description: Use this skill when implementing, reviewing, or polishing enterprise UI that must be pixel-precise, token-safe, accessible, and consistent with SDS and shadcn conventions. Triggers include Figma-to-code execution, UI QA, spacing/typography/icon corrections, navigation and form refinements, and any request to apply Gestalt principles, Nielsen heuristics, or WCAG 2.2 checks.
---

# UI UX Governance

## Overview

This skill gives a deterministic workflow to design, build, and audit UI with minimal regressions. It combines SDS compliance, shadcn component rules, Gestalt grouping, Nielsen heuristics, and WCAG 2.2 checks into one execution path.

## Use This Skill When

- You need pixel-accurate implementation from Figma.
- You need UI cleanup for fonts, spacing, alignment, icon usage, or states.
- You are building screens with shadcn components and need consistent composition.
- You need accessibility and usability hardening before sign-off.
- You need structured design review findings, not ad hoc feedback.

## Mandatory Preflight

1. Read these SDS files first:
- `/sds-skill/SKILL.md`
- `/sds-skill/SDS-Reference.md`
- `/sds-skill/gr-rules.md`
- `/sds-skill/mode1-audit.md`
- `/sds-skill/mode2-review.md`
- `/sds-skill/mode3-output.md`
2. Confirm icon sourcing order:
- First priority: `sds-icons` (match actual visual shape, not filename guess).
- Second priority: `canvas-studio` brand assets where provided.
- Final fallback only when missing: Lucide icons.
3. Confirm component strategy:
- Prefer existing SDS component pattern.
- Use shadcn composition only where SDS-specific wrapper is not available.
4. Confidence rule:
- If confidence is below 90%, ask exactly one clarification question before implementation.

## Workflow

### Step 1: Structure and Scope Lock
- Define screen zones: global nav, subnav, toolbars, filters, content, actions, feedback.
- Define responsive behavior per zone.
- Define exact list/card row density and pagination behavior.

### Step 2: Component Mapping
- Map each zone to SDS/shadcn components first, before writing styles.
- Do not build custom controls if existing components cover the need.
- For cards, use full card composition (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, optional `CardAction`) rather than dumping everything in one body.

### Step 3: Token and Typography Pass
- No hardcoded color, spacing, radius, shadow, or typography values.
- Use SDS tokens and typography scales.
- Enforce Darwin Sans and approved weights for all text.
- Verify CTA casing and label consistency across views.

### Step 4: Shadcn Layout and Icon Pass
- For button icons and spinners, use `data-icon="inline-start"` or `data-icon="inline-end"` for correct spacing.
- For input addons, use `InputGroup` + `InputGroupInput/InputGroupTextarea` + `InputGroupAddon`; keep addon after input in DOM and position using `align`.
- Use `gap-*` patterns for spacing rhythm; avoid ad hoc spacing hacks.
- Use semantic tokens/variants; avoid raw color utility overrides.

### Step 5: Gestalt Pass
- Proximity: related elements are closer than unrelated ones.
- Similarity: same semantics must share visual attributes.
- Common region and connectedness: use boundaries/containers only when they clarify grouping.
- Figure-ground: maintain clear interactive foreground against background.
- Continuation/common fate: directional and motion cues must guide, not distract.

### Step 6: Heuristic Pass
- Validate all 10 Nielsen heuristics using implementation evidence:
1. visibility of system status
2. match with real world
3. user control and freedom
4. consistency and standards
5. error prevention
6. recognition over recall
7. flexibility and efficiency
8. aesthetic and minimalist design
9. error recovery guidance
10. help/documentation discoverability

### Step 7: Accessibility Pass
- WCAG 2.2 conformance target: at least AA for product UI.
- Check keyboard access, visible focus, contrast ratios, labels, errors, semantic roles, and target sizing.

### Step 8: Pixel-Perfect QA Gate
- Compare against design at component and zone level:
- x/y alignment
- width/height
- vertical rhythm
- icon size/stroke/placement
- state styles (default, hover, focus, active, disabled, selected)
- Ensure no unintended active/selected outlines unless explicitly specified by design.

## shadcn-Specific Rules

- Use project package manager runner for shadcn CLI.
- Prefer `add --dry-run` and `--diff` before overwriting component files.
- Prefer built-in variants (`variant`, `size`) before custom style overrides.
- Use `className` for layout intent, not to restyle core component semantics.
- Use `cn()` for conditional classes.
- Avoid manual overlay z-index overrides for Dialog/Sheet/Popover/Dropdown/Tooltip.
- Respect base-vs-radix API differences before composing triggers and selects.

## Review Output Format

For audits and review comments, return a compact table:

| Severity | Area | Issue | Expected Fix |
|---|---|---|---|
| Critical / Major / Minor / Suggestion | e.g. Typography, Spacing, Iconography, A11y, Interaction | concrete failure | exact token/component/layout fix |

## Self-Review Checklist (Mandatory)

- Token compliance
- Spacing rhythm consistency
- Responsive behavior
- Accessibility and keyboard operation
- Component reuse
- Semantic naming
- SDS + shadcn compliance
- Icon source policy compliance

## References

- `references/research-foundations.md`
- `references/shadcn-execution.md`
- `references/qa-gate.md`
