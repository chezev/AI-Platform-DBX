import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsIconButtonComponent } from '../spartan/sds-button';
import { buildTraceDebugResult } from './trace.mock';
import { CopilotDebugPanelComponent } from './copilot-debug-panel.component';
import { TraceTimelineComponent } from './trace-timeline.component';
import { TraceDebugResult, TraceStep } from './trace.types';

type TracePanelMode = 'trace' | 'copilot';

@Component({
  selector: 'app-trace-log-panel',
  standalone: true,
  imports: [SdsIconButtonComponent, SdsIconComponent, TraceTimelineComponent, CopilotDebugPanelComponent],
  template: `
    @if (open) {
      <div class="trace-panel-shell" [class.is-wide]="wide">
        <aside class="trace-panel" [class.is-copilot]="panelMode === 'copilot'" aria-label="Trace Log">
          <header class="trace-header">
            <div class="trace-title">
              <app-sds-icon [name]="panelMode === 'trace' ? 'wrench' : 'ai-panel'" [size]="16"></app-sds-icon>
              <h2>{{ panelMode === 'trace' ? 'Trace Log' : 'AI Assist' }}</h2>
            </div>
            <div class="trace-header-actions">
              <button type="button" sdsIconButton variant="ghost" size="xs" [attr.aria-label]="wide ? 'Collapse Trace Log' : 'Expand Trace Log'" (click)="toggleWide()">
                <app-sds-icon [name]="wide ? 'minimize' : 'maximize'" [size]="12"></app-sds-icon>
              </button>
              <button type="button" sdsIconButton variant="ghost" size="xs" aria-label="Close Trace Log" (click)="closePanel.emit()">
                <app-sds-icon name="x" [size]="12"></app-sds-icon>
              </button>
            </div>
          </header>

          @if (panelMode === 'trace') {
            <div class="trace-scroll" aria-label="Trace timeline">
              <app-trace-timeline
                [steps]="steps"
                [expandedIds]="expandedIds"
                (toggleStep)="toggleStep($event)"
                (debugStep)="debugTraceStep($event)"
                (copyRaw)="copyRawLog($event)"
              ></app-trace-timeline>
            </div>
          } @else {
            <div class="trace-copilot-body" aria-label="Trace copilot">
              <div class="copilot-intro">
                <p>
                  I can debug this response trace, explain what happened, and point to the step that needs attention.
                </p>
                <p>I can help you with:</p>
                <div class="copilot-help-line">
                  <app-sds-icon name="bug" [size]="18"></app-sds-icon>
                  <span>Finding failed tools, high token usage, missing inputs, and retry paths</span>
                </div>
              </div>

              <article class="copilot-prompt-card">
                Review the selected trace and suggest what to fix.
              </article>

              <section class="copilot-context" aria-label="Selected trace context">
                <dl>
                  <div>
                    <dt>Steps</dt>
                    <dd>{{ steps.length }}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{{ traceStatusLabel() }}</dd>
                  </div>
                  <div>
                    <dt>Total Tokens</dt>
                    <dd>{{ totalTokens() }}</dd>
                  </div>
                </dl>
              </section>

              <app-copilot-debug-panel [debugResult]="debugResult" (debugFull)="debugFullTrace()"></app-copilot-debug-panel>
            </div>

            <footer class="trace-copilot-input">
              <label for="trace-copilot-input" class="visually-hidden">Ask Copilot about this trace</label>
              <input id="trace-copilot-input" type="text" placeholder="Debug this trace..." />
              <button type="button" class="attachment-button" aria-label="Attach trace context">
                <app-sds-icon name="paperclip" [size]="16"></app-sds-icon>
              </button>
              <button type="button" class="send-button" aria-label="Send Copilot message">
                <app-sds-icon name="send" [size]="16"></app-sds-icon>
              </button>
            </footer>
          }
        </aside>

        <div class="trace-mode-switcher" aria-label="Trace panel mode">
          <button
            type="button"
            class="mode-button"
            [class.is-active]="panelMode === 'trace'"
            aria-label="Show Trace Log"
            (click)="setPanelMode('trace')"
          >
            <app-sds-icon name="file-text" [size]="16"></app-sds-icon>
          </button>
          <button
            type="button"
            class="mode-button"
            [class.is-active]="panelMode === 'copilot'"
            aria-label="Show AI Assist"
            (click)="setPanelMode('copilot')"
          >
            <app-sds-icon name="ai-panel" [size]="16"></app-sds-icon>
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      min-height: 0;
      height: 100%;
    }

    .trace-panel-shell {
      --trace-mode-switcher-width: 88px;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: visible;
      display: grid;
      grid-template-columns: minmax(0, var(--trace-panel-width, 388px)) var(--trace-mode-switcher-width);
      column-gap: var(--sds-gap-16);
      align-items: stretch;
      animation: panel-enter 160ms ease-out;
    }

    .trace-panel {
      min-height: 0;
      height: 100%;
      width: 100%;
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      box-shadow: var(--sds-shadow-card);
      color: var(--sds-text-neutral-body);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .trace-panel.is-copilot {
      background:
        linear-gradient(165deg, var(--sds-ai-glow-subtle) 0%, transparent 28%),
        var(--sds-bg-neutralWhite-default);
    }

    .trace-header {
      flex: none;
      min-height: var(--sds-size-56);
      padding: var(--sds-padding-8) var(--sds-padding-16);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sds-gap-16);
      background: transparent;
    }

    .trace-title,
    .trace-header-actions {
      display: inline-flex;
      align-items: center;
    }

    .trace-title {
      min-width: 0;
      gap: var(--sds-gap-8);
      color: var(--sds-text-neutral-label);
    }

    .trace-title h2 {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-l-book-font-size);
      font-weight: var(--sds-body-l-book-font-weight);
      line-height: var(--sds-body-l-book-line-height);
    }

    .trace-header-actions {
      gap: var(--sds-gap-4);
    }

    .trace-header-actions button {
      --sds-icon-button-size: var(--sds-size-24);
      color: var(--sds-text-neutral-label);
    }

    .trace-scroll,
    .trace-copilot-body {
      min-height: 0;
      flex: 1 1 auto;
      overflow: auto;
      scrollbar-width: none;
    }

    .trace-scroll {
      padding: var(--sds-padding-8) var(--sds-padding-16) var(--sds-padding-16);
    }

    .trace-copilot-body {
      padding: var(--sds-padding-20);
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-24);
    }

    .trace-scroll:hover,
    .trace-copilot-body:hover {
      scrollbar-width: thin;
    }

    .trace-scroll::-webkit-scrollbar,
    .trace-copilot-body::-webkit-scrollbar {
      width: 0;
    }

    .trace-scroll:hover::-webkit-scrollbar,
    .trace-copilot-body:hover::-webkit-scrollbar {
      width: 3px;
    }

    .trace-scroll::-webkit-scrollbar-thumb,
    .trace-copilot-body::-webkit-scrollbar-thumb {
      background: var(--sds-bg-primary-readOnly);
      border-radius: var(--sds-border-radius-full);
    }

    .copilot-intro {
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-24);
    }

    .copilot-intro p,
    .copilot-help-line span,
    .copilot-prompt-card {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    .copilot-help-line {
      padding-left: var(--sds-padding-16);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: var(--sds-gap-8);
      align-items: start;
    }

    .copilot-prompt-card {
      margin-inline: var(--sds-padding-16);
      padding: var(--sds-padding-16);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-ai-glow-subtle);
    }

    .copilot-context {
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralGrey-light1);
      padding: var(--sds-padding-12);
    }

    .copilot-context dl {
      margin: 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--sds-gap-12);
    }

    .copilot-context div {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
    }

    .copilot-context dt {
      color: var(--sds-text-neutral-ghost);
      font-size: var(--sds-caption-medium-font-size);
      font-weight: var(--sds-caption-medium-font-weight);
      line-height: var(--sds-caption-medium-line-height);
    }

    .copilot-context dd {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      font-weight: var(--sds-body-s-book-font-weight);
      line-height: var(--sds-body-s-book-line-height);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .trace-copilot-input {
      flex: none;
      min-height: var(--sds-size-56);
      margin: 0 var(--sds-padding-20) var(--sds-padding-16);
      padding: var(--sds-padding-4) var(--sds-padding-4) var(--sds-padding-4) var(--sds-padding-12);
      border: 1px solid var(--sds-border-primary-default);
      border-radius: var(--sds-border-radius-24);
      background: var(--sds-bg-neutralGrey-light1);
      display: flex;
      align-items: center;
      gap: var(--sds-gap-8);
    }

    .trace-copilot-input input {
      min-width: 0;
      flex: 1 1 auto;
      border: none;
      background: transparent;
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    .trace-copilot-input input:focus {
      outline: none;
    }

    .attachment-button,
    .send-button {
      min-width: var(--sds-size-36);
      height: var(--sds-size-36);
      border: none;
      border-radius: var(--sds-border-radius-full);
      background: transparent;
      color: var(--sds-text-neutral-label);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .send-button {
      background: var(--sds-bg-primary-active);
      color: var(--sds-text-neutral-negative);
    }

    .send-button app-sds-icon {
      --sds-icon-filter: brightness(0) saturate(100%) invert(100%);
    }

    .trace-mode-switcher {
      z-index: 10;
      width: var(--trace-mode-switcher-width);
      align-self: end;
      justify-self: start;
      padding: var(--sds-padding-4);
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      box-shadow: var(--sds-shadow-card);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--sds-gap-4);
    }

    .mode-button {
      min-width: 0;
      height: var(--sds-size-32);
      border: none;
      border-radius: var(--sds-border-radius-4);
      background: transparent;
      color: var(--sds-text-neutral-label);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      transition:
        background-color 120ms ease,
        color 120ms ease;
    }

    .mode-button:hover,
    .mode-button:focus-visible,
    .mode-button.is-active {
      background: var(--sds-bg-neutralGrey-light2);
      color: var(--sds-text-neutral-title);
      outline: none;
    }

    .mode-button:last-child {
      color: var(--sds-bg-neutralBlue-active);
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes panel-enter {
      from {
        opacity: 0;
        transform: translateX(calc(-1 * var(--sds-size-16)));
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraceLogPanelComponent implements OnChanges {
  @Input() open = false;
  @Input() responseId = '';
  @Input() steps: TraceStep[] = [];
  @Output() readonly closePanel = new EventEmitter<void>();
  @Output() readonly expandedChange = new EventEmitter<boolean>();

  expandedIds = new Set<string>();
  debugResult: TraceDebugResult | null = null;
  panelMode: TracePanelMode = 'trace';
  wide = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['steps'] || changes['responseId'] || changes['open']) {
      this.resetPanelState();
    }
  }

  setPanelMode(mode: TracePanelMode): void {
    this.panelMode = mode;
    if (mode === 'copilot' && !this.debugResult) {
      this.debugFullTrace();
    }
  }

  toggleWide(): void {
    this.wide = !this.wide;
    this.expandedChange.emit(this.wide);
  }

  toggleStep(stepId: string): void {
    const next = new Set(this.expandedIds);
    if (next.has(stepId)) {
      next.delete(stepId);
    } else {
      next.add(stepId);
    }
    this.expandedIds = next;
  }

  debugTraceStep(step: TraceStep): void {
    this.debugResult = buildTraceDebugResult(this.steps, step);
    this.expandedIds = new Set([...this.expandedIds, step.id]);
    this.panelMode = 'copilot';
  }

  debugFullTrace(): void {
    this.debugResult = buildTraceDebugResult(this.steps);
  }

  copyRawLog(step: TraceStep): void {
    this.copyText(JSON.stringify(step.rawLog ?? step, null, 2));
  }

  traceStatusLabel(): string {
    if (this.steps.some((step) => step.status === 'failed')) return 'Failed';
    if (this.steps.some((step) => step.status === 'waiting')) return 'Waiting';
    if (this.steps.some((step) => step.status === 'running')) return 'Running';
    if (this.steps.some((step) => step.status === 'retried')) return 'Retried';
    return 'Success';
  }

  totalTokens(): number {
    return this.steps.reduce((total, step) => total + (step.totalTokens ?? 0), 0);
  }

  private resetPanelState(): void {
    if (!this.open) return;

    const expanded = this.steps
      .filter((step, index) => step.status === 'failed' || step.status === 'waiting' || (index === 0 && step.type === 'llm_call'))
      .map((step) => step.id);

    this.expandedIds = new Set(expanded);
    this.debugResult = null;
    this.panelMode = 'trace';
    this.wide = false;
    this.expandedChange.emit(false);
  }

  private copyText(value: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(value);
    }
  }
}
