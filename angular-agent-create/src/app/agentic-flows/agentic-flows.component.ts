import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, effect, inject } from '@angular/core';
import { FlowEmbedState } from '../shared/app-shell/flow-embed-state';

/**
 * Agentic Flows = the React canvas-studio app (flows list + reactflow builder)
 * embedded via a same-origin iframe (built into public/agentic-flows/).
 *
 * canvas-studio's source is NOT touched. From the Angular side we:
 *  - inject CSS to hide its own global <header>, left sidebar, and the redundant
 *    list title (the Angular shell already provides the top chrome);
 *  - watch the iframe DOM for the reactflow canvas (`.react-flow`) to know when
 *    the builder is open, and tell the shell to collapse to a breadcrumb-only view.
 */
@Component({
  selector: 'app-agentic-flows',
  standalone: true,
  template: `
    <iframe
      class="flows-frame"
      src="agentic-flows/index.html"
      title="Agentic Flows"
      (load)="onFrameLoad($event)"
    ></iframe>
  `,
  styles: `
    :host {
      display: block;
      /* Below the topbar (56) + product nav (48) + section heading (48). */
      height: calc(100dvh - 152px);
      background: var(--sds-bg-neutralGrey-light2);
    }

    /* In the builder the shell hides its chrome, so the iframe takes the screen. */
    :host(.is-builder) {
      height: 100dvh;
    }

    .flows-frame {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }
  `,
  host: { '[class.is-builder]': 'embed.inBuilder()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenticFlowsComponent implements OnDestroy {
  protected readonly embed = inject(FlowEmbedState);
  private readonly zone = inject(NgZone);
  private observer?: MutationObserver;
  private themeObserver?: MutationObserver;
  private frameWindow: Window | null = null;
  private frameDoc: Document | null = null;

  constructor() {
    // When the shell's "Create" menu is used, tell the embedded app which option
    // to open (scratch -> modal, ai -> build-with-AI). Skips the initial value.
    effect(() => {
      const request = this.embed.createRequest();
      if (request.n > 0) {
        this.frameWindow?.postMessage({ type: 'sds:create-flow', kind: request.kind }, '*');
      }
    });
  }

  onFrameLoad(event: Event): void {
    const frame = event.target as HTMLIFrameElement;
    this.frameWindow = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!doc) return;
    this.frameDoc = doc;

    this.injectChromeOverrides(doc);
    this.syncDarkMode();

    // Mirror the shell's dark-mode class (toggled on the parent <html>) into the
    // iframe so the embedded app re-themes via its own SDS tokens.
    this.themeObserver?.disconnect();
    this.themeObserver = new MutationObserver(() => this.syncDarkMode());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // The React app switches list <-> builder without reloading, so watch the
    // DOM rather than relying on the load event alone.
    this.observer?.disconnect();
    this.observer = new MutationObserver(() => this.zone.run(() => this.syncBuilderState(doc)));
    this.observer.observe(doc.body, { childList: true, subtree: true });
    this.zone.run(() => this.syncBuilderState(doc));
  }

  private syncDarkMode(): void {
    const dark = document.documentElement.classList.contains('dark');
    this.frameDoc?.documentElement.classList.toggle('dark', dark);
  }

  private syncBuilderState(doc: Document): void {
    this.embed.inBuilder.set(!!doc.querySelector('.react-flow'));
  }

  private injectChromeOverrides(doc: Document): void {
    const STYLE_ID = 'sds-embed-overrides';
    if (doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement('style');
    style.id = STYLE_ID;
    // Hide only the global Darwinbox bars (the ones containing the logo) so we
    // don't also hide the Create-Flow modal header / other headers. :has() keeps
    // working when the builder's header is added later (CSS applies to new nodes).
    style.textContent = `
      header:has(img[src*="darwinbox-logo"]) { display: none !important; }
      .af-sidebar { display: none !important; }    /* left nav on the list */
      .af-page-title { display: none !important; } /* redundant list title (shell labels the section) */

      /* Drop the leading icon before the flow name. */
      .af-flow-icon { display: none !important; }

      /* "Created By" avatar: subtle tint + dark-grey initials (was a hard blue). */
      .af-avatar {
        background: var(--sds-bg-neutralBlue-light1) !important;
        color: var(--sds-text-neutral-label) !important;
      }

      /* Dark mode — mirrors the shell's shadcn-zinc palette by re-mapping the
         embedded app's own SDS tokens. Activated by the .dark class we sync onto
         the iframe <html>. */
      html.dark {
        --sds-bg-primary-active: #000000;
        --sds-bg-primary-hover: #27272a;
        --sds-bg-primary-full: #000000;
        --sds-bg-neutralWhite-default: #18181b;
        --sds-bg-neutralGrey-light1: #1f1f23;
        --sds-bg-neutralGrey-light2: #0c0c0e;
        --sds-bg-neutralGrey-light3: #141417;
        --sds-bg-neutralGrey-light4: #27272a;
        --sds-bg-neutralBlue-light1: #15233a;
        --sds-bg-neutralBlue-default: #1e3a5f;
        --sds-bg-neutralBlue-active: #3b82f6;
        --sds-bg-feedback-successLow: #0f2a1d;
        --sds-bg-feedback-warningLow: #2a2310;
        --sds-bg-feedback-infoLow: #122436;
        --sds-bg-feedback-infoMid: #1e3a5f;
        --sds-bg-overlay-blanket: rgba(0, 0, 0, 0.7);
        --sds-border-primary-default: #3f3f46;
        --sds-border-primary-subtle: #27272a;
        --sds-border-neutralGrey-light1: #18181b;
        --sds-border-neutralGrey-light2: #27272a;
        --sds-border-neutralGrey-light3: #3f3f46;
        --sds-border-neutralGrey-hover: #52525b;
        --sds-border-neutralBlue-active: #3b82f6;
        --sds-border-feedback-successMid: #1f5138;
        --sds-text-neutral-title: #fafafa;
        --sds-text-neutral-body: #d4d4d8;
        --sds-text-neutral-label: #d4d4d8;
        --sds-text-neutral-ghost: #a1a1aa;
        --sds-text-neutral-disabled: #71717a;
        --sds-text-neutralBlue-active: #3b82f6;
        --sds-text-feedback-success: #4ade80;
        --sds-icon-neutral-default: #a1a1aa;
        --sds-icon-neutral-hover: #fafafa;
        --sds-icon-neutralBlue-active: #3b82f6;
      }
    `;
    doc.head.appendChild(style);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.themeObserver?.disconnect();
    this.embed.inBuilder.set(false);
  }
}
