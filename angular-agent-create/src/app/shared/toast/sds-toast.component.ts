import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsToastService } from './sds-toast.service';

@Component({
  selector: 'app-sds-toast',
  standalone: true,
  imports: [SdsIconComponent],
  template: `
    @if (toast(); as item) {
      <section class="sds-toast" [attr.data-variant]="item.variant" role="status" aria-live="polite">
        <span class="sds-toast-icon" aria-hidden="true">
          <app-sds-icon [name]="iconName()" [size]="14"></app-sds-icon>
        </span>
        <p>{{ item.message }}</p>
        <button type="button" aria-label="Dismiss notification" (click)="toastService.dismiss()">
          <app-sds-icon name="x" [size]="16"></app-sds-icon>
        </button>
      </section>
    }
  `,
  styles: `
    :host {
      position: fixed;
      top: calc(var(--sds-size-56) + var(--sds-gap-16));
      left: 50%;
      z-index: 1000;
      width: min(840px, calc(100vw - var(--sds-padding-40) - var(--sds-padding-40)));
      pointer-events: none;
      transform: translateX(-50%);
    }

    .sds-toast {
      min-height: var(--sds-size-56);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-primary-hover);
      box-shadow: var(--sds-shadow-dialog);
      color: var(--sds-text-neutral-negative);
      padding: 0 var(--sds-padding-16);
      display: flex;
      align-items: center;
      gap: var(--sds-gap-12);
      pointer-events: auto;
      animation: sds-toast-enter 160ms ease-out;
    }

    .sds-toast[data-variant='success'] {
      background: var(--sds-bg-feedback-successHigh);
    }

    .sds-toast[data-variant='error'] {
      background: var(--sds-bg-feedback-errorHigh);
    }

    .sds-toast-icon {
      width: var(--sds-size-24);
      height: var(--sds-size-24);
      border-radius: var(--sds-border-radius-full);
      background: var(--sds-bg-neutralWhite-default);
      color: var(--sds-text-neutral-title);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }

    .sds-toast p {
      margin: 0;
      color: var(--sds-text-neutral-negative);
      flex: 1;
      font-size: var(--sds-body-l-book-font-size);
      font-weight: var(--sds-body-l-book-font-weight);
      line-height: var(--sds-body-l-book-line-height);
    }

    .sds-toast button {
      width: var(--sds-size-32);
      height: var(--sds-size-32);
      border: none;
      border-radius: var(--sds-border-radius-4);
      background: transparent;
      color: var(--sds-text-neutral-negative);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .sds-toast button:hover,
    .sds-toast button:focus-visible {
      box-shadow: inset 0 0 0 1px var(--sds-border-neutralWhite-default);
      outline: none;
    }

    .sds-toast app-sds-icon {
      --sds-icon-filter: brightness(0) saturate(100%) invert(100%);
    }

    .sds-toast-icon app-sds-icon {
      --sds-icon-filter: none;
    }

    @keyframes sds-toast-enter {
      from {
        opacity: 0;
        transform: translateY(calc(var(--sds-gap-8) * -1));
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 720px) {
      :host {
        width: calc(100vw - var(--sds-padding-24) - var(--sds-padding-24));
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsToastComponent {
  protected readonly toastService = inject(SdsToastService);
  protected readonly toast = this.toastService.toast;
  protected readonly iconName = computed(() => {
    const variant = this.toast()?.variant;

    if (variant === 'success') {
      return 'check';
    }

    if (variant === 'error') {
      return 'x';
    }

    return 'info';
  });
}
