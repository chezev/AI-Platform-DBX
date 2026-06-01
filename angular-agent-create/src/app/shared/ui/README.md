# Shared UI Primitives

This folder contains the generated Spartan Angular equivalents of shadcn/ui primitives.

## Rules

- Do not create page-level buttons, selects, dialogs, dropdown menus, cards, tabs, switches, or modals.
- Use these primitives for behavior and accessibility.
- Apply Darwinbox SDS through project-level SDS adapters and token styles.
- Do not hardcode color, spacing, radius, typography, or shadows in feature pages.
- Do not edit generated primitive behavior unless the upstream primitive is broken.

## Layering

1. `src/app/shared/ui/*` keeps generated primitive behavior.
2. `src/app/shared/spartan/*` exposes SDS-styled adapters used by app screens.
3. Feature screens compose adapters and layout data; they do not define component behavior.

## SDS Requirements

- Typography: Darwin Sans, SDS type tokens.
- Primary CTA: charcoal SDS primary token.
- Control height: SDS tokenized sizes.
- Dropdown chevron spacing: SDS padding token with 8px right spacing minimum.
- Dialogs and overlays: use generated dialog behavior, then SDS modal shell styles.
- Copy casing: CTAs and dropdown values follow the product casing agreed for this app.
