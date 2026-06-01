export type AgentStatus = 'Active' | 'Draft' | 'Deactivated';
export type AgentViewMode = 'grid' | 'list';
export type AgentFilterState = 'all' | 'active' | 'draft';

export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  projectName?: string;
  status: AgentStatus;
  createdOn?: string;
  updatedOn?: string;
  updatedBy?: string;
  updatedLabel: string;
  accent: 'red' | 'blue' | 'teal' | 'orange' | 'purple' | 'gray';
}

export interface AgentListQuery {
  search?: string;
  state?: AgentFilterState;
  view?: AgentViewMode;
}

export interface CreateAgentInput {
  name: string;
  description: string;
  category: string;
  projectName?: string;
  status?: AgentStatus;
  systemPrompt?: string;
  configuration?: Record<string, unknown>;
}

export interface UpdateAgentInput {
  name?: string;
  description?: string;
  category?: string;
  status?: AgentStatus;
  systemPrompt?: string;
}

export interface AgentLogEntry {
  id: string;
  agentId: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface LlmChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmChatRequest {
  agentId: string;
  model?: string;
  messages: LlmChatMessage[];
}

export interface LlmChatResponse {
  id: string;
  model: string;
  output: string;
  tokensIn: number;
  tokensOut: number;
}
