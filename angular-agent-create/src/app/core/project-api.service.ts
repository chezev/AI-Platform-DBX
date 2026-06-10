import { Injectable, computed, signal } from '@angular/core';
import { CreateProjectInput, ProjectSummary } from './project-api.types';
import { DEFAULT_PROJECT_COLOR_ID } from './project-colors';
import { ProjectResource, RESOURCE_COUNT_FIELD, buildProjectResources } from './project-resources';

const CURRENT_USER = { name: 'Darwinbox Admin', empId: 'EMP0019' };

/** "2 Jun 2026 16:38" */
function formatTimestamp(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  const hh = `${date.getHours()}`.padStart(2, '0');
  const mm = `${date.getMinutes()}`.padStart(2, '0');
  return `${day} ${month} ${year} ${hh}:${mm}`;
}

interface ResourceCounts {
  flows?: number;
  tools?: number;
  kb?: number;
  skills?: number;
}

function seed(
  id: string,
  name: string,
  description: string | undefined,
  colorId: string,
  agentCount: number,
  iso: string,
  counts: ResourceCounts = {},
  createdBy = CURRENT_USER,
  updatedBy: { name: string; empId: string } | null = CURRENT_USER,
): ProjectSummary {
  const date = new Date(iso);
  return {
    id,
    name,
    description,
    colorId,
    agentCount,
    flowCount: counts.flows ?? 0,
    toolCount: counts.tools ?? 0,
    kbCount: counts.kb ?? 0,
    skillCount: counts.skills ?? 0,
    createdByName: createdBy.name,
    createdByEmpId: createdBy.empId,
    updatedByName: updatedBy?.name,
    updatedByEmpId: updatedBy?.empId,
    updatedOn: formatTimestamp(date),
    updatedAt: date.getTime(),
  };
}

const PURAB = { name: 'Purab Patni', empId: 'EMP2' };

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly projects = signal<ProjectSummary[]>([
    seed('prj-001', 'Leave Agents', 'Project to create and experiment with agents related to leave management.', 'green', 1, '2026-06-02T16:38:00', { flows: 1, tools: 2, kb: 1 }),
    seed('prj-002', 'Delivery Agents', undefined, 'green', 3, '2026-05-29T14:25:00', { flows: 2, tools: 3, kb: 2, skills: 1 }),
    seed('prj-003', 'MCP Servers', undefined, 'green', 3, '2026-05-27T14:40:00', { tools: 5, kb: 1, skills: 2 }),
    seed('prj-004', 'Gartner Demo', undefined, 'red', 1, '2026-05-26T18:46:00', { flows: 1, tools: 1 }),
    seed('prj-005', 'Knowledge agents', undefined, 'green', 4, '2026-05-25T15:00:00', { flows: 1, tools: 2, kb: 6, skills: 1 }),
    seed('prj-006', 'Amplify BRD Gen', 'Amplify BRD Gen', 'amber', 1, '2026-05-20T15:55:00', { tools: 1, kb: 1 }, PURAB, CURRENT_USER),
    seed('prj-007', 'Cortex AMA', undefined, 'purple', 2, '2026-05-16T10:50:00', { flows: 1, tools: 2, kb: 3 }),
    seed('prj-008', 'Integration Automation', 'BRD and Script Generation for Integration Use Cases', 'green', 4, '2026-05-15T13:50:00', { flows: 3, tools: 4, kb: 2, skills: 2 }),
    seed('prj-009', 'Adoption Agent', 'Get product adoption insights for Darwinbox Customers.', 'green', 1, '2026-05-15T11:48:00', { tools: 1, kb: 1 }),
    seed('prj-010', 'Onboarding Agent', undefined, 'green', 3, '2026-05-12T16:51:00', { flows: 2, tools: 1, kb: 1, skills: 1 }),
    seed('prj-011', 'BRD Generator', 'Integrations', 'purple', 0, '2026-05-10T13:07:00', { kb: 1 }, PURAB, null),
    seed('prj-012', 'Test', 'Test', 'purple', 25, '2026-05-09T11:12:00', { flows: 4, tools: 6, kb: 3, skills: 2 }, CURRENT_USER, null),
  ]);

  // Lazily generated, then cached so deletes persist within the session.
  private readonly resourcesByProject = signal<Record<string, ProjectResource[]>>({});

  readonly allProjects = computed(() => this.projects());
  readonly projectCount = computed(() => this.projects().length);

  getProject(projectId: string): ProjectSummary | undefined {
    return this.projects().find((project) => project.id === projectId);
  }

  /** Generate + cache a project's resources on first access (call before reading). */
  ensureProjectResources(projectId: string): void {
    if (this.resourcesByProject()[projectId]) {
      return;
    }
    const project = this.getProject(projectId);
    const resources = project ? buildProjectResources(project) : [];
    this.resourcesByProject.update((map) => ({ ...map, [projectId]: resources }));
  }

  getProjectResources(projectId: string): ProjectResource[] {
    return this.resourcesByProject()[projectId] ?? [];
  }

  deleteProjectResource(projectId: string, resourceId: string): void {
    const removed = this.getProjectResources(projectId).find((r) => r.id === resourceId);
    this.resourcesByProject.update((map) => ({
      ...map,
      [projectId]: (map[projectId] ?? []).filter((r) => r.id !== resourceId),
    }));

    // Keep the project's resource count (shown in the list view) in sync.
    if (removed) {
      const field = RESOURCE_COUNT_FIELD[removed.type];
      this.projects.update((list) =>
        list.map((project) =>
          project.id === projectId
            ? { ...project, [field]: Math.max(0, (project[field] as number) - 1) }
            : project,
        ),
      );
    }
  }

  createProject(input: CreateProjectInput): ProjectSummary {
    const now = new Date();
    const project: ProjectSummary = {
      id: `prj-${Date.now()}`,
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      colorId: input.colorId || DEFAULT_PROJECT_COLOR_ID,
      agentCount: 0,
      flowCount: 0,
      toolCount: 0,
      kbCount: 0,
      skillCount: 0,
      createdByName: CURRENT_USER.name,
      createdByEmpId: CURRENT_USER.empId,
      updatedByName: CURRENT_USER.name,
      updatedByEmpId: CURRENT_USER.empId,
      updatedOn: formatTimestamp(now),
      updatedAt: now.getTime(),
    };
    this.projects.update((list) => [project, ...list]);
    return project;
  }

  deleteProject(id: string): void {
    this.projects.update((list) => list.filter((project) => project.id !== id));
  }
}
