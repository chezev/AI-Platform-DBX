import { Injectable, signal } from '@angular/core';

/**
 * Bridges the AppShell's "New Knowledge Base" CTA to the Knowledge Base list
 * page, which owns the create drawer. The shell increments `requested`; the
 * KnowledgeBaseComponent watches it and opens the drawer.
 */
@Injectable({ providedIn: 'root' })
export class KbCreateState {
  readonly requested = signal(0);

  requestCreate(): void {
    this.requested.update((n) => n + 1);
  }
}
