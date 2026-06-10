import { ChangeDetectionStrategy, Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KbService, KnowledgeBase } from '../core/kb.service';
import { KbCreateState } from '../shared/app-shell/kb-create-state';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import { SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import { SdsInputDirective, SdsTextareaDirective } from '../shared/spartan/sds-form';
import {
  SdsSelectContentComponent,
  SdsSelectDirective,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';

type StatusFilter = 'all' | 'active' | 'draft';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsSearchFieldDirective,
    SdsInputDirective,
    SdsTextareaDirective,
    SdsSelectContentComponent,
    SdsSelectDirective,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    SdsSelectTriggerComponent,
  ],
  templateUrl: './knowledge-base.component.html',
  styleUrl: './knowledge-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseComponent {
  private readonly kbService = inject(KbService);
  private readonly kbCreate = inject(KbCreateState);
  private readonly router = inject(Router);

  readonly statusOptions = [
    { label: 'All', value: 'all' as StatusFilter },
    { label: 'Active', value: 'active' as StatusFilter },
    { label: 'Draft', value: 'draft' as StatusFilter },
  ];

  readonly searchValue = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly openMenuId = signal<string | null>(null);
  readonly menuPos = signal<{ top: number; right: number } | null>(null);
  readonly pendingDelete = signal<KnowledgeBase | null>(null);

  // Create drawer state.
  readonly isDrawerOpen = signal(false);
  readonly formName = signal('');
  readonly formDescription = signal('');
  readonly canCreate = computed(() => this.formName().trim().length > 0);

  constructor() {
    // The "New Knowledge Base" CTA lives in the shell heading.
    let seen = this.kbCreate.requested();
    effect(() => {
      const n = this.kbCreate.requested();
      if (n !== seen) {
        seen = n;
        this.openDrawer();
      }
    });
  }

  readonly currentStatusLabel = computed(
    () => this.statusOptions.find((o) => o.value === this.statusFilter())?.label ?? 'All',
  );

  readonly visible = computed<KnowledgeBase[]>(() => {
    const term = this.searchValue().trim().toLowerCase();
    const status = this.statusFilter();
    return this.kbService.allKbs().filter((kb) => {
      if (status === 'active' && kb.status !== 'Active') return false;
      if (status === 'draft' && kb.status !== 'Draft') return false;
      return !term || kb.name.toLowerCase().includes(term);
    });
  });

  onSearchInput(value: string): void {
    this.searchValue.set(value);
  }

  onStatusFilterChange(value: string | null): void {
    if (value === 'all' || value === 'active' || value === 'draft') {
      this.statusFilter.set(value);
    }
  }

  openKb(kb: KnowledgeBase): void {
    void this.router.navigate(['/agent-resources/knowledge-base', kb.id]);
  }

  // ── Create drawer ──
  openDrawer(): void {
    this.formName.set('');
    this.formDescription.set('');
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  submitCreate(): void {
    if (!this.canCreate()) return;
    const kb = this.kbService.createKb(this.formName(), this.formDescription());
    this.isDrawerOpen.set(false);
    void this.router.navigate(['/agent-resources/knowledge-base', kb.id]);
  }

  // ── Row menu ──
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

  onEdit(kb: KnowledgeBase, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.openKb(kb);
  }

  requestDelete(kb: KnowledgeBase, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.pendingDelete.set(kb);
  }

  confirmDelete(): void {
    const kb = this.pendingDelete();
    if (!kb) return;
    this.kbService.deleteKb(kb.id);
    this.pendingDelete.set(null);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  trackKb(_index: number, kb: KnowledgeBase): string {
    return kb.id;
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
    if (this.isDrawerOpen()) {
      this.isDrawerOpen.set(false);
      return;
    }
    this.openMenuId.set(null);
  }
}
