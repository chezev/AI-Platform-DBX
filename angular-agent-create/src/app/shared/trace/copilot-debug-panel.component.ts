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
          {{ thinking || debugResult ? 'Retry' : 'Debug Full Trace' }}
        </button>
      </header>

      @if (thinking) {
        <div class="debug-thinking" aria-live="polite">
          <span class="firework" aria-hidden="true"></span>
          <span class="terminal-line">{{ thinkingText }}</span>
        </div>
      } @else if (debugResult) {
        <article class="debug-answer" aria-live="polite">
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
    }

    dl {
      margin: 0;
      display: flex;
      flex-direction: column;
      /* Block = title + description; +4px between blocks (12 -> 16). */
      gap: var(--sds-gap-16);
    }

    dl div {
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
    }

    /* Section titles read as titles. */
    dt {
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-m-medium-font-size);
      font-weight: var(--sds-body-m-medium-font-weight);
      line-height: var(--sds-body-m-medium-line-height);
    }

    dd {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
    }

    /* ── Thinking: animated AI icon + terminal typewriter text with block cursor ── */
    .debug-thinking {
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
      font-size: var(--sds-body-s-book-font-size);
      line-height: var(--sds-body-s-book-line-height);
    }

    /* Asterisk that blooms like a firework: square -> plus -> asterisk -> star
       -> flower, with a scale/spin burst. */
    .firework {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      font-size: 16px;
      line-height: 1;
      color: var(--sds-bg-neutralBlue-active);
      text-shadow: 0 0 6px rgba(1, 131, 255, 0.45);
    }

    /* Slow, frame-by-frame bloom so each shape is clearly visible. */
    .firework::before {
      content: '✳';
      display: inline-block;
      color: var(--sds-bg-neutralBlue-active);
      animation:
        trace-fw-glyph 1.1s steps(1) infinite,
        trace-fw-burst 1.1s ease-in-out infinite;
    }

    @keyframes trace-fw-glyph {
      0% { content: '▪'; }
      20% { content: '✚'; }
      40% { content: '✳'; }
      60% { content: '✶'; }
      80% { content: '❋'; }
    }

    @keyframes trace-fw-burst {
      0% { transform: scale(0.72); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.72); opacity: 0.6; }
    }

    .terminal-line {
      font-family: ui-monospace, 'SF Mono', 'SFMono-Regular', Menlo, Consolas, monospace;
      color: var(--sds-text-neutral-title);
      white-space: pre;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotDebugPanelComponent {
  @Input() debugResult: TraceDebugResult | null = null;
  @Input() thinking = false;
  @Input() thinkingText = 'Debugging…';
  @Output() readonly debugFull = new EventEmitter<void>();
}
