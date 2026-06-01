import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, computed, input, output, signal } from '@angular/core';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../spartan/sds-button';
import { SdsInputDirective } from '../spartan/sds-form';

export type SdsCatalogKind = 'tools' | 'knowledgeBases' | 'skills';

export interface SdsCatalogCategory {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  meta?: string;
}

export interface SdsCatalogItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  metadata?: string;
  categoryId?: string;
  group?: string;
  icon?: string;
}

export interface SdsCatalogSelectionEvent {
  kind: SdsCatalogKind;
  ids: string[];
}

interface CatalogItemGroup {
  title: string;
  items: SdsCatalogItem[];
}

@Component({
  selector: 'app-sds-catalog-picker-dialog',
  standalone: true,
  imports: [CommonModule, SdsIconComponent, SdsButtonComponent, SdsIconButtonComponent, SdsInputDirective],
  templateUrl: './sds-catalog-picker.component.html',
  styleUrls: ['./sds-catalog-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsCatalogPickerDialogComponent implements OnInit {
  @ViewChild('catalogSearchInput') private readonly catalogSearchInput?: ElementRef<HTMLInputElement>;
  readonly kind = input.required<SdsCatalogKind>();
  readonly title = input.required<string>();
  readonly items = input.required<readonly SdsCatalogItem[]>();
  readonly categories = input<readonly SdsCatalogCategory[]>([]);
  readonly selectedIds = input<readonly string[]>([]);
  readonly manageLabel = input.required<string>();
  readonly confirmLabel = input.required<string>();
  readonly showCountInTitle = input(false);

  readonly closeDialog = output<void>();
  readonly selectionDone = output<SdsCatalogSelectionEvent>();

  readonly searchOpen = signal(false);
  readonly searchTerm = signal('');
  readonly activeCategoryId = signal<string | null>(null);
  readonly draftSelectedIds = signal<Set<string>>(new Set());

  readonly selectionCount = computed(() => this.draftSelectedIds().size);
  readonly resolvedTitle = computed(() => {
    const count = this.selectionCount();
    return this.showCountInTitle() && count > 0 ? `${this.title()} (${count})` : this.title();
  });

  readonly filteredItems = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const activeCategoryId = this.activeCategoryId();
    const categoryFilter = activeCategoryId && activeCategoryId !== 'all' ? activeCategoryId : null;

    return this.items().filter((item) => {
      const matchesCategory = !categoryFilter || item.categoryId === categoryFilter;
      const searchable = `${item.title} ${item.description} ${item.badge ?? ''} ${item.metadata ?? ''}`.toLowerCase();
      return matchesCategory && (!term || searchable.includes(term));
    });
  });

  readonly groupedItems = computed<CatalogItemGroup[]>(() => {
    const groups = new Map<string, SdsCatalogItem[]>();

    for (const item of this.filteredItems()) {
      const title = item.group ?? '';
      groups.set(title, [...(groups.get(title) ?? []), item]);
    }

    return [...groups.entries()].map(([title, items]) => ({ title, items }));
  });

  ngOnInit(): void {
    this.draftSelectedIds.set(new Set(this.selectedIds()));
    this.activeCategoryId.set(this.categories()[0]?.id ?? null);
  }

  toggleSearch(): void {
    this.searchOpen.update((open) => !open);
    if (this.searchOpen()) {
      setTimeout(() => this.catalogSearchInput?.nativeElement.focus(), 0);
      return;
    }
    this.searchTerm.set('');
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.searchTerm.set('');
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  selectCategory(categoryId: string): void {
    this.activeCategoryId.set(categoryId);
  }

  toggleItem(itemId: string): void {
    this.draftSelectedIds.update((current) => {
      const next = new Set(current);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }

  commitSelection(): void {
    this.selectionDone.emit({ kind: this.kind(), ids: [...this.draftSelectedIds()] });
  }

  isSelected(itemId: string): boolean {
    return this.draftSelectedIds().has(itemId);
  }

  trackCategory(index: number, category: SdsCatalogCategory): string {
    return `${index}-${category.id}`;
  }

  trackGroup(index: number, group: CatalogItemGroup): string {
    return `${index}-${group.title}`;
  }

  trackItem(index: number, item: SdsCatalogItem): string {
    return `${index}-${item.id}`;
  }
}
