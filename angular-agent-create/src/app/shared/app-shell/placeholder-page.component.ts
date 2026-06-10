import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Generic "coming soon" page for nav items that don't have a design yet.
 * Title comes from the route's `data.title`.
 */
@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  template: `
    <section class="placeholder">
      <h1>{{ title }}</h1>
      <p>This screen is on the way. Share the design and we’ll build it next.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
      padding: var(--sds-padding-24);
    }

    .placeholder {
      max-width: 520px;
      padding: var(--sds-padding-24);
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
    }

    .placeholder h1 {
      margin: 0 0 var(--sds-gap-8);
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-title-xxs-bold-font-size);
      font-weight: var(--sds-title-xxs-bold-font-weight);
      line-height: var(--sds-title-xxs-bold-line-height);
    }

    .placeholder p {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-m-book-font-size);
      line-height: var(--sds-body-m-book-line-height);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = (this.route.snapshot.data['title'] as string | undefined) ?? 'Coming soon';
}
