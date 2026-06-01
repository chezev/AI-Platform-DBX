export type TraceStepType =
  | 'llm_call'
  | 'tool_call'
  | 'tool_result'
  | 'data_lookup'
  | 'file_parse'
  | 'validation'
  | 'condition_check'
  | 'retry'
  | 'error'
  | 'human_approval'
  | 'final_response';

export type TraceStatus = 'success' | 'running' | 'waiting' | 'failed' | 'retried' | 'skipped';

export interface TraceError {
  code?: string;
  message: string;
  details?: string;
}

export interface TraceRetry {
  attempt: number;
  maxAttempts: number;
  reason: string;
}

export interface TraceStep {
  id: string;
  responseId: string;
  sequence: number;
  type: TraceStepType;
  title: string;
  subtitle?: string;
  summary?: string;
  status: TraceStatus;
  timestamp: string;
  durationMs?: number;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown> | string;
  rawLog?: Record<string, unknown>;
  error?: TraceError;
  retry?: TraceRetry;
}

export interface TraceCase {
  id: string;
  label: string;
  scenario: string;
  samplePrompt: string;
  assistantResponse: string;
  steps: TraceStep[];
}

export interface TraceDebugResult {
  title: string;
  contextLabel: string;
  happened: string;
  issue: string;
  reason: string;
  fix: string;
  nextAction: string;
}
