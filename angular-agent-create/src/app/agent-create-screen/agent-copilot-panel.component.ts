import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';

@Component({
  selector: 'app-agent-copilot-panel',
  standalone: true,
  imports: [CommonModule, SdsIconComponent],
  templateUrl: './agent-copilot-panel.component.html',
  styleUrl: './agent-copilot-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCopilotPanelComponent {
  @Output() readonly closePanel = new EventEmitter<void>();

  readonly copilotPrompt = signal('');

  onCopilotPromptInput(value: string): void {
    this.copilotPrompt.set(value);
  }
}
