import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TraceStep } from './trace.types';

@Component({
  selector: 'app-chat-trace-link',
  standalone: true,
  template: `
    @if (steps.length) {
      <button type="button" class="trace-link" (click)="openTrace.emit(responseId)">
        View Traces ({{ steps.length }} {{ steps.length === 1 ? 'Step' : 'Steps' }})
      </button>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .trace-link {
      border: none;
      background: transparent;
      color: var(--sds-bg-neutralBlue-active);
      padding: 0;
      font-family: inherit;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
      cursor: pointer;
      text-align: left;
    }

    .trace-link:hover,
    .trace-link:focus-visible {
      text-decoration: underline;
      outline: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTraceLinkComponent {
  @Input({ required: true }) responseId = '';
  @Input() steps: TraceStep[] = [];
  @Output() readonly openTrace = new EventEmitter<string>();
}
