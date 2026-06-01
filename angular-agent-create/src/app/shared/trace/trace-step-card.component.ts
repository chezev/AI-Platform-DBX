import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsButtonComponent } from '../spartan/sds-button';
import { TraceStep } from './trace.types';

@Component({
  selector: 'app-trace-step-card',
  standalone: true,
  imports: [SdsButtonComponent, SdsIconComponent],
  template: `
    <article class="trace-card" [attr.data-status]="step.status">
      <header class="trace-card-header">
        <div class="trace-card-title">
          <strong>{{ step.title }}</strong>
          @if (step.subtitle) {
            <span>{{ step.subtitle }}</span>
          }
        </div>
        <button type="button" class="collapse-button" [attr.aria-expanded]="expanded" (click)="toggleExpanded.emit(step.id)">
          <app-sds-icon [name]="expanded ? 'chevron-up' : 'chevron-down'" [size]="14"></app-sds-icon>
        </button>
      </header>

      @if (expanded) {
        <div class="trace-card-body">
          @if (step.summary) {
            <p class="summary">{{ step.summary }}</p>
          }

          @if (hasTokenUsage(step)) {
            <section class="metric-box" aria-label="Token usage">
              <div>
                <span>Model</span>
                <strong>{{ step.model }}</strong>
              </div>
              <div>
                <span>Input Tokens</span>
                <strong>{{ step.inputTokens }}</strong>
              </div>
              <div>
                <span>Output Tokens</span>
                <strong>{{ step.outputTokens }}</strong>
              </div>
              <div>
                <span>Total Tokens</span>
                <strong>{{ step.totalTokens }}</strong>
              </div>
            </section>
          }

          @if (step.retry) {
            <section class="data-node" aria-label="Retry details">
              <header>Retry Details</header>
              <p>Attempt {{ step.retry.attempt }} of {{ step.retry.maxAttempts }}: {{ step.retry.reason }}</p>
            </section>
          }

          @if (step.input) {
            <section class="data-node" aria-label="Trace input">
              <header>Input</header>
              <pre>{{ formatValue(step.input) }}</pre>
            </section>
          }

          @if (step.output) {
            <section class="data-node" aria-label="Trace output">
              <header>Output</header>
              <pre>{{ formatValue(step.output) }}</pre>
            </section>
          }

          @if (step.error) {
            <section class="data-node error-node" aria-label="Trace error">
              <header>Error</header>
              <pre>{{ formatValue(step.error) }}</pre>
            </section>
          }

          @if (step.rawLog) {
            <section class="raw-log" aria-label="Raw log data">
              <header>Raw Log Data</header>
              <pre>{{ formatValue(step.rawLog) }}</pre>
            </section>
          }

          <div class="trace-actions">
            <button type="button" sdsButton variant="secondary" size="xs" (click)="debugStep.emit(step)">
              <app-sds-icon name="bug" [size]="12"></app-sds-icon>
              Debug This Step
            </button>
            <button type="button" sdsButton variant="ghost" size="xs" (click)="copyRaw.emit(step)">
              <app-sds-icon name="copy" [size]="12"></app-sds-icon>
              Copy Raw Log
            </button>
          </div>
        </div>
      }
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .trace-card {
      width: 100%;
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      padding: var(--sds-padding-12);
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-12);
      box-shadow: var(--sds-shadow-card);
    }

    .trace-card[data-status='failed'] {
      border-color: var(--sds-border-feedback-errorHigh);
    }

    .trace-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--sds-gap-8);
    }

    .trace-card-title {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
    }

    .trace-card-title strong {
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    .trace-card-title span {
      color: var(--sds-text-neutral-ghost);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }

    .collapse-button {
      width: var(--sds-size-24);
      height: var(--sds-size-24);
      border: none;
      border-radius: var(--sds-border-radius-4);
      background: transparent;
      color: var(--sds-text-neutral-label);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .collapse-button:hover,
    .collapse-button:focus-visible {
      background: var(--sds-bg-neutralGrey-hover);
      outline: none;
    }

    .trace-card-body {
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-12);
    }

    .summary {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }

    .metric-box {
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralGrey-light1);
      padding: var(--sds-padding-8);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--sds-gap-12);
    }

    .metric-box div {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
    }

    .metric-box span,
    .data-node header,
    .raw-log header {
      color: var(--sds-text-neutral-ghost);
      font-size: var(--sds-caption-medium-font-size);
      font-weight: var(--sds-caption-medium-font-weight);
      line-height: var(--sds-caption-medium-line-height);
    }

    .metric-box strong {
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }

    .data-node,
    .raw-log {
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      padding: var(--sds-padding-12);
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-8);
    }

    .error-node {
      border-color: var(--sds-border-feedback-errorHigh);
      background: var(--sds-bg-feedback-warningLow);
    }

    .data-node header,
    .raw-log header {
      padding-bottom: var(--sds-padding-8);
      border-bottom: 1px solid var(--sds-border-neutralGrey-light2);
      color: var(--sds-text-neutral-label);
    }

    .data-node p,
    pre {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-family: 'Roboto Mono', monospace;
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .data-node p {
      font-family: inherit;
    }

    .trace-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sds-gap-8);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraceStepCardComponent {
  @Input({ required: true }) step!: TraceStep;
  @Input() expanded = false;
  @Output() readonly toggleExpanded = new EventEmitter<string>();
  @Output() readonly debugStep = new EventEmitter<TraceStep>();
  @Output() readonly copyRaw = new EventEmitter<TraceStep>();

  hasTokenUsage(step: TraceStep): boolean {
    return Boolean(step.model || step.inputTokens || step.outputTokens || step.totalTokens);
  }

  formatValue(value: unknown): string {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  }
}
