import { ProjectSummary } from './project-api.types';

export type ProjectResourceType = 'Agent' | 'Agentic Flow' | 'Tool' | 'Knowledge Base' | 'Skill';

export interface ProjectResource {
  id: string;
  name: string;
  type: ProjectResourceType;
  createdOn: string;
  updatedOn: string;
  ownerName: string;
  ownerEmpId: string;
}

const NAME_POOL: Record<ProjectResourceType, string[]> = {
  Agent: [
    'Onboarding Assistant',
    'Resume Parser',
    'Policy Checker',
    'Buddy Setup Agent',
    'Approval Router',
    'Query Responder',
    'Data Validator',
    'Escalation Handler',
  ],
  'Agentic Flow': [
    'New Hire Flow',
    'Approval Flow',
    'Escalation Flow',
    'Data Sync Flow',
    'Document Review Flow',
    'Notification Flow',
  ],
  Tool: [
    'update_employee_record',
    'send_notification',
    'fetch_candidate',
    'create_ticket',
    'search_policy',
    'generate_report',
    'validate_input',
  ],
  'Knowledge Base': [
    'HR Policy Handbook',
    'Onboarding SOPs',
    'Leave & Attendance Policy',
    'Compliance Guidelines',
    'Benefits FAQ',
    'Process Playbooks',
  ],
  Skill: [
    'Summarize Document',
    'Extract Entities',
    'Sentiment Analysis',
    'Translate Text',
    'Classify Intent',
    'Redact PII',
  ],
};

const OWNERS = [
  { name: 'Darwinbox Admin', empId: 'EMP0019' },
  { name: 'Purab Patni', empId: 'EMP2' },
];

const DAY = 86_400_000;

function fmt(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  const hh = `${date.getHours()}`.padStart(2, '0');
  const mm = `${date.getMinutes()}`.padStart(2, '0');
  return `${day} ${month} ${year} ${hh}:${mm}`;
}

/**
 * Deterministically derives the resource rows inside a project from its counts,
 * so the detail page stays in sync with the list view (and survives reloads).
 */
export function buildProjectResources(project: ProjectSummary): ProjectResource[] {
  const out: ProjectResource[] = [];
  const base = project.updatedAt;

  const addType = (type: ProjectResourceType, count: number) => {
    const pool = NAME_POOL[type];
    for (let i = 0; i < count; i++) {
      const created = new Date(base - (i + 2) * 3 * DAY);
      const updated = new Date(base - (i + 1) * DAY);
      const owner = OWNERS[(i + type.length) % OWNERS.length];
      out.push({
        id: `${project.id}-${type.replace(/\s/g, '').toLowerCase()}-${i + 1}`,
        name: pool[i % pool.length],
        type,
        createdOn: fmt(created),
        updatedOn: fmt(updated),
        ownerName: owner.name,
        ownerEmpId: owner.empId,
      });
    }
  };

  addType('Agent', project.agentCount);
  addType('Agentic Flow', project.flowCount);
  addType('Tool', project.toolCount);
  addType('Knowledge Base', project.kbCount);
  addType('Skill', project.skillCount);
  return out;
}

/** Maps a resource type back to the count field on the project summary. */
export const RESOURCE_COUNT_FIELD: Record<ProjectResourceType, keyof ProjectSummary> = {
  Agent: 'agentCount',
  'Agentic Flow': 'flowCount',
  Tool: 'toolCount',
  'Knowledge Base': 'kbCount',
  Skill: 'skillCount',
};
