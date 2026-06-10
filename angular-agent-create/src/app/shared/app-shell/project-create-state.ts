import { Injectable, signal } from '@angular/core';

/**
 * Bridges the AppShell's "New Project" CTA (rendered in the section heading,
 * like "Create Agent") to the Projects page, which owns the create modal.
 * The shell increments `requested`; AgentProjectsListComponent watches it and
 * opens the modal.
 */
@Injectable({ providedIn: 'root' })
export class ProjectCreateState {
  readonly requested = signal(0);

  requestCreate(): void {
    this.requested.update((n) => n + 1);
  }
}
