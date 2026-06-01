import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

type SdsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse-primary' | 'inverse-secondary' | 'inverse-ghost';
type SdsButtonSize = 'default' | 'sm' | 'xs';
type SdsIconButtonVariant = 'default' | 'ghost' | 'inverse' | 'inverse-ghost';
type SdsIconButtonShape = 'square' | 'round';

@Component({
  selector: 'button[sdsButton], a[sdsButton]',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'sds-button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      min-height: var(--sds-button-height, var(--sds-control-height));
      border: 1px solid transparent;
      border-radius: var(--sds-border-radius-4);
      padding: 0 var(--sds-padding-12);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--sds-gap-8);
      text-decoration: none;
      font-family: inherit;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
      white-space: nowrap;
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease,
        box-shadow 120ms ease;
    }

    :host([data-size='sm']) {
      min-height: var(--sds-size-24);
      padding-inline: var(--sds-padding-8);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }

    :host([data-size='xs']) {
      min-height: var(--sds-size-24);
      padding-inline: var(--sds-padding-8);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }

    :host([data-variant='primary']) {
      border-color: var(--sds-bg-primary-active);
      background: var(--sds-bg-primary-active);
      color: var(--sds-text-neutral-negative);
    }

    :host([data-variant='primary']:hover) {
      border-color: var(--sds-bg-primary-hover);
      background: var(--sds-bg-primary-hover);
    }

    :host([data-variant='secondary']) {
      border-color: var(--sds-border-primary-default);
      background: var(--sds-bg-neutralWhite-default);
      color: var(--sds-text-neutral-title);
    }

    :host([data-variant='secondary']:hover) {
      background: var(--sds-bg-neutralGrey-hover);
    }

    :host([data-variant='ghost']) {
      border-color: transparent;
      background: transparent;
      color: var(--sds-text-neutral-title);
    }

    :host([data-variant='ghost']:hover) {
      background: var(--sds-bg-neutralGrey-hover);
    }

    :host([data-variant='inverse-primary']) {
      border-color: var(--sds-bg-neutralWhite-default);
      background: var(--sds-bg-neutralWhite-default);
      color: var(--sds-text-neutral-title);
    }

    :host([data-variant='inverse-primary']:hover) {
      border-color: var(--sds-border-primary-subtle);
      background: var(--sds-bg-neutralGrey-light2);
    }

    :host([data-variant='inverse-secondary']) {
      border-color: var(--sds-bg-neutralWhite-default);
      background: transparent;
      color: var(--sds-text-neutral-negative);
    }

    :host([data-variant='inverse-secondary']:hover),
    :host([data-variant='inverse-ghost']:hover) {
      background: var(--sds-bg-primary-hover);
    }

    :host([data-variant='inverse-ghost']) {
      border-color: transparent;
      background: transparent;
      color: var(--sds-text-neutral-negative);
    }

    :host(:focus-visible) {
      outline: none;
      box-shadow: 0 0 0 2px var(--sds-bg-neutralBlue-default);
    }

    :host([aria-disabled='true']) {
      border-color: var(--sds-bg-primary-disabled);
      background: var(--sds-bg-primary-disabled);
      color: var(--sds-text-neutral-ghost);
      cursor: not-allowed;
      pointer-events: none;
    }

    :host([data-variant='primary']) ::ng-deep app-sds-icon,
    :host([data-variant='inverse-secondary']) ::ng-deep app-sds-icon,
    :host([data-variant='inverse-ghost']) ::ng-deep app-sds-icon {
      --sds-icon-filter: brightness(0) saturate(100%) invert(100%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsButtonComponent {
  readonly variant = input<SdsButtonVariant>('primary');
  readonly size = input<SdsButtonSize>('default');
  readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}

@Component({
  selector: 'button[sdsIconButton], a[sdsIconButton]',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'sds-icon-button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      width: var(--sds-icon-button-size, var(--sds-control-height));
      min-width: var(--sds-icon-button-size, var(--sds-control-height));
      height: var(--sds-icon-button-size, var(--sds-control-height));
      border: 1px solid var(--sds-border-primary-default);
      border-radius: var(--sds-border-radius-4);
      background: var(--sds-bg-neutralWhite-default);
      color: var(--sds-text-neutral-title);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease,
        box-shadow 120ms ease;
    }

    :host([data-size='sm']) {
      --sds-icon-button-size: var(--sds-size-24);
    }

    :host([data-size='xs']) {
      --sds-icon-button-size: var(--sds-size-24);
    }

    :host([data-shape='round']) {
      border-radius: var(--sds-border-radius-full);
    }

    :host([data-variant='ghost']) {
      border-color: transparent;
      background: transparent;
    }

    :host([data-variant='default']:hover),
    :host([data-variant='ghost']:hover) {
      background: var(--sds-bg-neutralGrey-hover);
    }

    :host([data-variant='inverse']) {
      border-color: var(--sds-bg-neutralWhite-default);
      background: transparent;
      color: var(--sds-text-neutral-negative);
    }

    :host([data-variant='inverse-ghost']) {
      border-color: transparent;
      background: transparent;
      color: var(--sds-text-neutral-negative);
    }

    :host([data-variant='inverse']:hover),
    :host([data-variant='inverse-ghost']:hover) {
      background: var(--sds-bg-primary-hover);
    }

    :host([data-variant='inverse']) ::ng-deep app-sds-icon,
    :host([data-variant='inverse-ghost']) ::ng-deep app-sds-icon {
      --sds-icon-filter: brightness(0) saturate(100%) invert(100%);
    }

    :host(:focus-visible) {
      outline: none;
      box-shadow: 0 0 0 2px var(--sds-bg-neutralBlue-default);
    }

    :host([aria-disabled='true']) {
      border-color: var(--sds-bg-primary-disabled);
      background: var(--sds-bg-primary-disabled);
      color: var(--sds-text-neutral-ghost);
      cursor: not-allowed;
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsIconButtonComponent {
  readonly variant = input<SdsIconButtonVariant>('default');
  readonly size = input<SdsButtonSize>('default');
  readonly shape = input<SdsIconButtonShape>('square');
  readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
