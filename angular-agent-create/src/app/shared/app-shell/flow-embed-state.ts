import { Injectable, signal } from '@angular/core';

/**
 * Bridges the embedded canvas-studio iframe and the Angular AppShell.
 * AgenticFlowsComponent flips `inBuilder` when the React app opens the reactflow
 * canvas; the shell reads it to collapse its chrome down to just the breadcrumb.
 */
@Injectable({ providedIn: 'root' })
export class FlowEmbedState {
  readonly inBuilder = signal(false);

  // Set when the shell's "Create" menu is used; AgenticFlowsComponent watches it
  // and posts a message into the iframe to open the matching create flow.
  readonly createRequest = signal<{ kind: 'scratch' | 'ai'; n: number }>({ kind: 'scratch', n: 0 });

  requestCreate(kind: 'scratch' | 'ai'): void {
    this.createRequest.update((request) => ({ kind, n: request.n + 1 }));
  }
}
