// Single source of truth for the product navigation. Change a label, route, or
// CTA here and it reflects everywhere the AppShell is used.

export interface ProductSectionCta {
  label: string;
  path: string;
}

export interface ProductSubTab {
  label: string;
  path: string;
  /** Per-tab CTA, overrides the section CTA when this tab is active. */
  cta?: ProductSectionCta;
}

export interface ProductSection {
  id: string;
  label: string;
  /** Section landing route (redirects to its first sub-tab). */
  path: string;
  tabs: ProductSubTab[];
  cta?: ProductSectionCta;
  /** Rendered in the bar but not yet routable (defined later). */
  disabled?: boolean;
}

export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    id: 'agent-hub',
    label: 'Agent Hub',
    path: '/agent-hub',
    cta: { label: 'Create Agent', path: '/agent-creation/startup' },
    tabs: [
      { label: 'Agents', path: '/agent-hub/agents' },
      { label: 'Projects', path: '/agent-hub/projects' },
      { label: 'Agentic Flows', path: '/agent-hub/agentic-flows' },
    ],
  },
  {
    id: 'agent-resources',
    label: 'Agent Resources',
    path: '/agent-resources',
    tabs: [
      { label: 'Tool Registry', path: '/agent-resources/tool-registry', cta: { label: 'Add Tool', path: '/agent-resources/tool-registry/new' } },
      { label: 'Skill Registry', path: '/agent-resources/skill-registry', cta: { label: 'Create Skill', path: '/agent-resources/skill-registry/new' } },
      { label: 'Knowledge Base', path: '/agent-resources/knowledge-base', cta: { label: 'New Knowledge Base', path: '/agent-resources/knowledge-base' } },
      { label: 'Agent Evals', path: '/agent-resources/agent-evals' },
    ],
  },
  {
    id: 'monitoring-hub',
    label: 'Monitoring Hub',
    path: '/monitoring-hub',
    cta: { label: 'Create Agent', path: '/agent-creation/startup' },
    tabs: [{ label: 'Agent Executions', path: '/monitoring-hub/agent-executions' }],
  },
  {
    id: 'credentials',
    label: 'Credentials',
    path: '/credentials',
    cta: { label: 'Create Agent', path: '/agent-creation/startup' },
    tabs: [
      { label: 'LLM Configs', path: '/credentials/llm-configs' },
      { label: 'App Credentials', path: '/credentials/app-credentials' },
    ],
  },
  {
    id: 'others',
    label: 'Others',
    path: '/others',
    tabs: [],
    disabled: true,
  },
];
