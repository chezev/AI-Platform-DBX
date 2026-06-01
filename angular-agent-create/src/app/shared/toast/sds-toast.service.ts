import { Injectable, signal } from '@angular/core';

export type SdsToastVariant = 'info' | 'success' | 'error';

export interface SdsToastMessage {
  id: number;
  message: string;
  variant: SdsToastVariant;
}

@Injectable({ providedIn: 'root' })
export class SdsToastService {
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  readonly toast = signal<SdsToastMessage | null>(null);

  show(message: string, variant: SdsToastVariant = 'info', durationMs = 5000): void {
    this.clearTimer();
    this.toast.set({
      id: Date.now(),
      message,
      variant,
    });

    this.closeTimer = setTimeout(() => this.dismiss(), durationMs);
  }

  dismiss(): void {
    this.clearTimer();
    this.toast.set(null);
  }

  private clearTimer(): void {
    if (!this.closeTimer) {
      return;
    }

    clearTimeout(this.closeTimer);
    this.closeTimer = null;
  }
}
