import { ChangeDetectionStrategy, Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectApiService } from '../core/project-api.service';
import { ProjectCreateState } from '../shared/app-shell/project-create-state';
import { ProjectSortKey, ProjectSummary, SortDirection } from '../core/project-api.types';
import { PROJECT_COLORS, DEFAULT_PROJECT_COLOR_ID, projectColor } from '../core/project-colors';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import { SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import { SdsInputDirective, SdsTextareaDirective } from '../shared/spartan/sds-form';

@Component({
  selector: 'app-agent-projects-list',
  standalone: true,
  imports: [
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsSearchFieldDirective,
    SdsInputDirective,
    SdsTextareaDirective,
  ],
  templateUrl: './agent-projects-list.component.html',
  styleUrl: './agent-projects-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentProjectsListComponent {
  private readonly projectApi = inject(ProjectApiService);
  private readonly projectCreate = inject(ProjectCreateState);
  private readonly router = inject(Router);

  readonly colors = PROJECT_COLORS;
  readonly searchValue = signal('');
  readonly sortKey = signal<ProjectSortKey>('updatedAt');
  readonly sortDir = signal<SortDirection>('desc');
  readonly openMenuId = signal<string | null>(null);
  // Fixed-position coordinates for the open action menu (escapes table clipping).
  readonly menuPos = signal<{ top: number; right: number } | null>(null);
  readonly pendingDeleteProject = signal<ProjectSummary | null>(null);

  // Create-project modal state.
  readonly isModalOpen = signal(false);
  readonly formName = signal('');
  readonly formDescription = signal('');
  readonly formColorId = signal(DEFAULT_PROJECT_COLOR_ID);

  constructor() {
    // The "New Project" CTA lives in the shell heading; open the modal when it fires.
    let seen = this.projectCreate.requested();
    effect(() => {
      const n = this.projectCreate.requested();
      if (n !== seen) {
        seen = n;
        this.openCreate();
      }
    });
  }

  readonly totalCount = this.projectApi.projectCount;

  readonly visibleProjects = computed<ProjectSummary[]>(() => {
    const term = this.searchValue().trim().toLowerCase();
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;

    const filtered = this.projectApi.allProjects().filter((project) => {
      if (!term) {
        return true;
      }
      return (
        project.name.toLowerCase().includes(term) ||
        (project.description?.toLowerCase().includes(term) ?? false)
      );
    });

    return [...filtered].sort((a, b) => {
      if (key === 'name') {
        return a.name.localeCompare(b.name) * dir;
      }
      return (a.updatedAt - b.updatedAt) * dir;
    });
  });

  readonly canCreate = computed(() => this.formName().trim().length > 0);

  onSearchInput(value: string): void {
    this.searchValue.set(value);
  }

  toggleSort(key: ProjectSortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set(key === 'name' ? 'asc' : 'desc');
    }
  }

  isSorted(key: ProjectSortKey): boolean {
    return this.sortKey() === key;
  }

  folderTint(colorId: string): string {
    return `color-mix(in srgb, ${projectColor(colorId).hex} 15%, #ffffff)`;
  }

  folderColor(colorId: string): string {
    return projectColor(colorId).hex;
  }

  openProject(project: ProjectSummary, event?: Event): void {
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }
    this.openMenuId.set(null);
    void this.router.navigate(['/agent-hub/projects', project.id]);
  }

  toggleMenu(projectId: string, event: MouseEvent): void {
    event.stopPropagation();
    const willOpen = this.openMenuId() !== projectId;
    if (willOpen) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.menuPos.set({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    this.openMenuId.set(willOpen ? projectId : null);
  }

  isMenuOpen(projectId: string): boolean {
    return this.openMenuId() === projectId;
  }

  requestDelete(project: ProjectSummary, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.pendingDeleteProject.set(project);
  }

  confirmDelete(): void {
    const project = this.pendingDeleteProject();
    if (!project) {
      return;
    }
    this.projectApi.deleteProject(project.id);
    this.pendingDeleteProject.set(null);
  }

  cancelDelete(): void {
    this.pendingDeleteProject.set(null);
  }

  /** Non-zero resource lines for the delete warning, e.g. "3 agents". */
  deleteResourceLines(project: ProjectSummary): string[] {
    const lines = [
      { count: project.agentCount, singular: 'agent', plural: 'agents' },
      { count: project.flowCount, singular: 'agentic flow', plural: 'agentic flows' },
      { count: project.toolCount, singular: 'tool', plural: 'tools' },
      { count: project.kbCount, singular: 'knowledge base', plural: 'knowledge bases' },
      { count: project.skillCount, singular: 'skill registry entry', plural: 'skill registry entries' },
    ];
    return lines
      .filter((line) => line.count > 0)
      .map((line) => `${line.count} ${line.count === 1 ? line.singular : line.plural}`);
  }

  hasResources(project: ProjectSummary): boolean {
    return this.deleteResourceLines(project).length > 0;
  }

  openCreate(): void {
    this.formName.set('');
    this.formDescription.set('');
    this.formColorId.set(DEFAULT_PROJECT_COLOR_ID);
    this.isModalOpen.set(true);
  }

  closeCreate(): void {
    this.isModalOpen.set(false);
  }

  selectColor(colorId: string): void {
    this.formColorId.set(colorId);
  }

  submitCreate(): void {
    if (!this.canCreate()) {
      return;
    }
    this.projectApi.createProject({
      name: this.formName(),
      description: this.formDescription(),
      colorId: this.formColorId(),
    });
    this.isModalOpen.set(false);
  }

  trackProject(index: number, project: ProjectSummary): string {
    return project.id;
  }

  @HostListener('document:click')
  @HostListener('window:scroll')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.pendingDeleteProject()) {
      this.pendingDeleteProject.set(null);
      return;
    }
    if (this.isModalOpen()) {
      this.isModalOpen.set(false);
      return;
    }
    this.openMenuId.set(null);
  }
}
