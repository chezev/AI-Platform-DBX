import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import { SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import { SdsInputDirective } from '../shared/spartan/sds-form';
import { SdsToastService } from '../shared/toast/sds-toast.service';

interface ToolCard {
  name: string;
  desc: string;
  kind: 'utility' | 'connector';
  logo?: string;
  utilityIcon?: 'code' | 'api' | 'agent';
  connected?: boolean;
}

interface Operation {
  name: string;
  id: string;
  module: string;
  endpoint: string;
  desc: string;
}

const LOGO = 'assets/logos/';

const UTILITIES: ToolCard[] = [
  { name: 'Code Block', desc: 'Write a Python function that runs as a tool.', kind: 'utility', utilityIcon: 'code' },
  { name: 'API Connection', desc: 'Connect securely with external APIs.', kind: 'utility', utilityIcon: 'api' },
  { name: 'Agent', desc: 'Call another agent to complete tasks.', kind: 'utility', utilityIcon: 'agent' },
];

const CONNECTORS: ToolCard[] = [
  { name: 'Confluence', desc: 'Search, read, or create Confluence pages.', kind: 'connector', logo: LOGO + 'confluence.png', connected: true },
  { name: 'Darwinbox Admin', desc: 'Perform secure admin actions in Darwinbox.', kind: 'connector', logo: LOGO + 'darwinbox.png' },
  { name: 'Jira', desc: 'Create, update, or fetch Jira issues.', kind: 'connector', logo: LOGO + 'jira.svg' },
  { name: 'Darwinbox Employee', desc: 'Fetch or update employee profile data.', kind: 'connector', logo: LOGO + 'darwinbox.png' },
  { name: 'Slack Connect', desc: 'Send team messages or workflow alerts.', kind: 'connector', logo: LOGO + 'slack.png', connected: true },
  { name: 'Teams Agent', desc: 'Send Teams messages or status updates.', kind: 'connector', logo: LOGO + 'teams.png' },
  { name: 'Whatsapp Agent', desc: 'Send WhatsApp messages or reminders.', kind: 'connector', logo: LOGO + 'whatsapp.png' },
  { name: 'ServiceNow Onboarding API', desc: 'Manage onboarding assignments & updates.', kind: 'connector', logo: LOGO + 'servicenow.png' },
];

const OPERATIONS: Operation[] = [
  { name: 'Create Issue', id: 'jira_create_issue', module: 'Create', endpoint: 'POST {site}/rest/api/3/issue', desc: 'Create a new Jira issue (task, bug, story, etc.)' },
  { name: 'Get Issue', id: 'jira_get_issue', module: 'Get', endpoint: 'GET {site}/rest/api/3/issue/{id}', desc: 'Fetch a single Jira issue by key or id.' },
  { name: 'List Issues', id: 'jira_list_issues', module: 'List', endpoint: 'GET {site}/rest/api/3/search', desc: 'List issues in a project or board.' },
  { name: 'Search Issues', id: 'jira_search_issues', module: 'Search', endpoint: 'POST {site}/rest/api/3/search', desc: 'Search issues using JQL.' },
  { name: 'Update Issue', id: 'jira_update_issue', module: 'Update', endpoint: 'PUT {site}/rest/api/3/issue/{id}', desc: 'Update fields on an existing issue.' },
  { name: 'Add Comment', id: 'jira_add_comment', module: 'Add', endpoint: 'POST {site}/rest/api/3/issue/{id}/comment', desc: 'Add a comment to an issue.' },
  { name: 'Get Comments', id: 'jira_get_comments', module: 'Get', endpoint: 'GET {site}/rest/api/3/issue/{id}/comment', desc: 'Fetch comments on an issue.' },
  { name: 'Assign Issue', id: 'jira_assign_issue', module: 'Assign', endpoint: 'PUT {site}/rest/api/3/issue/{id}/assignee', desc: 'Assign an issue to a user.' },
  { name: 'List Projects', id: 'jira_list_projects', module: 'List', endpoint: 'GET {site}/rest/api/3/project', desc: 'List all accessible projects.' },
  { name: 'Get Transitions', id: 'jira_get_transition', module: 'Get', endpoint: 'GET {site}/rest/api/3/issue/{id}/transitions', desc: 'List available status transitions.' },
];

const DEFAULT_SELECTED = ['jira_create_issue', 'jira_list_issues', 'jira_search_issues', 'jira_update_issue', 'jira_assign_issue'];

const SAMPLE_CODE = `def execute(tool_output, context=None):
    # context: { user_id: str, tenant_id: str, base_url: str }
    import json
    data = json.loads(tool_output)
    # Return only the fields the agent needs
    return data`;

@Component({
  selector: 'app-tool-new',
  standalone: true,
  imports: [
    CommonModule,
    SdsAppTopbarComponent,
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsSearchFieldDirective,
    SdsInputDirective,
  ],
  templateUrl: './tool-new.component.html',
  styleUrl: './tool-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolNewComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly toast = inject(SdsToastService);

  readonly utilities = UTILITIES;
  readonly connectors = CONNECTORS;
  readonly sampleCode = SAMPLE_CODE;
  readonly globalSearch = signal('');

  // 'browse' = pick a tool; 'connect' = the 2-step wizard.
  readonly mode = signal<'browse' | 'connect'>('browse');
  readonly browseSearch = signal('');
  readonly selectedTool = signal<ToolCard | null>(null);

  readonly searchResults = computed<ToolCard[]>(() => {
    const term = this.browseSearch().trim().toLowerCase();
    if (!term) return [];
    return [...UTILITIES, ...CONNECTORS].filter((t) => t.name.toLowerCase().includes(term));
  });

  // ── Wizard ──
  readonly wizardStep = signal<1 | 2>(1);

  // Step 1 — credential.
  readonly credMode = signal<'existing' | 'new'>('new');
  readonly credentials = signal([
    { id: 'd55f12db-9a41-4c2e-8f3b-0e1a2b3c4d5e', name: 'Policy Docs' },
    { id: 'f1add8b9-2c33-4a5d-9b8e-7f6a5b4c3d2e', name: 'New Policy 2026' },
  ]);
  readonly selectedCredId = signal<string | null>('d55f12db-9a41-4c2e-8f3b-0e1a2b3c4d5e');
  readonly credName = signal('Jira Connect');
  readonly authMode = signal<'secret' | 'cert'>('secret');
  readonly eventType = signal('new@newmail.com');
  readonly triggerEvent = signal('');
  readonly sharepointDir = signal('');

  // Step 2 — operations.
  readonly addToolsModalOpen = signal(false);
  readonly selectedOps = signal<Set<string>>(new Set());
  readonly activeOpId = signal<string | null>(null);
  readonly opSearch = signal('');
  // Temp selection inside the modal.
  readonly modalOps = signal<Set<string>>(new Set());
  readonly modalSearch = signal('');
  readonly activeModule = signal('All Modules');

  readonly operations = OPERATIONS;
  readonly modules = computed(() => {
    const counts = new Map<string, number>();
    for (const op of OPERATIONS) counts.set(op.module, (counts.get(op.module) ?? 0) + 1);
    return [{ name: 'All Modules', count: OPERATIONS.length }, ...[...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }))];
  });

  readonly modalVisibleOps = computed(() => {
    const term = this.modalSearch().trim().toLowerCase();
    const mod = this.activeModule();
    return OPERATIONS.filter((o) => (mod === 'All Modules' || o.module === mod) && (!term || o.name.toLowerCase().includes(term)));
  });

  readonly addedOps = computed(() => {
    const ids = this.selectedOps();
    const term = this.opSearch().trim().toLowerCase();
    return OPERATIONS.filter((o) => ids.has(o.id) && (!term || o.name.toLowerCase().includes(term)));
  });

  readonly addedGroups = computed(() => {
    const ops = this.addedOps();
    const groups = new Map<string, Operation[]>();
    for (const op of ops) {
      const list = groups.get(op.module) ?? [];
      list.push(op);
      groups.set(op.module, list);
    }
    return [...groups.entries()].map(([module, ops]) => ({ module, ops }));
  });

  readonly activeOp = computed(() => OPERATIONS.find((o) => o.id === this.activeOpId()) ?? null);
  readonly hasAddedTools = computed(() => this.selectedOps().size > 0);

  // Output transform toggle + description override (per active op, simplified to one shared value).
  readonly outputTransformEnabled = signal(false);
  readonly descriptionOverride = signal('');
  readonly codeText = signal(SAMPLE_CODE);

  // ── Navigation ──
  goBack(): void {
    if (this.mode() === 'connect') {
      this.mode.set('browse');
      this.selectedTool.set(null);
      return;
    }
    this.location.back();
  }

  cancel(): void {
    void this.router.navigate(['/agent-resources/tool-registry']);
  }

  onBrowseSearch(value: string): void {
    this.browseSearch.set(value);
  }

  clearBrowseSearch(): void {
    this.browseSearch.set('');
  }

  pickTool(tool: ToolCard): void {
    this.selectedTool.set(tool);
    this.mode.set('connect');
    this.wizardStep.set(1);
  }

  // ── Step nav ──
  next(): void {
    this.wizardStep.set(2);
  }

  back(): void {
    this.wizardStep.set(1);
  }

  selectCredential(id: string): void {
    this.selectedCredId.set(id);
  }

  deleteCredential(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.credentials.update((list) => list.filter((c) => c.id !== id));
    if (this.selectedCredId() === id) this.selectedCredId.set(this.credentials()[0]?.id ?? null);
  }

  // ── Step 2 / Add Tools modal ──
  openAddTools(): void {
    // First open seeds a sensible default selection (matching the design); after
    // that it reflects whatever is already added.
    const seed = this.selectedOps().size > 0 ? new Set(this.selectedOps()) : new Set(DEFAULT_SELECTED);
    this.modalOps.set(seed);
    this.modalSearch.set('');
    this.activeModule.set('All Modules');
    this.addToolsModalOpen.set(true);
  }

  closeAddTools(): void {
    this.addToolsModalOpen.set(false);
  }

  toggleModalOp(id: string): void {
    this.modalOps.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isModalOpChecked(id: string): boolean {
    return this.modalOps().has(id);
  }

  readonly allVisibleSelected = computed(() => {
    const visible = this.modalVisibleOps();
    return visible.length > 0 && visible.every((o) => this.modalOps().has(o.id));
  });

  toggleSelectAll(): void {
    const visible = this.modalVisibleOps();
    const allSelected = this.allVisibleSelected();
    this.modalOps.update((set) => {
      const next = new Set(set);
      for (const o of visible) {
        allSelected ? next.delete(o.id) : next.add(o.id);
      }
      return next;
    });
  }

  confirmAddTools(): void {
    const next = new Set(this.modalOps());
    this.selectedOps.set(next);
    if (!this.activeOpId() || !next.has(this.activeOpId()!)) {
      this.activeOpId.set([...next][0] ?? null);
    }
    this.addToolsModalOpen.set(false);
  }

  setActiveOp(id: string): void {
    this.activeOpId.set(id);
  }

  // ── Finish ──
  addTool(): void {
    const name = this.selectedTool()?.name ?? 'Tool';
    this.toast.show(`${name} Tool is Successfully added.`, 'success');
    void this.router.navigate(['/agent-resources/tool-registry']);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.addToolsModalOpen()) this.addToolsModalOpen.set(false);
  }
}
