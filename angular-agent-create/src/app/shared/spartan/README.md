# SDS Adapters

Use these adapters in feature screens.

They are the project-level SDS layer over Spartan/shadcn behavior:

- `sds-button.ts` for CTAs and icon buttons.
- `sds-select.ts` for dropdown behavior, trigger spacing, item state, and portal width.
- `sds-form.ts` for card, field, input, and textarea primitives.

Feature pages must not rebuild these controls locally. If a needed control is missing, add it here first using the generated primitive from `src/app/shared/ui`, then style it with SDS tokens.
