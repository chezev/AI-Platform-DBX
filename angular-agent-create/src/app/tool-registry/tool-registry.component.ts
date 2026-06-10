import { ChangeDetectionStrategy, Component, HostListener, computed, signal } from '@angular/core';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import { SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import {
  SdsSelectContentComponent,
  SdsSelectDirective,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';

type ToolStatus = 'Connected' | 'Active' | 'Draft';
type StatusFilter = 'all' | 'connected' | 'active' | 'draft';

interface Tool {
  id: string;
  name: string;
  status: ToolStatus;
  description: string;
  type: string;
  usedBy: number;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}

const TS = '27/01/2026, 11:54:12 PM';

@Component({
  selector: 'app-tool-registry',
  standalone: true,
  imports: [
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsSearchFieldDirective,
    SdsSelectContentComponent,
    SdsSelectDirective,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    SdsSelectTriggerComponent,
  ],
  templateUrl: './tool-registry.component.html',
  styleUrl: './tool-registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolRegistryComponent {
  readonly statusOptions = [
    { label: 'All', value: 'all' as StatusFilter },
    { label: 'Connected', value: 'connected' as StatusFilter },
    { label: 'Active', value: 'active' as StatusFilter },
    { label: 'Draft', value: 'draft' as StatusFilter },
  ];

  readonly searchValue = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly openMenuId = signal<string | null>(null);
  readonly menuPos = signal<{ top: number; right: number } | null>(null);
  readonly pendingDelete = signal<Tool | null>(null);

  private readonly items = signal<Tool[]>([
    { id: 't-1', name: 'Confluence Doc Agent', status: 'Connected', description: 'Search and summarize Confluence spaces', type: 'Connector', usedBy: 1, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-2', name: 'Devops', status: 'Active', description: 'Manage DevOps tasks and updates', type: 'API connector', usedBy: 2, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-3', name: 'Fetch Adoption Metrics', status: 'Active', description: 'Get product adoption metrics', type: 'Code Block', usedBy: 4, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-4', name: 'Fetch Payslip', status: 'Active', description: 'Fetch employee payslip details', type: 'Sub-agent', usedBy: 1, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-5', name: 'Generate Workflow', status: 'Draft', description: 'Create workflow draft automatically', type: 'MCP Server', usedBy: 0, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-6', name: 'Get Simple SDK', status: 'Active', description: 'Access simple SDK actions', type: 'Connector', usedBy: 10, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-7', name: 'Leave Balance Fetcher', status: 'Draft', description: 'Check employee leave balance', type: 'Custom Tool', usedBy: 2, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-8', name: 'PNG Converter', status: 'Active', description: 'Convert uploaded files to PNG', type: 'Code Block', usedBy: 3, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-9', name: 'My Slack', status: 'Active', description: 'Send Slack messages and alerts', type: 'API connector', usedBy: 0, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-10', name: 'My Jira', status: 'Active', description: 'Create and manage Jira issues', type: 'MCP Server', usedBy: 7, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-11', name: 'Employee Profile', status: 'Active', description: 'Fetch employee profile details', type: 'Connector', usedBy: 5, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
    { id: 't-12', name: 'Expense Validator', status: 'Draft', description: 'Validate expense claims against policy', type: 'Custom Tool', usedBy: 0, createdOn: TS, updatedBy: 'Admin', updatedOn: TS },
  ]);

  readonly currentStatusLabel = computed(
    () => this.statusOptions.find((o) => o.value === this.statusFilter())?.label ?? 'All',
  );

  readonly visible = computed<Tool[]>(() => {
    const term = this.searchValue().trim().toLowerCase();
    const status = this.statusFilter();
    return this.items().filter((tool) => {
      if (status !== 'all' && tool.status.toLowerCase() !== status) return false;
      return !term || tool.name.toLowerCase().includes(term) || tool.description.toLowerCase().includes(term);
    });
  });

  usedByLabel(tool: Tool): string {
    return tool.usedBy > 0 ? `${tool.usedBy} agent${tool.usedBy === 1 ? '' : 's'}` : '--';
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
  }

  onStatusFilterChange(value: string | null): void {
    if (value && this.statusOptions.some((o) => o.value === value)) {
      this.statusFilter.set(value as StatusFilter);
    }
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    const willOpen = this.openMenuId() !== id;
    if (willOpen) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.menuPos.set({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    this.openMenuId.set(willOpen ? id : null);
  }

  isMenuOpen(id: string): boolean {
    return this.openMenuId() === id;
  }

  onEdit(_tool: Tool, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
  }

  requestDelete(tool: Tool, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.pendingDelete.set(tool);
  }

  confirmDelete(): void {
    const tool = this.pendingDelete();
    if (!tool) return;
    this.items.update((list) => list.filter((item) => item.id !== tool.id));
    this.pendingDelete.set(null);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  trackTool(_index: number, tool: Tool): string {
    return tool.id;
  }

  @HostListener('document:click')
  @HostListener('window:scroll')
  closeMenu(): void {
    this.openMenuId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.pendingDelete()) {
      this.pendingDelete.set(null);
      return;
    }
    this.openMenuId.set(null);
  }
}
