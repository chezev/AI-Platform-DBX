import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, startWith, timeout } from 'rxjs';
import {
  AgentFilterState,
  AgentListQuery,
  AgentLogEntry,
  AgentSummary,
  CreateAgentInput,
  LlmChatRequest,
  LlmChatResponse,
  UpdateAgentInput,
} from './agent-api.types';

@Injectable({ providedIn: 'root' })
export class AgentApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = '/api';
  private readonly storageKey = 'sds.agentCreation.savedAgents';
  private readonly deletedAgentsKey = 'sds.agentCreation.deletedAgents';

  getAgentTotalCount(): number {
    return this.getAllFallbackAgents().length;
  }

  listAgents(query: AgentListQuery = {}): Observable<AgentSummary[]> {
    const fallback = this.filterAgents(query);
    const params = new HttpParams({
      fromObject: {
        search: query.search ?? '',
        state: query.state ?? 'all',
        view: query.view ?? 'grid',
      },
    });

    return this.http.get<AgentSummary[]>(`${this.apiBaseUrl}/agents`, { params }).pipe(
      timeout({
        first: 600,
        with: () => of(fallback),
      }),
      catchError(() => of(fallback)),
      startWith(fallback),
    );
  }

  createAgent(payload: CreateAgentInput): Observable<AgentSummary> {
    return this.http.post<AgentSummary>(`${this.apiBaseUrl}/agents`, payload).pipe(
      catchError(() => {
        const createdAt = new Date();
        const fallback: AgentSummary = {
          id: crypto.randomUUID(),
          name: payload.name,
          description: payload.description,
          category: payload.category,
          projectName: payload.projectName,
          status: payload.status ?? 'Draft',
          createdOn: this.formatAuditTimestamp(createdAt),
          updatedOn: this.formatAuditTimestamp(createdAt),
          updatedBy: 'Admin',
          updatedLabel: 'Just now',
          accent: this.resolveAccent(payload.category),
        };
        this.saveStoredAgents([fallback, ...this.getStoredAgents()]);
        return of(fallback);
      }),
    );
  }

  updateAgent(agentId: string, payload: UpdateAgentInput): Observable<AgentSummary> {
    return this.http.put<AgentSummary>(`${this.apiBaseUrl}/agents/${agentId}`, payload).pipe(
      catchError(() => {
        const storedAgents = this.getStoredAgents();
        const storedAgent = storedAgents.find((agent) => agent.id === agentId);
        const fallback = storedAgent ?? this.mockAgents.find((agent) => agent.id === agentId) ?? this.mockAgents[0];
        const updatedAgent = {
          ...fallback,
          ...payload,
          updatedOn: this.formatAuditTimestamp(new Date()),
          updatedLabel: 'Just now',
        };

        if (storedAgent) {
          this.saveStoredAgents(storedAgents.map((agent) => (agent.id === agentId ? updatedAgent : agent)));
        }

        return of(updatedAgent);
      }),
    );
  }

  deleteAgent(agentId: string): Observable<void> {
    this.removeLocalAgent(agentId);
    return this.http.delete<void>(`${this.apiBaseUrl}/agents/${agentId}`).pipe(catchError(() => of(void 0)));
  }

  getEvaluationLogs(agentId?: string): Observable<AgentLogEntry[]> {
    const params = agentId ? new HttpParams().set('agentId', agentId) : undefined;
    return this.http.get<AgentLogEntry[]>(`${this.apiBaseUrl}/agent-logs`, { params }).pipe(
      catchError(() => of(this.mockLogs.filter((entry) => (agentId ? entry.agentId === agentId : true)))),
    );
  }

  chatWithLlm(payload: LlmChatRequest): Observable<LlmChatResponse> {
    return this.http.post<LlmChatResponse>(`${this.apiBaseUrl}/llm/chat`, payload).pipe(
      catchError(() => {
        const prompt = payload.messages[payload.messages.length - 1]?.content ?? 'No prompt provided';
        return of({
          id: crypto.randomUUID(),
          model: payload.model ?? 'gpt-4.1-mini',
          output: `Mock LLM response for "${prompt.slice(0, 80)}"`,
          tokensIn: 42,
          tokensOut: 63,
        });
      }),
    );
  }

  private filterAgents(query: AgentListQuery): AgentSummary[] {
    const search = (query.search ?? '').trim().toLowerCase();
    const state = query.state ?? 'all';

    return this.getAllFallbackAgents().filter(
      (agent) => this.matchesState(agent.status, state) && this.matchesSearch(agent, search),
    );
  }

  private matchesState(status: AgentSummary['status'], state: AgentFilterState): boolean {
    if (state === 'all') {
      return true;
    }
    if (state === 'active') {
      return status === 'Active';
    }
    return status === 'Draft';
  }

  private matchesSearch(agent: AgentSummary, search: string): boolean {
    if (!search) {
      return true;
    }

    const pool = `${agent.name} ${agent.description} ${agent.category}`.toLowerCase();
    return pool.includes(search);
  }

  private getAllFallbackAgents(): AgentSummary[] {
    const deletedAgentIds = this.getDeletedAgentIds();
    return [...this.getStoredAgents(), ...this.mockAgents].filter((agent) => !deletedAgentIds.has(agent.id));
  }

  private getStoredAgents(): AgentSummary[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const rawValue = localStorage.getItem(this.storageKey);
      if (!rawValue) {
        return [];
      }

      const parsedValue = JSON.parse(rawValue);
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
      return [];
    }
  }

  private saveStoredAgents(agents: AgentSummary[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(agents));
  }

  private removeLocalAgent(agentId: string): void {
    const storedAgents = this.getStoredAgents();
    const nextStoredAgents = storedAgents.filter((agent) => agent.id !== agentId);
    if (nextStoredAgents.length !== storedAgents.length) {
      this.saveStoredAgents(nextStoredAgents);
    }

    const deletedAgentIds = this.getDeletedAgentIds();
    deletedAgentIds.add(agentId);
    this.saveDeletedAgentIds(deletedAgentIds);
  }

  private getDeletedAgentIds(): Set<string> {
    if (typeof localStorage === 'undefined') {
      return new Set<string>();
    }

    try {
      const rawValue = localStorage.getItem(this.deletedAgentsKey);
      if (!rawValue) {
        return new Set<string>();
      }

      const parsedValue = JSON.parse(rawValue);
      return Array.isArray(parsedValue) ? new Set<string>(parsedValue) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }

  private saveDeletedAgentIds(agentIds: Set<string>): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.deletedAgentsKey, JSON.stringify([...agentIds]));
  }

  private formatAuditTimestamp(value: Date): string {
    return value.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  private resolveAccent(category: string): AgentSummary['accent'] {
    const normalizedCategory = category.toLowerCase();
    if (normalizedCategory.includes('payroll') || normalizedCategory.includes('knowledge')) {
      return 'blue';
    }
    if (normalizedCategory.includes('talent') || normalizedCategory.includes('workforce')) {
      return 'orange';
    }
    if (normalizedCategory.includes('skill') || normalizedCategory.includes('leadership')) {
      return 'purple';
    }
    if (normalizedCategory.includes('finance') || normalizedCategory.includes('compliance')) {
      return 'gray';
    }
    return 'teal';
  }

  private readonly mockAgents: AgentSummary[] = [
    {
      id: 'agt-001',
      icon: 'product-adoption',
      sessions: 115,
      name: 'Product Adoption Agent',
      description: 'This agent looks at the Darwinbox client adoption metrics data and gives out recommendations.',
      category: 'Integration Au...',
      status: 'Active',
      updatedLabel: '2 days ago',
      accent: 'red',
    },
    {
      id: 'agt-002',
      icon: 'payroll-compliance',
      sessions: 25,
      name: 'Payroll Compliance Agent',
      description: 'Monitors payroll data to ensure compliance with local labor laws and tax regulations, flagging risks.',
      category: 'HR Payroll',
      status: 'Active',
      updatedLabel: '5 days ago',
      accent: 'blue',
    },
    {
      id: 'agt-003',
      icon: 'employee-engagement',
      sessions: 102,
      name: 'Employee Engagement Agent',
      description: 'Analyzes employee survey feedback to provide actionable insights on engagement levels and culture.',
      category: 'Communicat...',
      status: 'Draft',
      updatedLabel: '2 weeks ago',
      accent: 'teal',
    },
    {
      id: 'agt-004',
      icon: 'talent-acquisition',
      sessions: 524,
      name: 'Talent Acquisition Agent',
      description: 'Evaluates hiring pipeline metrics and recommends strategies to reduce time-to-fill and improve quality.',
      category: 'Talent',
      status: 'Active',
      updatedLabel: '1 week ago',
      accent: 'orange',
    },
    {
      id: 'agt-005',
      icon: 'learning-development',
      sessions: 340,
      name: 'Learning and Development Agent',
      description: 'Tracks employee training progress and suggests personalized learning paths based on skill gaps.',
      category: 'Skills Develop...',
      status: 'Active',
      updatedLabel: '12 days ago',
      accent: 'purple',
    },
    {
      id: 'agt-006',
      icon: 'attendance-management',
      sessions: 16,
      name: 'Attendance Management Agent',
      description: 'Analyzes attendance patterns to identify anomalies and recommend policy adjustments.',
      category: 'HR Policies',
      status: 'Active',
      updatedLabel: '25 days ago',
      accent: 'teal',
    },
    {
      id: 'agt-007',
      icon: 'performance-review',
      sessions: 25,
      name: 'Performance Review Agent',
      description: 'Automates collection and analysis of performance feedback for continuous development planning.',
      category: 'Performance...',
      status: 'Active',
      updatedLabel: '4 days ago',
      accent: 'gray',
    },
    {
      id: 'agt-008',
      icon: 'benefits-optimization',
      sessions: 88,
      name: 'Benefits Optimization Agent',
      description: 'Benchmarks benefits usage trends and recommends policy improvements for utilization and retention.',
      category: 'Benefits',
      status: 'Active',
      updatedLabel: '3 days ago',
      accent: 'blue',
    },
    {
      id: 'agt-009',
      icon: 'policy-compliance',
      sessions: 54,
      name: 'Policy Compliance Agent',
      description: 'Scans policy exceptions and alerts owners when approvals or acknowledgments are overdue.',
      category: 'HR Policies',
      status: 'Deactivated',
      updatedLabel: '6 days ago',
      accent: 'gray',
    },
    {
      id: 'agt-010',
      icon: 'workforce-planning',
      sessions: 210,
      name: 'Workforce Planning Agent',
      description: 'Forecasts demand and supply trends to support quarterly headcount and hiring decisions.',
      category: 'Workforce',
      status: 'Active',
      updatedLabel: '9 days ago',
      accent: 'orange',
    },
    {
      id: 'agt-011',
      icon: 'attrition-risk',
      sessions: 12,
      name: 'Attrition Risk Agent',
      description: 'Identifies attrition signals from engagement and manager patterns and prioritizes interventions.',
      category: 'Retention',
      status: 'Draft',
      updatedLabel: '11 days ago',
      accent: 'red',
    },
    {
      id: 'agt-012',
      icon: 'candidate-screening',
      sessions: 436,
      name: 'Candidate Screening Agent',
      description: 'Scores applicant fit using skills and experience signals to speed up recruiter shortlisting.',
      category: 'Talent',
      status: 'Active',
      updatedLabel: '13 days ago',
      accent: 'teal',
    },
    {
      id: 'agt-013',
      icon: 'goal-alignment',
      sessions: 73,
      name: 'Goal Alignment Agent',
      description: 'Maps goals across teams and highlights dependency conflicts before performance cycles.',
      category: 'Goals',
      status: 'Active',
      updatedLabel: '15 days ago',
      accent: 'purple',
    },
    {
      id: 'agt-014',
      icon: 'internal-mobility',
      sessions: 9,
      name: 'Internal Mobility Agent',
      description: 'Surfaces role opportunities based on skills, aspirations, and manager recommendations.',
      category: 'Mobility',
      status: 'Draft',
      updatedLabel: '18 days ago',
      accent: 'blue',
    },
    {
      id: 'agt-015',
      icon: 'onboarding-coach',
      sessions: 151,
      name: 'Onboarding Coach Agent',
      description: 'Guides new hires through milestones, nudges managers, and tracks completion confidence.',
      category: 'Onboarding',
      status: 'Active',
      updatedLabel: '21 days ago',
      accent: 'teal',
    },
    {
      id: 'agt-016',
      icon: 'expense-audit',
      sessions: 64,
      name: 'Expense Audit Agent',
      description: 'Flags claim anomalies by policy, amount patterns, and missing supporting documents.',
      category: 'Finance',
      status: 'Active',
      updatedLabel: '22 days ago',
      accent: 'gray',
    },
    {
      id: 'agt-017',
      icon: 'shift-forecasting',
      sessions: 21,
      name: 'Shift Forecasting Agent',
      description: 'Predicts workforce coverage gaps and proposes optimized schedules for demand-heavy periods.',
      category: 'Scheduling',
      status: 'Draft',
      updatedLabel: '24 days ago',
      accent: 'orange',
    },
    {
      id: 'agt-018',
      icon: 'knowledge-retrieval',
      sessions: 298,
      name: 'Knowledge Retrieval Agent',
      description: 'Indexes playbooks and SOPs to answer policy and process questions for frontline teams.',
      category: 'Knowledge',
      status: 'Active',
      updatedLabel: '26 days ago',
      accent: 'blue',
    },
    {
      id: 'agt-019',
      icon: 'manager-copilot',
      sessions: 412,
      name: 'Manager Copilot Agent',
      description: 'Prepares manager briefings with team trends, talking points, and coaching opportunities.',
      category: 'Leadership',
      status: 'Active',
      updatedLabel: '4 weeks ago',
      accent: 'purple',
    },
    {
      id: 'agt-020',
      icon: 'sentiment-watch',
      sessions: 18,
      name: 'Sentiment Watch Agent',
      description: 'Monitors pulse feedback and flags sentiment shifts by department and engagement driver.',
      category: 'Engagement',
      status: 'Draft',
      updatedLabel: '5 weeks ago',
      accent: 'red',
    },
    {
      id: 'agt-021',
      icon: 'compliance-narrator',
      sessions: 140,
      name: 'Compliance Narrator Agent',
      description: 'Summarizes regulatory changes and converts updates into task-ready guidance for teams.',
      category: 'Compliance',
      status: 'Active',
      updatedLabel: '6 weeks ago',
      accent: 'gray',
    },
  ];

  private readonly mockLogs: AgentLogEntry[] = [
    {
      id: 'log-001',
      agentId: 'agt-001',
      level: 'info',
      message: 'Recommendation run completed.',
      timestamp: '2026-05-28T08:45:00Z',
    },
    {
      id: 'log-002',
      agentId: 'agt-003',
      level: 'warning',
      message: 'Draft agent invoked without knowledge base.',
      timestamp: '2026-05-27T16:00:00Z',
    },
  ];
}
