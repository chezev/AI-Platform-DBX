import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface IconNavItem {
  label: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-agent-create-screen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agent-create-screen.component.html',
  styleUrls: ['./agent-create-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCreateScreenComponent {
  readonly globalMenus = [
    'Agent Hub',
    'Agent Resources',
    'Monitoring Hub',
    'Credentials',
    'Developer',
    'Others',
    'Template Library',
  ];

  readonly configTabs = ['Overview', 'Model', 'Tools & Data', 'Skills', 'Security', 'Resilience', 'Limits'];

  readonly contextChips = [
    'User ID',
    'Employee ID',
    'Employee first name',
    'Designation',
    'Department',
    'Location',
    'Current user time',
    'Job level',
    'Band name',
    'Grade name',
  ];

  readonly sideNavItems: IconNavItem[] = [
    { label: 'Home', isActive: true },
    { label: 'Knowledge' },
    { label: 'Profile' },
    { label: 'Recent' },
    { label: 'Groups' },
    { label: 'Integrations' },
    { label: 'Billing' },
    { label: 'Calendar' },
    { label: 'Reports' },
    { label: 'Settings' },
    { label: 'Security' },
  ];

  readonly agentForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    project: new FormControl(''),
    triggerChannels: new FormControl('Super Agent, Agent Node in Flows, External Webhook'),
    systemPrompt: new FormControl('You are a helpful assistant...'),
  });

  trackByValue(index: number, value: string): string {
    return `${index}-${value}`;
  }

  trackByLabel(index: number, item: IconNavItem): string {
    return `${index}-${item.label}`;
  }
}
