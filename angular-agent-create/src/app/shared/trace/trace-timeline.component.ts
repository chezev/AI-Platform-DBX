import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { TraceStepCardComponent } from './trace-step-card.component';
import { TraceStatus, TraceStep } from './trace.types';

@Component({
  selector: 'app-trace-timeline',
  standalone: true,
  imports: [SdsIconComponent, TraceStepCardComponent],
  template: `
    <div class="trace-timeline" role="list" aria-label="Trace steps">
      @for (step of steps; track step.id; let last = $last) {
        <div class="timeline-item" role="listitem" [class.is-last]="last" [class.is-expanded]="expandedIds.has(step.id)" [attr.data-status]="step.status">
          <div class="timeline-rail" aria-hidden="true">
            <span class="status-marker">
              <app-sds-icon [name]="statusIcon(step.status)" [size]="8"></app-sds-icon>
            </span>
          </div>
          <div class="timeline-content">
            <time>{{ step.timestamp }}</time>
            <app-trace-step-card
              [step]="step"
              [expanded]="expandedIds.has(step.id)"
              (toggleExpanded)="toggleStep.emit($event)"
              (debugStep)="debugStep.emit($event)"
              (copyRaw)="copyRaw.emit($event)"
            ></app-trace-step-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .trace-timeline {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-20);
    }

    .trace-timeline::before {
      content: '';
      position: absolute;
      z-index: 0;
      top: var(--sds-size-12);
      bottom: var(--sds-padding-4);
      left: calc(var(--sds-size-12) - var(--sds-padding-8) + 1px);
      width: 1px;
      background: var(--sds-border-primary-subtle);
      pointer-events: none;
    }

    .trace-timeline::after {
      content: '';
      position: absolute;
      z-index: 1;
      left: calc(var(--sds-size-12) - var(--sds-padding-8) - 1px);
      bottom: 0;
      width: var(--sds-padding-4);
      height: var(--sds-padding-4);
      border-radius: var(--sds-border-radius-full);
      background: var(--sds-border-primary-subtle);
      pointer-events: none;
    }

    .timeline-item {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: var(--sds-size-12) minmax(0, 1fr);
      gap: var(--sds-gap-12);
    }

    .timeline-rail {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      padding-top: calc(var(--sds-padding-4) / 2);
    }

    .status-marker {
      width: var(--sds-size-12);
      height: var(--sds-size-12);
      border-radius: var(--sds-border-radius-full);
      background: var(--sds-bg-feedback-successHigh);
      color: var(--sds-text-neutral-negative);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .timeline-item[data-status='running'] .status-marker,
    .timeline-item[data-status='waiting'] .status-marker {
      background: var(--sds-bg-feedback-infoMid);
      color: var(--sds-text-neutral-title);
    }

    .timeline-item[data-status='failed'] .status-marker {
      background: var(--sds-bg-feedback-errorHigh);
    }

    .timeline-item[data-status='retried'] .status-marker {
      background: var(--sds-bg-feedback-warningHigh);
      color: var(--sds-text-neutral-title);
    }

    .timeline-item[data-status='skipped'] .status-marker {
      background: var(--sds-bg-neutralGrey-hover);
      color: var(--sds-text-neutral-label);
    }

    .timeline-content {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-8);
    }

    time {
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraceTimelineComponent {
  @Input() steps: TraceStep[] = [];
  @Input() expandedIds = new Set<string>();
  @Output() readonly toggleStep = new EventEmitter<string>();
  @Output() readonly debugStep = new EventEmitter<TraceStep>();
  @Output() readonly copyRaw = new EventEmitter<TraceStep>();

  statusIcon(status: TraceStatus): string {
    const iconByStatus: Record<TraceStatus, string> = {
      success: 'check',
      running: 'clock-3',
      waiting: 'clock-3',
      failed: 'x',
      retried: 'rotate-cw',
      skipped: 'circle-dot',
    };

    return iconByStatus[status];
  }
}
