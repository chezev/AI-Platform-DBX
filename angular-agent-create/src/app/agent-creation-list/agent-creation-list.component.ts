import { AsyncPipe, CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { shareReplay, switchMap } from 'rxjs';
import { AgentApiService } from '../core/agent-api.service';
import { AgentFilterState, AgentListQuery, AgentStatus, AgentSummary, AgentViewMode } from '../core/agent-api.types';
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

interface FilterOption {
  label: string;
  value: AgentFilterState;
}

type AgentAction = 'Activate' | 'Deactivate' | 'View' | 'Delete';

@Component({
  selector: 'app-agent-creation-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
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
  templateUrl: './agent-creation-list.component.html',
  styleUrl: './agent-creation-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCreationListComponent implements OnInit, OnDestroy {
  private readonly agentApi = inject(AgentApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private highlightTimer: ReturnType<typeof setTimeout> | null = null;

  readonly productMenus = ['Agent Hub', 'Agent Resources', 'Monitoring Hub', 'Credentials', 'Others'];
  readonly moduleTabs = ['agents', 'projects'] as const;
  readonly stateOptions: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Draft', value: 'draft' },
  ];

  readonly globalSearchValue = signal('');
  readonly agentSearchValue = signal('');
  readonly stateFilter = signal<AgentFilterState>('all');
  readonly viewMode = signal<AgentViewMode>('grid');
  readonly activeModuleTab = signal<(typeof this.moduleTabs)[number]>('agents');
  readonly agentTotalCount = signal(this.agentApi.getAgentTotalCount());
  readonly defaultAuditTimestamp = '27/01/2026, 11:54:12 PM';
  readonly defaultUpdatedBy = 'Admin';

  private readonly statusOverrides = signal<Record<string, AgentStatus>>({});
  private readonly refreshVersion = signal(0);
  readonly openMenuAgentId = signal<string | null>(null);
  readonly highlightedAgentId = signal<string | null>(null);
  readonly pendingDeleteAgent = signal<AgentSummary | null>(null);

  private readonly projectNameOverrides: Record<string, string> = {
    'agt-001': 'Work Productivity',
    'agt-002': 'Talent Optimizer',
    'agt-003': 'Integrations',
    'agt-004': 'Confluence & Jira Only',
    'agt-005': 'Onboarding Candidates',
    'agt-006': 'Off boarding',
    'agt-007': 'OAuth Enterprise',
    'agt-008': 'Governance & Policy',
    'agt-009': 'Employee Workflows',
    'agt-010': 'Journeys HR',
  };

  private readonly query = computed<AgentListQuery>(() => {
    this.refreshVersion();
    return {
      search: this.agentSearchValue().trim(),
      state: this.stateFilter(),
    };
  });

  readonly agents$ = toObservable(this.query).pipe(
    switchMap((query) => this.agentApi.listAgents(query)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly pageSize = signal(10);
  readonly pageSizeOptions = ['10', '20', '30'];
  readonly currentPage = signal(1);
  readonly agentList = toSignal(this.agents$, { initialValue: [] as AgentSummary[] });
  readonly totalAgents = computed(() => this.agentList().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalAgents() / this.pageSize())));
  readonly pagedAgents = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.agentList().slice(start, start + this.pageSize());
  });
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  readonly pageRangeStart = computed(() => (this.totalAgents() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1));
  readonly pageRangeEnd = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalAgents()));

  goToPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  onPageSizeChange(rawValue: string | null): void {
    const size = Number(rawValue);
    if (size === 10 || size === 20 || size === 30) {
      this.pageSize.set(size);
      this.currentPage.set(1);
    }
  }

  readonly currentStateLabel = computed(() => {
    const current = this.stateOptions.find((option) => option.value === this.stateFilter());
    return current?.label ?? 'All';
  });

  ngOnInit(): void {
    const highlightAgentId = this.route.snapshot.queryParamMap.get('highlightAgentId');

    if (!highlightAgentId) {
      return;
    }

    this.highlightedAgentId.set(highlightAgentId);
    this.highlightTimer = setTimeout(() => this.highlightedAgentId.set(null), 5000);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }

  ngOnDestroy(): void {
    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
    }
  }

  onTabChange(tab: string): void {
    if (tab === 'agents' || tab === 'projects') {
      this.activeModuleTab.set(tab);
    }
  }

  onGlobalSearchInput(rawValue: string): void {
    this.globalSearchValue.set(rawValue);
  }

  onAgentSearchInput(rawValue: string): void {
    this.agentSearchValue.set(rawValue);
    this.currentPage.set(1);
  }

  onStateFilterChange(rawValue: string | null): void {
    if (rawValue === 'all' || rawValue === 'active' || rawValue === 'draft') {
      this.stateFilter.set(rawValue);
      this.currentPage.set(1);
    }
  }

  setViewMode(mode: AgentViewMode): void {
    this.viewMode.set(mode);
  }

  toggleMenu(agentId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuAgentId.update((current) => (current === agentId ? null : agentId));
  }

  isMenuOpen(agentId: string): boolean {
    return this.openMenuAgentId() === agentId;
  }

  getAgentStatus(agent: AgentSummary): AgentStatus {
    const overrides = this.statusOverrides();
    return overrides[agent.id] ?? agent.status;
  }

  getAgentActions(agent: AgentSummary): AgentAction[] {
    const status = this.getAgentStatus(agent);
    if (status === 'Active') {
      return ['Deactivate', 'View', 'Delete'];
    }
    if (status === 'Deactivated') {
      return ['Activate', 'View', 'Delete'];
    }
    return ['Activate', 'View', 'Delete'];
  }

  onAgentAction(agent: AgentSummary, action: AgentAction, event: MouseEvent): void {
    event.stopPropagation();
    if (action === 'View') {
      this.openAgent(agent, event);
      return;
    }

    if (action === 'Delete') {
      this.requestDeleteAgent(agent, event);
      return;
    }

    const nextStatus: AgentStatus = action === 'Activate' ? 'Active' : 'Deactivated';
    this.statusOverrides.update((current) => ({ ...current, [agent.id]: nextStatus }));
    this.agentApi.updateAgent(agent.id, { status: nextStatus }).subscribe();
    this.openMenuAgentId.set(null);
  }

  openAgent(agent: AgentSummary, event?: Event): void {
    event?.stopPropagation();
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }

    this.openMenuAgentId.set(null);
    void this.router.navigate(['/agent-creation/template', agent.id], {
      queryParams: {
        source: 'existing',
        name: agent.name,
      },
    });
  }

  requestDeleteAgent(agent: AgentSummary, event?: Event): void {
    event?.stopPropagation();
    this.openMenuAgentId.set(null);

    if (this.getAgentStatus(agent) === 'Active') {
      this.pendingDeleteAgent.set(agent);
      return;
    }

    this.deleteAgent(agent);
  }

  confirmDeleteAgent(): void {
    const agent = this.pendingDeleteAgent();
    if (!agent) {
      return;
    }

    this.deleteAgent(agent);
    this.pendingDeleteAgent.set(null);
  }

  cancelDeleteAgent(): void {
    this.pendingDeleteAgent.set(null);
  }

  private deleteAgent(agent: AgentSummary): void {
    this.agentApi.deleteAgent(agent.id).subscribe();
    this.statusOverrides.update((current) => {
      const next = { ...current };
      delete next[agent.id];
      return next;
    });

    if (this.highlightedAgentId() === agent.id) {
      this.highlightedAgentId.set(null);
    }

    this.agentTotalCount.set(this.agentApi.getAgentTotalCount());
    this.refreshVersion.update((version) => version + 1);
  }

  /** Resolve the deco-icon asset for a card; falls back to a generic agent icon. */
  getAgentIconSrc(agent: AgentSummary): string {
    return `assets/icons/agents/${agent.icon ?? 'manager-copilot'}.svg`;
  }

  getAgentSessions(agent: AgentSummary): number | null {
    return agent.sessions ?? null;
  }

  getAgentProject(agent: AgentSummary): string {
    return agent.projectName ?? this.projectNameOverrides[agent.id] ?? agent.category.replace(/\.\.\.$/, '');
  }

  getAgentCreatedOn(agent: AgentSummary): string {
    return agent.createdOn ?? this.defaultAuditTimestamp;
  }

  getAgentUpdatedOn(agent: AgentSummary): string {
    return agent.updatedOn ?? this.defaultAuditTimestamp;
  }

  getAgentUpdatedBy(agent: AgentSummary): string {
    return agent.updatedBy ?? this.defaultUpdatedBy;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuAgentId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.pendingDeleteAgent()) {
      this.pendingDeleteAgent.set(null);
      return;
    }

    this.openMenuAgentId.set(null);
  }

  trackAgent(index: number, agent: AgentSummary): string {
    return `${index}-${agent.id}`;
  }

  trackOption(index: number, option: FilterOption): string {
    return `${index}-${option.value}`;
  }
}
