import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SdsCatalogItem } from '../catalog-picker/sds-catalog-picker.component';

@Component({
  selector: 'app-sds-selected-resource-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="sds-selected-resource-card">
      <div class="sds-selected-resource-title-row">
        <h4>{{ item().title }}</h4>
        @if (item().badge) {
          <span>{{ item().badge }}</span>
        }
      </div>
      <p>{{ item().description }}</p>
      @if (item().metadata) {
        <small>{{ item().metadata }}</small>
      }
    </article>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .sds-selected-resource-card {
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      padding: var(--sds-padding-16);
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
    }

    .sds-selected-resource-title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--sds-gap-12);
    }

    h4,
    p {
      margin: 0;
    }

    h4 {
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    p,
    small {
      color: var(--sds-text-neutral-ghost);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    small {
      font-size: var(--sds-body-s-book-font-size);
      line-height: var(--sds-body-s-book-line-height);
    }

    span {
      min-height: 24px;
      border-radius: var(--sds-border-radius-24);
      background: var(--sds-bg-neutralBlue-default);
      color: var(--sds-text-neutral-label);
      display: inline-flex;
      align-items: center;
      padding: 0 var(--sds-padding-12);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsSelectedResourceCardComponent {
  readonly item = input.required<SdsCatalogItem>();
}
