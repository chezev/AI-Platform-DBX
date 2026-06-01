# shadcn Execution Guide

Updated: 2026-05-29

## Sources

- shadcn Button docs: https://ui.shadcn.com/docs/components/radix/button
- shadcn Card docs: https://ui.shadcn.com/docs/components/radix/card
- shadcn Input Group docs: https://ui.shadcn.com/docs/components/base/input-group
- shadcn CLI docs: https://ui.shadcn.com/docs/cli
- shadcn official skill rules:
- https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md
- https://raw.githubusercontent.com/shadcn-ui/ui/main/skills/shadcn/rules/styling.md
- https://raw.githubusercontent.com/shadcn-ui/ui/main/skills/shadcn/rules/forms.md
- https://raw.githubusercontent.com/shadcn-ui/ui/main/skills/shadcn/rules/composition.md
- https://raw.githubusercontent.com/shadcn-ui/ui/main/skills/shadcn/rules/icons.md
- https://raw.githubusercontent.com/shadcn-ui/ui/main/skills/shadcn/rules/base-vs-radix.md
- https://raw.githubusercontent.com/shadcn-ui/ui/main/skills/shadcn/cli.md

## 1) Component Composition Defaults

Card:
- Use full composition:
- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardAction` (when needed)
- `CardContent`
- `CardFooter`

Input group:
- Use `InputGroup` with:
- `InputGroupInput` or `InputGroupTextarea`
- `InputGroupAddon`
- `InputGroupButton`
- Keep addon after the input in DOM; use `align` to position.

Buttons:
- Use built-in `variant` and `size` props before custom styling.
- Use `data-icon="inline-start"` or `data-icon="inline-end"` for icon spacing.

## 2) Spacing and Layout Conventions

- Prefer `gap-*` patterns over ad hoc margin chains.
- Use layout utilities for structure; avoid manual component recoloring.
- Prefer reusable composition utilities over one-off wrappers.
- Keep form layout structured with `FieldGroup` and `Field` patterns where available.

## 3) Icon Rules

- Read `iconLibrary` from project config first; do not assume lucide.
- Within this product's policy:
- First use icons from `sds-icons` by visual match.
- If missing, use `canvas-studio` brand assets where applicable.
- Fallback to Lucide only when SDS/canvas assets are not available.
- Do not resize icons with random classes inside shadcn components unless explicitly required.

## 4) Safe Update Workflow

- Use project package manager runner (`npx`, `pnpm dlx`, or `bunx`).
- Prefer:
- `add --dry-run`
- `add --diff`
- `add --view`
- before overwriting component source.
- Avoid manual copy from arbitrary snippets when CLI can provide canonical updates.

## 5) Base vs Radix Guardrail

- Check whether project uses `base` or `radix`.
- API behavior differs for trigger composition, select, toggle group, slider, and accordion.
- Do not mix APIs from one base into the other.

## 6) Anti-Patterns to Block

- Raw color overrides on component internals.
- Custom dropdown/input/button markup when component exists.
- Missing required accessibility title in overlays.
- Missing fallback for avatars/icons.
- Inconsistent icon placement between list/card/table variants.
