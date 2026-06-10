import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { ChatTraceLinkComponent } from '../shared/trace/chat-trace-link.component';
import { cloneTraceStepsForResponse, getTraceCase, pickTraceCaseIdForPrompt } from '../shared/trace/trace.mock';
import { TraceLogPanelComponent } from '../shared/trace/trace-log-panel.component';
import { TraceStep } from '../shared/trace/trace.types';
import { ScriptTurn, buildAgentScript } from './agent-chat-script';

interface SuggestedTurn extends ScriptTurn {
  index: number;
}

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
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  @ViewChild('chatThread') private chatThread?: ElementRef<HTMLElement>;

  private scrollToLatest(): void {
    setTimeout(() => {
      const el = this.chatThread?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  // Agent name comes from the launching page (Test links pass ?name=). Falls
  // back gracefully so the screen still works when opened directly.
  readonly agentName = this.route.snapshot.queryParamMap.get('name')?.trim() || 'your agent';
  private readonly script = buildAgentScript(this.agentName);

  readonly globalSearch = signal('');
  readonly composerText = signal('');
  readonly selectedResponseId = signal<string | null>(null);
  readonly tracePanelExpanded = signal(false);

  // The scripted demo starts with just the agent's greeting; suggested prompts
  // (below) drive the rest of the ~10-turn conversation.
  readonly messages = signal<AgentChatMessage[]>([
    {
      id: 'assistant-greeting',
      role: 'assistant',
      text: this.script.greeting,
      traceSteps: cloneTraceStepsForResponse('simple-llm-response', 'assistant-greeting', this.script.greeting),
    },
  ]);

  // How many scripted turns have been used; suggestions show the next few.
  readonly scriptCursor = signal(0);
  readonly suggestions = computed<SuggestedTurn[]>(() =>
    this.script.turns
      .map((turn, index) => ({ ...turn, index }))
      .slice(this.scriptCursor(), this.scriptCursor() + 3),
  );

  readonly selectedTraceSteps = computed(() => {
    const responseId = this.selectedResponseId();
    if (!responseId) return [];
    return this.messages().find((message) => message.id === responseId)?.traceSteps ?? [];
  });

  openTrace(responseId: string): void {
    // Only switch which trace is shown. Keep the current expanded/collapsed
    // state so navigating between traces doesn't collapse an expanded panel.
    this.selectedResponseId.set(responseId);
  }

  closeTrace(): void {
    this.selectedResponseId.set(null);
    this.tracePanelExpanded.set(false);
  }

  onTraceExpandedChange(expanded: boolean): void {
    this.tracePanelExpanded.set(expanded);
  }

  // Return to wherever Test was launched from (the agent detail page).
  goBack(): void {
    this.location.back();
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
        traceSteps: cloneTraceStepsForResponse(caseId, responseId, traceCase.assistantResponse),
      },
    ]);
    this.composerText.set('');
    this.scrollToLatest();
  }

  /** Send a scripted suggestion: appends the user prompt + its canned reply. */
  sendSuggestion(turn: SuggestedTurn): void {
    const now = Date.now();
    const responseId = `assistant-${now}`;

    this.messages.update((messages) => [
      ...messages,
      { id: `user-${now}`, role: 'user', text: turn.prompt },
      {
        id: responseId,
        role: 'assistant',
        text: turn.response,
        traceSteps: cloneTraceStepsForResponse(turn.traceCaseId, responseId, turn.response),
      },
    ]);
    // Advance past the chosen turn so the next suggestions follow on.
    this.scriptCursor.set(turn.index + 1);
    this.scrollToLatest();
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
