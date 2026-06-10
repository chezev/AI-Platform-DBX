import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { ChatTraceLinkComponent } from '../shared/trace/chat-trace-link.component';
import { cloneTraceStepsForResponse } from '../shared/trace/trace.mock';
import { TraceLogPanelComponent } from '../shared/trace/trace-log-panel.component';
import { TraceStep } from '../shared/trace/trace.types';

interface RunMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  tokens?: number;
  cost?: string;
  traceSteps?: TraceStep[];
}

interface RunStat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-run-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SdsAppTopbarComponent, ChatTraceLinkComponent, TraceLogPanelComponent],
  templateUrl: './run-detail.component.html',
  styleUrl: './run-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly runId = this.route.snapshot.paramMap.get('runId') ?? 'a421600c-2f8e-4c7a-9d11-7b2c9e0a4d31';
  readonly agentName = 'Product Adoption Agent';
  readonly runMeta = `${this.agentName} · May 26, 2026 · 2 turns`;

  readonly stats: RunStat[] = [
    { label: 'Turns', value: '2' },
    { label: 'Total tokens', value: '102,637' },
    { label: 'Total Cost', value: '$0.3121' },
    { label: 'Duration', value: '17s' },
    { label: 'Failed Turns', value: '0' },
    { label: 'Success', value: '1' },
  ];

  readonly messages: RunMessage[] = [
    {
      id: 'run-user-1',
      role: 'user',
      text: 'Hi, can you give me adoption numbers for Recruitment for Yes Bank for Feb 2026?',
      time: '08:35:35',
    },
    {
      id: 'run-assistant-1',
      role: 'assistant',
      text: 'I found YES Bank in the client list (UCC: INWeYe05A). Confirming before I proceed — is this the right client?\nI found YES Bank — is that the right client?',
      time: '08:35:35',
      tokens: 43280,
      cost: '$0.1321',
      traceSteps: cloneTraceStepsForResponse('file-resume-parse', 'run-assistant-1'),
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

  trackMessage(_index: number, message: RunMessage): string {
    return message.id;
  }
}
