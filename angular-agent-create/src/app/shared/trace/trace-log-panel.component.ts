import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsIconButtonComponent } from '../spartan/sds-button';
import { buildTraceDebugResult } from './trace.mock';
import { CopilotDebugPanelComponent } from './copilot-debug-panel.component';
import { TraceTimelineComponent } from './trace-timeline.component';
import { TraceDebugResult, TraceStep } from './trace.types';

type TracePanelMode = 'trace' | 'copilot';

/** Rotating status lines shown while the debug "thinks". */
const TRACE_THINKING_STEPS = [
  'Reading the trace...',
  'Checking tools and inputs...',
  'Analyzing token usage...',
  'Spotting retries and failures...',
  'Writing the explanation...',
];

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
                <p class="copilot-help-heading">
                  <app-sds-icon name="bug" [size]="16"></app-sds-icon>
                  I can help you with:
                </p>
                <p class="copilot-help-text">Finding failed tools, high token usage, missing inputs, and retry paths</p>
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
                    <dd>{{ totalTokensDisplay() }}</dd>
                  </div>
                </dl>
              </section>

              @if (debugRequested) {
                <p class="copilot-user-turn">Debug Full Trace</p>
              }

              <app-copilot-debug-panel
                [debugResult]="debugResult"
                [thinking]="debugThinking"
                [thinkingText]="debugThinkingText"
                (debugFull)="debugFullTrace()"
              ></app-copilot-debug-panel>
            </div>

            <footer class="trace-copilot-input" [class.is-typing]="copilotInput.trim().length > 0">
              <label for="trace-copilot-input" class="visually-hidden">Ask Copilot about this trace</label>
              <input
                id="trace-copilot-input"
                type="text"
                placeholder="Debug this trace..."
                [value]="copilotInput"
                (input)="copilotInput = $any($event.target).value"
              />
              @if (copilotInput.trim().length > 0) {
                <button type="button" class="send-button" aria-label="Send Copilot message">
                  <app-sds-icon name="send" [size]="16"></app-sds-icon>
                </button>
              }
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

    /* Canvas-studio AI panel styling: soft purple/peach glow + purple gradient
       border (layered padding-box / border-box backgrounds). */
    .trace-panel.is-copilot {
      border: 1px solid transparent;
      border-radius: 16px;
      background:
        linear-gradient(165.61deg, #ece3fa -3.95%, rgba(254, 255, 255, 0) 21.32%) padding-box,
        linear-gradient(217.61deg, #fcf4eb 2.05%, rgba(255, 255, 255, 0) 16.32%) padding-box,
        linear-gradient(0deg, #ffffff, #ffffff) padding-box,
        linear-gradient(160deg, rgba(181, 139, 246, 0.9) 4%, rgba(181, 139, 246, 0.3) 54%, rgba(181, 139, 246, 0.7) 79%) border-box;
      box-shadow:
        0 0 7px rgba(0, 0, 0, 0.1),
        inset 0 2px 0 rgba(255, 255, 255, 0.5);
    }

    :host-context(.dark) .trace-panel.is-copilot {
      background:
        linear-gradient(165.61deg, rgba(124, 82, 223, 0.22) -3.95%, rgba(24, 24, 27, 0) 26%) padding-box,
        linear-gradient(0deg, #18181b, #18181b) padding-box,
        linear-gradient(160deg, rgba(181, 139, 246, 0.7) 4%, rgba(181, 139, 246, 0.25) 54%, rgba(181, 139, 246, 0.6) 79%) border-box;
      box-shadow: 0 0 7px rgba(0, 0, 0, 0.45);
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
      /* Fade content into the header + input edges (canvas-studio AI panel style). */
      mask-image: linear-gradient(to bottom, transparent 0, #000 32px, #000 calc(100% - 40px), transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 32px, #000 calc(100% - 40px), transparent 100%);
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
      gap: var(--sds-gap-12);
    }

    .copilot-intro p,
    .copilot-help-text,
    .copilot-prompt-card {
      margin: 0;
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    /* Bug icon now sits inline with the heading; the list text is left-aligned. */
    .copilot-help-heading {
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-medium-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    /* User message: right-aligned + narrower so it reads distinctly from the
       left-aligned copilot text. */
    .copilot-prompt-card {
      align-self: flex-end;
      max-width: 80%;
      margin-left: 30px;
      padding: var(--sds-padding-12) var(--sds-padding-16);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-ai-glow-subtle);
      text-align: left;
    }

    /* The "Debug Full Trace" click as its own user turn ABOVE the Copilot answer. */
    .copilot-user-turn {
      align-self: flex-end;
      max-width: 80%;
      margin: 0;
      padding: var(--sds-padding-8) var(--sds-padding-12);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-ai-glow-subtle);
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
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

    /* Standard small input (matches the app's existing inputs), not a tall pill. */
    .trace-copilot-input {
      flex: none;
      min-height: var(--sds-size-40);
      margin: 0 var(--sds-padding-20) var(--sds-padding-16);
      padding: var(--sds-padding-4) var(--sds-padding-8) var(--sds-padding-4) var(--sds-padding-12);
      border: 1px solid var(--sds-border-primary-default);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      display: flex;
      align-items: center;
      gap: var(--sds-gap-8);
      transition: border-color 140ms ease, box-shadow 140ms ease;
    }

    /* Purple focus ring (was blue in the reference design). */
    .trace-copilot-input:focus-within {
      border-color: var(--sds-ai-border-active);
      box-shadow: 0 0 0 1px var(--sds-ai-border-active);
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

    /* Bare dark-grey SDS send icon (no circle), only present while typing. */
    .send-button {
      min-width: var(--sds-size-28);
      height: var(--sds-size-28);
      padding: 0;
      border: none;
      background: transparent;
      color: #5a5a5a;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
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

  private readonly cdr = inject(ChangeDetectorRef);

  expandedIds = new Set<string>();
  debugResult: TraceDebugResult | null = null;
  debugThinking = false;
  debugRequested = false;
  debugThinkingText = TRACE_THINKING_STEPS[0];
  debugConsumedTokens = 0;
  copilotInput = '';
  panelMode: TracePanelMode = 'trace';
  wide = false;
  private debugTimer?: ReturnType<typeof setTimeout>;
  private thinkingTimer?: ReturnType<typeof setTimeout>;
  private blinkTimer?: ReturnType<typeof setTimeout>;

  ngOnChanges(changes: SimpleChanges): void {
    // A fresh open (or close) fully resets, including collapsing to non-wide.
    if (changes['open']) {
      this.resetPanelState();
      return;
    }
    // Navigating between traces while the panel stays open only refreshes the
    // content — the expanded (wide) state is preserved until the user collapses.
    if (changes['steps'] || changes['responseId']) {
      this.refreshTraceContent();
    }
  }

  setPanelMode(mode: TracePanelMode): void {
    // Opening AI Assist no longer auto-debugs — the user starts it from the button.
    this.panelMode = mode;
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
    this.debugThinking = false;
    this.debugRequested = false;
    clearTimeout(this.debugTimer);
    clearTimeout(this.thinkingTimer);
    clearTimeout(this.blinkTimer);
    this.debugResult = buildTraceDebugResult(this.steps, step);
    this.debugConsumedTokens = 720 + (step.totalTokens ?? 0);
    this.expandedIds = new Set([...this.expandedIds, step.id]);
    this.panelMode = 'copilot';
  }

  debugFullTrace(): void {
    // The click is the user's turn ("Debug Full Trace", rendered above); the answer
    // is a terminal-style typewriter phase then the detailed result. Tokens are
    // consumed by the request (input prompt + output answer).
    clearTimeout(this.debugTimer);
    clearTimeout(this.thinkingTimer);
    clearTimeout(this.blinkTimer);
    this.debugRequested = true;
    this.debugThinking = true;
    this.debugResult = null;
    this.runThinkingTypewriter();

    this.debugTimer = setTimeout(() => {
      clearTimeout(this.thinkingTimer);
    clearTimeout(this.blinkTimer);
      this.debugThinking = false;
      this.debugResult = buildTraceDebugResult(this.steps);
      this.debugConsumedTokens = 900 + this.steps.length * 180 + 420;
      this.cdr.markForCheck();
    }, 5500);
  }

  /**
   * Terminal typewriter: a single one-cell caret at the frontier blinks ON/OFF
   * between block `█` and underscore `_` (never both at once). Letters fill in as
   * it advances; the first line types out, then each next line is written IN PLACE
   * over the previous one.
   */
  private runThinkingTypewriter(): void {
    const steps = TRACE_THINKING_STEPS;
    const TYPE_MS = 75;
    const BLINK_MS = 340;
    const HOLD_MS = 520;

    let msgIdx = 0;
    let oldText = '';
    let target = steps[0];
    let i = 0;
    let cursorOn = true;

    const render = () => {
      const caret = cursorOn ? '█' : '_';
      this.debugThinkingText =
        i >= target.length ? target + caret : target.slice(0, i) + caret + oldText.slice(i + 1);
      this.cdr.markForCheck();
    };

    const blink = () => {
      cursorOn = !cursorOn;
      render();
      this.blinkTimer = setTimeout(blink, BLINK_MS);
    };

    const type = () => {
      if (i > target.length) {
        this.thinkingTimer = setTimeout(() => {
          oldText = target;
          msgIdx = (msgIdx + 1) % steps.length;
          target = steps[msgIdx];
          i = 0;
          type();
        }, HOLD_MS);
        return;
      }
      render();
      i += 1;
      this.thinkingTimer = setTimeout(type, TYPE_MS);
    };

    render();
    this.thinkingTimer = setTimeout(type, TYPE_MS);
    this.blinkTimer = setTimeout(blink, BLINK_MS);
  }

  totalTokensDisplay(): number {
    return this.totalTokens() + this.debugConsumedTokens;
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

  private refreshTraceContent(): void {
    if (!this.open) return;

    const expanded = this.steps
      .filter((step, index) => step.status === 'failed' || step.status === 'waiting' || (index === 0 && step.type === 'llm_call'))
      .map((step) => step.id);

    this.expandedIds = new Set(expanded);
    this.debugResult = null;
    this.debugThinking = false;
    this.debugRequested = false;
    this.debugConsumedTokens = 0;
    clearTimeout(this.debugTimer);
    clearTimeout(this.thinkingTimer);
    clearTimeout(this.blinkTimer);
    this.panelMode = 'trace';
  }

  private resetPanelState(): void {
    if (!this.open) return;

    this.refreshTraceContent();
    this.wide = false;
    this.expandedChange.emit(false);
  }

  private copyText(value: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(value);
    }
  }
}
