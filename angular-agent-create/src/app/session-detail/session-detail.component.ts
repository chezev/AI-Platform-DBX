import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { ChatTraceLinkComponent } from '../shared/trace/chat-trace-link.component';
import { cloneTraceStepsForResponse } from '../shared/trace/trace.mock';
import { TraceLogPanelComponent } from '../shared/trace/trace-log-panel.component';
import { TraceStep } from '../shared/trace/trace.types';

interface SessionMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  tokens?: number;
  cost?: string;
  traceSteps?: TraceStep[];
}

interface SessionStat {
  label: string;
  value: string;
}

/**
 * Session detail = the entire conversation (multiple runs/turns) for a session.
 * Same layout as the Run detail (it reuses run-detail's stylesheet); only the
 * data differs — a session spans several user/assistant turns.
 */
@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SdsAppTopbarComponent, ChatTraceLinkComponent, TraceLogPanelComponent],
  templateUrl: './session-detail.component.html',
  styleUrl: '../run-detail/run-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly sessionId = this.route.snapshot.paramMap.get('sessionId') ?? '3f06ebb9-e10a-42c8-8f0b-2d6c1a9e7b54';
  readonly agentName = 'Product Adoption Agent';
  readonly sessionMeta = `${this.agentName} · May 26, 2026 · 5 turns`;

  readonly stats: SessionStat[] = [
    { label: 'Turns', value: '5' },
    { label: 'Total tokens', value: '248,914' },
    { label: 'Total Cost', value: '$0.7642' },
    { label: 'Duration', value: '1m 12s' },
    { label: 'Failed Turns', value: '0' },
    { label: 'Success', value: '5' },
  ];

  readonly messages: SessionMessage[] = [
    { id: 's-u1', role: 'user', text: 'Hi, can you give me adoption numbers for Recruitment for Yes Bank for Feb 2026?', time: '08:35:35' },
    {
      id: 's-a1',
      role: 'assistant',
      text: 'I found YES Bank in the client list (UCC: INWeYe05A). Confirming before I proceed — is this the right client?',
      time: '08:35:38',
      tokens: 43280,
      cost: '$0.1321',
      traceSteps: cloneTraceStepsForResponse('file-resume-parse', 's-a1'),
    },
    { id: 's-u2', role: 'user', text: "Yes, that's the right client.", time: '08:36:02' },
    {
      id: 's-a2',
      role: 'assistant',
      text: 'Recruitment module adoption for YES Bank (Feb 2026): 72% active usage, up 8% MoM. The biggest drop-off is in offer management.',
      time: '08:36:09',
      tokens: 51200,
      cost: '$0.1620',
      traceSteps: cloneTraceStepsForResponse('simple-llm-response', 's-a2'),
    },
    { id: 's-u3', role: 'user', text: 'What action do you recommend?', time: '08:36:40' },
    {
      id: 's-a3',
      role: 'assistant',
      text: 'Recommend enabling offer-approval reminders and a CSM check-in focused on offer management. Want me to draft the action plan?',
      time: '08:36:46',
      tokens: 48900,
      cost: '$0.1544',
      traceSteps: cloneTraceStepsForResponse('file-resume-parse', 's-a3'),
    },
  ];

  readonly selectedResponseId = signal<string | null>(null);
  readonly tracePanelExpanded = signal(false);

  readonly selectedTraceSteps = computed(() => {
    const id = this.selectedResponseId();
    if (!id) return [] as TraceStep[];
    return this.messages.find((message) => message.id === id)?.traceSteps ?? [];
  });

  openTrace(responseId: string): void {
    this.selectedResponseId.set(responseId);
  }

  closeTrace(): void {
    this.selectedResponseId.set(null);
    this.tracePanelExpanded.set(false);
  }

  onTraceExpandedChange(expanded: boolean): void {
    this.tracePanelExpanded.set(expanded);
  }

  trackMessage(_index: number, message: SessionMessage): string {
    return message.id;
  }

  // Highlight the user + assistant turn whose trace is open (like the test screen).
  isTracePairSelected(index: number, message: SessionMessage): boolean {
    const selected = this.selectedResponseId();
    if (!selected) return false;
    if (message.id === selected) return true;
    const next = this.messages[index + 1];
    return message.role === 'user' && next?.id === selected;
  }
}
