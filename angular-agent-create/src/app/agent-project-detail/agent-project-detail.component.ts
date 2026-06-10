import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectApiService } from '../core/project-api.service';
import { ProjectResource, ProjectResourceType } from '../core/project-resources';
import { projectColor } from '../core/project-colors';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsIconButtonComponent, SdsButtonComponent } from '../shared/spartan/sds-button';
import { SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import {
  SdsSelectContentComponent,
  SdsSelectDirective,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';

type ResourceFilter = 'All' | ProjectResourceType;

// Where "View" / row-click takes each resource type (its registry/section list).
const VIEW_ROUTE: Record<ProjectResourceType, string> = {
  Agent: '/agent-hub/agents',
  'Agentic Flow': '/agent-hub/agentic-flows',
  Tool: '/agent-resources/tool-registry',
  'Knowledge Base': '/agent-resources/knowledge-base',
  Skill: '/agent-resources/skill-registry',
};

@Component({
  selector: 'app-agent-project-detail',
  standalone: true,
  imports: [
    RouterLink,
    SdsIconComponent,
    SdsIconButtonComponent,
    SdsButtonComponent,
    SdsSearchFieldDirective,
    SdsSelectContentComponent,
    SdsSelectDirective,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    SdsSelectTriggerComponent,
  ],
  templateUrl: './agent-project-detail.component.html',
  styleUrl: './agent-project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectApi = inject(ProjectApiService);

  readonly projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
  readonly filters: ResourceFilter[] = ['All', 'Agent', 'Agentic Flow', 'Tool', 'Knowledge Base', 'Skill'];

  readonly searchValue = signal('');
  readonly typeFilter = signal<ResourceFilter>('All');
  readonly openMenuId = signal<string | null>(null);
  // Fixed-position coordinates for the open action menu (escapes table clipping).
  readonly menuPos = signal<{ top: number; right: number } | null>(null);
  readonly pendingDeleteResource = signal<ProjectResource | null>(null);

  readonly project = computed(() => this.projectApi.getProject(this.projectId));
  private readonly allResources = computed(() => this.projectApi.getProjectResources(this.projectId));

  readonly resources = computed<ProjectResource[]>(() => {
    const term = this.searchValue().trim().toLowerCase();
    const type = this.typeFilter();
    return this.allResources().filter((resource) => {
      if (type !== 'All' && resource.type !== type) {
        return false;
      }
      return !term || resource.name.toLowerCase().includes(term);
    });
  });

  constructor() {
    this.projectApi.ensureProjectResources(this.projectId);
  }

  folderTint(colorId: string): string {
    return `color-mix(in srgb, ${projectColor(colorId).hex} 15%, #ffffff)`;
  }

  folderColor(colorId: string): string {
    return projectColor(colorId).hex;
  }

  readonly currentTypeLabel = computed(() => this.typeFilter());

  setFilter(filter: string | null): void {
    if (filter === 'All' || this.filters.includes(filter as ResourceFilter)) {
      this.typeFilter.set((filter as ResourceFilter) ?? 'All');
    }
  }

  /** Row-click / "View": open the resource's registry section. */
  openResource(resource: ProjectResource, event?: Event): void {
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }
    this.openMenuId.set(null);
    void this.router.navigate([VIEW_ROUTE[resource.type]]);
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
  }

  toggleMenu(resourceId: string, event: MouseEvent): void {
    event.stopPropagation();
    const willOpen = this.openMenuId() !== resourceId;
    if (willOpen) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.menuPos.set({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    this.openMenuId.set(willOpen ? resourceId : null);
  }

  isMenuOpen(resourceId: string): boolean {
    return this.openMenuId() === resourceId;
  }

  onAction(action: 'edit' | 'view' | 'delete', resource: ProjectResource, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    if (action === 'delete') {
      this.pendingDeleteResource.set(resource);
    } else if (action === 'view') {
      this.openResource(resource);
    }
    // 'edit' is a placeholder until per-resource edit screens exist.
  }

  confirmDelete(): void {
    const resource = this.pendingDeleteResource();
    if (!resource) {
      return;
    }
    this.projectApi.deleteProjectResource(this.projectId, resource.id);
    this.pendingDeleteResource.set(null);
  }

  cancelDelete(): void {
    this.pendingDeleteResource.set(null);
  }

  trackResource(_index: number, resource: ProjectResource): string {
    return resource.id;
  }

  @HostListener('document:click')
  @HostListener('window:scroll')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.pendingDeleteResource()) {
      this.pendingDeleteResource.set(null);
      return;
    }
    this.openMenuId.set(null);
  }
}
