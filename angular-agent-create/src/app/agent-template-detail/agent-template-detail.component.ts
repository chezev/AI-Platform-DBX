import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { findAgentTemplate } from '../core/agent-template-data';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import { SdsCardDirective } from '../shared/spartan/sds-form';
import { SdsResourceCardDirective, SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import {
  SdsSelectContentComponent,
  SdsSelectDirective,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';

interface DetailField {
  label: string;
  value: string;
}

interface RegistryItem {
  title: string;
  description: string;
  tag: string;
}

type DetailTab = 'details' | 'logs' | 'versions';
type LogStatus = 'Success' | 'Error' | 'Cancelled' | 'Running';

interface LogEntry {
  runId: string;
  sessionId: string;
  input: string;
  when: string;
  status: LogStatus;
  tokens: number;
}

interface VersionEntry {
  version: string;
  provider: string;
  model: string;
  when: string;
  isCurrent?: boolean;
}

@Component({
  selector: 'app-agent-template-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SdsAppTopbarComponent,
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsCardDirective,
    SdsResourceCardDirective,
    SdsSearchFieldDirective,
    SdsSelectContentComponent,
    SdsSelectDirective,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    SdsSelectTriggerComponent,
  ],
  templateUrl: './agent-template-detail.component.html',
  styleUrl: './agent-template-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentTemplateDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly template = findAgentTemplate(this.route.snapshot.paramMap.get('templateId'));
  readonly source = this.route.snapshot.queryParamMap.get('source');
  readonly displayName = this.route.snapshot.queryParamMap.get('name') ?? this.template.name;
  readonly ctaLabel = this.source === 'existing' ? 'Duplicate' : 'Use Template';
  readonly ctaQueryParams = {
    template: this.template.id,
    source: this.source ?? 'template',
    name: this.displayName,
  };
  readonly projectName = this.template.category.includes('Payroll') ? 'Payroll Agent' : 'Adoption Agent';
  readonly systemPrompt = `# Darwinbox ${this.displayName} - System Prompt
You are the Darwinbox ${this.displayName}. You help CSMs and KAMs understand how well their clients are adopting Darwinbox modules, surface adoption risks, and recommend specific actions to improve outcomes.`;

  readonly modelFields: DetailField[] = [
    { label: 'Provider', value: 'ChatGPT' },
    { label: 'Model', value: 'GPT 5.4 Extended Thinking' },
    { label: 'Key Profile', value: 'Pranav kumar' },
    { label: 'Temperature', value: '0.7 (Balanced)' },
    { label: 'Max Output Tokens', value: '6500' },
    { label: 'Reasoning Mode', value: 'Not Enabled.' },
  ];

  readonly tools: RegistryItem[] = [
    {
      title: 'Production Adoption',
      description: 'Use this tool to generate flow diagrams in png format from the mermaid code',
      tag: 'Code Block',
    },
    {
      title: 'Production Adoption',
      description: 'Use this tool to generate flow diagrams in png format from the mermaid code',
      tag: 'API',
    },
    {
      title: 'Production Adoption',
      description: 'Use this tool to generate flow diagrams in png format from the mermaid code',
      tag: 'Connectors',
    },
  ];

  readonly knowledgeBases: RegistryItem[] = [
    {
      title: 'AITECH-1479 - Resume Parser - V3',
      description: '6 tokens2 chunksMay 19, 20:06',
      tag: 'Embedded',
    },
    {
      title: 'AITECH-1479 - Resume Parser - V3',
      description: '6 tokens2 chunksMay 19, 20:06',
      tag: 'Embedded',
    },
  ];

  readonly capabilities: DetailField[] = [
    { label: 'Code Executor', value: 'Enabled' },
    { label: 'Document generator (PDF & Word)', value: 'Not Enabled' },
    { label: 'Slides (PowerPoint)', value: 'Enabled' },
  ];

  // Logs & Versions tabs are only for created agents (source=existing), not templates.
  readonly isExistingAgent = this.source === 'existing';
  readonly agentActive = signal(true);
  private readonly initialTab = this.route.snapshot.queryParamMap.get('tab');
  readonly activeTab = signal<DetailTab>(
    this.isExistingAgent && (this.initialTab === 'logs' || this.initialTab === 'versions')
      ? (this.initialTab as DetailTab)
      : 'details',
  );
  readonly openVersionMenuId = signal<string | null>(null);

  readonly logs: LogEntry[] = [
    { runId: 'a421600c-2f8e-4c7a-9d11-7b2c9e0a4d31', sessionId: '3f06ebb9-e10a-42c8-8f0b-2d6c1a9e7b54', input: 'Hi, how to start with Onboarding', when: '27/01/2026, 11:54:12 PM', status: 'Success', tokens: 26512 },
    { runId: '09841f78-2a3b-4e9c-8c12-5f7d3b1a8e62', sessionId: '3f06ebb9-e10a-42c8-8f0b-2d6c1a9e7b54', input: 'How can i add a buddy in system', when: '27/01/2026, 11:54:12 PM', status: 'Error', tokens: 23551 },
    { runId: 'a20c5ff5-4b1d-4a8e-9f23-6c8e2d0b7a93', sessionId: '3f06ebb9-e10a-42c8-8f0b-2d6c1a9e7b54', input: 'What are the updated policies', when: '27/01/2026, 11:54:12 PM', status: 'Success', tokens: 12543 },
    { runId: '82506e86-b7c4-4d2a-8e31-9a0f5c3b1d74', sessionId: '479ecb3f-c0d9-4b6a-8d12-3e7f1a9c0b85', input: 'What is the HR Policy for International Transfer', when: '27/01/2026, 11:54:12 PM', status: 'Success', tokens: 13542 },
    { runId: '62731ff3-7e8a-4c1b-9d42-8b6f0a2e5c96', sessionId: '479ecb3f-c0d9-4b6a-8d12-3e7f1a9c0b85', input: 'How to override the policy?', when: '27/01/2026, 11:54:12 PM', status: 'Cancelled', tokens: 1243 },
    { runId: 'e8959831-2d6c-4f9a-8b53-7a1e0c4d2f87', sessionId: 'a9cdd15e-51f7-4a2c-9e34-6b8d1f0a3c95', input: 'How can i request to change the JD?', when: '27/01/2026, 11:54:12 PM', status: 'Running', tokens: 1246 },
    { runId: '57890cdb-4a2e-4d8c-9f64-5b3a1e7c0d28', sessionId: 'a9cdd15e-51f7-4a2c-9e34-6b8d1f0a3c95', input: 'How to change my joining date?', when: '27/01/2026, 11:54:12 PM', status: 'Success', tokens: 1354 },
  ];
  readonly logsTotal = 124;
  readonly logStatusFilters = ['All', 'Success', 'Error', 'Cancelled', 'Running'];
  readonly logStatusFilter = signal('All');
  readonly logSearch = signal('');

  readonly perPageOptions = ['10', '20', '30'];
  readonly logsPageSize = signal(10);
  readonly versionsPageSize = signal(10);

  readonly versions: VersionEntry[] = [
    { version: 'V12', provider: 'Anthropic', model: 'Claude Sonnet 4.6', when: '27/01/2026, 11:54:12 PM', isCurrent: true },
    { version: 'V11', provider: 'ChatGPT', model: 'GPT 5.4 Extended Thinking', when: '27/01/2026, 11:54:12 PM' },
    { version: 'V10', provider: 'Antigravity', model: 'Gemini 3.1 Pro', when: '27/01/2026, 11:54:12 PM' },
    { version: 'V9', provider: 'Antigravity', model: 'Gemini Flash 3.0 (High)', when: '27/01/2026, 11:54:12 PM' },
    { version: 'V8', provider: 'Anthropic', model: 'Claude Sonnet 4.6', when: '27/01/2026, 11:54:12 PM' },
    { version: 'V7', provider: 'ChatGPT', model: 'GPT 5.3 (Instant)', when: '27/01/2026, 11:54:12 PM' },
    { version: 'V6', provider: 'Antigravity', model: 'Gemini 3.1 Pro', when: '27/01/2026, 11:54:12 PM' },
    { version: 'V5', provider: 'Antigravity', model: 'Gemini 3.1 Pro', when: '27/01/2026, 11:54:12 PM' },
  ];
  readonly versionsTotal = 16;
  readonly versionFilterOptions = ['All', 'Anthropic', 'ChatGPT', 'Antigravity'];
  readonly versionFilter = signal('All');
  readonly versionSearch = signal('');

  onPageSizeChange(target: WritableSignal<number>, raw: string | null): void {
    const size = Number(raw);
    if (size === 10 || size === 20 || size === 30) {
      target.set(size);
    }
  }

  setTab(tab: DetailTab): void {
    this.activeTab.set(tab);
    this.openVersionMenuId.set(null);
  }

  onLogFilterChange(value: string | null): void {
    this.logStatusFilter.set(value ?? 'All');
  }

  onVersionFilterChange(value: string | null): void {
    this.versionFilter.set(value ?? 'All');
  }

  // Run ID → conversation/run detail page (with View Traces → trace panel).
  openRun(log: LogEntry): void {
    void this.router.navigate(['/agent-creation/run', log.runId]);
  }

  // Session = a full conversation (multiple runs) → session detail page.
  openSession(log: LogEntry): void {
    void this.router.navigate(['/agent-creation/session', log.sessionId]);
  }

  toggleVersionMenu(version: string, event: Event): void {
    event.stopPropagation();
    this.openVersionMenuId.update((current) => (current === version ? null : version));
  }

  isVersionMenuOpen(version: string): boolean {
    return this.openVersionMenuId() === version;
  }

  viewVersion(version: VersionEntry, event: Event): void {
    event.stopPropagation();
    this.openVersionMenuId.set(null);
    void version;
  }

  restoreVersion(version: VersionEntry, event: Event): void {
    event.stopPropagation();
    this.openVersionMenuId.set(null);
    void version;
  }
}
