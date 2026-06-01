import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsIconButtonComponent } from '../spartan/sds-button';

@Component({
  selector: 'app-sds-topbar',
  standalone: true,
  imports: [SdsIconComponent, SdsIconButtonComponent],
  template: `
    <header class="sds-app-topbar">
      <button type="button" sdsIconButton variant="ghost" aria-label="Open applications">
        <app-sds-icon name="bento-menu" [size]="18"></app-sds-icon>
      </button>

      <img src="assets/brand/darwinbox-logo.png" alt="Darwinbox" class="sds-app-logo" />

      <label class="sds-app-search" [for]="searchId()">
        <input
          [id]="searchId()"
          type="search"
          [placeholder]="searchPlaceholder()"
          [value]="searchValue()"
          (input)="searchValueChange.emit($any($event.target).value)"
        />
        <app-sds-icon name="search" [size]="16"></app-sds-icon>
      </label>

      <div class="sds-app-actions" aria-label="Top actions">
        <button type="button" sdsIconButton variant="ghost" shape="round" aria-label="Reset">
          <app-sds-icon name="rotate-left" [size]="16"></app-sds-icon>
        </button>
        <button type="button" sdsIconButton variant="ghost" shape="round" aria-label="Clock">
          <app-sds-icon name="clock" [size]="16"></app-sds-icon>
        </button>
        <button type="button" sdsIconButton variant="ghost" shape="round" aria-label="Notifications">
          <app-sds-icon name="bell" [size]="16"></app-sds-icon>
        </button>
        <button type="button" sdsIconButton variant="ghost" shape="round" aria-label="AI actions">
          <app-sds-icon name="ai-panel" [size]="16"></app-sds-icon>
        </button>
        <button type="button" class="sds-app-avatar" aria-label="Profile">{{ profileLabel() }}</button>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
      flex: 0 0 auto;
    }

    .sds-app-topbar {
      height: var(--sds-app-topbar-height, var(--sds-size-56));
      width: 100%;
      padding: 0 var(--sds-padding-16);
      border-bottom: 1px solid var(--sds-border-neutralGrey-light2);
      background: var(--sds-bg-neutralWhite-default);
      display: grid;
      grid-template-columns: auto auto minmax(240px, 520px) 1fr;
      align-items: center;
      gap: var(--sds-gap-12);
    }

    .sds-app-logo {
      width: 118px;
      height: auto;
      display: block;
    }

    .sds-app-search {
      min-height: var(--sds-control-height);
      border: 1px solid var(--sds-border-primary-default);
      border-radius: var(--sds-border-radius-full);
      background: var(--sds-bg-neutralWhite-default);
      padding: 0 var(--sds-padding-12);
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
    }

    .sds-app-search:hover {
      border-color: var(--sds-border-neutralGrey-hover);
    }

    .sds-app-search:focus-within {
      border-color: var(--sds-border-neutralBlue-active);
      box-shadow: 0 0 0 1px var(--sds-border-neutralBlue-active);
    }

    .sds-app-search input {
      width: 100%;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--sds-text-neutral-title);
      font-family: inherit;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    .sds-app-search input::placeholder {
      color: var(--sds-text-neutral-ghost);
    }

    .sds-app-actions {
      justify-self: end;
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
    }

    .sds-app-avatar {
      min-width: var(--sds-control-height);
      height: var(--sds-control-height);
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-4);
      background: var(--sds-bg-neutralWhite-default);
      color: var(--sds-text-neutral-title);
      padding: 0 var(--sds-padding-8);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
      cursor: pointer;
    }

    .sds-app-avatar:hover,
    .sds-app-avatar:focus-visible {
      background: var(--sds-bg-neutralGrey-hover);
      outline: none;
    }

    @media (max-width: 920px) {
      .sds-app-topbar {
        grid-template-columns: auto auto 1fr;
        grid-template-areas:
          'menu logo actions'
          'search search search';
        height: auto;
        padding: var(--sds-padding-12) var(--sds-padding-16);
      }

      .sds-app-topbar > button {
        grid-area: menu;
      }

      .sds-app-logo {
        grid-area: logo;
      }

      .sds-app-search {
        grid-area: search;
      }

      .sds-app-actions {
        grid-area: actions;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsAppTopbarComponent {
  readonly searchId = input('sds-global-search');
  readonly searchPlaceholder = input('Search');
  readonly searchValue = input('');
  readonly profileLabel = input('CK');
  readonly searchValueChange = output<string>();
}
