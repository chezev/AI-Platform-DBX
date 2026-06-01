import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsButtonComponent } from '../spartan/sds-button';
import { TraceDebugResult } from './trace.types';

@Component({
  selector: 'app-copilot-debug-panel',
  standalone: true,
  imports: [SdsButtonComponent, SdsIconComponent],
  template: `
    <section class="copilot-debug" aria-label="Copilot trace debug">
      <header>
        <div class="debug-title">
          <app-sds-icon name="ai-panel" [size]="14"></app-sds-icon>
          <span>Copilot Debug</span>
        </div>
        <button type="button" sdsButton variant="secondary" size="xs" (click)="debugFull.emit()">
          Debug Full Trace
        </button>
      </header>

      @if (debugResult) {
        <article class="debug-answer" aria-live="polite">
          <strong>{{ debugResult.title }}</strong>
          <dl>
            <div>
              <dt>What Happened</dt>
              <dd>{{ debugResult.happened }}</dd>
            </div>
            <div>
              <dt>Where The Issue Is</dt>
              <dd>{{ debugResult.issue }}</dd>
            </div>
            <div>
              <dt>Why It Happened</dt>
              <dd>{{ debugResult.reason }}</dd>
            </div>
            <div>
              <dt>Suggested Fix</dt>
              <dd>{{ debugResult.fix }}</dd>
            </div>
            <div>
              <dt>Next Action</dt>
              <dd>{{ debugResult.nextAction }}</dd>
            </div>
          </dl>
        </article>
      } @else {
        <p>Use Debug This Step or Debug Full Trace to ask Copilot for a readable explanation.</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .copilot-debug {
      border: 1px solid var(--sds-border-primary-subtle);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      padding: var(--sds-padding-12);
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-12);
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sds-gap-12);
    }

    .debug-title {
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    p {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }

    .debug-answer {
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-8);
    }

    .debug-answer > strong {
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-s-medium-font-size);
      font-weight: var(--sds-body-s-medium-font-weight);
      line-height: var(--sds-body-s-medium-line-height);
    }

    dl {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-8);
    }

    dl div {
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
    }

    dt {
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-caption-medium-font-size);
      font-weight: var(--sds-caption-medium-font-weight);
      line-height: var(--sds-caption-medium-line-height);
    }

    dd {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotDebugPanelComponent {
  @Input() debugResult: TraceDebugResult | null = null;
  @Output() readonly debugFull = new EventEmitter<void>();
}
