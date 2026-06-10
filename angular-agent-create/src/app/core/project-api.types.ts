export interface ProjectColor {
  id: string;
  label: string;
  /** Base hue; folder tint + picker swatch are derived from this. */
  hex: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  /** References a ProjectColor.id (see PROJECT_COLORS). */
  colorId: string;
  agentCount: number;
  /** Other resources contained in the project (shown in the delete warning). */
  flowCount: number;
  toolCount: number;
  kbCount: number;
  skillCount: number;
  createdByName: string;
  createdByEmpId: string;
  updatedByName?: string;
  updatedByEmpId?: string;
  /** Display label, e.g. "2 Jun 2026 16:38". */
  updatedOn: string;
  /** Sortable timestamp (ms). */
  updatedAt: number;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  colorId: string;
}

export type ProjectSortKey = 'name' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';
