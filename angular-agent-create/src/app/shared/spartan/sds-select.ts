import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnPopover, BrnPopoverContent, provideBrnPopoverConfig } from '@spartan-ng/brain/popover';
import { BrnSelect, BrnSelectContent, BrnSelectItem, BrnSelectTrigger, BrnSelectValue } from '@spartan-ng/brain/select';
import { SdsIconComponent } from '../icons/sds-icon.component';

@Directive({
  selector: '[sdsSelect],sds-select',
  standalone: true,
  providers: [
    provideBrnPopoverConfig({
      align: 'start',
      sideOffset: 4,
    }),
    provideBrnDialogDefaultOptions({
      autoFocus: 'first-heading',
    }),
  ],
  hostDirectives: [
    {
      directive: BrnSelect,
      inputs: ['disabled', 'value', 'isItemEqualToValue', 'itemToString'],
      outputs: ['valueChange'],
    },
    {
      directive: BrnPopover,
      inputs: [
        'align',
        'autoFocus',
        'closeDelay',
        'closeOnOutsidePointerEvents',
        'sideOffset',
        'state',
        'offsetX',
        'restoreFocus',
      ],
      outputs: ['stateChanged', 'closed'],
    },
  ],
})
export class SdsSelectDirective {}

@Directive({
  selector: '[sdsSelectPortal]',
  standalone: true,
  hostDirectives: [{ directive: BrnPopoverContent, inputs: ['context', 'class'] }],
})
export class SdsSelectPortalDirective {}

@Directive({
  selector: '[sdsSelectValue],sds-select-value',
  standalone: true,
  hostDirectives: [{ directive: BrnSelectValue, inputs: ['placeholder'] }],
  host: {
    class: 'sds-select-value',
    '[attr.data-hidden]': '_hidden() ? "" : null',
  },
})
export class SdsSelectValueDirective {
  private readonly _brnSelectValue = inject(BrnSelectValue);
  protected readonly _hidden = this._brnSelectValue.hidden;
}

@Component({
  selector: 'sds-select-trigger',
  standalone: true,
  imports: [BrnSelectTrigger, SdsIconComponent],
  template: `
    <button type="button" brnSelectTrigger class="sds-select-trigger" [attr.data-size]="size()">
      <span class="sds-select-trigger-label"><ng-content /></span>
      @if (showChevron()) {
        <app-sds-icon name="chevron-down" [size]="16"></app-sds-icon>
      }
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: var(--sds-select-width, 200px);
      min-width: var(--sds-select-width, 200px);
    }

    .sds-select-trigger {
      width: 100%;
      min-height: var(--sds-select-trigger-min-height, var(--sds-control-height));
      border: var(--sds-select-trigger-border, 1px solid var(--sds-border-primary-default));
      border-radius: var(--sds-border-radius-4);
      background: var(--sds-bg-neutralWhite-default);
      color: var(--sds-text-neutral-title);
      padding: 0 var(--sds-padding-8);
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sds-gap-8);
      cursor: pointer;
      font-family: inherit;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
      box-shadow: none;
    }

    .sds-select-trigger[data-size='sm'] {
      min-height: var(--sds-size-28);
    }

    .sds-select-trigger:hover {
      border-color: var(--sds-border-neutralGrey-hover);
    }

    .sds-select-trigger[aria-expanded='true'] {
      border-color: var(--sds-border-neutralBlue-active);
      box-shadow: 0 0 0 1px var(--sds-border-neutralBlue-active);
    }

    .sds-select-trigger:focus-visible {
      border-color: var(--sds-border-neutralBlue-active);
      outline: none;
      box-shadow: 0 0 0 1px var(--sds-border-neutralBlue-active);
    }

    .sds-select-trigger-label {
      display: inline-flex;
      align-items: center;
      gap: var(--sds-select-label-gap, 0);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsSelectTriggerComponent {
  readonly size = input<'default' | 'sm'>('default');
  readonly showChevron = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
}

@Component({
  selector: 'sds-select-content',
  standalone: true,
  hostDirectives: [BrnSelectContent],
  template: `
    <div class="sds-select-content">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: var(--brn-select-width, var(--sds-select-width, 200px));
      min-width: var(--brn-select-width, var(--sds-select-width, 200px));
      max-height: 240px;
      overflow: auto;
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      box-shadow: var(--sds-shadow-dropdown);
    }

    .sds-select-content {
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
      padding: var(--sds-padding-8);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsSelectContentComponent {}

@Component({
  selector: 'sds-select-group-label',
  standalone: true,
  template: '<ng-content />',
  styles: `
    :host {
      min-height: var(--sds-size-28);
      padding: 0 var(--sds-padding-8);
      display: flex;
      align-items: center;
      color: var(--sds-text-neutral-ghost);
      font-family: inherit;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsSelectGroupLabelComponent {}

@Component({
  selector: 'sds-select-item',
  standalone: true,
  hostDirectives: [{ directive: BrnSelectItem, inputs: ['id', 'disabled', 'value'] }],
  host: {
    class: 'sds-select-item-host',
    '[attr.data-active]': '_active() ? "" : null',
  },
  template: `
    <div class="sds-select-item">
      <span class="sds-select-item-label"><ng-content /></span>
      @if (_active()) {
        <span class="sds-select-item-check" aria-hidden="true"></span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      cursor: pointer;
    }

    .sds-select-item {
      min-height: var(--sds-control-height);
      border-radius: var(--sds-border-radius-4);
      padding: 0 var(--sds-padding-8);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sds-gap-8);
      color: var(--sds-text-neutral-title);
      font-family: inherit;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    :host(:hover) .sds-select-item,
    :host([data-highlighted]) .sds-select-item {
      background: var(--sds-bg-neutralGrey-light2);
    }

    :host([data-disabled]) {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .sds-select-item-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sds-select-item-check {
      width: var(--sds-size-8);
      height: var(--sds-size-8);
      border-radius: var(--sds-border-radius-full);
      background: var(--sds-bg-neutralBlue-active);
      flex: 0 0 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsSelectItemComponent {
  private readonly _brnSelectItem = inject(BrnSelectItem);
  protected readonly _active = this._brnSelectItem.active;
}
