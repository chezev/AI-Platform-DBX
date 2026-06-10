import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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

type SkillType = 'Platform' | 'Custom';
type TypeFilter = 'all' | 'platform' | 'custom';
type ViewMode = 'grid' | 'list';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  type: SkillType;
  usedBy: number;
  createdOn: string;
}

const TS = '27/01/2026, 11:54:12 PM';

@Component({
  selector: 'app-skill-registry',
  standalone: true,
  imports: [
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
  templateUrl: './skill-registry.component.html',
  styleUrl: './skill-registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillRegistryComponent {
  readonly typeOptions = [
    { label: 'All', value: 'all' as TypeFilter },
    { label: 'Platform', value: 'platform' as TypeFilter },
    { label: 'Custom', value: 'custom' as TypeFilter },
  ];

  readonly searchValue = signal('');
  readonly typeFilter = signal<TypeFilter>('all');
  readonly viewMode = signal<ViewMode>('grid');
  readonly openMenuId = signal<string | null>(null);
  readonly menuPos = signal<{ top: number; right: number } | null>(null);
  readonly pendingDelete = signal<Skill | null>(null);

  private readonly items = signal<Skill[]>([
    { id: 's-1', name: 'BRD Generator', description: 'Draft Darwinbox Amplify BRDs through a clarification-first discovery workflow grounded in scope.', category: 'Onboarding', type: 'Custom', usedBy: 12, createdOn: TS },
    { id: 's-2', name: 'Learning Management and Integration', description: 'Facilitate seamless embedding of learning modules, certification tracking, and progress analytics.', category: 'HRMS Payroll', type: 'Platform', usedBy: 5, createdOn: TS },
    { id: 's-3', name: 'Talent Acquisition Hub', description: 'Manage end-to-end recruitment pipelines with integrated candidate scoring and interview scheduling.', category: 'Recruitment', type: 'Platform', usedBy: 0, createdOn: TS },
    { id: 's-4', name: 'Employee Self-Service Portal', description: 'Develop a branded, intuitive portal allowing employees to update personal information and submit requests.', category: 'Employee Engagement', type: 'Platform', usedBy: 21, createdOn: TS },
    { id: 's-5', name: 'Branding Toolkit', description: 'Apply corporate branding consistently across all modules and user interfaces through customizable themes.', category: 'User Experience', type: 'Platform', usedBy: 30, createdOn: TS },
    { id: 's-6', name: 'Workflow Automator', description: 'Design and implement automated workflows that streamline HR processes by integrating multiple modules.', category: 'Process Optimization', type: 'Platform', usedBy: 11, createdOn: TS },
    { id: 's-7', name: 'Performance Review Engine', description: 'Configure multi-rater feedback cycles with goal alignment, automated reminders, and analytics dashboards.', category: 'Performance Management', type: 'Platform', usedBy: 45, createdOn: TS },
    { id: 's-8', name: 'Custom Report Builder', description: 'Create tailored reports using drag-and-drop components that leverage API data and complex filters.', category: 'Analytics', type: 'Platform', usedBy: 16, createdOn: TS },
    { id: 's-9', name: 'Compensation Configurator', description: 'Set up and maintain flexible compensation plans using predefined templates or fully customized rules.', category: 'Compensation & Benefits', type: 'Platform', usedBy: 2, createdOn: TS },
  ]);

  readonly currentTypeLabel = computed(
    () => this.typeOptions.find((o) => o.value === this.typeFilter())?.label ?? 'All',
  );

  readonly visible = computed<Skill[]>(() => {
    const term = this.searchValue().trim().toLowerCase();
    const type = this.typeFilter();
    return this.items().filter((skill) => {
      if (type !== 'all' && skill.type.toLowerCase() !== type) return false;
      return !term || skill.name.toLowerCase().includes(term) || skill.description.toLowerCase().includes(term);
    });
  });

  private readonly router = inject(Router);

  usedByLabel(skill: Skill): string {
    return `${skill.usedBy} agent${skill.usedBy === 1 ? '' : 's'}`;
  }

  openSkill(skill: Skill): void {
    void this.router.navigate(['/agent-resources/skill-registry/new'], {
      queryParams: { id: skill.id, name: skill.name },
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
  }

  onTypeFilterChange(value: string | null): void {
    if (value && this.typeOptions.some((o) => o.value === value)) {
      this.typeFilter.set(value as TypeFilter);
    }
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    const willOpen = this.openMenuId() !== id;
    if (willOpen) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.menuPos.set({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    this.openMenuId.set(willOpen ? id : null);
  }

  isMenuOpen(id: string): boolean {
    return this.openMenuId() === id;
  }

  onEdit(skill: Skill, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    void this.router.navigate(['/agent-resources/skill-registry/new'], {
      queryParams: { id: skill.id, name: skill.name, mode: 'edit' },
    });
  }

  requestDelete(skill: Skill, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.pendingDelete.set(skill);
  }

  confirmDelete(): void {
    const skill = this.pendingDelete();
    if (!skill) return;
    this.items.update((list) => list.filter((item) => item.id !== skill.id));
    this.pendingDelete.set(null);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  trackSkill(_index: number, skill: Skill): string {
    return skill.id;
  }

  @HostListener('document:click')
  @HostListener('window:scroll')
  closeMenu(): void {
    this.openMenuId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.pendingDelete()) {
      this.pendingDelete.set(null);
      return;
    }
    this.openMenuId.set(null);
  }
}
