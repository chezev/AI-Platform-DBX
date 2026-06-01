import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { ChatTraceLinkComponent } from '../shared/trace/chat-trace-link.component';
import { cloneTraceStepsForResponse, getTraceCase, pickTraceCaseIdForPrompt } from '../shared/trace/trace.mock';
import { TraceLogPanelComponent } from '../shared/trace/trace-log-panel.component';
import { TraceStep } from '../shared/trace/trace.types';

interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  traceSteps?: TraceStep[];
}

@Component({
  selector: 'app-agent-test-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SdsAppTopbarComponent,
    SdsIconComponent,
    ChatTraceLinkComponent,
    TraceLogPanelComponent,
  ],
  templateUrl: './agent-test-screen.component.html',
  styleUrls: ['./agent-test-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentTestScreenComponent {
  readonly globalSearch = signal('');
  readonly composerText = signal('How can i');
  readonly selectedResponseId = signal<string | null>(null);
  readonly tracePanelExpanded = signal(false);

  readonly messages = signal<AgentChatMessage[]>([
    {
      id: 'user-default-1',
      role: 'user',
      text: 'How can i onboard a new employee and setup a buddy.',
    },
    {
      id: 'assistant-default-1',
      role: 'assistant',
      text: 'Ok, let me know what are the candidate details along with the resume attached so that I can attach the correct details into the system.',
      traceSteps: cloneTraceStepsForResponse('simple-llm-response', 'assistant-default-1'),
    },
    {
      id: 'user-default-2',
      role: 'user',
      text: 'How can i onboard a new employee and setup a buddy.',
    },
    {
      id: 'assistant-default-2',
      role: 'assistant',
      text: 'Ok, let me know what are the candidate details along with the resume attached so that I can attach the correct details into the system.',
      traceSteps: cloneTraceStepsForResponse('file-resume-parse', 'assistant-default-2'),
    },
  ]);

  readonly selectedTraceSteps = computed(() => {
    const responseId = this.selectedResponseId();
    if (!responseId) return [];
    return this.messages().find((message) => message.id === responseId)?.traceSteps ?? [];
  });

  openTrace(responseId: string): void {
    this.selectedResponseId.set(responseId);
    this.tracePanelExpanded.set(false);
  }

  closeTrace(): void {
    this.selectedResponseId.set(null);
    this.tracePanelExpanded.set(false);
  }

  onTraceExpandedChange(expanded: boolean): void {
    this.tracePanelExpanded.set(expanded);
  }

  sendMessage(): void {
    const prompt = this.composerText().trim();
    if (!prompt) return;

    const now = Date.now();
    const caseId = pickTraceCaseIdForPrompt(prompt);
    const traceCase = getTraceCase(caseId);
    const responseId = `assistant-${now}`;

    this.messages.update((messages) => [
      ...messages,
      { id: `user-${now}`, role: 'user', text: prompt },
      {
        id: responseId,
        role: 'assistant',
        text: traceCase.assistantResponse,
        traceSteps: cloneTraceStepsForResponse(caseId, responseId),
      },
    ]);
    this.composerText.set('');
  }

  onComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  trackMessage(_index: number, message: AgentChatMessage): string {
    return message.id;
  }

  isTracePairSelected(index: number, message: AgentChatMessage): boolean {
    const selectedResponseId = this.selectedResponseId();
    if (!selectedResponseId) return false;
    if (message.id === selectedResponseId) return true;

    const nextMessage = this.messages()[index + 1];
    return message.role === 'user' && nextMessage?.id === selectedResponseId;
  }
}
