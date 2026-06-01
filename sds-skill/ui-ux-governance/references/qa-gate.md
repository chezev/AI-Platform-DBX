# UI QA Gate

Updated: 2026-05-29

## Severity Model

- Critical: blocks release; breaks core behavior, accessibility, or SDS token compliance.
- Major: high-visibility UX risk; must fix before handoff.
- Minor: noticeable inconsistency; fix in current sprint when possible.
- Suggestion: optimization or readability improvement.

## Pixel-Perfect Checklist

## A) Layout

- Global nav width/height matches design.
- Content starts at correct offsets.
- Grids and cards align to shared vertical rhythm.
- No accidental selected/active outlines.

## B) Spacing

- Gaps and paddings are tokenized and consistent.
- Related items are closer than unrelated items.
- Card internals follow consistent spacing ladder.

## C) Typography

- Darwin Sans family is applied consistently.
- Tokenized sizes/weights/line-heights only.
- CTA casing is consistent with product copy rules.

## D) Icons

- Icon source follows policy: SDS -> canvas-studio -> Lucide fallback.
- Icon visual shape matches design, not just filename.
- Icon color, stroke weight, and alignment are consistent.

## E) Interactions and States

- Hover, focus, active, disabled, selected states exist and match intent.
- Form errors are explicit and actionable.
- Async actions show progress/status feedback.
- Menus/dropdowns align and anchor correctly.

## F) Accessibility (WCAG 2.2 AA baseline)

- Keyboard operation for all interactive controls.
- Focus indicators are visible and not clipped.
- Contrast meets minimum requirements.
- Inputs have labels and error associations.
- Name/role/value are available to assistive tech.

## G) Heuristic Gate

Check each screen against:
1. Visibility of system status
2. Match to user language and mental model
3. User control and escape routes
4. Consistency and standards
5. Error prevention
6. Recognition over recall
7. Expert efficiency
8. Minimalism without losing clarity
9. Error recovery guidance
10. Help/documentation discoverability

## Report Template

| Severity | Area | Issue | Expected Fix |
|---|---|---|---|
| Critical/Major/Minor/Suggestion | e.g. Spacing, Typography, A11y | concrete problem | exact token/component/layout action |
