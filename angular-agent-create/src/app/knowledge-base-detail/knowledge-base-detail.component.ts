import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KbDocument, KbService } from '../core/kb.service';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
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

interface UploadingFile {
  name: string;
  docId: string;
  progress: number;
  done: boolean;
  failed: boolean;
}

interface ConnectorDef {
  name: string;
  desc: string;
  logo: string;
  group: 'SaaS Cloud' | 'SaaS Platform';
}

interface SourceChild {
  id: string;
  name: string;
  tokens: number;
  chunks: number;
}

interface DataSource {
  id: string;
  name: string;
  kind: 'local' | 'connector';
  logo?: string;
  children: SourceChild[];
}

interface SyncRun {
  configure: 'Manual' | 'Scheduled';
  upserts: number;
  deletes: number;
  errors: number;
  runTime: string;
  status: 'Success' | 'In progress' | 'Failed to Sync';
}

const LOGO = 'assets/logos/';
const CONNECTORS: ConnectorDef[] = [
  { name: 'Confluence', desc: 'Search, read, or create Confluence pages.', logo: LOGO + 'confluence.png', group: 'SaaS Cloud' },
  { name: 'Darwinbox Admin', desc: 'Perform secure admin actions in Darwinbox.', logo: LOGO + 'darwinbox.png', group: 'SaaS Cloud' },
  { name: 'Jira', desc: 'Create, update, or fetch Jira issues.', logo: LOGO + 'jira.svg', group: 'SaaS Cloud' },
  { name: 'Darwinbox Employee', desc: 'Fetch or update employee profile data.', logo: LOGO + 'darwinbox.png', group: 'SaaS Platform' },
  { name: 'Slack Connect', desc: 'Send team messages or workflow alerts.', logo: LOGO + 'slack.png', group: 'SaaS Platform' },
  { name: 'Teams Agent', desc: 'Send Teams messages or status updates.', logo: LOGO + 'teams.png', group: 'SaaS Platform' },
  { name: 'Whatsapp Agent', desc: 'Send WhatsApp messages or reminders.', logo: LOGO + 'whatsapp.png', group: 'SaaS Platform' },
  { name: 'ServiceNow Onboarding API', desc: 'Manage onboarding assignments & updates.', logo: LOGO + 'servicenow.png', group: 'SaaS Platform' },
];

const TS = '27/01/2026, 11:54:12 PM';
const SYNC_RUNS: SyncRun[] = [
  { configure: 'Manual', upserts: 0, deletes: 0, errors: 0, runTime: TS, status: 'Success' },
  { configure: 'Scheduled', upserts: 0, deletes: 0, errors: 0, runTime: TS, status: 'Success' },
  { configure: 'Manual', upserts: 11611, deletes: 0, errors: 0, runTime: TS, status: 'Success' },
  { configure: 'Manual', upserts: 0, deletes: 0, errors: 0, runTime: TS, status: 'Success' },
  { configure: 'Scheduled', upserts: 0, deletes: 0, errors: 0, runTime: TS, status: 'Success' },
  { configure: 'Scheduled', upserts: 0, deletes: 0, errors: 0, runTime: TS, status: 'In progress' },
  { configure: 'Manual', upserts: 256, deletes: 0, errors: 0, runTime: TS, status: 'Failed to Sync' },
];

@Component({
  selector: 'app-knowledge-base-detail',
  standalone: true,
  imports: [
    CommonModule,
    SdsAppTopbarComponent,
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
  templateUrl: './knowledge-base-detail.component.html',
  styleUrl: './knowledge-base-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly kbService = inject(KbService);
  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  readonly kbId = this.route.snapshot.paramMap.get('kbId') ?? '';
  readonly connectorCatalog = CONNECTORS;
  readonly syncRuns = SYNC_RUNS;
  readonly globalSearch = signal('');

  // ── Data sources (sidebar) ──
  readonly sources = signal<DataSource[]>([
    { id: 'local', name: 'Local Drive', kind: 'local', children: [{ id: 'upload', name: 'Upload', tokens: 0, chunks: 0 }] },
  ]);
  readonly selectedChildId = signal('upload');
  readonly sidebarKebabOpen = signal(false);

  readonly selectedChild = computed(() => {
    const id = this.selectedChildId();
    for (const s of this.sources()) {
      const child = s.children.find((c) => c.id === id);
      if (child) return { source: s, child };
    }
    return undefined;
  });
  readonly isUploadView = computed(() => this.selectedChildId() === 'upload');

  readonly typeOptions = ['All', 'PDF', 'Doc', 'PPTX', 'Text', 'CSV', 'XLSX'];
  readonly searchValue = signal('');
  readonly typeFilter = signal('All');

  readonly uploadMenuOpen = signal(false);
  readonly rowMenuId = signal<string | null>(null);
  readonly menuPos = signal<{ top: number; right: number } | null>(null);

  // ── Add connector modal (2-step wizard) ──
  readonly connectorModalOpen = signal(false);
  readonly connectorStep = signal<'connector' | 'credential'>('connector');
  readonly connectorSearch = signal('');
  readonly selectedConnector = signal<string | null>(null);

  readonly cloudConnectors = computed(() => this.filterConnectors('SaaS Cloud'));
  readonly platformConnectors = computed(() => this.filterConnectors('SaaS Platform'));

  // Step 2 — credential selection.
  readonly credMode = signal<'existing' | 'new'>('existing');
  readonly credentials = signal([
    { id: 'd55f12db-9a41-4c2e-8f3b-0e1a2b3c4d5e', name: 'Policy Docs', created: TS, lastUpdated: TS },
    { id: 'f1add8b9-2c33-4a5d-9b8e-7f6a5b4c3d2e', name: 'New Policy 2026', created: TS, lastUpdated: TS },
  ]);
  readonly selectedCredId = signal<string | null>('d55f12db-9a41-4c2e-8f3b-0e1a2b3c4d5e');
  // Add-new credential form.
  readonly credName = signal('Jira Connect');
  readonly authMode = signal<'secret' | 'cert'>('secret');
  readonly eventType = signal('new@newmail.com');
  readonly triggerEvent = signal('');
  readonly sharepointDir = signal('');

  readonly canConnect = computed(() => {
    if (this.credMode() === 'existing') return !!this.selectedCredId();
    return this.credName().trim().length > 0;
  });

  // Connector detail tab.
  readonly detailTab = signal<'sync' | 'documents'>('sync');

  // Paste-text modal.
  readonly pasteOpen = signal(false);
  readonly pasteName = signal('');
  readonly pasteText = signal('');
  readonly canSaveText = computed(() => this.pasteName().trim().length > 0 && this.pasteText().trim().length > 0);

  // Upload progress popup.
  readonly uploads = signal<UploadingFile[]>([]);
  readonly showUploads = signal(false);

  // Delete confirm.
  readonly pendingDelete = signal<KbDocument | null>(null);

  readonly kb = computed(() => this.kbService.getKb(this.kbId));

  readonly documents = computed<KbDocument[]>(() => {
    const term = this.searchValue().trim().toLowerCase();
    const type = this.typeFilter();
    return this.kbService.documents(this.kbId).filter((d) => {
      if (type !== 'All' && d.type !== type) return false;
      return !term || d.name.toLowerCase().includes(term);
    });
  });

  readonly hasDocuments = computed(() => this.kbService.documents(this.kbId).length > 0);

  constructor() {
    this.kbService.ensureDocuments(this.kbId);
  }

  private filterConnectors(group: 'SaaS Cloud' | 'SaaS Platform'): ConnectorDef[] {
    const term = this.connectorSearch().trim().toLowerCase();
    return CONNECTORS.filter((c) => c.group === group && (!term || c.name.toLowerCase().includes(term)));
  }

  goBack(): void {
    this.location.back();
  }

  exit(): void {
    void this.router.navigate(['/agent-resources/knowledge-base']);
  }

  selectChild(id: string): void {
    this.selectedChildId.set(id);
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
  }

  onTypeFilterChange(value: string | null): void {
    if (value) this.typeFilter.set(value);
  }

  // ── Add connector modal ──
  openConnectorModal(event?: MouseEvent): void {
    event?.stopPropagation();
    this.connectorSearch.set('');
    this.selectedConnector.set(null);
    this.connectorStep.set('connector');
    this.credMode.set('existing');
    this.connectorModalOpen.set(true);
  }

  closeConnectorModal(): void {
    this.connectorModalOpen.set(false);
  }

  selectConnector(name: string): void {
    this.selectedConnector.set(name);
  }

  goToCredentialStep(): void {
    if (this.selectedConnector()) {
      this.connectorStep.set('credential');
    }
  }

  selectCredential(id: string): void {
    this.selectedCredId.set(id);
  }

  deleteCredential(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.credentials.update((list) => list.filter((c) => c.id !== id));
    if (this.selectedCredId() === id) {
      this.selectedCredId.set(this.credentials()[0]?.id ?? null);
    }
  }

  confirmConnector(): void {
    const name = this.selectedConnector();
    if (!name || !this.canConnect()) return;
    const def = CONNECTORS.find((c) => c.name === name);
    const sourceId = `src-${Date.now()}`;
    const childA = `${sourceId}-a`;
    const childB = `${sourceId}-b`;
    const source: DataSource = {
      id: sourceId,
      name,
      kind: 'connector',
      logo: def?.logo,
      children: [
        { id: childA, name: 'Management Docs', tokens: 1223, chunks: 65 },
        { id: childB, name: 'Policy updates', tokens: 152, chunks: 1 },
      ],
    };
    this.sources.update((list) => [...list, source]);
    this.connectorModalOpen.set(false);
    this.detailTab.set('sync');
    this.selectedChildId.set(childA);
  }

  // ── Sidebar kebab (Delete all / Sync all for selected source) ──
  toggleSidebarKebab(event: MouseEvent): void {
    event.stopPropagation();
    this.sidebarKebabOpen.update((v) => !v);
  }

  syncAll(): void {
    this.sidebarKebabOpen.set(false);
  }

  deleteAllInSource(): void {
    this.sidebarKebabOpen.set(false);
    const sel = this.selectedChild();
    if (sel?.source.kind === 'connector') {
      this.sources.update((list) => list.filter((s) => s.id !== sel.source.id));
      this.selectedChildId.set('upload');
    }
  }

  // ── Upload menu ──
  toggleUploadMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.uploadMenuOpen.update((v) => !v);
  }

  triggerFilePicker(): void {
    this.uploadMenuOpen.set(false);
    this.fileInput?.nativeElement.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;
    this.startUploads(files.map((f) => f.name));
  }

  private startUploads(names: string[]): void {
    const items: UploadingFile[] = names.map((name) => ({
      name,
      docId: this.kbService.addUpload(this.kbId, name),
      progress: 0,
      done: false,
      failed: false,
    }));
    this.uploads.set(items);
    this.showUploads.set(true);

    items.forEach((item, i) => {
      // Deterministic-ish: a file whose name contains "fail" always fails, else ~1 in 4.
      const willFail = /fail/i.test(item.name) || Math.random() < 0.25;
      const tick = setInterval(() => {
        this.uploads.update((list) =>
          list.map((u) => (u.docId === item.docId ? { ...u, progress: Math.min(100, u.progress + 12 + Math.random() * 14) } : u)),
        );
        const current = this.uploads().find((u) => u.docId === item.docId);
        if (current && current.progress >= 100) {
          clearInterval(tick);
          if (willFail) {
            this.kbService.markFailed(this.kbId, item.docId);
            this.uploads.update((list) => list.map((u) => (u.docId === item.docId ? { ...u, progress: 100, failed: true } : u)));
          } else {
            this.kbService.markProcessed(this.kbId, item.docId);
            this.uploads.update((list) => list.map((u) => (u.docId === item.docId ? { ...u, progress: 100, done: true } : u)));
          }
        }
      }, 220 + i * 60);
    });
  }

  dismissUploads(): void {
    this.showUploads.set(false);
    this.uploads.set([]);
  }

  // ── Paste text modal ──
  openPaste(): void {
    this.uploadMenuOpen.set(false);
    this.pasteName.set('');
    this.pasteText.set('');
    this.pasteOpen.set(true);
  }

  closePaste(): void {
    this.pasteOpen.set(false);
  }

  savePaste(): void {
    if (!this.canSaveText()) return;
    this.kbService.addTextDocument(this.kbId, this.pasteName(), this.pasteText());
    this.pasteOpen.set(false);
  }

  // ── Row menu (Resync / Delete) ──
  toggleRowMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    const willOpen = this.rowMenuId() !== id;
    if (willOpen) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.menuPos.set({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    this.rowMenuId.set(willOpen ? id : null);
  }

  isRowMenuOpen(id: string): boolean {
    return this.rowMenuId() === id;
  }

  resync(doc: KbDocument, event: MouseEvent): void {
    event.stopPropagation();
    this.rowMenuId.set(null);
    this.kbService.setDocStatus(this.kbId, doc.id, 'In progress');
    setTimeout(() => this.kbService.markProcessed(this.kbId, doc.id), 1400);
  }

  requestDelete(doc: KbDocument, event: MouseEvent): void {
    event.stopPropagation();
    this.rowMenuId.set(null);
    this.pendingDelete.set(doc);
  }

  confirmDelete(): void {
    const doc = this.pendingDelete();
    if (!doc) return;
    this.kbService.deleteDocument(this.kbId, doc.id);
    this.pendingDelete.set(null);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  statusKey(status: string): string {
    return status.toLowerCase().replace(/ /g, '-');
  }

  trackDoc(_index: number, doc: KbDocument): string {
    return doc.id;
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.uploadMenuOpen.set(false);
    this.sidebarKebabOpen.set(false);
    this.rowMenuId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.connectorModalOpen()) {
      this.connectorModalOpen.set(false);
      return;
    }
    if (this.pendingDelete()) {
      this.pendingDelete.set(null);
      return;
    }
    if (this.pasteOpen()) {
      this.pasteOpen.set(false);
      return;
    }
    this.closeMenus();
  }
}
